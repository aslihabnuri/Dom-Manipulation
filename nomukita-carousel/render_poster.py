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
from PIL import Image, ImageDraw, ImageFilter, ImageFont
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
#
# Versi pertama menyalin kepadatan acuan apa adanya: dua baris berisi tiga kata,
# diulang tiga kali, selebar 0,851 kanvas. Enam baris huruf tebal setinggi 122 px
# memenuhi hampir seluruh bidang. Pada acuan itu berhasil karena naskahnya nama
# satu minuman yang memang panjang dan hurufnya serif tipis-tebal, jadi baloknya
# terbaca sebagai tekstur. Dengan All Round Gothic yang tebal merata dan nama
# kategori yang pendek, yang tersisa hanya kata bertumpuk - dan pelanggan benar,
# itu bukan minimalis Jepang.
#
# Yang dikurangi jumlah katanya, bukan gagasannya. Perulangan tetap, tapi yang
# diulang SATU kata, tiga kali, selebar 0,52 kanvas. Jumlah anggotanya turun ke
# satu baris kecil di kaki. Sisanya ruang kosong.
LAYOUT = dict(
    logo_top=0.070, logo_w=0.200,
    kanji_top=0.134, kanji_h=0.050,
    text_top=0.243, text_w=0.520, line_gap=0.010, lines=3,
    hero_h=0.560, hero_w=0.720, hero_bottom=0.882, overlap=0.055,
    cap_top=0.930, cap_size=0.0205, cap_track=0.26,
)

SIZES = {"1024": (1024, 1024), "1080x1440": (1080, 1440)}


# ── kategori ────────────────────────────────────────────────────────────────
# Satu kata yang diulang, satu tanda kanji, satu baris kaki. Kanjinya hanya yang
# TERCETAK pada kemasan Nomukita sendiri - 抹茶 pada kemasan matcha, 飲む pada
# kemasan 250 gram - supaya tidak ada satu pun kata Jepang yang saya karang.
#
# Angkanya juga dari kemasan: Premium sepuluh dan Exclusive dua dibaca dari kata
# seri yang tercetak di label, bukan dari nama berkas mockup - empat mockup
# bernama "Exclusive series" padahal labelnya sendiri Premium. Matcha Series
# lima: tiga origin ditambah dua racikan.
CATEGORY = {
    "matcha": dict(
        word="MATCHA", kanji="抹茶", cap="five packs",
        hero="Mockup nomukita-Pure Matcha Uji Kyoto.png",
        hue=MATCHA,
    ),
    "premium": dict(
        word="PREMIUM", kanji="飲む", cap="ten flavours",
        hero="Mockup nomukita-Exclusive series-matcha latte.png",
        hue=STEEL,
    ),
    "exclusive": dict(
        word="EXCLUSIVE", kanji="飲む", cap="two flavours",
        hero="Mockup nomukita-Exclusive series-chocolate.png",
        hue=STEEL,
    ),
    "250gram": dict(
        word="250 GRAM", kanji="飲む", cap="twelve flavours",
        hero="nomukita-matcha latte japanese.png",
        hue=STEEL, white=True,
    ),
    "1000gram": dict(
        word="1000 GRAM", kanji="飲む", cap="twelve flavours",
        hero="Mockup nomukita-Exclusive series-Teh Tarik.png",
        hue=STEEL,
    ),
}


def _fit(text, target, colour):
    """Potongan judul yang lebarnya tepat `target`.

    `bs.build_headline` menyusun kata demi kata supaya glyph yang terkunci
    lisensinya bisa berganti font, jadi lebarnya tidak persis sebanding dengan
    ukuran huruf.
    """
    size = 200
    strip = bs.build_headline(text, size, colour)
    for _ in range(6):
        if strip.width == target:
            return strip
        size = max(8, int(size * target / strip.width))
        strip = bs.build_headline(text, size, colour)
    # Ukuran huruf bilangan bulat, jadi lebarnya melompat beberapa piksel dan
    # tidak pernah mendarat tepat: tiga baris berakhir 866, 867 dan 868 px, dan
    # tepi baloknya bergerigi. Sisanya diselesaikan pada potongannya sendiri -
    # regangan di bawah setengah persen, tidak terlihat, dan baloknya rata.
    return strip.resize((target, round(strip.height * target / strip.width)),
                        Image.LANCZOS)


