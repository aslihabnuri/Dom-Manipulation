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

scene = Image.open(N + "/scene2000_clean.png").convert("RGB")   # left ube slice removed (see clean step)
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

# ---- left column ----
x = L.get("col_x", 96)
y = L.get("lab_y", 792)
flab = font(ARG_BOLD, L.get("lab_size", 48)); tr = L.get("lab_tr", 3)
pre, mid, post = "NO", "MU", "VEMBER SALE"
wpre = text_width(flab, pre, tr) / K + tr; wmid = text_width(flab, mid, tr) / K
chl = (flab.getbbox("H")[3] - flab.getbbox("H")[1]) / K
hl = Image.new("RGBA", (int((wmid + 22) * K), int((chl + 22) * K)), (0, 0, 0, 0))
ImageDraw.Draw(hl).rounded_rectangle([0, 0, hl.width - 1, hl.height - 1], radius=int(10 * K), fill=LIME + (255,))
hl = hl.rotate(-3, resample=Image.BICUBIC, expand=True)
cv.alpha_composite(hl, (int((x + wpre - 8) * K), int((y - 11) * K) - int((hl.height - (chl + 22) * K) / 2)))
draw_text(cv, x, y, pre + mid + post, flab, tr, fill=INK)

fp = font(ARG_BOLD, L.get("prod_size", 128)); lh = L.get("prod_lh", 118)
py = L.get("prod_y", 870)
for i, line in enumerate(["UBE", "MATCHA", "LATTE"]):
    draw_text(cv, x - 4, py + i * lh, line, fp, L.get("prod_tr", 0), fill=INK)
chp = (fp.getbbox("H")[3] - fp.getbbox("H")[1]) / K
prod_bottom = py + 2 * lh + chp
fo = font(ARG_DEMI, L.get("off_size", 46))
oy = prod_bottom + L.get("gap_off", 66)
draw_text(cv, x, oy, "Gratis ongkir", fo, 1, fill=INK)
draw_text(cv, x, oy + L.get("off_lh", 62), "Voucher hingga 15rb", fo, 1, fill=INK)
cy = oy + L.get("off_lh", 62) + L.get("gap_cta", 104)
pill_button(cv, x, cy, "SHOP NOW", L.get("cta_size", 40), L.get("cta_h", 98), L.get("cta_pad", 44), fill=INK, text=WHITE, arrow=True, tr=3)
print("blocks y: label", y, "product", py, "-", round(prod_bottom), "offers", round(oy), "cta", round(cy), "-", round(cy + L.get("cta_h", 98)))

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
