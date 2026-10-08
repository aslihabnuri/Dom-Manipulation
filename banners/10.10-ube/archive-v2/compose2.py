#!/usr/bin/env python3
"""Nomukita 10.10 banner, revision 2.
Header 10.10 huge, lockup DISC UP TO / 45% / SEMUA PRODUK, two large benefit pills.
Themes: 'dark' (deep violet photo, bone-white type) and 'light' (sunlit photo, purple type).
"""
import sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
sys.path.insert(0, "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad")
from compose import (font, tracked_width, draw_tracked, cap_height, pill, logo_rgba, vector_45pct,
                     ARG_BOLD, ARG_DEMI, COMF_REG, ROOT, BONE, CHAR, UBE, UBE_LIGHT)

DEEP = (58, 40, 104)        # deep violet for type on light photos


def logo_variant(color):
    lg = logo_rgba(ROOT + "/assets/logo01.jpg")
    a = np.asarray(lg).astype(np.int16)
    dark = (a[..., :3].max(axis=2) < 120) & (a[..., 3] > 0)
    out = a.copy()
    out[dark, 0], out[dark, 1], out[dark, 2] = color
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def bottom_fade(img, color, start_frac, strength):
    """Darken/lighten the bottom of the image toward `color` for pill legibility."""
    w, h = img.size
    y0 = int(h * start_frac)
    grad = Image.new("L", (1, h), 0)
    px = grad.load()
    for y in range(y0, h):
        t = (y - y0) / max(1, h - y0)
        px[0, y] = int(255 * strength * (t ** 1.4))
    grad = grad.resize((w, h))
    layer = Image.new("RGBA", (w, h), color + (255,))
    layer.putalpha(grad)
    img.alpha_composite(layer)


def lockup(img, cx, y_top, S, col_label, col_num, num_size=150, label_size=27, gapu=26):
    """DISC UP TO | 45% | SEMUA PRODUK, labels vertically centred on the number."""
    u = lambda v: v * S
    d = ImageDraw.Draw(img)
    fl = font(ARG_DEMI, u(label_size))
    tr = u(6)
    pct, H = vector_45pct(u(num_size), col_num)
    wl = tracked_width(fl, "DISC UP TO", tr)
    wr = tracked_width(fl, "SEMUA PRODUK", tr)
    gap = u(gapu)
    total = wl + gap + pct.width + gap + wr
    x = cx - total / 2
    ch = cap_height(fl)
    ymid = y_top + pct.height / 2
    draw_tracked(d, x, ymid - ch / 2, "DISC UP TO", fl, tr, col_label)
    x += wl + gap
    img.alpha_composite(pct, (int(x), int(y_top)))
    x += pct.width + gap
    draw_tracked(d, x, ymid - ch / 2, "SEMUA PRODUK", fl, tr, col_label)
    return pct.height


def build_portrait(src, out_base, theme):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    tw = int(H * 0.8)
    im = im.crop(((W - tw) // 2, 0, (W - tw) // 2 + tw, H))
    S = im.height / 1350.0
    u = lambda v: v * S
    img = im.convert("RGBA")
    cx = img.width / 2

    if theme == "dark":
        col_head, col_label, col_num = BONE, (214, 206, 232), BONE
        pill_fill, pill_text = BONE, DEEP
        logo_col = BONE
        bottom_fade(img, (26, 14, 52), 0.80, 0.75)
    else:
        col_head, col_label, col_num = DEEP, CHAR, DEEP
        pill_fill, pill_text = UBE, BONE
        logo_col = CHAR

    # logo
    logo = logo_variant(logo_col)
    lw = int(u(300))
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(cx - lw / 2), int(u(52))))
    d = ImageDraw.Draw(img)

    # 10.10 header, huge
    fb = font(ARG_BOLD, u(300))
    draw_tracked(d, cx, u(128), "10.10", fb, u(-6), col_head, align="center")

    # lockup
    lockup(img, cx, u(352), S, col_label, col_num)

    # benefit pills, large
    fp = font(ARG_DEMI, u(30))
    h = u(82); pad = u(40); gap = u(18); tr = u(5)
    items = ["GRATIS ONGKIR", "VOUCHER HINGGA 15RB"]
    widths = [tracked_width(fp, t, tr) + 2 * pad for t in items]
    total = sum(widths) + gap
    x = cx - total / 2
    for t, w in zip(items, widths):
        pill(img, x + w / 2, u(1248), t, fp, tr, pill_fill, pill_text, pad, h)
        x += w + gap

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.jpg", quality=94)
    print("saved", out_base)


def build_landscape(src, out_base, theme):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    th = int(W / 2)
    top = int((H - th) * 0.5)
    im = im.crop((0, top, W, top + th))
    S = im.height / 1000.0
    u = lambda v: v * S
    img = im.convert("RGBA")
    x0 = u(90)

    if theme == "dark":
        col_head, col_label, col_num = BONE, (214, 206, 232), BONE
        pill_fill, pill_text = BONE, DEEP
        logo_col = BONE
    else:
        col_head, col_label, col_num = DEEP, CHAR, DEEP
        pill_fill, pill_text = UBE, BONE
        logo_col = CHAR

    logo = logo_variant(logo_col)
    lw = int(u(250))
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(x0), int(u(80))))
    d = ImageDraw.Draw(img)

    fb = font(ARG_BOLD, u(270))
    draw_tracked(d, x0 - u(4), u(250), "10.10", fb, u(-6), col_head)

    # lockup, left aligned
    fl = font(ARG_DEMI, u(26)); tr = u(6)
    pct, Hh = vector_45pct(u(120), col_num)
    y_top = u(470)
    ch = cap_height(fl)
    ymid = y_top + pct.height / 2
    x = x0
    wl = draw_tracked(d, x, ymid - ch / 2, "DISC UP TO", fl, tr, col_label)
    x += wl + u(22)
    img.alpha_composite(pct, (int(x), int(y_top)))
    x += pct.width + u(22)
    d = ImageDraw.Draw(img)
    draw_tracked(d, x, ymid - ch / 2, "SEMUA PRODUK", fl, tr, col_label)

    fp = font(ARG_DEMI, u(27))
    h = u(74); pad = u(36); gap = u(16); tr = u(5)
    x = x0
    for t in ["GRATIS ONGKIR", "VOUCHER HINGGA 15RB"]:
        w = tracked_width(fp, t, tr) + 2 * pad
        pill(img, x + w / 2, u(690), t, fp, tr, pill_fill, pill_text, pad, h)
        x += w + gap

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((2000, 1000), Image.LANCZOS).save(out_base + "_2000x1000.png")
    out.resize((1200, 600), Image.LANCZOS).save(out_base + "_1200x600.jpg", quality=94)
    print("saved", out_base)


if __name__ == "__main__":
    mode, src, out, theme = sys.argv[1:5]
    (build_portrait if mode == "portrait" else build_landscape)(src, out, theme)
