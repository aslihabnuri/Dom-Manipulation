/* ============================================================
   Rute — tampilan Jelajah (pustaka tempat & rekomendasi)
   ============================================================ */

window.ExploreView = (function () {
  'use strict';

  var host;
  var state = {
    q: '',
    cat: 'semua',
    interest: [],
    maxCost: 0,
    sort: 'rekomendasi',
    hideUsed: false
  };

  function render() {
    if (!host) host = U.qs('#view-explore');
    var trip = Store.get();
    var dest = Store.dest();
    var used = Store.usedPlaceIds();
    var scrollTop = host.parentNode ? host.parentNode.scrollTop : 0;

    U.clear(host);

    host.appendChild(U.el('div', { class: 'viewhead' }, [
      U.el('div', { class: 'viewhead__row' }, [
        U.el('h1', { class: 'viewhead__title', text: 'Jelajah ' + dest.name }),
        U.el('div', { class: 'chiprow' }, [
          U.el('button', {
            class: 'btn btn--sm', type: 'button',
            onclick: openCustomPlace
          }, [U.icon('plus', 'ico--sm'), U.el('span', { text: 'Tempat sendiri' })]),
          U.el('button', {
            class: 'btn btn--sm btn--primary', type: 'button',
            onclick: PlanView.openWizard
          }, [U.icon('wand', 'ico--sm'), U.el('span', { text: 'Susun otomatis' })])
        ])
      ]),
      U.el('p', { class: 'viewhead__sub', text: dest.blurb + ' Harga tiket adalah estimasi per orang, disegarkan ' + RUTE_DATA.PRICE_SNAPSHOT + '.' })
    ]));

    var results = filterPlaces(Store.allPlaces(), used);

    host.appendChild(filters(results.length, Store.allPlaces().length));

    if (!results.length) {
      host.appendChild(U.el('div', { class: 'empty' }, [
        U.el('h3', { class: 'empty__title', text: 'Tidak ada yang cocok' }),
        U.el('p', { class: 'empty__text', text: 'Coba longgarkan filternya — hapus kata kunci, naikkan batas biaya, atau pilih kategori "Semua".' }),
        U.el('div', { class: 'empty__actions' }, [
          U.el('button', {
            class: 'btn', type: 'button', text: 'Reset filter',
            onclick: function () {
              state = { q: '', cat: 'semua', interest: [], maxCost: 0, sort: 'rekomendasi', hideUsed: false };
              render();
            }
          })
        ])
      ]));
    } else {
      var list = U.el('div', { class: 'placelist' });
      results.forEach(function (p) { list.appendChild(placeRow(p, trip, used)); });
      host.appendChild(list);
    }

    if (host.parentNode) host.parentNode.scrollTop = scrollTop;
  }

  /* ---------- filter ---------- */

  function filterPlaces(places, used) {
    var q = U.deburr(state.q).trim();

    var out = places.filter(function (p) {
      if (state.hideUsed && used[p.id]) return false;
      if (state.cat !== 'semua' && p.cat !== state.cat) return false;
      if (state.maxCost > 0 && (p.cost || 0) > state.maxCost) return false;
      if (state.interest.length) {
        var hit = state.interest.some(function (t) { return (p.tags || []).indexOf(t) >= 0; });
        if (!hit) return false;
      }
      if (q) {
        var hay = U.deburr(p.name + ' ' + p.area + ' ' + p.why + ' ' + (p.tags || []).join(' '));
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });

    var anchor = Store.get().hub;
    var rf = Store.dest().roadFactor;

    if (state.sort === 'dekat') {
      out.sort(function (a, b) { return Geo.haversine(anchor, a) - Geo.haversine(anchor, b); });
    } else if (state.sort === 'murah') {
      out.sort(function (a, b) { return (a.cost || 0) - (b.cost || 0); });
    } else if (state.sort === 'cepat') {
      out.sort(function (a, b) { return a.dur - b.dur; });
    } else {
      out.sort(function (a, b) {
        return Planner.scorePlace(b, { interests: state.interest, maxPerPlace: state.maxCost }) -
               Planner.scorePlace(a, { interests: state.interest, maxPerPlace: state.maxCost });
      });
    }
    return out;
  }

  function filters(shown, total) {
    var search = U.el('input', {
      class: 'input', type: 'search', id: 'flQ', value: state.q,
      placeholder: 'Cari nama tempat, daerah, atau suasana…', autocomplete: 'off'
    });
    search.addEventListener('input', U.debounce(function () {
      state.q = search.value;
      render();
      var again = U.qs('#flQ');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    }, 220));

    var catSel = U.el('select', { class: 'select', id: 'flCat' },
      [U.el('option', { value: 'semua', text: 'Semua kategori', selected: state.cat === 'semua' })].concat(
        Object.keys(RUTE_DATA.CATEGORIES).map(function (k) {
          return U.el('option', { value: k, text: RUTE_DATA.CATEGORIES[k].label, selected: state.cat === k });
        })
      ));
    catSel.addEventListener('change', function () { state.cat = catSel.value; render(); });

    var sortSel = U.el('select', { class: 'select', id: 'flSort' }, [
      U.el('option', { value: 'rekomendasi', text: 'Paling direkomendasikan', selected: state.sort === 'rekomendasi' }),
      U.el('option', { value: 'dekat', text: 'Terdekat dari penginapan', selected: state.sort === 'dekat' }),
      U.el('option', { value: 'murah', text: 'Paling murah', selected: state.sort === 'murah' }),
      U.el('option', { value: 'cepat', text: 'Paling singkat', selected: state.sort === 'cepat' })
    ]);
    sortSel.addEventListener('change', function () { state.sort = sortSel.value; render(); });

    var costSel = U.el('select', { class: 'select', id: 'flCost' }, [
      U.el('option', { value: '0', text: 'Berapa pun', selected: state.maxCost === 0 }),
      U.el('option', { value: '1', text: 'Gratis saja', selected: state.maxCost === 1 }),
      U.el('option', { value: '25000', text: 'Maks Rp25.000', selected: state.maxCost === 25000 }),
      U.el('option', { value: '60000', text: 'Maks Rp60.000', selected: state.maxCost === 60000 }),
      U.el('option', { value: '150000', text: 'Maks Rp150.000', selected: state.maxCost === 150000 })
    ]);
    costSel.addEventListener('change', function () {
      state.maxCost = parseInt(costSel.value, 10);
      if (state.maxCost === 1) state.maxCost = 0.5;
      render();
    });

    var hide = U.el('input', { type: 'checkbox', id: 'flHide', checked: state.hideUsed });
    hide.addEventListener('change', function () { state.hideUsed = hide.checked; render(); });

    var chips = U.el('div', { class: 'chiprow' },
      RUTE_DATA.INTERESTS.map(function (it) {
        var on = state.interest.indexOf(it.id) >= 0;
        var b = U.el('button', { class: 'chip', type: 'button', 'aria-pressed': on ? 'true' : 'false', text: it.label });
        b.addEventListener('click', function () {
          var i = state.interest.indexOf(it.id);
          if (i >= 0) state.interest.splice(i, 1); else state.interest.push(it.id);
          render();
        });
        return b;
      }));

    return U.el('div', { class: 'filters' }, [
      U.el('div', { class: 'filters__row' }, [
        U.el('div', { class: 'field filters__search' }, [
          U.el('label', { class: 'field__label', for: 'flQ', text: 'Cari' }), search
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'flCat', text: 'Kategori' }), catSel
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'flCost', text: 'Tiket' }), costSel
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'flSort', text: 'Urutkan' }), sortSel
        ])
      ]),
      chips,
      U.el('div', { class: 'filters__row', style: 'justify-content: space-between; align-items: center' }, [
        U.el('label', { class: 'checkline', for: 'flHide' }, [
          hide, U.el('span', { class: 'field__hint', text: 'Sembunyikan yang sudah masuk itinerary' })
        ]),
        U.el('span', { class: 'filters__count num', text: shown + ' dari ' + total + ' tempat' })
      ])
    ]);
  }

  /* ---------- baris tempat ---------- */

  function placeRow(p, trip, used) {
    var isUsed = !!used[p.id];
    var distKm = Geo.haversine(trip.hub, p) * Store.dest().roadFactor;

    var daySel = U.el('select', { class: 'select', style: 'width:auto; min-width:96px', 'aria-label': 'Tambahkan ' + p.name + ' ke hari' },
      trip.days.map(function (d, i) {
        return U.el('option', { value: d.id, text: 'Hari ' + (i + 1), selected: d.id === trip.activeDayId });
      }));

    var addBtn = U.el('button', {
      class: 'btn btn--sm' + (isUsed ? '' : ' btn--primary'), type: 'button',
      onclick: function () {
        Store.addStop(daySel.value, p);
        var di = Store.dayIndex(daySel.value);
        Shell.toast(p.name + ' ditambahkan ke hari ' + (di + 1) + '.', {
          label: 'Lihat', run: function () { Store.setActiveDay(daySel.value); App.setView('plan'); }
        });
      }
    }, [U.icon('plus', 'ico--sm'), U.el('span', { text: isUsed ? 'Tambah lagi' : 'Tambah' })]);

    return U.el('div', { class: 'place' + (isUsed ? ' is-added' : '') }, [
      U.el('div', { class: 'place__main' }, [
        U.el('div', { class: 'place__title' }, [
          U.el('span', { class: 'place__name', text: p.name }),
          U.el('span', { class: 'place__area', text: p.area }),
          isUsed ? U.el('span', { class: 'badge badge--brand' }, [U.icon('check', 'ico--sm'), U.el('span', { text: 'sudah masuk' })]) : null,
          p.custom ? U.el('span', { class: 'badge', text: 'tempat sendiri' }) : null
        ]),
        p.why ? U.el('p', { class: 'place__why', text: p.why }) : null,
        U.el('div', { class: 'place__facts' }, [
          U.el('span', { class: 'fact num' }, [U.icon('money', 'ico--sm'), U.el('span', { text: p.cost > 0 ? U.rupiah(p.cost) + '/orang' : 'Gratis' })]),
          U.el('span', { class: 'fact num' }, [U.icon('clock', 'ico--sm'), U.el('span', { text: U.dur(p.dur) })]),
          U.el('span', { class: 'fact num' }, [U.icon('pin', 'ico--sm'), U.el('span', { text: '± ' + U.km(distKm) + ' dari penginapan' })]),
          p.open ? U.el('span', { class: 'fact', text: p.open + '–' + p.close }) : U.el('span', { class: 'fact', text: '24 jam' }),
          p.rating ? U.el('span', { class: 'fact num' }, [U.icon('star', 'ico--sm'), U.el('span', { text: p.rating.toFixed(1) })]) : null
        ].filter(Boolean))
      ]),
      U.el('div', { class: 'place__actions' }, [
        U.el('button', {
          class: 'btn btn--ghost btn--icon btn--sm', type: 'button',
          'aria-label': 'Detail ' + p.name, title: 'Detail',
          onclick: function () { openPlaceDetail(p); }
        }, [U.icon('info', 'ico--sm')]),
        daySel,
        addBtn
      ])
    ]);
  }

  function openPlaceDetail(p) {
    var trip = Store.get();
    var distKm = Geo.haversine(trip.hub, p) * Store.dest().roadFactor;
    var est = Geo.estimateLeg(trip.hub, p, Store.activeDay().mode, { roadFactor: Store.dest().roadFactor, ignoreTraffic: true });

    Shell.openModal(p.name, U.el('div', { class: 'detail' }, [
      p.why ? U.el('p', { class: 'detail__prose', text: p.why }) : null,
      U.el('div', { class: 'detail__facts' }, [
        detailFact('Tiket', p.cost > 0 ? U.rupiah(p.cost) + '/orang' : 'Gratis'),
        p.extra > 0 ? detailFact('Biaya lain', U.rupiah(p.extra)) : null,
        detailFact('Lama kunjungan', U.dur(p.dur)),
        detailFact('Jam buka', p.open ? p.open + '–' + p.close : '24 jam'),
        detailFact('Dari penginapan', U.km(distKm)),
        detailFact('Waktu tempuh', '± ' + U.dur(est.minutes))
      ].filter(Boolean)),
      p.costNote ? U.el('p', { class: 'field__hint', text: 'Catatan harga: ' + p.costNote }) : null,
      p.tip ? U.el('div', { class: 'detail__tip' }, [U.el('b', { text: 'Tips: ' }), U.el('span', { text: p.tip })]) : null,
      (p.tags || []).length ? U.el('div', { class: 'chiprow' },
        p.tags.map(function (t) { return U.el('span', { class: 'badge', text: t }); })) : null,
      U.el('div', { class: 'empty__actions' }, [
        U.el('a', {
          class: 'btn', href: Geo.mapsPlaceUrl(p), target: '_blank', rel: 'noopener'
        }, [U.icon('ext', 'ico--sm'), U.el('span', { text: 'Lihat di Google Maps' })]),
        U.el('button', {
          class: 'btn btn--primary', type: 'button',
          onclick: function () {
            Store.addStop(Store.get().activeDayId, p);
            Shell.closeModal();
            Shell.toast(p.name + ' ditambahkan.');
          }
        }, [U.icon('plus', 'ico--sm'), U.el('span', { text: 'Tambahkan ke hari aktif' })])
      ])
    ].filter(Boolean)));
  }

  function detailFact(k, v) {
    return U.el('div', { class: 'detail__fact' }, [
      U.el('span', { class: 'detail__k', text: k }),
      U.el('span', { class: 'detail__v', text: v })
    ]);
  }

  /* ---------- tempat buatan sendiri ---------- */

  function openCustomPlace() {
    var f = {};
    function field(id, label, attrs, hint) {
      var i = U.el('input', Object.assign({ class: 'input', id: id }, attrs || {}));
      f[id] = i;
      return U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: id, text: label }),
        i,
        hint ? U.el('p', { class: 'field__hint', text: hint }) : null
      ].filter(Boolean));
    }

    var catSel = U.el('select', { class: 'select', id: 'cpCat' },
      Object.keys(RUTE_DATA.CATEGORIES).map(function (k) {
        return U.el('option', { value: k, text: RUTE_DATA.CATEGORIES[k].label });
      }));

    var err = U.el('p', { class: 'field__hint', style: 'color: var(--alert-ink)', hidden: true });

    Shell.openModal('Tambah tempat sendiri', U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: 'Untuk penginapan, tempat makan, atau apa pun yang belum ada di daftar. Koordinatnya diambil dari Google Maps: klik kanan lokasinya, lalu klik deretan angka yang muncul untuk menyalin.' }),
      field('cpName', 'Nama tempat', { type: 'text', placeholder: 'Warung Bu Ageng', autocomplete: 'off' }),
      field('cpArea', 'Daerah', { type: 'text', placeholder: 'Tirtodipuran', autocomplete: 'off' }),
      U.el('div', { class: 'grid2' }, [
        field('cpLat', 'Lintang', { type: 'number', step: 'any', placeholder: '-7.8123' }),
        field('cpLng', 'Bujur', { type: 'number', step: 'any', placeholder: '110.3654' })
      ]),
      U.el('div', { class: 'grid2' }, [
        field('cpCost', 'Biaya per orang (Rp)', { type: 'number', min: '0', step: '5000', value: '0' }),
        field('cpDur', 'Lama kunjungan (menit)', { type: 'number', min: '5', step: '15', value: '60' })
      ]),
      U.el('div', { class: 'grid2' }, [
        field('cpOpen', 'Jam buka', { type: 'time', step: '300' }, 'Kosongkan kalau 24 jam'),
        field('cpClose', 'Jam tutup', { type: 'time', step: '300' })
      ]),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'cpCat', text: 'Kategori' }), catSel
      ]),
      err,
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button', text: 'Simpan tempat',
          onclick: function () {
            var name = f.cpName.value.trim();
            var lat = parseFloat(f.cpLat.value), lng = parseFloat(f.cpLng.value);
            if (!name) { fail('Nama tempat belum diisi.'); return; }
            if (isNaN(lat) || lat < -90 || lat > 90) { fail('Lintang harus angka antara -90 dan 90.'); return; }
            if (isNaN(lng) || lng < -180 || lng > 180) { fail('Bujur harus angka antara -180 dan 180.'); return; }

            var place = Store.addCustomPlace({
              name: name, area: f.cpArea.value.trim() || 'Tempat sendiri',
              lat: lat, lng: lng, cat: catSel.value,
              cost: parseInt(f.cpCost.value, 10) || 0,
              dur: parseInt(f.cpDur.value, 10) || 60,
              open: f.cpOpen.value || null, close: f.cpClose.value || null
            });
            Shell.closeModal();
            Shell.toast(place.name + ' ditambahkan ke daftar tempat.', {
              label: 'Masukkan ke hari aktif',
              run: function () { Store.addStop(Store.get().activeDayId, place); }
            });
            render();
          }
        }),
        U.el('button', { class: 'btn', type: 'button', text: 'Batal', onclick: Shell.closeModal })
      ])
    ]));

    function fail(msg) {
      err.textContent = msg;
      err.hidden = false;
    }
  }

  return { render: render, openCustomPlace: openCustomPlace };
})();
