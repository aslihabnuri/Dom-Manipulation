import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.mjs';
import { logger } from '../log.mjs';
import { runTask, download } from '../kie.mjs';
import { verifyTake, tokenize } from '../lang/wer.mjs';
import { synthesizeAll, VOICES as EDGE_VOICES } from '../tts/edge.mjs';

const log = logger('dubbing');

const KIE_TTS_MODEL = 'elevenlabs/text-to-speech-multilingual-v2';
const KIE_STT_MODEL = 'elevenlabs/speech-to-text';
const ELEVEN_BASE = 'https://api.elevenlabs.io/v1';

/**
 * Indonesian dubbing with verification.
 *
 * The important idea: we never trust the synthesiser. Every segment is
 * synthesised, transcribed back with speech-to-text, and compared word by word
 * against the script we sent. A segment that fails is re-synthesised with more
 * conservative voice settings before anything downstream runs.
 *
 * This costs cents and takes seconds. Discovering the same problem after the
 * video is rendered costs a whole re-render, which is the thing we are here to
 * avoid.
 */

const RETRY_SETTINGS = [
  // Round 1 uses the operator's configured settings.
  {},
  // Round 2: raise stability, drop style. Less expressive, far more predictable.
  { stability: 0.85, style: 0 },
  // Round 3: also slow down. Slower speech is easier for the engine to keep clean.
  { stability: 0.95, style: 0, speed: 0.92 },
];

function usingDirectElevenLabs() {
  return Boolean(config.elevenLabsKey);
}

/**
 * Which engine dubs this script.
 *
 * Edge is the default because it is the only one that needs nothing bought or
 * signed up for, and because Indonesian is a first-class voice there rather
 * than a multilingual model's second language. The paid paths stay available
 * for anyone who wants a specific voice, and an explicit TTS_PROVIDER wins.
 */
function provider() {
  const explicit = String(process.env.TTS_PROVIDER || '').toLowerCase();
  if (explicit) return explicit;
  if (config.elevenLabsKey) return 'elevenlabs';
  return 'edge';
}

/* ── Synthesis ─────────────────────────────────────────────────────────── */

async function synthesizeViaKie({ text, previousText, nextText, overrides, projectId }) {
  // KIE nests the voice, and rejects a flat `voice` or `voiceId` with
  // "voiceId cannot be empty" — a message that reads like a missing value when
  // it actually means a missing level. Sending the wrong shape here costs a
  // whole debugging session, so it is worth stating plainly.
  const input = {
    text,
    voice: { voiceId: config.tts.voice },
    voice_settings: {
      stability: overrides.stability ?? config.tts.stability,
      similarity_boost: overrides.similarity ?? config.tts.similarity,
      style: overrides.style ?? config.tts.style,
      speed: overrides.speed ?? config.tts.speed,
      use_speaker_boost: true,
    },
    language_code: 'id',
    // Context makes the engine carry intonation across a cut instead of
    // resetting to a flat "first sentence" reading on every segment.
    previous_text: previousText || '',
    next_text: nextText || '',
  };
  const urls = await runTask(KIE_TTS_MODEL, input, { projectId, note: 'tts' });
  return urls[0];
}

async function synthesizeViaElevenLabs({ text, previousText, nextText, overrides }) {
  const voiceId = config.tts.voice;
  const response = await fetch(`${ELEVEN_BASE}/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: {
      'xi-api-key': config.elevenLabsKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      language_code: 'id',
      previous_text: previousText || undefined,
      next_text: nextText || undefined,
      voice_settings: {
        stability: overrides.stability ?? config.tts.stability,
        similarity_boost: overrides.similarity ?? config.tts.similarity,
        style: overrides.style ?? config.tts.style,
        speed: overrides.speed ?? config.tts.speed,
        use_speaker_boost: true,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`ElevenLabs TTS gagal (HTTP ${response.status}): ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/* ── Transcription (the verification half) ─────────────────────────────── */

async function transcribeViaKie(audioUrl, projectId) {
  const urls = await runTask(
    KIE_STT_MODEL,
    { audio: audioUrl, language_code: 'id' },
    { projectId, note: 'stt' },
  );
  // Result may be a JSON document or plain text; handle both.
  const response = await fetch(urls[0]);
  const body = await response.text();
  try {
    const parsed = JSON.parse(body);
    return parsed.text || parsed.transcript || body;
  } catch {
    return body;
  }
}

async function transcribeViaElevenLabs(filePath) {
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(filePath)]), path.basename(filePath));
  form.append('model_id', 'scribe_v1');
  form.append('language_code', 'id');

  const response = await fetch(`${ELEVEN_BASE}/speech-to-text`, {
    method: 'POST',
    headers: { 'xi-api-key': config.elevenLabsKey },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`ElevenLabs STT gagal (HTTP ${response.status}): ${await response.text()}`);
  }
  const data = await response.json();
  return data.text || '';
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Dub one segment, verifying the result and retrying with safer voice settings
 * until it matches the script or we run out of attempts.
 */
