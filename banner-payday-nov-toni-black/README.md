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
