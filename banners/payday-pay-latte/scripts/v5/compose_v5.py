"""PAY LATTE v5: minimal typography on one left axis (logo, PAY LATTE, DISC UP TO, 35%, one benefits line, CTA).
Sizes: label/body 34, headline, 35% (digit height 21.94% of width), CTA 30. No 'PAYDAY SALE'."""
import sys, os, json
import numpy as np, cv2
from PIL import Image, ImageDraw
from ptools import *
L = json.loads(sys.argv[1]); CW, CH = L["size"]; X = L["x"]
A = np.asarray(Image.open(L["bg"]).convert("RGB")).astype(np.float32); sx = L.get("shift", 0)
if sx:
    edge = cv2.GaussianBlur(np.median(A[:, -16:], axis=1)[:, None], (0, 0), sigmaX=0.1, sigmaY=4)[:, 0]   # colour at the original right edge
    strip = np.repeat(edge[:, None], sx, axis=1) + np.random.default_rng(3).normal(0, 1.2, (A.shape[0], sx, 1))
    A = np.concatenate([A[:, sx:], strip], axis=1)
Image.fromarray(np.clip(A, 0, 255).astype(np.uint8)).save(L["out"] + ".bg.png")
cv = Image.fromarray(np.clip(A, 0, 255).astype(np.uint8)).resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")
boxes = {}
def tw(s, fnt, tr=0): return sum(fnt.getlength(c) for c in s) / K + tr * (len(s) - 1)
def put(key, s, fnt, y, tr=0, fill=INK, x=None):
    x = X if x is None else x; text(cv, x, y, s, fnt, tr, fill); boxes[key] = (x, y, x + tw(s, fnt, tr), y + cap(fnt)); return y + cap(fnt)
y = L["y0"]
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 150) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS); cv.alpha_composite(lg, (int(X * K), int(y * K)))
boxes["logo"] = (X, y, X + lw / K, y + lg.height / K); y += lg.height / K + L["g_logo"]
fh = f(BOLD, L["head"]); wp = tw("PAY ", fh); put("PAY", "PAY", fh, y, 0, INK, X - 4); y = put("LATTE", "LATTE", fh, y, 0, UBE, X - 4 + wp) + L["g_group"]
fl = f(BOLD, L.get("label", 34)); y = put("DISC UP TO", "DISC UP TO", fl, y, 5) + L.get("g_pct", 18)
pct = pct_vec("35", 0.2194 * CW * 0.983, INK); cv.alpha_composite(pct, (int((X - 6) * K), int(y * K)))
boxes["35%"] = (X - 6, y, X - 6 + pct.width / K, y + pct.height / K); y += pct.height / K + L["g_group"]
fo = f(DEMI, L.get("body", 34)); ih = L.get("icon_h", 30); x = X
for i, (kind, s) in enumerate([("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]):
    ic = icon(kind, ih, INK); cv.alpha_composite(ic, (int(x * K), int((y + cap(fo) / 2 - ih / 2) * K)))
    wt = tw(s, fo, 0.3); text(cv, x + ic.width / K + 12, y, s, fo, 0.3, INK); boxes[f"b{i}"] = (x, y - 4, x + ic.width / K + 12 + wt, y + cap(fo) + 4)
    x += ic.width / K + 12 + wt + L.get("sep", 34)
y += cap(fo) + L.get("g_cta", 40)
fc = f(BOLD, L.get("cta", 30)); h = L.get("cta_h", 68); aw = 24; t_w = tw("SHOP NOW", fc, 3); w = t_w + 2 * 32 + aw + 12
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(X * K), int(y * K)))
tx = X + 32; text(cv, tx, y + (h - cap(fc)) / 2, "SHOP NOW", fc, 3, WHITE)
d = ImageDraw.Draw(cv); ax = (tx + t_w + 12) * K; ay = (y + h / 2) * K; Lr = aw * K; th = int(4 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
boxes["cta"] = (X, y, X + w, y + h)
print({k: tuple(round(v) for v in b) for k, b in boxes.items()})
out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 0.7, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for q in (94, 92, 90):
    out.save(L["out"], quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(L["out"]) <= 2_000_000: break
json.dump({k: [float(v) for v in b] for k, b in boxes.items()}, open(L["out"] + ".boxes.json", "w"))
print("saved", L["out"], out.size, os.path.getsize(L["out"]), "bytes")
