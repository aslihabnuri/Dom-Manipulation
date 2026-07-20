# Integrasi TikHub Social Media API ke Claude Code (MCP)

Project ini sudah dikonfigurasi memakai **TikHub MCP Server** lewat file `.mcp.json`,
sehingga Claude Code bisa mengambil data video/user/trending dari TikTok, Douyin, dll.

## 1. Dapatkan API Key TikHub

1. Buka https://user.tikhub.io dan daftar (verifikasi email).
2. Masuk ke menu **API Token** di dashboard.
3. Klik **Create Token**.
4. **Salin API Key langsung** — key hanya ditampilkan SEKALI.

Tier gratis memberi kredit awal untuk mencoba tanpa kartu kredit.

## 2. Pasang API Key sebagai environment variable

File `.mcp.json` membaca key dari variable `TIKHUB_API_KEY` (bukan ditulis langsung,
supaya key tidak ikut ter-commit ke Git).

```bash
# Cara cepat (satu sesi terminal)
export TIKHUB_API_KEY="paste_api_key_kamu"

# Atau simpan permanen di file .env
cp .env.example .env
# lalu edit .env dan isi TIKHUB_API_KEY
```

## 3. Jalankan Claude Code

Buka Claude Code di dalam folder project ini. Server `tikhub` akan otomatis terdeteksi
dari `.mcp.json`. Cek dengan:

```bash
claude mcp list      # harus muncul "tikhub"
```

Di dalam sesi Claude Code, ketik `/mcp` untuk melihat tools yang tersedia.

## Ganti / tambah platform lain

Endpoint TikHub mengikuti pola: `https://mcp.tikhub.io/{platform}/mcp`
Ganti bagian `{platform}` di `.mcp.json` sesuai kebutuhan, contoh: `tiktok`,
`instagram`, `youtube`, `douyin`, `reddit`. Untuk beberapa platform sekaligus,
tambahkan entri baru dengan nama berbeda di `.mcp.json`.

## Catatan keamanan

- JANGAN commit API key asli ke Git. File `.env` sudah masuk `.gitignore`.
- Perlakukan API key seperti password.
