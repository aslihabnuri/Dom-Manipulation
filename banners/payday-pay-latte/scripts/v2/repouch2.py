"""Paste the real front panels (rectified from the Drive mockups) over the AI pouches of H_A.png.
Both pouches get exactly the same size and the real aspect ratio; the cup, dome, straw, yams and leaves stay in front."""
import cv2, numpy as np
from PIL import Image, ImageDraw
ai = np.asarray(Image.open('H_A.png').convert('RGB')).astype(np.float32); Hh, Ww, _ = ai.shape
PW, TOP = 486, 748
POS = {'matcha': 624, 'ube': 146}
lum = ai.mean(axis=2); sat = ai.max(axis=2) - ai.min(axis=2); R, G, B = ai[..., 0], ai[..., 1], ai[..., 2]
ys = np.arange(Hh)[:, None]; xs = np.arange(Ww)[None, :]
def poly(pts):
    im = Image.new('L', (Ww, Hh), 0); ImageDraw.Draw(im).polygon(pts, fill=255); return np.asarray(im) > 0
def front(name):
    p = Image.open(f'front_{name}.png').convert('RGBA').crop((0, 0, 668, 1004))
    m = Image.new('L', p.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, p.width - 1, p.height + 60], radius=22, fill=255)
    p.putalpha(Image.fromarray(np.minimum(np.asarray(p)[..., 3], np.asarray(m))))
    p = p.resize((PW, round(p.height * PW / p.width)), Image.LANCZOS)
    lay = Image.new('RGBA', (Ww, Hh), (0, 0, 0, 0)); lay.paste(p, (POS[name], TOP)); a = np.asarray(lay).astype(np.float32)
    return a[..., :3], a[..., 3] / 255.0, p.size
cup = poly([(832, 1270), (848, 1218), (884, 1172), (930, 1141), (990, 1121), (1060, 1114), (1130, 1121), (1190, 1141), (1240, 1175),
            (1260, 1270), (1260, 1340), (1230, 1700), (880, 1700), (850, 1340), (826, 1330)])
straw = poly([(1028, 902), (1072, 904), (1052, 1130), (1006, 1128)])
cream = (R - B > 22) & (lum > 120) & (xs < 300) & (ys > 1385)
cream = cv2.dilate(cream.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
low = (ys > 1470) & (lum > 62) & (sat > 24)                      # yams and leaves
low = cv2.dilate(cv2.morphologyEx(low.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)), np.ones((5, 5), np.uint8)).astype(bool)
occ = cup | straw | low | cream
out = ai.copy()
# AI print left under / below the real print (its taller layout): paint it back to plain film
zone = (ys > 1436) & (ys < 1505) & (xs > 150) & (xs < 1106) & ~occ
ghost = cv2.dilate((zone & ((lum > 70) | (B - R > 25))).astype(np.uint8), np.ones((7, 7), np.uint8)).astype(np.float32)
film_m = (zone & (lum < 55)).astype(np.float32)
film = cv2.GaussianBlur(ai * film_m[..., None], (0, 0), 14) / np.maximum(cv2.GaussianBlur(film_m, (0, 0), 14), 1e-3)[..., None]
g = cv2.GaussianBlur(ghost, (0, 0), 1.5)[..., None] * (cv2.GaussianBlur(film_m, (0, 0), 14) > 0.02)[..., None]
out = out * (1 - g) + film * g
print("AI print px painted out below the real print:", int(ghost.sum()))
for name in ('matcha', 'ube'):
    rgb, al, size = front(name); rl = rgb.mean(axis=2)
    valid = ((al > 0.98) & (rl < 70) & (lum < 70) & ~occ).astype(np.float32)
    num = cv2.GaussianBlur(lum * valid, (0, 0), 30); den = cv2.GaussianBlur(rl * valid, (0, 0), 30); ws = cv2.GaussianBlur(valid, (0, 0), 30)
    ratio = np.clip(np.where(ws > 0.02, (num + 2) / (den + 2), 1.0), 0.78, 1.25)
    keep = np.clip((rl - 70) / 70.0, 0, 1); ratio = ratio * (1 - keep) + np.maximum(ratio, 0.97) * keep
    P = np.clip(rgb * ratio[..., None], 0, 255)
    fade = np.clip((TOP + size[1] - 3 - ys) / 26.0, 0, 1)            # soft bottom edge into the AI film below
    a = cv2.erode((al * 255).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32) / 255
    a = a * fade * (1 - cv2.GaussianBlur(occ.astype(np.float32), (0, 0), 1.2)); a = cv2.GaussianBlur(a, (0, 0), 0.7)[..., None]
    out = out * (1 - a) + P * a
    print(name, "pasted", size, "at x", POS[name], "-", POS[name] + size[0], "y", TOP, "-", TOP + size[1], "aspect", round(size[0] / size[1], 4))
# any AI pouch film still showing outside the two real silhouettes (above the yams)?
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save('H_REAL.png')
