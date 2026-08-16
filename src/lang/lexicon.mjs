/**
 * Indonesian pronunciation hazards for text-to-speech.
 *
 * The single biggest source of "slip of tongue" in Indonesian TTS is the letter
 * <e>, which spells two different vowels that orthography does not distinguish:
 *
 *   - pepet  /ə/  as in b(e)ras, k(e)cil, s(e)nang
 *   - taling /e/  as in m(e)ja, sat(e), k(e)ren
 *
 * A multilingual engine guesses, and guesses wrong on the less frequent word of
 * each pair. We cannot feed IPA to the engine, but we *can* respell the word so
 * the guess lands correctly, and we can refuse to ship a script whose meaning
 * flips on a wrong guess.
 */

/** Words where <e> is taling /e/ and engines commonly default to pepet. */
export const TALING_WORDS = new Set([
  'becak', 'bebek', 'boleh', 'cewek', 'cowok', 'ember', 'enak', 'esok',
  'gede', 'jelek', 'kaget', 'keju', 'kelek', 'keren', 'keset', 'lele',
  'leher', 'meja', 'memek', 'nenek', 'oleh', 'pede', 'pepaya', 'peka',
  'rendeng', 'sate', 'sore', 'tante', 'teh', 'teko', 'tempe', 'toge',
  'nampak', 'becek', 'eksis', 'elok', 'gesek', 'kelereng', 'lemper',
  'metode', 'nomor', 'objek', 'efek', 'era', 'estetika', 'etika',
]);

/** Words where <e> is pepet /ə/ and engines commonly over-articulate it. */
export const PEPET_WORDS = new Set([
  'belas', 'benang', 'berani', 'beras', 'berat', 'besar', 'bersih',
  'demam', 'empat', 'enam', 'gelas', 'gemar', 'genap', 'gerak',
  'kemarin', 'kenal', 'kepala', 'kera', 'keras', 'kecil', 'kelas',
  'lembut', 'lemah', 'melar', 'menang', 'penuh', 'perut', 'pedas',
  'sebut', 'sedang', 'sedikit', 'segar', 'selalu', 'sempat', 'senang',
  'sepi', 'serat', 'tebal', 'tempat', 'tetap', 'temu', 'benar',
]);

/**
 * True homographs: same spelling, different vowel, different meaning.
 * These are the ones that can actually make a sentence say the wrong thing, so
 * the linter treats them as blocking unless the writer disambiguates.
 */
export const HOMOGRAPHS = [
  { word: 'apel', senses: ['buah apel (/apəl/)', 'upacara apel (/apel/)'], hint: 'Ganti jadi "buah apel" atau "apel pagi".' },
  { word: 'mental', senses: ['terpental (/məntal/)', 'psikologis (/mental/)'], hint: 'Ganti jadi "terpental" atau "kondisi psikis".' },
  { word: 'seret', senses: ['menarik (/sərét/)', 'suara serak (/seret/)'], hint: 'Ganti jadi "menyeret" atau "tersendat".' },
  { word: 'teras', senses: ['inti kayu (/təras/)', 'beranda (/teras/)'], hint: 'Ganti jadi "beranda" atau "inti".' },
  { word: 'kecap', senses: ['saus kedelai (/kəcap/)', 'mengecap rasa (/kecap/)'], hint: 'Ganti jadi "kecap manis" atau "mengecap".' },
  { word: 'per', senses: ['pegas (/pər/)', 'setiap (/per/)'], hint: 'Ganti "per" jadi "setiap" atau "pegas".' },
  { word: 'serang', senses: ['menyerang (/sərang/)', 'kota Serang (/serang/)'], hint: 'Pakai "menyerang" atau "Kota Serang".' },
  { word: 'semi', senses: ['setengah (/səmi/)', 'musim semi (/semi/)'], hint: 'Tulis "musim semi" atau "semi-formal" dengan konteks jelas.' },
  { word: 'beruang', senses: ['hewan beruang', 'ber-uang / punya uang'], hint: 'Ganti jadi "punya uang" kalau maksudnya kaya.' },
  { word: 'memerah', senses: ['jadi merah', 'memerah susu'], hint: 'Ganti jadi "berubah merah" atau "memerah susu".' },
  { word: 'tahu', senses: ['mengetahui', 'makanan tahu'], hint: 'Ganti jadi "mengetahui" kalau bukan makanan.' },
  { word: 'sedan', senses: ['mobil sedan', 'isak tangis'], hint: 'Tulis "mobil sedan" biar jelas.' },
];

