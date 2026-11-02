# Toni Black "Made For Him and Him" banner (Shopee / TikTok Shop)

Father and son high-five, from the pose reference ("Referensi2.jpeg"), with the Toni Black size-chart model ("Referensi Model.png") as the father and a 12-year-old son generated to resemble him. Father: white Toni Black singlet + black boxer brief. Son: plain white tee + black Toni Black kids boxer brief (the small white T mark on the leg). Bright off-white studio instead of the reference's navy room, graded with the same global grade as the BAU / 9.9 banners.

| File | Use |
|---|---|
| `final/TONI-BLACK_Him-and-Him_1080x1620.jpg` | 2:3, Shopee / TikTok Shop feed and story-type slots |
| `final/TONI-BLACK_Him-and-Him_1080x1080.jpg` | 1:1, product-grid and square ad slots |
| `final/photo_generated.jpg` | the raw photo, one generation |

## Layout (BAU structure, `scripts/compose_himhim2.py`)
Same placement as the BAU banner: logo top centre; hero `SAVE UP TO` / `25%` top-left at BAU scale (`25%` Zalando Black fitted to 780 px on 2:3, 600 px on 1:1, the kicker fitted to the same width); the message `Made For / Him and Him` mid-left in Zalando Regular (40 / 34); the offer block bottom-left: benefits in three short lines (Arimo 26), `SHOP NOW` charcoal pill, terms in `#818284`. The photo is never cropped: it sits bottom-right at 70% width (2:3) or 58% (1:1) with the studio wall extended, so the figures and both products stay whole. All type on one left axis (72 px), with the wall left of the boy as its field; every glyph keeps 24 px from the figures (checked against the subject mask). Colour: the same global grade as the BAU / 9.9 banners (contrast, -12% chroma, cool highlights); the BAU skin transfer was not applied because this model's skin is lighter than the BAU model's and the transfer would darken it.

## Pipeline
1. `prompts/prompt_himhim.txt`, Nano Banana Pro, 2:3, 2K. References in order: pose, model, men's boxer brief (`6a.png`), singlet (`TNB 5 gm.jpg`), kids boxer (`Boxer anak/2.png`), BAU graded photo (look). One generation, 18 credits.
2. `scripts/compose_himhim.py` (needs `gen/himhim_a_0.png` and `fonts/static/`): applies the global grade, extends the wall, sets the type. `build_23`, `build_11`.
