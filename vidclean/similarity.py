"""Mengukur seberapa berbeda video hasil edit dibanding aslinya (versi 2).

Versi ini sengaja dibuat KEJAM, meniru cara pencocok konten sungguhan bekerja:

  * dua jenis sidik jari per cuplikan (dHash gradien + aHash rata-rata)
  * pencocokan adversarial: tiap cuplikan video asli dibandingkan dengan
    BEBERAPA titik waktu di video hasil (posisi senada +- 0.6 detik), lalu
    diambil yang PALING MIRIP - meniru pencocok yang tahan pergeseran waktu
  * poin bonus untuk perubahan wadah dikecilkan

Akibatnya angka skor versi 2 lebih rendah dari versi 1 untuk video yang sama.
Itu disengaja: skor lama terlalu murah hati.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from .ffmpeg import ffmpeg_bin, jalankan_biner
from .probe import InfoVideo

_cache: Dict[Tuple[str, int, float], Optional[Tuple[int, int]]] = {}


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
            return "CUKUP - sebaiknya naikkan preset atau nyalakan bingkai"
        return "KURANG - masih terlalu mirip, pakai preset 'maksimal' + bingkai"


def _sidik(berkas: str, detik: float) -> Optional[Tuple[int, int]]:
    """(dHash 64 bit, aHash 64 bit) dari satu bingkai; di-cache per berkas+waktu."""
    try:
        kunci = (berkas, os.path.getsize(berkas), round(max(0.0, detik), 2))
    except OSError:
        return None
    if kunci in _cache:
        return _cache[kunci]

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
        _cache[kunci] = None
        return None

    dh = 0
    for baris in range(8):
        for kolom in range(8):
            dh = (dh << 1) | (1 if data[baris * 9 + kolom] > data[baris * 9 + kolom + 1] else 0)

    piksel = [data[baris * 9 + kolom] for baris in range(8) for kolom in range(8)]
    rerata = sum(piksel) / 64.0
    ah = 0
    for nilai in piksel:
        ah = (ah << 1) | (1 if nilai > rerata else 0)

    _cache[kunci] = (dh, ah)
    return (dh, ah)


def _jarak(a: Tuple[int, int], b: Tuple[int, int]) -> float:
    """Gabungan jarak Hamming dua sidik jari, 0..1."""
    return (bin(a[0] ^ b[0]).count("1") + bin(a[1] ^ b[1]).count("1")) / 128.0


def bandingkan(asal: InfoVideo, hasil: InfoVideo, rencana=None, cuplikan: int = 10) -> Kemiripan:
    rincian: List[str] = []

    if asal.durasi <= 0.5 or hasil.durasi <= 0.5:
        return Kemiripan(0.0, 0.0, 0, 0,
                         ["Durasi tidak terbaca - skor tidak bisa dihitung"])

    # Pencocokan adversarial: untuk tiap cuplikan asli, cari titik PALING MIRIP
    # di sekitar posisi senada pada video hasil.
    geseran = (-0.6, -0.25, 0.0, 0.25, 0.6)
    jarak_terbaik: List[float] = []
    for i in range(cuplikan):
        porsi = (i + 0.5) / cuplikan
        sj_asal = _sidik(asal.berkas, porsi * asal.durasi)
        if sj_asal is None:
            continue
        kandidat: List[float] = []
        for g in geseran:
            t = min(max(0.05, porsi * hasil.durasi + g), hasil.durasi - 0.05)
            sj_hasil = _sidik(hasil.berkas, t)
            if sj_hasil is not None:
                kandidat.append(_jarak(sj_asal, sj_hasil))
        if kandidat:
            jarak_terbaik.append(min(kandidat))

    diperiksa = len(jarak_terbaik)
    beda_gambar = (sum(jarak_terbaik) / diperiksa * 100) if diperiksa else 0.0
    beda_durasi = abs(hasil.durasi - asal.durasi) / asal.durasi * 100

    skor = 0.0

    nilai_gambar = min(55.0, beda_gambar * 1.5)
    skor += nilai_gambar
    rincian.append(
        f"Sidik jari gambar berubah {beda_gambar:.1f}% "
        f"(pencocokan adversarial, {diperiksa} cuplikan x {len(geseran)} titik)  (+{nilai_gambar:.0f} poin)"
    )

    if beda_durasi >= 2.5:
        skor += 12
        rincian.append(f"Durasi berubah {beda_durasi:.2f}%  (+12 poin)")
    elif beda_durasi >= 1.0:
        skor += 8
        rincian.append(f"Durasi berubah {beda_durasi:.2f}%  (+8 poin)")
    else:
        rincian.append(f"Durasi hampir sama ({beda_durasi:.2f}%)  (+0 poin)")

    if (asal.lebar, asal.tinggi) != (hasil.lebar, hasil.tinggi):
        skor += 5
        rincian.append(f"Resolusi berubah {asal.lebar}x{asal.tinggi} -> {hasil.lebar}x{hasil.tinggi}  (+5 poin)")

    if abs(asal.fps - hasil.fps) > 0.01:
        skor += 4
        rincian.append(f"Frame rate berubah {asal.fps:g} -> {hasil.fps:g}  (+4 poin)")

    if rencana is not None:
        if abs(getattr(rencana, "nada_suara", 1.0) - 1.0) > 0.0005:
            poin = 7 if getattr(rencana, "eq_jalur", None) else 5
            skor += poin
            rincian.append(f"Sidik jari audio berubah (nada digeser + EQ)  (+{poin} poin)")
        if getattr(rencana, "cermin", False):
            skor += 6
            rincian.append("Gambar dicerminkan  (+6 poin)")
        if len(getattr(rencana, "segmen", []) or []) > 1:
            skor += 5
            rincian.append("Lini masa non-linear (kecepatan berlapis)  (+5 poin)")
        if getattr(rencana, "dinamis", False) and getattr(rencana, "drift_x_amp", 0) > 0:
            skor += 3
            rincian.append("Geometri berubah tiap frame (gerak dinamis)  (+3 poin)")

    skor += 4
    rincian.append("Dikodekan ulang + seluruh metadata asli dihapus  (+4 poin)")

    return Kemiripan(
        beda_gambar_persen=round(beda_gambar, 2),
        beda_durasi_persen=round(beda_durasi, 3),
        cuplikan_diperiksa=diperiksa,
        skor=int(round(min(100.0, skor))),
        rincian=rincian,
    )
