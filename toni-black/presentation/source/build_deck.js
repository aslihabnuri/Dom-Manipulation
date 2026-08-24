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

const W = 13.3, H = 7.5, M = 0.7;         // slide box and margin
const LOGO_R = 6.61;                       // logo aspect

const logo = (s, dark, x, y, w) => s.addImage({
  path: path.join(DIR, dark ? "logo_white.png" : "logo_dark.png"),
  x, y, w, h: w / LOGO_R,
});

// wide-letterspaced label — the one motif repeated on every slide
const eyebrow = (s, text, x, y, color) => s.addText(text, {
  x, y, w: 8, h: 0.28, margin: 0,
  fontFace: DISP, fontSize: 10.5, bold: true, charSpacing: 3.2,
  color, align: "left", valign: "middle",
});

const title = (s, text, x, y, color, size) => s.addText(text, {
  x, y, w: W - x - M, h: 0.95, margin: 0,
  fontFace: DISP, fontSize: size || 38, bold: true, color, valign: "middle",
});

const note = (s, text) => s.addNotes(text);

// ============================================================ 1. COVER
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.62, 2.25);
  eyebrow(s, "September Campaign  ·  9 to 9", M, 3.05, GREY);
  s.addText("Timeline\n& Budget", {
    x: M, y: 3.4, w: 9.5, h: 2.1, margin: 0,
    fontFace: DISP, fontSize: 54, bold: true, color: WHITE, lineSpacing: 58,
  });
  s.addShape(P.ShapeType.rect, { x: M, y: 5.9, w: 1.1, h: 0.02, fill: { color: DAVIS } });
  s.addText([
    { text: "Prepared by", options: { color: GREY, breakLine: true } },
    { text: "Team name", options: { color: STEEL } },
  ], { x: M, y: 6.15, w: 3.4, h: 0.7, margin: 0, fontFace: BODY, fontSize: 12, lineSpacing: 17 });
  s.addText([
    { text: "Date", options: { color: GREY, breakLine: true } },
    { text: "DD Month YYYY", options: { color: STEEL } },
  ], { x: 4.4, y: 6.15, w: 3.4, h: 0.7, margin: 0, fontFace: BODY, fontSize: 12, lineSpacing: 17 });
  note(s, "Ganti nama tim dan tanggal. Judul boleh tetap.");
}

// ============================================================ 2. AGENDA
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Agenda", M, 1.75, GREY);
  title(s, "What we will cover", M, 2.1, INK, 38);

  const rows = [
    ["01", "Timeline", "Fase kerja, jadwal mingguan, dan milestone yang disepakati."],
    ["02", "Budget",   "Rincian biaya, alokasi per pos, dan asumsi yang dipakai."],
  ];
  rows.forEach((r, i) => {
    const y = 3.5 + i * 1.55;
    s.addShape(P.ShapeType.roundRect, {
      x: M, y, w: W - 2 * M, h: 1.25, rectRadius: 0.05, fill: { color: PAPER }, line: { color: PAPER },
    });
    s.addText(r[0], { x: M + 0.4, y, w: 1.0, h: 1.25, margin: 0,
      fontFace: DISP, fontSize: 30, bold: true, color: STEEL, valign: "middle" });
    s.addText(r[1], { x: M + 1.5, y: y + 0.2, w: 3.2, h: 0.45, margin: 0,
      fontFace: DISP, fontSize: 20, bold: true, color: INK, valign: "middle" });
    s.addText(r[2], { x: M + 1.5, y: y + 0.66, w: 9.4, h: 0.4, margin: 0,
      fontFace: BODY, fontSize: 13, color: DAVIS, valign: "middle" });
  });
  note(s, "Dua bagian saja. Kalau perlu bagian ketiga, duplikat kartunya.");
}

// ============================================================ 3. DIVIDER — TIMELINE
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.55, 1.65);
  s.addText("01", { x: M, y: 2.5, w: 3, h: 1.5, margin: 0,
    fontFace: DISP, fontSize: 76, bold: true, color: DAVIS });
  s.addText("Timeline", { x: M, y: 4.0, w: 9, h: 1.2, margin: 0,
    fontFace: DISP, fontSize: 48, bold: true, color: WHITE });
  s.addText("Ringkasan satu kalimat tentang periode kerja.", {
    x: M, y: 5.2, w: 8, h: 0.5, margin: 0, fontFace: BODY, fontSize: 14, color: STEEL });
  note(s, "Slide pembatas. Ganti kalimat pengantarnya.");
}

