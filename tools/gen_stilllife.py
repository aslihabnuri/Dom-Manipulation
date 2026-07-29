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
    "Bright, clean commercial product photograph for a men's underwear brand, "
    "vertical 4:5. Three black garments are displayed as if worn, with no body "
    "and no mannequin visible — a ghost mannequin effect — so each one holds its "
    "full three-dimensional shape, filled and rounded rather than folded flat. "
    "In the centre and slightly larger stands a pair of boxer briefs seen "
    "front-on; a pair of briefs stands to its left and a second pair of boxer "
    "briefs to its right, each raised on a slim pale grey cylindrical plinth of a "
    "different height, arranged in a shallow arc. The wide flat elasticated "
    "waistbands face the camera and read crisply. Reproduce the cut, panel seams "
    "and waistband of the garments in the reference images exactly, rendered in "
    "solid black. "
    "No props of any kind: no books, no plants, no boxes, nothing but the "
    "garments and their plinths. Seamless off-white studio background, soft even "
    "light from the upper left, delicate natural contact shadows on the ground. "
    "IMPORTANT COMPOSITION: the top third of the frame and the bottom sixth are "
    "completely empty background with nothing in them, reserved for text. The "
    "garments occupy only the middle band. The photograph bleeds to all four "
    "edges: no bars, no borders, no letterboxing. "
    "Black and white photograph, no colour at all. Calm, premium, understated. "
    "Photorealistic, high detail, sharp fabric texture, professional e-commerce "
    "product photography.")

tid = kie.create("nano-banana-pro", {"prompt": prompt, "image_input": refs,
                                     "aspect_ratio": "4:5", "resolution": "2K",
                                     "output_format": "png"})
print("queued", tid)
kie.download(kie.result(tid, timeout=900)[0], f"{OUT}/still-life.png")
print("done")
