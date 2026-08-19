"""Copying a recording off a network mount before working on it."""

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from clipper.staging import (
    cleanup, default_stage_dir, free_bytes, is_network_path, should_stage, stage,
)


class TestNetworkDetection(unittest.TestCase):
    def test_colab_drive_mount(self):
        self.assertTrue(is_network_path("/content/drive/MyDrive/live.mp4"))

    def test_macos_mounts(self):
        self.assertTrue(is_network_path("/Volumes/GoogleDrive/live.mp4"))
        self.assertTrue(is_network_path("/Users/a/Library/CloudStorage/GoogleDrive-x/live.mp4"))

    def test_ordinary_local_path(self):
        self.assertFalse(is_network_path("/home/user/live.mp4"))


class TestShouldStage(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.video = self.tmp / "live.mp4"
        self.video.write_bytes(b"x" * 4096)

    def test_local_video_is_left_alone(self):
        ok, why = should_stage(self.video, self.tmp)
        self.assertFalse(ok)
        self.assertIn("lokal", why)

    def test_missing_file(self):
        ok, why = should_stage(self.tmp / "nope.mp4", self.tmp)
        self.assertFalse(ok)
        self.assertIn("tidak ditemukan", why)

    def test_small_network_file_is_not_worth_copying(self):
        with mock.patch("clipper.staging.is_network_path", return_value=True):
            ok, why = should_stage(self.video, self.tmp)
        self.assertFalse(ok)
        self.assertIn("kecil", why)

    def test_large_network_file_is_copied(self):
        with mock.patch("clipper.staging.is_network_path", return_value=True):
            ok, _ = should_stage(self.video, self.tmp, min_bytes=100)
        self.assertTrue(ok)

    def test_refuses_when_local_disk_is_short(self):
        with mock.patch("clipper.staging.is_network_path", return_value=True), \
             mock.patch("clipper.staging.free_bytes", return_value=1024):
            ok, why = should_stage(self.video, self.tmp, min_bytes=100)
        self.assertFalse(ok)
        self.assertIn("kurang", why)


class TestStage(unittest.TestCase):
    def setUp(self):
        self.src_dir = Path(tempfile.mkdtemp())
        self.dest = Path(tempfile.mkdtemp()) / "kerja"
        self.video = self.src_dir / "live.mp4"
        self.payload = bytes(range(256)) * 4096      # ~1 MB, verifiable
        self.video.write_bytes(self.payload)

    def stage_it(self, **kw):
        with mock.patch("clipper.staging.is_network_path", return_value=True):
            return stage(self.video, self.dest, log=lambda m: None, min_bytes=100, **kw)

    def test_copies_byte_for_byte(self):
        staged = self.stage_it()
        self.assertNotEqual(staged, self.video)
        self.assertEqual(staged.read_bytes(), self.payload)

    def test_reuses_a_complete_copy(self):
        first = self.stage_it()
        mtime = first.stat().st_mtime_ns
        self.assertEqual(self.stage_it().stat().st_mtime_ns, mtime)

    def test_leaves_no_partial_file_behind(self):
        self.stage_it()
        self.assertEqual(list(self.dest.glob("*.part")), [])

    def test_falls_back_to_the_original_on_failure(self):
        with mock.patch("clipper.staging.is_network_path", return_value=True), \
             mock.patch("pathlib.Path.open", side_effect=OSError("disk penuh")):
            result = stage(self.video, self.dest, log=lambda m: None, min_bytes=100)
        self.assertEqual(result, self.video)

    def test_local_video_returns_itself(self):
        self.assertEqual(stage(self.video, self.dest, log=lambda m: None), self.video)

    def test_cleanup_never_deletes_the_original(self):
        staged = self.stage_it()
        cleanup(staged, self.video)
        self.assertFalse(staged.exists())
        self.assertTrue(self.video.exists())

    def test_cleanup_is_a_no_op_when_nothing_was_staged(self):
        cleanup(self.video, self.video)
        self.assertTrue(self.video.exists())


class TestHelpers(unittest.TestCase):
    def test_free_bytes_is_positive(self):
        self.assertGreater(free_bytes(tempfile.gettempdir()), 0)

    def test_free_bytes_walks_up_to_an_existing_parent(self):
        self.assertGreater(free_bytes(Path(tempfile.gettempdir()) / "a" / "b" / "c"), 0)

    def test_stage_dir_is_not_on_a_network_mount(self):
        self.assertFalse(is_network_path(default_stage_dir()))


if __name__ == "__main__":
    unittest.main()
