#!/usr/bin/env python3
"""
Shopee Brand Max 2026 (BAU) banner builder / auditor — Sophie Martin.

Takes the brand key visuals plus Shopee's official Brand Max template overlays and
produces the four banner assets at exactly the dimensions, formats and file-size
caps required by "Creative Guideline Brand Max 2026 - BAU".

    python3 build_banners.py audit  --assets ./assets
    python3 build_banners.py build  --assets ./assets --out ./out --config config.json

See SYARAT_KETENTUAN.md for the full rule set this implements.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Backgrounds Shopee rejects: too little contrast against the app UI.
BANNED_BACKGROUNDS = [(0xFF, 0xFF, 0xFF), (0xF1, 0xF1, 0xF1)]
BANNED_TOLERANCE = 6  # per-channel distance that still counts as "too close"

SHOPEE_RED = (0xD0, 0x01, 0x1B)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]


@dataclass
class Spec:
    """One banner format as defined by the guideline."""

    key: str
    label: str
    width: int
    height: int
    fmt: str  # "JPEG" or "PNG"
    max_kb: int
    ksp_pt: int | None  # None => promotional text is forbidden in this format
    max_ksp: int
    kv: str  # key-visual filename stem
    overlay_light: str  # template overlay to use over a light background
    overlay_dark: str  # template overlay to use over a red/dark background
    transparent: bool = False
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
        ksp_pt=25,  # guideline: minimum 25pt
        max_ksp=2,
        kv="KV Banner_Halaman Rekomendasi Banner",
        overlay_light="BRAND-MAX-BANNER-CARD-Red",
        overlay_dark="BRAND-MAX-BANNER-CARD-White",
        notes=["Shopee Mall tag wajib", "Logo brand di atas", "SKU wajib terlihat"],
    ),
    Spec(
        key="floating_banner",
        label="Floating Banner",
        width=360,
        height=360,
        fmt="PNG",
        max_kb=250,
        ksp_pt=None,  # guideline: "Do not use promotional messages"
        max_ksp=0,
        kv="KV Banner_Floating Banner",
        overlay_light="BRAND-MAX-Floating-Icon-1",
        overlay_dark="BRAND-MAX-Floating-Icon-1",
        transparent=True,
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
        ksp_pt=47,  # guideline: recommended ~47pt
        max_ksp=2,
        kv="KV Banner_Skinny Banner App",
        overlay_light="BRAND-MAX-Skinny-App",
        overlay_dark="BRAND-MAX-Skinny-App",
        notes=["Desain harus di dalam clipping mask", "White outline wajib ada"],
    ),
    Spec(
        key="skinny_web",
        label="Skinny Web Banner (PC)",
        width=1200,
        height=110,
        fmt="JPEG",
        max_kb=500,
        ksp_pt=40,  # guideline: recommended ~40pt
        max_ksp=2,
        kv="KV Banner_Skinny Banner PC",
        overlay_light="BRAND-MAX-Skinny-Web-Red",
        overlay_dark="BRAND-MAX-Skinny-Web-White",
        notes=["Masking sesuai guideline", "Tag putih di background merah"],
    ),
]


# ----------------------------------------------------------------------------- helpers


def find_asset(assets: Path, stem: str) -> Path | None:
    """Locate an asset by filename stem, tolerating the doubled extensions Drive adds."""
    for path in sorted(assets.rglob("*")):
        if not path.is_file():
            continue
        name = path.name.lower()
        if name.startswith(stem.lower()) and path.suffix.lower() in {
            ".png",
            ".jpg",
            ".jpeg",
        }:
            return path
    return None


def load_font(px: int) -> ImageFont.FreeTypeFont:
    for candidate in FONT_CANDIDATES:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, px)
    return ImageFont.load_default()


def cover_fit(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Scale to fully cover the target box, then centre-crop. Never distorts aspect."""
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    new = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    left = (new.width - tw) // 2
    top = (new.height - th) // 2
    return new.crop((left, top, left + tw, top + th))


