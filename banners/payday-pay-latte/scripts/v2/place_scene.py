"""Place the photographed scene on a canvas at scale S with its top-left at (ox, oy), without AI:
the plain lilac backdrop is continued on every side with the scene's own texture, and the two handle
straps are continued straight up to the top edge keeping their slope and taper."""
import numpy as np, cv2
from PIL import Image

def place(scene_path, CW, CH, S, ox, oy, out):
    A = np.asarray(Image.open(scene_path).convert('RGB')).astype(np.float32)
    H, W, _ = A.shape
    Lp = max(0, int(np.ceil(ox / S)) + 2); Rp = max(0, int(np.ceil((CW - ox) / S - W)) + 2)
    Tp = max(0, int(np.ceil(oy / S)) + 2); Bp = max(0, int(np.ceil((CH - oy) / S - H)) + 2)
    sm = lambda v, s: cv2.GaussianBlur(v, (0, 0), sigmaX=0.1, sigmaY=s)
    rowL = sm(A[:, 4:34].mean(axis=1, keepdims=True), 30); rowR = sm(A[:, -34:-4].mean(axis=1, keepdims=True), 30)   # margins clear of the bag (x 46..1016)
    def band(rows, ref):
        b = A[rows].mean(axis=0); d = np.abs(b - ref).max(axis=1) > 14
        d = cv2.dilate(d.astype(np.uint8)[None], np.ones((1, 41), np.uint8))[0].astype(bool); xs = np.arange(W)
        for c in range(3): b[d, c] = np.interp(xs[d], xs[~d], b[~d, c])
        return cv2.GaussianBlur(b[None], (0, 0), 30)[0]
    top = band(slice(4, 24), (rowL[10, 0] + rowR[10, 0]) / 2); bot = band(slice(H - 24, H - 4), (rowL[-10, 0] + rowR[-10, 0]) / 2)
    patch = A[0:420, 0:330]; tex = patch - cv2.GaussianBlur(patch, (0, 0), 25)
    tile = np.vstack([np.hstack([tex, tex[:, ::-1]]), np.hstack([tex[::-1], tex[::-1, ::-1]])])
    def texture(h, w, oy_=0, ox_=0):
        reps = (int(np.ceil((h + oy_) / tile.shape[0])), int(np.ceil((w + ox_) / tile.shape[1])), 1)
        return np.tile(tile, reps)[oy_:oy_ + h, ox_:ox_ + w]
    He, We = Tp + H + Bp, Lp + W + Rp
    E = np.zeros((He, We, 3), np.float32)
    # low-frequency backdrop field for the pads
    colbot = np.vstack([np.repeat(bot[:1], Lp, axis=0), bot, np.repeat(bot[-1:], Rp, axis=0)])
    coltop = np.vstack([np.repeat(top[:1], Lp, axis=0), top, np.repeat(top[-1:], Rp, axis=0)])
    if Tp: E[:Tp] = coltop[None] + texture(Tp, We, 37, 5)
    if Bp: E[Tp + H:] = colbot[None] + texture(Bp, We, 11, 71)
    if Lp: E[Tp:Tp + H, :Lp] = rowL + texture(H, Lp, 0, 111)
    if Rp: E[Tp:Tp + H, Lp + W:] = rowR + texture(H, Rp, 90, 13)
    E[Tp:Tp + H, Lp:Lp + W] = A
    # straps continued upward
    if Tp:
        N = 240; rc = (rowL[:N] + rowR[:N]) / 2
        m = (np.abs(A[:N] - rc).max(axis=2) > 22).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(m); X = np.arange(W, dtype=np.float32)
        for i in [i for i in range(1, n) if st[i, cv2.CC_STAT_HEIGHT] > N * 0.9]:
            comp = (lab == i); soft = cv2.GaussianBlur(comp.astype(np.float32), (0, 0), 1.0); ys = np.arange(N)
            le = np.array([np.where(comp[y])[0].min() for y in ys]); ri = np.array([np.where(comp[y])[0].max() for y in ys])
            cb, ca = np.polyfit(ys, (le + ri) / 2.0, 1); wb, wa = np.polyfit(ys, (ri - le).astype(float), 1)
            for j in range(1, Tp + 1):
                ys_ = (j - 1) % (2 * N); ys_ = ys_ if ys_ < N else 2 * N - 1 - ys_
                cd, wd = ca + cb * (-j), max(10.0, wa + wb * (-j)); cs, ws = ca + cb * ys_, wa + wb * ys_
                u = (X - cd) * (ws / wd) + cs
                a = np.interp(u, X, soft[ys_], left=0, right=0)[:, None]
                rgb = np.stack([np.interp(u, X, A[ys_, :, c]) for c in range(3)], axis=1)
                seg = E[Tp - j, Lp:Lp + W]; E[Tp - j, Lp:Lp + W] = seg * (1 - a) + rgb * a
            print("  strap: centre at scene top", round(float(ca)), "slope", round(float(cb), 3), "width", round(float(wa)), "-> centre at canvas top", round(ox + S * (ca + cb * (-Tp))))
    img = Image.fromarray(np.clip(E, 0, 255).astype(np.uint8))
    img = img.resize((round(We * S), round(He * S)), Image.LANCZOS)
    cv = Image.new('RGB', (CW, CH)); cv.paste(img, (round(ox - Lp * S), round(oy - Tp * S))); cv.save(out)
    print(out, "S", S, "at", (ox, oy), "pads LRTB", Lp, Rp, Tp, Bp)

if __name__ == "__main__":
    import sys; a = sys.argv
    place(a[1], int(a[2]), int(a[3]), float(a[4]), float(a[5]), float(a[6]), a[7])
