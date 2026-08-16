import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.mjs';
import { logger } from '../log.mjs';
import { runTask, download } from '../kie.mjs';
import { verifyTake } from '../lang/wer.mjs';

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

/* ── Synthesis ─────────────────────────────────────────────────────────── */

async function synthesizeViaKie({ text, previousText, nextText, overrides, projectId }) {
  const input = {
    text,
    voice: config.tts.voice,
    stability: overrides.stability ?? config.tts.stability,
    similarity_boost: overrides.similarity ?? config.tts.similarity,
    style: overrides.style ?? config.tts.style,
    speed: overrides.speed ?? config.tts.speed,
    timestamps: true,
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

/** Dub a whole script, segment by segment, with narration context carried across cuts. */
export async function dubScript({ segments, outDir, projectId, onProgress }) {
  fs.mkdirSync(outDir, { recursive: true });
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
export const SUGGESTED_VOICES = [
  { id: 'Brian', note: 'Baritone tenang. Paling mendekati narator dokumenter. Mulai dari sini.' },
  { id: 'Bella', note: 'Perempuan, hangat dan naratif. Bagus untuk cerita kuliner.' },
  { id: 'Liam', note: 'Muda, tempo agak cepat. Cocok untuk topik yang enerjik.' },
  { id: 'Laura', note: 'Perempuan, jernih dan netral. Aman untuk topik sejarah.' },
  { id: 'Callum', note: 'Berat dan berjarak. Bagus untuk cerita bernuansa gelap.' },
  { id: 'Aria', note: 'Perempuan, lembut. Pas untuk fashion dan kriya.' },
];
