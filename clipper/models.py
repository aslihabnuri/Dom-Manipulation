"""Core data structures shared across the clipper pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any


@dataclass
class PerfRow:
    """One row of hour-by-hour live performance data.

    ``start`` and ``end`` are wall-clock times from the seller report. They are
    mapped onto video timestamps later, once we know when the recording began.
    """

    start: datetime
    end: datetime
    viewers: float = 0.0
    gmv: float = 0.0
    orders: float = 0.0
    extra: dict[str, Any] = field(default_factory=dict)

    @property
    def duration(self) -> timedelta:
        return self.end - self.start

    def gmv_per_viewer(self) -> float:
        return self.gmv / self.viewers if self.viewers else 0.0


@dataclass
class Segment:
    """A span of the recording, in seconds relative to the start of the video."""

    start: float
    end: float

    def __post_init__(self) -> None:
        if self.end <= self.start:
            raise ValueError(f"segment end ({self.end}) must be after start ({self.start})")

    @property
    def duration(self) -> float:
        return self.end - self.start

    def overlaps(self, other: "Segment") -> bool:
        return self.start < other.end and other.start < self.end

    def overlap_seconds(self, other: "Segment") -> float:
        return max(0.0, min(self.end, other.end) - max(self.start, other.start))

    def overlap_ratio(self, other: "Segment") -> float:
        """Overlap as a fraction of the *shorter* segment.

        Using the shorter segment as the denominator means a 30s clip fully
        contained inside a 60s one scores 1.0, not 0.5 -- containment is the
        case we most want to catch when de-duplicating.
        """
        shorter = min(self.duration, other.duration)
        return self.overlap_seconds(other) / shorter if shorter else 0.0


@dataclass
class HourScore:
    """A performance row scored and mapped onto the video timeline."""

    row: PerfRow
    segment: Segment
    viewers_norm: float
    sales_norm: float
    score: float

    @property
    def label(self) -> str:
        return self.row.start.strftime("%H:%M")


@dataclass
class TranscriptWord:
    start: float
    end: float
    text: str


@dataclass
class TranscriptSegment:
    start: float
    end: float
    text: str
    words: list[TranscriptWord] = field(default_factory=list)


@dataclass
class Transcript:
    segments: list[TranscriptSegment] = field(default_factory=list)
    language: str = "id"

    def text_between(self, start: float, end: float) -> str:
        parts = [s.text.strip() for s in self.segments if s.end > start and s.start < end]
        return " ".join(p for p in parts if p)

    def words_between(self, start: float, end: float) -> list[TranscriptWord]:
        out: list[TranscriptWord] = []
        for seg in self.segments:
            if seg.end <= start or seg.start >= end:
                continue
            out.extend(w for w in seg.words if w.end > start and w.start < end)
        return out


@dataclass
class Candidate:
    """A proposed clip: a refined segment with the reasoning behind it."""

    segment: Segment
    source_hour: HourScore
    score: float
    reasons: list[str] = field(default_factory=list)
    transcript_text: str = ""
    hook: str = ""

    @property
    def slug(self) -> str:
        mm, ss = divmod(int(self.segment.start), 60)
        hh, mm = divmod(mm, 60)
        return f"{hh:02d}{mm:02d}{ss:02d}"


@dataclass
class Finding:
    """A single compliance issue found in a candidate clip."""

    rule_id: str
    severity: str  # "block" | "warn" | "info"
    message: str
    evidence: str = ""
    at: float | None = None

    @property
    def blocking(self) -> bool:
        return self.severity == "block"


@dataclass
class ClipResult:
    candidate: Candidate
    video_path: str | None
    caption: str
    findings: list[Finding] = field(default_factory=list)
    rendered: bool = False

    @property
    def blocked(self) -> bool:
        return any(f.blocking for f in self.findings)
