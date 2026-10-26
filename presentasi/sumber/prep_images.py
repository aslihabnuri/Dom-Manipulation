import os, sys
from PIL import Image, ImageDraw
SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

def cover(im, w, h):
    r = w / h; iw, ih = im.size
    if iw / ih > r:
        nw = int(ih * r); x0 = (iw - nw) // 2; im = im.crop((x0, 0, x0 + nw, ih))
    else:
        nh = int(iw / r); y0 = (ih - nh) // 2; im = im.crop((0, y0, iw, y0 + nh))
    return im.resize((w, h), Image.LANCZOS)

def rounded(im, radius):
    im = im.convert('RGBA'); mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), radius=radius, fill=255)
    im.putalpha(mask); return im

def circle(im, d):
    im = cover(im, d, d).convert('RGBA'); mask = Image.new('L', (d, d), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, d - 1, d - 1), fill=255); im.putalpha(mask); return im

def sticker(im, size=900):
    im = im.convert('RGB'); w, h = im.size
    sentinel = (255, 0, 255)
    for pt in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if im.getpixel(pt) != sentinel:
            ImageDraw.floodfill(im, pt, sentinel, thresh=28)
    rgba = im.convert('RGBA'); px = rgba.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == sentinel: px[x, y] = (255, 255, 255, 0)
    bbox = rgba.getbbox(); rgba = rgba.crop(bbox)
    rgba.thumbnail((size, size), Image.LANCZOS)
    return rgba

def load(n): return Image.open(os.path.join(SRC, n + '.png'))

# photos (JPEG, exact ratios; rounded ones as PNG with alpha)
cover(load('cover_hero'), 1000, 877).convert('RGB').save(os.path.join(OUT, 'profil.jpg'), quality=84)
rounded(cover(load('hangar'), 1800, 534), 46).save(os.path.join(OUT, 'divider_mrp.png'), optimize=True)
rounded(cover(load('deicing'), 1800, 534), 46).save(os.path.join(OUT, 'divider_sched.png'), optimize=True)
rounded(cover(load('ops_center'), 900, 670), 40).save(os.path.join(OUT, 'ops.png'), optimize=True)
for n, o in [('hangar', 'c_hangar'), ('ops_center', 'c_ops'), ('crew_gate', 'c_crew')]:
    circle(load(n), 600).save(os.path.join(OUT, o + '.png'), optimize=True)
for n in ['sticker_pilot', 'sticker_mechanic', 'st_plane_snow', 'st_dispatcher', 'st_parts', 'st_gate']:
    p = os.path.join(SRC, n + '.png')
    if os.path.exists(p): sticker(load(n), 720).save(os.path.join(OUT, n + '.png'), optimize=True)
    else: print('missing', n)
print(sorted(os.listdir(OUT)))
