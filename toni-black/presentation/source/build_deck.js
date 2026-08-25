const pptxgen = require("pptxgenjs");
const path = require("path");

const DIR = __dirname;
const P = new pptxgen();
P.layout = "LAYOUT_WIDE";                 // 13.3 x 7.5
P.author = "Toni Black";
P.company = "Toni Black";
P.title = "Timeline & Budget";

// ---- Brand tokens (Toni Black guideline) -----------------------------------
const INK   = "282828";   // Dark Charcoal Black — primary
const WHITE = "FFFFFF";   // Clean White        — primary
const DAVIS = "4F5052";   // Davi's Grey        — secondary
const GREY  = "818284";   // Grey               — secondary
const STEEL = "CCCCCC";   // Steel Grey         — secondary
const PAPER = "F2F2F3";   // tonal ground for cards, mixed from the palette

const DISP = "Zalando Sans Expanded";
const BODY = "Arimo";

const W = 13.3, M = 0.7, CONTENT = W - 2 * M;   // 11.9in of usable width
const LOGO_R = 6.61;

const logo = (s, dark, x, y, w) => s.addImage({
  path: path.join(DIR, dark ? "logo_white.png" : "logo_dark.png"),
  x, y, w, h: w / LOGO_R,
});

// wide-letterspaced label — the one motif repeated on every slide
const eyebrow = (s, text, x, y, color, w) => s.addText(text, {
  x, y, w: w || 8, h: 0.28, margin: 0,
  fontFace: DISP, fontSize: 10.5, bold: true, charSpacing: 3.2,
  color, valign: "middle",
});

// ============================================================ 1. PEMBUKA
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.70, 2.25);
  eyebrow(s, "September Campaign  ·  9 to 9", M, 2.75, GREY);
  s.addText("Timeline\n& Budget", {
    x: M, y: 3.1, w: 9.5, h: 2.1, margin: 0,
    fontFace: DISP, fontSize: 54, bold: true, color: WHITE, lineSpacing: 58,
  });
  s.addText("Satu kalimat pengantar tentang apa yang diajukan.", {
    x: M, y: 5.25, w: 8.4, h: 0.4, margin: 0,
    fontFace: BODY, fontSize: 14, color: STEEL,
  });

  // what the two slides after this will cover — keeps the opening useful
  [["01", "Timeline"], ["02", "Budget"]].forEach(([n, t], i) => {
    const x = M + i * 2.3;
    s.addText(n, { x, y: 6.1, w: 0.55, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 14, bold: true, color: DAVIS, valign: "middle" });
    s.addText(t, { x: x + 0.55, y: 6.1, w: 1.7, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 14, bold: true, color: STEEL, valign: "middle" });
  });
  s.addText([
    { text: "Prepared by  ", options: { color: GREY } },
    { text: "Team name", options: { color: STEEL } },
    { text: "        Date  ", options: { color: GREY } },
    { text: "DD Month YYYY", options: { color: STEEL } },
  ], { x: 7.4, y: 6.1, w: 5.2, h: 0.4, margin: 0, fontFace: BODY, fontSize: 11.5,
       align: "right", valign: "middle" });

  s.addNotes("Slide pembuka. Ganti kalimat pengantar, nama tim, dan tanggal.");
}

// ============================================================ 2. TIMELINE
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "01  ·  Timeline", M, 1.58, GREY, 6.8);
  s.addText("Periode kerja", { x: M, y: 1.82, w: 6.8, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  // three key dates, compact, above the schedule
  const dates = [["DD.MM", "Milestone"], ["DD.MM", "Milestone"], ["DD.MM", "Milestone"]];
  dates.forEach((d, i) => {
    const x = 8.10 + i * 1.50;
    s.addText(d[0], { x, y: 1.72, w: 1.45, h: 0.42, margin: 0,
      fontFace: DISP, fontSize: 19, bold: true, color: INK });
    s.addText(d[1], { x, y: 2.14, w: 1.45, h: 0.3, margin: 0,
      fontFace: BODY, fontSize: 10.5, color: GREY });
  });

  const head = ["Workstream", "Week 1", "Week 2", "Week 3", "Week 4", "Owner"];
  const body = [
    ["Concept & copy", "", "", "", "", "Nama"],
    ["Photo production", "", "", "", "", "Nama"],
    ["Design & layout", "", "", "", "", "Nama"],
    ["Review & approval", "", "", "", "", "Nama"],
    ["Publish & monitor", "", "", "", "", "Nama"],
  ];
  const rows = [head.map(t => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4 },
  }))].concat(body.map((r, i) => r.map((t, j) => ({
    text: t,
    options: { fontFace: BODY, fontSize: 12, bold: j === 0,
      color: j === 0 ? INK : DAVIS, fill: { color: i % 2 ? WHITE : PAPER } },
  }))));
  s.addTable(rows, {
    x: M, y: 2.95, w: CONTENT, colW: [3.4, 1.7, 1.7, 1.7, 1.7, 1.7],
    rowH: 0.54, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });
  s.addText("Tandai sel minggu yang aktif dengan blok charcoal, supaya alur kerjanya terbaca sekali lihat.", {
    x: M, y: 6.45, w: 11, h: 0.35, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });

  s.addNotes("Satu slide untuk seluruh timeline. Tiga tanggal kunci di kanan atas, "
    + "jadwal mingguan di tabel. Tambah baris lewat menu tabel PowerPoint.");
}

