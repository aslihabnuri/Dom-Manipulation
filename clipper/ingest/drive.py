"""Fetch live recordings and performance reports from Google Drive.

Three ways in, in order of preference:
  1. a local path or an already-mounted folder -- nothing to configure
  2. ``rclone``, which handles very large files and resumes well
  3. the Google Drive API, when google-api-python-client is installed

Everything degrades gracefully: the pipeline never *requires* Drive.
"""

from __future__ import annotations

import re
import shutil
import subprocess
from dataclasses import dataclass
from datetime import date
from pathlib import Path

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

VIDEO_SUFFIXES = {".mp4", ".mov", ".mkv", ".flv", ".ts", ".webm", ".m4v", ".avi"}
DATA_SUFFIXES = {".csv", ".xlsx", ".xlsm", ".xls", ".tsv"}

# Date shapes commonly used in filenames: 2026-08-18, 18-08-2026, 20260818.
_DATE_PATTERNS = [
    (re.compile(r"(20\d{2})[-_./](\d{1,2})[-_./](\d{1,2})"), ("y", "m", "d")),
    (re.compile(r"(\d{1,2})[-_./](\d{1,2})[-_./](20\d{2})"), ("d", "m", "y")),
    # No \b here: it fails between a letter and a digit ("LIVE20260818").
    (re.compile(r"(?<!\d)(20\d{2})(\d{2})(\d{2})(?!\d)"), ("y", "m", "d")),
]


class DriveUnavailable(RuntimeError):
    """No usable route to Google Drive."""


@dataclass
class RemoteFile:
    id: str
    name: str
    size: int = 0
    mime: str = ""

    @property
    def suffix(self) -> str:
        return Path(self.name).suffix.lower()


def parse_date_in_name(name: str) -> date | None:
    """Pull a live date out of a filename, if one is encoded there."""
    for pattern, order in _DATE_PATTERNS:
        m = pattern.search(name)
        if not m:
            continue
        parts = dict(zip(order, m.groups()))
        try:
            return date(int(parts["y"]), int(parts["m"]), int(parts["d"]))
        except (ValueError, KeyError):
            continue
    return None


def find_local(folder: str | Path, target: date | None = None) -> tuple[Path | None, Path | None]:
    """Locate (video, performance) in a local folder, optionally for one date."""
    root = Path(folder).expanduser()
    if not root.exists():
        raise FileNotFoundError(f"folder not found: {root}")

    videos = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in VIDEO_SUFFIXES]
    data = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in DATA_SUFFIXES]

    if target is not None:
        matched_v = [p for p in videos if parse_date_in_name(p.name) == target]
        matched_d = [p for p in data if parse_date_in_name(p.name) == target]
        # A date-stamped parent folder counts too (e.g. "Live/2026-08-18/rec.mp4").
        if not matched_v:
            matched_v = [p for p in videos if any(parse_date_in_name(x.name) == target for x in p.parents)]
        if not matched_d:
            matched_d = [p for p in data if any(parse_date_in_name(x.name) == target for x in p.parents)]
        videos, data = matched_v, matched_d

    video = max(videos, key=lambda p: p.stat().st_size) if videos else None
    perf = max(data, key=lambda p: p.stat().st_mtime) if data else None
    return video, perf


def rclone_available() -> bool:
    return shutil.which("rclone") is not None


def rclone_list(remote: str) -> list[str]:
    if not rclone_available():
        raise DriveUnavailable("rclone is not installed")
    proc = subprocess.run(
        ["rclone", "lsf", "--recursive", remote],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    )
    if proc.returncode != 0:
        raise DriveUnavailable(f"rclone lsf failed: {proc.stderr.strip()}")
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def rclone_copy(remote_path: str, dest_dir: str | Path) -> Path:
    dest = Path(dest_dir).expanduser()
    dest.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        ["rclone", "copy", "--progress", remote_path, str(dest)],
        stderr=subprocess.PIPE, text=True,
    )
    if proc.returncode != 0:
        raise DriveUnavailable(f"rclone copy failed: {proc.stderr.strip()}")
    return dest / Path(remote_path).name


