# Suda Firestore security rules

Status: 30 security tests passed on the actual Firestore Rules Emulator with Firebase client requests. No production deployment was performed. These tests validate the supplied firestore.rules, not the previously deployed ruleset.

## Implemented protection

- Only the authenticated UID can read/write its private profile, portfolio metadata and enrollment records.
- Cross-user reads, writes, deletes and private account enumeration are denied.
- Client-written admin or role fields cannot confer privileges. displayRole remains display-only.
- Cloud opportunity writes require a trusted Firebase Authentication custom claim admin=true.
- Private meeting links cannot be listed by ordinary users, and document reads require a matching enrollment or trusted Admin claim.
- Public opportunities reject zoomUrl and meetingUrl fields. Keep private links only in courseMeetingLinks.
- Unknown collections are denied. Admin status does not grant access to users' private profiles.

## Run

From the repository root:

    cd security-tests
    npm ci
    npm test

Java 17 or a compatible later runtime is required by the pinned emulator tooling. Dependencies are isolated from the application package. Emulator project demo-suda-security never accesses production records.

## Deploy the rules

Copy firestore.rules, firebase.json and security-tests/ into the project root. Review these rules against any additional production collections before deployment. From the project root on your computer:

    npx firebase-tools@13.35.1 login
    npx firebase-tools@13.35.1 use --add
    npx firebase-tools@13.35.1 deploy --only firestore:rules

Choose the existing Firebase project used by Suda when prompted. Never deploy to a different project or test database by guessing its ID. GitHub push and Vercel deployment do not publish Firestore rules.

## Admin application integration remains required

The current Admin UI operates on localStorage and uses an explicit demo mode. These rules protect cloud opportunity records but do not automatically migrate the local Admin UI to Firestore or remove the demo switch. Final production Admin functionality requires connecting those operations to the protected opportunities collection, reading a trusted admin claim in the UI and assigning that claim through a privileged Firebase Admin SDK environment. Never grant Admin from a UI role selector, email field or writable Firestore displayRole.

No Admin claim was assigned and no existing account permissions were changed. No private production records were read by these tests. After rules deployment, validate production denial/success using dedicated test accounts before marking production authorization Pass.

## Evidence

30 tests passed, 0 failed. Coverage includes anonymous access, cross-account profile/portfolio/enrollment isolation, attempts at privilege escalation, trusted Admin create/edit/delete, public opportunities, private meeting access, enrollment ownership and progress bounds.
