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

def build2(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=56, window_x=0.555, window_y=0.28, machine=(0.43, 0.595)):
    """Recreated layout: one left axis on the clean yellow wall. Logo, BACK IN / THE BLACK, then SAVE UP TO / 35%
    centred in the free band, then the two badges on the bottom margin. Every block keeps `clear` px from the man
    and stays left of the window frame."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS); d = ImageDraw.Draw(cv)
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    halo = binary_dilation(sub, iterations=g(clear))
    first = np.where(halo.any(1), halo.argmax(1), W)                       # first blocked column per row
    win = np.zeros(H, int) + W; win[: int(window_y * H)] = int(window_x * W) - g(40)
    win[int(machine[1] * H) - g(clear):] = int(machine[0] * W) - g(clear)  # the washing machine is not in the cut-out
    room = np.minimum(first, win) - M                                       # free width per row on the left axis
    lg = make_logo(C, 8 * k); lw = g(280); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS); ly = g(72)
    cv.paste(lg, (M, ly), lg)
    # headline: "BACK IN THE" as the lead-in, "BLACK" (the brand word) as large as the free wall allows
    top = ly + lg.height + g(72)
    fa = font(BLD, g(46)); ta = 0.06 * fa.size; aw, ah = ink("BACK IN THE", fa, ta)[2:]
    yb = top + ah + g(18)
    for sz in range(g(600), g(40), -g(2)):
        fbk = font(BLK, sz); tbk = -0.01 * sz; bkw, bkh = ink("BLACK", fbk, tbk)[2:]
        if room[yb:yb + bkh].min() >= bkw: break
    draw(d, "BACK IN THE", fa, M, top, ta); draw(d, "BLACK", fbk, M, yb, tbk); hb = yb + bkh
    # offer group: SAVE UP TO / 35% / badges, centred in the band between the headline and the bottom margin
    fk = font(BLD, g(32)); tk = 0.16 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    bi = g(72); fb = font(ARB, g(26)); tb = 0.08 * fb.size; gap = g(20); pitch = bi + g(24)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    bw = bi + gap + max(ink(t, fb, tb)[2] for r in rows for t in r[1]); bgh = pitch + bi
    lo, hi = hb + g(120), H - M; best = None
    for sz in range(g(500), g(60), -g(2)):
        fn = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn, tn)[2:]
        gh = kh + g(22) + nh + g(64) + bgh; mid = lo + (hi - lo - gh) // 2
        for y in [y for y in range(lo, hi - gh + 1, g(4)) if abs(y - mid) <= g(120)]:   # centred first, then as large as fits
            ny = y + kh + g(22); by_ = ny + nh + g(64)
            if room[y:ny + nh].min() >= max(nw, kw) and room[by_:by_ + bgh].min() >= bw: best = (fn, tn, nw, nh, y, ny, by_); break
        if best: break
    fn, tn, nw, nh, oy, ny, by = best
    draw(d, "SAVE UP TO", fk, M, oy, tk); draw(d, "35%", fn, M, ny, tn)
    for i, (icon, labs) in enumerate(rows):
        ic = icon(bi); y0 = by + i * pitch; cv.paste(ic, (M, y0), ic)
        lh = ink("H", fb)[3]; lg_ = int(lh * 0.55); tot = lh * len(labs) + lg_ * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, M + bi + gap, y0 + (bi - tot) / 2 + j * (lh + lg_), tb)
    cap = bkh; top = yb
    print(f"{out}: logo {ly} | BLACK {bkw}x{bkh} ends {hb} | 35% {nw}x{nh} at {ny} | group {oy}-{by+bgh} (space above {oy-hb}, below {H-M-by-bgh})")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv


def build3(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48,
           worktop=(0.32, 0.555), branch=(0.79, 0.12), pocket=(0.735, 0.335, 0.965, 0.545), badge=64, badges_top=False):
    """Laundry-room v2 (redesigned room). Masthead: BACK IN THE (lead-in, wide tracking) over BLACK (large, stopping
    before the olive branch). Left wall, which is tall and narrow: SAVE UP TO and a giant 35% set vertically, reading
    bottom to top like a book spine. Badges in the clean wall pocket between the shelf and the worktop on the right."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS).convert("RGBA")
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    block = sub.copy(); block[int(worktop[1] * H):, int(worktop[0] * W):] = True        # worktop, machine, basket
    halo = binary_dilation(block, iterations=g(clear)); first = np.where(halo.any(1), halo.argmax(1), W)
    room = first - M
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    lg = make_logo(C, 8 * k); lw = g(260); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS); ly = g(56)
    lay.paste(lg, (M, ly), lg)
    # masthead
    fa = font(BLD, g(34)); ta = 0.34 * fa.size; ah = ink("BACK IN THE", fa, ta)[3]; ya = ly + lg.height + g(56)
    draw(d, "BACK IN THE", fa, M, ya, ta)
    head = np.where(sub.any(1))[0].min(); yb = ya + ah + g(20); maxw = int(branch[0] * W) - g(clear) - M
    for sz in range(g(700), g(40), -g(2)):
        fb_ = font(BLK, sz); tb_ = -0.015 * sz; bw_, bh_ = ink("BLACK", fb_, tb_)[2:]
        if bw_ <= maxw and yb + bh_ <= min(head - g(clear), int(branch[1] * H) + g(400)): break
    draw(d, "BLACK", fb_, M, yb, tb_); mast_end = yb + bh_
    # vertical offer on the left wall: build horizontally, rotate 90 degrees counter-clockwise
    fk = font(BLD, g(30)); tk = 0.18 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    lo = mast_end + g(80); hi = H - M; best = None
    for sz in range(g(1200), g(80), -g(4)):
        fn_ = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn_, tn)[2:]
        thick = kh + g(22) + nh; length = max(nw, kw)              # after rotation: width = thick, height = length
        if length > hi - lo: continue
        y = hi - length
        if room[y:hi].min() >= thick: best = (fn_, tn, nw, nh, thick, length, y); break
    fn_, tn, nw, nh, thick, length, y = best
    blk = Image.new("RGBA", (length, thick), (0, 0, 0, 0)); bd = ImageDraw.Draw(blk)
    draw(bd, "SAVE UP TO", fk, 0, 0, tk); draw(bd, "35%", fn_, 0, kh + g(22), tn)
    rot = blk.rotate(90, expand=True)                                 # reads bottom to top; SAVE UP TO on the outside (left)
    lay.alpha_composite(rot, (M, y))
    # badges in the right pocket
    bi = g(badge); fbg = font(ARB, g(24 * badge / 64)); tbg = 0.08 * fbg.size; gap = g(18 * badge / 64); pitch = bi + g(22 * badge / 64)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    if badges_top:   # one row, right-aligned on the margin, centred on the logo's height: a header line opposite the logo
        bi = g(56); fbg = font(ARB, g(22)); tbg = 0.08 * fbg.size; gap = g(14); lh = ink("H", fbg)[3]; lg_ = int(lh * 0.55)
        items = []
        for icon, labs in rows:
            w = bi + gap + max(ink(t, fbg, tbg)[2] for t in labs); items.append((icon, labs, w))
        sep = g(40); total = sum(w for _, _, w in items) + sep * (len(items) - 1); x = W - M - total; yc = ly + lg.height / 2
        for icon, labs, w in items:
            ic = icon(bi); lay.paste(ic, (int(x), int(yc - bi / 2)), ic); tot = lh * len(labs) + lg_ * (len(labs) - 1)
            for j, t in enumerate(labs): draw(d, t, fbg, x + bi + gap, yc - tot / 2 + j * (lh + lg_), tbg)
            x += w + sep
        rows = ()
        bx, by, bw = W - M - total, int(yc - bi / 2), total
    px0, py0, px1, py1 = int(pocket[0] * W), int(pocket[1] * H), int(pocket[2] * W), int(pocket[3] * H)
    if rows:
        bw = bi + gap + max(ink(t, fbg, tbg)[2] for r in rows for t in r[1]); bgh = pitch + bi
        bx = min(max(px0, px1 - bw), W - M - bw); by = py0 + (py1 - py0 - bgh) // 2     # never past the right margin
    for i, (icon, labs) in enumerate(rows):
        ic = icon(bi); y0 = by + i * pitch; lay.paste(ic, (bx, y0), ic)
        lh = ink("H", fbg)[3]; lg_ = int(lh * 0.55); tot = lh * len(labs) + lg_ * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fbg, bx + bi + gap, y0 + (bi - tot) / 2 + j * (lh + lg_), tbg)
    hit = int(((np.asarray(lay.split()[3]) > 40) & binary_dilation(sub, iterations=g(32))).sum())
    cv.alpha_composite(lay)
    print(f"{out}: BLACK {bw_}x{bh_} ends {mast_end} (head {head}) | 35% vertical, cap {nh}, length {length}, block {thick}px wide at y {y}-{y+length} | badges {bx},{by} w {bw} | type within 32px of the man: {hit}")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv


