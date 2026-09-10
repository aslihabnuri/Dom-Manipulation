# Toni Black BAU Banner

Portrait banner (2:3) for the always-on (BAU) promotion. The photo reproduces the "Referensi Banner BAU" pose (model reclining on a cream boucle sofa, hand to chin, plain off-white wall) with the Toni Black model's face and the real black Toni Black boxer (tone-on-tone embossed waistband), all in a single Nano Banana Pro pass with three references: pose, model, product.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_BAU-Banner_2160x3240.png/.jpg` | Save up to 25%, retina / print-ready |
| `TONI-BLACK_BAU-Banner_1080x1620.jpg` | Feed / marketplace upload |
| `model-photo_raw.jpg` | Untouched generated photo |
| `model-photo_graded-sheen.jpg` / `model-photo_graded-sheen_cutout.png` | Photo after the 9.9 colour match and skin-sheen edit, and its subject cutout |

## Layout (editorial grid, diagonal balance, no rules)
- 72 px margins, two vertical axes: the logo and the hero align to the left margin; the offer block aligns to the right margin.
- **Logo** alone at the top-left with its brand-guideline exclusion zone; nothing shares its row.
- **Hero**: `SAVE UP TO` sized so its width equals the display number (a justified lockup, not over-tracked), then `25%` in Zalando Sans Expanded Black spanning about 72% of the width. The model is cut out locally (rembg, no kie.ai credits) and layered in front, so the number runs behind the head, magazine-cover style, which fills the wall area without crowding the face. `Made to move with you.` (brand-guideline brand-story line) sits under the number in Davi's Grey.
- **Offer block, bottom-right on the sofa**: `Free shipping`, `Extra IDR 5K voucher for new buyers`, `SHOP NOW` pill, `*Terms & conditions apply`, all right-aligned. The legs at bottom-left stay uncovered.
- Type in Dark Charcoal `#282828` on the light scene; no lines, gradients or overlays.

## Pipeline
1. `scripts/kie.py` uploads the three references to kie.ai and runs **Nano Banana Pro** (`aspect_ratio 2:3`, `2K`) with `prompts/prompt_bau.txt`.
   `export KIE_API_KEY=...` then `python3 scripts/kie.py gen bau prompts/prompt_bau.txt <pose_url> <model_url> <product_url>` (order matters: the prompt refers to first/second/third image).
2. Colour match to the 9.9 banner photo (`scripts/grade.py`): Reinhard transfer of the skin's Lab mean/std from the 9.9 photo onto the skin pixels of this photo (feathered skin mask from the cutouts), then a global grade: +10% contrast on L, -12% chroma, cooler highlights. No generation credits.
3. Skin sheen (`prompts/prompt_sheen.txt`): one Nano Banana Pro edit of the graded photo with the 9.9 photo as reference, adding the glossy sheen and sculpted highlights only. 18 credits.
4. Subject cutout: `python3 -c "from rembg import remove; from PIL import Image; remove(Image.open('photo.png')).save('cutout.png')"` (u2net model, runs locally).
5. `scripts/compose.py PHOTO OUT [scale] [percent] [bigw] [hero_y] [cutout]` sets the typography with the brand fonts. Final: `scale 2, 25%, 780, 0.15, cutout.png`.
6. `scripts/logo.py` is the vector rebuild of the Toni Black logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/` (from the Toni Black Drive `Font` folder).
