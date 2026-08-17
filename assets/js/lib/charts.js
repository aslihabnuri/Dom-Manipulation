/* ============================================================
   Rute — grafik biaya
   ------------------------------------------------------------
   Pekerjaan datanya adalah membandingkan besaran antar kategori
   dan antar hari. Itu tugas batang, bukan donat: satu warna,
   panjang batang yang membawa arti, dan angka tertulis di
   sebelahnya sehingga warna tidak pernah jadi satu-satunya
   kanal informasi.
   ============================================================ */

window.Charts = (function () {
  'use strict';

  /**
   * Batang horizontal berperingkat.
   * @param {Array<{label:string, value:number, hint?:string}>} rows
   */
  function ranked(rows, opts) {
    opts = opts || {};
    var visible = rows.filter(function (r) { return r.value > 0; })
      .sort(function (a, b) { return b.value - a.value; });

    if (!visible.length) {
      return U.el('p', { class: 'field__hint', text: opts.emptyText || 'Belum ada biaya tercatat.' });
    }

    var max = visible[0].value;
    var wrap = U.el('div', { class: 'barchart', role: 'list' });

    visible.forEach(function (r, i) {
      var pct = max > 0 ? Math.max(2, (r.value / max) * 100) : 0;
      wrap.appendChild(U.el('div', {
        class: 'barrow', role: 'listitem',
        'aria-label': r.label + ': ' + U.rupiah(r.value)
      }, [
        U.el('span', { class: 'barrow__k', text: r.label }),
        U.el('div', { class: 'barrow__track' }, [
          U.el('div', {
            class: 'barrow__fill',
            style: 'width:' + pct + '%; animation-delay:' + (i * 38) + 'ms'
          })
        ]),
        U.el('span', { class: 'barrow__v num', text: opts.short ? U.rupiahShort(r.value) : U.rupiah(r.value) })
      ]));
    });

    return wrap;
  }

  /**
   * Batang per hari — sumbu kategori tetap urut hari (bukan
   * diurut nilai), karena urutan hari itu sendiri informasi.
   */
  function byDay(days, opts) {
    opts = opts || {};
    var max = 0;
    days.forEach(function (d) { max = Math.max(max, d.value); });

    if (max <= 0) {
      return U.el('p', { class: 'field__hint', text: 'Belum ada biaya untuk dibandingkan antar hari.' });
    }

    var wrap = U.el('div', { class: 'barchart', role: 'list' });
    days.forEach(function (d, i) {
      var pct = Math.max(d.value > 0 ? 2 : 0, (d.value / max) * 100);
      wrap.appendChild(U.el('div', {
        class: 'barrow', role: 'listitem',
        'aria-label': d.label + ': ' + U.rupiah(d.value)
      }, [
        U.el('span', { class: 'barrow__k', text: d.label }),
        U.el('div', { class: 'barrow__track' }, [
          U.el('div', {
            class: 'barrow__fill',
            style: 'width:' + pct + '%; animation-delay:' + (i * 38) + 'ms'
          })
        ]),
        U.el('span', { class: 'barrow__v num', text: U.rupiahShort(d.value) })
      ]));
    });
    return wrap;
  }

  /**
   * Perbandingan waktu di jalan vs waktu di lokasi, sebagai satu
   * batang dua segmen dengan celah 2px agar batasnya terbaca.
   */
  function timeSplit(travelMin, visitMin) {
    var total = travelMin + visitMin;
    if (total <= 0) return U.el('p', { class: 'field__hint', text: 'Belum ada kegiatan terjadwal.' });

    var pctTravel = (travelMin / total) * 100;

    var bar = U.el('div', {
      class: 'splitbar',
      role: 'img',
      'aria-label': 'Di jalan ' + U.dur(travelMin) + ', di lokasi ' + U.dur(visitMin)
    }, [
      U.el('span', { class: 'splitbar__a', style: 'width:' + pctTravel + '%' }),
      U.el('span', { class: 'splitbar__b' })
    ]);

    return U.el('div', { class: 'split' }, [
      bar,
      U.el('div', { class: 'split__keys' }, [
        U.el('span', { class: 'split__key' }, [
          U.el('i', { class: 'split__sw split__sw--a' }),
          U.el('span', { text: 'Di jalan ' }),
          U.el('b', { class: 'num', text: U.dur(travelMin) })
        ]),
        U.el('span', { class: 'split__key' }, [
          U.el('i', { class: 'split__sw split__sw--b' }),
          U.el('span', { text: 'Di lokasi ' }),
          U.el('b', { class: 'num', text: U.dur(visitMin) })
        ])
      ])
    ]);
  }

  return { ranked: ranked, byDay: byDay, timeSplit: timeSplit };
})();
