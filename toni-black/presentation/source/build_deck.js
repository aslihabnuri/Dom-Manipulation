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
  eyebrow(s, "Program Affiliate  ·  September", M, 2.75, GREY);
  s.addText("Timeline\n& Budget", {
    x: M, y: 3.1, w: 9.5, h: 2.1, margin: 0,
    fontFace: DISP, fontSize: 54, bold: true, color: WHITE, lineSpacing: 58,
  });
  s.addText("Rencana kerja menuju 30 affiliate, dan alokasi biaya iklan yang menopangnya.", {
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
    { text: "Team name", options: { color: STEEL } },
    { text: "        Date  ", options: { color: GREY } },
    { text: "DD Month YYYY", options: { color: STEEL } },
  ], { x: 7.4, y: 6.1, w: 5.2, h: 0.4, margin: 0, fontFace: BODY, fontSize: 11.5,
       align: "right", valign: "middle" });

  s.addNotes("Ganti nama tim dan tanggal sebelum presentasi.");
}

// ============================================================ 2. TIMELINE
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "01  ·  Timeline", M, 1.58, GREY, 6.8);
  s.addText("Menuju 30 affiliate", { x: M, y: 1.82, w: 7.5, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  const TW = 7.5, RX = M + TW + 0.5, RW = CONTENT - TW - 0.5;   // 7.5 + 0.5 + 3.9

  const weeks = [
    ["Akhir Agustus",        "Buat fake order bertahap, sembari menyusun list affiliate"],
    ["Minggu 1 September",   "Pastikan semua orderan sudah sampai dan sudah direview. Targetkan menghubungi 30 affiliate"],
    ["Minggu 2 September",   "Kirim barang ke minimal 10 affiliate, dan hubungi 30 affiliate berikutnya"],
    ["Minggu 3 September",   "Kirim barang ke minimal 20 affiliate lainnya"],
    ["Minggu 4 & seterusnya","Mencari dan menghubungi affiliator baru"],
  ];
  const rows = [["Periode", "Aktivitas"].map(t => ({
    text: t, options: { fontFace: DISP, fontSize: 10.5, bold: true, color: WHITE,
      fill: { color: INK }, charSpacing: 1.4 },
  }))].concat(weeks.map((r, i) => [
    { text: r[0], options: { fontFace: DISP, fontSize: 11, bold: true, color: INK,
        fill: { color: i % 2 ? WHITE : PAPER }, valign: "middle" } },
    { text: r[1], options: { fontFace: BODY, fontSize: 11.5, color: DAVIS,
        fill: { color: i % 2 ? WHITE : PAPER }, valign: "middle" } },
  ]));
  s.addTable(rows, {
    x: M, y: 2.75, w: TW, colW: [2.3, 5.2],
    rowH: 0.60, valign: "middle", margin: [0, 0.16, 0, 0.16],
    border: { type: "solid", color: STEEL, pt: 0.5 },
  });

  // the goal, and the terms that hang off it
  stat(s, RX, 2.75, RW, 1.05, "Target akhir bulan", "30 Affiliate", true, 22);

  s.addText("Product focus", { x: RX, y: 4.08, w: RW, h: 0.28, margin: 0,
    fontFace: DISP, fontSize: 10.5, bold: true, charSpacing: 1.4, color: GREY, valign: "middle" });
  ["Brief Dewasa", "Brief Boxer Dewasa", "Boxer Dewasa"].forEach((p, i) => {
    const y = 4.42 + i * 0.36;
    s.addText(String(i + 1).padStart(2, "0"), { x: RX, y, w: 0.42, h: 0.32, margin: 0,
      fontFace: DISP, fontSize: 11, bold: true, color: STEEL, valign: "middle" });
    s.addText(p, { x: RX + 0.42, y, w: RW - 0.42, h: 0.32, margin: 0,
      fontFace: BODY, fontSize: 12.5, color: INK, valign: "middle" });
  });

  stat(s, RX, 5.62, RW, 0.95, "Affiliate commission", "15%  +  ads", false, 18);

  s.addNotes("Timeline per minggu di kiri. Target, fokus produk, dan skema komisi di kanan. "
    + "Label periode dirapikan dari catatan asli, isinya tidak diubah.");
}

// ============================================================ 3. BUDGET
{
  const s = P.addSlide();
  s.background = { color: WHITE };
  logo(s, false, M, 0.70, 1.55);
  eyebrow(s, "02  ·  Budget", M, 1.58, GREY, 6.8);
  s.addText("Alokasi budget", { x: M, y: 1.82, w: 6.8, h: 0.7, margin: 0,
    fontFace: DISP, fontSize: 34, bold: true, color: INK, valign: "middle" });

  // headline numbers across the top
  const cw = 3.83, gap = 0.205, y0 = 2.72, ch = 1.05;
  stat(s, M,                    y0, cw, ch, "Total budget",   "Rp 24.000.000", true,  21);
  stat(s, M + cw + gap,         y0, cw, ch, "Target ROAS",    "3×",       false, 21);
  stat(s, M + 2 * (cw + gap),   y0, cw, ch, "Target revenue", "Rp 72.000.000", false, 21);

  // the split
  const TW = 7.0, RX = M + TW + 0.5, RW = CONTENT - TW - 0.5;   // 7.0 + 0.5 + 4.4
  const items = [
    ["TikTok Ads",                       "Rp 7.000.000",  "29%"],
    ["Shopee Ads",                       "Rp 7.000.000",  "29%"],
    ["TikTok Ads for Live Affiliate *",  "Rp 10.000.000", "42%"],
  ];
  const rows = [["Pos", "Alokasi", "Share"].map((t, j) => ({
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
      s.addText(l[1], { x: RX + 3.55, y, w: 0.85, h: 0.32, margin: 0,
        fontFace: DISP, fontSize: 11, bold: true, color: DAVIS, align: "right", valign: "middle" });
    });

  s.addText("*  Tambahkan keterangan untuk pos ini.", {
    x: M, y: 6.5, w: 7.0, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, color: GREY });

  s.addNotes("Total 24 juta sudah dicek: 7 + 7 + 10. Target revenue 72 juta adalah turunan "
    + "dari ROAS 3 x budget 24 juta. Ganti keterangan tanda bintang sesuai kesepakatan. "
    + "Grafik bisa diubah lewat klik kanan > Edit Data.");
}

P.writeFile({ fileName: path.join(DIR, "ToniBlack_Timeline_Budget.pptx") })
  .then(f => console.log("written:", f));
