"""Slides 16-32: the Manchester United case, analysed with the Chapter 4 frameworks."""

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


def s16_divider_b(d):
    s = d.blank(bg=RED_DEEP)
    rect(s, 0, 0, 0.34, SH, fill=RED)
    txt(s, "Bagian B", 1.15, 0.92, 5.6, 0.30, size=11.5,
        color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
    txt(s, "Manchester\nUnited", 1.15, 1.28, 5.6, 1.90, size=42, color=WHITE,
        bold=True, spacing=0.94)
    txt(s, "Preparing for Life without Ferguson", 1.15, 3.20, 5.6, 0.40, size=16,
        color=RGBColor(0xFF, 0xBF, 0xB6), italic=True, font=S_FONT)
    rect(s, 1.15, 3.78, 1.5, 0.035, fill=WHITE)
    txt(s, "Ditulis oleh Robert M. Grant, dengan bantuan Simon I. Peck, "
           "Christopher Carr dan Timothy Smith.  © 2010.",
        1.15, 4.02, 5.3, 0.74, size=12, color=RGBColor(0xFF, 0xBF, 0xB6), spacing=1.22)

    facts = [("Waktu kasus", 1.02, 0.44,
              "Juli 2009 — tur pra-musim Asia; skuad kembali 28 Juli 2009"),
             ("Protagonis", 1.08, 0.52,
              "David Gill, Chief Executive Manchester United Football Club Limited"),
             ("Keputusan yang dihadapi", 1.32, 0.74,
              "Menyiapkan suksesi Sir Alex Ferguson, yang pada akhir 2009 berusia 68 "
              "tahun dan diperkirakan pensiun pada akhir musim 2009–10"),
             ("Dilema inti kasus", 1.86, 1.28,
              "Menunjuk penerus dari lingkaran dalam agar sistem Ferguson terjaga, tetapi "
              "berisiko kurang berwibawa di hadapan pemain bintang — atau menunjuk "
              "manajer berwibawa seperti Mourinho, yang hampir pasti membongkar "
              "infrastruktur yang dibangun Ferguson")]
    x0, y = 7.05, 0.92
    for nm, h, th, body in facts:
        rect(s, x0, y, 5.55, h, fill=RGBColor(0x76, 0x14, 0x0D))
        rect(s, x0, y, 0.045, h, fill=WHITE)
        txt(s, nm, x0 + 0.30, y + 0.16, 4.9, 0.26, size=10.5,
            color=RGBColor(0xFF, 0xBF, 0xB6), bold=True, caps=True)
        txt(s, body, x0 + 0.30, y + 0.48, 4.95, th, size=12.5, color=WHITE, spacing=1.18)
        y += h + 0.14
    return s


def s17_industry(d):
    s = d.blank()
    y = d.head(s, "Konteks", "Sepakbola Eropa sebagai industri",
               "Sebelum menilai Manchester United, kita perlu tahu industrinya — "
               "Q1 menuntut perbandingan dengan rata-rata industri.", sublines=1)

    stats = [("€2,4 M", "Pendapatan Premier League 2007–08, terbesar di Eropa; "
              "Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar"),
             ("62%", "Gaji sebagai persentase pendapatan di Premier League; Serie A 68%, "
              "La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa"),
             ("8 dari 10", "Klub besar Eropa merugi (return on sales negatif) selama "
              "2000–2006. Industri ini tumbuh pesat tetapi tidak menguntungkan")]
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
             "Tiket, season ticket, corporate box dan hospitality. Dibatasi kapasitas "
             "stadion — karena itu klub besar merenovasi atau membangun stadion baru"),
            ("Broadcasting", "£931 jt",
             "Hak siar dinegosiasikan kolektif oleh Premier League. Kontrak 2006 "
             "bernilai £2,7 miliar; tiap klub menerima rata-rata £45 juta per tahun"),
            ("Commercial", "£447 jt",
             "Sponsorship, lisensi merchandise, iklan stadion. Terkonsentrasi pada "
             "sedikit klub — Real Madrid dan Barcelona menguasai >60% sponsorship La Liga")]
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
    txt(s, "Struktur kompetisi dan logika ekonominya", x2, y2, half, 0.28, size=11,
        color=INK, bold=True, caps=True)
    pts = [("Premier League",
            "20 klub, 3 poin per kemenangan, tiga klub terbawah terdegradasi."),
           ("Champions League",
            "32 klub terbaik Eropa; empat klub teratas Inggris lolos. Musim 2008–09 MU, "
            "Barcelona, Chelsea dan Bayern masing-masing menerima lebih dari €30 juta."),
           ("Efek kesenjangan",
            "Sejak UCL dimulai 1992, muncul jurang finansial antara MU, Chelsea, Liverpool "
            "dan Arsenal dengan klub lain — pendapatan Eropa membiayai pemain kelas atas."),
           ("Inflasi transfer",
            "Biaya transfer mencapai rekor baru pada musim panas 2009 meski resesi global. "
            "Pendorongnya: Real Madrid (2000–02), Chelsea (2004–06), Man City (2008–09).")]
    yy = y2 + 0.32
    for nm, body in pts:
        txt(s, nm, x2, yy, half, 0.24, size=12, color=RED, bold=True)
        txt(s, body, x2, yy + 0.24, half, 0.40, size=11, color=INK_SOFT, spacing=1.12)
        yy += 0.66
    d.footer(s, FOOT_B)
    return s


