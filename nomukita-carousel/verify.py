"""Automated checks on a finished slide.

Generation costs credits, so every slide is checked mechanically before it is
accepted: canvas size, bone white background on all four edges, the layout
landmarks measured off the approved Uji reference, the Halal seal, and the
blown-highlight failure that the vignetted source frames used to cause.
"""

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BONE = (241, 240, 235)

# measured off Uji_S1_500gr.png; +-1 px tolerance absorbs anti-aliasing
LOGO = (362, 52, 662, 88)
KANJI_TOP = 165
HEAD_TOP, HEAD_BOTTOM = 232, 284
SUB_TOP, SUB_BOTTOM = 304, 338
HALAL_TOP, HALAL_H = 881, 110
HALAL_PURPLE_FULL = 1484   # purple pixels in an intact seal at this size
HALAL_PURPLE = 1300        # below this it has been eaten into


def _ink(a, y0, y1, x0=0, x1=1024, thr=18):
    m = np.abs(a[y0:y1, x0:x1] - np.array(BONE)).sum(2) > thr
    ys, xs = np.nonzero(m)
    if len(ys) == 0:
        return None
    return (x0 + int(xs.min()), y0 + int(ys.min()), x0 + int(xs.max()) + 1, y0 + int(ys.max()) + 1)


def frame(path, sil, shadow, tol=6.0, area=400):
    """Check a generated photo before it is ever composited.

    Everything outside the subject is supposed to be bare studio sweep, so it
    should carry no detail at all - only the smooth falloff of the lighting and
    the subject's own shadow. Anything else printed there came from the model
    copying furniture out of the reference: a table edge, a horizon seam, or, on
    one run, the tiled stock-library watermark reproduced letter for letter.

    Measured as local contrast, which the lighting falloff does not have.
    """
    img = np.array(Image.open(path).convert("RGB")).astype(float).mean(2)
    away = ~ndi.binary_dilation(sil | shadow, np.ones((3, 3)), iterations=30)
    if not away.any():
        return []
    local = ndi.gaussian_filter(img, 1.2) - ndi.gaussian_filter(img, 6)
    dirty = (np.abs(local) > tol) & away
    if not dirty.any():
        return []
    dirty = ndi.binary_closing(dirty, np.ones((5, 5)))
    lab, n = ndi.label(dirty, structure=np.ones((3, 3)))
    big = int(ndi.sum(dirty, lab, range(1, n + 1)).max()) if n else 0
    return [] if big < area else [f"{big} px of detail on the sweep outside the subject"]


def matte(path, obj, sil, limit=2.0):
    """Check that the alpha matte has a clean edge rather than a torn one.

    Where the drink overlaps the pouch, alpha decides pixel by pixel whether the
    drink replaces the black packaging or multiplies onto it. A solid matte reads
    as a photographic edge; a speckled one alternates between the two every few
    pixels and prints as a band of gravel down the side of the glass.

    A pale drink did exactly that - too close in tone to the sweep it was shot on
    for a per-pixel test to hold - and so did the cast shadow's growth when it
    climbed the glass's own neutral wall.

    A clean matte crosses on and off about twice per row, once at each side.
    Counted inside the silhouette, where the drink is supposed to be solid. This
    is the one place `render_one.layers_intact` cannot look, because those are
    precisely the columns it has to let the drink brighten.
    """
    inner = ndi.binary_erosion(sil, np.ones((3, 3)), iterations=6)
    rows = np.nonzero(inner.any(1))[0]
    if not len(rows):
        return []
    crossings = [int(np.abs(np.diff(obj[y][inner[y]].astype(int))).sum()) for y in rows]
    med = float(np.median(crossings))
    return [] if med <= limit else [
        f"torn alpha matte: {med:.0f} on/off crossings per row inside the subject"]


