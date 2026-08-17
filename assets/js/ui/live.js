/* ============================================================
   Rute — tampilan Hari Ini (pengatur waktu di lapangan)
   ------------------------------------------------------------
   Dipakai saat sedang jalan, bukan saat merencanakan. Ia menjawab
   tiga pertanyaan: sekarang harusnya di mana, berapa lama lagi
   harus berangkat, dan kalau sudah telat, jadwal sisanya jadi
   seperti apa.
   ============================================================ */

window.LiveView = (function () {
  'use strict';

  var host;
  var timer = null;

  function nowMinutes() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  /** Hari yang tanggalnya hari ini; kalau tidak ada, hari aktif. */
  function pickDay(trip) {
    var today = U.isoToday();
    for (var i = 0; i < trip.days.length; i++) {
      if (trip.days[i].date === today) return { day: trip.days[i], index: i, isToday: true };
    }
    var d = Store.activeDay();
    return { day: d, index: Store.dayIndex(d.id), isToday: false };
  }

  function render(computed) {
    if (!host) host = U.qs('#view-live');
    var trip = Store.get();
    var sel = pickDay(trip);
    var dc = computed.days[sel.index];
    var now = nowMinutes();

    U.clear(host);

    host.appendChild(U.el('div', { class: 'viewhead' }, [
      U.el('div', { class: 'viewhead__row' }, [
        U.el('h1', { class: 'viewhead__title', text: sel.isToday ? 'Hari ini' : 'Pratinjau hari ' + (sel.index + 1) })
      ]),
      U.el('p', {
        class: 'viewhead__sub',
        text: sel.isToday
          ? U.fmtDate(sel.day.date, { year: true }) + ' · sekarang ' + U.toHHMM(now)
          : 'Tidak ada hari yang tanggalnya hari ini, jadi yang ditampilkan adalah hari ' + (sel.index + 1) +
            '. Atur tanggal trip di Pengaturan supaya mode ini aktif otomatis saat kamu berangkat.'
      })
    ]));

    if (!dc.stopCount) {
      host.appendChild(U.el('div', { class: 'empty' }, [
        U.el('h3', { class: 'empty__title', text: 'Tidak ada agenda' }),
        U.el('p', { class: 'empty__text', text: 'Hari ini belum ada tempat yang dijadwalkan.' }),
        U.el('div', { class: 'empty__actions' }, [
          U.el('button', { class: 'btn btn--primary', type: 'button', text: 'Susun hari ini', onclick: function () { App.setView('plan'); } })
        ])
      ]));
      return;
    }

    var state = analyse(dc, now, sel.isToday);

    host.appendChild(nowCard(state, dc, sel, trip));
    host.appendChild(driftBar(state, sel, dc));
    host.appendChild(agenda(dc, state, sel));
    host.appendChild(calendarStrip(trip, computed));
  }

  /* ---------- di mana kita sekarang ---------- */

  function analyse(dc, now, isToday) {
    var stops = dc.items.filter(function (it) { return it.type === 'stop'; });
    var legs = dc.items.filter(function (it) { return it.type === 'leg'; });

    if (!isToday) {
      return { phase: 'preview', current: null, next: stops[0] || null, stops: stops, now: now };
    }

    if (now < dc.startMin) {
      return {
        phase: 'before', current: null, next: stops[0] || null, stops: stops, now: now,
        untilStart: dc.startMin - now
      };
    }
    if (now >= dc.endMin) {
      return { phase: 'after', current: null, next: null, stops: stops, now: now };
    }

    for (var i = 0; i < stops.length; i++) {
      var s = stops[i];
      if (now >= s.arrive && now < s.depart) {
        return {
          phase: 'at', current: s, next: stops[i + 1] || null, stops: stops, now: now,
          leftHere: s.depart - now,
          progress: (now - s.arrive) / Math.max(1, s.depart - s.arrive)
        };
      }
      if (now < s.arrive) {
        var prev = stops[i - 1] || null;
        return {
          phase: 'moving', current: null, next: s, prev: prev, stops: stops, now: now,
          untilArrive: s.arrive - now
        };
      }
    }
    return { phase: 'after', current: null, next: null, stops: stops, now: now };
  }

  /* ---------- kartu utama ---------- */

  function nowCard(state, dc, sel, trip) {
    var k, title, meta, progress = null;

    if (state.phase === 'preview') {
      k = 'Mulai hari ini';
      title = state.next ? state.next.place.name : '—';
      meta = 'Berangkat ' + U.toHHMM(dc.startMin) + ' · selesai ' + U.toHHMM(dc.endMin);
    } else if (state.phase === 'before') {
      k = 'Belum berangkat';
      title = state.next ? state.next.place.name : '—';
      meta = 'Berangkat ' + U.dur(state.untilStart) + ' lagi, jam ' + U.toHHMM(dc.startMin);
    } else if (state.phase === 'at') {
      k = 'Sekarang di';
      title = state.current.place.name;
      meta = 'Sisa ' + U.dur(state.leftHere) + ' di sini · lanjut jam ' + U.toHHMM(state.current.depart);
      progress = state.progress;
    } else if (state.phase === 'moving') {
      k = 'Sedang di jalan menuju';
      title = state.next.place.name;
      meta = 'Perkiraan sampai ' + U.toHHMM(state.next.arrive) + ' · ' + U.dur(state.untilArrive) + ' lagi';
    } else {
      k = 'Agenda selesai';
      title = 'Hari ini beres';
      meta = dc.stopCount + ' tempat · ' + U.km(dc.travelKm) + ' · ' + U.rupiah(dc.subtotal);
    }

    var card = U.el('section', { class: 'nowcard' }, [
      U.el('p', { class: 'nowcard__k', text: k }),
      U.el('h2', { class: 'nowcard__title', text: title }),
      U.el('p', { class: 'nowcard__meta num', text: meta })
    ]);

    if (progress !== null) {
      card.appendChild(U.el('div', { class: 'nowcard__bar', role: 'presentation' }, [
        U.el('div', { class: 'nowcard__fill', style: '--p:' + U.clamp(progress, 0, 1) })
      ]));
    }

    var actions = U.el('div', { class: 'nowcard__row' });

    if (state.next) {
      actions.appendChild(U.el('a', {
        class: 'btn btn--sm',
        href: Geo.mapsDirUrl(
          state.current ? state.current.place : (state.prev ? state.prev.place : trip.hub),
          state.next.place,
          sel.day.mode
        ),
        target: '_blank', rel: 'noopener'
      }, [U.icon('route', 'ico--sm'), U.el('span', { text: 'Navigasi ke ' + shortName(state.next.place.name) })]));
    }

    if (state.phase === 'at' || state.phase === 'moving' || state.phase === 'before') {
      actions.appendChild(U.el('button', {
        class: 'btn btn--sm', type: 'button', text: 'Saya telat 15 menit',
        onclick: function () { shift(sel.day, 15); }
      }));
      actions.appendChild(U.el('button', {
        class: 'btn btn--sm', type: 'button', text: 'Telat 30 menit',
        onclick: function () { shift(sel.day, 30); }
      }));
    }

    if (actions.childNodes.length) card.appendChild(actions);
    return card;
  }

  function shortName(n) { return n.length > 22 ? n.slice(0, 21) + '…' : n; }

  /* ---------- selisih terhadap rencana ---------- */

  function driftBar(state, sel, dc) {
    if (state.phase === 'preview' || state.phase === 'after') {
      return U.el('div', { class: 'driftbar' }, [
        U.icon('info', 'ico--sm'),
        U.el('span', {
          text: state.phase === 'after'
            ? 'Semua agenda hari ini sudah lewat.'
            : 'Pratinjau — pengatur waktu aktif otomatis pada tanggal hari itu.'
        })
      ]);
    }

    var target, label;
    if (state.phase === 'at') { target = state.current.arrive; label = 'tiba di ' + shortName(state.current.place.name); }
    else if (state.phase === 'moving') { target = state.prev ? state.prev.depart : dc.startMin; label = 'meninggalkan titik sebelumnya'; }
    else { target = dc.startMin; label = 'berangkat'; }

    var drift = state.now - target;
    var tone = drift > 10 ? 'late' : (drift < -10 ? 'early' : null);
    var text = Math.abs(drift) <= 10
      ? 'Sesuai jadwal'
      : (drift > 0 ? 'Telat ' + U.dur(drift) : 'Lebih cepat ' + U.dur(-drift));

    var bar = U.el('div', { class: 'driftbar' }, [
      U.icon(tone === 'late' ? 'warn' : 'check', 'ico--sm'),
      U.el('span', { class: 'driftbar__v', 'data-tone': tone, text: text }),
      U.el('span', { class: 'field__hint', text: 'dibanding rencana ' + label + ' jam ' + U.toHHMM(target) })
    ]);

    if (Math.abs(drift) > 10) {
      bar.appendChild(U.el('button', {
        class: 'btn btn--sm', type: 'button',
        text: drift > 0 ? 'Geser sisa hari +' + Math.round(drift) + ' mnt' : 'Majukan ' + Math.round(-drift) + ' mnt',
        onclick: function () { shift(sel.day, drift); }
      }));
    }

    return bar;
  }

  function shift(day, minutes) {
    var cur = U.toMin(day.start);
    var next = U.clamp(cur + Math.round(minutes), 0, 23 * 60 + 55);
    Store.update('geser jadwal', function () { day.start = U.toHHMM(next); });
    Shell.toast('Jam berangkat digeser ke ' + U.toHHMM(next) + '. Sisa jadwal ikut menyesuaikan.',
      { label: 'Urungkan', run: function () { Store.undo(); } });
  }

  /* ---------- daftar agenda ---------- */

  function agenda(dc, state, sel) {
    var list = U.el('div', { class: 'upnext' });

    dc.items.forEach(function (it) {
      if (it.type !== 'stop') return;
      var isNow = state.current === it;
      var isDone = state.now >= it.depart && (state.phase !== 'preview');

      var right = isNow ? U.el('span', { class: 'badge badge--brand', text: 'sekarang' })
        : isDone ? U.el('span', { class: 'badge', text: 'lewat' })
        : U.el('span', { class: 'badge num', text: it.cost > 0 ? U.rupiah(it.cost) : 'Gratis' });

      list.appendChild(U.el('div', {
        class: 'upnext__row' + (isNow ? ' is-now' : '') + (isDone && !isNow ? ' is-done' : '')
      }, [
        U.el('span', { class: 'upnext__t num', text: U.toHHMM(it.arrive) }),
        U.el('span', { class: 'upnext__n' }, [
          U.el('span', { text: it.place.name }),
          it.flags.length ? U.el('span', {
            style: 'color: var(--warn-ink); font-size: var(--t-xs); display:block',
            text: it.flags[0].text
          }) : null
        ].filter(Boolean)),
        right
      ]));
    });

    return U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: 'Agenda hari ' + (sel.index + 1) }),
        U.el('span', { class: 'panel__sub num', text: U.toHHMM(dc.startMin) + '–' + U.toHHMM(dc.endMin) + ' · ' + U.km(dc.travelKm) })
      ]),
      list
    ]);
  }

  /* ---------- ekspor kalender ---------- */

  function calendarStrip(trip, computed) {
    var hasDates = trip.days.some(function (d) { return !!d.date; });

    return U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: 'Bawa ke kalender' }),
        U.el('span', { class: 'panel__sub', text: 'Tanpa login, tanpa izin apa pun' })
      ]),
      U.el('p', { class: 'detail__prose', text: 'Unduh satu berkas .ics berisi seluruh trip, lalu impor sekali jalan ke Google Calendar lewat Setelan → Impor & ekspor. Tiap acara sudah membawa lokasi, perkiraan biaya, dan pengingat 30 menit sebelumnya.' }),
      U.el('div', { class: 'empty__actions' }, [
        U.el('button', {
          class: 'btn btn--primary', type: 'button', disabled: !hasDates,
          onclick: App.exportIcs
        }, [U.icon('cal', 'ico--sm'), U.el('span', { text: 'Unduh seluruh trip (.ics)' })]),
        U.el('a', {
          class: 'btn', href: 'https://calendar.google.com/calendar/u/0/r/settings/export',
          target: '_blank', rel: 'noopener'
        }, [U.icon('ext', 'ico--sm'), U.el('span', { text: 'Buka halaman impor Google' })])
      ]),
      !hasDates ? U.el('p', { class: 'field__hint', text: 'Isi tanggal hari pertama di Pengaturan supaya acaranya punya waktu.' }) : null
    ].filter(Boolean));
  }

  /* ---------- detak jam ---------- */

  function startTicking(onTick) {
    stopTicking();
    timer = setInterval(onTick, 30000);
  }

  function stopTicking() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  return { render: render, startTicking: startTicking, stopTicking: stopTicking };
})();
