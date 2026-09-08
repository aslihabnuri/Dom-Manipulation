# Toni Black — 9.9 Sale Banner

Portrait banner (2:3, same proportion as the 9.9 reference layout) for the Toni Black 9.9 campaign.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_9.9-Banner_Light_2160x3240.png/.jpg` | Primary — retina / print-ready |
| `TONI-BLACK_9.9-Banner_Light_1080x1620.jpg` | Primary — feed / marketplace upload |
| `TONI-BLACK_9.9-Banner_Dark-Alt_*` | Alternative on charcoal backdrop |
| `model-photo_*_raw.jpg` | Untouched generated photos (no typography) |

## Hierarchy (largest → smallest)
1. `40%` — Zalando Sans Expanded Black, the single dominant element
2. `SAVE UP TO` — Zalando Sans Expanded Bold, tracked
3. `— 9.9 SALE` eyebrow
4. `Trunks built to hold their shape.` — Arimo, Davi's Grey (explains the waistband-pull pose: shape retention)
5. Benefits: `Free shipping` · `Extra IDR 5K voucher for new buyers` — Arimo
6. `SHOP NOW` pill CTA (brand-guideline CTA list)
7. `*Terms & conditions apply`

Colours: Dark Charcoal `#282828`, Clean White `#FFFFFF`, Davi's Grey `#4F5052`, Grey `#818284`, Steel Grey `#CCCCCC` (brand guideline).
Logo top-left, single solid colour, no effects (brand guideline). `@toniblack.id` top-right.

## Pipeline
1. `scripts/kie.py` — uploads the two references (Toni Black model photo for identity, waistband-pull pose reference) to kie.ai and runs **Nano Banana Pro** (`aspect_ratio 2:3`, `2K`) with `prompts/prompt_light.txt` / `prompt_dark.txt`.
   `export KIE_API_KEY=...` then `python3 scripts/kie.py gen light prompts/prompt_light.txt <model_url> <pose_url>`.
2. `scripts/compose.py` — places the photo in the right two-thirds (bottom-anchored, 88% height), extends the seamless backdrop to the left, and sets all typography with the brand fonts.
   `python3 scripts/compose.py gen/light_0.png out/light.png light 0.12 0.88 580 2` (last arg = scale, 2 → 2160×3240).
3. `scripts/logo.py` — vector rebuild of the Toni Black logo (icon + wordmark + tagline) used because the brand-guideline PDF could not be downloaded from Drive in this session. Swap in the official SVG/PNG from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/` (from the Toni Black Drive `Font` folder).
