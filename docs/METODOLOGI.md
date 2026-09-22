# Metodologi: apa yang dipelajari dan bagaimana diterjemahkan ke mesin

Dokumen ini merangkum sumber yang dipakai, aturan yang diambil dari tiap sumber, dan cara aturan itu
dikodekan di `engine/`. Tingkat keyakinan: **[Pasti]** = diverifikasi ke sumber primer/kutipan langsung,
**[Kemungkinan Besar]** = sumber sekunder yang konsisten, **[Menebak]** = asumsi rekayasa kami sendiri.

## 1. Kebenaran yang tidak nyaman (baca dulu)

1. **Tidak ada "robot" yang bisa mengeksekusi order otomatis di BEI untuk ritel.** [Pasti] Per September 2026,
   Stockbit, Ajaib, IPOT, Mirae HOTS, BIONS, MOST, dan POEMS Indonesia tidak menyediakan API order publik
   (POEMS API hanya untuk Singapura; hanya ada klien Stockbit tidak resmi hasil rekayasa balik yang melanggar
   ToS). IPOT punya "Robo Trading" (order bersyarat di dalam aplikasinya), bukan API eksternal. Karena itu mesin
   ini **signal-only**: ia memberi kandidat, level entry/stop/target, dan ukuran lot; eksekusi tetap manual.
2. **Data gratis bukan real-time.** [Pasti] Yahoo Finance menunda data BEI ±10 menit (penyedia ICE Data
   Services). Untuk swing 1–2 minggu berbasis candle harian ini tidak masalah; untuk scalping, tidak layak.
   Data real-time resmi harus dibeli (vendor data BEI / API berbayar seperti goapi.io, Invezgo).
3. **Tidak ada indikator yang "memprediksi".** Semua sumber di bawah memakai indikator sebagai *filter* dan
   *timing*, dan menaruh bobot terbesar pada manajemen risiko (Tharp, Elder). Bulkowski mengukur bahwa banyak
   pola candlestick yang populer berkinerja hampir acak (hammer 60 %, harami 53 %, hanging man justru 59 %
   *melanjutkan* naik). Mesin ini memakai angka-angka itu sebagai bobot, bukan sebagai kebenaran.
4. **Backtest di repo ini kasar** (harian, tanpa book depth, asumsi isi di buy-stop). Angkanya untuk
   membandingkan aturan, bukan janji return. Lihat `python -m engine.backtest`.

## 2. Sumber yang dipakai

