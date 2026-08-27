const D = require("docx");
const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, HeadingLevel, LevelFormat, PageNumber, Footer,
  Header, TabStopType, TabStopPosition, PageBreak
} = D;

/* ---- palet dan metrik ---- */
const BLUE = "1D1B84", INK = "16151F", MUTE = "5B5A6B", RULE = "C9C8DA";
const PINK = "B01259", GREEN = "046B2A";
const SERIF = "Times New Roman", SANS = "Arial";
const MARGIN_L = 1418, MARGIN_R = 1247, MARGIN_T = 1247, MARGIN_B = 1247;
const PAGE_W = 11906;
const CW = PAGE_W - MARGIN_L - MARGIN_R;           // lebar kolom teks, DXA

/* ---- paragraf ---- */
function P(text, o) {
  o = o || {};
  const runs = Array.isArray(text) ? text : [{ text: text }];
  return new Paragraph({
    alignment: o.align || (o.justify === false ? AlignmentType.LEFT : AlignmentType.JUSTIFIED),
    spacing: { before: o.before === undefined ? 0 : o.before, after: o.after === undefined ? 120 : o.after,
               line: o.line || 300 },
    indent: o.indent,
    keepNext: !!o.keepNext,
    border: o.border,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    children: runs.map(function (r) {
      return new TextRun({
        text: r.text,
        bold: r.bold || o.bold || false,
        italics: r.italics || o.italics || false,
        color: r.color || o.color || INK,
        size: (r.size || o.size || 22),
        font: r.font || o.font || SERIF,
        allCaps: r.caps || o.caps || false,
        characterSpacing: r.cs || o.cs
      });
    })
  });
}

function H1(text, o) {
  o = o || {};
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: !!o.pageBreak,
    spacing: { before: o.before === undefined ? 360 : o.before, after: 140, line: 264 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: BLUE, space: 6 } },
    children: [new TextRun({ text: text, bold: true, color: BLUE, size: 26, font: SANS })]
  });
}
function H2(text, o) {
  o = o || {};
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: o.before === undefined ? 280 : o.before, after: 100, line: 264 },
    keepNext: true,
    children: [new TextRun({ text: text, bold: true, color: INK, size: 23, font: SANS })]
  });
}
function H3(text, o) {
  o = o || {};
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: o.before === undefined ? 200 : o.before, after: 80, line: 264 },
    keepNext: true,
    children: [new TextRun({ text: text, bold: true, color: BLUE, size: 21, font: SANS })]
  });
}
function EYEBROW(text) {
  return new Paragraph({
    spacing: { before: 0, after: 60, line: 240 },
    children: [new TextRun({ text: text, bold: true, color: PINK, size: 16, font: SANS, characterSpacing: 30 })]
  });
}
function SPACER(h) {
  return new Paragraph({ spacing: { before: 0, after: h || 120, line: 200 }, children: [new TextRun({ text: "" })] });
}
function RULEP(o) {
  o = o || {};
  return new Paragraph({
    spacing: { before: o.before === undefined ? 120 : o.before, after: o.after === undefined ? 120 : o.after, line: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: o.color || RULE, space: 2 } },
    children: [new TextRun({ text: "" })]
  });
}
let INST = 0;
function BULLETS(items, ref) {
  const inst = ++INST;
  return items.map(function (it) {
    const runs = Array.isArray(it) ? it : [{ text: it }];
    return new Paragraph({
      numbering: { reference: ref || "peluru", level: 0, instance: inst },
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 80, line: 288 },
      children: runs.map(function (r) {
        return new TextRun({ text: r.text, bold: !!r.bold, italics: !!r.italics,
          color: r.color || INK, size: r.size || 22, font: r.font || SERIF });
      })
    });
  });
}
function NUMS(items, ref) { return BULLETS(items, ref || "angka"); }

