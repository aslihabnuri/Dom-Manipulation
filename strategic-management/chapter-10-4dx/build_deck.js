// 15-minute framework presentation deck: The 4 Disciplines of Execution (4DX)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Group 3";
pres.title = "SMJKT_Group 3_Framework Presentation: 4DX";

// Palette: "Deep Ink & Amber" - discipline / execution theme
const C = {
  ink: "14213D", // navy ink (dominant)
  ink2: "1F2F57",
  amber: "FCA311", // accent
  paper: "FFFFFF",
  mist: "EEF1F6", // light card fill
  slate: "4A5568", // body grey
  line: "D5DAE3",
  green: "2E7D32",
  red: "C62828",
};
const HF = "Cambria";
const BF = "Calibri";

let slideNo = 0;
function footer(slide, dark = false) {
  slideNo += 1;
  slide.addText("Group 3  |  4 Disciplines of Execution  |  Ch. 10 Building an Organization Capable of Good Strategy Execution", {
    x: 0.5, y: 5.2, w: 8.4, h: 0.3, fontFace: BF, fontSize: 9, color: dark ? "AEB7C9" : "8A94A6", isTextBox: true, margin: 0,
  });
  slide.addText(String(slideNo), {
    x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontFace: BF, fontSize: 9, color: dark ? "AEB7C9" : "8A94A6", align: "right", isTextBox: true, margin: 0,
  });
}
function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.5, y: 0.35, w: 9.0, h: 0.8, fontFace: HF, fontSize: opts.size || (text.length > 34 ? 26 : 30), bold: true, color: opts.color || C.ink,
    isTextBox: true, margin: 0, valign: "middle",
  });
}
function numCircle(slide, n, x, y, d = 0.6, fill = C.amber, color = C.ink) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  slide.addText(String(n), { x, y, w: d, h: d, fontFace: HF, fontSize: d * 32, bold: true, color, align: "center", valign: "middle", isTextBox: true, margin: 0 });
}
function card(slide, x, y, w, h, fill = C.mist) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
}
function bullets(slide, items, x, y, w, h, opts = {}) {
  slide.addText(
    items.map((t, i) => ({
      text: t,
      options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: opts.gap || 6 },
    })),
    { x, y, w, h, fontFace: BF, fontSize: opts.size || 14, color: opts.color || C.slate, valign: "top", isTextBox: true, margin: 0 }
  );
}

// ---------------- 1. Title ----------------
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  s.addShape(pres.ShapeType.ellipse, { x: 7.3, y: -1.2, w: 4.2, h: 4.2, fill: { color: C.ink2 }, line: { color: C.ink2 } });
  s.addText("Group 3  |  Strategic Framework Presentation  |  Session 9", { x: 0.6, y: 0.6, w: 8.5, h: 0.4, fontFace: BF, fontSize: 14, color: C.amber, isTextBox: true, margin: 0 });
  s.addText("The 4 Disciplines\nof Execution (4DX)", { x: 0.6, y: 1.25, w: 8.0, h: 1.9, fontFace: HF, fontSize: 46, bold: true, color: C.paper, isTextBox: true, margin: 0, valign: "top" });
  s.addText("A framework for turning strategy into results, in correlation with Chapter 10: Building an Organization Capable of Good Strategy Execution (Thompson, Peteraf, Gamble & Strickland, 2024)", {
    x: 0.6, y: 3.2, w: 7.6, h: 0.8, fontFace: BF, fontSize: 14, color: "CBD3E3", isTextBox: true, margin: 0,
  });
  s.addText("Tifani Puspita  •  Dara Astrini Rahayu K.  •  Richy Fatma Salsabila  •  Happy Dinithasari  •  Aslih Abnuri", {
    x: 0.6, y: 4.25, w: 8.8, h: 0.35, fontFace: BF, fontSize: 12, color: C.paper, isTextBox: true, margin: 0,
  });
  s.addText("MAN 5422 Strategic Management  |  MM UGM Jakarta (SEMBA)  |  Lecturer: Dr. Rangga Almahendra, S.T., M.M.", {
    x: 0.6, y: 4.6, w: 8.8, h: 0.35, fontFace: BF, fontSize: 11, color: "AEB7C9", isTextBox: true, margin: 0,
  });
  s.addNotes("Opening (1 min). Introduce the group and the framework. Frame the talk: Chapter 10 tells us WHAT an organization needs to execute strategy (people, capabilities, structure); 4DX tells us HOW teams behave week by week to make execution happen. Agenda: why execution fails, Chapter 10 recap, the four disciplines, dimensions and measures, link to Chapter 10, international business benefits, critique.");
}

