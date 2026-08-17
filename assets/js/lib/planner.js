/* ============================================================
   Rute — penyusun itinerary otomatis
   ------------------------------------------------------------
   Empat langkah:

   1. SKOR    tiap tempat dinilai dari kecocokan minat, rating,
              status ikonik, dan kepatuhan pada batas biaya.
   2. KELOMPOK tempat terpilih dikelompokkan secara geografis
              dengan k-means (k = jumlah hari), supaya satu hari
              tidak melompat dari pantai selatan ke Borobudur.
   3. URUT    tiap kelompok diurutkan dengan nearest-neighbour
              lalu diperbaiki 2-opt, dimulai dari penginapan.
   4. ISI     tempat dimasukkan sampai jatah waktu hari itu habis,
              dengan menghormati jam buka dan waktu terbaik.

   k-means memakai pengacak berbenih tetap, jadi hasil untuk
   masukan yang sama selalu sama — bukan lotre tiap klik.
   ============================================================ */

window.Planner = (function () {
  'use strict';

  var PACE = {
    santai:  { label: 'Santai',  minutes: 7 * 60,  maxStops: 3, note: 'bangun siang, tidak buru-buru' },
    sedang:  { label: 'Sedang',  minutes: 9 * 60,  maxStops: 5, note: 'ritme wajar' },
    padat:   { label: 'Padat',   minutes: 11 * 60, maxStops: 7, note: 'kejar sebanyak mungkin' }
  };

  /* Pengacak berbenih: hasil deterministik untuk masukan sama. */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ---------- 1. skor ---------- */

  function scorePlace(place, opts) {
    var interests = opts.interests || [];
    var s = 0;

    var hits = 0;
    (place.tags || []).forEach(function (t) {
      if (interests.indexOf(t) >= 0) hits++;
    });
    s += hits * 26;

    /* Tanpa minat terpilih, andalkan rating dan status ikonik. */
    if (!interests.length) s += 18;

    s += (place.rating || 4) * 9;
    if ((place.tags || []).indexOf('ikonik') >= 0) s += 14;

    /* Hormati batas biaya: mahal tidak dilarang, hanya dikurangi. */
    var perHead = place.cost || 0;
    if (opts.maxPerPlace > 0 && perHead > opts.maxPerPlace) {
      var over = perHead / opts.maxPerPlace;
      s -= Math.min(60, (over - 1) * 34);
    }

    /* Tempat yang nilainya ada di matahari terbit percuma dipilih
       kalau jam berangkatnya sudah siang — kecuali memang diminta. */
    if ((place.tags || []).indexOf('sunrise') >= 0 &&
        opts.startMin > 6 * 60 + 30 && interests.indexOf('sunrise') < 0) {
      s -= 45;
    }

    /* Yang makan waktu sangat lama sulit dipasangkan. */
    if (place.dur >= 210) s -= 8;

    /* Kuliner perlu ada, tapi tidak boleh mendominasi. */
    if (place.cat === 'kuliner' && interests.indexOf('kuliner') < 0) s -= 12;
    if (place.cat === 'belanja' && interests.indexOf('belanja') < 0) s -= 14;

    return s;
  }

  /* ---------- 2. kelompok geografis ---------- */

  function kmeans(points, k, seed) {
    if (points.length <= k) {
      return points.map(function (p) { return [p]; });
    }
    var rand = rng(seed || 7);

    /* k-means++ ringan: benih pertama acak, sisanya yang terjauh. */
    var centers = [pick(points, Math.floor(rand() * points.length))];
    while (centers.length < k) {
      var best = null, bestD = -1;
      points.forEach(function (p) {
        var d = Math.min.apply(null, centers.map(function (c) { return Geo.haversine(p, c); }));
        if (d > bestD) { bestD = d; best = p; }
      });
      centers.push({ lat: best.lat, lng: best.lng });
    }

    var assign = new Array(points.length).fill(0);
    for (var iter = 0; iter < 40; iter++) {
      var moved = false;
      points.forEach(function (p, i) {
        var bi = 0, bd = Infinity;
        centers.forEach(function (c, ci) {
          var d = Geo.haversine(p, c);
          if (d < bd) { bd = d; bi = ci; }
        });
        if (assign[i] !== bi) { assign[i] = bi; moved = true; }
      });
      centers = centers.map(function (c, ci) {
        var members = points.filter(function (_, i) { return assign[i] === ci; });
        return members.length ? Geo.centroid(members) : c;
      });
      if (!moved) break;
    }

    balance(points, assign, centers, k);

    var groups = [];
    for (var g = 0; g < k; g++) groups.push([]);
    points.forEach(function (p, i) { groups[assign[i]].push(p); });
    return groups;
  }

  /**
   * k-means murni sering menghasilkan satu kelompok gemuk dan satu
   * kelompok berisi satu titik — yang berarti satu hari penuh dan
   * satu hari nyaris kosong. Di sini kelebihan anggota dipindahkan
   * ke kelompok terdekat yang masih longgar, memilih anggota yang
   * paling murah dipindahkan.
   */
  function balance(points, assign, centers, k) {
    var cap = Math.ceil(points.length / k);
    var counts = new Array(k).fill(0);
    assign.forEach(function (a) { counts[a]++; });

    var guard = 0;
    while (guard++ < 300) {
      var over = -1;
      for (var i = 0; i < k; i++) if (counts[i] > cap) { over = i; break; }
      if (over < 0) break;

      var bestIdx = -1, bestTo = -1, bestCost = Infinity;
      points.forEach(function (p, idx) {
        if (assign[idx] !== over) return;
        var here = Geo.haversine(p, centers[over]);
        for (var c = 0; c < k; c++) {
          if (c === over || counts[c] >= cap) continue;
          var cost = Geo.haversine(p, centers[c]) - here;
          if (cost < bestCost) { bestCost = cost; bestIdx = idx; bestTo = c; }
        }
      });

      if (bestIdx < 0) break;
      counts[assign[bestIdx]]--;
      assign[bestIdx] = bestTo;
      counts[bestTo]++;
    }
  }

  function pick(arr, i) { return { lat: arr[i].lat, lng: arr[i].lng }; }

  /* ---------- 3. urutan rute ---------- */

  function orderRoute(places, origin, roadFactor) {
    if (places.length <= 2) return places.slice();

    var remaining = places.slice();
    var route = [];
    var cur = origin;

    while (remaining.length) {
      var bi = 0, bd = Infinity;
      remaining.forEach(function (p, i) {
        var d = Geo.haversine(cur, p);
        if (d < bd) { bd = d; bi = i; }
      });
      cur = remaining[bi];
      route.push(cur);
      remaining.splice(bi, 1);
    }

    /* 2-opt: buang persilangan yang tersisa dari nearest-neighbour. */
    var improved = true, guard = 0;
    while (improved && guard++ < 60) {
      improved = false;
      for (var i = 0; i < route.length - 1; i++) {
        for (var j = i + 1; j < route.length; j++) {
          var a = i === 0 ? origin : route[i - 1];
          var b = route[i];
          var c = route[j];
          var d = route[j + 1];
          var before = Geo.haversine(a, b) + (d ? Geo.haversine(c, d) : 0);
          var after = Geo.haversine(a, c) + (d ? Geo.haversine(b, d) : 0);
          if (after < before - 0.0001) {
            var seg = route.slice(i, j + 1).reverse();
            Array.prototype.splice.apply(route, [i, seg.length].concat(seg));
            improved = true;
          }
        }
      }
    }
    return route;
  }

  /* ---------- 4. isi hari ---------- */

  /**
   * Urutkan satu hari dengan dua batasan sekaligus: waktu terbaik
   * tiap tempat (sunrise di depan, sunset/malam di belakang) DAN
   * jarak tempuh sependek mungkin.
   *
   * Kuncinya adalah merutekan tiap kelompok waktu dari posisi
   * terakhir kelompok sebelumnya. Kalau ketiganya dirutekan dari
   * penginapan lalu disambung begitu saja, hasilnya rute yang
   * melompat jauh ke timur, balik ke kota, lalu ke timur lagi.
   */
  function routeWithTiming(places, origin, roadFactor) {
    var dawn = [], dusk = [], mid = [];
    places.forEach(function (p) {
      var t = p.tags || [];
      if (t.indexOf('sunrise') >= 0) dawn.push(p);
      else if (t.indexOf('malam') >= 0 || t.indexOf('sunset') >= 0) dusk.push(p);
      else mid.push(p);
    });

    var out = [];
    var cur = origin;
    [dawn, mid, dusk].forEach(function (bucket) {
      if (!bucket.length) return;
      var seg = orderRoute(bucket, cur, roadFactor);
      out = out.concat(seg);
      cur = seg[seg.length - 1];
    });
    return out;
  }

  /** Perkiraan biaya waktu satu tempat termasuk perjalanan menuju ke sana. */
  function timeCost(place, from, mode, roadFactor) {
    var leg = Geo.estimateLeg(from, place, mode, { roadFactor: roadFactor, ignoreTraffic: true });
    return leg.minutes + place.dur;
  }

  /**
   * @param {object} cfg
   *   destId, days, interests[], pace, mode, budgetPerPerson,
   *   startTime, hub, avoid[]  (id tempat yang tidak diinginkan)
   * @returns {{days: Array<{stops: Array}>, used: Array, dropped: number}}
   */
  function generate(cfg) {
    var dest = RUTE_DATA.byId(cfg.destId);
    var pace = PACE[cfg.pace] || PACE.sedang;
    var dayCount = Math.max(1, cfg.days || 3);
    var mode = cfg.mode || 'motor';
    var hub = cfg.hub || dest.hub;
    var avoid = cfg.avoid || [];

    /* Jatah biaya kasar per tempat, dipakai untuk memberi skor. */
    var slots = dayCount * pace.maxStops;
    var maxPerPlace = cfg.budgetPerPerson > 0
      ? (cfg.budgetPerPerson * 0.55) / Math.max(1, slots) * 2.2
      : 0;

    var scored = dest.places
      .filter(function (p) { return avoid.indexOf(p.id) < 0; })
      .map(function (p) {
        return { place: p, score: scorePlace(p, {
          interests: cfg.interests, maxPerPlace: maxPerPlace, startMin: U.toMin(cfg.startTime || '08:00')
        }) };
      })
      .sort(function (a, b) { return b.score - a.score; });

    /* Ambil kandidat sedikit lebih banyak dari kebutuhan supaya
       pengelompokan punya ruang gerak, lalu buang yang skornya
       jauh di bawah rata-rata. */
    var want = Math.min(scored.length, Math.ceil(slots * 1.7));
    var candidates = scored.slice(0, want).map(function (s) { return s.place; });

    if (!candidates.length) return { days: [], used: [], dropped: 0 };

    var groups = kmeans(candidates, dayCount, 11);

    /* Kelompok yang lebih jauh dari penginapan ditaruh di tengah
       trip; hari pertama dan terakhir biasanya terpotong perjalanan. */
    groups = groups
      .filter(function (g) { return g.length; })
      .map(function (g) {
        var c = Geo.centroid(g);
        return { places: g, dist: Geo.haversine(hub, c), centroid: c };
      })
      .sort(function (a, b) { return a.dist - b.dist; });

    var ordered = arrangeDays(groups, dayCount);

    var startMin = U.toMin(cfg.startTime || '08:00');
    var out = [];
    var used = [];
    var dropped = 0;

    ordered.forEach(function (group) {
      if (!group) { out.push({ stops: [] }); return; }

      var route = routeWithTiming(group.places, hub, dest.roadFactor);
      var budgetMin = pace.minutes;
      var spent = 0;
      var from = hub;
      var stops = [];

      for (var i = 0; i < route.length; i++) {
        var place = route[i];
        if (stops.length >= pace.maxStops) { dropped++; continue; }

        var need = timeCost(place, from, mode, dest.roadFactor);

        /* Jangan mulai kunjungan setelah tempatnya tutup. */
        var closeMin = U.toMin(place.close);
        var arriveApprox = startMin + spent + (need - place.dur);
        if (closeMin !== null && arriveApprox >= closeMin) { dropped++; continue; }

        if (spent + need > budgetMin && stops.length >= 2) { dropped++; continue; }

        stops.push(place);
        used.push(place.id);
        spent += need;
        from = place;
      }

      out.push({ stops: stops });
    });

    return { days: out, used: used, dropped: dropped, pace: pace };
  }

  /**
   * Sebarkan kelompok ke hari: yang terdekat dari penginapan di
   * hari pertama dan terakhir, yang terjauh di tengah.
   */
  function arrangeDays(groups, dayCount) {
    var slotsOrder = [];
    var lo = 0, hi = dayCount - 1;
    /* Urutan pengisian: 0, n-1, 1, n-2, ... */
    while (lo <= hi) {
      slotsOrder.push(lo);
      if (lo !== hi) slotsOrder.push(hi);
      lo++; hi--;
    }
    var out = new Array(dayCount).fill(null);
    groups.forEach(function (g, i) {
      var slot = slotsOrder[i];
      if (slot !== undefined) out[slot] = g;
    });
    return out;
  }

  /**
   * Rekomendasi tambahan: tempat bagus yang belum masuk itinerary,
   * diurutkan dari yang paling dekat dengan rute hari aktif.
   */
  function suggestFor(day, trip, limit) {
    var dest = RUTE_DATA.byId(trip.destId);
    var usedIds = Store.usedPlaceIds();
    var anchor = null;

    if (day.stops.length) {
      var pts = day.stops.map(function (s) {
        return s.custom || Store.placeById(s.placeId);
      }).filter(Boolean);
      anchor = Geo.centroid(pts);
    } else {
      anchor = trip.hub;
    }

    return dest.places
      .filter(function (p) { return !usedIds[p.id]; })
      .map(function (p) {
        var d = Geo.haversine(anchor, p);
        return { place: p, dist: d, score: (p.rating || 4) * 10 - d * 1.6 };
      })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 4);
  }

  /**
   * Susun ulang urutan satu hari yang sudah ada supaya jarak
   * tempuhnya minimal — tanpa menambah atau membuang tempat.
   */
  function optimiseDay(day, trip) {
    var dest = RUTE_DATA.byId(trip.destId);
    var places = day.stops.map(function (s) {
      return { stop: s, place: s.custom || Store.placeById(s.placeId) };
    }).filter(function (x) { return x.place; });

    if (places.length < 3) return null;

    var locked = places.filter(function (x) { return x.stop.locked; });
    var free = places.filter(function (x) { return !x.stop.locked; });
    if (free.length < 2) return null;

    var origin = day.startFromHub ? trip.hub : free[0].place;
    var route = routeWithTiming(free.map(function (x) { return x.place; }), origin, dest.roadFactor);

    var byId = {};
    free.forEach(function (x) { byId[x.place.id] = x.stop; });
    var reordered = route.map(function (p) { return byId[p.id]; });

    /* Kembalikan tempat yang dikunci ke posisi semula. */
    var result = [];
    var fi = 0;
    places.forEach(function (x, i) {
      if (x.stop.locked) result[i] = x.stop;
    });
    for (var i = 0; i < places.length; i++) {
      if (!result[i]) result[i] = reordered[fi++];
    }
    return result.filter(Boolean);
  }

  return {
    PACE: PACE,
    generate: generate,
    suggestFor: suggestFor,
    optimiseDay: optimiseDay,
    scorePlace: scorePlace,
    orderRoute: orderRoute
  };
})();
