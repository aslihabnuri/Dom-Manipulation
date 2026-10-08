#!/usr/bin/env python3
"""Composite the real Nomukita Ube pouch mockup (RGBA PNG) into a generated scene with a
cast shadow matched to hard upper-left sunlight, a contact shadow and a light-direction
retouch. Usage: pouch_comp.py scene.png out.png x_center y_bottom width_px [shadow_dx shadow_dy]
Coordinates are in scene pixels; y_bottom is where the pouch's base touches the surface.
"""
import sys
from PIL import Image, ImageFilter, ImageChops, ImageOps
import numpy as np

ROOT = "/tmp/claude-0/-home-user-Dom-Manipulation/cc5b59a6-6b87-5897-882c-ef3d3b14e312/scratchpad"
POUCH = ROOT + "/assets/nomukita-ube-250g.png"


def load_pouch():
    p = Image.open(POUCH).convert("RGBA")
    a = np.asarray(p)
    # the mockup carries its own soft drop shadow (dark, semi-transparent) under the pouch: strip it
    rgb = a[..., :3].astype(np.int16); al = a[..., 3].astype(np.int16)
    shadowish = (al < 250) & (rgb.max(axis=2) < 120)
    al[shadowish] = 0
    a = a.copy(); a[..., 3] = al.clip(0, 255)
    p = Image.fromarray(a.astype(np.uint8), "RGBA")
    return p.crop(p.getbbox())


def relight(p, strength=0.10):
    """Light from the upper-left: brighten the left/top edge a touch, darken the right edge."""
    w, h = p.size
    xs = np.linspace(1, -1, w)[None, :]
    ys = np.linspace(1, -1, h)[:, None]
    g = (0.7 * xs + 0.3 * ys) * strength
    a = np.asarray(p).astype(np.float32)
    rgb = a[..., :3] * (1 + g[..., None])
    a[..., :3] = np.clip(rgb, 0, 255)
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def cast_shadow(alpha, k=0.95, sy=0.16, blur=7, opacity=0.6):
    """Project the silhouette onto the surface: shadow runs to the right (k) and slightly down (sy)."""
    w, h = alpha.size
    W = int(w + k * h) + 60
    H = int(sy * h) + 60
    # output (x', y') -> input (x, y): y_from_base = y'/sy ; y = h - y_from_base ; x = x' - k*y_from_base
    sh = alpha.transform((W, H), Image.AFFINE, (1, -k / sy, 0, 0, -1 / sy, h), resample=Image.BILINEAR)
    sh = sh.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * opacity))
    return sh


def restore_foreground(orig, comp, box):
    """Paste back non-background pixels of the original scene inside box (props in front of the pouch)."""
    x0, y0, x1, y1 = box
    o = np.asarray(orig.crop(box).convert("RGB")).astype(np.int16)
    bg = np.percentile(o.reshape(-1, 3), 92, axis=0)   # pedestal white, not the dish
    dist = np.abs(o - bg).max(axis=2)
    m = (dist > 22).astype(np.uint8) * 255
    mask = Image.fromarray(m, "L").filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.5))
    region = orig.crop(box).convert("RGBA"); region.putalpha(mask)
    comp.alpha_composite(region, (x0, y0))


def composite(scene_path, out_path, xc, yb, width, sdx=0.55, sdy=0.0, restore=()):
    scene = Image.open(scene_path).convert("RGBA")
    orig = scene.copy()
    p = load_pouch()
    s = width / p.width
    p = p.resize((int(p.width * s), int(p.height * s)), Image.LANCZOS)
    p = relight(p)
    pw, ph = p.size
    x0 = int(xc - pw / 2); y0 = int(yb - ph)
    alpha = p.split()[3]

    # cast shadow: hard sun from upper-left -> shadow to the lower-right, foreshortened
    sh = cast_shadow(alpha, k=sdx, sy=0.16, blur=7, opacity=0.6)
    shadow_layer = Image.new("RGBA", scene.size, (0, 0, 0, 0))
    dark = Image.new("RGBA", sh.size, (40, 36, 52, 255)); dark.putalpha(sh)
    shadow_layer.alpha_composite(dark, (x0, y0 + ph - 8 + int(sdy)))
    # contact shadow (soft, tight)
    cs = Image.new("L", (pw + 60, 60), 0)
    cs_d = ImageOps.expand(Image.new("L", (pw - 10, 18), 255), border=0)
    cs.paste(cs_d, (35, 10)); cs = cs.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.5))
    cdark = Image.new("RGBA", cs.size, (30, 28, 40, 255)); cdark.putalpha(cs)
    shadow_layer.alpha_composite(cdark, (x0 - 30, y0 + ph - 26))
    scene.alpha_composite(p, (x0, y0))
    for box in restore:
        restore_foreground(orig, scene, box)
    # shadow last so it also falls on restored props, but never on the pouch itself
    hole = Image.new("L", scene.size, 255); hole.paste(ImageChops.invert(alpha), (x0, y0), alpha)
    sa = shadow_layer.split()[3]; shadow_layer.putalpha(ImageChops.multiply(sa, hole))
    scene.alpha_composite(shadow_layer)
    scene.convert("RGB").save(out_path)
    print("composited", out_path, "pouch at", (x0, y0, pw, ph))


if __name__ == "__main__":
    args = sys.argv[1:]
    boxes = []
    for b in args[7:]:
        boxes.append(tuple(int(v) for v in b.split(",")))
    composite(args[0], args[1], float(args[2]), float(args[3]), float(args[4]),
              float(args[5]) if len(args) > 5 else 0.55, float(args[6]) if len(args) > 6 else 0.0, boxes)
