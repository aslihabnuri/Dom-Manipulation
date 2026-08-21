"""Pembuat musik latar orisinal (bebas royalti) untuk video estetik.

Lagu disintesis langsung (numpy) - bukan diambil dari mana pun - jadi aman
dipakai komersial dan tidak akan kena klaim hak cipta audio. Gayanya lo-fi
chill: piano elektrik lembut, bass bulat, hi-hat halus, dan kresek vinyl
tipis. Tiap seed menghasilkan lagu yang berbeda (tempo, nada dasar, progresi).

Untuk jangkauan maksimal di TikTok tetap disarankan menambah lagu tren dari
library TikTok saat mengunggah - tapi untuk video yang butuh musik tertanam,
modul ini jawabannya.
"""

from __future__ import annotations

import random
import wave
from typing import List, Sequence, Tuple

import numpy as np

SR = 48000


def _nada(midi: float) -> float:
    return 440.0 * 2.0 ** ((midi - 69) / 12.0)


def _ep(freq: float, durasi: float, vol: float, detune: float = 0.0025) -> np.ndarray:
    """Satu nada 'electric piano' lembut, stereo."""
    n = int(durasi * SR)
    t = np.arange(n) / SR
    env = np.minimum(t / 0.015, 1.0) * np.exp(-t / (durasi * 0.55))

    def suara(f: float) -> np.ndarray:
        return (np.sin(2 * np.pi * f * t)
                + 0.35 * np.sin(2 * np.pi * 2 * f * t)
                + 0.10 * np.sin(2 * np.pi * 3 * f * t))

    kiri = suara(freq * (1 - detune)) * env
    kanan = suara(freq * (1 + detune)) * env
    trem = 1.0 - 0.06 * (1 - np.cos(2 * np.pi * 3.8 * t)) / 2
    return np.stack([kiri * trem, kanan * trem], axis=1) * vol


def _bass(freq: float, durasi: float, vol: float) -> np.ndarray:
    n = int(durasi * SR)
    t = np.arange(n) / SR
    env = np.minimum(t / 0.008, 1.0) * np.exp(-t / (durasi * 0.7))
    y = (np.sin(2 * np.pi * freq * t) + 0.15 * np.sin(2 * np.pi * 2 * freq * t)) * env
    return np.stack([y, y], axis=1) * vol


def _kick(vol: float) -> np.ndarray:
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f = 110 * np.exp(-t / 0.045) + 42
    fase = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(fase) * np.exp(-t / 0.055)
    return np.stack([y, y], axis=1) * vol


def _hat(rng: np.random.Generator, vol: float) -> np.ndarray:
    n = int(0.045 * SR)
    y = rng.standard_normal(n) * np.exp(-np.arange(n) / (0.012 * SR))
    spektrum = np.fft.rfft(y)
    frek = np.fft.rfftfreq(n, 1 / SR)
    spektrum[(frek < 5000) | (frek > 12000)] = 0
    y = np.fft.irfft(spektrum, n)
    puncak = np.max(np.abs(y)) or 1.0
    y = y / puncak
    return np.stack([y * 0.8, y], axis=1) * vol


def _vinyl(n: int, rng: np.random.Generator, vol: float) -> np.ndarray:
    y = np.zeros(n)
    jumlah = max(1, int(n / SR * 7))
    posisi = rng.integers(0, max(1, n - 300), jumlah)
    for p in posisi:
        panjang = int(rng.integers(40, 260))
        y[p:p + panjang] += (rng.standard_normal(panjang)
                             * np.exp(-np.arange(panjang) / 60.0)
                             * rng.uniform(0.2, 1.0))
    return np.stack([y, y], axis=1) * vol


AKORD = {
    "m7": (0, 3, 7, 10),
    "maj7": (0, 4, 7, 11),
    "7": (0, 4, 7, 10),
    "m9": (0, 3, 7, 10, 14),
    "add9": (0, 4, 7, 14),
}

