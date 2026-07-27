"""Gambar kategori: satu seri produk dalam satu bidang.

Dipakai untuk komponen Kategori di dekorasi toko Shopee, tempat tiap kategori
punya satu gambar sampul. Bahasa visualnya dipinjam utuh dari slide 1 yang sudah
disetujui - logo di tengah atas, watermark katakana, headline, sub-baris, produk
berdiri di garis alas y 855, seal Halal di y 881 - supaya halaman kategori dan
halaman produk terbaca sebagai satu toko, bukan dua.

Yang berbeda dari slide 1 hanya isinya: bukan satu produk dengan propnya, tapi
seluruh anggota seri berdiri berdampingan, masing-masing dengan minumannya.
Susunannya cermin - gelas, pouch, pouch, gelas - sehingga kedua pouch bertemu di
tengah dan kedua minuman menjaga tepinya.

Gelas diukur dari BADANNYA, bukan kotak penuhnya. Kotak penuh gelas Matcha Latte
569 x 706 karena bayangan dan caustic-nya menjulur jauh ke samping; dipakai apa
adanya, gelas itu akan dihitung selebar 242 px dan mendorong seluruh kelompok
keluar kanvas. Badannya sendiri hanya 327 px.
"""

import numpy as np
from PIL import Image, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs
import photo

BASE = 855              # garis alas yang sama dengan slide 1
POUCH_H = 400
GLASS_H = 270           # tinggi badan gelas, bukan kotak penuhnya
PAIR_GAP = 16           # jarak gelas ke pouch pasangannya
GROUP_GAP = 60          # jarak antar anggota seri

SERIES = {
    "matcha": {
        "head": "MATCHA SERIES",
        "kanji": "抹茶",
        "sub": "matcha latte · premix matcha",
        "members": [
            ("MatchaLatte", "gen/glass-matchalatte.png"),
            ("PremixMatcha", "gen/glass-premixmatcha.png"),
        ],
    },
}


def _overhang(glass, h):
    """Berapa jauh gelas menjulur di luar badannya, kiri dan kanan.

    `photo.place(..., body=True)` menempatkan BADAN gelas, tapi yang tercetak
    adalah kotak penuhnya: garnis di atas, caustic dan bayangan ke samping.
    Menyusun tata letak dari lebar badan saja membuat anggota terakhir terpotong
    tepi kanvas - persis yang terjadi pada banner percobaan pertama, dan persis
    kesalahan yang dulu membuat bayangan serai menyentuh tepi slide 250 gram.
    """
    ratio, _ = photo.load(glass)
    bl, bt, br, bb = photo.box(glass, True)
    # `photo.box()` mengembalikan kotak SILUET, dan bayangan lempar bukan bagian
    # dari siluet - itulah kenapa percobaan sebelumnya masih menyisakan tinta
    # empat piksel dari tepi kanvas meski marginnya empat puluh. Yang diukur di
    # sini rentang yang benar-benar tercetak: setiap piksel yang rasionya
    # menyimpang dari satu, yaitu subjek DAN bayangannya.
    printed = np.abs(ratio - 1).max(2) > 0.006
    xs = np.nonzero(printed.any(0))[0]
    scale = h / (bb - bt)
    return (bl - int(xs.min())) * scale, (int(xs.max()) + 1 - br) * scale


