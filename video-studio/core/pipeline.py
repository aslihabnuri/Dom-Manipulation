"""Alur kerja produksi, dari foto produk sampai video siap unggah.

Urutan tahap sengaja dibuat dari yang paling murah ke yang paling mahal,
dengan persetujuan manusia di antaranya:

  Tahap 1  Produk       unggah foto           gratis
  Tahap 2  Riset        cari topik cerita     gratis
  Tahap 3a Naskah       tulis naskah          gratis
  Tahap 3b Storyboard   gambar dan suara      berbayar, ada perkiraan biaya
  ---------------- PERSETUJUAN PENGGUNA ----------------
  Tahap 4  Render       rakit video, caption  gratis

Dengan susunan ini, semua hal yang menentukan bagus atau tidaknya video
sudah bisa dilihat dan didengar sebelum tombol persetujuan ditekan.
"""
from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from . import (
    assemble,
    audio as audio_mod,
    config,
    drive,
    research,
    script,
    social,
    subtitles,
    tts,
    visuals,
)
from .categories import KATEGORI
from .kie import KieClient, KieError
from .store import Proyek

Lapor = Callable[[str], None]

# Jeda pendek antaradegan supaya narasi tidak terdengar tergesa.
JEDA_ADEGAN = 0.18


def _nihil(_: str) -> None:
    return None


# ---------------------------------------------------------------------------
# Tahap 2 — Riset topik
# ---------------------------------------------------------------------------
def jalankan_riset(
    klien: KieClient,
    proyek: Proyek,
    *,
    jumlah: int = 6,
    catatan: str = "",
    pakai_tren: bool = True,
    model: str | None = None,
    lapor: Lapor = _nihil,
) -> list[research.KartuTopik]:
    produk = proyek.get("produk_nama", "")
    kategori = proyek.get("kategori", "fnb")
    if not produk:
        raise ValueError("Nama produk belum diisi.")

    lapor("Mengambil berita dan tren terbaru dari Indonesia...")
    kartu, sinyal = research.cari_topik(
        klien, produk, kategori,
        jumlah=jumlah, catatan=catatan, model=model, pakai_tren=pakai_tren,
    )
    lapor(f"Dapat {len(kartu)} ide topik dari {len(sinyal.get('berita', []))} berita.")

    proyek.set("topik", [k.dict() for k in kartu])
    proyek.set("sinyal_riset", sinyal)
    proyek.naik_tahap("riset")
    proyek.catat(f"Riset selesai: {len(kartu)} topik.")
    return kartu


# ---------------------------------------------------------------------------
# Tahap 3a — Naskah
# ---------------------------------------------------------------------------
def jalankan_naskah(
    klien: KieClient,
    proyek: Proyek,
    topik: dict,
    *,
    durasi_target: int = 65,
    jumlah_adegan: int = 10,
    catatan: str = "",
    model: str | None = None,
    lapor: Lapor = _nihil,
) -> script.Naskah:
    lapor("Menulis naskah bercerita...")
    naskah = script.buat_naskah(
        klien,
        produk=proyek.get("produk_nama", ""),
        kode_kategori=proyek.get("kategori", "fnb"),
        judul=topik.get("judul", ""),
        hook=topik.get("hook", ""),
        arketipe=topik.get("arketipe", "sejarah"),
        poin_cerita=topik.get("poin_cerita", []),
        durasi_target=durasi_target,
        jumlah_adegan=jumlah_adegan,
        catatan=catatan,
        merek=proyek.get("produk_merek", ""),
        model=model,
    )
    lapor(
        f"Naskah selesai: {len(naskah.adegan)} adegan, {naskah.jumlah_kata} kata, "
        f"perkiraan {naskah.perkiraan_durasi:.0f} detik."
    )
    proyek.set("naskah", naskah.dict())
    proyek.set("topik_terpilih", topik)
    proyek.naik_tahap("naskah")
    proyek.catat(f"Naskah dibuat: {naskah.judul}")
    return naskah


# ---------------------------------------------------------------------------
# Tahap 3b — Storyboard (gambar + suara)
# ---------------------------------------------------------------------------
@dataclass
class HasilStoryboard:
    gambar: list[visuals.HasilGambar]
    suara: dict[int, tts.HasilSuara]
    kredit: float
    durasi_total: float


