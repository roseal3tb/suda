# SUDA Atelier Edition — implementation, compliance and QA

15 October 2026. Inputs: `suda(2).zip`, `Suda_Editorial_Assets(1).zip`, `SW Project(7).pdf`, `Phase3 - Sprint 1 - Tagged(2).pdf` and the supplied transformation brief. The uploaded source matches repository baseline `a59fe7c8ab2aa8950a764d625377455d7d27aedf`; prior verified frontend repairs are retained.

## Delivered result

This is a runnable update of the existing React/TypeScript/TanStack project, not a replacement stack or a static mockup. The homepage has Arabic content on the right and a silent five-scene craft film on the left. On narrow screens, content precedes the film. A drawn thread reveals the original logo before two textured surfaces open apart. Local curated imagery replaces external stock in fictional opportunities and home/auth editorial visuals.

All ten existing page families and their dialog workflows remain. There is no database integration, real account creation, password storage or secure Admin authorization. The exact supplied logo pixels are unchanged. Tests and build apply to the delivered source; no push or Vercel deployment is claimed.

**Review classification: Ready with Minor Issues for frontend code/function review, with rendered-browser/device visual sign-off still pending.** No known build/type/test blocker remains. This classification is not a claim that every browser, viewport, crop, animation frame or academic submission requirement has been verified.

## Initial analysis and decisions

- Official Sprint 1 requires all pages without database connection. The roadmap graphic on report page 7 assigns access, browsing, search/filter, details, profile addition and portfolio addition to Sprint 1. Later features retain frontend demonstration pages; database-backed operation remains deferred.
- Existing public imagery repeated a small external stock set. Supplied sewing, pattern cutting, draping and beadwork footage is directly relevant and now drives the visual language.
- Old hero was a large image/background composition. It is replaced by an explicit RTL split composition with an independently framed film.
- Old intro exited with an opacity fade. It is replaced by thread drawing, logo clipping and two-panel separation, without waiting on media.
- The original source accepted comma-only skill/interest strings, could hide the Learning empty state for stale enrollments, and contained stale directory assertions and strict TypeScript problems. These confirmed repairs remain in the delivered code.
- Report acceptance criteria describe real duplicate-account rejection, credential verification and role security, while Chapter 4 explicitly identifies the current local demo. These are final-system requirements, not completed Sprint 1 authentication. The UI continues to disclose this distinction rather than simulating secure accounts.

## Asset integration

See [complete asset mapping](atelier-asset-map.md). Main placements:

| Area | Media |
|---|---|
| Home film | Five craft scenes in WebM/MP4 montage; static poster |
| Courses | Pattern cutting; fabric draping |
| Competitions | Embroidered and pink couture details |
| Internships | White beadwork; pink embroidery |
| Careers | Studio sewing; pattern making |
| Profile/portfolio home preview | Hands draping fabric |
| Login/register | Pattern cutting |

Hero motion is 540×960, approximately 11.96 seconds, **0.78 MB WebM / 1.18 MB MP4**, with no audio streams. The supplied montage was cyclically aligned with a 0.7-second seam crossfade. No claim of upscaling or new source detail is made. GIF previews are not shipped as web animation. Reserve images and three alternative loops are classified in the asset map; they are not all downloaded on page load. User portfolios are not prefilled with other designers' photographs.

## Sprint 1 compliance matrix

Pass here means the stated verification method succeeded; DOM/SSR evidence is distinguished from actual rendered-device/browser evidence.

