"""Pencarian binary ffmpeg/ffprobe dan helper untuk menjalankannya."""

from __future__ import annotations

import os
import shutil
import subprocess
from typing import Sequence


class FFmpegTidakDitemukan(RuntimeError):
    pass


class FFmpegGagal(RuntimeError):
    def __init__(self, perintah: Sequence[str], kode: int, log: str):
        self.perintah = list(perintah)
        self.kode = kode
        self.log = log
        ekor = "\n".join(log.strip().splitlines()[-25:])
        super().__init__(f"ffmpeg keluar dengan kode {kode}.\n{ekor}")


def _cari(nama: str, env: str) -> str:
    dari_env = os.environ.get(env)
    if dari_env and os.path.exists(dari_env):
        return dari_env

    ditemukan = shutil.which(nama)
    if ditemukan:
        return ditemukan

    # Cadangan: binary statis yang ikut terpasang bersama imageio-ffmpeg.
    if nama == "ffmpeg":
        try:
            import imageio_ffmpeg

            return imageio_ffmpeg.get_ffmpeg_exe()
        except Exception:
            pass

    raise FFmpegTidakDitemukan(
        f"'{nama}' tidak ditemukan di komputer ini.\n"
        "Pasang dulu ffmpeg:\n"
        "  * Windows : winget install Gyan.FFmpeg\n"
        "  * macOS   : brew install ffmpeg\n"
        "  * Linux   : sudo apt install ffmpeg"
    )


def ffmpeg_bin() -> str:
    return _cari("ffmpeg", "FFMPEG_BIN")


def ffprobe_bin() -> str:
    return _cari("ffprobe", "FFPROBE_BIN")


def punya_filter(nama_filter: str) -> bool:
    """Cek apakah build ffmpeg yang terpasang mendukung sebuah filter."""
    try:
        hasil = subprocess.run(
            [ffmpeg_bin(), "-hide_banner", "-filters"],
            capture_output=True,
            text=True,
            timeout=30,
        )
    except Exception:
        return False
    for baris in hasil.stdout.splitlines():
        bagian = baris.split()
        if len(bagian) >= 2 and bagian[1] == nama_filter:
            return True
    return False


def jalankan(perintah: Sequence[str], timeout: int | None = None) -> str:
    """Jalankan ffmpeg/ffprobe dan kembalikan isi stdout saja.

    stdout dan stderr sengaja dipisah: ffprobe menulis JSON ke stdout, sedangkan
    peringatan soal video yang cacat masuk ke stderr. Kalau digabung, JSON-nya
    ikut tercemar dan gagal dibaca - dan video hasil unduhan sering sekali
    memunculkan peringatan semacam itu.
    """
    hasil = subprocess.run(
        list(perintah),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        errors="replace",
        timeout=timeout,
    )
    if hasil.returncode != 0:
        raise FFmpegGagal(perintah, hasil.returncode, hasil.stderr or hasil.stdout or "")
    return hasil.stdout or ""


def jalankan_biner(perintah: Sequence[str], timeout: int | None = None) -> bytes:
    """Jalankan ffmpeg dan ambil output biner dari stdout (untuk pipe raw)."""
    hasil = subprocess.run(
        list(perintah),
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        timeout=timeout,
    )
    return hasil.stdout or b""


def jalankan_dengan_progres(perintah: Sequence[str], total_detik: float, kabar=None) -> str:
    """Jalankan ffmpeg sambil melaporkan kemajuan (0-100) lewat fungsi `kabar`."""
    perintah = list(perintah)
    if "-progress" not in perintah:
        perintah = perintah[:1] + ["-progress", "pipe:1", "-nostats"] + perintah[1:]

    proses = subprocess.Popen(
        perintah,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        errors="replace",
        bufsize=1,
    )
    persen_terakhir = -1
    try:
        for baris in proses.stdout or []:
            baris = baris.strip()
            if baris.startswith("out_time_us=") or baris.startswith("out_time_ms="):
                try:
                    mikro = float(baris.split("=", 1)[1])
                except ValueError:
                    continue
                detik = mikro / 1_000_000.0
                if total_detik > 0 and kabar:
                    persen = int(max(0, min(99, detik / total_detik * 100)))
                    if persen != persen_terakhir:
                        persen_terakhir = persen
                        kabar(persen)
    finally:
        proses.stdout and proses.stdout.close()
        galat = proses.stderr.read() if proses.stderr else ""
        proses.stderr and proses.stderr.close()
        kode = proses.wait()

    if kode != 0:
        raise FFmpegGagal(perintah, kode, galat)
    if kabar:
        kabar(100)
    return galat
