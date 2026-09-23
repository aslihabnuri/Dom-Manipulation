# Toni Black Payday Sale Banner

Portrait 2:3, same structure as the 9.9 banner: full-bleed photo, logo top-left, one centred lockup on the model, one CTA at the bottom.

| File | Use |
|---|---|
| `final/TONI-BLACK_Payday-Banner_1080x1620.jpg/.png` | Feed / marketplace |
| `final/TONI-BLACK_Payday-Banner_2160x3240.jpg/.png` | Retina / print |
| `final/photo_generated.jpg` | Untouched generated photo |
| `final/photo_graded-9.9.jpg` | Photo after the 9.9 grade |

## Concept
The reference ("Referensi Payday") looks out of a washing machine drum: the round door is a porthole and the man stands in the laundry room beyond it. Kept as is, because the porthole does the framing work a designer would otherwise have to add: it is a natural spotlight, and the figure inside it is small enough that the type can sit on the body without touching the busy room. Changes for the brand: the man is the Toni Black model wearing the Toni Black boxer brief, the garment caught on the door rim is a second Toni Black boxer brief with the waistband readable, no socks, and the yellow tiles became pale grey so the room sits inside the brand palette (Dark Charcoal, Steel Grey, Clean White) before the grade.

## Typography
- Lockup centred on the chest, as in 9.9: `PAYDAY SALE` (eyebrow, tracked caps) / `SAVE UP TO` / `45%` / `Free shipping` / `Extra IDR 5K voucher` / `for new buyers`. `45%` is the single dominant element, Zalando Sans Expanded Black, fitted to 440 px, the width of the figure, so it stays on the skin and the product and never crosses the white machine or the pale tiles behind him, where white type would die.
- Benefits in Arimo, three short lines so they stay inside the body width.
- `SHOP NOW` pill and terms at the bottom on the drum steel, with the same soft bottom gradient as 9.9.
- Logo top-left on the drum ring. Fonts and colours per the brand guideline; logo is the vector rebuild (`scripts/logo.py`), swap in the official file before print.

## Pipeline
1. `prompts/prompt_payday.txt` with Nano Banana Pro, `aspect_ratio 2:3`, 2K, four references in order: the Payday reference (composition), the Toni Black model (identity), the men's boxer (`Boxer dewasa/2.png`, product), the 9.9 photo (look). One generation.
2. `scripts/grade.py`: skin tone and global grade transferred from the 9.9 photo (strength 0.6), local.
3. `scripts/compose.py PHOTO OUT [scale] [hero_y] [bigw]` (final: `1 0.21 440`, `2 0.21 440`).
