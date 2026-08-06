import { createReadStream } from "node:fs";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { API_BASE, FILE_BASE, resolveApiKey } from "./config.mjs";

export const TERMINAL_STATES = new Set(["success", "fail"]);
export const PENDING_STATES = new Set(["waiting", "queuing", "generating"]);

export class KieError extends Error {
  constructor(message, { code, taskId, failCode, body } = {}) {
    super(message);
    this.name = "KieError";
    this.code = code;
    this.taskId = taskId;
    this.failCode = failCode;
    this.body = body;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class KieClient {
  constructor({ apiKey, apiBase = API_BASE, fileBase = FILE_BASE, timeoutMs = 120_000 } = {}) {
    if (apiKey) {
      this.apiKey = apiKey;
      this.keySource = "explicit";
    } else {
      const resolved = resolveApiKey();
      this.apiKey = resolved.key;
      this.keySource = resolved.source;
    }
    this.apiBase = apiBase.replace(/\/+$/, "");
    this.fileBase = fileBase.replace(/\/+$/, "");
    this.timeoutMs = timeoutMs;
  }

  get headers() {
    return { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" };
  }

  async #fetch(url, init = {}) {
    const signal = init.signal ?? AbortSignal.timeout(this.timeoutMs);
    let res;
    try {
      res = await fetch(url, { ...init, signal });
    } catch (err) {
      throw new KieError(`Request to ${url} failed: ${err.message}`, { code: "NETWORK" });
    }
    const text = await res.text();
    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      throw new KieError(`Non-JSON response from ${url} (HTTP ${res.status}): ${text.slice(0, 300)}`, {
        code: res.status,
      });
    }
    // KIE returns HTTP 200 with a non-200 `code` for application errors, so the
    // envelope code is the real status — check it, not res.ok alone.
    const code = body.code ?? (res.ok ? 200 : res.status);
    if (code !== 200) {
      throw new KieError(body.msg || `Request failed with code ${code}`, { code, body });
    }
    return body;
  }

  /** Remaining account credits. */
  async credits() {
    const body = await this.#fetch(`${this.apiBase}/api/v1/chat/credit`, { headers: this.headers });
    return body.data;
  }

  /** Submit an async generation job. Returns the taskId. */
  async createTask(model, input, { callBackUrl } = {}) {
    const payload = { model, input };
    if (callBackUrl) payload.callBackUrl = callBackUrl;
    const body = await this.#fetch(`${this.apiBase}/api/v1/jobs/createTask`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    const taskId = body.data?.taskId;
    if (!taskId) throw new KieError("createTask succeeded but returned no taskId", { body });
    return taskId;
  }

  /** Current state of a task, with resultJson already parsed into `result`. */
  async getTask(taskId) {
    const body = await this.#fetch(
      `${this.apiBase}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      { headers: this.headers },
    );
    const data = body.data ?? {};
    let result = null;
    if (data.resultJson) {
      try {
        result = JSON.parse(data.resultJson);
      } catch {
        result = { raw: data.resultJson };
      }
    }
    return { ...data, result, urls: result?.resultUrls ?? [] };
  }

  /**
   * Poll until the task reaches a terminal state. Backs off from `pollMs` to
   * `maxPollMs` so long video jobs don't hammer the API.
   */
  async waitForTask(taskId, { pollMs = 3_000, maxPollMs = 15_000, timeoutMs = 20 * 60_000, onUpdate } = {}) {
    const deadline = Date.now() + timeoutMs;
    let delay = pollMs;
    let last = null;
    while (Date.now() < deadline) {
      const task = await this.getTask(taskId);
      if (onUpdate && task.state !== last) onUpdate(task);
      last = task.state;
      if (task.state === "success") return task;
      if (task.state === "fail") {
        throw new KieError(task.failMsg || "Task failed", {
          taskId,
          failCode: task.failCode,
          body: task,
        });
      }
      await sleep(delay);
      delay = Math.min(Math.round(delay * 1.4), maxPollMs);
    }
    throw new KieError(`Timed out after ${Math.round(timeoutMs / 1000)}s waiting for task ${taskId}`, {
      taskId,
      code: "TIMEOUT",
    });
  }

  /** createTask + waitForTask in one call. */
  async run(model, input, opts = {}) {
    const taskId = await this.createTask(model, input, opts);
    opts.onTask?.(taskId);
    return this.waitForTask(taskId, opts);
  }

  /**
   * Upload a local file and return its hosted URL — the form image-editing and
   * image-to-video models expect. Hosted files expire after 24 hours.
   */
  async uploadFile(path, { uploadPath = "images", fileName } = {}) {
    const name = fileName || basename(path);
    const buf = await readFile(path);
    const form = new FormData();
    form.append("file", new Blob([buf]), name);
    form.append("uploadPath", uploadPath);
    form.append("fileName", name);
    const res = await fetch(`${this.fileBase}/api/file-stream-upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form,
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success === false || (body.code !== undefined && body.code !== 200)) {
      throw new KieError(body.msg || body.message || `Upload failed (HTTP ${res.status})`, {
        code: body.code ?? res.status,
        body,
      });
    }
    return normalizeUpload(body);
  }

  /** Mirror a remote file into KIE storage and return its hosted URL. */
  async uploadFromUrl(fileUrl, { uploadPath = "images", fileName } = {}) {
    const res = await fetch(`${this.fileBase}/api/file-url-upload`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ fileUrl, uploadPath, fileName: fileName || basename(new URL(fileUrl).pathname) }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.success === false || (body.code !== undefined && body.code !== 200)) {
      throw new KieError(body.msg || body.message || `Upload failed (HTTP ${res.status})`, {
        code: body.code ?? res.status,
        body,
      });
    }
    return normalizeUpload(body);
  }

  /**
   * OpenAI- and Anthropic-compatible chat passthrough. `endpoint` is a path
   * from the registry, e.g. "/gemini-3-pro/v1/chat/completions".
   */
  async chat(endpoint, payload) {
    return this.#fetch(`${this.apiBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
  }
}

/** Save every result URL of a finished task into `dir`. Returns local paths. */
export async function downloadResults(task, dir, { prefix } = {}) {
  const urls = task.urls ?? [];
  if (!urls.length) return [];
  await mkdir(dir, { recursive: true });
  const stem = prefix || String(task.taskId || "kie").replace(/[^\w.-]/g, "_");
  const saved = [];
  for (const [i, url] of urls.entries()) {
    const res = await fetch(url, { signal: AbortSignal.timeout(300_000) });
    if (!res.ok) throw new KieError(`Download failed (HTTP ${res.status}): ${url}`);
    const ext = extname(new URL(url).pathname) || guessExt(res.headers.get("content-type"));
    const name = urls.length > 1 ? `${stem}-${i + 1}${ext}` : `${stem}${ext}`;
    const target = join(dir, name);
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    saved.push(target);
  }
  return saved;
}

/**
 * The upload endpoints answer with a flat body and call the hosted link
 * `downloadUrl`, while the published docs show `data.fileUrl`. Expose one
 * shape with `fileUrl` always populated.
 */
function normalizeUpload(body) {
  const data = body.data && typeof body.data === "object" ? body.data : body;
  const fileUrl = data.fileUrl ?? data.downloadUrl ?? data.url ?? null;
  return { ...data, fileUrl, downloadUrl: data.downloadUrl ?? fileUrl };
}

function guessExt(contentType = "") {
  const map = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
  };
  return map[contentType.split(";")[0].trim()] || ".bin";
}

export { createReadStream };
