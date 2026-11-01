# Plan It — Wedding Planning Spreadsheet (Aulia & Aslih, 2028)

A Google Sheets wedding tracker modelled on the Bridestory "Plan It" layout:
Welcome · Settings · Dashboard · Wedding Checklist · Vendors · Expense Tracker ·
Budget Summary · Appointments · Calendar · Guest List · Seating Plan · Gifts.

## Open it in Google Sheets

1. Download `Plan It Wedding 2028 - Aulia & Aslih.xlsx`.
2. Upload it to Google Drive, open it, then **File ▸ Save as Google Sheets**
   (or in Sheets: **File ▸ Import ▸ Upload ▸ Replace spreadsheet**).
3. Go to **⚙️ SETTINGS** and confirm the names, wedding date and total budget.
   Every countdown, deadline, calendar and budget figure follows from there.

Optional finishing touches inside Google Sheets (not possible through import):

- Select a ✓ column in the checklist and use **Insert ▸ Checkbox** for real checkboxes.
- **Data ▸ Add a slicer** on any table for the pink pill-style filters.
- Share the file with your partner as Editor.

## Rebuild

`python3 build_sheet.py "Plan It Wedding 2028 - Aulia & Aslih.xlsx"` (needs `openpyxl`).
