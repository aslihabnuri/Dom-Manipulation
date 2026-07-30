#!/usr/bin/env python3
"""Build the two-slide Nomukita brand story banner."""

from pathlib import Path
from PIL import Image, ImageDraw

import nomukita as N
from nomukita import W, H, MARGIN, BONE, CHARCOAL, MATCHA, STEEL, RULE, KANJI_WM

OUT = Path(__file__).resolve().parent / 'out'
OUT.mkdir(exist_ok=True)
ASSETS = Path(__file__).resolve().parent / 'assets'
WHITE = (255, 255, 255)


# ── slide 1 — the story ───────────────────────────────────────────────────
def story():
    c = N.canvas()
    scene = N.cover(Image.open(ASSETS / 'illus3/brandstory-scene.png'), W, H)
    c.paste(scene, (0, 0))
    d = ImageDraw.Draw(c)

    # Placement is measured off the photograph rather than guessed. The sky from
    # y 300 to 530 on the left reads 104-113 luminance, uniform enough for white
    # type; the paving at the lower right reads 188-195, so the green button
    # holds there. The walker's legs own the centre, which stays clear.
    N.logo(c, y=84, width=280, colour='#FFFFFF')

    N.text(d, (MARGIN, 296), 'BRING THE', 88, WHITE, tracking=1)
    N.text(d, (MARGIN, 386), 'CAFE HOME', 88, WHITE, tracking=1)
    N.body(d, (MARGIN, 428), [
        'biasanya cuma ada di kafe.',
        'sekarang bisa dibawa pulang.',
    ], 29, WHITE, leading=1.45)

    right = W - MARGIN
    label, fs, tr = 'SHOP NOW', 28, 6
    lw = N.text_width(label, fs, demi=True, tracking=tr)
    pw, ph = lw + 34 + 30 + 34, 74
    px, py = right - pw, 1400
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2,
                        fill=MATCHA + (255,))
    N.text(d, (px + 34, py + 48), label, fs, WHITE, demi=True, tracking=tr)
    N.chevron(d, px + 34 + lw + 18, py + ph / 2, 19, WHITE, width=3)

    N.body(d, (MARGIN, 1478), ['powdered to perfection'], 22, (84, 82, 78))
    return N.finish(c, OUT / '5-brand-story-1.png')


# ── slide 2 — why this matcha ─────────────────────────────────────────────
def proof():
    c = N.canvas()
    d = ImageDraw.Draw(c)
    mid = W / 2

    # a very thin oversized kanji watermark, per design system §3
    d.text((mid, 560), '抹茶', font=N.jp(470), fill=(236, 235, 230), anchor='mm')

    N.logo(c, y=61, width=352)
    d.text((mid, 214), '抹茶の強み', font=N.jp(34), fill=STEEL, anchor='ms')
    N.text(d, (mid, 314), 'WHY THIS MATCHA', 76, CHARCOAL, tracking=2, align='center')

    can = Image.open(ASSETS / 'pack/can-uji.png').convert('RGBA')
    can = can.crop(can.getbbox())
    can = can.resize((round(can.width * 330 / can.height), 330), Image.LANCZOS)
    cx, cy = mid - can.width / 2, 386
    N.contact_shadow(c, can, cx, cy, blur=20, opacity=54)
    c.alpha_composite(can, (round(cx), round(cy)))

    N.rule(d, 772)

    items = [
        ('01', 'ASAL TERCANTUM',
         'uji, nishio, shizouka. daerahnya disebut di kemasan, '
         'bukan sekadar japanese matcha.'),
        ('02', 'CEREMONIAL GRADE',
         'pure organic ceremonial grade. kelas tertinggi, murni, tanpa campuran.'),
        ('03', 'TERUJI DI RATUSAN KAFE',
         '15 tahun dipakai di balik meja bar sebelum sampai ke rak dapur.'),
    ]
    y = 818
    num_x, text_x = MARGIN, MARGIN + 92
    for num, head, copy in items:
        N.text(d, (num_x, y + 24), num, 40, STEEL, demi=True)
        N.text(d, (text_x, y + 20), head, 29, CHARCOAL, demi=True, tracking=4)
        lines = N.wrap(copy, 24, W - MARGIN - text_x)
        N.body(d, (text_x, y + 48), lines, 24, CHARCOAL)
        y += 54 + len(lines) * 24 * 1.55 + 38

    N.rule(d, y - 6)

    # Certification marks are pasted from the original files, never redrawn.
    N.text(d, (mid, y + 62), 'ORGANIK BERSERTIFIKAT', 26, MATCHA, demi=True,
           tracking=6, align='center')
    marks = [Image.open(ASSETS / f'cert/{n}.png').convert('RGBA')
             for n in ('usda-organic', 'jas-organic')]
    marks = [m.resize((round(m.width * 92 / m.height), 92), Image.LANCZOS)
             for m in marks]
    gap = 64
    total = sum(m.width for m in marks) + gap * (len(marks) - 1)
    x = mid - total / 2
    for m in marks:
        c.alpha_composite(m, (round(x), round(y) + 92))
        x += m.width + gap

    N.body(d, (mid, H - MARGIN - 38), ['powdered to perfection'], 22,
           (150, 148, 143), align='center')
    return N.finish(c, OUT / '6-brand-story-2.png')


if __name__ == '__main__':
    for fn in (story, proof):
        img = fn()
        print(f'{fn.__name__:8s} {img.size}')
