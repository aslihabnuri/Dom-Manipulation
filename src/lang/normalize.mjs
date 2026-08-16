import {
  integerToWords,
  numberToWords,
  ordinalToWords,
  rupiahToWords,
  decadeToWords,
  yearToWords,
} from './numbers.mjs';
import { LETTER_NAMES, WORD_ACRONYMS } from './lexicon.mjs';

/**
 * Turns a written Indonesian script into text a TTS engine can only read one
 * way. Every transformation is recorded so the UI can show exactly what was
 * changed before any money is spent on synthesis.
 *
 * Order matters: currency and percentages must be consumed before the bare
 * number rule, or "Rp250.000" degrades into three separate numbers.
 */

const MONTHS = {
  1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April', 5: 'Mei', 6: 'Juni',
  7: 'Juli', 8: 'Agustus', 9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember',
};

/** "PT" → "pe-te", so the engine says letters instead of inventing a word. */
export function spellAcronym(acronym) {
  return acronym
    .toUpperCase()
    .split('')
    .map((ch) => LETTER_NAMES[ch] || ch)
    .join('-');
}

export function normalizeForTTS(input) {
  const changes = [];
  let text = input;

  const apply = (pattern, replacer, kind) => {
    text = text.replace(pattern, (...args) => {
      const match = args[0];
      const out = replacer(...args);
      if (out !== match) changes.push({ kind, from: match, to: out });
      return out;
    });
  };

  // Currency — before generic numbers, and before thousand separators are lost.
  apply(
    /Rp\s?([\d.,]+)(?:\s+(juta|miliar|ribu|triliun))?/gi,
    (_m, digits, scale) => {
      const clean = Number.parseInt(digits.replace(/[.,]/g, ''), 10);
      if (!Number.isFinite(clean)) return _m;
      return scale
        ? `${integerToWords(clean)} ${scale.toLowerCase()} rupiah`
        : rupiahToWords(clean);
    },
    'mata-uang',
  );

  // Percentages.
  apply(/(\d+(?:[.,]\d+)?)\s?%/g, (_m, n) => {
    const value = Number.parseFloat(n.replace(',', '.'));
    return `${numberToWords(value)} persen`;
  }, 'persen');

  // Full dates: 17/8/1945 or 17-08-1945.
  apply(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/g, (_m, d, mo, y) => {
    const month = MONTHS[Number.parseInt(mo, 10)];
    if (!month) return _m;
    return `${integerToWords(Number.parseInt(d, 10))} ${month} ${yearToWords(Number.parseInt(y, 10))}`;
  }, 'tanggal');

  // Decades: "1980-an", "80-an".
  apply(/\b(\d{2,4})-an\b/g, (_m, n) => decadeToWords(Number.parseInt(n, 10)), 'dekade');

  // Ordinals: "ke-3".
  apply(/\bke-(\d+)\b/g, (_m, n) => ordinalToWords(Number.parseInt(n, 10)), 'urutan');

  // Ranges: "1920–1930" must not read as one giant number.
  apply(/\b(\d{4})\s?[–—-]\s?(\d{4})\b/g, (_m, a, b) =>
    `${yearToWords(Number.parseInt(a, 10))} sampai ${yearToWords(Number.parseInt(b, 10))}`,
  'rentang-tahun');

  // Bare four-digit years (1500–2099) read as years, not digit strings.
  apply(/\b(1[5-9]\d{2}|20\d{2})\b/g, (_m, y) => yearToWords(Number.parseInt(y, 10)), 'tahun');

  // Numbers with Indonesian thousand separators: 1.250.000
  apply(/\b\d{1,3}(?:\.\d{3})+\b/g, (m) => {
    const clean = Number.parseInt(m.replace(/\./g, ''), 10);
    return Number.isFinite(clean) ? integerToWords(clean) : m;
  }, 'angka');

  // Decimals written the Indonesian way: 3,5
  apply(/\b(\d+),(\d+)\b/g, (_m, a, b) => numberToWords(Number.parseFloat(`${a}.${b}`)), 'desimal');

  // Any remaining bare integers.
  apply(/\b\d+\b/g, (m) => integerToWords(Number.parseInt(m, 10)), 'angka');

  // Acronyms: 2+ capitals. Skip the ones Indonesians read as a word.
  apply(/\b[A-Z]{2,6}\b/g, (m) => (WORD_ACRONYMS.has(m) ? m : spellAcronym(m)), 'akronim');

  // Symbols that engines either skip or read in English.
  const SYMBOLS = [
    [/&/g, ' dan '],
    [/\+/g, ' plus '],
    [/@/g, ' at '],
    [/°C/g, ' derajat celsius'],
    [/(\s)\/(\s)/g, '$1garis miring$2'],
  ];
  for (const [pattern, replacement] of SYMBOLS) {
    apply(pattern, () => replacement, 'simbol');
  }

  // Collapse whitespace introduced by the substitutions above.
  text = text.replace(/[ \t]{2,}/g, ' ').replace(/ ([,.!?;:])/g, '$1').trim();

  return { text, changes };
}

/**
 * Splits a paragraph into TTS-sized sentences. Long sentences are where engines
 * run out of breath and speed up, so we cap them and split on the nearest comma.
 */
export function splitIntoUtterances(text, maxWords = 20) {
  const sentences = (text.match(/[^.!?]+[.!?]*/g) || [text])
    .map((s) => s.trim())
    .filter(Boolean);

  const out = [];
  for (const sentence of sentences) {
    if (sentence.split(/\s+/).length <= maxWords) {
      out.push(sentence);
      continue;
    }
    // Too long — break at commas, accumulating until the cap.
    const parts = sentence.split(/,\s*/);
    let buffer = '';
    for (const part of parts) {
      const candidate = buffer ? `${buffer}, ${part}` : part;
      if (candidate.split(/\s+/).length > maxWords && buffer) {
        out.push(buffer.endsWith(',') ? buffer : `${buffer},`);
        buffer = part;
      } else {
        buffer = candidate;
      }
    }
    if (buffer) out.push(buffer);
  }
  return out;
}
