"""Claim rules, the duplicate ledger, and the added-value check."""

import tempfile
import unittest
from datetime import datetime
from pathlib import Path

from clipper.compliance.dedupe import (
    Ledger, check_duplicate, drop_overlapping, fingerprint_source,
)
from clipper.compliance.linter import check_added_value, scan_text
from clipper.compliance.rules import load_rules
from clipper.config import Config
from clipper.models import Candidate, HourScore, PerfRow, Segment

RULES = load_rules()


def candidate(start: float, end: float, score: float = 0.8) -> Candidate:
    row = PerfRow(start=datetime(2026, 8, 18, 20), end=datetime(2026, 8, 18, 21), viewers=100, gmv=1000)
    hour = HourScore(row=row, segment=Segment(0, 3600), viewers_norm=1.0, sales_norm=1.0, score=1.0)
    return Candidate(segment=Segment(start, end), source_hour=hour, score=score)


class TestNoFalsePositives(unittest.TestCase):
    """Ordinary live-selling patter must stay clean, or the linter gets ignored."""

    SAFE = [
        "bahannya 100% katun premium ya kak, adem banget dipakai seharian",
        "yuk langsung klik keranjang kuning, stok terbatas nih",
        "gratis ongkir ya kak, harga cuma 45 ribu aja",
        "warna hitam ukuran L masih ready, kualitasnya bagus banget",
        "ini 100% original bergaransi resmi dari brand",
        "pasti suka deh kalau udah nyoba, seriusan",
        "gratis ongkir se-Indonesia untuk semua pesanan hari ini",
        "gratis ongkir ke seluruh Indonesia ya kak",
        "obat nyamuk elektrik ini hemat listrik",
        "pengiriman nasional tersedia dari gudang Jakarta",
    ]

    def test_safe_phrases_produce_no_findings(self):
        for text in self.SAFE:
            with self.subTest(text=text):
                self.assertEqual([f.rule_id for f in scan_text(text, RULES)], [])


class TestTruePositives(unittest.TestCase):
    CASES = [
        ("krim ini menyembuhkan jerawat", "id.medis.sembuh"),
        ("dijamin putih dalam semalam kak", "id.absolut.auto"),
        ("produk ini 100% ampuh", "id.absolut.persen"),
        ("aman tanpa efek samping", "id.medis.efeksamping"),
        ("chat WA saya ya di nomor bawah", "id.offplatform.kontak"),
        ("di Shopee lebih mahal loh", "id.offplatform.marketplace"),
        ("transfer ke rekening admin ya", "id.offplatform.transfer"),
        ("ini termurah se-Indonesia loh", "id.superlatif.seindonesia"),
        ("ready KW super mirror quality", "id.produk.tiruan"),
        ("slot gacor maxwin hari ini", "id.produk.terlarang"),
        ("harga error nih buruan", "id.harga.error"),
        ("wajib follow dulu baru dapat harga ini", "id.integritas.engagement"),
    ]

    def test_each_case_fires_expected_rule(self):
        for text, expected in self.CASES:
            with self.subTest(text=text):
                self.assertIn(expected, [f.rule_id for f in scan_text(text, RULES)])

    def test_block_severity_on_hard_violations(self):
        findings = scan_text("dijamin sembuh total, chat WA saya", RULES)
        self.assertTrue(any(f.blocking for f in findings))

    def test_evidence_is_captured(self):
        findings = scan_text("produk ini 100% ampuh banget", RULES)
        self.assertTrue(any("100" in f.evidence for f in findings))


class TestCustomRules(unittest.TestCase):
    def test_user_file_can_override_builtin(self):
        tmp = Path(tempfile.mkdtemp()) / "rules.json"
        tmp.write_text(
            '{"rules": [{"id": "id.harga.gratis", "severity": "info", '
            '"pattern": "zzz-never-matches", "message": "disabled"}]}',
            encoding="utf-8",
        )
        rules = load_rules(tmp)
        overridden = next(r for r in rules if r.id == "id.harga.gratis")
        self.assertEqual(overridden.severity, "info")
        self.assertEqual(len(rules), len(RULES))

    def test_invalid_regex_is_rejected(self):
        tmp = Path(tempfile.mkdtemp()) / "bad.json"
        tmp.write_text('{"rules": [{"id": "x", "pattern": "([unclosed"}]}', encoding="utf-8")
        with self.assertRaises(ValueError):
            load_rules(tmp)


