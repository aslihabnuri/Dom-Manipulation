# Toni Black Category Banner (Men / Kids)

Portrait banner (2:3, same family as the 9.9 and BAU banners). One photograph: the Toni Black model and a boy reclining side by side in two teak slatted lounge chairs (the chair type from the "Referensi Banner Category" reference), outdoors on a travertine pool deck beside a calm pool, with a plain white wall and pale sky behind them, both in Toni Black products from the Drive product folders. A beach version is included as an alternative.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Category-Banner_Pool_2160x3240.png/.jpg` | Primary, retina / print-ready |
| `TONI-BLACK_Category-Banner_Pool_1080x1620.jpg` | Primary, feed / marketplace upload |
| `TONI-BLACK_Category-Banner_Beach-Alt_2160x3240.jpg` | Beach alternative, same layout with labels in the sky |
| `photo_pool_generated.jpg` / `photo_pool_graded.jpg` | Pool photo before and after the BAU skin/colour match (strength 0.5) |
| `photo_beach_generated.jpg` | Beach photo |

## Products (from Drive)
- Man: white Toni Black tank top (`Tanktop/TNB 5 gm.jpg`), black men's boxer (`Boxer dewasa/2.png`: wide black waistband, `TONI BLACK` embossed tone-on-tone).
- Boy: white Toni Black T-shirt (`Crewneck/TNB 6 gm.jpg`), black kids' boxer (`Boxer anak/2.png`: plain covered waistband, small white Toni Black icon on the right hip).

## Layout
- Logo alone top-left, sitting in the pale sky.
- Category labels on the white pool wall, the cleanest plane in the picture: `MEN` on the left margin above the man, `KIDS` on the right margin above the boy, one baseline, Zalando Sans Expanded Black 120 px, Dark Charcoal `#282828`. The sky above stays empty as a margin; the labels never cross the wall edge or the water line.
- Only the two words the brief asked for; no sublines, no lines, no overlays. Photo full-bleed.

## Pipeline
1. Studio composition first (`prompts/prompt_category.txt`, five references: chair/pose reference, model, men's boxer, kids' boxer, BAU photo), then the approved composition was moved outdoors with `prompts/prompt_cat_pool.txt` / `prompt_cat_beach.txt` (first reference = the approved studio photo, then model and both products), keeping people, poses, chairs and products.
2. `scripts/grade.py`: skin-tone and grade match to the BAU photo (strength 0.5), local, no credits.
3. `scripts/compose.py PHOTO OUT 2 0.215 120 - nosub` (pool) or `... 0.10 120 - nosub` (beach).
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/`.
