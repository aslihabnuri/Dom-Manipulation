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


# ── slide 2 — why our matcha ──────────────────────────────────────────────
def _scrim(canvas, top, bottom, strength):
    """Soft vertical darkening so white type holds over the lighter counter."""
    h = bottom - top
    grad = Image.new('L', (1, h))
    for i in range(h):
        grad.putpixel((0, i), round(strength * (i / max(h - 1, 1)) ** 1.4))
    layer = Image.new('RGBA', (canvas.width, h), (18, 16, 14, 0))
    layer.putalpha(grad.resize((canvas.width, h)))
    canvas.alpha_composite(layer, (0, top))


def _value(canvas, d, x, y, head, sub, align='left'):
    """A claim marked by the logomark drop, mirroring the Nishio slide.

    Kept tight on purpose: the mark, the head and the line under it have to
    read as one object, or four claims look like eight loose pieces.
    """
    dot = 14
    dx = x if align == 'left' else x - dot
    N.drop(canvas, dx, y, dot, N.LOGO_BLUE)
    N.body(d, (x, y + 28), [head], 28, WHITE, align=align, weight=600)
    N.body(d, (x, y + 68), [sub], 26, (228, 227, 222), align=align)


def proof():
    c = N.canvas()
    scene = N.cover(Image.open(ASSETS / 'illus3/matcha-ritual-2.png'), W, H)
    c.paste(scene, (0, 0))
    d = ImageDraw.Draw(c)

    # The scene was reshot to hold every object in the upper two thirds, which
    # frees the counter below. That lets the claims sit in two bands framing the
    # photograph instead of stacking above it: the only ground that stays dark
    # for a full block is y 390-480 and y 1180 down, and both are used. No scrim
    # is needed now — the lower counter already falls to 23-45 luminance.
    N.logo(c, y=84, width=280, colour='#FFFFFF')
    N.text(d, (W / 2, 248), 'BEHIND THE TASTE', 74, WHITE, tracking=2,
           align='center')
    N.body(d, (W / 2, 280), ['empat hal yang sudah beres sebelum diseduh.'], 27,
           (232, 231, 226), align='center')

    right = W - MARGIN
    _value(c, d, MARGIN, 410, 'Three Gardens', 'uji, nishio, shizouka')
    _value(c, d, right, 410, 'Pure, Nothing Else', 'manisnya menyusul', align='right')
    _value(c, d, MARGIN, 1240, 'Papers In Order', 'halal, USDA, JAS organic')
    _value(c, d, right, 1240, 'Still on the Menu',
           'di ratusan kafe, lima belas tahun', align='right')

    N.text(d, (W / 2, 1500), 'POWDERED TO PERFECTION', 26, WHITE, demi=True,
           tracking=7, align='center')
    return N.finish(c, OUT / '6-brand-story-2.png')


if __name__ == '__main__':
    for fn in (story, proof):
        img = fn()
        print(f'{fn.__name__:8s} {img.size}')
