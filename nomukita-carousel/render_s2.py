"""Slide 2: manfaat produk, mengikuti referensi Matchamu "Pure Sakura".

Semua angka di sini diukur dari `refs/Referensi Slide 2.webp` yang dikirim
pelanggan, bukan dikira-kira. Acuannya berkanvas 1024 x 1024 dengan latar putih
murni; di sini latarnya diganti bone white Nomukita, yang dibolehkan Shopee
secara eksplisit ("Selain warna putih, Anda juga dapat menggunakan warna lain
asal tidak mengganggu fokus terhadap produk").

Susunannya dua kolom. Kolom kiri rata kiri di satu garis tegak x = 65, memuat
nama produk dua baris, dua blok manfaat, lalu satu baris penutup. Kolom kanan
hanya pouch. Logo turun ke kiri bawah karena kiri atas dipakai nama produk, dan
itu memang inti tata letak acuannya.

Yang mengalir dan yang dipaku. Blok pertama dipaku di y = 398 dan baris
penutupnya dipaku di y = 778, persis seperti acuan. Yang di antara keduanya
MENGALIR: judul blok kedua duduk 18 px di bawah dasar badan blok pertama.
Acuannya cuma satu contoh, jadi tidak bisa dipastikan ia memaku atau mengalir -
tetapi dua belas produk punya panjang badan yang berbeda-beda, dan memaku
posisi akan menyisakan lubang di bawah badan yang pendek.
"""

from PIL import Image, ImageDraw, ImageFont
import importlib.util, sys

for _n, _p in [('bs', 'build_slides.py')]:
    _s = importlib.util.spec_from_file_location(_n, _p)
    _m = importlib.util.module_from_spec(_s); sys.modules[_n] = _m; _s.loader.exec_module(_m)
import bs

# ── diukur dari Referensi Slide 2 ────────────────────────────────────────────
LEFT = 65                # garis tegak tempat seluruh kolom kiri rata kiri
COL_W = 490              # lebar badan dan baris penutup, sampai x = 555

# Acuannya memberi judul ruang lebih lebar daripada badan: "ANTIOXIDANT AGENT"
# menjangkau x = 529 sementara baris badan terpanjangnya berhenti di x = 485.
# Jadi ini bukan kelonggaran yang saya buat sendiri, melainkan bagian dari
# bentuknya. Batas 560 masih menyisakan 45 px sebelum tepi kiri pouch di x = 605.
HEAD_W = 560

# Nama produk berdiri di atas pouch, jadi ia tidak terikat lebar kolom teks.
# Ini penting karena nama Nomukita panjangnya jauh berbeda: "TEH" tiga huruf,
# "CHOCOLATE" sembilan. Dipaksa masuk 490 px, CHOCOLATE menyusut sampai setengah
# tinggi MATCHA. Yang dijaga tetap sama lebarnya di kanvas, bukan tinggi hurufnya
# - cara yang sama dipakai acuan, yang kebetulan bernama pendek sehingga
# masalahnya tidak muncul di sana.
NAME_W = 620

NAME1_TOP = 68           # tinta atas nama baris pertama
NAME1_CAP = 127          # tinggi huruf besarnya di acuan
NAME2_TOP = 206
NAME2_RATIO = 0.60       # acuan: 75 / 127

HEAD1_TOP = 398          # tinta atas judul manfaat pertama
HEAD_CAP = 28
# Acuannya memakai jarak baris 22 px untuk badan setinggi 19 px, rapat sekali.
# Angka itu tidak bisa disalin mentah: fontnya berbadan pendek, sedangkan
# Comfortaa berbadan tinggi dan bundar, jadi pada 22 px ekor huruf g dan y baris
# atas menyentuh kepala baris bawahnya. Perbandingan tinta terhadap jarak yang
# dipertahankan, bukan angkanya.
BODY_LEAD = 29           # jarak antar baris badan
HEAD_GAP = 21            # dasar judul -> tinta atas badan
BLOCK_GAP = 18           # dasar badan blok 1 -> tinta atas judul blok 2
CLOSE_TOP = 778          # tinta atas baris penutup, dipaku seperti acuan
CLOSE_LEAD = 24

BODY_SIZE = 23
LOGO_TOP = 953           # acuan menaruh wordmark-nya di y 953..989

