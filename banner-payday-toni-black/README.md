# Toni Black Payday Sale Banner

Portrait 2:3, same structure as the 9.9 banner: full-bleed photo, logo top-left, one centred lockup on the model, one CTA at the bottom.

| File | Use |
|---|---|
| `final/TONI-BLACK_Payday-Banner_1080x1620.jpg/.png` | Feed / marketplace |
| `final/TONI-BLACK_Payday-Banner_2160x3240.jpg/.png` | Retina / print |
| `final/photo_generated.jpg` | Untouched generated photo |
| `final/photo_graded-9.9.jpg` | Photo after the 9.9 grade |

## Concept
The reference ("Referensi Payday") is kept whole: the view from inside the drum through the round door, the mustard tiles, the white tiled floor, the warm tungsten light and the 35mm film grain. Only the brand facts change: the body is the Toni Black model, the white boxers are the Toni Black boxer brief, the blue sock on the door rim is a second Toni Black boxer brief with its waistband readable, no socks. The 9.9 cool grade was not applied: it would have erased the ambience the reference is chosen for.

## Typography: three zones, not one block
- **Zone 1, drum ring, top-left:** the logo alone.
- **Zone 2, the torso inside the porthole:** the hero only, `PAYDAY SALE` / `SAVE UP TO` / `45%`, white, centred on the opening. `45%` is Zalando Sans Expanded Black fitted to 500 px, the single dominant element. A soft lens vignette inside the porthole (a photographic falloff, not a box or a band) gives the tiles enough depth for white type and pulls the eye to the figure.
- **Zone 3, drum floor, footer:** benefits bottom-left (`Free shipping`, `Extra IDR 5K voucher for new buyers`, Arimo 30), `SHOP NOW` pill bottom-right, both on one baseline; terms under the benefits in Steel Grey. Same soft bottom gradient as 9.9.
Three groups, three places, each on its own field; the gaps between groups are many times larger than the leading inside them.

## Pipeline
1. `prompts/prompt_payday2.txt` with Nano Banana Pro, `aspect_ratio 2:3`, 2K, references in order: the Payday reference (composition and ambience), the Toni Black model (identity), the men's boxer (`Boxer dewasa/2.png`). One generation for this version (`prompts/prompt_payday.txt` was the first, greyer attempt, dropped).
2. `scripts/compose.py PHOTO OUT [scale] [hero_y] [bigw]` (final: `1 0.235 500`, `2 0.235 500`). No grade.
