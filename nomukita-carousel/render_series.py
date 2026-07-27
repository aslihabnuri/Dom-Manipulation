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


# ── seri berisi banyak anggota ───────────────────────────────────────────────
#
# Susunan gelas-pouch-pouch-gelas hanya bekerja untuk dua anggota. Matcha Series
# yang sebenarnya berisi lima: tiga Pure Matcha asal tunggal (Uji Kyoto,
# Shizouka, Nishio) dan dua racikan (Matcha Latte, Premix Matcha).
#
# Dua kenyataan menentukan bentuknya, dan keduanya baru terlihat setelah
# mockup-nya dibuka:
#
# 1. Ketiga pouch Pure Matcha IDENTIK kecuali satu baris teks nama. Warna, tetes,
#    katakana, dan tata letak labelnya sama persis. Dijejer apa adanya pada
#    ukuran thumbnail Shopee, ketiganya membentuk pita hitam tanpa informasi.
#    Jadi nama asalnya dinaikkan menjadi TIPOGRAFI di bawah tiap pouch, bukan
#    dibiarkan sebagai cetakan 4 px di labelnya.
# 2. Pure Matcha 500 gram sementara dua racikannya 1000 gram, dan bentuk
#    kantongnya pun berbeda perbandingannya. Disamakan tingginya, perbedaan itu
#    hilang - jadi beratnya ditulis di bawah tiap nama, dinyatakan dengan kata
#    alih-alih disiratkan lewat ukuran yang tidak bisa saya pastikan skalanya.
LINEUP_BASE = 720
LINEUP_POUCH_H = 300
LINEUP_GAP = 22
LINEUP_NAME_TOP = 762
LINEUP_WEIGHT_TOP = 792
LINEUP_MARGIN = 40

LINEUPS = {
    "matcha": {
        "head": "MATCHA SERIES",
        "kanji": "抹茶",
        "sub": "three origins · two blends",
        "members": [
            ("UJI KYOTO", "500 gram", "Mockup nomukita-Pure Matcha Uji Kyoto.png"),
            ("SHIZOUKA", "500 gram", "Mockup nomukita-Pure Matcha Shizouka.png"),
            ("NISHIO", "500 gram", "Mockup nomukita-Pure Matcha Nishio.png"),
            ("MATCHA LATTE", "1000 gram", "Mockup nomukita-Exclusive series-matcha latte.png"),
            ("PREMIX MATCHA", "1000 gram", "Mockup nomukita-Exclusive series-matcha.png"),
        ],
    },
}


def _fit_labels(names, spans, font_path, size, gap=14):
    """Kecilkan label sampai dua nama bertetangga tidak lagi bersentuhan.

    Nama dipusatkan pada pouch-nya masing-masing, jadi dua nama panjang yang
    kebetulan bersebelahan bisa bertabrakan walaupun pouch-nya tidak. Di banner
    lima anggota, "MATCHA LATTE" dan "PREMIX MATCHA" berdiri berdampingan dan
    itulah pasangan terpanjangnya.
    """
    while size > 10:
        f = ImageFont.truetype(font_path, size)
        w = [f.getbbox(n)[2] - f.getbbox(n)[0] for n in names]
        clash = any((spans[i] + w[i] / 2) + gap > (spans[i + 1] - w[i + 1] / 2)
                    for i in range(len(names) - 1))
        if not clash:
            return f
        size -= 1
    return ImageFont.truetype(font_path, size)


