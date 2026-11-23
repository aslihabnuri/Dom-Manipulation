# Toni Black Payday Banner, November: BACK IN THE BLACK

`final/TONI-BLACK_Payday-Nov_Back-In-The-Black_1334x2000.jpg/.png` (same size as the October payday banner).

## Copy (exactly)
`BACK IN THE BLACK` (headline, chosen from the copy options: finance idiom for money back in order, plus the brand name and the product colour) / `SAVE UP TO` / `35%` / `FREE ONGKIR` / `VOUCHER` `NEW BUYERS 5K`. No other text.

## Photograph
Scene, pose and film look from the Drive reference `Payday.jpeg` (a man sitting on a washing machine in a yellow laundry room); model from `Referensi Model.png`; products: Toni Black white singlet (`Tanktop.jpg`) and black boxer brief (`6a.png`); barefoot. Nano Banana Pro, 2:3, four passes:
1. `prompts/1_scene.txt`: reference + model + singlet + boxer brief. Scene and products right, but the face drifted to the reference's bearded man and the pose came out upright.
2. `prompts/2_face-and-waistband-edit.txt`: edit pass, face replaced by the Toni Black model.
3. `prompts/3_pose-retry.txt`: owner asked for the exact, relaxed reference pose; a detailed pose description still came back upright.
4. `prompts/4_pose-silhouette_used.txt`: a flat grey silhouette of the reference pose (`pose_guide_silhouette.jpg`, no face, no clothes) as the first image, the pass-2 photo as scene and identity reference. Used: slumped against the wall, head tilted, arms loose, knees wide, left leg to the lower left. The man sits slightly more central than in the reference.
The waistband lettering came out light grey; it was reduced locally to 20% of its contrast so it reads as embossed black on black like `6a.png` (`final/photo_waistband-fixed.jpg`). Grade: the global BAU grade used on the other banners.
Credits: four generations at 18 credits each (72). The account balance read 8208.11 afterwards; it was 8741.61 on 13 November, so the rest of that drop was used outside this work.

## Typography
- Logo `6.png` charcoal, alone, top centre on the frosted window.
- `BACK IN` / `THE BLACK`: Zalando Black, centred, the largest size that keeps 48 px clear of the head (cap 112 px at 1334 wide).
- `SAVE UP TO` (Zalando Bold 34, tracked) over `35%` (Zalando Black, cap 125 px), right-aligned on the margin, on the clean yellow wall between the window sill and the laundry basket, 48 px clear of the man.
- Badges in the guideline icon style (truck, ticket) with Arimo Bold labels, stacked on the white appliance in the lower-left foreground, clear of the man's leg.
`scripts/compose.py PHOTO CUTOUT OUT [k]` (fonts via `TB_FONTS`).
