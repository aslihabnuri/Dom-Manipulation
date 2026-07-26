"""Drop a studio photo onto the bone white slide, keeping its cast shadow.

The generated drink and prop shots come back on a near-white sweep, not on a
transparent background. Cutting them out with an alpha matte would throw away
the shadow and, for the glass, the see-through rim.

So instead of cutting out: divide the photo by an estimate of the sweep it was
shot on, and multiply that ratio onto the slide. Opaque pixels carry their own
colour through, the glass stays translucent, and the shadow darkens the real
background instead of sitting on a pale rectangle.

Over bone white the multiply reproduces the photo exactly, so a mask is only
needed where the subject overlaps the black pouch. Two masks come out of the
keying, because the two jobs want opposite mistakes:

- `obj` decides where the subject *replaces* the pouch. Too generous and the
  slide gets bone white painted over black packaging; too mean and the drink
  just darkens a little. So it is built conservatively.
- `sil` is the silhouette used to measure the glass. It has to span the whole
  body including the clear rim and foot, so it is built generously.

Both are separated from the cast shadow by what a shadow physically is on a
white sweep: a broad, neutral, smooth change in level. An object is anything
that carries colour, goes dark, or holds detail. Smoothness is measured over a
neighbourhood rather than per pixel, because a hard studio shadow has a sharp
boundary and a per-pixel test reads that boundary as an object.
"""

import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BONE = (241, 240, 235)   # slide background the subject is developed against

# What counts as bare sweep, and what counts as a cast shadow across it.
DEV_LUM = 0.030      # luminance departure from the sweep that counts as ink
DEV_CHROMA = 0.040   # colour cast that counts as ink
SHADOW_CHROMA = 0.055    # a shadow is neutral: it scales all three channels alike
TEXTURE = 1.0            # local contrast that means detail rather than a level change
INNER_LUM = 0.014        # neighbourhood deviation that means the subject is really there
INNER_CHROMA = 0.022     # and the same for colour
FLOOR = 0.030            # darkening below this, outside the subject, is estimate error
SPAN = 0.060             # and it ramps up to full strength over this much more


def _backdrop(path):
    """The sweep the photo was shot on, estimated and white-balanced.

    Cached on disk: it is the expensive half of the keying (two large gaussian
    diffusions per channel) and it does not depend on any of the thresholds, so
    tuning them stays cheap."""
    cache = os.path.join(os.path.dirname(os.path.abspath(path)), ".bg",
                         os.path.basename(path) + ".npz")
    img = np.array(Image.open(path).convert("RGB")).astype(float)
    if os.path.exists(cache) and os.path.getmtime(cache) > os.path.getmtime(path):
        return img, np.load(cache)["bg"]
    bg = _estimate(img)
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    np.savez_compressed(cache, bg=bg.astype(np.float32))
    return img, bg


def _estimate(img):
    H, W, _ = img.shape

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

    # White point of the sweep right next to the subject. The generated frames
    # are vignetted - the sweep behind the glass reads ~240 while the frame edge
    # is ~213 - so a per-pixel divide blows the subject out: grey glass at 186
    # came back as 250 and the highlights clipped to pure white. Calibrating the
    # estimate against a ring measured beside the subject fixes that.
    seed = ndi.binary_fill_holes(ndi.binary_opening(
        np.abs(img / np.maximum(bg, 1) - 1).mean(2) > 0.05, np.ones((5, 5))))
    ring0 = ndi.binary_dilation(seed, np.ones((3, 3)), iterations=25) & ~seed
    white = (np.percentile(img[ring0], 97, axis=0) if ring0.any()
             else np.array([245.0] * 3))
    return _calibrate(bg, ring0, white)


