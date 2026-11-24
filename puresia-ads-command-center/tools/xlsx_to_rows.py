import sys, json, datetime, shutil
import openpyxl
src, dst = sys.argv[1], sys.argv[2]
if not src.lower().endswith(('.xlsx','.xlsm','.xltx','.xltm')):
    shutil.copyfile(src, src+'.x.xlsx'); src = src+'.x.xlsx'
wb = openpyxl.load_workbook(src, data_only=True, read_only=True)
ws = wb[wb.sheetnames[0]]
try: ws.reset_dimensions()
except Exception: pass
rows=[]
for row in ws.iter_rows(values_only=True):
    out=[]
    for c in row:
        if c is None: out.append('')
        elif isinstance(c, datetime.datetime): out.append(c.strftime('%Y-%m-%d %H:%M:%S'))
        elif isinstance(c, datetime.date): out.append(c.strftime('%Y-%m-%d'))
        else: out.append(c if isinstance(c,(int,float)) else str(c))
    rows.append(out)
json.dump(rows, open(dst,'w'), ensure_ascii=False)
print('ROWS', len(rows), 'sheet', wb.sheetnames[0], 'all-sheets', wb.sheetnames)
