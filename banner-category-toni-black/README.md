# Toni Black Category Banner (Men / Kids)

1200 px wide banner (1200×1070; retina 2400×2140). Structure follows the earlier Toni Black `Banner_Category`: white top band with the centred logo, a 3:2 lifestyle photograph, white bottom band with `MEN` (left) and `KIDS` (right).

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Category-Banner_1200x1070.jpg/.png` | Upload size (width 1200) |
| `TONI-BLACK_Category-Banner_2400x2140.jpg` | Retina |
| `photo_beach_medium-shot.jpg` | Photo without typography |

## Photograph
Follows the "_ (1)" lifestyle reference in what actually makes it read as a real photo: camera at blanket level close to the subjects (medium shot, cropped at the shins), large foreground props partly cut by the frame (oranges, newspaper, bottle), out-of-focus colourful umbrellas, loungers and beachgoers behind, backlit late sun with rim light and haze, film grain, natural skin, sand and creases. The man and the boy laugh together, asymmetrical and mid-moment.

Products only, from Drive: the man in the Toni Black white tank top and black men's boxer (wide black waistband, `TONI BLACK` embossed tone-on-tone); the boy in the Toni Black white T-shirt and black kids' boxer (plain covered waistband, small white icon on the right hip). Both stay sharp and lit.

## Layout
- Top band 120 px: logo centred, alone.
- Photo 1200×800, full width, no text on the image.
- Bottom band 150 px: `MEN` left margin, `KIDS` right margin, Zalando Sans Expanded Black 64 px, Dark Charcoal `#282828`, one baseline. Only the two words.

## Pipeline
1. `prompts/prompt_life_close.txt` with Nano Banana Pro at 3:2 (2K), five references: the lifestyle reference, the Toni Black model, men's boxer, kids' boxer, the previous pair photo (same boy). One generation.
2. `scripts/compose.py PHOTO OUT [scale] [photo_shift]`: band layout with the brand fonts.
3. `scripts/logo.py`: vector rebuild of the logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/`.
