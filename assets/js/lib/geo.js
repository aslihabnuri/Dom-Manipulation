/* ============================================================
   Rute — jarak & waktu tempuh
   ------------------------------------------------------------
   Dua sumber angka:

   1. ESTIMASI (selalu tersedia, tanpa internet)
      Jarak garis lurus (haversine) dikali faktor jalan per
      destinasi, lalu dibagi kecepatan rata-rata moda, ditambah
      overhead parkir/berangkat dan pengali jam sibuk.

   2. RUTE NYATA (opsional, butuh internet)
      OSRM publik memberi jarak dan durasi mengemudi sebenarnya.
      Hasilnya di-cache di localStorage supaya tidak diminta
      berulang. Kalau gagal, otomatis kembali ke estimasi.

   Setiap angka membawa `source` supaya UI bisa jujur menandai
   mana yang perkiraan dan mana yang hasil rute asli.
   ============================================================ */

window.Geo = (function () {
  'use strict';

  var R = 6371; /* radius bumi, km */

  var MODES = {
    motor: {
      id: 'motor', label: 'Motor', icon: 'bike',
      speed: 33,        /* km/jam rata-rata termasuk lampu merah */
      overhead: 6,      /* menit: parkir, helm, keluar-masuk */
      osrm: 'driving',
      osrmFactor: 0.86  /* motor lolos macet lebih baik dari mobil */
    },
    mobil: {
      id: 'mobil', label: 'Mobil', icon: 'car',
      speed: 30, overhead: 10, osrm: 'driving', osrmFactor: 1
    },
    ojol: {
      id: 'ojol', label: 'Ojek online', icon: 'bike',
      speed: 32, overhead: 9, osrm: 'driving', osrmFactor: 0.9
    },
    taksi: {
      id: 'taksi', label: 'Taksi / mobil sewa', icon: 'car',
      speed: 29, overhead: 8, osrm: 'driving', osrmFactor: 1
    },
    jalan: {
      id: 'jalan', label: 'Jalan kaki', icon: 'walk',
      speed: 4.6, overhead: 2, osrm: 'foot', osrmFactor: 1
    }
  };

  var MODE_ORDER = ['motor', 'mobil', 'ojol', 'taksi', 'jalan'];

  /* Ongkos transport per km, kasar tapi berguna untuk anggaran. */
  var FUEL_PER_KM = { motor: 700, mobil: 1600, ojol: 2800, taksi: 4500, jalan: 0 };

  function toRad(d) { return d * Math.PI / 180; }

  /* Ongkos bensin adalah perkiraan; menampilkannya sampai rupiah
     terakhir memberi kesan presisi yang tidak dimiliki angkanya. */
  function round500(v) { return Math.round(v / 500) * 500; }

  /** Jarak garis lurus dalam km. */
  function haversine(a, b) {
    var dLat = toRad(b.lat - a.lat);
    var dLng = toRad(b.lng - a.lng);
    var la1 = toRad(a.lat), la2 = toRad(b.lat);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  /**
   * Pengali jam sibuk. Jogja/Bandung/Bali padat pada jam berangkat
   * kerja dan jam pulang; di luar itu jalanan relatif lancar.
   */
  function trafficFactor(departMin) {
    if (departMin === null || departMin === undefined) return 1;
    var m = ((departMin % 1440) + 1440) % 1440;
    if (m >= 420 && m < 540) return 1.28;   /* 07:00-09:00 */
    if (m >= 960 && m < 1110) return 1.32;  /* 16:00-18:30 */
    if (m >= 660 && m < 780) return 1.12;   /* 11:00-13:00 */
    if (m >= 1320 || m < 300) return 0.86;  /* 22:00-05:00 lengang */
    return 1;
  }

  /**
   * Estimasi satu ruas perjalanan.
   * @returns {{km:number, minutes:number, source:'estimasi', mode:string, cost:number}}
   */
  function estimateLeg(from, to, modeId, opts) {
    opts = opts || {};
    var mode = MODES[modeId] || MODES.motor;
    var straight = haversine(from, to);
    var roadFactor = opts.roadFactor || 1.32;

    /* Jarak sangat pendek hampir selalu lurus; jarak jauh lebih
       berkelok. Faktor jalan diskalakan sedikit mengikuti itu. */
    var f = straight < 1.5 ? 1.15 : (straight > 40 ? roadFactor * 1.04 : roadFactor);
    var road = straight * f;

    var traffic = opts.ignoreTraffic ? 1 : trafficFactor(opts.departMin);
    var minutes = (road / mode.speed) * 60 * traffic + mode.overhead;

    return {
      km: road,
      minutes: Math.round(minutes),
      source: 'estimasi',
      mode: mode.id,
      cost: round500(road * (FUEL_PER_KM[mode.id] || 0))
    };
  }

  /* ---------- OSRM: rute jalan sebenarnya (opsional) ---------- */

  var CACHE_KEY = 'rute.osrm.v1';
  var cache = load();
  var inflight = {};
  var failures = 0;
  var DISABLE_AFTER = 4;

  function load() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  var persist = function () {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* kuota penuh */ }
  };

  function key(from, to, profile) {
    return profile + ':' +
      from.lat.toFixed(4) + ',' + from.lng.toFixed(4) + '>' +
      to.lat.toFixed(4) + ',' + to.lng.toFixed(4);
  }

  function cached(from, to, modeId) {
    var mode = MODES[modeId] || MODES.motor;
    return cache[key(from, to, mode.osrm)] || null;
  }

  /**
   * Ambil rute nyata. Selalu resolve — kegagalan jaringan
   * mengembalikan null, bukan melempar error.
   */
  function fetchLeg(from, to, modeId) {
    var mode = MODES[modeId] || MODES.motor;
    var k = key(from, to, mode.osrm);

    if (cache[k]) return Promise.resolve(cache[k]);
    if (failures >= DISABLE_AFTER) return Promise.resolve(null);
    if (inflight[k]) return inflight[k];

    var url = 'https://router.project-osrm.org/route/v1/' + mode.osrm + '/' +
      from.lng + ',' + from.lat + ';' + to.lng + ',' + to.lat +
      '?overview=full&geometries=geojson';

    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);

    inflight[k] = fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        if (!j.routes || !j.routes.length) throw new Error('tidak ada rute');
        var rt = j.routes[0];
        var out = {
          km: rt.distance / 1000,
          seconds: rt.duration,
          geometry: rt.geometry && rt.geometry.coordinates
            ? simplify(rt.geometry.coordinates, 140)
            : null
        };
        cache[k] = out;
        persist();
        failures = 0;
        return out;
      })
      .catch(function () { failures++; return null; })
      .then(function (res) {
        clearTimeout(timer);
        delete inflight[k];
        return res;
      });

    return inflight[k];
  }

  /** Kurangi jumlah titik garis rute supaya peta tetap ringan. */
  function simplify(coords, max) {
    if (coords.length <= max) return coords;
    var step = Math.ceil(coords.length / max);
    var out = [];
    for (var i = 0; i < coords.length; i += step) out.push(coords[i]);
    if (out[out.length - 1] !== coords[coords.length - 1]) out.push(coords[coords.length - 1]);
    return out;
  }

  /**
   * Ruas perjalanan final: pakai rute nyata kalau sudah ada di
   * cache, kalau tidak pakai estimasi.
   */
  function leg(from, to, modeId, opts) {
    opts = opts || {};
    var est = estimateLeg(from, to, modeId, opts);
    if (!opts.live) return est;

    var hit = cached(from, to, modeId);
    if (!hit) return est;

    var mode = MODES[modeId] || MODES.motor;
    var traffic = opts.ignoreTraffic ? 1 : trafficFactor(opts.departMin);
    var minutes = (hit.seconds / 60) * mode.osrmFactor * traffic + mode.overhead;

    return {
      km: hit.km,
      minutes: Math.round(minutes),
      source: 'rute',
      mode: mode.id,
      cost: round500(hit.km * (FUEL_PER_KM[mode.id] || 0)),
      geometry: hit.geometry
    };
  }

  /** Prefetch berurutan supaya tidak membanjiri server publik OSRM. */
  function warm(pairs, modeId, onProgress) {
    var i = 0, got = 0;
    function next() {
      if (i >= pairs.length || failures >= DISABLE_AFTER) {
        return Promise.resolve({ done: i, ok: got, aborted: failures >= DISABLE_AFTER });
      }
      var pr = pairs[i++];
      return fetchLeg(pr[0], pr[1], modeId).then(function (r) {
        if (r) got++;
        if (onProgress) onProgress(i, pairs.length);
        return new Promise(function (res) { setTimeout(res, 120); });
      }).then(next);
    }
    failures = 0;
    return next();
  }

  function hasLive(from, to, modeId) { return !!cached(from, to, modeId); }

  function clearCache() {
    cache = {};
    try { localStorage.removeItem(CACHE_KEY); } catch (e) { /* abaikan */ }
  }

  /** Tautan navigasi ke Google Maps untuk satu ruas. */
  function mapsDirUrl(from, to, modeId) {
    var travel = (modeId === 'jalan') ? 'walking' :
                 (modeId === 'motor') ? 'two-wheeler' : 'driving';
    return 'https://www.google.com/maps/dir/?api=1' +
      '&origin=' + from.lat + ',' + from.lng +
      '&destination=' + to.lat + ',' + to.lng +
      '&travelmode=' + travel;
  }

  function mapsPlaceUrl(place) {
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(place.lat + ',' + place.lng) +
      '&query_place_id=';
  }

  /** Pusat massa sekumpulan titik. */
  function centroid(points) {
    if (!points.length) return null;
    var la = 0, ln = 0;
    points.forEach(function (p) { la += p.lat; ln += p.lng; });
    return { lat: la / points.length, lng: ln / points.length };
  }

  /** Kotak pembatas dengan sedikit ruang di tepi. */
  function bounds(points, pad) {
    if (!points.length) return null;
    var n = -90, s = 90, e = -180, w = 180;
    points.forEach(function (p) {
      n = Math.max(n, p.lat); s = Math.min(s, p.lat);
      e = Math.max(e, p.lng); w = Math.min(w, p.lng);
    });
    var padLat = Math.max((n - s) * (pad || 0.12), 0.01);
    var padLng = Math.max((e - w) * (pad || 0.12), 0.01);
    return { n: n + padLat, s: s - padLat, e: e + padLng, w: w - padLng };
  }

  return {
    MODES: MODES, MODE_ORDER: MODE_ORDER, FUEL_PER_KM: FUEL_PER_KM,
    haversine: haversine, trafficFactor: trafficFactor,
    estimateLeg: estimateLeg, leg: leg,
    fetchLeg: fetchLeg, warm: warm, hasLive: hasLive, clearCache: clearCache,
    mapsDirUrl: mapsDirUrl, mapsPlaceUrl: mapsPlaceUrl,
    centroid: centroid, bounds: bounds
  };
})();
