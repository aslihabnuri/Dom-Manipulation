/* ============================================================
   BEfS Study Hub — Pustaka Diagram
   Seluruh diagram digambar ulang sebagai SVG/CSS inline agar
   tajam di segala ukuran layar, mengikuti palet aplikasi, dan
   dapat dibaca tanpa gambar eksternal.

   Dipanggil dari chapters.js lewat placeholder {{viz:nama}}.
   ============================================================ */

window.BEFS_VIZ = (function () {
  "use strict";

  /* pembungkus figure standar */
  function fig(svgOrHtml, caption, extra) {
    return '<figure class="visual-block">' + svgOrHtml +
      (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
      (extra || '') + '</figure>';
  }

  /* definisi mata panah, dipakai berulang */
  const ARROW =
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
    '<path d="M0,0 L10,5 L0,10 z" class="d-arrow-head"/></marker></defs>';

  return {

  /* ---------- CM1 ---------- */

  ethicsLaw: function () {
    return fig(
      '<svg viewBox="0 0 460 250" role="img" aria-label="Diagram irisan hukum dan etika">' +
      '<circle cx="175" cy="120" r="95" fill="rgba(51,96,127,0.14)" stroke="var(--slate)" stroke-width="1.5"/>' +
      '<circle cx="285" cy="120" r="95" fill="rgba(47,93,71,0.14)" stroke="var(--pine)" stroke-width="1.5"/>' +
      '<text x="112" y="42" class="d-label" text-anchor="middle" fill="var(--slate)">LEGAL</text>' +
      '<text x="350" y="42" class="d-label" text-anchor="middle" fill="var(--pine)">ETHICAL</text>' +
      '<text x="118" y="115" class="d-label--sm" text-anchor="middle">Legal, tapi</text>' +
      '<text x="118" y="128" class="d-label--sm" text-anchor="middle">tidak etis</text>' +
      '<text x="118" y="146" class="d-note" text-anchor="middle">tax avoidance</text>' +
      '<text x="230" y="115" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Legal &amp;</text>' +
      '<text x="230" y="128" class="d-label--sm" text-anchor="middle" fill="var(--pine)">etis</text>' +
      '<text x="230" y="146" class="d-note" text-anchor="middle">wilayah aman</text>' +
      '<text x="342" y="115" class="d-label--sm" text-anchor="middle">Etis, tapi</text>' +
      '<text x="342" y="128" class="d-label--sm" text-anchor="middle">ilegal</text>' +
      '<text x="342" y="146" class="d-note" text-anchor="middle">whistleblowing</text>' +
      '<rect x="180" y="222" width="100" height="22" rx="6" class="d-box--clay"/>' +
      '<text x="230" y="237" class="d-label--sm" text-anchor="middle" fill="var(--clay)">Ilegal &amp; tidak etis</text>' +
      '</svg>',
      'Etika bisnis terutama bekerja di irisan kiri: sah menurut hukum, tetapi tetap dipertanyakan secara moral.'
    );
  },

  globalGaps: function () {
    return fig(
      '<svg viewBox="0 0 560 190" class="wide" role="img" aria-label="Tiga celah globalisasi">' + ARROW +
      '<rect x="10" y="20" width="150" height="52" rx="10" class="d-box--dark"/>' +
      '<text x="85" y="42" class="d-label d-label--inv" text-anchor="middle">Bisnis global</text>' +
      '<text x="85" y="58" class="d-note" fill="rgba(233,239,228,0.7)" text-anchor="middle">lintas batas, cepat</text>' +
      '<rect x="400" y="20" width="150" height="52" rx="10" class="d-box"/>' +
      '<text x="475" y="42" class="d-label" text-anchor="middle">Tata kelola</text>' +
      '<text x="475" y="58" class="d-note" text-anchor="middle">nasional, lambat</text>' +
      '<path d="M170 46 H392" class="d-arrow" stroke-dasharray="6 4" marker-end="url(#ah)"/>' +
      '<text x="281" y="38" class="d-note" text-anchor="middle" fill="var(--clay)">celah terbuka</text>' +
      '<rect x="20" y="100" width="160" height="70" rx="10" class="d-box--pine"/>' +
      '<text x="100" y="122" class="d-label" text-anchor="middle" fill="var(--pine)">CULTURAL</text>' +
      '<text x="100" y="140" class="d-label--sm" text-anchor="middle">Nilai moral berbeda</text>' +
      '<text x="100" y="155" class="d-note" text-anchor="middle">relativism vs absolutism</text>' +
      '<rect x="200" y="100" width="160" height="70" rx="10" class="d-box--brass"/>' +
      '<text x="280" y="122" class="d-label" text-anchor="middle" fill="var(--brass)">LEGAL</text>' +
      '<text x="280" y="140" class="d-label--sm" text-anchor="middle">Tak ada hukum global</text>' +
      '<text x="280" y="155" class="d-note" text-anchor="middle">regulatory arbitrage</text>' +
      '<rect x="380" y="100" width="160" height="70" rx="10" class="d-box--clay"/>' +
      '<text x="460" y="122" class="d-label" text-anchor="middle" fill="var(--clay)">ACCOUNTABILITY</text>' +
      '<text x="460" y="140" class="d-label--sm" text-anchor="middle">Kepada siapa MNC</text>' +
      '<text x="460" y="155" class="d-label--sm" text-anchor="middle">bertanggung jawab?</text>' +
      '</svg>',
      'Globalisasi memisahkan jangkauan bisnis dari jangkauan aturan — dari situ lahir tiga celah yang menjadi inti buku.'
    );
  },

  tripleBottomLine: function () {
    return fig(
      '<svg viewBox="0 0 440 300" role="img" aria-label="Triple bottom line">' +
      '<circle cx="220" cy="105" r="88" fill="rgba(74,143,104,0.2)" stroke="var(--pine)" stroke-width="1.5"/>' +
      '<circle cx="160" cy="200" r="88" fill="rgba(211,161,60,0.2)" stroke="var(--brass)" stroke-width="1.5"/>' +
      '<circle cx="280" cy="200" r="88" fill="rgba(51,96,127,0.2)" stroke="var(--slate)" stroke-width="1.5"/>' +
      '<text x="220" y="48" class="d-label" text-anchor="middle" fill="var(--pine)">ENVIRONMENTAL</text>' +
      '<text x="220" y="63" class="d-note" text-anchor="middle">Planet</text>' +
      '<text x="88" y="252" class="d-label" text-anchor="middle" fill="var(--brass)">ECONOMIC</text>' +
      '<text x="88" y="267" class="d-note" text-anchor="middle">Profit</text>' +
      '<text x="352" y="252" class="d-label" text-anchor="middle" fill="var(--slate)">SOCIAL</text>' +
      '<text x="352" y="267" class="d-note" text-anchor="middle">People</text>' +
      '<circle cx="220" cy="168" r="40" fill="var(--panel)"/>' +
      '<text x="220" y="164" class="d-label d-label--inv" text-anchor="middle" font-size="10">SUSTAIN-</text>' +
      '<text x="220" y="177" class="d-label d-label--inv" text-anchor="middle" font-size="10">ABILITY</text>' +
      '</svg>',
      'Keberlanjutan berada di irisan ketiganya. Perhatikan: irisan itu kecil — di situlah letak trade-off dan dilema etisnya.'
    );
  },

  /* ---------- CM2 ---------- */

  carrollPyramid: function () {
    return fig(
      '<svg viewBox="0 0 440 300" role="img" aria-label="Piramida CSR Carroll">' +
      '<polygon points="220,18 268,88 172,88" fill="var(--pine-soft)" stroke="var(--pine)" stroke-width="1.5"/>' +
      '<polygon points="170,94 270,94 302,164 138,164" fill="var(--brass-soft)" stroke="var(--brass)" stroke-width="1.5"/>' +
      '<polygon points="136,170 304,170 336,240 104,240" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1.5"/>' +
      '<polygon points="102,246 338,246 366,292 74,292" fill="var(--panel)" stroke="var(--panel)" stroke-width="1.5"/>' +
      '<text x="220" y="72" class="d-label" text-anchor="middle" font-size="9.5" fill="var(--pine)">PHILANTHROPIC</text>' +
      '<text x="220" y="124" class="d-label" text-anchor="middle" fill="var(--brass)">ETHICAL</text>' +
      '<text x="220" y="140" class="d-note" text-anchor="middle">be ethical</text>' +
      '<text x="220" y="200" class="d-label" text-anchor="middle" fill="var(--slate)">LEGAL</text>' +
      '<text x="220" y="216" class="d-note" text-anchor="middle">obey the law</text>' +
      '<text x="220" y="270" class="d-label d-label--inv" text-anchor="middle">ECONOMIC</text>' +
      '<text x="220" y="285" class="d-note" fill="rgba(233,239,228,0.7)" text-anchor="middle">be profitable</text>' +
      '<text x="386" y="60" class="d-note" text-anchor="start" fill="var(--pine)">DESIRED</text>' +
      '<text x="386" y="130" class="d-note" text-anchor="start" fill="var(--brass)">EXPECTED</text>' +
      '<text x="386" y="206" class="d-note" text-anchor="start">REQUIRED</text>' +
      '<text x="386" y="272" class="d-note" text-anchor="start">REQUIRED</text>' +
      '</svg>',
      'Piramida Carroll. Kolom kanan — required / expected / desired — sering menjadi kunci nilai di soal ujian.'
    );
  },

  stakeholderMap: function () {
    const spokes = [
      ["Shareholders", 220, 28], ["Employees", 375, 78], ["Consumers", 392, 168],
      ["Suppliers & competitors", 300, 246], ["Civil society", 140, 246],
      ["Government", 48, 168], ["Environment & generasi mendatang", 65, 78]
    ];
    let s = '<svg viewBox="0 0 440 290" role="img" aria-label="Peta stakeholder">' + ARROW;
    spokes.forEach(function (p) {
      s += '<line x1="220" y1="140" x2="' + p[1] + '" y2="' + p[2] + '" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 3"/>';
    });
    s += '<circle cx="220" cy="140" r="46" fill="var(--panel)"/>' +
      '<text x="220" y="137" class="d-label d-label--inv" text-anchor="middle" font-size="10">THE</text>' +
      '<text x="220" y="150" class="d-label d-label--inv" text-anchor="middle" font-size="10">FIRM</text>';
    spokes.forEach(function (p) {
      const parts = p[0].split(" ");
      s += '<rect x="' + (p[1] - 52) + '" y="' + (p[2] - 14) + '" width="104" height="' + (parts.length > 1 ? 32 : 24) + '" rx="7" class="d-box--pine"/>';
      s += '<text x="' + p[1] + '" y="' + (p[2] + 2) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + parts[0] + '</text>';
      if (parts[1]) s += '<text x="' + p[1] + '" y="' + (p[2] + 14) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + parts[1] + '</text>';
    });
    s += '</svg>';
    return fig(s, 'Model jaringan: relasi bersifat timbal balik, bukan sekadar input yang masuk dan produk yang keluar.');
  },

  stakeholderSalience: function () {
    return fig(
      '<svg viewBox="0 0 440 290" role="img" aria-label="Model stakeholder salience">' +
      '<circle cx="220" cy="108" r="82" fill="rgba(74,143,104,0.18)" stroke="var(--pine)" stroke-width="1.5"/>' +
      '<circle cx="166" cy="192" r="82" fill="rgba(211,161,60,0.18)" stroke="var(--brass)" stroke-width="1.5"/>' +
      '<circle cx="274" cy="192" r="82" fill="rgba(168,69,47,0.16)" stroke="var(--clay)" stroke-width="1.5"/>' +
      '<text x="220" y="46" class="d-label" text-anchor="middle" fill="var(--pine)">POWER</text>' +
      '<text x="82" y="240" class="d-label" text-anchor="middle" fill="var(--brass)">LEGITIMACY</text>' +
      '<text x="358" y="240" class="d-label" text-anchor="middle" fill="var(--clay)">URGENCY</text>' +
      '<circle cx="220" cy="163" r="34" fill="var(--panel)"/>' +
      '<text x="220" y="160" class="d-label d-label--inv" text-anchor="middle" font-size="9">DEFINI-</text>' +
      '<text x="220" y="172" class="d-label d-label--inv" text-anchor="middle" font-size="9">TIVE</text>' +
      '<text x="150" y="120" class="d-note" text-anchor="middle">dominant</text>' +
      '<text x="292" y="120" class="d-note" text-anchor="middle">dangerous</text>' +
      '<text x="220" y="228" class="d-note" text-anchor="middle">dependent</text>' +
      '</svg>',
      'Satu atribut = latent · dua atribut = expectant · tiga atribut = definitive stakeholder (prioritas utama manajemen).'
    );
  },

  primaryStakeholders: function () {
    function pair(g, x1, x2, y, label) {
      return g +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 13) + '" class="d-note" text-anchor="middle">' + label + '</text>' +
        '<path d="M' + x1 + ' ' + (y - 5) + ' L' + x2 + ' ' + (y - 5) + '" stroke="var(--pine)" stroke-width="1.6" fill="none" marker-end="url(#ahp)"/>' +
        '<path d="M' + x2 + ' ' + (y + 6) + ' L' + x1 + ' ' + (y + 6) + '" stroke="var(--brass)" stroke-width="1.6" fill="none" marker-end="url(#ahq)"/>';
    }
    function box(x, y, l1, l2) {
      return '<rect x="' + x + '" y="' + y + '" width="140" height="48" rx="10" class="d-box--pine"/>' +
        '<text x="' + (x + 70) + '" y="' + (y + (l2 ? 21 : 29)) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + l1 + '</text>' +
        (l2 ? '<text x="' + (x + 70) + '" y="' + (y + 35) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + l2 + '</text>' : '');
    }
    let g = '<svg viewBox="0 0 560 372" class="wide" role="img" aria-label="Relasi perusahaan dan primary stakeholders">' +
      '<defs>' +
      '<marker id="ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--pine)"/></marker>' +
      '<marker id="ahq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--brass)"/></marker>' +
      '</defs>' +
      '<text x="280" y="18" class="d-note" text-anchor="middle">Relasi dua arah — transaksi ekonomi langsung (label mengikuti slide dosen)</text>';
    g += box(10, 30, 'Employees', '(unions)');   g = pair(g, 156, 209, 54, 'sell labor');
    g += box(10, 122, 'Stockholders');           g = pair(g, 156, 209, 146, 'invest capital');
    g += box(10, 214, 'Creditors');              g = pair(g, 156, 209, 238, 'lend funds');
    g += box(410, 30, 'Customers');              g = pair(g, 404, 351, 54, 'buy product');
    g += box(410, 122, 'Suppliers');             g = pair(g, 404, 351, 146, 'sell materials');
    g += box(410, 214, 'Wholesalers &amp;', 'retailers'); g = pair(g, 404, 351, 238, 'distribute product');
    g += '<rect x="210" y="304" width="140" height="44" rx="10" class="d-box--clay"/>' +
      '<text x="280" y="331" class="d-label--sm" text-anchor="middle" fill="var(--clay)">Competitors</text>' +
      '<text x="304" y="286" class="d-note" text-anchor="start">compete</text>' +
      '<path d="M273 300 L273 268" stroke="var(--pine)" stroke-width="1.6" fill="none" marker-end="url(#ahp)"/>' +
      '<path d="M287 268 L287 300" stroke="var(--brass)" stroke-width="1.6" fill="none" marker-end="url(#ahq)"/>';
    g += '<rect x="215" y="128" width="130" height="72" rx="12" class="d-box--dark"/>' +
      '<text x="280" y="158" class="d-label d-label--inv" text-anchor="middle">BUSINESS FIRM</text>' +
      '<text x="280" y="176" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">owners &middot; managers</text>' +
      '</svg>' +
      '<div class="viz-legend">' +
      '<span><span class="lg-dot lg-dot--pine"></span>kontribusi kepada perusahaan</span>' +
      '<span><span class="lg-dot lg-dot--brass"></span>imbalan / respons dari perusahaan</span>' +
      '</div>';
    return fig(g, 'Relations between a business firm and its primary stakeholders — digambar ulang dari slide 5 deck dosen. Perhatikan: deck memasukkan competitors sebagai primary stakeholder (relasinya: compete).');
  },

  secondaryStakeholders: function () {
    function pair(g, x1, x2, y, label) {
      return g +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (y - 13) + '" class="d-note" text-anchor="middle">' + label + '</text>' +
        '<path d="M' + x1 + ' ' + (y - 5) + ' L' + x2 + ' ' + (y - 5) + '" stroke="var(--pine)" stroke-width="1.6" fill="none" marker-end="url(#ahp)"/>' +
        '<path d="M' + x2 + ' ' + (y + 6) + ' L' + x1 + ' ' + (y + 6) + '" stroke="var(--brass)" stroke-width="1.6" fill="none" marker-end="url(#ahq)"/>';
    }
    function box(x, y, l1, l2) {
      return '<rect x="' + x + '" y="' + y + '" width="140" height="48" rx="10" class="d-box--brass"/>' +
        '<text x="' + (x + 70) + '" y="' + (y + (l2 ? 21 : 29)) + '" class="d-label--sm" text-anchor="middle" fill="var(--brass)">' + l1 + '</text>' +
        (l2 ? '<text x="' + (x + 70) + '" y="' + (y + 35) + '" class="d-label--sm" text-anchor="middle" fill="var(--brass)">' + l2 + '</text>' : '');
    }
    let g = '<svg viewBox="0 0 560 372" class="wide" role="img" aria-label="Relasi perusahaan dan secondary stakeholders">' +
      '<text x="280" y="18" class="d-note" text-anchor="middle">Relasi dua arah tanpa transaksi ekonomi langsung (label mengikuti slide dosen)</text>';
    g += box(10, 30, 'Local', 'communities');    g = pair(g, 156, 209, 54, 'jobs, environment');
    g += box(10, 122, 'General public');         g = pair(g, 156, 209, 146, 'opinion (+/&minus;)');
    g += box(10, 214, 'Business support', 'groups'); g = pair(g, 156, 209, 238, 'advice, research');
    g += box(410, 30, 'Governments', '(pusat &amp; daerah)'); g = pair(g, 404, 351, 54, 'regulation, taxes');
    g += box(410, 122, 'Foreign', 'governments'); g = pair(g, 404, 351, 146, 'friendly / hostile');
    g += box(410, 214, 'Media');                 g = pair(g, 404, 351, 238, 'image, publicity');
    g += '<rect x="210" y="304" width="140" height="44" rx="10" class="d-box--brass"/>' +
      '<text x="280" y="323" class="d-label--sm" text-anchor="middle" fill="var(--brass)">Social activist</text>' +
      '<text x="280" y="337" class="d-label--sm" text-anchor="middle" fill="var(--brass)">groups</text>' +
      '<text x="304" y="286" class="d-note" text-anchor="start">social demands</text>' +
      '<path d="M273 300 L273 268" stroke="var(--pine)" stroke-width="1.6" fill="none" marker-end="url(#ahp)"/>' +
      '<path d="M287 268 L287 300" stroke="var(--brass)" stroke-width="1.6" fill="none" marker-end="url(#ahq)"/>';
    g += '<rect x="215" y="128" width="130" height="72" rx="12" class="d-box--dark"/>' +
      '<text x="280" y="158" class="d-label d-label--inv" text-anchor="middle">BUSINESS FIRM</text>' +
      '<text x="280" y="176" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">owners &middot; managers</text>' +
      '</svg>' +
      '<div class="viz-legend">' +
      '<span><span class="lg-dot lg-dot--pine"></span>pengaruh kepada perusahaan</span>' +
      '<span><span class="lg-dot lg-dot--brass"></span>dampak / respons perusahaan</span>' +
      '</div>';
    return fig(g, 'Relations between a business firm and its secondary stakeholders — digambar ulang dari slide 6 deck dosen.');
  },

  /* ---------- CM3 ---------- */

  theoryTree: function () {
    return fig(
      '<svg viewBox="0 0 560 260" class="wide" role="img" aria-label="Peta teori etika normatif">' +
      '<rect x="205" y="10" width="150" height="34" rx="9" class="d-box--dark"/>' +
      '<text x="280" y="32" class="d-label d-label--inv" text-anchor="middle">TEORI ETIKA NORMATIF</text>' +
      '<path d="M280 44 V62 M115 62 H445 M115 62 V80 M280 62 V80 M445 62 V80" stroke="var(--line-strong)" stroke-width="1.2" fill="none"/>' +
      '<rect x="30" y="80" width="170" height="38" rx="9" class="d-box--brass"/>' +
      '<text x="115" y="97" class="d-label--sm" text-anchor="middle" fill="var(--brass)">CONSEQUENTIALIST</text>' +
      '<text x="115" y="110" class="d-note" text-anchor="middle">hasil menentukan</text>' +
      '<rect x="195" y="80" width="170" height="38" rx="9" class="d-box--pine"/>' +
      '<text x="280" y="97" class="d-label--sm" text-anchor="middle" fill="var(--pine)">NON-CONSEQUENTIALIST</text>' +
      '<text x="280" y="110" class="d-note" text-anchor="middle">prinsip menentukan</text>' +
      '<rect x="360" y="80" width="170" height="38" rx="9" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1"/>' +
      '<text x="445" y="97" class="d-label--sm" text-anchor="middle" fill="var(--slate)">KONTEMPORER</text>' +
      '<text x="445" y="110" class="d-note" text-anchor="middle">pelaku &amp; relasi</text>' +
      '<path d="M115 118 V132 M280 118 V132 M445 118 V132" stroke="var(--line-strong)" stroke-width="1.2"/>' +
      '<rect x="35" y="134" width="160" height="24" rx="6" class="d-box"/><text x="115" y="150" class="d-label--sm" text-anchor="middle">Egoism</text>' +
      '<rect x="35" y="162" width="160" height="24" rx="6" class="d-box"/><text x="115" y="178" class="d-label--sm" text-anchor="middle">Utilitarianism</text>' +
      '<rect x="200" y="134" width="160" height="24" rx="6" class="d-box"/><text x="280" y="150" class="d-label--sm" text-anchor="middle">Ethics of duty (Kant)</text>' +
      '<rect x="200" y="162" width="160" height="24" rx="6" class="d-box"/><text x="280" y="178" class="d-label--sm" text-anchor="middle">Rights &amp; justice</text>' +
      '<rect x="365" y="134" width="160" height="24" rx="6" class="d-box"/><text x="445" y="150" class="d-label--sm" text-anchor="middle">Virtue · Feminist</text>' +
      '<rect x="365" y="162" width="160" height="24" rx="6" class="d-box"/><text x="445" y="178" class="d-label--sm" text-anchor="middle">Discourse · Postmodern</text>' +
      '<rect x="35" y="200" width="325" height="46" rx="9" fill="var(--paper)" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 3"/>' +
      '<text x="197" y="219" class="d-label--sm" text-anchor="middle">Western modernist</text>' +
      '<text x="197" y="234" class="d-note" text-anchor="middle">rasional · universal · impersonal · berbasis aturan</text>' +
      '<rect x="365" y="200" width="160" height="46" rx="9" fill="var(--paper)" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 3"/>' +
      '<text x="445" y="219" class="d-label--sm" text-anchor="middle">Contemporary</text>' +
      '<text x="445" y="234" class="d-note" text-anchor="middle">partikular · personal · relasional</text>' +
      '</svg>',
      'Peta besar CM3. Hafalkan cabangnya — soal sering meminta menempatkan sebuah teori pada kelompok yang tepat.'
    );
  },

  utilitarianCalc: function () {
    return fig(
      '<svg viewBox="0 0 440 220" role="img" aria-label="Timbangan utilitarian">' +
      '<path d="M220 34 V150" stroke="var(--line-strong)" stroke-width="3"/>' +
      '<path d="M120 60 H320" stroke="var(--panel)" stroke-width="3" transform="rotate(-7 220 60)"/>' +
      '<circle cx="220" cy="34" r="8" fill="var(--panel)"/>' +
      '<path d="M150 175 H290 L280 150 H160 Z" fill="var(--pine-soft)" stroke="var(--pine)" stroke-width="1.2" opacity="0"/>' +
      '<rect x="96" y="72" width="112" height="56" rx="9" class="d-box--pine"/>' +
      '<text x="152" y="94" class="d-label--sm" text-anchor="middle" fill="var(--pine)">BENEFIT</text>' +
      '<text x="152" y="109" class="d-note" text-anchor="middle">siapa diuntungkan,</text>' +
      '<text x="152" y="121" class="d-note" text-anchor="middle">seberapa besar</text>' +
      '<rect x="234" y="98" width="112" height="56" rx="9" class="d-box--clay"/>' +
      '<text x="290" y="120" class="d-label--sm" text-anchor="middle" fill="var(--clay)">HARM</text>' +
      '<text x="290" y="135" class="d-note" text-anchor="middle">siapa dirugikan,</text>' +
      '<text x="290" y="147" class="d-note" text-anchor="middle">seberapa besar</text>' +
      '<text x="220" y="196" class="d-label--sm" text-anchor="middle">Benar bila: total manfaat &gt; total kerugian</text>' +
      '<text x="220" y="211" class="d-note" text-anchor="middle" fill="var(--clay)">Kelemahan: siapa yang menanggung, tidak diperhitungkan</text>' +
      '</svg>',
      'Utilitarianism menjumlahkan, tetapi tidak menanyakan distribusinya — itulah problem of distribution.'
    );
  },

  kantMaxims: function () {
    return fig(
      '<svg viewBox="0 0 560 170" class="wide" role="img" aria-label="Tiga maksim Kant">' +
      '<rect x="10" y="18" width="170" height="118" rx="12" class="d-box--pine"/>' +
      '<text x="95" y="44" class="d-label" text-anchor="middle" fill="var(--pine)">MAXIM 1</text>' +
      '<text x="95" y="62" class="d-label--sm" text-anchor="middle">Consistency</text>' +
      '<text x="95" y="86" class="d-note" text-anchor="middle">Dapatkah prinsipmu</text>' +
      '<text x="95" y="99" class="d-note" text-anchor="middle">menjadi hukum universal?</text>' +
      '<text x="95" y="122" class="d-note" text-anchor="middle" fill="var(--pine)">"jika semua melakukannya?"</text>' +
      '<rect x="195" y="18" width="170" height="118" rx="12" class="d-box--dark"/>' +
      '<text x="280" y="44" class="d-label d-label--inv" text-anchor="middle">MAXIM 2</text>' +
      '<text x="280" y="62" class="d-label--sm" text-anchor="middle" fill="var(--panel-ink)">Human dignity</text>' +
      '<text x="280" y="86" class="d-note" fill="rgba(233,239,228,0.75)" text-anchor="middle">Manusia sebagai tujuan,</text>' +
      '<text x="280" y="99" class="d-note" fill="rgba(233,239,228,0.75)" text-anchor="middle">bukan semata sarana</text>' +
      '<text x="280" y="122" class="d-note" fill="var(--brass-bright)" text-anchor="middle">paling sering dipakai</text>' +
      '<rect x="380" y="18" width="170" height="118" rx="12" class="d-box--brass"/>' +
      '<text x="465" y="44" class="d-label" text-anchor="middle" fill="var(--brass)">MAXIM 3</text>' +
      '<text x="465" y="62" class="d-label--sm" text-anchor="middle">Universality</text>' +
      '<text x="465" y="86" class="d-note" text-anchor="middle">Dapatkah semua pihak</text>' +
      '<text x="465" y="99" class="d-note" text-anchor="middle">menerima aturan ini?</text>' +
      '<text x="465" y="122" class="d-note" text-anchor="middle" fill="var(--brass)">"kingdom of ends"</text>' +
      '<text x="280" y="160" class="d-note" text-anchor="middle">Categorical imperative — berlaku tanpa syarat, apa pun akibatnya</text>' +
      '</svg>',
      'Tiga maksim categorical imperative. Maxim 2 adalah alat paling tajam untuk kasus bisnis.'
    );
  },

  pluralistLens: function () {
    return fig(
      '<svg viewBox="0 0 560 200" class="wide" role="img" aria-label="Pendekatan pluralistik">' + ARROW +
      '<rect x="10" y="20" width="128" height="34" rx="8" class="d-box--brass"/>' +
      '<text x="74" y="41" class="d-label--sm" text-anchor="middle" fill="var(--brass)">Consequentialist</text>' +
      '<rect x="10" y="64" width="128" height="34" rx="8" class="d-box--pine"/>' +
      '<text x="74" y="85" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Ethics of duty</text>' +
      '<rect x="10" y="108" width="128" height="34" rx="8" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1"/>' +
      '<text x="74" y="129" class="d-label--sm" text-anchor="middle" fill="var(--slate)">Rights &amp; justice</text>' +
      '<rect x="10" y="152" width="128" height="34" rx="8" class="d-box"/>' +
      '<text x="74" y="173" class="d-label--sm" text-anchor="middle">Virtue &amp; discourse</text>' +
      '<path d="M142 37 L246 90 M142 81 L246 96 M142 125 L246 108 M142 169 L246 114" class="d-arrow" marker-end="url(#ah)"/>' +
      '<circle cx="300" cy="103" r="50" fill="var(--panel)"/>' +
      '<text x="300" y="98" class="d-label d-label--inv" text-anchor="middle" font-size="10">KASUS</text>' +
      '<text x="300" y="112" class="d-label d-label--inv" text-anchor="middle" font-size="10">BISNIS</text>' +
      '<path d="M354 103 H408" class="d-arrow" marker-end="url(#ah)"/>' +
      '<rect x="414" y="62" width="136" height="82" rx="10" class="d-box--pine"/>' +
      '<text x="482" y="86" class="d-label--sm" text-anchor="middle" fill="var(--pine)">ETHICAL JUDGEMENT</text>' +
      '<text x="482" y="106" class="d-note" text-anchor="middle">posisi yang jelas,</text>' +
      '<text x="482" y="119" class="d-note" text-anchor="middle">trade-off diakui,</text>' +
      '<text x="482" y="132" class="d-note" text-anchor="middle">alternatif ditawarkan</text>' +
      '</svg>',
      'Pluralisme: pakai beberapa lensa sekaligus, lalu tetap ambil posisi. Inilah struktur jawaban kasus yang dinilai tinggi.'
    );
  },

  /* ---------- CM4 ---------- */

  decisionModel: function () {
    const steps = [
      ["1", "Recognize", "moral issue", "var(--pine)"],
      ["2", "Make moral", "judgement", "var(--brass)"],
      ["3", "Establish", "moral intent", "var(--slate)"],
      ["4", "Engage in moral", "behaviour", "var(--clay)"]
    ];
    let s = '<svg viewBox="0 0 560 150" class="wide" role="img" aria-label="Model pengambilan keputusan etis">' + ARROW;
    steps.forEach(function (st, i) {
      const x = 10 + i * 140;
      s += '<rect x="' + x + '" y="30" width="118" height="72" rx="11" class="d-box" stroke="' + st[3] + '"/>';
      s += '<circle cx="' + (x + 20) + '" cy="48" r="12" fill="' + st[3] + '"/>';
      s += '<text x="' + (x + 20) + '" y="52" class="d-label d-label--inv" text-anchor="middle">' + st[0] + '</text>';
      s += '<text x="' + (x + 59) + '" y="76" class="d-label--sm" text-anchor="middle">' + st[1] + '</text>';
      s += '<text x="' + (x + 59) + '" y="90" class="d-label--sm" text-anchor="middle">' + st[2] + '</text>';
      if (i < 3) s += '<path d="M' + (x + 122) + ' 66 H' + (x + 134) + '" class="d-arrow" marker-end="url(#ah)"/>';
    });
    s += '<text x="69" y="122" class="d-note" text-anchor="middle" fill="var(--clay)">ethical blindness</text>' +
      '<text x="489" y="122" class="d-note" text-anchor="middle" fill="var(--clay)">butuh moral courage</text>' +
      '</svg>';
    return fig(s, 'Model Rest. Rantai bisa putus di tahap mana pun — diagnosis inilah yang diminta pada soal kasus.');
  },

  influences: function () {
    return fig(
      '<svg viewBox="0 0 560 170" class="wide" role="img" aria-label="Faktor individual dan situasional">' + ARROW +
      '<rect x="10" y="14" width="180" height="60" rx="11" class="d-box--pine"/>' +
      '<text x="100" y="36" class="d-label--sm" text-anchor="middle" fill="var(--pine)">INDIVIDUAL FACTORS</text>' +
      '<text x="100" y="52" class="d-note" text-anchor="middle">umur · gender · budaya · pendidikan</text>' +
      '<text x="100" y="65" class="d-note" text-anchor="middle">CMD · locus of control · integritas</text>' +
      '<rect x="10" y="96" width="180" height="60" rx="11" class="d-box--brass"/>' +
      '<text x="100" y="118" class="d-label--sm" text-anchor="middle" fill="var(--brass)">SITUATIONAL FACTORS</text>' +
      '<text x="100" y="134" class="d-note" text-anchor="middle">issue: moral intensity, framing</text>' +
      '<text x="100" y="147" class="d-note" text-anchor="middle">context: reward, otoritas, budaya</text>' +
      '<path d="M194 44 L268 76 M194 126 L268 94" class="d-arrow" marker-end="url(#ah)"/>' +
      '<rect x="274" y="52" width="150" height="66" rx="11" class="d-box--dark"/>' +
      '<text x="349" y="80" class="d-label d-label--inv" text-anchor="middle">PROSES KEPUTUSAN</text>' +
      '<text x="349" y="96" class="d-note" fill="rgba(233,239,228,0.7)" text-anchor="middle">4 tahap</text>' +
      '<path d="M428 85 H470" class="d-arrow" marker-end="url(#ah)"/>' +
      '<rect x="476" y="60" width="74" height="50" rx="10" class="d-box"/>' +
      '<text x="513" y="80" class="d-label--sm" text-anchor="middle">Ethical /</text>' +
      '<text x="513" y="94" class="d-label--sm" text-anchor="middle">unethical</text>' +
      '<text x="513" y="140" class="d-note" text-anchor="middle" fill="var(--brass)">situasional lebih kuat</text>' +
      '</svg>',
      'Riset konsisten menemukan faktor situasional lebih kuat memprediksi perilaku daripada karakter individu.'
    );
  },

  kohlberg: function () {
    let s = '<svg viewBox="0 0 500 260" role="img" aria-label="Tahap perkembangan moral Kohlberg">';
    const stages = [
      ["1", "Menghindari hukuman", "var(--clay)"],
      ["2", "Kepentingan diri, pertukaran", "var(--clay)"],
      ["3", "Harapan orang terdekat", "var(--brass)"],
      ["4", "Hukum &amp; ketertiban sosial", "var(--brass)"],
      ["5", "Kontrak sosial &amp; hak", "var(--pine)"],
      ["6", "Prinsip etis universal", "var(--pine)"]
    ];
    stages.forEach(function (st, i) {
      const y = 212 - i * 34;
      const w = 210 + i * 20;
      s += '<rect x="120" y="' + y + '" width="' + w + '" height="28" rx="7" class="d-box" stroke="' + st[2] + '"/>';
      s += '<circle cx="136" cy="' + (y + 14) + '" r="9" fill="' + st[2] + '"/>';
      s += '<text x="136" y="' + (y + 18) + '" class="d-label d-label--inv" text-anchor="middle" font-size="9">' + st[0] + '</text>';
      s += '<text x="154" y="' + (y + 18) + '" class="d-label--sm" text-anchor="start">' + st[1] + '</text>';
    });
    s += '<text x="60" y="216" class="d-note" text-anchor="middle" fill="var(--clay)">PRE-</text>' +
      '<text x="60" y="228" class="d-note" text-anchor="middle" fill="var(--clay)">CONVENTIONAL</text>' +
      '<text x="60" y="150" class="d-note" text-anchor="middle" fill="var(--brass)">CONVENTIONAL</text>' +
      '<text x="60" y="162" class="d-note" text-anchor="middle" fill="var(--brass)">(mayoritas)</text>' +
      '<text x="60" y="82" class="d-note" text-anchor="middle" fill="var(--pine)">POST-</text>' +
      '<text x="60" y="94" class="d-note" text-anchor="middle" fill="var(--pine)">CONVENTIONAL</text>' +
      '<path d="M104 224 V38" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<text x="300" y="26" class="d-note" text-anchor="middle">yang dinilai adalah ALASAN, bukan keputusannya</text>' +
      '</svg>';
    return fig(s, 'Enam tahap Kohlberg. Ingat kritik Gilligan: model ini mengistimewakan penalaran keadilan di atas penalaran care.');
  },

  moralIntensity: function () {
    const rows = [
      ["Magnitude of consequences", "seberapa besar dampaknya", "mi1"],
      ["Social consensus", "seberapa luas disepakati salah", "mi2"],
      ["Probability of effect", "seberapa mungkin terjadi", "mi3"],
      ["Temporal immediacy", "seberapa cepat terasa", "mi4"],
      ["Proximity", "seberapa dekat korban", "mi5"],
      ["Concentration of effect", "seberapa terpusat dampaknya", "mi6"]
    ];
    let h = '<div class="mi-wrap" data-mi-widget>' +
      '<p class="mi-hint">Geser tiap komponen sesuai kasus yang sedang kamu analisis, lalu lihat intensitas moral totalnya. ' +
      'Semakin tinggi, semakin besar peluang isu itu <em>dikenali</em> dan ditindaklanjuti — dan semakin sulit dibela ketika diabaikan.</p>';
    rows.forEach(function (r) {
      h += '<div class="mi-row">' +
        '<span class="mi-label">' + r[0] + '<small>' + r[1] + '</small></span>' +
        '<input type="range" min="1" max="5" value="3" data-mi="' + r[2] + '" aria-label="' + r[0] + '">' +
        '<span class="mi-val" data-mi-out="' + r[2] + '">3</span>' +
        '</div>';
    });
    h += '<div class="mi-meter-wrap"><span>Moral intensity</span>' +
      '<span class="mi-meter"><i data-mi-bar style="transform:scaleX(0.5)"></i></span>' +
      '<span class="mi-val" data-mi-total>18/30</span></div>' +
      '<p class="mi-verdict" data-mi-verdict></p></div>';
    return fig(h, 'Enam komponen moral intensity (Jones). Komponen <em>proximity</em> dan <em>temporal immediacy</em> menjelaskan mengapa kerugian yang jauh dan lambat paling mudah diabaikan.');
  },

  ethicalLeaderMatrix: function () {
    return fig(
      '<div class="mx-wrap">' +
      '<span class="mx-ylabel">Moral person →</span>' +
      '<div class="mx-grid">' +
      '<div class="mx-cell mx-warn"><b>Ethically neutral</b><span>Pribadi baik, tetapi diam soal etika. Karyawan menyimpulkan yang penting hanya hasil.</span></div>' +
      '<div class="mx-cell mx-good"><b>Ethical leader</b><span>Kuat pada kedua dimensi. Standar jelas, dicontohkan, dan ditegakkan konsisten.</span></div>' +
      '<div class="mx-cell mx-bad"><b>Unethical leader</b><span>Lemah di keduanya. Pesannya: etika tidak penting di sini.</span></div>' +
      '<div class="mx-cell mx-bad"><b>Hypocritical leader</b><span>Banyak bicara etika, perilakunya buruk. Paling merusak kepercayaan.</span></div>' +
      '</div>' +
      '<span class="mx-xlabel">Moral manager →</span>' +
      '</div>',
      'Matriks Treviño. Kuadran kiri atas adalah pelajaran utamanya: menjadi orang baik saja tidak cukup untuk memimpin secara etis.'
    );
  },

  /* ---------- CM5 ---------- */

  ethicsToolkit: function () {
    const tools = [
      ["Mission & values", 90, 40], ["Codes of ethics", 280, 40], ["Whistleblowing hotline", 470, 40],
      ["Ethics officers & committees", 90, 200], ["Ethics training", 280, 200], ["Social auditing & reporting", 470, 200]
    ];
    let s = '<svg viewBox="0 0 560 250" class="wide" role="img" aria-label="Perangkat manajemen etika">';
    tools.forEach(function (t) {
      s += '<line x1="280" y1="120" x2="' + t[1] + '" y2="' + (t[2] < 120 ? t[2] + 28 : t[2] - 6) + '" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 3"/>';
    });
    s += '<rect x="196" y="98" width="168" height="46" rx="11" class="d-box--dark"/>' +
      '<text x="280" y="118" class="d-label d-label--inv" text-anchor="middle" font-size="10">BUSINESS ETHICS</text>' +
      '<text x="280" y="132" class="d-label d-label--inv" text-anchor="middle" font-size="10">MANAGEMENT</text>';
    tools.forEach(function (t) {
      const p = t[0].split(" ");
      s += '<rect x="' + (t[1] - 76) + '" y="' + (t[2] - 6) + '" width="152" height="40" rx="9" class="d-box--pine"/>';
      s += '<text x="' + t[1] + '" y="' + (t[2] + 11) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + p[0] + '</text>';
      s += '<text x="' + t[1] + '" y="' + (t[2] + 25) + '" class="d-label--sm" text-anchor="middle" fill="var(--pine)">' + (p[1] || '') + '</text>';
    });
    s += '</svg>';
    return fig(s, 'Enam perangkat inti. Tidak satu pun bekerja sendiri — efektivitasnya bergantung pada budaya dan penegakan.');
  },

  stakeholderLadder: function () {
    let s = '<svg viewBox="0 0 460 220" role="img" aria-label="Tangga keterlibatan stakeholder">';
    const rungs = [
      ["Informing", "satu arah", "var(--ink-faint)"],
      ["Consultation", "ditanya, tetap diputuskan sendiri", "var(--slate)"],
      ["Dialogue", "dua arah, posisi bisa berubah", "var(--brass)"],
      ["Partnership", "berbagi keputusan &amp; sumber daya", "var(--pine)"]
    ];
    rungs.forEach(function (r, i) {
      const y = 168 - i * 44;
      const w = 200 + i * 52;
      s += '<rect x="30" y="' + y + '" width="' + w + '" height="36" rx="8" class="d-box" stroke="' + r[2] + '"/>';
      s += '<text x="44" y="' + (y + 16) + '" class="d-label--sm" text-anchor="start" fill="' + r[2] + '">' + r[0] + '</text>';
      s += '<text x="44" y="' + (y + 29) + '" class="d-note" text-anchor="start">' + r[1] + '</text>';
    });
    s += '<text x="230" y="206" class="d-note" text-anchor="middle" fill="var(--clay)">Konsultasi yang hasilnya sudah ditentukan = tokenism</text>' +
      '</svg>';
    return fig(s, 'Semakin ke atas, semakin besar pengaruh nyata stakeholder terhadap keputusan.');
  },

  socialAuditCycle: function () {
    return fig(
      '<svg viewBox="0 0 440 260" role="img" aria-label="Siklus social accounting">' + ARROW +
      '<circle cx="220" cy="130" r="86" class="d-ring" stroke-dasharray="5 4"/>' +
      '<rect x="152" y="8" width="136" height="38" rx="9" class="d-box--pine"/>' +
      '<text x="220" y="26" class="d-label--sm" text-anchor="middle" fill="var(--pine)">1 · Scoping</text>' +
      '<text x="220" y="39" class="d-note" text-anchor="middle">tentukan isu material</text>' +
      '<rect x="316" y="110" width="118" height="38" rx="9" class="d-box--brass"/>' +
      '<text x="375" y="128" class="d-label--sm" text-anchor="middle" fill="var(--brass)">2 · Accounting</text>' +
      '<text x="375" y="141" class="d-note" text-anchor="middle">kumpulkan data</text>' +
      '<rect x="152" y="214" width="136" height="38" rx="9" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1"/>' +
      '<text x="220" y="232" class="d-label--sm" text-anchor="middle" fill="var(--slate)">3 · Auditing</text>' +
      '<text x="220" y="245" class="d-note" text-anchor="middle">verifikasi independen</text>' +
      '<rect x="6" y="110" width="118" height="38" rx="9" class="d-box--dark"/>' +
      '<text x="65" y="128" class="d-label--sm d-label--inv" text-anchor="middle">4 · Reporting</text>' +
      '<text x="65" y="141" class="d-note" fill="rgba(233,239,228,0.7)" text-anchor="middle">dan tindak lanjut</text>' +
      '<path d="M290 52 A86 86 0 0 1 318 100" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M348 158 A86 86 0 0 1 292 210" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M148 210 A86 86 0 0 1 92 158" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M122 100 A86 86 0 0 1 150 52" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="220" y="126" class="d-label--sm" text-anchor="middle">Siklus</text>' +
      '<text x="220" y="140" class="d-label--sm" text-anchor="middle">berulang</text>' +
      '</svg>',
      'Tanpa tahap 3 (asurans independen), laporan keberlanjutan sulit dibedakan dari materi pemasaran.'
    );
  },

  /* ---------- CM6 ---------- */

  agency: function () {
    return fig(
      '<svg viewBox="0 0 500 200" role="img" aria-label="Hubungan keagenan">' + ARROW +
      '<rect x="20" y="60" width="140" height="66" rx="11" class="d-box--pine"/>' +
      '<text x="90" y="86" class="d-label--sm" text-anchor="middle" fill="var(--pine)">PRINCIPAL</text>' +
      '<text x="90" y="102" class="d-note" text-anchor="middle">Shareholders</text>' +
      '<text x="90" y="116" class="d-note" text-anchor="middle">pemilik, tidak mengelola</text>' +
      '<rect x="340" y="60" width="140" height="66" rx="11" class="d-box--brass"/>' +
      '<text x="410" y="86" class="d-label--sm" text-anchor="middle" fill="var(--brass)">AGENT</text>' +
      '<text x="410" y="102" class="d-note" text-anchor="middle">Management</text>' +
      '<text x="410" y="116" class="d-note" text-anchor="middle">mengelola, bukan pemilik</text>' +
      '<path d="M166 80 H332" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="249" y="72" class="d-note" text-anchor="middle">mendelegasikan kendali</text>' +
      '<path d="M332 108 H166" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="249" y="122" class="d-note" text-anchor="middle">wajib melapor</text>' +
      '<rect x="150" y="146" width="200" height="44" rx="10" class="d-box--clay"/>' +
      '<text x="250" y="164" class="d-label--sm" text-anchor="middle" fill="var(--clay)">AGENCY PROBLEM</text>' +
      '<text x="250" y="180" class="d-note" text-anchor="middle">kepentingan berbeda + asimetri informasi</text>' +
      '<text x="250" y="30" class="d-note" text-anchor="middle">Pemisahan kepemilikan dan kendali</text>' +
      '</svg>',
      'Biaya untuk memantau dan menyelaraskan kepentingan ini disebut agency cost.'
    );
  },

  governanceCompare: function () {
    return fig(
      '<svg viewBox="0 0 560 220" class="wide" role="img" aria-label="Perbandingan sistem tata kelola">' +
      '<text x="140" y="22" class="d-label" text-anchor="middle" fill="var(--slate)">ANGLO-AMERICAN</text>' +
      '<text x="140" y="36" class="d-note" text-anchor="middle">satu tingkat · kepemilikan tersebar</text>' +
      '<rect x="60" y="48" width="160" height="34" rx="8" class="d-box"/>' +
      '<text x="140" y="69" class="d-label--sm" text-anchor="middle">Shareholders (tersebar)</text>' +
      '<path d="M140 82 V96" stroke="var(--line-strong)" stroke-width="1.2"/>' +
      '<rect x="45" y="96" width="190" height="52" rx="9" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1.2"/>' +
      '<text x="140" y="116" class="d-label--sm" text-anchor="middle" fill="var(--slate)">UNITARY BOARD</text>' +
      '<text x="140" y="132" class="d-note" text-anchor="middle">eksekutif + non-eksekutif</text>' +
      '<text x="140" y="144" class="d-note" text-anchor="middle">duduk bersama</text>' +
      '<path d="M140 148 V162" stroke="var(--line-strong)" stroke-width="1.2"/>' +
      '<rect x="70" y="162" width="140" height="30" rx="8" class="d-box"/>' +
      '<text x="140" y="181" class="d-label--sm" text-anchor="middle">Management</text>' +
      '<text x="140" y="210" class="d-note" text-anchor="middle">kendali lewat pasar modal</text>' +
      '<line x1="280" y1="14" x2="280" y2="206" stroke="var(--line)" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<text x="420" y="22" class="d-label" text-anchor="middle" fill="var(--pine)">CONTINENTAL EUROPEAN</text>' +
      '<text x="420" y="36" class="d-note" text-anchor="middle">dua tingkat · kepemilikan terkonsentrasi</text>' +
      '<rect x="340" y="48" width="160" height="34" rx="8" class="d-box"/>' +
      '<text x="420" y="69" class="d-label--sm" text-anchor="middle">Bank · keluarga · negara</text>' +
      '<path d="M420 82 V96" stroke="var(--line-strong)" stroke-width="1.2"/>' +
      '<rect x="330" y="96" width="180" height="30" rx="8" class="d-box--pine"/>' +
      '<text x="420" y="115" class="d-label--sm" text-anchor="middle" fill="var(--pine)">SUPERVISORY BOARD</text>' +
      '<path d="M420 126 V138" stroke="var(--line-strong)" stroke-width="1.2"/>' +
      '<rect x="330" y="138" width="180" height="30" rx="8" class="d-box--pine"/>' +
      '<text x="420" y="157" class="d-label--sm" text-anchor="middle" fill="var(--pine)">MANAGEMENT BOARD</text>' +
      '<text x="420" y="186" class="d-note" text-anchor="middle">codetermination: wakil pekerja</text>' +
      '<text x="420" y="200" class="d-note" text-anchor="middle">di dewan pengawas</text>' +
      '<text x="420" y="214" class="d-note" text-anchor="middle" fill="var(--pine)">Indonesia: Komisaris &amp; Direksi</text>' +
      '</svg>',
      'Indonesia mengikuti pola dua tingkat — tetapi dengan kepemilikan keluarga yang terkonsentrasi, isu utamanya adalah perlindungan pemegang saham minoritas.'
    );
  },

  esgScreens: function () {
    return fig(
      '<svg viewBox="0 0 460 210" role="img" aria-label="Strategi investasi ESG">' + ARROW +
      '<polygon points="20,30 440,30 340,90 120,90" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1"/>' +
      '<text x="230" y="56" class="d-label--sm" text-anchor="middle">Seluruh alam semesta investasi</text>' +
      '<text x="230" y="76" class="d-note" text-anchor="middle">negative screening: keluarkan senjata, tembakau, batu bara</text>' +
      '<polygon points="122,96 338,96 288,146 172,146" fill="var(--brass-soft)" stroke="var(--brass)" stroke-width="1"/>' +
      '<text x="230" y="118" class="d-label--sm" text-anchor="middle" fill="var(--brass)">Best-in-class</text>' +
      '<text x="230" y="136" class="d-note" text-anchor="middle">pilih kinerja ESG terbaik di tiap sektor</text>' +
      '<rect x="150" y="154" width="160" height="42" rx="9" class="d-box--pine"/>' +
      '<text x="230" y="174" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Engagement &amp; impact</text>' +
      '<text x="230" y="189" class="d-note" text-anchor="middle">tekan perubahan dari dalam</text>' +
      '</svg>',
      'Tiga strategi SRI/ESG. Perhatikan: engagement justru mempertahankan kepemilikan agar punya suara.'
    );
  },

  /* ---------- CM7 ---------- */

  rightsDuties: function () {
    return fig(
      '<svg viewBox="0 0 500 200" role="img" aria-label="Hak dan kewajiban karyawan">' +
      '<path d="M250 26 V150" stroke="var(--line-strong)" stroke-width="3"/>' +
      '<path d="M120 54 H380" stroke="var(--panel)" stroke-width="3"/>' +
      '<circle cx="250" cy="26" r="8" fill="var(--panel)"/>' +
      '<rect x="40" y="66" width="170" height="76" rx="10" class="d-box--pine"/>' +
      '<text x="125" y="86" class="d-label--sm" text-anchor="middle" fill="var(--pine)">HAK KARYAWAN</text>' +
      '<text x="125" y="103" class="d-note" text-anchor="middle">non-diskriminasi · privasi</text>' +
      '<text x="125" y="116" class="d-note" text-anchor="middle">keselamatan · upah adil</text>' +
      '<text x="125" y="129" class="d-note" text-anchor="middle">berserikat · due process</text>' +
      '<rect x="290" y="66" width="170" height="76" rx="10" class="d-box--brass"/>' +
      '<text x="375" y="86" class="d-label--sm" text-anchor="middle" fill="var(--brass)">KEWAJIBAN KARYAWAN</text>' +
      '<text x="375" y="103" class="d-note" text-anchor="middle">kompetensi · kerahasiaan</text>' +
      '<text x="375" y="116" class="d-note" text-anchor="middle">hindari conflict of interest</text>' +
      '<text x="375" y="129" class="d-note" text-anchor="middle">kejujuran · loyalitas wajar</text>' +
      '<text x="250" y="172" class="d-note" text-anchor="middle" fill="var(--clay)">Loyalitas berhenti ketika diminta menutupi bahaya bagi pihak lain</text>' +
      '<text x="250" y="190" class="d-note" text-anchor="middle">→ di titik itu whistleblowing menjadi dapat dibenarkan</text>' +
      '</svg>',
      'Hubungan kerja bersifat timbal balik. Soal ujian sering meminta kedua sisi, bukan hanya daftar hak.'
    );
  },

  livingWage: function () {
    return fig(
      '<svg viewBox="0 0 460 200" role="img" aria-label="Perbandingan upah minimum dan upah layak">' +
      '<line x1="60" y1="160" x2="430" y2="160" class="d-axis"/>' +
      '<rect x="90" y="112" width="70" height="48" rx="4" fill="var(--slate)" opacity="0.75"/>' +
      '<text x="125" y="176" class="d-label--sm" text-anchor="middle">Minimum</text>' +
      '<text x="125" y="188" class="d-note" text-anchor="middle">batas legal</text>' +
      '<text x="125" y="104" class="d-note" text-anchor="middle" fill="var(--slate)">ditetapkan negara</text>' +
      '<rect x="220" y="58" width="70" height="102" rx="4" fill="var(--pine)" opacity="0.8"/>' +
      '<text x="255" y="176" class="d-label--sm" text-anchor="middle">Living wage</text>' +
      '<text x="255" y="188" class="d-note" text-anchor="middle">kebutuhan nyata</text>' +
      '<text x="255" y="50" class="d-note" text-anchor="middle" fill="var(--pine)">pangan · rumah · sehat · sekolah</text>' +
      '<path d="M175 112 H205 M175 58 H205" stroke="var(--clay)" stroke-width="1" stroke-dasharray="3 2"/>' +
      '<path d="M190 112 V58" stroke="var(--clay)" stroke-width="1.5"/>' +
      '<text x="352" y="86" class="d-label--sm" text-anchor="middle" fill="var(--clay)">SELISIH INI</text>' +
      '<text x="352" y="102" class="d-note" text-anchor="middle">legal untuk dibayarkan,</text>' +
      '<text x="352" y="115" class="d-note" text-anchor="middle">tetapi tetap dipersoalkan</text>' +
      '<text x="352" y="128" class="d-note" text-anchor="middle">secara etis</text>' +
      '<path d="M300 100 H196" class="d-arrow" stroke="var(--clay)" stroke-dasharray="3 2"/>' +
      '</svg>',
      'Contoh sempurna kuadran "legal tetapi tidak etis" dari CM1, diterapkan pada ketenagakerjaan.'
    );
  },

  /* ---------- CM8 ---------- */

  consumerRights: function () {
    return fig(
      '<svg viewBox="0 0 500 220" role="img" aria-label="Empat hak konsumen">' +
      '<rect x="20" y="20" width="220" height="80" rx="11" class="d-box--pine"/>' +
      '<text x="130" y="46" class="d-label--sm" text-anchor="middle" fill="var(--pine)">RIGHT TO SAFETY</text>' +
      '<text x="130" y="66" class="d-note" text-anchor="middle">perlindungan dari produk</text>' +
      '<text x="130" y="79" class="d-note" text-anchor="middle">yang membahayakan</text>' +
      '<rect x="260" y="20" width="220" height="80" rx="11" class="d-box--brass"/>' +
      '<text x="370" y="46" class="d-label--sm" text-anchor="middle" fill="var(--brass)">RIGHT TO BE INFORMED</text>' +
      '<text x="370" y="66" class="d-note" text-anchor="middle">bebas dari informasi menipu,</text>' +
      '<text x="370" y="79" class="d-note" text-anchor="middle">fakta untuk memilih</text>' +
      '<rect x="20" y="110" width="220" height="80" rx="11" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1"/>' +
      '<text x="130" y="136" class="d-label--sm" text-anchor="middle" fill="var(--slate)">RIGHT TO CHOOSE</text>' +
      '<text x="130" y="156" class="d-note" text-anchor="middle">akses pada beragam produk</text>' +
      '<text x="130" y="169" class="d-note" text-anchor="middle">dengan harga kompetitif</text>' +
      '<rect x="260" y="110" width="220" height="80" rx="11" class="d-box--dark"/>' +
      '<text x="370" y="136" class="d-label--sm d-label--inv" text-anchor="middle">RIGHT TO BE HEARD</text>' +
      '<text x="370" y="156" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">kepentingan diperhatikan,</text>' +
      '<text x="370" y="169" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">keluhan ditanggapi</text>' +
      '<text x="250" y="212" class="d-note" text-anchor="middle">Kennedy (1962) · diperluas: redress · education · basic needs · healthy environment</text>' +
      '</svg>',
      'Di Indonesia hak-hak ini dijamin UU No. 8/1999 tentang Perlindungan Konsumen.'
    );
  },

  marketingMix: function () {
    return fig(
      '<div class="mx-wrap"><span class="mx-ylabel">Bauran pemasaran</span>' +
      '<div class="mx-grid">' +
      '<div class="mx-cell mx-bad"><b>Product</b><span>Keamanan &amp; liability, planned obsolescence, klaim palsu, kemasan menyesatkan.</span></div>' +
      '<div class="mx-cell mx-warn"><b>Price</b><span>Price fixing, predatory pricing, price gouging, deceptive &amp; drip pricing.</span></div>' +
      '<div class="mx-cell mx-warn"><b>Place</b><span>Dumping produk terlarang ke pasar longgar, tekanan pada distributor, akses tak merata.</span></div>' +
      '<div class="mx-cell mx-bad"><b>Promotion</b><span>Deception, puffery, iklan untuk anak, influencer tanpa pengungkapan, greenwashing.</span></div>' +
      '</div><span class="mx-xlabel">Isu etis di tiap unsur</span></div>',
      'Setiap unsur bauran pemasaran punya isu etisnya sendiri — kerangka ini memudahkan menyusun jawaban yang sistematis.'
    );
  },

  bopPyramid: function () {
    return fig(
      '<svg viewBox="0 0 460 240" role="img" aria-label="Piramida pendapatan dunia">' +
      '<polygon points="230,14 282,74 178,74" fill="var(--panel)" stroke="var(--panel)"/>' +
      '<polygon points="176,80 284,80 330,144 130,144" fill="var(--brass-soft)" stroke="var(--brass)" stroke-width="1.2"/>' +
      '<polygon points="128,150 332,150 392,226 68,226" fill="var(--pine-soft)" stroke="var(--pine)" stroke-width="1.2"/>' +
      '<text x="230" y="58" class="d-label--sm d-label--inv" text-anchor="middle">TIER 1</text>' +
      '<text x="230" y="108" class="d-label--sm" text-anchor="middle" fill="var(--brass)">TIER 2–3</text>' +
      '<text x="230" y="126" class="d-note" text-anchor="middle">kelas menengah</text>' +
      '<text x="230" y="182" class="d-label--sm" text-anchor="middle" fill="var(--pine)">BOTTOM OF THE PYRAMID</text>' +
      '<text x="230" y="200" class="d-note" text-anchor="middle">miliaran orang berpendapatan rendah</text>' +
      '<text x="230" y="214" class="d-note" text-anchor="middle">pasar terbesar, paling terabaikan</text>' +
      '<text x="410" y="46" class="d-note" text-anchor="end" fill="var(--ink-faint)">sedikit orang,</text>' +
      '<text x="410" y="58" class="d-note" text-anchor="end" fill="var(--ink-faint)">daya beli besar</text>' +
      '</svg>',
      'Gagasan Prahalad. Kritiknya: tanpa keterlibatan komunitas, BOP berisiko menjadi eksploitasi terhadap yang paling rentan.'
    );
  },

  /* ---------- CM9 ---------- */

  supplyChainResp: function () {
    return fig(
      '<svg viewBox="0 0 560 190" class="wide" role="img" aria-label="Tanggung jawab rantai pasok yang diperluas">' + ARROW +
      '<rect x="10" y="66" width="96" height="48" rx="9" class="d-box"/>' +
      '<text x="58" y="86" class="d-label--sm" text-anchor="middle">Tambang /</text>' +
      '<text x="58" y="99" class="d-label--sm" text-anchor="middle">kebun</text>' +
      '<rect x="126" y="66" width="96" height="48" rx="9" class="d-box"/>' +
      '<text x="174" y="86" class="d-label--sm" text-anchor="middle">Pemasok</text>' +
      '<text x="174" y="99" class="d-label--sm" text-anchor="middle">tier 2–3</text>' +
      '<rect x="242" y="66" width="96" height="48" rx="9" class="d-box"/>' +
      '<text x="290" y="86" class="d-label--sm" text-anchor="middle">Pemasok</text>' +
      '<text x="290" y="99" class="d-label--sm" text-anchor="middle">tier 1</text>' +
      '<rect x="358" y="66" width="96" height="48" rx="9" class="d-box--dark"/>' +
      '<text x="406" y="94" class="d-label--sm d-label--inv" text-anchor="middle">PERUSAHAAN</text>' +
      '<rect x="474" y="66" width="76" height="48" rx="9" class="d-box"/>' +
      '<text x="512" y="86" class="d-label--sm" text-anchor="middle">Konsumen</text>' +
      '<text x="512" y="99" class="d-label--sm" text-anchor="middle">&amp; limbah</text>' +
      '<path d="M110 90 H120 M226 90 H236 M342 90 H352 M458 90 H468" class="d-arrow" marker-end="url(#ah)"/>' +
      '<rect x="352" y="56" width="108" height="68" rx="12" fill="none" stroke="var(--ink-faint)" stroke-width="1.2" stroke-dasharray="4 3"/>' +
      '<text x="406" y="46" class="d-note" text-anchor="middle">batas kepemilikan hukum</text>' +
      '<rect x="4" y="50" width="552" height="80" rx="16" fill="none" stroke="var(--pine)" stroke-width="1.8"/>' +
      '<text x="280" y="152" class="d-label--sm" text-anchor="middle" fill="var(--pine)">EXTENDED RESPONSIBILITY</text>' +
      '<text x="280" y="168" class="d-note" text-anchor="middle">tanggung jawab meluas ke hulu dan hilir, melampaui apa yang dimiliki perusahaan</text>' +
      '</svg>',
      'Kotak putus-putus adalah batas hukum; garis hijau adalah batas moral yang kini diharapkan stakeholder.'
    );
  },

  fairTradeChain: function () {
    return fig(
      '<svg viewBox="0 0 560 200" class="wide" role="img" aria-label="Rantai konvensional vs fair trade">' + ARROW +
      '<text x="20" y="24" class="d-label--sm" text-anchor="start">RANTAI KONVENSIONAL</text>' +
      '<rect x="20" y="34" width="82" height="34" rx="7" class="d-box"/><text x="61" y="55" class="d-label--sm" text-anchor="middle">Petani</text>' +
      '<rect x="122" y="34" width="82" height="34" rx="7" class="d-box"/><text x="163" y="55" class="d-label--sm" text-anchor="middle">Tengkulak</text>' +
      '<rect x="224" y="34" width="82" height="34" rx="7" class="d-box"/><text x="265" y="55" class="d-label--sm" text-anchor="middle">Eksportir</text>' +
      '<rect x="326" y="34" width="82" height="34" rx="7" class="d-box"/><text x="367" y="55" class="d-label--sm" text-anchor="middle">Pengolah</text>' +
      '<rect x="428" y="34" width="112" height="34" rx="7" class="d-box"/><text x="484" y="55" class="d-label--sm" text-anchor="middle">Peritel · konsumen</text>' +
      '<path d="M106 51 H116 M208 51 H218 M310 51 H320 M412 51 H422" class="d-arrow" stroke="var(--ink-faint)" marker-end="url(#ah)"/>' +
      '<text x="61" y="82" class="d-note" text-anchor="middle" fill="var(--clay)">harga fluktuatif</text>' +
      '<line x1="20" y1="100" x2="540" y2="100" stroke="var(--line)" stroke-dasharray="4 4"/>' +
      '<text x="20" y="124" class="d-label--sm" text-anchor="start" fill="var(--pine)">RANTAI FAIRTRADE</text>' +
      '<rect x="20" y="134" width="112" height="34" rx="7" class="d-box--pine"/><text x="76" y="155" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Koperasi petani</text>' +
      '<rect x="152" y="134" width="112" height="34" rx="7" class="d-box--pine"/><text x="208" y="155" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Importir bersertifikat</text>' +
      '<rect x="284" y="134" width="112" height="34" rx="7" class="d-box"/><text x="340" y="155" class="d-label--sm" text-anchor="middle">Pengolah</text>' +
      '<rect x="416" y="134" width="124" height="34" rx="7" class="d-box"/><text x="478" y="155" class="d-label--sm" text-anchor="middle">Peritel · konsumen</text>' +
      '<path d="M136 151 H146 M268 151 H278 M400 151 H410" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="76" y="182" class="d-note" text-anchor="middle" fill="var(--pine)">harga minimum + premium</text>' +
      '<text x="340" y="182" class="d-note" text-anchor="middle">rantai lebih pendek, relasi jangka panjang</text>' +
      '</svg>',
      'Fair trade membuktikan struktur rantai pasok dapat dirancang ulang — bukan sesuatu yang harus diterima apa adanya.'
    );
  },

  circularEconomy: function () {
    return fig(
      '<svg viewBox="0 0 460 260" role="img" aria-label="Ekonomi linier vs sirkular">' + ARROW +
      '<text x="230" y="20" class="d-label--sm" text-anchor="middle" fill="var(--clay)">LINIER: take → make → dispose</text>' +
      '<rect x="40" y="32" width="90" height="30" rx="7" class="d-box"/><text x="85" y="52" class="d-label--sm" text-anchor="middle">Ambil</text>' +
      '<rect x="185" y="32" width="90" height="30" rx="7" class="d-box"/><text x="230" y="52" class="d-label--sm" text-anchor="middle">Produksi</text>' +
      '<rect x="330" y="32" width="90" height="30" rx="7" class="d-box--clay"/><text x="375" y="52" class="d-label--sm" text-anchor="middle" fill="var(--clay)">Buang</text>' +
      '<path d="M134 47 H179 M279 47 H324" class="d-arrow" stroke="var(--ink-faint)" marker-end="url(#ah)"/>' +
      '<line x1="30" y1="82" x2="430" y2="82" stroke="var(--line)" stroke-dasharray="4 4"/>' +
      '<circle cx="230" cy="176" r="72" class="d-ring" stroke="var(--pine)" stroke-dasharray="6 4" stroke-width="1.5"/>' +
      '<rect x="176" y="94" width="108" height="30" rx="7" class="d-box--pine"/><text x="230" y="114" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Desain &amp; produksi</text>' +
      '<rect x="312" y="160" width="106" height="30" rx="7" class="d-box--pine"/><text x="365" y="180" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Pakai &amp; rawat</text>' +
      '<rect x="176" y="228" width="108" height="30" rx="7" class="d-box--pine"/><text x="230" y="248" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Perbaiki &amp; pakai ulang</text>' +
      '<rect x="42" y="160" width="106" height="30" rx="7" class="d-box--pine"/><text x="95" y="180" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Daur ulang</text>' +
      '<path d="M288 128 A72 72 0 0 1 314 156" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M338 200 A72 72 0 0 1 290 226" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M170 226 A72 72 0 0 1 122 198" class="d-arrow" marker-end="url(#ah)"/>' +
      '<path d="M146 156 A72 72 0 0 1 172 128" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="230" y="172" class="d-label--sm" text-anchor="middle" fill="var(--pine)">SIRKULAR</text>' +
      '<text x="230" y="186" class="d-note" text-anchor="middle">limbah = bahan baku</text>' +
      '</svg>',
      'Hierarkinya: refuse, reduce, reuse, repair, refurbish, remanufacture, recycle — daur ulang justru pilihan terakhir.'
    );
  },

  /* ---------- CM10 ---------- */

  csoSpectrum: function () {
    return fig(
      '<svg viewBox="0 0 560 170" class="wide" role="img" aria-label="Spektrum hubungan bisnis dan CSO">' +
      '<defs><linearGradient id="spec" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="var(--clay)"/><stop offset="50%" stop-color="var(--brass-bright)"/>' +
      '<stop offset="100%" stop-color="var(--pine)"/></linearGradient></defs>' +
      '<rect x="20" y="74" width="520" height="12" rx="6" fill="url(#spec)"/>' +
      '<circle cx="100" cy="80" r="9" fill="var(--clay)" stroke="var(--paper)" stroke-width="3"/>' +
      '<circle cx="280" cy="80" r="9" fill="var(--brass-bright)" stroke="var(--paper)" stroke-width="3"/>' +
      '<circle cx="460" cy="80" r="9" fill="var(--pine)" stroke="var(--paper)" stroke-width="3"/>' +
      '<text x="100" y="52" class="d-label--sm" text-anchor="middle" fill="var(--clay)">CONFRONTATION</text>' +
      '<text x="100" y="36" class="d-note" text-anchor="middle">boikot · kampanye · litigasi</text>' +
      '<text x="280" y="52" class="d-label--sm" text-anchor="middle" fill="var(--brass)">DIALOGUE</text>' +
      '<text x="280" y="36" class="d-note" text-anchor="middle">konsultasi · panel penasihat</text>' +
      '<text x="460" y="52" class="d-label--sm" text-anchor="middle" fill="var(--pine)">PARTNERSHIP</text>' +
      '<text x="460" y="36" class="d-note" text-anchor="middle">program &amp; keputusan bersama</text>' +
      '<text x="100" y="112" class="d-note" text-anchor="middle">tekanan tinggi,</text>' +
      '<text x="100" y="124" class="d-note" text-anchor="middle">biaya tinggi</text>' +
      '<text x="280" y="112" class="d-note" text-anchor="middle">risiko: tokenism</text>' +
      '<text x="460" y="112" class="d-note" text-anchor="middle">risiko: co-optation</text>' +
      '<text x="280" y="152" class="d-note" text-anchor="middle">Hubungan sering bergerak sepanjang spektrum ini seiring waktu</text>' +
      '</svg>',
      'Tidak ada posisi yang otomatis lebih etis — masing-masing punya kekuatan dan risikonya sendiri.'
    );
  },

  /* ---------- CM11 ---------- */

  govBusiness: function () {
    return fig(
      '<svg viewBox="0 0 500 210" role="img" aria-label="Hubungan bisnis dan pemerintah">' + ARROW +
      '<rect x="20" y="66" width="150" height="70" rx="11" class="d-box--dark"/>' +
      '<text x="95" y="96" class="d-label d-label--inv" text-anchor="middle">PEMERINTAH</text>' +
      '<text x="95" y="114" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">stakeholder &amp; pembuat aturan</text>' +
      '<rect x="330" y="66" width="150" height="70" rx="11" class="d-box--pine"/>' +
      '<text x="405" y="96" class="d-label" text-anchor="middle" fill="var(--pine)">BISNIS</text>' +
      '<text x="405" y="114" class="d-note" text-anchor="middle">objek aturan &amp; sumber pengaruh</text>' +
      '<path d="M176 84 H322" class="d-arrow" marker-end="url(#ah)"/>' +
      '<text x="249" y="76" class="d-note" text-anchor="middle">regulasi · pajak · pengadaan · subsidi</text>' +
      '<path d="M322 118 H176" class="d-arrow" stroke="var(--brass)" marker-end="url(#ah)"/>' +
      '<text x="249" y="134" class="d-note" text-anchor="middle" fill="var(--brass)">pajak · lapangan kerja · lobi · pendanaan</text>' +
      '<rect x="130" y="158" width="240" height="40" rx="10" class="d-box--clay"/>' +
      '<text x="250" y="175" class="d-label--sm" text-anchor="middle" fill="var(--clay)">ZONA RISIKO</text>' +
      '<text x="250" y="190" class="d-note" text-anchor="middle">revolving door · regulatory capture · state capture</text>' +
      '<text x="250" y="34" class="d-note" text-anchor="middle">Pengaruh dua arah — persoalannya bukan ada, tetapi caranya</text>' +
      '</svg>',
      'Memengaruhi kebijakan tidak otomatis tidak etis. Yang menentukan: transparansi, kejujuran data, dan kesetaraan akses.'
    );
  },

  regGap: function () {
    return fig(
      '<svg viewBox="0 0 560 200" class="wide" role="img" aria-label="Celah regulasi global">' +
      '<rect x="20" y="30" width="520" height="46" rx="10" class="d-box--pine"/>' +
      '<text x="280" y="50" class="d-label--sm" text-anchor="middle" fill="var(--pine)">JANGKAUAN BISNIS GLOBAL</text>' +
      '<text x="280" y="66" class="d-note" text-anchor="middle">rantai pasok, data, dan modal bergerak lintas batas tanpa hambatan</text>' +
      '<rect x="30" y="112" width="118" height="44" rx="8" class="d-box"/><text x="89" y="139" class="d-label--sm" text-anchor="middle">Negara A</text>' +
      '<rect x="168" y="112" width="118" height="44" rx="8" class="d-box"/><text x="227" y="139" class="d-label--sm" text-anchor="middle">Negara B</text>' +
      '<rect x="306" y="112" width="118" height="44" rx="8" class="d-box"/><text x="365" y="139" class="d-label--sm" text-anchor="middle">Negara C</text>' +
      '<rect x="444" y="112" width="96" height="44" rx="8" class="d-box"/><text x="492" y="139" class="d-label--sm" text-anchor="middle">Negara D</text>' +
      '<path d="M152 112 V156 M290 112 V156 M428 112 V156" stroke="var(--clay)" stroke-width="2"/>' +
      '<text x="280" y="98" class="d-note" text-anchor="middle" fill="var(--clay)">GOVERNANCE GAP — aturan berhenti di batas negara</text>' +
      '<text x="280" y="180" class="d-note" text-anchor="middle">Respons: self-regulation → soft law → multi-stakeholder initiatives</text>' +
      '<text x="280" y="194" class="d-note" text-anchor="middle" fill="var(--brass)">Risiko: regulatory arbitrage &amp; race to the bottom</text>' +
      '</svg>',
      'Ketimpangan struktural ini adalah benang merah seluruh buku: bisnis global, aturan nasional.'
    );
  },

  sdgGrid: function () {
    const groups = [
      ["People", ["1 Tanpa kemiskinan", "2 Tanpa kelaparan", "3 Kesehatan", "4 Pendidikan", "5 Kesetaraan gender"], "var(--clay)"],
      ["Planet", ["6 Air bersih", "12 Konsumsi", "13 Iklim", "14 Ekosistem laut", "15 Ekosistem darat"], "var(--pine)"],
      ["Prosperity", ["7 Energi bersih", "8 Kerja layak", "9 Industri", "10 Ketimpangan", "11 Kota"], "var(--brass)"],
      ["Peace & Partnership", ["16 Perdamaian &amp; institusi", "17 Kemitraan"], "var(--slate)"]
    ];
    let h = '<div class="dbm-grid dbm-grid--3" style="grid-template-columns:repeat(2,1fr)">';
    groups.forEach(function (g) {
      h += '<div class="dbm-card" style="border-color:' + g[2] + '"><b style="color:' + g[2] + '">' + g[0] + '</b><span>' +
        g[1].join(' · ') + '</span></div>';
    });
    h += '</div>';
    return fig(h, '17 SDGs dikelompokkan menjadi 5P. Kritik utamanya: perusahaan cenderung memilih tujuan yang mudah dan mengabaikan yang paling terdampak operasinya.');
  },

  /* ---------- CM12 ---------- */

  aiEthics: function () {
    return fig(
      '<div class="mx-wrap"><span class="mx-ylabel">Dampak pada manusia →</span>' +
      '<div class="mx-grid">' +
      '<div class="mx-cell mx-warn"><b>Perlu pengawasan</b><span>Rekomendasi konten, penetapan harga dinamis, pemantauan produktivitas. Dampak besar, keputusan sering tak terlihat.</span></div>' +
      '<div class="mx-cell mx-bad"><b>Risiko tinggi</b><span>Seleksi kerja, penilaian kredit, diagnosis medis, penegakan hukum. Wajib: penjelasan, uji bias, pengawasan manusia.</span></div>' +
      '<div class="mx-cell mx-good"><b>Risiko rendah</b><span>Penyaring spam, penerjemahan, penjadwalan. Cukup transparansi dasar.</span></div>' +
      '<div class="mx-cell mx-warn"><b>Perlu transparansi</b><span>Chatbot layanan, konten buatan mesin. Kewajiban utamanya: pengguna tahu bahwa ini bukan manusia.</span></div>' +
      '</div><span class="mx-xlabel">Otonomi sistem →</span></div>',
      'Pendekatan berbasis tingkat risiko — sejalan dengan kerangka EU AI Act. Semakin besar dampaknya pada hak seseorang, semakin ketat kewajibannya.'
    );
  },

  esgPillars: function () {
    return fig(
      '<svg viewBox="0 0 500 220" role="img" aria-label="Tiga pilar ESG">' +
      '<rect x="30" y="46" width="130" height="120" rx="10" class="d-box--pine"/>' +
      '<text x="95" y="72" class="d-label" text-anchor="middle" fill="var(--pine)">E</text>' +
      '<text x="95" y="90" class="d-label--sm" text-anchor="middle" fill="var(--pine)">Environmental</text>' +
      '<text x="95" y="112" class="d-note" text-anchor="middle">emisi · energi · air</text>' +
      '<text x="95" y="126" class="d-note" text-anchor="middle">limbah · biodiversitas</text>' +
      '<text x="95" y="140" class="d-note" text-anchor="middle">risiko iklim</text>' +
      '<rect x="185" y="46" width="130" height="120" rx="10" class="d-box--brass"/>' +
      '<text x="250" y="72" class="d-label" text-anchor="middle" fill="var(--brass)">S</text>' +
      '<text x="250" y="90" class="d-label--sm" text-anchor="middle" fill="var(--brass)">Social</text>' +
      '<text x="250" y="112" class="d-note" text-anchor="middle">hak pekerja · K3</text>' +
      '<text x="250" y="126" class="d-note" text-anchor="middle">rantai pasok · HAM</text>' +
      '<text x="250" y="140" class="d-note" text-anchor="middle">komunitas · konsumen</text>' +
      '<rect x="340" y="46" width="130" height="120" rx="10" fill="rgba(51,96,127,0.16)" stroke="var(--slate)" stroke-width="1"/>' +
      '<text x="405" y="72" class="d-label" text-anchor="middle" fill="var(--slate)">G</text>' +
      '<text x="405" y="90" class="d-label--sm" text-anchor="middle" fill="var(--slate)">Governance</text>' +
      '<text x="405" y="112" class="d-note" text-anchor="middle">dewan · remunerasi</text>' +
      '<text x="405" y="126" class="d-note" text-anchor="middle">antikorupsi · pajak</text>' +
      '<text x="405" y="140" class="d-note" text-anchor="middle">lobi · transparansi</text>' +
      '<rect x="30" y="176" width="440" height="34" rx="9" class="d-box--dark"/>' +
      '<text x="250" y="191" class="d-label--sm d-label--inv" text-anchor="middle">DOUBLE MATERIALITY</text>' +
      '<text x="250" y="204" class="d-note" fill="rgba(233,239,228,0.72)" text-anchor="middle">dampak isu pada perusahaan &nbsp;↔&nbsp; dampak perusahaan pada manusia &amp; lingkungan</text>' +
      '<text x="250" y="32" class="d-note" text-anchor="middle">Governance sering terlupakan, padahal ia yang menentukan apakah E dan S benar-benar dijalankan</text>' +
      '</svg>',
      'Perhatikan baris bawah: sebagian besar perusahaan hanya melaporkan satu arah materialitas.'
    );
  }

  };
})();
