# Ads Command Center — Sophie Martin Official

Dashboard database iklan all-platform (TikTok, Shopee, Meta, Lazada) untuk tim digital marketing.
Satu file HTML mandiri — buka `index.html` di browser, tanpa server dan tanpa dependensi.

## Struktur

| File | Fungsi |
|---|---|
| `index.html` | Dashboard lengkap dengan data Juli 2026 ter-embed |
| `data/dashboard_data.json` | Data terstruktur hasil parse Google Sheet + raw platform |
| `tools/parse_data.py` | Parser: CSV ekspor Google Sheet (+ xlsx Meta) → JSON |

## Fitur

- **Ringkasan** — KPI all-platform MTD (Spend, GMV, ROAS, Orders, CPO, AOV) dengan
  pembanding terhadap bulan lalu, tren harian per platform, kontribusi GMV, top channel.
- **Harian** — replika struktur sheet *July 26*: tabel metrik × tanggal per channel
  (termasuk metrik turunan ROAS/CTR/CTOR/CPO/AOV), agregat per platform & all platform.
- **Bulanan** — replika *MoM 26*: tabel month-over-month + GMV/cost per platform per bulan.
- **Platform** — breakdown channel per platform: budget, pacing, ROAS vs target, dsb.
- **Analisis** — engine warning otomatis dengan action plan:
  - ROAS di bawah target / turun vs baseline 7 hari (median, tahan lonjakan tanggal kembar),
  - GMV turun saat spend stabil, CTOR melemah (indikasi creative fatigue),
  - pacing budget (overspend / budget idle), data kosong / tertinggal,
  - peluang scale-up (ROAS ≥ 120% target dengan pace aman),
  - target ROAS per channel bisa diedit (tersimpan di browser).
- **Data** — import raw data langsung di browser: CSV Shopee (Iklan CPC / Iklan Toko /
  SBA — tanggal terbaca otomatis dari baris `Periode`) dan CSV Meta (per kolom `Day`);
  input manual harian; export JSON gabungan. Perubahan disimpan sebagai overlay
  di `localStorage`, tidak mengubah data dasar.

## Update data bulan berikutnya

1. Ekspor tab Google Sheet sebagai CSV (July 26 / MoM 26 / MoM - Breakdown 26).
2. Jalankan `python3 tools/parse_data.py` (sesuaikan path input di bagian atas file)
   untuk menghasilkan `dashboard_data.json` baru.
3. Tempel isi JSON ke dalam `index.html` pada blok
   `<script id="BASE_DATA" type="application/json">…</script>`.

Untuk update harian cukup pakai tab **Data ▸ Import** di dashboard.
