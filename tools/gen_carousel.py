#!/usr/bin/env python3
"""Generate the four value-product photos as one continuous carousel series.

The boxer frame is shot first and then passed back in as a reference for the
other three, so all four slides read as the same man, same studio, same light —
which is what makes them work when swiped one after another.
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
import kie

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
OUT = f"{SCR}/gen"
MODEL = "nano-banana-pro"

REFS = {
    "boxer":    f"{SCR}/src/boxer_men_grey.png",
    "brief":    f"{SCR}/src/brief_men_grey.png",
    "crewneck": f"{SCR}/src/crewneck.jpg",
    "tanktop":  f"{SCR}/src/tanktop_white.jpg",
}

# One shoot. Every slide repeats these conditions verbatim.
SHOOT = (
    "Black and white photograph, no colour whatsoever. Studio setup, identical on "
    "every frame: a single hard key light from the upper left carving out the "
    "muscles, deep shadow falloff to the right, plain dark charcoal seamless "
    "backdrop with no texture, pattern or visible edges. "
    "FRAMING, identical on every frame: the man is centred and photographed from "
    "the top of his shoulders down to just above his knees, standing at the same "
    "distance from the camera, at the same scale, filling the middle 50 percent of "
    "the frame width and leaving wide empty dark background down both the left and "
    "the right edges for text annotations. His head and face are above the top edge "
    "of the frame. The photograph bleeds to all four edges of the 4:5 frame: no "
    "bars, no borders, no letterboxing. "
    "Lean powerful athletic build, defined abdominal and shoulder muscles, natural "
    "skin texture. Editorial performance-apparel mood, calm and controlled. "
    "Photorealistic, high detail, professional fashion photography.")

SAME = ("The man, the studio, the lighting, the backdrop, the camera distance and the "
        "framing are IDENTICAL to reference image 1 — same face-less shoulders-to-knees "
        "crop, same scale, same key light from the upper left, same plain dark charcoal "
        "backdrop. Only the garment and the stance change. ")

ANCHOR = dict(
    name="value-boxer", refs=["boxer"], prompt=(
        "Commercial catalogue photograph for a men's underwear brand. He wears BLACK "
        "boxer briefs: the same cut, panel seams and wide flat elasticated waistband "
        "as reference image 1, but in solid black. He stands square to camera, weight "
        "settled on his right leg, left hand resting easily at the waistband, "
        "shoulders level and relaxed. The black boxer briefs are the focal point, "
        "crisply lit so the fabric, seams and waistband read clearly. " + SHOOT))

FOLLOW = [
    dict(name="value-brief", refs=["ANCHOR", "brief"], prompt=(
        "Commercial catalogue photograph for a men's underwear brand. " + SAME +
        "He wears BLACK briefs: the same cut, seams and wide flat elasticated "
        "waistband as reference image 2, but in solid black. His hips are turned a "
        "quarter to his left while his torso twists back toward the light, his right "
        "hand loose at his side, his left hand at his hip. The black briefs are the "
        "focal point, crisply lit so the fabric, seams and waistband read clearly. "
        + SHOOT)),

    dict(name="value-crewneck", refs=["ANCHOR", "crewneck", "boxer"], prompt=(
        "Commercial catalogue photograph for a men's apparel brand. " + SAME +
        "He now wears a plain WHITE crewneck cotton t-shirt, the exact garment in "
        "reference image 2: same crew collar, short sleeves, relaxed straight cut, "
        "solid white with no print or logo. Below it he still wears the same solid "
        "BLACK boxer briefs from reference image 3. His hips are turned a quarter to "
        "his right, torso open to the light, his left hand lifting the hem of the "
        "shirt slightly, his right arm relaxed. The white t-shirt is the focal point, "
        "lit so the cotton weave, collar rib and shoulder seams read brightly against "
        "the dark background. " + SHOOT)),

    dict(name="value-tanktop", refs=["ANCHOR", "tanktop", "boxer"], prompt=(
        "Commercial catalogue photograph for a men's apparel brand. " + SAME +
        "He now wears a plain WHITE cotton tank top singlet, the exact garment in "
        "reference image 2: same scooped neckline, wide shoulder straps, straight "
        "cut, solid white with no print or logo. Below it he still wears the same "
        "solid BLACK boxer briefs from reference image 3. He stands square to camera "
        "again, both arms bent and flexed outward from the shoulders, chest open, "
        "shoulder and arm muscles clearly defined beside the singlet. The white tank "
        "top is the focal point, lit so the cotton weave, neckline binding and side "
        "seams read brightly against the dark background. " + SHOOT)),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    cache_path = f"{OUT}/uploads.json"
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}
    for k, p in REFS.items():
        if k not in cache:
            cache[k] = kie.upload(p); print(f"  uploaded {k}")

    def run(spec, extra=None):
        urls = [cache[r] if r != "ANCHOR" else extra for r in spec["refs"]]
        tid = kie.create(MODEL, {"prompt": spec["prompt"], "image_input": urls,
                                 "aspect_ratio": "4:5", "resolution": "2K",
                                 "output_format": "png"})
        print(f"  queued {spec['name']}: {tid}")
        out = kie.result(tid, timeout=900)
        kie.download(out[0], f"{OUT}/{spec['name']}.png")
        print(f"  ✓ {spec['name']}")
        return out[0]

    anchor_url = run(ANCHOR)                       # shot first, then reused
    cache["anchor"] = anchor_url
    json.dump(cache, open(cache_path, "w"), indent=2)

    tasks = {}
    for spec in FOLLOW:
        urls = [anchor_url if r == "ANCHOR" else cache[r] for r in spec["refs"]]
        tasks[spec["name"]] = kie.create(MODEL, {
            "prompt": spec["prompt"], "image_input": urls,
            "aspect_ratio": "4:5", "resolution": "2K", "output_format": "png"})
        print(f"  queued {spec['name']}: {tasks[spec['name']]}")
    for name, tid in tasks.items():
        try:
            kie.download(kie.result(tid, timeout=900)[0], f"{OUT}/{name}.png")
            print(f"  ✓ {name}")
        except Exception as e:
            print(f"  ✗ {name}: {e}")


if __name__ == "__main__":
    main()