def _drive_service(credentials: str | Path, token: str | Path):
    try:
        from google.auth.transport.requests import Request  # type: ignore
        from google.oauth2.credentials import Credentials  # type: ignore
        from google_auth_oauthlib.flow import InstalledAppFlow  # type: ignore
        from googleapiclient.discovery import build  # type: ignore
    except ImportError as exc:
        raise DriveUnavailable(
            "Google Drive API support needs: pip install google-api-python-client "
            "google-auth-oauthlib"
        ) from exc

    token_path = Path(token).expanduser()
    creds_path = Path(credentials).expanduser()
    creds = None

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not creds_path.exists():
                raise DriveUnavailable(
                    f"OAuth client file not found at {creds_path}. Create one in Google "
                    "Cloud Console (Desktop app) and save it there."
                )
            creds = InstalledAppFlow.from_client_secrets_file(str(creds_path), SCOPES).run_local_server(port=0)
        token_path.parent.mkdir(parents=True, exist_ok=True)
        token_path.write_text(creds.to_json(), encoding="utf-8")

    return build("drive", "v3", credentials=creds, cache_discovery=False)


def list_folder(folder_id: str, credentials: str | Path, token: str | Path) -> list[RemoteFile]:
    service = _drive_service(credentials, token)
    files: list[RemoteFile] = []
    page_token = None

    while True:
        response = (
            service.files()
            .list(
                q=f"'{folder_id}' in parents and trashed = false",
                fields="nextPageToken, files(id, name, size, mimeType)",
                pageSize=200,
                pageToken=page_token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
        )
        for item in response.get("files", []):
            files.append(
                RemoteFile(
                    id=item["id"], name=item["name"],
                    size=int(item.get("size") or 0), mime=item.get("mimeType", ""),
                )
            )
        page_token = response.get("nextPageToken")
        if not page_token:
            break
    return files


def download(
    file_id: str, dest: str | Path, credentials: str | Path, token: str | Path,
    progress: bool = True,
) -> Path:
    from googleapiclient.http import MediaIoBaseDownload  # type: ignore

    service = _drive_service(credentials, token)
    out = Path(dest).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)

    request = service.files().get_media(fileId=file_id, supportsAllDrives=True)
    with out.open("wb") as fh:
        downloader = MediaIoBaseDownload(fh, request, chunksize=32 * 1024 * 1024)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            if progress and status:
                print(f"  downloading {out.name}: {int(status.progress() * 100)}%", end="\r")
    if progress:
        print()
    return out


def extract_folder_id(value: str) -> str:
    """Accept a raw folder ID or any Drive folder URL."""
    m = re.search(r"/folders/([A-Za-z0-9_-]+)", value)
    if m:
        return m.group(1)
    m = re.search(r"[?&]id=([A-Za-z0-9_-]+)", value)
    if m:
        return m.group(1)
    return value.strip()


def resolve_session(
    source: str,
    target: date | None,
    work_dir: str | Path,
    credentials: str | Path = "",
    token: str | Path = "",
) -> tuple[Path | None, Path | None]:
    """Resolve ``source`` to local (video, performance) paths.

    ``source`` may be a local folder, an ``rclone`` remote (``remote:path``), or
    a Drive folder ID/URL.
    """
    local = Path(source).expanduser()
    if local.exists():
        return find_local(local, target)

    if ":" in source and not source.startswith("http") and rclone_available():
        names = rclone_list(source)
        wanted = [n for n in names if target is None or parse_date_in_name(Path(n).name) == target]
        videos = [n for n in wanted if Path(n).suffix.lower() in VIDEO_SUFFIXES]
        data = [n for n in wanted if Path(n).suffix.lower() in DATA_SUFFIXES]
        base = source.rstrip("/")
        video = rclone_copy(f"{base}/{videos[0]}", work_dir) if videos else None
        perf = rclone_copy(f"{base}/{data[0]}", work_dir) if data else None
        return video, perf

    folder_id = extract_folder_id(source)
    remote_files = list_folder(folder_id, credentials, token)
    wanted = [f for f in remote_files if target is None or parse_date_in_name(f.name) == target]
    videos = [f for f in wanted if f.suffix in VIDEO_SUFFIXES]
    data = [f for f in wanted if f.suffix in DATA_SUFFIXES]

    work = Path(work_dir).expanduser()
    video = download(max(videos, key=lambda f: f.size).id,
                     work / max(videos, key=lambda f: f.size).name,
                     credentials, token) if videos else None
    perf = download(data[0].id, work / data[0].name, credentials, token) if data else None
    return video, perf
