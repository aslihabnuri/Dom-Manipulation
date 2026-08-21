#!/usr/bin/env python3
"""Editor video anti duplikat konten.

Jalankan:
    python3 edit.py --info          -> lihat pilihan yang tersedia
    python3 edit.py video.mp4       -> edit satu video
    python3 edit.py --semua         -> edit semua video di folder input/
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vidclean.cli import main  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main())
