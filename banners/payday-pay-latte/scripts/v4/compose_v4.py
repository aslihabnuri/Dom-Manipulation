"""PAY LATTE v4: clean typography + real 250 g pouches.
Type: ONE left-aligned column (x = L.x), three groups separated by equal gaps:
  [PAYDAY SALE / PAY LATTE]   [DISC UP TO / 35%]   [benefits / SHOP NOW]
Only four sizes: label 36 (caps, tracked), headline, 35% (digit height 21.94% of width), body 38."""
import sys, os, json
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
from ptools import *
L = json.loads(sys.argv[1]); CW, CH = L["size"]; X = L["x"]
plate = Image.open(L["bg"]).convert("RGB")
# ---------- real 250 g pouches ----------
def pouch(name):
    p = Image.open(ROOT + f"/assets/nomukita-{name}-250g.png").convert("RGBA"); a = np.asarray(p).astype(np.int16)
    al = a[..., 3].copy(); al[(al < 250) & (a[..., :3].max(axis=2) < 120)] = 0       # strip the mockup's own shadow
    a[..., 3] = al; p = Image.fromarray(a.astype(np.uint8), "RGBA"); return p
BW = L["pouch_w"]; sc = BW / 755.0                                                   # body = x 150..905 of the 1000 px mockup
sh_layer = np.zeros((CH, CW), np.float32); pouches = []
for name, bx in zip(("ube", "matcha-latte"), L["pouch_x"]):
    p = pouch(name); p = p.resize((round(p.width * sc), round(p.height * sc)), Image.LANCZOS)
    ox = round(bx - 150 * sc); oy = round(L["pouch_base"] - 782 * sc)                 # body bottom = y 782 of the mockup
    pouches.append((p, ox, oy))
    # floating shadow: soft ellipse a little below the base + faint ambient under the body
    cx = bx + BW / 2; by = L["pouch_base"] + L.get("float", 26)
    m = Image.new("L", (CW, CH), 0); d = ImageDraw.Draw(m)
    d.ellipse([cx - BW * 0.46, by - 10, cx + BW * 0.46, by + 18], fill=255)
    sh_layer = np.maximum(sh_layer, cv2.GaussianBlur(np.asarray(m).astype(np.float32) / 255, (0, 0), 14))
P = np.asarray(plate).astype(np.float32)
shade = np.array([84, 70, 104], np.float32)
P = P * (1 - sh_layer[..., None] * L.get("sh_op", 0.30)) + shade * sh_layer[..., None] * L.get("sh_op", 0.30)
cv = Image.fromarray(np.clip(P, 0, 255).astype(np.uint8)).convert("RGBA")
for p, ox, oy in pouches:
    a = np.asarray(p).astype(np.float32)
    # integrate: a whisper of the sky colour on the white film, darker toward the bottom (ambient occlusion)
    sky = np.asarray(plate.crop((ox, oy, ox + p.width, oy + p.height)).resize((1, 1), Image.BOX)).reshape(3).astype(np.float32)
    ys = np.linspace(0, 1, p.height)[:, None, None]
    a[..., :3] = a[..., :3] * (0.95 + 0.05 * sky / 255) * (1 - 0.06 * np.clip((ys - 0.7) / 0.3, 0, 1))
    cv.alpha_composite(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA"), (ox, oy))
cv = cv.resize((CW * K, CH * K), Image.LANCZOS)
boxes = {}
def tw(s, fnt, tr=0): return sum(fnt.getlength(c) for c in s) / K + tr * (len(s) - 1)
def put(key, s, fnt, y, tr=0, fill=INK, x=X):
    text(cv, x, y, s, fnt, tr, fill); w = tw(s, fnt, tr); boxes[key] = (x, y, x + w, y + cap(fnt)); return y + cap(fnt)
# logo (top-left, outside the column)
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 160) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS); cv.alpha_composite(lg, (int(40 * K), int(L.get("logo_y", 40) * K)))
fl = f(BOLD, L.get("label", 36)); TR = L.get("label_tr", 5)
# group 1
y = put("PAYDAY SALE", "PAYDAY SALE", fl, L["y1"], TR)
fh = f(BOLD, L["head"]); y += L.get("g_in", 24)
if L.get("stack"):
    y = put("PAY", "PAY", fh, y - 4, 0, INK, X - 6) + L.get("lead", 22); y = put("LATTE", "LATTE", fh, y, 0, UBE, X - 6)
