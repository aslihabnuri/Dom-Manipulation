"""Toni Black payday banner (November): BACK IN THE BLACK. 1334x2000 (retina 2668x4000).
Logo + headline on the frosted window, SAVE UP TO / 35% on the free yellow wall to the right of the man,
FREE ONGKIR and VOUCHER NEW BUYERS 5K badges on the white appliance in the lower-left foreground."""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import binary_dilation
sys.path.insert(0, os.path.dirname(__file__))
from logo import make_logo
import badges, grade as G
F = os.environ.get("TB_FONTS", "fonts/static/")
C = (40, 40, 40)
BLK, BLD, ARB = "ZalandoSansExpanded-Black.ttf", "ZalandoSansExpanded-Bold.ttf", "Arimo-Bold.ttf"
def font(n, s): return ImageFont.truetype(F + n, int(s))
def ink(t, f, trk=0):
    im = Image.new("L", (int(f.size * (len(t) + 2)), int(f.size * 2)), 0); d = ImageDraw.Draw(im); x = f.size // 2
    for ch in t: d.text((x, f.size // 2), ch, font=f, fill=255); x += d.textlength(ch, font=f) + trk
    a = np.asarray(im) > 100; ys = np.where(a.any(1))[0]; xs = np.where(a.any(0))[0]
    return xs.min() - f.size // 2, ys.min() - f.size // 2, xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
def draw(d, t, f, x, ytop, trk=0, fill=C):
    dx, dy, w, h = ink(t, f, trk); xx = x - dx
    for ch in t: d.text((xx, ytop - dy), ch, font=f, fill=fill); xx += d.textlength(ch, font=f) + trk
    return w, h
def graded(im):
    a = np.asarray(im.convert("RGB")).astype(np.float64); lab = G.srgb_to_lab(a)
    L = np.clip(lab[..., 0] / 100, 0, 1); Lc = np.clip(0.5 + (L - 0.5) * 1.10 - 0.02, 0, 1); lab[..., 0] = Lc * 100; lab[..., 1:] *= 0.88
    lab[..., 2] -= 3.0 * np.clip((Lc - 0.6) / 0.4, 0, 1); return Image.fromarray(G.lab_to_srgb(lab).astype("uint8"))
def build(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, wall_y=(490, 1010)):
    # wall_y: the clean yellow wall to the right of the man, between the window sill and the laundry basket
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS); d = ImageDraw.Draw(cv)
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    halo = binary_dilation(sub, iterations=g(clear))
    def free(x0, y0, x1, y1): return not halo[max(0, int(y0)):int(y1), max(0, int(x0)):int(x1)].any()
    # logo
    lg = make_logo(C, 8 * k); lw = g(300); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS); ly = g(64)
    cv.paste(lg, ((W - lw) // 2, ly), lg)
    # headline: two lines, centred, the largest that stays clear of the head
    lines = ("BACK IN", "THE BLACK"); top = ly + lg.height + g(56)
    for sz in range(g(400), g(40), -g(2)):
        f = font(BLK, sz); trk = 0.01 * sz; ws = [ink(t, f, trk)[2] for t in lines]; cap = ink("H", f)[3]; lead = int(cap * 1.22)
        if max(ws) > W - 2 * M: continue
        bot = top + lead + cap
        if all(free((W - w) / 2, top + i * lead, (W + w) / 2, top + i * lead + cap) for i, w in enumerate(ws)): break
    for i, t in enumerate(lines): draw(d, t, f, (W - ws[i]) / 2, top + i * lead, trk)
    head_bot = top + lead + cap
    # offer block on the right wall: right-aligned to the margin, the largest 35% that fits beside the man
    fk = font(BLD, g(34)); tk = 0.16 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    best = None
    for sz in range(g(420), g(60), -g(2)):
        fn = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn, tn)[2:]; bh = kh + g(24) + nh; bw = max(nw, kw)
        for y in range(max(head_bot + g(72), g(wall_y[0]) + g(24)), g(wall_y[1]) - bh, g(8)):
            if free(W - M - bw, y, W - M, y + bh): best = (fn, tn, nw, nh, y, bw, bh); break
        if best: break
    fn, tn, nw, nh, oy, bw, bh = best
    draw(d, "SAVE UP TO", fk, W - M - kw, oy, tk); draw(d, "35%", fn, W - M - nw, oy + kh + g(24), tn)
    # badges on the white appliance, bottom-left, stacked
    bi = g(76); fb = font(ARB, g(28)); tb = 0.08 * fb.size; gap = g(22)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    pitch = bi + g(26); by = H - M - (len(rows) - 1) * pitch - bi
    for i, (icon, labs) in enumerate(rows):
        ic = icon(bi); y0 = by + i * pitch; cv.paste(ic, (M, y0), ic)
        lh = ink("H", fb)[3]; lg_ = int(lh * 0.55); tot = lh * len(labs) + lg_ * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, M + bi + gap, y0 + (bi - tot) / 2 + j * (lh + lg_), tb)
    bw2 = bi + gap + max(ink(t, fb, tb)[2] for r in rows for t in r[1])
    txt = np.zeros((H, W), bool); txt[by:H - M, M:M + bw2] = True
    print(f"{out}: headline {f.size}px cap {cap} {top}-{head_bot} | 35% {fn.size}px {nw}x{nh} at y {oy} | badges {by}-{H-M} x {M}-{M+bw2} | badge area touches figure: {bool((txt & halo).any())}")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv
if __name__ == "__main__":
    a = sys.argv; build(a[1], a[2], a[3], k=int(a[4]) if len(a) > 4 else 1)
