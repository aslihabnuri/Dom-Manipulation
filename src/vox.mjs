/**
 * The Vox look, reverse-engineered from the reference clip.
 *
 * Measurements taken from the attached video (576x1024, 46.4s):
 *   - 45 scene cuts in 43s of narration  → ~1.0s average shot length
 *   - one 0.21s pause in 43s of speech   → narration is effectively wall-to-wall
 *   - integrated loudness -16.7 LUFS, LRA 5.9 LU → tightly compressed, broadcast-style
 *   - backgrounds are never pure black; sampled darkest frame was #181319
 *
 * That last point is the thing the reference tutorial spends the most time on:
 * a tint effect maps black to a slightly-brighter, slightly-purple value so the
 * contrast stays subtle. Pure #000 reads as cheap; #14111C reads as editorial.
 */

export const PALETTE = {
  // Backgrounds — "map black to" targets, never #000000.
  inkDeep: '#14111C',
  ink: '#1B1724',
  inkSoft: '#241F30',

  // Vox's signature violet, used for lines, dots, charts, and accents.
  violet: '#8B5CF6',
  violetDeep: '#6D28D9',
  violetGlow: '#A78BFA',

  // Paper tones for cut-out collage and archival scans.
  cream: '#F5F1E8',
  paper: '#E8E1D3',
  sepia: '#C9B99B',
  newsprint: '#D9CDB8',

  // Type.
  textPrimary: '#F7F5F0',
  textMuted: '#A8A2B8',
  inkOnPaper: '#1E1C18',

  // Sparingly, for emphasis frames.
  amber: '#F0A830',
};

/**
 * The highlighter, from the second reference (@dodford's Premiere breakdown).
 *
 * Its colour picker reads H 58 / S 94 / B 100, which is #FFF70F — a saturated
 * marker yellow, not a soft pastel. The tutorial's three load-bearing details:
 *
 *   1. Blend mode multiply, so the text darkens through the ink instead of
 *      being covered by it.
 *   2. Vertical scale squashed and the box sitting low, because a real marker
 *      does not cover the full cap height.
 *   3. A Crop effect animated left-to-right with ease-in — the stroke is drawn,
 *      it does not fade in.
 *
 * libass reproduces all three: an opaque border box gives the ink, `\clip`
 * animated through `\t` gives the wipe, and `\frz` gives the hand-drawn tilt.
 */
export const HIGHLIGHT = {
  yellow: '#FFF70F',
  cyan: '#3BE0F0', // the second reference uses this variant for one word
  textColor: '#1E1C18',
  // Fraction of font size the ink extends above/below the baseline box.
  padTop: 0.66,
  padBottom: 0.46,
  padLeftRight: 26,
  tiltDegrees: 1.8,
  sweepMs: 420,
  // Marker strokes are never perfectly level; alternate the tilt direction.
  alternateTilt: true,
};

export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
  aspect: '9:16',
};

/** Audio targets copied from the reference measurement. */
export const AUDIO = {
  targetLufs: -16.5,
  loudnessRange: 6,
  truePeakDb: -1.5,
  musicDuckDb: -18, // music sits this far under narration
  sfxLevelDb: -12,
};

/** Editing rhythm. Shot length drives how many visuals we generate. */
export const RHYTHM = {
  averageShotSeconds: 1.15,
  minShotSeconds: 0.65,
  maxShotSeconds: 2.6,
  // Vox stacks 3-4 rapid cuts to punctuate a point; the reference does this
  // three times (at 11.0s, 15.6s, 28.6s).
  burstEveryNShots: 9,
  burstShotSeconds: 0.3,
};

/**
 * Story structure. This is what keeps a viewer to the end, and it is also what
 * keeps the video from reading as an ad: the product is never the subject, it is
 * the last beat of a story that was interesting on its own.
 */
export const STRUCTURE = [
  {
    id: 'hook',
    label: 'Kait',
    seconds: [0, 3],
    goal: 'Satu kalimat yang bikin penonton berhenti scroll. Fakta ganjil, angka mengejutkan, atau pertanyaan yang menohok. Dilarang menyapa penonton.',
  },
  {
    id: 'context',
    label: 'Latar',
    seconds: [3, 12],
    goal: 'Bangun dunia ceritanya. Kapan, di mana, siapa. Penonton harus merasa sedang menonton dokumenter, bukan iklan.',
  },
  {
    id: 'turn',
    label: 'Titik Balik',
    seconds: [12, 26],
    goal: 'Ada yang berubah — krisis, penemuan, atau perubahan zaman. Bagian ini yang bikin orang bertahan sampai habis.',
  },
  {
    id: 'insight',
    label: 'Wawasan',
    seconds: [26, 38],
    goal: 'Apa artinya buat penonton hari ini. Di sinilah produk boleh muncul, tapi sebagai contoh dari ide besarnya — bukan sebagai penawaran.',
  },
  {
    id: 'landing',
    label: 'Pendaratan',
    seconds: [38, 45],
    goal: 'Kalimat penutup yang menggema. Tanpa ajakan beli, tanpa "link di bio". Rasa penasaran yang bikin orang cek profil sendiri.',
  },
];