| Sumber | Yang diambil | Dikodekan di |
|---|---|---|
| J. Welles Wilder, *New Concepts in Technical Trading Systems* (1978) | RSI 14 (70/30), ATR 14, ADX/DMI 14 (≥25 tren kuat, <20 tanpa tren), aturan titik ekstrem DMI | `indicators.py` (rsi, atr, adx), gerbang ADX di `strategy.py` |
| John J. Murphy, *Technical Analysis of the Financial Markets* (1999), bab 7, 9, 10 | Trading searah tren, volume harus mengonfirmasi harga, MA sebagai filter tren, MACD 12/26/9, Stochastic 14/3/3 | `indicators.py`, komponen tren & volume |
| Steve Nison, *Japanese Candlestick Charting Techniques* (2nd ed.) | Definisi geometris pola (hammer: shadow bawah ≥ 2× body; engulfing: body menelan body; piercing: tutup > tengah body; star: body kecil yang gap), keharusan konteks tren dan konfirmasi | `candles.py` |
| Thomas Bulkowski, *Encyclopedia of Candlestick Charts* / thepatternsite.com | Persentase pola bertindak sebagai pembalikan: three white soldiers 82 %, bearish engulfing 79 %, morning star 78 %, three black crows 78 %, evening star 72 %, piercing 64 %, bullish engulfing 63 %, hammer 60 %, dark cloud 60 %, shooting star 59 %, harami 53 %, dragonfly 50 %, inverted hammer 35 % (65 % lanjut turun), hanging man 41 % (59 % lanjut naik) [Pasti, URL per pola di `candles.py`] | `PATTERN_STATS` → bobot = (rate − 0,5) × 2 |
| Alexander Elder, *Trading for a Living* (1993) & *Come Into My Trading Room* (2002) | Triple Screen (tren timeframe besar → osilator pullback → buy-stop di atas high kemarin), Impulse System (EMA13 + MACD-hist; merah = dilarang beli), Force Index EMA2/EMA13, aturan 2 % & 6 %, Chandelier Exit (dari Chuck LeBeau) | `impulse_system`, `force_index`, `chandelier_exit`, entry buy-stop, gerbang Impulse |
| Stan Weinstein, *Secrets for Profiting in Bull and Bear Markets* (1988) | Stage analysis dengan MA 30 minggu (≈150 hari): beli hanya Stage 2, jangan pegang Stage 4; breakout perlu volume ≈2× | `weinstein_stage`, gerbang close > SMA150 |
| Mark Minervini, *Trade Like a Stock Market Wizard* (2013) | Trend Template 8 kriteria (harga > MA150 & MA200; MA150 > MA200; MA200 naik ≥ 1 bulan; MA50 > MA150 > MA200; harga > MA50; ≥ 25 % di atas low 52 minggu; ≤ 25 % dari high 52 minggu; RS ≥ 70), VCP (kontraksi volatilitas) [Kemungkinan Besar: diverifikasi lewat ringkasan chartmill/asklivermore] | `_minervini_template` (7 kriteria harga dilaporkan; RS dinilai vs IHSG), squeeze Bollinger sebagai proksi VCP |
| William O'Neil, *How to Make Money in Stocks* (4th ed.) | Volume breakout ≥ 40–50 % di atas rata-rata; relative strength; cut loss 7–8 % [Kemungkinan Besar] | ambang `vol_ratio ≥ 1.4`, batas stop maksimum 8 % |
| John Bollinger, *Bollinger on Bollinger Bands* & 22 aturan di bollingerbands.com | 20 periode / 2 SD; %b; BandWidth; Squeeze = bandwidth terendah ±6 bulan (125 bar) mendahului ekspansi; tag band bukan sinyal | `bollinger`, komponen volatilitas |
| Van K. Tharp, *Trade Your Way to Financial Freedom* (1998) | R-multiple, risiko ≤ 1 % ekuitas per transaksi, lot = risiko / (entry − stop), ekspektansi | `TradePlan`, `risk_per_trade`, `backtest.summarize` |
| Andrew Cardwell (via Constance Brown, *Technical Analysis for the Trading Professional*) | RSI bull range 40–80: pullback ke 40–50 di tren naik adalah zona beli, bukan sinyal jual | skor momentum RSI |
| Peraturan BEI II-A (Kep-00003/BEI/04-2025, amandemen 15 Des 2025) dan Kep-00136/BEI/09-2026 | Jam bursa (Jumat sesi I 09:00–11:30, sesi II 14:00–15:49:59), fraksi harga 5 tingkat, auto rejection bertahap (28 Sep 2026: harga min Rp1; 1 Jan 2027: simetris) [Pasti, sumber: BCA Sekuritas FAQ, Antara, Katadata 21–22 Sep 2026] | `idx_rules.py` |
| Komponen biaya (BEI 0,018 % + KPEI 0,019 % + KSEI 0,003 %, PPh final 0,1 % jual, PPN 11 % atas komisi) | Round-trip ritel ±0,40 % (0,15 % beli / 0,25 % jual) | `TradeCost` |
| InSet (Koto & Rahmaningtyas, IALP 2017) | Leksikon sentimen Indonesia 3.609 kata positif / 6.609 negatif, bobot −5..+5; **tanpa file lisensi** (pakai dengan sitasi, unduh sendiri lewat `scripts/download_lexicon.py`) | `sentiment.py` |

## 3. Cara membaca "saham yang bagus" untuk swing 1–2 minggu (konsensus sumber)

1. **Tren dulu, baru timing.** Semua penulis (Murphy, Elder screen 1, Weinstein stage 2, Minervini template)
   menjadikan tren timeframe lebih besar sebagai *prasyarat*. Karena itu gerbang wajib mesin: close > SMA50 dan
   close > SMA150, ADX ≥ 20 dengan +DI > −DI, dan Impulse Elder tidak merah.
2. **Beli kelemahan di dalam kekuatan** (Elder screen 2; Cardwell): pullback ke EMA20 dengan RSI 40–60 yang
   berbalik naik, Force Index 2 hari kembali positif, MACD-histogram berbalik naik.
