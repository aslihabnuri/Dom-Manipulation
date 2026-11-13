"""Hapus dua bintik merah di lapisan pink gelas Taro (generasi kedua).

Bintiknya potongan stroberi yang tetap digambar model walaupun perintahnya
melarang. Di slide terbaca sebagai noda. Gelasnya fluted, jadi minuman di
belakangnya bergaris vertikal: isi tiap kolom dengan interpolasi lurus antara
piksel bersih tepat di atas dan tepat di bawah noda, di kolom yang sama, supaya
garis rusuknya menyambung tanpa bekas.

    python3 retouch_taro_glass.py gen/glass-taro-raw.png gen/glass-taro.png
"""

import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def main(src, dst):
    a = np.asarray(Image.open(src).convert("RGB")).astype(float)
    r, g = a[..., 0], a[..., 1]
    body = np.zeros(r.shape, bool)
    body[340:800, 340:680] = True             # badan minuman, di bawah pantulan bibir
    spot = body & ((r - g) > 62) & (g < 182)
    yy, xx = np.mgrid[-9:10, -9:10]
    spot = ndi.binary_dilation(spot, xx ** 2 + yy ** 2 <= 81)
    out = a.copy()
    for x in np.nonzero(spot.any(0))[0]:
        col = spot[:, x]
        lab, n = ndi.label(col)
        for k in range(1, n + 1):
            ys = np.nonzero(lab == k)[0]
            y0, y1 = ys[0] - 1, ys[-1] + 1
            top, bot = a[y0 - 2:y0 + 1, x].mean(0), a[y1:y1 + 3, x].mean(0)
            t = ((ys - y0) / (y1 - y0))[:, None]
            out[ys, x] = top * (1 - t) + bot * t
    Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8)).save(dst)
    print(f"{int(spot.sum())} px retouched")


if __name__ == "__main__":
    main(*sys.argv[1:3])
