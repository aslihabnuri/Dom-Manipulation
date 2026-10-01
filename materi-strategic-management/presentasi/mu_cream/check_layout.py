import json, os, sys
from PIL import ImageFont
FD=os.path.expanduser('~/.fonts')
FM={'Poppins ExtraBold':'Poppins-ExtraBold.ttf','Poppins SemiBold':'Poppins-SemiBold.ttf','Poppins Medium':'Poppins-Medium.ttf','Poppins':'Poppins-Regular.ttf','Poppins Light':'Poppins-Light.ttf'}
_c={}
def font(face,pt):
    k=(face,pt)
    if k not in _c: _c[k]=ImageFont.truetype(os.path.join(FD,FM.get(face,'Poppins-Regular.ttf')),int(round(pt*10)))
    return _c[k]
def tw(face,pt,s,cs=0): return font(face,pt).getlength(s)/10.0+cs*max(0,len(s)-1)
L=json.load(open('layout.json'))
SAFE=json.load(open('safe.json'))
SAFE=json.load(open('safe.json'))
def paragraphs(t):
    # returns list of paragraphs, each list of runs (text, face, size, cs)
    if isinstance(t,str): t=[{'text':t,'options':{}}]
    paras=[[]]
    for r in t:
        o=r.get('options',{}); 
        parts=r['text'].split('\n')
        for i,pp in enumerate(parts):
            if i>0: paras.append([])
            paras[-1].append((pp,o))
        if o.get('breakLine'): paras.append([])
    return [p for p in paras if any(x[0] for x in p)] or [[('',{})]]
def need_height(rec):
    o=rec['o']; base_face=o.get('fontFace','Poppins'); base_size=o.get('fontSize',10)
    ls=o.get('lineSpacingMultiple',1.0); w=rec['w']*72; total=0
    for p in paragraphs(rec['text']):
        faces=[(r[1].get('fontFace',base_face), r[1].get('fontSize',base_size), r[1].get('charSpacing',o.get('charSpacing',0))) for r in p]
        size=max(f[1] for f in faces); bullet=any('bullet' in r[1] for r in p)
        avail=w-(12 if bullet else 0)-2
        # word wrap over concatenated runs, using each run's font
        words=[]
        for (txt,ro),(face,sz,cs) in zip(p,faces):
            for wd in txt.split(' '):
                if wd!='': words.append((wd,face,sz,cs))
        lines=1; cur=0
        for wd,face,sz,cs in words:
            ww=tw(face,sz,wd,cs); sp=tw(face,sz,' ')
            if cur==0: cur=ww
            elif cur+sp+ww<=avail: cur+=sp+ww
            else: lines+=1; cur=ww
        psa=max([r[1].get('paraSpaceAfter',0) for r in p]+[0])
        total+=lines*size*1.2*ls+psa
    return total/72
def rect_inset(c,f): return (c['x']+c['w']*f, c['y']+c['h']*f, c['x']+c['w']*(1-f), c['y']+c['h']*(1-f))
def inter(a,b): return a[0]<b[2] and a[2]>b[0] and a[1]<b[3] and a[3]>b[1]
issues=[]
by={}
for r in L: by.setdefault(r['slide'],[]).append(r)
for sl,items in sorted(by.items()):
    conts=[r for r in items if r['kind']=='container']
    imgs=[r for r in items if r['kind'] in ('sticker','image')]
    for i,r in enumerate(items):
        if r['kind']!='text' or r['o'].get('skip'): continue
        need=need_height(r); h=r['h']
        o=r['o']; sizes=[o.get('fontSize',12)]+[x.get('options',{}).get('fontSize',99) for x in (r['text'] if isinstance(r['text'],list) else [])]
        if min(sizes)<10: issues.append((sl,'SMALLFONT',min(sizes),(r['text'] if isinstance(r['text'],str) else ''.join(x['text'] for x in r['text']))[:50]))
        label=(r['text'] if isinstance(r['text'],str) else ''.join(x['text'] for x in r['text']))[:55]
        if need>h+0.03: issues.append((sl,'OVERFLOW',round(need,2),round(h,2),label))
        va=r['o'].get('valign','top'); th=min(h,need)
        ty=r['y'] if va=='top' else (r['y']+(h-th)/2 if va=='middle' else r['y']+h-th)
        tr=(r['x'],ty,r['x']+r['w'],ty+th)
        # container: last container before this text whose rect contains text center
        cx=(tr[0]+tr[2])/2; cy=(tr[1]+tr[3])/2
        cont=None
        for c in conts:
            if items.index(c)<i and c['x']<=cx<=c['x']+c['w'] and c['y']<=cy<=c['y']+c['h']: cont=c
        if cont:
            nm=cont['path'].split('/')[-1].replace('.png','')
            l,t,rr,b=SAFE[nm]
            inner=(cont['x']+cont['w']*l, cont['y']+cont['h']*t, cont['x']+cont['w']*(1-rr), cont['y']+cont['h']*(1-b))
            if nm=='paper_11':
                cb=(cont['x']+cont['w']*0.85, cont['y']+cont['h']*0.85, cont['x']+cont['w'], cont['y']+cont['h'])
                if inter(tr,cb): issues.append((sl,'CORNER-FOLD',label))
            if tr[0]<inner[0]-0.02 or tr[2]>inner[2]+0.02 or tr[1]<inner[1]-0.02 or tr[3]>inner[3]+0.02:
                issues.append((sl,'OUTSIDE-CONTAINER',[round(v,2) for v in tr],[round(v,2) for v in inner],label))
        for im in imgs:
            ir=(im['x'],im['y'],im['x']+im['w'],im['y']+im['h'])
            if im['w']>6: continue
            if inter(tr,ir): issues.append((sl,'HITS-IMAGE',im['path'],label))
# text-vs-text overlap on the same slide
for sl,items in sorted(by.items()):
    boxes=[]
    for r in items:
        if r['kind']!='text': continue
        h=min(r['h'],need_height(r)); va=r['o'].get('valign','top')
        ty=r['y'] if va=='top' else (r['y']+(r['h']-h)/2 if va=='middle' else r['y']+r['h']-h)
        lab=(r['text'] if isinstance(r['text'],str) else ''.join(x['text'] for x in r['text']))[:40]
        boxes.append(((r['x'],ty,r['x']+r['w'],ty+h),lab))
    for i in range(len(boxes)):
        for j in range(i+1,len(boxes)):
            a,la=boxes[i]; b,lb=boxes[j]
            ox=min(a[2],b[2])-max(a[0],b[0]); oy=min(a[3],b[3])-max(a[1],b[1])
            if ox>0.05 and oy>0.05: issues.append((sl,'TEXT-OVERLAP',round(ox,2),round(oy,2),la,lb))
for i in issues: print(i)
print('issues',len(issues))
