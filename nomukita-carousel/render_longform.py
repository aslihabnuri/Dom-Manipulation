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
# Kemiringan acuannya 0,2 px per px pada pita setinggi 588 di kanvas selebar
# 1200, artinya diagonalnya naik-turun 240 px sepanjang kanvas, atau 0,41 kali
# tinggi pitanya. Yang tetap adalah PERBANDINGAN itu, bukan angka 0,2.
#
# Ini bukan kerapian belaka. Dipakai 0,2 pada kanvas 1:1 yang pitanya cuma 170
# px, diagonalnya naik-turun 205 px - lebih tinggi daripada pitanya sendiri -
# sehingga batas atas dan batas bawah saling menyeberang dan pitanya pecah jadi
# baji, bukan pita.
RISE_RATIO = 0.408


def _slope(band_h, canvas_w):
    return RISE_RATIO * band_h / canvas_w
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
    sl = _slope(BAND_H, W)
    slopes = [0.0] + [sl * (-1) ** i for i in range(n - 1)] + [0.0]
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


# ── versi 1:1 ────────────────────────────────────────────────────────────────
#
# Marketplace meminta 1:1, jadi bentuk panjang acuannya dilipat ke 1024 x 1024.
# Percobaan pertama menyisakan 170 px per pita dan naskahnya terpaksa dibuang,
# tinggal nama produk - padahal keterangan itulah isi halaman panjangnya.
#
# Yang mengembalikannya: kepala halaman dipangkas dari 176 px jadi 118 px, dan
# seluruh tipografinya diperkecil sesuai pita 181 px. Blok teksnya jadi setinggi
# 110 px, menyisakan 35 px lapang di atas dan di bawahnya. Yang tidak ikut
# dikecilkan adalah pouch-nya: ia tetap 158 px supaya labelnya masih terbaca.
SQ = 1024
SQ_HEADER = 118
SQ_POUCH_H = 158
SQ_NAME_SIZE = 38
SQ_SUB_SIZE = 17
SQ_SUB_LEAD = 22
SQ_HEAD_TO_SUB = 16
SQ_WEIGHT_SIZE = 15
SQ_WEIGHT_GAP = 14
SQ_SIDE = 62


