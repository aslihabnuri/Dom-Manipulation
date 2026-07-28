"""Composite slide 2 (manfaat produk) untuk kedua belas produk dan periksa tiap hasil.

Nol kredit: pouch-nya memakai mockup yang sudah ada untuk kedua ukuran, sisanya
tipografi. Jalankan `fit_s2.py` lebih dulu - ia mengukur tiap baris tanpa biaya,
dan driver ini menolak berjalan kalau masih ada yang tumpah.
"""

import os
import render_s2 as r2
import s2_copy
import verify
import bs

OUT = "slides2"
SIZES = ("1000", "250")   # "250" berarti kemasan kecil apa pun beratnya


def main(only=None):
    fit = __import__("fit_s2").check(verbose=False)
    if fit:
        print(f"{len(fit)} naskah tidak muat, jalankan fit_s2.py dulu")
        return fit

    ok, bad = [], []
    for prod in bs.PRODUCTS:
        slug = prod["slug"]
        if only and slug not in only:
            continue
        if slug not in s2_copy.COPY:
            bad.append((slug, "no copy on file"))
            continue
        for size in SIZES:
            num = "1000" if size == "1000" else bs.small_pack(prod)[1].split()[0]
            folder = f"{OUT}/{num}gr"
            os.makedirs(folder, exist_ok=True)
            path = f"{folder}/{slug}_S2_{num}gr.png"
            r2.build(prod, s2_copy.COPY[slug], path, size)
            problems = verify.s2(path, slug, bs)
            (ok if not problems else bad).append((f"{slug} {num}g", problems or "PASS"))
            print(f"{slug:20s} {num:>4s}g  {'PASS' if not problems else problems}")

    print(f"\n{len(ok)} passed, {len(bad)} need attention")
    if s2_copy.NEEDS_OK:
        print("Baris penutup yang masih menunggu konfirmasi pelanggan: "
              + ", ".join(sorted(s2_copy.NEEDS_OK)))
    return bad


if __name__ == "__main__":
    import sys
    main(sys.argv[1:] or None)