def s18_q1_sport(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan",
               "Kinerja sporting: jelas di atas rata-rata industri",
               "Indikator pertama Thompson — apakah sasaran strategis tercapai — "
               "dijawab dengan data kompetisi Tabel 6.1, 6.2 dan 6.7.",
               sublines=1)

    stats = [("1.460", "Poin performa Eropa 2000–2009, tertinggi", "Tabel 6.2",
              "Barcelona 1.411 · Real Madrid 1.314 · Arsenal 1.310"),
             ("3", "Gelar Premier League beruntun 2007, 2008, 2009", "Tabel 6.1",
              "Total 11 gelar liga sejak 1993 dalam rentang kasus"),
             ("2008", "Juara Liga Champions, gelar Eropa kedua Ferguson", "Halaman 584",
              "Setelah treble 1999: liga, FA Cup, European Cup, Intercontinental")]
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
    rows = [["Klub", "Poin Eropa 2000–09 (T6.2)", "Poin performa (T6.7)",
             "Ukuran skuad Juli 2009", "Usia rata-rata skuad"],
            ["Manchester United", "1.460", "192,5", "34", "25,6"],
            ["Barcelona", "1.411", "200,0", "24", "26,8"],
            ["Real Madrid", "1.314", "183,0", "29", "26,2"],
            ["Bayern München", "1.314", "179,5", "25", "26,5"],
            ["Arsenal", "1.310", "162,0", "31", "23,3"],
            ["Chelsea", "1.276", "144,5", "29", "27,4"]]
    cw = [2.85, 2.40, 2.40, 2.10, 2.18]
    tbl = make_table(s, rows, ML, y2, sum(cw), cw, row_h=0.32, head_h=0.38,
                     size=11.5, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT] + [PP_ALIGN.CENTER] * 4)
    for ci in range(5):
        style_cell(tbl.cell(1, ci), rows[1][ci], size=11.5, color=WHITE, bold=True,
                   fill=RED, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(1, ci), ("T", "B", "L", "R"), RED, 0.75)
    txt(s, "Skuad MU terbesar (34 pemain) sekaligus salah satu termuda (25,6 tahun) — konsisten dengan strategi memadukan talenta muda dan pemain berpengalaman.",
        ML, y2 + 2.32, CW, 0.26, size=10, color=MUTED, italic=True)
    d.footer(s, FOOT_B)
    return s


def s19_q1_fin(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Diterapkan",
               "Kinerja finansial: paling menguntungkan di Eropa",
               "Indikator kedua Thompson — kinerja di atas rata-rata industri "
               "— dijawab dengan Appendix kasus serta Tabel 6.5 dan 6.6.",
               sublines=1)

    wl = CW * 0.545
    txt(s, "Turnover Manchester United, £ juta — naik 121% sejak 2000 "
           "(CAGR ≈ 10,5%)", ML, y, wl, 0.28, size=11, color=RED, bold=True, caps=True)
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
    txt(s, "2000–2004 = Manchester United plc, 12 bulan hingga 31 Juli. "
           "2005–2008 = Manchester United Limited, 11 bulan hingga 30 Juni. Kasus "
           "menyatakan kedua periode tidak sepenuhnya sebanding karena perubahan akuntansi.",
        ML, y + 3.24, wl, 0.54, size=9.5, color=MUTED, spacing=1.14, italic=True)

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    kpis = [("18,2%", "Net profit margin 2008 — laba bersih £46,8 jt atas "
             "turnover £257,1 jt"),
            ("12,6%", "Return on sales 2000–2006 (Tabel 6.6), tertinggi dari 10 klub "
             "besar Eropa; Real Madrid hanya 0,4%"),
            ("€101,9 jt", "EBITDA 2009 (Tabel 6.5), tertinggi di Eropa. Margin EBITDA "
             "31,4% vs Barcelona 22,3% dan Real Madrid 14,1%"),
            ("£1,14 M", "Nilai klub (Forbes 2009), peringkat 1 dunia — di atas "
             "Barcelona £960 jt dan Real Madrid £850 jt")]
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
             ("utang £616 juta (Tabel 6.5) — tertinggi kedua di Eropa setelah "
              "Arsenal (£896 juta). Utang ini berasal dari akuisisi Glazer 2005 yang "
              "dibiayai pinjaman, bukan dari operasi klub.", False, WHITE)], dark=True)
    d.footer(s, FOOT_B)
    return s


def s20_q1_efficiency(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 1 · Verdict",
               "Efisiensi modal: prestasi puncak, belanja paling hemat",
               "Analisis turunan kami dari Tabel 6.7: bukti terkuat bahwa keunggulan "
               "MU bersifat kapabilitas, bukan sekadar daya beli.",
               sublines=1)

    wl = CW * 0.55
    txt(s, "Belanja transfer bersih 2003–2009, £ juta (Tabel 6.7)", ML, y,
        wl, 0.28, size=11, color=RED, bold=True, caps=True)
    clubs = ["Real Madrid", "Chelsea", "Barcelona", "Liverpool", "Bayern München",
             "Manchester United", "Arsenal"]
    net = [438, 430, 249, 157, 122, 100, 22]
    cd = CategoryChartData()
    cd.categories = list(reversed(clubs))
    cd.add_series("Net transfer fees", list(reversed(net)))
    gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(ML), Inches(y + 0.34),
                            Inches(wl), Inches(3.00), cd)
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
    pt = ser.points[1]
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = RED
    pt.format.line.fill.background()
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.number_format = '0'
    dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    _chart_text(dl, size=10, color=INK_SOFT, bold=True)
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RULE
    _chart_text(ca.tick_labels, size=10.5, color=INK)
    va = ch.value_axis
    va.has_major_gridlines = False
    va.visible = False
    va.maximum_scale = 490.0

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    rect(s, x2, y, w2, 1.52, fill=INK)
    rect(s, x2, y, 0.05, 1.52, fill=RED)
    txt(s, "4,4×", x2 + 0.30, y + 0.16, 2.0, 0.50, size=32, color=SALMON,
        bold=True, font=S_FONT)
    txt(s, "Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs "
           "£100 jt) namun poin performanya lebih rendah: 183,0 vs 192,5.",
        x2 + 0.30, y + 0.74, w2 - 0.62, 0.76, size=12, color=WHITE, spacing=1.18)

    comps = [("Chelsea", "£430 jt belanja bersih, hanya 144,5 poin performa."),
             ("Barcelona", "£249 jt → 200,0 poin; satu-satunya yang mengungguli MU."),
             ("Arsenal & Bayern", "Lebih hemat (£22 jt, £122 jt) tetapi poinnya di bawah MU.")]
    yy = y + 1.72
    for nm, body in comps:
        rect(s, x2, yy, w2, 0.58, fill=PAPER, line=RULE)
        txt(s, nm, x2 + 0.22, yy + 0.08, w2 - 0.44, 0.24, size=11.5, color=RED, bold=True)
        txt(s, body, x2 + 0.22, yy + 0.31, w2 - 0.44, 0.22, size=10.5, color=INK_SOFT,
            spacing=1.06)
        yy += 0.66

    note(s, [("Jawaban Q1: ", True, RED_DEEP),
             ("strategi Manchester United bekerja sangat baik — memenuhi kedua "
              "indikator Thompson sekaligus, dan berkinerja jauh di atas industri yang "
              "mayoritas pelakunya merugi. Yang harus dijelaskan Q2: resource dan "
              "capability apa yang menghasilkannya.", False, INK)])
    d.footer(s, FOOT_B)
    return s


