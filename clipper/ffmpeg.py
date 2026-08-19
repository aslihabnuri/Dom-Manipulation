"""Thin wrapper around the ffmpeg/ffprobe binaries."""

from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Sequence


class FFmpegError(RuntimeError):
    """An ffmpeg/ffprobe invocation failed."""


@lru_cache(maxsize=1)
def ffmpeg_bin() -> str:
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:  # bundled fallback, so a pip install is enough on a bare machine
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    raise FFmpegError(
        "ffmpeg not found. Install it (macOS: brew install ffmpeg, "
        "Ubuntu: sudo apt install ffmpeg) or run: pip install imageio-ffmpeg"
    )


@lru_cache(maxsize=1)
def ffprobe_bin() -> str | None:
    return shutil.which("ffprobe")


def run(args: Sequence[str], capture: bool = True, timeout: int | None = None) -> str:
    """Run a command, raising ``FFmpegError`` with real stderr on failure."""
    try:
        proc = subprocess.run(
            list(args),
            stdout=subprocess.PIPE if capture else None,
            stderr=subprocess.PIPE,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired as exc:
        raise FFmpegError(f"timed out after {timeout}s: {' '.join(args[:3])}...") from exc

    if proc.returncode != 0:
        stderr = (proc.stderr or b"").decode("utf-8", errors="replace")
        tail = "\n".join(stderr.strip().splitlines()[-12:])
        raise FFmpegError(f"command failed ({proc.returncode}):\n{tail}")
    return (proc.stdout or b"").decode("utf-8", errors="replace")


def run_binary(args: Sequence[str], timeout: int | None = None) -> bytes:
    """Run a command and return raw stdout bytes (for piping PCM audio)."""
    try:
        proc = subprocess.run(
            list(args), stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout
        )
    except subprocess.TimeoutExpired as exc:
        raise FFmpegError(f"timed out after {timeout}s") from exc
    if proc.returncode != 0:
        stderr = (proc.stderr or b"").decode("utf-8", errors="replace")
        raise FFmpegError("\n".join(stderr.strip().splitlines()[-12:]))
    return proc.stdout or b""


@dataclass
class MediaInfo:
    path: str
    duration: float
    width: int
    height: int
    fps: float
    has_audio: bool

    @property
    def is_vertical(self) -> bool:
        return self.height >= self.width

    @property
    def aspect(self) -> float:
        return self.width / self.height if self.height else 0.0


def _parse_fps(rate: str) -> float:
    try:
        if "/" in rate:
            num, den = rate.split("/", 1)
            return float(num) / float(den) if float(den) else 0.0
        return float(rate)
    except (ValueError, ZeroDivisionError):
        return 0.0


def probe(path: str | Path) -> MediaInfo:
    """Read duration/resolution/fps, via ffprobe when present, else ffmpeg."""
    p = Path(path).expanduser()
    if not p.exists():
        raise FileNotFoundError(f"video not found: {p}")

    probe_bin = ffprobe_bin()
    if probe_bin:
        out = run([
            probe_bin, "-v", "error", "-print_format", "json",
            "-show_format", "-show_streams", str(p),
        ])
        data = json.loads(out)
        streams = data.get("streams", [])
        video = next((s for s in streams if s.get("codec_type") == "video"), None)
        audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
        if video is None:
            raise FFmpegError(f"no video stream in {p.name}")

        duration = float(data.get("format", {}).get("duration") or video.get("duration") or 0.0)
        return MediaInfo(
            path=str(p),
            duration=duration,
            width=int(video.get("width") or 0),
            height=int(video.get("height") or 0),
            fps=_parse_fps(str(video.get("avg_frame_rate") or video.get("r_frame_rate") or "0")),
            has_audio=audio is not None,
        )

    return _probe_via_ffmpeg(p)


def _probe_via_ffmpeg(p: Path) -> MediaInfo:
    """Fallback when only the ffmpeg binary is available (e.g. imageio-ffmpeg)."""
    import re

    proc = subprocess.run(
        [ffmpeg_bin(), "-hide_banner", "-i", str(p)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    text = (proc.stderr or b"").decode("utf-8", errors="replace")

    duration = 0.0
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", text)
    if m:
        duration = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

    width = height = 0
    fps = 0.0
    vm = re.search(r"Stream #\d+:\d+.*?: Video:.*?(\d{2,5})x(\d{2,5})", text, re.S)
    if vm:
        width, height = int(vm.group(1)), int(vm.group(2))
    fm = re.search(r"(\d+(?:\.\d+)?)\s*fps", text)
    if fm:
        fps = float(fm.group(1))

    if not width or not height:
        raise FFmpegError(f"could not read video dimensions from {p.name}")

    return MediaInfo(
        path=str(p), duration=duration, width=width, height=height,
        fps=fps, has_audio="Audio:" in text,
    )


def available() -> bool:
    try:
        ffmpeg_bin()
        return True
    except FFmpegError:
        return False
