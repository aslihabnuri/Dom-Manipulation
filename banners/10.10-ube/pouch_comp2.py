#!/usr/bin/env python3
"""Composite several real Nomukita pouch mockups into a generated scene lit from the upper RIGHT
(shadows fall to the lower left, as in the BIRU reference). Pouches are placed back to front.
Usage: pouch_comp2.py scene out  name:xc:yb:width [...]  [restore=x0,y0,x1,y1 ...] [k=0.55] [op=0.5]
name is ube | charcoal | matcha
"""
import sys
from PIL import Image, ImageFilter, ImageChops, ImageOps
import numpy as np

ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
SY = 0.42
RESTORE_T = 14
STRAW_ONLY = False
FILES = {"ube": ROOT + "/assets/nomukita-ube-250g.png",
         "charcoal": ROOT + "/assets/nomukita-charcoal-250g.png",
         "matcha": ROOT + "/assets/nomukita-matcha-latte-250g.png"}


def load_pouch(name):
    p = Image.open(FILES[name]).convert("RGBA")
    a = np.asarray(p).astype(np.int16)
    rgb = a[..., :3]; al = a[..., 3].copy()
    al[(al < 250) & (rgb.max(axis=2) < 120)] = 0        # strip the mockup's own drop shadow
    a = a.copy(); a[..., 3] = al.clip(0, 255)
    p = Image.fromarray(a.astype(np.uint8), "RGBA")
    return p.crop(p.getbbox())


def relight(p, strength=0.10):
    w, h = p.size
    xs = np.linspace(-1, 1, w)[None, :]      # light from the right: right edge brighter
    ys = np.linspace(1, -1, h)[:, None]
    g = (0.7 * xs + 0.3 * ys) * strength
    a = np.asarray(p).astype(np.float32)
    a[..., :3] = np.clip(a[..., :3] * (1 + g[..., None]), 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def find_coeffs(pa, pb):
    import numpy as _np
    M = []
    for (x, y), (u, v) in zip(pa, pb):
        M.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); M.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    A = _np.array(M, dtype=float); B = _np.array([c for pt in pb for c in pt], dtype=float)
    return _np.linalg.solve(A, B)


def integrate(p, scene_white, keystone=0.035, grain=2.2, ao=0.22):
    """Make the mockup sit in the photo: match its whites to the scene, add a slight downward
    keystone (camera above), darken the base (ambient occlusion) and add the scene's grain."""
    w, h = p.size
    a = np.asarray(p).astype(np.float32)
    al = a[..., 3] > 0
    pw = np.percentile(a[..., :3][al], 97, axis=0)              # pouch white point
    f = np.array(scene_white, dtype=np.float32) / np.maximum(pw, 1)
    a[..., :3] = np.clip(a[..., :3] * f, 0, 255)
    ys = np.linspace(0, 1, h)[:, None]
    occl = 1 - ao * np.clip((ys - 0.82) / 0.18, 0, 1) ** 1.5      # darker toward the base
    a[..., :3] *= occl[..., None]
    rng = np.random.default_rng(7)
    a[..., :3] = np.clip(a[..., :3] + rng.normal(0, grain, a[..., :3].shape), 0, 255)
    p = Image.fromarray(a.astype(np.uint8), "RGBA")
    # keystone: bottom edge slightly narrower than the top (verticals converge downward)
    d = keystone * w / 2
    coeffs = find_coeffs([(0, 0), (w, 0), (w - d, h), (d, h)], [(0, 0), (w, 0), (w, h), (0, h)])
    return p.transform((w, h), Image.PERSPECTIVE, coeffs, resample=Image.BICUBIC)


def cast_shadow_left(alpha, k, sy, blur, opacity):
    """Ground projection to the LEFT and toward the BACK (upward on screen), matching the cups'
    shadows in the scene. Returns (shadow L image, x offset of silhouette base). Canvas bottom = base line."""
    w, h = alpha.size
    fl = ImageOps.mirror(alpha)
    W = int(w + k * h) + 60; H = int(sy * h) + 60
    sh = fl.transform((W, H), Image.AFFINE, (1, -k / sy, 0, 0, -1 / sy, h), resample=Image.BILINEAR)
    sh = ImageOps.mirror(sh)
    sh = ImageOps.flip(sh)                      # base line now at the bottom of the canvas
    sh = sh.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * opacity))
    return sh, W - w


def _fill_holes_pil(mask_img):
    """Fill enclosed holes: flood the outside from the border, everything not reached is object."""
    from PIL import ImageDraw
    w, h = mask_img.size
    outside = mask_img.copy()            # 0 = background, 255 = object
    seeds = [(x, 0) for x in range(0, w, 20)] + [(x, h - 1) for x in range(0, w, 20)] + \
            [(0, y) for y in range(0, h, 20)] + [(w - 1, y) for y in range(0, h, 20)]
    for sx, sy in seeds:
        if outside.getpixel((sx, sy)) == 0:
            ImageDraw.floodfill(outside, (sx, sy), 128)
    a = np.asarray(outside)
    return Image.fromarray(np.where(a == 128, 0, 255).astype(np.uint8), "L")


