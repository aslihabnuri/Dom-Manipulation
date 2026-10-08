#!/usr/bin/env python3
"""Nomukita 10.10 UBE DAY banner compositor.
All typography is rendered programmatically with the brand font files
(All Round Gothic DEMO, Comfortaa, Shippori Mincho). Characters locked in the
DEMO font ('4', '%', '-') are drawn as vector shapes matched to the Bold stroke.
"""
import sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
FD = ROOT + "/assets/fonts/"
ARG_BOLD = FD + "All Round Gothic/Fontspring-DEMO-allroundgothic-bold.otf"
ARG_DEMI = FD + "All Round Gothic/Fontspring-DEMO-allroundgothic-demi.otf"
COMF_REG = FD + "Comforta/Comfortaa-Regular.ttf"
COMF_MED = FD + "Comforta/Comfortaa-Medium.ttf"
SHIPPORI = FD + "shippori/ShipporiMincho-Regular.ttf"

BONE = (241, 240, 235)
CHAR = (28, 28, 28)
UBE = (104, 85, 158)        # sampled from pouch teardrop, darker edge
UBE_LIGHT = (124, 107, 171)  # sampled from pouch teardrop, fill
INK_SOFT = (96, 96, 94)
KANJI_SOFT = (190, 186, 196)

SS = 4  # supersample factor for vector shapes


# ---------- helpers ----------
def font(path, size):
    return ImageFont.truetype(path, int(round(size)))


def tracked_width(fnt, text, tracking):
    w = 0
    for i, ch in enumerate(text):
        w += fnt.getlength(ch)
        if i < len(text) - 1:
            w += tracking
    return w


def draw_tracked(draw, x, y, text, fnt, tracking, fill, align="left"):
    """Draw letterspaced text. y is the top of the cap/figure box (bbox-top aligned)."""
    w = tracked_width(fnt, text, tracking)
    if align == "center":
        x = x - w / 2
    elif align == "right":
        x = x - w
    # align the glyph tops: use bbox of a capital to compute offset
    top_off = fnt.getbbox("H")[1]
    cx = x
    for ch in text:
        draw.text((cx, y - top_off), ch, font=fnt, fill=fill)
        cx += fnt.getlength(ch) + tracking
    return w


def cap_height(fnt):
    b = fnt.getbbox("H")
    return b[3] - b[1]