def silhouette(path, sil, limit=0.45):
    """Check the keying found a subject rather than the whole picture.

    `frame()` only inspects what lies outside the silhouette, so it is blind
    exactly when the silhouette has swallowed everything - and that is a real
    failure mode, not a hypothetical one. A vessel reference cut from an approved
    slide carried that slide's warm, vignetted background; the model copied the
    background instead of obeying "pure white"; on a sweep like that the backdrop
    estimate misses, `ink` fires across sixty per cent of the frame, and the
    silhouette covers the lot. The layer then prints its whole rectangle onto the
    slide, which is how two pale blocks appeared beside a glass.

    A drink photographed on a sweep occupies about a fifth to a third of its
    frame. Two thirds means the keying has lost the subject.
    """
    frac = float(sil.mean())
    H, W = sil.shape
    edges = sum([sil[0].any(), sil[-1].any(), sil[:, 0].any(), sil[:, -1].any()])
    bad = []
    if frac > limit:
        bad.append(f"silhouette covers {frac:.0%} of the frame, expected under {limit:.0%}")
    if edges == 4:
        bad.append("silhouette touches all four frame edges")
    return bad


def _borders(a):
    """The true border must be exactly bone white, along its whole length.

    Six sample pixels used to stand in for this, which left most of every edge
    unexamined - and the bottom, the one the glass and prop shadows actually
    reach, had no inset sample at all.
    """
    bad = []
    edges = {"top": a[0], "bottom": a[-1], "left": a[:, 0], "right": a[:, -1]}
    for name, strip in edges.items():
        off = int(np.abs(strip - np.array(BONE)).max())
        if off:
            bad.append(f"{name} border departs from {BONE} by {off}")
    # A couple of pixels in, a soft shadow legitimately reaches the frame, so
    # these allow a level or two rather than demanding an exact match.
    insets = {"top": a[6], "bottom": a[-7], "left": a[:, 6], "right": a[:, -7]}
    for name, strip in insets.items():
        off = int(np.abs(strip - np.array(BONE)).max())
        if off > 2:
            bad.append(f"{name} inset departs from {BONE} by {off}")
    return bad


def flare(path, sil, limit=1.25):
    """Catch a patch painted under the vessel and counted as part of it.

    Two of the first three serving-suggestion frames came back with the vessel
    standing on a wide warm-beige slab. It is not a shadow: a shadow scales all
    three channels together, and this one measured 190/173/149 - forty levels of
    red over blue. `photo._key` is right to refuse it, which is exactly the
    trouble, because refusing to call it a shadow means calling it part of the
    subject. So it inherited the subject's licence to brighten as well as darken,
    skipped the knee that suppresses estimate error, and printed on the slide as
    a torn grey smear either side of the glass.

    Nothing else sees it. `frame()` looks only outside the subject and its
    shadow; `silhouette()` asks whether the keying swallowed the whole picture,
    and 38 per cent is nowhere near that; `matte()` asks whether the edge is
    clean, and the slab has a perfectly clean edge.

    What gives it away is the shape. A drinking vessel is about as wide at its
    foot as through its body; a vessel sitting on a slab is far wider. Across the
    twelve approved drinks this ratio runs 0.67 to 1.10, and the two bad frames
    measure 1.49 and 1.75.
    """
    w = sil.sum(1)
    rows = np.nonzero(w)[0]
    if len(rows) < 20:
        return []
    body = float(np.median(w[rows][w[rows] > 0.25 * w.max()]))
    if body <= 0:
        return []
    foot = int(rows[-1])
    band = w[max(int(rows[0]), foot - int(0.08 * (foot - rows[0]))):foot + 1]
    ratio = float(band.max()) / body
    return [] if ratio <= limit else [
        f"silhouette flares to {ratio:.2f}x its body width at the foot - "
        f"the subject is standing on a painted patch"]


