"""Racik: menjahit ulang beberapa video menjadi satu editan baru.

Alur kerjanya meniru cara editor manusia membuat kompilasi:

  1. tiap video sumber dipindai dan dipecah menjadi shot (potongan adegan)
  2. shot dipilih bergantian antar sumber, dengan panjang 1,6-3,4 detik,
     dan pembukanya sengaja diambil dari TENGAH salah satu video - bukan
     detik-detik pertama yang paling mudah dikenali
  3. shot-shot itu dijahit menjadi satu video master
  4. video master dilewatkan ke mesin anti duplikat v2 seperti biasa

Hasilnya bukan video lama yang disamarkan, melainkan urutan adegan yang
memang belum pernah ada.
"""

from __future__ import annotations

import os
import random
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence, Tuple

from .ffmpeg import ffmpeg_bin, jalankan
from .probe import InfoVideo, periksa


@dataclass
class Shot:
    berkas: str
    mulai: float
    selesai: float
    sumber: int          # indeks video asalnya

    @property
    def durasi(self) -> float:
        return self.selesai - self.mulai


# ---------------------------------------------------------------------------
def deteksi_shot(berkas: str, ambang: float = 0.28) -> List[Tuple[float, float]]:
    """Pecah satu video menjadi shot lewat deteksi pergantian adegan ffmpeg."""
    info = periksa(berkas)
    if info.durasi <= 1.0:
        return [(0.0, info.durasi)]

    keluaran = jalankan(
        [
            ffmpeg_bin(), "-hide_banner", "-nostats", "-i", berkas,
            "-vf", f"scale=160:-2,select='gt(scene,{ambang})',metadata=print:file=-",
            "-an", "-f", "null", "-",
        ],
        timeout=900,
    )
    titik = [0.0]
    for cocok in re.finditer(r"pts_time:([0-9.]+)", keluaran):
        t = float(cocok.group(1))
        if t - titik[-1] >= 0.5:
            titik.append(round(t, 3))
    if info.durasi - titik[-1] >= 0.5:
        titik.append(round(info.durasi, 3))

    shot = [(titik[i], titik[i + 1]) for i in range(len(titik) - 1)]

    # Video satu tarikan (ASMR sering begini): belah manual tiap ~3 detik
    # supaya tetap ada bahan untuk diacak.
    hasil: List[Tuple[float, float]] = []
    for a, b in shot:
        if b - a > 6.0:
            jumlah = int((b - a) // 3.0)
            langkah = (b - a) / max(1, jumlah)
            for i in range(jumlah):
                hasil.append((round(a + i * langkah, 3), round(min(b, a + (i + 1) * langkah), 3)))
        else:
            hasil.append((a, b))
    return [s for s in hasil if s[1] - s[0] >= 0.8]


# ---------------------------------------------------------------------------
def pilih_shot(
    perpustakaan: Dict[int, List[Shot]],
    target: float,
    acak: random.Random,
    durasi_sumber: Dict[int, float],
) -> List[Shot]:
    """Susun urutan shot baru: bergantian antar sumber, panjang bervariasi."""

    def potong_acak(s: Shot) -> Shot:
        """Ambil jendela 1,6-3,4 detik di dalam shot yang lebih panjang."""
        ingin = acak.uniform(1.6, 3.4)
        if s.durasi <= ingin:
            return s
        geser = acak.uniform(0, s.durasi - ingin)
        return Shot(s.berkas, round(s.mulai + geser, 3), round(s.mulai + geser + ingin, 3), s.sumber)

    tersedia = {k: list(v) for k, v in perpustakaan.items()}
    for daftar in tersedia.values():
        acak.shuffle(daftar)

    urutan_sumber = list(tersedia.keys())
    acak.shuffle(urutan_sumber)

    hasil: List[Shot] = []
    total = 0.0

    # Pembuka: dari TENGAH video (>=25% durasi) - bagian awal video sumber
    # adalah bagian yang paling mudah dikenali sistem pencocok.
    for k in urutan_sumber:
        calon = [s for s in tersedia[k] if s.mulai >= durasi_sumber[k] * 0.25]
        if calon:
            pilih = potong_acak(calon[0])
            tersedia[k].remove(calon[0])
            hasil.append(pilih)
            total += pilih.durasi
            break

    # Sisanya: round-robin antar sumber, tidak dua kali berturut dari sumber sama.
    penunjuk = 0
    while total < target and any(tersedia.values()):
        k = urutan_sumber[penunjuk % len(urutan_sumber)]
        penunjuk += 1
        if not tersedia[k]:
            continue
        if hasil and hasil[-1].sumber == k and sum(1 for v in tersedia.values() if v) > 1:
            continue
        mentah = tersedia[k].pop(0)
        pilih = potong_acak(mentah)
        hasil.append(pilih)
        total += pilih.durasi

    return hasil


# ---------------------------------------------------------------------------
def jahit(
    shots: Sequence[Shot],
    keluaran: str,
    lebar: int = 1080,
    tinggi: int = 1920,
    fps: float = 30.0,
    kabar=None,
) -> str:
    """Sambung semua shot menjadi satu video master (belum anti duplikat)."""
    if not shots:
        raise ValueError("Tidak ada shot untuk dijahit")

    info_cache: Dict[str, InfoVideo] = {}

    def punya_audio(berkas: str) -> bool:
        if berkas not in info_cache:
            info_cache[berkas] = periksa(berkas)
        return info_cache[berkas].ada_audio

    perintah: List[str] = [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y"]
    graf: List[str] = []
    pasangan: List[str] = []

    indeks = 0
    for nomor, s in enumerate(shots):
        perintah += ["-ss", f"{s.mulai:.3f}", "-t", f"{s.durasi:.3f}", "-i", s.berkas]
        graf.append(
            f"[{indeks}:v]scale={lebar}:{tinggi}:force_original_aspect_ratio=increase:"
            f"flags=lanczos,crop={lebar}:{tinggi},setsar=1,fps={fps:.5f},"
            f"setpts=PTS-STARTPTS[v{nomor}]"
        )
        if punya_audio(s.berkas):
            graf.append(
                f"[{indeks}:a]aresample=48000,asetpts=PTS-STARTPTS[a{nomor}]"
            )
            indeks += 1
        else:
            perintah += ["-f", "lavfi", "-t", f"{s.durasi:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
            graf.append(f"[{indeks + 1}:a]asetpts=PTS-STARTPTS[a{nomor}]")
            indeks += 2
        pasangan.append(f"[v{nomor}][a{nomor}]")

    graf.append("".join(pasangan) + f"concat=n={len(shots)}:v=1:a=1[v][a]")

    perintah += [
        "-filter_complex", ";".join(graf),
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        keluaran,
    ]
    jalankan(perintah, timeout=3600)
    if kabar:
        kabar(100)
    return keluaran


# ---------------------------------------------------------------------------
def racik(
    sumber: Sequence[str],
    keluaran_master: str,
    target_durasi: float = 21.0,
    seed: Optional[int] = None,
    kabar=None,
) -> Tuple[str, List[Shot]]:
    """Pindai semua sumber, susun urutan baru, jahit jadi video master."""
    if len(sumber) < 1:
        raise ValueError("Minimal satu video sumber")

    if seed is None:
        seed = sum(os.path.getsize(s) for s in sumber) % (10 ** 9)
    acak = random.Random(seed)

    perpustakaan: Dict[int, List[Shot]] = {}
    durasi_sumber: Dict[int, float] = {}
    for i, berkas in enumerate(sumber):
        if kabar:
            kabar(f"memindai adegan {i + 1}/{len(sumber)}: {os.path.basename(berkas)}")
        potongan = deteksi_shot(berkas)
        perpustakaan[i] = [Shot(berkas, a, b, i) for a, b in potongan]
        durasi_sumber[i] = periksa(berkas).durasi

    terpilih = pilih_shot(perpustakaan, target_durasi, acak, durasi_sumber)
    if not terpilih:
        raise ValueError("Tidak ada shot yang bisa dipakai dari sumber yang diberikan")

    if kabar:
        ringkas = " -> ".join(f"S{s.sumber + 1}@{s.mulai:.0f}d" for s in terpilih)
        kabar(f"menjahit {len(terpilih)} shot ({ringkas})")
    jahit(terpilih, keluaran_master)
    return keluaran_master, terpilih
