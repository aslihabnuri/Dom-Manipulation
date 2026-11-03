import cv2, numpy as np
from PIL import Image
im = np.asarray(Image.open('REPOUCH2.png').convert('RGB').resize((2000, 2000), Image.LANCZOS)).astype(np.float32)
H, W, _ = im.shape
rng = np.random.default_rng(12)

def row_model(img, y0, y1, xs):
    """Per-row linear background fit over the clean columns xs, evaluated on all columns."""
    m = np.zeros((y1 - y0, W, 3), np.float32); X = np.arange(W)
    for i, y in enumerate(range(y0, y1)):
        for c in range(3):
            a, b = np.polyfit(xs, img[y, xs, c], 1); m[i, :, c] = a * X + b
    return cv2.GaussianBlur(m, (0, 0), sigmaX=1, sigmaY=6)

def fill(img, box, xs, thr=12, grow=15):
    x0, y0, x1, y1 = box
    m = row_model(img, y0, y1, xs)
    d = np.abs(img[y0:y1] - m).max(axis=2)
    mask = np.zeros((y1 - y0, W), np.uint8); mask[:, x0:x1] = (d[:, x0:x1] > thr)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    mask = cv2.dilate(mask, np.ones((grow, grow), np.uint8)).astype(np.float32)
    mask = cv2.GaussianBlur(mask, (0, 0), 5)[..., None]
    fillv = m + rng.normal(0, 1.4, m.shape[:2])[..., None]
    img[y0:y1] = img[y0:y1] * (1 - mask) + fillv * mask
    return img

orig = im.copy()
# 1) floating ice chunks inside the text column
im = fill(im, (360, 530, 600, 800), np.r_[110:360])
im = fill(im, (380, 1245, 560, 1385), np.r_[120:380, 570:630])
# 2) top-left ube: lift it out, rebuild the background, put it back shifted up-left
y0, y1 = 0, 600
m = row_model(orig, y0, y1, np.r_[640:1000])
d = np.abs(orig[y0:y1] - m).max(axis=2)
ube = np.zeros((y1 - y0, W), np.uint8); ube[:, :620] = d[:, :620] > 16
n, lab, st, _ = cv2.connectedComponentsWithStats(ube)
big = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); ube = (lab == big).astype(np.uint8)
ube = cv2.morphologyEx(ube, cv2.MORPH_CLOSE, np.ones((21, 21), np.uint8))
cnts, _ = cv2.findContours(ube, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE); cv2.drawContours(ube, cnts, -1, 1, -1)
soft = cv2.GaussianBlur(ube.astype(np.float32), (0, 0), 1.6)
grow = cv2.GaussianBlur(cv2.dilate(ube, np.ones((17, 17), np.uint8)).astype(np.float32), (0, 0), 5)
bgfill = m + rng.normal(0, 1.4, m.shape[:2])[..., None]
im[y0:y1] = im[y0:y1] * (1 - grow[..., None]) + bgfill * grow[..., None]
DX, DY = -135, -105
src = orig[y0:y1]; M = np.float32([[1, 0, DX], [0, 1, DY]])
sh = cv2.warpAffine(src, M, (W, y1 - y0)); shm = cv2.warpAffine(soft, M, (W, y1 - y0))
im[y0:y1] = im[y0:y1] * (1 - shm[..., None]) + sh * shm[..., None]
ys, xs_ = np.where(shm > 0.5); print("ube now x", xs_.min(), xs_.max(), "y", ys.min(), ys.max())
Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save('scene2_clean.png')
