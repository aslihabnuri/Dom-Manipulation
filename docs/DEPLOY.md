# Berbagi aplikasi ke teman

Ada dua cara menjalankan aplikasi ini:

| | Opsi 0: GitHub Pages + Actions | Opsi A–D: server sendiri |
|---|---|---|
| Biaya | **Gratis selamanya, tanpa kartu** (repo publik) | gratis terbatas / kartu / bayar |
| Pembaruan data | terjadwal tiap ±20 menit saat jam bursa (GitHub bisa terlambat 5–15 menit saat sibuk) | tiap 15 menit + tombol Refresh |
| Analisis saham di luar daftar | tidak bisa; tambahkan kode ke `data/watchlist.txt` lalu tunggu jadwal berikutnya | bisa langsung |
| Keamanan | data dienkripsi AES-256 dengan password (situs publik, isi tidak terbaca tanpa password) | login password |
| Perlu keahlian | klik-klik di GitHub | daftar layanan hosting |

## Opsi 0: GitHub Pages + GitHub Actions (gratis selamanya)

Cara kerja: file `.github/workflows/update-site.yml` menyuruh server GitHub menjalankan screener sesuai jadwal,
`scripts/build_site.py` menghasilkan folder `site/` (halaman + bundel data yang dienkripsi dengan `APP_PASSWORD`),
lalu hasilnya dipublikasikan ke branch `gh-pages` yang ditayangkan GitHub Pages di
`https://<username>.github.io/<nama-repo>/`. Tidak ada server yang perlu disewa.

Pengaturan sekali saja (semua di situs GitHub):

1. **Workflow harus ada di branch default.** Buka *Settings → General → Default branch*, ganti ke branch yang
   memuat kode ini (atau merge pull request-nya). Jadwal (`schedule`) hanya berjalan dari branch default.
2. **Password.** *Settings → Secrets and variables → Actions → New repository secret*: nama `APP_PASSWORD`, isi
   password yang akan dibagikan ke teman. Tanpa secret ini situs dipublikasikan tanpa enkripsi (siapa pun yang tahu
   alamatnya bisa melihat).
3. **Jalankan pertama kali.** Tab *Actions → Update site → Run workflow*. Tunggu ±3 menit sampai hijau.
4. **Aktifkan Pages.** *Settings → Pages → Build and deployment → Source: Deploy from a branch*, Branch: `gh-pages`,
   folder `/ (root)`, Save. Alamat situs muncul di halaman yang sama setelah ±1 menit.
5. Bagikan alamat + password. Password dicek di browser teman (kunci diturunkan dengan PBKDF2, data dibuka dengan
   AES-GCM); tidak ada server yang tahu password itu.

Catatan:
- GitHub menonaktifkan jadwal bila repo tidak ada aktivitas 60 hari. Workflow ini mem-push ke `gh-pages` setiap kali
  berjalan, jadi repo selalu "aktif".
- Bila Yahoo Finance membatasi akses dari server GitHub, workflow memakai cache data sebelumnya (`actions/cache`)
  sehingga situs tetap tayang dengan tanggal data yang lebih lama.
- Untuk memaksa pembaruan di luar jadwal: *Actions → Update site → Run workflow*.

## Opsi A–D: server sendiri

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
