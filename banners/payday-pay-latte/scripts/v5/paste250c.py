"""Real 250 g pouches on the AI podium, from measured AI body rectangles.
1) the whole AI pouch area (bodies + ropes, above the base) is rebuilt from the scene behind it: per row, a linear
   blend of the sky/podium just left and just right of the pouch pair (+ matched grain);
2) the real mockups are placed at the AI body width, bottoms on the AI base line (same podium contact),
   both identical size. Usage: paste250c.py in out '{"ube":[x0,x1],"matcha":[x0,x1],"top":y,"base":y,"rope":x}'"""
import sys, cv2, numpy as np, json
from PIL import Image
ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
src, dst, G = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
ai = np.asarray(Image.open(src).convert('RGB')).astype(np.float32); H, W, _ = ai.shape
L0 = G["rope"] - 10; R1 = G["matcha"][1] + 10; top, base = G["top"], G["base"]
lc = np.median(ai[:, max(0, L0 - 40):L0 - 8], axis=1); rc = np.median(ai[:, R1 + 8:min(W, R1 + 40)], axis=1)
lc = cv2.GaussianBlur(lc[:, None], (0, 0), sigmaX=0.1, sigmaY=6)[:, 0]; rc = cv2.GaussianBlur(rc[:, None], (0, 0), sigmaX=0.1, sigmaY=6)[:, 0]
t = np.clip((np.arange(W) - L0) / (R1 - L0), 0, 1)[None, :, None]
model = lc[:, None] * (1 - t) + rc[:, None] * t
g = ai - cv2.GaussianBlur(ai, (0, 0), 1.5); gstd = float(g[top - 120:top - 20, L0:R1].std())
model += np.random.default_rng(5).normal(0, gstd, (H, W, 1))
m = np.zeros((H, W), np.float32); m[top - 12:base + 3, L0:R1] = 1
mm = cv2.GaussianBlur(m, (0, 0), 3)[..., None]
out = ai * (1 - mm) + model * mm
# contact shadow on the podium under each real pouch (the AI one was erased with the pouches above the base)
BW = min(G["ube"][1] - G["ube"][0], G["matcha"][1] - G["matcha"][0]); sc = BW / 755.0
def real(name):
    p = Image.open(f"{ROOT}/assets/nomukita-{name}-250g.png").convert("RGBA"); a = np.asarray(p).astype(np.int16)
    al = a[..., 3].copy(); al[(al < 250) & (a[..., :3].max(axis=2) < 120)] = 0; a[..., 3] = al
    return Image.fromarray(a.astype(np.uint8), "RGBA")
placed = []
for name, key in (("ube", "ube"), ("matcha-latte", "matcha")):
    x0, x1 = G[key]; cx = (x0 + x1) / 2
    sh = np.zeros((H, W), np.float32); cv2.ellipse(sh, (int(cx), int(base + 1)), (int(BW * 0.53), int(max(8, BW * 0.03))), 0, 0, 360, 1, -1)
    sh = cv2.GaussianBlur(sh, (0, 0), max(5, BW * 0.025))[..., None] * 0.55
    out = out * (1 - sh) + np.array([62, 46, 92], np.float32) * sh
    amb = np.zeros((H, W), np.float32); cv2.ellipse(amb, (int(cx), int(base + 4)), (int(BW * 0.62), int(BW * 0.07)), 0, 0, 360, 1, -1)
    amb = cv2.GaussianBlur(amb, (0, 0), BW * 0.06)[..., None] * 0.22
    out = out * (1 - amb) + np.array([70, 55, 100], np.float32) * amb
o = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
for name, key in (("ube", "ube"), ("matcha-latte", "matcha")):
    x0, x1 = G[key]; cx = (x0 + x1) / 2
    p = real(name); p = p.resize((round(p.width * sc), round(p.height * sc)), Image.LANCZOS)
    ox, oy = round(cx - 527.5 * sc), round(base - 782 * sc); o.alpha_composite(p, (ox, oy)); placed.append((ox, oy, ox + p.width, oy + p.height))
o.convert("RGB").save(dst); json.dump(dict(placed=placed, body=BW, base=base), open(dst + ".json", "w"))
print("body", BW, "x", round(750 * sc), "| placed", placed, "| grain", round(gstd, 2))