# Acuan menaruh pouch-nya di x 650..948, y 326..884: 298 lebar, 558 tinggi,
# berpusat di x = 799. Perbandingan itu (0,53) milik kantong datar Matchamu;
# standing pouch 1000 gram Nomukita jauh lebih gempal (0,73), jadi yang ditiru
# adalah pusat dan garis alasnya, bukan lebarnya. Dipaksa masuk 298 px, pouch-nya
# menyusut jadi 407 px dan terlihat kurus di kanvas.
POUCH_CX = 799
POUCH_BOTTOM = 884
POUCH_H = 558
POUCH_MAX_W = 390

# Kemasan 250 gram bukan versi kecil yang 1000 gram melainkan format lain:
# kantong datar bertali gantung yang lebih lebar daripada tinggi. Berdiri di
# garis alas yang sama, ia hanya setinggi 355 px dan meninggalkan lubang kosong
# setinggi 300 px di atasnya. Jadi kantong itu dinaikkan sampai berpusat di
# tengah kolom kanan (y = 605, titik tengah kolom pouch acuan), bukan
# dibesar-besarkan supaya seolah setinggi standing pouch.
POUCH_BOTTOM_250 = 785
POUCH_MAX_W_250 = 400

# All Round Gothic Bold: tinggi huruf besar 50 px pada ukuran 74.
CAP_RATIO = 50 / 74
NAME_CAP_MIN, NAME_CAP_MAX = 60, NAME1_CAP


def _is_kana(s):
    return any('぀' <= ch <= 'ヿ' or '一' <= ch <= '鿿' for ch in s)


def _name_layer(text, cap, colour):
    """Nama produk sebagai satu strip tinta. Katakana memakai Shippori Mincho,
    huruf latin memakai `bs.build_headline` supaya glyph yang dikunci lisensi
    DEMO (`&` pada COOKIES & CREAM, `-`, `4`) tetap jatuh ke Comfortaa Bold."""
    if _is_kana(text):
        size = max(8, round(cap / 0.72))
        f = ImageFont.truetype(bs.F_JP, size)
        pad = 200
        layer = Image.new('RGBA', (2400, 800), (0, 0, 0, 0))
        ImageDraw.Draw(layer).text((pad, pad), text, font=f, fill=colour + (255,))
        return layer.crop(layer.getbbox())
    return bs.build_headline(text, max(8, round(cap / CAP_RATIO)), colour)


def _fit_name(text, colour, width, cap_max, cap_min):
    """Perbesar nama sampai memenuhi lebar kolom, lalu berhenti.

    Nama produk Nomukita panjangnya berbeda jauh - "TEH" tiga huruf, "CHOCOLATE"
    sembilan - jadi satu ukuran tetap akan membuat yang pendek kelihatan hilang
    dan yang panjang tumpah keluar kolom. Yang dijaga tetap sama adalah beratnya
    di kanvas, bukan angka ukurannya.
    """
    lo, hi = cap_min, cap_max
    best = _name_layer(text, cap_min, colour)
    while lo <= hi:
        mid = (lo + hi) // 2
        layer = _name_layer(text, mid, colour)
        if layer.width <= width:
            best, lo = layer, mid + 1
        else:
            hi = mid - 1
    return best


def _wrap(text, font, width):
    lines, cur = [], ''
    for word in text.split(' '):
        trial = word if not cur else cur + ' ' + word
        if font.getbbox(trial)[2] - font.getbbox(trial)[0] <= width or not cur:
            cur = trial
        else:
            lines.append(cur); cur = word
    if cur:
        lines.append(cur)
    return lines


