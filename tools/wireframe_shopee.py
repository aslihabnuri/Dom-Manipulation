#!/usr/bin/env python3
"""Wireframe layout drafts for Toni Black Shopee banners."""
from PIL import Image, ImageDraw, ImageFont
import os

REPO = "/home/user/Dom-Manipulation"
SCR  = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
F    = f"{REPO}/brand/assets/fonts"
L    = f"{REPO}/brand/assets/logo"
OUT  = f"{SCR}/wireframe"
os.makedirs(OUT, exist_ok=True)

BLACK, WHITE = (40, 40, 40), (255, 255, 255)
DAVIS, GREY, STEEL = (79, 80, 82), (129, 130, 132), (204, 204, 204)
MARK = (220, 60, 60)

def zal(w, s): return ImageFont.truetype(f"{F}/ZalandoSansExpanded-{w}.ttf", s)
def ari(w, s): return ImageFont.truetype(f"{F}/Arimo-{w}.ttf", s)

def tw(d, text, font, track=0):
    if track == 0: return d.textlength(text, font=font)
    return sum(d.textlength(c, font=font) + track for c in text) - track

def tracked(d, xy, text, font, fill, track=0, right=False):
    x, y = xy
    if right: x -= tw(d, text, font, track)
    if track == 0:
        d.text((x, y), text, font=font, fill=fill); return
    for c in text:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + track

def fit(d, text, maker, maxw, hi, lo=40):
    """Largest size where `text` fits maxw."""
    while hi > lo and d.textlength(text, font=maker(hi)) > maxw:
        hi -= 2
    return maker(hi)

def logo(name, width):
    im = Image.open(f"{L}/{name}.png")
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

def crop_roi(im, ratio, y0f, y1f, xcf=0.5):
    """Crop to `ratio` (w/h) keeping the vertical band y0f..y1f."""
    W, H = im.size
    y0, y1 = round(y0f * H), round(y1f * H)
    ch = y1 - y0
    cw = round(ch * ratio)
    if cw > W:
        cw = W; ch = round(cw / ratio)
        y0 = max(0, min(H - ch, y0)); y1 = y0 + ch
    x0 = round(xcf * W - cw / 2)
    x0 = max(0, min(W - cw, x0))
    return im.crop((x0, y0, x0 + cw, y1))

def extend_backdrop(photo, cw, ch, model_center=0.72):
    r = ch / photo.height
    ph = photo.resize((round(photo.width * r), ch), Image.LANCZOS)
    canvas = Image.new("RGB", (cw, ch))
    off = round(cw * model_center - ph.width * 0.5)
    canvas.paste(ph, (off, 0))
    if off > 0:
        canvas.paste(ph.crop((0, 0, 2, ch)).resize((off, ch), Image.LANCZOS), (0, 0))
    right = off + ph.width
    if right < cw:
        canvas.paste(ph.crop((ph.width - 2, 0, ph.width, ch)).resize((cw - right, ch), Image.LANCZOS),
                     (right, 0))
    return canvas

def arrow(d, x, y, size, fill, width=3):
    d.line([(x, y), (x + size, y)], fill=fill, width=width)
    d.line([(x + size - size*0.32, y - size*0.28), (x + size, y)], fill=fill, width=width)
    d.line([(x + size - size*0.32, y + size*0.28), (x + size, y)], fill=fill, width=width)

def stamp(d, w, h, label):
    d.rectangle([0, h - 34, w, h], fill=MARK)
    d.text((16, h - 28), label, font=ari(700, 20), fill=WHITE)


