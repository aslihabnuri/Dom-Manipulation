import pandas as pd

from engine.candles import detect_patterns, pattern_score, patterns_on


def _down(n=25, start=1000.0):
    rows, p = [], start
    for _ in range(n):
        p *= 0.99
        rows.append((p * 1.005, p * 1.01, p * 0.99, p))
    return rows


def _up(n=25, start=500.0):
    rows, p = [], start
    for _ in range(n):
        p *= 1.01
        rows.append((p * 0.995, p * 1.01, p * 0.99, p))
    return rows


def _frame(rows):
    df = pd.DataFrame(rows, columns=["open", "high", "low", "close"])
    df["volume"] = 1_000_000
    df.index = pd.bdate_range("2024-01-01", periods=len(df))
    return df


def test_hammer_after_downtrend():
    rows = _down() + [(780, 786, 740, 785)]
    assert "hammer" in patterns_on(_frame(rows))


def test_hammer_shape_in_uptrend_is_hanging_man():
    rows = _up() + [(655, 662, 630, 661)]
    hits = patterns_on(_frame(rows))
    assert "hanging_man" in hits and "hammer" not in hits


def test_bullish_engulfing():
    rows = _down() + [(783, 784, 770, 772), (770, 800, 769, 795)]
    assert "bullish_engulfing" in patterns_on(_frame(rows))


def test_bearish_engulfing_and_evening_star():
    rows = _up() + [(640, 660, 638, 658), (662, 663, 630, 632)]
    assert "bearish_engulfing" in patterns_on(_frame(rows))
    rows = _up() + [(640, 662, 638, 660), (665, 668, 663, 666), (662, 663, 640, 645)]
    assert "evening_star" in patterns_on(_frame(rows))


def test_morning_star_and_piercing():
    rows = _down() + [(790, 792, 760, 762), (755, 758, 752, 756), (760, 790, 759, 785)]
    assert "morning_star" in patterns_on(_frame(rows))
    rows = _down() + [(790, 792, 760, 762), (755, 785, 754, 780)]
    assert "piercing_line" in patterns_on(_frame(rows))


def test_doji_and_output_shape():
    rows = _down() + [(780, 790, 770, 780.2)]
    df = _frame(rows)
    out = detect_patterns(df)
    assert out.dtypes.eq(bool).all() and len(out) == len(df)
    assert "doji" in patterns_on(df)


def test_pattern_score_weights_by_bulkowski():
    s, bulls, bears = pattern_score(["morning_star", "hanging_man"])
    assert bulls == ["Morning Star"] and bears == ["Hanging Man"]
    assert 0.5 < s <= 0.6   # 0.78 -> 0.56 ; hanging man 0.41 -> 0
    assert pattern_score(["bullish_harami"])[0] < 0.1
