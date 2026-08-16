import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';
import { logger } from './log.mjs';
import { recordCost } from './store.mjs';

const log = logger('kie');
const BASE = 'https://api.kie.ai';

/**
 * Client for the KIE.ai unified job API.
 *
 * Two endpoint families exist and they are not interchangeable:
 *   - /api/v1/jobs/*  — the unified "market" surface (images, TTS, STT, music)
 *   - /api/v1/veo/*   — Veo video has its own create/poll pair
 *
 * Everything here polls rather than using callbacks, because the app is meant to
 * run on a laptop with no public URL for KIE to call back to.
 */

const TERMINAL_SUCCESS = new Set(['success']);
const TERMINAL_FAIL = new Set(['fail', 'failed', 'error']);

export class KieError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'KieError';
    this.details = details;
  }
}

function requireKey() {
  if (!config.kieKey) {
    throw new KieError('KIE_API_KEY belum diisi. Tambahkan di file .env lalu jalankan ulang.');
  }
  return config.kieKey;
}

async function request(pathname, { method = 'GET', body, timeoutMs = 60_000 } = {}) {
  const key = requireKey();
  const url = `${BASE}${pathname}`;

  // Network blips are common on long renders; retry idempotent failures.
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      const text = await response.text();
      let payload;
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        throw new KieError(`Respons KIE bukan JSON (HTTP ${response.status})`, text.slice(0, 400));
      }

      if (!response.ok) {
        // 4xx is our fault — retrying will not help.
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new KieError(
            `KIE menolak permintaan (HTTP ${response.status}): ${payload.msg || 'tanpa pesan'}`,
            payload,
          );
        }
        throw new Error(`HTTP ${response.status}: ${payload.msg || text.slice(0, 200)}`);
      }

      if (payload.code && payload.code !== 200) {
        throw new KieError(`KIE error ${payload.code}: ${payload.msg || 'tanpa pesan'}`, payload);
      }

      return payload.data ?? payload;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof KieError) throw error;
      lastError = error;
      if (attempt === 4) break;
      const backoff = 1000 * 2 ** (attempt - 1);
      log.warn(`Permintaan gagal, coba lagi ${attempt}/3 dalam ${backoff}ms`, {
        pathname,
        error: error.message,
      });
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw new KieError(`Gagal menghubungi KIE setelah 4 percobaan: ${lastError?.message}`, {
    pathname,
  });
}

/** Create a job on the unified market endpoint. */
export async function createTask(model, input) {
  log.debug('Membuat task', { model });
  const data = await request('/api/v1/jobs/createTask', {
    method: 'POST',
    body: { model, input },
  });
  if (!data?.taskId) throw new KieError('KIE tidak mengembalikan taskId', data);
  return data.taskId;
}

export async function getTask(taskId) {
  return request(`/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`);
}

/**
 * Poll until the job reaches a terminal state.
 * `onTick` lets the caller stream progress into the UI.
 */
export async function waitForTask(taskId, { timeoutMs = 10 * 60_000, intervalMs = 4000, onTick } = {}) {
  const deadline = Date.now() + timeoutMs;
  let ticks = 0;

  while (Date.now() < deadline) {
    const record = await getTask(taskId);
    const state = String(record.state || record.status || '').toLowerCase();
    ticks += 1;
    onTick?.({ taskId, state, ticks });

    if (TERMINAL_SUCCESS.has(state)) {
      const urls = parseResultUrls(record);
      if (!urls.length) throw new KieError('Task sukses tapi tidak ada URL hasil', record);
      return { urls, record };
    }
    if (TERMINAL_FAIL.has(state)) {
      throw new KieError(
        `Task gagal: ${record.failMsg || record.failCode || 'tanpa keterangan'}`,
        record,
      );
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new KieError(`Task ${taskId} melewati batas waktu ${Math.round(timeoutMs / 1000)} detik`);
}

/** KIE returns resultJson as a JSON *string*; unwrap it defensively. */
export function parseResultUrls(record) {
  const raw = record?.resultJson ?? record?.result ?? null;
  if (!raw) return [];
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  const urls = parsed?.resultUrls || parsed?.urls || parsed?.result_urls;
  if (Array.isArray(urls)) return urls;
  if (typeof urls === 'string') return [urls];
  return [];
}

/** Create a job, wait for it, and return the result URLs. */
export async function runTask(model, input, opts = {}) {
  const taskId = await createTask(model, input);
  log.info(`Task dibuat: ${taskId}`, { model });
  const { urls, record } = await waitForTask(taskId, opts);
  if (opts.projectId) {
    recordCost({
      projectId: opts.projectId,
      model,
      usd: Number(record.creditsConsumed || 0) / 100,
      note: opts.note || model,
    });
  }
  return urls;
}

/* ── Veo video (separate endpoint family) ──────────────────────────────── */

export async function generateVideo({ prompt, imageUrls, aspectRatio = '9:16', model }) {
  const data = await request('/api/v1/veo/generate', {
    method: 'POST',
    body: {
      prompt,
      model: model || config.kieVideoModel,
      aspect_ratio: aspectRatio,
      ...(imageUrls?.length ? { imageUrls } : {}),
    },
  });
  if (!data?.taskId) throw new KieError('Veo tidak mengembalikan taskId', data);
  return data.taskId;
}

export async function waitForVideo(taskId, { timeoutMs = 12 * 60_000, intervalMs = 6000, onTick } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const record = await request(`/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`);
    const flag = Number(record.successFlag);
    onTick?.({ taskId, state: `flag-${flag}` });

    if (flag === 1) {
      const urls = parseVeoUrls(record);
      if (!urls.length) throw new KieError('Veo sukses tapi tidak ada URL', record);
      return urls;
    }
    if (flag === 2 || flag === 3) {
      throw new KieError(`Veo gagal (flag ${flag}): ${record.errorMessage || 'tanpa keterangan'}`, record);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new KieError(`Video ${taskId} melewati batas waktu`);
}

function parseVeoUrls(record) {
  const raw = record?.resultUrls || record?.response?.resultUrls;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [raw];
    }
  }
  return [];
}

/* ── Download helper ───────────────────────────────────────────────────── */

export async function download(url, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new KieError(`Gagal mengunduh ${url}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destination, buffer);
  log.debug(`Diunduh: ${path.basename(destination)}`, { bytes: buffer.length });
  return destination;
}

/** Cheap connectivity probe used by `naratif doctor`. */
export async function ping() {
  try {
    await request('/api/v1/jobs/recordInfo?taskId=ping-probe', { timeoutMs: 15_000 });
    return { ok: true };
  } catch (error) {
    // A "task not found" response still proves the key authenticates.
    const message = String(error.message || '');
    if (/not\s*found|tidak ditemukan|record/i.test(message)) return { ok: true };
    if (/401|403|menolak/i.test(message)) return { ok: false, why: 'API key ditolak' };
    return { ok: false, why: message };
  }
}
