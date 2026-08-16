/**
 * Generate every still for a script and cache it on disk.
 *
 * Images are the one paid stage that is safe to run before the voice exists:
 * they depend only on the `gambar` field, and a cached PNG costs nothing to
 * reuse when the timeline changes. Running them first means a blocked dubbing
 * provider never stalls the visual half of the render.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../src/config.mjs';
import { createTask, waitForTask, download } from '../src/kie.mjs';
import { NEGATIVE_PROMPT } from '../src/vox.mjs';

/**
 * Every prompt ends the same way. Generated lettering is the loudest AI tell in
 * this format — it renders as garbled pseudo-text — and the style burns in its
 * own captions afterwards, so any text the model invents is both wrong and
 * redundant. Saying it twice, positively and negatively, is what actually works.
 */
const SUFFIX =
  'Vertical 9:16 editorial documentary still, muted desaturated palette, ' +
  'subtle film grain, no text of any kind, no lettering, no watermark. ' +
  `Avoid: ${NEGATIVE_PROMPT}`;

const naskah = JSON.parse(fs.readFileSync(process.argv[2] || 'demo/naskah.json', 'utf8'));
const outDir = path.join(config.cacheDir, 'gambar', slug(naskah.judul));

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

ensureDirs();
fs.mkdirSync(outDir, { recursive: true });

/** One image. Resolves to a local path, or null if KIE could not produce it. */
async function satuGambar(segment, index) {
  const file = path.join(outDir, `${String(index).padStart(2, '0')}.png`);
  if (fs.existsSync(file) && fs.statSync(file).size > 10_000) {
    console.log(`  ${index + 1}/${naskah.segmen.length}  sudah ada`);
    return file;
  }

  const prompt = `${segment.gambar}. ${SUFFIX}`;
  const taskId = await createTask(config.kieImageModel, {
    prompt,
    output_format: 'png',
    image_size: '9:16',
  });

  const { urls } = await waitForTask(taskId, { timeoutMs: 5 * 60_000, intervalMs: 3000 });
  await download(urls[0], file);
  console.log(`  ${index + 1}/${naskah.segmen.length}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  return file;
}

// Four at a time: enough to keep the queue busy, few enough that one bad prompt
// does not burn credits across the whole batch before we see the failure.
const hasil = [];
const LEBAR = 4;
for (let i = 0; i < naskah.segmen.length; i += LEBAR) {
  const batch = naskah.segmen.slice(i, i + LEBAR);
  const settled = await Promise.allSettled(batch.map((s, j) => satuGambar(s, i + j)));
  settled.forEach((r, j) => {
    if (r.status === 'fulfilled') hasil.push({ index: i + j, file: r.value });
    else console.error(`  ${i + j + 1} GAGAL: ${r.reason?.message}`);
  });
}

const manifest = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifest, JSON.stringify({ judul: naskah.judul, gambar: hasil }, null, 2));
console.log(`\n${hasil.length}/${naskah.segmen.length} gambar siap di ${outDir}`);