export async function dubSegment({ segment, previousText, nextText, outDir, projectId, onProgress }) {
  const target = path.join(outDir, `seg-${String(segment.index).padStart(3, '0')}.mp3`);
  const attempts = [];

  for (let round = 0; round < RETRY_SETTINGS.length; round += 1) {
    const overrides = RETRY_SETTINGS[round];
    onProgress?.({
      stage: 'dubbing',
      segment: segment.index,
      round: round + 1,
      message: `Segmen ${segment.index + 1}, percobaan ${round + 1}`,
    });

    let transcript;
    if (usingDirectElevenLabs()) {
      const buffer = await synthesizeViaElevenLabs({
        text: segment.ttsText,
        previousText,
        nextText,
        overrides,
      });
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, buffer);
      transcript = await transcribeViaElevenLabs(target);
    } else {
      const audioUrl = await synthesizeViaKie({
        text: segment.ttsText,
        previousText,
        nextText,
        overrides,
        projectId,
      });
      await download(audioUrl, target);
      transcript = await transcribeViaKie(audioUrl, projectId);
    }

    const check = verifyTake(segment.ttsText, transcript, config.maxWer);
    attempts.push({ round: round + 1, overrides, transcript, check });

    if (check.ok) {
      log.info(`Segmen ${segment.index + 1} lolos (WER ${(check.wer * 100).toFixed(1)}%)`);
      return { file: target, transcript, check, attempts, ok: true };
    }

    log.warn(
      `Segmen ${segment.index + 1} meleset ${(check.wer * 100).toFixed(1)}% — ulangi dengan setelan lebih stabil`,
      { salah: check.mismatches.slice(0, 3) },
    );
  }

  // All attempts failed. Return the best one and let the orchestrator decide.
  const best = attempts.reduce((a, b) => (a.check.wer <= b.check.wer ? a : b));
  return {
    file: target,
    transcript: best.transcript,
    check: best.check,
    attempts,
    ok: false,
  };
}

/* ── Edge neural voices (the default) ──────────────────────────────────── */

/**
 * Below this a syllable has not been articulated, it has been swallowed.
 * Indonesian is never spoken faster than this even at an auctioneer's pace.
 */
const MIN_SECONDS_PER_SYLLABLE = 0.06;

/**
 * Verify a take against its script using the engine's own word boundaries.
 *
 * This is a different instrument from the WER round-trip and it is worth being
 * precise about what it does: Azure reports every word it spoke, in order, with
 * a duration. That proves nothing was dropped, merged, reordered or rushed —
 * the defects that survive a careful read of the script. It cannot prove a word
 * was *pronounced* correctly; pepet against taling is the linter's job, and the
 * linter runs before anything here is paid for.
 */
function verifyBoundaries(scriptText, words) {
  const expected = tokenize(scriptText);
  const spoken = words.map((w) => tokenize(w.text).join('-')).filter(Boolean);

  const mismatches = [];
  for (let i = 0; i < Math.max(expected.length, spoken.length); i += 1) {
    if (expected[i] !== spoken[i]) mismatches.push({ diharapkan: expected[i], terdengar: spoken[i] });
  }

  const rushed = words.filter(
    (w) => w.duration / Math.max(1, (w.text.match(/[aiueoAIUEO]/g) || []).length) <
      MIN_SECONDS_PER_SYLLABLE,
  );
  for (const w of rushed) mismatches.push({ diharapkan: w.text, terdengar: `terlalu cepat (${w.duration.toFixed(2)}s)` });

  return {
    ok: mismatches.length === 0,
    // Kept on the same scale as the WER path so the gate and the UI can read
    // either without knowing which engine produced it.
    wer: expected.length ? Math.min(1, mismatches.length / expected.length) : 0,
    mismatches: mismatches.slice(0, 8),
    method: 'batas-kata',
  };
}

