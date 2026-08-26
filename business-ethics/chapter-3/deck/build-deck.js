const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';           // 13.33 x 7.5
pres.author = 'Aslih Abnuri';
pres.title  = 'Chapter 3 Evaluating Business Ethics';

// ---------- palet ----------
const INK    = '231F3D';   // teks utama pada slide terang
const DEEP   = '1B1638';   // latar slide gelap
const PRIM   = '2E2566';   // indigo dominan
const MUTED  = '5C5773';
const TINT   = 'EEEBF8';
const TINT2  = 'F6F4FC';
const ACC    = 'C97B2E';   // aksen oker
const RULE   = 'D9D5E6';
const W = 'FFFFFF';

// spektrum sembilan teori, motif prisma
const SPEC = ['AB463C','B96A2C','9C8226','5A8637','2C8072','2C6F92','4A5CA4','764B99','9E4176'];

// pptxgenjs memusatkan teks secara vertikal secara bawaan, sehingga tata letak meleset.
// Seluruh addText dipaksa rata atas lewat pembungkus di bawah ini.
const _addSlide = pres.addSlide.bind(pres);
pres.addSlide = function (...a) {
  const s = _addSlide(...a);
  const orig = s.addText.bind(s);
  s.addText = (t, o) => orig(t, Object.assign({ valign: 'top' }, o));
  return s;
};

const HEAD = 'Cambria';
const BODY = 'Calibri';
const M = 0.7, CW = 13.33 - 2*M;

let n = 0;
const foot = (s) => {
  n++;
  s.addText(String(n), { isTextBox:true, x:12.5, y:6.92, w:0.5, h:0.3, align:'right',
    fontFace:BODY, fontSize:10, color:MUTED, margin:0 });
};

// slide gelap untuk judul dan pembatas
function darkSlide(kicker, title, sub) {
  const s = pres.addSlide();
  s.background = { color: DEEP };
  if (kicker) s.addText(kicker, { isTextBox:true, x:M, y:2.35, w:CW, h:0.32,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:2.4, margin:0 });
  s.addText(title, { isTextBox:true, x:M, y:2.8, w:CW-1.2, h:1.5,
    fontFace:HEAD, fontSize:40, bold:true, color:W, margin:0, lineSpacing:46 });
  if (sub) s.addText(sub, { isTextBox:true, x:M, y:4.45, w:CW-2.6, h:1.1,
    fontFace:BODY, fontSize:15, color:'BDB6D6', margin:0, lineSpacing:24 });
  // motif spektrum
  SPEC.forEach((c,i) => s.addShape(pres.ShapeType.ellipse,
    { x: M + i*0.30, y: 6.55, w:0.19, h:0.19, fill:{ color:c } }));
  return s;
}

// slide terang standar
function slide(kicker, title) {
  const s = pres.addSlide();
  s.background = { color: W };
  s.addText(kicker, { isTextBox:true, x:M, y:0.42, w:CW, h:0.28,
    fontFace:BODY, fontSize:11, bold:true, color:ACC, charSpacing:2, margin:0 });
  s.addText(title, { isTextBox:true, x:M, y:0.74, w:CW, h:0.72,
    fontFace:HEAD, fontSize:31, bold:true, color:PRIM, margin:0 });
  foot(s);
  return s;
}

// kartu berlatar tint
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius:0.04,
    fill:{ color: fill || TINT2 }, line:{ color:RULE, width:0.75 } });
}

// lingkaran bernomor, motif yang diulang di tiap slide teori
function dot(s, x, y, num, color, d) {
  const dd = d || 0.46;
  s.addShape(pres.ShapeType.ellipse, { x, y, w:dd, h:dd, fill:{ color } });
  s.addText(String(num), { isTextBox:true, x, y, w:dd, h:dd, align:'center', valign:'middle',
    fontFace:BODY, fontSize:Math.round(dd*32), bold:true, color:W, margin:0 });
}

const tbl = (s, rows, opts) => s.addTable(rows, Object.assign({
  fontFace:BODY, fontSize:12, color:INK, border:{ type:'solid', color:RULE, pt:0.75 },
  valign:'top', autoPage:false
}, opts));

const hdr = (t) => ({ text:t, options:{ bold:true, color:W, fill:{ color:PRIM }, fontSize:11.5 } });

// ============================================================ 1 judul
{
  const s = pres.addSlide();
  s.background = { color: DEEP };
  s.addText('Business Ethics', { isTextBox:true, x:M, y:1.9, w:CW, h:0.34,
    fontFace:BODY, fontSize:13, bold:true, color:ACC, charSpacing:2.6, margin:0 });
  s.addText('Chapter 3', { isTextBox:true, x:M, y:2.35, w:CW, h:0.6,
    fontFace:HEAD, fontSize:22, color:'BDB6D6', margin:0 });
  s.addText('Evaluating Business Ethics', { isTextBox:true, x:M, y:2.92, w:CW-1, h:0.95,
    fontFace:HEAD, fontSize:46, bold:true, color:W, margin:0 });
  s.addText('Normative Ethical Theories', { isTextBox:true, x:M, y:3.86, w:CW-1, h:0.7,
    fontFace:HEAD, fontSize:30, italic:true, color:ACC, margin:0 });
  s.addText([
    { text:'Crane, Matten, Glozer & Spence (2019), Business Ethics, edisi kelima, Oxford University Press, halaman 85 sampai 135', options:{ breakLine:true } },
    { text:'Diskusi kasus: Case 3, Canada’s Oil Sands, halaman 129 sampai 134' }
  ], { isTextBox:true, x:M, y:4.95, w:CW-2.2, h:0.9, fontFace:BODY, fontSize:13,
       color:'9F98BE', margin:0, lineSpacing:22 });
  SPEC.forEach((c,i) => s.addShape(pres.ShapeType.ellipse,
    { x: M + i*0.30, y: 6.4, w:0.19, h:0.19, fill:{ color:c } }));
  s.addNotes('Perkenalan. Sampaikan bahwa bab ini berisi sembilan cara menilai satu dilema yang sama, dan bukunya sengaja tidak memilih salah satunya sebagai yang paling benar.');
}

