# Toni Black Category Banner (Men / Kids)

Landscape banner (3:2), following the "_ (1)" lifestyle reference: a candid late-afternoon beach moment on a striped blanket, shot to look like real 35mm film rather than a studio render. The Toni Black model and a boy, both in Toni Black products from the Drive product folders, with the products kept sharp and clearly visible.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Category-Banner_3240x2160.png/.jpg` | Retina / print-ready |
| `TONI-BLACK_Category-Banner_2160x1440.jpg` | Web / marketplace upload |
| `photo_beach_lifestyle.jpg` | Final photo, no typography |
| `photo_beach_lifestyle_tight-alt.jpg` | Tighter first framing (no room for type on the right) |

## Products (from Drive)
- Man: white Toni Black tank top, black men's boxer (`Boxer dewasa/2.png`: wide black waistband, `TONI BLACK` embossed tone-on-tone).
- Boy: white Toni Black T-shirt, black kids' boxer (`Boxer anak/2.png`: plain covered waistband, small white Toni Black icon on the right hip).

## Photography direction (naturalness)
Candid, not posed: the man leaning back on one arm talking toward the sea, the boy laughing off-frame; sunglasses, newspaper, oranges, water bottle as honest props; warm low sun with real cast shadows; 35mm lens, shallow depth of field; film grain, natural skin texture, no plastic smoothing. The frame was then widened so the pair sits in the left two-thirds and the right third is untouched sand, which is where the typography goes.

## Layout
- Logo alone top-left in the clean sky band; nothing shares its row.
- `MEN` on the sand beside the man, `KIDS` on the clean sand at the right, both on one baseline at 63% height, Zalando Sans Expanded Black, Dark Charcoal `#282828` on pale sand. Only the two words the brief asked for; no lines, no overlays, no gradients.
- Two axes: logo and `MEN` on the left margin, `KIDS` on the right margin. The blanket and the props stay uncovered.

## Pipeline
1. `prompts/prompt_beach_life.txt` with Nano Banana Pro at 3:2, five references: the lifestyle reference, the Toni Black model, men's boxer, kids' boxer, the previous approved pair photo (same boy).
2. `prompts/prompt_life_wide.txt`: re-frame of the chosen candidate with the right third kept as clean sand (first reference = the candidate).
3. `scripts/compose.py PHOTO OUT 2 104 0.63`: typography with the brand fonts (`scale 2` gives 3240×2160).
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/`.
