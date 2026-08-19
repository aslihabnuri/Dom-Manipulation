"""A clipping plan: decisions made ahead of time, elsewhere.

The recording never has to leave Google Drive, but a plan file is tiny. So the
analysis can happen somewhere that only has the performance report -- an
assistant reading Drive, say -- and the machine that actually holds the video
just executes the plan.

The division of labour is deliberate. A plan can decide anything derivable from
the performance report: which blocks are worth clipping, in what order, and how
to render them. It cannot decide the exact seconds, the on-screen text, or the
caption, because those need the audio, which only the rendering machine has.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

PLAN_FILENAME = "rencana-klip.json"
PLAN_VERSION = 1


@dataclass
class PlanBlock:
    """One stretch of the recording the plan wants clipped."""

    label: str
    start: float           # seconds from the start of the recording
    end: float
    score: float = 0.0
    viewers: float = 0.0
    gmv: float = 0.0
    why: str = ""


@dataclass
class ClipPlan:
    session_id: str
    live_start: str = ""           # "2026-06-28 11:59"
    video: str = ""                # filename, for a sanity check
    reframe: str = "blur"
    max_clips: int = 6
    blocks: list[PlanBlock] = field(default_factory=list)
    note: str = ""
    created_at: str = ""
    created_by: str = "clipper"

    @property
    def live_start_dt(self) -> datetime | None:
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M"):
            try:
                return datetime.strptime(self.live_start, fmt)
            except ValueError:
                continue
        return None

    def summary(self) -> list[str]:
        lines = [f"Rencana untuk {self.session_id} ({len(self.blocks)} blok, "
                 f"maksimal {self.max_clips} klip)"]
        if self.live_start:
            lines.append(f"Rekaman dimulai {self.live_start}")
        for block in self.blocks:
            lines.append(
                f"  blok {block.label}  skor {block.score:.2f}  "
                f"menit {_hms(block.start)}-{_hms(block.end)}"
                + (f"  ({block.why})" if block.why else "")
            )
        if self.note:
            lines.append(f"Catatan: {self.note}")
        return lines


def _hms(seconds: float) -> str:
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}"


def write_plan(plan: ClipPlan, path: str | Path) -> Path:
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    payload: dict[str, Any] = {"version": PLAN_VERSION, **asdict(plan)}
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return p


def dumps(plan: ClipPlan) -> str:
    return json.dumps({"version": PLAN_VERSION, **asdict(plan)}, ensure_ascii=False, indent=2)


def loads(raw: str) -> ClipPlan:
    data = json.loads(raw)
    version = int(data.get("version", 0))
    if version > PLAN_VERSION:
        raise ValueError(
            f"rencana ini dibuat versi {version}, aplikasi Anda mengerti sampai {PLAN_VERSION}. "
            "Perbarui aplikasinya."
        )

    blocks = [
        PlanBlock(**{k: v for k, v in b.items() if k in PlanBlock.__dataclass_fields__})
        for b in data.get("blocks", [])
    ]
    fields = {k: v for k, v in data.items() if k in ClipPlan.__dataclass_fields__}
    fields["blocks"] = blocks
    return ClipPlan(**fields)


def load_plan(path: str | Path) -> ClipPlan:
    p = Path(path).expanduser()
    if not p.exists():
        raise FileNotFoundError(f"berkas rencana tidak ada: {p}")
    try:
        return loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{p.name} bukan JSON yang sah: {exc}") from exc


def find_plan(folder: str | Path) -> Path | None:
    """A plan file dropped into the live folder, if there is one."""
    root = Path(folder).expanduser()
    if not root.is_dir():
        return None
    exact = root / PLAN_FILENAME
    if exact.is_file():
        return exact
    candidates = sorted(
        p for p in root.glob("*.json")
        if "rencana" in p.name.lower() or "plan" in p.name.lower()
    )
    return candidates[0] if candidates else None


def build_plan(
    session_id: str,
    scored,
    selected,
    live_start: datetime | None = None,
    video: str = "",
    reframe: str = "blur",
    max_clips: int = 6,
    note: str = "",
    created_by: str = "clipper",
) -> ClipPlan:
    """Turn a scored session into a plan the rendering machine can execute."""
    by_label = {h.label: h for h in scored}
    blocks = [
        PlanBlock(
            label=h.label,
            start=round(h.segment.start, 2),
            end=round(h.segment.end, 2),
            score=round(h.score, 4),
            viewers=h.row.viewers,
            gmv=h.row.gmv,
            why=(
                f"penonton {h.row.viewers:,.0f} (skor {h.viewers_norm:.2f}), "
                f"sales {h.row.gmv:,.0f} (skor {h.sales_norm:.2f})"
            ),
        )
        for h in selected if h.label in by_label
    ]
    return ClipPlan(
        session_id=session_id,
        live_start=live_start.strftime("%Y-%m-%d %H:%M") if live_start else "",
        video=video,
        reframe=reframe,
        max_clips=max_clips,
        blocks=blocks,
        note=note,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M"),
        created_by=created_by,
    )


def restrict_to_plan(scored, plan: ClipPlan, tolerance: float = 1.0):
    """Keep only the scored blocks the plan asked for, in the plan's order.

    Matched by time range rather than label, so a plan still applies when the
    report is re-exported with slightly different labels.
    """
    if not plan.blocks:
        return list(scored)

    chosen = []
    for block in plan.blocks:
        match = next(
            (
                h for h in scored
                if abs(h.segment.start - block.start) <= tolerance
                and abs(h.segment.end - block.end) <= tolerance
            ),
            None,
        )
        if match is None:
            match = next((h for h in scored if h.label == block.label), None)
        if match is not None and match not in chosen:
            chosen.append(match)
    return chosen or list(scored)
