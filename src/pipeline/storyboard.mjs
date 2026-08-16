import { CANVAS, RHYTHM, familyOf, labelOf, planShotTypes } from '../vox.mjs';
import { logger } from '../log.mjs';

const log = logger('papan-cerita');

/**
 * Build the storyboard — the last thing anyone sees before money is spent.
 *
 * Everything in here is derived from work that has already happened for free:
 * the product reading, the chosen topic, the written script, the shot plan. No
 * new call, no new cost. That is the point. The storyboard exists so the whole
 * video can be judged, and rejected, while rejecting it is still free.
 *
 * It has to be readable by someone who is not going to open a JSON file, so
 * every field here is something a person can actually check: what will be said,
 * what will be on screen, what the picture will be, how long the shot runs.
 */
export function buildStoryboard(project) {
  const script = project.script;
  if (!script) throw new Error('Naskah belum ada.');

  const segments = script.segments;
  // The script may already carry a shot type per segment. Planning a fresh one
  // here would show the reviewer a different video from the one that renders.
  const planned = planShotTypes(segments.length);
  const shotTypes = segments.map((s, i) => s.shotType || planned[i]);

  // Indonesian documentary narration runs about 2.6 words a second. Close
  // enough to show a per-shot duration that will not surprise anyone later.
  const secondsOf = (text) =>
    Math.round(((text.split(/\s+/).filter(Boolean).length / 2.6) + 0.06) * 10) / 10;

  let clock = 0;
  const panels = segments.map((segment, i) => {
    const shotType = shotTypes[i];
    const seconds = secondsOf(segment.voiceover);
    const panel = {
      nomor: i + 1,
      mulai: Math.round(clock * 10) / 10,
      detik: seconds,
      // The line as it will be heard, and the line as it will be read: they are
      // not always the same once numbers and acronyms have been spelled out.
      suara: segment.voiceover,
      takarir: segment.voiceover,
      layar: segment.onScreenText || null,
      sfx: segment.sfx || null,
      // Indonesian is what the reviewer reads; the English prompt is what the
      // image model is actually sent, and both are shown so the approval is
      // informed rather than trusting.
      gambar: segment.gambarIndonesia || null,
      dariFotoProduk: Boolean(segment.useProductPhoto),
      gambarPrompt: segment.visualSubject || segment.imagePrompt || null,
      jenisShot: shotType,
      jenisShotLabel: labelOf(shotType),
      latar: familyOf(shotType) === 'light' ? 'terang' : 'gelap',
      // A line long enough to need more than one shot gets cut; saying so here
      // avoids the storyboard promising fewer pictures than the video shows.
      potongan: Math.max(1, Math.round(seconds / RHYTHM.averageShotSeconds)),
    };
    clock += seconds;
    return panel;
  });

  const totalSeconds = Math.round(clock * 10) / 10;
  const shotCount = panels.reduce((n, p) => n + p.potongan, 0);

  log.info(`Papan cerita: ${panels.length} panel, ${shotCount} shot, ~${totalSeconds}s`);

  return {
    judul: script.title,
    topik: project.chosenTopic?.title || null,
    produk: project.produk?.jenis || project.product,
    dibuatPada: new Date().toISOString(),
    ukuran: `${CANVAS.width}×${CANVAS.height}`,
    panels,
    ringkasan: {
      panelCount: panels.length,
      shotCount,
      totalSeconds,
      rataRataShot: Math.round((totalSeconds / shotCount) * 100) / 100,
      panelTerang: panels.filter((p) => p.latar === 'terang').length,
      kartuLayar: panels.filter((p) => p.layar).length,
      efekSuara: panels.filter((p) => p.sfx).length,
      panelFotoProduk: panels.filter((p) => p.dariFotoProduk).length,
    },
    // Carried so the approval screen can show the language check next to the
    // script it applies to, rather than on a separate tab nobody opens.
    pemeriksaBahasa: script.ttsLint?.summary || null,
  };
}
