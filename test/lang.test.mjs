import test from 'node:test';
import assert from 'node:assert/strict';

import { integerToWords, numberToWords, ordinalToWords } from '../src/lang/numbers.mjs';
import { normalizeForTTS, splitIntoUtterances, spellAcronym } from '../src/lang/normalize.mjs';
import { lintScript, syllableCount } from '../src/lang/lint.mjs';
import { align, verifyTake, tokenize } from '../src/lang/wer.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chunkCaption, measureLoudness, probeToolchain, run } from '../src/ffmpeg.mjs';
import { planShotTypes, familyOf, HIGHLIGHT } from '../src/vox.mjs';
import { spansFromWords } from '../src/pipeline/assemble.mjs';

/* ── Numbers ───────────────────────────────────────────────────────── */

test('angka: bentuk dasar dan bentuk "se-"', () => {
  assert.equal(integerToWords(0), 'nol');
  assert.equal(integerToWords(10), 'sepuluh');
  assert.equal(integerToWords(11), 'sebelas');
  assert.equal(integerToWords(12), 'dua belas');
  assert.equal(integerToWords(19), 'sembilan belas');
  assert.equal(integerToWords(100), 'seratus');
  assert.equal(integerToWords(200), 'dua ratus');
  assert.equal(integerToWords(1000), 'seribu');
  assert.equal(integerToWords(2000), 'dua ribu');
});

test('angka: tahun dibaca sebagai satu bilangan', () => {
  assert.equal(integerToWords(1945), 'seribu sembilan ratus empat puluh lima');
  assert.equal(integerToWords(2026), 'dua ribu dua puluh enam');
});

test('angka: skala besar', () => {
  assert.equal(integerToWords(250_000), 'dua ratus lima puluh ribu');
  assert.equal(integerToWords(1_500_000), 'satu juta lima ratus ribu');
  assert.equal(integerToWords(2_300_000_000), 'dua miliar tiga ratus juta');
});

test('angka: desimal dan urutan', () => {
  assert.equal(numberToWords(2.5), 'dua koma lima');
  assert.equal(ordinalToWords(1), 'pertama');
  assert.equal(ordinalToWords(3), 'ketiga');
});

/* ── Normalisation ─────────────────────────────────────────────────── */

test('normalisasi: mata uang tidak menelan spasi sesudahnya', () => {
  const { text } = normalizeForTTS('harga Rp250.000 dan naik');
  assert.match(text, /dua ratus lima puluh ribu rupiah dan naik/);
  assert.doesNotMatch(text, /rupiahdan/);
});

test('normalisasi: skala mata uang ikut terbaca', () => {
  const { text } = normalizeForTTS('Modalnya Rp5 juta saja.');
  assert.match(text, /lima juta rupiah saja/);
});

test('normalisasi: persen, tanggal, dekade, rentang tahun', () => {
  assert.match(normalizeForTTS('naik 70%').text, /tujuh puluh persen/);
  assert.match(normalizeForTTS('pada 17/8/1945').text, /tujuh belas Agustus seribu sembilan ratus/);
  assert.match(normalizeForTTS('era 1980-an').text, /delapan puluhan/);
  assert.match(normalizeForTTS('antara 1920-1930').text, /sampai seribu sembilan ratus tiga puluh/);
});

test('normalisasi: akronim dieja, kecuali yang dibaca sebagai kata', () => {
  assert.equal(spellAcronym('PT'), 'pe-te');
  assert.match(normalizeForTTS('PT ABC').text, /pe-te a-be-ce/);
  // ATM diucapkan sebagai kata utuh di Indonesia — jangan dieja.
  assert.match(normalizeForTTS('lewat ATM').text, /ATM/);
});

test('normalisasi: tidak menyisakan digit', () => {
  const { text } = normalizeForTTS('Tahun 1945, Rp250.000, 70%, ke-3, 1.250.000.');
  assert.doesNotMatch(text, /\d/, `masih ada digit: ${text}`);
});

