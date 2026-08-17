/* ============================================================
   Rute — tampilan Biaya
   ------------------------------------------------------------
   Angka apa pun di sini bisa diubah. Harga tiket berubah terus,
   jadi aplikasi tidak boleh berpura-pura tahu harga pasti —
   ia memberi titik awal yang masuk akal lalu menyerahkan
   kendalinya.
   ============================================================ */

window.BudgetView = (function () {
  'use strict';

  var host;

  function render(computed) {
    if (!host) host = U.qs('#view-budget');
    var trip = Store.get();
    var scrollTop = host.parentNode ? host.parentNode.scrollTop : 0;
    U.clear(host);

    host.appendChild(U.el('div', { class: 'viewhead' }, [
      U.el('div', { class: 'viewhead__row' }, [
        U.el('h1', { class: 'viewhead__title', text: 'Biaya perjalanan' })
      ]),
      U.el('p', {
        class: 'viewhead__sub',
        text: 'Semua angka adalah estimasi awal (harga tiket disegarkan ' + RUTE_DATA.PRICE_SNAPSHOT +
              ') dan bisa kamu ubah langsung di tabel di bawah.'
      })
    ]));

    if (!computed.stops) {
      host.appendChild(U.el('div', { class: 'empty' }, [
        U.el('h3', { class: 'empty__title', text: 'Belum ada yang dihitung' }),
        U.el('p', { class: 'empty__text', text: 'Tambahkan tempat ke itinerary dulu — biayanya akan terkumpul sendiri di sini, dipecah per kategori dan per hari.' }),
        U.el('div', { class: 'empty__actions' }, [
          U.el('button', { class: 'btn btn--primary', type: 'button', text: 'Ke Jelajah', onclick: function () { App.setView('explore'); } })
        ])
      ]));
      return;
    }

    host.appendChild(summary(trip, computed));
    host.appendChild(byCategory(computed));
    host.appendChild(byDay(trip, computed));
    host.appendChild(perStop(trip, computed));

    if (host.parentNode) host.parentNode.scrollTop = scrollTop;
  }

  /* ---------- ringkasan ---------- */

  function summary(trip, c) {
    var people = Math.max(1, trip.people);
    var target = trip.budget > 0 ? trip.budget * people : 0;
    var diff = target > 0 ? target - c.grand : 0;

    var panel = U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'total' }, [
        U.el('span', { class: 'total__v num', text: U.rupiah(c.grand) }),
        U.el('span', { class: 'total__k', text: 'total untuk ' + people + ' orang · ' + U.rupiah(c.perPerson) + ' per orang' })
      ])
    ]);

    var facts = U.el('div', { class: 'daystats' }, [
      fact('Hari', trip.days.length + ' hari, ' + c.nights + ' malam'),
      fact('Tempat', c.stops + ' perhentian'),
      fact('Jarak total', U.km(c.travelKm)),
      fact('Waktu di jalan', U.dur(c.travelMin)),
      fact('Rata-rata per hari', U.rupiah(c.grand / trip.days.length))
    ]);
    panel.appendChild(facts);

    if (target > 0) {
      var over = diff < 0;
      panel.appendChild(U.el('div', {
        class: 'flagline', 'data-level': over ? 'alert' : 'ok',
        style: 'margin-top: var(--s-4)'
      }, [
        U.icon(over ? 'warn' : 'check', 'ico--sm'),
        U.el('span', {
          text: over
            ? 'Lewat ' + U.rupiah(-diff) + ' dari target ' + U.rupiah(target) + '. Yang paling besar: ' + biggest(c) + '.'
            : 'Masih ada sisa ' + U.rupiah(diff) + ' dari target ' + U.rupiah(target) + '.'
        })
      ]));
    }

    panel.appendChild(U.el('div', { class: 'empty__actions', style: 'margin-top: var(--s-4)' }, [
      U.el('button', {
        class: 'btn btn--sm', type: 'button', text: 'Atur jumlah orang & anggaran',
        onclick: function () { Shell.toggleDrawer(true); }
      })
    ]));

    return panel;
  }

  function biggest(c) {
    var best = null, bv = -1;
    Object.keys(c.cost).forEach(function (k) {
      if (c.cost[k] > bv) { bv = c.cost[k]; best = k; }
    });
    return (Schedule.COST_LABELS[best] || best).toLowerCase();
  }

  function fact(k, v) {
    return U.el('div', { class: 'daystat' }, [
      U.el('span', { class: 'daystat__k', text: k }),
      U.el('span', { class: 'daystat__v num', text: v })
    ]);
  }

  /* ---------- per kategori ---------- */

  function byCategory(c) {
    var rows = Object.keys(c.cost).map(function (k) {
      return { label: Schedule.COST_LABELS[k] || k, value: c.cost[k] };
    });

    return U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: 'Ke mana uangnya pergi' }),
        U.el('span', { class: 'panel__sub', text: 'Seluruh trip, ' + Store.get().people + ' orang' })
      ]),
      Charts.ranked(rows, { emptyText: 'Belum ada biaya tercatat.' }),
      U.el('div', { style: 'margin-top: var(--s-5)' }, [
        Charts.timeSplit(c.travelMin, c.visitMin)
      ])
    ]);
  }

  /* ---------- per hari ---------- */

  function byDay(trip, c) {
    var rows = c.days.map(function (d, i) {
      return {
        label: 'Hari ' + (i + 1) + (d.day.title ? ' · ' + d.day.title : ''),
        value: d.subtotal
      };
    });

    return U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: 'Biaya per hari' }),
        U.el('span', { class: 'panel__sub', text: 'Belum termasuk penginapan' })
      ]),
      Charts.byDay(rows)
    ]);
  }

  /* ---------- tabel per perhentian ---------- */

  function perStop(trip, c) {
    var tbody = U.el('tbody');
    var people = Math.max(1, trip.people);

    c.days.forEach(function (dc, di) {
      if (!dc.stopCount) return;

      tbody.appendChild(U.el('tr', {}, [
        U.el('td', { colspan: '5', style: 'background: var(--surface); font-weight: 650; font-size: var(--t-xs)' }, [
          U.el('span', { text: 'Hari ' + (di + 1) + (dc.day.title ? ' — ' + dc.day.title : '') + ' · ' + U.fmtDateShort(dc.day.date) })
        ])
      ]));

      dc.items.forEach(function (it) {
        if (it.type !== 'stop') return;
        var p = it.place;

        var input = U.el('input', {
          class: 'cellinput num', type: 'number', min: '0', step: '5000',
          value: it.perPerson,
          'aria-label': 'Tiket per orang untuk ' + p.name
        });
        input.addEventListener('change', function () {
          var v = Math.max(0, parseInt(input.value, 10) || 0);
          Store.update('ubah biaya', function () { it.stop.cost = v; });
        });

        tbody.appendChild(U.el('tr', {}, [
          U.el('td', {}, [
            U.el('div', { text: p.name }),
            p.costNote ? U.el('div', { style: 'font-size: var(--t-2xs); color: var(--ink-muted)', text: p.costNote }) : null
          ].filter(Boolean)),
          U.el('td', { class: 'n' }, [input]),
          U.el('td', { class: 'n num', text: it.group > 0 ? U.rupiah(it.group) : '—' }),
          U.el('td', { class: 'n num', text: String(people) }),
          U.el('td', { class: 'n num', text: U.rupiah(it.cost) })
        ]));
      });

      if (dc.cost.transport > 0) {
        tbody.appendChild(U.el('tr', {}, [
          U.el('td', {}, [U.el('span', { style: 'color: var(--ink-muted)', text: 'Transport hari ' + (di + 1) + ' (' + U.km(dc.travelKm) + ')' })]),
          U.el('td', { class: 'n num', text: '—' }),
          U.el('td', { class: 'n num', text: U.rupiah(dc.cost.transport) }),
          U.el('td', { class: 'n num', text: '—' }),
          U.el('td', { class: 'n num', text: U.rupiah(dc.cost.transport) })
        ]));
      }
    });

    if (c.cost.penginapan > 0) {
      tbody.appendChild(U.el('tr', {}, [
        U.el('td', {}, [U.el('span', { text: 'Penginapan · ' + c.nights + ' malam' })]),
        U.el('td', { class: 'n num', text: '—' }),
        U.el('td', { class: 'n num', text: U.rupiah(trip.lodging) + '/malam' }),
        U.el('td', { class: 'n num', text: '—' }),
        U.el('td', { class: 'n num', text: U.rupiah(c.cost.penginapan) })
      ]));
    }

    return U.el('section', { class: 'panel' }, [
      U.el('div', { class: 'panel__head' }, [
        U.el('h2', { class: 'panel__title', text: 'Rincian per tempat' }),
        U.el('span', { class: 'panel__sub', text: 'Klik angka tiket untuk mengubahnya' })
      ]),
      U.el('div', { class: 'tablewrap' }, [
        U.el('table', { class: 'costtable' }, [
          U.el('thead', {}, [
            U.el('tr', {}, [
              U.el('th', { scope: 'col', text: 'Tempat' }),
              U.el('th', { scope: 'col', class: 'n', text: 'Tiket/orang' }),
              U.el('th', { scope: 'col', class: 'n', text: 'Biaya rombongan' }),
              U.el('th', { scope: 'col', class: 'n', text: 'Orang' }),
              U.el('th', { scope: 'col', class: 'n', text: 'Subtotal' })
            ])
          ]),
          tbody,
          U.el('tfoot', {}, [
            U.el('tr', {}, [
              U.el('td', { text: 'Total' }),
              U.el('td', { class: 'n' }),
              U.el('td', { class: 'n' }),
              U.el('td', { class: 'n' }),
              U.el('td', { class: 'n num', text: U.rupiah(c.grand) })
            ])
          ])
        ])
      ])
    ]);
  }

  return { render: render };
})();
