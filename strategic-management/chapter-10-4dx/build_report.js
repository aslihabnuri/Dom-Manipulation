// Builds the 2-page framework report (A4, Times New Roman 12, 1.5 spacing)
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, HeadingLevel, BorderStyle, ShadingType, LevelFormat, TabStopType,
  Footer, PageNumber, VerticalAlign,
} = require("docx");

const FONT = "Times New Roman";
const SIZE = 24; // 12pt (half-points)
const LINE = 360; // 1.5 spacing (240 = single)

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: SIZE, ...opts });

const para = (children, opts = {}) =>
  new Paragraph({
    spacing: { line: LINE, after: 80 },
    alignment: AlignmentType.JUSTIFIED,
    children: Array.isArray(children) ? children : [run(children)],
    ...opts,
  });

const heading = (text) =>
  new Paragraph({
    spacing: { line: LINE, before: 120, after: 40 },
    keepNext: true,
    children: [run(text, { bold: true })],
  });

const bullet = (children) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { line: LINE, after: 40 },
    alignment: AlignmentType.JUSTIFIED,
    children: Array.isArray(children) ? children : [run(children)],
  });

const ref = (children) =>
  new Paragraph({
    spacing: { line: 276, after: 40 },
    indent: { left: 567, hanging: 567 },
    children: children.map((c) => (typeof c === "string" ? run(c, { size: 20 }) : c)),
  });
const refI = (t) => run(t, { italics: true, size: 20 });

// ---------- Table: dimensions & measures ----------
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const W = [1700, 3300, 4360]; // DXA, sum 9360 (A4 width 11906 - margins 2x1134 = 9638)
const tcell = (text, w, opts = {}) =>
  new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    shading: opts.head ? { type: ShadingType.CLEAR, fill: "D9D9D9", color: "auto" } : undefined,
    children: (Array.isArray(text) ? text : [text]).map(
      (t) =>
        new Paragraph({
          spacing: { line: 240, after: 0 },
          children: [run(t, { size: 20, bold: !!opts.head })],
        })
    ),
  });

const tableRows = [
  ["Discipline (dimension)", "Definition", "Key measures / indicators"],
  [
    "1. Focus on the Wildly Important (WIG)",
    "Narrow the strategic focus to one or two Wildly Important Goals per team, stated as “from X to Y by when”, outside the daily “whirlwind”.",
    "Number of WIGs per team (max. 2); a lag measure with baseline, target and deadline (e.g., on-time delivery from 82% to 95% by 31 Dec).",
  ],
  [
    "2. Act on the Lead Measures",
    "Identify the few high-leverage activities that are predictive of the WIG and influenceable by the team, then act on them weekly.",
    "Lead measures: predictive and influenceable behaviours (e.g., number of proactive customer visits per week; % of orders confirmed within 24 hours).",
  ],
  [
    "3. Keep a Compelling Scoreboard",
    "A simple, visible “players’ scoreboard” that shows lead and lag measures so the team knows instantly whether it is winning or losing.",
    "Scoreboard criteria: simple, visible to the team, shows both lead and lag, and tells at a glance if the team is winning.",
  ],
  [
    "4. Create a Cadence of Accountability",
    "A short weekly WIG session in which each member reports on last week’s commitments, reviews the scoreboard and makes new commitments.",
    "WIG session held weekly (20–30 min); % of commitments kept; scoreboard movement week-on-week.",
  ],
];

