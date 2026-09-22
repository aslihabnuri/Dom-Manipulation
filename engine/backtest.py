"""Backtest sederhana (event-driven, harian) untuk menguji aturan strategi dengan biaya BEI.

Aturan simulasi (mengikuti strategy.py):
- Hari T: hitung sinyal pada close. Bila lolos gerbang & skor >= min_score -> pasang buy-stop di high T + 1 fraksi.
- Hari T+1: terisi bila high >= entry (harga isi = max(open, entry)); bila open > ARA/di atas entry+1 ATR -> lewati.
- Stop awal: dari rencana. Trailing: stop = max(stop, chandelier) setelah 3 hari. Target1 (2R): jual separuh
  (disederhanakan: jual semua di target2 = 3R atau stop, atau time-stop 10 hari, atau exit signal).
- Biaya: beli 0.15 %, jual 0.25 %; slippage 1 fraksi tiap sisi.
- Satu posisi per saham, maksimum N posisi bersamaan, risiko 1 % ekuitas per posisi.

Ini bukan simulasi tick-level; angka yang keluar adalah estimasi kasar untuk membandingkan aturan, bukan janji return.
"""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass

import numpy as np
import pandas as pd

from . import idx_rules
from .data import BENCHMARK, get_ohlcv
from .indicators import enrich
from .strategy import StrategyConfig, analyze
from .universe import default_universe


@dataclass
class Trade:
    ticker: str
    entry_date: str
    exit_date: str
    entry: float
    exit: float
    stop: float
    lots: int
    pnl_idr: float
    r_multiple: float
    days: int
    reason: str


def _simulate_ticker(ticker: str, df: pd.DataFrame, bench: pd.DataFrame, cfg: StrategyConfig,
                     equity: float, start_idx: int, cost: idx_rules.TradeCost) -> list[Trade]:
    trades: list[Trade] = []
    e = enrich(df)
    i = start_idx
    n = len(df)
    while i < n - 2:
        window = df.iloc[: i + 1]
        a = analyze(ticker, window, bench.loc[: window.index[-1]], cfg, equity)
        if not (a.passed_gates and a.score >= cfg.min_score and a.plan and a.plan.lots > 0):
            i += 1
            continue
        plan = a.plan
        nxt = df.iloc[i + 1]
        tick = idx_rules.tick_size(plan.entry)
        if nxt["high"] < plan.entry or nxt["open"] > plan.entry + float(e["atr14"].iloc[i]):
            i += 1
            continue
        fill = max(float(nxt["open"]), plan.entry) + tick
        stop = float(plan.stop)
        initial_risk = max(1.0, fill - stop)  # R dihitung dari risiko awal, bukan stop yang sudah di-trail
        target = float(plan.target2)
        lots = plan.lots
        shares = lots * idx_rules.LOT_SIZE
        entry_i = i + 1
        exit_price, reason, exit_i = None, "", None
        for j in range(entry_i + 1, min(n, entry_i + cfg.time_stop_days + 1)):
            row = df.iloc[j]
            if j - entry_i >= 3:
                ch = e["chandelier"].iloc[j - 1]
                if not np.isnan(ch):
                    stop = max(stop, idx_rules.round_to_tick(ch, "down"))
            if row["open"] <= stop:
                exit_price, reason, exit_i = float(row["open"]) - tick, "gap-stop", j; break
            if row["low"] <= stop:
                exit_price, reason, exit_i = stop - tick, "stop", j; break
            if row["high"] >= target:
                exit_price, reason, exit_i = target, "target-3R", j; break
            if row["close"] < e["chandelier"].iloc[j] and j - entry_i >= 3:
                exit_price, reason, exit_i = float(row["close"]) - tick, "chandelier-close", j; break
        if exit_price is None:
            exit_i = min(n - 1, entry_i + cfg.time_stop_days)
            exit_price, reason = float(df.iloc[exit_i]["close"]) - tick, "time-stop"
        gross = (exit_price - fill) * shares
        fees = fill * shares * cost.buy_fee + exit_price * shares * cost.sell_fee
        pnl = gross - fees
        r = (exit_price - fill) / initial_risk
        trades.append(Trade(ticker, df.index[entry_i].strftime("%Y-%m-%d"), df.index[exit_i].strftime("%Y-%m-%d"),
                            fill, exit_price, stop, lots, round(pnl), round(r, 2), exit_i - entry_i, reason))
        i = exit_i + 1
    return trades


def run_backtest(tickers: list[str] | None = None, equity: float = 100_000_000, cfg: StrategyConfig | None = None,
                 lookback_days: int = 250) -> dict:
    cfg = cfg or StrategyConfig()
    tickers = tickers or default_universe()
    bench = get_ohlcv(BENCHMARK)
    cost = idx_rules.TradeCost()
    all_trades: list[Trade] = []
    for t in tickers:
        try:
            df = get_ohlcv(t)
        except Exception:  # noqa: BLE001
            continue
        if len(df) < 200:
            continue
        start = max(160, len(df) - lookback_days)
        all_trades += _simulate_ticker(t, df, bench, cfg, equity, start, cost)
    return summarize(all_trades, equity)


def summarize(trades: list[Trade], equity: float) -> dict:
    if not trades:
        return {"n_trades": 0, "note": "tidak ada transaksi yang memenuhi aturan pada periode ini"}
    pnl = np.array([t.pnl_idr for t in trades])
    rs = np.array([t.r_multiple for t in trades])
    wins = pnl > 0
    gross_win, gross_loss = pnl[wins].sum(), -pnl[~wins].sum()
    return {
        "n_trades": len(trades),
        "win_rate": round(float(wins.mean()), 3),
        "avg_r": round(float(rs.mean()), 3),
        "expectancy_r": round(float(rs.mean()), 3),
        "profit_factor": round(float(gross_win / gross_loss), 2) if gross_loss > 0 else None,
        "total_pnl_idr": round(float(pnl.sum())),
        "total_return_pct": round(float(pnl.sum() / equity * 100), 2),
        "avg_days": round(float(np.mean([t.days for t in trades])), 1),
        "max_drawdown_idr": round(float(_max_dd(pnl))),
        "by_reason": {r: int(sum(1 for t in trades if t.reason == r)) for r in sorted({t.reason for t in trades})},
        "trades": [asdict(t) for t in trades],
    }


def _max_dd(pnl: np.ndarray) -> float:
    eq = np.cumsum(pnl)
    peak = np.maximum.accumulate(np.concatenate([[0.0], eq]))[1:]
    return float((eq - peak).min())


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Backtest strategi swing pada universe LQ45")
    ap.add_argument("--tickers", nargs="*", help="kode saham; default LQ45")
    ap.add_argument("--equity", type=float, default=100_000_000)
    ap.add_argument("--days", type=int, default=250)
    ap.add_argument("--min-score", type=float, default=60)
    args = ap.parse_args()
    cfg = StrategyConfig(min_score=args.min_score)
    res = run_backtest(args.tickers, args.equity, cfg, args.days)
    trades = res.pop("trades", [])
    print(json.dumps(res, indent=2, ensure_ascii=False))
    for t in trades[-15:]:
        print(f"{t['ticker']:5} {t['entry_date']} -> {t['exit_date']} {t['entry']:>7.0f} -> {t['exit']:>7.0f} "
              f"R={t['r_multiple']:>5} {t['reason']}")
