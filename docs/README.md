# Suda Project Documentation

This directory contains current implementation guidance alongside historical Sprint 1 design, QA, and visual-change records. **Do not interpret an older dated audit as a description of the current Sprint 2 application.**

## Current implementation references

- [Root README](../README.md) — Sprint 2 / Phase 4 features, installation, Firestore data paths, current limitations, and project links.
- [Navigation and user flows](navigation.md) — Current routes, Login behavior, protected pages, Opportunity data, Course Enrollment, Portfolio, and Admin navigation.
- [Security test instructions](../security-tests/README.md) — Firestore Rules Emulator tests and the explicit boundary between Emulator evidence and production deployment.
- [Current source code](../src/features/suda/demo-context.tsx) — Implementation of shared application state, Firebase operations, and persistence.

## Historical development records

These files document work or checks performed at the time stated. They have not been retroactively rewritten to describe Sprint 2.

- [Sprint 1 audit](sprint-1-audit-2026-10-15.md) — Dated Sprint 1 assessment and its original evidence boundaries.
- [Atelier delivery](atelier-delivery.md) — Earlier visual/frontend delivery and QA record.
- [Visual refresh](visual-refresh.md) — Subsequent visual refinements and design decisions.
- [Editorial asset map](atelier-asset-map.md) — Mapping of media assets to interface areas.
- [Atelier change inventory](atelier-change-inventory.md) — Change history relative to an earlier source baseline.

## Phase 4 report consistency

The course report is the source for academic requirements, User Stories, UML diagrams, and reported test outcomes. The repository source code is the source for implemented behavior. When reconciling the two:

- Login redirects to **Home (`/`)** after success; acceptance criteria and test-case descriptions should match.
- The **Mobile LCP** check and a **Firestore API request-duration** check use different measurements; do not use LCP as proof of API response time.
- Portfolio item **text** persists in Firestore; Portfolio **images** do not persist.
- Firestore Security Rules tests use the **Emulator**; this does not demonstrate that the rules are currently deployed in production.
- Verify the Jira destination and instructor access separately. An embedded hyperlink does not confirm access rights.

This index is documentation only. It does not change the website, deploy Firestore Security Rules, modify the report PDF, or certify production behavior.
