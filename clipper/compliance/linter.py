"""Scan a candidate clip for policy risk before it is ever rendered."""

from __future__ import annotations

import re
from pathlib import Path

from ..audio import Envelope, background_bed_ratio, rms_envelope, speech_gaps
from ..config import Config
from ..models import Candidate, Finding, Transcript
from .rules import Rule, load_rules

# TikTok's own wording: each post must "bring new value". Burned-in captions and
# an informative overlay are the value we add, so we verify they are actually
# present and substantive rather than decorative.
MIN_OVERLAY_CHARS = 12


def _locate(transcript: Transcript | None, needle: str, start: float, end: float) -> float | None:
    """Best-effort timestamp for a matched phrase inside the clip."""
    if transcript is None or not needle.strip():
        return None
    target = needle.lower().split()[0]
    for word in transcript.words_between(start, end):
        if target in word.text.lower():
            return word.start
    for seg in transcript.segments:
        if seg.end > start and seg.start < end and needle.lower() in seg.text.lower():
            return seg.start
    return None


def scan_text(
    text: str,
    rules: list[Rule],
    transcript: Transcript | None = None,
    start: float = 0.0,
    end: float = 0.0,
) -> list[Finding]:
    """Run every rule over ``text`` and return one finding per distinct match."""
    findings: list[Finding] = []
    if not text.strip():
        return findings

    for rule in rules:
        seen: set[str] = set()
        for match in rule.compiled().finditer(text):
            evidence = match.group(0).strip()
            key = evidence.lower()
            if key in seen:
                continue
            seen.add(key)

            context_start = max(0, match.start() - 40)
            context = text[context_start : match.end() + 40].replace("\n", " ").strip()

            findings.append(
                Finding(
                    rule_id=rule.id,
                    severity=rule.severity,
                    message=f"{rule.message} {rule.hint}".strip(),
                    evidence=f"...{context}..." if context_start > 0 else context,
                    at=_locate(transcript, evidence, start, end),
                )
            )
    return findings


def check_music(
    video_path: str | Path, candidate: Candidate, envelope: Envelope | None = None
) -> list[Finding]:
    """Flag a persistent audio bed under the speech, which usually means music.

    This is a heuristic, not a fingerprint match: it measures how much energy
    survives in the gaps between sentences. It is meant to prompt a listen, not
    to deliver a verdict.
    """
    seg = candidate.segment
    if envelope is None:
        try:
            envelope = rms_envelope(video_path, seg.start, seg.duration, hop=0.2)
        except Exception as exc:
            return [
                Finding(
                    "audio.unreadable", "info",
                    f"Audio tidak bisa dianalisis: {exc}",
                )
            ]

    if not envelope.values:
        return [Finding("audio.silent", "warn", "Tidak ada audio terdeteksi pada rentang klip ini.")]

    ratio = background_bed_ratio(envelope, speech_gaps(envelope))
    if ratio >= 0.45:
        return [
            Finding(
                "audio.music_bed", "warn",
                f"Terdengar suara latar yang konstan di sela kalimat (rasio {ratio:.2f}). "
                "Bila itu musik berhak cipta, ganti audio atau pilih momen lain.",
            )
        ]
    if ratio >= 0.25:
        return [
            Finding(
                "audio.music_bed", "info",
                f"Ada energi audio ringan di sela bicara (rasio {ratio:.2f}). Dengarkan sekilas sebelum posting.",
            )
        ]
    return []


def check_added_value(candidate: Candidate, caption: str, overlay_text: str, config: Config) -> list[Finding]:
    """Verify the clip carries a real contribution, not just a trimmed re-upload.

    TikTok's seller policy is explicit that a re-uploaded livestream recording
    needs new value, added "verbally or via text". Burned captions plus a
    substantive overlay satisfy that -- an empty or decorative overlay does not.
    """
    if not bool(config.get("compliance.require_added_value", True)):
        return []

    findings: list[Finding] = []
    captions_on = bool(config.get("captions.enabled", True))
    overlay_on = bool(config.get("overlay.enabled", True))
    stripped = overlay_text.strip()

    if not captions_on and not overlay_on:
        findings.append(
            Finding(
                "originality.no_contribution", "block",
                "Klip ini akan jadi potongan mentah tanpa tambahan apa pun. TikTok menilai "
                "unggahan ulang rekaman live tanpa nilai baru sebagai konten tidak orisinal. "
                "Aktifkan captions atau overlay.",
            )
        )
        return findings

    if overlay_on and len(stripped) < MIN_OVERLAY_CHARS:
        findings.append(
            Finding(
                "originality.thin_overlay", "warn",
                f"Teks overlay terlalu pendek ({len(stripped)} karakter) untuk dihitung sebagai "
                "kontribusi. Isi dengan informasi nyata: nama produk, harga, atau poin utama.",
                evidence=stripped,
            )
        )

    if overlay_on and stripped and re.fullmatch(r"(?i)(part\s*\d+|clip\s*\d+|\d+|highlight)", stripped):
        findings.append(
            Finding(
                "originality.decorative_overlay", "warn",
                "Overlay hanya penanda urutan ('Part 2'), bukan informasi baru. "
                "Tambahkan konteks yang berguna bagi penonton.",
                evidence=stripped,
            )
        )

    if not caption.strip():
        findings.append(
            Finding("originality.no_caption", "info", "Caption unggahan masih kosong.")
        )

    return findings


def lint_candidate(
    candidate: Candidate,
    config: Config,
    video_path: str | Path | None = None,
    transcript: Transcript | None = None,
    caption: str = "",
    overlay_text: str = "",
    rules: list[Rule] | None = None,
    envelope: Envelope | None = None,
) -> list[Finding]:
    """Run every compliance check that applies to one candidate."""
    rules = rules if rules is not None else load_rules(config.get("compliance.rules_file"))
    findings: list[Finding] = []

    if bool(config.get("compliance.scan_transcript", True)):
        spoken = candidate.transcript_text
        if spoken:
            findings += scan_text(
                spoken, rules, transcript, candidate.segment.start, candidate.segment.end
            )
        elif transcript is None:
            findings.append(
                Finding(
                    "transcript.missing", "info",
                    "Tidak ada transkrip, jadi klaim lisan tidak diperiksa. "
                    "Pasang faster-whisper agar pemeriksaan ini aktif.",
                )
            )

    # Overlay and caption are text we author, so lint them too.
    for label, text in (("caption", caption), ("overlay", overlay_text)):
        for finding in scan_text(text, rules):
            finding.message = f"[{label}] {finding.message}"
            findings.append(finding)

    if video_path and bool(config.get("compliance.detect_music", True)):
        findings += check_music(video_path, candidate, envelope)

    findings += check_added_value(candidate, caption, overlay_text, config)

    order = {"block": 0, "warn": 1, "info": 2}
    findings.sort(key=lambda f: (order.get(f.severity, 3), f.rule_id))
    return findings


def summarize(findings: list[Finding]) -> dict[str, int]:
    counts = {"block": 0, "warn": 0, "info": 0}
    for f in findings:
        counts[f.severity] = counts.get(f.severity, 0) + 1
    return counts