def _layout(members, size, pouch_h, glass_h, canvas_w, margin):
    """Posisi tiap benda, dipusatkan pada rentang yang BENAR-BENAR tercetak.

    Kalau kelompoknya tidak muat, seluruhnya dikecilkan sekali dengan satu faktor
    dan selesai. Bukan dikecilkan berulang lalu dipusatkan ulang: lebar tiap
    benda sebanding lurus dengan tingginya sementara jaraknya tetap, jadi
    faktornya bisa dihitung langsung. Percobaan lama yang mengecilkan lalu
    memusatkan ulang berkali-kali pernah berputar 985 kali tanpa pernah selesai.
    """
    def measure(ph, gh):
        out = []
        for i, (slug, glass) in enumerate(members):
            prod = next(p for p in bs.PRODUCTS if p["slug"] == slug)
            im = Image.open(
                f'{bs.PROD}/{prod["p250" if size == "250" else "p1000"]}').convert("RGBA")
            im = im.crop(im.getbbox())
            lo, ro = _overhang(glass, gh)
            out.append(dict(prod=prod, glass=glass,
                            pouch_w=round(im.width * ph / im.height),
                            glass_w=photo.size_at(glass, gh, body=True),
                            over_l=lo, over_r=ro, glass_first=(i == 0)))
        return out

    items = measure(pouch_h, glass_h)
    gaps = PAIR_GAP * len(items) + GROUP_GAP * (len(items) - 1)
    lead = items[0]["over_l"] if items[0]["glass_first"] else 0
    tail = items[-1]["over_r"] if not items[-1]["glass_first"] else 0
    solid = sum(it["pouch_w"] + it["glass_w"] for it in items) + lead + tail
    room = canvas_w - 2 * margin - gaps
    if solid > room:
        k = room / solid
        pouch_h, glass_h = round(pouch_h * k), round(glass_h * k)
        items = measure(pouch_h, glass_h)
        lead = items[0]["over_l"] if items[0]["glass_first"] else 0
        tail = items[-1]["over_r"] if not items[-1]["glass_first"] else 0
        solid = sum(it["pouch_w"] + it["glass_w"] for it in items) + lead + tail

    # Rentang yang dipusatkan adalah yang TERCETAK, dari tepi kiri bayangan
    # gelas pertama sampai tepi kanan bayangan gelas terakhir. Versi pertama
    # menambahkan lead dan tail alih-alih menguranginya, jadi kelompoknya
    # bergeser (lead + tail) / 2 ke kanan - margin kiri 100 px, kanan 2 px.
    x = margin + lead + (room - solid) / 2
    for it in items:
        a = it["glass_w"] if it["glass_first"] else it["pouch_w"]
        b = it["pouch_w"] if it["glass_first"] else it["glass_w"]
        it["gx"] = round(x if it["glass_first"] else x + a + PAIR_GAP)
        it["px"] = round(x + a + PAIR_GAP if it["glass_first"] else x)
        x += a + PAIR_GAP + b + GROUP_GAP
    return items, pouch_h, glass_h


def _draw(flat, items, size, pouch_h, glass_h, base, canvas_size):
    # Pouch dulu, gelas belakangan: gelasnya tembus pandang dan bayangannya
    # menjulur ke arah pouch, jadi ia harus dikalikan di atas apa yang sudah ada.
    for it in items:
        pouch = Image.open(
            f'{bs.PROD}/{it["prod"]["p250" if size == "250" else "p1000"]}').convert("RGBA")
        pouch = pouch.crop(pouch.getbbox()).resize((it["pouch_w"], pouch_h), Image.LANCZOS)
        if size == "250":
            pouch = bs.model_white(pouch)
        layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
        layer.alpha_composite(pouch, (it["px"], base - pouch_h))
        flat.paste(layer, (0, 0), layer)
    for it in items:
        photo.place(flat, it["glass"], it["gx"], base, glass_h, body=True, replace=False)


def _widths(members, size):
    """Lebar tiap benda pada tinggi yang sudah ditetapkan, dalam urutan gambar."""
    out = []
    for i, (slug, glass) in enumerate(members):
        prod = next(p for p in bs.PRODUCTS if p["slug"] == slug)
        im = Image.open(f'{bs.PROD}/{prod["p250" if size == "250" else "p1000"]}').convert("RGBA")
        im = im.crop(im.getbbox())
        pouch_w = round(im.width * POUCH_H / im.height)
        glass_w = photo.size_at(glass, GLASS_H, body=True)
        # anggota pertama menaruh gelasnya di kiri, anggota terakhir di kanan
        out.append((glass_w, pouch_w) if i == 0 else (pouch_w, glass_w))
    return out