def check(path):
    """Return a list of problems; empty means the slide passed."""
    bad = []
    im = Image.open(path).convert("RGB")
    if im.size != (1024, 1024):
        bad.append(f"size {im.size}, expected (1024, 1024)")
    a = np.array(im).astype(int)
    bad += _borders(a)

    logo = _ink(a, 20, 130)
    if logo != LOGO:
        bad.append(f"logo box {logo}, expected {LOGO}")

    kanji = _ink(a, 140, 215)
    if not kanji or abs(kanji[1] - KANJI_TOP) > 1:
        bad.append(f"katakana top {kanji[1] if kanji else None}, expected {KANJI_TOP}")
    elif abs((kanji[0] + kanji[2]) / 2 - 512) > 2:
        bad.append(f"katakana off centre at {(kanji[0] + kanji[2]) / 2}")

    head = _ink(a, 218, 300)
    if not head or abs(head[1] - HEAD_TOP) > 1:
        bad.append(f"headline top {head[1] if head else None}, expected {HEAD_TOP}")
    elif head[3] > HEAD_BOTTOM or abs((head[0] + head[2]) / 2 - 512) > 2:
        bad.append(f"headline box {head}")

    sub = _ink(a, 300, 350)
    if not sub or abs(sub[1] - SUB_TOP) > 1 or sub[3] > SUB_BOTTOM:
        bad.append(f"sub-line box {sub}, expected top {SUB_TOP}")
    elif abs((sub[0] + sub[2]) / 2 - 512) > 2:
        bad.append(f"sub-line off centre at {(sub[0] + sub[2]) / 2}")

    # Find the seal by its purple, not by any ink: the glass shadow reaches into
    # this corner of the slide and a plain ink box picks the shadow up instead.
    reg = a[860:1020, 400:640]
    purple = (reg[..., 2] > reg[..., 0] + 15) & (reg[..., 1] + 25 < reg[..., 0]) & (reg[..., 2] < 210)
    ys, xs = np.nonzero(purple)
    halal = None if len(ys) < 200 else (400 + int(xs.min()), 860 + int(ys.min()),
                                        400 + int(xs.max()) + 1, 860 + int(ys.max()) + 1)
    if not halal:
        bad.append("Halal seal missing")
    else:
        # Count the purple, do not just box it. A bounding box survives having
        # its middle punched out, and the seal goes down before the drink does,
        # so anything reaching these rows is composited straight over it. The
        # customer has twice had to ask that the seal not disappear; a gutted
        # seal used to pass all three of the tests below.
        if len(ys) < HALAL_PURPLE:
            bad.append(f"Halal seal only {len(ys)} purple px, expected ~{HALAL_PURPLE_FULL}")
        if abs(halal[1] - HALAL_TOP) > 1:
            bad.append(f"Halal top {halal[1]}, expected {HALAL_TOP}")
        if abs((halal[3] - halal[1]) - HALAL_H) > 2:
            bad.append(f"Halal height {halal[3] - halal[1]}, expected {HALAL_H}")
        if abs((halal[0] + halal[2]) / 2 - 512) > 2:
            bad.append(f"Halal off centre at {(halal[0] + halal[2]) / 2}")

    # Blown highlights are checked in render_one.layers_intact instead, against
    # the clean render: the pouch wordmark is legitimately pure white, and only
    # white that a photo layer *added* is a defect.
    return bad


# What each slide must actually say. Deliberately a second copy, kept apart from
# the table the slides are built from: a checker that reads its expectations out
# of the thing it is checking can only prove the render is repeatable, never that
# the words are right. If these two disagree, one of them has a typo.
EXPECTED = {
    "MatchaLatte": ("抹茶ラテ", "MATCHA LATTE", "premium"),
    "PremixMatcha": ("抹茶", "PREMIX MATCHA", "exclusive"),
    "TehTarik": ("テ・タリック", "TEH TARIK", "premium"),
    "ChocolateSignature": ("チョコレート", "CHOCOLATE SIGNATURE", "exclusive"),
    "CookiesCream": ("クッキー＆クリーム", "COOKIES & CREAM", "premium"),
    "Charcoal": ("チャコール", "CHARCOAL", "premium"),
    "Avocado": ("アボカド", "AVOCADO", "premium"),
    "Vanilla": ("バニラ", "VANILLA", "premium"),
    "MilkTea": ("ミルクティー", "MILK TEA", "premium"),
    "LemonTea": ("レモンティー", "LEMON TEA", "premium"),
    "FrappeBase": ("フラッペベース", "FRAPPE BASE", "premium"),
    "LemonGrass": ("レモングラス", "LEMON GRASS", "premium"),
}


