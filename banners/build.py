#!/usr/bin/env python3
"""Build the four Nomukita store banners."""

from pathlib import Path
from PIL import Image, ImageDraw

import nomukita as N
from nomukita import W, H, MARGIN, BONE, CHARCOAL, MATCHA, COCOA, STEEL, RULE

OUT = Path(__file__).resolve().parent / 'out'
OUT.mkdir(exist_ok=True)
ASSETS = Path(__file__).resolve().parent / 'assets'
ILLUS = ASSETS / 'illus'
PACK = ASSETS / 'pack'


def band(canvas, image_path, top, height, pouches=()):
    """Full-bleed illustration band with product pouches standing in it."""
    art = N.cover(N.trim_frame(Image.open(image_path)), W, height)
    canvas.paste(art, (0, top))
    for path, ph, cx, dy in pouches:
        p = N.pouch(path, ph)
        x = cx - p.width / 2
        y = top + height - ph - dy
        N.contact_shadow(canvas, p, x, y)
        canvas.alpha_composite(p, (round(x), round(y)))


# ── 1. Payday ─────────────────────────────────────────────────────────────
def payday():
    c = N.canvas()
    d = ImageDraw.Draw(c)
    mid = W / 2

    N.logo(c, y=61, width=352)

    d.text((mid, 214), '給料日', font=N.jp(38), fill=STEEL, anchor='ms')
    N.text(d, (mid, 318), 'PAYDAY SALE', 92, CHARCOAL, tracking=2, align='center')

    # "55% OFF" — the DEMO font locks '%', so it is drawn as a vector
    size, gap = 186, 40
    w55 = N.text_width('55', size)
    cap = N.arg(size).getbbox('H')[3] - N.arg(size).getbbox('H')[1]
    wpct = cap * N.PERCENT_WIDTH
    woff = N.text_width('OFF', size, tracking=2)
    total = w55 + wpct + gap + woff
    x, baseline = mid - total / 2, 540
    x += N.text(d, (x, baseline), '55', size, MATCHA)
    N.percent(c, x, baseline, cap, MATCHA)
    x += wpct + gap
    N.text(d, (x, baseline), 'OFF', size, MATCHA, tracking=2)

    band(c, ILLUS / 'street.png', top=640, height=600, pouches=(
        (PACK / 'matcha-nishio.png', 330, mid - 250, 26),
        (PACK / 'matcha-uji.png', 392, mid, 10),
        (PACK / 'premium-lemon-grass.png', 330, mid + 250, 26),
    ))

    N.rule(d, 1312)

    # chips row, separated by the logomark drop instead of the locked '·'
    a, b = 'GRATIS ONGKIR', 'VOUCHER HINGGA 20RB'
    fs, tr, dot, pad = 34, 6, 15, 34
    wa = N.text_width(a, fs, demi=True, tracking=tr)
    wb = N.text_width(b, fs, demi=True, tracking=tr)
    total = wa + pad + dot + pad + wb
    x = mid - total / 2
    N.text(d, (x, 1388), a, fs, CHARCOAL, demi=True, tracking=tr)
    N.drop(c, x + wa + pad, 1388 - dot, dot, STEEL)
    N.text(d, (x + wa + pad + dot + pad, 1388), b, fs, CHARCOAL, demi=True, tracking=tr)

    N.body(d, (mid, 1442), ['grade kafe, harga tanggal muda.'], 31, CHARCOAL,
           align='center')
    return N.finish(c, OUT / '1-payday.png')


# ── 2. Syarat dan Ketentuan ───────────────────────────────────────────────
def terms():
    c = N.canvas()
    d = ImageDraw.Draw(c)
    mid = W / 2

    N.logo(c, y=61, width=352)
    d.text((mid, 208), '返品規定', font=N.jp(36), fill=STEEL, anchor='ms')
    # '&' is locked in the DEMO font, and "DAN" is the correct register anyway
    N.text(d, (mid, 300), 'SYARAT DAN KETENTUAN', 74, CHARCOAL, tracking=2,
           align='center')

    art = N.trim_frame(Image.open(ILLUS / 'unboxing2.png'))
    art.thumbnail((470, 470), Image.LANCZOS)
    c.paste(art, (round(mid - art.width / 2), 348))

    items = [
        ('01', 'REKAM SEBELUM DIBUKA',
         'video unboxing wajib diambil saat paket masih tersegel. '
         'tanpa video, barang tidak bisa diretur.'),
        ('02', 'BARANG RUSAK ATAU TIDAK SESUAI',
         'jika pesanan diterima dalam keadaan rusak, cacat, atau tidak sesuai, '
         'hubungi customer service kami dengan menyertakan keluhan dan video unboxing.'),
        ('03', 'KENDALA PENGIRIMAN',
         'untuk masalah pada proses kirim, hubungi CS ekspedisi terkait.'),
    ]

    y = 880
    num_x, text_x = MARGIN, MARGIN + 96
    for i, (num, head, copy) in enumerate(items):
        N.rule(d, y - 34)
        N.text(d, (num_x, y + 26), num, 44, STEEL, demi=True)
        N.text(d, (text_x, y + 22), head, 31, CHARCOAL, demi=True, tracking=4)
        lines = N.wrap(copy, 25, W - MARGIN - text_x)
        N.body(d, (text_x, y + 52), lines, 25, CHARCOAL)
        y += 62 + len(lines) * 25 * 1.55 + 54

    N.body(d, (mid, H - MARGIN - 42), ['powdered to perfection'], 23,
           (150, 148, 143), align='center')
    return N.finish(c, OUT / '2-syarat-ketentuan.png')