def _centred(canvas, text, font, colour, top, cx):
    from PIL import ImageDraw
    pad = 300
    layer = Image.new("RGBA", (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    canvas.alpha_composite(layer, (round(cx - (bb[0] + bb[2]) / 2 + pad - pad),
                                   round(top - (bb[1] - pad) - pad)))


def build_lineup(series="matcha", out="lineup.png"):
    spec = LINEUPS[series]
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

    # Tinggi seragam, lalu dikecilkan sekali kalau barisnya tidak muat.
    pouches = []
    for name, weight, mock in members:
        im = Image.open(f"{bs.PROD}/{mock}").convert("RGBA")
        pouches.append((name, weight, im.crop(im.getbbox())))
    h = LINEUP_POUCH_H
    room = bs.W - 2 * LINEUP_MARGIN - LINEUP_GAP * (len(pouches) - 1)
    span = sum(round(im.width * h / im.height) for _, _, im in pouches)
    if span > room:
        h = round(h * room / span)
        span = sum(round(im.width * h / im.height) for _, _, im in pouches)

    x = (bs.W - span - LINEUP_GAP * (len(pouches) - 1)) / 2
    places = []
    for name, weight, im in pouches:
        w = round(im.width * h / im.height)
        places.append((x, w))
        x += w + LINEUP_GAP
    centres = [px + pw / 2 for px, pw in places]
    name_f = _fit_labels([n for n, _, _ in pouches], centres, bs.F_BODY, 20)
    weight_f = ImageFont.truetype(bs.F_BODY, max(12, name_f.size - 3))

    for (name, weight, im), (px, pw) in zip(pouches, places):
        c.alpha_composite(im.resize((pw, h), Image.LANCZOS), (round(px), LINEUP_BASE - h))
        cx = px + pw / 2
        _centred(c, name, name_f, bs.CHARCOAL, LINEUP_NAME_TOP, cx)
        _centred(c, weight, weight_f, bs.KANJI_GREY, LINEUP_WEIGHT_TOP, cx)

    halal = Image.open(f"{bs.ASSETS}/halal.png").convert("RGBA")
    hw = round(halal.width * bs.HALAL_H / halal.height)
    c.alpha_composite(halal.resize((hw, bs.HALAL_H), Image.LANCZOS),
                      ((bs.W - hw) // 2, bs.HALAL_TOP))

    flat = Image.new("RGB", (bs.W, bs.H), bs.BG)
    flat.paste(c, (0, 0), c)
    flat.save(out)
    return out


def build_lineup_banner(series="matcha", out="lineup_banner.png"):
    """Versi memanjang 1200 x 600 untuk banner toko.

    Perangkat mereknya pindah ke kolom kiri dengan alasan yang sama seperti
    banner dua anggota: pada tinggi 600 px, tumpukan tengah tidak menyisakan
    ruang yang cukup untuk produknya.
    """
    from PIL import ImageDraw
    spec = LINEUPS[series]
    members = spec["members"]
    accent = bs.accent(spec["head"])

    c = Image.new("RGBA", (BANNER_W, BANNER_H), bs.BG + (255,))
    c.alpha_composite(Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA"),
                      (BANNER_LEFT, 92))
    head = bs.build_headline(spec["head"], 62, accent)
    c.alpha_composite(head, (BANNER_LEFT, 190))

    pad = 300
    for text, font, colour, top in [
            (spec["kanji"], ImageFont.truetype(bs.F_JP, 40), bs.KANJI_GREY, 140),
            (spec["sub"], ImageFont.truetype(bs.F_BODY, 26), bs.CHARCOAL, 286)]:
        layer = Image.new("RGBA", (BANNER_W + 2 * pad, BANNER_H + 2 * pad), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
        bb = layer.getbbox()
        c.alpha_composite(layer, (round(BANNER_LEFT - (bb[0] - pad) - pad),
                                  round(top - (bb[1] - pad) - pad)))

    left = 500
    room = BANNER_W - left - 40 - LINEUP_GAP * (len(members) - 1)
    pouches = []
    for name, weight, mock in members:
        im = Image.open(f"{bs.PROD}/{mock}").convert("RGBA")
        pouches.append((name, weight, im.crop(im.getbbox())))
    h = 250
    span = sum(round(im.width * h / im.height) for _, _, im in pouches)
    if span > room:
        h = round(h * room / span)
        span = sum(round(im.width * h / im.height) for _, _, im in pouches)

    base = 460
    x = left + (room - span) / 2
    places = []
    for name, weight, im in pouches:
        w = round(im.width * h / im.height)
        places.append((x, w))
        x += w + LINEUP_GAP
    centres = [px + pw / 2 for px, pw in places]
    name_f = _fit_labels([n for n, _, _ in pouches], centres, bs.F_BODY, 16)
    for (name, weight, im), (px, pw) in zip(pouches, places):
        c.alpha_composite(im.resize((pw, h), Image.LANCZOS), (round(px), base - h))
        _centred(c, name, name_f, bs.CHARCOAL, base + 22, px + pw / 2)

    flat = Image.new("RGB", (BANNER_W, BANNER_H), bs.BG)
    flat.paste(c, (0, 0), c)
    flat.save(out)
    return out