else:
    wp = tw("PAY ", fh); put("PAY", "PAY", fh, y, 0, INK, X - 6); y = put("LATTE", "LATTE", fh, y, 0, UBE, X - 6 + wp)
g1 = y
# group 2
y = put("DISC UP TO", "DISC UP TO", fl, L["y2"], TR) + L.get("g_in", 24) - 6
pct = pct_vec("35", 0.2194 * CW * 0.983, INK); cv.alpha_composite(pct, (int((X - 6) * K), int(y * K)))
boxes["35%"] = (X - 6, y, X - 6 + pct.width / K, y + pct.height / K); y += pct.height / K
# group 3
fo = f(DEMI, L.get("body", 38)); ih = L.get("icon_h", 34); y3 = L["y3"]
if L.get("inline"):
    x = X; items = [("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]
    for i, (kind, s) in enumerate(items):
        ic = icon(kind, ih, INK); cv.alpha_composite(ic, (int(x * K), int((y3 + cap(fo) / 2 - ih / 2) * K)))
        wt = tw(s, fo, 0.3); text(cv, x + ic.width / K + 14, y3, s, fo, 0.3, INK); boxes[f"b{i}"] = (x, y3 - 4, x + ic.width / K + 14 + wt, y3 + cap(fo) + 4)
        x = x + ic.width / K + 14 + wt + L.get("sep", 36)
    yb = y3 + cap(fo)
else:
    for i, (kind, s) in enumerate([("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]):
        yy = y3 + i * L.get("lead_b", 56); ic = icon(kind, ih, INK)
        cv.alpha_composite(ic, (int(X * K), int((yy + cap(fo) / 2 - ih / 2) * K)))
        wt = tw(s, fo, 0.3); text(cv, X + ic.width / K + 14, yy, s, fo, 0.3, INK); boxes[f"b{i}"] = (X, yy - 4, X + ic.width / K + 14 + wt, yy + cap(fo) + 4)
    yb = yy + cap(fo)
fc = f(BOLD, L.get("cta_size", 34)); h = L.get("cta_h", 78); aw = 26; t_w = tw("SHOP NOW", fc, 3); w = t_w + 2 * 36 + aw + 14
cy0 = yb + L.get("g_cta", 40); cx0 = X
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(cx0 * K), int(cy0 * K)))
tx = cx0 + 36; text(cv, tx, cy0 + (h - cap(fc)) / 2, "SHOP NOW", fc, 3, WHITE)
d = ImageDraw.Draw(cv); ax = (tx + t_w + 14) * K; ay = (cy0 + h / 2) * K; Lr = aw * K; th = int(4.5 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
boxes["cta"] = (cx0, cy0, cx0 + w, cy0 + h)
for k, (p, ox, oy) in zip(("pouch_ube", "pouch_matcha"), pouches): boxes[k] = (ox, oy, ox + p.width, oy + p.height)
print({k: tuple(round(v) for v in b) for k, b in boxes.items()})
print(f"group ends: g1 {g1:.0f} | g2 {boxes['35%'][3]:.0f} | cta {cy0 + h:.0f} | pouch top {min(b[1] for k, b in boxes.items() if k.startswith('pouch')):.0f}")
out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 0.8, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for q in (94, 92, 90):
    out.save(L["out"], quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(L["out"]) <= 2_000_000: break
json.dump({k: [float(v) for v in b] for k, b in boxes.items()}, open(L["out"] + ".boxes.json", "w"))
print("saved", L["out"], out.size, os.path.getsize(L["out"]), "bytes")
