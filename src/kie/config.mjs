import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const API_BASE = process.env.KIE_API_BASE || "https://api.kie.ai";
export const FILE_BASE = process.env.KIE_FILE_BASE || "https://kieai.redpandaai.co";

function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

// Ordered most specific first. The key never lives in a tracked file — every
// candidate below is either the process environment or a gitignored path.
function candidates() {
  return [
    { source: "env KIE_API_KEY", value: process.env.KIE_API_KEY },
    { source: ".env.local", value: parseEnvFile(join(REPO_ROOT, ".env.local")).KIE_API_KEY },
    { source: ".env", value: parseEnvFile(join(REPO_ROOT, ".env")).KIE_API_KEY },
    { source: "~/.kie/credentials.json", value: readHomeCredential() },
  ];
}

function readHomeCredential() {
  const path = join(homedir(), ".kie", "credentials.json");
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, "utf8")).apiKey;
  } catch {
    return undefined;
  }
}

export function resolveApiKey({ required = true } = {}) {
  for (const c of candidates()) {
    if (c.value && c.value.trim()) return { key: c.value.trim(), source: c.source };
  }
  if (!required) return null;
  throw new Error(
    "No KIE API key found. Set KIE_API_KEY in the environment, or put " +
      "KIE_API_KEY=... in .env.local at the repo root (gitignored), or write " +
      '{"apiKey":"..."} to ~/.kie/credentials.json. Keys come from https://kie.ai/api-key',
  );
}

/** Show only enough of a key to confirm which one is loaded. */
export function maskKey(key) {
  if (!key) return "(none)";
  if (key.length <= 10) return `${key.slice(0, 2)}${"*".repeat(key.length - 2)}`;
  return `${key.slice(0, 4)}${"*".repeat(key.length - 8)}${key.slice(-4)}`;
}
