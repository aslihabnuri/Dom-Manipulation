"""Definisi dua kategori konten: Food & Beverage dan Fashion.

Setiap kategori membawa tiga hal:
  - Gaya visual  : palet warna & kosakata gambar untuk storyboard
  - Arketipe cerita : kerangka naratif yang menjual secara halus
  - Palet suara  : efek suara yang cocok dengan materinya

Gaya visual mengikuti video acuan: animasi vektor 2D datar, warna sangat
jenuh, latar bergradasi, karakter geometris sederhana bermata besar.
"""
from __future__ import annotations

from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Palet warna. Diambil dari video acuan (ungu-magenta, sian-biru, jingga-kuning).
# Tiap adegan memakai palet berbeda agar video terasa hidup dan tidak monoton.
# ---------------------------------------------------------------------------
PALET = [
    {
        "nama": "ungu-magenta",
        "latar": "deep violet to hot magenta radial gradient",
        "aksen": "electric pink, warm yellow",
    },
    {
        "nama": "sian-biru",
        "latar": "turquoise to deep blue vertical gradient",
        "aksen": "lime green, coral red",
    },
    {
        "nama": "jingga-kuning",
        "latar": "warm orange to golden yellow radial gradient",
        "aksen": "deep purple, cream white",
    },
    {
        "nama": "magenta-ungu",
        "latar": "hot pink to royal purple diagonal gradient",
        "aksen": "cyan, bright yellow",
    },
    {
        "nama": "hijau-teal",
        "latar": "mint green to deep teal gradient",
        "aksen": "burnt orange, off-white",
    },
    {
        "nama": "merah-senja",
        "latar": "crimson to dusty rose gradient",
        "aksen": "gold, midnight blue",
    },
]

# Kalimat gaya yang selalu disisipkan ke setiap prompt gambar.
# Ini yang membuat seluruh video terlihat berasal dari satu tangan.
GAYA_DASAR = (
    "flat 2D vector illustration, modern infographic explainer animation style, "
    "bold heavily saturated colors, clean geometric shapes, no gradients on objects "
    "but smooth gradient background, simple rounded characters with large expressive "
    "white oval eyes and small dark pupils, white glove hands, no nose, minimal mouth, "
    "thick confident shapes, subtle glow and bloom on accents, layered silhouettes for depth, "
    "crisp edges, high contrast, playful but intelligent mood, "
    "vertical 9:16 composition, subject centered with generous empty space at the top "
    "and bottom third for text overlay, "
    "absolutely no text, no words, no letters, no numbers, no watermark, no signature"
)

NEGATIF_DASAR = (
    "photorealistic, 3d render, realistic skin, photograph, text, words, letters, "
    "watermark, signature, cluttered, muddy colors, gritty texture, horror gore, "
    "extra fingers, deformed hands, distorted face, blurry, low contrast"
)


@dataclass
class Arketipe:
    """Kerangka cerita. Produk tidak pernah jadi tokoh utama."""

    kode: str
    nama: str
    penjelasan: str
    kerangka: list[str]
    contoh_hook: str


