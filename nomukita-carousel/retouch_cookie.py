"""Ratakan permukaan atas biskuit Cookies & Cream: buang cincin bunga timbul.

Pelanggan ingin biskuitnya berbentuk seperti Oreo - bulat, kakao gelap, krim
putih - tapi tanpa penanda merek apa pun, karena listing-nya kena penalti.
Perintah ke model sudah melarang pola timbul dengan tegas, dan dua kali model
tetap menaruh cincin bunga kecil di pinggir permukaan atas. Pola itu bagian
dari tampilan dagang Oreo, jadi dihapus di sini.

Di dalam elips permukaan atas tiap biskuit, gambar diganti dengan dua lapis:
- dasar: rata-rata Gauss lebar (sigma 14) yang hanya mengambil piksel di dalam
  elips itu sendiri, jadi gradasi cahaya permukaan tetap ada tetapi timbulan
  selebar 15-40 px hilang dan pinggiran bergerigi tidak ikut tercampur;
- butir: lolos-tinggi halus (sigma 1) dari gambar asli, dipotong pada amplitudo
  butir remah di bagian tengah yang polos, supaya teksturnya tetap kakao tetapi
  tepi timbulan tidak tersisa.

Elipsnya diukur dari gambar generasi pertama (prop-cookiescream-raw.png),
1184 x 864. Gambar lain perlu elips lain.

    python3 retouch_cookie.py gen/prop-cookiescream-raw.png gen/prop-cookiescream.png
"""

import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def ellipse(shape, cx, cy, a, b, deg):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]]
    t = np.deg2rad(deg)
    x, y = xx - cx, yy - cy
    u = x * np.cos(t) + y * np.sin(t)
    v = -x * np.sin(t) + y * np.cos(t)
    return (u / a) ** 2 + (v / b) ** 2 <= 1


def faces(a):
    dark = ndi.binary_fill_holes(a.mean(2) < 170)
    right = ellipse(a.shape, 783, 349, 194, 122, 29.4) & ndi.binary_erosion(dark, iterations=12)
    right_whole = ellipse(a.shape, 772, 366, 250, 152, 27)
    left = (ellipse(a.shape, 428, 415, 190, 94, -2) & ndi.binary_erosion(dark, iterations=9)
            & ~right_whole)
    return [left, right]


def flatten(a, m, sigma=14, grain_sigma=0.8):
    w = ndi.gaussian_filter(m.astype(float), sigma)
    base = np.stack([ndi.gaussian_filter(a[..., c] * m, sigma) for c in range(3)], -1)
    base = base / np.maximum(w, 1e-6)[..., None]
    hp = a - np.stack([ndi.gaussian_filter(a[..., c], grain_sigma) for c in range(3)], -1)
    core = ndi.binary_erosion(m, iterations=40)
    lim = 1.2 * hp[core].std() if core.any() else 4.0
    # Pemotongan itu juga memangkas butir remahnya sendiri, dan permukaan tanpa
    # butir terbaca seperti kulit atau plastik. Butir acak ditambahkan kembali
    # sampai amplitudonya sama dengan bagian tengah yang polos (~3,2 level),
    # dengan belang kasar tipis supaya terbaca sebagai adonan panggang.
    rng = np.random.default_rng(7)
    fine = ndi.gaussian_filter(rng.normal(0, 1, a.shape[:2]), 0.6)
    coarse = ndi.gaussian_filter(rng.normal(0, 1, a.shape[:2]), 3.0)
    grain = 2.4 * fine / fine.std() + 1.4 * coarse / coarse.std()
    return base + np.clip(hp, -lim, lim) + grain[..., None]


def main(src, dst):
    a = np.asarray(Image.open(src).convert("RGB")).astype(float)
    out = a.copy()
    for m in faces(a):
        feather = ndi.gaussian_filter(ndi.binary_erosion(m, iterations=2).astype(float), 2.0)[..., None]
        out = out * (1 - feather) + flatten(a, m) * feather
    Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8)).save(dst)


if __name__ == "__main__":
    main(*sys.argv[1:3])
