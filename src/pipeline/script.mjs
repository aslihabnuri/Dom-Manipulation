import { ask } from '../claude.mjs';
import { lintScript } from '../lang/lint.mjs';
import { normalizeForTTS } from '../lang/normalize.mjs';
import { STRUCTURE, RHYTHM } from '../vox.mjs';
import { logger } from '../log.mjs';

const log = logger('naskah');

/**
 * Script generation with an automatic repair loop.
 *
 * The model writes, the linter judges, and any blocking finding is fed straight
 * back for a rewrite. Three rounds is enough in practice; more usually means the
 * topic itself is fighting the constraints, and failing loudly beats shipping a
 * script we know will be mispronounced.
 */

const MAX_REPAIR_ROUNDS = 3;

const SCRIPT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    segments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string', description: 'ID bagian: hook, context, turn, insight, landing' },
          voiceover: {
            type: 'string',
            description: 'Kalimat narasi bahasa Indonesia. Satu kalimat utuh, maksimal 20 kata.',
          },
          visualSubject: {
            type: 'string',
            description: 'Subjek gambar dalam BAHASA INGGRIS untuk segmen ini. Konkret dan bisa digambar.',
          },
          gambarIndonesia: {
            type: 'string',
            description:
              'Terjemahan singkat visualSubject ke bahasa Indonesia, maksimal 12 kata. ' +
              'Ini yang dibaca kreator waktu meninjau papan cerita, jadi harus jelas tanpa istilah teknis.',
          },
          onScreenText: {
            type: 'string',
            description:
              'Teks penekanan di layar, opsional. Maksimal 3 kata, tulis biasa (bukan huruf kapital semua). ' +
              'Ini akan tampil besar di tengah — di latar gelap sebagai kartu serif, di latar kertas sebagai ' +
              'sapuan stabilo kuning. Kosongkan kalau segmen ini tidak butuh penekanan.',
          },
          sfx: {
            type: 'string',
            description: 'Efek suara: none, whoosh, thud, paper, click, riser, drop',
          },
        },
        required: ['section', 'voiceover', 'visualSubject', 'gambarIndonesia', 'onScreenText', 'sfx'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'segments'],
  additionalProperties: false,
};

const SYSTEM = `Kamu penulis naskah dokumenter pendek berbahasa Indonesia, gaya Vox.

ATURAN BAHASA — ini yang paling penting, karena naskahmu akan dibaca mesin text-to-speech:
1. Bahasa Indonesia baku yang mengalir. Bukan terjemahan kaku, bukan bahasa gaul.
2. Satu kalimat maksimal 20 kata. Lebih dari itu, mesin kehabisan napas.
3. Sisipkan koma di batas frasa alami, maksimal 14 kata tanpa koma.
4. DILARANG menulis angka dengan digit. Tulis "seribu sembilan ratus empat puluh lima", bukan "1945".
5. DILARANG memakai singkatan huruf kapital seperti PT, AI, UMKM. Tulis lengkap.
6. DILARANG menyisipkan kata Inggris di tengah kalimat Indonesia. Pakai padanan Indonesia.
   Boleh dikecualikan untuk nama diri dan istilah kuliner yang memang tidak ada padanannya.
7. Hindari kata berulang berdekatan, aliterasi tiga kata beruntun, dan tumpukan bunyi desis.
8. Hindari kata bermakna ganda yang pelafalannya berbeda: apel, mental, seret, teras, kecap, per, tahu.
9. Hindari kata yang sangat panjang (tujuh suku kata atau lebih).

ATURAN CERITA:
- Kalimat pertama harus bikin orang berhenti scroll. Dilarang menyapa penonton.
  Dilarang memakai "Tahukah kamu", "Pernahkah kamu", "Halo", "Di video kali ini".
- Ceritakan sejarah, sains, atau budaya. Produk hanya boleh muncul di bagian "insight",
  itu pun sebagai contoh dari ide besarnya — bukan sebagai penawaran.
- DILARANG menulis ajakan membeli, "link di bio", harga, diskon, atau nama toko.
- Penutup harus menggema, bukan mengajak.
- Setiap segmen = satu kalimat = satu gambar. Itu ritme visualnya.

visualSubject WAJIB bahasa Inggris, konkret, dan tanpa nama merek.
gambarIndonesia WAJIB bahasa Indonesia dan singkat — itu yang dibaca kreator saat menyetujui.`;

/**
 * @param {object} options
 * @param {object} options.topic     Topic object from research
 * @param {number} options.durationSeconds Target length
 */
