/* ============================================================
   Rute — bootstrap & orkestrasi
   ============================================================ */

window.App = (function () {
  'use strict';

  var currentView = 'plan';
  var mapScope = 'day';
  var mapOpen = false;
  var computed = null;
  var warming = false;

  /* ---------- render pusat ---------- */

  function refresh() {
    var trip = Store.get();
    computed = Schedule.computeTrip(trip);

    Shell.renderTopbar(computed);
    Shell.renderRail(computed);

    if (currentView === 'plan') PlanView.render(computed);
    else if (currentView === 'explore') ExploreView.render();
    else if (currentView === 'budget') BudgetView.render(computed);
    else if (currentView === 'live') LiveView.render(computed);

    renderMap();
  }

  /* ---------- navigasi tampilan ---------- */

  function setView(view) {
    if (currentView === view) {
      if (view === 'plan') U.qs('.content').scrollTop = 0;
      return;
    }
    currentView = view;
    Store.setPref('view', view);

    ['plan', 'explore', 'budget', 'live'].forEach(function (v) {
      U.qs('#view-' + v).hidden = v !== view;
    });
    U.qsa('.rail__btn[data-view]').forEach(function (b) {
      var on = b.getAttribute('data-view') === view;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    if (view === 'live') LiveView.startTicking(function () { if (currentView === 'live') refresh(); });
    else LiveView.stopTicking();

    refresh();
    U.qs('.content').scrollTop = 0;
  }

  /* ---------- peta ---------- */

  function buildMapModel() {
    var trip = Store.get();
    var activeIndex = Store.dayIndex(trip.activeDayId);
    var days = [];

    computed.days.forEach(function (dc, di) {
      var points = [];
      var legs = [];
      var order = 0;

      dc.items.forEach(function (it) {
        if (it.type === 'stop') {
          order++;
          points.push({ place: it.place, order: order, arrive: it.arrive, depart: it.depart });
        } else {
          legs.push({
            from: { lat: it.from.lat, lng: it.from.lng },
            to: { lat: it.to.lat, lng: it.to.lng },
            geometry: geometryFor(it, dc.day.mode)
          });
        }
      });

      if (points.length) days.push({ index: di, points: points, legs: legs, mode: dc.day.mode });
    });

    var focus = mapScope === 'day' ? activeIndex : null;

    /* Dalam mode "semua hari", warna saja tidak cukup untuk
       membedakan lebih dari beberapa hari — makanya tiap penanda
       tetap membawa nomor urutannya dan legenda selalu ada. */
    return { days: days, focusIndex: focus, hub: trip.hub };
  }

  function geometryFor(leg, mode) {
    if (!Store.get().liveRouting) return null;
    var m = Geo.MODES[mode] || Geo.MODES.motor;
    var cached = Geo.hasLive(leg.from, leg.to, mode);
    if (!cached) return null;
    var full = Geo.leg(leg.from, leg.to, mode, { live: true, roadFactor: Store.dest().roadFactor });
    return full.geometry || null;
  }

  function renderMap() {
    var model = buildMapModel();
    RMap.render(model);
    renderLegend(model);
  }

  function renderLegend(model) {
    var host = U.qs('#mapLegend');
    U.clear(host);

    if (!model.days.length) {
      host.appendChild(U.el('p', { class: 'legend__note', text: 'Belum ada tempat untuk dipetakan.' }));
      return;
    }

    var wrap = U.el('div', { class: 'legend' });

    if (mapScope === 'day') {
      var di = model.focusIndex;
      var d = null;
      model.days.forEach(function (x) { if (x.index === di) d = x; });
      if (d) {
        wrap.appendChild(U.el('span', { class: 'legend__item' }, [
          U.el('i', { class: 'legend__sw', style: '--swatch: var(--day-' + ((di % 7) + 1) + ')' }),
          U.el('span', { text: 'Hari ' + (di + 1) + ' · ' + d.points.length + ' perhentian, bernomor sesuai urutan' })
        ]));
      } else {
        wrap.appendChild(U.el('span', { class: 'legend__note', text: 'Hari aktif belum punya tempat.' }));
      }
    } else {
      model.days.forEach(function (d) {
        wrap.appendChild(U.el('span', { class: 'legend__item' }, [
          U.el('i', { class: 'legend__sw', style: '--swatch: var(--day-' + ((d.index % 7) + 1) + ')' }),
          U.el('span', { text: 'Hari ' + (d.index + 1) })
        ]));
      });
      wrap.appendChild(U.el('span', { class: 'legend__note', text: '· angka di penanda = urutan kunjungan' }));
    }

    host.appendChild(wrap);

    var live = computed.totalLegs ? computed.liveLegs + '/' + computed.totalLegs : null;
    host.appendChild(U.el('p', {
      class: 'legend__note', style: 'margin-top:6px',
      text: !Store.get().liveRouting
        ? 'Garis putus-putus = perkiraan garis lurus. Aktifkan rute jalan sebenarnya di Pengaturan.'
        : (live ? live + ' ruas memakai rute jalan sebenarnya.' : 'Menghitung rute…')
    }));
  }

  function toggleMap(open) {
    mapOpen = open;
    U.qs('#mappane').classList.toggle('is-open', open);
    var tab = U.qs('#btnMapTab');
    tab.setAttribute('aria-expanded', open ? 'true' : 'false');
    tab.classList.toggle('is-active', open);
    if (open) RMap.invalidate();
  }

  /* ---------- rute nyata ---------- */

  function warmRoutes(force) {
    var trip = Store.get();
    if (!trip.liveRouting && !force) return;
    if (warming) return;

    var pairs = Schedule.legPairs(trip);
    if (!pairs.length) return;

    /* Kelompokkan per moda karena OSRM memakai profil berbeda. */
    var byMode = {};
    pairs.forEach(function (p) {
      var m = p[2] || 'motor';
      (byMode[m] = byMode[m] || []).push([p[0], p[1]]);
    });

    warming = true;
    var dismiss = Shell.toast('Menghitung rute jalan sebenarnya…');
    var modes = Object.keys(byMode);
    var i = 0;

    function nextMode() {
      if (i >= modes.length) {
        warming = false;
        dismiss();
        refresh();
        var pct = computed.totalLegs ? Math.round((computed.liveLegs / computed.totalLegs) * 100) : 0;
        Shell.toast(pct >= 100
          ? 'Semua ruas sudah memakai jarak jalan sebenarnya.'
          : (pct > 0
            ? pct + '% ruas berhasil dirutekan; sisanya tetap pakai estimasi.'
            : 'Layanan rute tidak bisa dihubungi. Tetap memakai estimasi.'));
        return;
      }
      var m = modes[i++];
      Geo.warm(byMode[m], m, function () { refresh(); }).then(nextMode);
    }
    nextMode();
  }

  /* ---------- ekspor ---------- */

  function exportIcs() {
    var trip = Store.get();
    if (!trip.days.some(function (d) { return !!d.date; })) {
      Shell.toast('Isi tanggal trip dulu di Pengaturan.', { label: 'Buka', run: function () { Shell.toggleDrawer(true); } });
      return;
    }
    var ics = Cal.buildIcs(trip, computed);
    var events = Cal.collect(trip, computed);
    if (!events.length) { Shell.toast('Belum ada kegiatan untuk diekspor.'); return; }

    Cal.download(Cal.slug(trip.name) + '.ics', ics);
    Shell.toast(events.length + ' acara diunduh. Impor lewat Google Calendar → Setelan → Impor & ekspor.');
  }

  function openDataPanel() {
    var trip = Store.get();
    var ta = U.el('textarea', {
      class: 'textarea', style: 'min-height: 180px; font-family: ui-monospace, monospace; font-size: 12px',
      spellcheck: 'false', 'aria-label': 'Data trip dalam format JSON'
    });
    ta.value = Store.exportJson();

    var err = U.el('p', { class: 'field__hint', style: 'color: var(--alert-ink)', hidden: true });

    Shell.openModal('Simpan / muat trip', U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: 'Trip tersimpan otomatis di browser ini. Untuk memindahkannya ke perangkat lain atau menyimpan beberapa versi, salin teks di bawah — atau unduh sebagai berkas.' }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn', type: 'button', text: 'Unduh berkas .json',
          onclick: function () {
            Cal.download(Cal.slug(trip.name) + '.json', Store.exportJson(), 'application/json');
          }
        }),
        U.el('button', {
          class: 'btn', type: 'button', text: 'Salin ke papan klip',
          onclick: function () {
            ta.select();
            try {
              if (navigator.clipboard) navigator.clipboard.writeText(ta.value);
              else document.execCommand('copy');
              Shell.toast('Data trip disalin.');
            } catch (e) { Shell.toast('Salin manual dengan Ctrl+C.'); }
          }
        })
      ]),
      ta,
      err,
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button', text: 'Muat dari teks di atas',
          onclick: function () {
            var parsed;
            try { parsed = JSON.parse(ta.value); }
            catch (e) { fail('Teksnya bukan JSON yang valid. Pastikan tersalin utuh.'); return; }
            if (!parsed || !parsed.days || !parsed.days.length) { fail('Data ini tidak berisi hari perjalanan.'); return; }
            if (!RUTE_DATA.DESTINATIONS.some(function (d) { return d.id === parsed.destId; })) {
              fail('Destinasi "' + parsed.destId + '" tidak dikenal di versi ini.');
              return;
            }

            /* Perhentian yang menunjuk ke tempat tak dikenal akan
               hilang diam-diam saat dijadwalkan. Lebih baik dibuang
               di sini dan dilaporkan apa adanya. */
            var known = {};
            RUTE_DATA.byId(parsed.destId).places.forEach(function (pl) { known[pl.id] = true; });
            (parsed.customPlaces || []).forEach(function (pl) { known[pl.id] = true; });

            var lost = 0;
            parsed.days.forEach(function (d) {
              d.stops = (d.stops || []).filter(function (s) {
                if (s.custom || known[s.placeId]) return true;
                lost++;
                return false;
              });
            });

            Store.replaceTrip(parsed);
            Shell.closeModal();
            Shell.toast(lost
              ? 'Trip dimuat, tapi ' + lost + ' tempat tidak dikenali dan dilewati.'
              : 'Trip dimuat.');
          }
        })
      ])
    ]));

    function fail(m) { err.textContent = m; err.hidden = false; }
  }

  /* ---------- papan ketik ---------- */

  function bindKeys() {
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (typing) return;
        e.preventDefault();
        var label = Store.undo();
        Shell.toast(label ? 'Dibatalkan: ' + label : 'Tidak ada yang bisa dibatalkan.');
        return;
      }
      if (typing) return;

      if (e.key === '1') setView('plan');
      else if (e.key === '2') setView('explore');
      else if (e.key === '3') setView('budget');
      else if (e.key === '4') setView('live');
      else if (e.key === 'm' || e.key === 'M') toggleMap(!mapOpen);
      else if (e.key === '?') showHelp();
    });
  }

  function showHelp() {
    Shell.openModal('Pintasan papan ketik', U.el('div', { class: 'detail' }, [
      U.el('div', { class: 'detail__facts' }, [
        kv('1 – 4', 'Pindah tampilan'),
        kv('M', 'Buka/tutup peta'),
        kv('Ctrl/Cmd + Z', 'Urungkan'),
        kv('?', 'Bantuan ini')
      ])
    ]));
    function kv(k, v) {
      return U.el('div', { class: 'detail__fact' }, [
        U.el('span', { class: 'detail__k', text: k }),
        U.el('span', { class: 'detail__v', text: v })
      ]);
    }
  }

  /* ---------- mulai ---------- */

  function init() {
    Store.init();
    Shell.init();

    var prefs = Store.getPrefs();
    mapScope = prefs.mapScope || 'day';
    U.qsa('.segmented__btn[data-mapscope]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-mapscope') === mapScope);
      b.addEventListener('click', function () {
        mapScope = b.getAttribute('data-mapscope');
        Store.setPref('mapScope', mapScope);
        U.qsa('.segmented__btn[data-mapscope]').forEach(function (o) {
          o.classList.toggle('is-active', o === b);
        });
        renderMap();
      });
    });

    RMap.init(U.qs('#mapCanvas'), function (placeId, dayIndex) {
      var trip = Store.get();
      if (trip.days[dayIndex]) Store.setActiveDay(trip.days[dayIndex].id);
      setView('plan');
      var stop = null;
      (trip.days[dayIndex] || { stops: [] }).stops.forEach(function (s) {
        if (s.placeId === placeId) stop = s;
      });
      if (stop) {
        setTimeout(function () {
          var node = U.qs('#stop-' + stop.id);
          if (node) {
            node.scrollIntoView({ block: 'center', behavior: 'smooth' });
            node.classList.add('is-focused');
            setTimeout(function () { node.classList.remove('is-focused'); }, 1600);
          }
        }, 60);
      }
    });

    U.qsa('.rail__btn[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
    });

    U.qs('#btnAddDay').addEventListener('click', function () {
      Store.addDay();
      Shell.toast('Hari ' + Store.get().days.length + ' ditambahkan.');
    });
    U.qs('#btnExportIcs').addEventListener('click', exportIcs);
    U.qs('#btnData').addEventListener('click', openDataPanel);
    U.qs('#btnMapTab').addEventListener('click', function () { toggleMap(!mapOpen); });
    U.qs('#btnCloseMap').addEventListener('click', function () { toggleMap(false); });

    Store.subscribe(function () { refresh(); });

    var startView = prefs.view && ['plan', 'explore', 'budget', 'live'].indexOf(prefs.view) >= 0
      ? prefs.view : 'plan';
    currentView = null;
    setView(startView);

    bindKeys();

    window.addEventListener('resize', U.debounce(function () { RMap.invalidate(); }, 200));

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onScheme = function () { if ((Store.getPrefs().theme || 'auto') === 'auto') refresh(); };
      if (mq.addEventListener) mq.addEventListener('change', onScheme);
      else if (mq.addListener) mq.addListener(onScheme);
    }

    if (Store.get().liveRouting) setTimeout(function () { warmRoutes(); }, 800);

    if (RMap.isFallback()) {
      setTimeout(function () {
        Shell.toast('Peta jalan tidak bisa dimuat — memakai peta skematik. Semua fitur lain tetap jalan.');
      }, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    refresh: refresh, setView: setView, warmRoutes: warmRoutes,
    exportIcs: exportIcs, toggleMap: toggleMap, openDataPanel: openDataPanel
  };
})();
