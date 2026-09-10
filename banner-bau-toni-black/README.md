# Toni Black BAU Banner

Portrait banner (2:3) for the always-on (BAU) promotion. The photo reproduces the "Referensi Banner BAU" pose (model reclining on a cream boucle sofa, hand to chin, plain off-white wall) with the Toni Black model's face and the real black Toni Black boxer (tone-on-tone embossed waistband), all in a single Nano Banana Pro pass with three references: pose, model, product.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_BAU-Banner_25_2160x3240.png/.jpg` | Primary (Save up to 25%), retina / print-ready |
| `TONI-BLACK_BAU-Banner_25_1080x1620.jpg` | Primary, feed / marketplace upload |
| `TONI-BLACK_BAU-Banner_40-variant_*` | Same layout with 40%, rendered at no generation cost because the brief named both numbers |
| `model-photo_raw.jpg` | Untouched generated photo (no typography) |

## Layout
- Full-bleed photo. One left-aligned column sits in the empty wall area the reference leaves above the sofa: logo, `EVERYDAY ESSENTIALS` eyebrow, `SAVE UP TO`, `25%` (single dominant element, Zalando Sans Expanded Black), `Free shipping`, `Extra IDR 5K voucher for new buyers`, `SHOP NOW` pill. `*Terms & conditions apply` bottom-left.
- Dark Charcoal `#282828` type on the light scene (as in the previous BAU voucher banner); Davi's Grey `#4F5052` eyebrow; Grey `#818284` terms. No gradients or overlays needed.

## Pipeline
1. `scripts/kie.py` uploads the three references to kie.ai and runs **Nano Banana Pro** (`aspect_ratio 2:3`, `2K`) with `prompts/prompt_bau.txt`.
   `export KIE_API_KEY=...` then `python3 scripts/kie.py gen bau prompts/prompt_bau.txt <pose_url> <model_url> <product_url>` (order matters: the prompt refers to first/second/third image).
2. `scripts/compose.py PHOTO OUT [scale] [percent] [col_y]` sets the typography with the brand fonts (`scale 2` gives 2160×3240; `percent` e.g. `25%`).
3. `scripts/logo.py` is the vector rebuild of the Toni Black logo; swap in the official file from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/` (from the Toni Black Drive `Font` folder).
