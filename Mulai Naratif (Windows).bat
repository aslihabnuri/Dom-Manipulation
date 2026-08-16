@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Naratif

REM Double-clickable launcher for Windows.
REM Everything is checked and installed here so nothing has to be typed.

cls
echo.
echo   (o)  Naratif
echo   Studio video soft-selling gaya Vox
echo.

REM ---- Node -------------------------------------------------------------
echo.
echo 1/5  Memeriksa Node.js
where node >nul 2>&1
if errorlevel 1 (
  echo   ! Node.js belum terpasang.
  where winget >nul 2>&1
  if errorlevel 1 (
    echo   Membuka halaman unduhan Node.js...
    start "" "https://nodejs.org/en/download"
    call :berhenti "Pasang Node.js versi 20+, lalu jalankan berkas ini lagi."
  ) else (
    echo   Memasang lewat winget, mohon tunggu...
    winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
    if errorlevel 1 call :berhenti "Gagal memasang Node.js lewat winget."
    echo   + Node.js terpasang. Tutup jendela ini dan jalankan lagi supaya PATH terbaca.
    call :berhenti "Perlu dijalankan ulang sekali."
  )
) else (
  for /f "tokens=*" %%v in ('node -v') do set NODEV=%%v
  echo   + Node.js !NODEV!
)

REM ---- ffmpeg -----------------------------------------------------------
echo.
echo 2/5  Memeriksa ffmpeg
where ffmpeg >nul 2>&1
if errorlevel 1 (
  echo   ! ffmpeg belum terpasang.
  where winget >nul 2>&1
  if errorlevel 1 (
    start "" "https://www.gyan.dev/ffmpeg/builds/"
    call :berhenti "Pasang ffmpeg dari halaman yang terbuka, lalu jalankan berkas ini lagi."
  ) else (
    echo   Memasang lewat winget. Ini bisa beberapa menit...
    winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
    if errorlevel 1 call :berhenti "Gagal memasang ffmpeg lewat winget."
    echo   + ffmpeg terpasang. Tutup jendela ini dan jalankan lagi supaya PATH terbaca.
    call :berhenti "Perlu dijalankan ulang sekali."
  )
) else (
  echo   + ffmpeg siap
  REM libass burns the captions in; without it the video renders with no text.
  ffmpeg -hide_banner -filters 2>nul | findstr /C:" subtitles " >nul
  if errorlevel 1 (
    echo   ! ffmpeg tanpa libass - takarir tidak akan muncul di video.
  ) else (
    echo   + libass ada, takarir bisa dibakar
  )
)

REM ---- Suara ------------------------------------------------------------
REM The Indonesian voices run through a small Python helper. Unlike Node and
REM ffmpeg it is not fatal to miss it: scripts and images still work, only the
REM dubbing stops, so this step warns instead of halting.
echo.
echo 3/5  Memeriksa suara
where python >nul 2>&1
if errorlevel 1 (
  echo   ! Python 3 belum ada - dubbing tidak akan jalan.
  where winget >nul 2>&1
  if errorlevel 1 (
    start "" "https://www.python.org/downloads/"
    echo   Pasang Python dari halaman yang terbuka, lalu jalankan berkas ini lagi.
  ) else (
    echo   Memasang lewat winget...
    winget install --id Python.Python.3.12 -e --accept-source-agreements --accept-package-agreements
    echo   + Python terpasang. Tutup jendela ini dan jalankan lagi supaya PATH terbaca.
    call :berhenti "Perlu dijalankan ulang sekali."
  )
) else (
  python -c "import edge_tts" >nul 2>&1
  if errorlevel 1 (
    echo   Memasang mesin suara, sekali saja...
    python -m pip install --quiet edge-tts
    python -c "import edge_tts" >nul 2>&1
    if errorlevel 1 (
      echo   ! Mesin suara gagal dipasang. Gambar dan naskah tetap jalan, dubbing tidak.
    ) else (
      echo   + Suara Indonesia siap
    )
  ) else (
    echo   + Suara Indonesia siap
  )
)

REM ---- Dependensi -------------------------------------------------------
echo.
echo 4/5  Menyiapkan aplikasi
if not exist "node_modules" (
  echo   Mengunduh dependensi, sekali saja...
  call npm install --no-audit --no-fund
  if errorlevel 1 call :berhenti "Gagal memasang dependensi."
  echo   + Dependensi siap
) else (
  echo   + Dependensi sudah ada
)

REM ---- Jalan ------------------------------------------------------------
echo.
echo 5/5  Menjalankan studio
echo   Browser akan terbuka sendiri.
echo   Kunci API diisi di halaman itu, bukan di sini.
echo   Dubbing bahasa Indonesia tidak butuh kunci apa pun.
echo.
echo   Biarkan jendela ini terbuka selama memakai aplikasi.
echo   Untuk berhenti: tutup jendela ini.
echo.

call npm start
call :berhenti "Studio berhenti berjalan."

:berhenti
echo.
echo   %~1
echo.
pause
exit /b 1
