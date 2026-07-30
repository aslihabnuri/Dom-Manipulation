#!/usr/bin/env python3
"""Build the two-slide Nomukita brand story banner."""

from pathlib import Path
from PIL import Image, ImageDraw

import nomukita as N
from nomukita import W, H, MARGIN, MATCHA

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


# An earlier four-corner layout for this slide has been dropped along with its
# scene. It stood on a photograph whose tin carried invented label text — "Pue
# Organis Ceremoertia" over three fabricated kanji — and that cannot be repaired
# in place, only reshot. Any revival of that layout needs a fresh scene with no
# product text in it at all.


# Cut from the generated frame before scaling. The reference frames its pitcher
# large — the mouth spans about 41 per cent of the width — and drops the cascade
# onto the shadow inside it, so the crop matters as much as the type. Centring
# the square frame left the mouth at 28 per cent and an interior only 335 across,
# too narrow for four lines with any visible step. This window brings it to 37
# per cent and 447 across. Its bounds are set by what has to stay whole: the rim
# tops out at y 455 and the glass foot bottoms at y 1790, so the height cannot go
# below about 1360, which fixes the width at 1150 for 3:4.
POUR_CROP = (600, 400, 1750, 1933)


def proof():
    """Product value after the supplied reference: four stepped lines set inside
    the vessel itself.

    Nothing here is placed by eye. The rim is walked inward row by row to find
    where the interior actually starts — it burns past 200 luminance while the
    shadow inside holds under 40 — and the four lines are then spread from the
    leftmost the top line allows to the rightmost the bottom line allows. That
    yields the 39-pixel step rather than a guessed indent, and it is why the
    step is even: the mouth is an ellipse, so the top and bottom lines are the
    constrained ones and the middle two have room to spare.

    The pouch is drawn, not generated. The scene this replaced carried an AI tin
    whose label read "Pore Organic Ceremenial Grade" under three lines of
    invented kanji, which is the failure the design system warns about and the
    reason no Nomukita product is ever left to the model.
    """
    c = N.canvas()
    frame = Image.open(ASSETS / 'illus3/matcha-pour-3.png').convert('RGB')
    c.paste(frame.crop(POUR_CROP).resize((W, H), Image.LANCZOS), (0, 0))
    _scrim(c, 1290, H, 120)          # only to hold the footer over the marble
    d = ImageDraw.Draw(c)

    # The room behind the hand is the only part of the top strip that stays dark
    # — the pitcher rim runs through the centre at 243 and the left at 255.
    N.logo(c, y=92, width=248, align='right', x=W - MARGIN, colour='#FFFFFF')

    # The header goes on the marble because that is the one block big enough to
    # hold it: the top strip is dark only in the 267 pixels behind the hand, too
    # narrow for display type, while the marble holds under 110 luminance from
    # y 820 to y 1290 and falls to 71 where these two lines sit. Right-aligning
    # it under the logo also puts weight back on the side the pouch used to
    # occupy, so the cascade on the left is not left carrying the frame alone.
    right = W - MARGIN
    N.text(d, (right, 912), 'BEHIND', 76, WHITE, tracking=2, align='right')
    N.text(d, (right, 996), 'THE TASTE', 76, WHITE, tracking=2, align='right')
    N.body(d, (right, 1060), ['empat hal di balik rasanya.'], 27,
           (232, 231, 226), align='right')

    # The certificates are named rather than badged: the brief asks for USDA and
    # JAS, and two seals on the marble would undo the clean layout. Line three is
    # not what constrains the block anyway — the ellipse pinches the first and
    # last lines, so the middle two are free to say more.
    lines = ['From three gardens.', 'Nothing added after.',
             'Halal, USDA, JAS.', 'Still on cafe menus.']
    for i, (line, x) in enumerate(zip(lines, (172, 212, 251, 291))):
        N.body(d, (x, 280 + i * 48), [line], 26, WHITE)

    N.text(d, (W / 2, 1512), 'POWDERED TO PERFECTION', 24, WHITE, demi=True,
           tracking=7, align='center')
    return N.finish(c, OUT / '6-brand-story-2.png')


if __name__ == '__main__':
    for fn in (story, proof):
        img = fn()
        print(f'{fn.__name__:8s} {img.size}')
