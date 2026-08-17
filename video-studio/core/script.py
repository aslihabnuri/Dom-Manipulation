"""Pembuatan naskah bercerita yang menjual secara halus.

Keluaran modul ini adalah satu objek Naskah yang memuat semua bahan produksi:
narasi per adegan, prompt gambar, teks sorotan, isyarat efek suara, dan jenis
gerak kamera. Semua diputuskan di tahap ini supaya tahap berikutnya tinggal
mengeksekusi tanpa menebak-nebak.

Aturan soft-selling yang dipaksakan di sini:
  - Produk tidak boleh disebut sebelum 80% durasi berjalan.
  - Nama merek maksimal muncul satu kali.
  - Tidak ada ajakan membeli di dalam narasi. Ajakan hanya ada di caption.
"""
from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field

from . import idn
from .categories import (
    ARKETIPE_INDEKS,
    GAYA_DASAR,
    KATEGORI,
    palet_adegan,
)
from .kie import KieClient

# Kecepatan bicara narator Bahasa Indonesia yang nyaman didengar.
# Video acuan berjalan pada 175 kata/menit dalam Bahasa Inggris; kata Bahasa
# Indonesia rata-rata lebih panjang, jadi 150 kata/menit memberi kepadatan
# informasi yang setara tanpa terdengar terburu-buru.
WPM = 150


@dataclass
class Adegan:
    nomor: int
    narasi: str
    prompt_gambar: str
    sorotan: str = ""
    sorotan_sub: str = ""
    efek_suara: str = ""
    gerak: str = "zoom-in"
    palet: str = ""
    durasi: float = 0.0

    def dict(self) -> dict:
        return asdict(self)


@dataclass
class Naskah:
    judul: str
    produk: str
    kategori: str
    arketipe: str
    hook: str
    adegan: list[Adegan] = field(default_factory=list)
    catatan_qa: list[str] = field(default_factory=list)
    merek: str = ""
    # Versi sangat pendek dari hook, untuk pita besar di dua detik pertama.
    kartu_hook: str = ""

    @property
    def narasi_penuh(self) -> str:
        return " ".join(a.narasi.strip() for a in self.adegan if a.narasi.strip())

    @property
    def jumlah_kata(self) -> int:
        return len(self.narasi_penuh.split())

    @property
    def perkiraan_durasi(self) -> float:
        return sum(a.durasi for a in self.adegan)

    def dict(self) -> dict:
        return {
            "judul": self.judul,
            "produk": self.produk,
            "kategori": self.kategori,
            "arketipe": self.arketipe,
            "hook": self.hook,
            "merek": self.merek,
            "kartu_hook": self.kartu_hook,
            "adegan": [a.dict() for a in self.adegan],
            "catatan_qa": self.catatan_qa,
            "narasi_penuh": self.narasi_penuh,
            "jumlah_kata": self.jumlah_kata,
            "perkiraan_durasi": self.perkiraan_durasi,
        }

    @classmethod
    def dari_dict(cls, d: dict) -> "Naskah":
        return cls(
            judul=d.get("judul", ""),
            produk=d.get("produk", ""),
            kategori=d.get("kategori", "fnb"),
            arketipe=d.get("arketipe", "sejarah"),
            hook=d.get("hook", ""),
            merek=d.get("merek", ""),
            kartu_hook=d.get("kartu_hook", ""),
            adegan=[Adegan(**a) for a in d.get("adegan", [])],
            catatan_qa=d.get("catatan_qa", []),
        )


_SISTEM = """Kamu penulis naskah video pendek Bahasa Indonesia yang sangat mahir.

Gaya yang kamu kuasai: penjelasan bergambar yang padat, jenaka, dan berbasis fakta —
seperti kanal edukasi animasi yang populer di TikTok. Kalimat pendek. Satu gagasan
per kalimat. Tempo cepat tapi jelas.

HUKUM YANG TIDAK BOLEH DILANGGAR:

1. SOFT SELLING. Ini bukan iklan. Penonton harus merasa sedang menonton konten
   edukasi. Produk hanya boleh muncul di satu adegan terakhir, sebagai kesimpulan
   yang wajar dari cerita. Nama merek maksimal satu kali. Dilarang keras memakai
   kalimat ajakan seperti "beli sekarang", "cek keranjang kuning", "link di bio",
   "jangan sampai kehabisan", atau sejenisnya.

2. FAKTUAL. Jangan mengarang sejarah, angka, nama orang, atau hasil penelitian.
   Kalau kamu tidak yakin sebuah angka benar, tulis cerita tanpa angka itu.
   Lebih baik kehilangan satu detail daripada menyebarkan informasi keliru.

3. SIAP DIBACA MESIN SUARA. Naskah ini akan dibacakan mesin text-to-speech.
   - Tulis semua bilangan dengan huruf: "seribu sembilan ratus tujuh puluh dua",
     bukan "1972". Tidak boleh ada satu pun digit angka di dalam narasi.
   - Jangan pakai kata Bahasa Inggris. Cari padanan Indonesianya.
   - Jangan pakai singkatan seperti "yg", "dll", "dsb".
   - Jangan pakai simbol seperti %, /, &, *, #.
   - Setiap kalimat maksimal dua puluh kata supaya narator tidak kehabisan napas.
   - Hindari tiga kata berurutan yang berawalan huruf sama.

4. MENAHAN PENONTON. Kalimat pertama harus membuat orang berhenti menggulir.
   Sisipkan pertanyaan atau kejutan kecil di tengah supaya penonton tidak pergi.
"""


