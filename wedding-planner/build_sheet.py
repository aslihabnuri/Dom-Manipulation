#!/usr/bin/env python3
"""Build the 'Plan It' style wedding planning workbook (to be converted to Google Sheets)."""
import sys, datetime as dt
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.chart import DoughnutChart, PieChart, BarChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.cell.rich_text import CellRichText, TextBlock
from openpyxl.cell.text import InlineFont
from openpyxl.worksheet.properties import PageSetupProperties

OUT = sys.argv[1] if len(sys.argv) > 1 else "planit.xlsx"

# ---------- names ----------
WELCOME, SETTINGS, DASH, CHK, VEN, EXP, BUD, APP, CAL, GUE, SEAT, GIF, HELP = (
    "👋 WELCOME", "⚙️ SETTINGS", "👰🤵 DASHBOARD", "📝 WEDDING CHECKLIST", "🏛️ VENDORS",
    "💰 EXPENSE TRACKER", "📊 BUDGET SUMMARY", "🤝 APPOINTMENTS", "📅 CALENDAR",
    "👥 GUEST LIST", "🪑 SEATING PLAN", "🎁 GIFTS", "HELPER")
def q(name): return "'" + name.replace("'", "''") + "'"
# settings cells
W = f"{q(SETTINGS)}!$C$9"          # wedding date
BRIDE = f"{q(SETTINGS)}!$C$6"      # bride display name
GROOM = f"{q(SETTINGS)}!$C$8"      # groom display name
BRIDE_FULL = f"{q(SETTINGS)}!$C$5"
GROOM_FULL = f"{q(SETTINGS)}!$C$7"
BUDGET = f"{q(SETTINGS)}!$C$11"

# ---------- palette & fonts ----------
CREAM, PAPER, INK, MUTED, LINE, CHAR, PINK, PINKL, GREEN, RED, AMBER = (
    "F7F4F0", "FDFCFA", "2B2927", "8A847D", "DDD6CF", "3D3B39", "E8898B", "F6D9D9", "4F9A64", "C9484C", "D9A441")
FT, FB, FM = "Playfair Display", "Montserrat", "Courier New"
def font(size=9, bold=False, italic=False, color=INK, name=FB): return Font(name=name, size=size, bold=bold, italic=italic, color=color)
def fill(c): return PatternFill("solid", start_color=c, end_color=c)
thin = Side(style="thin", color=LINE); dot = Side(style="dotted", color=LINE); hair = Side(style="hair", color=LINE)
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
ROWB = Border(bottom=dot, left=hair, right=hair)
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
RIGHT = Alignment(horizontal="right", vertical="center")
RP = '"Rp "#,##0'; DATEF = "d mmm yyyy"

wb = Workbook()
wb.remove(wb.active)
sheets = {}
def new(name, cols=30, rows=120, cream=True, grid=False):
    ws = wb.create_sheet(name); sheets[name] = ws
    ws.sheet_view.showGridLines = grid
    if cream:
        for r in range(1, rows + 1):
            for c in range(1, cols + 1):
                ws.cell(r, c).fill = fill(CREAM)
    ws.column_dimensions["A"].width = 2
    ws.page_setup.orientation = "landscape"; ws.sheet_properties.pageSetUpPr = PageSetupProperties(fitToPage=True); ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
    return ws
def put(ws, ref, value=None, f=None, fl=None, al=None, b=None, fmt=None):
    c = ws[ref]
    if value is not None: c.value = value
    if f: c.font = f
    if fl: c.fill = fill(fl) if isinstance(fl, str) else fl
    if al: c.alignment = al
    if b: c.border = b
    if fmt: c.number_format = fmt
    return c
def merge(ws, rng, value=None, **kw):
    ws.merge_cells(rng); first = rng.split(":")[0]
    put(ws, first, value, **kw)
    # style every cell of the merge so fills/borders render after conversion
    for row in ws[rng]:
        for c in row:
            if kw.get("fl"): c.fill = fill(kw["fl"])
            if kw.get("b"): c.border = kw["b"]
    return ws[first]
def bar(ws, rng, text, pink=False):
    return merge(ws, rng, text, f=font(8, True, color="FFFFFF" if not pink else INK), fl=PINK if pink else CHAR, al=CENTER)
def header_row(ws, row, c0, labels, widths=None, fl=CHAR, color="FFFFFF"):
    for i, lab in enumerate(labels):
        put(ws, f"{L(c0+i)}{row}", lab, f=font(7.5, True, color=color), fl=fl, al=CENTER if lab not in ("TASK",) else LEFT)
        if widths: ws.column_dimensions[L(c0 + i)].width = widths[i]
def title(ws, rng, text, sub=None, subrng=None):
    merge(ws, rng, text, f=font(22, name=FT), al=CENTER)
    ws.row_dimensions[int(rng.split(":")[0][1:]) if rng[1].isdigit() else 2].height = 34
    if sub: merge(ws, subrng, sub, f=font(7, color=MUTED), al=CENTER)
def input_cell(ws, ref, value=None, fmt=None, al=None):
    return put(ws, ref, value, f=font(9), fl=PAPER, al=al or LEFT, b=ROWB, fmt=fmt)
def dv(ws, formula, rng, kind="list", allow_blank=True, **kw):
    d = DataValidation(type=kind, formula1=formula, allow_blank=allow_blank, showDropDown=False, **kw)
    ws.add_data_validation(d); d.add(rng); return d
def cf(ws, rng, formula, **style):
    ws.conditional_formatting.add(rng, FormulaRule(formula=[formula], stopIfTrue=False, **style))
def widths(ws, spec):
    for col, w in spec.items(): ws.column_dimensions[col].width = w

# =====================================================================
# SETTINGS
# =====================================================================
st = new(SETTINGS, cols=24, rows=60)
widths(st, {"B": 26, "C": 30, "D": 3, "E": 42, "F": 12, "G": 18, "H": 3, "I": 30, "J": 3, "K": 22, "L": 3, "M": 14, "N": 3, "O": 16, "P": 3, "Q": 14, "R": 3, "S": 18, "T": 3, "U": 16})
title(st, "B2:U2", "Settings", "NAMES, WEDDING DATE, BUDGET AND DROPDOWN LISTS", "B3:U3")
bar(st, "B4:C4", "THE COUPLE")
rows = [("BRIDE FULL NAME", "Aulia Sisca Rahmadiyanti"), ("BRIDE DISPLAY NAME", "Aulia"), ("GROOM FULL NAME", "Aslih"),
        ("GROOM DISPLAY NAME", "Aslih"), ("WEDDING DATE", dt.date(2028, 10, 14)), ("VENUE", ""), ("TOTAL TARGET BUDGET (Rp)", 300000000), ("CURRENCY", "Rp")]
for i, (k, v) in enumerate(rows):
    r = 5 + i
    put(st, f"B{r}", k, f=font(7.5, True, color=MUTED), al=LEFT)
    input_cell(st, f"C{r}", v, fmt=("dddd, d mmmm yyyy" if k == "WEDDING DATE" else RP if "BUDGET" in k else None))
put(st, "D9", "← change this and every countdown, deadline and calendar follows", f=font(7, italic=True, color=MUTED))
put(st, "D11", "← per-category targets below use this total", f=font(7, italic=True, color=MUTED))
st["C9"].font = font(9, True)
put(st, "B14", "White cells with dotted borders are inputs. Everything else is calculated.", f=font(7.5, italic=True, color=MUTED))
# category list
CATS = [("Venue & Catering", 45), ("Decoration & Lighting & Genset", 10), ("Bridal / Dress & Attire incl. Immediate Family", 6), ("Flowers", 3),
        ("Photography & Videography & Mini Studio", 7), ("Wedding Planner & Organizer", 5), ("Jewelry & Wedding Accessories", 4),
        ("MC & Entertainment", 5), ("Hair & Makeup (incl. Immediate Family)", 4), ("Health & Beauty", 1), ("Wedding Cake", 1.5),
        ("Photobooth", 1.5), ("Invitation", 2), ("Wedding Shoes", 1), ("Favors & Gifts", 3), ("Others", 1)]