def build5(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, jumper=(0.86, 0.0, 1.0, 0.74)):
    """Laundromat (Payday-Toni.jpg reference). The man sits in the upper half; the type is set on the open blue floor
    as a two-column grid between the margins: header line (BACK IN THE left, logo right), BLACK across the full
    measure, then SAVE UP TO / 35% left and the two badges right, bottom-aligned on the margin."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS).convert("RGBA")
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    block = sub.copy(); jx0, jy0, jx1, jy1 = [int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(jumper)]; block[jy0:jy1, jx0:jx1] = True
    halo = binary_dilation(block, iterations=g(clear))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    bottom = H - M
    # bottom row: offer (left) and badges (right)
    fk = font(BLD, g(28)); tk = 0.16 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    bi = g(60); fb = font(ARB, g(24)); tb = 0.08 * fb.size; gap = g(16); pitch = bi + g(18)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    bw = bi + gap + max(ink(t, fb, tb)[2] for r in rows for t in r[1]); bgh = pitch + bi
    fn_ = font(BLK, g(170)); tn = -0.02 * fn_.size; nw, nh = ink("35%", fn_, tn)[2:]
    while nw > W - 2 * M - bw - g(80): fn_ = font(BLK, fn_.size - g(2)); tn = -0.02 * fn_.size; nw, nh = ink("35%", fn_, tn)[2:]
    oh = kh + g(14) + nh; oy = bottom - oh
    draw(d, "SAVE UP TO", fk, M, oy, tk); draw(d, "35%", fn_, M, oy + kh + g(14), tn)
    by = bottom - bgh; bx = W - M - bw
    for i, (icon, labs) in enumerate(rows):
        ic = icon(bi); y0 = by + i * pitch; lay.paste(ic, (bx, y0), ic)
        lh = ink("H", fb)[3]; lg_ = int(lh * 0.55); tot = lh * len(labs) + lg_ * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, bx + bi + gap, y0 + (bi - tot) / 2 + j * (lh + lg_), tb)
    # left stack above the bottom row: logo, BACK IN THE, BLACK; BLACK as large as fits between the leg and the row
    fa = font(BLD, g(36)); ta = 0.30 * fa.size; aw, ah = ink("BACK IN THE", fa, ta)[2:]
    lg = make_logo(C, 8 * k); lw = g(250); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    row_top = min(oy, by) - g(64)
    for sz in range(g(400), g(40), -g(2)):
        fbk = font(BLK, sz); tbk = -0.015 * sz; bkw, bkh = ink("BLACK", fbk, tbk)[2:]
        if bkw > W - 2 * M: continue
        cols = halo[:row_top, M:M + max(bkw, lw, aw)]; hit_rows = np.where(cols.any(1))[0]
        top_free = hit_rows.max() + 1 if len(hit_rows) else 0          # first row below the man/jumper in the stack's own columns
        stack = lg.height + g(40) + ah + g(26) + bkh
        if row_top - stack >= top_free: break
    yb = row_top - bkh; ya = yb - g(26) - ah; yl = ya - g(40) - lg.height
    lay.paste(lg, (M, int(yl)), lg); draw(d, "BACK IN THE", fa, M, ya, ta); draw(d, "BLACK", fbk, M, yb, tbk)
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    cv.alpha_composite(lay)
    print(f"{out}: header y {ya} | BLACK {bkw}x{bkh} at {yb} | 35% {nw}x{nh} at {oy} | badges {bx},{by} | type within {clear}px of the man/jumper: {hit} | head top {np.where(sub.any(1))[0].min()}")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv


def build6(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, jumper=(0.86, 0.0, 1.0, 0.74), head_x=0.42, head_band=(1100, 1500)):
    """Laundromat, spread layout: the top stays pure photo (the man, the machines); the brand unit (logo over BACK IN THE
    over BLACK) sits on the open floor right of his legs; SAVE UP TO / 35% large bottom-left; badges bottom-right as the
    last stop. Three zones, each with its own job, instead of one block."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS).convert("RGBA")
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    block = sub.copy(); jx0, jy0, jx1, jy1 = [int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(jumper)]; block[jy0:jy1, jx0:jx1] = True
    halo = binary_dilation(block, iterations=g(clear))
    def free(x0, y0, x1, y1): return not halo[max(0, int(y0)):int(y1), max(0, int(x0)):int(x1)].any()
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    # 1 logo, top-right on the calm steel panel
    lg = make_logo(C, 8 * k); lw = g(250); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    # 2 brand unit on the open floor right of the legs: logo / BACK IN THE / BLACK, left-aligned on a second axis
    hx = int(head_x * W); y0, y1 = g(head_band[0]), g(head_band[1])
    fa = font(BLD, g(32)); ta = 0.30 * fa.size; aw, ah = ink("BACK IN THE", fa, ta)[2:]
    for sz in range(g(400), g(40), -g(2)):
        fbk = font(BLK, sz); tbk = -0.015 * sz; bkw, bkh = ink("BLACK", fbk, tbk)[2:]
        hh = lg.height + g(44) + ah + g(22) + bkh
        if hh > y1 - y0: continue
        ys = [y for y in range(y0, y1 - hh + 1, g(4)) if free(hx, y, hx + max(bkw, aw, lw), y + hh)]
        if ys: yh = ys[len(ys) // 2]; break
    lay.paste(lg, (hx, yh), lg); ya = yh + lg.height + g(44)
    draw(d, "BACK IN THE", fa, hx, ya, ta); draw(d, "BLACK", fbk, hx, ya + ah + g(22), tbk)
    # 4 badges, bottom-right, right-aligned on the margin
    bi = g(60); fb = font(ARB, g(24)); tb = 0.08 * fb.size; gap = g(16); pitch = bi + g(18)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    bw = bi + gap + max(ink(t, fb, tb)[2] for r in rows for t in r[1]); bgh = pitch + bi
    bx, by = W - M - bw, H - M - bgh
    for i, (icon, labs) in enumerate(rows):
        ic = icon(bi); yy = by + i * pitch; lay.paste(ic, (bx, yy), ic)
        lh = ink("H", fb)[3]; lg_ = int(lh * 0.55); tot = lh * len(labs) + lg_ * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, bx + bi + gap, yy + (bi - tot) / 2 + j * (lh + lg_), tb)
    # 3 offer, bottom-left: the largest SAVE UP TO / 35% that leaves 80 px to the badges
    fk = font(BLD, g(30)); tk = 0.16 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    for sz in range(g(500), g(60), -g(2)):
        fn_ = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn_, tn)[2:]
        if M + nw <= bx - g(80): break
    oy = H - M - (kh + g(16) + nh); draw(d, "SAVE UP TO", fk, M, oy, tk); draw(d, "35%", fn_, M, oy + kh + g(16), tn)
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    cv.alpha_composite(lay)
    print(f"{out}: headline at x {hx} y {yh}, BLACK {bkw}x{bkh} | 35% {nw}x{nh} at {oy} | badges {bx},{by} | type near man/jumper: {hit}")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

