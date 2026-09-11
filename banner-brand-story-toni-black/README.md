# Toni Black Brand Story Banner

4:5 banner (1600×2000; retina 3200×4000), remade from the earlier `Banner_Brand Story`: same pose (white tee pulled over the head on a tall wooden stool), now with the Toni Black model, the real products, and the set, light and colour grade of the BAU banner. The `Discover Toni Black` call-to-action is removed as requested.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Brand-Story-Banner_1600x2000.jpg/.png` | Upload size (same as the previous banner) |
| `TONI-BLACK_Brand-Story-Banner_3200x4000.jpg` | Retina |
| `photo_generated.jpg` / `photo_graded-BAU.jpg` / `photo_graded-BAU_cutout.png` | Photo as generated, after the BAU colour match (strength 0.7), and its subject cutout |

## Photograph
One Nano Banana Pro pass, five references in order: the old banner (pose only), the Toni Black model, the black men's boxer (`Boxer dewasa/2.png`), the white crew-neck tee (`Crewneck/TNB 6 gm.jpg`), the BAU photo (set, light, grade). Framed with the subject in the right two-thirds so the left third is clean wall for the typography.

## Typography (decisions by rule)
- **Knockout headline, as in the original.** `TAILORED FOR / COMFORT.` is centred and runs across the figure at hip height (47%); it is Dark Charcoal on the wall and turns Clean White exactly where it overlaps the subject, using the cutout mask as the colour boundary. Two brand colours only, as the brand guideline's black-on-white / white-on-black rule prescribes. The switch keeps every letter at high contrast on both backgrounds.
- **Size from the measure.** `TAILORED FOR` is fitted to 86% of the width; `COMFORT.` is the shorter second line (natural rag, no widow). Zalando Sans Expanded Black, leading 1.0, tracking -4.
- **Subline as its own group.** Arimo Regular, 1/6 of the headline cap height (min 30 px), two centred lines, leading 1.5, gap to the headline 2x its own leading; Davi's Grey on the wall, light grey over the subject.
- **Axes.** Headline and subline share the centre axis; the logo sits alone top-left on clean wall, clear of the raised arms (top-centre was rejected because the arms and shirt rise into it).
- **Hierarchy.** Headline (Black, caps) > subline (Regular, sentence case). No call-to-action.

## Pipeline
1. `prompts/prompt_story.txt` with Nano Banana Pro, `aspect_ratio 4:5`, 2K.
2. `scripts/grade.py`: colour match to the BAU photo, local, no credits.
3. `scripts/compose.py PHOTO CUTOUT OUT [scale] [head_y] [width_frac]` (final: `1 0.47 0.86`, `2 0.47 0.86`). Subline set at 0.40 of the headline cap height (about 44 px at 1600 wide, `sub_scale` in `build`), leading 1.5, so it stays legible at thumbnail size.
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.
