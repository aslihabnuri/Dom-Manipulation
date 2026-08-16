"""Studio Video Cerita — antarmuka aplikasi.

Jalankan dengan:  streamlit run app.py
Atau klik dua kali berkas jalankan.bat (Windows) / jalankan.sh (Mac & Linux).
"""
from __future__ import annotations

from pathlib import Path

import streamlit as st

from core import assemble, config, pipeline, research, script as script_mod, tts, visuals
from core.categories import KATEGORI, arketipe_untuk, daftar_kategori
from core.idn import muat_kamus, normalisasi, simpan_kamus
from core.kie import KieClient, KieError
from core.store import LABEL_TAHAP, TAHAP, Proyek

st.set_page_config(
    page_title="Studio Video Cerita",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
<style>
  .blok-tahap {padding:14px 18px;border-radius:12px;border:1px solid rgba(128,128,128,.25);margin-bottom:14px;}
  .biaya {font-size:.9rem;opacity:.85;}
  div[data-testid="stMetricValue"] {font-size:1.4rem;}
  .kartu {border:1px solid rgba(128,128,128,.25);border-radius:12px;padding:14px;height:100%;}
</style>
""",
    unsafe_allow_html=True,
)


# ---------------------------------------------------------------------------
# Keadaan sesi
# ---------------------------------------------------------------------------
def _init() -> None:
    st.session_state.setdefault("pengaturan", config.AppSettings.load())
    st.session_state.setdefault("proyek_folder", None)
    st.session_state.setdefault("log", [])


_init()
PENGATURAN: config.AppSettings = st.session_state.pengaturan


def klien() -> KieClient | None:
    if not config.kie_key():
        return None
    return KieClient()


def proyek_aktif() -> Proyek | None:
    f = st.session_state.get("proyek_folder")
    if not f:
        return None
    p = Path(f)
    if not (p / "proyek.json").exists():
        st.session_state.proyek_folder = None
        return None
    return Proyek.muat(p)


def buat_pelapor(wadah) -> callable:
    """Kembalikan fungsi yang menampilkan pesan kemajuan secara berjalan."""
    baris: list[str] = []

    def lapor(pesan: str) -> None:
        baris.append(pesan)
        wadah.code("\n".join(baris[-16:]), language=None)

    return lapor


# ---------------------------------------------------------------------------
# Bilah samping
# ---------------------------------------------------------------------------
def bilah_samping() -> None:
    with st.sidebar:
        st.title("🎬 Studio Video")
        st.caption("Video cerita pendek untuk TikTok, Reels, dan Shorts")

        # --- Kunci API ------------------------------------------------------
        with st.expander("🔑 Kunci API", expanded=not config.kie_key()):
            kie_sekarang = config.kie_key()
            nilai = st.text_input(
                "API key Kie",
                value=kie_sekarang,
                type="password",
                help="Ambil di https://kie.ai/api-key",
            )
            eleven = st.text_input(
                "API key ElevenLabs (opsional)",
                value=config.elevenlabs_key(),
                type="password",
                help="Hanya bila ingin memakai suara ElevenLabs langsung.",
            )
            if st.button("Simpan kunci", use_container_width=True):
                config.save_env(nilai, eleven)
                st.success("Kunci tersimpan di berkas .env")
                st.rerun()

            if config.kie_key():
                if st.button("Uji koneksi", use_container_width=True):
                    ok, pesan = KieClient().check_key()
                    (st.success if ok else st.error)(pesan)

        if not config.kie_key():
            st.warning("Isi API key Kie dulu untuk mulai.")
            return

        # --- Saldo ----------------------------------------------------------
        try:
            saldo = KieClient().credits()
            st.metric("Sisa kredit Kie", f"{saldo:,.1f}")
        except KieError as exc:
            st.error(f"Saldo tidak terbaca: {exc}")

        st.divider()

        # --- Proyek ---------------------------------------------------------
        st.subheader("Proyek")
        semua = Proyek.daftar()
        pilihan = ["➕ Proyek baru"] + [
            f"{p.nama}  ·  {LABEL_TAHAP.get(p.tahap, p.tahap)}" for p in semua
        ]
        sekarang = proyek_aktif()
        indeks = 0
        if sekarang:
            for i, p in enumerate(semua):
                if p.folder == sekarang.folder:
                    indeks = i + 1
                    break

        dipilih = st.selectbox("Pilih proyek", pilihan, index=indeks)
        if dipilih == "➕ Proyek baru":
            nama_baru = st.text_input("Nama proyek baru", placeholder="Matcha Agustus")
            if st.button("Buat proyek", type="primary", use_container_width=True):
                if nama_baru.strip():
                    p = Proyek.baru(nama_baru.strip())
                    st.session_state.proyek_folder = str(p.folder)
                    st.rerun()
                else:
                    st.error("Nama proyek belum diisi.")
        else:
            p = semua[pilihan.index(dipilih) - 1]
            if str(p.folder) != st.session_state.get("proyek_folder"):
                st.session_state.proyek_folder = str(p.folder)
                st.rerun()
            st.caption(f"Kredit terpakai di proyek ini: {p.total_kredit:.1f}")
            if st.button("🗑️ Hapus proyek ini", use_container_width=True):
                p.hapus()
                st.session_state.proyek_folder = None
                st.rerun()

        st.divider()
        pengaturan_lanjutan()


def pengaturan_lanjutan() -> None:
    with st.expander("⚙️ Pengaturan"):
        s = PENGATURAN
        s.llm_tier = st.selectbox(
            "Kecerdasan penulis naskah",
            list(config.LLM_MODELS),
            index=list(config.LLM_MODELS).index(s.llm_tier),
            format_func=lambda k: {
                "cepat": "Cepat dan murah",
                "cerdas": "Cerdas (disarankan)",
                "terbaik": "Paling bagus",
            }[k],
        )
        s.image_model = st.selectbox(
            "Model gambar",
            list(config.IMAGE_MODELS),
            index=list(config.IMAGE_MODELS).index(s.image_model),
            format_func=lambda k: config.IMAGE_MODELS[k]["label"],
        )

        tersedia = tts.penyedia_tersedia(klien())
        s.tts_provider = st.selectbox(
            "Suara narator",
            list(config.TTS_PROVIDERS),
            index=list(config.TTS_PROVIDERS).index(s.tts_provider),
            format_func=lambda k: config.TTS_PROVIDERS[k]["label"]
            + ("" if tersedia.get(k) else "  (belum siap)"),
        )
        if s.tts_provider.startswith("gemini"):
            s.gemini_voice = st.selectbox(
                "Pilih suara",
                list(config.GEMINI_VOICES),
                index=list(config.GEMINI_VOICES).index(s.gemini_voice),
                format_func=lambda v: f"{v} — {config.GEMINI_VOICES[v]}",
            )
        elif s.tts_provider == "edge":
            s.edge_voice = st.selectbox(
                "Pilih suara",
                list(config.EDGE_VOICES),
                index=list(config.EDGE_VOICES).index(s.edge_voice),
                format_func=lambda v: f"{v} — {config.EDGE_VOICES[v]}",
            )

        st.caption(
            "Kalau penyedia utama gagal, aplikasi otomatis pindah ke penyedia "
            "berikutnya tanpa menghentikan produksi."
        )
        s.save()

        st.markdown("**Kamus pengucapan**")
        st.caption(
            "Tulis satu baris per kata dengan format  kata=cara baca. "
            "Contoh:  matcha=maca"
        )
        kamus = muat_kamus()
        teks = st.text_area(
            "Kamus",
            value="\n".join(f"{k}={v}" for k, v in sorted(kamus.items())),
            height=110,
            label_visibility="collapsed",
        )
        if st.button("Simpan kamus", use_container_width=True):
            baru = {}
            for baris in teks.splitlines():
                if "=" in baris:
                    k, _, v = baris.partition("=")
                    if k.strip() and v.strip():
                        baru[k.strip().lower()] = v.strip()
            simpan_kamus(baru)
            st.success(f"{len(baru)} kata tersimpan.")

        ok, pesan = assemble.cek_ffmpeg()
        st.caption(("✅ " if ok else "❌ ") + pesan.splitlines()[0])


# ---------------------------------------------------------------------------
# Penunjuk tahap
# ---------------------------------------------------------------------------
def penunjuk_tahap(p: Proyek) -> None:
    kolom = st.columns(len(TAHAP))
    sekarang = TAHAP.index(p.tahap)
    for i, (kol, t) in enumerate(zip(kolom, TAHAP)):
        with kol:
            if i < sekarang:
                kol.markdown(f"✅ **{LABEL_TAHAP[t]}**")
            elif i == sekarang:
                kol.markdown(f"🔵 **{LABEL_TAHAP[t]}**")
            else:
                kol.markdown(f"<span style='opacity:.4'>⚪ {LABEL_TAHAP[t]}</span>",
                             unsafe_allow_html=True)


# ---------------------------------------------------------------------------
# Tahap 1 — Produk
# ---------------------------------------------------------------------------
def tahap_produk(p: Proyek) -> None:
    st.header("1 · Produk")
    st.caption("Unggah foto produk dan isi keterangan singkat. Belum ada biaya di tahap ini.")

    kiri, kanan = st.columns([1, 1.4])

    with kiri:
        foto = st.file_uploader(
            "Foto produk",
            type=["jpg", "jpeg", "png", "webp"],
            help="Foto ini dipakai sebagai acuan agar bentuk produk di video sama persis.",
        )
        tersimpan = p.get("produk_foto")
        if foto:
            tujuan = p.folder / f"produk{Path(foto.name).suffix.lower()}"
            tujuan.write_bytes(foto.getbuffer())
            p.set("produk_foto", str(tujuan))
            p.set("produk_url_kie", None)  # acuan lama tidak berlaku lagi
            tersimpan = str(tujuan)
        if tersimpan and Path(tersimpan).exists():
            st.image(tersimpan, caption="Foto produk tersimpan", use_container_width=True)

    with kanan:
        nama = st.text_input(
            "Nama produk", value=p.get("produk_nama", ""),
            placeholder="Tas jinjing kerja",
            help="Jenis barangnya, bukan mereknya.",
        )
        merek = st.text_input(
            "Nama merek", value=p.get("produk_merek", ""),
            placeholder="Sophie Martin",
            help="Dipakai untuk memastikan merek hanya disebut sekali, di akhir video. "
                 "Boleh dikosongkan bila tidak ingin menyebut merek sama sekali.",
        )
        kat_kode = [k for k, _ in daftar_kategori()]
        kat_label = [n for _, n in daftar_kategori()]
        idx = kat_kode.index(p.get("kategori", "fnb")) if p.get("kategori") in kat_kode else 0
        kategori = st.radio("Kategori", kat_kode, index=idx,
                            format_func=lambda k: kat_label[kat_kode.index(k)],
                            horizontal=True)
        deskripsi = st.text_area(
            "Keterangan singkat produk",
            value=p.get("produk_deskripsi", ""),
            placeholder="Tas jinjing kulit sintetis, warna cokelat tua, model kerja, "
                        "punya sekat laptop.",
            height=100,
            help="Semakin jelas keterangannya, semakin nyambung cerita yang dibuat.",
        )

        contoh = KATEGORI[kategori].contoh_produk
        st.caption("Contoh produk untuk kategori ini: " + ", ".join(contoh[:5]))

        if st.button("Simpan dan lanjut ke riset", type="primary", use_container_width=True):
            if not nama.strip():
                st.error("Nama produk wajib diisi.")
            else:
                p.set("produk_nama", nama.strip())
                p.set("produk_merek", merek.strip())
                p.set("kategori", kategori)
                p.set("produk_deskripsi", deskripsi.strip())
                p.naik_tahap("riset")
                st.rerun()


# ---------------------------------------------------------------------------
# Tahap 2 — Riset topik
# ---------------------------------------------------------------------------
def tahap_riset(p: Proyek) -> None:
    st.header("2 · Riset Topik")
    st.caption(
        "Aplikasi menarik berita dan tren Indonesia terbaru, lalu menyusun ide cerita "
        "yang nyambung dengan produkmu. Gratis."
    )

    kiri, kanan = st.columns([1, 2])
    with kiri:
        jumlah = st.slider("Berapa ide topik", 3, 10, 6)
        pakai_tren = st.checkbox("Pakai data berita dan tren terbaru", value=True)
        catatan = st.text_area(
            "Arahan tambahan (opsional)",
            placeholder="Fokus ke sejarah, hindari topik kesehatan.",
            height=80,
        )
        jalan = st.button("🔍 Cari topik", type="primary", use_container_width=True)

    wadah = kanan.empty()
    if jalan:
        k = klien()
        if not k:
            st.error("API key Kie belum diisi.")
            return
        lapor = buat_pelapor(wadah)
        try:
            with st.spinner("Sedang meriset..."):
                pipeline.jalankan_riset(
                    k, p, jumlah=jumlah, catatan=catatan, pakai_tren=pakai_tren,
                    model=config.LLM_MODELS[PENGATURAN.llm_tier], lapor=lapor,
                )
            st.rerun()
        except (KieError, ValueError) as exc:
            st.error(f"Riset gagal: {exc}")

    topik = p.get("topik") or []
    if not topik:
        return

    st.divider()
    st.subheader("Pilih satu topik")
    terpilih = p.get("topik_terpilih") or {}

    for i, t in enumerate(topik):
        aktif = t.get("judul") == terpilih.get("judul")
        with st.container(border=True):
            atas, tombol = st.columns([5, 1])
            with atas:
                st.markdown(f"**{t.get('judul','(tanpa judul)')}**")
                st.markdown(f"💬 *“{t.get('hook','')}”*")
                st.caption(
                    f"Segar {t.get('skor_segar',0)}/10 · "
                    f"Nyambung {t.get('skor_relevan',0)}/10 · "
                    f"Tahan tonton {t.get('skor_tahan_tonton',0)}/10 · "
                    f"sumber: {t.get('sumber','')}"
                )
                with st.expander("Lihat rincian"):
                    st.markdown(f"**Kenapa dibahas sekarang:** {t.get('kenapa_sekarang','')}")
                    st.markdown(f"**Cara produk masuk:** {t.get('sudut_soft_sell','')}")
                    st.markdown("**Urutan cerita:**")
                    for poin in t.get("poin_cerita", []):
                        st.markdown(f"- {poin}")
            with tombol:
                if aktif:
                    st.success("Dipilih")
                if st.button("Pilih", key=f"pilih_{i}", use_container_width=True):
                    p.set("topik_terpilih", t)
                    p.naik_tahap("naskah")
                    st.rerun()


# ---------------------------------------------------------------------------
# Tahap 3a — Naskah
# ---------------------------------------------------------------------------
def tahap_naskah(p: Proyek) -> None:
    st.header("3 · Naskah")
    topik = p.get("topik_terpilih") or {}
    if not topik:
        st.info("Pilih topik dulu di tahap Riset.")
        return
    st.caption(f"Topik: **{topik.get('judul','')}** — masih gratis, belum ada biaya.")

    kiri, kanan = st.columns([1, 2])
    with kiri:
        durasi = st.slider("Target durasi (detik)", 30, 90, 65, step=5)
        adegan = st.slider("Jumlah adegan", 6, 14, 10)
        catatan = st.text_area("Arahan tambahan (opsional)", height=80)
        buat = st.button("✍️ Tulis naskah", type="primary", use_container_width=True)
        st.caption(
            "Naskah ditulis dengan aturan ketat: tanpa angka digit, tanpa kata "
            "Inggris, kalimat pendek, dan produk hanya muncul di adegan terakhir."
        )

    wadah = kanan.empty()
    if buat:
        k = klien()
        if not k:
            st.error("API key Kie belum diisi.")
            return
        lapor = buat_pelapor(wadah)
        try:
            with st.spinner("Menulis naskah..."):
                pipeline.jalankan_naskah(
                    k, p, topik, durasi_target=durasi, jumlah_adegan=adegan,
                    catatan=catatan, model=config.LLM_MODELS[PENGATURAN.llm_tier],
                    lapor=lapor,
                )
            st.rerun()
        except (KieError, ValueError) as exc:
            st.error(f"Penulisan naskah gagal: {exc}")

    data = p.get("naskah")
    if not data:
        return

    naskah = script_mod.Naskah.dari_dict(data)
    st.divider()

    a, b, c = st.columns(3)
    a.metric("Adegan", len(naskah.adegan))
    b.metric("Jumlah kata", naskah.jumlah_kata)
    c.metric("Perkiraan durasi", f"{naskah.perkiraan_durasi:.0f} dtk")

    st.subheader("Pemeriksaan mutu")
    for catatan_qa in naskah.catatan_qa:
        if catatan_qa.startswith("🔴"):
            st.error(catatan_qa)
        elif catatan_qa.startswith("🟡"):
            st.warning(catatan_qa)
        else:
            st.success(catatan_qa)

    st.subheader("Naskah per adegan")
    st.caption("Bisa kamu ubah langsung. Tekan Simpan setelah mengedit.")
    berubah = False
    for a_ in naskah.adegan:
        with st.expander(
            f"Adegan {a_.nomor} · {a_.sorotan or '(tanpa label)'} · {a_.durasi:.1f} dtk",
            expanded=a_.nomor <= 2,
        ):
            baru = st.text_area("Narasi", value=a_.narasi, key=f"nar_{a_.nomor}", height=80)
            if baru != a_.narasi:
                a_.narasi = baru
                berubah = True
            k1, k2, k3 = st.columns(3)
            s1 = k1.text_input("Label sorotan", value=a_.sorotan, key=f"sor_{a_.nomor}")
            s2 = k2.text_input("Keterangan label", value=a_.sorotan_sub, key=f"sub_{a_.nomor}")
            s3 = k3.selectbox(
                "Gerak",
                ["zoom-in", "zoom-out", "geser-kiri", "geser-kanan", "naik", "turun", "pop", "getar"],
                index=max(0, ["zoom-in", "zoom-out", "geser-kiri", "geser-kanan",
                              "naik", "turun", "pop", "getar"].index(a_.gerak)
                          if a_.gerak in ["zoom-in", "zoom-out", "geser-kiri", "geser-kanan",
                                          "naik", "turun", "pop", "getar"] else 0),
                key=f"ger_{a_.nomor}",
            )
            if (s1, s2, s3) != (a_.sorotan, a_.sorotan_sub, a_.gerak):
                a_.sorotan, a_.sorotan_sub, a_.gerak = s1, s2, s3
                berubah = True

            hasil_norm = normalisasi(a_.narasi)
            st.caption(f"Yang akan dibaca narator: *{hasil_norm.hasil}*")
            for t in hasil_norm.temuan:
                st.caption(f"{t.ikon} {t.pesan}")

    if berubah or st.button("💾 Simpan perubahan naskah", use_container_width=True):
        script_mod.hitung_durasi(naskah)
        naskah.catatan_qa = script_mod.periksa_naskah(
            naskah, durasi, p.get("produk_merek", "")
        )
        p.set("naskah", naskah.dict())
        st.success("Naskah tersimpan.")
        st.rerun()

    st.divider()
    if st.button("Lanjut ke storyboard →", type="primary", use_container_width=True):
        p.naik_tahap("storyboard")
        st.rerun()


# ---------------------------------------------------------------------------
# Tahap 3b — Storyboard
# ---------------------------------------------------------------------------
def tahap_storyboard(p: Proyek) -> None:
    st.header("4 · Storyboard")
    data = p.get("naskah")
    if not data:
        st.info("Buat naskah dulu.")
        return
    naskah = script_mod.Naskah.dari_dict(data)

    biaya = pipeline.perkiraan_biaya_storyboard(
        len(naskah.adegan), PENGATURAN.image_model, naskah.jumlah_kata
    )
    st.caption(
        "Di tahap ini gambar dan suara benar-benar dibuat, jadi ada biaya. "
        "Video akhirnya sendiri tidak memakai kredit sama sekali."
    )
    a, b, c = st.columns(3)
    a.metric("Perkiraan biaya gambar", f"{biaya['gambar']:.0f} kredit")
    b.metric("Perkiraan biaya suara", f"{biaya['suara']:.1f} kredit")
    c.metric("Total perkiraan", f"{biaya['total']:.1f} kredit")

    sudah = p.get("storyboard")
    label = "🎨 Buat ulang storyboard" if sudah else "🎨 Buat storyboard"
    kecepatan = st.slider(
        "Kecepatan bicara narator", 0.85, 1.25, 1.05, step=0.05,
        help="Video acuan berjalan cukup cepat. 1,05 sampai 1,15 terasa pas.",
    )

    if st.button(label, type="primary", use_container_width=True):
        k = klien()
        if not k:
            st.error("API key Kie belum diisi.")
            return
        wadah = st.empty()
        lapor = buat_pelapor(wadah)
        urutan = [PENGATURAN.tts_provider] + [
            x for x in config.DEFAULT_TTS_CHAIN if x != PENGATURAN.tts_provider
        ]
        try:
            with st.spinner("Membuat gambar dan suara. Bisa beberapa menit..."):
                pipeline.jalankan_storyboard(
                    k, p, naskah,
                    model_gambar=PENGATURAN.image_model,
                    urutan_tts=urutan,
                    voice_gemini=PENGATURAN.gemini_voice,
                    voice_edge=PENGATURAN.edge_voice,
                    kecepatan_suara=kecepatan,
                    lapor=lapor,
                )
            st.rerun()
        except (KieError, RuntimeError, ValueError) as exc:
            st.error(f"Storyboard gagal: {exc}")

    sudah = p.get("storyboard")
    if not sudah:
        return

    st.divider()
    st.subheader("Tinjau storyboard")
    st.caption(
        "Periksa setiap adegan: apakah gambarnya benar, apakah narator mengucapkan "
        "semua kata dengan tepat. Setelah ini video dirakit tanpa biaya tambahan."
    )
    st.metric("Total durasi video nanti", f"{sudah.get('durasi_total', 0):.1f} detik")

    gambar = {int(k): v for k, v in (sudah.get("gambar") or {}).items()}
    suara = {int(k): v for k, v in (sudah.get("suara") or {}).items()}

    for baris_awal in range(0, len(naskah.adegan), 3):
        kolom = st.columns(3)
        for kol, a_ in zip(kolom, naskah.adegan[baris_awal : baris_awal + 3]):
            with kol:
                with st.container(border=True):
                    st.markdown(f"**Adegan {a_.nomor}** · {a_.gerak}")
                    g = gambar.get(a_.nomor)
                    if g and Path(g).exists():
                        st.image(g, use_container_width=True)
                    else:
                        st.warning("Gambar belum ada.")
                    if a_.sorotan:
                        st.markdown(f"🏷️ **{a_.sorotan}**"
                                    + (f" — {a_.sorotan_sub}" if a_.sorotan_sub else ""))
                    s = suara.get(a_.nomor)
                    if s and Path(s["berkas"]).exists():
                        st.audio(s["berkas"])
                        st.caption(f"{s['durasi']:.1f} dtk · {s['penyedia']}")
                    st.caption(a_.narasi)
                    if a_.efek_suara and a_.efek_suara != "hening":
                        st.caption(f"🔊 efek: {a_.efek_suara}")

    st.divider()
    st.subheader("Persetujuan")
    st.warning(
        "Dengarkan semua suara di atas sampai selesai. Kalau ada satu kata yang "
        "salah ucap, perbaiki naskahnya dulu lalu buat ulang storyboard. "
        "Setelah disetujui, video akan dirakit apa adanya."
    )
    setuju = st.checkbox("Saya sudah memeriksa semua gambar dan mendengar semua suara.")
    if st.button("✅ Setujui dan buat videonya", type="primary",
                 disabled=not setuju, use_container_width=True):
        p.naik_tahap("disetujui")
        st.rerun()


# ---------------------------------------------------------------------------
# Tahap 4 — Render
# ---------------------------------------------------------------------------
def tahap_render(p: Proyek) -> None:
    st.header("5 · Video Jadi")
    data = p.get("naskah")
    if not data:
        st.info("Naskah belum ada.")
        return
    naskah = script_mod.Naskah.dari_dict(data)

    hasil = p.get("hasil")
    if not hasil:
        st.caption("Perakitan video tidak memakai kredit sama sekali.")
        k1, k2 = st.columns(2)
        with k1:
            musik = st.checkbox("Musik latar lembut", value=True)
            sfx = st.checkbox("Efek suara", value=True)
        with k2:
            hook = st.checkbox("Tampilkan pita pembuka", value=True)
            halus = st.checkbox(
                "Sentuhan akhir (butiran halus dan vignette)", value=True,
                help="Memecah kesan render digital yang terlalu bersih.",
            )

        if st.button("🎬 Rakit video sekarang", type="primary", use_container_width=True):
            wadah = st.empty()
            lapor = buat_pelapor(wadah)
            try:
                with st.spinner("Merender. Bagian ini paling lama..."):
                    pipeline.jalankan_render(
                        p, naskah, klien=klien(),
                        pakai_musik=musik, pakai_sfx=sfx,
                        butiran=halus, vignette=halus,
                        tampilkan_hook=hook,
                        model_llm=config.LLM_MODELS[PENGATURAN.llm_tier],
                        lapor=lapor,
                    )
                st.balloons()
                st.rerun()
            except (assemble.RenderGagal, RuntimeError, KieError) as exc:
                st.error(f"Render gagal: {exc}")
        return

    # --- Hasil sudah ada ----------------------------------------------------
    video = Path(hasil["video"])
    kiri, kanan = st.columns([1, 1.3])

    with kiri:
        if video.exists():
            st.video(str(video))
            st.download_button(
                "⬇️ Unduh video",
                data=video.read_bytes(),
                file_name=f"{p.nama}.mp4",
                mime="video/mp4",
                use_container_width=True,
            )
        a, b, c = st.columns(3)
        a.metric("Durasi", f"{hasil.get('durasi',0):.1f} dtk")
        b.metric("Ukuran", f"{hasil.get('ukuran_mb',0)} MB")
        c.metric("Kenyaringan", f"{hasil.get('lufs','-')} LUFS")

        masalah = hasil.get("masalah") or []
        if masalah:
            for m in masalah:
                st.warning(m)
        else:
            st.success("Semua pemeriksaan teknis lolos.")

    with kanan:
        caption = p.get("caption") or {}
        if caption:
            st.subheader("Caption siap salin")
            tab1, tab2, tab3 = st.tabs(["TikTok", "Instagram", "YouTube"])
            tagar = " ".join(f"#{t}" for t in caption.get("tagar", []))
            with tab1:
                st.code(f"{caption.get('tiktok','')}\n\n{tagar}", language=None)
            with tab2:
                st.code(f"{caption.get('instagram','')}\n\n{tagar}", language=None)
            with tab3:
                st.code(
                    f"{caption.get('youtube_judul','')}\n\n"
                    f"{caption.get('youtube_deskripsi','')}\n\n{tagar}",
                    language=None,
                )
            st.markdown("**Komentar pertama:**")
            st.code(caption.get("komentar_pertama", ""), language=None)

        st.subheader("Berkas hasil")
        for f in sorted(p.dir_hasil.iterdir()):
            if f.is_file():
                st.caption(f"📄 {f.name}  ·  {f.stat().st_size/1024:.0f} KB")

        st.info(
            "**Sebelum unggah:** nyalakan penanda “konten buatan AI” di aplikasi "
            "tempat kamu mengunggah. Itu cara yang benar dan tidak menurunkan "
            "jangkauan. Rinciannya ada di berkas daftar_periksa.txt."
        )

    st.divider()
    if st.button("🔄 Rakit ulang video", use_container_width=True):
        p.data.pop("hasil", None)
        p.tahap = "disetujui"
        p.simpan()
        st.rerun()


# ---------------------------------------------------------------------------
# Halaman utama
# ---------------------------------------------------------------------------
def main() -> None:
    bilah_samping()
    p = proyek_aktif()

    if not config.kie_key():
        st.title("Selamat datang 👋")
        st.markdown(
            "Aplikasi ini membuat video cerita pendek yang menjual produk secara halus.\n\n"
            "Untuk mulai, isi **API key Kie** di panel kiri."
        )
        return

    if not p:
        st.title("Belum ada proyek terbuka")
        st.markdown("Buat proyek baru lewat panel di sebelah kiri.")
        return

    st.title(p.nama)
    penunjuk_tahap(p)
    st.divider()

    urut = ["Produk", "Riset Topik", "Naskah", "Storyboard", "Video"]
    kunci = ["produk", "riset", "naskah", "storyboard", "disetujui"]
    boleh = [p.sudah_melewati(k) or i == 0 for i, k in enumerate(kunci)]
    aktif = max(i for i, b in enumerate(boleh) if b)

    tab = st.tabs(urut)
    with tab[0]:
        tahap_produk(p)
    with tab[1]:
        if boleh[1]:
            tahap_riset(p)
        else:
            st.info("Selesaikan tahap Produk dulu.")
    with tab[2]:
        if boleh[2]:
            tahap_naskah(p)
        else:
            st.info("Pilih topik dulu di tahap Riset.")
    with tab[3]:
        if boleh[3]:
            tahap_storyboard(p)
        else:
            st.info("Buat naskah dulu.")
    with tab[4]:
        if boleh[4]:
            tahap_render(p)
        else:
            st.info("Setujui storyboard dulu sebelum video dirakit.")


if __name__ == "__main__":
    main()
