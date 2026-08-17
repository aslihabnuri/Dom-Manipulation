/* ============================================================
   Rute — peta
   ------------------------------------------------------------
   Jalur utama: Leaflet + ubin OpenStreetMap.
   Jalur cadangan: peta skematik SVG yang digambar sendiri, tetap
   menunjukkan posisi relatif dan urutan rute walau tanpa
   internet. Aplikasi tidak pernah kehilangan visualisasinya.

   Warna hari memakai tangga ordinal (terang -> gelap), dan tiap
   penanda membawa NOMOR urutannya. Identitas hari tidak pernah
   bergantung pada warna saja.
   ============================================================ */

window.RMap = (function () {
  'use strict';

  var map = null;
  var layer = null;
  var ready = false;
  var failed = false;
  var container = null;
  var onSelect = null;
  var lastSignature = '';
  var tilesWarned = false;
  var lastModel = null;

  /* Teksnya berbeda tergantung kenapa kita memakai peta skematik:
     jaringan bermasalah, atau memang tidak ada akses jaringan sama
     sekali (halaman artifact). Jangan menyalahkan jaringan kalau
     bukan itu sebabnya. */
  var schematicNote = window.RUTE_ARTIFACT
    ? 'Peta skematik: posisi, jarak, dan urutan sesuai koordinat asli, tapi garisnya bukan bentuk jalan sebenarnya. Tiap ruas punya tautan "buka rute" ke Google Maps.'
    : 'Peta jalan tidak bisa dimuat, jadi ini tampilan skematik: posisi relatif dan urutan tetap benar, garisnya bukan rute jalan sebenarnya.';

  function showTileNotice() {
    if (!container || container.querySelector('.schematic__note')) return;
    var note = document.createElement('div');
    note.className = 'schematic__note';
    note.innerHTML = '<svg class="ico ico--sm" viewBox="0 0 20 20" aria-hidden="true">' +
      '<path d="M10 3.4 2.6 16.2h14.8L10 3.4ZM10 8.2v3.4M10 13.6v.05" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>Gambar peta tidak bisa diunduh (jaringan). Penanda dan urutan rute tetap akurat — ' +
      'hanya latar petanya yang kosong.</span>';
    container.appendChild(note);
  }

  function leafletAvailable() {
    /* Halaman artifact memblokir ubin peta dari host luar, jadi Leaflet
       hanya akan memberi kanvas kosong yang bisa digeser. Peta skematik
       yang digambar sendiri lebih berguna di sana. */
    if (window.RUTE_ARTIFACT) return false;
    return typeof window.L !== 'undefined' && !window.__leafletFailed;
  }

  function dayColor(i) {
    var css = getComputedStyle(document.documentElement);
    var v = css.getPropertyValue('--day-' + (((i) % 7) + 1)).trim();
    return v || '#026a5b';
  }

  function dayInk(i) {
    var css = getComputedStyle(document.documentElement);
    var v = css.getPropertyValue('--day-' + (((i) % 7) + 1) + '-ink').trim();
    return v || '#ffffff';
  }

  function init(node, selectHandler) {
    container = node;
    onSelect = selectHandler;

    if (!leafletAvailable()) { failed = true; return false; }

    try {
      map = L.map(node, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: false
      }).setView([-7.7956, 110.3695], 11);

      var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      /* Leaflet bisa termuat sementara ubin petanya tidak — hasilnya
         kanvas abu-abu tanpa penjelasan. Beberapa kegagalan berturut
         cukup untuk memberi tahu penggunanya. */
      var tileErrors = 0;
      tiles.on('tileerror', function () {
        if (++tileErrors === 6 && !tilesWarned) {
          tilesWarned = true;
          showTileNotice();
        }
      });
      tiles.on('tileload', function () { tileErrors = 0; });

      layer = L.layerGroup().addTo(map);
      ready = true;
      return true;
    } catch (e) {
      failed = true;
      return false;
    }
  }

  function invalidate() {
    if (ready && map) { setTimeout(function () { map.invalidateSize(); }, 60); return; }
    /* Skematik digambar untuk ukuran kontainer saat itu, jadi ia
       harus digambar ulang setelah panelnya berubah ukuran. */
    if (lastModel) setTimeout(function () { renderSchematic(lastModel); }, 60);
  }

  /**
   * @param {object} model
   *   days: [{ index, label, mode, points: [{place, order}], legs: [{from,to,geometry}] }]
   *   focusIndex: hari yang disorot, null = semua setara
   */
  function render(model) {
    var sig = JSON.stringify({
      f: model.focusIndex,
      d: model.days.map(function (d) {
        return d.index + ':' + d.points.map(function (p) { return p.place.id; }).join(',') +
               ':' + d.legs.map(function (l) { return l.geometry ? 'g' : '-'; }).join('');
      })
    }) + ':' + document.documentElement.getAttribute('data-theme');

    lastModel = model;

    if (ready) {
      renderLeaflet(model);
      lastSignature = sig;
      return;
    }
    if (sig !== lastSignature) {
      renderSchematic(model);
      lastSignature = sig;
    }
  }

  /* ---------- Leaflet ---------- */

  function renderLeaflet(model) {
    layer.clearLayers();

    /* `all` mengumpulkan titik untuk fitBounds. Saat satu hari
       disorot, hanya titik hari itu yang dipakai — kalau tidak,
       peta menjauh untuk memuat seluruh trip dan perhentian yang
       berdekatan (Keraton, Taman Sari, Malioboro) menumpuk jadi
       satu gumpalan yang tak terbaca. */
    var all = [];
    var focusPoints = [];

    model.days.forEach(function (d) {
      var focused = model.focusIndex === null || model.focusIndex === d.index;
      var color = focused ? dayColor(d.index) : null;
      var ink = dayInk(d.index);

      /* Garis rute: pakai geometri asli kalau ada, kalau tidak
         tarik garis lurus putus-putus supaya jelas itu perkiraan. */
      d.legs.forEach(function (lg) {
        var pts, dashed;
        if (lg.geometry && lg.geometry.length) {
          pts = lg.geometry.map(function (c) { return [c[1], c[0]]; });
          dashed = false;
        } else {
          pts = [[lg.from.lat, lg.from.lng], [lg.to.lat, lg.to.lng]];
          dashed = true;
        }
        L.polyline(pts, {
          color: focused ? color : '#9aa8a4',
          weight: focused ? 3.5 : 2,
          opacity: focused ? 0.9 : 0.35,
          dashArray: dashed ? '7 6' : null,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(layer);
      });

      d.points.forEach(function (pt) {
        var marker;

        if (focused) {
          marker = L.marker([pt.place.lat, pt.place.lng], {
            icon: L.divIcon({
              className: 'pinwrap',
              html: '<div class="pin" style="--pinColor:' + color + ';--pinInk:' + ink + '">' +
                    '<span>' + pt.order + '</span></div>',
              iconSize: [26, 26],
              iconAnchor: [13, 24],
              popupAnchor: [0, -22]
            }),
            zIndexOffset: 400,
            keyboard: true,
            alt: 'Hari ' + (d.index + 1) + ' perhentian ' + pt.order + ': ' + pt.place.name
          });
          focusPoints.push([pt.place.lat, pt.place.lng]);
        } else {
          /* Hari lain hadir sebagai titik kecil: cukup untuk tahu
             ada apa di sekitar, tidak cukup untuk berebut perhatian. */
          marker = L.circleMarker([pt.place.lat, pt.place.lng], {
            radius: 4.5, color: '#ffffff', weight: 1.5,
            fillColor: '#8a9793', fillOpacity: 0.75, opacity: 0.75
          });
        }

        marker.bindPopup(popupHtml(pt, d));
        marker.on('click', function () {
          if (onSelect) onSelect(pt.place.id, d.index);
        });
        marker.addTo(layer);
        all.push([pt.place.lat, pt.place.lng]);
      });
    });

    if (model.hub) {
      L.circleMarker([model.hub.lat, model.hub.lng], {
        radius: 6, color: '#505b58', weight: 2, fillColor: '#ffffff', fillOpacity: 1
      }).bindPopup('<b>Titik awal</b><br>' + escapeHtml(model.hub.name)).addTo(layer);
      all.push([model.hub.lat, model.hub.lng]);
      if (focusPoints.length) focusPoints.push([model.hub.lat, model.hub.lng]);
    }

    var fit = focusPoints.length ? focusPoints : all;
    if (fit.length === 1) {
      map.setView(fit[0], 14);
    } else if (fit.length > 1) {
      map.fitBounds(L.latLngBounds(fit).pad(0.18), { animate: false, maxZoom: 15 });
    }
  }

  function popupHtml(pt, d) {
    var p = pt.place;
    var bits = [
      '<b>' + escapeHtml(p.name) + '</b>',
      '<div style="color:#505b58;font-size:12px;margin-top:2px">Hari ' + (d.index + 1) +
        ' · perhentian ' + pt.order + ' · ' + escapeHtml(p.area) + '</div>'
    ];
    if (pt.arrive !== undefined) {
      bits.push('<div style="font-size:12px;margin-top:6px">' +
        U.toHHMM(pt.arrive) + '–' + U.toHHMM(pt.depart) + '</div>');
    }
    bits.push('<a href="' + Geo.mapsPlaceUrl(p) + '" target="_blank" rel="noopener" ' +
      'style="font-size:12px;display:inline-block;margin-top:6px">Buka di Google Maps</a>');
    return bits.join('');
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- peta skematik cadangan ---------- */

  /**
   * Peta skematik: proyeksi equirectangular terkoreksi lintang, jadi
   * posisi relatif dan perbandingan jaraknya benar. Yang tidak ada
   * hanya jalan dan nama tempat dari peta asli — karena itu ada
   * batang skala, supaya "seberapa jauh" tetap bisa dibaca.
   */
  function renderSchematic(model) {
    U.clear(container);
    container.style.position = 'relative';

    var focusPts = [];
    var allPts = [];
    model.days.forEach(function (d) {
      var focused = model.focusIndex === null || model.focusIndex === d.index;
      d.points.forEach(function (p) {
        allPts.push({ lat: p.place.lat, lng: p.place.lng });
        if (focused) focusPts.push({ lat: p.place.lat, lng: p.place.lng });
      });
    });
    if (model.hub) {
      allPts.push({ lat: model.hub.lat, lng: model.hub.lng });
      if (focusPts.length) focusPts.push({ lat: model.hub.lat, lng: model.hub.lng });
    }

    if (!allPts.length) {
      container.appendChild(U.el('div', { class: 'schematic-empty' }, [
        U.el('p', { class: 'field__hint', text: 'Tambahkan tempat untuk melihat rutenya di peta.' })
      ]));
      return;
    }

    /* Sama seperti Leaflet: satu hari disorot berarti bingkainya
       mengikuti hari itu saja, supaya perhentian yang berdekatan
       tidak menumpuk. */
    var frame = focusPts.length > 1 ? focusPts : allPts;

    var W = container.clientWidth || 380;
    var H = container.clientHeight || 420;
    var pad = 40;
    var bb = Geo.bounds(frame, 0.16);

    var latRange = bb.n - bb.s || 0.02;
    var lngRange = bb.e - bb.w || 0.02;
    var cosLat = Math.cos((bb.n + bb.s) / 2 * Math.PI / 180);
    var scale = Math.min((W - pad * 2) / (lngRange * cosLat), (H - pad * 2) / latRange);
    var offX = (W - lngRange * cosLat * scale) / 2;
    var offY = (H - latRange * scale) / 2;

    function X(lng) { return offX + (lng - bb.w) * cosLat * scale; }
    function Y(lat) { return offY + (bb.n - lat) * scale; }

    var NS = 'http://www.w3.org/2000/svg';
    function mk(tag, attrs) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      return n;
    }

    var s = mk('svg', {
      class: 'schematic', viewBox: '0 0 ' + W + ' ' + H,
      role: 'img',
      'aria-label': 'Peta skematik rute: ' + allPts.length + ' titik, posisi dan jarak relatif sesuai koordinat asli'
    });

    /* Kisi tipis memberi rasa ruang tanpa berpura-pura jadi jalan. */
    var grid = mk('g', { stroke: 'var(--viz-grid)', 'stroke-width': '1' });
    for (var gx = 1; gx < 5; gx++) grid.appendChild(mk('line', { x1: (W / 5) * gx, y1: 0, x2: (W / 5) * gx, y2: H }));
    for (var gy = 1; gy < 5; gy++) grid.appendChild(mk('line', { x1: 0, y1: (H / 5) * gy, x2: W, y2: (H / 5) * gy }));
    s.appendChild(grid);

    /* Ruas hari lain dulu, supaya hari aktif menimpanya. */
    model.days.forEach(function (d) {
      if (model.focusIndex !== null && model.focusIndex === d.index) return;
      d.legs.forEach(function (lg) {
        s.appendChild(mk('line', {
          x1: X(lg.from.lng), y1: Y(lg.from.lat), x2: X(lg.to.lng), y2: Y(lg.to.lat),
          stroke: '#9aa8a4', 'stroke-width': 1.4, 'stroke-opacity': 0.35,
          'stroke-dasharray': '5 5', 'stroke-linecap': 'round'
        }));
      });
      d.points.forEach(function (pt) {
        var c = mk('circle', {
          cx: X(pt.place.lng), cy: Y(pt.place.lat), r: 4.5,
          fill: '#8a9793', 'fill-opacity': 0.75, stroke: 'var(--bg)', 'stroke-width': 1.5
        });
        c.appendChild(titleFor('Hari ' + (d.index + 1) + ' · ' + pt.order + '. ' + pt.place.name));
        s.appendChild(c);
      });
    });

    function titleFor(text) {
      var t = mk('title', {});
      t.textContent = text;
      return t;
    }

    /* Penginapan digambar sebelum hari yang disorot: kalau ia berada
       tepat di atas sebuah perhentian, yang bernomor harus menang. */
    if (model.hub) {
      var hg = mk('g', {});
      hg.appendChild(mk('circle', {
        cx: X(model.hub.lng), cy: Y(model.hub.lat), r: 6,
        fill: 'var(--bg)', stroke: 'var(--ink-muted)', 'stroke-width': 2
      }));
      hg.appendChild(titleFor('Titik awal: ' + model.hub.name));
      s.appendChild(hg);
    }

    /* Hari yang disorot. */
    model.days.forEach(function (d) {
      var focused = model.focusIndex === null || model.focusIndex === d.index;
      if (!focused) return;
      var color = dayColor(d.index);
      var ink = dayInk(d.index);

      d.legs.forEach(function (lg) {
        s.appendChild(mk('line', {
          x1: X(lg.from.lng), y1: Y(lg.from.lat), x2: X(lg.to.lng), y2: Y(lg.to.lat),
          stroke: color, 'stroke-width': 2.5, 'stroke-opacity': 0.9,
          'stroke-dasharray': '6 5', 'stroke-linecap': 'round'
        }));
      });

      /* Nama tempat hanya ditulis saat satu hari disorot. Dalam mode
         "semua hari" ada puluhan titik dan labelnya akan saling
         menimpa — di sana nomor penanda dan legenda yang bekerja. */
      var showLabels = model.focusIndex !== null && d.points.length <= 8 && W >= 300;

      /* Perhentian di pusat kota bisa berjarak 200 m dan penandanya
         nyaris menumpuk, jadi labelnya harus digeser agar tidak saling
         menimpa. Dihitung dulu untuk semua titik, baru digambar. */
      var placed = d.points.map(function (pt) {
        var cx = X(pt.place.lng), cy = Y(pt.place.lat);
        return { pt: pt, cx: cx, cy: cy, tx: cx, ty: cy, moved: false, right: cx < W * 0.6, ly: cy + 4 };
      });

      spread(placed);
      placed.forEach(function (q) { q.right = q.cx < W * 0.6; q.ly = q.cy + 4; });

      if (showLabels) {
        ['right', 'left'].forEach(function (side) {
          var col = placed
            .filter(function (q) { return (side === 'right') === q.right; })
            .sort(function (a, b) { return a.ly - b.ly; });
          for (var i = 1; i < col.length; i++) {
            var gap = col[i].ly - col[i - 1].ly;
            if (gap < 14) col[i].ly = col[i - 1].ly + 14;
          }
          /* Kalau geseran mendorong label keluar kanvas, tarik semuanya
             ke atas secukupnya. */
          var last = col[col.length - 1];
          if (last && last.ly > H - 24) {
            var shift = last.ly - (H - 24);
            col.forEach(function (q) { q.ly -= shift; });
          }
        });
      }

      placed.forEach(function (q) {
        var pt = q.pt;
        var g = mk('g', { class: 'schematic__pt', tabindex: '0', role: 'button' });
        g.setAttribute('aria-label', 'Hari ' + (d.index + 1) + ', perhentian ' + pt.order + ': ' + pt.place.name);

        if (q.moved) {
          /* Penanda digeser dari titik aslinya; garis tipis dan titik
             kecil menandai posisi sebenarnya supaya tidak menyesatkan. */
          g.appendChild(mk('line', {
            x1: q.cx, y1: q.cy, x2: q.tx, y2: q.ty,
            stroke: 'var(--line-strong)', 'stroke-width': 1
          }));
          g.appendChild(mk('circle', {
            cx: q.tx, cy: q.ty, r: 1.8, fill: 'var(--ink-muted)'
          }));
        }

        if (showLabels && Math.abs(q.ly - (q.cy + 4)) > 3) {
          /* Label yang digeser butuh garis penghubung ke penandanya. */
          g.appendChild(mk('line', {
            x1: q.cx + (q.right ? 13 : -13), y1: q.cy,
            x2: q.cx + (q.right ? 16 : -16), y2: q.ly - 4,
            stroke: 'var(--line-strong)', 'stroke-width': 1
          }));
        }

        g.appendChild(mk('circle', {
          cx: q.cx, cy: q.cy, r: 12, fill: color, stroke: 'var(--bg)', 'stroke-width': 2
        }));

        var t = mk('text', {
          x: q.cx, y: q.cy + 4, 'text-anchor': 'middle', 'font-size': '11',
          'font-weight': '700', fill: ink, 'font-family': 'system-ui, sans-serif',
          'pointer-events': 'none'
        });
        t.textContent = pt.order;
        g.appendChild(t);

        if (showLabels) {
          var lbl = mk('text', {
            x: q.cx + (q.right ? 17 : -17), y: q.ly,
            'text-anchor': q.right ? 'start' : 'end',
            'font-size': '11', 'font-weight': '600', fill: 'var(--ink-2)',
            'font-family': 'system-ui, sans-serif',
            'paint-order': 'stroke', stroke: 'var(--bg)', 'stroke-width': '3.5',
            'stroke-linejoin': 'round', 'pointer-events': 'none'
          });
          lbl.textContent = shorten(pt.place.name, 20);
          g.appendChild(lbl);
        }

        g.appendChild(titleFor(pt.place.name + ' · ' + U.toHHMM(pt.arrive) + '–' + U.toHHMM(pt.depart)));
        g.addEventListener('click', function () { if (onSelect) onSelect(pt.place.id, d.index); });
        g.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (onSelect) onSelect(pt.place.id, d.index); }
        });
        s.appendChild(g);
      });
    });

    /* Batang skala — tanpa ini "jauh" cuma soal rasa. */
    var kmPerPx = 111.32 / scale;
    var target = Math.min(150, Math.max(70, W * 0.26));
    var rawKm = target * kmPerPx;
    var niceKm = niceRound(rawKm);
    var barPx = niceKm / kmPerPx;
    var bx = 14, by = 22;

    var bar = mk('g', {});
    bar.appendChild(mk('line', {
      x1: bx, y1: by, x2: bx + barPx, y2: by,
      stroke: 'var(--ink-2)', 'stroke-width': '2', 'stroke-linecap': 'butt'
    }));
    bar.appendChild(mk('line', { x1: bx, y1: by - 4, x2: bx, y2: by + 4, stroke: 'var(--ink-2)', 'stroke-width': '2' }));
    bar.appendChild(mk('line', { x1: bx + barPx, y1: by - 4, x2: bx + barPx, y2: by + 4, stroke: 'var(--ink-2)', 'stroke-width': '2' }));
    var st = mk('text', {
      x: bx, y: by + 16, 'font-size': '11', 'font-weight': '600',
      fill: 'var(--ink-2)', 'font-family': 'system-ui, sans-serif',
      'paint-order': 'stroke', stroke: 'var(--bg)', 'stroke-width': '3.5', 'stroke-linejoin': 'round'
    });
    st.textContent = (niceKm < 1 ? (niceKm * 1000) + ' m' : niceKm + ' km');
    bar.appendChild(st);
    s.appendChild(bar);

    container.appendChild(s);

    container.appendChild(U.el('div', { class: 'schematic__note' }, [
      U.icon('info', 'ico--sm'),
      U.el('span', {
        text: schematicNote
      })
    ]));
  }

  /**
   * Perhentian di pusat kota bisa berjarak 200 meter dan penandanya
   * saling menutupi sampai ada yang hilang sama sekali. Titik yang
   * bertumpuk disebar merata pada lingkaran kecil di sekitar pusat
   * gerombolannya; posisi aslinya tetap ditandai titik kecil.
   *
   * Deterministik: sudutnya diturunkan dari urutan, bukan diacak.
   */
  function spread(points) {
    var MIN = 24;
    var used = [];

    points.forEach(function (p) { p._c = -1; });

    points.forEach(function (p, i) {
      if (p._c >= 0) return;
      var cluster = [p];
      p._c = used.length;
      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        if (q._c >= 0) continue;
        var dx = q.tx - p.tx, dy = q.ty - p.ty;
        if (Math.sqrt(dx * dx + dy * dy) < MIN) { cluster.push(q); q._c = used.length; }
      }
      used.push(cluster);
    });

    used.forEach(function (cluster) {
      if (cluster.length < 2) return;
      var mx = 0, my = 0;
      cluster.forEach(function (q) { mx += q.tx; my += q.ty; });
      mx /= cluster.length; my /= cluster.length;

      var radius = Math.max(15, 4.2 * cluster.length + 9);
      cluster.forEach(function (q, k) {
        var angle = (Math.PI * 2 * k) / cluster.length - Math.PI / 2;
        q.cx = mx + Math.cos(angle) * radius;
        q.cy = my + Math.sin(angle) * radius;
        q.moved = true;
      });
    });

    points.forEach(function (p) { delete p._c; });
  }

  function niceRound(v) {
    var pow = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var n = v / pow;
    var step = n >= 5 ? 5 : (n >= 2 ? 2 : 1);
    return step * pow;
  }

  function shorten(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function isFallback() { return !ready; }

  return { init: init, render: render, invalidate: invalidate, isFallback: isFallback, dayColor: dayColor };
})();
