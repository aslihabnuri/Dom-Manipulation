"""Clean & warm photo grade for Instagram.

Meniru alur editing Lightroom: dehaze -> white balance -> tone curve ->
HSL per warna -> split toning -> vibrance -> clarity -> sharpen.

Pakai:
    python3 tools/warm_clean_filter.py
"""

import os

import numpy as np
from PIL import Image, ImageFilter

# --------------------------------------------------------------------------
# konversi warna
# --------------------------------------------------------------------------

EPS = 1e-8


def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maxc = rgb.max(axis=-1)
    minc = rgb.min(axis=-1)
    delta = maxc - minc
    safe = np.maximum(delta, EPS)

    s = np.where(maxc > EPS, delta / np.maximum(maxc, EPS), 0.0)
    live = delta > EPS
    rc, gc, bc = (maxc - r) / safe, (maxc - g) / safe, (maxc - b) / safe

    h = np.zeros_like(maxc)
    h = np.where(live & (maxc == r), bc - gc, h)
    h = np.where(live & (maxc == g), 2.0 + rc - bc, h)
    h = np.where(live & (maxc == b), 4.0 + gc - rc, h)
    h = (h / 6.0) % 1.0
    return np.stack([h, s, maxc], axis=-1)


def hsv_to_rgb(hsv):
    h, s, v = hsv[..., 0] % 1.0, hsv[..., 1], hsv[..., 2]
    i = np.floor(h * 6.0)
    f = h * 6.0 - i
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    i = (i % 6).astype(np.int32)

    r = np.select([i == 0, i == 1, i == 2, i == 3, i == 4], [v, q, p, p, t], v)
    g = np.select([i == 0, i == 1, i == 2, i == 3, i == 4], [t, v, v, q, p], p)
    b = np.select([i == 0, i == 1, i == 2, i == 3, i == 4], [p, p, t, v, v], q)
    return np.stack([r, g, b], axis=-1)


def luminance(rgb):
    return rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


def to_linear(srgb):
    return np.where(srgb <= 0.04045, srgb / 12.92, ((srgb + 0.055) / 1.055) ** 2.4)


def to_srgb(lin):
    lin = np.clip(lin, 0.0, 1.0)
    return np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055)


# --------------------------------------------------------------------------
# langkah-langkah grading
# --------------------------------------------------------------------------


def dehaze(rgb, amount, pct=0.4, neutral=0.45):
    """Angkat kabut dengan menarik black point. `neutral` menahan sebagian
    koreksi per-channel supaya warna asli tidak ikut hilang."""
    if amount <= 0:
        return rgb
    lo = np.percentile(rgb.reshape(-1, 3), pct, axis=0)
    lo = lo * (1 - neutral) + lo.mean() * neutral
    lo = lo * amount
    return np.clip((rgb - lo) / np.maximum(1 - lo, EPS), 0.0, 1.0)


def white_balance(rgb, temp, tint=0.0):
    """temp > 0 = lebih hangat. Dikerjakan di ruang linear."""
    lin = to_linear(rgb)
    gain = np.array([1.0 + 0.62 * temp, 1.0 + 0.10 * temp + 0.5 * tint, 1.0 - 0.55 * temp], np.float32)
    return to_srgb(lin * gain)


def exposure(rgb, stops):
    if stops == 0:
        return rgb
    return to_srgb(to_linear(rgb) * (2.0**stops))


def _tone_map(x, shadows, highlights, whites, blacks):
    out = x.copy()
    if shadows:
        m = np.clip(1.0 - x / 0.55, 0, 1) ** 1.4
        out = out + shadows * m * (1.0 - x) * 0.85
    if highlights:
        m = np.clip((x - 0.55) / 0.45, 0, 1) ** 1.3
        out = out - highlights * m * x * 0.55
    if whites:
        m = np.clip((x - 0.4) / 0.6, 0, 1)
        out = out + whites * m * (1.0 - x)
    if blacks:
        m = np.clip(1.0 - x / 0.35, 0, 1) ** 1.6
        out = out + blacks * m * x
    return np.clip(out, 0.0, 1.0)


