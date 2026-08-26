import re, html, markdown

SRC='/home/user/Dom-Manipulation/business-ethics/chapter-3/MATERI-Chapter-3-Evaluating-Business-Ethics.md'
md=open(SRC,encoding='utf-8').read()

# --- pisahkan blok judul dari badan naskah ---
start=md.index('# SISTEMATIKA PENULISAN')
body_md=md[start:]

conv=markdown.Markdown(extensions=['tables','sane_lists'])
body=conv.convert(body_md)

# --- id + kumpulkan TOC ---
toc=[]
def slug(t):
    s=re.sub(r'<[^>]+>','',t)
    s=html.unescape(s)
    s=re.sub(r'[^a-zA-Z0-9 ]','',s).strip().lower()
    return re.sub(r'\s+','-',s)[:60]

def head_sub(m):
    lvl,inner=m.group(1),m.group(2)
    sid=slug(inner)
    n=1
    base=sid
    while any(x[1]==sid for x in toc):
        n+=1; sid='%s-%d'%(base,n)
    toc.append((int(lvl),sid,re.sub(r'<[^>]+>','',inner)))
    return '<h%s id="%s">%s</h%s>'%(lvl,sid,inner,lvl)
body=re.sub(r'<h([123])>(.*?)</h\1>',head_sub,body,flags=re.S)

# --- judul tabel dan baris sumbernya ---
# markdown menggabungkan dua baris berdekatan menjadi satu paragraf, jadi tangani keduanya
body=re.sub(r'<p><strong>(Tabel [^<]*)</strong>\s*<em>(Sumber:.*?)</em></p>',
            r'<p class="tcap">\1</p><p class="tsrc">\2</p>', body, flags=re.S)
body=re.sub(r'<p><strong>(Tabel [^<]*)</strong></p>', r'<p class="tcap">\1</p>', body)
body=re.sub(r'<p><em>(Sumber:[^<]*)</em></p>', r'<p class="tsrc">\1</p>', body)

# --- bungkus tabel agar bisa digulir horizontal ---
body=re.sub(r'<table>(.*?)</table>', lambda m:'<div class="tablewrap"><table>%s</table></div>'%m.group(1), body, flags=re.S)

# --- sisipkan dua figur pada subbab kerangka pluralis ---
FIGS='''
<figure>
  <svg viewBox="0 0 640 240" role="img" aria-labelledby="f1t">
    <title id="f1t">Figure 3.1: dilema etis melewati lensa satu teori dan menghasilkan satu pertimbangan normatif tunggal</title>
    <defs><marker id="ah1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="var(--ink-3)"></path></marker></defs>
    <polygon points="30,98 110,98 110,84 150,112 110,140 110,126 30,126" fill="var(--fig-a)"></polygon>
    <ellipse cx="205" cy="112" rx="20" ry="64" fill="var(--fig-b)"></ellipse>
    <line x1="242" y1="68" x2="430" y2="105" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah1)"></line>
    <line x1="242" y1="112" x2="430" y2="112" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah1)"></line>
    <line x1="242" y1="156" x2="430" y2="119" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah1)"></line>
    <polygon points="472,84 500,112 472,140 444,112" fill="var(--fig-c)"></polygon>
    <g font-size="13" fill="var(--ink-2)" text-anchor="middle">
      <text x="88" y="196">Ethical dilemma</text>
      <text x="205" y="204">&#8216;Lens&#8217; of</text><text x="205" y="221">ethical theory</text>
      <text x="472" y="176">Single normative consideration</text><text x="472" y="193">for solving the ethical dilemma</text>
    </g>
  </svg>
  <figcaption><b>Figure 3.1</b> A typical perspective on the value of ethical theory for solving ethical dilemmas in business. Sumber: Crane et al. (2019), halaman 125.</figcaption>
</figure>
<figure>
  <svg viewBox="0 0 640 240" role="img" aria-labelledby="f2t">
    <title id="f2t">Figure 3.2: dilema etis melewati prisma banyak teori dan memancar menjadi beragam pertimbangan normatif</title>
    <defs><marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="var(--ink-3)"></path></marker></defs>
    <polygon points="26,98 106,98 106,84 146,112 106,140 106,126 26,126" fill="var(--fig-a)"></polygon>
    <polygon points="172,164 220,66 268,164" fill="var(--fig-b)"></polygon>
    <line x1="286" y1="104" x2="424" y2="62" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah2)"></line>
    <line x1="286" y1="112" x2="424" y2="112" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah2)"></line>
    <line x1="286" y1="120" x2="424" y2="162" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ah2)"></line>
    <rect x="436" y="44" width="54" height="136" fill="var(--fig-c)"></rect>
    <g font-size="13" fill="var(--ink-2)" text-anchor="middle">
      <text x="86" y="196">Ethical dilemma</text>
      <text x="220" y="196">&#8216;Prism&#8217; of</text><text x="220" y="213">ethical theories</text>
      <text x="530" y="86">Variety of normative</text><text x="530" y="103">considerations</text>
      <text x="530" y="120">for solving the</text><text x="530" y="137">ethical dilemma</text>
    </g>
  </svg>
  <figcaption><b>Figure 3.2</b> A pluralistic perspective on the value of ethical theories for solving ethical dilemmas in business. Sumber: Crane et al. (2019), halaman 126.</figcaption>
</figure>
'''
anchor='merangkum pesan utama seluruh Chapter 3.</p>'
assert anchor in body, 'anchor figur tidak ditemukan'
body=body.replace(anchor, anchor+FIGS, 1)

# --- daftar pustaka pakai hanging indent ---
i=body.index('<h1 id="daftar-pustaka"')
body=body[:i]+'<div class="bib">'+body[i:]+'</div>'

# --- susun daftar isi ---
lines=['<nav class="toc" aria-label="Daftar isi"><p class="tlabel">Daftar Isi</p><ol>']
for lvl,sid,txt in toc:
    lines.append('<li class="lv%d"><a href="#%s">%s</a></li>'%(lvl,sid,html.escape(txt)))
lines.append('</ol></nav>')
nav=''.join(lines)

MAST='''<header class="masthead">
  <p class="eyebrow">Materi Presentasi &middot; Business Ethics</p>
  <h1>Evaluating Business Ethics: <em>Normative Ethical Theories</em></h1>
  <p class="deck">Sembilan cara memandang satu dilema yang sama, dan alasan mengapa buku ini menolak memilih salah satunya sebagai yang paling benar.</p>
  <div class="srcbox">
    <p><b>Sumber utama</b>Crane, A., Matten, D., Glozer, S., &amp; Spence, L. J. (2019). <em>Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization</em> (5th ed.). Oxford: Oxford University Press. Chapter 3, halaman 85&ndash;135.</p>
    <p><b>Kasus yang dibahas</b>Case 3 &mdash; <em>Canada&rsquo;s Oil Sands: &lsquo;Most Destructive Project on Earth&rsquo; or &lsquo;Ethical Oil&rsquo;?</em>, halaman 129&ndash;134.</p>
  </div>
</header>'''

head=open('head.html',encoding='utf-8').read()
out=head+'\n<div class="shell">\n'+MAST+'\n<div class="cols">\n'+nav+'\n<main class="doc">\n'+body+'\n</main>\n</div>\n</div>\n'
open('be-ch3.html','w',encoding='utf-8').write(out)
print('entri daftar isi:',len(toc))
print('ukuran:',round(len(out.encode())/1024),'KB')
