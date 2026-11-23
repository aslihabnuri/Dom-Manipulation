"""PAY LATTE v3 (space reference): one right-aligned type column like the reference masthead.
Order: PAY / LATTE (masthead) > PAYDAY SALE > DISC UP TO > 35% > benefits > SHOP NOW. Logo top-left."""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from ptools import *
L = json.loads(sys.argv[1]); CW, CH = L["size"]; RX = L["rx"]
cv = Image.open(L["bg"]).convert("RGB").resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")
boxes = {}
def tw(s, fnt, tr=0): return sum(fnt.getlength(c) for c in s) / K + tr * (len(s) - 1)
def put(key, s, fnt, y, tr=0, fill=INK, x=None):
    w = tw(s, fnt, tr); x0 = (RX - w) if x is None else x
    text(cv, x0, y, s, fnt, tr, fill); boxes[key] = (x0, y, x0 + w, y + cap(fnt)); return y + cap(fnt)
# logo
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 160) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
lx, ly = L["logo"]; cv.alpha_composite(lg, (int(lx * K), int(ly * K))); boxes["logo"] = (lx, ly, lx + lw / K, ly + lg.height / K)
y = L["head_y"]; fh = f(BOLD, L["head"])
if L.get("label_top"):
    y = put("label", "PAYDAY SALE", f(BOLD, L.get("label", 38)), y, 4, INK) + L.get("gap_label", 30)
if L.get("stack", True):
    y = put("PAY", "PAY", fh, y) + L.get("lead", 26); y = put("LATTE", "LATTE", fh, y, 0, UBE)
else:
    y = put("PAY LATTE", "PAY LATTE", fh, y)
    # recolour LATTE: redraw it over in UBE
    wl = tw("LATTE", fh); text(cv, RX - wl, boxes["PAY LATTE"][1], "LATTE", fh, 0, UBE)
if not L.get("label_top"):
    y = put("label", "PAYDAY SALE", f(BOLD, L.get("label", 38)), y + L.get("gap_label", 30), 4, INK)
fs = f(BOLD, L.get("du", 46)); y = put("DISC UP TO", "DISC UP TO", fs, y + L.get("gap_du", 70), 4, INK)
pct = pct_vec("35", L["digit_h"] * 0.983, INK); py = y + L.get("gap_pct", 20)
cv.alpha_composite(pct, (int((RX + 4) * K - pct.width), int(py * K))); boxes["35%"] = (RX + 4 - pct.width / K, py, RX + 4, py + pct.height / K)
y = py + pct.height / K
fo = f(DEMI, L.get("body", 40)); ih = L.get("icon_h", 38)
for i, (kind, s) in enumerate([("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]):
    yy = y + L.get("gap_off", 52) + i * L.get("lead_off", 60); w = tw(s, fo, 0.3); ic = icon(kind, ih, INK)
    x0 = RX - w - 16 - ic.width / K
    cv.alpha_composite(ic, (int(x0 * K), int((yy + cap(fo) / 2 - ih / 2) * K))); text(cv, RX - w, yy, s, fo, 0.3, INK)
    boxes[f"b{i}"] = (x0, yy - 6, RX, yy + cap(fo) + 6)
y = yy + cap(fo)
fc = f(BOLD, 38); h = 84; aw = 30; t_w = tw("SHOP NOW", fc, 3); w = L.get("cta_w", 334); cx0 = RX - w; cy0 = y + L.get("gap_cta", 44)
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(cx0 * K), int(cy0 * K)))
tx = cx0 + (w - (t_w + 16 + aw)) / 2; text(cv, tx, cy0 + (h - cap(fc)) / 2, "SHOP NOW", fc, 3, WHITE)
d = ImageDraw.Draw(cv); ax = (tx + t_w + 16) * K; ay = (cy0 + h / 2) * K; Lr = aw * K; th = int(5 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
boxes["cta"] = (cx0, cy0, cx0 + w, cy0 + h)
print({k: tuple(round(v) for v in b) for k, b in boxes.items()})
out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 0.8, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for q in (94, 92, 90):
    out.save(L["out"], quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(L["out"]) <= 2_000_000: break
json.dump({k: [float(v) for v in b] for k, b in boxes.items()}, open(L["out"] + ".boxes.json", "w"))
print("saved", L["out"], out.size, os.path.getsize(L["out"]), "bytes")
