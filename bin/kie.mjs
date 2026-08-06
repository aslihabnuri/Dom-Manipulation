#!/usr/bin/env node
import { KieClient, KieError, downloadResults } from "../src/kie/client.mjs";
import { maskKey, resolveApiKey, API_BASE } from "../src/kie/config.mjs";
import { describeModel, searchChat, searchModels, validateInput } from "../src/kie/models.mjs";

const USAGE = `kie — KIE.ai from the command line

  kie doctor                        verify the API key and connectivity
  kie credits                       show the remaining credit balance
  kie models [query] [--kind=image|video|audio] [--chat] [--json]
  kie show <model>                  print a model's input schema
  kie run <model> [options]         create a job, wait for it, download results
  kie status <taskId> [--json]      one-shot task status
  kie wait <taskId> [--out=DIR]     poll an existing task to completion
  kie upload <file|url> [--path=images]
  kie chat <endpoint> --message=TXT [--system=TXT] [--json]

run options
  --prompt=TEXT             shorthand for --input prompt=TEXT
  --input k=v               repeatable; v is parsed as JSON when possible
  --json-input='{...}'      full input object, merged under --input/--prompt
  --out=DIR                 download results here (default: ./kie-out)
  --no-download             leave results as URLs
  --no-wait                 print the taskId and exit
  --callback=URL            register a completion webhook
  --timeout=SECONDS         max wait (default 1200)
  --force                   submit even if local validation fails
  --json                    machine-readable output

examples
  kie models nano-banana
  kie run google/nano-banana --prompt="a red bicycle in the rain" --out=./art
  kie run bytedance/v1-pro-image-to-video --input image_url=https://... --prompt="slow pan"
  kie chat /gemini-3-pro/v1/chat/completions --message="summarise DOM event delegation"
`;

// Flags that take a value, so `--out DIR` works as well as `--out=DIR`.
const VALUE_FLAGS = new Set([
  "json-input",
  "prompt",
  "out",
  "callback",
  "timeout",
  "kind",
  "message",
  "system",
  "model",
  "max-tokens",
  "path",
]);

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  const inputs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--input" || arg === "-i") {
      const pair = argv[++i] ?? "";
      const eq = pair.indexOf("=");
      if (eq === -1) fail(`--input expects key=value, got "${pair}"`);
      inputs[pair.slice(0, eq)] = coerce(pair.slice(eq + 1));
    } else if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq !== -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
        continue;
      }
      const name = arg.slice(2);
      const next = argv[i + 1];
      // Only swallow the next token for known value flags, so bare booleans
      // like `--json run` keep working.
      if (VALUE_FLAGS.has(name) && next !== undefined && !next.startsWith("--")) {
        flags[name] = next;
        i++;
      } else {
        flags[name] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional, inputs };
}

