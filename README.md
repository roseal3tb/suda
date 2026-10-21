# سُدى | SUDA — Sprint 1

**An Arabic Right-to-Left Fashion Opportunity and Professional Development Platform**

Suda (سُدى) is a web platform designed to help fashion designers in Saudi Arabia discover relevant opportunities, develop their professional profiles, showcase their work, and track their learning progress.

The platform brings together four opportunity categories: Courses, Competitions, Internships, and Career Opportunities.

Sprint 1 includes the implemented web application, Firebase Authentication, and Cloud Firestore integration for selected user-related functions. Opportunity records and Admin Opportunity Management remain demonstration-based using browser localStorage.

## 1. Technology Stack

Suda is developed using the following technologies:

- **React 19** — User interface development.
- **TypeScript** — Type-safe application development.
- **TanStack Start and TanStack Router** — Application architecture and navigation.
- **Tailwind CSS** — Styling and responsive layouts.
- **Framer Motion** — Interface animations and transitions.
- **Firebase Authentication** — User registration, login, logout, and authenticated sessions.
- **Cloud Firestore** — Persistent storage for selected user-related data.
- **Browser localStorage** — Demonstration-based Opportunity records and Admin Opportunity Management.
- **Vercel** — Web application hosting.
- **Vitest** — Automated testing.
- **ESLint** — Code quality checks.

The application uses an Arabic right-to-left (RTL) interface and supports responsive layouts.

## 2. Sprint 1 Implementation

### Implemented Features

The current Sprint 1 application includes:

- Home page with navigation to the four opportunity categories.
- Opportunity browsing, keyword search, and combined filtering.
- Opportunity Details pages.
- User registration and login through Firebase Authentication.
- Authenticated user sessions and logout.
- Professional Profile creation and editing.
- Portfolio item creation, viewing, editing, and deletion.
- Course Enrollment.
- Manual Learning Progress tracking.
- Achievement recording.
- Optional Zoom links for enrolled Courses when valid links are available.
- External application links for Competitions, Internships, and Career Opportunities when available.
- Demonstration-based Admin Opportunity Management.
- Saudi Inspiration page.
- Arabic RTL layout and responsive navigation.

### Firebase Authentication

Firebase Authentication is integrated into the application.

It supports:

- Creating user accounts with an email address and password.
- Signing in with registered credentials.
- Signing out.
- Maintaining authenticated sessions.
- Providing a unique user identifier (UID) associated with user-related data.

The application uses Firebase Authentication rather than simulated local login sessions.

### Cloud Firestore

Cloud Firestore stores selected user-related information.

The implemented data structure includes:

**Professional Profile**

`users/{uid}`

The Professional Profile is stored as an embedded object containing:

- `name`
- `bio`
- `skills[]`
- `interests[]`
- `experience`

**Portfolio Items**

`users/{uid}/works/{workId}`

Each Portfolio item stores:

- `id`
- `title`
- `description`

Portfolio images may be selected and displayed temporarily in the interface, but they are not uploaded to persistent storage in Sprint 1.

**Course Enrollments**

`users/{uid}/enrollments/{courseId}`

Each Course Enrollment document stores:

- `courseId`
- `progress`
- `achievements[]`

Course Enrollment uses the Course ID as the document identifier. The implementation checks for an existing enrollment before creating another record.

Learning Progress is updated manually, and achievements are recorded as text entries.

## 3. Demonstration-Based Functionality

### Opportunities

Opportunity records are currently based on fictional sample data.

The application uses `mock-data.ts` to define the initial Opportunities and `storage.ts` to manage browser localStorage.

Changes to Opportunity records are stored locally in the browser and are not synchronized across devices.

### Admin Opportunity Management

The Admin Dashboard contains interfaces for:

- Adding Opportunities.
- Editing Opportunities.
- Deleting Opportunities.
- Managing the four Opportunity categories.

Admin Opportunity Management is demonstration-based in Sprint 1.

Open **الإدارة التجريبية** in the shared navigation, then choose **فتح لوحة الإدارة التجريبية**. This explicit demonstration mode only edits browser-local Opportunity records. It does not create an authenticated Admin account, change the Firebase user's role, or grant access to private Firestore records. Choose **إنهاء العرض التجريبي** to close it; reloading the page also closes the demonstration mode.

