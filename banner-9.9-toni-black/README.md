# Toni Black 9.9 Sale Banner

Portrait banner (2:3). The photo reproduces the "Pose Model" reference (chin-down torso crop, hand pulling the waistband: shape retention) with the Toni Black model and product. Full-bleed photo, one centred type lockup, one CTA.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_9.9-Banner_2160x3240.png/.jpg` | Retina / print-ready |
| `TONI-BLACK_9.9-Banner_1080x1620.jpg` | Feed / marketplace upload |
| `model-photo_raw.jpg` | Untouched generated photo (no typography) |

## Layout
- Photo full-bleed, reproducing the pose reference one-to-one (chin-down crop, elbow out, fingers hooked in the waistband pulling it down and outward, glossy directional light, grey seamless backdrop). Only the model and the product were changed.
- Logo top-left (white, solid, no effects).
- One centred lockup on the chest, where the reference places its brand mark: `9.9 SALE` / `SAVE UP TO` / `40%` / `Free shipping` / `Extra IDR 5K voucher for new buyers`. `40%` is the single dominant element (Zalando Sans Expanded Black).
- `SHOP NOW` pill centred at the bottom, below the waistband so the `TONI BLACK` band stays unobstructed; `*Terms & conditions apply` beneath it.
- One soft black gradient at the bottom edge only, for legibility.

Fonts: Zalando Sans Expanded (headline, tag, CTA), Arimo (benefits, terms). Colours: Clean White on photo, Dark Charcoal `#282828` for CTA text, Steel Grey `#CCCCCC` for terms.

## Pipeline
1. `scripts/kie.py` uploads the two references (Toni Black model photo for identity, pose reference) to kie.ai and runs **Nano Banana Pro** (`aspect_ratio 2:3`, `2K`) with `prompts/prompt_exact.txt` (pose reference passed first as the composition template, model photo second).
   `export KIE_API_KEY=...` then `python3 scripts/kie.py gen exact prompts/prompt_exact.txt <pose_url> <model_url>`.
2. `scripts/compose.py PHOTO OUT [scale] [hero_y]` sets the typography with the brand fonts (`scale 2` gives 2160×3240).
3. `scripts/logo.py` is a vector rebuild of the Toni Black logo, used because the brand-guideline PDF could not be downloaded from Drive in this session. Swap in the official SVG/PNG from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/` (from the Toni Black Drive `Font` folder).
