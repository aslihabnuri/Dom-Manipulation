"""PAY LATTE payday banner v2: poster structure — headline top, product centre, offer bottom.
Text is set in separate zones on a shared margin grid; nothing is stacked in one corner."""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from ptools import *
L = json.loads(sys.argv[1]); CW, CH = L["size"]; M = L.get("margin", 50)
bg = Image.open(L["bg"]).convert("RGB"); cv = bg.resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")
boxes = {}
def tw(s, fnt, tr=0): return (sum(fnt.getlength(c) for c in s)) / K + tr * (len(s) - 1)
def put(key, x, y, s, fnt, tr=0, fill=INK, align="left"):
    w = tw(s, fnt, tr); x0 = x - (w if align == "right" else w / 2 if align == "center" else 0)
    text(cv, x0, y, s, fnt, tr, fill); boxes[key] = (x0, y, x0 + w, y + cap(fnt)); return x0, w

# --- headline (top-left) ---
H_ = L["head"]; fh = f(BOLD, H_["size"]); hx, hy = H_.get("x", M), H_["y"]
if H_.get("stack", True):
    put("PAY", hx - 4, hy, "PAY", fh, 0, INK); put("LATTE", hx - 4, hy + cap(fh) + H_.get("lead", 22), "LATTE", fh, 0, UBE)
else:
    x0, w = put("PAY", hx - 4, hy, "PAY ", fh, 0, INK); put("LATTE", x0 + w, hy, "LATTE", fh, 0, UBE)
# --- brand (logo + campaign label) ---
B = L["brand"]; lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = B.get("logo_w", 170) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS); lh_ = lg.height / K
fl = f(BOLD, B.get("label", 38))
if B["align"] == "right":
    cv.alpha_composite(lg, (int((B["x"] - B.get("logo_w", 170)) * K), int(B["y"] * K)))
    put("label", B["x"], B["y"] + lh_ + B.get("gap", 22), "PAYDAY SALE", fl, 3, INK, "right")
else:
    cv.alpha_composite(lg, (int(B["x"] * K), int(B["y"] * K))); dx = B["x"] + B.get("logo_w", 170) + 22
    ImageDraw.Draw(cv).rectangle([dx * K, (B["y"] + 1) * K, (dx + 3) * K, (B["y"] + lh_ - 1) * K], fill=INK)
    put("label", dx + 24, B["y"] + (lh_ - cap(fl)) / 2, "PAYDAY SALE", fl, 3, INK)
# --- offer: DISC UP TO + 35% ---
O = L["offer"]; fs = f(BOLD, O.get("du", 46)); dig = O["digit_h"]
pct = pct_vec("35", dig * 0.983, INK); py = O["bottom"] - pct.height / K
cv.alpha_composite(pct, (int((O["x"] - 5) * K), int(py * K))); boxes["35%"] = (O["x"] - 5, py, O["x"] - 5 + pct.width / K, O["bottom"])
put("DISC UP TO", O["x"], py - O.get("gap", 20) - cap(fs), "DISC UP TO", fs, 4, INK)
# --- benefits (vector icons) + CTA ---
Bn = L["benefits"]; fo = f(DEMI, Bn.get("body", 40)); ih = Bn.get("icon_h", 38); bx = Bn["x"]; by = Bn["y"]
items = [("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]
for i, (kind, s) in enumerate(items):
    if Bn.get("row", True) is True and Bn.get("inline"):
        pass
    yy = by + i * Bn.get("lead", 58) if not Bn.get("inline") else by
    xx = bx if not Bn.get("inline") or i == 0 else boxes["b0"][2] + Bn.get("sep", 44)
    ic = icon(kind, ih, INK); cv.alpha_composite(ic, (int(xx * K), int((yy + cap(fo) / 2 - ih / 2) * K)))
    w = tw(s, fo, 0.3); text(cv, xx + ic.width / K + 16, yy, s, fo, 0.3, INK)
    boxes[f"b{i}"] = (xx, yy - 6, xx + ic.width / K + 16 + w, yy + cap(fo) + 6)
C = L["cta"]; fc = f(BOLD, C.get("size", 38)); h = C.get("h", 84); aw = 30; t_w = tw("SHOP NOW", fc, 3)
w = C.get("w") or (t_w + 2 * 38 + aw + 16); cx0 = C["x"] - (w if C.get("align") == "right" else 0); cy0 = C["bottom"] - h
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
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 1.0, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for q in (94, 92, 90, 88):
    out.save(L["out"], quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(L["out"]) <= 2_000_000: break
json.dump({k: [float(v) for v in b] for k, b in boxes.items()}, open(L["out"] + ".boxes.json", "w"))
print("saved", L["out"], out.size, os.path.getsize(L["out"]), "bytes")
