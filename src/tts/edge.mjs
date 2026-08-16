import { spawn } from 'node:child_process';
import path from 'node:path';
import { ROOT } from '../config.mjs';
import { logger } from '../log.mjs';

const log = logger('edge-tts');
const HELPER = path.join(ROOT, 'src', 'tts', 'edge.py');

/**
 * Indonesian voices available without an account.
 *
 * Both are Azure neural voices trained on Indonesian, not English models
 * reading Indonesian phonemes, which is what makes pepet and taling land where
 * a native speaker expects them.
 */
export const VOICES = [
  { id: 'id-ID-GadisNeural', label: 'Gadis — perempuan, hangat', gender: 'perempuan' },
  { id: 'id-ID-ArdiNeural', label: 'Ardi — laki-laki, tenang', gender: 'laki-laki' },
];

export const DEFAULT_VOICE = 'id-ID-GadisNeural';

/**
 * Azure reads at a newsreader's pace. The reference videos sit near 2.3 words
 * per second; +12% moves the voice there. Past roughly +20% the consonants
 * start clipping, which is audible as a lisp.
 */
export const DEFAULT_RATE = '+12%';

/**
 * Shape the narration arc instead of reading every line at one level.
 *
 * A neural voice given no direction reads all fourteen lines identically, and
 * fourteen identical lines is what "boring" means — the reference narration is
 * not louder, it moves. The opening leans in, the middle settles into a steady
 * documentary read, and the closing line drops in pitch and slows down, which
 * is the move every documentary narrator makes on a last line.
 */
export function shapeDelivery(index, total) {
  const position = total <= 1 ? 0 : index / (total - 1);
  if (index === 0) return { rate: '+16%', pitch: '+8Hz' };
  if (index === total - 1) return { rate: '+4%', pitch: '-10Hz' };
  if (position > 0.78) return { rate: '+8%', pitch: '-5Hz' };
  // A small alternation through the body keeps consecutive lines from landing
  // on exactly the same contour, which is what reads as recitation.
  return index % 2 ? { rate: '+13%', pitch: '+2Hz' } : { rate: '+11%', pitch: '-2Hz' };
}

export class EdgeTtsError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'EdgeTtsError';
    this.code = code;
  }
}

function python() {
  return process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
}

/**
 * Synthesise every segment in one helper run.
 *
 * Batching matters: each run pays a WebSocket handshake, and Azure throttles a
 * client that reconnects per line — which it answers with a truncated take
 * rather than an error.
 */
export function synthesizeAll({ segments, voice = DEFAULT_VOICE, rate = DEFAULT_RATE, onProgress }) {
  return new Promise((resolve, reject) => {
    const child = spawn(python(), [HELPER], { stdio: ['pipe', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
      for (const line of String(d).split('\n')) {
        const m = line.match(/^dubbing (\d+)\/(\d+)$/);
        if (m) onProgress?.({ stage: 'dubbing', done: Number(m[1]), total: Number(m[2]) });
      }
    });

    child.on('error', (error) => {
      // ENOENT here means Python itself is missing, which needs a different
      // message from "the package is missing" — one is a runtime, one is a
      // pip install.
      reject(
        error.code === 'ENOENT'
          ? new EdgeTtsError(
              `Python 3 tidak ditemukan (${python()}). Pasang Python 3 lalu jalankan ulang.`,
              'python-hilang',
            )
          : error,
      );
    });

    child.on('close', (code) => {
      if (!stdout.trim()) {
        reject(
          new EdgeTtsError(
            `Proses dubbing berhenti (kode ${code}). ${stderr.trim().split('\n').slice(-3).join(' ')}`,
            'proses-gagal',
          ),
        );
        return;
      }
      let payload;
      try {
        payload = JSON.parse(stdout.trim().split('\n').pop());
      } catch {
        reject(new EdgeTtsError(`Balasan dubbing tidak terbaca: ${stdout.slice(0, 200)}`, 'balasan-rusak'));
        return;
      }
      if (!payload.ok) {
        reject(new EdgeTtsError(payload.message || 'Dubbing gagal', payload.error));
        return;
      }
      log.info(`${payload.segments.length} segmen didubbing`, { voice: payload.voice });
      resolve(payload.segments);
    });

    child.stdin.end(
      JSON.stringify({
        voice,
        rate,
        segments: segments.map((s, i) => ({ ...shapeDelivery(i, segments.length), ...s })),
      }),
    );
  });
}

/** Whether this machine can dub right now, and if not, precisely why. */
export async function probe() {
  try {
    await synthesizeAll({
      segments: [],
      onProgress: null,
    });
    return { ready: true };
  } catch (error) {
    return { ready: false, code: error.code, why: error.message };
  }
}
