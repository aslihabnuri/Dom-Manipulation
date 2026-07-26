"""Drop a studio photo onto the bone white slide, keeping its cast shadow.

The generated drink and prop shots come back on a near-white sweep, not on a
transparent background. Cutting them out with an alpha matte would throw away
the shadow and, for the glass, the see-through rim.

Same trick as `glass.py`: divide the photo by an estimate of the sweep it was
shot on, and multiply that ratio onto the slide. Opaque pixels carry their own
colour through, the glass stays translucent, and the shadow darkens the real
background instead of sitting on a pale rectangle.
"""

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

FLAT = 0.018      # below this the layer counts as untouched background
OBJ = 0.06        # fallback: deviation that counts as the object
EDGE = 2.6        # gradient strength that separates the subject from its shadow
BONE = (241, 240, 235)   # slide background the subject is developed against


def _layer(path):
    img = np.array(Image.open(path).convert("RGB")).astype(float)
    H, W, _ = img.shape
    Y, X = np.mgrid[0:H, 0:W]

    # rough object extent, so the backdrop estimate can ignore it
    border = np.concatenate([img[0], img[-1], img[:, 0], img[:, -1]])
    ref = np.median(border, 0)
    rough = np.abs(img - ref).sum(2) > 26
    rough = ndi.binary_opening(rough, np.ones((5, 5)))
    rough = ndi.binary_fill_holes(rough)
    # Blank the subject itself, not its bounding box: a tall glass fills the
    # frame corner to corner, and masking the box would leave the backdrop
    # estimate with almost no pixels to work from.
    pad = int(0.05 * max(H, W))
    hole = ndi.binary_dilation(rough, np.ones((3, 3)), iterations=max(1, pad // 2))

    w = (~hole).astype(float)
    if w.mean() < 0.06:                      # subject swallowed the frame
        w = np.zeros_like(w)
        w[:2] = w[-2:] = 1.0
        w[:, :2] = w[:, -2:] = 1.0
    sig = max(H, W) * 0.14
    ws = ndi.gaussian_filter(w, sig)
    bg = np.stack([ndi.gaussian_filter(img[..., c] * w, sig) / np.maximum(ws, 1e-6)
                   for c in range(3)], 2)
    ratio = img / np.maximum(bg, 1)

    dev = ndi.gaussian_filter(np.abs(ratio.mean(2) - 1), 3)

    # Separate the subject from its cast shadow by edge strength, not by
    # brightness: the glass rim, the liquid line and the fruit outline are
    # sharp, while a shadow on the sweep is a smooth gradient. Thresholding
    # brightness alone swallows the shadow, which runs to the frame edge and
    # would make the subject look far wider than it is.
    edge = ndi.gaussian_gradient_magnitude(img.mean(2), 2.0)
    obj = edge > EDGE
    obj = ndi.binary_closing(np.pad(obj, 25), np.ones((21, 21)))[25:-25, 25:-25]
    obj = ndi.binary_fill_holes(obj)
    lab, k = ndi.label(obj, structure=np.ones((3, 3)))
    if k > 1:
        obj = lab == (np.argmax(ndi.sum(obj, lab, range(1, k + 1))) + 1)
    if not obj.any():
        obj = dev > OBJ

    # The edge mask is an outline, and for a glass it is hollow: the interior
    # drains out through the mouth, so binary_fill_holes left it 19 per cent
    # filled and the unfilled channels printed as vertical streaks down the
    # drink. Fill each row between the outermost edge pixels instead - the cast
    # shadow has almost no gradient, so it never enters that span.
    filled = np.zeros_like(obj)
    for y in np.nonzero(obj.any(1))[0]:
        row = np.nonzero(obj[y])[0]
        filled[y, row.min():row.max() + 1] = True
    obj = filled

    ring0 = ndi.binary_dilation(obj, np.ones((3, 3)), iterations=25) & ~obj
    white = (np.percentile(img[ring0], 97, axis=0) if ring0.any()
             else np.array([245.0] * 3))
    bg = _calibrate(bg, ring0, white)
    ratio = img / np.maximum(bg, 1)

    # away from the object the layer may only darken - that is the cast shadow.
    # Letting it brighten prints the error of the backdrop estimate as a patch.
    ratio = np.where(obj[..., None], ratio, np.minimum(ratio, 1))

    influence = obj | (dev > FLAT)
    influence = ndi.binary_closing(np.pad(influence, 20), np.ones((15, 15)))[20:-20, 20:-20]
    influence = ndi.binary_fill_holes(influence)
    soft = ndi.gaussian_filter(influence.astype(float), 5)

    ramp = max(H, W) * 0.05
    fade = np.minimum.reduce([np.clip(X / ramp, 0, 1), np.clip((W - 1 - X) / ramp, 0, 1),
                              np.clip(Y / ramp, 0, 1), np.clip((H - 1 - Y) / ramp, 0, 1)])
    ratio = 1 + (ratio - 1) * (soft * fade)[..., None]

    # White point of the sweep right next to the subject. The generated frames
    # are vignetted - the sweep behind the glass reads ~240 while the frame edge
    # is ~213 - so a per-pixel divide blows the subject out: grey glass at 186
    # came back as 250 and the highlights clipped to pure white. The subject is
    # therefore rebalanced by this single local white instead.
    ys, xs = np.nonzero(obj)
    return (ratio, obj, white,
            (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def _calibrate(bg, ring, white):
    """Scale the backdrop estimate so it matches the sweep measured beside the
    subject. The generated frames are vignetted, so the diffused estimate reads
    ~210 where the real sweep behind the glass is ~240 - a 14 per cent error
    that pushed grey glass at 186 up to 250 and clipped highlights to white."""
    if not ring.any():
        return bg
    here = np.percentile(bg[ring], 97, axis=0)
    return bg * (white / np.maximum(here, 1.0))


_CACHE = {}
_MASK = {}
_WHITE = {}


def load(path):
    if path not in _CACHE:
        ratio, obj, white, bb = _layer(path)
        _CACHE[path] = (ratio, bb)
        _MASK[path] = obj
        _WHITE[path] = white
    return _CACHE[path]


GLASS_RATIO = 0.472   # width / height of the reference glass, measured across the set


def box(path, body=False):
    """Subject box. With `body=True` the box is the glass itself: the top is the
    rim rather than the tip of a garnish, and the bottom is the foot rather than
    the cast shadow pooling beneath it."""
    ratio, bb = load(path)
    if not body:
        return bb
    mask = _MASK[path]
    widths = mask.sum(1)
    rows = np.nonzero(widths)[0]
    med = np.median(widths[widths > 0.2 * widths.max()])

    # A shadow flaring out at the base is much wider than the glass, and taking
    # the widest row as the reference let it swallow the profile: on one render
    # the rim was found at y 808 instead of 240 and the glass came out four
    # times too large. Both ends are measured against the median width instead.
    rim = next(int(y) for y in rows if widths[y] >= 0.5 * med)
    foot = next(int(y) for y in rows[::-1] if widths[y] <= 1.35 * med)

    def span(top):
        cols = np.nonzero(mask[top:top + max(1, (foot - top) // 2)].any(0))[0]
        return int(cols.min()), int(cols.max()) + 1

    l, r = span(rim)
    # Every product uses the same glass, so a silhouette whose proportions are
    # far off means the drink blended into the sweep and the rim was missed -
    # the milky top of the charcoal drink did exactly that. Rebuild the rim from
    # the foot and the known shape rather than trusting the measurement.
    if abs((r - l) / max(foot - rim, 1) - GLASS_RATIO) > 0.12 * GLASS_RATIO:
        rim = max(0, foot - int(round((r - l) / GLASS_RATIO)))
        l, r = span(rim)
    return l, rim, r, foot


def size_at(path, height, body=False):
    """Width the object occupies when scaled to `height`."""
    l, t, r, b = box(path, body)
    return round((r - l) * height / (b - t))


def place(canvas, path, left, bottom, height, body=False):
    """Draw the photo so its subject lands at `left`, standing `height` tall
    with its foot on `bottom`."""
    ratio, _ = load(path)
    l, t, r, b = box(path, body)
    H, W = ratio.shape[:2]
    scale = height / (b - t)
    ox = int(round(left - l * scale))
    oy = int(round(bottom - b * scale))
    tw, th = int(round(W * scale)), int(round(H * scale))

    under = canvas.crop((ox, oy, ox + tw, oy + th)).convert("RGB")
    backdrop = np.array(under.resize((W, H), Image.LANCZOS)).astype(float)

    # A ratio layer multiplies, which is right for the cast shadow but wrong for
    # the subject: over the black pouch an avocado would be multiplied down to
    # near black and read as sitting *behind* the pouch. So the subject is
    # composited over the backdrop, developed against bone white, and only the
    # area outside it keeps the multiply.
    # Over the bone white slide, `backdrop * ratio` already reproduces the
    # subject exactly, so the multiply is kept. Alpha only matters where the
    # subject overlaps something else - the black pouch - because there the
    # multiply would darken an avocado into near black and it would read as
    # sitting behind the pouch.
    obj = _MASK[path]
    alpha = ndi.gaussian_filter(obj.astype(float), 1.0)[..., None]
    subject = ratio * np.array(BONE, float)
    out = np.clip(backdrop * ratio * (1 - alpha) + subject * alpha, 0, 255).astype(np.uint8)
    layer = Image.fromarray(out).resize((tw, th), Image.LANCZOS)

    # The layer's own fade is measured in source pixels, so a shadow that runs
    # to the edge of the pasted rectangle can still land on the slide border and
    # leave it a few levels off bone white. Fade back to the backdrop over the
    # last few pixels of the canvas instead.
    guard = 26
    cw, ch = canvas.size
    la = np.array(layer).astype(float)
    under_px = np.array(canvas.crop((ox, oy, ox + tw, oy + th)).convert("RGB")).astype(float)
    X0, Y0 = np.meshgrid(np.arange(tw) + ox, np.arange(th) + oy)
    keep = np.minimum.reduce([np.clip(X0 / guard, 0, 1), np.clip((cw - 1 - X0) / guard, 0, 1),
                              np.clip(Y0 / guard, 0, 1), np.clip((ch - 1 - Y0) / guard, 0, 1)])[..., None]
    layer = Image.fromarray(np.clip(la * keep + under_px * (1 - keep), 0, 255).astype(np.uint8))

    canvas.paste(layer, (ox, oy))
    return canvas
