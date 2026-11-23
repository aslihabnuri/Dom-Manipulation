"""Cut-out foreground (old lilac planets removed) over the reference-matched background.
Usage: comp.py FG BG out W H shift remove_components... [circle=cx,cy,r]"""
import sys, numpy as np, cv2
from PIL import Image
fgp, bgp, out, W, H, shift = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
rm = [a for a in sys.argv[7:] if not a.startswith(('circle=', 'rect='))]; rects = [a[5:] for a in sys.argv[7:] if a.startswith('rect=')]; circ = [a[7:] for a in sys.argv[7:] if a.startswith('circle=')]
f = np.asarray(Image.open(fgp).convert('RGBA')).copy(); A = f[..., 3]
k, lab, st, _ = cv2.connectedComponentsWithStats((A > 40).astype(np.uint8))
for r in rm:   # remove the component containing point x,y
    x, y = map(int, r.split(',')); i = lab[y, x]
    if i: f[lab == i, 3] = 0; print("removed component at", (x, y), "area", st[i, 4])
rgb = f[..., :3].astype(np.int16); sat = rgb.max(axis=2) - rgb.min(axis=2)
for c in circ:
    cx, cy, r = map(int, c.split(',')); yy, xx = np.mgrid[:f.shape[0], :f.shape[1]]
    m = ((xx - cx) ** 2 + (yy - cy) ** 2 < (r + 6) ** 2) & (sat < 60)
    f[m, 3] = 0; print("removed pale planet px", int(m.sum()))
for r in rects:
    x0, y0, x1, y1 = map(int, r.split(',')); sub = f[y0:y1, x0:x1]; m = sat[y0:y1, x0:x1] < 60
    sub[m, 3] = 0; print("removed pale px in rect", int(m.sum()))
fg = Image.fromarray(f, 'RGBA'); s = W / fg.width; fg = fg.resize((W, round(fg.height * s)), Image.LANCZOS)
top = (fg.height - H) // 2; fg = fg.crop((0, top, W, top + H))
bg = Image.open(bgp).convert('RGB').resize((W, H), Image.LANCZOS).convert('RGBA')
bg.alpha_composite(fg, (-shift, 0)); bg.convert('RGB').save(out); print("saved", out)
