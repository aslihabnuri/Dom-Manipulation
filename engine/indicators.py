"""Indikator teknikal (implementasi pandas murni, tanpa TA-Lib).

Parameter default mengikuti definisi penulis aslinya:
- RSI, ATR, ADX/DMI, Parabolic SAR : J. Welles Wilder, *New Concepts in Technical Trading Systems* (1978)
- MACD (12, 26, 9)                  : Gerald Appel; dibahas Murphy bab 10
- Bollinger Bands (20, 2)           : John Bollinger, *Bollinger on Bollinger Bands*
- Force Index, EMA 13, Impulse      : Alexander Elder, *Trading for a Living*, *Come Into My Trading Room*
- OBV                               : Joseph Granville; Murphy bab 7
- Stochastic (14, 3, 3)             : George Lane; Murphy bab 10

Semua fungsi menerima DataFrame OHLCV dengan kolom: open, high, low, close, volume
(indeks = tanggal, urut naik) dan mengembalikan Series/DataFrame dengan indeks yang sama.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def sma(s: pd.Series, n: int) -> pd.Series:
    return s.rolling(n, min_periods=n).mean()


def ema(s: pd.Series, n: int) -> pd.Series:
    return s.ewm(span=n, adjust=False, min_periods=n).mean()


def wilder_smooth(s: pd.Series, n: int) -> pd.Series:
    """Rata-rata bergerak Wilder (RMA): alpha = 1/n, diinisialisasi dengan SMA n periode."""
    return s.ewm(alpha=1.0 / n, adjust=False, min_periods=n).mean()


def rsi(close: pd.Series, n: int = 14) -> pd.Series:
    """RSI Wilder. >70 overbought, <30 oversold (Wilder). Cardwell: bull range 40-80, bear range 20-60."""
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = (-delta).clip(lower=0.0)
    avg_gain = wilder_smooth(gain, n)
    avg_loss = wilder_smooth(loss, n)
    rs = avg_gain / avg_loss.replace(0, np.nan)
    out = 100 - 100 / (1 + rs)
    out = out.where(avg_loss != 0, 100.0)
    return out


def macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> pd.DataFrame:
    line = ema(close, fast) - ema(close, slow)
    sig = ema(line, signal)
    return pd.DataFrame({"macd": line, "signal": sig, "hist": line - sig})


def true_range(df: pd.DataFrame) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [df["high"] - df["low"], (df["high"] - prev_close).abs(), (df["low"] - prev_close).abs()],
        axis=1,
    ).max(axis=1)
    return tr


def atr(df: pd.DataFrame, n: int = 14) -> pd.Series:
    return wilder_smooth(true_range(df), n)


def adx(df: pd.DataFrame, n: int = 14) -> pd.DataFrame:
    """ADX, +DI, -DI (Wilder). ADX > 25 = tren kuat; +DI > -DI = tren naik."""
    up = df["high"].diff()
    down = -df["low"].diff()
    plus_dm = pd.Series(np.where((up > down) & (up > 0), up, 0.0), index=df.index)
    minus_dm = pd.Series(np.where((down > up) & (down > 0), down, 0.0), index=df.index)
    tr_s = wilder_smooth(true_range(df), n)
    plus_di = 100 * wilder_smooth(plus_dm, n) / tr_s
    minus_di = 100 * wilder_smooth(minus_dm, n) / tr_s
    dx = 100 * (plus_di - minus_di).abs() / (plus_di + minus_di).replace(0, np.nan)
    adx_s = wilder_smooth(dx, n)
    return pd.DataFrame({"adx": adx_s, "plus_di": plus_di, "minus_di": minus_di})


def bollinger(close: pd.Series, n: int = 20, k: float = 2.0) -> pd.DataFrame:
    mid = sma(close, n)
    sd = close.rolling(n, min_periods=n).std(ddof=0)
    upper, lower = mid + k * sd, mid - k * sd
    pct_b = (close - lower) / (upper - lower).replace(0, np.nan)
    bandwidth = (upper - lower) / mid
    return pd.DataFrame({"bb_mid": mid, "bb_upper": upper, "bb_lower": lower, "pct_b": pct_b, "bandwidth": bandwidth})


def stochastic(df: pd.DataFrame, n: int = 14, k_smooth: int = 3, d_smooth: int = 3) -> pd.DataFrame:
    ll = df["low"].rolling(n, min_periods=n).min()
    hh = df["high"].rolling(n, min_periods=n).max()
    raw_k = 100 * (df["close"] - ll) / (hh - ll).replace(0, np.nan)
    k = raw_k.rolling(k_smooth, min_periods=k_smooth).mean()
    d = k.rolling(d_smooth, min_periods=d_smooth).mean()
    return pd.DataFrame({"stoch_k": k, "stoch_d": d})


def obv(df: pd.DataFrame) -> pd.Series:
    direction = np.sign(df["close"].diff()).fillna(0)
    return (direction * df["volume"]).cumsum()


def force_index(df: pd.DataFrame, n: int = 13) -> pd.Series:
    """Elder Force Index = (close - close_prev) * volume, dihaluskan EMA-n (2 untuk sinyal harian, 13 untuk tren)."""
    raw = df["close"].diff() * df["volume"]
    return ema(raw, n)


def relative_strength(close: pd.Series, benchmark: pd.Series, n: int = 63) -> pd.Series:
    """Relative strength vs benchmark (mis. IHSG): rasio return n-hari saham / return n-hari benchmark."""
    b = benchmark.reindex(close.index).ffill()
    return (close / close.shift(n)) / (b / b.shift(n))


def chandelier_exit(df: pd.DataFrame, n: int = 22, mult: float = 3.0) -> pd.Series:
    """Chandelier Exit (Chuck LeBeau, dipopulerkan Elder): highest high n-hari - mult * ATR."""
    return df["high"].rolling(n, min_periods=n).max() - mult * atr(df, 22)


def impulse_system(df: pd.DataFrame) -> pd.Series:
    """Elder Impulse System: 'green' bila EMA13 naik dan MACD-hist naik; 'red' bila keduanya turun; else 'blue'."""
    e = ema(df["close"], 13)
    h = macd(df["close"])["hist"]
    e_up, h_up = e.diff() > 0, h.diff() > 0
    e_dn, h_dn = e.diff() < 0, h.diff() < 0
    out = pd.Series("blue", index=df.index)
    out[e_up & h_up] = "green"
    out[e_dn & h_dn] = "red"
    return out


def weinstein_stage(df: pd.DataFrame) -> pd.Series:
    """Stage analysis Weinstein pada data harian: MA 150 hari ~ MA 30 minggu.
    stage 2 (advance): close > MA150 dan MA150 naik; stage 4 (decline): close < MA150 dan MA150 turun;
    stage 1/3 (basing/topping): sisanya."""
    ma = sma(df["close"], 150)
    slope = ma.diff(5)
    stage = pd.Series(np.nan, index=df.index)
    stage[(df["close"] > ma) & (slope > 0)] = 2
    stage[(df["close"] < ma) & (slope < 0)] = 4
    stage[(df["close"] >= ma) & (slope <= 0)] = 3
    stage[(df["close"] <= ma) & (slope >= 0)] = 1
    return stage


def enrich(df: pd.DataFrame) -> pd.DataFrame:
    """Tambahkan semua indikator standar ke DataFrame OHLCV."""
    out = df.copy()
    c = out["close"]
    out["sma20"], out["sma50"], out["sma150"], out["sma200"] = sma(c, 20), sma(c, 50), sma(c, 150), sma(c, 200)
    out["ema13"], out["ema20"], out["ema50"] = ema(c, 13), ema(c, 20), ema(c, 50)
    out["rsi14"] = rsi(c, 14)
    out = out.join(macd(c))
    out["atr14"] = atr(out, 14)
    out = out.join(adx(out, 14))
    out = out.join(bollinger(c, 20, 2.0))
    out = out.join(stochastic(out, 14, 3, 3))
    out["obv"] = obv(out)
    out["force13"] = force_index(out, 13)
    out["force2"] = force_index(out, 2)
    out["vol_sma20"] = sma(out["volume"], 20)
    out["vol_sma50"] = sma(out["volume"], 50)
    out["vol_ratio"] = out["volume"] / out["vol_sma50"].replace(0, np.nan)
    out["high52"] = out["high"].rolling(252, min_periods=120).max()
    out["low52"] = out["low"].rolling(252, min_periods=120).min()
    out["chandelier"] = chandelier_exit(out)
    out["impulse"] = impulse_system(out)
    out["stage"] = weinstein_stage(out)
    out["value_sma20"] = sma(out["close"] * out["volume"], 20)  # nilai transaksi rata-rata (Rp)
    return out
