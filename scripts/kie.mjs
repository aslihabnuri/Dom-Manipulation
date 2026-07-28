#!/usr/bin/env node
// Minimal, dependency-free CLI for the kie.ai API.
//
// Auth resolution order:
//   1. $KIE_API_KEY
//   2. ~/.kie/credentials      (KIE_API_KEY=...)
//   3. <repo>/.kie.key         (raw key, gitignored)
//
// Usage:
//   node scripts/kie.mjs credit
//   node scripts/kie.mjs chat "hello" [--model claude-sonnet-4-5] [--max-tokens 512]
//   node scripts/kie.mjs create <model> '<json input>'
//   node scripts/kie.mjs status <taskId>
//   node scripts/kie.mjs run <model> '<json input>' [--timeout 600] [--out kie-out]
//
// Add --json to any command to print the raw API response.

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.KIE_BASE_URL || 'https://api.kie.ai'
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')

function resolveKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY.trim()

  const credentials = join(homedir(), '.kie', 'credentials')
  if (existsSync(credentials)) {
    const match = readFileSync(credentials, 'utf8').match(/^\s*KIE_API_KEY\s*=\s*(.+)$/m)
    if (match) return match[1].trim().replace(/^["']|["']$/g, '')
  }

  const keyFile = join(REPO, '.kie.key')
  if (existsSync(keyFile)) return readFileSync(keyFile, 'utf8').trim()

  fail(
    'No API key found. Set KIE_API_KEY, or write one to ~/.kie/credentials as KIE_API_KEY=<key>.'
  )
}

function fail(message) {
  console.error(`kie: ${message}`)
  process.exit(1)
}

// Concurrent calls can exhaust the local DNS/proxy and surface as a 503 with a
// non-JSON body. Those are transient, so retry them with backoff.
const TRANSIENT = /DNS|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up|fetch failed/i

async function request(url, init, attempt = 0) {
  try {
    const response = await fetch(url, init)
    const text = await response.text()
    if (response.status >= 500 && TRANSIENT.test(text) && attempt < 4) throw new Error(text)
    return { response, text }
  } catch (error) {
    if (attempt >= 4) throw error
    await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt))
    return request(url, init, attempt + 1)
  }
}

async function api(path, { method = 'GET', body, base = BASE, headers = {} } = {}) {
  const { response, text } = await request(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${resolveKey()}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    fail(`HTTP ${response.status}: non-JSON response: ${text.slice(0, 400)}`)
  }

  // kie.ai returns HTTP 200 with a `code` field carrying the real status.
  if (payload.code != null && payload.code !== 200) {
    fail(`API error ${payload.code}: ${payload.msg || 'unknown error'}`)
  }
  if (!response.ok && payload.code == null) {
    fail(`HTTP ${response.status}: ${text.slice(0, 400)}`)
  }
  return payload
}

// Task state values observed from the jobs API.
const TERMINAL = new Set(['success', 'fail'])

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const name = arg.slice(2)
      // Boolean flags take no value; everything else consumes the next token.
      if (name === 'json') flags.json = true
      else flags[name] = argv[++i]
    } else {
      positional.push(arg)
    }
  }
  return { positional, flags }
}

function parseInput(raw) {
  if (!raw) fail('Missing JSON input argument.')
  try {
    return JSON.parse(raw)
  } catch (error) {
    fail(`Input is not valid JSON: ${error.message}`)
  }
}

function resultUrls(record) {
  if (!record?.resultJson) return []
  try {
    const parsed = JSON.parse(record.resultJson)
    return parsed.resultUrls || parsed.result_urls || []
  } catch {
    return []
  }
}

const commands = {
  async credit(_positional, flags) {
    const payload = await api('/api/v1/chat/credit')
    if (flags.json) return console.log(JSON.stringify(payload, null, 2))
    console.log(`Credits: ${payload.data}`)
  },

  async chat(positional, flags) {
    const prompt = positional.join(' ')
    if (!prompt) fail('Usage: kie chat "<prompt>"')

    const payload = await api('/claude/v1/messages', {
      base: BASE,
      method: 'POST',
      headers: { 'anthropic-version': '2023-06-01' },
      body: {
        model: flags.model || 'claude-sonnet-4-5',
        max_tokens: Number(flags['max-tokens'] || 1024),
        messages: [{ role: 'user', content: prompt }],
      },
    })

    if (flags.json) return console.log(JSON.stringify(payload, null, 2))
    const text = (payload.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
    console.log(text)
    console.error(`\n[${payload.model} · ${payload.credits_consumed} credits]`)
  },

  async create(positional, flags) {
    const [model, rawInput] = positional
    if (!model) fail('Usage: kie create <model> \'<json input>\'')

    const payload = await api('/api/v1/jobs/createTask', {
      method: 'POST',
      body: {
        model,
        input: parseInput(rawInput),
        ...(flags.callback ? { callBackUrl: flags.callback } : {}),
      },
    })

    if (flags.json) return console.log(JSON.stringify(payload, null, 2))
    console.log(payload.data.taskId)
  },

  async status(positional, flags) {
    const [taskId] = positional
    if (!taskId) fail('Usage: kie status <taskId>')

    const payload = await api(`/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`)
    if (flags.json) return console.log(JSON.stringify(payload, null, 2))

    const record = payload.data
    console.log(`state: ${record.state}`)
    if (record.failMsg) console.log(`error: ${record.failMsg}`)
    for (const url of resultUrls(record)) console.log(url)
  },

  async run(positional, flags) {
    const [model, rawInput] = positional
    if (!model) fail('Usage: kie run <model> \'<json input>\'')

    const created = await api('/api/v1/jobs/createTask', {
      method: 'POST',
      body: { model, input: parseInput(rawInput) },
    })
    const taskId = created.data.taskId
    console.error(`task ${taskId} submitted, polling…`)

    const timeoutMs = Number(flags.timeout || 600) * 1000
    const deadline = Date.now() + timeoutMs
    let record

    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      const payload = await api(`/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`)
      record = payload.data
      if (TERMINAL.has(record.state)) break
      console.error(`  ${record.state}…`)
    }

    if (!record || !TERMINAL.has(record.state)) {
      fail(`Timed out after ${timeoutMs / 1000}s. Check later: kie status ${taskId}`)
    }
    if (flags.json) return console.log(JSON.stringify(record, null, 2))
    if (record.state === 'fail') fail(`Task failed: ${record.failMsg || record.failCode}`)

    const urls = resultUrls(record)
    if (!urls.length) return console.log(JSON.stringify(record, null, 2))

    if (flags.out) {
      mkdirSync(flags.out, { recursive: true })
      for (const url of urls) {
        const name = basename(new URL(url).pathname) || `${taskId}.bin`
        const response = await fetch(url)
        writeFileSync(join(flags.out, name), Buffer.from(await response.arrayBuffer()))
        console.log(join(flags.out, name))
      }
      return
    }
    for (const url of urls) console.log(url)
  },
}

const [command, ...rest] = process.argv.slice(2)
if (!command || !commands[command]) {
  console.error(`Usage: kie <${Object.keys(commands).join('|')}> [args] [--json]`)
  process.exit(command ? 1 : 0)
}
const { positional, flags } = parseArgs(rest)
await commands[command](positional, flags)