| Requirement | Page/component | Status and verification | Remaining limitation |
|---|---|---|---|
| All pages; no database connection | Existing routes, DemoProvider | Pass: source review; all route families return HTTP 200 in running Vite SSR | Live deployment unchanged |
| Registration fields/validation | AuthPage `/register` | Pass in DOM: name/email/password/confirmation errors; valid local session; success feedback | No real account or duplicate-email rejection |
| Login | AuthPage `/login` | Pass in DOM: mock User/Admin access and storage failure path; password visibility | Real credential verification excluded |
| Logout | Shell | Pass in DOM: clears session, requests login navigation, member gate returns | Not a security guarantee |
| Four opportunity categories | `/opportunities` | Pass in DOM: each category yields two seeded results | Data fictional |
| Keyword and combined filtering | `/opportunities` | Pass in DOM: keyword/category/mode/location combination; empty results; clear/reset restores eight | Full URL/history behavior not browser tested |
| Opportunity details | `/opportunities/$id` | Pass: eight detail URLs return 200/RTL; course flow exercised in DOM | Valid real external-link click path not exercised |
| Profile addition | `/profile` | Pass in DOM: required parsed lists, save, rendered data after provider remount | Persistence limited to same browser |
| Portfolio addition | `/portfolio` | Pass in DOM: required errors, new item, persistence, edit | Valid image decode/compression not tested in a real browser |
| Later-sprint frontend pages | `/learning`, `/admin` and editing dialogs | Pass in DOM: enrollment, progress, achievement, admin add/edit/delete/cancel; SSR route availability | No database-backed workflows |
| Arabic RTL | Root, shared UI | Pass for SSR: `lang=ar`, `dir=rtl` and Arabic labels; forms queried by Arabic names | Physical device/screen-reader review pending |
| Required external/Zoom availability states | Details/Learning | Pass in DOM for missing-link state; pure URL validators tested | No invented links; no live Zoom session |
| Mobile/tablet layouts | Central stylesheet | Implemented; CSS reviewed for 370/600/700/760/980/1150px transitions | Rendered viewport tests Not Tested |
| Hero video and fallback | AtelierFilm | Pass: file decode, codecs, source paths; DOM tests for muted/inline playback controls, reduced motion and media-error fallback | Actual autoplay/crops/performance on Safari/mobile unverified |
| Thread intro | Intro | Pass in DOM: session-once behavior, reduced-motion omission, Escape dismissal; code uses thread/logo clipping and panel transforms | Rendered animation timing/visual quality unverified |
| Accessibility basics | Shared UI/Shell/media | Labels, alerts, status messages, pause control; menu keyboard focus and Escape verified in DOM | Full contrast, screen reader and keyboard journey audit pending |
| README/AUTHORS/project files | Root files | Pass: present; setup and limitations documented; npm lockfile supplied | Current revision not pushed |
| Architecture/classes/data/components design | Existing report Chapter 4 | Alignment reviewed: same entities, routes, context/storage boundary; planned Firebase remains planned | No certification of every diagram/academic criterion |
| Sitemap/interface design | Existing report 4.5 | Route map unchanged; ready-made mock access is an added path in existing login | Text update recommended below |
| Jira | Report page 57 annotation | PDF contains an actual Jira hyperlink (verified from PDF annotation) | Destination usability and instructor membership not verified |
| Performance targets | Report backlog | Not Tested | No 90th-percentile/real-user load claim; no API response target measured |

## Pages checklist

| Route family | Implementation | Executed evidence |
|---|---|---|
| `/` | Split hero, film, four category links/cards, journey, previews | HTTP 200 with Arabic RTL |
| `/opportunities` | Search, category/mode/level/location filters, reset | HTTP 200; DOM search/filter/reset journey |
| `/opportunities/{id}` | Eight seeded details across four categories | Eight HTTP 200 responses; enrollment DOM journey |
| `/login` | Demo forms, visibility and sample User/Admin access | HTTP 200; DOM access/error flows |
| `/register` | Validated local session form | HTTP 200; DOM validation/success |
| `/profile` | Create/edit information dialog and profile rendering | HTTP 200; save/remount DOM journey |
| `/portfolio` | Add/view/edit/delete and optional upload | HTTP 200; add/edit/persistence DOM journey |
| `/learning` | Enrollment, manual progress and achievements | HTTP 200; DOM update/save journey |
| `/admin` | CRUD forms, desktop table/compact cards | HTTP 200; DOM create/edit/delete/cancel journey |
| `/inspiration` | Eleven sourced text profiles, same-page details | HTTP 200; directory rules |
| Missing page | Arabic error state | HTTP 404 for `/missing-page` |

