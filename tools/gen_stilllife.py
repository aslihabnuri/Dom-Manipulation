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
    "vertical 4:5. THREE DIFFERENT STYLES of men's underwear are shown, one of "
    "each, and their silhouettes must be clearly distinguishable from one "
    "another:\n"
    "- LEFT, on the lowest plinth: a pair of BRIEFS. No leg at all, high-cut leg "
    "openings, the shortest and most compact silhouette of the three.\n"
    "- CENTRE, on the tallest plinth, largest in frame: a pair of BOXER BRIEFS. "
    "A long fitted leg that extends well down the thigh, clearly the longest leg "
    "of the three.\n"
    "- RIGHT, on a mid-height plinth: a pair of TRUNKS. A short square-cut leg "
    "that stops high on the thigh, obviously shorter than the boxer briefs in the "
    "centre but unlike the briefs it still has a leg.\n"
    "All three are displayed as if worn, with no body and no mannequin visible — "
    "a ghost mannequin effect — so each holds its full three-dimensional shape, "
    "filled and rounded rather than folded flat. They stand in a shallow arc, "
    "each on a slim pale grey cylindrical plinth. Every wide flat elasticated "
    "waistband faces the camera and reads crisply. Reproduce the fabric, panel "
    "seams and waistband styling of the garments in the reference images, "
    "rendered in solid black. "
    "No props of any kind: no books, no plants, no boxes, nothing but the three "
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
