import fs from 'node:fs';
import { run, probeDuration, measureLoudness, detectBlackFrames } from '../ffmpeg.mjs';
import { AUDIO, CANVAS } from '../vox.mjs';
import { logger } from '../log.mjs';

const log = logger('qc');

/**
 * Technical inspection of the finished file.
 *
 * The brief was "one shot, no revisions", so the last thing that happens before
 * we hand the file over is a check for the defects a human would otherwise
 * catch on playback: black frames, dead air, clipped audio, wrong container
 * specs, a duration that drifted from the target.
 */

export async function inspectVideo(file, { targetSeconds } = {}) {
  const checks = [];
  const add = (severity, name, message, detail) =>
    checks.push({ severity, name, message, detail });

  if (!fs.existsSync(file)) {
    add('error', 'berkas', 'File hasil tidak ditemukan.', file);
    return finalize(checks, {});
  }

  const stats = fs.statSync(file);
  if (stats.size < 100_000) {
    add('error', 'ukuran', `File hanya ${Math.round(stats.size / 1024)} KB — kemungkinan render gagal.`);
  }

  // Container and stream specs.
  const probeRaw = await run(
    [
      '-v', 'error',
      '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,profile,sample_rate,channels',
      '-show_entries', 'format=duration,bit_rate',
      '-of', 'json', file,
    ],
    { binary: 'ffprobe', capture: 'stdout' },
  );
  const probe = JSON.parse(probeRaw);
  const video = probe.streams.find((s) => s.codec_type === 'video');
  const audio = probe.streams.find((s) => s.codec_type === 'audio');
  const duration = Number.parseFloat(probe.format.duration);

  if (!video) add('error', 'video', 'Tidak ada stream video.');
  if (!audio) add('error', 'audio', 'Tidak ada stream audio — video ini bisu.');

  if (video) {
    if (video.width !== CANVAS.width || video.height !== CANVAS.height) {
      add(
        'warn',
        'resolusi',
        `Resolusi ${video.width}x${video.height}, seharusnya ${CANVAS.width}x${CANVAS.height}.`,
      );
    }
    if (video.pix_fmt !== 'yuv420p') {
      add('error', 'pixel-format', `pix_fmt ${video.pix_fmt} tidak didukung semua pemutar. Harus yuv420p.`);
    }
    const [fpsNum, fpsDen] = String(video.r_frame_rate).split('/').map(Number);
    const fps = fpsDen ? fpsNum / fpsDen : fpsNum;
    if (Number.isFinite(fps) && Math.abs(fps - CANVAS.fps) > 0.5) {
      add('warn', 'fps', `Frame rate ${fps}, seharusnya ${CANVAS.fps}.`);
    }
  }

  if (audio) {
    if (Number.parseInt(audio.sample_rate, 10) !== 48000) {
      add('warn', 'sample-rate', `Sample rate ${audio.sample_rate}, sebaiknya 48000.`);
    }
  }

  // Duration drift. Platforms clip anything over their limit, and a video that
  // undershoots the target usually means segments went missing.
  if (targetSeconds) {
    const drift = Math.abs(duration - targetSeconds) / targetSeconds;
    if (drift > 0.35) {
      add(
        'warn',
        'durasi',
        `Durasi ${duration.toFixed(1)} detik, target ${targetSeconds} detik (selisih ${Math.round(drift * 100)}%).`,
      );
    }
  }
  if (duration < 5) {
    add('error', 'durasi', `Durasi hanya ${duration.toFixed(1)} detik — terlalu pendek untuk diunggah.`);
  }

  // Loudness against the reference target.
  const loudness = await measureLoudness(file);
  if (loudness.lufs !== null) {
    const delta = Math.abs(loudness.lufs - AUDIO.targetLufs);
    if (delta > 1.5) {
      add(
        'warn',
        'loudness',
        `Loudness ${loudness.lufs} LUFS, target ${AUDIO.targetLufs} LUFS. Platform akan menormalkannya sendiri dan hasilnya bisa berubah.`,
      );
    }
  }
  if (loudness.truePeak !== null && loudness.truePeak > -0.5) {
    add('error', 'clipping', `True peak ${loudness.truePeak} dBFS — audio mentok dan akan terdengar pecah.`);
  }

  // Black frames.
  const blacks = await detectBlackFrames(file);
  const realBlacks = blacks.filter((b) => b.duration > 0.2);
  if (realBlacks.length) {
    add(
      'error',
      'frame-hitam',
      `Ada ${realBlacks.length} bagian layar hitam (total ${realBlacks
        .reduce((s, b) => s + b.duration, 0)
        .toFixed(1)} detik).`,
      realBlacks.slice(0, 5),
    );
  }

  // Dead air. The reference has essentially none, and long silences are where
  // viewers drop off.
  const silenceLog = await run([
    '-hide_banner', '-i', file, '-af', 'silencedetect=n=-40dB:d=0.9', '-f', 'null', '-',
  ]);
  const silences = [...silenceLog.matchAll(/silence_start:\s*([\d.]+)[\s\S]*?silence_duration:\s*([\d.]+)/g)]
    .map((m) => ({ start: Number.parseFloat(m[1]), duration: Number.parseFloat(m[2]) }))
    // Ignore the tail; a beat of silence at the end is intentional.
    .filter((s) => s.start < duration - 2.5);
  if (silences.length) {
    add(
      'warn',
      'jeda-sunyi',
      `Ada ${silences.length} jeda sunyi lebih dari 0,9 detik di tengah video.`,
      silences.slice(0, 5),
    );
  }

  return finalize(checks, {
    duration,
    sizeMb: Math.round((stats.size / 1_048_576) * 10) / 10,
    bitrateKbps: Math.round(Number.parseInt(probe.format.bit_rate || '0', 10) / 1000),
    video: video
      ? { codec: video.codec_name, profile: video.profile, width: video.width, height: video.height, pixFmt: video.pix_fmt }
      : null,
    audio: audio ? { codec: audio.codec_name, sampleRate: audio.sample_rate, channels: audio.channels } : null,
    loudness,
    blackFrames: realBlacks.length,
    silences: silences.length,
  });
}

