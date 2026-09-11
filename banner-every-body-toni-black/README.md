# Toni Black "Made for Every Body" Banner

2:3 banner (1600×2400; retina 3200×4800). One message in one picture: four men of different builds, slim to big, standing shoulder to shoulder in the same black Toni Black boxer on the BAU set, so the lineup itself shows the size range. The sizes S to XXXL run under their feet like a scale, and the six product benefits sit beneath as an icon row.

## Deliverables (`final/`)
| File | Use |
|---|---|
| `TONI-BLACK_Every-Body-Banner_1600x2400.jpg/.png` | Upload size |
| `TONI-BLACK_Every-Body-Banner_3200x4800.jpg` | Retina |
| `photo_generated.jpg` / `photo_graded-BAU.jpg` | Group photo before and after the BAU colour match (strength 0.6) |

## Concept (why a lineup)
Show, don't claim. A line of real-looking bodies wearing the same product communicates "for everyone" faster than any sentence, and the order (slim to big) doubles as the size scale. Faces look straight at the camera, calm and at ease: no shame and no caricature, in line with the brand's "calm confidence".

## Typography (decisions by rule)
- **One centre axis.** The subject is a symmetrical lineup, so logo, headline, subline, size run and icon row all sit on the centre axis.
- **Three groups, three fields.** Headline and subline on the clean wall above the heads; the size run on the floor directly under the feet; the icon row on the floor below. Wall and floor are extended locally (stretched edge rows, feathered) so no group touches the figures. The 4:5 draft was rejected because the subline hit the heads and the size run crossed the ankles.
- **Headline from the measure.** `MADE FOR / EVERY BODY.` fitted to 70% of the width, Zalando Sans Expanded Black, leading 1.0; `EVERY BODY.` carries the double meaning.
- **Subline.** `One fit for every shape. Sizes S to XXXL.` Arimo Regular, gap 2x its leading, Davi's Grey.
- **Size run as a scale.** Six sizes on six equal cells across the measure, Zalando SemiBold 34 px tracked, aligned with the icon cells below so the two rows share one grid.
- **Icon row.** Six charcoal discs with white line icons, tracked-caps labels, two lines where needed, no hyphen at a line break.

## Pipeline
1. `prompts/prompt_every.txt` with Nano Banana Pro, `aspect_ratio 4:5`, 2K, three references: the Toni Black model, the men's boxer, the BAU photo (set, light, grade). First generation.
   `prompts/prompt_every2.txt`: the re-shoot used in the final. Same four men, spaced apart, wide grounded stances, arms crossed / hands on hips / thumbs in the waistband, direct serious gaze. `prompts/prompt_every3c.txt`: the final photography pass on top of it. Camera at waist height (low angle reads dominant), hard window key from camera-left with low fill so the light sculpts the bodies, rim on the shoulders, spacing kept, hands given a job per man (thumbs in waistband, arms folded high, fists on the waistband, hand on the neck), chin level, eyes narrowed, no eye contact between the men. Four generations in total.
2. `scripts/grade.py`: colour match to the BAU photo, local.
3. `scripts/compose.py PHOTO OUT [scale] [head_y] [run_y] [icon_y]` (final: `1 0.075 0.80 0.855`).
4. `scripts/icons.py`, `scripts/logo.py` (vector rebuild; swap in the official logo before print).

## Alternatives (same message, different visual)
Both keep the copy, the size run and the six benefits. What changes is the visual code.

