# Presentasi Sesi 7 — Studi Kasus Alaska Airlines: Planning and Control (MRP & ERP, Sequencing and Scheduling)

Mata kuliah: Operations & Technology Management (dosen pengampu: Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.).
Presenter: Aslih Abnuri (25/574338/PEK/31801), Happy Dinithasari (25/574400/PEK/31831), Juan Bagas Prayogo (25/573847/PEK/31678), Riska Novalita (25/574037/PEK/31724).

## Berkas
- `Planning-and-Control_MRP-ERP-Scheduling_Alaska-Airlines.pptx` — 20 slide, dapat diedit di PowerPoint.
- `Planning-and-Control_MRP-ERP-Scheduling_Alaska-Airlines.pdf` — versi PDF (font sudah tertanam).
- `Font-Barlow-untuk-PPT.zip` dan folder `fonts/` — font yang dipakai deck (lisensi SIL OFL, gratis). **Pasang dulu sebelum membuka PPTX** agar tampilan sama dengan PDF: Barlow Condensed ExtraBold (judul), Barlow Condensed Bold (label), Barlow Regular/Bold/Italic (isi). Sumber: https://fonts.google.com/specimen/Barlow+Condensed dan https://fonts.google.com/specimen/Barlow.
- `Materi-Pemahaman_Alaska-Airlines.pdf` — materi pemahaman dengan bahasa sederhana: konsep di balik tiap slide, data dan sumbernya, perhitungan langkah demi langkah, antisipasi pertanyaan, kamus istilah.
- `Naskah-Presentasi_Alaska-Airlines.pdf` — naskah lisan per slide (±26 menit): Aslih slide 1–9 (pembuka, MRP), Happy 10–11 (ERP), Juan 12–15 (scheduling), Riska 16–20 (sequencing, evaluasi, kesimpulan). Naskah yang sama tertanam di catatan pembicara PPTX.
- `sumber/make_docs.py` dan `sumber/topdf.js` — pembangkit kedua dokumen (HTML → PDF via Chromium).
- `sumber/` — skrip pembangkit: `deck.js` (pptxgenjs), `prep_images.py` (pemotong foto ke rasio persis + sudut bulat), `gen_alaska.py` dan `gen_retry.py` (kie.ai Nano Banana 2; foto referensi Anda dipakai sebagai acuan tone dan livery Alaska Airlines asli dengan tulisan "Alaska" dan logo ekor; kunci API dari variabel lingkungan `KIE_KEY`), `measure.py` (pengukur lebar teks untuk kotak sorot judul).

## Desain
Mengikuti referensi "Klyro Creative Agency Pitch Deck": palet oranye `#F1681D`, hijau limau `#9CC506`, hitam `#1A1C14`, putih tulang `#F4F4F2`; judul kondensasi huruf kapital dengan kata yang disorot kotak warna; kartu bersudut bulat; foto bersudut bulat dan foto penuh pada pembuka subtopik. Ukuran font minimum: isi 14–16 pt, judul 42–60 pt, tabel 12,5–15 pt, catatan sumber 13 pt.

## Struktur (20 slide)
1 Judul + presenter · 2 Alur pembahasan · 3 Tentang Alaska Airlines · 4 Skala operasi dan ketepatan waktu · 5 Empat sumber gangguan · 6 Pembuka Subtopik 1 · 7 Dari jadwal ke suku cadang · 8 Contoh perhitungan brake assembly · 9 Perencanaan perawatan 2024 vs 2026 · 10 Integrasi sistem ala ERP · 11 Dua outage 2025 · 12 Pembuka Subtopik 2 · 13 Apa yang dijadwalkan setiap hari · 14 Satu hari badai di Seattle · 15 Pusat operasi dan kru · 16 Mengurutkan pekerjaan di hangar · 17 Alur dua tahap dan staf darat · 18 Evaluasi dan rekomendasi · 19 Kesimpulan (referensi lengkap pada catatan pembicara) · 20 Terima kasih.

## Sumber data kasus
Heizer, Render & Munson (2017) Global Company Profile Bab 15 dan Contoh 15.4–15.8; Slack, Brandon-Jones & Burgess (2022) Bab 10 dan 14; Alaska Airlines newsroom (Tailsight, April 2026; single operating certificate, 29 Oktober 2025; fact sheet); Cirium 2024 On-Time Performance Review; GeekWire dan CBS News (outage Juli dan Oktober 2025); CNBC dan Anchorage Daily News (grounding 737 MAX 9, Januari 2024); Aviacionline (armada akhir 2024); Halldale (Fox TMS, 2024).
