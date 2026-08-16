/**
 * Tiny structured logger. Every pipeline step writes here, and the same records
 * stream to the browser over SSE so the UI shows exactly what the CLI shows.
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const COLOR = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

const subscribers = new Set();
let minLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function emit(level, scope, message, extra) {
  const record = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...(extra ? { extra } : {}),
  };

  if (LEVELS[level] >= minLevel) {
    const time = record.ts.slice(11, 19);
    const tail = extra ? ` ${JSON.stringify(extra)}` : '';
    process.stdout.write(
      `${COLOR[level]}${time} ${level.toUpperCase().padEnd(5)}${COLOR.reset} ` +
        `\x1b[1m${scope}\x1b[0m ${message}${COLOR.debug}${tail}${COLOR.reset}\n`,
    );
  }

  for (const fn of subscribers) {
    try {
      fn(record);
    } catch {
      // A broken subscriber (e.g. a closed SSE socket) must never break the run.
    }
  }
  return record;
}

export function logger(scope) {
  return {
    debug: (message, extra) => emit('debug', scope, message, extra),
    info: (message, extra) => emit('info', scope, message, extra),
    warn: (message, extra) => emit('warn', scope, message, extra),
    error: (message, extra) => emit('error', scope, message, extra),
  };
}

export function setLevel(level) {
  if (LEVELS[level] !== undefined) minLevel = LEVELS[level];
}