def _prompt_naskah(
    produk: str,
    kode_kategori: str,
    judul: str,
    hook: str,
    arketipe: str,
    poin_cerita: list[str],
    durasi_target: int,
    jumlah_adegan: int,
    catatan: str,
) -> str:
    kat = KATEGORI[kode_kategori]
    ark = ARKETIPE_INDEKS.get(arketipe)
    kerangka = "\n".join(f"  {i+1}. {s}" for i, s in enumerate(ark.kerangka)) if ark else ""
    poin = "\n".join(f"  - {p}" for p in poin_cerita) if poin_cerita else "(bebas)"
    target_kata = int(durasi_target / 60 * WPM)

    return f"""Tulis naskah lengkap untuk satu video vertikal berdurasi sekitar {durasi_target} detik.

JUDUL TOPIK: {judul}
PRODUK YANG DIJUAL HALUS: {produk}
KATEGORI: {kat.nama}
ARKETIPE CERITA: {ark.nama if ark else arketipe}
KALIMAT PEMBUKA YANG DIINGINKAN: {hook}

KERANGKA ARKETIPE:
{kerangka}

POIN CERITA YANG SUDAH DISETUJUI:
{poin}

{f'CATATAN TAMBAHAN: {catatan}' if catatan else ''}

TARGET PANJANG NARASI: sekitar {target_kata} kata untuk SELURUH video.
Ini penting. Kalau naskah terlalu panjang, video akan melewati durasi dan harus
dibuat ulang — dan itu memboroskan biaya.

Pecah menjadi tepat {jumlah_adegan} adegan. Untuk setiap adegan tentukan:

- "narasi": kalimat yang dibacakan narator pada adegan ini. Satu sampai dua
  kalimat. Ingat semua aturan penulisan untuk mesin suara.

- "deskripsi_visual": apa yang terlihat di layar, dalam Bahasa Inggris, satu
  kalimat padat. Ini akan dipakai untuk membuat gambar. Gunakan kosakata visual
  berikut bila cocok: {kat.kosakata_visual}.
  Gambar harus berupa ilustrasi vektor datar, BUKAN foto. Jangan pernah meminta
  teks, huruf, atau angka muncul di dalam gambar.

- "sorotan": satu atau dua kata KAPITAL yang muncul sebagai label besar di layar
  untuk menegaskan kata kunci adegan ini. Contoh: "GULA", "TAHUN TUJUH PULUHAN",
  "KULIT ASLI". Kosongkan dengan string kosong bila adegan tidak perlu label.

- "sorotan_sub": keterangan kecil di bawah label, maksimal empat kata. Boleh kosong.

- "efek_suara": pilih satu dari daftar ini yang paling cocok:
  {", ".join(kat.efek_suara)}, atau "hening" bila tidak perlu.

- "gerak": pilih satu — "zoom-in", "zoom-out", "geser-kiri", "geser-kanan",
  "naik", "turun", "pop", "getar". Variasikan antaradegan supaya tidak monoton.

ATURAN PENEMPATAN PRODUK:
- Adegan 1 sampai {jumlah_adegan - 1}: dilarang menyebut {produk} atau mereknya.
- Adegan {jumlah_adegan}: baru boleh menyinggung produk, satu kali saja, sebagai
  penutup cerita yang terasa wajar. Jangan mengajak membeli.

Selain adegan, buat juga "kartu_hook": versi sangat pendek dari kalimat pembuka
untuk ditampilkan sebagai pita besar di dua detik pertama. Maksimal ENAM kata.
Harus terbaca dalam sekejap. Contoh yang baik: "Matcha Kamu Pahit Karena Ini".

Balas sebagai objek JSON:
{{
  "judul_final": "...",
  "kartu_hook": "...",
  "adegan": [
    {{"narasi": "...", "deskripsi_visual": "...", "sorotan": "...",
      "sorotan_sub": "...", "efek_suara": "...", "gerak": "..."}}
  ]
}}"""


