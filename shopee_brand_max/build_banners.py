#!/usr/bin/env python3
"""
Shopee Brand Max 2026 (BAU) banner builder / auditor — Sophie Martin.

Takes the brand key visuals plus Shopee's official Brand Max template overlays and
produces the four banner assets at exactly the dimensions, formats and file-size
caps required by "Creative Guideline Brand Max 2026 - BAU".

    python3 build_banners.py audit  --assets ./assets
    python3 build_banners.py build  --assets ./assets --out ./out --config config.json

The hard part is not resizing — it is that the key visuals were laid out without
the Shopee frame, so the mandatory Shopee Mall tag lands on top of artwork (the
model's face on Skinny App, the brand logo on Skinny Web, the logo on Banner
Card). Each format therefore reserves a clearance band for the tag and reflows
the key visual beneath it, extending the artwork's own background gradient
outwards so the reflow leaves no seam.

See SYARAT_KETENTUAN.md for the full rule set this implements.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image

# Backgrounds Shopee rejects: too little contrast against the app UI.
BANNED_BACKGROUNDS = [(0xFF, 0xFF, 0xFF), (0xF1, 0xF1, 0xF1)]
BANNED_TOLERANCE = 6

SHOPEE_RED = (0xD0, 0x01, 0x1B)


@dataclass
class Spec:
    """One banner format as defined by the guideline."""

    key: str
    label: str
    width: int
    height: int
    fmt: str
    max_kb: int
    kv: str
    overlay_light: str  # tag reads red — for light backgrounds
    overlay_dark: str  # tag reads white — for red/dark backgrounds
    ksp_pt: int | None = None  # None => promotional text is forbidden here
    max_ksp: int = 2
    notes: list[str] = field(default_factory=list)

    @property
    def size(self) -> tuple[int, int]:
        return (self.width, self.height)


SPECS: list[Spec] = [
    Spec(
        key="banner_card",
        label="Banner Card (Halaman Rekomendasi)",
        width=531,
        height=792,
        fmt="JPEG",
        max_kb=500,
        kv="KV Banner_Halaman Rekomendasi Banner",
        overlay_light="BRAND-MAX-BANNER-CARD-Red",
        overlay_dark="BRAND-MAX-BANNER-CARD-White",
        ksp_pt=25,
        notes=["Shopee Mall tag wajib", "Logo brand di atas", "SKU wajib terlihat"],
    ),
    Spec(
        key="floating_banner",
        label="Floating Banner",
        width=360,
        height=360,
        fmt="PNG",
        max_kb=250,
        kv="KV Banner_Floating Banner",
        overlay_light="BRAND-MAX-Floating-Icon-2",
        overlay_dark="BRAND-MAX-Floating-Icon-2",
        ksp_pt=None,
        max_ksp=0,
        notes=[
            "PNG transparan",
            "Close button WAJIB, jangan dihapus/dimodifikasi",
            "Tanpa pesan promosi",
            "Hanya SKU (bukan brand ambassador)",
            "Jangan melewati batas masking shape",
        ],
    ),
    Spec(
        key="skinny_app",
        label="Skinny App Banner",
        width=1200,
        height=360,
        fmt="JPEG",
        max_kb=500,
        kv="KV Banner_Skinny Banner App",
        overlay_light="BRAND-MAX-Skinny-App",
        overlay_dark="BRAND-MAX-Skinny-App",
        ksp_pt=47,
        notes=["Desain harus di dalam clipping mask", "White outline wajib ada"],
    ),
    Spec(
        key="skinny_web",
        label="Skinny Web Banner (PC)",
        width=1200,
        height=110,
        fmt="JPEG",
        max_kb=500,
        kv="KV Banner_Skinny Banner PC",
        overlay_light="BRAND-MAX-Skinny-Web-Red",
        overlay_dark="BRAND-MAX-Skinny-Web-White",
        ksp_pt=40,
        notes=["Masking sesuai guideline", "Tag putih di background merah"],
    ),
]


# ----------------------------------------------------------------- asset helpers


def find_asset(assets: Path, stem: str) -> Path | None:
    """Locate an asset by filename stem, tolerating the doubled extensions Drive adds."""
    for path in sorted(assets.rglob("*")):
        if path.is_file() and path.name.lower().startswith(stem.lower()):
            if path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
                return path
    return None


def edge_colour(im: Image.Image) -> tuple[int, int, int]:
    a = np.array(im.convert("RGB")).astype(int)
    h, w, _ = a.shape
    e = max(2, min(h, w) // 20)
    edge = np.concatenate(
        [
            a[:e].reshape(-1, 3),
            a[-e:].reshape(-1, 3),
            a[:, :e].reshape(-1, 3),
            a[:, -e:].reshape(-1, 3),
        ]
    )
    return tuple(int(v) for v in edge.mean(0))  # type: ignore[return-value]


def is_banned_background(rgb: tuple[int, int, int]) -> bool:
    return any(
        all(abs(rgb[i] - banned[i]) <= BANNED_TOLERANCE for i in range(3))
        for banned in BANNED_BACKGROUNDS
    )


def needs_white_tag(rgb: tuple[int, int, int]) -> bool:
    """The guideline: white Shopee Mall tag on red/dark backgrounds."""
    r, g, b = rgb
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    reddish = r > 120 and r > g + 60 and r > b + 60
    return luminance < 140 or reddish


def place_seamless(
    canvas: tuple[int, int], inner: Image.Image, ox: int, oy: int
) -> Image.Image:
    """
    Put `inner` at (ox, oy) and stretch its edge rows/columns outwards to fill the
    rest. The key visuals sit on a smooth cream gradient, so extending their own
    edge pixels hides the reflow completely — a flat fill would leave a visible seam.
    """
    W, H = canvas
    base = Image.new("RGB", canvas)
    iw, ih = inner.size
    inner = inner.convert("RGB")

    if oy > 0:
        base.paste(inner.crop((0, 0, iw, 1)).resize((iw, oy), Image.BILINEAR), (ox, 0))
    if oy + ih < H:
        base.paste(
            inner.crop((0, ih - 1, iw, ih)).resize((iw, H - oy - ih), Image.BILINEAR),
            (ox, oy + ih),
        )
    base.paste(inner, (ox, oy))

    if ox > 0:
        base.paste(base.crop((ox, 0, ox + 1, H)).resize((ox, H), Image.BILINEAR), (0, 0))
    if ox + iw < W:
        base.paste(
            base.crop((ox + iw - 1, 0, ox + iw, H)).resize((W - ox - iw, H), Image.BILINEAR),
            (ox + iw, 0),
        )
    return base.convert("RGBA")


def content_bounds(im: Image.Image, tol: int = 14) -> tuple[int, int]:
    """
    First and last row that actually carries artwork, ignoring the flat background
    margins. Used to fit as much of the key visual as possible into the space the
    Shopee Mall tag leaves free — fitting the raw canvas instead would waste the
    empty margins and shrink the artwork more than necessary.
    """
    a = np.array(im.convert("RGB")).astype(int)
    bg = np.array(edge_colour(im))
    diff = np.sqrt(((a - bg) ** 2).sum(2))
    rows = np.where((diff > tol).sum(1) > im.width * 0.01)[0]
    return (int(rows.min()), int(rows.max())) if len(rows) else (0, im.height - 1)


def overlay_geometry(tpl: Image.Image) -> dict:
    """Measure where the template's red Shopee Mall tag and clear window sit."""
    t = np.array(tpl.convert("RGBA")).astype(int)
    al, r, g, b = t[..., 3], t[..., 0], t[..., 1], t[..., 2]
    red = (al > 60) & (r > 140) & (g < 100) & (b < 100)
    clear = al < 40

    geo: dict = {}
    if red.any():
        ys, xs = np.where(red)
        geo["tag"] = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
    if clear.any():
        ys, xs = np.where(clear)
        geo["window"] = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
    geo["red_mask"] = red
    return geo


