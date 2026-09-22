"""Unduh leksikon sentimen InSet (Koto & Rahmaningtyas, 2017) ke data/lexicon/.
Sumber: https://github.com/fajri91/InSet . Periksa lisensi repo tersebut sebelum dipakai komersial."""
import pathlib, sys
import httpx

BASE = "https://raw.githubusercontent.com/fajri91/InSet/master/"
dst = pathlib.Path(__file__).resolve().parent.parent / "data" / "lexicon"
dst.mkdir(parents=True, exist_ok=True)
for fn in ("positive.tsv", "negative.tsv"):
    r = httpx.get(BASE + fn, timeout=30, follow_redirects=True)
    r.raise_for_status()
    (dst / fn).write_text(r.text, encoding="utf-8")
    print("ok", fn, len(r.text.splitlines()), "baris")
