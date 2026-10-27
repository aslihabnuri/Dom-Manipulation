// Cetak HTML ke PDF dengan Chromium (Playwright) — font Barlow terpasang di sistem.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [, , dir, ...names] = process.argv;
  const browser = await chromium.launch();
  for (const n of names) {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(dir, n + '.html'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const title = await page.title();
    await page.pdf({
      path: path.join(dir, n + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-family: Barlow, Arial; font-size:8px; color:#777; width:100%; padding:0 18mm;">${title.replace(/&/g, '&amp;')}</div>`,
      footerTemplate: `<div style="font-family: Barlow, Arial; font-size:8px; color:#777; width:100%; padding:0 18mm; display:flex; justify-content:space-between;"><span>Kelompok Alaska Airlines · OTM Sesi 7</span><span>hal. <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`,
      margin: { top: '16mm', bottom: '16mm', left: '18mm', right: '18mm' },
    });
    await page.close();
    console.log('pdf', n);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
