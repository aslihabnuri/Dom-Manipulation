/* ============================================================
   BEfS Study Hub — App Logic
   SPA berbasis hash routing. Seluruh progres (sesi selesai,
   penguasaan flashcard, skor kuis, catatan, sorotan, analisis
   kasus) disimpan di localStorage browser ini.
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.BEFS_DATA;
  const CH = window.BEFS_CHAPTERS;
  const VIZ = window.BEFS_VIZ;
  const CARDS = window.BEFS_FLASHCARDS;
  const GLOS = window.BEFS_GLOSSARY;
  const QUIZ = window.BEFS_QUIZZES;

  const app = document.getElementById("app");
  const nav = document.getElementById("mainNav");

  /* ---------- penyimpanan aman (fallback in-memory) ---------- */
  const mem = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("befs_" + key);
        return raw === null ? (key in mem ? mem[key] : fallback) : JSON.parse(raw);
      } catch (e) {
        return key in mem ? mem[key] : fallback;
      }
    },
    set(key, value) {
      mem[key] = value;
      try { localStorage.setItem("befs_" + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    }
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const MONTHS_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  function today() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function parseDate(iso) {
    const p = String(iso).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmtDate(d) {
    return d.getDate() + " " + MONTHS_FULL[d.getMonth()] + " " + d.getFullYear();
  }
  function addWeeks(d, n) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + n * 7);
    return x;
  }

  /* ---------- jadwal: tanggal sesi diturunkan dari tanggal mulai ---------- */
  function startDate() {
    const s = store.get("start_date", null);
    return s ? parseDate(s) : null;
  }
  function sessionDate(id) {
    const s = startDate();
    return s ? addWeeks(s, id - 1) : null;
  }
  function nextSession() {
    const s = startDate();
    if (!s) return null;
    const t = today();
    for (let i = 0; i < DATA.sessions.length; i++) {
      const d = sessionDate(DATA.sessions[i].id);
      if (d >= t) return DATA.sessions[i];
    }
    return DATA.sessions[DATA.sessions.length - 1];
  }

  /* ---------- helper data ---------- */
  const getChapter = (id) => CH.find((c) => c.id === id);
  const chapterOfSession = (sid) => {
    const s = DATA.sessions.find((x) => x.id === sid);
    return s && s.chapter ? getChapter(s.chapter) : null;
  };
  const cardsFor = (ch) => (ch === "all" ? CARDS : CARDS.filter((c) => c.ch === ch));

  function quizPool(mode) {
    if (mode === "mid") return QUIZ.filter((q) => q.ch <= 6);
    if (mode === "final") return QUIZ.filter((q) => q.ch >= 7);
    if (mode === "all") return QUIZ.slice();
    return QUIZ.filter((q) => q.ch === Number(mode));
  }

  /* ---------- pengacakan ---------- */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Bank soal condong ke opsi B, jadi opsi diacak ulang tiap sesi kuis
     dan indeks jawaban benar dipetakan ulang. */
  function prepareQuestion(q) {
    const order = shuffled([0, 1, 2, 3]);
    return {
      src: q,
      ch: q.ch,
      q: q.q,
      why: q.why,
      opts: order.map((i) => q.opts[i]),
      a: order.indexOf(q.a)
    };
  }

  /* ---------- injeksi diagram ---------- */
  function injectViz(html) {
    return String(html).replace(/\{\{viz:([a-zA-Z0-9_]+)\}\}/g, function (m, name) {
      const fn = VIZ[name];
      if (typeof fn !== "function") return "";
      try { return fn(); } catch (e) { return ""; }
    });
  }

  /* ============================================================
     VIEW: DASHBOARD
     ============================================================ */
  function viewDashboard() {
    const c = DATA.course;
    const done = store.get("done_sessions", []);
    const mastered = store.get("fc_mastered", []);
    const best = store.get("quiz_best", {});
    const ns = nextSession();
    const readCh = store.get("read_chapters", []);

    let nextBlock;
    if (ns) {
      const d = sessionDate(ns.id);
      const dd = Math.round((d - today()) / 86400000);
      const txt = dd === 0 ? "Hari ini!" : dd === 1 ? "Besok" : dd < 0 ? "Sudah lewat" : dd + " hari lagi";
      nextBlock =
        '<div class="next-session">' +
          '<div class="date-block"><div class="d">' + d.getDate() + '</div><div class="m">' + MONTHS_ID[d.getMonth()] + '</div></div>' +
          '<div><h4>Sesi ' + ns.id + ' — ' + esc(ns.topic) + '</h4>' +
          '<div class="muted">' + (ns.ref ? "Bacaan: " + esc(ns.ref) : "Tanpa bacaan wajib") +
          (ns.assignment ? " · " + esc(ns.assignment) : "") + '</div>' +
          (ns.exam ? '<div class="muted" style="color:var(--clay);font-weight:600">⚠ ' + esc(ns.exam) + '</div>' : "") +
          '<span class="countdown-pill">⏳ ' + txt + '</span></div></div>';
    } else {
      nextBlock =
        '<p style="color:var(--ink-soft);font-size:0.9rem">Silabus MAN5522 tidak mencantumkan tanggal pertemuan. ' +
        'Atur tanggal sesi pertama di halaman <a href="#/silabus" style="color:var(--pine);font-weight:600">Silabus</a> ' +
        'dan jadwal 14 minggu akan dihitung otomatis.</p>';
    }

    const bestMid = best.mid, bestFinal = best.final;

    return '<div class="view">' +
      '<section class="hero">' +
        '<p class="eyebrow">' + esc(c.code) + ' · ' + esc(c.folder) + '</p>' +
        '<h1>Business Ethics for <em>Sustainability</em></h1>' +
        '<p>Teman belajarmu untuk 14 sesi ke depan — rangkuman 12 bab Crane &amp; Matten, diagram, flashcards, ' +
        'kuis, penganalisis kasus etis, glosarium, dan catatan pribadi. Semuanya disusun mengikuti RPKPS resmi ' +
        'mata kuliah ini.</p>' +
        '<div class="hero-meta">' +
          '<span class="chip chip--gold">Dosen: ' + esc(c.lecturer) + '</span>' +
          '<span class="chip chip--green">' + esc(c.credit) + '</span>' +
          '<span class="chip">' + esc(c.status) + '</span>' +
          '<span class="chip">MBA FEB UGM</span>' +
        '</div>' +
      '</section>' +

      '<div class="grid grid--dash">' +
        '<div class="stack">' +
          '<section class="card card-pad"><h3>Sesi berikutnya</h3>' + nextBlock + '</section>' +

          '<section class="card card-pad"><h3>Progres belajarmu</h3>' +
            '<div class="stat-row">' +
              '<div class="stat"><div class="n">' + done.length + '<small>/14</small></div><div class="l">Sesi selesai</div></div>' +
              '<div class="stat"><div class="n">' + readCh.length + '<small>/12</small></div><div class="l">Bab dibaca</div></div>' +
              '<div class="stat"><div class="n">' + mastered.length + '<small>/' + CARDS.length + '</small></div><div class="l">Kartu dikuasai</div></div>' +
            '</div>' +
            '<div class="stat-row" style="margin-top:1rem">' +
              '<div class="stat"><div class="n">' + (bestMid != null ? bestMid + "%" : "—") + '</div><div class="l">Terbaik mid-term</div></div>' +
              '<div class="stat"><div class="n">' + (bestFinal != null ? bestFinal + "%" : "—") + '</div><div class="l">Terbaik final</div></div>' +
            '</div>' +
          '</section>' +

          '<section class="card card-pad"><h3>Course objectives</h3>' +
            '<ol class="obj-list">' + c.objectives.map((o) =>
              '<li><span><b>' + esc(o.code) + '</b> — ' + esc(o.text) + '</span></li>').join("") + '</ol>' +
            '<p style="font-size:0.82rem;color:var(--ink-faint);margin-top:0.8rem;border-top:1px dashed var(--line);padding-top:0.8rem">' +
            'Seluruh CO dipetakan ke <strong>' + esc(c.competencyGoal.code) + '</strong> — ' + esc(c.competencyGoal.text) + '.</p>' +
          '</section>' +

          '<section class="card card-pad"><h3>Deskripsi mata kuliah</h3>' +
            '<p style="font-size:0.9rem;color:var(--ink-soft);line-height:1.75">' + esc(c.description) + '</p></section>' +
        '</div>' +

        '<div class="stack">' +
          '<section class="card card-pad"><h3>Komponen penilaian</h3>' +
            c.assessment.map((a) =>
              '<div class="assess-row"><span class="assess-label">' + esc(a.label) + '</span>' +
              '<span class="assess-weight">' + a.weight + '%</span>' +
              '<span class="assess-bar"><i style="width:' + (a.weight / 30 * 100) + '%"></i></span></div>' +
              '<p style="font-size:0.76rem;color:var(--ink-faint);margin:-0.4rem 0 0.9rem">' + esc(a.note) + '</p>').join("") +
          '</section>' +

          '<section class="card card-pad"><h3>Referensi</h3><ul class="ref-list">' +
            c.references.map((r) =>
              '<li><span class="ref-code' + (r.main ? "" : " ref-code--alt") + '">' + esc(r.code) + '</span><span>' + r.text +
              (r.main ? ' <strong style="color:var(--pine)">· bacaan utama</strong>' : "") + '</span></li>').join("") +
          '</ul></section>' +

          '<section class="card card-pad"><h3>Materi di Google Drive</h3><ul class="link-list">' +
            c.driveLinks.map((l) =>
              '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a> <span class="ext">↗</span></li>').join("") +
          '</ul></section>' +

          '<section class="card card-pad"><h3>Mulai dari mana?</h3>' +
            '<ul class="link-list">' +
              '<li><a href="#/materi/1">Baca CM1 — Introducing Business Ethics</a></li>' +
              '<li><a href="#/flashcards/all">Latihan flashcards semua bab</a></li>' +
              '<li><a href="#/kuis/mid">Simulasi mid-term (CM1–CM6)</a></li>' +
              '<li><a href="#/kasus">Analisis sebuah kasus etis</a></li>' +
            '</ul></section>' +
        '</div>' +
      '</div></div>';
  }

  /* ============================================================
     VIEW: SILABUS
     ============================================================ */
  function viewSilabus() {
    const done = store.get("done_sessions", []);
    const sd = store.get("start_date", "");

    const timeline = DATA.sessions.map(function (s) {
      const isDone = done.includes(s.id);
      const d = sessionDate(s.id);
      const isPast = d ? d < today() : false;
      const ch = s.chapter ? getChapter(s.chapter) : null;
      return '<article class="card session-card' + (isDone ? " done" : "") + (isPast ? " past" : "") +
        (s.exam ? " session-card--exam" : "") + '">' +
        '<div class="session-head">' +
          '<span class="session-num">Sesi ' + String(s.id).padStart(2, "0") + '</span>' +
          '<div class="session-title-wrap">' +
            '<div class="session-title">' + esc(s.topic) + '</div>' +
            '<div class="session-date">' + (d ? fmtDate(d) + (isPast && !isDone ? " · sudah lewat" : "") : "Tanggal belum diatur") +
            ' · ' + esc(s.topicId) + '</div>' +
          '</div>' +
          '<div class="session-actions">' +
            (ch ? '<a class="btn btn--small btn--gold" href="#/materi/' + ch.id + '">Buka materi</a>' : "") +
            '<button class="btn btn--small' + (isDone ? " btn--green" : "") + '" data-toggle-done="' + s.id + '">' +
            (isDone ? "✓ Selesai" : "Tandai selesai") + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="session-body">' +
          (s.ref ? '<span class="tag tag--reading">📖 ' + esc(s.extraRef || s.ref) + '</span>' : "") +
          s.subtopics.map((t) => '<span class="tag">' + esc(t) + '</span>').join("") +
          (s.assignment ? '<span class="tag tag--case">💼 ' + esc(s.assignment) + '</span>' : "") +
          (s.exam ? '<span class="tag tag--exam">📝 ' + esc(s.exam) + '</span>' : "") +
        '</div>' +
        '<p style="font-size:0.8rem;color:var(--ink-faint);margin-top:0.6rem;font-style:italic">' + esc(s.subObjective) + '</p>' +
        '</article>';
    }).join("");

    const grading = DATA.course.grading.map((g) =>
      '<tr><td style="padding:0.3rem 0.8rem 0.3rem 0;font-weight:700;font-family:var(--mono)">' + esc(g.grade) + '</td>' +
      '<td style="padding:0.3rem 0.8rem 0.3rem 0;color:var(--ink-soft)">' + esc(g.range) + '</td>' +
      '<td style="padding:0.3rem 0;color:var(--brass);font-family:var(--mono);font-weight:700">' + esc(g.gpa) + '</td></tr>').join("");

    return '<div class="view">' +
      '<p class="eyebrow">RPKPS ' + esc(DATA.course.code) + ' · disahkan ' + esc(DATA.course.authorized) + '</p>' +
      '<h1 class="view-title">Silabus &amp; Rencana 14 Sesi</h1>' +
      '<p class="view-sub">Mengikuti tabel <em>Weekly Learning Activity Plan</em> pada RPKPS resmi. ' +
      'Tandai sesi yang sudah kamu pelajari untuk melacak progres.</p>' +

      '<div class="materi-header"><div class="meta">' +
        '<span class="tag tag--case">👤 Dosen: ' + esc(DATA.course.lecturer) + '</span>' +
        '<span class="tag">' + esc(DATA.course.credit) + '</span>' +
        '<span class="tag">' + esc(DATA.course.status) + '</span>' +
        '<span class="tag">' + esc(DATA.course.prerequisite) + '</span>' +
      '</div></div>' +

      '<div class="schedule-setter">' +
        '<span>📅 Tanggal sesi pertama:</span>' +
        '<input type="date" id="startDate" value="' + esc(sd) + '">' +
        '<span>Jadwal 14 minggu dihitung otomatis (mingguan).</span>' +
        (sd ? '<button class="btn btn--small btn--ghost" id="clearDate">Hapus</button>' : "") +
      '</div>' +

      '<div class="timeline">' + timeline + '</div>' +

      '<div class="grid grid--two" style="margin-top:2rem">' +
        '<section class="card card-pad"><h3>Tugas &amp; ujian</h3>' +
          DATA.course.assignments.map((a) =>
            '<p style="font-size:0.88rem;color:var(--ink-soft);margin-bottom:0.9rem">' +
            '<strong style="color:var(--pine);display:block">' + esc(a.type) + '</strong>' + a.detail + '</p>').join("") +
        '</section>' +
        '<section class="card card-pad"><h3>Skala nilai</h3>' +
          '<table style="width:100%;font-size:0.85rem;border-collapse:collapse">' +
          '<thead><tr><th style="text-align:left;padding-bottom:0.4rem;font-size:0.7rem;letter-spacing:0.08em;color:var(--ink-faint)">GRADE</th>' +
          '<th style="text-align:left;padding-bottom:0.4rem;font-size:0.7rem;letter-spacing:0.08em;color:var(--ink-faint)">RENTANG</th>' +
          '<th style="text-align:left;padding-bottom:0.4rem;font-size:0.7rem;letter-spacing:0.08em;color:var(--ink-faint)">BOBOT</th></tr></thead>' +
          '<tbody>' + grading + '</tbody></table>' +
        '</section>' +
      '</div>' +

      '<section class="card card-pad" style="margin-top:1.25rem">' +
        '<h3>Tanggung jawab mahasiswa</h3>' +
        '<ol class="obj-list">' + DATA.course.responsibilities.map((r) => '<li><span>' + esc(r) + '</span></li>').join("") + '</ol>' +
      '</section>' +

      '<section class="card card-pad" style="margin-top:1.25rem;border-color:rgba(168,69,47,0.4)">' +
        '<h3 style="color:var(--clay)">Integritas akademik</h3>' +
        '<p style="font-size:0.88rem;color:var(--ink-soft);line-height:1.75">' + DATA.course.integrity + '</p>' +
      '</section></div>';
  }

  /* ============================================================
     VIEW: MATERI
     ============================================================ */
  function chapterPicker(activeId) {
    return '<div class="session-picker">' + CH.map((c) =>
      '<button data-goto="#/materi/' + c.id + '" class="has-content' + (c.id === activeId ? " active" : "") +
      '" title="' + esc(c.ref + ": " + c.title) + '">' + c.ref.replace("CM", "") + '</button>').join("") + '</div>';
  }

  function viewMateri(id) {
    const ch = getChapter(id);
    if (!ch) return viewMateri(1);
    const read = store.get("read_chapters", []);
    const isRead = read.includes(ch.id);
    const session = DATA.sessions.find((s) => s.chapter === ch.id);

    const sections = ch.sections.map(function (s, i) {
      return '<details class="card accordion" data-sec="' + i + '"' + (i === 0 ? " open" : "") + '>' +
        '<summary><span class="acc-title">' + esc(s.title) + '</span>' +
        '<span class="src-badge ' + (s.src.indexOf("+") > -1 ? "src-badge--extra" : "src-badge--book") + '">' + esc(s.src) + '</span></summary>' +
        '<div class="accordion-body" data-annot-scope="' + ch.id + ':' + i + '">' + injectViz(s.body) + '</div>' +
        '</details>';
    }).join("");

    const prev = CH.find((c) => c.id === ch.id - 1);
    const next = CH.find((c) => c.id === ch.id + 1);

    return '<div class="view view--reading">' +
      '<p class="eyebrow">' + esc(ch.ref) + (session ? " · Sesi " + session.id : "") + '</p>' +
      '<h1 class="view-title">' + esc(ch.title) + '</h1>' +
      '<p class="view-sub">' + esc(ch.blurb) + '</p>' +

      chapterPicker(ch.id) +

      '<div class="materi-header">' +
        '<div class="meta">' +
          '<span class="tag">' + esc(ch.titleId) + '</span>' +
          '<span class="tag tag--reading">📖 Crane &amp; Matten ' + esc(ch.ref) + '</span>' +
          (ch.id <= 6 ? '<span class="tag tag--exam">Materi mid-term</span>' : '<span class="tag tag--exam">Materi final</span>') +
        '</div>' +
      '</div>' +

      '<section class="card card-pad" style="margin-bottom:1.5rem">' +
        '<h3>Tujuan belajar bab ini</h3>' +
        '<ol class="obj-list">' + ch.objectives.map((o) => '<li><span>' + esc(o) + '</span></li>').join("") + '</ol>' +
      '</section>' +

      sections +

      '<section class="card card-pad" style="margin-top:1.5rem;background:var(--brass-soft);border-color:rgba(168,121,31,0.4)">' +
        '<h3 style="color:var(--brass)">🎯 Fokus ujian — ' + esc(ch.ref) + '</h3>' +
        '<div style="font-size:0.9rem;color:var(--ink-soft);line-height:1.75">' + ch.exam + '</div>' +
      '</section>' +

      '<div class="chapter-nav">' +
        (prev ? '<a class="btn" href="#/materi/' + prev.id + '">← ' + esc(prev.ref) + '</a>' : '<span></span>') +
        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap">' +
          '<button class="btn btn--small' + (isRead ? " btn--green" : "") + '" data-toggle-read="' + ch.id + '">' +
            (isRead ? "✓ Sudah dibaca" : "Tandai sudah dibaca") + '</button>' +
          '<a class="btn btn--small btn--gold" href="#/flashcards/' + ch.id + '">Flashcards ' + esc(ch.ref) + '</a>' +
          '<a class="btn btn--small btn--primary" href="#/kuis/' + ch.id + '">Kuis ' + esc(ch.ref) + '</a>' +
        '</div>' +
        (next ? '<a class="btn" href="#/materi/' + next.id + '">' + esc(next.ref) + ' →</a>' : '<span></span>') +
      '</div></div>';
  }

  /* ============================================================
     VIEW: FLASHCARDS
     ============================================================ */
  let fcState = { ch: "all", order: [], idx: 0, flipped: false };

  function fcInit(ch) {
    const pool = cardsFor(ch);
    fcState = { ch: ch, order: shuffled(pool.map((c) => CARDS.indexOf(c))), idx: 0, flipped: false };
  }

  function viewFlashcards(ch) {
    if (fcState.ch !== ch || !fcState.order.length) fcInit(ch);
    const mastered = store.get("fc_mastered", []);
    const total = fcState.order.length;

    const picker = '<div class="session-picker">' +
      '<button data-goto="#/flashcards/all" class="has-content' + (ch === "all" ? " active" : "") + '" title="Semua bab">ALL</button>' +
      CH.map((c) => '<button data-goto="#/flashcards/' + c.id + '" class="has-content' + (c.id === ch ? " active" : "") +
        '" title="' + esc(c.title) + '">' + c.ref.replace("CM", "") + '</button>').join("") + '</div>';

    if (!total) {
      return '<div class="view"><p class="eyebrow">Latihan aktif</p><h1 class="view-title">Flashcards</h1>' +
        picker + '<div class="card empty-state"><h4>Belum ada kartu untuk bab ini</h4></div></div>';
    }

    const gi = fcState.order[fcState.idx];
    const card = CARDS[gi];
    const isMastered = mastered.includes(gi);
    const chLabel = "CM" + card.ch;
    const pct = ((fcState.idx + 1) / total);

    return '<div class="view">' +
      '<p class="eyebrow">Latihan aktif · active recall</p>' +
      '<h1 class="view-title">Flashcards</h1>' +
      '<p class="view-sub">Klik kartu untuk membalik. Tandai <em>Sudah hafal</em> hanya jika kamu bisa menjawab ' +
      'tanpa melihat — menandai terlalu cepat adalah cara tercepat menipu diri sendiri.</p>' +
      picker +
      '<div class="fc-toolbar">' +
        '<button class="btn btn--small" id="fcShuffle">🔀 Acak ulang</button>' +
        '<button class="btn btn--small btn--ghost" id="fcResetMastered">Reset penguasaan</button>' +
        '<span class="fc-counter">' + (fcState.idx + 1) + " / " + total + ' · ' + mastered.length + ' dikuasai</span>' +
      '</div>' +
      '<div class="fc-progress"><i style="transform:scaleX(' + pct + ')"></i></div>' +
      '<div class="fc-stage"><div class="fc-card' + (fcState.flipped ? " flipped" : "") + '" id="fcCard" tabindex="0" role="button" aria-label="Balik kartu">' +
        '<div class="fc-face fc-front">' +
          '<span class="fc-eyebrow">' + chLabel + (isMastered ? " · ✓ dikuasai" : "") + '</span>' +
          '<div class="fc-q">' + esc(card.q) + '</div>' +
          '<span class="fc-hint">Klik untuk melihat jawaban</span>' +
        '</div>' +
        '<div class="fc-face fc-back">' +
          '<span class="fc-eyebrow">Jawaban · ' + chLabel + '</span>' +
          '<div class="fc-a">' + card.a + '</div>' +
        '</div>' +
      '</div></div>' +
      '<div class="fc-actions">' +
        '<button class="btn" id="fcPrev">← Sebelumnya</button>' +
        '<button class="btn ' + (isMastered ? "btn--green" : "btn--gold") + '" id="fcMaster">' +
          (isMastered ? "✓ Sudah hafal" : "Tandai sudah hafal") + '</button>' +
        '<button class="btn btn--primary" id="fcNext">Berikutnya →</button>' +
      '</div>' +
      '<p style="text-align:center;font-size:0.78rem;color:var(--ink-faint);margin-top:1rem">' +
      'Pintasan keyboard: <strong>spasi</strong> balik kartu · <strong>←/→</strong> pindah kartu</p>' +
      '</div>';
  }

  function fcRender() {
    app.innerHTML = viewFlashcards(fcState.ch);
    bindAll();
  }

  /* ============================================================
     VIEW: KUIS
     ============================================================ */
  let qzState = null;

  function qzStart(mode) {
    const pool = quizPool(mode);
    const picked = shuffled(pool);
    qzState = {
      mode: mode,
      qs: picked.map(prepareQuestion),
      idx: 0,
      answers: [],
      picked: null,
      finished: false
    };
  }

  function modeLabel(mode) {
    if (mode === "mid") return "Simulasi Mid-term (CM1–CM6)";
    if (mode === "final") return "Simulasi Final (CM7–CM12)";
    if (mode === "all") return "Semua bab (CM1–CM12)";
    const c = getChapter(Number(mode));
    return c ? c.ref + " — " + c.title : "Kuis";
  }

  function viewKuis(mode) {
    if (!qzState || qzState.mode !== mode) qzStart(mode);

    const modes = '<div class="quiz-modes">' +
      '<button class="btn btn--small' + (mode === "mid" ? " btn--primary" : "") + '" data-goto="#/kuis/mid">📝 Mid-term</button>' +
      '<button class="btn btn--small' + (mode === "final" ? " btn--primary" : "") + '" data-goto="#/kuis/final">📝 Final</button>' +
      '<button class="btn btn--small' + (mode === "all" ? " btn--primary" : "") + '" data-goto="#/kuis/all">Semua bab</button>' +
      '</div>' +
      '<div class="session-picker">' + CH.map((c) =>
        '<button data-goto="#/kuis/' + c.id + '" class="has-content' + (String(c.id) === String(mode) ? " active" : "") +
        '" title="' + esc(c.title) + '">' + c.ref.replace("CM", "") + '</button>').join("") + '</div>';

    const head = '<p class="eyebrow">' + esc(modeLabel(mode)) + '</p><h1 class="view-title">Kuis</h1>';

    if (qzState.finished) {
      const correct = qzState.answers.filter((a) => a.correct).length;
      const total = qzState.qs.length;
      const pct = Math.round(correct / total * 100);
      const cls = pct >= 80 ? "" : pct >= 60 ? "mid" : "low";
      const verdict = pct >= 90 ? "Sangat baik — kamu siap." :
        pct >= 80 ? "Baik. Rapikan bagian yang masih meleset." :
        pct >= 60 ? "Cukup. Baca ulang bab yang salah sebelum ujian." :
        "Perlu diulang. Baca materinya dulu, baru kembali ke kuis.";

      const misses = qzState.answers.map(function (a, i) {
        if (a.correct) return "";
        const q = qzState.qs[i];
        return '<div class="qr-item miss"><b>CM' + q.ch + ' · ' + esc(q.q) + '</b>' +
          '<div style="color:var(--clay);margin-bottom:0.2rem">Jawabanmu: ' + esc(q.opts[a.picked]) + '</div>' +
          '<div style="color:var(--pine)">Benar: ' + esc(q.opts[q.a]) + '</div>' +
          '<div style="margin-top:0.4rem;color:var(--ink-soft)">' + q.why + '</div></div>';
      }).join("");

      const byCh = {};
      qzState.answers.forEach(function (a, i) {
        const c = qzState.qs[i].ch;
        if (!byCh[c]) byCh[c] = { ok: 0, n: 0 };
        byCh[c].n++; if (a.correct) byCh[c].ok++;
      });
      const chBreak = Object.keys(byCh).sort((a, b) => a - b).map((c) =>
        '<span class="tag' + (byCh[c].ok === byCh[c].n ? "" : " tag--exam") + '">CM' + c + ": " + byCh[c].ok + "/" + byCh[c].n + '</span>').join("");

      return '<div class="view">' + head + modes +
        '<div class="card quiz-result">' +
          '<div class="quiz-score ' + cls + '">' + pct + '%</div>' +
          '<div class="quiz-verdict">' + verdict + '</div>' +
          '<div class="quiz-detail">' + correct + ' benar dari ' + total + ' soal</div>' +
          '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;margin-bottom:1.4rem">' + chBreak + '</div>' +
          '<div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">' +
            '<button class="btn btn--primary" id="qzRetry">Ulangi kuis</button>' +
            '<a class="btn" href="#/materi/1">Buka materi</a>' +
          '</div>' +
          (misses ? '<div class="quiz-review"><h4>Yang perlu kamu ulang</h4>' + misses + '</div>' :
            '<p style="margin-top:1.5rem;color:var(--pine);font-weight:600">Sempurna — tidak ada yang salah.</p>') +
        '</div></div>';
    }

    const q = qzState.qs[qzState.idx];
    const answered = qzState.picked !== null;
    const letters = ["A", "B", "C", "D"];

    const opts = q.opts.map(function (o, i) {
      let cls = "quiz-opt";
      if (answered) {
        if (i === q.a) cls += " correct";
        else if (i === qzState.picked) cls += " wrong";
        else cls += " dimmed";
      }
      return '<button class="' + cls + '" data-opt="' + i + '"' + (answered ? " disabled" : "") + '>' +
        '<span class="k">' + letters[i] + '</span><span>' + esc(o) + '</span></button>';
    }).join("");

    return '<div class="view">' + head + modes +
      '<div class="quiz-shell">' +
        '<div class="quiz-meta">' +
          '<span class="quiz-count">Soal ' + (qzState.idx + 1) + ' / ' + qzState.qs.length + '</span>' +
          '<span class="quiz-bar"><i style="transform:scaleX(' + ((qzState.idx + (answered ? 1 : 0)) / qzState.qs.length) + ')"></i></span>' +
          '<span class="tag">CM' + q.ch + '</span>' +
        '</div>' +
        '<div class="card card-pad">' +
          '<div class="quiz-q">' + esc(q.q) + '</div>' +
          '<div class="quiz-opts">' + opts + '</div>' +
          (answered ? '<div class="quiz-explain"><strong>' +
            (qzState.picked === q.a ? "Benar. " : "Belum tepat. ") + '</strong>' + q.why + '</div>' : "") +
          (answered ? '<div class="quiz-foot"><button class="btn btn--primary" id="qzNext">' +
            (qzState.idx === qzState.qs.length - 1 ? "Lihat hasil" : "Soal berikutnya →") + '</button></div>' : "") +
        '</div>' +
      '</div></div>';
  }

  function qzRender() {
    app.innerHTML = viewKuis(qzState.mode);
    bindAll();
  }

  /* ============================================================
     VIEW: KASUS (penganalisis dilema etis)
     ============================================================ */
  const LENSES = [
    { key: "conseq", name: "Consequentialist", sub: "utilitarianism", q: "Siapa diuntungkan dan siapa dirugikan? Seberapa besar, dan siapa yang menanggung biayanya?" },
    { key: "duty", name: "Ethics of duty", sub: "Kant", q: "Apakah prinsip di balik keputusan ini dapat diuniversalkan? Adakah pihak yang diperlakukan semata sebagai sarana?" },
    { key: "rights", name: "Rights & justice", sub: "Locke, Rawls", q: "Hak siapa yang dilanggar? Apakah proses dan hasilnya adil bila kamu tidak tahu akan berada di posisi mana?" },
    { key: "virtue", name: "Virtue ethics", sub: "Aristoteles", q: "Karakter seperti apa yang ditunjukkan keputusan ini? Apakah kamu bangga menjelaskannya sepuluh tahun lagi?" },
    { key: "discourse", name: "Discourse ethics", sub: "Habermas", q: "Apakah pihak terdampak dilibatkan dalam dialog yang setara, atau keputusan dijatuhkan dari atas?" }
  ];

  function blankCase() {
    return { id: "c" + Date.now(), title: "", desc: "", stk: [{ n: "", s: "" }, { n: "", s: "" }, { n: "", s: "" }], lens: {}, verdict: "", alts: "" };
  }

  function getCases() {
    const c = store.get("cases", null);
    if (!c || !c.list || !c.list.length) return { list: [blankCase()], active: 0 };
    return c;
  }

  function viewKasus() {
    const cs = getCases();
    const k = cs.list[cs.active] || cs.list[0];

    const stkRows = k.stk.map((row, i) =>
      '<div class="stk-row">' +
        '<input type="text" data-stk="n" data-i="' + i + '" placeholder="Stakeholder" value="' + esc(row.n) + '">' +
        '<input type="text" data-stk="s" data-i="' + i + '" placeholder="Kepentingan / stake · power, legitimacy, urgency" value="' + esc(row.s) + '">' +
        '<button class="stk-remove" data-stk-del="' + i + '" title="Hapus" aria-label="Hapus baris">×</button>' +
      '</div>').join("");

    const lensList = LENSES.map((l) =>
      '<div class="lens">' +
        '<div class="lens-head"><b>' + esc(l.name) + '</b><span>' + esc(l.sub) + '</span></div>' +
        '<p class="lens-q">' + esc(l.q) + '</p>' +
        '<textarea rows="3" data-lens="' + l.key + '" placeholder="Analisismu…">' + esc(k.lens[l.key] || "") + '</textarea>' +
      '</div>').join("");

    const selector = '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1.5rem">' +
      '<select id="caseSelect" style="font-family:var(--sans);font-size:0.85rem;padding:0.45rem 0.7rem;border-radius:9px;border:1px solid var(--line-strong);background:var(--card);color:var(--ink)">' +
      cs.list.map((c, i) => '<option value="' + i + '"' + (i === cs.active ? " selected" : "") + '>' +
        esc(c.title || "Kasus tanpa judul " + (i + 1)) + '</option>').join("") + '</select>' +
      '<button class="btn btn--small btn--gold" id="caseNew">+ Kasus baru</button>' +
      '<button class="btn btn--small" id="caseCopy">📋 Salin ringkasan</button>' +
      (cs.list.length > 1 ? '<button class="btn btn--small btn--red-outline" id="caseDel">Hapus kasus ini</button>' : "") +
      '<span id="caseSaved" class="notes-saved" style="margin-left:auto"></span></div>';

    return '<div class="view">' +
      '<p class="eyebrow">Alat kerja · CO3 &amp; CG3</p>' +
      '<h1 class="view-title">Penganalisis Kasus Etis</h1>' +
      '<p class="view-sub">Kerangka lima langkah dari CM3 yang bisa kamu pakai untuk tugas individu, diskusi kasus ' +
      'kelompok, dan soal esai ujian. Semua isian tersimpan otomatis di browser ini.</p>' +

      selector +

      '<div class="case-grid">' +
        '<div class="stack">' +
          '<section class="card card-pad">' +
            '<h3>1 · Identifikasi dilema</h3>' +
            '<div class="field"><label for="caseTitle">Judul kasus</label>' +
              '<input type="text" id="caseTitle" value="' + esc(k.title) + '" placeholder="Misalnya: Volkswagen Dieselgate"></div>' +
            '<div class="field"><label for="caseDesc">Apa dilemanya?</label>' +
              '<textarea id="caseDesc" rows="5" placeholder="Siapa berbuat apa, kepada siapa, dan apa yang dipertaruhkan? Tulis sespesifik mungkin — dilema yang kabur menghasilkan analisis yang kabur.">' + esc(k.desc) + '</textarea>' +
              '<p class="hint">Hindari merumuskan sebagai pertanyaan biner "untung atau etis".</p></div>' +
          '</section>' +

          '<section class="card card-pad">' +
            '<h3>2 · Peta stakeholder</h3>' +
            '<div class="stk-rows">' + stkRows + '</div>' +
            '<button class="btn btn--small" id="stkAdd" style="margin-top:0.7rem">+ Tambah stakeholder</button>' +
            '<p class="hint" style="margin-top:0.6rem">Untuk tiap pihak, sebutkan <em>stake</em>-nya dan atribut ' +
            'power / legitimacy / urgency yang dimilikinya. Dilema etis lahir dari klaim yang sama-sama sah tetapi bertabrakan.</p>' +
          '</section>' +

          '<section class="card card-pad">' +
            '<h3>4 · Penilaian &amp; alternatif</h3>' +
            '<div class="field"><label for="caseVerdict">Penilaian etismu (ambil posisi)</label>' +
              '<textarea id="caseVerdict" rows="4" placeholder="Nyatakan penilaianmu dengan jelas dan akui trade-off-nya.">' + esc(k.verdict) + '</textarea></div>' +
            '<div class="field"><label for="caseAlts">Alternatif solusi</label>' +
              '<textarea id="caseAlts" rows="4" placeholder="Minimal dua alternatif selain pilihan yang tampak tersedia — inilah moral imagination yang diminta CO3.">' + esc(k.alts) + '</textarea></div>' +
          '</section>' +
        '</div>' +

        '<div class="stack">' +
          '<section class="card card-pad">' +
            '<h3>3 · Terapkan lensa teori</h3>' +
            '<p style="font-size:0.84rem;color:var(--ink-soft);margin-bottom:1rem">Isi minimal tiga lensa. ' +
            'Jawaban yang memakai beberapa lensa sekaligus dinilai lebih tinggi daripada yang setia pada satu teori.</p>' +
            '<div class="lens-list">' + lensList + '</div>' +
          '</section>' +

          '<section class="case-output" id="caseOut"></section>' +
        '</div>' +
      '</div></div>';
  }

  function caseSummary(k) {
    const stk = k.stk.filter((r) => r.n.trim());
    const lens = LENSES.filter((l) => (k.lens[l.key] || "").trim());
    const filled = [k.title, k.desc, stk.length ? "x" : "", lens.length >= 3 ? "x" : "", k.verdict, k.alts].filter((x) => String(x).trim()).length;

    let h = '<h4>' + (k.title ? esc(k.title) : "Ringkasan analisis") + '</h4>';
    h += '<p style="font-size:0.78rem;color:var(--brass-bright);font-weight:700">Kelengkapan: ' + filled + '/6 bagian</p>';

    if (k.desc.trim()) { h += '<p class="co-label">Dilema</p><p>' + esc(k.desc) + '</p>'; }
    if (stk.length) {
      h += '<p class="co-label">Stakeholder (' + stk.length + ')</p><ul>' +
        stk.map((r) => '<li><strong>' + esc(r.n) + '</strong>' + (r.s.trim() ? " — " + esc(r.s) : "") + '</li>').join("") + '</ul>';
    }
    if (lens.length) {
      h += '<p class="co-label">Lensa teori (' + lens.length + '/5)</p>';
      lens.forEach((l) => { h += '<p><strong>' + esc(l.name) + ':</strong> ' + esc(k.lens[l.key]) + '</p>'; });
    }
    if (k.verdict.trim()) { h += '<p class="co-label">Penilaian</p><p>' + esc(k.verdict) + '</p>'; }
    if (k.alts.trim()) { h += '<p class="co-label">Alternatif</p><p>' + esc(k.alts) + '</p>'; }

    if (filled < 6) {
      const todo = [];
      if (!k.title.trim()) todo.push("judul");
      if (!k.desc.trim()) todo.push("rumusan dilema");
      if (!stk.length) todo.push("stakeholder");
      if (lens.length < 3) todo.push("minimal tiga lensa teori");
      if (!k.verdict.trim()) todo.push("penilaian etis");
      if (!k.alts.trim()) todo.push("alternatif solusi");
      h += '<p class="co-label">Belum lengkap</p><p style="color:var(--brass-bright)">' + esc(todo.join(" · ")) + '</p>';
    }
    return h;
  }

  function caseText(k) {
    const L = [];
    L.push("ANALISIS KASUS ETIS — " + (k.title || "tanpa judul"));
    L.push("");
    if (k.desc.trim()) { L.push("1. DILEMA"); L.push(k.desc); L.push(""); }
    const stk = k.stk.filter((r) => r.n.trim());
    if (stk.length) {
      L.push("2. STAKEHOLDER");
      stk.forEach((r) => L.push("   - " + r.n + (r.s.trim() ? ": " + r.s : "")));
      L.push("");
    }
    const lens = LENSES.filter((l) => (k.lens[l.key] || "").trim());
    if (lens.length) {
      L.push("3. ANALISIS TEORI");
      lens.forEach((l) => { L.push("   " + l.name + " (" + l.sub + "):"); L.push("   " + k.lens[l.key]); });
      L.push("");
    }
    if (k.verdict.trim()) { L.push("4. PENILAIAN ETIS"); L.push(k.verdict); L.push(""); }
    if (k.alts.trim()) { L.push("5. ALTERNATIF SOLUSI"); L.push(k.alts); }
    return L.join("\n");
  }

  /* ============================================================
     VIEW: GLOSARIUM
     ============================================================ */
  let glosQuery = "", glosCh = "all";

  function viewGlosarium() {
    const q = glosQuery.trim().toLowerCase();
    let list = GLOS.slice();
    if (glosCh !== "all") list = list.filter((g) => g.ch === Number(glosCh));
    if (q) list = list.filter((g) =>
      g.term.toLowerCase().includes(q) || g.id.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
    list.sort((a, b) => a.term.localeCompare(b.term));

    const picker = '<div class="session-picker">' +
      '<button data-glos-ch="all" class="has-content' + (glosCh === "all" ? " active" : "") + '">ALL</button>' +
      CH.map((c) => '<button data-glos-ch="' + c.id + '" class="has-content' + (String(glosCh) === String(c.id) ? " active" : "") +
        '" title="' + esc(c.title) + '">' + c.ref.replace("CM", "") + '</button>').join("") + '</div>';

    const items = list.length ? list.map((g) =>
      '<div class="glos-item"><div class="glos-term">' + esc(g.term) + '</div>' +
      '<div class="glos-id">' + esc(g.id) + '</div>' +
      '<div class="glos-def">' + esc(g.def) + '</div>' +
      '<div class="glos-src"><a href="#/materi/' + g.ch + '" style="color:var(--pine);text-decoration:none">CM' + g.ch + ' ↗</a></div></div>').join("")
      : '<div class="card empty-state" style="grid-column:1/-1"><h4>Tidak ada istilah yang cocok</h4>' +
        '<p>Coba kata kunci lain, atau pilih bab yang berbeda.</p></div>';

    return '<div class="view">' +
      '<p class="eyebrow">' + GLOS.length + ' istilah kunci</p>' +
      '<h1 class="view-title">Glosarium</h1>' +
      '<p class="view-sub">Cari istilah dalam Bahasa Inggris maupun Indonesia. Ujian memakai istilah aslinya, ' +
      'jadi biasakan mengenali keduanya.</p>' +
      '<div class="glos-search">' +
        '<input type="search" id="glosInput" placeholder="Cari istilah, misalnya: stakeholder, moral intensity, greenwashing…" value="' + esc(glosQuery) + '">' +
        '<span class="glos-count">' + list.length + ' hasil</span>' +
      '</div>' + picker +
      '<div class="glos-list">' + items + '</div></div>';
  }

  /* ============================================================
     VIEW: CATATAN
     ============================================================ */
  function viewCatatan(sid) {
    const notes = store.get("notes", {});
    const annots = store.get("annots", []);
    const active = sid || 1;
    const s = DATA.sessions.find((x) => x.id === active) || DATA.sessions[0];

    const navBtns = DATA.sessions.map((x) =>
      '<button data-note-session="' + x.id + '" class="' + (x.id === active ? "active" : "") + '">' +
      'Sesi ' + x.id + (notes[x.id] && notes[x.id].trim() ? ' <span class="dot">•</span>' : "") + '</button>').join("");

    const chAnnots = annots.filter((a) => s.chapter && a.ch === s.chapter);
    const annotList = chAnnots.length
      ? '<div class="ann-list">' + chAnnots.map((a, i) =>
          '<div class="ann-item"><blockquote>“' + esc(a.text) + '”</blockquote>' +
          '<div class="ann-note' + (a.note ? "" : " ann-note--empty") + '">' + esc(a.note || "Tanpa catatan") + '</div>' +
          '<div class="ann-item-actions">' +
            '<a class="btn btn--small" href="#/materi/' + a.ch + '">Buka di materi</a>' +
            '<button class="btn btn--small btn--red-outline" data-ann-del="' + esc(a.key) + '">Hapus</button>' +
          '</div></div>').join("") + '</div>'
      : '<p class="ann-empty">Belum ada sorotan untuk bab ini. Buka <a href="#/materi/' + (s.chapter || 1) + '">materi</a>, ' +
        'seleksi kalimat penting, lalu klik tombol <strong>Tandai</strong> yang muncul.</p>';

    return '<div class="view">' +
      '<p class="eyebrow">Tersimpan di browser ini</p>' +
      '<h1 class="view-title">Catatan per Sesi</h1>' +
      '<p class="view-sub">Ruang untuk rangkuman satu halamanmu, poin diskusi kelas, dan pertanyaan untuk dosen. ' +
      'Catatan tersimpan otomatis saat kamu mengetik.</p>' +
      '<div class="notes-grid">' +
        '<div class="notes-nav">' + navBtns + '</div>' +
        '<div class="notes-editor">' +
          '<h3 style="font-family:var(--serif);font-size:1.2rem;margin-bottom:0.3rem">Sesi ' + s.id + ' — ' + esc(s.topic) + '</h3>' +
          '<p style="font-size:0.82rem;color:var(--ink-faint);margin-bottom:0.9rem">' +
            (s.ref ? esc(s.ref) + " · " : "") + esc(s.subObjective) + '</p>' +
          '<textarea id="noteArea" placeholder="Tulis rangkumanmu di sini…">' + esc(notes[active] || "") + '</textarea>' +
          '<div class="notes-foot">' +
            '<button class="btn btn--small btn--ghost" id="noteClear">Kosongkan</button>' +
            '<span class="notes-saved" id="noteSaved"></span>' +
          '</div>' +
          '<h4 class="ann-heading">Sorotan dari materi' + (s.chapter ? " CM" + s.chapter : "") + '</h4>' +
          annotList +
        '</div>' +
      '</div></div>';
  }

  /* ============================================================
     SOROTAN & ANOTASI (highlight)
     ============================================================ */
  let hlPopup = null, hlPanel = null;

  function annotKey(ch, sec, text, occ) { return ch + "|" + sec + "|" + occ + "|" + text.slice(0, 60); }

  function textNodesIn(root) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        let p = n.parentNode;
        while (p && p !== root) {
          const t = p.nodeName;
          if (t === "MARK" || t === "SCRIPT" || t === "STYLE" || t === "SVG" || t === "svg") return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n; while ((n = w.nextNode())) out.push(n);
    return out;
  }

  function applyAnnotation(scope, a) {
    const nodes = textNodesIn(scope);
    let seen = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let from = 0, pos;
      while ((pos = node.nodeValue.indexOf(a.text, from)) !== -1) {
        if (seen === a.occ) {
          try {
            const r = document.createRange();
            r.setStart(node, pos);
            r.setEnd(node, pos + a.text.length);
            const mark = document.createElement("mark");
            mark.className = "hl" + (a.note ? " hl--noted" : "");
            mark.dataset.annKey = a.key;
            r.surroundContents(mark);
          } catch (e) { /* teks melintasi elemen — lewati */ }
          return true;
        }
        seen++;
        from = pos + a.text.length;
      }
    }
    return false;
  }

  function applyAllAnnotations() {
    const annots = store.get("annots", []);
    document.querySelectorAll("[data-annot-scope]").forEach(function (scope) {
      const parts = scope.dataset.annotScope.split(":");
      const ch = Number(parts[0]), sec = Number(parts[1]);
      annots.filter((a) => a.ch === ch && a.sec === sec)
        .sort((a, b) => a.occ - b.occ)
        .forEach((a) => applyAnnotation(scope, a));
    });
  }

  function hideHlUi() {
    if (hlPopup) { hlPopup.remove(); hlPopup = null; }
    if (hlPanel) { hlPanel.remove(); hlPanel = null; }
  }

  function placeAt(el, x, y) {
    document.body.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = x - w / 2, top = y - h - 10;
    left = Math.max(8 + window.scrollX, Math.min(left, window.scrollX + document.documentElement.clientWidth - w - 8));
    if (top < window.scrollY + 8) top = y + 22;
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function currentSelectionInfo() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return null;
    const text = sel.toString().trim();
    if (text.length < 4 || text.length > 400) return null;
    const range = sel.getRangeAt(0);
    let scope = range.commonAncestorContainer;
    if (scope.nodeType === 3) scope = scope.parentNode;
    scope = scope.closest ? scope.closest("[data-annot-scope]") : null;
    if (!scope) return null;

    /* hitung kemunculan ke berapa dalam scope ini */
    const full = scope.textContent;
    const pre = document.createRange();
    pre.selectNodeContents(scope);
    pre.setEnd(range.startContainer, range.startOffset);
    const before = pre.toString();
    let occ = 0, from = 0, p;
    while ((p = full.indexOf(text, from)) !== -1 && p < before.length) { occ++; from = p + text.length; }

    const parts = scope.dataset.annotScope.split(":");
    const rect = range.getBoundingClientRect();
    return {
      text: text, occ: occ,
      ch: Number(parts[0]), sec: Number(parts[1]),
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY
    };
  }

  function openAnnotPanel(key, x, y) {
    hideHlUi();
    const annots = store.get("annots", []);
    const a = annots.find((z) => z.key === key);
    if (!a) return;
    hlPanel = document.createElement("div");
    hlPanel.id = "hlPanel";
    hlPanel.innerHTML =
      '<div class="hl-quote">“' + esc(a.text) + '”</div>' +
      '<textarea rows="3" placeholder="Catatanmu tentang kalimat ini…">' + esc(a.note || "") + '</textarea>' +
      '<div class="hl-actions">' +
        '<button class="btn btn--small btn--primary" data-hl="save">Simpan</button>' +
        '<button class="btn btn--small btn--red-outline" data-hl="del">Hapus sorotan</button>' +
        '<button class="btn btn--small btn--ghost" data-hl="close">Tutup</button>' +
      '</div>';
    placeAt(hlPanel, x, y);
    const ta = hlPanel.querySelector("textarea");
    ta.focus();

    hlPanel.addEventListener("click", function (e) {
      const b = e.target.closest("[data-hl]");
      if (!b) return;
      const act = b.dataset.hl;
      const list = store.get("annots", []);
      const item = list.find((z) => z.key === key);
      if (act === "save" && item) {
        item.note = ta.value.trim();
        store.set("annots", list);
        const mark = document.querySelector('mark[data-ann-key="' + CSS.escape(key) + '"]');
        if (mark) mark.classList.toggle("hl--noted", !!item.note);
      } else if (act === "del") {
        store.set("annots", list.filter((z) => z.key !== key));
        const mark = document.querySelector('mark[data-ann-key="' + CSS.escape(key) + '"]');
        if (mark) { const p = mark.parentNode; while (mark.firstChild) p.insertBefore(mark.firstChild, mark); p.removeChild(mark); p.normalize(); }
      }
      hideHlUi();
    });
  }

  document.addEventListener("mouseup", function (e) {
    if (e.target.closest && (e.target.closest("#hlPanel") || e.target.closest("#hlPopup"))) return;
    setTimeout(function () {
      const info = currentSelectionInfo();
      hideHlUi();
      if (!info) return;
      hlPopup = document.createElement("button");
      hlPopup.id = "hlPopup";
      hlPopup.textContent = "✎ Tandai";
      hlPopup.addEventListener("click", function () {
        const list = store.get("annots", []);
        const key = annotKey(info.ch, info.sec, info.text, info.occ);
        if (!list.some((z) => z.key === key)) {
          list.push({ key: key, ch: info.ch, sec: info.sec, text: info.text, occ: info.occ, note: "" });
          store.set("annots", list);
          const scope = document.querySelector('[data-annot-scope="' + info.ch + ':' + info.sec + '"]');
          if (scope) applyAnnotation(scope, list[list.length - 1]);
        }
        window.getSelection().removeAllRanges();
        hideHlUi();
        openAnnotPanel(key, info.x, info.y);
      });
      placeAt(hlPopup, info.x, info.y);
    }, 10);
  });

  document.addEventListener("mousedown", function (e) {
    if (e.target.closest && (e.target.closest("#hlPanel") || e.target.closest("#hlPopup") || e.target.closest("mark.hl"))) return;
    hideHlUi();
  });

  /* ============================================================
     BINDING
     ============================================================ */
  function bindAll() {
    /* navigasi tombol generik */
    app.querySelectorAll("[data-goto]").forEach((b) =>
      b.addEventListener("click", () => { location.hash = b.dataset.goto; }));

    /* silabus */
    app.querySelectorAll("[data-toggle-done]").forEach((b) =>
      b.addEventListener("click", function () {
        const id = Number(b.dataset.toggleDone);
        const d = store.get("done_sessions", []);
        store.set("done_sessions", d.includes(id) ? d.filter((x) => x !== id) : d.concat([id]));
        render();
      }));

    const sdInput = document.getElementById("startDate");
    if (sdInput) sdInput.addEventListener("change", function () {
      store.set("start_date", sdInput.value || null);
      render();
    });
    const clearDate = document.getElementById("clearDate");
    if (clearDate) clearDate.addEventListener("click", function () { store.set("start_date", null); render(); });

    /* materi */
    app.querySelectorAll("[data-toggle-read]").forEach((b) =>
      b.addEventListener("click", function () {
        const id = Number(b.dataset.toggleRead);
        const r = store.get("read_chapters", []);
        store.set("read_chapters", r.includes(id) ? r.filter((x) => x !== id) : r.concat([id]));
        render();
      }));

    /* kartu buka-tutup dalam materi */
    app.querySelectorAll(".exp-head").forEach((b) =>
      b.addEventListener("click", () => b.closest(".exp-card").classList.toggle("open")));

    /* widget moral intensity */
    app.querySelectorAll("[data-mi-widget]").forEach(function (w) {
      const sliders = w.querySelectorAll("[data-mi]");
      function update() {
        let total = 0;
        sliders.forEach(function (s) {
          total += Number(s.value);
          const out = w.querySelector('[data-mi-out="' + s.dataset.mi + '"]');
          if (out) out.textContent = s.value;
        });
        const bar = w.querySelector("[data-mi-bar]");
        const tot = w.querySelector("[data-mi-total]");
        const vd = w.querySelector("[data-mi-verdict]");
        if (bar) bar.style.transform = "scaleX(" + (total / 30) + ")";
        if (tot) tot.textContent = total + "/30";
        if (vd) {
          vd.textContent = total >= 24
            ? "Intensitas sangat tinggi — isu ini hampir pasti dikenali sebagai persoalan moral, dan mengabaikannya sulit dibela."
            : total >= 17
            ? "Intensitas sedang — sebagian orang akan melihatnya sebagai isu etis, sebagian menganggapnya keputusan teknis belaka."
            : "Intensitas rendah — justru di sinilah bahayanya: isu mudah lolos tanpa pernah dikenali sebagai persoalan moral.";
        }
      }
      sliders.forEach((s) => s.addEventListener("input", update));
      update();
    });

    /* sorotan tersimpan */
    applyAllAnnotations();
    app.querySelectorAll("mark.hl").forEach((m) =>
      m.addEventListener("click", function (e) {
        e.stopPropagation();
        const r = m.getBoundingClientRect();
        openAnnotPanel(m.dataset.annKey, r.left + r.width / 2 + window.scrollX, r.top + window.scrollY);
      }));

    /* flashcards */
    const fcCard = document.getElementById("fcCard");
    if (fcCard) {
      fcCard.addEventListener("click", function () { fcState.flipped = !fcState.flipped; fcRender(); });
      fcCard.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); fcState.flipped = !fcState.flipped; fcRender(); }
      });
    }
    const fcNext = document.getElementById("fcNext");
    if (fcNext) fcNext.addEventListener("click", function () {
      fcState.idx = (fcState.idx + 1) % fcState.order.length; fcState.flipped = false; fcRender();
    });
    const fcPrev = document.getElementById("fcPrev");
    if (fcPrev) fcPrev.addEventListener("click", function () {
      fcState.idx = (fcState.idx - 1 + fcState.order.length) % fcState.order.length; fcState.flipped = false; fcRender();
    });
    const fcMaster = document.getElementById("fcMaster");
    if (fcMaster) fcMaster.addEventListener("click", function () {
      const gi = fcState.order[fcState.idx];
      const m = store.get("fc_mastered", []);
      store.set("fc_mastered", m.includes(gi) ? m.filter((x) => x !== gi) : m.concat([gi]));
      fcRender();
    });
    const fcShuffle = document.getElementById("fcShuffle");
    if (fcShuffle) fcShuffle.addEventListener("click", function () { fcInit(fcState.ch); fcRender(); });
    const fcReset = document.getElementById("fcResetMastered");
    if (fcReset) fcReset.addEventListener("click", function () {
      if (confirm("Hapus semua tanda penguasaan flashcard?")) { store.set("fc_mastered", []); fcRender(); }
    });

    /* kuis */
    app.querySelectorAll("[data-opt]").forEach((b) =>
      b.addEventListener("click", function () {
        if (qzState.picked !== null) return;
        qzState.picked = Number(b.dataset.opt);
        qzRender();
      }));
    const qzNext = document.getElementById("qzNext");
    if (qzNext) qzNext.addEventListener("click", function () {
      const q = qzState.qs[qzState.idx];
      qzState.answers.push({ picked: qzState.picked, correct: qzState.picked === q.a });
      qzState.picked = null;
      if (qzState.idx === qzState.qs.length - 1) {
        qzState.finished = true;
        const correct = qzState.answers.filter((a) => a.correct).length;
        const pct = Math.round(correct / qzState.qs.length * 100);
        const best = store.get("quiz_best", {});
        if (best[qzState.mode] == null || pct > best[qzState.mode]) { best[qzState.mode] = pct; store.set("quiz_best", best); }
      } else {
        qzState.idx++;
      }
      qzRender();
    });
    const qzRetry = document.getElementById("qzRetry");
    if (qzRetry) qzRetry.addEventListener("click", function () { qzStart(qzState.mode); qzRender(); });

    /* glosarium */
    const gi = document.getElementById("glosInput");
    if (gi) gi.addEventListener("input", function () {
      glosQuery = gi.value;
      const pos = gi.selectionStart;
      app.innerHTML = viewGlosarium();
      bindAll();
      const ni = document.getElementById("glosInput");
      if (ni) { ni.focus(); try { ni.setSelectionRange(pos, pos); } catch (e) {} }
    });
    app.querySelectorAll("[data-glos-ch]").forEach((b) =>
      b.addEventListener("click", function () { glosCh = b.dataset.glosCh; app.innerHTML = viewGlosarium(); bindAll(); }));

    /* catatan */
    app.querySelectorAll("[data-note-session]").forEach((b) =>
      b.addEventListener("click", function () { location.hash = "#/catatan/" + b.dataset.noteSession; }));

    const noteArea = document.getElementById("noteArea");
    if (noteArea) {
      const sid = Number((location.hash.split("/")[2] || 1));
      let t = null;
      noteArea.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          const n = store.get("notes", {});
          n[sid] = noteArea.value;
          store.set("notes", n);
          const s = document.getElementById("noteSaved");
          if (s) { s.textContent = "✓ Tersimpan"; setTimeout(() => { s.textContent = ""; }, 1600); }
        }, 400);
      });
      const nc = document.getElementById("noteClear");
      if (nc) nc.addEventListener("click", function () {
        if (!confirm("Kosongkan catatan sesi ini?")) return;
        const n = store.get("notes", {}); n[sid] = ""; store.set("notes", n); render();
      });
    }

    app.querySelectorAll("[data-ann-del]").forEach((b) =>
      b.addEventListener("click", function () {
        const list = store.get("annots", []);
        store.set("annots", list.filter((z) => z.key !== b.dataset.annDel));
        render();
      }));

    bindCase();
  }

  function bindCase() {
    const out = document.getElementById("caseOut");
    if (!out) return;
    const cs = getCases();

    function current() { return getCases().list[getCases().active]; }
    function save(mutate) {
      const c = getCases();
      mutate(c.list[c.active]);
      store.set("cases", c);
      out.innerHTML = caseSummary(c.list[c.active]);
      const s = document.getElementById("caseSaved");
      if (s) { s.textContent = "✓ Tersimpan"; clearTimeout(s._t); s._t = setTimeout(() => { s.textContent = ""; }, 1600); }
    }

    out.innerHTML = caseSummary(cs.list[cs.active]);

    const bind = (id, field) => {
      const el = document.getElementById(id);
      if (!el) return;
      let t = null;
      el.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(() => save((k) => { k[field] = el.value; }), 350);
      });
    };
    bind("caseTitle", "title"); bind("caseDesc", "desc");
    bind("caseVerdict", "verdict"); bind("caseAlts", "alts");

    document.querySelectorAll("[data-lens]").forEach(function (ta) {
      let t = null;
      ta.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(() => save((k) => { k.lens[ta.dataset.lens] = ta.value; }), 350);
      });
    });

    document.querySelectorAll("[data-stk]").forEach(function (inp) {
      let t = null;
      inp.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(() => save((k) => { k.stk[Number(inp.dataset.i)][inp.dataset.stk] = inp.value; }), 350);
      });
    });

    document.querySelectorAll("[data-stk-del]").forEach((b) =>
      b.addEventListener("click", function () {
        const c = getCases();
        const k = c.list[c.active];
        if (k.stk.length <= 1) { k.stk = [{ n: "", s: "" }]; } else { k.stk.splice(Number(b.dataset.stkDel), 1); }
        store.set("cases", c); render();
      }));

    const add = document.getElementById("stkAdd");
    if (add) add.addEventListener("click", function () {
      const c = getCases(); c.list[c.active].stk.push({ n: "", s: "" }); store.set("cases", c); render();
    });

    const sel = document.getElementById("caseSelect");
    if (sel) sel.addEventListener("change", function () {
      const c = getCases(); c.active = Number(sel.value); store.set("cases", c); render();
    });

    const nw = document.getElementById("caseNew");
    if (nw) nw.addEventListener("click", function () {
      const c = getCases(); c.list.push(blankCase()); c.active = c.list.length - 1; store.set("cases", c); render();
    });

    const del = document.getElementById("caseDel");
    if (del) del.addEventListener("click", function () {
      if (!confirm("Hapus analisis kasus ini?")) return;
      const c = getCases(); c.list.splice(c.active, 1); c.active = 0;
      if (!c.list.length) c.list = [blankCase()];
      store.set("cases", c); render();
    });

    const copy = document.getElementById("caseCopy");
    if (copy) copy.addEventListener("click", function () {
      const txt = caseText(current());
      const done = () => { copy.textContent = "✓ Tersalin"; setTimeout(() => { copy.textContent = "📋 Salin ringkasan"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
      } else fallbackCopy(txt, done);
    });

    function fallbackCopy(txt, done) {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { alert("Salin manual:\n\n" + txt); }
      document.body.removeChild(ta);
    }
  }

  /* keyboard untuk flashcards */
  document.addEventListener("keydown", function (e) {
    if (!location.hash.startsWith("#/flashcards")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key === " ") { e.preventDefault(); fcState.flipped = !fcState.flipped; fcRender(); }
    else if (e.key === "ArrowRight") { fcState.idx = (fcState.idx + 1) % fcState.order.length; fcState.flipped = false; fcRender(); }
    else if (e.key === "ArrowLeft") { fcState.idx = (fcState.idx - 1 + fcState.order.length) % fcState.order.length; fcState.flipped = false; fcRender(); }
  });

  /* ============================================================
     ROUTER
     ============================================================ */
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const p = raw.split("/").filter(Boolean);
    return { view: p[0] || "dashboard", arg: p[1] || null };
  }

  function render() {
    hideHlUi();
    const r = parseHash();
    let html;

    switch (r.view) {
      case "silabus": html = viewSilabus(); break;
      case "materi": html = viewMateri(Number(r.arg) || 1); break;
      case "flashcards": html = viewFlashcards(r.arg === "all" || !r.arg ? "all" : Number(r.arg)); break;
      case "kuis": html = viewKuis(r.arg || "mid"); break;
      case "kasus": html = viewKasus(); break;
      case "glosarium": html = viewGlosarium(); break;
      case "catatan": html = viewCatatan(Number(r.arg) || 1); break;
      default: html = viewDashboard();
    }

    app.innerHTML = html;
    nav.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.dataset.view === r.view));
    bindAll();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", render);
  render();
})();
