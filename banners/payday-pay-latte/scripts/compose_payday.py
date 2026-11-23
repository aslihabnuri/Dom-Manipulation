"""PAY LATTE payday banner. Typography on one left axis; smallest text 38 px (about 12 pt on a phone).
Hierarchy: 35% (digit height 21.94% of width) and PAY LATTE header > benefits > CTA."""
import sys, os, json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
sys.path.insert(0, "/home/user/Dom-Manipulation/banners/10.10-ube")
from compose import logo_rgba
FD = ROOT + "/assets/fonts/All Round Gothic/"
BOLD, DEMI = FD + "Fontspring-DEMO-allroundgothic-bold.otf", FD + "Fontspring-DEMO-allroundgothic-demi.otf"
K = 2
INK = (30, 10, 62); UBE = (78, 30, 146); WHITE = (255, 255, 255)
L = json.loads(sys.argv[1])
CW, CH = L["size"]

def f(path, size): return ImageFont.truetype(path, int(round(size * K)))
def cap(fnt): b = fnt.getbbox("H"); return (b[3] - b[1]) / K
def text(cv, x, y, s, fnt, tr=0, fill=INK):
    d = ImageDraw.Draw(cv); X = x * K; top = fnt.getbbox("H")[1]
    for c in s:
        d.text((X, y * K - top), c, font=fnt, fill=fill); X += fnt.getlength(c) + tr * K
    return (X - tr * K) / K - x

def pct_vec(digits, digit_h, color):
    """Digits from the Bold font + a vector % (locked in the DEMO font), figure height = digit_h px."""
    fb = ImageFont.truetype(BOLD, 400); b5 = fb.getbbox("5"); size = 400 * digit_h * K / (b5[3] - b5[1])
    fb = ImageFont.truetype(BOLD, int(round(size))); bb = [fb.getbbox(c) for c in digits]
    top = min(b[1] for b in bb); H = max(b[3] for b in bb) - top
    t = 0.135 * size; r = 0.142 * size; ring = 0.082 * size; wp = 0.60 * size; gap = 0.075 * size
    wd = sum(fb.getlength(c) for c in digits) - 0.02 * size * (len(digits) - 1)
    Wt = int(wd + gap + wp + 8); ss = 3
    lay = Image.new("RGBA", (Wt, int(H + 8)), (0, 0, 0, 0)); d = ImageDraw.Draw(lay); x = 0
    for c in digits:
        d.text((x, -top), c, font=fb, fill=color + (255,)); x += fb.getlength(c) - 0.02 * size
    m = Image.new("L", (int((wp + 4) * ss), int((H + 4) * ss)), 0); md = ImageDraw.Draw(m)
    Rr = r * ss; RI = (r - ring) * ss; c1 = (Rr + 2, Rr + 2); c2 = (wp * ss - Rr - 2, H * ss - Rr - 2)
    for c0 in (c1, c2):
        md.ellipse([c0[0] - Rr, c0[1] - Rr, c0[0] + Rr, c0[1] + Rr], fill=255); md.ellipse([c0[0] - RI, c0[1] - RI, c0[0] + RI, c0[1] + RI], fill=0)
    q1 = (wp * ss - r * 0.55 * ss, 0); q2 = (r * 0.55 * ss, H * ss); dx, dy = q2[0] - q1[0], q2[1] - q1[1]; Ln = math.hypot(dx, dy)
    nx, ny = -dy / Ln, dx / Ln; th = t * 0.72 / 2 * ss
    md.polygon([(q1[0] + nx * th, q1[1] + ny * th), (q1[0] - nx * th, q1[1] - ny * th), (q2[0] - nx * th, q2[1] - ny * th), (q2[0] + nx * th, q2[1] + ny * th)], fill=255)
    m = m.resize((int(wp + 4), int(H + 4)), Image.LANCZOS)
    col = Image.new("RGBA", m.size, color + (255,)); col.putalpha(m); lay.alpha_composite(col, (int(wd + gap), 0))
    return lay.crop(lay.getbbox())

def icon(kind, h, color):
    """Flat vector icons drawn on a 120x80 grid: delivery truck / voucher ticket."""
    ss = 8; W0, H0 = 120, 80
    m = Image.new("L", (W0 * ss, H0 * ss), 0); d = ImageDraw.Draw(m)
    def R(box, rad, fill=255): d.rounded_rectangle([v * ss for v in box], radius=rad * ss, fill=fill)
    def C(cx, cy, r, fill=255): d.ellipse([(cx - r) * ss, (cy - r) * ss, (cx + r) * ss, (cy + r) * ss], fill=fill)
    if kind == "truck":
        R((2, 10, 70, 58), 7)                                           # cargo box
        d.polygon([(v[0] * ss, v[1] * ss) for v in [(74, 24), (97, 24), (116, 42), (116, 58), (74, 58)]], fill=255)   # cab
        R((74, 24, 100, 58), 5); R((96, 40, 116, 58), 5)
        d.polygon([(v[0] * ss, v[1] * ss) for v in [(81, 30), (95, 30), (107, 42), (81, 42)]], fill=0)                # window
        for cx in (26, 94):
            C(cx, 60, 15.5, 0); C(cx, 60, 12); C(cx, 60, 4.6, 0)        # wheels with a gap ring
    else:
        R((2, 14, 118, 66), 9)                                          # ticket body
        C(2, 40, 10, 0); C(118, 40, 10, 0)                              # side notches
        for y in range(20, 64, 9): R((80.5, y, 84.5, y + 5), 2, 0)      # perforation
        d.polygon([(v[0] * ss, v[1] * ss) for v in [(36, 52), (60, 26), (64.5, 30), (40.5, 56)]], fill=0)             # small % mark
        C(37, 31, 7, 0); C(37, 31, 2.6); C(63, 51, 7, 0); C(63, 51, 2.6)
    w = round(h * K * W0 / H0); m = m.resize((w, int(h * K)), Image.LANCZOS)
    lay = Image.new("RGBA", m.size, color + (255,)); lay.putalpha(m); return lay

