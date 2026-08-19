"""Turn hour-by-hour performance data into ranked video segments.

The brief is "clip where viewers AND sales were both high". A weighted sum
would happily rank an hour with huge traffic and zero sales above a genuinely
converting hour, so the default combiner is a weighted *geometric* mean: it
collapses when either side is weak, which is exactly the behaviour we want.
"""

from __future__ import annotations

from datetime import datetime
from typing import Sequence

from ..config import Config
from ..models import HourScore, PerfRow, Segment

# Keeps the geometric mean strictly ordered instead of flattening every
# zero-sales hour to an indistinguishable 0.0.
_EPS = 0.01


def normalize(values: Sequence[float]) -> list[float]:
    """Min-max scale to [0, 1]. Uniform input maps to a neutral 0.5."""
    if not values:
        return []
    clean = [max(0.0, float(v)) for v in values]
    lo, hi = min(clean), max(clean)
    if hi - lo < 1e-9:
        return [0.5] * len(clean)
    return [(v - lo) / (hi - lo) for v in clean]


def combine(viewers_norm: float, sales_norm: float, method: str, wv: float, ws: float) -> float:
    """Fuse the two normalised metrics into one 0-1 score."""
    total = wv + ws
    if total <= 0:
        wv = ws = 0.5
    else:
        wv, ws = wv / total, ws / total

    if method == "weighted":
        return wv * viewers_norm + ws * sales_norm

    # Weighted geometric mean, epsilon-shifted so ordering survives zeros.
    value = ((viewers_norm + _EPS) ** wv) * ((sales_norm + _EPS) ** ws)
    return max(0.0, min(1.0, value - _EPS))


def _sales_values(rows: Sequence[PerfRow], metric: str) -> list[float]:
    if metric == "orders":
        return [r.orders for r in rows]
    if metric == "gmv_per_viewer":
        return [r.gmv_per_viewer() for r in rows]
    return [r.gmv for r in rows]


def resolve_live_start(
    rows: Sequence[PerfRow],
    live_start: datetime | None = None,
) -> datetime:
    """Wall-clock time corresponding to second 0 of the recording."""
    if live_start is not None:
        return live_start
    if not rows:
        raise ValueError("cannot resolve live start: no performance rows")
    return min(r.start for r in rows)


def score_hours(
    rows: Sequence[PerfRow],
    config: Config,
    live_start: datetime | None = None,
    video_duration: float | None = None,
) -> list[HourScore]:
    """Score every performance row and map it onto the video timeline.

    ``live_start`` is the wall-clock moment the *recording* begins. Rows falling
    outside the recording are dropped, and rows that only partly overlap it are
    clipped to what the video actually contains.
    """
    if not rows:
        return []

    method = str(config.get("scoring.method", "geometric"))
    wv = float(config.get("scoring.viewers_weight", 0.5))
    ws = float(config.get("scoring.sales_weight", 0.5))
    metric = str(config.get("scoring.sales_metric", "gmv"))

    viewers_norm = normalize([r.viewers for r in rows])
    sales_norm = normalize(_sales_values(rows, metric))
    origin = resolve_live_start(rows, live_start)

    scored: list[HourScore] = []
    for row, vn, sn in zip(rows, viewers_norm, sales_norm):
        start_s = (row.start - origin).total_seconds()
        end_s = (row.end - origin).total_seconds()

        if video_duration is not None:
            start_s = max(0.0, start_s)
            end_s = min(video_duration, end_s)
        else:
            start_s = max(0.0, start_s)

        if end_s - start_s < 1.0:
            continue  # row lies outside the recording

        scored.append(
            HourScore(
                row=row,
                segment=Segment(start_s, end_s),
                viewers_norm=vn,
                sales_norm=sn,
                score=combine(vn, sn, method, wv, ws),
            )
        )

    scored.sort(key=lambda h: h.score, reverse=True)
    return scored


def select_hours(scored: Sequence[HourScore], config: Config) -> list[HourScore]:
    """Keep only hours worth clipping, best first."""
    min_score = float(config.get("scoring.min_score", 0.35))
    max_clips = int(config.get("scoring.max_clips_per_session", 6))
    per_hour = max(1, int(config.get("scoring.max_clips_per_hour", 2)))

    eligible = [h for h in scored if h.score >= min_score]
    if not eligible and scored:
        # Never return nothing when there is data: fall back to the single best
        # hour and let the compliance/report layer flag the weak score.
        eligible = [scored[0]]

    # Enough hours to fill the clip budget, given the per-hour cap.
    needed = max(1, -(-max_clips // per_hour))
    return eligible[:needed]


def explain(hour: HourScore, config: Config) -> str:
    """One-line, human-readable justification for a chosen hour."""
    metric = str(config.get("scoring.sales_metric", "gmv"))
    sales_value = {
        "orders": hour.row.orders,
        "gmv_per_viewer": hour.row.gmv_per_viewer(),
    }.get(metric, hour.row.gmv)
    return (
        f"{hour.label} - score {hour.score:.2f} "
        f"(viewers {hour.row.viewers:,.0f} -> {hour.viewers_norm:.2f}, "
        f"{metric} {sales_value:,.0f} -> {hour.sales_norm:.2f})"
    )