// ============================================================ 3. BUDGET
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "02  ·  Budget", M, 1.58, GREY, 6.8);
  s.addText("Rincian biaya", { x: M, y: 1.82, w: 6.8, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  const TW = 7.2, RX = M + TW + 0.5, RW = CONTENT - TW - 0.5;   // 7.2 + 0.5 + 4.2

  const head = ["Item", "Qty", "Unit cost", "Subtotal"];
  const rows = [head.map((t, j) => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4, align: j ? "right" : "left" },
  }))];
  for (let i = 0; i < 5; i++) {
    const f = { color: i % 2 ? WHITE : PAPER };
    rows.push([
      { text: "Item name", options: { fontFace: BODY, fontSize: 12, bold: true, color: INK, fill: { color: f.color } } },
      { text: "0",         options: { fontFace: BODY, fontSize: 12, color: DAVIS, align: "right", fill: { color: f.color } } },
      { text: "Rp 0",      options: { fontFace: BODY, fontSize: 12, color: DAVIS, align: "right", fill: { color: f.color } } },
      { text: "Rp 0",      options: { fontFace: BODY, fontSize: 12, color: INK, align: "right", fill: { color: f.color } } },
    ]);
  }
  rows.push([
    { text: "Total", options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, fill: { color: DAVIS } } },
    { text: "",      options: { fill: { color: DAVIS } } },
    { text: "",      options: { fill: { color: DAVIS } } },
    { text: "Rp 0",  options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, align: "right", fill: { color: DAVIS } } },
  ]);
  s.addTable(rows, {
    x: M, y: 2.95, w: TW, colW: [3.0, 0.8, 1.6, 1.8],
    rowH: 0.46, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });

  // headline total, then where it goes
  s.addShape(P.ShapeType.roundRect, { x: RX, y: 2.95, w: RW, h: 1.15,
    rectRadius: 0.05, fill: { color: INK }, line: { color: INK } });
  s.addText("Total budget", { x: RX + 0.3, y: 3.1, w: RW - 0.6, h: 0.3, margin: 0,
    fontFace: DISP, fontSize: 11, bold: true, charSpacing: 1.4, color: STEEL });
  s.addText("Rp 000.000.000", { x: RX + 0.3, y: 3.42, w: RW - 0.6, h: 0.5, margin: 0,
    fontFace: DISP, fontSize: 21, bold: true, color: WHITE, valign: "middle" });

  s.addChart(P.ChartType.doughnut, [{
    name: "Allocation",
    labels: ["Production", "Media", "Talent", "Other"],
    values: [40, 32, 18, 10],
  }], {
    x: RX - 0.20, y: 4.15, w: 2.0, h: 2.0,
    holeSize: 56, showLegend: false, showValue: false,
    chartColors: [INK, DAVIS, GREY, STEEL],
  });

  const legend = [["Production", "40%"], ["Media", "32%"], ["Talent", "18%"], ["Other", "10%"]];
  legend.forEach((l, i) => {
    const y = 4.42 + i * 0.42;
    s.addShape(P.ShapeType.rect, { x: RX + 2.15, y: y + 0.08, w: 0.16, h: 0.16,
      fill: { color: [INK, DAVIS, GREY, STEEL][i] }, line: { color: STEEL, pt: 0.5 } });
    s.addText(l[0], { x: RX + 2.45, y, w: 1.1, h: 0.32, margin: 0,
      fontFace: BODY, fontSize: 11, color: INK, valign: "middle" });
    s.addText(l[1], { x: RX + 3.55, y, w: 0.65, h: 0.32, margin: 0,
      fontFace: DISP, fontSize: 11, bold: true, color: DAVIS, align: "right", valign: "middle" });
  });

  s.addText("Angka alokasi hanya contoh. Klik kanan grafik lalu Edit Data untuk menggantinya.", {
    x: M, y: 6.45, w: 11, h: 0.35, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });

  s.addNotes("Satu slide untuk seluruh budget. Tabel rincian di kiri dengan baris Total, "
    + "angka utama dan alokasi di kanan. Legenda diketik manual, sesuaikan kalau angkanya berubah.");
}

P.writeFile({ fileName: path.join(DIR, "ToniBlack_Timeline_Budget_Template.pptx") })
  .then(f => console.log("written:", f));