def s21_resources(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Diterapkan",
               "Inventarisasi resource Manchester United",
               "Langkah pertama Q2: mendaftar aset kompetitif yang dimiliki klub, "
               "dipisahkan antara yang berwujud dan yang tak berwujud, semuanya "
               "berdasarkan bukti dari kasus.", sublines=2)

    tang = [("Finansial", "EBITDA €101,9 jt — tertinggi di Eropa; laba bersih "
             "£46,8 jt (2008); ekuitas £294 jt"),
            ("Fisik", "Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum "
             "dan tur stadion"),
            ("Organisasional", "Pemisahan manajemen tim (Ferguson) dan komersial (Gill, "
             "Arnold); MU International (1998)"),
            ("Kontraktual", "Kontrak 34 pemain; portofolio hak sponsorship berjangka panjang")]
    intang = [("Brand", "“Kami bukan sekadar klub olahraga, kami adalah merek "
               "internasional” — Andy Anson. Sub-merek Fred the Red, MUFC, Red Devil"),
              ("Basis fan global", "80 juta pendukung di Asia; 1,2 juta pemegang kartu "
               "kredit MU di Korea Selatan saja"),
              ("Human capital", "Sir Alex Ferguson sejak 1986; Cristiano Ronaldo (peringkat "
               "1 FIFA 2008–09, dijual Juni 2009); lebih dari 20 pemandu bakat"),
              ("Reputasi", "Aon: MU “tidak ada tandingannya dalam kesadaran merek "
               "global”; AIG melompat ke peringkat 47 merek dunia dalam setahun")]
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
             ("aset paling bernilai Manchester United hampir seluruhnya intangible. "
              "Inilah yang membuat klub ini menarik sebagai kasus RBV — dan sekaligus "
              "rapuh, karena aset intangible bisa pergi berjalan kaki keluar dari pintu.",
              False, INK)])
    d.footer(s, FOOT_B)
    return s


def s22_capabilities(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Diterapkan", "Enam capability inti Manchester United",
               "Resource saja tidak menjelaskan keunggulan. Yang menjelaskan adalah "
               "kemampuan menjalankan aktivitas lebih cakap dari pesaing.",
               sublines=1)

    caps = [("01", "Identifikasi & pengembangan bakat",
             "Ferguson memperluas staf pemandu bakat dari 5 menjadi lebih dari 20 orang "
             "dan membangun Youth Academy. Dua pemandu bakat penuh waktu ditempatkan di "
             "Brasil pada 2008."),
            ("02", "Pembentukan tim",
             "“Tim terbaik menonjol karena mereka benar-benar sebuah tim — "
             "anggotanya terintegrasi sedemikian rupa sehingga tim bergerak dengan satu "
             "semangat.”"),
            ("03", "Rotasi skuad",
             "Kasus menyebut Ferguson pelopor squad rotation — menyusun ulang tim "
             "untuk mengistirahatkan pemain dan menyesuaikan taktik pada kelemahan lawan."),
            ("04", "Disiplin pasar transfer",
             "Belanja kotor £322 jt namun bersih hanya £100 jt (2003–09). "
             "Menjual di puncak nilai: Beckham, Verón, van Nistelrooy, dan Ronaldo "
             "dengan rekor dunia £80 jt."),
            ("05", "Komersialisasi merek global",
             "Sponsorship spesifik per teritori (Tri Indonesia, Bharti Airtel), sub-merek "
             "per segmen usia, MU Finance, MU Mobile, MUTV, Soccer Schools, dan tur Asia "
             "yang dirancang mengikuti kesepakatan komersial."),
            ("06", "Tata kelola & pemisahan peran",
             "Kasus menyebut MU “paling berhasil membangun tata kelola perusahaan yang "
             "efektif” di antara klub Inggris. Glazer memilih peran pasif; Ferguson dan "
             "Gill diberi kebebasan mengambil keputusan.")]
    w = (CW - 2 * 0.26) / 3
    for i, (n, nm, body) in enumerate(caps):
        x = ML + (i % 3) * (w + 0.26)
        yy = y + (i // 3) * 2.22
        rect(s, x, yy, w, 2.06, fill=PAPER, line=RULE)
        rect(s, x, yy, w, 0.05, fill=RED)
        txt(s, n, x + 0.24, yy + 0.18, 0.7, 0.34, size=15, color=RED, bold=True, font=S_FONT)
        txt(s, nm, x + 0.24, yy + 0.56, w - 0.48, 0.34, size=13, color=INK, bold=True,
            spacing=1.06)
        txt(s, body, x + 0.24, yy + 0.94, w - 0.48, 1.06, size=10.5, color=INK_SOFT,
            spacing=1.14)
    d.footer(s, FOOT_B)
    return s


def s23_vrin_ferguson(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Uji VRIN (1)",
               "Sistem Ferguson diuji dengan empat tes",
               "Inilah inti kasus. Capability nomor 1 sampai 4 di slide sebelumnya "
               "semuanya bermuara pada satu orang. Kami uji satu per satu dengan bukti "
               "dari kasus.", sublines=2)

    rows = [["Tes", "Vonis", "Bukti dari kasus"],
            ["Valuable", "LOLOS",
             "Poin Eropa tertinggi (1.460), tiga gelar liga beruntun, Liga Champions 2008, "
             "profitabilitas tertinggi di Eropa. Ferguson memenangkan lebih banyak gelar "
             "daripada seluruh sejarah klub sebelum kedatangannya."],
            ["Rare", "LOLOS",
             "Tabel 6.8 hanya memuat 16 pelatih paling dihormati dunia. Ferguson memiliki "
             "masa jabatan terpanjang di satu klub dalam daftar itu — sejak 1986."],
            ["Inimitable", "LOLOS",
             "Kasus menyatakan sendiri: “faktor penentu performa tim tetap menjadi "
             "misteri … bergantung pada campuran faktor kompleks yang menentang "
             "analisis.” Itu causal ambiguity. Ditambah path dependency 23 tahun dan "
             "social complexity — Ferguson membangun “hubungan personal dengan semua "
             "orang di sekitar klub: bukan hanya pemain dan pelatih, tetapi juga pegawai "
             "kantor, juru masak dan petugas binatu.”"],
            ["Non-substitutable", "GAGAL",
             "Tidak ada substitusi untuk Ferguson. Kasus menegaskan “pelatih yang sangat "
             "sukses di satu tim sering gagal total di tim lain”. Ketika ia pergi, "
             "capability itu tidak berpindah ke penerusnya."]]
    cw = [1.85, 1.30, CW - 3.15]
    tbl = make_table(s, rows, ML, y, CW, cw, row_h=0.56, head_h=0.40,
                     size=11, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT, PP_ALIGN.CENTER, PP_ALIGN.LEFT],
                     body_fills=[PAPER, TINT, PAPER, RED_TINT])
    for ri, h in enumerate([0.56, 0.50, 0.92, 0.74], start=1):
        tbl.rows[ri].height = Inches(h)
    for ri, (col, bg) in enumerate([(RED_DEEP, PAPER), (RED_DEEP, TINT),
                                    (RED_DEEP, PAPER), (WHITE, RED)], start=1):
        style_cell(tbl.cell(ri, 1), rows[ri][1], size=11.5, color=col, bold=True,
                   fill=bg, align=PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(ri, 1), ("T", "B", "L", "R"), RULE, 0.75)
        if ri == 4:
            style_cell(tbl.cell(ri, 0), rows[ri][0], size=11, color=WHITE, bold=True,
                       fill=RED, align=PP_ALIGN.LEFT)
            set_cell_border(tbl.cell(ri, 0), ("T", "B", "L", "R"), RULE, 0.75)

    note(s, [("Kesimpulan: ", True, SALMON),
             ("keunggulan MU nyata (lolos V dan R) tetapi tidak sustainable karena gagal "
              "tes N. Klub memperlakukan Ferguson sebagai resource, padahal yang "
              "dibutuhkan adalah capability yang melekat pada organisasi.", False, WHITE)],
         dark=True)
    d.footer(s, FOOT_B)
    return s