# ───────────────────────── BANNER 1 — BRAND STORY (1600×2000) ────────────────
def banner1():
    W, H, M = 1600, 2000, 110
    TEXTW = 900                                     # text column, left of model
    photo = Image.open(f"{SCR}/photos/TPR_3096.JPG.jpg").convert("RGB")
    c = extend_backdrop(photo, W, H, model_center=0.775)

    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for x in range(W):
        t = x / (W * 0.66)
        sd.line([(x, 0), (x, H)], fill=int(215 * max(0.0, 1 - t ** 2.4)))
    c = Image.composite(Image.new("RGB", (W, H), WHITE), c, scrim)

    d = ImageDraw.Draw(c)
    c.paste(lg := logo("logo-horizontal-black", 430), (M, 105), lg)

    y = 800
    tracked(d, (M, y), "WE ARE TONI BLACK", zal(600, 32), DAVIS, track=8)
    y += 88
    f = fit(d, "TAILORED FOR", lambda s: zal(800, s), TEXTW, 130)
    for line in ["TAILORED FOR", "COMFORT."]:
        d.text((M, y), line, font=f, fill=BLACK); y += round(f.size * 1.10)
    y += 46
    for line in ["Setiap jahitan dirancang dengan presisi —",
                 "bahan katun premium, potongan ergonomis,",
                 "dan kenyamanan yang bertahan seharian."]:
        d.text((M, y), line, font=ari(400, 36), fill=DAVIS); y += 52

    d.line([(M, H - 310), (M + 140, H - 310)], fill=BLACK, width=4)
    cta_f = zal(700, 46)
    d.text((M, H - 272), "Discover Toni Black", font=cta_f, fill=BLACK)
    arrow(d, M + d.textlength("Discover Toni Black", font=cta_f) + 30, H - 248, 44, BLACK, 4)
    d.text((M, H - 180), "www.toniblack.com  ·  @toniblack.id", font=ari(400, 32), fill=GREY)

    stamp(d, W, H, "WIREFRAME — BANNER 1 / BRAND STORY / 1600×2000 (4:5)")
    c.save(f"{OUT}/1-brand-story.png"); return c


# ──────────────────── BANNER 2 — VALUE PER PRODUCT (1600×2000) ───────────────
def banner2():
    W, H, M = 1600, 2000, 110
    c = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(c)

    tracked(d, (M, 140), "VALUE PER PRODUCT", zal(600, 30), GREY, track=8)
    d.text((M, 200), "BOXER SERIES", font=zal(800, 92), fill=WHITE)
    d.text((M, 320), "Men  ·  Cotton–Spandex  ·  Black / Grey / Charcoal",
           font=ari(400, 33), fill=STEEL)
    d.line([(M, 400), (W - M, 400)], fill=DAVIS, width=2)

    prod = Image.open(f"{SCR}/src/boxer_men_grey.png").convert("RGBA")
    pw = 1080
    prod = prod.resize((pw, round(prod.height * pw / prod.width)), Image.LANCZOS)
    px, py = (W - pw) // 2, 640
    c.paste(prod, (px, py), prod)

    ROWS = [560, 900, 1240]                          # label baselines
    calls = [
        ("DURABLE WAISTBAND", "Karet jahitan ganda, tidak melar", 0, 0, (px + 300, 830)),
        ("TAGLESS",           "Tanpa label, bebas gatal",         0, 1, (px + 205, 1010)),
        ("ANTI RIDE-UP",      "Tidak naik saat bergerak",         0, 2, (px + 300, 1330)),
        ("4-WAY STRETCH",     "Elastis ke segala arah",           1, 0, (px + pw - 300, 870)),
        ("BREATHABLE",        "Sirkulasi udara maksimal",         1, 1, (px + pw - 210, 1040)),
        ("ERGONOMIC FIT",     "Mengikuti bentuk tubuh",           1, 2, (px + pw - 300, 1300)),
    ]
    COL = 430
    for label, sub, side, row, (mx, my) in calls:
        y = ROWS[row]
        tx = M if side == 0 else W - M
        right = side == 1
        tracked(d, (tx, y), label, zal(700, 33), WHITE, track=3, right=right)
        tracked(d, (tx, y + 44), sub, ari(400, 26), STEEL, right=right)
        lx0 = tx if not right else tx - COL
        lx1 = tx + COL if not right else tx
        d.line([(lx0, y + 88), (lx1, y + 88)], fill=DAVIS, width=2)
        elbow = (lx1 if not right else lx0, y + 88)
        d.line([elbow, (mx, my)], fill=GREY, width=2)
        d.ellipse([mx - 7, my - 7, mx + 7, my + 7], outline=WHITE, width=3)

    d.line([(M, H - 250), (W - M, H - 250)], fill=DAVIS, width=2)
    c.paste(lg := logo("logo-horizontal-white", 380), (M, H - 192), lg)
    tracked(d, (W - M, H - 172), "TAILORED FOR EVERY MOVE", zal(700, 38), WHITE,
            track=2, right=True)

    stamp(d, W, H, "WIREFRAME — BANNER 2 / VALUE PER PRODUCT / 1600×2000 (4:5)")
    c.save(f"{OUT}/2-value-product.png"); return c


