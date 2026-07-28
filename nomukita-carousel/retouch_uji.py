"""Besarkan pouch pada Uji_S1_500gr sampai seukuran Shizouka_S1_500gr.

Kedua slide itu buatan pelanggan, bukan keluaran pipeline ini, dan tata letaknya
sama persis: kolom kriteria rasa di kiri, lencana ORIGIN di kanan, tiga segel di
bawah. Yang berbeda cuma pouch-nya, dan yang di Uji jauh lebih kecil:

    Uji        siluet gelap 228 x 374, alas di y 797
    Shizouka   siluet gelap 309 x 507, alas di y 857

Jadi yang dikerjakan di sini bukan membangun ulang slide-nya - naskah, kolom
kriteria dan ketiga segelnya tidak disentuh sama sekali - melainkan satu operasi
gambar: pouch Uji beserta bayangannya dipotong, dihapus, diperbesar 1,3556 kali,
lalu ditempel lagi pada kotak yang sama persis dengan milik Shizouka.

Faktor 1,3556 = 507/374 bukan angka pilihan. Diperiksa balik: 228 x 1,3556 = 309,
yang sama persis dengan lebar siluet Shizouka. Kedua mockup-nya memang beresolusi
identik (562 x 913), jadi satu faktor tinggi sudah cukup untuk menyamakan
keduanya - lebarnya ikut sendiri.

Bayangan lemparnya ikut dipotong dan ikut diperbesar. Menempelkan pouch tanpa
bayangannya akan meninggalkan pouch yang melayang, dan menggambar bayangan baru
berarti menebak arah cahaya yang sudah ada di slide itu.
"""

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BG = (241, 240, 235)


def pouch_boxes(path):
    """(kotak siluet gelap, kotak pouch+bayangan) pada satu slide."""
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    ink = np.abs(a - np.array(BG)).max(2) > 8

    # Komponen terbesar di pita produk adalah pouch beserta bayangannya. Kolom
    # kriteria, lencana ORIGIN dan segel-segelnya berdiri sebagai komponen
    # sendiri dan tidak pernah menyentuhnya.
    lab, n = ndi.label(ink[340:880], np.ones((3, 3)))
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    big = lab == int(np.argmax(sizes)) + 1
    ys, xs = np.nonzero(big)
    whole = (int(xs.min()), int(ys.min()) + 340, int(xs.max()) + 1, int(ys.max()) + 341)

    dark = (a.mean(2) < 90)
    dark[:340] = False
    dark[880:] = False
    dark[:, :whole[0]] = False
    dark[:, whole[2]:] = False
    ys, xs = np.nonzero(dark)
    body = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return body, whole


def build(src="drive_ref/Uji_S1_500gr.png", ref="drive_ref/Shizouka_S1_500gr.png",
          out="Uji_S1_500gr.png", pad=40):
    s_body, s_whole = pouch_boxes(src)
    r_body, _ = pouch_boxes(ref)

    scale = (r_body[3] - r_body[1]) / (s_body[3] - s_body[1])
    im = Image.open(src).convert("RGB")

    # Potongan diambil dengan pelega, supaya tepi bayangannya yang paling tipis
    # ikut terbawa dan tidak tertinggal sebagai garis samar setelah dihapus.
    cut = (max(0, s_whole[0] - pad), max(0, s_whole[1] - pad),
           min(im.width, s_whole[2] + pad), min(im.height, s_whole[3] + pad))
    piece = im.crop(cut)
    piece = piece.resize((round(piece.width * scale), round(piece.height * scale)),
                         Image.LANCZOS)

    flat = im.copy()
    flat.paste(Image.new("RGB", (cut[2] - cut[0], cut[3] - cut[1]), BG), (cut[0], cut[1]))

    # Ditempel dengan patokan siluet gelapnya, bukan kotak potongannya: yang
    # harus sama dengan Shizouka adalah pouch-nya, dan bayangannya menjulur
    # berbeda-beda di kiri.
    body_in_piece = ((s_body[0] - cut[0]) * scale, (s_body[3] - cut[1]) * scale)
    x = round(r_body[0] - body_in_piece[0])
    y = round(r_body[3] - body_in_piece[1])

    # Ditempel dengan MASKER, bukan sebagai persegi. Potongan yang diperbesar
    # membawa serta latar bone white di sekelilingnya, dan persegi itu 527 x 618
    # px - cukup besar untuk menimpa tepi kiri lencana ORIGIN, ujung kolom
    # kriteria dan puncak ketiga segel di bawah. Versi pertama memang
    # menghapusnya: 2.104 px lencana, 4.773 px segel dan 1.286 px kolom kriteria
    # ikut terbawa. Yang ditempel sekarang hanya piksel yang memang bukan latar.
    pa = np.asarray(piece).astype(int)
    mask = (np.abs(pa - np.array(BG)).max(2) > 3).astype(float)
    mask = ndi.gaussian_filter(mask, 0.6)
    flat.paste(piece, (x, y), Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8), "L"))
    flat.save(out)
    return out


if __name__ == "__main__":
    out = build()
    b, w = pouch_boxes(out)
    rb, _ = pouch_boxes("drive_ref/Shizouka_S1_500gr.png")
    print("hasil  siluet", b, "tinggi", b[3] - b[1], "lebar", b[2] - b[0])
    print("acuan  siluet", rb, "tinggi", rb[3] - rb[1], "lebar", rb[2] - rb[0])