# Kata jenis barang yang wajar muncul berkali-kali di video edukasi.
# Video tentang matcha memang harus menyebut "matcha"; itu bukan hard selling.
# Yang tidak boleh sering muncul adalah NAMA MEREK.
_KATA_UMUM = {
    # Food & beverage
    "matcha", "maca", "kopi", "teh", "susu", "cokelat", "coklat", "keripik",
    "sambal", "madu", "kue", "roti", "mie", "minuman", "makanan", "bubuk",
    "kemasan", "premium", "original", "botol", "kaleng", "sachet", "instan",
    "gula", "garam", "rempah", "bumbu", "camilan", "kudapan", "seduh",
    # Fashion
    "tas", "sepatu", "kemeja", "jam", "tangan", "dompet", "hijab", "ransel",
    "sandal", "baju", "celana", "kulit", "kanvas", "linen", "katun", "denim",
    "jinjing", "selempang", "pakaian", "busana", "aksesori", "kaus", "jaket",
    # Umum
    "produk", "barang", "merek", "brand", "asli", "lokal", "buatan",
}


def _kata_merek(produk: str, merek: str = "") -> list[str]:
    """Ambil kata yang benar-benar menandai merek, bukan jenis barangnya."""
    sumber = merek or produk
    kata = [w.lower() for w in re.split(r"\W+", sumber) if len(w) > 3]
    khas = [w for w in kata if w not in _KATA_UMUM]
    # Bila semua kata ternyata kata umum, tidak ada merek yang bisa dilacak.
    return khas


# Frasa jualan keras yang tidak boleh lolos ke narasi.
_FRASA_TERLARANG = [
    "beli sekarang", "checkout", "cek keranjang", "keranjang kuning",
    "link di bio", "link di deskripsi", "jangan sampai kehabisan",
    "buruan", "diskon", "promo", "gratis ongkir", "harga spesial",
    "stok terbatas", "order sekarang", "pesan sekarang", "klik",
    "follow", "subscribe", "like dan share",
]


def buat_naskah(
    klien: KieClient,
    *,
    produk: str,
    kode_kategori: str,
    judul: str,
    hook: str,
    arketipe: str,
    poin_cerita: list[str] | None = None,
    durasi_target: int = 65,
    jumlah_adegan: int = 10,
    catatan: str = "",
    merek: str = "",
    model: str | None = None,
) -> Naskah:
    """Hasilkan naskah lengkap dan langsung periksa mutunya."""
    prompt = _prompt_naskah(
        produk, kode_kategori, judul, hook, arketipe,
        poin_cerita or [], durasi_target, jumlah_adegan, catatan,
    )
    data = klien.chat_json(prompt, system=_SISTEM, model=model, max_tokens=9000)
    if not isinstance(data, dict) or "adegan" not in data:
        raise ValueError("Balasan naskah tidak memuat daftar adegan.")

    adegan: list[Adegan] = []
    for i, item in enumerate(data.get("adegan", [])):
        if not isinstance(item, dict):
            continue
        palet = palet_adegan(kode_kategori, i)
        visual = str(item.get("deskripsi_visual", "")).strip()
        adegan.append(
            Adegan(
                nomor=i + 1,
                narasi=str(item.get("narasi", "")).strip(),
                prompt_gambar=susun_prompt_gambar(visual, palet),
                sorotan=str(item.get("sorotan", "")).strip().upper()[:24],
                sorotan_sub=str(item.get("sorotan_sub", "")).strip()[:32],
                efek_suara=str(item.get("efek_suara", "hening")).strip().lower(),
                gerak=str(item.get("gerak", "zoom-in")).strip().lower(),
                palet=palet["nama"],
            )
        )

    naskah = Naskah(
        judul=str(data.get("judul_final") or judul).strip(),
        produk=produk,
        kategori=kode_kategori,
        arketipe=arketipe,
        hook=hook,
        merek=merek,
        kartu_hook=str(data.get("kartu_hook", "")).strip(),
        adegan=adegan,
    )
    hitung_durasi(naskah)
    naskah.catatan_qa = periksa_naskah(naskah, durasi_target, merek)
    return naskah


def susun_prompt_gambar(deskripsi_visual: str, palet: dict[str, str]) -> str:
    """Gabungkan deskripsi adegan dengan gaya dasar dan palet warnanya."""
    deskripsi_visual = re.sub(r"\s+", " ", deskripsi_visual).strip().rstrip(".")
    return (
        f"{deskripsi_visual}. "
        f"Background: {palet['latar']}. Accent colors: {palet['aksen']}. "
        f"{GAYA_DASAR}"
    )


