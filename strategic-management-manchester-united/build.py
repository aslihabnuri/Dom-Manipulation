#!/usr/bin/env python3
"""Build the Strategic Management presentation (32 slides, 16:9)."""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pptx import Presentation
from pptx.util import Inches
from deck_lib import Deck, SW, SH
import part_a, part_b

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "Kelompok 4 - Strategic Management - Chapter 4 & Manchester United.pptx")


def main():
    prs = Presentation()
    prs.slide_width = Inches(SW)
    prs.slide_height = Inches(SH)

    builders = part_a.SLIDES_A + part_b.SLIDES_B
    assert len(builders) == 32, "expected 32 slides, got %d" % len(builders)

    d = Deck(prs, len(builders))
    for fn in builders:
        fn(d)

    cp = prs.core_properties
    cp.title = "Evaluating a Company's Resources and Competitive Position"
    cp.subject = "Strategic Management - Chapter 4 & Manchester United case"
    cp.author = "Kelompok 4"
    cp.comments = ("Fitra Aidila, Aulia Sisca Rahmadiyanti, Bagaskoro, "
                   "Imam Prayudha, Tegar Awanto")

    prs.save(OUT)
    print("saved:", OUT)
    print("slides:", len(prs.slides.__iter__.__self__._sldIdLst))
    return OUT


if __name__ == "__main__":
    main()
