/* Dashboard IDX Swing Engine: login, tabel screener, detail (grafik, rencana, sentimen). Vanilla JS. */
const $ = (s) => document.querySelector(s);
const fmt = new Intl.NumberFormat("id-ID");
const fmtRp = (v) => (v == null ? "-" : "Rp " + fmt.format(Math.round(v)));
const num = (v, d = 1) => (v == null || Number.isNaN(v) ? "-" : Number(v).toFixed(d));
let screenData = null, currentTicker = null, chart = null, rsiChart = null;

async function api(path, opts = {}) {
  const r = await fetch(path, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...opts });
  if (r.status === 401) { showLogin(true); throw new Error("perlu login"); }
  if (!r.ok) { const e = await r.json().catch(() => ({ detail: r.statusText })); throw new Error(e.detail || r.statusText); }
  return r.json();
}

function showLogin(show) { $("#login").classList.toggle("hidden", !show); }

async function init() {
  const h = await fetch("/api/health").then((r) => r.json());
  $("#logout").classList.toggle("hidden", !h.auth_required);
  if (h.auth_required && !h.authed) { showLogin(true); return; }
  showLogin(false);
  renderStatus(h);
  await loadScreen(false);
  setInterval(async () => { renderStatus(await fetch("/api/health").then((r) => r.json())); loadScreen(false); }, 60000);
}

function renderStatus(h) {
  const phase = { closed: "bursa tutup", pre_opening: "pre-opening", session_1: "sesi I", break: "istirahat", session_2: "sesi II", pre_closing: "pre-closing", post_trading: "post-trading" }[h.market_phase] || h.market_phase;
  const last = h.last_run ? new Date(h.last_run * 1000).toLocaleTimeString("id-ID") : "-";
  $("#status").textContent = `${phase} · data ${h.data_source} · refresh terakhir ${last}${h.running ? " · menghitung…" : ""}${h.error ? " · error: " + h.error : ""}`;
}

async function loadScreen(force) {
  $("#refresh").disabled = true;
  try {
    screenData = await api(`/api/screen${force ? "?refresh=1" : ""}`);
    renderScreen();
  } catch (e) { $("#screenMeta").textContent = e.message; }
  finally { $("#refresh").disabled = false; }
}

function scoreClass(s, pass) { if (!pass) return "none"; return s >= 70 ? "hi" : s >= 55 ? "mid" : "lo"; }

function renderScreen() {
  if (!screenData) return;
  const onlyPass = $("#onlyPass").checked;
  const rows = (screenData.all || []).filter((a) => !onlyPass || a.passed_gates);
  const tb = $("#screenTable tbody"); tb.innerHTML = "";
  $("#screenMeta").textContent = `${screenData.analyzed}/${screenData.universe_size} saham · data s.d. ${screenData.data_date} · ${(screenData.candidates || []).length} kandidat (skor ≥ 60)`;
  if (!rows.length) { tb.innerHTML = `<tr><td colspan="10" class="muted">Tidak ada saham yang lolos gerbang tren hari ini. Itu informasi, bukan kegagalan: dalam pasar lemah, tidak trading adalah posisi. Matikan filter untuk melihat skor potensial.</td></tr>`; return; }
  for (const a of rows) {
    const tr = document.createElement("tr");
    tr.dataset.ticker = a.ticker;
    if (a.ticker === currentTicker) tr.classList.add("active");
    const c = a.components || {};
    const bar = (v, max) => `<span class="bar" style="width:${Math.max(0, (v / max) * 40)}px"></span>${num(v, 0)}`;
    tr.innerHTML = `<td class="ticker">${a.ticker}</td><td>${fmt.format(a.close)}</td>
      <td><span class="score ${scoreClass(a.passed_gates ? a.score : a.raw_score, a.passed_gates)}">${num(a.passed_gates ? a.score : a.raw_score, 0)}</span></td>
      <td>${a.setup}</td><td>${bar(c.trend, 30)}</td><td>${bar(c.momentum, 25)}</td><td>${bar(c.volume, 20)}</td><td>${bar(c.volatility, 15)}</td><td>${num(c.candle, 0)}</td>
      <td>${a.passed_gates ? '<span class="pill ok">lolos</span>' : `<span class="pill fail" title="${(a.gate_failures || []).join("\n")}">${(a.gate_failures || [])[0] || "-"}</span>`}</td>`;
    tr.onclick = () => openDetail(a.ticker);
    tb.appendChild(tr);
  }
}

