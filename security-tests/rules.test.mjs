import { readFileSync } from "node:fs";
import { before, after, test } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
let env, a, b, guest, admin;
const work = { id: "w1", title: "Design", description: "Test work" };
const enrollment = { courseId: "c1", progress: 25, achievements: [] };
const opportunity = { title: "Course", type: "الدورات" };
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-suda-security",
    firestore: {
      host: "127.0.0.1",
      port: 8088,
      rules: readFileSync("../firestore.rules", "utf8"),
    },
  });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "users/alice"), {
      name: "Alice",
      profile: { name: "Alice" },
    });
    await setDoc(doc(db, "users/alice/works/w1"), work);
    await setDoc(doc(db, "users/alice/enrollments/c1"), enrollment);
    await setDoc(doc(db, "courseMeetingLinks/c1"), {
      zoomUrl: "https://zoom.us/j/test-fixture",
    });
  });
  a = env.authenticatedContext("alice").firestore();
  b = env.authenticatedContext("bob").firestore();
  guest = env.unauthenticatedContext().firestore();
  admin = env
    .authenticatedContext("trusted-admin", { admin: true })
    .firestore();
});
after(async () => {
  if (env) await env.cleanup();
});
test("owner reads own private profile", () =>
  assertSucceeds(getDoc(doc(a, "users/alice"))));
test("owner updates own profile", () =>
  assertSucceeds(
    updateDoc(doc(a, "users/alice"), { profile: { name: "Updated" } }),
  ));
test("anonymous cannot read private profile", () =>
  assertFails(getDoc(doc(guest, "users/alice"))));
test("second user cannot read first profile", () =>
  assertFails(getDoc(doc(b, "users/alice"))));
test("second user cannot overwrite first profile", () =>
  assertFails(setDoc(doc(b, "users/alice"), { name: "Hijack" })));
test("users cannot enumerate private accounts", () =>
  assertFails(getDocs(collection(b, "users"))));
test("second user cannot read first portfolio", () =>
  assertFails(getDoc(doc(b, "users/alice/works/w1"))));
test("second user cannot overwrite first portfolio", () =>
  assertFails(setDoc(doc(b, "users/alice/works/w1"), work)));
test("second user cannot delete first portfolio", () =>
  assertFails(deleteDoc(doc(b, "users/alice/works/w1"))));
test("owner saves own portfolio metadata", () =>
  assertSucceeds(setDoc(doc(a, "users/alice/works/w1"), work)));
test("portfolio image data is not accepted as metadata", () =>
  assertFails(
    setDoc(doc(a, "users/alice/works/w1"), {
      ...work,
      image: "data:image/png;base64,fixture",
    }),
  ));
test("second user cannot read first enrollment", () =>
  assertFails(getDoc(doc(b, "users/alice/enrollments/c1"))));
test("second user cannot change first progress", () =>
  assertFails(
    updateDoc(doc(b, "users/alice/enrollments/c1"), { progress: 100 }),
  ));
test("owner can save valid learning progress", () =>
  assertSucceeds(
    updateDoc(doc(a, "users/alice/enrollments/c1"), { progress: 75 }),
  ));
test("progress over100 is rejected", () =>
  assertFails(
    updateDoc(doc(a, "users/alice/enrollments/c1"), { progress: 101 }),
  ));
test("owner cannot self-assign privileged admin field", () =>
  assertFails(updateDoc(doc(a, "users/alice"), { admin: true })));
test("displayRole admin does not grant opportunity permissions", async () => {
  await assertSucceeds(
    setDoc(doc(b, "users/bob"), { name: "Bob", displayRole: "admin" }),
  );
  await assertFails(setDoc(doc(b, "opportunities/spoof"), opportunity));
});
test("anonymous cannot create cloud opportunity", () =>
  assertFails(setDoc(doc(guest, "opportunities/guest"), opportunity)));
test("trusted admin claim can create cloud opportunity", () =>
  assertSucceeds(setDoc(doc(admin, "opportunities/trusted"), opportunity)));
test("trusted admin claim can edit cloud opportunity", async () => {
  await setDoc(doc(admin, "opportunities/edit"), opportunity);
  await assertSucceeds(
    updateDoc(doc(admin, "opportunities/edit"), { title: "Updated" }),
  );
});
test("normal user cannot delete cloud opportunity", async () => {
  await setDoc(doc(admin, "opportunities/delete-denied"), opportunity);
  await assertFails(deleteDoc(doc(b, "opportunities/delete-denied")));
});
test("trusted admin can delete cloud opportunity", async () => {
  await setDoc(doc(admin, "opportunities/delete-ok"), opportunity);
  await assertSucceeds(deleteDoc(doc(admin, "opportunities/delete-ok")));
});
test("private Zoom field cannot be published in opportunity", () =>
  assertFails(
    setDoc(doc(admin, "opportunities/leak"), {
      ...opportunity,
      zoomUrl: "private",
    }),
  ));
test("public can read cloud opportunities", () =>
  assertSucceeds(getDocs(collection(guest, "opportunities"))));
test("unenrolled user cannot get private meeting link", () =>
  assertFails(getDoc(doc(b, "courseMeetingLinks/c1"))));
test("enrolled user can get matching meeting link", () =>
  assertSucceeds(getDoc(doc(a, "courseMeetingLinks/c1"))));
test("normal user cannot enumerate meeting links", () =>
  assertFails(getDocs(collection(a, "courseMeetingLinks"))));
test("normal user cannot change meeting link", () =>
  assertFails(
    updateDoc(doc(a, "courseMeetingLinks/c1"), { zoomUrl: "changed" }),
  ));
test("admin claim does not grant private user profile access", () =>
  assertFails(getDoc(doc(admin, "users/alice"))));
test("unspecified collections are denied", () =>
  assertFails(setDoc(doc(a, "unknown/x"), { value: 1 })));
