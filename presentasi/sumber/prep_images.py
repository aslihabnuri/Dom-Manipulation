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

def load(n): return Image.open(os.path.join(SRC, n + '.jpg')).convert('RGB')

# rounded photos (PNG with alpha), exact aspect ratios used in the deck
rounded(cover(load('cover_night_gate'), 840, 1120), 48).save(os.path.join(OUT, 'cover.png'), optimize=True)      # 3:4
rounded(cover(load('apron_golden'), 1000, 750), 48).save(os.path.join(OUT, 'apron.png'), optimize=True)          # 4:3
rounded(cover(load('ops_center'), 1000, 750), 48).save(os.path.join(OUT, 'ops.png'), optimize=True)              # 4:3
for n, o in [('maint_tech', 'r43_tech'), ('pilots', 'r43_pilots'), ('baggage', 'r43_baggage')]:
    rounded(cover(load(n), 880, 660), 44).save(os.path.join(OUT, o + '.png'), optimize=True)                     # 4:3
# full-bleed divider photos (JPEG 16:9)
for n, o in [('hangar_night', 'div_hangar'), ('marshaller_night', 'div_marshaller')]:
    p = os.path.join(SRC, n + '.jpg')
    if os.path.exists(p): cover(load(n), 1600, 900).save(os.path.join(OUT, o + '.jpg'), quality=85)
    else: print('missing', n)
print(sorted(os.listdir(OUT)))