/* ---- tabel ---- */
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
function cell(children, w, o) {
  o = o || {};
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: o.pt === undefined ? 90 : o.pt, bottom: o.pb === undefined ? 90 : o.pb, left: 110, right: 110 },
    verticalAlign: o.valign || D.VerticalAlign.TOP,
    columnSpan: o.span,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      left: NO_BORDER, right: NO_BORDER
    },
    children: children
  });
}
function TABLE(widths, rows) {
  return new Table({
    columnWidths: widths,
    width: { size: widths.reduce(function (a, b) { return a + b; }, 0), type: WidthType.DXA },
    layout: D.TableLayoutType.FIXED,
    rows: rows
  });
}
function thead(labels, widths) {
  return new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: labels.map(function (l, i) {
      return cell([P(l, { size: 17, bold: true, color: "FFFFFF", font: SANS, align: AlignmentType.LEFT, after: 0, line: 240 })],
        widths[i], { fill: BLUE, pt: 80, pb: 80 });
    })
  });
}
function trow(cells, widths, o) {
  o = o || {};
  return new TableRow({
    cantSplit: true,
    children: cells.map(function (c, i) {
      const kids = Array.isArray(c) ? c : [P(c, { size: 19, after: 0, line: 264, align: AlignmentType.LEFT })];
      return cell(kids, widths[i], { fill: o.fill });
    })
  });
}

/* ---- kartu catatan ---- */
function NOTE(label, text, tint) {
  const w = CW;
  return new Table({
    columnWidths: [w],
    width: { size: w, type: WidthType.DXA },
    layout: D.TableLayoutType.FIXED,
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: w, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: tint || "F2F1F9" },
        margins: { top: 140, bottom: 140, left: 180, right: 180 },
        borders: {
          top: NO_BORDER, bottom: NO_BORDER, right: NO_BORDER,
          left: { style: BorderStyle.SINGLE, size: 18, color: tint === "FBEAF2" ? PINK : BLUE }
        },
        children: [
          P(label, { size: 16, bold: true, color: tint === "FBEAF2" ? PINK : BLUE, font: SANS, cs: 26, after: 60, align: AlignmentType.LEFT }),
          P(text, { size: 20, after: 0, line: 288 })
        ]
      })]
    })]
  });
}

/* ---- dokumen ---- */
function footer(label) {
  return new Footer({
    children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: CW }],
      spacing: { before: 60, after: 0, line: 240 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 6 } },
      children: [
        new TextRun({ text: label, size: 15, color: MUTE, font: SANS }),
        new TextRun({ text: "\t", size: 15 }),
        new TextRun({ children: [PageNumber.CURRENT], size: 15, color: MUTE, font: SANS, bold: true })
      ]
    })]
  });
}

function buildDoc(title, children, footLabel) {
  return new D.Document({
    creator: "Aslih Abnuri, Arfinal Diputra, Rohana Dwi Hardianti",
    title: title,
    description: "Business Ethics for Sustainability, MAN5522, MBA Universitas Gadjah Mada",
    numbering: {
      config: [
        { reference: "peluru", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 400, hanging: 220 } }, run: { color: BLUE } } }] },
        { reference: "angka", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 430, hanging: 250 } }, run: { color: BLUE, bold: true, font: SANS } } }] }
      ]
    },
    styles: {
      default: {
        document: { run: { font: SERIF, size: 22, color: INK }, paragraph: { spacing: { line: 300 } } }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: MARGIN_T, bottom: MARGIN_B, left: MARGIN_L, right: MARGIN_R }
        }
      },
      footers: { default: footer(footLabel) },
      children: children
    }]
  });
}

/* ---- blok judul dokumen ---- */
function TITLEBLOCK(kicker, title, subtitle) {
  return [
    new Paragraph({
      spacing: { before: 0, after: 80, line: 240 },
      children: [new TextRun({ text: kicker, bold: true, color: PINK, size: 17, font: SANS, characterSpacing: 40 })]
    }),
    new Paragraph({
      spacing: { before: 0, after: 90, line: 360 },
      children: [new TextRun({ text: title, bold: true, color: BLUE, size: 38, font: SANS, characterSpacing: -6 })]
    }),
    new Paragraph({
      spacing: { before: 0, after: 160, line: 288 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: BLUE, space: 10 } },
      children: [new TextRun({ text: subtitle, color: MUTE, size: 21, font: SANS })]
    })
  ];
}

module.exports = {
  D, Paragraph, TextRun, TableRow, TableCell, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak,
  BLUE, INK, MUTE, RULE, PINK, GREEN, SERIF, SANS, CW,
  P, H1, H2, H3, EYEBROW, SPACER, RULEP, BULLETS, NUMS,
  TABLE, thead, trow, cell, NOTE, buildDoc, TITLEBLOCK
};
