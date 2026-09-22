import numpy as np
import pandas as pd

from engine import indicators as ind


def _df(n=300, seed=0):
    rng = np.random.default_rng(seed)
    c = 1000 * np.exp(np.cumsum(rng.normal(0.0005, 0.02, n)))
    df = pd.DataFrame({"open": c * (1 + rng.normal(0, 0.005, n)), "high": c * 1.02, "low": c * 0.98, "close": c,
                       "volume": rng.integers(1_000_000, 5_000_000, n)}, index=pd.bdate_range("2024-01-01", periods=n))
    return df


def test_rsi_bounds_and_extremes():
    df = _df()
    r = ind.rsi(df["close"]).dropna()
    assert (r >= 0).all() and (r <= 100).all()
    up = pd.Series(np.arange(1, 60, dtype=float))
    assert ind.rsi(up).iloc[-1] == 100.0
    down = pd.Series(np.arange(60, 1, -1, dtype=float))
    assert ind.rsi(down).iloc[-1] == 0.0


def test_sma_ema_known_values():
    s = pd.Series([1, 2, 3, 4, 5], dtype=float)
    assert ind.sma(s, 3).tolist()[2:] == [2.0, 3.0, 4.0]
    e = ind.ema(s, 3)
    assert abs(e.iloc[-1] - 4.0625) < 1e-9  # EMA(3) adjust=False: seed 2.0 (SMA), lalu 3.0, 4.0? -> pandas seed = first value


def test_atr_positive_and_adx_range():
    df = _df()
    assert (ind.atr(df).dropna() > 0).all()
    a = ind.adx(df).dropna()
    assert ((a["adx"] >= 0) & (a["adx"] <= 100)).all()


def test_bollinger_pct_b():
    df = _df()
    b = ind.bollinger(df["close"]).dropna()
    assert (b["bb_upper"] >= b["bb_mid"]).all() and (b["bb_lower"] <= b["bb_mid"]).all()
    assert (b["bandwidth"] > 0).all()


def test_enrich_has_all_columns():
    e = ind.enrich(_df())
    for col in ["sma20", "sma50", "sma150", "rsi14", "macd", "hist", "atr14", "adx", "plus_di", "pct_b", "stoch_k",
                "obv", "force13", "vol_ratio", "chandelier", "impulse", "stage", "value_sma20"]:
        assert col in e.columns
    assert set(e["impulse"].unique()) <= {"green", "red", "blue"}