export async function writeScript({ topic, durationSeconds = 45, projectId, onProgress }) {
  const segmentCount = Math.max(
    12,
    Math.round(durationSeconds / RHYTHM.averageShotSeconds),
  );

  const structureBrief = STRUCTURE.map(
    (s) => `- ${s.id} (${s.label}, detik ${s.seconds[0]}-${s.seconds[1]}): ${s.goal}`,
  ).join('\n');

  const basePrompt = [
    `Judul kerja: ${topic.title}`,
    `Premis: ${topic.premise}`,
    `Kait yang diusulkan: ${topic.hook}`,
    `Jembatan ke produk: ${topic.bridgeToProduct}`,
    `Produk yang dipromosikan halus: ${topic.product}`,
    topic.brand ? `Merek: ${topic.brand}` : '',
    '',
    `Target durasi: ${durationSeconds} detik. Narasi harus mengalir tanpa jeda panjang.`,
    `Buat sekitar ${segmentCount} segmen. Satu segmen satu kalimat.`,
    '',
    'Struktur wajib:',
    structureBrief,
    '',
    'Bagi segmen ke lima bagian itu secara proporsional sesuai rentang detiknya.',
    'Isi onScreenText hanya di 3-5 segmen paling penting. Sisanya kosongkan.',
    'onScreenText paling kuat kalau berupa satu-dua kata kunci yang persis diucapkan di',
    'segmen itu — seperti penanda stabilo di buku. Bukan ringkasan, bukan judul.',
    'Isi sfx "riser" menjelang titik balik dan "drop" tepat di titik baliknya.',
  ]
    .filter(Boolean)
    .join('\n');

  let prompt = basePrompt;
  let script = null;
  let lint = null;

  for (let round = 1; round <= MAX_REPAIR_ROUNDS; round += 1) {
    onProgress?.({ stage: 'naskah', round, message: `Menulis naskah (putaran ${round})` });

    script = await ask({
      system: SYSTEM,
      prompt,
      schema: SCRIPT_SCHEMA,
      projectId,
      note: `naskah-putaran-${round}`,
      effort: 'high',
    });

    const fullText = script.segments.map((s) => s.voiceover).join(' ');
    lint = lintScript(fullText);

    log.info(
      `Putaran ${round}: ${lint.summary.errors} error, ${lint.summary.warnings} peringatan, ` +
        `~${lint.summary.estimatedSeconds} detik`,
    );
    onProgress?.({ stage: 'naskah', round, lint: lint.summary });

    if (lint.ok) break;

    if (round === MAX_REPAIR_ROUNDS) {
      log.warn('Batas perbaikan tercapai, masih ada error');
      break;
    }

    // Feed the exact findings back rather than a vague "try again".
    const blocking = lint.findings
      .filter((f) => f.severity === 'error')
      .slice(0, 12)
      .map((f) => `- [${f.rule}] "${f.context}" → ${f.message} Perbaikan: ${f.fix}`)
      .join('\n');

    prompt = [
      basePrompt,
      '',
      '--- PERBAIKAN WAJIB ---',
      'Naskah sebelumnya ditolak pemeriksa pelafalan. Masalahnya:',
      blocking,
      '',
      'Tulis ulang SELURUH naskah dengan masalah di atas diperbaiki.',
      'Pertahankan alur cerita dan jumlah segmen. Ubah hanya kalimat yang bermasalah.',
    ].join('\n');
  }

  // Normalize each line for the voice engine, keeping the readable original for
  // captions and for the operator to review.
  const segments = script.segments.map((segment, index) => {
    const normalized = normalizeForTTS(segment.voiceover);
    return {
      index,
      section: segment.section,
      voiceover: segment.voiceover,
      ttsText: normalized.text,
      normalizations: normalized.changes,
      visualSubject: segment.visualSubject,
      gambarIndonesia: segment.gambarIndonesia || null,
      onScreenText: (segment.onScreenText || '').trim(),
      sfx: segment.sfx && segment.sfx !== 'none' ? segment.sfx : null,
    };
  });

  // Re-lint the normalized text — this is what the voice engine actually reads,
  // so it is the version that has to be clean.
  const ttsLint = lintScript(segments.map((s) => s.ttsText).join(' '));

  return {
    title: script.title,
    segments,
    lint,
    ttsLint,
    wordCount: ttsLint.summary.words,
    estimatedSeconds: ttsLint.summary.estimatedSeconds,
  };
}
