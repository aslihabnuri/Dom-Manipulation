/* ============================================================
   Rute — kerangka UI: tema, toast, modal, rail, pengaturan
   ============================================================ */

window.Shell = (function () {
  'use strict';

  var toastHost, modal, modalTitle, modalBody;
  var lastFocus = null;

  /* ---------- tema ---------- */

  function applyTheme(pref) {
    var root = document.documentElement;
    if (pref === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', pref);
  }

  function currentEffectiveTheme() {
    var stamped = document.documentElement.getAttribute('data-theme');
    if (stamped) return stamped;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }

  function toggleTheme() {
    var next = currentEffectiveTheme() === 'dark' ? 'light' : 'dark';
    Store.setPref('theme', next);
    applyTheme(next);
    return next;
  }

  /* ---------- toast ---------- */

  function toast(message, action) {
    if (!toastHost) toastHost = U.qs('#toasts');
    var node = U.el('div', { class: 'toast' }, [
      U.el('span', { text: message }),
      action ? U.el('button', {
        class: 'toast__act', type: 'button', text: action.label,
        onclick: function () { action.run(); dismiss(); }
      }) : null
    ]);
    toastHost.appendChild(node);

    var timer = setTimeout(dismiss, action ? 7000 : 3800);
    function dismiss() {
      clearTimeout(timer);
      if (node.parentNode) node.parentNode.removeChild(node);
    }
    return dismiss;
  }

  /* ---------- modal ---------- */

  function openModal(title, contentNode) {
    if (!modal) {
      modal = U.qs('#modal');
      modalTitle = U.qs('#modalTitle');
      modalBody = U.qs('#modalBody');
      U.qs('#modalClose').addEventListener('click', closeModal);
      modal.addEventListener('cancel', function (e) { e.preventDefault(); closeModal(); });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    U.clear(modalBody).appendChild(contentNode);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- drawer pengaturan ---------- */

  var drawer, drawerBody, drawerBtn, drawerOpen = false;

  function initDrawer() {
    drawer = U.qs('#settingsPanel');
    drawerBody = U.qs('#settingsBody');
    drawerBtn = U.qs('#btnSettings');

    drawerBtn.addEventListener('click', function () { toggleDrawer(!drawerOpen); });
    U.qs('#btnCloseSettings').addEventListener('click', function () { toggleDrawer(false); });
    U.qs('#drawerScrim').addEventListener('click', function () { toggleDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawerOpen) toggleDrawer(false);
    });
  }

  function toggleDrawer(open) {
    drawerOpen = open;
    drawer.hidden = !open;
    drawerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      renderSettings();
      var first = drawerBody.querySelector('input, select, button');
      if (first) first.focus();
    } else {
      drawerBtn.focus();
    }
  }

  /* ---------- isi pengaturan ---------- */

  function renderSettings() {
    var trip = Store.get();
    var dest = Store.dest();
    U.clear(drawerBody);

    /* Destinasi */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Destinasi' }),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'setDest', text: 'Kota tujuan' }),
        (function () {
          var sel = U.el('select', { class: 'select', id: 'setDest' },
            RUTE_DATA.DESTINATIONS.map(function (d) {
              return U.el('option', { value: d.id, text: d.name + ' — ' + d.region, selected: d.id === trip.destId });
            }));
          sel.addEventListener('change', function () {
            var next = sel.value;
            if (next === trip.destId) return;
            confirmSwitchDestination(next);
          });
          return sel;
        })()
      ]),
      U.el('p', { class: 'field__hint', text: dest.blurb })
    ]));

    /* Titik awal */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Titik awal harian' }),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'setHubName', text: 'Nama penginapan / titik kumpul' }),
        input('setHubName', trip.hub.name, function (v) {
          Store.update('ubah titik awal', function (t) { t.hub.name = v; }, { silent: true });
        })
      ]),
      U.el('div', { class: 'grid2' }, [
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'setHubLat', text: 'Lintang' }),
          numInput('setHubLat', trip.hub.lat, function (v) {
            Store.update('ubah titik awal', function (t) { t.hub.lat = v; });
          }, { step: 'any' })
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'setHubLng', text: 'Bujur' }),
          numInput('setHubLng', trip.hub.lng, function (v) {
            Store.update('ubah titik awal', function (t) { t.hub.lng = v; });
          }, { step: 'any' })
        ])
      ]),
      U.el('p', { class: 'field__hint', text: 'Salin koordinat dari Google Maps: klik kanan lokasi penginapan, lalu klik angka yang muncul.' })
    ]));

    /* Rombongan & anggaran */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Rombongan & anggaran' }),
      U.el('div', { class: 'grid2' }, [
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'setPeople', text: 'Jumlah orang' }),
          numInput('setPeople', trip.people, function (v) {
            Store.update('ubah jumlah orang', function (t) { t.people = Math.max(1, Math.round(v) || 1); });
          }, { min: 1, max: 40, step: 1 })
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'setLodging', text: 'Penginapan / malam' }),
          numInput('setLodging', trip.lodging, function (v) {
            Store.update('ubah biaya penginapan', function (t) { t.lodging = Math.max(0, v || 0); });
          }, { min: 0, step: 50000 })
        ])
      ]),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'setBudget', text: 'Target anggaran per orang' }),
        numInput('setBudget', trip.budget, function (v) {
          Store.update('ubah anggaran', function (t) { t.budget = Math.max(0, v || 0); });
        }, { min: 0, step: 100000 }),
        U.el('p', { class: 'field__hint', text: 'Isi 0 kalau tidak mau dipatok target.' })
      ])
    ]));

    /* Tanggal */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Tanggal' }),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'setStart', text: 'Hari pertama' }),
        (function () {
          var i = U.el('input', { class: 'input', id: 'setStart', type: 'date', value: trip.startDate || '' });
          i.addEventListener('change', function () {
            Store.update('ubah tanggal mulai', function (t) {
              t.startDate = i.value || null;
              Store.resyncDates(t);
            });
          });
          return i;
        })()
      ])
    ]));

    /* Rute nyata */
    var liveWrap = U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Akurasi jarak & waktu' }),
      (function () {
        var cb = U.el('input', { type: 'checkbox', id: 'setLive', checked: trip.liveRouting });
        cb.addEventListener('change', function () {
          Store.update('ubah mode rute', function (t) { t.liveRouting = cb.checked; });
          if (cb.checked) App.warmRoutes();
        });
        return U.el('label', { class: 'checkline', for: 'setLive' }, [cb, U.el('span', { text: 'Hitung rute jalan sebenarnya' })]);
      })(),
      U.el('p', { class: 'field__hint', text: 'Mengambil jarak dan durasi mengemudi asli dari layanan rute OpenStreetMap. Butuh internet; hasilnya disimpan agar tidak diminta berulang. Kalau gagal, aplikasi otomatis kembali ke estimasi.' }),
      U.el('div', { class: 'chiprow' }, [
        U.el('button', {
          class: 'btn btn--sm', type: 'button', text: 'Hitung ulang sekarang',
          onclick: function () { App.warmRoutes(true); }
        }),
        U.el('button', {
          class: 'btn btn--sm', type: 'button', text: 'Hapus cache rute',
          onclick: function () { Geo.clearCache(); toast('Cache rute dihapus.'); App.refresh(); }
        })
      ])
    ]);
    drawerBody.appendChild(liveWrap);

    /* Tampilan */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Tampilan' }),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'setTheme', text: 'Tema' }),
        (function () {
          var pref = Store.getPrefs().theme || 'auto';
          var sel = U.el('select', { class: 'select', id: 'setTheme' }, [
            U.el('option', { value: 'auto', text: 'Ikuti perangkat', selected: pref === 'auto' }),
            U.el('option', { value: 'light', text: 'Terang', selected: pref === 'light' }),
            U.el('option', { value: 'dark', text: 'Gelap', selected: pref === 'dark' })
          ]);
          sel.addEventListener('change', function () {
            Store.setPref('theme', sel.value);
            applyTheme(sel.value);
            App.refresh();
          });
          return sel;
        })()
      ])
    ]));

    /* Berkas — juga jalur satu-satunya di layar sempit, karena di sana
       rail berubah jadi bar bawah tanpa tombol ini. */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Kalender & berkas' }),
      U.el('button', {
        class: 'btn btn--block', type: 'button',
        onclick: function () { toggleDrawer(false); App.exportIcs(); }
      }, [U.icon('cal', 'ico--sm'), U.el('span', { text: 'Ekspor seluruh trip (.ics)' })]),
      U.el('button', {
        class: 'btn btn--block', type: 'button',
        onclick: function () { toggleDrawer(false); App.openDataPanel(); }
      }, [U.el('span', { text: 'Simpan / muat trip' })])
    ]));

    /* Berbahaya */
    drawerBody.appendChild(U.el('div', { class: 'fieldset' }, [
      U.el('h3', { class: 'fieldset__legend', text: 'Mulai ulang' }),
      U.el('button', {
        class: 'btn btn--danger btn--block', type: 'button', text: 'Kosongkan trip ini',
        onclick: function () { confirmReset(); }
      }),
      U.el('p', { class: 'field__hint', text: 'Menghapus semua hari dan tempat yang sudah disusun. Tidak bisa dibatalkan setelah halaman ditutup.' })
    ]));

    drawerBody.appendChild(U.el('p', {
      class: 'field__hint',
      text: 'Harga tiket adalah estimasi, disegarkan ' + RUTE_DATA.PRICE_SNAPSHOT +
            '. Semua angka bisa diubah sendiri di tab Biaya.'
    }));
  }

  function confirmSwitchDestination(nextId) {
    var next = RUTE_DATA.byId(nextId);
    var hasContent = Store.get().days.some(function (d) { return d.stops.length; });

    if (!hasContent) { doSwitch(nextId); return; }

    openModal('Ganti destinasi ke ' + next.name + '?', U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: 'Tempat yang sudah kamu susun berasal dari ' + Store.dest().name + ' dan tidak ada di ' + next.name + '. Mengganti destinasi akan mengosongkan itinerary yang sekarang.' }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button', text: 'Ganti dan mulai bersih',
          onclick: function () { closeModal(); doSwitch(nextId); }
        }),
        U.el('button', {
          class: 'btn', type: 'button', text: 'Batal',
          onclick: function () { closeModal(); renderSettings(); }
        })
      ])
    ]));
  }

  function doSwitch(destId) {
    var dest = RUTE_DATA.byId(destId);
    Store.update('ganti destinasi', function (t) {
      t.destId = destId;
      t.name = 'Liburan ' + dest.name;
      t.hub = { name: dest.hub.name, lat: dest.hub.lat, lng: dest.hub.lng };
      t.days = [Store.newDay(0, t.startDate)];
      t.activeDayId = t.days[0].id;
      Store.invalidatePlaces();
    });
    toast('Destinasi diganti ke ' + dest.name + '.');
    renderSettings();
  }

  function confirmReset() {
    openModal('Kosongkan trip?', U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: 'Semua hari, tempat, dan catatan akan dihapus. Kalau hanya ingin coba-coba, simpan dulu lewat Simpan / muat.' }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--danger', type: 'button', text: 'Ya, kosongkan',
          onclick: function () {
            closeModal();
            toggleDrawer(false);
            Store.reset();
            toast('Trip dikosongkan.');
          }
        }),
        U.el('button', { class: 'btn', type: 'button', text: 'Batal', onclick: closeModal })
      ])
    ]));
  }

  /* ---------- pembantu input ---------- */

  function input(id, value, onCommit, attrs) {
    var i = U.el('input', Object.assign({
      class: 'input', id: id, type: 'text', value: value === null || value === undefined ? '' : value,
      autocomplete: 'off'
    }, attrs || {}));
    i.addEventListener('input', function () { onCommit(i.value); });
    return i;
  }

  function numInput(id, value, onCommit, attrs) {
    var i = U.el('input', Object.assign({
      class: 'input', id: id, type: 'number', inputmode: 'decimal',
      value: value === null || value === undefined ? '' : value
    }, attrs || {}));
    i.addEventListener('change', function () { onCommit(parseFloat(i.value)); });
    return i;
  }

  /* ---------- rail: daftar hari ---------- */

  function renderRail(computed) {
    var trip = Store.get();
    var host = U.qs('#railDays');
    U.clear(host);

    trip.days.forEach(function (day, i) {
      var dc = computed.days[i];
      var active = day.id === trip.activeDayId;
      var sub = dc.stopCount
        ? dc.stopCount + ' tempat · ' + U.toHHMM(dc.startMin) + '–' + U.toHHMMDay(dc.endMin)
        : 'Belum ada tempat';

      var btn = U.el('button', {
        class: 'dayrow' + (active ? ' is-active' : ''),
        type: 'button',
        style: '--dayColor: var(--day-' + ((i % 7) + 1) + '); --dayInk: var(--day-' + ((i % 7) + 1) + '-ink)',
        'aria-current': active ? 'true' : null,
        onclick: function () { Store.setActiveDay(day.id); App.setView('plan'); }
      }, [
        U.el('span', { class: 'dayrow__swatch num', text: String(i + 1), 'aria-hidden': 'true' }),
        U.el('span', { class: 'dayrow__body' }, [
          U.el('span', { class: 'dayrow__name', text: day.title || U.fmtDateShort(day.date) || ('Hari ' + (i + 1)) }),
          U.el('span', { class: 'dayrow__sub', text: sub })
        ]),
        dc.worst ? U.el('span', {
          class: 'dayrow__flag', 'data-level': dc.worst,
          title: dc.worst === 'alert' ? 'Ada jadwal yang bentrok' : 'Ada yang perlu dicek'
        }) : null
      ]);

      host.appendChild(U.el('li', {}, [btn]));
    });
  }

  /* ---------- kepala trip ---------- */

  function renderTopbar(computed) {
    var trip = Store.get();
    var nameInput = U.qs('#tripName');
    if (document.activeElement !== nameInput) nameInput.value = trip.name;

    var dest = Store.dest();
    var bits = [dest.name];
    bits.push(trip.days.length + ' hari');
    if (trip.startDate) {
      bits.push(U.fmtDateShort(trip.startDate) + '–' +
        U.fmtDateShort(U.addDays(trip.startDate, trip.days.length - 1)));
    }
    bits.push(U.rupiah(computed.perPerson) + '/orang');
    U.qs('#tripMeta').textContent = bits.join(' · ');
  }

  function init() {
    toastHost = U.qs('#toasts');
    applyTheme(Store.getPrefs().theme || 'auto');
    initDrawer();

    U.qs('#btnTheme').addEventListener('click', function () {
      toggleTheme();
      App.refresh();
    });

    var nameInput = U.qs('#tripName');
    nameInput.addEventListener('input', function () {
      Store.update('ubah nama', function (t) { t.name = nameInput.value; }, { silent: true, noHistory: true });
    });
    nameInput.addEventListener('blur', function () {
      if (!nameInput.value.trim()) {
        Store.update('ubah nama', function (t) { t.name = 'Liburan ' + Store.dest().name; });
      }
    });
  }

  return {
    init: init, toast: toast, openModal: openModal, closeModal: closeModal,
    renderRail: renderRail, renderTopbar: renderTopbar, renderSettings: renderSettings,
    toggleDrawer: toggleDrawer, applyTheme: applyTheme, currentEffectiveTheme: currentEffectiveTheme,
    input: input, numInput: numInput
  };
})();