test('pemecah kalimat: memisah per kalimat, bukan per kata', () => {
  const parts = splitIntoUtterances('Satu dua tiga. Empat lima enam.', 20);
  assert.equal(parts.length, 2);
  assert.equal(parts[0], 'Satu dua tiga.');
});

test('pemecah kalimat: kalimat panjang dipecah di koma', () => {
  const long = 'Tas ini lahir di Paris pada awal abad lalu, ketika para perajin kulit mulai membuat wadah kecil, dan bentuknya berubah total.';
  const parts = splitIntoUtterances(long, 12);
  assert.ok(parts.length > 1);
  for (const part of parts) {
    assert.ok(part.split(/\s+/).length <= 16, `terlalu panjang: ${part}`);
  }
});

/* ── Linter ────────────────────────────────────────────────────────── */

test('linter: naskah bersih lolos', () => {
  const result = lintScript('Tas kulit pertama dibuat untuk menyimpan surat. Bentuknya kotak dan keras.');
  assert.equal(result.ok, true);
  assert.equal(result.summary.errors, 0);
});

test('linter: homograf memblokir produksi', () => {
  const result = lintScript('Dia makan apel di pagi hari.');
  assert.equal(result.ok, false);
  assert.ok(result.findings.some((f) => f.rule === 'homograf' && f.severity === 'error'));
});

test('linter: kata kembar memblokir', () => {
  const result = lintScript('Ini sangat sangat bagus.');
  assert.ok(result.findings.some((f) => f.rule === 'kata-kembar' && f.severity === 'error'));
});

test('linter: angka mentah memblokir', () => {
  const result = lintScript('Terjadi pada tahun 1945.');
  assert.ok(result.findings.some((f) => f.rule === 'angka-mentah' && f.severity === 'error'));
});

test('linter: angka mentah dilaporkan tanpa titik akhir kalimat', () => {
  const result = lintScript('Terjadi pada tahun 1945.');
  const finding = result.findings.find((f) => f.rule === 'angka-mentah');
  assert.match(finding.message, /1945\b/);
  assert.doesNotMatch(finding.message, /1945\.\./);
});

test('linter: kalimat kepanjangan memblokir', () => {
  const long = `Kalimat ini ${'panjang '.repeat(30)}sekali.`;
  const result = lintScript(long);
  assert.ok(result.findings.some((f) => f.rule === 'kalimat-terlalu-panjang'));
});

test('linter: kata Inggris diberi peringatan beserta padanannya', () => {
  const result = lintScript('Merek ini punya brand yang kuat sekali.');
  const finding = result.findings.find((f) => f.rule === 'campur-inggris');
  assert.ok(finding);
  assert.match(finding.fix, /merek/);
});

test('linter: istilah yang memang tidak ada padanannya tidak diprotes', () => {
  const result = lintScript('Minuman matcha itu berasal dari Kyoto.');
  assert.ok(!result.findings.some((f) => f.rule === 'campur-inggris'));
});

test('hitung suku kata: tiap vokal satu suku kata', () => {
  assert.equal(syllableCount('tas'), 1);
  assert.equal(syllableCount('kulit'), 2);
  assert.equal(syllableCount('buah'), 2);
  // Vokal berdampingan tetap terpisah: pe-rem-pu-an.
  assert.equal(syllableCount('perempuan'), 4);
});

test('hitung suku kata: diftong penutup dihitung satu', () => {
  assert.equal(syllableCount('pantai'), 2); // pan-tai
  assert.equal(syllableCount('pulau'), 2); // pu-lau
  assert.equal(syllableCount('harimau'), 3); // ha-ri-mau
  // "ai" di tengah kata bukan diftong: a-ir.
  assert.equal(syllableCount('air'), 2);
});

/* ── Word Error Rate ───────────────────────────────────────────────── */

