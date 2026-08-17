"""Lapisan SUASANA: satu tombol yang menyetel gambar, suara, dan musik sekaligus.

Masalah yang membuat modul ini ada: musiknya muram, tetapi naratornya
terdengar gembira. Ketiganya bercerita hal yang berbeda dalam satu video,
dan penonton merasakannya sebagai sesuatu yang janggal walau sulit
ditunjuk letaknya.

Penyebabnya bukan kebetulan. Gaya suara dikunci ke "Vocal Smile" waktu
memperbaiki masalah ucapan yang terputus-putus, dan "smile" di situ
harfiah: model memang menyuarakannya sambil tersenyum. Gaya itu dipilih
demi KEMENYAMBUNGAN, bukan demi rasa, lalu terlanjur dipakai untuk semua
cerita termasuk cerita tentang petani yang terancam bangkrut.

Jalan keluarnya sudah ada di tabel pengukuran di tts.py, tinggal dibaca
ulang. Kemenyambungan diukur sebagai jeda per kata:

    Rapid Fire + Vocal Smile     156 kata/menit    0,13 jeda/kata
    Rapid Fire + tanpa style     173 kata/menit    0,13 jeda/kata

Keduanya sama menyambungnya. Bedanya yang satu tersenyum, yang satu tidak.
Jadi suasana muram tidak perlu mengorbankan kelancaran sama sekali: cukup
gaya senyumnya yang dilepas, bukan pace-nya yang diubah.

Style lain sudah diuji dan tidak dipakai: "Newscaster" menghasilkan 53
kata per menit dengan jeda dramatis yang sangat panjang, dan "Promo/Hype"
melonjak ke 0,67 jeda per kata.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Suasana:
    """Satu suasana, lengkap untuk ketiga lapisan.

    gaya_suara   nilai "style" pada mesin suara. Kosong berarti tanpa gaya,
                 dan itu justru pilihan yang benar untuk cerita serius.
    watak_suara  keterangan bebas tentang watak naratornya. Ini pengungkit
                 rasa yang sebenarnya, karena daftar style-nya terbatas.
    suhu         makin rendah makin patuh. Cerita muram butuh kepatuhan
                 supaya model tidak menyelipkan keceriaan sendiri.
    musik        arahan gaya untuk pengarang lagu.
    tema_disukai tema tampilan yang sejalan, dipakai sebagai usulan.
    """

    nama: str
    label: str
    gaya_suara: str
    watak_suara: str
    suhu: float
    musik: str
    tema_disukai: tuple[str, ...]


SUASANA: dict[str, Suasana] = {
    "sedih": Suasana(
        "sedih", "Sedih",
        "",
        "Narator Indonesia yang berbicara dengan nada sendu dan menahan "
        "haru, pelan dan lembut, seperti menceritakan kehilangan. Tidak "
        "meratap dan tidak berlebihan. Bicara mengalir dan menyambung "
        "tanpa jeda antarkata, pelafalan baku.",
        0.4,
        "sorrowful and tender, slow, solo strings over sparse piano, minor "
        "key, quiet and intimate, instrumental only, leaves room for a narrator",
        ("tinta-timur", "koran-editorial", "deco-emas")),
    "kecewa": Suasana(
        "kecewa", "Kecewa",
        "",
        "Narator Indonesia yang terdengar kecewa dan pasrah, nada turun di "
        "akhir kalimat, datar dan lelah tetapi tetap jelas. Tidak marah dan "
        "tidak memelas. Bicara mengalir dan menyambung tanpa jeda antarkata.",
        0.4,
        "disillusioned and weary, slow, muted brass and low piano, minor "
        "key, resigned, sparse instrumental, no build",
        ("koran-editorial", "tinta-timur", "swiss-bersih")),
    "marah": Suasana(
        "marah", "Marah",
        "",
        "Narator Indonesia yang terdengar geram dan menuntut, nada tegas "
        "dan menekan, tempo agak cepat. Tidak berteriak dan tidak histeris, "
        "marahnya tertahan. Bicara mengalir dan menyambung tanpa jeda "
        "antarkata, pelafalan baku.",
        0.5,
        "angry and confrontational, driving percussion, distorted low "
        "guitar, insistent rhythm, minor key, instrumental only",
        ("zine-punk", "koran-editorial", "retro-amerika")),
    "gembira": Suasana(
        "gembira", "Gembira",
        "Vocal Smile",
        "Narator Indonesia yang riang dan ringan, terdengar senang, tempo "
        "hidup. Bicara mengalir dan menyambung tanpa jeda antarkata, "
        "pelafalan baku.",
        0.7,
        "joyful and bright, major key, light percussion, playful melody, "
        "uplifting instrumental",
        ("retro-amerika", "deco-emas", "koran-editorial")),
    "muram": Suasana(
        "muram", "Muram dan serius",
        "",                       # sengaja kosong: tanpa senyum
        "Narator dokumenter Indonesia yang tenang dan bersungguh-sungguh. "
        "Nada rata dan menahan diri, sedikit berat, tidak ceria dan tidak "
        "menjual. Bicara mengalir dan menyambung tanpa jeda antarkata, "
        "pelafalan baku, tidak menggantung di akhir kalimat.",
        0.45,
        "slow, sparse and melancholic, minor key, restrained, documentary "
        "underscore, no percussion build, leaves room for a narrator",
        ("tinta-timur", "koran-editorial", "swiss-bersih")),
    "hangat": Suasana(
        "hangat", "Hangat dan bersahabat",
        "Vocal Smile",
        "Narator Indonesia yang hangat dan bersahabat, seperti bercerita "
        "kepada teman. Ramah tetapi tidak berlebihan. Bicara mengalir dan "
        "menyambung tanpa jeda antarkata, pelafalan baku.",
        0.6,
        "warm and gentle, acoustic, mid tempo, hopeful but unhurried, "
        "instrumental underscore",
        ("deco-emas", "retro-amerika", "koran-editorial")),
    "bersemangat": Suasana(
        "bersemangat", "Bersemangat",
        "Vocal Smile",
        "Narator Indonesia yang bersemangat dan hidup, tempo cepat, energi "
        "tinggi tetapi tetap jelas. Bicara mengalir dan menyambung tanpa "
        "jeda antarkata, pelafalan baku.",
        0.7,
        "upbeat and driving, bright, steady rhythm, energetic instrumental, "
        "modern and punchy",
        ("retro-amerika", "zine-punk", "koran-editorial")),
    "mendesak": Suasana(
        "mendesak", "Mendesak dan menegangkan",
        "",
        "Narator Indonesia yang mendesak dan waspada, nada rendah dan "
        "tertahan seperti menyampaikan peringatan. Tidak panik dan tidak "
        "ceria. Bicara mengalir dan menyambung tanpa jeda antarkata.",
        0.45,
        "tense and urgent, low pulsing strings, minor key, rising pressure, "
        "instrumental, no vocals",
        ("zine-punk", "koran-editorial", "tinta-timur")),
    "tenang": Suasana(
        "tenang", "Tenang dan anggun",
        "",
        "Narator Indonesia yang tenang dan anggun, tempo santai, nada "
        "lembut dan mantap. Tidak terburu-buru dan tidak menjual. Bicara "
        "mengalir dan menyambung tanpa jeda antarkata.",
        0.5,
        "calm and elegant, soft piano and strings, slow, spacious, "
        "instrumental, unhurried",
        ("deco-emas", "tinta-timur", "swiss-bersih")),
}

BAWAAN = "hangat"


def suasana(nama: str | None) -> Suasana:
    return SUASANA.get(nama or BAWAAN, SUASANA[BAWAAN])


# Kata-kata penanda, dipakai untuk menebak suasana dari naskahnya sendiri
# supaya pemakai tidak perlu memilih apa pun.
_PENANDA = {
    "sedih": ("sedih", "duka", "kehilangan", "meninggal", "berpisah", "pilu",
              "menangis", "air mata", "terakhir kali", "tinggal kenangan",
              "punah", "hilang selamanya"),
    "kecewa": ("kecewa", "menyerah", "pasrah", "sia-sia", "gagal", "percuma",
               "ditinggalkan", "dilupakan", "tidak dihargai", "merugi"),
    "marah": ("marah", "geram", "curang", "menipu", "dibohongi", "serakah",
              "eksploitasi", "memeras", "seenaknya", "tidak adil", "rakus",
              "dirampas"),
    "muram": ("bangkrut", "terancam", "menyusut", "tergilas", "sepi", "kalah",
              "sulit", "krisis", "tragis", "gulung tikar", "kewalahan",
              "turun", "anjlok", "meredup"),
    "mendesak": ("palsu", "tiruan", "bahaya", "awas", "waspada", "racun",
                 "ilegal", "darurat", "segera", "sebelum terlambat"),
    "bersemangat": ("meledak", "viral", "tren", "menjamur", "melonjak",
                    "laris", "rekor", "booming"),
    "gembira": ("gembira", "senang", "bahagia", "riang", "seru", "asyik",
                "menyenangkan", "tawa", "merayakan"),
    "tenang": ("warisan", "tradisi", "seremonial", "autentik", "asli",
               "kerajinan", "sabar", "perlahan", "turun-temurun"),
}


def tebak_suasana(naskah: str | list[str]) -> str:
    """Tebak suasana dari isi naskahnya.

    Boleh diberi satu teks utuh, atau daftar narasi per adegan. Bentuk
    daftar jauh lebih baik, karena letak sebuah kata ikut diperhitungkan.

    Adegan awal dihitung lebih berat, dan ini bukan sekadar selera.
    Penonton mengunci rasa sebuah video dari kaitnya, lalu membaca sisanya
    lewat kacamata itu. Naskah yang membuka dengan petani terancam gulung
    tikar lalu menutup dengan mutu yang autentik tetap terasa sebagai
    cerita muram, bukan cerita anggun.

    Tanpa pembobotan ini, naskah matcha kita tertebak "tenang" hanya
    karena kata penutupnya kebetulan lebih banyak daripada kata
    konfliknya, padahal yang diceritakannya justru kejatuhan.
    """
    bagian = [naskah] if isinstance(naskah, str) else list(naskah)
    if not bagian:
        return BAWAAN
    nilai = {k: 0.0 for k in _PENANDA}
    n = len(bagian)
    for i, potongan in enumerate(bagian):
        # Bobot turun landai dari dua di awal ke satu di akhir.
        bobot = 2.0 - (i / max(1, n - 1)) if n > 1 else 1.0
        t = potongan.lower()
        for k, kata in _PENANDA.items():
            nilai[k] += bobot * sum(t.count(p) for p in kata)
    terbaik = max(nilai, key=lambda k: nilai[k])
    return terbaik if nilai[terbaik] > 0 else BAWAAN


def periksa_kepaduan(nama_suasana: str, nama_tema: str) -> list[str]:
    """Keluhkan kalau tampilan dan suasana saling bertentangan.

    Dipanggil sebelum ada kredit yang dibelanjakan, karena poster dan lagu
    yang sudah dibeli tidak bisa ditukar tanpa membayar lagi.
    """
    s = suasana(nama_suasana)
    if nama_tema and nama_tema not in s.tema_disukai:
        return [f"suasana '{s.label}' biasanya tidak berpasangan dengan tema "
                f"'{nama_tema}'; yang sejalan: {', '.join(s.tema_disukai)}"]
    return []
