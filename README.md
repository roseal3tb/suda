# سُدى | SUDA — Sprint 2 (Phase 4)

**An Arabic Right-to-Left Fashion Opportunity and Professional Development Platform**

Suda (سُدى) is a web application designed to help fashion designers in Saudi Arabia discover opportunities, build professional profiles, showcase their work, and track their learning progress. It presents four Opportunity categories: **Courses, Competitions, Internships, and Career Opportunities**.

This README describes the **Sprint 2 implementation**. Unlike Sprint 1, Opportunity records and eligible Course meeting links are integrated with **Cloud Firestore**, rather than managed as browser-only demonstration records. Some features and production-security verification remain limited, as described below.

## 1. Technology Stack

- **React 19, TypeScript** — User interface and application logic.
- **TanStack Start and TanStack Router** — Application structure and navigation.
- **Tailwind CSS, Framer Motion** — Responsive styling and interface transitions.
- **Firebase Authentication** — Registration, login, logout, and authenticated sessions.
- **Cloud Firestore** — Opportunity records, user data, enrollments, and Course meeting links.
- **Vercel** — Web application deployment.
- **Vitest, TypeScript, ESLint** — Automated tests and code checks.

The interface is primarily Arabic, uses right-to-left (RTL) layouts, and supports responsive navigation.

## 2. Implemented Features

### User Features

- Browse Opportunities in the four categories, search by keywords, and apply filters.
- Open Opportunity Details and available external application links.
- Register, log in, and log out using Firebase Authentication.
- Create and update a Professional Profile.
- Add, view, edit, and delete Portfolio items (title and description).
- Enroll in Courses, update Learning Progress manually, and add achievements.
- Access a Course Zoom link when a valid link is available and the signed-in user is eligible to view it.
- Explore the Saudi Inspiration page.

After successful login, the application navigates to the **Home page (`/`)** while the user remains authenticated.

### Admin Opportunity Management

The Admin page provides interfaces to **add, edit, delete, search, and manage Opportunities**. The current code writes Opportunity records to Cloud Firestore. Course Zoom links are stored separately from public Opportunity records.

The Admin route and write operations require an authenticated account with a **trusted Firebase custom claim `admin=true`**. The client cannot grant this claim to itself. Admin availability in a deployed environment therefore depends on proper account provisioning and correctly deployed Firestore Security Rules; the presence of Admin UI code alone does not establish production authorization.

### Opportunity Data

Opportunity records are read from the Firestore `opportunities` collection. The code does **not** substitute browser `localStorage` records when Firestore is empty or unavailable.

The repository still contains **fictional sample Opportunities** in `mock-data.ts`. A separate, Admin-authorized import function can migrate legacy or initial records into Firestore; the sample data is not evidence of verified real-world listings.

## 3. Cloud Firestore Data Structure

| Collection / document | Purpose |
| --- | --- |
| `opportunities/{opportunityId}` | Public Opportunity details, without private Zoom meeting URLs. |
| `courseMeetingLinks/{courseId}` | Separate Course Zoom meeting links. |
| `users/{uid}` | User document containing the Professional Profile and migration metadata. |
| `users/{uid}/works/{workId}` | Portfolio item metadata: `id`, `title`, and `description`. |
| `users/{uid}/enrollments/{courseId}` | Course Enrollment, `progress`, and `achievements`. |

**Professional Profile:** Includes fields such as `name`, `bio`, `skills`, `interests`, and `experience`.

**Portfolio:** Titles and descriptions are saved to Firestore. Selected images may appear temporarily in the interface, but **persistent image uploads and storage are not implemented**. The Firebase Storage SDK is initialized but is not used for persistent Portfolio image uploads.

**Learning Progress:** The user updates progress manually and adds achievement text. Course Enrollment uses the Course ID to identify its record and prevent duplicate enrollment records.

**Course meeting links:** The application separates links from public Opportunity data and attempts to retrieve them for authenticated, eligible users. Actual enforcement depends on the Firestore rules deployed to the connected Firebase project.

## 4. Authentication and Security

Firebase Authentication provides real email/password registration and login. User-specific Firestore paths are associated with the authenticated Firebase UID.

The repository includes `firestore.rules` and a dedicated `security-tests/` suite. The documented suite reports **30 passing security tests using the Firebase Firestore Rules Emulator**. These tests cover user-data isolation, Admin permissions, Opportunity writes, and restricted meeting links.