function finalize(checks, metrics) {
  const errors = checks.filter((c) => c.severity === 'error');
  const warnings = checks.filter((c) => c.severity === 'warn');
  const result = {
    ok: errors.length === 0,
    checks,
    metrics,
    summary: { errors: errors.length, warnings: warnings.length },
  };
  log.info(
    result.ok
      ? `QC lolos (${warnings.length} peringatan)`
      : `QC gagal: ${errors.length} error, ${warnings.length} peringatan`,
  );
  return result;
}

/**
 * Pre-flight review of everything we know before the expensive stage runs.
 * The orchestrator calls this at each gate so a run stops on the cheap side of
 * the cost curve rather than after rendering.
 */
export function reviewReadiness({ script, dub, visuals, estimatedCostUsd, budgetUsd }) {
  const blockers = [];
  const notes = [];

  if (script) {
    if (!script.ttsLint.ok) {
      const errors = script.ttsLint.findings.filter((f) => f.severity === 'error');
      blockers.push(
        `Naskah masih punya ${errors.length} masalah pelafalan yang memblokir: ` +
          errors.slice(0, 3).map((f) => f.rule).join(', '),
      );
    }
    if (script.ttsLint.summary.warnings > 8) {
      notes.push(`${script.ttsLint.summary.warnings} peringatan bahasa — periksa daftarnya sebelum lanjut.`);
    }
  }

  if (dub) {
    if (!dub.ok) {
      blockers.push(
        `${dub.failed.length} segmen dubbing tidak lolos verifikasi transkripsi ` +
          `(WER rata-rata ${(dub.meanWer * 100).toFixed(1)}%).`,
      );
    }
  }

  if (visuals && !visuals.ok) {
    blockers.push(`${visuals.failed.length} gambar gagal dibuat.`);
  }

  if (estimatedCostUsd && budgetUsd && estimatedCostUsd > budgetUsd) {
    blockers.push(
      `Perkiraan biaya $${estimatedCostUsd.toFixed(2)} melewati batas $${budgetUsd.toFixed(2)}.`,
    );
  }

  return { ok: blockers.length === 0, blockers, notes };
}
