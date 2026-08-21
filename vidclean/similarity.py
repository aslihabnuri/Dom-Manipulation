"""Mengukur seberapa berbeda video hasil edit dibanding video aslinya.

Caranya meniru cara kasar sistem pendeteksi konten duplikat bekerja:
mengambil beberapa cuplikan gambar, mengubahnya jadi 'sidik jari' 64 bit
(dHash), lalu menghitung berapa bit yang berbeda.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

from .ffmpeg import ffmpeg_bin, jalankan_biner
from .probe import InfoVideo


@dataclass
class Kemiripan:
    beda_gambar_persen: float
    beda_durasi_persen: float
    cuplikan_diperiksa: int
    skor: int
    rincian: List[str]

    @property
    def penilaian(self) -> str:
        if self.skor >= 80:
            return "SANGAT AMAN - jejak digitalnya jauh berbeda dari video asli"
        if self.skor >= 60:
            return "AMAN - perbedaannya sudah memadai"
        if self.skor >= 40:
            return "CUKUP - sebaiknya naikkan preset ke 'kuat'"
        return "KURANG - masih terlalu mirip, pakai preset 'kuat' atau nyalakan mode cermin"


def _sidik_bingkai(berkas: str, detik: float) -> Optional[int]:
    """Ambil satu bingkai lalu ubah jadi sidik jari 64 bit (dHash)."""
    data = jalankan_biner(
        [
            ffmpeg_bin(), "-v", "error",
            "-ss", f"{max(0.0, detik):.3f}",
            "-i", berkas,
            "-frames:v", "1",
            "-vf", "scale=9:8:flags=area,format=gray",
            "-f", "rawvideo", "-",
        ],
        timeout=120,
    )
    if len(data) < 72:
        return None
    nilai = 0
    for baris in range(8):
        for kolom in range(8):
            kiri = data[baris * 9 + kolom]
            kanan = data[baris * 9 + kolom + 1]
            nilai = (nilai << 1) | (1 if kiri > kanan else 0)
    return nilai


def bandingkan(asal: InfoVideo, hasil: InfoVideo, rencana=None, cuplikan: int = 8) -> Kemiripan:
    beda_bit: List[int] = []
    for i in range(cuplikan):
        porsi = (i + 0.5) / cuplikan
        a = _sidik_bingkai(asal.berkas, porsi * asal.durasi)
        b = _sidik_bingkai(hasil.berkas, porsi * hasil.durasi)
        if a is None or b is None:
            continue
        beda_bit.append(bin(a ^ b).count("1"))

    diperiksa = len(beda_bit)
    beda_gambar = (sum(beda_bit) / diperiksa / 64 * 100) if diperiksa else 0.0
    beda_durasi = (
        abs(hasil.durasi - asal.durasi) / asal.durasi * 100 if asal.durasi > 0 else 0.0
    )

    rincian: List[str] = []
    skor = 0.0

    nilai_gambar = min(55.0, beda_gambar * 1.6)
    skor += nilai_gambar
    rincian.append(f"Sidik jari gambar berubah {beda_gambar:.1f}%  (+{nilai_gambar:.0f} poin)")

    if beda_durasi >= 0.4:
        skor += 12
        rincian.append(f"Durasi berubah {beda_durasi:.2f}%  (+12 poin)")
    else:
        rincian.append(f"Durasi hampir sama ({beda_durasi:.2f}%)  (+0 poin)")

    if (asal.lebar, asal.tinggi) != (hasil.lebar, hasil.tinggi):
        skor += 6
        rincian.append(f"Resolusi berubah {asal.lebar}x{asal.tinggi} -> {hasil.lebar}x{hasil.tinggi}  (+6 poin)")

    if abs(asal.fps - hasil.fps) > 0.01:
        skor += 5
        rincian.append(f"Frame rate berubah {asal.fps:g} -> {hasil.fps:g}  (+5 poin)")

    if rencana is not None:
        if abs(getattr(rencana, "nada_suara", 1.0) - 1.0) > 0.0005:
            skor += 8
            rincian.append("Sidik jari audio berubah (nada digeser)  (+8 poin)")
        if getattr(rencana, "cermin", False):
            skor += 6
            rincian.append("Gambar dicerminkan  (+6 poin)")

    skor += 8
    rincian.append("Dikodekan ulang + seluruh metadata asli dihapus  (+8 poin)")

    return Kemiripan(
        beda_gambar_persen=round(beda_gambar, 2),
        beda_durasi_persen=round(beda_durasi, 3),
        cuplikan_diperiksa=diperiksa,
        skor=int(round(min(100.0, skor))),
        rincian=rincian,
    )
