"""Slide 1, varian 250 gram: pouch + gelas berisi minuman + prop bahan.

Pouch 250 gram itu sachet datar yang lebih lebar daripada tinggi, bukan pouch
berdiri seperti yang 1000 gram, dan tingginya separuh - rasio yang sudah dipakai
di slide kombinasi. Gelas minum lebih tinggi daripada pouch-nya, jadi skalanya
harus diputuskan, bukan diwarisi begitu saja.
"""

from PIL import Image, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('photo', 'photo.py'), ('r1', 'render_one.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, photo, r1

# Tinggi asli, dalam cm, pada skala yang dikunci di slide 1000 gram (18,2 px/cm).
POUCH_CM = 12.0      # pouch 250 gram, setengah tinggi yang 1000 gram
GLASS_CM = 18.0      # gelas 330 px di slide 1000 gram

# Yang disetujui pelanggan. Grupnya dikomposisikan untuk slide ini sendiri, bukan
# mewarisi skala slide 1000 gram, lalu pouch-nya sendiri dibesarkan 30% lagi.
PX_PER_CM = r1.PX_PER_CM * 1.35
POUCH_BOOST = 1.30
BOTTOM = r1.BOTTOM
GLASS_OVERLAP = 26
# ...tapi hanya untuk kemasan yang lebih LEBAR daripada tinggi.
#
# Sachet 250 gram itu datar dan melebar (494 x 383), jadi 26 px yang menutupi
# gelas tidak terasa. Kotak 300 gram jangkung dan ramping (248 x 479), dan
# gelasnya sendiri cuma 170 px lebar: 26 px berarti seperenam gelasnya hilang di
# balik kotak, dan sisanya terbaca sebagai potongan gelas, bukan gelas.
# Kemasan jangkung berdiri bersebelahan saja.
TALL_PACK_OVERLAP = 0


SEAL_TOP = 875       # segelnya mulai di 881; bayangan kontak gelas berhenti sebelum ini
SEAL_RAMP = 26


MARGIN = 60          # ruang kosong terkecil yang boleh tersisa di kiri dan kanan


def _garnish(glass_img, gh):
    """Seberapa jauh sesuatu menjulur ke luar badan gelas, kiri dan kanan.

    Termasuk bayangannya. Garnis saja tidak cukup: serai membuang bayangan lembut
    jauh ke kanan, dan walau gelasnya sendiri muat di dalam margin, bayangannya
    menyentuh inset kanan kanvas dan membuat tepinya meleset lima level.
    """
    import numpy as np
    photo.load(glass_img)
    reach = photo._SIL[glass_img] | photo._SHADOW[glass_img]
    cols = np.nonzero(reach.any(0))[0]
    l, t, r, b = photo.box(glass_img, True)
    scale = gh / (b - t)
    return round((l - int(cols.min())) * scale), round((int(cols.max()) + 1 - r) * scale)


def _clear_seal(flat, clean):
    """Kembalikan pita segel dari render bersih, dengan tepi yang dilandaikan.

    Segel Halal itu grafis datar yang ditempel, bukan benda di dalam adegan, jadi
    bayangan yang melintas di atasnya terbaca salah. Pada tata letak 250 gram
    gelasnya lebih besar dan bayangannya menjulur sampai ke sudut segel.

    Dikembalikan dengan landaian, bukan potongan tegas: memotong bayangan lembut
    di satu baris akan meninggalkan garis mendatar yang justru lebih kentara
    daripada bayangannya sendiri.
    """
    import numpy as np
    a = np.array(clean.convert('RGB')).astype(float)
    b = np.array(flat.convert('RGB')).astype(float)
    y = np.arange(1024)[:, None, None]
    t = np.clip((y - (SEAL_TOP - SEAL_RAMP)) / SEAL_RAMP, 0, 1)
    t = t * t * (3 - 2 * t)
    # rint, not a plain cast: truncating knocked every border pixel down a level
    out = np.rint(np.clip(b * (1 - t) + a * t, 0, 255)).astype('uint8')
    flat.paste(Image.fromarray(out), (0, 0))


def build(idx, glass_img, prop_img, out, slug,
          px_per_cm=PX_PER_CM, pouch_boost=POUCH_BOOST):
    """`px_per_cm` memilih skalanya. Pada 18,2 semuanya sama persis dengan slide
    1000 gram - gelas dan propnya identik, hanya pouch-nya yang berubah. Lebih
    besar dari itu berarti grupnya dikomposisikan untuk slide ini sendiri.

    `pouch_boost` membesarkan pouch-nya saja, meninggalkan gelas dan propnya di
    skala aslinya. Itu memang melanggar skala fisik - sachet 250 gram tidak
    setinggi gelas minum - tapi pouch-nya adalah produk yang dijual, dan di
    marketplace produknya harus memimpin. Sekali ini keputusan dagang, bukan
    keputusan fotografi."""
    p = bs.PRODUCTS[idx]
    # Kemasan kecilnya tidak selalu sachet 250 gram. Pure Dark Cocoa tidak punya
    # 250 gram sama sekali; yang ada kotak 300 gram, bentuknya lain sama sekali
    # dan tingginya lain pula, jadi berkas, kata beratnya dan tinggi fisiknya
    # diambil dari satu tempat - `bs.small_pack` - bukan ditulis ulang di sini.
    pack, weight, _ratio, pack_cm = bs.small_pack(p)
    ph_pouch = round(pack_cm * px_per_cm * pouch_boost)
    gh = round(GLASS_CM * px_per_cm)
    src = Image.open(f'{bs.PROD}/{pack}').convert('RGBA')
    src = src.crop(src.getbbox())
    pw = round(src.width * ph_pouch / src.height)

    overlap_glass = GLASS_OVERLAP if src.width >= src.height else TALL_PACK_OVERLAP
    gw = photo.size_at(glass_img, gh, body=True)
    # Garnis yang menjulur ke samping tidak ikut terhitung saat memusatkan grup,
    # karena pemusatannya memakai badan gelas. Pada skala 250 gram yang lebih
    # besar itu cukup untuk membuat polong vanili menembus margin kanan kanvas.
    # Jadi rentang sesungguhnya diukur dulu, lalu seluruh grupnya dikecilkan
    # secukupnya kalau memang tidak muat - satu aturan, bukan tambalan per produk.
    over_l, over_r = _garnish(glass_img, gh)
    if prop_img:
        prop_h = photo.fit(prop_img, round(r1.PROP_CM[slug] * px_per_cm), round(pw * 0.92))
        aw = photo.size_at(prop_img, prop_h)
        overlap = min(round(48 * px_per_cm / r1.PX_PER_CM), round(0.28 * aw))
    else:
        prop_h = aw = overlap = 0
    # Rentang sesungguhnya, diukur dari x0, termasuk garnis yang menjulur keluar
    # badan gelas. Grupnya dipusatkan pada rentang ini, bukan pada badan-badannya
    # saja: kalau tidak, polong vanili yang menjulur ke kanan menggeser seluruh
    # komposisinya dan menembus margin kanvas.
    rel_l = min(overlap - aw, pw - overlap_glass - over_l)
    rel_r = max(pw, pw - overlap_glass + gw + over_r)
    x0 = round(512 - (rel_l + rel_r) / 2)
    if rel_r - rel_l > 1024 - 2 * MARGIN:
        # Terlalu lebar bahkan setelah dipusatkan: kecilkan sekali, sebanyak yang
        # diperlukan. Sekali, bukan berulang - mengecilkan lalu memusatkan ulang
        # terhadap badan gelas tidak pernah konvergen, dan pernah berputar 985 kali
        # sampai kehabisan tumpukan rekursi.
        room = (1024 - 2 * MARGIN) / (rel_r - rel_l)
        return build(idx, glass_img, prop_img, out, slug,
                     px_per_cm * room * 0.995, pouch_boost)

    c = Image.new('RGBA', (1024, 1024), bs.BG + (255,))
    c.alpha_composite(Image.open(f'{bs.ASSETS}/logo_nomukita.png').convert('RGBA'), bs.LOGO_XY)
    bs.draw_text_top(c, p['kanji'], ImageFont.truetype(bs.F_JP, bs.KANJI_SIZE),
                     bs.KANJI_GREY, 512, bs.KANJI_TOP)
    h = bs.build_headline(p['head'], bs.HEAD_SIZE, bs.accent(p['head']))
    c.alpha_composite(h, ((1024 - h.width) // 2, bs.HEAD_TOP))
    bs.draw_text_top(c, f"{p['series']} grade · {weight}",
                     ImageFont.truetype(bs.F_BODY, bs.SUB_SIZE), bs.CHARCOAL, 512, bs.SUB_TOP)

    halal = Image.open(f'{bs.ASSETS}/halal.png').convert('RGBA')
    halal = halal.crop(halal.getbbox())
    hw = round(halal.width * bs.HALAL_H / halal.height)
    c.alpha_composite(halal.resize((hw, bs.HALAL_H), Image.LANCZOS),
                      ((1024 - hw) // 2, bs.HALAL_TOP))

    flat = Image.new('RGB', (1024, 1024), bs.BG)
    flat.paste(c, (0, 0), c)
    clean = flat.copy()

    # Gelas dan propnya dulu, pouch-nya belakangan - dan itu urutan yang penting.
    # Pouch 250 gram itu sachet datar yang lebih pendek daripada gelasnya, jadi
    # kalau fotonya ditaruh di atasnya, produknya - yang justru jadi hero - malah
    # terkubur di antara alpukat dan gelas. Digambar di depan, ia yang menutupi
    # keduanya dan kembali memimpin.
    photo.place(flat, glass_img, x0 + pw - overlap_glass, BOTTOM, gh, body=True)
    if prop_img:
        photo.place(flat, prop_img, x0 + overlap - aw, BOTTOM, prop_h)

    front = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    bs.place(front, pack, ph_pouch, left=x0, bottom=BOTTOM, white=True)
    flat.paste(front, (0, 0), front)

    flat.paste(clean.crop((0, 0, 1024, r1.TOP_GUARD)), (0, 0))
    _clear_seal(flat, clean)

    flat.save(out)
    return out, r1.layers_intact(clean, flat, [(x0, x0 + overlap),
                                               (x0 + pw - overlap_glass, x0 + pw)])
