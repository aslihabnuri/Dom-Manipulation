/**
 * The Sophie Martin tote, taken as far as the storyboard and no further.
 *
 * Stands in for the research and scripting stages on a machine with no
 * Anthropic key: the reading of the photo and the script were produced by hand
 * in exactly the shape those stages emit, so the storyboard, the gate and the
 * render all behave as they would on a real run.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../src/config.mjs';
import { newId, saveProject } from '../src/store.mjs';
import { buildStoryboard } from '../src/pipeline/storyboard.mjs';
import { lintScript } from '../src/lang/lint.mjs';

// Optional: the storyboard is reviewable without the photo file, because the
// reading of the product has already happened. The file is only needed at
// render time, for the two panels that show the bag itself.
const FOTO = process.argv[2] && fs.existsSync(process.argv[2]) ? process.argv[2] : null;

/**
 * The narration.
 *
 * Nylon is the story because nylon is what the bag is made of, and its history
 * is genuinely strange: a laboratory polymer sold as stockings, requisitioned
 * for parachutes, then left over in warehouses after the war and sewn into
 * everyday things. The soft sell is that the ending explains the product's own
 * properties — light, water-resistant, folds flat — without ever recommending
 * it.
 */
const SEGMEN = [
  { vo: 'Kain di tas ini awalnya dibuat untuk payung terjun.',
    layar: 'Payung terjun', sfx: 'whoosh', shot: 'objectOnVoid', fotoProduk: true,
    en: null, id: 'Foto produk kamu sendiri, tote hitam dengan pegangan kulit' },

  { vo: 'Tahun seribu sembilan ratus tiga puluh lima, sebuah laboratorium kimia menemukannya.',
    layar: '', sfx: 'click', shot: 'technicalDrawing',
    en: 'antique patent illustration of a polymer spinneret extruding fine filaments, fine cream linework on dark background, cross-section, unlabelled callout dots',
    id: 'Ilustrasi paten mesin pemintal serat, garis krem di latar gelap' },

  { vo: 'Bahan barunya lebih kuat dari sutra, dan jauh lebih murah.',
    layar: '', sfx: null, shot: 'macroTexture',
    en: 'extreme macro photograph of fine synthetic filaments beside natural silk fibres, shallow depth of field, raking side light, desaturated with faint violet in shadows',
    id: 'Makro serat sintetis bersanding dengan serat sutra, cahaya menyamping' },

  { vo: 'Mula-mula dijahit jadi kaus kaki panjang perempuan, dan langsung laris.',
    layar: 'Langsung laris', sfx: 'paper', shot: 'agedNewsprint',
    en: 'yellowed 1940s newspaper page, dense illegible columns, fold creases and foxing, torn edge, flat archival document photograph',
    id: 'Halaman koran menguning tahun 1940-an, berlipat dan bernoda' },

  { vo: 'Lalu perang pecah, dan seluruh produksinya diambil alih tentara.',
    layar: '', sfx: 'riser', shot: 'cutoutCollage',
    en: 'editorial paper cut-out collage of stacked wooden military supply crates with completely blank surfaces, torn halftone newspaper textures, thin violet connecting lines on flat dark charcoal, no printed marks',
    id: 'Kolase peti perbekalan tentara yang polos, garis ungu tipis' },

  { vo: 'Semua bahan itu dialihkan untuk payung terjun, tali, dan tenda.',
    layar: '', sfx: null, shot: 'blueprintOnPaper',
    en: 'technical construction drawing of a circular parachute canopy gore pattern on aged drafting paper, faded graphite lines, dimension arrows without numbers, coffee ring stain, taped edge',
    id: 'Gambar teknis pola payung terjun di kertas kalkir tua' },

  { vo: 'Ribuan prajurit melompat dari pesawat, menggantungkan nyawa pada kain setipis itu.',
    layar: 'Setipis itu', sfx: 'drop', shot: 'archivalPhoto',
    en: 'archival documentary photograph of dozens of parachutes descending against a pale overcast sky, grainy black and white with warm sepia cast, generous negative space, figures small and distant',
    id: 'Foto arsip puluhan payung terjun turun di langit mendung' },

  { vo: 'Perang selesai, gudang pabrik penuh, tapi tidak ada lagi yang memesan.',
    layar: '', sfx: null, shot: 'concreteWall',
    en: 'vast empty warehouse interior with pale weathered plaster walls and stacked blank fabric bolts in shadow, raking daylight from high windows, uneven grey cream tone',
    id: 'Gudang kosong berdinding plester pucat, cahaya masuk dari jendela atas' },

  { vo: 'Kain sisa perang itu lalu dijahit jadi barang sehari-hari.',
    layar: '', sfx: 'paper', shot: 'engraving',
    en: 'nineteenth century steel engraving of a sewing machine and folded fabric, dense cross-hatching in dark ink on aged paper, encyclopaedic illustration style',
    id: 'Ukiran mesin jahit dan lipatan kain, arsiran rapat di kertas tua' },

  { vo: 'Sifat yang berguna di udara, ternyata berguna juga di jalan.',
    layar: '', sfx: null, shot: 'cutoutCollage',
    en: 'editorial paper cut-out collage of a parachute canopy silhouette transforming into a soft bag silhouette across four stages, halftone archival print, torn edges, violet dotted connecting line on dark charcoal',
    id: 'Kolase siluet payung terjun berubah jadi siluet tas, garis ungu' },

  { vo: 'Ringan, tahan air, dan bisa dilipat sampai sekecil telapak tangan.',
    layar: 'Bisa dilipat', sfx: 'whoosh', shot: 'macroTexture',
    en: 'extreme macro photograph of water beading on tightly woven dark synthetic fabric, shallow depth of field, raking side light, faint violet cast in shadows',
    id: 'Makro butiran air di atas kain sintetis gelap yang rapat' },

  { vo: 'Itu sebabnya tas seperti ini muat di dalam tas lain.',
    layar: '', sfx: null, shot: 'paperTexture',
    en: 'aged cream paper sheet bearing a deep pressed impression of a folded flat fabric bag, raking side light casting real shadows in the embossed grooves, heavy paper fibre and foxing, one deep crease',
    id: 'Kertas tua dengan cetakan tas terlipat yang tertekan dalam' },

  { vo: 'Kulit di pegangannya ditambahkan belakangan, supaya tidak terlihat seperti barang tentara.',
    layar: '', sfx: 'click', shot: 'macroTexture',
    en: 'extreme macro photograph of stitched leather trim meeting woven synthetic fabric, visible thread and grain, shallow depth of field, raking side light, muted desaturated tones',
    id: 'Makro jahitan kulit bertemu kain sintetis, benang dan serat terlihat' },

  { vo: 'Dua bahan yang dulu tidak pernah bertemu, sekarang dijahit jadi satu.',
    layar: 'Dijahit jadi satu', sfx: 'drop', shot: 'objectOnVoid', fotoProduk: true,
    en: null, id: 'Foto produk kamu sendiri, sebagai penutup' },
];

