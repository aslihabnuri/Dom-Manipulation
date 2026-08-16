#!/bin/bash
# Double-clickable launcher for Linux desktops.
#
# Most file managers need this marked executable and set to "run in terminal";
# from a terminal it also works as ./"Mulai Naratif (Linux).sh".

cd "$(dirname "$0")" || exit 1

BOLD=$'\033[1m'; DIM=$'\033[90m'; GREEN=$'\033[32m'; RED=$'\033[31m'
YELLOW=$'\033[33m'; VIOLET=$'\033[35m'; OFF=$'\033[0m'

say()  { printf "  %s\n" "$1"; }
step() { printf "\n${BOLD}%s${OFF}\n" "$1"; }
ok()   { printf "  ${GREEN}✓${OFF} %s\n" "$1"; }
warn() { printf "  ${YELLOW}!${OFF} %s\n" "$1"; }

berhenti() {
  printf "\n${RED}%s${OFF}\n\n" "$1"
  read -r -p "  Tekan Enter untuk menutup… " _
  exit 1
}

# Distro package managers differ; resolve the install command once.
pasang() {
  if   command -v apt   >/dev/null 2>&1; then sudo apt update && sudo apt install -y "$@"
  elif command -v dnf   >/dev/null 2>&1; then sudo dnf install -y "$@"
  elif command -v pacman >/dev/null 2>&1; then sudo pacman -S --noconfirm "$@"
  elif command -v zypper >/dev/null 2>&1; then sudo zypper install -y "$@"
  else return 1
  fi
}

clear
printf "\n  ${VIOLET}◐${OFF}  ${BOLD}Naratif${OFF}\n"
printf "  ${DIM}Studio video soft-selling gaya Vox${OFF}\n"

step "1/5  Memeriksa Node.js"
if command -v node >/dev/null 2>&1 && [ "$(node -v | sed 's/v//' | cut -d. -f1)" -ge 20 ]; then
  ok "Node.js $(node -v)"
else
  warn "Node.js 20+ belum ada. Memasang…"
  pasang nodejs npm || berhenti "Tidak bisa memasang otomatis. Pasang Node.js 20+ lalu jalankan lagi."
  ok "Node.js $(node -v)"
fi

step "2/5  Memeriksa ffmpeg"
if command -v ffmpeg >/dev/null 2>&1; then
  ok "ffmpeg siap"
  if ffmpeg -hide_banner -filters 2>/dev/null | grep -q '\bsubtitles\b'; then
    ok "libass ada, takarir bisa dibakar"
  else
    warn "ffmpeg tanpa libass — takarir tidak akan muncul di video."
  fi
else
  warn "ffmpeg belum ada. Memasang…"
  pasang ffmpeg || berhenti "Tidak bisa memasang ffmpeg otomatis. Pasang manual lalu jalankan lagi."
  ok "ffmpeg terpasang"
fi

step "3/5  Memeriksa suara"
# Dubbing bahasa Indonesia lewat pembantu Python kecil; tidak butuh kunci API.
if ! command -v python3 >/dev/null 2>&1; then
  warn "Python 3 belum ada. Memasang…"
  pasang python3 python3-pip || warn "Gagal memasang Python 3 — dubbing tidak akan jalan."
fi
if python3 -c "import edge_tts" >/dev/null 2>&1; then
  ok "Suara Indonesia siap"
else
  say "Memasang mesin suara, sekali saja…"
  python3 -m pip install --user --quiet edge-tts >/dev/null 2>&1 \
    || python3 -m pip install --user --quiet --break-system-packages edge-tts >/dev/null 2>&1
  if python3 -c "import edge_tts" >/dev/null 2>&1; then
    ok "Suara Indonesia siap"
  else
    warn "Mesin suara gagal dipasang. Gambar dan naskah tetap jalan, dubbing tidak."
  fi
fi

step "4/5  Menyiapkan aplikasi"
if [ ! -d node_modules ]; then
  say "Mengunduh dependensi, sekali saja…"
  npm install --no-audit --no-fund || berhenti "Gagal memasang dependensi."
fi
ok "Dependensi siap"

step "5/5  Menjalankan studio"
say "Browser akan terbuka sendiri."
say "Kunci API diisi di halaman itu, bukan di sini."
say "Dubbing bahasa Indonesia tidak butuh kunci apa pun."
printf "\n  ${DIM}Biarkan jendela ini terbuka. Untuk berhenti: tutup jendela ini.${OFF}\n\n"

npm start
berhenti "Studio berhenti berjalan."
