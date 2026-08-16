import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.mjs';
import { logger } from '../log.mjs';
import { runTask, download } from '../kie.mjs';
import { buildImagePrompt, planShotTypes, NEGATIVE_PROMPT, CANVAS } from '../vox.mjs';

const log = logger('visual');

/**
 * Visual generation.
 *
 * Default mode is "collage": still images given motion at assembly time. That is
 * both cheaper and truer to the reference — the Vox look is motion graphics, not
 * photoreal footage. It also sidesteps the two things that make AI video obvious:
 * warped hands and faces, and the characteristic slow drift of generated motion.
 *
 * The "aigen" mode exists for shots that genuinely need moving footage. It costs
 * roughly twenty times more per shot, so it is opt-in per segment.
 */

export const MODES = {
  collage: {
    id: 'collage',
    label: 'Kolase (gambar diam + gerak kamera)',
    note: 'Murah, cepat, dan paling mirip referensi. Gerak ditambahkan saat perakitan.',
  },
  aigen: {
    id: 'aigen',
    label: 'Video AI (Veo)',
    note: 'Mahal dan lebih mudah dikenali sebagai AI. Pakai hanya untuk 1-2 shot kunci.',
  },
};

/**
 * Generate one still per segment.
 * Images are generated 9:16 so no cropping is needed later.
 */
export async function generateStills({ segments, outDir, projectId, onProgress }) {
  fs.mkdirSync(outDir, { recursive: true });
  const shotTypes = planShotTypes(segments.length);
  const results = [];

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const shotType = shotTypes[i];
    const prompt = buildImagePrompt(segment.visualSubject, shotType);
    const target = path.join(outDir, `shot-${String(i).padStart(3, '0')}.png`);

    onProgress?.({
      stage: 'visual',
      segment: i,
      message: `Gambar ${i + 1}/${segments.length} (${shotType})`,
    });

    try {
      const urls = await runTask(
        config.kieImageModel,
        {
          prompt: `${prompt}\n\nAvoid: ${NEGATIVE_PROMPT}`,
          aspect_ratio: CANVAS.aspect,
          output_format: 'png',
        },
        { projectId, note: `gambar-${i}` },
      );
      await download(urls[0], target);
      results.push({ index: i, file: target, shotType, prompt, ok: true });
      log.debug(`Gambar ${i + 1} selesai`, { shotType });
    } catch (error) {
      log.error(`Gambar ${i + 1} gagal: ${error.message}`);
      results.push({ index: i, file: null, shotType, prompt, ok: false, error: error.message });
    }
  }

  const failed = results.filter((r) => !r.ok);
  return { shots: results, failed, ok: failed.length === 0 };
}

/**
 * Ken Burns parameters per shot.
 *
 * The reference alternates push-in, pull-out, and lateral drift so consecutive
 * shots never move the same way. Motion is deliberately slight — a 6% scale
 * change over one second reads as intentional camera work, while anything
 * stronger reads as a screensaver.
 */
export function planMotion(count) {
  const moves = [
    { name: 'push-in', zoomFrom: 1.0, zoomTo: 1.07, panX: 0, panY: 0 },
    { name: 'pull-out', zoomFrom: 1.08, zoomTo: 1.0, panX: 0, panY: 0 },
    { name: 'drift-left', zoomFrom: 1.06, zoomTo: 1.06, panX: -0.04, panY: 0 },
    { name: 'drift-right', zoomFrom: 1.06, zoomTo: 1.06, panX: 0.04, panY: 0 },
    { name: 'rise', zoomFrom: 1.05, zoomTo: 1.09, panX: 0, panY: -0.03 },
    { name: 'settle', zoomFrom: 1.09, zoomTo: 1.04, panX: 0, panY: 0.02 },
  ];
  const plan = [];
  for (let i = 0; i < count; i += 1) {
    // Prime stride avoids a visible repeating pattern across a long edit.
    plan.push(moves[(i * 5) % moves.length]);
  }
  return plan;
}
