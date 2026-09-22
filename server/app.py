"""Server web: FastAPI + halaman statis. Dapat diakses teman lewat password bersama (APP_PASSWORD).

Endpoint:
  GET  /api/health             status pasar, waktu refresh terakhir
  GET  /api/screen             hasil screener terakhir (cache) ; ?refresh=1 memaksa hitung ulang
  GET  /api/analyze/{ticker}   analisis satu saham (+ ?equity=100000000 untuk position sizing)
  GET  /api/news/{ticker}      berita + sentimen
  GET  /api/chart/{ticker}     OHLCV + indikator untuk grafik
  GET  /api/universe           daftar saham yang dipindai
  POST /api/watchlist          tambah/hapus ticker di watchlist (body: {"add": [...], "remove": [...]})
  POST /api/login              {"password": "..."} -> cookie sesi

Refresh otomatis: setiap REFRESH_MINUTES (default 15) selama jam bursa, dan sekali setelah penutupan.
"""
from __future__ import annotations

import asyncio
import hmac
import logging
import os
import secrets
import time
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from engine import __version__, idx_rules
from engine.data import BENCHMARK, get_ohlcv
from engine.indicators import enrich
from engine.screener import screen_async
from engine.sentiment import analyze_sentiment
from engine.strategy import StrategyConfig, analyze
from engine.universe import LQ45, LQ45_PERIOD, WATCHLIST_FILE, company_name, default_universe, load_watchlist

load_dotenv()
logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("server")

APP_PASSWORD = os.environ.get("APP_PASSWORD", "")
REFRESH_MINUTES = int(os.environ.get("REFRESH_MINUTES", "15"))
DEFAULT_EQUITY = float(os.environ.get("DEFAULT_EQUITY", "100000000"))
WEB_DIR = Path(__file__).resolve().parent.parent / "web"
SESSION_TOKEN = secrets.token_urlsafe(32)

app = FastAPI(title="IDX Swing Engine", version=__version__)
_state: dict = {"screen": None, "last_run": None, "running": False, "error": None}
_sentiment_cache: dict[str, tuple[float, dict]] = {}
_lock = asyncio.Lock()


# ---------- auth ----------
def _authed(request: Request) -> bool:
    if not APP_PASSWORD:
        return True
    tok = request.cookies.get("session") or request.headers.get("x-session", "")
    return hmac.compare_digest(tok, SESSION_TOKEN)


def require_auth(request: Request):
    if not _authed(request):
        raise HTTPException(status_code=401, detail="login dulu")


class LoginBody(BaseModel):
    password: str


@app.post("/api/login")
async def login(body: LoginBody):
    if APP_PASSWORD and not hmac.compare_digest(body.password, APP_PASSWORD):
        await asyncio.sleep(1.0)  # perlambat brute force
        raise HTTPException(status_code=401, detail="password salah")
    resp = JSONResponse({"ok": True})
    resp.set_cookie("session", SESSION_TOKEN, httponly=True, samesite="lax", max_age=60 * 60 * 24 * 30,
                    secure=os.environ.get("COOKIE_SECURE", "0") == "1")
    return resp


@app.post("/api/logout")
async def logout():
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("session")
    return resp


# ---------- screener ----------
async def run_screen(force: bool = False) -> dict:
    async with _lock:
        if _state["screen"] and not force and _state["last_run"] and time.time() - _state["last_run"] < 60:
            return _state["screen"]
        _state["running"] = True
        try:
            res = await screen_async(default_universe(), StrategyConfig(), DEFAULT_EQUITY,
                                     max_age=0 if force else REFRESH_MINUTES * 60)
            _state["screen"], _state["last_run"], _state["error"] = res, time.time(), None
        except Exception as e:  # noqa: BLE001
            log.exception("screener gagal")
            _state["error"] = str(e)
        finally:
            _state["running"] = False
    return _state["screen"] or {"candidates": [], "all": [], "error": _state["error"]}


