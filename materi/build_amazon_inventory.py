# -*- coding: utf-8 -*-
"""
Membangun PDF materi presentasi:
Studi Kasus 4 - Inventory Management di Amazon.com
Mata kuliah Operations & Technology Management (Sesi 6)

Gaya penulisan mengikuti pola Prof. Nur Aini Masruroh:
strategi dulu baru teknis, dilema dan aturan keputusan, kuantifikasi
tanpa over-claim, verifikasi trade-off, efficient frontier, tanya-jawab kelas.

Jalankan:  python3 build_amazon_inventory.py
Keluaran:  Materi_Studi_Kasus_4_Inventory_Management_Amazon.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_DIR = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont("Serif", FONT_DIR + "LiberationSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Bold", FONT_DIR + "LiberationSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Italic", FONT_DIR + "LiberationSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Serif-BoldItalic", FONT_DIR + "LiberationSerif-BoldItalic.ttf"))
pdfmetrics.registerFontFamily("Serif", normal="Serif", bold="Serif-Bold",
                              italic="Serif-Italic", boldItalic="Serif-BoldItalic")

OUT = "Materi_Studi_Kasus_4_Inventory_Management_Amazon.pdf"

# ---------- gaya ----------
BODY = ParagraphStyle("body", fontName="Serif", fontSize=11, leading=15,
                      alignment=TA_JUSTIFY, spaceAfter=6)
BODY_L = ParagraphStyle("bodyl", parent=BODY, alignment=TA_LEFT, keepWithNext=1)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=9.5, leading=12.5, spaceAfter=3)
CELL = ParagraphStyle("cell", parent=BODY, fontSize=9.5, leading=12, alignment=TA_LEFT,
                      spaceAfter=0)
CELL_B = ParagraphStyle("cellb", parent=CELL, fontName="Serif-Bold")
H1 = ParagraphStyle("h1", fontName="Serif-Bold", fontSize=13.5, leading=17,
                    spaceBefore=14, spaceAfter=6, keepWithNext=1)
H2 = ParagraphStyle("h2", fontName="Serif-Bold", fontSize=11.5, leading=15,
                    spaceBefore=9, spaceAfter=4, keepWithNext=1)
TITLE = ParagraphStyle("title", fontName="Serif-Bold", fontSize=17, leading=22,
                       alignment=TA_CENTER, spaceAfter=4)
SUB = ParagraphStyle("sub", fontName="Serif", fontSize=11.5, leading=15,
                     alignment=TA_CENTER, spaceAfter=2)
BUL = ParagraphStyle("bul", parent=BODY, leftIndent=16, bulletIndent=4, spaceAfter=3)
NUM = ParagraphStyle("num", parent=BODY, leftIndent=20, bulletIndent=2, spaceAfter=3)
NOTE = ParagraphStyle("note", parent=BODY, fontSize=10, leading=13.5,
                      leftIndent=10, rightIndent=10, backColor=colors.HexColor("#f3f3f3"),
                      borderPadding=(6, 6, 6, 6), spaceBefore=4, spaceAfter=10)
RULE = ParagraphStyle("rule", parent=BODY, fontSize=10.5, leading=14,
                      leftIndent=10, rightIndent=10, backColor=colors.HexColor("#eef3f8"),
                      borderPadding=(6, 6, 6, 6), spaceBefore=4, spaceAfter=10)

GRID = colors.HexColor("#8a8a8a")
HEAD_BG = colors.HexColor("#e6e6e6")


def P(text, style=BODY):
    return Paragraph(text, style)


def bullets(items, style=BUL):
    return [Paragraph(t, style, bulletText="•") for t in items]


def numbered(items, style=NUM, start=1):
    return [Paragraph(t, style, bulletText=f"{i}.") for i, t in enumerate(items, start)]


def table(rows, widths, header=True):
    data = []
    for r_i, row in enumerate(rows):
        cells = []
        for c in row:
            st = CELL_B if (header and r_i == 0) else CELL
            cells.append(Paragraph(c, st) if isinstance(c, str) else c)
        data.append(cells)
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0)
    style = [
        ("GRID", (0, 0), (-1, -1), 0.5, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    if header:
        style.append(("BACKGROUND", (0, 0), (-1, 0), HEAD_BG))
    t.setStyle(TableStyle(style))
    t.spaceAfter = 8
    return t


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Serif", 8.5)
    canvas.setFillColor(colors.HexColor("#555555"))
    canvas.drawString(2 * cm, A4[1] - 1.2 * cm,
                      "Operations & Technology Management  |  Sesi 6: Inventory Management  |  "
                      "Studi Kasus 4: Amazon.com")
    canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Halaman {doc.page}")
    canvas.drawString(2 * cm, 1.2 * cm,
                      "Sumber utama: Heizer, Render & Munson (2017), Operations Management, 12th ed., "
                      "Bab 12, hlm. 487-489")
    canvas.restoreState()


W = A4[0] - 4 * cm  # lebar teks
story = []

# =====================================================================
# HALAMAN JUDUL
# =====================================================================
story += [
    Spacer(1, 2.2 * cm),
    P("MATERI PRESENTASI STUDI KASUS 4", SUB),
    P("Inventory Management di Amazon.com", TITLE),
    P("<i>Inventory Management Provides Competitive Advantage at Amazon.com</i>", SUB),
    Spacer(1, 0.8 * cm),
    P("Mata Kuliah: Operations &amp; Technology Management", SUB),
    P("Sesi 6 (12 September 2026): Inventory Management", SUB),
    P("Dosen: Prof. Nur Aini Masruroh, ST., M.Sc., Ph.D.", SUB),
    P("Program Magister Manajemen, Universitas Gadjah Mada", SUB),
    Spacer(1, 1.0 * cm),
]

story.append(table([
    ["Rujukan", "Bagian yang dipakai"],
    ["HRM Bab 12, hlm. 487&#8211;489",
     "<i>Global Company Profile: Amazon.com</i>. Teks kasus utama, delapan langkah pemenuhan pesanan."],
    ["HRM Bab 12, hlm. 490&#8211;514",
     "Fungsi dan jenis persediaan, ABC analysis, record accuracy, cycle counting, kontrol "
     "persediaan ritel, holding cost, EOQ, ROP, safety stock, service level."],
    ["HRM Bab 9, hlm. 376",
     "<i>OM in Action: Amazon Lets Loose the Robots</i>. Angka produktivitas picking dan "
     "penghematan biaya per pesanan."],
    ["HRM Suplemen 11, hlm. 477&#8211;479",
     "Trade-off moda transportasi dan penempatan barang di gudang."],
    ["SBB Bab 13", "Alasan keberadaan persediaan dan konsekuensinya."],
    ["OM Blog by Heizer, Render &amp; Munson (2023, 2025)",
     "Perkembangan Amazon setelah buku terbit. Hanya dipakai di Bagian F."],
], [4.6 * cm, W - 4.6 * cm]))

story.append(P(
    "<b>Dua hal yang perlu disepakati dulu sebelum masuk ke kasus.</b> Pertama, inventory "
    "management termasuk <i>daily decision</i>, keputusan teknis yang diambil rutin setiap hari. "
    "Tetapi arah keputusan itu tidak berdiri sendiri; arahnya ditentukan oleh strategi operasi yang "
    "sudah dipilih lebih dulu. Karena itu kasus ini dibaca dari strategi Amazon ke bawah, bukan dari "
    "gudang ke atas. Kedua, sesuai instruksi kelas, materi ini fokus pada kasusnya. Teori disinggung "
    "secukupnya sebagai pintu masuk; pendalaman teori diserahkan ke pembahasan dosen setelah "
    "presentasi.", NOTE))

story.append(P(
    "<b>Cara membaca.</b> Angka dan fakta dari buku diberi nomor halaman, misalnya (HRM, hlm. 488). "
    "Kalimat yang tidak diberi nomor halaman adalah penalaran atas fakta itu. Pemisahan ini "
    "disengaja supaya di kelas jelas mana data, mana argumen.", NOTE))

story.append(PageBreak())

# =====================================================================
# BAGIAN A
# =====================================================================
story.append(P("BAGIAN A: KERANGKA BERPIKIR, DI MANA PERSEDIAAN BERADA DALAM SISTEM OPERASI", H1))

story.append(P("A.1 Strategi dulu, baru keputusan teknis", H2))
story.append(P(
    "Urutan yang dipakai di kelas ini konsisten: tentukan dulu apa yang mau dicapai (strategi dan "
    "<i>value proposition</i>), baru turunkan ke keputusan teknis di belakangnya. Inventory "
    "management ada di lapisan teknis itu, satu kelompok dengan MRP, sequencing, dan scheduling. "
    "Dalam sepuluh keputusan OM (Heizer), persediaan adalah keputusan ke-8 dengan dua pertanyaan "
    "dasar:"))
story += numbered([
    "<i>How much</i>: berapa banyak persediaan setiap item yang harus dimiliki?",
    "<i>When</i>: kapan harus memesan kembali?",
])
story.append(P(
    "Untuk Amazon ada pertanyaan ketiga yang sama pentingnya, karena stoknya tersebar di lebih dari "
    "150 gudang: <i>where</i>, item mana disimpan di gudang mana. Tiga pertanyaan ini yang akan "
    "dicari jawabannya di sepanjang kasus."))

story.append(P("A.2 Persediaan sebagai persoalan keputusan", H2))
story.append(P(
    "Kalau kita modelkan, persoalan persediaan selalu punya struktur yang sama. Ada tujuan "
    "(<i>objective</i>), ada variabel yang bisa kita atur (<i>decision variables</i>), dan ada "
    "batasan (<i>constraints</i>). Strukturnya seperti berikut."))
story.append(table([
    ["Unsur model", "Isi", "Bentuknya di Amazon"],
    ["Objective",
     "Meminimalkan total biaya persediaan: biaya simpan (<i>holding</i>) + biaya pesan "
     "(<i>ordering</i>) + biaya kekurangan (<i>shortage</i>)",
     "Ditambah satu komponen yang oleh buku disebut sangat mahal: biaya kesalahan pemenuhan "
     "(<i>returns</i>)"],
    ["Decision variables",
     "Jumlah pesan (Q), titik pesan ulang (ROP), stok pengaman",
     "Ditambah alokasi: item apa di gudang mana, dan pesanan mana dipenuhi dari gudang mana"],
    ["Constraints",
     "Tingkat layanan (<i>service level</i>) yang dijanjikan, kapasitas gudang, lead time pemasok",
     "Janji ke pelanggan: harga terendah, kirim tercepat, bebas kesalahan"],
], [3.0 * cm, (W - 3.0 * cm) * 0.5, (W - 3.0 * cm) * 0.5]))
story.append(P(
    "Intuisinya: <i>service level</i> adalah <i>constraint</i>, bukan <i>objective</i>. Perusahaan "
    "tidak meminimalkan stok; perusahaan meminimalkan biaya pada tingkat layanan yang sudah "
    "dijanjikan. Perbedaan ini kecil kelihatannya, tetapi menentukan cara membaca Amazon di "
    "Bagian D."))

story.append(P("A.3 Dilema persediaan dan aturan keputusannya", H2))
story.append(P(
    "Dilemanya sederhana dan sudah dibahas di sesi pertama. Stok terlalu banyak: biaya simpan dan "
    "biaya penanganan naik, ada risiko barang usang. Stok terlalu sedikit: <i>stock out</i>, "
    "permintaan tidak terpenuhi, dan kalau ini terjadi di proses produksi, produksinya berhenti. "
    "Aturan keputusan yang dipakai di kelas:"))
story.append(P(
    "Kalau dampak gangguan (kekosongan stok) tidak signifikan, tidak perlu menyimpan stok banyak. "
    "Kalau dampaknya signifikan, misalnya lead time pemesanan panjang atau biaya kehilangan "
    "penjualan besar, stok cadangan harus dinaikkan untuk menekan risiko.", RULE))
story.append(P(
    "Aturan ini yang nanti dipakai untuk menilai apakah stok Amazon yang sangat besar itu "
    "pemborosan atau justru keputusan yang benar."))

story.append(P("A.4 Alur pembahasan kasus", H2))
story.append(P(
    "Mengikuti metode kelas, urutannya: kisah sukses, apa yang dilakukan perusahaan, mengapa "
    "berhasil, lalu apa yang bisa dan tidak bisa ditiru. Bagian B sampai G mengikuti urutan itu."))

# =====================================================================
# BAGIAN B
# =====================================================================
story.append(P("BAGIAN B: KISAH SUKSES, DARI PENGECER VIRTUAL MENJADI PENGELOLA PERSEDIAAN", H1))

story.append(P("B.1 Rencana awal tahun 1995", H2))
story.append(P(
    "Saat Jeff Bezos membuka usahanya pada 1995, Amazon.com dirancang sebagai pengecer "
    "“virtual”: tanpa persediaan, tanpa gudang, tanpa overhead. Yang ada hanya sekumpulan "
    "komputer yang menerima pesanan buku dan meneruskan pemenuhannya ke pihak lain "
    "(HRM, hlm. 488). Secara default, ini rencana yang menarik: modal kecil, tidak ada risiko stok."))

story.append(P("B.2 Kondisi yang dilaporkan buku", H2))
story.append(P(
    "Buku hanya memberi satu kalimat: “<i>Things clearly didn’t work out that way</i>.” Kondisi "
    "sekarang (HRM, hlm. 488&#8211;489):"))
story.append(table([
    ["Ukuran", "Nilai"],
    ["Item yang disimpan", "Jutaan item, dalam ratusan ribu <i>bin</i> di rak"],
    ["Jumlah gudang", "Lebih dari 150 gudang di seluruh dunia"],
    ["Item yang tersedia di situs", "Diperkirakan 200 juta item"],
    ["Kapasitas kirim gudang tipikal", "Sampai 200.000 <i>pieces</i> per hari"],
    ["Pekerja yang disebut", "600 pekerja terlibat pemindaian di satu gudang"],
    ["Perangkat lunak pesanan", "Begitu baik sehingga keahlian <i>order taking, processing, "
     "billing</i> dijual ke pihak lain"],
], [6.0 * cm, W - 6.0 * cm]))

story.append(P("B.3 Pertanyaan yang biasanya muncul: apakah rencana awalnya salah?", H2))
story.append(P(
    "Jawabannya: bukan salah, tetapi asumsinya tidak bisa dipertahankan begitu <i>value "
    "proposition</i> ditetapkan. Bezos menetapkan pengalaman pelanggan Amazon harus menghasilkan "
    "tiga hal sekaligus: harga terendah, pengiriman tercepat, dan pemenuhan pesanan bebas "
    "kesalahan, sehingga tidak perlu ada kontak lain dengan Amazon setelah pesanan dibuat. Buku "
    "menambahkan satu kalimat kunci: <i>exchanges and returns are very expensive</i> "
    "(HRM, hlm. 489)."))
story.append(P(
    "Ketiga target itu adalah ukuran kinerja operasi. Kalau pemenuhan pesanan dititipkan ke pihak "
    "lain, ketiganya tidak bisa dijamin, karena stok dan prosesnya bukan milik Amazon. Sama dengan "
    "logika Hard Rock Cafe di sesi pertama: begitu keunikan ditetapkan sebagai <i>experience</i>, "
    "lokasi harus di tempat wisata. Begitu Amazon menetapkan cepat dan bebas kesalahan, persediaan "
    "harus dipegang sendiri. <i>Value proposition</i> men-<i>direct</i> keputusan di belakangnya."))
story.append(table([
    ["Target", "Kalau pemenuhan dititipkan ke pihak ketiga", "Kalau dikelola sendiri"],
    ["Fastest delivery",
     "Kecepatan bergantung stok dan proses orang lain; janji waktu kirim tidak bisa dibuat",
     "Stok diletakkan di gudang terdekat pelanggan; waktu proses internal bisa ditekan"],
    ["Error-free",
     "Kesalahan pihak lain menjadi biaya <i>return</i> Amazon, tetapi tidak bisa dikendalikan",
     "Titik kontrol (pemindaian, penimbangan) dirancang sendiri"],
    ["Lowest price",
     "Margin pihak ketiga masuk ke harga",
     "Biaya per pesanan ditekan lewat volume dan otomasi"],
], [3.2 * cm, (W - 3.2 * cm) / 2, (W - 3.2 * cm) / 2]))
story.append(P(
    "Kesimpulan: menyimpan persediaan sendiri bukan penyimpangan dari strategi Amazon, melainkan "
    "konsekuensinya. Persediaan di sini adalah alat untuk memenuhi <i>speed</i> dan "
    "<i>dependability</i>, bukan sekadar biaya yang harus ditekan."))

story.append(P("B.4 Karakter operasi Amazon dengan 4V", H2))
story.append(P(
    "Karakter operasi menentukan cara mengelolanya, meskipun industrinya sama. Pemetaan 4V untuk "
    "Amazon (bukti dari buku, posisi pada skala adalah penilaian penyusun):"))
story.append(table([
    ["Dimensi", "Posisi", "Bukti", "Konsekuensi pada persediaan"],
    ["Volume", "Sangat tinggi",
     "200.000 <i>pieces</i>/hari per gudang; 150+ gudang",
     "<i>Economies of scale</i>: otomasi dan standardisasi menjadi ekonomis, biaya per unit turun"],
    ["Variety", "Sangat tinggi",
     "200 juta item; 70% pesanan berisi lebih dari satu produk",
     "Kesalahan pengambilan mudah terjadi; akurasi catatan per item menjadi persoalan utama"],
    ["Variation", "Tinggi (buku tidak memberi angka)",
     "Ritel daring dengan musim puncak; gudang dirancang untuk kapasitas harian maksimum",
     "Perlu stok pengaman dan kapasitas yang bisa menyerap lonjakan"],
    ["Visibility", "Rendah",
     "Pelanggan hanya melihat hasil: harga, waktu tiba, ketepatan isi paket",
     "Proses gudang bebas dirancang untuk efisiensi, tanpa pertimbangan tampilan ke pelanggan"],
], [2.4 * cm, 2.8 * cm, (W - 5.2 * cm) / 2, (W - 5.2 * cm) / 2]))
story.append(P(
    "<i>Insight</i>-nya: secara natural volume tinggi berpasangan dengan variety rendah. Amazon "
    "punya keduanya tinggi. Seperti dibahas di sesi pertama, kombinasi ini tidak otomatis "
    "berarti tidak efisien, asalkan ada strategi yang membuat kustomisasi (di sini: komposisi "
    "pesanan yang berbeda-beda) bisa dilayani dengan proses massal. Bagian C menunjukkan caranya: "
    "pengambilan dilakukan secara massal dalam <i>batch</i>, penyusunan per pesanan dilakukan "
    "di ujung proses."))

story.append(P("B.5 Strategi bersaing yang diambil", H2))
story.append(P(
    "Dari tiga strategi keunggulan bersaing Heizer (<i>differentiation, cost, response</i>), "
    "target Bezos menuntut <i>cost</i> dan <i>response</i> sekaligus, dengan kualitas didefinisikan "
    "sempit sebagai bebas kesalahan. Secara natural cepat dan murah adalah trade-off. Apakah untuk "
    "Amazon keduanya benar-benar bertentangan? Ini yang perlu dicermati, dan akan diperiksa di "
    "Bagian D. Jangan disimpulkan dulu."))

# =====================================================================
# BAGIAN C
# =====================================================================
story.append(P("BAGIAN C: APA YANG DILAKUKAN AMAZON, DELAPAN LANGKAH PEMENUHAN PESANAN", H1))
story.append(P(
    "Buku mengikuti satu pesanan berisi tiga barang (buku, permainan, kamera digital) dalam delapan "
    "langkah (HRM, hlm. 488&#8211;489). Kolom kanan adalah pertanyaan yang diajukan pada tiap "
    "langkah: keputusan persediaan apa yang sebenarnya sedang diambil di sini?"))
story.append(table([
    ["No.", "Langkah (HRM, hlm. 488–489)", "Keputusan persediaan yang bekerja di langkah ini"],
    ["1", "<b>Pesanan masuk, komputer di Seattle mengambil alih.</b> Komputer menugaskan pesanan "
          "ke salah satu pusat distribusi (DC) besar Amazon di AS.",
     "Ini jawaban atas pertanyaan <i>where</i>: pesanan dialokasikan ke DC yang punya ketiga item. "
     "Syaratnya, catatan stok tiap DC harus benar pada saat itu juga (<i>perpetual inventory</i>). "
     "Kalau catatannya salah, pesanan dikirim ke gudang yang ternyata kosong."],
    ["2", "<b>“Flow meister” di DC menerima pesanan.</b> Ia menentukan pekerja mana pergi ke mana "
          "untuk memenuhi pesanan.",
     "Pengendalian aliran kerja. Pesanan diubah menjadi penugasan <i>picking</i>. Masih ada "
     "manusia sebagai pengatur beban, bukan sepenuhnya mesin."],
    ["3", "<b>Picking.</b> Sistem Amazon saat ini menggandakan kecepatan picking operator manual "
          "dan menurunkan tingkat kesalahan mendekati nol.",
     "Produktivitas dan akurasi pengambilan. Mekanismenya ada di Bab 9 (robot Kiva), dibahas di C.2 "
     "dan dihitung di C.3."],
    ["4", "<b>Barang masuk crate di ban berjalan.</b> Tiap item masuk crate kuning besar yang "
          "berisi pesanan banyak pelanggan. Crate penuh berjalan di conveyor sepanjang lebih dari "
          "10 mil dengan kecepatan tetap 2,9 kaki/detik. Bar code tiap item dipindai 15 kali oleh "
          "mesin dan oleh banyak dari 600 pekerja. Tujuannya kesalahan nol, karena <i>return</i> "
          "sangat mahal.",
     "Pengambilan secara <i>batch</i> (banyak pesanan dalam satu crate) supaya perjalanan operator "
     "efisien. Aliran dibuat konstan. Identitas item diverifikasi berulang: ini <i>record "
     "accuracy</i> dalam bentuk paling konkret."],
    ["5", "<b>Ketiga barang bertemu di chute, lalu masuk kotak.</b> Semua crate tiba di satu titik "
          "pusat; bar code dicocokkan dengan nomor pesanan. Tiga barang tadi berakhir di chute "
          "selebar 3 kaki (ada beberapa ribu) dan masuk kotak dengan bar code baru yang "
          "mengidentifikasi pesanan. Picking diurutkan untuk mengurangi perjalanan operator.",
     "Konsolidasi (<i>sortation</i>): dari <i>batch</i> kembali ke pesanan individual. Identitas "
     "berpindah dari item ke pesanan. <i>Sequencing</i> picking adalah keputusan penjadwalan yang "
     "menekan waktu tempuh."],
    ["6", "<b>Hadiah dibungkus dengan tangan.</b> Amazon melatih kelompok pembungkus kado terpilih, "
          "masing-masing 30 paket per jam.",
     "Bagian yang sengaja tidak diotomasi karena variasinya tinggi dan volumenya kecil. Dikelola "
     "dengan standar produktivitas per orang, konsep <i>standard time</i>."],
    ["7", "<b>Kotak dikemas, dilakban, ditimbang, dan dilabeli</b> sebelum keluar gudang dengan "
          "truk. Gudang tipikal dirancang mengirim sampai 200.000 pieces per hari. Sekitar 60% "
          "pesanan lewat U.S. Postal Service; hampir semua sisanya lewat UPS.",
     "Penimbangan adalah verifikasi akhir isi paket, sama logikanya dengan Milton Bradley yang "
     "menimbang kotak permainan (HRM, hlm. 493). Moda kirim: mayoritas lewat moda berbiaya rendah."],
    ["8", "<b>Pesanan tiba di pelanggan</b> dalam 1 atau 2 hari.",
     "Ukuran yang dilihat pelanggan: <i>speed</i> dan <i>dependability</i>."],
], [1.0 * cm, (W - 1.0 * cm) * 0.52, (W - 1.0 * cm) * 0.48]))

story.append(P("C.1 Ukuran hasil, dan dua angka yang harus dibedakan", H2))
story.append(P(
    "Menerima, memproses, menempatkan stok, lalu mengambil dan mengemas satu pesanan secara akurat "
    "memerlukan investasi tenaga kerja kurang dari 3 menit; 70% pesanan adalah pesanan multiproduk; "
    "buku menyebutnya <i>world-class performance</i> (HRM, hlm. 489)."))
story.append(P(
    "Yang perlu dicermati: “kurang dari 3 menit” adalah ukuran <i>input</i>, yaitu jam kerja yang "
    "dipakai per pesanan. Itu ukuran biaya. Yang dirasakan pelanggan adalah 1&#8211;2 hari, dan itu "
    "ukuran <i>speed</i>. Dua angka ini jangan dicampur saat presentasi. Amazon unggul di keduanya, "
    "tetapi mekanismenya berbeda: yang pertama dari efisiensi proses, yang kedua dari posisi stok "
    "yang dekat pelanggan."))

story.append(P("C.2 Mekanisme picking: robot Kiva (HRM Bab 9, hlm. 376)", H2))
story.append(P(
    "Langkah 3 hanya menyebut hasil. Mekanismenya dijelaskan di bab tata letak dan perlu diringkas "
    "di sini karena dari sinilah angka kecepatan dan akurasi itu berasal:"))
story += bullets([
    "Lebih dari 10.000 robot Kiva (kecil, oranye, beroda) dipasang di beberapa gudang AS. Robot "
    "membawa rak berisi stok ke pekerja; pekerja tidak lagi mencari barang di lorong. Buku "
    "menyamakannya dengan lini perakitan bergerak: barangnya yang bergerak, bukan orangnya.",
    "Di gudang Tracy, California (1,2 juta kaki persegi), empat lantai rak tetap diganti robot. "
    "<i>Picker</i> berdiri di satu tempat; robot membawa rak 4 x 6 kaki kepadanya. Jalan kaki yang "
    "dihemat sampai 20 mil per hari per pekerja.",
    "Standar pekerja naik dari 100 menjadi minimal 300 item per jam untuk <i>pick and scan</i>.",
    "Robot menghemat US$400&#8211;900 juta per tahun biaya pemenuhan dengan mengurangi berapa kali "
    "produk “disentuh”, dan memangkas 20&#8211;40% dari biaya rata-rata US$3,50&#8211;3,75 per "
    "pesanan untuk menyortir, mengambil, dan mengemas.",
])
story.append(P(
    "Dari sisi persediaan, robot mengubah dua hal. Lokasi fisik stok tidak lagi harus tetap, sehingga "
    "penempatan (<i>slotting</i>) bisa diatur ulang oleh perangkat lunak. Dan setiap pengambilan "
    "langsung dipindai di satu stasiun, sehingga catatan stok diperbarui pada saat yang sama dengan "
    "pengambilan fisiknya. Ini yang membuat langkah 1 bisa mengandalkan data stok per DC."))

story.append(P("C.3 Kuantifikasi produktivitas: jangan over-claim", H2))
story.append(P(
    "Angka 100 menjadi 300 item per jam mudah dibaca sebagai kenaikan produktivitas 200%. Itu "
    "<i>single-factor productivity</i>, hanya menghitung tenaga kerja. Ukurannya <i>not fair</i>, "
    "karena kenaikan itu dicapai dengan menambah <i>resource</i> lain, yaitu robot, dan biaya robot "
    "tidak ikut dihitung. Yang adil adalah <i>multi-factor productivity</i>, semua <i>resource</i> "
    "diuangkan lalu dijumlahkan."))
story.append(table([
    ["Ukuran", "Angka dari buku", "Cara membacanya"],
    ["Labor productivity (single-factor)",
     "100 → 300 item/jam per pekerja (HRM, hlm. 376)",
     "Naik 200%. Benar, tetapi belum memperhitungkan investasi robot"],
    ["Biaya per pesanan (multi-factor, sudah termasuk robot)",
     "Turun 20&#8211;40% dari US$3,50&#8211;3,75 per pesanan (HRM, hlm. 376)",
     "Penghematan bersih sekitar US$0,70&#8211;1,50 per pesanan. Jauh di bawah 200%, tetapi tetap "
     "positif"],
    ["Dampak tahunan", "US$400&#8211;900 juta per tahun (HRM, hlm. 376)",
     "Angka kecil per pesanan menjadi besar karena volume"],
], [4.2 * cm, (W - 4.2 * cm) * 0.42, (W - 4.2 * cm) * 0.58]))
story.append(P(
    "Kesimpulan: investasi robot terbukti menaikkan produktivitas, tetapi klaimnya harus dikoreksi "
    "dengan ukuran multi-faktor supaya tidak <i>over-claim</i>. Pola ini sama dengan contoh Collins "
    "Title di sesi kedua: 75% pada ukuran tenaga kerja, 26% pada ukuran multi-faktor. Yang "
    "dipresentasikan sebaiknya angka biaya per pesanan, bukan angka 200%."))

# =====================================================================
# BAGIAN D
# =====================================================================
story.append(P("BAGIAN D: MENGAPA BERHASIL, ANALISIS TRADE-OFF", H1))

story.append(P("D.1 Pertanyaan yang biasanya muncul: stok sebesar itu, bukankah tidak efisien?", H2))
story.append(P(
    "Buku merumuskan tujuan inventory management sebagai keseimbangan antara investasi persediaan "
    "dan layanan pelanggan; persediaan bisa mencapai 50% dari total modal yang diinvestasikan "
    "(HRM, hlm. 490). Amazon jelas berada di sisi investasi besar: jutaan item di 150+ gudang."))
story.append(P(
    "Jawabannya harus dikembalikan ke <i>objective</i> pada A.2. Amazon tidak meminimalkan stok. "
    "Amazon meminimalkan total biaya pada tingkat layanan yang sudah dijanjikan (tercepat, bebas "
    "kesalahan). Pada tingkat layanan itu, kekosongan stok berarti penjualan hilang dan janji "
    "<i>fastest delivery</i> rusak. Dengan aturan keputusan A.3, dampaknya signifikan, sehingga stok "
    "besar adalah solusi yang konsisten dengan tujuannya, bukan pemborosan. Yang diminimalkan "
    "Amazon adalah dua komponen lain: tenaga kerja per pesanan (kurang dari 3 menit) dan "
    "kesalahan (mendekati nol). Judul profil, <i>inventory management provides competitive "
    "advantage</i>, harus dibaca dengan makna ini: bukan stok sedikit, tetapi stok besar yang "
    "dikelola presisi."))

story.append(P("D.2 Pemetaan ke lima tujuan kinerja operasi", H2))
story.append(table([
    ["Tujuan kinerja", "Wujud di Amazon (fakta buku)", "Mekanisme yang menghasilkannya"],
    ["Speed", "Tiba 1&#8211;2 hari; tenaga kerja &lt; 3 menit per pesanan",
     "Alokasi ke DC yang punya stok; conveyor berkecepatan tetap; picking diurutkan; robot "
     "membawa rak"],
    ["Quality (didefinisikan: bebas kesalahan)",
     "Kesalahan picking mendekati nol; bar code dipindai 15 kali",
     "Verifikasi di setiap perpindahan; penimbangan sebelum keluar"],
    ["Dependability", "Janji 1&#8211;2 hari terpenuhi; tidak perlu kontak lanjutan",
     "Ketersediaan stok dan proses yang terstandar. <i>As promised</i>, bukan sekadar cepat"],
    ["Flexibility", "70% pesanan multiproduk dari 200 juta item dilayani satu sistem",
     "Batch picking ke crate bersama, lalu konsolidasi per pesanan di chute"],
    ["Cost", "Harga terendah sebagai target; 60% kiriman lewat USPS; biaya sort-pick-pack turun "
             "20&#8211;40%",
     "Volume menyerap biaya tetap otomasi; moda kirim murah untuk mayoritas pesanan"],
], [3.2 * cm, (W - 3.2 * cm) * 0.47, (W - 3.2 * cm) * 0.53]))

story.append(P("D.3 Tiga trade-off dan aturan keputusannya", H2))
story.append(P(
    "Setiap pilihan operasi punya biaya di sisi lain. Keputusan yang baik bukan yang tanpa "
    "biaya, tetapi yang sadar biayanya dan bisa menunjukkan mana yang <i>less loss</i>."))

story.append(P("<b>Trade-off 1: holding cost vs service level.</b>", BODY_L))
story.append(P(
    "Buku memberi patokan total <i>carrying cost</i> sekitar 26% dari nilai persediaan per tahun: "
    "biaya ruang, penanganan, tenaga kerja, modal, serta susut dan keusangan (HRM, Tabel 12.1, "
    "hlm. 496). Buku juga menegaskan biaya kebijakan persediaan naik secara eksponensial ketika "
    "<i>service level</i> dinaikkan (HRM, hlm. 510). Jadi stok Amazon mahal, dan makin mahal di "
    "tingkat layanan tinggi."))
story.append(P(
    "Aturan keputusan: bandingkan biaya simpan tambahan dengan biaya kekosongan. Kalau biaya "
    "kekosongan (penjualan hilang + janji rusak) lebih besar dari biaya simpan tambahan, naikkan "
    "stok. Untuk ritel daring, pelanggan berpindah ke penjual lain dalam hitungan detik, sehingga "
    "biaya kekosongan tinggi. Pilihan Amazon di sisi stok tinggi konsisten dengan aturan ini.", RULE))

story.append(P("<b>Trade-off 2: investasi otomasi (biaya tetap) vs biaya kesalahan dan tenaga kerja "
               "(biaya variabel).</b>", BODY_L))
story.append(P(
    "Pemindaian 15 kali, penimbangan, dan robot adalah biaya tetap ditambah biaya per transaksi "
    "yang kecil. Kesalahan (barang salah kirim) menimbulkan biaya <i>return</i>, kirim ulang, dan "
    "hilangnya kepercayaan."))
story.append(P(
    "Aturan keputusan: otomasi layak kalau (penghematan per pesanan) × (jumlah pesanan per tahun) "
    "lebih besar dari biaya tahunan otomasi. Dari C.3, penghematan per pesanan hanya "
    "US$0,70&#8211;1,50. Angka itu baru berarti pada volume Amazon. Faktor penentunya volume, bukan "
    "teknologinya.", RULE))

story.append(P("<b>Trade-off 3: kecepatan kirim vs biaya kirim.</b>", BODY_L))
story.append(P(
    "Suplemen 11 (HRM, hlm. 477) merumuskan trade-off ini: kirim lebih cepat biasanya lebih mahal, "
    "sementara barang yang lebih lama di perjalanan menahan modal lebih lama. Amazon mengirim 60% "
    "pesanan lewat USPS, moda yang murah. Kecepatan 1&#8211;2 hari tidak dibeli dari moda mahal; "
    "kecepatan dibangun dari dalam, yaitu stok yang sudah ada di DC dekat pelanggan dan proses "
    "gudang yang pendek. Ini yang membuat target harga terendah dan tercepat bisa dipegang "
    "bersamaan."))

story.append(P("D.4 Verifikasi: benar trade-off, atau sebenarnya searah?", H2))
story.append(P(
    "Sebelum menyimpulkan ada trade-off, periksa dulu apakah dua tujuan itu benar-benar "
    "bertentangan atau justru <i>complementary</i>. Kalau searah, tidak perlu ditimbang; kerjakan "
    "saja. Hasil pemeriksaan untuk Amazon:"))
story.append(table([
    ["Pasangan tujuan", "Hubungan", "Alasan"],
    ["Akurasi (kesalahan nol) vs biaya", "Searah",
     "Setiap kesalahan yang dicegah menghilangkan biaya <i>return</i>. Investasi pada akurasi "
     "menurunkan biaya total. Tidak ada yang perlu dikorbankan."],
    ["Kecepatan proses internal vs biaya", "Searah",
     "Tenaga kerja &lt; 3 menit per pesanan sekaligus menekan biaya dan mempercepat. Robot menghemat "
     "jalan kaki dan biaya sort-pick-pack pada saat yang sama."],
    ["Ketersediaan stok (service level) vs holding cost", "Trade-off nyata",
     "Stok pengaman menaikkan biaya simpan, dan tidak ada mekanisme yang menghilangkannya. Amazon "
     "memilih posisi sadar di sisi <i>service level</i> tinggi (Trade-off 1)."],
    ["Kecepatan kirim vs biaya kirim", "Trade-off nyata, tetapi dihindari",
     "Sumber kecepatan dipindahkan dari moda kirim ke posisi stok dan proses gudang, sehingga moda "
     "murah tetap bisa dipakai (Trade-off 3)."],
], [4.2 * cm, 3.0 * cm, W - 7.2 * cm]))
story.append(P(
    "Kesimpulan: dari tiga target Bezos, hanya ketersediaan stok yang benar-benar menuntut "
    "pengorbanan biaya. Dua target lain justru menurunkan biaya. Karena itu Amazon bisa menuntut "
    "ketiganya sekaligus tanpa terjebak memilih satu strategi generik."))

story.append(P("D.5 Melihatnya sebagai efficient frontier", H2))
story.append(P(
    "Tiga alternatif pengelolaan persediaan bisa diletakkan pada dua sumbu: biaya per pesanan dan "
    "kecepatan/akurasi yang bisa dijanjikan. Alternatif yang didominasi (lebih mahal dan lebih "
    "lambat sekaligus) dicoret; yang tersisa membentuk <i>efficient frontier</i>, dan pilihan di "
    "sepanjang <i>frontier</i> diserahkan ke preferensi pengambil keputusan."))
story.append(table([
    ["Alternatif", "Biaya", "Kecepatan dan akurasi", "Status pada volume Amazon"],
    ["A. Pengecer virtual (rencana 1995)",
     "Modal rendah, tetapi margin pihak ketiga masuk ke harga",
     "Tidak bisa dijanjikan; bergantung pihak lain",
     "Tidak didominasi (modalnya paling rendah), tetapi tidak memenuhi <i>constraint</i> "
     "bebas kesalahan dan tercepat"],
    ["B. Gudang sendiri, proses manual",
     "Biaya per pesanan US$3,50&#8211;3,75",
     "Bisa dijanjikan, dengan risiko kesalahan manusia",
     "Didominasi oleh C: lebih mahal per pesanan dan kurang akurat. Dicoret."],
    ["C. Gudang sendiri, terotomasi",
     "Biaya per pesanan turun 20&#8211;40%",
     "Kesalahan mendekati nol; 1&#8211;2 hari",
     "Berada di <i>frontier</i>; dipilih karena sesuai <i>value proposition</i>"],
], [3.6 * cm, (W - 3.6 * cm) * 0.3, (W - 3.6 * cm) * 0.3, (W - 3.6 * cm) * 0.4]))
story.append(P(
    "Catatan penting: dominasi C atas B hanya berlaku pada volume Amazon. Pada volume kecil, biaya "
    "tetap robot tidak terserap, C menjadi lebih mahal dari B, dan B kembali ke <i>frontier</i>. "
    "Tidak ada jawaban pasti yang berlaku untuk semua perusahaan; tergantung volume dan biaya "
    "kekosongannya masing-masing."))

# =====================================================================
# BAGIAN E
# =====================================================================
story.append(P("BAGIAN E: PINTU MASUK KE TEORI, KONSEP BAB 12 YANG TERLIHAT BEKERJA", H1))
story.append(P(
    "Bagian ini sengaja ringkas. Kolom “status” menyatakan apakah kaitan itu disebut buku secara "
    "eksplisit atau merupakan inferensi, supaya di kelas jelas mana yang bisa dipegang."))
story.append(table([
    ["Konsep (HRM Bab 12)", "Wujud di Amazon", "Status"],
    ["Fungsi persediaan no. 1: menyediakan pilihan barang untuk permintaan yang diantisipasi dan "
     "memisahkan perusahaan dari fluktuasi permintaan (hlm. 490)",
     "Jutaan item di 150+ gudang; buku menyebut fungsi ini tipikal ritel",
     "Eksplisit"],
    ["Jenis persediaan (hlm. 490&#8211;491)",
     "Hampir seluruhnya <i>finished goods</i>. Tidak ada WIP produksi; yang “dalam proses” adalah "
     "pesanan di conveyor",
     "Inferensi"],
    ["Record accuracy: sistem <i>perpetual</i> dengan bar code (hlm. 493)",
     "Bar code dipindai 15 kali; alokasi pesanan dari Seattle mengandalkan catatan stok per DC",
     "Eksplisit (pindai); inferensi (alokasi)"],
    ["Cycle counting (hlm. 493&#8211;494)",
     "Tidak disebut. Dengan sistem perpetual pun verifikasi berkala tetap diperlukan untuk "
     "menangkap kesalahan fisik (rusak, salah bin)",
     "Tidak disebut; asumsi"],
    ["ABC analysis / Pareto (hlm. 491&#8211;492)",
     "Tidak disebut di profil. Praktik terbaru (Bagian F): fasilitas <i>same-day</i> hanya "
     "menyimpan 100.000 item terlaris per wilayah",
     "Tidak disebut di buku; sumber lain"],
    ["Kontrol persediaan ritel: kontrol ketat barang masuk dan keluar dengan bar code "
     "(hlm. 494&#8211;495)",
     "Setiap item dan kotak diberi bar code; penimbangan sebelum keluar gudang",
     "Eksplisit"],
    ["Independent demand; ROP = permintaan selama lead time + Z&#963; (hlm. 495, 510)",
     "Permintaan tiap item independen dan bervariasi; <i>service level</i> tinggi menuntut safety "
     "stock besar, sejalan dengan investasi persediaan Amazon",
     "Inferensi"],
    ["Penempatan di gudang: item dengan rasio (jumlah trip / blok penyimpanan) tertinggi diletakkan "
     "paling dekat dock (Suplemen 11, hlm. 478)",
     "“Picking is sequenced to reduce operator travel”; robot membawa rak sehingga penempatan bisa "
     "diatur perangkat lunak",
     "Eksplisit (sequencing); inferensi (slotting)"],
], [W * 0.36, W * 0.46, W * 0.18]))
story.append(P(
    "<i>Insight</i>-nya: profil Amazon menekankan sisi pengendalian (akurasi catatan, kontrol barang "
    "keluar, aliran kerja), bukan sisi model kuantitatif (EOQ, ROP). Ini masuk akal. Model berapa "
    "dan kapan hanya berguna kalau angka stok yang menjadi masukannya benar. Urutannya: akurasi "
    "dulu, model kemudian."))

# =====================================================================
# BAGIAN F
# =====================================================================
story.append(P("BAGIAN F: PERKEMBANGAN SETELAH BUKU TERBIT", H1))
story.append(P(
    "Buku menggambarkan kondisi sekitar 2017. Sumber berikut berasal dari blog resmi para penulis "
    "buku (<i>The OM Blog by Heizer, Render &amp; Munson</i>), sehingga sejalan dengan rujukan "
    "kelas. Yang diambil hanya yang mengubah cara Amazon mengelola persediaan."))
story.append(table([
    ["Tahun / sumber", "Perkembangan", "Kaitan dengan kasus di buku"],
    ["2023 (OM Blog, 18 Nov 2023; video Wall Street Journal)",
     "Jaringan AS dibagi menjadi 8 wilayah dengan stok lengkap di tiap wilayah; lebih dari 76% "
     "permintaan dipenuhi dari dalam wilayahnya. Fasilitas <i>same-day</i> menyimpan 100.000 item "
     "terlaris per wilayah, dipilih dengan <i>machine learning</i>. Waktu rata-rata dari picking "
     "sampai paket di dock keluar: 11 menit.",
     "Melanjutkan langkah 1 (alokasi ke DC) menjadi keputusan <i>where</i> per wilayah. Pemilihan "
     "100.000 item terlaris adalah Pareto/ABC pada penempatan stok."],
    ["2025 (OM Blog, 7 Jul 2025)",
     "Lebih dari satu juta robot beroperasi; sekitar 75% pengiriman global melibatkan bantuan "
     "robot; paket terkirim per karyawan per tahun naik dari 175 menjadi 3.870 dalam satu dekade.",
     "Melanjutkan langkah 3 (picking terotomasi). Ingat C.3: angka per karyawan adalah ukuran "
     "<i>single-factor</i>; jangan dibaca sebagai efisiensi total."],
], [3.6 * cm, (W - 3.6 * cm) * 0.5, (W - 3.6 * cm) * 0.5]))
story.append(P(
    "Arah yang digambarkan buku tidak berubah: kecepatan dicapai lewat posisi stok yang mendekat ke "
    "pelanggan, akurasi dan biaya lewat otomasi. Yang berubah adalah alatnya."))

# =====================================================================
# BAGIAN G
# =====================================================================
story.append(P("BAGIAN G: LESSON LEARNED, APA YANG BISA DAN TIDAK BISA DITIRU", H1))

story.append(P("G.1 Pelajaran dari kasus", H2))
story += numbered([
    "<b>Persediaan bisa menjadi sumber keunggulan bersaing, dengan syarat dikelola presisi.</b> "
    "Amazon tidak unggul karena stoknya sedikit, tetapi karena stok besar itu diketahui lokasinya, "
    "diambil dengan benar, dan diproses cepat.",
    "<b>Akurasi catatan adalah prasyarat, bukan pelengkap.</b> Delapan langkah runtuh kalau catatan "
    "stok per DC salah. Akurasi dulu, model kemudian.",
    "<b>Kecepatan dibangun dari dalam, bukan dibeli dari luar.</b> Posisi stok dekat pelanggan dan "
    "proses gudang yang pendek memungkinkan moda kirim murah untuk 60% pesanan tanpa mengorbankan "
    "janji 1&#8211;2 hari.",
    "<b>Kesalahan dikendalikan di banyak titik karena biaya kesalahan lebih besar dari biaya "
    "kontrol.</b> Ini bukan trade-off; keduanya searah. Kerjakan saja.",
    "<b>Otomasi dibenarkan oleh volume, bukan oleh teknologinya.</b> Penghematan "
    "US$0,70&#8211;1,50 per pesanan hanya berarti pada volume ratusan ribu <i>pieces</i> per hari.",
    "<b>Trade-off yang tersisa dipilih secara sadar.</b> Holding cost tinggi diterima karena "
    "dampak kekosongan stok pada ritel daring signifikan. Ini penerapan langsung aturan keputusan "
    "A.3.",
    "<b>Tidak semua bagian diotomasi.</b> Pembungkusan kado tetap manual dengan standar 30 paket "
    "per jam. Otomasi untuk bagian bervolume tinggi dan bervariasi rendah; sisanya dikelola dengan "
    "<i>standard time</i>.",
])

story.append(P("G.2 Apa yang bisa ditiru perusahaan lain", H2))
story.append(table([
    ["Praktik Amazon", "Bisa ditiru?", "Syarat"],
    ["Menjadikan catatan stok akurat sebagai prasyarat (bar code, perpetual)",
     "Ya, pada volume berapa pun",
     "Disiplin pencatatan barang masuk dan keluar; verifikasi berkala"],
    ["Menempatkan stok dekat pelanggan untuk kecepatan",
     "Ya, dengan skala yang disesuaikan",
     "Biaya simpan tambahan harus lebih kecil dari biaya kekosongan (Trade-off 1)"],
    ["Memilih moda kirim murah dan membangun kecepatan dari proses internal",
     "Ya",
     "Proses internal harus benar-benar pendek; kalau tidak, janji waktu tidak bisa dipegang"],
    ["Otomasi picking dengan robot",
     "Tidak begitu saja",
     "Volume harus cukup untuk menyerap biaya tetap (Trade-off 2); pada volume kecil alternatif "
     "manual kembali ke <i>frontier</i> (D.5)"],
    ["Menuntut cepat, murah, dan bebas kesalahan sekaligus",
     "Ya, kalau urutannya benar",
     "Tetapkan kualitas (bebas kesalahan) dulu, baru biaya; seperti prinsip urutan quality dan cost "
     "di sesi pertama"],
], [(W) * 0.38, (W) * 0.2, (W) * 0.42]))

story.append(P("G.3 Pertanyaan yang biasanya muncul dan jawaban ringkasnya", H2))
story.append(table([
    ["Pertanyaan", "Jawaban ringkas"],
    ["Amazon memindai satu item 15 kali. Sampai kapan menambah pemindaian masih bermanfaat?",
     "Sampai biaya satu pemindaian tambahan sama dengan penurunan biaya kesalahan yang dihasilkannya. "
     "Selama biaya <i>return</i> jauh lebih besar dari biaya pindai, batas itu masih jauh."],
    ["Kalau perusahaan saya volumenya seperseribu Amazon, bagian mana yang tetap layak ditiru?",
     "Lihat G.2. Akurasi catatan dan penempatan stok bisa ditiru; robot tidak, karena biaya tetapnya "
     "tidak terserap. Hitung dengan aturan keputusan Trade-off 2."],
    ["Untuk produk seperti apa stok tinggi ala Amazon berhenti masuk akal?",
     "Produk bernilai tinggi, permintaan jarang, cepat usang. Di situ holding cost (termasuk "
     "keusangan) melampaui biaya kekosongan, dan aturan A.3 memberi jawaban sebaliknya."],
    ["Beberapa kaitan di Bagian E berstatus inferensi. Data apa yang perlu untuk memastikannya?",
     "Frekuensi <i>cycle count</i> per kelas item, klasifikasi item per gudang, dan target "
     "<i>service level</i> per kelas. Tanpa data itu, kaitannya tetap dugaan yang masuk akal."],
], [W * 0.42, W * 0.58]))

story.append(P("G.4 Kesimpulan", H2))
story.append(P(
    "Keputusan persediaan Amazon (berapa, kapan, dan di mana) adalah keputusan yang diturunkan "
    "dari target kinerja, bukan keputusan administratif. Amazon menerima biaya persediaan yang "
    "besar karena target kecepatan dan ketersediaannya menuntut itu, lalu menekan semua biaya lain "
    "lewat akurasi catatan dan otomasi bervolume tinggi. Hasilnya, menurut buku, pesanan dipenuhi "
    "dengan investasi tenaga kerja kurang dari 3 menit dan kesalahan mendekati nol. Yang bisa "
    "dibawa ke perusahaan lain bukan tingkat otomasinya, melainkan urutan berpikirnya: tetapkan "
    "target kinerja, pastikan akurasi catatan, periksa mana yang benar trade-off dan mana yang "
    "searah, hitung dengan ukuran yang adil, baru putuskan tingkat investasi persediaan dan "
    "teknologinya."))

story.append(P("Daftar Rujukan", H2))
story += bullets([
    "Heizer, J., Render, B., &amp; Munson, C. (2017). <i>Operations Management: Sustainability and "
    "Supply Chain Management</i> (12th ed.). Pearson. Bab 12 (hlm. 487&#8211;514), Bab 9 (hlm. 376), "
    "Suplemen 11 (hlm. 477&#8211;479).",
    "Slack, N., Brandon-Jones, A., &amp; Burgess, N. (2022). <i>Operations Management</i> (10th ed.). "
    "Pearson. Bab 13.",
    "Heizer, J., Render, B., &amp; Munson, C. (2023, 18 November). Video Tip: Inside Amazon’s Strategy "
    "to Redefine Fast Shipping. <i>The OM Blog</i>. "
    "operationsmanagementblog.com/2023/11/18/video-tip-inside-amazons-strategy-to-redefine-fast-shipping/",
    "Heizer, J., Render, B., &amp; Munson, C. (2025, 7 Juli). OM in the News: Amazon Is on the Cusp of "
    "Using More Robots Than Humans. <i>The OM Blog</i>. operationsmanagementblog.com",
], SMALL)

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm,
                        topMargin=2.0 * cm, bottomMargin=2.0 * cm,
                        title="Studi Kasus 4: Inventory Management di Amazon.com",
                        author="Materi presentasi OTM Sesi 6")
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print("ditulis:", OUT)
