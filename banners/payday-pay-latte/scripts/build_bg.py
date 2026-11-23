"""Place the 1080x1620 scene on a canvas at a smaller scale, bottom-right anchored (no AI).
- the plain lilac backdrop is continued to the left and above, with the scene's own paper-like texture;
- the two handle straps are continued straight up to the top edge, keeping their slope and taper."""
import sys, numpy as np, cv2
from PIL import Image
def build(CW, CH, S, R, out):
    A = np.asarray(Image.open('scene_real_1080.png').convert('RGB')).astype(np.float32)
    H, W, _ = A.shape
    T = max(0, int(np.ceil(CH / S - H)) + 2)            # extra scene rows above
    P = max(0, int(np.ceil((CW + R) / S - W)) + 2)      # extra scene columns on the left
    N = 240                                             # rows at the scene top that contain only straps
    # low-frequency backdrop colours
    rowcol = cv2.GaussianBlur(A[:, 20:120].mean(axis=1, keepdims=True), (0, 0), sigmaX=0.1, sigmaY=12)      # (H,1,3)
    band = A[4:24].mean(axis=0)                                                                              # (W,3)
    d0 = np.abs(band - rowcol[10]).max(axis=1) > 14
    d0 = cv2.dilate(d0.astype(np.uint8)[None], np.ones((1, 41), np.uint8))[0].astype(bool); xs = np.arange(W)
    for c in range(3): band[d0, c] = np.interp(xs[d0], xs[~d0], band[~d0, c])
    band = cv2.GaussianBlur(band[None], (0, 0), 30)[0]
    # paper texture taken from a clean backdrop patch, mirrored to tile
    patch = A[0:520, 0:520]; tex = patch - cv2.GaussianBlur(patch, (0, 0), 25)
    tile = np.vstack([np.hstack([tex, tex[:, ::-1]]), np.hstack([tex[::-1], tex[::-1, ::-1]])])
    def texture(h, w, oy=0, ox=0):
        reps = (int(np.ceil((h + oy) / tile.shape[0])), int(np.ceil((w + ox) / tile.shape[1])), 1)
        return np.tile(tile, reps)[oy:oy + h, ox:ox + w]
    E = A
    if T:
        ext = np.repeat(band[None], T, axis=0) + texture(T, W, 37, 0)
        m = (np.abs(A[:N] - rowcol[:N]).max(axis=2) > 22).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(m)
        for i in [i for i in range(1, n) if st[i, cv2.CC_STAT_HEIGHT] > N * 0.9]:
            comp = (lab == i); soft = cv2.GaussianBlur(comp.astype(np.float32), (0, 0), 1.0)
            ys = np.arange(N); le = np.array([np.where(comp[y])[0].min() for y in ys]); ri = np.array([np.where(comp[y])[0].max() for y in ys])
            cb, ca = np.polyfit(ys, (le + ri) / 2.0, 1); wb, wa = np.polyfit(ys, (ri - le).astype(float), 1)
            X = np.arange(W, dtype=np.float32)
            for j in range(1, T + 1):                      # destination row -j mirrors source row j-1 (texture stays continuous)
                ys_ = (j - 1) % (2 * N); ys_ = ys_ if ys_ < N else 2 * N - 1 - ys_
                cd, wd = ca + cb * (-j), max(8.0, wa + wb * (-j)); cs, ws = ca + cb * ys_, wa + wb * ys_
                u = (X - cd) * (ws / wd) + cs                 # where each destination pixel samples the source row
                a = np.interp(u, X, soft[ys_])[:, None]
                rgb = np.stack([np.interp(u, X, A[ys_, :, c]) for c in range(3)], axis=1)
                ext[T - j] = ext[T - j] * (1 - a) + rgb * a
            print("strap centre slope", round(float(cb), 3), "width", round(float(wa), 1), "taper/row", round(float(wb), 4))
        E = np.vstack([ext, A])
    if P:
        rc = np.vstack([np.repeat(band[60:61].mean(axis=0)[None, None], T, axis=0), rowcol]) if T else rowcol
        left = np.repeat(rc, P, axis=1) + texture(E.shape[0], P, 0, 111)
        E = np.hstack([left, E])
        k = 40
        for j in range(k):                                  # cross-fade the first scene columns into the fill colour
            t = j / k; E[:, P + j] = (rc[:, 0] + (E[:, P + j] - cv2.GaussianBlur(E[:, P + j][None], (0, 0), 1)[0] * 0 - rc[:, 0]) * 1.0) * t + (rc[:, 0] + E[:, P + j] - E[:, P + j]) * (1 - t) + (E[:, P + j] - rc[:, 0]) * 0
    img = Image.fromarray(np.clip(E, 0, 255).astype(np.uint8))
    sw, sh = round(E.shape[1] * S), round(E.shape[0] * S)
    img = img.resize((sw, sh), Image.LANCZOS)
    cv = Image.new('RGB', (CW, CH)); cv.paste(img, (CW - sw + R, CH - sh)); cv.save(out)
    # seam report: level difference across the fill/scene borders
    if P: print(" left seam diff", np.abs(E[T + 50:T + 500, P - 30:P - 5].mean(axis=(0, 1)) - E[T + 50:T + 500, P + 45:P + 90].mean(axis=(0, 1))).round(1))
    if T: print(" top seam diff", np.abs(E[T - 40:T - 5, P + 100:P + 500].mean(axis=(0, 1)) - E[T + 5:T + 40, P + 100:P + 500].mean(axis=(0, 1))).round(1))
    print(out, "S", S, "R", R, "ext rows", T, "pad cols", P)
if __name__ == "__main__":
    a = sys.argv; build(int(a[1]), int(a[2]), float(a[3]), int(a[4]), a[5])
