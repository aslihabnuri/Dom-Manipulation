# IDX Swing Engine

Mesin sinyal swing trading (horizon 5–10 hari bursa) untuk saham Bursa Efek Indonesia. Memindai LQ45 (+ watchlist
Anda) tiap 15 menit selama jam bursa, memberi skor 0–100 berdasarkan aturan dari buku-buku analisis teknikal klasik
(Wilder, Murphy, Nison, Elder, Weinstein, Minervini, O'Neil, Bollinger, Tharp, statistik Bulkowski), menghitung
entry / stop / target / jumlah lot sesuai aturan BEI (fraksi harga, auto rejection, biaya), dan menampilkan
sentimen berita tiap emiten. Bisa dibagikan ke teman lewat satu password.

> **Bukan robot auto-trading.** Tidak ada sekuritas ritel di Indonesia yang membuka API order (per Sep 2026), jadi
> mesin ini hanya memberi sinyal; order tetap Anda masukkan sendiri di aplikasi sekuritas. Bukan rekomendasi
> investasi. Baca `docs/METODOLOGI.md` sebelum memakai.

## Fitur

- **Screener** LQ45 + watchlist dengan gerbang wajib (tren SMA50/150, ADX, Impulse Elder, likuiditas, ARA) dan skor
  komposit: tren 30 / momentum 25 / volume 20 / volatilitas 15 / candlestick ±10.
- **Analisis per saham**: 17 pola candlestick (definisi Nison, bobot Bulkowski), RSI, MACD, ADX/DMI, ATR, Bollinger
  (%b, squeeze), Stochastic, OBV, Force Index, Chandelier Exit, Weinstein stage, Minervini Trend Template,
  relative strength vs IHSG.
- **Rencana transaksi**: entry buy-stop, stop (low 2 hari / 3×ATR), target 2R & 3R, time-stop, ARA/ARB besok,
  jumlah lot untuk risiko 1 % modal (Tharp), semuanya dibulatkan ke fraksi harga BEI.
- **Sinyal keluar** untuk posisi yang sudah dipegang (Chandelier, Impulse merah, pola bearish kuat).
- **Sentimen berita** dari Google News (Kontan, CNBC Indonesia, Bisnis, Investor.id, dll.) dengan leksikon pasar
  modal + InSet; opsional klasifikasi oleh Claude.
- **Backtester** sederhana dengan biaya BEI untuk menguji aturan sebelum dipercaya.
- **Web app** dengan grafik candlestick, login password bersama, refresh otomatis saat jam bursa.

## Menjalankan di komputer sendiri

```bash
python3 -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install anthropic                                     # opsional, untuk sentimen via Claude
python scripts/download_lexicon.py                        # opsional, leksikon InSet
cp .env.example .env                                      # isi APP_PASSWORD
uvicorn server.app:app --host 0.0.0.0 --port 8000
```

Buka http://localhost:8000 . Teman di jaringan yang sama bisa membuka `http://<IP-komputer-Anda>:8000`.

CLI tanpa web:

```bash
python -m scripts.screen                 # screener ke terminal
python -m scripts.screen BBRI ANTM       # analisis saham tertentu
python -m engine.backtest --days 250     # backtest 1 tahun universe LQ45
python -m pytest -q                      # tes unit
```

## Berbagi ke teman lewat internet

Lihat `docs/DEPLOY.md`. Ringkas: klik *New Blueprint* di Render.com dan arahkan ke repo ini (`render.yaml` sudah
ada), isi `APP_PASSWORD`, bagikan URL + password. Alternatif: `docker compose up -d` di VPS, atau Fly.io/Railway.

## Struktur

```
engine/      logika: data.py, indicators.py, candles.py, strategy.py, sentiment.py, screener.py, backtest.py, idx_rules.py, universe.py
server/      FastAPI (auth, API, scheduler)
web/         dashboard (HTML/CSS/JS, lightweight-charts)
scripts/     CLI: screen.py, download_lexicon.py
tests/       pytest
docs/        METODOLOGI.md (sumber & aturan), DEPLOY.md
data/        cache OHLCV, watchlist.txt, lexicon/ (tidak di-commit)
```

## Menambah saham di luar LQ45

Tulis kode saham satu per baris di `data/watchlist.txt`, atau lewat API `POST /api/watchlist {"add": ["BRIS"]}`.
Perbarui daftar `LQ45` di `engine/universe.py` setiap rebalancing kuartalan BEI.

## Batasan yang harus Anda tahu

- Data Yahoo Finance tertunda ±10 menit dan kadang kena rate limit (mesin memakai cache dan mencoba dua host).
- Skor adalah ringkasan aturan buku, bukan prediksi. Backtest 1 tahun terakhir (LQ45, biaya BEI) menghasilkan
  91 transaksi, win rate 36 %, ekspektansi ≈ 0 R, profit factor 1,02: **impas setelah biaya**, belum ada edge yang
  terbukti (rincian di `docs/METODOLOGI.md` bagian 6). Pasar lemah = daftar kandidat kosong, dan itu memang benar.
- Aturan Elder 6 % (berhenti buka posisi baru bila rugi bulan berjalan ≥ 6 %) tidak diotomasi karena mesin tidak
  tahu posisi Anda.
- Aturan auto rejection BEI berubah 28 Sep 2026 dan 1 Jan 2027; `engine/idx_rules.py` sudah sadar tanggal, tetapi
  periksa ulang bila BEI mengubah lagi.