# Progresi chill (offset semitone dari nada dasar + jenis akord), 4 bar.
PROGRESI: List[Sequence[Tuple[int, str]]] = [
    [(0, "m7"), (8, "maj7"), (3, "maj7"), (10, "7")],       # i - VI - III - VII
    [(0, "m9"), (5, "m7"), (8, "maj7"), (7, "7")],          # i - iv - VI - V7
    [(0, "maj7"), (9, "m7"), (5, "maj7"), (7, "7")],        # I - vi - IV - V
    [(0, "maj7"), (4, "m7"), (5, "maj7"), (5, "m7")],       # I - iii - IV - iv
    [(0, "m7"), (10, "maj7"), (8, "maj7"), (7, "m7")],      # i - VII - VI - v
]


def buat_lagu(path: str, durasi: float, seed: int = 0) -> str:
    """Tulis satu lagu lo-fi stereo 48 kHz sepanjang `durasi` detik ke `path`."""
    acak = random.Random(seed)
    rng = np.random.default_rng(seed)

    tempo = acak.uniform(76, 90)
    ketukan = 60.0 / tempo
    bar = 4 * ketukan
    dasar = acak.choice([57, 55, 53, 60, 50])          # A3 G3 F3 C4 D3
    progresi = acak.choice(PROGRESI)

    total = int((durasi + 1.0) * SR)
    lagu = np.zeros((total, 2))

    def tempel(potongan: np.ndarray, detik: float) -> None:
        awal = int(detik * SR)
        akhir = min(total, awal + len(potongan))
        if awal < total:
            lagu[awal:akhir] += potongan[: akhir - awal]

    t = 0.0
    nomor_bar = 0
    while t < durasi:
        akor_dasar, jenis = progresi[nomor_bar % len(progresi)]
        nada_akord = [dasar + akor_dasar + ofs for ofs in AKORD[jenis]]

        # EP: pukulan di ketukan 1 dan 2.5 (sinkopasi), petikan berjeda tipis.
        for pukulan, panjang, vol in ((0.0, bar * 0.9, 0.16), (2.5 * ketukan, bar * 0.45, 0.11)):
            for i, midi in enumerate(nada_akord):
                tempel(_ep(_nada(midi), panjang, vol * acak.uniform(0.85, 1.0)),
                       t + pukulan + i * 0.012)

        # Bass di akar akord.
        akar = dasar + akor_dasar - 24
        tempel(_bass(_nada(akar), ketukan * 1.6, 0.30), t)
        if acak.random() < 0.7:
            tempel(_bass(_nada(akar), ketukan * 0.8, 0.22), t + 2.5 * ketukan)

        # Kick lembut ketukan 1 dan 3.
        tempel(_kick(0.5), t)
        tempel(_kick(0.38), t + 2 * ketukan)

        # Hi-hat tiap setengah ketukan, sesekali bolong biar manusiawi.
        for k in range(8):
            if acak.random() < 0.09:
                continue
            vol = 0.055 if k % 2 == 0 else 0.032
            tempel(_hat(rng, vol * acak.uniform(0.8, 1.1)), t + k * ketukan / 2)

        t += bar
        nomor_bar += 1

    lagu += _vinyl(total, rng, 0.012)

    # Sentuhan lo-fi: lowpass 10.5 kHz + highpass 35 Hz (lewat FFT), soft clip.
    for kanal in range(2):
        spektrum = np.fft.rfft(lagu[:, kanal])
        frek = np.fft.rfftfreq(total, 1 / SR)
        spektrum[frek > 10500] = 0
        spektrum[frek < 35] = 0
        lagu[:, kanal] = np.fft.irfft(spektrum, total)
    lagu = np.tanh(lagu * 1.4) / np.tanh(1.4)

    puncak = np.max(np.abs(lagu)) or 1.0
    lagu = lagu / puncak * 0.62

    tepi = int(0.06 * SR)
    lagu[:tepi] *= np.linspace(0, 1, tepi)[:, None]
    lagu = lagu[: int(durasi * SR)]
    lagu[-tepi:] *= np.linspace(1, 0, tepi)[:, None]

    data = (lagu * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    return path
