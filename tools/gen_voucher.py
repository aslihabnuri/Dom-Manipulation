#!/usr/bin/env python3
"""Hero photograph for the discount banner, 2:1.

The client's own pose reference goes in as an image_input alongside the product
cutouts, so the reclining pose comes from their file rather than a description.
"""
import os, sys
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
    "waistband, the garment in reference image 3. The t-shirt rides up slightly at "
    "the waist so the waistband shows. "
    "Bright airy bedroom set: pale rumpled bedding, soft daylight raking across "
    "him. Light the white t-shirt with clear directional modelling so it separates "
    "from the pale bedding rather than merging into it: visible folds, soft shadow "
    "along the near side. "
    "IMPORTANT COMPOSITION: the figure lies in the RIGHT 58 percent of the frame, "
    "his head roughly 45 percent across. The LEFT 40 percent must be completely "
    "clean and empty — plain smooth pale bedding and a plain pale wall behind it, "
    "with NO window, NO window frame, NO grid or mullion pattern, no headboard, no "
    "furniture, no pillows, no folds of note. Put the window and any daylight "
    "source off-frame to the right, behind him. That empty left area is reserved "
    "for text and must stay flat and uncluttered. The photograph bleeds to all "
    "four edges: no bars, no borders, no letterboxing. "
    "Black and white photograph, no colour at all. Calm, premium, understated, "
    "the same register as an editorial menswear campaign. Photorealistic, high "
    "detail, natural skin texture, sharp fabric texture.")

tid = kie.create("nano-banana-pro", {"prompt": prompt, "image_input": refs,
                                     "aspect_ratio": "16:9", "resolution": "2K",
                                     "output_format": "png"})
print("queued", tid)
kie.download(kie.result(tid, timeout=900)[0], f"{OUT}/voucher-hero.png")
print("done")
