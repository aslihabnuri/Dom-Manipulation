'use strict';
// Sistem desain bersama untuk dua deck Business Ethics Chapter 3.
// Referensi visual: deck Pal's Sudden Service (warm off-white, flat color card,
// pill label, headline besar berakhir titik oranye).

const pptxgen = require('pptxgenjs');

// ---------- palet ----------
const BG    = 'F2F0EB';
const INK   = '0E1626';
const SLATE = '6B7A90';
const LINE  = 'DDD8CE';
const ORNG  = 'FF5A2D';
const LAV   = 'B8A6F5';
const LIME  = 'C6F04A';
const AMBR  = 'F5B722';
const TEAL  = '0FA98E';
const W     = 'FFFFFF';

const F = 'Calibri';
const MONO = 'Courier New';

// ---------- geometri ----------
const M = 0.68;                 // margin kiri/kanan
const SW = 13.333, SH = 7.5;
const CW = SW - 2 * M;

// ---------- pengukur teks (untuk cek overflow saat build) ----------
const CPI = 0.00745;            // inci per karakter per pt, rata-rata Calibri
function cap(w, size) { return Math.max(1, Math.floor(w / (CPI * size))); }
function estLines(text, w, size) {
  const c = cap(w, size);
  let lines = 1, len = 0;
  for (const seg of String(text).split('\n')) {
    if (len) { lines++; len = 0; }
    for (const wd of seg.split(/\s+/).filter(Boolean)) {
      const add = wd.length + (len ? 1 : 0);
      if (len + add > c) { lines++; len = wd.length; } else { len += add; }
    }
  }
  return lines;
}
const WARN = [];
function chk(tag, text, w, h, size, lineSpacing) {
  const n = estLines(text, w, size);
  const lh = (lineSpacing || size * 1.22) / 72;
  const need = n * lh;
  if (need > h + 0.03) WARN.push(`${tag}: ${n} baris = ${need.toFixed(2)}" > kotak ${h}"`);
  return n;
}
function report(label) {
  if (WARN.length) {
    console.log(`\n!! ${WARN.length} potensi overflow di ${label}:`);
    WARN.forEach(w => console.log('   ', w));
    WARN.length = 0;
  } else {
    console.log(`   ${label}: tidak ada overflow terdeteksi`);
  }
}

// ---------- pembuat presentasi ----------
function newDeck(title, subject) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'Aslih Abnuri';
  pres.title = title;
  pres.subject = subject || '';

  // pptxgenjs memusatkan teks secara vertikal; paksa ke atas
  const base = pres.addSlide.bind(pres);
  pres.addSlide = function (...a) {
    const s = base(...a);
    const orig = s.addText.bind(s);
    s.addText = (t, o) => orig(t, Object.assign({ valign: 'top' }, o));
    return s;
  };
  return pres;
}

// campur dua warna hex, t = porsi warna kedua
function mix(a, b, t) {
  const hx = h => [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  const A = hx(a), B = hx(b);
  return A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ---------- primitif ----------
function bg(s, color) { s.background = { color: color || BG }; }

// kartu bersudut membulat
function card(pres, s, x, y, w, h, fill, opt) {
  s.addShape(pres.ShapeType.roundRect, Object.assign({
    x, y, w, h, rectRadius: (opt && opt.r) || 0.16, fill: { color: fill || W }
  }, (opt && opt.line) ? { line: opt.line } : {}));
}

function rect(pres, s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill } });
}

function pillW(t) { return 0.36 + String(t).length * 0.099; }

// baris pill. items = [{t, fill, color, outline}]
function pills(pres, s, items, y, x0) {
  let x = x0 === undefined ? M : x0;
  const yy = y === undefined ? 0.5 : y;
  items.forEach(it => {
    const t = it.t.toUpperCase();
    const w = pillW(t);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: yy, w, h: 0.31, rectRadius: 0.155,
      fill: it.outline ? { color: BG } : { color: it.fill },
      line: it.outline ? { color: LINE, width: 1 } : { color: it.fill, width: 0 }
    });
    s.addText(t, {
      isTextBox: true, x, y: yy, w, h: 0.31, align: 'center', valign: 'middle',
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.1,
      color: it.color || (it.outline ? INK : W), margin: 0
    });
    x += w + 0.13;
  });
  return x - 0.13;
}

// baris pill rata kanan
function pillsRight(pres, s, items, y, xEnd) {
  const total = items.reduce((a, it) => a + pillW(it.t) + 0.13, 0) - 0.13;
  return pills(pres, s, items, y, (xEnd === undefined ? SW - M : xEnd) - total);
}

