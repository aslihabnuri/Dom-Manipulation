"""Bangun situs statis (untuk GitHub Pages) berisi hasil screener + detail tiap saham.

Output: site/
  index.html, app.js, styles.css, vendor/         salinan web/ dengan STATIC_MODE aktif
  data/bundle.json  (tanpa password)  atau  data/bundle.enc (AES-256-GCM, kunci dari password via PBKDF2)

Dipanggil oleh .github/workflows/update-site.yml setiap ~20 menit selama jam bursa.
Password diambil dari variabel lingkungan APP_PASSWORD; kosong = situs publik tanpa enkripsi.
"""
from __future__ import annotations

import asyncio
import base64
import gzip
import json
import logging
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from cryptography.hazmat.primitives import hashes  # noqa: E402
from cryptography.hazmat.primitives.ciphers.aead import AESGCM  # noqa: E402
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC  # noqa: E402

from engine import __version__, idx_rules  # noqa: E402
from engine.data import BENCHMARK, get_many_async  # noqa: E402
from engine.indicators import enrich  # noqa: E402
from engine.screener import screen_async  # noqa: E402
from engine.sentiment import analyze_sentiment  # noqa: E402
from engine.strategy import StrategyConfig  # noqa: E402
from engine.universe import LQ45, LQ45_PERIOD, company_name, default_universe  # noqa: E402

logging.basicConfig(level="INFO", format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("build_site")
SITE = ROOT / "site"
CHART_DAYS = 180
CHART_COLS = ["open", "high", "low", "close", "volume", "sma20", "sma50", "sma150", "ema13", "bb_upper", "bb_lower",
              "rsi14", "macd", "signal", "hist", "chandelier"]


def chart_payload(df) -> dict:
    e = enrich(df).iloc[-CHART_DAYS:]
    out = {"dates": [d.strftime("%Y-%m-%d") for d in e.index]}
    for c in CHART_COLS:
        out[c] = [None if (v != v) else round(float(v), 2) for v in e[c].tolist()]
    return out


async def build_bundle(equity: float) -> dict:
    tickers = default_universe()
    screen = await screen_async(tickers, StrategyConfig(), equity, max_age=0)
    data = await get_many_async(tickers, max_age=3600)
    detail: dict[str, dict] = {}
    analyses = {a["ticker"]: a for a in screen["all"]}
    for t in tickers:
        if t not in data or t not in analyses:
            continue
        detail[t] = {"analysis": {**analyses[t], "company": company_name(t)}, "chart": chart_payload(data[t])}
    # berita: sekuensial dengan jeda kecil agar tidak diblokir Google News
    loop = asyncio.get_running_loop()
    for t in detail:
        try:
            s = await loop.run_in_executor(None, analyze_sentiment, t, company_name(t))
            detail[t]["news"] = s.to_dict()
        except Exception as e:  # noqa: BLE001
            log.warning("berita %s gagal: %s", t, e)
            detail[t]["news"] = None
        await asyncio.sleep(0.5)
    return {
        "version": __version__, "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_wib": idx_rules.now_wib().strftime("%Y-%m-%d %H:%M WIB"), "market_phase": idx_rules.market_phase(),
        "default_equity": equity, "lq45_period": LQ45_PERIOD, "universe": tickers, "names": LQ45,
        "screen": {k: v for k, v in screen.items() if k != "all"} | {"all": screen["all"]},
        "detail": detail,
    }


def encrypt(raw: bytes, password: str) -> dict:
    salt, nonce = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=200_000).derive(password.encode())
    ct = AESGCM(key).encrypt(nonce, raw, None)
    b64 = lambda b: base64.b64encode(b).decode()  # noqa: E731
    return {"v": 1, "kdf": "PBKDF2-SHA256", "iter": 200_000, "salt": b64(salt), "nonce": b64(nonce), "ct": b64(ct), "gzip": True}


def main():
    equity = float(os.environ.get("DEFAULT_EQUITY", "100000000"))
    password = os.environ.get("APP_PASSWORD", "").strip()
    if not password and os.environ.get("ALLOW_PUBLIC") != "1":
        log.error("APP_PASSWORD belum diisi. Tambahkan secret APP_PASSWORD di GitHub (Settings > Secrets and variables > "
                  "Actions), atau set ALLOW_PUBLIC=1 bila memang ingin situs terbuka tanpa password.")
        sys.exit(2)
    bundle = asyncio.run(build_bundle(equity))
    if SITE.exists():
        shutil.rmtree(SITE)
    shutil.copytree(ROOT / "web", SITE)
    (SITE / "data").mkdir()
    html = (SITE / "index.html").read_text()
    html = html.replace("/static/", "./").replace(
        "<script src=\"./app.js\"></script>",
        f"<script>window.STATIC_MODE = true; window.STATIC_ENCRYPTED = {'true' if password else 'false'};</script>\n<script src=\"./app.js\"></script>",
    )
    (SITE / "index.html").write_text(html)
    (SITE / ".nojekyll").write_text("")
    raw = gzip.compress(json.dumps(bundle, ensure_ascii=False, separators=(",", ":")).encode())
    if password:
        (SITE / "data" / "bundle.enc").write_text(json.dumps(encrypt(raw, password)))
        log.info("bundle terenkripsi: %.0f KB, %d saham", len(raw) / 1024, len(bundle["detail"]))
    else:
        (SITE / "data" / "bundle.json.gz").write_bytes(raw)
        log.warning("APP_PASSWORD kosong: situs dipublikasikan TANPA enkripsi (%.0f KB)", len(raw) / 1024)
    (SITE / "data" / "meta.json").write_text(json.dumps({"generated_at": bundle["generated_at"], "encrypted": bool(password)}))


if __name__ == "__main__":
    main()