def s24_vrin_brand(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Uji VRIN (2)",
               "Mesin komersial: keunggulan yang benar-benar bertahan",
               "Uji yang sama pada capability nomor 5 memberi hasil berbeda — dan "
               "menunjukkan letak keunggulan jangka panjang MU.",
               sublines=1)

    wl = CW * 0.62
    txt(s, "Merek + basis fan global", ML, y, wl, 0.28, size=11, color=RED,
        bold=True, caps=True)
    tests = [("V", "Lolos", "Aon membayar £80 jt untuk 4 tahun (£20 jt per tahun) "
              "— nilai per tahun tertinggi di antara kesepakatan yang disebut kasus."),
             ("R", "Lolos", "80 juta pendukung di Asia; kasus menyebut hanya Real Madrid "
              "yang setara sebagai pemimpin eksploitasi merek global."),
             ("I", "Lolos", "Basis fan terbentuk lewat puluhan tahun prestasi dan siaran "
              "televisi — path dependency murni; tidak bisa dibeli."),
             ("N", "Lolos", "Tidak ada substitusi bagi loyalitas pendukung. Sponsor membeli "
              "akses ke basis fan itu, bukan ke stadion atau ke pemain tertentu.")]
    yy = y + 0.34
    for L, verdict, body in tests:
        rect(s, ML, yy, wl, 0.68, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.62, 0.68, fill=RED)
        txt(s, L, ML, yy + 0.12, 0.62, 0.44, size=24, color=WHITE, bold=True,
            font=S_FONT, align=PP_ALIGN.CENTER)
        txt(s, verdict, ML + 0.78, yy + 0.22, 0.80, 0.24, size=11.5, color=RED_DEEP,
            bold=True, caps=True)
        txt(s, body, ML + 1.70, yy + 0.12, wl - 1.94, 0.46, size=10.5, color=INK_SOFT,
            spacing=1.12)
        yy += 0.76

    x2 = ML + wl + 0.42
    w2 = CW - wl - 0.42
    rect(s, x2, y + 0.34, w2, 2.96, fill=INK)
    rect(s, x2, y + 0.34, 0.05, 2.96, fill=RED)
    txt(s, "Dua keunggulan, dua nasib", x2 + 0.28, y + 0.54, w2 - 0.58, 0.30, size=14,
        color=WHITE, bold=True)
    comp = [("Sistem Ferguson", "V R I · gagal N", "Melekat pada individu", SALMON),
            ("Merek & mesin komersial", "V R I N", "Melekat pada organisasi",
             RGBColor(0x8F, 0xD6, 0xA8))]
    yy = y + 1.02
    for nm, vr, note_t, col in comp:
        rect(s, x2 + 0.28, yy, w2 - 0.58, 0.80, fill=RGBColor(0x2A, 0x23, 0x20))
        txt(s, nm, x2 + 0.46, yy + 0.10, w2 - 1.0, 0.26, size=12, color=WHITE, bold=True)
        txt(s, vr, x2 + 0.46, yy + 0.37, 2.0, 0.22, size=11, color=col, bold=True)
        txt(s, note_t, x2 + 0.46, yy + 0.57, w2 - 1.0, 0.22, size=10, color=MUTED)
        yy += 0.92
    txt(s, "Jika Ferguson pergi dan prestasi turun, mesin komersial adalah "
           "satu-satunya bantalan yang tersisa.",
        x2 + 0.28, y + 2.82, w2 - 0.58, 0.42, size=10.5, color=ASH, spacing=1.14)

    note(s, [("Tetapi ada syarat yang dinyatakan kasus sendiri. ", True, RED_DEEP),
             ("David Gill: “Selama tim terus menang, pendapatan komersial akan terus "
              "mengalir.” Kalimat itu bersyarat — mesin komersial lolos VRIN, tetapi "
              "bergantung pada capability yang justru akan hilang.", False, INK)])
    d.footer(s, FOOT_B)
    return s


