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


def check(path):
    """Return a list of problems; empty means the slide passed."""
    bad = []
    im = Image.open(path).convert("RGB")
    if im.size != (1024, 1024):
        bad.append(f"size {im.size}, expected (1024, 1024)")
    a = np.array(im).astype(int)

    # The true border must be exactly bone white. A couple of pixels further in,
    # the soft shadow of a product legitimately reaches the frame, so those
    # samples allow a level or two rather than demanding an exact match.
    for name, px in [("top border", (0, 512)), ("bottom border", (1023, 512)),
                     ("left border", (512, 0)), ("right border", (512, 1023)),
                     ("top-left", (0, 0)), ("bottom-right", (1023, 1023))]:
        if tuple(a[px]) != BONE:
            bad.append(f"{name} is {tuple(a[px])}, expected {BONE}")
    for name, px in [("left inset", (512, 6)), ("right inset", (512, 1017)),
                     ("top inset", (6, 512))]:
        if max(abs(int(a[px][c]) - BONE[c]) for c in range(3)) > 2:
            bad.append(f"{name} is {tuple(a[px])}, too far from {BONE}")

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
