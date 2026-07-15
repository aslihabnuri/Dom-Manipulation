#!/usr/bin/env python3
"""Rakit index.html dari template + data JSON.
Pakai: python3 tools/build.py  (dari folder ads-dashboard)"""
import json, os
BASE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T=os.path.join(BASE,'tools','templates')
head=open(os.path.join(T,'template_head.html')).read()
core=open(os.path.join(T,'template_core.js')).read()
app=open(os.path.join(T,'template_app.js')).read()
data=json.load(open(os.path.join(BASE,'data','dashboard_data.json')))
data=json.dumps(data,separators=(',',':')).replace('</','<\\/')
html=head.replace('__DATA_JSON__',data)+'\n'+core+'\n'+app+'\n</body>\n</html>\n'
open(os.path.join(BASE,'index.html'),'w').write(html)
print('index.html dibangun,',len(html),'byte')
