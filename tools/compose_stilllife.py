#!/usr/bin/env python3
"""Stage the product still-life from the client's own ghost-mannequin cutouts.

No product photography is generated here. The three garments are the real
transparent PNGs from Drive, so the silhouettes are exactly the products that
exist. Only the set — plinths, shading, shadows — is drawn.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
import os

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
GM, OUT = f"{SCR}/gm", f"{SCR}/gen/still-life.png"
W, H = 1856, 2304                      # the frame the banner crops from

# file, centre x, baseline y (both as a fraction of the frame), garment scale,
# plinth radius, plinth height. The hero sits centre, lowest and furthest forward.
PIECES = [
    ("brief-a.png",    0.196, 0.578, 0.94, 235, 126),   # adult classic brief
    ("boxer.png",      0.500, 0.596, 1.00, 272, 172),   # adult boxer, short leg
    ("kids-boxer.png", 0.797, 0.586, 0.76, 196, 142),   # kids boxer
]


def trimmed(name):
    im = Image.open(f"{GM}/{name}").convert("RGBA")
    return im.crop(im.getchannel("A").getbbox())


def hip_width(im):
    """Widest point of the garment. The waistband would be the truer datum, since
    the adult pieces share one waist size, but the brief is photographed at an
    angle and its band foreshortens, which scaled it far too small."""
    a = np.asarray(im.getchannel("A"))
    rows = (a > 40).sum(axis=1)
    return int(rows.max()) if rows.size else im.width


def soft_shadow(size, blur, strength=225):
    s = Image.new("L", (size[0] + blur * 4, size[1] + blur * 4), 0)
    ImageDraw.Draw(s).ellipse([blur * 2, blur * 2, blur * 2 + size[0], blur * 2 + size[1]],
                              fill=strength)
    return s.filter(ImageFilter.GaussianBlur(blur))


def plinth(canvas, cx, top_y, rw, h):
    """A pale cylinder seen slightly from above: top face, curved body, and the
    front arc of the base."""
    rh = round(rw * 0.30)
    lw, lh = rw * 2, h + rh * 2
    body = Image.new("L", (lw, lh), 0)
    bd = ImageDraw.Draw(body)
    bd.rectangle([0, rh, lw, rh + h], fill=255)
    bd.ellipse([0, h, lw, h + rh * 2], fill=255)          # base, front half shows

    xs = np.linspace(-1, 1, lw, dtype=np.float32)
    curve = 0.90 + 0.12 * np.cos((xs + 0.28) * 1.35)      # light from the upper left
    ys = np.linspace(0, 1, lh, dtype=np.float32)[:, None]
    shade = (226 * curve[None, :]) * (1 - 0.07 * ys)
    fill = Image.fromarray(np.repeat(shade[..., None], 3, 2).clip(0, 255).astype(np.uint8))

    ground = soft_shadow((round(rw * 2.05), round(rh * 1.6)), 32, 210)
    canvas.paste(Image.new("RGB", ground.size, (168, 168, 168)),
                 (round(cx - ground.width / 2), round(top_y + h - ground.height / 2)), ground)
    canvas.paste(fill, (round(cx - rw), round(top_y - rh)), body)

    top = Image.new("L", (lw, rh * 2), 0)
    ImageDraw.Draw(top).ellipse([0, 0, lw, rh * 2], fill=255)
    canvas.paste(Image.new("RGB", (lw, rh * 2), (238, 238, 238)),
                 (round(cx - rw), round(top_y - rh)), top)


def main():
    # barely-there vertical gradient, so the frame has depth without ever getting
    # dark enough to threaten the black type sitting on it
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    base = (247 - 13 * yy ** 1.4) * np.ones((1, W), np.float32)
    canvas = Image.fromarray(np.repeat(base[..., None], 3, 2).astype(np.uint8), "RGB")

    staged = []
    for name, cx, cy, rel, prw, ph in PIECES:
        im = trimmed(name)
        k = (520 * rel) / hip_width(im)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        staged.append((im, cx * W, cy * H, prw, ph))

    for im, cx, base_y, prw, ph in staged:          # plinths first, garments on top
        plinth(canvas, cx, base_y, prw, ph)

    for im, cx, base_y, prw, ph in staged:
        # drop the garment past the ellipse centre line, otherwise it reads as
        # hovering over the back of the plinth rather than resting on it
        seat = base_y + prw * 0.30 * 0.28
        x, y = round(cx - im.width / 2), round(seat - im.height)
        sh = soft_shadow((round(im.width * 0.78), round(im.height * 0.09)), 22, 190)
        canvas.paste(Image.new("RGB", sh.size, (172, 172, 172)),
                     (round(cx - sh.width / 2), round(seat - sh.height / 2)), sh)
        canvas.paste(im, (x, y), im)

    canvas = ImageEnhance.Color(canvas).enhance(0.0)     # the brand shoots black and white
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    canvas.save(OUT)
    print("still-life composed from real cutouts:", canvas.size)


if __name__ == "__main__":
    main()
