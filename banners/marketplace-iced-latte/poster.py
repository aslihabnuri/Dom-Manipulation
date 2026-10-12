#!/usr/bin/env python3
"""Nomukita collage poster in the style of the 'SMOOTHIE' reference.
Layers (back to front): OKLab gradient + grain, back splashes/powders, headline, drinks,
original pouches, foreground ingredients, small type. Layout is a dict so iterations are free.
Usage: poster.py <layout_name> <out_base>
"""
import sys, math, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
P = ROOT + "/smoothie/parts/"
FD = ROOT + "/assets/fonts/"
ARG_BOLD = FD + "All Round Gothic/Fontspring-DEMO-allroundgothic-bold.otf"
ARG_DEMI = FD + "All Round Gothic/Fontspring-DEMO-allroundgothic-demi.otf"
POUCH = {"matcha": ROOT + "/assets/nomukita-matcha-latte-250g.png",
         "ube": ROOT + "/assets/nomukita-ube-250g.png",
         "charcoal": ROOT + "/assets/nomukita-charcoal-250g.png"}
WHITE = (255, 255, 255)
GRAIN = 9.5
K = 2  # supersampling: design units are for the 1200-wide master


# ---------------- colour ----------------
def srgb_to_lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055) * 255.0


def to_oklab(rgb):
    r, g, b = srgb_to_lin(np.array(rgb, dtype=np.float64))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = np.cbrt(l), np.cbrt(m), np.cbrt(s)
    return np.array([0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
                     1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
                     0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s])


