#!/usr/bin/env python3
"""
Rewrite the promo copy baked into the Sophie Martin key visuals (9:16 and 1:1).

    python3 retext_kv.py --new ./assets_v2 --old ./assets --out ./kv_out

Both changes are edits to flattened JPEGs, so each one is: mask the old pixels,
inpaint the background, then draw the replacement.

The discount digits are the hard part. Their typeface is a high-contrast didone
that is not installed here, and the font supplied with the brief (Milden Serif)
is a different face — its digits do not match (0.33 IoU on '4', 0.61 on '5'), and
the pill copy is set in a geometric sans, not a serif at all. So rather than
substituting an approximation:

  * the '6' is lifted from the PREVIOUS revision of the same key visual, which
    read "65%" — identical face, size, colour and rasterisation;
  * the '0' is constructed as an ellipse ring using stroke weights measured off
    that same '6', which is why it sits correctly next to it.

Only the pill copy falls back to a substitute face (FreeSans, the closest local
match), and that is flagged in the output.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SANS_REGULAR = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"


def maroon(a: np.ndarray) -> np.ndarray:
    """The discount type's colour, separated from the cream background."""
    return (a[..., 0] > 50) & (a[..., 0] < 180) & (a[..., 1] < 85) & (a[..., 2] < 90)


def find_digits(img: Image.Image, region, keep: float = 0.4) -> list[tuple]:
    """
    Locate the discount digits as connected components, left to right.

    Measuring them by row/column profile inside a hand-picked window is what
    clipped the 9:16 '6': its tail sweeps up and right past the rows the window
    started at, so the tapered tip was cut and the glyph read blunt. A component
    is the whole glyph by definition, tail included.

    `keep` drops components smaller than that fraction of the largest, which
    removes the '%' (three small parts) without needing a fixed pixel threshold.
    """
    x0, y0, x1, y1 = region
    a = np.array(img.convert("RGB")).astype(int)
    m = maroon(a).astype(np.uint8)[y0:y1, x0:x1]
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    n, _, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    if n < 2:
        return []
    areas = stats[1:, cv2.CC_STAT_AREA]
    cutoff = areas.max() * keep
    boxes = [
        (x0 + stats[i, 0], y0 + stats[i, 1],
         x0 + stats[i, 0] + stats[i, 2], y0 + stats[i, 1] + stats[i, 3])
        for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= cutoff
    ]
    return sorted(boxes, key=lambda b: b[0])


def inpaint(img: Image.Image, mask: np.ndarray, radius: int = 6) -> Image.Image:
    a = np.array(img.convert("RGB"))
    m = cv2.dilate(mask.astype(np.uint8) * 255, np.ones((5, 5), np.uint8), iterations=2)
    return Image.fromarray(cv2.inpaint(a, m, radius, cv2.INPAINT_TELEA))


def lift_glyph(src: Image.Image, box, ramp: float = 95.0) -> Image.Image:
    """Cut a glyph off its cream background, keeping its antialiased edges."""
    c = np.array(src.convert("RGB").crop(box)).astype(float)
    bg = np.concatenate([c[:4].reshape(-1, 3), c[-4:].reshape(-1, 3)]).mean(0)
    alpha = np.clip(np.sqrt(((c - bg) ** 2).sum(2)) / ramp, 0, 1)
    return Image.fromarray(
        np.dstack([c.astype(np.uint8), (alpha * 255).astype(np.uint8)]), "RGBA"
    )


