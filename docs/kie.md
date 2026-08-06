# KIE.ai integration

A zero-dependency client, CLI, and model registry for [KIE.ai](https://kie.ai) —
a single API in front of ~124 image/video/audio generation models plus a set of
chat models (Gemini, GPT, Grok, Claude) behind OpenAI- and Anthropic-shaped endpoints.

Node 18+ only. No `npm install` required; everything uses built-in `fetch`, `FormData`, and `node:test`.

## Setup

```bash
cp .env.example .env.local
# put your key from https://kie.ai/api-key into KIE_API_KEY
node bin/kie.mjs doctor
```

```
key      b63c************************caec  (from .env.local)
endpoint https://api.kie.ai
credits  2849.36
status   OK
```

Key resolution order — first hit wins:

| Order | Source | Tracked by git? |
|---|---|---|
| 1 | `KIE_API_KEY` environment variable | no |
| 2 | `.env.local` at the repo root | no — gitignored |
| 3 | `.env` at the repo root | no — gitignored |
| 4 | `~/.kie/credentials.json` (`{"apiKey":"..."}`) | outside the repo |

There is deliberately no tracked file that can hold the key.

## CLI

| Command | What it does |
|---|---|
| `kie doctor` | verify key + connectivity, print masked key and balance |
| `kie credits` | remaining credit balance |
| `kie models [query] [--kind=image\|video\|audio] [--chat]` | search the local registry |
| `kie show <model>` | full input schema, enums, defaults, example |
| `kie run <model> [options]` | submit → poll → download |
| `kie status <taskId>` | one-shot task state |
| `kie wait <taskId> [--out=DIR]` | poll an existing task to completion |
| `kie upload <file\|url>` | host a file, get a URL back |
| `kie chat <endpoint> --message=TXT` | chat passthrough |

Run through npm (`npm run kie -- models nano-banana`) or directly (`node bin/kie.mjs models nano-banana`).

### Generating

```bash
node bin/kie.mjs run google/nano-banana \
  --prompt="a flat vector icon of a browser window with a glowing DOM tree" \
  --input aspect_ratio=1:1 \
  --out=./kie-out
```

```
submitted google/nano-banana → e6f55ca53acc915af3c792cf9fde4253
  waiting
  success
state    success
credits  4
urls
  https://tempfile.aiquickdraw.com/as/e6f55ca53acc915af3c792cf9fde4253_1786015694468.png
saved
  kie-out/e6f55ca53acc915af3c792cf9fde4253.png
```

`--input` is repeatable and coerces values: `true`/`false` become booleans, bare numbers
become numbers, and anything starting with `[` or `{` is parsed as JSON. For involved
payloads use `--json-input='{...}'`.

Inputs are validated against the local registry *before* submission, so a typo costs
nothing:

```
kie: input validation failed:
  - "aspect_ratio"="99:1" is not one of: 1:1, 9:16, 16:9, 3:4, 4:3, ...
  (--force to submit anyway)
```

### Long-running jobs

Video takes minutes. Detach and poll:

```bash
TASK=$(node bin/kie.mjs run bytedance/v1-pro-image-to-video \
  --prompt="slow dolly in" --input image_url="$URL" --no-wait --json \
  | node -pe 'JSON.parse(require("fs").readFileSync(0)).taskId')

node bin/kie.mjs wait "$TASK" --out=./kie-out
```

Or pass `--callback=https://your-host/hook` and let KIE POST the result to you.

### Image editing / image-to-video

These models take a **URL**, not file bytes. Upload first — uploads are free, and hosted
files expire after 24 hours:

```bash
URL=$(node bin/kie.mjs upload ./photo.png --json \
  | node -pe 'JSON.parse(require("fs").readFileSync(0)).fileUrl')

node bin/kie.mjs run google/nano-banana-edit \
  --prompt="relight as a night scene" \
  --input image_urls="[\"$URL\"]"
```

### Chat passthrough

```bash
node bin/kie.mjs models --chat
node bin/kie.mjs chat /gemini-3-pro/v1/chat/completions --message="explain event delegation"
node bin/kie.mjs chat /claude/v1/messages --model=claude-sonnet-4-5 --message="…"
```

OpenAI-shaped endpoints (`/…/v1/chat/completions`) take `messages` and an optional
`--system`. `/claude/v1/messages` is Anthropic-shaped: `--system` maps to the top-level
`system` field and `max_tokens` defaults to 2048.

## Library

```js
import { KieClient, downloadResults, searchModels, validateInput } from "./src/kie/index.mjs";

const kie = new KieClient();                  // or new KieClient({ apiKey })

await kie.credits();                          // → 2845.36
const task = await kie.run("google/nano-banana", { prompt: "…", aspect_ratio: "16:9" });
await downloadResults(task, "./kie-out");     // → ["kie-out/<taskId>.png"]
```

| Method | Notes |
|---|---|
| `credits()` | remaining balance |
| `createTask(model, input, {callBackUrl})` | returns `taskId` |
| `getTask(taskId)` | `resultJson` parsed into `.result`, links flattened into `.urls` |
| `waitForTask(taskId, {timeoutMs, onUpdate})` | polls with 3s → 15s backoff, throws on `fail` |
| `run(model, input, opts)` | `createTask` + `waitForTask` |
| `uploadFile(path)` / `uploadFromUrl(url)` | returns `{fileUrl, …}` |
| `chat(endpoint, payload)` | raw passthrough |

Failures throw `KieError` with `code`, `failCode`, and the response `body`.

## API notes

Worth knowing, because two of these contradict the published docs:

- **Errors arrive as HTTP 200.** The real status is the envelope's `code` field. The
  client checks `code`, not `res.ok` alone.
- **`resultJson` is a JSON string**, not an object — it needs a second parse.
- **Upload responses are flat and use `downloadUrl`**, while the docs show
  `data.fileUrl`. `normalizeUpload()` in `client.mjs` reconciles both into `fileUrl`.
- Task states: `waiting`, `queuing`, `generating`, `success`, `fail`.
- Endpoints: `POST /api/v1/jobs/createTask`, `GET /api/v1/jobs/recordInfo?taskId=`,
  `GET /api/v1/chat/credit` on `https://api.kie.ai`; uploads live on
  `https://kieai.redpandaai.co`.

## Regenerating the model registry

`src/kie/models.json` is generated from the OpenAPI specs published at `docs.kie.ai`.
It exists for discovery and typo-catching only — KIE remains the source of truth, and an
unknown model produces a warning rather than a hard failure. To refresh it, re-scrape the
market docs listed in `https://docs.kie.ai/llms.txt`, pulling from each spec's
`paths./api/v1/jobs/createTask.post`: the `model` enum, the `summary`, and the `input`
schema properties.

## Routing Claude Code itself through KIE — separate thing

KIE also resells Claude and can act as a drop-in Anthropic endpoint, which is a
*different* integration from this one and is configured per-machine, not in this repo:

```bash
export ANTHROPIC_BASE_URL="https://api.kie.ai/claude"
export ANTHROPIC_AUTH_TOKEN="your_kie_api_key"   # no "Bearer " prefix
```

That bills Claude Code usage to KIE credits instead of an Anthropic account. It replaces
the model backend for the whole CLI, so set it only if that is what you want — it has no
effect on, and is not needed by, the client documented above.