def _layer(path):
    img, bg = _backdrop(path)
    H, W, _ = img.shape
    Y, X = np.mgrid[0:H, 0:W]
    ratio = img / np.maximum(bg, 1)

    obj, sil, shadow = _key(img, ratio)

    # Away from the subject the layer may only darken - that is the cast shadow.
    # Letting it brighten prints the error of the backdrop estimate as a pale
    # patch. Inside the silhouette brightening is real (caustics, highlights).
    ratio = np.where(sil[..., None], ratio, np.minimum(ratio, 1))

    # And outside the subject a darkening of a few per cent is not a shadow, it
    # is what the backdrop estimate got wrong. The avocado was shot on a grey
    # sweep the estimate could not quite follow, and the four per cent it left
    # behind printed as a soft rectangle around the glass. A real contact shadow
    # is twenty to fifty per cent down, so a knee here costs the penumbra a
    # little softness and nothing else.
    dark = np.clip((1 - ratio.min(2) - FLOOR) / SPAN, 0, 1)
    dark = dark * dark * (3 - 2 * dark)
    ratio = np.where(sil[..., None], ratio, 1 - (1 - ratio) * dark[..., None])

    # What may print is the subject and its shadow, and nothing else. This used
    # to be any pixel deviating from the backdrop by 1.8 per cent, which also let
    # through whatever the estimate got wrong: the avocado was shot on a grey
    # sweep, and a residual four per cent darkening printed as a soft rectangle
    # around the glass with visible straight edges. The shadow is now identified
    # in its own right, so the loose threshold is not needed to catch it.
    influence = ndi.binary_closing(np.pad(sil | shadow, 20), np.ones((15, 15)))[20:-20, 20:-20]
    influence = ndi.binary_fill_holes(influence)
    soft = ndi.gaussian_filter(influence.astype(float), 5)

    # Only what lies near the subject may print. A cast shadow stays close to the
    # thing that casts it, while the residual vignette in a far corner of the
    # frame is just error in the backdrop estimate - and it was being carried
    # onto the slide, where a six per cent darkening from the top of one source
    # frame landed right across the sub-line. Ramp the layer out over a quarter
    # of the frame, which is well beyond the reach of any of these shadows.
    reach = 0.22 * max(H, W)
    d = ndi.distance_transform_edt(~(sil | shadow))
    t = np.clip(1 - d / reach, 0, 1)
    soft *= t * t * (3 - 2 * t)

    ramp = max(H, W) * 0.05
    fade = np.minimum.reduce([np.clip(X / ramp, 0, 1), np.clip((W - 1 - X) / ramp, 0, 1),
                              np.clip(Y / ramp, 0, 1), np.clip((H - 1 - Y) / ramp, 0, 1)])
    ratio = 1 + (ratio - 1) * (soft * fade)[..., None]

    ys, xs = np.nonzero(sil)
    return (ratio, obj, sil, shadow,
            (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def _key(img, ratio):
    """Split the frame into subject and cast shadow.

    Segmenting on edge strength was fragile in both directions. A drink whose
    tone is smooth - the cream band on the frappe, the milky top of the charcoal
    - carries no gradient, so the outline broke in two and the largest-component
    step threw half the glass away, printing as horizontal bands. Meanwhile the
    shadow streaking off to one side *does* have an edge, so it was pulled into
    the subject and painted bone white across the black pouch.

    What the two have in common is that neither can be told apart by how light
    or how neutral it is - a milky drink and a soft shadow sit at the same level
    and the same chroma. They differ in where they are: the shadow lies on open
    sweep, the drink is enclosed by the wall of its glass. So detail and colour
    are used only to draw that wall, and a flood fill from the frame edge decides
    which side of it each pixel is on.
    """
    lum = ratio.mean(2)
    chroma = ratio.max(2) - ratio.min(2)

    # Smoothness has to be measured over a region, not per pixel. A hard studio
    # shadow has a sharp boundary, so a per-pixel edge test calls that boundary
    # an object; it closes into a loop, `fill_holes` fills the shadow inside it,
    # and the whole thing composites as an opaque slab of bone white across the
    # pouch. Local contrast blurred over a neighbourhood asks the right question
    # instead: is there *detail* here, or only a change in level?
    grey = img.mean(2)
    texture = ndi.gaussian_filter(
        np.abs(ndi.gaussian_filter(grey, 1.2) - ndi.gaussian_filter(grey, 6)), 8)

    ink = (np.abs(lum - 1) > DEV_LUM) | (chroma > DEV_CHROMA)

    # Telling a cast shadow from a drink turns out to be a question about
    # topology, not about levels. Both are smooth and both can be neutral, and
    # every threshold tried here traded one failure for the other. What actually
    # separates them is that a shadow lies on open sweep - you can reach it from
    # the edge of the frame without crossing anything - while the drink is sealed
    # inside the wall of its glass. Detail and colour draw that wall; the flood
    # fill decides what is outside it.
    core = ndi.binary_closing(ink & ((chroma > SHADOW_CHROMA) | (texture > TEXTURE)),
                              np.ones((7, 7)))
    lab, _ = ndi.label(~core)
    outside = np.isin(lab, np.unique(np.concatenate(
        [lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    shadow = outside & ink

    # That finds the inside of the shadow but stops at its own boundary, which
    # carries detail and so counts as wall. Left there, a 20 px rim of shadow
    # survives as subject and prints as a pale bar across the pouch. Grow the
    # shadow back out through neutral ink until it meets something with colour:
    # a shadow has no colour anywhere, not even at its edge, whereas the drink
    # that would stop the growth does. Where the growth runs on up a clear glass
    # wall that is no loss - clear glass should show what is behind it, which is
    # exactly what dropping out of the subject mask makes it do.
    # Bounded, not unbounded: let it run as far as it likes and a drink that is
    # both dark and neutral swallows it whole - the charcoal glass measured 151 px
    # wide instead of 370. The rim is about twenty pixels, so twenty-five is
    # enough to reclaim it and far too few to climb a glass.
    neutral = ink & (chroma < SHADOW_CHROMA)
    shadow = shadow | ndi.binary_dilation(shadow, np.ones((3, 3)), iterations=25,
                                          mask=neutral)

    solid = ndi.binary_opening(ink & ~shadow, np.ones((3, 3)))
    solid = ndi.binary_closing(np.pad(solid, 12), np.ones((9, 9)))[12:-12, 12:-12]
    solid = ndi.binary_fill_holes(solid)

    # Keep every real piece, not just the biggest: a mint sprig or an ice cube
    # beside the glass is part of the shot. The cast shadow is already gone, so
    # there is nothing left for a permissive threshold to pick up by mistake.
    lab, k = ndi.label(solid, structure=np.ones((3, 3)))
    if k > 1:
        area = ndi.sum(solid, lab, range(1, k + 1))
        solid = np.isin(lab, 1 + np.nonzero(area >= max(1500, 0.02 * area.max()))[0])
    if not solid.any():
        solid = ink

    # Silhouette: bridge the smooth bands with a tall closing, then fill each
    # column between its outermost pixels. A glass interior drains out through
    # the mouth, so binary_fill_holes alone leaves it open. Neither step can
    # bring the shadow back, because it is not in `solid` to begin with.
    sil = ndi.binary_closing(np.pad(solid, 40), np.ones((81, 1)))[40:-40, 40:-40]
    sil = ndi.binary_fill_holes(sil)
    col = np.zeros_like(sil)
    for x in np.nonzero(sil.any(0))[0]:
        r = np.nonzero(sil[:, x])[0]
        col[r.min():r.max() + 1, x] = True
    sil = col

    # Alpha mask: everything clearly inside the silhouette, plus the solid ink
    # itself. Eroding keeps a few pixels of soft edge on the multiply, where a
    # hard alpha would cut the antialiasing off against the pouch.
    # Gate the interior on whether there is anything there. The vertical closing
    # that rebuilds the body also bridges gaps holding nothing at all, and
    # anything opaque there prints as a flat slab of bone white beside the pouch.
    #
    # The gate averages over a neighbourhood rather than testing each pixel. A
    # pale drink sits barely above the sweep it was shot on - the vanilla shake
    # reads 0.023 against the sweep's 0.007 - so a per-pixel threshold flickers
    # through it and left a tenth of the drink unclaimed. Alpha then dropped to
    # zero in those speckles and the black pouch showed through them, chewing a
    # dirty fringe down the edge where the drink overlaps the packaging. Averaged
    # over a neighbourhood the two separate cleanly, because bare sweep is
    # consistently flat while a drink is consistently, if only slightly, not.
    near = ((ndi.gaussian_filter(np.abs(lum - 1), 6) > INNER_LUM)
            | (ndi.gaussian_filter(chroma, 6) > INNER_CHROMA))
    obj = solid | (ndi.binary_erosion(sil, np.ones((3, 3)), iterations=3) & near)
    return obj, sil, shadow


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
_SIL = {}
_SHADOW = {}


def load(path):
    if path not in _CACHE:
        ratio, obj, sil, shadow, bb = _layer(path)
        _CACHE[path] = (ratio, bb)
        _MASK[path] = obj
        _SIL[path] = sil
        _SHADOW[path] = shadow
    return _CACHE[path]


def box(path, body=False):
    """Subject box. With `body=True` the box is the glass itself: the top is the
    rim rather than the tip of a garnish, and the bottom is the foot.

    Every product used to share one reference glass, so a silhouette whose
    proportions were off could be rebuilt from a known width/height ratio. Each
    drink now keeps the glass from its own reference, so there is no such ratio
    to fall back on - the measurement has to stand on its own. It can, because
    the silhouette no longer contains the cast shadow that used to swallow the
    profile and make the glass four times too large."""
    ratio, bb = load(path)
    if not body:
        return bb
    sil = _SIL[path]

    # Left and right come from the column heights, not from the widest row. A
    # glass throws a caustic sideways across the sweep, and though that streak is
    # only a few pixels tall it reaches far enough to have made one glass measure
    # 588 px wide instead of 370. The body is the tall part of the silhouette, so
    # take the longest run of columns standing at a decent share of full height.
    h = sil.sum(0)
    tall = h >= 0.35 * h.max()
    starts = np.nonzero(tall & ~np.r_[False, tall[:-1]])[0]
    ends = np.nonzero(tall & ~np.r_[tall[1:], False])[0] + 1
    i = int(np.argmax(ends - starts))
    l, r = int(starts[i]), int(ends[i])

    widths = sil[:, l:r].sum(1)
    rows = np.nonzero(widths)[0]
    med = np.median(widths[widths > 0.25 * widths.max()])

    # The rim is where the body reaches its normal width; anything narrower
    # above it is garnish - a mint sprig, a vanilla flower, a dome of foam.
    rim = next(int(y) for y in rows if widths[y] >= 0.55 * med)
    foot = int(rows[-1])
    return l, rim, r, foot


def size_at(path, height, body=False):
    """Width the object occupies when scaled to `height`."""
    l, t, r, b = box(path, body)
    return round((r - l) * height / (b - t))


def fit(path, height, max_width, body=False):
    """Height to draw the object at so it stands `height` tall without growing
    wider than `max_width`. A prop is sized by its real height, but something
    photographed lying down - a bundle of lemongrass, vanilla beans beside their
    flower - runs wide, and past the width of the pouch it stops reading as a
    prop next to the product and starts competing with it."""
    w = size_at(path, height, body)
    return height if w <= max_width else max(1, round(height * max_width / w))


def place(canvas, path, left, bottom, height, body=False, replace=True):
    """Draw the photo so its subject lands at `left`, standing `height` tall
    with its foot on `bottom`.

    `replace=False` drops the alpha path and multiplies only - see the note
    beside it below."""
    ratio, _ = load(path)
    l, t, r, b = box(path, body)
    H, W = ratio.shape[:2]
    scale = height / (b - t)
    ox = int(round(left - l * scale))
    oy = int(round(bottom - b * scale))
    tw, th = int(round(W * scale)), int(round(H * scale))

    under = canvas.crop((ox, oy, ox + tw, oy + th)).convert("RGB")
    backdrop = np.array(under.resize((W, H), Image.LANCZOS)).astype(float)

    # Over the bone white slide `backdrop * ratio` already reproduces the photo
    # exactly, so the multiply is kept. Alpha only matters where the subject
    # overlaps something else - the black pouch - because there the multiply
    # would darken an avocado into near black and it would read as sitting
    # behind the pouch.
    # Where nothing is drawn behind the subject, alpha buys nothing and costs
    # something. `subject = ratio * BONE` is "what this photo would look like on
    # bone white", so wherever alpha is one the layer paints that *over whatever
    # is already there* - and `obj` is not trustworthy on a frame whose vessel
    # stands on a painted slab, because the slab is inside it. On the vanilla
    # serving slide the mug's slab reached x=390, the next drink's rectangle
    # began at x=317, and inside the overlap the second layer repainted the first
    # one's slab at 0.92 x bone: a pale rectangle with a straight vertical edge
    # at exactly x=317. Multiplying instead darkens 172 to 158 and leaves no seam.
    #
    # So the alpha path exists for one job only - the drink standing in front of
    # the black pouch on slide 1, where multiplying would drag an avocado down to
    # near black and read as if it were behind the packaging. The three vessels
    # on slide 5 stand apart on bare bone white and never overlap anything.
    alpha = 0.0
    if replace:
        alpha = ndi.gaussian_filter(_MASK[path].astype(float), 1.0)[..., None]
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
                              np.clip(Y0 / guard, 0, 1), np.clip((ch - 1 - Y0) / guard, 0, 1)])

    # Hold the layer to where it actually does something. The pasted rectangle is
    # much bigger than the drink, and reaching the source resolution and back
    # puts the canvas through two Lanczos passes - which ring. Over the sub-line
    # that printed a row of pixels nine levels *brighter* than the background,
    # sitting on top of the digits like a halo. Everywhere the ratio is exactly
    # one the layer has nothing to add, so the canvas is kept untouched instead.
    touched = ndi.gaussian_filter(
        (np.abs(ratio - 1).max(2) > 1e-6).astype(float), 1.0)
    keep = keep * np.array(Image.fromarray(
        (np.clip(touched, 0, 1) * 255).astype(np.uint8)
    ).resize((tw, th), Image.BILINEAR)).astype(float) / 255
    keep = keep[..., None]
    layer = Image.fromarray(np.clip(la * keep + under_px * (1 - keep), 0, 255).astype(np.uint8))

    canvas.paste(layer, (ox, oy))
    return canvas
