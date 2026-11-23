import sys, json, numpy as np, os, cv2
from PIL import Image
out, bgp = sys.argv[1], sys.argv[2]
im = Image.open(out); a = np.asarray(im.convert('RGB')).astype(float); bx = json.load(open(out + '.boxes.json'))
x0, y0, x1, y1 = [int(v) for v in bx['35%']]
ink = (a[..., 0] < 80) & (a[..., 2] < 130) & (a[..., 1] < 60)
r = np.where(ink[y0 - 4:y1 + 4, x0:x0 + 330].sum(axis=1) > 8)[0]
print(os.path.basename(out), im.size, os.path.getsize(out), "bytes | digit height", r.max() - r.min() + 1, "px =", round(100 * (r.max() - r.min() + 1) / im.width, 2), "% of width")
bg = np.asarray(Image.open(bgp).convert('RGB')).astype(np.float32)
def rl(c):
    c = c / 255; c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]
Lm = rl(bg); ink_l = rl(np.array([[30, 10, 62]], float))[0]; ube_l = rl(np.array([[52, 14, 108]], float))[0]
cr = lambda p, q: (max(p, q) + 0.05) / (min(p, q) + 0.05)
obj = (np.abs(bg - cv2.GaussianBlur(bg, (0, 0), 60)).max(axis=2) > 18).astype(np.uint8)
obj = cv2.morphologyEx(obj, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool)
for k, b in bx.items():
    if k == 'logo' or k.startswith('pouch'): continue
    X0, Y0, X1, Y1 = [int(round(v)) for v in b]; reg = Lm[Y0:Y1, X0:X1]; lo, hi = np.percentile(reg, 5), np.percentile(reg, 95)
    c = min(cr(ink_l, lo), cr(ink_l, hi)); extra = f" | purple {min(cr(ube_l, lo), cr(ube_l, hi)):.1f}:1" if 'LATTE' in k else ""
    under = obj[Y0:Y1, X0:X1].mean(); pad = 20; near = obj[max(0, Y0 - pad):Y1 + pad, max(0, X0 - pad):X1 + pad].mean()
    print(f"  {k:10s} contrast {c:.1f}:1{extra} | photo under text {100 * under:.1f}% | within 20 px {100 * near:.1f}%")
