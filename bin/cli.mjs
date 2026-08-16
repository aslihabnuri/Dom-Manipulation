#!/usr/bin/env node
import fs from 'node:fs';
import process from 'node:process';
import { config, capabilities, ensureDirs } from '../src/config.mjs';
import { setLevel, logger } from '../src/log.mjs';
import { listProjects, getProject, costForProject, usedTopics } from '../src/store.mjs';
import { probeToolchain } from '../src/ffmpeg.mjs';
import { ping as pingClaude } from '../src/claude.mjs';
import { ping as pingKie } from '../src/kie.mjs';
import { lintScript } from '../src/lang/lint.mjs';
import { normalizeForTTS } from '../src/lang/normalize.mjs';
import { SUGGESTED_VOICES } from '../src/pipeline/voice.mjs';
import {
  createProject,
  runResearch,
  runScript,
  runAll,
  estimateCost,
} from '../src/pipeline/orchestrator.mjs';

const log = logger('cli');
const [, , command, ...rest] = process.argv;

const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i += 1) {
  if (rest[i].startsWith('--')) {
    const key = rest[i].slice(2);
    const next = rest[i + 1];
    if (next && !next.startsWith('--')) {
      flags[key] = next;
      i += 1;
    } else {
      flags[key] = true;
    }
  } else {
    positional.push(rest[i]);
  }
}

if (flags.verbose) setLevel('debug');

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  violet: (s) => `\x1b[35m${s}\x1b[0m`,
};

const USAGE = `
${c.violet('◐')} ${c.bold('Naratif')} — studio video soft-selling gaya Vox

${c.bold('PEMERIKSAAN')}
  doctor                        Cek semua kunci API, ffmpeg, dan font
  voices                        Daftar suara yang disarankan untuk narasi Indonesia

${c.bold('BAHASA')} ${c.dim('(gratis, tanpa API)')}
  lint "<teks>"                 Periksa risiko pelafalan pada naskah Indonesia
  lint --file <path>            Sama, dari berkas
  normalize "<teks>"            Ubah angka/akronim jadi kata yang aman dibaca mesin

${c.bold('PRODUKSI')}
  new --category <fnb|fashion> --product "<produk>" [--brand "<merek>"]
      [--duration 45] [--mode collage|aigen]
  research <projectId> [--count 6]
  script <projectId> [--topic 0]
  run <projectId> [--topic 0] [--music <path>]
                                Jalankan seluruh alur sampai video + caption jadi

${c.bold('INFO')}
  list                          Daftar proyek
  show <projectId>              Rincian satu proyek
  cost [projectId]              Biaya terpakai
  history                       Topik yang sudah pernah dipakai

${c.bold('CONTOH')}
  ${c.dim('$')} npm run cli -- doctor
  ${c.dim('$')} npm run cli -- new --category fashion --product "tas Sophie Martin" --brand "Sophie Martin"
  ${c.dim('$')} npm run cli -- run proj_a1b2c3
`;

function table(rows) {
  if (!rows.length) return console.log(c.dim('  (kosong)'));
  const keys = Object.keys(rows[0]);
  const widths = keys.map((k) => Math.max(k.length, ...rows.map((r) => String(r[k] ?? '').length)));
  console.log('  ' + keys.map((k, i) => c.dim(k.padEnd(widths[i]))).join('  '));
  for (const row of rows) {
    console.log('  ' + keys.map((k, i) => String(row[k] ?? '').padEnd(widths[i])).join('  '));
  }
}