// judul besar; titik terakhir diwarnai aksen
function head(s, text, y, size, w, color) {
  const sz = size || 34;
  const ww = w || CW;
  chk('judul "' + text.slice(0, 28) + '"', text + '.', ww, 2.2, sz, sz * 1.16);
  s.addText([
    { text, options: { color: color || INK } },
    { text: '.', options: { color: ORNG } }
  ], {
    isTextBox: true, x: M, y: y === undefined ? 0.96 : y, w: ww, h: sz > 44 ? 2.3 : 1.12,
    fontFace: F, fontSize: sz, bold: true, margin: 0, lineSpacing: sz * 1.16
  });
}

function sub(s, text, y, w, color, size, h) {
  const ww = w || CW;
  const sz = size || 13.5;
  const hh = h || 0.34;
  chk('sub "' + text.slice(0, 24) + '"', text, ww, hh, sz, sz * 1.35);
  s.addText(text, {
    isTextBox: true, x: M, y, w: ww, h: hh,
    fontFace: F, fontSize: sz, color: color || SLATE, margin: 0, lineSpacing: sz * 1.35
  });
}

// chip nomor kecil di sudut kartu
function chip(pres, s, x, y, n, fill, color, d) {
  const dd = d || 0.34;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: dd, h: dd, rectRadius: 0.1, fill: { color: fill } });
  s.addText(String(n), {
    isTextBox: true, x, y, w: dd, h: dd, align: 'center', valign: 'middle',
    fontFace: F, fontSize: 10.5, bold: true, color, margin: 0
  });
}

// kartu berwarna dengan nomor, judul, dan isi
function tile(pres, s, o) {
  const dark = [ORNG, INK, TEAL].indexOf(o.fill) >= 0;
  const fg = dark ? W : INK;
  const bodyFg = dark ? 'E8E4DC' : '2A3243';
  card(pres, s, o.x, o.y, o.w, o.h, o.fill);
  let ty = o.y + 0.24;
  if (o.n) {
    chip(pres, s, o.x + 0.26, o.y + 0.22, o.n, mix(o.fill, dark ? W : INK, 0.16), fg, 0.31);
    ty = o.y + 0.64;
  }
  const ts = o.ts || 14;
  const th = Math.max(0.32, estLines(o.t, o.w - 0.52, ts * 1.07) * ts * 1.22 / 72);
  s.addText(o.t, {
    isTextBox: true, x: o.x + 0.26, y: ty, w: o.w - 0.52, h: th,
    fontFace: F, fontSize: ts, bold: true, color: fg, margin: 0, lineSpacing: ts * 1.22
  });
  if (o.b) {
    const bs = o.bs || 11.5;
    const by = ty + th + 0.08;
    chk('tile-isi ' + o.t, o.b, o.w - 0.52, o.y + o.h - by - 0.14, bs, bs * 1.42);
    s.addText(o.b, {
      isTextBox: true, x: o.x + 0.26, y: by, w: o.w - 0.52,
      h: o.y + o.h - by - 0.14,
      fontFace: F, fontSize: bs, color: bodyFg, margin: 0, lineSpacing: bs * 1.42
    });
  }
}

// kartu statistik: angka besar + label
function stat(pres, s, o) {
  const dark = [ORNG, INK, TEAL].indexOf(o.fill) >= 0;
  const fg = o.numColor || (dark ? W : INK);
  card(pres, s, o.x, o.y, o.w, o.h, o.fill);
  s.addText([
    { text: o.v, options: { fontSize: o.vs || 34, bold: true, color: fg } },
    { text: o.u ? '  ' + o.u : '', options: { fontSize: (o.vs || 34) * 0.42, bold: true, color: fg } }
  ], {
    isTextBox: true, x: o.x + 0.24, y: o.y + 0.24, w: o.w - 0.48, h: 0.62,
    fontFace: F, margin: 0
  });
  const ls = o.ls || 11;
  s.addText(o.l, {
    isTextBox: true, x: o.x + 0.24, y: o.y + 0.94, w: o.w - 0.48, h: o.h - 1.14,
    fontFace: F, fontSize: ls, bold: !!o.lb, color: dark ? 'E8E4DC' : '2A3243',
    margin: 0, lineSpacing: ls * 1.4
  });
  chk('stat ' + o.v, o.l, o.w - 0.48, o.h - 1.14, ls, ls * 1.4);
}

