"""Lapisan CERITA: kerangka naratif, panjang beat, dan ragam gerak kamera.

Pasangan dari gaya.py. gaya.py mengurus rupa, berkas ini mengurus urutan
dan iramanya.

Tiga aturan yang paling banyak menentukan mutu, diambil dari riset yang
dirangkum vox-director dan cocok dengan cara jualan lembut yang kita pakai:

1. KAIT DI TIGA DETIK PERTAMA. Sekitar dua pertiga penonton memutuskan
   berhenti atau lanjut sebelum detik ketiga. Beat pertama tidak boleh
   dipakai untuk pemanasan.

2. GANTI SESUATU TIAP TIGA SAMPAI LIMA DETIK, dan jangan pernah menahan
   satu poster diam lebih dari delapan detik. Ini alasan satu beat dipecah
   jadi dua bidikan: satu lebar untuk mengantar, satu dekat untuk
   menekankan. Narasinya jalan terus, gambarnya yang berpindah di tengah
   kalimat. Ini satu-satunya perubahan irama yang paling terasa.

3. JANGAN DUA BEAT BERTURUT MEMAKAI GERAK KAMERA YANG SAMA. Semua poster
   memang mirip bentuknya, jadi keseragaman gerak membuat video terasa
   panjang. Gerak diam disimpan untuk beat kesimpulan, supaya berhentinya
   gerak justru menandai "ini intinya".
"""
from __future__ import annotations

from dataclasses import dataclass

# Gerak kamera yang aman untuk seni datar. Geser rata dan skala rata aman
# karena teks ikut berpindah utuh; apa pun yang memiringkan perspektif
# merusak hurufnya.
GERAK_AMAN = ("diam", "maju", "mundur", "geser", "tegak", "berlapis")

LABEL_GERAK = {
    "diam": "diam, hanya kertasnya yang bergetar halus",
    "maju": "mendekat perlahan",
    "mundur": "menjauh perlahan",
    "geser": "menggeser mendatar",
    "tegak": "menggeser tegak",
    "berlapis": "berlapis, tiap lapisan berbeda kecepatan",
}


@dataclass(frozen=True)
class Alur:
    nama: str
    label: str
    bentuk: tuple[str, ...]
    irama: tuple[str, ...]
    cocok: str


ALUR: dict[str, Alur] = {
    "linimasa": Alur(
        "linimasa", "Linimasa sejarah",
        ("awal", "peristiwa", "peristiwa", "titik balik", "sekarang", "pesan"),
        ("geser", "geser", "geser", "maju", "berlapis", "diam"),
        "sejarah barang, asal-usul, perjalanan panjang"),
    "kait-bayar": Alur(
        "kait-bayar", "Kait lalu bayar",
        ("kait", "latar", "bangun", "puncak", "penutup"),
        ("maju", "geser", "berlapis", "diam", "mundur"),
        "satu gagasan tunggal, paling aman"),
    "luruskan": Alur(
        "luruskan", "Meluruskan salah kaprah",
        ("fakta", "salah kaprah", "bongkar", "yang benar", "pesan"),
        ("maju", "geser", "berlapis", "diam", "mundur"),
        "menjernihkan anggapan keliru tentang bahan atau produk"),
    "lubang": Alur(
        "lubang", "Jatuh lalu bangkit",
        ("baik", "jatuh", "makin dalam", "bangkit", "lebih baik"),
        ("geser", "tegak", "maju", "berlapis", "diam"),
        "kisah perubahan, kebangkitan pengrajin atau merek"),
    "asal": Alur(
        "asal", "Asal mula",
        ("dunia", "percikan", "nekat", "susah", "tembus", "hari ini"),
        ("berlapis", "maju", "geser", "tegak", "maju", "diam"),
        "kisah pendiri, kenapa sesuatu ada"),
}

BAWAAN_ALUR = "kait-bayar"

# Pola kait untuk beat pertama.
POLA_KAIT = {
    "salah-kaprah": "tunjukkan anggapan keliru yang banyak dipercaya",
    "angka-mengejutkan": "buka dengan satu angka yang bikin berhenti",
    "pertanyaan": "ajukan pertanyaan yang jawabannya ingin ditunggu",
    "rahasia": "janjikan sesuatu yang jarang diketahui",
    "peringatan": "sebut sesuatu yang sedang terancam hilang",
    "pemutus-pola": "buka dengan kalimat yang tidak diduga",
}


