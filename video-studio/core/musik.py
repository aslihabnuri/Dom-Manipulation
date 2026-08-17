"""Musik latar sungguhan lewat Suno di Kie.

Sampai sekarang musik latar kita dibangkitkan matematis oleh ffmpeg: nada
dengung yang aman tapi tipis, dan jelas terdengar bukan musik. Video acuan
memakai musik yang benar-benar dikarang, dan itu bagian dari kenapa ia
terasa jadi.

Suno di Kie TIDAK memakai endpoint pekerjaan yang sama dengan model lain.
Ia punya jalurnya sendiri:

    POST https://api.kie.ai/api/v1/generate            membuat tugas
    GET  https://api.kie.ai/api/v1/generate/record-info?taskId=...   hasilnya

Dua hal yang membedakannya dari model lain di aplikasi ini:

1. callBackUrl WAJIB diisi walaupun kita tidak memakainya. Kita tetap
   menunggu dengan menanyai hasilnya berulang, karena tidak ada alamat
   publik yang bisa dihubungi balik dari sini.

2. Sekali panggil, Suno mengembalikan DUA lagu sekaligus. Yang dipakai
   satu, tetapi ongkosnya tetap untuk keduanya, jadi tidak ada gunanya
   memanggil dua kali untuk mencari pilihan.

Musik instrumental dipakai tanpa kecuali. Lagu bervokal akan berebut
ruang dengan narator, dan pada video sepanjang empat puluh detik itu
membuat narasinya sulit ditangkap.
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from pathlib import Path

import requests

BUAT = "https://api.kie.ai/api/v1/generate"
LIHAT = "https://api.kie.ai/api/v1/generate/record-info"

# Alamat balasan tidak dipakai, tetapi wajib ada. Diisi alamat yang jelas
# tidak berarti supaya tidak ada yang mengira kita benar-benar menunggunya.
BALASAN_KOSONG = "https://example.invalid/tidak-dipakai"

MODEL_BAWAAN = "V5"


@dataclass
class Lagu:
    berkas: Path
    judul: str
    durasi: float
    kredit: float


def gaya_dari_suasana(nama_tema: str, nama_suasana: str | None = None) -> str:
    """Gaya musik dari pasangan tema dan suasana.

    Tema menentukan BUNYI apa yang dipakai, suasana menentukan BAGAIMANA
    dimainkan. Koto Jepang bisa terdengar tenang atau mendesak tergantung
    tempo dan tangga nadanya, dan yang menentukan itu suasananya.

    Ini dipakai supaya lagu dan narator berangkat dari sumber yang sama.
    Sebelumnya keduanya dipilih terpisah, dan hasilnya musik muram
    berpasangan dengan narator yang gembira.
    """
    from .suasana import suasana as _suasana

    s = _suasana(nama_suasana)
    return gaya_dari_tema(nama_tema, s.musik)


def gaya_dari_tema(nama_tema: str, suasana: str = "") -> str:
    """Terjemahkan tema tampilan jadi gaya musik yang sepadan.

    Musik dan rupa harus bercerita hal yang sama. Poster kertas Jepang
    berteman gamelan sintetis akan terasa tertukar.
    """
    peta = {
        "tinta-timur": "traditional Japanese koto and shakuhachi, sparse, contemplative, "
                       "documentary underscore",
        "koran-editorial": "vintage newsreel underscore, upright bass, brushed drums, "
                           "muted trumpet, mid-century documentary",
        "retro-amerika": "1950s advertising jingle instrumental, bright brass, vibraphone, "
                         "optimistic",
        "deco-emas": "1920s art-deco salon jazz, soft piano and muted horn, elegant, "
                     "unhurried",
        "zine-punk": "lo-fi punk instrumental, fuzzy guitar, driving drums, raw",
        "swiss-bersih": "minimal modern electronic underscore, clean pulses, restrained",
    }
    dasar = peta.get(nama_tema, peta["koran-editorial"])
    return f"{dasar}, instrumental only, no vocals, {suasana}".strip().rstrip(",")


def buat_musik(
    api_key: str,
    keluar: Path,
    *,
    gaya: str,
    judul: str = "Latar",
    model: str = MODEL_BAWAAN,
    tunggu_maks: float = 420.0,
    lapor=None,
) -> Lagu:
    """Karang satu lagu instrumental. Mengembalikan berkas dan ongkosnya.

    Ongkos dihitung dari selisih saldo, bukan dari tabel harga, karena
    tabel harga pernah meleset dan itu yang dulu membuat kredit hilang
    tanpa disadari.
    """
    from .kie import KieClient, KieError

    klien = KieClient(api_key)
    sebelum = klien.credits()

    badan = {
        "prompt": gaya,
        "style": gaya[:190],
        "title": judul[:80],
        "customMode": True,
        "instrumental": True,
        "model": model,
        "callBackUrl": BALASAN_KOSONG,
    }
    r = requests.post(BUAT, headers=klien.headers, json=badan, timeout=60)
    j = r.json()
    if j.get("code") != 200 or not j.get("data"):
        raise KieError(f"Suno menolak: {j.get('msg')}")
    tugas = j["data"]["taskId"]
    if lapor:
        lapor(f"Suno mulai mengarang, tugas {tugas}")

    batas = time.time() + tunggu_maks
    url_lagu = nama = None
    while time.time() < batas:
        time.sleep(6)
        d = requests.get(LIHAT, headers=klien.headers,
                         params={"taskId": tugas}, timeout=60).json()
        data = (d.get("data") or {})
        status = data.get("status") or ""
        potongan = ((data.get("response") or {}).get("sunoData") or [])
        if potongan and potongan[0].get("audioUrl"):
            url_lagu = potongan[0]["audioUrl"]
            nama = potongan[0].get("title") or judul
            break
        if status.upper() in {"CREATE_TASK_FAILED", "GENERATE_AUDIO_FAILED",
                              "CALLBACK_EXCEPTION", "SENSITIVE_WORD_ERROR"}:
            raise KieError(f"Suno gagal: {status}")
        if lapor:
            lapor(f"  masih dikarang ({status or 'menunggu'})")
    if not url_lagu:
        raise KieError("Suno tidak selesai dalam waktu yang diberikan")

    keluar.parent.mkdir(parents=True, exist_ok=True)
    klien.download(url_lagu, keluar)
    kredit = round(sebelum - klien.credits(), 2)
    if lapor:
        lapor(f"Lagu siap: {keluar.name} ({kredit} kredit)")

    # durasi_audio tinggal di tts.py, bukan audio.py, karena di situ ia
    # pertama kali dibutuhkan untuk mengukur panjang narasi.
    from .tts import durasi_audio
    return Lagu(keluar, nama or judul, durasi_audio(keluar), kredit)
