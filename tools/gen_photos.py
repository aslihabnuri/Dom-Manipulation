#!/usr/bin/env python3
"""Generate the banner hero photography via Kie (nano-banana-pro).

Real Toni Black product shots are passed as reference images so the garments —
especially the branded waistband — stay accurate instead of being invented.
"""
import os, sys, json, time
sys.path.insert(0, os.path.dirname(__file__))
import kie

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
OUT = f"{SCR}/gen"
MODEL = "nano-banana-pro"

REFS = {
    "boxer":    f"{SCR}/src/boxer_men_grey.png",
    "brief":    f"{SCR}/src/brief_men_grey.png",
    "crewneck": f"{SCR}/src/crewneck.jpg",
    "kids":     f"{SCR}/src/brief_kids_navy.png",
    "men_worn": f"{SCR}/photos/TPR_3096.JPG.jpg",
    "kid_worn": f"{SCR}/photos/ZAI_Kids_3.jpg.jpg",
}

BRAND = ("Muted monochrome palette — charcoal black, grey and white only, no other "
         "colours. Clean, understated, premium menswear campaign aesthetic: calm "
         "confidence and quiet strength, never flashy. Photorealistic, high detail, "
         "natural skin texture, professional fashion photography.")

JOBS = {
    # ── Banner 1 hero — brand story ────────────────────────────────────────
    "hero-brandstory-white": dict(
        refs=["crewneck", "boxer", "men_worn"], ar="4:5",
        prompt=(
            "Editorial fashion photograph, vertical 4:5. A fit man in his late twenties "
            "sits on a simple dark wooden stool in a bright minimalist photo studio with "
            "a seamless light grey backdrop. He is pulling a plain white crewneck "
            "t-shirt — the exact shirt in reference image 1 — up over his head with both "
            "arms raised, so the shirt covers his head and face and his lean athletic "
            "torso is revealed. He wears the men's boxer briefs from reference image 2: "
            "dark charcoal with a wide flat elasticated waistband. Barefoot, one foot on "
            "the stool rung. Relaxed and natural, not stiffly posed. Strong directional "
            "side lighting with sharp contrast that sculpts the body and shows the "
            "fabric texture. "
            "IMPORTANT COMPOSITION: place the seated figure in the RIGHT third of the "
            "frame and leave the left half as clean empty grey backdrop for text. "
            "Full figure visible head to feet. " + BRAND)),

    "hero-brandstory-charcoal": dict(
        refs=["crewneck", "boxer", "men_worn"], ar="4:5",
        prompt=(
            "Editorial fashion photograph, vertical 4:5. A fit man in his late twenties "
            "sits on a simple dark wooden stool in a bright minimalist photo studio with "
            "a seamless light grey backdrop. He is pulling a plain charcoal-black "
            "crewneck t-shirt — same cut and fit as reference image 1 but in deep "
            "charcoal black — up over his head with both arms raised, so the shirt "
            "covers his head and face and his lean athletic torso is revealed. He wears "
            "the men's boxer briefs from reference image 2: dark charcoal with a wide "
            "flat elasticated waistband. Barefoot, one foot on the stool rung. Relaxed "
            "and natural, not stiffly posed. Strong directional side lighting with sharp "
            "contrast that sculpts the body and shows the fabric texture. "
            "IMPORTANT COMPOSITION: place the seated figure in the RIGHT third of the "
            "frame and leave the left half as clean empty grey backdrop for text. "
            "Full figure visible head to feet. " + BRAND)),

    # ── Banner 2 hero — value per product ──────────────────────────────────
    "hero-value-boxer": dict(
        refs=["boxer", "men_worn"], ar="4:5",
        prompt=(
            "Commercial catalogue photograph for a men's underwear brand, vertical 4:5. "
            "A fit athletic man photographed from mid-chest down to just below the knees. "
            "He wears the men's boxer briefs shown in reference image 1 — reproduce that "
            "garment exactly: charcoal grey body, wide flat black elasticated waistband, "
            "same seams and cut. Relaxed standing stance, arms loose at his sides. Dark "
            "moody studio lighting: a hard directional key light from the upper left, "
            "deep falloff into shadow, dark charcoal concrete wall behind him. The boxer "
            "briefs are the unmistakable focal point — crisply lit and sharp so the "
            "fabric weave, panel seams and waistband detail all read clearly, while the "
            "background stays dark and quiet. "
            "IMPORTANT COMPOSITION: the figure is centred and occupies only the middle "
            "50 percent of the frame width, leaving wide empty dark background down both "
            "the left and the right edges for text annotations. " + BRAND)),

    # ── Banner 3 — category tiles ──────────────────────────────────────────
    "cat-men": dict(
        refs=["men_worn", "boxer"], ar="9:16",
        prompt=(
            "Editorial fashion photograph, vertical 9:16. A confident young man with an "
            "athletic build stands against a plain mid-grey studio backdrop. He wears a "
            "clean white ribbed tank top and the dark charcoal boxer briefs from "
            "reference image 2. Self-assured, relaxed stance — weight on one leg, one "
            "hand loosely at his side and the other resting near his waist, shoulders "
            "open, head turned slightly toward camera with a calm, direct, quietly "
            "confident expression. Strong contrast studio lighting from the side that "
            "sculpts the body and separates him from the backdrop. Framed from the top "
            "of the head to mid-thigh. Modern, cool, editorial — natural confidence, not "
            "overly posed or smiling. " + BRAND)),

    "cat-kids": dict(
        refs=["kid_worn", "kids"], ar="9:16",
        prompt=(
            "Bright children's apparel catalogue photograph, vertical 9:16. A cheerful "
            "boy about nine years old stands against a plain light grey studio backdrop. "
            "He wears a clean white cotton t-shirt and the navy boxer briefs from "
            "reference image 2. Natural, lively, age-appropriate pose — standing "
            "comfortably with hands lightly on his hips, a genuine happy smile, looking "
            "straight at the camera with an easy, playful energy. Clean even studio "
            "lighting with soft, gentle contrast. Framed from the top of the head to "
            "mid-thigh. Wholesome, friendly, professional kidswear catalogue "
            "photography. Palette of white, grey and navy only. Photorealistic, high "
            "detail.")),
}


def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    cache_path = f"{OUT}/uploads.json"
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}
    for k, p in REFS.items():
        if k not in cache:
            cache[k] = kie.upload(p)
            print(f"  uploaded {k}")
    json.dump(cache, open(cache_path, "w"), indent=2)

    jobs = {k: v for k, v in JOBS.items() if not only or k in only}
    tasks = {}
    for name, spec in jobs.items():
        tid = kie.create(MODEL, {
            "prompt": spec["prompt"],
            "image_input": [cache[r] for r in spec["refs"]],
            "aspect_ratio": spec["ar"],
            "resolution": "2K",
            "output_format": "png",
        })
        tasks[name] = tid
        print(f"  queued {name}: {tid}")

    for name, tid in tasks.items():
        try:
            urls = kie.result(tid, timeout=900)
            dest = f"{OUT}/{name}.png"
            kie.download(urls[0], dest)
            print(f"  ✓ {name} -> {dest}")
        except Exception as e:
            print(f"  ✗ {name}: {e}")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
