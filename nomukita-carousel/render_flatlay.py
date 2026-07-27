"""Gambar kategori bergaya flat-lay, mengikuti referensi Oats Overnight
"Have a Healthy Start to 2020" (IMG_3660).

Satu gambar per kategori - bukan carousel.

Yang diukur dari acuan (kanvas 1000 x 1500):

  bidang        hijau pekat (126,165,84) di atas, hijau lebih terang
                (146,189,99) di bawah, dipisah diagonal tandingan
  pita          menurun ke kanan, kemiringan (214-55)/420 = 0,379 pada tepi
                atas ungu dan (912-776)/320 = 0,425 pada hijau muda; dipakai
                0,40. Semua pita sejajar.
  tangga        tiga tingkat, tiap tingkat satu atau dua slab warna yang
                bertumpuk; ujung kanan tiap tingkat berbeda-beda sehingga
                kolom kanan tetap kosong untuk naskah
  pouch         lima, terbaring miring di atas pita, berbayang lembut
  naskah        judul besar rata kanan di kanan atas
  langkah       tiga ikon garis dengan label dan garis bawah, di kanan bawah
  tombol        ajakan di kiri bawah, di atas bidang

Yang tidak disalin:

  Warnanya. Acuan memakai enam warna jenuh - ungu, jingga, kuning, merah,
  dua hijau - dan Nomukita tidak punya enam warna. Paletnya cuma matcha
  green, steel blue, bone white, charcoal. Jadi tangganya disusun dari
  gradasi dua warna merek itu saja: campuran hue merek dengan bone white,
  bukan hue baru.

  Naskah musimannya. Acuan berbunyi "Have a Healthy Start to 2020", sebuah
  kampanye tahun baru. Yang dipinjam bentuknya - judul pendek empat baris
  rata kanan - dan diisi nama kategori serta jumlah rasanya, dua hal yang
  memang benar dan bisa saya periksa dari kemasannya sendiri.

Aturan yang muncul saat membangun: TERANG PITA HARUS MELAWAN TERANG POUCH.
Pouch 1000 gram hampir hitam (rata-rata 59,64,69), jadi kategori Premium
dapat bidang steel blue dengan pita-pita terang. Pouch 250 gram putih
(rata-rata 228,230,227); di atas pita terang ia lenyap, jadi skemanya
dibalik - bidang bone white dengan pita jenuh.
"""

import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs

SLOPE = 0.40                    # pita menurun ke kanan, diukur dari acuan
BLEED = 260                     # pita menjulur sekian di luar tepi kiri


def mix(a, b, t):
    """Campur dua warna. Dipakai untuk seluruh tangga, sehingga tidak ada
    satu pun hue di luar palet merek."""
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


BONE = bs.BG
STEEL = bs.STEEL_BLUE
MATCHA = bs.MATCHA_GREEN
CHAR = bs.CHARCOAL


# ── skema warna, satu per kategori ───────────────────────────────────────────
# Kuncinya kontras terhadap pouch, bukan selera: lihat catatan di kepala berkas.
LIGHT_ON_STEEL = dict(                      # pouch gelap
    field=STEEL,
    field_low=mix(STEEL, BONE, 0.11),
    ink=BONE,
    steps=[
        [(BONE, 0.34), (mix(STEEL, BONE, 0.55), 0.66)],
        [(mix(MATCHA, BONE, 0.42), 0.28), (BONE, 0.72)],
        [(mix(STEEL, BONE, 0.72), 1.0)],
    ],
    cta_bg=CHAR, cta_ink=BONE,   # lihat catatan pada CTA di build()
)

DARK_ON_BONE = dict(                        # pouch putih
    field=BONE,
    field_low=mix(BONE, STEEL, 0.10),
    ink=CHAR,
    steps=[
        [(mix(STEEL, BONE, 0.30), 0.34), (STEEL, 0.66)],
        [(MATCHA, 0.30), (mix(MATCHA, BONE, 0.45), 0.70)],
        [(mix(STEEL, BONE, 0.55), 1.0)],
    ],
    cta_bg=CHAR, cta_ink=BONE,
)


# Mockup Avocado mencetak レモンティー, bukan アボカド. Di gambar kategori
# kemasannya tampil cukup besar untuk terbaca, jadi produk itu tidak dipajang
# sampai mockup-nya diperbaiki. Ia tetap ikut terhitung dalam "ten flavours".
DISPLAY_SKIP = {"Avocado"}


