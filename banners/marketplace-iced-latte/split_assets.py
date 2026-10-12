import sys
from PIL import Image
import numpy as np
D = sys.argv[1]
def trim(im, pad=4):
    bb = im.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox()
    x0, y0, x1, y1 = bb
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
dr = Image.open(D + "/RB_DRINKS.png").convert("RGBA")
a = np.asarray(dr)[..., 3]
cols = np.where((a > 30).sum(axis=0) > 20)[0]
groups = []; s = cols[0]; p = cols[0]
for c in cols[1:]:
    if c - p > 30: groups.append((s, p)); s = c
    p = c
groups.append((s, p)); print("drink columns", groups)
for name, (x0, x1) in zip(["matcha", "ube", "charcoal"], groups):
    t = trim(dr.crop((x0, 0, x1 + 1, dr.height))); t.save(f"{D}/parts/drink_{name}.png"); print(name, t.size)
ing = Image.open(D + "/RB_INGR.png").convert("RGBA")
boxes = {"milk": (140, 50, 1110, 1060), "ice3": (1160, 60, 1910, 700), "ice1": (1230, 800, 1840, 1240),
         "ube": (2070, 150, 2990, 830), "leaves": (100, 1210, 940, 1960), "matcha_pw": (1060, 1270, 1990, 1990),
         "charcoal_pw": (2100, 1150, 3000, 1960)}
for n, b in boxes.items():
    t = trim(ing.crop(b)); t.save(f"{D}/parts/{n}.png"); print(n, t.size)
# split the 3-cube cluster and the ube halves into single pieces (largest connected blobs)
from PIL import ImageFilter
def blobs(im, n, name, min_px=4000):
    al = np.asarray(im)[..., 3] > 60
    lab = np.zeros(al.shape, np.int32); cur = 0
    sys.setrecursionlimit(10000)
    # simple BFS labelling on a downsampled grid for speed
    small = Image.fromarray((al * 255).astype(np.uint8)).resize((im.width // 4, im.height // 4))
    sa = np.asarray(small) > 127
    H, W = sa.shape; lab = np.zeros((H, W), np.int32)
    from collections import deque
    sizes = {}
    for y in range(H):
        for x in range(W):
            if sa[y, x] and lab[y, x] == 0:
                cur += 1; q = deque([(y, x)]); lab[y, x] = cur; c = 0
                while q:
                    yy, xx = q.popleft(); c += 1
                    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                        ny, nx = yy+dy, xx+dx
                        if 0 <= ny < H and 0 <= nx < W and sa[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur; q.append((ny, nx))
                sizes[cur] = c
    big = sorted(sizes, key=lambda k: -sizes[k])[:n]
    for i, k in enumerate(big):
        m = Image.fromarray(((lab == k) * 255).astype(np.uint8)).resize(im.size).filter(ImageFilter.MaxFilter(9))
        piece = im.copy(); pa = np.asarray(piece).copy(); pa[..., 3] = np.minimum(pa[..., 3], np.asarray(m))
        out = trim(Image.fromarray(pa, "RGBA")); out.save(f"{D}/parts/{name}_{i}.png"); print(name, i, out.size)
blobs(Image.open(f"{D}/parts/ice3.png"), 3, "icecube")
blobs(Image.open(f"{D}/parts/ube.png"), 2, "ubehalf")
