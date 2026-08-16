import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { config, ensureDirs, capabilities, saveKeys, isConfigured } from './src/config.mjs';
import { logger, subscribe } from './src/log.mjs';
import { listProjects, getProject, deleteProject, costForProject, usedTopics } from './src/store.mjs';
import { CATEGORIES, ANGLES } from './src/pipeline/research.mjs';
import { suggestedVoices } from './src/pipeline/voice.mjs';
import { MODES } from './src/pipeline/visuals.mjs';
import { probeToolchain } from './src/ffmpeg.mjs';
import {
  STAGES,
  createProject,
  estimateCost,
  runResearch,
  runScript,
  runDubbing,
  runVisuals,
  runAssembly,
  runQc,
  runCaptions,
  runAll,
  runProduct,
  runStoryboard,
  runUntilStoryboard,
  approve,
  withdrawApproval,
} from './src/pipeline/orchestrator.mjs';
import { mediaTypeOf } from './src/pipeline/product.mjs';
import { saveProject } from './src/store.mjs';

const log = logger('server');
const WEB_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'web');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
};

/** Jobs run in the background; the UI polls or streams progress. */
const running = new Map();

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

/** Cap on one uploaded photo. Phone cameras clear 10 MB; nothing legitimate clears 25. */
const MAX_FOTO_BYTES = 25 * 1024 * 1024;

/**
 * Decode one `data:` URL from the browser's file picker.
 *
 * Photos come in as data URLs rather than multipart so the whole API stays
 * JSON. The trade is a third more bytes on the wire, which for a handful of
 * product photos over localhost is not a trade at all.
 */
function decodeFoto(dataUrl, index) {
  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(String(dataUrl || ''));
  if (!match) throw new Error(`Foto ${index + 1} tidak terbaca.`);
  const [, mediaType, base64] = match;
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > MAX_FOTO_BYTES) {
    throw new Error(`Foto ${index + 1} lebih dari 25 MB. Perkecil dulu.`);
  }
  const ext = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[mediaType];
  if (!ext) throw new Error(`Foto ${index + 1} formatnya ${mediaType} — pakai JPG, PNG, atau WEBP.`);
  return { buffer, ext, mediaType };
}

/**
 * Launch a pipeline stage in the background and track it, so a slow render does
 * not hold an HTTP connection open for ten minutes.
 */
function launch(projectId, name, task) {
  if (running.has(projectId)) {
    return { started: false, reason: 'Proyek ini sedang memproses tahap lain.' };
  }
  const job = { projectId, name, startedAt: Date.now(), events: [] };
  running.set(projectId, job);

  task((event) => {
    job.events.push({ ...event, at: Date.now() });
    if (job.events.length > 400) job.events.shift();
  })
    .then((result) => {
      job.result = result;
      job.done = true;
    })
    .catch((error) => {
      log.error(`Tahap "${name}" gagal: ${error.message}`);
      job.error = error.message;
      job.done = true;
    })
    .finally(() => {
      // Keep the finished job around briefly so the UI can read the outcome.
      setTimeout(() => running.delete(projectId), 60_000);
    });

  return { started: true };
}

/** Serve a file from web/, refusing anything that escapes the directory. */
function serveStatic(req, res, urlPath) {
  const relative = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath.slice(1));
  const target = path.resolve(WEB_DIR, relative);
  if (!target.startsWith(WEB_DIR)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
}

