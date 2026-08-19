"""Parsing of Seller Center exports: numbers, times, columns, cadence."""

import tempfile
import unittest
from datetime import date, datetime
from pathlib import Path

from clipper.ingest.drive import parse_date_in_name, extract_folder_id
from clipper.ingest.performance import (
    load_performance, match_columns, normalize_header, parse_number, parse_time,
)


class TestParseNumber(unittest.TestCase):
    def test_indonesian_thousands(self):
        self.assertEqual(parse_number("Rp1.234.567"), 1234567.0)
        self.assertEqual(parse_number("2.500.000"), 2500000.0)
        self.assertEqual(parse_number("1.234"), 1234.0)

    def test_indonesian_decimal(self):
        self.assertAlmostEqual(parse_number("1.234,56"), 1234.56)
        self.assertAlmostEqual(parse_number("0,75"), 0.75)
        self.assertAlmostEqual(parse_number("Rp12.345.678,90"), 12345678.90)

    def test_english_convention(self):
        self.assertAlmostEqual(parse_number("1,234.56"), 1234.56)
        self.assertEqual(parse_number("890"), 890.0)

    def test_suffix_multipliers(self):
        self.assertEqual(parse_number("12rb"), 12000.0)
        self.assertEqual(parse_number("1,2 jt"), 1200000.0)
        self.assertEqual(parse_number("3 juta"), 3000000.0)

    def test_empty_and_placeholder(self):
        for value in ("", "-", "N/A", "null", None):
            self.assertEqual(parse_number(value), 0.0, value)

    def test_passthrough_numeric(self):
        self.assertEqual(parse_number(1234), 1234.0)
        self.assertAlmostEqual(parse_number(12.5), 12.5)


class TestParseTime(unittest.TestCase):
    BASE = datetime(2026, 8, 18)

    def test_bare_time(self):
        self.assertEqual(parse_time("14:00", self.BASE).hour, 14)
        self.assertEqual(parse_time("20", self.BASE).hour, 20)

    def test_range_takes_start(self):
        self.assertEqual(parse_time("14:00 - 15:00", self.BASE).hour, 14)
        self.assertEqual(parse_time("09:00 s/d 10:00", self.BASE).hour, 9)
        self.assertEqual(parse_time("14:00~15:00", self.BASE).hour, 14)

    def test_iso_date_survives_range_split(self):
        # Regression: hyphens inside an ISO date must not be read as a range.
        parsed = parse_time("2026-08-18 09:00", self.BASE)
        self.assertEqual((parsed.year, parsed.month, parsed.day, parsed.hour),
                         (2026, 8, 18, 9))

    def test_iso_date_with_range(self):
        self.assertEqual(parse_time("2026-08-18 09:00 - 10:00", self.BASE).hour, 9)

    def test_twelve_hour(self):
        self.assertEqual(parse_time("7:30 PM", self.BASE).hour, 19)

    def test_unparseable(self):
        self.assertIsNone(parse_time("kemarin sore", self.BASE))


class TestColumnMatching(unittest.TestCase):
    def test_indonesian_headers(self):
        headers = ["Rentang Waktu", "Total Penonton", "Pendapatan (Rp)", "Jumlah Pesanan"]
        mapping = match_columns(headers)
        self.assertEqual(headers[mapping["time"]], "Rentang Waktu")
        self.assertEqual(headers[mapping["viewers"]], "Total Penonton")
        self.assertEqual(headers[mapping["gmv"]], "Pendapatan (Rp)")
        self.assertEqual(headers[mapping["orders"]], "Jumlah Pesanan")

    def test_english_headers(self):
        headers = ["Time", "Viewers", "GMV", "Orders"]
        mapping = match_columns(headers)
        self.assertEqual(set(mapping), {"time", "viewers", "gmv", "orders"})

    def test_no_column_claimed_twice(self):
        headers = ["Waktu", "Penonton", "Pendapatan", "Pesanan"]
        indices = list(match_columns(headers).values())
        self.assertEqual(len(indices), len(set(indices)))

    def test_normalize_strips_units(self):
        self.assertEqual(normalize_header("Pendapatan (Rp)"), "pendapatan")


class TestLoadPerformance(unittest.TestCase):
    CSV = (
        "Laporan Performa LIVE\n"
        "Periode: 18 Agustus 2026\n"
        "\n"
        "Rentang Waktu,Total Penonton,Pendapatan (Rp),Jumlah Pesanan\n"
        '19:00 - 19:01,"1.200","Rp2.400.000",18\n'
        '19:01 - 19:02,"3.850","Rp11.700.000",64\n'
        '19:02 - 19:03,"2.100","Rp900.000",7\n'
    )

    def _write(self, body: str) -> Path:
        tmp = Path(tempfile.mkdtemp()) / "perf.csv"
        tmp.write_text(body, encoding="utf-8")
        return tmp

    def test_skips_title_rows(self):
        rows = load_performance(self._write(self.CSV))
        self.assertEqual(len(rows), 3)
        self.assertEqual(rows[0].viewers, 1200.0)
        self.assertEqual(rows[1].gmv, 11700000.0)

    def test_last_row_uses_inferred_cadence(self):
        # Regression: the final row must not keep the 60-minute default slot.
        rows = load_performance(self._write(self.CSV))
        self.assertEqual(rows[-1].end.strftime("%H:%M"), "19:03")
        self.assertEqual({int(r.duration.total_seconds()) for r in rows}, {60})

    def test_rejects_file_without_time_column(self):
        with self.assertRaises(ValueError):
            load_performance(self._write("Penonton,GMV\n100,200\n"))

    def test_semicolon_delimiter(self):
        body = "Waktu;Penonton;GMV\n19:00;1.200;2.400.000\n20:00;900;1.100.000\n"
        rows = load_performance(self._write(body))
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0].viewers, 1200.0)


class TestDriveHelpers(unittest.TestCase):
    def test_date_in_filename(self):
        self.assertEqual(parse_date_in_name("live_2026-08-18.mp4"), date(2026, 8, 18))
        self.assertEqual(parse_date_in_name("rekaman 18-08-2026.flv"), date(2026, 8, 18))
        # Regression: \b fails between a letter and a digit.
        self.assertEqual(parse_date_in_name("LIVE20260818_2.mp4"), date(2026, 8, 18))
        self.assertIsNone(parse_date_in_name("random.mp4"))
        self.assertIsNone(parse_date_in_name("clip_12345678.mp4"))

    def test_folder_id_from_url(self):
        self.assertEqual(
            extract_folder_id("https://drive.google.com/drive/folders/1AbC-dEf_23"),
            "1AbC-dEf_23",
        )
        self.assertEqual(extract_folder_id("1AbC-dEf_23"), "1AbC-dEf_23")


if __name__ == "__main__":
    unittest.main()