bg = Image.open(L["bg"]).convert("RGB")
cv = bg.resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")
x = L.get("x", 50)
# row 1: logo + campaign label
lg = logo_rgba(ROOT + "/assets/logo01.jpg"); lw = L.get("logo_w", 160) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
ly = L.get("logo_y", 36); cv.alpha_composite(lg, (int(x * K), int(ly * K)))
fl = f(BOLD, L.get("label", 38)); lh_ = lg.height / K
dx = x + L.get("logo_w", 160) + 22
ImageDraw.Draw(cv).rectangle([dx * K, (ly + 1) * K, (dx + 3) * K, (ly + lh_ - 1) * K], fill=INK)
wl = text(cv, dx + 24, ly + (lh_ - cap(fl)) / 2, "PAYDAY SALE", fl, 3, INK)
# header
fh = f(BOLD, L.get("head", 120)); hy = L.get("head_y", 96)
w1 = text(cv, x - 4, hy, "PAY ", fh, 0, INK); w2 = text(cv, x - 4 + w1, hy, "LATTE", fh, 0, UBE)
hb = hy + cap(fh)
# offer
fs = f(BOLD, L.get("du", 46)); dy = hb + L.get("gap_du", 40); text(cv, x, dy, "DISC UP TO", fs, 4, INK)
pct = pct_vec("35", 0.2194 * CW * 0.983, INK); py = dy + cap(fs) + L.get("gap_pct", 18)   # 0.983: calibrated on rendered pixels
cv.alpha_composite(pct, (int((x - 5) * K), int(py * K))); pb = py + pct.height / K
# benefits with vector icons
fo = f(DEMI, L.get("body", 42)); ih = L.get("icon_h", 40); oy = pb + L.get("gap_off", 44); row = L.get("row", 58)
for i, (kind, s) in enumerate([("truck", "Free ongkir"), ("ticket", "Voucher 15rb")]):
    yy = oy + i * row; ic = icon(kind, ih, INK)
    cv.alpha_composite(ic, (int(x * K), int((yy + cap(fo) / 2 - ih / 2) * K)))
    wt = text(cv, x + ic.width / K + 16, yy, s, fo, 0.3, INK)
ben_right = x + ic.width / K + 16 + wt
# CTA
cy = oy + row + cap(fo) + L.get("gap_cta", 40)
fc = f(BOLD, 38); tw = sum(fc.getlength(c) for c in "SHOP NOW") / K + 7 * 3; h = 84; pad = 38; aw = 30; w = tw + 2 * pad + aw + 16
pl = Image.new("RGBA", (int(w * K * 3), int(h * K * 3)), (0, 0, 0, 0))
ImageDraw.Draw(pl).rounded_rectangle([0, 0, pl.width - 1, pl.height - 1], radius=pl.height / 2, fill=INK + (255,))
cv.alpha_composite(pl.resize((int(w * K), int(h * K)), Image.LANCZOS), (int(x * K), int(cy * K)))
text(cv, x + pad, cy + (h - cap(fc)) / 2, "SHOP NOW", fc, 3, WHITE)
d = ImageDraw.Draw(cv); ax = (x + pad + tw + 10) * K; ay = (cy + h / 2) * K; Lr = aw * K; th = int(5 * K)
d.line([(ax, ay), (ax + Lr, ay)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay - Lr * 0.42), (ax + Lr + 1, ay + 1)], fill=WHITE, width=th)
d.line([(ax + Lr * 0.58, ay + Lr * 0.42), (ax + Lr + 1, ay - 1)], fill=WHITE, width=th)
boxes = dict(label=(dx + 24, ly, dx + 24 + wl, ly + lh_), header=(x - 4, hy, x - 4 + w1 + w2, hb), disc=(x, dy, x + 300, dy + cap(fs)),
             pct=(x - 5, py, x - 5 + pct.width / K, pb), benefits=(x, oy, ben_right, oy + row + cap(fo)), cta=(x, cy, x + w, cy + h))
print({k: tuple(round(v) for v in b) for k, b in boxes.items()})
out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 1.0, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for q in (94, 92, 90, 88):
    out.save(L["out"], quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(L["out"]) <= 2_000_000: break
json.dump({k: [float(v) for v in b] for k, b in boxes.items()}, open(L["out"] + ".boxes.json", "w"))
print("saved", L["out"], out.size, "q", q, os.path.getsize(L["out"]), "bytes")
