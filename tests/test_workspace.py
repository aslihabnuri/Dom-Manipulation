"""Finding live folders on disk, including the shapes real Drives have."""

import tempfile
import unittest
from pathlib import Path

from clipper.workspace import human_size, inspect_folder, scan


def make(folder: Path, video=True, perf=True, transcript=False, plan=False) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    if video:
        (folder / "live.mp4").write_bytes(b"x" * 4096)
    if perf:
        (folder / "performa.csv").write_text("Waktu,Penonton\n19:00,100\n", encoding="utf-8")
    if transcript:
        (folder / "transkrip.srt").write_text("1\n00:00:01,000 --> 00:00:02,000\nhalo\n", encoding="utf-8")
    if plan:
        (folder / "rencana-klip.json").write_text("{}", encoding="utf-8")
    return folder


class TestScanDepth(unittest.TestCase):
    """A real Drive nested the recording six levels down; a depth-4 cap found
    nothing at all and reported an empty Drive."""

    REAL_SHAPE = ("Keranjang Yanti", "Live TikTok Sophie Martin",
                  "Raw Data Live Video", "Video", "28 Juni")

    def setUp(self):
        self.root = Path(tempfile.mkdtemp()) / "MyDrive"
        self.deep = self.root
        for part in self.REAL_SHAPE:
            self.deep = self.deep / part
        make(self.deep)

    def test_default_depth_reaches_a_real_layout(self):
        self.assertEqual([s.folder.name for s in scan(self.root)], ["28 Juni"])

    def test_shallow_cap_would_have_missed_it(self):
        self.assertEqual(scan(self.root, max_depth=4), [])

    def test_folder_budget_is_respected(self):
        self.assertEqual(scan(self.root, max_folders=1), [])


class TestInspectFolder(unittest.TestCase):
    def test_reports_every_part(self):
        folder = make(Path(tempfile.mkdtemp()) / "2026-06-28",
                      transcript=True, plan=True)
        session = inspect_folder(folder)
        self.assertTrue(session.ready)
        self.assertIsNotNone(session.transcript)
        self.assertIsNotNone(session.plan)
        self.assertEqual(session.session_id, "2026-06-28")

    def test_plan_is_not_mistaken_for_a_transcript(self):
        folder = make(Path(tempfile.mkdtemp()) / "x", plan=True)
        self.assertIsNone(inspect_folder(folder).transcript)

    def test_incomplete_folder_says_what_is_missing(self):
        session = inspect_folder(make(Path(tempfile.mkdtemp()) / "y", perf=False))
        self.assertFalse(session.ready)
        self.assertIn("kurang", session.label)

    def test_picks_the_largest_video(self):
        folder = make(Path(tempfile.mkdtemp()) / "z")
        (folder / "besar.mp4").write_bytes(b"x" * 99999)
        self.assertEqual(inspect_folder(folder).video.name, "besar.mp4")

    def test_date_from_folder_name(self):
        session = inspect_folder(make(Path(tempfile.mkdtemp()) / "2026-06-28"))
        self.assertEqual(session.live_date.isoformat(), "2026-06-28")


class TestScanListing(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp())
        make(self.root / "live" / "2026-06-28")
        make(self.root / "live" / "2026-06-29", video=False)   # upload unfinished

    def test_incomplete_folders_are_listed_too(self):
        names = [s.folder.name for s in scan(self.root)]
        self.assertIn("2026-06-28", names)
        self.assertIn("2026-06-29", names)

    def test_ready_folders_come_first(self):
        self.assertTrue(scan(self.root)[0].ready)

    def test_missing_root_is_not_an_error(self):
        self.assertEqual(scan(self.root / "tidak-ada"), [])


class TestHumanSize(unittest.TestCase):
    def test_units(self):
        self.assertEqual(human_size(0), "0 B")
        self.assertEqual(human_size(2400), "2 KB")
        self.assertEqual(human_size(2.4 * 1024 ** 3), "2.4 GB")


if __name__ == "__main__":
    unittest.main()
