"""End-to-end run: performance data in, compliant clips out."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Callable

from .audio import rms_envelope
from .compliance import dedupe, linter
from .compliance.rules import load_rules
from .config import Config
from .edit import overlay as overlay_mod
from .edit.captions import build_ass, write_ass
from .edit.cut import render_clip
from .ffmpeg import MediaInfo, probe
from .ingest.performance import load_performance
from .models import Candidate, ClipResult, Finding, HourScore, Transcript
from .scoring.refine import refine_hour
from .scoring.score import score_hours, select_hours

Logger = Callable[[str], None]


@dataclass
class SessionInput:
    video: Path
    performance: Path
    session_id: str
    live_start: datetime | None = None
    transcript_path: Path | None = None


@dataclass
class SessionOutput:
    results: list[ClipResult] = field(default_factory=list)
    hours: list[HourScore] = field(default_factory=list)
    info: MediaInfo | None = None
    transcript: Transcript | None = None
    fingerprint: str = ""


def build_caption(candidate: Candidate, overlay: overlay_mod.OverlayText, session_id: str) -> str:
    """Draft the upload caption.

    Written as context the viewer does not get from the video alone -- which is
    also what makes the post carry new value rather than being a bare re-upload.
    """
    lines: list[str] = []
    if overlay.hook:
        lines.append(overlay.hook.rstrip(".") + ".")

    price = overlay_mod.find_price(candidate.transcript_text)
    detail = f"Potongan LIVE {session_id} jam {candidate.source_hour.label}"
    if price:
        detail += f" - {price}"
    lines.append(detail + ".")
    lines.append("Detail lengkap & stok terbaru ada di keranjang.")
    lines.append("")
    lines.append("#tiktokshop #livehighlight #rekomendasiproduk")
    return "\n".join(lines)


def _transcribe_hours(
    video: Path, hours: list[HourScore], config: Config, log: Logger
) -> Transcript | None:
    """Transcribe only the hours we intend to clip.

    A four-hour live takes a long time to transcribe in full and we only ever
    look at two or three hours of it, so this is where most of the runtime is
    saved.
    """
    if not bool(config.get("transcribe.enabled", True)):
        return None

    from . import transcribe as tr

    if not tr.is_available():
        log("  transkripsi dilewati (faster-whisper belum terpasang) - "
            "caption dan pemeriksaan klaim lisan tidak aktif")
        return None

    merged = Transcript(segments=[])
    for hour in hours:
        span = hour.segment
        log(f"  transkrip jam {hour.label} ({span.duration / 60:.0f} menit)...")
        try:
            part = tr.transcribe(video, config, start=span.start, duration=span.duration)
        except Exception as exc:
            log(f"  transkripsi jam {hour.label} gagal: {exc}")
            continue
        merged.segments.extend(part.segments)
        merged.language = part.language

    merged.segments.sort(key=lambda s: s.start)
    return merged if merged.segments else None


def run_session(
    session: SessionInput,
    config: Config,
    log: Logger = print,
    render: bool = True,
    dry_run: bool = False,
) -> SessionOutput:
    """Score, refine, lint and render clips for one live session."""
    problems = config.validate()
    if problems:
        raise ValueError("konfigurasi bermasalah:\n  - " + "\n  - ".join(problems))

    out = SessionOutput()

    log(f"Membaca video: {session.video.name}")
    out.info = probe(session.video)
    log(f"  {out.info.width}x{out.info.height}, {out.info.duration / 3600:.2f} jam, "
        f"audio={'ya' if out.info.has_audio else 'tidak'}")

    log(f"Membaca data performa: {session.performance.name}")
    rows = load_performance(session.performance, base_date=session.live_start)
    log(f"  {len(rows)} baris, {rows[0].start:%H:%M} - {rows[-1].end:%H:%M}")

    scored = score_hours(rows, config, live_start=session.live_start, video_duration=out.info.duration)
    if not scored:
        raise ValueError(
            "tidak ada baris performa yang jatuh di dalam durasi rekaman. "
            "Periksa --live-start: jam pada laporan harus sesuai dengan awal rekaman."
        )

    out.hours = select_hours(scored, config)
    log(f"Jam terpilih: {', '.join(h.label for h in out.hours)}")

    # Transcript drives caption burn-in, moment refinement and claim scanning.
    if session.transcript_path and session.transcript_path.exists():
        from . import transcribe as tr

        log(f"Memuat transkrip: {session.transcript_path.name}")
        out.transcript = tr.load(session.transcript_path)
    else:
        out.transcript = _transcribe_hours(session.video, out.hours, config, log)

    log("Mencari momen terbaik di tiap jam...")
    candidates: list[Candidate] = []
    for hour in out.hours:
        found = refine_hour(str(session.video), hour, config, out.transcript)
        log(f"  jam {hour.label}: {len(found)} kandidat")
        candidates.extend(found)

    max_clips = int(config.get("scoring.max_clips_per_session", 6))
    overlap_limit = float(config.get("compliance.max_overlap_with_published", 0.25))
    candidates = dedupe.drop_overlapping(candidates, overlap_limit)
    candidates = sorted(candidates, key=lambda c: c.score, reverse=True)[:max_clips]
    candidates.sort(key=lambda c: c.segment.start)

    ledger = dedupe.Ledger.load(config.path("paths.ledger"))
    out.fingerprint = dedupe.fingerprint_source(session.video, out.info.duration)
    rules = load_rules(config.get("compliance.rules_file"))

    output_dir = config.path("paths.output_dir") / session.session_id
    work_dir = config.path("paths.work_dir") / session.session_id

    log(f"Menyiapkan {len(candidates)} klip...")
    for index, candidate in enumerate(candidates, 1):
        text = candidate.transcript_text
        ov = overlay_mod.suggest(text, candidate.source_hour.label, candidate.score)
        candidate.hook = ov.hook
        caption = build_caption(candidate, ov, session.session_id)

        envelope = None
        try:
            envelope = rms_envelope(
                str(session.video), candidate.segment.start, candidate.segment.duration, hop=0.2
            )
        except Exception:
            pass

        findings = linter.lint_candidate(
            candidate, config,
            video_path=session.video, transcript=out.transcript,
            caption=caption, overlay_text=f"{ov.hook} {ov.info}".strip(),
            rules=rules, envelope=envelope,
        )
        findings += dedupe.check_duplicate(candidate, ledger, out.fingerprint, config, candidates)
        # Duplicate findings are appended after linting, so re-sort to keep the
        # most severe first -- the console and report both surface findings[0].
        severity_order = {"block": 0, "warn": 1, "info": 2}
        findings.sort(key=lambda f: (severity_order.get(f.severity, 3), f.rule_id))

        result = ClipResult(candidate=candidate, video_path=None, caption=caption, findings=findings)

        if result.blocked:
            blocker = next(f for f in findings if f.blocking)
            log(f"  [{index}] DIBLOKIR: {blocker.message[:100]}")
        elif render and not dry_run:
            stem = f"{session.session_id}_{candidate.slug}"
            width = int(config.get("render.width", 1080))
            height = int(config.get("render.height", 1920))
            ass = build_ass(
                out.transcript, candidate.segment.start, candidate.segment.end, config,
                extra_styles=overlay_mod.style_lines(config, width, height),
                extra_events=overlay_mod.render_events(ov, candidate.segment.duration, config),
            )
            ass_path = write_ass(ass, work_dir / f"{stem}.ass")
            target = output_dir / f"{stem}.mp4"
            try:
                rendered = render_clip(
                    session.video, candidate.segment, target, config,
                    ass_path=ass_path, title=f"{session.session_id} {candidate.source_hour.label}",
                )
                result.video_path = str(rendered)
                result.rendered = True
                ledger.add(candidate, session.session_id, out.fingerprint,
                           output=str(rendered), caption=caption)
                log(f"  [{index}] dirender: {rendered.name}")
            except Exception as exc:
                result.findings.append(
                    Finding("render.failed", "warn", f"Render gagal: {exc}")
                )
                log(f"  [{index}] render gagal: {exc}")
        else:
            log(f"  [{index}] {candidate.slug} siap (dry-run, tidak dirender)")

        out.results.append(result)

    if not dry_run:
        ledger.save()
    return out


def slugify(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip()).strip("-")
    return slug or "session"
