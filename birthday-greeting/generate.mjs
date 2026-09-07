#!/usr/bin/env node
// Generate a scrapbook-style birthday greeting via kie.ai (Nano Banana Pro).
//
// Usage:
//   KIE_API_KEY=xxx node birthday-greeting/generate.mjs --photo ./photo.jpg --age 25
//   KIE_API_KEY=xxx node birthday-greeting/generate.mjs --no-photo            # style test only
//
// Options:
//   --photo <path>     local photo of the birthday person (jpg/png/webp)
//   --age <n>          number shown on the foil balloons (default 25)
//   --name <text>      optional name written on the cake (omit for none)
//   --label <text>     handwritten tag text (default "Favorite Person")
//   --model <id>       kie.ai model id (default nano-banana-pro)
//   --resolution <r>   1K | 2K | 4K (default 2K)
//   --out <dir>        output directory (default birthday-greeting/output)
//   --no-photo         generate the collage template without a photo
//
// The API key is read from the KIE_API_KEY environment variable only.
// Never hard-code it into this file.

import fs from "node:fs/promises";
import path from "node:path";

const API = "https://api.kie.ai/api/v1";
const UPLOAD_API = "https://kieai.redpandaai.co/api/file-base64-upload";

function parseArgs(argv) {
  const args = {
    age: "25",
    label: "Favorite Person",
    model: "nano-banana-pro",
    resolution: "2K",
    out: path.join("birthday-greeting", "output"),
    noPhoto: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--photo") args.photo = next();
    else if (a === "--age") args.age = next();
    else if (a === "--name") args.name = next();
    else if (a === "--label") args.label = next();
    else if (a === "--model") args.model = next();
    else if (a === "--resolution") args.resolution = next();
    else if (a === "--out") args.out = next();
    else if (a === "--no-photo") args.noPhoto = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.photo && !args.noPhoto) {
    throw new Error("Provide --photo <path> or --no-photo.");
  }
  return args;
}

function buildPrompt({ age, name, label, hasPhoto }) {
  const digits = String(age).split("").map((d) => `"${d}"`).join(" and ");
  const subject = hasPhoto
    ? `Use the person from the attached photo as the centrepiece. Keep her face, smile, skin tone, ` +
      `expression and beige hijab EXACTLY as in the photo, identity preserved, photorealistic, no ` +
      `beautification. Cut her out from the original background (head and shoulders, cropped at the ` +
      `chest) and paste her into the collage like a paper photo cut-out with a thin white paper edge.`
    : `In the centre leave a plain white paper cut-out silhouette of a person's head and shoulders ` +
      `(blank placeholder, no face) where a photo will later be pasted.`;
  const cakeText = name ? ` Small handwritten icing text on the cake reads "${name}".` : "";
  return (
    `Vertical 9:16 scrapbook birthday collage on textured cream/beige paper with subtle grain. ` +
    `Mixed-media cut-and-paste sticker aesthetic, like a handmade Pinterest birthday card. ` +
    `${subject} ` +
    `She wears a sparkly blue glitter cone party hat with a fluffy blue pom-pom on top, tilted slightly. ` +
    `Two small red lightning-bolt stickers next to the hat. ` +
    `Flanking her: two giant shiny silver mylar foil number balloons, ${digits}, one on each side, ` +
    `reflective and metallic, slightly overlapping her shoulders. ` +
    `Above her, the words "HAPPY BIRTHDAY" in ransom-note style, each letter cut from different ` +
    `newspaper and magazine clippings in mismatched black-and-white fonts. ` +
    `Top edge: a string of colourful triangle bunting flags (mustard, teal, rust, cream, navy). ` +
    `Top-left: a dark blue glitter star sticker. Left: a glossy red latex balloon with a curly red string. ` +
    `Top-right: a metallic chrome-blue balloon. ` +
    `A torn brown cardboard tag with the words "${label}" handwritten in red marker and a small ` +
    `red arrow pointing at her, placed next to the hat. ` +
    `Bottom: a round birthday cake with pale blue-green frosting, white piped swirls, fresh strawberries ` +
    `and ${age} lit striped candles (red, blue and white), on a plate at the bottom edge.${cakeText} ` +
    `Bottom-right: a wobbly white rounded sticker with "i love you." handwritten in red cursive. ` +
    `Warm, soft, slightly nostalgic lighting. Every piece of text must be spelled exactly as written. ` +
    `No extra text, no watermark, no logos.`
  );
}