def _ink(layer):
    b = layer.getbbox()
    return layer.crop(b) if b else layer


def _glyph(text, font_path, target_h, colour):
    """Satu tanda kanji setinggi `target_h`, diukur dari tintanya sendiri.

    Ukuran font bukan tinggi tinta: ShipporiMincho menyisakan ruang di atas dan
    di bawah glyph, dan 抹茶 (dua kotak penuh) tidak setinggi 飲む (yang punya
    ekor). Diukur, lalu diskalakan.
    """
    probe = 200
    f = ImageFont.truetype(font_path, probe)
    layer = Image.new("RGBA", (probe * 4, probe * 3), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((probe // 2, probe // 2), text, font=f,
                               fill=colour + (255,))
    layer = _ink(layer)
    if layer.height == 0:
        return layer
    w = max(1, round(layer.width * target_h / layer.height))
    return layer.resize((w, round(target_h)), Image.LANCZOS)


def _tracked(text, font, colour, track):
    """Baris berjarak huruf. Comfortaa tidak punya varian small caps, dan baris
    kaki yang rapat terbaca sebagai catatan kaki, bukan sebagai penutup."""
    parts = []
    for ch in text:
        layer = Image.new("RGBA", (font.size * 3, font.size * 3), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((font.size, font.size), ch, font=font,
                                   fill=colour + (255,))
        parts.append((layer, font.getlength(ch)))
    gap = font.size * track
    total = round(sum(a for _, a in parts) + gap * (len(parts) - 1))
    strip = Image.new("RGBA", (total + font.size * 3, font.size * 3), (0, 0, 0, 0))
    x = 0.0
    for layer, adv in parts:
        strip.alpha_composite(layer, (round(x - font.size), 0))
        x += adv + gap
    return _ink(strip)


def _shadow(canvas, im, x, y):
    """Bayangan sentuh di bawah kemasan, selebar alasnya."""
    w, h = im.size
    layer = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(layer).ellipse(
        [x + w * 0.12, y + h - h * 0.035, x + w * 0.88, y + h + h * 0.045], fill=72)
    sh = Image.new("RGBA", canvas.size, (58, 54, 46, 0))
    sh.putalpha(layer.filter(ImageFilter.GaussianBlur(w * 0.045)))
    canvas.alpha_composite(sh)


ECHO_R = 0.62      # tiap salinan sekian kali kekuatan salinan di atasnya
MAX_ECHO = 6

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

    # ── kemasan diukur lebih dulu, karena banyaknya perulangan bergantung
    #    pada di mana puncaknya jatuh ───────────────────────────────────────
    im = Image.open(f'{bs.PROD}/{spec["hero"]}').convert("RGBA")
    im = im.crop(im.getbbox())
    ratio = im.width / im.height
    # Dibatasi tinggi DAN lebar. Kemasan 250 gram 1,24 kali lebih lebar daripada
    # tinggi; dengan batas lebar yang sama seperti kemasan tinggi, tingginya
    # tinggal sepertiga dan ia berdiri seluruhnya di bawah balok naskah.
    h = min(L["hero_h"] * H, L["hero_w"] * W / ratio)
    im = im.resize((round(h * ratio), round(h)), Image.LANCZOS)
    if spec.get("white"):
        im = bs.model_white(im)
    hx = (W - im.width) / 2
    hy = L["hero_bottom"] * H - im.height

    # ── balok naskah: satu kata, diulang dan memudar ────────────────────────
    target = round(L["text_w"] * W)
    strip = _fit(spec["word"], target, hue)
    text = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    y = L["text_top"] * H
    left = round((W - target) / 2)
    tops = []
    # Banyaknya salinan bukan angka tetap. Tinggi huruf turun dari lebar yang
    # dijaga tetap, jadi kata panjang menghasilkan potongan pendek: "250 GRAM"
    # hanya setinggi 82 px dan tiga salinannya berakhir 17 px DI ATAS puncak
    # kemasan - tidak ada yang tertindih, dan susunan berlapis yang jadi inti
    # acuan itu hilang. Salinan ditambah sampai baloknya benar-benar masuk ke
    # belakang kemasan.
    i = 0
    while i < MAX_ECHO and (i < L["lines"] or y < hy + L["overlap"] * H):
        fade = strip.copy()
        fade.putalpha(fade.split()[3].point(lambda v, k=ECHO_R ** i: round(v * k)))
        text.alpha_composite(fade, (left, round(y)))
        tops.append((round(y), strip.height))
        y += strip.height + L["line_gap"] * H
        i += 1
    flat.paste(text, (0, 0), text)

    hero = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    _shadow(hero, im, hx, hy)
    hero.alpha_composite(im, (round(hx), round(hy)))
    flat.paste(hero, (0, 0), hero)

    # ── logo, kanji, baris kaki ─────────────────────────────────────────────
    marks = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    lw = round(L["logo_w"] * W)
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    tint = Image.new("RGBA", logo.size, hue + (0,))
    tint.putalpha(logo.split()[3])
    logo_box = ((W - lw) // 2, round(L["logo_top"] * H))
    marks.alpha_composite(tint, logo_box)

    kanji = _glyph(spec["kanji"], bs.F_JP, L["kanji_h"] * H, hue)
    kanji_box = ((W - kanji.width) // 2, round(L["kanji_top"] * H))
    marks.alpha_composite(kanji, kanji_box)

    cf = ImageFont.truetype(bs.F_BODY, round(L["cap_size"] * H))
    cap = _tracked(spec["cap"], cf, hue, L["cap_track"])
    cap_box = ((W - cap.width) // 2, round(L["cap_top"] * H))
    marks.alpha_composite(cap, cap_box)

    flat.paste(marks, (0, 0), marks)
    flat.save(out)

    LAST[out] = dict(field=field, hue=hue, text=text, tops=tops, target=target,
                     hero=(round(hx), round(hy), round(hx) + im.width,
                           round(hy) + im.height),
                     marks=[logo_box + (logo_box[0] + lw, logo_box[1] + logo.height),
                            kanji_box + (kanji_box[0] + kanji.width,
                                         kanji_box[1] + kanji.height),
                            cap_box + (cap_box[0] + cap.width,
                                       cap_box[1] + cap.height)],
                     size=(W, H))
    return out


def check(path):
    L = LAST[path]
    W, H = L["size"]
    out = []

    if abs(np.mean(L["hue"]) - np.mean(L["field"])) < MIN_CONTRAST:
        out.append("judul tanpa kontras terhadap bidang")

    ink = np.asarray(L["text"])[..., 3] > 12   # salinan terlemah bisa 0,09
    for i, (top, hgt) in enumerate(L["tops"]):
        xs = np.nonzero(ink[top:top + hgt].any(0))[0]
        if len(xs) == 0:
            out.append(f"baris {i + 1} kosong")
            continue
        if abs((xs.max() - xs.min() + 1) - L["target"]) > 2:
            out.append(f"baris {i + 1} lebarnya {xs.max() - xs.min() + 1}, "
                       f"bukan {L['target']}")
        if xs.min() < 2 or xs.max() > W - 3:
            out.append(f"baris {i + 1} menyentuh tepi kanvas")

    hx0, hy0, hx1, hy1 = L["hero"]
    if hx0 < 0 or hy0 < 0 or hx1 > W or hy1 > H:
        out.append("kemasan terpotong tepi kanvas")

    names = ("logo", "kanji", "baris kaki")
    for name, (mx0, my0, mx1, my1) in zip(names, L["marks"]):
        if not (hx1 < mx0 or hx0 > mx1 or hy1 < my0 or hy0 > my1):
            out.append(f"kemasan menutupi {name}")
        if mx0 < 2 or my0 < 2 or mx1 > W - 2 or my1 > H - 2:
            out.append(f"{name} menyentuh tepi kanvas")

    # Balok naskah harus benar-benar tertindih kemasan: itu yang membuat
    # komposisinya berlapis, dan itu inti acuannya.
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
