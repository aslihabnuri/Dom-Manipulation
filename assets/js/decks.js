/* ============================================================
   BEfS Study Hub — Metadata slide dosen per pertemuan
   Sumber: berkas PPT di folder Drive "Materi".
   Kode (1) = pertemuan pertama, (2) = pertemuan kedua.

   ISI slide sudah DILEBUR ke dalam chapters.js: tiap bagian
   materi bab terkait mengikuti alur slide dan diperkaya
   penjelasan buku, dengan field `ppt: "Slide n"` sebagai
   penanda sumbernya. Berkas ini hanya menyimpan metadata
   untuk bar pedoman dan penanda pada pemilih bab.

   Menambah pertemuan baru:
   1. Tambahkan entri metadata di bawah.
   2. Lebur isi slide-nya ke sections bab terkait di
      chapters.js dengan field `ppt`.
   ============================================================ */

window.BEFS_DECKS = [
  {
    ch: 1, meeting: 1, slides: 15,
    file: "Chapter_1_with_Explanatory_Notes (1).pptx",
    fileUrl: "https://drive.google.com/file/d/1-8XGJkhx82VhHH1-6RIsAMuDozr-N1q0/view"
  },
  {
    ch: 2, meeting: 2, slides: 70,
    file: "Materi Etika Bisnis-Terbaru.pptx",
    fileUrl: "https://drive.google.com/file/d/16wdoZJYqUiEqXR6i_sEElwl_tjHmoNK6/view"
  }
];
