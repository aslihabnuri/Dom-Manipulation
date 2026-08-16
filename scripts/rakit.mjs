/**
 * Assemble a finished video from cached stills and cached voice takes.
 *
 * Deliberately separate from the orchestrator: both paid stages have already
 * run and written to `cache/`, so this step is free and can be repeated as many
 * times as it takes to get the timing right. That is the whole point of caching
 * images and audio — the expensive half happens once, the editing happens as
 * often as needed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../src/config.mjs';
import { assembleVideo } from '../src/pipeline/assemble.mjs';

const naskah = JSON.parse(fs.readFileSync(process.argv[2] || 'demo/naskah.json', 'utf8'));
const slug = naskah.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

const gambarDir = path.join(config.cacheDir, 'gambar', slug);
const suaraDir = path.join(config.cacheDir, 'suara', slug);
const suara = JSON.parse(fs.readFileSync(path.join(suaraDir, 'manifest.json'), 'utf8'));

ensureDirs();

const segments = naskah.segmen.map((s, i) => ({
  index: i,
  voiceover: s.vo,
  onScreenText: s.layar || '',
  sfx: s.sfx || null,
}));

const takes = suara.segmen.map((s) => ({
  segmentIndex: s.index,
  file: s.file,
  words: s.kata,
}));

const shots = naskah.segmen.map((s, i) => {
  const file = path.join(gambarDir, `${String(i).padStart(2, '0')}.png`);
  return { index: i, file, ok: fs.existsSync(file), shotType: s.shot };
});

const kurang = shots.filter((s) => !s.ok);
if (kurang.length) {
  console.error(`Gambar hilang untuk segmen: ${kurang.map((s) => s.index + 1).join(', ')}`);
  process.exit(1);
}

const outputFile = path.join(config.outputDir, `${slug}.mp4`);

const hasil = await assembleVideo({
  segments,
  takes,
  shots,
  workDir: path.join(config.tmpDir, slug),
  outputFile,
  onProgress: ({ message }) => process.stdout.write(`\r  ${message.padEnd(60)}`),
});

console.log(`\n\n${outputFile}`);
console.log(JSON.stringify(hasil, null, 2));
