# Suda navigation — Sprint 1 frontend

The ten existing page families remain unchanged. The editorial transformation adds components, not routes.

- Home `/` → category links/searchable Opportunities `/opportunities` → Details `/opportunities/{id}`.
- Home and shared navigation → Profile `/profile`, Portfolio `/portfolio`, Learning `/learning`.
- Visitors to these personal pages see the demo login gate → `/login` ↔ `/register`.
- Successful demo access → explicit “الانتقال إلى…” action → Profile or Admin, matching current UI.
- Login includes clearly labeled ready-to-use User/Admin mock sessions.
- Admin `/admin` → opportunity create/edit dialogs and delete confirmation; public opportunity list reflects local changes.
- Course Details → local enrollment → Learning → manual progress/achievement → optional valid Zoom meeting URL.
- Non-course Details → optional verified external application URL, or unavailable-link state.
- Inspiration `/inspiration` → designer details expand in the same page.
- Logout (header/menu action) → session cleared → `/login`; personal/admin gates apply again.
- Reset (footer action) → confirmation dialog → local demo content reset, session retained.

The original report's sitemap and logical data design do not need new entities or routes. Add the ready-made demo access shortcut and revised homepage media/intro behavior to Interface Implementation and Interaction.
