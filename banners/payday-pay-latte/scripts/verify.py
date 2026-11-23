import sys, json, numpy as np, os
from PIL import Image
out, bgp = sys.argv[1], sys.argv[2]
im = Image.open(out); a = np.asarray(im.convert('RGB')).astype(float); bx = json.load(open(out + '.boxes.json'))
x0, y0, x1, y1 = [int(v) for v in bx['pct']]
ink = (a[..., 0] < 80) & (a[..., 2] < 130) & (a[..., 1] < 60)
r = np.where(ink[y0 - 4:y1 + 4, x0:x0 + 330].sum(axis=1) > 8)[0]
print(os.path.basename(out), im.size, os.path.getsize(out), "bytes | digit height", r.max() - r.min() + 1, "px =", round(100 * (r.max() - r.min() + 1) / im.width, 2), "% of width")
bg = np.asarray(Image.open(bgp).convert('RGB')).astype(float)
def rl(c):
    c = c / 255; c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]
Lm = rl(bg); cols = dict(ink=rl(np.array([[30, 10, 62]], float))[0], ube=rl(np.array([[78, 30, 146]], float))[0])
cr = lambda p, q: (max(p, q) + 0.05) / (min(p, q) + 0.05)
for k, b in bx.items():
    X0, Y0, X1, Y1 = [int(v) for v in b]; reg = Lm[Y0:Y1, X0:X1]; lo, hi = np.percentile(reg, 5), np.percentile(reg, 95)
    c = cols['ink']; w = min(cr(c, lo), cr(c, hi))
    extra = f" | LATTE (purple) {min(cr(cols['ube'], lo), cr(cols['ube'], hi)):.1f}:1" if k == 'header' else ""
    # anything from the photo inside the text box? (object pixels = far from the local backdrop)
    obj = (np.abs(bg[Y0:Y1, X0:X1] - np.median(bg[Y0:Y1, X0:X1].reshape(-1, 3), axis=0)).max(axis=2) > 30).mean()
    print(f"  {k:9s} worst contrast {w:.1f}:1{extra} | photo objects under text {100 * obj:.1f}%")
