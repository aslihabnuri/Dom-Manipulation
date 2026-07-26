"""Komposit slide 1 (250 gram) untuk kedua belas produk dan periksa tiap hasilnya."""

import os
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('photo', 'photo.py'),
               ('r1', 'render_one.py'), ('r250', 'render_250.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, photo, r250
import verify
from build_all import MAP, NO_PROP, PROP

OUT = "slides250"


def main():
    os.makedirs(OUT, exist_ok=True)
    ok, bad = [], []
    for idx, slug in MAP:
        glass = f"gen/glass-{slug}.png"
        prop = None if slug in NO_PROP else f"gen/prop-{PROP.get(slug, slug)}.png"
        if not os.path.exists(glass) or (prop and not os.path.exists(prop)):
            bad.append((slug, "aset belum ada")); continue
        problems = []
        for src in [glass] + ([prop] if prop else []):
            photo.load(src)
            problems += [f"{os.path.basename(src)}: {m}"
                         for m in (verify.frame(src, photo._SIL[src], photo._SHADOW[src])
                                   + verify.matte(src, photo._MASK[src], photo._SIL[src]))]
        path = f'{OUT}/{bs.PRODUCTS[idx]["slug"]}_S1_250gr.png'
        problems += r250.build(idx, glass, prop, path, slug)[1] + verify.check(path)
        problems += verify.text(path, bs.PRODUCTS[idx]["slug"], bs, "250 gram")
        (ok if not problems else bad).append((slug, problems or "PASS"))
        print(f"{slug:14s} {'PASS' if not problems else problems}", flush=True)
    print(f"\n{len(ok)} passed, {len(bad)} need attention")
    return bad


if __name__ == "__main__":
    main()
