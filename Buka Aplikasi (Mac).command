#!/bin/bash
# Klik dua kali berkas ini untuk membuka Mesin Clipper.
# Pemasangan hanya terjadi sekali; berikutnya langsung terbuka.

cd "$(dirname "$0")" || exit 1
VENV="$HOME/.tiktok-clipper"

echo ""
echo "  Mesin Clipper TikTok LIVE"
echo "  ========================="
echo ""

# --- Python ------------------------------------------------------------------
PY=""
for candidate in python3.12 python3.11 python3.10 python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    if "$candidate" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3,10) else 1)' 2>/dev/null; then
      PY="$candidate"; break
    fi
  fi
done

if [ -z "$PY" ]; then
  echo "  Python belum terpasang (atau versinya terlalu lama)."
  echo ""
  echo "  Cara memasang:"
  echo "    1. Buka https://www.python.org/downloads/"
  echo "    2. Unduh dan pasang seperti aplikasi biasa"
  echo "    3. Klik dua kali berkas ini lagi"
  echo ""
  read -r -p "  Tekan Enter untuk menutup..."
  exit 1
fi

# --- Pemasangan sekali saja ---------------------------------------------------
if [ ! -x "$VENV/bin/clipper" ]; then
  echo "  Memasang aplikasi. Ini hanya sekali, sekitar 2 menit..."
  echo ""
  "$PY" -m venv "$VENV" || { echo "  Gagal menyiapkan tempat pemasangan."; read -r -p "  Enter..."; exit 1; }
  "$VENV/bin/python" -m pip install --quiet --upgrade pip
  # imageio-ffmpeg membawa ffmpeg sendiri, jadi tidak perlu pasang terpisah.
  if ! "$VENV/bin/python" -m pip install --quiet -e ".[xlsx]" imageio-ffmpeg; then
    echo ""
    echo "  Pemasangan gagal. Pastikan komputer terhubung internet, lalu coba lagi."
    read -r -p "  Tekan Enter untuk menutup..."
    exit 1
  fi
  echo "  Pemasangan selesai."
  echo ""
fi

echo "  Membuka aplikasi di browser..."
echo "  Biarkan jendela ini terbuka selama Anda memakainya."
echo ""
"$VENV/bin/clipper" web
read -r -p "  Tekan Enter untuk menutup..."
