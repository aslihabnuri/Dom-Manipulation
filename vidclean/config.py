"""Setelan bawaan, preset anti-duplikat, dan pembacaan config.json."""

from __future__ import annotations

import copy
import json
import os
from typing import Any, Dict

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BERKAS_CONFIG = os.path.join(AKAR, "config.json")

# ---------------------------------------------------------------------------
# Setelan bawaan
# ---------------------------------------------------------------------------
BAWAAN: Dict[str, Any] = {
    "gaya": {
        "font": "Montserrat",
        "font_tebal": True,
        "warna_teks": "#FFFFFF",
        "warna_garis": "#000000",
        "tebal_garis": 4,
        "bayangan": 1,
        "kotak_latar": False,
        "warna_kotak": "#000000",
        "transparansi_kotak": 45,
        "ukuran_judul": 68,
        "ukuran_caption": 52,
        "ukuran_subtitle": 62,
        "ukuran_handle": 32,
        "huruf_besar_judul": True,
        "maks_karakter_baris": 22,
        "jarak_huruf": 0.0,
        # Posisi dihitung sebagai porsi tinggi layar (0 = paling atas, 1 = paling bawah).
        "posisi_judul": 0.13,
        "posisi_caption": 0.80,
        "posisi_subtitle": 0.74,
        "margin_samping": 0.09,
        "handle": "",
        "posisi_handle": "atas",
        "transparansi_handle": 35,
    },
    "video": {
        "rasio": "9:16",          # "9:16" | "asli"
        "lebar": 1080,
        "tinggi": 1920,
        "fps": 30,
        "kualitas": 21,           # CRF dasar: makin kecil makin bagus (18-26)
        "latar_blur": True,       # isi ruang kosong dengan latar blur, bukan bar hitam
        "bingkai_latar": "",      # "" = ikuti preset. "blur" | "gelap" (gradasi netral)
        "bingkai": 0,             # 0 = mati. Isi 0.90-0.95 untuk mengecilkan gambar
                                  # di atas latar blur (paling ampuh lawan deteksi duplikat)
        "preset_encode": "medium",
    },
    "audio": {
        "normalisasi": True,      # samakan tingkat kekerasan suara antar video
        "tambah_audio_senyap": True,
        "bitrate": "128k",
    },
    "anti_duplikat": {
        "preset": "seimbang",     # "aman" | "seimbang" | "kuat" | "maksimal"
        "cermin": None,           # None = ikuti preset, True/False = paksa
        "potong_tepi": None,      # None = ikuti preset (persen tepi yang dibuang)
        "dinamis": True,          # gerak dinamis + kecepatan berlapis (rekomendasi: True)
        "target_skor": 80,        # edit ulang otomatis sampai skor tercapai (0 = sekali saja)
    },
}

