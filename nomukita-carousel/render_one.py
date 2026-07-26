"""Slide 1, varian 1000 gram: pouch + gelas berisi minuman + prop bahan."""

from PIL import Image, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('photo', 'photo.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, photo

POUCH_H = 440
GLASS_H = 330
PROP_H = 200
POUCH_BOTTOM = 829
BOTTOM = 855
GLASS_OVERLAP = 16
PROP_OVERLAP = 14


def build(idx, glass_img, prop_img=None, out='slide.png'):
    p = bs.PRODUCTS[idx]
    pw = round(POUCH_H * 0.695)
    gw = photo.size_at(glass_img, GLASS_H)
    aw = photo.size_at(prop_img, PROP_H) if prop_img else 0
    x0 = round(512 - (pw + gw - GLASS_OVERLAP - aw + PROP_OVERLAP) / 2)

    c = Image.new('RGBA', (1024, 1024), bs.BG + (255,))
    c.alpha_composite(Image.open(f'{bs.ASSETS}/logo_nomukita.png').convert('RGBA'), bs.LOGO_XY)
    bs.draw_text_top(c, p['kanji'], ImageFont.truetype(bs.F_JP, bs.KANJI_SIZE),
                     bs.KANJI_GREY, 512, bs.KANJI_TOP)
    h = bs.build_headline(p['head'], bs.HEAD_SIZE, bs.accent(p['head']))
    c.alpha_composite(h, ((1024 - h.width) // 2, bs.HEAD_TOP))
    bs.draw_text_top(c, f"{p['series']} grade · 1000 gram",
                     ImageFont.truetype(bs.F_BODY, bs.SUB_SIZE), bs.CHARCOAL, 512, bs.SUB_TOP)

    bs.place(c, p['p1000'], POUCH_H, left=x0, bottom=POUCH_BOTTOM)

    halal = Image.open(f'{bs.ASSETS}/halal.png').convert('RGBA')
    halal = halal.crop(halal.getbbox())
    hw = round(halal.width * bs.HALAL_H / halal.height)
    c.alpha_composite(halal.resize((hw, bs.HALAL_H), Image.LANCZOS),
                      ((1024 - hw) // 2, bs.HALAL_TOP))

    flat = Image.new('RGB', (1024, 1024), bs.BG)
    flat.paste(c, (0, 0), c)

    photo.place(flat, glass_img, x0 + pw - GLASS_OVERLAP, BOTTOM, GLASS_H)
    if prop_img:
        photo.place(flat, prop_img, x0 + PROP_OVERLAP - aw, BOTTOM, PROP_H)

    flat.save(out)
    return out
