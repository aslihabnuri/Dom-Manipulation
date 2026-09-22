"""Jalankan analisis untuk seluruh universe dan rangking hasilnya."""
from __future__ import annotations

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

from .data import BENCHMARK, get_many_async, get_ohlcv
from .strategy import Analysis, StrategyConfig, analyze
from .universe import default_universe

log = logging.getLogger(__name__)


async def screen_async(tickers: list[str] | None = None, cfg: StrategyConfig | None = None,
                       equity_idr: float | None = None, max_age: float = 900.0) -> dict:
    tickers = tickers or default_universe()
    cfg = cfg or StrategyConfig()
    data = await get_many_async([BENCHMARK] + tickers, max_age=max_age)
    bench = data.get(BENCHMARK)
    results: list[Analysis] = []

    def run(t):
        df = data.get(t)
        if df is None:
            return None
        try:
            return analyze(t, df, bench, cfg, equity_idr)
        except Exception as e:  # noqa: BLE001
            log.exception("analisis %s gagal: %s", t, e)
            return None

    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor(max_workers=4) as ex:
        outs = await asyncio.gather(*(loop.run_in_executor(ex, run, t) for t in tickers))
    results = [a for a in outs if a is not None]
    results.sort(key=lambda a: (a.passed_gates, a.score, sum(a.components.values())), reverse=True)
    candidates = [a for a in results if a.passed_gates and a.score >= cfg.min_score]
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "data_date": max((a.date for a in results), default="-"),
        "universe_size": len(tickers),
        "analyzed": len(results),
        "candidates": [a.to_dict() for a in candidates],
        "all": [a.to_dict() for a in results],
        "benchmark_close": float(bench["close"].iloc[-1]) if bench is not None else None,
    }


def screen(tickers: list[str] | None = None, **kw) -> dict:
    return asyncio.run(screen_async(tickers, **kw))


def analyze_one(ticker: str, cfg: StrategyConfig | None = None, equity_idr: float | None = None) -> Analysis:
    bench = get_ohlcv(BENCHMARK)
    return analyze(ticker, get_ohlcv(ticker), bench, cfg, equity_idr)
