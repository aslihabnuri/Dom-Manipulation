"""Speech-to-text for caption burn-in and intent detection.

faster-whisper is an optional dependency: without it the pipeline still runs,
it just falls back to audio-energy-only moment picking and skips captions.
"""

from __future__ import annotations

import json
from pathlib import Path

from .config import Config
from .models import Transcript, TranscriptSegment, TranscriptWord


class TranscriptionUnavailable(RuntimeError):
    """faster-whisper is not installed or no model could be loaded."""


def is_available() -> bool:
    try:
        import faster_whisper  # type: ignore  # noqa: F401

        return True
    except ImportError:
        return False


def transcribe(path: str | Path, config: Config, start: float = 0.0, duration: float | None = None) -> Transcript:
    """Transcribe a video (or a span of it) with word-level timestamps."""
    try:
        from faster_whisper import WhisperModel  # type: ignore
    except ImportError as exc:
        raise TranscriptionUnavailable(
            "faster-whisper is not installed -- run: pip install faster-whisper"
        ) from exc

    model_name = str(config.get("transcribe.model", "small"))
    language = str(config.get("transcribe.language", "id")) or None
    device = str(config.get("transcribe.device", "auto"))
    compute_type = str(config.get("transcribe.compute_type", "int8"))

    if device == "auto":
        device = "cpu"
        try:
            import torch  # type: ignore

            if torch.cuda.is_available():
                device, compute_type = "cuda", "float16"
        except ImportError:
            pass

    model = WhisperModel(model_name, device=device, compute_type=compute_type)

    kwargs = {
        "language": language,
        "word_timestamps": True,
        "vad_filter": True,
        "beam_size": 5,
    }
    if duration is not None:
        kwargs["clip_timestamps"] = [start, start + duration]

    segments, info = model.transcribe(str(path), **kwargs)

    out: list[TranscriptSegment] = []
    for seg in segments:
        words = [
            TranscriptWord(start=float(w.start), end=float(w.end), text=str(w.word).strip())
            for w in (getattr(seg, "words", None) or [])
            if w.start is not None and w.end is not None
        ]
        out.append(
            TranscriptSegment(
                start=float(seg.start), end=float(seg.end),
                text=str(seg.text).strip(), words=words,
            )
        )

    return Transcript(segments=out, language=getattr(info, "language", language or "id"))


def save(transcript: Transcript, path: str | Path) -> None:
    payload = {
        "language": transcript.language,
        "segments": [
            {
                "start": s.start, "end": s.end, "text": s.text,
                "words": [{"start": w.start, "end": w.end, "text": w.text} for w in s.words],
            }
            for s in transcript.segments
        ],
    }
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def load(path: str | Path) -> Transcript:
    """Load a transcript previously saved by :func:`save`, or an SRT file."""
    p = Path(path).expanduser()
    if p.suffix.lower() == ".srt":
        return load_srt(p)

    data = json.loads(p.read_text(encoding="utf-8"))
    segments = [
        TranscriptSegment(
            start=float(s["start"]), end=float(s["end"]), text=str(s.get("text", "")),
            words=[
                TranscriptWord(start=float(w["start"]), end=float(w["end"]), text=str(w["text"]))
                for w in s.get("words", [])
            ],
        )
        for s in data.get("segments", [])
    ]
    return Transcript(segments=segments, language=str(data.get("language", "id")))


def _srt_time(value: str) -> float:
    value = value.strip().replace(",", ".")
    hh, mm, ss = value.split(":")
    return int(hh) * 3600 + int(mm) * 60 + float(ss)


def load_srt(path: str | Path) -> Transcript:
    text = Path(path).expanduser().read_text(encoding="utf-8", errors="replace")
    segments: list[TranscriptSegment] = []

    for block in text.replace("\r\n", "\n").split("\n\n"):
        lines = [ln for ln in block.split("\n") if ln.strip()]
        if len(lines) < 2:
            continue
        timing = next((ln for ln in lines if "-->" in ln), None)
        if not timing:
            continue
        try:
            start_s, end_s = (_srt_time(x) for x in timing.split("-->"))
        except (ValueError, IndexError):
            continue
        body = " ".join(lines[lines.index(timing) + 1 :]).strip()
        if body:
            segments.append(TranscriptSegment(start=start_s, end=end_s, text=body))

    return Transcript(segments=segments)
