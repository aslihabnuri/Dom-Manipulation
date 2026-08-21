#!/usr/bin/env python3
"""Buat foto atau klip produk dengan AI (lewat kie.ai), untuk disisipkan ke video.

Contoh:
    python3 aset.py foto_produk.jpg --perintah "foto produk di atas meja marmer,
        cahaya studio lembut, latar bersih, tegak 9:16"

    python3 aset.py --perintah "botol serum di atas handuk putih" --model "qwen/text-to-image"

Hasilnya tersimpan di assets/produk/ dan langsung bisa dipakai:
    python3 edit.py video.mp4 --sisip "assets/produk/hasil.png,5,2.5,Serum Vitamin C"
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vidclean import kie  # noqa: E402
from vidclean.config import AKAR  # noqa: E402

FOLDER = os.path.join(AKAR, "assets", "produk")


def main() -> int:
    p = argparse.ArgumentParser(
        description="Buat foto/klip produk dengan AI untuk disisipkan ke video.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Daftar model terbaru ada di https://kie.ai/market\n"
               "Kunci API diisi lewat environment variable KIE_API_KEY atau berkas .env",
    )
    p.add_argument("foto", nargs="?", default="",
                   help="foto produk yang mau diolah (kosongkan untuk membuat dari nol)")
    p.add_argument("--perintah", required=True, help="deskripsi hasil yang diinginkan")
    p.add_argument("-o", "--keluar", default="", help="nama berkas hasil")
    p.add_argument("--model", default="", help=f"slug model (bawaan: {kie.MODEL_GAMBAR})")
    p.add_argument("--kekuatan", type=float, default=None,
                   help="seberapa jauh berubah dari foto asli, 0-1 (bawaan 0.8)")
    p.add_argument("--tunggu", type=float, default=600.0, help="batas waktu tunggu (detik)")
    a = p.parse_args()

    try:
        klien = kie.Klien(batas_tunggu=a.tunggu)
    except kie.KunciTidakAda as e:
        print(e)
        return 2

    os.makedirs(FOLDER, exist_ok=True)
    if a.keluar:
        tujuan = a.keluar
    else:
        dasar = os.path.splitext(os.path.basename(a.foto))[0] if a.foto else "produk"
        tujuan = os.path.join(FOLDER, f"{dasar}_ai.png")

    def kabar(tahap: str) -> None:
        print(f"  ... {tahap}", flush=True)

    try:
        if a.foto:
            tambahan = {"strength": a.kekuatan} if a.kekuatan is not None else None
            hasil = klien.olah_gambar(
                a.foto, a.perintah, tujuan,
                model=a.model or kie.MODEL_GAMBAR, tambahan=tambahan, kabar=kabar,
            )
        else:
            if not a.model:
                print("Untuk membuat dari nol (tanpa foto), sebutkan modelnya lewat --model.\n"
                      "Daftar model: https://kie.ai/market")
                return 2
            hasil = klien.dari_perintah(a.perintah, tujuan, a.model, kabar=kabar)
    except (kie.KieGagal, FileNotFoundError) as e:
        print(f"Gagal: {e}")
        return 1

    ukuran = os.path.getsize(hasil) / 1024
    print(f"\nSelesai -> {hasil}  ({ukuran:.0f} KB)")
    print(f"Pakai di video:\n  python3 edit.py video.mp4 --sisip \"{hasil},5,2.5,Nama Produk\"")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