/**
 * Shot archetypes.
 *
 * The two references show two different background families, and cutting
 * between them is a large part of what gives the style its rhythm: dark
 * editorial fields for collage and diagram work, light archival paper for
 * documents and text cards. Each type declares its family so the shot planner
 * can alternate deliberately rather than by accident.
 */
export const SHOT_TYPES = {
  /* ── Dark family ─────────────────────────────────────────────────── */
  cutoutCollage: {
    id: 'cutoutCollage',
    label: 'Kolase potongan kertas',
    family: 'dark',
    weight: 3,
    describe: (subject) =>
      `Editorial paper cut-out collage of ${subject}. Halftone-printed archival photograph with visible torn paper edges and a subtle drop shadow, ` +
      `arranged on a flat ${PALETTE.inkDeep} background. Thin ${PALETTE.violet} geometric lines and small dots connecting elements. ` +
      `Muted desaturated palette with cream paper tones. Documentary infographic aesthetic, flat vector graphic style, no text, no lettering, no words.`,
  },
  archivalPhoto: {
    id: 'archivalPhoto',
    label: 'Foto arsip lama',
    family: 'dark',
    weight: 2,
    describe: (subject) =>
      `Archival documentary photograph of ${subject}, mid-20th-century press photo look. Grainy black and white with warm sepia cast, ` +
      `slightly overexposed highlights, visible film grain and dust. Composed on a dark ${PALETTE.ink} field with generous negative space. ` +
      `No text, no captions, no watermark.`,
  },
  technicalDrawing: {
    id: 'technicalDrawing',
    label: 'Gambar paten teknis',
    family: 'dark',
    weight: 2,
    describe: (subject) =>
      `Antique technical patent illustration of ${subject}. Fine cream line-work on a ${PALETTE.inkDeep} background, cross-section view with ` +
      `thin leader lines and unlabelled callout dots. Engraving and blueprint hybrid, precise and clinical. No text, no numbers, no annotations.`,
  },
  mapDiagram: {
    id: 'mapDiagram',
    label: 'Peta diagram',
    family: 'dark',
    weight: 1,
    describe: (subject) =>
      `Minimal editorial map diagram showing ${subject}. Simplified cream coastlines on ${PALETTE.inkDeep}, thin ${PALETTE.violet} route lines ` +
      `and small glowing nodes. Flat infographic style, no labels, no place names, no text of any kind.`,
  },
  objectOnVoid: {
    id: 'objectOnVoid',
    label: 'Produk di latar polos',
    family: 'dark',
    weight: 2,
    describe: (subject) =>
      `Single hero object — ${subject} — floating centred on a seamless ${PALETTE.inkDeep} background. Soft top-light with a long soft shadow, ` +
      `product-documentary lighting, muted colours, slight film grain. Editorial magazine still life. No text, no props, no background detail.`,
  },
  macroTexture: {
    id: 'macroTexture',
    label: 'Makro tekstur',
    family: 'dark',
    weight: 2,
    describe: (subject) =>
      `Extreme macro photograph of the surface texture of ${subject}. Shallow depth of field, raking side light revealing grain and fibre, ` +
      `desaturated with a faint ${PALETTE.violet} colour cast in the shadows. Fills the frame. No text.`,
  },

  /* ── Light family ────────────────────────────────────────────────── */
  agedNewsprint: {
    id: 'agedNewsprint',
    label: 'Koran menguning',
    family: 'light',
    weight: 2,
    describe: (subject) =>
      `Aged 1940s newspaper page about ${subject}, photographed flat. Yellowed ${PALETTE.newsprint} newsprint with visible fold creases, ` +
      `foxing spots and torn edge. Dense columns of small blurred body type that is illegible, no readable words. ` +
      `Soft even daylight, shallow depth of field falling off toward the edges. Archival document photography.`,
  },
  paperTexture: {
    id: 'paperTexture',
    label: 'Kertas tua',
    family: 'light',
    weight: 2,
    describe: (subject) =>
      `Sheet of aged cream ${PALETTE.cream} paper as a backdrop, faintly suggesting ${subject} through a soft watermark or ghosted impression. ` +
      `Visible paper fibre, subtle water stains and foxing, one soft crease. Even overhead light, mostly empty space. ` +
      `No text, no lettering, no writing of any kind.`,
  },
  engraving: {
    id: 'engraving',
    label: 'Ukiran gaya abad 19',
    family: 'light',
    weight: 2,
    describe: (subject) =>
      `19th-century steel engraving of ${subject}. Dense cross-hatched linework in dark ink on aged ${PALETTE.paper} paper, ` +
      `high detail, encyclopaedic illustration style. Slight paper texture and foxing. No text, no lettering.`,
  },
  blueprintOnPaper: {
    id: 'blueprintOnPaper',
    label: 'Sketsa teknis di kertas',
    family: 'light',
    weight: 1,
    describe: (subject) =>
      `Technical construction drawing of ${subject} on aged drafting paper. Faded graphite and ink lines, dimension arrows with no numbers, ` +
      `coffee ring stain in one corner, taped edge. Flat archival scan. No text, no annotations, no measurements.`,
  },
  concreteWall: {
    id: 'concreteWall',
    label: 'Dinding berpatina',
    family: 'light',
    weight: 1,
    describe: (subject) =>
      `Weathered pale concrete or plaster wall bearing faint traces of ${subject} — a ghost sign, a shadow, a worn painted mark. ` +
      `Cracks, patina and uneven grey-cream tone. Raking daylight. Mostly empty surface. No readable text, no lettering.`,
  },
};

