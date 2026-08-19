"""Plans decided away from the recording, executed where the recording lives."""

import json
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

from clipper.config import Config
from clipper.models import PerfRow
from clipper.plan import (
    PLAN_FILENAME, ClipPlan, PlanBlock, build_plan, dumps, find_plan,
    load_plan, loads, restrict_to_plan, write_plan,
)
from clipper.scoring.score import score_hours, select_hours

LIVE_START = datetime(2026, 6, 28, 11, 59)


def rows():
    """The user's real 28 June shape: 30-minute blocks."""
    spec = [
        (11, 59, 242, 12_541_262), (12, 29, 368, 24_379_128),
        (12, 59, 552, 17_555_295), (13, 29, 430, 9_339_435),
        (13, 59, 230, 8_167_073), (14, 29, 276, 10_162_983),
        (14, 59, 208, 150_307),
    ]
    out = []
    for hour, minute, viewers, gmv in spec:
        start = datetime(2026, 6, 28, hour, minute)
        out.append(PerfRow(start=start, end=start + timedelta(minutes=30),
                           viewers=viewers, gmv=gmv))
    return out


class TestBuildPlan(unittest.TestCase):
    def setUp(self):
        self.config = Config()
        self.scored = score_hours(rows(), self.config, live_start=LIVE_START)
        self.selected = select_hours(self.scored, self.config)

    def test_ranks_the_balanced_block_first(self):
        """12:29 has the highest GMV but far fewer viewers than 12:59."""
        self.assertEqual(self.scored[0].label, "12:59")
        self.assertEqual(self.scored[1].label, "12:29")

    def test_dead_block_scores_effectively_zero(self):
        """14:59 had 208 viewers and almost no sales; epsilon smoothing leaves
        a floating-point crumb rather than an exact 0."""
        self.assertAlmostEqual(min(h.score for h in self.scored), 0.0, places=9)

    def test_plan_carries_selected_blocks(self):
        plan = build_plan("2026-06-28", self.scored, self.selected, live_start=LIVE_START)
        self.assertTrue(plan.blocks)
        self.assertEqual(plan.blocks[0].label, "12:59")
        self.assertEqual(plan.blocks[0].start, 3600.0)

    def test_reason_is_recorded(self):
        plan = build_plan("x", self.scored, self.selected, live_start=LIVE_START)
        self.assertIn("penonton", plan.blocks[0].why)


class TestRoundTrip(unittest.TestCase):
    def plan(self) -> ClipPlan:
        return ClipPlan(
            session_id="2026-06-28", live_start="2026-06-28 11:59",
            video="live.mp4", reframe="cover", max_clips=4,
            blocks=[PlanBlock("12:59", 3600.0, 5400.0, 0.85, 552, 17_555_295, "kuat di dua metrik")],
            note="catatan",
        )

    def test_serialises_and_reloads(self):
        restored = loads(dumps(self.plan()))
        self.assertEqual(restored.session_id, "2026-06-28")
        self.assertEqual(restored.reframe, "cover")
        self.assertEqual(restored.blocks[0].label, "12:59")

    def test_file_round_trip(self):
        path = Path(tempfile.mkdtemp()) / PLAN_FILENAME
        write_plan(self.plan(), path)
        self.assertEqual(load_plan(path).max_clips, 4)

    def test_live_start_parsed(self):
        self.assertEqual(self.plan().live_start_dt, LIVE_START)

    def test_missing_live_start_is_none(self):
        self.assertIsNone(ClipPlan(session_id="x").live_start_dt)

    def test_rejects_newer_version(self):
        with self.assertRaises(ValueError):
            loads(json.dumps({"version": 99, "session_id": "x"}))

    def test_rejects_corrupt_file(self):
        path = Path(tempfile.mkdtemp()) / PLAN_FILENAME
        path.write_text("{not json", encoding="utf-8")
        with self.assertRaises(ValueError):
            load_plan(path)

    def test_unknown_fields_are_ignored(self):
        restored = loads(json.dumps({
            "version": 1, "session_id": "x", "dari_masa_depan": True,
            "blocks": [{"label": "a", "start": 0, "end": 10, "aneh": 1}],
        }))
        self.assertEqual(restored.blocks[0].label, "a")


class TestFindPlan(unittest.TestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())

    def test_finds_the_canonical_name(self):
        (self.folder / PLAN_FILENAME).write_text("{}", encoding="utf-8")
        self.assertEqual(find_plan(self.folder).name, PLAN_FILENAME)

    def test_finds_a_named_variant(self):
        (self.folder / "rencana-juni.json").write_text("{}", encoding="utf-8")
        self.assertIsNotNone(find_plan(self.folder))

    def test_ignores_unrelated_json(self):
        (self.folder / "riwayat.json").write_text("{}", encoding="utf-8")
        self.assertIsNone(find_plan(self.folder))

    def test_empty_folder(self):
        self.assertIsNone(find_plan(self.folder))


class TestRestrictToPlan(unittest.TestCase):
    def setUp(self):
        self.scored = score_hours(rows(), Config(), live_start=LIVE_START)

    def test_plan_overrides_automatic_choice(self):
        """A plan naming weak blocks must still win -- that is the point."""
        plan = ClipPlan(session_id="x", blocks=[
            PlanBlock("13:59", 7200.0, 9000.0),
            PlanBlock("14:59", 10800.0, 12600.0),
        ])
        self.assertEqual([h.label for h in restrict_to_plan(self.scored, plan)],
                         ["13:59", "14:59"])

    def test_plan_order_is_preserved(self):
        plan = ClipPlan(session_id="x", blocks=[
            PlanBlock("13:29", 5400.0, 7200.0),
            PlanBlock("12:59", 3600.0, 5400.0),
        ])
        self.assertEqual([h.label for h in restrict_to_plan(self.scored, plan)],
                         ["13:29", "12:59"])

    def test_matches_by_time_when_label_differs(self):
        plan = ClipPlan(session_id="x", blocks=[PlanBlock("beda", 3600.0, 5400.0)])
        self.assertEqual([h.label for h in restrict_to_plan(self.scored, plan)], ["12:59"])

    def test_empty_plan_leaves_everything(self):
        self.assertEqual(len(restrict_to_plan(self.scored, ClipPlan(session_id="x"))),
                         len(self.scored))

    def test_unmatched_plan_falls_back_rather_than_returning_nothing(self):
        plan = ClipPlan(session_id="x", blocks=[PlanBlock("99:99", 999999.0, 1000000.0)])
        self.assertEqual(len(restrict_to_plan(self.scored, plan)), len(self.scored))


if __name__ == "__main__":
    unittest.main()
