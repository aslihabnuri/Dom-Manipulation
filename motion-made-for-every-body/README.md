# Toni Black motion video: Made For Every Body

`final/TONI-BLACK_Made-For-Every-Body_Motion_1080x1080.mp4`: 1:1, 1080x1080, 24 fps, 18 s, H.264 + AAC, about 1.6 MB. Motion-graphic style of the Drive file `Video Referensi.mp4` (product carousel, header wipe, button tapped by a hand cursor), re-set to the Toni Black guideline (monochrome, Zalando Sans Expanded and Arimo, logo `6.png`).

## Copy on screen (exactly)
`MADE FOR EVERY BODY` / `SAVE UP TO` / `25%` / per product: name, strike price, sale price / `FREE ONGKIR` / `VOUCHER` `NEW BUYER 5K` / `SHOP NOW`.
- **25%** is set as the campaign headline figure at the owner's decision (a promotional line, not computed from the listed prices; the largest listed discount is 23.5%, Brief Kids 3pcs).
- Prices in Rp format with a dot (marketplace convention).

## Products (real photos from Drive, shape and colour unchanged)
| On screen | File | Strike | Sale |
|---|---|---|---|
| BRIEF KIDS 3PCS | Brief Kids.png | Rp239.000 | Rp182.850 |
| BOXER BRIEF KIDS 3PCS | Boxer Brief Kids.png | Rp279.000 | Rp217.350 |
| BOXER BRIEF MEN 3PCS | Boxer Brief Men.png | Rp389.000 | Rp309.350 |
| BRIEF MEN 3PCS | Brief Men.png | Rp289.000 | Rp228.850 |
| BOXER MEN 2PCS | Boxer Men.png | Rp289.000 | Rp228.850 |
| CREWNECK MEN 2PCS | Crewneck.jpg (background removed) | Rp369.000 | Rp286.350 |
| SINGLET MEN 2PCS | Tanktop.jpg (background removed) | Rp289.000 | Rp228.850 |
Note: five photos show fewer pieces than the pack name (Boxer Brief Men and Brief Men show 2, Boxer Men, Crewneck and Singlet show 1); used as supplied, with the pack size in the name.

## Music (kie.ai, Suno V6, one request, 12 credits measured from the balance: 8753.61 to 8741.61)
Instrumental minimal deep house, about 120.7 BPM (beat 0.497 s, std 0.011 s). Two tracks came back (`assets/music/suno_track_A.mp3`, `suno_track_B_used.mp3`); B is used for its steady kick and an 8-bar phrase whose energy rise lands on a bar start. Cut 11.82 s to 29.82 s (`cut_11.82-29.82s.m4a`), 50 ms fade-in, 1.2 s fade-out; the track's own tail is the outro. Commercial-use terms of AI music on kie.ai/Suno were not verified.

## Timeline (bar starts from the beat grid: 0, 2.00, 3.99, 5.97, 7.96, 9.96, 11.93, 13.93, 15.93 s)
- 0 to 2 s: logo fades in, headline wipes in, `SAVE UP TO` and `23%` pop, badge row rises, carousel slides in.
- 2 to 15.9 s: one product per bar, each arriving on the downbeat (0.42 s slide), name and prices cross-fade, the strike line draws across; `25%` pulses on the drop at 3.99 s; the hand taps `SHOP NOW` at 5.97, 9.96, 13.93 s with a ripple.
- 15.9 to 18 s: the seven products settle into a 4 + 3 grid; a last tap at 16.9 s.

## Rebuild
`TB_FONTS=<fonts/static/> python3 scripts/render.py assets/products assets/music/cut_11.82-29.82s.m4a OUT.mp4` (frames rendered with PIL and piped to ffmpeg; `render.py preview assets/products OUTPREFIX t1 t2 ...` writes stills). `scripts/suno_music.py` is the music request (reads `KIE_API_KEY` from the environment).
