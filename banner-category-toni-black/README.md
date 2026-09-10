# Toni Black Category Banner (Men / Kids)

1200 px wide full-bleed banner (1200×950; retina 2400×1900). No bands: the photo's hazy sky is extended upward locally to hold the typography, and the sub-categories from the earlier `Banner_Category` are kept (MEN: Brief, Boxer, Singlet; KIDS: Brief, Boxer). Colour grade matched to the 9.9 banner photo.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Category-Banner_1200x950.jpg/.png` | Upload size (width 1200) |
| `TONI-BLACK_Category-Banner_2400x1900.jpg` | Retina |
| `photo_beach_medium-shot.jpg` | Photo as generated |
| `photo_beach_medium-shot_graded-9.9.jpg` | Photo after the 9.9 colour match (skin transfer 0.8, cooler, less chroma, more contrast) |

## Photograph
Follows the "_ (1)" lifestyle reference in what actually makes it read as a real photo: camera at blanket level close to the subjects (medium shot, cropped at the shins), large foreground props partly cut by the frame (oranges, newspaper, bottle), out-of-focus colourful umbrellas, loungers and beachgoers behind, backlit late sun with rim light and haze, film grain, natural skin, sand and creases. The man and the boy laugh together, asymmetrical and mid-moment.

Products only, from Drive: the man in the Toni Black white tank top and black men's boxer (wide black waistband, `TONI BLACK` embossed tone-on-tone); the boy in the Toni Black white T-shirt and black kids' boxer (plain covered waistband, small white icon on the right hip). Both stay sharp and lit.

## Layout
- Full-bleed. The top 150 px is the photo's own sky, stretched upward and blurred, seam feathered, so the type sits on sky rather than on a white band.
- Logo top-left, alone on its row.
- One two-column row beneath it: `MEN` with `Brief · Boxer · Singlet` on the left margin, `KIDS` with `Brief · Boxer` on the right margin, one baseline, Zalando Sans Expanded Black 92 px + Arimo 26 px, Dark Charcoal `#282828` and Davi's Grey `#4F5052`. The row fills the sky zone; the heads, umbrellas and props start right below it.
- No lines, no overlays, no gradients.

## Pipeline
1. `prompts/prompt_life_close.txt` with Nano Banana Pro at 3:2 (2K), five references: the lifestyle reference, the Toni Black model, men's boxer, kids' boxer, the previous pair photo (same boy). One generation.
2. `scripts/grade.py`: colour match to the 9.9 banner photo (Reinhard skin transfer + global grade), local, no credits.
3. `scripts/compose.py PHOTO OUT [scale] [ext] [label_size]`: sky extension and typography (final: `1 150 92`, `2 150 92`).
4. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/`.
