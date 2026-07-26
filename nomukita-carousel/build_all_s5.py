"""Composite slide 5 (serving suggestions) for all twelve products and check each.

Tidak ada kredit yang terpakai di sini: gambarnya sudah dibuat oleh
`batch.serving()`, dan berkas ini hanya menyusun serta memeriksa. Jalankan
`fit_s5.py` lebih dulu - ia mengukur setiap barisnya tanpa biaya, dan itulah
alasannya ada.
"""

import os
import photo
import render_s5 as r5
import s5_menu
import verify
import bs
import build_all

OUT = "slides5"
GEN = "gen"
TAGS = ("hot", "iced", "float")

# Nama pendek berkas hasil generate harus sama dengan yang dipakai slide 1,
# supaya satu produk tidak pernah punya dua nama di dua tempat.
assert sorted(s5_menu.KEY.values()) == sorted(k for _, k in build_all.MAP), \
    "s5_menu.KEY menyimpang dari build_all.MAP"
assert [p["slug"] for p in bs.PRODUCTS] == list(s5_menu.KEY), \
    "urutan produk di s5_menu tidak sama dengan build_slides.PRODUCTS"


def paths(slug):
    key = s5_menu.KEY[slug]
    return [f"{GEN}/s5-{key}-{tag}.png" for tag in TAGS]


def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    fit = __import__("fit_s5").check(verbose=False)
    if fit:
        print(f"{len(fit)} keterangan tidak muat - jalankan fit_s5.py dulu")
        return fit

    ok, bad = [], []
    for prod in bs.PRODUCTS:
        slug = prod["slug"]
        if only and slug not in only:
            continue
        sub, creations = s5_menu.MENU[slug]
        srcs = paths(slug)
        missing = [p for p in srcs if not os.path.exists(p)]
        if missing:
            bad.append((slug, f"missing {', '.join(os.path.basename(m) for m in missing)}"))
            print(f"{slug:20s} missing {[os.path.basename(m) for m in missing]}")
            continue

        # Periksa tiap foto sebelum ditempel. Tepi meja, garis cakrawala, atau
        # siluet yang menelan seluruh frame adalah cacat pada bahannya - jauh
        # lebih mudah ditemukan di sini daripada dilacak mundur dari slide jadi.
        problems = []
        for src in srcs:
            photo.load(src)
            tag = os.path.basename(src).rsplit("-", 1)[1][:-4]
            problems += [f"{tag}: {m}" for m in (
                verify.frame(src, photo._SIL[src], photo._SHADOW[src])
                + verify.silhouette(src, photo._SIL[src])
                + verify.flare(src, photo._SIL[src])
                + verify.matte(src, photo._MASK[src], photo._SIL[src]))]

        path = f"{OUT}/{slug}_S5.png"
        r5.build({"head": prod["head"], "s5_sub": f"{sub}, three ways to enjoy"},
                 [dict(name=nm, vessel=v, lines=lines, image=src)
                  for (nm, v, lines, _d), src in zip(creations, srcs)], path)
        problems += verify.s5(path, slug, bs)
        (ok if not problems else bad).append((slug, problems or "PASS"))
        print(f"{slug:20s} {'PASS' if not problems else problems}")

    print(f"\n{len(ok)} passed, {len(bad)} need attention")
    return bad


if __name__ == "__main__":
    import sys
    main(sys.argv[1:] or None)
