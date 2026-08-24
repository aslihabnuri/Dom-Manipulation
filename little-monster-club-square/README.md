# Little Monster Club, square cut

Rebuilds the 9:16 Little Monster Club story poster as a 1080 x 1080 Instagram
feed advert, plus the caption and messaging copy that goes with it.

## What is here

| File | What it does |
| --- | --- |
| `square-cut.html` | The layout. Runs as a browser tool and is the file published as the Artifact. |
| `render.js` | Headless renderer. Drives `square-cut.html`, so there is only one implementation of the layout. |
| `copy.md` | Caption, welcome message and pre-filled message, in English and Indonesian. |
| `fonts/` | The woff2 faces, so `render.js` works without network access. |
| `assets/` | Where you drop `photo.jpg`, `logo.png` and `qr.png`. Empty on purpose. |
| `out/preview.png` | The layout on a placeholder background. |

## You need the photo layer, not the exported story

The story poster is a flattened JPG with the wording burned into the pixels.
Every 1:1 window you could cut from it still contains some of that old text, so
there is no crop that gives a clean background.

What works is the photo on its own, the shot of the two girls before any type
was placed over it. That will be a layer in the Canva or Figma file, or the
original camera file.

The logo and the QR code are different: both sit on flat backgrounds in the
story, so they cut out of the flattened export cleanly. The builder does that
for you under **Lift from the story**.

## Running it

In the browser, open the published Artifact, drop the photo in, frame it,
press Render, then right click the result and save it.

From the command line:

```bash
npm install playwright                 # browsers are already on this machine
node render.js --photo assets/photo.jpg --logo assets/logo.png --qr assets/qr.png
```

Options:

```
--out <path>      where to write            default out/little-monster-club-1x1.png
--photo <path>    background photo
--logo <path>     logo PNG, white on transparent
--qr <path>       QR code PNG
--story <path>    flattened 9:16 export, logo and QR get cut out of it
--zoom <100..260> crop zoom, percent         default 100
--x <0..100>      horizontal focal point     default 50
--y <0..100>      vertical focal point       default 34
--time "16.00 to 17.30"   optional third line under the days
--no-scrim        turn off the contrast lift behind the type
```

## What changed from the story version

The square has 44 percent less height to work with, so the three words are set
smaller than in the story and stacked more tightly. Everything else holds:
same word order, same colour ladder, same logo position, same QR corner.

**The spelling is corrected.** The story artwork reads `TUEDAY`. This build
says `TUESDAY`.

## Typefaces

The brand faces are not public, so the closest open equivalents are used:

- **Baloo 2 ExtraBold** for `little monster club` and `scan for registration`.
  It matches the circular `o` and the curved tail on the `t`, which is what
  makes the original wordmark recognisable.
- **Archivo, width 85, weight 900** for the day line.

If you have the real brand fonts, swap the files in `fonts/` and update the
`@font-face` blocks at the top of `square-cut.html`.

## Colours

Sampled off the poster. All three are editable in the builder.

| Word | Hex |
| --- | --- |
| little | `#F2E800` |
| monster | `#DF9AC7` |
| club | `#8FBCA6` |
