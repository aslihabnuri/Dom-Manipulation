// Builds "Materi Chapter 10" docx (A4, Times New Roman 12) from materi_content.js with embedded figures.
const fs = require("fs");
const path = require("path");
const sizeOf = (buf) => {
  // PNG: width/height at bytes 16-23
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
};
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, HeadingLevel, BorderStyle, ShadingType, LevelFormat, Footer, PageNumber,
  VerticalAlign, PageBreak,
} = require("docx");

const content = require("./materi_content.js");
const FIGDIR = path.join(__dirname, "figs");
const FONT = "Times New Roman";
const SIZE = 24; // 12pt
const LINE = 300; // 1.25 spacing for readability of a long study document
const PAGE_W = 11906, MARGIN = 1134, TEXT_W = PAGE_W - 2 * MARGIN; // 9638 DXA

// ---- inline markup: **bold**, *italic* ----
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: SIZE, ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(new TextRun({ text: tok.slice(2, -2), font: FONT, size: SIZE, ...base, bold: true }));
    else out.push(new TextRun({ text: tok.slice(1, -1), font: FONT, size: SIZE, ...base, italics: true }));
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size: SIZE, ...base }));
  return out;
}

const P = (text, opts = {}, base = {}) =>
  new Paragraph({ spacing: { line: LINE, after: 120 }, alignment: AlignmentType.JUSTIFIED, children: runs(text, base), ...opts });

function heading(text, level) {
  const sizes = { 1: 32, 2: 27, 3: 24 };
  const hl = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 }[level];
  return new Paragraph({
    heading: hl,
    keepNext: true,
    spacing: { line: 276, before: level === 1 ? 360 : 240, after: 120 },
    border: level === 1 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1F3864", space: 2 } } : undefined,
    children: [new TextRun({ text, font: FONT, size: sizes[level], bold: true, color: level === 3 ? "000000" : "1F3864" })],
  });
}

function listItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { line: LINE, after: 80 },
    alignment: AlignmentType.JUSTIFIED,
    children: runs(text),
  });
}

function image(name, caption, widthIn) {
  const file = path.join(FIGDIR, name + ".png");
  const buf = fs.readFileSync(file);
  const { w, h } = sizeOf(buf);
  const maxW = 6.6; // inches available at 2 cm margins (~6.7")
  const wIn = Math.min(widthIn || maxW, maxW);
  const hIn = (h / w) * wIn;
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      keepNext: true,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "png", data: buf, transformation: { width: Math.round(wIn * 96), height: Math.round(hIn * 96) } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200, line: 240 },
      children: [new TextRun({ text: caption, font: FONT, size: 20, italics: true })],
    }),
  ];
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const borders = { top: border, bottom: border, left: border, right: border };

function box(title, text) {
  const cell = new TableCell({
    borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 24, color: "1F3864" }, right: border },
    width: { size: TEXT_W, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: "EEF2F8", color: "auto" },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    children: [
      new Paragraph({ spacing: { line: 276, after: 60 }, children: [new TextRun({ text: title, font: FONT, size: 22, bold: true, color: "1F3864" })] }),
      new Paragraph({ spacing: { line: 276, after: 0 }, alignment: AlignmentType.JUSTIFIED, children: runs(text, { size: 22 }) }),
    ],
  });
  return [
    new Table({ width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: [TEXT_W], rows: [new TableRow({ cantSplit: true, children: [cell] })] }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
  ];
}

function quote(text) {
  return new Paragraph({
    spacing: { line: 276, after: 100 },
    indent: { left: 567, right: 567 },
    alignment: AlignmentType.JUSTIFIED,
    children: runs(text, { italics: true, size: 22 }),
  });
}

function table(rows, colIn) {
  const total = TEXT_W;
  const sum = colIn.reduce((a, b) => a + b, 0);
  const widths = colIn.map((c) => Math.round((c / sum) * total));
  const trs = rows.map((r, i) =>
    new TableRow({
      tableHeader: i === 0,
      cantSplit: true,
      children: r.map((c, j) =>
        new TableCell({
          borders,
          width: { size: widths[j], type: WidthType.DXA },
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 50, bottom: 50, left: 80, right: 80 },
          shading: i === 0 ? { type: ShadingType.CLEAR, fill: "1F3864", color: "auto" } : i % 2 === 0 ? { type: ShadingType.CLEAR, fill: "F3F5F9", color: "auto" } : undefined,
          children: [new Paragraph({ spacing: { line: 240, after: 0 }, children: runs(c, { size: 19, bold: i === 0 || j === 0, color: i === 0 ? "FFFFFF" : undefined }) })],
        })
      ),
    })
  );
  return [
    new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: trs }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
  ];
}

// ---- assemble ----
const children = [];
let listCount = 0;
const numberingConfigs = [
  { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 283 } } } }] },
];

for (const block of content) {
  const [type, a, b, c] = block;
  switch (type) {
    case "title":
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: a, font: FONT, size: 36, bold: true, color: "1F3864" })] }));
      break;
    case "subtitle":
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: a, font: FONT, size: 28, bold: true })] }));
      break;
    case "subtitle2":
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: a, font: FONT, size: 24, italics: true })] }));
      break;
    case "meta":
      children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80, line: 260 }, children: runs(a, { size: 20 }) }));
      break;
    case "h1": children.push(heading(a, 1)); break;
    case "h2": children.push(heading(a, 2)); break;
    case "h3": children.push(heading(a, 3)); break;
    case "p": children.push(P(a)); break;
    case "quote": children.push(quote(a)); break;
    case "ul": a.forEach((t) => children.push(listItem(t, "bul"))); break;
    case "ol": {
      listCount += 1;
      const ref = "num" + listCount;
      numberingConfigs.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 340 } } } }] });
      a.forEach((t) => children.push(listItem(t, ref)));
      break;
    }
    case "img": children.push(...image(a, b, c)); break;
    case "box": children.push(...box(a, b)); break;
    case "table": children.push(...table(a, b)); break;
    case "pagebreak": children.push(new Paragraph({ children: [new PageBreak()] })); break;
    default: throw new Error("unknown block " + type);
  }
}

const doc = new Document({
  creator: "Kelompok 3",
  title: "Materi Chapter 10 - Building an Organization Capable of Good Strategy Execution",
  styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
  numbering: { config: numberingConfigs },
  sections: [
    {
      properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1134, bottom: 1134, left: MARGIN, right: MARGIN } } },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Materi Chapter 10 – Kelompok 3 – MAN 5422 Strategic Management  |  Halaman ", font: FONT, size: 18 }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

const out = process.argv[2] || "materi.docx";
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes"); });
