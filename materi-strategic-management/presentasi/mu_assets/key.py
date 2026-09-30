# chroma-key green-screen PNGs from kie.ai into alpha PNGs, crop to content
import sys, os
from PIL import Image, ImageChops, ImageFilter
def key(src, dst, t0=40, t1=110, pad=6):
    im = Image.open(src).convert('RGB')
    r, g, b = im.split()
    mx = ImageChops.lighter(r, b)
    greenness = ImageChops.subtract(g, mx)          # high where green dominates
    # alpha: 255 when greenness<=t0, 0 when >=t1, linear between
    lut = [255 if v <= t0 else (0 if v >= t1 else int(255 * (t1 - v) / (t1 - t0))) for v in range(256)]
    alpha = greenness.point(lut)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    # despill: clamp G to max(R,B)+8
    g2 = ImageChops.darker(g, mx.point(lambda v: min(255, v + 8)))
    out = Image.merge('RGBA', (r, g2, b, alpha))
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        out = out.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.size[0], x1 + pad), min(im.size[1], y1 + pad)))
    out.save(dst)
    return out.size
if __name__ == '__main__':
    for n in sys.argv[1:]:
        print(n, key('gen/' + n + '.png', n + '.png'))
