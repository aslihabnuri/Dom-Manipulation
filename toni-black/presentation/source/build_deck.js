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

const W = 13.3333, M = 0.7, CONTENT = W - 2 * M;   // LAYOUT_WIDE is 13.333in, not 13.3
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

// a labelled block: small caps label above a value
const stat = (s, x, y, w, h, label, value, dark, valueSize) => {
  s.addShape(P.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.05,
    fill: { color: dark ? INK : PAPER }, line: { color: dark ? INK : PAPER } });
  s.addText(label, { x: x + 0.28, y: y + 0.16, w: w - 0.56, h: 0.28, margin: 0,
    fontFace: DISP, fontSize: 10.5, bold: true, charSpacing: 1.4,
    color: dark ? STEEL : DAVIS, valign: "middle" });
  s.addText(value, { x: x + 0.28, y: y + 0.46, w: w - 0.56, h: h - 0.62, margin: 0,
    fontFace: DISP, fontSize: valueSize || 21, bold: true,
    color: dark ? WHITE : INK, valign: "middle" });
};

// ============================================================ 1. PEMBUKA
{
  const s = P.addSlide();
  s.background = { color: INK };
  logo(s, true, M, 0.70, 2.25);
  eyebrow(s, "Affiliate Program  ·  September", M, 2.75, GREY);
  s.addText("Timeline\n& Budget", {
    x: M, y: 3.1, w: 9.5, h: 2.1, margin: 0,
    fontFace: DISP, fontSize: 54, bold: true, color: WHITE, lineSpacing: 58,
  });
  s.addText("Thirty affiliates by the end of September. The plan, and the budget behind it.", {
    x: M, y: 5.25, w: 9.0, h: 0.4, margin: 0,
    fontFace: BODY, fontSize: 14, color: STEEL,
  });

  [["01", "Timeline"], ["02", "Budget"]].forEach(([n, t], i) => {
    const x = M + i * 2.3;
    s.addText(n, { x, y: 6.1, w: 0.55, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 14, bold: true, color: DAVIS, valign: "middle" });
    s.addText(t, { x: x + 0.55, y: 6.1, w: 1.7, h: 0.4, margin: 0,
      fontFace: DISP, fontSize: 14, bold: true, color: STEEL, valign: "middle" });
  });
  s.addText([
    { text: "Prepared by  ", options: { color: GREY } },
    { text: "Affimarq", options: { color: STEEL } },
    { text: "        Date  ", options: { color: GREY } },
    { text: "25 August 2026", options: { color: STEEL } },
  ], { x: M + CONTENT - 5.2, y: 6.1, w: 5.2, h: 0.4, margin: 0, fontFace: BODY,
       fontSize: 11.5, align: "right", valign: "middle" });

  s.addNotes("Slide pembuka. Isinya sudah lengkap, tidak ada yang perlu diganti.");
}

// ============================================================ 2. TIMELINE
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "01  ·  Timeline  ·  September", M, 1.58, GREY, 6.8);
  s.addText("Week by week to thirty", { x: M, y: 1.82, w: 7.5, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  const TW = 7.5, RX = M + TW + 0.5, RW = CONTENT - TW - 0.5;
  // Both columns open on TOP and close on BOT, so the block reads as one band.
  // The table is the flexible side: its row height is derived from that span.
  const TOP = 2.75, BOT = 6.57, CARD_B = 0.95;

  // Brand Writing Style: concise, straightforward, active sentences, straight to
  // the main point. One instruction per clause, no hedging, no self-praise.
  const weeks = [
    ["Late August",   "Place the fake orders in stages. Build the affiliate list alongside."],
    ["Week 1",        "Get all orders delivered and reviewed. Contact 30 affiliates."],
    ["Week 2",        "Ship to at least 10 affiliates. Contact the next 30."],
    ["Week 3",        "Ship to at least 20 more affiliates."],
    ["Week 4 onward", "Keep finding new affiliates. Keep contacting them."],
  ];
  const rows = [["Period", "Activity"].map(t => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4 },
  }))].concat(weeks.map((r, i) => [
    { text: r[0], options: { fontFace: DISP, fontSize: 11, bold: true, color: INK,
        fill: { color: i % 2 ? WHITE : PAPER }, valign: "middle" } },
    { text: r[1], options: { fontFace: BODY, fontSize: 11.5, color: DAVIS,
        fill: { color: i % 2 ? WHITE : PAPER }, valign: "middle" } },
  ]));
  s.addTable(rows, {
    x: M, y: TOP, w: TW, colW: [2.15, 5.35],
    rowH: (BOT - TOP) / rows.length, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });

  // the goal, and the terms that hang off it
  stat(s, RX, TOP, RW, 1.05, "Month-end target", "30 Affiliates", true, 22);

  s.addText("Product focus", { x: RX, y: 4.08, w: RW, h: 0.28, margin: 0,
    fontFace: DISP, fontSize: 10.5, bold: true, charSpacing: 1.4, color: GREY, valign: "middle" });
  ["Brief Dewasa", "Brief Boxer Dewasa", "Boxer Dewasa"].forEach((p, i) => {
    const y = 4.42 + i * 0.36;
    s.addText(String(i + 1).padStart(2, "0"), { x: RX, y, w: 0.42, h: 0.32, margin: 0,
      fontFace: DISP, fontSize: 11, bold: true, color: STEEL, valign: "middle" });
    s.addText(p, { x: RX + 0.42, y, w: RW - 0.42, h: 0.32, margin: 0,
      fontFace: BODY, fontSize: 12.5, color: INK, valign: "middle" });
  });

  stat(s, RX, BOT - CARD_B, RW, CARD_B, "Affiliate commission", "15%  +  ads", false, 18);

  s.addNotes("Timeline per minggu di kiri. Target, fokus produk, dan skema komisi di kanan. "
    + "Isi aktivitas ditulis ulang mengikuti Writing Style Toni Black — kalimat aktif, "
    + "langsung ke inti. Angka dan urutan kerjanya tidak berubah dari catatan asli.");
}

