"""Racik v2: menjahit ulang beberapa video menjadi satu editan baru yang estetik.

Meniru cara editor manusia bekerja di aplikasi edit:

  1. tiap video sumber dipindai dan dipecah menjadi shot; 4 detik pertama
     tiap video dibuang (di situlah intro & teks brand biasanya hidup, dan
     itu bagian yang paling mudah dikenali sistem pencocok)
  2. tiap shot diperiksa OCR - shot yang ada teks tertanamnya dihindari;
     kalau bahan kurang, teksnya dihapus dengan delogo
  3. shot dipilih bergantian antar sumber dengan ritme editan: potongan
     awal lebih pendek (hook), makin ke belakang makin tenang
  4. tiap shot diberi gerakan Ken Burns (zoom masuk/keluar bergantian),
     sebagian sambungan memakai dissolve, sisanya potongan tegas
  5. hasil jahitan ditutup fade perlahan, lalu diproses mesin anti duplikat
"""

from __future__ import annotations

import math
import os
import random
import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Sequence, Tuple

from .ffmpeg import ffmpeg_bin, jalankan
from .probe import InfoVideo, periksa
from . import teksvideo

LEWATI_AWAL = 4.0        # detik pertama tiap sumber yang tidak dipakai


@dataclass
class Shot:
    berkas: str
    mulai: float
    selesai: float
    sumber: int
    teks_kotak: List[Tuple[int, int, int, int]] = field(default_factory=list)

    @property
    def durasi(self) -> float:
        return self.selesai - self.mulai

    @property
    def berteks(self) -> bool:
        return bool(self.teks_kotak)


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
    awal = LEWATI_AWAL if info.durasi > LEWATI_AWAL * 2 else min(1.0, info.durasi * 0.15)
    titik = [awal]
    for cocok in re.finditer(r"pts_time:([0-9.]+)", keluaran):
        t = float(cocok.group(1))
        if t <= awal:
            continue
        if t - titik[-1] >= 0.5:
            titik.append(round(t, 3))
    if info.durasi - titik[-1] >= 0.5:
        titik.append(round(info.durasi, 3))

    kasar = [(titik[i], titik[i + 1]) for i in range(len(titik) - 1)]

    # Video satu tarikan: belah manual tiap ~3 detik supaya tetap ada bahan.
    hasil: List[Tuple[float, float]] = []
    for a, b in kasar:
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
    """Susun urutan shot baru dengan ritme editan."""

    def potong_acak(s: Shot, posisi: int) -> Shot:
        # Ritme: 3 potongan pertama pendek (hook), selanjutnya lebih tenang.
        lo, hi = (1.4, 2.2) if posisi < 3 else (2.0, 3.4)
        ingin = acak.uniform(lo, hi)
        if s.durasi <= ingin:
            return s
        geser = acak.uniform(0, s.durasi - ingin)
        return Shot(s.berkas, round(s.mulai + geser, 3),
                    round(s.mulai + geser + ingin, 3), s.sumber, s.teks_kotak)

    # Shot bersih didahulukan; shot berteks jadi cadangan terakhir.
    tersedia: Dict[int, List[Shot]] = {}
    for k, v in perpustakaan.items():
        bersih = [s for s in v if not s.berteks]
        berteks = [s for s in v if s.berteks]
        acak.shuffle(bersih)
        acak.shuffle(berteks)
        tersedia[k] = bersih + berteks

    urutan_sumber = list(tersedia.keys())
    acak.shuffle(urutan_sumber)

    hasil: List[Shot] = []
    total = 0.0

    # Pembuka: dari TENGAH video, bersih dari teks kalau bisa.
    for k in urutan_sumber:
        calon = [s for s in tersedia[k]
                 if s.mulai >= durasi_sumber[k] * 0.25 and not s.berteks]
        calon = calon or [s for s in tersedia[k] if s.mulai >= durasi_sumber[k] * 0.25]
        if calon:
            pilih = potong_acak(calon[0], 0)
            tersedia[k].remove(calon[0])
            hasil.append(pilih)
            total += pilih.durasi
            break

    penunjuk = 0
    while total < target and any(tersedia.values()):
        k = urutan_sumber[penunjuk % len(urutan_sumber)]
        penunjuk += 1
        if not tersedia[k]:
            continue
        if hasil and hasil[-1].sumber == k and sum(1 for v in tersedia.values() if v) > 1:
            continue
        mentah = tersedia[k].pop(0)
        pilih = potong_acak(mentah, len(hasil))
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
    transisi: bool = True,
    gerak: bool = True,
    seed: int = 0,
    kabar=None,
) -> str:
    """Sambung semua shot menjadi satu video master yang sudah "diedit"."""
    if not shots:
        raise ValueError("Tidak ada shot untuk dijahit")

    acak = random.Random(seed ^ 0x5EED)
    info_cache: Dict[str, InfoVideo] = {}

    def info(berkas: str) -> InfoVideo:
        if berkas not in info_cache:
            info_cache[berkas] = periksa(berkas)
        return info_cache[berkas]

    perintah: List[str] = [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y"]
    graf: List[str] = []

    label_v: List[str] = []
    label_a: List[str] = []
    durasi_shot: List[float] = []

    indeks = 0
    for nomor, s in enumerate(shots):
        perintah += ["-ss", f"{s.mulai:.3f}", "-t", f"{s.durasi:.3f}", "-i", s.berkas]

        rantai: List[str] = []
        # Hapus teks tertanam (kalau shot berteks terpaksa dipakai).
        for (x, y, w, h) in s.teks_kotak:
            rantai.append(f"delogo=x={x}:y={y}:w={w}:h={h}")
        rantai.append(
            f"scale={lebar}:{tinggi}:force_original_aspect_ratio=increase:"
            f"flags=lanczos,crop={lebar}:{tinggi},setsar=1,fps={fps:.5f}"
        )
        if gerak:
            # Ken Burns: zoom masuk / keluar bergantian, sangat pelan.
            bingkai_total = max(2, int(math.ceil(s.durasi * fps)))
            if nomor % 2 == 0:
                z = f"1.012+0.058*on/{bingkai_total}"
            else:
                z = f"1.07-0.058*on/{bingkai_total}"
            rantai.append(
                f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
                f"d=1:s={lebar}x{tinggi}:fps={fps:.5f}"
            )
        rantai.append("setpts=PTS-STARTPTS")
        graf.append(f"[{indeks}:v]" + ",".join(rantai) + f"[v{nomor}]")

        if info(s.berkas).ada_audio:
            graf.append(f"[{indeks}:a]aresample=48000,asetpts=PTS-STARTPTS[a{nomor}]")
            indeks += 1
        else:
            perintah += ["-f", "lavfi", "-t", f"{s.durasi:.3f}",
                         "-i", "anullsrc=r=48000:cl=stereo"]
            graf.append(f"[{indeks + 1}:a]asetpts=PTS-STARTPTS[a{nomor}]")
            indeks += 2

        label_v.append(f"[v{nomor}]")
        label_a.append(f"[a{nomor}]")
        durasi_shot.append(s.durasi)

    # ---- sambungkan berurutan: sebagian dissolve, sisanya potongan tegas ----
    TD = 0.30
    arus_v, arus_a = label_v[0], label_a[0]
    panjang = durasi_shot[0]
    for nomor in range(1, len(shots)):
        pakai_dissolve = transisi and acak.random() < 0.35 and panjang > TD + 0.2
        vb, ab = label_v[nomor], label_a[nomor]
        keluar_v, keluar_a = f"[cv{nomor}]", f"[ca{nomor}]"
        if pakai_dissolve:
            graf.append(
                f"{arus_v}{vb}xfade=transition=fade:duration={TD}:"
                f"offset={panjang - TD:.3f}{keluar_v}"
            )
            graf.append(f"{arus_a}{ab}acrossfade=d={TD}:c1=tri:c2=tri{keluar_a}")
            panjang += durasi_shot[nomor] - TD
        else:
            graf.append(f"{arus_v}{vb}concat=n=2:v=1:a=0{keluar_v}")
            graf.append(f"{arus_a}{ab}concat=n=2:v=0:a=1{keluar_a}")
            panjang += durasi_shot[nomor]
        arus_v, arus_a = keluar_v, keluar_a

    # Penutup: fade perlahan (video + suara).
    fade_mulai = max(0.0, panjang - 1.0)
    graf.append(f"{arus_v}fade=t=out:st={fade_mulai:.3f}:d=1.0,format=yuv420p[v]")
    graf.append(f"{arus_a}afade=t=out:st={fade_mulai:.3f}:d=1.0[a]")

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
    hapus_teks: bool = True,
    transisi: bool = True,
    gerak: bool = True,
    kabar=None,
) -> Tuple[str, List[Shot]]:
    """Pindai semua sumber, susun urutan baru yang estetik, jahit jadi master."""
    if len(sumber) < 1:
        raise ValueError("Minimal satu video sumber")

    if seed is None:
        seed = sum(os.path.getsize(s) for s in sumber) % (10 ** 9)
    acak = random.Random(seed)

    perpustakaan: Dict[int, List[Shot]] = {}
    durasi_sumber: Dict[int, float] = {}
    ocr_aktif = hapus_teks and teksvideo.tersedia()
    if hapus_teks and not ocr_aktif and kabar:
        kabar("tesseract tidak ada - pemeriksaan teks dilewati")

    for i, berkas in enumerate(sumber):
        if kabar:
            kabar(f"memindai adegan {i + 1}/{len(sumber)}: {os.path.basename(berkas)}")
        info = periksa(berkas)
        durasi_sumber[i] = info.durasi
        tabel_teks = (teksvideo.pindai_video(berkas, info.lebar, info.tinggi, info.durasi)
                      if ocr_aktif else [])
        daftar: List[Shot] = []
        for a, b in deteksi_shot(berkas):
            kotak = teksvideo.kotak_dalam_rentang(tabel_teks, a, b) if tabel_teks else []
            daftar.append(Shot(berkas, a, b, i, kotak))
        perpustakaan[i] = daftar
        if kabar and ocr_aktif:
            berteks = sum(1 for s in daftar if s.berteks)
            kabar(f"  {len(daftar)} shot, {berteks} mengandung teks (akan dihindari)")

    terpilih = pilih_shot(perpustakaan, target_durasi, acak, durasi_sumber)
    if not terpilih:
        raise ValueError("Tidak ada shot yang bisa dipakai dari sumber yang diberikan")

    if kabar:
        ringkas = " -> ".join(
            f"S{s.sumber + 1}@{s.mulai:.0f}d{'*' if s.berteks else ''}" for s in terpilih
        )
        kabar(f"menjahit {len(terpilih)} shot ({ringkas})  [* = teks dihapus]")
    jahit(terpilih, keluaran_master, transisi=transisi, gerak=gerak,
          seed=seed, kabar=None)
    return keluaran_master, terpilih
