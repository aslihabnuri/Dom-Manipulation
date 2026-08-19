"""Point-and-click front end for Google Colab.

Two notebook cells is the whole interface: one installs, one calls ``app()``.
Everything below is presentation -- the scoring, linting and rendering all come
from the tested package.

The flow is deliberately two-stage. Finding moments is fast; encoding is slow.
So the operator sees the proposed clips and fixes the on-screen text first, and
only then pays for rendering.
"""

from __future__ import annotations

import shutil
import traceback
from datetime import datetime
from pathlib import Path

from .config import Config
from .pipeline import (
    SessionInput, analyze_session, build_captions, relint, render_result,
)
from .report import fmt_time, render_markdown, write_markdown
from .workspace import FoundSession, default_root, scan

CSS = """
<style>
.clp-card{border:1px solid #e3e3e8;border-radius:12px;padding:16px 18px;margin:10px 0;
  background:#fff;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
.clp-h{font-size:15px;font-weight:600;color:#111;margin:0 0 2px}
.clp-sub{font-size:13px;color:#6b6b76;margin:0 0 10px;line-height:1.5}
.clp-step{display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;
  border-radius:50%;background:#111;color:#fff;font-size:12px;font-weight:700;margin-right:8px}
.clp-ok{color:#0a7d32}.clp-bad{color:#b3261e}.clp-warn{color:#8a5a00}
.clp-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
.clp-title{font-size:20px;font-weight:700;margin:0 0 4px}
.clp-pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;
  font-weight:600;margin-right:6px}
.clp-pill-ok{background:#e6f4ea;color:#0a7d32}
.clp-pill-warn{background:#fef3d7;color:#8a5a00}
.clp-pill-bad{background:#fce8e6;color:#b3261e}
.clp-note{font-size:12px;color:#5f6368;line-height:1.6;margin:6px 0 0}
</style>
"""


def _widgets():
    try:
        import ipywidgets as widgets  # type: ignore

        return widgets
    except ImportError as exc:  # pragma: no cover - Colab always has it
        raise RuntimeError(
            "ipywidgets belum terpasang. Jalankan sel pertama notebook terlebih dahulu."
        ) from exc


def mount_drive() -> Path:
    """Mount Google Drive when running inside Colab. Safe to call twice."""
    try:
        from google.colab import drive  # type: ignore
    except ImportError:
        return default_root()

    target = Path("/content/drive")
    if not (target / "MyDrive").is_dir():
        drive.mount(str(target))
    return default_root()


def _parse_clock(text: str, day: datetime | None = None) -> datetime | None:
    """Read '19:00', '19.00' or '7 PM' into a datetime on ``day``."""
    raw = (text or "").strip().upper().replace(".", ":")
    if not raw:
        return None
    base = (day or datetime.now()).replace(hour=0, minute=0, second=0, microsecond=0)
    for fmt in ("%H:%M", "%H:%M:%S", "%I:%M %p", "%I %p"):
        try:
            parsed = datetime.strptime(raw, fmt)
            return base.replace(hour=parsed.hour, minute=parsed.minute)
        except ValueError:
            continue
    return None


