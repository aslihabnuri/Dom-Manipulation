"""Slides 1-18: cover, agenda, and the Chapter 4 framework (2024 ISE edition).

Content follows the book's own structure: SIX questions, with SWOT as Question 2
and resources/capabilities as Question 3. Slide text is kept short; the full
explanation for the presenter lives in the speaker notes.
"""

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from deck_lib import *

FOOT_A = "Chapter 4  ·  Evaluating a Company's Resources, Capabilities, and Competitiveness"


def s01_cover(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    rect(s, SW - 4.55, 0, 4.55, SH, fill=RGBColor(0x22, 0x1C, 0x1A))
    rect(s, SW - 4.55, 0, 0.012, SH, fill=RGBColor(0x3A, 0x31, 0x2D))

    txt(s, "Strategic Management", 1.05, 1.02, 6.6, 0.30, size=11.5,
        color=RED, bold=True, caps=True, spacing=1.0)
    txt(s, "Evaluating a Company's\nResources, Capabilities,\nand Competitiveness",
        1.05, 1.52, 7.2, 2.70, size=38, color=WHITE, bold=True, spacing=0.96)
    rect(s, 1.05, 4.36, 1.5, 0.035, fill=RED)

    b = txt(s, "Chapter 4", 1.05, 4.62, 7.0, 0.92, size=15, color=WHITE, bold=True)
    para(b, "Thompson · Peteraf · Gamble · Strickland", size=13,
         color=RGBColor(0xA8, 0x9F, 0x99), space_before=3)
    para(b, "Crafting & Executing Strategy — 2024 Release ISE", size=12,
         color=RGBColor(0x8C, 0x83, 0x7E), italic=True, space_before=2)

    box = txt(s, "Studi Kasus", 1.05, 5.76, 7.0, 0.84, size=10, color=RED,
              bold=True, caps=True)
    para(box, "Manchester United: Preparing for Life without Ferguson",
         size=14.5, color=WHITE, bold=True, space_before=5)
    para(box, "Robert M. Grant (2010)  ·  setting Juli 2009", size=11.5,
         color=RGBColor(0x8C, 0x83, 0x7E), space_before=2)

    x = SW - 4.55 + 0.62
    txt(s, "Dosen Pengampu", x, 1.18, 3.4, 0.26, size=10,
        color=RGBColor(0x8C, 0x83, 0x7E), bold=True, caps=True)
    txt(s, "Dr. Rangga Almahendra, S.T., M.M.", x, 1.50, 3.4, 0.62, size=14.5,
        color=WHITE, bold=True, spacing=1.12)
    rect(s, x, 2.42, 3.3, 0.012, fill=RGBColor(0x3A, 0x31, 0x2D))
    txt(s, "Kelompok 4", x, 2.70, 3.4, 0.26, size=10,
        color=RGBColor(0x8C, 0x83, 0x7E), bold=True, caps=True)
    y = 3.06
    for i, m in enumerate(["Fitra Aidila", "Aulia Sisca Rahmadiyanti", "Bagaskoro",
                           "Imam Prayudha", "Tegar Awanto"]):
        txt(s, str(i + 1), x, y, 0.3, 0.30, size=11, color=RED, bold=True)
        txt(s, m, x + 0.34, y, 3.0, 0.30, size=13.5, color=WHITE, spacing=1.0)
        y += 0.44
    notes(s, "Pembuka. Sebutkan: hari ini kita bahas Chapter 4, yaitu cara menilai "
             "kekuatan sebuah perusahaan DARI DALAM. Chapter 3 kemarin menilai dari "
             "luar (industri dan pesaing); Chapter 4 menilai isi perusahaannya sendiri.\n\n"
             "Lalu kita pakai kerangka itu untuk membedah satu kasus nyata: Manchester "
             "United pada Juli 2009, saat klub itu harus menyiapkan pengganti Sir Alex "
             "Ferguson.")
    return s


def s02_agenda(d):
    s = d.blank()
    y = d.head(s, "Alur Presentasi", "Agenda",
               "Kami bahas teorinya dulu sampai tuntas, baru masuk ke kasus. "
               "Setiap bagian teori punya slide pasangannya di bagian kasus.",
               sublines=1)

    cards = [("A", "Kerangka Chapter 4", "Slide 3 – 18",
              ["Enam pertanyaan evaluasi internal", "Rasio keuangan (Tabel 4.1)",
               "SWOT dan tangga competence", "Resource, capability, uji VRIN",
               "Value chain dan benchmarking",
               "Matriks kekuatan kompetitif"], RED),
             ("B", "Penerapan: Manchester United", "Slide 19 – 31",
              ["Profil kasus dan industrinya", "Q1: kinerja lapangan dan keuangan",
               "Q2: SWOT klub", "Q3: resource, capability, VRIN",
               "Q4: rantai nilai dan biaya", "Q5 & Q6: matriks dan rekomendasi"], INK)]
    w = (CW - 0.45) / 2
    x = ML
    for letter, title, rng, items, col in cards:
        rect(s, x, y, w, 3.70, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.055, fill=col)
        txt(s, letter, x + 0.34, y + 0.28, 0.7, 0.75, size=44, color=col,
            bold=True, font=S_FONT, spacing=0.9)
        txt(s, title, x + 1.08, y + 0.38, w - 1.4, 0.40, size=17, color=INK, bold=True)
        txt(s, rng, x + 1.08, y + 0.74, w - 1.4, 0.30, size=11, color=MUTED, caps=True)
        rect(s, x + 0.34, y + 1.24, w - 0.68, 0.012, fill=RULE)
        bullets(s, items, x + 0.34, y + 1.46, w - 0.68, 2.1, size=12.5,
                color=INK_SOFT, gap=8, marker="·", marker_color=col)
        x += w + 0.45
    notes(s, "Jelaskan pembagiannya: separuh pertama teori, separuh kedua praktik. "
             "Tekankan bahwa urutannya sengaja sama, supaya audiens bisa melihat "
             "framework mana dipakai untuk menjawab apa.\n\n"
             "Kalau waktu mepet, bagian A bisa dipercepat di slide 5, 14 dan 15.")
    d.footer(s, FOOT_A)
    return s


def s03_divider_a(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    txt(s, "Bagian A", 1.15, 0.98, 5.0, 0.30, size=11.5, color=RED, bold=True, caps=True)
    txt(s, "Enam\nPertanyaan", 1.15, 1.34, 5.6, 2.0, size=42, color=WHITE,
        bold=True, spacing=0.94)
    txt(s, "Chapter 4 bukan kumpulan alat yang berdiri sendiri. Isinya satu alur "
           "pemeriksaan, disusun sebagai enam pertanyaan berurutan. Jawaban "
           "pertanyaan sebelumnya jadi bahan pertanyaan berikutnya.",
        1.15, 3.50, 5.3, 1.60, size=13.5, color=RGBColor(0xA8, 0x9F, 0x99), spacing=1.30)
    txt(s, "Sumber: Thompson, Peteraf, Gamble & Strickland, "
           "Crafting & Executing Strategy, 2024 Release ISE, Chapter 4.",
        1.15, 5.30, 5.3, 0.6, size=10.5, color=RGBColor(0x6B, 0x62, 0x5D), spacing=1.20)

    qs = [("1", "Seberapa baik strategi yang sekarang bekerja?", "Indikator kinerja + Tabel 4.1"),
          ("2", "Apa kekuatan dan kelemahan kita, dihadapkan pada peluang dan ancaman?", "SWOT"),
          ("3", "Resource dan capability apa yang paling penting, dan apakah tahan lama?", "Tabel 4.3 + uji VRIN"),
          ("4", "Bagaimana aktivitas rantai nilai memengaruhi biaya dan nilai pelanggan?", "Value chain + benchmarking"),
          ("5", "Kita lebih kuat atau lebih lemah dari pesaing utama?", "Matriks kekuatan (Tabel 4.4)"),
          ("6", "Isu strategis apa yang harus ditangani lebih dulu?", "Priority list")]
    x0, y = 7.05, 0.92
    for num, q, tool in qs:
        rect(s, x0, y, 5.55, 0.90, fill=RGBColor(0x22, 0x1C, 0x1A))
        rect(s, x0, y, 0.045, 0.90, fill=RED)
        txt(s, num, x0 + 0.28, y + 0.18, 0.5, 0.54, size=24, color=RED,
            bold=True, font=S_FONT)
        txt(s, q, x0 + 0.82, y + 0.12, 4.55, 0.46, size=12.5, color=WHITE,
            bold=True, spacing=1.06)
        txt(s, tool, x0 + 0.82, y + 0.58, 4.55, 0.26, size=10, color=RGBColor(0x8C, 0x83, 0x7E))
        y += 0.98
    notes(s, "Ini peta jalan seluruh bagian A. Bacakan keenam pertanyaannya sekali, "
             "pelan, supaya audiens punya kerangka.\n\n"
             "Poin yang perlu ditekankan: urutannya bukan acak. Q1 mengukur HASIL. "
             "Q2 sampai Q4 mencari SEBABNYA di dalam perusahaan. Q5 membandingkan "
             "dengan pesaing. Q6 memutuskan apa yang harus dikerjakan lebih dulu.\n\n"
             "Catatan: banyak edisi lama buku ini hanya punya lima pertanyaan, dengan "
             "SWOT ditempel di dalam analisis resource. Edisi 2024 memisahkannya "
             "menjadi Q2 tersendiri.")
    return s


def s04_q1(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1", "Seberapa baik strategi yang sekarang bekerja?",
               "Sebelum menilai, pahami dulu strateginya seperti apa (Figure 4.1). "
               "Baru sesudah itu diukur hasilnya.", sublines=1)

    cards = [("01", "Apakah kekuatan keuangan dan\nlabanya membaik?",
              "Lihat trennya, bukan angka satu tahun. Penjualan, laba, dan "
              "kesehatan keuangan yang terus naik adalah tanda strateginya jalan."),
             ("02", "Apakah posisi dan kekuatan\nbersaingnya membaik?",
              "Untung saja belum cukup. Kalau posisi di pasar tergerus sementara "
              "pesaing menguat, strateginya tetap bermasalah.")]
    w = (CW - 0.42) / 2
    for i, (num, head, body) in enumerate(cards):
        x = ML + i * (w + 0.42)
        rect(s, x, y, w, 1.94, fill=PAPER, line=RULE)
        rect(s, x, y, 0.05, 1.94, fill=RED)
        txt(s, num, x + 0.32, y + 0.20, 0.8, 0.30, size=13, color=RED,
            bold=True, font=S_FONT)
        txt(s, head, x + 0.32, y + 0.54, w - 0.66, 0.62, size=15, color=INK,
            bold=True, spacing=1.08)
        txt(s, body, x + 0.32, y + 1.18, w - 0.66, 0.72, size=12, color=INK_SOFT,
            spacing=1.18)

    y2 = y + 2.14
    txt(s, "Enam indikator yang dipantau", ML, y2, CW, 0.28, size=11,
        color=RED, bold=True, caps=True)
    items = ["Tren penjualan dan pertumbuhan laba",
             "Tren harga saham",
             "Kekuatan keuangan secara keseluruhan",
             "Tingkat pelanggan yang bertahan",
             "Kecepatan mendapat pelanggan baru",
             "Perbaikan proses internal: cacat, waktu kirim, produktivitas"]
    col_w = (CW - 0.5) / 2
    for i, it in enumerate(items):
        cx = ML + (i % 2) * (col_w + 0.5)
        cy = y2 + 0.42 + (i // 2) * 0.38
        rect(s, cx, cy + 0.09, 0.10, 0.10, fill=RED)
        txt(s, it, cx + 0.26, cy, col_w - 0.3, 0.30, size=12, color=INK, spacing=1.0)

    note(s, [("Aturannya sederhana: ", True, RED_DEEP),
             ("makin kuat kinerja sekarang, makin kecil kebutuhan mengubah strategi. "
              "Makin lemah kinerjanya, makin besar kemungkinan strateginya memang salah, "
              "eksekusinya buruk, atau dua-duanya.", False, INK)])
    notes(s, "Mulai dengan: sebelum menilai strategi, kita harus tahu dulu strateginya "
             "apa. Buku menampilkan Figure 4.1 yang memetakan komponen strategi sebuah "
             "perusahaan bisnis tunggal: langkah bersaing, strategi fungsional (R&D, "
             "produksi, pemasaran, keuangan, SDM, IT), aliansi, cakupan geografis.\n\n"
             "Setelah itu baru diukur. Buku menyebut DUA indikator terbaik:\n"
             "(1) apakah perusahaan mencatat kenaikan kekuatan keuangan dan profitabilitas;\n"
             "(2) apakah kekuatan bersaing dan posisi pasarnya membaik.\n\n"
             "Enam indikator spesifik di slide ini diambil persis dari daftar buku. "
             "Perhatikan dua yang sering dilupakan: tingkat retensi pelanggan dan "
             "kecepatan akuisisi pelanggan baru. Keduanya sinyal awal, muncul sebelum "
             "angka laba berubah.\n\n"
             "Kalimat kunci buku: kinerja keuangan yang lesu dan pencapaian pasar yang "
             "biasa-biasa saja hampir selalu menandakan strategi lemah, eksekusi lemah, "
             "atau keduanya.")
    d.footer(s, FOOT_A)
    return s


def s05_ratios(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Tabel 4.1", "Rasio keuangan: alat ukurnya",
               "Penilaian tadi perlu bukti angka. Buku mengelompokkan rasio ke dalam "
               "empat kategori, plus satu kelompok ukuran tambahan.", sublines=1)

    groups = [("Profitabilitas", "Seberapa besar laba yang dihasilkan",
               ["Gross profit margin", "Operating profit margin", "Net profit margin",
                "Total return on assets", "Net return on assets (ROA)",
                "Return on equity (ROE)", "Return on invested capital"]),
              ("Likuiditas", "Sanggup bayar kewajiban jangka pendek?",
               ["Current ratio", "Working capital"]),
              ("Leverage", "Seberapa berat beban utangnya",
               ["Total debt-to-assets", "Long-term debt-to-capital",
                "Debt-to-equity", "Long-term debt-to-equity",
                "Times-interest-earned"]),
              ("Aktivitas", "Seberapa efisien aset dikelola",
               ["Days of inventory", "Inventory turnover", "Average collection period"])]
    w = (CW - 3 * 0.30) / 4
    x = ML
    for name, desc, rs in groups:
        rect(s, x, y, w, 3.50, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.50, fill=INK)
        txt(s, name, x + 0.20, y + 0.13, w - 0.4, 0.30, size=13, color=WHITE, bold=True)
        txt(s, desc, x + 0.20, y + 0.64, w - 0.4, 0.62, size=11, color=MUTED, spacing=1.14)
        yy = y + 1.38
        for r in rs:
            rect(s, x + 0.20, yy + 0.075, 0.07, 0.07, fill=RED)
            txt(s, r, x + 0.38, yy, w - 0.58, 0.26, size=11, color=INK, spacing=1.04)
            yy += 0.30
        x += w + 0.30

    note(s, [("Ukuran tambahan: ", True, RED_DEEP),
             ("dividend yield, price-to-earnings ratio, dividend payout ratio, internal "
              "cash flow, dan ", False, INK), ("free cash flow", True, INK),
             (" — yang terakhir paling penting, karena menunjukkan sisa kas untuk "
              "membiayai langkah strategis baru.", False, INK)])
    notes(s, "Jangan bacakan semua rasio satu per satu; audiens akan bosan. Cukup "
             "jelaskan logika keempat kelompoknya:\n\n"
             "PROFITABILITAS menjawab: apakah bisnisnya menghasilkan uang?\n"
             "LIKUIDITAS menjawab: apakah bisa bayar tagihan bulan depan?\n"
             "LEVERAGE menjawab: seberapa banyak yang dibiayai utang, dan seberapa "
             "berisiko itu?\n"
             "AKTIVITAS menjawab: apakah aset dipakai efisien?\n\n"
             "Beberapa patokan dari buku yang enak dikutip:\n"
             "- ROE 12–15% itu rata-rata.\n"
             "- Long-term debt-to-capital di bawah 0,25 bagus; di atas 0,50 berarti "
             "terlalu bergantung pada utang jangka panjang.\n"
             "- Times-interest-earned minimal 2,0; di atas 3,0 baru dianggap sehat.\n"
             "- P/E di atas 20 berarti investor percaya prospeknya; di bawah 12 berarti "
             "laba masa depan dianggap berisiko.\n\n"
             "Tekankan free cash flow: laba setelah pajak + depresiasi − belanja "
             "modal − dividen. Itu uang yang benar-benar bebas dipakai.")
    d.footer(s, FOOT_A)
    return s


def s06_swot_intro(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2", "SWOT: kenapa strateginya berhasil atau gagal",
               "Q1 memberi tahu apakah strategi bekerja, tapi tidak kenapa. SWOT "
               "adalah alat paling sederhana untuk mencari sebabnya.",
               sublines=1)

    quad = [("S", "Strengths", "Yang perusahaan kuasai atau miliki, yang membuatnya "
             "lebih mampu bersaing", RED),
            ("W", "Weaknesses", "Yang tidak dimiliki atau dikerjakan kurang baik "
             "dibanding pesaing", RED),
            ("O", "Opportunities", "Peluang pasar: apa yang bisa diambil dari luar", INK),
            ("T", "Threats", "Ancaman dari luar yang bisa menggerus laba dan posisi", INK)]
    gw, gh = (CW * 0.56 - 0.26) / 2, 1.34
    for i, (L, nm, body, col) in enumerate(quad):
        x = ML + (i % 2) * (gw + 0.26)
        yy = y + (i // 2) * (gh + 0.24)
        rect(s, x, yy, gw, gh, fill=PAPER, line=RULE)
        rect(s, x, yy, gw, 0.05, fill=col)
        txt(s, L, x + 0.24, yy + 0.20, 0.4, 0.40, size=20, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.66, yy + 0.24, gw - 0.9, 0.30, size=13.5, color=INK, bold=True)
        txt(s, body, x + 0.24, yy + 0.66, gw - 0.48, 0.58, size=11, color=INK_SOFT,
            spacing=1.14)

    x2 = ML + CW * 0.56 + 0.40
    w2 = CW - CW * 0.56 - 0.40
    txt(s, "Cara membacanya", x2, y - 0.04, w2, 0.28, size=11, color=RED,
        bold=True, caps=True)
    qs = [("Nama lain SWOT", "Situational Analysis — analisis situasi."),
          ("Neraca strategis", "Kekuatan = aset bersaing. Kelemahan = kewajiban bersaing. "
           "Idealnya asetnya jauh lebih berat."),
          ("Empat pertanyaan pemandu",
           "Apakah kekuatan cukup menutup kelemahan? Apakah strategi sudah bertumpu "
           "pada kekuatan itu? Apakah kekuatan kita melampaui pesaing? Apakah strategi "
           "berhasil menangkal ancaman?")]
    yy = y + 0.34
    for nm, body in qs:
        rect(s, x2, yy, w2, 1.06, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 1.06, fill=RED)
        txt(s, nm, x2 + 0.24, yy + 0.12, w2 - 0.48, 0.26, size=12, color=INK, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.40, w2 - 0.48, 0.60, size=11, color=INK_SOFT,
            spacing=1.10)
        yy += 1.16

    note(s, [("Kenapa SWOT populer: ", True, RED_DEEP),
             ("mudah dipakai, dan bisa dipakai dua arah — untuk menilai strategi "
              "yang sedang berjalan, dan untuk menyusun strategi baru dari nol. "
              "Dipakai perusahaan besar sampai sekolah dan lembaga nirlaba.", False, INK)])
    notes(s, "Sambungkan dari slide sebelumnya: angka keuangan memberi tahu APAKAH "
             "strategi bekerja, tapi tidak memberi tahu KENAPA. Di situlah SWOT masuk.\n\n"
             "Definisi buku: SWOT adalah singkatan dari kekuatan dan kelemahan internal, "
             "peluang pasar, dan ancaman eksternal. Nama lainnya Situational Analysis.\n\n"
             "Empat pertanyaan pemandu yang dikutip di kolom kanan itu langsung dari "
             "buku, dan itulah yang membedakan SWOT yang bagus dari sekadar daftar:\n"
             "- Apakah kekuatan perusahaan cukup besar untuk menutup kelemahannya?\n"
             "- Apakah strateginya sudah dibangun di atas kekuatan itu dan melindungi "
             "dari kelemahannya?\n"
             "- Apakah kekuatannya melampaui kekuatan pesaing, atau justru kalah?\n"
             "- Apakah strateginya efektif menangkal ancaman dan menangkap peluang?\n\n"
             "Istilah 'neraca strategis' juga dari buku: kekuatan itu aset bersaing, "
             "kelemahan itu kewajiban bersaing. Kondisi ideal adalah asetnya jauh lebih "
             "berat dari kewajibannya.")
    d.footer(s, FOOT_A)
    return s


def s07_competence(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Konsep Inti", "Tangga kemampuan: dari bisa, jadi unggul",
               "Buku memakai tiga tingkatan yang berbeda. Jangan disamakan — hanya "
               "tingkat ketiga yang benar-benar berharga.",
               sublines=1)

    steps = [("1", "Competence", "Aktivitas yang sudah dikuasai perusahaan, "
              "dikerjakan konsisten baik dan dengan biaya wajar.",
              "Kemampuan biasa. Banyak perusahaan punya.", MUTED),
             ("2", "Distinctive competence", "Kemampuan yang membuat perusahaan "
              "mengerjakan aktivitas itu LEBIH BAIK dari pesaingnya.",
              "Sudah membedakan, tapi belum tentu inti strategi.", RED),
             ("3", "Core competence", "Aktivitas yang dikuasai dengan baik DAN "
              "berada di jantung strategi perusahaan.",
              "Paling berharga. Sering jadi mesin pertumbuhan.", RED_DEEP)]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for n, nm, body, tag, col in steps:
        rect(s, x, y, w, 2.46, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=col)
        txt(s, n, x + 0.26, y + 0.20, 0.5, 0.40, size=22, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.26, y + 0.66, w - 0.52, 0.32, size=15, color=INK, bold=True)
        txt(s, body, x + 0.26, y + 1.04, w - 0.52, 0.76, size=11.5, color=INK_SOFT,
            spacing=1.16)
        rect(s, x + 0.26, y + 1.86, w - 0.52, 0.012, fill=RULE)
        txt(s, tag, x + 0.26, y + 1.98, w - 0.52, 0.42, size=10.5, color=col,
            bold=True, spacing=1.06)
        x += w + 0.28

    y2 = y + 2.72
    ex = [("Procter & Gamble", "Core competence di manajemen merek — melahirkan "
           "Tide, Crest, Pampers, Olay, Febreze."),
          ("Nike", "Core competence di desain dan pemasaran sepatu serta apparel olahraga."),
          ("Kellogg", "Core competence di pengembangan, produksi, dan pemasaran sereal sarapan.")]
    txt(s, "Contoh dari buku", ML, y2, CW, 0.26, size=11, color=RED, bold=True, caps=True)
    w3 = (CW - 2 * 0.26) / 3
    x = ML
    for nm, body in ex:
        rect(s, x, y2 + 0.32, w3, 0.78, fill=TINT, line=RULE)
        txt(s, nm, x + 0.22, y2 + 0.42, w3 - 0.44, 0.24, size=11.5, color=RED, bold=True)
        txt(s, body, x + 0.22, y2 + 0.66, w3 - 0.44, 0.38, size=10.5, color=INK_SOFT,
            spacing=1.10)
        x += w3 + 0.26
    notes(s, "Ini konsep yang paling sering keliru dipakai mahasiswa, jadi pelan-pelan.\n\n"
             "COMPETENCE: perusahaan sudah belajar mengerjakan suatu aktivitas dengan "
             "cakap. Buku menyebut ini 'a true capability'. Contoh: hampir semua "
             "produsen sereal punya kemampuan pemasaran yang memadai.\n\n"
             "DISTINCTIVE COMPETENCE: kemampuan yang membuat perusahaan mengerjakan "
             "aktivitas itu lebih baik dari para pesaingnya. Kuncinya kata "
             "'lebih baik dari rival'.\n\n"
             "CORE COMPETENCE: aktivitas yang dikerjakan dengan cakap DAN berada di "
             "pusat strategi perusahaan, serta memberi kontribusi besar pada keberhasilan "
             "pasar dan profitabilitasnya. Biasanya juga distinctive.\n\n"
             "Kenapa ini penting: core competence sering bisa dipakai membuka pasar baru "
             "atau permintaan produk baru — jadi mesin pertumbuhan. Contoh P&G: "
             "kemampuan mengelola merek melahirkan portofolio produk pemimpin pasar yang "
             "terus bertambah.\n\n"
             "Kalau ditanya bedanya dengan capability di Q3 nanti: capability itu istilah "
             "umum (buku bilang capability dan competence itu sama). Distinctive dan core "
             "adalah dua tingkat di atasnya.")
    d.footer(s, FOOT_A)
    return s


def s08_swot_steps(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Figure 4.2", "SWOT bukan bikin empat daftar",
               "Nilai SWOT ada pada kesimpulan yang ditarik dari daftarnya, bukan pada "
               "daftarnya. Buku menggambarkannya sebagai tiga langkah.", sublines=1)

    steps = [("1", "Identifikasi", "Susun keempat daftar berdasarkan bukti, bukan opini. "
              "Tabel 4.2 di buku memberi contoh isi masing-masing.", RED),
             ("2", "Tarik kesimpulan", "Dua pertanyaan: apa sebab berhasil atau gagalnya "
              "strategi? Sisi mana dari situasi perusahaan yang menarik, sisi mana "
              "yang tidak?", RED),
             ("3", "Terjemahkan jadi tindakan", "Ubah kesimpulan itu menjadi langkah "
              "strategis yang konkret.", INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for n, nm, body, col in steps:
        rect(s, x, y, w, 1.82, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=col)
        txt(s, n, x + 0.26, y + 0.18, 0.4, 0.40, size=22, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.26, y + 0.62, w - 0.52, 0.30, size=14, color=INK, bold=True)
        txt(s, body, x + 0.26, y + 0.98, w - 0.52, 0.78, size=11, color=INK_SOFT,
            spacing=1.14)
        x += w + 0.26

    y2 = y + 2.08
    txt(s, "Enam tindakan yang bisa lahir dari langkah 3", ML, y2, CW, 0.26, size=11,
        color=RED, bold=True, caps=True)
    acts = ["Jadikan kekuatan sebagai fondasi strategi",
            "Perbaiki kelemahan yang menghambat strategi",
            "Pakai kekuatan untuk meredam ancaman besar",
            "Kejar peluang yang paling cocok dengan kekuatan",
            "Benahi kelemahan yang menghalangi peluang penting",
            "Tutup kelemahan yang membuat rentan pada ancaman"]
    col_w = (CW - 0.5) / 2
    for i, a in enumerate(acts):
        cx = ML + (i % 2) * (col_w + 0.5)
        cy = y2 + 0.40 + (i // 2) * 0.38
        rect(s, cx, cy + 0.09, 0.10, 0.10, fill=RED)
        txt(s, a, cx + 0.26, cy, col_w - 0.3, 0.30, size=12, color=INK, spacing=1.0)

    note(s, [("Keterbatasan SWOT, diakui bukunya sendiri: ", True, RED_DEEP),
             ("kekuatannya ada pada kesederhanaan, dan itu juga batasnya. Untuk "
              "pemahaman yang lebih dalam dibutuhkan alat yang lebih canggih — "
              "yaitu Q3 sampai Q5 berikutnya.", False, INK)])
    notes(s, "Poin utama slide ini: SWOT yang berhenti di empat daftar tidak "
             "menghasilkan keputusan apa pun. Kalimat buku: 'Simply listing a company's "
             "strengths, weaknesses, opportunities, and threats is not enough; the payoff "
             "comes from the conclusions and the implications for strategy improvement "
             "that flow from the four lists.'\n\n"
             "Enam tindakan di bawah itu persis isi kotak kanan Figure 4.2. Sebutkan "
             "dua-tiga saja saat presentasi, sisanya biar audiens baca.\n\n"
             "Tutup dengan pengakuan bukunya sendiri: keindahan SWOT adalah "
             "kesederhanaannya, tapi itu juga keterbatasan utamanya. Untuk analisis yang "
             "lebih dalam kita butuh alat berikutnya — dan itulah isi Q3 sampai Q5. "
             "Kalimat ini jembatan yang bagus ke slide berikutnya.")
    d.footer(s, FOOT_A)
    return s


def s09_resources(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3", "Resource dan capability: dua hal berbeda",
               "Resource itu sesuatu yang perusahaan PUNYA. Capability itu sesuatu "
               "yang perusahaan BISA KERJAKAN. Capability dibangun dengan "
               "mengerahkan resource.", sublines=2)

    defs = [("Resource", "Aset bersaing yang dimiliki atau dikendalikan perusahaan.",
             "Contoh: merek, pabrik, kas, paten, tim R&D.", RED),
            ("Capability", "Kemampuan perusahaan mengerjakan suatu aktivitas internal "
             "dengan baik. Disebut juga competence.",
             "Contoh: kemampuan Starbucks mengelola dan melatih karyawan.", INK)]
    w = (CW - 0.40) / 2
    for i, (name, body, ex, col) in enumerate(defs):
        x = ML + i * (w + 0.40)
        rect(s, x, y, w, 1.34, fill=PAPER, line=RULE)
        rect(s, x, y, 0.05, 1.34, fill=col)
        txt(s, name, x + 0.30, y + 0.14, w - 0.6, 0.30, size=16, color=col, bold=True)
        txt(s, body, x + 0.30, y + 0.50, w - 0.6, 0.48, size=12, color=INK, spacing=1.16)
        txt(s, ex, x + 0.30, y + 1.00, w - 0.6, 0.26, size=11, color=MUTED, italic=True)

    y2 = y + 1.56
    txt(s, "Tabel 4.3 — Tipe resource", ML, y2, CW, 0.26, size=11, color=RED,
        bold=True, caps=True)
    tang = [("Fisik", "tanah, pabrik, peralatan, lokasi, sumber daya alam"),
            ("Finansial", "kas, surat berharga, peringkat kredit"),
            ("Teknologi", "paten, hak cipta, teknologi produksi dan inovasi"),
            ("Organisasional", "sistem IT, sistem kendali, struktur organisasi")]
    intang = [("Human assets", "pendidikan, pengalaman, bakat, pengetahuan"),
              ("Merek & reputasi", "nama merek, citra, loyalitas, reputasi mutu"),
              ("Relasi", "aliansi, joint venture, jaringan dealer"),
              ("Budaya & insentif", "norma perilaku, keyakinan bersama, kompensasi")]
    for i, (label, rows, col) in enumerate([("Tangible — bisa disentuh atau dihitung", tang, INK),
                                            ("Intangible — tidak berwujud", intang, RED)]):
        x = ML + i * (w + 0.40)
        rect(s, x, y2 + 0.30, w, 2.10, fill=PAPER, line=RULE)
        rect(s, x, y2 + 0.30, w, 0.44, fill=col)
        txt(s, label, x + 0.22, y2 + 0.41, w - 0.44, 0.28, size=12, color=WHITE, bold=True)
        yy = y2 + 0.82
        for nm, ex in rows:
            txt(s, nm, x + 0.22, yy, 1.60, 0.26, size=11.5, color=col, bold=True)
            txt(s, ex, x + 1.90, yy, w - 2.14, 0.26, size=10.5, color=INK_SOFT, spacing=1.04)
            yy += 0.38
    notes(s, "Definisi persis dari buku:\n"
             "RESOURCE adalah aset bersaing yang dimiliki atau dikendalikan perusahaan.\n"
             "CAPABILITY adalah kapasitas perusahaan mengerjakan suatu aktivitas internal "
             "dengan cakap. Buku menyebut capability bisa juga disebut competence.\n\n"
             "Hubungannya: capability dibangun dan dijalankan lewat pengerahan resource. "
             "Contoh buku — kemampuan Nestlé mengelola lebih dari 2.000 merek "
             "bersandar pada pengetahuan manajer mereknya, keahlian departemen "
             "pemasarannya, dan relasinya dengan peritel di hampir 200 negara.\n\n"
             "Soal Tabel 4.3: human assets sengaja ditaruh di kolom INTANGIBLE, meski "
             "orangnya nyata, karena yang bernilai adalah keahlian dan pengetahuannya. "
             "Teknologi sebaliknya ditaruh di TANGIBLE menurut konvensi, walaupun "
             "beberapa jenis seperti rahasia dagang sebetulnya lebih cocok intangible.\n\n"
             "Pesan buku yang penting: yang penting bukan bagaimana sebuah resource "
             "dikategorikan, tapi bahwa tidak ada resource yang terlewat saat "
             "diinventarisasi. Kategori hanya alat bantu supaya tidak ada yang lolos.")
    d.footer(s, FOOT_A)
    return s


def s10_capabilities(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Lanjutan", "Cara menemukan capability perusahaan",
               "Capability lebih sulit ditemukan daripada resource, karena wujudnya "
               "tidak kelihatan. Buku memberi dua cara.", sublines=1)

    ways = [("Cara 1", "Berangkat dari daftar resource",
             "Lihat daftar resource, lalu tanya: kemampuan apa yang mungkin tumbuh "
             "dari sini? Armada truk dan pusat distribusi otomatis menandakan "
             "kemampuan logistik yang matang."),
            ("Cara 2", "Berangkat dari fungsi perusahaan",
             "Telusuri tiap fungsi. Injection molding dan metal stamping di produksi; "
             "direct selling dan database marketing di penjualan; riset dasar dan "
             "pengembangan produk baru di R&D.")]
    w = (CW - 0.40) / 2
    for i, (tag, nm, body) in enumerate(ways):
        x = ML + i * (w + 0.40)
        rect(s, x, y, w, 1.70, fill=PAPER, line=RULE)
        rect(s, x, y, 0.05, 1.70, fill=RED)
        txt(s, tag, x + 0.30, y + 0.16, 1.6, 0.26, size=11, color=RED, bold=True, caps=True)
        txt(s, nm, x + 0.30, y + 0.46, w - 0.6, 0.30, size=14.5, color=INK, bold=True)
        txt(s, body, x + 0.30, y + 0.84, w - 0.6, 0.76, size=11.5, color=INK_SOFT,
            spacing=1.16)

    y2 = y + 1.96
    rect(s, ML, y2, CW, 1.72, fill=INK)
    rect(s, ML, y2, 0.05, 1.72, fill=RED)
    txt(s, "Masalahnya: capability terpenting justru lintas fungsi", ML + 0.32, y2 + 0.20,
        CW - 0.64, 0.32, size=15, color=WHITE, bold=True)
    txt(s, "Cara 2 gagal menangkap kemampuan yang lahir dari kerja sama antarbagian. "
           "Kemampuan desain Warby Parker bukan cuma karena desainernya, tapi juga "
           "riset pasar, rekayasa, dan relasi dengan pemasok serta pabrik.",
        ML + 0.32, y2 + 0.60, CW - 0.64, 0.56, size=12, color=WHITE, spacing=1.18)
    b = txt(s, "", ML + 0.32, y2 + 1.20, CW - 0.64, 0.40, size=11.5)
    rich(b, [("Kumpulan aset bersaing yang saling terkait erat di sekitar satu atau "
              "beberapa kemampuan lintas fungsi disebut ", False, RGBColor(0xA8, 0x9F, 0x99)),
             ("resource bundle", True, RGBColor(0xFF, 0x8A, 0x7A)),
             (".", False, RGBColor(0xA8, 0x9F, 0x99))],
         size=11.5, first=True, spacing=1.16)

    note(s, [("Kenapa resource bundle penting: ", True, RED_DEEP),
             ("bundle bisa lolos uji VRIN meski komponen-komponennya sendiri tidak. "
              "Paket Nike — keahlian styling, riset pasar, endorsement atlet, nama "
              "merek, dan kecakapan manajerial — membuatnya nomor satu di sepatu "
              "olahraga lebih dari 20 tahun.", False, INK)])
    notes(s, "Kenapa capability lebih sulit ditemukan: buku bilang capability itu "
             "entitas yang lebih kompleks dari resource, dan hampir semuanya "
             "berbasis pengetahuan — tinggal di kepala orang, di modal intelektual "
             "perusahaan, atau di proses dan sistem organisasi.\n\n"
             "Contoh buku untuk cara 1: kemampuan pengiriman cepat Amazon bersandar pada "
             "pengetahuan manajer fulfillment center-nya, relasinya dengan UPS, dan "
             "pengalaman merchandiser-nya memprediksi arus persediaan.\n\n"
             "Kelemahan cara 2 (pendekatan fungsional) adalah yang paling penting "
             "diingat: banyak capability terpenting justru bersifat lintas fungsi, "
             "sehingga tidak akan ketemu kalau kita hanya melihat per departemen.\n\n"
             "Definisi resource bundle dari buku: 'a linked and closely integrated set of "
             "competitive assets centered around one or more cross-functional "
             "capabilities'.\n\n"
             "Contoh PetSmart yang bagus untuk dikutip: kemampuan rantai pasok dan "
             "pemasarannya diimbangi Petco, tapi PetSmart tetap unggul lewat kemampuan "
             "layanan pelanggannya — grooming, layanan dokter hewan, dan penitipan.")
    d.footer(s, FOOT_A)
    return s


def s11_vrin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Framework Inti", "Uji VRIN: empat saringan",
               "Punya resource saja belum berarti unggul. VRIN menguji apakah sebuah "
               "resource atau capability benar-benar memberi keunggulan, dan apakah "
               "keunggulan itu bisa bertahan.", sublines=2)

    tests = [("V", "Valuable", "Bernilai untuk bersaing?",
              "Harus langsung menopang strategi dan membuat perusahaan lebih efektif "
              "bersaing. Google Wallet gagal meski memakai resource teknologi yang "
              "membuat Google nomor satu di mesin pencari."),
             ("R", "Rare", "Langka, tidak dimiliki pesaing?",
              "Kalau semua pesaing punya, itu syarat ikut bermain, bukan pembeda. "
              "Semua produsen sereal punya kemampuan pemasaran; kekuatan merek Oreo "
              "tidak umum."),
             ("I", "Inimitable", "Sulit ditiru?",
              "Sulit ditiru kalau unik, harus dibangun bertahun-tahun, butuh biaya "
              "sangat besar, atau melibatkan social complexity dan causal ambiguity."),
             ("N", "Nonsubstitutable", "Tidak ada penggantinya?",
              "Pesaing bisa saja tidak meniru, tapi menemukan cara lain dengan hasil "
              "sama. Keunggulan otomasi bisa dibatalkan pesaing yang memakai tenaga "
              "kerja murah di luar negeri.")]
    w = (CW - 3 * 0.26) / 4
    x = ML
    for letter, name, q, body in tests:
        rect(s, x, y, w, 3.24, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.82, fill=RED if letter in ("V", "R") else INK)
        txt(s, letter, x, y + 0.12, w, 0.58, size=34, color=WHITE, bold=True,
            font=S_FONT, align=PP_ALIGN.CENTER)
        txt(s, name, x + 0.12, y + 0.96, w - 0.24, 0.30, size=13.5, color=INK,
            bold=True, align=PP_ALIGN.CENTER)
        txt(s, q, x + 0.12, y + 1.30, w - 0.24, 0.46, size=11, color=RED,
            align=PP_ALIGN.CENTER, spacing=1.10, italic=True)
        txt(s, body, x + 0.20, y + 1.84, w - 0.40, 1.32, size=11, color=INK_SOFT,
            spacing=1.16)
        x += w + 0.26

    half = (CW - 0.40) / 2
    note(s, [("V + R  →  ", True, RED),
             ("apakah resource bisa MENCIPTAKAN keunggulan bersaing.", False, INK)],
         width=half)
    note(s, [("I + N  →  ", True, RGBColor(0xFF, 0x8A, 0x7A)),
             ("apakah keunggulan itu BISA BERTAHAN menghadapi serangan pesaing.",
              False, WHITE)],
         dark=True, left=ML + half + 0.40, width=half)
    notes(s, "Nama lengkapnya di buku: 'the VRIN tests for sustainable competitive "
             "advantage'.\n\n"
             "Jelaskan pembagiannya dulu, baru satu per satu:\n"
             "Dua tes pertama (V dan R) menentukan apakah sesuatu bisa MENJADI sumber "
             "keunggulan. Dua tes terakhir (I dan N) menentukan apakah keunggulan itu "
             "BERTAHAN.\n\n"
             "Untuk tes I, dua istilah wajib dijelaskan:\n"
             "SOCIAL COMPLEXITY — keunggulan melekat pada hal sosial: budaya "
             "perusahaan, hubungan antarmanajer, kepercayaan dengan pelanggan atau "
             "pemasok. Tidak bisa dibeli.\n"
             "CAUSAL AMBIGUITY — sebab-akibatnya sendiri sulit diurai. Bahkan "
             "perusahaan pemiliknya tidak sepenuhnya tahu kenapa resource itu bekerja. "
             "Kalau sebabnya tidak jelas, pesaing tidak tahu apa yang harus ditiru.\n\n"
             "Tes N adalah yang paling sulit dinilai, kata buku, karena substitusi lebih "
             "sulit dikenali. Caranya: cari resource lain, di perusahaan mana pun, yang "
             "bisa menjalankan FUNGSI yang sama.\n\n"
             "Fakta penting untuk ditutup: sangat sedikit perusahaan punya resource yang "
             "lolos keempat tes. Kebanyakan hanya punya campuran — satu dua sangat "
             "berharga, beberapa bagus, banyak yang biasa saja. Contoh yang lolos "
             "keempatnya: Costco dan Lincoln Electric.")
    d.footer(s, FOOT_A)
    return s


def s12_dynamic(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Lanjutan", "Resource harus dikelola secara dinamis",
               "Lolos VRIN hari ini tidak berarti aman selamanya. Resource bisa "
               "menyusut nilainya kalau dibiarkan.", sublines=1)

    risks = [("Pesaing menyusul", "Yang awalnya tidak bisa meniru, lama-lama menemukan "
              "pengganti yang makin baik."),
             ("Aset menyusut sendiri", "Resource bisa terdepresiasi seperti aset lain "
              "kalau dibiarkan tanpa perhatian."),
             ("Pasar berubah", "Perubahan teknologi, selera pelanggan, atau jalur "
              "distribusi bisa mengubah aset strategis “dari berlian jadi karat”.")]
    wl = CW * 0.52
    yy = y
    for nm, body in risks:
        rect(s, ML, yy, wl, 0.86, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.86, fill=RED)
        txt(s, nm, ML + 0.28, yy + 0.12, wl - 0.56, 0.26, size=12.5, color=RED, bold=True)
        txt(s, body, ML + 0.28, yy + 0.40, wl - 0.56, 0.40, size=11, color=INK_SOFT,
            spacing=1.12)
        yy += 0.96

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    rect(s, x2, y, w2, 2.78, fill=INK)
    txt(s, "Dynamic Capability", x2 + 0.32, y + 0.26, w2 - 0.64, 0.34, size=17,
        color=WHITE, bold=True)
    rect(s, x2 + 0.32, y + 0.72, 1.2, 0.035, fill=RED)
    txt(s, "Kemampuan yang terus berjalan untuk memperbaiki, memperdalam, atau "
           "menambah resource dan capability yang sudah ada.",
        x2 + 0.32, y + 0.92, w2 - 0.64, 0.74, size=12.5, color=WHITE, spacing=1.20)
    txt(s, "Dua bentuknya:\n"
           "•  Memperbaiki yang ada sedikit demi sedikit — Toyota terus "
           "menyempurnakan mesin hibrida dan Toyota Production System.\n"
           "•  Menambah yang baru lewat aliansi atau akuisisi — GM bermitra "
           "dengan LG dan mendahului Tesla meluncurkan Chevy Bolt EV.",
        x2 + 0.32, y + 1.76, w2 - 0.64, 0.90, size=10.5,
        color=RGBColor(0xA8, 0x9F, 0x99), spacing=1.18)

    note(s, [("Inti dynamic capability: ", True, RED_DEEP),
             ("ketika kegiatan memperbarui aset dilakukan terus-menerus sampai menjadi "
              "rutinitas manajemen, kemampuan memperbarui itu sendiri berubah menjadi "
              "sebuah capability. Di titik itulah ia disebut dynamic capability.",
              False, INK)])
    notes(s, "Kalimat pembuka yang bagus: bahkan Costco dan Lincoln Electric — dua "
             "perusahaan yang lolos keempat tes VRIN — tidak boleh berpuas diri.\n\n"
             "Tiga risiko di kiri itu langsung dari buku. Frasa 'from diamonds to rust' "
             "layak dikutip: aset strategis bisa berubah dari berlian jadi karat kalau "
             "teknologi, selera pelanggan, atau jalur distribusi berubah.\n\n"
             "Tantangan manajemen menurut buku ada dua:\n"
             "(1) terus memodifikasi aset bersaing yang sudah ada;\n"
             "(2) waspada mencari peluang membangun jenis capability yang benar-benar baru.\n\n"
             "Definisi dynamic capability: kemampuan untuk memodifikasi, memperdalam, "
             "atau menambah resource dan capability perusahaan yang sudah ada.\n\n"
             "Contoh tambahan kalau ditanya: BMW mengembangkan kemampuan baru di desain "
             "mesin hibrida sehingga bisa meluncurkan i4 dan iX. Bristol-Myers Squibb "
             "dengan strategi akuisisi 'string of pearls' mengganti paten yang habis masa "
             "berlakunya dengan paten dan kemampuan baru.")
    d.footer(s, FOOT_A)
    return s


def s13_valuechain(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4 · Figure 4.3", "Rantai nilai perusahaan",
               "Setiap bisnis adalah kumpulan aktivitas. Rantai nilai memecah "
               "perusahaan menjadi aktivitas-aktivitas itu, supaya biaya dan nilai "
               "bisa dilacak satu per satu.", sublines=2)

    prim = [("Supply Chain\nManagement", "Membeli, menerima, menyimpan, dan menyalurkan input"),
            ("Operations", "Mengubah input jadi produk jadi"),
            ("Distribution", "Menyimpan dan mengirim ke pembeli"),
            ("Sales &\nMarketing", "Tenaga jual, iklan, promosi, dukungan dealer"),
            ("Service", "Pemasangan, perbaikan, suku cadang, layanan pelanggan")]
    w = (CW - 4 * 0.16 - 1.55) / 5
    txt(s, "Primary Activities — aktivitas utama pencipta nilai", ML, y, CW, 0.26,
        size=11, color=RED, bold=True, caps=True)
    x = ML
    for nm, body in prim:
        rect(s, x, y + 0.32, w, 1.62, fill=PAPER, line=RULE)
        rect(s, x, y + 0.32, w, 0.05, fill=RED)
        txt(s, nm, x + 0.16, y + 0.48, w - 0.32, 0.54, size=12, color=INK,
            bold=True, spacing=1.06)
        txt(s, body, x + 0.16, y + 1.08, w - 0.32, 0.78, size=10, color=INK_SOFT,
            spacing=1.12)
        x += w + 0.16
    rect(s, x, y + 0.32, 1.55, 1.62, fill=INK)
    txt(s, "Profit\nMargin", x + 0.14, y + 0.72, 1.27, 0.60, size=13, color=WHITE,
        bold=True, align=PP_ALIGN.CENTER, spacing=1.06)
    txt(s, "P − C", x + 0.14, y + 1.42, 1.27, 0.30, size=13,
        color=RGBColor(0xFF, 0x8A, 0x7A), bold=True, align=PP_ALIGN.CENTER, font=S_FONT)

    sup = [("Product R&D, Technology &\nSystems Development", "Riset produk dan proses, desain, otomasi"),
           ("Human Resource Management", "Rekrutmen, pelatihan, kompensasi"),
           ("General Administration", "Akuntansi, keuangan, hukum, sistem informasi")]
    y2 = y + 2.16
    txt(s, "Support Activities — aktivitas pendukung", ML, y2, CW, 0.26, size=11,
        color=INK, bold=True, caps=True)
    w3 = (CW - 2 * 0.22) / 3
    x = ML
    for nm, body in sup:
        rect(s, x, y2 + 0.32, w3, 1.06, fill=TINT, line=RULE)
        rect(s, x, y2 + 0.32, 0.05, 1.06, fill=INK)
        txt(s, nm, x + 0.26, y2 + 0.44, w3 - 0.5, 0.46, size=11.5, color=INK, bold=True,
            spacing=1.04)
        txt(s, body, x + 0.26, y2 + 0.94, w3 - 0.5, 0.34, size=10.5, color=INK_SOFT,
            spacing=1.12)
        x += w3 + 0.22

    note(s, [("Tiga selisih yang harus dibedakan. ", True, RED_DEEP),
             ("V − P = nilai yang diterima pelanggan (customer value proposition). "
              "P − C = margin laba perusahaan. V − C = ", False, INK),
             ("Total Economic Value", True, INK),
             (", yaitu seluruh nilai ekonomi yang diciptakan perusahaan.", False, INK)])
    notes(s, "Definisi buku: rantai nilai adalah seluruh aktivitas yang dikerjakan "
             "perusahaan secara internal, yang digabungkan menciptakan nilai bagi pembeli.\n\n"
             "Penting disampaikan: daftar aktivitas di Figure 4.3 itu ILUSTRATIF, bukan "
             "baku. Isinya berbeda-beda per industri. Contoh dari buku:\n"
             "- Peritel seperti Nordstrom: pemilihan barang, tata letak toko, iklan, "
             "layanan pelanggan.\n"
             "- Operator hotel seperti Marriott: reservasi dan operasi hotel.\n"
             "- Supply chain management krusial bagi Boeing dan Amazon, tapi bukan "
             "komponen rantai nilai di Goldman Sachs atau WhatsApp.\n"
             "- Pengiriman ke pelanggan krusial bagi Domino's, tidak penting bagi Starbucks.\n\n"
             "Tiga selisih di bawah adalah bagian yang paling sering tertukar:\n"
             "V − P: nilai yang dirasakan pembeli dikurangi harga yang ia bayar. "
             "Ini customer value proposition.\n"
             "P − C: harga dikurangi biaya perusahaan. Ini margin laba, dan buku "
             "menekankan margin harus ikut dilacak — tanpa laba yang cukup, "
             "perusahaan tidak bisa bertahan lama walau nilainya bagus.\n"
             "V − C: Total Economic Value, seluruh nilai ekonomi yang tercipta.\n\n"
             "Illustration Capsule 4.1 di buku memberi contoh nyata: rincian biaya tiap "
             "aktivitas rantai nilai di Everlane Inc., peritel pakaian online Amerika.")
    d.footer(s, FOOT_A)
    return s


def s14_system(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4 \u00b7 Figure 4.4", "Rantai nilai sistem dan benchmarking",
               "Biaya dan mutu yang sampai ke pembeli tidak hanya ditentukan perusahaan "
               "sendiri, tapi oleh seluruh rantai dari pemasok sampai penjual akhir.",
               sublines=2)

    chain = [("Rantai nilai\nPEMASOK", "Biaya dan mutu input yang masuk", MUTED),
             ("Rantai nilai\nPERUSAHAAN", "Aktivitas internal sendiri", RED),
             ("Rantai nilai\nMITRA HILIR", "Distributor, dealer, mitra strategis", MUTED),
             ("PEMBELI /\nPENGGUNA AKHIR", "Nilai yang akhirnya dirasakan", INK)]
    w = (CW - 3 * 0.48) / 4
    x = ML
    for i, (nm, body, col) in enumerate(chain):
        rect(s, x, y, w, 1.10, fill=RED_TINT if col is RED else PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=col)
        txt(s, nm, x + 0.16, y + 0.18, w - 0.32, 0.50, size=12.5,
            color=col if col is not MUTED else INK, bold=True,
            align=PP_ALIGN.CENTER, spacing=1.06)
        txt(s, body, x + 0.16, y + 0.72, w - 0.32, 0.32, size=10, color=INK_SOFT,
            align=PP_ALIGN.CENTER, spacing=1.08)
        if i < 3:
            txt(s, "\u2192", x + w + 0.04, y + 0.32, 0.40, 0.40, size=20, color=RED,
                bold=True, align=PP_ALIGN.CENTER)
        x += w + 0.48

    y2 = y + 1.34
    half = (CW - 0.40) / 2
    rect(s, ML, y2, half, 2.40, fill=PAPER, line=RULE)
    rect(s, ML, y2, half, 0.44, fill=INK)
    txt(s, "Benchmarking", ML + 0.24, y2 + 0.09, half - 0.5, 0.28, size=13,
        color=WHITE, bold=True)
    txt(s, "Membandingkan cara perusahaan lain mengerjakan aktivitas yang sama, lalu "
           "menirukan cara terbaiknya. Bisa dengan pesaing di industri yang sama, bisa "
           "juga dengan industri lain sama sekali.",
        ML + 0.24, y2 + 0.58, half - 0.5, 0.76, size=11.5, color=INK, spacing=1.16)
    b = txt(s, "", ML + 0.24, y2 + 1.40, half - 0.5, 0.86, size=11)
    rich(b, [("Best practice", True, RED),
             (" = cara mengerjakan suatu aktivitas yang terbukti konsisten memberi hasil "
              "lebih baik dibanding cara lain. Harus sudah dibuktikan minimal oleh satu "
              "perusahaan.", False, INK_SOFT)], size=11, first=True, spacing=1.14)

    x2 = ML + half + 0.40
    rect(s, x2, y2, half, 2.40, fill=PAPER, line=RULE)
    rect(s, x2, y2, half, 0.44, fill=RED)
    txt(s, "Tiga contoh yang terkenal", x2 + 0.24, y2 + 0.09, half - 0.5, 0.28,
        size=13, color=WHITE, bold=True)
    exs = [("Xerox", "Pelopornya. Tidak membatasi diri pada pesaing mesin kantor, tapi "
            "ke perusahaan mana pun yang kelas dunia."),
           ("Toyota", "Ide just-in-time datang dari mengamati cara supermarket Amerika "
            "mengisi ulang raknya."),
           ("Southwest Airlines", "Memangkas waktu parkir pesawat dengan mempelajari "
            "kru pit balap mobil.")]
    yy = y2 + 0.58
    for nm, body in exs:
        txt(s, nm, x2 + 0.24, yy, half - 0.5, 0.24, size=11.5, color=RED, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.24, half - 0.5, 0.40, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.62

    txt(s, "Bagian sulit benchmarking bukan memutuskan melakukannya, tapi mendapat "
           "datanya. Sumber yang sah: laporan publik, asosiasi dagang, firma riset, "
           "kunjungan lapangan, dan konsultan pihak ketiga yang mengumpulkan data "
           "secara anonim \u2014 bukan pengumpulan intelijen yang melanggar hukum.",
        ML, y2 + 2.54, CW, 0.40, size=10, color=MUTED, italic=True, spacing=1.16)
    notes(s, "Rantai nilai sistem kadang disebut juga vertical chain.\n\n"
             "Kenapa rantai pemasok penting: biaya, mutu, dan fitur input yang mereka "
             "kirim langsung memengaruhi biaya dan kemampuan diferensiasi kita. Contoh "
             "buku \u2014 produsen mobil mendorong pemasok komponen membangun pabrik "
             "dekat pabrik perakitan supaya pengiriman just-in-time lancar dan biaya "
             "gudang turun. Contoh lain: perusahaan irigasi, pemasok alat panen anggur, "
             "dan pembuat tong, botol, tutup dan label semuanya berlokasi di wilayah "
             "anggur California, dekat 4.400 kilang yang mereka layani.\n\n"
             "Kenapa rantai hilir penting: (1) biaya dan margin distributor ikut masuk ke "
             "harga yang dibayar konsumen akhir; (2) mutu kerja mereka memengaruhi volume "
             "penjualan dan kepuasan pelanggan.\n\n"
             "Angka yang enak dikutip: lebih dari 80 persen perusahaan Fortune 500 "
             "dilaporkan memakai benchmarking.\n\n"
             "Buku punya dua Illustration Capsule di bagian ini \u2014 4.2 tentang "
             "benchmarking di industri tenaga surya, yang memakai ukuran Levelized Cost "
             "of Energy, dan 4.3 khusus tentang etika benchmarking.")
    d.footer(s, FOOT_A)
    return s


def s15_cost_options(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4 · Tindakan", "Kalau biaya atau nilainya kalah, apa yang dilakukan",
               "Analisis rantai nilai dan benchmarking bisa menunjukkan kita kalah "
               "biaya atau kalah nilai. Buku menunjuk tiga area perbaikan.", sublines=1)

    cols = [("1. Aktivitas internal sendiri",
             ["Terapkan best practice, terutama di aktivitas mahal",
              "Hapus aktivitas yang tidak perlu dengan merombak rantai nilai",
              "Pindahkan aktivitas mahal ke wilayah berbiaya lebih rendah",
              "Serahkan ke pihak luar jika mereka lebih murah",
              "Investasi teknologi yang menaikkan produktivitas",
              "Rancang ulang produk agar lebih murah dibuat"], RED),
            ("2. Bagian pemasok",
             ["Tekan harga beli ke pemasok",
              "Ganti ke input substitusi yang lebih murah",
              "Kerja sama erat mencari penghematan bersama",
              "Integrasi ke belakang: produksi sendiri",
              "Untuk menaikkan nilai: pilih pemasok bermutu tinggi dan libatkan mereka "
              "sejak tahap desain"], INK),
            ("3. Bagian mitra hilir",
             ["Tekan biaya dan markup distributor serta dealer",
              "Kerja sama mencari penghematan yang saling menguntungkan",
              "Ubah jalur distribusi, termasuk jualan langsung lewat internet",
              "Integrasi ke depan: buka gerai sendiri",
              "Untuk menaikkan nilai: iklan bersama, perjanjian eksklusif, dan "
              "pelatihan mitra"], INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for nm, items, col in cols:
        rect(s, x, y, w, 2.98, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.44, fill=col)
        txt(s, nm, x + 0.22, y + 0.09, w - 0.44, 0.28, size=12.5, color=WHITE, bold=True)
        bullets(s, items, x + 0.22, y + 0.60, w - 0.44, 2.24, size=10.5,
                color=INK, gap=5, marker="·", marker_color=col, spacing=1.10)
        x += w + 0.26

    y2 = y + 3.26
    rect(s, ML, y2, CW, 1.04, fill=INK)
    rect(s, ML, y2, 0.05, 1.04, fill=RED)
    txt(s, "Hanya ada dua jalan mengubah kerja rantai nilai jadi keunggulan bersaing",
        ML + 0.32, y2 + 0.14, CW - 0.64, 0.28, size=13.5, color=WHITE, bold=True)
    b = txt(s, "", ML + 0.32, y2 + 0.48, CW - 0.64, 0.50, size=11.5)
    rich(b, [("(1) Lebih efisien sehingga biayanya lebih rendah dari pesaing — "
              "Ryanair, Nucor, TJX.   ", False, RGBColor(0xA8, 0x9F, 0x99)),
             ("(2) Menjadi dasar diferensiasi sehingga pelanggan mau membayar lebih "
              "— Rolex (status), Braun (desain), L.L. Bean (layanan), FedEx "
              "(keandalan).", False, RGBColor(0xA8, 0x9F, 0x99))],
         size=11.5, first=True, spacing=1.18)
    notes(s, "Tiga area itu persis sama dengan tiga bagian rantai nilai sistem di slide "
             "sebelumnya — tunjukkan hubungannya, jangan biarkan audiens menebak.\n\n"
             "Catatan dari buku untuk kolom 1: memperbaiki kerugian biaya internal dengan "
             "cara menekan pemasok atau mitra hilir adalah PILIHAN TERAKHIR, bukan "
             "langkah pertama.\n\n"
             "Satu contoh konkret yang bagus: banyak peritel menemukan bahwa "
             "menyumbangkan barang retur ke lembaga amal lalu mengambil potongan pajaknya "
             "menghasilkan kerugian lebih kecil dibanding menanggung biaya logistik "
             "baliknya.\n\n"
             "Untuk bagian hilir, contoh Walmart dan Target: keduanya mewajibkan pemasok "
             "tiba dalam jendela dua hari. Itu bukan cuma menaikkan efisiensi pusat "
             "distribusi, tapi juga memangkas waktu tunggu bongkar yang mahal bagi si "
             "pengirim. Win-win.\n\n"
             "Tutup dengan dua jalur di kotak hitam. Tekankan bahwa keduanya menuntut "
             "usaha terus-menerus, bukan sekali jadi. Buku bilang reputasi dan merek "
             "unggul dibangun pelan-pelan lewat investasi dan pesan yang konsisten.")
    d.footer(s, FOOT_A)
    return s


def s16_csa(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 5 · Tabel 4.4", "Matriks kekuatan kompetitif",
               "Alat untuk mengubah penilaian yang serba kualitatif menjadi satu angka "
               "yang bisa langsung dibandingkan dengan pesaing.", sublines=1)

    steps = [("1", "Daftar KSF", "Susun key success factor industri"),
             ("2", "Beri bobot", "Sesuai tingkat kepentingan; total harus 1,00"),
             ("3", "Beri rating", "Skala 1–10. 1 sangat lemah, 10 sangat kuat"),
             ("4", "Kalikan", "Rating × bobot = skor tertimbang"),
             ("5", "Jumlahkan", "Totalnya jadi ukuran kekuatan keseluruhan")]
    w = (CW - 4 * 0.18) / 5
    x = ML
    for n, nm, body in steps:
        rect(s, x, y, w, 1.28, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, n, x + 0.18, y + 0.14, 0.4, 0.40, size=21, color=RED, bold=True, font=S_FONT)
        txt(s, nm, x + 0.18, y + 0.54, w - 0.36, 0.26, size=12.5, color=INK, bold=True)
        txt(s, body, x + 0.18, y + 0.82, w - 0.36, 0.42, size=10.5, color=INK_SOFT,
            spacing=1.10)
        x += w + 0.18

    y2 = y + 1.50
    rows = [["Key Success Factor", "Bobot", "ABC Co.", "Rival 1", "Rival 2"],
            ["Mutu / performa produk", "0,10", "8 / 0,80", "5 / 0,50", "1 / 0,10"],
            ["Reputasi dan citra", "0,10", "8 / 0,80", "7 / 0,70", "1 / 0,10"],
            ["Kemampuan produksi", "0,10", "2 / 0,20", "10 / 1,00", "5 / 0,50"],
            ["Sumber daya keuangan", "0,10", "5 / 0,50", "10 / 1,00", "3 / 0,30"],
            ["Posisi biaya relatif", "0,30", "5 / 1,50", "10 / 3,00", "1 / 0,30"],
            ["Layanan pelanggan", "0,15", "5 / 0,75", "7 / 1,05", "1 / 0,15"],
            ["Faktor lain (tiga baris)", "0,15", "— / 1,40", "— / 0,45", "— / 0,65"],
            ["TOTAL SKOR TERTIMBANG", "1,00", "5,95", "7,70", "2,10"]]
    tw = CW * 0.60
    cwd = [tw * f for f in (0.36, 0.12, 0.173, 0.173, 0.174)]
    tbl = make_table(s, rows, ML, y2, tw, cwd, row_h=0.295, head_h=0.36,
                     size=10.5, head_size=10,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 4)
    for ci in range(5):
        style_cell(tbl.cell(8, ci), rows[8][ci], size=11, color=WHITE, bold=True,
                   fill=INK, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(8, ci), ("T", "B", "L", "R"), INK, 0.75)
    txt(s, "Contoh dari Tabel 4.4 buku. Rating / skor tertimbang.", ML, y2 + 2.76,
        tw, 0.24, size=9.5, color=MUTED, italic=True)

    x3 = ML + tw + 0.42
    w3 = CW - tw - 0.42
    txt(s, "Apa yang bisa dibaca dari angkanya", x3, y2 - 0.04, w3, 0.26, size=11,
        color=RED, bold=True, caps=True)
    reads = [("Selisih total skor", "Besarnya net competitive advantage. Rival 1 (7,70) "
              "unggul jauh atas Rival 2 (2,10)."),
             ("Serang di mana", "Serang pesaing yang skornya lebih rendah, di faktor "
              "tempat kita kuat dan dia lemah."),
             ("Bertahan di mana", "Kalau kita lemah di faktor tempat pesaing kuat, "
              "siapkan langkah bertahan lebih dulu.")]
    yy = y2 + 0.28
    for nm, body in reads:
        rect(s, x3, yy, w3, 0.86, fill=TINT, line=RULE)
        rect(s, x3, yy, 0.05, 0.86, fill=RED)
        txt(s, nm, x3 + 0.24, yy + 0.10, w3 - 0.48, 0.24, size=12, color=INK, bold=True)
        txt(s, body, x3 + 0.24, yy + 0.36, w3 - 0.48, 0.46, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.94
    notes(s, "Tabel di slide ini menyalin Tabel 4.4 buku, dengan tiga baris terakhir "
             "digabung supaya muat. Baris yang digabung: technological skills, dealer "
             "network, dan new product innovation capability — bobot masing-masing "
             "0,05.\n\n"
             "Pelajaran paling penting dari contoh ini, dan sering ditanyakan:\n"
             "ABC punya nilai tinggi di banyak hal — technological skills 10, "
             "dealer network 9, inovasi produk 9, mutu 8, reputasi 8. Tapi semua faktor "
             "itu bobotnya KECIL. Artinya ABC kuat di area yang tidak banyak berpengaruh "
             "di pasar.\n\n"
             "Sebaliknya posisi biaya relatif berbobot 0,30, paling besar. Di situ ABC "
             "hanya 5 sementara Rival 1 dapat 10. Itulah sebabnya Rival 1 menang "
             "telak.\n\n"
             "Implikasi strategisnya, langsung dari buku:\n"
             "- ABC sebaiknya menyerang Rival 2, bukan Rival 1, karena skor Rival 2 jauh "
             "lebih rendah dan ABC unggul di lima area tempat Rival 2 lemah.\n"
             "- Tapi ABC harus hati-hati memotong harga, karena Rival 1 bisa membalas "
             "dan pasti menang perang harga.\n"
             "- Untuk bertahan, ABC perlu mengarahkan sebagian strateginya ke penurunan "
             "biaya.\n\n"
             "Prinsipnya: kuat di faktor yang bobotnya kecil tidak menghasilkan "
             "kekuatan pasar.")
    d.footer(s, FOOT_A)
    return s


def s17_q6(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 6", "Isu apa yang harus ditangani lebih dulu?",
               "Langkah terakhir dan paling penting. Semua temuan dari Q1 sampai Q5, "
               "ditambah analisis industri dari Chapter 3, dikerucutkan jadi satu "
               "daftar prioritas.", sublines=2)

    wl = CW * 0.50
    rect(s, ML, y, wl, 2.30, fill=INK)
    txt(s, "Priority list", ML + 0.34, y + 0.24, 4.0, 0.34, size=19, color=WHITE, bold=True)
    rect(s, ML + 0.34, y + 0.68, 1.2, 0.035, fill=RED)
    txt(s, "Daftar isu dan masalah yang harus dituntaskan manajemen agar perusahaan "
           "lebih berhasil, secara keuangan maupun secara bersaing, di tahun-tahun "
           "mendatang.",
        ML + 0.34, y + 0.88, wl - 0.68, 0.78, size=12.5, color=WHITE, spacing=1.20)
    txt(s, "Isinya selalu berbentuk “bagaimana caranya…”, "
           "“apa yang harus dilakukan soal…”, dan "
           "“apakah perlu…”.",
        ML + 0.34, y + 1.74, wl - 0.68, 0.46, size=11, color=RGBColor(0xA8, 0x9F, 0x99),
        spacing=1.16)

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Dua hal yang sering keliru", x2, y - 0.04, w2, 0.26, size=11, color=RED,
        bold=True, caps=True)
    traps = [("Ini bukan daftar solusi", "Tujuannya mengidentifikasi ISU yang harus "
              "ditangani, bukan memutuskan tindakan apa yang diambil. Keputusan "
              "tindakan datang belakangan, saat menyusun strategi."),
             ("Panjang daftar itu diagnosis", "Kalau isinya ringan, strategi sekarang "
              "sudah cukup dan tinggal disetel halus. Kalau isinya berat, menyusun "
              "strategi baru harus jadi agenda nomor satu manajemen.")]
    yy = y + 0.30
    for nm, body in traps:
        rect(s, x2, yy, w2, 1.18, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 1.18, fill=RED)
        txt(s, nm, x2 + 0.24, yy + 0.12, w2 - 0.48, 0.26, size=12.5, color=INK, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.40, w2 - 0.48, 0.70, size=11, color=INK_SOFT,
            spacing=1.14)
        yy += 1.30

    note(s, [("Uji akhir Chapter 4: ", True, RED_DEEP),
             ("strategi yang baik wajib memuat cara menangani SEMUA isu dan hambatan "
              "pada daftar prioritas itu. Di sinilah analisis berhenti dan penyusunan "
              "strategi dimulai.", False, INK)])
    notes(s, "Kalimat buku yang paling tegas: 'The final and most important analytic step "
             "is to zero in on exactly what strategic issues company managers need to "
             "address — and resolve.'\n\n"
             "Contoh isi priority list dari buku, bagus untuk dibacakan satu dua:\n"
             "- bagaimana menahan serangan pesaing asing baru;\n"
             "- bagaimana melawan diskon harga pesaing;\n"
             "- bagaimana menurunkan biaya yang terlalu tinggi;\n"
             "- bagaimana mempertahankan laju pertumbuhan ketika permintaan melambat;\n"
             "- apakah perlu mengakuisisi pesaing untuk menutup kelemahan;\n"
             "- apakah perlu masuk pasar luar negeri;\n"
             "- apa yang harus dilakukan menghadapi produk substitusi;\n"
             "- apa yang harus dilakukan menghadapi basis pelanggan yang menua.\n\n"
             "Tekankan perangkap pertama: daftar ini berisi PERTANYAAN, bukan jawaban. "
             "Mahasiswa sering langsung menulis solusi di sini, dan itu keliru menurut "
             "buku.\n\n"
             "Perangkap kedua adalah diagnosisnya: kalau isu-isunya relatif kecil, "
             "berarti strategi sekarang sudah pada jalurnya dan cukup disetel halus. "
             "Kalau isunya serius, berarti strategi sekarang tidak cocok untuk jalan ke "
             "depan, dan menyusun strategi baru harus jadi prioritas utama.")
    d.footer(s, FOOT_A)
    return s


def s18_recap(d):
    s = d.blank()
    y = d.head(s, "Ringkasan Bagian A", "Peta lengkap Chapter 4",
               "Enam pertanyaan, alat yang dipakai di masing-masing, dan hasilnya. "
               "Struktur inilah yang kami pakai membedah Manchester United di Bagian B.",
               sublines=2)

    rows = [["", "Pertanyaan", "Alat yang dipakai", "Hasilnya"],
            ["1", "Seberapa baik strategi sekarang bekerja?",
             "Indikator kinerja; rasio keuangan (Tabel 4.1)",
             "Penilaian: strateginya berhasil atau gagal"],
            ["2", "Apa kekuatan dan kelemahan kita, dihadapkan pada peluang dan ancaman?",
             "SWOT (Tabel 4.2, Figure 4.2); tangga competence",
             "Sebab di balik berhasil atau gagalnya strategi"],
            ["3", "Resource dan capability apa yang penting, dan tahan lama?",
             "Tipologi tangible/intangible (Tabel 4.3); uji VRIN; dynamic capability",
             "Sumber keunggulan dan daya tahannya"],
            ["4", "Bagaimana rantai nilai memengaruhi biaya dan nilai pelanggan?",
             "Value chain (Figure 4.3); value chain system; benchmarking",
             "Titik unggul dan titik kalah, per aktivitas"],
            ["5", "Kita lebih kuat atau lebih lemah dari pesaing?",
             "Matriks kekuatan kompetitif tertimbang (Tabel 4.4)",
             "Skor kekuatan dan net competitive advantage"],
            ["6", "Isu apa yang harus ditangani lebih dulu?", "Priority list",
             "Agenda kerja manajemen"]]
    cwd = [0.42, 3.30, 4.20, 3.55]
    tbl = make_table(s, rows, ML, y, sum(cwd), cwd, row_h=0.50, head_h=0.40,
                     size=11, head_size=10.5,
                     aligns=[PP_ALIGN.CENTER, PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.LEFT])
    for ri in range(1, 7):
        style_cell(tbl.cell(ri, 0), str(ri), size=15, color=RED, bold=True,
                   fill=PAPER if ri % 2 else TINT, align=PP_ALIGN.CENTER, font=S_FONT)
        set_cell_border(tbl.cell(ri, 0), ("T", "B", "L", "R"), RULE, 0.75)

    note(s, [("Logika urutannya: ", True, RGBColor(0xFF, 0x8A, 0x7A)),
             ("Q1 mengukur hasil → Q2 mencari sebabnya secara kasar → Q3 dan Q4 "
              "menggali sebabnya sampai dalam → Q5 membandingkan dengan pesaing "
              "→ Q6 memutuskan apa yang dikerjakan lebih dulu.", False, WHITE)],
         dark=True)
    notes(s, "Ini slide jembatan. Ulangi sekali lagi keenam pertanyaannya, lalu "
             "sambungkan ke bagian kasus.\n\n"
             "Poin yang layak ditekankan: Q2 dan Q3 sama-sama melihat ke dalam "
             "perusahaan, tapi kedalamannya berbeda. SWOT itu alat cepat dan sederhana; "
             "analisis resource dan VRIN itu alat yang lebih dalam dan lebih ketat. "
             "Buku sendiri bilang kesederhanaan SWOT adalah kekuatan sekaligus "
             "keterbatasannya.\n\n"
             "Kalau ada yang bertanya kenapa ada enam pertanyaan padahal di internet "
             "banyak yang menyebut lima: edisi lama buku ini memang memakai lima "
             "pertanyaan, dengan SWOT diselipkan di dalam analisis resource. Edisi 2024 "
             "memisahkan SWOT menjadi Q2 tersendiri, sehingga jumlahnya jadi enam.")
    d.footer(s, FOOT_A)
    return s


SLIDES_A = [s01_cover, s02_agenda, s03_divider_a, s04_q1, s05_ratios, s06_swot_intro,
            s07_competence, s08_swot_steps, s09_resources, s10_capabilities, s11_vrin,
            s12_dynamic, s13_valuechain, s14_system, s15_cost_options, s16_csa,
            s17_q6, s18_recap]
