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
from .edit import caption as caption_mod
from .edit import overlay as overlay_mod
from .edit.captions import build_ass, write_ass
from .edit.cut import extract_thumbnail, render_clip
from .ffmpeg import MediaInfo, probe
from .ingest.performance import load_performance
from .models import Candidate, ClipResult, Finding, HourScore, Transcript
from .plan import ClipPlan, restrict_to_plan
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
    # A plan decided elsewhere from the performance report alone.
    plan: ClipPlan | None = None
    # Front ends that already know where output belongs set these directly,
    # instead of getting a session_id subfolder appended to the config paths.
    output_dir: Path | None = None
    work_dir: Path | None = None

    def resolved_output_dir(self, config: Config) -> Path:
        return self.output_dir or config.path("paths.output_dir") / self.session_id

    def resolved_work_dir(self, config: Config) -> Path:
        return self.work_dir or config.path("paths.work_dir") / self.session_id


@dataclass
class SessionOutput:
    results: list[ClipResult] = field(default_factory=list)
    hours: list[HourScore] = field(default_factory=list)
    info: MediaInfo | None = None
    transcript: Transcript | None = None
    fingerprint: str = ""
    ledger: dedupe.Ledger | None = None


def build_captions(candidate: Candidate, hook: str, session_id: str) -> list[str]:
    """Draft caption options for one clip, from what the clip actually says."""
    return caption_mod.build_captions(
        candidate.transcript_text,
        hook=hook,
        hour_label=candidate.source_hour.label,
        session_id=session_id,
    )


def build_caption(candidate: Candidate, overlay, session_id: str) -> str:
    """The caption a clip ships with by default."""
    return build_captions(candidate, getattr(overlay, "hook", ""), session_id)[0]


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


def analyze_session(
    session: SessionInput,
    config: Config,
    log: Logger = print,
) -> SessionOutput:
    """Everything up to but not including rendering.

    Split out so a front end can show the proposed clips, let the operator fix
    the overlay text, and only then pay the cost of encoding.
    """
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
            "Periksa jam mulai rekaman: jam pada laporan harus sesuai dengan awal rekaman."
        )

    if session.plan is not None and session.plan.blocks:
        out.hours = restrict_to_plan(scored, session.plan)
        log(f"Mengikuti rencana: {', '.join(h.label for h in out.hours)}")
    else:
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

    out.ledger = dedupe.Ledger.load(config.path("paths.ledger"))
    out.fingerprint = dedupe.fingerprint_source(session.video, out.info.duration)
    rules = load_rules(config.get("compliance.rules_file"))

    log(f"Memeriksa {len(candidates)} kandidat klip...")
    for candidate in candidates:
        ov = overlay_mod.suggest(
            candidate.transcript_text, candidate.source_hour.label, candidate.score
        )
        candidate.hook = ov.hook
        options = build_captions(candidate, ov.hook, session.session_id)

        result = ClipResult(
            candidate=candidate, video_path=None, caption=options[0],
            info=ov.info, caption_options=options,
        )
        result.findings = _lint(result, session, config, out, rules, candidates)
        out.results.append(result)

    return out


def _lint(
    result: ClipResult,
    session: SessionInput,
    config: Config,
    out: SessionOutput,
    rules,
    batch: list[Candidate],
) -> list[Finding]:
    """Run every compliance check for one clip, most severe first."""
    candidate = result.candidate

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
        caption=result.caption, overlay_text=result.overlay_text,
        rules=rules, envelope=envelope,
    )
    if out.ledger is not None:
        findings += dedupe.check_duplicate(
            candidate, out.ledger, out.fingerprint, config, batch
        )

    # Duplicate findings are appended after linting, so re-sort to keep the most
    # severe first -- callers surface findings[0].
    severity_order = {"block": 0, "warn": 1, "info": 2}
    findings.sort(key=lambda f: (severity_order.get(f.severity, 3), f.rule_id))
    return findings


def relint(
    result: ClipResult,
    session: SessionInput,
    config: Config,
    out: SessionOutput,
) -> list[ClipResult]:
    """Re-check one clip after its hook or caption was edited."""
    rules = load_rules(config.get("compliance.rules_file"))
    result.findings = _lint(
        result, session, config, out, rules, [r.candidate for r in out.results]
    )
    return out.results


def render_result(
    result: ClipResult,
    session: SessionInput,
    config: Config,
    out: SessionOutput,
    log: Logger = print,
    thumbnail: bool = False,
) -> ClipResult:
    """Encode one analysed clip, using whatever overlay text it now carries."""
    candidate = result.candidate
    stem = f"{session.session_id}_{candidate.slug}"
    output_dir = session.resolved_output_dir(config)
    work_dir = session.resolved_work_dir(config)

    width = int(config.get("render.width", 1080))
    height = int(config.get("render.height", 1920))
    ov = overlay_mod.OverlayText(hook=result.hook, info=result.info)

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
    except Exception as exc:
        result.findings.append(Finding("render.failed", "warn", f"Render gagal: {exc}"))
        log(f"  render gagal: {exc}")
        return result

    result.video_path = str(rendered)
    result.rendered = True

    if thumbnail:
        try:
            result.thumbnail = str(extract_thumbnail(
                session.video, candidate.segment.start + 1.0,
                work_dir / f"{stem}.jpg", config,
            ))
        except Exception:
            pass

    if out.ledger is not None:
        out.ledger.add(
            candidate, session.session_id, out.fingerprint,
            output=str(rendered), caption=result.caption,
        )
    log(f"  dirender: {rendered.name}")
    return result


def run_session(
    session: SessionInput,
    config: Config,
    log: Logger = print,
    render: bool = True,
    dry_run: bool = False,
) -> SessionOutput:
    """Score, refine, lint and render clips for one live session."""
    out = analyze_session(session, config, log)

    log(f"Menyiapkan {len(out.results)} klip...")
    for index, result in enumerate(out.results, 1):
        if result.blocked:
            blocker = next(f for f in result.findings if f.blocking)
            log(f"  [{index}] DIBLOKIR: {blocker.message[:100]}")
        elif render and not dry_run:
            render_result(result, session, config, out, log=lambda m: log(f"  [{index}]{m}"))
        else:
            log(f"  [{index}] {result.candidate.slug} siap (dry-run, tidak dirender)")

    if not dry_run and out.ledger is not None:
        out.ledger.save()
    return out


def slugify(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip()).strip("-")
    return slug or "session"
