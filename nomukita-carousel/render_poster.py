"""Gambar kategori bergaya poster, mengikuti referensi "Iced Mango Matcha Latte"
(IMG_3662). Satu gambar per kategori.

Yang diukur dari acuan (kanvas 1086 x 1448):

  bidang        krem hangat (235,217,195), rata tanpa pita
  naskah kecil  y 89..156, lebar 317, dipusatkan pada 546 (tengah kanvas 543)
  judul         DUA baris yang DIULANG tiga kali, jadi enam baris. Puncak
                hurufnya di 190, 344, 504, 661, 822, 977 - jaraknya 157,4 px
                dan tinggi hurufnya 122, jadi selanya 35 px
  lebar tinta   924 dan 927 dari 1086, yaitu 0,851 lebar kanvas, dan KEDUA
                baris sama lebar; itu yang membuat baloknya rata kiri-kanan
  produk        di tengah, tinggi 843 (0,582 tinggi kanvas), alasnya di 1330
                (0,918), digambar DI ATAS naskah sehingga empat baris terakhir
                tertutup sebagian

Yang dipinjam: balok naskah berulang, produk menindihnya, satu baris kecil di
atas. Itu saja - dan itu memang seluruh isi acuannya.

Yang tidak disalin:

  Warnanya. Krem dan jingga acuan tidak ada di palet Nomukita. Bidangnya
  disusun sebagai campuran bone white dengan warna judulnya sendiri, 22 persen,
  meniru hubungan acuan (krem adalah jingga yang sangat diencerkan).

  Hurufnya. Acuan memakai serif kontras tinggi. Merek ini memakai All Round
  Gothic untuk judul, dan itu yang dipakai.

  Naskahnya. "Iced Mango Matcha Latte" adalah nama satu minuman. Yang
  menggantikannya nama kategori dan jumlah anggotanya, dua hal yang tercetak di
  kemasannya sendiri.

  Cangkirnya. Diminta pelanggan: gelas plastik acuan diganti salah satu kemasan
  dari kategori yang bersangkutan.

Satu hal yang tidak bisa disalin: acuan memilih dua baris yang KEBETULAN hampir
sama lebar ("Iced Mango" 924, "Matcha Latte" 927) pada satu ukuran huruf. Nama
kategori tidak sepanjang itu satu sama lain, jadi lebarnya yang dijaga tetap dan
tinggi hurufnya yang dibiarkan berbeda - cara yang sama yang dipakai pada
keterangan slide 5.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs

BONE = bs.BG
MATCHA = bs.MATCHA_GREEN
STEEL = bs.STEEL_BLUE
CHAR = bs.CHARCOAL


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# Berapa banyak warna judul dilarutkan ke dalam bidang. Acuan memakai kira-kira
# 0,27 jingga di dalam putih, tapi jingganya gelap (terang 119 lawan bidang 219,
# selisih 100). Steel blue Nomukita jauh lebih terang, jadi larutan yang sama
# hanya menyisakan selisih 73 dan judulnya terbaca lemah. Yang dikurangi
# larutannya, bukan warnanya: judulnya tetap warna merek apa adanya.
FIELD_MIX = 0.10


# ── tata letak, semuanya pecahan kanvas ─────────────────────────────────────
LAYOUT = dict(
    logo_top=0.061, logo_w=0.290,
    text_top=0.131, text_w=0.851, line_gap=0.0242, lines=6,
    hero_h=0.582, hero_w=0.720, hero_bottom=0.918,
)

SIZES = {"1024": (1024, 1024), "1080x1440": (1080, 1440)}


# ── kategori ────────────────────────────────────────────────────────────────
# Judul dua baris, diulang. Barisnya pendek dan sejenis satu sama lain supaya
# tinggi hurufnya tidak terlalu jauh berbeda setelah dipaskan ke satu lebar.
#
# Angkanya dari kemasan, bukan karangan: Premium sepuluh dan Exclusive dua
# dibaca dari kata seri yang TERCETAK di label, bukan dari nama berkas mockup -
# empat mockup bernama "Exclusive series" padahal labelnya sendiri Premium.
# Matcha Series lima: tiga origin ditambah dua racikan.
CATEGORY = {
    "matcha": dict(
        lines=["MATCHA SERIES", "FIVE PACKS"],
        hero="Mockup nomukita-Pure Matcha Uji Kyoto.png",
        hue=MATCHA,
    ),
    "premium": dict(
        lines=["PREMIUM SERIES", "TEN FLAVOURS"],
        hero="Mockup nomukita-Exclusive series-matcha latte.png",
        hue=STEEL,
    ),
    "exclusive": dict(
        lines=["EXCLUSIVE SERIES", "TWO FLAVOURS"],
        hero="Mockup nomukita-Exclusive series-chocolate.png",
        hue=STEEL,
    ),
    "250gram": dict(
        lines=["250 GRAM PACK", "TWELVE FLAVOURS"],
        hero="nomukita-matcha latte japanese.png",
        hue=STEEL, white=True,
    ),
    "1000gram": dict(
        lines=["1000 GRAM POUCH", "TWELVE FLAVOURS"],
        hero="Mockup nomukita-Exclusive series-Teh Tarik.png",
        hue=STEEL,
    ),
}


def _fit(text, target, colour):
    """Potongan judul yang lebarnya tepat `target`.

    `bs.build_headline` menyusun kata demi kata supaya glyph yang terkunci
    lisensinya bisa berganti font, jadi lebarnya tidak persis sebanding dengan
    ukuran huruf. Diukur sekali, diskalakan, lalu dikoreksi sampai selisihnya
    di bawah satu piksel - biasanya dua putaran.
    """
    size = 200
    strip = bs.build_headline(text, size, colour)
    for _ in range(6):
        if strip.width == target:
            return strip
        size = max(8, int(size * target / strip.width))
        strip = bs.build_headline(text, size, colour)
    # Ukuran huruf bilangan bulat, jadi lebarnya melompat beberapa piksel dan
    # tidak pernah mendarat tepat: enam baris berakhir 866, 867 dan 868 px, dan
    # tepi baloknya bergerigi. Sisanya diselesaikan pada potongannya sendiri -
    # regangan di bawah setengah persen, tidak terlihat, dan baloknya rata.
    return strip.resize((target, round(strip.height * target / strip.width)),
                        Image.LANCZOS)


def _shadow(canvas, im, x, y):
    """Bayangan sentuh di bawah kemasan, selebar alasnya."""
    w, h = im.size
    layer = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(layer).ellipse(
        [x + w * 0.12, y + h - h * 0.035, x + w * 0.88, y + h + h * 0.045], fill=72)
    sh = Image.new("RGBA", canvas.size, (58, 54, 46, 0))
    sh.putalpha(layer.filter(ImageFilter.GaussianBlur(w * 0.045)))
    canvas.alpha_composite(sh)


LAST = {}
MIN_CONTRAST = 40


def build(cat="premium", size="1024", out=None):
    spec = CATEGORY[cat]
    W, H = SIZES[size]
    L = LAYOUT
    out = out or f"Poster_{cat}_{size}.png"

    hue = spec["hue"]
    field = mix(BONE, hue, FIELD_MIX)
    flat = Image.new("RGB", (W, H), field)

    # ── balok naskah ────────────────────────────────────────────────────────
    target = round(L["text_w"] * W)
    strips = [_fit(t, target, hue) for t in spec["lines"]]
    text = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = L["text_top"] * H
    left = round((W - target) / 2)
    tops = []
    for i in range(L["lines"]):
        s = strips[i % 2]
        text.alpha_composite(s, (left, round(y)))
        tops.append((round(y), s.height))
        y += s.height + L["line_gap"] * H
    flat.paste(text, (0, 0), text)

    # ── kemasan, di atas naskah ─────────────────────────────────────────────
    im = Image.open(f'{bs.PROD}/{spec["hero"]}').convert("RGBA")
    im = im.crop(im.getbbox())
    ratio = im.width / im.height
    # Dibatasi tinggi DAN lebar. Gelas acuan 52 persen lebar dan 58 persen
    # tinggi; kemasan 250 gram 1,24 kali lebih lebar daripada tinggi, jadi batas
    # lebar yang sama menyisakan tinggi 488 px saja - kemasannya lalu berdiri
    # SELURUHNYA di bawah balok naskah, tidak menindih apa pun, dan susunan
    # berlapis yang jadi inti acuan itu hilang. Batas lebarnya dilonggarkan
    # sampai kemasan selebar itu tetap setinggi kemasan lain.
    h = min(L["hero_h"] * H, L["hero_w"] * W / ratio)
    w = h * ratio
    im = im.resize((round(w), round(h)), Image.LANCZOS)
    if spec.get("white"):
        im = bs.model_white(im)
    hx = (W - im.width) / 2
    hy = L["hero_bottom"] * H - im.height

    hero = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    _shadow(hero, im, hx, hy)
    hero.alpha_composite(im, (round(hx), round(hy)))
    flat.paste(hero, (0, 0), hero)

    # ── logo ────────────────────────────────────────────────────────────────
    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    # Diukur dari LEBARnya, bukan tingginya. Naskah kecil pada acuan selebar
    # 0,29 kanvas; wordmark ini 6,9 kali lebih lebar daripada tinggi, jadi
    # menyamakan tingginya membuatnya 0,435 kanvas - dua pertiga lebih lebar
    # daripada yang digantikannya, dan ia berhenti terbaca sebagai baris kecil.
    lw = round(L["logo_w"] * W)
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    tint = Image.new("RGBA", logo.size, hue + (0,))
    tint.putalpha(logo.split()[3])
    logo_box = ((W - logo.width) // 2, round(L["logo_top"] * H))
    flat.paste(tint, logo_box, tint)

    flat.save(out)
    LAST[out] = dict(field=field, hue=hue, text=text, tops=tops, target=target,
                     hero=(round(hx), round(hy), round(hx) + im.width,
                           round(hy) + im.height),
                     logo=(logo_box[0], logo_box[1],
                           logo_box[0] + logo.width, logo_box[1] + logo.height),
                     size=(W, H))
    return out


def check(path):
    L = LAST[path]
    W, H = L["size"]
    out = []

    if abs(np.mean(L["hue"]) - np.mean(L["field"])) < MIN_CONTRAST:
        out.append("judul tanpa kontras terhadap bidang")

    # Lebar tiap baris harus sama - itu satu-satunya alasan baloknya terbaca
    # sebagai balok. Selisih dua piksel saja sudah tampak sebagai tepi bergerigi.
    ink = np.asarray(L["text"])[..., 3] > 128
    for i, (top, hgt) in enumerate(L["tops"]):
        xs = np.nonzero(ink[top:top + hgt].any(0))[0]
        if len(xs) == 0:
            out.append(f"baris {i + 1} kosong")
        elif abs((xs.max() - xs.min() + 1) - L["target"]) > 2:
            out.append(f"baris {i + 1} lebarnya {xs.max() - xs.min() + 1}, "
                       f"bukan {L['target']}")
        if xs.min() < 2 or xs.max() > W - 3:
            out.append(f"baris {i + 1} menyentuh tepi kanvas")

    hx0, hy0, hx1, hy1 = L["hero"]
    if hx0 < 0 or hy0 < 0 or hx1 > W or hy1 > H:
        out.append("kemasan terpotong tepi kanvas")
    lx0, ly0, lx1, ly1 = L["logo"]
    if not (hx1 < lx0 or hx0 > lx1 or hy1 < ly0 or hy0 > ly1):
        out.append("kemasan menutupi logo")

    # Balok naskah harus benar-benar tertindih kemasan, bukan berhenti di
    # atasnya: itu yang membuat komposisinya berlapis, dan itu inti acuannya.
    last_bottom = L["tops"][-1][0] + L["tops"][-1][1]
    if hy0 > last_bottom:
        out.append("kemasan tidak menindih naskah sama sekali")

    return out


def build_all():
    made = []
    for cat in CATEGORY:
        for size in SIZES:
            made.append(build(cat, size))
    return made


if __name__ == "__main__":
    for f in build_all():
        print(f"{f:34s}", check(f) or "PASS")
