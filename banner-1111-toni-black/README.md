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

## Revision: MADE TO MOVE. TOGETHER. as the header (`build3`, `--v3`, final)
Three tiers, each with one job and one type size, separated by gaps at least twice the leading inside a tier:
1. **Header**, centred under the logo: `11.11` / `MADE TO MOVE.` / `TOGETHER.`, all three lines at one cap height (52 px at 1080), leading 1.45 cap. `MADE TO MOVE.` and `TOGETHER.` in Zalando Black, tracked +2%. `11.11` stays in Arimo Bold (Zalando's 1 reads as a t) and is thickened with a stroke of 0.05 cap, set smaller by twice the stroke, because Arimo Bold's stem is about 0.21 cap against Zalando Black's 0.31; the three lines now share one weight.
2. **Offer**: `SAVE UP TO` (Zalando Bold 30, tracked 14%) 20 px over `45%` (Zalando Black, as wide as it can be while keeping 40 px clear of the heads: 0.81 W at this framing).
3. **Detail**: the two badges (72 px discs, labels Zalando SemiBold 22) and `SHOP NOW` (68 px pill), on the left margin, centred between the number and the floor where the free wall allows.
Photo at 74% width (figures slightly smaller than before) so the header, offer and figures each have their own band.

## Revision: guideline fonts only, more space (`build4`, `--v4`, final)
- **Fonts by guideline role.** Zalando Sans Expanded for every display line: header (Black), `11.11` (Black), `45%` (Black), `SAVE UP TO` and `SHOP NOW` (Bold). Arimo Bold for the small badge labels (the guideline's reading face). The Arimo `11.11` with a synthetic stroke is gone: a faux bold is itself a change to the typeface. Zalando's stylistic set ss02 was checked for a plain 1, but it is a struck-through numeral set for crossed-out prices, so `11.11` uses the typeface's own 1.
- **Less stacking.** The top holds only two groups: the header (`MADE TO MOVE.` / `TOGETHER.`, cap 46, leading 1.5) and the offer (`SAVE UP TO` / `45%` at 85% of the width). `11.11` moved to the left wall as the event tag above the badges and `SHOP NOW`, at the header's cap height so the header stays the lead line.
- **Spacing.** Logo to header 72, header to offer 84, offer to the heads 111, tag to badges 64, badges to CTA 56: every gap between groups is at least twice the space between lines inside a group. Photo at 72% of the width. 0 type pixels within 40 px of the figures.

## Revision: bring back the 11.11 feel (`build6`, `--v6`, final)
- **11.11 is the hero.** Zalando Black across the full measure (ink from margin to margin), directly under the header. A banner can have one largest element; for an 11.11 campaign it has to be the date.
- **Tabular 1.** Zalando Sans Expanded's default 1 (flag and asymmetric foot) reads as a t at display size. Its OpenType `tnum` figure (`one.tf`) has a full symmetric base and a short flag and reads as 1, so the hero uses `tnum` with -8% tracking (tabular figures are spaced wide). Still the guideline typeface, no modification. The ink edge is measured from a render because PIL's bbox reports 0 for this glyph.
- **One left axis.** Header line (`MADE TO MOVE. TOGETHER.`, Zalando Black, cap 30), 11.11, `SAVE UP TO`, `45%`, badges and `SHOP NOW` all start at the 65 px margin; only the logo is centred, alone.
- **45%** is the largest size that is at most 75% of the hero's height and keeps 40 px clear of the figures (206 px, 602 wide at 1080).
- Tried and rejected: a giant Clean White 11.11 behind the figures (`--v5`): the figures hid most of it and the default 1s read as crosses.

### Balance: 45% leads, 11.11 second
The full-measure 11.11 drowned the offer. Now `11.11` is set to 70% of the measure (cap 142 px at 1080) and `45%` is the largest size that keeps 40 px clear of the figures (cap 220 px, 870 wide): the offer leads, the date still reads at a glance. Order on the left axis: header line, 11.11, SAVE UP TO, 45%, badges, SHOP NOW.

### Clean pass (`--v7`, final)
The top half was a wall of three Black-weight blocks (header, 11.11, 45%), and the tabular 1 in Black reads as a heavy slab. Now only `45%` is Black, the single heavy mass:
- Header `MADE TO MOVE. TOGETHER.` Zalando Bold, cap 26, tracked 8%.
- `11.11` Zalando Medium with the tabular 1 (`tnum`), cap 92, tracked 4%: a light date mark that still reads at a glance.
- Gaps: logo to header 64, header to 11.11 72, 11.11 to SAVE UP TO 72, 45% to the figures at least 64 (65 at this framing).
- `45%` the largest size inside the measure that keeps that gap: cap 225, 888 wide at 1080.

## Typography alternatives (`alternatives/`, `scripts/alternatives_1111.py PHOTO CUTOUT OUTDIR [k]`)
Same photo, copy, fonts (Zalando display, Arimo labels, tabular 1 for 11.11) and centred logo; three different structures:
- **A, Simetris**: one centre axis. Header line (Bold, cap 26), 11.11 (Medium, cap 72), SAVE UP TO, 45% (Black, full measure, 79 px clear of the figures). Details on the left wall.
- **B, Header besar**: one left axis. `MADE TO MOVE.` / `TOGETHER.` as a two-line Black header (cap 50), then 11.11, SAVE UP TO, 45%. Figures at 66% width to make room.
- **C, Berlapis**: centre axis, 45% at 88% of the width placed so the heads overlap its lower 20% (the Him and Him device); header and 11.11 centred with equal space above and below.
