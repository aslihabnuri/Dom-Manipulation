"""Sentimen berita emiten.

Alur:
1. Ambil berita lewat Google News RSS (locale id-ID) dengan query kode saham + nama emiten. Google News
   mengagregasi Kontan, CNBC Indonesia, Bisnis.com, Investor.id, IDN Financials, Emitennews, dll.
2. Skor tiap judul dengan leksikon:
   - leksikon domain pasar modal (bawaan, di bawah), dan
   - leksikon umum InSet (Koto et al., 2017) bila file data/lexicon/positive.tsv & negative.tsv tersedia
     (unduh dengan scripts/download_lexicon.py).
3. Opsional: bila ANTHROPIC_API_KEY diset, judul-judul diklasifikasi oleh Claude (lebih akurat untuk
   bahasa yang ambigu seperti "right issue", "restrukturisasi"). Hasil LLM menggantikan skor leksikon.

Skor akhir: -1..+1 (rata-rata berbobot waktu, berita terbaru berbobot lebih besar) + label.
Perhatian: sentimen berita adalah *confirmer*, bukan pemicu sinyal. Berita di Indonesia sering terlambat
dari harga (harga bergerak dulu, berita menyusul).
"""
from __future__ import annotations

import logging
import os
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote_plus

import feedparser
import httpx

log = logging.getLogger(__name__)

LEXICON_DIR = Path(__file__).resolve().parent.parent / "data" / "lexicon"
GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q={q}&hl=id&gl=ID&ceid=ID:id"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Leksikon domain pasar modal Indonesia: frasa -> bobot (-3..+3). Frasa multi-kata dicek lebih dulu.
MARKET_LEXICON: dict[str, int] = {
    # positif
    "melesat": 3, "meroket": 3, "terbang": 2, "menguat": 2, "naik": 1, "rebound": 2, "cuan": 2, "laba naik": 3,
    "laba bersih naik": 3, "laba melonjak": 3, "pendapatan naik": 2, "tumbuh": 2, "pertumbuhan": 1, "rekor": 2,
    "tertinggi": 1, "dividen": 2, "bagi dividen": 3, "dividen interim": 2, "buyback": 2, "beli kembali": 2,
    "net buy": 3, "inflow": 2, "akumulasi": 2, "borong": 2, "diborong": 2, "target harga naik": 3, "upgrade": 2,
    "rekomendasi beli": 3, "beli": 1, "buy": 2, "overweight": 2, "outperform": 2, "positif": 2, "optimis": 2,
    "prospek cerah": 3, "kontrak baru": 2, "ekspansi": 2, "akuisisi": 1, "kemitraan": 1, "kerja sama": 1,
    "masuk lq45": 2, "masuk msci": 3, "masuk indeks": 2, "stock split": 1, "top gainers": 2, "top gainer": 2,
    "ara": 2, "auto rejection atas": 2, "menghijau": 2, "hijau": 1, "surplus": 1, "efisiensi": 1, "untung": 2,
    # negatif
    "anjlok": -3, "ambruk": -3, "rontok": -3, "terjun": -3, "melemah": -2, "turun": -1, "merosot": -2, "koreksi": -1,
    "rugi": -3, "merugi": -3, "rugi bersih": -3, "laba turun": -3, "laba anjlok": -3, "pendapatan turun": -2,
    "net sell": -3, "outflow": -2, "dilepas": -1, "jual": -1, "sell": -2, "underweight": -2, "underperform": -2,
    "downgrade": -2, "target harga turun": -3, "rekomendasi jual": -3, "negatif": -2, "pesimis": -2, "suspensi": -3,
    "disuspensi": -3, "suspend": -3, "uma": -2, "unusual market activity": -2, "gagal bayar": -3, "default": -3,
    "pkpu": -3, "pailit": -3, "bangkrut": -3, "delisting": -3, "sanksi": -2, "denda": -2, "diperiksa": -2,
    "kasus": -1, "korupsi": -3, "gugatan": -2, "digugat": -2, "utang": -1, "beban utang": -2, "gagal": -2,
    "keluar lq45": -2, "keluar msci": -3, "keluar indeks": -2, "arb": -2, "auto rejection bawah": -2, "top losers": -2,
    "top loser": -2, "memerah": -2, "merah": -1, "phk": -2, "pemutusan hubungan kerja": -2, "penurunan": -1,
    "defisit": -1, "right issue": -1, "private placement": -1, "dilusi": -2, "restrukturisasi": -1, "mundur": -1,
    "waspada": -1, "ambles": -3, "tekanan jual": -2, "profit taking": -1, "aksi jual": -2,
}
NEGATORS = ("tidak", "bukan", "belum", "tak", "gagal")


