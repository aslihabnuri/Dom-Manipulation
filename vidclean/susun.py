"""Susun ulang urutan scene di DALAM satu video, tanpa mengubah tampilannya.

Bedanya dengan racik.py (yang menjahit banyak video):
  * hanya satu video sumber
  * scene pembuka dan penutup DIKUNCI di tempatnya - pembuka menentukan hook,
    penutup biasanya berisi logo/ajakan, keduanya tidak boleh berpindah
  * scene di tengah diacak urutannya
  * warna dan grading TIDAK pernah disentuh - tampilannya tetap seperti aslinya

Mengacak urutan saja ternyata tidak cukup untuk lolos deteksi konten tidak
orisinal: pikselnya masih sama persis dengan sumber, jadi tiap potongan tetap
cocok di indeks platform. Karena itu `rakit()` menerima dua tambahan:

  * `samar` - lapisan penyamaran geometri dari samar.py (zum, geser, putar
    mikro, butiran) yang mengubah tiap piksel tanpa mengubah warna
  * `transisi` - silang-pudar antar scene supaya perpindahannya halus

Kalau hasilnya masih terbaca duplikat, tiga tuas ini bisa dinaikkan bersama:
`min_scene` lebih besar (potongan lebih halus, ruang acak lebih luas),
`acak_kuat=True` (menuntut hampir semua scene tengah berpindah), dan
`ragam_kecepatan()` (menggeser kecepatan tiap scene beberapa persen tanpa
mengubah durasi total).

Perlu diingat jalur AUDIO tidak ditangani modul ini. Musik latar sumber punya
sidik jari sendiri dan ikut menandai video sebagai duplikat, jadi audionya
sebaiknya diganti terpisah (lihat musik.py).
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
    kecepatan: float = 1.0       # >1 dipercepat, <1 diperlambat

    @property
    def durasi(self) -> float:
        """Panjang potongan ini di video SUMBER."""
        return self.selesai - self.mulai

    @property
    def durasi_hasil(self) -> float:
        """Panjang setelah kecepatan diterapkan - inilah yang muncul di hasil."""
        return self.durasi / self.kecepatan


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


def ragam_kecepatan(urutan: List[Scene], sebar: float = 0.0,
                    seed: Optional[int] = None) -> List[Scene]:
    """Beri tiap scene kecepatan sedikit berbeda, TANPA mengubah durasi total.

    Berguna karena pencocok konten juga melihat pola waktu: kapan sebuah
    gerakan terjadi, berapa lama sebuah shot bertahan. Menggeser kecepatan
    tiap scene beberapa persen memutus pola itu, sementara mata hampir tidak
    bisa membedakannya.

    Durasi total dijaga tetap sama dengan sumber supaya musik asli - yang
    diambil utuh dari berkas sumber - tetap pas dari awal sampai akhir.
    `sebar=0.08` berarti kecepatan acak di rentang 0,92x sampai 1,08x.
    """
    if sebar <= 0:
        return urutan
    acak = random.Random(seed)
    total = sum(s.durasi for s in urutan)
    for s in urutan:
        s.kecepatan = acak.uniform(1.0 - sebar, 1.0 + sebar)
    # Normalkan supaya jumlah durasi hasil kembali persis sama dengan total.
    hasil = sum(s.durasi_hasil for s in urutan)
    if hasil > 0:
        koreksi = hasil / total
        for s in urutan:
            s.kecepatan *= koreksi
    return urutan


def rencana_urutan(
    berkas: str,
    seed: Optional[int] = None,
    jaga_awal: int = 1,
    jaga_akhir: int = 1,
    min_scene: int = 6,
    min_durasi: float = 1.0,
    acak_kuat: bool = False,
) -> List[Scene]:
    """Tentukan urutan scene baru: awal & akhir tetap, tengah diacak.

    acak_kuat=True menuntut hampir semua scene tengah benar-benar berpindah,
    bukan sekadar setengahnya - dipakai kalau hasil sebelumnya masih terbaca
    duplikat.
    """
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
    butuh = (max(2, int(len(tengah) * 0.85)) if acak_kuat
             else max(2, len(tengah) // 2))
    terbaik, skor_terbaik = list(tengah), -1
    for _ in range(400):
        acak.shuffle(tengah)
        beda = sum(1 for i, s in enumerate(tengah) if s is not asli[i])
        if beda > skor_terbaik:
            terbaik, skor_terbaik = list(tengah), beda
        if beda >= butuh:
            break
    else:
        tengah = terbaik

    return awal + tengah + akhir


def rakit(
    berkas: str,
    urutan: Sequence[Scene],
    keluaran: str,
    crf: int = 17,
    ikut_audio: bool = True,
    audio_utuh: bool = True,
    samar: Optional[str] = None,
    transisi: float = 0.0,
) -> str:
    """Sambung scene sesuai urutan baru. Tanpa filter tampilan apa pun.

    audio_utuh=True (bawaan): jalur audio diambil UTUH dari video asli dan
    tidak ikut diacak. Musik, narasi, dan suara latar tetap mengalir dari
    awal sampai akhir tanpa terpotong - hanya gambarnya yang berubah urutan.

    audio_utuh=False: audio ikut berpindah bersama scene-nya (tetap sinkron
    dengan gambar, tapi musiknya akan terdengar melompat).

    samar: rantai filter penyamaran (lihat vidclean/samar.py) yang dipasang
    SESUDAH scene disambung, jadi gerakannya mengalir mulus sepanjang video.
    Diperlukan karena mengacak urutan saja tidak mengubah piksel, sehingga
    tiap potongan masih cocok dengan video sumber di indeks platform.

    transisi: lama silang-pudar antar scene dalam detik (0 = potong keras).
    Tiap scene diambil `transisi` detik LEBIH PANJANG dari batasnya, lalu
    kelebihan itu persis habis dipakai untuk memudarkan ke scene berikutnya.
    Hasilnya perpindahan terasa halus TANPA memendekkan durasi video, dan
    frame yang dipakai untuk memudar tetap footage asli - bukan layar hitam.
    """
    info = periksa(berkas)
    pakai_audio = ikut_audio and info.ada_audio

    perintah: List[str] = [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y"]
    graf: List[str] = []
    pasang: List[str] = []

    # Kelebihan footage yang dipinjam tiap scene untuk memudar ke scene
    # berikutnya. Dibatasi supaya tidak melewati ujung video sumber dan tidak
    # pernah melebihi setengah durasi scene itu sendiri.
    tambahan: List[float] = []
    for nomor, s in enumerate(urutan):
        if transisi <= 0 or nomor == len(urutan) - 1:
            tambahan.append(0.0)
            continue
        sisa_sumber = max(0.0, info.durasi - s.selesai)
        tambahan.append(min(transisi, sisa_sumber, s.durasi * 0.35))

    for nomor, s in enumerate(urutan):
        panjang = s.durasi + tambahan[nomor]
        perintah += ["-ss", f"{s.mulai:.3f}", "-t", f"{panjang:.3f}", "-i", berkas]
        # setsar saja supaya sambungan mulus; tidak ada scale/crop/eq/curves,
        # jadi warna dan komposisi persis seperti sumber.
        # settb=AVTB wajib: xfade menolak dua masukan yang basis waktunya beda.
        laju = "" if abs(s.kecepatan - 1.0) < 1e-6 else f",setpts={1.0/s.kecepatan:.6f}*PTS"
        graf.append(f"[{nomor}:v]setpts=PTS-STARTPTS{laju},setsar=1,settb=AVTB[v{nomor}]")
        if pakai_audio and not audio_utuh:
            graf.append(f"[{nomor}:a]asetpts=PTS-STARTPTS,aresample=48000[a{nomor}]")
            pasang.append(f"[v{nomor}][a{nomor}]")
        else:
            pasang.append(f"[v{nomor}]")

    n = len(urutan)

    def rangkai(label_keluar: str) -> None:
        """Sambung semua [vN] jadi satu, lewat silang-pudar atau potong keras."""
        if transisi <= 0 or n == 1:
            graf.append("".join(f"[v{i}]" for i in range(n))
                        + f"concat=n={n}:v=1:a=0[{label_keluar}]")
            return
        # Semua hitungan di bawah memakai waktu HASIL (sesudah kecepatan),
        # bukan waktu sumber - xfade bekerja di waktu hasil.
        jalan = urutan[0].durasi_hasil + tambahan[0] / urutan[0].kecepatan
        kini = "v0"
        for i in range(1, n):
            t = tambahan[i - 1] / urutan[i - 1].kecepatan
            berikut = f"x{i}" if i < n - 1 else label_keluar
            if t <= 0.01:
                # tidak ada footage sisa untuk memudar: sambung keras saja
                graf.append(f"[{kini}][v{i}]concat=n=2:v=1:a=0,settb=AVTB[{berikut}]")
                jalan += urutan[i].durasi_hasil + tambahan[i] / urutan[i].kecepatan
            else:
                geser = jalan - t
                graf.append(
                    f"[{kini}][v{i}]xfade=transition=fade:"
                    f"duration={t:.3f}:offset={geser:.3f}[{berikut}]")
                jalan = geser + urutan[i].durasi_hasil + tambahan[i] / urutan[i].kecepatan
            kini = berikut

    if pakai_audio and audio_utuh:
        # Satu masukan tambahan berisi video asli LENGKAP, dipakai khusus
        # untuk mengambil jalur audionya yang utuh.
        indeks_audio = n
        perintah += ["-i", berkas]
        rangkai("vc")
        graf.append("[vc]" + (samar if samar else "null") + "[v]")
        graf.append(f"[{indeks_audio}:a]aresample=48000,asetpts=PTS-STARTPTS[a]")
        peta = ["-map", "[v]", "-map", "[a]",
                "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest"]
    elif pakai_audio:
        rangkai("vc")
        graf.append("".join(f"[{i}:a]" for i in range(n))
                    + f"concat=n={n}:v=0:a=1[a]")
        graf.append("[vc]" + (samar if samar else "null") + "[v]")
        peta = ["-map", "[v]", "-map", "[a]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
    else:
        rangkai("vc")
        graf.append("[vc]" + (samar if samar else "null") + "[v]")
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
    audio_utuh: bool = True,
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
        if ikut_audio:
            kabar("audio diambil UTUH dari video asli - musik tidak ikut diacak"
                  if audio_utuh else "audio ikut berpindah bersama scene")
    rakit(berkas, urutan, keluaran, crf=crf, ikut_audio=ikut_audio,
          audio_utuh=audio_utuh)
    return keluaran, urutan
