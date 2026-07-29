#!/usr/bin/env python3
"""Build the final Toni Black Shopee banners.

Logo and typography are composited from the real brand assets — never generated —
so the mark and the type stay exact. Kie only produces the photography.
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

def zal(w, s): return ImageFont.truetype(f"{F}/ZalandoSansExpanded-{w}.ttf", s)
def ari(w, s): return ImageFont.truetype(f"{F}/Arimo-{w}.ttf", s)

def tw(d, t, f, tr=0):
    return d.textlength(t, font=f) if tr == 0 else sum(d.textlength(c, font=f) + tr for c in t) - tr

def tracked(d, xy, t, f, fill, tr=0, right=False):
    x, y = xy
    if right: x -= tw(d, t, f, tr)
    if tr == 0:
        d.text((x, y), t, font=f, fill=fill); return
    for c in t:
        d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + tr

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

def grade(im, contrast=1.10, sat=0.55, bright=1.0):
    """Nudge catalogue photography toward the brand's monochrome, high-contrast look."""
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
    print(f"  {name}.jpg  {im.size[0]}×{im.size[1]}  "
          f"{os.path.getsize(path)/1024:.0f} KB  q{q}")


# ───────────────── BANNER 1 — BRAND STORY ────────────────────────────────────
def banner1():
    W, H, M = 1600, 2000, 120
    photo = grade(Image.open(f"{GEN}/hero-brandstory-charcoal.png").convert("RGB"), 1.08, 0.0)

    # place the figure right, extend the plain studio backdrop left
    ph_h = 1880
    ph = photo.resize((round(photo.width * ph_h / photo.height), ph_h), Image.LANCZOS)
    c = Image.new("RGB", (W, H), (238, 238, 238))
    ox, oy = 320, H - ph_h
    c.paste(ph, (ox, oy))
    c.paste(ph.crop((0, 0, 3, ph_h)).resize((ox, ph_h), Image.LANCZOS), (0, oy))
    c.paste(c.crop((0, oy, W, oy + 3)).resize((W, oy), Image.LANCZOS), (0, 0))

    d = ImageDraw.Draw(c)
    c.paste(lg := logo("logo-horizontal-black", 430), (M, 120), lg)

    TEXTW = 640
    y = 900
    tracked(d, (M, y), "WE ARE", zal(600, 34), DAVIS, tr=10)
    y += 92
    size = 150
    while size > 60 and max(tw(d, l, zal(800, size)) for l in ["MADE TO", "MOVE"]) > TEXTW:
        size -= 2
    hf = zal(800, size)
    for line in ["MADE TO", "MOVE"]:
        d.text((M, y), line, font=hf, fill=BLACK); y += round(size * 1.06)

    y += 52
    for line in ["Simplicity meets performance —", "maximum comfort in an elegant",
                 "and understated design."]:
        d.text((M, y), line, font=ari(400, 37), fill=DAVIS); y += 53

    d.line([(M, H - 250), (M + 140, H - 250)], fill=BLACK, width=4)
    cf = zal(700, 46)
    d.text((M, H - 205), "Discover Toni Black", font=cf, fill=BLACK)
    arrow(d, M + d.textlength("Discover Toni Black", font=cf) + 32, H - 181, 44, BLACK, 4)
    save(c, "1-brand-story")


