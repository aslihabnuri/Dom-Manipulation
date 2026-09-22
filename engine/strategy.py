"""Mesin sinyal swing trading (long-only, horizon 5-10 hari bursa).

Desain mengikuti konsensus sumber (lihat docs/METODOLOGI.md):
1. GERBANG WAJIB (semua harus lolos, kalau tidak skor = 0):
   - Likuiditas: nilai transaksi rata-rata 20 hari >= ambang (default Rp 2 miliar) dan harga >= Rp 50.
   - Tren jangka menengah: close > SMA50 dan close > SMA150 (Weinstein Stage 2 / Minervini kriteria 1 & 5).
   - Kekuatan tren: ADX(14) >= 20 dan +DI > -DI (Wilder).
   - Elder Impulse hari ini tidak "red" (EMA13 dan MACD-hist sama-sama turun = dilarang beli).
   - Tidak sedang ARA (tidak bisa dibeli) dan stop yang bisa dihitung dengan risiko <= 8% dari entry.
2. SKOR 0-100 (bobot: tren 30, momentum 25, volume 20, volatilitas/struktur 15, candlestick 10).
3. LEVEL: entry = buy-stop 1 fraksi di atas high kemarin (Elder screen 3); stop = yang lebih tinggi antara
   low 2 hari terakhir dan entry - 3*ATR(14) (Elder / Tharp); target 2R dan 3R; trailing Chandelier Exit;
   time-stop 10 hari bursa.
4. POSITION SIZING: Tharp/Elder - risiko per transaksi <= 1% ekuitas (default), lot = floor(risiko / (R * 100)).
"""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

import numpy as np
import pandas as pd

from . import idx_rules
from .candles import PATTERN_STATS, pattern_score, patterns_on
from .indicators import enrich, relative_strength


@dataclass
class StrategyConfig:
    min_value_idr: float = 2_000_000_000   # nilai transaksi rata-rata 20 hari minimum (Rp)
    min_price: int = idx_rules.min_price()
    adx_min: float = 20.0
    max_risk_pct: float = 0.08             # jarak stop maksimum dari entry
    atr_stop_mult: float = 3.0
    rr_target1: float = 2.0
    rr_target2: float = 3.0
    time_stop_days: int = 10
    risk_per_trade: float = 0.01           # 1% ekuitas (Tharp); Elder maks 2%
    max_position_pct: float = 0.20         # maksimum 20% ekuitas per saham
    min_score: float = 60.0                # skor minimum untuk masuk daftar kandidat


@dataclass
class TradePlan:
    entry: int
    stop: int
    target1: int
    target2: int
    risk_per_share: int
    risk_pct: float
    ara: int
    arb: int
    lots: int = 0
    position_value: float = 0.0
    risk_amount: float = 0.0
    time_stop_days: int = 10


@dataclass
class Analysis:
    ticker: str
    date: str
    close: float
    passed_gates: bool
    gate_failures: list[str]
    score: float
    raw_score: float
    components: dict[str, float]
    setup: str
    patterns_bullish: list[str]
    patterns_bearish: list[str]
    reasons: list[str]
    warnings: list[str]
    plan: TradePlan | None
    indicators: dict[str, Any]
    exit_signals: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        d = asdict(self)
        return d


def _f(x) -> float | None:
    try:
        if x is None or (isinstance(x, float) and np.isnan(x)):
            return None
        return float(x)
    except (TypeError, ValueError):
        return None


def _minervini_template(row: pd.Series, e: pd.DataFrame) -> tuple[int, list[str]]:
    """Kembalikan berapa dari 7 kriteria harga Trend Template Minervini yang terpenuhi (kriteria RS dinilai terpisah)."""
    checks = []
    c, s50, s150, s200 = row["close"], row["sma50"], row["sma150"], row["sma200"]
    s200_1m = e["sma200"].shift(21).iloc[-1]
    checks.append(("close > SMA150 & SMA200", c > s150 and c > s200))
    checks.append(("SMA150 > SMA200", s150 > s200))
    checks.append(("SMA200 naik >= 1 bulan", s200 > s200_1m))
    checks.append(("SMA50 > SMA150 > SMA200", s50 > s150 > s200))
    checks.append(("close > SMA50", c > s50))
    checks.append((">= 25% di atas low 52 minggu", c >= 1.25 * row["low52"]))
    checks.append(("<= 25% di bawah high 52 minggu", c >= 0.75 * row["high52"]))
    ok = [n for n, v in checks if bool(v) and not pd.isna(v)]
    return len(ok), ok