const table = new Table({
  width: { size: W.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths: W,
  rows: tableRows.map(
    (r, i) => new TableRow({ tableHeader: i === 0, children: r.map((c, j) => tcell(c, W[j], { head: i === 0 })) })
  ),
});

// ---------- Content ----------
const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 276, after: 0 },
    children: [run("MAN 5422 STRATEGIC MANAGEMENT – MM UGM JAKARTA (SEMBA)", { bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 276, after: 0 },
    children: [run("Strategic Framework Report – Group 3", { bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 276, after: 0 },
    children: [run("The 4 Disciplines of Execution (4DX)", { bold: true, size: 28 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 276, after: 0 },
    children: [run("In correlation with Chapter 10: Building an Organization Capable of Good Strategy Execution", { italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 276, after: 120 },
    children: [
      run("Members: Tifani Puspita, Dara Astrini Rahayu K., Richy Fatma Salsabila, Happy Dinithasari, Aslih Abnuri", { size: 20 }),
      run("  |  Session 9 (7 November 2026)  |  Lecturer: Dr. Rangga Almahendra, S.T., M.M.", { size: 20 }),
    ],
  }),

  heading("1. The Framework and Why It Fits Chapter 10"),
  para([
    run("The 4 Disciplines of Execution (4DX) is an execution system developed by FranklinCovey and published by McChesney, Covey and Huling (2012). "),
    run("FranklinCovey reports that organisations spend more than USD 30 billion a year on strategy creation, yet more than 80% of those strategies fail in execution (FranklinCovey, 2024), because the daily “whirlwind” of running the operation crowds out new strategic goals. "),
    run("Thompson et al. (2024, p. 295) note that “it is much easier to develop a sound strategic plan than it is to execute the plan”, frame execution as “primarily operations-driven”, and identify three key organisation-building actions (Figure 10.2, p. 299): staffing the organisation, acquiring and strengthening resources and capabilities, and structuring the organisation and work effort. "),
    run("Chapter 10 explains "),
    run("what", { italics: true }),
    run(" an organisation must be capable of; 4DX prescribes "),
    run("how", { italics: true }),
    run(" teams behave week by week so those capabilities deliver the strategy."),
  ]),

  heading("2. Key Dimensions and Measures of the Model"),
  table,
  new Paragraph({
    spacing: { line: 240, before: 40, after: 80 },
    children: [run("Table 1. Dimensions, definitions and measures of 4DX (adapted from McChesney, Covey & Huling, 2012).", { size: 18, italics: true })],
  }),

  heading("3. How the Dimensions Are Defined"),
  para([
    run("Lag versus lead measures. ", { bold: true }),
    run("A lag measure (revenue, market share, defect rate) reports a result after it is history. A lead measure must pass two tests: it is "),
    run("predictive", { italics: true }),
    run(" of the lag measure and it is "),
    run("influenceable", { italics: true }),
    run(" by the team itself."),
  ]),
  para([
    run("WIG rule and formula. ", { bold: true }),
    run("A team holds at most two WIGs, each written as “from X to Y by when”; team WIGs must feed the organisational WIG, giving a line of sight from boardroom to frontline."),
  ]),
  para([
    run("Scoreboard and cadence. ", { bold: true }),
    run("The scoreboard is a “players’ scoreboard”, not a manager’s dashboard: simple, visible, lead and lag together, readable in five seconds. The cadence is a weekly 20–30 minute WIG session (account for last week’s commitments, review the scoreboard, commit for next week). Discipline 4 is where execution happens, because it converts strategy into weekly personal commitments."),
  ]),

  heading("4. Correlation with Chapter 10 Concepts"),
  bullet([
    run("Staffing the organisation: ", { bold: true }),
    run("weekly WIG sessions reveal who consistently delivers, supporting the chapter’s call for “a critical mass of talented managers who can function as agents of change” (p. 301)."),
  ]),
  bullet([
    run("Building competitive capabilities: ", { bold: true }),
    run("lead measures are the behaviours that form a capability; repeating them weekly turns skills into competence, consistent with capability building as “a multistage process that occurs over a period of months and years” (p. 305) and with execution capabilities as the most durable advantage when strategies are easy to copy (p. 308)."),
  ]),
  bullet([
    run("Structuring the organisation: ", { bold: true }),
    run("4DX gives teams authority over their lead measures, matching the advice to push decisions “to the lowest organizational level capable of making timely, informed, competent decisions” (p. 318) and the Core Concept that “good strategy execution requires a team effort” (p. 296)."),
  ]),

  heading("5. Benefits in the Context of International Business"),
  para([
    run("First, "),
    run("focus across borders: ", { bold: true }),
    run("the two-WIG rule forces each country unit to align on the few goals that matter for the global strategy, curbing the initiative overload typical of matrix organisations. Second, "),
    run("common language: ", { bold: true }),
    run("lead measures and scoreboards translate easily, so subsidiaries in Jakarta and Dubai can be compared on the same behaviours. Third, "),
    run("accountability at distance: ", { bold: true }),
    run("the weekly WIG session is a light governance rhythm that works virtually across time zones. Fourth, "),
    run("local adaptation with global alignment: ", { bold: true }),
    run("head office sets the lag measure while each country team chooses its own lead measures, so local knowledge is used without losing coherence. Reported results include Whirlpool’s USD 5.7 million gain in 90 days and DeKalb Medical’s rise from the 3rd to the 99th percentile in patient satisfaction (FranklinCovey, 2024)."),
  ]),

  heading("6. Critical Assessment"),
  para([
    run("4DX is silent on strategy content: it executes a bad strategy as faithfully as a good one, so it must sit downstream of the analysis in Chapters 3–8. Its evidence base is mostly vendor case studies. The weekly cadence turns ritualistic if treated as reporting rather than problem-solving, and in high power-distance cultures such as Indonesia members may hesitate to admit missed commitments, so leaders must model psychological safety. WIGs must also be revisited when the environment shifts, or the model delivers disciplined execution of an outdated goal."),
  ]),

  heading("References"),
  ref(["FranklinCovey. (2024). ", refI("The 4 Disciplines of Execution®"), ". https://www.franklincovey.com/the-4-disciplines/"]),
  ref(["McChesney, C., Covey, S., & Huling, J. (2012). ", refI("The 4 Disciplines of Execution: Achieving Your Wildly Important Goals"), ". New York: Free Press."]),
  ref(["Thompson, A. A., Peteraf, M. A., Gamble, J. E., & Strickland, A. J. (2024). ", refI("Crafting & Executing Strategy: The Quest for Competitive Advantage: Concepts and Cases"), " (2024 Release), Chapter 10, pp. 294–325. New York: McGraw Hill."]),
];

const doc = new Document({
  creator: "Group 3",
  title: "SMJKT_Group 3_Framework 4DX",
  styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 283 } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // 2 cm
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                run("SMJKT_Group 3_Framework Presentation: 4DX  |  Page ", { size: 18 }),
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

const out = process.argv[2] || "report.docx";
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log("wrote", out);
});
