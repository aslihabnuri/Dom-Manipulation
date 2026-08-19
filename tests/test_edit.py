"""Caption/overlay generation, filtergraph construction and config validation."""

import unittest

from clipper.config import Config
from clipper.edit.captions import (
    ass_time, build_ass, build_cards, escape, style_line,
)
from clipper.edit.cut import build_video_filter, escape_filter_path
from clipper.edit.overlay import OverlayText, find_price, render_events, suggest
from clipper.models import Transcript, TranscriptSegment, TranscriptWord


def transcript(start: float = 0.0, count: int = 12, step: float = 0.4) -> Transcript:
    words = [
        TranscriptWord(start + i * step, start + i * step + step * 0.9, f"kata{i}")
        for i in range(count)
    ]
    return Transcript(segments=[
        TranscriptSegment(words[0].start, words[-1].end,
                          " ".join(w.text for w in words) + ".", words)
    ])


class TestAssTime(unittest.TestCase):
    def test_formats(self):
        self.assertEqual(ass_time(0), "0:00:00.00")
        self.assertEqual(ass_time(65.43), "0:01:05.43")
        self.assertEqual(ass_time(3661.5), "1:01:01.50")

    def test_negative_clamped(self):
        self.assertEqual(ass_time(-5), "0:00:00.00")


class TestEscape(unittest.TestCase):
    def test_braces_and_backslash(self):
        self.assertEqual(escape("a {b} c\\d"), "a \\{b\\} c\\\\d")

    def test_newlines_flattened(self):
        self.assertNotIn("\n", escape("baris satu\nbaris dua"))


class TestCaptionCards(unittest.TestCase):
    def test_wraps_within_char_limit(self):
        config = Config()
        config.data["captions"]["max_chars_per_line"] = 12
        cards = build_cards(transcript(), 0.0, 30.0, config)
        self.assertTrue(cards)
        for card in cards:
            for line in card.lines:
                self.assertLessEqual(len(" ".join(w.text for w in line)), 24)

    def test_timings_are_clip_relative(self):
        cards = build_cards(transcript(start=100.0), 100.0, 130.0, Config())
        self.assertTrue(cards)
        self.assertGreaterEqual(cards[0].start, 0.0)
        self.assertLess(cards[0].start, 5.0)

    def test_respects_max_lines(self):
        config = Config()
        config.data["captions"]["max_chars_per_line"] = 8
        config.data["captions"]["max_lines"] = 2
        for card in build_cards(transcript(count=30), 0.0, 60.0, config):
            self.assertLessEqual(len(card.lines), 2)

    def test_segment_only_transcript(self):
        """An imported SRT has no word timings; captions must still render."""
        tr = Transcript(segments=[TranscriptSegment(1.0, 4.0, "halo semuanya", [])])
        self.assertTrue(build_cards(tr, 0.0, 10.0, Config()))

    def test_no_words_in_range(self):
        self.assertEqual(build_cards(transcript(), 500.0, 530.0, Config()), [])


class TestAssDocument(unittest.TestCase):
    def test_has_required_sections(self):
        doc = build_ass(transcript(), 0.0, 30.0, Config())
        for section in ("[Script Info]", "[V4+ Styles]", "[Events]", "PlayResX: 1080"):
            self.assertIn(section, doc)

    def test_emits_dialogue_lines(self):
        doc = build_ass(transcript(), 0.0, 30.0, Config())
        self.assertGreater(sum(1 for l in doc.splitlines() if l.startswith("Dialogue:")), 0)

    def test_captions_can_be_disabled(self):
        config = Config()
        config.data["captions"]["enabled"] = False
        doc = build_ass(transcript(), 0.0, 30.0, config)
        self.assertEqual(sum(1 for l in doc.splitlines() if l.startswith("Dialogue:")), 0)

    def test_bottom_margin_clears_the_safe_zone(self):
        config = Config()
        line = style_line(config, 1080, 1920)
        margin_v = int(line.split(",")[-2])
        self.assertGreaterEqual(margin_v, int(1920 * 0.2))

    def test_word_highlight_recolours_one_word(self):
        config = Config()
        config.data["captions"]["word_highlight"] = True
        doc = build_ass(transcript(), 0.0, 30.0, config)
        self.assertIn("\\c&H0000E5FF", doc)