Secure server-side Admin authorization has not yet been implemented. Client-side role checks must not be considered a security boundary.

### Portfolio Images

Portfolio item titles and descriptions are stored in Cloud Firestore.

Selected Portfolio images remain temporary in React state and are not stored persistently.

Although the Firebase SDK configuration includes a Storage initialization, the application does not implement persistent Portfolio image uploads.

### Zoom Links

For Courses, the application may display an optional Zoom URL after the user has enrolled.

Zoom URLs are currently included in local Opportunity data. The application checks the URL format before displaying an available link.

This interface-level check does not replace secure data-layer authorization.

Suda does not host, record, or manage Zoom meetings.

### External Applications

Competitions, Internships, and Career Opportunities may provide links to official external application websites.

Applications are completed outside Suda. The platform does not submit external applications on behalf of users.

When an appropriate external link is unavailable, the interface provides an unavailable-link state.

## 4. Planned Improvements

The proposed final data design includes additional Cloud Firestore collections for centrally managed Opportunity records and restricted Course meeting links.

**Planned collections:**

- `opportunities/{opportunityId}` — Centralized Opportunity records.
- `courseMeetingLinks/{courseId}` — Restricted Course meeting links.

These collections are part of the proposed data model and are not integrated into Cloud Firestore in Sprint 1.

Further development is also required for:

- Secure Admin authorization.
- Appropriate Firebase Security Rules for private data and administrative operations.
- Secure access to restricted Course meeting links at the data layer.
- Centralized Opportunity management.
- Persistent Portfolio image storage if introduced in a future Sprint.
- Additional security, accessibility, device compatibility, and performance verification.

## 5. Website Routes

| Route                | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `/`                  | Home page and platform introduction                     |
| `/opportunities`     | Opportunity browsing, search, and filtering             |
| `/opportunities/$id` | Individual Opportunity Details                          |
| `/register`          | User registration through Firebase Authentication       |
| `/login`             | User login through Firebase Authentication              |
| `/profile`           | Professional Profile management                         |
| `/portfolio`         | Portfolio management                                    |
| `/learning`          | Course Enrollments, Learning Progress, and achievements |
| `/admin`             | Demonstration-based Admin Opportunity Management        |
| `/inspiration`       | Saudi Inspiration content and designer information      |

The application also provides shared navigation, confirmation dialogs, responsive page layouts, and appropriate empty states.

## 6. Running the Project Locally

### Prerequisites

- Node.js 22.12+ or Node.js 24.
- npm.
- Access to a Firebase project configured for the required services.

### Installation

Clone the repository:

```bash
git clone https://github.com/roseal3tb/suda.git
```

Open the project directory:

```bash
cd suda
```

Install dependencies:

```bash
npm ci
```

### Firebase Configuration

Create a `.env` file in the project root.

The Firebase configuration in `src/lib/firebase.ts` reads the following environment variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

Replace the example values with the configuration of your Firebase project.

Enable the Email/Password sign-in method in Firebase Authentication and configure Cloud Firestore as required by the application.

The Storage configuration field is included because it exists in the Firebase initialization code; persistent Portfolio image uploads are not implemented.

Do not commit local `.env` files, service-account credentials, or other private configuration values to the repository.

### Start the Development Server

```bash
npm run dev
```

Open the local address displayed in the terminal.

If a local environment cannot enumerate network interfaces, use:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

## 7. Verification Commands

The project provides the following scripts:

| Command             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Start the development server                              |
| `npm run typecheck` | Check TypeScript types                                    |
| `npm run test`      | Run automated tests                                       |
| `npm run lint`      | Run ESLint                                                |
| `npm run build`     | Create a production build                                 |
| `npm run preview`   | Preview the production build locally                      |
| `npm run verify`    | Run type checking, tests, linting, and build sequentially |

To run all four verification stages:

```bash
npm run verify
```

These commands are available in `package.json`. Successful execution should be confirmed in the target development environment.

Automated checks do not replace manual verification of responsive layouts, browser compatibility, accessibility, security, or production performance.

## 8. Project Structure

The main project directories and files include:

```text
src/
  routes/
  components/
    suda/
  features/
    suda/
      mock-data.ts
      demo-context.tsx
      storage.ts
      auth-page.tsx
  lib/
    firebase.ts
    auth.ts
  test/
  styles.css

public/
  editorial/

docs/
  atelier-asset-map.md
  atelier-delivery.md
  navigation.md
  visual-refresh.md

README.md
AUTHORS
package.json
```

### Main Responsibilities

- `src/routes/` — Application pages and navigation routes.
- `src/components/suda/` — Shared Suda interface components.
- `src/features/suda/mock-data.ts` — Opportunity types, sample records, and domain utilities.
- `src/features/suda/demo-context.tsx` — Shared application state, Firebase integration, Opportunity changes, Portfolio management, Course Enrollment, Learning Progress, and achievements.
- `src/features/suda/storage.ts` — Browser localStorage utilities for demonstration data.
- `src/features/suda/auth-page.tsx` — Registration and login forms.
- `src/lib/firebase.ts` — Firebase initialization.
- `src/lib/auth.ts` — Firebase Authentication operations.
- `src/styles.css` — Application styling and responsive layouts.
- `src/test/` — Automated tests.
- `public/editorial/` — Editorial images and media assets.
- `AUTHORS` — Project team members.

Some historical documentation in the `docs/` directory describes earlier frontend-only development stages. The current implementation status is reflected in the application source code and this README.

## 9. User Interface and Visual Identity

Suda uses a soft editorial visual identity suitable for a fashion-oriented platform.

The main color palette includes:

| Color          | Hex Code  |
| -------------- | --------- |
| Linen          | `#FAF6F1` |
| Dusty Rose     | `#E8D7E1` |
| Lavender Taupe | `#C5B1BC` |
| Mauve-Gray     | `#A195A2` |
| Moody Plum     | `#564E58` |

The application uses IBM Plex Sans Arabic and Tajawal with fallback fonts.

The interface includes:

- Arabic RTL layouts.
- Responsive navigation and cards.
- Editorial imagery.
- A silent visual montage on the Home page.
- Motion preferences and visual fallbacks.
- Form validation and feedback messages.
- Confirmation dialogs for relevant actions.

The current Opportunity content is fictional demonstration data and should not be interpreted as verified real-world listings.

## 10. Data Management and Security Limitations

The Sprint 1 implementation combines persistent Firebase services with browser-based demonstration data.

**Implemented persistent services:**

- Firebase Authentication for user accounts and authenticated sessions.
- Cloud Firestore for Professional Profiles.
- Cloud Firestore for Portfolio item titles and descriptions.
- Cloud Firestore for Course Enrollments, Learning Progress, and achievements.

**Demonstration-based or incomplete functionality:**

- Opportunity records and Admin Opportunity Management use browser localStorage.
- Admin authorization is not securely enforced at the server or database level.
- Portfolio images are not saved persistently.
- Course meeting links are not stored in a restricted Firestore collection.
- Opportunity modifications are not synchronized between devices.

The local demonstration reset clears relevant browser-stored demonstration data without deleting user-related Cloud Firestore records.

Production use requires appropriate authentication, authorization, and Firebase Security Rules. The presence of an authenticated Firebase session alone does not establish secure Admin permissions.

## 11. Deployment

The Suda web application is deployed using Vercel.

**Deployed Website:**  
https://sudadesign.vercel.app

**GitHub Repository:**  
https://github.com/roseal3tb/suda

**Jira Project:**  
Suda Workspace

GitHub is used for source code management, Jira supports Scrum planning and task tracking, and Vercel hosts the web application.

## 12. Project Team

The Suda project was developed by:

- Shmookh Alsalman
- Hind Alwasel
- Aljowhara Almuqati
- Rawan Almutiri
- Rose Alatawi

The team members are also listed in the repository's `AUTHORS` file.

## 13. Project Scope

Suda aims to support the professional development of fashion designers in Saudi Arabia through opportunity discovery, professional identity management, and learning tracking.

Sprint 1 demonstrates the main web application and integrates Firebase Authentication and Cloud Firestore for selected user-related functions.

The remaining demonstration-based and planned components are documented separately to avoid presenting incomplete functionality as production-ready.

---

**SUDA | سُدى — IT320 Software Engineering Project — Sprint 1**
