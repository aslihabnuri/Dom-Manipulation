#!/usr/bin/env python3
"""Nomukita 10.10 banner, revision 5: clean layout in the structure of the BIRU reference.
Three elements only: small logo, two-line headline, one quiet subline."""
import sys
from PIL import Image, ImageDraw
sys.path.insert(0, "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad")
from compose import font, draw_tracked, vector_45pct, ARG_BOLD, COMF_REG, CHAR
from compose2 import logo_variant, DEEP

INK = (70, 70, 68)


def headline_line2(img, d, x, y, size, color):
    """'Disc up to 45%.' with 45% drawn as vectors, all on one cap line."""
    fb = font(ARG_BOLD, size)
    w = draw_tracked(d, x, y, "Disc up to ", fb, size * -0.01, color)
    pct, H = vector_45pct(size, color)
    img.alpha_composite(pct, (int(x + w), int(y)))
    draw_tracked(d, x + w + pct.width + size * 0.04, y, ".", fb, 0, color)
    return w + pct.width


def build(src, out_base, mode, crop_anchor=0.55):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    if mode == "portrait":
        if W / H > 0.8:
            tw = int(H * 0.8); x0 = int((W - tw) * 0.5); im = im.crop((x0, 0, x0 + tw, H))
        else:
            th = int(W / 0.8); y0 = int((H - th) * crop_anchor); im = im.crop((0, y0, W, y0 + th))
        S = im.height / 1350.0
    else:
        th = int(W / 2); top = int((H - th) * 0.5); im = im.crop((0, top, W, top + th))
        S = im.height / 1000.0
    u = lambda v: v * S
    img = im.convert("RGBA")
    d = ImageDraw.Draw(img)
    x = u(64)

    # small logo, top-left (reference: brand mark small in the corner)
    logo = logo_variant(CHAR)
    lw = int(u(170)); logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(x), int(u(58))))
    d = ImageDraw.Draw(img)

    if mode == "portrait":
        hs = u(128); y = u(188)
        fb = font(ARG_BOLD, hs)
        draw_tracked(d, x, y, "10.10 Sale.", fb, hs * -0.01, DEEP)
        y2 = y + hs * 1.08
        headline_line2(img, d, x, y2, hs, DEEP)
        d = ImageDraw.Draw(img)
        fc = font(COMF_REG, u(30))
        draw_tracked(d, x + u(4), y2 + hs * 0.98, "gratis ongkir & voucher hingga 15rb, semua produk.", fc, u(0.4), INK)
    else:
        hs = u(96); y = u(320)
        fb = font(ARG_BOLD, hs)
        draw_tracked(d, x, y, "10.10 Sale.", fb, hs * -0.01, DEEP)
        y2 = y + hs * 1.08
        headline_line2(img, d, x, y2, hs, DEEP)
        d = ImageDraw.Draw(img)
        fc = font(COMF_REG, u(27))
        draw_tracked(d, x + u(4), y2 + hs * 0.98, "gratis ongkir & voucher hingga 15rb,", fc, u(0.4), INK)
        draw_tracked(d, x + u(4), y2 + hs * 0.98 + u(42), "semua produk.", fc, u(0.4), INK)

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    if mode == "portrait":
        out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.png")
        out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.jpg", quality=94)
    else:
        out.resize((2000, 1000), Image.LANCZOS).save(out_base + "_2000x1000.png")
        out.resize((1200, 600), Image.LANCZOS).save(out_base + "_1200x600.jpg", quality=94)
    print("saved", out_base)


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]) if len(sys.argv) > 4 else 0.55)