/** Stream generated media (video previews, stills) with range support. */
function serveMedia(req, res, filePath) {
  const target = path.resolve(filePath);
  const allowed = [config.outputDir, config.tmpDir].map((d) => path.resolve(d));
  if (!allowed.some((dir) => target.startsWith(dir)) || !fs.existsSync(target)) {
    res.writeHead(404).end('Not found');
    return;
  }
  const stat = fs.statSync(target);
  const type = MIME[path.extname(target)] || 'application/octet-stream';
  const range = req.headers.range;

  if (range) {
    const [startRaw, endRaw] = range.replace(/bytes=/, '').split('-');
    const start = Number.parseInt(startRaw, 10) || 0;
    const end = endRaw ? Number.parseInt(endRaw, 10) : stat.size - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': type,
    });
    fs.createReadStream(target, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': type, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = url.pathname;

  try {
    /* ── Live log stream ─────────────────────────────────────────────── */
    if (route === '/api/logs') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write(': terhubung\n\n');
      const unsubscribe = subscribe((record) => {
        res.write(`data: ${JSON.stringify(record)}\n\n`);
      });
      const heartbeat = setInterval(() => res.write(': ping\n\n'), 25_000);
      req.on('close', () => {
        clearInterval(heartbeat);
        unsubscribe();
      });
      return;
    }

    /* ── Reference data ──────────────────────────────────────────────── */
    if (route === '/api/meta') {
      const toolchain = await probeToolchain();
      return json(res, 200, {
        categories: Object.values(CATEGORIES),
        angles: ANGLES,
        stages: STAGES,
        voices: suggestedVoices(),
        modes: Object.values(MODES),
        capabilities: capabilities(),
        toolchain,
        settings: {
          claudeModel: config.claudeModel,
          imageModel: config.kieImageModel,
          voice: config.tts.voice,
          maxCost: config.maxCostPerVideoUsd,
          maxWer: config.maxWer,
        },
      });
    }

    if (route === '/api/history') {
      return json(res, 200, { topics: usedTopics().slice(0, 100) });
    }

    /* ── Setup ───────────────────────────────────────────────────────── */

    if (route === '/api/setup' && req.method === 'GET') {
      return json(res, 200, { configured: isConfigured(), capabilities: capabilities() });
    }

    if (route === '/api/setup' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.anthropicKey && !body.kieKey && !body.elevenLabsKey && !body.voice) {
        return json(res, 400, { error: 'Tidak ada yang diisi.' });
      }
      const caps = saveKeys(body);
      log.info('Kunci API disimpan lewat layar setup');
      return json(res, 200, { configured: isConfigured(), capabilities: caps });
    }

    /* Verify the saved keys actually authenticate, so a typo surfaces here
       rather than halfway through a paid production run. */
    if (route === '/api/setup/test' && req.method === 'POST') {
      const [claude, kie] = await Promise.all([
        config.anthropicKey
          ? import('./src/claude.mjs').then((m) => m.ping())
          : Promise.resolve({ ok: false, why: 'Belum diisi' }),
        config.kieKey
          ? import('./src/kie.mjs').then((m) => m.ping())
          : Promise.resolve({ ok: false, why: 'Belum diisi' }),
      ]);
      return json(res, 200, { claude, kie });
    }

    /* ── Projects ────────────────────────────────────────────────────── */
    if (route === '/api/projects' && req.method === 'GET') {
      const projects = listProjects().map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        status: p.status,
        category: p.category,
        product: p.product,
        brand: p.brand,
        title: p.script?.title || p.chosenTopic?.title || null,
        hasVideo: Boolean(p.video?.file && fs.existsSync(p.video.file)),
        costUsd: Math.round(costForProject(p.id) * 100) / 100,
      }));
      return json(res, 200, { projects });
    }

    if (route === '/api/projects' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.product || !body.category) {
        return json(res, 400, { error: 'Kategori dan produk wajib diisi.' });
      }
      const project = createProject(body);
      log.info(`Proyek dibuat: ${project.id} — ${project.product}`);
      return json(res, 201, { project });
    }

    const projectMatch = route.match(/^\/api\/projects\/([\w-]+)(\/.*)?$/);
    if (projectMatch) {
      const [, projectId, action] = projectMatch;
      const project = getProject(projectId);
      if (!project) return json(res, 404, { error: 'Proyek tidak ditemukan' });

      if (!action || action === '/') {
        if (req.method === 'DELETE') {
          deleteProject(projectId);
          return json(res, 200, { ok: true });
        }
        return json(res, 200, {
          project: { ...project, costUsd: Math.round(costForProject(projectId) * 100) / 100 },
          job: running.get(projectId) || null,
        });
      }

      if (action === '/status') {
        const job = running.get(projectId);
        return json(res, 200, {
          status: project.status,
          job: job
            ? { name: job.name, done: Boolean(job.done), error: job.error || null, events: job.events.slice(-40) }
            : null,
        });
      }

      if (action === '/estimate') {
        const segmentCount =
          project.script?.segments.length || Math.round(project.durationSeconds / 1.15);
        return json(res, 200, {
          estimate: estimateCost({ segmentCount, mode: project.mode }),
          spent: Math.round(costForProject(projectId) * 100) / 100,
          budget: config.maxCostPerVideoUsd,
        });
      }

      /* ── Foto produk ───────────────────────────────────────────────── */
      if (action === '/foto' && req.method === 'POST') {
        const body = await readBody(req);
        const incoming = Array.isArray(body.foto) ? body.foto : [body.foto].filter(Boolean);
        if (!incoming.length) return json(res, 400, { error: 'Belum ada foto yang dipilih.' });

        const dir = path.join(project.workDir, 'produk');
        fs.mkdirSync(dir, { recursive: true });
        const saved = [];
        try {
          incoming.forEach((dataUrl, i) => {
            const { buffer, ext, mediaType } = decodeFoto(dataUrl, i);
            const file = path.join(dir, `foto-${String(project.fotoProduk.length + i).padStart(2, '0')}${ext}`);
            fs.writeFileSync(file, buffer);
            saved.push({ file, mediaType, bytes: buffer.length });
          });
        } catch (error) {
          return json(res, 400, { error: error.message });
        }

        project.fotoProduk = [...(project.fotoProduk || []), ...saved];
        // A new photo means the old reading described something else.
        project.produk = null;
        project.persetujuan = null;
        saveProject(project);
        log.info(`${saved.length} foto produk diunggah`, { projectId });
        return json(res, 201, { fotoProduk: project.fotoProduk });
      }

      if (action === '/foto' && req.method === 'DELETE') {
        for (const foto of project.fotoProduk || []) fs.rmSync(foto.file, { force: true });
        project.fotoProduk = [];
        project.produk = null;
        project.persetujuan = null;
        saveProject(project);
        return json(res, 200, { fotoProduk: [] });
      }

      /* ── Papan cerita dan persetujuan ──────────────────────────────── */
      if (action === '/papan-cerita' && req.method === 'GET') {
        if (!project.papanCerita) {
          return json(res, 404, { error: 'Papan cerita belum dibuat.' });
        }
        return json(res, 200, {
          papanCerita: project.papanCerita,
          produk: project.produk,
          persetujuan: project.persetujuan,
          estimate: estimateCost({
            segmentCount: project.script?.segments.length || 0,
            mode: project.mode,
          }),
        });
      }

      if (action === '/setujui' && req.method === 'POST') {
        const body = await readBody(req);
        try {
          const updated = approve(projectId, { catatan: body.catatan });
          log.info('Papan cerita disetujui', { projectId });
          return json(res, 200, { project: updated });
        } catch (error) {
          return json(res, 409, { error: error.message });
        }
      }

      if (action === '/batalkan-persetujuan' && req.method === 'POST') {
        return json(res, 200, { project: withdrawApproval(projectId) });
      }

      /* ── Stage triggers ────────────────────────────────────────────── */
      if (req.method === 'POST') {
        const body = await readBody(req);
        const stages = {
          '/produk': () => runProduct(projectId, body),
          '/papan-cerita': () => runStoryboard(projectId),
          '/siapkan': (emit) => runUntilStoryboard(projectId, { ...body, onProgress: emit }),
          '/research': (emit) => runResearch(projectId, body),
          '/script': (emit) => runScript(projectId, { ...body, onProgress: emit }),
          '/dub': (emit) => runDubbing(projectId, { onProgress: emit }),
          '/visuals': (emit) => runVisuals(projectId, { onProgress: emit }),
          '/assemble': (emit) => runAssembly(projectId, { ...body, onProgress: emit }),
          '/qc': () => runQc(projectId),
          '/captions': () => runCaptions(projectId),
          '/run': (emit) => runAll(projectId, { ...body, onProgress: emit }),
        };
        const task = stages[action];
        if (task) {
          const outcome = launch(projectId, action.slice(1), task);
          return json(res, outcome.started ? 202 : 409, outcome);
        }
      }
    }

    /* ── Media ───────────────────────────────────────────────────────── */
    if (route === '/media') {
      const file = url.searchParams.get('file');
      if (!file) return json(res, 400, { error: 'Parameter file wajib ada' });
      return serveMedia(req, res, file);
    }

    /* ── Static UI ───────────────────────────────────────────────────── */
    if (req.method === 'GET') return serveStatic(req, res, route);

    return json(res, 404, { error: 'Rute tidak dikenal' });
  } catch (error) {
    log.error(`Kesalahan server: ${error.message}`, { route });
    return json(res, 500, { error: error.message });
  }
});

/**
 * Open the studio in the default browser.
 *
 * The launcher scripts are double-clicked, not typed, so nobody is watching a
 * terminal for a URL to copy. Failure here is not worth reporting loudly — the
 * URL is printed either way.
 */
function openBrowser(url) {
  const command =
    process.platform === 'darwin' ? 'open'
      : process.platform === 'win32' ? 'cmd'
        : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try {
    spawn(command, args, { stdio: 'ignore', detached: true }).unref();
  } catch {
    // Headless machine or no desktop session; the printed URL is the fallback.
  }
}

ensureDirs();
server.listen(config.port, () => {
  const url = `http://localhost:${config.port}`;
  log.info(`Naratif siap di ${url}`);

  if (!isConfigured()) {
    log.info('Kunci API belum lengkap — halaman setup akan terbuka di browser.');
  }
  for (const [name, cap] of Object.entries(capabilities())) {
    if (!cap.ready) log.warn(`${name}: ${cap.why}`);
  }

  if (process.env.NARATIF_NO_OPEN !== '1') openBrowser(url);
});