def shadows_highlights(rgb, shadows=0.0, highlights=0.0, whites=0.0, blacks=0.0):
    """Dipakai sebagai LUT per-channel, bukan skala luminance.

    Menskalakan RGB dengan rasio luminance akan meledakkan chroma di piksel
    gelap (noise JPEG jadi bintik biru/merah); kurva per-channel aman dan
    sekalian memberi shadow terangkat yang bersih.
    """
    if not any((shadows, highlights, whites, blacks)):
        return rgb
    xs = np.linspace(0.0, 1.0, 1024, dtype=np.float32)
    ys = _tone_map(xs, shadows, highlights, whites, blacks)
    return np.interp(rgb, xs, ys).astype(np.float32)


def tone_curve(rgb, contrast=0.0, black_lift=0.0, white_point=1.0):
    x = rgb
    if contrast:
        s = x * x * (3.0 - 2.0 * x)  # smoothstep = kurva S
        x = x + contrast * (s - x)
    if black_lift or white_point != 1.0:
        x = black_lift + x * (white_point - black_lift)
    return np.clip(x, 0.0, 1.0)


def hsl(rgb, bands):
    """bands: {nama: (hue_pusat_deg, hue_shift_deg, sat_mul, lum_mul)}"""
    hsv = rgb_to_hsv(rgb)
    h_deg = hsv[..., 0] * 360.0

    sigma = 28.0
    weights, centers = [], []
    for center, *_ in bands.values():
        d = np.abs(((h_deg - center + 180.0) % 360.0) - 180.0)
        weights.append(np.exp(-0.5 * (d / sigma) ** 2))
        centers.append(center)
    w = np.stack(weights, axis=0)
    w = w / np.maximum(w.sum(axis=0, keepdims=True), EPS)  # partition of unity

    # band hanya berlaku pada piksel yang cukup berwarna
    chroma_gate = np.clip(hsv[..., 1] / 0.18, 0, 1)

    hue_shift = np.zeros_like(h_deg)
    sat_mul = np.ones_like(h_deg)
    lum_mul = np.ones_like(h_deg)
    for i, (_, shift, smul, lmul) in enumerate(bands.values()):
        hue_shift += w[i] * shift
        sat_mul += w[i] * (smul - 1.0)
        lum_mul += w[i] * (lmul - 1.0)

    hsv[..., 0] = (hsv[..., 0] + (hue_shift * chroma_gate) / 360.0) % 1.0
    hsv[..., 1] = np.clip(hsv[..., 1] * (1 + (sat_mul - 1) * chroma_gate), 0, 1)
    hsv[..., 2] = np.clip(hsv[..., 2] * (1 + (lum_mul - 1) * chroma_gate), 0, 1)
    return hsv_to_rgb(hsv)


def split_tone(rgb, shadow_rgb, shadow_amt, highlight_rgb, highlight_amt):
    lum = luminance(rgb)[..., None]
    sm = (1.0 - lum) ** 2.2
    hm = lum**2.0
    out = rgb + shadow_amt * sm * (np.asarray(shadow_rgb, np.float32) - 0.5)
    out = out + highlight_amt * hm * (np.asarray(highlight_rgb, np.float32) - 0.5)
    return np.clip(out, 0.0, 1.0)


def clean_shadows(rgb, amount=0.0, knee=0.18):
    """Netralkan chroma di bagian tergelap — ini yang bikin kesan 'clean',
    sekaligus meredam noise warna JPEG."""
    if amount <= 0:
        return rgb
    hsv = rgb_to_hsv(rgb)
    keep = np.clip(hsv[..., 2] / knee, 0, 1)
    hsv[..., 1] = hsv[..., 1] * (1.0 - amount * (1.0 - keep))
    return hsv_to_rgb(hsv)


def vibrance(rgb, amount, saturation=0.0):
    hsv = rgb_to_hsv(rgb)
    s = hsv[..., 1]
    # jangan angkat saturasi di piksel gelap (sumber noise warna)
    gate = np.clip(hsv[..., 2] / 0.25, 0, 1)
    s = s * (1.0 + amount * gate * (1.0 - s) ** 1.5)
    s = s * (1.0 + saturation)
    hsv[..., 1] = np.clip(s, 0, 1)
    return hsv_to_rgb(hsv)


def _blur(arr, radius):
    img = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), "L")
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), np.float32) / 255.0


def clarity(rgb, amount, radius_frac=0.022):
    """Kontras lokal: tambah dimensi tanpa bikin halo."""
    if amount <= 0:
        return rgb
    lum = luminance(rgb)
    radius = max(2.0, radius_frac * max(rgb.shape[:2]))
    detail = lum - _blur(lum, radius)
    # redam di area sangat terang/gelap supaya tidak pecah
    guard = 1.0 - np.abs(lum - 0.5) * 1.4
    guard = np.clip(guard, 0.15, 1.0)
    # aditif, bukan rasio — rasio meledakkan warna di piksel gelap
    return np.clip(rgb + (amount * detail * guard)[..., None], 0.0, 1.0)


