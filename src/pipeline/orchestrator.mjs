import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../config.mjs';
import { logger } from '../log.mjs';
import { newId, saveProject, getProject, markTopicUsed, costForProject } from '../store.mjs';
import { researchTopics } from './research.mjs';
import { writeScript } from './script.mjs';
import { dubScript } from './voice.mjs';
import { generateStills } from './visuals.mjs';
import { assembleVideo } from './assemble.mjs';
import { inspectVideo, reviewReadiness } from './qc.mjs';
import { writeCaptions } from './caption.mjs';

const log = logger('produksi');

/**
 * The production run.
 *
 * Ordering is deliberate and is the whole cost strategy: everything cheap and
 * everything verifiable happens before anything expensive. Script problems cost
 * cents to find, dubbing problems cost cents to find, and both are caught before
 * a single image is generated. By the time we spend real money on visuals, the
 * only thing that can still go wrong is a render fault — which the final QC pass
 * catches without needing a human to watch the video.
 */

export const STAGES = [
  { id: 'riset', label: 'Riset topik', paid: 'ringan' },
  { id: 'naskah', label: 'Naskah + QC bahasa', paid: 'ringan' },
  { id: 'dubbing', label: 'Dubbing + verifikasi transkripsi', paid: 'sedang' },
  { id: 'visual', label: 'Generasi gambar', paid: 'berat' },
  { id: 'rakit', label: 'Perakitan video', paid: 'gratis' },
  { id: 'qc', label: 'QC teknis', paid: 'gratis' },
  { id: 'caption', label: 'Caption unggahan', paid: 'ringan' },
];

/** Rough per-unit costs, used only for the pre-flight budget gate. */
const COST_ESTIMATE = {
  claudeCall: 0.06,
  ttsSegment: 0.012,
  sttSegment: 0.006,
  image: 0.035,
  veoShot: 0.4,
};

export function estimateCost({ segmentCount, mode = 'collage' }) {
  const claude = COST_ESTIMATE.claudeCall * 4;
  // Budget for the retry path, not the happy path — a run that stops at the
  // gate because the estimate was optimistic is worse than one that never starts.
  const dubbing = segmentCount * (COST_ESTIMATE.ttsSegment + COST_ESTIMATE.sttSegment) * 1.4;
  const visuals =
    mode === 'aigen'
      ? segmentCount * COST_ESTIMATE.veoShot
      : segmentCount * COST_ESTIMATE.image * 1.1;
  return {
    claude: round(claude),
    dubbing: round(dubbing),
    visuals: round(visuals),
    total: round(claude + dubbing + visuals),
  };
}

const round = (n) => Math.round(n * 100) / 100;

/* ── Project lifecycle ─────────────────────────────────────────────────── */

export function createProject({ category, product, brand, durationSeconds = 45, mode = 'collage' }) {
  ensureDirs();
  const id = newId('proj');
  const project = {
    id,
    createdAt: new Date().toISOString(),
    status: 'baru',
    category,
    product,
    brand: brand || null,
    durationSeconds,
    mode,
    topics: [],
    chosenTopic: null,
    script: null,
    dub: null,
    visuals: null,
    video: null,
    qc: null,
    captions: null,
    stageLog: [],
    workDir: path.join(config.tmpDir, id),
    outputFile: path.join(config.outputDir, `${id}.mp4`),
  };
  return saveProject(project);
}

function stamp(project, stage, status, detail) {
  project.stageLog.push({ stage, status, detail: detail || null, at: new Date().toISOString() });
  project.status = status === 'gagal' ? `gagal-${stage}` : stage;
  return saveProject(project);
}

/* ── Individual stages ─────────────────────────────────────────────────── */

export async function runResearch(projectId, { count = 6, audience } = {}) {
  let project = getProject(projectId);
  if (!project) throw new Error(`Proyek ${projectId} tidak ditemukan`);

  const topics = await researchTopics({
    category: project.category,
    product: project.product,
    brand: project.brand,
    count,
    audience,
    projectId,
  });

  project.topics = topics;
  return stamp(project, 'riset', 'riset', `${topics.length} topik`);
}

