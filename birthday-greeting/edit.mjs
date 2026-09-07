#!/usr/bin/env node
// Apply a single edit instruction to an existing image via kie.ai (Nano Banana Pro).
//
//   KIE_API_KEY=xxx node birthday-greeting/edit.mjs --image in.png --prompt "remove the sticker" [--out dir] [--resolution 2K]
//
// The API key is read from the KIE_API_KEY environment variable only.

import fs from "node:fs/promises";
import path from "node:path";

const API = "https://api.kie.ai/api/v1";
const UPLOAD_API = "https://kieai.redpandaai.co/api/file-base64-upload";

function parseArgs(argv) {
  const args = { model: "nano-banana-pro", resolution: "2K", out: path.join("birthday-greeting", "output") };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--image") args.image = next();
    else if (a === "--prompt") args.prompt = next();
    else if (a === "--model") args.model = next();
    else if (a === "--resolution") args.resolution = next();
    else if (a === "--out") args.out = next();
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.image || !args.prompt) throw new Error("Both --image and --prompt are required.");
  return args;
}

async function api(url, opts, apiKey) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 300)}`); }
  if (!res.ok || (json.code !== undefined && json.code !== 200)) {
    throw new Error(`Request failed (${res.status}): ${JSON.stringify(json).slice(0, 500)}`);
  }
  return json;
}

async function upload(file, apiKey) {
  const buf = await fs.readFile(file);
  const ext = path.extname(file).toLowerCase().replace(".", "") || "png";
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const json = await api(UPLOAD_API, {
    method: "POST",
    body: JSON.stringify({ base64Data: `data:${mime};base64,${buf.toString("base64")}`, uploadPath: "images/birthday", fileName: `edit-${Date.now()}.${ext}` }),
  }, apiKey);
  const url = json.data?.downloadUrl || json.data?.fileUrl;
  if (!url) throw new Error(`Upload returned no URL: ${JSON.stringify(json)}`);
  return url;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("Set the KIE_API_KEY environment variable.");
  const args = parseArgs(process.argv.slice(2));
  await fs.mkdir(args.out, { recursive: true });

  console.log(`Uploading ${args.image} ...`);
  const imageUrl = await upload(args.image, apiKey);
  const prompt =
    `Edit the attached image. ${args.prompt} ` +
    `Change nothing else: keep the composition, every other element, the person's face, colours, ` +
    `text and paper texture exactly as they are. Output the same 9:16 framing.`;
  const created = await api(`${API}/jobs/createTask`, {
    method: "POST",
    body: JSON.stringify({ model: args.model, input: { prompt, image_input: [imageUrl], aspect_ratio: "9:16", resolution: args.resolution, output_format: "png" } }),
  }, apiKey);
  const taskId = created.data.taskId;
  console.log(`  taskId=${taskId}`);

  let delay = 3000;
  const start = Date.now();
  for (;;) {
    const { data } = await api(`${API}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {}, apiKey);
    process.stdout.write(`  state=${data.state}\n`);
    if (data.state === "success") {
      const urls = JSON.parse(data.resultJson || "{}").resultUrls || [];
      if (!urls.length) throw new Error("No result URLs");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const file = path.join(args.out, `edit-${stamp}.png`);
      const res = await fetch(urls[0]);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
      console.log(`Done; credits used: ${data.creditsConsumed ?? "?"}\n  saved ${file}`);
      return;
    }
    if (data.state === "fail") throw new Error(`Task failed: ${data.failCode} ${data.failMsg}`);
    if (Date.now() - start > 15 * 60 * 1000) throw new Error("Timed out");
    await sleep(delay);
    delay = Math.min(delay * 1.5, 15000);
  }
}

main().catch((err) => { console.error(`Error: ${err.message}`); process.exit(1); });
