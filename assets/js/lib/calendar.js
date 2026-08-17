/* ============================================================
   Rute — ekspor kalender
   ------------------------------------------------------------
   Dua jalur, keduanya tanpa login dan tanpa server:

   1. Tautan "Tambah ke Google Calendar" per aktivitas.
   2. Berkas .ics berisi seluruh trip, bisa diimpor sekali jalan
      ke Google Calendar, Apple Calendar, atau Outlook.

   Zona waktu ditulis eksplisit sebagai UTC (akhiran Z) dari jam
   lokal destinasi, jadi jamnya tetap benar walau ponsel sedang
   memakai zona lain.
   ============================================================ */

window.Cal = (function () {
  'use strict';

  /* Zona waktu per destinasi. Indonesia punya tiga. */
  var TZ = {
    jogja:   { offset: 7, name: 'Asia/Jakarta' },
    bandung: { offset: 7, name: 'Asia/Jakarta' },
    bali:    { offset: 8, name: 'Asia/Makassar' },
    bromo:   { offset: 7, name: 'Asia/Jakarta' }
  };

  function tzFor(destId) { return TZ[destId] || TZ.jogja; }

  /**
   * Ubah tanggal ISO + menit lokal menjadi cap waktu UTC gaya iCal.
   * Menit boleh melebihi 1440 (kegiatan yang lewat tengah malam).
   */
  function stampUTC(iso, minutes, offsetHours) {
    var base = U.parseIso(iso);
    if (!base) return null;
    var utcMs = Date.UTC(
      base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0
    ) + (minutes - offsetHours * 60) * 60000;
    var d = new Date(utcMs);
    return d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /** Escape sesuai RFC 5545. */
  function esc(s) {
    return String(s || '')
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  /** Baris iCal maksimal 75 oktet; sisanya dilipat dengan spasi. */
  function fold(line) {
    if (line.length <= 73) return line;
    var out = line.slice(0, 73);
    var rest = line.slice(73);
    while (rest.length > 72) {
      out += '\r\n ' + rest.slice(0, 72);
      rest = rest.slice(72);
    }
    return out + (rest.length ? '\r\n ' + rest : '');
  }

  /** Kumpulkan semua kegiatan terjadwal dari hasil hitung trip. */
  function collect(trip, computed) {
    var events = [];
    computed.days.forEach(function (dc, di) {
      var day = dc.day;
      if (!day.date) return;
      dc.items.forEach(function (it) {
        if (it.type !== 'stop') return;
        events.push({
          dayIndex: di,
          date: day.date,
          start: it.arrive,
          end: it.depart,
          place: it.place,
          stop: it.stop,
          cost: it.cost,
          dayTitle: day.title || ('Hari ' + (di + 1))
        });
      });
    });
    return events;
  }

  function describe(ev, trip) {
    var lines = [];
    if (ev.place.why) lines.push(ev.place.why);
    if (ev.place.tip) lines.push('Catatan: ' + ev.place.tip);
    if (ev.stop && ev.stop.note) lines.push('Catatanmu: ' + ev.stop.note);
    lines.push('');
    lines.push('Perkiraan biaya: ' + U.rupiah(ev.cost) + ' untuk ' + trip.people + ' orang');
    if (ev.place.open && ev.place.close) lines.push('Jam buka: ' + ev.place.open + '–' + ev.place.close);
    lines.push('Peta: https://www.google.com/maps/search/?api=1&query=' + ev.place.lat + ',' + ev.place.lng);
    lines.push('');
    lines.push('Dibuat dengan Rute — ' + trip.name);
    return lines.join('\n');
  }

  /** Berkas .ics untuk seluruh trip. */
  function buildIcs(trip, computed) {
    var tz = tzFor(trip.destId);
    var events = collect(trip, computed);
    var now = stampUTC(U.isoToday(), new Date().getHours() * 60 + new Date().getMinutes(), tz.offset);

    var out = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rute//Perencana Itinerary//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + esc(trip.name),
      'X-WR-TIMEZONE:' + tz.name
    ];

    events.forEach(function (ev, i) {
      var dtStart = stampUTC(ev.date, ev.start, tz.offset);
      var dtEnd = stampUTC(ev.date, ev.end, tz.offset);
      if (!dtStart || !dtEnd) return;

      out.push('BEGIN:VEVENT');
      out.push('UID:' + (ev.stop ? ev.stop.id : 'ev' + i) + '@rute.local');
      out.push('DTSTAMP:' + now);
      out.push('DTSTART:' + dtStart);
      out.push('DTEND:' + dtEnd);
      out.push(fold('SUMMARY:' + esc(ev.place.name)));
      out.push(fold('LOCATION:' + esc(ev.place.name + ', ' + ev.place.area)));
      out.push(fold('DESCRIPTION:' + esc(describe(ev, trip))));
      out.push('GEO:' + ev.place.lat + ';' + ev.place.lng);
      out.push('CATEGORIES:' + esc(ev.dayTitle));
      out.push('BEGIN:VALARM');
      out.push('TRIGGER:-PT30M');
      out.push('ACTION:DISPLAY');
      out.push(fold('DESCRIPTION:' + esc('30 menit lagi: ' + ev.place.name)));
      out.push('END:VALARM');
      out.push('END:VEVENT');
    });

    out.push('END:VCALENDAR');
    return out.join('\r\n');
  }

  /** Tautan "Tambah ke Google Calendar" untuk satu kegiatan. */
  function googleUrl(ev, trip) {
    var tz = tzFor(trip.destId);
    var s = stampUTC(ev.date, ev.start, tz.offset);
    var e = stampUTC(ev.date, ev.end, tz.offset);
    if (!s || !e) return null;

    var params = [
      'action=TEMPLATE',
      'text=' + encodeURIComponent(ev.place.name),
      'dates=' + s + '/' + e,
      'details=' + encodeURIComponent(describe(ev, trip)),
      'location=' + encodeURIComponent(ev.place.name + ', ' + ev.place.area),
      'ctz=' + encodeURIComponent(tz.name)
    ];
    return 'https://calendar.google.com/calendar/render?' + params.join('&');
  }

  /**
   * Menyimpan berkas. Di halaman biasa lewat blob URL; di halaman
   * artifact lewat kapabilitas unduhan, yang meminta persetujuan
   * pembaca dan hanya menerima daftar ekstensi tertentu — .ics tidak
   * termasuk, jadi di sana ia disimpan sebagai .txt.
   *
   * @returns {Promise<{via:string, filename:string}>}
   *          ditolak dengan {code, message} kalau gagal.
   */
  function download(filename, text, mime) {
    if (window.RUTE_ARTIFACT && window.claude && typeof window.claude.use === 'function') {
      return window.claude.use('downloads').then(function (dl) {
        if (!dl) return blobDownload(filename, text, mime);
        var safe = filename.replace(/\.ics$/i, '.txt');
        return dl.save({ filename: safe, data: text }).then(function () {
          return { via: 'capability', filename: safe };
        });
      });
    }
    return blobDownload(filename, text, mime);
  }

  function blobDownload(filename, text, mime) {
    var blob = new Blob([text], { type: (mime || 'text/calendar') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    return Promise.resolve({ via: 'blob', filename: filename });
  }

  function slug(s) {
    return U.deburr(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'trip';
  }

  return {
    buildIcs: buildIcs,
    googleUrl: googleUrl,
    collect: collect,
    download: download,
    slug: slug,
    tzFor: tzFor
  };
})();