// ============================================================ 4. TIMELINE — PHASES
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Timeline  ·  Phases", M, 1.75, GREY);
  title(s, "Four phases", M, 2.1, INK, 38);

  const cards = [
    ["Phase 01", "Date range", ["Deliverable pertama", "Deliverable kedua"]],
    ["Phase 02", "Date range", ["Deliverable pertama", "Deliverable kedua"]],
    ["Phase 03", "Date range", ["Deliverable pertama", "Deliverable kedua"]],
    ["Phase 04", "Date range", ["Deliverable pertama", "Deliverable kedua"]],
  ];
  const cw = 2.735, gap = 0.32, y0 = 3.35;
  cards.forEach((c, i) => {
    const x = M + i * (cw + gap);
    s.addShape(P.ShapeType.roundRect, {
      x, y: y0, w: cw, h: 2.85, rectRadius: 0.05, fill: { color: PAPER }, line: { color: PAPER },
    });
    s.addText(c[0], { x: x + 0.32, y: y0 + 0.3, w: cw - 0.6, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 15, bold: true, color: INK });
    s.addText(c[1], { x: x + 0.32, y: y0 + 0.72, w: cw - 0.6, h: 0.32, margin: 0,
      fontFace: BODY, fontSize: 11, color: GREY });
    s.addText(c[2].map((t, j) => ({
      text: t, options: { bullet: true, breakLine: j < c[2].length - 1 },
    })), { x: x + 0.32, y: y0 + 1.25, w: cw - 0.6, h: 1.3, margin: 0,
      fontFace: BODY, fontSize: 11.5, color: DAVIS, paraSpaceAfter: 6 });
  });
  s.addText("Catatan singkat di bawah kartu, kalau perlu.", {
    x: M, y: 6.5, w: 9, h: 0.35, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });
  note(s, "Empat kartu fase. Hapus satu kartu kalau cuma butuh tiga, lalu lebarkan sisanya.");
}

// ============================================================ 5. TIMELINE — SCHEDULE
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Timeline  ·  Schedule", M, 1.75, GREY);
  title(s, "Week by week", M, 2.1, INK, 38);

  const head = ["Workstream", "Week 1", "Week 2", "Week 3", "Week 4", "Owner"];
  const body = [
    ["Concept & copy", "", "", "", "", "Nama"],
    ["Photo production", "", "", "", "", "Nama"],
    ["Design & layout", "", "", "", "", "Nama"],
    ["Review & approval", "", "", "", "", "Nama"],
    ["Publish", "", "", "", "", "Nama"],
  ];
  const rows = [head.map(t => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE, fill: { color: INK }, charSpacing: 1.4 },
  }))].concat(body.map((r, i) => r.map((t, j) => ({
    text: t,
    options: {
      fontFace: BODY, fontSize: 11.5, color: j === 0 ? INK : DAVIS,
      bold: j === 0, fill: { color: i % 2 ? WHITE : PAPER },
    },
  }))));
  s.addTable(rows, {
    x: M, y: 3.3, w: W - 2 * M, colW: [3.3, 1.65, 1.65, 1.65, 1.65, 1.99],
    rowH: 0.5, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });
  s.addText("Isi sel minggu dengan blok warna atau tanda centang sesuai kebutuhan.", {
    x: M, y: 6.55, w: 10, h: 0.35, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });
  note(s, "Tabel jadwal. Tambah baris workstream lewat menu tabel PowerPoint.");
}

// ============================================================ 6. TIMELINE — MILESTONES
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Timeline  ·  Milestones", M, 1.75, GREY);
  title(s, "Three dates that matter", M, 2.1, INK, 38);

  const ms = [
    ["DD.MM", "Milestone name", "Apa yang selesai pada tanggal ini."],
    ["DD.MM", "Milestone name", "Apa yang selesai pada tanggal ini."],
    ["DD.MM", "Milestone name", "Apa yang selesai pada tanggal ini."],
  ];
  const cw = 3.665, gap = 0.45, y0 = 3.4;
  ms.forEach((m, i) => {
    const x = M + i * (cw + gap);
    s.addText(m[0], { x, y: y0, w: cw, h: 1.0, margin: 0,
      fontFace: DISP, fontSize: 44, bold: true, color: INK });
    s.addText(m[1], { x, y: y0 + 1.1, w: cw, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 15, bold: true, color: INK });
    s.addText(m[2], { x, y: y0 + 1.55, w: cw, h: 0.8, margin: 0,
      fontFace: BODY, fontSize: 12, color: DAVIS });
  });
  note(s, "Tiga milestone. Angka tanggal sengaja besar supaya terbaca dari jauh.");
}

