#!/usr/bin/env bash
# Peluncur untuk macOS dan Linux.
# Klik dua kali berkas ini, atau jalankan:  bash jalankan.sh
set -e
cd "$(dirname "$0")"

echo "=============================================="
echo "   Studio Video Cerita"
echo "=============================================="
echo ""

# --- Cek Python ---------------------------------------------------------
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "❌ Python belum terpasang."
  echo "   Unduh dari https://www.python.org/downloads/ lalu jalankan lagi berkas ini."
  read -r -p "Tekan Enter untuk menutup..."
  exit 1
fi
echo "✅ Python ditemukan: $($PY --version)"

# --- Cek ffmpeg ---------------------------------------------------------
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo ""
  echo "❌ ffmpeg belum terpasang. Aplikasi butuh ini untuk merakit video."
  echo ""
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   Pasang dengan perintah:  brew install ffmpeg"
    echo "   Kalau brew belum ada, buka https://brew.sh"
  else
    echo "   Pasang dengan perintah:  sudo apt install ffmpeg"
  fi
  echo ""
  read -r -p "Tekan Enter untuk menutup..."
  exit 1
fi
echo "✅ ffmpeg ditemukan"

# --- Siapkan lingkungan terpisah ---------------------------------------
if [ ! -d ".venv" ]; then
  echo ""
  echo "📦 Menyiapkan lingkungan untuk pertama kali. Sekali saja, mohon tunggu..."
  $PY -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

echo "📦 Memeriksa paket yang dibutuhkan..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo ""
echo "🚀 Membuka aplikasi di peramban..."
echo "   Untuk menutup aplikasi, tekan Ctrl+C di jendela ini."
echo ""
streamlit run app.py --server.headless false --browser.gatherUsageStats false
