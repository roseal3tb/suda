# Current editorial asset map

All served media is local under `public/editorial/` and comes from the user's supplied archives. No stock photos, image generation, or database was added. See `visual-refresh.md` for the latest change record.

| Location | Image or film |
|---|---|
| Enlarged homepage hero | `motion/hero_atelier_montage.webm` / `.mp4`: seven quick cuts alternating crafts and models wearing dresses |
| Hero static fallback | `images/hero_atelier_poster.webp`, extracted from the film's first frame |
| Home professional-profile band | `profile_red_carpet_gold.webp`, `profile_red_carpet_black.webp`, `editorial_burgundy_look.webp` |
| Login | `editorial_teal_gown.webp` |
| Registration | `editorial_couture_duo.webp` |
| Home inspiration collage | `editorial_pastel_gown.webp`, `inspiration_yellow_model.webp`, `editorial_group_gowns.webp`, `inspiration_lilac_model.webp`, `editorial_black_couture.webp`, `inspiration_mauve_model.webp`, `inspiration_monochrome_model.webp` |
| Pattern course | `course_pattern_making.webp` |
| Draping course | `internship_draping.webp` |
| Heritage competition | `competition_embroidered_couture.webp` |
| Textile competition | `competition_pink_couture.webp` |
| Atelier internship | `internship_beadwork.webp` |
| Collection-development internship | `internship_pink_embroidery.webp` |
| Junior designer role | `career_studio_sewing.webp` |
| Pattern-maker role | `career_pattern_cutting.webp`, a separate frame from the supplied pattern-cutting film |

The twelve still images used across authentication, the professional-profile band and the inspiration collage are distinct. Photos are not seeded as a demo user's portfolio, nor individually assigned to named designers without a grounded source mapping. Existing opportunity detail pages naturally retain their corresponding card image.

The new film is silent, 720×800, approximately 7.47 seconds, H.264/yuv420p/faststart and VP9/WebM (see current byte sizes in `qa/visual-refresh-media.json`). It contains three craft scenes and four fashion-model scenes. Every clip fills the frame with a direct cover crop from the original source. No blurred background or stretching is used; per-scene crop positions retain faces. Clips play at 1.12× with fast editorial cuts. Original source pixels are not claimed to be enhanced.

`fashion-media-manifest.json` records original filenames and timestamps for new frames and film scenes. `asset_manifest.json` retains the earlier source map. Run `python3 scripts/prepare-fashion-media.py /path/to/extracted/photos` to reproduce this revision from the original `photos.zip` contents, with ffmpeg and Pillow installed.

The desktop hero reaches the left viewport edge. The 01–07 badge is removed. Video autoplays muted and inline, with no visible play/pause button as requested. It is omitted when reduced motion is requested. The component no longer pauses playback on scroll or tab changes; playback is requested on readiness and return to the page. MP4 is preferred, controls are disabled, and a poster overlays stalled/blocked media so browser playback UI does not become the page’s fallback. A static image remains if playback fails or is blocked. Autoplay remains subject to the visitor's browser settings.

Below-the-fold photos use lazy loading. The original SUDA logo is unchanged. Reserve loops/images remain available but are not all requested on page load. Preview GIFs and source archives are not included in the deployed public folder.