def analyze(ticker: str, df: pd.DataFrame, benchmark: pd.DataFrame | None = None,
            cfg: StrategyConfig | None = None, equity_idr: float | None = None) -> Analysis:
    cfg = cfg or StrategyConfig()
    if len(df) < 160:
        return Analysis(ticker, "-", float(df["close"].iloc[-1]) if len(df) else 0.0, False,
                        ["data historis < 160 hari"], 0.0, 0.0, {}, "-", [], [], [], [], None, {})
    e = enrich(df)
    if benchmark is not None and len(benchmark) > 70:
        e["rs63"] = relative_strength(e["close"], benchmark["close"], 63)
    else:
        e["rs63"] = np.nan
    row, prev = e.iloc[-1], e.iloc[-2]
    c = float(row["close"])
    tick = idx_rules.tick_size(c)
    atr = float(row["atr14"])
    reasons, warnings, failures = [], [], []

    # ---------- gerbang ----------
    if c < cfg.min_price:
        failures.append(f"harga < Rp {cfg.min_price}")
    if not (row["value_sma20"] >= cfg.min_value_idr):
        failures.append(f"nilai transaksi rata-rata 20 hari < Rp {cfg.min_value_idr/1e9:.1f} M")
    if not (c > row["sma50"] and c > row["sma150"]):
        failures.append("bukan tren naik (close di bawah SMA50/SMA150)")
    if not (row["adx"] >= cfg.adx_min):
        failures.append(f"tren lemah (ADX {row['adx']:.0f} < {cfg.adx_min:.0f})")
    elif not (row["plus_di"] > row["minus_di"]):
        failures.append(f"arah tren turun (-DI {row['minus_di']:.0f} > +DI {row['plus_di']:.0f})")
    if row["impulse"] == "red":
        failures.append("Elder Impulse merah (EMA13 & MACD-hist turun): dilarang beli")
    arb, ara = idx_rules.auto_rejection_limits(float(prev["close"]))
    if c >= ara:
        failures.append("sedang ARA, tidak bisa dibeli hari ini")

    # ---------- komponen skor ----------
    comp: dict[str, float] = {}

    # Tren (30)
    dist_high = c / row["high52"] - 1 if row["high52"] else -1
    t_high = 10 if dist_high >= -0.05 else 7 if dist_high >= -0.15 else 4 if dist_high >= -0.25 else 0
    slope50 = (row["sma50"] / e["sma50"].shift(10).iloc[-1] - 1) if not pd.isna(e["sma50"].shift(10).iloc[-1]) else 0
    t_slope = 10 if slope50 > 0.02 else 7 if slope50 > 0.005 else 3 if slope50 > 0 else 0
    rs = _f(row["rs63"])
    t_rs = 10 if rs and rs >= 1.10 else 6 if rs and rs >= 1.0 else 2 if rs else 5
    comp["trend"] = t_high + t_slope + t_rs
    n_tmpl, tmpl_ok = _minervini_template(row, e)
    reasons.append(f"Minervini Trend Template: {n_tmpl}/7 kriteria harga terpenuhi")
    if dist_high >= -0.05:
        reasons.append("harga <= 5% dari high 52 minggu (kekuatan relatif tinggi)")
    if rs and rs >= 1.10:
        reasons.append(f"mengungguli IHSG 3 bulan terakhir (RS {rs:.2f})")

    # Momentum (25)
    rsi_v, rsi_prev = float(row["rsi14"]), float(prev["rsi14"])
    rsi_up = rsi_v > rsi_prev
    if 40 <= rsi_v <= 60 and rsi_up:
        m_rsi = 10; reasons.append(f"RSI {rsi_v:.0f} di zona pullback bull-range (40-60) dan berbalik naik")
    elif 40 <= rsi_v <= 60:
        m_rsi = 7
    elif 60 < rsi_v <= 70:
        m_rsi = 6
    elif rsi_v > 70:
        m_rsi = 2; warnings.append(f"RSI {rsi_v:.0f} > 70: overbought, risiko chasing")
    else:
        m_rsi = 3; warnings.append(f"RSI {rsi_v:.0f} < 40: momentum lemah, Cardwell: rentang bull terancam")
    macd_cross = row["macd"] > row["signal"] and prev["macd"] <= prev["signal"]
    hist_up = row["hist"] > prev["hist"]
    if macd_cross:
        m_macd = 10; reasons.append("MACD baru memotong ke atas garis sinyal")
    elif hist_up and row["hist"] > 0:
        m_macd = 8
    elif hist_up:
        m_macd = 6; reasons.append("MACD-histogram naik (momentum turun mereda)")
    else:
        m_macd = 2
    fi_cross = row["force2"] > 0 and prev["force2"] < 0
    stoch_turn = row["stoch_k"] < 50 and row["stoch_k"] > prev["stoch_k"]
    m_osc = 5 if (fi_cross or stoch_turn) else 2 if row["force2"] > 0 else 0
    if fi_cross:
        reasons.append("Force Index(2) berbalik positif setelah pullback (Elder)")
    comp["momentum"] = m_rsi + m_macd + m_osc

    # Volume (20)
    vol_ratio = _f(row["vol_ratio"]) or 0
    up_day = c > float(prev["close"])
    last10 = e.iloc[-10:]
    up_vol = last10.loc[last10["close"] > last10["close"].shift(1), "volume"].sum()
    dn_vol = last10.loc[last10["close"] < last10["close"].shift(1), "volume"].sum()
    if vol_ratio >= 1.4 and up_day:
        v_brk = 10; reasons.append(f"volume {vol_ratio:.1f}x rata-rata 50 hari pada hari naik (O'Neil >= 1.4x)")
    elif up_vol > dn_vol:
        v_brk = 6; reasons.append("volume hari naik > volume hari turun (10 hari terakhir)")
    else:
        v_brk = 0; warnings.append("distribusi: volume hari turun mendominasi 10 hari terakhir")
    obv20max = e["obv"].iloc[-20:].max()
    v_obv = 5 if row["obv"] >= obv20max * (0.98 if obv20max > 0 else 1.02) else 0
    v_fi = 5 if row["force13"] > 0 else 0
    comp["volume"] = v_brk + v_obv + v_fi

    # Volatilitas / struktur (15)
    bw_hist = e["bandwidth"].iloc[-125:].dropna()
    bw_pct = float((bw_hist <= row["bandwidth"]).mean()) if len(bw_hist) > 20 else 0.5
    if bw_pct <= 0.20:
        s_sq = 10; reasons.append(f"Bollinger squeeze: bandwidth di persentil {bw_pct*100:.0f}% (6 bulan) -> potensi ekspansi")
    elif bw_pct <= 0.40:
        s_sq = 5
    else:
        s_sq = 0
    pb = _f(row["pct_b"])
    if pb is not None and 0.4 <= pb <= 0.9:
        s_pb = 5
    elif pb is not None and pb > 1.0:
        s_pb = 0; warnings.append("close di atas upper Bollinger Band: overextended")
    else:
        s_pb = 2
    comp["volatility"] = s_sq + s_pb

    # Candlestick (10)
    names = patterns_on(df)
    p_score, bulls, bears = pattern_score(names)
    comp["candle"] = float(np.clip(p_score * 10, -10, 10))
    for n in names:
        info = PATTERN_STATS[n]
        if info.direction == "bullish":
            reasons.append(f"pola {info.name} ({info.note})")
        elif info.direction == "bearish":
            warnings.append(f"pola bearish {info.name} ({info.note})")
        else:
            warnings.append(f"{info.name}: pasar ragu-ragu")

    raw_score = float(np.clip(sum(comp.values()), 0, 100))
    score = raw_score
    passed = not failures
    if not passed:
        score = 0.0

    # ---------- jenis setup ----------
    hi20 = e["high"].iloc[-21:-1].max()
    near_ma = abs(c - row["ema20"]) <= atr
    if c > hi20 and vol_ratio >= 1.4:
        setup = "breakout"
    elif near_ma and 40 <= rsi_v <= 60:
        setup = "pullback"
    elif bw_pct <= 0.20:
        setup = "squeeze"
    elif c > hi20:
        setup = "breakout-lemah (volume kurang)"
    else:
        setup = "tren-lanjutan"

    # ---------- rencana transaksi ----------
    plan = None
    entry = idx_rules.round_to_tick(float(row["high"]) + tick, "up")
    low2 = float(e["low"].iloc[-2:].min())
    stop_candidates = [low2 - idx_rules.tick_size(low2), entry - cfg.atr_stop_mult * atr]
    stop = idx_rules.round_to_tick(max(stop_candidates), "down")
    if stop >= entry:
        stop = idx_rules.round_to_tick(entry - 2 * atr, "down")
    r = entry - stop
    risk_pct = r / entry if entry else 1
    if risk_pct > cfg.max_risk_pct:
        failures.append(f"stop terlalu jauh ({risk_pct*100:.1f}% > {cfg.max_risk_pct*100:.0f}%)")
        passed = False
        score = 0.0
    if r > 0:
        t1 = idx_rules.round_to_tick(entry + cfg.rr_target1 * r, "down")
        t2 = idx_rules.round_to_tick(entry + cfg.rr_target2 * r, "down")
        plan = TradePlan(entry=entry, stop=stop, target1=t1, target2=t2, risk_per_share=int(r),
                         risk_pct=round(risk_pct, 4), ara=ara, arb=arb, time_stop_days=cfg.time_stop_days)
        if equity_idr:
            risk_amt = equity_idr * cfg.risk_per_trade
            lots = int(risk_amt // (r * idx_rules.LOT_SIZE))
            max_lots = int((equity_idr * cfg.max_position_pct) // (entry * idx_rules.LOT_SIZE))
            plan.lots = max(0, min(lots, max_lots))
            plan.position_value = plan.lots * idx_rules.LOT_SIZE * entry
            plan.risk_amount = plan.lots * idx_rules.LOT_SIZE * r
        if entry > ara:
            warnings.append("entry buy-stop di atas ARA besok: tunggu hari berikutnya")

    # ---------- sinyal keluar (untuk yang sudah pegang) ----------
    exits = []
    if c < row["chandelier"]:
        exits.append("close di bawah Chandelier Exit (22 hari high - 3 ATR)")
    if row["impulse"] == "red":
        exits.append("Elder Impulse merah")
    if bears:
        strong = [b for b in bears if any(v.name == b and (v.bulkowski_rate or 0) >= 0.7 for v in PATTERN_STATS.values())]
        if strong:
            exits.append("pola pembalikan bearish kuat: " + ", ".join(strong))
    if c < row["sma20"] - atr:
        exits.append("close > 1 ATR di bawah SMA20")

    ind = {
        "sma20": _f(row["sma20"]), "sma50": _f(row["sma50"]), "sma150": _f(row["sma150"]), "sma200": _f(row["sma200"]),
        "ema13": _f(row["ema13"]), "rsi14": round(rsi_v, 1), "macd": _f(row["macd"]), "macd_signal": _f(row["signal"]),
        "macd_hist": _f(row["hist"]), "adx": _f(row["adx"]), "plus_di": _f(row["plus_di"]), "minus_di": _f(row["minus_di"]),
        "atr14": round(atr, 1), "atr_pct": round(atr / c * 100, 2), "bb_upper": _f(row["bb_upper"]), "bb_lower": _f(row["bb_lower"]),
        "pct_b": _f(row["pct_b"]), "bandwidth_pctile": round(bw_pct * 100, 0), "stoch_k": _f(row["stoch_k"]),
        "vol_ratio": round(vol_ratio, 2), "value_avg20_idr": _f(row["value_sma20"]), "high52": _f(row["high52"]),
        "low52": _f(row["low52"]), "dist_high52_pct": round(dist_high * 100, 1), "rs63": rs, "impulse": row["impulse"],
        "stage": _f(row["stage"]), "chandelier": _f(row["chandelier"]), "minervini_template": f"{n_tmpl}/7",
        "minervini_ok": tmpl_ok, "patterns": names,
    }
    return Analysis(
        ticker=ticker.upper(), date=e.index[-1].strftime("%Y-%m-%d"), close=c, passed_gates=passed,
        gate_failures=failures, score=round(score, 1), raw_score=round(raw_score, 1), components=comp, setup=setup,
        patterns_bullish=bulls, patterns_bearish=bears, reasons=reasons, warnings=warnings,
        plan=plan, indicators=ind, exit_signals=exits,
    )
