"""Slide 1, varian 1000 gram: pouch + gelas berisi minuman + prop bahan."""

from PIL import Image, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('glass', 'glass.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, glass

POUCH_H = 440
GLASS_H = 330          # naik dari 271 - gelas sebelumnya terbaca terlalu kecil
PROP_H = 200           # naik dari 150
POUCH_BOTTOM = 829
BOTTOM = 855
GLASS_OVERLAP = 16     # gelas sedikit menutup sisi kanan pouch
PROP_OVERLAP = 14      # prop sedikit menutup sisi kiri pouch


def build(idx, recipe, prop=None, out='slide.png'):
    p = bs.PRODUCTS[idx]
    pw = round(POUCH_H * 0.695)
    gl, gt, gr, gb = glass.bbox()
    gw = round((gr - gl) * GLASS_H / (gb - gt))

    prop_img = None
    aw = 0
    if prop:
        prop_img = Image.open(prop).convert('RGBA')
        aw = round(prop_img.width * PROP_H / prop_img.height)
        prop_img = prop_img.resize((aw, PROP_H), Image.LANCZOS)

    # centre the whole group: prop edge .. pouch .. glass edge
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

    glass.paste(flat, x0 + pw - GLASS_OVERLAP, BOTTOM, GLASS_H, recipe)

    if prop_img:
        px = x0 + PROP_OVERLAP - aw
        tmp = flat.convert('RGBA')
        bs.contact_shadow(tmp, px, BOTTOM - PROP_H, aw, PROP_H, opacity=46, blur=18)
        flat = tmp.convert('RGB')
        flat.paste(prop_img, (px, BOTTOM - PROP_H), prop_img)

    flat.save(out)
    return out
