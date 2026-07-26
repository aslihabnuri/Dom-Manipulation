#!/usr/bin/env python3
"""
Nomukita - Carousel Slide 1 generator (Premium & Exclusive series).

Geometry, type sizes and colours are calibrated pixel-for-pixel against the
approved reference slides Uji_S1_500gr.png (single product) and
Uji_S1_500&30.png (combination), following
"Nomukita - Design System Carousel Marketplace".

Per brief:
  - one product = 3 slides (250 gram, 1000 gram, 250 gram & 1000 gram)
  - headline green for products whose name contains "Matcha", steel blue otherwise
  - non-origin products drop the JAS + USDA seals, the ORIGIN badge and the
    taste criteria; Halal Indonesia stays
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
PROD = os.path.join(ROOT, "prod")
ASSETS = os.path.join(ROOT, "assets")
OUT = os.path.join(ROOT, "out")

# ── 1. canvas ────────────────────────────────────────────────────────────────
W = H = 1024
BG = (241, 240, 235)

# ── 2. colours (sampled from the approved Uji slide) ─────────────────────────
MATCHA_GREEN = (127, 162, 67)
STEEL_BLUE = (94, 152, 189)
CHARCOAL = (29, 29, 30)
KANJI_GREY = (219, 218, 213)

# ── 3. type ──────────────────────────────────────────────────────────────────
F_HEAD = os.path.join(ROOT, "fonts/arg/All Round Gothic/Fontspring-DEMO-allroundgothic-bold.otf")
F_BODY = os.path.join(ROOT, "fonts/comfortaa/Comforta/Comfortaa-Regular.ttf")
F_BODY_BOLD = os.path.join(ROOT, "fonts/comfortaa/Comforta/Comfortaa-Bold.ttf")
F_JP = os.path.join(ROOT, "fonts/ShipporiMincho-Regular.ttf")

HEAD_SIZE = 74          # cap height 50 px, as on the reference
HEAD_MAX_W = 900        # 62 px margin each side
HEAD_TOP = 232          # cap top
SUB_SIZE = 32
SUB_TOP = 304           # ink top
KANJI_SIZE = 44
KANJI_TOP = 165         # ink top, matching the 抹茶 watermark on the reference

PHOTO_H = 440           # product height; the pair keeps the taller pouch at this
PHOTO_BOTTOM = 855      # baseline the product stands on, 26 px above the seal

LOGO_XY = (360, 48)
HALAL_TOP = 881
HALAL_H = 110

# The All Round Gothic DEMO licence locks '-', '–', '°', '4' and '&'
# (they render as a "DEMO" mark). Those glyphs are drawn in Comfortaa instead.
LOCKED = set("-–°4&")


# ── product table ────────────────────────────────────────────────────────────
# name .............. headline, exactly as briefed minus the series word
# series ............ shown in the sub-line as the grade, mirroring
#                     "ceremonial grade" on the Uji slide
# kanji ............. katakana as printed on the pouch itself
PRODUCTS = [
    dict(slug="MatchaLatte", head="MATCHA LATTE", series="premium",
         kanji="抹茶ラテ",
         p250="nomukita-matcha latte japanese.png",
         p1000="Mockup nomukita-Exclusive series-matcha latte.png"),
    dict(slug="PremixMatcha", head="PREMIX MATCHA", series="exclusive",
         kanji="抹茶",
         p250="nomukita-matcha japanese.png",
         p1000="Mockup nomukita-Exclusive series-matcha.png"),
    dict(slug="TehTarik", head="TEH TARIK", series="premium",
         kanji="テ・タリック",
         p250="nomukita-teh tarik-250g.png",
         p1000="Mockup nomukita-Exclusive series-Teh Tarik.png"),
    dict(slug="ChocolateSignature", head="CHOCOLATE SIGNATURE", series="exclusive",
         kanji="チョコレート",
         p250="nomukita-chocolate 250g.png",
         p1000="Mockup nomukita-Exclusive series-chocolate.png"),
    dict(slug="CookiesCream", head="COOKIES & CREAM", series="premium",
         kanji="クッキー＆クリーム",
         p250="nomukita-cookies & cream-250g.png",
         p1000="Mockup nomukita-Premium series-Cookies & Cream.png"),
    dict(slug="Charcoal", head="CHARCOAL", series="premium",
         kanji="チャコール",
         p250="nomukita-charcoal-250g.png",
         p1000="Mockup nomukita-Premium series-Charcoal.png"),
    dict(slug="Avocado", head="AVOCADO", series="premium",
         kanji="アボカド",
         p250="nomukita-premium avocado-250g.png",
         p1000="Mockup nomukita-Premium series-Avocado.png"),
    dict(slug="Vanilla", head="VANILLA", series="premium",
         kanji="バニラ",
         p250="nomukita-premium vanilla-250g.png",
         p1000="Mockup nomukita-Premium series-Vanilla.png"),
    dict(slug="MilkTea", head="MILK TEA", series="premium",
         kanji="ミルクティー",
         p250="nomukita-premium Milk Tea-250g.png",
         p1000="Mockup nomukita-Premium series-Milk Tea.png"),
    dict(slug="LemonTea", head="LEMON TEA", series="premium",
         kanji="レモンティー",
         p250="nomukita-lemon tea-250g.png",
         p1000="Mockup nomukita-Premium series-Lemon Tea.png"),
    dict(slug="FrappeBase", head="FRAPPE BASE", series="premium",
         kanji="フラッペベース",
         p250="nomukita-frappe base-250g.png",
         p1000="Mockup nomukita-Frappe Base.png"),
    dict(slug="LemonGrass", head="LEMON GRASS", series="premium",
         kanji="レモングラス",
         p250="nomukita-lemon grass 250g.png",
         p1000="Mockup nomukita-Premium series-Lemon Grass.png"),
]


def accent(name):
    """Matcha products keep the green headline, everything else uses the
    steel blue sampled from the rating drops on Uji slide 1."""
    return MATCHA_GREEN if "MATCHA" in name.upper() else STEEL_BLUE


# ── helpers ──────────────────────────────────────────────────────────────────
def ink(img):
    b = img.getbbox()
    return b if b else (0, 0, 0, 0)


def render_word(word, size, color):
    """A single word as a tight RGBA image plus its baseline offset.

    Words containing a licence-locked glyph fall back to Comfortaa Bold,
    scaled so its cap height matches All Round Gothic at the same size.
    """
    use_fallback = any(ch in LOCKED for ch in word)
    if use_fallback:
        arg = ImageFont.truetype(F_HEAD, size)
        probe = Image.new("L", (size * 3, size * 3), 0)
        ImageDraw.Draw(probe).text((size, size * 2), "H", font=arg, fill=255, anchor="ls")
        cap = ink(probe)[3] - ink(probe)[1]
        fb_size = size
        for _ in range(12):
            f = ImageFont.truetype(F_BODY_BOLD, fb_size)
            p = Image.new("L", (size * 4, size * 4), 0)
            ImageDraw.Draw(p).text((size, size * 3), "H", font=f, fill=255, anchor="ls")
            h = ink(p)[3] - ink(p)[1]
            if h == 0:
                break
            fb_size = max(1, round(fb_size * cap / h))
            if abs(h - cap) <= 1:
                break
        font = ImageFont.truetype(F_BODY_BOLD, fb_size)
    else:
        font = ImageFont.truetype(F_HEAD, size)

    pad = size * 2
    canvas = Image.new("RGBA", (int(font.getlength(word)) + pad * 2, size * 4), (0, 0, 0, 0))
    base_y = size * 3
    ImageDraw.Draw(canvas).text((pad, base_y), word, font=font, fill=color + (255,), anchor="ls")
    x0, y0, x1, y1 = ink(canvas)
    return canvas.crop((x0, y0, x1, y1)), base_y - y0, font.getlength(word)


def build_headline(text, size, color):
    """Compose a headline word by word so locked glyphs can swap fonts,
    keeping every word on a shared baseline."""
    arg = ImageFont.truetype(F_HEAD, size)
    space = arg.getlength(" ")
    parts = [render_word(w, size, color) for w in text.split(" ")]
    above = max(p[1] for p in parts)
    below = max(p[0].height - p[1] for p in parts)
    total_w = sum(p[0].width for p in parts) + space * (len(parts) - 1)
    strip = Image.new("RGBA", (int(round(total_w)) + 4, above + below), (0, 0, 0, 0))
    x = 0.0
    for img, top_to_base, _ in parts:
        strip.alpha_composite(img, (int(round(x)), above - top_to_base))
        x += img.width + space
    return strip.crop(ink(strip))


def draw_text_top(canvas, text, font, color, cx, top):
    """Draw centred on cx with the ink top pinned to `top`."""
    pad = 300
    probe = Image.new("L", (W + pad * 2, 400), 0)
    ImageDraw.Draw(probe).text((pad, 200), text, font=font, fill=255)
    b = ink(probe)
    layer = Image.new("RGBA", (W + pad * 2, H + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text(
        (pad + cx - (b[0] - pad + b[2] - pad) / 2, pad + top - (b[1] - 200)),
        text, font=font, fill=color + (255,),
    )
    canvas.alpha_composite(layer.crop((pad, pad, pad + W, pad + H)), (0, 0))


# ── white pouch on a near-white background ───────────────────────────────────
# The 250 g pouch renders almost flat: its paper sits at 238-252, brighter than
# the bone white behind it and with only ~14 points of shading, so it reads as a
# pasted rectangle rather than an object. The Matchamu reference solves the same
# white-on-white case by keeping the paper *below* the background (217-238 on a
# 255 background, roughly 27 points down) and carrying the form on a wide
# gradient. MODEL_* reproduces that: paper down to 215, shading widened 1.7x.
MODEL_TARGET = 215      # where the pouch paper lands, 26 points under the bone white
MODEL_GAIN = 1.7        # how far the shading is stretched around the paper tone
MODEL_PIVOT = 244       # measured median of the untouched pouch paper
MODEL_LO, MODEL_HI = 175, 235   # blend band; below it printed artwork is untouched


def model_white(img):
    """Give a white pouch volume against the bone white background, leaving the
    printed kanji, the blue mark and the label text at full strength."""
    a = np.array(img).astype(float)
    rgb = a[..., :3]
    lum = rgb.mean(2)
    t = np.clip((lum - MODEL_LO) / (MODEL_HI - MODEL_LO), 0, 1)
    w = t * t * (3 - 2 * t)                       # smoothstep, so the print is spared
    target = (1 - w) * lum + w * (MODEL_TARGET + (lum - MODEL_PIVOT) * MODEL_GAIN)
    factor = np.where(lum > 1, np.clip(target, 0, 255) / np.maximum(lum, 1e-6), 1.0)
    a[..., :3] = np.clip(rgb * factor[..., None], 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def contact_shadow(canvas, x, y, w, h, opacity=44, blur=22):
    """A soft ellipse at the base so the pouch sits on the surface."""
    layer = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(layer).ellipse(
        [x + w * 0.10, y + h - 14, x + w * 0.90, y + h + 16], fill=opacity
    )
    shadow = Image.new("RGBA", canvas.size, (126, 124, 116, 0))
    shadow.putalpha(layer.filter(ImageFilter.GaussianBlur(blur)))
    canvas.alpha_composite(shadow)


def place(canvas, path, box_h, cx=None, bottom=None, left=None, max_w=None, white=False):
    """Scale a mockup to `box_h` tall and drop it on the canvas."""
    im = Image.open(os.path.join(PROD, path)).convert("RGBA")
    im = im.crop(im.getbbox())
    scale = box_h / im.height
    if max_w and im.width * scale > max_w:
        scale = max_w / im.width
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    if white:
        im = model_white(im)
    x = left if left is not None else round(cx - im.width / 2)
    y = round(bottom - im.height)
    if white:
        contact_shadow(canvas, x, y, im.width, im.height)
    canvas.alpha_composite(im, (x, y))
    return x, y, im.width, im.height


# ── slide ────────────────────────────────────────────────────────────────────
def slide(product, variant):
    c = Image.new("RGBA", (W, H), BG + (255,))
    col = accent(product["head"])

    logo = Image.open(os.path.join(ASSETS, "logo_nomukita.png")).convert("RGBA")
    c.alpha_composite(logo, LOGO_XY)

    draw_text_top(c, product["kanji"], ImageFont.truetype(F_JP, KANJI_SIZE), KANJI_GREY,
                  W // 2, KANJI_TOP)

    head = build_headline(product["head"], HEAD_SIZE, col)
    if head.width > HEAD_MAX_W:
        head = build_headline(product["head"], round(HEAD_SIZE * HEAD_MAX_W / head.width), col)
    c.alpha_composite(head, ((W - head.width) // 2, HEAD_TOP))

    weight = {"250": "250 gram", "1000": "1000 gram", "combo": "250 gram & 1000 gram"}[variant]
    draw_text_top(c, f"{product['series']} grade · {weight}",
                  ImageFont.truetype(F_BODY, SUB_SIZE), CHARCOAL, W // 2, SUB_TOP)

    # with the criteria column and the origin badge gone the product owns the
    # full width, so it sits larger than on the Uji slide
    if variant == "250":
        place(c, product["p250"], PHOTO_H, cx=512, bottom=PHOTO_BOTTOM, max_w=HEAD_MAX_W, white=True)
    elif variant == "1000":
        place(c, product["p1000"], PHOTO_H, cx=512, bottom=PHOTO_BOTTOM)
    else:
        # bottom-aligned pair, small pouch in front on the right - the
        # arrangement used on Uji_S1_500&30, sized to the real 250 g : 1000 g
        # height ratio
        big_h, small_h, overlap, bottom = PHOTO_H, round(PHOTO_H * 0.5), 20, PHOTO_BOTTOM
        big = Image.open(os.path.join(PROD, product["p1000"])).convert("RGBA")
        big = big.crop(big.getbbox())
        big_w = round(big.width * big_h / big.height)
        small = Image.open(os.path.join(PROD, product["p250"])).convert("RGBA")
        small = small.crop(small.getbbox())
        small_w = round(small.width * small_h / small.height)
        total = big_w + small_w - overlap
        x0 = round(512 - total / 2)
        place(c, product["p1000"], big_h, left=x0, bottom=bottom)
        place(c, product["p250"], small_h, left=x0 + big_w - overlap, bottom=bottom, white=True)

    halal = Image.open(os.path.join(ASSETS, "halal.png")).convert("RGBA")
    halal = halal.crop(halal.getbbox())
    hw = round(halal.width * HALAL_H / halal.height)
    halal = halal.resize((hw, HALAL_H), Image.LANCZOS)
    c.alpha_composite(halal, ((W - hw) // 2, HALAL_TOP))

    # design system step 5: normalise the background back to bone white
    flat = Image.new("RGB", (W, H), BG)
    flat.paste(c, (0, 0), c)
    return flat


def main():
    os.makedirs(OUT, exist_ok=True)
    for p in PRODUCTS:
        for variant, suffix in (("250", "250gr"), ("1000", "1000gr"), ("combo", "250&1000gr")):
            path = os.path.join(OUT, f"{p['slug']}_S1_{suffix}.png")
            slide(p, variant).save(path)
            print("wrote", os.path.basename(path))


if __name__ == "__main__":
    main()