def from_oklab(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return np.stack([lin_to_srgb(r), lin_to_srgb(g), lin_to_srgb(bb)], axis=-1)


def gradient(W, H, stops, angle_deg=8, grain=None, seed=3):
    grain = GRAIN if grain is None else grain
    """Vertical-ish gradient through OKLab colour stops [(pos, rgb), ...] with film grain."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float64)
    a = math.radians(angle_deg)
    t = (yy * math.cos(a) + (xx - W / 2) * math.sin(a)) / H
    t = np.clip(t, 0, 1)
    labs = [(p, to_oklab(c)) for p, c in stops]
    out = np.zeros((H, W, 3))
    for (p0, c0), (p1, c1) in zip(labs[:-1], labs[1:]):
        m = (t >= p0) & (t <= p1)
        u = ((t[m] - p0) / (p1 - p0))[:, None]
        u = u * u * (3 - 2 * u)  # smoothstep for a softer blend
        out[m] = c0 * (1 - u) + c1 * u
    rgb = from_oklab(out)
    rng = np.random.default_rng(seed)
    n = rng.normal(0, grain, (H, W))[..., None]
    rgb = np.clip(rgb + n, 0, 255)
    return Image.fromarray(rgb.astype(np.uint8), "RGB").convert("RGBA")


# ---------------- assets ----------------
_cache = {}


def asset(name):
    if name in _cache:
        return _cache[name]
    if name.startswith("pouch_"):
        p = Image.open(POUCH[name[6:]]).convert("RGBA")
        a = np.asarray(p).astype(np.int16)
        al = a[..., 3].copy(); al[(al < 250) & (a[..., :3].max(axis=2) < 120)] = 0   # strip mockup drop shadow
        a = a.copy(); a[..., 3] = al.clip(0, 255)
        p = Image.fromarray(a.astype(np.uint8), "RGBA"); p = p.crop(p.getbbox())
    else:
        p = Image.open(P + name + ".png").convert("RGBA")
    _cache[name] = p
    return p


BACKDROP = np.array([float(v) for v in open(ROOT + "/smoothie/backdrop.txt").read().split(",")])


def seethrough_weight(im, bottom=0.83):
    """Where the glass shows the original studio backdrop (near BACKDROP colour) in the glass base."""
    a = np.asarray(im).astype(np.float32)
    d = np.sqrt(((a[..., :3] - BACKDROP) ** 2).sum(axis=2))
    w = np.clip((62.0 - d) / 26.0, 0, 1)
    h = a.shape[0]
    ys = np.arange(h)[:, None] / h
    w *= np.clip((ys - bottom) / 0.03, 0, 1)
    w *= (a[..., 3] > 0)
    return Image.fromarray((w * 255).astype(np.uint8), "L")


def prepared(name, height=None, width=None, rot=0.0, flip=False, see=False):
    im = asset(name)
    if see:
        im = im.copy(); im.putalpha(im.split()[3])
        wmap = seethrough_weight(im)
    if flip:
        im = ImageOps.mirror(im)
        if see: wmap = ImageOps.mirror(wmap)
    if height:
        s = height * K / im.height
    else:
        s = width * K / im.width
    size = (max(1, int(im.width * s)), max(1, int(im.height * s)))
    im = im.resize(size, Image.LANCZOS)
    if see: wmap = wmap.resize(size, Image.LANCZOS)
    if rot:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
        if see: wmap = wmap.rotate(rot, resample=Image.BICUBIC, expand=True)
    return (im, wmap) if see else im


def place(canvas, name, cx, cy, height=None, width=None, rot=0.0, flip=False, shadow=0.35,
          sh_off=(10, 18), sh_blur=22, outline=0, outline_a=255, opacity=1.0, see=False):
    if see:
        im, wmap = prepared(name, height, width, rot, flip, see=True)
    else:
        im = prepared(name, height, width, rot, flip)
    if opacity < 1:
        a = np.asarray(im).copy(); a[..., 3] = (a[..., 3] * opacity).astype(np.uint8); im = Image.fromarray(a, "RGBA")
    x = int(cx * K - im.width / 2); y = int(cy * K - im.height / 2)
    al = im.split()[3]
    if shadow:
        pad = sh_blur * K * 3
        sh = Image.new("L", (im.width + 2 * pad, im.height + 2 * pad), 0)
        sh.paste(al, (pad, pad))
        sh = sh.filter(ImageFilter.GaussianBlur(sh_blur * K)).point(lambda v: int(v * shadow))
        dark = Image.new("RGBA", sh.size, (34, 18, 64, 255)); dark.putalpha(sh)
        canvas.alpha_composite(dark, (x - pad + sh_off[0] * K, y - pad + sh_off[1] * K))
    if outline:
        r = outline * K
        ol = al.point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(2 * r + 1)).filter(ImageFilter.GaussianBlur(1))
        ol = ol.point(lambda v: int(v * outline_a / 255))
        w = Image.new("RGBA", im.size, WHITE + (255,)); w.putalpha(ol)
        canvas.alpha_composite(w, (x, y))
    if see:
        # replace the studio backdrop seen through the glass base with what is really behind it on the poster
        under = canvas.crop((x, y, x + im.width, y + im.height)).convert("RGB")
        ua = np.asarray(under).astype(np.float32); ia = np.asarray(im).astype(np.float32)
        wv = (np.asarray(wmap).astype(np.float32) / 255.0)[..., None] * 1.0
        ia[..., :3] = np.clip(ia[..., :3] + wv * (ua - BACKDROP), 0, 255)
        im = Image.fromarray(ia.astype(np.uint8), "RGBA")
    canvas.alpha_composite(im, (x, y))
    bb = im.split()[3].getbbox()
    print(f"  {name:16s} bbox x {int((x+bb[0])/K)}-{int((x+bb[2])/K)}  y {int((y+bb[1])/K)}-{int((y+bb[3])/K)}")
    return (x, y, im.width, im.height)


# ---------------- type ----------------
def font(path, size):
    return ImageFont.truetype(path, int(round(size * K)))


def text_width(f, s, tr):
    return sum(f.getlength(c) for c in s) + tr * K * (len(s) - 1)


def draw_text(canvas, x, y, s, f, tr=0, fill=WHITE, align="left", dot_sep=False):
    """y = top of caps. '•' in s is drawn as a vector dot (DEMO font locks it)."""
    d = ImageDraw.Draw(canvas)
    w = text_width(f, s, tr)
    X = x * K
    if align == "center": X -= w / 2
    if align == "right": X -= w
    top = f.getbbox("H")[1]; ch = f.getbbox("H")[3] - top
    for c in s:
        if c == "•":
            r = ch * 0.13; cxp = X + f.getlength("•") / 2; cyp = y * K + ch / 2
            d.ellipse([cxp - r, cyp - r, cxp + r, cyp + r], fill=fill)
        else:
            d.text((X, y * K - top), c, font=f, fill=fill)
        X += f.getlength(c) + tr * K
    return w / K


def arc_text(canvas, cx, cy, radius, start_deg, s, f, tr=0, fill=WHITE, clockwise=True):
    """Text along a circle; start_deg is where the first glyph sits (0 = 3 o'clock, -90 = 12 o'clock)."""
    ang = math.radians(start_deg)
    R = radius * K
    top = f.getbbox("H")[1]; ch = f.getbbox("H")[3] - top
    for c in s:
        w = f.getlength(c) if c != "•" else f.getlength("•")
        half = (w / 2) / R
        a = ang + half if clockwise else ang - half
        g = Image.new("RGBA", (int(w + 8 * K), int(ch * 1.8 + 8 * K)), (0, 0, 0, 0))
        gd = ImageDraw.Draw(g)
        if c == "•":
            r = ch * 0.13; gd.ellipse([g.width / 2 - r, g.height / 2 - r, g.width / 2 + r, g.height / 2 + r], fill=fill)
        elif c != " ":
            gd.text((4 * K, (g.height - ch) / 2 - top), c, font=f, fill=fill)
        rot = -math.degrees(a) - 90 if clockwise else -math.degrees(a) + 90
        gr = g.rotate(rot, resample=Image.BICUBIC, expand=True)
        px = cx * K + R * math.cos(a); py = cy * K + R * math.sin(a)
        canvas.alpha_composite(gr, (int(px - gr.width / 2), int(py - gr.height / 2)))
        step = (w + tr * K) / R
        ang = ang + step if clockwise else ang - step


def pct_block(canvas, x, y, digits, size, fill=WHITE, align="left"):
    """Big number with a vector % (the DEMO font locks '%'). y = top of the figures. Returns width (design units)."""
    f = font(ARG_BOLD, size)
    b = f.getbbox("2"); H = b[3] - b[1]; top = b[1]
    S = size * K
    t = 0.135 * S; r = 0.142 * S; ring = 0.082 * S; wp = 0.60 * S; gap = 0.07 * S
    wd = sum(f.getlength(c) for c in digits) - 0.02 * S * (len(digits) - 1)
    total = wd + gap + wp
    X = x * K - (total if align == "right" else total / 2 if align == "center" else 0)
    Y = y * K
    d = ImageDraw.Draw(canvas)
    cx = X
    for c in digits:
        d.text((cx, Y - top), c, font=f, fill=fill); cx += f.getlength(c) - 0.02 * S
    # vector percent, supersampled
    ss = 3
    lay = Image.new("L", (int((wp + 4) * ss), int((H + 4) * ss)), 0); ld = ImageDraw.Draw(lay)
    R = r * ss; RI = (r - ring) * ss
    c1 = (R + 2, R + 2); c2 = (wp * ss - R - 2, H * ss - R - 2)
    for c0 in (c1, c2):
        ld.ellipse([c0[0] - R, c0[1] - R, c0[0] + R, c0[1] + R], fill=255)
        ld.ellipse([c0[0] - RI, c0[1] - RI, c0[0] + RI, c0[1] + RI], fill=0)
    q1 = (wp * ss - r * 0.55 * ss, 0); q2 = (r * 0.55 * ss, H * ss)
    dx, dy = q2[0] - q1[0], q2[1] - q1[1]; L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L; th = t * 0.72 / 2 * ss
    ld.polygon([(q1[0] + nx * th, q1[1] + ny * th), (q1[0] - nx * th, q1[1] - ny * th),
                (q2[0] - nx * th, q2[1] - ny * th), (q2[0] + nx * th, q2[1] + ny * th)], fill=255)
    ld.rectangle([0, H * ss + 1, lay.width, lay.height], fill=0); ld.rectangle([0, 0, lay.width, 0], fill=0)
    lay = lay.resize((int(wp + 4), int(H + 4)), Image.LANCZOS)
    col = Image.new("RGBA", lay.size, fill + (255,)); col.putalpha(lay)
    canvas.alpha_composite(col, (int(cx + gap), int(Y)))
    return total / K, H / K


def pill_button(canvas, x, y, s, size, h, pad, fill=WHITE, text=(58, 40, 104), outline=None, stroke=3, arrow=False, tr=1.5, align="left"):
    """Rounded pill with centred caps text; outline-only when fill is None. x,y = top-left (or top-right). Returns width."""
    f = font(ARG_BOLD, size)
    tw = text_width(f, s, tr) / K
    aw = size * 0.75 if arrow else 0
    w = tw + 2 * pad + (aw + size * 0.45 if arrow else 0)
    X = x - w if align == "right" else (x - w / 2 if align == "center" else x)
    ss = 3
    lay = Image.new("RGBA", (int(w * K * ss), int(h * K * ss)), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    if fill:
        ld.rounded_rectangle([0, 0, lay.width - 1, lay.height - 1], radius=lay.height / 2, fill=fill + (255,))
    if outline:
        ld.rounded_rectangle([stroke * K * ss / 2, stroke * K * ss / 2, lay.width - 1 - stroke * K * ss / 2, lay.height - 1 - stroke * K * ss / 2],
                             radius=lay.height / 2, outline=outline + (255,), width=int(stroke * K * ss))
    lay = lay.resize((int(w * K), int(h * K)), Image.LANCZOS)
    canvas.alpha_composite(lay, (int(X * K), int(y * K)))
    ch = (f.getbbox("H")[3] - f.getbbox("H")[1]) / K
    draw_text(canvas, X + pad, y + (h - ch) / 2, s, f, tr, fill=text)
    if arrow:
        d = ImageDraw.Draw(canvas)
        ax = (X + pad + tw + size * 0.45) * K; ay = (y + h / 2) * K; L = aw * K; th = max(2, size * 0.14 * K)
        d.line([(ax, ay), (ax + L, ay)], fill=text, width=int(th))
        d.line([(ax + L - L * 0.42, ay - L * 0.42), (ax + L + th * 0.2, ay + th * 0.15)], fill=text, width=int(th))
        d.line([(ax + L - L * 0.42, ay + L * 0.42), (ax + L + th * 0.2, ay - th * 0.15)], fill=text, width=int(th))
    return w


def logo_white():
    sys.path.insert(0, ROOT)
    from compose import logo_rgba
    lg = logo_rgba(ROOT + "/assets/logo01.jpg")
    a = np.asarray(lg).astype(np.int16)
    dark = (a[..., :3].max(axis=2) < 120) & (a[..., 3] > 0)
    out = a.copy(); out[dark, 0] = 255; out[dark, 1] = 255; out[dark, 2] = 255
    return Image.fromarray(out.astype(np.uint8), "RGBA")


# ---------------- layouts ----------------
STOPS = [(0.0, (104, 58, 206)), (0.42, (96, 120, 236)), (0.66, (70, 178, 196)), (1.0, (118, 190, 66))]


def build(L, out_base):
    W, H = L["size"]
    global GRAIN
    GRAIN = L.get("grain", 9.5)
    cv = gradient(W * K, H * K, L.get("stops", STOPS), L.get("angle", 8))
    for item in L["back"]:
        place(cv, **item)
    # headline
    if L.get("head_fit"):
        f0 = ImageFont.truetype(ARG_BOLD, 200)
        w0 = sum(f0.getlength(c) for c in L["head"]) + L.get("head_tr", -2) * (len(L["head"]) - 1) * 200 / 200
        L["head_size"] = 200 * L["head_fit"] / w0
        print("head size", round(L["head_size"], 1))
    fh = font(ARG_BOLD, L["head_size"])
    draw_text(cv, L["head_x"], L["head_y"], L["head"], fh, L.get("head_tr", -2), align=L.get("head_align", "left"))
    for item in L["mid"]:
        place(cv, **item)
    for item in L["front"]:
        place(cv, **item)
    # small type
    for t in L["texts"]:
        if t.get("pct"):
            pct_block(cv, t["x"], t["y"], t["pct"], t["size"], align=t.get("align", "left")); continue
        if t.get("pill"):
            pill_button(cv, t["x"], t["y"], t["s"], t["size"], t["h"], t["pad"], fill=t.get("fill"), text=tuple(t.get("text", WHITE)),
                        outline=t.get("outline"), stroke=t.get("stroke", 3), arrow=t.get("arrow", False), tr=t.get("tr", 1.5),
                        align=t.get("align", "left")); continue
        f = font(ARG_BOLD if t.get("bold", True) else ARG_DEMI, t["size"])
        if t.get("arc"):
            arc_text(cv, t["cx"], t["cy"], t["r"], t["start"], t["s"], f, t.get("tr", 2))
        else:
            draw_text(cv, t["x"], t["y"], t["s"], f, t.get("tr", 1), align=t.get("align", "left"))
    if L.get("logo"):
        lg = logo_white(); lw = L["logo"]["w"] * K
        lg = lg.resize((int(lw), int(lg.height * lw / lg.width)), Image.LANCZOS)
        x = L["logo"]["x"] * K
        if L["logo"].get("align") == "right": x -= lg.width
        cv.alpha_composite(lg, (int(x), int(L["logo"]["y"] * K)))
    out = cv.convert("RGB").resize((W, H), Image.LANCZOS)
    # unify: a whisper of grain over everything
    a = np.asarray(out).astype(np.float32)
    a += np.random.default_rng(9).normal(0, 2.2, a.shape[:2])[..., None]
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    out.save(out_base + ".png"); out.save(out_base + ".jpg", quality=94)
    print("saved", out_base, out.size)
    return out


if __name__ == "__main__":
    sys.path.insert(0, ROOT)
    import layouts
    build(getattr(layouts, sys.argv[1]), sys.argv[2])
