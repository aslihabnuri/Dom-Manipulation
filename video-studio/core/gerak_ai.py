"""Menganimasikan satu poster utuh dengan model video, bukan menggunting potongannya.

Ini jalur BAWAAN vox-director, dan saya sempat salah memilih. Repo itu punya
dua jalur, dan bedanya menentukan:

  1. Jalur bawaan, "poster hidup". Poster utuh diserahkan ke model
     image-to-video. Modelnya yang menggerakkan isinya, jadi TOKOH DI DALAM
     KERTAS ikut bergerak: petani membungkuk, keranjang berayun, barisan teh
     beriak. Semua video contoh di repo itu dibuat begini.

  2. Jalur lanjutan, mesin kunci lokal. Poster digunting, potongannya
     diterbangkan, dirakit kembali. Repo itu menyebutnya untuk kasus khusus:
     rakitan potongan yang dramatis, dan tokoh nyata yang ditolak model video.

Saya mengadopsi jalur kedua dan menyangka itu jalur utamanya. Hasilnya
potongan kertas beterbangan rapi, tetapi apa pun yang tergambar DI DALAM
kertas tetap membeku. Itu tepat yang dirasakan pemakai saat membandingkan
dengan contohnya.

Modul ini menambahkan jalur pertama. Keduanya tetap berguna: jalur lokal
gratis dan pasti, jalur model bergerak jauh lebih hidup tetapi berbayar per
adegan.

Perintah geraknya memakai struktur lima sumbu dari panduan repo itu, dan
tiap sumbunya ada gunanya:

  KAMERA      satu gerak saja. Dua gerak sekaligus membuat gambar goyah.
  GERAK ISI   di sinilah tenaganya. Sebut beberapa benda sekaligus, dan
              sebutkan yang cocok untuk adegan itu, bukan kalimat umum.
  ESTETIKA    menahan model supaya tidak menghaluskan tekstur kertasnya.
  RASA        menyetir tempo dan suasana.
  WARNA       menahan gradasi supaya paletnya tidak melenceng.
  BATASAN     ini yang mencegah cacat: huruf bergoyang, kertas jadi 3D, dan
              potongan mendadak di tengah bidikan.

Satu larangan yang mahal: jangan pernah menulis "snap", "punch-in", atau
"zoom cepat". Model bereaksi berlebihan dan membuat lompatan di dalam
bidikan yang terbaca seperti kedipan satu bingkai.
"""
from __future__ import annotations

from pathlib import Path

# Batas panjang perintah pada model video Kie.
#
# Angka ini mahal. Perintah yang kepanjangan ditolak saat pembuatan tugas,
# dan penolakan itu gratis. Tetapi mencari batasnya dengan mencoba-coba
# TIDAK gratis: begitu satu percobaan diterima, tugasnya langsung dibuat
# dan tiga puluh kredit terpotong meski hasilnya tidak pernah diambil.
# Enam puluh kredit hilang begini sebelum pelajaran ini ditulis.
#
# Jadi perintahnya dipangkas sendiri di sini, jauh di bawah batas, dan
# tidak pernah lagi dicari dengan menebak.
MAKS_PROMPT = 1150

# Kosakata gerak kamera. Kelompok pertama aman untuk seni datar.
KAMERA = {
    "diam": "a locked-off static camera (no camera move)",
    "maju": "one very slow smooth push-in (uniform scale-up, Ken-Burns)",
    "mundur": "one slow smooth pull-out (uniform scale-down) revealing the full scene",
    "geser": "one slow horizontal pan across the frame (flat translate, no perspective shift)",
    "tegak": "one slow vertical tilt (flat translate, no perspective shift)",
    "berlapis": "a gentle multi-layer parallax drift (paper layers moving at slightly "
                "different speeds), the camera otherwise steady",
}

AMPLITUDO = {
    "tenang": "subtle, restrained amplitude",
    "berdenyut": "lively, energetic amplitude with clear, bold movement",
    "maksimal": "high-energy amplitude, elements burst, scatter and fly boldly",
}

# Dipakai hanya kalau adegan tidak menyebut gerak isinya sendiri. Selalu
# lebih baik menulis yang cocok untuk adegan itu.
GERAK_BAWAAN = ("several cut-out elements move naturally with the scene, they bob, tilt, "
                "slide, drift and scatter; halftone dots pulse")