async function openDetail(ticker) {
  currentTicker = ticker.toUpperCase();
  document.querySelectorAll("#screenTable tbody tr").forEach((r) => r.classList.toggle("active", r.dataset.ticker === currentTicker));
  const det = $("#detail"); det.classList.remove("hidden");
  $("#dTicker").textContent = currentTicker; $("#dCompany").textContent = ""; $("#dBadges").innerHTML = "";
  $("#news").innerHTML = '<li class="muted">memuat berita…</li>'; $("#sentBadge").textContent = ""; $("#sentMeta").textContent = "";
  det.scrollIntoView({ behavior: "smooth", block: "start" });
  const equity = Number($("#equity").value) || 0;
  try {
    const [a, ch] = await Promise.all([api(`/api/analyze/${currentTicker}?equity=${equity}`), api(`/api/chart/${currentTicker}`)]);
    renderAnalysis(a);
    try { renderChart(ch, a); } catch (err) { $("#chart").innerHTML = `<p class="muted small">grafik tidak bisa dimuat: ${err.message}</p>`; }
  } catch (e) { $("#dBadges").innerHTML = `<span class="badge bad">${e.message}</span>`; return; }
  api(`/api/news/${currentTicker}`).then(renderNews).catch((e) => { $("#news").innerHTML = `<li class="muted">${e.message}</li>`; });
}

function renderAnalysis(a) {
  $("#dCompany").textContent = a.company || "";
  const badges = [];
  badges.push(`<span class="badge ${a.passed_gates ? "good" : "bad"}">${a.passed_gates ? "lolos gerbang" : "tidak lolos gerbang"}</span>`);
  badges.push(`<span class="badge">skor ${num(a.passed_gates ? a.score : a.raw_score, 0)}${a.passed_gates ? "" : " (potensial)"}</span>`);
  badges.push(`<span class="badge">setup: ${a.setup}</span>`);
  badges.push(`<span class="badge">Impulse: ${a.indicators.impulse}</span>`);
  badges.push(`<span class="badge">Weinstein stage ${a.indicators.stage ?? "-"}</span>`);
  badges.push(`<span class="badge">Minervini ${a.indicators.minervini_template}</span>`);
  for (const p of a.patterns_bullish) badges.push(`<span class="badge good">${p}</span>`);
  for (const p of a.patterns_bearish) badges.push(`<span class="badge bad">${p}</span>`);
  $("#dBadges").innerHTML = badges.join("");
  const p = a.plan;
  const plan = p ? [
    ["Entry (buy-stop)", fmtRp(p.entry)], ["Stop loss", `${fmtRp(p.stop)} (−${num(p.risk_pct * 100, 1)}%)`],
    ["Target 1 (2R)", fmtRp(p.target1)], ["Target 2 (3R)", fmtRp(p.target2)], ["Risiko / lembar", fmtRp(p.risk_per_share)],
    ["Lot (risiko 1% modal)", `${p.lots} lot = ${fmtRp(p.position_value)}`], ["Risiko nominal", fmtRp(p.risk_amount)],
    ["ARB / ARA besok", `${fmtRp(p.arb)} / ${fmtRp(p.ara)}`], ["Time-stop", `${p.time_stop_days} hari bursa`],
  ] : [["-", "stop tidak bisa dihitung"]];
  $("#planTable").innerHTML = plan.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  const i = a.indicators;
  const ind = [
    ["Close", fmtRp(a.close)], ["SMA 20 / 50 / 150", `${num(i.sma20, 0)} / ${num(i.sma50, 0)} / ${num(i.sma150, 0)}`],
    ["RSI 14", num(i.rsi14)], ["MACD / sinyal / hist", `${num(i.macd)} / ${num(i.macd_signal)} / ${num(i.macd_hist)}`],
    ["ADX / +DI / −DI", `${num(i.adx, 0)} / ${num(i.plus_di, 0)} / ${num(i.minus_di, 0)}`], ["ATR 14", `${num(i.atr14, 0)} (${num(i.atr_pct)}%)`],
    ["Bollinger %b / bandwidth pctl", `${num(i.pct_b, 2)} / ${num(i.bandwidth_pctile, 0)}%`], ["Stochastic %K", num(i.stoch_k, 0)],
    ["Volume vs rata-rata 50h", `${num(i.vol_ratio, 2)}×`], ["Nilai transaksi rata-rata 20h", fmtRp(i.value_avg20_idr)],
    ["Jarak ke high 52 minggu", `${num(i.dist_high52_pct)}%`], ["RS vs IHSG (63 hari)", num(i.rs63, 2)], ["Chandelier exit", fmtRp(i.chandelier)],
  ];
  $("#indTable").innerHTML = ind.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  const li = (arr, empty) => (arr.length ? arr.map((x) => `<li>${x}</li>`).join("") : `<li class="muted">${empty}</li>`);
  $("#reasons").innerHTML = li([...(a.passed_gates ? [] : a.gate_failures.map((g) => "GERBANG: " + g)), ...a.reasons], "-");
  $("#warnings").innerHTML = li(a.warnings, "tidak ada");
  $("#exits").innerHTML = li(a.exit_signals, "tidak ada sinyal keluar");
}

