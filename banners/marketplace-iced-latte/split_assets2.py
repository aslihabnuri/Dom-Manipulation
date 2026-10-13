import sys
from PIL import Image
import numpy as np
D = sys.argv[1]
sys.argv = [sys.argv[0], D]
exec(open(D + "/../split_assets.py").read().split("dr = Image.open")[0])          # trim()
src = open(D + "/../split_assets.py").read()
exec("from PIL import ImageFilter\n" + src[src.index("def blobs"):src.index('blobs(Image.open(f"{D}/parts/ice3.png")')])
dr = Image.open(D + "/RB_MUBE.png").convert("RGBA")
a = np.asarray(dr)[..., 3]
cols = np.where((a > 30).sum(axis=0) > 20)[0]
groups = []; s = cols[0]; p = cols[0]
for c in cols[1:]:
    if c - p > 30: groups.append((s, p)); s = c
    p = c
groups.append((s, p)); print("drink columns", groups)
x0, x1 = groups[1]
t = trim(dr.crop((x0, 0, x1 + 1, dr.height))); t.save(f"{D}/parts/drink_matchaube.png"); print("matchaube", t.size)
ing = Image.open(D + "/RB_UBE3.png").convert("RGBA")
boxes = {"ube_pw": (0, 280, 1010, 1500), "ubepair": (960, 120, 1950, 720), "ubeslice_T": (1060, 940, 1720, 1540),
         "ubecubes": (1860, 600, 2490, 1560)}
for n, b in boxes.items():
    t = trim(ing.crop(b)); t.save(f"{D}/parts/{n}.png"); print(n, t.size)
blobs(Image.open(f"{D}/parts/ubepair.png"), 2, "ubefresh")
