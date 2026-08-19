"""Command line interface."""

from __future__ import annotations

import argparse
import sys
from datetime import date, datetime
from pathlib import Path

from . import report
from .config import DEFAULTS, Config
from .pipeline import SessionInput, run_session, slugify

EPILOG = """\
contoh:
  clipper web                                               # aplikasi klik-klik di browser
  clipper run --source ./Live/2026-08-18 --date 2026-08-18
  clipper run --video live.mp4 --performance perf.csv --live-start "2026-08-18 19:00"
  clipper analyze --video live.mp4 --performance perf.csv   # skor saja, tanpa render
  clipper doctor --performance perf.csv                     # cek kolom & lingkungan
  clipper check --text "dijamin putih dalam semalam"        # uji satu kalimat
"""


def _parse_date(value: str) -> date:
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y%m%d"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise argparse.ArgumentTypeError(f"tanggal tidak dikenali: {value!r} (pakai YYYY-MM-DD)")


def _parse_datetime(value: str) -> datetime:
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue
    raise argparse.ArgumentTypeError(
        f"waktu tidak dikenali: {value!r} (pakai \"YYYY-MM-DD HH:MM\")"
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="clipper",
        description="Potong momen terbaik dari rekaman TikTok LIVE berdasarkan data penonton dan sales.",
        epilog=EPILOG,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("-c", "--config", help="berkas konfigurasi YAML")
    sub = parser.add_subparsers(dest="command", required=True)

    def add_inputs(sp: argparse.ArgumentParser) -> None:
        sp.add_argument("--source", help="folder lokal, remote rclone, atau folder/URL Google Drive")
        sp.add_argument("--video", help="path rekaman live")
        sp.add_argument("--performance", help="path laporan performa (CSV/XLSX)")
        sp.add_argument("--date", type=_parse_date, help="tanggal live, untuk memilih berkas di --source")
        sp.add_argument("--live-start", type=_parse_datetime,
                        help='waktu detik ke-0 rekaman, mis. "2026-08-18 19:00"')
        sp.add_argument("--transcript", help="pakai transkrip yang sudah ada (.json/.srt)")
        sp.add_argument("--session-id", help="nama sesi (default: tanggal atau nama berkas)")

    run = sub.add_parser("run", help="jalankan seluruh alur dan render klip")
    add_inputs(run)
    run.add_argument("--max-clips", type=int, help="batas jumlah klip")
    run.add_argument("--no-captions", action="store_true", help="matikan subtitle bakar")
    run.add_argument("--no-overlay", action="store_true", help="matikan teks hook/info")
    run.add_argument("--reframe", choices=["blur", "cover"], help="cara mengisi kanvas 9:16")
    run.add_argument("--out", help="folder keluaran")

    analyze = sub.add_parser("analyze", help="skor dan pilih momen tanpa merender")
    add_inputs(analyze)
    analyze.add_argument("--max-clips", type=int)

    doctor = sub.add_parser("doctor", help="periksa lingkungan dan pemetaan kolom")
    doctor.add_argument("--performance", help="laporan performa untuk diperiksa")
    doctor.add_argument("--video", help="rekaman untuk diperiksa")

    check = sub.add_parser("check", help="uji teks terhadap aturan compliance")
    check.add_argument("--text", help="kalimat yang diuji")
    check.add_argument("--file", help="berkas teks/transkrip yang diuji")

    ledger = sub.add_parser("ledger", help="lihat riwayat klip yang sudah dibuat")
    ledger.add_argument("--mark-published", help="tandai satu berkas keluaran sebagai sudah diunggah")

    web = sub.add_parser("web", help="buka aplikasi klik-klik di browser (tanpa mengetik perintah)")
    web.add_argument("--folder", help="folder induk yang berisi folder-folder live")
    web.add_argument("--port", type=int, default=8765, help="port server lokal")
    web.add_argument("--no-browser", action="store_true", help="jangan buka browser otomatis")

    sub.add_parser("init", help="tulis clipper.yaml berisi seluruh opsi beserta nilai bawaan")
    return parser


def _resolve_inputs(args: argparse.Namespace, config: Config) -> tuple[Path, Path, str]:
    from .ingest.drive import resolve_session

    video = Path(args.video).expanduser() if args.video else None
    perf = Path(args.performance).expanduser() if args.performance else None

    if (video is None or perf is None) and args.source:
        found_video, found_perf = resolve_session(
            args.source, args.date, config.path("paths.work_dir"),
            credentials=config.get("drive.credentials", ""),
            token=config.get("drive.token", ""),
        )
        video = video or found_video
        perf = perf or found_perf

    if video is None:
        raise SystemExit("error: rekaman tidak ditemukan. Pakai --video atau --source.")
    if perf is None:
        raise SystemExit("error: data performa tidak ditemukan. Pakai --performance atau --source.")
    if not video.exists():
        raise SystemExit(f"error: berkas video tidak ada: {video}")
    if not perf.exists():
        raise SystemExit(f"error: berkas performa tidak ada: {perf}")

    session_id = args.session_id or (str(args.date) if args.date else video.stem)
    return video, perf, slugify(session_id)


def _apply_overrides(args: argparse.Namespace, config: Config) -> None:
    if getattr(args, "max_clips", None):
        config.data["scoring"]["max_clips_per_session"] = args.max_clips
    if getattr(args, "no_captions", False):
        config.data["captions"]["enabled"] = False
    if getattr(args, "no_overlay", False):
        config.data["overlay"]["enabled"] = False
    if getattr(args, "reframe", None):
        config.data["render"]["reframe"] = args.reframe
    if getattr(args, "out", None):
        config.data["paths"]["output_dir"] = args.out


def cmd_run(args: argparse.Namespace, config: Config, render: bool = True) -> int:
    _apply_overrides(args, config)
    video, perf, session_id = _resolve_inputs(args, config)

    session = SessionInput(
        video=video, performance=perf, session_id=session_id,
        live_start=args.live_start,
        transcript_path=Path(args.transcript).expanduser() if args.transcript else None,
    )

    result = run_session(session, config, log=print, render=render, dry_run=not render)
    report.print_console(result.results, result.hours)

    out_dir = config.path("paths.output_dir") / session_id
    payload = report.to_dict(result.results, result.hours, session_id, str(video))
    json_path = report.write_json(payload, out_dir / "report.json")
    md_path = report.write_markdown(
        report.render_markdown(result.results, result.hours, session_id, str(video)),
        out_dir / "report.md",
    )
    print(f"Laporan: {md_path}")
    print(f"         {json_path}")

    blocked = sum(1 for r in result.results if r.blocked)
    if blocked:
        print(f"\n{blocked} klip diblokir - baca laporan sebelum menindaklanjuti.")
    return 0


def cmd_doctor(args: argparse.Namespace, config: Config) -> int:
    from . import transcribe as tr
    from .ffmpeg import FFmpegError, available, ffmpeg_bin, ffprobe_bin, probe
    from .ingest.drive import rclone_available

    print("Lingkungan")
    print(f"  python           : {sys.version.split()[0]}")
    if available():
        print(f"  ffmpeg           : {ffmpeg_bin()}")
    else:
        print("  ffmpeg           : TIDAK ADA - render tidak bisa jalan")
    print(f"  ffprobe          : {ffprobe_bin() or 'tidak ada (pakai fallback ffmpeg)'}")
    print(f"  faster-whisper   : {'ada' if tr.is_available() else 'tidak ada - caption & cek klaim lisan mati'}")
    print(f"  rclone           : {'ada' if rclone_available() else 'tidak ada'}")
    try:
        import openpyxl  # type: ignore  # noqa: F401  (probe only)

        print("  openpyxl         : ada")
    except ImportError:
        print("  openpyxl         : tidak ada - hanya bisa baca CSV")

    problems = config.validate()
    print(f"\nKonfigurasi{f' ({config.source})' if config.source else ' (bawaan)'}")
    if problems:
        for p in problems:
            print(f"  MASALAH: {p}")
    else:
        print("  semua nilai valid")

    if args.performance:
        from .ingest.performance import describe_mapping, load_performance

        print(f"\nPemetaan kolom: {Path(args.performance).name}")
        try:
            for field, column in describe_mapping(args.performance).items():
                print(f"  {field:<10} <- {column!r}")
            rows = load_performance(args.performance)
            print(f"  {len(rows)} baris terbaca, {rows[0].start:%H:%M} - {rows[-1].end:%H:%M}")
            print(f"  total penonton {sum(r.viewers for r in rows):,.0f}, "
                  f"total sales {sum(r.gmv for r in rows):,.0f}")
        except Exception as exc:
            print(f"  GAGAL: {exc}")
            return 1

    if args.video:
        print(f"\nVideo: {Path(args.video).name}")
        try:
            info = probe(args.video)
            print(f"  {info.width}x{info.height}, {info.duration / 3600:.2f} jam, "
                  f"{info.fps:g} fps, audio={'ya' if info.has_audio else 'tidak'}")
        except (FFmpegError, FileNotFoundError) as exc:
            print(f"  GAGAL: {exc}")
            return 1
    return 0


def cmd_check(args: argparse.Namespace, config: Config) -> int:
    from .compliance.linter import scan_text
    from .compliance.rules import load_rules

    if args.file:
        text = Path(args.file).expanduser().read_text(encoding="utf-8", errors="replace")
    elif args.text:
        text = args.text
    else:
        text = sys.stdin.read()

    findings = scan_text(text, load_rules(config.get("compliance.rules_file")))
    if not findings:
        print("Tidak ada masalah yang terdeteksi.")
        return 0

    for f in findings:
        print(f"{report.SEVERITY_MARK.get(f.severity, '[?]')} {f.rule_id}: {f.message}")
        if f.evidence:
            print(f'        bukti: "{f.evidence.strip()[:160]}"')
    return 1 if any(f.blocking for f in findings) else 0


def cmd_ledger(args: argparse.Namespace, config: Config) -> int:
    from .compliance.dedupe import Ledger, _fmt

    ledger = Ledger.load(config.path("paths.ledger"))

    if args.mark_published:
        if ledger.mark_published(args.mark_published):
            ledger.save()
            print(f"Ditandai sudah diunggah: {args.mark_published}")
            return 0
        print(f"Tidak ditemukan di ledger: {args.mark_published}")
        return 1

    if not ledger.entries:
        print("Ledger masih kosong.")
        return 0

    print(f"{len(ledger.entries)} klip di {ledger.path}\n")
    for entry in ledger.entries:
        state = "diunggah" if entry.published else "dirender"
        print(f"  {entry.session_id:<14} {_fmt(entry.start)}-{_fmt(entry.end):<10} "
              f"{state:<9} {Path(entry.output).name if entry.output else ''}")
    return 0


def cmd_web(args: argparse.Namespace, config: Config) -> int:
    from .web import serve

    serve(
        root=args.folder, config=config, port=args.port,
        open_browser=not args.no_browser,
    )
    return 0


def cmd_init(config: Config) -> int:
    target = Path("clipper.yaml")
    if target.exists():
        print(f"{target} sudah ada - tidak ditimpa.")
        return 1
    try:
        import yaml  # type: ignore

        body = yaml.safe_dump(DEFAULTS, sort_keys=False, allow_unicode=True)
    except ImportError:
        import json

        body = json.dumps(DEFAULTS, indent=2, ensure_ascii=False)
        target = Path("clipper.json")

    header = (
        "# Konfigurasi clipper. Semua nilai di bawah adalah nilai bawaan;\n"
        "# hapus baris yang tidak ingin Anda ubah.\n"
    )
    target.write_text(header + body, encoding="utf-8")
    print(f"Ditulis: {target}")
    return 0


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)

    try:
        config = Config.load(args.config)
    except (FileNotFoundError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    try:
        if args.command == "run":
            return cmd_run(args, config, render=True)
        if args.command == "analyze":
            return cmd_run(args, config, render=False)
        if args.command == "doctor":
            return cmd_doctor(args, config)
        if args.command == "check":
            return cmd_check(args, config)
        if args.command == "ledger":
            return cmd_ledger(args, config)
        if args.command == "web":
            return cmd_web(args, config)
        if args.command == "init":
            return cmd_init(config)
    except KeyboardInterrupt:
        print("\ndibatalkan", file=sys.stderr)
        return 130
    except (FileNotFoundError, ValueError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
