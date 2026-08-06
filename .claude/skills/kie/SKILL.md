---
name: kie
description: Generate images, video, or audio, and call Gemini/GPT/Grok/Claude chat models through the KIE.ai API. Use when the user asks to create, edit, or upscale an image; generate or animate a video; synthesize speech or music; or when a task needs a generated asset (icon, hero image, texture, mockup, demo clip). Also use for KIE credit balance, task status, model discovery, or uploading a local file to get a hosted URL for image-to-video and image-editing models.
---

# KIE.ai

This repo ships a zero-dependency KIE client at `src/kie/` and a CLI at `bin/kie.mjs`.
124 async generation models (50 image, 69 video, 5 audio) plus 12 chat endpoints.

## Before anything else

```bash
node bin/kie.mjs doctor
```

Prints the key source, endpoint, and credit balance. If it fails, the key is missing —
see "Credentials" below. **Never** print the key itself or paste it into a tracked file.

## Cost discipline

Every generation spends the user's real credits. Image jobs run ~4 credits and ~15s;
video jobs cost far more and take minutes. So:

- Generate **once**, not speculatively. Get the prompt right before submitting.
- Check `kie credits` first for anything beyond a single image.
- **Ask the user before generating video or batches of images.** A single image as part
  of a task they asked for is fine; a fleet of 10 variations is their call.
- Report `creditsConsumed` back to the user after any job.

## Discover a model

The registry is local — searching and inspecting schemas costs nothing.

```bash
node bin/kie.mjs models nano-banana          # search id + title
node bin/kie.mjs models --kind=video         # image | video | audio
node bin/kie.mjs models --chat               # chat passthrough endpoints
node bin/kie.mjs show google/nano-banana     # full input schema + example
```

Always `show` a model before running it. Inputs vary a lot between models and the CLI
validates against the registry, so a wrong field name fails locally before it costs credits.

## Generate

```bash
node bin/kie.mjs run google/nano-banana \
  --prompt="a flat vector icon of a browser window, deep indigo" \
  --input aspect_ratio=1:1 --out=./kie-out
```

`run` submits, polls to completion, downloads every result URL into `--out`
(default `./kie-out`, gitignored), and prints credits consumed. Useful flags:
`--no-wait` (print taskId and exit), `--no-download` (keep URLs), `--json`,
`--timeout=SECONDS`, `--force` (skip local validation), `--callback=URL`.

Repeat `--input k=v` for each field; values parse as JSON when they look like it, so
arrays work: `--input image_urls='["https://...","https://..."]'`. For anything complex
use `--json-input='{"prompt":"...","image_urls":["..."]}'`.

Long jobs: `run --no-wait` then `node bin/kie.mjs wait <taskId> --out=./kie-out`
or `node bin/kie.mjs status <taskId>`.

## Editing and image-to-video need a hosted URL

Those models take `image_urls` / `image_url` — a URL, never file content. Upload first:

```bash
URL=$(node bin/kie.mjs upload ./photo.png --json | node -pe 'JSON.parse(require("fs").readFileSync(0)).fileUrl')
node bin/kie.mjs run google/nano-banana-edit --prompt="make it night" --input image_urls="[\"$URL\"]"
```

`upload` accepts a local path or a remote URL. Uploads are free; hosted files expire after 24h.

## Chat models

```bash
node bin/kie.mjs chat /gemini-3-pro/v1/chat/completions --message="..." --system="..."
node bin/kie.mjs chat /claude/v1/messages --model=claude-sonnet-4-5 --message="..."
```

Paths come from `models --chat`. OpenAI-shaped endpoints take `messages`; `/claude/v1/messages`
is Anthropic-shaped and needs `--model` plus `max_tokens` (the CLI defaults it to 2048).

## From JavaScript

```js
import { KieClient, downloadResults } from "./src/kie/index.mjs";

const kie = new KieClient();                       // key resolved from env / .env.local
const task = await kie.run("google/nano-banana", { prompt: "…", aspect_ratio: "16:9" });
const files = await downloadResults(task, "./kie-out");
```

`KieClient` also exposes `credits()`, `createTask()`, `getTask()`, `waitForTask()`,
`uploadFile()`, `uploadFromUrl()`, and `chat()`. Errors throw `KieError` carrying
`code`, `failCode`, and the response `body`. `waitForTask` backs off 3s → 15s and
throws on `fail` or timeout.

## Credentials

Resolution order: `KIE_API_KEY` env → `.env.local` → `.env` → `~/.kie/credentials.json`.
All of those paths are gitignored. Keys are issued at https://kie.ai/api-key.

Do not add the key to `.claude/settings.json`, a commit, a README, or a PR body —
`.claude/settings.local.json` or `.env.local` are the right homes for it.

## Gotchas worth knowing

- KIE returns **HTTP 200 with a non-200 `code`** in the body for application errors.
  The client already checks the envelope code; don't reintroduce a bare `res.ok` check.
- `recordInfo` returns `resultJson` as a **JSON string**. The client parses it into
  `task.result` and flattens the links into `task.urls`.
- Task states are `waiting | queuing | generating | success | fail`.
- The upload endpoints answer with a flat body using `downloadUrl`, not the `data.fileUrl`
  the published docs show. The client normalizes both into `fileUrl`.
- The local registry is a convenience copy of the published OpenAPI specs. An unknown
  model is a warning, not a block — KIE is the source of truth. Regenerate notes are in
  `docs/kie.md`.