// blok kutipan: kartu putih dengan batang aksen di kiri
function quote(pres, s, x, y, w, h, text, attrib, accent) {
  card(pres, s, x, y, w, h, W);
  s.addShape(pres.ShapeType.rect, { x, y: y + 0.06, w: 0.055, h: h - 0.12, fill: { color: accent || ORNG } });
  chk('kutipan', text, w - 0.7, h - (attrib ? 0.6 : 0.3), 12.5, 18);
  s.addText(text, {
    isTextBox: true, x: x + 0.3, y: y + 0.18, w: w - 0.6, h: h - (attrib ? 0.62 : 0.36),
    fontFace: F, fontSize: 12.5, color: INK, margin: 0, lineSpacing: 18
  });
  if (attrib) {
    s.addText(attrib.toUpperCase(), {
      isTextBox: true, x: x + 0.3, y: y + h - 0.42, w: w - 0.6, h: 0.26,
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0
    });
  }
}

// banner penutup slide
function banner(pres, s, x, y, w, h, text, fill, color, size) {
  card(pres, s, x, y, w, h, fill);
  const sz = size || 13;
  chk('banner', text, w - 0.7, h - 0.2, sz * 1.08, sz * 1.35);
  s.addText(text, {
    isTextBox: true, x: x + 0.35, y: y + (h - Math.ceil(estLines(text, w - 0.7, sz * 1.08)) * sz * 1.35 / 72) / 2,
    w: w - 0.7, h: h - 0.16,
    fontFace: F, fontSize: sz, bold: true, color, margin: 0, lineSpacing: sz * 1.35
  });
}

// baris bernomor: blok warna + judul + keterangan pada kartu putih
function numRow(pres, s, o) {
  card(pres, s, o.x, o.y, o.w, o.h, W);
  s.addShape(pres.ShapeType.rect, { x: o.x, y: o.y, w: 0.62, h: o.h, fill: { color: o.fill } });
  s.addText(String(o.n), {
    isTextBox: true, x: o.x, y: o.y, w: 0.62, h: o.h, align: 'center', valign: 'middle',
    fontFace: F, fontSize: 17, bold: true, color: [LIME, LAV, AMBR].indexOf(o.fill) >= 0 ? INK : W, margin: 0
  });
  s.addText(o.t, {
    isTextBox: true, x: o.x + 0.84, y: o.y + 0.09, w: o.w - 1.1, h: 0.28,
    fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0
  });
  chk('numRow ' + o.t, o.b, o.w - 1.1, o.h - 0.44, 11, 15);
  s.addText(o.b, {
    isTextBox: true, x: o.x + 0.84, y: o.y + 0.35, w: o.w - 1.1, h: o.h - 0.44,
    fontFace: F, fontSize: 11, color: SLATE, margin: 0, lineSpacing: 15
  });
}

// lengkung titik dekoratif
function wave(pres, s, x0, y0, w, amp, color) {
  const n = 46, d = 0.058;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    s.addShape(pres.ShapeType.ellipse, {
      x: x0 + (i / n) * w - d / 2, y: y0 - Math.sin(t) * amp - d / 2, w: d, h: d,
      fill: { color: color || 'D2CCBD' }
    });
  }
}

// hiasan sudut
function corners(pres, s, opt) {
  const o = opt || {};
  if (o.tr !== false) rect(pres, s, SW - 0.62, 0, 0.62, 0.58, o.trColor || ORNG);
  if (o.bl) rect(pres, s, 0, SH - 0.58, 0.58, 0.58, o.blColor || LIME);
}

// nomor halaman
function foot(s, n, color) {
  s.addText(String(n).padStart(2, '0'), {
    isTextBox: true, x: SW - M - 0.6, y: SH - 0.56, w: 0.6, h: 0.28, align: 'right',
    fontFace: MONO, fontSize: 9.5, color: color || SLATE, margin: 0
  });
}

// label kecil di kanan atas
function brand(s, text, color) {
  s.addText(text, {
    isTextBox: true, x: SW - M - 4.2, y: 0.52, w: 4.2, h: 0.28, align: 'right',
    fontFace: F, fontSize: 10.5, bold: true, color: color || SLATE, margin: 0
  });
}

module.exports = {
  BG, INK, SLATE, LINE, ORNG, LAV, LIME, AMBR, TEAL, W, F, MONO,
  M, SW, SH, CW,
  newDeck, bg, card, rect, pills, pillsRight, pillW, head, sub, chip, tile, stat, quote, banner,
  numRow, wave, corners, foot, brand, chk, estLines, report, mix
};
