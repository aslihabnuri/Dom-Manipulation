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
CW, CH, K = 1080, 1080, 2
INK = (30, 10, 62); UBE = (92, 42, 160); WHITE = (255, 255, 255)
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

# ---- backdrop: scene zoomed to 80% and outpainted on the left (scene_zoom_final.png) ----
bg = Image.open(ROOT + "/d1111/" + L.get("scene", "scene_sq_final.png")).convert("RGB")
bg.save(ROOT + "/d1111/bg_1111_sq.png")
cv = bg.resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")

# ---- typography: one left axis; smallest text >= 38 px (about 12 pt on a 360 pt wide phone) ----
x = L.get("x", 50)
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 160) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
cv.alpha_composite(lg, (int(x * K), int(L.get("logo_y", 44) * K)))
# header: UBELIEVABLE 11.11 across the full width
fh = f(BOLD, L.get("head", 115)); hy = L.get("head_y", 112)
wu = text(cv, x - 3, hy, "UBE", fh, 0, UBE)
wl = text(cv, x - 3 + wu, hy, "LIEVABLE 11.11", fh, 0, INK)
head_bottom = hy + cap(fh)
# offer
fs = f(BOLD, L.get("label", 46))
dy = head_bottom + L.get("gap_du", 52)
text(cv, x, dy, "DISC UP TO", fs, L.get("label_tr", 4), INK)
DIG = 0.2194 * CW
fb = ImageFont.truetype(BOLD, 100); b5 = fb.getbbox("5"); em = (b5[3] - b5[1]) / 100
pct, H = vector_45pct(DIG / em * K * L.get("pct_k", 0.99), INK)
py = dy + cap(fs) + L.get("gap_pct", 22)
cv.alpha_composite(pct, (int((x - 6) * K), int(py * K)))
pct_bottom = py + pct.height / K
# benefits + CTA
fo = f(DEMI, L.get("body", 42)); oy = pct_bottom + L.get("gap_off", 40)
# benefits on one line, separated by a vector dot (the DEMO font locks the middle dot)
w1 = text(cv, x, oy, "Gratis ongkir", fo, 0.3)
gap = L.get("sep_gap", 22); r = 5
dd = ImageDraw.Draw(cv); cxp = (x + w1 + gap) * K; cyp = (oy + cap(fo) / 2) * K
dd.ellipse([cxp - r * K, cyp - r * K, cxp + r * K, cyp + r * K], fill=INK)
w2 = text(cv, x + w1 + 2 * gap, oy, "Voucher 15rb", fo, 0.3)
print("benefits right edge", round(x + w1 + 2 * gap + w2))
cy = oy + cap(fo) + L.get("gap_cta", 36)
fc = f(BOLD, L.get("cta", 38)); tw = sum(fc.getlength(c) for c in "SHOP NOW") / K + 7 * 3; h = L.get("cta_h", 84); pad = 38; aw = 30
w = tw + 2 * pad + aw + 16
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(x * K), int(cy * K)))
text(cv, x + pad, cy + (h - cap(fc)) / 2, "SHOP NOW", fc, 3, WHITE)
d = ImageDraw.Draw(cv); ax = (x + pad + tw + 10) * K; ay = (cy + h / 2) * K; Lr = aw * K; th = int(5 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
print(f"header right edge {x - 3 + wu + wl:.0f} y {hy}-{head_bottom:.0f} | DISC y {dy:.0f} | 45% y {py:.0f}-{pct_bottom:.0f} right {x - 6 + pct.width / K:.0f} | body {oy:.0f} | cta {cy:.0f}-{cy + h:.0f} w {w:.0f}")
print("caps px:", {k: round(cap(v)) for k, v in dict(header=fh, label=fs, body=fo, cta=fc).items()})

out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 1.3, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
name = L.get("out", ROOT + "/d1111/ubelievable-1111-ube-matcha-latte-1080x1080.jpg")
for q in (94, 92, 90, 88):
    out.save(name, quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(name) <= 2_000_000: break
print("saved", name, out.size, "q", q, os.path.getsize(name), "bytes")
