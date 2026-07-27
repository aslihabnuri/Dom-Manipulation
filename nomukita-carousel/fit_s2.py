"""Cek muat-tidaknya naskah slide 2 - nol kredit, jalankan sebelum membangun.

Alasannya sama dengan `fit_s5.py`: naskah dua belas produk punya panjang yang
berbeda-beda, dan satu-satunya cara memastikan tidak ada yang tumpah adalah
mengukur tintanya, bukan menghitung hurufnya.

Yang diperiksa:
  - judul manfaat tidak melebihi lebar kolom
  - badan tidak memakan lebih dari empat baris (acuan memakai empat)
  - blok kedua tidak turun sampai menabrak baris penutup yang dipaku di y = 778
  - nama produk tetap terbaca, tidak dikecilkan di bawah batas
"""

from PIL import ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('r2', 'render_s2.py'), ('c2', 's2_copy.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, r2, c2

MAX_BODY_LINES = 4      # acuannya memakai empat baris pada blok pertamanya
CLEAR = 24              # jarak terkecil dasar blok kedua ke baris penutup


def check(verbose=True):
    body_f = ImageFont.truetype(bs.F_BODY, r2.BODY_SIZE)
    bad = []
    for slug, (name1, name2, blocks, closing) in c2.COPY.items():
        prod = next(p for p in bs.PRODUCTS if p['slug'] == slug)
        accent = bs.accent(prod['head'])

        n1 = r2._fit_name(name1, bs.CHARCOAL, r2.NAME_W, r2.NAME_CAP_MAX, r2.NAME_CAP_MIN)
        if n1.width > r2.NAME_W:
            bad.append((slug, 'nama', name1, n1.width, r2.NAME_W))

        top = r2.HEAD1_TOP
        lines_used = []
        for title, body in blocks:
            strip = bs.build_headline(title, round(r2.HEAD_CAP / r2.CAP_RATIO), accent)
            if strip.width > r2.HEAD_W:
                bad.append((slug, 'judul', title, strip.width, r2.HEAD_W))
            lines = r2._wrap(body, body_f, r2.COL_W)
            lines_used.append(len(lines))
            if len(lines) > MAX_BODY_LINES:
                bad.append((slug, 'badan', body[:40] + '...', len(lines), MAX_BODY_LINES))
            last = top + strip.height + r2.HEAD_GAP + (len(lines) - 1) * r2.BODY_LEAD
            top = last + r2.BODY_SIZE + r2.BLOCK_GAP

        if top + CLEAR > r2.CLOSE_TOP:
            bad.append((slug, 'tabrakan', 'blok kedua vs penutup', top, r2.CLOSE_TOP - CLEAR))

        close_lines = r2._wrap_even(closing, body_f, r2.COL_W)
        if len(close_lines) > 2:
            bad.append((slug, 'penutup', closing, len(close_lines), 2))

        if verbose:
            print(f'{slug:20s} nama {n1.width:3d}px  badan {lines_used}  '
                  f'blok berakhir y={top:3d} (batas {r2.CLOSE_TOP - CLEAR})  '
                  f'penutup {len(close_lines)} baris'
                  + ('' if not any(b[0] == slug for b in bad) else '   <-- lewat'))

    if verbose:
        print()
        for slug, kind, txt, got, lim in bad:
            print(f'  {slug:18s} {kind:9s} {got} > {lim}  "{txt}"')
        print(f'\n{len(bad)} pelanggaran')
    return bad


if __name__ == '__main__':
    sys.exit(1 if check() else 0)
