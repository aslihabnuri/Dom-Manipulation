"""Deteksi teks yang menempel di dalam gambar video (lewat tesseract OCR).

Dipakai racik untuk dua hal:
  * memilih shot yang bersih dari teks
  * kalau shot berteks terpaksa dipakai, kotak teksnya dihapus dengan delogo
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from typing import List, Tuple

from .ffmpeg import ffmpeg_bin

Kotak = Tuple[int, int, int, int]      # x, y, lebar, tinggi


def tersedia() -> bool:
    return shutil.which("tesseract") is not None


def _ocr_kotak(gambar: str, lebar_frame: int, tinggi_frame: int) -> List[Kotak]:
    """Jalankan tesseract, kembalikan kotak kata yang meyakinkan."""
    try:
        hasil = subprocess.run(
            ["tesseract", gambar, "stdout", "tsv"],
            capture_output=True, text=True, timeout=60,
        )
    except (subprocess.SubprocessError, FileNotFoundError):
        return []

    kotak: List[Kotak] = []
    for baris in hasil.stdout.splitlines()[1:]:
        kolom = baris.split("\t")
        if len(kolom) < 12:
            continue
        try:
            conf = float(kolom[10])
            x, y, w, h = int(kolom[6]), int(kolom[7]), int(kolom[8]), int(kolom[9])
        except ValueError:
            continue
        teks = kolom[11].strip()
        # Buang deteksi kosong/sampah: butuh >=2 huruf-angka dan ukuran wajar.
        if conf < 60 or sum(c.isalnum() for c in teks) < 2:
            continue
        if not (tinggi_frame * 0.012 <= h <= tinggi_frame * 0.15):
            continue
        if w < lebar_frame * 0.02:
            continue
        kotak.append((x, y, w, h))
    return kotak


def _gabung_baris(kotak: List[Kotak], lebar: int, tinggi: int) -> List[Kotak]:
    """Satukan kotak kata yang sebaris menjadi kotak baris, lalu beri padding."""
    sisa = sorted(kotak, key=lambda k: (k[1], k[0]))
    baris: List[List[Kotak]] = []
    for k in sisa:
        for b in baris:
            atas = max(k[1], min(x[1] for x in b))
            bawah = min(k[1] + k[3], max(x[1] + x[3] for x in b))
            if bawah - atas > 0.5 * k[3]:
                b.append(k)
                break
        else:
            baris.append([k])

    hasil: List[Kotak] = []
    for b in baris:
        x0 = min(k[0] for k in b)
        y0 = min(k[1] for k in b)
        x1 = max(k[0] + k[2] for k in b)
        y1 = max(k[1] + k[3] for k in b)
        # padding: 60% tinggi baris ke segala arah (menutup tepian huruf & latar)
        pad = int((y1 - y0) * 0.6)
        x0 = max(1, x0 - pad)
        y0 = max(1, y0 - pad)
        x1 = min(lebar - 1, x1 + pad)
        y1 = min(tinggi - 1, y1 + pad)
        if x1 - x0 >= 8 and y1 - y0 >= 8:
            hasil.append((x0, y0, x1 - x0, y1 - y0))
    return hasil


def pindai_video(berkas: str, lebar: int, tinggi: int, durasi: float,
                 langkah: float = 0.7) -> List[Tuple[float, List[Kotak]]]:
    """Pindai teks di seluruh video, satu cuplikan tiap `langkah` detik.

    Overlay teks di video pendek sering hanya tampil 1-2 detik; sampling per
    shot bisa meleset di antaranya. Pemindaian rapat sekali jalan membuat
    tabel waktu-teks yang bisa dipakai menandai semua shot.
    """
    if not tersedia() or durasi <= 0:
        return []
    kerja = tempfile.mkdtemp(prefix="vidclean_ocr_")
    hasil: List[Tuple[float, List[Kotak]]] = []
    try:
        # Satu panggilan ffmpeg untuk semua cuplikan (jauh lebih cepat daripada
        # ratusan seek terpisah).
        pola = os.path.join(kerja, "c%05d.png")
        try:
            subprocess.run(
                [ffmpeg_bin(), "-v", "error", "-y", "-i", berkas,
                 "-vf", f"fps=1/{langkah:.3f}", pola],
                check=True, capture_output=True, timeout=1800,
            )
        except subprocess.SubprocessError:
            return []
        for nama in sorted(os.listdir(kerja)):
            if not nama.endswith(".png"):
                continue
            nomor = int(nama[1:6])
            t = (nomor - 1) * langkah
            kotak = _ocr_kotak(os.path.join(kerja, nama), lebar, tinggi)
            if kotak:
                hasil.append((round(t, 3), _gabung_baris(kotak, lebar, tinggi)))
    finally:
        shutil.rmtree(kerja, ignore_errors=True)
    return hasil


def kotak_dalam_rentang(tabel: List[Tuple[float, List[Kotak]]],
                        mulai: float, selesai: float,
                        jendela: float = 1.5) -> List[Kotak]:
    """Gabungan kotak teks yang hidup di dalam (atau dekat) rentang waktu shot.

    Jendela sengaja lebar (+-1.5 detik): overlay sering masih tampil beberapa
    saat setelah titik terakhir OCR berhasil membacanya (mis. saat teksnya
    bergerak atau latarnya berubah), jadi lebih baik menandai berlebih
    daripada meloloskan shot berteks.
    """
    semua: List[Kotak] = []
    for t, kotak in tabel:
        if mulai - jendela <= t <= selesai + jendela:
            semua.extend(kotak)
    if not semua:
        return []
    # de-duplikasi kasar: kotak yang hampir sama digabung lewat _gabung_baris
    lebar = max(k[0] + k[2] for k in semua) + 8
    tinggi = max(k[1] + k[3] for k in semua) + 8
    return _gabung_baris(semua, lebar, tinggi)