header_row(st, 15, 5, ["WEDDING CATEGORY", "SUGGESTED %", "TARGET BUDGET"])
for i, (c, p) in enumerate(CATS):
    r = 16 + i
    input_cell(st, f"E{r}", c); input_cell(st, f"F{r}", p, fmt='0.0"%"', al=RIGHT)
    put(st, f"G{r}", f"=ROUND({BUDGET}*F{r}/100,0)", f=font(9, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
CAT_RNG = f"{q(SETTINGS)}!$E$16:$E$31"; CAT_FIRST, CAT_LAST = 16, 31
put(st, "E32", "TOTAL", f=font(8, True), al=LEFT); put(st, "F32", "=SUM(F16:F31)", f=font(8, True), al=RIGHT, fmt='0.0"%"'); put(st, "G32", "=SUM(G16:G31)", f=font(9, True, name=FM), al=RIGHT, fmt=RP)
put(st, "E33", "Overwrite a TARGET BUDGET cell with your own number if you do not want the % split.", f=font(7, italic=True, color=MUTED))
lists = {
    "I": ("GUEST CATEGORY", ["Engaged Couple", "Bride's Family from Dad's side", "Bride's Family from Mom's side", "Groom's Family from Dad's side", "Groom's Family from Mom's side", "Bride's Friends", "Groom's Friends", "Mutual Friends", "Bride's Colleagues", "Groom's Colleagues", "Parents' Guests", "Others"]),
    "K": ("ROLE", ["Guest", "Mother of the Bride", "Father of the Bride", "Mother of the Groom", "Father of the Groom", "Sibling", "Family", "Maid of Honor", "Bridesmaid", "Best Man", "Groomsman", "Witness (Saksi)", "Pagar Ayu", "Pagar Bagus", "Flower Girl", "Ring Bearer", "Vendor"]),
    "M": ("RSVP", ["Pending", "Attending", "Declined"]),
    "O": ("VENDOR STATUS", ["Shortlisted", "Contacted", "Quoted", "Booked", "Rejected"]),
    "Q": ("ASSIGNED", ["=C6", "=C8", "Both"]),
    "S": ("APPOINTMENT STATUS", ["Scheduled", "Done", "Cancelled"]),
    "U": ("GIFT TYPE", ["Cash / Transfer", "Item", "Voucher", "Other"]),
}
LIST_RNG = {}
for col, (name, items) in lists.items():
    header_row(st, 15, st[f"{col}1"].column, [name])
    for i, it in enumerate(items): input_cell(st, f"{col}{16+i}", it)
    LIST_RNG[name] = f"{q(SETTINGS)}!${col}$16:${col}${15+len(items)}"
st.freeze_panes = "A5"

# =====================================================================
# HELPER (hidden): flattened task list + calendar dates
# =====================================================================
hp = new(HELP, cols=20, rows=420, cream=False, grid=True)
hp.sheet_state = "hidden"
for i, h in enumerate(["TASK", "DONE", "DEADLINE", "ASSIGNED", "HAS TASK", "OVERDUE", "WEEK RANK", "BLOCK"]):
    put(hp, f"{L(1+i)}1", h, f=font(8, True))
put(hp, "J1", "CALENDAR DATES (6 weeks x 7 days)", f=font(8, True))

# =====================================================================
# WEDDING CHECKLIST
# =====================================================================
ck = new(CHK, cols=19, rows=160)
title(ck, "B2:R2", "Task Tracker", "LIST, TRACK AND ASSIGN YOUR TASKS", "B3:R3")
TASKS = [
 (12,"Set the wedding date and confirm it with both families","Both"),(12,"Decide the total budget and who contributes what","Both"),(12,"Draft a first guest count estimate","Both"),
 (12,"Research and shortlist wedding venues","Both"),(12,"Book the wedding venue","Both"),(12,"Hire a wedding planner / organizer","Bride"),(12,"Create a shared wedding folder and mood board","Bride"),
 (11,"Book the photographer & videographer","Groom"),(11,"Book the catering (if not included in the venue)","Both"),(11,"Research decoration & lighting vendors","Bride"),(11,"Book the MC & entertainment","Groom"),(11,"Start browsing wedding dresses / kebaya","Bride"),
 (10,"Book the decoration & lighting vendor","Bride"),(10,"Book the make-up artist (bride & immediate family)","Bride"),(10,"Order the wedding dress / kebaya and groom attire","Both"),(10,"Discuss akad / ceremony requirements with both families","Both"),
 (9,"Finalise the guest list draft","Both"),(9,"Book the florist","Bride"),(9,"Choose and order wedding rings","Both"),(9,"Plan the pre-wedding photoshoot concept","Both"),
 (8,"Do the pre-wedding photoshoot","Both"),(8,"Design the wedding invitations","Bride"),(8,"Book the wedding cake vendor","Bride"),(8,"Book the photobooth","Groom"),
 (7,"Arrange accommodation for out-of-town family","Groom"),(7,"Book hairstylist for the bridal party","Bride"),(7,"Choose souvenirs / wedding favors","Both"),(7,"Start a skincare & health routine","Both"),
 (6,"Send save-the-dates","Both"),(6,"Order the invitations","Bride"),(6,"Attend the first dress fitting","Bride"),(6,"Plan the honeymoon","Groom"),(6,"Finalise the ceremony rundown with the planner","Both"),
 (5,"Order the souvenirs","Bride"),(5,"Confirm decoration design & mock-up","Bride"),(5,"Prepare marriage registration documents (KUA / Catatan Sipil)","Groom"),(5,"Book transportation for the wedding day","Groom"),
 (4,"Send the invitations","Both"),(4,"Make-up trial","Bride"),(4,"Finalise the menu & attend food tasting","Both"),(4,"Choose wedding shoes & accessories","Bride"),
 (3,"Track RSVPs and follow up guests","Both"),(3,"Second dress fitting","Bride"),(3,"Confirm the entertainment setlist","Groom"),(3,"Prepare the family uniform attire (seragam keluarga)","Both"),
 (2,"Finalise the seating plan","Both"),(2,"Confirm the vendor payment schedule","Groom"),(2,"Write vows / speeches","Both"),(2,"Final dress fitting","Bride"),(2,"Confirm honeymoon bookings","Groom"),
 (1,"Confirm the final headcount with the venue & caterer","Both"),(1,"Create the day-of timeline and share it with all vendors","Both"),(1,"Prepare vendor tip envelopes","Groom"),(1,"Final meeting with the planner","Both"),(1,"Pick up the wedding rings","Groom"),
 (0,"Technical meeting & rehearsal at the venue","Both"),(0,"Pack the wedding-day emergency kit","Bride"),(0,"Settle the final vendor payments","Groom"),(0,"Hand over the seating chart & rundown to the planner","Both"),(0,"Rest, hydrate and enjoy the week","Both"),
]
ROWS_PER_BLOCK = 16
BLOCK_COLS = [2, 8, 14]  # B, H, N
for c0 in BLOCK_COLS:
    widths(ck, {L(c0): 3.2, L(c0+1): 34, L(c0+2): 3.2, L(c0+3): 9, L(c0+4): 11.5, L(c0+5): 1.5})
helper_row = 2
done_dv = DataValidation(type="list", formula1='"TRUE,FALSE"', allow_blank=True); ck.add_data_validation(done_dv)
assign_dv = DataValidation(type="list", formula1=LIST_RNG["ASSIGNED"], allow_blank=True); ck.add_data_validation(assign_dv)
date_dv = DataValidation(type="date", operator="greaterThan", formula1="DATE(2020,1,1)", allow_blank=True); ck.add_data_validation(date_dv)
for bi, m in enumerate(range(12, -1, -1)):
    band, pos = divmod(bi, 3)
    r0 = 5 + band * (ROWS_PER_BLOCK + 5)
    c0 = BLOCK_COLS[pos]
    C = lambda k: L(c0 + k)
    if m == 12: lab = f'="12+ Months Out  //  "&TEXT(EDATE({W},-12),"mmmm yyyy")'
    elif m == 0: lab = f'="Wedding Week  //  "&TEXT({W},"d mmmm yyyy")'
    else: lab = f'="{m} Month{"s" if m > 1 else ""} Out  //  "&TEXT(EDATE({W},-{m}),"mmmm yyyy")'
    bar(ck, f"{C(0)}{r0}:{C(4)}{r0}", lab)
    ck.row_dimensions[r0].height = 20
    header_row(ck, r0 + 1, c0, ["✓", "TASK", "●", "ASSIGNED", "DEADLINE"], fl=PAPER, color=MUTED)
    for k in range(5): ck[f"{C(k)}{r0+1}"].border = Border(bottom=thin)
    tasks = [t for t in TASKS if t[0] == m]
    for i in range(ROWS_PER_BLOCK):
        r = r0 + 2 + i
        t = tasks[i] if i < len(tasks) else None
        done = put(ck, f"{C(0)}{r}", False, f=font(8, color=PAPER), fl=PAPER, al=CENTER, b=ROWB)
        task = input_cell(ck, f"{C(1)}{r}", t[1] if t else None); task.font = font(8.5)
        dotc = put(ck, f"{C(2)}{r}", f'=IF({C(1)}{r}="","","●")', f=font(11, color=LINE), fl=PAPER, al=CENTER, b=ROWB)
        asg = input_cell(ck, f"{C(3)}{r}", t[2] if t else None, al=CENTER); asg.font = font(8)
        if t and t[2] in ("Bride", "Groom"):
            asg.value = f"={BRIDE}" if t[2] == "Bride" else f"={GROOM}"
        if m == 0: dl = f'=IF({C(1)}{r}="","",{W}-1)'
        else: dl = f'=IF({C(1)}{r}="","",EOMONTH(EDATE({W},-{m}),0))'
        dlc = input_cell(ck, f"{C(4)}{r}", dl, fmt="d mmm yyyy", al=CENTER); dlc.font = font(8)
        # helper flatten
        helper_row += 1
        h = helper_row
        hp[f"A{h}"] = f'=IF({q(CHK)}!{C(1)}{r}="","",{q(CHK)}!{C(1)}{r})'
        hp[f"B{h}"] = f'=IF({q(CHK)}!{C(1)}{r}="","",{q(CHK)}!{C(0)}{r})'
        hp[f"C{h}"] = f'=IF({q(CHK)}!{C(4)}{r}="","",{q(CHK)}!{C(4)}{r})'
        hp[f"D{h}"] = f'=IF({q(CHK)}!{C(3)}{r}="","",{q(CHK)}!{C(3)}{r})'
        hp[f"E{h}"] = f'=IF(A{h}="",0,1)'
        hp[f"F{h}"] = f'=IF(AND(E{h}=1,B{h}<>TRUE,C{h}<>"",C{h}<TODAY()),1,0)'
        hp[f"G{h}"] = f'=IF(AND(E{h}=1,B{h}<>TRUE,C{h}<>"",C{h}>=TODAY(),C{h}<=TODAY()+7),COUNTIFS($E$3:E{h},1,$B$3:B{h},FALSE,$C$3:C{h},">="&TODAY(),$C$3:C{h},"<="&TODAY()+7),"")'
        hp[f"H{h}"] = m
        hp[f"C{h}"].number_format = DATEF
    done_dv.add(f"{C(0)}{r0+2}:{C(0)}{r0+1+ROWS_PER_BLOCK}"); assign_dv.add(f"{C(3)}{r0+2}:{C(3)}{r0+1+ROWS_PER_BLOCK}"); date_dv.add(f"{C(4)}{r0+2}:{C(4)}{r0+1+ROWS_PER_BLOCK}")
    # block footer: progress
    fr = r0 + 2 + ROWS_PER_BLOCK
    put(ck, f"{C(1)}{fr}", f'=COUNTIF({C(0)}{r0+2}:{C(0)}{fr-1},TRUE)&" of "&COUNTA({C(1)}{r0+2}:{C(1)}{fr-1})&" tasks done"', f=font(7, italic=True, color=MUTED))
    # conditional formats for dot & done
    rng_dot = f"{C(2)}{r0+2}:{C(2)}{fr-1}"
    a, b_, d_ = f"{C(0)}{r0+2}", f"{C(1)}{r0+2}", f"{C(4)}{r0+2}"
    cf(ck, rng_dot, f"{a}=TRUE", font=Font(color=GREEN, bold=True))
    cf(ck, rng_dot, f'AND({a}<>TRUE,{d_}<>"",{d_}<TODAY())', font=Font(color=RED, bold=True))
    cf(ck, rng_dot, f'AND({a}<>TRUE,{d_}<>"",{d_}<=TODAY()+14)', font=Font(color=AMBER, bold=True))
    cf(ck, f"{C(1)}{r0+2}:{C(1)}{fr-1}", f"{a}=TRUE", font=Font(color=MUTED, strike=True))
HELPER_LAST = helper_row
put(ck, "B4", "Tick ✓ when done (select the ✓ columns and use Insert ▸ Checkbox to turn them into real checkboxes). Deadlines are suggested from your wedding date; type over them to change.", f=font(7, italic=True, color=MUTED))
ck.merge_cells("B4:R4"); ck["B4"].alignment = Alignment(wrap_text=True, vertical="center"); ck.row_dimensions[4].height = 26
ck.freeze_panes = "A5"
T_TASK = f"{q(HELP)}!$A$3:$A${HELPER_LAST}"; T_DONE = f"{q(HELP)}!$B$3:$B${HELPER_LAST}"; T_DL = f"{q(HELP)}!$C$3:$C${HELPER_LAST}"
T_HAS = f"{q(HELP)}!$E$3:$E${HELPER_LAST}"; T_OVER = f"{q(HELP)}!$F$3:$F${HELPER_LAST}"; T_RANK = f"{q(HELP)}!$G$3:$G${HELPER_LAST}"

# =====================================================================
# VENDORS
# =====================================================================
vn = new(VEN, cols=12, rows=16 * 11 + 8)
widths(vn, {"B": 26, "C": 18, "D": 16, "E": 22, "F": 20, "G": 16, "H": 12, "I": 16, "J": 26})
title(vn, "B2:J2", "The Vendors", "KEEP EVERY VENDOR YOU SHORTLIST, BY CATEGORY, WITH CONTACTS, QUOTES AND BOOKING STATUS", "B3:J3")
put(vn, "B4", '=COUNTIF(H:H,"Booked")&" vendors booked  ·  "&TEXT(SUMIF(H:H,"Booked",I:I),"#,##0")&" in booked quotes (Rp)"', f=font(8, italic=True, color=MUTED))
vstat_dv = DataValidation(type="list", formula1=LIST_RNG["VENDOR STATUS"], allow_blank=True); vn.add_data_validation(vstat_dv)
r = 6; VROWS = 5
for ci, (cat, _) in enumerate(CATS):
    merge(vn, f"B{r}:J{r}", f"={q(SETTINGS)}!E{CAT_FIRST+ci}", f=font(8, True, color="FFFFFF"), fl=CHAR, al=CENTER)
    for c in "BCDEFGHIJ": vn[f"{c}{r+1}"].fill = fill(PINK)
    vn.row_dimensions[r + 1].height = 4
    header_row(vn, r + 2, 2, ["VENDOR NAME", "CONTACT NAME", "CONTACT NUMBER", "CONTACT EMAIL", "WEBSITE / INSTAGRAM", "REFERENCE", "STATUS", "QUOTE (Rp)", "NOTES"], fl=PAPER, color=MUTED)
    for c in "BCDEFGHIJ": vn[f"{c}{r+2}"].border = Border(bottom=thin)
    for i in range(VROWS):
        rr = r + 3 + i
        for c in "BCDEFGHIJ": input_cell(vn, f"{c}{rr}")
        vn[f"I{rr}"].number_format = RP; vn[f"I{rr}"].alignment = RIGHT; vn[f"H{rr}"].alignment = CENTER
    vstat_dv.add(f"H{r+3}:H{r+2+VROWS}")
    cf(vn, f"H{r+3}:H{r+2+VROWS}", f'H{r+3}="Booked"', font=Font(color=GREEN, bold=True))
    cf(vn, f"H{r+3}:H{r+2+VROWS}", f'H{r+3}="Rejected"', font=Font(color=MUTED, strike=True))
    r += 3 + VROWS + 2
vn.freeze_panes = "A5"

# =====================================================================
# EXPENSE TRACKER
# =====================================================================
ex = new(EXP, cols=16, rows=112)
widths(ex, {"B": 4, "C": 34, "D": 22, "E": 34, "F": 16, "G": 13, "H": 16, "I": 13, "J": 16, "K": 15, "L": 26, "M": 3, "N": 10})
title(ex, "B2:L2", "The Payments", "LIST AND FILTER YOUR PAYMENTS TOWARDS WEDDING EXPENSES, VENUE AND VENDORS", "B3:L3")
P0, PN = 9, 78
PX = 1000
def pill(ws, rng, label, formula):
    merge(ws, rng, f'="{label}      "&TEXT({formula},"#,##0")', f=font(8, True), fl=PINK, al=CENTER)
    ws.row_dimensions[int(rng.split(":")[0][1:]) if False else 5].height = 24
pill(ex, "B5:D5", "⏷  TOTAL AMOUNT DUE   Rp", f"SUM(F{P0}:F{PX})")
pill(ex, "F5:H5", "⏷  TOTAL PAID   Rp", f"SUM(H{P0}:H{PX})")
pill(ex, "J5:L5", "⏷  TOTAL REMAINING   Rp", f"SUM(J{P0}:J{PX})")
put(ex, "B6", "Use the filter arrows in the header row to filter by vendor, category or status (or Data ▸ Add a slicer for pill-style filters).", f=font(7, italic=True, color=MUTED))
bar(ex, "B7:L7", "PAYMENTS TRACKER")
header_row(ex, 8, 2, ["#", "TRANSACTION DESCRIPTION", "VENDOR", "CATEGORY", "AMOUNT DUE", "DUE DATE", "AMOUNT PAID", "PAID DATE", "REMAINING", "STATUS", "NOTES"])
put(ex, "N8", "WEEK RANK", f=font(7, True, color=MUTED))
cat_dv = DataValidation(type="list", formula1=CAT_RNG, allow_blank=True); ex.add_data_validation(cat_dv)
ex_date_dv = DataValidation(type="date", operator="greaterThan", formula1="DATE(2020,1,1)", allow_blank=True); ex.add_data_validation(ex_date_dv)
for r in range(P0, PN + 1):
    put(ex, f"B{r}", f'=IF(C{r}="","",ROW()-{P0-1})', f=font(8, color=MUTED), fl=PAPER, al=CENTER, b=ROWB)
    for c in "CDEFGHIL": input_cell(ex, f"{c}{r}")
    ex[f"F{r}"].number_format = RP; ex[f"H{r}"].number_format = RP; ex[f"F{r}"].alignment = RIGHT; ex[f"H{r}"].alignment = RIGHT
    ex[f"G{r}"].number_format = DATEF; ex[f"I{r}"].number_format = DATEF; ex[f"G{r}"].alignment = CENTER; ex[f"I{r}"].alignment = CENTER
    put(ex, f"J{r}", f'=IF(F{r}="","",F{r}-N(H{r}))', f=font(9, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
    put(ex, f"K{r}", f'=IF(F{r}="","",IF(J{r}<=0,"Paid",IF(G{r}="","Unscheduled",IF(G{r}<TODAY(),"Overdue",IF(G{r}<=TODAY()+7,"Due this week",IF(G{r}<=EOMONTH(TODAY(),0),"Due this month","Upcoming"))))))', f=font(8), fl=PAPER, al=CENTER, b=ROWB)
    put(ex, f"N{r}", f'=IF(AND(F{r}<>"",J{r}>0,G{r}<>"",G{r}>=TODAY(),G{r}<=TODAY()+7),COUNTIFS($J${P0}:J{r},">0",$G${P0}:G{r},">="&TODAY(),$G${P0}:G{r},"<="&TODAY()+7),"")', f=font(7, color=MUTED))
cat_dv.add(f"E{P0}:E{PN}"); ex_date_dv.add(f"G{P0}:G{PN}"); ex_date_dv.add(f"I{P0}:I{PN}")
cf(ex, f"K{P0}:K{PN}", f'K{P0}="Paid"', font=Font(color=GREEN, bold=True))
cf(ex, f"K{P0}:K{PN}", f'K{P0}="Overdue"', font=Font(color=RED, bold=True))
cf(ex, f"K{P0}:K{PN}", f'K{P0}="Due this week"', font=Font(color=AMBER, bold=True))
put(ex, f"C{PN+1}", "TOTAL", f=font(8, True));
for c in "FHJ": put(ex, f"{c}{PN+1}", f"=SUM({c}{P0}:{c}{PN})", f=font(9, True, name=FM), al=RIGHT, fmt=RP)
ex.auto_filter.ref = f"B8:L{PN}"
ex.freeze_panes = "A9"
PX = 1000
P_CAT = f"{q(EXP)}!$E${P0}:$E${PX}"; P_DUE = f"{q(EXP)}!$F${P0}:$F${PX}"; P_PAID = f"{q(EXP)}!$H${P0}:$H${PX}"; P_REM = f"{q(EXP)}!$J${P0}:$J${PX}"
P_DATE = f"{q(EXP)}!$G${P0}:$G${PX}"; P_DESC = f"{q(EXP)}!$C${P0}:$C${PX}"; P_VEN = f"{q(EXP)}!$D${P0}:$D${PX}"; P_RANK = f"{q(EXP)}!$N${P0}:$N${PX}"; P_STAT = f"{q(EXP)}!$K${P0}:$K${PX}"

# =====================================================================
# APPOINTMENTS
# =====================================================================
ap = new(APP, cols=15, rows=70)
widths(ap, {"B": 4, "C": 13, "D": 8, "E": 32, "F": 22, "G": 22, "H": 10, "I": 12, "J": 28, "K": 3, "L": 8, "M": 10})
title(ap, "B2:J2", "The Appointments", "FITTINGS, TASTINGS, SITE VISITS AND VENDOR MEETINGS", "B3:J3")
A0, AN = 7, 46
pill(ap, "B5:D5", "⏷  TODAY", f"COUNTIFS(C{A0}:C{AN},TODAY(),I{A0}:I{AN},\"<>Cancelled\")")
pill(ap, "F5:G5", "⏷  THIS WEEK", f"COUNTIFS(C{A0}:C{AN},\">=\"&TODAY(),C{A0}:C{AN},\"<=\"&TODAY()+7,I{A0}:I{AN},\"<>Cancelled\")")
pill(ap, "I5:J5", "⏷  UPCOMING", f"COUNTIFS(C{A0}:C{AN},\">=\"&TODAY(),I{A0}:I{AN},\"<>Cancelled\")")
header_row(ap, 6, 2, ["#", "DATE", "TIME", "APPOINTMENT", "WITH (VENDOR)", "LOCATION", "WHO", "STATUS", "NOTES"])
put(ap, "L6", "TODAY", f=font(7, True, color=MUTED)); put(ap, "M6", "WEEK RANK", f=font(7, True, color=MUTED))
astat_dv = DataValidation(type="list", formula1=LIST_RNG["APPOINTMENT STATUS"], allow_blank=True); ap.add_data_validation(astat_dv)
awho_dv = DataValidation(type="list", formula1=LIST_RNG["ASSIGNED"], allow_blank=True); ap.add_data_validation(awho_dv)
ap_date_dv = DataValidation(type="date", operator="greaterThan", formula1="DATE(2020,1,1)", allow_blank=True); ap.add_data_validation(ap_date_dv)
for r in range(A0, AN + 1):
    put(ap, f"B{r}", f'=IF(E{r}="","",ROW()-{A0-1})', f=font(8, color=MUTED), fl=PAPER, al=CENTER, b=ROWB)
    for c in "CDEFGHIJ": input_cell(ap, f"{c}{r}")
    ap[f"C{r}"].number_format = DATEF; ap[f"C{r}"].alignment = CENTER; ap[f"D{r}"].number_format = "HH:MM"; ap[f"D{r}"].alignment = CENTER
    ap[f"H{r}"].alignment = CENTER; ap[f"I{r}"].alignment = CENTER
    put(ap, f"L{r}", f'=IF(AND(C{r}=TODAY(),I{r}<>"Cancelled",E{r}<>""),1,"")', f=font(7, color=MUTED))
    put(ap, f"M{r}", f'=IF(AND(E{r}<>"",I{r}<>"Cancelled",C{r}<>"",C{r}>=TODAY(),C{r}<=TODAY()+7),COUNTIFS($C${A0}:C{r},">="&TODAY(),$C${A0}:C{r},"<="&TODAY()+7,$I${A0}:I{r},"<>Cancelled",$E${A0}:E{r},"<>"),"")', f=font(7, color=MUTED))
astat_dv.add(f"I{A0}:I{AN}"); awho_dv.add(f"H{A0}:H{AN}"); ap_date_dv.add(f"C{A0}:C{AN}")
cf(ap, f"I{A0}:I{AN}", f'I{A0}="Done"', font=Font(color=GREEN, bold=True))
cf(ap, f"I{A0}:I{AN}", f'I{A0}="Cancelled"', font=Font(color=MUTED, strike=True))
cf(ap, f"C{A0}:J{AN}", f'AND($C{A0}<>"",$C{A0}<TODAY(),$I{A0}="Scheduled")', font=Font(color=RED))
ap.auto_filter.ref = f"B6:J{AN}"; ap.freeze_panes = "A7"
AX = 1000
A_DATE = f"{q(APP)}!$C${A0}:$C${AX}"; A_TIME = f"{q(APP)}!$D${A0}:$D${AX}"; A_TITLE = f"{q(APP)}!$E${A0}:$E${AX}"; A_VEN = f"{q(APP)}!$F${A0}:$F${AX}"; A_STAT = f"{q(APP)}!$I${A0}:$I${AX}"; A_TODAY = f"{q(APP)}!$L${A0}:$L${AX}"; A_RANK = f"{q(APP)}!$M${A0}:$M${AX}"

# =====================================================================
# SEATING PLAN (table list first, guest list references it)
# =====================================================================
se = new(SEAT, cols=17, rows=90)
widths(se, {"B": 24, "C": 11, "D": 11, "E": 11, "F": 3, "G": 24, "H": 11, "I": 11, "J": 11, "K": 3})
title(se, "B2:J2", "The Seating Plan", "NAME YOUR TABLES, SET THE CAPACITY, THEN ASSIGN GUESTS FROM THE TABLE COLUMN IN THE GUEST LIST", "B3:J3")
NT = 20; T0 = 8
GUEST_FIRST, GUEST_LAST = 9, 158
GX = 2000
G_TABLE = f"{q(GUE)}!$J${GUEST_FIRST}:$J${GX}"; G_PAX = f"{q(GUE)}!$H${GUEST_FIRST}:$H${GX}"; G_RSVP = f"{q(GUE)}!$G${GUEST_FIRST}:$G${GX}"
G_NAME = f"{q(GUE)}!$C${GUEST_FIRST}:$C${GX}"; G_KEY = f"{q(GUE)}!$M${GUEST_FIRST}:$M${GX}"
pill(se, "B5:C5", "⏷  SEATS AVAILABLE", f"SUM(C{T0+1}:C{T0+NT})")
pill(se, "D5:E5", "⏷  PAX SEATED", f"SUM(D{T0+1}:D{T0+NT})")
pill(se, "G5:H5", "⏷  PAX STILL TO SEAT", f'SUMIFS({G_PAX},{G_RSVP},"<>Declined",{G_NAME},"<>")-SUM(D{T0+1}:D{T0+NT})')
bar(se, f"B{T0-1}:E{T0-1}", "TABLE LIST")
header_row(se, T0, 2, ["TABLE NAME", "CAPACITY", "SEATED (PAX)", "FREE"], fl=PAPER, color=MUTED)
for i in range(NT):
    r = T0 + 1 + i
    input_cell(se, f"B{r}", f"Table {i+1}" if i < 10 else None); input_cell(se, f"C{r}", 10 if i < 10 else None, al=CENTER)
    put(se, f"D{r}", f'=IF(B{r}="","",SUMIFS({G_PAX},{G_TABLE},B{r},{G_RSVP},"<>Declined"))', f=font(9, name=FM), fl=PAPER, al=CENTER, b=ROWB)
    put(se, f"E{r}", f'=IF(B{r}="","",N(C{r})-D{r})', f=font(9, name=FM), fl=PAPER, al=CENTER, b=ROWB)
cf(se, f"E{T0+1}:E{T0+NT}", f'AND(E{T0+1}<>"",E{T0+1}<0)', font=Font(color=RED, bold=True))
TABLE_RNG = f"{q(SEAT)}!$B${T0+1}:$B${T0+NT}"
# table cards
bar(se, f"B{T0+NT+3}:J{T0+NT+3}", "WHO SITS WHERE")
CARD_COLS = [2, 7]  # B-E, G-J
SEATS_PER_CARD = 10
for ti in range(NT):
    band, pos = divmod(ti, 2)
    c0 = CARD_COLS[pos]; r0 = T0 + NT + 5 + band * (SEATS_PER_CARD + 4)
    C = lambda k: L(c0 + k)
    tname = f"$B${T0+1+ti}"
    merge(se, f"{C(0)}{r0}:{C(2)}{r0}", f'=IF({tname}="","(empty table slot)",UPPER({tname}))', f=font(8, True, color="FFFFFF"), fl=CHAR, al=LEFT)
    put(se, f"{C(3)}{r0}", f'=IF({tname}="","",D{T0+1+ti}&" / "&N(C{T0+1+ti}))', f=font(8, True, color="FFFFFF"), fl=CHAR, al=CENTER)
    header_row(se, r0 + 1, c0, ["GUEST", "PAX", "", ""], fl=PAPER, color=MUTED)
    for k in range(SEATS_PER_CARD):
        r = r0 + 2 + k
        put(se, f"{C(0)}{r}", f'=IFERROR(INDEX({G_NAME},MATCH({tname}&"#"&{k+1},{G_KEY},0)),"")', f=font(8.5), fl=PAPER, al=LEFT, b=ROWB)
        put(se, f"{C(1)}{r}", f'=IFERROR(INDEX({G_PAX},MATCH({tname}&"#"&{k+1},{G_KEY},0)),"")', f=font(8.5), fl=PAPER, al=CENTER, b=ROWB)
        se[f"{C(2)}{r}"].fill = fill(PAPER); se[f"{C(3)}{r}"].fill = fill(PAPER)
        se[f"{C(2)}{r}"].border = ROWB; se[f"{C(3)}{r}"].border = ROWB
se.freeze_panes = "A6"

# =====================================================================
# GUEST LIST
# =====================================================================
gl = new(GUE, cols=16, rows=312)
widths(gl, {"B": 4, "C": 28, "D": 12, "E": 30, "F": 20, "G": 11, "H": 6, "I": 16, "J": 14, "K": 26, "L": 3, "M": 12})
title(gl, "B2:K2", "The Guest List", "TRACK INVITATIONS, RSVPS, PAX AND TABLE ASSIGNMENTS", "B3:K3")
G0, GN = GUEST_FIRST, GUEST_LAST
pill(gl, "B5:C5", "⏷  INVITED", f'COUNTA(C{G0}:C{GX})')
pill(gl, "D5:E5", "⏷  ATTENDING", f'COUNTIF(G{G0}:G{GX},"Attending")')
pill(gl, "F5:G5", "⏷  PENDING", f'COUNTIF(G{G0}:G{GX},"Pending")')
pill(gl, "H5:I5", "⏷  DECLINED", f'COUNTIF(G{G0}:G{GX},"Declined")')
pill(gl, "J5:K5", "⏷  TOTAL PAX (NOT DECLINED)", f'SUMIFS(H{G0}:H{GX},G{G0}:G{GX},"<>Declined",C{G0}:C{GX},"<>")')
put(gl, "B6", "Filter with the arrows in the header row. LABEL is free text (Family, Highschool, Office…).", f=font(7, italic=True, color=MUTED))
bar(gl, "B7:K7", "GUEST LIST")
header_row(gl, 8, 2, ["#", "GUEST NAME", "LABEL", "CATEGORY", "ROLE", "RSVP", "PAX", "PHONE / WA", "TABLE", "NOTES"])
put(gl, "M8", "SEAT KEY", f=font(7, True, color=MUTED))
gcat_dv = DataValidation(type="list", formula1=LIST_RNG["GUEST CATEGORY"], allow_blank=True); gl.add_data_validation(gcat_dv)
grole_dv = DataValidation(type="list", formula1=LIST_RNG["ROLE"], allow_blank=True); gl.add_data_validation(grole_dv)
grsvp_dv = DataValidation(type="list", formula1=LIST_RNG["RSVP"], allow_blank=True); gl.add_data_validation(grsvp_dv)
gtab_dv = DataValidation(type="list", formula1=TABLE_RNG, allow_blank=True); gl.add_data_validation(gtab_dv)
seed = [(f"={BRIDE_FULL}", "", "Engaged Couple", "Guest", "Attending", 1), (f"={GROOM_FULL}", "", "Engaged Couple", "Guest", "Attending", 1)]
for r in range(G0, GN + 1):
    put(gl, f"B{r}", f'=IF(C{r}="","",ROW()-{G0-1})', f=font(8, color=MUTED), fl=PAPER, al=CENTER, b=ROWB)
    for c in "CDEFGHIJK": input_cell(gl, f"{c}{r}")
    for c in "GHJ": gl[f"{c}{r}"].alignment = CENTER
    i = r - G0
    if i < len(seed):
        s = seed[i]
        for c, v in zip("CDEFGH", s): gl[f"{c}{r}"].value = v
    put(gl, f"M{r}", f'=IF(OR(J{r}="",C{r}=""),"",J{r}&"#"&COUNTIFS($J${G0}:J{r},J{r},$C${G0}:C{r},"<>"))', f=font(7, color=MUTED))
gcat_dv.add(f"E{G0}:E{GN}"); grole_dv.add(f"F{G0}:F{GN}"); grsvp_dv.add(f"G{G0}:G{GN}"); gtab_dv.add(f"J{G0}:J{GN}")
cf(gl, f"G{G0}:G{GN}", f'G{G0}="Attending"', font=Font(color=GREEN, bold=True))
cf(gl, f"G{G0}:G{GN}", f'G{G0}="Declined"', font=Font(color=MUTED, strike=True))
cf(gl, f"G{G0}:G{GN}", f'G{G0}="Pending"', font=Font(color=AMBER, bold=True))
gl.auto_filter.ref = f"B8:K{GN}"; gl.freeze_panes = "A9"

# =====================================================================
# GIFTS
# =====================================================================
gf = new(GIF, cols=11, rows=160)
widths(gf, {"B": 4, "C": 28, "D": 16, "E": 32, "F": 16, "G": 14, "H": 14, "I": 28})
title(gf, "B2:I2", "The Gifts", "RECORD GIFTS RECEIVED AND THANK-YOU NOTES SENT", "B3:I3")
F0, FN = 8, 87
pill(gf, "B5:C5", "⏷  GIFTS RECORDED", f"COUNTA(C{F0}:C{FN})")
pill(gf, "E5:F5", "⏷  CASH RECEIVED   Rp", f'SUMIF(D{F0}:D{FN},"Cash / Transfer",F{F0}:F{FN})')
pill(gf, "H5:I5", "⏷  THANK-YOU PENDING", f'COUNTIFS(C{F0}:C{FN},"<>",H{F0}:H{FN},FALSE)')
bar(gf, "B6:I6", "GIFT TRACKER")
header_row(gf, 7, 2, ["#", "FROM", "TYPE", "GIFT / DESCRIPTION", "AMOUNT (Rp)", "DATE RECEIVED", "THANK YOU SENT", "NOTES"])
gtype_dv = DataValidation(type="list", formula1=LIST_RNG["GIFT TYPE"], allow_blank=True); gf.add_data_validation(gtype_dv)
gfrom_dv = DataValidation(type="list", formula1=G_NAME, allow_blank=True, showErrorMessage=False); gf.add_data_validation(gfrom_dv)
gdone_dv = DataValidation(type="list", formula1='"TRUE,FALSE"', allow_blank=True); gf.add_data_validation(gdone_dv)
for r in range(F0, FN + 1):
    put(gf, f"B{r}", f'=IF(C{r}="","",ROW()-{F0-1})', f=font(8, color=MUTED), fl=PAPER, al=CENTER, b=ROWB)
    for c in "CDEFGI": input_cell(gf, f"{c}{r}")
    put(gf, f"H{r}", False, f=font(8, color=PAPER), fl=PAPER, al=CENTER, b=ROWB)
    gf[f"F{r}"].number_format = RP; gf[f"F{r}"].alignment = RIGHT; gf[f"G{r}"].number_format = DATEF; gf[f"G{r}"].alignment = CENTER; gf[f"D{r}"].alignment = CENTER
gtype_dv.add(f"D{F0}:D{FN}"); gfrom_dv.add(f"C{F0}:C{FN}"); gdone_dv.add(f"H{F0}:H{FN}")
cf(gf, f"C{F0}:I{FN}", f'AND($C{F0}<>"",$H{F0}<>TRUE)', fill=fill("FBEFEF"))
put(gf, f"E{FN+1}", "TOTAL CASH", f=font(8, True), al=RIGHT); put(gf, f"F{FN+1}", f'=SUMIF(D{F0}:D{FN},"Cash / Transfer",F{F0}:F{FN})', f=font(9, True, name=FM), al=RIGHT, fmt=RP)
gf.auto_filter.ref = f"B7:I{FN}"; gf.freeze_panes = "A8"

# =====================================================================
# BUDGET SUMMARY
# =====================================================================
bd = new(BUD, cols=18, rows=100)
widths(bd, {"B": 3, "C": 30, "D": 3, "E": 3, "F": 44, "G": 17, "H": 17, "I": 17, "J": 17, "K": 20, "L": 3, "M": 14, "N": 16})
title(bd, "C2:K2", "Summary", "TARGET VS ACTUAL SPEND, WHAT IS PAID AND WHAT REMAINS", "C3:K3")
ACT = f"SUM({P_DUE})"; PAID = f"SUM({P_PAID})"
stats = [("TOTAL TARGET BUDGET", f"={BUDGET}", None), ("TOTAL ACTUAL SPEND", f"={ACT}", f'=IF({BUDGET}=0,"",IF({ACT}>{BUDGET},"▲ +","▼ ")&TEXT(ABS(({ACT}-{BUDGET})/{BUDGET}),"0.00%")&" vs target")'),
         ("TOTAL PAID", f"={PAID}", None), ("TOTAL REMAINING", f"={ACT}-{PAID}", None)]
r = 6
for lab, fml, delta in stats:
    put(bd, f"C{r}", lab, f=font(7.5, True, color=MUTED), al=CENTER)
    put(bd, f"C{r+1}", fml, f=font(13, name=FM), al=CENTER, fmt=RP)
    if delta: put(bd, f"C{r+2}", delta, f=font(8, color=MUTED), al=CENTER)
    r += 4
for rr in range(5, 23): bd[f"C{rr}"].border = Border(left=Side(style="thin", color=LINE), right=Side(style="thin", color=LINE))
bd["C5"].border = Border(top=thin, left=thin, right=thin); bd["C22"].border = Border(bottom=thin, left=thin, right=thin)
put(bd, "C24", "Actual spend = every AMOUNT DUE in the Expense Tracker. Remaining = actual − paid. Targets per category come from Settings.", f=font(7, italic=True, color=MUTED), al=Alignment(wrap_text=True, vertical="top"))
bd.merge_cells("C24:C27")
# category table
bar(bd, "F5:K5", "BUDGET DETAILS FOR EACH CATEGORY")
header_row(bd, 6, 6, ["CATEGORY", "TARGET BUDGET", "ACTUAL", "PAID", "REMAINING", "PROGRESS (%)"])
CT0 = 7
for i in range(len(CATS)):
    r = CT0 + i; src = CAT_FIRST + i
    put(bd, f"F{r}", f"={q(SETTINGS)}!E{src}", f=font(8.5), fl=PAPER, al=LEFT, b=ROWB)
    put(bd, f"G{r}", f"={q(SETTINGS)}!G{src}", f=font(8.5, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
    put(bd, f"H{r}", f"=SUMIF({P_CAT},F{r},{P_DUE})", f=font(8.5, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
    put(bd, f"I{r}", f"=SUMIF({P_CAT},F{r},{P_PAID})", f=font(8.5, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
    put(bd, f"J{r}", f"=H{r}-I{r}", f=font(8.5, name=FM), fl=PAPER, al=RIGHT, b=ROWB, fmt=RP)
    put(bd, f"K{r}", f'=IF(G{r}=0,IF(H{r}>0,"over","–"),REPT("█",MIN(10,ROUND(H{r}/G{r}*10,0)))&" "&TEXT(H{r}/G{r},"0%"))', f=font(8, color=PINK), fl=PAPER, al=LEFT, b=ROWB)
CTN = CT0 + len(CATS) - 1
cf(bd, f"K{CT0}:K{CTN}", f'AND(G{CT0}>0,H{CT0}>G{CT0})', font=Font(color=RED, bold=True))
put(bd, f"F{CTN+1}", "TOTAL", f=font(8, True))
for c in "GHIJ": put(bd, f"{c}{CTN+1}", f"=SUM({c}{CT0}:{c}{CTN})", f=font(8.5, True, name=FM), al=RIGHT, fmt=RP)
# totals row for the expense tracker already uses P0..PN; fine
# chart data
put(bd, "M5", "CHART DATA", f=font(7, True, color=MUTED)); put(bd, "M6", "Paid", f=font(8)); put(bd, "N6", f"={PAID}", f=font(8), fmt=RP); put(bd, "M7", "Remaining", f=font(8)); put(bd, "N7", f"=MAX(0,{ACT}-{PAID})", f=font(8), fmt=RP)
# charts
CH0 = 30
put(bd, f"C{CH0}", "TOTAL PAID VS REMAINING", f=font(8, True, color="FFFFFF"), fl=CHAR, al=CENTER)
d1 = DoughnutChart(); d1.add_data(Reference(bd, min_col=14, min_row=6, max_row=7), titles_from_data=False); d1.set_categories(Reference(bd, min_col=13, min_row=6, max_row=7))
d1.holeSize = 60; d1.title = None; d1.height = 8; d1.width = 9; d1.legend.position = "b"
d1.dataLabels = DataLabelList(); d1.dataLabels.showPercent = True
bd.add_chart(d1, f"B{CH0+1}")
bar(bd, f"F{CH0}:K{CH0}", "BREAKDOWN PER CATEGORY (PAID)")
p1 = PieChart(); p1.add_data(Reference(bd, min_col=9, min_row=CT0, max_row=CTN), titles_from_data=False); p1.set_categories(Reference(bd, min_col=6, min_row=CT0, max_row=CTN))
p1.title = None; p1.height = 9; p1.width = 16; p1.legend.position = "r"; p1.dataLabels = DataLabelList(); p1.dataLabels.showPercent = True
bd.add_chart(p1, f"F{CH0+1}")
CH1 = CH0 + 20
bar(bd, f"C{CH1}:K{CH1}", "PROGRESS TOWARDS PAYMENTS")
b1 = BarChart(); b1.type = "col"; b1.grouping = "stacked"; b1.overlap = 100
b1.add_data(Reference(bd, min_col=9, min_row=6, max_row=CTN), titles_from_data=True)   # PAID
b1.add_data(Reference(bd, min_col=10, min_row=6, max_row=CTN), titles_from_data=True)  # REMAINING
b1.set_categories(Reference(bd, min_col=6, min_row=CT0, max_row=CTN))
b1.title = None; b1.height = 10; b1.width = 28; b1.legend.position = "t"; b1.y_axis.title = "Rp"
bd.add_chart(b1, f"C{CH1+1}")
put(bd, f"C{CH1+22}", "Chart colours can be set in Google Sheets: double-click a chart ▸ Customise ▸ Series (pink #E8898B for paid, grey #DDD6CF for remaining).", f=font(7, italic=True, color=MUTED))

# =====================================================================
# CALENDAR
# =====================================================================
ca = new(CAL, cols=10, rows=20)
widths(ca, {"B": 22, "C": 22, "D": 22, "E": 22, "F": 22, "G": 22, "H": 22})
title(ca, "B2:H2", "The Calendar", "TASK DEADLINES, PAYMENT DUE DATES AND APPOINTMENTS IN ONE VIEW", "B3:H3")
put(ca, "B4", "MONTH TO SHOW →", f=font(7.5, True, color=MUTED), al=RIGHT)
input_cell(ca, "C4", "=DATE(YEAR(TODAY()),MONTH(TODAY()),1)", fmt="mmmm yyyy", al=CENTER); ca["C4"].font = font(10, True)
put(ca, "D4", "type any date in that month, e.g. 1/3/2028", f=font(7, italic=True, color=MUTED))
put(ca, "F4", "📝 task deadline   💰 payment due   🤝 appointment   ♡ wedding day", f=font(7, color=MUTED))
ca.merge_cells("F4:H4")
start = "DATE(YEAR($C$4),MONTH($C$4),1)-WEEKDAY(DATE(YEAR($C$4),MONTH($C$4),1))+1"
for i, d in enumerate(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]):
    put(ca, f"{L(2+i)}6", d, f=font(7.5, True, color="FFFFFF"), fl=CHAR, al=CENTER)
for wk in range(6):
    for dow in range(7):
        k = wk * 7 + dow
        hcell = f"{L(10+dow)}{3+wk}"
        hp[hcell] = "=" + start.replace("$C$4", f"{q(CAL)}!$C$4") + f"+{k}"
        hp[hcell].number_format = DATEF
        D = f"{q(HELP)}!{hcell}"
        f = (f'=IF(MONTH({D})<>MONTH({q(CAL)}!$C$4),"",DAY({D})'
             f'&IF({D}={W},"  ♡ WEDDING DAY","")'
             f'&IF(COUNTIFS({T_DL},{D},{T_HAS},1)>0,CHAR(10)&"📝 "&COUNTIFS({T_DL},{D},{T_HAS},1)&" task deadline(s)","")'
             f'&IF(COUNTIFS({P_DATE},{D},{P_REM},">0")>0,CHAR(10)&"💰 "&COUNTIFS({P_DATE},{D},{P_REM},">0")&" payment(s) due","")'
             f'&IF(COUNTIFS({A_DATE},{D},{A_STAT},"<>Cancelled")>0,CHAR(10)&"🤝 "&COUNTIFS({A_DATE},{D},{A_STAT},"<>Cancelled")&" appointment(s)",""))')
        c = put(ca, f"{L(2+dow)}{7+wk}", f, f=font(8), fl=PAPER, al=Alignment(horizontal="left", vertical="top", wrap_text=True), b=BOX)
        ca.row_dimensions[7 + wk].height = 64
cf(ca, "B7:H12", 'ISNUMBER(SEARCH("WEDDING DAY",B7))', fill=fill(PINKL), font=Font(bold=True))
cf(ca, "B7:H12", 'AND(B7<>"",VALUE(LEFT(B7,FIND(" ",B7&" ")-1))=DAY(TODAY()),MONTH($C$4)=MONTH(TODAY()),YEAR($C$4)=YEAR(TODAY()))', font=Font(bold=True, color=PINK))

# =====================================================================
# DASHBOARD
# =====================================================================
da = new(DASH, cols=24, rows=48)
for c in range(2, 9): da.column_dimensions[L(c)].width = 3.6      # B..H mini calendar
da.column_dimensions["I"].width = 4
for c in range(10, 17): da.column_dimensions[L(c)].width = 9       # J..P centre
da.column_dimensions["Q"].width = 4
for c in range(18, 24): da.column_dimensions[L(c)].width = 7.5     # R..W photo
# logo
rt = CellRichText([TextBlock(InlineFont(rFont=FB, sz=28, color=INK), "plan"), TextBlock(InlineFont(rFont=FT, sz=28, i=True, color=PINK), "it"), TextBlock(InlineFont(rFont=FB, sz=12, color=PINK), " ♡")])
da.merge_cells("B2:H2"); da["B2"].value = rt; da["B2"].alignment = Alignment(horizontal="left", vertical="center"); da.row_dimensions[2].height = 38
put(da, "B3", "YOUR NEXT CHAPTER? PLANNED!", f=font(6.5, color=MUTED))
# tab strip (text only)
tabs = "DASHBOARD      WEDDING CHECKLIST      VENDORS      EXPENSE TRACKER      BUDGET SUMMARY      APPOINTMENTS      CALENDAR      GUEST LIST      SEATING PLAN      GIFTS      SETTINGS"
merge(da, "J2:W2", tabs, f=font(6.5, color=MUTED), al=Alignment(horizontal="right", vertical="center", wrap_text=True))
# countdown
for c in range(2, 24): da[f"{L(c)}5"].border = Border(top=thin, bottom=thin)
merge(da, "B5:H5", "WEDDING DAY COUNTDOWN", f=font(7, True, color=MUTED), al=Alignment(horizontal="left", vertical="center", indent=1))
da.row_dimensions[5].height = 30
M = f"DATEDIF(TODAY(),{W},\"M\")"; REM = f"({W}-EDATE(TODAY(),{M}))"
put(da, "J5", f'=IF(TODAY()>{W},0,{M})', f=font(18, name=FT), al=RIGHT); put(da, "K5", "MONTHS", f=font(6.5, True, color=MUTED), al=Alignment(horizontal="left", vertical="center", indent=1))
put(da, "M5", f'=IF(TODAY()>{W},0,INT({REM}/7))', f=font(18, name=FT), al=RIGHT); put(da, "N5", "WEEKS", f=font(6.5, True, color=MUTED), al=Alignment(horizontal="left", vertical="center", indent=1))
put(da, "P5", f'=IF(TODAY()>{W},0,MOD({REM},7))', f=font(18, name=FT), al=RIGHT); put(da, "Q5", "DAYS", f=font(6.5, True, color=MUTED), al=Alignment(horizontal="left", vertical="center"))
da.merge_cells("S5:W5"); da["S5"].value = "👰🤵 D A S H B O A R D"; da["S5"].font = font(11, True); da["S5"].alignment = RIGHT
# mini calendar B7:H15
merge(da, "B7:H7", "WEDDING DAY", f=font(6.5, True, color=INK), fl=PINK, al=CENTER)
merge(da, "B8:H8", f'=UPPER(TEXT({W},"mmmm yyyy"))', f=font(7, True), fl=PAPER, al=CENTER)
for i, d in enumerate("SMTWTFS"): put(da, f"{L(2+i)}9", d, f=font(6, color=MUTED), fl=PAPER, al=CENTER)
mstart = f"DATE(YEAR({W}),MONTH({W}),1)-WEEKDAY(DATE(YEAR({W}),MONTH({W}),1))+1"
for wk in range(6):
    for dow in range(7):
        k = wk * 7 + dow
        put(da, f"{L(2+dow)}{10+wk}", f"={mstart}+{k}", f=font(7), fl=PAPER, al=CENTER, fmt="d")
for rr in range(7, 16):
    for c in range(2, 9):
        da[f"{L(c)}{rr}"].border = Border(left=thin if c == 2 else None, right=thin if c == 8 else None, bottom=thin if rr == 15 else None)
cf(da, "B10:H15", f"MONTH(B10)<>MONTH({W})", font=Font(color=PAPER))
cf(da, "B10:H15", f"B10={W}", fill=fill(PINK), font=Font(bold=True, color="FFFFFF"))
cf(da, "B10:H15", "B10=TODAY()", font=Font(bold=True, color=PINK, underline="single"))
# centre
merge(da, "J8:P8", "THE  DREAM  WEDDING  OF", f=font(7, color=MUTED), al=CENTER)
merge(da, "J10:P10", f'=UPPER({BRIDE})&"   &   "&UPPER({GROOM})', f=font(20, name=FT), al=CENTER); da.row_dimensions[10].height = 36
merge(da, "J12:P12", f'=TEXT({W},"dddd, d mmmm yyyy")', f=font(11, italic=True, name=FT), al=CENTER)
merge(da, "J14:P15", f'=IF(TODAY()>{W},"The big day has passed. Congratulations!","only "&({W}-TODAY())&" days until love will bloom into forever"&CHAR(10)&"— each day is a step closer to ‘I do’ ♡")', f=font(7.5, color=MUTED), al=CENTER)
# photo placeholder
merge(da, "R7:W15", "Insert your photo here\n\nSelect this cell ▸ Insert ▸ Image ▸ Image in cell", f=font(7.5, color=MUTED), fl=PAPER, al=CENTER, b=Border(left=Side(style="dashed", color=LINE), right=Side(style="dashed", color=LINE), top=Side(style="dashed", color=LINE), bottom=Side(style="dashed", color=LINE)))
# daily highlights
for rr in range(17, 34):
    for c in range(10, 17): da[f"{L(c)}{rr}"].fill = fill("F1ECE6")
merge(da, "J18:P18", f'="Hello "&{BRIDE}&" & "&{GROOM}', f=font(10), al=CENTER)
merge(da, "J19:P19", "✨ Welcome to your Daily Highlights! ✨", f=font(10), al=CENTER)
OVER = f"SUM({T_OVER})"
hl = [
    f'=IF({OVER}>0,"📝  You have "&{OVER}&" task"&IF({OVER}>1,"s","")&" overdue!","📝  No overdue tasks. You are on track!")',
    f'=IF(SUM({A_TODAY})>0,"🤝  You have "&SUM({A_TODAY})&" appointment"&IF(SUM({A_TODAY})>1,"s","")&" to attend today!","🤝  No appointments to attend today!")',
    f'=IF(COUNTIF({P_STAT},"Overdue")>0,"💰  "&COUNTIF({P_STAT},"Overdue")&" payment"&IF(COUNTIF({P_STAT},"Overdue")>1,"s are"," is")&" overdue: Rp "&TEXT(SUMIF({P_STAT},"Overdue",{P_REM}),"#,##0"),"💰  You\'re all caught up on payments")',
    f'="🏛️  You have booked "&COUNTIF({q(VEN)}!$H:$H,"Booked")&" vendor"&IF(COUNTIF({q(VEN)}!$H:$H,"Booked")=1,"","s")&"!"&CHAR(10)&"Continue discovering the right vendors to create the wedding of your dreams."',
    f'="💌  You are waiting for "&COUNTIF({G_RSVP},"Pending")&" guest"&IF(COUNTIF({G_RSVP},"Pending")=1,"","s")&" to RSVP!"&CHAR(10)&"Your current total guest is "&SUMIFS({G_PAX},{G_RSVP},"<>Declined",{G_NAME},"<>")&" people."',
    f'="🪑  You have seated "&SUM({q(SEAT)}!$D${T0+1}:$D${T0+NT})&" pax."&CHAR(10)&"You still need to seat "&MAX(0,SUMIFS({G_PAX},{G_RSVP},"<>Declined",{G_NAME},"<>")-SUM({q(SEAT)}!$D${T0+1}:$D${T0+NT}))&" pax."',
]
for i, f in enumerate(hl):
    rr = 21 + i * 2
    merge(da, f"J{rr}:P{rr+1}", f, f=font(8.5), al=CENTER)
    da.row_dimensions[rr].height = 16; da.row_dimensions[rr + 1].height = 16
# week lists
WK = 36
bar(da, f"B{WK}:H{WK}", "TASKS FOR THE WEEK"); bar(da, f"J{WK}:P{WK}", "APPOINTMENTS FOR THE WEEK"); bar(da, f"R{WK}:W{WK}", "PAYMENTS FOR THE WEEK")
for k in range(1, 7):
    rr = WK + k
    merge(da, f"B{rr}:F{rr}", f'=IFERROR(INDEX({T_TASK},MATCH({k},{T_RANK},0)),IF({k}=1,IF(COUNT({T_RANK})=0,"No tasks due this week",""),""))', f=font(7.5), fl=PAPER, al=LEFT, b=ROWB)
    merge(da, f"G{rr}:H{rr}", f'=IFERROR(TEXT(INDEX({T_DL},MATCH({k},{T_RANK},0)),"d mmm"),"")', f=font(7, color=MUTED), fl=PAPER, al=RIGHT, b=ROWB)
    merge(da, f"J{rr}:N{rr}", f'=IFERROR(INDEX({A_TITLE},MATCH({k},{A_RANK},0))&IF(INDEX({A_VEN},MATCH({k},{A_RANK},0))<>"","  ·  "&INDEX({A_VEN},MATCH({k},{A_RANK},0)),""),IF({k}=1,IF(COUNT({A_RANK})=0,"No appointments this week",""),""))', f=font(7.5), fl=PAPER, al=LEFT, b=ROWB)
    merge(da, f"O{rr}:P{rr}", f'=IFERROR(TEXT(INDEX({A_DATE},MATCH({k},{A_RANK},0)),"d mmm")&IF(INDEX({A_TIME},MATCH({k},{A_RANK},0))<>""," "&TEXT(INDEX({A_TIME},MATCH({k},{A_RANK},0)),"HH:MM"),""),"")', f=font(7, color=MUTED), fl=PAPER, al=RIGHT, b=ROWB)
    merge(da, f"R{rr}:U{rr}", f'=IFERROR(INDEX({P_DESC},MATCH({k},{P_RANK},0))&IF(INDEX({P_VEN},MATCH({k},{P_RANK},0))<>"","  ·  "&INDEX({P_VEN},MATCH({k},{P_RANK},0)),""),IF({k}=1,IF(COUNT({P_RANK})=0,"No payments due this week",""),""))', f=font(7.5), fl=PAPER, al=LEFT, b=ROWB)
    merge(da, f"V{rr}:W{rr}", f'=IFERROR("Rp "&TEXT(INDEX({P_REM},MATCH({k},{P_RANK},0)),"#,##0")&"  ·  "&TEXT(INDEX({P_DATE},MATCH({k},{P_RANK},0)),"d mmm"),"")', f=font(7, color=MUTED), fl=PAPER, al=RIGHT, b=ROWB)
put(da, f"W{WK+8}", f'="© "&YEAR(TODAY())&"  ·  "&{BRIDE}&" & "&{GROOM}', f=font(6.5, color=MUTED), al=RIGHT)

# =====================================================================
# WELCOME
# =====================================================================
wl = new(WELCOME, cols=14, rows=40)
for c in range(2, 14): wl.column_dimensions[L(c)].width = 11
wl.merge_cells("B2:E2"); wl["B2"].value = rt; wl["B2"].alignment = Alignment(horizontal="left", vertical="center"); wl.row_dimensions[2].height = 40
put(wl, "B3", "YOUR NEXT CHAPTER? PLANNED!", f=font(6.5, color=MUTED))
merge(wl, "B5:M5", f'="Welcome, "&{BRIDE}&" & "&{GROOM}', f=font(22, name=FT), al=CENTER); wl.row_dimensions[5].height = 36
merge(wl, "B7:M9", "Thank you for choosing this wedding planning spreadsheet. Take a moment to review the information below so you get the most out of every tab. Everything is linked: change the wedding date or a payment once and the dashboard, calendar and budget update themselves.", f=font(10, name=FT), al=CENTER); wl.row_dimensions[7].height = 20
merge(wl, "B11:M12", "Start with ⚙️ SETTINGS to confirm your names, wedding date and total budget. Blue-shaded cells everywhere are inputs; everything else is calculated.", f=font(10, name=FT), al=CENTER)
merge(wl, "D14:F15", "SETUP: GO TO SETTINGS →", f=font(8, True), fl=PINK, al=CENTER)
merge(wl, "H14:J15", "OPEN THE DASHBOARD →", f=font(8, True), fl=PINK, al=CENTER)
guide = [("📝 WEDDING CHECKLIST", "A 12-month task tracker. Tick tasks, assign them, watch the red dots for overdue items."),
         ("🏛️ VENDORS", "Every vendor you shortlist, by category, with contacts, quotes and booking status."),
         ("💰 EXPENSE TRACKER", "Log each payment (DP, pelunasan) with its due date. Status and remaining amounts are automatic."),
         ("📊 BUDGET SUMMARY", "Target vs actual spend, paid vs remaining, and charts per category."),
         ("🤝 APPOINTMENTS & 📅 CALENDAR", "Fittings, tastings and meetings in one list and on a monthly calendar with deadlines and due dates."),
         ("👥 GUEST LIST, 🪑 SEATING & 🎁 GIFTS", "RSVPs and pax, who sits where, and gifts with thank-you notes.")]
r = 18
for i, (h, t) in enumerate(guide):
    col = 2 if i % 2 == 0 else 8
    rr = r + (i // 2) * 4
    merge(wl, f"{L(col)}{rr}:{L(col+5)}{rr}", h, f=font(7.5, True), al=LEFT, b=Border(top=Side(style="medium", color=PINK)))
    merge(wl, f"{L(col)}{rr+1}:{L(col+5)}{rr+2}", t, f=font(8, color=MUTED), al=Alignment(wrap_text=True, vertical="top"))
put(wl, "B32", "Tips: select a ✓ column and use Insert ▸ Checkbox to get real checkboxes. Use Data ▸ Add a slicer on any table for pill-style filters. Share the file with your partner as Editor.", f=font(7, italic=True, color=MUTED))
wl.merge_cells("B32:M33"); wl["B32"].alignment = Alignment(wrap_text=True, vertical="top")

# order tabs like the video
order = [WELCOME, SETTINGS, DASH, CHK, VEN, EXP, BUD, APP, CAL, GUE, SEAT, GIF, HELP]
wb._sheets = [sheets[n] for n in order]
wb.active = 2
for n in order:
    sheets[n].sheet_properties.tabColor = PINK if n in (DASH,) else None
wb.save(OUT)
print("saved", OUT)
