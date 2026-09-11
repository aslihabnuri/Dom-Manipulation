# Toni Black Product Value Banner

1600×2000 (retina 3200×4000), remade from the earlier `Banner_Product Value` without any generation credits: the original product photograph is kept, its old text and icon zones are rebuilt from the background gradient, the BAU colour grade is applied, the size range is updated to S, M, L, XL, XXL, XXXL, and the four feature icons are replaced by the six from the reference screenshot (Breathable, Odor Resistant, Ergonomic Fit, Moisture Wicking, 4-Way Stretch, Form Fitting), redrawn as clean line icons on charcoal discs.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Product-Value-Banner_1600x2000.jpg/.png` | Upload size (same as the previous banner) |
| `TONI-BLACK_Product-Value-Banner_3200x4000.jpg` | Retina |
| `photo_clean-background.jpg` / `photo_graded-BAU.jpg` | Product photo with the old text zones rebuilt, before and after the BAU grade |

## Typography (decisions by rule)
- **One centre axis.** The subject is symmetrical (three products on podiums), so every element sits on the centre axis: logo, headline, subline, size run, icon row. Symmetry in the image asks for symmetry in the type.
- **Headline size from the measure.** `BUILT FOR EVERYDAY` is fitted to 76% of the width; `PERFORMANCE` is the shorter second line. Zalando Sans Expanded Black, leading 1.0.
- **Subline as its own group.** Arimo Regular at ~1/5.5 of the headline cap height, gap 2x its leading (proximity), Davi's Grey.
- **Size run as a distinct level.** `Available in` stays in the subline face and grey; the sizes switch to Zalando Sans Expanded SemiBold, charcoal, with interpuncts as separators, so the run scans as one informational token rather than a sentence.
- **Icon row on a six-cell grid.** Equal cells across the measure, 118 px discs, labels in tracked caps (Zalando SemiBold 19 px, tracking 2, leading 1.45), two lines where the label is two words; no hyphen at a line break (`FORM` / `FITTING`).
- **Colour.** Charcoal type and discs on the light gradient, white strokes inside the discs: two brand colours only.

## Pipeline
1. Background rebuild: per-column linear interpolation between clean rows above and below the old header and footer zones.
2. `scripts/grade.py` global part (contrast +10%, chroma -12%, mild cool highlights) for the BAU look.
3. `scripts/icons.py`: the six icons drawn with PIL; `scripts/compose.py PHOTO OUT [scale]`.
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.