// ============================================================ 7. DIVIDER — BUDGET
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.55, 1.65);
  s.addText("02", { x: M, y: 2.5, w: 3, h: 1.5, margin: 0,
    fontFace: DISP, fontSize: 76, bold: true, color: DAVIS });
  s.addText("Budget", { x: M, y: 4.0, w: 9, h: 1.2, margin: 0,
    fontFace: DISP, fontSize: 48, bold: true, color: WHITE });
  s.addText("Ringkasan satu kalimat tentang cakupan biaya.", {
    x: M, y: 5.2, w: 8, h: 0.5, margin: 0, fontFace: BODY, fontSize: 14, color: STEEL });
  note(s, "Slide pembatas kedua.");
}

// ============================================================ 8. BUDGET — SUMMARY
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Budget  ·  Summary", M, 1.75, GREY);
  title(s, "The headline numbers", M, 2.1, INK, 38);

  const stats = [
    ["Rp 000.000.000", "Total budget", "Seluruh pos, sudah termasuk pajak."],
    ["Rp 000.000.000", "Production", "Foto, desain, dan produksi aset."],
    ["Rp 000.000.000", "Media", "Belanja iklan berbayar."],
  ];
  const cw = 3.665, gap = 0.45, y0 = 3.35;
  stats.forEach((t, i) => {
    const x = M + i * (cw + gap);
    s.addShape(P.ShapeType.roundRect, {
      x, y: y0, w: cw, h: 2.5, rectRadius: 0.05,
      fill: { color: i === 0 ? INK : PAPER }, line: { color: i === 0 ? INK : PAPER },
    });
    s.addText(t[0], { x: x + 0.32, y: y0 + 0.38, w: cw - 0.64, h: 0.75, margin: 0,
      fontFace: DISP, fontSize: 19.5, bold: true, color: i === 0 ? WHITE : INK, valign: "middle" });
    s.addText(t[1], { x: x + 0.32, y: y0 + 1.2, w: cw - 0.64, h: 0.36, margin: 0,
      fontFace: DISP, fontSize: 13, bold: true, charSpacing: 1.2,
      color: i === 0 ? STEEL : DAVIS });
    s.addText(t[2], { x: x + 0.32, y: y0 + 1.62, w: cw - 0.64, h: 0.65, margin: 0,
      fontFace: BODY, fontSize: 11.5, color: i === 0 ? STEEL : GREY });
  });
  note(s, "Tiga angka utama. Kartu pertama sengaja gelap supaya jadi fokus.");
}

// ============================================================ 9. BUDGET — BREAKDOWN
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Budget  ·  Breakdown", M, 1.75, GREY);
  title(s, "Line by line", M, 2.1, INK, 38);

  const head = ["Item", "Qty", "Unit cost", "Subtotal", "Notes"];
  const items = ["Item name", "Item name", "Item name", "Item name", "Item name"];
  const rows = [head.map((t, j) => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4, align: j >= 1 && j <= 3 ? "right" : "left" },
  }))];
  items.forEach((it, i) => {
    rows.push([
      { text: it,   options: { fontFace: BODY, fontSize: 11.5, color: INK, bold: true, fill: { color: i % 2 ? WHITE : PAPER } } },
      { text: "0",  options: { fontFace: BODY, fontSize: 11.5, color: DAVIS, align: "right", fill: { color: i % 2 ? WHITE : PAPER } } },
      { text: "Rp 0", options: { fontFace: BODY, fontSize: 11.5, color: DAVIS, align: "right", fill: { color: i % 2 ? WHITE : PAPER } } },
      { text: "Rp 0", options: { fontFace: BODY, fontSize: 11.5, color: INK, align: "right", fill: { color: i % 2 ? WHITE : PAPER } } },
      { text: "",   options: { fontFace: BODY, fontSize: 11.5, color: GREY, fill: { color: i % 2 ? WHITE : PAPER } } },
    ]);
  });
  rows.push([
    { text: "Total", options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, fill: { color: DAVIS } } },
    { text: "",      options: { fill: { color: DAVIS } } },
    { text: "",      options: { fill: { color: DAVIS } } },
    { text: "Rp 0",  options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, align: "right", fill: { color: DAVIS } } },
    { text: "",      options: { fill: { color: DAVIS } } },
  ]);
  s.addTable(rows, {
    x: M, y: 3.3, w: W - 2 * M, colW: [3.6, 1.1, 2.0, 2.0, 3.19],
    rowH: 0.46, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });
  note(s, "Tambah baris lewat menu tabel. Baris Total sengaja dibedakan warnanya.");
}