@dataclass
class NewsItem:
    title: str
    link: str
    source: str
    published: str
    score: float
    label: str
    method: str


@dataclass
class SentimentResult:
    ticker: str
    score: float           # -1..+1
    label: str             # positif | netral | negatif
    n_items: int
    n_positive: int
    n_negative: int
    method: str            # lexicon | llm | none
    items: list[NewsItem]
    fetched_at: str

    def to_dict(self) -> dict:
        return asdict(self)


# ---------- leksikon ----------
_inset_cache: dict[str, int] | None = None


def load_inset() -> dict[str, int]:
    global _inset_cache
    if _inset_cache is not None:
        return _inset_cache
    lex: dict[str, int] = {}
    for fn in ("positive.tsv", "negative.tsv"):
        p = LEXICON_DIR / fn
        if not p.exists():
            continue
        for line in p.read_text(encoding="utf-8", errors="ignore").splitlines()[1:]:
            parts = line.split("\t")
            if len(parts) >= 2:
                try:
                    lex[parts[0].strip().lower()] = int(float(parts[1]))
                except ValueError:
                    pass
    _inset_cache = lex
    return lex


def _normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9%\s\-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def lexicon_score(title: str) -> float:
    """Skor -1..+1 untuk satu judul. Frasa domain diprioritaskan; InSet melengkapi."""
    text = _normalize(title)
    inset = load_inset()
    total, hits = 0.0, 0
    consumed = text
    for phrase in sorted(MARKET_LEXICON, key=len, reverse=True):
        if re.search(rf"\b{re.escape(phrase)}\b", consumed):
            w = MARKET_LEXICON[phrase]
            # negasi sederhana: "tidak naik" -> balik tanda
            m = re.search(rf"\b(\w+)\s+{re.escape(phrase)}\b", consumed)
            if m and m.group(1) in NEGATORS:
                w = -w
            total += w
            hits += 1
            consumed = re.sub(rf"\b{re.escape(phrase)}\b", " ", consumed)
    if inset:
        for tok in consumed.split():
            if tok in inset:
                total += inset[tok] / 2.5  # InSet berbobot -5..+5; diskalakan ke domain
                hits += 1
    if hits == 0:
        return 0.0
    return max(-1.0, min(1.0, total / (3.0 * max(1, hits) ** 0.5)))


def label_for(score: float) -> str:
    if score >= 0.15:
        return "positif"
    if score <= -0.15:
        return "negatif"
    return "netral"


# ---------- pengambilan berita ----------
def fetch_news(ticker: str, company_name: str | None = None, max_items: int = 30, days: int = 14) -> list[dict]:
    q = f'"{ticker.upper()}" saham'
    if company_name:
        q = f'("{ticker.upper()}" OR "{company_name}") saham'
    url = GOOGLE_NEWS_RSS.format(q=quote_plus(q))
    try:
        r = httpx.get(url, headers=HEADERS, timeout=20.0, follow_redirects=True)
        r.raise_for_status()
    except Exception as e:  # noqa: BLE001
        log.warning("gagal ambil berita %s: %s", ticker, e)
        return []
    feed = feedparser.parse(r.text)
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    out = []
    for e in feed.entries[:max_items * 2]:
        try:
            pub = datetime(*e.published_parsed[:6], tzinfo=timezone.utc)
        except Exception:  # noqa: BLE001
            pub = datetime.now(timezone.utc)
        if pub < cutoff:
            continue
        title = re.sub(r"\s+-\s+[^-]+$", "", e.title)  # buang " - NamaMedia" di akhir judul
        out.append({"title": title, "link": e.link, "source": (e.get("source") or {}).get("title", ""),
                    "published": pub.isoformat()})
        if len(out) >= max_items:
            break
    return out


