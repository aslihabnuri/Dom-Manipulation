"""Build the 1080x1620 (2:3) backdrop from the 1:1 v2 scene: lift the top-left ube out, extend the
gradient upward, place the scene in the lower part, and put the ube back in the new top-left corner."""
import cv2, numpy as np
from PIL import Image
CW, CH = 1080, 1620
DARK = float(__import__("os").environ.get("DARK", "0.85"))
S = 0.64                      # scene scale (2000 -> 1280)
OX, OY = -71, CH - int(2000 * S)
sc = np.asarray(Image.open('scene2_clean.png').convert('RGB')).astype(np.float32)
H, W, _ = sc.shape
rng = np.random.default_rng(21)

def row_model(img, y0, y1, xs):
    m = np.zeros((y1 - y0, W, 3), np.float32); X = np.arange(W)
    for i, y in enumerate(range(y0, y1)):
        for c in range(3):
            a, b = np.polyfit(xs, img[y, xs, c], 1); m[i, :, c] = a * X + b
    return cv2.GaussianBlur(m, (0, 0), sigmaX=1, sigmaY=6)

# 1) top-left ube mask
y1 = 470
m = row_model(sc, 0, y1, np.r_[640:1000])
d = np.abs(sc[:y1] - m).max(axis=2)
u = np.zeros((y1, W), np.uint8); u[:, :520] = d[:, :520] > 16
n, lab, st, _ = cv2.connectedComponentsWithStats(u); u = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
u = cv2.morphologyEx(u, cv2.MORPH_CLOSE, np.ones((21, 21), np.uint8))
cnts, _ = cv2.findContours(u, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE); cv2.drawContours(u, cnts, -1, 1, -1)
ys, xs = np.where(u > 0); bx1, by1 = xs.max() + 4, ys.max() + 4
ube_rgba = np.dstack([sc[:by1, :bx1], cv2.GaussianBlur(u[:by1, :bx1].astype(np.float32), (0, 0), 1.4) * 255]).astype(np.uint8)
# 2) remove it from the scene
grow = cv2.GaussianBlur(cv2.dilate(u, np.ones((17, 17), np.uint8)).astype(np.float32), (0, 0), 5)[..., None]
sc[:y1] = sc[:y1] * (1 - grow) + (m + rng.normal(0, 1.4, m.shape[:2])[..., None]) * grow
scene = Image.fromarray(np.clip(sc, 0, 255).astype(np.uint8)).resize((int(W * S), int(H * S)), Image.LANCZOS)
sa = np.asarray(scene).astype(np.float32)
# 3) canvas: extend the gradient above the scene (per-column top colour + vertical slope of the first rows)
cv = np.zeros((CH, CW, 3), np.float32)
x0s = -OX; cols = np.clip(np.arange(CW) + x0s, 0, sa.shape[1] - 1)
top = cv2.GaussianBlur(sa[0:6, cols].mean(axis=0)[None], (0, 0), 45)[0]   # colour at the scene's top edge, smoothed across x
slope = (sa[60:80, cols].mean(axis=0) - sa[0:20, cols].mean(axis=0)) / 60.0
slope = np.repeat(slope.mean(axis=0, keepdims=True), CW, axis=0)   # one vertical slope for the whole width
for y in range(OY):
    cv[y] = top - slope * (OY - y) * DARK
cv[:OY] = cv2.GaussianBlur(cv[:OY], (0, 0), 3) + rng.normal(0, 1.3, (OY, CW, 1))
# paste scene
sx0 = max(0, -OX); dx0 = max(0, OX); wpx = min(CW - dx0, sa.shape[1] - sx0)
cv[OY:OY + sa.shape[0], dx0:dx0 + wpx] = sa[:CH - OY, sx0:sx0 + wpx]
if OX > 0:   # strip at the left edge not covered by the scene: extend its first column
    cv[OY:, :OX] = sa[:CH - OY, :1]
# soft seam at the scene top
for k in range(18):
    t = k / 18.0; y = OY + k
    cv[y] = cv[OY - 1] * (1 - t) + cv[y] * t
out = Image.fromarray(np.clip(cv, 0, 255).astype(np.uint8)).convert('RGBA')
# 4) the ube back in the new top-left corner
ube = Image.fromarray(ube_rgba, 'RGBA'); sc_u = S * 0.95
ube = ube.resize((int(ube.width * sc_u), int(ube.height * sc_u)), Image.LANCZOS)
out.alpha_composite(ube, (-30, 0))
out.convert('RGB').save('portrait_bg.png')
print("scene at", OX, OY, "size", scene.size, "| ube", ube.size)
