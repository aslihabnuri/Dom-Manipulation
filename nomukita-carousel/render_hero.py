"""Slide 1 gaya hero shot: produk berbaring di atas tumpukan bahannya.

Acuannya "Chillcha - Citrus Zest Chill": kaleng di tengah, tumpukan lemon
memenuhi seluruh frame, matahari keras dari kiri atas, tanpa teks apa pun.

Latarnya digenerate (tumpukan bahan tanpa produk), lalu mockup ASLI ditempel di
atasnya. Produknya sengaja tidak ikut digenerate: model selalu menggambar ulang
labelnya, dan katakana serta nama produk di kemasan harus persis.

Bayangannya dua lapis, keduanya dari alpha mockup: bayangan jatuh yang keras ke
kanan bawah, searah matahari pada latar, dan bayangan kontak yang rapat supaya
kemasan terbaca menempel pada tumpukan, bukan melayang.
"""

import os
import sys
import numpy as np
from PIL import Image, ImageFilter

import build_slides as bs

W = H = 1024
GEN = "gen"
OUT = "slide-1-hero"

# arah matahari pada latar: kiri atas, jadi bayangan jatuh ke kanan bawah
CAST = dict(dx=34, dy=40, blur=16, alpha=0.62)
CONTACT = dict(dx=8, dy=10, blur=5, alpha=0.55)


def _trim(im):
    return im.crop(im.getchannel("A").getbbox())


def _shadow(alpha, size, at, dx, dy, blur, alpha_k):
    s = Image.new("L", size, 0)
    s.paste(alpha, (at[0] + dx, at[1] + dy))
    s = s.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(s, dtype=np.float32) / 255.0 * alpha_k


def place(bg, packs):
    """packs: [(RGBA, (x, y))]. Bayangan semua kemasan dulu, baru kemasannya."""
    a = np.asarray(bg.convert("RGB"), dtype=np.float32)
    dark = np.zeros(a.shape[:2], np.float32)
    for im, at in packs:
        al = im.getchannel("A")
        for k in (CAST, CONTACT):
            dark = np.maximum(dark, _shadow(al, bg.size, at, k["dx"], k["dy"],
                                            k["blur"], k["alpha"]))
    # bayangan matahari tidak hitam pekat: sedikit kebiruan, seperti pada acuan
    tint = np.array([0.92, 0.95, 1.0], np.float32)
    a = a * (1 - dark[..., None] * (1 - 0.18 * tint))
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")
    for im, at in packs:
        out.alpha_composite(im, at)
    return out.convert("RGB")


def sun(im, warm=(1.0, 0.988, 0.965), spread=0.06):
    """Cahaya matahari tipis pada mockup: sedikit hangat, lebih terang di kiri
    atas dan lebih redup di kanan bawah, searah cahaya latar. Cukup tipis
    sampai warna label tetap terbaca sama - mockupnya membawa pencahayaan
    studio lembut sendiri, dan tanpa ini kemasannya tampak ditempel."""
    a = np.asarray(im, dtype=np.float32).copy()
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    ramp = 1 + spread * (0.5 - (xx / w + yy / h) / 2) * 2
    a[..., :3] *= ramp[..., None] * np.array(warm, np.float32)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def pack(name, height):
    im = _trim(Image.open(os.path.join(bs.PROD, name)).convert("RGBA"))
    w = round(im.width * height / im.height)
    return im.resize((w, height), Image.LANCZOS)


def build(prod, bg_path, variant):
    bg = Image.open(bg_path).convert("RGB").resize((W, H), Image.LANCZOS)
    small = bs.small_pack(prod)
    if variant == "1000":
        big = pack(prod["p1000"], 720)
        packs = [(big, ((W - big.width) // 2, (H - big.height) // 2 + 6))]
    elif variant == "small":
        sm = pack(small[0], 560)
        if sm.width > 760:
            sm = pack(small[0], round(560 * 760 / sm.width))
        packs = [(sm, ((W - sm.width) // 2, (H - sm.height) // 2 + 6))]
    else:  # combo: berdampingan, tidak bertumpuk - pouch kecil yang menumpang
        # di depan pouch besar menutupi wordmark "nomukita" dan labelnya
        big = pack(prod["p1000"], 660)
        sm = pack(small[0], round(660 * small[2]))
        gap = 16
        gx = (W - (big.width + gap + sm.width)) // 2
        top = (H - big.height) // 2 + 6
        packs = [(big, (gx, top)),
                 (sm, (gx + big.width + gap, top + big.height - sm.height - 4))]
    return place(bg, [(sun(im), at) for im, at in packs])


def main(slugs):
    os.makedirs(OUT, exist_ok=True)
    for prod in bs.PRODUCTS:
        if prod["slug"] not in slugs:
            continue
        bg = f"{GEN}/hero-{prod['slug'].lower()}-bg.png"
        num = bs.small_pack(prod)[1].split()[0]
        for variant, suffix in (("1000", "1000gr"), ("small", f"{num}gr"),
                                ("combo", f"{num}&1000gr")):
            path = f"{OUT}/{prod['slug']}_S1_hero_{suffix}.png"
            build(prod, bg, variant).save(path)
            print("wrote", path)


if __name__ == "__main__":
    main(sys.argv[1:])
