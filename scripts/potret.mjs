/**
 * Screenshot every screen of the running app.
 *
 * The app is meant to be double-clicked open on someone else's laptop, so the
 * only way to review it from here is to drive a real browser against a real
 * server and look at what comes out.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// PLAYWRIGHT_BROWSERS_PATH holds versioned directories, and the version here
// need not match whatever this playwright build would download.
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const dir = fs
    .readdirSync(root)
    .filter((d) => d.startsWith('chromium-'))
    .sort()
    .pop();
  return dir ? path.join(root, dir, 'chrome-linux', 'chrome') : undefined;
}

const BASE = process.env.BASE || 'http://127.0.0.1:4333';
const outDir = process.argv[2] || 'tmp/potret';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath() });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });

const shot = async (name, { full = false } = {}) => {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: full });
  console.log(`  ${name}`);
  return file;
};

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// 1. The setup gate, which is the first thing anyone sees on a fresh install.
await shot('1-setup');

// Dismiss it and get to the workspace.
const skip = page.locator('#btn-skip-setup');
if (await skip.isVisible().catch(() => false)) await skip.click();
else await page.locator('#setup .btn-ghost, #setup [data-close]').first().click().catch(() => {});
await page.evaluate(() => { const s = document.getElementById('setup'); if (s) s.hidden = true; });
await page.waitForTimeout(400);

// 2. Open the seeded project.
await page.locator('.project-list li').first().click();
await page.waitForTimeout(1000);
await shot('2-produk', { full: true });

for (const [tab, name] of [
  ['topik', '3-topik'],
  ['naskah', '4-naskah'],
  ['papan', '5-papan-cerita'],
]) {
  await page.locator(`.tab[data-tab="${tab}"]`).click();
  await page.waitForTimeout(600);
  await shot(name, { full: tab === 'papan' });
}

// 3. The approval gate on its own — the screen the whole rework exists for.
await page.locator('.gate').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await shot('6-persetujuan');

await browser.close();
console.log(`\n${outDir}`);
