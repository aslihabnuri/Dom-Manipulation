/* ============================================================
   Rute — state trip + penyimpanan lokal
   ------------------------------------------------------------
   Satu objek `trip` adalah sumber kebenaran. Semua perubahan
   lewat Store.update(), yang menyimpan ke localStorage dan
   memberi tahu pelanggan. Riwayat 30 langkah terakhir disimpan
   untuk urungkan.
   ============================================================ */

window.Store = (function () {
  'use strict';

  var KEY = 'rute.trip.v1';
  var PREF = 'rute.pref.v1';

  var listeners = [];
  var history = [];
  var trip = null;
  var prefs = null;

  /* ---------- bentuk data ---------- */

  function newDay(index, startIso) {
    return {
      id: U.uid('d'),
      date: startIso ? U.addDays(startIso, index) : null,
      title: '',
      start: '08:00',
      mode: 'motor',
      startFromHub: true,
      returnToHub: false,
      stops: []
    };
  }

  function newStop(place) {
    return {
      id: U.uid('s'),
      placeId: place.id,
      custom: place.custom ? place : null,
      dur: null,      /* null = pakai durasi bawaan tempat */
      cost: null,     /* null = pakai harga bawaan */
      note: '',
      locked: false   /* true = jangan digeser oleh penyusun ulang */
    };
  }

  function blankTrip(destId) {
    var dest = RUTE_DATA.byId(destId || 'jogja');
    var start = U.isoToday();
    return {
      v: 1,
      name: 'Liburan ' + dest.name,
      destId: dest.id,
      startDate: start,
      people: 2,
      budget: 0,               /* 0 = tanpa target */
      liveRouting: false,
      hub: { name: dest.hub.name, lat: dest.hub.lat, lng: dest.hub.lng },
      lodging: 0,              /* per malam, seluruh rombongan */
      days: [newDay(0, start)],
      customPlaces: [],
      activeDayId: null
    };
  }

  /* ---------- muat & simpan ---------- */

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.days && parsed.days.length) return migrate(parsed);
      }
    } catch (e) { /* data rusak — mulai bersih */ }
    return null;
  }

  function migrate(t) {
    if (!t.customPlaces) t.customPlaces = [];
    if (t.people === undefined) t.people = 2;
    if (t.lodging === undefined) t.lodging = 0;
    if (t.budget === undefined) t.budget = 0;
    if (t.liveRouting === undefined) t.liveRouting = false;
    t.days.forEach(function (d) {
      if (!d.id) d.id = U.uid('d');
      if (d.startFromHub === undefined) d.startFromHub = true;
      if (d.returnToHub === undefined) d.returnToHub = false;
      if (!d.mode) d.mode = 'motor';
      (d.stops || []).forEach(function (s) {
        if (!s.id) s.id = U.uid('s');
        if (s.locked === undefined) s.locked = false;
      });
    });
    return t;
  }

  var save = U.debounce(function () {
    try { localStorage.setItem(KEY, JSON.stringify(trip)); }
    catch (e) { /* penyimpanan penuh atau diblokir */ }
  }, 220);

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(PREF);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* abaikan */ }
    return { theme: 'auto', mapScope: 'day', view: 'plan' };
  }

  function savePrefs() {
    try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch (e) { /* abaikan */ }
  }

  /* ---------- API ---------- */

  function init() {
    trip = load() || blankTrip('jogja');
    prefs = loadPrefs();
    if (!trip.activeDayId || !dayById(trip.activeDayId)) {
      trip.activeDayId = trip.days[0].id;
    }
    return trip;
  }

  function get() { return trip; }
  function getPrefs() { return prefs; }

  function setPref(k, v) {
    prefs[k] = v;
    savePrefs();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function emit(reason) {
    listeners.forEach(function (fn) { fn(trip, reason); });
  }

  /**
   * Mutasi terkontrol. `label` dipakai untuk urungkan.
   * `silent` melewati notifikasi (dipakai saat mengetik).
   */
  function update(label, mutator, opts) {
    opts = opts || {};
    if (!opts.noHistory) {
      history.push({ label: label, snapshot: JSON.stringify(trip) });
      if (history.length > 30) history.shift();
    }
    mutator(trip);
    save();
    if (!opts.silent) emit(label);
  }

  function canUndo() { return history.length > 0; }

  function undo() {
    var last = history.pop();
    if (!last) return null;
    trip = JSON.parse(last.snapshot);
    save();
    emit('undo');
    return last.label;
  }

  /* ---------- pembacaan turunan ---------- */

  function dest() { return RUTE_DATA.byId(trip.destId); }

  /** Semua tempat: bawaan destinasi + buatan pengguna. */
  function allPlaces() {
    return dest().places.concat(
      trip.customPlaces.filter(function (c) { return c.destId === trip.destId; })
    );
  }

  var placeIndex = null;
  var placeIndexKey = '';

  function placeById(id) {
    var k = trip.destId + ':' + trip.customPlaces.length;
    if (placeIndexKey !== k) {
      placeIndex = {};
      allPlaces().forEach(function (p) { placeIndex[p.id] = p; });
      placeIndexKey = k;
    }
    return placeIndex[id] || null;
  }

  function invalidatePlaces() { placeIndexKey = ''; }

  function dayById(id) {
    for (var i = 0; i < trip.days.length; i++) if (trip.days[i].id === id) return trip.days[i];
    return null;
  }

  function dayIndex(id) {
    for (var i = 0; i < trip.days.length; i++) if (trip.days[i].id === id) return i;
    return -1;
  }

  function activeDay() { return dayById(trip.activeDayId) || trip.days[0]; }

  /** Id tempat yang sudah masuk itinerary (untuk menandai di Jelajah). */
  function usedPlaceIds() {
    var set = {};
    trip.days.forEach(function (d) {
      d.stops.forEach(function (s) { set[s.placeId] = true; });
    });
    return set;
  }

  /* ---------- operasi umum ---------- */

  function setActiveDay(id) {
    if (trip.activeDayId === id) return;
    update('pindah hari', function (t) { t.activeDayId = id; }, { noHistory: true });
  }

  function addDay() {
    update('tambah hari', function (t) {
      var d = newDay(t.days.length, t.startDate);
      t.days.push(d);
      t.activeDayId = d.id;
    });
  }

  function removeDay(id) {
    if (trip.days.length <= 1) return false;
    update('hapus hari', function (t) {
      var i = dayIndex(id);
      t.days.splice(i, 1);
      resyncDates(t);
      if (t.activeDayId === id) t.activeDayId = t.days[Math.min(i, t.days.length - 1)].id;
    });
    return true;
  }

  function resyncDates(t) {
    if (!t.startDate) return;
    t.days.forEach(function (d, i) { d.date = U.addDays(t.startDate, i); });
  }

  function addStop(dayId, place, atIndex) {
    update('tambah tempat', function (t) {
      var d = dayById(dayId) || activeDay();
      var s = newStop(place);
      if (atIndex === undefined || atIndex === null || atIndex >= d.stops.length) d.stops.push(s);
      else d.stops.splice(atIndex, 0, s);
    });
  }

  function removeStop(dayId, stopId) {
    update('hapus tempat', function () {
      var d = dayById(dayId);
      if (!d) return;
      d.stops = d.stops.filter(function (s) { return s.id !== stopId; });
    });
  }

  function moveStop(dayId, stopId, delta) {
    update('geser urutan', function () {
      var d = dayById(dayId);
      if (!d) return;
      var i = -1;
      d.stops.forEach(function (s, idx) { if (s.id === stopId) i = idx; });
      var j = i + delta;
      if (i < 0 || j < 0 || j >= d.stops.length) return;
      var tmp = d.stops[i];
      d.stops[i] = d.stops[j];
      d.stops[j] = tmp;
    });
  }

  function moveStopToDay(fromDayId, stopId, toDayId) {
    update('pindah hari', function () {
      var from = dayById(fromDayId), to = dayById(toDayId);
      if (!from || !to) return;
      var idx = -1;
      from.stops.forEach(function (s, i) { if (s.id === stopId) idx = i; });
      if (idx < 0) return;
      to.stops.push(from.stops.splice(idx, 1)[0]);
    });
  }

  function addCustomPlace(data) {
    var place = {
      id: U.uid('cp'),
      destId: trip.destId,
      custom: true,
      name: data.name,
      area: data.area || 'Tempat sendiri',
      lat: Number(data.lat),
      lng: Number(data.lng),
      cat: data.cat || 'kota',
      cost: Number(data.cost) || 0,
      extra: 0,
      costNote: '',
      dur: Number(data.dur) || 60,
      open: data.open || null,
      close: data.close || null,
      tags: [],
      rating: 0,
      why: data.why || '',
      tip: ''
    };
    update('tambah tempat sendiri', function (t) {
      t.customPlaces.push(place);
      invalidatePlaces();
    });
    return place;
  }

  function replaceTrip(next) {
    update('muat trip', function () { /* placeholder */ });
    trip = migrate(next);
    if (!trip.activeDayId || !dayById(trip.activeDayId)) trip.activeDayId = trip.days[0].id;
    invalidatePlaces();
    save();
    emit('replace');
  }

  function reset(destId) {
    update('mulai ulang', function () { /* placeholder */ });
    trip = blankTrip(destId || trip.destId);
    invalidatePlaces();
    save();
    emit('reset');
  }

  function exportJson() {
    return JSON.stringify(trip, null, 2);
  }

  return {
    init: init, get: get, update: update, subscribe: subscribe,
    getPrefs: getPrefs, setPref: setPref,
    canUndo: canUndo, undo: undo,
    dest: dest, allPlaces: allPlaces, placeById: placeById, invalidatePlaces: invalidatePlaces,
    dayById: dayById, dayIndex: dayIndex, activeDay: activeDay, usedPlaceIds: usedPlaceIds,
    setActiveDay: setActiveDay, addDay: addDay, removeDay: removeDay, resyncDates: resyncDates,
    addStop: addStop, removeStop: removeStop, moveStop: moveStop, moveStopToDay: moveStopToDay,
    addCustomPlace: addCustomPlace, newDay: newDay, newStop: newStop,
    replaceTrip: replaceTrip, reset: reset, exportJson: exportJson, blankTrip: blankTrip
  };
})();