def perkiraan_biaya_storyboard(
    jumlah_adegan: int, model_gambar: str, jumlah_kata: int
) -> dict[str, float]:
    """Hitung perkiraan biaya sebelum pengguna menekan tombol."""
    biaya_gambar = visuals.perkiraan_biaya_gambar(jumlah_adegan, model_gambar)
    # Pengukuran nyata: Gemini TTS memakai sekitar 1,65 kredit untuk 12 detik.
    detik = jumlah_kata / script.WPM * 60
    biaya_suara = round(detik / 12.0 * 1.65, 1)
    return {
        "gambar": biaya_gambar,
        "suara": biaya_suara,
        "total": round(biaya_gambar + biaya_suara, 1),
    }


def jalankan_storyboard(
    klien: KieClient,
    proyek: Proyek,
    naskah: script.Naskah,
    *,
    model_gambar: str = config.DEFAULT_IMAGE_MODEL,
    urutan_tts: list[str] | None = None,
    voice_gemini: str = config.DEFAULT_GEMINI_VOICE,
    voice_edge: str = config.DEFAULT_EDGE_VOICE,
    kecepatan_suara: float = 1.0,
    lapor: Lapor = _nihil,
) -> HasilStoryboard:
    kredit_awal = proyek.total_kredit

    # --- Foto produk dijadikan acuan gambar bila ada -----------------------
    acuan_url = proyek.get("produk_url_kie") or None
    berkas_produk = proyek.get("produk_foto")
    if not acuan_url and berkas_produk and Path(berkas_produk).exists():
        lapor("Mengunggah foto produk ke Kie sebagai acuan gambar...")
        try:
            acuan_url = visuals.unggah_gambar(klien.api_key, Path(berkas_produk))
            proyek.set("produk_url_kie", acuan_url)
            lapor("Foto produk siap dipakai sebagai acuan.")
        except KieError as exc:
            lapor(f"⚠️ Foto produk gagal diunggah ({exc}). Gambar dibuat tanpa acuan.")
            acuan_url = None

    # Adegan terakhir adalah tempat produk muncul.
    adegan_produk = {naskah.adegan[-1].nomor} if naskah.adegan and acuan_url else set()

    # --- Suara per adegan --------------------------------------------------
    lapor("Membuat suara narator untuk tiap adegan...")
    naskah_suara = script.naskah_untuk_suara(naskah)
    suara: dict[int, tts.HasilSuara] = {}
    kredit_suara = 0.0

    for nomor, teks in naskah_suara:
        if not teks.strip():
            continue
        keluar = proyek.dir_suara / f"adegan_{nomor:02d}.wav"
        hasil = tts.buat_suara(
            klien, teks, keluar,
            urutan=urutan_tts,
            voice_gemini=voice_gemini,
            voice_edge=voice_edge,
            kecepatan=kecepatan_suara,
            wpm_target=script.WPM,
            catat=lapor,
        )
        suara[nomor] = hasil
        kredit_suara += hasil.kredit
        tanda = "🔊" if hasil.mengalir else "⚠️"
        lapor(
            f"{tanda} Adegan {nomor}: {hasil.durasi:.1f} detik, "
            f"{hasil.wpm:.0f} kata/menit, {hasil.jeda_per_kata:.2f} jeda/kata "
            f"({hasil.penyedia}, {hasil.kredit:.1f} kredit)."
        )

    if not suara:
        raise RuntimeError("Tidak ada satu pun suara yang berhasil dibuat.")
    proyek.tambah_kredit(kredit_suara, "Suara narator")

    patah = [n for n, h in suara.items() if not h.mengalir]
    if patah:
        lapor(
            f"⚠️ {len(patah)} adegan terdengar patah-patah (adegan "
            f"{', '.join(map(str, sorted(patah)))}). Dengarkan dulu sebelum menyetujui; "
            "kalau mengganggu, ganti suara di Pengaturan lalu buat ulang storyboard."
        )

    # Durasi asli dari suara menggantikan perkiraan dari jumlah kata.
    for a in naskah.adegan:
        if a.nomor in suara:
            a.durasi = round(suara[a.nomor].durasi + JEDA_ADEGAN, 2)

    # --- Gambar storyboard -------------------------------------------------
    lapor(f"Membuat {len(naskah.adegan)} gambar storyboard...")
    gambar = visuals.buat_semua_gambar(
        klien, naskah.adegan, proyek.dir_gambar,
        model_kode=model_gambar,
        acuan_url=acuan_url,
        adegan_produk=adegan_produk,
        deskripsi_produk=proyek.get("produk_deskripsi", ""),
        catat=lapor,
    )
    kredit_gambar = sum(g.kredit for g in gambar)
    proyek.tambah_kredit(kredit_gambar, "Gambar storyboard")

    total_durasi = sum(a.durasi for a in naskah.adegan)
    proyek.set("naskah", naskah.dict())
    proyek.set(
        "storyboard",
        {
            "gambar": {str(g.nomor): str(g.berkas) for g in gambar},
            "suara": {
                str(n): {"berkas": str(h.berkas), "durasi": h.durasi,
                         "penyedia": h.penyedia}
                for n, h in suara.items()
            },
            "durasi_total": total_durasi,
        },
    )
    proyek.naik_tahap("storyboard")

    dipakai = proyek.total_kredit - kredit_awal
    lapor(f"✅ Storyboard selesai. Total {dipakai:.1f} kredit, durasi {total_durasi:.1f} detik.")
    proyek.catat(f"Storyboard selesai ({dipakai:.1f} kredit).")

    return HasilStoryboard(gambar, suara, dipakai, total_durasi)


