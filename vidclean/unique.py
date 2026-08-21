"""Menyusun 'rencana perubahan' anti duplikat konten.

Versi 2: selain perubahan statis (zoom, warna, kecepatan rata), rencana kini
memuat perubahan DINAMIS - nilai yang bergeser pelan sepanjang video sehingga
tiap frame geometrinya unik - dan kecepatan BERLAPIS (video dibagi beberapa
babak dengan kecepatan berbeda) sehingga penyelarasan waktu menjadi non-linear.

Semuanya tetap deterministik: video yang sama + varian yang sama menghasilkan
angka yang sama persis.
"""

from __future__ import annotations

import hashlib
import os
import random
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Tuple

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
    kecepatan: float                 # rata-rata terbobot (untuk laporan/perkiraan)
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
    # --- dinamis (v2) ----------------------------------------------------
    dinamis: bool = True
    segmen: List[Tuple[float, float, float]] = field(default_factory=list)
    #      ^ (mulai, selesai, kecepatan) pada lini masa sumber setelah potong awal
    drift_putar_amp: float = 0.0     # derajat
    drift_putar_per: float = 17.0    # detik per ayunan
    drift_putar_fase: float = 0.0
    drift_x_amp: float = 0.0         # porsi lebar
    drift_x_per: float = 19.0
    drift_x_fase: float = 0.0
    drift_y_amp: float = 0.0
    drift_y_per: float = 23.0
    drift_y_fase: float = 0.0
    kurva_m: float = 0.0             # geser titik tengah kurva warna (master)
    kurva_r: float = 0.0
    kurva_g: float = 0.0
    kurva_b: float = 0.0
    eq_jalur: List[Tuple[int, float]] = field(default_factory=list)
    #      ^ (frekuensi Hz, penguatan dB) - pita EQ audio acak

    def as_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @property
    def durasi_keluar(self) -> float:
        """Durasi hasil dari daftar segmen (0 kalau segmen kosong)."""
        return sum((t1 - t0) / v for t0, t1, v in self.segmen) if self.segmen else 0.0

    def ringkasan(self) -> List[str]:
        b = []
        if self.cermin:
            b.append("Gambar dicerminkan (kiri-kanan dibalik)")
        b.append(
            f"Zoom {(self.zoom - 1) * 100:+.1f}% dan bingkai digeser "
            f"{self.geser_x * 100:+.1f}% / {self.geser_y * 100:+.1f}%"
        )
        if self.dinamis and (self.drift_putar_amp > 0 or self.drift_x_amp > 0):
            b.append(
                "Gerak dinamis: bingkai berayun sangat pelan "
                f"(putar ±{self.drift_putar_amp:.2f}°, geser ±{self.drift_x_amp * 100:.2f}%) "
                "- tiap frame geometrinya unik"
            )
        elif abs(self.putar) >= 0.05:
            b.append(f"Diputar halus {self.putar:+.2f} derajat")
        if self.potong_tepi > 0:
            b.append(f"Tepi layar dipangkas {self.potong_tepi * 100:.1f}% (ikut membuang watermark di pinggir)")
        if len(self.segmen) > 1:
            laju = " / ".join(f"{v:.3f}" for _, _, v in self.segmen)
            b.append(f"Kecepatan berlapis {len(self.segmen)} babak: {laju} (lini masa jadi non-linear)")
        else:
            b.append(f"Kecepatan diubah {(self.kecepatan - 1) * 100:+.1f}% (durasi jadi berbeda)")
        b.append(
            f"Warna digeser: terang {self.kecerahan:+.3f}, kontras {self.kontras:.3f}, "
            f"saturasi {self.saturasi:.3f}, gamma {self.gamma:.3f}, rona {self.hue:+.1f} derajat"
        )
        if abs(self.kurva_m) + abs(self.kurva_r) + abs(self.kurva_g) + abs(self.kurva_b) > 0.001:
            b.append(
                f"Grading kurva warna non-linear (m{self.kurva_m:+.3f} r{self.kurva_r:+.3f} "
                f"g{self.kurva_g:+.3f} b{self.kurva_b:+.3f})"
            )
        b.append(f"Butiran halus (grain) tingkat {self.butiran} + penajaman {self.ketajaman:.2f}")
        if self.vignette > 0:
            b.append("Vignette tipis di pinggir layar")
        if self.potong_awal > 0 or self.potong_akhir > 0:
            b.append(f"Dipotong {self.potong_awal:.2f} detik di awal dan {self.potong_akhir:.2f} detik di akhir")
        if abs(self.nada_suara - 1) > 0.0005:
            b.append(f"Nada suara digeser {(self.nada_suara - 1) * 100:+.1f}% (sidik jari audio berubah)")
        if self.eq_jalur:
            pita = ", ".join(f"{f} Hz {g:+.1f} dB" for f, g in self.eq_jalur)
            b.append(f"Spektrum audio digeser lewat EQ acak: {pita}")
        b.append(f"Dikodekan ulang: {self.fps:g} fps, kualitas CRF {self.crf}, jarak keyframe {self.gop}")
        b.append("Seluruh metadata asli dihapus dan diganti yang baru")
        return b


def _sidik_berkas(path: str) -> str:
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
    if abs(nilai - dari) >= minimal:
        return nilai
    return dari + minimal if nilai >= dari else dari - minimal


