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

  // Type.
  textPrimary: '#F7F5F0',
  textMuted: '#A8A2B8',

  // Sparingly, for emphasis frames.
  amber: '#F0A830',
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
 * Shot archetypes seen in the reference. Each maps to a different image prompt
 * so a 40-shot video does not look like 40 variations of one picture.
 */
export const SHOT_TYPES = {
  cutoutCollage: {
    id: 'cutoutCollage',
    weight: 3,
    describe: (subject) =>
      `Editorial paper cut-out collage of ${subject}. Halftone-printed archival photograph with visible torn paper edges and a subtle drop shadow, ` +
      `arranged on a flat ${PALETTE.inkDeep} background. Thin ${PALETTE.violet} geometric lines and small dots connecting elements. ` +
      `Muted desaturated palette with cream paper tones. Documentary infographic aesthetic, flat vector graphic style, no text, no lettering, no words.`,
  },
  archivalPhoto: {
    id: 'archivalPhoto',
    weight: 2,
    describe: (subject) =>
      `Archival documentary photograph of ${subject}, mid-20th-century press photo look. Grainy black and white with warm sepia cast, ` +
      `slightly overexposed highlights, visible film grain and dust. Composed on a dark ${PALETTE.ink} field with generous negative space. ` +
      `No text, no captions, no watermark.`,
  },
  technicalDrawing: {
    id: 'technicalDrawing',
    weight: 2,
    describe: (subject) =>
      `Antique technical patent illustration of ${subject}. Fine cream line-work on a ${PALETTE.inkDeep} background, cross-section view with ` +
      `thin leader lines and unlabelled callout dots. Engraving and blueprint hybrid, precise and clinical. No text, no numbers, no annotations.`,
  },
  engraving: {
    id: 'engraving',
    weight: 1,
    describe: (subject) =>
      `19th-century steel engraving of ${subject}. Dense cross-hatched linework in cream ink on aged ${PALETTE.paper} paper, ` +
      `high detail, encyclopaedic illustration style. Slight paper texture and foxing. No text, no lettering.`,
  },
  macroTexture: {
    id: 'macroTexture',
    weight: 2,
    describe: (subject) =>
      `Extreme macro photograph of the surface texture of ${subject}. Shallow depth of field, raking side light revealing grain and fibre, ` +
      `desaturated with a faint ${PALETTE.violet} colour cast in the shadows. Fills the frame. No text.`,
  },
  mapDiagram: {
    id: 'mapDiagram',
    weight: 1,
    describe: (subject) =>
      `Minimal editorial map diagram showing ${subject}. Simplified cream coastlines on ${PALETTE.inkDeep}, thin ${PALETTE.violet} route lines ` +
      `and small glowing nodes. Flat infographic style, no labels, no place names, no text of any kind.`,
  },
  objectOnVoid: {
    id: 'objectOnVoid',
    weight: 2,
    describe: (subject) =>
      `Single hero object — ${subject} — floating centred on a seamless ${PALETTE.inkDeep} background. Soft top-light with a long soft shadow, ` +
      `product-documentary lighting, muted colours, slight film grain. Editorial magazine still life. No text, no props, no background detail.`,
  },
};

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

/** Weighted round-robin so consecutive shots never share an archetype. */
export function planShotTypes(count) {
  const pool = [];
  for (const type of Object.values(SHOT_TYPES)) {
    for (let i = 0; i < type.weight; i += 1) pool.push(type.id);
  }
  const plan = [];
  let previous = null;
  for (let i = 0; i < count; i += 1) {
    const candidates = pool.filter((id) => id !== previous);
    const pick = candidates[(i * 7 + 3) % candidates.length];
    plan.push(pick);
    previous = pick;
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