Dialogs are intentionally not separate routes. Logout remains a header/menu action.

## QA evidence and results

`npm run verify` completed successfully with the final source:

- **TypeScript:** zero errors.
- **Vitest:** **28 tests passed, six files**.
- **ESLint:** zero errors; nine existing Fast Refresh mixed-export warnings. Source formatting was normalized to the repository's configured formatter.
- **Production build:** client, SSR and Nitro output completed.
- **Running-server HTTP check:** 17 valid URLs returned 200; one unknown URL returned 404; every response contained Arabic/RTL markup and no unexpected error boundary message.
- **Media:** all five video files decoded; no audio streams. Image manifest paths exist. The original logo matches the uploaded source hash.
- **Contrast calculations:** primary plum on linen 7.43:1; normal muted hero text on linen 5.38:1; white on primary plum 8:1. The large accent headline color is 4.49:1, above the large-text minimum. These are token calculations, not a full rendered contrast audit.
- `git diff --check` passed.

Evidence files: [verification log](qa/verification-log.txt), [HTTP route results](qa/ssr-route-results.json), [media inventory](qa/media-results.json).

The user-journey tests use the real DemoProvider and browser localStorage in jsdom, actual form/dialog components, and a mocked router/animation wrapper. Navigation calls are asserted; this is not a real browser end-to-end test. Video play/pause APIs are mocked to test fallback/control logic, not actual codec playback.

The remote browser could not reach sandbox `localhost`/`127.0.0.1`; no rendered screenshot or mobile/tablet pass is claimed for this revision. The previous production-site audit does not verify the new local design. The local server's responses were instead exercised inside the same execution environment.

## Confirmed issues and resolutions

| Issue/severity | Reproduction and original actual behavior | Expected / resolution | Verification |
|---|---|---|---|
| Profile validation / Medium | Enter only separators in required skills/interests; empty arrays were saved | Validate after splitting and trimming; require at least one real item | Focused regression + profile journey |
| Stale course view / Medium | Remove a course via another demo account; retained enrollment suppressed empty guidance | Derive visible course enrollments before choosing list/empty state | Removed/non-course regression |
| Old designer assertion / Low | Test expected eight entries; directory contains eleven | Update count/uniqueness assertions | Passing directory tests |
| Strict type errors / Medium | Strict compiler rejected optional fields/query access and fixtures | Omit absent fields; optional query output; narrow fixtures | `npm run typecheck` |
| Invalid hover selector / Low | CSS optimizer warned about incorrectly escaped utility selector | Correct selector escaping | Successful build without that warning |
| Generic imagery / Visual | Repeated external stock did not match specific opportunity categories | Local craft imagery mapped to technique/category | Asset inventory and source review |
| Basic fade intro / Visual | Old overlay exited via opacity fade | Thread draw/logo wipe plus two fabric-panel transforms | DOM motion safeguards; rendered timing pending |
| Keyboard compact menu / Medium | Opening menu did not move focus into navigation | Focus first link; Escape returns to toggle | DOM keyboard regression |
| Motion/slow playback fallback / Medium | Film needs controlled loading and user pause | Static first paint, reduced-motion omission, play rejection fallback and pause control | DOM media tests + decode checks |

## Code change summary

