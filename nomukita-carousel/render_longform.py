"""Halaman panjang satu seri, mengikuti referensi Sprout Living "Epic Protein".

Bentuknya diukur dari `refs/Matcha Series_Referensi.webp` yang dikirim pelanggan:
kanvas tinggi berisi pita-pita berwarna yang dipisah garis DIAGONAL, tiap pita
memuat satu produk dan satu blok teks, dan sisi teks-produk BERGANTIAN dari pita
ke pita.

Yang diukur dari acuan:
  kanvas          1200 x 2377, empat pita
  tinggi pita     588 px, dengan tepi putih 12 px di atas
  kemiringan      0,2 px turun per px mendatar, arahnya BERGANTIAN tiap batas
                  (batas 1 naik ke kanan, batas 2 turun ke kanan, batas 3 naik)
  susunan         pita 1 teks kiri, pita 2 teks kanan, pita 3 kiri, pita 4 kanan

Yang TIDAK diambil dari acuan adalah warnanya. Acuannya memakai empat pastel -
biru (169,224,249), salmon (252,204,190), krem (247,219,167), mint (179,221,191)
- dan tidak satu pun ada di palet Nomukita. Menyalinnya berarti mengarang empat
warna merek baru. Jadi pitanya berselang-seling antara bone white dan satu tint
matcha green, dua-duanya sudah ada di palet, dan headline-nya tetap matcha green
seperti di seluruh slide yang sudah disetujui.

Acuannya juga memakai teks putih miring. Comfortaa maupun All Round Gothic tidak
punya potongan miring, dan teks putih di atas tint terang tidak terbaca. Jadi
warnanya charcoal, yaitu warna teks merek ini sejak slide pertama.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs

W = 1200
BAND_H = 588            # diukur dari acuan
TOP_MARGIN = 12
SLOPE = 0.2             # 0,2 px turun per px mendatar
TINT = 0.18             # seberapa jauh pita berwarna bergerak dari bone ke green

# Acuannya langsung masuk ke pita pertama tanpa kepala halaman, karena ia
# potongan dari halaman yang lebih panjang. Gambar ini berdiri sendiri di
# deskripsi produk, jadi ia perlu menyatakan miliknya siapa.
HEADER_H = 400

SIDE = 96               # tepi kiri/kanan blok teks
TEXT_W = 440
HEAD_SIZE = 58
SUB_SIZE = 26
SUB_LEAD = 34
HEAD_TO_SUB = 42
POUCH_H = 420
WEIGHT_SIZE = 19
WEIGHT_GAP = 26


def _mix(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


BAND_TINT = None        # dihitung saat impor selesai, lihat di bawah
BAND_TINT = _mix(bs.BG, bs.MATCHA_GREEN, TINT)


SERIES = {
    "matcha": {
        "head": "MATCHA SERIES",
        "kanji": "抹茶",
        "subtitle": "three origins · two blends",
        "members": [
            ("UJI KYOTO", ["The old tea district of Kyoto,",
                           "where matcha was first measured."],
             "500 gram", "Mockup nomukita-Pure Matcha Uji Kyoto.png"),
            ("SHIZOUKA", ["Japan's largest tea growing region,",
                          "and its steadiest harvest."],
             "500 gram", "Mockup nomukita-Pure Matcha Shizouka.png"),
            ("NISHIO", ["A town in Aichi that has been",
                        "milling matcha for centuries."],
             "500 gram", "Mockup nomukita-Pure Matcha Nishio.png"),
            ("MATCHA LATTE", ["Matcha and milk already balanced,",
                              "so the leaf still comes through."],
             "1000 gram", "Mockup nomukita-Exclusive series-matcha latte.png"),
            ("PREMIX MATCHA", ["Matcha that stands on its own,",
                               "with no cream to cover it."],
             "1000 gram", "Mockup nomukita-Exclusive series-matcha.png"),
        ],
    },
}


def _band(draw, top, bottom, colour, slope_top, slope_bottom):
    """Satu pita dengan tepi atas dan bawah yang miring.

    Tiap batas dinyatakan sebagai ketinggian di tengah kanvas plus kemiringan,
    supaya dua pita bertetangga selalu memakai garis yang sama persis dan tidak
    meninggalkan celah seukuran satu piksel di antaranya.
    """
    half = W / 2
    draw.polygon([(0, top - slope_top * (0 - half)),
                  (W, top - slope_top * (W - half)),
                  (W, bottom - slope_bottom * (W - half)),
                  (0, bottom - slope_bottom * (0 - half))], fill=colour)


def _text_block(canvas, lines, font, colour, left, top, lead):
    pad = 300
    y = top
    for line in lines:
        layer = Image.new("RGBA", (W + 2 * pad, 400 + 2 * pad), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((pad, pad), line, font=font, fill=colour + (255,))
        bb = layer.getbbox()
        if bb:
            canvas.alpha_composite(layer, (round(left - (bb[0] - pad) - pad),
                                           round(y - (bb[1] - pad) - pad)))
        y += lead
    return y


def _drop_shadow(canvas, x, y, w, h):
    """Bayangan lembut di bawah pouch.

    Acuannya menaruh bayangan jatuh di bawah tiap kemasan; tanpa itu pouch-nya
    menggantung di tengah pita tanpa apa pun yang menahannya.
    """
    from PIL import ImageFilter
    layer = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(layer).ellipse([x + w * 0.06, y + h - 18, x + w * 0.94, y + h + 26],
                                  fill=78)
    shadow = Image.new("RGBA", canvas.size, (126, 124, 116, 0))
    shadow.putalpha(layer.filter(ImageFilter.GaussianBlur(26)))
    canvas.alpha_composite(shadow)


def build(series="matcha", out="longform.png"):
    spec = SERIES[series]
    members = spec["members"]
    n = len(members)
    H = TOP_MARGIN * 2 + HEADER_H + BAND_H * n

    flat = Image.new("RGB", (W, H), bs.BG)
    d = ImageDraw.Draw(flat)

    # Pita dulu, semuanya, supaya tiap batas digambar satu kali saja.
    edges = [TOP_MARGIN + HEADER_H + BAND_H * i for i in range(n + 1)]
    slopes = [0.0] + [SLOPE * (-1) ** i for i in range(n - 1)] + [0.0]
    for i in range(n):
        if i % 2 == 0:
            _band(d, edges[i], edges[i + 1], BAND_TINT, slopes[i], slopes[i + 1])

    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    head_f = ImageFont.truetype(bs.F_HEAD, HEAD_SIZE)
    sub_f = ImageFont.truetype(bs.F_BODY, SUB_SIZE)

    # ── kepala halaman ───────────────────────────────────────────────────────
    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    c.alpha_composite(logo, ((W - logo.width) // 2, 96))
    bs.draw_text_top(c, spec["kanji"], ImageFont.truetype(bs.F_JP, bs.KANJI_SIZE),
                     bs.KANJI_GREY, W // 2, 200)
    big = bs.build_headline(spec["head"], 76, bs.MATCHA_GREEN)
    c.alpha_composite(big, ((W - big.width) // 2, 254))
    bs.draw_text_top(c, spec["subtitle"], ImageFont.truetype(bs.F_BODY, 28),
                     bs.CHARCOAL, W // 2, 332)

    for i, (name, sub, weight, mock) in enumerate(members):
        mid = edges[i] + BAND_H / 2
        text_left = (i % 2 == 0)

        head = bs.build_headline(name, HEAD_SIZE, bs.MATCHA_GREEN)
        block_h = (head.height + HEAD_TO_SUB + SUB_LEAD * (len(sub) - 1)
                   + SUB_SIZE + WEIGHT_GAP + WEIGHT_SIZE)
        top = mid - block_h / 2
        x = SIDE if text_left else W - SIDE - TEXT_W
        c.alpha_composite(head, (round(x), round(top)))
        end = _text_block(c, sub, sub_f, bs.CHARCOAL, x,
                          top + head.height + HEAD_TO_SUB, SUB_LEAD)
        # Berat dinyatakan dengan kata: Pure Matcha 500 gram dan racikannya 1000
        # gram dirender setinggi sama, jadi selisihnya harus ditulis, bukan
        # disiratkan lewat ukuran yang skalanya belum bisa dipastikan.
        # Charcoal, bukan kanji grey. Kanji grey (219,218,213) dipakai untuk
        # watermark di atas bone white; di atas tint pita (220,226,205) selisihnya
        # tinggal satu level dan barisnya hilang sama sekali. Tingkatannya dibawa
        # ukuran huruf, bukan warna.
        _text_block(c, [weight], ImageFont.truetype(bs.F_BODY, WEIGHT_SIZE),
                    bs.CHARCOAL, x, end - SUB_LEAD + WEIGHT_GAP + SUB_SIZE, 0)

        im = Image.open(f"{bs.PROD}/{mock}").convert("RGBA")
        im = im.crop(im.getbbox())
        pw = round(im.width * POUCH_H / im.height)
        px = W - SIDE - pw if text_left else SIDE
        py = mid - POUCH_H / 2
        _drop_shadow(c, px, py, pw, POUCH_H)
        c.alpha_composite(im.resize((pw, POUCH_H), Image.LANCZOS),
                          (round(px), round(py)))

    flat.paste(c, (0, 0), c)
    flat.save(out)
    return out
