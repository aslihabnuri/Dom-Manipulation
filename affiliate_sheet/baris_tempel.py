# -*- coding: utf-8 -*-
"""Buat baris siap tempel untuk Google Sheet "Daftar Affiliate TikTok - Toni Black".

Dipakai supaya penambahan data TIDAK perlu menghapus atau mengganti file lama.
Hasilnya berupa teks TSV yang tinggal di-paste ke sheet yang sudah ada.

Cara pakai:

  1. Semua kreator (dipakai kalau sheet masih kosong):
         python3 baris_tempel.py > semua.tsv

  2. Hanya kreator baru (dipakai kalau sheet sudah berisi data):
         File > Download > Comma Separated Values di Google Sheet,
         simpan sebagai sheet_sekarang.csv, lalu:
         python3 baris_tempel.py sheet_sekarang.csv > baris_baru.tsv

  3. Buka Google Sheet yang sama, klik sel B di baris kosong pertama,
     lalu Ctrl+V. Kolom A (No) terisi sendiri karena berisi rumus,
     jadi tarik rumus kolom A ke bawah sejauh baris baru.

Catatan: kolom Nomor Whatsapp, Product yang Dikirim, Dihubungi Via Apa?,
Progress dan Komisi sengaja dibiarkan kosong karena itu kolom isian manual.
Progress diisi "Belum dihubungi" mengikuti permintaan awal.
"""

import csv
import sys

from data_batch1 import agregasi

# Urutan kolom di sheet, mulai kolom B (kolom A berisi rumus nomor urut).
KOLOM = ["Nama Kreator", "Handle Kreator", "Followers", "GMV (Penjualan)",
         "Quantity Terjual", "Harga Jual Rata-Rata", "Jumlah Video", "Jumlah Live",
         "Nomor Whatsapp", "Product yang Dikirim", "Dihubungi Via Apa?",
         "Progress", "Komisi"]

PROGRESS_AWAL = "Belum dihubungi"


def handle_yang_sudah_ada(path_csv):
    """Ambil daftar handle yang sudah ada di sheet dari hasil export CSV."""
    sudah = set()
    with open(path_csv, newline="", encoding="utf-8-sig") as f:
        for baris in csv.reader(f):
            # Kolom C (indeks 2) adalah Handle Kreator.
            if len(baris) > 2:
                h = baris[2].strip()
                if h and h.lower() != "handle kreator":
                    sudah.add(h.lower())
    return sudah


def baris_tsv(r):
    return "\t".join([
        r["nama"],
        r["handle"],
        str(r["followers"]),
        str(int(round(r["gmv"]))),
        str(r["qty"]),
        str(int(round(r["aov"]))),
        str(r["video"]),
        str(r["live"]),
        "",                 # Nomor Whatsapp
        "",                 # Product yang Dikirim
        "",                 # Dihubungi Via Apa?
        PROGRESS_AWAL,      # Progress
        "",                 # Komisi
    ])


def main():
    data = agregasi()
    if len(sys.argv) > 1:
        sudah = handle_yang_sudah_ada(sys.argv[1])
        data = [r for r in data if r["handle"].lower() not in sudah]
        sys.stderr.write("sudah ada di sheet : {}\n".format(len(sudah)))
    sys.stderr.write("baris untuk ditempel: {}\n".format(len(data)))
    sys.stderr.write("kolom               : B sampai N\n")
    for r in data:
        print(baris_tsv(r))


if __name__ == "__main__":
    main()
