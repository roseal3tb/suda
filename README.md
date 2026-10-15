# سُدى | SUDA — Sprint 1, Atelier Edition

Arabic RTL fashion opportunity platform built with the existing **React 19, TypeScript, TanStack Start/Router, Tailwind CSS and Framer Motion** architecture. No database or real authentication is connected.

## Run locally

Use Node.js **22.12+ or 24** (verified with 24.19.0).

```bash
npm ci
npm run dev
```

Open the address printed by Vite. In environments that cannot enumerate network interfaces, use:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

```bash
npm run typecheck
npm run test
npm run lint
npm run build
# All four checks in order:
npm run verify
```

The npm lockfile is included. The original `bun.lock` is preserved for the existing project workflow. Never upload dependencies, build output, secrets or local environment files.

## Sprint 1 boundaries

The official instructions require **all pages except the database connection**. Registration and login create a local demonstration session; they do not create or verify real accounts. Any valid demo email and fictional password of at least six characters work. Passwords are never stored. Duplicate-email rejection and password verification are planned real-authentication behavior, not simulated security claims.

The login page also offers two clearly labeled ready-to-use mock sessions: **تجربة حساب مصممة** and **تجربة حساب مشرفة**. No credentials are needed for these shortcuts. Logout clears the local session and returns to login. Member and Admin gates are interface demonstrations, not security boundaries.

Use fictional data. Profiles, portfolio items, course progress and achievements are stored per demo email in browser localStorage. Images are compressed locally and remain in that browser. Data does not synchronize between devices. Reset Demo Data confirms before clearing demo content, retains the current session, and does not remove unrelated browser data.

## Routes

| Route | Frontend implementation |
|---|---|
| `/` | RTL split hero: Arabic copy right, silent fashion film left; journey, four category links, four featured opportunities and professional/editorial previews |
| `/opportunities` | Four categories, Arabic keyword search, combined mode/level/location filters, reset and empty states |
| `/opportunities/$id` | Opportunity information; mock course enrollment, optional verified Zoom URL or external application URL |
| `/login`, `/register` | Validated demo forms, password visibility, User/Admin mock mode, ready-made mock session shortcuts |
| `/profile` | Add/edit professional information and parsed skills/interests |
| `/portfolio` | Add/view/edit/delete user-created fashion work and optional local images |
| `/learning` | Enrolled courses, manual progress and achievements; deleted-course empty-state handling |
| `/admin` | Add/edit/delete opportunities across four categories; table and compact card layouts |
| `/inspiration` | Eleven designer profiles, text-only expansion and source links |

No new route or database entity was introduced. Dialogs retain the existing create/edit/delete flows. The supplementary Inspiration page is retained.

## Visual identity and media

The supplied SUDA logo is retained **byte-for-byte**. Palette: Linen `#FAF6F1`, Dusty Rose `#E8D7E1`, Lavender Taupe `#C5B1BC`, Mauve Gray `#A195A2`, Moody Plum `#564E58`. IBM Plex Sans Arabic and Tajawal remain the fonts, with local fallbacks if web fonts fail.

`public/editorial/` contains the user's supplied WebP imagery and silent clips. No external stock photography is used in seed opportunities or the new home/auth visuals. Previously stored Unsplash seed images are replaced at load time without overwriting user-created data or edits.

The hero film is an optimized five-scene montage, with **WebM and H.264 MP4** alternatives, a high-priority poster, a playback toggle, offscreen/background pausing and a static reduced-motion/error fallback. Its loop seam was crossfaded and cyclically aligned; it retains the source's 540×960 resolution. No genuine high-resolution detail is claimed.

The thread intro reveals the original logo through a drawn thread and clip wipe, then separates two fabric-textured panels. It lasts at most 2.5 seconds, has Skip/Escape controls, runs once per session, never waits for video, and is omitted for reduced motion.

Uploaded images are **editorial illustrations**, not real images of the fictional opportunity organizers or work created by demo users. The image provenance notice in the footer reflects this. Portfolio entries remain user-created; curated fashion photographs are not inserted as the user's own work.

See [asset mapping](docs/atelier-asset-map.md), [QA and compliance](docs/atelier-delivery.md), and [navigation](docs/navigation.md).

## Source organization

- `src/routes/`: existing page families.
- `src/components/suda/atelier-film.tsx`: guarded hero media playback.
- `src/components/suda/intro.tsx`: skippable thread and fabric reveal.
- `src/components/suda/`: shared branded UI, navigation and scroll decoration.
- `src/features/suda/mock-data.ts`: local media map, fictional opportunities, domain types and pure rules.
- `src/features/suda/demo-context.tsx`: local session and frontend CRUD.
- `src/features/suda/storage.ts`: versioned browser storage helpers.
- `src/features/suda/auth-page.tsx`: demo access, forms and validation.
- `src/styles.css`: brand roles, layouts, responsive rules and motion.
- `src/test/`: domain, component and real-provider/localStorage journey tests.

## Verification limits

See the delivery report for executed results. DOM tests are not a substitute for a rendered browser/device test. The remote browser could not access the local development server; physical device QA, visual crop/timing review in the running browser, and production performance testing remain unverified. Nine existing Fast Refresh export warnings are non-blocking; lint must report zero errors. No claim is made that Jira instructor access or deployment of this revision has been completed.
