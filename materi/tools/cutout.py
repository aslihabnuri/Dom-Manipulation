# -*- coding: utf-8 -*-
"""
Mengolah gambar objek terisolasi (latar putih) menjadi cut-out ala referensi:
  - latar putih dihapus (transparan), tepi dihaluskan
  - objek dijadikan hitam-putih
  - siluet merah muda digeser sedikit ke kiri-atas sebagai "bayangan kertas"
Juga membuat: kolase skyline untuk sampul, dan latar kolase sobek hitam-putih.

Pakai:  python3 cutout.py <dir_img>   (dir berisi obj/*.png dan crop/*.jpg; hasil ke cut/)
"""
import sys, os, json, random
from PIL import Image, ImageFilter, ImageOps, ImageChops, ImageDraw

PINK = (232, 160, 168)          # E8A0A8, dari sampel referensi
D = sys.argv[1]
OUT = os.path.join(D, "cut"); os.makedirs(OUT, exist_ok=True)


def alpha_from_white(im, thr=232):
    """Mask objek: flood fill dari tepi melalui piksel hampir putih; sisanya objek."""
    rgb = im.convert("RGB"); W, H = rgb.size
    px = rgb.load()
    vis = Image.new("L", (W, H), 0); vp = vis.load()
    stack = [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)] + [(x, 0) for x in range(0, W, 40)] + [(x, H - 1) for x in range(0, W, 40)] + [(0, y) for y in range(0, H, 40)] + [(W - 1, y) for y in range(0, H, 40)]
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= W or y >= H or vp[x, y]: continue
        r, g, b = px[x, y]
        if min(r, g, b) < thr: continue
        vp[x, y] = 255
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    alpha = ImageChops.invert(vis)
    # buang bintik kecil dan haluskan tepi
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    return alpha


def make_cutout(name, shift=(-0.035, -0.045), grow=1.0, bw=True):
    src = Image.open(os.path.join(D, "obj", name + ".png")).convert("RGB")
    alpha = alpha_from_white(src)
    bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    src = src.crop(bbox); alpha = alpha.crop(bbox)
    W, H = src.size
    gray = ImageOps.autocontrast(ImageOps.grayscale(src), cutoff=1).convert("RGB") if bw else src
    obj = gray.copy(); obj.putalpha(alpha)
    # siluet merah muda digeser
    dx, dy = int(W * shift[0]), int(H * shift[1])
    pad = int(max(W, H) * 0.08)
    canvas = Image.new("RGBA", (W + 2 * pad, H + 2 * pad), (0, 0, 0, 0))
    sil_alpha = alpha.filter(ImageFilter.MaxFilter(5)) if grow > 1 else alpha
    sil = Image.new("RGBA", (W, H), PINK + (255,)); sil.putalpha(sil_alpha)
    canvas.alpha_composite(sil, (pad + dx, pad + dy))
    canvas.alpha_composite(obj, (pad, pad))
    canvas = canvas.crop(canvas.getbbox())
    canvas.save(os.path.join(OUT, name + ".png"))
    return canvas


def skyline(names, out="skyline", target_h=900):
    """Kolase objek berdiri sejajar di garis dasar, satu bayangan merah muda gabungan."""
    parts = []
    for n, scale in names:
        src = Image.open(os.path.join(D, "obj", n + ".png")).convert("RGB")
        a = alpha_from_white(src); bb = a.point(lambda v: 255 if v > 40 else 0).getbbox()
        src, a = src.crop(bb), a.crop(bb)
        h = int(target_h * scale); w = int(src.width * h / src.height)
        g = ImageOps.autocontrast(ImageOps.grayscale(src), cutoff=1).convert("RGBA")
        g = g.resize((w, h), Image.LANCZOS); g.putalpha(a.resize((w, h), Image.LANCZOS))
        parts.append(g)
    overlap = 0.12
    total_w = int(sum(p.width for p in parts) * (1 - overlap)) + 80
    H = target_h + 120
    objs = Image.new("RGBA", (total_w + 160, H + 80), (0, 0, 0, 0))
    x = 40
    for p in parts:
        objs.alpha_composite(p, (x, H - p.height + 40))
        x += int(p.width * (1 - overlap))
    a = objs.split()[3]
    sil = Image.new("RGBA", objs.size, PINK + (255,)); sil.putalpha(a.filter(ImageFilter.MaxFilter(9)))
    canvas = Image.new("RGBA", objs.size, (0, 0, 0, 0))
    canvas.alpha_composite(sil, (-int(objs.width * 0.02), -int(H * 0.05)))
    canvas.alpha_composite(objs, (0, 0))
    canvas = canvas.crop(canvas.getbbox())
    canvas.save(os.path.join(OUT, out + ".png"))
    return canvas


