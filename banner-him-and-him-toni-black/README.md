# Toni Black "Made For Him and Him" banner (Shopee / TikTok Shop)

Father and son high-five, from the pose reference ("Referensi2.jpeg"), with the Toni Black size-chart model ("Referensi Model.png") as the father and a 12-year-old son generated to resemble him. Father: white Toni Black singlet + black boxer brief. Son: plain white tee + black Toni Black kids boxer brief (the small white T mark on the leg). Bright off-white studio instead of the reference's navy room, graded with the same global grade as the BAU / 9.9 banners.

| File | Use |
|---|---|
| `final/TONI-BLACK_Him-and-Him_1080x1620.jpg` | 2:3, Shopee / TikTok Shop feed and story-type slots |
| `final/TONI-BLACK_Him-and-Him_1080x1080.jpg` | 1:1, product-grid and square ad slots |
| `final/photo_generated.jpg` | the raw photo, one generation |

## Layout
- **2:3:** masthead on the clean wall above the raised hands: logo, `MADE FOR HIM AND HIM` (Zalando Sans Expanded Regular, tracked), `SAVE UP TO` / `25%` (the dominant element, Black, 560 px), one benefits line, `SHOP NOW` pill. The photo sits below at 78% width with the wall extended around it, so the figures are never cropped: both products stay in frame. Terms at the bottom.
- **1:1:** two columns: the type block left-aligned on the left, the full photo on the right at 84% height. Benefits in two lines so they stay inside the column.

## Pipeline
1. `prompts/prompt_himhim.txt`, Nano Banana Pro, 2:3, 2K. References in order: pose, model, men's boxer brief (`6a.png`), singlet (`TNB 5 gm.jpg`), kids boxer (`Boxer anak/2.png`), BAU graded photo (look). One generation, 18 credits.
2. `scripts/compose_himhim.py` (needs `gen/himhim_a_0.png` and `fonts/static/`): applies the global grade, extends the wall, sets the type. `build_23`, `build_11`.
