# Atelier asset integration

All paths below are under `public/editorial/`. Original supplied files remain in the uploaded archive. Seed opportunity names and organizers are fictional; imagery illustrates a craft, not an actual organizer or application.

| Website location | Selected file | Reason |
|---|---|---|
| Home hero, left cinematic panel | `motion/hero_atelier_montage.webm`, `.mp4` | Pattern cutting → sewing → draping → white beadwork → pink embroidery; one coordinated film |
| Hero initial/reduced-motion/error state | `images/hero_atelier_poster.webp` | Immediate static visual with identical reserved space |
| Course “من الفكرة إلى الباترون” | `images/course_pattern_making.webp` | Hands cutting a paper pattern |
| Course “فن التشكيل على المانيكان” | `images/internship_draping.webp` | Hands shaping fabric on a mannequin, directly matching the technique |
| Competition “أزياء تنسج حكايتنا” | `images/competition_embroidered_couture.webp` | Expressive embroidered garment detail |
| Competition “حوار مع النسيج” | `images/competition_pink_couture.webp` | Textile texture and decorative construction |
| Internship “تجربة في قلب الأتيليه” | `images/internship_beadwork.webp` | Practical precision handwork inside an atelier |
| Internship “تدريب في تطوير المجموعات” | `images/internship_pink_embroidery.webp` | Embroidery and garment development |
| Career “مصممة أزياء مبتدئة” | `images/career_studio_sewing.webp` | Professional garment execution |
| Career “متخصصة باترون” | `images/course_pattern_making.webp` | Pattern cutting matches the role; intentional reuse rather than unrelated imagery |
| Home professional-profile/portfolio editorial band | `images/internship_draping.webp` | Creation process, without inventing a user's portfolio |
| Login/registration visual | `images/course_pattern_making.webp` | Beginning a design process; light, neutral tones |
| New admin opportunities | `categoryMedia` defaults | Image follows selected category; existing edited records retained |

## Further category refinement

Images follow the technique described, including deliberate reuse of the pattern-cutting image for the pattern-maker role. They do not claim to depict a real course/job. The descriptions remain the authoritative opportunity content.

## Classified reserve assets

- `motion/loop_sewing.mp4`, `loop_draping.mp4`, `loop_beading.mp4`: valid silent 3.5-second alternatives. Included but not simultaneously downloaded/played; the hero already combines these crafts.
- `images/course_sewing_machine.webp` and `career_gold_embellishment.webp`: reserve garment-construction/finishing images; sewing and embroidery also appear in the hero film.
- `images/portfolio_draped_gown.webp`: suitable editorial draping detail, not seeded as a demo user's own work.
- `images/editorial_teal_gown.webp`, `editorial_pastel_gown.webp`, `editorial_couture_duo.webp`, `editorial_group_gowns.webp`, `editorial_black_couture.webp`, `editorial_burgundy_look.webp`: reference fashion imagery retained. Not assigned to named designers or users, and not allowed to overpower the requested craftsmanship direction.
- Three GIFs and contact sheet: inspection/previews only; deliberately excluded from website downloads and source deployment media.
- Supplied `preview.html` and `WEBSITE_IMPLEMENTATION_PROMPT.txt`: reference material, not embedded into the application.
- `asset_manifest.json`: original image source filenames, timestamps and dimensions retained.

## Processing and loading

WebP images retain source dimensions, 720×900 or 1000×1250; hero poster is 540×960. Hero motion remains 540×960, silent, H.264/yuv420p/faststart plus VP9/WebM. A 0.7-second crossfade and cyclic splice bridge the last and first scene for continuous looping. No image was AI enlarged or assigned a fabricated source credit.

CSS uses explicit media area aspect ratios; cards use lazy loading and reserved dimensions. Hero copy appears before media in the RTL DOM and on narrow screens. Video is not inserted for reduced-motion visitors; offscreen/background video pauses. If autoplay is blocked, the poster remains and the Play control allows a user gesture.

Logo files are unmodified. Photos are not used as substitutes for the SUDA logo.
