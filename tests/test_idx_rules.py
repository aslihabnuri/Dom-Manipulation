from datetime import date, datetime

from engine import idx_rules as r


def test_tick_size_bands():
    assert r.tick_size(150) == 1
    assert r.tick_size(200) == 2
    assert r.tick_size(499) == 2
    assert r.tick_size(500) == 5
    assert r.tick_size(1999) == 5
    assert r.tick_size(2000) == 10
    assert r.tick_size(4990) == 10
    assert r.tick_size(5000) == 25


def test_round_to_tick():
    assert r.round_to_tick(1234) == 1235
    assert r.round_to_tick(1234, "down") == 1230
    assert r.round_to_tick(1231, "up") == 1235
    assert r.round_to_tick(6237.5, "down") == 6225


def test_auto_rejection_phases():
    # sebelum 28 Sep 2026: ARB 15% asimetris
    assert r.auto_rejection_limits(1000, date(2026, 9, 22)) == (850, 1250)
    # fase 1: Rp1-10 nominal
    assert r.auto_rejection_limits(5, date(2026, 10, 1)) == (4, 6)
    assert r.auto_rejection_limits(200, date(2026, 10, 1)) == (170, 270)
    # fase 2 (2027): simetris
    assert r.auto_rejection_limits(1000, date(2027, 1, 5)) == (750, 1250)
    assert r.auto_rejection_limits(6000, date(2027, 2, 1)) == (4800, 7200)
    assert r.min_price(date(2026, 9, 27)) == 50 and r.min_price(date(2026, 9, 28)) == 1


def test_costs():
    c = r.TradeCost()
    assert abs(c.round_trip - 0.004) < 1e-9
    assert 0.0039 < c.break_even_move() < 0.0042
    assert r.lots_for_budget(10_000_000, 3080) == 32


def test_market_phase_friday_hours():
    wib = r.WIB
    assert r.market_phase(datetime(2026, 9, 24, 11, 45, tzinfo=wib)) == "session_1"   # Kamis
    assert r.market_phase(datetime(2026, 9, 25, 11, 45, tzinfo=wib)) == "break"       # Jumat: sesi I tutup 11:30
    assert r.market_phase(datetime(2026, 9, 25, 13, 45, tzinfo=wib)) == "break"       # Jumat: sesi II mulai 14:00
    assert r.market_phase(datetime(2026, 9, 25, 15, 55, tzinfo=wib)) == "pre_closing"
    assert r.market_phase(datetime(2026, 9, 26, 10, 0, tzinfo=wib)) == "closed"       # Sabtu
