/**
 * Renders index.html to a print-ready A4 landscape PDF, plus PNG previews.
 *
 *   node build.js              -> PDF only
 *   node build.js --preview    -> PDF + one PNG per page (for visual review)
 *
 * Chromium comes from the globally installed Playwright; no network access needed
 * because every asset (fonts, logos, QR codes) lives in ./assets.
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const ROOT = __dirname;
const OUT_DIR = path.resolve(ROOT, "..", "docs");
const OUT_PDF = path.join(OUT_DIR, "Monster-Padel-Payment-Flow-Cards.pdf");
const PREVIEW_DIR = path.join(ROOT, "preview");

(async () => {
  const preview = process.argv.includes("--preview");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // --font-render-hinting=none keeps glyph advances subpixel instead of rounding
  // them to whole pixels. Without it, Inter's already-tight bold word space
  // rounds down to ~2px at 9-11px type and words visually run together.
  const browser = await chromium.launch({
    args: ["--font-render-hinting=none", "--force-color-profile=srgb"],
  });
  // deviceScaleFactor 2 so PNG previews resolve the 0.8-scaled phone screens the
  // way the vector PDF does; at 1x the downscaled type reads as broken kerning.
  const page = await browser.newPage({
    viewport: { width: 1122, height: 793 },
    deviceScaleFactor: 2,
  });

  await page.goto("file://" + path.join(ROOT, "index.html"), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  await page.pdf({
    path: OUT_PDF,
    width: "297mm",
    height: "210mm",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: false,
  });
  console.log("PDF  ->", OUT_PDF, (fs.statSync(OUT_PDF).size / 1024).toFixed(0) + " KB");

  if (preview) {
    fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    const pages = await page.$$(".page");
    for (let i = 0; i < pages.length; i++) {
      const file = path.join(PREVIEW_DIR, `page-${String(i + 1).padStart(2, "0")}.png`);
      await pages[i].screenshot({ path: file });
      console.log("PNG  ->", file);
    }
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
