/**
 * Ads Command Center - Sophie Martin
 * Akses: daftar email (ALLOWED_EMAILS).
 *
 * Halaman dashboard TIDAK disajikan langsung (mesin penyaji Apps Script
 * memotong halaman sebesar ini di tengah script). Sebagai gantinya doGet
 * mengirim halaman pemuat kecil; browser lalu mengambil isi dashboard
 * dari file Index.html di Drive lewat google.script.run (jalur data,
 * bebas dari pemotongan) dan merakitnya sendiri.
 */

var ALLOWED_EMAILS = [
  'aslihabnuri28@gmail.com'
  // ,'anggota1@gmail.com'
  // ,'anggota2@gmail.com'
];

/** ID file Index.html di Google Drive. */
var INDEX_FILE_ID = 'TEMPEL-ID-FILE-DI-SINI';

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

var BOOTSTRAP_HTML = [
  '<!doctype html><html><head><meta charset="utf-8"><title>Ads Command Center</title>',
  '<style>body{font-family:sans-serif;background:#f1f2f7;color:#333;display:grid;place-items:center;min-height:100vh;margin:0}',
  '.box{text-align:center;max-width:420px;padding:0 20px}',
  '.sp{width:34px;height:34px;border:3px solid #ccd;border-top-color:#1b2380;border-radius:50%;margin:0 auto 12px;animation:r 1s linear infinite}',
  '@keyframes r{to{transform:rotate(360deg)}}</style>',
  '</head><body><div class="box"><div class="sp"></div><div id="st">Memuat dashboard…</div></div>',
  '<script>',
  'function fail(m){var s=document.getElementById("st");if(s)s.innerHTML="<b>Gagal memuat:</b> "+m;}',
  'google.script.run.withSuccessHandler(function(r){',
  '  if(!r||r.error){fail((r&&r.error)||"respons kosong");return;}',
  '  try{',
  '    var doc=new DOMParser().parseFromString(r.html,"text/html");',
  '    document.replaceChild(document.adoptNode(doc.documentElement),document.documentElement);',
  '    var list=document.querySelectorAll("script");',
  '    for(var i=0;i<list.length;i++){',
  '      var o=list[i],t=o.getAttribute("type");',
  '      if(t&&t.indexOf("javascript")===-1)continue;',
  '      var s=document.createElement("script");',
  '      s.textContent=o.textContent;',
  '      o.parentNode.replaceChild(s,o);',
  '    }',
  '  }catch(e){fail(e.message);}',
  '}).withFailureHandler(function(e){fail((e&&e.message)||e);}).getIndexHtml();',
  '<\/script></body></html>'
].join('\n');

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
  return HtmlService.createHtmlOutput(BOOTSTRAP_HTML)
    .setTitle('Ads Command Center - Sophie Martin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Isi file Index.html dari Drive, dikirim sebagai data ke halaman pemuat. */
function getIndexHtml() {
  if (!isAllowed_()) return { error: 'Akses ditolak.' };
  try {
    return { html: DriveApp.getFileById(INDEX_FILE_ID).getBlob().getDataAsString('utf-8') };
  } catch (err) {
    return { error: err.message + ' — untuk admin: pastikan INDEX_FILE_ID benar dan file ' +
      'Index.html di Drive bisa dibaca anggota ini (taruh di folder yang di-share).' };
  }
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
