# Protokol worker sinkron Drive (WAJIB diikuti persis)
Direktori kerja: /tmp/claude-0/-home-user-Dom-Manipulation/fc29f777-d4a1-58bd-82af-3784fcb7387f/scratchpad
Tool MCP: muat dulu via ToolSearch "select:mcp__Google_Drive__download_file_content".

Untuk SETIAP objek {id,title,folderKey,fileSize} dalam file daftar tugasmu (urut satu per satu); lewati jika entries/<id>.json sudah ada:
1. Panggil mcp__Google_Drive__download_file_content dengan fileId=id.
2. Simpan base64 ke disk (pilih salah satu, urut prioritas):
   a. Jika hasil tool otomatis tersimpan ke file (pesan "Output has been saved to <path>"):
      jq -r '.content' '<path>' | python3 b64save.py dl/<id> <fileSize>
   b. Jika hasil tampil langsung (inline): JANGAN menyalin manual. Jalankan:
      python3 extract_b64.py <id> <fileSize> | python3 b64save.py dl/<id> <fileSize>
      (script ini mengambil base64 persis dari transkrip dan memverifikasi ukuran + integritas ZIP untuk .xlsx)
   c. Hanya jika (b) gagal: salin base64 apa adanya ke heredoc:
      python3 b64save.py dl/<id> <fileSize> <<'EOF64'
      <base64>
      EOF64
   Wajib keluar "SAVED ..." dengan byte sesuai fileSize. Jika gagal setelah 3 percobaan: catat FAIL, lanjut file berikutnya.
3. Parse (deterministik, JANGAN menghitung manual / mengedit script):
   - title berakhiran .xlsx:  python3 xlsx_to_rows.py dl/<id> dl/<id>.rows.json  lalu
                              node offline_detect.js --rows dl/<id>.rows.json <folderKey> <id> "<title>"
   - selainnya (csv):         node offline_detect.js --csv dl/<id> <folderKey> <id> "<title>"
   Baris "OK ..." atau "SKIP: ..." = status file (hasil JSON otomatis ke entries/<id>.json).
4. Hemat disk untuk file > 500 KB: setelah parse, hapus dl/<id>, dl/<id>.rows.json, dl/<id>.x.xlsx dan file hasil tool '<path>'.
5. Laporan akhir: jumlah OK / SKIP / FAIL, dan untuk setiap SKIP/FAIL: judul + alasan. Jangan lampirkan isi file.
Aturan: jangan pernah mengarang atau mengetik angka data; semua angka hanya lewat script. Jangan memproses file di luar daftarmu.