async def scheduler():
    await asyncio.sleep(2)
    await run_screen(force=True)
    last_close_run = None
    while True:
        phase = idx_rules.market_phase()
        today = idx_rules.now_wib().date()
        if phase in {"session_1", "session_2", "pre_closing"}:
            await asyncio.sleep(REFRESH_MINUTES * 60)
            await run_screen(force=True)
        elif phase == "post_trading" and last_close_run != today:
            await asyncio.sleep(120)
            await run_screen(force=True)
            last_close_run = today
        else:
            await asyncio.sleep(300)


@app.on_event("startup")
async def _startup():
    asyncio.create_task(scheduler())


@app.get("/api/health")
async def health(request: Request):
    return {
        "version": __version__, "market_phase": idx_rules.market_phase(), "now_wib": idx_rules.now_wib().isoformat(),
        "last_run": _state["last_run"], "running": _state["running"], "error": _state["error"],
        "auth_required": bool(APP_PASSWORD), "authed": _authed(request), "refresh_minutes": REFRESH_MINUTES,
        "data_source": "Yahoo Finance (delay ~10 menit)", "lq45_period": LQ45_PERIOD,
    }


@app.get("/api/screen", dependencies=[Depends(require_auth)])
async def api_screen(refresh: int = 0):
    res = await run_screen(force=bool(refresh))
    return res


@app.get("/api/analyze/{ticker}", dependencies=[Depends(require_auth)])
async def api_analyze(ticker: str, equity: float | None = None, risk: float = 0.01):
    ticker = ticker.upper()
    try:
        df = get_ohlcv(ticker)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=f"data {ticker} tidak ditemukan: {e}")
    bench = get_ohlcv(BENCHMARK)
    cfg = StrategyConfig(risk_per_trade=max(0.001, min(risk, 0.05)))
    a = analyze(ticker, df, bench, cfg, equity or DEFAULT_EQUITY)
    d = a.to_dict()
    d["company"] = company_name(ticker)
    return d


@app.get("/api/news/{ticker}", dependencies=[Depends(require_auth)])
async def api_news(ticker: str, refresh: int = 0):
    ticker = ticker.upper()
    cached = _sentiment_cache.get(ticker)
    if cached and not refresh and time.time() - cached[0] < 1800:
        return cached[1]
    loop = asyncio.get_running_loop()
    res = await loop.run_in_executor(None, analyze_sentiment, ticker, company_name(ticker))
    d = res.to_dict()
    _sentiment_cache[ticker] = (time.time(), d)
    return d


@app.get("/api/chart/{ticker}", dependencies=[Depends(require_auth)])
async def api_chart(ticker: str, days: int = 180):
    ticker = ticker.upper()
    try:
        df = get_ohlcv(ticker)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=404, detail=str(e))
    e = enrich(df).iloc[-days:]
    cols = ["open", "high", "low", "close", "volume", "sma20", "sma50", "sma150", "ema13", "bb_upper", "bb_lower",
            "rsi14", "macd", "signal", "hist", "chandelier"]
    out = {"ticker": ticker, "dates": [d.strftime("%Y-%m-%d") for d in e.index]}
    for c in cols:
        out[c] = [None if (v != v) else round(float(v), 2) for v in e[c].tolist()]
    return out


@app.get("/api/universe", dependencies=[Depends(require_auth)])
async def api_universe():
    return {"lq45": LQ45, "lq45_period": LQ45_PERIOD, "watchlist": load_watchlist(), "universe": default_universe()}


class WatchlistBody(BaseModel):
    add: list[str] = []
    remove: list[str] = []


@app.post("/api/watchlist", dependencies=[Depends(require_auth)])
async def api_watchlist(body: WatchlistBody):
    current = dict.fromkeys(load_watchlist())
    for t in body.add:
        t = t.strip().upper()
        if t and t.isalnum() and len(t) <= 6:
            current[t] = None
    for t in body.remove:
        current.pop(t.strip().upper(), None)
    WATCHLIST_FILE.parent.mkdir(parents=True, exist_ok=True)
    WATCHLIST_FILE.write_text("\n".join(current) + ("\n" if current else ""))
    return {"watchlist": list(current)}


# ---------- statis ----------
@app.get("/")
async def index():
    return FileResponse(WEB_DIR / "index.html")


app.mount("/static", StaticFiles(directory=str(WEB_DIR)), name="static")
