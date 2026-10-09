# Toni Black Super Sale 10.10 Banner

The 9.9 banner photo and layout, re-set for 10.10: Three levels by size and space: header `SUPER SALE 10.10` (Zalando Bold 56, tracked 8), then a 96 px gap; the offer lockup `SAVE UP TO` (Bold 40) sitting 22 px above `45%` (fitted to 640 px, the dominant element); then an 84 px gap to the body, two benefit lines in Arimo 32 with 20 px between them; `SHOP NOW` and terms at the bottom. Official logo (`scripts/logo_6.png`).

| File | Use |
|---|---|
| `final/TONI-BLACK_10.10-Banner_1080x1620.jpg/.png` | Feed / marketplace |
| `final/TONI-BLACK_10.10-Banner_2160x3240.jpg/.png` | Retina / print |

Square version 1080x1080 and 2160x2160: `build(..., hero_y=0.165, bigw=560, height=1080, crop_pos=0.42)`, the photo cropped to the torso so the lockup stays on the chest and the CTA sits on the waistband. Portrait: `scripts/compose.py PHOTO OUT [scale] [hero_y]` with `../banner-9.9-toni-black/final/model-photo_raw.jpg` (final: `1 0.225`, `2 0.225`).
