"""Clean plate: the AI scene with the black 1000 g pouches (and their contact shadow) removed.
Usage: plate.py src out size shift_x shift_y"""
import sys, numpy as np, cv2
from PIL import Image
src, out, S, sx, sy = sys.argv[1], sys.argv[2], tuple(map(int, sys.argv[3].split('x'))), int(sys.argv[4]), int(sys.argv[5])
ERASE = [tuple(map(int, r.split(','))) for r in sys.argv[6:]]   # extra rectangles (x0,y0,x1,y1, pre-shift coords) filled with sky
im = Image.open(src).convert('RGB').resize((S[0], round(S[0] * Image.open(src).height / Image.open(src).width)), Image.LANCZOS)
A = np.asarray(im).astype(np.float32); H, W, _ = A.shape
lum = A.mean(axis=2)
dark = ((lum < 75) & (np.arange(H)[:, None] > H * 0.45)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.morphologyEx(dark, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8)))
blobs = sorted(range(1, n), key=lambda i: -st[i, cv2.CC_STAT_AREA])[:2]
xs0 = min(st[i, 0] for i in blobs) - 16; xs1 = max(st[i, 0] + st[i, 2] for i in blobs) + 16
ys0 = min(st[i, 1] for i in blobs) - 24; ys1 = min(H, max(st[i, 1] + st[i, 3] for i in blobs) + int(0.2 * max(st[i, 3] for i in blobs)))
xs1 = min(xs1, W)
print("box", xs0, ys0, xs1, ys1)
# smooth sky model inside the box: per row, linear blend between the median colour just left and just right of it
Lc = np.median(A[:, max(0, xs0 - 40):xs0 - 6], axis=1); Rc = np.median(A[:, xs1 + 6:min(W, xs1 + 40)], axis=1) if xs1 + 46 < W else Lc
Lc = cv2.GaussianBlur(Lc[None], (0, 0), sigmaX=0.1, sigmaY=25)[0] if False else cv2.GaussianBlur(Lc[:, None], (0, 0), sigmaX=0.1, sigmaY=25)[:, 0]
Rc = cv2.GaussianBlur(Rc[:, None], (0, 0), sigmaX=0.1, sigmaY=25)[:, 0]
t = np.clip((np.arange(W) - xs0) / max(1, xs1 - xs0), 0, 1)[None, :, None]
model = Lc[:, None, :] * (1 - t) + Rc[:, None, :] * t
grain = A - cv2.GaussianBlur(A, (0, 0), 2); gstd = float(grain[:200].std())
fill = model + np.random.default_rng(7).normal(0, gstd * 0.9, A.shape[:2])[..., None]
m = np.zeros((H, W), np.float32); m[ys0:ys1, xs0:xs1] = 1
mm = cv2.GaussianBlur(m, (0, 0), 6)[..., None]
P = A * (1 - mm) + fill * mm
def sky_rect(P, x0, y0, x1, y1, c0=None, c1=None):
    x0, x1 = max(0, x0), min(W, x1)
    if c0 is not None:                      # colour per row taken from a clean column band c0..c1
        col = cv2.GaussianBlur(np.median(P[:, c0:c1], axis=1)[:, None], (0, 0), sigmaX=0.1, sigmaY=25)[:, 0]
        model = np.repeat(col[:, None, :], W, axis=1) + np.random.default_rng(x0 + y0).normal(0, gstd * 0.9, (H, W, 1))
        m = np.zeros((H, W), np.float32); m[y0:y1, x0:x1] = 1; mm = cv2.GaussianBlur(m, (0, 0), 10)[..., None]
        return P * (1 - mm) + model * mm
    Lc = np.median(P[:, max(0, x0 - 40):max(1, x0 - 6)], axis=1) if x0 > 10 else None
    Rc = np.median(P[:, x1 + 6:x1 + 40], axis=1) if x1 + 46 < W else None
    if Rc is not None: Lc = Rc          # the sky to the right is clean; the left side may hold the ribbon
    if Rc is None: Rc = Lc
    Lc = cv2.GaussianBlur(Lc[:, None], (0, 0), sigmaX=0.1, sigmaY=25)[:, 0]; Rc = cv2.GaussianBlur(Rc[:, None], (0, 0), sigmaX=0.1, sigmaY=25)[:, 0]
    t = np.clip((np.arange(W) - x0) / max(1, x1 - x0), 0, 1)[None, :, None]
    model = Lc[:, None, :] * (1 - t) + Rc[:, None, :] * t + np.random.default_rng(x0 + y0).normal(0, gstd * 0.9, (H, W, 1))
    m = np.zeros((H, W), np.float32); m[y0:y1, x0:x1] = 1; mm = cv2.GaussianBlur(m, (0, 0), 8)[..., None]
    return P * (1 - mm) + model * mm
for r in ERASE: P = sky_rect(P, *r)
P = np.clip(P, 0, 255).astype(np.uint8)
# shift (mirror-fill the uncovered edge)
if sx > 0:
    edge = np.median(P[:, W - sx - 30:W - sx].astype(np.float32), axis=1)
    edge = cv2.GaussianBlur(edge[:, None], (0, 0), sigmaX=0.1, sigmaY=20)[:, 0]
    strip = np.repeat(edge[:, None, :], sx, axis=1) + np.random.default_rng(3).normal(0, gstd * 0.9, (H, sx, 1))
    P = np.concatenate([P[:, sx:], np.clip(strip, 0, 255).astype(np.uint8)], axis=1)
if sy > 0: P = np.concatenate([P[:sy][::-1], P[:-sy]], axis=0)
P = P[:S[1], :S[0]]
Image.fromarray(P).save(out); print(out, P.shape, "grain std", round(gstd, 2))
