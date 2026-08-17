"""Lapisan TAMPILAN: menyusun perintah gambar untuk satu poster kolase.

Pelajaran terpenting dari cara kerja vox-director, dan ini yang selama ini
kita lakukan terbalik:

    Tampilan kolase lahir di LANGKAH GAMBAR, bukan di langkah gerak.

Selama ini kita meminta model menggambar potongan-potongan terpisah, lalu
menyusunnya sendiri lewat kode. Akibatnya komposisi bergantung pada tata
letak yang kita tulis tangan, dan itulah kenapa beberapa adegan terasa
kosong dan kotak hijaunya cuma kotak polos.

Cara yang benar terbalik: minta model membuat SATU poster kolase yang sudah
utuh dan padat, lengkap dengan kertas sobek, halftone, selotip, judul, dan
latar warna tegas. Semua DNA kolase hidup di gambar itu. Baru sesudahnya
posternya digunting jadi potongan dan digerakkan.

Dua untungnya sekaligus:

  lama : 3 potongan x (4 kredit gambar + 1 kredit potong) = 15 kredit/adegan
  baru : 1 poster x 4 kredit                              =  4 kredit/adegan

dan komposisinya dikerjakan model gambar, yang memang jauh lebih pandai
menyusun poster daripada kode tata letak kita.

Aturan yang tidak boleh dilanggar di perintah gambar:
  * blok gaya dipakai SAMA PERSIS di semua adegan, hanya adegan, warna
    latar, dan judul yang berganti. Ini yang membuat delapan adegan terasa
    satu film.
  * potongan disebut satu per satu dengan tepi dan bayangan sendiri, supaya
    nanti benar-benar bisa digunting terpisah.
  * judul dipanggang ke dalam gambar. Model gambar menulis teks dengan
    rapi, model video mengaburkannya.
  * satu warna latar rata dan tegas per adegan. Latar ramai membunuh
    siluet guntingan.
  * sebut "BUKAN 3D, BUKAN CGI, pertahankan grain cetak" atau model akan
    melenceng ke render halus dan rasa kertasnya hilang.
"""
from __future__ import annotations

from dataclasses import dataclass, field

# Mekanika kolase: sama untuk semua tema, hanya idiomnya yang berganti.
MEKANIKA = (
    "Clearly layered hand-cut paper cut-outs with visible torn and scissor-cut edges, "
    "tape corners and soft real paper drop shadows, on a bold flat {latar} paper "
    "background. Halftone print dots, newspaper-clipping scraps, paper-stencil shapes, "
    "aged paper texture, slight print misregistration, scattered geometric paper accents "
    "(triangles, circles, zigzags, washi tape). Figures are PRINTED / illustrated "
    "cut-outs, NOT CGI, NOT a 3D render, keep print grain and paper imperfections. "
    "High-contrast, punchy, tactile, hand-assembled."
)

# Supaya potongannya benar-benar bisa digunting nanti, model harus diberi tahu
# bahwa tiap benda berdiri sendiri. Ini yang membedakan poster berlapis dari
# lukisan yang menyatu.
PISAHKAN = (
    "Compose the scene as SEPARATE overlapping paper pieces with clear gaps between "
    "them, each piece fully visible with its own crisp cut edge and its own drop "
    "shadow, arranged with strong editorial poster balance and generous negative space. "
    "Do not blend or merge the pieces into one continuous illustration."
)

# Kepadatan. Poster acuan yang kita tuju penuh dari tepi ke tepi: benda
# utama, benda pendukung, guntingan koran, pita selotip, serpihan segitiga
# dan zigzag, semuanya bertumpuk. Poster kita sebelumnya terlalu lapang,
# dan bidang kosong itulah yang membuatnya terasa seperti gambar anak-anak
# alih-alih kolase editorial.
KEPADATAN = (
    "Fill the whole frame edge to edge with layered material: the main subject, two or "
    "three supporting objects, torn newspaper clippings with real printed columns, strips "
    "of washi tape, ticket stubs and small labels, plus scattered geometric paper "
    "confetti (triangles, circles, zigzags) tucked behind and between the pieces. Rich, "
    "dense and busy like a real hand-assembled scrapbook page, with no large empty areas."
)

