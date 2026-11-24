# Toni Black Payday Banner, November: BACK IN THE BLACK

`final/TONI-BLACK_Payday-Nov_Back-In-The-Black_1334x2000.jpg/.png` (same size as the October payday banner).

## Copy (exactly)
`BACK IN THE BLACK` / `SAVE UP TO` / `35%` / `FREE ONGKIR` / `VOUCHER` `NEW BUYERS 5K`. No other text.

## Photograph (recreated; `prompts/5_recreate_natural_used.txt`, `final/photo_generated.jpg`)
The first version read as a stiff, tipping pose and was rejected. The recreation drops the pose silhouette and the reference-as-composition: the Toni Black model (`Referensi Model.png`, face crop first, body second), the Drive reference `Payday.jpeg` third and only for the place, colours and film light, then the white singlet (`Tanktop.jpg`) and the black boxer brief (`6a.png`). The pose is written as a caught moment with real weight: sitting deep on the washing machine in the corner, back resting on the wall, one knee up with the forearm on it, the other leg hanging, barefoot. Framed with the man and the machine in the right half so the left half is clean yellow wall for the type. Global BAU grade.
Credits: five Nano Banana Pro generations at 18 for this banner (four for the rejected first version, one for the recreation).

## Typography (`scripts/compose.py PHOTO CUTOUT OUT --v2`)
One left axis on the wall, 80 px margin; nothing crosses the window frame, the washing machine or within 56 px of the man.
- Logo `6.png` charcoal, top-left on the axis.
- Headline as lead-in plus key word: `BACK IN THE` (Zalando Bold 46, tracked) over `BLACK` (Zalando Black, as wide as the wall left of the window allows), so the stress falls on the brand word.
- Offer group: `SAVE UP TO` (Zalando Bold 32, tracked) / `35%` (Zalando Black) / the two badges (guideline icon style, Arimo Bold labels), placed as one group in the lower band, level with the top of the washing machine; the 35% is the largest that fits there.

## Revision: a better laundry room, livelier typography (`--v3`, final)
- **Room** (`prompts/6_room-redesign-edit_used.txt`): one edit pass on the recreated photo, which keeps the man, his pose, the clothes and the film look and changes only the room: warm off-white limewash plaster, a pale oak worktop over the white front-loader, a floating oak shelf with folded white towels, amber bottles and an olive branch, a woven linen basket, stone floor, soft window-pane sunlight on the walls. 18 credits; this banner has now used six generations (108 credits).
- **Typography** (`scripts/compose.py ... --v3`), built from scale contrast and the room's own shapes:
  - Masthead: `BACK IN THE` (Zalando Bold, wide 34% tracking) over `BLACK` (Zalando Black, cap 156 px, 922 px wide), ending before the olive branch and clear of the head.
  - The left wall is tall and narrow, so `SAVE UP TO` / `35%` are set vertically, reading bottom to top like a book spine: the number reaches cap 241 px (about twice the horizontal setting the wall allowed), bottom-aligned on the margin.
  - Badges in the clean, sunlit wall pocket between the shelf and the worktop.
  - Logo `6.png` top-left on the same axis as the masthead. No type within 32 px of the man.

## Revision: American laundry room (`--v4`, final)
- **Room** (`prompts/8_us-room-edit_keep-framing_used.txt`): edit pass on the previous photo, camera and man locked, only the right side restyled as a typical US modern-farmhouse laundry room: white shaker upper cabinets with black cup pulls, white subway-tile backsplash, butcher-block countertop over a white front-loading washer and matching dryer, black hanging rod with wooden hangers, seagrass basket of white towels, black-and-white patterned cement tiles; the left wall stays plain for the type. A first try (`7_us-room-edit_reframed_not-used.txt`) turned the room into a narrow alcove and moved the man left, removing the type wall, so it was redone. Two more generations (144 credits for this banner in all).
- **Typography**: same system as v3 (masthead `BACK IN THE` / `BLACK`, vertical `SAVE UP TO` / `35%` on the left wall). `BLACK` now runs across the plain upper-cabinet panels, above the handles (cap 173 px, 1019 wide). The badges move to a header line opposite the logo, right-aligned on the margin, because from the knee down the man reaches within 30 px of the only free tile pocket. No type within 32 px of the man.

