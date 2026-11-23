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