# ---------------------------------------------------------------------------
# Tahap 4 — Render (hanya setelah disetujui)
# ---------------------------------------------------------------------------
def _sambung_narasi(
    berkas_per_adegan: list[Path], keluar: Path, jeda: float = JEDA_ADEGAN
) -> Path:
    """Sambung suara tiap adegan dengan jeda pendek di antaranya."""
    keluar.parent.mkdir(parents=True, exist_ok=True)
    masukan: list[str] = []
    bagian: list[str] = []
    label: list[str] = []
    for i, b in enumerate(berkas_per_adegan):
        masukan += ["-i", str(b)]
        bagian.append(
            f"[{i}:a]aresample=48000,aformat=channel_layouts=mono,"
            f"apad=pad_dur={jeda}[a{i}]"
        )
        label.append(f"[a{i}]")
    bagian.append(f"{''.join(label)}concat=n={len(label)}:v=0:a=1[keluar]")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y"] + masukan
        + ["-filter_complex", ";".join(bagian), "-map", "[keluar]",
           "-ar", "48000", "-ac", "1", str(keluar)],
        check=True, capture_output=True,
    )
    return keluar


def jalankan_render(
    proyek: Proyek,
    naskah: script.Naskah,
    *,
    klien: KieClient | None = None,
    pakai_musik: bool = True,
    pakai_sfx: bool = True,
    butiran: bool = True,
    vignette: bool = True,
    tampilkan_hook: bool = True,
    buat_caption: bool = True,
    model_llm: str | None = None,
    kirim_drive: bool = True,
    drive_metode: str = "otomatis",
    drive_folder: str = "",
    drive_remote: str = "",
    peta_folder_drive: dict[str, str] | None = None,
    lapor: Lapor = _nihil,
) -> dict:
    """Rakit video akhir. Tahap ini tidak memakai kredit sama sekali."""
    ok, pesan = assemble.cek_ffmpeg()
    if not ok:
        raise assemble.RenderGagal(pesan)

    sb = proyek.get("storyboard") or {}
    peta_gambar = {int(k): Path(v) for k, v in (sb.get("gambar") or {}).items()}
    peta_suara = {int(k): v for k, v in (sb.get("suara") or {}).items()}
    if not peta_gambar or not peta_suara:
        raise RuntimeError("Storyboard belum lengkap. Jalankan tahap storyboard dulu.")

    kerja = proyek.folder / "kerja"
    kerja.mkdir(exist_ok=True)
    adegan_dipakai = [a for a in naskah.adegan if a.nomor in peta_gambar and a.nomor in peta_suara]
    if not adegan_dipakai:
        raise RuntimeError("Tidak ada adegan yang punya gambar sekaligus suara.")

    # --- Susun jadwal dari durasi suara yang sebenarnya --------------------
    jadwal: list[tuple[script.Adegan, float, float]] = []
    waktu = 0.0
    for a in adegan_dipakai:
        d = float(peta_suara[a.nomor]["durasi"]) + JEDA_ADEGAN
        a.durasi = round(d, 2)
        jadwal.append((a, waktu, d))
        waktu += d
    total = waktu
    lapor(f"Total durasi video: {total:.1f} detik.")

    # --- Segmen video per adegan -------------------------------------------
    segmen: list[Path] = []
    for a, _, d in jadwal:
        keluar = kerja / f"seg_{a.nomor:02d}.mp4"
        assemble.segmen_dari_gambar(peta_gambar[a.nomor], d, keluar, gerak=a.gerak)
        segmen.append(keluar)
        lapor(f"🎬 Adegan {a.nomor} dirender ({d:.1f} detik, gerak {a.gerak}).")

    lapor("Menyambung semua adegan...")
    gabung = assemble.sambung_segmen(segmen, kerja / "gabung.mp4")

    # --- Audio --------------------------------------------------------------
    lapor("Menyusun jalur suara...")
    narasi = _sambung_narasi(
        [Path(peta_suara[a.nomor]["berkas"]) for a, _, _ in jadwal],
        kerja / "narasi.wav",
    )

    isyarat: list[tuple[float, str, float]] = []
    if pakai_sfx:
        for a, mulai, _ in jadwal:
            nama = (a.efek_suara or "").strip().lower()
            if nama and nama != "hening":
                isyarat.append((max(0.0, mulai - 0.06), nama, 1.0))
        lapor(f"Menempelkan {len(isyarat)} efek suara.")

    musik = None
    if pakai_musik:
        musik = audio_mod.musik_ambient(total + 1.0, kerja / "musik.wav")
        lapor("Musik latar dibuat dan ditekan otomatis saat narator bicara.")

    campur = audio_mod.gabung_audio(
        narasi, kerja / "audio.wav", isyarat_sfx=isyarat, musik=musik
    )

    # --- Takarir -------------------------------------------------------------
    lapor("Menyusun takarir dan teks di layar...")
    # Pita pembuka memakai versi pendek. Kalau tidak ada, pakai kalimat hook,
    # dan kalau itu pun kosong, pakai narasi adegan pertama.
    teks_pita = (
        naskah.kartu_hook
        or naskah.hook
        or (adegan_dipakai[0].narasi if adegan_dipakai else "")
    )
    ass = subtitles.bangun_ass(
        jadwal, kerja / "takarir.ass",
        hook=teks_pita,
        tampilkan_hook=tampilkan_hook,
    )
    srt = subtitles.tulis_srt(jadwal, proyek.dir_hasil / "takarir.srt")

    # --- Render akhir ---------------------------------------------------------
    lapor("Merender video akhir. Ini bagian paling lama, mohon tunggu...")
    video = assemble.render_akhir(
        gabung, campur, proyek.berkas_video,
        berkas_ass=ass, butiran=butiran, vignette=vignette,
    )

    lapor("Memeriksa hasil akhir...")
    laporan = assemble.periksa_hasil(video, durasi_harapan=total)
    if laporan.masalah:
        for m in laporan.masalah:
            lapor(f"⚠️ {m}")
    else:
        lapor("✅ Semua pemeriksaan teknis lolos.")

    # --- Caption dan berkas pendamping ----------------------------------------
    paket = None
    if buat_caption and klien:
        lapor("Menulis caption dan tagar...")
        try:
            paket = social.buat_caption(
                klien,
                judul=naskah.judul,
                produk=naskah.produk,
                kode_kategori=naskah.kategori,
                narasi=naskah.narasi_penuh,
                hook=naskah.hook,
                model=model_llm,
            )
            social.tulis_berkas_pendamping(
                proyek.dir_hasil, paket,
                judul=naskah.judul, produk=naskah.produk,
                narasi=naskah.narasi_penuh,
            )
            proyek.set("caption", paket.dict())
            lapor("✅ Caption, tagar, dan daftar periksa tersimpan.")
        except (KieError, ValueError) as exc:
            lapor(f"⚠️ Caption gagal dibuat: {exc}. Video tetap selesai.")

    # --- Kirim ke Google Drive -------------------------------------------------
    hasil_drive = None
    if kirim_drive:
        berkas_kirim = [video, srt] + [
            f for f in proyek.dir_hasil.iterdir()
            if f.is_file() and f.suffix in (".txt", ".json")
        ]
        hasil_drive = drive.kirim(
            berkas_kirim, naskah.kategori,
            metode=drive_metode,
            folder_drive=drive_folder,
            remote_rclone=drive_remote,
            nama_proyek=proyek.nama,
            peta_folder=peta_folder_drive,
        )
        if hasil_drive.berhasil:
            lapor(f"☁️ Terkirim ke Drive: {hasil_drive.tujuan}")
        else:
            lapor(f"☁️ Belum terkirim ke Drive. {hasil_drive.pesan}")

    proyek.set(
        "hasil",
        {
            "video": str(video),
            "srt": str(srt),
            "durasi": laporan.durasi,
            "ukuran_mb": laporan.ukuran_mb,
            "lufs": laporan.lufs,
            "masalah": laporan.masalah,
            "drive": (
                {
                    "berhasil": hasil_drive.berhasil,
                    "tujuan": hasil_drive.tujuan,
                    "pesan": hasil_drive.pesan,
                }
                if hasil_drive
                else None
            ),
        },
    )
    proyek.naik_tahap("selesai")
    proyek.catat(f"Video selesai: {laporan.durasi:.1f} detik, {laporan.ukuran_mb} MB.")

    return {"video": video, "srt": srt, "laporan": laporan, "caption": paket}