## Revision: laundromat after `Payday-Toni.jpg` (`--v5`, final)
- **Photo** (`prompts/11_laundromat_wide_used.txt`): new generation with the Toni Black model's face and body as the first two references, the Drive reference `Payday-Toni.jpg` third for the place, camera angle, flash look and colours (an American coin laundromat: stainless commercial washers, worn red-and-white tile base, blue vinyl floor), then the singlet and the black boxer brief. Pose written as the reference's relaxed floor pose: sitting against the machines, one knee up with the forearm on it, the other leg stretched out, hands kept off the waistband so the boxer brief reads front-on under the flash. Framed wide so the machines and the man fill the upper half and the blue floor stays open below. The stretched foot runs out of the left edge.
- Two passes were not used: `9_laundromat_first_not-used.txt` (good pose, but the man and the machines filled the frame, leaving only a small floor corner for type) and `10_laundromat_reframe-edit_failed.txt` (asked to pull the camera back; it kept the framing and faded the stretched leg into the floor). Three generations in this round, 198 credits for the banner in all.
- **Typography** (`scripts/compose.py PHOTO CUTOUT OUT --v5`): all type on the open floor in charcoal (the blue floor gives about 5:1 contrast; white would be about 2.5:1). Left stack: logo, `BACK IN THE` (Zalando Bold, wide tracking), `BLACK` (Zalando Black, the largest that fits under the stretched leg in its own columns, cap 153 px). Bottom row on the margin: `SAVE UP TO` / `35%` (cap 127 px) left, the two badges right. Nothing within 48 px of the man or the knitted jumper. The man's face top-left and the type bottom-left give a Z reading path.

## Revision: type spread over the frame (`--v6`)
The v5 type sat in one block at the bottom. Rebuilt from open banner-layout guidance (Adobe, PMG, Quantcast, Linear Design, StackAdapt: one dominant offer, a small but consistent logo on an edge or with the brand line, deliberate negative space, asymmetric zones along the reading path) on the same photo, no credits:
- Top: pure photo. The steel machines have no calm edge for a logo (top-left luminance spread 58.7, top-right crowded by the number tag and the machine seam).
- Middle right, on the open floor beside the legs: the brand unit, logo `6.png` over `BACK IN THE` (Zalando Bold, wide tracking) over `BLACK` (Zalando Black), left-aligned on a second axis at 42% of the width.
- Bottom left: `SAVE UP TO` / `35%`, the dominant element (cap 208 px, 792 wide).
- Bottom right: the two badges, right-aligned on the margin, as the last stop.
Nothing within 48 px of the man, the open machine door, the shirt or the knitted jumper.

## Revision: typography rebuilt on two typography skill sets (`--v7`, final)
Feedback on v6: the typography was still very poor. Studied `jpoindexter/typography-skills` (hierarchy-and-scale, typography-layout-systems, typography-critique, microtypography) and the `banner-design` skill in `nextlevelbuilder/ui-ux-pro-max-skill`, then re-set the type on the same photo, no credits:
- Audit before taste: the blue floor is a mid-tone, so neither palette colour reached 4.5:1 on it (white 3.3:1, #282828 4.5:1 at best). That muddy contrast was the main reason v1 to v6 looked dirty. The floor is now burned toward the camera (linear-light multiply, hue kept, smooth from y 1180 to 1680, no band) and the type is white `#FFFFFF`; worst-case background under the type gives 5.7:1.
- Structural system (Elam): a bilateral masthead (logo `6.png` in `#282828`, centred on the clean steel panel of machine 12) plus one axial footer. Every footer element starts on the left margin or ends on the right margin; nothing floats on its own coordinate as in v6 (three unrelated x axes).
- One scale, ratio 1.5 from a 26 px base (26 / 39 / 58 / 88 / 132 / 197 / 296), no off-scale sizes: `35%` Zalando Black 296, `BACK IN THE BLACK` Zalando Black 88, `SAVE UP TO` Zalando Bold 39, badge labels Arimo Bold 26.
- `BACK IN THE BLACK` is one line tracked (+0.027 em, caps need positive tracking) to exactly the full measure, so it defines the frame both axes hang on.
- Hierarchy by size, weight and space, not size alone. Spacing is deliberately unequal: `SAVE UP TO` sits 27 px above `35%` (bound to it), the headline 59 px above (a separate group).
- Badges are a right column, icon over label, flush right; the stack spans exactly the cap height of `35%` (top on its cap line, bottom on its baseline). Icons are the same discs with the palette swapped (white disc, charcoal line) for the dark floor.
- Clearance: nothing within 48 px of the man or the knitted jumper.
