# Suda | سُدى — Requested visual refinements (16 October 2026)

This delivery is based on the user's latest complete source archive (`suda(2).zip`), latest `videos(2).zip`, latest `صور المصممات(1).zip`, and `angham.zip`.

## Home page
1. The original left-side hero VIDEO layout has been preserved. The scissors-cutting shot has been removed from the active montage. The new 24.7-second silent montage integrates selected segments of all four supplied videos with surviving original fashion footage and original draping, sewing, and beading clips. It uses short dissolves. Black title/end cards from the supplied reels are excluded.
2. Couture sewing/pattern vector decoration sits behind the RIGHT-side hero text only, at low opacity, with the original film on the LEFT.
3. The original logo file is unchanged and is larger than the reduced `رُؤى تُنسَج` line. The line `من أول خيط، إلى فرصتك القادمة` is removed.
4. The First Stitch intro replaces fabric-panel opening with a vector thread, original SUDA artwork, tagline and subtle fade; it remains skippable and respects reduced motion. Its session key was versioned to show the new version once.
5. Four photos supplied in `angham.zip` replace the three existing editorial images in the `مهاراتك وأعمالك` gallery.
6. Four editorial quotation cards appear above `إلهام سعودي`, preserving the user-provided quotations and source labels. The supplied Tima Abid quote has no separately verified published source and is labeled accordingly.
7. The text `تفاصيل تُلهم، وتصاميم تُحكى` has been corrected.

## Saudi Inspiration
8. Eight named photos from `صور المصممات(1).zip` are mapped to their corresponding designers: Arwa, Honayda, Tima, Reem, Nora Al Shaikh, Noura Sulaiman, Kawthar, and Hala.
9. The three designers not represented by images in that archive (Waad Aloqaili, Eman AlAjlan and Rahaf Aziz) receive an explicit neutral fallback rather than someone else's photo.
10. `هالة الغرباوي` is corrected to `هلا الغرباوي`.
11. The unused dotted prompt box `اختاري إحدى المصممات أعلاه ...` no longer renders when no designer is selected.
12. Page explanatory text and attribution disclaimer were updated for the presence of user-supplied photographs. The team should check public reuse rights for all supplied photographic/video assets prior to public distribution.

## Copy / scope
13. Terminal full stops were removed from end-of-copy across Suda's user-facing Arabic interface. Internal sentence punctuation, URLs, decimals and technical values are preserved.
14. Current Sprint 1 mock data and DemoProvider flows are unchanged. No Firebase or live authentication was introduced.

## Validation and publishing
- TypeScript / JSX transpilation syntax check: PASS (using global TypeScript compiler).
- CSS parse error check: PASS (tinycss2).
- MP4 and WebM both decode; MP4 duration: approximately 24.7 s. Black-frame detection identified no black sections under the chosen threshold.
- Automated browser tests/build were NOT run: `npm ci --offline` failed because dependencies are not cached in this environment.
- This local ZIP has NOT been pushed or deployed. Prior GitHub write attempts and Vercel access returned authorization errors. No production site changes are claimed.

### Publish through existing GitHub / Vercel setup
1. Back up the current repository/branch.
2. Use the complete ZIP as the project source, or copy all files from the `changed-files` ZIP over matching paths in the existing project. Preserve the folder structure, including `public/editorial/film/` and `public/editorial/people/`.
3. In the project root, run `npm ci`, `npm run typecheck`, `npm run test`, and `npm run build`. Resolve any environmental issues before publishing.
4. Push the tested changes to the GitHub branch linked to Vercel and confirm the new Vercel deployment status.
5. Verify at mobile and desktop widths, review video playback in Safari, and reload with a hard refresh if assets are cached.
