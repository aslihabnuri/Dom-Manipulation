"""Klien API Kie.ai.

Menangani tiga pola panggilan yang berbeda di platform Kie:

1. Job asinkron  : POST /api/v1/jobs/createTask lalu polling /jobs/recordInfo
2. Chat LLM      : POST /claude/v1/messages  (WAJIB stream=true, balasan SSE)
3. Utilitas      : cek saldo kredit, unggah berkas, unduh hasil

Semua kegagalan jaringan dicoba ulang dengan jeda bertingkat supaya satu
gangguan sesaat tidak menggagalkan produksi video yang sedang berjalan.
"""
from __future__ import annotations

import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterable

import requests

from . import config

TERMINAL_OK = "success"
TERMINAL_FAIL = "fail"
_RETRYABLE_STATUS = {408, 429, 500, 502, 503, 504}


class KieError(RuntimeError):
    """Kegagalan yang berasal dari API Kie, sudah diterjemahkan ke Bahasa Indonesia."""

    def __init__(self, message: str, *, code: int | None = None, retryable: bool = False):
        super().__init__(message)
        self.code = code
        self.retryable = retryable


@dataclass
class TaskResult:
    task_id: str
    state: str
    urls: list[str]
    credits: float
    raw: dict[str, Any]

    @property
    def ok(self) -> bool:
        return self.state == TERMINAL_OK

    @property
    def first_url(self) -> str:
        if not self.urls:
            raise KieError("Tugas selesai tetapi tidak mengembalikan berkas hasil.")
        return self.urls[0]


def _friendly(msg: str) -> str:
    """Ubah pesan error mentah jadi kalimat yang bisa ditindaklanjuti pengguna."""
    low = (msg or "").lower()
    if "insufficient" in low or "credit" in low and "not enough" in low:
        return "Saldo kredit Kie tidak cukup. Isi ulang di https://kie.ai lalu coba lagi."
    if "unauthorized" in low or "401" in low:
        return "API key Kie ditolak. Periksa kembali key di halaman Pengaturan."
    if "rate limit" in low or "429" in low:
        return "Terlalu banyak permintaan sekaligus. Tunggu sebentar, lalu ulangi."
    if "internal error" in low or "server exception" in low:
        return (
            "Server Kie sedang bermasalah untuk model ini. "
            "Aplikasi akan mencoba penyedia cadangan bila tersedia."
        )
    return msg or "Terjadi kesalahan yang tidak diketahui pada Kie."