/** Numbers, booleans and JSON literals arrive as strings on the CLI. */
function coerce(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value !== "" && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (/^[[{]/.test(value.trim())) {
    try {
      return JSON.parse(value);
    } catch {
      /* keep the raw string */
    }
  }
  return value;
}

function fail(message) {
  console.error(`kie: ${message}`);
  process.exit(1);
}

const out = (flags, obj, text) => {
  if (flags.json) console.log(JSON.stringify(obj, null, 2));
  else console.log(text);
};

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { flags, positional, inputs } = parseArgs(rest);

  if (!command || command === "help" || flags.help) {
    console.log(USAGE);
    return;
  }

  // Registry lookups work without a key; everything else needs one.
  if (command === "models") return cmdModels(flags, positional);
  if (command === "show") return cmdShow(positional);

  const client = new KieClient();

  switch (command) {
    case "doctor":
      return cmdDoctor(client, flags);
    case "credits":
      return cmdCredits(client, flags);
    case "run":
      return cmdRun(client, flags, positional, inputs);
    case "status":
      return cmdStatus(client, flags, positional);
    case "wait":
      return cmdWait(client, flags, positional);
    case "upload":
      return cmdUpload(client, flags, positional);
    case "chat":
      return cmdChat(client, flags, positional);
    default:
      fail(`unknown command "${command}". Run \`kie help\`.`);
  }
}

function cmdModels(flags, positional) {
  const query = positional.join(" ");
  if (flags.chat) {
    const rows = searchChat(query);
    return out(
      flags,
      rows,
      rows.map((r) => `${r.api.padEnd(17)} ${r.path.padEnd(48)} ${r.title}`).join("\n") ||
        "(no matching chat endpoints)",
    );
  }
  const rows = searchModels(query, { kind: typeof flags.kind === "string" ? flags.kind : undefined });
  out(
    flags,
    rows,
    rows.map((r) => `${r.kind.padEnd(6)} ${r.id.padEnd(46)} ${r.title}`).join("\n") +
      (rows.length ? `\n\n${rows.length} model(s)` : "(no matching models)"),
  );
}

function cmdShow(positional) {
  const id = positional[0];
  if (!id) fail("usage: kie show <model>");
  const text = describeModel(id);
  if (!text) {
    const close = searchModels(id).slice(0, 8);
    fail(
      `unknown model "${id}"` +
        (close.length ? `\n  closest matches:\n${close.map((m) => `    ${m.id}`).join("\n")}` : ""),
    );
  }
  console.log(text);
}

async function cmdDoctor(client, flags) {
  const { source } = resolveApiKey();
  const credits = await client.credits();
  const report = { ok: true, keySource: source, key: maskKey(client.apiKey), apiBase: API_BASE, credits };
  out(
    flags,
    report,
    `key      ${maskKey(client.apiKey)}  (from ${source})\n` +
      `endpoint ${API_BASE}\n` +
      `credits  ${credits}\n` +
      `status   OK`,
  );
}

async function cmdCredits(client, flags) {
  const credits = await client.credits();
  out(flags, { credits }, String(credits));
}

async function cmdRun(client, flags, positional, inputs) {
  const model = positional[0];
  if (!model) fail("usage: kie run <model> [--prompt=... | --input k=v]");

  let input = { ...inputs };
  if (typeof flags["json-input"] === "string") {
    let parsed;
    try {
      parsed = JSON.parse(flags["json-input"]);
    } catch (err) {
      fail(`--json-input is not valid JSON: ${err.message}`);
    }
    input = { ...parsed, ...input };
  }
  if (typeof flags.prompt === "string") input.prompt = flags.prompt;

  const { errors, warnings } = validateInput(model, input);
  for (const w of warnings) console.error(`warning: ${w}`);
  if (errors.length && !flags.force) {
    fail(`input validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}\n  (--force to submit anyway)`);
  }

  const taskId = await client.createTask(model, input, {
    callBackUrl: typeof flags.callback === "string" ? flags.callback : undefined,
  });

  if (flags["no-wait"]) return out(flags, { taskId, model }, `taskId: ${taskId}`);
  if (!flags.json) console.error(`submitted ${model} → ${taskId}`);

  const task = await client.waitForTask(taskId, {
    timeoutMs: (Number(flags.timeout) || 1200) * 1000,
    onUpdate: (t) => {
      if (!flags.json) console.error(`  ${t.state}${t.progress ? ` ${t.progress}%` : ""}`);
    },
  });

  await report(client, task, flags);
}

async function cmdStatus(client, flags, positional) {
  const taskId = positional[0];
  if (!taskId) fail("usage: kie status <taskId>");
  const task = await client.getTask(taskId);
  out(
    flags,
    task,
    `state    ${task.state}\n` +
      `model    ${task.model ?? "-"}\n` +
      `progress ${task.progress ?? "-"}\n` +
      `credits  ${task.creditsConsumed ?? "-"}\n` +
      (task.failMsg ? `error    ${task.failCode ?? ""} ${task.failMsg}\n` : "") +
      (task.urls.length ? `urls\n${task.urls.map((u) => `  ${u}`).join("\n")}` : ""),
  );
}

async function cmdWait(client, flags, positional) {
  const taskId = positional[0];
  if (!taskId) fail("usage: kie wait <taskId>");
  const task = await client.waitForTask(taskId, {
    timeoutMs: (Number(flags.timeout) || 1200) * 1000,
    onUpdate: (t) => {
      if (!flags.json) console.error(`  ${t.state}${t.progress ? ` ${t.progress}%` : ""}`);
    },
  });
  await report(client, task, flags);
}

async function report(client, task, flags) {
  let files = [];
  if (!flags["no-download"] && task.urls.length) {
    const dir = typeof flags.out === "string" ? flags.out : "./kie-out";
    files = await downloadResults(task, dir);
  }
  out(
    flags,
    { taskId: task.taskId, state: task.state, creditsConsumed: task.creditsConsumed, urls: task.urls, files },
    `state    ${task.state}\n` +
      `credits  ${task.creditsConsumed ?? "-"}\n` +
      `time     ${task.costTime ? `${Math.round(task.costTime / 1000)}s` : "-"}\n` +
      (task.urls.length ? `urls\n${task.urls.map((u) => `  ${u}`).join("\n")}\n` : "") +
      (files.length ? `saved\n${files.map((f) => `  ${f}`).join("\n")}` : ""),
  );
}

async function cmdUpload(client, flags, positional) {
  const target = positional[0];
  if (!target) fail("usage: kie upload <file|url>");
  const uploadPath = typeof flags.path === "string" ? flags.path : "images";
  const data = /^https?:\/\//.test(target)
    ? await client.uploadFromUrl(target, { uploadPath })
    : await client.uploadFile(target, { uploadPath });
  out(flags, data, `${data.fileUrl}\n(hosted files expire after 24h)`);
}

async function cmdChat(client, flags, positional) {
  const endpoint = positional[0];
  if (!endpoint) fail("usage: kie chat <endpoint> --message=TEXT");
  if (typeof flags.message !== "string") fail("--message is required");

  const isAnthropic = endpoint.includes("/v1/messages");
  const messages = [];
  if (typeof flags.system === "string" && !isAnthropic) {
    messages.push({ role: "system", content: flags.system });
  }
  messages.push({ role: "user", content: flags.message });

  const payload = { messages, stream: false };
  if (isAnthropic) {
    payload.model = typeof flags.model === "string" ? flags.model : "claude-sonnet-4-5";
    payload.max_tokens = Number(flags["max-tokens"]) || 2048;
    if (typeof flags.system === "string") payload.system = flags.system;
  } else if (typeof flags.model === "string") {
    payload.model = flags.model;
  }

  const body = await client.chat(endpoint, payload);
  const text =
    body.choices?.[0]?.message?.content ??
    body.content?.map?.((c) => c.text).filter(Boolean).join("\n") ??
    JSON.stringify(body, null, 2);
  out(flags, body, typeof text === "string" ? text : JSON.stringify(text, null, 2));
}

main().catch((err) => {
  if (err instanceof KieError) {
    console.error(`kie: ${err.message}${err.code ? ` (code ${err.code})` : ""}`);
    if (err.failCode) console.error(`     failCode ${err.failCode}`);
  } else {
    console.error(`kie: ${err.message}`);
  }
  process.exit(1);
});
