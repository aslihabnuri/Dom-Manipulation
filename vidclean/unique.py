"""Menyusun 'rencana perubahan' anti duplikat konten.

Setiap video mendapat kombinasi angka yang berbeda-beda (diacak dalam batas
aman yang ditentukan preset), tapi hasilnya tetap bisa diulang: video yang sama
dengan varian yang sama selalu menghasilkan angka yang sama.
"""

from __future__ import annotations

import hashlib
import os
import random
from dataclasses import dataclass, asdict
from typing import Any, Dict, List

from .probe import InfoVideo


@dataclass
class Rencana:
    seed: int
    varian: int
    preset: str
    cermin: bool
    zoom: float
    geser_x: float
    geser_y: float
    putar: float
    kecepatan: float
    kecerahan: float
    kontras: float
    saturasi: float
    gamma: float
    hue: float
    butiran: int
    ketajaman: float
    vignette: float
    potong_awal: float
    potong_akhir: float
    potong_tepi: float
    nada_suara: float
    fps: float
    crf: int
    gop: int

    def as_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def ringkasan(self) -> List[str]:
        b = []
        if self.cermin:
            b.append("Gambar dicerminkan (kiri-kanan dibalik)")
        b.append(f"Zoom {(self.zoom - 1) * 100:+.1f}% dan bingkai digeser {self.geser_x * 100:+.1f}% / {self.geser_y * 100:+.1f}%")
        if abs(self.putar) >= 0.05:
            b.append(f"Diputar halus {self.putar:+.2f} derajat")
        if self.potong_tepi > 0:
            b.append(f"Tepi layar dipangkas {self.potong_tepi * 100:.1f}% (ikut membuang watermark di pinggir)")
        b.append(f"Kecepatan diubah {(self.kecepatan - 1) * 100:+.1f}% (durasi jadi berbeda)")
        b.append(
            f"Warna digeser: terang {self.kecerahan:+.3f}, kontras {self.kontras:.3f}, "
            f"saturasi {self.saturasi:.3f}, gamma {self.gamma:.3f}, rona {self.hue:+.1f} derajat"
        )
        b.append(f"Butiran halus (grain) tingkat {self.butiran} + penajaman {self.ketajaman:.2f}")
        if self.vignette > 0:
            b.append("Vignette tipis di pinggir layar")
        if self.potong_awal > 0 or self.potong_akhir > 0:
            b.append(f"Dipotong {self.potong_awal:.2f} detik di awal dan {self.potong_akhir:.2f} detik di akhir")
        if abs(self.nada_suara - 1) > 0.0005:
            b.append(f"Nada suara digeser {(self.nada_suara - 1) * 100:+.1f}% (sidik jari audio berubah)")
        b.append(f"Dikodekan ulang: {self.fps:g} fps, kualitas CRF {self.crf}, jarak keyframe {self.gop}")
        b.append("Seluruh metadata asli dihapus dan diganti yang baru")
        return b


def _sidik_berkas(path: str) -> str:
    """Sidik jari cepat berdasarkan ukuran + potongan awal & akhir berkas."""
    h = hashlib.sha1()
    ukuran = os.path.getsize(path)
    h.update(str(ukuran).encode())
    with open(path, "rb") as f:
        h.update(f.read(1 << 20))
        if ukuran > (2 << 20):
            f.seek(-(1 << 20), os.SEEK_END)
            h.update(f.read(1 << 20))
    return h.hexdigest()


def _jauhkan(nilai: float, dari: float, minimal: float) -> float:
    """Pastikan nilai tidak terlalu dekat dengan `dari` (supaya efeknya nyata)."""
    if abs(nilai - dari) >= minimal:
        return nilai
    return dari + minimal if nilai >= dari else dari - minimal


def buat_rencana(
    info: InfoVideo,
    preset: Dict[str, Any],
    pengaturan: Dict[str, Any],
    seed: int | None = None,
    varian: int = 0,
    nama_preset: str = "seimbang",
) -> Rencana:
    if seed is None:
        sidik = _sidik_berkas(info.berkas)
        seed = int(sidik[:12], 16) + varian * 7919
    acak = random.Random(seed)

    def rentang(kunci: str, bawaan=(0.0, 0.0)) -> float:
        lo, hi = preset.get(kunci, bawaan)
        return acak.uniform(lo, hi) if hi > lo else float(lo)

    ad = pengaturan.get("anti_duplikat", {})
    cermin = ad.get("cermin")
    if cermin is None:
        cermin = bool(preset.get("cermin", False))

    potong_tepi = ad.get("potong_tepi")
    if potong_tepi is None:
        potong_tepi = float(preset.get("potong_tepi", 0.0))
    potong_tepi = max(0.0, min(0.15, float(potong_tepi)))

    kecepatan = _jauhkan(rentang("kecepatan", (1.0, 1.0)), 1.0, 0.008)
    kecepatan = max(0.5, min(2.0, kecepatan))

    # Potongan awal/akhir tidak boleh menghabiskan video pendek.
    maks_potong = max(0.0, (info.durasi - 1.0) / 2.0)
    potong_awal = min(rentang("potong_awal"), maks_potong, info.durasi * 0.12)
    potong_akhir = min(rentang("potong_akhir"), maks_potong, info.durasi * 0.12)
    potong_awal = round(max(0.0, potong_awal), 2)
    potong_akhir = round(max(0.0, potong_akhir), 2)

    fps_target = float(pengaturan.get("video", {}).get("fps", 30) or 30)
    if preset.get("ubah_fps", False):
        pilihan = [30.0, 30000 / 1001]        # 30 dan 29.97
        fps_target = acak.choice(pilihan)

    crf_dasar = int(pengaturan.get("video", {}).get("kualitas", 21) or 21)
    crf = max(16, min(28, crf_dasar + acak.choice([-1, 0, 0, 1])))

    return Rencana(
        seed=seed,
        varian=varian,
        preset=nama_preset,
        cermin=bool(cermin),
        zoom=round(rentang("zoom", (1.0, 1.0)), 4),
        geser_x=round(rentang("geser"), 4),
        geser_y=round(rentang("geser"), 4),
        putar=round(rentang("putar"), 3),
        kecepatan=round(kecepatan, 4),
        kecerahan=round(rentang("kecerahan"), 4),
        kontras=round(rentang("kontras", (1.0, 1.0)), 4),
        saturasi=round(rentang("saturasi", (1.0, 1.0)), 4),
        gamma=round(rentang("gamma", (1.0, 1.0)), 4),
        hue=round(rentang("warna_hue"), 3),
        butiran=int(round(rentang("butiran"))),
        ketajaman=round(rentang("ketajaman"), 3),
        vignette=float(preset.get("vignette", 0.0)),
        potong_awal=potong_awal,
        potong_akhir=potong_akhir,
        potong_tepi=round(potong_tepi, 4),
        nada_suara=round(_jauhkan(rentang("nada_suara", (1.0, 1.0)), 1.0, 0.004), 4),
        fps=round(fps_target, 4),
        crf=crf,
        gop=acak.choice([48, 50, 60, 72, 75, 90]),
    )
