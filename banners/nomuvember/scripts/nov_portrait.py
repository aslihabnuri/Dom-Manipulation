"""NOMUVEMBER store banner, 2:3 1080x1620 (same size as himhim7_23.jpg).
Hierarchy: 25% (digit block = 21.94% of width = 237 px) > NOMUVEMBER SALE > offers > CTA."""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
sys.path.insert(0, ROOT)
import poster as P
from poster import font, text_width, draw_text, pct_block, pill_button, ARG_BOLD, ARG_DEMI, K
N = ROOT + "/nov"
CW, CH = 1080, 1620
INK = (30, 10, 62); WHITE = (255, 255, 255); LIME = (206, 240, 96)
L = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
bg = Image.open(N + "/portrait_bg.png").convert("RGB")
cv = bg.resize((CW * K, CH * K), Image.LANCZOS).convert("RGBA")

# top: logo, DISC UP TO, 25%
lg = P.logo_white(); lw = L.get("logo_w", 128) * K
lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
cv.alpha_composite(lg, (int(CW * K / 2 - lg.width / 2), int(L.get("logo_y", 36) * K)))
draw_text(cv, CW / 2, L.get("du_y", 88), "DISC UP TO", font(ARG_BOLD, L.get("du_size", 28)), L.get("du_tr", 7), fill=WHITE, align="center")
digit_h = 0.2194 * CW                              # 237 px, measured ratio from the reference
pct_block(cv, CW / 2, L.get("pct_y", 132), "25", digit_h / 0.680, fill=WHITE, align="center")   # white: 5.2:1 here, ink only 2.2:1 (measured)

# middle-left: campaign name, two lines, MU on a lime marker
x = L.get("col_x", 44)
fc = font(ARG_BOLD, L.get("camp_size", 116)); ctr = L.get("camp_tr", -1); lh = L.get("camp_lh", 116)
cy0 = L.get("camp_y", 452)
chc = (fc.getbbox("H")[3] - fc.getbbox("H")[1]) / K
wno = (fc.getlength("N") + fc.getlength("O")) / K + 2 * ctr
wmu = (fc.getlength("M") + fc.getlength("U")) / K + ctr
padx, pady = 9, 9
hl = Image.new("RGBA", (int((wmu + 2 * padx) * K), int((chc + 2 * pady) * K)), (0, 0, 0, 0))
ImageDraw.Draw(hl).rounded_rectangle([0, 0, hl.width - 1, hl.height - 1], radius=int(11 * K), fill=LIME + (255,))
hl = hl.rotate(-3, resample=Image.BICUBIC, expand=True)
cv.alpha_composite(hl, (int((x - 3 + wno - padx) * K) - int((hl.width - (wmu + 2 * padx) * K) / 2),
                        int((cy0 - pady) * K) - int((hl.height - (chc + 2 * pady) * K) / 2)))
w1 = draw_text(cv, x - 3, cy0, "NOMUVEMBER", fc, ctr, fill=INK)
draw_text(cv, x - 3, cy0 + lh, "SALE", fc, ctr, fill=INK)
camp_bottom = cy0 + lh + chc

# lower-left: offers + CTA
fo = font(ARG_DEMI, L.get("off_size", 28))
oy = L.get("off_y", 1040)
draw_text(cv, x, oy, "Gratis ongkir", fo, 0.5, fill=INK)
draw_text(cv, x, oy + L.get("off_lh", 40), "Voucher hingga 15rb", fo, 0.5, fill=INK)
ctay = oy + L.get("off_lh", 40) + L.get("gap_cta", 62)
pill_button(cv, x, ctay, "SHOP NOW", L.get("cta_size", 25), L.get("cta_h", 62), L.get("cta_pad", 28), fill=INK, text=WHITE, arrow=True, tr=2)
print(f"campaign line width {w1:.0f} (right edge {x - 3 + w1:.0f}), y {cy0}-{camp_bottom:.0f} | offers {oy} | cta {ctay}-{ctay + L.get('cta_h', 62)}")

out = cv.convert("RGB").resize((CW, CH), Image.LANCZOS)
a = np.asarray(out).astype(np.float32) + np.random.default_rng(11).normal(0, 1.6, (CH, CW, 1))
out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
name = L.get("out", N + "/nomuvember-ube-matcha-latte-1080x1620.jpg")
for q in (94, 92, 90, 88, 85):
    out.save(name, quality=q, optimize=True, progressive=True, subsampling=0)
    if os.path.getsize(name) <= 2_000_000: break
print("saved", name, out.size, "q", q, os.path.getsize(name), "bytes")
