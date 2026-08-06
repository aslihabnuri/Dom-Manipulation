import assert from "node:assert/strict";
import { test } from "node:test";
import { describeModel, getModel, searchChat, searchModels, validateInput } from "../src/kie/models.mjs";
import { maskKey } from "../src/kie/config.mjs";

test("registry exposes job models across all three kinds", () => {
  const kinds = new Set(searchModels("").map((m) => m.kind));
  assert.ok(searchModels("").length > 100, "expected a substantial model registry");
  for (const kind of ["image", "video", "audio"]) assert.ok(kinds.has(kind), `missing kind ${kind}`);
});

test("search matches on id and on title", () => {
  assert.ok(searchModels("nano-banana").some((m) => m.id === "google/nano-banana"));
  assert.ok(searchModels("Nano Banana Edit").some((m) => m.id === "google/nano-banana-edit"));
});

test("kind filter only returns that kind", () => {
  assert.ok(searchModels("", { kind: "video" }).every((m) => m.kind === "video"));
});

test("chat registry includes the OpenAI- and Anthropic-shaped endpoints", () => {
  const paths = searchChat("").map((c) => c.path);
  assert.ok(paths.includes("/claude/v1/messages"));
  assert.ok(paths.some((p) => p.endsWith("/v1/chat/completions")));
});

test("validateInput flags a missing required field", () => {
  const { errors } = validateInput("google/nano-banana", {});
  assert.equal(errors.length, 1);
  assert.match(errors[0], /missing required input "prompt"/);
});

test("validateInput rejects a value outside the documented enum", () => {
  const { errors } = validateInput("google/nano-banana", { prompt: "x", aspect_ratio: "99:1" });
  assert.match(errors.join(""), /aspect_ratio/);
});

test("validateInput accepts a well-formed input", () => {
  const { errors } = validateInput("google/nano-banana", { prompt: "x", aspect_ratio: "16:9" });
  assert.deepEqual(errors, []);
});

test("validateInput warns rather than errors on an unknown model", () => {
  const { errors, warnings } = validateInput("google/nano-bananana", { prompt: "x" });
  assert.deepEqual(errors, [], "unknown models must not hard-fail — KIE is the source of truth");
  assert.match(warnings.join(""), /not in the local registry/);
});

test("validateInput warns on deprecated and unknown fields", () => {
  const { warnings } = validateInput("google/nano-banana", { prompt: "x", image_size: "1:1", nope: 1 });
  assert.match(warnings.join(""), /deprecated/);
  assert.match(warnings.join(""), /unknown input "nope"/);
});

test("describeModel renders a schema, and returns null when unknown", () => {
  assert.match(describeModel("google/nano-banana"), /required, string/);
  assert.equal(describeModel("definitely/not-a-model"), null);
});

test("image-editing models document image_urls as required", () => {
  const model = getModel("google/nano-banana-edit");
  assert.equal(model.input.image_urls.required, true);
});

test("maskKey never reveals the middle of a key", () => {
  // Fixture only — never put a live key in a tracked file.
  const masked = maskKey("0123456789abcdef0123456789abcdef");
  assert.equal(masked, "0123************************cdef");
  assert.ok(!masked.includes("89abcdef01"));
});

test("maskKey handles short and empty values without leaking them", () => {
  assert.equal(maskKey("abcdef"), "ab****");
  assert.equal(maskKey(""), "(none)");
  assert.equal(maskKey(undefined), "(none)");
});
