/* ============================================================
   Rute — helpers: DOM, format, tanggal
   ============================================================ */

window.U = (function () {
  'use strict';

  /* ---------- DOM ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'style') node.setAttribute('style', v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function svg(pathData, opts) {
    opts = opts || {};
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', opts.viewBox || '0 0 20 20');
    s.setAttribute('class', 'ico' + (opts.class ? ' ' + opts.class : ''));
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    var pth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pth.setAttribute('d', pathData);
    if (opts.stroke) {
      pth.setAttribute('fill', 'none');
      pth.setAttribute('stroke', 'currentColor');
      pth.setAttribute('stroke-width', opts.strokeWidth || '1.7');
      pth.setAttribute('stroke-linecap', 'round');
      pth.setAttribute('stroke-linejoin', 'round');
    }
    s.appendChild(pth);
    return s;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* Ikon dipakai di banyak tempat — satu set, satu gaya. */
  var ICONS = {
    clock:  { d: 'M10 3.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6ZM10 6.4V10l2.4 1.6', stroke: true },
    money:  { d: 'M3.4 5.6h13.2v8.8H3.4zM10 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4', stroke: true },
    pin:    { d: 'M10 17.5s5.4-4.8 5.4-9a5.4 5.4 0 1 0-10.8 0c0 4.2 5.4 9 5.4 9ZM10 10.4a2 2 0 1 0 0-4 2 2 0 0 0 0 4', stroke: true },
    route:  { d: 'M6 16.4c0-4 7-2.6 7-6.4S6 7.4 6 3.6', stroke: true, sw: '1.8' },
    tidy:   { d: 'M3.4 6.2h9.2M10.4 4l2.2 2.2-2.2 2.2M16.6 13.8H7.4M9.6 11.6l-2.2 2.2 2.2 2.2', stroke: true, sw: '1.8' },
    car:    { d: 'M3.6 12.6h12.8M5 12.6 6.3 8.4a1.4 1.4 0 0 1 1.3-1h4.8a1.4 1.4 0 0 1 1.3 1l1.3 4.2M3.6 12.6v2.6h2.2v-2.6M14.2 12.6v2.6h2.2v-2.6', stroke: true },
    bike:   { d: 'M5.6 15.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM14.4 15.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM7.6 6.4h2.8l3 6.4M8.4 12.8h4', stroke: true },
    walk:   { d: 'M11 4.6a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM9.6 17.4l1.2-4.2-2-1.8.8-4 2.6 1.6 1.8 1M8.8 8.6 6.4 9.8M9 13.2l-2.2 4.2', stroke: true },
    warn:   { d: 'M10 3.4 2.6 16.2h14.8L10 3.4ZM10 8.2v3.4M10 13.6v.05', stroke: true, sw: '1.6' },
    check:  { d: 'M4.4 10.4 8 14l7.6-8', stroke: true, sw: '1.9' },
    info:   { d: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 9.2v4.2M10 6.7v.05', stroke: true },
    plus:   { d: 'M10 4.4v11.2M4.4 10h11.2', stroke: true, sw: '1.9' },
    trash:  { d: 'M4.6 6h10.8M8.2 6V4.4h3.6V6M6.2 6l.6 9.6h6.4L13.8 6', stroke: true },
    up:     { d: 'M10 15.2V5.6M5.8 9.4 10 5.2l4.2 4.2', stroke: true, sw: '1.8' },
    down:   { d: 'M10 4.8v9.6M5.8 10.6 10 14.8l4.2-4.2', stroke: true, sw: '1.8' },
    cal:    { d: 'M4.4 5.6h11.2v10.4H4.4zM4.4 9h11.2M7.4 3.4v3M12.6 3.4v3', stroke: true },
    ext:    { d: 'M11.4 4.4h4.2v4.2M15.6 4.4 9.4 10.6M14 11.6v3.4a1.2 1.2 0 0 1-1.2 1.2H5a1.2 1.2 0 0 1-1.2-1.2V7.2A1.2 1.2 0 0 1 5 6h3.4', stroke: true },
    star:   { d: 'm10 3.4 2.06 4.18 4.61.67-3.34 3.25.79 4.59L10 13.92l-4.12 2.17.79-4.59L3.33 8.25l4.61-.67L10 3.4', stroke: true, sw: '1.5' },
    wand:   { d: 'm4 16 8-8M13.4 3.6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8ZM6.2 4l.5 1.2 1.2.5-1.2.5L6.2 7.4 5.7 6.2 4.5 5.7l1.2-.5L6.2 4Z', stroke: true, sw: '1.5' },
    sun:    { d: 'M10 13.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM10 2.6v1.6M10 15.8v1.6M3.8 10H2.2M17.8 10h-1.6M5.6 5.6 4.5 4.5M15.5 15.5l-1.1-1.1M5.6 14.4l-1.1 1.1M15.5 4.5l-1.1 1.1', stroke: true, sw: '1.6' }
  };

  function icon(name, cls) {
    var def = ICONS[name] || ICONS.info;
    return svg(def.d, { stroke: def.stroke, strokeWidth: def.sw, class: cls });
  }

  /* ---------- angka & format ---------- */

  function rupiah(n) {
    n = Math.round(Number(n) || 0);
    return 'Rp' + n.toLocaleString('id-ID');
  }

  function rupiahShort(n) {
    n = Math.round(Number(n) || 0);
    if (Math.abs(n) >= 1000000) {
      var jt = n / 1000000;
      return 'Rp' + (jt % 1 === 0 ? jt : jt.toFixed(1).replace('.', ',')) + ' jt';
    }
    if (Math.abs(n) >= 1000) return 'Rp' + Math.round(n / 1000) + 'rb';
    return 'Rp' + n;
  }

  /** menit -> "1j 25m" */
  function dur(mins) {
    mins = Math.max(0, Math.round(mins || 0));
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return h + 'j ' + m + 'm';
    if (h) return h + ' jam';
    return m + ' mnt';
  }

  function km(v) {
    if (v < 10) return v.toFixed(1).replace('.', ',') + ' km';
    return Math.round(v) + ' km';
  }

  /* ---------- waktu (menit sejak tengah malam) ---------- */

  function toMin(hhmm) {
    if (!hhmm) return null;
    var parts = String(hhmm).split(':');
    var h = parseInt(parts[0], 10), m = parseInt(parts[1] || '0', 10);
    if (isNaN(h)) return null;
    return h * 60 + (isNaN(m) ? 0 : m);
  }

  function toHHMM(mins) {
    if (mins === null || mins === undefined || isNaN(mins)) return '--:--';
    var wrapped = ((Math.round(mins) % 1440) + 1440) % 1440;
    var h = Math.floor(wrapped / 60), m = wrapped % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  /* Menandai kalau jam sudah lewat tengah malam. */
  function dayOffset(mins) { return Math.floor(mins / 1440); }

  /** Jam dengan penanda hari berikutnya, mis. "07:29 (+1 hari)". */
  function toHHMMDay(mins) {
    var off = dayOffset(mins);
    if (off <= 0) return toHHMM(mins);
    return toHHMM(mins) + ' (+' + off + ' hari)';
  }

  /* ---------- tanggal (ISO yyyy-mm-dd, lokal) ---------- */

  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
               'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  function isoToday() {
    var d = new Date();
    return isoOf(d);
  }

  function isoOf(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function parseIso(iso) {
    if (!iso) return null;
    var p = String(iso).split('-');
    if (p.length !== 3) return null;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(d.getTime()) ? null : d;
  }

  function addDays(iso, n) {
    var d = parseIso(iso);
    if (!d) return iso;
    d.setDate(d.getDate() + n);
    return isoOf(d);
  }

  function fmtDate(iso, opts) {
    var d = parseIso(iso);
    if (!d) return 'Tanggal belum diisi';
    var s = HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()];
    if (opts && opts.year) s += ' ' + d.getFullYear();
    return s;
  }

  function fmtDateShort(iso) {
    var d = parseIso(iso);
    if (!d) return '—';
    return d.getDate() + ' ' + BULAN[d.getMonth()].slice(0, 3);
  }

  function isWeekend(iso) {
    var d = parseIso(iso);
    if (!d) return false;
    return d.getDay() === 0 || d.getDay() === 6;
  }

  /* ---------- lain-lain ---------- */

  function uid(prefix) {
    return (prefix || 'x') + '-' + Math.random().toString(36).slice(2, 9);
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  function deburr(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  return {
    el: el, svg: svg, icon: icon, clear: clear, qs: qs, qsa: qsa,
    rupiah: rupiah, rupiahShort: rupiahShort, dur: dur, km: km,
    toMin: toMin, toHHMM: toHHMM, toHHMMDay: toHHMMDay, dayOffset: dayOffset,
    isoToday: isoToday, isoOf: isoOf, parseIso: parseIso, addDays: addDays,
    fmtDate: fmtDate, fmtDateShort: fmtDateShort, isWeekend: isWeekend,
    uid: uid, clamp: clamp, debounce: debounce, deburr: deburr,
    HARI: HARI, BULAN: BULAN
  };
})();