async function api(url, opts = {}, apiKey) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}) from ${url}: ${text.slice(0, 300)}`);
  }
  if (!res.ok || (json.code !== undefined && json.code !== 200)) {
    throw new Error(`Request to ${url} failed (${res.status}): ${JSON.stringify(json).slice(0, 500)}`);
  }
  return json;
}

async function uploadPhoto(photoPath, apiKey) {
  const buf = await fs.readFile(photoPath);
  const ext = path.extname(photoPath).toLowerCase().replace(".", "") || "jpg";
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const json = await api(
    UPLOAD_API,
    {
      method: "POST",
      body: JSON.stringify({
        base64Data: `data:${mime};base64,${buf.toString("base64")}`,
        uploadPath: "images/birthday",
        fileName: `photo-${Date.now()}.${ext === "jpeg" ? "jpg" : ext}`,
      }),
    },
    apiKey,
  );
  const url = json.data?.downloadUrl || json.data?.fileUrl;
  if (!url) throw new Error(`Upload succeeded but no URL in response: ${JSON.stringify(json)}`);
  return url;
}

async function createTask({ model, prompt, imageUrls, resolution }, apiKey) {
  const json = await api(
    `${API}/jobs/createTask`,
    {
      method: "POST",
      body: JSON.stringify({
        model,
        input: {
          prompt,
          image_input: imageUrls,
          aspect_ratio: "9:16",
          resolution,
          output_format: "png",
        },
      }),
    },
    apiKey,
  );
  return json.data.taskId;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForTask(taskId, apiKey, { timeoutMs = 15 * 60 * 1000 } = {}) {
  const start = Date.now();
  let delay = 3000;
  for (;;) {
    const json = await api(`${API}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {}, apiKey);
    const d = json.data;
    process.stdout.write(`  state=${d.state}${d.progress != null ? ` progress=${d.progress}` : ""}\n`);
    if (d.state === "success") {
      const result = JSON.parse(d.resultJson || "{}");
      return { urls: result.resultUrls || [], credits: d.creditsConsumed, costTime: d.costTime };
    }
    if (d.state === "fail") {
      throw new Error(`Task failed: ${d.failCode} ${d.failMsg}`);
    }
    if (Date.now() - start > timeoutMs) throw new Error("Timed out waiting for task");
    await sleep(delay);
    delay = Math.min(delay * 1.5, 15000);
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("Set the KIE_API_KEY environment variable.");
  const args = parseArgs(process.argv.slice(2));
  await fs.mkdir(args.out, { recursive: true });

  const imageUrls = [];
  if (args.photo) {
    console.log(`Uploading ${args.photo} ...`);
    const url = await uploadPhoto(args.photo, apiKey);
    console.log(`  uploaded -> ${url}`);
    imageUrls.push(url);
  }

  const prompt = buildPrompt({ ...args, hasPhoto: imageUrls.length > 0 });
  console.log(`Creating task (${args.model}, ${args.resolution}) ...`);
  const taskId = await createTask({ model: args.model, prompt, imageUrls, resolution: args.resolution }, apiKey);
  console.log(`  taskId=${taskId}`);

  const { urls, credits, costTime } = await waitForTask(taskId, apiKey);
  if (!urls.length) throw new Error("Task succeeded but returned no result URLs");

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const saved = [];
  for (const [i, url] of urls.entries()) {
    const file = path.join(args.out, `birthday-${args.age}-${stamp}${urls.length > 1 ? `-${i + 1}` : ""}.png`);
    await download(url, file);
    saved.push(file);
  }
  console.log(`Done in ${costTime ? Math.round(costTime / 1000) + "s" : "?"}; credits used: ${credits ?? "?"}`);
  for (const f of saved) console.log(`  saved ${f}`);
  await fs.writeFile(
    path.join(args.out, `birthday-${args.age}-${stamp}.json`),
    JSON.stringify({ taskId, model: args.model, prompt, resultUrls: urls, files: saved }, null, 2),
  );
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
