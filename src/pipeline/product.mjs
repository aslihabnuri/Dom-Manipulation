import fs from 'node:fs';
import path from 'node:path';
import { ask } from '../claude.mjs';
import { logger } from '../log.mjs';

const log = logger('produk');

const MEDIA_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export function mediaTypeOf(file) {
  return MEDIA_TYPES[path.extname(file).toLowerCase()] || null;
}

export function readImage(file) {
  const mediaType = mediaTypeOf(file);
  if (!mediaType) throw new Error(`Format gambar tidak didukung: ${path.extname(file)}`);
  return { mediaType, base64: fs.readFileSync(file).toString('base64') };
}

const SCHEMA = {
  type: 'object',
  required: ['jenis', 'ciri', 'bahan', 'warna', 'gaya', 'pembeli', 'sudutCerita'],
  additionalProperties: false,
  properties: {
    jenis: { type: 'string', description: 'Jenis produk secara spesifik, dalam bahasa Indonesia' },
    ciri: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: { type: 'string' },
      description: 'Detail yang benar-benar terlihat di foto, bukan tebakan',
    },
    bahan: { type: 'string' },
    warna: { type: 'string' },
    gaya: { type: 'string', description: 'Kesan visualnya: klasik, minimalis, sporty, dan sebagainya' },
    pembeli: { type: 'string', description: 'Siapa yang paling mungkin membeli ini, dan kenapa' },
    sudutCerita: {
      type: 'array',
      minItems: 3,
      maxItems: 6,
      items: {
        type: 'object',
        required: ['judul', 'kenapaNyambung'],
        additionalProperties: false,
        properties: {
          judul: { type: 'string' },
          kenapaNyambung: {
            type: 'string',
            description: 'Hubungan ke detail produk yang terlihat di foto, disebut spesifik',
          },
        },
      },
    },
    inggris: {
      type: 'string',
      description: 'Deskripsi produk dalam bahasa Inggris untuk prompt gambar',
    },
  },
};

const SYSTEM = `Kamu membaca foto produk untuk seorang kreator konten Indonesia yang
membuat video soft-selling bergaya dokumenter.

Aturan yang tidak boleh dilanggar:
- Sebutkan hanya yang benar-benar terlihat di foto. Kalau bahannya tidak jelas, katakan tidak jelas.
- Jangan mengarang merek, harga, atau spesifikasi yang tidak terlihat.
- Sudut cerita harus tersambung ke detail yang kelihatan di foto ini, bukan ke kategori produknya
  secara umum. "Tas selempang" bukan sudut cerita; "tali lebar yang menyilang dada" bisa jadi sudut cerita.`;

/**
 * Read the product photo and describe what is actually in it.
 *
 * This is the step the whole workflow now hangs off. Writing a story before
 * looking at the product means writing about a category, and a video about a
 * category is a video about nothing — it could be selling anyone's bag. The
 * story angles it proposes have to point at something visible in this photo,
 * which is also what stops the research stage from inventing a product that
 * does not exist.
 */
export async function readProduct({ files, category, hint, projectId }) {
  if (!files?.length) throw new Error('Belum ada foto produk.');

  const images = files.map(readImage);
  const reading = await ask({
    system: SYSTEM,
    images,
    prompt:
      `Kategori: ${category}\n` +
      (hint ? `Catatan dari kreator: ${hint}\n` : '') +
      `\nLihat foto produknya, lalu jawab sesuai skema. ` +
      `Untuk sudutCerita: usulkan sudut cerita sejarah atau budaya yang bisa dipakai ` +
      `untuk video soft-selling — penonton harus tertarik pada ceritanya dulu, bukan pada produknya.`,
    schema: SCHEMA,
    effort: 'high',
    projectId,
    note: 'baca-produk',
  });

  log.info(`Produk terbaca: ${reading.jenis}`, { sudut: reading.sudutCerita.length });
  return { ...reading, fotoCount: files.length };
}
