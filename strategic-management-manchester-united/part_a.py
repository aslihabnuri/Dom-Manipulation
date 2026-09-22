"""Slides 1-15: cover, agenda, and the Chapter 4 framework."""

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from deck_lib import *

FOOT_A = "Chapter 4  ·  Evaluating a Company's Resources and Competitive Position"


def s01_cover(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    rect(s, SW - 4.55, 0, 4.55, SH, fill=RGBColor(0x22, 0x1C, 0x1A))
    rect(s, SW - 4.55, 0, 0.012, SH, fill=RGBColor(0x3A, 0x31, 0x2D))

    txt(s, "Strategic Management", 1.05, 1.02, 6.6, 0.30, size=11.5,
        color=RED, bold=True, caps=True, spacing=1.0)
    txt(s, "Evaluating a Company's\nResources and\nCompetitive Position",
        1.05, 1.52, 7.0, 2.70, size=40, color=WHITE, bold=True, spacing=0.94)
    rect(s, 1.05, 4.36, 1.5, 0.035, fill=RED)

    b = txt(s, "Chapter 4", 1.05, 4.62, 7.0, 0.92, size=15, color=WHITE, bold=True)
    para(b, "Thompson · Peteraf · Gamble · Strickland", size=13,
         color=RGBColor(0xA8, 0x9F, 0x99), space_before=3)
    para(b, "Crafting & Executing Strategy: The Quest for Competitive Advantage",
         size=12, color=RGBColor(0x8C, 0x83, 0x7E), italic=True, space_before=2)

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
    return s


def s02_agenda(d):
    s = d.blank()
    y = d.head(s, "Alur Presentasi", "Agenda",
               "Kami bahas kerangka teorinya lebih dulu sampai tuntas, baru "
               "menerapkannya ke kasus. Setiap framework di Bagian A punya slide "
               "pasangannya di Bagian B.", sublines=2)

    cards = [("A", "Kerangka Chapter 4", "Slide 3 – 15",
              ["Lima pertanyaan evaluasi internal", "Rasio keuangan & indikator kinerja",
               "Resources, capabilities, uji VRIN", "Dynamic capabilities & SWOT",
               "Value chain analysis & benchmarking",
               "Weighted competitive strength assessment"], RED),
             ("B", "Penerapan: Manchester United", "Slide 16 – 31",
              ["Profil kasus & konteks industri", "Q1: kinerja sporting dan finansial",
               "Q2: inventarisasi resource & uji VRIN", "Q3: rantai nilai dan struktur biaya",
               "Q4: matriks kekuatan kompetitif", "Q5: worry list & rekomendasi"], INK)]
    w = (CW - 0.45) / 2
    x = ML
    for letter, title, rng, items, col in cards:
        rect(s, x, y, w, 3.66, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.055, fill=col)
        txt(s, letter, x + 0.34, y + 0.28, 0.7, 0.75, size=44, color=col,
            bold=True, font=S_FONT, spacing=0.9)
        txt(s, title, x + 1.08, y + 0.38, w - 1.4, 0.40, size=17, color=INK, bold=True)
        txt(s, rng, x + 1.08, y + 0.74, w - 1.4, 0.30, size=11, color=MUTED, caps=True)
        rect(s, x + 0.34, y + 1.24, w - 0.68, 0.012, fill=RULE)
        bullets(s, items, x + 0.34, y + 1.46, w - 0.68, 2.0, size=12.5,
                color=INK_SOFT, gap=8, marker="·", marker_color=col)
        x += w + 0.45
    d.footer(s, FOOT_A)
    return s


def s03_divider_a(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    txt(s, "Bagian A", 1.15, 1.05, 5.0, 0.30, size=11.5, color=RED, bold=True, caps=True)
    txt(s, "Kerangka\nChapter 4", 1.15, 1.42, 5.6, 2.0, size=42, color=WHITE,
        bold=True, spacing=0.94)
    txt(s, "Chapter 4 bukan kumpulan framework yang berdiri sendiri. Isinya adalah "
           "satu alur diagnosis internal yang disusun sebagai lima pertanyaan "
           "berurutan — jawaban pertanyaan sebelumnya menjadi input pertanyaan "
           "berikutnya.",
        1.15, 3.66, 5.3, 1.70, size=13.5, color=RGBColor(0xA8, 0x9F, 0x99), spacing=1.30)

    qs = [("1", "Seberapa baik strategi yang dijalankan saat ini?",
           "Indikator kinerja + rasio keuangan"),
          ("2", "Apakah resource & capability perusahaan kompetitif?",
           "VRIN · dynamic capabilities · SWOT"),
          ("3", "Apakah struktur biaya dan nilai pelanggannya kompetitif?",
           "Value chain analysis · benchmarking"),
          ("4", "Seberapa kuat posisi kompetitif vs pesaing?",
           "Weighted competitive strength assessment"),
          ("5", "Isu strategis apa yang butuh perhatian manajemen?", "Worry list")]
    x0, y = 7.05, 1.12
    for num, q, tool in qs:
        rect(s, x0, y, 5.55, 0.98, fill=RGBColor(0x22, 0x1C, 0x1A))
        rect(s, x0, y, 0.045, 0.98, fill=RED)
        txt(s, num, x0 + 0.30, y + 0.20, 0.5, 0.60, size=26, color=RED,
            bold=True, font=S_FONT)
        txt(s, q, x0 + 0.86, y + 0.15, 4.5, 0.46, size=13, color=WHITE,
            bold=True, spacing=1.06)
        txt(s, tool, x0 + 0.86, y + 0.62, 4.5, 0.28, size=10.5,
            color=RGBColor(0x8C, 0x83, 0x7E), spacing=1.0)
        y += 1.09
    return s


def s04_q1(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1", "Seberapa baik strategi saat ini bekerja?",
               "Titik awal evaluasi internal bukan aset perusahaan, melainkan hasil. "
               "Thompson menyebut dua indikator terbaik untuk menilainya.", sublines=1)

    cards = [("01", "Apakah perusahaan mencapai sasaran\nfinansial dan strategis yang ditetapkan?",
              "Sasaran finansial (laba, margin, ROI) dan sasaran strategis (pangsa "
              "pasar, reputasi, posisi teknologi) dinilai terpisah — perusahaan "
              "bisa untung tetapi kalah posisi."),
             ("02", "Apakah kinerjanya di atas\nrata-rata industri?",
              "Kinerja hanya bermakna relatif. Naik 8% saat industri naik 20% berarti "
              "strateginya sedang kalah, bukan menang.")]
    w = (CW - 0.42) / 2
    for i, (num, head, body) in enumerate(cards):
        x = ML + i * (w + 0.42)
        rect(s, x, y, w, 1.96, fill=PAPER, line=RULE)
        rect(s, x, y, 0.05, 1.96, fill=RED)
        txt(s, num, x + 0.32, y + 0.20, 0.8, 0.30, size=13, color=RED,
            bold=True, font=S_FONT)
        txt(s, head, x + 0.32, y + 0.54, w - 0.66, 0.62, size=15, color=INK,
            bold=True, spacing=1.08)
        txt(s, body, x + 0.32, y + 1.18, w - 0.66, 0.76, size=12, color=INK_SOFT,
            spacing=1.18)

    y2 = y + 2.16
    txt(s, "Indikator operasional yang dipantau", ML, y2, CW, 0.28, size=11,
        color=RED, bold=True, caps=True)
    items = ["Tren penjualan dan laba bersih",
             "Tren harga saham & imbal hasil pemegang saham",
             "Kekuatan finansial dan peringkat kredit",
             "Tren margin laba bersih dan ROI",
             "Tren pangsa pasar",
             "Citra, reputasi, dan kepemimpinan teknologi atau layanan"]
    col_w = (CW - 0.5) / 2
    for i, it in enumerate(items):
        cx = ML + (i % 2) * (col_w + 0.5)
        cy = y2 + 0.42 + (i // 2) * 0.38
        rect(s, cx, cy + 0.09, 0.10, 0.10, fill=RED)
        txt(s, it, cx + 0.26, cy, col_w - 0.3, 0.30, size=12.5, color=INK, spacing=1.0)

    note(s, [("Prinsip: ", True, RED_DEEP),
             ("strategi yang berjalan baik menghasilkan perbaikan kinerja yang konsisten. "
              "Kemerosotan yang terus-menerus atau hasil yang jauh di bawah target adalah "
              "bukti kuat strateginya lemah, eksekusinya buruk, atau keduanya.", False, INK)])
    d.footer(s, FOOT_A)
    return s


def s05_ratios(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Alat Ukur", "Rasio keuangan sebagai bukti kuantitatif",
               "Penilaian kualitatif tadi perlu diuji dengan angka. Thompson "
               "mengelompokkan rasio ke dalam empat kategori diagnosis.", sublines=1)

    groups = [("Profitabilitas", "Kemampuan menghasilkan laba dari penjualan dan modal",
               ["Gross profit margin", "Operating profit margin", "Net profit margin",
                "Return on assets (ROA)", "Return on equity (ROE)",
                "Return on invested capital", "Earnings per share (EPS)"]),
              ("Likuiditas", "Kemampuan memenuhi kewajiban jangka pendek",
               ["Current ratio", "Quick ratio (acid test)", "Working capital"]),
              ("Leverage", "Beban utang dan risiko struktur modal",
               ["Total debt-to-assets ratio", "Long-term debt-to-capital",
                "Debt-to-equity ratio", "Times-interest-earned"]),
              ("Aktivitas", "Efisiensi pengelolaan aset operasional",
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
             ("dividend yield, price-earnings ratio, dividend payout ratio, internal "
              "cash flow, dan ", False, INK), ("free cash flow", True, INK),
             (" — yang terakhir paling penting karena menunjukkan kas yang "
              "benar-benar tersedia untuk investasi baru.", False, INK)])
    d.footer(s, FOOT_A)
    return s


def s06_resources(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2", "Resources dan capabilities: dua hal berbeda",
               "Kesalahan analisis paling umum adalah mencampur keduanya. Perbedaannya "
               "menentukan apakah keunggulan bisa bertahan saat satu aset hilang.",
               sublines=2)

    defs = [("Resource", "Aset kompetitif yang dimiliki atau dikendalikan perusahaan.",
             "Kata kuncinya: sesuatu yang perusahaan PUNYA.", RED),
            ("Capability",
             "Kapasitas perusahaan menjalankan suatu aktivitas secara cakap; disebut "
             "juga competence. Lahir dari resource bundle — kombinasi beberapa "
             "resource yang bekerja bersama, sering lintas fungsi.",
             "Kata kuncinya: sesuatu yang perusahaan BISA LAKUKAN.", INK)]
    w = (CW - 0.40) / 2
    for i, (name, body, key, col) in enumerate(defs):
        x = ML + i * (w + 0.40)
        rect(s, x, y, w, 1.56, fill=PAPER, line=RULE)
        rect(s, x, y, 0.05, 1.56, fill=col)
        txt(s, name, x + 0.30, y + 0.16, w - 0.6, 0.30, size=16, color=col, bold=True)
        txt(s, body, x + 0.30, y + 0.52, w - 0.6, 0.70, size=12, color=INK, spacing=1.16)
        txt(s, key, x + 0.30, y + 1.24, w - 0.6, 0.26, size=11.5, color=MUTED, italic=True)

    y2 = y + 1.74
    txt(s, "Klasifikasi resource", ML, y2, CW, 0.28, size=11, color=RED,
        bold=True, caps=True)

    tang = [("Fisik", "pabrik, lokasi, jaringan distribusi"),
            ("Finansial", "kas, kapasitas pinjam, portofolio investasi"),
            ("Teknologi", "paten, hak cipta, teknologi produksi"),
            ("Organisasional", "sistem IT, struktur pelaporan, kontrol")]
    intang = [("Human assets", "keahlian, pengalaman, modal intelektual"),
              ("Brand & reputasi", "merek, citra, kepercayaan pelanggan"),
              ("Relasi", "aliansi, kemitraan, loyalitas pemasok"),
              ("Budaya & insentif", "norma kerja, nilai bersama, penghargaan")]
    for i, (label, rows, col) in enumerate([("Tangible — berwujud", tang, INK),
                                            ("Intangible — tak berwujud", intang, RED)]):
        x = ML + i * (w + 0.40)
        rect(s, x, y2 + 0.28, w, 2.12, fill=PAPER, line=RULE)
        rect(s, x, y2 + 0.28, w, 0.44, fill=col)
        txt(s, label, x + 0.22, y2 + 0.39, w - 0.44, 0.28, size=12.5,
            color=WHITE, bold=True)
        yy = y2 + 0.82
        for nm, ex in rows:
            txt(s, nm, x + 0.22, yy, 1.70, 0.26, size=11.5, color=col, bold=True)
            txt(s, ex, x + 2.00, yy, w - 2.24, 0.26, size=11, color=INK_SOFT, spacing=1.04)
            yy += 0.38
    d.footer(s, FOOT_A)
    return s


def s07_vrin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Framework Inti",
               "Uji VRIN: empat tes kekuatan kompetitif",
               "VRIN adalah saringan empat lapis untuk memisahkan aset biasa dari "
               "sumber keunggulan bersaing yang sejati.",
               sublines=1)

    tests = [("V", "Valuable", "Apakah secara kompetitif bernilai?",
              "Resource harus membantu perusahaan menciptakan nilai bagi pelanggan "
              "atau menurunkan biaya. Aset mahal yang tidak memengaruhi posisi "
              "bersaing tidak lolos tes ini."),
             ("R", "Rare", "Apakah langka, tidak dimiliki pesaing?",
              "Jika semua pesaing memilikinya, resource itu adalah syarat untuk ikut "
              "bermain (table stake), bukan pembeda."),
             ("I", "Inimitable", "Apakah sulit ditiru?",
              "Diuji lewat path dependency, causal ambiguity, dan social complexity. "
              "Makin sulit pesaing memahami asal-usulnya, makin awet keunggulannya."),
             ("N", "Non-substitutable", "Apakah tidak mudah digantikan?",
              "Pesaing bisa saja tidak meniru, tetapi menemukan cara lain untuk hasil "
              "yang sama. Substitusi mematikan keunggulan tanpa perlu imitasi.")]
    w = (CW - 3 * 0.26) / 4
    x = ML
    for letter, name, q, body in tests:
        rect(s, x, y, w, 3.40, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.85, fill=RED if letter in ("V", "R") else INK)
        txt(s, letter, x, y + 0.13, w, 0.60, size=34, color=WHITE, bold=True,
            font=S_FONT, align=PP_ALIGN.CENTER)
        txt(s, name, x + 0.16, y + 1.00, w - 0.32, 0.30, size=14, color=INK,
            bold=True, align=PP_ALIGN.CENTER)
        txt(s, q, x + 0.14, y + 1.36, w - 0.28, 0.50, size=11.5, color=RED,
            align=PP_ALIGN.CENTER, spacing=1.10, italic=True)
        txt(s, body, x + 0.20, y + 1.94, w - 0.40, 1.40, size=11.5,
            color=INK_SOFT, spacing=1.18)
        x += w + 0.26

    half = (CW - 0.40) / 2
    note(s, [("Tes 1 + 2 (V, R)  →  ", True, RED),
             ("menentukan apakah resource dapat MENCIPTAKAN keunggulan bersaing.",
              False, INK)], width=half)
    note(s, [("Tes 3 + 4 (I, N)  →  ", True, RGBColor(0xFF, 0x8A, 0x7A)),
             ("menentukan apakah keunggulan itu BERTAHAN (sustainable).", False, WHITE)],
         dark=True, left=ML + half + 0.40, width=half)
    d.footer(s, FOOT_A)
    return s


def s08_dynamic(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Lanjutan",
               "Penghalang imitasi & dynamic capabilities",
               "Tes ketiga VRIN perlu dibongkar: apa yang membuat sesuatu sulit ditiru, "
               "dan bagaimana keunggulan dijaga agar tidak usang.", sublines=1)

    bars = [("Path dependency",
             "Resource terbentuk lewat akumulasi bertahun-tahun yang tidak bisa "
             "dipercepat dengan uang. Pesaing harus menempuh jalan yang sama panjangnya."),
            ("Causal ambiguity",
             "Bahkan perusahaan pemiliknya tidak sepenuhnya tahu mengapa resource itu "
             "bekerja. Jika sebabnya tidak jelas, apa yang harus ditiru juga tidak jelas."),
            ("Social complexity",
             "Keunggulan melekat pada hubungan antarmanusia, budaya, dan kepercayaan "
             "— hal yang tidak bisa dibeli atau direkrut satuan.")]
    wl = CW * 0.55
    yy = y
    for nm, body in bars:
        rect(s, ML, yy, wl, 1.00, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 1.00, fill=RED)
        txt(s, nm, ML + 0.28, yy + 0.12, 2.5, 0.28, size=13, color=RED, bold=True)
        txt(s, body, ML + 0.28, yy + 0.42, wl - 0.56, 0.52, size=11.5,
            color=INK_SOFT, spacing=1.14)
        yy += 1.10

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    rect(s, x2, y, w2, 3.20, fill=INK)
    txt(s, "Dynamic Capability", x2 + 0.32, y + 0.30, w2 - 0.64, 0.34, size=17,
        color=WHITE, bold=True)
    rect(s, x2 + 0.32, y + 0.78, 1.2, 0.035, fill=RED)
    txt(s, "Kapasitas berkelanjutan untuk memodifikasi resource dan capability yang "
           "ada, atau menciptakan yang baru.",
        x2 + 0.32, y + 1.00, w2 - 0.64, 0.82, size=13, color=WHITE, spacing=1.20)
    txt(s, "Mengapa wajib ada: setiap resource terdepresiasi. Tanpa pembaruan, aset "
           "yang hari ini lolos VRIN akan menjadi komoditas biasa dalam beberapa tahun "
           "karena pesaing menyusul.",
        x2 + 0.32, y + 1.96, w2 - 0.64, 1.00, size=11.5,
        color=RGBColor(0xA8, 0x9F, 0x99), spacing=1.18)

    note(s, [("Implikasi untuk analisis kasus: ", True, RED_DEEP),
             ("keunggulan yang bersumber dari satu individu selalu rapuh pada tes I dan N. "
              "Individu bisa sangat sulit ditiru, tetapi kepergiannya menghapus keunggulan "
              "seketika — tidak demikian pada keunggulan yang melekat pada sistem.",
              False, INK)])
    d.footer(s, FOOT_A)
    return s


def s09_swot(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Sintesis", "SWOT — dan cara memakainya yang benar",
               "SWOT menggabungkan temuan internal (resource & capability) dengan kondisi "
               "eksternal. Nilainya bukan pada daftarnya, melainkan pada kesimpulannya.",
               sublines=2)

    quad = [("S", "Strengths", "Resource dan capability yang lolos uji VRIN", RED),
            ("W", "Weaknesses", "Kekurangan internal yang melemahkan posisi", RED),
            ("O", "Opportunities", "Kondisi eksternal yang cocok dengan kekuatan", INK),
            ("T", "Threats", "Faktor eksternal yang mengancam profitabilitas", INK)]
    gw, gh = (CW * 0.56 - 0.26) / 2, 1.42
    for i, (L, nm, body, col) in enumerate(quad):
        x = ML + (i % 2) * (gw + 0.26)
        yy = y + (i // 2) * (gh + 0.24)
        rect(s, x, yy, gw, gh, fill=PAPER, line=RULE)
        rect(s, x, yy, gw, 0.05, fill=col)
        txt(s, L, x + 0.24, yy + 0.22, 0.4, 0.40, size=20, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.66, yy + 0.26, gw - 0.9, 0.30, size=13.5, color=INK, bold=True)
        txt(s, body, x + 0.24, yy + 0.72, gw - 0.48, 0.56, size=11, color=INK_SOFT,
            spacing=1.12)

    x2 = ML + CW * 0.56 + 0.40
    w2 = CW - CW * 0.56 - 0.40
    txt(s, "Tiga langkah SWOT menurut Thompson", x2, y - 0.04, w2, 0.28, size=11,
        color=RED, bold=True, caps=True)
    steps = [("1", "Identifikasi", "Susun keempat daftar berdasarkan bukti, bukan opini."),
             ("2", "Tarik kesimpulan",
              "Nilai posisi keseluruhan: apakah kekuatan cukup untuk menangkap peluang "
              "dan menahan ancaman?"),
             ("3", "Terjemahkan jadi tindakan",
              "Ubah kesimpulan menjadi keputusan strategis yang konkret.")]
    yy = y + 0.34
    for n, nm, body in steps:
        rect(s, x2, yy, w2, 0.92, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.92, fill=RED)
        txt(s, n, x2 + 0.26, yy + 0.20, 0.35, 0.40, size=19, color=RED, bold=True, font=S_FONT)
        txt(s, nm, x2 + 0.66, yy + 0.14, w2 - 0.9, 0.28, size=13, color=INK, bold=True)
        txt(s, body, x2 + 0.66, yy + 0.44, w2 - 0.92, 0.44, size=11, color=INK_SOFT,
            spacing=1.10)
        yy += 1.02

    note(s, [("Kesalahan yang paling sering terjadi: ", True, RGBColor(0xFF, 0x8A, 0x7A)),
             ("berhenti di langkah 1. SWOT yang hanya berupa empat daftar tidak "
              "menghasilkan keputusan apa pun. Seluruh nilainya ada pada langkah 2 dan 3.",
              False, WHITE)], dark=True)
    d.footer(s, FOOT_A)
    return s


def s10_valuechain(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3", "Value Chain Analysis",
               "Untuk tahu apakah struktur biaya kompetitif, perusahaan harus dipecah "
               "menjadi aktivitas-aktivitas pembentuk biaya dan nilai. Dari situ terlihat "
               "aktivitas mana yang menciptakan nilai dan mana yang hanya menyerap biaya.",
               sublines=2)

    prim = [("Supply Chain\nManagement", "Pengadaan, penerimaan, penyimpanan, distribusi input"),
            ("Operations", "Mengubah input menjadi produk atau jasa akhir"),
            ("Distribution", "Pergudangan dan pengiriman ke pembeli atau distributor"),
            ("Sales &\nMarketing", "Tenaga penjual, iklan, promosi, dukungan dealer"),
            ("Service", "Instalasi, perbaikan, suku cadang, dukungan pelanggan")]
    w = (CW - 4 * 0.16 - 1.55) / 5
    txt(s, "Primary Activities", ML, y, CW, 0.28, size=11, color=RED, bold=True, caps=True)
    x = ML
    for nm, body in prim:
        rect(s, x, y + 0.34, w, 1.80, fill=PAPER, line=RULE)
        rect(s, x, y + 0.34, w, 0.05, fill=RED)
        txt(s, nm, x + 0.16, y + 0.50, w - 0.32, 0.56, size=12.5, color=INK,
            bold=True, spacing=1.06)
        txt(s, body, x + 0.16, y + 1.14, w - 0.32, 0.88, size=10.5, color=INK_SOFT,
            spacing=1.12)
        x += w + 0.16
    rect(s, x, y + 0.34, 1.55, 1.80, fill=INK)
    txt(s, "Profit\nMargin", x + 0.16, y + 0.88, 1.23, 0.70, size=14, color=WHITE,
        bold=True, align=PP_ALIGN.CENTER, spacing=1.06)

    sup = [("Product R&D, Technology &\nSystems Development",
            "Riset produk & proses, desain, sistem telekomunikasi, otomasi"),
           ("Human Resources\nManagement",
            "Rekrutmen, pelatihan, pengembangan, kompensasi, hubungan kerja"),
           ("General\nAdministration",
            "Akuntansi, keuangan, hukum, regulasi, keselamatan, sistem informasi")]
    y2 = y + 2.40
    txt(s, "Support Activities", ML, y2, CW, 0.28, size=11, color=INK, bold=True, caps=True)
    w3 = (CW - 2 * 0.22) / 3
    x = ML
    for nm, body in sup:
        rect(s, x, y2 + 0.34, w3, 1.34, fill=TINT, line=RULE)
        rect(s, x, y2 + 0.34, 0.05, 1.34, fill=INK)
        txt(s, nm, x + 0.26, y2 + 0.48, w3 - 0.5, 0.52, size=12.5, color=INK,
            bold=True, spacing=1.06)
        txt(s, body, x + 0.26, y2 + 1.02, w3 - 0.5, 0.56, size=10.5, color=INK_SOFT,
            spacing=1.12)
        x += w3 + 0.22
    d.footer(s, FOOT_A)
    return s


def s11_system(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Lanjutan", "Value chain system dan benchmarking",
               "Biaya dan nilai yang sampai ke pembeli ditentukan oleh seluruh rantai "
               "dari hulu ke hilir, bukan oleh perusahaan sendiri saja.",
               sublines=1)

    chain = [("Rantai nilai\nPEMASOK", "Biaya dan kualitas input yang masuk", MUTED),
             ("Rantai nilai\nPERUSAHAAN", "Aktivitas primer dan pendukung internal", RED),
             ("Rantai nilai\nCHANNEL", "Distributor, dealer, mitra hilir", MUTED),
             ("PEMBELI /\nPENGGUNA AKHIR", "Nilai yang akhirnya dirasakan", INK)]
    w = (CW - 3 * 0.52) / 4
    x = ML
    for i, (nm, body, col) in enumerate(chain):
        rect(s, x, y, w, 1.30, fill=RED_TINT if col is RED else PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=col)
        txt(s, nm, x + 0.18, y + 0.24, w - 0.36, 0.56, size=13,
            color=col if col is not MUTED else INK, bold=True,
            align=PP_ALIGN.CENTER, spacing=1.06)
        txt(s, body, x + 0.18, y + 0.86, w - 0.36, 0.36, size=10.5, color=INK_SOFT,
            align=PP_ALIGN.CENTER, spacing=1.08)
        if i < 3:
            txt(s, "→", x + w + 0.06, y + 0.42, 0.40, 0.40, size=20, color=RED,
                bold=True, align=PP_ALIGN.CENTER)
        x += w + 0.52

    y2 = y + 1.62
    half = (CW - 0.40) / 2
    rect(s, ML, y2, half, 2.32, fill=PAPER, line=RULE)
    rect(s, ML, y2, half, 0.46, fill=INK)
    txt(s, "Benchmarking", ML + 0.24, y2 + 0.10, half - 0.5, 0.30, size=13,
        color=WHITE, bold=True)
    txt(s, "Membandingkan biaya per aktivitas dengan pesaing atau dengan pelaku "
           "terbaik di luar industri, untuk mengetahui apakah biaya perusahaan wajar "
           "atau tidak.",
        ML + 0.24, y2 + 0.60, half - 0.5, 0.76, size=12, color=INK, spacing=1.18)
    txt(s, "Sumber data yang etis: laporan publik, kunjungan industri, asosiasi dagang, "
           "dan firma konsultan pihak ketiga yang mengumpulkan data secara anonim. "
           "Benchmarking tidak boleh menjadi pengumpulan intelijen ilegal.",
        ML + 0.24, y2 + 1.44, half - 0.5, 0.76, size=11, color=MUTED, spacing=1.14)

    x2 = ML + half + 0.40
    rect(s, x2, y2, half, 2.32, fill=PAPER, line=RULE)
    rect(s, x2, y2, half, 0.46, fill=RED)
    txt(s, "Tiga sumber cost disadvantage", x2 + 0.24, y2 + 0.10, half - 0.5, 0.30,
        size=13, color=WHITE, bold=True)
    srcs = [("Aktivitas internal", "biaya di dalam rantai nilai perusahaan sendiri"),
            ("Bagian pemasok", "harga input terlalu mahal dibanding pesaing"),
            ("Bagian forward channel", "margin distributor atau biaya distribusi terlalu besar")]
    yy = y2 + 0.64
    for nm, body in srcs:
        txt(s, nm, x2 + 0.24, yy, half - 0.5, 0.26, size=12, color=RED, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.26, half - 0.5, 0.28, size=11, color=INK_SOFT,
            spacing=1.06)
        yy += 0.54
    d.footer(s, FOOT_A)
    return s


def s12_cost_options(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Tindakan",
               "Memperbaiki posisi biaya dan nilai pelanggan",
               "Thompson memberi tiga kelompok opsi perbaikan, sesuai dengan tiga sumber "
               "cost disadvantage tadi.",
               sublines=1)

    cols = [("Aktivitas internal",
             ["Sederhanakan operasi, hapus aktivitas bernilai rendah",
              "Relokasi aktivitas berbiaya tinggi",
              "Outsource aktivitas yang lebih murah dikerjakan pihak lain",
              "Investasi teknologi hemat biaya",
              "Sederhanakan desain produk",
              "Rekayasa ulang proses bisnis inti"], RED),
            ("Bagian pemasok",
             ["Negosiasi harga yang lebih menguntungkan",
              "Beralih ke input substitusi yang lebih murah",
              "Kolaborasi erat dengan pemasok untuk efisiensi bersama",
              "Integrasi ke belakang (backward integration)"], INK),
            ("Bagian forward channel",
             ["Tekan margin distributor dan dealer",
              "Kolaborasi dengan mitra hilir untuk menurunkan biaya bersama",
              "Ubah strategi distribusi, termasuk penjualan langsung atau online",
              "Integrasi ke depan (forward integration)"], INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for nm, items, col in cols:
        rect(s, x, y, w, 2.70, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.46, fill=col)
        txt(s, nm, x + 0.22, y + 0.10, w - 0.44, 0.30, size=12.5, color=WHITE, bold=True)
        bullets(s, items, x + 0.22, y + 0.64, w - 0.44, 1.9, size=11,
                color=INK, gap=6, marker="·", marker_color=col, spacing=1.10)
        x += w + 0.26

    y2 = y + 3.00
    rect(s, ML, y2, CW, 1.16, fill=INK)
    rect(s, ML, y2, 0.05, 1.16, fill=RED)
    txt(s, "Customer Value Proposition", ML + 0.32, y2 + 0.16, 5.0, 0.30, size=14,
        color=WHITE, bold=True)
    b = txt(s, "", ML + 0.32, y2 + 0.54, CW - 0.70, 0.52, size=12.5)
    rich(b, [("Nilai yang diterima pelanggan = ", False, RGBColor(0xA8, 0x9F, 0x99)),
             ("V (nilai yang dipersepsikan) − P (harga yang dibayar)", True, WHITE),
             (".  Karena itu hanya ada dua jalur memperbaikinya: ", False, RGBColor(0xA8, 0x9F, 0x99)),
             ("turunkan biaya sehingga P bisa ditekan", True, RGBColor(0xFF, 0x8A, 0x7A)),
             (", atau ", False, RGBColor(0xA8, 0x9F, 0x99)),
             ("perkuat aktivitas yang menaikkan V", True, RGBColor(0xFF, 0x8A, 0x7A)),
             (" — kualitas, fitur, merek, dan layanan.", False, RGBColor(0xA8, 0x9F, 0x99))],
         size=12.5, first=True, spacing=1.20)
    d.footer(s, FOOT_A)
    return s


def s13_csa(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4", "Weighted Competitive Strength Assessment",
               "Alat untuk mengubah penilaian kualitatif menjadi satu angka yang bisa "
               "dibandingkan langsung dengan pesaing, sekaligus menunjukkan di mana "
               "menyerang dan di mana bertahan.", sublines=2)

    steps = [("1", "Daftar KSF", "Susun key success factor yang relevan bagi industri"),
             ("2", "Beri bobot", "Bobot mencerminkan kepentingan relatif; total 1,00"),
             ("3", "Beri rating", "Nilai perusahaan dan tiap pesaing pada skala 1–10"),
             ("4", "Kalikan", "Rating × bobot = skor tertimbang per faktor"),
             ("5", "Jumlahkan", "Total skor = kekuatan kompetitif keseluruhan")]
    w = (CW - 4 * 0.18) / 5
    x = ML
    for n, nm, body in steps:
        rect(s, x, y, w, 1.44, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, n, x + 0.18, y + 0.16, 0.4, 0.42, size=22, color=RED, bold=True, font=S_FONT)
        txt(s, nm, x + 0.18, y + 0.58, w - 0.36, 0.28, size=12.5, color=INK, bold=True)
        txt(s, body, x + 0.18, y + 0.88, w - 0.36, 0.52, size=10.5, color=INK_SOFT,
            spacing=1.10)
        x += w + 0.18

    y2 = y + 1.66
    rows = [["Key Success Factor", "Bobot", "Perusahaan A", "Pesaing B", "Pesaing C"],
            ["Contoh: kualitas produk", "0,20", "8  /  1,60", "6  /  1,20", "9  /  1,80"],
            ["Contoh: jaringan distribusi", "0,30", "9  /  2,70", "5  /  1,50", "4  /  1,20"],
            ["Contoh: posisi biaya", "0,50", "6  /  3,00", "9  /  4,50", "5  /  2,50"],
            ["Total skor tertimbang", "1,00", "7,30", "7,20", "5,50"]]
    tw = CW * 0.60
    make_table(s, rows, ML, y2, tw, [tw * f for f in (0.34, 0.12, 0.18, 0.18, 0.18)],
               row_h=0.34, head_h=0.40, size=11.5, head_size=10.5,
               aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 4,
               body_fills=[PAPER, TINT, PAPER, RED_TINT])
    txt(s, "Format matriks (angka ilustratif) — rating / skor tertimbang",
        ML, y2 + 1.84, tw, 0.26, size=10, color=MUTED, italic=True)

    x3 = ML + tw + 0.42
    w3 = CW - tw - 0.42
    txt(s, "Cara membaca hasilnya", x3, y2 - 0.04, w3, 0.28, size=11, color=RED,
        bold=True, caps=True)
    reads = [("Total skor", "Posisi kompetitif keseluruhan relatif terhadap pesaing"),
             ("Selisih skor", "Besarnya net competitive advantage atau disadvantage"),
             ("Baris per-KSF", "Di faktor mana menyerang pesaing, dan faktor mana yang harus dipertahankan")]
    yy = y2 + 0.30
    for nm, body in reads:
        rect(s, x3, yy, w3, 0.76, fill=TINT, line=RULE)
        rect(s, x3, yy, 0.05, 0.76, fill=RED)
        txt(s, nm, x3 + 0.24, yy + 0.10, w3 - 0.5, 0.26, size=12, color=INK, bold=True)
        txt(s, body, x3 + 0.24, yy + 0.38, w3 - 0.5, 0.40, size=11, color=INK_SOFT,
            spacing=1.08)
        yy += 0.84
    d.footer(s, FOOT_A)
    return s


def s14_q5(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 5", "Isu strategis apa yang butuh perhatian manajemen?",
               "Pertanyaan penutup Chapter 4. Semua temuan dari empat pertanyaan "
               "sebelumnya dikerucutkan menjadi agenda kerja manajemen.", sublines=1)

    wl = CW * 0.52
    rect(s, ML, y, wl, 2.62, fill=INK)
    txt(s, "Worry list", ML + 0.34, y + 0.28, 4.0, 0.36, size=19, color=WHITE, bold=True)
    rect(s, ML + 0.34, y + 0.76, 1.2, 0.035, fill=RED)
    txt(s, "Daftar hambatan, masalah, dan isu yang menghalangi keberhasilan perusahaan "
           "— disusun langsung dari bukti yang ditemukan pada Q1 sampai Q4.",
        ML + 0.34, y + 0.98, wl - 0.68, 0.80, size=13, color=WHITE, spacing=1.20)
    txt(s, "Pertanyaan yang dijawab di tahap ini bukan “apa solusinya”, "
           "melainkan “apa yang harus masuk agenda manajemen”. Perumusan solusi "
           "baru dikerjakan pada bab-bab berikutnya.",
        ML + 0.34, y + 1.86, wl - 0.68, 0.70, size=11.5,
        color=RGBColor(0xA8, 0x9F, 0x99), spacing=1.18)

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Sumber isu pada worry list", x2, y - 0.04, w2, 0.28, size=11, color=RED,
        bold=True, caps=True)
    srcs = [("Dari Q1", "Target yang tidak tercapai, tren kinerja yang memburuk"),
            ("Dari Q2", "Resource yang gagal uji VRIN, capability yang mulai usang"),
            ("Dari Q3", "Aktivitas berbiaya tinggi, nilai pelanggan yang tertinggal"),
            ("Dari Q4", "KSF dengan rating rendah dibanding pesaing")]
    yy = y + 0.34
    for nm, body in srcs:
        rect(s, x2, yy, w2, 0.62, fill=PAPER, line=RULE)
        txt(s, nm, x2 + 0.22, yy + 0.18, 0.90, 0.26, size=11.5, color=RED, bold=True)
        txt(s, body, x2 + 1.18, yy + 0.10, w2 - 1.42, 0.44, size=11.5, color=INK,
            spacing=1.06, anchor=MSO_ANCHOR.MIDDLE)
        yy += 0.70

    note(s, [("Uji akhir Chapter 4: ", True, RED_DEEP),
             ("jika worry list kosong, strategi yang berjalan sekarang sudah memadai. "
              "Jika terisi, setiap isu di dalamnya wajib dijawab oleh strategi berikutnya "
              "— inilah jembatan dari analisis ke perumusan strategi.", False, INK)])
    d.footer(s, FOOT_A)
    return s


def s15_recap(d):
    s = d.blank()
    y = d.head(s, "Ringkasan Bagian A", "Peta lengkap Chapter 4",
               "Lima pertanyaan, framework yang dipakai di masing-masing, dan output yang "
               "dihasilkan. Struktur inilah yang kami pakai untuk membedah kasus "
               "Manchester United di Bagian B.", sublines=2)

    rows = [["", "Pertanyaan", "Framework / alat utama", "Output yang dihasilkan"],
            ["1", "Seberapa baik strategi saat ini bekerja?",
             "Indikator kinerja strategis & finansial; rasio profitabilitas, likuiditas, leverage, aktivitas",
             "Penilaian apakah strategi berhasil atau gagal"],
            ["2", "Apakah resource & capability kompetitif?",
             "Klasifikasi tangible/intangible; uji VRIN; dynamic capabilities; SWOT",
             "Sumber keunggulan dan daya tahannya"],
            ["3", "Apakah biaya & nilai pelanggan kompetitif?",
             "Value chain analysis; value chain system; benchmarking; customer value proposition",
             "Titik keunggulan dan kelemahan biaya per aktivitas"],
            ["4", "Seberapa kuat posisi vs pesaing?",
             "Weighted competitive strength assessment",
             "Skor kekuatan kompetitif dan net advantage"],
            ["5", "Isu apa yang butuh perhatian manajemen?", "Worry list",
             "Agenda strategis untuk manajemen"]]
    cw = [0.42, 3.10, 4.55, 3.82]
    tbl = make_table(s, rows, ML, y, sum(cw), cw, row_h=0.60, head_h=0.42,
                     size=11.5, head_size=10.5,
                     aligns=[PP_ALIGN.CENTER, PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.LEFT])
    for ri in range(1, 6):
        style_cell(tbl.cell(ri, 0), str(ri), size=15, color=RED, bold=True,
                   fill=PAPER if ri % 2 else TINT, align=PP_ALIGN.CENTER, font=S_FONT)
        set_cell_border(tbl.cell(ri, 0), ("T", "B", "L", "R"), RULE, 0.75)

    note(s, [("Logika berurutannya: ", True, RGBColor(0xFF, 0x8A, 0x7A)),
             ("Q1 mengukur hasil → Q2 dan Q3 mencari penyebabnya di dalam perusahaan "
              "→ Q4 membandingkannya dengan pesaing → Q5 memutuskan apa yang harus "
              "dikerjakan. Melompati satu tahap membuat kesimpulannya tidak berdasar.",
              False, WHITE)], dark=True)
    d.footer(s, FOOT_A)
    return s


SLIDES_A = [s01_cover, s02_agenda, s03_divider_a, s04_q1, s05_ratios, s06_resources,
            s07_vrin, s08_dynamic, s09_swot, s10_valuechain, s11_system,
            s12_cost_options, s13_csa, s14_q5, s15_recap]
