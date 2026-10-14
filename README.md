# سُدى | SUDA — Sprint 1

An Arabic-first, RTL, premium Saudi fashion editorial and opportunities demo built on the **existing** React 19 + TypeScript + TanStack Start/Router + Tailwind CSS v4 codebase.

## Purpose and boundaries

SUDA lets visitors browse **four opportunity categories** (free courses, competitions, internships, careers), combine Arabic search and filters, and view details. A demo designer can maintain a professional profile and fashion portfolio, enroll in free courses, and update progress and achievements manually. A demo administrator can add, edit and delete opportunities. A separate text-only **إلهام سعودي** editorial page features eight sourced designer profiles with in-page expansion.

This is **Sprint 1 frontend demonstration only**: no database, production authentication, backend, email, file hosting, video hosting, job application processing, or secure roles. All sample opportunities and organizers are fictional. A correctly formatted demo email and a six-character *fictional* password activate a mock session; passwords are never saved. Do not enter actual credentials or personal data.

## Setup

Install Node.js 20+ and dependencies, then run:

```bash
npm install
npm run dev
npm run test
npm run build
```

The original Lovable project uses `bun.lock`, so Bun may also be used (`bun install`, `bun run dev`, `bun run test`, `bun run build`). Do not upload `node_modules` or secrets.

## Routes

| Route | Content |
|---|---|
| `/` | Editorial homepage, category navigation, featured opportunities, portfolio preview, Saudi inspiration preview |
| `/opportunities` | Four types, search and combined filters |
| `/opportunities/$id` | Details, free-course enrollment or external organizer link |
| `/login`, `/register` | Mock frontend authentication |
| `/profile` | Per-demo-email professional profile |
| `/portfolio` | Per-demo-email portfolio CRUD and locally compressed photos |
| `/learning` | Enrollments, manually updated progress and achievements; verified Zoom links only |
| `/admin` | Four-category opportunity CRUD, desktop table and mobile cards |
| `/inspiration` | Eight sourced Saudi female designer profiles, text-only in-page expansion |

## Local demo storage

`localStorage` is used with namespaced `suda:v2:*` keys for opportunities and **per-demo-email** profile, portfolio and enrollments. Session is also local and is not real authentication. Portfolio photos are compressed in the browser and saved as data URLs; browser storage quota limits apply, and failed saves show errors. The Reset Demo Data control confirms before clearing local demo content. The cinematic intro uses `sessionStorage` and respects reduced motion. No real passwords are stored.

Note: This revision deliberately does **not** migrate the earlier `suda:v1` shared user data, because those keys mixed multiple demo accounts. Previous v1 data remains in browser storage but is not read by v2.

## Branding

Official palette: Linen `#FAF6F1`, Dusty Rose `#E8D7E1`, Lavender Taupe `#C5B1BC`, Mauve-Gray `#A195A2`, Moody Plum `#564E58`. Only official brand tagline: **رُؤى تُنسَج**.

`public/suda-original-artwork.png` is the original user-supplied logo artwork, preserved without regeneration. `public/suda-original-wordmark.png` is a **pixel crop of that exact artwork** for the header and hero; `favicon.png` is also cropped from the original. These assets can be replaced if the owner supplies a higher-resolution transparent logo later.

## Photography and source credits

General atelier/craft photos are linked from **Unsplash**, with credited authors and original photo pages in `src/features/suda/mock-data.ts` and visible footer credits. These are general stock photos, **not** representations of named Saudi designers. Please check the linked source and the current [Unsplash License](https://unsplash.com/license) before public deployment; no rights for designer imagery are assumed.

The eight Saudi designer profiles in `src/features/suda/designers.ts` cite official designer/brand pages or published reporting (Honayda, Arwa, Reem, Tima, Nora, Noura, Kawthar, Hala). They intentionally use **no designer photographs and no unsourced specific collection claims** until the project team verifies both content and image reuse permissions. This editorial addition is subject to project team approval.

## Project organization

- `src/features/suda/mock-data.ts`: opportunity types, seed data, filtering, Zoom validation and stock-photo credits.
- `src/features/suda/designers.ts`: sourced designer directory (text only).
- `src/features/suda/demo-context.tsx`: mock sessions, per-user storage and CRUD.
- `src/features/suda/storage.ts`: namespaced storage utilities.
- `src/features/suda/image-utils.ts`: local image resize/compression for portfolio.
- `src/components/suda`: shared UI, original brand intro, navigation and footer.
- `src/routes`: all frontend pages.
- `src/styles.css`: approved brand tokens, editorial layout and responsive rules.
- `src/test`: core and extended logic tests.
- `docs/navigation.md`: navigation and flow overview.

## Known limitations / next steps

- No official Zoom or application URLs are seeded: admin may add a verified HTTPS link, otherwise UI shows it as unavailable.
- Portfolio images are local only, may exceed browser storage after several works, and do not sync across devices.
- Designer photography and collection-level gallery await permission and team approval.
- Frontend admin role is **not** secure authorization.
- Run build, automated tests, keyboard checks and mobile/desktop visual QA in an environment with dependencies installed before deployment.
- Phase 3 written diagrams, Jira and GitHub requirements remain separate academic deliverables.


## Approved brand and footer refinement (14 October 2026)

- The owner's transparent PNG (`public/suda-logo-original-transparent.png`) is retained unaltered. A transparent trim (`public/suda-logo-transparent.png`) is used for the header, home hero, intro, and footer; favicon is made from the same pixels.
- Removed the `SUDA / 01` overlay, stock-image caption, and old disconnected home thread motif.
- Added a single decorative scroll-drawn SVG thread between the portfolio and Saudi Inspiration sections, plus understated stitched rules below two headings. Reduced-motion visitors see a static completed thread.
- Replaced the footer's duplicated navigation and discovery CTA with centered logo/tagline, copyright, demo disclosure, accessible image-source details, and demo-reset control.
- Included Waad Al-Oqaili, Iman Al-Ajlan, and Rahaf Aziz with short biographies and links to their official brand websites (verified 14 October 2026). No designer-specific photographs are used.
- This code is a separate local working copy, not an update to the Lovable live project.
