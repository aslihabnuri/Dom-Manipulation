"""Cek muat-tidaknya keterangan slide 5 - nol kredit, jalankan sebelum generate.

Lebarnya diukur dari tinta yang benar-benar tergambar, bukan dari `getlength()`:
`render_s5._text` memposisikan tiap baris dari kotak-batas tintanya, jadi hanya
ukuran itu yang menentukan apakah sebuah baris menabrak tetangganya.

Jatah tiap kolom diambil dari Uji_S5 sendiri - blok teksnya di sana 301, 261,
dan 264 px - dibulatkan sedikit ke atas supaya ada ruang gerak, tetapi tetap di
bawah batas geometrisnya:

  kolom kiri  rata kiri dari x=95, kolom kanan rata kanan ke x=944; keduanya di
              baris yang sama, jadi jumlah lebarnya harus menyisakan celah;
  kolom tengah rata tengah di x=516 dan turun 124 px, sehingga tidak bertabrakan
              dengan kedua tetangganya - yang membatasinya justru dua garis
              penunjuk di x=226 dan x=791 yang melintasi ketinggian itu.
"""

from PIL import ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py'), ('r5', 'render_s5.py'), ('menu', 's5_menu.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs, r5, menu

AVAIL = (340, 340, 340)      # jatah gaya, sedikit di atas acuan
GAP_MIN = 150                # celah terkecil antara kolom kiri dan kanan
LEAD_CLEAR = 14              # jarak terkecil teks kolom tengah ke garis penunjuk


def width(text, font):
    """Lebar tinta sesungguhnya, sama seperti yang dipakai `_text`."""
    return font.getbbox(text)[2] - font.getbbox(text)[0]


def check(verbose=True):
    name_f = ImageFont.truetype(bs.F_BODY, r5.NAME_SIZE)
    rec_f = ImageFont.truetype(bs.F_BODY, r5.RECIPE_SIZE)
    bad = []
    for slug, (sub, creations) in menu.MENU.items():
        widths = []
        for i, (nm, vessel, lines, _img) in enumerate(creations):
            w = width(nm, name_f)
            if w > AVAIL[i]:
                bad.append((slug, i, 'name', nm, w, AVAIL[i]))
            widest = w
            for ln in lines:
                lw = width(ln, rec_f)
                widest = max(widest, lw)
                if lw > AVAIL[i]:
                    bad.append((slug, i, 'line', ln, lw, AVAIL[i]))
            widths.append(widest)

        # batas geometris, bukan sekadar gaya
        if widths[0] + widths[2] > 849 - GAP_MIN:
            bad.append((slug, -1, 'gap', 'kolom kiri+kanan', widths[0] + widths[2], 849 - GAP_MIN))
        half = widths[1] / 2
        room = min(r5.MARK_X[1] - r5.MARK_X[0], r5.MARK_X[2] - r5.MARK_X[1]) - LEAD_CLEAR
        if half > room:
            bad.append((slug, 1, 'lead', 'kolom tengah menabrak garis', round(half), room))

        if verbose:
            print(f'{slug:20s} {widths[0]:4d} {widths[1]:4d} {widths[2]:4d}'
                  + ('' if not any(b[0] == slug for b in bad) else '   <-- lewat'))

    if verbose:
        print()
        for slug, i, kind, txt, w, lim in bad:
            print(f'  {slug:18s} kol{i} {kind:5s} {w:4d} > {lim:3d}  "{txt}"')
        print(f'\n{len(bad)} pelanggaran')
    return bad


if __name__ == '__main__':
    sys.exit(1 if check() else 0)
