"""Lapisan penyamaran: mengubah SETIAP piksel tanpa mengubah tampilan.

Menyusun ulang urutan scene saja TIDAK cukup untuk lolos deteksi konten
tidak orisinal. Pencocok konten bekerja per potongan pendek (bag-of-segment):
ia mengambil jendela beberapa detik dari video unggahan lalu mencari
potongan senada di seluruh indeksnya. Kalau pikselnya masih sama persis
dengan video sumber yang sudah ada di platform, setiap potongan tetap
cocok - tidak peduli urutannya sudah diacak.

Modul ini menambah perubahan geometri dan tekstur yang memutus sidik jari
persepsi (dHash/aHash), tapi TIDAK menyentuh warna:

  * zum masuk beberapa persen + geser pelan (bingkai bergerak halus)
  * rotasi mikro di bawah satu derajat
  * potong tepi - sekalian membuang watermark/nama pengguna di pinggir
  * butiran sangat tipis supaya piksel tidak pernah identik
  * penajaman ringan untuk mengganti ketajaman yang hilang saat diperbesar

Yang TIDAK diubah: rona, kontras, saturasi, kurva warna. Grading video
tetap sama seperti aslinya, sesuai permintaan.
"""

from __future__ import annotations

import random
from typing import List, Tuple


def rantai(
    lebar: int,
    tinggi: int,
    benih: int,
    zum: float = 0.08,
    putar_derajat: float = 0.45,
    butir: float = 2.0,
    tajam: float = 0.55,
    bias_y: float = 0.25,
) -> str:
    """Bangun rantai filter penyamaran untuk satu video.

    `benih` membuat tiap video mendapat gerakan yang berbeda, jadi dua video
    yang diproses bersamaan tidak berbagi pola yang sama.

    `bias_y` menentukan dari mana potongan diambil secara vertikal:
    0 = rapat ke atas, 0.5 = tengah, 1 = rapat ke bawah. Bawaannya 0.25
    (condong ke atas) karena teks judul di video produk hampir selalu
    duduk dekat tepi atas, sedangkan bagian bawah biasanya cuma lantai
    atau meja - jadi lebih aman memotong dari bawah.
    """
    acak = random.Random(benih)

    # Kerja di resolusi lebih besar dulu supaya rotasi dan geseran tidak
    # memunculkan sudut hitam, lalu dipotong balik ke ukuran target.
    lebih = 1.0 + zum
    kerja_l = int(round(lebar * lebih / 2)) * 2
    kerja_t = int(round(tinggi * lebih / 2)) * 2

    # Sisa ruang di tiap sisi setelah dipotong kembali ke ukuran target.
    sisa_x = (kerja_l - lebar) / 2.0
    sisa_y = (kerja_t - tinggi) / 2.0

    # Amplitudo geseran: pakai sebagian ruang sisa saja supaya tidak pernah
    # menyentuh tepi walau digabung dengan rotasi.
    amp_x = sisa_x * 0.45
    # Ruang gerak vertikal dibatasi oleh sisi yang paling sempit setelah
    # digeser sesuai bias, supaya potongan tidak pernah keluar bingkai.
    ruang_y = min(sisa_y * 2 * bias_y, sisa_y * 2 * (1.0 - bias_y))
    amp_y = ruang_y * 0.45

    # Periode gerakan dibuat tidak bulat dan berbeda antar sumbu supaya
    # polanya tidak berulang rapi.
    per_x = acak.uniform(11.0, 19.0)
    per_y = acak.uniform(13.0, 23.0)
    per_r = acak.uniform(17.0, 29.0)
    fase_x = acak.uniform(0, 6.283)
    fase_y = acak.uniform(0, 6.283)

    sudut = putar_derajat * acak.choice([-1.0, 1.0])
    rad = sudut * 3.14159265 / 180.0

    arah = acak.choice([-1.0, 1.0])

    f: List[str] = []
    f.append(f"scale={kerja_l}:{kerja_t}:flags=lanczos")
    # Rotasi mikro yang bergoyang sangat pelan; ukuran bingkai tidak berubah,
    # sudut hitam yang muncul akan terpotong di langkah berikutnya.
    f.append(
        f"rotate={rad:.6f}*sin(2*PI*t/{per_r:.3f}):"
        f"ow=iw:oh=ih:c=black@0"
    )
    f.append(
        f"crop={lebar}:{tinggi}:"
        f"'{sisa_x:.2f}+{amp_x:.2f}*sin(2*PI*t/{per_x:.3f}+{fase_x:.3f})':"
        f"'{sisa_y * 2 * bias_y:.2f}"
        f"+{arah:.1f}*{amp_y:.2f}*sin(2*PI*t/{per_y:.3f}+{fase_y:.3f})'"
    )
    if butir > 0:
        f.append(f"noise=alls={butir:g}:allf=t+u")
    if tajam > 0:
        f.append(f"unsharp=5:5:{tajam:g}:5:5:0.0")
    f.append("setsar=1")
    return ",".join(f)


UKURAN = {
    "asli": None,
    "1080": (1080, 1920),
    "2k": (1440, 2560),
    "4k": (2160, 3840),
}


def target_ukuran(nama: str, lebar_asli: int, tinggi_asli: int) -> Tuple[int, int]:
    """Ukuran keluaran, tetap menjaga rasio potret sumber."""
    u = UKURAN.get(nama.lower())
    if u is None:
        return lebar_asli, tinggi_asli
    lebar_t, tinggi_t = u
    # Kunci pada tinggi, lebar mengikuti rasio sumber, dibulatkan genap.
    rasio = lebar_asli / tinggi_asli
    lebar_baru = int(round(tinggi_t * rasio / 2)) * 2
    return lebar_baru, tinggi_t