# ---------------------------------------------------------------------------
# Preset anti-duplikat: nilai berupa rentang (min, maks) yang diacak per video.
# ---------------------------------------------------------------------------
PRESET: Dict[str, Dict[str, Any]] = {
    "aman": {
        "label": "Aman - perubahan halus, hasil hampir sama persis dengan aslinya",
        "cermin": False,
        "zoom": (1.015, 1.030),
        "geser": (-0.004, 0.004),
        "putar": (0.0, 0.0),
        "kecepatan": (0.990, 1.010),
        "kecerahan": (-0.012, 0.012),
        "kontras": (0.985, 1.020),
        "saturasi": (0.960, 1.040),
        "gamma": (0.975, 1.025),
        "warna_hue": (-2.0, 2.0),
        "butiran": (2, 5),
        "ketajaman": (0.10, 0.30),
        "vignette": 0.0,
        "potong_awal": (0.00, 0.10),
        "potong_akhir": (0.00, 0.10),
        "nada_suara": (0.995, 1.005),
        "potong_tepi": 0.0,
        "ubah_fps": False,
        "segmen": (1, 2),
        "drift_putar": (0.03, 0.09),
        "drift_geser": (0.001, 0.002),
        "kurva": (0.006, 0.014),
        "eq_jalur": 1,
    },
    "seimbang": {
        "label": "Seimbang - rekomendasi harian, aman dilihat tapi cukup beda secara teknis",
        "cermin": False,
        "zoom": (1.035, 1.060),
        "geser": (-0.012, 0.012),
        "putar": (-0.35, 0.35),
        "kecepatan": (0.970, 1.030),
        "kecerahan": (-0.030, 0.030),
        "kontras": (0.960, 1.055),
        "saturasi": (0.920, 1.090),
        "gamma": (0.950, 1.055),
        "warna_hue": (-5.0, 5.0),
        "butiran": (5, 11),
        "ketajaman": (0.25, 0.60),
        "vignette": 0.10,
        "potong_awal": (0.10, 0.35),
        "potong_akhir": (0.10, 0.35),
        "nada_suara": (0.985, 1.015),
        "potong_tepi": 0.02,
        "ubah_fps": True,
        "segmen": (2, 3),
        "drift_putar": (0.06, 0.18),
        "drift_geser": (0.002, 0.004),
        "kurva": (0.010, 0.022),
        "eq_jalur": 2,
    },
    "kuat": {
        "label": "Kuat - perubahan paling agresif (termasuk cermin), untuk video yang sering kena flag",
        "cermin": True,
        "zoom": (1.060, 1.100),
        "geser": (-0.020, 0.020),
        "putar": (-0.70, 0.70),
        "kecepatan": (0.945, 1.055),
        "kecerahan": (-0.050, 0.050),
        "kontras": (0.930, 1.085),
        "saturasi": (0.870, 1.140),
        "gamma": (0.920, 1.085),
        "warna_hue": (-9.0, 9.0),
        "butiran": (9, 17),
        "ketajaman": (0.35, 0.80),
        "vignette": 0.18,
        "potong_awal": (0.20, 0.60),
        "potong_akhir": (0.20, 0.60),
        "nada_suara": (0.970, 1.030),
        "potong_tepi": 0.045,
        "ubah_fps": True,
        "segmen": (3, 4),
        "drift_putar": (0.10, 0.30),
        "drift_geser": (0.003, 0.006),
        "kurva": (0.014, 0.028),
        "eq_jalur": 2,
    },
    "maksimal": {
        "label": "Maksimal - semua teknik dinamis + bingkai blur, tanpa membalik gambar (teks tetap terbaca)",
        "cermin": False,
        "zoom": (1.055, 1.085),
        "geser": (-0.016, 0.016),
        "putar": (-0.40, 0.40),
        "kecepatan": (0.940, 1.060),
        "kecerahan": (-0.040, 0.040),
        "kontras": (0.940, 1.070),
        "saturasi": (0.900, 1.100),
        "gamma": (0.940, 1.070),
        "warna_hue": (-7.0, 7.0),
        "butiran": (8, 14),
        "ketajaman": (0.30, 0.70),
        "vignette": 0.14,
        "potong_awal": (0.30, 0.90),
        "potong_akhir": (0.30, 0.90),
        "nada_suara": (0.975, 1.025),
        "potong_tepi": 0.03,
        "ubah_fps": True,
        "segmen": (3, 4),
        "drift_putar": (0.12, 0.32),
        "drift_geser": (0.003, 0.006),
        "kurva": (0.016, 0.032),
        "eq_jalur": 3,
        "bingkai_bawaan": 0.90,
        "bingkai_latar": "gelap",
    },
}

NAMA_PRESET = list(PRESET.keys())


def _gabung(dasar: dict, tambahan: dict) -> dict:
    hasil = copy.deepcopy(dasar)
    for kunci, nilai in (tambahan or {}).items():
        if isinstance(nilai, dict) and isinstance(hasil.get(kunci), dict):
            hasil[kunci] = _gabung(hasil[kunci], nilai)
        else:
            hasil[kunci] = nilai
    return hasil


def muat(path: str | None = None) -> Dict[str, Any]:
    """Baca config.json (kalau ada) lalu gabungkan di atas setelan bawaan."""
    path = path or BERKAS_CONFIG
    if not os.path.exists(path):
        return copy.deepcopy(BAWAAN)
    try:
        with open(path, "r", encoding="utf-8") as f:
            isi = json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"config.json rusak (baris {e.lineno}): {e.msg}\n"
            "Perbaiki tanda koma / kutip, atau hapus berkasnya untuk kembali ke setelan bawaan."
        ) from e
    return _gabung(BAWAAN, isi)


def tulis_bawaan(path: str | None = None) -> str:
    path = path or BERKAS_CONFIG
    with open(path, "w", encoding="utf-8") as f:
        json.dump(BAWAAN, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def ambil_preset(nama: str) -> Dict[str, Any]:
    kunci = (nama or "seimbang").strip().lower()
    if kunci not in PRESET:
        raise ValueError(
            f"Preset '{nama}' tidak dikenal. Pilihan: {', '.join(NAMA_PRESET)}"
        )
    return copy.deepcopy(PRESET[kunci])
