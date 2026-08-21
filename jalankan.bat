@echo off
REM Buka Editor Video Anti Duplikat di browser. Klik dua kali berkas ini.
cd /d "%~dp0"
python app.py %*
if errorlevel 1 (
  echo.
  echo Ada masalah saat menjalankan aplikasi.
  echo Pastikan Python dan ffmpeg sudah terpasang - lihat README.md bagian 2.
  pause
)