def _wrap_even(text, font, width):
    """Pecah jadi dua baris yang panjangnya seimbang, bukan penuh lalu sisa.

    Baris penutup acuannya sendiri dua baris - "Aroma dan rasa asli sakura khas"
    lalu "dari negeri Jepang", 382 px dan 249 px - jadi dua baris memang bagian
    dari bentuknya. Yang tidak boleh adalah sisa satu kata: pemecah rakus
    menghasilkan "The whole leaf, ground fine. Not a" lalu "flavouring." sendirian.
    Titik potong dipilih yang membuat baris terpanjangnya sependek mungkin.
    """
    w = lambda t: font.getbbox(t)[2] - font.getbbox(t)[0]
    if w(text) <= width:
        return [text]
    # Keseimbangan saja belum cukup. "The whole leaf, ground fine. Not a
    # flavouring." terbagi paling rata setelah kata "ground", yang memotong
    # frasa "ground fine" di tengah. Batas kalimat menang lebih dulu, baru koma,
    # baru keseimbangan - jadi potongannya jatuh setelah "fine." meski barisnya
    # jadi lebih timpang.
    words = text.split(' ')
    best, score = None, None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        longest = max(w(a), w(b))
        if longest > width:
            continue
        rank = (0 if a.endswith('.') else 1 if a.endswith(',') else 2, longest)
        if score is None or rank < score:
            best, score = [a, b], rank
    return best or _wrap(text, font, width)


def _text(canvas, text, font, colour, top):
    """Gambar satu baris rata kiri di LEFT dengan tinta atasnya tepat di `top`.

    Tinta atas, bukan garis dasar font: acuannya diukur begitu, dan hanya itu
    yang bisa dicocokkan kembali dari piksel.
    """
    pad = 400
    layer = Image.new('RGBA', (canvas.width + 2 * pad, canvas.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=colour + (255,))
    bb = layer.getbbox()
    if bb is None:
        return top
    canvas.alpha_composite(layer, (round(LEFT - (bb[0] - pad) - pad),
                                   round(top - (bb[1] - pad) - pad)))
    return top + (bb[3] - bb[1])


def build(product, copy, out='s2.png', size='1000'):
    """`copy` = (nama1, nama2, [(judul, badan) x2], penutup)."""
    name1, name2, blocks, closing = copy
    assert len(blocks) == 2, 'acuannya selalu dua blok manfaat'
    accent = bs.accent(product['head'])

    c = Image.new('RGBA', (bs.W, bs.H), bs.BG + (255,))

    # ── pouch, kolom kanan ───────────────────────────────────────────────────
    # Yang 250 gram bukan versi kecil yang 1000 gram: kantong datar bening
    # berkaligrafi, bukan standing pouch hitam. `white=True` memberinya volume
    # terhadap latar bone white, jalur yang sama dengan slide 1.
    white = size == '250'
    bs.place(c, product['p250' if white else 'p1000'], POUCH_H, cx=POUCH_CX,
             bottom=POUCH_BOTTOM_250 if white else POUCH_BOTTOM,
             max_w=POUCH_MAX_W_250 if white else POUCH_MAX_W, white=white)

    # ── nama produk ──────────────────────────────────────────────────────────
    n1 = _fit_name(name1, bs.CHARCOAL, NAME_W, NAME_CAP_MAX, NAME_CAP_MIN)
    c.alpha_composite(n1, (LEFT, NAME1_TOP))
    cap2 = max(28, round(NAME1_CAP * NAME2_RATIO))
    n2 = _fit_name(name2, bs.CHARCOAL, NAME_W, cap2, 24)
    c.alpha_composite(n2, (LEFT, NAME2_TOP))

    head_f = ImageFont.truetype(bs.F_HEAD, round(HEAD_CAP / CAP_RATIO))
    body_f = ImageFont.truetype(bs.F_BODY, BODY_SIZE)

    top = HEAD1_TOP
    for i, (title, body) in enumerate(blocks):
        strip = bs.build_headline(title, round(HEAD_CAP / CAP_RATIO), accent)
        c.alpha_composite(strip, (LEFT, top))
        y = top + strip.height + HEAD_GAP
        for j, line in enumerate(_wrap(body, body_f, COL_W)):
            _text(c, line, body_f, bs.CHARCOAL, y + j * BODY_LEAD)
            last = y + j * BODY_LEAD
        top = last + BODY_SIZE + BLOCK_GAP

    for j, line in enumerate(_wrap_even(closing, body_f, COL_W)):
        _text(c, line, body_f, bs.CHARCOAL, CLOSE_TOP + j * CLOSE_LEAD)

    logo = Image.open(f'{bs.ASSETS}/logo_nomukita.png').convert('RGBA')
    c.alpha_composite(logo, (LEFT, LOGO_TOP))

    flat = Image.new('RGB', (bs.W, bs.H), bs.BG)
    flat.paste(c, (0, 0), c)
    flat.save(out)
    return out, top
