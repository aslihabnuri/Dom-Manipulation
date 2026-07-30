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
# Copy from the Story page (guideline p.33), laid out like the supplied
# reference: full-bleed model, headline sitting across him, and lettering that
# switches between black and white according to what is behind it.
def duotone(canvas, blocks, thresh=148, blur=8):
    """Draw text that flips between black and white to stay legible over whatever
    it crosses, the way the supplied reference does.

    The choice is made once per glyph, from the mean luminance of the photograph
    behind that glyph. Deciding per pixel instead would split single letters down
    the middle, which reads as a printing fault rather than a design.

    The switch sits at the midpoint of the two inks, (40 + 255) / 2, not lower.
    That is the point that maximises the weaker of the two contrasts: below it
    white separates further from the ground, above it black does. A lower
    threshold handed mid-grey ground to black where white would have read
    better."""
    # One reading for every size. A much softer blur was used for small type at
    # first, to stop a thin stool leg flipping single letters — but softening it
    # also meant a glyph straddling the leg's edge averaged out to the wrong
    # colour and vanished into it. Tracking the real edge keeps every letter a
    # solid fill, which is what the reference does.
    base = canvas.convert("L")
    sharp = np.asarray(base.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)
    H, W = sharp.shape
    d = ImageDraw.Draw(canvas)
    asc_cache = {}
    for block in blocks:
        xy, text, font, tr, centre = block[:5]
        halo = block[5] if len(block) > 5 else 0
        x, y = xy
        if centre:
            x -= tw(d, text, font, tr) / 2
        asc = asc_cache.setdefault(id(font), font.getmetrics()[0])
        lum = sharp
        for ch in text:
            w = d.textlength(ch, font=font)
            if ch.strip():
                # sample the cap-height band only. Using the full ascent box
                # averages in empty space above the letter and washes the
                # reading out toward the background.
                x0, x1 = int(max(0, x)), int(min(W, x + w))
                y0 = int(max(0, y + asc * 0.22))
                y1 = int(min(H, y + asc * 0.92))
                m = lum[y0:y1, x0:x1].mean() if (x1 > x0 and y1 > y0) else 255.0
                # Solid fill, always. An outline in the opposite colour would
                # rescue the mid-grey cases but reads as outlined type rather than
                # the clean two-tone the reference uses.
                d.text((x, y), ch, font=font, fill=WHITE if m < thresh else BLACK)
            x += w + tr