# ───────── BANNER 3 — SHOP BANNER, 2 CLICKABLE AREAS (2000×2000) ─────────────
def banner3():
    W, H = 2000, 2000
    HEAD, GAP = 250, 12
    c = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(c)

    d.rectangle([0, 0, W, HEAD], fill=BLACK)
    lg = logo("logo-horizontal-white", 520)
    c.paste(lg, ((W - lg.width) // 2, (HEAD - lg.height) // 2 - 10), lg)

    pw = (W - GAP) // 2
    ph = H - HEAD
    ratio = pw / ph
    specs = [
        (0,          f"{SCR}/photos/TPR_3096.JPG.jpg",   (0.020, 0.720), 0.50,
         "MEN",  "Brief  ·  Boxer  ·  Singlet"),
        (pw + GAP,   f"{SCR}/photos/ZAI_Kids_3.jpg.jpg", (0.060, 0.940), 0.50,
         "KIDS", "Brief  ·  Boxer"),
    ]
    for x0, path, (y0f, y1f), xcf, title, sub in specs:
        im = crop_roi(Image.open(path).convert("RGB"), ratio, y0f, y1f, xcf)
        c.paste(im.resize((pw, ph), Image.LANCZOS), (x0, HEAD))

        bar = 240
        by = H - bar
        strip = Image.new("RGBA", (pw, bar), (40, 40, 40, 230))
        c.paste(strip, (x0, by), strip)
        dd = ImageDraw.Draw(c)
        tracked(dd, (x0 + 70, by + 46), title, zal(900, 80), WHITE, track=6)
        tracked(dd, (x0 + 70, by + 150), sub, ari(400, 31), STEEL)
        cta = "Explore The Collection"
        fnt = zal(700, 31)
        cw = tw(dd, cta, fnt, 1)
        tracked(dd, (x0 + pw - 110, by + 148), cta, fnt, WHITE, track=1, right=True)
        arrow(dd, x0 + pw - 92, by + 163, 34, WHITE, 3)

        dd.rectangle([x0 + 6, HEAD + 6, x0 + pw - 6, H - 6], outline=MARK, width=5)
        dd.text((x0 + 26, HEAD + 24), "AREA KLIK", font=ari(700, 30), fill=MARK)

    stamp(d, W, H, "WIREFRAME — BANNER 3 / BANNER TOKO 2 AREA KLIK / 2000×2000 (1:1)")
    c.save(f"{OUT}/3-banner-toko.png"); return c


for fn in (banner1, banner2, banner3):
    print(fn.__name__, fn().size)

for f in sorted(os.listdir(OUT)):
    if f.endswith(".png"):
        im = Image.open(f"{OUT}/{f}"); im.thumbnail((900, 900), Image.LANCZOS)
        im.convert("RGB").save(f"{OUT}/rev-{f[:-4]}.jpg", quality=90)
print("done")
