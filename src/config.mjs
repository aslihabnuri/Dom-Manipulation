import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Minimal .env loader. We avoid dotenv so the app installs with a single
 * dependency (the Anthropic SDK) and starts on a clean machine.
 * Real environment variables always win over the file.
 */
function loadEnvFile() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const rawLine of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile();

const num = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  root: ROOT,
  dataDir: path.join(ROOT, 'data'),
  outputDir: path.join(ROOT, 'output'),
  tmpDir: path.join(ROOT, 'tmp'),
  cacheDir: path.join(ROOT, 'cache'),

  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  kieKey: process.env.KIE_API_KEY || '',
  elevenLabsKey: process.env.ELEVENLABS_API_KEY || '',

  claudeModel: process.env.CLAUDE_MODEL || 'claude-opus-5',
  kieImageModel: process.env.KIE_IMAGE_MODEL || 'google/nano-banana-pro',
  kieVideoModel: process.env.KIE_VIDEO_MODEL || 'veo3_fast',

  tts: {
    voice: process.env.TTS_VOICE || 'Brian',
    stability: num(process.env.TTS_STABILITY, 0.55),
    similarity: num(process.env.TTS_SIMILARITY, 0.8),
    style: num(process.env.TTS_STYLE, 0.1),
    speed: num(process.env.TTS_SPEED, 1.0),
  },

  maxCostPerVideoUsd: num(process.env.MAX_COST_PER_VIDEO_USD, 3.0),
  maxWer: num(process.env.MAX_WER, 0.05),

  port: Number.parseInt(process.env.PORT || '4300', 10),
};

export function ensureDirs() {
  for (const dir of [config.dataDir, config.outputDir, config.tmpDir, config.cacheDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write API keys from the setup screen into .env and apply them immediately.
 *
 * Keys arrive through the UI rather than a text editor, because asking someone
 * to hand-edit a dotfile is the step that stops a non-developer from ever
 * reaching the app. Only the keys actually supplied are touched, so re-running
 * setup to change one key does not wipe the others.
 */
export function saveKeys(keys) {
  const file = path.join(ROOT, '.env');
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const lines = existing.split('\n');

  const upsert = (key, value) => {
    if (value === undefined || value === null) return;
    const trimmed = String(value).trim();
    const index = lines.findIndex((l) => l.trim().startsWith(`${key}=`));
    if (!trimmed) {
      if (index !== -1) lines.splice(index, 1);
      return;
    }
    const line = `${key}=${trimmed}`;
    if (index === -1) lines.push(line);
    else lines[index] = line;
  };

  upsert('ANTHROPIC_API_KEY', keys.anthropicKey);
  upsert('KIE_API_KEY', keys.kieKey);
  upsert('ELEVENLABS_API_KEY', keys.elevenLabsKey);
  if (keys.voice) upsert('TTS_VOICE', keys.voice);

  // Drop blank lines so repeated saves cannot accumulate them, but keep any
  // comments the user added by hand.
  const content = `${lines.filter((l) => l.trim()).join('\n')}\n`;
  fs.writeFileSync(file, content, { mode: 0o600 });

  // Apply without a restart so the user goes straight from setup to working.
  if (keys.anthropicKey !== undefined) config.anthropicKey = String(keys.anthropicKey).trim();
  if (keys.kieKey !== undefined) config.kieKey = String(keys.kieKey).trim();
  if (keys.elevenLabsKey !== undefined) config.elevenLabsKey = String(keys.elevenLabsKey).trim();
  if (keys.voice) config.tts.voice = String(keys.voice).trim();

  return capabilities();
}

/** True when the app has the minimum it needs to do anything useful. */
export function isConfigured() {
  return Boolean(config.anthropicKey) && Boolean(config.kieKey);
}

/**
 * Which capabilities are actually usable right now. The UI and CLI both render
 * this so a missing key shows up as a clear message instead of a stack trace
 * halfway through a paid render.
 */
export function capabilities() {
  return {
    claude: {
      ready: Boolean(config.anthropicKey),
      why: config.anthropicKey ? '' : 'ANTHROPIC_API_KEY belum diisi di .env',
    },
    kie: {
      ready: Boolean(config.kieKey),
      why: config.kieKey ? '' : 'KIE_API_KEY belum diisi di .env',
    },
    dubbing: {
      ready: Boolean(config.elevenLabsKey || config.kieKey),
      provider: config.elevenLabsKey ? 'elevenlabs-langsung' : 'kie',
      why: config.elevenLabsKey || config.kieKey ? '' : 'Butuh KIE_API_KEY atau ELEVENLABS_API_KEY',
    },
  };
}
