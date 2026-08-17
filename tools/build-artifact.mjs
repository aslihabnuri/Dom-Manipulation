/* ============================================================
   Rute — pembuat berkas artifact
   ------------------------------------------------------------
   Menggabungkan index.html, CSS, dan JS menjadi SATU berkas HTML
   mandiri untuk dipublikasikan sebagai Claude Artifact.

   Halaman artifact tidak boleh menghubungi host luar, jadi:
     - Leaflet dan ubin OpenStreetMap dilepas; aplikasi memakai
       peta skematiknya sendiri (window.RUTE_ARTIFACT menyalakannya)
     - rute OSRM dimatikan; semua jarak memakai estimasi
     - unduhan lewat kapabilitas `downloads`, bukan blob URL

   Sumbernya tetap satu: berkas di assets/ adalah kebenarannya,
   berkas hasil build hanya turunan. Jalankan ulang setiap kali
   sumbernya berubah.

       node tools/build-artifact.mjs

   Keluaran: dist/rute-artifact.html
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const CSS = ['assets/css/tokens.css', 'assets/css/app.css'];

const JS = [
  'assets/js/data/destinations.js',
  'assets/js/lib/util.js',
  'assets/js/lib/geo.js',
  'assets/js/lib/store.js',
  'assets/js/lib/schedule.js',
  'assets/js/lib/planner.js',
  'assets/js/lib/calendar.js',
  'assets/js/lib/charts.js',
  'assets/js/lib/map.js',
  'assets/js/ui/shell.js',
  'assets/js/ui/plan.js',
  'assets/js/ui/explore.js',
  'assets/js/ui/budget.js',
  'assets/js/ui/live.js',
  'assets/js/app.js'
];

let html = read('index.html');

/* --- buang tag sumber luar dan tautan berkas terpisah --- */
html = html
  .replace(/<link rel="stylesheet" href="assets\/[^"]*">\s*/g, '')
  .replace(/<!--[\s\S]*?Leaflet dibundel[\s\S]*?-->\s*/g, '')
  .replace(/<script src="assets\/vendor\/leaflet\/leaflet\.js"[^>]*><\/script>\s*/g, '')
  .replace(/<script src="assets\/js\/[^"]*"><\/script>\s*/g, '');

/* --- judul & deskripsi khusus artifact --- */
html = html.replace(
  '<title>Rute — Perencana Itinerary</title>',
  '<title>Rute</title>'
);

const css = CSS.map((f) => `/* ===== ${f} ===== */\n${read(f)}`).join('\n\n');
const js = JS.map((f) => `/* ===== ${f} ===== */\n${read(f)}`).join('\n\n');

/* Ditulis SEBELUM berkas lain, karena modul membaca bendera ini
   saat dimuat, bukan saat dipanggil. */
const flag = `/* Halaman ini berjalan sebagai Claude Artifact: tanpa akses ke
   host luar, jadi peta memakai mode skematik, rute jalan sebenarnya
   dimatikan, dan penyimpanan berkas lewat kapabilitas downloads. */
window.RUTE_ARTIFACT = true;`;

/* Sisipkan CSS di </head> dan JS di </body>. Skrip tetap klasik
   (bukan modul) supaya urutan eksekusinya persis seperti di repo. */
html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
html = html.replace('</body>', `<script>\n${flag}\n</script>\n<script>\n${js}\n</script>\n</body>`);

/* Halaman artifact dibungkus ulang: <!doctype>, <head>, dan <body>
   disediakan penerbitnya, jadi kirim isi halamannya saja. */
const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!headMatch || !bodyMatch) throw new Error('index.html tidak punya <head>/<body> yang bisa dibaca');

const out = headMatch[1].trim() + '\n\n' + bodyMatch[1].trim() + '\n';

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/rute-artifact.html'), out, 'utf8');

const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`dist/rute-artifact.html  ${kb} KB`);

/* Pemeriksaan kecil: tidak boleh ada rujukan ke host luar yang
   akan diblokir CSP, dan tidak boleh ada berkas yang tertinggal. */
const leftovers = out.match(/(src|href)="(assets\/|https?:\/\/)[^"]*"/g) || [];
const allowed = leftovers.filter((m) =>
  m.includes('calendar.google.com') ||
  m.includes('www.google.com/maps') ||
  m.includes('openstreetmap.org/copyright')
);
const blocked = leftovers.filter((m) => !allowed.includes(m));
if (blocked.length) {
  console.error('PERINGATAN — rujukan yang akan diblokir CSP:');
  blocked.forEach((m) => console.error('  ' + m));
  process.exitCode = 1;
} else {
  console.log(`ok — tidak ada sumber daya eksternal (${allowed.length} tautan keluar, semuanya navigasi)`);
}
