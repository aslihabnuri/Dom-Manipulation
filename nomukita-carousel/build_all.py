"""Composite slide 1 (1000 gram) for all twelve products and check each one."""

import os
import render_one as r
import verify
import bs

OUT = "slides1000"

# product index in bs.PRODUCTS -> generated asset slug.
# Frappe Base is drink-only; Milk Tea and Teh Tarik use black tea as their prop.
MAP = [
    (0, "matchalatte"), (1, "premixmatcha"), (2, "tehtarik"), (3, "chocolate"),
    (4, "cookiescream"), (5, "charcoal"), (6, "avocado"), (7, "vanilla"),
    (8, "milktea"), (9, "lemontea"), (10, "frappebase"), (11, "lemongrass"),
]
NO_PROP = {"frappebase"}


def main():
    os.makedirs(OUT, exist_ok=True)
    ok, bad = [], []
    for idx, slug in MAP:
        glass = f"gen/glass-{slug}.png"
        prop = None if slug in NO_PROP else f"gen/prop-{slug}.png"
        if not os.path.exists(glass) or (prop and not os.path.exists(prop)):
            bad.append((slug, "missing generated asset"))
            continue
        path = f'{OUT}/{bs.PRODUCTS[idx]["slug"]}_S1_1000gr.png'
        r.build(idx, glass, prop, path)
        problems = verify.check(path)
        (ok if not problems else bad).append((slug, problems or "PASS"))
        print(f"{slug:14s} {'PASS' if not problems else problems}")
    print(f"\n{len(ok)} passed, {len(bad)} need attention")
    return bad


if __name__ == "__main__":
    main()
