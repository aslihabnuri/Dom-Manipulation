# Toni Black Payday banner (October)

1334 x 2000 px (2:3), JPG under 2 MB. Editorial layout after "Refrensi banner Payday.jpg": the model seated on a black folding chair in a white studio, wearing the Toni Black white singlet (`TNB 5 gm.jpg`) and black boxer brief (`6a.png`).

## Copy and slots
- Top centre: official logo (`6.png`), tinted `#282828`, no box.
- Top left / top right, level with the logo centre: `PRECISION & FIT`, `AUTHENTIC SIMPLICITY` (SemiBold 22, `#4F5052`).
- Headline at head height, left of the model: `PAYDAY.` / `SPEND IT WELL.` (Zalando Sans Expanded Regular, tracking 0.12 em, fitted to 600 px, `#282828`).
- Label columns under the headline: left `SAVE UP TO` + percentage line, right the two date lines (SemiBold 24). Right column at 0.35 W as in the reference, clear of the model's arm.
- `SHOP NOW` under the labels, SemiBold 22 with a 1.5 px underline.
- Bottom centre: `TAILORED FOR COMFORT, DEFINED BY ORIGINALITY` (SemiBold 22, tracked), `*Terms & conditions apply` under it (Arimo 16, `#818284`).
- Palette: `#282828`, `#FFFFFF`, `#4F5052`, `#818284`, `#CCCCCC` only.

## Bracketed copy
The brief has `[XX]%*`, `[25 – 31]` and `[OCTOBER]`. Per the brief these are never printed until confirmed. The draft in `draft/` leaves those lines empty (the space is kept so nothing moves when they are filled). Final render: `build(photo, out, pct="NN", date_lines=("25 – 31","OCTOBER"))`.

## Pipeline
1. `prompts/prompt_payday3.txt`, Nano Banana Pro 2:3 2K, references in order: the banner reference (composition), the Toni Black model (`banner-bau-toni-black/final/model-photo_raw.jpg`, the same model as the Drive "Banner BAU" file but without type), the singlet, the boxer brief. One generation.
2. `scripts/compose_payday3.py` sets the type; a check confirms no glyph comes within 20 px of the model.
