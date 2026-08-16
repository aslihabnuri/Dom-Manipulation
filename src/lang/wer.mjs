/**
 * Word Error Rate between the script we sent and the transcript of what the
 * voice actually said.
 *
 * This is the only check that proves the dub is clean rather than assuming it.
 * The linter predicts trouble from the text; this measures the audio. Running
 * both is what lets us commit to a render without a listen-through.
 */

/** Normalize away everything that is not a pronunciation difference. */
export function normalizeForCompare(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text) {
  const clean = normalizeForCompare(text);
  return clean ? clean.split(' ') : [];
}

/**
 * Levenshtein alignment over words, tracking which operation produced each
 * step so we can point at the exact words that went wrong.
 */
export function align(reference, hypothesis) {
  const ref = tokenize(reference);
  const hyp = tokenize(hypothesis);
  const n = ref.length;
  const m = hyp.length;

  // dp[i][j] = edit distance between ref[0..i) and hyp[0..j)
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  const op = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(''));

  for (let i = 0; i <= n; i += 1) {
    dp[i][0] = i;
    op[i][0] = 'delete';
  }
  for (let j = 0; j <= m; j += 1) {
    dp[0][j] = j;
    op[0][j] = 'insert';
  }
  op[0][0] = '';

  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (ref[i - 1] === hyp[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        op[i][j] = 'match';
        continue;
      }
      const sub = dp[i - 1][j - 1] + 1;
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      const best = Math.min(sub, del, ins);
      dp[i][j] = best;
      op[i][j] = best === sub ? 'substitute' : best === del ? 'delete' : 'insert';
    }
  }

  // Walk the matrix backwards to recover the operation sequence.
  const steps = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const operation = op[i][j];
    if (operation === 'match' || operation === 'substitute') {
      steps.push({ op: operation, ref: ref[i - 1], hyp: hyp[j - 1] });
      i -= 1;
      j -= 1;
    } else if (operation === 'delete') {
      steps.push({ op: 'delete', ref: ref[i - 1], hyp: null });
      i -= 1;
    } else {
      steps.push({ op: 'insert', ref: null, hyp: hyp[j - 1] });
      j -= 1;
    }
  }
  steps.reverse();

  const counts = { match: 0, substitute: 0, delete: 0, insert: 0 };
  for (const step of steps) counts[step.op] += 1;

  const errors = counts.substitute + counts.delete + counts.insert;
  return {
    steps,
    counts,
    referenceWords: n,
    // A dub of an empty script is vacuously perfect; guard the divide.
    wer: n === 0 ? (m === 0 ? 0 : 1) : errors / n,
  };
}

/**
 * Compare a script segment against its transcript and decide whether the take
 * is usable. Returns the specific mismatched words so the UI can show the
 * writer exactly which phrase the voice fumbled.
 */
export function verifyTake(scriptText, transcriptText, maxWer = 0.05) {
  const result = align(scriptText, transcriptText);

  const mismatches = result.steps
    .filter((s) => s.op !== 'match')
    .map((s) => ({
      kind: s.op === 'substitute' ? 'salah-baca' : s.op === 'delete' ? 'terlewat' : 'kelebihan',
      expected: s.ref,
      heard: s.hyp,
    }));

  return {
    ok: result.wer <= maxWer,
    wer: Math.round(result.wer * 10000) / 10000,
    maxWer,
    referenceWords: result.referenceWords,
    counts: result.counts,
    mismatches: mismatches.slice(0, 25),
    verdict:
      result.wer <= maxWer
        ? 'Dubbing sesuai naskah.'
        : `Dubbing meleset ${(result.wer * 100).toFixed(1)}% dari naskah (batas ${(maxWer * 100).toFixed(1)}%). Segmen ini perlu diulang.`,
  };
}