def dominant_background(im: Image.Image) -> tuple[int, int, int]:
    """Average colour of the image border — a good proxy for the background."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    edge = max(1, min(w, h) // 20)
    samples: list[tuple[int, int, int]] = []
    for strip in (
        rgb.crop((0, 0, w, edge)),
        rgb.crop((0, h - edge, w, h)),
        rgb.crop((0, 0, edge, h)),
        rgb.crop((w - edge, 0, w, h)),
    ):
        raw = strip.resize((8, 8), Image.BILINEAR).tobytes()
        samples.extend(
            (raw[i], raw[i + 1], raw[i + 2]) for i in range(0, len(raw), 3)
        )
    n = len(samples)
    return (
        sum(s[0] for s in samples) // n,
        sum(s[1] for s in samples) // n,
        sum(s[2] for s in samples) // n,
    )


def is_banned_background(rgb: tuple[int, int, int]) -> bool:
    return any(
        all(abs(rgb[i] - banned[i]) <= BANNED_TOLERANCE for i in range(3))
        for banned in BANNED_BACKGROUNDS
    )


def is_dark_or_red(rgb: tuple[int, int, int]) -> bool:
    """Decide whether the WHITE Shopee Mall tag is needed for contrast."""
    r, g, b = rgb
    luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    reddish = r > 120 and r > g + 60 and r > b + 60
    return luminance < 140 or reddish


def nudge_off_banned(im: Image.Image) -> Image.Image:
    """Darken very slightly so a near-#FFFFFF/#F1F1F1 background clears the rule."""
    return Image.eval(im, lambda v: max(0, min(255, int(v * 0.93))))


def save_within_budget(im: Image.Image, dest: Path, spec: Spec) -> int:
    """Write the file, stepping quality down until it fits the guideline's cap."""
    budget = spec.max_kb * 1024
    dest.parent.mkdir(parents=True, exist_ok=True)

    if spec.fmt == "PNG":
        im.save(dest, "PNG", optimize=True)
        if dest.stat().st_size > budget:
            # Quantise the colour table; keeps alpha, drops weight hard.
            for colors in (256, 192, 128, 96, 64):
                quant = im.convert("RGBA").quantize(
                    colors=colors, method=Image.FASTOCTREE
                )
                quant.save(dest, "PNG", optimize=True)
                if dest.stat().st_size <= budget:
                    break
        return dest.stat().st_size

    flat = im.convert("RGB")
    for quality in range(92, 40, -4):
        flat.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
        if dest.stat().st_size <= budget:
            break
    return dest.stat().st_size