// ---------------- 2. Why execution matters ----------------
{
  const s = pres.addSlide();
  title(s, "Strategy is the easy half. Execution is the hard half.");
  // big stats
  card(s, 0.5, 1.35, 2.9, 2.2, C.ink);
  s.addText("80%", { x: 0.5, y: 1.45, w: 2.9, h: 1.0, fontFace: HF, fontSize: 60, bold: true, color: C.amber, align: "center", isTextBox: true, margin: 0 });
  s.addText("of strategies fail in execution, despite USD 30 bn+ spent yearly on strategy creation (FranklinCovey, 2024)", { x: 0.7, y: 2.5, w: 2.5, h: 0.95, fontFace: BF, fontSize: 12, color: C.paper, align: "center", isTextBox: true, margin: 0 });
  card(s, 3.55, 1.35, 2.9, 2.2, C.ink);
  s.addText("#1", { x: 3.55, y: 1.45, w: 2.9, h: 1.0, fontFace: HF, fontSize: 60, bold: true, color: C.amber, align: "center", isTextBox: true, margin: 0 });
  s.addText("challenge named by 400 CEOs in the US, Europe and Asia: executional excellence (Thompson et al., 2024, p. 295)", { x: 3.75, y: 2.5, w: 2.5, h: 0.95, fontFace: BF, fontSize: 12, color: C.paper, align: "center", isTextBox: true, margin: 0 });
  card(s, 6.6, 1.35, 2.9, 2.2, C.mist);
  s.addText("“It’s been rather easy for us to decide where we wanted to go. The hard part is to get the organization to act on the new priorities.”", {
    x: 6.8, y: 1.5, w: 2.5, h: 1.6, fontFace: HF, fontSize: 13, italic: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle",
  });
  s.addText("– Executive quoted in Thompson et al. (2024, p. 295)", { x: 6.8, y: 3.1, w: 2.5, h: 0.35, fontFace: BF, fontSize: 10, color: C.slate, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Chapter 10: ", options: { bold: true, color: C.ink } },
    { text: "“Whereas crafting strategy is largely an analysis-driven activity … executing strategy is primarily operations-driven, revolving around the management of people, resources, business processes, and organizational structure.” (p. 295)", options: { color: C.slate } },
  ], { x: 0.5, y: 3.8, w: 9.0, h: 0.9, fontFace: BF, fontSize: 14, isTextBox: true, margin: 0, valign: "top" });
  s.addText("The question for today: what keeps operations-driven execution alive when daily work takes over?", { x: 0.5, y: 4.65, w: 9.0, h: 0.4, fontFace: BF, fontSize: 13, italic: true, color: C.ink, isTextBox: true, margin: 0 });
  footer(s);
  s.addNotes("1.5 min. Set up the problem. Thompson et al. open Chapter 10 with the finding that execution, not strategy, is the number-one challenge for CEOs. FranklinCovey's own diagnosis is the same: most strategies die in execution. Transition: Chapter 10 gives us a map of what must be in place; 4DX gives the weekly operating rhythm.");
}

