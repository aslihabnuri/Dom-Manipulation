import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, ensureDirs, capabilities } from './src/config.mjs';
import { logger, subscribe } from './src/log.mjs';
import { listProjects, getProject, deleteProject, costForProject, usedTopics } from './src/store.mjs';
import { CATEGORIES, ANGLES } from './src/pipeline/research.mjs';
import { SUGGESTED_VOICES } from './src/pipeline/voice.mjs';
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
} from './src/pipeline/orchestrator.mjs';

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
        voices: SUGGESTED_VOICES,
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

      /* ── Stage triggers ────────────────────────────────────────────── */
      if (req.method === 'POST') {
        const body = await readBody(req);
        const stages = {
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

ensureDirs();
server.listen(config.port, () => {
  const caps = capabilities();
  log.info(`Naratif berjalan di http://localhost:${config.port}`);
  for (const [name, cap] of Object.entries(caps)) {
    if (!cap.ready) log.warn(`${name}: ${cap.why}`);
  }
});