def text(path, slug, bs, variant="1000 gram"):
    """Check that the slide says what it is supposed to say.

    Nothing else here reads the type at all - the katakana, headline and sub-line
    are tested for where their ink sits, not for what it spells. A wrong
    watermark, "500 gram" in place of "1000 gram", or a matcha-green headline on
    a product that is not matcha would all pass.

    That is not hypothetical on this project. The licensed font is a demo build
    whose `&` renders as a "DEMO" badge, which is why COOKIES & CREAM needs a
    fallback - a silent regression there would put the badge on a live slide.

    So the three lines are rendered again from `EXPECTED` and compared to the
    slide pixel for pixel.
    """
    from PIL import Image as _Image, ImageFont as _F
    if slug not in EXPECTED:
        return [f"no expected text on file for {slug}"]
    kana, head, series = EXPECTED[slug]
    got = np.array(Image.open(path).convert("RGB")).astype(int)

    want = _Image.new("RGBA", (1024, 1024), BONE + (255,))
    bs.draw_text_top(want, kana, _F.truetype(bs.F_JP, bs.KANJI_SIZE),
                     bs.KANJI_GREY, 512, bs.KANJI_TOP)
    h = bs.build_headline(head, bs.HEAD_SIZE, bs.accent(head))
    want.alpha_composite(h, ((1024 - h.width) // 2, bs.HEAD_TOP))
    bs.draw_text_top(want, f"{series} grade · {variant}",
                     _F.truetype(bs.F_BODY, bs.SUB_SIZE), bs.CHARCOAL, 512, bs.SUB_TOP)
    flat = _Image.new("RGB", (1024, 1024), BONE)
    flat.paste(want, (0, 0), want)
    exp = np.array(flat).astype(int)

    bad = []
    for name, (y0, y1) in [("katakana", (150, 215)), ("headline", (225, 292)),
                           ("sub-line", (298, 345))]:
        off = int(np.abs(got[y0:y1] - exp[y0:y1]).max())
        if off > 2:
            n = int((np.abs(got[y0:y1] - exp[y0:y1]).max(2) > 2).sum())
            bad.append(f"{name} does not match the expected text ({n} px differ by up to {off})")
    return bad


# ── slide 5: serving suggestions ─────────────────────────────────────────────
#
# Same principle as everywhere else in this file: the numbers are measured off
# the approved Uji_S5 and written down here, not imported from the module that
# draws the slide. A checker that reads its expectations out of the builder can
# only prove the render is repeatable.
S5_HEAD_TOP = 162
S5_SUB_TOP = 226
S5_MARK_X = (226, 516, 791)
S5_NAME_TOP = (316, 440, 316)
S5_EDGE = (95, None, 944)
S5_BASE = 915
S5_WIDTH = 340          # jatah lebar tiap kolom, sama dengan fit_s5.AVAIL
S5_GAP_MIN = 150        # celah terkecil antara kolom kiri dan kanan
S5_LEAD_CLEAR = 14      # jarak terkecil kolom tengah ke garis penunjuk
S5_CLEAR = 12           # jarak terkecil dasar keterangan ke puncak minuman
S5_MARK_RGB = (94, 152, 189)

# The sub-line, kept apart from the menu the slide is built from, so that a
# menu entry pasted onto the wrong product is caught rather than rendered.
S5_SUB = {
    "MatchaLatte": "one matcha latte", "PremixMatcha": "one premix matcha",
    "TehTarik": "one teh tarik", "ChocolateSignature": "one chocolate",
    "CookiesCream": "one cookies & cream", "Charcoal": "one charcoal",
    "Avocado": "one avocado", "Vanilla": "one vanilla",
    "MilkTea": "one milk tea", "LemonTea": "one lemon tea",
    "FrappeBase": "one frappe base", "LemonGrass": "one lemongrass",
}

# Jendela pengukuran keterangan. Kolom tengah turun 124 px sehingga tidak pernah
# sebaris dengan kedua tetangganya - jendelanya boleh selebar kanvas, dan memang
# harus: keterangan selebar 305 px yang rata tengah di x=516 membentang 364..668,
# jadi jendela yang dipotong di titik tengah antar sumbu akan memangkasnya dan
# melaporkan kolom itu meleset dari sumbunya padahal tidak.
S5_CAP_COL = ((0, 512), (0, 1024), (512, 1024))

# Kolom untuk wadahnya boleh dipotong di titik tengah antar sumbu - wadahnya
# memang tinggal di kolomnya masing-masing - dan diukur pada pita badan ini.
S5_COL = ((0, 371), (371, 653), (653, 1024))
S5_BODY = (545, 820)


def _dark(a, y0, y1, x0, x1, thr=120):
    """Kotak tinta gelap saja.

    Keterangannya charcoal (rata-rata 29), sedangkan garis penunjuk 218 dan
    penanda tetesnya 145. Ambang gelap memisahkan huruf dari grafis yang
    melintasi ketinggian yang sama - tanpa itu kotak kolom tengah melar sampai
    x=225 dan x=798, yaitu kedua garis penunjuknya, bukan hurufnya.
    """
    m = a[y0:y1, x0:x1].mean(2) < thr
    ys, xs = np.nonzero(m)
    if len(ys) == 0:
        return None
    return (x0 + int(xs.min()), y0 + int(ys.min()), x0 + int(xs.max()) + 1, y0 + int(ys.max()) + 1)


def s5(path, slug, bs):
    """Check a finished serving-suggestion slide."""
    bad = []
    im = Image.open(path).convert("RGB")
    if im.size != (1024, 1024):
        bad.append(f"size {im.size}, expected (1024, 1024)")
        return bad
    a = np.array(im).astype(int)
    bad += _borders(a)

    logo = _ink(a, 20, 130)
    if logo != LOGO:
        bad.append(f"logo box {logo}, expected {LOGO}")

    head = _ink(a, 140, 215)
    if not head or abs(head[1] - S5_HEAD_TOP) > 1:
        bad.append(f"headline top {head[1] if head else None}, expected {S5_HEAD_TOP}")
    elif abs((head[0] + head[2]) / 2 - 512) > 2:
        bad.append(f"headline off centre at {(head[0] + head[2]) / 2}")

    sub = _ink(a, 216, 270)
    if not sub or abs(sub[1] - S5_SUB_TOP) > 1:
        bad.append(f"sub-line top {sub[1] if sub else None}, expected {S5_SUB_TOP}")
    elif abs((sub[0] + sub[2]) / 2 - 512) > 2:
        bad.append(f"sub-line off centre at {(sub[0] + sub[2]) / 2}")
    bad += _s5_sub_text(a, slug, bs)

    # ── keterangan tiap kolom ────────────────────────────────────────────────
    caps = []
    for i in range(3):
        y0 = S5_NAME_TOP[i] - 8
        box = _dark(a, y0, y0 + 98, *S5_CAP_COL[i])
        if box is None:
            bad.append(f"column {i} has no caption")
            caps.append(None)
            continue
        caps.append(box)
        if abs(box[1] - S5_NAME_TOP[i]) > 1:
            bad.append(f"column {i} caption top {box[1]}, expected {S5_NAME_TOP[i]}")
        if S5_EDGE[i] is None:
            if abs((box[0] + box[2]) / 2 - S5_MARK_X[i]) > 2:
                bad.append(f"column {i} not centred: {(box[0] + box[2]) / 2} vs {S5_MARK_X[i]}")
            half = (box[2] - box[0]) / 2
            room = min(S5_MARK_X[1] - S5_MARK_X[0], S5_MARK_X[2] - S5_MARK_X[1]) - S5_LEAD_CLEAR
            if half > room:
                bad.append(f"centre caption reaches the lead lines ({half:.0f} > {room})")
        else:
            got = box[0] if i == 0 else box[2]
            if got != S5_EDGE[i]:
                bad.append(f"column {i} edge at {got}, expected {S5_EDGE[i]}")
        w = box[2] - box[0]
        if w > S5_WIDTH:
            bad.append(f"column {i} caption {w} px wide, allowed {S5_WIDTH}")
    if caps[0] and caps[2]:
        gap = caps[2][0] - caps[0][2]
        if gap < S5_GAP_MIN:
            bad.append(f"only {gap} px between the outer captions, expected {S5_GAP_MIN}")

    # ── penanda tetes ────────────────────────────────────────────────────────
    mark = np.abs(a - np.array(S5_MARK_RGB)).sum(2) < 40
    lab, n = ndi.label(mark, structure=np.ones((3, 3)))
    found = []
    for k in range(1, n + 1):
        ys, xs = np.nonzero(lab == k)
        if len(ys) >= 100:
            found.append(int(round(xs.mean())))
    for i, x in enumerate(S5_MARK_X):
        if not any(abs(f - x) <= 3 for f in found):
            bad.append(f"no marker on column {i} (x={x}); found {sorted(found)}")

    # ── minumannya ───────────────────────────────────────────────────────────
    #
    # Diukur di pita badan - di bawah keterangan, di atas kolam bayangan pada
    # alasnya. Bukan pilihan yang sewenang-wenang: di dekat garis pijak, bayangan
    # ketiga gelas saling bersentuhan, jadi seluruh baris itu menyatu menjadi satu
    # gumpalan 138..922 dan setiap uji yang bersandar pada komponen terhubung
    # akan melapor "gelasnya bertumpuk" untuk slide yang jelas-jelas tidak.
    ink = np.abs(a - np.array(BONE)).sum(2) > 18
    body = ink[S5_BODY[0]:S5_BODY[1]]
    for i in range(3):
        x0, x1 = S5_COL[i]
        cols = np.nonzero(body[:, x0:x1].any(0))[0]
        if not len(cols):
            bad.append(f"column {i} has no drink")
            continue
        lo, hi = x0 + int(cols.min()), x0 + int(cols.max())
        if lo <= x0 or hi >= x1 - 1:
            bad.append(f"column {i} drink spans {lo}..{hi}, out of its column {x0}..{x1}")
        # Cari puncak minuman di bawah keterangannya, dengan jalur penunjuknya
        # ditutup: garis dan penanda tetes berdiri persis di sumbu kolom, mulai
        # enam piksel di bawah keterangan, jadi tanpa ditutup merekalah yang
        # selalu terhitung sebagai "puncak minuman".
        strip = np.ones(hi - lo + 1, bool)
        strip[max(0, S5_MARK_X[i] - lo - 7):S5_MARK_X[i] - lo + 8] = False
        # +3 karena kotak keterangan diukur dengan ambang gelap, sedangkan
        # minuman dicari dengan ambang tinta yang jauh lebih peka: ekor
        # antialias huruf terakhir masih terhitung tinta satu-dua baris di bawah
        # kotaknya, dan tanpa jarak ini ekor itulah yang dilaporkan sebagai
        # puncak minuman yang menabrak keterangannya sendiri.
        y0 = (caps[i][3] + 3 if caps[i] else S5_NAME_TOP[i] + 98)
        rows = np.nonzero(ink[y0:, lo:hi + 1][:, strip].any(1))[0]
        if not len(rows):
            bad.append(f"column {i} has no drink below its caption")
            continue
        top = y0 + int(rows.min())
        if caps[i] and top < caps[i][3] + S5_CLEAR:
            bad.append(f"column {i} drink reaches {top}, {caps[i][3] + S5_CLEAR - top} px "
                       f"into its caption")
        if not ink[S5_BASE - 8:S5_BASE + 2, lo:hi + 1].any():
            bad.append(f"column {i} drink does not stand on {S5_BASE}")
    return bad


def _s5_sub_text(a, slug, bs):
    """Re-draw the sub-line from this file's own copy and compare it."""
    from PIL import Image as _Image, ImageFont as _F
    if slug not in S5_SUB:
        return [f"no expected sub-line on file for {slug}"]
    want = _Image.new("RGBA", (1024, 1024), BONE + (255,))
    _s5_text(want, f"{S5_SUB[slug]}, three ways to enjoy",
             _F.truetype(bs.F_BODY, 24), (29, 29, 30), S5_SUB_TOP)
    flat = _Image.new("RGB", (1024, 1024), BONE)
    flat.paste(want, (0, 0), want)
    exp = np.array(flat).astype(int)
    off = int(np.abs(a[216:262] - exp[216:262]).max())
    if off <= 2:
        return []
    n = int((np.abs(a[216:262] - exp[216:262]).max(2) > 2).sum())
    return [f"sub-line does not match the expected text ({n} px differ by up to {off})"]


def _s5_text(canvas, text, font, colour, top, cx=512):
    """Centre a line on `cx` with its ink top at `top` - the same placement
    rule the slide is drawn with, restated here so the comparison is fair."""
    from PIL import Image as _Image, ImageDraw as _D
    pad = 400
    layer = _Image.new("RGBA", (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    _D.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    canvas.alpha_composite(layer, (round(cx - (bb[0] + bb[2]) / 2), round(top - bb[1])))
