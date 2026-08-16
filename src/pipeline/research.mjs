import { ask } from '../claude.mjs';
import { usedTopics } from '../store.mjs';
import { logger } from '../log.mjs';

const log = logger('riset');

/**
 * Topic research.
 *
 * Freshness here is enforced two ways, because asking a model for "something
 * fresh" is not a guarantee. First, we rotate through angle archetypes so the
 * same product yields structurally different stories. Second, we pass the full
 * history of already-used titles into the prompt AND filter the result against
 * it afterwards, so a repeat cannot slip through even if the model ignores the
 * instruction.
 */

export const CATEGORIES = {
  fnb: {
    id: 'fnb',
    label: 'Makanan & Minuman',
    lens: 'sejarah pangan, ritual minum, jalur perdagangan rempah, sains rasa, dan bagaimana satu bahan mengubah kebiasaan sebuah bangsa',
  },
  fashion: {
    id: 'fashion',
    label: 'Fashion',
    lens: 'sejarah busana, evolusi bentuk tas dan sepatu, kriya kulit dan tekstil, perubahan sosial yang tercermin di pakaian, dan ekonomi di balik sebuah merek',
  },
};

/**
 * Angle archetypes. Each one forces a genuinely different story shape, which is
 * what keeps a channel from feeling repetitive after ten uploads.
 */
export const ANGLES = [
  { id: 'asal-usul', label: 'Asal-usul', brief: 'Dari mana benda ini sebenarnya berasal, dan kenapa ceritanya beda dari yang orang kira.' },
  { id: 'kecelakaan', label: 'Ketidaksengajaan', brief: 'Penemuan yang lahir dari kesalahan, kegagalan, atau kebetulan.' },
  { id: 'perang-krisis', label: 'Krisis', brief: 'Bagaimana perang, wabah, atau krisis ekonomi mengubah bentuk benda ini selamanya.' },
  { id: 'kelas-sosial', label: 'Kelas sosial', brief: 'Benda ini pernah jadi penanda status, lalu berpindah tangan ke semua orang. Kenapa?' },
  { id: 'sains', label: 'Sains di baliknya', brief: 'Penjelasan ilmiah yang bikin orang lihat benda sehari-hari dengan cara baru.' },
  { id: 'mitos', label: 'Mitos yang keliru', brief: 'Satu hal yang hampir semua orang percaya tentang ini, dan ternyata salah.' },
  { id: 'perajin', label: 'Tangan perajin', brief: 'Proses pembuatan yang rumit dan tidak terlihat oleh pembeli.' },
  { id: 'ekonomi', label: 'Ekonomi tersembunyi', brief: 'Angka, rantai pasok, dan siapa yang sebenarnya untung.' },
  { id: 'perjalanan', label: 'Rute perjalanan', brief: 'Perjalanan geografis benda ini dari satu benua ke benua lain.' },
  { id: 'nusantara', label: 'Jejak Nusantara', brief: 'Bagaimana benda ini masuk dan berubah di Indonesia, dan apa versi lokalnya.' },
  { id: 'ritual', label: 'Ritual & kebiasaan', brief: 'Kebiasaan atau upacara yang tumbuh di sekitar benda ini.' },
  { id: 'desain', label: 'Kenapa bentuknya begitu', brief: 'Alasan fungsional di balik bentuk yang sekarang dianggap wajar.' },
];

