"""Mencari ketukan lagu, lalu menggeser titik potong adegan supaya jatuh di atasnya.

Potongan yang meleset dari ketukan terasa seperti tersandung, walau
penonton jarang bisa menyebut apa yang salah. Potongan yang jatuh tepat di
ketukan terasa disengaja, dan itu salah satu hal yang membuat video acuan
terasa digarap orang, bukan disambung mesin.

Cara kerjanya tiga langkah:

1. Cari ONSET, yaitu saat-saat bunyi tiba-tiba menguat. Dihitung dari
   kenaikan tenaga antar-jendela pendek. Tidak perlu pustaka musik; yang
   dicari cuma lonjakan, dan lonjakan cukup terlihat di tenaga sinyal.

2. Dari jarak antar-onset, tebak TEMPO, lalu bangun kisi ketukan yang rapi.
   Onset saja terlalu berisik untuk dijadikan patokan langsung: ada yang
   terlewat, ada yang palsu. Kisi yang rapi menutupi keduanya.

3. Geser tiap titik potong ke ketukan terdekat, tetapi hanya kalau
   gesernya kecil.

Batas geser itu penting. Panjang tiap adegan ditentukan narasi, dan narasi
tidak boleh dikorbankan demi musik: kalau titik potong ditarik terlalu
jauh, gambar berganti di tengah kata. Maka geser dibatasi, dan sisa
waktunya dikembalikan ke adegan berikutnya supaya total durasinya tetap.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np


def _sinyal(berkas: Path, laju: int = 22050) -> np.ndarray:
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(berkas), "-f", "f32le",
         "-ac", "1", "-ar", str(laju), "-"],
        capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


def cari_onset(berkas: Path, *, laju: int = 22050, jendela: int = 512) -> np.ndarray:
    """Detik-detik saat bunyi menguat tiba-tiba.

    Yang dipakai adalah kenaikan tenaga yang POSITIF saja. Tenaga yang
    menurun bukan awal bunyi, dan kalau ikut dihitung, tiap ketukan
    terhitung dua kali: sekali saat mulai, sekali saat mereda.
    """
    x = _sinyal(berkas, laju)
    if x.size < jendela * 4:
        return np.array([])
    n = x.size // jendela
    tenaga = (x[: n * jendela].reshape(n, jendela) ** 2).sum(axis=1)
    tenaga = np.sqrt(tenaga)
    naik = np.diff(tenaga, prepend=tenaga[0])
    naik[naik < 0] = 0.0
    if naik.max() <= 0:
        return np.array([])
    naik /= naik.max()

    # Ambang adaptif: rata-rata bergerak ditambah sebagian simpangannya,
    # supaya bagian lagu yang pelan tetap punya onset dan bagian yang ramai
    # tidak membanjiri hasilnya.
    lebar = 43                                    # sekitar satu detik
    inti = np.convolve(naik, np.ones(lebar) / lebar, mode="same")
    ambang = inti + 0.10
    puncak = []
    for i in range(1, len(naik) - 1):
        if naik[i] > ambang[i] and naik[i] >= naik[i - 1] and naik[i] > naik[i + 1]:
            puncak.append(i)
    return np.array(puncak) * (jendela / laju)


def tebak_tempo(onset: np.ndarray, *, bpm_min: float = 60, bpm_maks: float = 180) -> float:
    """Tebak ketukan per menit dari jarak antar-onset.

    Jarak antar-onset dikumpulkan jadi histogram, lalu yang paling sering
    muncul dianggap satu ketukan. Kelipatan dua dilipat ke dalam rentang
    yang wajar, karena onset sering tertangkap tiap setengah ketukan.
    """
    if onset.size < 4:
        return 0.0
    jarak = np.diff(onset)
    jarak = jarak[(jarak > 0.2) & (jarak < 2.0)]
    if jarak.size < 3:
        return 0.0
    tong = np.round(jarak / 0.01).astype(int)
    nilai, jumlah = np.unique(tong, return_counts=True)
    sela = nilai[jumlah.argmax()] * 0.01
    bpm = 60.0 / sela
    while bpm < bpm_min:
        bpm *= 2
    while bpm > bpm_maks:
        bpm /= 2
    return float(bpm)


def kisi_ketukan(berkas: Path, sampai: float) -> tuple[np.ndarray, float]:
    """Kisi ketukan rapi sepanjang durasi yang diminta, plus tempo tebakannya.

    Kisi dimulai dari onset pertama, bukan dari detik nol, supaya
    ketukannya sejajar dengan lagunya dan bukan dengan awal berkasnya.
    """
    onset = cari_onset(berkas)
    bpm = tebak_tempo(onset)
    if bpm <= 0:
        return np.array([]), 0.0
    sela = 60.0 / bpm
    mulai = float(onset[0]) if onset.size else 0.0
    while mulai - sela > 0:
        mulai -= sela
    return np.arange(mulai, sampai + sela, sela), bpm


def rapatkan_ke_ketukan(
    durasi: list[float],
    berkas_musik: Path,
    *,
    geser_maks: float = 0.28,
) -> tuple[list[float], dict]:
    """Geser tiap titik potong ke ketukan terdekat, seperlunya saja.

    Mengembalikan (durasi baru, laporan). Total durasinya dijaga tetap:
    apa yang diambil dari satu adegan dikembalikan ke adegan sesudahnya,
    supaya narasi tidak melenceng makin jauh di ujung video.

    geser_maks menjaga narasi. Digeser lebih dari itu, gambar berganti di
    tengah kata, dan itu lebih mengganggu daripada potongan yang meleset
    sedikit dari ketukan.
    """
    total = float(sum(durasi))
    kisi, bpm = kisi_ketukan(berkas_musik, total + 2.0)
    if kisi.size == 0:
        return list(durasi), {"bpm": 0.0, "dipindah": 0, "keterangan": "tempo tidak terbaca"}

    batas = np.cumsum(durasi)[:-1]          # titik potong antaradegan
    baru, dipindah, geseran = [], 0, []
    for t in batas:
        dekat = float(kisi[np.abs(kisi - t).argmin()])
        selisih = dekat - t
        if abs(selisih) <= geser_maks:
            baru.append(dekat)
            dipindah += 1
            geseran.append(selisih)
        else:
            baru.append(float(t))
            geseran.append(0.0)

    tepi = [0.0] + baru + [total]
    hasil = [round(tepi[i + 1] - tepi[i], 3) for i in range(len(tepi) - 1)]
    lapor = {
        "bpm": round(bpm, 1),
        "sela_ketukan": round(60.0 / bpm, 3),
        "dipindah": dipindah,
        "dari": len(batas),
        "geser_rata": round(float(np.mean(np.abs(geseran))), 3) if geseran else 0.0,
        "geser_maks": round(float(np.max(np.abs(geseran))), 3) if geseran else 0.0,
    }
    return hasil, lapor
