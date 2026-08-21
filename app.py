#!/usr/bin/env python3
"""Buka aplikasi editor video di browser.

Jalankan:
    python3 app.py
lalu buka alamat yang muncul di layar (biasanya http://127.0.0.1:7860).
"""

import argparse
import os
import sys
import threading
import webbrowser

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vidclean.ffmpeg import FFmpegTidakDitemukan, ffmpeg_bin  # noqa: E402
from vidclean.webserver import jalankan_server  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Editor video anti duplikat - antarmuka browser")
    p.add_argument("--port", type=int, default=7860, help="nomor port (bawaan 7860)")
    p.add_argument("--host", default="127.0.0.1", help="alamat server (bawaan hanya komputer ini)")
    p.add_argument("--tanpa-browser", action="store_true", help="jangan buka browser otomatis")
    a = p.parse_args()

    try:
        ffmpeg_bin()
    except FFmpegTidakDitemukan as e:
        print(e)
        return 2

    if not a.tanpa_browser:
        threading.Timer(1.2, lambda: webbrowser.open(f"http://{a.host}:{a.port}")).start()

    jalankan_server(a.host, a.port)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
