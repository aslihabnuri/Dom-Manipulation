"""Gambar kategori toko, mengikuti referensi goodprotein "Premium Series".

Diukur dari `refs/Premium Series_Referensi.jpg`:

  kanvas        736 x 713, praktis 1:1
  latar         krem (235,222,170) di seluruh bidang atas
  pita bawah    biru (106,154,192), tepi atasnya MENDATAR di y 610, yaitu 86%
                tinggi kanvas - jadi pitanya 14% terbawah
  pouch         enam, menumpuk sebagian, membesar dari kiri ke kanan
                (yang terkiri ~245 px, terkanan ~311 px, rasio 1,27)
  lapisan       pitanya digambar DI ATAS pouch, sehingga kaki pouch terpotong
                dan komposisinya terasa berlapis

Naskah acuannya promo diskon - "50% off", "LIMITED TIME OFFER". Itu tidak
disalin: potongan harga bukan sesuatu yang boleh saya karang. Yang dipinjam
susunan tiga tingkatnya - satu baris kecil di atas, satu baris besar sebagai
jangkar, dan satu baris di dalam pita - dan diisi dengan nama kategori serta
ukuran kemasannya, yang keduanya sudah tercetak di kemasan itu sendiri.

Warnanya juga tidak disalin. Krem (235,222,170) dan biru (106,154,192) acuan
tidak ada di palet Nomukita; yang dipakai bone white dan steel blue, warna
aksen merek untuk produk non-matcha.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs

# Jumlah anggota tiap kategori DIHITUNG dari daftar produk, tidak ditulis tangan.
# Empat produk baru - Pure Dark Cocoa, Dark Cocoa, Cappuccino, Taro - membuat
# angka yang tercetak di gambar kategori langsung salah: Premium jadi dua belas,
# bukan sepuluh, dan Exclusive jadi empat, bukan dua. Angka yang ditulis tangan
# di tiga berkas berbeda tidak punya cara untuk tahu itu.
WORD = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
        7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven",
        12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
        16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
        20: "twenty"}


def count(kind):
    """Berapa produk dalam satu kategori, sebagai (angka, kata).

    "250" menghitung yang benar-benar punya kemasan 250 gram: Pure Dark Cocoa
    tidak, ia datang sebagai kotak 300 gram, jadi ia tidak ikut terhitung di
    sana walaupun ikut di 1000 gram.
    """
    pick = {
        "matcha": lambda p: p["slug"] in ("MatchaLatte", "PremixMatcha"),
        "premium": lambda p: p["series"] == "premium",
        "exclusive": lambda p: p["series"] == "exclusive",
        "250": lambda p: "p250" in p,
        "1000": lambda p: "p1000" in p,
    }[kind]
    n = sum(1 for p in bs.PRODUCTS if pick(p))
    if kind == "matcha":
        n += 3          # tiga origin Pure Matcha, tidak ada di bs.PRODUCTS
    return n, WORD.get(n, str(n))


SQ = 1024
BAND_TOP = round(SQ * 0.86)     # acuan menaruh tepi pitanya di 86% tinggi kanvas

# Kaki pouch tersembunyi di balik pita, dan seberapa dalam itu diikatkan pada
# TINGGI POUCH, bukan pada satu angka tetap. Versi pertama memakai garis pijak
# tetap di y 998; pouch 250 gram yang cuma setinggi 125 px lalu terbenam
# seluruhnya di balik pita dan kategori itu terbit tanpa satu pun produk
# terlihat.
BAND_BITE = 0.18                # pita menutupi sekian bagian bawah pouch

SMALL_TOP = 176                 # baris kecil di atas
SMALL_SIZE = 30
BIG_TOP = 232                   # baris besar, jangkar komposisinya
BIG_CAP = 118
BAND_SIZE = 34

SIDE = 60
POUCH_MAX_H = 430

# Berapa banyak yang dipajang, bukan berapa banyak yang ada. Acuan memajang enam
# dari lini yang jauh lebih besar, dan itu memang konvensi di marketplace:
# penjual multi-varian menampilkan empat sampai tujuh kemasan lalu menyebut
# jumlah totalnya dengan angka. Dipaksa memajang kedua belas, tiap pouch tinggal
# 122 px dan tidak ada yang terbaca. Jumlah sebenarnya tetap dinyatakan, di baris
# kecil paling atas.
MAX_SHOWN = 6
POUCH_RAMP = 0.80               # yang terkiri sekian kali tinggi yang terkanan
# Jarak antar pouch, sebagai pecahan lebarnya. Acuan memakai sekitar 0,58, tapi
# angka itu hanya cocok untuk kemasan yang lebih tinggi daripada lebar. Kantong
# 250 gram gempal - 1,24 kali lebih lebar daripada tinggi - dan pada langkah yang
# sama ia hanya bisa setinggi 237 px, menggantung di dasar kanvas dengan lubang
# kosong 400 px di atasnya. Jadi langkahnya dirapatkan dulu sampai batas bawah,
# baru tingginya yang dikorbankan.
STEP_MAX = 0.58
STEP_MIN = 0.34
BLEED = 120                     # deret boleh menjulur sekian di luar tiap tepi


# Seri dibaca dari `build_slides.PRODUCTS`, yang cocok dengan kata seri yang
# TERCETAK di kemasannya - Premium biru muda, Exclusive emas. Nama berkas
# mockup-nya tidak dipakai: empat di antaranya bertuliskan "Exclusive series"
# padahal labelnya sendiri berbunyi Premium.
CATEGORY = {
    "premium": dict(
        small=f"The everyday range, {count('premium')[1]} flavours",
        big="PREMIUM",
        band="1000 GRAM · 250 GRAM",
        pick=lambda p: p["series"] == "premium",
        size="1000",
    ),
    "exclusive": dict(
        small=f"The exclusive {count('exclusive')[1]}",
        big="EXCLUSIVE",
        band="1000 GRAM · 250 GRAM",
        pick=lambda p: p["series"] == "exclusive",
        size="1000",
    ),
    "250gr": dict(
        small="Every flavour in the smaller pack",
        big="250 GRAM",
        band=f"{count('250')[1].upper()} FLAVOURS",
        pick=lambda p: True,
        size="250",
    ),
}


def _centred(canvas, text, font, colour, top, cx=SQ // 2):
    pad = 300
    layer = Image.new("RGBA", (SQ + 2 * pad, SQ + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    if bb is None:
        return
    canvas.alpha_composite(layer, (round(cx - (bb[0] + bb[2]) / 2), round(top - bb[1])))


def _shadow(canvas, x, y, w, h):
    layer = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(layer).ellipse([x + w * 0.10, y + h - 26, x + w * 0.90, y + h + 14],
                                  fill=64)
    sh = Image.new("RGBA", canvas.size, (126, 124, 116, 0))
    sh.putalpha(layer.filter(ImageFilter.GaussianBlur(20)))
    canvas.alpha_composite(sh)


def _fan(members, size):
    """Tinggi dan posisi tiap pouch: menumpuk sebagian, membesar ke kanan.

    Acuan memakai enam pouch yang tumpang tindih hampir separuh lebarnya, dan
    yang terkanan 1,27 kali lebih tinggi daripada yang terkiri.

    Yang tidak bisa disalin adalah ukurannya, karena jumlah anggotanya berbeda:
    Premium sepuluh, Exclusive dua, 250 gram dua belas. Percobaan pertama memakai
    tinggi tetap 430 px untuk semuanya, dan sepuluh pouch selebar 292 px yang
    dipaksa masuk 904 px menyisakan hanya 68 px terlihat per pouch - tinggal
    serpihan, dan yang terkanan menelan seluruh deretnya.

    Jadi lebarnya diturunkan dari jumlah anggotanya. Deretnya boleh menjulur
    sedikit di luar tepi kanvas, cara yang lazim dipakai penjual marketplace
    untuk menyiratkan "masih ada lagi di luar bingkai", tapi dibatasi supaya
    anggota terluarnya tidak habis terpotong.
    """
    n = len(members)
    ratios = []
    for prod in members:
        im = Image.open(f'{bs.PROD}/{prod["p250" if size == "250" else "p1000"]}')
        im = im.convert("RGBA"); im = im.crop(im.getbbox())
        ratios.append(im.width / im.height)

    room = SQ - 2 * SIDE + 2 * BLEED
    r_max = max(ratios)
    need = (room / (r_max * POUCH_MAX_H) - 1) / (n - 1) if n > 1 else STEP_MAX
    if need >= STEP_MIN:
        h_max, step_ratio = POUCH_MAX_H, min(need, STEP_MAX)
    else:
        step_ratio = STEP_MIN
        h_max = room / (r_max * (1 + STEP_MIN * (n - 1)))

    hs = [h_max * (POUCH_RAMP + (1 - POUCH_RAMP) * (i / max(1, n - 1)))
          for i in range(n)]
    ws = [r * h for r, h in zip(ratios, hs)]
    step = max(ws) * step_ratio
    total = step * (n - 1) + ws[-1]
    x0 = (SQ - total) / 2
    return [(x0 + step * i, hs[i], ws[i]) for i in range(n)]


def build(cat="premium", out=None):
    spec = CATEGORY[cat]
    members = [p for p in bs.PRODUCTS if spec["pick"](p)]
    out = out or f"category_{cat}.png"

    flat = Image.new("RGB", (SQ, SQ), bs.BG)
    c = Image.new("RGBA", (SQ, SQ), (0, 0, 0, 0))

    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    c.alpha_composite(logo, ((SQ - logo.width) // 2, 60))
    _centred(c, spec["small"], ImageFont.truetype(bs.F_BODY, SMALL_SIZE),
             bs.CHARCOAL, SMALL_TOP)
    big = bs.build_headline(spec["big"], round(BIG_CAP / (50 / 74)), bs.STEEL_BLUE)
    c.alpha_composite(big, ((SQ - big.width) // 2, BIG_TOP))

    # Kiri ke kanan, sehingga yang lebih besar di kanan menutupi tetangganya -
    # arah tumpukan yang sama dengan acuan.
    shown = members[:MAX_SHOWN]
    fan = _fan(shown, spec["size"])
    baseline = BAND_TOP + BAND_BITE * max(h for _, h, _ in fan)
    for (x, h, w), prod in zip(fan, shown):
        im = Image.open(f'{bs.PROD}/{prod["p250" if spec["size"] == "250" else "p1000"]}')
        im = im.convert("RGBA"); im = im.crop(im.getbbox())
        im = im.resize((round(w), round(h)), Image.LANCZOS)
        if spec["size"] == "250":
            im = bs.model_white(im)
        _shadow(c, x, baseline - h, w, h)
        c.alpha_composite(im, (round(x), round(baseline - h)))

    flat.paste(c, (0, 0), c)

    # Pita digambar TERAKHIR, di atas pouch, persis seperti acuan: kaki pouch
    # terpotong dan komposisinya jadi berlapis, bukan berjajar rata.
    band = Image.new("RGBA", (SQ, SQ), (0, 0, 0, 0))
    ImageDraw.Draw(band).rectangle([0, BAND_TOP, SQ, SQ], fill=bs.STEEL_BLUE + (255,))
    _centred(band, spec["band"], ImageFont.truetype(bs.F_BODY, BAND_SIZE), bs.BG,
             BAND_TOP + (SQ - BAND_TOP - BAND_SIZE) // 2)
    flat.paste(band, (0, 0), band)

    flat.save(out)
    return out
