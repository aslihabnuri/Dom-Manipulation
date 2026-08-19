"""Narrow a high-performing hour down to the exact clip-worthy moment.

Hourly seller data tells us *which* hour converted, never *which 45 seconds*.
This module slides a window across the hour and ranks it on three signals --
how energetic the audio is, how densely the host is speaking, and whether the
selling moment (CTA, price, urgency) actually lands inside the window -- then
snaps the result to sentence boundaries so clips never open mid-word.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from ..audio import Envelope, rms_envelope
from ..config import Config
from ..models import Candidate, HourScore, Segment, Transcript

# Phrases that mark the selling beat of an Indonesian TikTok Shop live.
# Weighted: a checkout call is worth more than a passing price mention.
INTENT_PHRASES: dict[str, float] = {
    # Direct call to action
    "keranjang kuning": 3.0, "klik keranjang": 3.0, "checkout": 2.5, "co sekarang": 2.5,
    "keranjang": 2.0, "klik": 1.2, "ambil": 1.2, "serbu": 2.0, "gaskeun": 1.5,
    "gas": 0.8, "diambil": 1.5, "silakan diorder": 2.5, "order": 1.5,
    # Offer and price
    "flash sale": 2.5, "diskon": 2.0, "promo": 1.8, "voucher": 1.8,
    "gratis ongkir": 2.0, "free ongkir": 2.0, "harga": 1.2, "cuma": 1.5,
    "murah": 1.2, "potongan": 1.5, "bundling": 1.2, "bonus": 1.5,
    # Scarcity and urgency
    "stok terbatas": 2.5, "sisa": 1.5, "terakhir": 1.8, "habis": 1.5,
    "buruan": 2.0, "cepat": 1.0, "last call": 2.0, "detik": 0.8,
    # Product demonstration
    "bahan": 1.0, "kualitas": 1.0, "ukuran": 1.0, "warna": 0.8,
    "cocok": 0.8, "review": 1.0, "coba": 0.8,
}

_SENTENCE_END = re.compile(r"[.!?]+\s*$")


@dataclass
class WindowScore:
    segment: Segment
    energy: float
    density: float
    intent: float
    total: float
    text: str


def _normalise(values: list[float]) -> list[float]:
    if not values:
        return []
    lo, hi = min(values), max(values)
    if hi - lo < 1e-9:
        return [0.5] * len(values)
    return [(v - lo) / (hi - lo) for v in values]


def intent_score(text: str) -> float:
    """Weighted count of selling phrases, saturating so repetition cannot dominate."""
    if not text:
        return 0.0
    lowered = f" {text.lower()} "
    total = 0.0
    for phrase, weight in INTENT_PHRASES.items():
        hits = lowered.count(f" {phrase}") if " " not in phrase else lowered.count(phrase)
        if hits:
            total += weight * (1.0 + 0.35 * (min(hits, 4) - 1))  # diminishing returns
    return total


def _speech_density(transcript: Transcript | None, start: float, end: float) -> float:
    if transcript is None or end <= start:
        return 0.0
    words = transcript.words_between(start, end)
    if words:
        return len(words) / (end - start)
    text = transcript.text_between(start, end)
    return len(text.split()) / (end - start) if text else 0.0


def _snap_to_sentences(
    segment: Segment, transcript: Transcript | None, hour: Segment, config: Config
) -> Segment:
    """Move the cut points to the nearest sentence edge, within length limits."""
    if transcript is None or not transcript.segments:
        return segment

    min_len = float(config.get("clip.min_seconds", 21))
    max_len = float(config.get("clip.max_seconds", 60))
    lead_in = float(config.get("clip.lead_in", 0.4))
    lead_out = float(config.get("clip.lead_out", 0.6))

    inside = [s for s in transcript.segments if s.end > segment.start and s.start < segment.end]
    if not inside:
        return segment

    # Start at the first sentence that begins at or after the window opens, so
    # we never join a sentence already in progress.
    starts = [s.start for s in inside if s.start >= segment.start - 1.5]
    new_start = min(starts) if starts else inside[0].start

    # End on the last sentence that finishes inside the window, preferring one
    # that actually terminates with punctuation.
    finished = [s for s in inside if s.end <= segment.end + 1.5]
    if finished:
        terminal = [s for s in finished if _SENTENCE_END.search(s.text)]
        new_end = max(s.end for s in (terminal or finished))
    else:
        new_end = segment.end

    new_start = max(hour.start, new_start - lead_in)
    new_end = min(hour.end, new_end + lead_out)

    if new_end - new_start < min_len:
        new_end = min(hour.end, new_start + min_len)
        if new_end - new_start < min_len:  # not enough room at the tail
            new_start = max(hour.start, new_end - min_len)
    if new_end - new_start > max_len:
        new_end = new_start + max_len

    if new_end - new_start < min_len:
        return segment
    return Segment(new_start, new_end)


def score_windows(
    video_path: str,
    hour: HourScore,
    config: Config,
    transcript: Transcript | None = None,
    envelope: Envelope | None = None,
) -> list[WindowScore]:
    """Rank every candidate window inside one hour, best first."""
    target = float(config.get("clip.target_seconds", 45))
    stride = max(1.0, float(config.get("refine.window_stride", 3.0)))
    w_energy = float(config.get("refine.audio_energy", 0.30))
    w_density = float(config.get("refine.speech_density", 0.25))
    w_intent = float(config.get("refine.intent_phrases", 0.45))

    span = hour.segment
    if span.duration < target:
        target = max(float(config.get("clip.min_seconds", 21)), span.duration)

    if envelope is None:
        try:
            envelope = rms_envelope(video_path, span.start, span.duration, hop=0.25)
        except Exception:
            envelope = Envelope(start=span.start, hop=0.25, values=[])

    starts: list[float] = []
    t = span.start
    while t + target <= span.end + 0.01:
        starts.append(t)
        t += stride
    if not starts:
        starts = [span.start]

    raw: list[tuple[float, float, float, float, str]] = []
    for s in starts:
        e = min(span.end, s + target)
        text = transcript.text_between(s, e) if transcript else ""
        raw.append((
            s,
            envelope.mean_between(s, e),
            _speech_density(transcript, s, e),
            intent_score(text),
            text,
        ))

    energies = _normalise([r[1] for r in raw])
    densities = _normalise([r[2] for r in raw])
    intents = _normalise([r[3] for r in raw])

    scored = [
        WindowScore(
            segment=Segment(s, min(span.end, s + target)),
            energy=en, density=de, intent=it,
            total=w_energy * en + w_density * de + w_intent * it,
            text=text,
        )
        for (s, _, _, _, text), en, de, it in zip(raw, energies, densities, intents)
    ]
    scored.sort(key=lambda w: w.total, reverse=True)
    return scored


def refine_hour(
    video_path: str,
    hour: HourScore,
    config: Config,
    transcript: Transcript | None = None,
    limit: int | None = None,
) -> list[Candidate]:
    """Produce the best non-overlapping candidate clips from one hour."""
    limit = limit or int(config.get("scoring.max_clips_per_hour", 2))
    windows = score_windows(video_path, hour, config, transcript)
    if not windows:
        return []

    snap = bool(config.get("refine.snap_to_sentences", True))
    candidates: list[Candidate] = []

    for window in windows:
        if len(candidates) >= limit:
            break

        segment = _snap_to_sentences(window.segment, transcript, hour.segment, config) if snap else window.segment

        # Windows are dense by design; keep only genuinely distinct moments.
        if any(segment.overlap_ratio(c.segment) > 0.2 for c in candidates):
            continue

        text = transcript.text_between(segment.start, segment.end) if transcript else window.text
        reasons = [
            f"jam {hour.label} berskor {hour.score:.2f} "
            f"(penonton {hour.viewers_norm:.2f} / sales {hour.sales_norm:.2f})",
            f"momen dipilih dari energi audio {window.energy:.2f}, "
            f"kepadatan bicara {window.density:.2f}, sinyal jualan {window.intent:.2f}",
        ]
        if snap and transcript:
            reasons.append("titik potong disesuaikan ke batas kalimat")

        candidates.append(
            Candidate(
                segment=segment,
                source_hour=hour,
                score=round(0.6 * hour.score + 0.4 * window.total, 4),
                reasons=reasons,
                transcript_text=text,
            )
        )

    return candidates
