"""Mesin sinyal swing trading untuk saham Bursa Efek Indonesia (BEI/IDX).

Modul:
- data        : pengambilan data OHLCV (Yahoo Finance, delayed) + cache
- indicators  : indikator teknikal (SMA/EMA/RSI/MACD/ATR/ADX/BB/Stoch/OBV/Force Index)
- candles     : deteksi pola candlestick (definisi Nison, statistik Bulkowski)
- strategy    : skor komposit, sinyal, level entry/stop/target, position sizing
- sentiment   : sentimen berita emiten (Google News RSS + leksikon InSet + opsional LLM)
- screener    : jalankan seluruh universe dan rangking
- backtest    : uji historis sederhana dengan biaya transaksi BEI
- idx_rules   : fraksi harga, auto rejection, biaya, jam bursa
"""
__version__ = "0.1.0"
