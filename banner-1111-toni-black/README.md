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
