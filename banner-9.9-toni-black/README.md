# Toni Black 9.9 Sale Banner

Portrait banner (2:3). The photo recreates the "Pose Model" reference: tight torso crop from the chin down, hand pulling the waistband outward (shape retention), seamless grey studio backdrop. The photo runs full-bleed; typography sits in three balanced zones.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_9.9-Banner_2160x3240.png/.jpg` | Retina / print-ready |
| `TONI-BLACK_9.9-Banner_1080x1620.jpg` | Feed / marketplace upload |
| `model-photo_raw.jpg` | Untouched generated photo (no typography) |

## Layout
- **Top zone**: logo (white, solid, no effects) left; `9.9 SALE` outlined tag right.
- **Centre zone** (across the chest, like the logo placement in the pose reference): `SAVE UP TO` / `40%` / `Trunks built to hold their shape.` centred. `40%` is the single dominant element (Zalando Sans Expanded Black).
- **Bottom zone**: benefits `Free shipping` and `Extra IDR 5K voucher for new buyers` left; `SHOP NOW` pill right; `*Terms & conditions apply` below.
- Soft black gradients at the top and bottom edges only, for legibility (allowed by the brand guideline).

Fonts: Zalando Sans Expanded (headlines, CTA, tag), Arimo (body). Colours: Clean White on photo, Dark Charcoal `#282828` for CTA text, Steel Grey `#CCCCCC` for terms.

## Pipeline
1. `scripts/kie.py` uploads the two references (Toni Black model photo for identity, pose reference) to kie.ai and runs **Nano Banana Pro** (`aspect_ratio 2:3`, `2K`) with `prompts/prompt_pose.txt`.
   `export KIE_API_KEY=...` then `python3 scripts/kie.py gen pose prompts/prompt_pose.txt <model_url> <pose_url>`.
2. `scripts/compose.py PHOTO OUT [scale]` sets the typography with the brand fonts (`scale 2` gives 2160×3240).
3. `scripts/logo.py` is a vector rebuild of the Toni Black logo, used because the brand-guideline PDF could not be downloaded from Drive in this session. Swap in the official SVG/PNG from the brand kit before print use.

Fonts (not committed): Zalando Sans Expanded + Arimo static TTFs in `fonts/static/` (from the Toni Black Drive `Font` folder).
