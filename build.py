#!/usr/bin/env python3
"""
Bundel BEfS Study Hub menjadi satu berkas HTML mandiri.

Sumbernya modular (assets/css + assets/js) supaya mudah dirawat; berkas
hasil bundel dipakai untuk dibagikan sebagai satu file atau dipublikasikan
sebagai Artifact.

Keluaran ditulis sebagai *konten halaman* (title + style + markup + script)
tanpa tag <html>/<head>/<body>. Peramban tetap merender berkas semacam ini
dengan benar bila dibuka langsung, dan penerbit Artifact membungkusnya
dengan kerangka HTML sendiri.

Pakai:  python3 build.py
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "dist" / "befs-study-hub.html"

CSS = ROOT / "assets/css/app.css"
JS = [
    ROOT / "assets/js/data.js",
    ROOT / "assets/js/chapters.js",
    ROOT / "assets/js/visuals.js",
    ROOT / "assets/js/study-cards.js",
    ROOT / "assets/js/study-quiz.js",
    ROOT / "assets/js/app.js",
]


def read(p: pathlib.Path) -> str:
    if not p.exists():
        sys.exit("Berkas tidak ditemukan: %s" % p)
    return p.read_text(encoding="utf-8")


def body_markup() -> str:
    """Ambil markup di antara <body> dan </body> dari index.html, buang tag <script src>."""
    html = read(ROOT / "index.html")
    m = re.search(r"<body[^>]*>(.*?)</body>", html, re.S | re.I)
    if not m:
        sys.exit("Tidak menemukan <body> pada index.html")
    markup = m.group(1)
    markup = re.sub(r'\s*<script\s+src="[^"]*"\s*></script>', "", markup, flags=re.I)
    return markup.strip()


def main() -> None:
    parts = [
        "<title>BEfS Study Hub</title>",
        "<style>\n%s\n</style>" % read(CSS).strip(),
        body_markup(),
    ]
    for p in JS:
        # </script> di dalam string JS akan menutup blok lebih awal — amankan.
        code = read(p).replace("</script>", "<\\/script>")
        parts.append("<script>\n%s\n</script>" % code.strip())

    out = "\n\n".join(parts) + "\n"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print("Ditulis %s (%.1f KB)" % (OUT.relative_to(ROOT), len(out.encode("utf-8")) / 1024))


if __name__ == "__main__":
    main()
