# Birthday greeting generator (kie.ai)

Membuat ucapan ulang tahun bergaya kolase scrapbook (bunting, "HAPPY BIRTHDAY"
ransom-note, balon foil angka, topi glitter, tag "Favorite Person", kue, stiker
"i love you.") dengan foto orang yang berulang tahun sebagai pusatnya.
Model: `nano-banana-pro` lewat kie.ai Market API.

Preview template (tanpa foto): `preview-template.png`.

## Cara pakai

1. Taruh foto di folder ini, misalnya `birthday-greeting/photo.jpg`
   (foto portrait, wajah jelas, hasil terbaik jika hanya satu orang di frame).
2. Jalankan dari root repo (butuh Node 18+):

   ```bash
   export KIE_API_KEY=isi_api_key_kamu     # Windows PowerShell: $env:KIE_API_KEY="..."
   node birthday-greeting/generate.mjs --photo birthday-greeting/photo.jpg --age 25
   ```

3. Hasil tersimpan di `birthday-greeting/output/` (folder ini di-gitignore agar
   foto pribadi tidak ikut ter-push).

## Opsi

| Flag | Default | Keterangan |
| --- | --- | --- |
| `--photo <path>` | - | foto sumber (jpg/png/webp) |
| `--age <n>` | `25` | angka pada balon foil dan jumlah lilin |
| `--name <text>` | - | tulis nama di kue (opsional) |
| `--label <text>` | `Favorite Person` | teks pada tag karton |
| `--resolution` | `2K` | `1K`, `2K`, atau `4K` |
| `--model` | `nano-banana-pro` | model kie.ai lain yang menerima `image_input` |
| `--no-photo` | - | hanya template tanpa wajah (uji gaya) |
| `--no-love` | - | tanpa stiker "i love you." |

Biaya observasi: 18 kredit untuk 1K. 2K/4K lebih mahal, cek dashboard kie.ai.
Jika hasil pertama kurang mirip, jalankan ulang: setiap run menghasilkan
variasi baru dan wajah biasanya lebih akurat jika foto sumbernya close-up.

Jangan pernah menulis API key ke dalam file yang di-commit.
