/**
 * Ads Command Center - Sophie Martin
 * Server Apps Script: menyajikan dashboard + jembatan baca Google Drive.
 *
 * MODE AKSES: "Execute as: Me" + kunci pribadi per anggota (TOKENS).
 *   - Tim TIDAK pernah melihat layar izin/"unverified" Google.
 *   - Folder Drive TIDAK perlu di-share ke tim (dibaca atas nama pemilik).
 *   - Tiap anggota diberi link dengan kuncinya sendiri:
 *       https://script.google.com/.../exec?key=KUNCI-DIA
 *   - Cabut akses = hapus barisnya di TOKENS + Deploy "New version".
 */

/**
 * Daftar kunci akses. Satu baris per orang: 'kunci': 'nama'.
 * Buat kunci yang sulit ditebak (campur kata + angka acak).
 * Kosongkan ( {} ) = semua orang yang punya link bisa masuk tanpa kunci.
 */
var TOKENS = {
  'ganti-kunci-admin-123': 'Aslih (admin)'
  // ,'budi-x7k2q9': 'Budi'
  // ,'sari-m4w8z1': 'Sari'
};

function doGet(e) {
  var key = e && e.parameter ? String(e.parameter.key || '') : '';
  var locked = false;
  for (var k in TOKENS) { locked = true; break; }
  if (locked && !TOKENS.hasOwnProperty(key)) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;max-width:480px;margin:60px auto;padding:0 20px">' +
      '<h3>Akses ditolak</h3>' +
      '<p>Dashboard ini hanya untuk anggota tim yang diundang.</p>' +
      '<p>Gunakan link lengkap (mengandung <code>?key=...</code>) yang ' +
      'dibagikan admin, atau minta admin mengirimkan link pribadi Anda.</p></div>'
    ).setTitle('Ads Command Center');
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Ads Command Center - Sophie Martin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Daftar file di dalam satu folder Drive.
 * Mengembalikan {files:[{id,title,mimeType,updated}]}.
 * Stempel "updated" dipakai browser untuk memproses ulang file yang berubah.
 */
function gdListFiles(folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    var it = folder.getFiles();
    var files = [];
    while (it.hasNext()) {
      var f = it.next();
      var mime = f.getMimeType();
      var title = f.getName();
      if (mime === 'application/vnd.google-apps.spreadsheet') {
        mime = 'text/csv';
        if (!/\.csv$/i.test(title)) title += '.csv';
      }
      files.push({
        id: f.getId(),
        title: title,
        mimeType: mime,
        updated: f.getLastUpdated() ? f.getLastUpdated().toISOString() : ''
      });
    }
    return { files: files };
  } catch (err) {
    return { error: 'Folder ' + folderId + ': ' + err.message };
  }
}

/**
 * Unduh isi satu file sebagai base64.
 * Google Sheet asli diekspor otomatis menjadi CSV (sheet pertama).
 */
function gdDownload(fileId) {
  try {
    var f = DriveApp.getFileById(fileId);
    if (f.getMimeType() === 'application/vnd.google-apps.spreadsheet') {
      var csv = sheetToCsv_(fileId);
      return {
        content: Utilities.base64Encode(csv, Utilities.Charset.UTF_8),
        mimeType: 'text/csv',
        title: f.getName() + '.csv'
      };
    }
    var blob = f.getBlob();
    return {
      content: Utilities.base64Encode(blob.getBytes()),
      mimeType: blob.getContentType(),
      title: f.getName()
    };
  } catch (err) {
    return { error: err.message };
  }
}

/** Sheet pertama dari sebuah Google Sheet menjadi string CSV. */
function sheetToCsv_(fileId) {
  var sheet = SpreadsheetApp.openById(fileId).getSheets()[0];
  var values = sheet.getDataRange().getDisplayValues();
  return values.map(function (row) {
    return row.map(function (cell) {
      var s = String(cell == null ? '' : cell);
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',');
  }).join('\r\n');
}
