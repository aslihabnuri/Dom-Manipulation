#!/usr/bin/env python3
"""Stage the product still-life from the client's own ghost-mannequin cutouts.

Nothing here is generated. The three garments are the real transparent PNGs from
Drive, so the silhouettes are exactly the products that exist — an earlier
generated version invented a trunk and gave the boxer a long leg, neither of
which Toni Black sells.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
import os

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
GM, OUT = f"{SCR}/gm", f"{SCR}/gen/still-life.png"
W, H = 1856, 2304                      # same frame the banner already crops from

# left to right; y_base is where the garment's lowest point sits
PIECES = [
    ("brief-a.png",  0.185, 0.632, 0.94),   # classic brief
    ("boxer.png",    0.500, 0.648, 1.00),   # fitted boxer, hero, front and lowest
    ("brief-b.png",  0.815, 0.638, 1.02),   # loose boxer
]


def trimmed(path):
    im = Image.open(f"{GM}/{path}").convert("RGBA")
    return im.crop(im.getchannel("A").getbbox())


def hip_width(im):
    """Widest point of the garment. The waistband would be the truer datum since
    all three are one waist size, but the brief is photographed at an angle and
    its band foreshortens, which scaled it far too small."""
    a = np.asarray(im.getchannel("A"))
    rows = (a > 40).sum(axis=1)
    return int(rows.max()) if rows.size else im.width


def soft_shadow(size, blur):
    s = Image.new("L", (size[0] + blur * 4, size[1] + blur * 4), 0)
    ImageDraw.Draw(s).ellipse([blur * 2, blur * 2, blur * 2 + size[0], blur * 2 + size[1]],
                              fill=225)
    return s.filter(ImageFilter.GaussianBlur(blur))


def main():
    # background: barely-there vertical gradient, so the frame has depth without
    # ever getting dark enough to threaten the black type sitting on it
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    base = (246 - 12 * yy ** 1.4) * np.ones((1, W), np.float32)
    canvas = Image.fromarray(np.repeat(base[..., None], 3, 2).astype(np.uint8), "RGB")

    pieces = [(trimmed(f), cx, cy, s) for f, cx, cy, s in PIECES]

    for im, cx, cy, rel in pieces:
        # equal hip width across the three, then a small depth difference between
        # the front piece and the two set back beside it
        k = (520 * rel) / hip_width(im)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        x = round(cx * W - im.width / 2)
        y = round(cy * H - im.height)

        sw, sh = round(im.width * 0.90), round(im.height * 0.11)
        sh_img = soft_shadow((sw, sh), 30)
        canvas.paste(Image.new("RGB", sh_img.size, (138, 138, 138)),
                     (x + (im.width - sh_img.width) // 2,
                      y + im.height - sh_img.height // 2 - 4), sh_img)
        canvas.paste(im, (x, y), im)

    canvas = ImageEnhance.Color(canvas).enhance(0.0)     # brand shoots black and white
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    canvas.save(OUT)
    print("still-life composed from real cutouts:", canvas.size)


if __name__ == "__main__":
    main()
