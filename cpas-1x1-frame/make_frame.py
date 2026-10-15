"""Generate the static layers for a 1:1 "taped photo card" frame.

Turns a 9:16 video into a 1080x1080 ad: the video sits on the left as a
photo card held by two washi tapes, the brand logo sits on the right.

Outputs (1080x1080):
  bg.png    - RGB background: solid colour + soft card shadow + logo
  tapes.png - RGBA overlay: two washi-tape strips over the card corners
              (skipped with --no-tapes)
  card.json - card rectangle the video must be scaled/placed into

Usage:
  python3 make_frame.py --logo logo.png --out frame --bg '#F1EBE2' --tape '#7A2E3B' [--no-tapes]
  ./render.sh frame input_9x16.mp4 output_1x1.mp4
"""
import argparse
import json
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

S = 1080  # canvas size
SS = 4    # supersampling factor for the tape drawing


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def make_tape(length, width, color, dot_color, seed, angle):
    """Return an RGBA washi-tape strip (with its own soft shadow), rotated."""
    rnd = random.Random(seed)
    L, W = length * SS, width * SS
    pad = 8 * SS
    cw, ch = L + 2 * pad, W + 2 * pad

    # outline: straight-ish long edges, torn zigzag short ends
    def torn_end(x0, top_to_bottom):
        # irregular hand-torn edge: uneven tooth spacing/depth plus a slant
        pts = []
        slant = rnd.uniform(-3.0, 3.0) * SS
        y, i = 0.0, 0
        while y < W:
            tooth = (1 if i % 2 else -1) * rnd.uniform(0.4, 2.8) * SS
            drift = rnd.uniform(-1.0, 1.0) * SS
            pts.append((x0 + tooth + drift + slant * (y / W - 0.5), y))
            y += rnd.uniform(2.2, 5.5) * SS
            i += 1
        pts.append((x0 + slant * 0.5, W))
        return pts if top_to_bottom else pts[::-1]

    top = [(L * t / 6, rnd.uniform(-0.35, 0.35) * SS) for t in range(1, 6)]
    bottom = [(L * t / 6, W + rnd.uniform(-0.35, 0.35) * SS) for t in range(5, 0, -1)]
    right = torn_end(L, True)
    left = torn_end(0, False)
    poly = [(x + pad, y + pad) for x, y in left[-1:] + top + right + bottom + left]

    mask = Image.new('L', (cw, ch), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)

    r, g, b = hex_rgb(color)
    tape = Image.new('RGBA', (cw, ch), (r, g, b, 0))
    body = Image.new('RGBA', (cw, ch), (r, g, b, 240))

    # very light paper streaks so the tape doesn't read as a flat vector block
    streaks = Image.new('L', (cw, ch), 0)
    sd = ImageDraw.Draw(streaks)
    for _ in range(26):
        y = rnd.uniform(pad, pad + W)
        sd.line([(pad, y), (pad + L, y + rnd.uniform(-3, 3) * SS)],
                fill=rnd.randint(10, 26), width=rnd.randint(1, 3) * SS // 2)
    streaks = streaks.filter(ImageFilter.GaussianBlur(SS))
    light = Image.new('RGBA', (cw, ch), (255, 255, 255, 0))
    light.putalpha(streaks)
    body = Image.alpha_composite(body, light)

    # staggered polka dots
    dr, dg, db = hex_rgb(dot_color)
    dots = Image.new('RGBA', (cw, ch), (dr, dg, db, 0))
    dd = ImageDraw.Draw(dots)
    sx, sy, rad = 10.5 * SS, 9.0 * SS, 1.55 * SS
    row = 0
    y = pad - sy
    while y < ch + sy:
        x = pad - sx + (sx / 2 if row % 2 else 0)
        while x < cw + sx:
            jx, jy = rnd.uniform(-0.3, 0.3) * SS, rnd.uniform(-0.3, 0.3) * SS
            dd.ellipse([x + jx - rad, y + jy - rad, x + jx + rad, y + jy + rad],
                       fill=(dr, dg, db, 235))
            x += sx
        y += sy
        row += 1
    body = Image.alpha_composite(body, dots)

    # torn ends: thin pale fibre fringe
    fringe = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fringe)
    for end in (right, left):
        fd.line([(x + pad, y + pad) for x, y in end], fill=(250, 244, 236, 150),
                width=int(1.1 * SS))
    body = Image.alpha_composite(body, fringe)

    tape = Image.composite(body, tape, mask)
    tape = tape.resize((cw // SS, ch // SS), Image.LANCZOS)
    tape = tape.rotate(angle, resample=Image.BICUBIC, expand=True)

    # soft contact shadow under the tape
    a = tape.getchannel('A')
    sh = Image.new('RGBA', tape.size, (40, 22, 20, 0))
    sh.putalpha(a.point(lambda v: int(v * 0.20)).filter(ImageFilter.GaussianBlur(2.2)))
    out = Image.new('RGBA', (tape.width + 6, tape.height + 6), (0, 0, 0, 0))
    out.alpha_composite(sh, (3, 4))
    out.alpha_composite(tape, (1, 1))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--logo', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--bg', default='#F1EBE2')
    ap.add_argument('--tape', default='#7A2E3B')
    ap.add_argument('--dots', default='#F6EFE6')
    ap.add_argument('--card', default='46,136,456,810', help='x,y,w,h')
    ap.add_argument('--logo-w', type=int, default=360)
    ap.add_argument('--logo-center', default='815,540')
    ap.add_argument('--card-shadow', type=float, default=0.22)
    ap.add_argument('--seed', type=int, default=7)
    ap.add_argument('--no-tapes', action='store_true', help='plain card, no washi tapes')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    cx, cy, cw, ch = (int(v) for v in a.card.split(','))
    bg = Image.new('RGBA', (S, S), hex_rgb(a.bg) + (255,))

    if a.card_shadow > 0:
        sh = Image.new('RGBA', (S, S), (45, 28, 24, 0))
        m = Image.new('L', (S, S), 0)
        ImageDraw.Draw(m).rectangle([cx + 2, cy + 10, cx + cw - 3, cy + ch + 8],
                                    fill=int(255 * a.card_shadow))
        sh.putalpha(m.filter(ImageFilter.GaussianBlur(16)))
        bg.alpha_composite(sh)

    logo = Image.open(a.logo).convert('RGBA')
    logo = logo.crop(logo.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox())
    lw = a.logo_w
    lh = round(logo.height * lw / logo.width)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    lx, ly = (int(v) for v in a.logo_center.split(','))
    bg.alpha_composite(logo, (lx - lw // 2, ly - lh // 2))
    bg.convert('RGB').save(os.path.join(a.out, 'bg.png'))

    if not a.no_tapes:
        tapes = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        for (tx, ty), seed, ang in (((cx + cw - 12, cy + 8), a.seed, -45),
                                    ((cx + 24, cy + ch - 2), a.seed + 1, -44)):
            t = make_tape(138, 40, a.tape, a.dots, seed, ang)
            tapes.alpha_composite(t, (tx - t.width // 2, ty - t.height // 2))
        tapes.save(os.path.join(a.out, 'tapes.png'))

    with open(os.path.join(a.out, 'card.json'), 'w') as f:
        json.dump({'x': cx, 'y': cy, 'w': cw, 'h': ch}, f)


if __name__ == '__main__':
    main()
