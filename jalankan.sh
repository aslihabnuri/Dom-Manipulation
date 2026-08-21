#!/usr/bin/env bash
# Buka Editor Video Anti Duplikat di browser.
# Klik dua kali berkas ini, atau jalankan:  ./jalankan.sh
cd "$(dirname "$0")" || exit 1
command -v python3 >/dev/null 2>&1 && PY=python3 || PY=python
"$PY" app.py "$@"