// ============================================================ 10. BUDGET — ALLOCATION
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Budget  ·  Allocation", M, 1.75, GREY);
  title(s, "Where it goes", M, 2.1, INK, 38);

  s.addChart(P.ChartType.doughnut, [{
    name: "Allocation",
    labels: ["Production", "Media", "Talent", "Post-production", "Contingency"],
    values: [35, 30, 15, 12, 8],
  }], {
    x: M, y: 3.15, w: 5.6, h: 3.5,
    holeSize: 58, showLegend: false,
    showValue: true, dataLabelPosition: "ctr",
    dataLabelColor: WHITE, dataLabelFontFace: BODY, dataLabelFontSize: 11,
    dataLabelFormatCode: '0"%"',
    chartColors: [INK, DAVIS, GREY, "A8A9AB", STEEL],
  });

  const legend = [
    ["Production", "35%"], ["Media", "30%"], ["Talent", "15%"],
    ["Post-production", "12%"], ["Contingency", "8%"],
  ];
  legend.forEach((l, i) => {
    const y = 3.5 + i * 0.56;
    s.addShape(P.ShapeType.rect, { x: 6.9, y: y + 0.09, w: 0.18, h: 0.18,
      fill: { color: [INK, DAVIS, GREY, "A8A9AB", STEEL][i] }, line: { color: STEEL, pt: 0.5 } });
    s.addText(l[0], { x: 7.25, y, w: 3.3, h: 0.36, margin: 0,
      fontFace: BODY, fontSize: 12.5, color: INK, valign: "middle" });
    s.addText(l[1], { x: 10.6, y, w: 1.0, h: 0.36, margin: 0,
      fontFace: DISP, fontSize: 12.5, bold: true, color: DAVIS, align: "right", valign: "middle" });
  });
  s.addText("Angka contoh. Ganti nilainya lewat Edit Data pada grafik.", {
    x: 6.9, y: 6.45, w: 5.0, h: 0.35, margin: 0, fontFace: BODY, fontSize: 10.5, color: GREY });
  note(s, "Klik kanan grafik > Edit Data untuk mengganti angka. Legenda di kanan diketik manual.");
}

// ============================================================ 11. ASSUMPTIONS
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.55, 1.65);
  eyebrow(s, "Notes", M, 1.75, GREY);
  title(s, "Assumptions", M, 2.1, INK, 38);

  const items = [
    ["Scope", "Apa yang termasuk dan tidak termasuk dalam angka ini."],
    ["Timing", "Tanggal mulai dan syarat yang harus dipenuhi."],
    ["Approval", "Berapa putaran revisi yang sudah dihitung."],
    ["Exclusions", "Biaya yang belum masuk hitungan."],
  ];
  const cw = 5.65, ch = 1.45, gx = 0.6, gy = 0.45, y0 = 3.4;
  items.forEach((it, i) => {
    const x = M + (i % 2) * (cw + gx);
    const y = y0 + Math.floor(i / 2) * (ch + gy);
    s.addShape(P.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.05,
      fill: { color: PAPER }, line: { color: PAPER } });
    s.addText(it[0], { x: x + 0.32, y: y + 0.22, w: cw - 0.64, h: 0.36, margin: 0,
      fontFace: DISP, fontSize: 14, bold: true, color: INK });
    s.addText(it[1], { x: x + 0.32, y: y + 0.64, w: cw - 0.64, h: 0.6, margin: 0,
      fontFace: BODY, fontSize: 12, color: DAVIS });
  });
  note(s, "Empat asumsi. Ini yang biasanya ditanya klien duluan.");
}

// ============================================================ 12. NEXT STEPS
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.62, 2.0);
  eyebrow(s, "Closing", M, 2.35, GREY);
  s.addText("Next steps", { x: M, y: 2.7, w: 9, h: 1.0, margin: 0,
    fontFace: DISP, fontSize: 44, bold: true, color: WHITE });

  const steps = [
    ["01", "Langkah pertama setelah presentasi ini."],
    ["02", "Langkah kedua."],
    ["03", "Langkah ketiga."],
  ];
  steps.forEach((st, i) => {
    const y = 4.0 + i * 0.78;
    s.addText(st[0], { x: M, y, w: 0.8, h: 0.5, margin: 0,
      fontFace: DISP, fontSize: 17, bold: true, color: DAVIS, valign: "middle" });
    s.addText(st[1], { x: M + 0.85, y, w: 9.5, h: 0.5, margin: 0,
      fontFace: BODY, fontSize: 14, color: STEEL, valign: "middle" });
  });
  s.addText("www.toniblack.com   ·   @toniblack.id", {
    x: M, y: 6.65, w: 8, h: 0.35, margin: 0,
    fontFace: BODY, fontSize: 11.5, color: GREY, charSpacing: 1 });
  note(s, "Slide penutup. Ganti tiga langkah tindak lanjutnya.");
}

P.writeFile({ fileName: path.join(DIR, "ToniBlack_Timeline_Budget_Template.pptx") })
  .then(f => console.log("written:", f));
