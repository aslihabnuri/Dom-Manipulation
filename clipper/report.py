"""Human- and machine-readable output for a clipping run."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

from .models import ClipResult, Finding, HourScore

SEVERITY_MARK = {"block": "[BLOK]", "warn": "[PERIKSA]", "info": "[INFO]"}


def fmt_time(seconds: float) -> str:
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h:d}:{m:02d}:{s:02d}" if h else f"{m:d}:{s:02d}"


def to_dict(
    results: Sequence[ClipResult],
    hours: Sequence[HourScore],
    session_id: str,
    source: str,
) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "source": source,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "hours": [
            {
                "label": h.label,
                "video_start": round(h.segment.start, 2),
                "video_end": round(h.segment.end, 2),
                "viewers": h.row.viewers,
                "gmv": h.row.gmv,
                "orders": h.row.orders,
                "viewers_norm": round(h.viewers_norm, 4),
                "sales_norm": round(h.sales_norm, 4),
                "score": round(h.score, 4),
            }
            for h in hours
        ],
        "clips": [
            {
                "start": round(r.candidate.segment.start, 2),
                "end": round(r.candidate.segment.end, 2),
                "duration": round(r.candidate.segment.duration, 2),
                "score": r.candidate.score,
                "hour": r.candidate.source_hour.label,
                "hook": r.candidate.hook,
                "caption": r.caption,
                "output": r.video_path,
                "rendered": r.rendered,
                "blocked": r.blocked,
                "reasons": r.candidate.reasons,
                "transcript": r.candidate.transcript_text,
                "findings": [
                    {
                        "rule": f.rule_id, "severity": f.severity, "message": f.message,
                        "evidence": f.evidence,
                        "at": round(f.at, 2) if f.at is not None else None,
                    }
                    for f in r.findings
                ],
            }
            for r in results
        ],
    }


def write_json(payload: dict[str, Any], path: str | Path) -> Path:
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return p


def _findings_block(findings: list[Finding], indent: str = "  ") -> list[str]:
    lines: list[str] = []
    for f in findings:
        mark = SEVERITY_MARK.get(f.severity, "[?]")
        when = f" @{fmt_time(f.at)}" if f.at is not None else ""
        lines.append(f"{indent}{mark}{when} {f.message}")
        if f.evidence:
            lines.append(f'{indent}       bukti: "{f.evidence.strip()[:150]}"')
    return lines


def render_markdown(
    results: Sequence[ClipResult],
    hours: Sequence[HourScore],
    session_id: str,
    source: str,
) -> str:
    rendered = [r for r in results if r.rendered]
    blocked = [r for r in results if r.blocked]
    total_warn = sum(1 for r in results for f in r.findings if f.severity == "warn")

    lines = [
        f"# Laporan Clipping - {session_id}",
        "",
        f"Sumber: `{source}`  ",
        f"Dibuat: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
        "## Ringkasan",
        "",
        f"- Kandidat klip: **{len(results)}**",
        f"- Berhasil dirender: **{len(rendered)}**",
        f"- Diblokir compliance: **{len(blocked)}**",
        f"- Perlu diperiksa manual: **{total_warn}**",
        "",
        "## Jam terpilih",
        "",
        "| Jam | Penonton | Sales | Skor penonton | Skor sales | Skor gabungan |",
        "|-----|---------:|------:|--------------:|-----------:|--------------:|",
    ]
    for h in hours:
        lines.append(
            f"| {h.label} | {h.row.viewers:,.0f} | {h.row.gmv:,.0f} | "
            f"{h.viewers_norm:.2f} | {h.sales_norm:.2f} | **{h.score:.2f}** |"
        )

    lines += ["", "## Klip", ""]
    if not results:
        lines.append("_Tidak ada kandidat klip yang memenuhi ambang skor._")

    for i, r in enumerate(results, 1):
        c = r.candidate
        status = "dirender" if r.rendered else ("DIBLOKIR" if r.blocked else "belum dirender")
        lines += [
            f"### {i}. {fmt_time(c.segment.start)} - {fmt_time(c.segment.end)} "
            f"({c.segment.duration:.0f}s) - {status}",
            "",
            f"- Jam sumber: **{c.source_hour.label}** | skor klip: **{c.score:.2f}**",
        ]
        if c.hook:
            lines.append(f"- Hook: _{c.hook}_")
        if r.video_path:
            lines.append(f"- File: `{r.video_path}`")
        if c.reasons:
            lines.append("- Alasan dipilih:")
            lines += [f"  - {reason}" for reason in c.reasons]
        if r.caption:
            lines += ["", "**Caption siap pakai:**", "", "```", r.caption, "```"]
        if r.findings:
            lines += ["", "**Catatan compliance:**", ""]
            lines += _findings_block(r.findings, indent="")
        if c.transcript_text:
            excerpt = c.transcript_text.strip()
            if len(excerpt) > 400:
                excerpt = excerpt[:400].rsplit(" ", 1)[0] + "..."
            lines += ["", f"> {excerpt}"]
        lines.append("")

    lines += [
        "---",
        "",
        "## Sebelum upload",
        "",
        "1. Tonton tiap klip sampai habis - linter memeriksa teks, bukan gambar.",
        "2. Pastikan tidak ada musik berhak cipta di latar; ganti audio bila ada.",
        "3. Jangan unggah dua klip dari momen yang sama; ledger sudah menjaganya.",
        "4. Jangan pernah memutar klip ini ke dalam sesi LIVE - itu pelanggaran tersendiri.",
        "5. Tulis caption yang menambah konteks, bukan sekadar menyalin ucapan di video.",
        "",
    ]
    return "\n".join(lines)


def write_markdown(content: str, path: str | Path) -> Path:
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return p


def print_console(results: Sequence[ClipResult], hours: Sequence[HourScore]) -> None:
    """Compact terminal summary of a run."""
    print()
    print("Jam terpilih:")
    for h in hours:
        bar = "#" * int(h.score * 20)
        print(f"  {h.label}  {h.score:.2f} {bar:<20}  penonton {h.row.viewers:>8,.0f}  sales {h.row.gmv:>12,.0f}")

    print()
    print(f"Kandidat klip: {len(results)}")
    for i, r in enumerate(results, 1):
        c = r.candidate
        counts = {"block": 0, "warn": 0, "info": 0}
        for f in r.findings:
            counts[f.severity] = counts.get(f.severity, 0) + 1
        flags = []
        if counts["block"]:
            flags.append(f"{counts['block']} blok")
        if counts["warn"]:
            flags.append(f"{counts['warn']} periksa")
        state = "OK " if r.rendered else ("BLK" if r.blocked else "-- ")
        suffix = f"  ({', '.join(flags)})" if flags else ""
        print(
            f"  [{state}] {i}. {fmt_time(c.segment.start)}-{fmt_time(c.segment.end)}"
            f"  {c.segment.duration:>4.0f}s  skor {c.score:.2f}  jam {c.source_hour.label}{suffix}"
        )
    print()
