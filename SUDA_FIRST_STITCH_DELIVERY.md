# SUDA — First Stitch intro and couture-pattern hero

## What changed

- Replaced the two-panel fabric-opening intro with a short animated-thread introduction: a thread draws in, the **existing original SUDA logo** appears unmodified, the tagline «رُؤى تُنسَج» is revealed, then the screen fades into the homepage.
- The intro has a visible **تخطّي المقدمة** button, is dismissible with Escape, runs only once per browser-tab session, and is suppressed when `prefers-reduced-motion` is enabled.
- Bumped the intro session key so visitors who saw the earlier version can see the updated intro once after this release.
- Fixed the homepage couture ornament: the previously added SVG was **behind the opaque homepage film**. It now occupies the left-hand hero column as actual inline SVG artwork (sewing hoop, needle, flowing thread, pattern drafting guides, French curve), matching SUDA's muted plum/rose palette. It is not a screenshot or bitmap.
- Existing opportunity, profile, portfolio, learning, admin, and demonstration-data logic is unchanged. The original logo assets and film files remain intact; the decorative film is simply not rendered in the homepage hero.

## Changed source files

- `src/routes/index.tsx`
- `src/components/suda/intro.tsx`
- `src/components/suda/hero-atelier-pattern.tsx` (new)
- `src/features/suda/storage.ts`
- `src/styles.css`
- `src/test/suda-motion.test.tsx`

## How to see it on the live site

**A ZIP downloaded from ChatGPT does not update a deployed Vercel website.** The updated source files must be copied into the actual GitHub-connected repository and committed to its production branch. In this project, the GitHub repository is `roseal3tb/suda` on branch `main`. If Vercel is still linked to that branch, a push normally triggers a new deployment.

1. Unzip this package and copy the six source files listed above into the local clone of your existing `suda` GitHub repository, retaining their paths.
2. Run checks locally where dependencies are installed:

   ```bash
   npm ci
   npm run typecheck
   npm run test
   npm run lint
   npm run build
   ```

3. Commit and push from the **existing repository clone** (the downloaded ZIP deliberately contains no `.git` directory):

   ```bash
   git add src/routes/index.tsx src/components/suda/intro.tsx src/components/suda/hero-atelier-pattern.tsx src/features/suda/storage.ts src/styles.css src/test/suda-motion.test.tsx
   git commit -m "Add SUDA first stitch intro and reveal couture hero pattern"
   git push origin main
   ```

4. In Vercel, check the project's *Deployments* view and confirm that the newest deployment is **Ready** and assigned to the production domain. Refresh the page; for CSS cache concerns use a hard refresh, then test in a new tab. The new intro version is once per session.

## What was verified here

- All changed TypeScript/TSX files passed a TypeScript syntax-transpilation check.
- Stylesheet passed PostCSS syntax parsing.
- Full typecheck, automated test suite, linting and production build were **not run** because the project's npm dependencies are not installed in this environment.
- Direct publishing was **not completed**. The connected Vercel project rejected access (403), and a GitHub write attempt was forbidden. Therefore the public website cannot be claimed to reflect these changes until the owner pushes/deploys the update.
