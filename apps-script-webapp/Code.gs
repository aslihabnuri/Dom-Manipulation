/**
 * Ads Command Center - Sophie Martin
 * Server Apps Script: menyajikan dashboard + jembatan baca Google Drive.
 * Parsing CSV/XLSX dan seluruh logika dashboard berjalan di browser (Index.html).
 *
 * MODE AKSES: hanya email yang terdaftar di ALLOWED_EMAILS yang bisa membuka.
 * Syarat mode ini (lihat PANDUAN.md):
 *   - Deployment: Execute as "User accessing the web app",
 *     Who has access "Anyone with Google account".
 *   - Folder "SM Ads Raw Data" di-share (Viewer) ke email yang sama.
 */

/**
 * Daftar email yang boleh membuka dashboard (huruf kecil semua).
 * Kosongkan daftar ( [] ) = semua orang yang punya link boleh masuk.
 */
var ALLOWED_EMAILS = [
  'aslihabnuri28@gmail.com'
  // ,'anggota1@gmail.com'
  // ,'anggota2@gmail.com'
];

function getVisitorEmail_() {
  var em = '';
  try { em = Session.getActiveUser().getEmail() || ''; } catch (e) {}
  if (!em) { try { em = Session.getEffectiveUser().getEmail() || ''; } catch (e) {} }
  return String(em).trim().toLowerCase();
}

function isAllowed_() {
  if (!ALLOWED_EMAILS.length) return true;
  var em = getVisitorEmail_();
  if (!em) return false;
  for (var i = 0; i < ALLOWED_EMAILS.length; i++) {
    if (String(ALLOWED_EMAILS[i]).trim().toLowerCase() === em) return true;
  }
  return false;
}

function doGet() {
  if (!isAllowed_()) {
    var em = getVisitorEmail_();
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;max-width:480px;margin:60px auto;padding:0 20px">' +
      '<h3>Akses ditolak</h3>' +
      '<p>Dashboard ini hanya untuk anggota tim yang terdaftar.</p>' +
      '<p>Anda login sebagai: <b>' + (em || '(email tidak terbaca)') + '</b></p>' +
      '<p>Jika ini akun yang salah, buka link dalam jendela incognito lalu login ' +
      'dengan akun Google yang didaftarkan. Jika akun sudah benar, minta admin ' +
      'menambahkan email Anda.</p></div>'
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
  if (!isAllowed_()) return { error: 'Akses ditolak.' };
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
  if (!isAllowed_()) return { error: 'Akses ditolak.' };
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