class TestOverlay(unittest.TestCase):
    def test_price_detection(self):
        self.assertEqual(find_price("harganya Rp45.000 aja"), "Rp45.000")
        self.assertEqual(find_price("tidak ada angka"), "")

    def test_burned_overlay_quotes_the_charged_price(self):
        """The overlay is burned into the video, so a stale anchor price is
        a wrong price on the finished clip."""
        self.assertEqual(find_price("dari Rp129.000 jadi Rp89.000 aja kak"), "Rp89.000")
        result = suggest("Celana linen, dari Rp129.000 jadi Rp89.000. Buruan checkout.", "19:06")
        self.assertIn("Rp89.000", result.info)
        self.assertNotIn("Rp129.000", result.info)

    def test_suggest_uses_only_spoken_words(self):
        text = "Ini bahan katun premium. Harga cuma Rp45.000 aja. Yuk klik keranjang kuning."
        result = suggest(text, "20:00")
        self.assertTrue(result.hook)
        self.assertIn(result.hook.split()[0].lower(), text.lower())
        self.assertIn("Rp45.000", result.info)

    def test_suggest_on_empty_transcript(self):
        result = suggest("", "20:00")
        self.assertEqual(result.hook, "")

    def test_events_respect_clip_length(self):
        events = render_events(OverlayText("Hook di sini", "Info"), 2.0, Config())
        self.assertTrue(events)
        for event in events:
            self.assertTrue(event.startswith("Dialogue:"))

    def test_events_suppressed_when_disabled(self):
        config = Config()
        config.data["overlay"]["enabled"] = False
        self.assertEqual(render_events(OverlayText("Hook", "Info"), 30.0, config), [])


class TestVideoFilter(unittest.TestCase):
    def test_labels_are_unique(self):
        """ffmpeg rejects a graph that reuses one label as input and output."""
        graph, label = build_video_filter(Config(), None)
        outputs = [seg for seg in graph.split(";") if seg]
        defined = [s[s.rindex("[") + 1 : -1] for s in outputs if s.endswith("]")]
        self.assertEqual(len(defined), len(set(defined)))
        self.assertIn(f"[{label}]", graph)

    def test_cover_mode_crops(self):
        config = Config()
        config.data["render"]["reframe"] = "cover"
        graph, _ = build_video_filter(config, None)
        self.assertIn("crop=1080:1920", graph)
        self.assertNotIn("gblur", graph)

    def test_blur_mode_pads(self):
        graph, _ = build_video_filter(Config(), None)
        self.assertIn("gblur", graph)
        self.assertIn("overlay=", graph)

    def test_target_resolution_is_applied(self):
        config = Config()
        config.data["render"]["width"] = 720
        config.data["render"]["height"] = 1280
        graph, _ = build_video_filter(config, None)
        self.assertIn("720:1280", graph)

    def test_path_escaping(self):
        self.assertIn("\\:", escape_filter_path("/tmp/a/c:d.ass"))


class TestConfigValidation(unittest.TestCase):
    def test_defaults_are_valid(self):
        self.assertEqual(Config().validate(), [])

    def test_rejects_inverted_clip_length(self):
        config = Config()
        config.data["clip"]["min_seconds"] = 90
        self.assertTrue(config.validate())

    def test_rejects_unknown_method(self):
        config = Config()
        config.data["scoring"]["method"] = "magic"
        self.assertTrue(any("scoring.method" in p for p in config.validate()))

    def test_rejects_out_of_range_overlap(self):
        config = Config()
        config.data["compliance"]["max_overlap_with_published"] = 1.5
        self.assertTrue(config.validate())

    def test_dotted_get(self):
        self.assertEqual(Config().get("clip.target_seconds"), 45)
        self.assertIsNone(Config().get("nope.nothing"))


if __name__ == "__main__":
    unittest.main()
