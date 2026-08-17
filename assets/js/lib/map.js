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
    if (ready && map) setTimeout(function () { map.invalidateSize(); }, 60);
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

  function renderSchematic(model) {
    U.clear(container);
    container.style.position = 'relative';

    var pts = [];
    model.days.forEach(function (d) {
      d.points.forEach(function (p) { pts.push({ lat: p.place.lat, lng: p.place.lng }); });
    });
    if (model.hub) pts.push({ lat: model.hub.lat, lng: model.hub.lng });

    if (!pts.length) {
      container.appendChild(U.el('div', { class: 'schematic-empty' }, [
        U.el('p', { class: 'field__hint', text: 'Tambahkan tempat untuk melihat rutenya di peta.' })
      ]));
      return;
    }

    var W = container.clientWidth || 380;
    var H = container.clientHeight || 420;
    var pad = 34;
    var bb = Geo.bounds(pts, 0.14);

    /* Proyeksi equirectangular sederhana, dikoreksi lintang. */
    var latRange = bb.n - bb.s || 0.02;
    var lngRange = bb.e - bb.w || 0.02;
    var cosLat = Math.cos((bb.n + bb.s) / 2 * Math.PI / 180);
    var scale = Math.min((W - pad * 2) / (lngRange * cosLat), (H - pad * 2) / latRange);
    var offX = (W - lngRange * cosLat * scale) / 2;
    var offY = (H - latRange * scale) / 2;

    function X(lng) { return offX + (lng - bb.w) * cosLat * scale; }
    function Y(lat) { return offY + (bb.n - lat) * scale; }

    var NS = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'schematic');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Peta skematik rute perjalanan');

    /* Garis kisi tipis supaya tidak terasa melayang. */
    var grid = document.createElementNS(NS, 'g');
    grid.setAttribute('stroke', 'var(--viz-grid)');
    grid.setAttribute('stroke-width', '1');
    for (var gx = 0; gx <= 4; gx++) {
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', (W / 4) * gx); ln.setAttribute('y1', 0);
      ln.setAttribute('x2', (W / 4) * gx); ln.setAttribute('y2', H);
      grid.appendChild(ln);
    }
    for (var gy = 0; gy <= 4; gy++) {
      var lnh = document.createElementNS(NS, 'line');
      lnh.setAttribute('x1', 0); lnh.setAttribute('y1', (H / 4) * gy);
      lnh.setAttribute('x2', W); lnh.setAttribute('y2', (H / 4) * gy);
      grid.appendChild(lnh);
    }
    s.appendChild(grid);

    model.days.forEach(function (d) {
      var focused = model.focusIndex === null || model.focusIndex === d.index;
      var color = focused ? dayColor(d.index) : '#9aa8a4';

      d.legs.forEach(function (lg) {
        var line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', X(lg.from.lng)); line.setAttribute('y1', Y(lg.from.lat));
        line.setAttribute('x2', X(lg.to.lng)); line.setAttribute('y2', Y(lg.to.lat));
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', focused ? 2.5 : 1.4);
        line.setAttribute('stroke-opacity', focused ? 0.85 : 0.3);
        line.setAttribute('stroke-dasharray', '6 5');
        line.setAttribute('stroke-linecap', 'round');
        s.appendChild(line);
      });

      d.points.forEach(function (pt) {
        var g = document.createElementNS(NS, 'g');
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', X(pt.place.lng)); c.setAttribute('cy', Y(pt.place.lat));
        c.setAttribute('r', focused ? 12 : 8);
        c.setAttribute('fill', color);
        c.setAttribute('stroke', 'var(--bg)');
        c.setAttribute('stroke-width', '2');
        g.appendChild(c);

        if (focused) {
          var t = document.createElementNS(NS, 'text');
          t.setAttribute('x', X(pt.place.lng)); t.setAttribute('y', Y(pt.place.lat) + 4);
          t.setAttribute('text-anchor', 'middle');
          t.setAttribute('font-size', '11');
          t.setAttribute('font-weight', '700');
          t.setAttribute('fill', dayInk(d.index));
          t.setAttribute('font-family', 'system-ui, sans-serif');
          t.textContent = pt.order;
          g.appendChild(t);
        }

        var title = document.createElementNS(NS, 'title');
        title.textContent = 'Hari ' + (d.index + 1) + ' · ' + pt.order + '. ' + pt.place.name;
        g.appendChild(title);
        s.appendChild(g);
      });
    });

    if (model.hub) {
      var hb = document.createElementNS(NS, 'circle');
      hb.setAttribute('cx', X(model.hub.lng)); hb.setAttribute('cy', Y(model.hub.lat));
      hb.setAttribute('r', 6);
      hb.setAttribute('fill', 'var(--bg)');
      hb.setAttribute('stroke', 'var(--ink-muted)');
      hb.setAttribute('stroke-width', '2');
      var ht = document.createElementNS(NS, 'title');
      ht.textContent = 'Titik awal: ' + model.hub.name;
      hb.appendChild(ht);
      s.appendChild(hb);
    }

    container.appendChild(s);
    container.appendChild(U.el('div', { class: 'schematic__note' }, [
      U.icon('warn', 'ico--sm'),
      U.el('span', {
        text: 'Peta jalan tidak bisa dimuat, jadi ini tampilan skematik: posisi relatif dan urutan tetap benar, garisnya bukan rute jalan sebenarnya.'
      })
    ]));
  }

  function isFallback() { return !ready; }

  return { init: init, render: render, invalidate: invalidate, isFallback: isFallback, dayColor: dayColor };
})();