def banner1():
    W, H, M = 1600, 2000, 100
    photo = grade(Image.open(f"{GEN}/hero-brandstory.png").convert("RGB"), 1.06)
    c = cover(photo, W, H)                      # full bleed, figure left where it is

    d = ImageDraw.Draw(c)
    cx = W // 2

    hf = zal(800, 132)
    while max(tw(d, l, hf) for l in ["TAILORED FOR", "COMFORT."]) > W - 2 * M:
        hf = zal(800, hf.size - 2)
    sf, cf = ari(400, 36), zal(700, 46)

    # Headline runs across the model and flips colour on him, as in the reference.
    # The supporting line sits centred directly beneath it, also as in the
    # reference, so both get the black/white switch as they cross the garment.
    blocks = [
        ((cx, 858), "TAILORED FOR", hf, 0, True),
        ((cx, 858 + round(hf.size * 1.06)), "COMFORT.", hf, 0, True),
    ]
    y = 858 + round(hf.size * 1.06) * 2 + 44
    for line in ["Defined by originality, driven by innovation.",
                 "Every detail is created with purpose."]:
        blocks.append(((cx, y), line, sf, 0, True))
        y += 52
    duotone(c, blocks)

    # Call to action stays in the clean lower-left. Centred at the foot of the
    # frame it would sit on the stool and the model's shin, which are mid-grey —
    # ground where neither black nor white type holds up.
    d.line([(M, H - 300), (M + 140, H - 300)], fill=BLACK, width=4)
    d.text((M, H - 258), "Discover Toni Black", font=cf, fill=BLACK)
    arrow(d, M + d.textlength("Discover Toni Black", font=cf) + 30, H - 234, 42, BLACK, 4)

    lg = logo("logo-horizontal-black", 400)     # top-left sits on plain backdrop
    c.paste(lg, (M, 110), lg)
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
        ("CONTINUOUS INNOVATION", "4-way stretch",      1, 1, (0.520, 0.570)),
    ]),
    "brief": dict(title="BRIEF", src="value-brief", calls=[
        ("CONFIDENCE",            "Durable waistband",  0, 0, (0.450, 0.476)),
        ("PRECISION & FIT",       "Ergonomic fit",      0, 1, (0.415, 0.515)),
        ("MODERN MASCULINITY",    "Refined silhouette", 0, 2, (0.470, 0.560)),
        ("AUTHENTIC SIMPLICITY",  "Tagless finish",     1, 0, (0.578, 0.476)),
        ("CONTINUOUS INNOVATION", "Shape retention",    1, 1, (0.545, 0.520)),
    ]),
    "crewneck": dict(title="CREWNECK", src="value-crewneck", calls=[
        ("AUTHENTIC SIMPLICITY",  "Tagless collar",     0, 0, (0.425, 0.128)),
        ("PRECISION & FIT",       "Tailored cut",       0, 1, (0.405, 0.300)),
        ("MODERN MASCULINITY",    "Clean silhouette",   0, 2, (0.415, 0.448)),
        ("CONFIDENCE",            "Shape retention",    1, 0, (0.620, 0.232)),
        ("CONTINUOUS INNOVATION", "Breathable cotton",  1, 1, (0.520, 0.345)),
    ]),
    "tanktop": dict(title="TANKTOP", src="value-tanktop", calls=[
        ("AUTHENTIC SIMPLICITY",  "Clean seams",        0, 0, (0.450, 0.140)),
        ("PRECISION & FIT",       "Ergonomic cut",      0, 1, (0.432, 0.318)),
        ("MODERN MASCULINITY",    "Refined silhouette", 0, 2, (0.442, 0.478)),
        ("CONFIDENCE",            "Shape retention",    1, 0, (0.598, 0.222)),
        ("CONTINUOUS INNOVATION", "Moisture wicking",   1, 1, (0.520, 0.430)),
    ]),
}

LABEL, DESC = 30, 26                 # one size for every slide in the carousel
ROWS_L = [660, 1030, 1400]
ROWS_R = [845, 1215]


def _crosses(a, b, box):
    """Does segment a-b touch the rectangle box (x0, y0, x1, y1)?"""
    x0, y0, x1, y1 = box
    for t in range(0, 101):
        x = a[0] + (b[0] - a[0]) * t / 100
        y = a[1] + (b[1] - a[1]) * t / 100
        if x0 <= x <= x1 and y0 <= y <= y1:
            return True
    return False


def check_calls():
    """A leader line has to leave the underline heading away from its own label,
    otherwise the diagonal cuts straight through the lettering. Longest labels are
    the ones that bite, so this is checked on every build rather than by eye."""
    d = ImageDraw.Draw(Image.new("RGB", (1600, 2000)))
    lf, df = zal(700, LABEL), ari(400, DESC)
    W, M, CLEAR = 1600, 100, 45
    bad = []
    for key, v in VARIANTS.items():
        for label, desc, side, row, (fx, fy) in v["calls"]:
            right = side == 1
            wl = max(tw(d, label, lf, 3), d.textlength(desc, font=df))
            tx = W - M if right else M
            ux0, ux1 = (tx - wl, tx) if right else (tx, tx + wl)
            ax = fx * W
            if (ax >= ux0 - CLEAR) if right else (ax <= ux1 + CLEAR):
                bad.append(f"{key}/{label}: anchor x={ax:.0f} collides with label "
                           f"span {ux0:.0f}-{ux1:.0f}")
            lg = logo("logo-horizontal-white", 420)
            box = ((W - lg.width) / 2 - 30, 108 - 30,
                   (W + lg.width) / 2 + 30, 108 + lg.height + 30)
            if _crosses((ux0 if right else ux1, (ROWS_R if right else ROWS_L)[row] + 84),
                        (ax, fy * 2000), box):
                bad.append(f"{key}/{label}: leader line runs through the logo")
    if bad:
        raise SystemExit("leader line would cross its own label:\n  " + "\n  ".join(bad))


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


