#!/usr/bin/env python3
"""Still-life hero for the product-value slide, in the style of the supplied
Flyman reference: garments staged on pale plinths in a bright, clean set."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import kie

SCR = "/tmp/claude-0/-home-user-Dom-Manipulation/9660e19d-0a17-5887-b846-45e4bff6dd11/scratchpad"
OUT = f"{SCR}/gen"

refs = [kie.upload(f"{SCR}/src/boxer_men_grey.png"),
        kie.upload(f"{SCR}/src/brief_men_grey.png")]

prompt = (
    "Bright, clean commercial still-life photograph for a men's underwear brand, "
    "vertical 4:5. Three folded garments are staged on pale grey plinths of "
    "different heights against a seamless off-white studio background: at the "
    "back a folded pair of men's boxer briefs, in the middle a second pair shown "
    "front-on with its wide flat elasticated waistband facing the camera, and at "
    "the front a pair of men's briefs. Reproduce the cut, panel seams and "
    "waistband of the garments in reference images 1 and 2 exactly, but render "
    "every garment in solid BLACK. "
    "One small prop only: a low stack of pale hardcover books on a plinth to the "
    "left. No plants, no cameras, no clutter. Soft, even, directional daylight "
    "from the upper left, gentle natural drop shadows on the plinths, no harsh "
    "highlights. Shot slightly above eye level at a three-quarter angle. "
    "Black and white photograph, no colour at all: black garments, pale grey "
    "plinths, off-white ground. Calm, premium, understated. "
    "IMPORTANT COMPOSITION: the arrangement sits in the lower two thirds of the "
    "frame with clean empty background above it. The photograph bleeds to all "
    "four edges: no bars, no borders, no letterboxing. "
    "Photorealistic, high detail, sharp fabric texture, professional product "
    "photography.")

tid = kie.create("nano-banana-pro", {"prompt": prompt, "image_input": refs,
                                     "aspect_ratio": "4:5", "resolution": "2K",
                                     "output_format": "png"})
print("queued", tid)
kie.download(kie.result(tid, timeout=900)[0], f"{OUT}/still-life.png")
print("done")
