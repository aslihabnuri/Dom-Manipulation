"""Copy a recording off a network mount before working on it.

Google Drive in Colab is a FUSE mount. Reading a 2 GB recording through it once
is slow; this pipeline reads it many times over -- probing, measuring audio
levels per block, transcribing, then encoding each clip. Every one of those is a
seek plus a long read, and on FUSE they are slow enough to dominate the run and
occasionally drop the connection.

Copying once to local disk turns all of that into local reads. The copy costs a
few minutes; not copying costs far more.
"""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import Callable

# Paths under these roots are network mounts worth copying out of.
NETWORK_ROOTS = ("/content/drive", "/Volumes/GoogleDrive", "/gdrive")
NETWORK_HINTS = ("google drive", "googledrive", "cloudstorage", "onedrive", "dropbox")

# Below this size the copy is not worth the wait.
MIN_BYTES = 64 * 1024 * 1024

CHUNK = 32 * 1024 * 1024

Logger = Callable[[str], None]


def default_stage_dir() -> Path:
    """Fast local scratch: Colab's own disk when present, else the temp dir."""
    import tempfile

    content = Path("/content")
    if content.is_dir() and not is_network_path(content):
        return content / "clipper-kerja"
    return Path(tempfile.gettempdir()) / "clipper-kerja"


def is_network_path(path: str | Path) -> bool:
    """True when ``path`` looks like it sits on a mounted cloud drive."""
    text = str(Path(path).expanduser().resolve()).lower()
    if any(text.startswith(root) for root in NETWORK_ROOTS):
        return True
    return any(hint in text for hint in NETWORK_HINTS)


def free_bytes(folder: str | Path) -> int:
    target = Path(folder).expanduser()
    while not target.exists() and target != target.parent:
        target = target.parent
    return shutil.disk_usage(target).free


def should_stage(video: str | Path, dest_dir: str | Path, min_bytes: int = MIN_BYTES) -> tuple[bool, str]:
    """Decide whether to copy, and say why not when the answer is no."""
    src = Path(video).expanduser()
    if not src.exists():
        return False, "berkas tidak ditemukan"
    if not is_network_path(src):
        return False, "video sudah ada di disk lokal"

    size = src.stat().st_size
    if size < min_bytes:
        return False, "video cukup kecil, tidak perlu disalin"

    # Keep a margin: the clips and subtitle scratch land on the same disk.
    needed = size + 2 * 1024 * 1024 * 1024
    available = free_bytes(dest_dir)
    if available < needed:
        return False, (
            f"ruang lokal kurang ({available / 1024**3:.1f} GB tersedia, "
            f"butuh ~{needed / 1024**3:.1f} GB) -- dibaca langsung dari Drive"
        )
    return True, ""


def stage(
    video: str | Path,
    dest_dir: str | Path,
    log: Logger = print,
    min_bytes: int = MIN_BYTES,
) -> Path:
    """Return a local path to the recording, copying it only when worthwhile.

    Safe to call repeatedly: an existing complete copy is reused, and a copy
    interrupted part-way is discarded rather than silently truncating the video.
    """
    src = Path(video).expanduser()
    ok, reason = should_stage(src, dest_dir, min_bytes)
    if not ok:
        if reason:
            log(f"  {reason}")
        return src

    dest = Path(dest_dir).expanduser()
    dest.mkdir(parents=True, exist_ok=True)
    target = dest / src.name
    size = src.stat().st_size

    if target.exists() and target.stat().st_size == size:
        log(f"  memakai salinan lokal yang sudah ada ({size / 1024**3:.1f} GB)")
        return target

    log(f"  menyalin {src.name} ({size / 1024**3:.1f} GB) ke disk lokal supaya cepat...")
    partial = target.with_suffix(target.suffix + ".part")
    copied = 0
    last_report = 0

    try:
        with src.open("rb") as fin, partial.open("wb") as fout:
            while True:
                block = fin.read(CHUNK)
                if not block:
                    break
                fout.write(block)
                copied += len(block)
                percent = int(copied * 100 / size) if size else 100
                if percent >= last_report + 10:
                    last_report = percent - percent % 10
                    log(f"    {last_report}%")
    except (OSError, KeyboardInterrupt) as exc:
        partial.unlink(missing_ok=True)
        log(f"  penyalinan gagal ({exc}) -- dibaca langsung dari Drive")
        return src

    if copied != size:
        partial.unlink(missing_ok=True)
        log("  salinan tidak lengkap -- dibaca langsung dari Drive")
        return src

    partial.replace(target)
    log("  salinan selesai")
    return target


def cleanup(path: str | Path, original: str | Path) -> None:
    """Delete a staged copy, never the original."""
    staged, source = Path(path), Path(original)
    if staged != source and staged.exists():
        staged.unlink(missing_ok=True)
