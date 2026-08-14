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

  function viewMateri(id) {
    const s = getSession(id) || getSession(1);
    const available = DATA.sessions.filter((x) => x.summary).map((x) => x.id);
    let body;
    if (s.summary) {
      body = s.summary.map((sec, i) => `
        <details class="card accordion" ${i === 0 ? "open" : ""}>
          <summary>${esc(sec.heading)}</summary>
          <div class="accordion-body">${sec.body}</div>
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
      <p class="view-sub">Angka bergaris emas menandakan sesi yang materinya sudah tersedia.</p>
      ${sessionPicker(s.id, available, "#/materi")}
      <div class="materi-header">
        <h2>Sesi ${s.id} — ${esc(s.topic)}</h2>
        <div class="meta">
          <span class="tag">📅 ${esc(s.dateLabel)}</span>
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

    if (view === "kalkulator") calcCompute();
    if (view === "catatan") bindNotes();
    window.scrollTo({ top: 0 });
  }

  app.addEventListener("click", (e) => {
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

  app.addEventListener("input", (e) => {
    if (e.target.matches(".calc-grid input")) calcCompute();
  });

  window.addEventListener("hashchange", render);
  render();
})();
