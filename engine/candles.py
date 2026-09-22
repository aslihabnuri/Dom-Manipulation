"""Deteksi pola candlestick.

Definisi geometris mengikuti Steve Nison, *Japanese Candlestick Charting Techniques* (2nd ed.):
- Real body = |close - open|; shadow atas = high - max(o,c); shadow bawah = min(o,c) - low.
- Hammer / Hanging Man: shadow bawah >= 2x body, shadow atas kecil (<= ~10% range), body di ujung atas range.
  Hammer muncul setelah tren turun (bullish); Hanging Man setelah tren naik (bearish, perlu konfirmasi).
- Shooting Star / Inverted Hammer: kebalikannya (shadow atas >= 2x body).
- Engulfing: body candle ke-2 sepenuhnya menelan body candle ke-1, warna berlawanan.
- Piercing / Dark Cloud: candle ke-2 dibuka di luar range candle ke-1 dan ditutup melewati titik tengah body ke-1.
- Morning/Evening Star: 3 candle, candle tengah berbody kecil (bintang) yang gap dari body candle ke-1,
  candle ke-3 menutup jauh ke dalam body candle ke-1.
- Doji: body <= 10% dari range hari itu.
- Three White Soldiers / Three Black Crows: 3 body panjang berturut-turut searah, masing-masing dibuka di dalam
  body sebelumnya dan ditutup dekat ekstremnya.

Konteks tren wajib (Nison: pola pembalikan hanya bermakna setelah ada tren yang bisa dibalik). Di sini tren
didefinisikan sederhana dengan kemiringan EMA-10 atau posisi close terhadap SMA-20 selama 5 hari terakhir.

Tingkat keberhasilan statistik per pola diisi dari Bulkowski (*Encyclopedia of Candlestick Charts*) di
PATTERN_STATS setelah verifikasi; lihat docs/METODOLOGI.md. Nilai ini dipakai sebagai bobot, bukan kebenaran mutlak.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

BODY_DOJI_MAX = 0.10       # body <= 10% range -> doji
SMALL_SHADOW_MAX = 0.10    # shadow "kecil" <= 10% range
LONG_BODY_MIN = 0.60       # body "panjang" >= 60% range
STAR_BODY_MAX = 0.30       # body bintang (morning/evening star) <= 30% range


@dataclass(frozen=True)
class PatternInfo:
    name: str
    direction: str          # 'bullish' | 'bearish' | 'neutral'
    kind: str               # 'reversal' | 'continuation' | 'indecision'
    bulkowski_rate: float | None  # persentase pembalikan/kelanjutan sesuai Bulkowski; None bila tidak diverifikasi
    note: str = ""


# Nilai bulkowski_rate: persentase "acts as reversal/continuation" dari Bulkowski (thepatternsite.com /
# Encyclopedia of Candlestick Charts). Diverifikasi ulang di docs/METODOLOGI.md; None = belum diverifikasi.
PATTERN_STATS: dict[str, PatternInfo] = {
    # bulkowski_rate = probabilitas pola bertindak sesuai arah yang diklaim (reversal) menurut Bulkowski,
    # thepatternsite.com (diverifikasi Sept 2026). Pola dengan rate < 55% praktis acak -> bobot kecil.
    "hammer": PatternInfo("Hammer", "bullish", "reversal", 0.60, "reversal 60%; Nison: butuh konfirmasi candle berikutnya"),
    "inverted_hammer": PatternInfo("Inverted Hammer", "bullish", "reversal", 0.35, "Bulkowski: 65% justru lanjut TURUN; bobot kecil"),
    "bullish_engulfing": PatternInfo("Bullish Engulfing", "bullish", "reversal", 0.63, "reversal 63%"),
    "piercing_line": PatternInfo("Piercing Line", "bullish", "reversal", 0.64, "reversal 64%"),
    "morning_star": PatternInfo("Morning Star", "bullish", "reversal", 0.78, "reversal 78%, peringkat 6/103"),
    "three_white_soldiers": PatternInfo("Three White Soldiers", "bullish", "reversal", 0.82, "reversal 82%, peringkat 3/103"),
    "bullish_harami": PatternInfo("Bullish Harami", "bullish", "reversal", 0.53, "reversal 53% (acak)"),
    "dragonfly_doji": PatternInfo("Dragonfly Doji", "bullish", "reversal", 0.50, "reversal 50% (acak)"),
    "doji": PatternInfo("Doji", "neutral", "indecision", None, "keraguan pasar; bukan sinyal arah"),
    "shooting_star": PatternInfo("Shooting Star", "bearish", "reversal", 0.59, "reversal 59%"),
    "hanging_man": PatternInfo("Hanging Man", "bearish", "reversal", 0.41, "Bulkowski: 59% justru lanjut NAIK; Nison: wajib konfirmasi"),
    "bearish_engulfing": PatternInfo("Bearish Engulfing", "bearish", "reversal", 0.79, "reversal 79%, peringkat 5/103"),
    "dark_cloud_cover": PatternInfo("Dark Cloud Cover", "bearish", "reversal", 0.60, "reversal 60%"),
    "evening_star": PatternInfo("Evening Star", "bearish", "reversal", 0.72, "reversal 72%, peringkat 10/103"),
    "three_black_crows": PatternInfo("Three Black Crows", "bearish", "reversal", 0.78, "reversal 78%"),
    "bearish_harami": PatternInfo("Bearish Harami", "bearish", "reversal", 0.53, "reversal 53% (acak)"),
    "gravestone_doji": PatternInfo("Gravestone Doji", "bearish", "reversal", 0.51, "reversal 51% (acak)"),
}


def _geometry(df: pd.DataFrame) -> pd.DataFrame:
    o, h, l, c = df["open"], df["high"], df["low"], df["close"]
    rng = (h - l).replace(0, np.nan)
    body = (c - o).abs()
    g = pd.DataFrame(index=df.index)
    g["body"] = body
    g["range"] = rng
    g["body_pct"] = body / rng
    g["upper"] = (h - pd.concat([o, c], axis=1).max(axis=1)) / rng
    g["lower"] = (pd.concat([o, c], axis=1).min(axis=1) - l) / rng
    g["bull"] = c > o
    g["bear"] = c < o
    g["mid"] = (o + c) / 2
    g["body_top"] = pd.concat([o, c], axis=1).max(axis=1)
    g["body_bot"] = pd.concat([o, c], axis=1).min(axis=1)
    # Body rata-rata 20 hari untuk menilai "panjang" secara relatif
    g["body_avg20"] = body.rolling(20, min_periods=5).mean()
    return g


def _trend_context(df: pd.DataFrame, lookback: int = 5) -> pd.DataFrame:
    """downtrend: close turun selama lookback hari & close < SMA20 ; uptrend: sebaliknya."""
    c = df["close"]
    sma20 = c.rolling(20, min_periods=10).mean()
    ema10 = c.ewm(span=10, adjust=False).mean()
    slope = ema10.diff(lookback)
    ctx = pd.DataFrame(index=df.index)
    ctx["downtrend"] = (slope < 0) & (c.shift(1) < sma20.shift(1))
    ctx["uptrend"] = (slope > 0) & (c.shift(1) > sma20.shift(1))
    return ctx


def detect_patterns(df: pd.DataFrame) -> pd.DataFrame:
    """Kembalikan DataFrame boolean, satu kolom per pola, True pada hari pola selesai terbentuk."""
    g = _geometry(df)
    ctx = _trend_context(df)
    o, h, l, c = df["open"], df["high"], df["low"], df["close"]
    o1, c1, h1, l1 = o.shift(1), c.shift(1), h.shift(1), l.shift(1)
    g1, g2 = g.shift(1), g.shift(2)
    o2, c2 = o.shift(2), c.shift(2)

    out = pd.DataFrame(index=df.index)
    small_upper = g["upper"] <= SMALL_SHADOW_MAX
    small_lower = g["lower"] <= SMALL_SHADOW_MAX
    long_lower = g["lower"] >= 2 * g["body_pct"]
    long_upper = g["upper"] >= 2 * g["body_pct"]
    not_doji = g["body_pct"] > BODY_DOJI_MAX
    long_body = g["body_pct"] >= LONG_BODY_MIN

    # --- single candle ---
    out["doji"] = g["body_pct"] <= BODY_DOJI_MAX
    out["dragonfly_doji"] = out["doji"] & (g["lower"] >= 0.6) & small_upper & ctx["downtrend"]
    out["gravestone_doji"] = out["doji"] & (g["upper"] >= 0.6) & small_lower & ctx["uptrend"]
    hammer_shape = long_lower & small_upper & not_doji
    star_shape = long_upper & small_lower & not_doji
    out["hammer"] = hammer_shape & ctx["downtrend"]
    out["hanging_man"] = hammer_shape & ctx["uptrend"]
    out["inverted_hammer"] = star_shape & ctx["downtrend"]
    out["shooting_star"] = star_shape & ctx["uptrend"]

    # --- two candles ---
    out["bullish_engulfing"] = (
        ctx["downtrend"].shift(1, fill_value=False) & g1["bear"] & g["bull"]
        & (o <= c1) & (c >= o1) & (g["body"] > g1["body"])
    )
    out["bearish_engulfing"] = (
        ctx["uptrend"].shift(1, fill_value=False) & g1["bull"] & g["bear"]
        & (o >= c1) & (c <= o1) & (g["body"] > g1["body"])
    )
    out["piercing_line"] = (
        ctx["downtrend"].shift(1, fill_value=False) & g1["bear"] & g["bull"] & (g1["body_pct"] >= 0.5)
        & (o < l1) & (c > g1["mid"]) & (c < o1)
    )
    out["dark_cloud_cover"] = (
        ctx["uptrend"].shift(1, fill_value=False) & g1["bull"] & g["bear"] & (g1["body_pct"] >= 0.5)
        & (o > h1) & (c < g1["mid"]) & (c > o1)
    )
    out["bullish_harami"] = (
        ctx["downtrend"].shift(1, fill_value=False) & g1["bear"] & (g1["body_pct"] >= 0.5)
        & (g["body_top"] < g1["body_top"]) & (g["body_bot"] > g1["body_bot"]) & not_doji
    )
    out["bearish_harami"] = (
        ctx["uptrend"].shift(1, fill_value=False) & g1["bull"] & (g1["body_pct"] >= 0.5)
        & (g["body_top"] < g1["body_top"]) & (g["body_bot"] > g1["body_bot"]) & not_doji
    )

    # --- three candles ---
    star_small = g1["body_pct"] <= STAR_BODY_MAX
    out["morning_star"] = (
        ctx["downtrend"].shift(2, fill_value=False) & g2["bear"] & (g2["body_pct"] >= 0.5)
        & star_small & (g1["body_top"] < c2)            # bintang gap turun dari body candle 1
        & g["bull"] & (c > (o2 + c2) / 2)               # candle 3 menutup di atas tengah body candle 1
    )
    out["evening_star"] = (
        ctx["uptrend"].shift(2, fill_value=False) & g2["bull"] & (g2["body_pct"] >= 0.5)
        & star_small & (g1["body_bot"] > c2)
        & g["bear"] & (c < (o2 + c2) / 2)
    )
    out["three_white_soldiers"] = (
        g["bull"] & g1["bull"] & g2["bull"]
        & long_body & (g1["body_pct"] >= LONG_BODY_MIN) & (g2["body_pct"] >= LONG_BODY_MIN)
        & (c > c1) & (c1 > c2)
        & (o > o1) & (o < c1) & (o1 > o2) & (o1 < c2)   # dibuka di dalam body sebelumnya
        & (g["upper"] <= 0.2) & (g1["upper"] <= 0.2)
    )
    out["three_black_crows"] = (
        g["bear"] & g1["bear"] & g2["bear"]
        & long_body & (g1["body_pct"] >= LONG_BODY_MIN) & (g2["body_pct"] >= LONG_BODY_MIN)
        & (c < c1) & (c1 < c2)
        & (o < o1) & (o > c1) & (o1 < o2) & (o1 > c2)
        & (g["lower"] <= 0.2) & (g1["lower"] <= 0.2)
    )
    return out.fillna(False).astype(bool)


def patterns_on(df: pd.DataFrame, idx: int = -1) -> list[str]:
    """Daftar nama pola yang aktif pada baris idx (default: candle terakhir)."""
    row = detect_patterns(df).iloc[idx]
    return [name for name, hit in row.items() if hit]


def pattern_score(names: list[str]) -> tuple[float, list[str], list[str]]:
    """Skor pola -1..+1 berdasarkan arah dan tingkat keberhasilan Bulkowski (bila ada)."""
    bull, bear = [], []
    score = 0.0
    for n in names:
        info = PATTERN_STATS.get(n)
        if not info:
            continue
        # Bobot = seberapa jauh di atas peluang acak (50%). Rate 0.78 -> 0.56; rate 0.53 -> 0.06; rate <0.5 -> 0.
        w = max(0.0, (info.bulkowski_rate or 0.5) - 0.5) * 2
        if info.direction == "bullish":
            bull.append(info.name)
            score += w
        elif info.direction == "bearish":
            bear.append(info.name)
            score -= w
    return max(-1.0, min(1.0, score)), bull, bear
