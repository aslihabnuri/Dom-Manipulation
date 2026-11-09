import sys, datetime, openpyxl
wb=openpyxl.load_workbook(sys.argv[1], data_only=True, read_only=True)
MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
def cell(v):
    if v is None: return ''
    if isinstance(v,datetime.datetime): return f"{v.day} {MON[v.month-1]}" if v.hour==0 and v.minute==0 else v.strftime('%Y-%m-%d %H:%M:%S')
    if isinstance(v,datetime.date): return f"{v.day} {MON[v.month-1]}"
    if isinstance(v,float): return str(int(v)) if v==int(v) else repr(v)
    return str(v).replace('|','/').replace('\n',' ')
out=[]
for ws in wb.worksheets:
    try: ws.reset_dimensions()
    except Exception: pass
    for r in ws.iter_rows(values_only=True):
        out.append('| '+' | '.join(cell(c) for c in r)+' |')
    out.append('')
open(sys.argv[2],'w').write('\n'.join(out))
print('dump lines',len(out))
