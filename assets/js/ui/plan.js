/* ============================================================
   Rute — tampilan Rencana (timeline harian)
   ============================================================ */

window.PlanView = (function () {
  'use strict';

  var host;

  function render(computed) {
    if (!host) host = U.qs('#view-plan');
    var trip = Store.get();
    var day = Store.activeDay();
    var di = Store.dayIndex(day.id);
    var dc = computed.days[di];

    /* Pertahankan posisi gulir supaya edit kecil tidak melompat. */
    var scrollTop = host.parentNode ? host.parentNode.scrollTop : 0;
    U.clear(host);

    host.appendChild(dayStrip(trip, computed, di));
    host.appendChild(dayHeader(trip, day, di, dc, computed));

    if (!day.stops.length) {
      host.appendChild(emptyDay(trip, day));
    } else {
      dc.flags.forEach(function (f) { host.appendChild(flag(f)); });
      host.appendChild(timeline(trip, day, di, dc));
    }

    host.appendChild(suggestions(trip, day));

    if (host.parentNode) host.parentNode.scrollTop = scrollTop;
  }

  /* ---------- pemilih hari (hanya muncul saat rail menyempit) ----------
     Di layar lebar daftar hari ada di rail kiri. Di layar sempit rail
     berubah jadi bar bawah tanpa ruang untuk itu, jadi pemilih harinya
     pindah ke atas konten. */

  function dayStrip(trip, computed, activeIndex) {
    var strip = U.el('div', { class: 'daystrip', role: 'tablist', 'aria-label': 'Pilih hari' });

    trip.days.forEach(function (d, i) {
      var dc = computed.days[i];
      strip.appendChild(U.el('button', {
        class: 'daystrip__btn' + (i === activeIndex ? ' is-active' : ''),
        type: 'button', role: 'tab',
        'aria-selected': i === activeIndex ? 'true' : 'false',
        style: '--dayColor: var(--day-' + ((i % 7) + 1) + '); --dayInk: var(--day-' + ((i % 7) + 1) + '-ink)',
        onclick: function () { Store.setActiveDay(d.id); }
      }, [
        U.el('span', { class: 'daystrip__n num', text: String(i + 1), 'aria-hidden': 'true' }),
        U.el('span', { class: 'daystrip__lbl' }, [
          U.el('b', { text: d.title || U.fmtDateShort(d.date) || ('Hari ' + (i + 1)) }),
          U.el('span', { class: 'num', text: dc.stopCount ? dc.stopCount + ' tempat' : 'kosong' })
        ]),
        dc.worst ? U.el('i', { class: 'dayrow__flag', 'data-level': dc.worst }) : null
      ]));
    });

    strip.appendChild(U.el('button', {
      class: 'daystrip__add', type: 'button', 'aria-label': 'Tambah hari',
      onclick: function () {
        Store.addDay();
        Shell.toast('Hari ' + Store.get().days.length + ' ditambahkan.');
      }
    }, [U.icon('plus', 'ico--sm')]));

    return strip;
  }

  /* ---------- kepala hari ---------- */

  function dayHeader(trip, day, di, dc, computed) {
    var dayVars = '--dayColor: var(--day-' + ((di % 7) + 1) + '); --dayInk: var(--day-' + ((di % 7) + 1) + '-ink)';

    var titleInput = U.el('input', {
      class: 'topbar__title', style: 'font-size: var(--t-xl); font-weight: 640;',
      value: day.title || '', placeholder: 'Hari ' + (di + 1),
      'aria-label': 'Judul hari ke-' + (di + 1)
    });
    titleInput.addEventListener('input', function () {
      Store.update('ubah judul hari', function () { day.title = titleInput.value; }, { silent: true, noHistory: true });
    });
    titleInput.addEventListener('blur', function () { App.refresh(); });

    var head = U.el('div', { class: 'dayhead', style: dayVars }, [
      U.el('div', { class: 'dayhead__top' }, [
        U.el('span', { class: 'dayhead__badge num', text: String(di + 1), 'aria-hidden': 'true' }),
        U.el('div', { style: 'min-width:0; flex:1 1 220px' }, [
          titleInput,
          U.el('p', { class: 'dayhead__date', text: U.fmtDate(day.date, { year: true }) + (U.isWeekend(day.date) ? ' · akhir pekan, biasanya lebih ramai' : '') })
        ]),
        U.el('div', { class: 'chiprow' }, [
          day.stops.length >= 3 ? U.el('button', {
            class: 'btn btn--sm', type: 'button',
            title: 'Susun ulang urutan supaya jarak tempuhnya paling pendek',
            onclick: function () { optimise(day); }
          }, [U.icon('tidy', 'ico--sm'), U.el('span', { text: 'Rapikan urutan' })]) : null,
          U.el('button', {
            class: 'btn btn--sm btn--primary', type: 'button',
            onclick: function () { App.setView('explore'); }
          }, [U.icon('plus', 'ico--sm'), U.el('span', { text: 'Tambah tempat' })]),
          trip.days.length > 1 ? U.el('button', {
            class: 'btn btn--sm btn--danger btn--icon', type: 'button',
            'aria-label': 'Hapus hari ke-' + (di + 1), title: 'Hapus hari ini',
            onclick: function () { removeDay(day, di); }
          }, [U.icon('trash', 'ico--sm')]) : null
        ])
      ]),

      statStrip(dc, trip),
      dayControls(trip, day)
    ]);

    return head;
  }

  function statStrip(dc, trip) {
    if (!dc.stopCount) {
      return U.el('div', { class: 'daystats' }, [
        stat('Status', 'Kosong', null)
      ]);
    }
    var tone = dc.worst === 'alert' ? 'alert' : (dc.worst === 'warn' ? 'warn' : null);
    return U.el('div', { class: 'daystats' }, [
      stat('Selesai', U.toHHMMDay(dc.endMin), dc.endMin >= Schedule.LATE_END ? 'warn' : null),
      stat('Jarak tempuh', U.km(dc.travelKm), null),
      stat('Di jalan', U.dur(dc.travelMin), dc.travelMin > dc.visitMin ? 'warn' : null),
      stat('Di lokasi', U.dur(dc.visitMin), null),
      stat('Biaya hari ini', U.rupiah(dc.subtotal), null),
      dc.totalLegs ? stat('Sumber jarak',
        dc.liveLegs === dc.totalLegs ? 'Rute asli' :
        (dc.liveLegs ? dc.liveLegs + '/' + dc.totalLegs + ' rute asli' : 'Estimasi'),
        null) : null,
      tone && !dc.stopCount ? null : null
    ].filter(Boolean));
  }

  function stat(k, v, tone) {
    return U.el('div', { class: 'daystat' }, [
      U.el('span', { class: 'daystat__k', text: k }),
      U.el('span', { class: 'daystat__v num', 'data-tone': tone, text: v })
    ]);
  }

  function dayControls(trip, day) {
    var startEl = U.el('input', { class: 'input', type: 'time', id: 'dayStart', value: day.start, step: '300' });
    startEl.addEventListener('change', function () {
      Store.update('ubah jam berangkat', function () { day.start = startEl.value || '08:00'; });
    });

    var modeEl = U.el('select', { class: 'select', id: 'dayMode' },
      Geo.MODE_ORDER.map(function (m) {
        return U.el('option', { value: m, text: Geo.MODES[m].label, selected: day.mode === m });
      }));
    modeEl.addEventListener('change', function () {
      Store.update('ubah moda', function () { day.mode = modeEl.value; });
      if (trip.liveRouting) App.warmRoutes();
    });

    var fromHub = U.el('input', { type: 'checkbox', id: 'dayFromHub', checked: day.startFromHub });
    fromHub.addEventListener('change', function () {
      Store.update('ubah titik awal hari', function () { day.startFromHub = fromHub.checked; });
    });

    var toHub = U.el('input', { type: 'checkbox', id: 'dayToHub', checked: day.returnToHub });
    toHub.addEventListener('change', function () {
      Store.update('ubah pulang', function () { day.returnToHub = toHub.checked; });
    });

    return U.el('div', { class: 'daycontrols' }, [
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'dayStart', text: 'Berangkat jam' }), startEl
      ]),
      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'dayMode', text: 'Kendaraan' }), modeEl
      ]),
      U.el('div', { class: 'field', style: 'gap:6px' }, [
        U.el('span', { class: 'field__label', text: 'Titik jemput' }),
        U.el('label', { class: 'checkline', for: 'dayFromHub' }, [fromHub, U.el('span', { class: 'field__hint', text: 'Mulai dari penginapan' })]),
        U.el('label', { class: 'checkline', for: 'dayToHub' }, [toHub, U.el('span', { class: 'field__hint', text: 'Hitung perjalanan pulang' })])
      ])
    ]);
  }

  /* ---------- keadaan kosong ---------- */

  function emptyDay(trip, day) {
    return U.el('div', { class: 'empty' }, [
      U.el('h3', { class: 'empty__title', text: 'Hari ini masih kosong' }),
      U.el('p', {
        class: 'empty__text',
        text: 'Dua cara mengisinya: biarkan Rute menyusunkan rencana berdasarkan minatmu, atau pilih sendiri dari ' +
              Store.dest().places.length + ' tempat di ' + Store.dest().name + '.'
      }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button', onclick: openWizard
        }, [U.icon('wand', 'ico--sm'), U.el('span', { text: 'Susunkan itinerary untuk saya' })]),
        U.el('button', {
          class: 'btn', type: 'button', text: 'Pilih sendiri',
          onclick: function () { App.setView('explore'); }
        })
      ])
    ]);
  }

  /* ---------- timeline ---------- */

  function timeline(trip, day, di, dc) {
    var wrap = U.el('div', {
      class: 'timeline',
      style: '--dayColor: var(--day-' + ((di % 7) + 1) + '); --dayInk: var(--day-' + ((di % 7) + 1) + '-ink)'
    });

    var stopNo = 0;

    dc.items.forEach(function (it) {
      if (it.type === 'leg') { wrap.appendChild(legRow(it, trip)); return; }
      stopNo++;
      wrap.appendChild(stopRow(it, stopNo, trip, day, dc));
    });

    wrap.appendChild(U.el('div', { class: 'tl-end' }, [
      U.el('div', { class: 'tl-end__time num', text: U.toHHMM(dc.endMin) }),
      U.el('div', { class: 'tl-end__dot' }, [U.el('span')]),
      U.el('div', {
        class: 'tl-end__label',
        text: day.returnToHub ? 'Sampai kembali di ' + trip.hub.name : 'Selesai — total ' + U.dur(dc.totalMin)
      })
    ]));

    return wrap;
  }

  function legRow(leg, trip) {
    var mode = Geo.MODES[leg.mode];
    var body = U.el('div', { class: 'tl-leg__body' }, [
      U.el('span', { class: 'tl-leg__pill' }, [
        U.icon(mode.icon, 'ico--sm'),
        U.el('span', { text: U.dur(leg.minutes) })
      ]),
      U.el('span', { text: U.km(leg.km) }),
      leg.source === 'rute'
        ? U.el('span', { class: 'tl-leg__src', text: 'rute asli', title: 'Jarak dan durasi dari data jalan sebenarnya' })
        : U.el('span', { text: 'estimasi', title: 'Perkiraan dari jarak lurus dikali faktor jalan dan kecepatan rata-rata' }),
      leg.cost > 0 ? U.el('span', { text: '± ' + U.rupiah(leg.cost) }) : null,
      leg.far ? U.el('span', { class: 'badge badge--warn' }, [U.icon('warn', 'ico--sm'), U.el('span', { text: 'ruas panjang' })]) : null,
      U.el('a', {
        class: 'tl-leg__link', href: Geo.mapsDirUrl(leg.from, leg.to, leg.mode),
        target: '_blank', rel: 'noopener',
        text: 'buka rute'
      })
    ]);

    return U.el('div', { class: 'tl-leg' }, [
      U.el('div'),
      U.el('div', { class: 'tl-leg__spine' }),
      body
    ]);
  }

  function stopRow(it, no, trip, day, dc) {
    var p = it.place;
    var stop = it.stop;

    var tools = U.el('div', { class: 'tl-card__tools' }, [
      U.el('button', {
        class: 'btn btn--ghost btn--icon btn--sm', type: 'button',
        'aria-label': 'Naikkan ' + p.name, title: 'Naikkan urutan',
        disabled: it.index === 0,
        onclick: function () { Store.moveStop(day.id, stop.id, -1); }
      }, [U.icon('up', 'ico--sm')]),
      U.el('button', {
        class: 'btn btn--ghost btn--icon btn--sm', type: 'button',
        'aria-label': 'Turunkan ' + p.name, title: 'Turunkan urutan',
        disabled: it.index === day.stops.length - 1,
        onclick: function () { Store.moveStop(day.id, stop.id, 1); }
      }, [U.icon('down', 'ico--sm')]),
      U.el('button', {
        class: 'btn btn--ghost btn--icon btn--sm', type: 'button',
        'aria-label': 'Buka detail ' + p.name, title: 'Detail & pengaturan',
        onclick: function () { openStopDetail(it, day, trip); }
      }, [U.icon('info', 'ico--sm')]),
      U.el('button', {
        class: 'btn btn--ghost btn--icon btn--sm btn--danger', type: 'button',
        'aria-label': 'Hapus ' + p.name + ' dari hari ini', title: 'Hapus dari hari ini',
        onclick: function () { removeStop(day, stop, p); }
      }, [U.icon('trash', 'ico--sm')])
    ]);

    var facts = U.el('div', { class: 'tl-card__facts' }, [
      U.el('span', { class: 'fact' }, [U.icon('clock', 'ico--sm'), U.el('span', { text: U.dur(it.visit) })]),
      U.el('span', { class: 'fact' }, [
        U.icon('money', 'ico--sm'),
        U.el('span', { text: it.cost > 0 ? U.rupiah(it.cost) : 'Gratis' })
      ]),
      p.open ? U.el('span', { class: 'fact' }, [
        U.icon('info', 'ico--sm'), U.el('span', { text: 'Buka ' + p.open + '–' + p.close })
      ]) : U.el('span', { class: 'fact' }, [U.icon('info', 'ico--sm'), U.el('span', { text: '24 jam' })]),
      U.el('a', {
        class: 'fact', href: Geo.mapsPlaceUrl(p), target: '_blank', rel: 'noopener',
        style: 'color: var(--brand-ink)'
      }, [U.icon('pin', 'ico--sm'), U.el('span', { text: 'Peta' })])
    ]);

    var card = U.el('div', { class: 'tl-card', id: 'stop-' + stop.id }, [
      U.el('div', { class: 'tl-card__head' }, [
        U.el('div', { class: 'tl-card__body' }, [
          U.el('div', { class: 'tl-card__name', text: p.name }),
          U.el('div', { class: 'tl-card__where', text: p.area + ' · ' + (RUTE_DATA.CATEGORIES[p.cat] || {}).label })
        ]),
        tools
      ]),
      facts,
      stop.note ? U.el('div', { class: 'tl-card__note', text: stop.note }) : null
    ]);

    it.flags.forEach(function (f) { card.appendChild(flag(f)); });

    return U.el('div', { class: 'tl-stop' }, [
      U.el('div', { class: 'tl-time' }, [
        U.el('span', { class: 'tl-time__in num', text: U.toHHMM(it.arrive) }),
        U.el('span', { class: 'tl-time__out num', text: 'sampai ' + U.toHHMM(it.depart) })
      ]),
      U.el('div', { class: 'tl-spine' }, [
        U.el('span', { class: 'tl-node num', text: String(no), 'aria-hidden': 'true' })
      ]),
      card
    ]);
  }

  function flag(f) {
    return U.el('div', { class: 'flagline', 'data-level': f.level === 'info' ? 'info' : f.level }, [
      U.icon(f.level === 'alert' ? 'warn' : (f.level === 'warn' ? 'warn' : 'info'), 'ico--sm'),
      U.el('span', { text: f.text })
    ]);
  }

  /* ---------- detail perhentian ---------- */

  function openStopDetail(it, day, trip) {
    var p = it.place;
    var stop = it.stop;

    var durInput = U.el('input', {
      class: 'input', type: 'number', min: '5', step: '15', id: 'stopDur',
      value: it.visit
    });
    durInput.addEventListener('change', function () {
      var v = Math.max(5, parseInt(durInput.value, 10) || p.dur);
      Store.update('ubah durasi', function () { stop.dur = v; });
    });

    var costInput = U.el('input', {
      class: 'input', type: 'number', min: '0', step: '5000', id: 'stopCost',
      value: it.perPerson
    });
    costInput.addEventListener('change', function () {
      var v = Math.max(0, parseInt(costInput.value, 10) || 0);
      Store.update('ubah biaya', function () { stop.cost = v; });
    });

    var noteInput = U.el('textarea', {
      class: 'textarea', id: 'stopNote', placeholder: 'Misal: booking atas nama Budi, jam 09.00',
      value: stop.note || ''
    });
    noteInput.addEventListener('input', function () {
      Store.update('ubah catatan', function () { stop.note = noteInput.value; }, { silent: true, noHistory: true });
    });

    var moveSel = U.el('select', { class: 'select', id: 'stopMove' },
      [U.el('option', { value: '', text: 'Pindahkan ke hari lain…' })].concat(
        trip.days.map(function (d, i) {
          return d.id === day.id ? null : U.el('option', { value: d.id, text: 'Hari ' + (i + 1) + (d.title ? ' — ' + d.title : '') });
        }).filter(Boolean)
      ));
    moveSel.addEventListener('change', function () {
      if (!moveSel.value) return;
      Store.moveStopToDay(day.id, stop.id, moveSel.value);
      Shell.closeModal();
      Shell.toast(p.name + ' dipindahkan.');
    });

    var ev = {
      date: day.date, start: it.arrive, end: it.depart, place: p, stop: stop, cost: it.cost,
      dayTitle: day.title || 'Hari ' + (Store.dayIndex(day.id) + 1)
    };
    var gcal = day.date ? Cal.googleUrl(ev, trip) : null;

    Shell.openModal(p.name, U.el('div', { class: 'detail' }, [
      p.why ? U.el('p', { class: 'detail__prose', text: p.why }) : null,

      U.el('div', { class: 'detail__facts' }, [
        fact('Terjadwal', U.toHHMM(it.arrive) + '–' + U.toHHMM(it.depart)),
        fact('Jam buka', p.open ? p.open + '–' + p.close : '24 jam'),
        fact('Total biaya', it.cost > 0 ? U.rupiah(it.cost) : 'Gratis'),
        p.rating ? fact('Rating', p.rating.toFixed(1)) : null
      ].filter(Boolean)),

      p.tip ? U.el('div', { class: 'detail__tip' }, [
        U.el('b', { text: 'Tips: ' }), U.el('span', { text: p.tip })
      ]) : null,

      U.el('div', { class: 'grid2' }, [
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'stopDur', text: 'Lama kunjungan (menit)' }),
          durInput,
          U.el('p', { class: 'field__hint', text: 'Bawaan: ' + p.dur + ' menit' })
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'stopCost', text: 'Tiket per orang (Rp)' }),
          costInput,
          U.el('p', { class: 'field__hint', text: p.costNote || ('Bawaan: ' + U.rupiah(p.cost)) })
        ])
      ]),

      p.extra > 0 ? U.el('p', { class: 'field__hint', text: 'Ditambah ' + U.rupiah(p.extra) + ' biaya rombongan (parkir dan sejenisnya).' }) : null,

      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'stopNote', text: 'Catatan' }),
        noteInput
      ]),

      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'stopMove', text: 'Pindahkan' }),
        moveSel
      ]),

      U.el('div', { class: 'empty__actions' }, [
        gcal ? U.el('a', {
          class: 'btn', href: gcal, target: '_blank', rel: 'noopener'
        }, [U.icon('cal', 'ico--sm'), U.el('span', { text: 'Tambah ke Google Calendar' })]) : null,
        U.el('a', {
          class: 'btn', href: Geo.mapsPlaceUrl(p), target: '_blank', rel: 'noopener'
        }, [U.icon('ext', 'ico--sm'), U.el('span', { text: 'Buka di Maps' })])
      ].filter(Boolean)),

      !day.date ? U.el('p', { class: 'field__hint', text: 'Isi tanggal trip di Pengaturan supaya bisa dikirim ke kalender.' }) : null
    ].filter(Boolean)));
  }

  function fact(k, v) {
    return U.el('div', { class: 'detail__fact' }, [
      U.el('span', { class: 'detail__k', text: k }),
      U.el('span', { class: 'detail__v', text: v })
    ]);
  }

  /* ---------- rekomendasi di bawah timeline ---------- */

  function suggestions(trip, day) {
    var list = Planner.suggestFor(day, trip, 4);
    if (!list.length) return U.el('div');

    var wrap = U.el('section', { class: 'panel', style: 'margin-top: var(--s-8)' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: day.stops.length ? 'Dekat dari rute hari ini' : 'Populer di ' + Store.dest().name }),
        U.el('span', { class: 'panel__sub', text: day.stops.length ? 'Diurut dari yang paling sedikit menambah perjalanan' : 'Rating tertinggi' })
      ])
    ]);

    var ul = U.el('div', { class: 'placelist' });
    list.forEach(function (s) {
      var p = s.place;
      ul.appendChild(U.el('div', { class: 'place' }, [
        U.el('div', { class: 'place__main' }, [
          U.el('div', { class: 'place__title' }, [
            U.el('span', { class: 'place__name', text: p.name }),
            U.el('span', { class: 'place__area', text: p.area })
          ]),
          U.el('p', { class: 'place__why', text: p.why }),
          U.el('div', { class: 'place__facts' }, [
            U.el('span', { class: 'fact num', text: '± ' + U.km(s.dist * Store.dest().roadFactor) + ' dari rute' }),
            U.el('span', { class: 'fact num', text: U.dur(p.dur) }),
            U.el('span', { class: 'fact num', text: p.cost > 0 ? U.rupiah(p.cost) + '/orang' : 'Gratis' })
          ])
        ]),
        U.el('div', { class: 'place__actions' }, [
          U.el('button', {
            class: 'btn btn--sm', type: 'button',
            onclick: function () {
              Store.addStop(day.id, p);
              Shell.toast(p.name + ' ditambahkan ke hari ' + (Store.dayIndex(day.id) + 1) + '.', {
                label: 'Urungkan', run: function () { Store.undo(); }
              });
            }
          }, [U.icon('plus', 'ico--sm'), U.el('span', { text: 'Tambah' })])
        ])
      ]));
    });

    wrap.appendChild(ul);
    return wrap;
  }

  /* ---------- aksi ---------- */

  function removeStop(day, stop, place) {
    Store.removeStop(day.id, stop.id);
    Shell.toast(place.name + ' dihapus.', { label: 'Urungkan', run: function () { Store.undo(); } });
  }

  function removeDay(day, di) {
    if (!day.stops.length) {
      Store.removeDay(day.id);
      Shell.toast('Hari ' + (di + 1) + ' dihapus.', { label: 'Urungkan', run: function () { Store.undo(); } });
      return;
    }
    Shell.openModal('Hapus hari ' + (di + 1) + '?', U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: day.stops.length + ' tempat di hari ini akan ikut terhapus, dan tanggal hari-hari berikutnya akan maju.' }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--danger', type: 'button', text: 'Hapus hari ini',
          onclick: function () {
            Shell.closeModal();
            Store.removeDay(day.id);
            Shell.toast('Hari ' + (di + 1) + ' dihapus.', { label: 'Urungkan', run: function () { Store.undo(); } });
          }
        }),
        U.el('button', { class: 'btn', type: 'button', text: 'Batal', onclick: Shell.closeModal })
      ])
    ]));
  }

  function optimise(day) {
    var trip = Store.get();
    var before = Schedule.computeDay(day, { trip: trip, dest: Store.dest() });
    var next = Planner.optimiseDay(day, trip);
    if (!next) { Shell.toast('Perlu minimal tiga tempat untuk dirapikan.'); return; }

    Store.update('rapikan urutan', function () { day.stops = next; });

    var after = Schedule.computeDay(day, { trip: trip, dest: Store.dest() });
    var saved = before.travelKm - after.travelKm;
    var savedMin = before.travelMin - after.travelMin;

    if (saved > 0.4 || savedMin > 4) {
      Shell.toast('Urutan dirapikan — hemat ' + U.km(saved) + ' dan ' + U.dur(savedMin) + '.',
        { label: 'Urungkan', run: function () { Store.undo(); } });
    } else if (saved < -0.4) {
      Store.undo();
      Shell.toast('Urutan yang sekarang sudah lebih pendek. Tidak ada yang diubah.');
    } else {
      Shell.toast('Urutannya sudah efisien.', { label: 'Urungkan', run: function () { Store.undo(); } });
    }
  }

  /* ---------- wizard susun otomatis ---------- */

  var wizardState = {
    days: 3, interests: ['ikonik', 'budaya', 'alam'], pace: 'sedang',
    mode: 'motor', start: '08:00', budget: 0
  };

  function openWizard() {
    var trip = Store.get();
    wizardState.days = trip.days.length;
    wizardState.budget = trip.budget;

    var chipRow = U.el('div', { class: 'chiprow' },
      RUTE_DATA.INTERESTS.map(function (it) {
        var on = wizardState.interests.indexOf(it.id) >= 0;
        var b = U.el('button', {
          class: 'chip', type: 'button', 'aria-pressed': on ? 'true' : 'false', text: it.label
        });
        b.addEventListener('click', function () {
          var i = wizardState.interests.indexOf(it.id);
          if (i >= 0) wizardState.interests.splice(i, 1);
          else wizardState.interests.push(it.id);
          b.setAttribute('aria-pressed', wizardState.interests.indexOf(it.id) >= 0 ? 'true' : 'false');
        });
        return b;
      }));

    var daysEl = U.el('input', { class: 'input', type: 'number', min: '1', max: '14', id: 'wzDays', value: wizardState.days });
    var paceEl = U.el('select', { class: 'select', id: 'wzPace' },
      Object.keys(Planner.PACE).map(function (k) {
        return U.el('option', { value: k, text: Planner.PACE[k].label + ' — ' + Planner.PACE[k].note, selected: k === wizardState.pace });
      }));
    var modeEl = U.el('select', { class: 'select', id: 'wzMode' },
      Geo.MODE_ORDER.map(function (m) {
        return U.el('option', { value: m, text: Geo.MODES[m].label, selected: m === wizardState.mode });
      }));
    var startEl = U.el('input', { class: 'input', type: 'time', id: 'wzStart', value: wizardState.start, step: '300' });
    var budgetEl = U.el('input', { class: 'input', type: 'number', min: '0', step: '100000', id: 'wzBudget', value: wizardState.budget || '' });

    Shell.openModal('Susunkan itinerary ' + Store.dest().name, U.el('div', { class: 'detail' }, [
      U.el('p', { class: 'detail__prose', text: 'Rute akan memilih tempat yang cocok, mengelompokkannya per wilayah supaya tidak bolak-balik, lalu mengurutkannya jadi rute terpendek.' }),

      U.el('div', { class: 'field' }, [
        U.el('span', { class: 'field__label', text: 'Yang kamu cari' }),
        chipRow
      ]),

      U.el('div', { class: 'grid2' }, [
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'wzDays', text: 'Berapa hari' }), daysEl
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'wzStart', text: 'Berangkat jam' }), startEl
        ])
      ]),

      U.el('div', { class: 'field' }, [
        U.el('label', { class: 'field__label', for: 'wzPace', text: 'Tempo' }), paceEl
      ]),

      U.el('div', { class: 'grid2' }, [
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'wzMode', text: 'Kendaraan' }), modeEl
        ]),
        U.el('div', { class: 'field' }, [
          U.el('label', { class: 'field__label', for: 'wzBudget', text: 'Anggaran/orang (opsional)' }), budgetEl
        ])
      ]),

      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button',
          onclick: function () {
            wizardState.days = U.clamp(parseInt(daysEl.value, 10) || 3, 1, 14);
            wizardState.pace = paceEl.value;
            wizardState.mode = modeEl.value;
            wizardState.start = startEl.value || '08:00';
            wizardState.budget = parseInt(budgetEl.value, 10) || 0;
            Shell.closeModal();
            runWizard();
          }
        }, [U.icon('wand', 'ico--sm'), U.el('span', { text: 'Susun sekarang' })]),
        U.el('button', { class: 'btn', type: 'button', text: 'Batal', onclick: Shell.closeModal })
      ]),

      U.el('p', { class: 'field__hint', text: 'Ini mengganti seluruh isi itinerary yang sekarang. Kamu bisa urungkan setelahnya.' })
    ]));
  }

  function runWizard() {
    var trip = Store.get();
    var result = Planner.generate({
      destId: trip.destId,
      days: wizardState.days,
      interests: wizardState.interests,
      pace: wizardState.pace,
      mode: wizardState.mode,
      budgetPerPerson: wizardState.budget,
      startTime: wizardState.start,
      hub: trip.hub
    });

    if (!result.days.length) { Shell.toast('Tidak ada tempat yang cocok. Coba pilih minat lain.'); return; }

    Store.update('susun otomatis', function (t) {
      t.budget = wizardState.budget;
      t.days = result.days.map(function (g, i) {
        var d = Store.newDay(i, t.startDate);
        d.start = wizardState.start;
        d.mode = wizardState.mode;
        d.stops = g.stops.map(function (p) { return Store.newStop(p); });
        return d;
      });
      t.activeDayId = t.days[0].id;
    });

    var count = result.used.length;
    Shell.toast('Tersusun: ' + count + ' tempat dalam ' + result.days.length + ' hari.',
      { label: 'Urungkan', run: function () { Store.undo(); } });

    if (trip.liveRouting) App.warmRoutes();
  }

  return { render: render, openWizard: openWizard };
})();
