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

if __name__ == "__main__":
    a = sys.argv; v6 = "--v6" in a; v5 = "--v5" in a; v4 = "--v4" in a; fn = build3 if ("--v3" in a or v4) else build2 if "--v2" in a else build; a = [x for x in a if x not in ("--v2", "--v3", "--v4")]
    kw = dict(branch=(0.86, 0.12), badges_top=True) if v4 else {}
    if v5: fn, kw = build5, {}; a = [x for x in a if x != "--v5"]
    if v6: fn, kw = build6, {}; a = [x for x in a if x != "--v6"]
    fn(a[1], a[2], a[3], k=int(a[4]) if len(a) > 4 else 1, **kw)