async function dubViaEdge({ segments, outDir, voice, onProgress }) {
  const requested = segments.map((s) => ({
    index: s.index,
    text: s.ttsText,
    file: path.join(outDir, `seg-${String(s.index).padStart(3, '0')}.mp3`),
  }));

  const spoken = await synthesizeAll({
    segments: requested,
    voice: voice || config.tts.voice,
    onProgress: ({ done, total }) =>
      onProgress?.({ stage: 'dubbing', segment: done - 1, message: `Segmen ${done}/${total}` }),
  });

  return segments.map((segment) => {
    const take = spoken.find((t) => t.index === segment.index);
    const check = take
      ? verifyBoundaries(segment.ttsText, take.words)
      : { ok: false, wer: 1, mismatches: [{ diharapkan: segment.ttsText, terdengar: null }], method: 'batas-kata' };
    return {
      file: take?.file,
      // Carried through to the assembler, where they time the captions.
      words: take?.words || null,
      transcript: take ? take.words.map((w) => w.text).join(' ') : '',
      check,
      attempts: [{ round: 1, overrides: {}, check }],
      ok: check.ok,
      segmentIndex: segment.index,
    };
  });
}

/** Dub a whole script, segment by segment, with narration context carried across cuts. */
export async function dubScript({ segments, outDir, projectId, onProgress }) {
  fs.mkdirSync(outDir, { recursive: true });

  if (provider() === 'edge') {
    const takes = await dubViaEdge({ segments, outDir, onProgress });
    const failed = takes.filter((t) => !t.ok);
    return {
      takes,
      failed,
      ok: failed.length === 0,
      meanWer:
        Math.round((takes.reduce((sum, t) => sum + t.check.wer, 0) / (takes.length || 1)) * 10000) /
        10000,
    };
  }

  const results = [];

  for (let i = 0; i < segments.length; i += 1) {
    const result = await dubSegment({
      segment: segments[i],
      previousText: segments[i - 1]?.ttsText,
      nextText: segments[i + 1]?.ttsText,
      outDir,
      projectId,
      onProgress,
    });
    results.push({ ...result, segmentIndex: segments[i].index });
  }

  const failed = results.filter((r) => !r.ok);
  const meanWer =
    results.reduce((sum, r) => sum + r.check.wer, 0) / (results.length || 1);

  return {
    takes: results,
    failed,
    ok: failed.length === 0,
    meanWer: Math.round(meanWer * 10000) / 10000,
  };
}

/**
 * Voices worth trying for Indonesian narration, with an honest note about what
 * to listen for. ElevenLabs multilingual voices were recorded by English
 * speakers; some carry a faint accent into Indonesian and some do not, and the
 * only way to know is to hear it.
 */
export const ELEVENLABS_VOICES = [
  { id: 'Brian', note: 'Baritone tenang. Paling mendekati narator dokumenter. Mulai dari sini.' },
  { id: 'Bella', note: 'Perempuan, hangat dan naratif. Bagus untuk cerita kuliner.' },
  { id: 'Liam', note: 'Muda, tempo agak cepat. Cocok untuk topik yang enerjik.' },
  { id: 'Laura', note: 'Perempuan, jernih dan netral. Aman untuk topik sejarah.' },
  { id: 'Callum', note: 'Berat dan berjarak. Bagus untuk cerita bernuansa gelap.' },
  { id: 'Aria', note: 'Perempuan, lembut. Pas untuk fashion dan kriya.' },
];

/**
 * The voices the UI should offer, for whichever engine is actually going to
 * run. Listing ElevenLabs voices while Edge is doing the dubbing would let
 * someone pick a voice that silently does nothing.
 */
export function suggestedVoices() {
  if (provider() === 'edge') {
    return EDGE_VOICES.map((v) => ({
      id: v.id,
      note:
        v.gender === 'perempuan'
          ? 'Perempuan, hangat. Cocok untuk cerita fashion dan kuliner.'
          : 'Laki-laki, tenang. Paling mendekati narator dokumenter.',
    }));
  }
  return ELEVENLABS_VOICES;
}
