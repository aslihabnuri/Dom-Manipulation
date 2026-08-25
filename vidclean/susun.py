"""Susun ulang urutan scene di DALAM satu video, tanpa mengubah tampilannya.

Bedanya dengan racik.py (yang menjahit banyak video):
  * hanya satu video sumber
  * scene pembuka dan penutup DIKUNCI di tempatnya - pembuka menentukan hook,
    penutup biasanya berisi logo/ajakan, keduanya tidak boleh berpindah
  * scene di tengah diacak urutannya
  * TIDAK ada filter, grading, zoom, atau perubahan kecepatan sama sekali;
    tampilan video tetap persis seperti aslinya, hanya urutannya yang berubah
"""

from __future__ import annotations

import os
import random
import re
from dataclasses import dataclass
from typing import List, Optional, Sequence, Tuple

from .ffmpeg import ffmpeg_bin, jalankan
from .probe import periksa


@dataclass
class Scene:
    mulai: float
    selesai: float
    dikunci: bool = False        # scene pembuka/penutup tidak boleh berpindah

    @property
    def durasi(self) -> float:
        return self.selesai - self.mulai


def deteksi_scene(berkas: str, ambang: float = 0.22,
                  min_durasi: float = 1.0) -> List[Tuple[float, float]]:
    """Pecah video jadi scene lewat deteksi pergantian adegan."""
    info = periksa(berkas)
    if info.durasi <= min_durasi * 2:
        return [(0.0, info.durasi)]

    keluaran = jalankan(
        [ffmpeg_bin(), "-hide_banner", "-nostats", "-i", berkas,
         "-vf", f"scale=160:-2,select='gt(scene,{ambang})',metadata=print:file=-",
         "-an", "-f", "null", "-"],
        timeout=1200,
    )
    titik = [0.0]
    for cocok in re.finditer(r"pts_time:([0-9.]+)", keluaran):
        t = round(float(cocok.group(1)), 3)
        if t - titik[-1] >= min_durasi:
            titik.append(t)
    if info.durasi - titik[-1] >= min_durasi * 0.6:
        titik.append(round(info.durasi, 3))
    else:
        titik[-1] = round(info.durasi, 3)

    return [(titik[i], titik[i + 1]) for i in range(len(titik) - 1)]


def _belah(scene: List[Tuple[float, float]], target: int,
           min_durasi: float) -> List[Tuple[float, float]]:
    """Kalau scene terlalu sedikit (video satu tarikan), belah yang panjang."""
    hasil = list(scene)
    while len(hasil) < target:
        # Belah scene terpanjang jadi dua.
        i = max(range(len(hasil)), key=lambda k: hasil[k][1] - hasil[k][0])
        a, b = hasil[i]
        if (b - a) < min_durasi * 2:
            break
        tengah = round(a + (b - a) / 2, 3)
        hasil[i:i + 1] = [(a, tengah), (tengah, b)]
    return hasil


def rencana_urutan(
    berkas: str,
    seed: Optional[int] = None,
    jaga_awal: int = 1,
    jaga_akhir: int = 1,
    min_scene: int = 6,
    min_durasi: float = 1.0,
) -> List[Scene]:
    """Tentukan urutan scene baru: awal & akhir tetap, tengah diacak."""
    mentah = deteksi_scene(berkas, min_durasi=min_durasi)
    mentah = _belah(mentah, min_scene, min_durasi)

    if len(mentah) <= jaga_awal + jaga_akhir + 1:
        # Tidak cukup scene di tengah untuk diacak.
        return [Scene(a, b, dikunci=True) for a, b in mentah]

    if seed is None:
        seed = int(os.path.getsize(berkas)) % (10 ** 9)
    acak = random.Random(seed)

    awal = [Scene(a, b, dikunci=True) for a, b in mentah[:jaga_awal]]
    akhir = [Scene(a, b, dikunci=True) for a, b in mentah[len(mentah) - jaga_akhir:]]
    tengah = [Scene(a, b) for a, b in mentah[jaga_awal:len(mentah) - jaga_akhir]]

    # Acak sampai urutannya benar-benar berbeda dari aslinya.
    asli = list(tengah)
    for _ in range(60):
        acak.shuffle(tengah)
        beda = sum(1 for i, s in enumerate(tengah) if s is not asli[i])
        if beda >= max(2, len(tengah) // 2):
            break

    return awal + tengah + akhir


def rakit(
    berkas: str,
    urutan: Sequence[Scene],
    keluaran: str,
    crf: int = 17,
    ikut_audio: bool = True,
) -> str:
    """Sambung scene sesuai urutan baru. Tanpa filter tampilan apa pun."""
    info = periksa(berkas)
    pakai_audio = ikut_audio and info.ada_audio

    perintah: List[str] = [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y"]
    graf: List[str] = []
    pasang: List[str] = []

    for nomor, s in enumerate(urutan):
        perintah += ["-ss", f"{s.mulai:.3f}", "-t", f"{s.durasi:.3f}", "-i", berkas]
        # setsar+fps saja supaya sambungan mulus; tidak ada scale/crop/eq/curves,
        # jadi warna dan komposisi persis seperti sumber.
        graf.append(f"[{nomor}:v]setpts=PTS-STARTPTS,setsar=1[v{nomor}]")
        if pakai_audio:
            graf.append(f"[{nomor}:a]asetpts=PTS-STARTPTS,aresample=48000[a{nomor}]")
            pasang.append(f"[v{nomor}][a{nomor}]")
        else:
            pasang.append(f"[v{nomor}]")

    n = len(urutan)
    if pakai_audio:
        graf.append("".join(pasang) + f"concat=n={n}:v=1:a=1[v][a]")
        peta = ["-map", "[v]", "-map", "[a]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
    else:
        graf.append("".join(pasang) + f"concat=n={n}:v=1:a=0[v]")
        peta = ["-map", "[v]", "-an"]

    perintah += [
        "-filter_complex", ";".join(graf), *peta,
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-map_metadata", "-1", "-map_chapters", "-1",
        keluaran,
    ]
    jalankan(perintah, timeout=3600)
    return keluaran


def susun(
    berkas: str,
    keluaran: str,
    seed: Optional[int] = None,
    jaga_awal: int = 1,
    jaga_akhir: int = 1,
    min_scene: int = 6,
    crf: int = 17,
    ikut_audio: bool = True,
    kabar=None,
) -> Tuple[str, List[Scene]]:
    """Susun ulang satu video: scene awal & akhir tetap, tengah diacak."""
    urutan = rencana_urutan(berkas, seed, jaga_awal, jaga_akhir, min_scene)
    if kabar:
        peta = " -> ".join(
            f"{'[' if s.dikunci else ''}{s.mulai:.1f}-{s.selesai:.1f}{']' if s.dikunci else ''}"
            for s in urutan
        )
        kabar(f"{len(urutan)} scene, urutan baru: {peta}   ([] = dikunci)")
    rakit(berkas, urutan, keluaran, crf=crf, ikut_audio=ikut_audio)
    return keluaran, urutan
