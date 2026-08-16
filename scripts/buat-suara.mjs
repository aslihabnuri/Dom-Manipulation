/**
 * Dub a script and cache the takes, without running the paid stages.
 *
 * Same engine the app uses — this is only a way to run the voice stage on its
 * own, so a script can be heard and corrected before any image is bought.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../src/config.mjs';
import { synthesizeAll, DEFAULT_VOICE, DEFAULT_RATE } from '../src/tts/edge.mjs';

const naskah = JSON.parse(fs.readFileSync(process.argv[2] || 'demo/naskah.json', 'utf8'));
const slug = naskah.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const outDir = path.join(config.cacheDir, 'suara', slug);

ensureDirs();
fs.mkdirSync(outDir, { recursive: true });

const voice = process.env.TTS_VOICE || DEFAULT_VOICE;
const segments = await synthesizeAll({
  voice,
  segments: naskah.segmen.map((s, i) => ({
    index: i,
    text: s.vo,
    file: path.join(outDir, `${String(i).padStart(2, '0')}.mp3`),
  })),
  onProgress: ({ done, total }) => process.stdout.write(`\r  ${done}/${total}`),
});

const total = segments.reduce((sum, s) => sum + s.seconds, 0);
fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(
    { judul: naskah.judul, voice, rate: DEFAULT_RATE, totalSeconds: Math.round(total * 100) / 100, segments },
    null,
    2,
  ),
);
console.log(`\n\n${segments.length} segmen · ${total.toFixed(1)} detik · ${outDir}`);
