import { ask } from '../claude.mjs';
import { logger } from '../log.mjs';

const log = logger('caption');

/**
 * Post copy for the upload itself.
 *
 * Same discipline as the script: the caption carries the story, not the offer.
 * A caption that opens with a price undoes the forty seconds of soft-sell that
 * came before it.
 */

const SCHEMA = {
  type: 'object',
  properties: {
    tiktok: {
      type: 'object',
      properties: {
        caption: { type: 'string', description: 'Maksimal 150 karakter, tanpa tagar di dalamnya' },
        hashtags: { type: 'array', items: { type: 'string' }, description: '6-10 tagar tanpa tanda pagar' },
      },
      required: ['caption', 'hashtags'],
      additionalProperties: false,
    },
    instagram: {
      type: 'object',
      properties: {
        caption: { type: 'string', description: 'Boleh 3-5 baris, ada baris pembuka yang menahan scroll' },
        hashtags: { type: 'array', items: { type: 'string' } },
      },
      required: ['caption', 'hashtags'],
      additionalProperties: false,
    },
    youtubeShorts: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Maksimal 80 karakter' },
        description: { type: 'string' },
        hashtags: { type: 'array', items: { type: 'string' } },
      },
      required: ['title', 'description', 'hashtags'],
      additionalProperties: false,
    },
    pinnedComment: {
      type: 'string',
      description: 'Komentar yang di-pin. Di sinilah produk boleh disebut, dengan halus.',
    },
    altText: { type: 'string', description: 'Deskripsi aksesibilitas untuk video ini' },
  },
  required: ['tiktok', 'instagram', 'youtubeShorts', 'pinnedComment', 'altText'],
  additionalProperties: false,
};

const SYSTEM = `Kamu penulis caption media sosial berbahasa Indonesia untuk kanal dokumenter pendek.

Aturan:
- Caption melanjutkan rasa penasaran dari videonya, bukan merangkum isinya.
- DILARANG menulis "link di bio", harga, diskon, kode promo, atau ajakan beli langsung.
- DILARANG memakai bahasa iklan: "wajib punya", "buruan", "jangan sampai kehabisan".
- Baris pertama harus menahan scroll. Boleh berupa pertanyaan atau fakta lanjutan.
- Bahasa Indonesia yang wajar, boleh santai, tapi tidak alay.
- Tagar campuran: umum, niche, dan lokal Indonesia. Tanpa tanda pagar di array.
- Komentar yang di-pin boleh menyebut produk, tapi sebagai catatan kaki cerita,
  bukan sebagai penawaran. Contoh nada: "Btw tas yang muncul di detik 30 itu ..."`;

export async function writeCaptions({ script, topic, projectId }) {
  const transcript = script.segments.map((s) => s.voiceover).join(' ');

  const prompt = [
    `Judul video: ${script.title}`,
    `Topik: ${topic.title}`,
    `Premis: ${topic.premise}`,
    `Produk yang dipromosikan halus: ${topic.product}`,
    topic.brand ? `Merek: ${topic.brand}` : '',
    '',
    'Transkrip lengkap video:',
    transcript,
    '',
    'Tulis caption untuk TikTok, Instagram Reels, dan YouTube Shorts.',
    'Sertakan juga komentar yang akan di-pin, dan teks alternatif untuk aksesibilitas.',
  ]
    .filter(Boolean)
    .join('\n');

  log.info('Menulis caption untuk tiga platform');

  const result = await ask({
    system: SYSTEM,
    prompt,
    schema: SCHEMA,
    projectId,
    note: 'caption',
    effort: 'medium',
  });

  // Guard against the model slipping into ad language despite the instruction.
  const banned = /link di bio|linkinbio|buruan|diskon|promo|checkout|beli sekarang|klik/i;
  const flagged = [];
  for (const [platform, payload] of Object.entries(result)) {
    const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if (banned.test(text)) flagged.push(platform);
  }
  if (flagged.length) {
    log.warn(`Caption mengandung bahasa jualan di: ${flagged.join(', ')} — periksa manual`);
  }

  return { ...result, flagged };
}
