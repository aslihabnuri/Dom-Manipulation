"""Slide 5: serving suggestions - satu produk, tiga cara menyajikan.

Semua angka di sini diukur dari `Uji_S5.png` yang sudah disetujui, bukan dikira-
kira, supaya sebelas produk berikutnya tidak melenceng gayanya. Referensinya
sendiri hasil ekspor yang terkompresi dan ber-vignette - sudutnya 228 sementara
tengahnya 241 - jadi pengukurannya memakai kegelapan tinta, bukan selisih
terhadap latar yang dikira rata.

Tata letaknya tidak simetris, dan itu disengaja: kolom kiri rata kiri, kolom
tengah rata tengah, kolom kanan rata kanan, dan keterangan kolom tengah turun
124 px. Garis penunjuknya yang menjembatani jarak yang berbeda-beda itu.
"""

from PIL import Image, ImageDraw, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('photo', 'photo.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, photo

# ── diukur dari Uji_S5 ───────────────────────────────────────────────────────
HEAD_SIZE, HEAD_TOP = 54, 162        # All Round Gothic Bold, tinta atas, huruf besar semua
SUB_SIZE, SUB_TOP = 24, 226          # Comfortaa Regular
NAME_SIZE = 24                       # nama kreasi, huruf besar semua
RECIPE_SIZE = 20
NAME_TO_RECIPE = 34                  # tinta atas nama -> tinta atas baris resep pertama
RECIPE_LEAD = 28                     # antar baris resep
BASE = 915                           # ketiga gelasnya berdiri di sini

MARK_X = (226, 516, 791)             # sumbu tiap kolom; penanda dan garisnya di sini
NAME_TOP = (316, 440, 316)           # kolom tengah turun 124 px supaya tidak bertabrakan
ALIGN = ('left', 'center', 'right')
EDGE = (95, None, 944)               # tepi rata untuk kolom kiri dan kanan

MARK_D = 13                          # penanda tetes air, 13 x 13
MARK_RGB = (94, 152, 189)            # steel blue yang sama dengan titik di logo
LEAD_RGB = (219, 217, 211)
LEAD_W = 2
LEAD_GAP = 6                         # jarak dari dasar keterangan ke awal garis

# Tinggi wadah, diukur utuh dari acuan: mug y 674..918 = 244 px, gelas tinggi
# 362 dan 369 px. Diukur UTUH, bukan badan gelasnya saja - dan itu perbedaan yang
# penting. Sekali percobaan wadahnya diskalakan pada badan gelas 370 px, lalu es
# dan busa di atas bibir gelas menambah tinggi totalnya jadi ~475 px, dan gelas
# tengah naik menabrak keterangannya sendiri sedalam 84 px.
VESSEL_PX = {'mug': 244, 'tall': 365, 'short': 300}
CLEAR = 18           # jarak terkecil antara dasar keterangan dan puncak minuman


def _teardrop(draw, cx, cy, d=MARK_D, fill=MARK_RGB):
    """Tetes air Nomukita: lingkaran dengan sudut kiri-bawah dipersegi - tanda
    yang sama dengan titik pada logo dan tetes penilaian di slide Uji."""
    r = d / 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)
    draw.rectangle([cx - r, cy, cx, cy + r], fill=fill)


def _text(canvas, text, font, colour, top, align, anchor_x):
    """Gambar satu baris dengan tinta atasnya tepat di `top`.

    Tinta atas, bukan garis dasar font: acuannya diukur begitu, dan hanya itu
    yang bisa dicocokkan kembali dari piksel.
    """
    pad = 400
    layer = Image.new('RGBA', (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    if bb is None:
        return
    if align == 'left':
        x = anchor_x - (bb[0] - pad)
    elif align == 'right':
        x = anchor_x - (bb[2] - pad)
    else:
        x = anchor_x - ((bb[0] + bb[2]) / 2 - pad)
    canvas.alpha_composite(layer, (round(x - pad), round(top - (bb[1] - pad) - pad)))


def build(product, creations, out='s5.png'):
    """`creations` = tiga dict: name, lines (satu atau dua), vessel, image."""
    assert len(creations) == 3, 'slide ini selalu tiga cara'
    accent = bs.accent(product['head'])

    c = Image.new('RGBA', (1024, 1024), bs.BG + (255,))
    c.alpha_composite(Image.open(f'{bs.ASSETS}/logo_nomukita.png').convert('RGBA'), bs.LOGO_XY)
    _text(c, 'SERVING SUGGESTIONS', ImageFont.truetype(bs.F_HEAD, HEAD_SIZE),
          accent, HEAD_TOP, 'center', 512)
    _text(c, product['s5_sub'], ImageFont.truetype(bs.F_BODY, SUB_SIZE),
          bs.CHARCOAL, SUB_TOP, 'center', 512)

    name_f = ImageFont.truetype(bs.F_BODY, NAME_SIZE)
    rec_f = ImageFont.truetype(bs.F_BODY, RECIPE_SIZE)
    tops = []
    for i, cr in enumerate(creations):
        anchor = EDGE[i] if ALIGN[i] != 'center' else MARK_X[i]
        _text(c, cr['name'], name_f, bs.CHARCOAL, NAME_TOP[i], ALIGN[i], anchor)
        for j, line in enumerate(cr['lines']):
            _text(c, line, rec_f, bs.CHARCOAL,
                  NAME_TOP[i] + NAME_TO_RECIPE + j * RECIPE_LEAD, ALIGN[i], anchor)
        tops.append(NAME_TOP[i] + NAME_TO_RECIPE + (len(cr['lines']) - 1) * RECIPE_LEAD
                    + RECIPE_SIZE)

    flat = Image.new('RGB', (1024, 1024), bs.BG)
    flat.paste(c, (0, 0), c)

    # Gelasnya dulu, penanda dan garisnya belakangan: garis penunjuk itu grafis di
    # atas foto, bukan benda di dalam adegan.
    heads = []
    for i, cr in enumerate(creations):
        h = VESSEL_PX[cr['vessel']]
        # Kalau minumannya akan menabrak keterangannya, kecilkan minumannya. Tiap
        # produk punya garnis yang berbeda tingginya, jadi tidak ada satu angka
        # yang aman untuk kedua belas slide.
        room = BASE - (tops[i] + CLEAR)
        if h > room:
            h = room
        w = photo.size_at(cr['image'], h)
        photo.place(flat, cr["image"], MARK_X[i] - w // 2, BASE, h, replace=False)
        heads.append(BASE - h)

    over = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for i in range(3):
        mark_y = heads[i] - 10 - MARK_D // 2
        line_top = tops[i] + LEAD_GAP
        if mark_y - MARK_D // 2 > line_top:
            d.rectangle([MARK_X[i] - LEAD_W // 2, line_top,
                         MARK_X[i] - LEAD_W // 2 + LEAD_W - 1, mark_y],
                        fill=LEAD_RGB + (255,))
        _teardrop(d, MARK_X[i], mark_y, fill=MARK_RGB + (255,))
    flat.paste(over, (0, 0), over)

    flat.save(out)
    return out
