@echo off
REM Peluncur untuk Windows. Klik dua kali berkas ini.
cd /d "%~dp0"
title Studio Video Cerita

echo ==============================================
echo    Studio Video Cerita
echo ==============================================
echo.

REM --- Cek Python ---------------------------------------------------------
where python >nul 2>nul
if errorlevel 1 (
  echo [X] Python belum terpasang.
  echo     Unduh dari https://www.python.org/downloads/
  echo     PENTING: centang "Add Python to PATH" saat memasang.
  echo.
  pause
  exit /b 1
)
echo [OK] Python ditemukan

REM --- Cek ffmpeg ---------------------------------------------------------
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo.
  echo [X] ffmpeg belum terpasang. Aplikasi butuh ini untuk merakit video.
  echo.
  echo     Cara tercepat, buka PowerShell lalu ketik:
  echo         winget install Gyan.FFmpeg
  echo.
  echo     Setelah selesai, TUTUP jendela ini dan buka lagi.
  echo.
  pause
  exit /b 1
)
echo [OK] ffmpeg ditemukan

REM --- Siapkan lingkungan terpisah ----------------------------------------
if not exist ".venv" (
  echo.
  echo [..] Menyiapkan lingkungan untuk pertama kali. Sekali saja, mohon tunggu...
  python -m venv .venv
)
call .venv\Scripts\activate.bat

echo [..] Memeriksa paket yang dibutuhkan...
python -m pip install --quiet --upgrade pip
python -m pip install --quiet -r requirements.txt

echo.
echo [OK] Membuka aplikasi di peramban...
echo      Untuk menutup aplikasi, tekan Ctrl+C di jendela ini.
echo.
streamlit run app.py --server.headless false --browser.gatherUsageStats false
pause