// ============================================================ 3. BUDGET
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "02  ·  Budget", M, 1.58, GREY, 6.8);
  s.addText("Where the budget goes", { x: M, y: 1.82, w: 7.5, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  // headline numbers across the top
  const gap = 0.205, cw = (CONTENT - 2 * gap) / 3, y0 = 2.72, ch = 1.05;
  stat(s, M,                    y0, cw, ch, "Total budget",   "Rp 24.000.000", true,  21);
  stat(s, M + cw + gap,         y0, cw, ch, "Target ROAS",    "2×",            false, 21);
  stat(s, M + 2 * (cw + gap),   y0, cw, ch, "Target revenue", "Rp 48.000.000", false, 21);

  // the split
  const TW = 7.0, RX = M + TW + 0.5, RW = CONTENT - TW - 0.5;   // 7.0 + 0.5 + 4.4
  const items = [
    ["TikTok Ads",                       "Rp 7.000.000",  "29%"],
    ["Shopee Ads",                       "Rp 7.000.000",  "29%"],
    ["TikTok Ads for Live Affiliate *",  "Rp 10.000.000", "42%"],
  ];
  const rows = [["Channel", "Allocation", "Share"].map((t, j) => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4, align: j ? "right" : "left" },
  }))];
  items.forEach((r, i) => {
    const f = i % 2 ? WHITE : PAPER;
    rows.push([
      { text: r[0], options: { fontFace: BODY, fontSize: 12, bold: true, color: INK, fill: { color: f } } },
      { text: r[1], options: { fontFace: BODY, fontSize: 12, color: DAVIS, align: "right", fill: { color: f } } },
      { text: r[2], options: { fontFace: BODY, fontSize: 12, color: GREY, align: "right", fill: { color: f } } },
    ]);
  });
  rows.push([
    { text: "Total",         options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, fill: { color: DAVIS } } },
    { text: "Rp 24.000.000", options: { fontFace: DISP, fontSize: 12, bold: true, color: WHITE, align: "right", fill: { color: DAVIS } } },
    { text: "100%",          options: { fontFace: DISP, fontSize: 12, bold: true, color: STEEL, align: "right", fill: { color: DAVIS } } },
  ]);
  s.addTable(rows, {
    x: M, y: 4.05, w: TW, colW: [3.4, 2.2, 1.4],
    rowH: 0.46, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });

  s.addChart(P.ChartType.doughnut, [{
    name: "Alokasi",
    labels: ["TikTok Ads", "Shopee Ads", "TikTok Ads for Live Affiliate"],
    values: [7, 7, 10],
  }], {
    x: RX - 0.15, y: 4.02, w: 1.80, h: 1.80,
    holeSize: 56, showLegend: false, showValue: false,
    chartColors: [INK, GREY, DAVIS],
  });

  [["TikTok Ads", "Rp 7 Jt"], ["Shopee Ads", "Rp 7 Jt"], ["Live Affiliate", "Rp 10 Jt"]]
    .forEach((l, i) => {
      const y = 4.42 + i * 0.42;
      s.addShape(P.ShapeType.rect, { x: RX + 1.95, y: y + 0.08, w: 0.16, h: 0.16,
        fill: { color: [INK, GREY, DAVIS][i] }, line: { color: STEEL, pt: 0.5 } });
      s.addText(l[0], { x: RX + 2.22, y, w: 1.35, h: 0.32, margin: 0,
        fontFace: BODY, fontSize: 11, color: INK, valign: "middle" });
      s.addText(l[1], { x: RX + RW - 0.85, y, w: 0.85, h: 0.32, margin: 0,
        fontFace: DISP, fontSize: 11, bold: true, color: DAVIS, align: "right", valign: "middle" });
    });

  s.addText("*  Spent only when affiliates are available for live selling.", {
    x: M, y: 6.5, w: 7.0, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });

  s.addNotes("Total 24 juta sudah dicek: 7 + 7 + 10. Target revenue 48 juta adalah turunan "
    + "dari ROAS 2 x budget 24 juta. Pos Live Affiliate dipakai hanya kalau ada affiliate "
    + "yang bisa diajak live selling. "
    + "Grafik bisa diubah lewat klik kanan > Edit Data.");
}

P.writeFile({ fileName: path.join(DIR, "ToniBlack_Timeline_Budget.pptx") })
  .then(f => console.log("written:", f));
