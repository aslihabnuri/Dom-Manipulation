# Toni Black Payday banner (October)

1334 x 2000 px (2:3), JPG under 2 MB. Editorial layout after "Refrensi banner Payday.jpg": the model seated on a black folding chair in a white studio, wearing the Toni Black white singlet (`TNB 5 gm.jpg`) and black boxer brief (`6a.png`).

## Copy and slots
- Top centre: official logo (`6.png`), tinted `#282828`, no box.
- Headline at head height, left of the model: `PAYDAY.` / `WORTH THE WAIT.` (Zalando Sans Expanded Regular, tracking 0.12 em, fitted to 630 px, `#282828`).
- Label columns under the headline: left `SAVE UP TO` (SemiBold 24) with the percentage set as a large numeral under it (SemiBold, fitted to the left column, 76 px; the asterisk kept at label size as a superscript), right the two date lines (SemiBold 24) aligned to the top of `SAVE UP TO`. Right column at 0.35 W as in the reference, clear of the model's arm.
- `SHOP NOW` under the labels, SemiBold 22 with a 1.5 px underline.
- Bottom centre: `TAILORED FOR COMFORT, DEFINED BY ORIGINALITY` (SemiBold 22, tracked), `*Terms & conditions apply` under it (Arimo 16, `#818284`).
- Palette: `#282828`, `#FFFFFF`, `#4F5052`, `#818284`, `#CCCCCC` only.

## Bracketed copy
The second brief drops the two corner labels (removed) and fills the percentage as `[35]`; the dates stay `[23 – 31]` / `[OCTOBER]`, all still inside brackets.
- `final/TONI-BLACK_Payday-Oct_1334x2000.jpg`: values printed (`35%*`, `23 – 31`, `OCTOBER`), pending the owner's confirmation that the brackets are only field markers.
- `draft/TONI-BLACK_Payday-Oct_1334x2000_strict-no-bracket-values.jpg`: the strict reading, bracketed lines not printed.
Render call: `build(photo, out, pct="35", date_lines=("23 – 31","OCTOBER"))`.

## Pipeline
1. `prompts/prompt_payday3.txt`, Nano Banana Pro 2:3 2K, references in order: the banner reference (composition), the Toni Black model (`banner-bau-toni-black/final/model-photo_raw.jpg`, the same model as the Drive "Banner BAU" file but without type), the singlet, the boxer brief. One generation.
2. `scripts/compose_payday3.py` sets the type; a check confirms no glyph comes within 20 px of the model.

## Offer at sale-banner scale (current final)
On request the offer now matches the scale of the 9.9 / 10.10 banners. `scripts/compose_payday4.py`:
- Two vertical axes taken from the headline: its left edge (0.14 W) and its right edge.
- One row under the headline: `SAVE UP TO` (SemiBold 39, left axis) and the dates (SemiBold 24, right-aligned on the right axis), sharing the last baseline.
- `35%` below in SemiBold at 191 px (cap 143 px, 0.40 W), the largest size that keeps 25 px from the model, found by testing the glyphs against the subject mask. The asterisk is a superscript at 0.24 of the numeral size.
- `SHOP NOW` underlined below on the left axis. Logo, bottom line and terms unchanged.
The headline is now the second level; the percentage is the focal point. Every glyph keeps at least 20 px from the model.

## Dates under the offer (current final)
A dateline above the headline was tried and dropped: the headline has to open the page. The dates now sit right under `35%` as the promo period, then `SHOP NOW`, all on the headline's left axis. Reading order: what, how much, when, act.
Measured gaps (px): headline to `SAVE UP TO` 73, `SAVE UP TO` to `35%` 30, `35%` to dates 45, dates to `SHOP NOW` 59; line gap inside the dates 13.

## Headline: PAYDAY. / WORTH THE WAIT. (current final)
Headline copy changed to `PAYDAY.` / `WORTH THE WAIT.`, set in caps with the same full stops as before. The longer second line is fitted to 630 px so it keeps 20 px from the model's head (Regular 50 px, cap 35, tracking 0.12 em); the offer, dates and `SHOP NOW` follow on the same axis.

## Wide formats: App 1200x400, Website 992x165
`scripts/compose_wide.py` (needs `gen/payday3_canvas.png`, the 1334x2000 photo canvas). The model is never cropped, because the singlet and the boxer brief are the product: the whole figure and chair (canvas y 400 to 1930) is scaled to the banner height and placed on the right, and the studio wall is extended to the left and right from the photo's edge columns with a 6 px blend (the toe sits 36 canvas px from the photo edge, so a wider blend would fade it).
- **App 1200x400:** figure x 803 to 1152. Logo top left; column A: headline (Regular 28), then `SHOP NOW` and the terms at the bottom; column B: `SAVE UP TO`, `35%*` (SemiBold 136, the largest size that keeps 34 px from the figure), dates under it. `SHOP NOW` sits on the dates' last baseline.
- **Website 992x165:** figure x 812 to 956, about 150 px tall. Three columns: logo over the headline (Regular 15); `SAVE UP TO` over `35%*` (92 px); dates top-aligned with `SAVE UP TO`, `SHOP NOW` on the numeral's baseline, terms under it (Arimo 10).
- The bottom line `TAILORED FOR COMFORT, DEFINED BY ORIGINALITY` is left out of both wide formats: at these heights it would set below a readable size, and it carries no offer information.
