# Toni Black "Made for Every Body" Banner

2:3 banner (1600×2400; retina 3200×4800). One message in one picture: four men of different builds, slim to big, standing shoulder to shoulder in the same black Toni Black boxer on the BAU set, so the lineup itself shows the size range. The sizes S to XXXL run under their feet like a scale, and the six product benefits sit beneath as an icon row.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Every-Body-Banner_1600x2400.jpg/.png` | Upload size |
| `TONI-BLACK_Every-Body-Banner_3200x4800.jpg` | Retina |
| `photo_generated.jpg` / `photo_graded-BAU.jpg` | Group photo before and after the BAU colour match (strength 0.6) |

## Concept (why a lineup)
Show, don't claim. A line of real-looking bodies wearing the same product communicates "for everyone" faster than any sentence, and the order (slim to big) doubles as the size scale. Faces look straight at the camera, calm and at ease: no shame and no caricature, in line with the brand's "calm confidence".

## Typography (decisions by rule)
- **One centre axis.** The subject is a symmetrical lineup, so logo, headline, subline, size run and icon row all sit on the centre axis.
- **Three groups, three fields.** Headline and subline on the clean wall above the heads; the size run on the floor directly under the feet; the icon row on the floor below. Wall and floor are extended locally (stretched edge rows, feathered) so no group touches the figures. The 4:5 draft was rejected because the subline hit the heads and the size run crossed the ankles.
- **Headline from the measure.** `MADE FOR / EVERY BODY.` fitted to 70% of the width, Zalando Sans Expanded Black, leading 1.0; `EVERY BODY.` carries the double meaning.
- **Subline.** `One fit for every shape. Sizes S to XXXL.` Arimo Regular, gap 2x its leading, Davi's Grey.
- **Size run as a scale.** Six sizes on six equal cells across the measure, Zalando SemiBold 34 px tracked, aligned with the icon cells below so the two rows share one grid.
- **Icon row.** Six charcoal discs with white line icons, tracked-caps labels, two lines where needed, no hyphen at a line break.

## Pipeline
1. `prompts/prompt_every.txt` with Nano Banana Pro, `aspect_ratio 4:5`, 2K, three references: the Toni Black model, the men's boxer, the BAU photo (set, light, grade). First generation.
   `prompts/prompt_every2.txt`: the re-shoot used in the final. Same four men, spaced apart, wide grounded stances, arms crossed / hands on hips / thumbs in the waistband, direct serious gaze. `prompts/prompt_every3c.txt`: the final photography pass on top of it. Camera at waist height (low angle reads dominant), hard window key from camera-left with low fill so the light sculpts the bodies, rim on the shoulders, spacing kept, hands given a job per man (thumbs in waistband, arms folded high, fists on the waistband, hand on the neck), chin level, eyes narrowed, no eye contact between the men. Four generations in total.
2. `scripts/grade.py`: colour match to the BAU photo, local.
3. `scripts/compose.py PHOTO OUT [scale] [head_y] [run_y] [icon_y]` (final: `1 0.075 0.80 0.855`).
4. `scripts/icons.py`, `scripts/logo.py` (vector rebuild; swap in the official logo before print).
