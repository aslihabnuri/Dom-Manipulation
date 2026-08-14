// Renders banner.html to PNG at 1x and 2x.
//   node design/8.8/render.mjs [html] [outBase] [width] [height]
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(process.argv[2] ?? resolve(HERE, "banner.html"));
const outBase = resolve(process.argv[3] ?? resolve(HERE, "nomukita-88"));
const W = Number(process.argv[4] ?? 1080);
const H = Number(process.argv[5] ?? 1350);

// Prefer whatever Playwright resolves; fall back to the image's preinstalled
// Chromium when browsers live outside the npm cache.
const PINNED = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync(PINNED) ? PINNED : undefined);

const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--font-render-hinting=none"],
});

for (const scale of [2, 1]) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: scale,
  });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const out = `${outBase}${scale === 2 ? "@2x" : ""}.png`;
  await page.screenshot({ path: out, type: "png" });
  console.log(`${out}  ${W * scale}x${H * scale}`);
  await ctx.close();
}
await browser.close();