def didone_zero(w: int, h: int, side: int, cap: int, colour, ss: int = 8) -> Image.Image:
    """
    A '0' as an ellipse ring. `side` and `cap` are the thick and thin stroke
    weights measured off the real '6', which is what makes it read as the same
    typeface rather than a generic oval.
    """
    m = Image.new("L", (w * ss, h * ss), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([0, 0, w * ss - 1, h * ss - 1], fill=255)
    d.ellipse([side * ss, cap * ss, (w - side) * ss - 1, (h - cap) * ss - 1], fill=0)
    glyph = Image.new("RGBA", (w, h), tuple(colour) + (255,))
    glyph.putalpha(m.resize((w, h), Image.LANCZOS))
    return glyph


def core_colour(img: Image.Image, box, pct: int = 8):
    """Darkest decile of a region — the ink colour, not the antialiased average."""
    a = np.array(img.convert("RGB").crop(box)).astype(int)
    lum = a.mean(2)
    return tuple(int(v) for v in a[lum <= np.percentile(lum, pct)].mean(0))


def replace_digits(new: Image.Image, old: Image.Image, box_a, box_b, box_six,
                   side: int, cap: int) -> Image.Image:
    """45 -> 60. `box_six` locates the 6 in the previous revision of this file."""
    a = np.array(new.convert("RGB")).astype(int)
    mask = np.zeros(a.shape[:2], bool)
    for x0, y0, x1, y1 in (box_a, box_b):
        mask[y0:y1, x0:x1] |= maroon(a[y0:y1, x0:x1])

    out = inpaint(new, mask).convert("RGBA")
    ink = tuple(int(v) for v in np.array(new.convert("RGB").crop(box_b)).astype(int)[
        maroon(np.array(new.convert("RGB").crop(box_b)).astype(int))].mean(0))

    out.alpha_composite(lift_glyph(old, box_six), (box_six[0], box_six[1]))
    w, h = box_b[2] - box_b[0], box_b[3] - box_b[1]
    out.alpha_composite(didone_zero(w, h, side, cap, ink), (box_b[0], box_b[1]))
    return out.convert("RGB")


def replace_pill(img: Image.Image, pill, cap_h: int, pad: int,
                 head: str, tail: str, stroke: int = 2) -> Image.Image:
    """
    Redraw the rounded-corner copy pill. The replacement copy is shorter, so the
    pill is re-drawn narrower and re-centred rather than left with dead space.
    """
    x0, y0, x1, y1 = pill
    h = y1 - y0 + 1
    outline = core_colour(img, (x0, y0, x0 + 6, y1))
    ink = core_colour(img, (x0 + pad, y0 + 4, x1 - pad, y1 - 4))

    mask = np.zeros(np.array(img).shape[:2], bool)
    mask[y0 - 3:y1 + 4, x0 - 3:x1 + 4] = True
    out = inpaint(img, mask, radius=8)

    size = 10
    while size < 140:
        bb = ImageFont.truetype(SANS_REGULAR, size).getbbox("D")
        if bb[3] - bb[1] >= cap_h:
            break
        size += 1
    fr = ImageFont.truetype(SANS_REGULAR, size)
    fb = ImageFont.truetype(SANS_BOLD, size)

    w_head, w_tail = int(fr.getlength(head)), int(fb.getlength(tail))
    width = w_head + w_tail + pad * 2
    cx = (x0 + x1) // 2
    nx0 = cx - width // 2

    d = ImageDraw.Draw(out)
    d.rounded_rectangle([nx0, y0, nx0 + width, y1], radius=h // 2,
                        outline=outline, width=stroke)
    ty = y0 + (h - cap_h) // 2 - fr.getbbox("D")[1]
    d.text((nx0 + pad, ty), head, font=fr, fill=outline)
    d.text((nx0 + pad + w_head, ty), tail, font=fb, fill=ink)
    return out


# Measured off the two key visuals. Boxes are (x0, y0, x1, y1).
JOBS = [
    dict(name="square_1x1", ratio="1:1", file="KV Banner_square",
         digit_region=(740, 605, 960, 745), side=23, cap=7,
         pill=(328, 420, 750, 459), pill_cap=22, pill_pad=30),
    dict(name="igs_9x16", ratio="9:16", file="KV Banner_IGS",
         digit_region=(340, 760, 630, 950), side=32, cap=9,
         pill=(243, 586, 837, 641), pill_cap=29, pill_pad=43),
]


def find(folder: Path, stem: str) -> Path | None:
    for p in sorted(folder.rglob("*")):
        if p.is_file() and p.name.lower().startswith(stem.lower()):
            if p.suffix.lower() in {".jpg", ".jpeg", ".png"}:
                return p
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--new", required=True, help="KV revisi terbaru (yang berisi 45%)")
    ap.add_argument("--old", required=True, help="KV revisi sebelumnya (yang berisi 65%) — sumber glyph '6'")
    ap.add_argument("--out", default="./kv_out")
    ap.add_argument("--head", default="Disc Product ")
    ap.add_argument("--tail", default="15RB")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    print("CATATAN: copy pill dirender dengan FreeSans (pengganti terdekat). "
          "Font asli pill adalah sans geometris, bukan Milden Serif.\n")

    for job in JOBS:
        pn = find(Path(args.new), job["file"])
        po = find(Path(args.old), job["file"])
        if pn is None or po is None:
            print(f"-- {job['name']}: SKIP (aset tidak lengkap)")
            continue
        new, old = Image.open(pn).convert("RGB"), Image.open(po).convert("RGB")
        d_new = find_digits(new, job["digit_region"])
        d_old = find_digits(old, job["digit_region"])
        if len(d_new) < 2 or len(d_old) < 1:
            print(f"-- {job['name']}: SKIP (digit tidak terdeteksi)")
            continue
        print(f"   {job['name']}: digit lama '6' {d_old[0]}  digit baru {d_new[0]} {d_new[1]}")
        img = replace_digits(new, old, d_new[0], d_new[1], d_old[0],
                             job["side"], job["cap"])
        img = replace_pill(img, job["pill"], job["pill_cap"], job["pill_pad"],
                           args.head, args.tail)
        dest = out / f"{job['name']}.jpg"
        img.save(dest, quality=95)
        print(f"-- {job['name']:12s} {job['ratio']:5s} {img.size}  "
              f"{dest.stat().st_size / 1024:.0f}kb -> {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
