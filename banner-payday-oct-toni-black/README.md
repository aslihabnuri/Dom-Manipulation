# Toni Black Payday banner (October)

1334 x 2000 px (2:3), JPG under 2 MB. Editorial layout after "Refrensi banner Payday.jpg": the model seated on a black folding chair in a white studio, wearing the Toni Black white singlet (`TNB 5 gm.jpg`) and black boxer brief (`6a.png`).

## Copy and slots
- Top centre: official logo (`6.png`), tinted `#282828`, no box.
- Headline at head height, left of the model: `PAYDAY.` / `SPEND IT WELL.` (Zalando Sans Expanded Regular, tracking 0.12 em, fitted to 600 px, `#282828`).
- Label columns under the headline: left `SAVE UP TO` (SemiBold 24) with the percentage set as a large numeral under it (SemiBold, fitted to the left column, 76 px; the asterisk kept at label size as a superscript), right the two date lines (SemiBold 24) aligned to the top of `SAVE UP TO`. Right column at 0.35 W as in the reference, clear of the model's arm.
- `SHOP NOW` under the labels, SemiBold 22 with a 1.5 px underline.
- Bottom centre: `TAILORED FOR COMFORT, DEFINED BY ORIGINALITY` (SemiBold 22, tracked), `*Terms & conditions apply` under it (Arimo 16, `#818284`).
- Palette: `#282828`, `#FFFFFF`, `#4F5052`, `#818284`, `#CCCCCC` only.

## Bracketed copy
The second brief drops the two corner labels (removed) and fills the percentage as `[35]`; the dates stay `[25 – 31]` / `[OCTOBER]`, all still inside brackets.
- `final/TONI-BLACK_Payday-Oct_1334x2000.jpg`: values printed (`35%*`, `25 – 31`, `OCTOBER`), pending the owner's confirmation that the brackets are only field markers.
- `draft/TONI-BLACK_Payday-Oct_1334x2000_strict-no-bracket-values.jpg`: the strict reading, bracketed lines not printed.
Render call: `build(photo, out, pct="35", date_lines=("25 – 31","OCTOBER"))`.

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
