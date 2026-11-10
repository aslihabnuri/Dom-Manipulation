"""UBELIEVABLE 11.11 store banner, 1080x1620 (same as NOMUVEMBER / himhim7_23).
Hierarchy: 45% (digit height = 21.94% of width = 237 px) > UBELIEVABLE 11.11 > offers > CTA."""
import sys, os, json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
sys.path.insert(0, "/home/user/Dom-Manipulation/banners/10.10-ube")
from compose import vector_45pct, logo_rgba            # '4' and '%' are vectors (locked in the DEMO font)
FD = ROOT + "/assets/fonts/All Round Gothic/"
BOLD, DEMI = FD + "Fontspring-DEMO-allroundgothic-bold.otf", FD + "Fontspring-DEMO-allroundgothic-demi.otf"
CW, CH, K = 1080, 1620, 2
INK = (30, 10, 62); UBE = (112, 60, 182); WHITE = (255, 255, 255)
L = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}

def f(path, size): return ImageFont.truetype(path, int(round(size * K)))
def text(cv, x, y, s, fnt, tr=0, fill=INK, align="left"):
    """y = top of caps (design px); returns width in design px."""
    d = ImageDraw.Draw(cv); w = sum(fnt.getlength(c) for c in s) + tr * K * (len(s) - 1)
    X = x * K - (w / 2 if align == "center" else w if align == "right" else 0)
    top = fnt.getbbox("H")[1]
    for c in s:
        d.text((X, y * K - top), c, font=fnt, fill=fill); X += fnt.getlength(c) + tr * K
    return w / K
def cap(fnt): b = fnt.getbbox("H"); return (b[3] - b[1]) / K

# ---- backdrop: scene shifted down, gradient-continued on top ----
sc = Image.open(ROOT + "/d1111/" + L.get("scene", "S1111_A.png")).convert("RGB")
s = CW / sc.width; sc = sc.resize((CW, round(sc.height * s)), Image.LANCZOS)
SHIFT = L.get("shift", 45)
bg = Image.new("RGB", (CW, CH))
bg.paste(sc.crop((0, 0, CW, CH - SHIFT)), (0, SHIFT))
top = np.asarray(sc.crop((0, 0, CW, 12))).astype(np.float32).mean(axis=0)     # plain lavender at the scene top
ext = np.repeat(top[None], SHIFT + 8, axis=0) + np.random.default_rng(3).normal(0, 1.2, (SHIFT + 8, CW, 1))
e = Image.fromarray(np.clip(ext, 0, 255).astype(np.uint8))
m = Image.fromarray((np.clip((np.arange(SHIFT + 8)[::-1] - 0) / 8.0, 0, 1)[:, None] * np.ones((1, CW)) * 255).astype(np.uint8))
bg.paste(e, (0, 0), m)
bg.save(ROOT + "/d1111/bg_1111.png")
cv = bg.resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")

# ---- clean typography: ONE left axis, two groups, four sizes ----
x = L.get("x", 58)
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 124) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
cv.alpha_composite(lg, (int(x * K), int(L.get("logo_y", 44) * K)))
# group 1: offer
fs = f(BOLD, L.get("small", 24))
text(cv, x, L.get("du_y", 112), "DISC UP TO", fs, L.get("small_tr", 5), INK)
DIG = 0.2194 * CW
fb = ImageFont.truetype(BOLD, 100); b5 = fb.getbbox("5"); em = (b5[3] - b5[1]) / 100
pct, H = vector_45pct(DIG / em * K * L.get("pct_k", 0.99), INK)
cv.alpha_composite(pct, (int((x - 6) * K), int(L.get("pct_y", 150) * K)))
pct_bottom = L.get("pct_y", 150) + pct.height / K
# campaign on one line, same size and weight; only the UBE pun is coloured
fh = f(BOLD, L.get("head", 58)); hy = pct_bottom + L.get("gap_head", 34)
wu = text(cv, x - 2, hy, "UBE", fh, 0, UBE)
wl = text(cv, x - 2 + wu, hy, "LIEVABLE 11.11", fh, 0, INK)
# group 2: benefits + CTA, anchored above the water line
fo = f(DEMI, L.get("body", 28)); oy = L.get("off_y", 742); olh = L.get("off_lh", 40)
text(cv, x, oy, "Gratis ongkir", fo, 0.3); text(cv, x, oy + olh, "Voucher 15rb", fo, 0.3)
cy = oy + olh + cap(fo) + L.get("gap_cta", 30)
fc = f(BOLD, L.get("small", 24)); tw = sum(fc.getlength(c) for c in "SHOP NOW") / K + 7 * 2; h = 60; pad = 28; aw = 20
w = tw + 2 * pad + aw + 12
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(x * K), int(cy * K)))
text(cv, x + pad, cy + (h - cap(fc)) / 2, "SHOP NOW", fc, 2, WHITE)
d = ImageDraw.Draw(cv); ax = (x + pad + tw + 8) * K; ay = (cy + h / 2) * K; Lr = aw * K; th = int(3.4 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
print(f"45% right edge {x - 6 + pct.width / K:.0f}, bottom {pct_bottom:.0f} | headline y {hy:.0f}, right edge {x - 2 + wu + wl:.0f} | body {oy} | cta {cy:.0f}-{cy + h:.0f}")

out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 1.3, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
name = L.get("out", ROOT + "/d1111/ubelievable-1111-ube-matcha-latte-1080x1620.jpg")
for q in (94, 92, 90, 88):
    out.save(name, quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(name) <= 2_000_000: break
print("saved", name, out.size, "q", q, os.path.getsize(name), "bytes")
