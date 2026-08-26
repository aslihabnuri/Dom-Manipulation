// Shared helpers + palette for the Business Ethics Ch.2 deck
const pptxgen = require('pptxgenjs');

const C = {
  ink:    '241A1E',
  dark:   '451A28',
  darker: '2E1019',
  brick:  '8C2F39',
  brick2: '7A2B36',
  clay:   'A85541',
  gold:   'C8952B',
  gold2:  'E4BE6B',
  sage:   '5C7A6B',
  paper:  'FFFFFF',
  tint:   'F3F0F1',
  tint2:  'E9E2E5',
  muted:  '7A6E72',
  line:   'DED7DA',
  onDark: 'F2E7EB',
  onDarkMuted: 'C7AAB6',
};
const HEAD = 'Cambria';
const BODY = 'Calibri';

const M = 0.6;          // left/right margin
const W = 12.1;         // usable width
const SW = 13.3, SH = 7.5;

function newPres() {
  const p = new pptxgen();
  p.layout = 'LAYOUT_WIDE';
  p.author = 'Kelompok Business Ethics';
  p.title = 'Framing Business Ethics - Studi Kasus PT Djarum';
  return p;
}

// ---------- primitives ----------
function bg(s, color) {
  s.background = { color };
}

function rect(pres, s, o) {
  const opt = { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: o.fill } };
  if (o.transparency !== undefined) opt.fill.transparency = o.transparency;
  if (o.line) opt.line = { color: o.line, width: o.lineW || 1 };
  if (o.radius !== undefined) { opt.rectRadius = o.radius; s.addShape(pres.ShapeType.roundRect, opt); }
  else s.addShape(pres.ShapeType.rect, opt);
}

function card(pres, s, o) {
  rect(pres, s, Object.assign({ fill: C.tint, radius: 0.06 }, o));
}

function circle(pres, s, o) {
  const opt = { x: o.x, y: o.y, w: o.d, h: o.d, fill: { color: o.fill } };
  if (o.line) opt.line = { color: o.line, width: o.lineW || 1 };
  s.addShape(pres.ShapeType.ellipse, opt);
}

function txt(s, text, o) {
  s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: BODY }, o));
}

function badge(pres, s, o) {
  const d = o.d || 0.52;
  circle(pres, s, { x: o.x, y: o.y, d, fill: o.fill || C.brick });
  txt(s, String(o.text), {
    x: o.x, y: o.y, w: d, h: d, fontSize: o.size || 16, bold: true,
    color: o.color || C.paper, align: 'center', valign: 'middle', fontFace: HEAD,
  });
}

function connect(pres, s, x1, y1, x2, y2, color, width) {
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  const needFlip = ((x2 - x1) * (y2 - y1)) < 0;
  s.addShape(pres.ShapeType.line, {
    x, y, w, h, line: { color: color || C.line, width: width || 1.25 }, flipV: needFlip,
  });
}

// ---------- slide chrome ----------
function head(s, kicker, title, opts) {
  const o = opts || {};
  const onDark = !!o.onDark;
  if (kicker) {
    txt(s, kicker.toUpperCase(), {
      x: M, y: 0.40, w: W, h: 0.26, fontSize: 11, bold: true,
      color: onDark ? C.gold2 : C.brick, charSpacing: 1.6, valign: 'middle',
    });
  }
  txt(s, title, {
    x: M, y: kicker ? 0.68 : 0.52, w: o.tw || W, h: o.th || 0.82,
    fontSize: o.size || 31, bold: true, fontFace: HEAD,
    color: onDark ? C.paper : C.ink, valign: 'middle', lineSpacingMultiple: 0.95,
  });
  if (o.lead) {
    txt(s, o.lead, {
      x: M, y: (kicker ? 0.68 : 0.52) + (o.th || 0.82) + 0.06, w: o.leadW || W, h: o.leadH || 0.44,
      fontSize: 13.5, italic: true, color: onDark ? C.onDarkMuted : C.muted, valign: 'top',
    });
  }
}

function foot(s, label, n, onDark) {
  txt(s, label, {
    x: M, y: 6.97, w: 9.5, h: 0.3, fontSize: 9.5,
    color: onDark ? C.onDarkMuted : C.muted, charSpacing: 0.8, valign: 'middle',
  });
  txt(s, String(n), {
    x: 11.6, y: 6.97, w: 1.1, h: 0.3, fontSize: 10, bold: true, align: 'right',
    color: onDark ? C.gold2 : C.brick, valign: 'middle',
  });
}

function source(s, text, y, onDark) {
  txt(s, text, {
    x: M, y: y || 6.55, w: W, h: 0.32, fontSize: 9.5, italic: true,
    color: onDark ? C.onDarkMuted : C.muted, valign: 'middle',
  });
}

// ---------- composite blocks ----------
// A card holding a heading + body paragraph, optional badge
function infoCard(pres, s, o) {
  card(pres, s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.tint });
  const px = o.x + 0.28;
  let ty = o.y + 0.24;
  const pw = o.w - 0.56;
  if (o.badge !== undefined) {
    badge(pres, s, { x: px, y: ty, d: 0.46, text: o.badge, fill: o.badgeFill || C.brick, size: 14 });
    txt(s, o.title, {
      x: px + 0.62, y: ty, w: pw - 0.62, h: 0.46, fontSize: o.titleSize || 15.5, bold: true,
      color: o.titleColor || C.ink, fontFace: HEAD, valign: 'middle',
    });
    ty += 0.60;
  } else {
    txt(s, o.title, {
      x: px, y: ty, w: pw, h: 0.34, fontSize: o.titleSize || 15.5, bold: true,
      color: o.titleColor || C.ink, fontFace: HEAD, valign: 'top',
    });
    ty += 0.42;
  }
  if (o.body) {
    txt(s, o.body, {
      x: px, y: ty, w: pw, h: o.y + o.h - ty - 0.20, fontSize: o.bodySize || 12,
      color: o.bodyColor || C.muted, valign: 'top', lineSpacingMultiple: 1.05,
    });
  }
}

// Bulleted list
function list(s, items, o) {
  const runs = items.map((it, i) => ({
    text: typeof it === 'string' ? it : it.text,
    options: Object.assign(
      { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: o.gap === undefined ? 7 : o.gap },
      (typeof it === 'object' && it.options) || {}
    ),
  }));
  txt(s, runs, Object.assign({
    fontSize: 13, color: C.ink, valign: 'top', lineSpacingMultiple: 1.02,
  }, o));
}

// Big number + label
function stat(pres, s, o) {
  card(pres, s, { x: o.x, y: o.y, w: o.w, h: o.h, fill: o.fill || C.tint });
  txt(s, o.value, {
    x: o.x + 0.2, y: o.y + 0.24, w: o.w - 0.4, h: 0.78, fontSize: o.size || 34, bold: true,
    color: o.valueColor || C.brick, fontFace: HEAD, align: 'center', valign: 'middle',
  });
  txt(s, o.label, {
    x: o.x + 0.18, y: o.y + 1.00, w: o.w - 0.36, h: o.h - 1.16, fontSize: 11,
    color: o.labelColor || C.muted, align: 'center', valign: 'top', lineSpacingMultiple: 1.0,
  });
}

module.exports = {
  pptxgen, C, HEAD, BODY, M, W, SW, SH,
  newPres, bg, rect, card, circle, txt, badge, connect,
  head, foot, source, infoCard, list, stat,
};
