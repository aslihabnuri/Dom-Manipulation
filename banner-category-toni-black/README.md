# Toni Black Category Banner (Men / Kids)

Portrait banner (2:3, same family as the 9.9 and BAU banners). One photograph: the Toni Black model and a boy seated side by side on the cream boucle bench from the BAU set, both in Toni Black products from the Drive product folders.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Category-Banner_2160x3240.png/.jpg` | Retina / print-ready |
| `TONI-BLACK_Category-Banner_1080x1620.jpg` | Feed / marketplace upload |
| `photo_01_generated.jpg` | First generation (seated pair, white tank + white tee, black boxers) |
| `photo_02_products-fixed.jpg` | After the two product edits (kids' boxer: covered waistband, white T icon at the hip) |
| `photo_03_graded.jpg` | After the skin/colour match to the BAU banner photo |

## Products (from Drive)
- Man: white Toni Black tank top (`Tanktop/TNB 5 gm.jpg`), black men's boxer (`Boxer dewasa/2.png`: wide black waistband, `TONI BLACK` embossed tone-on-tone).
- Boy: white Toni Black T-shirt (`Crewneck/TNB 6 gm.jpg`), black kids' boxer (`Boxer anak/2.png`: plain covered waistband, small white Toni Black icon on the right hip).

## Layout
- Logo alone top-left with its exclusion zone.
- One header row of category labels in the empty wall above the figures: `MEN` on the left margin above the man, `KIDS` on the right margin above the boy, Zalando Sans Expanded Black, one baseline, spacing balanced between logo above and heads below. Only the two words the brief asked for; no sublines, no lines, no overlays.
- Type in Dark Charcoal `#282828`. Photo full-bleed.

## Pipeline
1. `prompts/prompt_cat.txt` with Nano Banana Pro, four references in order: pose/mood (Referensi Banner Category), Toni Black model, men's boxer product, BAU photo for the skin glow and grade. 2K, 2:3.
2. `prompts/prompt_cat_product.txt`: edit pass swapping the boy's boxer for the kids' product (adds the hip icon).
3. `prompts/prompt_cat_waist.txt`: edit pass giving the kids' boxer its plain covered waistband.
4. `scripts/grade.py`: skin-tone and grade match to the BAU photo (strength 0.7), local, no credits.
5. `scripts/compose.py PHOTO OUT 2 0.122 100 - nosub`: typography with the brand fonts.
6. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/`.