def s25_dynamic(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Dynamic Capability",
               "Tiga kali membangun ulang tim juara",
               "Bukti bahwa MU bukan sekadar punya satu skuad hebat, melainkan kemampuan "
               "memperbarui basis resource-nya berulang kali.", sublines=1)

    cycles = [("1986 – 1993", "Pembersihan dan fondasi",
               "Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang "
               "berkomitmen, mempertahankan Bryan Robson, mendatangkan Mark Hughes, Paul "
               "Ince, Eric Cantona dan Roy Keane. Ia juga menegakkan disiplin latihan.",
               "FA Cup 1990 · Piala Winners 1991 · gelar Premier League pertama 1993"),
              ("1994 – 2003", "Generasi akademi",
               "Juara liga junior Inggris 1990 menghasilkan Giggs, Beckham, Butt, Gary dan "
               "Phil Neville, serta Scholes. Mereka menjadi inti tim yang mendominasi "
               "sepakbola Inggris selama satu dekade.",
               "Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup"),
              ("2003 – 2008", "Regenerasi kedua",
               "Beckham, Keane, Schmeichel, Cole, Sheringham dan Stam dijual. Penggantinya "
               "Ferdinand, Ronaldo, Rooney, Saha, van der Sar, Evra, Vidić, Hargreaves "
               "dan Carrick.",
               "Liga Champions 2008 · tiga gelar liga beruntun 2007–2009")]
    w = (CW - 2 * 0.28) / 3
    x = ML
    for period, nm, body, out in cycles:
        rect(s, x, y, w, 3.30, fill=PAPER, line=RULE)
        rect(s, x, y, w, 0.05, fill=RED)
        txt(s, period, x + 0.26, y + 0.24, w - 0.52, 0.30, size=14, color=RED, bold=True,
            font=S_FONT)
        txt(s, nm, x + 0.26, y + 0.62, w - 0.52, 0.30, size=13.5, color=INK, bold=True)
        txt(s, body, x + 0.26, y + 1.00, w - 0.52, 1.44, size=11, color=INK_SOFT,
            spacing=1.16)
        rect(s, x + 0.26, y + 2.54, w - 0.52, 0.012, fill=RULE)
        txt(s, out, x + 0.26, y + 2.70, w - 0.52, 0.50, size=10.5, color=RED,
            bold=True, spacing=1.12)
        x += w + 0.28

    note(s, [("Pertanyaan yang menentukan seluruh kasus: ", True, SALMON),
             ("dynamic capability ini milik siapa — Ferguson atau klub? Setelah Matt "
              "Busby pensiun pada 1969, MU tidak memenangi satu pun gelar liga selama 18 "
              "tahun. Kasus menyediakan preseden itu sendiri, dan itu bukan kebetulan.",
              False, WHITE)], dark=True)
    d.footer(s, FOOT_B)
    return s