def sharpen(img, amount=55, radius=1.1, threshold=3):
    return img.filter(ImageFilter.UnsharpMask(radius=radius, percent=amount, threshold=threshold))


# --------------------------------------------------------------------------
# resep "clean & warm"
# --------------------------------------------------------------------------

# Dasar yang dipakai ketiga foto supaya satu carousel terlihat menyatu:
# hijau ditenangkan & digeser ke arah kuning, kulit dicerahkan,
# langit dibersihkan, shadow sedikit dingin, highlight hangat.
BASE_BANDS = {
    "red": (0.0, 2.0, 0.98, 1.00),
    "orange": (30.0, 3.0, 1.06, 1.05),  # kulit
    "yellow": (55.0, -2.0, 0.98, 1.02),
    "green": (105.0, -12.0, 0.82, 1.00),  # dedaunan
    "aqua": (175.0, -8.0, 0.80, 1.02),  # air
    "blue": (225.0, 4.0, 0.98, 0.97),  # langit: sedikit lebih pekat = bersih
}

BASE = dict(
    temp=0.100,
    tint=0.004,
    shadows=0.18,
    highlights=0.20,
    whites=0.04,
    contrast=0.15,
    black_lift=0.015,
    white_point=0.995,
    shadow_tone=(0.45, 0.49, 0.55),
    shadow_amt=0.10,
    highlight_tone=(0.61, 0.53, 0.41),
    highlight_amt=0.17,
    clean_shadow_amt=0.38,
    vibrance_amt=0.13,
    saturation=-0.01,
    clarity_amt=0.16,
    dehaze_amt=0.50,
    exposure_stops=0.0,
    sharpen_amt=48,
    bands=BASE_BANDS,
)


def merge(**overrides):
    cfg = dict(BASE)
    bands = dict(cfg["bands"])
    bands.update(overrides.pop("bands", {}))
    cfg.update(overrides)
    cfg["bands"] = bands
    return cfg


RECIPES = {
    # Hiking: subjek agak gelap di tengah frame, langit sudah bagus.
    "hiking": merge(
        exposure_stops=0.04,
        shadows=0.24,
        highlights=0.24,
        dehaze_amt=0.45,
        clarity_amt=0.15,
        bands={"blue": (225.0, 4.0, 1.00, 0.95), "green": (105.0, -12.0, 0.80, 1.00)},
    ),
    # Air terjun: paling flat & berkabut, air kehijauan.
    "waterfall": merge(
        exposure_stops=0.04,
        contrast=0.19,
        shadows=0.20,
        highlights=0.28,
        dehaze_amt=0.70,
        clarity_amt=0.20,
        bands={"aqua": (175.0, -12.0, 0.68, 1.02), "green": (105.0, -14.0, 0.76, 1.00)},
    ),
    # Bambu: paling gelap; diangkat secukupnya, mood teduhnya dipertahankan.
    "bamboo": merge(
        exposure_stops=0.15,
        shadows=0.34,
        highlights=0.26,
        dehaze_amt=0.40,
        temp=0.115,
        clarity_amt=0.18,
        highlight_amt=0.19,
        bands={"green": (105.0, -12.0, 0.80, 1.00), "yellow": (55.0, -3.0, 0.96, 1.01)},
    ),
}


# --------------------------------------------------------------------------
# look kedua: "clean banner" — lebih terang, lembut, dan kalem
# --------------------------------------------------------------------------

# Warna ditarik jauh lebih rendah supaya palet foto menyatu jadi satu nada,
# bukan tiga foto dengan hijau yang beda-beda.
CLEAN_BANDS = {
    "red": (0.0, 2.0, 0.90, 1.02),
    "orange": (30.0, 3.0, 1.00, 1.06),  # kulit tetap dijaga
    "yellow": (55.0, -2.0, 0.86, 1.04),
    "green": (105.0, -10.0, 0.70, 1.04),
    "aqua": (175.0, -8.0, 0.70, 1.04),
    "blue": (225.0, 4.0, 0.90, 1.00),
}