class TestAddedValue(unittest.TestCase):
    """TikTok requires each repost to bring new value; verify we enforce that."""

    def test_blocks_when_nothing_is_added(self):
        config = Config()
        config.data["captions"]["enabled"] = False
        config.data["overlay"]["enabled"] = False
        findings = check_added_value(candidate(0, 45), "caption", "", config)
        self.assertTrue(any(f.blocking for f in findings))

    def test_warns_on_empty_overlay(self):
        findings = check_added_value(candidate(0, 45), "caption", "", Config())
        self.assertIn("originality.thin_overlay", [f.rule_id for f in findings])

    def test_warns_on_decorative_overlay(self):
        findings = check_added_value(candidate(0, 45), "caption", "Part 2", Config())
        ids = [f.rule_id for f in findings]
        self.assertTrue({"originality.thin_overlay", "originality.decorative_overlay"} & set(ids))

    def test_accepts_substantive_overlay(self):
        findings = check_added_value(
            candidate(0, 45), "caption lengkap", "Kaos katun premium - Rp45.000", Config()
        )
        self.assertEqual([f for f in findings if f.severity != "info"], [])

    def test_can_be_switched_off(self):
        config = Config()
        config.data["compliance"]["require_added_value"] = False
        self.assertEqual(check_added_value(candidate(0, 45), "", "", config), [])


class TestLedger(unittest.TestCase):
    def setUp(self):
        self.path = Path(tempfile.mkdtemp()) / "ledger.json"
        self.config = Config()

    def test_roundtrip(self):
        ledger = Ledger.load(self.path)
        ledger.add(candidate(100, 145), "2026-08-18", "fp1", output="a.mp4")
        ledger.save()
        self.assertEqual(len(Ledger.load(self.path).entries), 1)

    def test_blocks_overlapping_republish(self):
        ledger = Ledger.load(self.path)
        ledger.add(candidate(100, 145), "2026-08-18", "fp1", output="a.mp4")
        findings = check_duplicate(candidate(110, 155), ledger, "fp1", self.config)
        self.assertTrue(any(f.blocking for f in findings))

    def test_allows_distinct_moment(self):
        ledger = Ledger.load(self.path)
        ledger.add(candidate(100, 145), "2026-08-18", "fp1", output="a.mp4")
        self.assertEqual(check_duplicate(candidate(600, 645), ledger, "fp1", self.config), [])

    def test_scoped_to_source_recording(self):
        """A different live may legitimately have a clip at the same timestamp."""
        ledger = Ledger.load(self.path)
        ledger.add(candidate(100, 145), "2026-08-18", "fp1", output="a.mp4")
        self.assertEqual(check_duplicate(candidate(100, 145), ledger, "fp2", self.config), [])

    def test_detects_duplicate_within_one_batch(self):
        a, b = candidate(100, 145), candidate(105, 150)
        findings = check_duplicate(a, Ledger.load(self.path), "fp1", self.config, batch=[a, b])
        self.assertTrue(any(f.rule_id == "originality.duplicate_batch" for f in findings))

    def test_corrupt_ledger_reports_clearly(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text("{not json", encoding="utf-8")
        with self.assertRaises(ValueError):
            Ledger.load(self.path)

    def test_mark_published(self):
        ledger = Ledger.load(self.path)
        ledger.add(candidate(100, 145), "2026-08-18", "fp1", output="a.mp4")
        self.assertTrue(ledger.mark_published("a.mp4"))
        self.assertFalse(ledger.mark_published("missing.mp4"))


class TestDropOverlapping(unittest.TestCase):
    def test_keeps_best_of_an_overlapping_pair(self):
        kept = drop_overlapping([candidate(100, 145, 0.9), candidate(110, 155, 0.5)])
        self.assertEqual(len(kept), 1)
        self.assertEqual(kept[0].score, 0.9)

    def test_keeps_distinct_moments_in_time_order(self):
        kept = drop_overlapping([candidate(600, 645, 0.5), candidate(100, 145, 0.9)])
        self.assertEqual([c.segment.start for c in kept], [100, 600])


class TestFingerprint(unittest.TestCase):
    def test_stable_across_rename(self):
        base = Path(tempfile.mkdtemp())
        first = base / "a.mp4"
        first.write_bytes(b"x" * 4096)
        original = fingerprint_source(first, 120.0)
        renamed = base / "b.mp4"
        first.rename(renamed)
        self.assertEqual(fingerprint_source(renamed, 120.0), original)

    def test_differs_for_different_content(self):
        base = Path(tempfile.mkdtemp())
        (base / "a.mp4").write_bytes(b"x" * 4096)
        (base / "b.mp4").write_bytes(b"y" * 8192)
        self.assertNotEqual(
            fingerprint_source(base / "a.mp4", 120.0),
            fingerprint_source(base / "b.mp4", 120.0),
        )


if __name__ == "__main__":
    unittest.main()