# Syarat latar, dan ini bukan soal selera melainkan soal biaya.
#
# Potongan digunting dari poster secara gratis dengan cara membuang warna
# latar. Cara itu hanya bisa dipercaya kalau warna latar jelas berbeda dari
# tepi kertas putih tiap potongan. Kalau latarnya krem muda, tepi kertas
# putihnya nyaris sewarna, guntingan lokal menggerogoti potongannya, dan
# kita terpaksa membayar layanan pembuang latar untuk tiap potongan.
#
# Satu kalimat di perintah gambar menghemat satu kredit per potongan.
LATAR_TERPISAH = (
    "The flat background colour must be a deep, saturated, clearly darker tone that "
    "contrasts strongly against the white torn-paper borders of every cut-out, so each "
    "piece reads as visibly separate from the background. Never use a pale cream, "
    "off-white or light beige background."
)


@dataclass(frozen=True)
class Tema:
    """Satu paket tampilan lengkap: idiom, warna, huruf, hasil cetak, suasana.

    tenaga menentukan seberapa besar amplitudo gerak bawaannya nanti:
    "tenang", "berdenyut", atau "maksimal".
    """

    nama: str
    label: str
    idiom: str
    warna: str
    huruf: str
    cetak: str
    suasana: str
    tenaga: str = "berdenyut"
    cocok: str = ""


TEMA: dict[str, Tema] = {
    "koran-editorial": Tema(
        "koran-editorial", "Koran editorial",
        "Vintage newsprint editorial collage in the style of a mid-century front-page "
        "news feature: bold cut-out photographs and illustrations laid over a broadsheet "
        "newspaper page, tactile cinematic editorial energy, reads like a newspaper "
        "feature spread brought to life, not an advertisement",
        "cream white, deep red, mustard yellow, charcoal black",
        "bold condensed newsprint headlines, all-caps",
        "aged paper, heavy halftone dots, high contrast, slight print misregistration",
        "energetic, tactile, cinematic editorial",
        "berdenyut", "sejarah, penjelasan, berita, kuliner"),
    "retro-amerika": Tema(
        "retro-amerika", "Retro Amerika 50-an",
        "Vintage 1950s-60s American advertising and pulp-magazine paper collage: bold "
        "flat retro colors, mid-century engraved and illustrated cut-out figures, "
        "classic printed imagery, nostalgic",
        "bold retro primaries, red, mustard, teal, cream",
        "bold wood-type / heavy slab, all-caps",
        "heavy halftone dots, aged newsprint, slight misregistration",
        "nostalgic, punchy", "berdenyut", "iklan, olahraga, bisnis, makanan"),
    "deco-emas": Tema(
        "deco-emas", "Art deco mewah",
        "Vintage luxury editorial paper collage, 1920s art-deco advertisement mood: "
        "aged cream paper with visible grain, champagne-gold foil paper accents, thin "
        "art-deco geometric line frames and gilded arches, torn newspaper clippings, "
        "hushed opulent museum-vitrine calm, reads like a fashion-house press page",
        "aged cream, champagne gold, charcoal black, muted deep gold",
        "elegant high-contrast didone serif, wide letter-spacing",
        "gold foil, aged paper grain, fine halftone, slight misregistration",
        "luxurious, calm, vintage editorial",
        "tenang", "tas, parfum, jam, mode, merek warisan"),
    "tinta-timur": Tema(
        "tinta-timur", "Tinta Asia Timur",
        "Mixed-media collage of Japanese and Chinese woodblock-print and ink-mural "
        "cut-out figures, aged rice-paper and old newspaper clippings, vermilion seal "
        "stamps, oriental and historical",
        "ink black, vermilion red, aged rice paper cream",
        "brush characters plus small clean caps, red seal",
        "rice-paper texture, ink bleed, fine halftone",
        "elegant, historical", "tenang", "teh, matcha, sejarah Asia, kerajinan"),
    "zine-punk": Tema(
        "zine-punk", "Zine punk",
        "Gritty punk zine ransom-note collage: torn newspaper and magazine scraps, "
        "cut-out mismatched headline letters, photocopied high-contrast halftone, raw "
        "hand-cut edges, DIY analog and urgent",
        "black and white plus one fluorescent spot color",
        "ransom-note cut-out mismatched letters",
        "photocopy grain, heavy misregistration",
        "urgent, rebellious", "maksimal", "anak muda, tren, kritik, streetwear"),
    "swiss-bersih": Tema(
        "swiss-bersih", "Swiss modern",
        "Clean modern flat 2D illustrated collage in the explainer motion-graphic style: "
        "bold flat-color cut-outs, simple confident shapes, crisp infographic editorial "
        "layout",
        "two-color plus one red accent, lots of white",
        "grotesque sans, tight caps",
        "clean flat, very subtle grain",
        "precise, confident", "tenang", "teknologi, angka, cara kerja"),
}

