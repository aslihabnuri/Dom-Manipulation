import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from './log.mjs';

const log = logger('ffmpeg');

export class FfmpegError extends Error {
  constructor(message, stderr) {
    super(message);
    this.name = 'FfmpegError';
    this.stderr = stderr;
  }
}

export function run(args, { binary = 'ffmpeg', capture = 'stderr' } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('error', (error) =>
      reject(
        new FfmpegError(
          `Tidak bisa menjalankan ${binary}. Pastikan ffmpeg terpasang dan ada di PATH. (${error.message})`,
        ),
      ),
    );
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new FfmpegError(`${binary} keluar dengan kode ${code}`, stderr.slice(-4000)));
        return;
      }
      resolve(capture === 'stdout' ? stdout : stderr);
    });
  });
}

/** Is ffmpeg present, and which optional features does this build have? */
export async function probeToolchain() {
  try {
    const version = await run(['-hide_banner', '-version'], { capture: 'stdout' });
    const filters = await run(['-hide_banner', '-filters'], { capture: 'stdout' });
    return {
      ok: true,
      version: version.split('\n')[0],
      hasLibass: /\bsubtitles\b/.test(filters),
      hasDrawtext: /\bdrawtext\b/.test(filters),
      hasZoompan: /\bzoompan\b/.test(filters),
      hasLoudnorm: /\bloudnorm\b/.test(filters),
    };
  } catch (error) {
    return { ok: false, why: error.message };
  }
}

export async function probeDuration(file) {
  const out = await run(
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
    { binary: 'ffprobe', capture: 'stdout' },
  );
  const seconds = Number.parseFloat(out.trim());
  if (!Number.isFinite(seconds)) throw new FfmpegError(`Tidak bisa membaca durasi ${file}`);
  return seconds;
}

export async function measureLoudness(file) {
  const stderr = await run([
    '-hide_banner', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-',
  ]);

  // ebur128 prints a running measurement for every frame before the final
  // report, and the early lines read -70 LUFS because too little audio has been
  // seen to measure. Matching anywhere in the stream therefore picks up a
  // meaningless value from the first moments of the file — parse only the
  // trailing "Summary:" block.
  const summaryAt = stderr.lastIndexOf('Summary:');
  const summary = summaryAt === -1 ? '' : stderr.slice(summaryAt);

  const integrated = summary.match(/I:\s+(-?[\d.]+)\s+LUFS/);
  const range = summary.match(/LRA:\s+(-?[\d.]+)\s+LU/);
  const peak = summary.match(/Peak:\s+(-?[\d.]+)\s+dBFS/);

  return {
    lufs: integrated ? Number.parseFloat(integrated[1]) : null,
    lra: range ? Number.parseFloat(range[1]) : null,
    truePeak: peak ? Number.parseFloat(peak[1]) : null,
  };
}

/** Find frames that are (nearly) solid black — a classic render defect. */
export async function detectBlackFrames(file) {
  const stderr = await run([
    '-hide_banner', '-i', file,
    '-vf', 'blackdetect=d=0.15:pic_th=0.98:pix_th=0.10',
    '-f', 'null', '-',
  ]);
  const matches = [...stderr.matchAll(/black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)/g)];
  return matches.map((m) => ({
    start: Number.parseFloat(m[1]),
    end: Number.parseFloat(m[2]),
    duration: Number.parseFloat(m[3]),
  }));
}

/* ── Sound design ──────────────────────────────────────────────────────── */

/**
 * SFX synthesised on the fly rather than shipped as assets. Keeps the repo free
 * of licensed audio, and every cue is deterministic.
 */