- **Alt A, dark panels** (`alternatives/…Alt-A_Dark-Panels…`, `prompts/prompt_alt_a.txt`, `scripts/compose_alt_a.py`). Four separate portraits, one man per panel, never in the same frame, so no relation between the men can be read. Low key on Dark Charcoal, one hard key light from high camera-left, split light with deep shadow: the tonal key of sport and strength, not fashion. Each man is doing something (guard up, mid-stride, catching breath, braced), not presenting himself to the camera. Panels sit full bleed with gutters of background, no rules.
- **Alt B, rooftop** (`alternatives/…Alt-B_Rooftop…`, `prompts/prompt_alt_b.txt`). One man, environmental portrait: raw concrete rooftop, hard low sun, long shadow, walking toward the camera mid-stride, eyes past the lens. The setting and the action carry the masculinity; the size run and the icons carry the "every body" promise. Photo widened locally at the edges (stretched, feathered) to sit full bleed under the type.
- **Alt C, clean dark** (`alternatives/…Alt-C_Clean-Dark…`, `prompts/prompt_alt_c.txt`, `scripts/respace.py`, `scripts/compose_dark.py`). Alt A without panels: one photograph, the same four action poses, low key. The generator placed the men too close, so the separation was done locally at no credit cost: rembg cutout, the third and fourth man split along a minimum-alpha seam, the backdrop rebuilt by horizontal interpolation under a dilated mask, the four men scaled to 78% and re-spaced with equal gaps on their original floor line, soft contact shadows added. Type white on Dark Charcoal, icons inverted, same grid as the main banner.

## No-model versions (`no-model/`)
Same copy, same size run, same six benefits, no people. The product carries the "every body" claim on its own.

- **Nested flat-lay** (`prompts/prompt_nm_a.txt`, light compositor). Six sizes S to XXXL laid flat and nested, smallest on top, waistbands aligned so the six rings read as one growing form. Top-down, warm off-white paper as in the BAU set, one hard light from the upper left so each layer throws its own shadow. Gestalt: six objects read as one figure, which is the message (one design, every size).
- **Floating six** (`prompts/prompt_nm_b.txt`, dark compositor). Six sizes suspended in a dark studio on a receding diagonal, smallest in front, largest at the back, each in its wearing shape as if on an invisible body. Hard key from camera-left plus rim from behind, so the black product is drawn by light edges against Dark Charcoal. The diagonal is the size scale; the size run below is its caption.
- **Floating six, mixed cuts** (`prompts/prompt_nm_c.txt`, one edit pass on the floating six). Positions 2, 4 and 6 replaced with the Toni Black brief from Drive (`Brief dewasa/2.png`); 1, 3 and 5 stay the boxer brief. No Modal Cloud brief exists in the Drive product folders, so it is not shown. Headline changed to `EVERY SIZE. / EVERY STYLE.` because the picture now makes two claims (size range and cut range) and one umbrella line has to hold both; a second render carries `YOUR SIZE / IS HERE.` for comparison. Subline names the cuts and the size range.
- **Three cuts** (`no-model/…Three-Cuts…`, `prompts/prompt_nm_d.txt`, `scripts/compose_three.py`). The receding diagonal hid the back garments, so the range could not be read. Fix from composition theory: for a range, give every item equal emphasis, same plane, same scale, same light, evenly spaced (Gestalt similarity and proximity). Three garments from Drive floating side by side: Modal Cloud brief (`Brief dewasa`), boxer brief (`Boxer dewasa`), boxer (`Brief dewasa B`, button fly). Names set under each garment on its own axis (`BRIEF`, `BOXER BRIEF`, `BOXER`). Headline back to `MADE FOR / EVERY BODY.`; subline is one plain sentence, `A fit for every shape and every size.`, no clipped fragments. Benefits set as a two-column, three-row grid (icon beside label) as wide as the headline measure, so the block reads as one unit instead of a strip across the bottom. Final call: `compose_three.py PHOTO OUT 1 0.075 300 500 0.60 0.665 0.725`. Background is the full photo stretched and blurred with a 300 px feather so there is no tonal band at the photo edges.

### Three cuts, final layout (`scripts/compose_three2.py`)
Positions are no longer fractions of the canvas; the page is set as a vertical flow on a 24 px unit, measured group by group, so gaps come from the type, not from guesses. Top margin 150, logo 340 wide, 112 to the headline, 56 to the subline, 170 to the garments, 108 to the names, 132 to the size run, 164 to the benefits, benefit rows on a 196 px pitch, 178 left at the bottom (the largest margin, as the page canon asks). Subline set at half the headline cap height (48 px at 1600 wide) so it survives a marketplace thumbnail; names 28 px, size run 40 px, benefit labels 24 px beside 112 px discs. Call: `compose_three2.py PHOTO OUT 1 150 340 112 56 170 108 132 164 196`.
