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
- **Axis.** One left-margin axis for the headline and the subline; the logo alone on the centre axis at the top, as in the BAU banner. Two axes only.
- **Headline size from the column.** `TAILORED FOR` is fitted to the clean column (52% of the width minus the margin), so the stack never enters the body; `COMFORT.` is the shorter second line (no widow, natural rag). Zalando Sans Expanded Black, leading 1.0.
- **Subline as its own group.** Arimo Regular, size 1/6 of the headline cap height (min 30 px), two lines, leading 1.5, Davi's Grey; its gap to the headline is 2x its own leading, so it reads as a separate group on the same axis (proximity), not as a third headline line.
- **Hierarchy.** Headline (Black, caps) > subline (Regular, sentence case, grey). No third element: the CTA is removed and the offer system of the BAU banner does not apply to a brand-story piece.
- **Position.** The stack starts at 40% height, at the model's waist, so the eye moves from the revealed torso to the headline and down the subline; the subject stays completely unobstructed.

## Pipeline
1. `prompts/prompt_story.txt` with Nano Banana Pro, `aspect_ratio 4:5`, 2K.
2. `scripts/grade.py`: colour match to the BAU photo, local, no credits.
3. `scripts/compose.py PHOTO OUT [scale] [col_frac] [head_y] [cutout]` (final: `1 0.52 0.40 cutout.png`, `2 ...`).
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.