function renderNews(s) {
  $("#sentBadge").textContent = `${s.label} (${s.score > 0 ? "+" : ""}${num(s.score, 2)})`;
  $("#sentBadge").className = `badge ${s.label === "positif" ? "good" : s.label === "negatif" ? "bad" : ""}`;
  $("#sentMeta").textContent = `${s.n_items} berita 14 hari terakhir · ${s.n_positive} positif · ${s.n_negative} negatif · metode: ${s.method === "llm" ? "Claude" : "leksikon"}`;
  $("#news").innerHTML = s.items.length ? s.items.map((n) => `<li><span class="s ${n.label}">${n.score > 0 ? "+" : ""}${num(n.score, 2)}</span><a href="${n.link}" target="_blank" rel="noopener">${n.title}</a> <span class="muted small">· ${n.source || ""} · ${new Date(n.published).toLocaleDateString("id-ID")}</span></li>`).join("") : '<li class="muted">tidak ada berita ditemukan</li>';
}

function renderChart(d, a) {
  const el = $("#chart"), elR = $("#chartRsi");
  if (chart) { chart.remove(); chart = null; } if (rsiChart) { rsiChart.remove(); rsiChart = null; }
  const opts = { layout: { background: { color: "#161b24" }, textColor: "#8a94a6" }, grid: { vertLines: { color: "#1f2735" }, horzLines: { color: "#1f2735" } }, rightPriceScale: { borderColor: "#273041" }, timeScale: { borderColor: "#273041" }, crosshair: { mode: 0 } };
  chart = LightweightCharts.createChart(el, { ...opts, width: el.clientWidth, height: el.clientHeight });
  const candles = chart.addCandlestickSeries({ upColor: "#3ddc97", downColor: "#ff6b6b", wickUpColor: "#3ddc97", wickDownColor: "#ff6b6b", borderVisible: false });
  candles.setData(d.dates.map((t, i) => ({ time: t, open: d.open[i], high: d.high[i], low: d.low[i], close: d.close[i] })));
  const vol = chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "vol" });
  chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
  vol.setData(d.dates.map((t, i) => ({ time: t, value: d.volume[i], color: d.close[i] >= d.open[i] ? "rgba(61,220,151,.4)" : "rgba(255,107,107,.4)" })));
  const line = (key, color, width = 1, style = 0) => { const s = chart.addLineSeries({ color, lineWidth: width, lineStyle: style, priceLineVisible: false, lastValueVisible: false }); s.setData(d.dates.map((t, i) => ({ time: t, value: d[key][i] })).filter((p) => p.value != null)); };
  line("sma20", "#ffc857"); line("sma50", "#5aa9ff", 2); line("sma150", "#c084fc", 2); line("bb_upper", "#4b5563", 1, 2); line("bb_lower", "#4b5563", 1, 2); line("chandelier", "#ff6b6b", 1, 1);
  if (a.plan) {
    const mark = (price, color, title) => candles.createPriceLine({ price, color, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title });
    mark(a.plan.entry, "#5aa9ff", "entry"); mark(a.plan.stop, "#ff6b6b", "stop"); mark(a.plan.target1, "#3ddc97", "2R"); mark(a.plan.target2, "#3ddc97", "3R");
  }
  chart.timeScale().fitContent();
  rsiChart = LightweightCharts.createChart(elR, { ...opts, width: elR.clientWidth, height: elR.clientHeight });
  const rsi = rsiChart.addLineSeries({ color: "#ffc857", lineWidth: 1, priceLineVisible: false });
  rsi.setData(d.dates.map((t, i) => ({ time: t, value: d.rsi14[i] })).filter((p) => p.value != null));
  [30, 50, 70].forEach((v) => rsi.createPriceLine({ price: v, color: "#3b4252", lineWidth: 1, lineStyle: 2, axisLabelVisible: false }));
  rsiChart.timeScale().fitContent();
  const sync = (src, dst) => src.timeScale().subscribeVisibleLogicalRangeChange((r) => r && dst.timeScale().setVisibleLogicalRange(r));
  sync(chart, rsiChart); sync(rsiChart, chart);
  window.onresize = () => { chart.applyOptions({ width: el.clientWidth }); rsiChart.applyOptions({ width: elR.clientWidth }); };
}

$("#loginForm").onsubmit = async (e) => {
  e.preventDefault(); $("#loginError").textContent = "";
  try { await api("/api/login", { method: "POST", body: JSON.stringify({ password: $("#password").value }) }); showLogin(false); init(); }
  catch (err) { $("#loginError").textContent = err.message; }
};
$("#logout").onclick = async () => { await api("/api/logout", { method: "POST" }); location.reload(); };
$("#refresh").onclick = () => loadScreen(true);
$("#onlyPass").onchange = renderScreen;
$("#lookupForm").onsubmit = (e) => { e.preventDefault(); const t = $("#lookup").value.trim(); if (t) openDetail(t); };
$("#equity").onchange = () => { if (currentTicker) openDetail(currentTicker); };
init();
