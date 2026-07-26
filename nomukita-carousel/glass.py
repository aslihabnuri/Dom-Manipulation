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


def liquid_geometry():
    """Masks and coordinates describing the poured liquid, so a recipe can paint
    into it (layers, drizzle, a swirl on the surface)."""
    H, W = _RATIO.shape[:2]
    Y, X = np.mgrid[0:H, 0:W]
    Lin, Rin = _L + INSET, _R - INSET
    inside = (Y >= TOP) & (Y <= BASE) & (X >= Lin[:, None]) & (X <= Rin[:, None])
    body = inside & (Y >= SURFACE) & (Y <= FLOOR)
    rx = (Rin[SURFACE] - Lin[SURFACE]) / 2
    ry = rx * 0.20
    ell = (((X - _CX[SURFACE]) / rx) ** 2 + ((Y - SURFACE) / ry) ** 2) <= 1
    return dict(Y=Y, X=X, Lin=Lin, Rin=Rin, cx=_CX, rx=rx, ry=ry,
                surface_ell=ell, body=body, liquid=body | ell,
                top=SURFACE, floor=FLOOR)


def render(backdrop, recipe):
    """Composite the filled glass over `backdrop`, an HxWx3 float array the size
    of the reference image. `recipe(geom)` returns the liquid colour."""
    geom = liquid_geometry()
    drink = recipe(geom)
    a = ndi.gaussian_filter(geom["liquid"].astype(float), 0.8)[..., None]
    base = backdrop * (1 - a) + drink * a
    return np.clip(base * _RATIO, 0, 255)


def plain(top_rgb, bottom_rgb, surface_rgb):
    """A single colour graded from the surface down to the floor."""
    def recipe(g):
        t = np.clip((g["Y"] - g["top"]) / (g["floor"] - g["top"]), 0, 1)[..., None]
        drink = np.array(top_rgb, float) * (1 - t) + np.array(bottom_rgb, float) * t
        return np.where((g["surface_ell"] & (g["Y"] < g["top"]))[..., None],
                        np.array(surface_rgb, float), drink)
    return recipe


def choco_avocado(seed=7):
    """Jus alpukat cokelat: a chocolate pool in the foot, creamy avocado green
    above it, and chocolate drizzled down the inside of the glass."""
    CHOC = np.array([72, 42, 28], float)
    CHOC_LIGHT = np.array([104, 63, 40], float)
    GREEN_TOP = np.array([190, 209, 143], float)
    GREEN_BOT = np.array([150, 176, 100], float)
    SURF = np.array([203, 220, 165], float)

    def recipe(g):
        Y, X = g["Y"], g["X"]
        top, floor = g["top"], g["floor"]
        rng = np.random.default_rng(seed)

        t = np.clip((Y - top) / (floor - top), 0, 1)[..., None]
        drink = GREEN_TOP * (1 - t) + GREEN_BOT * t

        # chocolate settled in the foot of the glass, with an uneven meniscus
        pool = floor - (floor - top) * 0.17
        wob = 7 * np.sin(X / 26.0 + 1.1) + 4 * np.sin(X / 11.0)
        edge = np.clip((Y - (pool + wob)) / 14.0, 0, 1)[..., None]
        drink = drink * (1 - edge) + (CHOC * 0.75 + CHOC_LIGHT * 0.25) * edge

        # Syrup drizzled onto the inner wall before pouring: uneven runs that
        # cling to the sides of the glass, thick where they start and tapering
        # into a bead. Even, parallel bands would read as painted stripes.
        L0, R0 = g["Lin"][top], g["Rin"][top]
        span = R0 - L0
        # bunched toward the walls, where the curve of the glass shows them
        seats = [0.06, 0.15, 0.30, 0.52, 0.72, 0.86, 0.95]
        drip = np.zeros(Y.shape, float)
        for i, s in enumerate(seats):
            x0 = L0 + span * (s + rng.uniform(-0.03, 0.03))
            amp = rng.uniform(2.5, 6.5)      # syrup runs with gravity, it does not snake
            per = rng.uniform(80.0, 160.0)
            pha = rng.uniform(0, 6.28)
            wide = rng.uniform(6.0, 19.0)
            start = top - rng.uniform(0, 26)
            end = top + (floor - top) * rng.uniform(0.30, 0.98)
            cx = x0 + amp * np.sin(Y / per + pha) + 0.4 * amp * np.sin(Y / (per * 0.31) + pha * 2)
            run = np.clip((Y - start) / 12.0, 0, 1) * np.clip((end - Y) / 30.0, 0, 1)
            # thickness wanders along the run, so no two sections match
            swell = 0.62 + 0.38 * np.sin(Y / rng.uniform(17.0, 34.0) + pha)
            w = wide * swell * (0.5 + 0.5 * run)
            band = np.clip(1 - np.abs(X - cx) / np.maximum(w, 1e-6), 0, 1) ** 0.7
            drip = np.maximum(drip, band * run)
            bead = np.clip(1 - np.hypot((X - (x0 + amp * np.sin(end / per + pha))) / (wide * 0.85),
                                        (Y - end) / (wide * 0.62)), 0, 1)
            drip = np.maximum(drip, bead ** 0.7)
        drip = ndi.gaussian_filter(drip, 2.2)
        drip = np.clip(drip * 1.25, 0, 1)[..., None]
        drink = drink * (1 - drip) + (CHOC_LIGHT * 0.55 + CHOC * 0.45) * drip

        # surface: pale green with a chocolate swirl folded through it
        ang = np.arctan2(Y - top, (X - g["cx"][top]) * g["ry"] / max(g["rx"], 1e-6))
        rad = np.hypot((X - g["cx"][top]) / max(g["rx"], 1e-6), (Y - top) / max(g["ry"], 1e-6))
        swirl = np.clip(1 - np.abs(np.sin(ang * 1.5 + rad * 3.4)) / 0.34, 0, 1) * np.clip(1 - rad, 0, 1)
        surf = SURF * (1 - swirl[..., None]) + CHOC_LIGHT * swirl[..., None]
        return np.where((g["surface_ell"] & (Y < top))[..., None], surf, drink)
    return recipe


def bbox():
    """Glass bounding box in the source image: (left, top, right, bottom)."""
    return int(np.floor(_L[TOP:BASE].min())), TOP, int(np.ceil(_R[TOP:BASE].max())), BASE


def paste(canvas, left, bottom, height, recipe):
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

    out = render(backdrop, recipe)
    layer = Image.fromarray(out.astype(np.uint8)).resize((tw, th), Image.LANCZOS)
    canvas.paste(layer, (int(round(ox)), int(round(oy))))
    return canvas