ARKETIPE = [
    Arketipe(
        kode="eskalasi",
        nama="Daftar Menanjak",
        penjelasan=(
            "Format video acuan. Klaim mengejutkan di depan, lalu tiga sampai empat "
            "contoh yang makin ekstrem, ditutup contoh paling mengejutkan."
        ),
        kerangka=[
            "Hook: klaim mengejutkan yang menyangkut penonton langsung",
            "Contoh 1: yang paling biasa — jelaskan mekanismenya",
            "Contoh 2: naik satu tingkat — beri angka konkret",
            "Contoh 3: naik lagi — masukkan keraguan atau bantahan",
            "Puncak: contoh paling ekstrem tapi tetap benar",
            "Penutup: satu kalimat yang memuaskan rasa penasaran",
        ],
        contoh_hook="Ada satu benda di dapurmu yang usianya lebih tua dari negara ini.",
    ),
    Arketipe(
        kode="sejarah",
        nama="Sejarah Tersembunyi",
        penjelasan=(
            "Menelusuri asal-usul sebuah benda sehari-hari. Penonton merasa "
            "belajar sesuatu, bukan sedang ditawari barang."
        ),
        kerangka=[
            "Hook: benda biasa, fakta asal-usul yang tak terduga",
            "Latar zaman: kondisi masyarakat waktu itu",
            "Masalah: kebutuhan nyata yang belum terpecahkan",
            "Titik balik: siapa atau apa yang mengubahnya",
            "Warisan: bagaimana bentuk itu bertahan sampai hari ini",
            "Jembatan halus: benda yang sama, di tangan kita sekarang",
        ],
        contoh_hook="Sebelum tahun sembilan belas dua puluhan, perempuan tidak punya saku.",
    ),
    Arketipe(
        kode="sains",
        nama="Sains di Baliknya",
        penjelasan=(
            "Menjelaskan mengapa sesuatu bekerja. Cocok untuk makanan, minuman, "
            "dan bahan kain."
        ),
        kerangka=[
            "Hook: pertanyaan yang tak pernah terpikirkan",
            "Pengamatan: apa yang sebenarnya terjadi",
            "Mekanisme: penjelasan sederhana dan visual",
            "Angka: satu data konkret yang mudah diingat",
            "Konsekuensi: kenapa itu penting untuk penonton",
            "Jembatan halus: penerapannya dalam hidup sehari-hari",
        ],
        contoh_hook="Warna hijau terang pada matcha sebenarnya adalah tanda tanaman yang kelaparan.",
    ),
    Arketipe(
        kode="salah-kaprah",
        nama="Kesalahan yang Semua Orang Lakukan",
        penjelasan=(
            "Membongkar kebiasaan keliru. Sangat kuat menahan penonton karena "
            "mereka ingin tahu apakah mereka termasuk."
        ),
        kerangka=[
            "Hook: sembilan dari sepuluh orang melakukan ini",
            "Kebiasaan: gambarkan tindakannya secara spesifik",
            "Kenapa keliru: sebab teknisnya",
            "Akibat: apa yang hilang karena kekeliruan itu",
            "Cara benar: langkah sederhana yang bisa langsung dicoba",
            "Jembatan halus: alat atau bahan yang membuatnya mudah",
        ],
        contoh_hook="Cara kamu menyimpan tas kulit mungkin sedang merusaknya perlahan.",
    ),
    Arketipe(
        kode="misteri",
        nama="Investigasi Kecil",
        penjelasan=(
            "Menyusun teka-teki lalu membukanya. Menahan penonton sampai akhir "
            "karena jawabannya disimpan."
        ),
        kerangka=[
            "Hook: sebuah kejanggalan yang belum dijelaskan",
            "Petunjuk 1: fakta pertama yang membingungkan",
            "Petunjuk 2: fakta kedua yang memperdalam teka-teki",
            "Salah arah: dugaan yang ternyata keliru",
            "Pengungkapan: jawaban sebenarnya",
            "Jembatan halus: apa artinya bagi kita sekarang",
        ],
        contoh_hook="Kenapa hampir semua kedai kopi memakai cangkir dengan ukuran yang sama persis?",
    ),
    Arketipe(
        kode="konflik-zaman",
        nama="Masalah Satu Zaman",
        penjelasan=(
            "Menempatkan produk sebagai jawaban atas persoalan sosial nyata di "
            "masa lalu. Paling halus dari semua arketipe."
        ),
        kerangka=[
            "Hook: satu tahun, satu masalah yang nyata",
            "Kondisi: bagaimana orang menjalaninya",
            "Beban: siapa yang paling menanggung",
            "Penemuan: solusi yang muncul, sering tidak sengaja",
            "Perubahan: apa yang berubah setelah itu",
            "Jembatan halus: bentuk solusi itu hari ini",
        ],
        contoh_hook="Tahun sembilan belas tujuh puluhan, perempuan pekerja punya satu masalah yang tak pernah dibahas.",
    ),
]

ARKETIPE_INDEKS = {a.kode: a for a in ARKETIPE}


@dataclass
class Kategori:
    kode: str
    nama: str
    kosakata_visual: str
    palet_disukai: list[str]
    efek_suara: list[str]
    arketipe: list[str]
    contoh_produk: list[str]
    catatan_riset: str
    musik: str
    tema_bahasan: list[str] = field(default_factory=list)