/**
 * Indonesian letter names for spelling out acronyms. Feeding "AI" to an engine
 * gets you the Indonesian word "ai"; feeding "a-i" gets you the letters.
 */
export const LETTER_NAMES = {
  A: 'a', B: 'be', C: 'ce', D: 'de', E: 'e', F: 'ef', G: 'ge',
  H: 'ha', I: 'i', J: 'je', K: 'ka', L: 'el', M: 'em', N: 'en',
  O: 'o', P: 'pe', Q: 'ki', R: 'er', S: 'es', T: 'te', U: 'u',
  V: 've', W: 'we', X: 'eks', Y: 'ye', Z: 'zet',
};

/**
 * Acronyms Indonesians pronounce as a word, not letter by letter. These must be
 * left alone — spelling "SIM" as "es-i-em" would be wrong.
 */
export const WORD_ACRONYMS = new Set([
  'SIM', 'ATM', 'UMKM', 'PIN', 'SIUP', 'NIK', 'ASI', 'AC', 'HP',
]);

/**
 * English loanwords that trigger mid-sentence code-switching. The engine flips
 * to an English accent for one word and back, which is the most audible "this is
 * AI" tell in Indonesian dubbing. Each maps to a natural Indonesian equivalent.
 */
export const LOANWORD_SWAPS = {
  brand: 'merek',
  fashion: 'busana',
  trend: 'tren',
  trending: 'sedang tren',
  style: 'gaya',
  design: 'desain',
  designer: 'perancang',
  quality: 'kualitas',
  premium: 'premium',
  luxury: 'mewah',
  vintage: 'vintage',
  classic: 'klasik',
  modern: 'modern',
  history: 'sejarah',
  story: 'kisah',
  content: 'konten',
  product: 'produk',
  customer: 'pelanggan',
  market: 'pasar',
  business: 'bisnis',
  taste: 'rasa',
  flavour: 'rasa',
  flavor: 'rasa',
  recipe: 'resep',
  ingredient: 'bahan',
  texture: 'tekstur',
  aroma: 'aroma',
  process: 'proses',
  culture: 'budaya',
  tradition: 'tradisi',
  generation: 'generasi',
  century: 'abad',
  secret: 'rahasia',
  original: 'asli',
  authentic: 'otentik',
  handmade: 'buatan tangan',
  craftsmanship: 'kriya',
  leather: 'kulit',
  fabric: 'kain',
  pattern: 'motif',
  colour: 'warna',
  color: 'warna',
};

/**
 * Terms that stay in English because the Indonesian equivalent is unnatural or
 * nonexistent. The linter must not flag these.
 */
export const ALLOWED_ENGLISH = new Set([
  'matcha', 'latte', 'espresso', 'croissant', 'dessert', 'brunch',
  'tote', 'clutch', 'blazer', 'denim', 'jeans', 'kimono', 'batik',
  'sophie', 'martin', 'paris', 'milan', 'tokyo', 'kyoto', 'london',
  'instagram', 'tiktok', 'online', 'offline',
]);

/**
 * Multi-syllable words that reliably trip TTS prosody in Indonesian. Not wrong
 * to use, but each one is a risk we surface so the writer can choose.
 */
export const HARD_WORDS = new Set([
  'mempertanggungjawabkan', 'keberlangsungan', 'ketidakpastian',
  'mengimplementasikan', 'menginternalisasi', 'kesinambungan',
  'penyelenggaraan', 'pertanggungjawaban', 'menyelenggarakan',
  'mengklasifikasikan', 'mempersembahkan', 'berkesinambungan',
]);

/** Strip affixes so lexicon lookups still match inflected forms. */
export function stripAffixes(word) {
  let w = word.toLowerCase();
  w = w.replace(/^(me|mem|men|meng|meny|ber|ter|pe|pem|pen|peng|peny|di|ke|se)/, '');
  w = w.replace(/(kan|an|i|nya|lah|kah|pun)$/, '');
  return w;
}
