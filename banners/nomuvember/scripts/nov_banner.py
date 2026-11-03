"""NOMUVEMBER store banner, 1:1 2000x2000. Scene = generated ube matcha latte + real Ube mockup (re-pasted).
Hierarchy: 25% (digit height = 21.94% of width, measured on himhim7_23) > product name > offers > CTA."""
import sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
sys.path.insert(0, ROOT)
import poster as P
from poster import font, text_width, draw_text, pct_block, pill_button, ARG_BOLD, ARG_DEMI, K

N = ROOT + "/nov"
W = 2000
INK = (30, 10, 62)            # deep ube ink: 5.3:1 on the 25% area, 6.7-8.7:1 on the left column
WHITE = (255, 255, 255)
LIME = (206, 240, 96)
L = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}

def erase_left_slice(im):
    """Remove the blurred ube slice at the left edge (it sits in the text column): rebuild the gradient
    from the clean column next to it, and the crushed ice from a patch to its right."""
    a = np.asarray(im).astype(np.float32)
    x0, x1, y0, y1, ice_y = 0, 250, 1225, 1760, 1648
    ref = a[y0:ice_y, 262:300].mean(axis=1, keepdims=True)            # per-row background colour
    rng = np.random.default_rng(4)
    a[y0:ice_y, x0:x1] = ref + rng.normal(0, 1.6, (ice_y - y0, x1 - x0, 1))
    a[ice_y:y1, x0:x1] = a[ice_y:y1, 300:300 + (x1 - x0)][:, ::-1]      # mirrored ice patch
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    # soften the seams
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).rectangle([x1 - 14, y0, x1 + 14, y1], fill=255)
    ImageDraw.Draw(m).rectangle([x0, ice_y - 16, x1 + 14, ice_y + 16], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(10))
    out = Image.composite(out.filter(ImageFilter.GaussianBlur(3)), out, m)
    return out

scene = Image.open(N + "/" + L.get("scene", "scene2_clean.png")).convert("RGB")
cv = scene.resize((W * K, W * K), Image.LANCZOS).convert("RGBA")

# ---- top block: logo, DISC UP TO, 25% ----
lg = P.logo_white(); lw = L.get("logo_w", 230) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
cv.alpha_composite(lg, (int(W * K / 2 - lg.width / 2), int(L.get("logo_y", 64) * K)))
fdu = font(ARG_BOLD, L.get("du_size", 50))
draw_text(cv, W / 2, L.get("du_y", 150), "DISC UP TO", fdu, L.get("du_tr", 12), fill=WHITE, align="center")
pct_size = 439 / 0.680          # union height of "2"+"5" = 0.680 em -> 439 px = 21.94% of 2000, as measured on the reference
pw, ph = pct_block(cv, W / 2 + L.get("pct_dx", 0), L.get("pct_y", 222), "25", pct_size, fill=INK, align="center")
print("25% block", round(pw), "x", round(ph), "digit height % of width", round(100 * ph / W, 2))

# ---- left column: campaign name (2nd in hierarchy) > offers > CTA ----
x = L.get("col_x", 82)
fc = font(ARG_BOLD, L.get("camp_size", 120)); ctr = L.get("camp_tr", -1); lh = L.get("camp_lh", 120)
cy0 = L.get("camp_y", 740)
chc = (fc.getbbox("H")[3] - fc.getbbox("H")[1]) / K
# NOMU with the brand half "MU" on a lime marker, then VEMBER, then SALE
wno = (fc.getlength("N") + fc.getlength("O")) / K + 2 * ctr
wmu = (fc.getlength("M") + fc.getlength("U")) / K + ctr
padx, pady = 14, 14
hl = Image.new("RGBA", (int((wmu + 2 * padx) * K), int((chc + 2 * pady) * K)), (0, 0, 0, 0))
ImageDraw.Draw(hl).rounded_rectangle([0, 0, hl.width - 1, hl.height - 1], radius=int(16 * K), fill=LIME + (255,))
hl = hl.rotate(-3, resample=Image.BICUBIC, expand=True)
cv.alpha_composite(hl, (int((x + wno - padx) * K) - int((hl.width - (wmu + 2 * padx) * K) / 2),
                        int((cy0 - pady) * K) - int((hl.height - (chc + 2 * pady) * K) / 2)))
widths = []
for i, line in enumerate(["NOMU", "VEMBER", "SALE"]):
    widths.append(draw_text(cv, x - 4, cy0 + i * lh, line, fc, ctr, fill=INK))
camp_bottom = cy0 + 2 * lh + chc
fo = font(ARG_DEMI, L.get("off_size", 46))
oy = camp_bottom + L.get("gap_off", 62)
draw_text(cv, x, oy, "Gratis ongkir", fo, 1, fill=INK)
draw_text(cv, x, oy + L.get("off_lh", 60), "Voucher hingga 15rb", fo, 1, fill=INK)
ctay = oy + L.get("off_lh", 60) + L.get("gap_cta", 92)
pill_button(cv, x, ctay, "SHOP NOW", L.get("cta_size", 40), L.get("cta_h", 94), L.get("cta_pad", 42), fill=INK, text=WHITE, arrow=True, tr=3)
print("campaign widest line", round(max(widths)), "right edge", round(x - 4 + max(widths)), "| blocks y: campaign", cy0, "-", round(camp_bottom),
      "offers", round(oy), "cta", round(ctay), "-", round(ctay + L.get("cta_h", 94)))

# splash crown in FRONT of the 25%: put the scene's violet splash pixels back over the type (depth, like the reference)
if L.get("splash_front", True):
    import cv2
    sc = np.asarray(scene).astype(np.float32)
    # splash = whatever stands out from the smooth local background (bg estimated with a wide median)
    bg = cv2.medianBlur(sc.astype(np.uint8), 61).astype(np.float32)
    dev = np.abs(sc - bg).max(axis=2)
    spl = dev > 22
    zone = np.zeros_like(spl); zone[470:720, 560:1600] = True
    spl = (spl & zone).astype(np.uint8)
    spl = cv2.morphologyEx(spl, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    spl = cv2.morphologyEx(spl, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    print("splash-in-front px", int(spl.sum()))
    m = cv2.GaussianBlur(spl.astype(np.float32), (0, 0), 0.9)
    m = Image.fromarray((m * 255).astype(np.uint8)).resize((W * K, W * K), Image.LANCZOS)
    front = scene.resize((W * K, W * K), Image.LANCZOS).convert("RGBA"); front.putalpha(m)
    cv.alpha_composite(front)
out = cv.convert("RGB").resize((W, W), Image.LANCZOS)
a = np.asarray(out).astype(np.float32)
a += np.random.default_rng(11).normal(0, 1.8, a.shape[:2])[..., None]
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
name = L.get("out", N + "/nomuvember-ube-matcha-latte.jpg")
for q in (92, 90, 88, 86, 84, 82, 80):
    out.save(name, quality=q, optimize=True, progressive=True, subsampling=0 if q >= 88 else 2)
    import os; sz = os.path.getsize(name)
    if sz <= 2_000_000: break
print("saved", name, out.size, "quality", q, "bytes", sz)
out.save(N + "/nov_full.png")