export async function runScript(projectId, { topicIndex = 0, onProgress } = {}) {
  let project = getProject(projectId);
  const topic = project.topics[topicIndex];
  if (!topic) throw new Error('Topik belum dipilih. Jalankan riset dulu.');

  const script = await writeScript({
    topic,
    durationSeconds: project.durationSeconds,
    projectId,
    onProgress,
  });

  project.chosenTopic = topic;
  project.script = script;
  project = stamp(
    project,
    'naskah',
    'naskah',
    `${script.segments.length} segmen, ~${script.estimatedSeconds}s, ` +
      `${script.ttsLint.summary.errors} error bahasa`,
  );

  // Gate: a script that still fails the linter never reaches the paid stages.
  const gate = reviewReadiness({ script });
  return { project, script, gate };
}

export async function runDubbing(projectId, { onProgress } = {}) {
  let project = getProject(projectId);
  if (!project.script) throw new Error('Naskah belum ada.');

  const outDir = path.join(project.workDir, 'vo');
  const dub = await dubScript({
    segments: project.script.segments,
    outDir,
    projectId,
    onProgress,
  });

  project.dub = {
    ok: dub.ok,
    meanWer: dub.meanWer,
    takes: dub.takes.map((t) => ({
      segmentIndex: t.segmentIndex,
      file: t.file,
      ok: t.ok,
      wer: t.check.wer,
      transcript: t.transcript,
      mismatches: t.check.mismatches,
      attempts: t.attempts.length,
    })),
  };
  project = stamp(
    project,
    'dubbing',
    'dubbing',
    `WER rata-rata ${(dub.meanWer * 100).toFixed(1)}%, ${dub.failed.length} segmen gagal`,
  );

  const gate = reviewReadiness({ dub });
  return { project, dub, gate };
}

export async function runVisuals(projectId, { onProgress } = {}) {
  let project = getProject(projectId);
  if (!project.script) throw new Error('Naskah belum ada.');

  const outDir = path.join(project.workDir, 'img');
  const visuals = await generateStills({
    segments: project.script.segments,
    outDir,
    projectId,
    onProgress,
  });

  project.visuals = visuals;
  project = stamp(
    project,
    'visual',
    'visual',
    `${visuals.shots.filter((s) => s.ok).length}/${visuals.shots.length} gambar`,
  );

  const gate = reviewReadiness({ visuals });
  return { project, visuals, gate };
}

export async function runAssembly(projectId, { musicFile, onProgress } = {}) {
  let project = getProject(projectId);
  if (!project.dub || !project.visuals) throw new Error('Dubbing atau visual belum siap.');

  const result = await assembleVideo({
    segments: project.script.segments,
    takes: project.dub.takes.map((t) => ({ segmentIndex: t.segmentIndex, file: t.file })),
    shots: project.visuals.shots,
    workDir: path.join(project.workDir, 'rakit'),
    outputFile: project.outputFile,
    musicFile,
    onProgress,
  });

  project.video = {
    file: result.file,
    duration: result.duration,
    shotCount: result.shotCount,
    fonts: result.fonts,
  };
  project = stamp(project, 'rakit', 'rakit', `${result.duration.toFixed(1)} detik`);
  return { project, video: result };
}

export async function runQc(projectId) {
  let project = getProject(projectId);
  if (!project.video) throw new Error('Video belum dirakit.');

  const qc = await inspectVideo(project.video.file, { targetSeconds: project.durationSeconds });
  project.qc = qc;
  project = stamp(project, 'qc', qc.ok ? 'qc' : 'gagal', `${qc.summary.errors} error`);
  return { project, qc };
}

export async function runCaptions(projectId) {
  let project = getProject(projectId);
  if (!project.script) throw new Error('Naskah belum ada.');

  const captions = await writeCaptions({
    script: project.script,
    topic: project.chosenTopic,
    projectId,
  });

  project.captions = captions;
  project = stamp(project, 'caption', 'selesai', 'caption siap');

  // Only record the topic as used once the video actually exists, so a run that
  // failed halfway does not burn the angle.
  if (project.video?.file && fs.existsSync(project.video.file)) {
    markTopicUsed(project.chosenTopic, project.id);
  }
  return { project, captions };
}

