# Nomukita — Carousel Slide 1 (Premium & Exclusive series)

36 slides: 12 products × 3 packaging variants (250 gram, 1000 gram, 250 gram & 1000 gram),
1024 × 1024, background bone white (241, 240, 235).

Built to **Nomukita - Design System Carousel Marketplace**, calibrated pixel-for-pixel
against the approved `Uji_S1_500gr.png` and `Uji_S1_500&30.png`.

## Layout (identical on every slide, measured off the reference)

| element | position |
|---|---|
| logo nomukita | x 362–662 (width 300), y 52 |
| katakana watermark | ink top y 165, centred, Shippori Mincho 44, (219, 218, 213) |
| headline | cap top y 232, cap height 50, centred, All Round Gothic Bold 74 |
| sub-line | ink top y 304, centred, Comfortaa Regular 32, (29, 29, 30) |
| product | stands on y 855, height 440 |
| Halal Indonesia | height 110, top y 881, centred |

## Rules applied

- **Headline colour** — green (127, 162, 67) for the two products whose name contains
  "Matcha"; steel blue (94, 152, 189) for the other ten. The blue is sampled from the
  rating drops on Uji slide 1.
- **No origin products** — the JAS and USDA seals, the ORIGIN badge and the taste
  criteria (Bitter / Umami / Sweetness / Creaminess) are dropped. Only Halal Indonesia
  remains. Those belong to Uji, Nishio and Shizouka only.
- **Combination slides** follow `Uji_S1_500&30`: both products bottom-aligned, the large
  pouch left, the small one in front on the right, sized to the real 250 g : 1000 g
  height ratio.
- **Sub-line** mirrors "ceremonial grade · 500 gram" from the reference, with the series
  in the grade slot: `premium grade · 250 gram`, `exclusive grade · 1000 gram`.

## Font licence

All Round Gothic is the Fontspring DEMO build: `-`, `–`, `°`, `4` and `&` are locked and
render as a "DEMO" mark. `build_slides.py` detects those characters and draws them in
Comfortaa Bold, scaled to match the cap height — this affects `COOKIES & CREAM`.
Buy the retail licence before mass production.

## Regenerating

`build_slides.py` expects, next to itself:

- `fonts/` — All Round Gothic + Comfortaa (Drive: `Nomukita/`), Shippori Mincho (Google Fonts)
- `prod/` — the pouch mockups from Drive `Nomukita/Packaging 250` and `Nomukita/Packaging 1000`
- `assets/` — `logo_nomukita.png` and `halal.png` (in this repo)

```
python3 build_slides.py      # writes out/<Product>_S1_<variant>.png
```

## Note on artwork

The 250 gram Avocado pouch prints レモンティー (lemon tea) instead of アボカド. The slide
uses the correct アボカド; the pouch artwork itself needs fixing separately.