const TOPIC_SCHEMA = {
  type: 'object',
  properties: {
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Judul kerja, bahasa Indonesia, maksimal 60 karakter' },
          angle: { type: 'string', description: 'ID sudut pandang yang dipakai' },
          hook: { type: 'string', description: 'Kalimat pembuka video, maksimal 15 kata, tanpa sapaan' },
          premise: { type: 'string', description: 'Ringkasan cerita dalam 2-3 kalimat' },
          bridgeToProduct: {
            type: 'string',
            description: 'Bagaimana cerita ini menyambung ke produk tanpa terasa jualan',
          },
          factsToVerify: {
            type: 'array',
            items: { type: 'string' },
            description: 'Klaim faktual yang harus dicek kebenarannya sebelum produksi',
          },
          hookStrength: { type: 'integer', description: 'Perkiraan kekuatan hook 1-10' },
          softSellScore: {
            type: 'integer',
            description: 'Seberapa halus jualannya, 1-10. 10 = penonton tidak sadar sedang dipromosikan',
          },
          visualSubjects: {
            type: 'array',
            items: { type: 'string' },
            description: '6-10 subjek visual konkret dalam bahasa Inggris untuk generasi gambar',
          },
        },
        required: [
          'title', 'angle', 'hook', 'premise', 'bridgeToProduct',
          'factsToVerify', 'hookStrength', 'softSellScore', 'visualSubjects',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['topics'],
  additionalProperties: false,
};

const SYSTEM = `Kamu periset konten untuk kanal video dokumenter pendek berbahasa Indonesia bergaya Vox.

Prinsip kerja:
- Cerita dulu, produk belakangan. Penonton datang untuk ceritanya, bukan untuk produknya.
- Sudut pandang harus spesifik dan tidak umum. "Sejarah kopi" itu buruk. "Kenapa cangkir kopi Turki tidak punya pegangan" itu bagus.
- Fakta harus bisa dicek. Jangan mengarang angka, tanggal, atau nama.
- Bahasa Indonesia baku yang enak didengar, bukan terjemahan kaku dari Inggris.
- Hindari sudut pandang yang sudah terlalu sering dibahas kreator lain.

Kamu TIDAK boleh mengusulkan topik yang menyerupai judul yang sudah dipakai.`;

export async function researchTopics({
  category,
  product,
  brand,
  produk = null,
  count = 6,
  audience = 'dewasa muda Indonesia, 20-35 tahun',
  projectId,
}) {
  const cat = CATEGORIES[category];
  if (!cat) throw new Error(`Kategori tidak dikenal: ${category}`);

  const history = usedTopics()
    .filter((t) => t.category === category)
    .slice(0, 60);

  // Rotate the angle pool so consecutive research runs start from a different
  // place even when the product is identical.
  const offset = history.length % ANGLES.length;
  const rotated = [...ANGLES.slice(offset), ...ANGLES.slice(0, offset)];

  // What the photo showed, when there was a photo. Research written from the
  // product name alone is research about a category — it would fit anyone's
  // bag. These lines are what tie the story to this specific object.
  const dariFoto = produk
    ? [
        '',
        'DARI FOTO PRODUK YANG DIUNGGAH:',
        `- Jenis: ${produk.jenis}`,
        `- Bahan: ${produk.bahan}`,
        `- Warna: ${produk.warna}`,
        `- Gaya: ${produk.gaya}`,
        `- Ciri yang terlihat: ${produk.ciri.join('; ')}`,
        `- Pembeli yang paling mungkin: ${produk.pembeli}`,
        '',
        'Sudut cerita yang sudah diusulkan dari foto itu:',
        produk.sudutCerita.map((a) => `- ${a.judul} — ${a.kenapaNyambung}`).join('\n'),
        '',
        'Topik yang kamu usulkan HARUS tersambung ke ciri yang benar-benar terlihat di foto,',
        'bukan ke kategori produknya secara umum.',
      ].join('\n')
    : '';

  const prompt = [
    `Produk yang akan dipromosikan secara halus: ${product}`,
    brand ? `Merek: ${brand}` : '',
    dariFoto,
    `Kategori: ${cat.label}`,
    `Lensa penceritaan: ${cat.lens}`,
    `Target penonton: ${audience}`,
    '',
    `Usulkan ${count} topik video. Tiap topik WAJIB memakai sudut pandang berbeda dari daftar ini:`,
    rotated.slice(0, count + 3).map((a) => `- ${a.id}: ${a.label} — ${a.brief}`).join('\n'),
    '',
    history.length
      ? `Judul yang SUDAH PERNAH dipakai (dilarang mirip):\n${history.map((t) => `- ${t.title}`).join('\n')}`
      : 'Belum ada judul yang pernah dipakai.',
    '',
    'Untuk setiap topik, isi "visualSubjects" dengan subjek visual konkret dalam BAHASA INGGRIS',
    '(karena dipakai untuk generasi gambar). Contoh: "antique leather satchel on dark background",',
    '"1920s Parisian street with horse carriage". Jangan pernah menyebut merek di visualSubjects.',
    '',
    'Isi "factsToVerify" dengan klaim yang perlu dicek — tanggal, angka, nama tokoh, tempat.',
  ]
    .filter(Boolean)
    .join('\n');

  log.info(`Meriset ${count} topik untuk "${product}"`, { category, riwayat: history.length });

  const result = await ask({
    system: SYSTEM,
    prompt,
    schema: TOPIC_SCHEMA,
    projectId,
    note: 'riset-topik',
    effort: 'high',
  });

  // Belt and braces: filter anything that resembles a used title even if the
  // model ignored the instruction.
  const usedTitles = new Set(history.map((t) => normalizeTitle(t.title)));
  const fresh = result.topics.filter((t) => {
    const key = normalizeTitle(t.title);
    if (usedTitles.has(key)) {
      log.warn(`Topik diulang, dibuang: ${t.title}`);
      return false;
    }
    return true;
  });

  return fresh
    .map((t) => ({ ...t, category, product, brand: brand || null }))
    .sort((a, b) => b.hookStrength + b.softSellScore - (a.hookStrength + a.softSellScore));
}

function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .sort()
    .join(' ');
}
