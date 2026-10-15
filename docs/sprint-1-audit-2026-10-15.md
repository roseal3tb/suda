# SUDA Sprint 1 audit — 15 October 2026

## Outcome and evidence boundaries

**Verdict: Not Ready for Sprint 1 Review sign-off yet.** This is a verification verdict, not evidence that the website is generally broken. The main pages exist, public browsing works, and focused code repairs have been made. Successful mock account flows, signed-in CRUD, mobile/tablet layouts, diagram correctness, and instructor Jira access still require verification before an unconditional readiness claim.

Reviewed the official `Phase3 - Sprint 1 - Tagged(1).pdf` and extracted text from `SW Project(6).pdf`, plus the GitHub source at baseline commit `a59fe7c8ab2aa8950a764d625377455d7d27aedf`. The deployed website was exercised in a desktop browser. Source repairs are **local working-tree changes**, not deployed changes. No push, production deployment, database, real accounts, or backend integration was performed.

The official instruction is “Implement all the pages except for the database connection.” Later-sprint pages therefore belong in the frontend inventory. Firebase design in Chapter 4 is explicitly planned and is not evidence of implemented database integration. Document text and image metadata were available, but embedded diagram pixels and the roadmap graphic were not visually verified. Their correctness is not certified.

## Initial gap analysis, presented before edits

1. Profile fields containing only commas pass the original nonempty-string check and become empty arrays after splitting.
2. Deleting a course affects only the current demo account's enrollment cleanup. Another account can retain a stale enrollment; Learning previously rendered neither a course nor its empty-state guidance.
3. Designer directory tests and README still expected eight designers although the directory contains eleven.
4. The report contents/table/figure indexes omit Chapter 4 entries or retain old page numbers. Chapter 4 begins on page 41, after the appendices, while references correctly remain at the end. Review chapter ordering against the course template and refresh all indexes.
5. Jira is displayed as “Suda Workspace” in extracted report text. An actual PDF hyperlink may exist, but its destination and instructor access were not verified.

Subsequent validation found an invalid escaped hover CSS selector and strict TypeScript errors involving optional fields, search parameters, and test fixtures. These were repaired without changing the stack.

## Sprint 1 compliance matrix

Statuses describe verified scope only. Partial does not imply missing database work.

| Requirement | Status | Evidence | Action |
|---|---|---|---|
| Frontend without database | Pass | DemoProvider/browser storage; no Firebase/Supabase/database client integration found in inspected source | Keep final Firebase services planned |
| All frontend page families | Partial | Ten documented route families exist; all opened live, member/admin interiors inspected in source | Verify signed-in interiors in browser |
| Register | Partial | Arabic fields, confirmation and local simulation exist; empty submit displays Arabic name error | Test all invalid inputs and successful mock flow |
| Login | Partial | Empty submit displays Arabic email error; user/admin mock modes clearly disclosed | Verify successful mock login and failure branches |
| Logout | Not Tested | Handler clears demo session and navigates to login in source | Exercise logout and return to gated pages |
| Four opportunity categories | Pass | Eight live cards cover courses, competitions, internships and careers | None for inventory |
| Search | Pass | Unmatched `zzzaudit` yields zero results and Arabic empty state; `الباترون` with course/remote filters yields one correct record | Broaden edge-case coverage if needed |
| Combined filters and reset | Partial | Keyword/category/mode tested together; reset restores eight records | Exercise level/location combinations and category query navigation |
| Opportunity details | Pass | All eight live detail URLs opened, across four categories; description, requirements, category and available deadlines displayed | No invented application links |
| External application links | Partial | Fictional opportunities show disabled/unavailable-link state; HTTPS validation exists | Valid-link click path not tested |
| Professional Profile addition | Partial | Form and rendering exist; regression test rejects separator-only arrays and accepts valid lists | Browser-test save/reload using demo session |
| Add Portfolio Item | Partial | Title/description, optional image, error feedback and CRUD present in source | Browser-test upload, errors, save and reload |
| Learning and Admin pages | Partial | Routes/gates opened; complete frontend interfaces inspected in source | Exercise enrolled-course and admin workflows |
| Arabic RTL | Partial | Live document reports `lang=ar`, `dir=rtl`; inspected labels/messages Arabic | Check all modal states, keyboard order and responsive RTL |
| Responsive layout | Not Tested | CSS has mobile/tablet breakpoints, responsive navigation and modal constraints | Actual viewport/device tests required |
| Accessibility | Partial | Skip link, labels, live results, alerts, disabled-link feedback and Radix dialogs exist | Keyboard, focus, screen-reader and contrast audit pending |
| Assets and runtime | Partial | No broken images on opportunity listing at inspection; opened public pages rendered | Full asset/link sweep pending; extension log errors excluded from app defects |
| Performance targets | Not Tested | Production build succeeds; no representative timing measurement | Do not claim the report's two-second/90% target passed |
| 4.1 Architecture | Partial | Layer responsibilities, current demo and planned BaaS explicitly separated in report | Visually check architecture graphic |
| 4.2 Class diagram | Partial | Text identifies logical classes, fields, operations and relations | Visually verify graphic/multiplicities |
| 4.3 Data design | Partial | ER and Firestore hierarchy discussed; embedding/referencing and restricted meeting links explained | Visually verify ER/hierarchy; database connection remains excluded |
| 4.4 Components design | Partial | Three non-basic functions with activity-diagram references and pseudocode: search, enrollment, learning progress | Visually verify diagrams against pseudocode |
| 4.5 Interface design | Partial | Sitemap reference, route table, source and deployment links present | Verify sitemap image and refresh report indexes |
| GitHub README/AUTHORS | Pass | Both exist in cloned repository | README designer count corrected locally |
| Jira link/instructor access | Not Tested | Workspace label only verified in extracted text | Check PDF hyperlink destination and instructor membership |