def build(series="matcha", out="series.png", size="1000"):
    spec = SERIES[series]
    members = spec["members"]
    accent = bs.accent(spec["head"])

    c = Image.new("RGBA", (bs.W, bs.H), bs.BG + (255,))
    c.alpha_composite(Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA"), bs.LOGO_XY)
    bs.draw_text_top(c, spec["kanji"], ImageFont.truetype(bs.F_JP, bs.KANJI_SIZE),
                     bs.KANJI_GREY, bs.W // 2, bs.KANJI_TOP)
    head = bs.build_headline(spec["head"], bs.HEAD_SIZE, accent)
    c.alpha_composite(head, ((bs.W - head.width) // 2, bs.HEAD_TOP))
    bs.draw_text_top(c, spec["sub"], ImageFont.truetype(bs.F_BODY, bs.SUB_SIZE),
                     bs.CHARCOAL, bs.W // 2, bs.SUB_TOP)

    flat = Image.new("RGB", (bs.W, bs.H), bs.BG)
    flat.paste(c, (0, 0), c)
    items, ph, gh = _layout(members, size, POUCH_H, GLASS_H, bs.W, 40)
    _draw(flat, items, size, ph, gh, BASE, (bs.W, bs.H))

    halal = Image.open(f"{bs.ASSETS}/halal.png").convert("RGBA")
    hw = round(halal.width * bs.HALAL_H / halal.height)
    halal = halal.resize((hw, bs.HALAL_H), Image.LANCZOS)
    over = Image.new("RGBA", (bs.W, bs.H), (0, 0, 0, 0))
    over.alpha_composite(halal, ((bs.W - hw) // 2, bs.HALAL_TOP))
    flat.paste(over, (0, 0), over)

    flat.save(out)
    return out


# ── versi banner ────────────────────────────────────────────────────────────
# Dekorasi toko Shopee memakai dua bentuk untuk keperluan yang berbeda: komponen
# Kategori memakai gambar persegi, sedangkan banner toko memanjang 2:1. Yang
# persegi memakai susunan slide 1 apa adanya; yang memanjang tidak bisa, karena
# pada tinggi 600 px tumpukan tengah menyisakan kurang dari 400 px untuk produk
# dan pouch-nya mengecil sampai tidak terbaca. Jadi banner memindahkan seluruh
# perangkat merek ke kolom kiri dan menyerahkan dua pertiga sisanya ke produk.
BANNER_W, BANNER_H = 1200, 600
BANNER_LEFT = 80
BANNER_BASE = 520
BANNER_POUCH_H = 330
BANNER_GLASS_H = 220


def build_banner(series="matcha", out="series_banner.png", size="1000"):
    spec = SERIES[series]
    members = spec["members"]
    accent = bs.accent(spec["head"])

    c = Image.new("RGBA", (BANNER_W, BANNER_H), bs.BG + (255,))
    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    c.alpha_composite(logo, (BANNER_LEFT, 92))

    head = bs.build_headline(spec["head"], 62, accent)
    c.alpha_composite(head, (BANNER_LEFT, 190))

    sub_f = ImageFont.truetype(bs.F_BODY, 26)
    from PIL import ImageDraw
    pad = 300
    probe = Image.new("RGBA", (BANNER_W + 2 * pad, BANNER_H + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(probe).text((pad, pad), spec["sub"], font=sub_f, fill=bs.CHARCOAL + (255,))
    bb = probe.getbbox()
    c.alpha_composite(probe, (round(BANNER_LEFT - (bb[0] - pad) - pad),
                              round(286 - (bb[1] - pad) - pad)))

    kanji_f = ImageFont.truetype(bs.F_JP, 40)
    probe2 = Image.new("RGBA", (BANNER_W + 2 * pad, BANNER_H + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(probe2).text((pad, pad), spec["kanji"], font=kanji_f,
                                fill=bs.KANJI_GREY + (255,))
    bb2 = probe2.getbbox()
    c.alpha_composite(probe2, (round(BANNER_LEFT - (bb2[0] - pad) - pad),
                               round(140 - (bb2[1] - pad) - pad)))

    flat = Image.new("RGB", (BANNER_W, BANNER_H), bs.BG)
    flat.paste(c, (0, 0), c)

    items, ph, gh = _layout(members, size, BANNER_POUCH_H, BANNER_GLASS_H,
                            BANNER_W - 480, 40)
    for it in items:                      # kelompoknya duduk di dua pertiga kanan
        it["gx"] += 480
        it["px"] += 480
    _draw(flat, items, size, ph, gh, BANNER_BASE, (BANNER_W, BANNER_H))

    flat.save(out)
    return out
