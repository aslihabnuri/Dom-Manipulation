"""Local web front end.

Runs a small HTTP server on 127.0.0.1 and opens a browser, so the whole tool is
usable without a terminal. Built on the standard library only -- adding Flask
would mean one more thing for a non-technical operator to install.

Security: the socket is bound to loopback, every API call must carry a secret
generated at startup, and the Host header is checked. That combination stops a
web page the operator happens to be visiting from driving this server.
"""

from __future__ import annotations

import json
import mimetypes
import secrets
import shutil
import threading
import traceback
import webbrowser
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

from .config import Config
from .pipeline import (
    SessionInput, analyze_session, build_captions, relint, render_result,
)
from .report import fmt_time, render_markdown, write_markdown
from .plan import load_plan
from .staging import default_stage_dir, stage
from .workspace import default_root, human_size, scan

ASSETS = Path(__file__).parent / "assets"
ALLOWED_HOSTS = {"127.0.0.1", "localhost", "[::1]"}


class Job:
    """A background task the browser polls for progress."""

    def __init__(self, name: str):
        self.id = secrets.token_hex(8)
        self.name = name
        self.status = "running"  # running | done | error
        self.lines: list[str] = []
        self.payload: dict[str, Any] = {}
        self.error = ""
        self._lock = threading.Lock()

    def log(self, message: str) -> None:
        with self._lock:
            self.lines.append(str(message).rstrip())

    def snapshot(self) -> dict[str, Any]:
        with self._lock:
            return {
                "id": self.id, "name": self.name, "status": self.status,
                "lines": list(self.lines), "payload": self.payload, "error": self.error,
            }


class State:
    """Everything the server remembers between requests."""

    def __init__(self, root: Path, config: Config):
        self.root = root
        self.config = config
        self.sessions = []
        self.session: SessionInput | None = None
        self.output = None
        self.jobs: dict[str, Job] = {}

    def start(self, name: str, target) -> Job:
        job = Job(name)
        self.jobs[job.id] = job

        def run() -> None:
            try:
                target(job)
                job.status = "done"
            except Exception as exc:  # surfaced to the browser, not swallowed
                job.status = "error"
                job.error = str(exc)
                job.log(f"Gagal: {exc}")
                if not isinstance(exc, (ValueError, FileNotFoundError, RuntimeError)):
                    job.log(traceback.format_exc())

        threading.Thread(target=run, daemon=True).start()
        return job


def clip_json(index: int, result) -> dict[str, Any]:
    candidate = result.candidate
    hour = candidate.source_hour
    return {
        "index": index,
        "start": candidate.segment.start,
        "end": candidate.segment.end,
        "duration": candidate.segment.duration,
        "start_label": fmt_time(candidate.segment.start),
        "end_label": fmt_time(candidate.segment.end),
        "hour": hour.label,
        "viewers": hour.row.viewers,
        "gmv": hour.row.gmv,
        "score": candidate.score,
        "hook": result.hook,
        "info": result.info,
        "caption": result.caption,
        "caption_options": result.caption_options or [result.caption],
        "spoken": candidate.transcript_text,
        "blocked": result.blocked,
        "rendered": result.rendered,
        "video": result.video_path,
        "findings": [
            {"severity": f.severity, "message": f.message, "evidence": f.evidence}
            for f in result.findings if f.severity != "info"
        ],
    }


