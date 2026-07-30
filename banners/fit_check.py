"""Place and verify the cascade that sits inside the pitcher on brand story 2.

Type over a photograph is only safe if the ground under every glyph is measured,
so nothing here is positioned by eye. The pitcher mouth is an ellipse whose
glazed rim burns past 200 luminance while the shadow inside holds under 40, so
the rim is walked inward row by row to find where the interior really starts.
The lines are then spread from the leftmost the top line allows to the rightmost
the bottom line allows — that is what sets the step, and it is why the step comes
out even: the ellipse pinches the first and last lines while the middle two have
room to spare.

Run directly to re-derive the numbers hard-coded in brandstory.proof():

    python3 fit_check.py
"""
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import nomukita as N
from brandstory import POUR_CROP

SCENE = Path(__file__).resolve().parent / 'assets/illus3/matcha-pour-3.png'
RIM = 140              # the glaze on the rim burns out well above this
GROUND = 120           # white type stops holding over ground brighter than this
PAD = 12               # keep type this far clear of the rim


def frame():
    """The photograph exactly as the banner crops it."""
    src = Image.open(SCENE).convert('RGB')
    return src.crop(POUR_CROP).resize((N.W, N.H), Image.LANCZOS)


def interior(im, rows=range(60, 620), cols=(60, 780)):
    """Per-row span between the rim's inner edges, walking in from the left."""
    span = {}
    for y in rows:
        bright = [x for x in range(*cols)
                  if _lum(im.getpixel((x, y))) > RIM]
        prev = None
        for x in bright:
            if prev is not None and x - prev > 25:
                if x - prev > 100:          # a gap this wide is the mouth, not a vein
                    span[y] = (prev + 1, x - 1)
                break
            prev = x
    return span


def _lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def bounds(span, lines, size, y0, dy):
    """Leftmost and rightmost x each line can take, or None if one falls out."""
    out = []
    for i, line in enumerate(lines):
        y = y0 + i * dy
        top, bot = round(y - size * 0.82), round(y + size * 0.30)
        if top not in span or bot not in span:
            return None
        left = max(span[top][0], span[bot][0]) + PAD
        right = min(span[top][1], span[bot][1]) - PAD
        w = N.comf(size, 400).getlength(line)
        if left + w > right:
            return None
        out.append((left, right - w, w))
    return out


def spread(limits):
    """Even step from the top line's leftmost to the bottom line's rightmost."""
    lo, hi = limits[0][0], limits[-1][1]
    if hi <= lo:
        return None
    step = (hi - lo) / (len(limits) - 1)
    xs = [lo + i * step for i in range(len(limits))]
    if any(not (l - 0.5 <= x <= r + 0.5) for x, (l, r, _) in zip(xs, limits)):
        return None
    return round(step), [round(x) for x in xs]


def solve(lines, sizes=(34, 32, 30, 28, 26, 24), floor=24, ratio=1.4):
    """Largest type whose step still reads as a cascade.

    Size and step trade against each other — bigger type leaves less room to
    drift, and this vessel will happily fit 34pt at a 12-pixel step, which reads
    as a ragged left edge rather than a deliberate stagger. The reference steps
    about 2.3 times its type size; 1.4 is the floor where the gesture still
    holds, and on this crop that is what settles the block at 26 and 40.
    """
    im = frame()
    span = interior(im)
    for size in sizes:
        if size < floor:
            break
        best = None
        for dy in (48, 50, 52, 56, 60, 64):
            for y0 in range(180, 360, 5):
                limits = bounds(span, lines, size, y0, dy)
                if not limits:
                    continue
                got = spread(limits)
                if got and got[0] >= size * ratio and (best is None or got[0] > best[0]):
                    best = (got[0], y0, dy, got[1])
        if best:
            return {'size': size, 'step': best[0], 'y0': best[1],
                    'dy': best[2], 'x': best[3]}
    return None


def verify(im, lines, size, y0, dy, xs):
    """Brightest pixel under each line, against the real composite."""
    ok = True
    for i, (line, x) in enumerate(zip(lines, xs)):
        y = y0 + i * dy
        w = N.comf(size, 400).getlength(line)
        box = (x - 4, round(y - size * 0.82) - 3, round(x + w) + 4,
               round(y + size * 0.30) + 3)
        peak = round(max(_lum(p) for p in im.crop(box).get_flattened_data()))
        good = peak <= GROUND
        ok &= good
        print(f'  {line:22s} x{box[0]:4d}-{box[2]:4d}  puncak {peak:3d}  '
              f'{"ok" if good else "TERANG"}')
    print('  ->', 'LOLOS' if ok else 'PERLU DIPERBAIKI')
    return ok


if __name__ == '__main__':
    lines = ['From three gardens.', 'Nothing added after.',
             'Halal, USDA, JAS.', 'Still on cafe menus.']
    got = solve(lines)
    if not got:
        sys.exit('no placement fits the vessel — shorten the copy or widen the crop')
    print(f"size {got['size']}  y0 {got['y0']}  dy {got['dy']}  "
          f"step {got['step']}  x {got['x']}")
    verify(frame(), lines, got['size'], got['y0'], got['dy'], got['x'])
