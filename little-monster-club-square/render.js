#!/usr/bin/env node
/**
 * Headless renderer for the Little Monster Club square advert.
 *
 * It drives square-cut.html, the same file that is published as the browser
 * builder, so there is only ever one implementation of the layout.
 *
 *   node render.js                                  # placeholder background
 *   node render.js --photo assets/photo.jpg
 *   node render.js --photo assets/photo.jpg --logo assets/logo.png --qr assets/qr.png
 *   node render.js --zoom 130 --x 46 --y 30 --time "16.00 to 17.30"
 *
 * Options: --out --photo --logo --qr --story --zoom --x --y --time --no-scrim
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';

const argv = process.argv.slice(2);
const flag = (name, fb) => {
  const i = argv.indexOf('--' + name);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fb;
};
const has = name => argv.includes('--' + name);

const opts = {
  out:   flag('out', 'out/little-monster-club-1x1.png'),
  photo: flag('photo'), logo: flag('logo'), qr: flag('qr'), story: flag('story'),
  zoom:  flag('zoom', '100'), x: flag('x', '50'), y: flag('y', '34'),
  time:  flag('time', ''), scrim: !has('no-scrim'),
};

// Google Fonts is unreachable in a sandbox, so serve the same faces from disk.
function localFontCss() {
  const b64 = f => fs.readFileSync(path.join(HERE, 'fonts', f)).toString('base64');
  const face = (fam, weight, file) =>
    `@font-face{font-family:"${fam}";font-weight:${weight};font-style:normal;font-display:block;` +
    `src:url(data:font/woff2;base64,${b64(file)}) format("woff2");}`;
  return [
    face('Baloo 2', 600, 'Baloo2.woff2'),
    face('Baloo 2', 800, 'Baloo2.woff2'),
    face('Archivo', '400 700', 'Archivo.woff2'),
  ].join('\n');
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

  const problems = [];
  page.on('pageerror', e => problems.push(e.message));

  const css = localFontCss();
  const archivo900 = fs.readFileSync(path.join(HERE, 'fonts', 'Archivo85.woff2'));
  await page.route('**/fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: css }));
  await page.route('**/fonts.gstatic.com/**',   r => r.fulfill({ contentType: 'font/woff2', body: archivo900 }));

  // wrap the fragment the way the artifact host does
  const frag = fs.readFileSync(path.join(HERE, 'square-cut.html'), 'utf8');
  const cut = frag.indexOf('<div class="wrap">');
  const doc = '<!doctype html><html><head><meta charset="utf-8">' +
    frag.slice(0, cut) + '</head><body>' + frag.slice(cut) + '</body></html>';
  const tmp = path.join(HERE, '.render.tmp.html');
  fs.writeFileSync(tmp, doc);

  try {
    await page.goto('file://' + tmp);
    await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 });

    for (const [sel, file] of [['#filePhoto', opts.photo], ['#fileLogo', opts.logo],
                               ['#fileQr', opts.qr], ['#fileStory', opts.story]]) {
      if (!file) continue;
      if (!fs.existsSync(file)) { problems.push(`missing file: ${file}`); continue; }
      await page.setInputFiles(sel, path.resolve(file));
      await page.waitForTimeout(200);
    }

    await page.evaluate(o => {
      const set = (id, v) => {
        const el = document.getElementById(id);
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('rZoom', o.zoom); set('rX', o.x); set('rY', o.y);
      if (o.time) set('tD3', o.time);
      const s = document.getElementById('cScrim');
      if (s.checked !== o.scrim) { s.checked = o.scrim; s.dispatchEvent(new Event('change')); }
    }, opts);

    await page.waitForTimeout(300);

    const dataUrl = await page.evaluate(() => document.getElementById('cv').toDataURL('image/png'));
    const outPath = path.resolve(opts.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, Buffer.from(dataUrl.split(',')[1], 'base64'));

    console.log('wrote', opts.out, '1080x1080',
      opts.photo ? `photo=${path.basename(opts.photo)}` : '(placeholder background)');
    if (problems.length) console.warn('warnings:\n  ' + problems.join('\n  '));
  } finally {
    fs.unlinkSync(tmp);
    await browser.close();
  }
})();
