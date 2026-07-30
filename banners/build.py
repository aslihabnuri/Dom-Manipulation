#!/usr/bin/env python3
"""Build the Nomukita store banners."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

import nomukita as N
from nomukita import W, H, MARGIN, BONE, CHARCOAL, MATCHA, COCOA, STEEL, RULE

OUT = Path(__file__).resolve().parent / 'out'
OUT.mkdir(exist_ok=True)
ASSETS = Path(__file__).resolve().parent / 'assets'
ILLUS = ASSETS / 'illus'
ILLUS2 = ASSETS / 'illus2'
ILLUS3 = ASSETS / 'illus3'
WIDE_W, WIDE_H = 2000, 1000
WIDE_M = 110
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


# ── 1. Payday — 2:1 ───────────────────────────────────────────────────────
def payday():
    c = N.canvas(WIDE_W, WIDE_H)
    panel = 880

    art = N.cover(N.trim_frame(Image.open(ILLUS2 / 'street.png')), WIDE_W, WIDE_H)
    c.paste(art, (0, 0))

    # bone panel carries the offer; the street runs on behind it
    ImageDraw.Draw(c).rectangle([0, 0, panel, WIDE_H], fill=BONE + (255,))
    d = ImageDraw.Draw(c)

    for path, accent, ph, cx, label in (
        (None, MATCHA, 430, 1225, ('Pure', '抹茶', ['Pure Matcha', 'Nishio'], '500 gram')),
        (None, (198, 150, 60), 492, 1525, ('Premium', 'レモングラス', ['Lemon Grass'], '1000 gram')),
        (None, COCOA, 430, 1825, ('Exclusive', 'ダークココア', ['Dark Cocoa'], '1000 gram')),
    ):
        pouch = N.pouch3d(ph, accent, label=label)
        x, y = cx - pouch.width / 2, WIDE_H - ph - 8
        N.contact_shadow(c, pouch, x, y, blur=18, opacity=76)
        c.alpha_composite(pouch, (round(x), round(y)))

    N.logo(c, y=96, width=306, within=panel)
    d.text((panel / 2, 268), '給料日', font=N.jp(38), fill=STEEL, anchor='ms')
    N.text(d, (panel / 2, 372), 'PAYDAY SALE', 78, CHARCOAL, tracking=2, align='center')

    size, gap = 156, 34
    w55 = N.text_width('55', size)
    cap = N.arg(size).getbbox('H')[3] - N.arg(size).getbbox('H')[1]
    wpct = cap * N.PERCENT_WIDTH
    woff = N.text_width('OFF', size, tracking=2)
    x, baseline = panel / 2 - (w55 + wpct + gap + woff) / 2, 570
    x += N.text(d, (x, baseline), '55', size, MATCHA)
    N.percent(c, x, baseline, cap, MATCHA)
    x += wpct + gap
    N.text(d, (x, baseline), 'OFF', size, MATCHA, tracking=2)

    N.rule(d, 648, x0=WIDE_M + 40, x1=panel - WIDE_M - 40)

    for i, line in enumerate(('GRATIS ONGKIR', 'VOUCHER HINGGA 20RB')):
        N.text(d, (panel / 2, 722 + i * 58), line, 32, CHARCOAL, demi=True,
               tracking=6, align='center')
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
         'hubungi customer service nomukita dengan menyertakan keluhan dan video unboxing.'),
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


# ── 3. Fifteen years — 2:1 ────────────────────────────────────────────────
def heritage():
    c = N.canvas(WIDE_W, WIDE_H)
    panel = 880

    art = N.cover(N.trim_frame(Image.open(ILLUS2 / 'teahouse2.png')), WIDE_W, WIDE_H)
    c.paste(art, (0, 0))

    for accent, ph, cx, label in (
        (MATCHA, 424, 1215, ('Pure', '抹茶', ['Pure Matcha', 'Uji Kyoto'], '500 gram')),
        (COCOA, 488, 1520, ('Exclusive', 'ダークココア', ['Dark Cocoa'], '1000 gram')),
        ((198, 150, 60), 424, 1825, ('Premium', 'テ・タリック', ['Teh Tarik'], '1000 gram')),
    ):
        pouch = N.pouch3d(ph, accent, label=label)
        x, y = cx - pouch.width / 2, WIDE_H - ph - 8
        N.contact_shadow(c, pouch, x, y, blur=18, opacity=76)
        c.alpha_composite(pouch, (round(x), round(y)))

    d = ImageDraw.Draw(c)
    d.rectangle([0, 0, panel, WIDE_H], fill=BONE + (255,))
    mid = panel / 2

    N.logo(c, y=96, width=306, within=panel)
    d.text((mid, 268), '十五年', font=N.jp(38), fill=STEEL, anchor='ms')
    N.text(d, (mid, 380), 'FIFTEEN YEARS', 72, CHARCOAL, tracking=2, align='center')
    N.text(d, (mid, 458), 'IN THE CUP', 72, CHARCOAL, tracking=2, align='center')
    N.text(d, (mid, 534), '15 TAHUN DI RATUSAN KAFE', 26, MATCHA, demi=True,
           tracking=6, align='center')
    N.rule(d, 596, x0=WIDE_M + 30, x1=panel - WIDE_M - 30)
    N.body(d, (mid, 648), [
        'rasa yang sudah lama akrab',
        'di cangkir kafe langganan.',
    ], 29, CHARCOAL, align='center')
    N.body(d, (mid, 782), [
        'kini tinggal diseduh sendiri di rumah.',
    ], 29, CHARCOAL, align='center')
    N.body(d, (mid, WIDE_H - 108), ['powdered to perfection'], 21,
           (150, 148, 143), align='center')
    return N.finish(c, OUT / '3-15-tahun.png')


# ── 4. Category classification ────────────────────────────────────────────
def category():
    c = N.canvas()
    d = ImageDraw.Draw(c)

    N.text(d, (MARGIN, 176), 'CATEGORY', 90, CHARCOAL, tracking=1)
    N.body(d, (MARGIN, 196), ['Classification'], 38, (110, 108, 103), weight=500)
    N.logo(c, y=118, width=250, align='right', x=W - MARGIN)

    AMBER = (198, 150, 60)
    tiles = [
        ('250 GRAM', 'グラム', 'cat-250.png', '250',
         (110, 64, 40), ('Exclusive', 'チョコレート', 'Chocolate', '250 gram')),
        ('MATCHA SERIES', '抹茶', 'cat-matcha.png', 'tall',
         MATCHA, ('Pure', '抹茶', ['Pure Matcha', 'Uji Kyoto'], '500 gram')),
        ('EXCLUSIVE SERIES', '特選', 'cat-exclusive.png', 'tall',
         COCOA, ('Exclusive', 'ダークココア', ['Pure Dark', 'Cocoa'], '1000 gram')),
        ('PREMIUM SERIES', '上質', 'cat-premium.png', 'tall',
         AMBER, ('Premium', 'レモングラス', ['Lemon Grass'], '1000 gram')),
    ]

    gap = 26
    tw = (W - 2 * MARGIN - gap) // 2
    th = 566
    top = 300

    for i, (label, kanji, bg, kind, accent, plabel) in enumerate(tiles):
        tx = MARGIN + (i % 2) * (tw + gap)
        ty = top + (i // 2) * (th + gap)

        tile = N.cover(N.trim_frame(Image.open(ILLUS3 / bg)), tw, th).convert('RGBA')
        td = ImageDraw.Draw(tile)

        if kind == '250':
            p = N.pouch250(round(th * 0.42), accent, label=plabel)
        else:
            p = N.pouch3d(round(th * 0.70), accent, label=plabel)
        if p.width > tw - 90:
            p = p.resize((tw - 90, round(p.height * (tw - 90) / p.width)), Image.LANCZOS)
        # stand the pack low in the frame so it reads as grounded, not floating
        px, py = (tw - p.width) / 2, th - p.height - 96
        N.contact_shadow(tile, p, px, py, blur=15, opacity=58)
        tile.alpha_composite(p, (round(px), round(py)))

        td.text((tw - 22, 26), kanji, font=N.jp(30), fill=(255, 255, 255, 205),
                anchor='ra')

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

    return N.finish(c, OUT / '4-category.png')


# ── 5. Discount — 2:1 ────────────────────────────────────────────────────
# The background is the client's Discount_Referensi file, by instruction, used
# as shot — no products composited over it, no scrim, no regeneration. The 2:1
# window is its y 530-1130 band, the only full-width strip clear of the slide's
# typeset text. Known and accepted: the tin held in the frame's right hand is
# the AI-generated one whose label misspells the product; the client chose this
# background with the products removed, so it shows. Flagged in delivery.
REF_BAND = (0, 530, 1200, 1130)


def discount():
    """The discount banner: the client's background and the copy, nothing else.

    Type only sits where the photograph was measured to hold it. The tea-room
    shadow in the top-left corner reads 45-101 luminance down to y 400, which
    is the full column — logo, headline, subline, offer and button. The two
    smaller offers ride a charcoal pill at the bottom centre, bringing their
    own ground, so the copy is not all on one side and nothing rests on
    unmeasured wood. The right half belongs to the photograph's own subject,
    the hands at work.
    """
    c = N.canvas(WIDE_W, WIDE_H)
    ref = Image.open(ASSETS / 'ref-discount.png').convert('RGB')
    c.paste(ref.crop(REF_BAND).resize((WIDE_W, WIDE_H), Image.LANCZOS), (0, 0))
    d = ImageDraw.Draw(c)
    white = (255, 255, 255)

    # Five elements, two groups. The subline came out: the column runs from the
    # logo to the white-text floor at y 400, and seven stacked pieces in that
    # budget read as clutter no matter how they are spaced. What remains is the
    # brand, the headline, and the offer group — label tight over its number,
    # the button after it — with the gaps opened to a steady rhythm.
    halo = lambda layer, strength=0.62, blur=28: N.halo(c, layer, strength, blur)

    # Sizes come off the client's BAU reference, measured rather than guessed.
    # On its 800-wide canvas the headline caps at 45 pixels, the qualifier at 19
    # and the percentage at 78 — 5.6, 2.4 and 9.8 per cent of the width. Scaled
    # to 2000 that asks for caps of 112, 48 and 195. The percentage was already
    # past its target at 320; the headline at 84 was less than half of its, which
    # is why it kept reading small. It goes to 156 on two lines, the only way to
    # reach that cap and still start inside the dark field.
    # The logo moves to the top right, which is the change that unclutters the
    # left: it was six blocks in one column. That corner measures median 38 with
    # nothing above 45, the darkest ground on the banner, and it balances the
    # offers pill diagonally below it.
    N.logo(c, y=56, width=300, x=WIDE_W - WIDE_M, align='right', colour='#FFFFFF')

    # Sizes come down one step from the BAU-reference maxima — headline 156 to
    # 132, qualifier 56 to 44, numeral 320 to 280 — which is still well above
    # where they started and leaves the gaps below room to open up.
    head = Image.new('RGBA', c.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(head)
    N.text(hd, (WIDE_M, 210), 'DAILY', 132, white, tracking=4)
    N.text(hd, (WIDE_M, 316), 'MATCHA', 132, white, tracking=4)
    halo(head, strength=0.55, blur=24)

    # White, not matcha. Below the dark field the wood sits at median 69 to 106
    # and matcha green measures 134 — close enough in tone that the label
    # vanished. The accent stays on the button, where a solid fill carries it.
    lab = Image.new('RGBA', c.size, (0, 0, 0, 0))
    N.text(ImageDraw.Draw(lab), (WIDE_M, 412), 'HEMAT HINGGA', 44, white,
           demi=True, tracking=7)
    halo(lab, strength=0.75, blur=16)

    # Below the dark field the counter is uniformly mid-tone — median 105 to 126
    # from y 400 to 900, with no darker pocket to aim for — so the numeral takes
    # a tighter, stronger halo than the lines above it. Hugging the glyphs rather
    # than spreading keeps it reading as a shadow instead of a grey cloud.
    size = 280
    cap = N.arg(size).getbbox('H')[3] - N.arg(size).getbbox('H')[1]
    num = Image.new('RGBA', c.size, (0, 0, 0, 0))
    x = WIDE_M + N.text(ImageDraw.Draw(num), (WIDE_M, 660), '25', size, white)
    N.percent(num, x, 660, cap, white)
    halo(num, strength=0.85, blur=20)

    label, fs, tr = 'SHOP NOW', 38, 6
    lw = N.text_width(label, fs, demi=True, tracking=tr)
    pw, ph = lw + 48 + 40 + 48, 108
    d.rounded_rectangle([WIDE_M, 732, WIDE_M + pw, 732 + ph], radius=ph // 2,
                        fill=MATCHA + (255,))
    N.text(d, (WIDE_M + 48, 732 + 70), label, fs, white, demi=True, tracking=tr)
    N.chevron(d, WIDE_M + 48 + lw + 22, 732 + ph / 2, 27, white, width=3)

    # The offers lose their pill and join the button's row. Beside it, over the
    # scale and its tray, the ground measures median 40 with the 90th percentile
    # at 76 — darker than the bottom-right corner the pill was covering — so the
    # type needs no box, only a light halo. That removes the one element that sat
    # on top of the product instead of in the frame, and it fills the empty
    # lower middle. Baselines straddle the button's centre at y 786 so the three
    # blocks read as one row. Set on one line at the client's request: it runs
    # x 660-1624 there, still clear of the tin above at y 616 and of the hand at
    # x 1650, on ground of median 39 with the 90th percentile at 101 — so the
    # size holds at 38 rather than having to shrink to fit the width.
    off = Image.new('RGBA', c.size, (0, 0, 0, 0))
    N.text(ImageDraw.Draw(off), (660, 800),
           'GRATIS ONGKIR   ·   VOUCHER HINGGA 15RB', 38, white, demi=True,
           tracking=5)
    halo(off, strength=0.7, blur=16)

    return N.finish(c, OUT / '7-diskon.png')


# ── 6. Category — walking packs ──────────────────────────────────────────
# After the client's reference, which stands its products on a zebra crossing
# and gives them legs. The street is generated; the packs are the client's own
# mockup photographs; the legs, arms and labels are drawn. Nothing in the frame
# is an image model's idea of a Nomukita product.
CATEGORIES = [
    ('uji-500', 'MATCHA SERIES', 1),
    ('taro', 'PREMIUM SERIES', 0),
    ('cocoa', 'EXCLUSIVE SERIES', 1),
    ('tarik', '250 GRAM SERIES', 0),
]


def category_walk():
    """Four packs crossing a Japanese street, one per category.

    The labels arc over each pack rather than sitting flat above it, which is
    the writing style of the second reference — type bent to the object it
    names. The radius is tied to pack width so all four arcs read as one curve.
    """
    c = N.canvas()
    street = Image.open(ILLUS3 / 'street-crossing.png').convert('RGB')
    c.paste(N.cover(street, W, H), (0, 0))
    d = ImageDraw.Draw(c)

    # Charcoal, not white: the sky behind the header measures median 173 to 188,
    # so the brand's primary text colour is the one that reads there.
    N.logo(c, y=96, width=300)
    # No subline: the tree canopy reaches x 480 at that height, so a centred
    # line of body copy loses its first word into the leaves, and the four arc
    # labels already name what the categories are. The reference carries no
    # subline either.
    N.text(d, (W / 2, 272), 'CATEGORY', 76, CHARCOAL, tracking=2, align='center')

    ph = 380                      # pack height, four across a 1200 canvas
    hip = 1284                    # legs start here; the feet land on the stripes
    for i, (name, label, phase) in enumerate(CATEGORIES):
        pack = Image.open(PACK / f'{name}.png').convert('RGBA')
        pack = pack.crop(pack.getbbox())
        pack = pack.resize((round(ph * pack.width / pack.height), ph),
                           Image.LANCZOS)
        cx = 168 + i * 288

        legs, ox, oy = N.walker(152, pack.width, phase=phase)
        c.alpha_composite(legs, (round(cx - ox), round(hip - oy)))
        top = hip - pack.height + 8
        c.alpha_composite(pack, (round(cx - pack.width / 2), top))

        # Radius 1.6 times the pack width: at 0.95 the arc dived so steeply that
        # its ends read as a diagonal rather than a curve. The label rides 62
        # pixels clear of the pack's shoulder, over the tree line, which is dark
        # at median 64 but carries leaf highlights to 255 — hence the halo. At 26
        # the longest label left an 18-pixel gap to its neighbour; 24 opens it
        # to 61.
        radius = pack.width * 1.6
        lab = Image.new('RGBA', c.size, (0, 0, 0, 0))
        N.arc_text(lab, (cx, top - 78 + radius), label, 24, (255, 255, 255),
                   radius, demi=True, tracking=2)
        N.halo(c, lab, strength=0.7, blur=16)

    return N.finish(c, OUT / '8-kategori.png')


if __name__ == '__main__':
    for fn in (payday, terms, heritage, category, discount, category_walk):
        img = fn()
        print(f'{fn.__name__:10s} {img.size}')
