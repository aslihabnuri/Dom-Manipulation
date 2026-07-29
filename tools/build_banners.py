#!/usr/bin/env python3
"""Build the final Toni Black Shopee banners.

Logo and typography are composited from the real brand assets — never generated —
so the mark and the type stay exact. Kie only produces the photography.

Copy is sourced from the brand guideline: story p.33, values p.34, tone of voice
p.35, call-out vocabulary from the icon set p.15.
Type: Zalando Sans Expanded (titles) + Arimo (body), official files from Drive.
"""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

REPO = "/home/user/Dom-Manipulation"
SCR  = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
F, L = f"{REPO}/brand/assets/fonts", f"{REPO}/brand/assets/logo"
GEN  = f"{SCR}/gen"
OUT  = f"{REPO}/banners/shopee/final"
os.makedirs(OUT, exist_ok=True)

BLACK, WHITE = (40, 40, 40), (255, 255, 255)
DAVIS, GREY, STEEL = (79, 80, 82), (129, 130, 132), (204, 204, 204)
CASING = (22, 22, 22)          # dark casing so light marks survive light garments

# Official brand faces. Weight number -> the file that actually ships that weight.
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

def cased_line(d, a, b):
    """Leader line that reads on both dark background and white fabric."""
    d.line([a, b], fill=CASING, width=6)
    d.line([a, b], fill=(238, 238, 238), width=2)

def cased_dot(d, x, y, r=7):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(238, 238, 238), outline=CASING, width=3)

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

def save(im, name):
    path = f"{OUT}/{name}.jpg"
    q = 95
    while q >= 60:
        im.convert("RGB").save(path, quality=q, optimize=True, subsampling=1)
        if os.path.getsize(path) <= 2 * 1024 * 1024: break
        q -= 5
    print(f"  {name}.jpg  {im.size[0]}×{im.size[1]}  {os.path.getsize(path)/1024:.0f} KB")


# ───────────────── BANNER 1 — BRAND STORY ────────────────────────────────────
# Copy taken from the Story page (guideline p.33).
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


# ───────────────── BANNER 2 — VALUE PER PRODUCT ──────────────────────────────
# Call-out vocabulary from the icon set (p.15); the kicker under the product
# name is the brand value that product carries (p.34).
VARIANTS = {
    "boxer": dict(title="BOXER", value="PRECISION & FIT", src="value-boxer", maxlabel=455, calls=[
        ("DURABLE WAISTBAND", 0, 0, (0.44, 0.395)),
        ("SOFT FABRIC",       0, 1, (0.40, 0.480)),
        ("ANTI RIDE-UP",      0, 2, (0.42, 0.570)),
        ("TAGLESS",           1, 0, (0.58, 0.395)),
        ("4-WAY STRETCH",     1, 1, (0.61, 0.480)),
        ("BREATHABLE",        1, 2, (0.59, 0.560)),
    ]),
    "brief": dict(title="BRIEF", value="PRECISION & FIT", src="value-brief", maxlabel=455, calls=[
        ("DURABLE WAISTBAND", 0, 0, (0.42, 0.455)),
        ("SOFT FABRIC",       0, 1, (0.38, 0.530)),
        ("ERGONOMIC FIT",     0, 2, (0.42, 0.600)),
        ("TAGLESS",           1, 0, (0.60, 0.450)),
        ("BREATHABLE",        1, 1, (0.63, 0.530)),
        ("SHAPE RETENTION",   1, 2, (0.60, 0.595)),
    ]),
    "crewneck": dict(title="CREWNECK", value="AUTHENTIC SIMPLICITY", src="value-crewneck",
                     maxlabel=450, calls=[
        ("SOFT FABRIC",      0, 0, (0.42, 0.365)),
        ("BREATHABLE",       0, 1, (0.40, 0.560)),
        ("EASY CARE",        0, 2, (0.42, 0.755)),
        ("TAGLESS",          1, 0, (0.53, 0.295)),
        ("SHAPE RETENTION",  1, 1, (0.66, 0.510)),
        ("COLOR RETENTION",  1, 2, (0.61, 0.730)),
    ]),
    "tanktop": dict(title="TANKTOP", value="CONTINUOUS INNOVATION", src="value-tanktop",
                    maxlabel=450, calls=[
        ("SOFT FABRIC",       0, 0, (0.36, 0.320)),
        ("BREATHABLE",        0, 1, (0.34, 0.520)),
        ("LIGHTWEIGHT",       0, 2, (0.36, 0.740)),
        ("MOISTURE WICKING",  1, 0, (0.58, 0.300)),
        ("SHAPE RETENTION",   1, 1, (0.62, 0.500)),
        ("EASY CARE",         1, 2, (0.60, 0.720)),
    ]),
}


