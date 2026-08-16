/**
 * Seed a project with representative content so the interface can be looked at
 * without spending anything.
 *
 * Every screen in this app is empty until a paid stage has filled it, which
 * makes the app impossible to evaluate before committing money to it — exactly
 * the wrong order. This writes one project straight into the store with the
 * shape a finished run produces, so the layout, the storyboard and the approval
 * gate can all be judged first.
 *
 * The content is a sample, not a real reading of a real product.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config, ensureDirs } from '../src/config.mjs';
import { newId, saveProject } from '../src/store.mjs';
import { buildStoryboard } from '../src/pipeline/storyboard.mjs';
import { lintScript } from '../src/lang/lint.mjs';

const naskah = JSON.parse(fs.readFileSync('demo/naskah.json', 'utf8'));

// In a real run the script stage writes these alongside the English prompts.
const GAMBAR_ID = [
  "Tas kurir pos kulit tahun 1890-an, melayang di latar arang gelap",
  "Interior gerbong kereta pos Prancis abad ke-19, rak surat kayu",
  "Ilustrasi paten tas kulit berkunci, garis krem di latar gelap",
  "Kertas tua dengan cetakan tali selempang yang tertekan dalam",
  "Halaman koran menguning tahun 1940-an, berlipat dan bernoda",
  "Kolase peti perbekalan perang yang kosong, garis ungu tipis",
  "Gambar teknis pola tas di kertas kalkir tua, bernoda kopi",
  "Ukiran baja abad ke-19 kantung kulit lembut, arsiran rapat",
  "Foto arsip perempuan pekerja berjalan di jalan kota tahun 1940-an",
  "Makro serat kulit dan jahitan, cahaya menyamping tajam",
  "Dinding plester pucat dengan bekas gantungan tas, retak berpatina",
  "Peta jalur dagang Paris ke Asia Tenggara, garis ungu tipis",
  "Kolase siluet tas bahu dari empat zaman, garis waktu ungu",
  "Tas selempang kulit modern melayang di latar arang gelap"
];
const slug = naskah.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const gambarDir = path.join(config.cacheDir, 'gambar', slug);

ensureDirs();
const id = newId('proj');
const workDir = path.join(config.tmpDir, id);
fs.mkdirSync(path.join(workDir, 'produk'), { recursive: true });

// Stand-in for the photo the creator would upload.
const fotoSumber = path.join(gambarDir, '00.png');
const foto = path.join(workDir, 'produk', 'foto-00.png');
if (fs.existsSync(fotoSumber)) fs.copyFileSync(fotoSumber, foto);

const teksLengkap = naskah.segmen.map((s) => s.vo).join(' ');

const project = {
  id,
  createdAt: new Date().toISOString(),
  status: 'papan-cerita',
  category: 'fashion',
  product: 'tas selempang kulit',
  brand: 'Sophie Martin',
  durationSeconds: 60,
  mode: 'collage',

  fotoProduk: fs.existsSync(foto)
    ? [{ file: foto, mediaType: 'image/png', bytes: fs.statSync(foto).size }]
    : [],

  produk: {
    jenis: 'Tas selempang kulit model satchel',
    bahan: 'Kulit sintetis dengan tekstur bermotif, gesper logam kuningan',
    warna: 'Cokelat tua dengan kilau hangat di bagian penutup',
    gaya: 'Klasik dan rapi, bukan sporty. Bentuknya kotak dengan sudut membulat.',
    pembeli:
      'Perempuan pekerja 25 sampai 35 tahun yang butuh tas muat dokumen kecil, ' +
      'tapi tidak mau terlihat seperti tas kerja.',
    ciri: [
      'Tali panjang dan tipis, dipakai menyilang dada',
      'Dua gesper depan dengan lidah kulit',
      'Penutup menutupi hampir seluruh badan tas',
      'Jahitan tepi terlihat jelas di seluruh sisi',
      'Permukaan sudah punya sedikit tanda pakai, tidak terlihat kaku',
    ],
    sudutCerita: [
      {
        judul: 'Kenapa tas selempang tidak pernah hilang dari pasaran',
        kenapaNyambung:
          'Tali menyilang dada di foto ini bentuknya sama persis dengan tas kurir pos ' +
          'abad kesembilan belas — fungsinya juga sama, membuat tangan bebas.',
      },
      {
        judul: 'Dua gesper yang awalnya bukan hiasan',
        kenapaNyambung:
          'Gesper ganda di foto ini dulunya kunci, bukan aksesori. Bentuknya bertahan ' +
          'setelah fungsinya hilang.',
      },
      {
        judul: 'Kenapa ukuran tas perempuan berubah tiap zaman',
        kenapaNyambung:
          'Ukuran tas di foto ini pas untuk telepon genggam dan dompet tipis — ukuran ' +
          'yang ditentukan oleh apa yang dibawa orang setiap hari.',
      },
    ],
    inggris: 'a classic dark brown leather crossbody satchel with twin buckles and a long thin strap',
    fotoCount: 1,
  },

  topics: [
    {
      title: naskah.judul,
      angle: 'sejarah-objek',
      hook: 'Tas selempang pertama bukan dibuat untuk gaya.',
      why: 'Menjelaskan kenapa bentuk yang dipakai sekarang bertahan seratus tahun.',
      visualSubjects: naskah.segmen.map((s) => s.gambar),
    },
  ],
  chosenTopic: { title: naskah.judul, angle: 'sejarah-objek' },

  script: {
    title: naskah.judul,
    estimatedSeconds: 58,
    segments: naskah.segmen.map((s, i) => ({
      index: i,
      voiceover: s.vo,
      ttsText: s.vo,
      onScreenText: s.layar || '',
      sfx: s.sfx || null,
      visualSubject: s.gambar,
      gambarIndonesia: GAMBAR_ID[i],
      shotType: s.shot,
    })),
    ttsLint: lintScript(teksLengkap),
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
    { stage: 'riset', status: 'riset', detail: '1 topik', at: new Date().toISOString() },
    { stage: 'naskah', status: 'naskah', detail: '14 segmen', at: new Date().toISOString() },
  ],
  workDir,
  outputFile: path.join(config.outputDir, `${id}.mp4`),
};

project.papanCerita = buildStoryboard(project);
saveProject(project);

console.log(`${id} — ${project.papanCerita.ringkasan.panelCount} panel, ` +
  `~${project.papanCerita.ringkasan.totalSeconds}s`);