export const SFX_RECIPES = {
  whoosh: {
    duration: 0.55,
    filter:
      'anoisesrc=d=0.55:c=pink:a=0.5,highpass=f=250,lowpass=f=5000,' +
      'afade=t=in:st=0:d=0.18,afade=t=out:st=0.22:d=0.33',
  },
  thud: {
    duration: 0.45,
    filter: 'sine=frequency=68:d=0.45,afade=t=out:st=0.03:d=0.42,volume=2.0',
  },
  paper: {
    duration: 0.3,
    filter:
      'anoisesrc=d=0.3:c=white:a=0.35,highpass=f=1800,lowpass=f=9000,' +
      'afade=t=in:st=0:d=0.03,afade=t=out:st=0.08:d=0.22',
  },
  click: {
    duration: 0.09,
    filter: 'sine=frequency=1650:d=0.09,afade=t=out:st=0:d=0.09,volume=0.8',
  },
  riser: {
    duration: 1.3,
    filter:
      'anoisesrc=d=1.3:c=white:a=0.4,highpass=f=400,' +
      "volume='pow(t/1.3\\,2)':eval=frame,afade=t=out:st=1.15:d=0.15",
  },
  drop: {
    duration: 0.8,
    filter:
      'sine=frequency=48:d=0.8,afade=t=out:st=0.05:d=0.75,volume=2.4',
  },
};