**Important limitation:** Emulator results validate the tested rules file, **not** whether those same rules are deployed and enforced in the live Firebase project. Production rules deployment, Admin account provisioning, and live authorization behavior must be verified separately before claiming production security compliance. GitHub or Vercel deployment does not automatically deploy Firestore Security Rules.

See [`security-tests/README.md`](security-tests/README.md) for the security test setup and documented limitations.

## 5. Current Limitations

- Portfolio images are not stored persistently; Portfolio text metadata is stored in Firestore.
- Opportunities in the supplied sample dataset are fictional and should not be presented as verified listings.
- External applications for Competitions, Internships, and Career Opportunities are completed on external websites, not submitted through Suda.
- Suda displays eligible Zoom links but does not host or manage Zoom meetings.
- Access to Admin features requires a trusted Admin claim and appropriate cloud configuration.
- The provided Firestore Security Rules were tested with an Emulator; their production deployment has not been independently established by that evidence.
- Broader production security, accessibility, device compatibility, and performance testing remains future verification work.

Browser `localStorage` utilities remain for **legacy-data migration and import**, not as the current primary storage for Opportunity management.

## 6. Website Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/opportunities` | Opportunity browsing, search, and filters |
| `/opportunities/$id` | Opportunity Details |
| `/register` | User registration |
| `/login` | User login |
| `/profile` | Professional Profile |
| `/portfolio` | Portfolio management |
| `/learning` | Course Enrollments, Learning Progress, and achievements |
| `/admin` | Admin Opportunity Management (authorized Admin only) |
| `/inspiration` | Saudi Inspiration |

## 7. Run the Project Locally

### Prerequisites

- Node.js 22.12+ or Node.js 24
- npm
- A Firebase project configured for Authentication and Cloud Firestore

### Install

```bash
git clone https://github.com/roseal3tb/suda.git
cd suda
npm ci
```

### Configure Firebase

Create a `.env` file in the project root using your Firebase project configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Enable **Email/Password** sign-in in Firebase Authentication, configure Firestore as needed, and review access controls before testing cloud operations. Never commit `.env` files or privileged Firebase credentials.

### Start

```bash
npm run dev
```

Open the local address shown in the terminal.

## 8. Verification and Testing

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Check TypeScript types |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Run ESLint |
| `npm run build` | Build the application |
| `npm run preview` | Preview the production build locally |
| `npm run verify` | Run typecheck, tests, lint, and build sequentially |

To run the separate Firestore Security Rules Emulator test suite, follow the instructions in `security-tests/README.md`.

The project report documents Acceptance Testing, Integration Testing, User Acceptance Testing, and selected Non-Functional Requirement tests. These results apply to their documented test conditions and should not be interpreted as verification of every production scenario.

## 9. Project Structure

```text
src/
  routes/                 # Application pages and routes
  components/suda/        # Shared Suda interface components
  features/suda/
    demo-context.tsx      # Application state and Firebase integration
    mock-data.ts          # Opportunity types, sample data, and utilities
    storage.ts            # Legacy browser-data utilities
    auth-page.tsx         # Registration and login forms
  lib/
    firebase.ts           # Firebase initialization
    auth.ts               # Authentication operations
  test/                   # Application tests
  styles.css              # Application styling

public/editorial/         # Editorial media
security-tests/           # Firestore Emulator tests
firestore.rules           # Firestore rules source
firebase.json             # Emulator / rules configuration
README.md
AUTHORS
package.json
```

Some files in `docs/` and the security test documentation describe earlier development stages. The active application source code and this Sprint 2 README take precedence when describing the current feature implementation.

## 10. Deployment and Project Links

- **Website:** https://sudadesign.vercel.app/
- **GitHub Repository:** https://github.com/roseal3tb/suda
- **Jira Workspace / Project:** [Suda Workspace](https://roseal.atlassian.net/?continue=https%3A%2F%2Froseal.atlassian.net%2Fwelcome%2Fsoftware%3FprojectId%3D10000&atlOrigin=eyJpIjoiMjRkZDU2ZmJhNTA2NDFiMGFjY2FlMWM2Zjc5ZDBiOGMiLCJwIjoiamlyYS1zb2Z0d2FyZSJ9)

The Jira link above is the link embedded in the Phase 4 report. Jira permissions and access by the instructor should be checked with the relevant account; the link alone does not establish access.

## 11. Project Team

Suda was developed by:

- Shmookh Alsalman
- Hind Alwasel
- Aljowhara Almuqati
- Rawan Almutiri
- Rose Alatawi

See [`AUTHORS`](AUTHORS) for the team record.

---

**SUDA | سُدى — IT320 Software Engineering Project — Sprint 2 / Phase 4**