| File/group | Purpose |
|---|---|
| `src/components/suda/atelier-film.tsx` | New self-contained silent hero film with lifecycle/fallback controls |
| `src/components/suda/intro.tsx` | New thread/logo wipe and fabric-panel intro |
| `src/routes/index.tsx` | RTL split hero; four featured opportunity categories; honest directory count |
| `src/styles.css` | Editorial layouts, media framing, responsive rules, motion, controls and focus; obsolete hero/intro selectors removed |
| `src/features/suda/mock-data.ts` | User media and category mapping; category-specific illustrations |
| `src/features/suda/demo-context.tsx` | Replace legacy stock URLs in stored seeded records while preserving edits |
| `src/features/suda/auth-page.tsx` | Password visibility, validated demo access, clearly labeled sample sessions and feedback |
| `src/components/suda/shell.tsx` | Accurate media notice; compact-menu keyboard focus |
| `src/components/suda/shared.tsx` | Relevant image alternative text and media dimensions |
| `src/components/suda/reveal.tsx` | No entrance animation for reduced-motion visitors |
| `src/routes/__root.tsx` | No-JavaScript disclosure/visible fallback |
| `src/routes/profile.tsx`, `learning.tsx` | Required-list validation and stale-enrollment view repair |
| `src/routes/opportunities.index.tsx` | Strict optional query handling and pressed category semantics |
| `src/routes/admin.tsx` | Typed optional links and image defaults by category |
| `src/routes/portfolio.tsx`, `opportunities.$id.tsx` | Optional prop safety / actual image dimensions |
| `src/test/suda-audit.test.tsx`, `suda-flows.test.tsx`, `suda-motion.test.tsx` | Focused regression, real-provider journeys and motion safeguards |
| `package.json`, `package-lock.json`, `.gitignore` | Repeatable install and verification commands; exclude generated/secrets |
| `README.md`, `docs/navigation.md`, asset/delivery docs | Accurate run instructions, traceability and limits |
| Other existing TS/TSX files | Formatter-only normalization from configured ESLint/Prettier rules |

A complete changed-path list is in [change inventory](atelier-change-inventory.md). No new runtime dependency was added. No database service was connected.

## Documentation alignment updates

1. **Section 4.5.2:** describe the new split editorial hero, local craft film, pause/static fallback and session-once thread/panel intro. Add the two ready-made mock session buttons. Do not describe them as real accounts.
2. **Section 4.5.1/sitemap:** existing page routes and dialogs are unchanged; no new page/entity is needed. Optionally annotate the mock-session shortcut within Login.
3. **Section 4.1:** keep React/TypeScript/TanStack + DemoProvider/localStorage. Media files are static assets, not a new service or database.
4. **Sections 4.2/4.3:** no domain entity or database schema change is required for this visual refinement. Preserve planned Firebase security/data boundaries.
5. **Testing paragraph on page 57:** replace blanket “testing pending” with the executed type/build/28-test/HTTP results above, while explicitly keeping rendered browser/device, actual image encoding and production performance checks pending.
6. Refresh the report contents, table and figure indexes: the current indexes still omit Chapter 4 entries and show old reference page numbers. The PDF itself was not edited.
7. The Jira hyperlink exists; instructor access still needs verification. No invitation or permission change was performed.
8. Add image/video provenance using the supplied source manifest and the course's referencing expectations. Do not invent photographer credits or attribute imagery to fictional providers.

## Remaining limitations

**Before final visual approval:** run the delivered app in a browser at representative phone, tablet and desktop widths; inspect crops, type wrapping, video autoplay and intro transitions; complete screen-reader/keyboard and actual upload checks. These are outstanding verification tasks, not evidence of a broken layout.

**Non-blocking source warnings:** nine Fast Refresh export warnings. No lint error is suppressed to claim a pass.

**Outside Sprint 1:** real authentication/duplicate-account enforcement, server-side roles, database persistence, cross-device sync and hosted image storage. Existing later-sprint interactions are frontend demonstrations only. No official opportunity/Zoom URL is invented.

**Publication:** this deliverable is source code for review. The current Vercel website and remote GitHub branch are not updated by the archive itself.