def prompt_gerak(
    kamera: str = "maju",
    *,
    gerak_isi: str = "",
    rasa: str = "",
    warna: str = "",
    amplitudo: str = "berdenyut",
    ada_judul: bool = True,
    ketat: bool = True,
    kunci_produk: str = "",
    maks_karakter: int = MAKS_PROMPT,
) -> str:
    """Susun perintah gerak lima sumbu untuk satu poster.

    ada_judul menyalakan penguncian huruf. Dinyalakan hanya pada bidikan
    yang memang berjudul; bidikan detail tanpa judul bebas bergerak lebih
    liar.

    kunci_produk dipakai kalau posternya memuat foto produk sungguhan.
    Tahap gambar memang menjaga hurufnya, tetapi tahap video masih bisa
    menulis ulang label diam-diam, jadi pembekuannya harus disebut lagi.
    """
    kam = KAMERA.get(kamera, kamera)
    isi = gerak_isi or GERAK_BAWAAN
    rasa = rasa or "tactile, editorial, a page from a scrapbook"
    warna = warna or "the still's existing palette, high contrast"
    amp = AMPLITUDO.get(amplitudo, AMPLITUDO["berdenyut"])

    kunci_teks = ""
    if kunci_produk:
        kunci_teks += kunci_produk.strip() + " "
    if ada_judul:
        kunci_teks += "Headline text stays sharp and stable, do not warp the lettering. "

    # Perancah ditulis padat. Batasnya ketat, dan kalau perancahnya boros,
    # yang terpangkas justru GERAK ISI, padahal di situlah seluruh
    # tenaganya. Percobaan pertama menyisakan gerak isi tinggal satu anak
    # kalimat karena perancahnya sendiri sudah menghabiskan jatah.
    if ketat:
        batas = (kunci_teks +
                 # Kalimat berikut tidak ada di repo aslinya dan wajib di
                 # sini, karena model Kie ini memang dirancang bercerita
                 # BERBILANG BIDIKAN. Tanpa itu, ia membuang kolase
                 # kertasnya lalu mengarang dua adegan baru bergaya anime
                 # di dalam satu klip lima detik. Terbukti pada percobaan.
                 "ONE continuous locked shot: no cuts, no scene change, no new angle or "
                 "close-up, no new characters. Last frame framed exactly like the first. "
                 "Same printed paper poster throughout, seen head-on, layout and panels "
                 "fixed. Flat 2D, camera parallel, no 3D or perspective change. Rigid "
                 "paper, no morph or melt. Animate motion only, do not re-render.")
    else:
        batas = (kunci_teks + "Keep the paper-collage look, printed cut-outs, not "
                 "photoreal; no melting into goo. Otherwise explore freely.")

    hasil = (
        "Animate this printed paper-collage poster as a flat 2D MOTION GRAPHIC.\n"
        f"CAMERA: {kam}.\n"
        f"ELEMENT MOTION ({amp}): {isi}. Pieces move as rigid paper cut-outs.\n"
        "AESTHETIC: keep torn paper, tape, halftone dots, newsprint texture and the bold "
        "flat background.\n"
        f"FEEL: {rasa}.\nCOLOR: {warna}.\n"
        f"CONSTRAINTS: {batas}"
    )
    if len(hasil) > maks_karakter:
        # Yang dipangkas adalah GERAK ISI, karena bagian itu yang paling
        # panjang dan paling mudah diringkas. Sumbu batasan tidak boleh
        # dipangkas: justru di situ penjaga cacatnya.
        lebih = len(hasil) - maks_karakter
        isi_pendek = isi[: max(60, len(isi) - lebih - 3)].rsplit(",", 1)[0]
        return prompt_gerak(
            kamera, gerak_isi=isi_pendek, rasa=rasa, warna=warna,
            amplitudo=amplitudo, ada_judul=ada_judul, ketat=ketat,
            kunci_produk=kunci_produk, maks_karakter=10 ** 6)
    return hasil


def animasikan(
    klien,
    poster: Path,
    keluar: Path,
    *,
    model: str,
    prompt: str,
    detik: int = 5,
    rasio: str = "9:16",
    lapor=None,
) -> tuple[Path, float]:
    """Serahkan satu poster ke model video. Mengembalikan (berkas, kredit terpakai).

    Kredit dihitung dari selisih saldo sebelum dan sesudah, bukan dari tabel
    harga, karena tabel harga pernah meleset jauh dan itu yang dulu membuat
    lima ratus kredit hilang tanpa disadari.
    """
    from .visuals import unggah_gambar

    sebelum = klien.credits()
    url = unggah_gambar(klien.api_key, poster)
    if lapor:
        lapor(f"poster diunggah, menyerahkan ke {model}")
    # Bentuk muatan ini dicari dengan mencoba satu per satu, karena Kie
    # tidak menyediakan daftar field dan pesan galatnya hanya berbunyi
    # "This field is required" tanpa menyebut yang mana. Yang terbukti:
    #   image_urls  daftar, bukan image_url tunggal
    #   duration    TEKS "5" atau "10", angka ditolak
    #   audio       WAJIB ada meski tidak dipakai, dan inilah yang paling
    #               lama tidak ketahuan karena namanya sama sekali tidak
    #               disebut di pesan galat
    # Mencoba-coba begini gratis: createTask yang gagal tidak memotong saldo.
    hasil = klien.run_task(model, {
        "prompt": prompt,
        "image_urls": [url],
        "duration": str(detik),
        "audio": False,
    }, max_wait=900)
    klien.download(hasil.first_url, keluar)
    sesudah = klien.credits()
    return keluar, round(sebelum - sesudah, 2)
