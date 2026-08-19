"""End-to-end run against a generated recording. Skipped without ffmpeg."""

import subprocess
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

from clipper.config import Config
from clipper.ffmpeg import available, ffmpeg_bin, probe
from clipper.pipeline import SessionInput, run_session, slugify

PERF_CSV = (
    "Laporan Performa LIVE\n"
    "\n"
    "Rentang Waktu,Total Penonton,Pendapatan (Rp),Jumlah Pesanan\n"
    '19:00 - 19:01,"1.200","Rp2.400.000",18\n'
    '19:01 - 19:02,"980","Rp150.000",2\n'
    '19:02 - 19:03,"6.200","Rp24.500.000",120\n'
    '19:03 - 19:04,"4.100","Rp310.000",3\n'
)


@unittest.skipUnless(available(), "ffmpeg not installed")
class TestEndToEnd(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp())
        cls.video = cls.tmp / "live.mp4"
        subprocess.run(
            [
                ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y",
                "-f", "lavfi", "-i", "testsrc2=size=320x180:rate=15:duration=240",
                "-f", "lavfi", "-i", "sine=frequency=200:duration=240",
                "-c:v", "libx264", "-preset", "ultrafast", "-crf", "40",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "32k", "-shortest",
                str(cls.video),
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        cls.perf = cls.tmp / "perf.csv"
        cls.perf.write_text(PERF_CSV, encoding="utf-8")

    def _config(self, name: str) -> Config:
        config = Config()
        root = self.tmp / name
        config.data["paths"]["work_dir"] = str(root / "work")
        config.data["paths"]["output_dir"] = str(root / "out")
        config.data["paths"]["ledger"] = str(root / "ledger.json")
        config.data["transcribe"]["enabled"] = False
        config.data["render"]["preset"] = "ultrafast"
        config.data["render"]["width"] = 270
        config.data["render"]["height"] = 480
        config.data["scoring"]["max_clips_per_session"] = 2
        config.data["clip"]["target_seconds"] = 25
        config.data["clip"]["min_seconds"] = 10
        return config

    def _session(self) -> SessionInput:
        return SessionInput(
            video=self.video, performance=self.perf, session_id="2026-08-18",
            live_start=datetime(2026, 8, 18, 19, 0),
        )

    def test_probe_reads_the_recording(self):
        info = probe(self.video)
        self.assertEqual((info.width, info.height), (320, 180))
        self.assertAlmostEqual(info.duration, 240, delta=2)
        self.assertTrue(info.has_audio)

    def test_dry_run_renders_nothing(self):
        result = run_session(self._session(), self._config("dry"), log=lambda m: None, dry_run=True)
        self.assertTrue(result.results)
        self.assertFalse(any(r.rendered for r in result.results))

    def test_picks_the_hour_strong_on_both_metrics(self):
        result = run_session(self._session(), self._config("pick"), log=lambda m: None, dry_run=True)
        self.assertEqual(result.hours[0].label, "19:02")

    def test_renders_vertical_clips(self):
        config = self._config("render")
        result = run_session(self._session(), config, log=lambda m: None)
        rendered = [r for r in result.results if r.rendered]
        self.assertTrue(rendered)
        for clip in rendered:
            info = probe(clip.video_path)
            self.assertEqual((info.width, info.height), (270, 480))
            self.assertTrue(info.has_audio)
            self.assertGreaterEqual(info.duration, 9)

    def test_second_run_is_blocked_as_duplicate(self):
        """The ledger must stop the same moment being published twice."""
        config = self._config("dupe")
        first = run_session(self._session(), config, log=lambda m: None)
        self.assertTrue(any(r.rendered for r in first.results))

        second = run_session(self._session(), config, log=lambda m: None)
        self.assertTrue(second.results)
        self.assertTrue(all(r.blocked for r in second.results))
        self.assertTrue(any(
            f.rule_id == "originality.duplicate"
            for r in second.results for f in r.findings
        ))

    def test_reports_are_written(self):
        from clipper import report

        config = self._config("report")
        result = run_session(self._session(), config, log=lambda m: None, dry_run=True)
        payload = report.to_dict(result.results, result.hours, "2026-08-18", str(self.video))
        self.assertEqual(len(payload["clips"]), len(result.results))
        markdown = report.render_markdown(result.results, result.hours, "2026-08-18", str(self.video))
        self.assertIn("Laporan Clipping", markdown)
        self.assertIn("Sebelum upload", markdown)

    def test_mismatched_live_start_fails_loudly(self):
        session = SessionInput(
            video=self.video, performance=self.perf, session_id="x",
            live_start=datetime(2026, 8, 18, 23, 0),  # long after the recording ends
        )
        with self.assertRaises(ValueError):
            run_session(session, self._config("bad"), log=lambda m: None, dry_run=True)


class TestSlugify(unittest.TestCase):
    def test_replaces_unsafe_characters(self):
        self.assertEqual(slugify("Live 18/08/2026"), "Live-18-08-2026")

    def test_falls_back_when_empty(self):
        self.assertEqual(slugify("///"), "session")


if __name__ == "__main__":
    unittest.main()
