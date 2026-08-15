/* ============================================================
   OTM Study Hub — App Logic
   SPA sederhana berbasis hash routing. Progres (sesi selesai,
   penguasaan flashcard, skor kuis, catatan) disimpan di
   localStorage browser.
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.OTM_DATA;
  const app = document.getElementById("app");
  const nav = document.getElementById("mainNav");

  /* ---------- penyimpanan aman (fallback in-memory) ---------- */
  const mem = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("otm_" + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in mem ? mem[key] : fallback;
      }
    },
    set(key, value) {
      mem[key] = value;
      try { localStorage.setItem("otm_" + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    }
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  function today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function parseDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function daysUntil(iso) {
    return Math.round((parseDate(iso) - today()) / 86400000);
  }

  /* ---------- helper data ---------- */
  const sessionsWithCards = () => [...new Set(DATA.flashcards.map((c) => c.session))];
  const sessionsWithQuiz = () => DATA.quizzes.map((q) => q.session);
  const getSession = (id) => DATA.sessions.find((s) => s.id === id);

  function nextSession() {
    return DATA.sessions.find((s) => daysUntil(s.date) >= 0) || DATA.sessions[DATA.sessions.length - 1];
  }

  /* ============================================================
     VIEWS
     ============================================================ */

  function viewDashboard() {
    const c = DATA.course;
    const done = store.get("done_sessions", []);
    const ns = nextSession();
    const dd = daysUntil(ns.date);
    const nsDate = parseDate(ns.date);
    const mastered = store.get("fc_mastered", []);
    const bestScores = store.get("quiz_best", {});
    const best1 = bestScores["1"];

    const countdownText = dd === 0 ? "Hari ini!" : dd === 1 ? "Besok" : `${dd} hari lagi`;

    return `
    <div class="view">
      <section class="hero">
        <p class="eyebrow">${esc(c.semester)} · ${esc(c.codes)}</p>
        <h1>Operations &amp; Technology <em>Management</em></h1>
        <p>Teman belajarmu untuk 12 sesi ke depan — rangkuman materi, flashcards, kuis, kalkulator produktivitas,
        dan catatan pribadi, semuanya dari materi kuliah di folder Drive <strong>"Semester 2 - MBA UGM"</strong>.</p>
        <div class="hero-meta">
          <span class="chip chip--gold">Dosen: ${esc(c.lecturer.name)}</span>
          <span class="chip">Kode kelas: ${esc(c.classCode)}</span>
          <span class="chip">${esc(c.program)}</span>
        </div>
      </section>

      <div class="grid grid--dash">
        <div class="stack">
          <section class="card card-pad">
            <h3>Sesi berikutnya</h3>
            <div class="next-session">
              <div class="date-block">
                <div class="d">${nsDate.getDate()}</div>
                <div class="m">${MONTHS_ID[nsDate.getMonth()]}</div>
              </div>
              <div>
                <h4>Sesi ${ns.id} — ${esc(ns.topic)}</h4>
                <div class="muted">${ns.readings.length ? "Bacaan: " + esc(ns.readings.join(" · ")) : "Tanpa bacaan wajib"}</div>
                ${ns.caseStudy ? `<div class="muted">${esc(ns.caseStudy)}</div>` : ""}
                <span class="countdown-pill">⏳ ${countdownText}</span>
              </div>
            </div>
          </section>

          <section class="card card-pad">
            <h3>Progres belajarmu</h3>
            <div class="stat-row">
              <div class="stat"><div class="n">${done.length}<span style="font-size:0.9rem;color:var(--ink-faint)">/12</span></div><div class="l">Sesi selesai</div></div>
              <div class="stat"><div class="n">${mastered.length}<span style="font-size:0.9rem;color:var(--ink-faint)">/${DATA.flashcards.length}</span></div><div class="l">Kartu dikuasai</div></div>
              <div class="stat"><div class="n">${best1 != null ? best1 + "%" : "—"}</div><div class="l">Skor kuis terbaik</div></div>
            </div>
          </section>

          <section class="card card-pad">
            <h3>Tujuan pembelajaran</h3>
            <ol class="obj-list">${c.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>
          </section>
        </div>

        <div class="stack">
          <section class="card card-pad">
            <h3>Komponen penilaian</h3>
            ${c.assessment.map((a) => `
              <div class="assess-row">
                <span class="assess-label">${esc(a.label)}</span>
                <span class="assess-weight">${a.weight}%</span>
                <span class="assess-bar"><i style="width:${a.weight * 2.5}%"></i></span>
              </div>`).join("")}
          </section>

          <section class="card card-pad">
            <h3>Referensi utama</h3>
            <ul class="ref-list">
              ${c.references.map((r) => `<li><span class="ref-code">${esc(r.code)}</span><span>${esc(r.text)}</span></li>`).join("")}
            </ul>
          </section>

          <section class="card card-pad">
            <h3>Materi di Google Drive</h3>
            <ul class="link-list">
              ${c.driveLinks.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a> <span class="ext">↗</span></li>`).join("")}
            </ul>
          </section>
        </div>
      </div>
    </div>`;
  }

  function viewSilabus() {
    const done = store.get("done_sessions", []);
    return `
    <div class="view">
      <p class="eyebrow">Course Plan S51A</p>
      <h1 class="view-title">Silabus &amp; Jadwal 12 Sesi</h1>
      <p class="view-sub">Klik "Tandai selesai" setelah kamu mempelajari materi sesi tersebut. Sesi dengan tanggal
      yang sudah lewat ditandai otomatis pada garis waktu.</p>
      <div class="timeline">
        ${DATA.sessions.map((s) => {
          const isDone = done.includes(s.id);
          const isPast = daysUntil(s.date) < 0;
          return `
          <article class="card session-card ${isDone ? "done" : ""} ${isPast ? "past" : ""}">
            <div class="session-head">
              <span class="session-num">Sesi ${String(s.id).padStart(2, "0")}</span>
              <div class="session-title-wrap">
                <div class="session-title">${esc(s.topic)}</div>
                <div class="session-date">${esc(s.dateLabel)}${isPast && !isDone ? " · sudah lewat" : ""}</div>
              </div>
              <div class="session-actions">
                ${s.summary ? `<a class="btn btn--small btn--gold" href="#/materi/${s.id}">Buka materi</a>` : ""}
                <button class="btn btn--small ${isDone ? "btn--green" : ""}" data-toggle-done="${s.id}">
                  ${isDone ? "✓ Selesai" : "Tandai selesai"}
                </button>
              </div>
            </div>
            <div class="session-body">
              ${s.subtopics.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
              ${s.readings.map((r) => `<span class="tag tag--reading">📖 ${esc(r)}</span>`).join("")}
              ${s.caseStudy ? `<span class="tag tag--case">💼 ${esc(s.caseStudy)}</span>` : ""}
            </div>
          </article>`;
        }).join("")}
      </div>
    </div>`;
  }

  function sessionPicker(activeId, availableIds, hashPrefix) {
    return `<div class="session-picker">
      ${DATA.sessions.map((s) => `
        <button data-goto="${hashPrefix}/${s.id}"
          class="${s.id === activeId ? "active" : ""} ${availableIds.includes(s.id) ? "has-content" : ""}"
          title="Sesi ${s.id}: ${esc(s.topic)}">${s.id}</button>`).join("")}
    </div>`;
  }

  /* ---------- Diagram visual untuk materi ---------- */
  const VISUALS = {
    inputTransform() {
      return `<figure class="visual-block">
        <div class="flowviz">
          <div class="flow-box">
            <div class="flow-tag">Input</div>
            <div class="flow-main">Transformed resources</div>
            <div class="flow-sub">Material · Informasi · Pelanggan<br>+ fasilitas &amp; staf</div>
          </div>
          <div class="flow-arrow" aria-hidden="true">→</div>
          <div class="flow-box flow-box--dark">
            <div class="flow-tag">Transformation</div>
            <div class="flow-main">Proses transformasi</div>
            <div class="flow-sub">menciptakan nilai (create value)</div>
          </div>
          <div class="flow-arrow" aria-hidden="true">→</div>
          <div class="flow-box">
            <div class="flow-tag">Output</div>
            <div class="flow-main">Produk &amp; Jasa</div>
            <div class="flow-sub">memenuhi kebutuhan pelanggan</div>
          </div>
        </div>
        <figcaption>Model input–transformation–output — inti dari semua operasi</figcaption>
      </figure>`;
    },

    fourVs() {
      const rows = [
        ["Volume", 88, "biaya turun saat volume <b>tinggi</b>"],
        ["Variety", 12, "biaya turun saat variety <b>rendah</b>"],
        ["Variation", 12, "biaya turun saat variation <b>rendah</b>"],
        ["Visibility", 12, "biaya turun saat visibility <b>rendah</b>"]
      ];
      return `<figure class="visual-block">
        <div class="vv-wrap">
          ${rows.map(([label, pos, note]) => `
          <div class="vv-row">
            <span class="vv-label">${label}</span>
            <span class="vv-end">Rendah</span>
            <div class="vv-track"><i style="left:${pos}%"></i></div>
            <span class="vv-end">Tinggi</span>
            <span class="vv-note">${note}</span>
          </div>`).join("")}
        </div>
        <figcaption>The Four Vs — titik emas menunjukkan konfigurasi berbiaya rendah (gaya hotelF1); kebalikannya bergaya Ski Verbier Exclusive</figcaption>
      </figure>`;
    },

    perfObjectives() {
      const axes = ["Quality", "Speed", "Dependability", "Flexibility", "Cost"];
      const taxi = [0.7, 0.9, 0.6, 0.9, 0.35];
      const bus = [0.6, 0.45, 0.8, 0.3, 0.95];
      const cx = 150, cy = 128, R = 88;
      const pt = (i, r) => {
        const a = (-90 + i * 72) * Math.PI / 180;
        return [cx + Math.cos(a) * r * R, cy + Math.sin(a) * r * R];
      };
      const poly = (v) => v.map((r, i) => pt(i, r).map((n) => n.toFixed(1)).join(",")).join(" ");
      const rings = [0.33, 0.66, 1].map((r) => `<polygon class="radar-ring" points="${poly([r, r, r, r, r])}"></polygon>`).join("");
      const spokes = axes.map((_, i) => {
        const [x, y] = pt(i, 1);
        return `<line class="radar-ring" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
      }).join("");
      const labels = axes.map((a, i) => {
        const [x, y] = pt(i, 1.24);
        return `<text class="radar-label" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${a}</text>`;
      }).join("");
      return `<figure class="visual-block">
        <svg viewBox="0 0 300 270" role="img" aria-label="Polar diagram lima performance objectives: taksi vs bus">
          ${rings}${spokes}
          <polygon class="radar-poly radar-poly--a" points="${poly(taxi)}"></polygon>
          <polygon class="radar-poly radar-poly--b" points="${poly(bus)}"></polygon>
          ${labels}
        </svg>
        <div class="viz-legend">
          <span><i class="lg-dot lg-dot--gold"></i> Taksi — unggul speed &amp; flexibility</span>
          <span><i class="lg-dot lg-dot--ink"></i> Bus — unggul cost &amp; dependability</span>
        </div>
        <figcaption>Polar diagram — makin jauh dari pusat, makin penting objective tersebut bagi operasi itu</figcaption>
      </figure>`;
    },

    strategyPerspectives() {
      return `<figure class="visual-block">
        <div class="persp-grid">
          <div class="persp-cell persp-cell--v">
            <b>Top-down</b><span>strategi korporat → bisnis → fungsional</span><i>↓</i>
          </div>
          <div class="persp-cell persp-cell--h">
            <b>Outside-in</b><span>kebutuhan pasar: order winners &amp; qualifiers</span><i>→</i>
          </div>
          <div class="persp-center">Operations<br>Strategy</div>
          <div class="persp-cell persp-cell--h">
            <i>←</i><b>Inside-out</b><span>kapabilitas sumber daya &amp; proses</span>
          </div>
          <div class="persp-cell persp-cell--v">
            <i>↑</i><b>Bottom-up</b><span>pengalaman operasional sehari-hari</span>
          </div>
        </div>
        <figcaption>Empat perspektif yang bersama-sama membentuk isi operations strategy (SBB)</figcaption>
      </figure>`;
    },

    importancePerformance() {
      return `<figure class="visual-block">
        <div class="mx-wrap">
          <div class="mx-ylabel">Kinerja vs kompetitor ↑</div>
          <div class="mx-grid">
            <div class="mx-cell mx-neutral"><b>Excess?</b><span>kinerja tinggi tapi tak penting — alihkan sumber daya?</span></div>
            <div class="mx-cell mx-good"><b>Appropriate</b><span>di atas batas layak — pertahankan</span></div>
            <div class="mx-cell mx-warn"><b>Improve</b><span>di bawah batas layak — kandidat perbaikan</span></div>
            <div class="mx-cell mx-bad"><b>Urgent action</b><span>penting bagi pelanggan tapi kalah dari kompetitor — perbaiki segera</span></div>
          </div>
          <div class="mx-xlabel">Kepentingan bagi pelanggan →</div>
        </div>
        <figcaption>Importance–performance matrix — memprioritaskan faktor kompetitif mana yang harus diperbaiki dulu</figcaption>
      </figure>`;
    },

    competitiveAdvantage() {
      return `<figure class="visual-block">
        <div class="adv-cards">
          <div class="adv-card"><div class="adv-ico">◆</div><b>Differentiation</b><span>lebih baik / berbeda</span><em>Disney · Hard Rock Cafe · Safeskin</em></div>
          <div class="adv-card"><div class="adv-ico">▼</div><b>Cost leadership</b><span>lebih murah, bukan kualitas rendah</span><em>Southwest · Walmart · Colruyt</em></div>
          <div class="adv-card"><div class="adv-ico">⚡</div><b>Response</b><span>flexibility · reliability · timeliness</span><em>HP · Pizza Hut · Motorola</em></div>
        </div>
        <figcaption>Tiga jalan mencapai competitive advantage melalui operasi (HRM)</figcaption>
      </figure>`;
    },

    swot() {
      return `<figure class="visual-block">
        <div class="swot-grid">
          <div class="swot-side">Internal</div>
          <div class="mx-cell mx-good"><b>S — Strengths</b><span>kekuatan: core competencies, KSF yang dikuasai</span></div>
          <div class="mx-cell mx-warn"><b>W — Weaknesses</b><span>kelemahan yang harus dihindari strategi</span></div>
          <div class="swot-side">Eksternal</div>
          <div class="mx-cell mx-good"><b>O — Opportunities</b><span>peluang pasar &amp; teknologi untuk dieksploitasi</span></div>
          <div class="mx-cell mx-bad"><b>T — Threats</b><span>ancaman: five forces, perubahan lingkungan</span></div>
        </div>
        <figcaption>SWOT analysis — titik awal pengembangan &amp; evaluasi strategi</figcaption>
      </figure>`;
    },

    globalStrategies() {
      return `<figure class="visual-block">
        <div class="mx-wrap">
          <div class="mx-ylabel">Cost reduction ↑</div>
          <div class="mx-grid">
            <div class="mx-cell mx-warn"><b>Global</b><span>sentralisasi, standardisasi, skala ekonomi — Caterpillar, Texas Instruments</span></div>
            <div class="mx-cell mx-good"><b>Transnational</b><span>efisiensi global + responsivitas lokal sekaligus</span></div>
            <div class="mx-cell mx-neutral"><b>International</b><span>ekspor &amp; lisensi — paling mudah, paling sedikit keunggulan</span></div>
            <div class="mx-cell mx-warn"><b>Multidomestic</b><span>desentralisasi demi pasar lokal — Heinz</span></div>
          </div>
          <div class="mx-xlabel">Local responsiveness →</div>
        </div>
        <figcaption>Empat strategi operasi global (HRM Gambar 2.9) — posisikan perusahaan pada dua sumbu ini</figcaption>
      </figure>`;
    },

    plc() {
      return `<figure class="visual-block">
        <svg viewBox="0 0 400 150" role="img" aria-label="Kurva product life cycle">
          <line class="radar-ring" x1="100" y1="10" x2="100" y2="120"></line>
          <line class="radar-ring" x1="200" y1="10" x2="200" y2="120"></line>
          <line class="radar-ring" x1="300" y1="10" x2="300" y2="120"></line>
          <line class="plc-base" x1="0" y1="120" x2="400" y2="120"></line>
          <path class="plc-curve" d="M 8 118 C 70 114 90 55 150 38 C 195 26 235 26 270 40 C 315 58 350 95 392 112"></path>
          <text class="radar-label" x="50" y="140" text-anchor="middle">Introduction</text>
          <text class="radar-label" x="150" y="140" text-anchor="middle">Growth</text>
          <text class="radar-label" x="250" y="140" text-anchor="middle">Maturity</text>
          <text class="radar-label" x="350" y="140" text-anchor="middle">Decline</text>
        </svg>
        <div class="plc-notes">
          <span>desain masih berubah, biaya tinggi</span>
          <span>forecasting kritis, tambah kapasitas</span>
          <span>kontrol biaya, pertahankan posisi</span>
          <span>efisiensi, pangkas lini</span>
        </div>
        <figcaption>Product life cycle — tiap fase menggeser prioritas strategi operasi</figcaption>
      </figure>`;
    }
  };

  function sourceBadge(sec) {
    if (!sec.source) return "";
    const kind = sec.source.kind === "ppt" ? "src-badge--ppt" : "src-badge--book";
    const icon = sec.source.kind === "ppt" ? "📽️" : "📖";
    return `<span class="src-badge ${kind}">${icon} ${esc(sec.source.label)}</span>`;
  }

  function renderVisuals(sec) {
    if (!sec.visuals) return "";
    return sec.visuals.map((name) => (VISUALS[name] ? VISUALS[name]() : "")).join("");
  }

  /* ============================================================
     HIGHLIGHT & CATATAN KALIMAT
     Seleksi teks di materi -> tandai (stabilo + tebal) -> klik
     tanda untuk menambah/melihat catatan. Disimpan sebagai
     { session, secIndex, text, occ, note } di localStorage dan
     dipasang ulang setiap kali materi dirender.
     ============================================================ */

  const annState = { session: 1, activeId: null, pending: null };

  const getAnns = () => store.get("annotations", []);
  const saveAnns = (list) => store.set("annotations", list);

  function sectionBodies() {
    return [...app.querySelectorAll(".accordion .accordion-body")];
  }

  function textNodesIn(el) {
    // blok pertanyaan (mq-block) dikecualikan agar offset highlight stabil
    // meski draf jawaban pengguna berubah-ubah
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        return p && (p.closest(".mq-block") || p.tagName === "TEXTAREA")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  const plainTextOf = (el) => textNodesIn(el).map((n) => n.nodeValue).join("");

  function nthIndexOf(haystack, needle, occ) {
    let idx = -1;
    for (let i = 0; i <= occ; i++) {
      idx = haystack.indexOf(needle, idx + 1);
      if (idx === -1) return -1;
    }
    return idx;
  }

  function wrapAnnotation(body, startIdx, len, ann) {
    const nodes = textNodesIn(body);
    const segs = [];
    let offset = 0;
    for (const n of nodes) {
      const nStart = offset;
      const nEnd = offset + n.nodeValue.length;
      const s = Math.max(startIdx, nStart);
      const e = Math.min(startIdx + len, nEnd);
      if (s < e) segs.push({ node: n, from: s - nStart, to: e - nStart });
      offset = nEnd;
      if (nEnd >= startIdx + len) break;
    }
    segs.forEach(({ node, from, to }) => {
      const target = from > 0 ? node.splitText(from) : node;
      if (to - from < target.nodeValue.length) target.splitText(to - from);
      const mark = document.createElement("mark");
      mark.className = "hl" + ((ann.note || "").trim() ? " hl--noted" : "");
      mark.dataset.hlId = ann.id;
      target.parentNode.insertBefore(mark, target);
      mark.appendChild(target);
    });
  }

  function applyOneAnnotation(ann) {
    const body = sectionBodies()[ann.secIndex];
    if (!body) return;
    const idx = nthIndexOf(plainTextOf(body), ann.text, ann.occ);
    if (idx === -1) return;
    wrapAnnotation(body, idx, ann.text.length, ann);
  }

  function annApplyAll(sessionId) {
    annState.session = sessionId;
    getAnns().filter((a) => a.session === sessionId).forEach(applyOneAnnotation);
  }

  function unwrapAnnotation(annId) {
    app.querySelectorAll(`mark[data-hl-id="${annId}"]`).forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });
  }

  /* --- elemen UI melayang (dibuat sekali) --- */
  const hlPopup = document.createElement("button");
  hlPopup.id = "hlPopup";
  hlPopup.type = "button";
  hlPopup.textContent = "🖍️ Tandai & catat";
  hlPopup.hidden = true;
  document.body.appendChild(hlPopup);

  const hlPanel = document.createElement("div");
  hlPanel.id = "hlPanel";
  hlPanel.hidden = true;
  hlPanel.innerHTML = `
    <div class="hl-quote"></div>
    <textarea rows="4" placeholder="Tulis catatan dari penjelasan dosen…"></textarea>
    <div class="hl-actions">
      <button type="button" class="btn btn--small btn--primary" data-hl-save>Simpan</button>
      <button type="button" class="btn btn--small btn--red-outline" data-hl-delete>Hapus tanda</button>
      <button type="button" class="btn btn--small btn--ghost" data-hl-close>Tutup</button>
    </div>`;
  document.body.appendChild(hlPanel);

  function hideHlUi() {
    hlPopup.hidden = true;
    hlPanel.hidden = true;
    annState.activeId = null;
    annState.pending = null;
  }

  function placeAt(el, rect) {
    el.hidden = false;
    const top = Math.max(8, rect.bottom + window.scrollY + 8);
    let left = rect.left + window.scrollX;
    left = Math.max(8, Math.min(left, window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 8));
    el.style.top = top + "px";
    el.style.left = left + "px";
  }

  function selectionInfo() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    const anchor = range.commonAncestorContainer;
    const el = anchor.nodeType === 1 ? anchor : anchor.parentElement;
    const body = el && el.closest ? el.closest(".accordion-body") : null;
    if (!body) return null;
    if (el.closest(".mq-block")) return null;
    const text = range.toString();
    if (!text.trim() || text.length < 3 || text.length > 600) return null;
    const full = plainTextOf(body);
    let occ = 0;
    const nodes = textNodesIn(body);
    let offset = 0;
    let startOffset = -1;
    for (const n of nodes) {
      if (n === range.startContainer) { startOffset = offset + range.startOffset; break; }
      offset += n.nodeValue.length;
    }
    if (startOffset >= 0) occ = Math.max(0, full.slice(0, startOffset).split(text).length - 1);
    if (nthIndexOf(full, text, occ) === -1) return null;
    return { secIndex: sectionBodies().indexOf(body), text, occ, rect: range.getBoundingClientRect() };
  }

  function openPanelFor(ann, rect) {
    annState.activeId = ann.id;
    hlPanel.querySelector(".hl-quote").textContent = "“" + (ann.text.length > 120 ? ann.text.slice(0, 120) + "…" : ann.text) + "”";
    hlPanel.querySelector("textarea").value = ann.note || "";
    placeAt(hlPanel, rect);
    hlPanel.querySelector("textarea").focus();
  }

  document.addEventListener("mouseup", (e) => {
    if (hlPanel.contains(e.target) || e.target === hlPopup) return;
    if (parseHash().view !== "materi") return;
    setTimeout(() => {
      const info = selectionInfo();
      if (info) {
        annState.pending = info;
        placeAt(hlPopup, info.rect);
      } else {
        hlPopup.hidden = true;
      }
    }, 0);
  });

  // dukungan seleksi via sentuhan (HP/tablet): pantau selectionchange dengan debounce
  let selDebounce = null;
  document.addEventListener("selectionchange", () => {
    if (parseHash().view !== "materi") return;
    clearTimeout(selDebounce);
    selDebounce = setTimeout(() => {
      const info = selectionInfo();
      if (info) {
        annState.pending = info;
        placeAt(hlPopup, info.rect);
      } else if (hlPanel.hidden) {
        hlPopup.hidden = true;
      }
    }, 500);
  });

  hlPopup.addEventListener("click", () => {
    const p = annState.pending;
    if (!p) return;
    const ann = {
      id: "a" + (store.get("ann_seq", 0) + 1),
      session: annState.session,
      secIndex: p.secIndex,
      text: p.text,
      occ: p.occ,
      note: ""
    };
    store.set("ann_seq", store.get("ann_seq", 0) + 1);
    saveAnns([...getAnns(), ann]);
    applyOneAnnotation(ann);
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    hlPopup.hidden = true;
    // pakai posisi mark yang baru dibuat (bukan rect seleksi yang bisa basi
    // setelah halaman bergeser) agar panel selalu berada di dekat kalimatnya
    const firstMark = app.querySelector(`mark[data-hl-id="${ann.id}"]`);
    openPanelFor(ann, firstMark ? firstMark.getBoundingClientRect() : p.rect);
    annState.pending = null;
  });

  hlPanel.addEventListener("click", (e) => {
    const anns = getAnns();
    const ann = anns.find((a) => a.id === annState.activeId);
    if (e.target.closest("[data-hl-save]") && ann) {
      ann.note = hlPanel.querySelector("textarea").value.trim();
      saveAnns(anns);
      app.querySelectorAll(`mark[data-hl-id="${ann.id}"]`).forEach((m) => m.classList.toggle("hl--noted", !!ann.note));
      hideHlUi();
    }
    if (e.target.closest("[data-hl-delete]") && ann) {
      saveAnns(anns.filter((a) => a.id !== ann.id));
      unwrapAnnotation(ann.id);
      hideHlUi();
    }
    if (e.target.closest("[data-hl-close]")) hideHlUi();
  });

  function viewMateri(id) {
    const s = getSession(id) || getSession(1);
    const available = DATA.sessions.filter((x) => x.summary).map((x) => x.id);
    let body;
    if (s.summary) {
      const mqAnswers = store.get("mq_answers", {});
      const questionBlock = (sec, i) => {
        if (!sec.questions || !sec.questions.length) return "";
        return `<div class="mq-block">
          <div class="mq-title">💬 Bahan Diskusi dengan Dosen</div>
          <p class="mq-hint">Pertanyaan siap-tanya untuk memancing diskusi di kelas (modal partisipasi 10%!). Buka
          "Kenapa menarik" untuk memahami angle-nya, lalu catat jawaban &amp; diskusi dosen di kolomnya — tersimpan otomatis.</p>
          ${sec.questions.map((qq, qi) => {
            const key = `${s.id}-${i}-${qi}`;
            return `<div class="mq-item">
              <p class="mq-q"><span class="mq-num">T${qi + 1}</span> ${esc(qq.q)}</p>
              <details class="mq-guide"><summary>💡 Kenapa menarik &amp; follow-up</summary><p>${esc(qq.guide)}</p></details>
              <textarea class="mq-answer" data-mq="${key}" rows="3"
                placeholder="Catat jawaban & diskusi dosen di sini…">${esc(mqAnswers[key] || "")}</textarea>
            </div>`;
          }).join("")}
        </div>`;
      };
      body = s.summary.map((sec, i) => `
        <details class="card accordion" ${i === 0 ? "open" : ""}>
          <summary><span class="acc-title">${esc(sec.heading)}</span>${sourceBadge(sec)}</summary>
          <div class="accordion-body">${sec.body}${renderVisuals(sec)}${questionBlock(sec, i)}</div>
        </details>`).join("");
    } else {
      body = `
      <div class="card empty-state">
        <div class="big">🗂️</div>
        <p><strong>Materi sesi ini belum ditambahkan.</strong></p>
        <p>Setelah pertemuan berlangsung, upload slide ke folder Drive lalu tambahkan rangkumannya
        di <code>js/data.js</code> (field <code>summary</code> pada sesi ${s.id}) — flashcards dan kuisnya juga bisa ditambah di file yang sama.</p>
        <p style="margin-top:0.8rem">Bacaan untuk persiapan: ${s.readings.length ? esc(s.readings.join(" · ")) : "—"}</p>
      </div>`;
    }

    return `
    <div class="view">
      <p class="eyebrow">Rangkuman Materi</p>
      <h1 class="view-title">Materi per Pertemuan</h1>
      <p class="view-sub">Angka bergaris emas menandakan sesi yang materinya sudah tersedia.
        Tiap bagian diberi penanda sumber: <span class="src-badge src-badge--ppt">📽️ Slide dosen</span> = dibahas
        di kelas, <span class="src-badge src-badge--book">📖 Buku</span> = pengayaan dari buku referensi.
        <br>🖍️ <strong>Blok (seleksi) kalimat mana pun</strong> untuk menandainya dan menambahkan catatan penjelasan
        dosen — lalu klik kalimat berstabilo untuk melihat atau mengedit catatannya. Semua tanda tersimpan otomatis
        dan terkumpul juga di menu Catatan.</p>
      ${sessionPicker(s.id, available, "#/materi")}
      <div class="materi-header">
        <h2>Sesi ${s.id} — ${esc(s.topic)}</h2>
        <div class="meta">
          <span class="tag">📅 ${esc(s.dateLabel)}</span>
          ${s.summary ? `<span class="tag">⏱️ ±${Math.max(1, Math.round(s.summary.map((x) => x.body.replace(/<[^>]+>/g, " ")).join(" ").split(/\s+/).length / 180))} menit baca</span>` : ""}
          ${s.readings.map((r) => `<span class="tag tag--reading">📖 ${esc(r)}</span>`).join("")}
          ${s.caseStudy ? `<span class="tag tag--case">💼 ${esc(s.caseStudy)}</span>` : ""}
        </div>
      </div>
      ${body}
    </div>`;
  }

  /* ---------- Flashcards ---------- */
  const fcState = { session: 1, order: [], index: 0, flipped: false };

  function shuffleOrder(cards) {
    const order = cards.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function fcCards() {
    return DATA.flashcards
      .map((c, gi) => ({ ...c, gi }))
      .filter((c) => c.session === fcState.session);
  }

  function viewFlashcards(id) {
    if (id && id !== fcState.session) { fcState.session = id; fcState.order = []; fcState.index = 0; }
    const cards = fcCards();
    const available = sessionsWithCards();

    if (!cards.length) {
      return `
      <div class="view">
        <p class="eyebrow">Hafalan Konsep</p>
        <h1 class="view-title">Flashcards</h1>
        ${sessionPicker(fcState.session, available, "#/flashcards")}
        <div class="card empty-state">
          <div class="big">🃏</div>
          <p><strong>Belum ada flashcard untuk sesi ini.</strong></p>
          <p>Kartu akan ditambahkan setelah materi pertemuannya tersedia. Coba Sesi 1 dulu!</p>
        </div>
      </div>`;
    }

    if (!fcState.order.length || fcState.order.length !== cards.length) {
      fcState.order = shuffleOrder(cards);
      fcState.index = 0;
      fcState.flipped = false;
    }

    const mastered = store.get("fc_mastered", []);
    const card = cards[fcState.order[fcState.index]];
    const isMastered = mastered.includes(card.gi);
    const masteredInDeck = cards.filter((c) => mastered.includes(c.gi)).length;
    const progress = (fcState.index + 1) / cards.length;

    return `
    <div class="view">
      <p class="eyebrow">Hafalan Konsep</p>
      <h1 class="view-title">Flashcards</h1>
      <p class="view-sub">Klik kartu untuk membalik. Tandai "Sudah paham" agar penguasaanmu terekam — kartu bisa diacak ulang kapan saja.</p>
      ${sessionPicker(fcState.session, available, "#/flashcards")}

      <div class="fc-controls">
        <span class="fc-count">Kartu ${fcState.index + 1} / ${cards.length}</span>
        <div class="fc-progress"><i style="transform:scaleX(${progress})"></i></div>
        <button class="btn btn--small" data-fc="shuffle">🔀 Acak ulang</button>
      </div>

      <div class="fc-stage">
        <div class="fc-card ${fcState.flipped ? "flipped" : ""}" data-fc="flip">
          <div class="fc-face fc-front">
            <span class="fc-label">Pertanyaan ${isMastered ? "· ✓ dikuasai" : ""}</span>
            <div class="fc-text">${esc(card.front)}</div>
            <span class="fc-hint">klik untuk melihat jawaban</span>
          </div>
          <div class="fc-face fc-back">
            <span class="fc-label">Jawaban</span>
            <div class="fc-text">${esc(card.back)}</div>
            <span class="fc-hint">klik untuk kembali ke pertanyaan</span>
          </div>
        </div>
      </div>

      <div class="fc-actions">
        <button class="btn" data-fc="prev" ${fcState.index === 0 ? "disabled" : ""}>← Sebelumnya</button>
        <button class="btn btn--red-outline" data-fc="learning">Masih belajar</button>
        <button class="btn btn--green" data-fc="mastered">${isMastered ? "✓ Sudah paham" : "Sudah paham"}</button>
        <button class="btn" data-fc="next" ${fcState.index === cards.length - 1 ? "disabled" : ""}>Berikutnya →</button>
      </div>
      <div class="fc-mastery">Dikuasai di deck ini: <b>${masteredInDeck}</b> dari ${cards.length} kartu</div>
    </div>`;
  }

  function fcAction(action) {
    const cards = fcCards();
    const card = cards[fcState.order[fcState.index]];
    const mastered = store.get("fc_mastered", []);

    if (action === "flip") { fcState.flipped = !fcState.flipped; }
    if (action === "shuffle") { fcState.order = shuffleOrder(cards); fcState.index = 0; fcState.flipped = false; }
    if (action === "prev" && fcState.index > 0) { fcState.index--; fcState.flipped = false; }
    if (action === "next" && fcState.index < cards.length - 1) { fcState.index++; fcState.flipped = false; }
    if (action === "mastered") {
      if (!mastered.includes(card.gi)) mastered.push(card.gi);
      store.set("fc_mastered", mastered);
      if (fcState.index < cards.length - 1) { fcState.index++; fcState.flipped = false; }
    }
    if (action === "learning") {
      store.set("fc_mastered", mastered.filter((x) => x !== card.gi));
      if (fcState.index < cards.length - 1) { fcState.index++; fcState.flipped = false; }
    }
    render();
  }

  /* ---------- Kuis ---------- */
  const quizState = { session: 1, index: 0, score: 0, answered: null, finished: false, started: false };

  function quizFor(sessionId) {
    return DATA.quizzes.find((q) => q.session === sessionId);
  }

  function viewKuis(id) {
    if (id && id !== quizState.session) {
      Object.assign(quizState, { session: id, index: 0, score: 0, answered: null, finished: false, started: false });
    }
    const available = sessionsWithQuiz();
    const quiz = quizFor(quizState.session);
    const best = store.get("quiz_best", {});

    const header = `
      <p class="eyebrow">Uji Pemahaman</p>
      <h1 class="view-title">Kuis</h1>
      ${sessionPicker(quizState.session, available, "#/kuis")}`;

    if (!quiz) {
      return `<div class="view">${header}
        <div class="card empty-state">
          <div class="big">📝</div>
          <p><strong>Belum ada kuis untuk sesi ini.</strong></p>
          <p>Soal ditambahkan setelah materi pertemuannya tersedia. Mulai dari kuis Sesi 1!</p>
        </div>
      </div>`;
    }

    const s = getSession(quizState.session);

    if (!quizState.started) {
      const b = best[String(quizState.session)];
      return `<div class="view">${header}
        <div class="card quiz-result quiz-shell">
          <p class="eyebrow">Sesi ${quizState.session} — ${esc(s.topic)}</p>
          <div class="verdict">${quiz.questions.length} soal pilihan ganda</div>
          <p>Setiap jawaban langsung diberi pembahasan. ${b != null ? `Skor terbaikmu sejauh ini: <b>${b}%</b>.` : "Belum pernah dikerjakan."}</p>
          <button class="btn btn--primary" data-quiz-start>Mulai kuis →</button>
        </div>
      </div>`;
    }

    if (quizState.finished) {
      const pct = Math.round((quizState.score / quiz.questions.length) * 100);
      const verdict = pct >= 85 ? "Luar biasa — siap menghadapi ujian!" :
        pct >= 70 ? "Bagus! Ulangi bagian yang keliru." :
        pct >= 50 ? "Cukup — baca lagi rangkuman materinya." :
        "Jangan menyerah — pelajari flashcards lalu coba lagi.";
      return `<div class="view">${header}
        <div class="card quiz-result quiz-shell">
          <div class="score">${pct}%</div>
          <div class="verdict">${verdict}</div>
          <p>${quizState.score} benar dari ${quiz.questions.length} soal.</p>
          <button class="btn btn--primary" data-quiz-start>Ulangi kuis</button>
          <a class="btn btn--ghost" href="#/materi/${quizState.session}">Baca materi lagi</a>
        </div>
      </div>`;
    }

    const q = quiz.questions[quizState.index];
    const answered = quizState.answered !== null;

    return `<div class="view">${header}
      <div class="quiz-shell">
        <div class="quiz-meta">
          <span>Soal ${quizState.index + 1} / ${quiz.questions.length}</span>
          <span>Benar: ${quizState.score}</span>
        </div>
        <div class="quiz-q">${esc(q.q)}</div>
        <div class="quiz-opts">
          ${q.options.map((opt, i) => {
            let cls = "";
            if (answered) {
              if (i === q.answer) cls = "correct";
              else if (i === quizState.answered) cls = "wrong";
            }
            return `<button class="quiz-opt ${cls}" data-quiz-opt="${i}" ${answered ? "disabled" : ""}>
              <span class="opt-key">${String.fromCharCode(65 + i)}</span><span>${esc(opt)}</span>
            </button>`;
          }).join("")}
        </div>
        ${answered ? `
          <div class="quiz-explain"><b>${quizState.answered === q.answer ? "✓ Benar." : "✗ Kurang tepat."}</b> ${esc(q.explain)}</div>
          <button class="btn btn--primary" data-quiz-next>
            ${quizState.index === quiz.questions.length - 1 ? "Lihat hasil →" : "Soal berikutnya →"}
          </button>` : ""}
      </div>
    </div>`;
  }

  function quizAnswer(i) {
    if (quizState.answered !== null) return;
    const quiz = quizFor(quizState.session);
    quizState.answered = i;
    if (i === quiz.questions[quizState.index].answer) quizState.score++;
    render();
  }

  function quizNext() {
    const quiz = quizFor(quizState.session);
    if (quizState.index === quiz.questions.length - 1) {
      quizState.finished = true;
      const pct = Math.round((quizState.score / quiz.questions.length) * 100);
      const best = store.get("quiz_best", {});
      const key = String(quizState.session);
      if (best[key] == null || pct > best[key]) { best[key] = pct; store.set("quiz_best", best); }
    } else {
      quizState.index++;
      quizState.answered = null;
    }
    render();
  }

  /* ---------- Kalkulator produktivitas ---------- */
  function viewKalkulator() {
    return `
    <div class="view">
      <p class="eyebrow">Alat Hitung · Materi Sesi 1</p>
      <h1 class="view-title">Kalkulator Produktivitas</h1>
      <p class="view-sub">Bandingkan dua skenario (mis. sebelum vs sesudah investasi teknologi) seperti contoh
      Collins Title di slide kuliah. Nilai awal sudah diisi dengan angka contoh tersebut — silakan ganti.</p>

      <div class="card card-pad">
        <div class="calc-grid">
          <div class="calc-col">
            <h4>Skenario A — Sebelum</h4>
            <div class="field"><label>Output (unit per hari)</label><input type="number" id="aOut" value="8" step="any"></div>
            <div class="field"><label>Total jam kerja per hari</label><input type="number" id="aHours" value="32" step="any"></div>
            <div class="field"><label>Biaya tenaga kerja ($ / hari)</label><input type="number" id="aLabor" value="640" step="any"></div>
            <div class="field"><label>Biaya lain: overhead, material, energi, modal ($ / hari)</label><input type="number" id="aOther" value="400" step="any"></div>
          </div>
          <div class="calc-col">
            <h4>Skenario B — Sesudah</h4>
            <div class="field"><label>Output (unit per hari)</label><input type="number" id="bOut" value="14" step="any"></div>
            <div class="field"><label>Total jam kerja per hari</label><input type="number" id="bHours" value="32" step="any"></div>
            <div class="field"><label>Biaya tenaga kerja ($ / hari)</label><input type="number" id="bLabor" value="640" step="any"></div>
            <div class="field"><label>Biaya lain: overhead, material, energi, modal ($ / hari)</label><input type="number" id="bOther" value="800" step="any"></div>
          </div>
        </div>
        <div class="calc-results" id="calcResults"></div>
        <p class="calc-note">Rumus — Labor productivity = output ÷ jam kerja (single-factor). Multifactor productivity =
        output ÷ (biaya tenaga kerja + biaya lain). Multifactor memberi gambaran lebih lengkap karena mencakup semua biaya.</p>
      </div>
    </div>`;
  }

  function calcCompute() {
    const g = (id) => parseFloat(document.getElementById(id).value) || 0;
    const out = document.getElementById("calcResults");
    if (!out) return;

    const A = { out: g("aOut"), hours: g("aHours"), cost: g("aLabor") + g("aOther") };
    const B = { out: g("bOut"), hours: g("bHours"), cost: g("bLabor") + g("bOther") };

    const lp = (s) => (s.hours > 0 ? s.out / s.hours : NaN);
    const mfp = (s) => (s.cost > 0 ? s.out / s.cost : NaN);
    const fmt = (v, d) => (isNaN(v) ? "—" : v.toFixed(d));
    const delta = (a, b) => (isNaN(a) || isNaN(b) || a === 0 ? null : ((b - a) / a) * 100);

    const dLp = delta(lp(A), lp(B));
    const dMfp = delta(mfp(A), mfp(B));
    const deltaHtml = (d) => d === null ? "" :
      `<span class="val ${d >= 0 ? "up" : "down"}">${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(1)}%</span>`;

    out.innerHTML = `
      <div class="result-line"><span>Labor productivity (unit/jam) — A → B</span>
        <span><span class="val">${fmt(lp(A), 4)}</span> → <span class="val">${fmt(lp(B), 4)}</span> ${deltaHtml(dLp)}</span></div>
      <div class="result-line"><span>Multifactor productivity (unit/$) — A → B</span>
        <span><span class="val">${fmt(mfp(A), 4)}</span> → <span class="val">${fmt(mfp(B), 4)}</span> ${deltaHtml(dMfp)}</span></div>`;
  }

  /* ---------- Catatan ---------- */
  const notesState = { session: 1 };
  let noteTimer = null;

  function viewCatatan(id) {
    if (id) notesState.session = id;
    const notes = store.get("notes", {});
    const s = getSession(notesState.session);
    const text = notes[String(notesState.session)] || "";

    return `
    <div class="view">
      <p class="eyebrow">Jurnal Kuliah</p>
      <h1 class="view-title">Catatan per Sesi</h1>
      <p class="view-sub">Tulis insight, pertanyaan untuk dosen, atau poin diskusi kelas. Catatan tersimpan otomatis di browser ini.</p>
      <div class="notes-grid">
        <nav class="notes-nav">
          ${DATA.sessions.map((x) => {
            const has = (notes[String(x.id)] || "").trim().length > 0;
            return `<button data-goto="#/catatan/${x.id}" class="${x.id === notesState.session ? "active" : ""}">
              Sesi ${x.id} ${has ? '<span class="has-note">●</span>' : ""}<br>
              <span style="font-weight:400;font-size:0.76rem;opacity:0.75">${esc(x.topic)}</span>
            </button>`;
          }).join("")}
        </nav>
        <div class="notes-editor">
          <textarea id="noteArea" placeholder="Catatanmu untuk Sesi ${notesState.session} — ${esc(s.topic)}…">${esc(text)}</textarea>
          <div class="notes-status" id="noteStatus">Tersimpan otomatis saat kamu mengetik.</div>
          ${(() => {
            const anns = getAnns().filter((a) => a.session === notesState.session);
            if (!anns.length) {
              return `<p class="ann-empty">Belum ada kalimat yang kamu tandai di materi sesi ini.
                Buka <a href="#/materi/${notesState.session}">Materi Sesi ${notesState.session}</a>, blok kalimat
                yang dibahas dosen, lalu tambahkan catatan — semuanya akan terkumpul di sini.</p>`;
            }
            return `<h3 class="ann-heading">🖍️ Kalimat yang kamu tandai di materi (${anns.length})</h3>
            <div class="ann-list">
              ${anns.map((a) => `
                <div class="ann-item">
                  <blockquote>“${esc(a.text)}”</blockquote>
                  ${a.note ? `<p class="ann-note">📝 ${esc(a.note)}</p>` : `<p class="ann-note ann-note--empty">Belum ada catatan — klik kalimatnya di materi untuk menambahkan.</p>`}
                  <div class="ann-item-actions">
                    <a class="btn btn--small btn--ghost" href="#/materi/${a.session}">Buka di materi</a>
                    <button class="btn btn--small btn--red-outline" data-ann-del="${a.id}">Hapus</button>
                  </div>
                </div>`).join("")}
            </div>`;
          })()}
        </div>
      </div>
    </div>`;
  }

  function bindNotes() {
    const area = document.getElementById("noteArea");
    const status = document.getElementById("noteStatus");
    if (!area) return;
    area.addEventListener("input", () => {
      clearTimeout(noteTimer);
      status.textContent = "Menyimpan…";
      noteTimer = setTimeout(() => {
        const notes = store.get("notes", {});
        notes[String(notesState.session)] = area.value;
        store.set("notes", notes);
        status.textContent = "✓ Tersimpan " + new Date().toLocaleTimeString("id-ID");
        // refresh titik penanda di sidebar tanpa render ulang penuh
        const btn = document.querySelector(`.notes-nav button[data-goto="#/catatan/${notesState.session}"]`);
        if (btn) {
          const has = area.value.trim().length > 0;
          const dot = btn.querySelector(".has-note");
          if (has && !dot) btn.insertAdjacentHTML("beforeend", ' <span class="has-note">●</span>');
          if (!has && dot) dot.remove();
        }
      }, 400);
    });
  }

  /* ============================================================
     ROUTER & EVENTS
     ============================================================ */

  function parseHash() {
    const h = (location.hash || "#/dashboard").replace(/^#\//, "");
    const [view, param] = h.split("/");
    return { view: view || "dashboard", param: param ? parseInt(param, 10) : null };
  }

  function render() {
    const { view, param } = parseHash();
    const views = {
      dashboard: () => viewDashboard(),
      silabus: () => viewSilabus(),
      materi: () => viewMateri(param || 1),
      flashcards: () => viewFlashcards(param),
      kuis: () => viewKuis(param),
      kalkulator: () => viewKalkulator(),
      catatan: () => viewCatatan(param)
    };
    app.innerHTML = (views[view] || views.dashboard)();

    nav.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.dataset.view === view || (!views[view] && a.dataset.view === "dashboard"));
    });

    hideHlUi();
    if (view === "materi") annApplyAll((param && getSession(param)) ? param : 1);
    if (view === "kalkulator") calcCompute();
    if (view === "catatan") bindNotes();
    window.scrollTo({ top: 0 });
  }

  app.addEventListener("click", (e) => {
    const mark = e.target.closest("mark.hl");
    if (mark) {
      const ann = getAnns().find((a) => a.id === mark.dataset.hlId);
      if (ann) { openPanelFor(ann, mark.getBoundingClientRect()); e.preventDefault(); }
      return;
    }

    const annDel = e.target.closest("[data-ann-del]");
    if (annDel) {
      saveAnns(getAnns().filter((a) => a.id !== annDel.dataset.annDel));
      render();
      return;
    }

    const goto = e.target.closest("[data-goto]");
    if (goto) { location.hash = goto.dataset.goto; return; }

    const toggleDone = e.target.closest("[data-toggle-done]");
    if (toggleDone) {
      const id = parseInt(toggleDone.dataset.toggleDone, 10);
      let done = store.get("done_sessions", []);
      done = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
      store.set("done_sessions", done);
      render();
      return;
    }

    const fc = e.target.closest("[data-fc]");
    if (fc) { fcAction(fc.dataset.fc); return; }

    if (e.target.closest("[data-quiz-start]")) {
      Object.assign(quizState, { index: 0, score: 0, answered: null, finished: false, started: true });
      render();
      return;
    }
    const opt = e.target.closest("[data-quiz-opt]");
    if (opt) { quizAnswer(parseInt(opt.dataset.quizOpt, 10)); return; }
    if (e.target.closest("[data-quiz-next]")) { quizNext(); return; }
  });

  let mqTimer = null;
  app.addEventListener("input", (e) => {
    if (e.target.matches(".calc-grid input")) calcCompute();
    if (e.target.matches(".mq-answer")) {
      const key = e.target.dataset.mq;
      const val = e.target.value;
      clearTimeout(mqTimer);
      mqTimer = setTimeout(() => {
        const answers = store.get("mq_answers", {});
        answers[key] = val;
        store.set("mq_answers", answers);
      }, 400);
    }
  });

  window.addEventListener("hashchange", render);
  render();
})();
