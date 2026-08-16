import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { logger } from '../log.mjs';
import { CANVAS, PALETTE, AUDIO, CAPTION_STYLE, RHYTHM, HIGHLIGHT, familyOf } from '../vox.mjs';
import { planMotion } from './visuals.mjs';
import {
  run,
  probeDuration,
  renderSfx,
  buildAssFile,
  chunkCaption,
  escapeFilterPath,
} from '../ffmpeg.mjs';

const log = logger('rakit');

/** Below this, a caption flashes past before it can be read. */
const MIN_CAPTION_SECONDS = 0.7;

/* ── Fonts ─────────────────────────────────────────────────────────────── */

/**
 * Pick fonts that actually exist on this machine. libass resolves by family
 * name through fontconfig, so we ask fontconfig what is installed rather than
 * hardcoding a family that may be missing.
 */
function pickFont(candidates, fallback) {
  for (const family of candidates) {
    try {
      const out = execFileSync('fc-match', ['-f', '%{family}', family], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      // fc-match always returns something; only accept a real match.
      if (out && out.toLowerCase().includes(family.split(' ')[0].toLowerCase())) return family;
    } catch {
      // fontconfig missing — fall through to the fallback family.
    }
  }
  return fallback;
}

export function resolveFonts() {
  return {
    caption: pickFont(
      ['Liberation Sans Narrow', 'DejaVu Sans Condensed', 'Arial Narrow', 'DejaVu Sans', 'Helvetica'],
      'DejaVu Sans',
    ),
    card: pickFont(
      ['Playfair Display', 'DejaVu Serif', 'Liberation Serif', 'Georgia', 'Times New Roman'],
      'DejaVu Serif',
    ),
    // The second reference sets highlighted words in a marker/brush face. Fall
    // back to a heavy serif, which still reads as editorial under the ink.
    highlight: pickFont(
      ['Permanent Marker', 'Caveat', 'Bricolage Grotesque', 'DejaVu Serif', 'Georgia'],
      'DejaVu Serif',
    ),
  };
}

/* ── Timing ────────────────────────────────────────────────────────────── */

/**
 * Turn per-segment voice durations into a shot timeline.
 *
 * Shot length follows the narration, not a fixed grid — that is what makes the
 * cut feel motivated rather than mechanical. A segment whose line runs long gets
 * split into two shots so no single image sits on screen past the point where
 * the reference would have cut.
 */
export async function buildTimeline(takes) {
  const timeline = [];
  let clock = 0;

  for (const take of takes) {
    const duration = await probeDuration(take.file);
    // A breath after each line. The reference has essentially none mid-video,
    // so this is deliberately small.
    const gap = 0.06;
    timeline.push({
      segmentIndex: take.segmentIndex,
      audioFile: take.file,
      start: clock,
      duration,
      end: clock + duration,
      // Present when the voice engine reported word boundaries. Optional on
      // purpose: an engine that cannot report them still produces a usable
      // video, just with captions timed by character count instead.
      words: take.words || null,
    });
    clock += duration + gap;
  }

  return { entries: timeline, totalDuration: clock };
}

/**
 * Split long segments across multiple shots so the average shot length stays in
 * the range measured from the reference (~1.15s).
 */
export function planShots(timeline, shots) {
  const plan = [];
  for (const entry of timeline.entries) {
    const image = shots.find((s) => s.index === entry.segmentIndex && s.ok);
    if (!image) continue;

    const slices = Math.max(1, Math.round(entry.duration / RHYTHM.averageShotSeconds));
    const sliceDuration = entry.duration / slices;

    for (let i = 0; i < slices; i += 1) {
      plan.push({
        image: image.file,
        segmentIndex: entry.segmentIndex,
        start: entry.start + i * sliceDuration,
        duration: Math.max(RHYTHM.minShotSeconds, sliceDuration),
        // Reuse the same still across its slices but change the move, so a long
        // line reads as several camera angles rather than one slow drift.
        sliceIndex: i,
        // Carried through so the caption layer knows whether this moment sits on
        // a dark or a light background, and can pick the matching card style.
        family: familyOf(image.shotType),
      });
    }
  }
  return plan;
}

/* ── Video ─────────────────────────────────────────────────────────────── */

/** Render one still into a moving clip. */
async function renderShotClip({ image, duration, motion, target }) {
  const frames = Math.max(2, Math.round(duration * CANVAS.fps));
  const { zoomFrom, zoomTo, panX, panY } = motion;

  // Oversample before zoompan; zooming a 1080-wide source produces visible
  // softening, zooming a 2160-wide one does not.
  const zoomExpr = `${zoomFrom}+(${zoomTo}-${zoomFrom})*on/${frames}`;
  const xExpr = `iw/2-(iw/zoom/2)+(${panX}*iw*on/${frames})`;
  const yExpr = `ih/2-(ih/zoom/2)+(${panY}*ih*on/${frames})`;

  const vf = [
    `scale=${CANVAS.width * 2}:${CANVAS.height * 2}:force_original_aspect_ratio=increase`,
    `crop=${CANVAS.width * 2}:${CANVAS.height * 2}`,
    `zoompan=z='${zoomExpr}':x='${xExpr}':y='${yExpr}':d=${frames}:s=${CANVAS.width}x${CANVAS.height}:fps=${CANVAS.fps}`,
    'setsar=1',
  ].join(',');

  await run([
    '-hide_banner', '-y',
    '-loop', '1', '-i', image,
    '-vf', vf,
    '-frames:v', String(frames),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16',
    '-pix_fmt', 'yuv420p',
    target,
  ]);
  return target;
}

/**
 * The Vox grade.
 *
 * `colorlevels` is the key move and comes straight from the reference tutorial:
 * output black is lifted off zero to a slightly violet charcoal so the contrast
 * stays subtle. Grain and vignette sit on top; both are what a human editor adds
 * and what generated footage conspicuously lacks.
 */
function voxGradeFilter() {
  const toUnit = (hex) => Number.parseInt(hex, 16) / 255;
  const r = toUnit(PALETTE.inkDeep.slice(1, 3));
  const g = toUnit(PALETTE.inkDeep.slice(3, 5));
  const b = toUnit(PALETTE.inkDeep.slice(5, 7));

  return [
    `colorlevels=romin=${r.toFixed(4)}:gomin=${g.toFixed(4)}:bomin=${b.toFixed(4)}:romax=0.96:gomax=0.96:bomax=0.98`,
    'eq=saturation=0.88:contrast=1.05:gamma=0.98',
    // Temporal + uniform grain. Low amplitude: enough to break up flat gradients
    // and defeat banding, not enough to read as a filter.
    'noise=alls=6:allf=t+u',
    'vignette=PI/5',
  ].join(',');
}

/* ── Audio ─────────────────────────────────────────────────────────────── */

/**
 * Build the full mix: narration, sound effects on their cues, optional music
 * ducked underneath, then loudness-normalised to the reference's target.
 */
async function buildAudio({ timeline, segments, workDir, musicFile, target }) {
  // 1. Concatenate the narration with the planned gaps.
  const voList = path.join(workDir, 'vo-list.txt');
  const silenceFile = path.join(workDir, 'gap.wav');
  await run([
    '-hide_banner', '-y', '-f', 'lavfi',
    '-i', 'anullsrc=r=48000:cl=mono:d=0.06',
    silenceFile,
  ]);

  const lines = [];
  const abs = (f) => path.resolve(f).replace(/'/g, "'\\''");
  for (const entry of timeline.entries) {
    lines.push(`file '${abs(entry.audioFile)}'`);
    lines.push(`file '${abs(silenceFile)}'`);
  }
  fs.writeFileSync(voList, lines.join('\n'));

  const voFile = path.join(workDir, 'vo.wav');
  await run([
    '-hide_banner', '-y', '-f', 'concat', '-safe', '0', '-i', voList,
    '-ar', '48000', '-ac', '1', voFile,
  ]);

  // 2. Render each requested sound effect once, and note where it lands.
  const cues = [];
  for (const entry of timeline.entries) {
    const segment = segments.find((s) => s.index === entry.segmentIndex);
    if (!segment?.sfx) continue;
    const file = path.join(workDir, `sfx-${segment.sfx}-${entry.segmentIndex}.wav`);
    if (!fs.existsSync(file)) await renderSfx(segment.sfx, file);
    // Risers lead the beat; everything else lands on it.
    const lead = segment.sfx === 'riser' ? 1.1 : 0.05;
    cues.push({ file, atMs: Math.max(0, Math.round((entry.start - lead) * 1000)) });
  }

  // 3. Mix. Inputs: narration, then each SFX, then music if supplied.
  const inputs = ['-i', voFile];
  for (const cue of cues) inputs.push('-i', cue.file);
  if (musicFile) inputs.push('-i', musicFile);

  const filters = [];
  const mixLabels = ['[0:a]'];

  cues.forEach((cue, i) => {
    const label = `[s${i}]`;
    filters.push(
      `[${i + 1}:a]adelay=${cue.atMs}|${cue.atMs},volume=${dbToLinear(AUDIO.sfxLevelDb).toFixed(3)}${label}`,
    );
    mixLabels.push(label);
  });

  if (musicFile) {
    const musicIndex = 1 + cues.length;
    // Duck the bed under the narration instead of riding a static level, so the
    // music can actually be heard in the gaps.
    filters.push(
      `[${musicIndex}:a]aloop=loop=-1:size=2e9,atrim=0:${timeline.totalDuration.toFixed(2)},` +
        `volume=${dbToLinear(AUDIO.musicDuckDb).toFixed(3)},afade=t=out:st=${Math.max(0, timeline.totalDuration - 2).toFixed(2)}:d=2[music]`,
      `[music][0:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=350[ducked]`,
    );
    mixLabels.push('[ducked]');
  }

  filters.push(
    `${mixLabels.join('')}amix=inputs=${mixLabels.length}:normalize=0:duration=longest[mixed]`,
    // Two-pass-style loudness normalisation to the measured reference target.
    `[mixed]loudnorm=I=${AUDIO.targetLufs}:LRA=${AUDIO.loudnessRange}:TP=${AUDIO.truePeakDb}[out]`,
  );

  await run([
    '-hide_banner', '-y',
    ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[out]',
    '-ar', '48000', '-ac', '2',
    '-c:a', 'aac', '-b:a', '192k',
    target,
  ]);

  return { file: target, sfxCount: cues.length, hasMusic: Boolean(musicFile) };
}

function dbToLinear(db) {
  return 10 ** (db / 20);
}

/* ── Captions ──────────────────────────────────────────────────────────── */

/**
 * How long each caption chunk should stay up, measured from the voice itself.
 *
 * Returns null when the engine reported no word boundaries, or when the words
 * it reported cannot be matched to the chunks — a silent mismatch here would
 * desynchronise the whole segment, so a clean bail-out to the character-count
 * estimate is safer than a partial answer.
 */
export function spansFromWords(chunks, entry) {
  const words = entry.words;
  if (!words?.length) return null;

  const spans = [];
  let cursor = 0;
  let elapsed = 0;

  for (let i = 0; i < chunks.length; i += 1) {
    const count = chunks[i].split(/\s+/).filter(Boolean).length;
    const last = words[cursor + count - 1];
    if (!last) return null;
    cursor += count;

    // The final chunk runs to the end of the audio rather than to the end of
    // the last word, so the caption does not blink off during the tail of the
    // sentence — MP3 padding and the speaker's own decay both live in there.
    const until = i === chunks.length - 1 ? entry.duration : last.mulai + last.durasi;
    spans.push(Math.max(0, until - elapsed));
    elapsed = until;
  }

  // Every word must be accounted for; a leftover means the caption text and the
  // spoken text disagree, and the timings cannot be trusted.
  return cursor === words.length ? spans : null;
}

function buildCues(timeline, segments, shotPlan) {
  const cues = [];
  let highlightIndex = 0;

  /** Which background family is on screen at this moment. */
  const familyAt = (time) => {
    const shot = shotPlan.find((s) => time >= s.start && time < s.start + s.duration);
    return shot?.family || 'dark';
  };

  for (const entry of timeline.entries) {
    const segment = segments.find((s) => s.index === entry.segmentIndex);
    if (!segment) continue;

    // A long line becomes several sequential caption cards rather than one
    // truncated card.
    const chunks = chunkCaption(
      segment.voiceover,
      CAPTION_STYLE.maxCharsPerLine,
      CAPTION_STYLE.maxLines,
    );
    // Prefer real word timings: the card then changes on the frame the first
    // word of the next chunk is spoken. Character count is a decent proxy but
    // it drifts within a line — an unhurried opening clause followed by a
    // rattled-off closing one puts the switch visibly early.
    let spans = spansFromWords(chunks, entry) ||
      (() => {
        const totalChars = chunks.reduce((sum, c) => sum + c.length, 0) || 1;
        return chunks.map((c) => entry.duration * (c.length / totalChars));
      })();

    // A trailing fragment can end up with a fraction of a second, which is not
    // long enough to read. Lift anything under the floor and take the time back
    // from the chunks that have room to spare.
    const floor = Math.min(MIN_CAPTION_SECONDS, entry.duration / chunks.length);
    let deficit = 0;
    spans = spans.map((s) => {
      if (s < floor) {
        deficit += floor - s;
        return floor;
      }
      return s;
    });
    if (deficit > 0) {
      const surplus = spans.reduce((sum, s) => sum + Math.max(0, s - floor), 0);
      if (surplus > 0) {
        spans = spans.map((s) => (s > floor ? s - ((s - floor) / surplus) * deficit : s));
      }
    }

    let cursor = entry.start;
    chunks.forEach((chunk, i) => {
      cues.push({
        kind: 'caption',
        text: chunk.replace(/\n/g, ' '),
        start: cursor,
        end: cursor + spans[i],
      });
      cursor += spans[i];
    });

    // The big editorial statement card, when the writer asked for one. It sits
    // centred and overlaps the caption, exactly as in the references.
    //
    // Which treatment it gets depends on what is behind it: light serif on a
    // translucent panel over a dark frame, or the marker highlight over paper.
    // Using the highlight on a dark frame would be wrong twice over — the ink
    // would glow rather than mark, and the dark text would vanish.
    if (segment.onScreenText) {
      const cardStart = entry.start + 0.1;
      const onLightPaper = familyAt(cardStart) === 'light';
      cues.push({
        kind: onLightPaper ? 'highlight' : 'card',
        text: segment.onScreenText,
        start: cardStart,
        end: Math.min(entry.end, cardStart + 1.6),
        index: onLightPaper ? highlightIndex++ : 0,
      });
    }
  }
  return cues;
}

/* ── Orchestration ─────────────────────────────────────────────────────── */

export async function assembleVideo({
  segments,
  takes,
  shots,
  workDir,
  outputFile,
  musicFile = null,
  onProgress,
}) {
  fs.mkdirSync(workDir, { recursive: true });
  const clipDir = path.join(workDir, 'clips');
  fs.mkdirSync(clipDir, { recursive: true });

  onProgress?.({ stage: 'rakit', message: 'Menghitung linimasa dari durasi dubbing' });
  const timeline = await buildTimeline(takes);
  const shotPlan = planShots(timeline, shots);
  const motions = planMotion(shotPlan.length);

  log.info(
    `Linimasa: ${timeline.entries.length} segmen, ${shotPlan.length} shot, ` +
      `${timeline.totalDuration.toFixed(1)} detik ` +
      `(rata-rata ${(timeline.totalDuration / shotPlan.length).toFixed(2)}s per shot)`,
  );

  // 1. Motion clips.
  const clipFiles = [];
  for (let i = 0; i < shotPlan.length; i += 1) {
    const shot = shotPlan[i];
    const target = path.join(clipDir, `clip-${String(i).padStart(3, '0')}.mp4`);
    onProgress?.({ stage: 'rakit', message: `Klip ${i + 1}/${shotPlan.length}` });
    await renderShotClip({
      image: shot.image,
      duration: shot.duration,
      motion: motions[i],
      target,
    });
    clipFiles.push(target);
  }

  // 2. Concatenate.
  onProgress?.({ stage: 'rakit', message: 'Menyambung klip' });
  const concatList = path.join(workDir, 'clips.txt');
  // The concat demuxer resolves relative paths against the list file's own
  // directory, so entries must be absolute.
  fs.writeFileSync(
    concatList,
    clipFiles.map((f) => `file '${path.resolve(f).replace(/'/g, "'\\''")}'`).join('\n'),
  );
  const silentVideo = path.join(workDir, 'video-mentah.mp4');
  await run([
    '-hide_banner', '-y', '-f', 'concat', '-safe', '0', '-i', concatList,
    '-c', 'copy', silentVideo,
  ]);

  // 3. Audio.
  onProgress?.({ stage: 'rakit', message: 'Membangun mix audio' });
  const audioFile = path.join(workDir, 'mix.m4a');
  const audio = await buildAudio({ timeline, segments, workDir, musicFile, target: audioFile });

  // 4. Captions.
  onProgress?.({ stage: 'rakit', message: 'Menulis takarir' });
  const fonts = resolveFonts();
  const assFile = buildAssFile({
    cues: buildCues(timeline, segments, shotPlan),
    canvas: CANVAS,
    style: {
      fontName: fonts.caption,
      fontSize: CAPTION_STYLE.fontSize,
      cardFontName: fonts.card,
      cardFontSize: 118,
      highlightFontName: fonts.highlight,
      highlightFontSize: 104,
      highlight: HIGHLIGHT,
      bold: true,
      letterSpacing: CAPTION_STYLE.letterSpacing,
      outlineWidth: CAPTION_STYLE.outlineWidth,
      uppercase: CAPTION_STYLE.uppercase,
      maxCharsPerLine: CAPTION_STYLE.maxCharsPerLine,
      maxLines: CAPTION_STYLE.maxLines,
      marginBottomPx: CAPTION_STYLE.marginBottomPx,
      // ASS alpha is inverted: 00 opaque, FF transparent.
      boxAlphaHex: Math.round((1 - CAPTION_STYLE.boxOpacity) * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase(),
    },
    target: path.join(workDir, 'takarir.ass'),
  });

  // 5. Grade, burn captions, mux, encode.
  onProgress?.({ stage: 'rakit', message: 'Grading, takarir, dan encoding akhir' });
  const vf = `${voxGradeFilter()},subtitles='${escapeFilterPath(assFile)}'`;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  await run([
    '-hide_banner', '-y',
    '-i', silentVideo,
    '-i', audioFile,
    '-filter_complex', `[0:v]${vf}[v]`,
    '-map', '[v]', '-map', '1:a',
    // Encoding profile chosen to match what a normal NLE exports for social:
    // High profile, level 4.0, CRF 20, yuv420p, faststart.
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0',
    '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', String(CANVAS.fps),
    '-g', String(CANVAS.fps * 2),
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-movflags', '+faststart',
    // No encoder tag or comment: nothing here announces the pipeline.
    '-map_metadata', '-1',
    '-shortest',
    outputFile,
  ]);

  log.info(`Video jadi: ${outputFile}`);

  return {
    file: outputFile,
    timeline,
    shotCount: shotPlan.length,
    duration: timeline.totalDuration,
    audio,
    assFile,
    fonts,
  };
}