BAWAAN = "koran-editorial"

# Amplitudo gerak per tema, dipakai lapisan gerak.
AMPLITUDO = {"tenang": 0.65, "berdenyut": 1.0, "maksimal": 1.45}


def tema(nama: str | None) -> Tema:
    return TEMA.get(nama or BAWAAN, TEMA[BAWAAN])


def usulkan(kategori: str, topik: str) -> list[str]:
    """Usulkan tiga tema yang pantas diadu, dipilih dari kategori dan topiknya.

    Tema dicocokkan dengan TOPIK, bukan dengan bahasanya. Video berbahasa
    Indonesia tentang teh Jepang tetap sebaiknya terlihat Jepang.
    """
    t = topik.lower()
    if kategori == "fashion":
        pilih = ["deco-emas", "koran-editorial", "retro-amerika"]
        if any(k in t for k in ("streetwear", "muda", "sneaker", "tren")):
            pilih = ["zine-punk", "koran-editorial", "deco-emas"]
    else:
        pilih = ["koran-editorial", "retro-amerika", "tinta-timur"]
        if any(k in t for k in ("teh", "matcha", "jepang", "cina", "tiongkok", "korea")):
            pilih = ["tinta-timur", "koran-editorial", "retro-amerika"]
    return pilih


def prompt_poster(
    adegan: str,
    *,
    judul: str = "",
    latar: str = "warm ochre",
    nama_tema: str | None = None,
    rasio: str = "9:16",
    dengan_judul: bool = True,
    acuan_produk: str = "",
) -> str:
    """Susun perintah gambar untuk satu poster kolase, lima bagian.

    dengan_judul dimatikan untuk bidikan detail, supaya judul hanya muncul
    sekali per beat dan tidak bertabrakan saat dua bidikan disambung.
    """
    g = tema(nama_tema)
    blok = f"{g.idiom}. Palette: {g.warna}. {MEKANIKA.format(latar=latar)} " \
           f"Print finish: {g.cetak}. Mood: {g.suasana}."
    if dengan_judul and judul:
        kepala = (f" Include a torn-paper banner with a big bold cut-out headline "
                  f"\"{judul.upper()}\" in {g.huruf}, plus a small paper sticker accent. "
                  f"Keep the headline crisp and legible.")
    else:
        kepala = (" No big headline in this shot, only a small paper accent; "
                  "it is a cut-in detail.")
    produk = f" {acuan_produk.strip()}" if acuan_produk.strip() else ""
    return (f"{blok} SCENE as layered paper cut-outs: {adegan}. {PISAHKAN} {KEPADATAN} "
            f"{LATAR_TERPISAH}{produk}{kepala} Aspect ratio {rasio}, high resolution.")


# Kunci produk, dipakai kalau posternya harus memuat foto produk sungguhan.
# Diminta apa adanya sebagai stiker fotografis: model boleh membangun dunia
# kertas di sekelilingnya, tapi tidak boleh menggambar ulang produknya.
KUNCI_PRODUK = (
    "The product from the attached photo is cut out as a PHOTOGRAPHIC sticker with a "
    "clean scissor-cut edge and a soft real paper drop shadow. Keep its exact shape, "
    "materials, surface reflections and every word of its label typography "
    "pixel-faithful. Do not redraw, restyle or repaint the product or its label. "
    "Re-style ONLY the world around it as printed paper collage."
)