// ============================================================ 2 agenda
{
  const s = slide('Agenda', 'Peta materi dan capaian pembelajaran');
  const blok = [
    ['1','Peran teori etika','Absolutism, relativism dan pluralism. Kenapa keputusan bisnis butuh dasar penalaran yang sistematis.'],
    ['2','Teori Western modernist','Ethical egoism, utilitarianism, ethics of duty, rights, justice dan social contract.'],
    ['3','Teori alternatif','Virtue ethics, ethic of care, discourse ethics dan postmodern ethics.'],
    ['4','Diskusi kasus','Case 3 Canada’s oil sands dibedah dengan sembilan teori tersebut.']
  ];
  blok.forEach((b,i) => {
    const x = M + (i%2)*(CW/2+0.15), y = 1.75 + Math.floor(i/2)*1.6;
    card(s, x, y, CW/2-0.15, 1.4);
    dot(s, x+0.28, y+0.26, b[0], SPEC[i*2], 0.42);
    s.addText(b[1], { isTextBox:true, x:x+0.85, y:y+0.24, w:CW/2-1.15, h:0.36,
      fontFace:BODY, fontSize:16, bold:true, color:PRIM, margin:0 });
    s.addText(b[2], { isTextBox:true, x:x+0.85, y:y+0.63, w:CW/2-1.2, h:0.66,
      fontFace:BODY, fontSize:12.5, color:MUTED, margin:0, lineSpacing:17 });
  });
  card(s, M, 5.05, CW, 1.42, TINT);
  s.addText('Empat capaian pembelajaran (halaman 85)', { isTextBox:true, x:M+0.3, y:5.2, w:CW-0.6, h:0.3,
    fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
  s.addText([
    { text:'Menjelaskan peran teori etika normatif untuk pengambilan keputusan etis dalam bisnis', options:{ bullet:true, breakLine:true } },
    { text:'Memahami dan menerapkan teori etika Western modernist', options:{ bullet:true, breakLine:true } },
    { text:'Memahami dan menerapkan teori etika alternatif', options:{ bullet:true, breakLine:true } },
    { text:'Melakukan evaluasi etika bisnis secara pluralis', options:{ bullet:true } }
  ], { isTextBox:true, x:M+0.3, y:5.52, w:CW-0.7, h:0.85, fontFace:BODY, fontSize:12.5,
       color:INK, margin:0, paraSpaceAfter:2 });
  s.addNotes('Sebutkan bahwa satu kasus yaitu Ethical Dilemma 3 dipakai untuk menguji seluruh teori sepanjang presentasi.');
}

// ============================================================ 3 kenapa butuh teori
{
  const s = slide('Bagian 1', 'Kenapa bisnis membutuhkan teori etika');
  s.addText('Penilaian etis pribadi dapat diputuskan sendiri. Dalam bisnis penilaian itu jauh lebih rumit.',
    { isTextBox:true, x:M, y:1.66, w:CW, h:0.32, fontFace:BODY, fontSize:15, color:INK, margin:0 });

  card(s, M, 2.2, CW/2-0.15, 2.42);
  s.addText('Contoh dari buku', { isTextBox:true, x:M+0.3, y:2.36, w:CW/2-0.75, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Perusahaan multinasional yang mendirikan anak perusahaan di negara berkembang menghadapi beberapa masalah sekaligus.',
    { isTextBox:true, x:M+0.3, y:2.68, w:CW/2-0.75, h:0.72, fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:17 });
  s.addText([
    { text:'Pejabat setempat mengharapkan suap untuk izin', options:{ bullet:true, breakLine:true } },
    { text:'Standar ketenagakerjaan yang rendah', options:{ bullet:true, breakLine:true } },
    { text:'Diskriminasi di tempat kerja lebih lazim', options:{ bullet:true, breakLine:true } },
    { text:'Banyak pihak dengan pandangan yang berbeda', options:{ bullet:true } }
  ], { isTextBox:true, x:M+0.3, y:3.46, w:CW/2-0.75, h:1.05, fontFace:BODY, fontSize:12.5, color:MUTED, margin:0, paraSpaceAfter:2 });

  card(s, M+CW/2+0.15, 2.2, CW/2-0.15, 2.42, TINT);
  s.addText('Kenapa dasar penalaran dibutuhkan', { isTextBox:true, x:M+CW/2+0.45, y:2.36, w:CW/2-0.75, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Keputusan bisnis harus dapat dipertahankan, dibenarkan dan dijelaskan kepada pemangku kepentingan. Pihak yang menilai sebuah perusahaan tidak etis juga membutuhkan dasar yang sama.',
    { isTextBox:true, x:M+CW/2+0.45, y:2.68, w:CW/2-0.8, h:0.92, fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:17 });
  s.addText('Pertanyaan pokoknya: pada titik mana sebuah perilaku bukan hanya berbeda dari yang akan kita lakukan, melainkan memang salah?',
    { isTextBox:true, x:M+CW/2+0.45, y:3.68, w:CW/2-0.8, h:0.9, fontFace:BODY, fontSize:12.5, italic:true, color:PRIM, margin:0, lineSpacing:17 });

  card(s, M, 4.8, CW, 1.66, TINT);
  s.addText('Definisi (kotak buku, halaman 87)', { isTextBox:true, x:M+0.35, y:4.94, w:CW-0.7, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Normative ethical theories adalah aturan, prinsip dan pendekatan penentu benar dan salah.',
    { isTextBox:true, x:M+0.35, y:5.24, w:CW-0.7, h:0.32, fontFace:HEAD, fontSize:15.5, color:INK, margin:0, lineSpacing:22 });
  s.addText('Teori normatif meresepkan bagaimana seharusnya seseorang berperilaku. Teori deskriptif merujuk pada kode perilaku yang dianut kelompok tertentu, misalnya pedoman sebuah agama.',
    { isTextBox:true, x:M+0.35, y:5.7, w:CW-0.7, h:0.55, fontFace:BODY, fontSize:12.5, color:MUTED, margin:0, lineSpacing:17 });
  s.addNotes('Tiga manfaat teori etika: merasionalisasi firasat, memungkinkan wacana rasional antara orang dengan nilai berbeda, dan memperjelas praanggapan moral para pihak.');
}

// ============================================================ 4 tiga posisi
{
  const s = slide('Bagian 1', 'Absolutism, relativism dan pluralism');
  const kol = [
    ['Ethical absolutism', 'Terdapat prinsip moral yang abadi dan berlaku universal. Benar dan salah merupakan kualitas objektif yang dapat ditentukan secara rasional, terlepas dari keadaan.', 'Ciri sebagian besar teori Western modernist', SPEC[2]],
    ['Ethical relativism', 'Moralitas bergantung pada konteks dan bersifat subjektif. Tidak ada benar dan salah universal karena penilaian bergantung pada tradisi dan praktik pengambil keputusan.', 'Sering muncul pada masalah bisnis internasional', SPEC[4]],
    ['Ethical pluralism', 'Nilai yang tidak kompatibel dapat sama-sama sah dan perlu ditoleransi. Tidak menyamakan semua perspektif dan tidak memenangkan satu pendekatan.', 'Posisi yang diambil buku ini', SPEC[7]]
  ];
  const cw = (CW-0.5)/3;
  kol.forEach((k,i) => {
    const x = M + i*(cw+0.25);
    card(s, x, 1.72, cw, 3.35, i===2 ? TINT : TINT2);
    s.addShape(pres.ShapeType.ellipse, { x:x+0.3, y:1.98, w:0.34, h:0.34, fill:{ color:k[3] } });
    s.addText(k[0], { isTextBox:true, x:x+0.3, y:2.46, w:cw-0.6, h:0.35,
      fontFace:BODY, fontSize:16, bold:true, color:PRIM, margin:0 });
    s.addText(k[1], { isTextBox:true, x:x+0.3, y:2.9, w:cw-0.6, h:1.5,
      fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:18 });
    s.addText(k[2], { isTextBox:true, x:x+0.3, y:4.52, w:cw-0.6, h:0.4,
      fontFace:BODY, fontSize:11.5, italic:true, color:MUTED, margin:0, lineSpacing:15 });
  });
  card(s, M, 5.32, CW, 1.15);
  s.addText('Kelemahan pluralism (Liu, 2018)', { isTextBox:true, x:M+0.35, y:5.46, w:CW-0.7, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Pluralism dikhawatirkan terlalu toleran. Sebagian praktik dan tradisi memang keliru secara mendalam dan untuk hal tersebut toleransi tidak tepat diberikan. Konflik antarperspektif merupakan bagian yang tidak terhindarkan dan harus dihadapi.',
    { isTextBox:true, x:M+0.35, y:5.78, w:CW-0.7, h:0.55, fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:17 });
  s.addNotes('Bedakan ethical relativism dari descriptive relativism. Descriptive hanya menyatakan kelompok berbeda punya etika berbeda, ethical menyatakan keduanya bisa sama benar.');
}

// ============================================================ 5 agama
{
  const s = slide('Bagian 1', 'Teori etika normatif dan agama');
  s.addText('Tujuan keduanya sama, memastikan bisnis bertanggung jawab dan bermanfaat. Ada dua perbedaan pokok.',
    { isTextBox:true, x:M, y:1.66, w:CW, h:0.34, fontFace:BODY, fontSize:15, color:INK, margin:0, lineSpacing:21 });

  const rows = [
    [hdr(''), hdr('Ajaran agama'), hdr('Teori filosofis')],
    [{ text:'Sumber aturan', options:{ bold:true, fill:{ color:TINT } } },
     'Tuhan atau sistem kepercayaan yang terorganisir, misalnya ajaran dalam Al-Qur’an atau Talmud. Iman menjadi syarat kritis untuk bertindak etis.',
     'Nalar manusia sebagai penggerak etika. Rasionalitas menjadi syarat kritis untuk bertindak etis.'],
    [{ text:'Konsekuensi', options:{ bold:true, fill:{ color:TINT } } },
     'Terdapat konsekuensi spiritual berupa keselamatan, pencerahan, reinkarnasi atau kutukan.',
     'Konsekuensinya bersifat sosial dan praktis, bukan spiritual.']
  ];
  tbl(s, rows, { x:M, y:2.18, w:CW, colW:[2.1, 4.9, 4.93], rowH:[0.34,0.95,0.75] });

  card(s, M, 4.5, CW, 1.95);
  s.addText('Contoh pengaruh agama pada praktik bisnis', { isTextBox:true, x:M+0.35, y:4.66, w:CW-0.7, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText([
    { text:'Yudaisme: periode abstain dari aktivitas ekonomi yang di Yerusalem melahirkan pertentangan mengenai jam operasi toko dan bioskop pada hari istirahat', options:{ bullet:true, breakLine:true } },
    { text:'Islam: aturan praktik bisnis yang melahirkan sistem perbankan syariah yang melarang pengenaan bunga', options:{ bullet:true, breakLine:true } },
    { text:'Protestant Work Ethic (Weber, 1905) yang dikembangkan Uygur et al. (2017) menjadi Islamic work ethic pada pemilik usaha kecil di Turki', options:{ bullet:true } }
  ], { isTextBox:true, x:M+0.35, y:4.98, w:CW-0.75, h:1.3, fontFace:BODY, fontSize:12.5, color:INK, margin:0, paraSpaceAfter:4 });
  s.addText('Karena sekularisasi berlangsung luas, teori normatif berbasis prinsip filosofis tetap menjadi landasan etika bisnis kontemporer.',
    { isTextBox:true, x:M, y:6.55, w:CW, h:0.35, fontFace:BODY, fontSize:12.5, italic:true, color:PRIM, margin:0 });
  s.addNotes('Sebutkan Interfaith Declaration yang menetapkan prinsip bersama lintas agama: keadilan, saling menghormati, kepengurusan dan kejujuran.');
}

// ============================================================ 6 dua keluarga teori
{
  const s = slide('Bagian 2', 'Dua keluarga teori Western modernist');
  s.addText('Lahir dari Pencerahan abad ke-18, menawarkan satu aturan untuk segala situasi dan bersifat absolutis.',
    { isTextBox:true, x:M, y:1.66, w:CW, h:0.32, fontFace:BODY, fontSize:14.5, color:INK, margin:0, lineSpacing:20 });

  card(s, M, 2.2, CW/2-0.15, 1.5, TINT2);
  s.addText('Consequentialist atau teleological', { isTextBox:true, x:M+0.32, y:2.36, w:CW/2-0.8, h:0.32,
    fontFace:BODY, fontSize:15, bold:true, color:SPEC[1], margin:0 });
  s.addText('Penilaian moral berdasar hasil dari sebuah tindakan. Hasil yang diinginkan berarti tindakan tersebut benar. Teorinya: ethical egoism dan utilitarianism.',
    { isTextBox:true, x:M+0.32, y:2.74, w:CW/2-0.8, h:0.85, fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:18 });

  card(s, M+CW/2+0.15, 2.2, CW/2-0.15, 1.5, TINT2);
  s.addText('Principle-based atau deontological', { isTextBox:true, x:M+CW/2+0.47, y:2.36, w:CW/2-0.8, h:0.32,
    fontFace:BODY, fontSize:15, bold:true, color:SPEC[6], margin:0 });
  s.addText('Penilaian moral berdasar prinsip dan prosedur. Mengutamakan apa yang benar, bukan yang diinginkan. Teorinya: ethics of duties serta rights and justice.',
    { isTextBox:true, x:M+CW/2+0.47, y:2.74, w:CW/2-0.8, h:0.85, fontFace:BODY, fontSize:12.5, color:INK, margin:0, lineSpacing:18 });

  s.addText('Tabel 3.1  Normative theories in business ethics: part one (halaman 92)',
    { isTextBox:true, x:M, y:3.9, w:CW, h:0.28, fontFace:BODY, fontSize:11.5, bold:true, color:MUTED, margin:0 });
  tbl(s, [
    [hdr(''), hdr('Ethical egoism'), hdr('Utilitarianism'), hdr('Ethics of duties'), hdr('Rights and justice')],
    [{ text:'Kontributor', options:{ bold:true, fill:{ color:TINT } } }, 'Thomas Hobbes\nAyn Rand', 'Jeremy Bentham\nJohn Stuart Mill', 'Immanuel Kant', 'John Locke\nJ. J. Rousseau\nJohn Rawls'],
    [{ text:'Fokus', options:{ bold:true, fill:{ color:TINT } } }, 'Hasrat atau kepentingan individu', 'Hasil dan kesejahteraan kolektif', 'Kewajiban', 'Hak dan hakikat keadilan'],
    [{ text:'Konsep manusia', options:{ bold:true, fill:{ color:TINT } } }, 'Manusia wajib melayani kepentingan dirinya', 'Manusia digerakkan penghindaran pain dan perolehan pleasure', 'Manusia adalah aktor moral rasional dengan kehendak bebas', 'Manusia dibedakan oleh martabat'],
    [{ text:'Jenis', options:{ bold:true, fill:{ color:TINT } } },
     { text:'Consequentialist', options:{ color:SPEC[1], bold:true } },
     { text:'Consequentialist', options:{ color:SPEC[1], bold:true } },
     { text:'Principle-based', options:{ color:SPEC[6], bold:true } },
     { text:'Principle-based', options:{ color:SPEC[6], bold:true } }]
  ], { x:M, y:4.22, w:CW, colW:[1.75, 2.54, 2.54, 2.54, 2.56], rowH:[0.3,0.62,0.5,0.62,0.3], fontSize:11 });
  s.addNotes('Sebutkan bahwa edisi kelima mengganti istilah non-consequentialist menjadi principle-based karena bagian Rawls diperluas dan teori Rawls tidak sepenuhnya non-consequentialist.');
}

// ============================================================ 7 ethical dilemma 3
{
  const s = slide('Bagian 2', 'Ethical Dilemma 3: Producing Toys, Child’s Play?');
  s.addText('Satu kasus yang sama dipakai untuk menguji seluruh teori dalam bab ini. Kasus ini adalah benang merah presentasi.',
    { isTextBox:true, x:M, y:1.62, w:CW, h:0.32, fontFace:BODY, fontSize:14, italic:true, color:PRIM, margin:0 });

  card(s, M, 2.08, CW*0.62, 3.58, TINT);
  s.addText('Ringkasan kasus (halaman 94)', { isTextBox:true, x:M+0.32, y:2.24, w:CW*0.62-0.64, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Anda product manager perusahaan kembang gula yang menyertakan mainan plastik kecil dalam produknya. Di timur laut Thailand Anda memperoleh kesepakatan dengan harga sepertiga dari pemasok Portugal, dengan kualitas yang setara.\n\nKetika meninjau proses produksi Anda mendapati tidak ada bengkel kerja. Komponen dibawa pulang oleh sekitar 30 pria. Di sebuah bangunan menyerupai garasi Anda melihat satu keluarga merakit mainan, yaitu ayah, ibu dan 6 anak berusia 5 sampai 14 tahun.\n\nNamun, ketika membeli suvenir untuk keponakan Anda yang berusia 5 dan 7 tahun di bandara, Anda mulai mempertanyakan apakah Anda bersedia melihat keponakan Anda tumbuh seperti anak-anak pekerja tersebut.',
    { isTextBox:true, x:M+0.32, y:2.56, w:CW*0.62-0.64, h:2.95, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16.5 });

  const xr = M + CW*0.62 + 0.25, wr = CW*0.38 - 0.25;
  card(s, xr, 2.08, wr, 1.62, TINT2);
  s.addText('Dua pertanyaan buku', { isTextBox:true, x:xr+0.3, y:2.24, w:wr-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText([
    { text:'Sebagai product manager, apa reaksi spontan Anda?', options:{ bullet:true, breakLine:true } },
    { text:'Jelaskan alasannya dan kaitkan dengan nilai atau prinsip yang penting untuk Anda.', options:{ bullet:true } }
  ], { isTextBox:true, x:xr+0.3, y:2.58, w:wr-0.65, h:1.0, fontFace:BODY, fontSize:12.5, color:INK, margin:0, paraSpaceAfter:5 });

  card(s, xr, 3.9, wr, 1.73);
  s.addText('Diuji dengan sembilan teori', { isTextBox:true, x:xr+0.3, y:4.06, w:wr-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  const nm = ['Egoism','Utilitarianism','Ethics of duty','Ethics of rights','Justice','Virtue ethics','Ethic of care','Discourse ethics','Postmodern ethics'];
  nm.forEach((t,i) => {
    const yy = 4.4 + (i%5)*0.24, xx = xr + 0.32 + Math.floor(i/5)*(wr/2 - 0.05);
    s.addShape(pres.ShapeType.ellipse, { x:xx, y:yy+0.045, w:0.13, h:0.13, fill:{ color:SPEC[i] } });
    s.addText(t, { isTextBox:true, x:xx+0.2, y:yy, w:wr/2-0.32, h:0.22, fontFace:BODY, fontSize:11, color:INK, margin:0 });
  });
  s.addText('Teori yang berbeda menghasilkan kesimpulan yang berbeda atas fakta yang sama. Itulah pesan utama bab ini.',
    { isTextBox:true, x:M, y:5.88, w:CW, h:0.35, fontFace:BODY, fontSize:13, italic:true, color:PRIM, margin:0 });
  s.addNotes('Bacakan kasusnya singkat saja. Minta satu atau dua mahasiswa menyebut reaksi spontannya, lalu janjikan bahwa jawaban mereka akan diuji dengan sembilan teori berikutnya.');
}

// ============================================================ 8 ethical egoism
{
  const s = slide('Teori 1  ·  Consequentialist', 'Ethical egoism');
  dot(s, 12.1, 0.72, 1, SPEC[0], 0.5);
  card(s, M, 1.66, CW, 0.82, TINT);
  s.addText('Sebuah tindakan benar secara moral apabila dalam situasi tertentu semua pengambil keputusan secara bebas memilih untuk mengejar hasrat jangka pendek atau kepentingan jangka panjang mereka.',
    { isTextBox:true, x:M+0.32, y:1.8, w:CW-0.64, h:0.56, fontFace:HEAD, fontSize:15, color:INK, margin:0, lineSpacing:21 });

  card(s, M, 2.66, CW/2-0.15, 1.82, TINT2);
  s.addText('Tokoh', { isTextBox:true, x:M+0.32, y:2.8, w:CW/2-0.8, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText([
    { text:'Thomas Hobbes, Leviathan. Tanpa pencegahan yang kuat, dalam state of nature timbul perang semua melawan semua.', options:{ bullet:true, breakLine:true } },
    { text:'Ayn Rand, The Virtue of Selfishness. Setiap orang bertanggung jawab atas kebahagiaan dan pengembangan dirinya sendiri.', options:{ bullet:true } }
  ], { isTextBox:true, x:M+0.32, y:3.14, w:CW/2-0.85, h:1.25, fontFace:BODY, fontSize:12, color:INK, margin:0, paraSpaceAfter:5 });

  card(s, M+CW/2+0.15, 2.66, CW/2-0.15, 1.82, TINT2);
  s.addText('Egoism bukan selfishness', { isTextBox:true, x:M+CW/2+0.47, y:2.8, w:CW/2-0.8, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Seorang egois masih dapat tergerak oleh rasa iba. Perusahaan yang berdonasi untuk memperbaiki reputasinya masih sejalan dengan egoism. Perusahaan yang mengabaikan amal dan memakai dananya untuk iklan promosi diri lebih tepat disebut selfishness.',
    { isTextBox:true, x:M+CW/2+0.47, y:3.12, w:CW/2-0.85, h:1.0, fontFace:BODY, fontSize:12, color:INK, margin:0, lineSpacing:17 });

  s.addText('Empat kelemahan', { isTextBox:true, x:M, y:4.64, w:CW, h:0.28,
    fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
  const kel = [
    ['Butuh mekanisme', 'Hanya bekerja bila ada mekanisme yang mencegah egois saling mengorbankan.'],
    ['Market failure', 'Korban perubahan iklim adalah generasi mendatang yang belum hadir untuk ikut dalam pasar.'],
    ['Tidak konsisten', 'Setiap orang mengejar kepentingannya dan harus menerima orang lain berbuat sama.'],
    ['Membenarkan salah', 'Segala sesuatu diperbolehkan selama kebutuhan si egois terlayani.']
  ];
  const kw = (CW-0.6)/4;
  kel.forEach((k,i) => {
    const x = M + i*(kw+0.2);
    card(s, x, 4.94, kw, 1.28);
    s.addText(k[0], { isTextBox:true, x:x+0.22, y:5.06, w:kw-0.44, h:0.26, fontFace:BODY, fontSize:12.5, bold:true, color:SPEC[0], margin:0 });
    s.addText(k[1], { isTextBox:true, x:x+0.22, y:5.38, w:kw-0.44, h:0.78, fontFace:BODY, fontSize:10.5, color:INK, margin:0, lineSpacing:14 });
  });
  s.addText('Penerapan pada Ethical Dilemma 3: anak-anak tidak benar-benar bebas mengejar kepentingannya karena pekerjaan tersebut menghalangi pendidikan dan waktu bermain. Dari sudut egoism pun tindakan tersebut dapat dinilai tidak bermoral.',
    { isTextBox:true, x:M, y:6.36, w:CW, h:0.4, fontFace:BODY, fontSize:12, italic:true, color:PRIM, margin:0, lineSpacing:16 });
  s.addNotes('Sebutkan bahwa Smith dan Friedman sering dikaitkan dengan egoism, namun menurut Werhane 1989 pendekatan Smith sebenarnya sosial karena memuat prudence, benevolence dan justice.');
}

// ============================================================ 9 utilitarianism
{
  const s = slide('Teori 2  ·  Consequentialist', 'Utilitarianism');
  dot(s, 12.1, 0.72, 2, SPEC[1], 0.5);
  card(s, M, 1.66, CW, 0.78, TINT);
  s.addText('Sebuah tindakan benar secara moral apabila menghasilkan jumlah kebaikan terbesar untuk jumlah orang terbesar yang terdampak oleh tindakan tersebut.',
    { isTextBox:true, x:M+0.32, y:1.82, w:CW-0.64, h:0.5, fontFace:HEAD, fontSize:15, color:INK, margin:0, lineSpacing:21 });

  card(s, M, 2.62, CW*0.46, 2.32, TINT2);
  s.addText('Greatest happiness principle', { isTextBox:true, x:M+0.32, y:2.76, w:CW*0.46-0.64, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Bentham dan Mill berpendapat bersikap etis berarti melakukan hal yang menghasilkan akibat baik untuk semua orang. Berbeda dari egoism, utilitarianism menanyakan berapa besar kesejahteraan kolektif yang dihasilkan.',
    { isTextBox:true, x:M+0.32, y:3.06, w:CW*0.46-0.68, h:1.2, fontFace:BODY, fontSize:12, color:INK, margin:0, lineSpacing:17 });
  s.addText('Mendekati versi pleasure dan pain dari analisis biaya manfaat.',
    { isTextBox:true, x:M+0.32, y:4.36, w:CW*0.46-0.68, h:0.44, fontFace:BODY, fontSize:11.5, italic:true, color:PRIM, margin:0, lineSpacing:15 });

  const xr2 = M + CW*0.46 + 0.25, wr2 = CW*0.54 - 0.25;
  s.addText('Tabel 3.2  Empat karakteristik utilitarianism (halaman 97)',
    { isTextBox:true, x:xr2, y:2.62, w:wr2, h:0.26, fontFace:BODY, fontSize:11.5, bold:true, color:MUTED, margin:0 });
  tbl(s, [
    [{ text:'Consequentialism', options:{ bold:true, color:SPEC[1] } }, 'Akibat sebuah tindakan yang menentukan benar salahnya secara etis'],
    [{ text:'Hedonism', options:{ bold:true, color:SPEC[1] } }, 'Utility diukur lewat pleasure, dan pain dikurangkan untuk menghasilkan net pleasure'],
    [{ text:'Maximalism', options:{ bold:true, color:SPEC[1] } }, 'Bukan sebagian akibat baik, melainkan jumlah terbesar yang mungkin'],
    [{ text:'Universalism', options:{ bold:true, color:SPEC[1] } }, 'Akibat untuk setiap orang perlu dipertimbangkan']
  ], { x:xr2, y:2.92, w:wr2, colW:[1.9, wr2-1.9], rowH:[0.42,0.42,0.42,0.42], fontSize:11.5 });

  card(s, M, 5.1, CW, 1.42);
  s.addText('Penerapan yang tipikal dalam bisnis', { isTextBox:true, x:M+0.35, y:5.24, w:CW-0.7, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Analisis dampak sosial dan lingkungan untuk proyek pertambangan atau infrastruktur. Contoh dalam buku adalah rencana tambang emas terbesar di Eropa di Roșia Montană, Rumania. Setelah protes massal berulang, pemerintah mengajukan status warisan UNESCO dan Gabriel Resources menuntut ganti rugi 4,4 miliar dolar melalui arbitrase Bank Dunia.',
    { isTextBox:true, x:M+0.35, y:5.54, w:CW-0.7, h:0.82, fontFace:BODY, fontSize:12, color:INK, margin:0, lineSpacing:17 });
  s.addNotes('Tiga penafsiran utility: hedonistik lewat pleasure dan pain, eudemonistik lewat kebahagiaan, dan ideal yang mencakup seluruh kebaikan bernilai intrinsik seperti persahabatan dan kepercayaan.');
}

// ============================================================ 10 neraca utilitarian dilemma 3
{
  const s = slide('Teori 2  ·  Consequentialist', 'Tabel 3.3  Neraca utilitarian Ethical Dilemma 3');
  s.addText('Petakan seluruh pihak, lalu bandingkan pleasure dan pain dari dua pilihan tindakan.',
    { isTextBox:true, x:M, y:1.62, w:CW, h:0.3, fontFace:BODY, fontSize:14, color:INK, margin:0 });
  tbl(s, [
    [hdr('Pihak'), hdr('Aksi 1 melanjutkan: Pleasure'), hdr('Aksi 1: Pain'), hdr('Aksi 2 menolak: Pleasure'), hdr('Aksi 2: Pain')],
    [{ text:'Product manager', options:{ bold:true, fill:{ color:TINT } } }, 'Kesepakatan baik untuk bisnis dan potensi bonus pribadi', 'Nurani terganggu dan risiko reputasi perusahaan', 'Nurani bersih dan risiko lebih kecil', 'Kehilangan kesepakatan yang baik'],
    [{ text:'Pemasok Thailand', options:{ bold:true, fill:{ color:TINT } } }, 'Kesepakatan yang baik', 'Tidak ada', 'Tidak ada', 'Kehilangan kesepakatan dan harus mencari pelanggan baru'],
    [{ text:'Orang tua', options:{ bold:true, fill:{ color:TINT } } }, 'Pendapatan keluarga terjamin', 'Prospek anak-anak terbatas', 'Tidak ada', 'Harus mencari sumber pendapatan lain'],
    [{ text:'Anak-anak', options:{ bold:true, fill:{ color:TINT } } }, 'Merasa dibutuhkan dan memperoleh persetujuan orang tua', 'Pekerjaan berat dan tidak ada kesempatan pendidikan', 'Ada waktu bermain dan bersekolah', 'Berpotensi dipaksa melakukan pekerjaan yang lebih menyakitkan'],
    [{ text:'Nenek', options:{ bold:true, fill:{ color:TINT } } }, 'Keluarga mampu menyokongnya', 'Tidak ada', 'Tidak ada', 'Kehilangan dukungan ekonomi']
  ], { x:M, y:2.0, w:CW, colW:[1.9, 2.6, 2.45, 2.35, 2.63], rowH:[0.32,0.62,0.5,0.5,0.62,0.42], fontSize:11 });

  card(s, M, 5.5, CW, 0.95, TINT);
  s.addText('Hasilnya condong ke aksi 1, yaitu melanjutkan kesepakatan, karena aksi tersebut melibatkan pleasure terbanyak. Hasil yang tidak nyaman inilah yang membuka empat masalah pokok utilitarianism.',
    { isTextBox:true, x:M+0.35, y:5.7, w:CW-0.7, h:0.6, fontFace:BODY, fontSize:13, color:INK, margin:0, lineSpacing:19 });
  s.addNotes('Tekankan bahwa hasil analisis ini membuat sebagian mahasiswa tidak nyaman. Ketidaknyamanan itu yang menjadi pintu masuk ke slide berikutnya.');
}

// ============================================================ 11 masalah + act vs rule
{
  const s = slide('Teori 2  ·  Consequentialist', 'Empat masalah utilitarianism dan dua jenisnya');
  const mas = [
    ['Subjectivity', 'Penilaian pleasure dan pain bergantung pada perspektif penganalisis. Singer (2011): hewan pun setara.'],
    ['Equal weighting', 'Seluruh pihak diberi bobot sama. Seseorang tidak boleh mengecualikan atau memprioritaskan dirinya.'],
    ['Kuantifikasi', 'Sulit memberi nilai uang pada setiap situasi. Pleasure dan pain anak-anak tidak terkuantifikasi.'],
    ['Distribusi utility', 'Kepentingan minoritas terabaikan. Distribusi jangka pendek dan jangka panjang juga berbeda hasilnya.']
  ];
  const mw = (CW-0.6)/4;
  mas.forEach((m,i) => {
    const x = M + i*(mw+0.2);
    card(s, x, 1.72, mw, 1.75, TINT2);
    dot(s, x+0.22, 1.92, i+1, SPEC[1], 0.36);
    s.addText(m[0], { isTextBox:true, x:x+0.66, y:1.94, w:mw-0.88, h:0.3, fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
    s.addText(m[1], { isTextBox:true, x:x+0.22, y:2.42, w:mw-0.44, h:0.95, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  });

  s.addText('Penyempurnaan Mill: dua jenis utilitarianism', { isTextBox:true, x:M, y:3.72, w:CW, h:0.3,
    fontFace:BODY, fontSize:14, bold:true, color:PRIM, margin:0 });
  tbl(s, [
    [hdr('Jenis'), hdr('Cara menilai'), hdr('Hasilnya pada Ethical Dilemma 3')],
    [{ text:'Act utilitarianism', options:{ bold:true, fill:{ color:TINT } } },
     'Melihat tindakan tunggal dan menghitung pleasure serta pain dari tindakan itu saja',
     'Dapat menyimpulkan tindakan tersebut benar, karena pain anak dianggap kecil mengingat mereka mungkin tetap harus bekerja'],
    [{ text:'Rule utilitarianism', options:{ bold:true, fill:{ color:TINT } } },
     'Melihat kelas tindakan dan menanyakan apakah prinsipnya menghasilkan lebih banyak pleasure dalam jangka panjang',
     'Menolak, karena tidak sulit berpendapat bahwa penderitaan akibat pekerja anak melampaui manfaat ekonominya']
  ], { x:M, y:4.06, w:CW, colW:[2.5, 4.4, 5.03], rowH:[0.32,0.78,0.78], fontSize:12 });

  s.addText('Dua jenis ini menghasilkan kesimpulan yang berlawanan atas kasus yang sama. Perbedaan tersebut akan muncul lagi pada kasus oil sands.',
    { isTextBox:true, x:M, y:6.1, w:CW, h:0.35, fontFace:BODY, fontSize:12.5, italic:true, color:PRIM, margin:0 });
  s.addNotes('Rule utilitarianism membebaskan analis dari keharusan memeriksa benar dan salah pada setiap situasi, dan memungkinkan penetapan prinsip yang berlaku umum.');
}

// ============================================================ 12 kant
{
  const s = slide('Teori 3  ·  Principle-based', 'Ethics of duties: categorical imperative');
  dot(s, 12.1, 0.72, 3, SPEC[2], 0.5);
  card(s, M, 1.66, CW, 0.72, TINT);
  s.addText('Categorical imperative: bertindak hanya menurut maksim yang pada saat bersamaan dapat dikehendaki menjadi hukum universal.',
    { isTextBox:true, x:M+0.32, y:1.8, w:CW-0.64, h:0.46, fontFace:HEAD, fontSize:15, color:INK, margin:0, lineSpacing:21 });

  s.addText('Tabel 3.4  Dua formulasi kunci (halaman 102)', { isTextBox:true, x:M, y:2.54, w:CW, h:0.26,
    fontFace:BODY, fontSize:11.5, bold:true, color:MUTED, margin:0 });
  tbl(s, [
    [hdr('Formulasi'), hdr('Pemikiran'), hdr('Penerapan pada Ethical Dilemma 3')],
    [{ text:'Universal acceptability', options:{ bold:true, fill:{ color:TINT } } },
     'Terima sebuah hukum moral hanya apabila semua makhluk rasional juga dapat menerimanya. Kegagalan membayar utang dan berbohong tidak dapat diuniversalkan.',
     'Anda sudah tidak nyaman membayangkan prinsip mempekerjakan anak diterapkan pada keluarga Anda di Eropa. Karena Anda tidak menghendaki hal itu menjadi hukum, tindakan tersebut dinilai tidak bermoral.'],
    [{ text:'Respect for persons', options:{ bold:true, fill:{ color:TINT } } },
     'Perlakukan kemanusiaan sebagai tujuan, tidak pernah hanya sebagai sarana. Bisnis memang memakai orang sebagai sarana, namun tidak boleh hanya sebagai sarana.',
     'Dengan memanfaatkan tenaga anak-anak, Anda memperlakukan mereka sebagai tenaga kerja murah untuk tujuan Anda sendiri dan bukan sebagai tujuan pada dirinya sendiri.']
  ], { x:M, y:2.84, w:CW, colW:[2.3, 4.8, 4.83], rowH:[0.32,1.1,1.1], fontSize:11.5 });

  s.addText('Tiga kritik terhadap Kantianisme', { isTextBox:true, x:M, y:5.46, w:CW, h:0.28,
    fontFace:BODY, fontSize:13.5, bold:true, color:PRIM, margin:0 });
  const kr = [
    ['Kurang menghargai motivasi', 'Menaikkan upah karena kasihan tidak bernilai moral, karena menalar kewajiban bernilai moral, padahal hasilnya sama.'],
    ['Kurang menghargai akibat', 'Tidak ada ruang untuk situasi ketika sedikit pelenturan aturan menghasilkan hasil yang lebih baik.'],
    ['Asumsi rasionalitas', 'Manusia sebagai makhluk rasional yang selalu menalar kewajibannya lebih merupakan ideal daripada realitas.']
  ];
  const kw2 = (CW-0.4)/3;
  kr.forEach((k,i) => {
    const x = M + i*(kw2+0.2);
    card(s, x, 5.78, kw2, 1.12, TINT2);
    s.addText(k[0], { isTextBox:true, x:x+0.22, y:5.88, w:kw2-0.44, h:0.26, fontFace:BODY, fontSize:12, bold:true, color:SPEC[2], margin:0 });
    s.addText(k[1], { isTextBox:true, x:x+0.22, y:6.14, w:kw2-0.44, h:0.7, fontFace:BODY, fontSize:10.5, color:INK, margin:0, lineSpacing:14 });
  });
  s.addNotes('Sebutkan relevansi Kant untuk stakeholder theory. Menurut Evan dan Freeman 1993 dasar etis konsep pemangku kepentingan diturunkan dari pemikiran Kantian.');
}

// ============================================================ 13 human rights
{
  const s = slide('Teori 4  ·  Principle-based', 'Ethics of rights: human rights');
  dot(s, 12.1, 0.72, 4, SPEC[3], 0.5);
  card(s, M, 1.66, CW, 0.72, TINT);
  s.addText('Human rights adalah hak dasar yang tidak dapat dicabut dan tidak bersyarat, yang melekat pada seluruh manusia tanpa kecuali.',
    { isTextBox:true, x:M+0.32, y:1.8, w:CW-0.64, h:0.46, fontFace:HEAD, fontSize:15, color:INK, margin:0, lineSpacing:21 });

  card(s, M, 2.56, CW*0.47, 2.34, TINT2);
  s.addText('Dari Locke sampai UDHR', { isTextBox:true, x:M+0.32, y:2.7, w:CW*0.47-0.64, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('John Locke mengonsepkan natural rights: hak atas hidup, kebebasan dan properti. Hak menghasilkan kewajiban bagi pihak lain, keduanya dua sisi mata uang.\n\nGagasan itu membentuk Konstitusi Amerika 1787 dan UDHR 1948. Lebih dari 13.100 organisasi menandatangani UN Global Compact, dengan human rights di dua prinsip pertama.',
    { isTextBox:true, x:M+0.32, y:2.98, w:CW*0.47-0.68, h:1.82, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  const xr3 = M + CW*0.47 + 0.25, wr3 = CW*0.53 - 0.25;
  s.addText('UN Guiding Principles atau Prinsip Ruggie (2011): tiga pilar', { isTextBox:true, x:xr3, y:2.56, w:wr3, h:0.28,
    fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
  const pil = [
    ['Protect', 'Negara', 'Kewajiban negara melindungi human rights'],
    ['Respect', 'Bisnis', 'Tanggung jawab perusahaan menghormati human rights lewat relasi bisnisnya'],
    ['Remedy', 'Peradilan', 'Akses pemulihan untuk korban pelanggaran yang terkait bisnis']
  ];
  pil.forEach((p,i) => {
    const y = 2.92 + i*0.63;
    card(s, xr3, y, wr3, 0.55, TINT2);
    s.addText(p[0], { isTextBox:true, x:xr3+0.2, y:y+0.06, w:1.15, h:0.42, fontFace:BODY, fontSize:13, bold:true, color:SPEC[3], margin:0 });
    s.addText(p[1], { isTextBox:true, x:xr3+1.35, y:y+0.06, w:0.95, h:0.42, fontFace:BODY, fontSize:11, color:MUTED, margin:0 });
    s.addText(p[2], { isTextBox:true, x:xr3+2.35, y:y+0.05, w:wr3-2.55, h:0.46, fontFace:BODY, fontSize:11, color:INK, margin:0, lineSpacing:14 });
  });

  card(s, M, 5.02, CW, 1.42, TINT);
  s.addText('Tiga pasal UDHR yang paling relevan untuk bisnis', { isTextBox:true, x:M+0.35, y:5.16, w:CW-0.7, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText([
    { text:'Pasal 12: privasi pekerja dan pelanggan     ', options:{ breakLine:true } },
    { text:'Pasal 20: kebebasan berkumpul dan berserikat, yang berkaitan dengan serikat pekerja', options:{ breakLine:true } },
    { text:'Pasal 23: hak atas pekerjaan, kondisi kerja yang adil, perlindungan dari pengangguran dan upah yang sama' }
  ], { isTextBox:true, x:M+0.35, y:5.46, w:CW-0.7, h:0.9, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  s.addText('Penerapan pada Ethical Dilemma 3: mempekerjakan anak melanggar hak atas pendidikan dan hak atas kebebasan memberi persetujuan.',
    { isTextBox:true, x:M, y:6.52, w:CW, h:0.3, fontFace:BODY, fontSize:11.5, italic:true, color:PRIM, margin:0, lineSpacing:15 });
  s.addNotes('Keterbatasannya: dasarnya kemasukakalan dan bukan metodologi mendalam, ada keberatan korporasi berperan seperti negara, dan gagasan hak berakar pada pandangan Barat yang individualistis.');
}

// ============================================================ 14 justice dan rawls
{
  const s = slide('Teori 5  ·  Principle-based', 'Justice dan social contract: John Rawls');
  dot(s, 12.1, 0.72, 5, SPEC[4], 0.5);

  card(s, M, 1.66, CW*0.42, 1.86, TINT2);
  s.addText('Dua cara memandang keadilan', { isTextBox:true, x:M+0.3, y:1.8, w:CW*0.42-0.6, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText([
    { text:'Fair procedures: apakah setiap orang bebas memperoleh imbalan atas usahanya (Boatright, 2014)', options:{ bullet:true, breakLine:true } },
    { text:'Fair outcomes: apakah konsekuensinya terdistribusi adil menurut kebutuhan atau merit', options:{ bullet:true } }
  ], { isTextBox:true, x:M+0.3, y:2.14, w:CW*0.42-0.65, h:1.32, fontFace:BODY, fontSize:12, color:INK, margin:0, paraSpaceAfter:5 });

  const xr4 = M + CW*0.42 + 0.25, wr4 = CW*0.58 - 0.25;
  card(s, xr4, 1.66, wr4, 1.86, TINT);
  s.addText('Veil of ignorance', { isTextBox:true, x:xr4+0.3, y:1.8, w:wr4-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Bayangkan orang-orang yang setara, bebas dan rasional, namun tidak mengetahui peran apa yang akan mereka tempati dalam masyarakat. Mereka dapat menjadi petugas kebersihan, balerina, pengidap penyakit terminal, seorang ratu, orang kaya atau miskin. Ketidaktahuan tersebut memaksa mereka bersikap adil karena harus memutuskan dari perspektif seluruh orang sekaligus.',
    { isTextBox:true, x:xr4+0.3, y:2.12, w:wr4-0.65, h:1.32, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  s.addText('Dua kriteria masyarakat yang adil', { isTextBox:true, x:M, y:3.66, w:CW, h:0.3,
    fontFace:BODY, fontSize:14, bold:true, color:PRIM, margin:0 });
  const kri = [
    ['Kriteria 1', 'Setiap orang memiliki hak yang setara atas sistem kebebasan dasar paling luas yang kompatibel dengan sistem kebebasan serupa untuk semua orang.', 'Bersifat fondasional. Kebebasan dasar harus terwujud sama rata sebelum ketimpangan apa pun boleh dibenarkan.'],
    ['Kriteria 2', 'Ketimpangan diatur sehingga memberi manfaat terbesar untuk pihak yang paling tidak beruntung, dan melekat pada jabatan yang terbuka untuk semua.', 'Disebut difference principle dan equal opportunity. Gaji tinggi pemimpin dapat diterima bila karyawan terbawah ikut lebih baik.']
  ];
  kri.forEach((k,i) => {
    const x = M + i*(CW/2+0.15);
    card(s, x, 4.0, CW/2-0.15, 1.72, i===0 ? TINT : TINT2);
    s.addText(k[0], { isTextBox:true, x:x+0.3, y:4.12, w:CW/2-0.6, h:0.26, fontFace:BODY, fontSize:12.5, bold:true, color:SPEC[4], margin:0 });
    s.addText(k[1], { isTextBox:true, x:x+0.3, y:4.42, w:CW/2-0.65, h:0.72, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
    s.addText(k[2], { isTextBox:true, x:x+0.3, y:5.16, w:CW/2-0.65, h:0.5, fontFace:BODY, fontSize:10.5, italic:true, color:MUTED, margin:0, lineSpacing:14 });
  });

  card(s, M, 5.86, CW, 0.86);
  s.addText('Penerapan pada Ethical Dilemma 3: anak-anak tidak memiliki kebebasan dasar yang sama karena tidak memperoleh pendidikan. Tanpa pendidikan mereka juga tidak memiliki peluang realistis mencapai posisi pihak yang lebih beruntung, sehingga syarat kesetaraan kesempatan tidak terpenuhi.',
    { isTextBox:true, x:M+0.35, y:6.0, w:CW-0.7, h:0.62, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  s.addNotes('Social contract memberi perusahaan license to operate, dan sebagai imbalannya perusahaan menerima pembatasan berupa pajak dan kepatuhan hukum.');
}

// ============================================================ 15 enam kritik
{
  const s = slide('Bagian 2', 'Enam kritik terhadap teori Western modernist');
  s.addText('Teori-teori tersebut menyajikan pandangan yang komprehensif, namun pandangan dunianya hanya menyajikan satu aspek kehidupan manusia sedangkan realitas jauh lebih kompleks.',
    { isTextBox:true, x:M, y:1.62, w:CW, h:0.38, fontFace:BODY, fontSize:14, color:INK, margin:0, lineSpacing:20 });
  const kri6 = [
    ['Too abstract', 'Stark (1994) dan Brenkert (2010)', 'Terlalu teoretis untuk keprihatinan sehari-hari manajer. Manajer tidak akan menerapkan prinsip abstrak dari filsuf yang sudah lama meninggal.'],
    ['Too narrow', 'Crane et al. (2019)', 'Setiap teori berfokus pada satu aspek moralitas. Kenapa harus memilih akibat, kewajiban, keadilan atau hak, padahal seluruhnya penting?'],
    ['Too objective and elitist', 'Parker (1998)', 'Etikawan spesialis dapat memvonis benar salahnya tindakan orang lain tanpa memiliki pengalaman atas situasi yang dihadapi orang tersebut.'],
    ['Too impersonal', 'Held (2006)', 'Fokus pada prinsip abstrak mengabaikan ikatan personal dan relasi yang membentuk perasaan seseorang mengenai benar dan salah.'],
    ['Too rational and codified', 'Bauman (1993) dan Rorty (2006)', 'Aturan yang terkodifikasi menekan otonomi moral dan merendahkan emosi moral. Yang dibutuhkan adalah imajinasi moral dan kisah etis yang lebih baik.'],
    ['Too imperialist', 'Naude (2017)', 'Tidak ada alasan mengasumsikan teori dari Barat cocok untuk seluruh dunia. Filsafat Asia klasik dan Afrika tradisional juga punya kontribusi.']
  ];
  const cw6 = (CW-0.5)/3;
  kri6.forEach((k,i) => {
    const x = M + (i%3)*(cw6+0.25), y = 2.3 + Math.floor(i/3)*2.06;
    card(s, x, y, cw6, 1.9, TINT2);
    dot(s, x+0.24, y+0.22, i+1, SPEC[i+1], 0.38);
    s.addText(k[0], { isTextBox:true, x:x+0.7, y:y+0.24, w:cw6-0.95, h:0.32, fontFace:BODY, fontSize:14, bold:true, color:PRIM, margin:0 });
    s.addText(k[1], { isTextBox:true, x:x+0.24, y:y+0.68, w:cw6-0.48, h:0.26, fontFace:BODY, fontSize:10.5, italic:true, color:MUTED, margin:0 });
    s.addText(k[2], { isTextBox:true, x:x+0.24, y:y+0.98, w:cw6-0.48, h:0.85, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  });
  s.addNotes('Kritik inilah yang membuka jalan ke empat teori alternatif pada bagian berikutnya.');
}

// ============================================================ 16 pembatas teori alternatif
{
  const s = darkSlide('Bagian 3', 'Empat perspektif alternatif');
  s.addText('Teori yang menekankan fleksibilitas serta mempertimbangkan pengambil keputusan, konteksnya dan relasinya dengan orang lain. Keempatnya jauh lebih jarang muncul dalam buku teks etika bisnis.',
    { isTextBox:true, x:M, y:4.45, w:6.2, h:1.5, fontFace:BODY, fontSize:14.5, color:'BDB6D6', margin:0, lineSpacing:23 });
  const alt = [['6','Virtue ethics','Karakter'],['7','Ethic of care','Relasi'],['8','Discourse ethics','Proses deliberatif'],['9','Postmodern ethics','Dorongan moral']];
  alt.forEach((a,i) => {
    const x = 7.3 + (i%2)*2.65, y = 4.45 + Math.floor(i/2)*0.95;
    s.addShape(pres.ShapeType.ellipse, { x, y, w:0.42, h:0.42, fill:{ color:SPEC[Number(a[0])-1] } });
    s.addText(a[0], { isTextBox:true, x, y:y+0.03, w:0.42, h:0.36, align:'center', valign:'middle', fontFace:BODY, fontSize:14, bold:true, color:W, margin:0 });
    s.addText(a[1], { isTextBox:true, x:x+0.55, y:y+0.0, w:2.1, h:0.26, fontFace:BODY, fontSize:13, bold:true, color:W, margin:0 });
    s.addText(a[2], { isTextBox:true, x:x+0.55, y:y+0.26, w:2.1, h:0.24, fontFace:BODY, fontSize:11.5, color:'9F98BE', margin:0 });
  });
  s.addNotes('Menurut Crane et al. 2019 keempat teori ini akan semakin berpengaruh dalam literatur etika bisnis.');
}

// helper: setengah slide untuk satu teori alternatif
function altTheory(s, x, w, num, nama, def, poin, terap) {
  card(s, x, 1.66, w, 4.96, TINT2);
  dot(s, x+0.3, 1.9, num, SPEC[num-1], 0.44);
  s.addText(nama, { isTextBox:true, x:x+0.88, y:1.93, w:w-1.15, h:0.34,
    fontFace:BODY, fontSize:17, bold:true, color:PRIM, margin:0 });
  card(s, x+0.3, 2.5, w-0.6, 0.98, W);
  s.addText(def, { isTextBox:true, x:x+0.5, y:2.62, w:w-1.0, h:0.8,
    fontFace:HEAD, fontSize:12.5, color:INK, margin:0, lineSpacing:18 });
  s.addText(poin.map((p,i) => ({ text:p, options:{ bullet:true, breakLine:i < poin.length-1 } })),
    { isTextBox:true, x:x+0.32, y:3.62, w:w-0.68, h:2.08, fontFace:BODY, fontSize:11.5, color:INK, margin:0, paraSpaceAfter:5 });
  s.addText('Ethical Dilemma 3: ' + terap, { isTextBox:true, x:x+0.32, y:5.76, w:w-0.68, h:0.82,
    fontFace:BODY, fontSize:10.5, italic:true, color:PRIM, margin:0, lineSpacing:14 });
}

// ============================================================ 17 virtue dan care
{
  const s = slide('Bagian 3', 'Virtue ethics dan ethic of care');
  altTheory(s, M, CW/2-0.15, 6, 'Virtue ethics',
    'Kepemilikan sifat karakter yang unggul, atau kebajikan, merupakan syarat untuk menjadi orang yang baik.',
    ['Berusia lebih dari 2000 tahun, berasal dari Aristoteles. Tindakan yang baik berasal dari orang yang baik',
     'Fokus penilaian berpindah dari tindakan kepada pelakunya, sehingga beresonansi kuat pada profesi seperti dokter dan akuntan',
     'Kebajikan seperti courage dan honesty menuntut keseimbangan. The good life berarti laba hanya satu bagian, kepuasan karyawan sama pentingnya'],
    'manajer yang berbudi dapat tetap berbisnis sambil memikul tanggung jawab atas pendidikan anak-anak, misalnya mendukung sekolah setempat.');
  altTheory(s, M+CW/2+0.15, CW/2-0.15, 7, 'Ethic of care',
    'Menekankan saling ketergantungan seseorang dengan pihak yang memiliki relasi penting dengannya, serta mengakui peran emosi.',
    ['Bentuk feminist ethics yang berakar pada Gilligan (1982), In a Different Voice',
     'Lima asumsinya: manusia tidak otonom, terikat keadaan dan relasi, serta posisinya tidak setara',
     'Masalah moral dipahami sebagai konflik tanggung jawab dalam relasi, bukan konflik hak',
     'Tujuan utamanya menghindari bahaya dan memelihara relasi yang sehat'],
    'menolak pekerja anak bukan karena melanggar prinsip Barat, melainkan karena penderitaan anak-anak serta hilangnya agensi mereka.');
  s.addNotes('Kelemahan virtue ethics: sulit memahami orang baik yang berbuat buruk, tidak jelas ideal kebajikan komunitas mana yang dirujuk. Kritik atas care ethics dari Borgerson: jangan direduksi pada sifat feminin yang stereotipikal.');
}

// ============================================================ 18 discourse dan postmodern
{
  const s = slide('Bagian 3', 'Discourse ethics dan postmodern ethics');
  altTheory(s, M, CW/2-0.15, 8, 'Discourse ethics',
    'Menyelesaikan konflik etis melalui proses deliberatif penghasilan norma, dengan komunikasi terbuka seluruh partisipan.',
    ['Landasannya Habermas. Hal yang benar harus dihasilkan lewat debat terbuka, bukan lewat argumen rasional saja',
     'Empat syarat diskursus ideal: imparsialitas, tanpa manipulasi persuasif, tanpa paksaan, dan keahlian partisipan',
     'Pihak yang lebih berkuasa harus menahan diri dari memaksakan nilainya',
     'Keputusan benar apabila dicapai lewat cara yang benar, terlepas dari isinya'],
    'seluruh pihak termasuk orang tua, anak-anak dan konsumen di Eropa sebaiknya bertemu untuk menghasilkan norma bersama.');
  altTheory(s, M+CW/2+0.15, CW/2-0.15, 9, 'Postmodern ethics',
    'Menempatkan moralitas di luar wilayah rasionalitas, yaitu pada dorongan moral yang bersifat emosional terhadap orang lain.',
    ['Menurut Bauman (1993) mengkodifikasi moralitas ke dalam aturan menyangkal sumber moralitas sesungguhnya',
     'Penilaian moral adalah perasaan spontan, dan lumpuh ketika orang berjarak dari penanggung akibatnya',
     'Empat implikasinya: holistik, praktik dan bukan prinsip, berpikir lokal, serta bersifat sementara',
     'Skeptis terhadap usaha etika bisnis, karena kode etis universal tidak akan pernah ditemukan'],
    'penilaian hanya mungkin bila kita mendatangi Thailand dan berbicara langsung.');
  s.addNotes('Keterbatasan discourse ethics: waktunya sangat besar dan asumsinya terlalu optimistis. Namun pendekatan ini terbukti mendasari penyelesaian banyak sengketa dampak lingkungan korporasi.');
}

// ============================================================ 19 lensa dan prisma
{
  const s = slide('Bagian 3', 'Dari lensa ke prisma: pesan utama Chapter 3');
  s.addText('Crane et al. (2019) tidak menyarankan satu teori sebagai pandangan yang terbaik atau paling benar.',
    { isTextBox:true, x:M, y:1.6, w:CW, h:0.3, fontFace:BODY, fontSize:14, color:INK, margin:0 });

  // Figure 3.1 di kiri
  card(s, M, 2.0, CW/2-0.15, 3.3, TINT2);
  s.addText('Figure 3.1  Pandangan tipikal', { isTextBox:true, x:M+0.3, y:2.14, w:CW/2-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addShape(pres.ShapeType.rightArrow, { x:M+0.35, y:3.2, w:0.95, h:0.5, fill:{ color:ACC } });
  s.addShape(pres.ShapeType.ellipse, { x:M+1.62, y:2.72, w:0.36, h:1.5, fill:{ color:SPEC[4] } });
  const L = { color:MUTED, width:1.25, endArrowType:'triangle' };
  s.addShape(pres.ShapeType.line, { x:M+2.15, y:2.95, w:1.25, h:0.52, line:Object.assign({},L) });
  s.addShape(pres.ShapeType.line, { x:M+2.15, y:3.47, w:1.25, h:0,    line:Object.assign({},L) });
  s.addShape(pres.ShapeType.line, { x:M+2.15, y:3.47, w:1.25, h:0.52, flipV:true, line:Object.assign({},L) });
  s.addShape(pres.ShapeType.diamond, { x:M+3.5, y:3.09, w:0.76, h:0.76, fill:{ color:SPEC[3] } });
  s.addText('Dilema etis', { isTextBox:true, x:M+0.2, y:3.78, w:1.3, h:0.24, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0 });
  s.addText('Lensa satu teori', { isTextBox:true, x:M+1.1, y:4.32, w:1.4, h:0.24, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0 });
  s.addText('Satu pertimbangan\nnormatif tunggal', { isTextBox:true, x:M+3.0, y:3.95, w:1.8, h:0.5, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0, lineSpacing:13 });
  s.addText('Teori etika memfokuskan keputusan pada satu pertimbangan saja, misalnya hak atau kewajiban.',
    { isTextBox:true, x:M+0.3, y:4.82, w:CW/2-0.65, h:0.42, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  // Figure 3.2 di kanan
  const xp = M+CW/2+0.15;
  card(s, xp, 2.0, CW/2-0.15, 3.3, TINT);
  s.addText('Figure 3.2  Pandangan pluralis, posisi buku ini', { isTextBox:true, x:xp+0.3, y:2.14, w:CW/2-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addShape(pres.ShapeType.rightArrow, { x:xp+0.35, y:3.2, w:0.95, h:0.5, fill:{ color:ACC } });
  s.addShape(pres.ShapeType.triangle, { x:xp+1.5, y:2.72, w:0.95, h:1.5, fill:{ color:SPEC[4] } });
  s.addShape(pres.ShapeType.line, { x:xp+2.6, y:2.9, w:1.15, h:0.57, flipV:true, line:Object.assign({},L) });
  s.addShape(pres.ShapeType.line, { x:xp+2.6, y:3.47, w:1.15, h:0,    line:Object.assign({},L) });
  s.addShape(pres.ShapeType.line, { x:xp+2.6, y:3.47, w:1.15, h:0.57, line:Object.assign({},L) });
  SPEC.slice(0,5).forEach((c,i) => s.addShape(pres.ShapeType.rect, { x:xp+3.85, y:2.72+i*0.3, w:0.4, h:0.28, fill:{ color:c } }));
  s.addText('Dilema etis', { isTextBox:true, x:xp+0.2, y:3.78, w:1.3, h:0.24, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0 });
  s.addText('Prisma banyak teori', { isTextBox:true, x:xp+1.1, y:4.32, w:1.75, h:0.24, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0 });
  s.addText('Beragam pertimbangan', { isTextBox:true, x:xp+3.15, y:4.28, w:1.9, h:0.44, align:'center', fontFace:BODY, fontSize:10.5, color:MUTED, margin:0, lineSpacing:13 });
  s.addText('Seluruh teori menyinari masalah dari sudut yang berbeda sehingga saling melengkapi dan bukan saling meniadakan.',
    { isTextBox:true, x:xp+0.3, y:4.82, w:CW/2-0.65, h:0.42, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  card(s, M, 5.5, CW, 0.95, TINT);
  s.addText('Lensa mengumpulkan cahaya menjadi satu titik, sedangkan prisma memecah cahaya putih menjadi spektrum warna. Analogi tersebut merangkum pesan utama seluruh Chapter 3.',
    { isTextBox:true, x:M+0.35, y:5.7, w:CW-0.7, h:0.6, fontFace:HEAD, fontSize:15, color:PRIM, margin:0, lineSpacing:21 });
  s.addNotes('Ini slide kunci. Sampaikan bahwa analisis pluralis mengakui keputusan bisnis nyata melibatkan banyak aktor dengan pandangan etis yang berbeda-beda.');
}

// ============================================================ 20 tabel 3.8
{
  const s = slide('Bagian 3  ·  Tabel 3.8', 'Daftar periksa sembilan pertimbangan etis');
  s.addText('Gunakan sebagai daftar periksa, bukan rencana sepuluh langkah, lalu tentukan teori mana yang relevan.',
    { isTextBox:true, x:M, y:1.6, w:CW, h:0.3, fontFace:BODY, fontSize:13.5, color:INK, margin:0, lineSpacing:19 });
  const per = [
    ['Kepentingan diri','Apakah ini kepentingan jangka panjang terbaik untuk saya atau organisasi saya?','Egoism'],
    ['Konsekuensi sosial','Bila seluruh konsekuensi untuk semua pihak dihitung, apakah kita lebih baik atau lebih buruk?','Utilitarianism'],
    ['Kewajiban','Kepada siapa saya berkewajiban? Apa yang terjadi bila setiap orang bertindak seperti saya?','Ethics of duty'],
    ['Hak orang lain','Hak siapa yang perlu saya pertimbangkan? Apakah martabat mereka saya hormati?','Ethics of rights'],
    ['Keadilan','Apakah saya memperlakukan setiap orang secara adil? Adakah disparitas yang dapat dihindari?','Justice'],
    ['Karakter','Apa yang akan dilakukan orang yang layak dan jujur dalam situasi yang sama?','Virtue ethics'],
    ['Relasi','Bagaimana perasaan pihak lain? Solusi mana yang memelihara relasi yang sehat?','Ethic of care'],
    ['Proses','Norma apa yang dapat kita susun bersama lewat komunikasi yang terbuka?','Discourse ethics'],
    ['Dorongan moral','Apakah saya hanya mengikuti praktik lazim tanpa mempertanyakan apakah ini terasa benar?','Postmodern ethics']
  ];
  const rows = [[hdr('Pertimbangan'), hdr('Pertanyaan yang dapat diajukan'), hdr('Teori')]];
  per.forEach((p,i) => rows.push([
    { text:p[0], options:{ bold:true, fill:{ color:TINT } } },
    p[1],
    { text:p[2], options:{ bold:true, color:SPEC[i] } }
  ]));
  tbl(s, rows, { x:M, y:2.08, w:CW, colW:[2.5, 7.2, 2.23], rowH:[0.3].concat(Array(9).fill(0.44)), fontSize:11.5 });
  s.addNotes('Tabel ini yang nanti dipakai untuk membedah kasus oil sands pada bagian terakhir.');
}

// ============================================================ 21 pembatas kasus
{
  const s = darkSlide('Bagian 4  ·  Diskusi kasus', 'Canada’s Oil Sands',
    'Most Destructive Project on Earth atau Ethical Oil? Case 3, halaman 129 sampai 134. Kasus ini dipilih menjadi penutup karena tidak memiliki jawaban tunggal. Perdebatannya telah berlangsung puluhan tahun tanpa kesimpulan yang konklusif.');
  s.addNotes('Sampaikan bahwa ketiadaan jawaban tunggal itulah yang membuat kasus ini cocok untuk menunjukkan pesan Figure 3.2.');
}

// ============================================================ 22 profil oil sands
{
  const s = slide('Bagian 4', 'Profil dan perkembangan industri oil sands');
  card(s, M, 1.66, CW*0.44, 2.52, TINT2);
  s.addText('Apa itu oil sands', { isTextBox:true, x:M+0.3, y:1.8, w:CW*0.44-0.6, h:0.28,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Campuran pasir, lempung, air dan bitumen yang berat dan sangat kental. Depositnya ada di Kazakhstan, Rusia dan Venezuela, namun deposit di provinsi Alberta merupakan yang terbesar dan paling berkembang secara komersial.\n\nLuasnya sekitar 140.000 kilometer persegi dengan Fort McMurray sebagai pusat industrinya.',
    { isTextBox:true, x:M+0.3, y:2.1, w:CW*0.44-0.65, h:1.92, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  const xt = M + CW*0.44 + 0.25, wt = CW*0.56 - 0.25;
  s.addText('Perjalanan pengembangannya', { isTextBox:true, x:xt, y:1.66, w:wt, h:0.28,
    fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
  tbl(s, [
    [{ text:'1920-an', options:{ bold:true, fill:{ color:TINT } } }, 'Paten pertama untuk proses pemisahan komersial'],
    [{ text:'1960-an', options:{ bold:true, fill:{ color:TINT } } }, 'Operasi komersial baru dimulai serius. Perkembangan lambat karena biaya ekstraksi tinggi dan harga minyak rendah'],
    [{ text:'2000-an', options:{ bold:true, fill:{ color:TINT } } }, 'Harga minyak melonjak. Shell, Chevron, Total, Exxon dan CNOOC masuk bersama Suncor dan Syncrude'],
    [{ text:'2012', options:{ bold:true, fill:{ color:TINT } } }, 'Investasi tahunan memuncak di atas 30 miliar dolar Amerika'],
    [{ text:'2018', options:{ bold:true, fill:{ color:TINT } } }, 'Investasi turun sampai dua pertiga menjadi sekitar 10 miliar dolar per tahun']
  ], { x:xt, y:1.98, w:wt, colW:[1.35, wt-1.35], rowH:[0.3,0.46,0.46,0.3,0.46], fontSize:11.5 });

  const stat = [['0,5 juta','barel per hari pada 1997'],['2,77 juta','barel per hari pada 2017'],['140.000','kilometer persegi di Alberta'],['99%','ekspor minyak Kanada ke Amerika']];
  const sw = (CW-0.6)/4;
  stat.forEach((t,i) => {
    const x = M + i*(sw+0.2);
    card(s, x, 4.45, sw, 1.15, i===1 ? TINT : TINT2);
    s.addText(t[0], { isTextBox:true, x:x+0.2, y:4.58, w:sw-0.4, h:0.5, fontFace:HEAD, fontSize:25, bold:true, color:PRIM, margin:0 });
    s.addText(t[1], { isTextBox:true, x:x+0.2, y:5.1, w:sw-0.4, h:0.44, fontFace:BODY, fontSize:11, color:MUTED, margin:0, lineSpacing:14 });
  });
  s.addText('Meskipun investasi turun, produksinya terus meningkat setiap tahun. Ketegangan itulah yang membuat kasus ini belum selesai.',
    { isTextBox:true, x:M, y:5.82, w:CW, h:0.35, fontFace:BODY, fontSize:12.5, italic:true, color:PRIM, margin:0 });
  s.addNotes('Sebutkan bahwa perkembangan yang lambat pada awalnya disebabkan biaya ekstraksi yang tinggi, dan baru berubah ketika harga minyak melonjak sejak pergantian abad.');
}

// ============================================================ 23 pro dan kontra
{
  const s = slide('Bagian 4', 'Argumen pendukung dan argumen penentang');
  s.addText('Pengembangan oil sands wajib memenuhi regulasi Kanada, namun kedua sisi menyajikan angka yang sama besar.',
    { isTextBox:true, x:M, y:1.58, w:CW, h:0.3, fontFace:BODY, fontSize:13.5, color:INK, margin:0, lineSpacing:19 });

  s.addText('Manfaat ekonomi (halaman 130)', { isTextBox:true, x:M, y:2.1, w:CW/2-0.15, h:0.3,
    fontFace:BODY, fontSize:13.5, bold:true, color:SPEC[3], margin:0 });
  tbl(s, [
    ['Lapangan kerja', { text:'206.000 pada 2017 menjadi 461.000 pada 2027', options:{ bold:true } }],
    ['Pemasok di luar Alberta', '3.400 perusahaan Kanada'],
    ['Kontribusi ke ekonomi Kanada', { text:'CAD 1,6 triliun pada 2017 sampai 2027', options:{ bold:true } }],
    ['Pajak federal dan provinsi', 'CAD 139 miliar dan CAD 98 miliar'],
    ['Dampak di Amerika Serikat', 'USD 16 miliar dan 145.000 pekerjaan'],
    ['Bisnis perusahaan masyarakat adat', 'CAD 3,3 miliar untuk 399 perusahaan dari 65 komunitas']
  ], { x:M, y:2.42, w:CW/2-0.15, colW:[2.85, 3.0], rowH:Array(6).fill(0.43), fontSize:11 });

  s.addText('Dampak lingkungan (halaman 131)', { isTextBox:true, x:M+CW/2+0.15, y:2.1, w:CW/2-0.15, h:0.3,
    fontFace:BODY, fontSize:13.5, bold:true, color:SPEC[0], margin:0 });
  tbl(s, [
    ['Emisi gas rumah kaca', { text:'20 persen lebih tinggi dari minyak konvensional', options:{ bold:true } }],
    ['Kontribusi emisi', '10 persen emisi Kanada, 0,14 persen emisi global'],
    ['Proyeksi ekspansi', { text:'Tambahan 50 sampai 150 juta ton per tahun pada 2030', options:{ bold:true } }],
    ['Kolam limbah beracun', '220 kilometer persegi berisi 1 triliun liter yang bocor'],
    ['Kerusakan habitat', 'Hutan boreal seluas Kota New York telah hancur'],
    ['Reklamasi', 'Hanya 11 persen jejak tambang aktif yang direklamasi']
  ], { x:M+CW/2+0.15, y:2.42, w:CW/2-0.15, colW:[2.6, 3.25], rowH:Array(6).fill(0.43), fontSize:11 });

  card(s, M, 5.2, CW, 1.35, TINT);
  s.addText('Spektrum sikap penentang', { isTextBox:true, x:M+0.35, y:5.32, w:CW-0.7, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  const nnn = [['Sierra Club','Bahan bakar fosil paling beracun di planet ini'],['Environmental Defence','Proyek paling merusak di bumi'],['Greenpeace','Menyerukan penghentian tar sands'],['Pembina Institute','Tidak menuntut penghentian, mendorong pengembangan yang bertanggung jawab']];
  const nw = (CW-0.7-0.45)/4;
  nnn.forEach((v,i) => {
    const x = M+0.35 + i*(nw+0.15);
    s.addText(v[0], { isTextBox:true, x, y:5.64, w:nw, h:0.24, fontFace:BODY, fontSize:11.5, bold:true, color:PRIM, margin:0 });
    s.addText(v[1], { isTextBox:true, x, y:5.88, w:nw, h:0.55, fontFace:BODY, fontSize:10.5, color:INK, margin:0, lineSpacing:14 });
  });
  s.addNotes('Sebutkan bahwa bahkan istilahnya diperebutkan. Kritikus menyebutnya tar sands, industri dan pemerintah menyebutnya oil sands. Ini bahan untuk discourse dan postmodern ethics nanti.');
}

// ============================================================ 24 ethical oil
{
  const s = slide('Bagian 4', 'Kampanye ethical oil dan bantahannya');
  card(s, M, 1.62, CW*0.5, 1.72, TINT2);
  s.addText('Argumennya', { isTextBox:true, x:M+0.3, y:1.76, w:CW*0.5-0.6, h:0.26,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Membeli minyak dari Kanada lebih bertanggung jawab karena oil sands diatur secara demokratis dan tidak terjerat korupsi. Ezra Levant memopulerkannya lewat buku Ethical Oil, lalu mendirikan Ethicaloil.org yang membagi negara menjadi penghasil ethical oil dan conflict oil.',
    { isTextBox:true, x:M+0.3, y:2.06, w:CW*0.5-0.65, h:1.2, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });

  s.addText('Tabel 3.9  Cadangan terbukti terbesar 2017 (miliar barel)', { isTextBox:true, x:M, y:3.44, w:CW*0.5, h:0.26,
    fontFace:BODY, fontSize:11.5, bold:true, color:MUTED, margin:0 });
  const res = [['1','Venezuela','301'],['2','Arab Saudi','267'],['3','Kanada','170'],['4','Iran','158'],['5','Irak','143'],['6','Kuwait','102'],['7','Uni Emirat Arab','98'],['8','Rusia','80'],['9','Libya','48'],['10','Nigeria','37']];
  const rr = [[hdr('#'), hdr('Negara'), hdr('Cadangan')]];
  res.forEach(r => rr.push([
    { text:r[0], options:{ color:MUTED } },
    { text:r[1], options:{ bold:r[1]==='Kanada', color:r[1]==='Kanada'?PRIM:INK, fill:{ color:r[1]==='Kanada'?TINT:W } } },
    { text:r[2], options:{ align:'right', bold:r[1]==='Kanada', fill:{ color:r[1]==='Kanada'?TINT:W } } }
  ]));
  tbl(s, rr, { x:M, y:3.72, w:CW*0.5, colW:[0.55, 3.6, 1.815], rowH:[0.26].concat(Array(10).fill(0.245)), fontSize:11 });

  const xb = M + CW*0.5 + 0.3, wb = CW*0.5 - 0.3;
  s.addText('Bantahannya datang dari dua arah', { isTextBox:true, x:xb, y:1.62, w:wb, h:0.28,
    fontFace:BODY, fontSize:13, bold:true, color:PRIM, margin:0 });
  card(s, xb, 1.96, wb, 1.62, TINT2);
  s.addText('John Bennett, Sierra Club of Canada', { isTextBox:true, x:xb+0.28, y:2.1, w:wb-0.56, h:0.26,
    fontFace:BODY, fontSize:11.5, bold:true, color:SPEC[0], margin:0 });
  s.addText('Fakta bahwa negara lain lebih buruk dalam hak asasi manusia tidak relevan. Kanada tidak dapat berbuat apa-apa mengenai negara tersebut, sedangkan Kanada dapat menangani oil sands miliknya dan tidak melakukannya.',
    { isTextBox:true, x:xb+0.28, y:2.4, w:wb-0.6, h:1.1, fontFace:HEAD, fontSize:12.5, italic:true, color:INK, margin:0, lineSpacing:17 });
  card(s, xb, 3.72, wb, 1.15, TINT2);
  s.addText('David Suzuki, environmentalis Kanada', { isTextBox:true, x:xb+0.28, y:3.86, w:wb-0.56, h:0.26,
    fontFace:BODY, fontSize:11.5, bold:true, color:SPEC[8], margin:0 });
  s.addText('Di dunia saat ini seluruh bahan bakar fosil tidak etis. Tidak ada yang namanya minyak yang etis.',
    { isTextBox:true, x:xb+0.28, y:4.14, w:wb-0.6, h:0.62, fontFace:HEAD, fontSize:12.5, italic:true, color:INK, margin:0, lineSpacing:17 });
  card(s, xb, 5.02, wb, 1.35, TINT);
  s.addText('Catatan penting', { isTextBox:true, x:xb+0.28, y:5.16, w:wb-0.56, h:0.26,
    fontFace:BODY, fontSize:11.5, bold:true, color:ACC, charSpacing:1, margin:0 });
  s.addText('Ethicaloil.org diyakini memperoleh dana dari industri minyak. Menurut juru bicara Greenpeace organisasi tersebut merupakan kelompok kedok untuk industri minyak besar.',
    { isTextBox:true, x:xb+0.28, y:5.44, w:wb-0.6, h:0.85, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  s.addNotes('Selain Kanada, sebagian besar negara dalam sepuluh besar memiliki rekam jejak yang buruk dalam demokrasi. Itulah seluruh kekuatan argumen Levant, dan itu pula yang dibantah Bennett.');
}

// ============================================================ 25 matriks sembilan teori
{
  const s = slide('Bagian 4', 'Kasus oil sands dibedah dengan sembilan teori');
  const mat = [
    ['Egoism','Market failure terlihat karena generasi mendatang tidak hadir di pasar','Netral'],
    ['Utilitarianism','Act cenderung mendukung, rule cenderung menolak karena target Paris mustahil','Terbelah'],
    ['Ethics of duty','Bila seluruh negara pada Tabel 3.9 berbuat sama, prinsipnya tidak dapat diuniversalkan','Menolak'],
    ['Ethics of rights','Pasal 23 mendukung, hak atas kesehatan dan tanah adat menentang','Menolak bersyarat'],
    ['Justice','Manfaat tersebar nasional, beban terkonsentrasi. Kriteria pertama Rawls tidak terpenuhi','Menolak'],
    ['Virtue ethics','Mengukur diri terhadap negara terburuk adalah perbandingan ke bawah','Menolak framing'],
    ['Ethic of care','Menempatkan komunitas hilir dan generasi mendatang sebagai relasi, bukan variabel','Transisi yang adil'],
    ['Discourse ethics','Label ethical oil lahir dari kampanye berdana industri, melanggar imparsialitas','Menolak prosesnya'],
    ['Postmodern ethics','Perebutan istilah oil sands dan tar sands menunjukkan bahasa membentuk moralitas','Anti absolutisme']
  ];
  const rows = [[hdr('Teori'), hdr('Sorotan pada kasus oil sands'), hdr('Kecenderungan')]];
  mat.forEach((m,i) => rows.push([
    { text:m[0], options:{ bold:true, color:SPEC[i], fill:{ color:TINT } } },
    m[1],
    { text:m[2], options:{ bold:true, color:PRIM } }
  ]));
  tbl(s, rows, { x:M, y:1.68, w:CW, colW:[2.05, 7.8, 2.08], rowH:[0.28].concat(Array(9).fill(0.44)), fontSize:11.5 });
  s.addText('Sembilan teori menghasilkan sembilan sorotan yang berbeda atas satu rangkaian fakta yang sama. Inilah prisma pada Figure 3.2 yang bekerja pada kasus nyata.',
    { isTextBox:true, x:M, y:6.08, w:CW, h:0.4, fontFace:BODY, fontSize:12.5, italic:true, color:PRIM, margin:0, lineSpacing:16 });
  s.addNotes('Tekankan bahwa tidak satu pun kolom kanan berbunyi mendukung tanpa syarat, namun kolom itu juga tidak seragam. Perbedaan itulah bahan diskusinya.');
}

// ============================================================ 26 diskusi
{
  const s = slide('Bagian 4', 'Rancangan diskusi kelas');
  card(s, M, 1.66, CW*0.53, 3.34, TINT);
  s.addText('Simulasi discourse ethics', { isTextBox:true, x:M+0.32, y:1.8, w:CW*0.53-0.64, h:0.3,
    fontFace:BODY, fontSize:15, bold:true, color:PRIM, margin:0 });
  s.addText('Bagi kelas menjadi enam kelompok. Beri masing-masing 2 menit menyampaikan posisinya, lalu minta seluruh kelompok menghasilkan satu norma bersama. Aturan mainnya mengikuti empat syarat diskursus ideal Habermas.',
    { isTextBox:true, x:M+0.32, y:2.14, w:CW*0.53-0.68, h:0.95, fontFace:BODY, fontSize:12, color:INK, margin:0, lineSpacing:17 });
  const grp = ['Pemerintah Alberta','Konsorsium perusahaan minyak','Sierra Club Canada','Masyarakat adat hilir Athabasca','Serikat pekerja Fort McMurray','Perwakilan generasi 2060'];
  grp.forEach((g,i) => {
    const y = 3.18 + (i%3)*0.36, x = M+0.34 + Math.floor(i/3)*(CW*0.53/2 - 0.1);
    s.addShape(pres.ShapeType.ellipse, { x, y:y+0.05, w:0.15, h:0.15, fill:{ color:SPEC[i] } });
    s.addText(g, { isTextBox:true, x:x+0.24, y, w:CW*0.53/2-0.42, h:0.3, fontFace:BODY, fontSize:11, color:INK, margin:0 });
  });
  s.addText('Setelah selesai, tanyakan apakah keempat syarat tersebut benar-benar dapat dipenuhi di ruang kelas. Bila di kelas saja sulit, bagaimana di dunia nyata?',
    { isTextBox:true, x:M+0.32, y:4.32, w:CW*0.53-0.68, h:0.6, fontFace:BODY, fontSize:11.5, italic:true, color:PRIM, margin:0, lineSpacing:16 });

  const xd = M + CW*0.53 + 0.25, wd = CW*0.47 - 0.25;
  s.addText('Empat pertanyaan pemantik, pilih dua', { isTextBox:true, x:xd, y:1.66, w:wd, h:0.3,
    fontFace:BODY, fontSize:13.5, bold:true, color:PRIM, margin:0 });
  const tny = [
    ['Uji Kant','Bila prinsip Kanada diterapkan seluruh negara pada Tabel 3.9, apa yang tersisa dari target Paris?'],
    ['Uji Rawls','Aturan apa yang Anda pilih bila tidak tahu akan terlahir sebagai pekerja, warga adat atau anak yang lahir 2060?'],
    ['Uji Bennett','Apakah pernyataan bahwa pihak lain lebih buruk merupakan argumen moral atau pengalihan perhatian?'],
    ['Uji bahasa','Siapa yang diuntungkan ketika istilah oil sands atau tar sands disepakati?']
  ];
  tny.forEach((t,i) => {
    const y = 2.02 + i*0.7;
    card(s, xd, y, wd, 0.62, TINT2);
    s.addText(t[0], { isTextBox:true, x:xd+0.24, y:y+0.06, w:1.15, h:0.5, fontFace:BODY, fontSize:11.5, bold:true, color:SPEC[i*2], margin:0 });
    s.addText(t[1], { isTextBox:true, x:xd+1.42, y:y+0.05, w:wd-1.66, h:0.54, fontFace:BODY, fontSize:10.5, color:INK, margin:0, lineSpacing:14 });
  });

  card(s, M, 5.12, CW, 1.42, TINT2);
  s.addText('Penutup: relevansi Indonesia', { isTextBox:true, x:M+0.35, y:5.26, w:CW-0.7, h:0.28,
    fontFace:BODY, fontSize:13.5, bold:true, color:ACC, margin:0 });
  s.addText('Hilirisasi nikel di Morowali dan Weda Bay memiliki struktur dilema yang hampir sama. Manfaat ekonominya besar dan terukur berupa investasi, lapangan kerja dan posisi Indonesia dalam rantai pasok baterai global. Biaya lingkungan dan sosialnya tersebar dan sulit dikuantifikasi. Yang membuatnya menjadi paralel yang tepat adalah adanya narasi pembenar yang berstruktur sama dengan ethical oil, yaitu bahwa nikel Indonesia dibutuhkan untuk transisi energi dunia.',
    { isTextBox:true, x:M+0.35, y:5.58, w:CW-0.7, h:0.9, fontFace:BODY, fontSize:11.5, color:INK, margin:0, lineSpacing:16 });
  s.addNotes('Pertanyaan penutupnya: apakah narasi nikel yang etis lolos dari uji yang sama dengan yang baru kita terapkan pada ethical oil? Lalu pertanyaan Rawls: siapa yang menikmati manfaatnya, siapa yang menanggung bebannya, dan apakah keduanya pihak yang sama?');
}

// ============================================================ 27 penutup
{
  const s = pres.addSlide();
  s.background = { color: DEEP };
  s.addText('Penutup', { isTextBox:true, x:M, y:1.02, w:CW, h:0.34,
    fontFace:BODY, fontSize:12, bold:true, color:ACC, charSpacing:2.4, margin:0 });
  s.addText('Setelah sembilan teori, kita tetap tidak memiliki satu jawaban', { isTextBox:true, x:M, y:1.44, w:CW-1.5, h:1.22,
    fontFace:HEAD, fontSize:34, bold:true, color:W, margin:0, lineSpacing:40 });
  s.addText('Buku ini memang tidak menjanjikannya.', { isTextBox:true, x:M, y:2.7, w:CW-1.5, h:0.4,
    fontFace:HEAD, fontSize:20, italic:true, color:ACC, margin:0 });
  const ring = [
    ['Utilitarianism','Terbelah, bergantung batasnya'],
    ['Duty, rights, justice','Cenderung menolak'],
    ['Ethic of care','Menuntut transisi yang adil'],
    ['Discourse ethics','Menolak proses, tawarkan jalannya'],
    ['Virtue, postmodern','Membongkar bahasanya']
  ];
  ring.forEach((r,i) => {
    const y = 3.26 + (i%3)*0.42, x = M + Math.floor(i/3)*(CW/2);
    s.addShape(pres.ShapeType.ellipse, { x, y:y+0.06, w:0.16, h:0.16, fill:{ color:SPEC[i*2] } });
    s.addText(r[0], { isTextBox:true, x:x+0.28, y, w:2.0, h:0.3, fontFace:BODY, fontSize:12.5, bold:true, color:W, margin:0 });
    s.addText(r[1], { isTextBox:true, x:x+2.3, y, w:CW/2-2.6, h:0.3, fontFace:BODY, fontSize:12, color:'9F98BE', margin:0 });
  });
  s.addText('Hal tersebut bukan kegagalan melainkan pesan dari Figure 3.2. Memandang melalui prisma memberi kita spektrum pertimbangan yang tidak akan terlihat melalui lensa satu teori. Keputusan yang baik bukan keputusan yang menemukan teori paling benar, melainkan keputusan yang menyadari seluruh spektrum tersebut dan dapat dipertanggungjawabkan kepada seluruh pihak yang terdampak.',
    { isTextBox:true, x:M, y:4.7, w:CW-1.2, h:1.35, fontFace:BODY, fontSize:14, color:'CFC9E3', margin:0, lineSpacing:23 });
  SPEC.forEach((c,i) => s.addShape(pres.ShapeType.ellipse,
    { x: M + i*0.30, y: 6.5, w:0.19, h:0.19, fill:{ color:c } }));
  s.addNotes('Tutup dengan mengulang pemungutan suara pembuka mengenai ethical oil, lalu bandingkan hasilnya dengan hasil di awal sesi.');
}

pres.writeFile({ fileName: 'Chapter-3-Evaluating-Business-Ethics.pptx' })
  .then(f => console.log('selesai:', f));
