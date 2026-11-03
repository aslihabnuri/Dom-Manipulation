import cv2, numpy as np, sys
SRC, AFILE, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
CUP = [tuple(map(int, p.split(','))) for p in sys.argv[4].split(';')]
ICE_Y = int(sys.argv[5])
from PIL import Image
ai = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
p = Image.open('mockup_ube.png').convert('RGBA'); p = p.crop(p.getbbox())
pa = np.asarray(p).astype(np.float32)
A = np.load(AFILE); S = ai.shape[0]
P = cv2.warpAffine(pa, A, (S, S), flags=cv2.INTER_LANCZOS4, borderValue=0)
rgb, al = P[..., :3], np.clip(P[..., 3] / 255.0, 0, 1)
inside = al > 0.98

def shade(valid, sigma=18):
    w = valid.astype(np.float32)
    num = cv2.GaussianBlur(ai * w[..., None], (0, 0), sigma); den = cv2.GaussianBlur(rgb * w[..., None], (0, 0), sigma)
    ratio = (num + 8) / (den + 8)
    return np.clip(ratio, 0.45, 2.6)

def occluders(Pl, thr=55, k=9, min_area=350):
    d = np.abs(ai - Pl).max(axis=2)
    m = ((d > thr) & (al > 0.5)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= min_area: keep[lab == i] = 1
    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    return keep.astype(bool)

r1 = shade(inside); P1 = np.clip(rgb * r1, 0, 255)
occ = occluders(P1)
r2 = shade(inside & ~occ); P2 = np.clip(rgb * r2, 0, 255)
occ = occluders(P2)
r3 = shade(inside & ~occ, sigma=14); P3 = np.clip(rgb * r3, 0, 255)
occ = occluders(P3, thr=50)
# the clear cup in front of the pouch: straight tapered right edge measured on the AI frame
from PIL import ImageDraw
cupm = Image.new("L", (S, S), 0)
ImageDraw.Draw(cupm).polygon(CUP, fill=255)
cupm = np.asarray(cupm) > 0
lum_ai = ai.mean(axis=2)
ice = (np.arange(S)[:, None] > ICE_Y) & (lum_ai > 100)
ice = cv2.morphologyEx(ice.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
# violet splash and droplets flying in front of the pouch (the pouch's own purple mark is far darker)
spl = ((ai[..., 2] - ai[..., 1]) > 38) & (lum_ai > 112)
spl = cv2.morphologyEx(spl.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
spl = cv2.dilate(cv2.morphologyEx(spl, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)), np.ones((5, 5), np.uint8)).astype(bool)
occ = occ | cupm | ice | spl
# composite weight: original pouch where alpha, minus occluders (feathered)
a_er = cv2.erode((al * 255).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32) / 255
w = a_er * (1 - cv2.GaussianBlur(occ.astype(np.float32), (0, 0), 1.6))
w = cv2.GaussianBlur(w, (0, 0), 0.8)
out = ai * (1 - w[..., None]) + P3 * w[..., None]
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT)
Image.fromarray((occ * 255).astype(np.uint8)).save(OUT.replace('.png','_occ.png'))
print("occluder px", int(occ.sum()))
