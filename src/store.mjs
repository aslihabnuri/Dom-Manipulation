import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { config, ensureDirs } from './config.mjs';

/**
 * File-backed JSON store with atomic writes. A studio app on one machine does
 * not need a database, and skipping one avoids a native build step that would
 * otherwise be the most common install failure.
 */

function fileFor(name) {
  return path.join(config.dataDir, `${name}.json`);
}

function readRaw(name, fallback) {
  ensureDirs();
  const file = fileFor(name);
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    // A half-written file should not brick the app; keep it for forensics.
    fs.renameSync(file, `${file}.corrupt-${Date.now()}`);
    return fallback;
  }
}

function writeRaw(name, value) {
  ensureDirs();
  const file = fileFor(name);
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

export function newId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

/* ── Projects ──────────────────────────────────────────────────────────── */

export function listProjects() {
  return readRaw('projects', []);
}

export function getProject(id) {
  return listProjects().find((p) => p.id === id) || null;
}

export function saveProject(project) {
  const all = listProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const record = { ...project, updatedAt: new Date().toISOString() };
  if (index === -1) all.unshift(record);
  else all[index] = record;
  writeRaw('projects', all);
  return record;
}

export function deleteProject(id) {
  writeRaw(
    'projects',
    listProjects().filter((p) => p.id !== id),
  );
}

/* ── Topic history ─────────────────────────────────────────────────────── */
/**
 * Every topic we have ever used, so research can guarantee freshness instead of
 * quietly recycling an angle the account already published.
 */

export function usedTopics() {
  return readRaw('used-topics', []);
}

export function markTopicUsed(topic, projectId) {
  const all = usedTopics();
  all.unshift({
    title: topic.title,
    angle: topic.angle,
    category: topic.category,
    product: topic.product,
    projectId,
    usedAt: new Date().toISOString(),
  });
  writeRaw('used-topics', all.slice(0, 500));
}

/* ── Cost ledger ───────────────────────────────────────────────────────── */

export function ledger() {
  return readRaw('cost-ledger', []);
}

export function recordCost(entry) {
  const all = ledger();
  all.unshift({ ...entry, at: new Date().toISOString() });
  writeRaw('cost-ledger', all.slice(0, 2000));
}

export function costForProject(projectId) {
  return ledger()
    .filter((e) => e.projectId === projectId)
    .reduce((sum, e) => sum + (e.usd || 0), 0);
}
