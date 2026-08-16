/**
 * Verify the voice-over actually said the script.
 *
 * The brief allows one take, so the failure this guards against is the
 * expensive one: a word dropped, merged into its neighbour, or rushed to the
 * point of being unintelligible, discovered only after the video is uploaded.
 *
 * Azure reports the boundary of every word it spoke. That is not a transcript —
 * it cannot prove a word was pronounced *correctly* — but it does prove which
 * words were spoken, in what order, and for how long, which is exactly the
 * class of defect that survives a read-through of the script. Pronunciation is
 * the linter's job, upstream of here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../src/config.mjs';

const naskah = JSON.parse(fs.readFileSync(process.argv[2] || 'demo/naskah.json', 'utf8'));
const slug = naskah.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const suara = JSON.parse(
  fs.readFileSync(path.join(config.cacheDir, 'suara', slug, 'manifest.json'), 'utf8'),
);

/** Words as the engine would see them: no punctuation, case-folded. */
const kataDari = (teks) =>
  (teks.toLowerCase().match(/[a-zà-ÿ']+(?:-[a-zà-ÿ']+)*/g) || []);

// Below this a syllable has not been articulated, it has been swallowed. Two
// syllables per 0.12s is already faster than Indonesian is ever spoken.
const MIN_DETIK_PER_SUKU = 0.06;
const sukuKata = (kata) => Math.max(1, (kata.match(/[aiueo]/g) || []).length);

let masalah = 0;

for (const [i, segmen] of naskah.segmen.entries()) {
  const take = suara.segments.find((s) => s.index === i);
  if (!take) {
    console.error(`  ${i + 1}  TIDAK ADA REKAMAN`);
    masalah += 1;
    continue;
  }

  const diharapkan = kataDari(segmen.vo);
  const diucapkan = take.words.map((k) => k.text.toLowerCase().replace(/[^a-zà-ÿ'-]/g, ''));

  const beda = diharapkan.length !== diucapkan.length ||
    diharapkan.some((w, j) => w !== diucapkan[j]);
  if (beda) {
    console.error(`  ${i + 1}  KATA TIDAK COCOK`);
    console.error(`      naskah : ${diharapkan.join(' ')}`);
    console.error(`      diucap : ${diucapkan.join(' ')}`);
    masalah += 1;
    continue;
  }

  const buruSuru = take.words.filter((k) => k.duration / sukuKata(k.text) < MIN_DETIK_PER_SUKU);
  if (buruSuru.length) {
    console.error(
      `  ${i + 1}  TERLALU CEPAT: ${buruSuru.map((k) => `${k.text} (${k.duration.toFixed(2)}s)`).join(', ')}`,
    );
    masalah += 1;
    continue;
  }

  console.log(`  ${i + 1}  ok  ${diharapkan.length} kata  ${take.seconds.toFixed(2)}s`);
}

const totalKata = suara.segments.reduce((n, s) => n + s.words.length, 0);
console.log(
  `\n${masalah === 0 ? 'LOLOS' : `${masalah} MASALAH`} · ` +
    `${totalKata} kata terverifikasi · ${suara.totalSeconds}s`,
);
process.exit(masalah === 0 ? 0 : 1);