export async function renderSfx(kind, target) {
  const recipe = SFX_RECIPES[kind];
  if (!recipe) throw new FfmpegError(`Efek suara tidak dikenal: ${kind}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await run([
    '-hide_banner', '-y',
    '-f', 'lavfi', '-i', recipe.filter,
    '-ar', '48000', '-ac', '1',
    target,
  ]);
  return { file: target, duration: recipe.duration };
}

/* ── ASS subtitles ─────────────────────────────────────────────────────── */

function assTime(seconds) {
  const total = Math.max(0, seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const cs = Math.round((total % 1) * 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function escapeAss(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\N');
}

/** Greedily wrap into lines of at most `maxChars`, keeping words intact. */
function wrapLines(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Split a line into as many caption chunks as it needs.
 *
 * Truncating here would silently drop narration from the burned-in captions,
 * which is both a comprehension bug and an accessibility one. Instead we return
 * every chunk and let the caller spread them across the segment's duration —
 * which is also what the reference does, changing captions roughly once a second.
 */
export function chunkCaption(text, maxChars, maxLines) {
  const lines = wrapLines(text, maxChars);
  const chunks = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  return chunks.length ? chunks : [''];
}

/** #RRGGBB → the &HBBGGRR byte order ASS expects. */
function assColor(hex) {
  const clean = hex.replace('#', '');
  return `${clean.slice(4, 6)}${clean.slice(2, 4)}${clean.slice(0, 2)}`.toUpperCase();
}

/**
 * Rough text width in pixels.
 *
 * libass does the real layout, so this only has to be close enough to size the
 * wipe rectangle — a little generous is harmless because the ink box only
 * exists where the glyphs are, and revealing empty space either side shows
 * nothing.
 */
function estimateTextWidth(text, fontSize, serif) {
  const advance = serif ? 0.5 : 0.55;
  return text.length * fontSize * advance;
}

/**
 * A highlighter cue: dark text on a marker-yellow box that wipes in from the
 * left, tilted a degree or two off level.
 *
 * `\clip` sets the visible rectangle and `\t` animates it, which is libass's
 * equivalent of the Crop-effect keyframes the reference tutorial uses. The
 * sweep therefore *draws* the stroke rather than fading it in, which is the
 * whole point of the effect.
 */
function highlightOverride(cue, canvas, hl, fontSize, serif, lines) {
  // Size the wipe to the longest line, and to however many lines libass will
  // actually stack — a rectangle sized for one line would clip the second away
  // permanently, not just during the sweep.
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), '');
  const width = Math.min(
    estimateTextWidth(longest, fontSize, serif) + hl.padLeftRight * 2,
    canvas.width - 80,
  );
  const lineHeight = fontSize * 1.2;
  const blockHeight = lineHeight * lines.length;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const x1 = Math.round(centerX - width / 2);
  const x2 = Math.round(centerX + width / 2);
  const y1 = Math.round(centerY - blockHeight / 2 - fontSize * (hl.padTop - 0.6));
  const y2 = Math.round(centerY + blockHeight / 2 + fontSize * hl.padBottom);

  // Alternate the tilt so repeated highlights do not look stamped.
  const tilt = hl.alternateTilt && cue.index % 2 === 1 ? -hl.tiltDegrees : hl.tiltDegrees;

  return (
    `{\\frz${tilt}` +
    `\\clip(${x1},${y1},${x1},${y2})` +
    `\\t(0,${hl.sweepMs},\\clip(${x1},${y1},${x2},${y2}))}`
  );
}

/**
 * Build the burned-in caption track.
 *
 * Three styles, each from a reference: the bottom-third caption pill and the
 * centred serif statement card from the first, and the marker highlight from
 * the second. Which card style a segment uses depends on whether its shot sits
 * on a dark or a light background.
 */
export function buildAssFile({ cues, canvas, style, target }) {
  const header = [
    '[Script Info]',
    'ScriptType: v4.00+',
    `PlayResX: ${canvas.width}`,
    `PlayResY: ${canvas.height}`,
    'WrapStyle: 2',
    'ScaledBorderAndShadow: yes',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, ' +
      'Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, ' +
      'Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    // BorderStyle 3 draws an opaque box behind the text — the reference look.
    // Colours are &HAABBGGRR (alpha first, then BGR).
    `Style: Vox,${style.fontName},${style.fontSize},&H00FFFFFF,&H00FFFFFF,&H00000000,` +
      `&H${style.boxAlphaHex}000000,${style.bold ? -1 : 0},0,0,0,100,100,${style.letterSpacing},0,` +
      `3,${style.outlineWidth},0,2,80,80,${style.marginBottomPx},1`,
    // Statement card for dark backgrounds: light serif on a translucent panel.
    `Style: VoxCard,${style.cardFontName},${style.cardFontSize},&H00F0F5F7,&H00F0F5F7,&H00000000,` +
      '&H80000000,-1,0,0,0,100,100,2,0,1,3,0,5,80,80,0,1',
    // Statement card for light backgrounds: the marker highlight. BorderStyle 3
    // turns the outline into an opaque box, which is the ink.
    `Style: VoxHighlight,${style.highlightFontName},${style.highlightFontSize},` +
      `&H00${assColor(style.highlight.textColor)},&H00${assColor(style.highlight.textColor)},` +
      `&H00${assColor(style.highlight.yellow)},&H00000000,-1,0,0,0,100,100,1,0,3,` +
      `${Math.round(style.highlightFontSize * 0.16)},0,5,80,80,0,1`,
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ].join('\n');

  const events = cues.map((cue) => {
    const styleName =
      cue.kind === 'highlight' ? 'VoxHighlight' : cue.kind === 'card' ? 'VoxCard' : 'Vox';
    const isCard = cue.kind === 'card' || cue.kind === 'highlight';
    const raw = style.uppercase && !isCard ? cue.text.toUpperCase() : cue.text;

    // Cues arrive pre-chunked, so wrapping here only has to lay out the lines
    // that already fit; nothing can be dropped.
    const lines = wrapLines(raw, isCard ? 18 : style.maxCharsPerLine);
    const wrapped = lines.map((line) => escapeAss(line)).join('\\N');

    let override;
    if (cue.kind === 'highlight') {
      override = highlightOverride(
        cue,
        canvas,
        style.highlight,
        style.highlightFontSize,
        true,
        lines,
      );
    } else {
      // A short fade keeps cuts from strobing when captions change every second.
      override = '{\\fad(90,90)}';
    }

    return `Dialogue: 0,${assTime(cue.start)},${assTime(cue.end)},${styleName},,0,0,0,,${override}${wrapped}`;
  });

  const content = `${header}\n${events.join('\n')}\n`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  return target;
}

/** Escape a path for use inside an ffmpeg filter argument. */
export function escapeFilterPath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}