def inv_icon(ic):
    """Badge icon with the palette swapped (white disc, charcoal line) for use on the darkened floor."""
    a = np.asarray(ic).astype(np.int16); a[..., :3] = 295 - a[..., :3]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")

def burn(cv, y0, y1, lo, W, H):
    """Photographic burn of the floor toward the camera (linear-light multiply, hue kept): 1.0 above y0, easing to lo at y1."""
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    t = np.clip((np.arange(H) - y0) / (y1 - y0), 0, 1); t = t * t * (3 - 2 * t)
    f = (1 - (1 - lo) * t)[:, None, None]; lin = lin * f
    a = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055)
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8)).convert("RGBA")

def build7(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, jumper=(0.86, 0.0, 1.0, 0.735), burn_y=(1180, 1680), burn_lo=0.34):
    """v7, built on two typography references (Elam's structural systems, modular scale, Nix/Stocks finish):
    - System: bilateral masthead (logo alone, centred on the calm steel panel) + one axial footer on the left margin.
      Every footer element starts on x = M or ends on x = W - M; nothing floats on its own coordinate.
    - Contrast first: the blue floor is mid-tone (white 3.3:1, charcoal 4.5:1 at best), so the floor is burned
      toward the camera and the type goes white (#FFFFFF from the palette), >= 7:1 under every word.
    - Scale: one ratio, 1.5, from a 26 px base: 26 / 39 / 58 / 88 / 132 / 198 / 297 / 446. No off-scale size.
    - Hierarchy by size + weight + space: 35% (Black, 446) dominant; BACK IN THE BLACK (Black, 88) one line;
      SAVE UP TO (Bold 39, caps tracked) bound tight to 35%; badges (Arimo Bold 26) as the terminal stop.
    - Spacing is not uniform: kicker-to-number 0.33 x kicker cap; headline-to-offer group gap >= 3x that."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    WH = (255, 255, 255)
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS).convert("RGBA")
    cv = burn(cv, g(burn_y[0]), g(burn_y[1]), burn_lo, W, H)
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    block = sub.copy(); jx0, jy0, jx1, jy1 = [int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(jumper)]; block[jy0:jy1, jx0:jx1] = True
    halo = binary_dilation(block, iterations=g(clear))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    S = [g(26 * 1.5 ** i) for i in range(8)]  # 26 39 58 88 132 197 296 444
    # masthead: logo centred on the steel panel of machine 12, charcoal
    lg = make_logo(C, 8 * k); lw = g(260); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    lay.paste(lg, ((W - lw) // 2, g(100)), lg)
    # offer: SAVE UP TO (39) bound tight to 35% (296), on the left axis, 35% baseline on the bottom margin
    fn_ = font(BLK, S[6]); tn = -0.02 * fn_.size; nw, nh = ink("35%", fn_, tn)[2:]
    fk = font(BLD, S[1]); tk = 0.14 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]
    inner = int(kh * 0.9); ny = H - M - nh; ky = ny - inner - kh
    draw(d, "35%", fn_, M, ny, tn, WH); draw(d, "SAVE UP TO", fk, M, ky, tk, WH)
    # badges: right column, icon over label, everything flush right on x = W - M, last baseline on H - M
    bi = g(52); fb = font(ARB, S[0]); tb = 0.08 * fb.size; lh = ink("H", fb)[3]; lead = int(lh * 0.6); ig = g(12)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    hts = [bi + ig + lh * len(l) + lead * (len(l) - 1) for _, l in rows]
    bgap = (nh - sum(hts))  # the stack spans exactly the cap height of 35%: top on its cap line, bottom on its baseline
    yy = ny; bx = W - M - max(ink(t, fb, tb)[2] for _, l in rows for t in l)
    for (icon, labs), hgt in zip(rows, hts):
        ic = inv_icon(icon(bi)); lay.paste(ic, (W - M - bi, yy), ic)
        for j, t in enumerate(labs):
            tw = ink(t, fb, tb)[2]; draw(d, t, fb, W - M - tw, yy + bi + ig + j * (lh + lead), tb, WH)
        yy += hgt + bgap
    # headline: one line, Black 88, tracked so it spans the full measure M .. W - M (it sets the frame both axes hang on)
    fh = font(BLK, S[3]); meas = W - 2 * M; n = len("BACK IN THE BLACK") - 1
    w0 = ink("BACK IN THE BLACK", fh, 0)[2]; th = (meas - w0) / n; hw, hh = ink("BACK IN THE BLACK", fh, th)[2:]
    for gg in (2.6, 2.4, 2.2, 2.0):  # group gap 2x-2.6x the kicker gap, largest that keeps the 48 px clearance to the jumper
        hy = ky - int(inner * gg) - hh
        if not halo[hy:hy + hh, M:W - M].any(): break
    draw(d, "BACK IN THE BLACK", fh, M, hy, th, WH)
    print(f"track headline {th / fh.size:.3f} em, 35% right edge {M + nw}, badge col x {bx}, group gap {ky - hy - hh} vs inner {inner}")
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    # contrast audit under the type
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255; lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    Lr = lin @ np.array([0.2126, 0.7152, 0.0722]); m = np.asarray(lay.split()[3]) > 128
    m[:g(400)] = False; worst = np.percentile(Lr[m], 95); cr = 1.05 / (worst + 0.05)
    cv.alpha_composite(lay)
    print(f"{out}: sizes 35%={fn_.size} head={fh.size} kicker={fk.size} badge={fb.size} | head y {hy} w {hw} | 35% {nw}x{nh} | badges x {bx} | near man/jumper {hit} | white CR (p95 bg) {cr:.1f}:1")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

def build8(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, jumper=(0.80, 0.66, 1.0, 0.80), burn_y=(1420, 1880), burn_lo=0.34):
    """v8, four corners around the man (photo pay13: the same scene outpainted upward, so a plain wall sits above the machines).
    - Top-left, charcoal on the wall: BACK IN THE (Bold 39, tracked) over BLACK (Black 197).
    - Top-right: logo 6.png in #282828, its top on the same line as BACK IN THE.
    - Bottom-left, white on the burned floor: SAVE UP TO (Bold 39) over 35% (Black 296), the dominant element.
    - Bottom-right: the two badges, icon over label, flush right, spanning exactly the cap height of 35%.
    Two axes (x = M and x = W - M), two bands (wall and floor), one 1.5 scale. Colour follows the ground:
    charcoal where the ground is light, white where it is dark."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    WH = (255, 255, 255)
    cv = graded(Image.open(photo)).resize((W, H), Image.LANCZOS).convert("RGBA")
    cv = burn(cv, g(burn_y[0]), g(burn_y[1]), burn_lo, W, H)
    sub = np.asarray(Image.open(cutout).split()[3].resize((W, H), Image.LANCZOS)) > 128
    block = sub.copy(); jx0, jy0, jx1, jy1 = [int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(jumper)]; block[jy0:jy1, jx0:jx1] = True
    halo = binary_dilation(block, iterations=g(clear))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    S = [g(26 * 1.5 ** i) for i in range(8)]
    # top-left headline, charcoal
    fk = font(BLD, S[1]); tk = 0.14 * fk.size; kw, kh = ink("BACK IN THE", fk, tk)[2:]; inner = int(kh * 0.9)
    fh = font(BLK, S[5]); th = -0.01 * fh.size; hw, hh = ink("BLACK", fh, th)[2:]
    draw(d, "BACK IN THE", fk, M, M, tk); draw(d, "BLACK", fh, M, M + kh + inner, th)
    # top-right logo, top on the same line
    lg = make_logo(C, 8 * k); lw = g(240); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    lay.paste(lg, (W - M - lw, M), lg)
    # bottom-left offer, white
    fn_ = font(BLK, S[6]); tn = -0.02 * fn_.size; nw, nh = ink("35%", fn_, tn)[2:]
    ny = H - M - nh; ky = ny - inner - kh
    draw(d, "35%", fn_, M, ny, tn, WH); draw(d, "SAVE UP TO", fk, M, ky, tk, WH)
    # bottom-right badges, icon over label, flush right, spanning the cap height of 35%
    bi = g(52); fb = font(ARB, S[0]); tb = 0.08 * fb.size; lh = ink("H", fb)[3]; lead = int(lh * 0.6); ig = g(12)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    hts = [bi + ig + lh * len(l) + lead * (len(l) - 1) for _, l in rows]; bgap = nh - sum(hts); yy = ny
    bx = W - M - max(ink(t, fb, tb)[2] for _, l in rows for t in l)
    for (icon, labs), hgt in zip(rows, hts):
        ic = inv_icon(icon(bi)); lay.paste(ic, (W - M - bi, yy), ic)
        for j, t in enumerate(labs):
            tw = ink(t, fb, tb)[2]; draw(d, t, fb, W - M - tw, yy + bi + ig + j * (lh + lead), tb, WH)
        yy += hgt + bgap
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255; lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    Lr = lin @ np.array([0.2126, 0.7152, 0.0722]); m = np.asarray(lay.split()[3]) > 128
    top = m.copy(); top[H // 2:] = False; bot = m.copy(); bot[:H // 2] = False
    crt = (np.percentile(Lr[top], 5) + 0.05) / 0.0712; crb = 1.05 / (np.percentile(Lr[bot], 95) + 0.05)
    cv.alpha_composite(lay)
    print(f"{out}: BLACK {hw}x{hh} (bottom {M + kh + inner + hh}) | 35% {nw}x{nh} at {ky}-{H - M} | badges x {bx} | near man/jumper {hit} | CR top charcoal {crt:.1f}:1, bottom white {crb:.1f}:1")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

def build9(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, zoom=1.12, burn_y=(1460, 1880), burn_lo=0.34):
    """v9: no empty field beside the man. Photo pay13 with the knitted jumper removed (floor cloned in perspective),
    zoomed 1.12 from the top-left so the man is larger and the empty floor shrinks.
    - Top band (wall, charcoal): BACK IN THE / BLACK flush left; logo over the two badges in one column flush right.
    - Beside the man (floor, white): SAVE UP TO / 35% flush right, filling the floor right of his legs.
    Axes: x = M and x = W - M. Scale 1.5 from 26 px."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    WH = (255, 255, 255); zw, zh = int(W * zoom), int(H * zoom)
    cv = graded(Image.open(photo)).resize((zw, zh), Image.LANCZOS).crop((0, 0, W, H)).convert("RGBA")
    cv = burn(cv, g(burn_y[0]), g(burn_y[1]), burn_lo, W, H)
    sub = np.asarray(Image.open(cutout).split()[3].resize((zw, zh), Image.LANCZOS))[:H, :W] > 128
    halo = binary_dilation(sub, iterations=g(clear))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    S = [g(26 * 1.5 ** i) for i in range(8)]
    # top-left headline, charcoal
    fk = font(BLD, S[1]); tk = 0.14 * fk.size; kw, kh = ink("BACK IN THE", fk, tk)[2:]; inner = int(kh * 0.9)
    fh = font(BLK, S[5]); th = -0.01 * fh.size; hw, hh = ink("BLACK", fh, th)[2:]
    draw(d, "BACK IN THE", fk, M, M, tk); draw(d, "BLACK", fh, M, M + kh + inner, th)
    # top-right column: logo, then the badges (charcoal discs), all flush right
    lg = make_logo(C, 8 * k); lw = g(240); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    lay.paste(lg, (W - M - lw, M), lg)
    bi = g(52); fb = font(ARB, S[0]); tb = 0.08 * fb.size; lh = ink("H", fb)[3]; lead = int(lh * 0.6); ig = g(12)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    yy = M + kh + inner  # first badge starts on the cap line of BLACK
    hts = [bi + ig + lh * len(l) + lead * (len(l) - 1) for _, l in rows]; bgap = g(30)
    bx = W - M - max(ink(t, fb, tb)[2] for _, l in rows for t in l)
    for (icon, labs), hgt in zip(rows, hts):
        ic = icon(bi); lay.paste(ic, (W - M - bi, yy), ic)
        for j, t in enumerate(labs):
            tw = ink(t, fb, tb)[2]; draw(d, t, fb, W - M - tw, yy + bi + ig + j * (lh + lead), tb)
        yy += hgt + bgap
    badge_bottom = yy - bgap
    # beside the man: offer, white, flush right, 35% baseline on the bottom margin
    fn_ = font(BLK, S[6]); tn = -0.02 * fn_.size; nw, nh = ink("35%", fn_, tn)[2:]
    ny = H - M - nh; ky = ny - inner - kh
    draw(d, "35%", fn_, W - M - nw, ny, tn, WH); draw(d, "SAVE UP TO", fk, W - M - kw, ky, tk, WH)
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255; lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    Lr = lin @ np.array([0.2126, 0.7152, 0.0722]); m = np.asarray(lay.split()[3]) > 128
    top = m.copy(); top[H // 2:] = False; bot = m.copy(); bot[:H // 2] = False
    crt = (np.percentile(Lr[top], 5) + 0.05) / 0.0712; crb = 1.05 / (np.percentile(Lr[bot], 95) + 0.05)
    cv.alpha_composite(lay)
    print(f"{out}: BLACK {hw} wide ends x {M + hw} | badge col x {bx}, bottom {badge_bottom} | 35% x {W - M - nw} y {ky}-{H - M} | near man {hit} | CR top {crt:.1f}:1, bottom {crb:.1f}:1")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

def build10(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, zoom=1.12, burn_y=(1380, 1820), burn_lo=0.34, wall_mid=480):
    """v10: the wall is used edge to edge and top to bottom; the offer group fills the floor beside the man.
    - Wall: row 1 = BACK IN THE (left) and the logo (right) on one line; row 2 = BLACK set to the full measure.
      The block is centred in the wall: equal space above it and below it (to the machine tops at mid-width).
    - Floor beside the legs, flush right, white: the two badges in one row, SAVE UP TO, 35%.
    Two display sizes outside the text scale, both set by fit: BLACK fills the measure, 35% fills the floor beside the legs
    and stays the larger of the two (cap 245 vs 197)."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    WH = (255, 255, 255); zw, zh = int(W * zoom), int(H * zoom)
    cv = graded(Image.open(photo)).resize((zw, zh), Image.LANCZOS).crop((0, 0, W, H)).convert("RGBA")
    cv = burn(cv, g(burn_y[0]), g(burn_y[1]), burn_lo, W, H)
    sub = np.asarray(Image.open(cutout).split()[3].resize((zw, zh), Image.LANCZOS))[:H, :W] > 128
    halo = binary_dilation(sub, iterations=g(clear))
    def free(x0, y0, x1, y1): return not halo[max(0, int(y0)):int(y1), max(0, int(x0)):int(x1)].any()
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    S = [g(26 * 1.5 ** i) for i in range(8)]
    # wall block
    fk = font(BLD, S[1]); tk = 0.14 * fk.size; kw, kh = ink("BACK IN THE", fk, tk)[2:]; inner = int(kh * 0.9)
    for sz in range(g(300), g(100), -g(2)):
        fh = font(BLK, sz); th = -0.01 * sz; hw, hh = ink("BLACK", fh, th)[2:]
        if hw <= W - 2 * M: break
    bh = kh + inner + hh; top = (g(wall_mid) - bh) // 2
    draw(d, "BACK IN THE", fk, M, top, tk); draw(d, "BLACK", fh, M, top + kh + inner, th)
    lg = make_logo(C, 8 * k); lw = g(240); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    lay.paste(lg, (W - M - lw, top), lg)
    # floor group, flush right: 35% as large as the floor beside the legs allows
    for sz in range(g(360), g(200), -g(2)):
        fn_ = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn_, tn)[2:]
        if free(W - M - nw, H - M - nh, W - M, H - M): break
    ny = H - M - nh; ky = ny - inner - kh
    draw(d, "35%", fn_, W - M - nw, ny, tn, WH); draw(d, "SAVE UP TO", fk, W - M - kw, ky, tk, WH)
    bi = g(52); fb = font(ARB, S[0]); tb = 0.08 * fb.size; lh = ink("H", fb)[3]; lead = int(lh * 0.6); gap = g(14); bsep = g(48)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    widths = [bi + gap + max(ink(t, fb, tb)[2] for t in l) for _, l in rows]; rw = sum(widths) + bsep
    by = ky - inner * 2 - bi; bx = W - M - rw
    x = bx
    for (icon, labs), wdt in zip(rows, widths):
        ic = inv_icon(icon(bi)); lay.paste(ic, (x, by), ic)
        tot = lh * len(labs) + lead * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, x + bi + gap, by + (bi - tot) / 2 + j * (lh + lead), tb, WH)
        x += wdt + bsep
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255; lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    Lr = lin @ np.array([0.2126, 0.7152, 0.0722]); m = np.asarray(lay.split()[3]) > 128
    tp = m.copy(); tp[H // 2:] = False; bt = m.copy(); bt[:H // 2] = False
    crt = (np.percentile(Lr[tp], 5) + 0.05) / 0.0712; crb = 1.05 / (np.percentile(Lr[bt], 95) + 0.05)
    cv.alpha_composite(lay)
    print(f"{out}: wall block y {top}-{top + bh} | BLACK font {fh.size} {hw}x{hh} | 35% font {fn_.size} {nw}x{nh} x {W - M - nw} | badges x {bx} y {by} | near man {hit} | CR top {crt:.1f}:1 bottom {crb:.1f}:1")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

def build11(photo, cutout, out, k=1, W=1334, H=2000, M=80, clear=48, zoom=1.30, off=(100, 110), burn_y=(1380, 1820), burn_lo=0.34, wall_mid_src=429, cap_ratio=0.80):
    """v11: tighter crop on the man (zoom 1.30 from (100, 110) in the 1334x2000 frame of the photo, +16% over v10)
    so the singlet and boxer briefs read clearly; the badges move to the bottom.
    - Wall: BACK IN THE + logo on one line, BLACK below, block centred in the wall.
    - Floor, flush right, white: SAVE UP TO, 35%, and the badge row on the bottom margin.
    35% is set as large as the floor beside the legs allows; BLACK is then capped at 0.80 x the cap height of 35%
    so the offer stays the dominant element."""
    g = lambda v: int(round(v * k)); W, H, M = W * k, H * k, M * k
    WH = (255, 255, 255); zw, zh = int(W * zoom), int(H * zoom); ox, oy = int(off[0] * zoom * k), int(off[1] * zoom * k)
    cv = graded(Image.open(photo)).resize((zw, zh), Image.LANCZOS).crop((ox, oy, ox + W, oy + H)).convert("RGBA")
    cv = burn(cv, g(burn_y[0]), g(burn_y[1]), burn_lo, W, H)
    sub = np.asarray(Image.open(cutout).split()[3].resize((zw, zh), Image.LANCZOS))[oy:oy + H, ox:ox + W] > 128
    halo = binary_dilation(sub, iterations=g(clear))
    def free(x0, y0, x1, y1): return not halo[max(0, int(y0)):int(y1), max(0, int(x0)):int(x1)].any()
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    S = [g(26 * 1.5 ** i) for i in range(8)]
    fk = font(BLD, S[1]); tk = 0.14 * fk.size; kw, kh = ink("SAVE UP TO", fk, tk)[2:]; inner = int(kh * 0.9)
    # badge row on the bottom margin, flush right
    bi = g(52); fb = font(ARB, S[0]); tb = 0.08 * fb.size; lh = ink("H", fb)[3]; lead = int(lh * 0.6); gap = g(14); bsep = g(48)
    rows = ((badges.truck, ["FREE ONGKIR"]), (badges.ticket, ["VOUCHER", "NEW BUYERS 5K"]))
    widths = [bi + gap + max(ink(t, fb, tb)[2] for t in l) for _, l in rows]; rw = sum(widths) + bsep
    by = H - M - bi; bx = W - M - rw
    # 35% and SAVE UP TO above the badge row
    for sz in range(g(360), g(150), -g(2)):
        fn_ = font(BLK, sz); tn = -0.02 * sz; nw, nh = ink("35%", fn_, tn)[2:]
        ny = by - 2 * inner - nh; ky = ny - inner - kh
        if free(W - M - nw, ny, W - M, ny + nh) and free(W - M - kw, ky, W - M, ky + kh) and free(bx, by, W - M, by + bi): break
    # wall block
    tkb = 0.14 * fk.size; bkw, bkh = ink("BACK IN THE", fk, tkb)[2:]
    for sz in range(g(300), g(100), -g(2)):
        fh = font(BLK, sz); th = -0.01 * sz; hw, hh = ink("BLACK", fh, th)[2:]
        if hw <= W - 2 * M and hh <= cap_ratio * nh: break
    wall_mid = int((wall_mid_src - off[1]) * zoom * k); bh = bkh + inner + hh; top = max(M, (wall_mid - bh) // 2)
    draw(d, "BACK IN THE", fk, M, top, tkb); draw(d, "BLACK", fh, M, top + bkh + inner, th)
    lg = make_logo(C, 8 * k); lw = g(240); lg = lg.resize((lw, int(lg.height * lw / lg.width)), Image.LANCZOS)
    lay.paste(lg, (W - M - lw, top), lg)
    draw(d, "35%", fn_, W - M - nw, ny, tn, WH); draw(d, "SAVE UP TO", fk, W - M - kw, ky, tk, WH)
    x = bx
    for (icon, labs), wdt in zip(rows, widths):
        ic = inv_icon(icon(bi)); lay.paste(ic, (x, by), ic)
        tot = lh * len(labs) + lead * (len(labs) - 1)
        for j, t in enumerate(labs): draw(d, t, fb, x + bi + gap, by + (bi - tot) / 2 + j * (lh + lead), tb, WH)
        x += wdt + bsep
    hit = int(((np.asarray(lay.split()[3]) > 40) & halo).sum())
    a = np.asarray(cv.convert("RGB")).astype(np.float32) / 255; lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    Lr = lin @ np.array([0.2126, 0.7152, 0.0722]); m = np.asarray(lay.split()[3]) > 128
    tp = m.copy(); tp[H // 2:] = False; bt = m.copy(); bt[:H // 2] = False
    crt = (np.percentile(Lr[tp], 5) + 0.05) / 0.0712; crb = 1.05 / (np.percentile(Lr[bt], 95) + 0.05)
    ys, xs = np.where(sub)
    cv.alpha_composite(lay)
    print(f"{out}: man {ys.max() - ys.min()} px tall, x {xs.min()}-{xs.max()} | wall mid {wall_mid}, block y {top}-{top + bh} | BLACK {fh.size} {hw}x{hh} | 35% {fn_.size} {nw}x{nh} y {ny} | badges x {bx} y {by} | near man {hit} | CR top {crt:.1f} bottom {crb:.1f}")
    cv.convert("RGB").save(out, quality=92, optimize=True, progressive=True); return cv

if __name__ == "__main__":
    a = sys.argv; v6 = "--v6" in a; v5 = "--v5" in a; v4 = "--v4" in a; fn = build3 if ("--v3" in a or v4) else build2 if "--v2" in a else build; a = [x for x in a if x not in ("--v2", "--v3", "--v4")]
    kw = dict(branch=(0.86, 0.12), badges_top=True) if v4 else {}
    if v5: fn, kw = build5, {}; a = [x for x in a if x != "--v5"]
    if v6: fn, kw = build6, {}; a = [x for x in a if x != "--v6"]
    if "--v7" in a: fn, kw = build7, {}; a = [x for x in a if x != "--v7"]
    if "--v8" in a: fn, kw = build8, {}; a = [x for x in a if x != "--v8"]
    if "--v9" in a: fn, kw = build9, {}; a = [x for x in a if x != "--v9"]
    if "--v10" in a: fn, kw = build10, {}; a = [x for x in a if x != "--v10"]
    if "--v11" in a: fn, kw = build11, {}; a = [x for x in a if x != "--v11"]
    fn(a[1], a[2], a[3], k=int(a[4]) if len(a) > 4 else 1, **kw)
