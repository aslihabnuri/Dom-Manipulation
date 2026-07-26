"""Fill the reference glass with a drink.

`Refrensi/Referensi_Gelas.jpeg` is an empty transparent tumbler shot on a grey
gradient. Rather than cutting it out (a transparent object has no clean matte),
the glass is kept as a *ratio* layer: every pixel divided by an estimate of the
backdrop it was shot against. Multiplying that ratio onto a new backdrop
reproduces the rim, the wall refractions, the highlights and the cast shadow,
and lets a drink colour sit behind the glass exactly as if it were poured in.
"""

import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

REF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ref/Referensi_Gelas.jpeg")

TOP, BASE = 87, 583          # glass rim and foot in the source image
SURFACE = 178                # liquid line
FLOOR = 545                  # inner floor, above the thick glass base
INSET = 9.0                  # wall thickness
AXIS = (1.18e-2, 300.5712)   # centre axis of the glass, fitted per row
FLAT = 0.012                 # below this the ratio is treated as untouched backdrop


def _geometry():
    img = np.array(Image.open(REF).convert("RGB")).astype(float)
    H, W, _ = img.shape
    Y, X = np.mgrid[0:H, 0:W]
    yn, xn = Y / H, X / W

    # Backdrop estimate by normalised convolution: blank out the glass and its
    # shadow, then let the surrounding grey diffuse across the hole. A plain
    # polynomial fit leaves a few percent of error at the edges, which prints as
    # a pale rectangle once the layer lands on the slide.
    hole = ((X > 150) & (X < 480) & (Y > 30)) | ((Y > 460) & (X < 480))
    w = (~hole).astype(float)
    ws = ndi.gaussian_filter(w, 90)
    bg = np.stack([ndi.gaussian_filter(img[..., c] * w, 90) / np.maximum(ws, 1e-6)
                   for c in range(3)], 2)
    ratio = img / np.maximum(bg, 1)

    # silhouette: the right edge is clean, the left is buried in the cast shadow,
    # so the left is mirrored across the fitted centre axis
    dev = np.abs(ratio.mean(2) - 1)
    R = np.full(H, np.nan)
    for y in range(TOP, BASE + 1):
        idx = np.nonzero(dev[y, 170:470] > 0.045)[0]
        if len(idx) > 3:
            R[y] = idx.max() + 170
    ok = np.nonzero(~np.isnan(R))[0]
    R = np.interp(np.arange(H), ok, R[ok])
    R = ndi.uniform_filter1d(R, 9)
    cx = np.polyval(AXIS, np.arange(H))
    L = 2 * cx - R

    # Restrict the layer to the glass and its cast shadow, and force everything
    # beyond that to exactly 1 — otherwise the residual of the backdrop fit
    # prints as a pale rectangle on the slide.
    sil = (Y >= TOP - 6) & (Y <= BASE + 6) & (X >= L[:, None] - 6) & (X <= R[:, None] + 6)
    # Outside the glass itself the layer may only darken — that is the cast
    # shadow. Allowing it to brighten would print the residual of the backdrop
    # estimate as a pale patch on the slide.
    ratio = np.where(sil[..., None], ratio, np.minimum(ratio, 1))
    shadow = (ndi.gaussian_filter(ratio.mean(2), 3) < 1 - FLAT) & (Y > 420) & (X < 540)
    influence = sil | shadow
    influence = ndi.binary_closing(np.pad(influence, 24), np.ones((17, 17)))[24:-24, 24:-24]
    influence = ndi.binary_fill_holes(influence)
    lab, k = ndi.label(influence, structure=np.ones((3, 3)))
    if k > 1:
        influence = lab == (np.argmax(ndi.sum(influence, lab, range(1, k + 1))) + 1)
    soft = ndi.gaussian_filter(influence.astype(float), 6)
    # The cast shadow runs off the left and bottom edges of the reference frame,
    # so fade the layer out there; otherwise the frame edge prints as a straight
    # cut through the shadow.
    ramp = 70.0
    fade = np.minimum.reduce([np.clip(X / ramp, 0, 1), np.clip((W - 1 - X) / ramp, 0, 1),
                              np.clip((H - 1 - Y) / ramp, 0, 1)])
    soft = (soft * fade)[..., None]
    ratio = 1 + (ratio - 1) * soft
    return ratio, L, R, cx


_RATIO, _L, _R, _CX = _geometry()


def render(backdrop, top_rgb, bottom_rgb, surface_rgb):
    """Composite the filled glass over `backdrop` (an HxWx3 float array the size
    of the reference image). Returns the blended float array."""
    H, W = _RATIO.shape[:2]
    Y, X = np.mgrid[0:H, 0:W]
    Lin, Rin = _L + INSET, _R - INSET

    inside = (Y >= TOP) & (Y <= BASE) & (X >= Lin[:, None]) & (X <= Rin[:, None])
    body = inside & (Y >= SURFACE) & (Y <= FLOOR)
    rx = (Rin[SURFACE] - Lin[SURFACE]) / 2
    ry = rx * 0.20
    ell = (((X - _CX[SURFACE]) / rx) ** 2 + ((Y - SURFACE) / ry) ** 2) <= 1
    liquid = body | ell

    t = np.clip((Y - SURFACE) / (FLOOR - SURFACE), 0, 1)[..., None]
    drink = np.array(top_rgb, float) * (1 - t) + np.array(bottom_rgb, float) * t
    drink = np.where((ell & (Y < SURFACE))[..., None], np.array(surface_rgb, float), drink)

    # feather the liquid edge so it meets the glass wall cleanly
    a = ndi.gaussian_filter(liquid.astype(float), 0.8)[..., None]
    base = backdrop * (1 - a) + drink * a
    return np.clip(base * _RATIO, 0, 255)


def bbox():
    """Glass bounding box in the source image: (left, top, right, bottom)."""
    return int(np.floor(_L[TOP:BASE].min())), TOP, int(np.ceil(_R[TOP:BASE].max())), BASE


def paste(canvas, left, bottom, height, top_rgb, bottom_rgb, surface_rgb):
    """Draw the filled glass onto a bone-white PIL canvas so that the glass
    itself lands at `left` with its foot on `bottom` and stands `height` tall."""
    gl, gt, gr, gb = bbox()
    scale = height / (gb - gt)
    src = np.array(canvas).astype(float)
    H, W = _RATIO.shape[:2]
    ox = left - gl * scale
    oy = bottom - gb * scale
    tw, th = int(round(W * scale)), int(round(H * scale))

    # sample the slide under the glass so its shadow falls on the real background
    under = Image.new("RGB", (tw, th), (241, 240, 235))
    region = canvas.crop((int(round(ox)), int(round(oy)),
                          int(round(ox)) + tw, int(round(oy)) + th)).convert("RGB")
    under.paste(region, (0, 0))
    backdrop = np.array(under.resize((W, H), Image.LANCZOS)).astype(float)

    out = render(backdrop, top_rgb, bottom_rgb, surface_rgb)
    layer = Image.fromarray(out.astype(np.uint8)).resize((tw, th), Image.LANCZOS)
    canvas.paste(layer, (int(round(ox)), int(round(oy))))
    return canvas
