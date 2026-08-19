"""Cut a clip out of the recording and render it for a 9:16 feed.

The video itself is never altered beyond framing: no speed change, no zoom
wobble, no mirroring, no pitch shift. Those tricks do not defeat content
matching anyway, and they damage the very thing that makes a good selling
moment work. What we add is framing, captions and an information overlay.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from ..config import Config
from ..ffmpeg import FFmpegError, ffmpeg_bin, probe, run
from ..models import Segment


def escape_filter_path(path: str | Path) -> str:
    """Escape a path for use inside an ffmpeg filtergraph argument."""
    text = str(Path(path).resolve())
    text = text.replace("\\", "\\\\")
    text = text.replace(":", "\\:")
    text = text.replace("'", "\\'")
    text = text.replace("[", "\\[").replace("]", "\\]")
    text = text.replace(",", "\\,").replace(";", "\;")
    return text


@dataclass
class RenderPlan:
    source: str
    segment: Segment
    output: Path
    ass_path: Path | None = None


def build_video_filter(config: Config, ass_path: Path | None) -> tuple[str, str]:
    """Filtergraph that reframes to the target canvas and burns in text.

    Returns ``(filtergraph, output_label)``. Every stage gets a fresh label
    because ffmpeg rejects a graph that reuses one label as both an input and
    an output.
    """
    width = int(config.get("render.width", 1080))
    height = int(config.get("render.height", 1920))
    mode = str(config.get("render.reframe", "blur"))
    fps = config.get("render.fps")

    if mode == "cover":
        bias = min(1.0, max(0.0, float(config.get("render.crop_bias_x", 0.5))))
        chain = (
            f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height}:(iw-ow)*{bias:.4f}:(ih-oh)/2,setsar=1[v0]"
        )
    else:
        # Fit the whole frame, fill the margins with a blurred, darkened copy so
        # nothing in the original is cropped away.
        chain = (
            f"[0:v]split=2[bg][fg];"
            f"[bg]scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height},gblur=sigma=32,eq=brightness=-0.12[bgb];"
            f"[fg]scale={width}:{height}:force_original_aspect_ratio=decrease[fgs];"
            f"[bgb][fgs]overlay=(W-w)/2:(H-h)/2,setsar=1[v0]"
        )

    stages: list[str] = []
    if fps:
        stages.append(f"fps={float(fps):g}")
    if ass_path is not None:
        stages.append(f"ass='{escape_filter_path(ass_path)}'")

    label = "v0"
    for i, stage in enumerate(stages, start=1):
        chain += f";[{label}]{stage}[v{i}]"
        label = f"v{i}"
    return chain, label


def build_audio_filter(config: Config) -> str | None:
    if not bool(config.get("render.normalize_audio", True)):
        return None
    # -14 LUFS is the level short-form feeds expect; TP margin avoids clipping.
    return "loudnorm=I=-14:TP=-1.5:LRA=11"


def render_clip(
    source: str | Path,
    segment: Segment,
    output: str | Path,
    config: Config,
    ass_path: str | Path | None = None,
    title: str = "",
    overwrite: bool = True,
) -> Path:
    """Encode one clip. Returns the output path."""
    src = Path(source).expanduser()
    if not src.exists():
        raise FileNotFoundError(f"source video not found: {src}")

    out = Path(output).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and not overwrite:
        return out

    ass = Path(ass_path).expanduser() if ass_path else None
    if ass is not None and not ass.exists():
        raise FileNotFoundError(f"subtitle file not found: {ass}")

    info = probe(src)
    if segment.start >= info.duration:
        raise ValueError(
            f"clip starts at {segment.start:.1f}s but the recording is only "
            f"{info.duration:.1f}s long"
        )
    duration = min(segment.duration, info.duration - segment.start)
    video_filter, video_label = build_video_filter(config, ass)

    args = [
        ffmpeg_bin(), "-hide_banner", "-loglevel", "error",
        "-y" if overwrite else "-n",
        "-ss", f"{segment.start:.3f}",
        "-t", f"{duration:.3f}",
        "-i", str(src),
        "-filter_complex", video_filter,
        "-map", f"[{video_label}]",
    ]

    if info.has_audio:
        audio_filter = build_audio_filter(config)
        args += ["-map", "0:a:0"]
        if audio_filter:
            args += ["-af", audio_filter]
        args += ["-c:a", "aac", "-b:a", str(config.get("render.audio_bitrate", "160k")), "-ar", "44100"]
    else:
        args += ["-an"]

    # Drop the recorder's metadata, then write our own so the file is
    # self-describing in the operator's library.
    args += [
        "-map_metadata", "-1",
        "-metadata", f"title={title or out.stem}",
        "-metadata", "comment=Clip from own TikTok LIVE recording",
        "-c:v", "libx264",
        "-preset", str(config.get("render.preset", "medium")),
        "-crf", str(config.get("render.crf", 20)),
        "-profile:v", "high", "-level", "4.1",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(out),
    ]

    try:
        run(args, timeout=3600)
    except FFmpegError as exc:
        raise FFmpegError(f"failed to render {out.name}: {exc}") from exc

    if not out.exists() or out.stat().st_size == 0:
        raise FFmpegError(f"ffmpeg produced no output for {out.name}")
    return out


def extract_thumbnail(
    source: str | Path, at: float, output: str | Path, config: Config
) -> Path:
    """Grab a single frame, reframed the same way as the clip."""
    out = Path(output).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    video_filter, video_label = build_video_filter(config, None)
    args = [
        ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y",
        "-ss", f"{max(0.0, at):.3f}", "-i", str(source),
        "-filter_complex", video_filter,
        "-map", f"[{video_label}]", "-frames:v", "1", "-q:v", "3", str(out),
    ]
    run(args, timeout=300)
    return out