3. **Atau beli breakout yang dikonfirmasi volume** (O'Neil, Weinstein): close di atas high 20 hari dengan
   volume ≥ 1,4× rata-rata 50 hari. Breakout tanpa volume diberi label "breakout-lemah".
4. **Kontraksi volatilitas mendahului gerak besar** (Bollinger squeeze, Minervini VCP): bandwidth di persentil
   ≤ 20 % dari 6 bulan mendapat bonus.
5. **Candlestick sebagai konfirmasi, bukan pemicu** (Nison + Bulkowski): pola bullish menambah skor sesuai
   peluang terukur; pola bearish kuat (engulfing 79 %, evening star 72 %, three black crows 78 %) menjadi sinyal
   keluar untuk posisi yang sudah ada.
6. **Likuiditas** [Menebak: ambang kami]: nilai transaksi rata-rata 20 hari ≥ Rp 2 miliar agar 1 %-risiko
   posisi bisa keluar dalam satu hari tanpa menggerakkan harga. Universe default LQ45 sudah memenuhi ini.
7. **Risiko dulu, baru target.** Entry = buy-stop 1 fraksi di atas high kemarin (Elder screen 3). Stop = yang
   lebih tinggi antara low 2 hari (Elder) dan entry − 3×ATR (LeBeau/Tharp), dibulatkan ke fraksi. Tolak setup
   bila stop > 8 % (O'Neil). Target 2R dan 3R [Menebak: konvensi rekayasa, bukan angka buku]. Trailing dengan
   Chandelier Exit setelah 3 hari. Time-stop 10 hari bursa (Elder: swing yang tidak bergerak seminggu, keluar).
8. **Ukuran posisi**: risiko 1 % ekuitas (Tharp; Elder maksimum 2 %), maksimum 20 % ekuitas per saham,
   dan Elder 6 %: berhenti membuka posisi baru bila kerugian bulan berjalan + risiko terbuka ≥ 6 %
   (aturan 6 % ini **belum** diotomasi karena mesin tidak tahu posisi Anda; catat sendiri).

## 4. Skor komposit (0–100)

| Komponen | Bobot | Isi |
|---|---|---|
| Tren | 30 | jarak ke high 52 minggu (10), kemiringan SMA50 10 hari (10), RS 63 hari vs IHSG (10) |
| Momentum | 25 | RSI 40–60 & naik (10), MACD cross/histogram naik (10), Force Index 2 / Stochastic berbalik (5) |
| Volume | 20 | volume ≥ 1,4× pada hari naik atau volume hari naik > hari turun (10), OBV di dekat high 20 hari (5), Force Index 13 > 0 (5) |
| Volatilitas / struktur | 15 | squeeze bandwidth persentil ≤ 20 % (10), %b 0,4–0,9 (5) |
| Candlestick | ±10 | Σ (rate Bulkowski − 0,5) × 2 untuk pola aktif, dibatasi ±1 |

Skor hanya berlaku jika **semua gerbang lolos**; kalau tidak, skor = 0 dan skor mentah ditampilkan sebagai
"potensial". Ambang kandidat default 60. Angka bobot adalah pilihan rekayasa [Menebak] yang mengikuti urutan
prioritas para penulis (tren > momentum > volume > struktur > candle); ubah di `StrategyConfig`.

## 5. Sentimen berita

- Sumber: Google News RSS locale Indonesia (mengagregasi Kontan, CNBC Indonesia, Bisnis.com, Investor.id,
  IDN Financials, Emitennews, Katadata, dll.), query `"KODE" OR "Nama Emiten" saham`, 14 hari terakhir.
- Skor: leksikon domain pasar modal (ARA/ARB, net buy/sell, suspensi, UMA, PKPU, buyback, right issue, ...) +
  InSet umum bila diunduh; negasi sederhana; bobot waktu half-life 5 hari.
- Opsional: bila `ANTHROPIC_API_KEY` diset, judul diklasifikasi Claude dengan skema JSON terstruktur.
- Keterbatasan [Pasti]: berita Indonesia sering *mengikuti* harga, bukan mendahului. Perlakukan sentimen sebagai
  alasan untuk **tidak** membeli (negatif kuat: suspensi, UMA, gagal bayar) lebih daripada alasan untuk membeli.
- Keterbukaan informasi resmi BEI (`idx.co.id/id/perusahaan-tercatat/keterbukaan-informasi`) tidak ber-RSS dan
  diproteksi Cloudflare; belum diintegrasikan.

## 6. Hasil backtest awal (jujur, belum dioptimasi)

`python -m engine.backtest --days 250`, universe LQ45 (45 saham), 22 Sep 2025 – 22 Sep 2026, modal Rp 100 juta,
risiko 1 % per posisi, biaya 0,15 % / 0,25 %, slippage 1 fraksi tiap sisi, aturan persis seperti `strategy.py`:

| Metrik | Nilai |
|---|---|
| Jumlah transaksi | 91 |
| Win rate | 36 % |
| Ekspektansi | −0,005 R (≈ nol) |
| Profit factor | 1,02 |
| Total P/L | +Rp 1,17 juta (+1,2 %) |
| Rata-rata durasi | 5,4 hari bursa |
| Drawdown maksimum | −Rp 9,1 juta |
| Alasan keluar | stop 44, time-stop 20, target 3R 17, gap-stop 8, chandelier 2 |

Kesimpulan [Pasti untuk periode ini]: aturan buku yang dikodekan apa adanya **impas setelah biaya** pada tahun
yang lemah untuk IHSG. Ini normal: buku memberi kerangka, bukan edge; edge datang dari seleksi konteks pasar
(mis. hanya trading saat IHSG sendiri di atas SMA50), disiplin, dan penyesuaian yang Anda uji sendiri.
Yang **tidak** boleh dilakukan: mengutak-atik bobot sampai backtest 1 tahun terlihat bagus (curve fitting).
Yang layak diuji berikutnya: filter rezim IHSG, ambang skor 70, hanya setup "pullback", dan jual separuh di 2R.
