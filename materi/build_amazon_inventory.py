# -*- coding: utf-8 -*-
"""
Membangun PDF materi presentasi:
Studi Kasus 4 - Inventory Management di Amazon.com
Mata kuliah Operations & Technology Management (Sesi 6)

Jalankan:  python3 build_amazon_inventory.py
Keluaran:  Materi_Studi_Kasus_4_Inventory_Management_Amazon.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, KeepTogether)
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
BODY_L = ParagraphStyle("bodyl", parent=BODY, alignment=TA_LEFT)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=9.5, leading=12.5, spaceAfter=3)
CELL = ParagraphStyle("cell", parent=BODY, fontSize=9.5, leading=12, alignment=TA_LEFT,
                      spaceAfter=0)
CELL_B = ParagraphStyle("cellb", parent=CELL, fontName="Serif-Bold")
CELL_C = ParagraphStyle("cellc", parent=CELL, alignment=TA_CENTER)
H1 = ParagraphStyle("h1", fontName="Serif-Bold", fontSize=13.5, leading=17,
                    spaceBefore=14, spaceAfter=6, textColor=colors.HexColor("#1a1a1a"), keepWithNext=1)
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

GRID = colors.HexColor("#8a8a8a")
HEAD_BG = colors.HexColor("#e6e6e6")


def P(text, style=BODY):
    return Paragraph(text, style)


def bullets(items, style=BUL):
    return [Paragraph(t, style, bulletText="•") for t in items]


def numbered(items, style=NUM, start=1):
    return [Paragraph(t, style, bulletText=f"{i}.") for i, t in enumerate(items, start)]


def table(rows, widths, header=True, align_center_cols=()):
    data = []
    for r_i, row in enumerate(rows):
        cells = []
        for c_i, c in enumerate(row):
            if isinstance(c, str):
                if header and r_i == 0:
                    st = CELL_B
                elif c_i in align_center_cols:
                    st = CELL_C
                else:
                    st = CELL
                cells.append(Paragraph(c, st))
            else:
                cells.append(c)
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
    ["Rujukan", "Isi yang dipakai"],
    ["HRM Bab 12, hlm. 487&#8211;489",
     "Global Company Profile: <i>Inventory Management Provides Competitive Advantage at "
     "Amazon.com</i> (teks kasus utama, 8 langkah pemenuhan pesanan)"],
    ["HRM Bab 12, hlm. 490&#8211;514",
     "Teori pendukung: fungsi dan jenis persediaan, ABC analysis, record accuracy, "
     "cycle counting, kontrol persediaan jasa, holding cost, EOQ, ROP, safety stock"],
    ["HRM Bab 9, hlm. 376",
     "OM in Action: <i>Amazon Lets Loose the Robots</i> (robot Kiva; angka produktivitas "
     "picking dan penghematan biaya)"],
    ["HRM Suplemen 11, hlm. 477&#8211;479",
     "Transportation mode analysis dan warehouse storage (dipakai untuk membaca "
     "keputusan moda kirim dan urutan picking)"],
    ["SBB Bab 13", "Alasan keberadaan persediaan dan konsekuensinya (kerangka pembanding)"],
    ["OM Blog by Heizer, Render &amp; Munson (2023, 2025)",
     "Perkembangan Amazon setelah buku terbit (regionalisasi jaringan, robotika); "
     "dipakai hanya di Bagian F sebagai eksplorasi lanjutan"],
], [4.6 * cm, W - 4.6 * cm]))

story.append(P(
    "<b>Cara membaca dokumen ini.</b> Fakta yang diambil langsung dari buku diberi tanda halaman, "
    "misalnya (HRM, hlm. 488). Kalimat yang diawali kata <b>Analisis</b> adalah interpretasi "
    "penyusun terhadap fakta tersebut, bukan pernyataan buku. Pemisahan ini disengaja agar pada "
    "saat presentasi jelas mana yang data dan mana yang argumen.", NOTE))

story.append(P(
    "<b>Batasan cakupan (sesuai instruksi kelas).</b> Presentasi kasus difokuskan pada topik yang "
    "ditugaskan, yaitu inventory management. Teori dibahas secukupnya sebagai pintu masuk, "
    "pendalaman teori diserahkan kepada dosen setelah presentasi. Aspek Amazon di luar persediaan "
    "(layout gudang, supply chain, lokasi) hanya disinggung ketika diperlukan untuk menjelaskan "
    "keputusan persediaan.", NOTE))

story.append(PageBreak())

# =====================================================================
# BAGIAN A
# =====================================================================
story.append(P("BAGIAN A: POSISI KASUS DALAM MATA KULIAH", H1))

story.append(P("A.1 Letak topik", H2))
story.append(P(
    "Inventory management termasuk kelompok <i>daily operations</i> (keputusan teknis harian) "
    "dalam alur materi kelas: setelah strategi operasi, desain produk, desain proses, dan kapasitas "
    "ditetapkan, barulah persediaan diatur. Dalam kerangka sepuluh keputusan OM (Heizer), topik ini "
    "adalah keputusan ke-8, <i>Inventory, MRP, and JIT</i>, dengan dua pertanyaan dasar:"))
story += numbered([
    "Berapa banyak persediaan setiap item yang harus dimiliki? (<i>how much to order</i>)",
    "Kapan harus memesan kembali? (<i>when to order</i>)",
])
story.append(P(
    "Bab 12 HRM membatasi diri pada <i>independent demand</i> (permintaan suatu item tidak "
    "bergantung pada item lain). Ritel seperti Amazon adalah contoh paling murni dari kondisi "
    "ini: permintaan buku tidak bergantung pada permintaan kamera."))

story.append(P("A.2 Alur pembahasan", H2))
story.append(P(
    "Mengikuti metode kelas: mulai dari kisah sukses perusahaan nyata, tarik pelajaran "
    "(<i>lesson learned</i>), baru dikaitkan dengan teori yang mendasarinya. Urutan bagian dalam "
    "dokumen ini mengikuti alur tersebut:"))
story.append(table([
    ["Bagian", "Isi", "Pertanyaan yang dijawab"],
    ["B", "Latar belakang dan karakteristik operasi Amazon",
     "Mengapa Amazon yang semula dirancang tanpa persediaan akhirnya harus mengelola "
     "persediaan sendiri?"],
    ["C", "Proses pemenuhan pesanan, 8 langkah (inti kasus)",
     "Bagaimana satu pesanan diproses dari klik sampai tiba di pelanggan?"],
    ["D", "Analisis keunggulan kompetitif dan trade-off",
     "Di mana letak keunggulannya, dan trade-off apa yang diambil?"],
    ["E", "Kaitan dengan konsep inventory management",
     "Konsep apa dari Bab 12 yang terlihat bekerja di Amazon?"],
    ["F", "Perkembangan setelah buku terbit",
     "Apakah arah yang digambarkan buku masih berlaku?"],
    ["G", "Lesson learned dan bahan diskusi",
     "Apa yang dapat dipelajari dan diuji di kelas?"],
], [1.6 * cm, 6.4 * cm, W - 8.0 * cm]))

# =====================================================================
# BAGIAN B
# =====================================================================
story.append(P("BAGIAN B: LATAR BELAKANG DAN KARAKTERISTIK OPERASI AMAZON", H1))

story.append(P("B.1 Rencana awal (1995): pengecer virtual", H2))
story.append(P(
    "Saat Jeff Bezos membuka usahanya pada 1995, Amazon.com dirancang sebagai pengecer "
    "“virtual”: tanpa persediaan, tanpa gudang, tanpa overhead. Yang ada hanya sekumpulan "
    "komputer yang menerima pesanan buku dan meneruskan pemenuhannya kepada pihak lain "
    "(HRM, hlm. 488)."))

story.append(P("B.2 Kenyataan sekarang", H2))
story.append(P(
    "Buku menyatakan secara singkat: “<i>Things clearly didn’t work out that way</i>.” "
    "Kondisi yang dilaporkan buku (HRM, hlm. 488&#8211;489):"))
story.append(table([
    ["Ukuran", "Nilai yang dilaporkan buku"],
    ["Jumlah item yang disimpan", "Jutaan item, dalam ratusan ribu <i>bin</i> di rak"],
    ["Jumlah gudang", "Lebih dari 150 gudang di seluruh dunia"],
    ["Item tersedia di situs", "Diperkirakan 200 juta item"],
    ["Kapasitas kirim per gudang tipikal", "Sampai 200.000 <i>pieces</i> per hari"],
    ["Pekerja per gudang (contoh yang disebut)", "600 pekerja terlibat pemindaian"],
    ["Perangkat lunak pesanan", "Begitu baik sehingga keahlian <i>order taking, processing, "
     "billing</i> dijual ke pihak lain"],
], [6.0 * cm, W - 6.0 * cm]))

story.append(P("B.3 Target yang ditetapkan Bezos", H2))
story.append(P(
    "Bezos menetapkan pengalaman pelanggan Amazon harus menghasilkan tiga hal sekaligus "
    "(HRM, hlm. 489):"))
story += numbered([
    "harga terendah (<i>lowest price</i>),",
    "pengiriman tercepat (<i>fastest delivery</i>),",
    "pemenuhan pesanan bebas kesalahan (<i>error-free order fulfillment</i>),",
])
story.append(P(
    "sehingga tidak diperlukan kontak lain dengan Amazon setelah pesanan dibuat. Buku menambahkan "
    "satu kalimat yang menjadi kunci pembacaan kasus ini: <i>exchanges and returns are very "
    "expensive</i>. Kesalahan bukan sekadar masalah mutu, tetapi biaya."))

story.append(P("B.4 Mengapa model virtual tidak bertahan", H2))
story.append(P(
    "<b>Analisis.</b> Buku tidak menjelaskan alasannya secara eksplisit, tetapi alasannya dapat "
    "ditarik dari ketiga target di atas. Ketiganya adalah ukuran kinerja operasi yang hanya bisa "
    "dijamin jika Amazon mengendalikan sendiri stok dan proses pemenuhannya:"))
story.append(table([
    ["Target Bezos", "Jika pemenuhan diserahkan ke pihak ketiga", "Jika dikelola sendiri"],
    ["Fastest delivery",
     "Kecepatan bergantung pada stok dan proses pihak lain; Amazon tidak bisa menjanjikan "
     "waktu kirim",
     "Stok diletakkan di gudang terdekat pelanggan; waktu proses internal bisa ditekan"],
    ["Error-free",
     "Kesalahan pihak lain menjadi biaya return Amazon, tetapi tidak bisa dikendalikan",
     "Titik kontrol (pemindaian, penimbangan) dirancang sendiri"],
    ["Lowest price",
     "Margin pihak ketiga masuk ke harga",
     "Biaya per pesanan ditekan lewat volume dan otomasi"],
], [3.2 * cm, (W - 3.2 * cm) / 2, (W - 3.2 * cm) / 2]))
story.append(P(
    "Kesimpulan bagian ini: keputusan Amazon menyimpan persediaan sendiri bukan penyimpangan "
    "dari strategi, melainkan konsekuensi dari target kinerja yang dipilih. Persediaan menjadi "
    "alat untuk memenuhi <i>speed</i> dan <i>dependability</i>, bukan sekadar biaya yang harus "
    "ditekan."))

story.append(P("B.5 Karakteristik operasi Amazon dengan kerangka 4V", H2))
story.append(P(
    "<b>Analisis.</b> Pemetaan berikut memakai kerangka 4V (SBB) yang dibahas di sesi pertama. "
    "Nilai pada kolom “bukti” diambil dari buku; posisi pada skala adalah penilaian penyusun."))
story.append(table([
    ["Dimensi", "Posisi", "Bukti dari kasus", "Implikasi pada persediaan"],
    ["Volume", "Sangat tinggi",
     "200.000 <i>pieces</i>/hari per gudang; >150 gudang",
     "Standardisasi dan otomasi proses menjadi ekonomis; biaya per unit turun"],
    ["Variety", "Sangat tinggi",
     "200 juta item di situs; 70% pesanan berisi lebih dari satu produk",
     "Akurasi catatan per item menjadi persoalan utama; kesalahan pengambilan mudah terjadi"],
    ["Variation (permintaan)", "Tinggi (penilaian penyusun; buku tidak memberi angka)",
     "Ritel daring dengan musim puncak",
     "Perlu stok pengaman dan kapasitas yang bisa diserap; buku menyebut gudang dirancang "
     "untuk kapasitas harian maksimum"],
    ["Visibility", "Rendah",
     "Pelanggan hanya melihat hasil: harga, waktu tiba, ketepatan isi paket",
     "Proses di gudang bebas dirancang untuk efisiensi tanpa pertimbangan tampilan ke pelanggan"],
], [2.6 * cm, 2.6 * cm, (W - 5.2 * cm) / 2, (W - 5.2 * cm) / 2]))
story.append(P(
    "Kombinasi volume tinggi, variety tinggi, dan visibility rendah inilah yang menjelaskan bentuk "
    "sistem pada Bagian C: proses sangat terstandar dan terotomasi (karena volume dan visibility), "
    "tetapi dengan kontrol identitas item yang berlapis (karena variety)."))

story.append(P("B.6 Strategi bersaing yang dipilih", H2))
story.append(P(
    "<b>Analisis.</b> Dalam tiga strategi keunggulan bersaing Heizer (differentiation, cost, "
    "response), target Bezos menuntut <i>cost</i> (harga terendah) dan <i>response</i> "
    "(pengiriman tercepat) sekaligus, dengan kualitas didefinisikan sempit sebagai bebas kesalahan. "
    "Amazon tidak memilih salah satu. Akibatnya beban jatuh pada sistem operasi gudang, yang harus "
    "murah, cepat, dan akurat pada saat yang sama. Bagian D akan menguji apakah ketiganya benar "
    "saling bertentangan (trade-off) atau sebagian justru saling menguatkan."))


# =====================================================================
# BAGIAN C
# =====================================================================
story.append(P("BAGIAN C: PROSES PEMENUHAN PESANAN (INTI KASUS)", H1))
story.append(P(
    "Buku menggambarkan perjalanan satu pesanan berisi tiga barang (buku, permainan, kamera "
    "digital) dalam delapan langkah (HRM, hlm. 488&#8211;489). Kolom terakhir menunjukkan "
    "keputusan atau kontrol persediaan yang bekerja pada langkah tersebut; kolom ini adalah "
    "analisis penyusun."))

story.append(table([
    ["No.", "Langkah (HRM, hlm. 488–489)", "Keputusan / kontrol persediaan yang terlibat"],
    ["1", "<b>Pesanan masuk, komputer di Seattle mengambil alih.</b> Komputer menugaskan pesanan "
          "ke salah satu pusat distribusi (DC) besar Amazon di AS.",
     "Alokasi tersentralisasi: memilih DC yang memiliki ketiga item. Prasyaratnya adalah "
     "catatan stok per DC yang akurat dan mutakhir (<i>perpetual inventory</i>). Tanpa itu, "
     "langkah ini tidak mungkin dilakukan otomatis."],
    ["2", "<b>“Flow meister” di DC menerima pesanan.</b> Ia menentukan pekerja mana pergi "
          "ke mana untuk memenuhi pesanan.",
     "Pengendalian aliran kerja: pesanan diterjemahkan menjadi penugasan <i>picking</i>. "
     "Ada unsur manusia sebagai pengatur beban kerja, bukan sepenuhnya mesin."],
    ["3", "<b>Pengambilan barang (picking).</b> Sistem Amazon saat ini menggandakan kecepatan "
          "picking operator manual dan menurunkan tingkat kesalahan mendekati nol.",
     "Produktivitas dan akurasi picking. Rincian mekanismenya ada di Bab 9 (robot Kiva, "
     "lihat C.2)."],
    ["4", "<b>Barang masuk ke crate di ban berjalan.</b> Setiap item masuk crate kuning besar "
          "yang berisi pesanan banyak pelanggan. Crate penuh berjalan di rangkaian conveyor "
          "sepanjang lebih dari 10 mil dengan kecepatan tetap 2,9 kaki/detik. Bar code tiap item "
          "dipindai 15 kali oleh mesin dan oleh banyak dari 600 pekerja. Tujuannya kesalahan nol, "
          "karena <i>return</i> sangat mahal.",
     "Picking secara <i>batch</i> (banyak pesanan dalam satu crate) untuk efisiensi perjalanan; "
     "aliran dibuat konstan; identitas item diverifikasi berulang. Ini wujud konkret "
     "<i>record accuracy</i>."],
    ["5", "<b>Ketiga barang bertemu di chute lalu masuk kotak.</b> Semua crate tiba di satu "
          "titik pusat; bar code dicocokkan dengan nomor pesanan untuk menentukan siapa mendapat "
          "apa. Tiga barang tadi berakhir di chute selebar 3 kaki (ada beberapa ribu chute) dan "
          "dimasukkan ke kotak dengan bar code baru yang mengidentifikasi pesanan. Picking "
          "diurutkan untuk mengurangi perjalanan operator.",
     "Konsolidasi pesanan (<i>sortation</i>): pemisahan kembali dari batch ke pesanan individual. "
     "Identitas berpindah dari item ke pesanan. <i>Sequencing</i> picking adalah keputusan "
     "penjadwalan yang menekan waktu tempuh."],
    ["6", "<b>Hadiah dibungkus dengan tangan.</b> Amazon melatih kelompok pembungkus kado "
          "terpilih, masing-masing memproses 30 paket per jam.",
     "Bagian yang tidak diotomasi karena variasinya tinggi; dikelola dengan standar "
     "produktivitas per orang."],
    ["7", "<b>Kotak dikemas, dilakban, ditimbang, dan dilabeli</b> sebelum keluar gudang dengan "
          "truk. Gudang tipikal dirancang mengirim sampai 200.000 pieces per hari. Sekitar 60% "
          "pesanan dikirim lewat U.S. Postal Service; hampir semua sisanya lewat UPS.",
     "Penimbangan adalah verifikasi akhir isi paket (bandingkan dengan Milton Bradley, HRM "
     "hlm. 493, yang menimbang kotak permainan untuk memastikan jumlah komponen). Pilihan moda "
     "kirim: mayoritas lewat moda berbiaya rendah."],
    ["8", "<b>Pesanan tiba di pelanggan</b> dalam 1 atau 2 hari.",
     "Ukuran hasil akhir yang dilihat pelanggan: <i>speed</i> dan <i>dependability</i>."],
], [1.0 * cm, (W - 1.0 * cm) * 0.52, (W - 1.0 * cm) * 0.48]))

story.append(P("C.1 Hasil yang dilaporkan buku", H2))
story.append(P(
    "Waktu untuk menerima, memproses, dan menempatkan stok di penyimpanan, lalu mengambil "
    "(<i>pull</i>) dan mengemas satu pesanan secara akurat memerlukan investasi tenaga kerja "
    "kurang dari 3 menit. Sebanyak 70% pesanan adalah pesanan multiproduk. Buku menyebut ini "
    "<i>world-class performance</i> (HRM, hlm. 489)."))
story.append(P(
    "<b>Analisis.</b> Angka “kurang dari 3 menit” adalah ukuran <i>input</i> tenaga kerja "
    "per pesanan, bukan waktu tunggu pelanggan. Yang dilihat pelanggan adalah 1&#8211;2 hari "
    "(langkah 8). Keduanya perlu dibedakan saat presentasi: yang pertama ukuran biaya, yang kedua "
    "ukuran kecepatan."))

story.append(P("C.2 Mekanisme picking: robot Kiva (HRM Bab 9, hlm. 376)", H2))
story.append(P(
    "Langkah 3 pada profil hanya menyebut hasilnya. Mekanismenya dijelaskan di bab tata letak "
    "(OM in Action, <i>Amazon Lets Loose the Robots</i>) dan diringkas di sini karena "
    "menjelaskan dari mana angka akurasi dan kecepatan itu berasal:"))
story += bullets([
    "Amazon memasang lebih dari 10.000 robot Kiva (kecil, oranye, beroda) di beberapa gudang AS. "
    "Robot membawa rak berisi stok ke pekerja, bukan pekerja mencari barang di lorong panjang. "
    "Buku menyamakannya dengan lini perakitan bergerak: barang yang bergerak, bukan orangnya.",
    "Di gudang Tracy, California (1,2 juta kaki persegi), empat lantai rak tetap diganti robot. "
    "<i>Picker</i> berdiri di satu tempat; robot membawa rak 4x6 kaki kepadanya, menghemat "
    "jalan kaki sampai 20 mil per hari per pekerja.",
    "Standar pekerja naik dari 100 menjadi minimal 300 item per jam untuk <i>pick and scan</i>.",
    "Robot menghemat US$400&#8211;900 juta per tahun biaya pemenuhan dengan mengurangi berapa "
    "kali produk “disentuh”, dan memangkas 20&#8211;40% dari biaya rata-rata "
    "US$3,50&#8211;3,75 untuk menyortir, mengambil, dan mengemas satu pesanan.",
])
story.append(P(
    "<b>Analisis.</b> Dari sisi persediaan, robot Kiva mengubah dua hal: (1) lokasi fisik stok "
    "tidak lagi harus tetap, sehingga <i>slotting</i> bisa diatur ulang oleh perangkat lunak; "
    "(2) setiap pengambilan langsung dipindai di satu stasiun, sehingga catatan stok diperbarui "
    "pada saat yang sama dengan pengambilan fisik. Ini yang membuat langkah 1 (alokasi dari "
    "Seattle) bisa mengandalkan data stok per DC."))


# =====================================================================
# BAGIAN D
# =====================================================================
story.append(P("BAGIAN D: ANALISIS KEUNGGULAN KOMPETITIF DAN TRADE-OFF", H1))

story.append(P("D.1 Tujuan inventory management dan posisi Amazon", H2))
story.append(P(
    "Buku merumuskan tujuan inventory management sebagai keseimbangan antara investasi "
    "persediaan dan layanan pelanggan (HRM, hlm. 490). Persediaan adalah salah satu aset "
    "termahal, bisa mencapai 50% total modal yang diinvestasikan. Mengurangi persediaan "
    "menurunkan biaya, tetapi menaikkan risiko kehabisan stok."))
story.append(P(
    "<b>Analisis.</b> Amazon jelas berada di sisi “investasi persediaan besar”: jutaan "
    "item di lebih dari 150 gudang. Keunggulannya karena itu bukan “stok sedikit”, "
    "melainkan “stok besar yang dikelola dengan presisi”. Yang diminimalkan Amazon "
    "adalah dua hal lain: biaya tenaga kerja per pesanan (kurang dari 3 menit) dan kesalahan "
    "(mendekati nol). Judul profil di buku, <i>inventory management provides competitive "
    "advantage</i>, harus dibaca dengan makna ini."))

story.append(P("D.2 Pemetaan ke lima tujuan kinerja operasi", H2))
story.append(table([
    ["Tujuan kinerja", "Wujud di Amazon (fakta buku)", "Mekanisme yang menghasilkannya"],
    ["Speed", "Tiba dalam 1&#8211;2 hari; tenaga kerja &lt; 3 menit per pesanan",
     "Alokasi ke DC yang memiliki stok; conveyor berkecepatan tetap; picking diurutkan; "
     "robot membawa rak"],
    ["Quality (didefinisikan sebagai bebas kesalahan)",
     "Tingkat kesalahan picking mendekati nol; bar code dipindai 15 kali",
     "Verifikasi berlapis di setiap perpindahan; penimbangan akhir"],
    ["Dependability", "Janji 1&#8211;2 hari dipenuhi; tidak perlu kontak lanjutan",
     "Ketersediaan stok (jutaan item) dan proses yang terstandar"],
    ["Flexibility", "70% pesanan multiproduk dari 200 juta item dilayani satu sistem",
     "Batch picking ke crate bersama lalu konsolidasi per pesanan di chute"],
    ["Cost", "Harga terendah sebagai target; 60% kiriman lewat USPS; robot memangkas "
             "20&#8211;40% biaya sort-pick-pack",
     "Volume besar menyerap biaya tetap otomasi; moda kirim murah untuk mayoritas pesanan"],
], [3.2 * cm, (W - 3.2 * cm) * 0.47, (W - 3.2 * cm) * 0.53]))

story.append(P("D.3 Analisis trade-off", H2))
story.append(P(
    "Tiga trade-off berikut adalah cara membaca keputusan Amazon dengan kacamata kelas: "
    "setiap pilihan operasi memiliki biaya di sisi lain, dan keputusan yang baik adalah yang "
    "sadar akan biaya itu."))

story.append(P("<b>Trade-off 1: holding cost vs service level.</b>", BODY_L))
story.append(P(
    "Menyimpan stok besar berarti menanggung holding cost. Buku memberi patokan total "
    "<i>carrying cost</i> sekitar 26% dari nilai persediaan per tahun (biaya ruang, penanganan, "
    "tenaga kerja, modal, serta penyusutan dan keusangan; HRM Tabel 12.1, hlm. 496). Sebaliknya, "
    "kehabisan stok pada ritel daring berarti pelanggan berpindah ke penjual lain dalam hitungan "
    "detik."))
story.append(P(
    "Aturan keputusan yang dipakai di kelas: jika dampak gangguan (kekosongan) tidak signifikan, "
    "stok tidak perlu banyak; jika dampaknya signifikan, stok cadangan dinaikkan. Untuk Amazon, "
    "dampak kekosongan adalah kehilangan penjualan langsung dan rusaknya janji <i>fastest "
    "delivery</i>. Dengan aturan itu, pilihan menanggung holding cost tinggi adalah pilihan yang "
    "konsisten, bukan pemborosan. Buku juga menegaskan biaya kebijakan persediaan naik secara "
    "eksponensial ketika <i>service level</i> dinaikkan (HRM, hlm. 510); Amazon memilih menanggung "
    "kenaikan itu."))

story.append(P("<b>Trade-off 2: investasi otomasi (biaya tetap) vs biaya kesalahan dan tenaga kerja "
               "(biaya variabel).</b>", BODY_L))
story.append(P(
    "Kontrol berlapis (15 kali pindai, penimbangan, robot) adalah biaya tetap dan biaya "
    "per-transaksi yang kecil. Kesalahan (barang salah kirim) menimbulkan biaya return, kirim "
    "ulang, dan hilangnya kepercayaan. Aturan keputusannya sederhana:"))
story.append(P(
    "investasi otomasi layak jika (penghematan per pesanan) &#215; (jumlah pesanan per tahun) "
    "&gt; (biaya tahunan otomasi).", NOTE))
story.append(P(
    "Angka dari Bab 9 menunjukkan penghematan 20&#8211;40% dari US$3,50&#8211;3,75 per pesanan, "
    "yaitu sekitar US$0,70&#8211;1,50 per pesanan. Angka ini kecil per pesanan, tetapi dikalikan "
    "volume Amazon menjadi US$400&#8211;900 juta per tahun. Pelajaran bagi perusahaan lain: "
    "faktor penentu adalah volume. Perusahaan dengan volume rendah yang meniru tingkat otomasi "
    "Amazon akan berada di sisi kiri pertidaksamaan di atas."))

story.append(P("<b>Trade-off 3: kecepatan kirim vs biaya kirim.</b>", BODY_L))
story.append(P(
    "Suplemen 11 (HRM, hlm. 477) merumuskan trade-off ini: pengiriman lebih cepat biasanya lebih "
    "mahal, sementara barang yang lebih lama di perjalanan menahan modal lebih lama. Amazon "
    "mengirim sekitar 60% pesanan lewat USPS, moda yang murah. Kecepatan 1&#8211;2 hari tidak "
    "dibeli dari moda kirim mahal, melainkan dibangun dari dalam: stok sudah berada di DC yang "
    "dekat pelanggan, dan waktu proses di gudang ditekan. Ini konsisten dengan target harga "
    "terendah."))

story.append(P("D.4 Verifikasi: benar trade-off, atau justru saling menguatkan?", H2))
story.append(P(
    "Sebelum menyimpulkan ada trade-off, perlu diperiksa apakah dua tujuan benar-benar "
    "bertentangan atau sebenarnya searah (<i>complementary</i>). Hasil pemeriksaan untuk kasus "
    "Amazon:"))
story.append(table([
    ["Pasangan tujuan", "Hubungan", "Alasan"],
    ["Akurasi (error nol) vs biaya", "Searah",
     "Setiap kesalahan yang dicegah menghilangkan biaya return dan kirim ulang. Investasi pada "
     "akurasi menurunkan biaya total, bukan menaikkannya."],
    ["Kecepatan proses internal vs biaya", "Searah",
     "Tenaga kerja &lt; 3 menit per pesanan sekaligus menekan biaya dan mempercepat. "
     "Robot menghemat jalan kaki dan biaya sort-pick-pack pada saat yang sama."],
    ["Ketersediaan stok (service level) vs holding cost", "Trade-off nyata",
     "Stok pengaman menaikkan biaya simpan; tidak ada mekanisme yang menghilangkan ini. Amazon "
     "memilih posisi sadar di sisi service level tinggi."],
    ["Kecepatan kirim vs biaya kirim", "Trade-off nyata, tetapi dihindari",
     "Amazon memindahkan sumber kecepatan dari moda kirim ke posisi stok dan proses gudang, "
     "sehingga bisa memakai moda murah."],
], [4.2 * cm, 3.0 * cm, W - 7.2 * cm]))
story.append(P(
    "Kesimpulan D: dari tiga target Bezos, hanya ketersediaan stok yang menuntut pengorbanan "
    "biaya secara nyata. Dua target lain (akurasi dan kecepatan proses) justru menurunkan biaya. "
    "Inilah alasan Amazon dapat menuntut ketiganya sekaligus tanpa terjebak pada satu strategi "
    "generik."))


# =====================================================================
# BAGIAN E
# =====================================================================
story.append(P("BAGIAN E: KAITAN DENGAN KONSEP INVENTORY MANAGEMENT (PINTU MASUK TEORI)", H1))
story.append(P(
    "Bagian ini sengaja ringkas. Tujuannya menunjukkan konsep mana dari Bab 12 yang tampak "
    "bekerja di Amazon, agar pembahasan teori setelah presentasi memiliki pijakan pada kasus. "
    "Kolom “status” menyatakan apakah kaitan itu disebut buku secara eksplisit atau "
    "merupakan inferensi."))
story.append(table([
    ["Konsep (HRM Bab 12)", "Wujud di Amazon", "Status"],
    ["Fungsi persediaan no. 1: menyediakan pilihan barang untuk permintaan yang diantisipasi "
     "dan memisahkan perusahaan dari fluktuasi permintaan (hlm. 490)",
     "Jutaan item di 150+ gudang; buku menyebut fungsi ini “tipikal ritel”",
     "Eksplisit"],
    ["Jenis persediaan (hlm. 490&#8211;491)",
     "Hampir seluruhnya <i>finished goods</i>. Tidak ada WIP produksi; yang “dalam "
     "proses” adalah pesanan di conveyor, bukan barang setengah jadi",
     "Inferensi"],
    ["Record accuracy: sistem <i>perpetual</i> dengan bar code (hlm. 493)",
     "Bar code dipindai 15 kali; alokasi pesanan dari Seattle mengandalkan catatan stok per DC",
     "Eksplisit (pindai); inferensi (alokasi)"],
    ["Cycle counting (hlm. 493&#8211;494)",
     "Tidak disebut dalam profil. Dengan sistem perpetual yang memindai setiap pengambilan, "
     "verifikasi berkala tetap diperlukan untuk menangkap kesalahan fisik (rusak, salah bin)",
     "Tidak disebut; asumsi"],
    ["ABC analysis / prinsip Pareto (hlm. 491&#8211;492)",
     "Tidak disebut dalam profil. Praktik terbaru (Bagian F): fasilitas <i>same-day</i> hanya "
     "menyimpan 100.000 item terlaris per wilayah, yaitu penerapan Pareto pada penempatan stok",
     "Tidak disebut di buku; sumber lain"],
    ["Kontrol persediaan jasa/ritel: kontrol ketat barang masuk dan keluar dengan bar code "
     "(hlm. 494&#8211;495)",
     "Setiap item dan setiap kotak diberi bar code; penimbangan sebelum keluar gudang",
     "Eksplisit"],
    ["Independent demand; ROP = permintaan selama lead time + Z&#963; (hlm. 495, 510)",
     "Permintaan tiap item independen dan bervariasi; service level tinggi menuntut safety "
     "stock besar, sejalan dengan investasi persediaan Amazon",
     "Inferensi"],
    ["Warehouse storage: item dengan rasio (jumlah trip / blok penyimpanan) tertinggi diletakkan "
     "paling dekat dock (Suplemen 11, hlm. 478)",
     "“Picking is sequenced to reduce operator travel”; robot membawa rak sehingga "
     "penempatan bisa diatur perangkat lunak",
     "Eksplisit (sequencing); inferensi (slotting)"],
], [(W) * 0.36, (W) * 0.46, (W) * 0.18]))
story.append(P(
    "<b>Analisis.</b> Dari daftar di atas terlihat bahwa profil Amazon di buku menekankan sisi "
    "<i>pengendalian</i> (akurasi catatan, kontrol barang keluar, aliran kerja), bukan sisi "
    "<i>model kuantitatif</i> (EOQ, ROP). Ini masuk akal: model berapa-dan-kapan hanya berguna "
    "jika angka stok yang menjadi masukannya benar. Urutan logisnya adalah akurasi dulu, model "
    "kemudian, dan kasus Amazon adalah contoh dari urutan itu."))

# =====================================================================
# BAGIAN F
# =====================================================================
story.append(P("BAGIAN F: PERKEMBANGAN SETELAH BUKU TERBIT (EKSPLORASI LANJUTAN)", H1))
story.append(P(
    "Profil di buku ditulis untuk edisi 2017. Sumber berikut berasal dari blog resmi para "
    "penulis buku (<i>The OM Blog by Heizer, Render &amp; Munson</i>), sehingga sejalan dengan "
    "rujukan kelas. Bagian ini dibatasi pada hal yang mengubah cara Amazon mengelola persediaan."))
story.append(table([
    ["Tahun / sumber", "Perkembangan", "Kaitan dengan kasus di buku"],
    ["2023 (OM Blog, 18 Nov 2023; video Wall Street Journal)",
     "Jaringan AS dibagi menjadi 8 wilayah dengan stok lengkap di tiap wilayah; lebih dari 76% "
     "permintaan dipenuhi dari dalam wilayahnya. Fasilitas <i>same-day</i> menyimpan 100.000 "
     "item terlaris per wilayah, dipilih dengan algoritme <i>machine learning</i>. Waktu rata-rata "
     "dari picking sampai paket berada di dock keluar: 11 menit.",
     "Melanjutkan langkah 1 di buku (alokasi ke DC) menjadi keputusan penempatan stok per "
     "wilayah. Angka 11 menit adalah versi baru dari “kurang dari 3 menit tenaga kerja per "
     "pesanan”, kini diukur sebagai waktu alir."],
    ["2025 (OM Blog, 7 Jul 2025)",
     "Lebih dari satu juta robot beroperasi; sekitar 75% pengiriman global melibatkan bantuan "
     "robot; paket terkirim per karyawan per tahun naik dari 175 menjadi 3.870 dalam satu dekade.",
     "Melanjutkan langkah 3 di buku (picking terotomasi). Rasio output per input inilah ukuran "
     "produktivitas yang dibahas di sesi pertama."],
], [3.6 * cm, (W - 3.6 * cm) * 0.5, (W - 3.6 * cm) * 0.5]))
story.append(P(
    "<b>Analisis.</b> Arah yang digambarkan buku tidak berubah: kecepatan dicapai lewat posisi "
    "stok yang mendekat ke pelanggan, dan akurasi serta biaya dicapai lewat otomasi. Yang berubah "
    "adalah alatnya (pembagian wilayah dan prediksi permintaan per wilayah). Ini juga menjawab "
    "pertanyaan pada Bagian E tentang ABC analysis: pemilihan 100.000 item terlaris per wilayah "
    "adalah keputusan berbasis Pareto."))


# =====================================================================
# BAGIAN G
# =====================================================================
story.append(P("BAGIAN G: LESSON LEARNED DAN BAHAN DISKUSI", H1))

story.append(P("G.1 Lesson learned", H2))
story += numbered([
    "<b>Persediaan dapat menjadi sumber keunggulan bersaing, dengan syarat dikelola presisi.</b> "
    "Amazon tidak unggul karena stoknya sedikit, tetapi karena stok besar itu diketahui "
    "lokasinya, diambil dengan benar, dan diproses cepat.",
    "<b>Akurasi catatan adalah prasyarat, bukan pelengkap.</b> Delapan langkah pemenuhan pesanan "
    "runtuh jika catatan stok per DC salah: pesanan akan dialokasikan ke gudang yang ternyata "
    "tidak punya barangnya.",
    "<b>Kecepatan dibangun dari dalam, bukan dibeli dari luar.</b> Waktu proses gudang dan posisi "
    "stok yang dekat pelanggan memungkinkan Amazon memakai moda kirim murah untuk 60% pesanan "
    "tanpa mengorbankan janji 1&#8211;2 hari.",
    "<b>Kesalahan dikendalikan di banyak titik karena biaya kesalahan lebih besar dari biaya "
    "kontrol.</b> Pemindaian 15 kali dan penimbangan adalah biaya kecil dibandingkan return. "
    "Keputusan ini tidak memerlukan pertimbangan trade-off karena kedua tujuan searah.",
    "<b>Otomasi dibenarkan oleh volume, bukan oleh teknologinya.</b> Penghematan US$0,70&#8211;1,50 "
    "per pesanan hanya berarti pada volume ratusan ribu pieces per hari. Perusahaan bervolume "
    "rendah harus menghitung ulang dengan aturan keputusan pada D.3.",
    "<b>Trade-off yang tersisa dipilih secara sadar.</b> Holding cost tinggi diterima karena "
    "dampak kekosongan stok pada ritel daring signifikan. Ini penerapan langsung aturan "
    "keputusan yang dibahas di kelas.",
    "<b>Tidak semua bagian diotomasi.</b> Pembungkusan kado tetap manual dengan standar 30 paket "
    "per jam. Otomasi dipilih untuk bagian bervolume tinggi dan bervariasi rendah, bukan untuk "
    "semua bagian.",
])

story.append(P("G.2 Jawaban ringkas atas pertanyaan pemandu (Bagian A)", H2))
story.append(table([
    ["Pertanyaan", "Jawaban ringkas"],
    ["Mengapa Amazon akhirnya mengelola persediaan sendiri?",
     "Karena target harga terendah, kirim tercepat, dan bebas kesalahan tidak dapat dijamin "
     "jika stok dan pemenuhan berada di tangan pihak ketiga (B.4)."],
    ["Bagaimana satu pesanan diproses?",
     "Delapan langkah: alokasi ke DC, penugasan oleh flow meister, picking, crate dan conveyor "
     "dengan pemindaian berulang, konsolidasi di chute, pembungkusan, pengemasan dan penimbangan, "
     "tiba dalam 1&#8211;2 hari (Bagian C)."],
    ["Di mana letak keunggulan kompetitifnya?",
     "Pada pengendalian: stok besar yang akurat lokasinya, proses berbiaya tenaga kerja rendah "
     "(&lt; 3 menit), dan kesalahan mendekati nol (D.1, D.2)."],
    ["Trade-off apa yang diambil?",
     "Holding cost tinggi demi service level; investasi otomasi demi biaya variabel rendah; "
     "moda kirim murah dengan kecepatan yang dibangun dari posisi stok (D.3, D.4)."],
    ["Apa lesson learned-nya?",
     "Tujuh butir pada G.1; inti: akurasi dulu, model kemudian; volume yang membenarkan otomasi."],
], [5.5 * cm, W - 5.5 * cm]))

story.append(P("G.3 Pertanyaan diskusi untuk kelas", H2))
story += numbered([
    "Amazon memindai satu item 15 kali. Pada titik mana penambahan pemindaian berhenti "
    "memberi manfaat, dan bagaimana cara menentukannya dengan membandingkan biaya kontrol "
    "terhadap biaya kesalahan?",
    "Jika perusahaan Anda memiliki volume 1/1000 dari Amazon, bagian mana dari delapan langkah "
    "yang tetap layak ditiru, dan bagian mana yang tidak? Gunakan aturan keputusan pada D.3.",
    "Amazon memilih service level tinggi dengan holding cost besar. Untuk produk seperti apa "
    "(nilai tinggi, permintaan jarang, cepat usang) keputusan itu berhenti masuk akal, meskipun "
    "di Amazon?",
    "Tiga dari empat kaitan konsep pada Bagian E berstatus inferensi. Data apa yang perlu "
    "diminta dari Amazon untuk memastikan apakah cycle counting dan ABC analysis benar "
    "diterapkan?",
])

story.append(P("G.4 Kesimpulan", H2))
story.append(P(
    "Kasus Amazon menunjukkan bahwa keputusan persediaan (berapa banyak, di mana, dan bagaimana "
    "mengendalikannya) adalah keputusan strategis yang diturunkan dari target kinerja, bukan "
    "keputusan administratif. Amazon menerima biaya persediaan yang besar karena target "
    "kecepatan dan ketersediaannya menuntut itu, lalu menekan semua biaya lain (tenaga kerja per "
    "pesanan, kesalahan, moda kirim) lewat akurasi catatan dan otomasi bervolume tinggi. Hasilnya "
    "adalah sistem yang, menurut buku, memenuhi pesanan dengan investasi tenaga kerja kurang dari "
    "3 menit dan kesalahan mendekati nol. Pelajaran yang dapat dibawa ke perusahaan lain bukan "
    "tingkat otomasinya, melainkan urutan berpikirnya: tetapkan target kinerja, pastikan akurasi "
    "catatan, hitung trade-off dengan aturan keputusan yang jelas, baru putuskan tingkat "
    "investasi persediaan dan teknologi."))

story.append(P("Daftar Rujukan", H2))
story += bullets([
    "Heizer, J., Render, B., &amp; Munson, C. (2017). <i>Operations Management: Sustainability "
    "and Supply Chain Management</i> (12th ed.). Pearson. Bab 12 (hlm. 487&#8211;514), Bab 9 "
    "(hlm. 376), Suplemen 11 (hlm. 477&#8211;479).",
    "Slack, N., Brandon-Jones, A., &amp; Burgess, N. (2022). <i>Operations Management</i> "
    "(10th ed.). Pearson. Bab 13.",
    "Heizer, J., Render, B., &amp; Munson, C. (2023, 18 November). Video Tip: Inside Amazon’s "
    "Strategy to Redefine Fast Shipping. <i>The OM Blog</i>. "
    "operationsmanagementblog.com/2023/11/18/video-tip-inside-amazons-strategy-to-redefine-fast-shipping/",
    "Heizer, J., Render, B., &amp; Munson, C. (2025, 7 Juli). OM in the News: Amazon Is on the Cusp "
    "of Using More Robots Than Humans. <i>The OM Blog</i>. operationsmanagementblog.com",
], SMALL)

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm,
                        topMargin=2.0 * cm, bottomMargin=2.0 * cm,
                        title="Studi Kasus 4: Inventory Management di Amazon.com",
                        author="Materi presentasi OTM Sesi 6")
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print("ditulis:", OUT)