KATEGORI: dict[str, Kategori] = {
    "fnb": Kategori(
        kode="fnb",
        nama="Food & Beverage",
        kosakata_visual=(
            "steaming cups, coffee beans, tea leaves, whisking motion, pouring liquid "
            "with arc, cross-section of a cup, ingredient exploding apart into layers, "
            "kitchen counter scene, market stall, farm terraces, microscopic view of "
            "molecules and cells, thermometer, hourglass, human silhouette with "
            "highlighted stomach or brain, magnifying glass circle inset"
        ),
        palet_disukai=["hijau-teal", "jingga-kuning", "merah-senja"],
        efek_suara=["pop", "tuang", "desis", "denting", "swoosh", "tik"],
        arketipe=["sains", "sejarah", "salah-kaprah", "eskalasi", "misteri"],
        contoh_produk=[
            "Matcha bubuk", "Kopi susu botolan", "Teh herbal", "Keripik singkong",
            "Sambal kemasan", "Madu murni", "Cokelat batang", "Kue kering lebaran",
        ],
        catatan_riset=(
            "Cari sudut sejarah bahan, proses produksi, sains rasa dan aroma, "
            "kebiasaan konsumsi lintas negara, serta kesalahan penyajian yang umum."
        ),
        musik="light curious background music, soft marimba and warm synth pads, upbeat but not distracting",
        tema_bahasan=[
            "asal-usul bahan", "proses pembuatan", "sains rasa", "sejarah kuliner",
            "perbandingan antarnegara", "kesalahan penyajian", "efek pada tubuh",
        ],
    ),
    "fashion": Kategori(
        kode="fashion",
        nama="Fashion",
        kosakata_visual=(
            "handbag silhouette, stitching close-up, fabric weave pattern, sewing machine, "
            "tailor workshop, clothing rack, human figure walking with bag, historical "
            "street scene, factory assembly line, leather texture cross-section, "
            "zipper and buckle detail, wardrobe interior, magnifying glass circle inset"
        ),
        palet_disukai=["ungu-magenta", "magenta-ungu", "sian-biru"],
        efek_suara=["swoosh", "klik", "resleting", "pop", "denting", "gesek"],
        arketipe=["sejarah", "konflik-zaman", "salah-kaprah", "misteri", "eskalasi"],
        contoh_produk=[
            "Tas Sophie Martin", "Sepatu kanvas lokal", "Kemeja linen", "Jam tangan kayu",
            "Dompet kulit", "Hijab pashmina", "Tas ransel kerja", "Sandal kulit",
        ],
        catatan_riset=(
            "Cari sejarah bentuk dan fungsi, perubahan sosial yang melahirkannya, "
            "teknik pembuatan, cara merawat, dan mitos yang beredar."
        ),
        musik="elegant curious background music, soft plucked strings and airy synth, modern and clean",
        tema_bahasan=[
            "sejarah bentuk", "perubahan sosial", "teknik jahit", "jenis bahan",
            "cara merawat", "mitos perawatan", "evolusi gaya",
        ],
    ),
}


def daftar_kategori() -> list[tuple[str, str]]:
    return [(k.kode, k.nama) for k in KATEGORI.values()]


def arketipe_untuk(kode_kategori: str) -> list[Arketipe]:
    kat = KATEGORI.get(kode_kategori)
    if not kat:
        return ARKETIPE
    return [ARKETIPE_INDEKS[a] for a in kat.arketipe if a in ARKETIPE_INDEKS]


def palet_adegan(kode_kategori: str, indeks: int) -> dict[str, str]:
    """Pilih palet untuk adegan ke-N, berputar pada palet favorit kategori."""
    kat = KATEGORI.get(kode_kategori)
    urutan = PALET
    if kat and kat.palet_disukai:
        disukai = [p for p in PALET if p["nama"] in kat.palet_disukai]
        lain = [p for p in PALET if p["nama"] not in kat.palet_disukai]
        urutan = disukai + lain
    return urutan[indeks % len(urutan)]
