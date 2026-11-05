# Sophie Martin — konversi 1:1 (REQ ADS SM)

Sumber: folder Drive "REQ ADS SM". Frame referensi: `SM ADS_7 SEPT.mp4`.

| Output | Sumber | Penanganan |
|---|---|---|
| Jezz Bag 1_1x1.mp4 | 960x720 split-screen | Video kiri di atas, strip teks "Meet the new tote bag" di bawah |
| Jezz Bag 2_1x1.mp4 | 720x1280 60fps | Isi penuh panel, 30fps |
| Jezz Bag 3_1x1.mp4 | 1080x1920 | Isi penuh panel |
| Francine Medium 1_1x1.mp4 | 720x1280 | Isi penuh panel |
| Francine Medium 2_1x1.mp4 | 1440x1080 | Crop tengah 9:16 (teks muat, margin tipis) |
| Francine Medium 3_1x1.mp4 | 360x640 | Isi penuh panel (sumber resolusi rendah, di-upscale 1.5x) |

Spesifikasi output: 1080x1080, H.264 CRF 18, 30fps, AAC 192k, audio asli.
Render ulang: `tools/render.sh <src.mp4> <out.mp4> cover|jezz1`
