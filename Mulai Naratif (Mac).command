#!/bin/bash
# Double-clickable launcher for macOS.
#
# Everything the studio needs is checked and installed here, so the only thing
# the person has to do is double-click this file. Nothing is ever typed.

cd "$(dirname "$0")" || exit 1

BOLD=$'\033[1m'; DIM=$'\033[90m'; GREEN=$'\033[32m'; RED=$'\033[31m'
YELLOW=$'\033[33m'; VIOLET=$'\033[35m'; OFF=$'\033[0m'

say()  { printf "  %s\n" "$1"; }
step() { printf "\n${BOLD}%s${OFF}\n" "$1"; }
ok()   { printf "  ${GREEN}✓${OFF} %s\n" "$1"; }
bad()  { printf "  ${RED}✗${OFF} %s\n" "$1"; }
warn() { printf "  ${YELLOW}!${OFF} %s\n" "$1"; }

# Any failure leaves the window open with the reason on screen, instead of the
# window vanishing before it can be read.
berhenti() {
  printf "\n${RED}%s${OFF}\n\n" "$1"
  say "Tutup jendela ini setelah membaca pesannya."
  read -r -p "  Tekan Enter untuk menutup… " _
  exit 1
}

clear
printf "\n  ${VIOLET}◐${OFF}  ${BOLD}Naratif${OFF}\n"
printf "  ${DIM}Studio video soft-selling gaya Vox${OFF}\n"

# ── Node ────────────────────────────────────────────────────────────────
step "1/4  Memeriksa Node.js"
if command -v node >/dev/null 2>&1; then
  VERSI=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$VERSI" -lt 20 ]; then
    warn "Node.js $(node -v) terlalu lama, butuh 20 ke atas."
    if command -v brew >/dev/null 2>&1; then
      say "Memperbarui lewat Homebrew…"
      brew upgrade node || brew install node || berhenti "Gagal memperbarui Node.js."
    else
      open "https://nodejs.org/en/download"
      berhenti "Pasang Node.js versi 20+ dari halaman yang baru terbuka, lalu jalankan berkas ini lagi."
    fi
  fi
  ok "Node.js $(node -v)"
else
  warn "Node.js belum terpasang."
  if command -v brew >/dev/null 2>&1; then
    say "Memasang lewat Homebrew, mohon tunggu…"
    brew install node || berhenti "Gagal memasang Node.js lewat Homebrew."
    ok "Node.js $(node -v) terpasang"
  else
    open "https://nodejs.org/en/download"
    berhenti "Pasang Node.js dari halaman yang baru terbuka, lalu jalankan berkas ini lagi."
  fi
fi

# ── ffmpeg ──────────────────────────────────────────────────────────────
step "2/4  Memeriksa ffmpeg"
if command -v ffmpeg >/dev/null 2>&1; then
  ok "ffmpeg siap"
  # libass is what burns the captions in; without it the render silently
  # produces a video with no text on screen.
  if ffmpeg -hide_banner -filters 2>/dev/null | grep -q '\bsubtitles\b'; then
    ok "libass ada, takarir bisa dibakar"
  else
    warn "ffmpeg terpasang tanpa libass — takarir tidak akan muncul di video."
    say "Perbaiki dengan: brew reinstall ffmpeg"
  fi
else
  warn "ffmpeg belum terpasang."
  if command -v brew >/dev/null 2>&1; then
    say "Memasang lewat Homebrew. Ini bisa beberapa menit…"
    brew install ffmpeg || berhenti "Gagal memasang ffmpeg lewat Homebrew."
    ok "ffmpeg terpasang"
  else
    say "Naratif butuh Homebrew untuk memasang ffmpeg otomatis."
    say "Buka Terminal, tempel baris ini, lalu jalankan berkas ini lagi:"
    printf "\n  ${BOLD}/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${OFF}\n"
    berhenti "Homebrew belum ada."
  fi
fi

# ── Dependensi ──────────────────────────────────────────────────────────
step "3/4  Menyiapkan aplikasi"
if [ ! -d node_modules ]; then
  say "Mengunduh dependensi, sekali saja…"
  npm install --no-audit --no-fund || berhenti "Gagal memasang dependensi."
  ok "Dependensi siap"
else
  ok "Dependensi sudah ada"
fi

# ── Jalan ───────────────────────────────────────────────────────────────
step "4/4  Menjalankan studio"
say "Browser akan terbuka sendiri."
say "Kunci API diisi di halaman itu, bukan di sini."
printf "\n  ${DIM}Biarkan jendela ini terbuka selama memakai aplikasi.${OFF}\n"
printf "  ${DIM}Untuk berhenti: tutup jendela ini.${OFF}\n\n"

npm start
berhenti "Studio berhenti berjalan."