async function main() {
  ensureDirs();

  switch (command) {
    /* ── Diagnostics ───────────────────────────────────────────────── */
    case 'doctor': {
      console.log(`\n${c.violet('◐')} ${c.bold('Pemeriksaan sistem')}\n`);
      const caps = capabilities();
      const results = [];

      results.push({
        komponen: 'ANTHROPIC_API_KEY',
        status: caps.claude.ready ? 'ada' : 'HILANG',
        catatan: caps.claude.why || config.claudeModel,
      });
      results.push({
        komponen: 'KIE_API_KEY',
        status: caps.kie.ready ? 'ada' : 'HILANG',
        catatan: caps.kie.why || config.kieImageModel,
      });
      results.push({
        komponen: 'Dubbing',
        status: caps.dubbing.ready ? 'siap' : 'HILANG',
        catatan: caps.dubbing.why || `lewat ${caps.dubbing.provider}`,
      });

      const tool = await probeToolchain();
      results.push({
        komponen: 'ffmpeg',
        status: tool.ok ? 'ada' : 'HILANG',
        catatan: tool.ok ? tool.version.replace('ffmpeg version ', '').slice(0, 40) : tool.why,
      });
      if (tool.ok) {
        results.push({
          komponen: 'libass (takarir)',
          status: tool.hasLibass ? 'ada' : 'HILANG',
          catatan: tool.hasLibass ? 'takarir bisa dibakar' : 'takarir TIDAK bisa dibakar',
        });
        results.push({
          komponen: 'zoompan (gerak)',
          status: tool.hasZoompan ? 'ada' : 'HILANG',
          catatan: tool.hasZoompan ? 'gerak kamera aktif' : 'gambar akan diam',
        });
      }
      table(results);

      if (flags.live) {
        console.log(`\n${c.bold('Uji koneksi langsung')} ${c.dim('(memakai sedikit kuota)')}\n`);
        const live = [];
        if (caps.claude.ready) {
          const r = await pingClaude();
          live.push({ layanan: 'Claude', hasil: r.ok ? 'OK' : 'GAGAL', catatan: r.why || '' });
        }
        if (caps.kie.ready) {
          const r = await pingKie();
          live.push({ layanan: 'KIE', hasil: r.ok ? 'OK' : 'GAGAL', catatan: r.why || '' });
        }
        table(live);
      } else {
        console.log(c.dim('\n  Tambahkan --live untuk menguji koneksi ke API.'));
      }

      const missing = results.filter((r) => r.status === 'HILANG');
      console.log(
        missing.length
          ? `\n${c.red('✗')} ${missing.length} komponen belum siap. Lihat .env.example.\n`
          : `\n${c.green('✓')} Semua siap.\n`,
      );
      break;
    }

    case 'voices': {
      console.log(`\n${c.bold('Suara yang disarankan untuk narasi Indonesia')}\n`);
      table(SUGGESTED_VOICES.map((v) => ({ suara: v.id, catatan: v.note })));
      console.log(
        c.dim(
          '\n  Suara ElevenLabs direkam penutur Inggris. Sebagian membawa sedikit aksen\n' +
            '  ke bahasa Indonesia. Dengarkan hasil dubbing sebelum memilih untuk seterusnya.\n',
        ),
      );
      break;
    }

    /* ── Language tools ────────────────────────────────────────────── */
    case 'lint': {
      const text = flags.file ? fs.readFileSync(flags.file, 'utf8') : positional.join(' ');
      if (!text) throw new Error('Beri teks atau --file <path>');
      const result = lintScript(text);
      console.log(
        `\n  ${result.ok ? c.green('LOLOS') : c.red('DITOLAK')}  ` +
          `${result.summary.errors} error · ${result.summary.warnings} peringatan · ` +
          `${result.summary.words} kata · ~${result.summary.estimatedSeconds} detik\n`,
      );
      for (const f of result.findings) {
        const badge =
          f.severity === 'error' ? c.red('ERROR') : f.severity === 'warn' ? c.yellow(' WARN') : c.dim(' INFO');
        console.log(`  ${badge}  ${c.bold(f.rule)}`);
        console.log(`         ${f.message}`);
        console.log(`         ${c.dim(`→ ${f.fix}`)}\n`);
      }
      if (!result.ok) process.exitCode = 1;
      break;
    }

    case 'normalize': {
      const text = flags.file ? fs.readFileSync(flags.file, 'utf8') : positional.join(' ');
      if (!text) throw new Error('Beri teks atau --file <path>');
      const result = normalizeForTTS(text);
      console.log(`\n  ${c.dim('MASUK :')} ${text}`);
      console.log(`  ${c.bold('KELUAR:')} ${result.text}\n`);
      if (result.changes.length) {
        table(result.changes.map((ch) => ({ jenis: ch.kind, dari: ch.from, jadi: ch.to })));
        console.log();
      }
      break;
    }

    /* ── Production ────────────────────────────────────────────────── */
    case 'new': {
      if (!flags.category || !flags.product) {
        throw new Error('Wajib: --category <fnb|fashion> --product "<produk>"');
      }
      const project = createProject({
        category: flags.category,
        product: flags.product,
        brand: flags.brand || null,
        durationSeconds: Number(flags.duration || 45),
        mode: flags.mode || 'collage',
      });
      const estimate = estimateCost({
        segmentCount: Math.round(project.durationSeconds / 1.15),
        mode: project.mode,
      });
      console.log(`\n  ${c.green('✓')} Proyek dibuat: ${c.bold(project.id)}`);
      console.log(`    ${project.product} · ${project.durationSeconds} detik · mode ${project.mode}`);
      console.log(`    Perkiraan biaya: ${c.bold(`$${estimate.total.toFixed(2)}`)}`);
      console.log(`\n  Lanjut: ${c.dim(`npm run cli -- run ${project.id}`)}\n`);
      break;
    }

    case 'research': {
      const id = positional[0];
      if (!id) throw new Error('Beri projectId');
      const project = await runResearch(id, { count: Number(flags.count || 6) });
      console.log(`\n  ${c.bold(project.topics.length)} topik ditemukan:\n`);
      project.topics.forEach((t, i) => {
        console.log(`  ${c.violet(`[${i}]`)} ${c.bold(t.title)}`);
        console.log(`      ${c.dim(t.hook)}`);
        console.log(`      hook ${t.hookStrength}/10 · halus ${t.softSellScore}/10\n`);
      });
      console.log(c.dim(`  Lanjut: npm run cli -- script ${id} --topic 0\n`));
      break;
    }

    case 'script': {
      const id = positional[0];
      if (!id) throw new Error('Beri projectId');
      const { script, gate } = await runScript(id, { topicIndex: Number(flags.topic || 0) });
      console.log(`\n  ${c.bold(script.title)}`);
      console.log(
        `  ${script.segments.length} segmen · ~${script.estimatedSeconds} detik · ` +
          `${script.ttsLint.summary.errors} error bahasa\n`,
      );
      for (const s of script.segments) {
        console.log(`  ${c.dim(String(s.index + 1).padStart(2, '0'))} ${s.voiceover}`);
      }
      console.log(
        gate.ok
          ? `\n  ${c.green('✓')} Naskah lolos QC bahasa.\n`
          : `\n  ${c.red('✗')} ${gate.blockers.join('\n    ')}\n`,
      );
      break;
    }

    case 'run': {
      const id = positional[0];
      if (!id) throw new Error('Beri projectId');
      console.log(`\n  ${c.violet('◐')} Menjalankan produksi penuh untuk ${c.bold(id)}\n`);
      const report = await runAll(id, {
        topicIndex: Number(flags.topic || 0),
        musicFile: flags.music || null,
        onProgress: (p) => {
          if (p.message) process.stdout.write(`  ${c.dim(`[${p.stage}]`)} ${p.message}\n`);
        },
      });
      console.log();
      if (report.error) {
        console.log(`  ${c.red('✗ Produksi berhenti')}: ${report.error}`);
        console.log(`  Biaya terpakai: $${(report.totalCostUsd || 0).toFixed(2)}\n`);
        process.exitCode = 1;
        break;
      }
      console.log(`  ${c.green('✓ Selesai')}`);
      console.log(`    Video  : ${c.bold(report.video)}`);
      console.log(`    Biaya  : $${report.totalCostUsd.toFixed(2)}`);
      console.log(`    QC     : ${report.ok ? c.green('lolos') : c.yellow('ada peringatan')}`);
      if (report.captions?.tiktok) {
        console.log(`\n  ${c.bold('Caption TikTok')}\n    ${report.captions.tiktok.caption}`);
        console.log(`    ${c.dim(report.captions.tiktok.hashtags.map((h) => `#${h}`).join(' '))}`);
      }
      console.log();
      break;
    }

    /* ── Info ──────────────────────────────────────────────────────── */
    case 'list': {
      const projects = listProjects();
      console.log();
      table(
        projects.map((p) => ({
          id: p.id,
          status: p.status,
          kategori: p.category,
          produk: p.product.slice(0, 28),
          biaya: `$${costForProject(p.id).toFixed(2)}`,
        })),
      );
      console.log();
      break;
    }

    case 'show': {
      const project = getProject(positional[0]);
      if (!project) throw new Error('Proyek tidak ditemukan');
      console.log(`\n  ${c.bold(project.script?.title || project.product)}`);
      console.log(`  ${c.dim(project.id)} · ${project.status}\n`);
      table(
        project.stageLog.map((s) => ({
          tahap: s.stage,
          status: s.status,
          keterangan: String(s.detail || '').slice(0, 50),
          waktu: s.at.slice(11, 19),
        })),
      );
      if (project.video?.file) console.log(`\n  Video: ${project.video.file}`);
      console.log(`  Biaya: $${costForProject(project.id).toFixed(2)}\n`);
      break;
    }

    case 'cost': {
      if (positional[0]) {
        console.log(`\n  $${costForProject(positional[0]).toFixed(2)}\n`);
      } else {
        const total = listProjects().reduce((sum, p) => sum + costForProject(p.id), 0);
        console.log(`\n  Total semua proyek: ${c.bold(`$${total.toFixed(2)}`)}\n`);
      }
      break;
    }

    case 'history': {
      console.log();
      table(
        usedTopics()
          .slice(0, 30)
          .map((t) => ({
            judul: t.title.slice(0, 46),
            kategori: t.category,
            sudut: t.angle,
            tanggal: t.usedAt.slice(0, 10),
          })),
      );
      console.log();
      break;
    }

    default:
      console.log(USAGE);
  }
}

main().catch((error) => {
  console.error(`\n  ${c.red('✗')} ${error.message}\n`);
  if (flags.verbose) console.error(error.stack);
  process.exit(1);
});
