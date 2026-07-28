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
from scipy import ndimage as ndi
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
# sampai mockup-nya diperbaiki. Ia tetap ikut terhitung dalam jumlah rasanya.
DISPLAY_SKIP = {"Avocado"}


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



CATEGORY = {
    "premium": dict(
        head=["The", "Premium", f"Line, {count('premium')[1].title()}", "Flavours"],
        band="1000 GRAM · 250 GRAM",
        cta="See All Flavours",
        pick=lambda p: p["series"] == "premium",
        size="1000",
        scheme=LIGHT_ON_STEEL,
        xe=[0.560, 0.620, 0.470], pouch=1.00,
    ),
    "250gr": dict(
        head=["Every", "Flavour,", "Now in", "250 Gram"],
        band=f"{count('250')[1].upper()} FLAVOURS",
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
    # Mangkuknya LONJONG dan miring. Versi pertama memakai lingkaran sempurna
    # dengan gagang lurus, dan yang terbaca kaca pembesar, bukan sendok takar.
    # Gagangnya juga sempat ditutup garis tegak lurus di ujung - itu terbaca
    # sebagai tanda tambah.
    ang = math.radians(-38)
    cx, cy = x + s * 0.34, y + s * 0.64
    ra, rb = s * 0.30, s * 0.20
    pts = []
    for k in range(48):
        t = 2 * math.pi * k / 48
        px, py = ra * math.cos(t), rb * math.sin(t)
        pts.append((cx + px * math.cos(ang) - py * math.sin(ang),
                    cy + px * math.sin(ang) + py * math.cos(ang)))
    d.polygon(pts, outline=col, width=w)
    d.line([(cx + ra * 0.84 * math.cos(ang), cy + ra * 0.84 * math.sin(ang)),
            (x + s * 0.96, y + s * 0.06)], fill=col, width=w)


def _icon_pour(d, x, y, s, col, w):
    # Kemasan dimiringkan, mulutnya menghadap gelas, lalu SATU aliran menyambung
    # dari mulut ke mulut gelas. Dua percobaan sebelumnya gagal terbaca: yang
    # pertama menggambar kemasannya tegak dengan tetesan menyerong (terbaca
    # kotak melayang di sebelah coretan), yang kedua memakai tiga tetes terpisah
    # di atas gelas (terbaca tiga garis yang tidak berasal dari mana pun).
    # Miringnya berlawanan arah jarum jam: memutar searah jarum jam justru
    # menjatuhkan mulut kemasan ke kiri, menjauhi gelas, dan alirannya keluar
    # dari sudut yang salah lalu berpatah balik.
    a = math.radians(-30)
    cx, cy = x + s * 0.26, y + s * 0.24
    hw, hh = s * 0.12, s * 0.26
    corner = [(-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh)]
    pts = [(cx + dx * math.cos(a) - dy * math.sin(a), cy + dx * math.sin(a) + dy * math.cos(a))
           for dx, dy in corner]
    d.polygon(pts, outline=col, width=w)
    mouth = max(pts, key=lambda q: q[0] + q[1])      # sudut terbawah-terkanan
    d.line([mouth, (x + s * 0.62, y + s * 0.42), (x + s * 0.72, y + s * 0.50),
            (x + s * 0.76, y + s * 0.57)],
           fill=col, width=max(2, w - 1), joint="curve")
    d.polygon([(x + s * 0.56, y + s * 0.58), (x + s * 0.96, y + s * 0.58),
               (x + s * 0.88, y + s * 0.98), (x + s * 0.64, y + s * 0.98)],
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


def _pouch(canvas, prod, size, cx, cy, h, angle, boxes=(), clear=0):
    im = Image.open(f'{bs.PROD}/{prod["p250" if size == "250" else "p1000"]}')
    im = im.convert("RGBA"); im = im.crop(im.getbbox())
    w = round(h * im.width / im.height)
    im = im.resize((w, round(h)), Image.LANCZOS)
    if size == "250":
        im = bs.model_white(im)
    im = im.rotate(-angle, Image.BICUBIC, expand=True)
    x, y = cx - im.width / 2, cy - im.height / 2
    # Kemasan mengalah kepada naskah, sama seperti pita. Kantong 250 gram 1,24
    # kali lebih lebar daripada pouch 1000 gram, jadi pada slot yang sama sudut
    # kanan atasnya masuk ke kotak judul. Menggeser slotnya dengan angka tetap
    # memperbaiki satu kategori dan merusak yang lain; jadi geserannya dihitung.
    for bx0, by0, bx1, by1 in boxes:
        if (x < bx1 + clear and x + im.width > bx0 - clear
                and y < by1 + clear and y + im.height > by0 - clear):
            x = min(x, bx0 - clear - im.width)
    _shadow(canvas, im, x, y, blur=h * 0.055, drop=h * 0.045)
    canvas.alpha_composite(im, (round(x), round(y)))
    # Kotak yang dikembalikan adalah kotak KEMASANNYA, bukan kotak lapisan
    # setelah ditempel. Dua kesalahan tinggal di situ: mengambil getbbox()
    # kanvas memberi kotak gabungan semua pouch sebelumnya, dan alpha kanvas
    # sudah mengandung bayangan - bayangan yang menyentuh tombol bukan cacat.
    b = im.split()[3].point(lambda v: 255 if v > 128 else 0).getbbox()
    return None if b is None else (round(x) + b[0], round(y) + b[1],
                                   round(x) + b[2], round(y) + b[3])


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
    # Kantong 250 gram butuh susunannya sendiri. Ia 1,24 kali lebih lebar
    # daripada pouch 1000 gram, jadi pada slot yang sama anggota kedua masuk ke
    # kotak judul; digeser keluar, ia menutupi setengah label anggota pertama -
    # nama rasa yang tidak terbaca, cacat yang lebih buruk daripada yang
    # diperbaikinya. Susunan ini menaruh yang jauh ke kanan jauh ke bawah juga,
    # sehingga judul di kanan atas tidak pernah jadi soal.
    slots250=[(0.215, 0, 0.50), (0.470, 0, 0.86),
              (0.215, 1, 0.55), (0.470, 1, 0.95),
              (0.300, 2, 0.55)],
    pouch_h=0.200, angle=12,
    icon_left=0.660, icon_top=0.503, icon_gap=0.148, icon_size=0.082,
    label_size=0.0330, rule_right=0.945,
    cta=(0.060, 0.956), cta_size=0.0290,
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
    cta=(0.058, 0.952), cta_size=0.0305,
)


# Jarak bebas antara naskah dan apa pun yang berwarna lain. Angkanya pecahan
# lebar kanvas, jadi berlaku sama di 1000x1500 dan 1024x1024.
#
# Tanpa ini, tepi kanan pita pertama berhenti 15 px dari huruf F pada baris
# "Flavours" dan batang huruf itu menyatu dengan slab bone white di belakangnya.
# Menggeser pitanya dengan angka tetap memperbaiki satu berkas dan merusak yang
# lain, karena lebar judulnya berbeda tiap kategori. Jadi ujung pitanya
# DIHITUNG dari kotak judul, bukan ditebak.
CLEAR = 0.026


def _measure(text, font):
    pad = 200
    probe = Image.new("L", (2000 + pad, 600), 0)
    ImageDraw.Draw(probe).text((pad, pad), text, font=font, fill=255)
    b = probe.getbbox()
    return (b[2] - b[0], b[3] - b[1]) if b else (0, 0)


def _clamp(y0, t, x_end, boxes, clear):
    """Perpendek slab supaya tidak masuk ke kotak naskah mana pun.

    Slab menempati y antara y0+SLOPE*x dan y0+t+SLOPE*x, jadi rentang x tempat
    ia bertabrakan dengan sebuah kotak bisa dihitung langsung. Kalau rentang itu
    kosong sebelum ujungnya, slab boleh lewat - itulah sebabnya slab bawah
    sebuah tingkat kadang boleh lebih panjang daripada slab atasnya: tepi
    atasnya sudah turun melewati judul.
    """
    for bx0, by0, bx1, by1 in boxes:
        lo = (by0 - clear - y0 - t) / SLOPE
        hi = (by1 + clear - y0) / SLOPE
        limit = bx0 - clear
        if x_end > limit and max(lo, limit) <= min(hi, x_end):
            x_end = limit
    return x_end


def build(cat="premium", layout=VERT, out=None):
    spec = CATEGORY[cat]
    sc = spec["scheme"]
    W, H = layout["size"]
    out = out or f"flatlay_{cat}_{W}x{H}.png"
    clear = CLEAR * W

    # ── naskah diukur lebih dulu, karena pita mengalah kepadanya ─────────────
    size = round(layout["head_cap"] * H / (50 / 74))
    lim = layout["head_max_w"] * W
    strips = [bs.build_headline(ln, size, sc["ink"]) for ln in spec["head"]]
    widest = max(s.width for s in strips)
    if widest > lim:
        size = max(12, round(size * lim / widest))
        strips = [bs.build_headline(ln, size, sc["ink"]) for ln in spec["head"]]
    head_x = [round(layout["head_right"] * W - s.width) for s in strips]
    head_y = [round((layout["head_top"] + i * layout["head_lead"]) * H)
              for i in range(len(strips))]
    head_box = (min(head_x), head_y[0],
                max(x + s.width for x, s in zip(head_x, strips)),
                head_y[-1] + strips[-1].height)

    isz = layout["icon_size"] * H
    lab = ImageFont.truetype(bs.F_BODY, round(layout["label_size"] * H))
    step_y = [(layout["icon_top"] + i * layout["icon_gap"]) * H for i in range(3)]
    col_box = (round(layout["icon_left"] * W), round(step_y[0]),
               round(layout["rule_right"] * W),
               round(step_y[-1] + isz * 1.12 + layout["label_size"] * H * 2.4))

    cf = ImageFont.truetype(bs.F_BODY_BOLD, round(layout["cta_size"] * H))
    ctw, cth = _measure(spec["cta"], cf)
    pad_x, pad_y = cth * 1.05, cth * 0.82
    arrow, gap = cth * 0.52, cth * 0.85
    bx0 = layout["cta"][0] * W
    by1 = layout["cta"][1] * H
    bx1 = bx0 + pad_x * 2 + ctw + gap + arrow
    by0 = by1 - (cth + pad_y * 2)

    boxes = [head_box, col_box]

    # ── latar ───────────────────────────────────────────────────────────────
    flat = Image.new("RGB", (W, H), sc["field"])

    # Diagonal tandingan: acuan memisah bidangnya jadi dua terang hijau, dan
    # batasnya NAIK ke kanan - berlawanan arah dengan pitanya. Itu yang
    # menahan komposisinya supaya tidak terasa meluncur ke satu sudut.
    # Ujung kanannya tegak di batas kolom naskah, sama seperti pita. Dibiarkan
    # menyeberang penuh, garis batasnya lewat tepat di belakang ikon sendok dan
    # di belakang langkah ketiga - satu garis diagonal samar memotong naskah,
    # yang terbaca sebagai cacat cetak.
    ctr_r = min(W, layout["icon_left"] * W - clear)
    ctr = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(ctr).polygon(
        [(0, H * 0.84), (ctr_r, H * 0.84 - 0.40 * H * ctr_r / W), (ctr_r, H), (0, H)],
        fill=sc["field_low"] + (255,))
    flat.paste(ctr, (0, 0), ctr)

    bands = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    step_span = []
    xe = spec.get("xe") or [st["xe"] for st in layout["steps"]]
    for st, hfrac, slabs, xend in zip(layout["steps"], layout["step_h"], sc["steps"], xe):
        y0 = st["y"] * H
        total = hfrac * H
        step_span.append((y0, total))
        # Satu ujung untuk seluruh tingkat, yaitu yang terpendek di antara
        # slab-slabnya. Membiarkan tiap slab berhenti sendiri-sendiri membuat
        # tepi kanan satu pita bertakik, dan takik itu terbaca sebagai cacat.
        limit = min(_clamp(y0 + sum(total * sh for _, sh in slabs[:i]),
                           total * slabs[i][1], xend * W, boxes, clear)
                    for i in range(len(slabs)))
        y = y0
        for colour, share in slabs:
            t = total * share
            _band(bands, y, t, limit, colour)
            y += t
    flat.paste(bands, (0, 0), bands)

    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    slots = layout.get("slots250" if spec["size"] == "250" else "slots",
                       layout["slots"])
    members = [p for p in bs.PRODUCTS
               if spec["pick"](p) and p["slug"] not in DISPLAY_SKIP][:len(slots)]
    pouch_boxes = []
    for prod, (cxf, si, hshare) in zip(members, slots):
        cx = cxf * W
        y0, total = step_span[si]
        cy = y0 + SLOPE * cx + total * hshare
        pouch_boxes.append(
            _pouch(c, prod, spec["size"], cx, cy,
                   layout["pouch_h"] * H * spec.get("pouch", 1.0), layout["angle"],
                   boxes, clear))
    flat.paste(c, (0, 0), c)

    # ── naskah ──────────────────────────────────────────────────────────────
    bare = flat.copy()          # tanpa kotak tombol, untuk memeriksa kotaknya
    ImageDraw.Draw(flat).rectangle([bx0, by0, bx1, by1], fill=sc["cta_bg"])

    top = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    logo = Image.open(f"{bs.ASSETS}/logo_nomukita.png").convert("RGBA")
    if sc["ink"] == BONE:
        tint = Image.new("RGBA", logo.size, BONE + (0,))
        tint.putalpha(logo.split()[3]); logo = tint
    top.alpha_composite(logo, layout["logo"])

    for strip, x, y in zip(strips, head_x, head_y):
        top.alpha_composite(strip, (x, y))

    d = ImageDraw.Draw(top)
    for i, (txt, icon) in enumerate(zip(STEPS_TEXT, ICONS)):
        y = step_y[i]
        x = layout["icon_left"] * W
        icon(d, x + isz * 0.55, y, isz, sc["ink"] + (255,), max(3, round(isz * 0.055)))
        ly = y + isz * 1.12
        w = _left(top, txt, lab, sc["ink"], x, ly)
        # Garisnya mulai dari tepi kiri label dan berakhir sejajar tepi kanan
        # judul - satu garis bawah penuh, seperti acuan. Versi sebelumnya
        # memulainya SETELAH kata, dan yang tampak potongan garis menggantung
        # yang tidak menempel pada apa pun.
        ry = ly + layout["label_size"] * H * 1.30
        d.line([(x, ry), (layout["rule_right"] * W, ry)],
               fill=sc["ink"] + (255,), width=max(2, round(H * 0.0022)))

    # Tombol ajakan. Ukurannya DITURUNKAN dari lebar tulisannya, bukan
    # sebaliknya. Versi sebelumnya memakai kotak berukuran tetap dan tulisan
    # "See All Flavours" beserta panahnya menonjol keluar di sisi kanan.
    _left(top, spec["cta"], cf, sc["cta_ink"], bx0 + pad_x, by0 + pad_y)
    ax = bx0 + pad_x + ctw + gap
    ay = (by0 + by1) / 2
    d.line([(ax, ay - arrow * 0.62), (ax + arrow * 0.62, ay), (ax, ay + arrow * 0.62)],
           fill=sc["cta_ink"] + (255,), width=max(3, round(H * 0.0030)), joint="curve")

    under = flat.copy()
    flat.paste(top, (0, 0), top)
    flat.save(out)
    LAST[out] = dict(under=under, top=top, bare=bare, clear=clear,
                     cta=(bx0, by0, bx1, by1), cta_bg=sc["cta_bg"],
                     field=[sc["field"], sc["field_low"], sc["cta_bg"]],
                     pouches=pouch_boxes, boxes=boxes)
    return out


# Naskah yang lenyap adalah kegagalan yang paling mudah terjadi di sini: ikon
# dan label bone white pernah jatuh utuh di atas slab bone white, dan tidak ada
# yang aneh sampai gambarnya dilihat. Jadi tiap unsur di lapisan atas diperiksa
# terhadap apa yang ada persis di bawahnya - bukan cuma di bawah tintanya, tapi
# juga di sekelilingnya sejauh CLEAR, karena huruf yang hampir menyentuh pita
# sama cacatnya dengan huruf yang tenggelam di dalamnya.
LAST = {}
MIN_CONTRAST = 40
FIELD_TOL = 14


def check(path):
    L = LAST[path]
    a = np.asarray(L["top"]).astype(int)
    ink = a[..., 3] > 200
    out = []
    if not ink.any():
        return ["lapisan atas kosong"]

    bg = np.asarray(L["under"]).astype(int)
    diff = np.abs(a[..., :3].mean(2) - bg.mean(2))
    faint = ink & (diff < MIN_CONTRAST)
    if faint.sum() > 0.02 * ink.sum():
        ys, xs = np.nonzero(faint)
        out.append(f"{int(faint.sum())} px naskah nyaris tak terbaca di "
                   f"({xs.min()}..{xs.max()}, {ys.min()}..{ys.max()})")

    # Halo: sejauh CLEAR di sekeliling tiap tinta, latar harus polos - hanya
    # bidang, bidang bawah, atau kotak tombol. Pita atau pouch di dalam halo
    # berarti naskahnya menempel.
    r = int(round(L["clear"]))
    halo = ndi.maximum_filter(ink, size=2 * r + 1)
    dist = np.min([np.abs(bg - np.array(c)).max(2) for c in L["field"]], axis=0)
    # Tulisan di dalam tombol punya latarnya sendiri, dan tepi tombol memang
    # bertemu pita - itu rancangannya, bukan cacat. Jadi kotak tombol
    # dikeluarkan dari uji halo dan diperiksa terpisah di bawah.
    cx0, cy0, cx1, cy1 = (round(v) for v in L["cta"])
    halo[max(0, cy0 - r):cy1 + r, max(0, cx0 - r):cx1 + r] = False
    stray = halo & (dist > FIELD_TOL)
    if stray.sum() > 0.001 * halo.sum():
        ys, xs = np.nonzero(stray)
        out.append(f"naskah menempel latar berwarna lain: {int(stray.sum())} px di "
                   f"({xs.min()}..{xs.max()}, {ys.min()}..{ys.max()})")

    x0, y0, x1, y1 = cx0, cy0, cx1, cy1
    beneath = np.asarray(L["bare"]).astype(int)[y0:y1, x0:x1].mean(2)
    if np.abs(beneath - np.mean(L["cta_bg"])).min() < MIN_CONTRAST:
        out.append("kotak tombol tanpa kontras terhadap latar di belakangnya")

    for i, pb in enumerate(L["pouches"]):
        if pb and not (pb[2] < x0 or pb[0] > x1 or pb[3] < y0 or pb[1] > y1):
            out.append(f"pouch {i + 1} bertumpuk dengan tombol")
        for bx0, by0, bx1, by1 in L["boxes"]:
            if pb and not (pb[2] < bx0 - L["clear"] or pb[0] > bx1 + L["clear"]
                           or pb[3] < by0 - L["clear"] or pb[1] > by1 + L["clear"]):
                out.append(f"pouch {i + 1} masuk ke kotak naskah")

    Wc, Hc = L["top"].size
    for i, pb in enumerate(L["pouches"]):
        if pb and (pb[0] < 0 or pb[1] < 0 or pb[2] > Wc or pb[3] > Hc):
            out.append(f"pouch {i + 1} terpotong tepi kanvas")

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
        print(f, check(f) or "PASS")
