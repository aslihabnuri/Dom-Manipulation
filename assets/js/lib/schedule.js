/* ============================================================
   Rute — mesin jadwal
   ------------------------------------------------------------
   Menghitung satu hari menjadi rangkaian: berangkat -> ruas
   perjalanan -> kunjungan -> ruas -> kunjungan -> selesai.
   Semua jam mengalir dari satu jam berangkat, jadi mengubah
   urutan atau durasi langsung menggeser sisa hari.

   Selain jam, mesin ini juga menandai masalah yang biasanya
   baru ketahuan di lapangan: tiba setelah tempat tutup, spot
   sunset dijadwalkan tengah hari, atau hari yang isinya 15 jam.
   ============================================================ */

window.Schedule = (function () {
  'use strict';

  var LATE_END = 22 * 60;      /* hari selesai lewat jam ini = terlalu malam */
  var LONG_DAY = 13 * 60;      /* durasi total sejak berangkat */
  var LONG_LEG = 95;           /* satu ruas dianggap jauh */

  /**
   * @param {object} day
   * @param {object} ctx { trip, dest, live, people }
   * @returns {object} hasil terhitung
   */
  function computeDay(day, ctx) {
    var trip = ctx.trip;
    var dest = ctx.dest;
    var people = Math.max(1, Number(trip.people) || 1);
    var hub = trip.hub;
    var mode = day.mode || 'motor';
    var legOpts = { roadFactor: dest.roadFactor, live: !!trip.liveRouting };

    var startMin = U.toMin(day.start);
    if (startMin === null) startMin = 8 * 60;

    var items = [];          /* {type:'leg'|'stop', ...} berurutan */
    var flags = [];          /* peringatan tingkat hari */
    var cursor = startMin;
    var prevPoint = day.startFromHub ? hub : null;
    var travelMin = 0, travelKm = 0, travelCost = 0;
    var visitMin = 0;
    var cost = { tiket: 0, makan: 0, belanja: 0, aktivitas: 0, transport: 0, lain: 0 };
    var liveLegs = 0, totalLegs = 0;

    day.stops.forEach(function (stop, i) {
      var place = stop.custom || Store.placeById(stop.placeId);
      if (!place) return;

      /* --- ruas menuju tempat ini --- */
      var legInfo = null;
      if (prevPoint) {
        legOpts.departMin = cursor;
        legInfo = Geo.leg(prevPoint, place, mode, legOpts);
        cursor += legInfo.minutes;
        travelMin += legInfo.minutes;
        travelKm += legInfo.km;
        travelCost += legInfo.cost;
        totalLegs++;
        if (legInfo.source === 'rute') liveLegs++;

        items.push({
          type: 'leg',
          from: prevPoint,
          to: place,
          mode: mode,
          km: legInfo.km,
          minutes: legInfo.minutes,
          source: legInfo.source,
          cost: legInfo.cost,
          far: legInfo.minutes >= LONG_LEG
        });
      }

      /* --- kunjungan --- */
      var arrive = cursor;
      var wait = 0;
      var openMin = U.toMin(place.open);
      var closeMin = U.toMin(place.close);
      var stopFlags = [];

      if (openMin !== null && arrive < openMin) {
        wait = openMin - arrive;
        arrive = openMin;
        if (wait >= 15) {
          stopFlags.push({
            level: 'info',
            text: 'Tiba ' + U.dur(wait) + ' sebelum buka (' + place.open + '). Jadwal sudah disesuaikan ke jam buka.'
          });
        }
      }

      var visit = stop.dur !== null && stop.dur !== undefined ? Number(stop.dur) : place.dur;
      visit = Math.max(5, visit || 60);
      var depart = arrive + visit;

      if (closeMin !== null) {
        if (arrive >= closeMin) {
          stopFlags.push({
            level: 'alert',
            text: 'Sampai jam ' + U.toHHMM(arrive) + ' padahal tutup jam ' + place.close +
                  '. Majukan jam berangkat atau pindahkan ke hari lain.'
          });
        } else if (depart > closeMin) {
          stopFlags.push({
            level: 'warn',
            text: 'Hanya kebagian ' + U.dur(closeMin - arrive) + ' sebelum tutup jam ' + place.close + '.'
          });
        }
      }

      /* --- kecocokan waktu terbaik --- */
      var tags = place.tags || [];
      if (tags.indexOf('sunrise') >= 0 && arrive > 7 * 60 + 30) {
        stopFlags.push({ level: 'warn', text: 'Tempat ini soal matahari terbit — dijadwalkan jam ' + U.toHHMM(arrive) + ', momennya sudah lewat.' });
      }
      if (tags.indexOf('sunset') >= 0 && depart < 16 * 60 + 30) {
        stopFlags.push({ level: 'warn', text: 'Nilai jualnya matahari terbenam, tapi kamu sudah pergi jam ' + U.toHHMM(depart) + '.' });
      }
      if (tags.indexOf('malam') >= 0 && depart < 18 * 60) {
        stopFlags.push({ level: 'info', text: 'Suasananya baru hidup setelah gelap. Pertimbangkan geser ke malam.' });
      }

      /* --- biaya --- */
      var perPerson = stop.cost !== null && stop.cost !== undefined
        ? Number(stop.cost) : (place.cost || 0);
      var group = place.extra || 0;
      var stopCost = perPerson * people + group;
      var bucket = (RUTE_DATA.CATEGORIES[place.cat] || {}).costGroup || 'lain';
      cost[bucket] = (cost[bucket] || 0) + stopCost;

      visitMin += visit;
      cursor = depart;
      prevPoint = place;

      items.push({
        type: 'stop',
        index: i,
        stop: stop,
        place: place,
        arrive: arrive,
        depart: depart,
        visit: visit,
        wait: wait,
        perPerson: perPerson,
        group: group,
        cost: stopCost,
        flags: stopFlags
      });
    });

    /* --- pulang ke penginapan --- */
    if (day.returnToHub && prevPoint && day.stops.length) {
      legOpts.departMin = cursor;
      var back = Geo.leg(prevPoint, hub, mode, legOpts);
      cursor += back.minutes;
      travelMin += back.minutes;
      travelKm += back.km;
      travelCost += back.cost;
      totalLegs++;
      if (back.source === 'rute') liveLegs++;
      items.push({
        type: 'leg', from: prevPoint, to: hub, mode: mode,
        km: back.km, minutes: back.minutes, source: back.source,
        cost: back.cost, far: back.minutes >= LONG_LEG, isReturn: true
      });
    }

    cost.transport = travelCost;

    var endMin = cursor;
    var totalMin = endMin - startMin;

    /* --- peringatan tingkat hari --- */
    if (day.stops.length) {
      if (endMin >= LATE_END) {
        flags.push({
          level: endMin >= 24 * 60 ? 'alert' : 'warn',
          text: endMin >= 24 * 60
            ? 'Hari ini baru selesai jam ' + U.toHHMMDay(endMin) + '. Terlalu padat — kurangi tempat atau pecah jadi dua hari.'
            : 'Hari ini baru selesai jam ' + U.toHHMM(endMin) + '. Cukup larut.'
        });
      }
      if (totalMin > LONG_DAY) {
        flags.push({ level: 'warn', text: 'Total ' + U.dur(totalMin) + ' di jalan dan di lokasi. Hari yang panjang.' });
      }
      if (travelMin > visitMin && day.stops.length > 1) {
        flags.push({
          level: 'warn',
          text: 'Waktu di jalan (' + U.dur(travelMin) + ') melebihi waktu menikmati tempatnya (' + U.dur(visitMin) + ').'
        });
      }
    }

    var subtotal = 0;
    Object.keys(cost).forEach(function (k) { subtotal += cost[k]; });

    return {
      day: day,
      items: items,
      flags: flags,
      startMin: startMin,
      endMin: endMin,
      totalMin: totalMin,
      travelMin: travelMin,
      travelKm: travelKm,
      visitMin: visitMin,
      cost: cost,
      subtotal: subtotal,
      stopCount: day.stops.length,
      liveLegs: liveLegs,
      totalLegs: totalLegs,
      worst: worstLevel(flags, items)
    };
  }

  function worstLevel(flags, items) {
    var level = null;
    function bump(l) {
      if (l === 'alert') level = 'alert';
      else if (l === 'warn' && level !== 'alert') level = 'warn';
    }
    flags.forEach(function (f) { bump(f.level); });
    items.forEach(function (it) {
      if (it.type === 'stop') it.flags.forEach(function (f) { bump(f.level); });
    });
    return level;
  }

  /** Hitung seluruh trip. */
  function computeTrip(trip) {
    var dest = RUTE_DATA.byId(trip.destId);
    var ctx = { trip: trip, dest: dest };
    var days = trip.days.map(function (d) { return computeDay(d, ctx); });

    var total = { tiket: 0, makan: 0, belanja: 0, aktivitas: 0, transport: 0, lain: 0, penginapan: 0 };
    var travelKm = 0, travelMin = 0, visitMin = 0, stops = 0, liveLegs = 0, totalLegs = 0;

    days.forEach(function (d) {
      Object.keys(d.cost).forEach(function (k) { total[k] = (total[k] || 0) + d.cost[k]; });
      travelKm += d.travelKm;
      travelMin += d.travelMin;
      visitMin += d.visitMin;
      stops += d.stopCount;
      liveLegs += d.liveLegs;
      totalLegs += d.totalLegs;
    });

    /* Penginapan dihitung per malam = jumlah hari - 1, minimal 0. */
    var nights = Math.max(0, trip.days.length - 1);
    total.penginapan = (Number(trip.lodging) || 0) * nights;

    var grand = 0;
    Object.keys(total).forEach(function (k) { grand += total[k]; });

    var people = Math.max(1, Number(trip.people) || 1);

    return {
      days: days,
      cost: total,
      grand: grand,
      perPerson: grand / people,
      nights: nights,
      travelKm: travelKm,
      travelMin: travelMin,
      visitMin: visitMin,
      stops: stops,
      liveLegs: liveLegs,
      totalLegs: totalLegs,
      overBudget: trip.budget > 0 && grand > trip.budget * people
    };
  }

  var COST_LABELS = {
    tiket: 'Tiket masuk',
    makan: 'Makan',
    transport: 'Transport',
    aktivitas: 'Aktivitas',
    belanja: 'Oleh-oleh',
    penginapan: 'Penginapan',
    lain: 'Lain-lain'
  };

  /** Pasangan titik yang perlu dirutekan — untuk prefetch OSRM. */
  function legPairs(trip) {
    var pairs = [];
    trip.days.forEach(function (day) {
      var prev = day.startFromHub ? trip.hub : null;
      day.stops.forEach(function (s) {
        var pl = s.custom || Store.placeById(s.placeId);
        if (!pl) return;
        if (prev) pairs.push([{ lat: prev.lat, lng: prev.lng }, { lat: pl.lat, lng: pl.lng }, day.mode]);
        prev = pl;
      });
      if (day.returnToHub && prev && day.stops.length) {
        pairs.push([{ lat: prev.lat, lng: prev.lng }, { lat: trip.hub.lat, lng: trip.hub.lng }, day.mode]);
      }
    });
    return pairs;
  }

  return {
    computeDay: computeDay,
    computeTrip: computeTrip,
    legPairs: legPairs,
    COST_LABELS: COST_LABELS,
    LATE_END: LATE_END
  };
})();