const JUDUL = 'Kain Ini Awalnya Untuk Payung Terjun';

ensureDirs();
const id = newId('proj');
const workDir = path.join(config.tmpDir, id);
fs.mkdirSync(path.join(workDir, 'produk'), { recursive: true });

let foto = null;
if (FOTO) {
  foto = path.join(workDir, 'produk', `foto-00${path.extname(FOTO)}`);
  fs.copyFileSync(FOTO, foto);
}

const project = {
  id,
  createdAt: new Date().toISOString(),
  status: 'papan-cerita',
  category: 'fashion',
  product: 'tote bag nilon Sophie Martin',
  brand: 'Sophie Martin',
  durationSeconds: 60,
  mode: 'collage',

  fotoProduk: foto ? [{ file: foto, mediaType: 'image/jpeg', bytes: fs.statSync(foto).size }] : [],

  produk: {
    jenis: 'Tote bag lipat berbahan kain sintetis dengan pegangan kulit',
    bahan:
      'Badan tas dari kain sintetis tenun rapat dengan kilau halus — ciri khas nilon atau poliester. ' +
      'Pegangan, lidah penguat, dan lidah penutup dari kulit cokelat.',
    warna: 'Hitam kecokelatan pada badan, cokelat kemerahan pada bagian kulitnya',
    gaya:
      'Rapi dan tenang, bukan mencolok. Badannya lunak dan sedikit menggelembung, ' +
      'jadi bentuknya mengikuti isi, bukan memaksa isi mengikuti bentuk.',
    pembeli:
      'Perempuan yang bawa banyak barang tapi tidak mau terlihat seperti bawa tas kerja — ' +
      'kuliah, kantor, belanja, jalan-jalan, dengan satu tas yang sama.',
    ciri: [
      'Pegangan panjang sampai bahu, dari kulit yang dijahit tepinya',
      'Lidah kulit berbentuk segitiga di pangkal tiap pegangan',
      'Kancing logam kecil berlogo di tengah bagian depan',
      'Penutup kulit dengan kancing di sisi atas, bisa dilipat ke dalam',
      'Ritsleting memanjang di bibir atas tas',
      'Badan melebar ke atas dan menyempit ke bawah, khas tas lipat',
      'Kain badannya berkerut halus, tanda bahannya lentur dan ringan',
    ],
    sudutCerita: [
      {
        judul: 'Kain ini awalnya dibuat untuk payung terjun',
        kenapaNyambung:
          'Kain sintetis tenun rapat di badan tas ini adalah keturunan langsung dari bahan ' +
          'payung terjun perang dunia kedua. Sifat yang dicari di sana — ringan, kuat, ' +
          'tahan air, bisa dilipat kecil — persis sifat yang bikin tas ini laku sekarang.',
      },
      {
        judul: 'Kenapa tas mahal justru pakai bahan murah',
        kenapaNyambung:
          'Perpaduan kain sintetis dengan kulit di foto ini dulu dianggap turun kelas. ' +
          'Sekarang justru itu formula tas kelas atas yang dipakai sehari-hari.',
      },
      {
        judul: 'Sejarah tas yang bentuknya ditentukan isi, bukan rangka',
        kenapaNyambung:
          'Badan tas di foto ini tidak punya rangka — ia menggelembung mengikuti isi. ' +
          'Itu keputusan desain yang umurnya baru sekitar tujuh puluh tahun.',
      },
    ],
    inggris: 'a black woven synthetic tote bag with long stitched brown leather handles and leather corner tabs',
    fotoCount: 1,
  },

  topics: [
    {
      title: JUDUL,
      angle: 'sejarah-bahan',
      hook: SEGMEN[0].vo,
      why: 'Menjelaskan sifat produknya lewat sejarah bahannya, tanpa menyebut produknya.',
      visualSubjects: SEGMEN.map((s) => s.en).filter(Boolean),
    },
  ],
  chosenTopic: { title: JUDUL, angle: 'sejarah-bahan' },

  script: {
    title: JUDUL,
    estimatedSeconds: 55,
    segments: SEGMEN.map((s, i) => ({
      index: i,
      voiceover: s.vo,
      ttsText: s.vo,
      onScreenText: s.layar || '',
      sfx: s.sfx || null,
      visualSubject: s.en,
      gambarIndonesia: s.id,
      shotType: s.shot,
      useProductPhoto: Boolean(s.fotoProduk),
    })),
    ttsLint: lintScript(SEGMEN.map((s) => s.vo).join(' ')),
  },

  dub: null,
  visuals: null,
  video: null,
  qc: null,
  captions: null,
  papanCerita: null,
  persetujuan: null,
  stageLog: [
    { stage: 'produk', status: 'produk', detail: 'Foto terbaca', at: new Date().toISOString() },
    { stage: 'riset', status: 'riset', detail: '3 sudut cerita', at: new Date().toISOString() },
    { stage: 'naskah', status: 'naskah', detail: `${SEGMEN.length} segmen`, at: new Date().toISOString() },
  ],
  workDir,
  outputFile: path.join(config.outputDir, `${id}.mp4`),
};

project.papanCerita = buildStoryboard(project);
saveProject(project);

const r = project.papanCerita.ringkasan;
console.log(
  `${id}\n${r.panelCount} panel · ${r.shotCount} shot · ~${r.totalSeconds}s · ` +
    `${r.panelFotoProduk} panel pakai foto produk · ` +
    `pemeriksa bahasa: ${project.script.ttsLint.summary.errors} error`,
);