CATEGORY = {
    "premium": dict(
        head=["The", "Premium", "Line, Ten", "Flavours"],
        band="1000 GRAM · 250 GRAM",
        cta="See All Flavours",
        pick=lambda p: p["series"] == "premium",
        size="1000",
        scheme=LIGHT_ON_STEEL,
        xe=[0.560, 0.620, 0.470], pouch=1.00,
    ),
    "250gr": dict(
        head=["Every", "Flavour,", "Now in", "250 Gram"],
        band="TWELVE FLAVOURS",
        cta="See All Flavours",
        pick=lambda p: True,
        size="250",
        scheme=DARK_ON_BONE,
        # Kantong 250 gram melebar, bukan meninggi (971 x 784, jadi 1,24 kali
        # lebih lebar daripada tinggi). Pada tinggi yang sama dengan pouch 1000
        # gram ia jauh lebih besar di layar: deretnya menabrak tombol dan
        # menjulur lewat ujung pitanya. Tingginya diturunkan, pitanya
        # dipanjangkan.
        xe=[0.600, 0.655, 0.520], pouch=0.80,
    ),
}


# ── tiga langkah penyajian ───────────────────────────────────────────────────
# Acuan memakai Mix / Sleep / Eat, tiga kata untuk tiga langkah. Nomukita
# bubuk minuman, jadi langkahnya sendok, tuang, aduk. Ikonnya digambar garis,
# bukan dihasilkan model: nol kredit dan bisa diulang persis.
STEPS_TEXT = ["Scoop", "Pour", "Stir"]


def _icon_scoop(d, x, y, s, col, w):
    r = s * 0.26
    cx, cy = x + s * 0.30, y + s * 0.66
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=w)
    # Gagangnya polos. Versi pertama menutupnya dengan garis tegak lurus di
    # ujung, dan yang terbaca bukan sendok tapi tanda tambah.
    d.line([(cx + r * 0.72, cy - r * 0.72), (x + s * 0.94, y + s * 0.08)],
           fill=col, width=w)


def _icon_pour(d, x, y, s, col, w):
    # Kemasan dimiringkan 35 derajat, mulutnya menghadap gelas, lalu tiga
    # tetes sejajar. Versi pertama menggambar kemasannya tegak dan tetesnya
    # menyerong - yang terbaca cuma kotak melayang di sebelah coretan.
    a = math.radians(35)
    cx, cy = x + s * 0.24, y + s * 0.24
    hw, hh = s * 0.15, s * 0.21
    pts = [(cx + dx * math.cos(a) - dy * math.sin(a), cy + dx * math.sin(a) + dy * math.cos(a))
           for dx, dy in ((-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh))]
    d.polygon(pts, outline=col, width=w)
    # Tetesnya sejajar dan tepat di atas mulut gelas. Sebelumnya tiap tetes
    # digeser turun sedikit demi sedikit, dan hasilnya terbaca seperti anak
    # tangga kecil, bukan sesuatu yang jatuh.
    for gx, gy, ln in ((0.66, 0.38, 0.13), (0.745, 0.42, 0.10), (0.83, 0.38, 0.13)):
        d.line([(x + s * gx, y + s * gy), (x + s * gx, y + s * (gy + ln))],
               fill=col, width=max(2, w - 1))
    d.polygon([(x + s * 0.58, y + s * 0.58), (x + s * 0.98, y + s * 0.58),
               (x + s * 0.90, y + s * 0.98), (x + s * 0.66, y + s * 0.98)],
              outline=col, width=w)


def _icon_stir(d, x, y, s, col, w):
    d.polygon([(x + s * 0.16, y + s * 0.30), (x + s * 0.72, y + s * 0.30),
               (x + s * 0.64, y + s * 0.98), (x + s * 0.24, y + s * 0.98)],
              outline=col, width=w)
    d.line([(x + s * 0.86, y + s * 0.02), (x + s * 0.56, y + s * 0.74)],
           fill=col, width=w)
    d.arc([x + s * 0.26, y + s * 0.46, x + s * 0.64, y + s * 0.66], 190, 350,
          fill=col, width=max(2, w - 1))


ICONS = [_icon_scoop, _icon_pour, _icon_stir]


# ── bangunan dasar ───────────────────────────────────────────────────────────
def _band(canvas, y0, thick, x_end, colour):
    """Satu slab jajaran genjang, tepi atasnya lewat (0, y0) dan menurun
    dengan SLOPE, berhenti pada tepi tegak di x_end."""
    d = ImageDraw.Draw(canvas)
    d.polygon([(-BLEED, y0 + SLOPE * -BLEED), (x_end, y0 + SLOPE * x_end),
               (x_end, y0 + thick + SLOPE * x_end), (-BLEED, y0 + thick + SLOPE * -BLEED)],
              fill=colour + (255,))