# ───────────────── BANNER 2 — VALUE PER PRODUCT ──────────────────────────────
def banner2():
    W, H, M = 1600, 2000, 110
    c = cover(grade(Image.open(f"{GEN}/hero-value-boxer.png").convert("RGB"), 1.06, 0.0), W, H)

    # side scrims so the call-outs stay legible over the photo
    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for x in range(W):
        e = max(0.0, 1 - x / (W * 0.30)) ** 1.5
        e = max(e, max(0.0, 1 - (W - x) / (W * 0.30)) ** 1.5)
        sd.line([(x, 0), (x, H)], fill=int(165 * e))
    for y in range(round(H * 0.20)):                 # top scrim, keeps the logo clean
        v = int(150 * (1 - y / (H * 0.20)) ** 1.4)
        sd.line([(0, y), (W, y)], fill=max(v, scrim.getpixel((W // 2, y))))
    c = Image.composite(Image.new("RGB", (W, H), (18, 18, 18)), c, scrim)

    d = ImageDraw.Draw(c)
    lg = logo("logo-horizontal-white", 440)
    c.paste(lg, ((W - lg.width) // 2, 105), lg)

    # (label, side 0=left 1=right, row, anchor point on the garment)
    ROWS = [700, 1010, 1320]
    calls = [
        ("DURABLE WAISTBAND", 0, 0, (700, 640)),
        ("SOFT FABRIC",       0, 1, (600, 950)),
        ("ANTI RIDE-UP",      0, 2, (660, 1215)),
        ("TAGLESS",           1, 0, (960, 645)),
        ("4-WAY STRETCH",     1, 1, (1020, 960)),
        ("BREATHABLE",        1, 2, (1000, 1210)),
    ]
    lf = zal(700, 38)
    for label, side, row, (mx, my) in calls:
        y = ROWS[row]
        right = side == 1
        tx = M if not right else W - M
        tracked(d, (tx, y), label, lf, WHITE, tr=3, right=right)
        wlab = tw(d, label, lf, 3)
        ux0 = tx if not right else tx - wlab
        ux1 = tx + wlab if not right else tx
        d.line([(ux0, y + 58), (ux1, y + 58)], fill=(190, 190, 190), width=2)
        d.line([(ux1 if not right else ux0, y + 58), (mx, my)], fill=(190, 190, 190), width=2)
        d.ellipse([mx - 6, my - 6, mx + 6, my + 6], outline=WHITE, width=3)

    tracked(d, (W // 2 - tw(d, "BOXER SERIES", zal(800, 62), 6) // 2, H - 190),
            "BOXER SERIES", zal(800, 62), WHITE, tr=6)
    save(c, "2-value-product")


# ───────────────── BANNER 3 — SHOP BANNER, 2 CLICKABLE AREAS ─────────────────
def banner3():
    W, H = 2000, 2000
    HEAD, GAP, BAR = 250, 12, 240
    c = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(c)
    d.rectangle([0, 0, W, HEAD], fill=BLACK)
    lg = logo("logo-horizontal-white", 520)
    c.paste(lg, ((W - lg.width) // 2, (HEAD - lg.height) // 2 - 10), lg)

    pw, ph = (W - GAP) // 2, H - HEAD
    for x0, src, title, sub, bright in [
        (0,        f"{GEN}/cat-men.png",  "MEN",  "Brief  ·  Boxer  ·  Singlet", 1.10),
        (pw + GAP, f"{GEN}/cat-kids.png", "KIDS", "Brief  ·  Boxer",             0.94),
    ]:
        im = grade(Image.open(src).convert("RGB"), 1.05, 0.35, bright)
        c.paste(cover(im, pw, ph, ycrop=0.0), (x0, HEAD))
        bar = Image.new("RGBA", (pw, BAR), (40, 40, 40, 232))
        c.paste(bar, (x0, H - BAR), bar)
        dd = ImageDraw.Draw(c)
        tracked(dd, (x0 + 70, H - BAR + 46), title, zal(900, 80), WHITE, tr=6)
        tracked(dd, (x0 + 70, H - BAR + 152), sub, ari(400, 31), STEEL)
        cf = zal(700, 31)   # sits beside the title, clear of the sub-line below
        tracked(dd, (x0 + pw - 108, H - BAR + 78), "Explore The Collection", cf, WHITE, tr=1, right=True)
        arrow(dd, x0 + pw - 90, H - BAR + 93, 34, WHITE, 3)

    save(c, "3-banner-toko")


for fn in (banner1, banner2, banner3):
    fn()
