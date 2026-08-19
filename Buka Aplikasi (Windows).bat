@echo off
REM Klik dua kali berkas ini untuk membuka Mesin Clipper.
REM Pemasangan hanya terjadi sekali; berikutnya langsung terbuka.

cd /d "%~dp0"
set "VENV=%USERPROFILE%\.tiktok-clipper"

echo.
echo   Mesin Clipper TikTok LIVE
echo   =========================
echo.

REM --- Python ------------------------------------------------------------
set "PY="
for %%P in (py python) do (
  if not defined PY (
    %%P -c "import sys; raise SystemExit(0 if sys.version_info >= (3,10) else 1)" >nul 2>&1
    if not errorlevel 1 set "PY=%%P"
  )
)

if not defined PY (
  echo   Python belum terpasang ^(atau versinya terlalu lama^).
  echo.
  echo   Cara memasang:
  echo     1. Buka https://www.python.org/downloads/
  echo     2. Unduh, lalu saat memasang CENTANG "Add Python to PATH"
  echo     3. Klik dua kali berkas ini lagi
  echo.
  pause
  exit /b 1
)

REM --- Pemasangan sekali saja --------------------------------------------
if not exist "%VENV%\Scripts\clipper.exe" (
  echo   Memasang aplikasi. Ini hanya sekali, sekitar 2 menit...
  echo.
  %PY% -m venv "%VENV%"
  if errorlevel 1 goto failed
  "%VENV%\Scripts\python.exe" -m pip install --quiet --upgrade pip
  REM imageio-ffmpeg membawa ffmpeg sendiri, jadi tidak perlu pasang terpisah.
  "%VENV%\Scripts\python.exe" -m pip install --quiet -e ".[xlsx]" imageio-ffmpeg
  if errorlevel 1 goto failed
  echo   Pemasangan selesai.
  echo.
)

echo   Membuka aplikasi di browser...
echo   Biarkan jendela ini terbuka selama Anda memakainya.
echo.
"%VENV%\Scripts\clipper.exe" web
pause
exit /b 0

:failed
echo.
echo   Pemasangan gagal. Pastikan komputer terhubung internet, lalu coba lagi.
pause
exit /b 1
