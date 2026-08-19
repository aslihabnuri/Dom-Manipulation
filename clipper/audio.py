"""Audio-domain analysis used to find the exact moment inside a strong hour."""

from __future__ import annotations

import array
import math
from dataclasses import dataclass
from pathlib import Path

from .ffmpeg import ffmpeg_bin, run_binary

SAMPLE_RATE = 8000  # plenty for envelope + speech-gap work, and fast to decode


@dataclass
class Envelope:
    """RMS loudness sampled at a fixed hop, relative to the file's start."""

    start: float
    hop: float
    values: list[float]

    def at(self, t: float) -> float:
        if not self.values:
            return 0.0
        idx = int((t - self.start) / self.hop)
        return self.values[max(0, min(len(self.values) - 1, idx))]

    def mean_between(self, start: float, end: float) -> float:
        if not self.values or end <= start:
            return 0.0
        lo = max(0, int((start - self.start) / self.hop))
        hi = min(len(self.values), int(math.ceil((end - self.start) / self.hop)))
        window = self.values[lo:hi]
        return sum(window) / len(window) if window else 0.0

    def peak(self) -> float:
        return max(self.values) if self.values else 0.0


def decode_pcm(path: str | Path, start: float, duration: float) -> array.array:
    """Decode a span of audio to mono 16-bit PCM samples."""
    args = [
        ffmpeg_bin(), "-hide_banner", "-loglevel", "error",
        "-ss", f"{max(0.0, start):.3f}", "-t", f"{max(0.0, duration):.3f}",
        "-i", str(path), "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE),
        "-f", "s16le", "-",
    ]
    raw = run_binary(args, timeout=900)
    samples = array.array("h")
    usable = len(raw) - (len(raw) % 2)
    samples.frombytes(raw[:usable])
    return samples


def rms_envelope(
    path: str | Path, start: float, duration: float, hop: float = 0.25
) -> Envelope:
    """RMS envelope of ``[start, start+duration)``, normalised to 0-1."""
    samples = decode_pcm(path, start, duration)
    if not samples:
        return Envelope(start=start, hop=hop, values=[])

    frame = max(1, int(SAMPLE_RATE * hop))
    values: list[float] = []
    for i in range(0, len(samples) - frame + 1, frame):
        total = 0
        for s in samples[i : i + frame]:
            total += s * s
        values.append(math.sqrt(total / frame) / 32768.0)

    peak = max(values) if values else 0.0
    if peak > 0:
        values = [v / peak for v in values]
    return Envelope(start=start, hop=hop, values=values)


def speech_gaps(env: Envelope, threshold: float = 0.12, min_gap: float = 0.35) -> list[tuple[float, float]]:
    """Quiet stretches in the envelope, as (start, end) absolute times."""
    gaps: list[tuple[float, float]] = []
    run_start: float | None = None

    for i, value in enumerate(env.values):
        t = env.start + i * env.hop
        if value < threshold:
            if run_start is None:
                run_start = t
        elif run_start is not None:
            if t - run_start >= min_gap:
                gaps.append((run_start, t))
            run_start = None

    if run_start is not None:
        end = env.start + len(env.values) * env.hop
        if end - run_start >= min_gap:
            gaps.append((run_start, end))
    return gaps


def background_bed_ratio(env: Envelope, gaps: list[tuple[float, float]]) -> float:
    """How loud the audio stays while nobody is speaking.

    A host talking over silence leaves near-zero gaps; a music bed keeps energy
    up between sentences. Ratios above ~0.25 suggest a persistent bed, which is
    a copyright risk worth flagging before a clip is published.
    """
    if not env.values:
        return 0.0

    speech_level = sorted(env.values)[int(len(env.values) * 0.9)] if env.values else 0.0
    if speech_level <= 0:
        return 0.0

    if not gaps:
        floor = sorted(env.values)[max(0, int(len(env.values) * 0.05))]
        return min(1.0, floor / speech_level)

    levels = [env.mean_between(g0, g1) for g0, g1 in gaps]
    levels = [x for x in levels if x > 0]
    if not levels:
        return 0.0
    return min(1.0, (sum(levels) / len(levels)) / speech_level)
