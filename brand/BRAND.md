# Nomukita — brand kit

Distilled from `nomukita-brand-guidelines-vol01.pdf` (Vol.01 / 2026) for banner and
social production. The deck is the source of truth; this file is the working summary.

## Assets

| File | Use |
|---|---|
| `logo/nomukita-wordmark.svg` | Primary. All horizontal media. 1718×210 viewBox. |
| `logo/nomukita-stacked.svg` | Tight spaces and square formats. 975×462. |
| `logo/nomukita-logomark.svg` | Blue dot alone — avatars, favicons, corner mark. |
| `logo/nomukita-wordmark-source.png` | Raster extracted from the deck, for reference. |

The deck contains no vector logo — only raster images (wordmark 1734×226, stacked
208×114, logomark 512×512). The SVGs above were traced from those rasters and
verified against the source: mean per-pixel difference 0.77/255, with 0.15% of
pixels differing by more than 32. If an original vector exists, prefer it.

## Palette

| Token | Hex | Role |
|---|---|---|
| Bone White | `#F5F3EE` | Primary background |
| Charcoal | `#1C1C1C` | Primary text |
| Nomu Blue | `#5E98BD` | Signature accent |
| Matcha Green | `#7A9A3F` | Matcha category |
| Dark Cocoa | `#3B2418` | Cocoa category |

One accent colour per composition.

## Typography

- **Display** — All Round Gothic Bold, 72–168px, all caps
- **Body** — Comfortaa, 24–34px, line-height 1.55
- **Japanese accent** — Shippori Mincho, always smaller than the headline

Comfortaa and Shippori Mincho are OFL and free; run `fonts/install.sh` to fetch them.
All Round Gothic is a commercial typeface and is not included — see the open
questions below.

## Logo rules

- Clear space on every side = **1x**, the height of the blue dot. Keep it empty.
- Minimum width: 120px digital, 25mm print. Logomark minimum 16px.
- On social tiles the blue dot sits **bottom-right**, 1x from the edge, never
  covering the subject.
- Never recolour, tilt, stretch, add shadows, place on busy backgrounds, or swap
  the typeface.

## Voice

Calm. Educational. Precise. Confident.

Headlines are English, short, all caps — "BRING THE CAFE HOME". Body copy is warm
and lowercase, explaining without lecturing. Japanese is thin decoration: kanji and
katakana as accents, never full sentences, never as large as the headline.

Explicitly off-brand: shouting in caps with exclamation marks, unproven claims,
mascots, and loud neon-and-discount layouts.

## Open questions

Three things in the deck need a decision before production work is final.

**1. Which blue is the real one.** The palette page documents Nomu Blue as
`#5E98BD`, and the brand-assets tile on page 10 renders exactly that. But the logo
artwork — cover, primary wordmark, stacked, and logomark alike — is `#44B4D9`, a
noticeably brighter cyan. These are different colours, and the dot is the most
repeated element in the system. The SVGs currently carry `#44B4D9` so they match
the deck's own logo; `tokens.css` carries both.

**2. All Round Gothic licensing.** The deck specifies "All Round Gothic Bold", but
the PDF actually embeds the *Medium* and *Demi* weights, subsetted. It is a
commercial face (Dharma Type) and is not redistributable, so headline setting needs
either a licensed copy or an agreed substitute.

**3. Marketplace conventions vs. brand voice.** Tokopedia and Shopee store banners
conventionally lean on large discount badges, urgency copy, and saturated colour —
the exact register this brand rules out. Whether banners hold the calm line or bend
toward marketplace norms is a positioning decision, not a design one.