def restore_foreground(orig, comp, box, lid_y=None):
    """Paste the cup back in front of the pouch. Below lid_y the cup is opaque (drink, cream, ice);
    above lid_y (the clear lid and the straw) the original pixels are MULTIPLIED over the pouch so the
    print shows through the transparent lid while rim lines, reflections' shading and the straw stay."""
    x0, y0, x1, y1 = box
    o = np.asarray(orig.crop(box).convert("RGB")).astype(np.int16)
    bg = np.percentile(o.reshape(-1, 3), 92, axis=0)
    dist = np.abs(o - bg).max(axis=2)
    if STRAW_ONLY:
        # only the dark straw (and dark cup parts) come forward; shadows and lids are handled elsewhere
        m = Image.fromarray(((o.max(axis=2) < 100) * 255).astype(np.uint8), "L").filter(ImageFilter.MaxFilter(3))
    else:
        m = Image.fromarray(((dist > RESTORE_T) * 255).astype(np.uint8), "L")
        m = m.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(13))
        m = _fill_holes_pil(m)
        m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    mask = np.asarray(m.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255.0
    region = orig.crop(box).convert("RGB")
    cur = comp.crop(box).convert("RGB")
    ra = np.asarray(region).astype(np.float32); ca = np.asarray(cur).astype(np.float32)
    # multiply blend normalised to the scene white, so plain backdrop seen through the lid stays neutral
    white = np.percentile(ra.reshape(-1, 3), 92, axis=0)
    mult = np.clip(ca * (ra / np.maximum(white, 1)), 0, 255)
    out = ra.copy()
    if lid_y is not None:
        ly = max(0, min(y1 - y0, int(lid_y - y0)))
        # soft 20 px transition between the transparent lid zone and the opaque drink zone
        t = np.clip((np.arange(y1 - y0)[:, None] - (ly - 20)) / 20.0, 0, 1)[..., None]
        out = mult * (1 - t) + ra * t
    blended = ca * (1 - mask[..., None]) + out * mask[..., None]
    comp.paste(Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8), "RGB"), (x0, y0))


def composite(scene_path, out_path, items, restore=(), k=0.55, opacity=0.5):
    scene = Image.open(scene_path).convert("RGBA")
    orig = scene.copy()
    shadows = Image.new("RGBA", scene.size, (0, 0, 0, 0))
    holes = Image.new("L", scene.size, 255)
    for name, xc, yb, width in items:
        p = load_pouch(name)
        s = width / p.width
        p = relight(p.resize((int(p.width * s), int(p.height * s)), Image.LANCZOS))
        pw, ph = p.size
        x0 = int(xc - pw / 2); y0 = int(yb - ph)
        # scene white reference: global, from neutral bright pixels of the untouched scene
        oa = np.asarray(orig.convert("RGB")).astype(np.int16)
        neutral = (oa.max(axis=2) - oa.min(axis=2)) < 10
        sel = oa[neutral & (oa.mean(axis=2) > 200)]
        scene_white = np.percentile(sel, 80, axis=0)
        p = integrate(p, scene_white)
        # let the scene's own shadows (from the cups) fall onto the pouch
        reg = np.asarray(orig.convert("RGB").crop((x0, y0, x0 + pw, y0 + ph))).astype(np.float32)
        if reg.shape[:2] == (ph, pw):
            lum = reg.mean(axis=2); neutral = (reg.max(axis=2) - reg.min(axis=2)) < 14
            ratio = np.where(neutral, np.clip(lum / float(np.mean(scene_white)), 0.45, 1.0), 1.0)
            ratio = np.asarray(Image.fromarray((ratio * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255.0
            pa = np.asarray(p).astype(np.float32); pa[..., :3] *= ratio[..., None]
            p = Image.fromarray(np.clip(pa, 0, 255).astype(np.uint8), "RGBA")
        alpha = p.split()[3]
        sh, off = cast_shadow_left(alpha, k, SY, 3, opacity)
        dark = Image.new("RGBA", sh.size, (40, 36, 52, 255)); dark.putalpha(sh)
        shadows.alpha_composite(dark, (x0 - off, y0 + ph + 6 - sh.height))
        # contact shadow
        cs = Image.new("L", (pw + 60, 60), 0)
        cs.paste(Image.new("L", (pw - 10, 18), 255), (35, 10))
        cs = cs.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.3))
        cdark = Image.new("RGBA", cs.size, (30, 28, 40, 255)); cdark.putalpha(cs)
        shadows.alpha_composite(cdark, (x0 - 30, y0 + ph - 26))
        scene.alpha_composite(p, (x0, y0))
        holes.paste(ImageChops.invert(alpha), (x0, y0), alpha)
    for box in restore:
        restore_foreground(orig, scene, box[:4], box[4] if len(box) > 4 else None)
    shadows.putalpha(ImageChops.multiply(shadows.split()[3], holes))
    scene.alpha_composite(shadows)
    scene.convert("RGB").save(out_path)
    print("composited", out_path)


if __name__ == "__main__":
    a = sys.argv
    items = []; boxes = []; k = 0.55; op = 0.5
    for t in a[3:]:
        if t.startswith("restore="): boxes.append(tuple(int(v) for v in t[8:].split(",")))
        elif t.startswith("k="): k = float(t[2:])
        elif t.startswith("op="): op = float(t[3:])
        elif t.startswith("sy="): globals()["SY"] = float(t[3:])
        elif t.startswith("rt="): globals()["RESTORE_T"] = int(t[3:])
        elif t == "straw": globals()["STRAW_ONLY"] = True
        else:
            n, xc, yb, w = t.split(":"); items.append((n, float(xc), float(yb), float(w)))
    composite(a[1], a[2], items, boxes, k, op)
