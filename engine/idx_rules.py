"""Aturan mikrostruktur Bursa Efek Indonesia (BEI) yang relevan untuk swing trading.

Sumber utama: Peraturan BEI No. II-A (Perdagangan Efek Bersifat Ekuitas) dan
pengumuman BEI tentang Auto Rejection. Nilai default di sini diverifikasi
terhadap dokumen publik; lihat docs/METODOLOGI.md bagian "Aturan BEI".
Semua nilai dapat di-override lewat argumen fungsi bila BEI mengubah aturan.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date as _date, datetime, time, timedelta, timezone

WIB = timezone(timedelta(hours=7), name="WIB")
LOT_SIZE = 100  # 1 lot = 100 lembar saham

# Fraksi harga (tick size) Pasar Reguler: (batas bawah inklusif, batas atas eksklusif, tick)
TICK_TABLE = (
    (0, 200, 1),
    (200, 500, 2),
    (500, 2000, 5),
    (2000, 5000, 10),
    (5000, float("inf"), 25),
)

# Auto rejection Pasar Reguler, fraksi terhadap harga acuan (= harga penutupan sebelumnya).
# Aturan berubah bertahap (Kep-00136/BEI/09-2026, 21 Sep 2026):
#   - s.d. 27 Sep 2026 : harga min Rp50; ARA 35/25/20 %, ARB 15 % (asimetris, sejak 8 Apr 2025)
#   - 28 Sep - 31 Des 2026 : harga min Rp1; Rp1-10 -> ARA/ARB nominal Rp1; >10-200: 35/15; >200-5000: 25/15; >5000: 20/15
#   - mulai 1 Jan 2027 : simetris; Rp1-10 -> +-Rp1; >10-200: +-35 %; >200-5000: +-25 %; >5000: +-20 %
# Tabel: (batas bawah inklusif, batas atas inklusif, ara_pct, arb_pct). None = nominal Rp1.
_AR_PHASE0 = ((50, 200, 0.35, 0.15), (200, 5000, 0.25, 0.15), (5000, float("inf"), 0.20, 0.15))
_AR_PHASE1 = ((1, 10, None, None), (10, 200, 0.35, 0.15), (200, 5000, 0.25, 0.15), (5000, float("inf"), 0.20, 0.15))
_AR_PHASE2 = ((1, 10, None, None), (10, 200, 0.35, 0.35), (200, 5000, 0.25, 0.25), (5000, float("inf"), 0.20, 0.20))
_AR_PHASE1_START = _date(2026, 9, 28)
_AR_PHASE2_START = _date(2027, 1, 1)


def auto_rejection_table(on: _date | None = None):
    on = on or now_wib().date()
    if on >= _AR_PHASE2_START:
        return _AR_PHASE2
    if on >= _AR_PHASE1_START:
        return _AR_PHASE1
    return _AR_PHASE0


def min_price(on: _date | None = None) -> int:
    on = on or now_wib().date()
    return 1 if on >= _AR_PHASE1_START else 50


MIN_PRICE_MAIN_BOARD = 50  # nilai historis; gunakan min_price() untuk nilai yang berlaku

# Biaya transaksi ritel tipikal (fraksi dari nilai transaksi). Bisa berbeda per sekuritas.
DEFAULT_BUY_FEE = 0.0015   # 0.15 %
DEFAULT_SELL_FEE = 0.0025  # 0.25 % (sudah termasuk PPh final 0.1 %)


def tick_size(price: float) -> int:
    """Fraksi harga untuk harga tertentu."""
    for lo, hi, tick in TICK_TABLE:
        if lo <= price < hi:
            return tick
    raise ValueError(f"harga tidak valid: {price}")


def round_to_tick(price: float, direction: str = "nearest") -> int:
    """Bulatkan harga ke fraksi yang sah. direction: 'nearest' | 'down' | 'up'."""
    if price <= 0:
        raise ValueError("harga harus > 0")
    tick = tick_size(price)
    q = price / tick
    if direction == "down":
        n = int(q // 1)
    elif direction == "up":
        n = int(-(-q // 1))
    else:
        n = int(round(q))
    rounded = n * tick
    # Pembulatan bisa melompati batas band fraksi; koreksi sekali.
    if tick_size(rounded) != tick and direction != "down":
        rounded = round_to_tick(rounded, "down")
    return int(rounded)


def auto_rejection_limits(reference_price: float, on: _date | None = None) -> tuple[int, int]:
    """(ARB, ARA): batas bawah dan atas harga yang masih diterima JATS pada tanggal `on` (default hari ini)."""
    table = auto_rejection_table(on)
    for lo, hi, ara_pct, arb_pct in table:
        # batas atas inklusif: harga 200 masuk band 50-200 (ARA 35 %) sesuai teks peraturan ">200" untuk band berikutnya
        if lo <= reference_price <= hi:
            if ara_pct is None:
                return int(max(min_price(on), reference_price - 1)), int(reference_price + 1)
            ara = round_to_tick(reference_price * (1 + ara_pct), "down")
            arb = round_to_tick(reference_price * (1 - arb_pct), "up")
            return max(arb, min_price(on)), ara
    raise ValueError(f"harga acuan tidak valid: {reference_price}")


def auto_rejection_pct(reference_price: float, on: _date | None = None) -> tuple[float | None, float | None]:
    """(ara_pct, arb_pct) untuk harga acuan; None berarti nominal Rp1."""
    for lo, hi, ara_pct, arb_pct in auto_rejection_table(on):
        if lo <= reference_price <= hi:
            return ara_pct, arb_pct
    raise ValueError(f"harga acuan tidak valid: {reference_price}")


@dataclass(frozen=True)
class TradeCost:
    buy_fee: float = DEFAULT_BUY_FEE
    sell_fee: float = DEFAULT_SELL_FEE

    @property
    def round_trip(self) -> float:
        return self.buy_fee + self.sell_fee

    def break_even_move(self) -> float:
        """Kenaikan harga minimum (fraksi) agar impas setelah biaya beli+jual."""
        return (1 + self.buy_fee) / (1 - self.sell_fee) - 1


def lots_for_budget(budget_idr: float, price: float) -> int:
    """Jumlah lot maksimum yang bisa dibeli dengan dana tertentu (belum termasuk fee)."""
    if price <= 0:
        return 0
    return int(budget_idr // (price * LOT_SIZE))


# ---- Jam perdagangan Pasar Reguler (WIB), Peraturan II-A per 15 Des 2025 ----
# Senin-Kamis: sesi I 09:00-12:00, sesi II 13:30-15:49:59. Jumat: sesi I 09:00-11:30, sesi II 14:00-15:49:59.
# Pre-opening 08:45-08:59:59; pre-closing 15:50-16:01:59 (harga penutupan resmi); post-trading 16:02-16:15.
PRE_OPENING = (time(8, 45), time(9, 0))
PRE_CLOSING = (time(15, 50), time(16, 2))
POST_TRADING = (time(16, 2), time(16, 15))


def sessions_for(weekday: int) -> tuple[tuple[time, time], tuple[time, time]]:
    if weekday == 4:  # Jumat
        return (time(9, 0), time(11, 30)), (time(14, 0), time(15, 50))
    return (time(9, 0), time(12, 0)), (time(13, 30), time(15, 50))


def now_wib() -> datetime:
    return datetime.now(WIB)


def market_phase(ts: datetime | None = None) -> str:
    """Fase pasar: closed | pre_opening | session_1 | break | session_2 | pre_closing | post_trading."""
    ts = ts or now_wib()
    ts = ts.astimezone(WIB)
    if ts.weekday() >= 5:
        return "closed"
    s1, s2 = sessions_for(ts.weekday())
    t = ts.time()
    if PRE_OPENING[0] <= t < PRE_OPENING[1]:
        return "pre_opening"
    if s1[0] <= t < s1[1]:
        return "session_1"
    if s1[1] <= t < s2[0]:
        return "break"
    if s2[0] <= t < s2[1]:
        return "session_2"
    if PRE_CLOSING[0] <= t < PRE_CLOSING[1]:
        return "pre_closing"
    if POST_TRADING[0] <= t < POST_TRADING[1]:
        return "post_trading"
    return "closed"


def is_market_open(ts: datetime | None = None) -> bool:
    return market_phase(ts) in {"session_1", "session_2"}