# ---------- klasifikasi LLM (opsional) ----------
def llm_available() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY")) and os.environ.get("SENTIMENT_LLM", "1") != "0"


def llm_classify(ticker: str, titles: list[str]) -> list[float] | None:
    """Klasifikasi judul berita dengan Claude. Mengembalikan skor -1..+1 per judul, atau None bila gagal."""
    if not titles:
        return []
    try:
        import anthropic
        from pydantic import BaseModel
    except ImportError:
        log.warning("paket anthropic/pydantic tidak terpasang; pakai leksikon")
        return None

    class Item(BaseModel):
        index: int
        score: float   # -1 sangat negatif .. +1 sangat positif untuk pemegang saham
        reason: str

    class Result(BaseModel):
        items: list[Item]

    numbered = "\n".join(f"{i}. {t}" for i, t in enumerate(titles))
    prompt = (
        f"Berikut judul berita tentang emiten saham Indonesia dengan kode {ticker.upper()}. "
        "Untuk tiap judul, nilai dampaknya bagi pemegang saham {ticker} dalam horizon 1-2 minggu: "
        "score dari -1.0 (sangat negatif) sampai +1.0 (sangat positif); 0 bila netral, tidak relevan, "
        "atau hanya laporan harga harian tanpa informasi baru. Pertimbangkan konteks pasar modal Indonesia "
        "(mis. net sell asing = negatif, right issue untuk bayar utang = negatif, buyback = positif, "
        "UMA/suspensi = negatif). Kembalikan semua index.\n\n" + numbered
    )
    try:
        client = anthropic.Anthropic()
        resp = client.messages.parse(
            model=os.environ.get("SENTIMENT_MODEL", "claude-opus-5"),
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
            output_format=Result,
        )
        parsed = resp.parsed_output
        scores = [0.0] * len(titles)
        for it in parsed.items:
            if 0 <= it.index < len(titles):
                scores[it.index] = max(-1.0, min(1.0, it.score))
        return scores
    except anthropic.RateLimitError:
        log.warning("Anthropic rate limit; pakai leksikon")
    except anthropic.APIStatusError as e:
        log.warning("Anthropic API error %s; pakai leksikon", e.status_code)
    except anthropic.APIConnectionError:
        log.warning("Anthropic koneksi gagal; pakai leksikon")
    except Exception as e:  # noqa: BLE001
        log.warning("LLM sentiment gagal: %s", e)
    return None


# ---------- agregasi ----------
def analyze_sentiment(ticker: str, company_name: str | None = None, use_llm: bool | None = None) -> SentimentResult:
    raw = fetch_news(ticker, company_name)
    now = datetime.now(timezone.utc)
    method = "none"
    scores: list[float] | None = None
    if raw and (use_llm if use_llm is not None else llm_available()):
        scores = llm_classify(ticker, [r["title"] for r in raw])
        if scores is not None:
            method = "llm"
    if raw and scores is None:
        scores = [lexicon_score(r["title"]) for r in raw]
        method = "lexicon"
    items: list[NewsItem] = []
    wsum, wtot = 0.0, 0.0
    for r, s in zip(raw, scores or []):
        age_days = max(0.0, (now - datetime.fromisoformat(r["published"])).total_seconds() / 86400)
        w = 0.5 ** (age_days / 5.0)  # half-life 5 hari
        wsum += w * s
        wtot += w
        items.append(NewsItem(r["title"], r["link"], r["source"], r["published"], round(s, 2), label_for(s), method))
    score = wsum / wtot if wtot else 0.0
    return SentimentResult(
        ticker=ticker.upper(), score=round(score, 3), label=label_for(score), n_items=len(items),
        n_positive=sum(1 for i in items if i.label == "positif"),
        n_negative=sum(1 for i in items if i.label == "negatif"),
        method=method, items=items, fetched_at=now.isoformat(),
    )
