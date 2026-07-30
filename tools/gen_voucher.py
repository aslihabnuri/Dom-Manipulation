#!/usr/bin/env python3
"""Hero photograph for the discount banner, 2:1.

The client's own pose reference goes in as an image_input alongside the product
cutouts, so the reclining pose comes from their file rather than a description.

Composed for the layout rather than the other way round. The first version put the
figure in the right 58 percent with the left 40 percent empty, which left exactly
one place to put type and is why the copy ended up stacked down the left edge.
This one keeps him compact and centred so there is a clean plane on BOTH sides —
the offer can sit left, the action right, the logo above him.
"""
import os, sys, shutil
sys.path.insert(0, os.path.dirname(__file__))
import kie

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
OUT = f"{SCR}/gen"

refs = [kie.upload(f"{SCR}/ref/pose-voucher.png"),      # 1 — pose
        kie.upload(f"{SCR}/src/crewneck.jpg"),          # 2 — white crewneck
        kie.upload(f"{SCR}/gm/boxer.png")]              # 3 — black boxer

prompt = (
    "Commercial lifestyle photograph for a men's underwear brand, wide 16:9. "
    "Reproduce the POSE in reference image 1 exactly: a man in his late twenties "
    "reclining on his side on a bed of crisp pale bedding, propped up on one "
    "elbow with that hand resting against his temple and hair, head tilted toward "
    "the camera, relaxed and easy with a warm natural half-smile, legs bent and "
    "stacked one over the other. "
    "He wears a plain WHITE crewneck cotton t-shirt, the garment in reference "
    "image 2, and BLACK boxer briefs with a short leg and a wide flat elasticated "
    "waistband, the garment in reference image 3. "
    "THE BLACK BOXER BRIEFS ARE THE HERO PRODUCT and must be the most clearly "
    "readable thing in the picture. The white t-shirt is pushed and rolled well UP, "
    "its hem sitting high across his lower ribs, so the ENTIRE boxer brief is "
    "exposed and completely unobstructed: no shirt fabric falls over the waistband, "
    "over the hip or over the front of the garment, and no hand, forearm or bedding "
    "covers any part of it. He is rolled toward the camera at the hips so the FRONT "
    "of the boxer briefs faces the lens rather than being seen edge-on, while his "
    "knees stay drawn up and stacked and his feet stay tucked in behind him, so the "
    "garment turns toward the camera without his body spreading sideways. The boxer "
    "briefs sit near the centre of the picture. Light it deliberately: the "
    "wide flat elasticated waistband crisp and fully visible across its whole width "
    "with the TONI BLACK wordmark on it legible, the panel seams and the short leg "
    "hems sharp, the black fabric holding its texture and reading as a distinct "
    "solid black shape against the pale bedding. It should occupy a generous part of "
    "the frame. "
    "Bright airy bedroom set: pale rumpled bedding, soft daylight raking across "
    "him. Light the white t-shirt with clear directional modelling so it separates "
    "from the pale bedding rather than merging into it: visible folds, soft shadow "
    "along the near side. Keep the t-shirt secondary to the boxer briefs: it should "
    "not become the largest or brightest mass in the picture. "
    "IMPORTANT COMPOSITION — he is CENTRED and LARGE in the frame but horizontally "
    "COMPACT. Vertically he commands the picture: the top of his head sits just below "
    "the top of the frame and his hip and folded legs reach down into the lower third, "
    "so he reads clearly and the black boxer briefs are unmistakable. Horizontally he "
    "is contained. State it as measurements, because this matters as much as the "
    "product does: the bed is very wide and he lies in the middle of it, and the "
    "picture is framed so that his SILHOUETTE BEGINS about 30 percent of the way "
    "across the width and ENDS about 72 percent of the way across. Everything from "
    "the left edge to that 30 percent mark is nothing but plain empty bedding below "
    "and plain empty wall above. Everything from the 72 percent mark to the right "
    "edge is the same. His feet are tucked in close behind his thighs and his legs "
    "never straighten or extend; no foot, knee, elbow, hand or pillow reaches out "
    "into either of those empty margins, and no part of him is cut off by any edge. "
    "Plain empty wall stands above and behind his head. "
    "The bed and the wall are ONE CONTINUOUS SURFACE filling the entire picture from "
    "the far left edge to the far right edge and from top to bottom. This is a single "
    "uninterrupted photograph of one room: there must be no panel, no band, no "
    "border, no inset, no vignette, no seam and no change of tone along any vertical "
    "line. The bedding sweeps unbroken right off both side edges of the picture. "
    "That surrounding bedding and wall must stay smooth, flat and featureless: NO "
    "window, NO window frame, NO grid or mullion pattern, no headboard, no furniture, "
    "no spare pillows, no strong creases, no cast shadows. Put the window and any "
    "daylight source off-frame. The photograph bleeds to all four edges: no bars, no "
    "borders, no letterboxing, no framing device of any kind. "
    "Black and white photograph, no colour at all. Calm, premium, understated, "
    "the same register as an editorial menswear campaign. Photorealistic, high "
    "detail, natural skin texture, sharp fabric texture.")

tid = kie.create("nano-banana-pro", {"prompt": prompt, "image_input": refs,
                                     "aspect_ratio": "16:9", "resolution": "2K",
                                     "output_format": "png"})
print("queued", tid)

# Keep every take. Overwriting the one filename threw away a plate whose
# composition was better than its replacement's, and the only way back was to
# pay for another roll.
n = 1 + max([int(f.split("-v")[1].split(".")[0])
             for f in os.listdir(OUT) if f.startswith("voucher-hero-v")] or [0])
kie.download(kie.result(tid, timeout=900)[0], f"{OUT}/voucher-hero-v{n}.png")
shutil.copy(f"{OUT}/voucher-hero-v{n}.png", f"{OUT}/voucher-hero.png")
print(f"done -> voucher-hero-v{n}.png")
