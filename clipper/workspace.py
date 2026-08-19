"""Finding live sessions on disk, for the point-and-click front ends.

Kept free of any UI toolkit so both the Colab notebook and the local web app
share one tested implementation of "which folders hold a usable live session".
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

from .ingest.drive import DATA_SUFFIXES, VIDEO_SUFFIXES, parse_date_in_name

# Folders that never hold a live recording, skipped while scanning.
SKIP_DIRS = {
    ".git", ".ipynb_checkpoints", "__pycache__", "node_modules",
    ".Trash", ".tmp.driveupload", ".shortcut-targets-by-id", "klip",
}


def human_size(num_bytes: float) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if num_bytes < 1024 or unit == "TB":
            return f"{num_bytes:,.0f} {unit}" if unit in ("B", "KB") else f"{num_bytes:,.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


TRANSCRIPT_SUFFIXES = {".srt", ".json", ".vtt"}


@dataclass
class FoundSession:
    """A folder that holds both a recording and a performance report."""

    folder: Path
    video: Path | None
    performance: Path | None
    live_date: date | None = None
    # An existing subtitle/transcript file, used instead of re-transcribing.
    transcript: Path | None = None

    @property
    def ready(self) -> bool:
        return self.video is not None and self.performance is not None

    @property
    def label(self) -> str:
        name = self.folder.name or str(self.folder)
        if self.ready:
            return f"{name}  ({human_size(self.video.stat().st_size)})"
        missing = []
        if self.video is None:
            missing.append("video")
        if self.performance is None:
            missing.append("data performa")
        return f"{name}  (kurang: {', '.join(missing)})"

    @property
    def session_id(self) -> str:
        if self.live_date:
            return self.live_date.isoformat()
        return self.folder.name or "sesi"

    def describe(self) -> list[str]:
        lines = []
        if self.video:
            lines.append(f"Video  : {self.video.name} ({human_size(self.video.stat().st_size)})")
        else:
            lines.append("Video  : tidak ditemukan di folder ini")
        if self.performance:
            lines.append(f"Data   : {self.performance.name}")
        else:
            lines.append("Data   : tidak ditemukan di folder ini")
        if self.transcript:
            lines.append(f"Teks   : {self.transcript.name} (dipakai, tidak transkrip ulang)")
        return lines


def _pick_video(files: list[Path]) -> Path | None:
    candidates = [f for f in files if f.suffix.lower() in VIDEO_SUFFIXES]
    return max(candidates, key=lambda f: f.stat().st_size) if candidates else None


def _pick_performance(files: list[Path]) -> Path | None:
    candidates = [f for f in files if f.suffix.lower() in DATA_SUFFIXES]
    return max(candidates, key=lambda f: f.stat().st_mtime) if candidates else None


def _pick_transcript(files: list[Path]) -> Path | None:
    """An .srt/.vtt sitting beside the video, or a transcript.json we wrote."""
    subs = [f for f in files if f.suffix.lower() in {".srt", ".vtt"}]
    if subs:
        return max(subs, key=lambda f: f.stat().st_size)
    named = [f for f in files if f.suffix.lower() == ".json" and "transkrip" in f.name.lower()]
    named += [f for f in files if f.suffix.lower() == ".json" and "transcript" in f.name.lower()]
    return named[0] if named else None


def inspect_folder(folder: str | Path) -> FoundSession:
    """Look at one folder (not its subfolders) and report what it holds."""
    root = Path(folder).expanduser()
    files = [p for p in root.iterdir() if p.is_file()] if root.is_dir() else []

    video = _pick_video(files)
    perf = _pick_performance(files)
    transcript = _pick_transcript(files)

    live_date = parse_date_in_name(root.name)
    if live_date is None and video is not None:
        live_date = parse_date_in_name(video.name)
    if live_date is None and perf is not None:
        live_date = parse_date_in_name(perf.name)

    return FoundSession(folder=root, video=video, performance=perf,
                        live_date=live_date, transcript=transcript)


def scan(root: str | Path, max_depth: int = 4, limit: int = 400) -> list[FoundSession]:
    """Find every folder under ``root`` that contains a recording.

    Depth-limited and count-limited so scanning a whole Google Drive stays
    quick rather than walking every folder the user owns.
    """
    base = Path(root).expanduser()
    if not base.is_dir():
        return []

    found: list[FoundSession] = []
    seen_videos: set[Path] = set()
    queue: list[tuple[Path, int]] = [(base, 0)]

    while queue and len(found) < limit:
        folder, depth = queue.pop(0)
        try:
            entries = list(folder.iterdir())
        except (PermissionError, OSError):
            continue

        session = inspect_folder(folder)
        # Partial folders are listed too, labelled with what is missing, so an
        # upload still in progress reads as "kurang: video" rather than simply
        # vanishing from the list.
        if session.video is not None:
            if session.video not in seen_videos:
                seen_videos.add(session.video)
                found.append(session)
        elif session.performance is not None:
            found.append(session)

        if depth < max_depth:
            for entry in entries:
                if entry.is_dir() and entry.name not in SKIP_DIRS and not entry.name.startswith("."):
                    queue.append((entry, depth + 1))

    # Ready sessions first, then newest date first, then by name.
    found.sort(
        key=lambda s: (
            not s.ready,
            -(s.live_date.toordinal() if s.live_date else 0),
            str(s.folder).lower(),
        )
    )
    return found


def drive_roots() -> list[Path]:
    """Likely Google Drive mount points, in the order worth trying."""
    candidates = [
        Path("/content/drive/MyDrive"),          # Colab
        Path("/content/drive/My Drive"),
        Path.home() / "Google Drive" / "My Drive",
        Path.home() / "Google Drive",
        Path.home() / "GoogleDrive",
        Path("/Volumes/GoogleDrive/My Drive"),   # macOS legacy client
        Path.home() / "Library" / "CloudStorage",
    ]
    return [p for p in candidates if p.is_dir()]


def default_root() -> Path:
    roots = drive_roots()
    return roots[0] if roots else Path.home()
