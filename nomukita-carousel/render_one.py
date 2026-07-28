"""Slide 1, varian 1000 gram: pouch + gelas berisi minuman + prop bahan."""

from PIL import Image, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('photo', 'photo.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, photo

POUCH_H = 440
GLASS_H = 330
POUCH_BOTTOM = 829
BOTTOM = 855
GLASS_OVERLAP = 26   # Matchamu: gelas menimpa pouch ~4.5% lebar pouch, plus tepi pouch yang menjorok

# Skala foto: alpukat utuh 11 cm digambar 200 px dan itu yang disetujui, jadi
# 18.2 px/cm. Dengan patokan itu pouch 1000 gram 440 px = 24 cm dan gelas 330 px
# = 18 cm, keduanya masuk akal. Sebelumnya semua prop dipaksa 200 px, sehingga
# biskuit 4,5 cm tampil setinggi 11 cm - "gambar cookies terlalu besar".
PX_PER_CM = 200 / 11.0

# tinggi asli tiap prop dalam cm, seperti yang tampak di foto
PROP_CM = {
    "matchalatte": 8.0,    # mangkuk kayu kecil berisi bubuk matcha
    "premixmatcha": 8.0,
    "tehtarik": 6.0,       # gundukan daun teh kering
    "chocolate": 5.5,      # potongan cokelat bertumpuk
    "cookiescream": 5.0,   # dua biskuit, satu bersandar
    "charcoal": 9.0,       # bongkahan arang
    "avocado": 11.0,       # alpukat utuh + belahannya
    "vanilla": 9.0,        # bunga vanili dan polongnya
    "milktea": 6.0,
    "lemontea": 7.5,       # lemon utuh + belahannya
    "lemongrass": 8.5,     # ikat serai berbaring
    "puredarkcocoa": 12.0, # buah kakao utuh dan belahannya, berbaring
    "darkcocoa": 7.0,      # gundukan biji kakao dan gundukan bubuknya
    "cappuccino": 6.0,     # gundukan biji kopi
    "taro": 8.0,           # tiga irisan talas bersusun
}
# Prop tidak boleh melebihi lebar pouch: begitu lewat, ia tidak lagi terbaca
# sebagai bahan di sebelah produk melainkan bersaing dengan produknya.
PROP_MAX_W = round(POUCH_H * 0.695 * 0.92)


def prop_height(slug):
    return round(PROP_CM[slug] * PX_PER_CM)


# Celah terlebar yang masih boleh terbuka antara sisi kanan kemasan dan sisi kiri
# gelas, diukur pada 100 px terbawah kemasan - bagian tempat gelas berkaki mulai
# menjauh karena pinggangnya mengecil sementara tepi pouch tetap di tempatnya.
#
# Angkanya bukan selera: 36 px adalah celah TERLEBAR di antara dua belas slide
# yang sudah disetujui pelanggan (Lemon Grass 36, Avocado 35 - dan Avocado justru
# slide yang dijadikan acuan). Jadi batas ini diambil dari pekerjaan yang sudah
# diterima, bukan dikarang, dan menurut konstruksinya kedua belas slide itu tidak
# berubah sedikit pun.
#
# Yang melewatinya cuma dua: Pure Dark Cocoa 50 px dan Dark Cocoa 41 px, keduanya
# bergelas kaki. Itu yang terbaca sebagai gelas melayang di sebelah kemasan.
GAP_MAX = 36
GAP_BAND = 120          # setinggi apa pita ukurnya, dari alas kemasan ke atas


def _mask(im):
    import numpy as np
    return np.abs(np.asarray(im.convert('RGB')).astype(int) - np.array(bs.BG)).max(2) > 18


def glass_gap(pouch_path, glass_img, gh, overlap):
    """Celah terlebar antara kemasan dan gelas pada pita bawah, dalam piksel."""
    import numpy as np
    pw = round(POUCH_H * 0.695)
    x0 = 200                                  # sembarang; yang diukur selisihnya
    cp = Image.new('RGBA', (1024, 1024), bs.BG + (255,))
    bs.place(cp, pouch_path, POUCH_H, left=x0, bottom=POUCH_BOTTOM)
    P = _mask(cp)
    fg = Image.new('RGB', (1024, 1024), bs.BG)
    photo.place(fg, glass_img, x0 + pw - overlap, BOTTOM, gh, body=True)
    G = _mask(fg)
    worst = 0
    for y in range(POUCH_BOTTOM - GAP_BAND, POUCH_BOTTOM - 20):
        px = np.nonzero(P[y])[0]
        gx = np.nonzero(G[y])[0]
        if len(px) and len(gx):
            worst = max(worst, int(gx.min()) - int(px.max()) - 1)
    return worst


def build(idx, glass_img, prop_img=None, out='slide.png', slug=None):
    p = bs.PRODUCTS[idx]
    pw = round(POUCH_H * 0.695)
    gw = photo.size_at(glass_img, GLASS_H, body=True)
    # Gelas digeser ke kiri hanya sebanyak yang diperlukan untuk membawa celahnya
    # kembali ke dalam batas yang sudah diterima. Nol untuk kedua belas produk lama.
    nudge = max(0, glass_gap(p['p1000'], glass_img, GLASS_H, GLASS_OVERLAP) - GAP_MAX)
    if prop_img:
        ph = photo.fit(prop_img, prop_height(slug), PROP_MAX_W)
        aw = photo.size_at(prop_img, ph)
        # Tumpang tindih ikut mengecil bersama propnya; 48 px tetap di alpukat
        # yang sudah disetujui, tapi pada biskuit 110 px itu menutup separuhnya.
        overlap = min(48, round(0.28 * aw))
    else:
        ph = aw = overlap = 0
    x0 = round(512 - (pw + gw - GLASS_OVERLAP - nudge - aw + overlap) / 2)

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
    clean = flat.copy()

    photo.place(flat, glass_img, x0 + pw - GLASS_OVERLAP - nudge, BOTTOM, GLASS_H, body=True)
    if prop_img:
        photo.place(flat, prop_img, x0 + overlap - aw, BOTTOM, ph)

    flat.paste(clean.crop((0, 0, 1024, TOP_GUARD)), (0, 0))

    flat.save(out)
    # Jendela yang boleh menjadi lebih terang ikut bergeser bersama gelasnya.
    # Tanpa itu, `nudge` piksel gelas yang memang berdiri DI DEPAN kemasan jatuh
    # di luar jendela dan dilaporkan sebagai "pale patch" - cacat pembukuan,
    # bukan cacat gambar.
    return out, layers_intact(clean, flat, [(x0, x0 + overlap),
                                            (x0 + pw - GLASS_OVERLAP - nudge, x0 + pw)])


def layers_intact(clean, final, allowed, margin=6, tol=14):
    """Check what the photo layers did to the slide beneath them.

    The pouch is drawn before any photo, so the clean render says exactly what
    the slide should look like underneath. Judging the finished image on its own
    cannot separate a defect from the packaging artwork; judging the difference
    can.

    Two things are looked for. Over the pouch the layers may only *darken*, which
    is what a cast shadow does - they may only brighten inside the narrow columns
    where the glass and the prop genuinely stand in front. The keying used to pull
    a glass's cast shadow into the subject, and the subject is composited against
    bone white, which printed a pale wedge across the Matcha Latte packaging.

    And nothing a layer adds may clip to pure white: the vignetted source frames
    used to blow the glass out in solid patches. The pouch wordmark is
    legitimately pure white, so only white the layers *introduced* counts."""
    import numpy as np
    from scipy import ndimage as ndi
    a = np.array(clean.convert('RGB')).astype(int)
    b = np.array(final.convert('RGB')).astype(int)
    bad = []

    pouch = ndi.binary_erosion(ndi.binary_fill_holes(a.mean(2) < 70),
                               np.ones((2 * margin + 1,) * 2))
    for lo, hi in allowed:
        pouch[:, max(0, lo - margin):hi + margin] = False
    bad += _blob((b.mean(2) - a.mean(2) > tol) & pouch, 120,
                 "pale patch of {} px painted over the pouch")
    bad += _blob((b == 255).all(2) & ~(a == 255).all(2), 700,
                 "blown-out white patch of {} px added by a photo layer")

    # Nothing may be drawn over the brand furniture. The Halal seal, the logo and
    # the three lines of type all go down before any photo, so a drink or a prop
    # that reaches their rows is composited straight over them.
    #
    # Checking the seal by its own shape is not enough: a bounding box survives
    # having its middle punched out, and the customer has twice had to ask that
    # the seal not disappear. Comparing against the clean render leaves nowhere
    # for that to hide.
    #
    # What is protected is the ink itself, not the band around it. A soft shadow
    # drifting across the empty background beside the seal harms nothing; one
    # crossing the seal does.
    touched = np.abs(b - a).max(2) > 2
    for name, (y0, y1) in PROTECTED.items():
        ink = np.abs(a[y0:y1] - np.array(bs.BG)).max(2) > 6
        ink = ndi.binary_dilation(ink, np.ones((7, 7)))
        hit = int((touched[y0:y1] & ink).sum())
        if hit:
            bad.append(f"a photo layer painted {hit} px over the {name}")
    return bad


# Where the brand furniture lives, measured off the approved reference. Only its
# ink is protected, found within these bands on the clean render.
PROTECTED = {
    "logo": (40, 100),
    "katakana": (150, 215),
    "headline": (225, 292),
    "sub-line": (298, 345),
    "Halal seal": (875, 1000),
}

# Above this there is nothing but brand furniture on bare background - the pouch
# does not start until y 389. A photo layer reaching up here has nothing to
# contribute and everything to spoil: it put a bright halo over the sub-line
# once, and left faint smudges under two of the katakana watermarks. The rows
# are simply restored from the clean render.
TOP_GUARD = 360


def _blob(mask, limit, msg):
    from scipy import ndimage as ndi
    import numpy as np
    if not mask.any():
        return []
    lab, n = ndi.label(mask, structure=np.ones((3, 3)))
    big = int(ndi.sum(mask, lab, range(1, n + 1)).max())
    return [] if big < limit else [msg.format(big)]
