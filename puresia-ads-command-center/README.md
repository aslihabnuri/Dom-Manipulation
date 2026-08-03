# Ads Command Center — Puresia

Clone dari artifact "Ads Command Center — Brunbrun" yang dimigrasikan ke brand **Puresia**.
Artifact original tidak diubah.

- Artifact live: https://claude.ai/code/artifact/1088c3e0-4995-417f-a10d-6cc4831d3b48
- Sumber data: Google Sheet "Puresia Worksheet (Ads)" (`1vJHziZAWR-d3yBTcwxtqki9QPMFwtxk_tKmlyOxoPfA`)
- Folder raw data: Google Drive "Puresia Ads Raw Data" (`1hkF1IvfonDkb7E68COSlXLs-93nrmBK2`)

## Perubahan terhadap versi Brunbrun
1. Rebrand penuh Brunbrun → Puresia (judul, logo monogram P, header, chatbot, teks bantuan).
2. Channel `GMV Max Live Brunbrun Official` → `GMV Max Live Puresia Official` (`tt_live_smo`).
3. Channel `GMV Max Live Brunbrun Watch` (`tt_live_sid`) dan seluruh dukungan Lazada dihapus.
4. Deteksi akun: campaign live TikTok yang memuat "Pure" dipetakan ke GMV Max Live Puresia Official.
5. BASE_DATA diganti dengan data Puresia (Apr 2025 – Jul 2026) hasil parse worksheet Puresia,
   termasuk perbaikan logika penentuan tahun rekap & tab harian pada parser.
6. `GD_FOLDERS`/`GD_SHEET_ID` menunjuk ke folder Drive dan worksheet Puresia yang baru;
   kunci localStorage diganti prefix `puresiaAds*` agar tidak bentrok dengan dashboard lain.

## Isi
- `puresia-ads-command-center.html` — source artifact yang dipublikasikan.
- `tools/build_clone.py` — script transformasi dari HTML Brunbrun ke Puresia.
- `tools/final_parse.js` — parser worksheet Puresia (patch dari parser bawaan artifact).
- `tools/puresia_parsed_data.json` — hasil parse (months + mom) yang ditanam ke BASE_DATA.