def s26_swot(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 2 · Sintesis", "SWOT Manchester United, Juli 2009",
               "Seluruh temuan Q1 dan Q2 dirangkum, lalu ditarik kesimpulan — sesuai "
               "langkah 2 dan 3 kerangka SWOT, bukan berhenti di daftar.", sublines=1)

    quads = [("S", "Strengths", RED, [
        "Merek global dengan 80 juta pendukung di Asia",
        "EBITDA tertinggi di Eropa (€101,9 jt); RoS 12,6%",
        "Sistem akademi dan pemandu bakat yang matang",
        "Disiplin transfer: belanja bersih hanya £100 jt"]),
        ("W", "Weaknesses", RED, [
            "Utang £616 jt warisan akuisisi Glazer 2005",
            "Ketergantungan ekstrem pada satu individu berusia 67 tahun",
            "Belum ada rencana suksesi saat kasus ditulis",
            "Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual"]),
        ("O", "Opportunities", INK, [
            "Pasar Asia — India dan Cina disebut Aon sebagai target utama",
            "Sponsorship spesifik teritori yang masih bisa diperluas",
            "Pendapatan siaran Premier League tumbuh 43% dalam setahun",
            "Monetisasi digital: MUTV, MU Mobile, toko online"]),
        ("T", "Threats", INK, [
            "Inflasi transfer didorong Manchester City (£185 jt)",
            "Pesaing berpemilik kaya: Abramovich, Sheikh Mansour",
            "Beban bunga membatasi kemampuan membeli pemain",
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

    note(s, [("Kesimpulan SWOT (langkah 2): ", True, RED_DEEP),
             ("kekuatan MU cukup untuk menangkap peluang komersial di Asia, tetapi tidak "
              "cukup menahan ancaman di pasar pemain — karena dua kelemahan terbesarnya "
              "menyerang sisi sporting yang justru menjadi syarat bagi seluruh pendapatan "
              "komersialnya.", False, INK)])
    d.footer(s, FOOT_B)
    return s


def s27_valuechain(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Diterapkan", "Rantai nilai Manchester United",
               "Kerangka Thompson dipetakan ke aktivitas nyata sebuah klub sepakbola, "
               "lengkap dengan bukti dari kasus untuk tiap aktivitas.", sublines=1)

    prim = [("Supply Chain\nManagement", "Akuisisi pemain",
             "Akademi, 20+ pemandu bakat, 2 pemandu di Brasil, pasar transfer"),
            ("Operations", "Latihan & laga",
             "Regim latihan ketat, disiplin, rotasi skuad, penguasaan lini tengah"),
            ("Distribution", "Penyaluran siaran",
             "Hak siar Premier League & UEFA, MUTV, Old Trafford"),
            ("Sales &\nMarketing", "Monetisasi merek",
             "Aon £80 jt, Nike, 13+ sponsor teritorial, tur Asia, lisensi"),
            ("Service", "Layanan pendukung",
             "Superstore, museum & tur, Soccer Schools, MU Finance, MU Mobile")]
    w = (CW - 4 * 0.14 - 1.45) / 5
    txt(s, "Primary Activities", ML, y, CW, 0.26, size=11, color=RED, bold=True, caps=True)
    x = ML
    for nm, role, ev in prim:
        rect(s, x, y + 0.32, w, 2.00, fill=PAPER, line=RULE)
        rect(s, x, y + 0.32, w, 0.05, fill=RED)
        txt(s, nm, x + 0.16, y + 0.46, w - 0.32, 0.50, size=11.5, color=MUTED,
            bold=True, spacing=1.04)
        txt(s, role, x + 0.16, y + 1.00, w - 0.32, 0.46, size=12.5, color=INK, bold=True,
            spacing=1.04)
        txt(s, ev, x + 0.16, y + 1.50, w - 0.32, 0.76, size=10, color=INK_SOFT, spacing=1.12)
        x += w + 0.14
    rect(s, x, y + 0.32, 1.45, 2.00, fill=INK)
    txt(s, "Margin", x + 0.12, y + 0.86, 1.21, 0.30, size=13, color=WHITE, bold=True,
        align=PP_ALIGN.CENTER)
    txt(s, "RoS 12,6%\n2000–2006", x + 0.12, y + 1.22, 1.21, 0.60, size=11,
        color=SALMON, bold=True, align=PP_ALIGN.CENTER, spacing=1.10)

    sup = [("Product R&D, Technology &\nSystems Development",
            "Metodologi Youth Academy, inovasi rotasi skuad, desain taktik, MUTV dan "
            "platform digital"),
           ("Human Resources Management",
            "Rekrutmen pemain dan staf, struktur gaji ≈ 50% pendapatan, penegakan "
            "disiplin, prinsip “tidak ada pemain yang lebih besar dari klub”"),
           ("General Administration",
            "Pemisahan peran Gill (komersial) dan Ferguson (tim); dewan direksi keluarga "
            "Glazer; MU International sebagai kendaraan ekspansi")]
    y2 = y + 2.60
    txt(s, "Support Activities", ML, y2, CW, 0.26, size=11, color=INK, bold=True, caps=True)
    w3 = (CW - 2 * 0.22) / 3
    x = ML
    for nm, body in sup:
        rect(s, x, y2 + 0.32, w3, 1.38, fill=TINT, line=RULE)
        rect(s, x, y2 + 0.32, 0.05, 1.38, fill=INK)
        txt(s, nm, x + 0.26, y2 + 0.44, w3 - 0.5, 0.48, size=12, color=INK, bold=True,
            spacing=1.04)
        txt(s, body, x + 0.26, y2 + 0.98, w3 - 0.5, 0.62, size=10.5, color=INK_SOFT,
            spacing=1.12)
        x += w3 + 0.22
    d.footer(s, FOOT_B)
    return s


def s28_cost(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 3 · Struktur Biaya",
               "Di mana letak keunggulan biaya MU",
               "Hasil pemetaan rantai nilai: keunggulan biaya MU terletak di HULU — "
               "pada akuisisi pemain, bukan operasi atau pemasaran.", sublines=1)

    rows = [["Klub / liga", "Gaji / pendapatan", "Implikasi"],
            ["Manchester United", "≈ 50%", "Setengah pendapatan bebas untuk investasi"],
            ["Arsenal", "≈ 50%", "Model serupa: andalkan pemain muda"],
            ["Rata-rata Premier League", "62%", "Acuan industri untuk benchmarking"],
            ["La Liga", "63%", "Sedikit di atas Premier League"],
            ["Serie A", "68%", "Tertinggi di antara liga besar"],
            ["Chelsea", "81%", "Selisih 31 poin dari MU; RoS −60,4%"]]
    cw = [2.45, 1.70, 3.20]
    tbl = make_table(s, rows, ML, y, sum(cw), cw, row_h=0.36, head_h=0.40,
                     size=11, head_size=10.5,
                     aligns=[PP_ALIGN.LEFT, PP_ALIGN.CENTER, PP_ALIGN.LEFT],
                     body_fills=[RED_TINT, PAPER, TINT, PAPER, TINT, PAPER])
    for ri, bg in ((1, RED_TINT), (6, PAPER)):
        style_cell(tbl.cell(ri, 1), rows[ri][1], size=12.5, color=RED_DEEP, bold=True,
                   fill=bg, align=PP_ALIGN.CENTER)
        set_cell_border(tbl.cell(ri, 1), ("T", "B", "L", "R"), RULE, 0.75)
    txt(s, "Angka gaji musim 2007–08 (kasus, halaman 578). Return on sales "
           "2000–2006 dari Tabel 6.6.",
        ML, y + 2.64, sum(cw), 0.26, size=9.5, color=MUTED, italic=True)

    x2 = ML + sum(cw) + 0.40
    w2 = CW - sum(cw) - 0.40
    txt(s, "Sumber keunggulan biaya", x2, y - 0.04, w2, 0.26, size=11, color=RED,
        bold=True, caps=True)
    srcs = [("Hulu: akademi",
             "Akademi menghasilkan pemain tanpa biaya transfer. Belanja bersih "
             "2003–09 hanya £100 jt.", RED),
            ("Hulu: jual di puncak nilai",
             "Ronaldo dilepas dengan rekor dunia £80 jt; laba penjualan pemain "
             "£21,8 jt pada 2008.", RED),
            ("Internal: disiplin gaji",
             "Prinsip “tidak ada pemain yang lebih besar dari klub” menahan "
             "eskalasi gaji.", RED),
            ("Beban yang melawan arah",
             "Amortisasi pemain naik dari £13,1 jt (2000) ke £35,5 jt (2008).",
             INK)]
    yy = y + 0.30
    for nm, body, col in srcs:
        rect(s, x2, yy, w2, 0.80, fill=PAPER, line=RULE)
        rect(s, x2, yy, 0.05, 0.80, fill=col)
        txt(s, nm, x2 + 0.24, yy + 0.10, w2 - 0.48, 0.24, size=11.5, color=INK, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.36, w2 - 0.48, 0.40, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.88

    note(s, [("Customer value proposition MU ada dua lapis. ", True, SALMON),
             ("Bagi pendukung: prestasi, warisan sejarah, dan pengalaman Old Trafford. "
              "Bagi sponsor: akses ke 80 juta pendukung Asia — dan bukti bahwa akses itu "
              "bekerja, yaitu lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.",
              False, WHITE)], dark=True)
    d.footer(s, FOOT_B)
    return s


def s29_csa(d):
    s = d.blank()
    rect(s, ML, 0.44, 0.30, 0.055, fill=RED)
    txt(s, "Pertanyaan 4 · Diterapkan", ML + 0.42, 0.36, CW - 0.42, 0.26, size=10,
        color=RED, bold=True, spacing=1.0, caps=True)
    txt(s, "Weighted Competitive Strength Assessment", ML, 0.68, CW, 0.50, size=28,
        color=INK, bold=True, spacing=0.98)
    txt(s, "Bobot dan rating disusun kelompok berdasarkan data Tabel 6.2, 6.3, 6.5, 6.6 "
           "dan 6.7 kasus. Format sel: rating (1–10) / skor tertimbang.",
        ML, 1.22, CW, 0.28, size=11.5, color=INK_SOFT)

    y = 1.60
    rows = [["Key Success Factor", "Bobot", "Man United", "Real Madrid", "Barcelona",
             "Chelsea", "Arsenal"],
            ["Kualitas skuad (T6.3)", "0,15", "6 / 0,90", "9 / 1,35", "10 / 1,50", "9 / 1,35", "6 / 0,90"],
            ["Kapabilitas manajer (T6.8)", "0,15", "10 / 1,50", "5 / 0,75", "8 / 1,20", "6 / 0,90", "8 / 1,20"],
            ["Akademi & pemandu bakat", "0,10", "9 / 0,90", "3 / 0,30", "9 / 0,90", "3 / 0,30", "8 / 0,80"],
            ["Merek & basis fan global", "0,15", "10 / 1,50", "9 / 1,35", "7 / 1,05", "5 / 0,75", "6 / 0,90"],
            ["Monetisasi komersial", "0,10", "10 / 1,00", "9 / 0,90", "7 / 0,70", "5 / 0,50", "6 / 0,60"],
            ["Profitabilitas (T6.5, T6.6)", "0,10", "10 / 1,00", "5 / 0,50", "7 / 0,70", "1 / 0,10", "6 / 0,60"],
            ["Fleksibilitas finansial — utang", "0,10", "4 / 0,40", "7 / 0,70", "9 / 0,90", "5 / 0,50", "2 / 0,20"],
            ["Stadion & matchday", "0,05", "9 / 0,45", "8 / 0,40", "9 / 0,45", "5 / 0,25", "9 / 0,45"],
            ["Rekam jejak sporting (T6.2)", "0,10", "10 / 1,00", "9 / 0,90", "10 / 1,00", "9 / 0,90", "9 / 0,90"],
            ["TOTAL SKOR TERTIMBANG", "1,00", "8,65", "7,15", "8,40", "5,55", "6,55"]]
    cw = [3.40, 0.95, 1.52, 1.52, 1.52, 1.50, 1.50]
    row_h, head_h = 0.305, 0.38
    tbl = make_table(s, rows, ML, y, sum(cw), cw, row_h=row_h, head_h=head_h,
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
    boxes = [("8,65 vs 8,40", "Net advantage MU atas Barcelona hanya 0,25 poin — tipis, "
              "dan bertumpu pada satu baris saja.", RED),
             ("7,90", "Jika rating manajer turun 10 ke 5, total MU jatuh ke 7,90 "
              "— di bawah Barcelona.", INK),
             ("8,3 / 10", "Rating minimum yang harus dicapai penerus Ferguson agar MU "
              "sekadar bertahan sejajar Barcelona.", INK)]
    w = (CW - 2 * 0.26) / 3
    x = ML
    for big, body, col in boxes:
        rect(s, x, y2, w, 1.16, fill=PAPER if col is RED else INK,
             line=RULE if col is RED else None)
        rect(s, x, y2, 0.05, 1.16, fill=RED)
        txt(s, big, x + 0.26, y2 + 0.12, w - 0.5, 0.34, size=17,
            color=RED if col is RED else SALMON, bold=True, font=S_FONT)
        txt(s, body, x + 0.26, y2 + 0.52, w - 0.5, 0.58, size=10.5,
            color=INK_SOFT if col is RED else WHITE, spacing=1.10)
        x += w + 0.26
    d.footer(s, FOOT_B)
    return s


def s30_worrylist(d):
    s = d.blank()
    y = d.head(s, "Pertanyaan 5 · Diterapkan", "Worry list dan rekomendasi kelompok",
               "Keluaran akhir Chapter 4: isu yang wajib masuk agenda David Gill, "
               "beserta rekomendasi tindakan kami.",
               sublines=1)

    wl = CW * 0.45
    worries = [("1", "Suksesi Ferguson tanpa peta jalan",
                "Gill belum punya keputusan; Ferguson belum mengumumkan niat pensiun."),
               ("2", "Beban utang £616 juta",
                "Membatasi daya saing justru saat Manchester City belanja £185 jt."),
               ("3", "Lubang di skuad pasca-Ronaldo",
                "Tidak ada lagi pemain MU di peringkat FIFA Tabel 6.3."),
               ("4", "Tidak ada penyangga organisasi",
                "Tanpa director of football, semua fungsi melekat pada manajer tim."),
               ("5", "Pendapatan komersial yang bersyarat",
                "Gill menyatakan aliran pendapatan bergantung pada tim yang menang."),
               ("6", "Tata kelola bergantung dua orang",
                "Peran pasif Glazer berjalan karena ada Ferguson dan Gill.")]
    txt(s, "Worry list", ML, y, wl, 0.26, size=11, color=RED, bold=True, caps=True)
    yy = y + 0.32
    for n, nm, body in worries:
        rect(s, ML, yy, wl, 0.66, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.66, fill=RED)
        txt(s, n, ML + 0.22, yy + 0.17, 0.28, 0.30, size=14, color=RED, bold=True, font=S_FONT)
        txt(s, nm, ML + 0.58, yy + 0.08, wl - 0.82, 0.24, size=11.5, color=INK, bold=True)
        txt(s, body, ML + 0.58, yy + 0.32, wl - 0.82, 0.32, size=10, color=INK_SOFT,
            spacing=1.06)
        yy += 0.74

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Rekomendasi kelompok 4", x2, y, w2, 0.26, size=11, color=INK, bold=True, caps=True)
    recs = [("Ubah resource menjadi capability sebelum Ferguson pergi",
             "Kodifikasikan sistem pemanduan bakat, akademi dan rotasi skuad menjadi "
             "prosedur organisasi. Selama ini sistem itu hidup di kepala satu orang."),
            ("Tunjuk penerus dengan masa transisi yang tumpang tindih",
             "Penerus dari lingkaran dalam menjaga sistem, dengan Ferguson sebagai mentor "
             "transisi untuk menutup kekurangan wibawa yang dikhawatirkan Gill."),
            ("Tolak opsi “revolusi”",
             "Mourinho berkonflik dengan Abramovich; Real Madrid memecat 10 pelatih dalam "
             "enam tahun. Membongkar infrastruktur Ferguson menghancurkan aset paling "
             "sulit ditiru."),
            ("Lindungi dan percepat mesin komersial",
             "Merek adalah satu-satunya keunggulan yang lolos keempat tes VRIN. Perkuat "
             "ekspansi India dan Cina sekarang, selagi prestasi masih tinggi."),
            ("Turunkan leverage untuk memulihkan fleksibilitas",
             "Fleksibilitas finansial adalah baris terlemah MU pada matriks Q4 (rating 4). "
             "Tanpa perbaikan, klub tidak bisa merespons saat transisi menuntut belanja besar.")]
    yy = y + 0.32
    for nm, body in recs:
        rect(s, x2, yy, w2, 0.78, fill=TINT, line=RULE)
        rect(s, x2, yy, 0.05, 0.78, fill=INK)
        txt(s, nm, x2 + 0.24, yy + 0.09, w2 - 0.48, 0.24, size=11.5, color=RED_DEEP, bold=True)
        txt(s, body, x2 + 0.24, yy + 0.33, w2 - 0.48, 0.42, size=10, color=INK_SOFT,
            spacing=1.08)
        yy += 0.86
    d.footer(s, FOOT_B)
    return s


def s31_epilog(d):
    s = d.blank()
    y = d.head(s, "Penutup", "Epilog dan bahan diskusi",
               "Satu slide di luar cakupan kasus, untuk menguji apakah kesimpulan analisis "
               "kami terbukti. Kasus berhenti pada Juli 2009; Ferguson akhirnya pensiun "
               "pada Mei 2013.", sublines=2)

    wl = CW * 0.52
    tl = [("2013", "Ferguson pensiun setelah gelar liga ke-13. Penerusnya, David Moyes, "
           "adalah kandidat jalur kesinambungan dan direkomendasikan Ferguson sendiri."),
          ("2013–2024", "Moyes dipecat setelah 10 bulan. Menyusul Van Gaal, Mourinho, "
           "Solskjær, Rangnick, Ten Hag, Amorim — tujuh manajer dalam sebelas tahun."),
          ("Hasil sporting", "Tidak ada gelar Premier League sejak 2013, meski belanja "
           "transfer bersih menjadi salah satu yang terbesar di Eropa."),
          ("Hasil komersial", "Pendapatan tetap tumbuh dan klub bertahan di papan atas "
           "Deloitte Football Money League bertahun-tahun setelah prestasi merosot.")]
    txt(s, "Apa yang terjadi setelah kasus", ML, y, wl, 0.26, size=11, color=RED,
        bold=True, caps=True)
    yy = y + 0.32
    for per, body in tl:
        rect(s, ML, yy, wl, 0.70, fill=PAPER, line=RULE)
        rect(s, ML, yy, 0.05, 0.70, fill=RED)
        txt(s, per, ML + 0.24, yy + 0.08, 1.9, 0.26, size=12, color=RED, bold=True, font=S_FONT)
        txt(s, body, ML + 0.24, yy + 0.32, wl - 0.48, 0.36, size=10.5, color=INK_SOFT,
            spacing=1.10)
        yy += 0.78

    rect(s, ML, yy + 0.08, wl, 0.86, fill=INK)
    rect(s, ML, yy + 0.08, 0.05, 0.86, fill=RED)
    b = txt(s, "", ML + 0.30, yy + 0.18, wl - 0.62, 0.68, size=11.5)
    rich(b, [("Yang dikonfirmasi epilog ini: ", True, SALMON),
             ("keunggulan yang gagal tes N hilang bersama orangnya, sementara yang lolos "
              "keempat tes VRIN bertahan meski prestasi runtuh — persis prediksi "
              "Chapter 4.", False, WHITE)],
         size=11.5, first=True, spacing=1.16)

    x2 = ML + wl + 0.40
    w2 = CW - wl - 0.40
    txt(s, "Pertanyaan untuk diskusi kelas", x2, y, w2, 0.26, size=11, color=INK,
        bold=True, caps=True)
    qs = ["Apakah sistem akademi dan pemanduan bakat MU benar-benar capability organisasi, "
          "atau hanya perpanjangan tangan Ferguson? Bukti apa yang mendukung tiap posisi?",
          "Jika keunggulan komersial MU lolos keempat tes VRIN, mengapa klub tetap rentan? "
          "Apa yang dilewatkan uji VRIN saat dua keunggulan saling bergantung?",
          "Apakah utang £616 juta adalah weakness atau justru threat dalam SWOT? "
          "Perbedaan klasifikasi ini mengubah rekomendasi yang mana?",
          "Dengan matriks Q4, faktor mana yang paling efektif diserang pesaing untuk "
          "menjatuhkan posisi MU, dan apa pertahanan yang tersedia?",
          "Seandainya Anda menjadi David Gill pada Juli 2009, Anda pilih kesinambungan atau "
          "revolusi? Pertahankan jawaban Anda dengan uji VRIN."]
    yy = y + 0.32
    for i, q in enumerate(qs):
        rect(s, x2, yy, w2, 0.76, fill=TINT, line=RULE)
        txt(s, str(i + 1), x2 + 0.22, yy + 0.13, 0.3, 0.30, size=14, color=RED,
            bold=True, font=S_FONT)
        txt(s, q, x2 + 0.58, yy + 0.09, w2 - 0.80, 0.60, size=10.5, color=INK, spacing=1.12)
        yy += 0.82
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
    txt(s, "Chapter 4 — Thompson, Peteraf, Gamble & Strickland   |   "
           "Kasus: Manchester United, Robert M. Grant (2010)",
        0, 6.40, SW, 0.30, size=10, color=RGBColor(0x5A, 0x51, 0x4D),
        align=PP_ALIGN.CENTER)
    return s


SLIDES_B = [s16_divider_b, s17_industry, s18_q1_sport, s19_q1_fin, s20_q1_efficiency,
            s21_resources, s22_capabilities, s23_vrin_ferguson, s24_vrin_brand,
            s25_dynamic, s26_swot, s27_valuechain, s28_cost, s29_csa, s30_worrylist,
            s31_epilog, s32_thanks]
