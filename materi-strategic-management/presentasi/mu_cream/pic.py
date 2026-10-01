"""Crop a photo to an exact box ratio and optionally composite it onto the slide background
with soft fades, so nothing is ever stretched by the viewer.
usage: pic.py src x y w h fades bg out [fx fy]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
PPI = 144.0
src, x, y, w, h, fades, bg, out = sys.argv[1:9]
fx = float(sys.argv[9]) if len(sys.argv) > 9 else 0.5
fy = float(sys.argv[10]) if len(sys.argv) > 10 else 0.5
ff = float(sys.argv[11]) if len(sys.argv) > 11 else 0.25
x, y, w, h = map(float, (x, y, w, h))
pw, ph = int(round(w * PPI)), int(round(h * PPI))
im = Image.open(src).convert('RGB')
iw, ih = im.size
r = pw / ph
if iw / ih > r:
    cw = int(round(ih * r)); ch = ih
else:
    cw = iw; ch = int(round(iw / r))
cx = int(round((iw - cw) * fx)); cy = int(round((ih - ch) * fy))
im = im.crop((cx, cy, cx + cw, cy + ch)).resize((pw, ph), Image.LANCZOS)
if fades != '-':
    bgim = Image.open(bg).convert('RGB')
    bx, by = int(round(x * PPI)), int(round(y * PPI))
    base = bgim.crop((bx, by, bx + pw, by + ph))
    a = np.ones((ph, pw), dtype=np.float32)
    fl = max(1, int(pw * ff)); ft = max(1, int(ph * ff))
    xs = np.arange(pw, dtype=np.float32); ys = np.arange(ph, dtype=np.float32)
    if 'l' in fades: a = np.minimum(a, np.clip(xs / fl, 0, 1)[None, :])
    if 'r' in fades: a = np.minimum(a, np.clip((pw - 1 - xs) / fl, 0, 1)[None, :])
    if 't' in fades: a = np.minimum(a, np.clip(ys / ft, 0, 1)[:, None])
    if 'b' in fades: a = np.minimum(a, np.clip((ph - 1 - ys) / ft, 0, 1)[:, None])
    a = a * a * (3 - 2 * a)
    mask = Image.fromarray((a * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(2))
    im = Image.composite(im, base, mask)
im.save(out, 'JPEG', quality=88, optimize=True)
print(out, pw, ph)
