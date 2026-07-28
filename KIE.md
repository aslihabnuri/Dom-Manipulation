# kie.ai

Koneksi ke [kie.ai](https://kie.ai) untuk repo ini: satu CLI tanpa dependency di
`scripts/kie.mjs`, plus catatan cara mengarahkan Claude Code lokal ke kie.

## Kredensial

Kunci dibaca berurutan dari:

1. `$KIE_API_KEY`
2. `~/.kie/credentials` — berisi `KIE_API_KEY=<key>`, mode `600`
3. `<repo>/.kie.key` — kunci mentah, gitignored

Tidak ada satu pun yang di-commit. `.gitignore` menutup `.env*`, `*.key`, dan
`.claude/settings.local.json`. Ambil atau reset kunci di https://kie.ai/api-key.

## CLI

```bash
node scripts/kie.mjs credit                       # sisa kredit
node scripts/kie.mjs chat "<prompt>"              # model chat via /claude/v1/messages
node scripts/kie.mjs create <model> '<json>'      # submit task, cetak taskId
node scripts/kie.mjs status <taskId>              # cek satu task
node scripts/kie.mjs run <model> '<json>'         # submit + poll sampai selesai
```

Tambahkan `--json` ke perintah apa pun untuk respons API mentah.

| Flag | Perintah | Arti |
|---|---|---|
| `--model` | `chat` | default `claude-sonnet-4-5` |
| `--max-tokens` | `chat` | default `1024` |
| `--callback` | `create` | `callBackUrl` webhook |
| `--timeout` | `run` | detik, default `600` |
| `--out <dir>` | `run` | unduh hasil ke direktori, bukan cetak URL |

### Contoh

```bash
# Gambar — file tersimpan di kie-out/
node scripts/kie.mjs run z-image \
  '{"prompt":"kucing oranye di atas tumpukan buku","aspect_ratio":"1:1"}' \
  --out kie-out

# Video — lepas tanpa menunggu, cek belakangan
taskId=$(node scripts/kie.mjs create veo3_fast '{"prompt":"ombak pecah saat senja"}')
node scripts/kie.mjs status "$taskId"
```

Katalog model ada di https://docs.kie.ai/market/quickstart — nilai `model` dan
bentuk `input` diambil dari halaman tiap model.

## Bentuk API

Semua generasi lewat satu pasang endpoint:

- `POST /api/v1/jobs/createTask` → `{ model, input, callBackUrl? }`
- `GET /api/v1/jobs/recordInfo?taskId=<id>` → `state` salah satu dari
  `waiting` · `queuing` · `generating` · `success` · `fail`

Perhatikan: kie.ai membalas HTTP 200 walau ada error — status sebenarnya ada di
field `code` pada body. CLI ini sudah memeriksa `code`, bukan status HTTP saja.

## Mengarahkan Claude Code lokal ke kie.ai

Ini terpisah dari CLI di atas: kie.ai juga menyediakan proxy yang kompatibel
dengan Anthropic API, sehingga Claude Code di mesin sendiri bisa memakai kredit
kie.ai alih-alih langganan Anthropic.

```bash
export ANTHROPIC_BASE_URL="https://api.kie.ai/claude"
export ANTHROPIC_AUTH_TOKEN="$KIE_API_KEY"   # tanpa prefiks "Bearer"
claude
```

Jangan menambahkan `/v1/messages` ke `ANTHROPIC_BASE_URL` — Claude Code
menambahkannya sendiri. Alternatifnya pakai `ANTHROPIC_API_KEY`, tapi nilainya
wajib diawali `Bearer ` (dengan spasi).

Yang perlu disadari sebelum memakai jalur ini:

- Seluruh isi percakapan melewati infrastruktur kie.ai, bukan Anthropic.
- Sesi Claude Code di web/cloud tidak bisa dialihkan seperti ini; provider-nya
  dikunci oleh host (`CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST=1`). Env di atas
  hanya berlaku untuk Claude Code yang dijalankan sendiri di terminal lokal.

Panduan resminya: https://docs.kie.ai/2152008m0.md
