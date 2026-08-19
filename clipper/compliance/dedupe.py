"""Ledger of already-published clips, so the same moment is never posted twice.

TikTok's seller policy states it plainly: "Don't re-upload the same video or
livestream recording. Each post should bring new value." Two clips cut from
overlapping parts of one live are, in substance, the same upload -- so every
rendered clip is recorded here and future candidates are checked against it.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from ..config import Config
from ..models import Candidate, Finding, Segment


@dataclass
class LedgerEntry:
    session_id: str
    source_fingerprint: str
    start: float
    end: float
    created_at: str
    output: str = ""
    caption: str = ""
    published: bool = False
    note: str = ""

    @property
    def segment(self) -> Segment:
        return Segment(self.start, self.end)


@dataclass
class Ledger:
    path: Path
    entries: list[LedgerEntry] = field(default_factory=list)

    @classmethod
    def load(cls, path: str | Path) -> "Ledger":
        p = Path(path).expanduser()
        if not p.exists():
            return cls(path=p)
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"ledger at {p} is corrupt ({exc}). Move it aside to start a fresh one."
            ) from exc

        entries = [
            LedgerEntry(**{k: v for k, v in raw.items() if k in LedgerEntry.__dataclass_fields__})
            for raw in data.get("clips", [])
        ]
        return cls(path=p, entries=entries)

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"version": 1, "clips": [asdict(e) for e in self.entries]}
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(self.path)  # atomic, so an interrupted run cannot truncate the ledger

    def for_source(self, fingerprint: str) -> list[LedgerEntry]:
        return [e for e in self.entries if e.source_fingerprint == fingerprint]

    def add(
        self,
        candidate: Candidate,
        session_id: str,
        fingerprint: str,
        output: str = "",
        caption: str = "",
        published: bool = False,
    ) -> LedgerEntry:
        entry = LedgerEntry(
            session_id=session_id,
            source_fingerprint=fingerprint,
            start=round(candidate.segment.start, 3),
            end=round(candidate.segment.end, 3),
            created_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
            output=output,
            caption=caption,
            published=published,
        )
        self.entries.append(entry)
        return entry

    def mark_published(self, output: str) -> bool:
        for entry in self.entries:
            if entry.output == output:
                entry.published = True
                return True
        return False


def fingerprint_source(video_path: str | Path, duration: float | None = None) -> str:
    """Stable ID for a source recording.

    Derived from the first and last megabyte plus size, so a file that is
    renamed or moved still matches, while a genuinely different recording of
    the same length does not.
    """
    p = Path(video_path).expanduser()
    if not p.exists():
        raise FileNotFoundError(f"video not found: {p}")

    size = p.stat().st_size
    digest = hashlib.sha256()
    digest.update(str(size).encode())
    if duration:
        digest.update(f"{duration:.1f}".encode())

    chunk = 1024 * 1024
    with p.open("rb") as fh:
        digest.update(fh.read(chunk))
        if size > chunk * 2:
            fh.seek(-chunk, 2)
            digest.update(fh.read(chunk))
    return digest.hexdigest()[:20]


def check_duplicate(
    candidate: Candidate,
    ledger: Ledger,
    fingerprint: str,
    config: Config,
    batch: list[Candidate] | None = None,
) -> list[Finding]:
    """Flag a candidate that repeats a moment already clipped from this live."""
    threshold = float(config.get("compliance.max_overlap_with_published", 0.25))
    findings: list[Finding] = []

    for entry in ledger.for_source(fingerprint):
        ratio = candidate.segment.overlap_ratio(entry.segment)
        if ratio <= threshold:
            continue
        when = entry.created_at.split("T")[0]
        state = "sudah diunggah" if entry.published else "sudah dirender"
        findings.append(
            Finding(
                "originality.duplicate", "block",
                f"Beririsan {ratio:.0%} dengan klip yang {state} "
                f"({_fmt(entry.start)}-{_fmt(entry.end)}, {when}). "
                "Mengunggah momen yang sama dua kali dihitung sebagai konten tidak orisinal.",
                evidence=entry.output or f"{_fmt(entry.start)}-{_fmt(entry.end)}",
            )
        )

    for other in batch or []:
        if other is candidate:
            continue
        ratio = candidate.segment.overlap_ratio(other.segment)
        if ratio > threshold:
            findings.append(
                Finding(
                    "originality.duplicate_batch", "block",
                    f"Beririsan {ratio:.0%} dengan klip lain di batch ini "
                    f"({_fmt(other.segment.start)}-{_fmt(other.segment.end)}).",
                )
            )
    return findings


def _fmt(seconds: float) -> str:
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h:d}:{m:02d}:{s:02d}" if h else f"{m:d}:{s:02d}"


def drop_overlapping(candidates: list[Candidate], threshold: float = 0.25) -> list[Candidate]:
    """Greedily keep the best candidates that do not overlap each other."""
    kept: list[Candidate] = []
    for cand in sorted(candidates, key=lambda c: c.score, reverse=True):
        if all(cand.segment.overlap_ratio(k.segment) <= threshold for k in kept):
            kept.append(cand)
    kept.sort(key=lambda c: c.segment.start)
    return kept