# Nilai mutlak: menentukan karakter look, sama untuk ketiga foto.
# Catatan: black lift dijaga tetap kecil dan white point tetap 1.0. Matte
# tebal terbaca sebagai "pudar", bukan "clean" — clean justru butuh putih
# yang benar-benar putih; keluasannya datang dari exposure, bukan kabut.
CLEAN_LOOK = dict(
    temp=0.078,  # krem, bukan amber
    contrast=0.11,
    black_lift=0.010,
    white_point=1.0,
    saturation=-0.07,
    vibrance_amt=0.06,
    clarity_amt=0.10,
    sharpen_amt=40,
    clean_shadow_amt=0.50,
    shadow_tone=(0.47, 0.495, 0.53),
    shadow_amt=0.07,
    highlight_tone=(0.585, 0.545, 0.47),
    highlight_amt=0.10,
    bands=CLEAN_BANDS,
)

# Delta: ditambahkan ke angka per-foto supaya karakter tiap foto tidak hilang.
CLEAN_DELTAS = dict(exposure_stops=0.13, shadows=0.06, highlights=0.12, dehaze_amt=0.10)


def as_clean(cfg):
    out = dict(cfg)
    for key, delta in CLEAN_DELTAS.items():
        out[key] = out.get(key, 0.0) + delta
    bands = dict(out["bands"])
    bands.update(CLEAN_LOOK["bands"])
    out.update(CLEAN_LOOK)
    out["bands"] = bands
    return out


def grade(path, cfg):
    img = Image.open(path).convert("RGB")
    rgb = np.asarray(img, np.float32) / 255.0

    rgb = dehaze(rgb, cfg["dehaze_amt"])
    rgb = exposure(rgb, cfg["exposure_stops"])
    rgb = white_balance(rgb, cfg["temp"], cfg["tint"])
    rgb = shadows_highlights(
        rgb,
        shadows=cfg["shadows"],
        highlights=cfg["highlights"],
        whites=cfg["whites"],
        blacks=cfg.get("blacks", 0.0),
    )
    rgb = tone_curve(rgb, cfg["contrast"], cfg["black_lift"], cfg["white_point"])
    rgb = hsl(rgb, cfg["bands"])
    rgb = split_tone(
        rgb, cfg["shadow_tone"], cfg["shadow_amt"], cfg["highlight_tone"], cfg["highlight_amt"]
    )
    rgb = clean_shadows(rgb, cfg["clean_shadow_amt"])
    rgb = vibrance(rgb, cfg["vibrance_amt"], cfg["saturation"])
    rgb = clarity(rgb, cfg["clarity_amt"])

    out = Image.fromarray((np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8), "RGB")
    return sharpen(out, amount=cfg["sharpen_amt"])


def crop_4x5(img, anchor=0.5):
    """Crop ke 4:5 — rasio potret terbesar yang diizinkan Instagram."""
    w, h = img.size
    target = 5 / 4
    if h / w > target:
        new_h = int(round(w * target))
        top = int(round((h - new_h) * anchor))
        img = img.crop((0, top, w, top + new_h))
    else:
        new_w = int(round(h / target))
        left = int(round((w - new_w) * anchor))
        img = img.crop((left, 0, left + new_w, h))
    return img.resize((1080, 1350), Image.LANCZOS)


SOURCES = [
    ("hiking", "IMG_3694.JPG", 0.5),
    ("waterfall", "IMG_3692.JPG", 0.5),
    ("bamboo", "IMG_0200.JPG", 0.42),
]


LOOKS = {"warm": lambda cfg: cfg, "clean": as_clean}


def main(src_dir, out_dir, looks=("warm", "clean")):
    os.makedirs(out_dir, exist_ok=True)
    for recipe, filename, anchor in SOURCES:
        src = os.path.join(src_dir, filename)
        if not os.path.exists(src):
            print(f"lewati (tidak ada): {src}")
            continue
        for look in looks:
            img = grade(src, LOOKS[look](RECIPES[recipe]))
            full = os.path.join(out_dir, f"{recipe}-{look}.jpg")
            img.save(full, quality=95, subsampling=0, optimize=True)
            square = os.path.join(out_dir, f"{recipe}-{look}-4x5.jpg")
            crop_4x5(img, anchor).save(square, quality=95, subsampling=0, optimize=True)
            print(f"{filename} -> {os.path.basename(full)}, {os.path.basename(square)}")


if __name__ == "__main__":
    import sys

    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, "instagram", "original")
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, "instagram", "edited")
    main(src, out)