def _shadow(canvas, im, x, y, blur, drop):
    """Bayangan lembut sesuai bentuk pouch yang sudah diputar."""
    layer = Image.new("L", canvas.size, 0)
    layer.paste(im.split()[3], (round(x), round(y + drop)))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    sh = Image.new("RGBA", canvas.size, (36, 44, 40, 0))
    sh.putalpha(layer.point(lambda v: int(v * 0.42)))
    canvas.alpha_composite(sh)


def _pouch(canvas, prod, size, cx, cy, h, angle):
    im = Image.open(f'{bs.PROD}/{prod["p250" if size == "250" else "p1000"]}')
    im = im.convert("RGBA"); im = im.crop(im.getbbox())
    w = round(h * im.width / im.height)
    im = im.resize((w, round(h)), Image.LANCZOS)
    if size == "250":
        im = bs.model_white(im)
    im = im.rotate(-angle, Image.BICUBIC, expand=True)
    x, y = cx - im.width / 2, cy - im.height / 2
    _shadow(canvas, im, x, y, blur=h * 0.055, drop=h * 0.045)
    canvas.alpha_composite(im, (round(x), round(y)))


def _line(canvas, text, font, colour, right, top):
    pad = 300
    layer = Image.new("RGBA", (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    if bb is None:
        return 0
    canvas.alpha_composite(layer, (round(right - bb[2]), round(top - bb[1])))
    return bb[2] - bb[0]


def _left(canvas, text, font, colour, left, top):
    pad = 300
    layer = Image.new("RGBA", (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    if bb is None:
        return 0
    canvas.alpha_composite(layer, (round(left - bb[0]), round(top - bb[1])))
    return bb[2] - bb[0]


# ── tata letak ───────────────────────────────────────────────────────────────
# Dua ukuran. Yang 1000x1500 mengikuti perbandingan acuan; yang 1024x1024
# mengikuti syarat 1:1 yang sudah berlaku untuk gambar kategori Shopee. Angka
# di bawah adalah pecahan tinggi/lebar kanvas, jadi keduanya memakai satu
# tata letak yang sama, bukan dua tata letak yang kebetulan mirip.
#
# Satu aturan mengikat semuanya: KOLOM KANAN MILIK NASKAH. Percobaan pertama
# membiarkan pita menjulur sampai 0,80 lebar seperti acuan, dan ikon serta
# label bone white jatuh persis di atas slab bone white - hilang sama sekali,
# dan kata "Scoop" terpotong di tengah oleh tepi pita. Acuan bisa begitu karena
# ikonnya hitam di atas hijau; ikon Nomukita seterang pitanya. Jadi tiap pita
# berhenti sebelum COL_R, dan naskahnya berdiri di atas bidang polos.
COL_R = 0.638

VERT = dict(
    size=(1000, 1500),
    logo=(60, 50),
    head_top=0.070, head_cap=0.047, head_lead=0.062,
    head_right=0.945, head_max_w=0.400,
    steps=[dict(y=0.108, xe=0.560), dict(y=0.373, xe=0.620), dict(y=0.600, xe=0.470)],
    step_h=[0.238, 0.232, 0.204],
    slots=[(0.200, 0, 0.50), (0.430, 0, 0.62),
           (0.175, 1, 0.48), (0.430, 1, 0.62),
           (0.320, 2, 0.52)],
    pouch_h=0.200, angle=12,
    icon_left=0.660, icon_top=0.503, icon_gap=0.148, icon_size=0.082,
    label_size=0.0330, rule_right=0.945,
    cta=(0.060, 0.900, 0.408, 0.956), cta_size=0.0290,
)

SQR = dict(
    size=(1024, 1024),
    logo=(58, 48),
    head_top=0.082, head_cap=0.055, head_lead=0.072,
    head_right=0.945, head_max_w=0.400,
    steps=[dict(y=0.140, xe=0.560), dict(y=0.470, xe=0.620), dict(y=0.724, xe=0.462)],
    step_h=[0.300, 0.286, 0.250],
    # Empat pouch, bukan lima. Kanvas 1:1 harus memuat judul, deret pouch,
    # tiga langkah DAN tombol dalam tinggi yang sepertiga lebih pendek
    # daripada acuan. Dipaksa lima, pouch kelima terpotong tepi bawah dan
    # yang keempat menabrak tombolnya. Tingkat ketiga tetap digambar, sebagai
    # alas tombol.
    slots=[(0.190, 0, 0.44), (0.425, 0, 0.62),
           (0.165, 1, 0.42), (0.400, 1, 0.42)],
    pouch_h=0.215, angle=12,
    icon_left=0.660, icon_top=0.470, icon_gap=0.150, icon_size=0.086,
    label_size=0.0345, rule_right=0.945,
    cta=(0.058, 0.884, 0.442, 0.952), cta_size=0.0305,
)


def build(cat="premium", layout=VERT, out=None):
    spec = CATEGORY[cat]
    sc = spec["scheme"]
    W, H = layout["size"]
    out = out or f"flatlay_{cat}_{W}x{H}.png"

    flat = Image.new("RGB", (W, H), sc["field"])

    # Diagonal tandingan: acuan memisah bidangnya jadi dua terang hijau, dan
    # batasnya NAIK ke kanan - berlawanan arah dengan pitanya. Itu yang
    # menahan komposisinya supaya tidak terasa meluncur ke satu sudut.
    ctr = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(ctr).polygon([(0, H * 0.84), (W, H * 0.44), (W, H), (0, H)],
                                fill=sc["field_low"] + (255,))
    flat.paste(ctr, (0, 0), ctr)

    # Tangga: tiap tingkat digambar dari atas ke bawah, slab demi slab.
    bands = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    step_span = []
    xe = spec.get("xe") or [st["xe"] for st in layout["steps"]]
    for st, hfrac, slabs, xend in zip(layout["steps"], layout["step_h"], sc["steps"], xe):
        y = st["y"] * H
        total = hfrac * H
        step_span.append((y, total))
        for colour, share in slabs:
            t = total * share
            _band(bands, y, t, xend * W, colour)
            y += t
    flat.paste(bands, (0, 0), bands)

    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    members = [p for p in bs.PRODUCTS
               if spec["pick"](p) and p["slug"] not in DISPLAY_SKIP][:len(layout["slots"])]
    for prod, (cxf, si, hshare) in zip(members, layout["slots"]):
        cx = cxf * W
        y0, total = step_span[si]
        cy = y0 + SLOPE * cx + total * hshare
        _pouch(c, prod, spec["size"], cx, cy,
               layout["pouch_h"] * H * spec.get("pouch", 1.0), layout["angle"])

    flat.paste(c, (0, 0), c)

    top = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bare = flat.copy()          # tanpa kotak tombol, untuk memeriksa kotaknya

    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    if sc["ink"] == BONE:
        tint = Image.new("RGBA", logo.size, BONE + (0,))
        tint.putalpha(logo.split()[3]); logo = tint
    top.alpha_composite(logo, layout["logo"])

    # Judul: rata kanan, tepi kirinya dibiarkan bergerigi, persis acuan.
    # Ukurannya SATU untuk semua baris - baris terlebar yang menentukan, dan
    # semua ikut mengecil bersamanya. Mengecilkan hanya baris yang tumpah
    # memang muat, tapi hasilnya empat ukuran huruf dalam satu judul.
    size = round(layout["head_cap"] * H / (50 / 74))
    lim = layout["head_max_w"] * W
    strips = [bs.build_headline(ln, size, sc["ink"]) for ln in spec["head"]]
    widest = max(s.width for s in strips)
    if widest > lim:
        size = max(12, round(size * lim / widest))
        strips = [bs.build_headline(ln, size, sc["ink"]) for ln in spec["head"]]
    y = layout["head_top"] * H
    for strip in strips:
        top.alpha_composite(strip, (round(layout["head_right"] * W - strip.width), round(y)))
        y += layout["head_lead"] * H

    # Tiga langkah. Ikon di atas, label di bawahnya, lalu garis penuh sampai
    # tepi kanan - susunan yang sama dengan Mix / Sleep / Eat pada acuan.
    d = ImageDraw.Draw(top)
    isz = layout["icon_size"] * H
    lab = ImageFont.truetype(bs.F_BODY, round(layout["label_size"] * H))
    for i, (txt, icon) in enumerate(zip(STEPS_TEXT, ICONS)):
        y = (layout["icon_top"] + i * layout["icon_gap"]) * H
        x = layout["icon_left"] * W
        icon(d, x + isz * 0.55, y, isz, sc["ink"] + (255,), max(3, round(isz * 0.055)))
        ly = y + isz * 1.12
        w = _left(top, txt, lab, sc["ink"], x, ly)
        ry = ly + layout["label_size"] * H * 1.32
        d.line([(x + w + isz * 0.22, ry), (layout["rule_right"] * W, ry)],
               fill=sc["ink"] + (255,), width=max(2, round(H * 0.0022)))

    # Tombol ajakan. Acuan menaruhnya di kiri bawah, di atas bidang polos,
    # jauh dari tangganya.
    bx0, by0, bx1, by1 = (layout["cta"][0] * W, layout["cta"][1] * H,
                          layout["cta"][2] * W, layout["cta"][3] * H)
    # Kotaknya masuk ke lapisan latar, bukan lapisan naskah, supaya pemeriksaan
    # di bawah membandingkan tulisan dengan kotaknya sendiri - bukan dengan pita
    # di belakang kotak, yang selalu lolos atau selalu gagal tanpa arti.
    #
    # Warnanya charcoal untuk kedua skema. Semula tombol pada skema pouch gelap
    # dibuat bone white, dan pada kanvas 1:1 ia mendarat penuh di atas slab bone
    # white: 25.636 piksel tombol tanpa kontras sama sekali, tombol yang lenyap.
    ImageDraw.Draw(flat).rectangle([bx0, by0, bx1, by1], fill=sc["cta_bg"])
    cf = ImageFont.truetype(bs.F_BODY_BOLD, round(layout["cta_size"] * H))
    tw = _left(top, spec["cta"], cf, sc["cta_ink"],
               bx0 + (bx1 - bx0) * 0.115, by0 + (by1 - by0) * 0.30)
    ax = bx0 + (bx1 - bx0) * 0.115 + tw + (bx1 - bx0) * 0.075
    ay = (by0 + by1) / 2
    a = (by1 - by0) * 0.17
    d.line([(ax, ay - a), (ax + a, ay), (ax, ay + a)],
           fill=sc["cta_ink"] + (255,), width=max(3, round(H * 0.0030)), joint="curve")

    under = flat.copy()
    flat.paste(top, (0, 0), top)
    flat.save(out)
    LAST[out] = (under, top, bare, (bx0, by0, bx1, by1), sc["cta_bg"])
    return out


# Naskah yang lenyap adalah kegagalan yang paling mudah terjadi di sini: ikon
# dan label bone white pernah jatuh utuh di atas slab bone white, dan tidak ada
# yang aneh sampai gambarnya dilihat. Jadi tiap unsur di lapisan atas diperiksa
# terhadap apa yang ada persis di bawahnya.
LAST = {}
MIN_CONTRAST = 40


def check(path):
    under, top, bare, rect, cta_bg = LAST[path]
    a = np.asarray(top).astype(int)
    ink = a[..., 3] > 200
    if not ink.any():
        return ["lapisan atas kosong"]
    lum_top = a[..., :3].mean(2)
    lum_under = np.asarray(under).astype(int).mean(2)
    diff = np.abs(lum_top - lum_under)
    bad = ink & (diff < MIN_CONTRAST)
    out = []
    n = int(bad.sum())
    if n > 0.02 * ink.sum():
        ys, xs = np.nonzero(bad)
        out.append(f"{n} px naskah nyaris tak terbaca di sekitar "
                   f"({xs.min()}..{xs.max()}, {ys.min()}..{ys.max()})")
    # Kotak tombol diperiksa tersendiri, terhadap apa pun yang ditutupinya.
    x0, y0, x1, y1 = (round(v) for v in rect)
    beneath = np.asarray(bare).astype(int)[y0:y1, x0:x1].mean(2)
    if np.abs(beneath - np.mean(cta_bg)).min() < MIN_CONTRAST:
        out.append("kotak tombol tanpa kontras terhadap latar di belakangnya")

    for name, sl in (("tepi kiri", (slice(None), slice(0, 2))),
                     ("tepi kanan", (slice(None), slice(-2, None))),
                     ("tepi atas", (slice(0, 2), slice(None))),
                     ("tepi bawah", (slice(-2, None), slice(None)))):
        if ink[sl].any():
            out.append(f"naskah menyentuh {name}")
    return out


def build_all():
    made = []
    for cat in CATEGORY:
        for tag, lay in (("1000x1500", VERT), ("1024", SQR)):
            made.append(build(cat, lay, f"Kategori_{cat}_flatlay_{tag}.png"))
    return made


if __name__ == "__main__":
    for f in build_all():
        print(f)
