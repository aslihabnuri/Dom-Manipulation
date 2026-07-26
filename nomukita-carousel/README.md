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

## White pouch on bone white

The 250 gram pouch is white and renders almost flat — its paper sits at 238–252,
*brighter* than the background, with only ~14 points of shading. On bone white it
reads as a pasted rectangle instead of an object.

Reference `Refrensi/Referensi Matchamu` solves the same white-on-white case the
other way round: background pure white (255), pouch paper kept **below** it at
217–238 (about 27 points down, sides falling to 150), so the form is carried by a
wide gradient rather than by brightness.

`model_white()` reproduces that on our background: paper down to 215 — 26 points
under the bone white — with the shading stretched 1.7×, plus a soft contact
shadow at the base. The curve is smoothstepped above luminance 175, so the
printed kanji, the blue mark and the label text keep their full strength, the way
the Matchamu label stays fully saturated.

Applied to the 250 gram slides and to the small pouch on the combination slides.
The 1000 gram pouch is black and is left untouched.

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

## Gelas berisi minuman (slide 1000 gram)

Gambar minuman dan prop bahan digenerate lewat kie.ai `google/nano-banana-edit`
(image-to-image, acuan gelas dikirim tiap kali agar 12 produk memakai gelas yang
sama), lalu dikomposit dengan `photo.py`. Detail alur, prompt, dan tiga jebakan
keying yang sudah dibereskan ada di `BRIEF-gelas-dan-prop.md`.

`runjob.py` membungkus createTask/polling/unduh. Butuh `KIE_API_KEY` dari
environment; jangan menaruh kunci di dalam repo.
