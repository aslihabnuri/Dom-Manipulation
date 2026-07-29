#!/usr/bin/env python3
"""Build the final Toni Black Shopee banners.

Logo and typography are composited from the real brand assets — never generated —
so the mark and the type stay exact. Kie only produces the photography.

Copy sources: story p.33, values p.34, tone of voice p.35, feature vocabulary
from the icon set p.15, CTA list p.29.
Type: Zalando Sans Expanded (titles) + Arimo (body), official files from Drive.
"""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import numpy as np
import os

REPO = "/home/user/Dom-Manipulation"
SCR  = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
F, L = f"{REPO}/brand/assets/fonts", f"{REPO}/brand/assets/logo"
GEN  = f"{SCR}/gen"
OUT  = f"{REPO}/banners/shopee/final"
os.makedirs(OUT, exist_ok=True)

BLACK, WHITE = (40, 40, 40), (255, 255, 255)
DAVIS, GREY, STEEL = (79, 80, 82), (129, 130, 132), (204, 204, 204)
CASING = (20, 20, 20)          # dark casing so light marks survive light garments

ZAL = {400: "Regular", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black"}
ARI = {400: "Regular", 500: "Medium", 700: "Bold"}

def zal(w, s): return ImageFont.truetype(f"{F}/ZalandoSansExpanded-{ZAL[w]}.ttf", s)
def ari(w, s): return ImageFont.truetype(f"{F}/Arimo-{ARI[w]}.ttf", s)

def tw(d, t, f, tr=0):
    return d.textlength(t, font=f) if tr == 0 else sum(d.textlength(c, font=f) + tr for c in t) - tr

def tracked(d, xy, t, f, fill, tr=0, right=False, centre=False, stroke=0, stroke_fill=CASING):
    x, y = xy
    if right:  x -= tw(d, t, f, tr)
    if centre: x -= tw(d, t, f, tr) / 2
    kw = dict(stroke_width=stroke, stroke_fill=stroke_fill) if stroke else {}
    if tr == 0:
        d.text((x, y), t, font=f, fill=fill, **kw); return
    for c in t:
        d.text((x, y), c, font=f, fill=fill, **kw); x += d.textlength(c, font=f) + tr

def hairline(d, a, b, core=1):
    """Rule that reads on both dark background and white fabric."""
    d.line([a, b], fill=CASING, width=core + 4)
    d.line([a, b], fill=(235, 235, 235), width=core)

def cased_dot(d, x, y, r=5):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(235, 235, 235), outline=CASING, width=3)

def logo(name, width):
    im = Image.open(f"{L}/{name}.png")
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

