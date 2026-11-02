# Toni Black "Made For Him and Him" banner (Shopee / TikTok Shop)

Father and son high-five, from the pose reference ("Referensi2.jpeg"), with the Toni Black size-chart model ("Referensi Model.png") as the father and a 12-year-old son generated to resemble him. Father: white Toni Black singlet + black boxer brief. Son: plain white tee + black Toni Black kids boxer brief (the small white T mark on the leg). Bright off-white studio instead of the reference's navy room, graded with the same global grade as the BAU / 9.9 banners.

| File | Use |
|---|---|
| `final/TONI-BLACK_Him-and-Him_1080x1620.jpg` | 2:3, Shopee / TikTok Shop feed and story-type slots |
| `final/TONI-BLACK_Him-and-Him_1080x1080.jpg` | 1:1, product-grid and square ad slots |
| `final/photo_generated.jpg` | the raw photo, one generation |

## Layout (v3, `scripts/compose_himhim3.py`)
The pair in the photo spans almost the whole frame width, so a full-bleed photo leaves no field for a poster-scale header. The figures are therefore cut out (rembg, `final/photo_generated_cutout.png`) and set large on a wall rebuilt from the photo's own wall gradient (per-row median of the non-subject pixels), with soft contact shadows. A re-shoot asking for the pair in the right half (`prompts/prompt_himhim2.txt`) came back with the same composition and was not used.
- **2:3:** logo top centre; header `MADE FOR / HIM AND HIM` at poster scale (Zalando Sans Expanded Regular 87 px, tracked 0.12 em, fitted to 760 px); hero `SAVE UP TO` / `25%` (Black, 760 px) below it; the figures at 58% of the height, right-aligned, their raised arms passing in front of the number (type-behind-subject, as in BAU); offer block bottom-left in the wall left of the boy: three short benefit lines (Arimo 22), `SHOP NOW` pill, terms. One left axis at 72 px.
- **1:1:** figures at 70% of the height on the right; left column (380 px) carries the header (43 px), hero (`25%` 380 px), benefits, pill and terms, logo top centre.
Hierarchy by size: number, header, kicker, benefits, terms. Groups separated by gaps several times their internal leading.

## Pipeline
1. `prompts/prompt_himhim.txt`, Nano Banana Pro, 2:3, 2K. References in order: pose, model, men's boxer brief (`6a.png`), singlet (`TNB 5 gm.jpg`), kids boxer (`Boxer anak/2.png`), BAU graded photo (look). One generation, 18 credits.
2. `scripts/compose_himhim3.py` (needs `gen/himhim_a_0.png`, `gen/himhim_a_cutout.png` and `fonts/static/`; imports helpers from `compose_himhim.py`): global BAU grade, rebuilt wall, cut-out figures, type.

## v4 (current 2:3 final, `scripts/compose_himhim5.py`)
New photo (`prompts/prompt_himhim4.txt`, generated without the earlier photo as a reference so the composition could change): the pair compact and side by side, the boy 9 years old with a child's proportions, framed at the knees, plain even light-grey wall with no floor line. The photo runs full-bleed; the figures fill 58% of the width and 83% of the height, right of centre. Type fitted to the empty left third: header 51 px (443 px wide), `25%` at 380 px (60% of the previous 760 px, never wider than the header), offer block bottom-left. Every glyph keeps 40 px from the figures (checked against the cutout). `prompts/prompt_himhim3.txt` was a first attempt that kept the old photo as a reference and returned the old composition; not used. The 1:1 file is still v3.