def build_square(series="matcha", out="longform_square.png"):
    spec = SERIES[series]
    members = spec["members"]
    n = len(members)
    band_h = (SQ - SQ_HEADER) / n

    flat = Image.new("RGB", (SQ, SQ), bs.BG)
    d = ImageDraw.Draw(flat)
    edges = [SQ_HEADER + band_h * i for i in range(n + 1)]
    sl = _slope(band_h, SQ)
    slopes = [0.0] + [sl * (-1) ** i for i in range(n - 1)] + [0.0]

    half = SQ / 2
    for i in range(n):
        if i % 2 == 0:
            top, bottom = edges[i], edges[i + 1]
            st, sb = slopes[i], slopes[i + 1]
            d.polygon([(0, top + st * half), (SQ, top - st * half),
                       (SQ, bottom - sb * half), (0, bottom + sb * half)],
                      fill=BAND_TINT)

    c = Image.new("RGBA", (SQ, SQ), (0, 0, 0, 0))
    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    lw = round(logo.width * 0.52)
    c.alpha_composite(logo.resize((lw, round(logo.height * 0.52)), Image.LANCZOS),
                      ((SQ - lw) // 2, 18))
    big = bs.build_headline(spec["head"], 38, bs.MATCHA_GREEN)
    c.alpha_composite(big, ((SQ - big.width) // 2, 56))
    bs.draw_text_top(c, spec["subtitle"], ImageFont.truetype(bs.F_BODY, 17),
                     bs.CHARCOAL, SQ // 2, 96)

    sub_f = ImageFont.truetype(bs.F_BODY, SQ_SUB_SIZE)
    weight_f = ImageFont.truetype(bs.F_BODY, SQ_WEIGHT_SIZE)

    for i, (name, sub, weight, mock) in enumerate(members):
        mid = edges[i] + band_h / 2
        text_left = (i % 2 == 0)

        head = bs.build_headline(name, SQ_NAME_SIZE, bs.MATCHA_GREEN)
        block_h = (head.height + SQ_HEAD_TO_SUB + SQ_SUB_LEAD * (len(sub) - 1)
                   + SQ_SUB_SIZE + SQ_WEIGHT_GAP + SQ_WEIGHT_SIZE)
        top = mid - block_h / 2
        x = SQ_SIDE if text_left else SQ - SQ_SIDE - 340
        c.alpha_composite(head, (round(x), round(top)))
        end = _text_block(c, sub, sub_f, bs.CHARCOAL, x,
                          top + head.height + SQ_HEAD_TO_SUB, SQ_SUB_LEAD)
        _text_block(c, [weight], weight_f, bs.CHARCOAL, x,
                    end - SQ_SUB_LEAD + SQ_WEIGHT_GAP + SQ_SUB_SIZE, 0)

        im = Image.open(f"{bs.PROD}/{mock}").convert("RGBA")
        im = im.crop(im.getbbox())
        pw = round(im.width * SQ_POUCH_H / im.height)
        px = SQ - SQ_SIDE - pw if text_left else SQ_SIDE
        # Dipusatkan pada pitanya, kecuali kalau itu membuatnya menembus tepi.
        # Pusat pita terakhir jatuh di y 933, dan pouch setinggi 158 yang
        # dipusatkan di sana berakhir 12 px dari dasar kanvas - sementara sisi
        # kiri dan kanannya bermargin 62. Bayangan jatuhnya menjulur 26 px lagi
        # di bawah itu.
        py = min(max(mid - SQ_POUCH_H / 2, SQ_SIDE),
                 SQ - SQ_SIDE - 26 - SQ_POUCH_H)
        _drop_shadow(c, px, py, pw, SQ_POUCH_H)
        c.alpha_composite(im.resize((pw, SQ_POUCH_H), Image.LANCZOS),
                          (round(px), round(py)))

    flat.paste(c, (0, 0), c)
    flat.save(out)
    return out


# ── satu kotak per anggota ───────────────────────────────────────────────────
#
# Melipat halaman panjang ke satu bidang 1:1 memaksa tiap pita tinggal 170 px,
# dan pada tinggi itu dua baris keterangan tidak muat sama sekali - yang tersisa
# hanya nama produk. Padahal keterangan itulah isi halaman panjangnya.
#
# Marketplace tidak memaksa satu gambar: Shopee dan TikTok Shop sama-sama
# menerima sembilan. Jadi lima anggota bisa mendapat satu bidang 1:1 masing-
# masing, dengan pita diagonal, naskah, dan pouch pada ukuran yang terbaca.
EACH_TOP = 168          # tinggi wedge bone di atas pita
EACH_BOTTOM = 892       # dan batas bawahnya
EACH_SIDE = 78
EACH_NAME = 54
EACH_SUB = 24
EACH_SUB_LEAD = 32
EACH_POUCH_H = 470


def build_each(series="matcha", folder=".", prefix="MatchaSeries"):
    spec = SERIES[series]
    out = []
    for i, (name, sub, weight, mock) in enumerate(spec["members"]):
        flat = Image.new("RGB", (SQ, SQ), bs.BG)
        d = ImageDraw.Draw(flat)

        # Satu pita miring memenuhi bidang, dengan wedge bone di atas dan bawah.
        # Arah miringnya bergantian antar anggota supaya lima kotak yang dilihat
        # berurutan di carousel tetap terasa satu deret, bukan lima gambar sama.
        sl = _slope(EACH_BOTTOM - EACH_TOP, SQ) * (-1) ** i
        half = SQ / 2
        d.polygon([(0, EACH_TOP + sl * half), (SQ, EACH_TOP - sl * half),
                   (SQ, EACH_BOTTOM + sl * half), (0, EACH_BOTTOM - sl * half)],
                  fill=BAND_TINT)

        c = Image.new("RGBA", (SQ, SQ), (0, 0, 0, 0))
        text_left = (i % 2 == 0)
        mid = (EACH_TOP + EACH_BOTTOM) / 2

        head = bs.build_headline(name, EACH_NAME, bs.MATCHA_GREEN)
        block_h = (head.height + HEAD_TO_SUB + EACH_SUB_LEAD * (len(sub) - 1)
                   + EACH_SUB + WEIGHT_GAP + WEIGHT_SIZE)
        top = mid - block_h / 2
        x = EACH_SIDE if text_left else SQ - EACH_SIDE - 400
        c.alpha_composite(head, (round(x), round(top)))
        end = _text_block(c, sub, ImageFont.truetype(bs.F_BODY, EACH_SUB),
                          bs.CHARCOAL, x, top + head.height + HEAD_TO_SUB, EACH_SUB_LEAD)
        _text_block(c, [weight], ImageFont.truetype(bs.F_BODY, WEIGHT_SIZE),
                    bs.CHARCOAL, x, end - EACH_SUB_LEAD + WEIGHT_GAP + EACH_SUB, 0)

        im = Image.open(f"{bs.PROD}/{mock}").convert("RGBA")
        im = im.crop(im.getbbox())
        pw = round(im.width * EACH_POUCH_H / im.height)
        px = SQ - EACH_SIDE - pw if text_left else EACH_SIDE
        py = mid - EACH_POUCH_H / 2
        _drop_shadow(c, px, py, pw, EACH_POUCH_H)
        c.alpha_composite(im.resize((pw, EACH_POUCH_H), Image.LANCZOS),
                          (round(px), round(py)))

        logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
        lw = round(logo.width * 0.62)
        c.alpha_composite(logo.resize((lw, round(logo.height * 0.62)), Image.LANCZOS),
                          (EACH_SIDE, SQ - 92))

        flat.paste(c, (0, 0), c)
        slug = name.title().replace(" ", "")
        path = f"{folder}/{prefix}_{i + 1:02d}_{slug}.png"
        flat.save(path)
        out.append(path)
    return out
