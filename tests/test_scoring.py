"""Scoring, segment maths and moment refinement."""

import unittest
from datetime import datetime, timedelta

from clipper.config import Config
from clipper.models import PerfRow, Segment
from clipper.scoring.refine import intent_score
from clipper.scoring.score import combine, normalize, score_hours, select_hours


def rows(spec):
    """Build PerfRows from (hour, viewers, gmv) triples."""
    out = []
    for hour, viewers, gmv in spec:
        start = datetime(2026, 8, 18, hour)
        out.append(PerfRow(start=start, end=start + timedelta(hours=1), viewers=viewers, gmv=gmv))
    return out


class TestNormalize(unittest.TestCase):
    def test_spread(self):
        self.assertEqual(normalize([0, 50, 100]), [0.0, 0.5, 1.0])

    def test_uniform_is_neutral(self):
        self.assertEqual(normalize([5, 5, 5]), [0.5, 0.5, 0.5])

    def test_empty(self):
        self.assertEqual(normalize([]), [])

    def test_negatives_clamped(self):
        self.assertEqual(normalize([-10, 0, 10])[0], 0.0)


class TestCombine(unittest.TestCase):
    def test_geometric_punishes_lopsided(self):
        """An hour with all the traffic and no sales must not outrank a balanced one."""
        lopsided = combine(1.0, 0.0, "geometric", 0.5, 0.5)
        balanced = combine(0.6, 0.6, "geometric", 0.5, 0.5)
        self.assertLess(lopsided, balanced)
        self.assertLess(lopsided, 0.2)

    def test_weighted_does_not(self):
        lopsided = combine(1.0, 0.0, "weighted", 0.5, 0.5)
        self.assertAlmostEqual(lopsided, 0.5)

    def test_geometric_stays_ordered_among_zero_sales(self):
        low = combine(0.2, 0.0, "geometric", 0.5, 0.5)
        high = combine(0.9, 0.0, "geometric", 0.5, 0.5)
        self.assertGreater(high, low)

    def test_bounded(self):
        for method in ("geometric", "weighted"):
            for v, s in ((0.0, 0.0), (1.0, 1.0), (0.3, 0.9)):
                value = combine(v, s, method, 0.5, 0.5)
                self.assertGreaterEqual(value, 0.0)
                self.assertLessEqual(value, 1.0)

    def test_zero_weights_fall_back_to_even(self):
        self.assertAlmostEqual(combine(1.0, 1.0, "weighted", 0.0, 0.0), 1.0)


class TestSegment(unittest.TestCase):
    def test_containment_is_full_overlap(self):
        """A short clip inside a longer one is a duplicate, not a half-match."""
        self.assertEqual(Segment(100, 160).overlap_ratio(Segment(130, 145)), 1.0)

    def test_partial(self):
        self.assertAlmostEqual(Segment(100, 160).overlap_ratio(Segment(120, 180)), 2 / 3)

    def test_disjoint(self):
        self.assertEqual(Segment(100, 160).overlap_ratio(Segment(400, 460)), 0.0)

    def test_touching_is_not_overlap(self):
        self.assertFalse(Segment(0, 10).overlaps(Segment(10, 20)))

    def test_rejects_inverted(self):
        with self.assertRaises(ValueError):
            Segment(50, 20)


class TestScoreHours(unittest.TestCase):
    def setUp(self):
        self.config = Config()
        self.rows = rows([(19, 1000, 500_000), (20, 6000, 20_000_000), (21, 5500, 100_000)])

    def test_ranks_balanced_hour_first(self):
        scored = score_hours(self.rows, self.config, live_start=datetime(2026, 8, 18, 19))
        self.assertEqual(scored[0].label, "20:00")

    def test_maps_onto_video_timeline(self):
        scored = score_hours(self.rows, self.config, live_start=datetime(2026, 8, 18, 19))
        by_label = {h.label: h for h in scored}
        self.assertEqual(by_label["19:00"].segment.start, 0.0)
        self.assertEqual(by_label["20:00"].segment.start, 3600.0)

    def test_drops_rows_beyond_recording(self):
        scored = score_hours(
            self.rows, self.config,
            live_start=datetime(2026, 8, 18, 19), video_duration=3600.0,
        )
        self.assertEqual([h.label for h in scored], ["19:00"])

    def test_clips_partial_row_to_recording(self):
        scored = score_hours(
            self.rows, self.config,
            live_start=datetime(2026, 8, 18, 19), video_duration=5400.0,
        )
        hour = next(h for h in scored if h.label == "20:00")
        self.assertEqual(hour.segment.end, 5400.0)

    def test_live_start_offset_shifts_timeline(self):
        """Recording started 30 min before the first reported hour."""
        scored = score_hours(
            self.rows, self.config, live_start=datetime(2026, 8, 18, 18, 30)
        )
        by_label = {h.label: h for h in scored}
        self.assertEqual(by_label["19:00"].segment.start, 1800.0)

    def test_empty_input(self):
        self.assertEqual(score_hours([], self.config), [])


class TestSelectHours(unittest.TestCase):
    def test_returns_best_hour_even_below_threshold(self):
        config = Config()
        config.data["scoring"]["min_score"] = 0.99
        scored = score_hours(
            rows([(19, 10, 10), (20, 12, 12)]), config, live_start=datetime(2026, 8, 18, 19)
        )
        self.assertEqual(len(select_hours(scored, config)), 1)

    def test_respects_clip_budget(self):
        config = Config()
        config.data["scoring"]["max_clips_per_session"] = 4
        config.data["scoring"]["max_clips_per_hour"] = 2
        config.data["scoring"]["min_score"] = 0.0
        scored = score_hours(
            rows([(h, 1000 * h, 1000 * h) for h in range(10, 20)]),
            config, live_start=datetime(2026, 8, 18, 10),
        )
        self.assertEqual(len(select_hours(scored, config)), 2)


class TestIntentScore(unittest.TestCase):
    def test_selling_beats_chatter(self):
        selling = intent_score("yuk klik keranjang kuning, stok terbatas buruan checkout")
        chatter = intent_score("jadi gitu ya teman-teman, kemarin saya jalan-jalan")
        self.assertGreater(selling, chatter * 3)

    def test_empty(self):
        self.assertEqual(intent_score(""), 0.0)

    def test_repetition_has_diminishing_returns(self):
        once = intent_score("checkout")
        many = intent_score("checkout checkout checkout checkout checkout checkout")
        self.assertLess(many, once * 4)


if __name__ == "__main__":
    unittest.main()