def label_size():
    """One label size for every call-out on every variant, so the typography
    stays even. Driven by the tightest variant's longest label."""
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    size = 34
    while size > 20:
        if all(tw(probe, lab, zal(700, size), 3) <= v["maxlabel"]
               for v in VARIANTS.values() for lab, *_ in v["calls"]):
            return size
        size -= 1
    return 20


LABEL_SIZE = label_size()


def banner2(key):
    v = VARIANTS[key]
    W, H, M = 1600, 2000, 100
    c = cover(grade(Image.open(f"{GEN}/{v['src']}.png").convert("RGB"), 1.04), W, H)

    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for x in range(W):
        e = max(max(0.0, 1 - x / (W * 0.34)), max(0.0, 1 - (W - x) / (W * 0.34))) ** 1.4
        sd.line([(x, 0), (x, H)], fill=int(185 * e))
    for y in range(round(H * 0.17)):
        sd.line([(0, y), (W, y)],
                fill=max(int(175 * (1 - y / (H * 0.17)) ** 1.4), scrim.getpixel((W // 2, y))))
    for y in range(round(H * 0.86), H):
        sd.line([(0, y), (W, y)],
                fill=max(int(190 * ((y - H * 0.86) / (H * 0.14)) ** 1.2), scrim.getpixel((W // 2, y))))
    c = Image.composite(Image.new("RGB", (W, H), (16, 16, 16)), c, scrim)

    d = ImageDraw.Draw(c)
    lg = logo("logo-horizontal-white", 440)
    c.paste(lg, ((W - lg.width) // 2, 100), lg)

    ROWS = [700, 1020, 1340]
    lf = zal(700, LABEL_SIZE)
    for label, side, row, (fx, fy) in v["calls"]:
        y, right = ROWS[row], side == 1
        tx = M if not right else W - M
        wl = tw(d, label, lf, 3)
        ux0, ux1 = (tx, tx + wl) if not right else (tx - wl, tx)
        mx, my = round(fx * W), round(fy * H)
        cased_line(d, (ux0, y + 54), (ux1, y + 54))
        cased_line(d, (ux1 if not right else ux0, y + 54), (mx, my))
        cased_dot(d, mx, my)
        tracked(d, (tx, y), label, lf, WHITE, tr=3, right=right, stroke=3)

    tracked(d, (W // 2, H - 245), v["value"], zal(600, 28), STEEL, tr=9, centre=True, stroke=3)
    tracked(d, (W // 2, H - 190), v["title"], zal(800, 62), WHITE, tr=6, centre=True, stroke=4)
    save(c, f"2-value-{key}")


# ───────────────── BANNER 3 — SHOP BANNER, 2 CLICKABLE AREAS ─────────────────
def banner3():
    W, H = 2000, 2000
    HEAD, GAP, BAR = 230, 14, 230
    HAIR = (220, 220, 220)
    c = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(c)

    lg = logo("logo-horizontal-black", 470)          # clean white header, no heavy block
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
    print(f"  label size: {LABEL_SIZE}px (uniform across all value banners)")
    banner1()
    for k in VARIANTS:
        banner2(k)
    banner3()
