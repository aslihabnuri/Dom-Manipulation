import sys, json, numpy as np, os
from PIL import Image
out, bgp = sys.argv[1], sys.argv[2]
im = Image.open(out); a = np.asarray(im.convert('RGB')).astype(float); bx = json.load(open(out + '.boxes.json'))
x0, y0, x1, y1 = [int(v) for v in bx['35%']]
ink = (a[..., 0] < 80) & (a[..., 2] < 130) & (a[..., 1] < 60)
r = np.where(ink[y0 - 4:y1 + 4, x0:x0 + 330].sum(axis=1) > 8)[0]
print(os.path.basename(out), im.size, os.path.getsize(out), "bytes | digit height", r.max() - r.min() + 1, "px =", round(100 * (r.max() - r.min() + 1) / im.width, 2), "% of width")
bg = np.asarray(Image.open(bgp).convert('RGB')).astype(float)
def rl(c):
    c = c / 255; c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]
Lm = rl(bg); ink_l = rl(np.array([[30, 10, 62]], float))[0]; ube_l = rl(np.array([[78, 30, 146]], float))[0]
cr = lambda p, q: (max(p, q) + 0.05) / (min(p, q) + 0.05)
for k, b in bx.items():
    X0, Y0, X1, Y1 = [int(round(v)) for v in b]; reg = Lm[Y0:Y1, X0:X1]; lo, hi = np.percentile(reg, 5), np.percentile(reg, 95)
    c = ube_l if k == 'LATTE' else ink_l
    med = np.median(bg[Y0:Y1, X0:X1].reshape(-1, 3), axis=0); obj = (np.abs(bg[Y0:Y1, X0:X1] - med).max(axis=2) > 30).mean()
    # clearance: nearest photo object around the box
    pad = 24; reg2 = bg[max(0, Y0 - pad):Y1 + pad, max(0, X0 - pad):X1 + pad]; near = (np.abs(reg2 - med).max(axis=2) > 30).mean()
    print(f"  {k:11s} contrast {min(cr(c, lo), cr(c, hi)):.1f}:1 | photo under text {100 * obj:.1f}% | photo within 24 px {100 * near:.1f}%")
