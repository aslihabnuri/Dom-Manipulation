import numpy as np
import pandas as pd

from engine.strategy import StrategyConfig, analyze


def _trend_df(n=320, drift=0.0015, seed=3):
    rng = np.random.default_rng(seed)
    c = 2000 * np.exp(np.cumsum(rng.normal(drift, 0.012, n)))
    o = c * (1 + rng.normal(0, 0.004, n))
    df = pd.DataFrame({"open": o, "high": np.maximum(o, c) * 1.01, "low": np.minimum(o, c) * 0.99, "close": c,
                       "volume": rng.integers(5_000_000, 20_000_000, n)}, index=pd.bdate_range("2024-01-01", periods=n))
    return df


def test_analyze_uptrend_produces_plan_and_sizing():
    df = _trend_df()
    a = analyze("TEST", df, None, StrategyConfig(), equity_idr=100_000_000)
    assert a.plan is not None
    p = a.plan
    assert p.stop < p.entry < p.target1 < p.target2
    assert p.target1 - p.entry == 2 * (p.entry - p.stop) or abs((p.target1 - p.entry) - 2 * (p.entry - p.stop)) <= 25
    assert p.risk_amount <= 100_000_000 * 0.01 + 1
    assert p.position_value <= 100_000_000 * 0.20 + 1
    assert 0 <= a.raw_score <= 100
    assert set(a.components) == {"trend", "momentum", "volume", "volatility", "candle"}


def test_downtrend_fails_gates():
    df = _trend_df(drift=-0.002, seed=5)
    a = analyze("TEST", df, None)
    assert not a.passed_gates and a.score == 0.0
    assert any("tren" in f for f in a.gate_failures)


def test_illiquid_fails_liquidity_gate():
    df = _trend_df()
    df["volume"] = 1000
    a = analyze("TEST", df, None)
    assert any("nilai transaksi" in f for f in a.gate_failures)


def test_short_history():
    df = _trend_df(n=100)
    a = analyze("TEST", df, None)
    assert not a.passed_gates and a.plan is None