# ───────────────── BANNER 4 — ALL-IN-ONE (pengganti carousel) ────────────────
# Tiling the four slides would shrink the call-out labels to about 4px on a
# phone. Instead the five brand values are stated once against the full look,
# and the four garments run along the bottom as a line-up.
HERO_CALLS = [
    ("AUTHENTIC SIMPLICITY",  "Tagless collar",     0, 218,  (0.425, 0.128)),
    ("PRECISION & FIT",       "Tailored cut",       0, 618,  (0.405, 0.300)),
    ("MODERN MASCULINITY",    "Clean silhouette",   0, 978,  (0.415, 0.448)),
    ("CONFIDENCE",            "Shape retention",    1, 448,  (0.620, 0.232)),
    ("CONTINUOUS INNOVATION", "Breathable cotton",  1, 728,  (0.520, 0.345)),
]
LINEUP = [                       # (source, product, centre x/y, crop height frac)
    ("value-boxer",    "BOXER",    0.505, 0.545, 0.30),
    ("value-brief",    "BRIEF",    0.510, 0.525, 0.26),
    ("value-crewneck", "CREWNECK", 0.520, 0.300, 0.50),
    ("value-tanktop",  "TANKTOP",  0.520, 0.330, 0.52),
]


def tile_crop(im, cx, cy, hfrac, aspect):
    h = im.height * hfrac
    w = h * aspect
    x, y = im.width * cx, im.height * cy
    return im.crop((round(x - w / 2), round(y - h / 2),
                    round(x + w / 2), round(y + h / 2)))


