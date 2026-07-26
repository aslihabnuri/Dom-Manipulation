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


def check(path):
    """Return a list of problems; empty means the slide passed."""
    bad = []
    im = Image.open(path).convert("RGB")
    if im.size != (1024, 1024):
        bad.append(f"size {im.size}, expected (1024, 1024)")
    a = np.array(im).astype(int)

    # The true border must be exactly bone white, along its whole length. Six
    # sample pixels used to stand in for this, which left most of every edge
    # unexamined - and the bottom, the one the glass and prop shadows actually
    # reach, had no inset sample at all.
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