// ---------------- 3. Chapter 10 recap ----------------
{
  const s = pres.addSlide();
  title(s, "Chapter 10 recap: organization-building tasks", { size: 24 });
  s.addText("Fig. 10.1 – Ten basic tasks of strategy execution (p. 298)", { x: 0.5, y: 1.15, w: 5.4, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: C.slate, isTextBox: true, margin: 0 });
  const tasks = [
    "Staffing the organization", "Developing resources & capabilities", "Creating a strategy-supportive structure",
    "Allocating sufficient resources", "Instituting policies & procedures", "Adopting continuous-improvement processes",
    "Installing information & operating systems", "Tying rewards to performance", "Fostering a supportive culture", "Exerting strategic leadership",
  ];
  tasks.forEach((t, i) => {
    const y = 1.5 + i * 0.36;
    const isCh10 = i < 3;
    s.addShape(pres.ShapeType.rect, { x: 0.5, y, w: 5.4, h: 0.32, fill: { color: isCh10 ? C.ink : C.mist }, line: { color: C.paper, width: 1 } });
    s.addText(`${i + 1}. ${t}`, { x: 0.6, y, w: 4.6, h: 0.32, fontFace: BF, fontSize: 11, bold: isCh10, color: isCh10 ? C.paper : C.slate, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(isCh10 ? "Ch. 10" : i < 8 ? "Ch. 11" : "Ch. 12", { x: 5.1, y, w: 0.75, h: 0.32, fontFace: BF, fontSize: 9, color: isCh10 ? C.amber : "8A94A6", align: "right", isTextBox: true, margin: 0, valign: "middle" });
  });
  // three key actions
  s.addText("Fig. 10.2 – Three key actions (p. 299)", { x: 6.3, y: 1.15, w: 3.2, h: 0.3, fontFace: BF, fontSize: 10, bold: true, color: C.slate, isTextBox: true, margin: 0 });
  const acts = [
    ["Staffing", "Strong management team; recruit, train and retain talent (pp. 300–304)"],
    ["Capabilities", "Build via internal development, M&A or partnerships; “a multistage process” (p. 305)"],
    ["Structure", "Outsource vs. in-house, structure type, centralize vs. delegate, cross-unit coordination (pp. 309–321)"],
  ];
  acts.forEach(([h, d], i) => {
    const y = 1.5 + i * 1.2;
    card(s, 6.3, y, 3.2, 1.1);
    numCircle(s, i + 1, 6.42, y + 0.12, 0.42);
    s.addText(h, { x: 6.95, y: y + 0.08, w: 2.5, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: 6.45, y: y + 0.5, w: 2.95, h: 0.58, fontFace: BF, fontSize: 10.5, color: C.slate, isTextBox: true, margin: 0, valign: "top" });
  });
  footer(s);
  s.addNotes("1.5 min. Quick recap so the audience sees where 4DX plugs in. Chapter 10 covers tasks 1-3 of the ten: staffing, capabilities, structure. Emphasize the Core Concept on p. 296: good strategy execution requires a team effort; all managers and employees are participants. 4DX is precisely a team-level mechanism.");
}

// ---------------- 4. The whirlwind ----------------
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  title(s, "The real enemy of execution: the whirlwind", { color: C.paper });
  // Two columns: whirlwind vs goals
  card(s, 0.5, 1.35, 4.3, 3.3, C.ink2);
  s.addText("The Whirlwind", { x: 0.75, y: 1.5, w: 3.8, h: 0.45, fontFace: HF, fontSize: 22, bold: true, color: C.amber, isTextBox: true, margin: 0 });
  bullets(s, [
    "The massive energy needed just to keep the operation running day to day",
    "Urgent, unavoidable, and it always wins the fight for attention",
    "Not the villain: it keeps the company alive today",
  ], 0.75, 2.05, 3.8, 2.4, { color: "DCE2EE", size: 14 });
  card(s, 5.2, 1.35, 4.3, 3.3, C.ink2);
  s.addText("The Strategic Goals", { x: 5.45, y: 1.5, w: 3.8, h: 0.45, fontFace: HF, fontSize: 22, bold: true, color: C.amber, isTextBox: true, margin: 0 });
  bullets(s, [
    "New initiatives that require behaviour change",
    "Important but not urgent, so they are postponed week after week",
    "Chapter 10: “when strategies fail, it is often because of poor execution” (p. 297)",
  ], 5.45, 2.05, 3.8, 2.4, { color: "DCE2EE", size: 14 });
  s.addText("4DX is designed to execute strategic goals in the midst of the whirlwind, not instead of it.", { x: 0.5, y: 4.75, w: 9.0, h: 0.4, fontFace: BF, fontSize: 14, italic: true, color: C.paper, align: "center", isTextBox: true, margin: 0 });
  footer(s, true);
  s.addNotes("1 min. Introduce the central diagnosis in McChesney, Covey and Huling (2012): the whirlwind. Ask the audience: how many of your own strategic initiatives from January are still alive in November? The whirlwind is why capabilities described in Chapter 10 often exist on paper but are not used.");
}

// ---------------- 5. 4DX overview ----------------
{
  const s = pres.addSlide();
  title(s, "The 4 Disciplines at a glance");
  s.addText("McChesney, Covey & Huling (2012), FranklinCovey. Applied with 140,000+ teams in 4,000+ implementations worldwide.", { x: 0.5, y: 1.1, w: 9.0, h: 0.3, fontFace: BF, fontSize: 11, color: C.slate, isTextBox: true, margin: 0 });
  const d = [
    ["Focus on the Wildly Important", "The discipline of focus", "Narrow to 1–2 Wildly Important Goals (WIGs) per team"],
    ["Act on the Lead Measures", "The discipline of leverage", "Work the few predictive, influenceable activities"],
    ["Keep a Compelling Scoreboard", "The discipline of engagement", "People play differently when they keep score"],
    ["Create a Cadence of Accountability", "The discipline of accountability", "A short weekly session of commitments and follow-through"],
  ];
  d.forEach((x, i) => {
    const cx = 0.5 + i * 2.3;
    card(s, cx, 1.55, 2.15, 3.35, i % 2 === 0 ? C.mist : C.ink);
    const dark = i % 2 !== 0;
    numCircle(s, i + 1, cx + 0.15, 1.7, 0.6);
    s.addText(x[0], { x: cx + 0.15, y: 2.4, w: 1.85, h: 0.8, fontFace: HF, fontSize: 15, bold: true, color: dark ? C.paper : C.ink, isTextBox: true, margin: 0, valign: "top" });
    s.addText(x[1], { x: cx + 0.15, y: 3.2, w: 1.85, h: 0.35, fontFace: BF, fontSize: 11, italic: true, color: dark ? C.amber : C.slate, isTextBox: true, margin: 0 });
    s.addText(x[2], { x: cx + 0.15, y: 3.6, w: 1.85, h: 1.2, fontFace: BF, fontSize: 12, color: dark ? "DCE2EE" : C.slate, isTextBox: true, margin: 0, valign: "top" });
  });
  footer(s);
  s.addNotes("1 min. Give the whole model in one view before going deep. Note the sequence matters: 1 and 2 are about choosing what to do; 3 and 4 are about sustaining behaviour. Definitions in italics are FranklinCovey's own labels.");
}

// ---------------- 6. Discipline 1 ----------------
{
  const s = pres.addSlide();
  numCircle(s, 1, 0.5, 0.42, 0.65);
  s.addText("Focus on the Wildly Important", { x: 1.3, y: 0.35, w: 8.2, h: 0.8, fontFace: HF, fontSize: 30, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
  // Left: rules
  s.addText("Definition", { x: 0.5, y: 1.3, w: 4.3, h: 0.35, fontFace: HF, fontSize: 16, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  bullets(s, [
    "Select the one or two goals that would make the biggest difference if achieved; everything else stays in the whirlwind",
    "Rule: no team holds more than two WIGs at a time",
    "Every team WIG must translate into the WIG of the level above (line of sight from board to frontline)",
    "Leaders may veto, but teams choose their own WIG, which creates ownership",
  ], 0.5, 1.7, 4.3, 3.3, { size: 13 });
  // Right: formula card
  card(s, 5.2, 1.3, 4.3, 1.6, C.ink);
  s.addText("The WIG formula", { x: 5.45, y: 1.4, w: 3.8, h: 0.35, fontFace: BF, fontSize: 11, color: C.amber, isTextBox: true, margin: 0 });
  s.addText("From X  →  to Y  by WHEN", { x: 5.45, y: 1.75, w: 3.8, h: 0.55, fontFace: HF, fontSize: 18, bold: true, color: C.paper, isTextBox: true, margin: 0, valign: "middle" });
  s.addText("A lag measure with a baseline, a target and a deadline", { x: 5.45, y: 2.35, w: 3.8, h: 0.45, fontFace: BF, fontSize: 12, color: "DCE2EE", isTextBox: true, margin: 0 });
  card(s, 5.2, 3.05, 4.3, 1.95, C.mist);
  s.addText("Example (regional expansion)", { x: 5.45, y: 3.15, w: 3.8, h: 0.35, fontFace: BF, fontSize: 11, bold: true, color: C.slate, isTextBox: true, margin: 0 });
  s.addText("“Increase on-time delivery to Vietnam distributors from 82% to 95% by 31 December 2027.”", { x: 5.45, y: 3.5, w: 3.8, h: 0.85, fontFace: HF, fontSize: 14, italic: true, color: C.ink, isTextBox: true, margin: 0, valign: "top" });
  s.addText("Measure: number of WIGs per team (max 2); WIG statement complete (X, Y, when)", { x: 5.45, y: 4.4, w: 3.8, h: 0.5, fontFace: BF, fontSize: 11, color: C.slate, isTextBox: true, margin: 0 });
  footer(s);
  s.addNotes("1.5 min. The first dimension is focus. The measure is deceptively simple: how many goals does the team carry? More than two means none gets executed. Explain the formula 'from X to Y by when' with the illustrative example (a hypothetical Indonesian manufacturer expanding to Vietnam). Link to Chapter 10: this is where leadership's decision on which value chain activities are strategy-critical (p. 313) becomes a concrete goal.");
}

// ---------------- 7. Discipline 2 ----------------
{
  const s = pres.addSlide();
  numCircle(s, 2, 0.5, 0.42, 0.65);
  s.addText("Act on the Lead Measures", { x: 1.3, y: 0.35, w: 8.2, h: 0.8, fontFace: HF, fontSize: 30, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
  // comparison table
  const rows = [
    [{ text: "", options: { fill: { color: C.paper } } }, { text: "Lag measure", options: { bold: true, color: C.paper, fill: { color: C.slate }, align: "center" } }, { text: "Lead measure", options: { bold: true, color: C.ink, fill: { color: C.amber }, align: "center" } }],
    ["What it measures", "The result you want (the WIG itself)", "The activity that drives the result"],
    ["Timing", "Known only after the fact; history", "Known now, weekly"],
    ["Can the team move it directly?", "No – it is an outcome", "Yes – it must be influenceable"],
    ["Predictive?", "No – it is the goal", "Yes – it must be predictive of the lag"],
    ["Example", "On-time delivery 82% → 95%", "% of orders confirmed to forwarder within 24 h; weekly quality audits completed"],
  ];
  s.addTable(
    rows.map((r, i) =>
      r.map((c, j) => {
        const cell = typeof c === "string" ? { text: c, options: {} } : c;
        cell.options = Object.assign({ fontFace: BF, fontSize: 12, color: j === 0 ? C.ink : C.slate, bold: j === 0 && i > 0, valign: "middle", margin: 0.06 }, cell.options);
        if (i > 0 && i % 2 === 0) cell.options.fill = { color: C.mist };
        return cell;
      })
    ),
    { x: 0.5, y: 1.3, w: 6.0, colW: [1.7, 2.0, 2.3], border: { type: "solid", color: C.line, pt: 0.75 }, rowH: 0.5 }
  );
  card(s, 6.8, 1.3, 2.7, 3.6, C.ink);
  s.addText("The two tests of a good lead measure", { x: 7.0, y: 1.45, w: 2.3, h: 0.6, fontFace: HF, fontSize: 15, bold: true, color: C.amber, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Predictive", options: { bold: true, color: C.paper, breakLine: true } },
    { text: "If it moves, the WIG moves.", options: { color: "DCE2EE", breakLine: true, paraSpaceAfter: 10 } },
    { text: "Influenceable", options: { bold: true, color: C.paper, breakLine: true } },
    { text: "The team can move it this week without waiting for anyone else.", options: { color: "DCE2EE", breakLine: true, paraSpaceAfter: 10 } },
    { text: "Chapter 10 link", options: { bold: true, color: C.amber, breakLine: true } },
    { text: "Lead measures are the routines that, repeated, become an organizational capability (p. 305).", options: { color: "DCE2EE" } },
  ], { x: 7.0, y: 2.1, w: 2.3, h: 2.7, fontFace: BF, fontSize: 12, isTextBox: true, margin: 0, valign: "top" });
  footer(s);
  s.addNotes("2 min. This is the operational heart of 4DX. Most organizations manage by lag measures (revenue, share, satisfaction), which cannot be acted on directly. The discipline is to find the 20% of activities that produce 80% of the result and manage those. Link to Chapter 10's capability-building logic: 'the first step is to develop the ability to do something, however imperfectly' and then improve through repetition (p. 305). A lead measure is that repetition made visible.");
}

// ---------------- 8. Discipline 3 ----------------
{
  const s = pres.addSlide();
  numCircle(s, 3, 0.5, 0.42, 0.65);
  s.addText("Keep a Compelling Scoreboard", { x: 1.3, y: 0.35, w: 8.2, h: 0.8, fontFace: HF, fontSize: 30, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
  s.addText("A players’ scoreboard, not a coach’s dashboard", { x: 0.5, y: 1.25, w: 4.4, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  const crit = [
    ["Simple", "A handful of numbers, not a 20-page report"],
    ["Visible", "Where the team works, updated by the team"],
    ["Shows lead AND lag", "The activity and the result, side by side"],
    ["Tells you at a glance", "Are we winning or losing? Answer in 5 seconds"],
  ];
  crit.forEach(([h, d], i) => {
    const y = 1.75 + i * 0.8;
    s.addShape(pres.ShapeType.ellipse, { x: 0.5, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: C.amber }, line: { color: C.amber } });
    s.addText("✓", { x: 0.5, y: y + 0.08, w: 0.5, h: 0.5, fontFace: BF, fontSize: 16, bold: true, color: C.ink, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(h, { x: 1.15, y, w: 3.7, h: 0.35, fontFace: BF, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(d, { x: 1.15, y: y + 0.33, w: 3.7, h: 0.4, fontFace: BF, fontSize: 12, color: C.slate, isTextBox: true, margin: 0 });
  });
  // Mock scoreboard (native chart)
  card(s, 5.2, 1.25, 4.3, 3.7, C.mist);
  s.addText("Team scoreboard – WIG: on-time delivery 82% → 95%", { x: 5.4, y: 1.35, w: 3.9, h: 0.35, fontFace: BF, fontSize: 11, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addChart(
    pres.ChartType.line,
    [
      { name: "Actual (lag)", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], values: [82, 83, 83, 85, 87, 88, 90, 91] },
      { name: "Target path", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], values: [82, 83.5, 85, 86.5, 88, 89.5, 91, 92.5] },
    ],
    {
      x: 5.3, y: 1.7, w: 4.1, h: 2.4,
      chartColors: [C.ink, C.amber], lineSize: 2, lineDataSymbol: "circle", lineDataSymbolSize: 6,
      showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: C.slate,
      valAxisMinVal: 80, valAxisMaxVal: 96, valAxisLabelFontSize: 9, catAxisLabelFontSize: 9,
      valAxisLabelColor: C.slate, catAxisLabelColor: C.slate, valGridLine: { color: C.line, size: 0.5 }, catGridLine: { style: "none" },
      showTitle: false,
    }
  );
  s.addText([
    { text: "Lead this week: ", options: { bold: true, color: C.ink } },
    { text: "orders confirmed <24 h: 46/50 (92%)  ", options: { color: C.green, bold: true } },
    { text: "|  Status: ", options: { bold: true, color: C.ink } },
    { text: "winning", options: { color: C.green, bold: true } },
  ], { x: 5.4, y: 4.2, w: 3.9, h: 0.6, fontFace: BF, fontSize: 11, isTextBox: true, margin: 0, valign: "top" });
  footer(s);
  s.addNotes("1.5 min. The measure for this dimension is the quality of the scoreboard against four criteria. Show the mock scoreboard: actual versus target path plus this week's lead measure. Point: engagement rises when people keep their own score. Chapter 10 link: this is the team-level equivalent of the two 'best signs' of good execution on p. 297, meeting performance targets and proficiency in strategy-critical activities.");
}

// ---------------- 9. Discipline 4 ----------------
{
  const s = pres.addSlide();
  numCircle(s, 4, 0.5, 0.42, 0.65);
  s.addText("Create a Cadence of Accountability", { x: 1.3, y: 0.35, w: 8.2, h: 0.8, fontFace: HF, fontSize: 26, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
  s.addText("The weekly WIG session: 20–30 minutes, same day, same time, never cancelled", { x: 0.5, y: 1.25, w: 9.0, h: 0.4, fontFace: HF, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  const steps = [
    ["Account", "Each member reports on last week’s commitments: done or not done, no excuses"],
    ["Review the scoreboard", "Learn from successes and failures; what moved the lead measure?"],
    ["Plan", "Each member makes 1–2 new commitments that will move the lead measure this week"],
  ];
  steps.forEach(([h, d], i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.75, 2.9, 1.85, i === 1 ? C.ink : C.mist);
    const dark = i === 1;
    numCircle(s, i + 1, x + 0.2, 1.9, 0.5, C.amber);
    s.addText(h, { x: x + 0.85, y: 1.9, w: 1.95, h: 0.5, fontFace: HF, fontSize: 14, bold: true, color: dark ? C.paper : C.ink, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: x + 0.2, y: 2.5, w: 2.5, h: 1.0, fontFace: BF, fontSize: 11.5, color: dark ? "DCE2EE" : C.slate, isTextBox: true, margin: 0, valign: "top" });
    if (i < 2) s.addText("›", { x: x + 2.85, y: 2.35, w: 0.3, h: 0.6, fontFace: HF, fontSize: 28, bold: true, color: C.amber, align: "center", isTextBox: true, margin: 0, valign: "middle" });
  });
  s.addText("Measures: session held every week (yes/no); % of commitments kept; week-on-week movement of the lead measure", { x: 0.5, y: 3.72, w: 9.0, h: 0.5, fontFace: BF, fontSize: 11.5, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText("Chapter 10 link: accountability is pushed to “the lowest organizational level capable of making timely, informed, competent decisions” (p. 318), and cross-unit coordination is achieved through a shared rhythm rather than more hierarchy (pp. 319–321).", { x: 0.5, y: 4.27, w: 9.0, h: 0.8, fontFace: BF, fontSize: 11.5, color: C.slate, isTextBox: true, margin: 0, valign: "top" });
  footer(s);
  s.addNotes("1.5 min. Discipline 4 is where execution actually happens. The WIG session is deliberately short and ritualised so that it survives the whirlwind. Commitments are personal and public. Chapter 10 discusses decentralised decision making and cross-unit coordination; the WIG session is a lightweight structural device that achieves both without adding hierarchy.");
}

// ---------------- 10. Dimensions & measures summary (Appendix 1 Q1-Q2) ----------------
{
  const s = pres.addSlide();
  title(s, "Dimensions and measures of the model (summary)");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.paper, fill: { color: C.ink }, fontFace: BF, fontSize: 12, valign: "middle", margin: 0.06 } });
  const cell = (t, i, bold = false) => ({ text: t, options: { fontFace: BF, fontSize: 11, color: bold ? C.ink : C.slate, bold, valign: "middle", margin: 0.06, fill: { color: i % 2 === 0 ? C.mist : C.paper } } });
  const rows = [
    [hdr("Dimension"), hdr("How it is defined"), hdr("Key measure"), hdr("Question it answers")],
    ["1. Wildly Important Goal", "1–2 goals per team, “from X to Y by when”, cascading to the organization’s WIG", "Number of WIGs; lag measure with baseline, target, deadline", "What matters most?"],
    ["2. Lead measures", "Activities that are predictive of the WIG and influenceable by the team", "Weekly count or % of the lead activity", "What must we do this week?"],
    ["3. Compelling scoreboard", "Simple, visible, shows lead and lag, tells at a glance if winning", "Scoreboard meets 4 criteria; updated weekly", "Are we winning?"],
    ["4. Cadence of accountability", "Weekly WIG session: account, review, commit", "Session held; % commitments kept", "Who does what by next week?"],
  ].map((r, i) => (i === 0 ? r : r.map((c, j) => cell(c, i, j === 0))));
  s.addTable(rows, { x: 0.5, y: 1.3, w: 9.0, colW: [2.0, 3.0, 2.3, 1.7], border: { type: "solid", color: C.line, pt: 0.75 }, rowH: [0.45, 0.7, 0.7, 0.7, 0.7] });
  s.addText("Source: McChesney, Covey & Huling (2012); FranklinCovey (2024).", { x: 0.5, y: 4.75, w: 9.0, h: 0.3, fontFace: BF, fontSize: 10, italic: true, color: C.slate, isTextBox: true, margin: 0 });
  footer(s);
  s.addNotes("1 min. This slide answers the first two questions in Appendix 1 of the course outline: what are the most important dimensions and measures, and how are they defined. Keep it as a reference slide; do not read it aloud line by line.");
}

// ---------------- 11. Correlation with Chapter 10 ----------------
{
  const s = pres.addSlide();
  title(s, "How 4DX operationalizes Chapter 10");
  const rows = [
    ["Chapter 10 action (Fig. 10.2, p. 299)", "What the chapter says", "What 4DX adds"],
    ["1. Staffing the organization", "Assemble “a critical mass of talented managers who can function as agents of change” (p. 301); recruit, train, retain", "Weekly WIG sessions make performance visible: leaders see who delivers commitments and who needs coaching or reassignment"],
    ["2. Building resources & capabilities", "Capabilities grow through learning by doing, “a multistage process … over months and years” (p. 305); execution capabilities are hard to imitate (p. 308)", "Lead measures are the routines that become capabilities; repeating them weekly institutionalizes the competence"],
    ["3. Structuring the organization & work effort", "Match structure to strategy; delegate to the lowest competent level (p. 318); coordinate across units (pp. 319–321)", "Teams own their WIG and lead measures; cascading WIGs create cross-unit alignment without new hierarchy"],
  ];
  s.addTable(
    rows.map((r, i) =>
      r.map((c, j) => ({
        text: c,
        options: {
          fontFace: BF, fontSize: i === 0 ? 12 : 11, bold: i === 0 || j === 0, color: i === 0 ? C.paper : j === 0 ? C.ink : C.slate,
          fill: { color: i === 0 ? C.ink : j === 2 ? "FFF4E0" : i % 2 === 0 ? C.mist : C.paper }, valign: "middle", margin: 0.07,
        },
      }))
    ),
    { x: 0.5, y: 1.3, w: 9.0, colW: [2.2, 3.4, 3.4], border: { type: "solid", color: C.line, pt: 0.75 }, rowH: [0.45, 0.9, 0.9, 0.9] }
  );
  s.addText("Chapter 10 defines the organizational conditions for execution; 4DX supplies the weekly behaviour that uses them.", { x: 0.5, y: 4.72, w: 9.0, h: 0.4, fontFace: BF, fontSize: 12, italic: true, color: C.ink, isTextBox: true, margin: 0 });
  footer(s);
  s.addNotes("1.5 min. Walk the three rows. The strongest link is row 2: Chapter 10 says superior strategy execution capabilities are 'the only source of sustainable competitive advantage when strategies are easy for rivals to copy' (p. 308). 4DX is a method for building exactly that kind of socially complex, hard-to-copy execution capability.");
}

// ---------------- 12. International business benefits (Appendix 1 Q3) ----------------
{
  const s = pres.addSlide();
  title(s, "Benefits in the context of international business");
  const b = [
    ["Focus across borders", "The two-WIG rule stops initiative overload in matrix and multi-country organizations; every subsidiary aligns on the few goals that matter globally."],
    ["Common execution language", "Lead measures and scoreboards translate across cultures; Jakarta and Dubai can be compared on the same behaviours."],
    ["Accountability at a distance", "A 20-minute weekly WIG session works virtually and across time zones, a light governance rhythm for dispersed teams."],
    ["Global alignment, local fit", "Headquarters sets the lag measure; each country team chooses its own lead measures using local market knowledge."],
  ];
  b.forEach(([h, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.3 + row * 1.55;
    card(s, x, y, 4.4, 1.4);
    numCircle(s, i + 1, x + 0.15, y + 0.15, 0.45);
    s.addText(h, { x: x + 0.75, y: y + 0.12, w: 3.5, h: 0.45, fontFace: HF, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: x + 0.2, y: y + 0.6, w: 4.05, h: 0.75, fontFace: BF, fontSize: 11.5, color: C.slate, isTextBox: true, margin: 0, valign: "top" });
  });
  card(s, 0.5, 4.4, 9.0, 0.65, C.ink);
  s.addText([
    { text: "Reported results: ", options: { bold: true, color: C.amber } },
    { text: "Whirlpool +USD 5.7 m incremental in the first 90 days; DeKalb Medical patient satisfaction from the 3rd to the 99th percentile (FranklinCovey, 2024). Note: vendor-reported, not independently audited.", options: { color: C.paper } },
  ], { x: 0.7, y: 4.4, w: 8.6, h: 0.65, fontFace: BF, fontSize: 11.5, isTextBox: true, margin: 0, valign: "middle" });
  footer(s);
  s.addNotes("2 min. This answers the third Appendix 1 question. Connect to Chapter 10's point that the multidivisional structure is common in international firms (p. 315) and that it inhibits cross-business coordination; cascading WIGs are one answer. Be honest that the results quoted are FranklinCovey's own case studies.");
}

// ---------------- 13. Illustrative application ----------------
{
  const s = pres.addSlide();
  title(s, "Illustration: Indonesian firm expanding to ASEAN", { size: 22 });
  s.addText("Hypothetical example: a Jakarta-based FMCG producer entering Vietnam and the Philippines. Strategy chosen (Ch. 7); Chapter 10 asks whether the organization can execute it.", { x: 0.5, y: 1.2, w: 9.0, h: 0.5, fontFace: BF, fontSize: 11.5, color: C.slate, isTextBox: true, margin: 0 });
  const levels = [
    ["Corporate WIG", "Grow ASEAN export revenue from USD 12 m to USD 30 m by Dec 2028", C.ink, C.paper],
    ["Country team WIG (Vietnam)", "Lift distributor on-time delivery from 82% to 95% by Dec 2027", C.ink2, C.paper],
    ["Lead measures (weekly)", "% of orders confirmed to forwarder within 24 h  •  Number of distributor visits by sales reps  •  Customs documents error-free on first submission", C.amber, C.ink],
    ["Scoreboard + WIG session", "One shared board per country team; 20-minute Monday call across Jakarta, Ho Chi Minh City and Manila", C.mist, C.ink],
  ];
  levels.forEach(([h, d, fill, color], i) => {
    const y = 1.75 + i * 0.82;
    const w = 9.0 - i * 0.0;
    s.addShape(pres.ShapeType.roundRect, { x: 0.5, y, w, h: 0.72, fill: { color: fill }, line: { color: fill }, rectRadius: 0.06 });
    s.addText(h, { x: 0.7, y, w: 2.5, h: 0.72, fontFace: HF, fontSize: 13, bold: true, color, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(d, { x: 3.2, y, w: 6.1, h: 0.72, fontFace: BF, fontSize: 11.5, color, isTextBox: true, margin: 0, valign: "middle" });
  });
  footer(s);
  s.addNotes("1.5 min. Make it concrete with a hypothetical case (state clearly it is illustrative). Show the cascade: corporate WIG, country WIG, weekly lead measures, scoreboard and cadence. Point out how each Chapter 10 action appears: staffing (who sits in the Monday call), capabilities (customs documentation proficiency built by repetition), structure (country team owns its lead measures; headquarters owns the lag).");
}

// ---------------- 14. Critical assessment ----------------
{
  const s = pres.addSlide();
  title(s, "Critical assessment of 4DX");
  card(s, 0.5, 1.3, 4.4, 3.75, C.mist);
  s.addText("Strengths", { x: 0.75, y: 1.4, w: 3.9, h: 0.45, fontFace: HF, fontSize: 18, bold: true, color: C.green, isTextBox: true, margin: 0 });
  bullets(s, [
    "Simple, teachable, works at frontline level",
    "Solves the ‘whirlwind’ problem that most planning tools ignore",
    "Builds execution capability, the hardest-to-copy advantage (Ch. 10, p. 308)",
    "Compatible with OKR, Balanced Scorecard and Hoshin Kanri as the weekly engine",
  ], 0.75, 1.95, 3.9, 3.0, { size: 12.5 });
  card(s, 5.1, 1.3, 4.4, 3.75, C.ink);
  s.addText("Limitations", { x: 5.35, y: 1.4, w: 3.9, h: 0.45, fontFace: HF, fontSize: 18, bold: true, color: C.amber, isTextBox: true, margin: 0 });
  bullets(s, [
    "Silent on strategy content: it executes a poor strategy just as faithfully",
    "Evidence base is mostly vendor case studies, not independent research",
    "Weekly cadence can decay into ritual reporting",
    "In high power-distance cultures (incl. Indonesia), admitting missed commitments in public needs psychological safety",
    "WIGs must be re-set when the environment shifts (Ch. 3), or discipline serves an outdated goal",
  ], 5.35, 1.95, 3.9, 3.05, { size: 12, color: "DCE2EE", gap: 5 });
  footer(s);
  s.addNotes("1.5 min. The rubric rewards critical evaluation, so be explicit. Position 4DX downstream of the analysis in Chapters 3-8: it is an execution engine, not a strategy engine. Raise the cultural point for Indonesian firms and invite discussion.");
}

// ---------------- 15. Takeaways + references ----------------
{
  const s = pres.addSlide();
  s.background = { color: C.ink };
  title(s, "Key takeaways", { color: C.paper });
  const t = [
    "Execution, not strategy, is the number-one management challenge (Ch. 10, p. 295).",
    "Chapter 10 builds the organization: people, capabilities, structure. 4DX makes that organization act, week by week.",
    "Four dimensions, each with a measurable discipline: WIG, lead measures, scoreboard, cadence.",
    "For international firms: focus, a common language, remote accountability, and local adaptation within global alignment.",
  ];
  t.forEach((x, i) => {
    numCircle(s, i + 1, 0.5, 1.3 + i * 0.72, 0.5);
    s.addText(x, { x: 1.2, y: 1.3 + i * 0.72, w: 8.3, h: 0.5, fontFace: BF, fontSize: 14, color: C.paper, isTextBox: true, margin: 0, valign: "middle" });
  });
  s.addText("References", { x: 0.5, y: 4.2, w: 9.0, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: C.amber, isTextBox: true, margin: 0 });
  s.addText([
    { text: "FranklinCovey. (2024). The 4 Disciplines of Execution®. https://www.franklincovey.com/the-4-disciplines/", options: { breakLine: true } },
    { text: "McChesney, C., Covey, S., & Huling, J. (2012). The 4 Disciplines of Execution: Achieving Your Wildly Important Goals. New York: Free Press.", options: { breakLine: true } },
    { text: "Thompson, A. A., Peteraf, M. A., Gamble, J. E., & Strickland, A. J. (2024). Crafting & Executing Strategy: The Quest for Competitive Advantage (2024 Release), Ch. 10, pp. 294–325. McGraw Hill." },
  ], { x: 0.5, y: 4.45, w: 9.0, h: 0.75, fontFace: BF, fontSize: 9.5, color: "CBD3E3", isTextBox: true, margin: 0, valign: "top" });
  s.addNotes("1 min. Close with the four takeaways and open the floor for questions from the non-presenting groups (their questions count toward participation marks).");
}

const out = process.argv[2] || "deck.pptx";
pres.writeFile({ fileName: out }).then(() => console.log("wrote", out));