class ClipperApp:
    """The whole notebook UI."""

    def __init__(self, root: str | Path | None = None, config: Config | None = None):
        self.w = _widgets()
        self.root = Path(root).expanduser() if root else mount_drive()
        self.config = config or Config()
        self.sessions: list[FoundSession] = []
        self.session: SessionInput | None = None
        self.output = None
        self.rows: list[tuple] = []
        self._build()

    # ---------------------------------------------------------------- layout

    def _build(self) -> None:
        w = self.w

        self.folder = w.Dropdown(options=[], description="", layout=w.Layout(width="440px"))
        self.folder.observe(self._on_folder_change, names="value")
        self.refresh = w.Button(description="Segarkan", icon="refresh",
                                layout=w.Layout(width="120px"))
        self.refresh.on_click(lambda _: self.rescan())
        self.found = w.HTML()

        self.clock = w.Text(value="19:00", layout=w.Layout(width="110px"))
        self.count = w.IntSlider(value=6, min=1, max=12, continuous_update=False,
                                 layout=w.Layout(width="320px"))
        self.frame = w.RadioButtons(
            options=[
                ("Tampilkan seluruh layar, sisi diisi latar buram", "blur"),
                ("Potong bagian tengah agar penuh layar", "cover"),
            ],
            value="blur", layout=w.Layout(width="480px"),
        )

        self.find_btn = w.Button(
            description="Cari Momen Terbaik", button_style="primary",
            icon="search", layout=w.Layout(width="260px", height="42px"),
        )
        self.find_btn.on_click(self._on_find)

        self.log = w.Output()
        self.results = w.VBox([])
        self.actions = w.HBox([])

        self.panel = w.VBox([
            w.HTML(CSS + '<div class="clp-card">'
                   '<p class="clp-title">Mesin Clipper TikTok LIVE</p>'
                   '<p class="clp-sub">Pilih folder live Anda, lalu klik tombolnya. '
                   'Klip jadi akan tersimpan kembali ke Google Drive Anda.</p></div>'),
            self._section(1, "Pilih folder live Anda",
                          "Folder di Google Drive yang berisi rekaman live dan file data performa.",
                          w.HBox([self.folder, self.refresh]), self.found),
            self._section(2, "Jam berapa rekaman dimulai?",
                          "Lihat jam pada detik pertama video. Kalau ini salah, jam pada laporan "
                          "tidak akan cocok dengan isi rekaman.",
                          self.clock),
            self._section(3, "Berapa klip yang Anda mau?",
                          "Klip diambil dari jam-jam dengan penonton ramai dan sales tinggi.",
                          self.count),
            self._section(4, "Bentuk video",
                          "Rekaman live biasanya melebar; keduanya menghasilkan video tegak 9:16.",
                          self.frame),
            self.find_btn,
            self.log,
            self.results,
            self.actions,
        ])

    def _section(self, number: int, title: str, subtitle: str, *controls):
        w = self.w
        header = w.HTML(
            f'<div style="margin-top:14px">'
            f'<span class="clp-step">{number}</span>'
            f'<span class="clp-h">{title}</span>'
            f'<p class="clp-sub" style="margin-left:30px">{subtitle}</p></div>'
        )
        return w.VBox([header, *controls])

    # ------------------------------------------------------------- behaviour

    def rescan(self) -> None:
        self.found.value = '<p class="clp-sub">Mencari folder...</p>'
        self.sessions = scan(self.root)
        if not self.sessions:
            self.folder.options = []
            self.found.value = (
                f'<p class="clp-sub clp-bad">Tidak ada rekaman video ditemukan di '
                f'<span class="clp-mono">{self.root}</span>.<br>'
                'Pastikan video live sudah selesai diunggah ke Google Drive.</p>'
            )
            return
        self.folder.options = [(s.label, i) for i, s in enumerate(self.sessions)]
        self.folder.value = 0
        self._on_folder_change(None)

    def _on_folder_change(self, _change) -> None:
        session = self._selected()
        if session is None:
            self.found.value = ""
            return

        lines = []
        for text in session.describe():
            ok = "tidak ditemukan" not in text
            css = "clp-ok" if ok else "clp-bad"
            mark = "&#10003;" if ok else "&#10007;"
            lines.append(f'<span class="{css}">{mark}</span> <span class="clp-mono">{text}</span>')

        hint = ""
        if not session.ready:
            hint = ('<p class="clp-note clp-bad">Folder ini belum lengkap. Pastikan rekaman live '
                    'dan file data performa (CSV atau Excel) ada di folder yang sama.</p>')
        self.found.value = f'<div class="clp-card">{"<br>".join(lines)}{hint}</div>'
        self.find_btn.disabled = not session.ready

    def _selected(self) -> FoundSession | None:
        if not self.sessions or self.folder.value is None:
            return None
        return self.sessions[int(self.folder.value)]

    def _apply_settings(self) -> None:
        self.config.data["scoring"]["max_clips_per_session"] = int(self.count.value)
        self.config.data["render"]["reframe"] = self.frame.value

    def _on_find(self, _button) -> None:
        found = self._selected()
        self.results.children = []
        self.actions.children = []
        self.log.clear_output()

        with self.log:
            if found is None or not found.ready:
                print("Pilih folder yang berisi video dan data performa dulu.")
                return

            live_start = _parse_clock(
                self.clock.value,
                datetime.combine(found.live_date, datetime.min.time()) if found.live_date else None,
            )
            if live_start is None:
                print(f"Jam '{self.clock.value}' tidak dikenali. Tulis seperti 19:00.")
                return

            self._apply_settings()
            # Clips land back in the same Drive folder, so nothing needs downloading.
            klip = found.folder / "klip"
            self.config.data["paths"]["output_dir"] = str(klip)
            self.config.data["paths"]["ledger"] = str(klip / "riwayat.json")

            self.session = SessionInput(
                video=found.video, performance=found.performance,
                session_id=found.session_id, live_start=live_start,
                transcript_path=found.transcript,
                output_dir=klip, work_dir=klip / ".kerja",
            )

            self.find_btn.disabled = True
            try:
                print("Membaca rekaman dan data performa...")
                self.output = analyze_session(self.session, self.config, log=print)
            except Exception as exc:
                print(f"\nGagal: {exc}")
                if not isinstance(exc, (ValueError, FileNotFoundError)):
                    traceback.print_exc()
                return
            finally:
                self.find_btn.disabled = False

        self._show_results()

    # --------------------------------------------------------------- results

    def _show_results(self) -> None:
        w = self.w
        if self.output is None or not self.output.results:
            self.results.children = [w.HTML(
                '<div class="clp-card clp-bad">Tidak ada momen yang memenuhi syarat. '
                'Coba naikkan jumlah klip, atau periksa lagi jam mulai rekaman.</div>'
            )]
            return

        self.rows = []
        blocks = [w.HTML(
            '<div class="clp-card"><p class="clp-h">Momen yang ditemukan</p>'
            '<p class="clp-sub">Periksa teks yang akan tampil di video. Ubah bila perlu, '
            'hilangkan centang untuk klip yang tidak Anda inginkan, lalu klik tombol di bawah.</p></div>'
        )]

        for index, result in enumerate(self.output.results, 1):
            block, controls = self._result_block(index, result)
            blocks.append(block)
            self.rows.append(controls)

        self.results.children = blocks

        make = w.Button(description="Buat Klip Terpilih", button_style="success",
                        icon="scissors", layout=w.Layout(width="260px", height="42px"))
        make.on_click(self._on_render)
        self.actions.children = [make]

    def _result_block(self, index: int, result):
        w = self.w
        candidate = result.candidate
        segment = candidate.segment

        blocking = [f for f in result.findings if f.severity == "block"]
        warnings = [f for f in result.findings if f.severity == "warn"]

        if blocking:
            pill = '<span class="clp-pill clp-pill-bad">TIDAK BOLEH DIBUAT</span>'
        elif warnings:
            pill = '<span class="clp-pill clp-pill-warn">PERIKSA DULU</span>'
        else:
            pill = '<span class="clp-pill clp-pill-ok">AMAN</span>'

        header = w.HTML(
            f'<div style="margin-top:16px">{pill}'
            f'<span class="clp-h">Klip {index} &middot; menit '
            f'{fmt_time(segment.start)}&ndash;{fmt_time(segment.end)}</span>'
            f'<p class="clp-sub">{segment.duration:.0f} detik, diambil dari jam '
            f'{candidate.source_hour.label} &mdash; penonton '
            f'{candidate.source_hour.row.viewers:,.0f}, sales '
            f'Rp{candidate.source_hour.row.gmv:,.0f}</p></div>'
        )

        hook = w.Textarea(
            value=result.hook, placeholder="Tulis kalimat pembuka yang tampil di video",
            layout=w.Layout(width="560px", height="56px"),
        )
        info = w.Text(value=result.info, layout=w.Layout(width="560px"))
        caption = w.Textarea(value=result.caption, layout=w.Layout(width="560px", height="150px"))

        rewrite = w.Button(description="Tulis ulang", icon="refresh",
                           layout=w.Layout(width="140px"))
        cycle = {"at": 0}

        def on_rewrite(_button, result=result, hook=hook, caption=caption, cycle=cycle):
            # The hook feeds the caption, so a changed hook means a fresh draft
            # rather than cycling text that no longer matches the video.
            typed = hook.value.strip()
            if typed != result.hook:
                result.hook = typed
                result.caption_options = build_captions(
                    result.candidate, typed, self.session.session_id
                )
                cycle["at"] = 0
            else:
                cycle["at"] = (cycle["at"] + 1) % max(1, len(result.caption_options))
            caption.value = result.caption_options[cycle["at"]]

        rewrite.on_click(on_rewrite)
        take = w.Checkbox(value=not blocking, description="Buat klip ini", indent=False)
        take.disabled = bool(blocking)

        notes = []
        for finding in result.findings:
            if finding.severity == "info":
                continue
            css = "clp-bad" if finding.severity == "block" else "clp-warn"
            mark = "Tidak boleh" if finding.severity == "block" else "Periksa"
            notes.append(f'<span class="{css}"><b>{mark}:</b> {finding.message}</span>')

        spoken = (candidate.transcript_text or "").strip()
        if spoken:
            excerpt = spoken if len(spoken) <= 260 else spoken[:260].rsplit(" ", 1)[0] + "..."
            notes.append(f'<span style="color:#5f6368">Ucapan di klip: &ldquo;{excerpt}&rdquo;</span>')

        note_html = w.HTML(
            f'<p class="clp-note">{"<br>".join(notes)}</p>' if notes else ""
        )

        block = w.VBox([
            header,
            w.HTML('<p class="clp-sub" style="margin:6px 0 2px">Kalimat besar di atas video</p>'),
            hook,
            w.HTML('<p class="clp-sub" style="margin:6px 0 2px">Baris kecil (harga / nama produk)</p>'),
            info,
            w.HBox([
                w.HTML('<p class="clp-sub" style="margin:10px 12px 2px 0">Caption untuk diunggah</p>'),
                rewrite,
            ]),
            caption,
            w.HTML('<p class="clp-note">Disusun dari yang benar-benar diucapkan di klip ini. '
                   'Klik <b>Tulis ulang</b> untuk gaya lain.</p>'),
            note_html,
            take,
        ])
        return block, (result, hook, info, caption, take)

    def _on_render(self, _button) -> None:
        self.log.clear_output()
        with self.log:
            chosen = []
            for result, hook, info, caption, take in self.rows:
                result.hook = hook.value.strip()
                result.info = info.value.strip()
                if caption.value.strip():
                    result.caption = caption.value.strip()
                if take.value:
                    chosen.append(result)

            if not chosen:
                print("Belum ada klip yang dicentang.")
                return

            # Text may have been edited, so re-check it before encoding.
            for result in chosen:
                relint(result, self.session, self.config, self.output)

            still_blocked = [r for r in chosen if r.blocked]
            if still_blocked:
                print(f"{len(still_blocked)} klip masih bermasalah dan dilewati:")
                for result in still_blocked:
                    blocker = next(f for f in result.findings if f.blocking)
                    print(f"  - {blocker.message}")
                chosen = [r for r in chosen if not r.blocked]

            if not chosen:
                return

            print(f"Membuat {len(chosen)} klip. Ini bagian yang paling lama, mohon tunggu.\n")
            for position, result in enumerate(chosen, 1):
                print(f"[{position}/{len(chosen)}] menit "
                      f"{fmt_time(result.candidate.segment.start)}...")
                render_result(result, self.session, self.config, self.output,
                              log=print, thumbnail=False)

            if self.output.ledger is not None:
                self.output.ledger.save()

            folder = self.session.resolved_output_dir(self.config)
            write_markdown(
                render_markdown(self.output.results, self.output.hours,
                                self.session.session_id, str(self.session.video)),
                folder / "laporan.md",
            )
            self._cleanup_work()

            done = [r for r in self.output.results if r.rendered]
            print(f"\nSelesai. {len(done)} klip tersimpan di Google Drive Anda:")
            print(f"  {folder}")
            for result in done:
                print(f"  - {Path(result.video_path).name}")
            print("\nBuka folder itu di Google Drive, unduh ke HP, lalu unggah ke TikTok.")
            print("Tonton dulu tiap klip sampai habis sebelum diunggah.")
            print("Caption tiap klip ada di kartunya masing-masing di atas.")

    def _cleanup_work(self) -> None:
        """Remove subtitle scratch files so the Drive folder stays tidy."""
        work = self.session.resolved_work_dir(self.config)
        if work.is_dir():
            shutil.rmtree(work, ignore_errors=True)

    # ------------------------------------------------------------------ show

    def show(self):
        from IPython.display import display  # type: ignore

        display(self.panel)
        self.rescan()
        return self


def app(root: str | Path | None = None) -> ClipperApp:
    """Build and display the notebook interface."""
    return ClipperApp(root=root).show()
