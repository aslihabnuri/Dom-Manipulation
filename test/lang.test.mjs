import test from 'node:test';
import assert from 'node:assert/strict';

import { integerToWords, numberToWords, ordinalToWords } from '../src/lang/numbers.mjs';
import { normalizeForTTS, splitIntoUtterances, spellAcronym } from '../src/lang/normalize.mjs';
import { lintScript, syllableCount } from '../src/lang/lint.mjs';
import { align, verifyTake, tokenize } from '../src/lang/wer.mjs';
import { chunkCaption } from '../src/ffmpeg.mjs';

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
