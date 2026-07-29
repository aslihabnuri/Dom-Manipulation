#!/usr/bin/env python3
"""Generate the banner hero photography via Kie (nano-banana-pro).

Real Toni Black product shots are passed as reference images so the garments
stay accurate, and the brand's own website category photos are passed as style
references so the poses and black-and-white treatment match the real brand.
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
    "kids":     f"{SCR}/src/brief_kids_navy.png",
    "men_worn": f"{SCR}/photos/TPR_3096.JPG.jpg",
    "kid_worn": f"{SCR}/photos/ZAI_Kids_3.jpg.jpg",
    "style_men":  f"{SCR}/web/men.png",     # toni.black category photo — men
    "style_kids": f"{SCR}/web/kids.png",    # toni.black category photo — kids
}

# House style, lifted from the brand's own site photography.
BW = ("Black and white photograph, no colour at all. Soft even studio light on a "
      "seamless pale grey backdrop, gentle natural shadows. Relaxed, candid, "
      "editorial menswear feel: easy natural confidence, never stiff or posed, "
      "never a symmetrical standing catalogue pose. Photorealistic, high detail, "
      "natural skin texture, professional fashion photography.")

DARK = ("Black and white photograph, no colour at all. Dark moody studio lighting: "
        "a hard directional key light from the upper left carving out the muscles, "
        "deep shadow falloff, dark charcoal concrete wall behind. Athletic, powerful, "
        "editorial performance-apparel mood. Photorealistic, high detail, natural "
        "skin texture, professional fashion photography.")

CENTRE = ("IMPORTANT COMPOSITION: the figure is centred and occupies only the middle "
          "50 percent of the frame width, leaving wide empty dark background down "
          "both the left and the right edges for text annotations. The photograph "
          "must bleed to all four edges of the 4:5 frame: no black bars, no borders, "
          "no letterboxing, no frame inside the frame.")

JOBS = {
    # ── Banner 1 hero — brand story ────────────────────────────────────────
    "hero-brandstory": dict(
        refs=["crewneck", "boxer", "style_men"], ar="4:5",
        prompt=(
            "A lean athletic man in his late twenties perches on a simple dark wooden "
            "bar stool in a bright minimalist studio. He is mid-motion, casually peeling "
            "off a plain WHITE crewneck cotton t-shirt, the exact white shirt in "
            "reference image 1: both arms raised, the white shirt bunched over his head "
            "and face, his torso revealed. He wears BLACK boxer briefs, the garment in "
            "reference image 2 but in solid black. Loose, unforced posture like "
            "reference image 3: body angled away from square, torso twisting naturally, "
            "one bare foot hooked on the stool rung and the other leg stretched long to "
            "the floor, weight leaning slightly back. Caught in the middle of a real "
            "movement, relaxed and easy, not held or stiff. "
            "IMPORTANT COMPOSITION: place the seated figure in the RIGHT third of the "
            "frame and leave the left half as clean empty grey backdrop for text. Whole "
            "figure in frame. " + BW)),

    # ── Banner 2 heroes — value per product ────────────────────────────────
    "value-boxer": dict(
        refs=["boxer", "style_men"], ar="4:5",
        prompt=(
            "Commercial catalogue photograph for a men's underwear brand. A powerfully "
            "built athletic man photographed from mid-chest down to just below the "
            "knees, bare torso. He wears BLACK boxer briefs: same cut, seams and wide "
            "flat elasticated waistband as reference image 1, but in solid black. "
            "Athletic action stance, caught mid-movement: weight driven onto one leg, "
            "the other leg striding forward, hips rotated, abdominal and thigh muscles "
            "visibly engaged, one hand adjusting the waistband. The black boxer briefs "
            "are the unmistakable focal point, crisply lit so the fabric, seams and "
            "waistband read clearly against the darkness. " + CENTRE + " " + DARK)),

    "value-brief": dict(
        refs=["brief", "style_men"], ar="4:5",
        prompt=(
            "Commercial catalogue photograph for a men's underwear brand. A powerfully "
            "built athletic man photographed from mid-chest down to mid-thigh, bare "
            "torso, his body turned slightly so he is seen three-quarter on rather "
            "than square to the camera. He wears BLACK briefs: the same cut, seams "
            "and wide flat elasticated waistband as reference image 1, but in solid "
            "black. Athletic stance caught mid-movement: weight on the back leg, "
            "torso twisting toward the light, abdominal and oblique muscles visibly "
            "engaged, one arm raised and the other relaxed at his side. The black "
            "briefs are the unmistakable focal point, crisply lit so the fabric, "
            "seams and waistband read clearly against the darkness. " + CENTRE + " " + DARK)),

    "value-crewneck": dict(
        refs=["crewneck", "style_men"], ar="4:5",
        prompt=(
            "Commercial catalogue photograph for a men's apparel brand. A powerfully "
            "built athletic man photographed from the top of the shoulders down to the "
            "hips. He wears a plain WHITE crewneck cotton t-shirt, the exact garment in "
            "reference image 1: same crew collar, short sleeves, relaxed straight cut, "
            "solid white with no print or logo. Athletic stance caught mid-movement: "
            "torso rotated, shoulders open, one arm raised to run a hand through his "
            "hair and the other pulling lightly at the hem, chest and shoulder muscles "
            "filling out the shirt. The white t-shirt is the unmistakable focal point, "
            "lit so the cotton weave, collar rib, sleeve and shoulder seams all read "
            "clearly and brightly against the dark background. " + CENTRE + " " + DARK)),

    "value-tanktop": dict(
        refs=["tanktop", "style_men"], ar="4:5",
        prompt=(
            "Commercial catalogue photograph for a men's apparel brand. A powerfully "
            "built athletic man photographed from the top of the shoulders down to the "
            "hips. He wears a plain WHITE cotton tank top singlet, the exact garment in "
            "reference image 1: same scooped neckline, wide shoulder straps, straight "
            "cut, solid white with no print or logo. He faces the camera from the "
            "FRONT, chest and torso toward the lens, never seen from behind. Athletic "
            "stance caught mid-movement: torso rotated and leaning into the light, one "
            "arm raised overhead and the other flexed at his side, shoulder, arm and "
            "chest muscles clearly defined around the singlet. The "
            "white tank top is the unmistakable focal point, lit so the cotton weave, "
            "neckline binding and side seams all read clearly and brightly against the "
            "dark background. " + CENTRE + " " + DARK)),

    # ── Banner 3 — category tiles ──────────────────────────────────────────
    "cat-men": dict(
        refs=["style_men", "boxer", "tanktop"], ar="9:16",
        prompt=(
            "Match the photographic style, pose language and black-and-white treatment "
            "of reference image 1 exactly. An athletic man lounges back on a slim "
            "folding director's chair in a bright minimalist studio. He wears a plain "
            "WHITE cotton tank top singlet and BLACK boxer briefs, the garments in "
            "reference images 2 and 3 but in solid black and solid white. Loose, "
            "unforced, candid posture: leaning back into the chair, one arm draped over "
            "the backrest, legs crossed at the ankle and stretched out long, chin "
            "lifted slightly, a calm easy half-smile as if between shots. Nothing about "
            "him is stiff or symmetrical. Framed from the top of his head down to "
            "mid-shin so the whole relaxed pose reads. " + BW)),

    "cat-kids": dict(
        refs=["style_kids", "kid_worn", "kids"], ar="9:16",
        prompt=(
            "Match the photographic style, pose language and black-and-white treatment "
            "of reference image 1 exactly. A boy about nine years old plays in a bright "
            "minimalist studio, caught in a genuine candid moment: mid-laugh, head "
            "tipped back looking upward, one arm swung up in the air, weight on one foot "
            "as if turning on the spot. He wears a plain WHITE cotton t-shirt and BLACK "
            "boxer briefs, the garments in reference images 2 and 3 but in solid black. "
            "Joyful, lively and entirely natural, never posed or stiff. Framed from the "
            "top of his head down to mid-shin. Wholesome, friendly, professional "
            "kidswear catalogue photography. " + BW)),
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
            kie.download(urls[0], f"{OUT}/{name}.png")
            print(f"  ✓ {name}")
        except Exception as e:
            print(f"  ✗ {name}: {e}")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
