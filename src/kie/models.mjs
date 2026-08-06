import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Registry generated from the OpenAPI specs published at docs.kie.ai. It is a
 * convenience layer for discovery and typo-catching — KIE is the source of
 * truth, so an unknown model is a warning, never a hard block.
 */
export const REGISTRY = JSON.parse(readFileSync(join(HERE, "models.json"), "utf8"));
export const JOB_MODELS = REGISTRY.jobs;
export const CHAT_ENDPOINTS = REGISTRY.chat;

export function getModel(id) {
  return JOB_MODELS[id] ?? null;
}

/** Case-insensitive substring match over model id and title. */
export function searchModels(query = "", { kind } = {}) {
  const q = query.trim().toLowerCase();
  return Object.entries(JOB_MODELS)
    .filter(([id, m]) => {
      if (kind && m.kind !== kind) return false;
      if (!q) return true;
      return id.toLowerCase().includes(q) || (m.title ?? "").toLowerCase().includes(q);
    })
    .map(([id, m]) => ({ id, ...m }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function searchChat(query = "") {
  const q = query.trim().toLowerCase();
  return Object.entries(CHAT_ENDPOINTS)
    .filter(([path, m]) => !q || path.toLowerCase().includes(q) || (m.title ?? "").toLowerCase().includes(q))
    .map(([path, m]) => ({ path, ...m }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Check an input object against the registry schema.
 * Returns { errors, warnings } — errors are missing required fields or values
 * outside a documented enum; warnings cover unknown or deprecated fields.
 */
export function validateInput(modelId, input = {}) {
  const model = getModel(modelId);
  const errors = [];
  const warnings = [];
  if (!model) {
    const close = searchModels(modelId.split("/").pop() ?? modelId).slice(0, 5);
    warnings.push(
      `"${modelId}" is not in the local registry` +
        (close.length ? `. Did you mean: ${close.map((m) => m.id).join(", ")}?` : "."),
    );
    return { errors, warnings, model: null };
  }
  const schema = model.input ?? {};
  for (const [name, spec] of Object.entries(schema)) {
    if (spec.required && input[name] === undefined) {
      errors.push(`missing required input "${name}"${spec.desc ? ` — ${spec.desc}` : ""}`);
    }
  }
  for (const [name, value] of Object.entries(input)) {
    const spec = schema[name];
    if (!spec) {
      warnings.push(`unknown input "${name}" for ${modelId}`);
      continue;
    }
    if (spec.deprecated) warnings.push(`input "${name}" is deprecated for ${modelId}`);
    if (spec.enum && !spec.enum.map(String).includes(String(value))) {
      errors.push(`"${name}"=${JSON.stringify(value)} is not one of: ${spec.enum.join(", ")}`);
    }
  }
  return { errors, warnings, model };
}

/** Human-readable schema dump used by `kie show`. */
export function describeModel(id) {
  const model = getModel(id);
  if (!model) return null;
  const lines = [`${id}  —  ${model.title}`, `kind: ${model.kind}`, `docs: ${model.doc}`, "", "input:"];
  const entries = Object.entries(model.input ?? {});
  if (!entries.length) lines.push("  (no documented input fields)");
  for (const [name, spec] of entries) {
    const flags = [
      spec.required ? "required" : "optional",
      spec.type,
      spec.default !== undefined ? `default=${JSON.stringify(spec.default)}` : null,
      spec.deprecated ? "DEPRECATED" : null,
    ].filter(Boolean);
    lines.push(`  ${name}  (${flags.join(", ")})`);
    if (spec.enum) lines.push(`    one of: ${spec.enum.join(" | ")}`);
    if (spec.desc) lines.push(`    ${spec.desc}`);
  }
  if (model.example) {
    lines.push("", "example input:", JSON.stringify(model.example, null, 2).split("\n").map((l) => `  ${l}`).join("\n"));
  }
  return lines.join("\n");
}
