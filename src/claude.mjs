import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.mjs';
import { logger } from './log.mjs';
import { recordCost } from './store.mjs';

const log = logger('claude');

// Opus 5 list pricing, USD per million tokens. Used only to show the operator
// a running estimate — it is not authoritative billing.
const PRICE_PER_MTOK = { input: 5, output: 25 };

let client;
function getClient() {
  if (!config.anthropicKey) {
    throw new Error('ANTHROPIC_API_KEY belum diisi. Tambahkan di file .env lalu jalankan ulang.');
  }
  client ??= new Anthropic({ apiKey: config.anthropicKey });
  return client;
}

function trackUsage(response, projectId, note) {
  const usage = response?.usage;
  if (!usage) return 0;
  const usd =
    ((usage.input_tokens || 0) / 1e6) * PRICE_PER_MTOK.input +
    ((usage.output_tokens || 0) / 1e6) * PRICE_PER_MTOK.output;
  if (projectId) recordCost({ projectId, model: config.claudeModel, usd, note });
  return usd;
}

/**
 * One structured call to Claude.
 *
 * Every pipeline stage that needs judgement (research, scripting, caption
 * writing) goes through here with a JSON schema, so downstream code never has
 * to parse prose. The system prompt is marked cacheable because the same
 * persona is reused across many calls in a single production run.
 */
export async function ask({
  system,
  prompt,
  schema,
  images = [],
  maxTokens = 16000,
  effort = 'high',
  projectId,
  note,
}) {
  const anthropic = getClient();

  // Images first, then the instruction. Claude reads a prompt that refers to
  // "the photo" more reliably when the photo is already in context.
  const content = [
    ...images.map((image) => ({
      type: 'image',
      source: { type: 'base64', media_type: image.mediaType, data: image.base64 },
    })),
    { type: 'text', text: prompt },
  ];

  const request = {
    model: config.claudeModel,
    max_tokens: maxTokens,
    thinking: { type: 'adaptive' },
    output_config: { effort },
    messages: [{ role: 'user', content }],
  };

  if (system) {
    request.system = [
      { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
    ];
  }
  if (schema) {
    request.output_config.format = { type: 'json_schema', schema };
  }

  log.debug('Memanggil Claude', { note, effort, structured: Boolean(schema) });

  let response;
  try {
    response = await anthropic.messages.create(request);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      throw new Error('Claude sedang membatasi permintaan (rate limit). Tunggu sebentar lalu ulangi.');
    }
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error('ANTHROPIC_API_KEY ditolak. Periksa kembali kuncinya.');
    }
    throw error;
  }

  // A refusal returns HTTP 200 with empty or partial content — check before
  // reading content, or the next line throws a confusing TypeError.
  if (response.stop_reason === 'refusal') {
    const category = response.stop_details?.category || 'tidak diketahui';
    throw new Error(
      `Claude menolak permintaan ini (kategori: ${category}). Ubah topik atau redaksi prompt.`,
    );
  }

  trackUsage(response, projectId, note);

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  if (!schema) return text;

  try {
    return JSON.parse(text);
  } catch {
    // Structured outputs guarantee valid JSON, but a max_tokens cut can truncate
    // it. Say so plainly rather than surfacing a bare parse error.
    if (response.stop_reason === 'max_tokens') {
      throw new Error('Jawaban Claude terpotong karena max_tokens. Naikkan batasnya.');
    }
    throw new Error(`Claude mengembalikan JSON yang tidak valid: ${text.slice(0, 300)}`);
  }
}

/** Cheap connectivity probe used by `naratif doctor`. */
export async function ping() {
  try {
    const anthropic = getClient();
    await anthropic.messages.create({
      model: config.claudeModel,
      max_tokens: 16,
      messages: [{ role: 'user', content: 'Balas dengan satu kata: siap' }],
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, why: error.message };
  }
}
