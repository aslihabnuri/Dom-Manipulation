"""Paste the REAL 1000 g mockups (Drive: Premium series Ube, Exclusive series matcha latte) over the AI-drawn
pouches of BAG_K.png. Uniform scale only (no distortion); AI pixels are kept where the cup dome, straw or
yams are in front, and below the fade line where the pouch is hidden anyway."""
import cv2, numpy as np
from PIL import Image, ImageDraw
ai = np.asarray(Image.open('BAG_K.png').convert('RGB')).astype(np.float32)
Hh, Ww, _ = ai.shape
lum_ai = ai.mean(axis=2)
S = 0.646
PLACE = {'matcha': (953, 802), 'ube': (556, 802)}        # bbox top-left of each real pouch
FADE0, FADE1 = 1416, 1436

def real_layer(name):
    p = Image.open(f'mock_{name}_1000.png').convert('RGBA'); p = p.crop(p.getbbox())
    w, h = round(p.width * S), round(p.height * S)
    p = p.resize((w, h), Image.LANCZOS)
    lay = Image.new('RGBA', (Ww, Hh), (0, 0, 0, 0)); lay.paste(p, PLACE[name])
    a = np.asarray(lay).astype(np.float32)
    return a[..., :3], a[..., 3] / 255.0

def poly_mask(pts):
    m = Image.new('L', (Ww, Hh), 0); ImageDraw.Draw(m).polygon(pts, fill=255); return np.asarray(m) > 0

dome = poly_mask([(1066, 1530), (1078, 1486), (1105, 1444), (1140, 1427), (1168, 1415), (1200, 1405), (1240, 1401),
                  (1300, 1406), (1338, 1428), (1375, 1462), (1396, 1496), (1404, 1530), (1404, 1620), (1066, 1620)])
straw = poly_mask([(1251, 1262), (1290, 1264), (1264, 1424), (1224, 1424)])
ys = np.arange(Hh)[:, None]
ramp = np.clip((FADE1 - ys) / float(FADE1 - FADE0), 0, 1)
# yams / leaves in front (saturated, not dark) near the bottom of the visible pouch area
sat = ai.max(axis=2) - ai.min(axis=2)
front = ((lum_ai > 62) & (sat > 28) & (ys > 1405))
front = cv2.dilate(cv2.morphologyEx(front.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)), np.ones((5, 5), np.uint8)).astype(bool)

layers = {n: real_layer(n) for n in ('matcha', 'ube')}
cover = np.maximum(layers['matcha'][1], layers['ube'][1]) > 0.5
# 1) AI pouch remnants that the real pouches do not cover (above the fade line): inpaint with the surroundings
zone = np.zeros((Hh, Ww), bool); zone[785:FADE0, 540:1425] = True
rem = (lum_ai < 70) & zone & ~cv2.dilate(cover.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & ~straw
rem = cv2.morphologyEx(rem.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
print("AI remnant px outside real silhouettes:", int(rem.sum()))
base = cv2.inpaint(np.clip(ai, 0, 255).astype(np.uint8), cv2.dilate(rem, np.ones((7, 7), np.uint8)) * 255, 7, cv2.INPAINT_TELEA).astype(np.float32)
# 2) AI print that would show below / beside the real print (fade band, and through the dome): paint it film-black
X = np.arange(Ww)[None, :]
band = (ys > 1404) & (ys < 1475) & (X > 556) & (X < 1412)
neutral_print = (lum_ai > 105) & (sat < 34)
cyan_print = (ai[..., 2] - ai[..., 0] > 55) & (ai[..., 1] > 110)
pr = band & (cyan_print | (neutral_print & ~dome) | (neutral_print & dome & (X > 1292) & (X < 1372) & (ys < 1442)))
pr = cv2.dilate(pr.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(np.float32)
print("AI print px painted out:", int(pr.sum()))
pm = cv2.GaussianBlur(pr, (0, 0), 1.5)[..., None]
film = cv2.GaussianBlur(np.where((lum_ai < 60)[..., None], ai, 0), (0, 0), 12) / np.maximum(cv2.GaussianBlur((lum_ai < 60).astype(np.float32), (0, 0), 12), 1e-3)[..., None]
base = base * (1 - pm) + film * pm

out = base.copy()
for name in ('matcha', 'ube'):
    rgb, al = layers[name]
    rl = rgb.mean(axis=2)
    occ = front.copy()
    if name == 'matcha': occ |= dome | straw
    # low-frequency relight from the plain black film of both images
    valid = ((al > 0.98) & (rl < 75) & (lum_ai < 75) & ~occ & (ys < FADE0)).astype(np.float32)
    num = cv2.GaussianBlur(lum_ai * valid, (0, 0), 34); den = cv2.GaussianBlur(rl * valid, (0, 0), 34); wsum = cv2.GaussianBlur(valid, (0, 0), 34)
    ratio = np.where(wsum > 0.02, (num + 2) / (den + 2), 1.0)
    lo = 0.74 - 0.26 * np.clip((ys - 1340) / 80.0, 0, 1)          # allow more darkening toward the hidden bottom so the seam vanishes
    ratio = np.clip(ratio, lo, 1.15)
    keep = np.clip((rl - 70) / 70.0, 0, 1)                         # printed areas (logo, text, tab) keep their own brightness
    ratio = ratio * (1 - keep) + np.maximum(ratio, 0.96) * keep
    print(name, "relight ratio range", float(ratio[al > 0.98].min().round(2)), float(ratio[al > 0.98].max().round(2)))
    P = np.clip(rgb * ratio[..., None], 0, 255)
    a = cv2.erode((al * 255).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32) / 255
    a = a * ramp * (1 - cv2.GaussianBlur(occ.astype(np.float32), (0, 0), 1.2))
    a = cv2.GaussianBlur(a, (0, 0), 0.7)[..., None]
    out = out * (1 - a) + P * a
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save('BAG_REAL.png')