def timeline_json(output) -> dict[str, Any]:
    duration = output.info.duration if output.info else 0.0
    return {
        "duration": duration,
        "hours": [
            {
                "label": h.label,
                "start": h.segment.start,
                "end": h.segment.end,
                "viewers": h.row.viewers,
                "gmv": h.row.gmv,
                "score": h.score,
            }
            for h in output.hours
        ],
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "Clipper"
    state: State
    token: str

    def log_message(self, fmt: str, *args) -> None:  # keep the console quiet
        pass

    # ------------------------------------------------------------- plumbing

    def _authorised(self) -> bool:
        host = (self.headers.get("Host") or "").rsplit(":", 1)[0]
        if host not in ALLOWED_HOSTS:
            return False
        query = parse_qs(urlparse(self.path).query)
        supplied = (query.get("t") or [None])[0] or self.headers.get("X-Clipper-Token")
        return secrets.compare_digest(str(supplied or ""), self.token)

    def _send(self, code: int, body: bytes, content_type: str) -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _json(self, payload: dict[str, Any], code: int = 200) -> None:
        self._send(code, json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                   "application/json; charset=utf-8")

    def _body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length") or 0)
        if not length:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return {}

    # -------------------------------------------------------------- routing

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        route = parsed.path

        if route in ("/", "/index.html"):
            if not self._authorised():
                self._send(403, b"Buka aplikasi lewat tautan yang dicetak di jendela hitam.",
                           "text/plain; charset=utf-8")
                return
            html = (ASSETS / "ui.html").read_text(encoding="utf-8")
            html = html.replace("__TOKEN__", self.token)
            self._send(200, html.encode("utf-8"), "text/html; charset=utf-8")
            return

        if route == "/favicon.ico":
            self._send(204, b"", "image/x-icon")  # browsers ask unprompted
            return

        if not self._authorised():
            self._json({"error": "tidak diizinkan"}, 403)
            return

        if route == "/api/sessions":
            self.state.sessions = scan(self.state.root)
            self._json({
                "root": str(self.state.root),
                "sessions": [
                    {
                        "index": i,
                        "name": s.folder.name or str(s.folder),
                        "folder": str(s.folder),
                        "ready": s.ready,
                        "session_id": s.session_id,
                        "video": s.video.name if s.video else None,
                        "size": human_size(s.video.stat().st_size) if s.video else None,
                        "performance": s.performance.name if s.performance else None,
                        "transcript": s.transcript.name if s.transcript else None,
                        "plan": _plan_payload(s),
                        "date": s.live_date.isoformat() if s.live_date else None,
                    }
                    for i, s in enumerate(self.state.sessions)
                ],
            })
            return

        if route.startswith("/api/job/"):
            job = self.state.jobs.get(route.rsplit("/", 1)[-1])
            self._json(job.snapshot() if job else {"error": "job tidak ditemukan"},
                       200 if job else 404)
            return

        if route == "/api/video":
            self._serve_clip(parse_qs(parsed.query).get("path", [""])[0])
            return

        self._json({"error": "tidak ada"}, 404)

    def _serve_clip(self, path: str) -> None:
        """Stream a rendered clip back for preview, restricted to our own output."""
        if not path:
            self._json({"error": "path kosong"}, 400)
            return
        target = Path(path).resolve()
        allowed = self.state.config.path("paths.output_dir").resolve()
        try:
            target.relative_to(allowed)
        except ValueError:
            self._json({"error": "di luar folder keluaran"}, 403)
            return
        if not target.is_file():
            self._json({"error": "berkas tidak ada"}, 404)
            return

        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        self._send(200, target.read_bytes(), content_type)

    def do_POST(self) -> None:
        if not self._authorised():
            self._json({"error": "tidak diizinkan"}, 403)
            return

        route = urlparse(self.path).path
        body = self._body()

        if route == "/api/analyze":
            self._json({"job": self._analyze(body).id})
        elif route == "/api/render":
            self._json({"job": self._render(body).id})
        elif route == "/api/caption":
            self._json(self._caption(body))
        else:
            self._json({"error": "tidak ada"}, 404)

    def _caption(self, body: dict[str, Any]) -> dict[str, Any]:
        """Redraft one clip's caption, quick enough to answer inline."""
        state = self.state
        if state.output is None or state.session is None:
            return {"error": "belum ada momen yang dicari"}

        position = int(body.get("index", 0)) - 1
        if not 0 <= position < len(state.output.results):
            return {"error": "klip tidak ditemukan"}

        result = state.output.results[position]
        result.hook = str(body.get("hook", "")).strip()
        result.caption_options = build_captions(
            result.candidate, result.hook, state.session.session_id
        )
        result.caption = result.caption_options[0]
        return {"options": result.caption_options}

    # --------------------------------------------------------------- actions

    def _analyze(self, body: dict[str, Any]) -> Job:
        state = self.state
        index = int(body.get("session", 0))
        clock = str(body.get("clock", "19:00"))
        count = int(body.get("count", 6))
        reframe = str(body.get("reframe", "blur"))

        def work(job: Job) -> None:
            # A page left open across a server restart would otherwise post an
            # index against an empty list, so rebuild it on demand.
            if not state.sessions:
                state.sessions = scan(state.root)
            if not state.sessions:
                raise ValueError(f"tidak ada rekaman ditemukan di {state.root}")
            if index >= len(state.sessions):
                raise ValueError("folder yang dipilih sudah tidak ada -- klik Segarkan daftar")
            found = state.sessions[index]
            if not found.ready:
                raise ValueError(
                    "folder ini belum lengkap -- butuh rekaman video dan berkas data performa"
                )

            live_start = _parse_clock(clock, found.live_date)
            if live_start is None:
                raise ValueError(f"jam '{clock}' tidak dikenali, tulis seperti 19:00")

            state.config.data["scoring"]["max_clips_per_session"] = count
            state.config.data["render"]["reframe"] = reframe
            klip = found.folder / "klip"
            state.config.data["paths"]["output_dir"] = str(klip)
            state.config.data["paths"]["ledger"] = str(klip / "riwayat.json")

            plan = None
            if found.plan:
                try:
                    plan = load_plan(found.plan)
                    job.log(f"Memakai rencana: {found.plan.name}")
                    for line in plan.summary():
                        job.log(f"  {line}")
                except (ValueError, FileNotFoundError) as exc:
                    job.log(f"Rencana diabaikan ({exc})")

            state.session = SessionInput(
                video=found.video, performance=found.performance,
                session_id=found.session_id, live_start=live_start,
                transcript_path=found.transcript, plan=plan,
                output_dir=klip, work_dir=klip / ".kerja",
            )
            state.session.video = stage(
                found.video, default_stage_dir(), log=job.log
            )
            state.output = analyze_session(state.session, state.config, log=job.log)

            job.payload = {
                "clips": [clip_json(i, r) for i, r in enumerate(state.output.results, 1)],
                "timeline": timeline_json(state.output),
                "folder": str(found.folder / "klip"),
            }

        return state.start("analyze", work)

    def _render(self, body: dict[str, Any]) -> Job:
        state = self.state
        edits = body.get("clips", [])

        def work(job: Job) -> None:
            if state.output is None or state.session is None:
                raise ValueError("belum ada momen yang dicari")

            chosen = []
            for edit in edits:
                position = int(edit.get("index", 0)) - 1
                if not 0 <= position < len(state.output.results):
                    continue
                result = state.output.results[position]
                result.hook = str(edit.get("hook", "")).strip()
                result.info = str(edit.get("info", "")).strip()
                if str(edit.get("caption", "")).strip():
                    result.caption = str(edit["caption"]).strip()
                if edit.get("take"):
                    chosen.append(result)

            if not chosen:
                raise ValueError("belum ada klip yang dicentang")

            # The operator may have edited the on-screen text, so re-check it.
            for result in chosen:
                relint(result, state.session, state.config, state.output)

            blocked = [r for r in chosen if r.blocked]
            for result in blocked:
                blocker = next(f for f in result.findings if f.blocking)
                job.log(f"Dilewati: {blocker.message}")
            chosen = [r for r in chosen if not r.blocked]
            if not chosen:
                raise ValueError("semua klip yang dipilih masih bermasalah")

            job.log(f"Membuat {len(chosen)} klip. Bagian ini paling lama.")
            for position, result in enumerate(chosen, 1):
                job.log(f"[{position}/{len(chosen)}] menit "
                        f"{fmt_time(result.candidate.segment.start)}")
                render_result(result, state.session, state.config, state.output, log=job.log)

            if state.output.ledger is not None:
                state.output.ledger.save()

            folder = state.session.resolved_output_dir(state.config)
            write_markdown(
                render_markdown(state.output.results, state.output.hours,
                                state.session.session_id, str(state.session.video)),
                folder / "laporan.md",
            )
            # Subtitle scratch files have served their purpose; leaving them in
            # the operator's Drive folder is just clutter.
            work = state.session.resolved_work_dir(state.config)
            if work.is_dir():
                shutil.rmtree(work, ignore_errors=True)

            job.payload = {
                "clips": [clip_json(i, r) for i, r in enumerate(state.output.results, 1)],
                "folder": str(folder),
            }
            job.log(f"Selesai. Klip tersimpan di: {folder}")

        return state.start("render", work)


def _plan_payload(found) -> dict[str, Any] | None:
    """Summarise a plan file so the browser can pre-fill and explain itself."""
    if not found.plan:
        return None
    try:
        plan = load_plan(found.plan)
    except (ValueError, FileNotFoundError) as exc:
        return {"file": found.plan.name, "error": str(exc)}

    start = plan.live_start_dt
    return {
        "file": found.plan.name,
        "clock": start.strftime("%H:%M") if start else "",
        "max_clips": plan.max_clips,
        "reframe": plan.reframe,
        "note": plan.note,
        "created_by": plan.created_by,
        "created_at": plan.created_at,
        "blocks": [
            {"label": b.label, "score": b.score, "viewers": b.viewers,
             "gmv": b.gmv, "why": b.why}
            for b in plan.blocks
        ],
    }


def _parse_clock(text: str, day=None):
    raw = (text or "").strip().upper().replace(".", ":")
    if not raw:
        return None
    base = datetime.combine(day, datetime.min.time()) if day else datetime.now().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    for fmt in ("%H:%M", "%H:%M:%S", "%I:%M %p", "%I %p"):
        try:
            parsed = datetime.strptime(raw, fmt)
            return base.replace(hour=parsed.hour, minute=parsed.minute)
        except ValueError:
            continue
    return None


def serve(
    root: str | Path | None = None,
    config: Config | None = None,
    port: int = 8765,
    open_browser: bool = True,
) -> None:
    """Start the local server and block until interrupted."""
    state = State(Path(root).expanduser() if root else default_root(), config or Config())
    token = secrets.token_urlsafe(24)

    handler = type("BoundHandler", (Handler,), {"state": state, "token": token})

    server = None
    for candidate in range(port, port + 20):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", candidate), handler)
            port = candidate
            break
        except OSError:
            continue
    if server is None:
        raise RuntimeError(f"tidak ada port bebas antara {port} dan {port + 20}")

    url = f"http://127.0.0.1:{port}/?t={token}"
    print()
    print("  Mesin Clipper TikTok LIVE sudah berjalan.")
    print()
    print(f"  Buka tautan ini di browser:  {url}")
    print(f"  Folder yang dibaca         :  {state.root}")
    print()
    print("  Biarkan jendela ini terbuka selama Anda memakai aplikasinya.")
    print("  Tutup dengan menekan Ctrl+C.")
    print()

    if open_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Aplikasi ditutup.")
    finally:
        server.server_close()