def _buat_segmen(acak: random.Random, durasi: float, jumlah: int,
                 rentang: Tuple[float, float]) -> List[Tuple[float, float, float]]:
    """Bagi [0, durasi] jadi beberapa babak dengan kecepatan yang saling berbeda."""
    lo, hi = rentang
    jumlah = max(1, min(jumlah, int(durasi // 2) or 1))

    # Titik potong acak, tiap babak minimal 1.5 detik.
    titik = [0.0, durasi]
    for _ in range(jumlah - 1):
        for _coba in range(20):
            t = acak.uniform(durasi * 0.2, durasi * 0.8)
            if all(abs(t - u) >= 1.5 for u in titik):
                titik.append(t)
                break
    titik = sorted(set(titik))

    laju: List[float] = []
    for i in range(len(titik) - 1):
        for _coba in range(30):
            v = _jauhkan(acak.uniform(lo, hi), 1.0, 0.008)
            if not laju or abs(v - laju[-1]) >= 0.015:
                break
        laju.append(max(0.5, min(2.0, v)))

    return [
        (round(titik[i], 3), round(titik[i + 1], 3), round(laju[i], 4))
        for i in range(len(titik) - 1)
    ]


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
    dinamis = bool(ad.get("dinamis", True)) and info.durasi > 0.5

    cermin = ad.get("cermin")
    if cermin is None:
        cermin = bool(preset.get("cermin", False))

    potong_tepi = ad.get("potong_tepi")
    if potong_tepi is None:
        potong_tepi = float(preset.get("potong_tepi", 0.0))
    potong_tepi = max(0.0, min(0.15, float(potong_tepi)))

    maks_potong = max(0.0, (info.durasi - 1.0) / 2.0)
    potong_awal = min(rentang("potong_awal"), maks_potong, info.durasi * 0.12)
    potong_akhir = min(rentang("potong_akhir"), maks_potong, info.durasi * 0.12)
    potong_awal = round(max(0.0, potong_awal), 2)
    potong_akhir = round(max(0.0, potong_akhir), 2)
    durasi_potong = max(0.3, info.durasi - potong_awal - potong_akhir)

    # --- kecepatan: berlapis (dinamis) atau rata (statis) -----------------
    segmen: List[Tuple[float, float, float]] = []
    if dinamis and info.durasi > 0.5:
        lo_s, hi_s = preset.get("segmen", (2, 3))
        jumlah = acak.randint(int(lo_s), int(hi_s))
        segmen = _buat_segmen(acak, durasi_potong, jumlah, preset.get("kecepatan", (1.0, 1.0)))
        total_keluar = sum((t1 - t0) / v for t0, t1, v in segmen)
        kecepatan = round(durasi_potong / total_keluar, 4) if total_keluar else 1.0
    else:
        kecepatan = _jauhkan(rentang("kecepatan", (1.0, 1.0)), 1.0, 0.008)
        kecepatan = round(max(0.5, min(2.0, kecepatan)), 4)
        if info.durasi > 0.5:
            segmen = [(0.0, round(durasi_potong, 3), kecepatan)]

    # --- gerak dinamis ----------------------------------------------------
    drift_putar_amp = drift_x_amp = drift_y_amp = 0.0
    if dinamis:
        drift_putar_amp = round(rentang("drift_putar", (0.06, 0.18)), 3)
        drift_x_amp = round(rentang("drift_geser", (0.002, 0.004)), 4)
        drift_y_amp = round(rentang("drift_geser", (0.002, 0.004)), 4)

    fps_target = float(pengaturan.get("video", {}).get("fps", 30) or 30)
    if preset.get("ubah_fps", False):
        fps_target = acak.choice([30.0, 30000 / 1001])

    crf_dasar = int(pengaturan.get("video", {}).get("kualitas", 21) or 21)
    crf = max(16, min(28, crf_dasar + acak.choice([-1, 0, 0, 1])))

    skala_kurva = preset.get("kurva", (0.010, 0.022))

    def kurva() -> float:
        nilai = acak.uniform(*skala_kurva)
        return round(nilai if acak.random() < 0.5 else -nilai, 4)

    jumlah_eq = int(preset.get("eq_jalur", 2))
    eq_jalur = []
    for _ in range(jumlah_eq):
        f = int(round(10 ** acak.uniform(2.3, 3.9)))          # 200 Hz - 8 kHz
        g = round(_jauhkan(acak.uniform(-1.2, 1.2), 0.0, 0.3), 2)
        eq_jalur.append((f, g))

    zoom = round(rentang("zoom", (1.0, 1.0)), 4)
    if dinamis:
        zoom = max(zoom, 1.04)   # ruang gerak untuk ayunan bingkai

    return Rencana(
        seed=seed,
        varian=varian,
        preset=nama_preset,
        cermin=bool(cermin),
        zoom=zoom,
        geser_x=round(rentang("geser"), 4),
        geser_y=round(rentang("geser"), 4),
        putar=round(rentang("putar"), 3),
        kecepatan=kecepatan,
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
        dinamis=dinamis,
        segmen=segmen,
        drift_putar_amp=drift_putar_amp,
        drift_putar_per=round(acak.uniform(11.0, 29.0), 2),
        drift_putar_fase=round(acak.uniform(0, 6.28), 3),
        drift_x_amp=drift_x_amp,
        drift_x_per=round(acak.uniform(13.0, 31.0), 2),
        drift_x_fase=round(acak.uniform(0, 6.28), 3),
        drift_y_amp=drift_y_amp,
        drift_y_per=round(acak.uniform(17.0, 37.0), 2),
        drift_y_fase=round(acak.uniform(0, 6.28), 3),
        kurva_m=kurva(),
        kurva_r=kurva(),
        kurva_g=kurva(),
        kurva_b=kurva(),
        eq_jalur=eq_jalur,
    )
