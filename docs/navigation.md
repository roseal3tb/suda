# Suda Navigation and User Flows — Sprint 2 (Phase 4)

This document describes the current route and interaction behavior of the Suda application. It replaces the earlier Sprint 1 frontend-only navigation description. The academic Phase 4 report describes the same main interface functions in Section 4.5; this document clarifies the implementation-level navigation.

## Routes and access

| Route | Function | Access |
| --- | --- | --- |
| `/` | Home page and Opportunity category entry points | Public |
| `/opportunities` | Browse, search, and filter Opportunities | Public |
| `/opportunities/$id` | Opportunity Details, enrollment actions, or external links | Public page; enrollment requires login |
| `/login` | Sign in with Firebase Authentication | Guest |
| `/register` | Register with Firebase Authentication | Guest |
| `/profile` | View and edit Professional Profile | Authenticated user |
| `/portfolio` | Add, edit, and delete Portfolio items | Authenticated user |
| `/learning` | Course Enrollments, Learning Progress, and achievements | Authenticated user |
| `/admin` | Create, edit, and delete Opportunities | Authorized Admin |
| `/inspiration` | Saudi Inspiration content and designer information | Public |

## Main navigation and workflows

### Guest browsing and Authentication

1. A visitor opens Home, browses the four Opportunity categories, filters the listing, and opens individual Opportunity Details.
2. Personal pages and the Admin page use access gates. An unauthenticated visitor is directed to the Login option rather than receiving a mock user or Admin session.
3. Login and Registration use Firebase Authentication. After a successful login or registration, the application navigates to **Home (`/`)** with an authenticated session.
4. Logging out signs out of Firebase Authentication and navigates to `/login`. Protected pages require a valid session again.

### Opportunities and Course Enrollment

1. The public Opportunities listing reads documents from Cloud Firestore's `opportunities` collection. Search and filters operate on the loaded records.
2. A Course details page offers enrollment to a signed-in user. The enrollment record is saved under `users/{uid}/enrollments/{courseId}`, with duplicate-enrollment prevention.
3. The enrolled user can open `/learning`, manually update progress, and add achievements. These records are stored in Cloud Firestore.
4. Optional Course Zoom links are stored separately under `courseMeetingLinks/{courseId}`; the application requests them for authenticated eligible users. A link is shown only when available and valid. Access enforcement in the deployed application depends on the Firestore Security Rules active in its Firebase project.
5. Competitions, Internships, and Career Opportunities can provide an external application URL. Suda does not submit the external application.

### Professional Profile and Portfolio

- `/profile` saves Professional Profile information under the authenticated user's Firestore document.
- `/portfolio` manages items under `users/{uid}/works/{workId}`. Titles and descriptions persist; selected Portfolio images are **temporary** and are not uploaded for persistent storage.
- Browser `localStorage` utilities are retained for **legacy-data migration and import**, not as the current primary storage for Opportunities, Profile, Portfolio, or Learning Progress.

### Admin Opportunity Management

- `/admin` is available only to an authenticated user whose Firebase token has the trusted custom claim `admin=true`.
- Authorized Admin operations add, edit, or delete Firestore Opportunity documents. Optional Course Zoom links are handled separately from publicly readable Opportunity records.
- The application includes an Admin-authorized import path for legacy or sample Opportunity records; imports are not an alternative public demo Admin session.
- UI checks and a rules file in the repository **do not, by themselves, prove** Admin authorization or Firestore rules enforcement in production. The supplied Security Rules were tested using the Firestore Rules Emulator; production deployment and behavior require separate verification.

## Connection to the Phase 4 report

- **Section 4.5 (Interface Design):** The Guest-facing Site Map can omit Login from ordinary browsing paths without contradicting protected workflows that require it.
- **Section 5.1 (Acceptance Testing):** Login behavior should be described as redirecting to the Home page, not automatically to the Professional Profile.
- **Sections 5.1 and 5.4 (Performance Testing):** Mobile LCP and a Firestore API request duration are different metrics; document each with its matching measurement tool and evidence.
- **Security Testing and Limitations:** State that Security Rules results come from the Emulator unless production deployment and authorization are separately verified.

This navigation file documents **code-level behavior**, not the outcome of live production testing. The root [README](../README.md) describes current setup, data structures, and limitations. Older dated Sprint 1 audit and visual-delivery documents are preserved as historical records.