test('wer: transkripsi identik bernilai nol', () => {
  const result = verifyTake('sejarah tas dimulai di paris', 'sejarah tas dimulai di paris');
  assert.equal(result.wer, 0);
  assert.equal(result.ok, true);
});

test('wer: tanda baca dan huruf besar diabaikan', () => {
  const result = verifyTake('Sejarah tas, dimulai di Paris.', 'sejarah tas dimulai di paris');
  assert.equal(result.wer, 0);
});

test('wer: satu kata salah baca terdeteksi dan dilaporkan', () => {
  const result = verifyTake('sejarah tas sophie martin dimulai', 'sejarah tas sopi martin dimulai', 0.05);
  assert.equal(result.ok, false);
  assert.equal(result.counts.substitute, 1);
  const mismatch = result.mismatches[0];
  assert.equal(mismatch.expected, 'sophie');
  assert.equal(mismatch.heard, 'sopi');
});

test('wer: kata yang hilang dan kata berlebih terdeteksi', () => {
  assert.equal(align('satu dua tiga', 'satu tiga').counts.delete, 1);
  assert.equal(align('satu tiga', 'satu dua tiga').counts.insert, 1);
});

test('wer: naskah kosong tidak membagi dengan nol', () => {
  assert.equal(align('', '').wer, 0);
  assert.equal(align('', 'ada suara').wer, 1);
});

test('wer: tokenisasi membuang tanda baca', () => {
  assert.deepEqual(tokenize('Halo, dunia!'), ['halo', 'dunia']);
});

/* ── Captions ──────────────────────────────────────────────────────── */

test('takarir: kalimat panjang dipecah, tidak dipotong', () => {
  const text = 'Tas ini lahir bukan di butik mewah, tapi di gudang kereta yang dingin.';
  const chunks = chunkCaption(text, 28, 2);
  const rejoined = chunks.join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(rejoined, text, 'tidak boleh ada kata yang hilang dari takarir');
  assert.ok(chunks.length > 1);
});

test('takarir: tiap baris menghormati batas karakter', () => {
  const chunks = chunkCaption('kata '.repeat(40).trim(), 28, 2);
  for (const chunk of chunks) {
    for (const line of chunk.split('\n')) {
      assert.ok(line.length <= 28, `baris kepanjangan: ${line}`);
    }
    assert.ok(chunk.split('\n').length <= 2);
  }
});

/* ── Vox style: two background families ────────────────────────────── */

test('rencana shot: keluarga latar berganti, tidak gelap terus', () => {
  const plan = planShotTypes(24);
  const families = plan.map(familyOf);
  assert.ok(families.includes('dark'), 'harus ada shot latar gelap');
  assert.ok(families.includes('light'), 'harus ada shot latar terang');
});

test('rencana shot: tidak ada arketipe kembar berurutan', () => {
  const plan = planShotTypes(40);
  for (let i = 1; i < plan.length; i += 1) {
    assert.notEqual(plan[i], plan[i - 1], `arketipe kembar di posisi ${i}`);
  }
});

test('rencana shot: pergantian keluarga mengikuti runLength', () => {
  const plan = planShotTypes(12, { runLength: 3 });
  const families = plan.map(familyOf);
  // Tiga shot pertama satu keluarga, tiga berikutnya keluarga lain.
  assert.equal(new Set(families.slice(0, 3)).size, 1);
  assert.notEqual(families[0], families[3]);
});

test('stabilo: warna diambil dari color picker referensi kedua', () => {
  assert.equal(HIGHLIGHT.yellow, '#FFF70F');
  assert.ok(HIGHLIGHT.sweepMs > 0, 'sapuan harus punya durasi, bukan muncul mendadak');
});

/* ── Pengukuran audio ──────────────────────────────────────────────── */

