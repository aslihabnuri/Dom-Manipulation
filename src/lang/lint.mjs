import {
  HOMOGRAPHS,
  LOANWORD_SWAPS,
  ALLOWED_ENGLISH,
  HARD_WORDS,
  TALING_WORDS,
  PEPET_WORDS,
  stripAffixes,
} from './lexicon.mjs';

/**
 * Pre-flight check for an Indonesian voice-over script.
 *
 * This is the gate that makes one-shot production affordable. Text and speech
 * are cheap; video is not. Every defect caught here costs a few cents to fix,
 * and the same defect caught after rendering costs a whole re-render.
 *
 * Severity contract:
 *   error → blocks production. The line will very likely be mispronounced or
 *           will change meaning.
 *   warn  → allowed through, surfaced to the writer.
 *   info  → stylistic note.
 */

const MAX_WORDS_PER_SENTENCE = 22;
const MAX_WORDS_WITHOUT_COMMA = 14;
const MAX_SIBILANTS_PER_SENTENCE = 9;

function sentencesOf(text) {
  return (text.match(/[^.!?]+[.!?]*/g) || [text]).map((s) => s.trim()).filter(Boolean);
}

function wordsOf(text) {
  return text.toLowerCase().match(/[a-zà-ÿ']+/g) || [];
}

/**
 * Syllable count for Indonesian.
 *
 * Every vowel is its own nucleus — adjacent vowels are normally separate
 * syllables (pe-rem-pu-an, bu-ah, sa-at), unlike English. The exceptions are the
 * true diphthongs `ai`, `au`, `oi`, and only when they close the word
 * (pan-tai, pu-lau); word-internally the same letters split again (a-ir).
 */
export function syllableCount(word) {
  const lower = word.toLowerCase();
  const vowels = lower.match(/[aiueo]/g);
  if (!vowels) return 1;
  const closingDiphthong = /(ai|au|oi)$/.test(lower) ? 1 : 0;
  return Math.max(1, vowels.length - closingDiphthong);
}

export function lintScript(script) {
  const findings = [];
  const add = (severity, rule, message, context, fix) =>
    findings.push({ severity, rule, message, context, fix });

  const sentences = sentencesOf(script);

  /* ── Sentence-level checks ──────────────────────────────────────────── */
  for (const sentence of sentences) {
    const words = wordsOf(sentence);
    if (!words.length) continue;

    if (words.length > MAX_WORDS_PER_SENTENCE) {
      add(
        'error',
        'kalimat-terlalu-panjang',
        `Kalimat ${words.length} kata. Mesin TTS kehabisan napas dan mempercepat tempo di kalimat sepanjang ini.`,
        sentence,
        `Pecah jadi dua kalimat, maksimal ${MAX_WORDS_PER_SENTENCE} kata.`,
      );
    }

    // A long run without a comma gives the engine nowhere to breathe.
    for (const chunk of sentence.split(/,/)) {
      const chunkWords = wordsOf(chunk);
      if (chunkWords.length > MAX_WORDS_WITHOUT_COMMA) {
        add(
          'warn',
          'tanpa-jeda',
          `${chunkWords.length} kata beruntun tanpa koma — intonasi jadi datar dan buru-buru.`,
          chunk.trim(),
          'Sisipkan koma di batas frasa alami.',
        );
      }
    }

    // Sibilant pile-up is the classic Indonesian tongue-twister failure.
    const sibilants = (sentence.match(/\b\w*[sszc]\w*\b/gi) || []).length;
    if (sibilants > MAX_SIBILANTS_PER_SENTENCE) {
      add(
        'warn',
        'desis-menumpuk',
        `${sibilants} kata mengandung bunyi desis dalam satu kalimat — rawan cadel.`,
        sentence,
        'Ganti sebagian kata dengan sinonim tanpa huruf s/c/z.',
      );
    }

    // Alliteration of 3+ consecutive words is a genuine trip hazard.
    let run = 1;
    for (let i = 1; i < words.length; i += 1) {
      if (words[i][0] === words[i - 1][0]) {
        run += 1;
        if (run >= 3) {
          add(
            'warn',
            'aliterasi',
            `Tiga kata berurutan berawalan "${words[i][0]}" — mesin TTS cenderung menggabungkannya.`,
            words.slice(i - 2, i + 1).join(' '),
            'Sisipkan kata lain atau ganti salah satu.',
          );
          run = 1;
        }
      } else {
        run = 1;
      }
    }

    // Identical adjacent words ("yang yang") make the engine stutter.
    for (let i = 1; i < words.length; i += 1) {
      if (words[i] === words[i - 1] && words[i].length > 2) {
        add(
          'error',
          'kata-kembar',
          `Kata "${words[i]}" muncul dua kali berturut-turut.`,
          sentence,
          'Hapus salah satu.',
        );
      }
    }
  }

  /* ── Word-level checks ──────────────────────────────────────────────── */
  const allWords = wordsOf(script);

  for (const word of new Set(allWords)) {
    // True homographs can flip the meaning of the sentence — always blocking.
    const homograph = HOMOGRAPHS.find((h) => h.word === word);
    if (homograph) {
      add(
        'error',
        'homograf',
        `"${word}" punya dua pelafalan dengan arti berbeda: ${homograph.senses.join(' vs ')}.`,
        word,
        homograph.hint,
      );
    }

    // Untranslated English mid-sentence causes an audible accent switch.
    const swap = LOANWORD_SWAPS[word];
    if (swap && !ALLOWED_ENGLISH.has(word)) {
      add(
        'warn',
        'campur-inggris',
        `"${word}" adalah kata Inggris. Mesin akan berpindah aksen sesaat — ini tanda paling kentara video AI.`,
        word,
        `Ganti jadi "${swap}".`,
      );
    }

    if (HARD_WORDS.has(word)) {
      add(
        'warn',
        'kata-sulit',
        `"${word}" (${syllableCount(word)} suku kata) sering terpeleset saat disintesis.`,
        word,
        'Pakai bentuk yang lebih pendek kalau memungkinkan.',
      );
    }

    if (syllableCount(word) >= 7) {
      add(
        'info',
        'kata-panjang',
        `"${word}" punya ${syllableCount(word)} suku kata.`,
        word,
        'Pertimbangkan padanan yang lebih ringkas.',
      );
    }

    // Flag <e> words only when the stem is genuinely ambiguous — i.e. not in
    // either curated list. Words we know the pronunciation of are left alone.
    if (/e/.test(word) && word.length > 3) {
      const stem = stripAffixes(word);
      const known = TALING_WORDS.has(stem) || PEPET_WORDS.has(stem) ||
                    TALING_WORDS.has(word) || PEPET_WORDS.has(word);
      const eCount = (word.match(/e/g) || []).length;
      if (!known && eCount >= 2 && !ALLOWED_ENGLISH.has(word)) {
        add(
          'info',
          'huruf-e-ganda',
          `"${word}" punya dua huruf e. Pelafalan pepet/taling bisa tertukar.`,
          word,
          'Dengarkan hasil dubbing di kata ini saat pratinjau.',
        );
      }
    }
  }

  /* ── Leftovers the normalizer should already have removed ───────────── */
  if (/\d/.test(script)) {
    // Match internal separators but never a trailing period, so a numeral at the
    // end of a sentence is not reported as "1945.".
    const digits = script.match(/\d+(?:[.,]\d+)*/g) || [];
    add(
      'error',
      'angka-mentah',
      `Masih ada angka mentah: ${[...new Set(digits)].slice(0, 6).join(', ')}. Mesin bisa membacanya dalam bahasa Inggris.`,
      digits.slice(0, 3).join(', '),
      'Jalankan normalisasi teks sebelum dubbing.',
    );
  }

  const acronyms = script.match(/\b[A-Z]{2,6}\b/g) || [];
  if (acronyms.length) {
    add(
      'warn',
      'akronim-mentah',
      `Akronim belum dieja: ${[...new Set(acronyms)].join(', ')}.`,
      acronyms[0],
      'Normalisasi akan mengejanya huruf per huruf.',
    );
  }

  // Characters most TTS engines silently drop or read in English.
  const oddChars = script.match(/[«»""''–—…•→×]/g);
  if (oddChars) {
    add(
      'warn',
      'karakter-aneh',
      `Karakter tipografis (${[...new Set(oddChars)].join(' ')}) sering dilewati mesin TTS.`,
      [...new Set(oddChars)].join(' '),
      'Ganti dengan tanda baca ASCII biasa.',
    );
  }

  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warn');

  return {
    ok: errors.length === 0,
    findings,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      infos: findings.length - errors.length - warnings.length,
      sentences: sentences.length,
      words: allWords.length,
      // Indonesian documentary narration lands around 2.6 words/second.
      estimatedSeconds: Math.round((allWords.length / 2.6) * 10) / 10,
    },
  };
}