def pill(img, cx, cy, text, fnt, tracking, fill, text_fill, pad_x, h, outline=None, stroke=0):
    draw = ImageDraw.Draw(img)
    w = tracked_width(fnt, text, tracking) + 2 * pad_x
    x0, y0 = cx - w / 2, cy - h / 2
    # supersampled rounded rect for crisp edges
    layer = Image.new("RGBA", (int(w * SS) + 8 * SS, int(h * SS) + 8 * SS), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    r = h / 2
    ld.rounded_rectangle([4 * SS, 4 * SS, 4 * SS + w * SS, 4 * SS + h * SS], radius=r * SS,
                         fill=(fill + (255,)) if fill else None,
                         outline=(outline + (255,)) if outline else None, width=int(stroke * SS))
    layer = layer.resize((int(w) + 8, int(h) + 8), Image.LANCZOS)
    img.alpha_composite(layer, (int(x0) - 4, int(y0) - 4))
    draw = ImageDraw.Draw(img)
    ch = cap_height(fnt)
    draw_tracked(draw, cx, cy - ch / 2, text, fnt, tracking, text_fill, align="center")
    return w


def logo_rgba(path):
    """Extract the nomukita logo from its white-background JPG into true RGBA."""
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    d = 255.0 - a.min(axis=2)           # distance from white
    alpha = np.clip(d * 1.15, 0, 255)
    alpha_n = np.clip(alpha / 255.0, 1e-3, 1)[..., None]
    # un-premultiply against white so the blue drop keeps its true colour
    col = (a - 255.0 * (1 - alpha_n)) / alpha_n
    col = np.clip(col, 0, 255)
    rgba = np.dstack([col, alpha]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    return out.crop(bbox)


def vector_45pct(size, color):
    """Return an RGBA image of '45%' with '5' from ARG Bold and '4', '%' as vectors."""
    fb = font(ARG_BOLD, size)
    b5 = fb.getbbox("5")
    H = b5[3] - b5[1]
    w5 = b5[2] - b5[0]
    t = 0.135 * size                       # measured stroke of ARG Bold
    w4 = w5 * 1.0
    wp = 0.60 * size                       # percent width
    gap = 0.045 * size
    total_w = w4 + gap + w5 + gap * 1.6 + wp
    W = int(total_w + 10)
    Hh = int(H + 10)
    layer = Image.new("RGBA", (W * SS, Hh * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = color + (255,)
    s = SS
    # ---- '4' ----
    x4 = 0
    stem_x = x4 + w4 * 0.60
    d.rectangle([stem_x * s, 0, (stem_x + t) * s, H * s], fill=c)                 # stem
    bar_y = H * 0.66
    d.rectangle([x4 * s, bar_y * s, (x4 + w4 * 0.97) * s, (bar_y + t * 0.92) * s], fill=c)  # crossbar
    # diagonal: thick polygon from stem top to bar left end
    p1 = (stem_x + t * 0.5, -t * 1.2)
    p2 = (x4 + t * 0.48, bar_y + t * 0.46)
    dx, dy = p2[0] - p1[0], p2[1] - p1[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L, dx / L
    th = t * 0.98 / 2
    poly = [(p1[0] + nx * th, p1[1] + ny * th), (p1[0] - nx * th, p1[1] - ny * th),
            (p2[0] - nx * th, p2[1] - ny * th), (p2[0] + nx * th, p2[1] + ny * th)]
    poly = [(px * s, py * s) for px, py in poly]
    d.polygon(poly, fill=c)
    # trim diagonal above the top line and left of x=0
    d.rectangle([-10 * s, -10 * s, W * s, -1], fill=(0, 0, 0, 0))
    # ---- '5' from the font ----
    x5 = w4 + gap
    f_layer = Image.new("RGBA", (W, Hh), (0, 0, 0, 0))
    fd = ImageDraw.Draw(f_layer)
    fd.text((x5 - b5[0], -b5[1]), "5", font=fb, fill=c)
    # ---- '%' ----
    xp = x5 + w5 + gap * 1.6
    r = 0.142 * size
    ring = 0.082 * size
    cy1 = r
    cy2 = H - r
    cx1 = xp + r
    cx2 = xp + wp - r
    d.ellipse([(cx1 - r) * s, (cy1 - r) * s, (cx1 + r) * s, (cy1 + r) * s], fill=c)
    d.ellipse([(cx1 - r + ring) * s, (cy1 - r + ring) * s, (cx1 + r - ring) * s, (cy1 + r - ring) * s], fill=(0, 0, 0, 0))
    d.ellipse([(cx2 - r) * s, (cy2 - r) * s, (cx2 + r) * s, (cy2 + r) * s], fill=c)
    d.ellipse([(cx2 - r + ring) * s, (cy2 - r + ring) * s, (cx2 + r - ring) * s, (cy2 + r - ring) * s], fill=(0, 0, 0, 0))
    # slash
    q1 = (xp + wp - r * 0.55, 0)
    q2 = (xp + r * 0.55, H)
    dx, dy = q2[0] - q1[0], q2[1] - q1[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L, dx / L
    th = t * 0.72 / 2
    poly = [(q1[0] + nx * th, q1[1] + ny * th), (q1[0] - nx * th, q1[1] - ny * th),
            (q2[0] - nx * th, q2[1] - ny * th), (q2[0] + nx * th, q2[1] + ny * th)]
    d.polygon([(px * s, py * s) for px, py in poly], fill=c)
    # clip to figure box
    d.rectangle([0, H * s + 1, W * s, Hh * s], fill=(0, 0, 0, 0))
    layer = layer.resize((W, Hh), Image.LANCZOS)
    layer.alpha_composite(f_layer)
    return layer.crop(layer.getbbox()), H


def normalize_background(im, target=BONE):
    """Shift neutral, bright background pixels toward bone white (brand rule 7.5)."""
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    lum = a.mean(axis=2)
    neutral = (a.max(axis=2) - a.min(axis=2)) < 14
    # weight ramps in from 196 to 222 luminance
    w = np.clip((lum - 168) / 22.0, 0, 1) * np.clip((250 - lum) / 8.0, 0, 1) * neutral
    # local background estimate: heavy blur of the image masked to bg pixels
    bgmask = (w > 0.98).astype(np.float32)
    PAD = 160
    def blur(x):
        xp = np.pad(x, PAD, mode="reflect")
        b = np.asarray(Image.fromarray(xp.astype(np.uint8)).filter(ImageFilter.GaussianBlur(60))).astype(np.float32)
        return b[PAD:-PAD, PAD:-PAD]
    num = np.dstack([blur(a[..., i] * bgmask) for i in range(3)])
    den = blur(bgmask * 255.0) / 255.0
    den = np.clip(den, 0.02, None)[..., None]
    bg_est = num / den
    shift = np.array(target, dtype=np.float32) - bg_est
    out = a + shift * w[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


# ---------- layouts ----------
def build_portrait(src, out_base):
    im = Image.open(src).convert("RGB")
    # crop to exact 4:5
    W, H = im.size
    tw = int(H * 0.8)
    im = im.crop(((W - tw) // 2, 0, (W - tw) // 2 + tw, H))
    im = normalize_background(im)
    S = im.height / 1350.0   # design units -> pixels
    img = im.convert("RGBA")
    d = ImageDraw.Draw(img)
    u = lambda v: v * S
    cx = img.width / 2

    # logo (brand rule: width 300, y = 52, centered)
    logo = logo_rgba(ROOT + "/assets/logo01.jpg")
    lw = int(u(300))
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(cx - lw / 2), int(u(52))))

    # katakana ウベ (decorative, smaller than headline)
    fk = font(SHIPPORI, u(26))
    d = ImageDraw.Draw(img)
    draw_tracked(d, cx, u(142), "ウベ", fk, u(6), KANJI_SOFT, align="center")

    # 10.10 hero date
    fb = font(ARG_BOLD, u(124))
    draw_tracked(d, cx, u(184), "10.10", fb, u(-2), UBE, align="center")

    # UBE DAY label (demi, tracked)
    fdm = font(ARG_DEMI, u(31))
    draw_tracked(d, cx, u(292), "UBE DAY", fdm, u(8), CHAR, align="center")

    # tagline (Comfortaa, lowercase)
    fc = font(COMF_REG, u(23))
    draw_tracked(d, cx, u(338), "ube latte ala café, seduh sendiri di rumah", fc, u(0.6), INK_SOFT, align="center")

    # thin divider
    d.line([(cx - u(22), u(390)), (cx + u(22), u(390))], fill=UBE_LIGHT, width=int(u(2)))

    # DISC UP TO + 45%
    fdm2 = font(ARG_DEMI, u(26))
    draw_tracked(d, cx, u(414), "DISC UP TO", fdm2, u(7), CHAR, align="center")
    pct, ph = vector_45pct(u(176), UBE)
    img.alpha_composite(pct, (int(cx - pct.width / 2), int(u(452))))

    # bottom pills
    fp = font(ARG_DEMI, u(21))
    y = u(1232)
    h = u(54)
    pad = u(28)
    gap = u(14)
    items = [("GRATIS ONGKIR", UBE, BONE), ("VOUCHER HINGGA 15RB", UBE, BONE), ("SHOP NOW", CHAR, BONE)]
    widths = [tracked_width(fp, t, u(5)) + 2 * pad for t, _, _ in items]
    total = sum(widths) + gap * (len(items) - 1)
    x = cx - total / 2
    for (t, fill, tf), w in zip(items, widths):
        pill(img, x + w / 2, y, t, fp, u(5), fill, tf, pad, h)
        x += w + gap

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.png")
    out.resize((1080, 1350), Image.LANCZOS).save(out_base + "_1080x1350.jpg", quality=94)
    print("saved", out_base, out.size)


def build_landscape(src, out_base):
    im = Image.open(src).convert("RGB")
    W, H = im.size
    th = int(W / 2)
    top = int((H - th) * 0.55)
    im = im.crop((0, top, W, top + th))
    im = normalize_background(im)
    S = im.height / 1000.0
    img = im.convert("RGBA")
    d = ImageDraw.Draw(img)
    u = lambda v: v * S
    x0 = u(96)

    logo = logo_rgba(ROOT + "/assets/logo01.jpg")
    lw = int(u(250))
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, (int(x0), int(u(84))))
    d = ImageDraw.Draw(img)
    d.line([(x0, u(178)), (x0 + u(44), u(178))], fill=UBE_LIGHT, width=int(u(3)))

    fk = font(SHIPPORI, u(24))
    draw_tracked(d, x0, u(300), "ウベ", fk, u(5), KANJI_SOFT)
    fdm = font(ARG_DEMI, u(34))
    draw_tracked(d, x0 + u(2), u(338), "10.10 UBE DAY", fdm, u(8), CHAR)
    fdm2 = font(ARG_DEMI, u(26))
    draw_tracked(d, x0 + u(2), u(400), "DISC UP TO", fdm2, u(7), CHAR)
    pct, ph = vector_45pct(u(250), UBE)
    img.alpha_composite(pct, (int(x0), int(u(440))))
    fc = font(COMF_REG, u(22))
    d = ImageDraw.Draw(img)
    draw_tracked(d, x0 + u(2), u(640), "ube latte ala café, seduh sendiri di rumah", fc, u(0.6), INK_SOFT)

    fp = font(ARG_DEMI, u(20))
    h = u(52); pad = u(26); gap = u(12)
    items = [("GRATIS ONGKIR", UBE, BONE), ("VOUCHER HINGGA 15RB", UBE, BONE)]
    x = x0
    for t, fill, tf in items:
        w = tracked_width(fp, t, u(5)) + 2 * pad
        pill(img, x + w / 2, u(738), t, fp, u(5), fill, tf, pad, h)
        x += w + gap
    w = tracked_width(fp, "SHOP NOW", u(5)) + 2 * pad
    pill(img, x0 + w / 2, u(812), "SHOP NOW", fp, u(5), CHAR, BONE, pad, h)

    out = img.convert("RGB")
    out.save(out_base + "_2K.png")
    out.resize((2000, 1000), Image.LANCZOS).save(out_base + "_2000x1000.png")
    out.resize((1200, 600), Image.LANCZOS).save(out_base + "_1200x600.jpg", quality=94)
    print("saved", out_base, out.size)


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "portrait":
        build_portrait(sys.argv[2], sys.argv[3])
    elif mode == "landscape":
        build_landscape(sys.argv[2], sys.argv[3])
    elif mode == "test45":
        pct, _ = vector_45pct(300, UBE)
        bg = Image.new("RGBA", (pct.width + 400, pct.height + 60), BONE + (255,))
        bg.alpha_composite(pct, (20, 30))
        fb = font(ARG_BOLD, 300)
        dd = ImageDraw.Draw(bg)
        dd.text((pct.width + 40, 30 - fb.getbbox("5")[1]), "15", font=fb, fill=CHAR)
        bg.convert("RGB").save(ROOT + "/test45.png")