def usulkan_alur(kategori: str, topik: str) -> str:
    """Pilih kerangka cerita dari topiknya."""
    t = topik.lower()
    if any(k in t for k in ("sejarah", "asal", "kuno", "abad", "tradisi", "warisan")):
        return "linimasa"
    if any(k in t for k in ("keliru", "salah", "dikira", "anggapan", "mitos")):
        return "luruskan"
    if any(k in t for k in ("pengrajin", "bangkit", "hampir punah", "terancam")):
        return "lubang"
    if any(k in t for k in ("pendiri", "berdiri", "lahir", "mulai")):
        return "asal"
    return BAWAAN_ALUR


def jumlah_beat(durasi: float) -> int:
    """Jumlah beat yang pas untuk satu durasi.

    Tiga puluh detik memuat enam sampai delapan beat, enam puluh detik
    sepuluh sampai dua belas. Di antaranya diambil lurus.
    """
    return max(4, min(12, round(durasi / 5.0)))


def ragam_gerak(alur_nama: str, n: int) -> list[str]:
    """Deret gerak kamera sepanjang n beat, tanpa dua tetangga yang sama.

    Irama bawaan alur dipakai lebih dulu. Kalau beatnya lebih banyak
    daripada irama yang tersedia, sisanya diisi bergantian antar keluarga
    gerak: skala, geseran, lalu diam.
    """
    a = ALUR.get(alur_nama, ALUR[BAWAAN_ALUR])
    hasil = list(a.irama[:n])
    putar = ["maju", "geser", "berlapis", "mundur", "tegak"]
    i = 0
    while len(hasil) < n:
        calon = putar[i % len(putar)]
        i += 1
        if hasil and calon == hasil[-1]:
            continue
        hasil.append(calon)
    # Beat terakhir selalu diam: berhentinya gerak menandai kesimpulan.
    if n >= 3:
        hasil[-1] = "diam"
        if n >= 4 and hasil[-2] == "diam":
            hasil[-2] = "berlapis"
    # Bersihkan sisa tetangga kembar.
    for i in range(1, len(hasil)):
        if hasil[i] == hasil[i - 1]:
            hasil[i] = next(g for g in putar if g != hasil[i - 1])
    return hasil[:n]


def pecah_bidikan(durasi_beat: float) -> list[dict]:
    """Pecah satu beat jadi bidikan-bidikan pendek.

    Bidikan berjalan tiga sampai enam detik. Lewat tujuh detik, gerak apa
    pun kehabisan tujuan dan adegannya terasa mati. Beat yang cukup panjang
    dipecah dua: satu lebar berjudul, satu dekat tanpa judul.
    """
    if durasi_beat <= 6.5:
        return [{"id": "a", "durasi": durasi_beat, "judul": True, "ukuran": "lebar"}]
    bagi = durasi_beat / 2.0
    return [
        {"id": "a", "durasi": bagi, "judul": True, "ukuran": "lebar"},
        {"id": "b", "durasi": durasi_beat - bagi, "judul": False, "ukuran": "dekat"},
    ]


def periksa_irama(gerak: list[str], durasi: list[float]) -> list[str]:
    """Cek irama sebelum ada kredit yang dibelanjakan. Mengembalikan keluhan."""
    keluhan = []
    for i in range(1, len(gerak)):
        if gerak[i] == gerak[i - 1]:
            keluhan.append(f"beat {i} dan {i+1} memakai gerak sama ({gerak[i]})")
    for i, d in enumerate(durasi):
        if d > 8.0:
            keluhan.append(f"beat {i+1} tertahan {d:.1f} detik, lebih dari 8 detik")
    if durasi and durasi[0] > 3.5:
        keluhan.append(f"kait {durasi[0]:.1f} detik, sebaiknya di bawah 3 detik")
    if len(set(gerak)) < 3 and len(gerak) >= 5:
        keluhan.append("gerak kamera kurang beragam, video akan terasa panjang")
    return keluhan
