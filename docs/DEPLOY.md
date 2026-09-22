# Berbagi aplikasi ke teman

Aplikasi ini satu proses Python (FastAPI) + file statis. Semua opsi di bawah memakai `APP_PASSWORD` sebagai
gerbang: teman membuka URL, memasukkan password, dan mendapat cookie sesi 30 hari. Jangan pernah mempublikasikan
tanpa password; screener memukul Yahoo Finance dan Google News atas nama server Anda.

## Opsi A: Render.com (gratis, paling mudah)

1. Push repo ini ke GitHub (sudah).
2. Di https://dashboard.render.com klik **New → Blueprint**, pilih repo. Render membaca `render.yaml`.
3. Isi `APP_PASSWORD` saat diminta. Deploy ±3 menit.
4. Bagikan `https://idx-swing-engine.onrender.com` (nama bisa diganti) + password.

Catatan: plan gratis Render "tidur" setelah 15 menit tanpa pengunjung; kunjungan pertama butuh ±30 detik untuk
bangun dan screener dihitung ulang saat itu. Untuk selalu hidup, pakai plan berbayar termurah atau opsi B.

## Opsi B: VPS (DigitalOcean / Vultr / IDCloudHost) dengan Docker

```bash
git clone <repo> && cd <repo>
cp .env.example .env && nano .env        # isi APP_PASSWORD, COOKIE_SECURE=1 bila pakai HTTPS
docker compose up -d --build
```

Pasang reverse proxy dengan HTTPS (Caddy paling mudah):

```
# /etc/caddy/Caddyfile
saham.domainanda.com {
    reverse_proxy localhost:8000
}
```

## Opsi C: Fly.io / Railway

Keduanya membaca `Dockerfile` secara otomatis. Set variabel lingkungan `APP_PASSWORD` dan `COOKIE_SECURE=1`
di dashboard masing-masing. Port diambil dari `$PORT`.

## Opsi D: Komputer sendiri + Tailscale / Cloudflare Tunnel

Jalankan `uvicorn server.app:app --host 0.0.0.0 --port 8000`, lalu `cloudflared tunnel --url http://localhost:8000`
memberi URL publik sementara tanpa membuka port router. Cocok untuk uji coba dengan 2–3 teman.

## Variabel lingkungan

| Nama | Default | Arti |
|---|---|---|
| `APP_PASSWORD` | (kosong = tanpa login) | password bersama |
| `COOKIE_SECURE` | 0 | 1 bila lewat HTTPS |
| `REFRESH_MINUTES` | 15 | interval hitung ulang saat jam bursa |
| `DEFAULT_EQUITY` | 100000000 | modal default untuk hitung lot |
| `ANTHROPIC_API_KEY` | – | aktifkan sentimen via Claude (`SENTIMENT_MODEL`, default `claude-opus-5`) |
| `SENTIMENT_LLM` | 1 | 0 untuk memaksa leksikon meski API key ada |

## Notifikasi (opsional, belum diotomasi)

Endpoint `GET /api/screen` mengembalikan JSON kandidat; Anda bisa memanggilnya dari cron + bot Telegram/WhatsApp
sendiri. Contoh cron jam 16:30 WIB (setelah penutupan):

```bash
30 9 * * 1-5 curl -s -b cookie.txt https://URL/api/screen | jq -r '.candidates[] | "\(.ticker) skor \(.score) entry \(.plan.entry) stop \(.plan.stop)"'
```
