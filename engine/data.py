"""Pengambilan data OHLCV saham BEI.

Sumber default: Yahoo Finance chart API (ticker SYMBOL.JK). Data ini *delayed* (bukan real-time bursa)
dan gratis; cukup untuk swing trading berbasis candle harian. Untuk data real-time resmi, ganti
`fetch_ohlcv` dengan feed berbayar dari sekuritas/vendor data BEI.

Cache: CSV di data/cache/<TICKER>.csv agar screener tidak memukul API berulang-ulang.
"""
from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx
import pandas as pd

log = logging.getLogger(__name__)

CACHE_DIR = Path(__file__).resolve().parent.parent / "data" / "cache"
YF_HOSTS = ("https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com")
HEADERS = {"User-Agent": "Mozilla/5.0"}  # UA panjang ala Chrome justru kena 429 dari Yahoo
BENCHMARK = "^JKSE"  # IHSG


def yf_symbol(ticker: str) -> str:
    t = ticker.upper().strip()
    if t.startswith("^") or t.endswith(".JK"):
        return t
    return f"{t}.JK"


def _parse_chart(payload: dict) -> pd.DataFrame:
    res = payload["chart"]["result"][0]
    ts = res.get("timestamp") or []
    q = res["indicators"]["quote"][0]
    df = pd.DataFrame(
        {
            "open": q.get("open"), "high": q.get("high"), "low": q.get("low"),
            "close": q.get("close"), "volume": q.get("volume"),
        },
        index=pd.to_datetime(ts, unit="s", utc=True).tz_convert("Asia/Jakarta").normalize().tz_localize(None),
    )
    df.index.name = "date"
    df = df.dropna(subset=["close"])
    df = df[~df.index.duplicated(keep="last")]
    df["volume"] = df["volume"].fillna(0).astype("int64")
    return df.sort_index()


def fetch_ohlcv_sync(ticker: str, range_: str = "2y", interval: str = "1d", timeout: float = 20.0) -> pd.DataFrame:
    sym = yf_symbol(ticker)
    last_err: Exception | None = None
    for host in YF_HOSTS:
        url = f"{host}/v8/finance/chart/{sym}"
        try:
            r = httpx.get(url, params={"range": range_, "interval": interval, "events": "div,split"},
                          headers=HEADERS, timeout=timeout)
            if r.status_code == 429:
                last_err = RuntimeError("HTTP 429 rate limit")
                time.sleep(1.5)
                continue
            r.raise_for_status()
            return _parse_chart(r.json())
        except Exception as e:  # noqa: BLE001
            last_err = e
            log.warning("gagal ambil %s dari %s: %s", sym, host, e)
    raise RuntimeError(f"tidak bisa mengambil data {sym}: {last_err}")


async def fetch_ohlcv_async(client: httpx.AsyncClient, ticker: str, range_: str = "2y", interval: str = "1d") -> pd.DataFrame:
    sym = yf_symbol(ticker)
    last_err: Exception | None = None
    for host in YF_HOSTS:
        try:
            r = await client.get(f"{host}/v8/finance/chart/{sym}",
                                 params={"range": range_, "interval": interval, "events": "div,split"})
            if r.status_code == 429:
                last_err = RuntimeError("HTTP 429 rate limit")
                await asyncio.sleep(1.5)
                continue
            r.raise_for_status()
            return _parse_chart(r.json())
        except Exception as e:  # noqa: BLE001
            last_err = e
    raise RuntimeError(f"tidak bisa mengambil data {sym}: {last_err}")


def _cache_path(ticker: str) -> Path:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return CACHE_DIR / f"{yf_symbol(ticker).replace('^', 'IDX_')}.csv"


def load_cached(ticker: str) -> pd.DataFrame | None:
    p = _cache_path(ticker)
    if not p.exists():
        return None
    df = pd.read_csv(p, index_col="date", parse_dates=["date"])
    return df


def cache_age_seconds(ticker: str) -> float | None:
    p = _cache_path(ticker)
    if not p.exists():
        return None
    return time.time() - p.stat().st_mtime


def save_cache(ticker: str, df: pd.DataFrame) -> None:
    df.to_csv(_cache_path(ticker))


def get_ohlcv(ticker: str, max_age: float = 900.0, range_: str = "2y") -> pd.DataFrame:
    """Ambil data dari cache bila masih segar (<max_age detik), selain itu unduh ulang."""
    age = cache_age_seconds(ticker)
    if age is not None and age < max_age:
        cached = load_cached(ticker)
        if cached is not None and len(cached) > 50:
            return cached
    try:
        df = fetch_ohlcv_sync(ticker, range_=range_)
        save_cache(ticker, df)
        return df
    except Exception:
        cached = load_cached(ticker)
        if cached is not None:
            log.warning("pakai cache lama untuk %s", ticker)
            return cached
        raise


async def get_many_async(tickers: list[str], max_age: float = 900.0, concurrency: int = 4, range_: str = "2y") -> dict[str, pd.DataFrame]:
    """Ambil banyak ticker secara paralel (dibatasi agar tidak kena rate limit Yahoo)."""
    out: dict[str, pd.DataFrame] = {}
    todo = []
    for t in tickers:
        age = cache_age_seconds(t)
        cached = load_cached(t) if age is not None and age < max_age else None
        if cached is not None and len(cached) > 50:
            out[t] = cached
        else:
            todo.append(t)
    if not todo:
        return out
    sem = asyncio.Semaphore(concurrency)
    async with httpx.AsyncClient(headers=HEADERS, timeout=20.0) as client:
        async def one(t: str):
            async with sem:
                try:
                    df = await fetch_ohlcv_async(client, t, range_=range_)
                    save_cache(t, df)
                    out[t] = df
                except Exception as e:  # noqa: BLE001
                    log.warning("lewati %s: %s", t, e)
                    cached = load_cached(t)
                    if cached is not None:
                        out[t] = cached
                await asyncio.sleep(0.25)
        await asyncio.gather(*(one(t) for t in todo))
    return out


def last_updated(df: pd.DataFrame) -> str:
    return df.index[-1].strftime("%Y-%m-%d") if len(df) else "-"
