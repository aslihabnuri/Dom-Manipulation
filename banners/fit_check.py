"""Check a candidate copy set against the photograph before it is rendered.

Reports each block's pixel footprint and the brightest pixel beneath it, so a
line that would sit on the arm or the bamboo is caught before it ships.
"""
import sys
from PIL import Image

sys.path.insert(0, '/home/user/Dom-Manipulation/banners')
import nomukita as N

SCENE = '/home/user/Dom-Manipulation/banners/assets/illus3/matcha-ritual.png'
THRESHOLD = 120        # white type stops holding above this

_c = N.canvas()
_c.paste(N.cover(Image.open(SCENE), N.W, N.H), (0, 0))
_im = _c.convert('RGB')


def footprint(x, y, align, head, sub):
    w = max(N.comf(28, 600).getlength(head), N.comf(26, 400).getlength(sub))
    x0 = x if align == 'left' else x - w
    box = (max(0, round(x0) - 4), y, min(N.W, round(x0 + w) + 4), y + 104)
    px = list(_im.crop(box).getdata())
    peak = round(max(0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] for p in px))
    return round(w), box, peak


def report(name, headline, subtitle, values):
    L, R = N.MARGIN, N.W - N.MARGIN
    slots = [(L, 448, 'left'), (R, 448, 'right'), (L, 596, 'left'), (R, 596, 'right')]
    print(f'\n=== {name} ===')
    print(f'  {headline}')
    print(f'  {subtitle}')
    ok = True
    for (x, y, align), (head, sub) in zip(slots, values):
        w, box, peak = footprint(x, y, align, head, sub)
        good = peak <= THRESHOLD
        ok &= good
        print(f'  {head:26s} {sub:34s} {w:4d}px  x{box[0]:4d}-{box[2]:4d}  '
              f'puncak {peak:3d}  {"ok" if good else "TERANG"}')
    print('  ->', 'LOLOS' if ok else 'PERLU DIPERBAIKI')
    return ok