def hitung_durasi(naskah: Naskah, wpm: int = WPM) -> None:
    """Perkirakan durasi tiap adegan dari jumlah katanya."""
    for a in naskah.adegan:
        kata = len(a.narasi.split())
        # Beri lantai 1,6 detik supaya adegan sangat pendek tetap terbaca mata.
        a.durasi = round(max(1.6, kata / max(wpm, 1) * 60.0), 2)


def periksa_naskah(naskah: Naskah, durasi_target: int, merek: str = "") -> list[str]:
    """Pemeriksaan mutu sebelum satu rupiah pun dibelanjakan."""
    catatan: list[str] = []
    teks = naskah.narasi_penuh
    rendah = teks.lower()
    merek = merek or naskah.merek

    if not naskah.adegan:
        catatan.append("🔴 Naskah kosong, tidak ada adegan sama sekali.")
        return catatan

    # Durasi.
    total = naskah.perkiraan_durasi
    selisih = total - durasi_target
    if abs(selisih) > durasi_target * 0.25:
        arah = "lebih panjang" if selisih > 0 else "lebih pendek"
        catatan.append(
            f"🟡 Perkiraan durasi {total:.0f} detik, {abs(selisih):.0f} detik {arah} "
            f"dari target {durasi_target} detik."
        )

    # Angka mentah yang akan membuat mesin suara keseleo.
    digit = re.findall(r"\d+", teks)
    if digit:
        catatan.append(
            f"🔴 Masih ada angka dalam bentuk digit: {', '.join(digit[:5])}. "
            "Akan diperbaiki otomatis saat normalisasi, tetapi sebaiknya diedit manual."
        )

    # Jualan keras.
    for frasa in _FRASA_TERLARANG:
        if frasa in rendah:
            catatan.append(
                f"🔴 Ada kalimat jualan keras: '{frasa}'. Hapus dari narasi — "
                "ajakan membeli hanya boleh ada di caption."
            )

    # Merek muncul terlalu awal. Kata jenis barang sengaja tidak dihitung,
    # karena video edukasi tentang matcha memang harus menyebut "matcha".
    merek_kata = _kata_merek(naskah.produk, merek)
    if merek_kata:
        batas = max(1, int(len(naskah.adegan) * 0.8))
        for a in naskah.adegan[:batas]:
            if any(w in a.narasi.lower() for w in merek_kata):
                catatan.append(
                    f"🟡 Merek sudah disebut di adegan {a.nomor} dari {len(naskah.adegan)}. "
                    "Soft selling jadi terasa seperti iklan. Geser ke adegan terakhir."
                )
                break

        jumlah = sum(rendah.count(w) for w in merek_kata)
        if jumlah > 2:
            catatan.append(
                f"🟡 Nama merek muncul {jumlah} kali. Idealnya cukup satu kali."
            )

    # Hook.
    hook_kata = len(naskah.adegan[0].narasi.split())
    if hook_kata > 18:
        catatan.append(
            f"🟡 Kalimat pembuka {hook_kata} kata — terlalu panjang. "
            "Tiga detik pertama menentukan orang bertahan atau tidak."
        )

    # Pemeriksaan pelafalan per adegan.
    for a in naskah.adegan:
        hasil = idn.normalisasi(a.narasi)
        for t in hasil.temuan:
            if t.tingkat == "kritis":
                catatan.append(f"🔴 Adegan {a.nomor}: {t.pesan}")
            elif t.tingkat == "peringatan":
                catatan.append(f"🟡 Adegan {a.nomor}: {t.pesan}")

    # Variasi gerak.
    gerak = [a.gerak for a in naskah.adegan]
    if len(set(gerak)) <= 2 and len(gerak) > 4:
        catatan.append(
            "🟡 Jenis gerak kamera hampir sama di semua adegan. "
            "Variasikan supaya video tidak terasa dibuat mesin."
        )

    if not catatan:
        catatan.append("🟢 Naskah lolos semua pemeriksaan otomatis.")
    return catatan


def naskah_untuk_suara(naskah: Naskah) -> list[tuple[int, str]]:
    """Naskah per adegan yang sudah dinormalisasi, siap dikirim ke mesin suara."""
    keluaran: list[tuple[int, str]] = []
    for a in naskah.adegan:
        hasil = idn.normalisasi(a.narasi)
        keluaran.append((a.nomor, hasil.hasil))
    return keluaran