def cover(im, tw_, th, ycrop=0.5):
    r = max(tw_ / im.width, th / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x = (im.width - tw_) // 2
    y = round((im.height - th) * ycrop)
    return im.crop((x, y, x + tw_, y + th))

def arrow(d, x, y, size, fill, w=3):
    d.line([(x, y), (x + size, y)], fill=fill, width=w)
    d.line([(x + size * 0.68, y - size * 0.28), (x + size, y)], fill=fill, width=w)
    d.line([(x + size * 0.68, y + size * 0.28), (x + size, y)], fill=fill, width=w)

def grade(im, contrast=1.10, sat=0.0, bright=1.0):
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    return ImageEnhance.Brightness(im).enhance(bright)

def vignette(size, side=0.30, topbot=0.16, peak=175):
    """Smooth edge falloff. Uses smoothstep, whose slope is zero at both ends, so
    the gradient never terminates on a visible line the way a clipped curve does."""
    W, H = size
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    fx = np.minimum(xx / (W * side), (W - 1 - xx) / (W * side))
    fy = np.minimum(yy / (H * topbot), (H - 1 - yy) / (H * topbot))
    f = np.clip(np.minimum(fx, fy), 0.0, 1.0)
    s = 1.0 - (f * f * (3.0 - 2.0 * f))            # smoothstep, inverted
    a = Image.fromarray((s * peak).astype(np.uint8), "L")
    return a.filter(ImageFilter.GaussianBlur(6))

def save(im, name):
    path = f"{OUT}/{name}.jpg"
    q = 95
    while q >= 60:
        im.convert("RGB").save(path, quality=q, optimize=True, subsampling=1)
        if os.path.getsize(path) <= 2 * 1024 * 1024: break
        q -= 5
    print(f"  {name}.jpg  {im.size[0]}×{im.size[1]}  {os.path.getsize(path)/1024:.0f} KB")


# ───────────────── BANNER 1 — BRAND STORY ────────────────────────────────────
# Copy from the Story page (guideline p.33).
def banner1():
    W, H, M = 1600, 2000, 120
    photo = grade(Image.open(f"{GEN}/hero-brandstory.png").convert("RGB"), 1.06)

    ph_h = 1900                       # figure right, plain studio backdrop extended left
    ph = photo.resize((round(photo.width * ph_h / photo.height), ph_h), Image.LANCZOS)
    c = Image.new("RGB", (W, H), (238, 238, 238))
    ox, oy = 380, H - ph_h
    c.paste(ph, (ox, oy))
    c.paste(ph.crop((0, 0, 3, ph_h)).resize((ox, ph_h), Image.LANCZOS), (0, oy))
    c.paste(c.crop((0, oy, W, oy + 3)).resize((W, oy), Image.LANCZOS), (0, 0))

    d = ImageDraw.Draw(c)
    c.paste(lg := logo("logo-horizontal-black", 430), (M, 120), lg)

    TEXTW, y = 780, 840
    tracked(d, (M, y), "OUR STORY", zal(600, 32), DAVIS, tr=10)
    y += 92
    size = 132
    while size > 60 and max(tw(d, l, zal(800, size)) for l in ["TAILORED FOR", "COMFORT."]) > TEXTW:
        size -= 2
    hf = zal(800, size)
    for line in ["TAILORED FOR", "COMFORT."]:
        d.text((M, y), line, font=hf, fill=BLACK); y += round(size * 1.08)

    y += 54
    for line in ["Defined by originality,", "driven by innovation.",
                 "Every detail is created with purpose."]:
        d.text((M, y), line, font=ari(400, 37), fill=DAVIS); y += 53

    d.line([(M, H - 250), (M + 140, H - 250)], fill=BLACK, width=4)
    cf = zal(700, 46)
    d.text((M, H - 205), "Discover Toni Black", font=cf, fill=BLACK)
    arrow(d, M + d.textlength("Discover Toni Black", font=cf) + 32, H - 181, 44, BLACK, 4)
    save(c, "1-brand-story")


# ───────────────── BANNER 2 — VALUE CAROUSEL ─────────────────────────────────
# Every slide carries the same five brand values (guideline p.34). What changes
# per slide is how each value shows up on that garment, and where it points.
# Left column takes three, right column takes two, staggered between them.
VALUES = ["CONFIDENCE", "PRECISION & FIT", "MODERN MASCULINITY",
          "AUTHENTIC SIMPLICITY", "CONTINUOUS INNOVATION"]

VARIANTS = {
    "boxer": dict(title="BOXER", src="value-boxer", calls=[
        ("CONFIDENCE",            "Durable waistband",  0, 0, (0.440, 0.472)),
        ("PRECISION & FIT",       "Ergonomic cut",      0, 1, (0.400, 0.545)),
        ("MODERN MASCULINITY",    "Refined silhouette", 0, 2, (0.425, 0.602)),
        ("AUTHENTIC SIMPLICITY",  "Tagless finish",     1, 0, (0.538, 0.468)),
        ("CONTINUOUS INNOVATION", "4-way stretch",      1, 1, (0.610, 0.558)),
    ]),
    "brief": dict(title="BRIEF", src="value-brief", calls=[
        ("CONFIDENCE",            "Durable waistband",  0, 0, (0.450, 0.476)),
        ("PRECISION & FIT",       "Ergonomic fit",      0, 1, (0.420, 0.545)),
        ("MODERN MASCULINITY",    "Refined silhouette", 0, 2, (0.440, 0.596)),
        ("AUTHENTIC SIMPLICITY",  "Tagless finish",     1, 0, (0.578, 0.476)),
        ("CONTINUOUS INNOVATION", "Shape retention",    1, 1, (0.572, 0.542)),
    ]),
    "crewneck": dict(title="CREWNECK", src="value-crewneck", calls=[
        ("AUTHENTIC SIMPLICITY",  "Tagless collar",     0, 0, (0.487, 0.082)),
        ("PRECISION & FIT",       "Tailored cut",       0, 1, (0.405, 0.300)),
        ("MODERN MASCULINITY",    "Clean silhouette",   0, 2, (0.415, 0.448)),
        ("CONFIDENCE",            "Shape retention",    1, 0, (0.620, 0.232)),
        ("CONTINUOUS INNOVATION", "Breathable cotton",  1, 1, (0.578, 0.322)),
    ]),
    "tanktop": dict(title="TANKTOP", src="value-tanktop", calls=[
        ("AUTHENTIC SIMPLICITY",  "Clean seams",        0, 0, (0.450, 0.140)),
        ("PRECISION & FIT",       "Ergonomic cut",      0, 1, (0.432, 0.318)),
        ("MODERN MASCULINITY",    "Refined silhouette", 0, 2, (0.442, 0.478)),
        ("CONFIDENCE",            "Shape retention",    1, 0, (0.598, 0.222)),
        ("CONTINUOUS INNOVATION", "Moisture wicking",   1, 1, (0.596, 0.420)),
    ]),
}

LABEL, DESC = 30, 26                 # one size for every slide in the carousel
ROWS_L = [660, 1030, 1400]
ROWS_R = [845, 1215]


def banner2(key):
    v = VARIANTS[key]
    W, H, M = 1600, 2000, 100
    c = cover(grade(Image.open(f"{GEN}/{v['src']}.png").convert("RGB"), 1.04), W, H)
    c = Image.composite(Image.new("RGB", (W, H), (14, 14, 14)), c, vignette((W, H)))

    d = ImageDraw.Draw(c)
    lg = logo("logo-horizontal-white", 420)
    c.paste(lg, ((W - lg.width) // 2, 108), lg)

    lf, df = zal(700, LABEL), ari(400, DESC)
    for label, desc, side, row, (fx, fy) in v["calls"]:
        right = side == 1
        y = (ROWS_R if right else ROWS_L)[row]
        tx = W - M if right else M
        wl = max(tw(d, label, lf, 3), d.textlength(desc, font=df))
        ux0, ux1 = (tx - wl, tx) if right else (tx, tx + wl)
        mx, my = round(fx * W), round(fy * H)
        hairline(d, (ux0, y + 84), (ux1, y + 84))
        hairline(d, (ux0 if right else ux1, y + 84), (mx, my))
        cased_dot(d, mx, my)
        tracked(d, (tx, y), label, lf, WHITE, tr=3, right=right, stroke=3)
        tracked(d, (tx, y + 44), desc, df, STEEL, right=right, stroke=3)

    tracked(d, (W // 2, H - 200), v["title"], zal(800, 64), WHITE, tr=7, centre=True, stroke=4)
    save(c, f"2-value-{key}")


# ───────────────── BANNER 3 — SHOP BANNER, 2 CLICKABLE AREAS ─────────────────
def banner3():
    W, H = 2000, 2000
    HEAD, GAP, BAR = 230, 14, 230
    HAIR = (220, 220, 220)
    c = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(c)

    lg = logo("logo-horizontal-black", 470)
    c.paste(lg, ((W - lg.width) // 2, (HEAD - lg.height) // 2), lg)
    d.line([(0, HEAD - 1), (W, HEAD - 1)], fill=HAIR, width=2)

    pw, ph = (W - GAP) // 2, H - HEAD - BAR
    for x0, src, title, sub in [
        (0,        f"{GEN}/cat-men.png",  "MEN",  "Brief  ·  Boxer  ·  Singlet"),
        (pw + GAP, f"{GEN}/cat-kids.png", "KIDS", "Brief  ·  Boxer"),
    ]:
        c.paste(cover(grade(Image.open(src).convert("RGB"), 1.04), pw, ph, ycrop=0.0), (x0, HEAD))
        dd = ImageDraw.Draw(c)
        by = H - BAR
        dd.line([(x0, by), (x0 + pw, by)], fill=HAIR, width=2)
        tracked(dd, (x0 + 70, by + 52), title, zal(900, 76), BLACK, tr=6)
        tracked(dd, (x0 + 70, by + 152), sub, ari(400, 30), GREY)
        cf = zal(700, 30)
        tracked(dd, (x0 + pw - 106, by + 78), "Explore The Collection", cf, BLACK, tr=1, right=True)
        arrow(dd, x0 + pw - 88, by + 92, 32, BLACK, 3)

    d.line([(pw + GAP // 2, HEAD), (pw + GAP // 2, H)], fill=HAIR, width=2)
    save(c, "3-banner-toko")


if __name__ == "__main__":
    banner1()
    for k in VARIANTS:
        banner2(k)
    banner3()
