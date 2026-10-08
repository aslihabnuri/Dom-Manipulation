#!/usr/bin/env python3
"""Nomukita 10.10 banner, revision 3. 45% is the largest element, 10.10 second."""
import sys
from PIL import Image, ImageDraw
import numpy as np
sys.path.insert(0, "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad")
from compose import (font, tracked_width, draw_tracked, cap_height, pill, vector_45pct,
                     ARG_BOLD, ARG_DEMI, ROOT, BONE, CHAR, UBE)
from compose2 import logo_variant, DEEP


def top_veil(img, color, end_frac, strength):
    """Soft gradient from the top edge toward transparent, for type legibility on photos."""
    w, h = img.size
    y1 = int(h * end_frac)
    grad = Image.new("L", (1, h), 0)
    px = grad.load()
    for y in range(0, y1):
        t = 1 - y / y1
        px[0, y] = int(255 * strength * (t ** 1.3))
    grad = grad.resize((w, h))
    layer = Image.new("RGBA", (w, h), color + (255,))
    layer.putalpha(grad)
    img.alpha_composite(layer)


def bottom_veil(img, color, start_frac, strength):
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


PALETTES = {
    # type on light photos
    "light": dict(head=DEEP, label=CHAR, num=DEEP, pill_fill=UBE, pill_text=BONE, logo=CHAR,
                  veil=((248, 246, 242), 0.42, 0.55), bveil=((248, 246, 242), 0.84, 0.35)),
    # type on dark photos
    "dark": dict(head=BONE, label=(222, 214, 236), num=BONE, pill_fill=BONE, pill_text=DEEP, logo=BONE,
                 veil=((20, 12, 40), 0.42, 0.55), bveil=((20, 12, 40), 0.82, 0.6)),
}


def build_portrait(src, out_base, theme, crop_anchor=0.5, veil=True, align="center"):
    P = PALETTES[theme]
    im = Image.open(src).convert("RGB")
    W, H = im.size
    # crop to 4:5 using the full height if possible, else full width
    if W / H > 0.8:
        tw = int(H * 0.8); x0 = int((W - tw) * crop_anchor); im = im.crop((x0, 0, x0 + tw, H))
    else:
        th = int(W / 0.8); y0 = int((H - th) * crop_anchor); im = im.crop((0, y0, W, y0 + th))
    S = im.height / 1350.0
    u = lambda v: v * S
    img = im.convert("RGBA")
    cx = img.width / 2 if align == "center" else u(72)
    if veil:
        top_veil(img, *P["veil"])
        bottom_veil(img, *P["bveil"])

    logo = logo_variant(P["logo"])
    lw = int(u(300)); logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(cx - lw / 2) if align == "center" else int(cx), int(u(52))))
    d = ImageDraw.Draw(img)

    # 10.10 header (second largest)
    fb = font(ARG_BOLD, u(190))
    draw_tracked(d, cx, u(122), "10.10", fb, u(-4), P["head"], align=align)

    # DISC UP TO
    fl = font(ARG_DEMI, u(34))
    draw_tracked(d, cx, u(272), "DISC UP TO", fl, u(9), P["label"], align=align)

    # 45% hero, the largest element
    pct, Hh = vector_45pct(u(345), P["num"])
    img.alpha_composite(pct, (int(cx - pct.width / 2) if align == "center" else int(cx - u(4)), int(u(318))))
    d = ImageDraw.Draw(img)

    # SEMUA PRODUK
    draw_tracked(d, cx, u(318) + pct.height + u(26), "SEMUA PRODUK", fl, u(9), P["label"], align=align)

    # pills
    fp = font(ARG_DEMI, u(32))
    h = u(86); pad = u(42); gap = u(18); tr = u(5)
    items = ["GRATIS ONGKIR", "VOUCHER HINGGA 15RB"]
    widths = [tracked_width(fp, t, tr) + 2 * pad for t in items]
    total = sum(widths) + gap
    x = (cx - total / 2) if align == "center" else cx
    for t, w in zip(items, widths):
        pill(img, x + w / 2, u(1246), t, fp, tr, P["pill_fill"], P["pill_text"], pad, h)
        x += w + gap

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.jpg", quality=94)
    print("saved", out_base)


def build_landscape(src, out_base, theme, veil=True):
    P = PALETTES[theme]
    im = Image.open(src).convert("RGB")
    W, H = im.size
    th = int(W / 2); top = int((H - th) * 0.5); im = im.crop((0, top, W, top + th))
    S = im.height / 1000.0
    u = lambda v: v * S
    img = im.convert("RGBA")
    x0 = u(90)
    if veil:
        # left-side veil instead of top veil
        w, h = img.size
        grad = Image.new("L", (w, 1), 0); px = grad.load()
        x1 = int(w * 0.52)
        for x in range(0, x1):
            t = 1 - x / x1
            px[x, 0] = int(255 * P["veil"][2] * (t ** 1.2))
        grad = grad.resize((w, h))
        layer = Image.new("RGBA", (w, h), P["veil"][0] + (255,)); layer.putalpha(grad)
        img.alpha_composite(layer)

    logo = logo_variant(P["logo"])
    lw = int(u(250)); logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(x0), int(u(78))))
    d = ImageDraw.Draw(img)

    fb = font(ARG_BOLD, u(150))
    draw_tracked(d, x0 - u(3), u(205), "10.10", fb, u(-4), P["head"])
    fl = font(ARG_DEMI, u(28))
    draw_tracked(d, x0, u(330), "DISC UP TO", fl, u(8), P["label"])
    pct, Hh = vector_45pct(u(265), P["num"])
    img.alpha_composite(pct, (int(x0 - u(4)), int(u(372))))
    d = ImageDraw.Draw(img)
    draw_tracked(d, x0, u(372) + pct.height + u(22), "SEMUA PRODUK", fl, u(8), P["label"])

    fp = font(ARG_DEMI, u(28))
    h = u(76); pad = u(36); gap = u(16); tr = u(5)
    for t, yy in [("GRATIS ONGKIR", 735), ("VOUCHER HINGGA 15RB", 827)]:
        w = tracked_width(fp, t, tr) + 2 * pad
        pill(img, x0 + w / 2, u(yy), t, fp, tr, P["pill_fill"], P["pill_text"], pad, h)

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((2000, 1000), Image.LANCZOS).save(out_base + "_2000x1000.png")
    out.resize((1200, 600), Image.LANCZOS).save(out_base + "_1200x600.jpg", quality=94)
    print("saved", out_base)


if __name__ == "__main__":
    mode, src, out, theme = sys.argv[1:5]
    veil = (len(sys.argv) < 6) or sys.argv[5] != "noveil"
    if mode == "portrait":
        anchor = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
        align = sys.argv[7] if len(sys.argv) > 7 else "center"
        build_portrait(src, out, theme, crop_anchor=anchor, veil=veil, align=align)
    else:
        build_landscape(src, out, theme, veil=veil)