# ── 3. Fifteen years ──────────────────────────────────────────────────────
def heritage():
    c = N.canvas()
    d = ImageDraw.Draw(c)
    mid = W / 2

    N.logo(c, y=61, width=352)
    d.text((mid, 212), '十五年', font=N.jp(38), fill=STEEL, anchor='ms')

    # the apostrophe is locked in the DEMO font; the renderer swaps it to Comfortaa
    N.text(d, (mid, 322), "YOU'VE TASTED", 90, CHARCOAL, tracking=2, align='center')
    N.text(d, (mid, 420), 'THIS BEFORE', 90, CHARCOAL, tracking=2, align='center')

    a, b = '15 TAHUN', 'RATUSAN KAFE DI INDONESIA'
    fs, tr, dot, pad = 30, 6, 13, 28
    wa = N.text_width(a, fs, demi=True, tracking=tr)
    wb = N.text_width(b, fs, demi=True, tracking=tr)
    x = mid - (wa + pad + dot + pad + wb) / 2
    N.text(d, (x, 492), a, fs, MATCHA, demi=True, tracking=tr)
    N.drop(c, x + wa + pad, 492 - dot, dot, MATCHA)
    N.text(d, (x + wa + pad + dot + pad, 492), b, fs, MATCHA, demi=True, tracking=tr)

    band(c, ILLUS / 'cafe.png', top=560, height=640, pouches=(
        (PACK / 'matcha-uji.png', 300, mid - 380, 16),
        (PACK / 'exclusive-dark-cocoa.png', 330, mid - 190, 16),
        (PACK / 'matcha-nishio.png', 356, mid, 16),
        (PACK / 'exclusive-teh-tarik.png', 330, mid + 190, 16),
        (PACK / 'premium-lemon-grass.png', 300, mid + 380, 16),
    ))

    N.rule(d, 1282)
    N.body(d, (mid, 1330), [
        'selama ini kami ada di balik meja bar, bukan di rak Anda.',
        'sekarang, keduanya.',
    ], 31, CHARCOAL, align='center')
    N.body(d, (mid, H - MARGIN - 42), ['powdered to perfection'], 23,
           (150, 148, 143), align='center')
    return N.finish(c, OUT / '3-15-tahun.png')


# ── 4. Category classification ────────────────────────────────────────────
def category():
    c = N.canvas()
    d = ImageDraw.Draw(c)

    N.text(d, (MARGIN, 176), 'CATEGORY', 90, CHARCOAL, tracking=1)
    N.body(d, (MARGIN, 196), ['Classification'], 38, (110, 108, 103), weight=500)
    N.logo(c, y=118, width=250, align='right', x=W - MARGIN)

    tiles = [
        ('250 GRAM', 'グラム', 'tile-250.png', 'g250-chocolate.png', 0.60),
        ('MATCHA SERIES', '抹茶', 'tile-matcha.png', 'matcha-uji.png', 0.74),
        ('EXCLUSIVE SERIES', '特選', 'tile-exclusive.png', 'exclusive-dark-cocoa.png', 0.74),
        ('PREMIUM SERIES', '上質', 'tile-premium.png', 'premium-lemon-grass.png', 0.74),
    ]

    gap = 26
    tw = (W - 2 * MARGIN - gap) // 2
    th = 566
    top = 300

    for i, (label, kanji, bg, prod, fill_ratio) in enumerate(tiles):
        tx = MARGIN + (i % 2) * (tw + gap)
        ty = top + (i // 2) * (th + gap)

        tile = N.cover(Image.open(ILLUS / bg), tw, th).convert('RGBA')
        td = ImageDraw.Draw(tile)

        p = N.pouch(PACK / prod, round(th * fill_ratio))
        if p.width > tw - 80:
            p = p.resize((tw - 80, round(p.height * (tw - 80) / p.width)), Image.LANCZOS)
        px, py = (tw - p.width) / 2, (th - p.height) / 2 - 22
        N.contact_shadow(tile, p, px, py, blur=14, opacity=52)
        tile.alpha_composite(p, (round(px), round(py)))

        td.text((tw - 22, 26), kanji, font=N.jp(30), fill=(255, 255, 255, 190),
                anchor='ra')

        # pill label — '>' is locked in the DEMO font, so it is drawn
        fs = 25
        lw = N.text_width(label, fs, demi=True, tracking=3)
        pill_w, pill_h = lw + 34 + 22 + 22, 50
        pill_x, pill_y = 22, th - pill_h - 22
        td.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
                             radius=pill_h // 2, fill=(28, 28, 28, 214))
        N.text(td, (pill_x + 22, pill_y + 33), label, fs, (255, 255, 255, 255),
               demi=True, tracking=3)
        N.chevron(td, pill_x + 22 + lw + 16, pill_y + pill_h / 2, 17,
                  (255, 255, 255, 255), width=3)

        rounded = Image.new('L', (tw, th), 0)
        ImageDraw.Draw(rounded).rounded_rectangle([0, 0, tw, th], radius=20, fill=255)
        tile.putalpha(rounded)
        c.alpha_composite(tile, (tx, ty))

    N.body(d, (W / 2, H - MARGIN - 46), ['#RacikSendiri  ·  nomukita.com'.replace(
        '#RacikSendiri  ·  ', '')], 23, (150, 148, 143), align='center')
    return N.finish(c, OUT / '4-category.png')


if __name__ == '__main__':
    for fn in (payday, terms, heritage, category):
        img = fn()
        print(f'{fn.__name__:10s} {img.size}')