def silhouette_from_outline(red: np.ndarray) -> np.ndarray:
    """Fill the area enclosed by the floating banner's red outline (circle + tab)."""
    h, w = red.shape
    sil = np.zeros((h, w), bool)
    for y in range(h):
        xs = np.where(red[y])[0]
        if len(xs):
            sil[y, xs.min() : xs.max() + 1] = True
    return sil


def save_within_budget(im: Image.Image, dest: Path, spec: Spec) -> int:
    budget = spec.max_kb * 1024
    dest.parent.mkdir(parents=True, exist_ok=True)

    if spec.fmt == "PNG":
        im.save(dest, "PNG", optimize=True)
        if dest.stat().st_size > budget:
            for colors in (256, 192, 128, 96, 64):
                im.convert("RGBA").quantize(colors=colors, method=Image.FASTOCTREE).save(
                    dest, "PNG", optimize=True
                )
                if dest.stat().st_size <= budget:
                    break
        return dest.stat().st_size

    flat = im.convert("RGB")
    for quality in range(94, 40, -3):
        flat.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
        if dest.stat().st_size <= budget:
            break
    return dest.stat().st_size


# ------------------------------------------------------------------ per-format build


def build_framed(spec: Spec, kv: Image.Image, tpl: Image.Image,
                 layout: str = "reflow") -> Image.Image:
    """
    Banner Card / Skinny App / Skinny Web.

    Reflows the key visual so it clears the Shopee Mall tag, then lays the official
    template on top so masking, white outline and tag all land where Shopee expects.
    """
    geo = overlay_geometry(tpl)
    win = geo.get("window", (0, 0, spec.width - 1, spec.height - 1))
    tag = geo.get("tag")
    wx0, wy0, wx1, wy1 = win
    ww, wh = wx1 - wx0 + 1, wy1 - wy0 + 1

    def framed(inner: Image.Image, ox: int, oy: int) -> Image.Image:
        """Lay the official template over the reflowed artwork."""
        canvas = place_seamless(spec.size, inner, ox, oy)
        canvas.alpha_composite(tpl)
        return canvas

    if layout == "fullbleed" or tag is None:
        # Fill the window edge to edge, adding no background at all. Whatever the
        # tag lands on stays hidden, and the artwork's bottom is cropped to fit.
        s = max(ww / kv.width, wh / kv.height)
        big = kv.resize((round(kv.width * s), round(kv.height * s)), Image.LANCZOS)
        return framed(big.crop((0, 0, ww, wh)), wx0, wy0)

    tx0, ty0, tx1, ty1 = tag
    tag_w = tx1 - tx0 + 1
    # A tag spanning most of the width can only be cleared vertically; a narrow
    # one parked in a corner is cheaper to clear horizontally.
    if tag_w > spec.width * 0.25:
        # Largest scale that still clears the tag and keeps the artwork inside the
        # window. Measured from real content bounds rather than the raw canvas, so
        # empty margins in the key visual do not shrink the artwork needlessly.
        top, bot = content_bounds(kv)
        s = min((wy1 - (ty1 + 4)) / max(1, bot - top), ww / kv.width)
        w, h = round(kv.width * s), round(kv.height * s)
        return framed(kv.resize((w, h), Image.LANCZOS),
                      wx0 + (ww - w) // 2, round(ty1 + 4 - top * s))

    # Narrow tag: shrink the artwork so it stops before the tag's column.
    if tx0 > spec.width / 2:
        w = max(1, tx0 - wx0 - 8)
        ox = wx0
    else:
        w = max(1, wx1 - tx1 - 8)
        ox = tx1 + 8
    h = round(kv.height * w / kv.width)
    if h > wh:
        h, w = wh, round(kv.width * wh / kv.height)
    return framed(kv.resize((w, h), Image.LANCZOS), ox, wy0 + (wh - h) // 2)


def keyed_text(src: Image.Image, box) -> Image.Image:
    """
    Lift dark copy off its light background, keeping the brand's own typeface.

    The key visual's discount block is set in a high-contrast didone that is not
    installed here, and no local serif comes close (best shape match scored 0.71
    IoU against the original digits). Reusing the rendered pixels keeps the real
    lettering instead of substituting an approximation.
    """
    c = np.array(src.convert("RGB").crop(box)).astype(float)
    alpha = np.clip((170 - c.mean(2)) / 70, 0, 1)
    return Image.fromarray(
        np.dstack([c.astype(np.uint8), (alpha * 255).astype(np.uint8)]), "RGBA"
    )


def build_floating(
    spec: Spec, tpl: Image.Image, sku_src: Image.Image, sku_box, logo_src: Image.Image,
    logo_box, tab_box, sku_width: int, sku_pos, promo: dict | None = None,
) -> Image.Image:
    """
    Floating Banner: transparent PNG, masked to the template silhouette, SKU only
    (no brand ambassador), close button untouched.

    The SKU crop is placed at an explicit size and offset rather than auto-fitted,
    because the usable region of the key visual is bounded on three sides: the
    model's skirt to the left, the discount type above, and the frame below. The
    offsets park the model outside the circle mask while keeping the bags centred.
    Crop edges are chosen on clean rows/columns so extending them outwards cannot
    smear a bag handle into a streak.

    `promo` overlays the discount block. The guideline lists promotional messages
    as a reject reason for this format, so it is opt-in and off by default.
    """
    geo = overlay_geometry(tpl)
    sil = silhouette_from_outline(geo["red_mask"])

    sku = sku_src.crop(sku_box)
    sku_h = round(sku.height * sku_width / sku.width)
    sku = sku.resize((sku_width, sku_h), Image.LANCZOS)
    content = place_seamless(spec.size, sku, int(sku_pos[0]), int(sku_pos[1]))

    out = Image.new("RGBA", spec.size, (0, 0, 0, 0))
    out.paste(content.convert("RGB"), (0, 0), Image.fromarray((sil * 255).astype(np.uint8)))

    if promo:
        text = keyed_text(sku_src, tuple(promo["box"]))
        tw = int(promo["width"])
        text = text.resize((tw, round(text.height * tw / text.width)), Image.LANCZOS)
        out.alpha_composite(text, (spec.width // 2 - tw // 2,
                                   int(promo["cy"]) - text.height // 2))

    out.alpha_composite(tpl)

    # Brand logo, keyed off its cream background, dropped into the white tab.
    lg = np.array(logo_src.convert("RGB").crop(logo_box)).astype(int)
    bg = np.array(edge_colour(logo_src))
    alpha = np.clip(np.sqrt(((lg - bg) ** 2).sum(2)) * 4.0, 0, 255).astype(np.uint8)
    logo = Image.fromarray(np.dstack([lg.astype(np.uint8), alpha]), "RGBA")

    tw = tab_box[2] - tab_box[0]
    th = round(logo.height * tw / logo.width)
    max_h = tab_box[3] - tab_box[1]
    if th > max_h:
        th, tw = max_h, round(logo.width * max_h / logo.height)
    logo = logo.resize((tw, th), Image.LANCZOS)
    out.alpha_composite(
        logo, (tab_box[0] + ((tab_box[2] - tab_box[0]) - tw) // 2,
               tab_box[1] + (max_h - th) // 2)
    )
    return out


# ---------------------------------------------------------------------- commands


def cmd_audit(args: argparse.Namespace) -> int:
    assets = Path(args.assets)
    if not assets.exists():
        print(f"!! assets directory not found: {assets}")
        return 2

    print(f"AUDIT — Shopee Brand Max 2026 (BAU)   assets: {assets}\n")
    missing = 0
    for spec in SPECS:
        print(f"[{spec.label}]  target {spec.width}x{spec.height} {spec.fmt} <= {spec.max_kb}kb")
        kv = find_asset(assets, spec.kv)
        if kv is None:
            print(f"   KV        : MISSING (expected '{spec.kv}.*')")
            missing += 1
        else:
            im = Image.open(kv)
            im.load()
            bg = edge_colour(im)
            size_kb = kv.stat().st_size / 1024
            print(f"   KV        : {kv.name}")
            print(f"     dimensi : {im.size[0]}x{im.size[1]}  "
                  f"{'OK' if im.size == spec.size else 'PERLU DIUBAH -> %dx%d' % spec.size}")
            print(f"     file    : {size_kb:.0f} kb  "
                  f"{'OK' if size_kb <= spec.max_kb else 'TERLALU BESAR'}")
            print(f"     bg      : #{bg[0]:02X}{bg[1]:02X}{bg[2]:02X}  "
                  f"{'DILARANG (terlalu putih)' if is_banned_background(bg) else 'OK'}")
            print(f"     tag     : pakai Shopee Mall versi "
                  f"{'PUTIH' if needs_white_tag(bg) else 'MERAH'}")

        tpl_name = spec.overlay_dark if kv and needs_white_tag(edge_colour(Image.open(kv))) \
            else spec.overlay_light
        tpl = find_asset(assets, tpl_name)
        print(f"   template  : {tpl.name if tpl else 'MISSING (%s.png)' % tpl_name}")
        if tpl is None:
            missing += 1
        else:
            geo = overlay_geometry(Image.open(tpl))
            if "tag" in geo:
                print(f"     zona tag: {geo['tag']}  (area ini harus bersih dari artwork)")
        for note in spec.notes:
            print(f"     - {note}")
        print()

    print(f"{missing} aset belum tersedia." if missing else "Semua aset tersedia. Siap di-build.")
    return 0


def cmd_build(args: argparse.Namespace) -> int:
    assets = Path(args.assets)
    out = Path(args.out)
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8")) if Path(args.config).exists() else {}
    out.mkdir(parents=True, exist_ok=True)

    built = failed = 0
    for spec in SPECS:
        kv_path = find_asset(assets, spec.kv)
        if kv_path is None:
            print(f"-- {spec.label}: SKIP (KV tidak ditemukan)")
            failed += 1
            continue

        kv = Image.open(kv_path).convert("RGBA")
        bg = edge_colour(kv)
        if is_banned_background(bg):
            kv = Image.eval(kv.convert("RGB"), lambda v: int(v * 0.93)).convert("RGBA")
            bg = edge_colour(kv)
            print(f"   {spec.key}: background terlalu putih -> digelapkan")

        tpl_name = spec.overlay_dark if needs_white_tag(bg) else spec.overlay_light
        tpl_path = find_asset(assets, tpl_name)
        if tpl_path is None:
            print(f"-- {spec.label}: SKIP (template {tpl_name} tidak ditemukan)")
            failed += 1
            continue
        tpl = Image.open(tpl_path).convert("RGBA").resize(spec.size, Image.LANCZOS)

        if spec.key == "floating_banner":
            fl = cfg.get("floating", {})
            src_path = find_asset(assets, fl.get("sku_from", "KV Banner_Halaman Rekomendasi Banner"))
            src = Image.open(src_path).convert("RGB")
            promo = fl.get("promo") if (args.promo or fl.get("promo_enabled")) else None
            variant = fl.get("promo_layout" if promo else "clean_layout", {})
            result = build_floating(
                spec, tpl, src, tuple(fl.get("sku_box", [240, 604, 531, 792])),
                src, tuple(fl.get("logo_box", [210, 22, 325, 88])),
                tuple(fl.get("tab_box", [133, 17, 226, 97])),
                int(variant.get("sku_width", 384)),
                variant.get("sku_pos", [-78, 78]),
                promo,
            )
            if promo:
                print("   floating_banner: teks promo AKTIF — guideline melarang "
                      "pesan promosi di format ini, berisiko di-reject")
        else:
            layout = cfg.get("layout", {}).get(spec.key, args.layout)
            result = build_framed(spec, kv, tpl, layout).convert("RGB")

        ext = "png" if spec.fmt == "PNG" else "jpg"
        dest = out / f"{spec.key}_{spec.width}x{spec.height}.{ext}"
        size = save_within_budget(result, dest, spec)
        print(f"-- {spec.label}: {dest.name}  {spec.width}x{spec.height}  {size/1024:.0f}kb  "
              f"tag={'PUTIH' if needs_white_tag(bg) else 'MERAH'}  "
              f"{'OK' if size <= spec.max_kb*1024 else 'MASIH DI ATAS BATAS'}")
        built += 1

    print(f"\nselesai: {built} banner dibuat, {failed} dilewati -> {out}")
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("audit"); a.add_argument("--assets", default="./assets"); a.set_defaults(func=cmd_audit)
    b = sub.add_parser("build")
    b.add_argument("--assets", default="./assets")
    b.add_argument("--out", default="./out")
    b.add_argument("--config", default="config.json")
    b.add_argument("--promo", action="store_true",
                   help="tampilkan 'Disc Up To 45%% OFF' di Floating Banner. "
                        "PERINGATAN: guideline melarang pesan promosi di format ini.")
    b.add_argument("--layout", choices=["reflow", "fullbleed"], default="reflow",
                   help="reflow: artwork dikecilkan agar bebas dari tag (default). "
                        "fullbleed: artwork penuh tanpa background tambahan, "
                        "tapi tag menutupi artwork dan bagian bawah terpotong.")
    b.set_defaults(func=cmd_build)
    return parser.parse_args().func(parser.parse_args())


if __name__ == "__main__":
    sys.exit(main())