/** Plain-Indonesian name for a shot type, for anything a person reads. */
export function labelOf(shotTypeId) {
  return SHOT_TYPES[shotTypeId]?.label || shotTypeId;
}

/** Which background family a shot type belongs to. */
export function familyOf(shotTypeId) {
  return SHOT_TYPES[shotTypeId]?.family || 'dark';
}

/**
 * The negative prompt is doing real work here. Generated text inside an image is
 * the single most obvious AI tell in this format — it comes out as garbled
 * pseudo-lettering — and this style has burned-in captions of its own, so any
 * text the model invents is both wrong and redundant.
 */
export const NEGATIVE_PROMPT = [
  'text', 'words', 'letters', 'lettering', 'typography', 'captions', 'subtitles',
  'watermark', 'signature', 'logo', 'brand name', 'numbers', 'writing',
  'human face', 'portrait', 'realistic person', 'deformed hands', 'extra fingers',
  'plastic 3d render', 'video game render', 'oversaturated', 'neon glow',
  'stock photo look', 'smiling model', 'AI artifacts', 'blurry', 'low quality',
].join(', ');

/**
 * Plan the shot archetypes for a whole video.
 *
 * Two constraints, both taken from the references: consecutive shots never
 * share an archetype, and the background family flips every few shots. The
 * flip is the bigger effect — a run of dark frames followed by a bright paper
 * frame is what makes the paper frame land, and it is why the second reference
 * cuts from a black title card to yellowed newsprint.
 */
export function planShotTypes(count, { runLength = 3 } = {}) {
  const byFamily = { dark: [], light: [] };
  for (const type of Object.values(SHOT_TYPES)) {
    for (let i = 0; i < type.weight; i += 1) byFamily[type.family].push(type.id);
  }

  const plan = [];
  let previous = null;
  // Open on the dark family: both references start dark and cut to paper.
  let family = 'dark';
  let sinceFlip = 0;

  for (let i = 0; i < count; i += 1) {
    if (sinceFlip >= runLength) {
      family = family === 'dark' ? 'light' : 'dark';
      sinceFlip = 0;
    }
    const pool = byFamily[family];
    const candidates = pool.filter((id) => id !== previous);
    const pick = candidates.length
      ? candidates[(i * 7 + 3) % candidates.length]
      : pool[i % pool.length];
    plan.push(pick);
    previous = pick;
    sinceFlip += 1;
  }
  return plan;
}

export function buildImagePrompt(subject, shotTypeId) {
  const type = SHOT_TYPES[shotTypeId] || SHOT_TYPES.cutoutCollage;
  return type.describe(subject);
}

/**
 * Caption styling matched to the reference: small, uppercase, condensed, bottom
 * third, white on a translucent dark pill.
 */
export const CAPTION_STYLE = {
  fontSize: 44,
  fontWeight: 700,
  letterSpacing: 1.5,
  uppercase: true,
  colorHex: 'FFFFFF',
  outlineHex: '000000',
  outlineWidth: 3,
  boxOpacity: 0.55,
  marginBottomPx: 320,
  maxCharsPerLine: 28,
  maxLines: 2,
};
