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

    ys, xs = np.nonzero(obj)
    return ratio, obj, (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


_CACHE = {}
_MASK = {}


def load(path):
    if path not in _CACHE:
        ratio, obj, bb = _layer(path)
        _CACHE[path] = (ratio, bb)
        _MASK[path] = obj
    return _CACHE[path]


def box(path, body=False):
    """Subject box. With `body=True` the top is the glass rim rather than the
    tip of the garnish: a mint sprig or a fruit slice on the rim would otherwise
    count toward the height, and every product would end up with a differently
    sized glass."""
    ratio, bb = load(path)
    if not body:
        return bb
    mask = _MASK[path]
    l, t, r, b = bb
    widths = mask[:, l:r].sum(1)
    wide = np.nonzero(widths >= 0.6 * widths.max())[0]
    rim = int(wide.min())
    # Horizontal extent measured on the upper half of the body only. A garnish
    # leaning out of the rim would widen the box from above, and the cast shadow
    # pooling at the foot merges into the mask from below - on one render that
    # made the same glass measure 503 px wide instead of 394, which would drift
    # the glass across the pouch from product to product.
    cols = np.nonzero(mask[rim:rim + (b - rim) // 2].any(0))[0]
    return int(cols.min()), rim, int(cols.max()) + 1, b


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
    obj = _MASK[path]
    alpha = ndi.gaussian_filter(obj.astype(float), 1.0)[..., None]
    shadow = np.where(obj[..., None], 1.0, ratio)
    subject = ratio * np.array(BONE, float)
    out = np.clip(backdrop * shadow * (1 - alpha) + subject * alpha, 0, 255).astype(np.uint8)
    canvas.paste(Image.fromarray(out).resize((tw, th), Image.LANCZOS), (ox, oy))
    return canvas
