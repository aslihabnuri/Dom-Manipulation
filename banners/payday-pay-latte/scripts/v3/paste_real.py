"""Register the real rectified front panels onto the AI pouches (similarity transform via SIFT), force ONE shared
scale for both pouches, and paste the real print with the scene's low-frequency light. Usage: paste_real.py in out"""
import sys, cv2, numpy as np
from PIL import Image, ImageDraw
src_p, out_p = sys.argv[1], sys.argv[2]
ai = np.asarray(Image.open(src_p).convert('RGB')).astype(np.float32); Hh, Ww, _ = ai.shape
g2 = cv2.cvtColor(ai.astype(np.uint8), cv2.COLOR_RGB2GRAY); lum = ai.mean(axis=2)
sift = cv2.SIFT_create(8000)
V2 = '/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad/payday/v2/'
def front(name):
    p = Image.open(V2 + f'front_{name}.png').convert('RGBA'); p = p.crop(p.getbbox()); p = p.crop((0, 0, min(p.width, 668), p.height))
    m = Image.new('L', p.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, p.width - 1, p.height - 1], radius=26, fill=255)
    p.putalpha(Image.fromarray(np.minimum(np.asarray(p)[..., 3], np.asarray(m)))); return p
# dark pouch silhouettes -> two largest dark blobs in the lower half
dark = ((lum < 70) & (np.arange(Hh)[:, None] > Hh * 0.45)).astype(np.uint8)
n, lab, st, cen = cv2.connectedComponentsWithStats(cv2.morphologyEx(dark, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)))
blobs = sorted([i for i in range(1, n)], key=lambda i: -st[i, cv2.CC_STAT_AREA])[:2]
blobs = sorted(blobs, key=lambda i: st[i, cv2.CC_STAT_LEFT])
res = {}
for name, i in zip(('ube', 'matcha'), blobs):
    x, y, w, h, a = st[i]; print(name, "AI silhouette", (x, y, x + w, y + h), "w/h", round(w / h, 3))
    p = front(name); pa = np.asarray(p); g1 = cv2.cvtColor(pa[..., :3], cv2.COLOR_RGB2GRAY); m1 = (pa[..., 3] > 200).astype(np.uint8) * 255
    roi = np.zeros_like(g2); roi[max(0, y - 20):y + h + 20, max(0, x - 20):x + w + 20] = 255
    k1, d1 = sift.detectAndCompute(g1, m1); k2, d2 = sift.detectAndCompute(g2, roi)
    ms = cv2.BFMatcher().knnMatch(d1, d2, k=2); good = [m for m, nn in ms if m.distance < 0.8 * nn.distance]
    s_ = np.float32([k1[m.queryIdx].pt for m in good]); d_ = np.float32([k2[m.trainIdx].pt for m in good])
    A, inl = cv2.estimateAffinePartial2D(s_, d_, method=cv2.RANSAC, ransacReprojThreshold=4)
    sc = float(np.hypot(A[0, 0], A[1, 0])); ang = float(np.degrees(np.arctan2(A[1, 0], A[0, 0])))
    print("   SIFT good", len(good), "inliers", int(inl.sum()), "scale", round(sc, 4), "angle", round(ang, 2), "-> size", round(668 * sc), "x", round(1004 * sc))
    res[name] = dict(sil=(x, y, w, h), sc=sc, ang=ang, A=A)
# one shared size with the REAL aspect ratio; side by side with a gap, bottoms on the AI pouches' base line
import json
LAY = json.loads(sys.argv[3])                       # {"W":415,"xs":[642,1087]}
W = LAY["W"]; PW0, PH0 = front('ube').size; H = round(W * PH0 / PW0); top = min(res[k]['sil'][1] for k in res) + LAY.get('dy', 0); base = top + H
print("both pouches", W, "x", H, "aspect", round(W / H, 4), "base", base)
alphas = {}; prints = {}
for name, X0 in zip(('ube', 'matcha'), LAY["xs"]):
    p = front(name).resize((W, H), Image.LANCZOS); lay = Image.new('RGBA', (Ww, Hh), (0, 0, 0, 0)); lay.paste(p, (X0, base - H))
    a4 = np.asarray(lay).astype(np.float32); prints[name] = a4[..., :3]; alphas[name] = a4[..., 3] / 255
    print(name, "at", (X0, base - H, X0 + W, base))
cover = np.maximum(alphas['ube'], alphas['matcha']) > 0.5
sil = np.isin(lab, blobs).astype(np.uint8)
blue = ((ai[..., 2] - ai[..., 0] > 45) & (ai[..., 2] > 150)).astype(np.uint8)      # AI blue tabs sticking out above
blue[:max(0, int(top) - 40)] = 0; blue[int(top) + 60:] = 0
blue[:, :LAY["xs"][0] - 20] = 0
sil = sil | blue
sil = cv2.dilate(sil, np.ones((5, 5), np.uint8))
leftover = (sil.astype(bool) & ~cv2.erode(cover.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)).astype(np.uint8)
leftover = cv2.dilate(leftover, np.ones((5, 5), np.uint8))
# fill = normalized convolution of the surrounding sky (no dark bleed), plus matched grain
known = (1 - cv2.dilate(sil, np.ones((15, 15), np.uint8))).astype(np.float32)
num = cv2.GaussianBlur(ai * known[..., None], (0, 0), 22); den = cv2.GaussianBlur(known, (0, 0), 22)[..., None]
fill = num / np.maximum(den, 1e-3) + np.random.default_rng(4).normal(0, 1.4, ai.shape[:2])[..., None]
m = cv2.GaussianBlur(leftover.astype(np.float32), (0, 0), 2.0)[..., None]
out = ai * (1 - m) + fill * m
print("AI pouch px inpainted", int(leftover.sum()))
# soft floating shadow under each pouch (they float slightly, like the reference)
sh = Image.new('L', (Ww, Hh), 0); dsh = ImageDraw.Draw(sh)
for X0 in LAY["xs"]:
    dsh.ellipse([X0 + W * 0.08, base + LAY.get("sh_gap", 26), X0 + W * 0.92, base + LAY.get("sh_gap", 26) + 30], fill=255)
shm = cv2.GaussianBlur(np.asarray(sh).astype(np.float32) / 255, (0, 0), 16)[..., None] * LAY.get("sh_op", 0.28)
out = out * (1 - shm) + np.array([70, 60, 90], np.float32) * shm
for name in ('ube', 'matcha'):
    rgb, al = prints[name], alphas[name]; rl = rgb.mean(axis=2)
    valid = ((al > 0.98) & (rl < 70) & (lum < 75)).astype(np.float32)
    num = cv2.GaussianBlur(lum * valid, (0, 0), 30); den = cv2.GaussianBlur(rl * valid, (0, 0), 30); ws = cv2.GaussianBlur(valid, (0, 0), 30)
    ratio = np.clip(np.where(ws > 0.02, (num + 2) / (den + 2), 1.0), 0.8, 1.25)
    keep = np.clip((rl - 70) / 70.0, 0, 1); ratio = ratio * (1 - keep) + np.maximum(ratio, 0.97) * keep
    P = np.clip(rgb * ratio[..., None], 0, 255)
    a = cv2.GaussianBlur(cv2.erode((al * 255).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32) / 255, (0, 0), 0.7)[..., None]
    out = out * (1 - a) + P * a
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(out_p)