def draw_ksp(
    im: Image.Image, lines: list[str], spec: Spec, colour: tuple[int, int, int]
) -> None:
    """Render the key selling points at the size the guideline prescribes."""
    if not lines or spec.ksp_pt is None:
        return
    draw = ImageDraw.Draw(im)
    font = load_font(spec.ksp_pt)
    pad = max(16, spec.width // 40)
    gap = int(spec.ksp_pt * 0.32)

    heights = []
    for line in lines:
        box = draw.textbbox((0, 0), line, font=font)
        heights.append(box[3] - box[1])
    total = sum(heights) + gap * (len(lines) - 1)

    y = (spec.height - total) // 2
    shadow = (0, 0, 0) if sum(colour) > 380 else (255, 255, 255)
    for line, height in zip(lines, heights):
        box = draw.textbbox((0, 0), line, font=font)
        draw.text((pad + 2 - box[0], y + 2 - box[1]), line, font=font, fill=shadow)
        draw.text((pad - box[0], y - box[1]), line, font=font, fill=colour)
        y += height + gap


def place_logo(im: Image.Image, logo_path: Path | None, spec: Spec) -> None:
    """Brand logo goes at the TOP — the guideline is explicit about reading flow."""
    if not logo_path or not logo_path.exists():
        return
    logo = Image.open(logo_path).convert("RGBA")
    target_h = max(24, int(spec.height * 0.16))
    ratio = target_h / logo.height
    logo = logo.resize((max(1, round(logo.width * ratio)), target_h), Image.LANCZOS)
    pad = max(12, spec.width // 50)
    im.alpha_composite(logo, (pad, pad))


# ----------------------------------------------------------------------------- commands


def cmd_audit(args: argparse.Namespace) -> int:
    assets = Path(args.assets)
    if not assets.exists():
        print(f"!! assets directory not found: {assets}")
        return 2

    print(f"AUDIT — Shopee Brand Max 2026 (BAU)   assets: {assets}\n")
    missing = 0
    for spec in SPECS:
        print(f"[{spec.label}]  target {spec.width}x{spec.height} "
              f"{spec.fmt} <= {spec.max_kb}kb")
        kv = find_asset(assets, spec.kv)
        if kv is None:
            print(f"   KV        : MISSING  (expected '{spec.kv}.*')")
            missing += 1
        else:
            try:
                im = Image.open(kv)
                im.load()
            except Exception as exc:  # noqa: BLE001 - report any decode failure
                print(f"   KV        : UNREADABLE ({exc})")
                missing += 1
                continue
            size_kb = kv.stat().st_size / 1024
            bg = dominant_background(im)
            dim_ok = im.size == spec.size
            print(f"   KV        : {kv.name}")
            print(f"     dimensi : {im.size[0]}x{im.size[1]}  "
                  f"{'OK' if dim_ok else 'PERLU DIUBAH -> %dx%d' % spec.size}")
            print(f"     file    : {size_kb:.0f} kb  "
                  f"{'OK' if size_kb <= spec.max_kb else 'TERLALU BESAR'}")
            print(f"     bg      : #{bg[0]:02X}{bg[1]:02X}{bg[2]:02X}  "
                  f"{'DILARANG (terlalu putih)' if is_banned_background(bg) else 'OK'}")
            print(f"     tag     : gunakan Shopee Mall versi "
                  f"{'PUTIH' if is_dark_or_red(bg) else 'MERAH'}")

        overlay = find_asset(assets, spec.overlay_light)
        print(f"   template  : {overlay.name if overlay else 'MISSING (%s.png)' % spec.overlay_light}")
        if overlay is None:
            missing += 1
        for note in spec.notes:
            print(f"     - {note}")
        print()

    if missing:
        print(f"{missing} aset belum tersedia — lengkapi dulu sebelum build.")
    else:
        print("Semua aset tersedia. Siap di-build.")
    return 0


def cmd_build(args: argparse.Namespace) -> int:
    assets = Path(args.assets)
    out = Path(args.out)
    cfg = {}
    if args.config and Path(args.config).exists():
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))

    ksp_lines: list[str] = cfg.get("ksp", [])
    logo_path = Path(cfg["logo"]) if cfg.get("logo") else None
    text_colour = tuple(cfg.get("ksp_color", [255, 255, 255]))  # type: ignore[assignment]

    out.mkdir(parents=True, exist_ok=True)
    built, failed = 0, 0

    for spec in SPECS:
        kv_path = find_asset(assets, spec.kv)
        overlay_light = find_asset(assets, spec.overlay_light)
        overlay_dark = find_asset(assets, spec.overlay_dark)

        if kv_path is None or overlay_light is None:
            print(f"-- {spec.label}: SKIP (aset belum lengkap)")
            failed += 1
            continue

        base = Image.open(kv_path).convert("RGBA")
        canvas = cover_fit(base, spec.size)

        bg = dominant_background(canvas)
        if is_banned_background(bg):
            canvas = nudge_off_banned(canvas.convert("RGB")).convert("RGBA")
            bg = dominant_background(canvas)
            print(f"   {spec.key}: background terlalu putih -> digelapkan sedikit")

        # White Shopee Mall tag on red/dark backgrounds, red tag otherwise.
        chosen = overlay_dark if (is_dark_or_red(bg) and overlay_dark) else overlay_light
        overlay = Image.open(chosen).convert("RGBA").resize(spec.size, Image.LANCZOS)

        place_logo(canvas, logo_path, spec)

        # Floating Banner must carry no promotional message at all.
        if spec.ksp_pt is not None:
            draw_ksp(canvas, ksp_lines[: spec.max_ksp], spec, text_colour)

        canvas.alpha_composite(overlay)

        if spec.transparent:
            # Keep the template's silhouette: anything outside the mask stays clear.
            canvas.putalpha(overlay.getchannel("A"))
            result = canvas
        else:
            result = canvas.convert("RGB")

        ext = "png" if spec.fmt == "PNG" else "jpg"
        dest = out / f"{spec.key}_{spec.width}x{spec.height}.{ext}"
        size = save_within_budget(result, dest, spec)

        ok = size <= spec.max_kb * 1024
        print(f"-- {spec.label}: {dest.name}  {spec.width}x{spec.height}  "
              f"{size/1024:.0f}kb  tag={'PUTIH' if chosen is overlay_dark else 'MERAH'}  "
              f"{'OK' if ok else 'MASIH DI ATAS BATAS'}")
        built += 1

    print(f"\nselesai: {built} banner dibuat, {failed} dilewati -> {out}")
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("audit", help="cek aset terhadap guideline")
    a.add_argument("--assets", default="./assets")
    a.set_defaults(func=cmd_audit)

    b = sub.add_parser("build", help="bangun 4 banner sesuai spesifikasi")
    b.add_argument("--assets", default="./assets")
    b.add_argument("--out", default="./out")
    b.add_argument("--config", default="config.json")
    b.set_defaults(func=cmd_build)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
