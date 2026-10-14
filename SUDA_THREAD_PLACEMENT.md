# SUDA — Thread motif placement

The long decorative thread is intentionally restricted to the rich discovery pages:
- **Home (`/`)**: the existing editorial `ThreadJourney` is retained.
- **Opportunities (`/opportunities` and opportunity detail routes)**: the subtle `PageThread` is retained.
- **Profile (`/profile`), portfolio (`/portfolio`), login/register, learning, inspiration and admin**: the long page-spanning thread is disabled to prevent competing with forms, cards and personal content.

At mobile/tablet widths (up to 980px), the thread is visible at approximately 9–10% overall opacity behind content, does not receive pointer events, and does not cover interactive controls. It respects reduced-motion preferences. The original logo/needle-thread introduction is unaffected.

This is a targeted code-only change; it has not been deployed to Vercel.