test('loudness dibaca dari blok ringkasan, bukan baris progres', async (t) => {
  const tool = await probeToolchain();
  if (!tool.ok) return t.skip('ffmpeg tidak tersedia');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'naratif-'));
  const file = path.join(dir, 'nada.wav');
  try {
    // Nada 3 detik pada -20 dBFS. ebur128 mencetak "I: -70.0 LUFS" di
    // baris-baris awal sebelum cukup audio terukur; kalau parser mengambil
    // kecocokan pertama, hasilnya -70 dan QC memberi peringatan palsu.
    await run(['-hide_banner', '-y', '-f', 'lavfi',
      '-i', 'sine=frequency=440:duration=3,volume=-20dB', '-ar', '48000', file]);

    const m = await measureLoudness(file);
    assert.ok(m.lufs !== null, 'loudness harus terbaca');
    assert.ok(m.lufs > -60, `terbaca ${m.lufs} LUFS — parser mengambil baris progres, bukan ringkasan`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('linter: kata ulang berhubung tidak dianggap kata kembar', () => {
  // Reduplikasi adalah pembentukan kata yang normal, bukan gagap.
  for (const kalimat of [
    'Dia benar-benar pergi.',
    'Anak-anak bermain di halaman.',
    'Tiba-tiba lampunya padam.',
    'Hati-hati di jalan.',
  ]) {
    const r = lintScript(kalimat);
    assert.ok(
      !r.findings.some((f) => f.rule === 'kata-kembar'),
      `salah tandai kata ulang: ${kalimat}`,
    );
  }
});

test('linter: gagap sungguhan tanpa tanda hubung tetap ditolak', () => {
  const r = lintScript('Ini sangat sangat bagus.');
  assert.ok(r.findings.some((f) => f.rule === 'kata-kembar' && f.severity === 'error'));
});

/* ── Captions: clause breaks and word-timed spans ───────────────────── */

test('takarir: pecah di batas klausa, bukan di tengah frasa', () => {
  const text = 'Perempuan pekerja langsung menyukainya, karena tangan mereka jadi bebas.';
  const chunks = chunkCaption(text, 28, 2);
  assert.equal(chunks.length, 2);
  // Kartu pertama harus berhenti di koma, bukan menggantung di "karena".
  assert.ok(chunks[0].replace(/\n/g, ' ').endsWith('menyukainya,'), chunks[0]);
  assert.ok(chunks[1].replace(/\n/g, ' ').startsWith('karena'), chunks[1]);
});

test('takarir: klausa yang lebih panjang dari satu kartu tetap utuh', () => {
  const text = 'kata '.repeat(30).trim(); // tanpa tanda baca sama sekali
  const chunks = chunkCaption(text, 28, 2);
  const rejoined = chunks.join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(rejoined, text);
});

test('takarir: rentang waktu diambil dari batas kata sungguhan', () => {
  const entry = {
    duration: 4.0,
    words: [
      { text: 'Satu', start: 0.0, duration: 0.4 },
      { text: 'dua', start: 0.5, duration: 0.4 },
      { text: 'tiga', start: 1.0, duration: 0.5 },
      { text: 'empat', start: 2.0, duration: 0.6 },
    ],
  };
  const spans = spansFromWords(['Satu dua tiga,', 'empat.'], entry);
  // Kartu pertama berakhir saat kata "tiga" selesai diucapkan (1.0 + 0.5).
  assert.equal(Math.round(spans[0] * 1000), 1500);
  // Kartu terakhir selalu sampai ujung audio, bukan ujung kata terakhir.
  assert.equal(Math.round((spans[0] + spans[1]) * 1000), 4000);
});

test('takarir: jumlah kata tidak cocok maka mundur ke perkiraan', () => {
  const entry = { duration: 3, words: [{ text: 'Satu', start: 0, duration: 0.4 }] };
  // Dua kata di takarir, satu kata dilaporkan mesin: timing tidak bisa dipercaya.
  assert.equal(spansFromWords(['Satu dua'], entry), null);
  assert.equal(spansFromWords(['Satu'], { duration: 3, words: [] }), null);
});