class KieClient:
    def __init__(self, api_key: str | None = None, *, timeout: int = 120):
        self.api_key = (api_key or config.kie_key()).strip()
        self.timeout = timeout
        self._session = requests.Session()

    # ------------------------------------------------------------------
    # Dasar
    # ------------------------------------------------------------------
    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _request(
        self,
        method: str,
        url: str,
        *,
        attempts: int = 4,
        **kwargs: Any,
    ) -> requests.Response:
        if not self.api_key:
            raise KieError("API key Kie belum diisi. Buka halaman Pengaturan dulu.")
        kwargs.setdefault("timeout", self.timeout)
        kwargs.setdefault("headers", self.headers)
        last: Exception | None = None
        for i in range(attempts):
            try:
                resp = self._session.request(method, url, **kwargs)
                if resp.status_code in _RETRYABLE_STATUS and i < attempts - 1:
                    time.sleep(2**i)
                    continue
                return resp
            except requests.RequestException as exc:
                last = exc
                if i < attempts - 1:
                    time.sleep(2**i)
                    continue
        raise KieError(f"Gagal menghubungi Kie: {last}", retryable=True)

    # ------------------------------------------------------------------
    # Saldo
    # ------------------------------------------------------------------
    def credits(self) -> float:
        resp = self._request("GET", config.KIE_CREDIT)
        try:
            data = resp.json()
        except ValueError:
            raise KieError("Balasan saldo dari Kie tidak bisa dibaca.")
        if data.get("code") != 200:
            raise KieError(_friendly(data.get("msg", "")), code=data.get("code"))
        return float(data.get("data") or 0)

    def check_key(self) -> tuple[bool, str]:
        try:
            bal = self.credits()
        except KieError as exc:
            return False, str(exc)
        return True, f"API key valid. Sisa kredit: {bal:,.1f}"

    # ------------------------------------------------------------------
    # Job asinkron
    # ------------------------------------------------------------------
    def create_task(self, model: str, payload: dict[str, Any]) -> str:
        body = {"model": model, "input": payload}
        resp = self._request("POST", config.KIE_CREATE_TASK, json=body)
        try:
            data = resp.json()
        except ValueError:
            raise KieError(f"Balasan Kie tidak valid (HTTP {resp.status_code}).")
        if data.get("code") != 200 or not data.get("data"):
            raise KieError(
                _friendly(data.get("msg", "")),
                code=data.get("code"),
                retryable=data.get("code") in _RETRYABLE_STATUS,
            )
        return data["data"]["taskId"]

    def poll(
        self,
        task_id: str,
        *,
        interval: float = 5.0,
        max_wait: float = 900.0,
        on_progress: Callable[[str, float], None] | None = None,
    ) -> TaskResult:
        started = time.time()
        while True:
            resp = self._request(
                "GET", config.KIE_RECORD_INFO, params={"taskId": task_id}, attempts=5
            )
            try:
                data = resp.json()
            except ValueError:
                raise KieError("Balasan status tugas dari Kie tidak bisa dibaca.")
            if data.get("code") != 200:
                raise KieError(_friendly(data.get("msg", "")), code=data.get("code"))

            d = data.get("data") or {}
            state = d.get("state", "waiting")
            elapsed = time.time() - started
            if on_progress:
                on_progress(state, elapsed)

            if state == TERMINAL_OK:
                return TaskResult(
                    task_id=task_id,
                    state=state,
                    urls=_extract_urls(d.get("resultJson")),
                    credits=float(d.get("creditsConsumed") or 0),
                    raw=d,
                )
            if state == TERMINAL_FAIL:
                raise KieError(
                    _friendly(d.get("failMsg") or "Tugas gagal tanpa keterangan."),
                    code=int(d.get("failCode") or 0) or None,
                )
            if elapsed > max_wait:
                raise KieError(
                    f"Tugas belum selesai setelah {int(max_wait/60)} menit. "
                    "Kie mungkin sedang sibuk — coba lagi nanti.",
                    retryable=True,
                )
            time.sleep(interval)

    def run_task(
        self,
        model: str,
        payload: dict[str, Any],
        *,
        max_wait: float = 900.0,
        on_progress: Callable[[str, float], None] | None = None,
    ) -> TaskResult:
        """Buat tugas lalu tunggu sampai selesai."""
        task_id = self.create_task(model, payload)
        return self.poll(task_id, max_wait=max_wait, on_progress=on_progress)

    # ------------------------------------------------------------------
    # Chat LLM (SSE — Kie menolak permintaan non-stream)
    # ------------------------------------------------------------------
    def chat(
        self,
        prompt: str,
        *,
        system: str = "",
        model: str | None = None,
        max_tokens: int = 8000,
        temperature: float | None = None,
        attempts: int = 3,
    ) -> str:
        model = model or config.LLM_MODELS[config.DEFAULT_LLM]
        messages: list[dict[str, Any]] = []
        if system:
            # Endpoint Kie tidak mengekspos parameter system terpisah,
            # jadi instruksi sistem digabung sebagai giliran pertama.
            messages.append({"role": "user", "content": system})
            messages.append({"role": "assistant", "content": "Baik, saya mengerti."})
        messages.append({"role": "user", "content": prompt})

        body: dict[str, Any] = {
            "model": model,
            "max_tokens": max_tokens,
            "stream": True,
            "messages": messages,
        }
        if temperature is not None:
            body["temperature"] = temperature

        last_err: Exception | None = None
        for i in range(attempts):
            try:
                return self._chat_once(body)
            except KieError as exc:
                last_err = exc
                if not exc.retryable or i == attempts - 1:
                    raise
                time.sleep(2**i)
            except requests.RequestException as exc:
                last_err = exc
                if i == attempts - 1:
                    break
                time.sleep(2**i)
        raise KieError(f"LLM gagal merespons: {last_err}")

    def _chat_once(self, body: dict[str, Any]) -> str:
        resp = self._session.post(
            config.KIE_CLAUDE_MESSAGES,
            headers=self.headers,
            json=body,
            stream=True,
            timeout=self.timeout,
        )
        if resp.status_code != 200:
            snippet = resp.text[:200]
            raise KieError(
                _friendly(f"HTTP {resp.status_code}: {snippet}"),
                code=resp.status_code,
                retryable=resp.status_code in _RETRYABLE_STATUS,
            )

        chunks: list[str] = []
        saw_event = False
        for raw_line in resp.iter_lines(decode_unicode=True):
            if not raw_line or not raw_line.startswith("data:"):
                continue
            payload = raw_line[5:].strip()
            if not payload or payload == "[DONE]":
                continue
            try:
                evt = json.loads(payload)
            except json.JSONDecodeError:
                continue
            saw_event = True
            etype = evt.get("type")
            if etype == "content_block_delta":
                delta = evt.get("delta") or {}
                if delta.get("type") == "text_delta":
                    chunks.append(delta.get("text", ""))
            elif etype == "error":
                err = evt.get("error") or {}
                raise KieError(
                    _friendly(err.get("message", "")),
                    retryable="try again" in err.get("message", "").lower(),
                )

        text = "".join(chunks).strip()
        if not text:
            raise KieError(
                "LLM tidak mengembalikan teks apa pun."
                if saw_event
                else "Koneksi ke LLM terputus sebelum ada balasan.",
                retryable=True,
            )
        return text

    def chat_json(
        self,
        prompt: str,
        *,
        system: str = "",
        model: str | None = None,
        max_tokens: int = 8000,
        attempts: int = 3,
    ) -> Any:
        """Minta LLM membalas JSON, dengan perbaikan otomatis bila formatnya kotor."""
        guard = (
            "\n\nPENTING: Balas HANYA dengan JSON valid. "
            "Tanpa penjelasan, tanpa blok kode markdown, tanpa teks pembuka atau penutup."
        )
        last_text = ""
        for i in range(attempts):
            text = self.chat(
                prompt + guard, system=system, model=model, max_tokens=max_tokens
            )
            last_text = text
            parsed = _parse_json_loose(text)
            if parsed is not None:
                return parsed
            # Percobaan berikutnya: minta LLM memperbaiki keluarannya sendiri.
            prompt = (
                "Keluaran berikut seharusnya JSON valid tetapi gagal di-parse. "
                "Perbaiki dan kembalikan HANYA JSON-nya:\n\n" + text[:6000]
            )
        raise KieError(
            "LLM tidak menghasilkan JSON yang valid setelah beberapa percobaan.\n"
            f"Potongan terakhir: {last_text[:300]}"
        )

    # ------------------------------------------------------------------
    # Berkas
    # ------------------------------------------------------------------
    def download(self, url: str, dest: Path, *, attempts: int = 4) -> Path:
        dest.parent.mkdir(parents=True, exist_ok=True)
        last: Exception | None = None
        for i in range(attempts):
            try:
                with self._session.get(url, stream=True, timeout=180) as r:
                    r.raise_for_status()
                    tmp = dest.with_suffix(dest.suffix + ".part")
                    with open(tmp, "wb") as fh:
                        for chunk in r.iter_content(chunk_size=1 << 16):
                            if chunk:
                                fh.write(chunk)
                    tmp.replace(dest)
                if dest.stat().st_size == 0:
                    raise KieError("Berkas hasil unduhan kosong.")
                return dest
            except (requests.RequestException, OSError, KieError) as exc:
                last = exc
                if i < attempts - 1:
                    time.sleep(2**i)
        raise KieError(f"Gagal mengunduh berkas hasil: {last}")


def _extract_urls(result_json: str | None) -> list[str]:
    if not result_json:
        return []
    try:
        parsed = json.loads(result_json)
    except (json.JSONDecodeError, TypeError):
        return []
    if isinstance(parsed, dict):
        urls = parsed.get("resultUrls")
        if isinstance(urls, list):
            return [u for u in urls if isinstance(u, str)]
        obj = parsed.get("resultObject")
        if isinstance(obj, str):
            return [obj]
    return []


def _parse_json_loose(text: str) -> Any | None:
    """Ambil JSON dari balasan LLM meski dibungkus markdown atau prosa."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 2:
            lines = lines[1:]
            if lines and lines[-1].strip().startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Cari objek/array terluar yang seimbang.
    for opener, closer in (("{", "}"), ("[", "]")):
        start = text.find(opener)
        if start == -1:
            continue
        depth = 0
        in_str = False
        esc = False
        for idx in range(start, len(text)):
            ch = text[idx]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
                continue
            if ch == '"':
                in_str = True
            elif ch == opener:
                depth += 1
            elif ch == closer:
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start : idx + 1])
                    except json.JSONDecodeError:
                        break
    return None