def torn_bg(name, out, seed=1, side="tl"):
    """Foto hitam-putih dengan sobekan kertas putih di satu sisi (latar slide bernomor)."""
    random.seed(seed)
    im = Image.open(os.path.join(D, "crop", name + "_full.jpg")).convert("RGB")
    im = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1).convert("RGB")
    W, H = im.size
    mask = Image.new("L", (W, H), 0); d = ImageDraw.Draw(mask)
    # poligon sobekan diagonal
    pts = []
    n = 26
    if side == "tl":   # putih di kiri-atas
        for i in range(n + 1):
            t = i / n
            x = int(W * (0.0 + 0.72 * t)); y = int(H * (0.62 - 0.62 * t)) + random.randint(-int(H * 0.03), int(H * 0.03))
            pts.append((x, y))
        poly = [(0, 0)] + pts + [(int(W * 0.72), 0)]
    else:               # putih di kanan-bawah
        for i in range(n + 1):
            t = i / n
            x = int(W * (0.28 + 0.72 * t)); y = int(H * (1.0 - 0.62 * (1 - t))) + random.randint(-int(H * 0.03), int(H * 0.03))
            pts.append((x, y))
        poly = [(int(W * 0.28), H)] + pts + [(W, H)]
    d.polygon(poly, fill=255)
    white = Image.new("RGB", (W, H), (250, 250, 250))
    res = Image.composite(white, im, mask)
    # garis tepi sobekan abu-abu tipis
    edge = mask.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.5))
    res = Image.composite(Image.new("RGB", (W, H), (200, 200, 200)), res, edge.point(lambda v: min(255, v * 2)))
    res.save(os.path.join(OUT, out + ".jpg"), quality=88)


def map_bg(out="map", W=2667, H=1500, seed=11):
    """Peta garis kawasan ala referensi: jalan, blok bangunan, dan lingkaran pohon, abu-abu terang."""
    random.seed(seed)
    im = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(im); col = (208, 208, 208)
    xs = [0]
    while xs[-1] < W: xs.append(xs[-1] + random.randint(180, 460))
    ys = [0]
    while ys[-1] < H: ys.append(ys[-1] + random.randint(160, 400))
    for x in xs: d.line([(x, 0), (x, H)], fill=col, width=3)
    for y in ys: d.line([(0, y), (W, y)], fill=col, width=3)
    for i in range(len(xs) - 1):
        for j in range(len(ys) - 1):
            bx0, bx1, by0, by1 = xs[i] + 24, xs[i + 1] - 24, ys[j] + 24, ys[j + 1] - 24
            if bx1 - bx0 < 70 or by1 - by0 < 70: continue
            if random.random() < 0.3:   # taman: lingkaran pohon
                for _ in range(random.randint(4, 12)):
                    r = random.randint(14, 34); cx = random.randint(bx0 + r, bx1 - r); cy = random.randint(by0 + r, by1 - r)
                    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=2)
            else:
                for _ in range(random.randint(1, 4)):
                    w = random.randint(50, max(51, (bx1 - bx0) // 2)); h = random.randint(50, max(51, (by1 - by0) // 2))
                    x = random.randint(bx0, max(bx0, bx1 - w)); y = random.randint(by0, max(by0, by1 - h))
                    d.rectangle([x, y, x + w, y + h], outline=col, width=2)
    for _ in range(3):
        x = random.randint(0, W); d.line([(x, 0), (x + random.randint(-900, 900), H)], fill=col, width=4)
    im.save(os.path.join(OUT, out + ".jpg"), quality=85)


if __name__ == "__main__":
    ar = {}
    for n in ["building", "robot", "boxes", "van", "rack", "conveyor", "forklift", "scanner", "worker", "truck"]:
        if os.path.exists(os.path.join(D, "obj", n + ".png")):
            c = make_cutout(n); ar[n] = round(c.width / c.height, 4); print(n, c.size)
    sk = skyline([("rack", 0.95), ("building", 0.62), ("boxes", 0.7), ("robot", 0.85), ("forklift", 0.6), ("truck", 0.55)])
    ar["skyline"] = round(sk.width / sk.height, 4); print("skyline", sk.size)
    torn_bg("hero", "bg_hero", 1, "tl"); torn_bg("totes", "bg_totes", 2, "br"); torn_bg("sortation", "bg_sortation", 3, "tl"); torn_bg("dock", "bg_dock", 4, "br")
    map_bg()
    json.dump(ar, open(os.path.join(OUT, "ar.json"), "w"))
    print(ar)