## Pages checklist

| Page | Source | Live browser verification |
|---|---|---|
| `/` | Implemented | Home content/navigation inspected |
| `/opportunities` | Implemented | Eight cards, search, course filter, combined filter, empty/reset states |
| `/opportunities/{id}` | Implemented | All eight seed detail pages opened |
| `/login` | Implemented | Form, empty validation and register navigation |
| `/register` | Implemented | Form and empty validation |
| `/profile` | Implemented | Visitor gate only; actual form covered by regression test |
| `/portfolio` | Implemented | Visitor gate only |
| `/learning` | Implemented | Visitor gate only; stale enrollment case covered by regression test |
| `/admin` | Implemented | Visitor/admin-mode gate only |
| `/inspiration` | Implemented, supplementary | Eleven names render; expansion/source URLs not fully tested |

Logout is a header action, not a separate route. Profile/portfolio/admin creation and editing use dialogs, not additional standalone routes.

## Issue register and resolutions

| ID / severity | Page and reproduction | Expected versus original actual | Resolution and verification |
|---|---|---|---|
| P1 / Medium | Profile: enter only `، ,` in skills/interests, submit otherwise valid form | At least one real item required; original saves empty arrays | Validate parsed arrays; component regression checks rejection and valid save |
| L1 / Medium | Learning: account retains enrollment after another account removes/reclassifies its course | Useful empty guidance; original hides rows but also suppresses empty state | Derive active course enrollments before choosing list/empty view; regression covers removed/non-course references |
| T1 / Low | Run designer directory test | Current eleven unique entries accepted; old assertion expects eight | Update count and optional-source narrowing; test suite passes |
| D1 / Low | Read README directory descriptions | Match actual eleven entries; old text says eight | Update relevant descriptions |
| C1 / Low | Production build: escaped hover utility selector | Valid selector; optimizer warns invalid pseudo-class | Correct CSS escape; rebuilt without that warning |
| TS1 / Medium | Run strict TypeScript check | Zero errors; original optional-property/search/indexed-fixture errors | Correct search return shape, omit absent link/modal properties, narrow fixture/source values; strict check rerun |

P1 and L1 were identified from code and reproduced in focused component tests, not in the signed-in live browser. No deployed fix is claimed.

## UI/UX audit

The inspected desktop course detail preserves the existing linen/plum palette, logo, Arabic typography, shared header/footer, clear headings, requirement text and enrollment call to action. No redesign was necessary. Search counts, no-result guidance and unavailable external-link feedback are clear. Native names of designer brands do not constitute English-language pages.

Corrections preserve the existing design: meaningful profile validation, a useful Learning empty state, and a valid hover selector. Color-contrast ratios, mobile/tablet overflow, keyboard-only modal behavior and reduced-motion behavior were not measured/exercised and remain open checks. No accessibility certification is implied.

## Software engineering audit and changes made

The project separates route components, shared UI, fictional domain records/pure rules, browser storage and mutable React context. Per-demo-email storage supports demonstration isolation, not secure authorization. No password storage was found in the demo login path. Existing session role selection is deliberately labeled as mock behavior.

| Modified file | Change |
|---|---|
| `src/routes/profile.tsx` | Parse required lists before validation; reject empty parsed lists |
| `src/routes/learning.tsx` | Base course list/empty state on available enrolled courses |
| `src/routes/opportunities.index.tsx` | Optional typed search result and bracket access for unknown query input |
| `src/routes/admin.tsx` | Omit absent external/Zoom properties rather than assigning undefined |
| `src/routes/portfolio.tsx` | Omit absent optional modal description |
| `src/styles.css` | Correct escaped hover utility selector |
| `src/test/suda-extended.test.ts` | Eleven-entry directory assertions and optional-source safety |
| `src/test/suda-rules.test.ts` | Explicitly narrow known fixture indexes under strict checking |
| `src/test/suda-audit.test.tsx` | Two focused component regression cases |
| `README.md` | Correct directory count |

No existing feature was intentionally removed. Existing CRUD demonstrations are retained; no later-sprint database work was introduced.

## Testing and remaining work

Executed: production Vite build; Vitest (17 tests across four files); strict TypeScript check; live desktop navigation and public interactions listed above. Tests with mocked router/provider boundaries verify the changed component logic, not a complete authenticated end-to-end journey. The production website still contains the previous code until these local changes are applied and deployed.

**Review sign-off checks:** verify successful mock authentication/logout, profile and portfolio save/upload, learning updates, admin forms, responsive mobile/tablet layouts, full keyboard/focus/contrast behavior, all required diagram graphics, Jira instructor access, and report indexes. No broken public core journey was confirmed in the performed desktop tests.

**Future-sprint functionality, not Sprint 1 defects:** database connection, real password verification/duplicate-account enforcement, server authorization, cross-device records, Firebase file storage and trusted enrollment/meeting-link permissions. The current accept-any-demo-credentials behavior is visibly disclosed; it must not be described as implemented production authentication.

The local repairs improve review readiness, but the outstanding verification prevents an evidence-based “Ready” or “Ready with Minor Issues” sign-off for the complete submission today.
