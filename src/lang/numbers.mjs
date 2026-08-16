/**
 * Indonesian number → words.
 *
 * Why this exists: multilingual TTS engines routinely read "1945" in English, or
 * mangle it into digit-by-digit Indonesian. Expanding every numeral to words
 * before synthesis removes the guesswork entirely — the engine only ever sees
 * Indonesian text.
 */

const UNITS = [
  'nol',
  'satu',
  'dua',
  'tiga',
  'empat',
  'lima',
  'enam',
  'tujuh',
  'delapan',
  'sembilan',
  'sepuluh',
  'sebelas',
];

const SCALES = [
  [1e12, 'triliun'],
  [1e9, 'miliar'],
  [1e6, 'juta'],
  [1e3, 'ribu'],
];

/** Converts a non-negative integer to Indonesian words. */
export function integerToWords(n) {
  n = Math.trunc(Math.abs(n));
  if (n < 12) return UNITS[n];
  if (n < 20) return `${UNITS[n - 10]} belas`;
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const rest = n % 10;
    return `${UNITS[tens]} puluh${rest ? ` ${UNITS[rest]}` : ''}`;
  }
  if (n < 200) {
    const rest = n % 100;
    return `seratus${rest ? ` ${integerToWords(rest)}` : ''}`;
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    return `${UNITS[hundreds]} ratus${rest ? ` ${integerToWords(rest)}` : ''}`;
  }
  if (n < 2000) {
    const rest = n % 1000;
    return `seribu${rest ? ` ${integerToWords(rest)}` : ''}`;
  }
  for (const [value, name] of SCALES) {
    if (n >= value) {
      const head = Math.floor(n / value);
      const rest = n % value;
      return `${integerToWords(head)} ${name}${rest ? ` ${integerToWords(rest)}` : ''}`;
    }
  }
  return String(n);
}

/** Handles decimals: 3.5 → "tiga koma lima". */
export function numberToWords(value) {
  const negative = value < 0;
  const text = String(Math.abs(value));
  const [whole, fraction] = text.split('.');
  let out = integerToWords(Number.parseInt(whole, 10));
  if (fraction) {
    const digits = fraction
      .split('')
      .map((d) => UNITS[Number.parseInt(d, 10)])
      .join(' ');
    out += ` koma ${digits}`;
  }
  return negative ? `minus ${out}` : out;
}

/**
 * Years read as a single number ("seribu sembilan ratus empat puluh lima"),
 * which is how Indonesian narration actually says them.
 */
export function yearToWords(year) {
  return integerToWords(year);
}

/** "ke-3" → "ketiga". Ordinals 1 and 2 are irregular. */
export function ordinalToWords(n) {
  if (n === 1) return 'pertama';
  return `ke${integerToWords(n)}`;
}

/** Rp250.000 → "dua ratus lima puluh ribu rupiah" */
export function rupiahToWords(amount) {
  return `${integerToWords(amount)} rupiah`;
}

/**
 * Decades: "1980-an" → "seribu sembilan ratus delapan puluhan".
 * Also handles the shorthand "80-an" → "delapan puluhan".
 */
export function decadeToWords(n) {
  const words = integerToWords(n);
  return words.replace(/puluh$/, 'puluhan').replace(/ratus$/, 'ratusan');
}
