# Ads Command Center — Sophie Martin Official

Dashboard database iklan all-platform (TikTok, Shopee, Meta, Lazada) untuk tim digital marketing.
Satu file HTML mandiri — buka `index.html` di browser, tanpa server dan tanpa dependensi.

## Struktur

| File | Fungsi |
|---|---|
| `index.html` | Dashboard lengkap dengan data 2025–2026 ter-embed |
| `data/dashboard_data.json` | Data terstruktur hasil parse Google Sheet |
| `tools/parse_data.py` | Parser: workbook Google Sheet (xlsx) → JSON |
| `tools/build.py` | Rakit ulang `index.html` dari template + data |
| `tools/templates/` | Template sumber (head/CSS, core JS, app JS) |

## Fitur

- **Dwibahasa** — Indonesia / English, ganti lewat tombol ID/EN di header; seluruh
  label memakai bahasa formal.
- **Identitas brand** — logo hati Sophie Martin Paris + palet navy royal & lime
  (mengikuti pitch deck Affimarq): warna, font, dan ambient.
- **Pemilih periode seragam** — dropdown tanggal dengan preset (hari ini, kemarin,
  7/30 hari terakhir, 3/6/12 bulan terakhir, bulan/tahun ini & lalu, custom) di tab
  Ringkasan, Harian, Produk, dan Kreator.
- **Ringkasan** — KPI all-platform dengan pembanding otomatis (periode sebelumnya /
  tahun lalu; bulan penuh memakai angka resmi tabel MoM), grafik tren dengan
  ceklis metrik, kontribusi GMV, top channel, tabel MoM 2025/2026, dan panel
  Sorotan Tahun (kuartal, bulan terbaik, kontribusi platform) pada tampilan tahunan.
- **Harian** — tabel metrik × tanggal per channel + tampilan per tanggal lintas
  channel; tombol Bandingkan (periode vs periode / channel vs channel).
- **Platform** — budget (dapat diedit langsung, klik angka anggaran), pacing,
  ROAS vs target, tabel upper funnel.
- **Produk** — gabungan TikTok & Shopee via penyamaan nama (kamus Product ID),
  metrik Qty/Nilai/%Kontribusi/Biaya/Impresi/Klik/CTR/CTOR/ROI, filter minimum
  per metrik, pencarian, pemberian nama produk manual.
- **Kreator** — performa kreator & video (ID video), %Kontribusi, drill-down video.
- **Analisis** — mesin peringatan otomatis + rencana tindakan sesuai SOP untuk
  iklan, ditambah analisis produk (penggerak nilai, produk boros biaya, kandidat
  dorongan) dan analisis kreator (teratas & ROI rendah); target ROAS per channel
  dapat diedit.
- **Asisten Analisis (chatbot)** — panel melekat di kanan layar; menjawab pertanyaan
  performa iklan, produk, dan kreator langsung dari data (dwibahasa, tanpa server).
- **Unggah** — import raw CSV/XLSX (Shopee CPC/Toko/SBA/Live, Meta, TikTok GMV Max
  Live & Product, Lazada Sponsored Max, Produk Klik Live, Kamus Produk); input
  manual per tanggal; semua tersimpan sebagai overlay `localStorage`, data dasar
  sheet tidak berubah.

## Update data bulan berikutnya

1. Unduh Google Sheet sebagai `workbook.xlsx` (File ▸ Download ▸ Microsoft Excel).
2. Jalankan `python3 tools/parse_data.py` untuk menghasilkan `data/dashboard_data.json`.
3. Jalankan `python3 tools/build.py` untuk merakit ulang `index.html`.

Untuk update harian cukup pakai tab **Unggah** di dashboard.