/* ── Full run ──────────────────────────────────────────────────────────── */

/**
 * Run every stage back to back, stopping at the first gate that fails.
 * `autoApprove` skips the pause between gates for headless runs.
 */
export async function runAll(projectId, { topicIndex = 0, musicFile, autoApprove = true, onProgress } = {}) {
  const project = getProject(projectId);
  const budget = config.maxCostPerVideoUsd;
  const report = { projectId, stages: [], ok: false };

  const emit = (stage, message, extra) => {
    onProgress?.({ stage, message, ...extra });
    log.info(`[${stage}] ${message}`);
  };

  const checkBudget = (stage) => {
    const spent = costForProject(projectId);
    if (spent > budget) {
      throw new Error(
        `Batas biaya terlampaui sebelum tahap "${stage}": sudah $${spent.toFixed(2)} dari $${budget.toFixed(2)}. ` +
          'Naikkan MAX_COST_PER_VIDEO_USD di .env kalau memang disengaja.',
      );
    }
  };

  try {
    if (!project.topics.length) {
      emit('riset', 'Meriset topik');
      await runResearch(projectId);
      report.stages.push({ stage: 'riset', ok: true });
    }

    checkBudget('naskah');
    emit('naskah', 'Menulis naskah');
    const scriptStep = await runScript(projectId, { topicIndex, onProgress });
    report.stages.push({ stage: 'naskah', ok: scriptStep.gate.ok, gate: scriptStep.gate });
    if (!scriptStep.gate.ok && !autoApprove) return { ...report, stoppedAt: 'naskah' };
    if (!scriptStep.gate.ok) {
      throw new Error(`Naskah tidak lolos QC bahasa:\n- ${scriptStep.gate.blockers.join('\n- ')}`);
    }

    const estimate = estimateCost({
      segmentCount: scriptStep.script.segments.length,
      mode: project.mode,
    });
    emit('naskah', `Perkiraan biaya sisa produksi: $${estimate.total.toFixed(2)}`, { estimate });
    if (estimate.total > budget) {
      throw new Error(
        `Perkiraan biaya $${estimate.total.toFixed(2)} melewati batas $${budget.toFixed(2)}. ` +
          'Kurangi durasi atau naikkan batas di .env.',
      );
    }

    checkBudget('dubbing');
    emit('dubbing', 'Dubbing dan verifikasi');
    const dubStep = await runDubbing(projectId, { onProgress });
    report.stages.push({ stage: 'dubbing', ok: dubStep.gate.ok, gate: dubStep.gate });
    if (!dubStep.gate.ok) {
      throw new Error(`Dubbing tidak lolos verifikasi:\n- ${dubStep.gate.blockers.join('\n- ')}`);
    }

    checkBudget('visual');
    emit('visual', 'Membuat gambar');
    const visualStep = await runVisuals(projectId, { onProgress });
    report.stages.push({ stage: 'visual', ok: visualStep.gate.ok, gate: visualStep.gate });
    if (!visualStep.gate.ok) {
      throw new Error(`Visual gagal:\n- ${visualStep.gate.blockers.join('\n- ')}`);
    }

    emit('rakit', 'Merakit video');
    const assembly = await runAssembly(projectId, { musicFile, onProgress });
    report.stages.push({ stage: 'rakit', ok: true });

    emit('qc', 'Memeriksa hasil');
    const qcStep = await runQc(projectId);
    report.stages.push({ stage: 'qc', ok: qcStep.qc.ok, qc: qcStep.qc });

    emit('caption', 'Menulis caption');
    const captionStep = await runCaptions(projectId);
    report.stages.push({ stage: 'caption', ok: true });

    report.ok = qcStep.qc.ok;
    report.video = assembly.video.file;
    report.captions = captionStep.captions;
    report.totalCostUsd = round(costForProject(projectId));
    return report;
  } catch (error) {
    log.error(`Produksi berhenti: ${error.message}`);
    const failed = getProject(projectId);
    if (failed) stamp(failed, failed.status || 'gagal', 'gagal', error.message);
    report.error = error.message;
    report.totalCostUsd = round(costForProject(projectId));
    return report;
  }
}
