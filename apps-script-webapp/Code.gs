/**
 * Ads Command Center — Sophie Martin
 * Google Apps Script Web App (server)
 *
 * Tugas file ini hanya dua:
 *   1. Menyajikan halaman dashboard (Index.html) lewat doGet().
 *   2. Menjadi jembatan baca Google Drive untuk browser:
 *      - gdListFiles(folderId) : daftar file di satu folder raw data
 *      - gdDownload(fileId)    : isi file sebagai base64
 *
 * Seluruh parsing CSV/XLSX dan logika dashboard tetap berjalan di browser
 * (sama persis dengan versi artifact). Web App di-deploy "Execute as: Me"
 * sehingga tim TIDAK perlu punya akses langsung ke folder Drive —
 * cukup akses ke link Web App ini.
 */

/**
 * OPSIONAL — kunci akses tambahan.
 * Biarkan '' (kosong) = semua orang yang punya link bisa membuka.
 * Isi misalnya 'sm-ads-2026' = dashboard hanya terbuka lewat link
 *   https://script.google.com/.../exec?key=sm-ads-2026
 * Berguna bila deployment diset "Anyone" tetapi Anda ingin lapisan
 * pembatas ekstra untuk tim, tanpa perlu Google Workspace.
 */
var SECRET_KEY = '';

function doGet(e) {
  if (SECRET_KEY && !(e && e.parameter && e.parameter.key === SECRET_KEY)) {
    return HtmlService.createHtmlOutput(
      '<p style="font-family:sans-serif;padding:24px">Akses ditolak. Gunakan link lengkap yang dibagikan admin.</p>'
    ).setTitle('Ads Command Center');
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Ads Command Center — Sophie Martin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Daftar file di dalam satu folder Drive.
 * Mengembalikan {files:[{id,title,mimeType,updated}]} — bentuk yang sama
 * dengan yang dulu dikembalikan connector Drive, plus stempel waktu ubah
 * supaya file yang di-update di Drive otomatis diproses ulang oleh browser.
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
      // Google Sheet asli disajikan ke browser sebagai CSV
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
  } catch (e) {
    return { error: 'Folder ' + folderId + ': ' + e.message };
  }
}

/**
 * Unduh isi satu file sebagai base64 — pengganti download_file_content
 * milik connector. Google Sheet asli diekspor otomatis menjadi CSV
 * (sheet pertama) supaya bisa diparse mesin deteksi di browser.
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
  } catch (e) {
    return { error: e.message };
  }
}

/** Sheet pertama dari sebuah Google Sheet → string CSV. */
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
