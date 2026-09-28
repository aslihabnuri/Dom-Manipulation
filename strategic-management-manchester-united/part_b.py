"""Slides 19-32: the Manchester United case, worked through the book's six questions."""

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from deck_lib import *

FOOT_B = ("Studi Kasus  ·  Manchester United: Preparing for Life without "
          "Ferguson (Grant, 2010)")
SALMON = RGBColor(0xFF, 0x8A, 0x7A)
ASH = RGBColor(0xA8, 0x9F, 0x99)


def _chart_text(el, size=10.5, color=INK_SOFT, bold=False):
    el.font.size = Pt(size)
    el.font.bold = bold
    el.font.name = H_FONT
    el.font.color.rgb = color


def s19_divider_b(d):
    s = d.blank(bg=RED_DEEP)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    txt(s, "Bagian B", 1.15, 0.92, 5.6, 0.30, size=11.5,
        color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
    txt(s, "Manchester\nUnited", 1.15, 1.28, 5.6, 1.90, size=42, color=WHITE,
        bold=True, spacing=0.94)
    txt(s, "Preparing for Life without Ferguson", 1.15, 3.20, 5.6, 0.40, size=16,
        color=RGBColor(0xFF, 0xBF, 0xB6), italic=True, font=S_FONT)
    rect(s, 1.15, 3.78, 1.5, 0.035, fill=WHITE)
    txt(s, "Ditulis Robert M. Grant, dibantu Simon I. Peck, Christopher Carr dan "
           "Timothy Smith.  © 2010. Kasus ini bukan dari buku Thompson; kami "
           "pakai kerangka Chapter 4 untuk membedahnya.",
        1.15, 4.02, 5.3, 1.00, size=12, color=RGBColor(0xFF, 0xBF, 0xB6), spacing=1.22)

    facts = [("Waktu kasus", 1.02, 0.44,
              "Juli 2009 — tur pra-musim Asia; skuad pulang 28 Juli 2009"),
             ("Yang harus memutuskan", 1.08, 0.52,
              "David Gill, Chief Executive Manchester United Football Club Limited"),
             ("Keputusan yang dihadapi", 1.32, 0.74,
              "Menyiapkan pengganti Sir Alex Ferguson, yang akhir 2009 berusia 68 tahun "
              "dan diperkirakan pensiun akhir musim 2009–10"),
             ("Dilema intinya", 1.86, 1.28,
              "Pilih orang dalam supaya sistem Ferguson tetap jalan, tapi berisiko kurang "
              "berwibawa di depan pemain bintang. Atau pilih manajer berwibawa seperti "
              "Mourinho, yang kemungkinan besar membongkar sebagian besar sistem itu.")]
    x0, y = 7.05, 0.92
    for nm, h, th, body in facts:
        rect(s, x0, y, 5.55, h, fill=RGBColor(0x76, 0x14, 0x0D))
        rect(s, x0, y, 0.045, h, fill=WHITE)
        txt(s, nm, x0 + 0.30, y + 0.16, 4.9, 0.26, size=10.5,
            color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
        txt(s, body, x0 + 0.30, y + 0.48, 4.95, th, size=12.5, color=WHITE, spacing=1.18)
        y += h + 0.14
    notes(s, "Buka dengan jujur soal sumber: kasus ini ditulis Robert M. Grant, bukan "
             "diambil dari buku Thompson. Yang kita pakai dari Thompson adalah "
             "KERANGKANYA, yaitu enam pertanyaan Chapter 4.\n\n"
             "Tegaskan waktunya: Juli 2009. Ferguson MASIH menjabat. Semua analisis kita "
             "berdiri di titik itu, bukan dengan pengetahuan hari ini.\n\n"
             "Ceritakan pembukanya (hlm. 572–573): David Gill ikut tur Asia bersama tim. "
             "Pertandingan di Malaysia, Indonesia, Korea, dan Cina resminya latihan "
             "pra-musim, tapi kasus menyebut tujuannya hampir seluruhnya komersial. Rutenya "
             "ditentukan kesepakatan sponsor: laga Kuala Lumpur adalah imbalan sponsor tur "
             "Telekom Malaysia senilai £2 juta.\n\n"
             "Tapi yang ada di kepala Gill bukan urusan komersial. Kasus menyebut masalah "
             "terbesarnya adalah pensiunnya Ferguson — arsitek utama sukses klub selama "
             "23 tahun, yang sudah membangun seluruh infrastruktur pemanduan bakat, latihan, "
             "disiplin tim, serta taktik dan strategi.\n\n"
             "Dilema di kotak terakhir dikutip dari hlm. 588. Perhatikan kata kasusnya: "
             "manajer seperti Mourinho 'likely' — kemungkinan besar — membongkar "
             "'much of' — sebagian besar — infrastruktur Ferguson. Bukan pasti, "
             "bukan seluruhnya.")
    return s


def s20_industry(d):
    s = d.blank()
    y = d.head(s, "Konteks", "Sepakbola Eropa sebagai industri",
               "Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu "
               "industrinya seperti apa.", sublines=1)

    stats = [("€2,4 M", "Pendapatan Premier League 2007–08, terbesar di Eropa. "
              "Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar"),
             ("62%", "Porsi gaji terhadap pendapatan di Premier League. Serie A 68%, "
              "La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa"),
             ("6 dari 10", "Klub besar di Tabel 6.6 merugi selama 2000–2006. Industri "
              "ini tumbuh pesat, tapi sangat tidak menguntungkan")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for big, body in stats:
        rect(s, x, y, w, 1.46, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, big, x + 0.24, y + 0.20, w - 0.48, 0.50, size=28, color=RED,
            bold=True, font=S_FONT, spacing=0.95)
        txt(s, body, x + 0.24, y + 0.78, w - 0.48, 0.62, size=11, color=INK_SOFT,
            spacing=1.14)
        x += w + 0.28

    y2 = y + 1.74
    half = (CW - 0.40) / 2
    txt(s, "Tiga sumber pendapatan klub (Premier League 2007–08)", ML, y2, half,
        0.28, size=11, color=RED, bold=True, caps=True)
    revs = [("Matchday", "£554 jt",
             "Tiket dan hospitality. Dibatasi kapasitas stadion — itu sebabnya klub "
             "besar merenovasi atau membangun stadion baru"),
            ("Broadcasting", "£931 jt",
             "Hak siar dinegosiasikan Premier League. Kontrak 2006 bernilai £2,7 "
             "miliar; tiap klub dapat rata-rata £45 juta per tahun"),
            ("Commercial", "£447 jt",
             "Sponsor, lisensi merchandise, iklan. Terpusat di sedikit klub — Real "
             "Madrid dan Barcelona meraup lebih dari 60% sponsor La Liga")]
    yy = y2 + 0.32
    for nm, val, body in revs:
        rect(s, ML, yy, half, 0.82, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.82, fill=RED)
        txt(s, nm, ML + 0.26, yy + 0.10, 1.9, 0.28, size=13, color=INK, bold=True)
        txt(s, val, ML + half - 1.5, yy + 0.08, 1.26, 0.30, size=14, color=RED,
            bold=True, align=PP_ALIGN.RIGHT, font=S_FONT)
        txt(s, body, ML + 0.26, yy + 0.40, half - 0.52, 0.40, size=10.5,
            color=INK_SOFT, spacing=1.10)
        yy += 0.88

    x2 = ML + half + 0.40
    txt(s, "Aturan main dan logika ekonominya", x2, y2, half, 0.28, size=11,
        color=INK, bold=True, caps=True)
    pts = [("Struktur kompetisi", "20 klub Premier League, tiga terbawah turun kasta. "
            "Empat teratas lolos Champions League, kompetisi 32 klub terbaik Eropa."),
           ("Yang kaya makin kaya", "Sejak UCL dimulai 1992, muncul jurang keuangan antara "
            "MU, Chelsea, Liverpool, Arsenal dan sisanya. Uang Eropa membeli pemain bagus."),
           ("Harga pemain meledak", "Rekor transfer baru tercipta musim panas 2009 meski "
            "resesi. Pendorongnya: Real Madrid, lalu Chelsea, lalu Manchester City.")]
    yy = y2 + 0.32
    for nm, body in pts:
        txt(s, nm, x2, yy, half, 0.24, size=12, color=RED, bold=True)
        txt(s, body, x2, yy + 0.24, half, 0.46, size=11, color=INK_SOFT, spacing=1.12)
        yy += 0.78
    notes(s, "Tujuan slide ini satu: audiens paham bahwa sepakbola Eropa adalah industri "
             "yang besar tapi merugi. Itu penting, karena Q1 menilai kinerja RELATIF "
             "terhadap industri.\n\n"
             "Angka 6 dari 10 dari Tabel 6.6 (hlm. 580), ukurannya laba sebelum pajak dibagi "
             "pendapatan. Yang merugi: Chelsea (minus 60,4%), Inter (minus 78,4%), Rangers, "
             "Juventus, Celtic, Liverpool. Yang untung: MU (12,6%), Arsenal (5,6%), Bayern "
             "(4,7%), dan Real Madrid yang nyaris nol (0,4%). Kasus sendiri menyebut hanya "
             "MU, Arsenal, dan Bayern yang mencetak laba signifikan.\n\n"
             "Mekanisme 'yang kaya makin kaya' (hlm. 575): pendapatan Liga Champions dipakai "
             "membeli pemain kelas atas, dan itu memperlebar jurang antara empat klub teratas "
             "Inggris dan sisanya.\n\n"
             "Kalau ditanya soal kontrak sponsor jersey (hlm. 578): Juventus–Tamoil "
             "€110 juta/5 tahun, Arsenal–Emirates £100 juta/15 tahun, "
             "MU–Aon £80 juta/4 tahun, Chelsea–Samsung £50 juta/5 tahun. "
             "Per tahun dalam pound: MU £20 juta, Chelsea £10 juta, Arsenal sekitar "
             "£6,7 juta. Juventus sekitar €22 juta per tahun, tapi tidak bisa "
             "dibandingkan langsung karena kasus tidak memberi kurs euro–pound.")
    d.footer(s, FOOT_B)
    return s


def s21_q1_sport(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan", "Di lapangan: jelas di atas rata-rata",
               "Indikator kedua Thompson — apakah posisi dan kekuatan bersaingnya "
               "membaik — dijawab data kompetisi kasus.", sublines=1)

    stats = [("1.460", "Poin Eropa 2000–2009, tertinggi", "Tabel 6.2",
              "Barcelona 1.411 · Real Madrid 1.314 · Arsenal 1.310"),
             ("3", "Gelar liga beruntun 2007, 2008, 2009", "Tabel 6.1",
              "Total 11 gelar liga sejak 1993 dalam rentang kasus"),
             ("2008", "Liga Champions kedua di era Ferguson", "Halaman 584",
              "Yang pertama 1999, bersama gelar liga dan FA Cup")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for big, cap, src, sub in stats:
        rect(s, x, y, w, 1.86, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, big, x + 0.26, y + 0.22, w - 1.6, 0.62, size=38, color=RED, bold=True,
            font=S_FONT, spacing=0.92)
        txt(s, src, x + w - 1.42, y + 0.26, 1.16, 0.24, size=9.5, color=MUTED,
            align=PP_ALIGN.RIGHT, caps=True, bold=True)
        txt(s, cap, x + 0.26, y + 0.94, w - 0.5, 0.50, size=12.5, color=INK, bold=True,
            spacing=1.10)
        txt(s, sub, x + 0.26, y + 1.46, w - 0.5, 0.38, size=10.5, color=INK_SOFT,
            spacing=1.10)
        x += w + 0.28

    y2 = y + 2.14
    rows = [["Klub", "Poin Eropa 2000–09", "Poin performa", "Ukuran skuad",
             "Usia rata-rata"],
            ["Manchester United", "1.460", "192,5", "34", "25,6"],
            ["Barcelona", "1.411", "200,0", "24", "26,8"],
            ["Real Madrid", "1.314", "183,0", "29", "26,2"],
            ["Bayern München", "1.314", "179,5", "25", "26,5"],
            ["Arsenal", "1.310", "162,0", "31", "23,3"],
            ["Chelsea", "1.276", "144,5", "29", "27,4"]]
    cwd = [2.85, 2.40, 2.40, 2.10, 2.18]
    tbl = make_table(s, rows, ML, y2, sum(cwd), cwd, row_h=0.32, head_h=0.38,
                     size=11.5, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 4)
    for ci in range(5):
        style_cell(tbl.cell(1, ci), rows[1][ci], size=11.5, color=WHITE, bold=True,
                   fill=RED, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(1, ci), ("T", "B", "L", "R"), RED, 0.75)
    txt(s, "Di antara enam klub ini, skuad MU paling besar (34 pemain) dan termuda kedua "
           "(25,6 tahun) setelah Arsenal — cocok dengan strategi memadukan pemain muda "
           "dan pemain berpengalaman.",
        ML, y2 + 2.32, CW, 0.26, size=10, color=MUTED, italic=True)
    notes(s, "Sumber angka: Tabel 6.2 (poin Eropa), Tabel 6.1 (juara liga), dan Tabel 6.7 "
             "(poin performa, ukuran dan usia skuad).\n\n"
             "Bedakan dua kolom poin supaya tidak membingungkan:\n"
             "- Poin Eropa 2000–09 (Tabel 6.2): berdasarkan prestasi di liga domestik, "
             "piala domestik, Liga Champions, dan Intertoto Cup, disesuaikan dengan tingkat "
             "kesulitan liga. MU nomor satu.\n"
             "- Poin performa (Tabel 6.7): ukuran yang dipakai kasus untuk dibandingkan "
             "dengan belanja transfer. Di sini MU nomor dua, tipis di bawah Barcelona.\n\n"
             "Soal kartu 2008: itu Liga Champions (European Cup) KEDUA di era Ferguson, "
             "setelah 1999. Jangan sebut 'gelar Eropa kedua', karena kasus hlm. 584 juga "
             "mencatat Piala Winners Eropa 1991 — itu juga gelar Eropa.\n\n"
             "Soal ukuran skuad: klaimnya hanya berlaku untuk enam klub di tabel ini. Di "
             "Tabel 6.7 lengkap, Roma punya skuad 46 pemain dan Lyon juga 34. Jadi jangan "
             "bilang skuad MU terbesar di Eropa.")
    d.footer(s, FOOT_B)
    return s


def s22_q1_fin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan", "Di keuangan: paling untung di antara klub besar",
               "Indikator pertama Thompson — apakah kekuatan keuangan dan labanya "
               "membaik — dijawab Appendix kasus serta Tabel 6.5 dan 6.6.",
               sublines=1)

    wl = CW * 0.545
    txt(s, "Pendapatan MU, £ juta — naik 53% dari 2006 ke 2008",
        ML, y, wl, 0.28, size=11, color=RED, bold=True, caps=True)
    years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"]
    vals = [116.0, 129.6, 146.1, 173.0, 169.1, 157.2, 167.8, 212.2, 257.1]
    cd = CategoryChartData()
    cd.categories = years
    cd.add_series("Turnover", vals)
    gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(ML), Inches(y + 0.34),
                            Inches(wl), Inches(2.80), cd)
    ch = gf.chart
    ch.has_legend = False
    ch.has_title = False
    plot = ch.plots[0]
    plot.gap_width = 45
    plot.vary_by_categories = False
    ser = plot.series[0]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = MUTED
    ser.format.line.fill.background()
    for i in (7, 8):
        pt = ser.points[i]
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = RED
        pt.format.line.fill.background()
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.number_format = '0.0'
    dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    _chart_text(dl, size=9.5, color=INK_SOFT, bold=True)
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RULE
    _chart_text(ca.tick_labels, size=10, color=INK_SOFT)
    va = ch.value_axis
    va.has_major_gridlines = False
    va.visible = False
    va.maximum_scale = 300.0
    txt(s, "Entitas: plc untuk 2000–2005, Limited untuk 2006–2008. Tahun buku "
           "2000–04 sampai 31 Juli, 2005–08 sampai 30 Juni. Kasus: data 2000–04 "
           "tidak sebanding dengan 2005–08 karena perubahan akuntansi.",
        ML, y + 3.24, wl, 0.54, size=9.5, color=MUTED, spacing=1.14, italic=True)

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    kpis = [("×2,2", "Laba bersih naik dari £21,6 jt (2006) ke £46,8 jt "
             "(2008). Margin bersih 2008: 18,2%"),
            ("12,6%", "Return on sales 2000–2006 (Tabel 6.6), tertinggi dari 10 "
             "klub; Real Madrid hanya 0,4%"),
            ("€101,9 jt", "EBITDA tertinggi di Tabel 6.5 (data Forbes 2009). "
             "Margin 31,4% vs Barcelona 22,3%, Real Madrid 14,1%"),
            ("£1,14 M", "Nilai klub tertinggi di Tabel 6.5 — di atas Barcelona "
             "£960 jt dan Real Madrid £850 jt")]
    txt(s, "Bukti pendukung", x2, y, w2, 0.28, size=11, color=RED, bold=True, caps=True)
    yy = y + 0.34
    for big, body in kpis:
        rect(s, x2, yy, w2, 0.80, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.80, fill=RED)
        txt(s, big, x2 + 0.24, yy + 0.22, 1.50, 0.36, size=16, color=RED, bold=True,
            font=S_FONT)
        txt(s, body, x2 + 1.82, yy + 0.09, w2 - 2.06, 0.62, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.88

    note(s, [("Satu angka yang merusak gambaran ini: ", True, SALMON),
             ("utang £616 juta, tertinggi kedua di Tabel 6.5 setelah Arsenal "
              "(£896 juta). Kasus mencatat akuisisi Glazer 2005 dibiayai terutama "
              "dengan utang (hlm. 584).", False, WHITE)], dark=True)
    notes(s, "Grafik memakai baris Turnover dari Appendix kasus (hlm. 589). Dua batang "
             "merah adalah dua tahun terakhir sebelum kasus ditulis.\n\n"
             "Cara membacanya: bandingkan hanya di dalam periode yang sebanding. Dari 2006 "
             "ke 2008 pendapatan naik 53%, dari £167,8 juta ke £257,1 juta. Kasus hlm. 587 "
             "menyebut perluasan Old Trafford tahun 2006, terutama dari tambahan 7.500 "
             "kursi, memberi dorongan besar pada pendapatan. Penurunan 2004 ke 2005 "
             "jangan ditafsirkan sebagai kemunduran, karena di titik itulah akuntansi "
             "dan periode laporannya berubah.\n\n"
             "Kalau ditanya kualitas laba: laba sebelum pajak 2008 (£66,4 juta) sudah "
             "termasuk keuntungan penjualan pemain £21,8 juta. Jadi sebagian laba datang "
             "dari menjual pemain — itu bagian dari model bisnis MU (slide 29).\n\n"
             "PENTING dan sering ditanya dosen — kenapa data tidak sepenuhnya "
             "sebanding? Catatan kaki Appendix menyebut dua hal yang TERPISAH:\n"
             "(1) Entitas pelapor: Manchester United plc untuk 2000–2005, Manchester "
             "United Limited untuk 2006–2008.\n"
             "(2) Periode dan akuntansi: kolom 2000–2004 bertanda 12 bulan sampai 31 "
             "Juli, kolom 2005–2008 bertanda 11 bulan sampai 30 Juni, dan kasus "
             "menegaskan data 2000–4 tidak sebanding dengan 2005–8 karena "
             "perubahan akuntansi.\n"
             "Karena itu angka laba di kartu pertama sengaja memakai 2006 dan 2008, "
             "dua-duanya di periode yang sebanding.\n\n"
             "Soal 'tertinggi': Tabel 6.5 hanya memuat 15 klub besar Eropa dari daftar "
             "Forbes 2009. Jadi sebut 'tertinggi di tabel', bukan 'tertinggi di dunia'.\n\n"
             "Soal utang £616 juta — siapkan jawaban ini. Appendix menampilkan "
             "ekuitas £294 juta dan tidak memuat utang sebesar itu. Penjelasan yang "
             "paling mungkin (ini dugaan kami, tidak ditulis di kasus): utang akuisisi "
             "Glazer berada di perusahaan induk, di atas Manchester United Limited. Yang "
             "pasti dari kasus hanya dua hal: akuisisinya dibiayai terutama dengan utang "
             "(hlm. 584), dan karena itu MU tidak mendapat suntikan dana pemilik seperti "
             "Chelsea atau Man City (hlm. 579).")
    d.footer(s, FOOT_B)
    return s


def s23_q1_efficiency(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Kesimpulan", "Prestasi puncak, belanja relatif hemat",
               "Analisis turunan kami dari Tabel 6.7: dari empat klub berprestasi "
               "tertinggi, belanja bersih MU yang paling kecil.", sublines=1)

    wl = CW * 0.55
    txt(s, "Belanja transfer bersih 2003–09, £ juta — empat klub dengan poin "
           "performa tertinggi", ML, y, wl, 0.28, size=11, color=RED, bold=True, caps=True)
    clubs = ["Real Madrid (183,0 poin)", "Barcelona (200,0 poin)",
             "Bayern München (179,5 poin)", "Manchester United (192,5 poin)"]
    net = [438, 249, 122, 100]
    cd = CategoryChartData()
    cd.categories = list(reversed(clubs))
    cd.add_series("Net transfer fees", list(reversed(net)))
    gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(ML), Inches(y + 0.34),
                            Inches(wl), Inches(2.70), cd)
    ch = gf.chart
    ch.has_legend = False
    ch.has_title = False
    plot = ch.plots[0]
    plot.gap_width = 55
    plot.vary_by_categories = False
    ser = plot.series[0]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = MUTED
    ser.format.line.fill.background()
    pt = ser.points[0]
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = RED
    pt.format.line.fill.background()
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.number_format = '0'
    dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    _chart_text(dl, size=10.5, color=INK_SOFT, bold=True)
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RULE
    _chart_text(ca.tick_labels, size=10.5, color=INK)
    va = ch.value_axis
    va.has_major_gridlines = False
    va.visible = False
    va.maximum_scale = 500.0
    txt(s, "Klub lain di Tabel 6.7 ada yang belanja lebih sedikit — Arsenal £22 jt, "
           "AC Milan justru penjual bersih (−£66 jt) — tapi poinnya 162,0 dan "
           "169,0, di bawah MU.",
        ML, y + 3.10, wl, 0.48, size=10, color=MUTED, italic=True, spacing=1.14)

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    rect(s, x2, y, w2, 1.54, fill=INK)
    rect(s, x2, y, 0.05, 1.54, fill=RED)
    txt(s, "4,4×", x2 + 0.30, y + 0.16, 2.0, 0.50, size=32, color=SALMON,
        bold=True, font=S_FONT)
    txt(s, "Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs "
           "£100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.",
        x2 + 0.30, y + 0.74, w2 - 0.62, 0.76, size=12, color=WHITE, spacing=1.18)

    comps = [("Chelsea", "£430 jt belanja bersih, hanya 144,5 poin."),
             ("Barcelona", "Satu-satunya yang mengungguli MU, dengan belanja 2,5× lipat."),
             ("Kata kasus sendiri", "Belanja bersih MU “relatif sederhana” (hlm. 586).")]
    yy = y + 1.82
    for nm, body in comps:
        rect(s, x2, yy, w2, 0.58, fill=PAPER, line=RULE)
        txt(s, nm, x2 + 0.22, yy + 0.08, w2 - 0.44, 0.24, size=11.5, color=RED, bold=True)
        txt(s, body, x2 + 0.22, yy + 0.31, w2 - 0.44, 0.22, size=10.5, color=INK_SOFT,
            spacing=1.06)
        yy += 0.66

    note(s, [("Jawaban Q1: ", True, RED_DEEP),
             ("strategi MU bekerja sangat baik. Kedua indikator Thompson terpenuhi "
              "sekaligus, di industri yang mayoritas pelakunya merugi. Yang harus "
              "dijelaskan pertanyaan berikutnya: kenapa bisa begitu.", False, INK)])
    notes(s, "Slide ini analisis kami sendiri, bukan tabel yang tercetak di kasus. KATAKAN "
             "ITU. Angka mentahnya dari Tabel 6.7; perbandingannya yang kami susun.\n\n"
             "Jelaskan pilihan klubnya supaya tidak terkesan memilih-milih: grafik memuat "
             "EMPAT klub dengan poin performa tertinggi di Tabel 6.7, yaitu Barcelona "
             "(200,0), MU (192,5), Real Madrid (183,0), dan Bayern (179,5). Di antara "
             "keempatnya, belanja bersih MU paling kecil.\n\n"
             "Jangan klaim MU paling hemat di seluruh tabel — itu tidak benar. Arsenal, "
             "Lyon, Juventus, Roma, dan Valencia belanja bersih lebih sedikit, sedangkan AC "
             "Milan, Porto, dan PSV malah penjual bersih. Kalimat kasus sendiri (hlm. 586): "
             "belanja bersih MU 'relatively modest compared to other leading European clubs'.\n\n"
             "Apa itu belanja transfer bersih: total uang untuk membeli pemain dikurangi "
             "total uang dari menjual pemain. MU belanja kotor £322 juta, tapi bersihnya "
             "£100 juta — artinya MU juga banyak menjual. Kasus: Ferguson mau menjual "
             "pemain yang dihargai lebih tinggi oleh klub lain.\n\n"
             "Kasus sendiri (hlm. 580) menyebut Real Madrid dan Chelsea 'distinguished by "
             "their massive expenditures on star players'. Itu yang membuat perbandingan "
             "4,4 kali lipat relevan.\n\n"
             "Tutup dengan menyambung ke Q2 dan Q3: kalau bukan uang, lalu apa? Jawabannya "
             "ada di resource dan capability.")
    d.footer(s, FOOT_B)
    return s


def s24_swot(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Diterapkan", "SWOT Manchester United, Juli 2009",
               "Semua temuan Q1 dirangkum, lalu ditarik kesimpulan — sesuai langkah "
               "2 dan 3 Figure 4.2, bukan berhenti di daftar.", sublines=1)

    quads = [("S", "Strengths", RED, [
        "Merek global dengan 80 juta pendukung di Asia",
        "Laba tertinggi di antara klub besar: EBITDA €101,9 jt, RoS 12,6%",
        "Akademi dan jaringan pemandu bakat yang matang",
        "Disiplin transfer: belanja bersih hanya £100 jt"]),
        ("W", "Weaknesses", RED, [
            "Bergantung pada satu orang yang akhir 2009 berusia 68 tahun",
            "Belum ada keputusan suksesi; Ferguson belum menyatakan niat pensiun",
            "Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual",
            "Utang £616 jt; akuisisi Glazer 2005 dibiayai utang"]),
        ("O", "Opportunities", INK, [
            "Pasar Asia — India dan Cina disebut Aon sebagai target utama",
            "Sponsor khusus per negara masih bisa diperbanyak",
            "Pendapatan siaran Premier League naik 43% dalam setahun",
            "Kanal digital: MUTV, MU Mobile, toko online"]),
        ("T", "Threats", INK, [
            "Harga pemain meledak, didorong Manchester City (£185 jt)",
            "Pesaing berpemilik sangat kaya: Abramovich, Sheikh Mansour",
            "MU tak dapat suntikan dana pemilik seperti Chelsea dan City",
            "Barcelona unggul poin performa (200,0 vs 192,5)"])]
    gw = (CW - 0.30) / 2
    gh = 1.60
    for i, (L, nm, col, items) in enumerate(quads):
        x = ML + (i % 2) * (gw + 0.30)
        yy = y + (i // 2) * 1.76
        rect(s, x, yy, gw, gh, fill=PAPER, line=RULE)
        rect(s, x, yy, gw, 0.05, fill=col)
        txt(s, L, x + 0.24, yy + 0.16, 0.4, 0.40, size=20, color=col, bold=True, font=S_FONT)
        txt(s, nm, x + 0.66, yy + 0.20, 3.0, 0.30, size=13.5, color=INK, bold=True)
        bullets(s, items, x + 0.24, yy + 0.62, gw - 0.48, 0.96, size=10.5,
                color=INK_SOFT, gap=3, marker="·", marker_color=col, spacing=1.08)

    note(s, [("Kesimpulan (langkah 2): ", True, RED_DEEP),
             ("kekuatan MU cukup untuk menangkap peluang komersial di Asia. Tapi kelemahan "
              "terbesarnya — ketergantungan pada Ferguson — menyerang sisi lapangan, "
              "padahal bagi Gill sisi lapangan adalah syarat mengalirnya pendapatan komersial.",
              False, INK)])
    notes(s, "Ingatkan audiens: SWOT bukan bikin empat daftar. Setelah membacakan daftarnya "
             "sekilas, langsung masuk ke kesimpulan di kotak bawah — itu langkah 2 dari "
             "Figure 4.2.\n\n"
             "Kesimpulannya diuraikan: kekuatan MU terpusat di sisi komersial dan "
             "pengembangan pemain. Peluang terbesarnya juga komersial, di Asia. Jadi "
             "kekuatan dan peluang cocok — sampai di sini bagus.\n\n"
             "Masalahnya ada di kelemahan nomor satu: ketergantungan pada Ferguson. Itu "
             "menyerang sisi lapangan. Dan kasus hlm. 573 menyebut, bagi Gill, pendapatan "
             "komersial dari jersey, siaran, dan sponsor terus mengalir SELAMA tim menang "
             "dan bermain menarik. Jadi kalau sisi lapangan goyah, sisi komersial ikut "
             "terancam.\n\n"
             "PENTING soal utang, karena sering salah: kasus hlm. 584 menyatakan ketakutan "
             "bahwa utang akan membatasi Ferguson membeli pemain 'proved groundless' — "
             "tidak terbukti. Jadi jangan bilang utang membatasi pembelian pemain. Yang "
             "benar (hlm. 579): karena akuisisinya dibiayai utang, MU tidak mendapat "
             "suntikan dana pemilik seperti yang dinikmati Chelsea dan Man City. Itu "
             "sebabnya poin itu ada di kolom Threats dalam bentuk 'tak dapat suntikan dana', "
             "sementara utangnya sendiri ada di Weaknesses.\n\n"
             "Untuk langkah 3 (tindakan), sambungkan: itu yang akan kita bahas di slide "
             "priority list dan rekomendasi.")
    d.footer(s, FOOT_B)
    return s


def s25_resources(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Diterapkan", "Inventarisasi resource Manchester United",
               "Langkah pertama Q3: mendaftar aset bersaing klub memakai delapan kategori "
               "Tabel 4.3, semuanya berdasarkan bukti dari kasus.", sublines=1)

    tang = [("Finansial", "EBITDA €101,9 jt, tertinggi di Tabel 6.5; laba bersih 2008 "
             "£46,8 jt; ekuitas £294 jt."),
            ("Fisik", "Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum, tur "
             "stadion, suite dan ballroom."),
            ("Teknologi", "MUTV (siaran web), MU Mobile (SMS dan video), toko online "
             "store.manutd.com."),
            ("Organisasional", "Urusan tim (Ferguson) terpisah dari komersial (Gill; direktur "
             "komersial Richard Arnold); MU International.")]
    intang = [("Human assets", "Ferguson sejak 1986; skuad 34 pemain; lebih dari 20 pemandu "
               "bakat. Ronaldo, peringkat 1 FIFA, dijual 2009."),
              ("Merek & reputasi", "80 juta pendukung di Asia; sub-merek Fred the Red, MUFC, "
               "Red Devil. Menurut Aon, tak tertandingi di dunia olahraga."),
              ("Relasi", "Nike dan AIG (diganti Aon, £80 jt/4 tahun), ditambah 13 sponsor "
               "lain, termasuk Tri Indonesia dan Bharti Airtel."),
              ("Budaya & insentif", "Disiplin latihan ketat, perang terhadap alkohol, prinsip "
               "“tidak ada pemain yang lebih besar dari klub”.")]
    w = (CW - 0.40) / 2
    for i, (label, rows, col) in enumerate([("Tangible", tang, INK),
                                            ("Intangible", intang, RED)]):
        x = ML + i * (w + 0.40)
        rect(s, x, y, w, 3.46, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.46, fill=col)
        txt(s, label, x + 0.24, y + 0.10, w - 0.5, 0.30, size=13.5, color=WHITE, bold=True)
        yy = y + 0.62
        for nm, ex in rows:
            txt(s, nm, x + 0.24, yy, w - 0.5, 0.24, size=12, color=col, bold=True)
            txt(s, ex, x + 0.24, yy + 0.25, w - 0.5, 0.44, size=11, color=INK_SOFT,
                spacing=1.12)
            yy += 0.72

    note(s, [("Perhatikan komposisinya: ", True, RED_DEEP),
             ("aset yang paling membedakan MU ada di kolom kanan, yang tidak berwujud. Itu "
              "yang membuat klub ini unggul — dan sekaligus rapuh, karena sebagian aset "
              "tak berwujud melekat pada orang, dan orang bisa pergi.", False, INK)])
    notes(s, "Sambungkan ke Tabel 4.3 di slide 9. Delapan kotak di slide ini mengikuti "
             "persis delapan kategori buku: fisik, finansial, teknologi, organisasional "
             "di kiri; human assets, merek dan reputasi, relasi, budaya dan insentif di kanan.\n\n"
             "Bukti kekuatan merek yang layak diceritakan lengkap (hlm. 573): David "
             "Prosperi, VP Global Public Relations Aon, mengatakan bahwa setahun setelah "
             "sponsor AIG dimulai, AIG melompat dari luar daftar 100 merek dunia ke peringkat "
             "47. Kalimatnya: Manchester United tidak ada tandingannya di dunia olahraga soal "
             "kesadaran merek global, khususnya di Asia. Itu bukan klaim MU, tapi kesaksian "
             "pihak yang membayar.\n\n"
             "Kutipan Andy Anson, mantan direktur komersial (hlm. 587): 'We're not just a "
             "sports club, we are an international brand.' Sub-mereknya dibagi per usia: "
             "Fred the Red untuk anak, MUFC untuk remaja, Red Devil untuk dewasa.\n\n"
             "Angka sponsor dari kasus hlm. 587: selain dua sponsor utama Nike dan AIG, ada "
             "Budweiser, Audi, Betfred, Hublot, Tri Indonesia, Bharti Airtel, plus tujuh "
             "sponsor lain — total 13.\n\n"
             "Kalimat penutup slide penting: aset tak berwujud bisa pergi. Ronaldo sudah "
             "dijual. Ferguson akan pensiun. Stadion dan merek tidak ke mana-mana.")
    d.footer(s, FOOT_B)
    return s


def s26_capabilities(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Diterapkan", "Capability MU, dan mana yang core",
               "Kami pakai tangga di slide 7: mana yang sekadar competence, mana yang "
               "distinctive, dan mana yang benar-benar core competence.", sublines=2)

    caps = [("Mengenali dan mengembangkan bakat", "CORE",
             "Pemandu bakat dari 5 jadi lebih dari 20 orang; Youth Academy; dua pemandu "
             "bakat penuh waktu di Brasil sejak 2008.", RED_DEEP),
            ("Membentuk dan merotasi tim", "CORE",
             "Memadukan pemain muda dengan pemain berpengalaman. Kasus menyebut Ferguson "
             "pelopor rotasi skuad.", RED_DEEP),
            ("Mengubah merek jadi uang", "CORE",
             "Sponsor khusus Indonesia dan India, sub-merek per usia, MU Finance, MU Mobile, "
             "MUTV, Soccer Schools, tur Asia.", RED_DEEP),
            ("Disiplin di pasar transfer", "DISTINCTIVE",
             "Belanja kotor £322 jt, bersih £100 jt. Mau menjual pemain yang "
             "dihargai lebih tinggi klub lain, seperti Ronaldo (£80 jt).", RED),
            ("Tata kelola klub", "DISTINCTIVE",
             "Kasus: klub Inggris “paling berhasil membangun tata kelola yang efektif”. "
             "Glazer memilih peran pasif.", RED),
            ("Mengelola stadion dan acara", "COMPETENCE",
             "Old Trafford disewakan untuk konferensi dan pernikahan; museum dan tur. "
             "Dikerjakan baik, tapi klub besar lain juga melakukannya.", MUTED)]
    w = (CW - 2 * 0.26) / 3
    for i, (nm, tag, body, col) in enumerate(caps):
        x = ML + (i % 3) * (w + 0.26)
        yy = y + (i // 3) * 1.76
        rect(s, x, yy, w, 1.60, fill=PAPER, line=RULE)
        rect(s, x, yy, w, 0.05, fill=col)
        txt(s, tag, x + 0.22, yy + 0.16, w - 0.44, 0.22, size=9.5, color=col,
            bold=True, caps=True)
        txt(s, nm, x + 0.22, yy + 0.42, w - 0.44, 0.34, size=12.5, color=INK, bold=True,
            spacing=1.06)
        txt(s, body, x + 0.22, yy + 0.80, w - 0.44, 0.72, size=10.5, color=INK_SOFT,
            spacing=1.14)

    note(s, [("Yang perlu disadari: ", True, RED_DEEP),
             ("tiga capability yang langsung menentukan prestasi lapangan — bakat, tim, "
              "dan transfer — dibangun dan diarahkan oleh Ferguson. Tiga lainnya "
              "berdiri di luar dirinya.", False, INK)])
    notes(s, "Slide ini menerapkan tangga competence dari slide 7. Label CORE, DISTINCTIVE "
             "dan COMPETENCE adalah penilaian kelompok kami; jelaskan alasannya.\n\n"
             "CORE — dikerjakan sangat baik DAN berada di jantung strategi:\n"
             "- Mengenali dan mengembangkan bakat. Catatan jujur: kasus (hlm. 580) menyebut "
             "Bayern, Barcelona, Arsenal, dan Valencia juga menekankan pengembangan pemain "
             "sendiri. Jadi ini core bagi MU, tapi tidak unik. Yang khas MU menurut kasus "
             "(hlm. 583) adalah memadukan talenta muda dengan pemain berpengalaman.\n"
             "- Membentuk dan merotasi tim. Kutipan Ferguson (hlm. 585): 'The best teams "
             "stand out because they are teams.' Ia juga disebut pelopor squad rotation.\n"
             "- Mengubah merek jadi uang. Kasus menyebut MU dan Real Madrid klub paling "
             "fokus komersial di Eropa.\n\n"
             "DISTINCTIVE — lebih baik dari pesaing, tapi bukan inti strategi:\n"
             "- Disiplin transfer. Kasus (hlm. 586): Ferguson mau menjual pemain yang "
             "dihargai lebih tinggi klub lain — Beckham, Verón, van Nistelrooy, "
             "Ronaldo dengan rekor dunia £80 juta.\n"
             "- Tata kelola. Kasus hlm. 587 menyebut MU salah satu klub Inggris pertama yang "
             "go public dan yang paling berhasil membangun tata kelola efektif. 'Paling "
             "berhasil' berarti lebih baik dari pesaing, jadi distinctive.\n\n"
             "COMPETENCE — dikerjakan baik, tapi tidak membedakan:\n"
             "- Mengelola stadion. Kasus hlm. 577 menyebut sebagian besar klub papan atas "
             "merenovasi stadionnya, dan Arsenal membangun stadion baru. Jadi ini wajar "
             "dimiliki klub besar.\n\n"
             "Kalimat penutup di kotak bawah adalah jembatan ke slide VRIN.")
    d.footer(s, FOOT_B)
    return s


def s27_vrin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Uji VRIN", "Dua keunggulan, sama-sama lolos VRIN",
               "Kami uji dua hal dengan empat saringan yang sama: sistem Ferguson, dan "
               "merek beserta mesin komersialnya.", sublines=1)

    rows = [["Tes", "Sistem Ferguson", "Merek & mesin komersial"],
            ["Valuable",
             "LOLOS. Poin Eropa tertinggi, tiga gelar liga beruntun, Liga Champions 2008. "
             "Ferguson memenangi lebih banyak gelar daripada seluruh sejarah klub sebelumnya.",
             "LOLOS. Aon membayar £80 jt untuk 4 tahun, atau £20 jt per tahun — "
             "dua kali lipat Chelsea–Samsung (£10 jt per tahun)."],
            ["Rare",
             "LOLOS. Tabel 6.8 hanya memuat 15 pelatih paling dihormati dunia; Ferguson "
             "paling lama di satu klub, sejak 1986.",
             "LOLOS. Kasus hanya menyebut MU dan Real Madrid sebagai pemimpin eksploitasi "
             "merek global. MU punya 80 juta pendukung di Asia."],
            ["Inimitable",
             "LOLOS. Kasus sendiri menyebut penentu performa tim “tetap misteri … "
             "menentang analisis” — causal ambiguity. Ditambah 23 tahun akumulasi "
             "dan social complexity.",
             "LOLOS. Dibangun sejak 1878 lewat sejarah dan prestasi panjang. Chelsea, meski "
             "belanja besar, pendapatannya masih di bawah MU: €268,9 jt vs €324,8 jt "
             "(Tabel 6.5)."],
            ["Nonsubstitutable",
             "LOLOS. Jalan lain pesaing — membeli bintang dengan uang besar — tidak "
             "menyamai hasilnya: tim bertabur bintang Real Madrid dan Chelsea “gagal "
             "mencapai kejayaan” (hlm. 583).",
             "LOLOS. Superstar bisa mendongkrak penjualan merchandise (hlm. 578), tapi "
             "pemain datang dan pergi. Basis fan tetap: Aon menyebut fan Asia MU faktor "
             "kunci kontraknya (hlm. 573)."]]
    cwd = [1.70, (CW - 1.70) / 2, (CW - 1.70) / 2]
    tbl = make_table(s, rows, ML, y, CW, cwd, row_h=0.64, head_h=0.38,
                     size=10.5, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.LEFT])
    for ri, h in enumerate([0.64, 0.60, 0.82, 0.78], start=1):
        tbl.rows[ri].height = Inches(h)

    note(s, [("Kesimpulan Q3: ", True, SALMON),
             ("keduanya lolos VRIN, jadi keduanya tahan terhadap serangan PESAING. Bedanya "
              "ada di luar VRIN: merek melekat pada klub, sedangkan sistem Ferguson "
              "dibangun dan dipimpin satu orang yang akan segera pensiun.", False, WHITE)],
         dark=True)
    notes(s, "Ini slide paling penting di seluruh presentasi. Beri waktu lebih.\n\n"
             "Jalankan baris per baris. Hasilnya sama di kedua kolom: empat-empatnya lolos. "
             "Itu menjelaskan kenapa MU mendominasi sepakbola Inggris dan Eropa selama "
             "dua dekade.\n\n"
             "Baris Inimitable — kutip kasusnya langsung, karena ini hadiah dari "
             "penulis kasus (hlm. 583): 'the determinants of team performance remained a "
             "mystery … depends on a complex mix of factors that defies analysis.' Itu "
             "definisi causal ambiguity. Untuk social complexity, kutip Ferguson (hlm. 585): "
             "ia ingin membangun hubungan personal dengan semua orang di klub, termasuk "
             "pegawai kantor, juru masak, dan petugas binatu.\n\n"
             "Baris Nonsubstitutable — jelaskan definisinya dulu, karena paling sering "
             "keliru. Tes N BUKAN bertanya 'kalau Ferguson pergi, bisakah MU menggantinya?'. "
             "Tes N bertanya 'bisakah PESAING mencapai hasil yang sama dengan resource JENIS "
             "LAIN?'. Buku: 'invulnerable to the threat of substitution from different types "
             "of resources and capabilities'.\n\n"
             "Resource jenis lain yang dipakai pesaing adalah UANG untuk membeli bintang. "
             "Kasus menjawab sendiri bahwa jalan itu gagal: 'Real Madrid and Chelsea's "
             "lavishing of vast sums of money to build star-studded teams has yielded teams "
             "that have failed to achieve greatness.' Kasus juga bilang 'team performance is "
             "not simply a product of the quality of the players in the team.' Jadi uang "
             "bukan pengganti yang setara.\n\n"
             "Catatan jujur kalau ditanya: Chelsea tetap juara liga 2005 dan 2006 (Tabel 6.1) "
             "dengan cara itu. Tapi ongkosnya return on sales minus 60,4% (Tabel 6.6). "
             "Substitusi bisa berhasil sesaat, tapi tidak setara dan tidak berkelanjutan.\n\n"
             "Untuk merek, jalan lain pesaing adalah membeli superstar. Kasus hlm. 578 "
             "mengakui itu: Zidane, Beckham dan Ronaldo mendongkrak lisensi dan merchandise "
             "Real Madrid. Tapi itu pengganti parsial, karena pemain bisa pergi — Ronaldo "
             "sudah dijual MU. Basis fan melekat pada klub, dan Aon sendiri menyebut basis "
             "fan Asia sebagai faktor kunci kontrak £80 juta (hlm. 573). Jadi tetap LOLOS, "
             "dengan catatan itu.\n\n"
             "KESIMPULAN YANG HARUS SAMPAI: kalau keduanya lolos VRIN, di mana masalah MU? "
             "Jawabannya ada di luar VRIN. VRIN hanya menguji ancaman dari pesaing. VRIN "
             "tidak menguji risiko perusahaan KEHILANGAN resource-nya sendiri. Merek "
             "dimiliki klub dan tidak bisa pensiun. Sistem Ferguson dibangun dan dipimpin "
             "satu orang yang akhir 2009 berusia 68 tahun. Buku membahas risiko ini di "
             "bagian 'resources must be managed dynamically' (slide 12) — dan itulah "
             "isi slide berikutnya.")
    d.footer(s, FOOT_B)
    return s


def s28_dynamic(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Dynamic Capability", "Tiga kali membangun ulang tim juara",
               "Inilah yang tidak diukur VRIN: apakah kemampuan memperbarui diri ini "
               "milik klub, atau milik satu orang.", sublines=1)

    cycles = [("1986 – 1993", "Membersihkan dan membangun fondasi",
               "Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang "
               "berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, "
               "Cantona, Keane. Ia juga menegakkan disiplin latihan.",
               "FA Cup 1990 · Piala Winners 1991 · liga pertama era Ferguson 1993"),
              ("1994 – 2003", "Generasi akademi",
               "Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil "
               "Neville, serta Scholes. Mereka jadi inti tim yang mendominasi sepakbola "
               "Inggris.",
               "Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup"),
              ("2003 – 2008", "Regenerasi kedua",
               "Kasus mencatat Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. "
               "Penggantinya antara lain Ferdinand, Ronaldo, Rooney, van der Sar, Evra, "
               "Vidić, Carrick.",
               "Liga Champions 2008 · tiga gelar liga beruntun 2007–2009")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for period, nm, body, out in cycles:
        rect(s, x, y, w, 3.20, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, period, x + 0.26, y + 0.22, w - 0.52, 0.30, size=14, color=RED, bold=True,
            font=S_FONT)
        txt(s, nm, x + 0.26, y + 0.58, w - 0.52, 0.32, size=13.5, color=INK, bold=True,
            spacing=1.06)
        txt(s, body, x + 0.26, y + 0.96, w - 0.52, 1.40, size=11, color=INK_SOFT,
            spacing=1.16)
        rect(s, x + 0.26, y + 2.46, w - 0.52, 0.012, fill=RULE)
        txt(s, out, x + 0.26, y + 2.60, w - 0.52, 0.50, size=10.5, color=RED,
            bold=True, spacing=1.12)
        x += w + 0.28

    note(s, [("Preseden dari kasus sendiri: ", True, SALMON),
             ("setelah Matt Busby pensiun 1969, MU merosot. Selama 18 tahun sebelum "
              "Ferguson datang, MU tidak memenangi satu pun gelar liga dan hanya sekali "
              "jadi runner-up (hlm. 583).", False, WHITE)], dark=True)
    notes(s, "Sambungkan ke slide 12: dynamic capability adalah kemampuan memperbarui "
             "resource dan capability secara terus-menerus, sampai memperbarui itu sendiri "
             "jadi rutinitas.\n\n"
             "Tiga siklus di slide ini adalah buktinya. MU tidak sekadar beruntung punya "
             "satu generasi emas. MU membongkar dan membangun ulang tiga kali, dan setiap "
             "kali menghasilkan tim juara.\n\n"
             "Siklus kedua: kasus hlm. 584 menyebut MU juara liga junior Inggris tahun 1990, "
             "dengan tim yang berisi Giggs, Beckham, Butt, Gary dan Phil Neville, serta "
             "Scholes. Pakai tahun 1990 sesuai kasus.\n\n"
             "Siklus ketiga: kasus mencatat pemain inti tim 1999 dijual antara 2003 dan "
             "2008. Ini menunjukkan MU berani melepas ikonnya sendiri.\n\n"
             "INI TITIK SAMBUNG DENGAN SLIDE VRIN. Di slide sebelumnya, sistem Ferguson "
             "lolos keempat tes VRIN — artinya pesaing tidak bisa meniru atau "
             "mengakalinya. Tapi VRIN tidak menjawab pertanyaan di slide ini: apakah "
             "kemampuan memperbarui diri itu milik KLUB, atau milik FERGUSON? Buku membahas "
             "risiko ini di bagian 'resources and capabilities must be managed "
             "dynamically': resource bisa menyusut dan hilang.\n\n"
             "Kasus memberi petunjuk yang tidak menyenangkan (hlm. 583): setelah Busby "
             "pensiun 1969, MU merosot dan Liverpool menjadi klub terkuat Inggris. Selama "
             "18 tahun sebelum Ferguson datang, MU tidak memenangi satu pun gelar liga. Pola "
             "yang sama bisa terulang.")
    d.footer(s, FOOT_B)
    return s


def s29_valuechain(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 4 · Diterapkan", "Rantai nilai dan struktur biaya MU",
               "Kerangka Figure 4.3 dipetakan ke aktivitas nyata sebuah klub. Hasilnya: "
               "keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.",
               sublines=2)

    prim = [("Supply Chain", "Mendapatkan pemain",
             "Akademi, 20+ pemandu bakat, pasar transfer"),
            ("Operations", "Latihan dan bertanding",
             "Disiplin latihan, rotasi skuad, taktik"),
            ("Distribution", "Menyalurkan tontonan",
             "Hak siar liga dan UEFA, MUTV, Old Trafford"),
            ("Sales & Marketing", "Menjual merek",
             "Nike, AIG/Aon, 13 sponsor lain, tur Asia"),
            ("Service", "Melayani pendukung",
             "Superstore, museum, Soccer Schools, MU Mobile")]
    w = (CW * 0.62 - 4 * 0.12) / 5
    txt(s, "Primary activities", ML, y, CW * 0.62, 0.26, size=11, color=RED,
        bold=True, caps=True)
    x = ML
    for nm, role, ev in prim:
        rect(s, x, y + 0.30, w, 1.86, fill=PAPER, line=RULE)
        rect(s, x, y + 0.30, w, 0.05, fill=RED)
        txt(s, nm, x + 0.14, y + 0.44, w - 0.28, 0.42, size=10.5, color=MUTED,
            bold=True, spacing=1.04)
        txt(s, role, x + 0.14, y + 0.90, w - 0.28, 0.42, size=12, color=INK, bold=True,
            spacing=1.04)
        txt(s, ev, x + 0.14, y + 1.36, w - 0.28, 0.72, size=9.5, color=INK_SOFT,
            spacing=1.12)
        x += w + 0.12

    x2 = ML + CW * 0.62 + 0.40
    w2 = CW - CW * 0.62 - 0.40
    txt(s, "Di mana letak keunggulan biayanya", x2, y, w2, 0.26, size=11, color=RED,
        bold=True, caps=True)
    srcs = [("Gaji hanya ± 50% pendapatan",
             "Rata-rata Premier League 62%, Serie A 68%, Chelsea 81%. Selisih 31 poin "
             "dengan Chelsea.", RED),
            ("Akademi: pemain tanpa biaya transfer",
             "Giggs, Beckham, Butt, Neville bersaudara, Scholes: inti tim 1994–2003 "
             "(hlm. 584).", RED),
            ("Menjual pemain yang dihargai tinggi",
             "Kotor £322 jt, bersih hanya £100 jt (2003–09). Ronaldo dilepas £80 jt, "
             "rekor dunia.", RED),
            ("Yang melawan arah",
             "Amortisasi pemain naik dari £24,2 jt (2005) ke £35,5 jt (2008).",
             INK)]
    yy = y + 0.30
    for nm, body, col in srcs:
        rect(s, x2, yy, w2, 0.74, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.74, fill=col)
        txt(s, nm, x2 + 0.24, yy + 0.09, w2 - 0.48, 0.24, size=11.5, color=INK, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.33, w2 - 0.48, 0.36, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.82

    sup = [("Product R&D & Systems", "Metodologi akademi, inovasi rotasi skuad, MUTV"),
           ("Human Resource Management", "Rekrutmen, struktur gaji, penegakan disiplin"),
           ("General Administration", "Pemisahan peran Gill dan Ferguson; MU International")]
    y2 = y + 2.26
    txt(s, "Support activities", ML, y2, CW * 0.62, 0.26, size=11, color=INK,
        bold=True, caps=True)
    w3 = (CW * 0.62 - 2 * 0.16) / 3
    x = ML
    for nm, body in sup:
        rect(s, x, y2 + 0.30, w3, 0.94, fill=TINT, line=RULE)
        rect(s, x, y2 + 0.30, 0.05, 0.94, fill=INK)
        txt(s, nm, x + 0.20, y2 + 0.40, w3 - 0.4, 0.24, size=10.5, color=INK, bold=True)
        txt(s, body, x + 0.20, y2 + 0.66, w3 - 0.4, 0.48, size=9.5, color=INK_SOFT,
            spacing=1.10)
        x += w3 + 0.16

    note(s, [("Nilai bagi dua pihak berbeda. ", True, RED_DEEP),
             ("Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford. Bagi "
              "sponsor: akses ke 80 juta pendukung Asia, ditambah bukti bahwa akses itu "
              "bekerja — lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.",
              False, INK)])
    notes(s, "Terjemahkan Figure 4.3 ke bahasa sepakbola dulu, supaya audiens paham:\n"
             "Supply chain di pabrik artinya membeli bahan baku. Di klub, 'bahan bakunya' "
             "adalah pemain — jadi supply chain MU adalah akademi dan pasar transfer.\n"
             "Operations di pabrik artinya mengolah bahan jadi produk. Di klub, artinya "
             "latihan dan pertandingan.\n"
             "Distribution artinya menyalurkan produk. Di klub, produknya tontonan, "
             "disalurkan lewat siaran televisi dan stadion.\n\n"
             "Temuan utamanya: keunggulan biaya MU ada di HULU. MU tidak lebih hemat dalam "
             "melatih atau beriklan; MU lebih hemat dalam MENDAPATKAN pemain.\n\n"
             "Angka gaji dari kasus hlm. 578: rata-rata Premier League 62%, Serie A 68%, "
             "La Liga 63%. Chelsea 81%, tertinggi di antara klub Inggris. MU dan Arsenal "
             "masing-masing membayar sekitar setengah pendapatannya untuk gaji.\n\n"
             "Soal sponsor (hlm. 587): selain Nike dan AIG (yang diganti Aon 2010), ada "
             "Budweiser, Audi, Betfred, Hublot, Tri Indonesia, Bharti Airtel, plus tujuh "
             "sponsor lain — total 13. Hanya Tri Indonesia dan Bharti Airtel yang "
             "khusus satu negara.\n\n"
             "Bedakan sumber dua kartu tengah. Akademi menekan kebutuhan MEMBELI: generasi "
             "Giggs dan Scholes menjadi inti tim 1994–2003 tanpa biaya transfer (hlm. 584). "
             "Penjualan menekan belanja BERSIH: kasus hlm. 586 menyebut Ferguson mau menjual "
             "pemain yang dinilai lebih tinggi oleh klub lain, dan 'as a result' belanja "
             "bersih MU relatif sederhana. Laba penjualan pemain di Appendix 2008 saja "
             "£21,8 juta. Jangan sebut 'menjual di puncak harga' — kasus tidak bilang "
             "begitu.\n\n"
             "Jangan lupa yang melawan arah: amortisasi pemain naik hampir 50% dari 2005 "
             "ke 2008. Angka ini sengaja memakai periode 2005–2008 karena Appendix "
             "menyatakan data 2000–2004 tidak sebanding. Amortisasi adalah biaya "
             "akuntansi dari pembelian pemain, jadi MU juga makin banyak membeli.\n\n"
             "Untuk customer value proposition, ingatkan rumus di slide 13: V dikurangi P. "
             "MU punya dua 'pelanggan' dengan V berbeda — pendukung dan sponsor.")
    d.footer(s, FOOT_B)
    return s


def s30_csa(d):
    s = d.blank()
    rect(s, ML, 0.44, 0.30, 0.055, fill=RED)
    txt(s, "Pertanyaan 5 · Diterapkan", ML + 0.42, 0.36, CW - 0.42, 0.26, size=10,
        color=RED, bold=True, spacing=1.0, caps=True)
    txt(s, "Matriks kekuatan kompetitif Manchester United", ML, 0.68, CW, 0.50, size=27,
        color=INK, bold=True, spacing=0.98)
    txt(s, "Bobot dan rating disusun kelompok kami berdasarkan Tabel 6.2, 6.3, 6.5, 6.6 "
           "dan 6.7 kasus. Isi sel: rating (1–10) / skor tertimbang.",
        ML, 1.22, CW, 0.28, size=11.5, color=INK_SOFT)

    y = 1.60
    rows = [["Key Success Factor", "Bobot", "Man United", "Real Madrid", "Barcelona",
             "Chelsea", "Arsenal"],
            ["Kualitas skuad", "0,15", "6 / 0,90", "9 / 1,35", "10 / 1,50", "9 / 1,35", "6 / 0,90"],
            ["Kemampuan manajer", "0,15", "10 / 1,50", "5 / 0,75", "8 / 1,20", "6 / 0,90", "8 / 1,20"],
            ["Akademi & pemandu bakat", "0,10", "9 / 0,90", "3 / 0,30", "9 / 0,90", "3 / 0,30", "8 / 0,80"],
            ["Merek & basis pendukung", "0,15", "10 / 1,50", "9 / 1,35", "7 / 1,05", "5 / 0,75", "6 / 0,90"],
            ["Kemampuan komersial", "0,10", "10 / 1,00", "9 / 0,90", "7 / 0,70", "5 / 0,50", "6 / 0,60"],
            ["Profitabilitas", "0,10", "10 / 1,00", "5 / 0,50", "7 / 0,70", "1 / 0,10", "6 / 0,60"],
            ["Keleluasaan finansial (utang)", "0,10", "4 / 0,40", "7 / 0,70", "9 / 0,90", "5 / 0,50", "2 / 0,20"],
            ["Stadion & matchday", "0,05", "9 / 0,45", "8 / 0,40", "9 / 0,45", "5 / 0,25", "9 / 0,45"],
            ["Rekam jejak prestasi", "0,10", "10 / 1,00", "9 / 0,90", "10 / 1,00", "9 / 0,90", "9 / 0,90"],
            ["TOTAL SKOR TERTIMBANG", "1,00", "8,65", "7,15", "8,40", "5,55", "6,55"]]
    cwd = [3.40, 0.95, 1.52, 1.52, 1.52, 1.50, 1.50]
    row_h, head_h = 0.305, 0.38
    tbl = make_table(s, rows, ML, y, sum(cwd), cwd, row_h=row_h, head_h=head_h,
                     size=10.5, head_size=10,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 6)
    for ri in range(1, 10):
        style_cell(tbl.cell(ri, 2), rows[ri][2], size=10.5, color=RED_DEEP, bold=True,
                   fill=RED_TINT, align=PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(ri, 2), ("T", "B", "L", "R"), RULE, 0.75)
    for ci in range(7):
        style_cell(tbl.cell(10, ci), rows[10][ci], size=12, color=WHITE, bold=True,
                   fill=INK, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(10, ci), ("T", "B", "L", "R"), INK, 0.75)
    style_cell(tbl.cell(10, 2), "8,65", size=14, color=SALMON, bold=True, fill=INK,
               align=PP_ALIGN.CENTER, font=S_FONT)
    set_cell_border(tbl.cell(10, 2), ("T", "B", "L", "R"), INK, 0.75)

    y2 = y + head_h + 10 * row_h + 0.24
    boxes = [("Unggul 0,25 poin", "MU 8,65 vs Barcelona 8,40. Tipis: cukup satu baris "
              "turun untuk menghapusnya.", RED),
             ("Turun ke 7,90", "Kalau rating manajer jatuh dari 10 ke 5 karena ganti "
              "pelatih, MU langsung di bawah Barcelona.", INK),
             ("Butuh minimal 8,3", "Rating yang harus dicapai pengganti Ferguson supaya "
              "MU sekadar bertahan sejajar Barcelona.", INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for big, body, col in boxes:
        rect(s, x, y2, w, 1.16, fill=PAPER if col is RED else INK,
             line=RULE if col is RED else None)
        rect(s, x, y2, 0.05, 1.16, fill=RED)
        txt(s, big, x + 0.26, y2 + 0.12, w - 0.5, 0.34, size=16,
            color=RED if col is RED else SALMON, bold=True, font=S_FONT)
        txt(s, body, x + 0.26, y2 + 0.52, w - 0.5, 0.58, size=10.5,
            color=INK_SOFT if col is RED else WHITE, spacing=1.10)
        x += w + 0.26
    notes(s, "Bilang dari awal: bobot dan rating ini KAMI yang menentukan, berdasarkan "
             "data kasus. Itu memang cara kerja alat ini — buku pun memakai contoh "
             "hipotetis di Tabel 4.4.\n\n"
             "Alasan beberapa rating yang mungkin ditanya:\n"
             "- Kualitas skuad MU hanya 6, padahal juara. Sebabnya: Tabel 6.3 (peringkat "
             "pemain dunia FIFA 2008–09) hanya memuat satu pemain MU, yaitu Ronaldo — dan "
             "ia dijual ke Real Madrid sebelum akhir Juni 2009 (Tabel 6.4). Jadi per Juli "
             "2009, MU tidak punya pemain di daftar itu. Barcelona punya empat (Messi, Xavi, "
             "Eto'o, Iniesta), ditambah Deco yang tercatat 'Barcelona and Chelsea'. Kasus "
             "hlm. 580 menyebut Barcelona dan Chelsea sebagai tim paling bertabur bintang. "
             "Real Madrid tetap 9 karena musim panas 2009 membeli Ronaldo, Kaká dan Benzema "
             "(Tabel 6.4).\n"
             "- Kemampuan manajer MU 10, Real Madrid 5. Sebabnya: Ferguson punya masa "
             "jabatan di satu klub terpanjang di Tabel 6.8, sementara Real Madrid "
             "mengganti 10 pelatih kepala antara 2003 dan Juli 2009 (hlm. 581).\n"
             "- Keleluasaan finansial MU hanya 4 karena utang £616 juta dan tidak ada "
             "suntikan dana pemilik (hlm. 579). Tapi jangan bilang utang membatasi "
             "belanja pemain — kasus hlm. 584 menyebut ketakutan itu 'proved groundless'. "
             "Arsenal 2 karena utangnya £896 juta, tertinggi di Tabel 6.5.\n\n"
             "Sekarang bagian yang paling penting.\n"
             "MU unggul dari Barcelona hanya 0,25 poin. Dari mana selisih itu? MU unggul "
             "di merek (+0,45), lalu di manajer, komersial, dan profitabilitas (masing-"
             "masing +0,30). MU kalah di kualitas skuad (−0,60) dan keleluasaan finansial "
             "(−0,50). Baris lainnya seri.\n\n"
             "Dari semua baris itu, hanya satu yang diperkirakan berubah drastis dalam "
             "waktu dekat: baris manajer, karena Ferguson diperkirakan pensiun musim panas "
             "2010 (hlm. 588).\n\n"
             "Coba turunkan rating itu dari 10 ke 5, seolah penggantinya manajer "
             "rata-rata. Skor MU turun 0,75 menjadi 7,90 — langsung di bawah "
             "Barcelona.\n\n"
             "Hitung titik impasnya, dengan asumsi baris lain tetap: MU tanpa baris "
             "manajer punya 7,15. Supaya totalnya kembali ke 8,40, baris manajer harus "
             "menyumbang 1,25. Dengan bobot 0,15, ratingnya minimal 8,3. Artinya "
             "penggantinya harus manajer kelas dunia, bukan sekadar bagus.\n\n"
             "Ini menghubungkan Q5 kembali ke Q3: baris yang paling rapuh di matriks "
             "adalah resource yang lolos VRIN tapi melekat pada satu orang. Itu risiko "
             "yang tidak diukur VRIN — dan karena itulah slide 28 membahas dynamic "
             "capability.")
    d.footer(s, FOOT_B)
    return s


def s31_q6(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 6 · Diterapkan", "Priority list dan rekomendasi kami",
               "Keluaran akhir Chapter 4: isu yang harus masuk meja David Gill, "
               "ditambah usulan tindakan dari kelompok kami.", sublines=1)

    wl = CW * 0.45
    worries = [("1", "Siapa pengganti Ferguson: orang dalam atau dari luar?",
                "Dilema Gill: kesinambungan sistem vs wibawa di depan bintang."),
               ("2", "Bagaimana mempertahankan sistem latihan, bakat, dan tim?",
                "Gill ingin sistem Ferguson dipertahankan sebanyak mungkin."),
               ("3", "Apa yang dilakukan dengan uang penjualan Ronaldo?",
                "Media menyorot apakah uangnya dipakai membeli Ribéry."),
               ("4", "Apakah perlu posisi director of football?",
                "Lazim di Eropa daratan; di Inggris sering memicu konflik."),
               ("5", "Bagaimana menjaga pendapatan komersial jika prestasi turun?",
                "Menurut Gill, uang komersial mengalir selama tim terus menang."),
               ("6", "Bagaimana bersaing tanpa suntikan dana pemilik?",
                "Utang £616 jt; tak ada suntikan dana seperti Chelsea dan City.")]
    txt(s, "Priority list — berisi pertanyaan, bukan jawaban", ML, y, wl, 0.26,
        size=11, color=RED, bold=True, caps=True)
    yy = y + 0.32
    for n, nm, body in worries:
        rect(s, ML, yy, wl, 0.66, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.66, fill=RED)
        txt(s, n, ML + 0.22, yy + 0.17, 0.28, 0.30, size=14, color=RED, bold=True, font=S_FONT)
        txt(s, nm, ML + 0.58, yy + 0.07, wl - 0.82, 0.26, size=11, color=INK, bold=True,
            spacing=1.04)
        txt(s, body, ML + 0.58, yy + 0.34, wl - 0.82, 0.28, size=9.5, color=INK_SOFT,
            spacing=1.06)
        yy += 0.74

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Rekomendasi kelompok 4", x2, y, w2, 0.26, size=11, color=INK, bold=True, caps=True)
    recs = [("Lembagakan sistem Ferguson sebelum ia pergi",
             "Tuliskan sistem pemanduan bakat, akademi, latihan dan rotasi menjadi prosedur "
             "klub, supaya tidak ikut pensiun bersama orangnya."),
            ("Pilih penerus dari dalam, dengan masa transisi",
             "Orang dalam menjaga sistem tetap jalan; Ferguson mendampingi sebagai mentor "
             "untuk menutup kekurangan wibawa yang dikhawatirkan Gill."),
            ("Tolak opsi revolusi",
             "Kasus sendiri menyebut manajer seperti Mourinho kemungkinan besar membongkar "
             "sebagian besar infrastruktur Ferguson — padahal sistem itu lolos keempat "
             "tes VRIN."),
            ("Lindungi dan percepat mesin komersial",
             "Merek lolos VRIN dan, tidak seperti sistem Ferguson, melekat pada klub. "
             "Perkuat India dan Cina sekarang, selagi prestasi masih tinggi."),
            ("Siapkan ruang finansial untuk masa transisi",
             "Utang sejauh ini tidak menghambat belanja pemain (hlm. 584), tapi masa ganti "
             "pelatih adalah saat klub paling butuh keleluasaan.")]
    yy = y + 0.32
    for nm, body in recs:
        rect(s, x2, yy, w2, 0.78, fill=TINT, line=RULE)
        rect(s, x2, yy, 0.05, 0.78, fill=INK)
        txt(s, nm, x2 + 0.24, yy + 0.09, w2 - 0.48, 0.24, size=11.5, color=RED_DEEP, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.33, w2 - 0.48, 0.42, size=10, color=INK_SOFT,
            spacing=1.08)
        yy += 0.86
    notes(s, "Ingatkan aturan Q6 dari slide 17: priority list berisi PERTANYAAN, bukan "
             "jawaban. Kolom kiri semuanya berbentuk 'siapa', 'bagaimana', 'apa yang "
             "dilakukan', dan 'apakah perlu' — persis pola buku.\n\n"
             "Sumber tiap isu di kasus:\n"
             "1. Dilema suksesi: hlm. 588, dilema yang disadari Gill saat menimbang calon "
             "pengganti.\n"
             "2. Mempertahankan sistem: hlm. 588 — 'it was important to maintain as "
             "much as possible of the system of training, scouting, and team development "
             "that Sir Alex had put in place.'\n"
             "3. Uang penjualan Ronaldo: hlm. 588 — media menyorot apakah uangnya "
             "dipakai untuk menawar Franck Ribéry dari Bayern.\n"
             "4. Director of football: hlm. 581 — lazim di Eropa daratan, tapi di "
             "Inggris sering memicu konflik dengan manajer (Chelsea, Newcastle).\n"
             "5. Ketergantungan komersial: hlm. 573 — bagi Gill, pendapatan komersial "
             "terus mengalir selama tim menang dan bermain menarik.\n"
             "6. Dana pemilik: hlm. 579 — karena Glazer membiayai akuisisinya dengan "
             "utang, MU tidak mendapat suntikan dana seperti Chelsea atau Man City.\n\n"
             "PENTING soal utang: jangan bilang utang membatasi pembelian pemain. Kasus "
             "hlm. 584 justru menyatakan ketakutan itu 'proved groundless'. Isunya adalah "
             "tidak adanya suntikan dana pemilik di pasar transfer yang sedang meledak.\n\n"
             "Kolom kanan adalah rekomendasi kami, dan itu sudah masuk tahap berikutnya "
             "— penyusunan strategi. Pisahkan keduanya saat bicara.\n\n"
             "Logika rekomendasi 1: sistem Ferguson lolos VRIN, jadi layak dipertahankan. "
             "Masalahnya hanya satu: sistem itu dibangun dan dipimpin satu orang. Solusinya "
             "memindahkan sistem itu ke dalam prosedur klub supaya bertahan setelah ia pergi.\n\n"
             "Logika rekomendasi 3, dari kasus hlm. 588: jika MU menunjuk manajer berwibawa "
             "seperti Mourinho, 'it was likely that this would involve a revolutionary change "
             "in coaching strategy in which much of Ferguson's infrastructure would be taken "
             "down and rebuilt.' Membongkar aset yang lolos VRIN adalah pilihan yang mahal.\n\n"
             "Kalau ada yang berargumen orang dalam kurang berwibawa — itu memang "
             "kekhawatiran Gill di kasus, dan kami tidak menyangkalnya. Karena itulah kami "
             "mengusulkan masa transisi dengan Ferguson tetap mendampingi.")
    d.footer(s, FOOT_B)
    return s


def s32_thanks(d):
    s = d.blank(bg=INK)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    rect(s, SW - 0.34, 0, 0.34, SH, fill=RED)
    txt(s, "Terima kasih", 0, 2.30, SW, 1.0, size=52, color=WHITE, bold=True,
        align=PP_ALIGN.CENTER)
    rect(s, SW / 2 - 0.85, 3.52, 1.7, 0.04, fill=RED)
    txt(s, "Kami membuka sesi tanya jawab dan diskusi", 0, 3.82, SW, 0.40, size=15,
        color=ASH, align=PP_ALIGN.CENTER)
    txt(s, "Kelompok 4", 0, 4.66, SW, 0.28, size=10, color=RED, bold=True,
        align=PP_ALIGN.CENTER, caps=True)
    txt(s, "Fitra Aidila   ·   Aulia Sisca Rahmadiyanti   ·   Bagaskoro   ·   "
           "Imam Prayudha   ·   Tegar Awanto",
        0, 4.96, SW, 0.40, size=14, color=WHITE, align=PP_ALIGN.CENTER)
    txt(s, "Strategic Management  ·  Dr. Rangga Almahendra, S.T., M.M.", 0, 5.52,
        SW, 0.30, size=11.5, color=MUTED, align=PP_ALIGN.CENTER)
    txt(s, "Chapter 4 — Thompson, Peteraf, Gamble & Strickland, 2024 Release ISE   |   "
           "Kasus: Manchester United, Robert M. Grant (2010)",
        0, 6.40, SW, 0.30, size=10, color=RGBColor(0x5A, 0x51, 0x4D),
        align=PP_ALIGN.CENTER)
    notes(s, "Pertanyaan yang paling mungkin muncul, dan jawabannya:\n\n"
             "1. Kenapa enam pertanyaan, bukan lima?\n"
             "Edisi lama buku ini memakai lima pertanyaan dengan SWOT diselipkan ke dalam "
             "analisis resource. Edisi 2024 memisahkan SWOT jadi Q2 tersendiri.\n\n"
             "2. Kenapa sistem Ferguson lolos Nonsubstitutable, padahal ia akan pensiun?\n"
             "Karena tes N bertanya apakah PESAING bisa mencapai hasil yang sama dengan "
             "resource jenis lain — bukan apakah MU bisa mengganti Ferguson. Jalan lain "
             "pesaing, membeli bintang dengan uang besar, tidak menyamai hasilnya: tim "
             "Real Madrid dan Chelsea 'failed to achieve greatness' (hlm. 583). Risiko "
             "pensiun itu nyata, tapi tempatnya di luar VRIN: resource harus dikelola "
             "secara dinamis (slide 12 dan 28).\n\n"
             "3. Kalau sistem Ferguson dan merek sama-sama lolos VRIN, kenapa MU tetap "
             "rentan?\n"
             "Karena VRIN menguji serangan dari pesaing, bukan kehilangan dari dalam. "
             "Sistem Ferguson dibangun dan dipimpin satu orang yang diperkirakan pensiun "
             "musim panas 2010. Selain itu, kedua keunggulan saling bergantung: menurut "
             "pandangan Gill, pendapatan komersial terus mengalir selama tim menang dan "
             "bermain menarik (hlm. 573).\n\n"
             "4. Kenapa laporan keuangan MU terlihat sehat padahal utangnya £616 juta?\n"
             "Angka £616 juta berasal dari Tabel 6.5 (data Forbes). Appendix memuat akun "
             "Manchester United plc (2000–2005) dan Manchester United Limited "
             "(2006–2008), dan tidak memuat utang sebesar itu — bunga bersih 2008 malah "
             "tercatat positif, £0,46 juta. Dugaan kami, dan ini tidak ditulis di kasus: "
             "utang akuisisi Glazer berada di perusahaan induk, di atas klub.\n\n"
             "5. Apakah akademi MU capability organisasi atau perpanjangan tangan "
             "Ferguson?\n"
             "Kasus tidak memberi jawaban pasti. Yang mendukung 'milik organisasi': ada "
             "akademi dan lebih dari 20 pemandu bakat. Yang mendukung 'milik Ferguson': "
             "seluruh infrastruktur itu ia yang membangun (hlm. 573), dan Gill menilai "
             "penting untuk mempertahankannya sebanyak mungkin (hlm. 588).\n\n"
             "6. Utang £616 juta itu weakness atau threat?\n"
             "Weakness, karena sumbernya internal: akuisisi Glazer dibiayai terutama "
             "dengan utang (hlm. 584). Threat adalah faktor dari luar. Tapi hati-hati: "
             "kasus yang sama menyebut kekhawatiran bahwa utang akan membatasi pembelian "
             "pemain 'proved groundless'. Kelemahannya ada di neraca dan di tidak adanya "
             "suntikan dana pemilik, bukan di belanja pemain yang terhambat.")
    return s


SLIDES_B = [s19_divider_b, s20_industry, s21_q1_sport, s22_q1_fin, s23_q1_efficiency,
            s24_swot, s25_resources, s26_capabilities, s27_vrin, s28_dynamic,
            s29_valuechain, s30_csa, s31_q6, s32_thanks]
