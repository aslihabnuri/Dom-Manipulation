#!/usr/bin/env python3
"""Susun ulang urutan scene di dalam SATU video, tanpa mengubah tampilannya.

Scene pembuka dan penutup dikunci di tempatnya; scene di tengah diacak.
Tidak ada filter, grading, zoom, atau perubahan kecepatan - warna dan
komposisi tetap persis seperti video aslinya.

Contoh:
    python3 susun.py "Francine Medium(1).mp4"
    python3 susun.py video.mp4 --varian 5 --jaga-awal 1 --jaga-akhir 1
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vidclean.cli import FOLDER_KELUAR          # noqa: E402
from vidclean.probe import periksa              # noqa: E402
from vidclean.susun import susun                # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(
        description="Susun ulang scene tengah satu video; awal & akhir tetap.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("video", help="berkas video sumber")
    p.add_argument("-o", "--keluar", default="", help="nama berkas hasil")
    p.add_argument("--varian", type=int, default=1, help="buat berapa susunan berbeda")
    p.add_argument("--jaga-awal", type=int, default=1, help="berapa scene awal yang dikunci")
    p.add_argument("--jaga-akhir", type=int, default=1, help="berapa scene akhir yang dikunci")
    p.add_argument("--min-scene", type=int, default=6,
                   help="kalau scene terdeteksi lebih sedikit, scene panjang dibelah")
    p.add_argument("--kualitas", type=int, default=17, help="CRF (makin kecil makin jernih)")
    p.add_argument("--tanpa-audio", action="store_true", help="buang audio asli")
    p.add_argument("--seed", type=int, default=None)
    a = p.parse_args()

    if not os.path.isfile(a.video):
        print(f"Video tidak ditemukan: {a.video}")
        return 1

    info = periksa(a.video)
    print(f"ASAL : {info.ringkas()}")
    os.makedirs(FOLDER_KELUAR, exist_ok=True)
    dasar = os.path.splitext(os.path.basename(a.video))[0]

    gagal = 0
    for varian in range(max(1, a.varian)):
        akhiran = f"_v{varian + 1}" if a.varian > 1 else ""
        if a.keluar:
            akar, ekst = os.path.splitext(a.keluar)
            tujuan = f"{akar}{akhiran}{ekst or '.mp4'}"
        else:
            tujuan = os.path.join(FOLDER_KELUAR, f"{dasar}_susun{akhiran}.mp4")

        seed = a.seed if a.seed is not None else None
        if seed is not None:
            seed += varian * 7919
        elif varian:
            seed = int(os.path.getsize(a.video)) % (10 ** 9) + varian * 7919

        try:
            print(f"\n=== Susunan {varian + 1}/{a.varian} ===")
            susun(a.video, tujuan, seed=seed,
                  jaga_awal=a.jaga_awal, jaga_akhir=a.jaga_akhir,
                  min_scene=a.min_scene, crf=a.kualitas,
                  ikut_audio=not a.tanpa_audio,
                  kabar=lambda m: print(f"  ... {m}"))
            print(f"  Selesai -> {tujuan}")
            print(f"  HASIL: {periksa(tujuan).ringkas()}")
        except Exception as e:  # noqa: BLE001
            gagal += 1
            print(f"  GAGAL: {type(e).__name__}: {e}")

    return 1 if gagal else 0


if __name__ == "__main__":
    raise SystemExit(main())
