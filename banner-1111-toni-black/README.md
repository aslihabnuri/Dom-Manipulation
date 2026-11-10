# Toni Black 11.11 Banner

1080x1620 (retina 2160x3240). Father and son (the same pair as `himhim7_23.jpg` and the Category banner), both in white singlets and black Toni Black boxer briefs, in the pose of the reference `_ (2).jpeg`: the son leans on his father's shoulder and calls out with cupped hands, the father kneels and looks up.

## Copy (as approved)
`11.11` / `MADE TO MOVE. TOGETHER.` / `SAVE UP TO` / `45%` / `SHOP NOW`. The headline extends the guideline's own line "Made To Move"; no slang, per the guideline's Tone of Voice ("Too Casual / Slangy" and "trying to look young" are listed under "we don't like").

## Typography
- Logo (`6.png`, charcoal, no box) alone at top centre, 320 px wide.
- `11.11` across the full measure (950 px), Arimo Bold. Zalando Sans Expanded draws the 1 with a flag and a foot at every weight, so at display size `11.11` reads as `tt.tt`; Arimo is the guideline's second family and its 1 is unambiguous.
- `MADE TO MOVE. TOGETHER.` Zalando Bold, tracked caps, fitted to the same measure, 40 px under the number.
- Offer block on the left wall beside the figures: `SAVE UP TO` (Zalando Bold 30, tracked), `45%` (Zalando Black, the largest size whose block fits the free wall with 40 px clearance from the figures, 120 px at 1080 wide), `SHOP NOW` charcoal pill with white text (guideline: active verb, black on white).
- All type Dark Charcoal #282828 on the light grey cyclorama; margins 65 px (6%). Automatic check: 0 type pixels within 40 px of the figures.

## Pipeline
1. `prompts/prompt_1111.txt` with Nano Banana Pro, 2:3, 2K, three references: the pose reference, the Category banner photo (people, clothes, set), the boxer brief `6a.png`. (`prompt_1111_minimal-contact_not-used.txt` was the first, calmer pose; replaced at the owner's request for the exact reference pose.)
2. A stray white "YY" mark the generator put on the boy's boxer leg was covered with adjacent fabric (`final/photo_mark-removed.jpg`).
3. `scripts/compose_1111.py PHOTO CUTOUT OUT [k]`: global BAU grade, photo at 80% width with the father's knee on the right margin and the floor on the bottom edge, wall continued row by row and column by column, type as above. Cutout by rembg u2net.

## Revision: SAVE UP TO 45% as large as on `himhim7_23.jpg`
Final layout is `build2` (`compose_1111.py PHOTO CUTOUT OUT [k] --v2`), the Him and Him structure:
- Logo alone at top centre, then `11.11` (Arimo Bold, 46% of the width), then `SAVE UP TO` (Zalando Bold 36, tracked) tight on `45%`.
- `45%` Zalando Black at 85% of the width (917 px at 1080), drawn on a layer behind the figures so the heads may overlap it; at this framing it clears the boy's hands by 47 px.
- `MADE / TO MOVE. / TOGETHER.` stacked on the left wall, Zalando Bold, the largest size whose stack and the `SHOP NOW` pill fit the free wall with 40 px clearance (46 px at 1080), hung 72 px or more below the number.
- `45%` is now the dominant element and `11.11` second: two numbers at full size would compete.
The first layout (`build`, offer block small on the left) is kept in the script.

## Revision: free ongkir and new-buyer voucher badges
- `FREE ONGKIR` and `VOUCHER 5K` / `NEW BUYER` as two badges in the guideline icon style (white line icon on a charcoal disc, `scripts/badges.py`: truck, ticket with notches and tear line), 64 px discs, Zalando SemiBold 20 tracked, 84 px pitch. The Drive file `Banner_BAU Voucher` uses text only, so there was no brand badge to reuse.
- Order in the left column: headline stack, badges, `SHOP NOW` (offer details before the action). The column is centred between the number and the floor where it fits; lower down the boy's legs narrow the free wall, so it sits beside his torso.