def banner4():
    W, H, M = 2000, 2000, 110
    HERO, STRIP = 1400, 600
    SRC_H = 2483.0                      # source height once scaled to W
    START = 58.0                        # top of the hero crop within that

    c = Image.new("RGB", (W, H), (14, 14, 14))
    hero = cover(grade(Image.open(f"{GEN}/value-crewneck.png").convert("RGB"), 1.04),
                 W, HERO, ycrop=START / (SRC_H - HERO))

    # The source frame starts at the model's jaw, so the crop clips it. Fade the
    # top hard into black instead of leaving a severed chin at the edge.
    v = np.asarray(vignette((W, HERO), side=0.26, topbot=0.06, peak=165)).astype(np.float32)
    yy = np.arange(HERO, dtype=np.float32)[:, None]
    t = np.clip(yy / (HERO * 0.22), 0, 1)
    v = np.maximum(v, 255.0 * (1.0 - (t * t * (3.0 - 2.0 * t))))
    mask = Image.fromarray(v.clip(0, 255).astype(np.uint8), "L")
    hero = Image.composite(Image.new("RGB", (W, HERO), (14, 14, 14)), hero, mask)
    c.paste(hero, (0, 0))

    d = ImageDraw.Draw(c)
    lg = logo("logo-horizontal-white", 520)
    c.paste(lg, ((W - lg.width) // 2, 74), lg)

    lf, df = zal(700, 36), ari(400, 31)
    for label, desc, side, row, (fx, fy) in HERO_CALLS:
        right = side == 1
        tx = W - M if right else M
        wl = max(tw(d, label, lf, 3), d.textlength(desc, font=df))
        ux0, ux1 = (tx - wl, tx) if right else (tx, tx + wl)
        mx = round(fx * W)
        my = round(fy * SRC_H - START)
        hairline(d, (ux0, row + 100), (ux1, row + 100))
        hairline(d, (ux0 if right else ux1, row + 100), (mx, my))
        cased_dot(d, mx, my, 6)
        tracked(d, (tx, row), label, lf, WHITE, tr=3, right=right, stroke=3)
        tracked(d, (tx, row + 52), desc, df, STEEL, right=right, stroke=3)

    # product line-up
    top = HERO
    d.line([(M, top + 40), (W - M, top + 40)], fill=(70, 70, 70), width=2)
    gap, side_m = 24, 60
    tw_ = (W - 2 * side_m - 3 * gap) // 4
    th_ = 400
    for i, (src, name, cx, cy, hf) in enumerate(LINEUP):
        im = grade(Image.open(f"{GEN}/{src}.png").convert("RGB"), 1.04)
        x0 = side_m + i * (tw_ + gap)
        c.paste(tile_crop(im, cx, cy, hf, tw_ / th_).resize((tw_, th_), Image.LANCZOS),
                (x0, top + 80))
        tracked(d, (x0 + tw_ // 2, top + 505), name, zal(800, 38), WHITE, tr=5, centre=True)

    save(c, "4-value-all-in-one")


# ───────────────── BANNER 5 — PRODUCT VALUE (slide 2) ────────────────────────
# Follows the Flyman reference the client supplied: staged product still-life,
# then a panel carrying the mark, a claim, and a row of feature icons. Portrait
# instead of landscape, so the panel sits under the photograph rather than beside
# it. Icons are the brand's own, lifted from the guideline icon set (p.15).
FEATURES = [
    ("breathable",        ["BREATHABLE"]),
    ("tagless",           ["TAGLESS"]),
    ("durable-waistband", ["DURABLE", "WAISTBAND"]),
    ("4-way-stretch",     ["4-WAY", "STRETCH"]),
]


def banner5():
    W, H, M = 1600, 2000, 120
    # No panel. The still-life is shot with an empty top third and bottom sixth,
    # so the type sits straight on the photograph's own ground — measured at 228
    # at its darkest, which black type clears comfortably.
    c = cover(grade(Image.open(f"{GEN}/still-life.png").convert("RGB"), 1.03), W, H)
    d = ImageDraw.Draw(c)
    cx = W // 2

    lg = logo("logo-horizontal-black", 380)
    c.paste(lg, ((W - lg.width) // 2, 118), lg)

    hf = zal(800, 62)
    for i, line in enumerate(["BUILT FOR EVERYDAY", "PERFORMANCE"]):
        tracked(d, (cx, 272 + i * 72), line, hf, BLACK, tr=2, centre=True)

    sf = ari(400, 34)
    for i, line in enumerate(["Refined for lasting comfort.",
                              "Available in M, L and XL."]):
        tracked(d, (cx, 452 + i * 46), line, sf, DAVIS, centre=True)

    colw = (W - 2 * M) // len(FEATURES)
    lf = zal(600, 24)
    for i, (icon, label) in enumerate(FEATURES):
        ix = M + colw * i + colw // 2
        im = Image.open(f"{SCR}/icons/{icon}.png")
        r = 96 / im.height                    # match on height, not bounding box:
        if im.width * r > 190:                # the waistband glyph is wide and
            r = 190 / im.width                # short and reads small otherwise
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        c.paste(im, (ix - im.width // 2, 1568 + (96 - im.height) // 2), im)
        for j, line in enumerate(label):
            tracked(d, (ix, 1704 + j * 32), line, lf, BLACK, tr=3, centre=True)

    save(c, "5-product-value")


# ───────────────── BANNER 6 — DISCOUNT / VOUCHER (2:1) ───────────────────────
# Pose comes from the client's Referensi_Pose_banner Voucher file.
#
# Copy is the brand's own promotional language, not marketplace shorthand. The
# approved promotional CTA on p.29 is "Save 20% This Weekend", so SAVE is the word
# the guideline itself uses for a discount, and p.26 asks a headline to open on an
# active verb. "Disc. Up To" is an abbreviation that appears nowhere in the
# guideline. The two secondary offers are full sentences in Arimo sentence case,
# which is what p.31 specifies for description text — setting them as tracked
# uppercase made them compete with the number and is the "shouty" reading p.27
# rule 5 warns against.
#
# Nothing decorative survives: the rule and the bullet squares are gone, and the
# rest between the two groups does their separating (p.27 rule 3, clarity over
# decoration). Every element shares one left edge at x = M, with no optical fudge
# — the ink of all four faces starts at bbox x0 = 0, verified by measurement.
CLEAN_MIN = 140          # black type needs the ground behind it no darker than this


def ink(d, xy, t, f, fill, tr=0, weight=None):
    """Draw text positioned by the TOP OF ITS INK rather than by the font's
    ascender line, so the gaps between elements are the gaps you actually see.
    Returns the ink box, which the QA pass then checks against the photograph."""
    x, top = xy
    bb = d.textbbox((0, 0), t, font=f)
    tracked(d, (x, top - bb[1]), t, f, fill, tr=tr)
    return (x, top, x + tw(d, t, f, tr), top + bb[3] - bb[1])


def pill(d, x, top, label, font, pad_x=52, h=76):
    """Button sized from its own label. Fixing the width by hand is what put the
    arrow through the last letter."""
    bb = d.textbbox((0, 0), label, font=font)
    w = tw(d, label, font, 2) + pad_x * 2
    d.rounded_rectangle([x, top, x + w, top + h], radius=h // 2, fill=BLACK)
    cap = bb[3] - bb[1]
    tracked(d, (x + pad_x, top + (h - cap) / 2 - bb[1]), label, font, WHITE, tr=2)
    return (x, top, x + w, top + h)


def banner6():
    W, H, M = 2000, 1000, 120
    src = grade(Image.open(f"{GEN}/voucher-hero.png").convert("RGB"), 1.04)
    c = cover(src, W, H, ycrop=0.45)
    plate = c.copy()            # the bare photograph, for the QA pass to read
    d = ImageDraw.Draw(c)
    boxes = []

    c.paste(lg := logo("logo-horizontal-black", 290), (M, 80), lg)
    boxes.append(("logo", (M, 80, M + 290, 80 + lg.height)))

    # group one — the offer
    boxes.append(("eyebrow", ink(d, (M, 217), "SAVE UP TO", zal(600, 38), DAVIS, tr=10)))
    boxes.append(("number",  ink(d, (M, 285), "25%", zal(900, 190), BLACK)))

    # group two — the detail, separated from the number by rest alone.
    # Sized for where this actually gets seen: Shopee renders a shop banner about
    # 430 px wide on a phone, a 0.215 scale, so 32 px body came out at 6.9 px and
    # was unreadable. 38 px lands at 8.2 px, which holds.
    of, y = ari(400, 38), 517
    for line in ["Extra Rp5.000 voucher for new buyers", "Free shipping"]:
        boxes.append((line, ink(d, (M, y), line, of, BLACK)))
        y += 56

    boxes.append(("cta", pill(d, M, 651, "SHOP NOW", zal(700, 32), h=82)))
    boxes.append(("fine", ink(d, (M, 775), "*Terms & conditions apply", ari(400, 22), GREY)))

    check_ground(plate, boxes)
    save(c, "6-voucher")


def check_ground(plate, boxes, pad=6):
    """Refuse to ship dark type sitting on dark photograph. The model's foot and
    the shadow under the bed both intrude into the lower half of this frame, so
    the safe area is not a rectangle and eyeballing it is not good enough.

    Reads the bare photograph, not the finished canvas — measuring after the fact
    just finds the ink's own darkness and fails on every element."""
    a = np.asarray(plate.convert("L")).astype(np.float32)
    for name, (x0, y0, x1, y1) in boxes:
        r = a[max(0, int(y0) - pad):int(y1) + pad, max(0, int(x0) - pad):int(x1) + pad]
        if r.size and r.min() < CLEAN_MIN:
            raise SystemExit(
                f"banner6: '{name}' sits on ground as dark as {r.min():.0f} "
                f"(floor {CLEAN_MIN}) at box {(int(x0), int(y0), int(x1), int(y1))}")


if __name__ == "__main__":
    check_calls()
    banner1()
    for k in VARIANTS:
        banner2(k)
    banner3()
    banner4()
    banner5()
    banner6()
