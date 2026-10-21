import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { loginUser, logoutUser, registerUser } from "@/lib/auth";

import {
  initialOpportunities,
  clampProgress,
  type Opportunity,
  type Profile,
  type Work,
  type Enrollment,
} from "./mock-data";

import {
  readStore,
  writeStore,
  clearStore,
  STORE_KEYS,
  userStoreKey,
} from "./storage";

export interface Session {
  name: string;

  email: string;

  role: "user" | "admin";
}

interface DemoState {
  adminDemo: boolean;
  startAdminDemo: () => void;
  endAdminDemo: () => void;

  session: Session | null;

  // Firebase Authentication

  signIn: (email: string, password: string) => Promise<void>;

  signUp: (
    name: string,

    email: string,

    password: string,
  ) => Promise<void>;

  signOutUser: () => Promise<void>;

  opportunities: Opportunity[];

  saveOpportunity: (item: Opportunity) => boolean;

  deleteOpportunity: (id: string) => boolean;

  profile: Profile | null;

  profileLoading: boolean;

  saveProfile: (profile: Profile) => Promise<boolean>;

  works: Work[];

  worksLoading: boolean;

  saveWork: (work: Work) => Promise<boolean>;

  deleteWork: (id: string) => Promise<boolean>;

  enrollments: Enrollment[];

  enrollmentsLoading: boolean;

  enroll: (course: Opportunity) => Promise<boolean>;

  updateProgress: (id: string, value: number) => Promise<boolean>;

  addAchievement: (id: string, text: string) => Promise<boolean>;

  resetDemo: () => boolean;

  storageError: string;

  clearStorageError: () => void;
}

const Context = createContext<DemoState | null>(null);

const failMessage =
  "تعذّر حفظ البيانات محليًا. قد تكون مساحة المتصفح ممتلئة؛ جرّبي صورة أصغر أو امسحي بعض بيانات العرض";

// Firestore stores portfolio metadata only. Images never leave the current session.

function asStoredWork(value: unknown, fallbackId = ""): Work | null {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;

  const id = typeof data["id"] === "string" ? data["id"] : fallbackId;

  if (!id || id.includes("/") || id === "." || id === "..") return null;

  if (
    typeof data["title"] !== "string" ||
    typeof data["description"] !== "string"
  )
    return null;

  return {
    id,
    title: data["title"],
    description: data["description"],
    image: "",
  };
}

// Only accept well-formed enrollment records; document ID is authoritative.
function asStoredEnrollment(
  value: unknown,
  fallbackId = "",
): Enrollment | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const courseId =
    fallbackId ||
    (typeof data["courseId"] === "string" ? data["courseId"] : "");
  if (
    !courseId ||
    courseId.includes("/") ||
    courseId === "." ||
    courseId === ".."
  )
    return null;
  const progress = data["progress"];
  const achievements = data["achievements"];
  if (
    typeof progress !== "number" ||
    !Number.isFinite(progress) ||
    progress < 0 ||
    progress > 100
  )
    return null;
  if (
    !Array.isArray(achievements) ||
    !achievements.every((entry) => typeof entry === "string")
  )
    return null;
  return { courseId, progress, achievements };
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;

  const p = value as Record<string, unknown>;

  return (
    typeof p["name"] === "string" &&
    typeof p["bio"] === "string" &&
    typeof p["experience"] === "string" &&
    Array.isArray(p["skills"]) &&
    p["skills"].every((s) => typeof s === "string") &&
    Array.isArray(p["interests"]) &&
    p["interests"].every((s) => typeof s === "string")
  );
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  // UI demonstration only: never changes Firebase identity or cloud permissions.
  const [adminDemo, setAdminDemo] = useState(false);

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);

  const [works, setWorks] = useState<Work[]>([]);

  const [worksLoading, setWorksLoading] = useState(true);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  const [storageError, setStorageError] = useState("");

  // Load opportunities from local storage

  useEffect(() => {
    setOpportunities(
      readStore<Opportunity[]>(
        STORE_KEYS.opportunities,

        initialOpportunities,
      ).map((item) => {
        const seed = initialOpportunities.find((seed) => seed.id === item.id);

        return seed && item.image.startsWith("https://images.unsplash.com/")
          ? { ...item, image: seed.image }
          : item;
      }),
    );
  }, []);

  // Firebase is the only authority for the active session.

  useEffect(() => {
    let active = true;

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentRequest = ++requestId;

      if (!user) {
        setProfileLoading(false);

        setSession(null);

        setProfile(null);

        setWorks([]);

        setWorksLoading(false);

        setEnrollments([]);

        setEnrollmentsLoading(false);

        return;
      }

      const email = user.email || "";

      setSession({
        name: user.displayName || "مستخدمة سُدى",

        email,

        role: "user",
      });

      setProfile(null);

      setProfileLoading(true);

      setWorks([]);

      setWorksLoading(true);

      setStorageError("");

      setEnrollments([]);

      setEnrollmentsLoading(true);

      // The profile belongs to the Firebase UID, never to a chosen email/role.

      void (async () => {
        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));

          if (!active || currentRequest !== requestId) return;

          const value: unknown = snapshot.data()?.["profile"];

          if (isProfile(value)) setProfile(value);
          else setProfile(null);

          setProfileLoading(false);
        } catch (error) {
          if (!active || currentRequest !== requestId) return;

          setProfileLoading(false);

          console.error("Failed to load Firestore profile:", error);

          setStorageError(
            "تعذّر تحميل الملف المهني من Firebase. تحققي من الاتصال وحاولي مجددًا.",
          );
        }
      })();

      // Read cloud portfolio and migrate legacy browser entries without images.

      void (async () => {
        try {
          const userRef = doc(db, "users", user.uid);

          const worksCollection = collection(db, "users", user.uid, "works");

          const [userSnapshot, snapshot] = await Promise.all([
            getDoc(userRef),

            getDocs(worksCollection),
          ]);

          if (!active || currentRequest !== requestId) return;

          const cloudWorks = snapshot.docs

            .map((entry) => asStoredWork(entry.data(), entry.id))

            .filter((work): work is Work => work !== null);

          const existing = new Set(cloudWorks.map((work) => work.id));

          const legacy = readStore<unknown>(
            userStoreKey(email, "portfolio"),
            [],
          );

          const migrated: Work[] = [];

          const alreadyMigrated =
            userSnapshot.data()?.["portfolioLegacyMigrated"] === true;

          // Migrate legacy titles and descriptions once, never image data.

          // Keep the browser's old copy as a backup; the Firestore flag prevents

          // deleted cloud works from being restored on later logins.

          if (!alreadyMigrated && Array.isArray(legacy) && legacy.length > 0) {
            for (const item of legacy) {
              const work = asStoredWork(item);

              if (!work || existing.has(work.id)) continue;

              if (
                !active ||
                currentRequest !== requestId ||
                auth.currentUser?.uid !== user.uid
              )
                return;

              await setDoc(doc(worksCollection, work.id), {
                id: work.id,

                title: work.title,

                description: work.description,
              });

              existing.add(work.id);

              migrated.push(work);
            }

            if (
              !active ||
              currentRequest !== requestId ||
              auth.currentUser?.uid !== user.uid
            )
              return;

            await setDoc(
              userRef,
              { portfolioLegacyMigrated: true },
              { merge: true },
            );
          }

          if (!active || currentRequest !== requestId) return;

          setWorks(
            [...migrated, ...cloudWorks].sort((a, b) =>
              b.id.localeCompare(a.id),
            ),
          );

          setWorksLoading(false);
        } catch (error) {
          if (!active || currentRequest !== requestId) return;

          console.error("Failed to load Firestore portfolio:", error);

          setStorageError(
            "تعذّر تحميل معرض الأعمال من Firebase. تحققي من الاتصال وحاولي مجددًا.",
          );

          setWorksLoading(false);
        }
      })();

      // Load course enrollments from Firestore, migrating old browser data once.
      void (async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const enrollmentCollection = collection(
            db,
            "users",
            user.uid,
            "enrollments",
          );
          const userSnapshot = await getDoc(userRef);
          if (
            !active ||
            currentRequest !== requestId ||
            auth.currentUser?.uid !== user.uid
          )
            return;

          const legacy = readStore<unknown>(
            userStoreKey(email, "enrollments"),
            [],
          );
          const migratedBefore =
            userSnapshot.data()?.["enrollmentsLegacyMigrated"] === true;
          if (!migratedBefore && Array.isArray(legacy) && legacy.length > 0) {
            for (const item of legacy) {
              const enrollment = asStoredEnrollment(item);
              if (!enrollment) continue;
              if (
                !active ||
                currentRequest !== requestId ||
                auth.currentUser?.uid !== user.uid
              )
                return;
              const ref = doc(enrollmentCollection, enrollment.courseId);
              await runTransaction(db, async (transaction) => {
                const existing = await transaction.get(ref);
                if (!existing.exists()) transaction.set(ref, enrollment);
              });
            }
            if (
              !active ||
              currentRequest !== requestId ||
              auth.currentUser?.uid !== user.uid
            )
              return;
            await setDoc(
              userRef,
              { enrollmentsLegacyMigrated: true },
              { merge: true },
            );
          }

          const snapshot = await getDocs(enrollmentCollection);
          if (
            !active ||
            currentRequest !== requestId ||
            auth.currentUser?.uid !== user.uid
          )
            return;
          setEnrollments(
            snapshot.docs
              .map((entry) => asStoredEnrollment(entry.data(), entry.id))
              .filter((item): item is Enrollment => item !== null),
          );
          setEnrollmentsLoading(false);
        } catch (error) {
          if (!active || currentRequest !== requestId) return;
          console.error("Failed to load Firestore enrollments:", error);
          setStorageError(
            "تعذّر تحميل الدورات من Firebase. تحققي من الاتصال وحاولي مجددًا.",
          );
          setEnrollmentsLoading(false);
        }
      })();
    });

    return () => {
      active = false;

      unsubscribe();
    };
  }, []);

  // Firebase Authentication functions

  async function signIn(email: string, password: string) {
    await loginUser(email, password);
  }

  async function signUp(
    name: string,

    email: string,

    password: string,
  ) {
    await registerUser(name, email, password);
  }

  async function signOutUser() {
    await logoutUser();
    setAdminDemo(false);
  }

  function persist(key: string, value: unknown) {
    const ok = writeStore(key, value);

    if (!ok) {
      setStorageError(failMessage);
    } else {
      setStorageError("");
    }

    return ok;
  }

  function saveOpportunity(item: Opportunity) {
    const next = opportunities.some((p) => p.id === item.id)
      ? opportunities.map((p) => (p.id === item.id ? item : p))
      : [item, ...opportunities];

    if (!persist(STORE_KEYS.opportunities, next)) {
      return false;
    }

    setOpportunities(next);

    return true;
  }

  function deleteOpportunity(id: string) {
    const next = opportunities.filter((p) => p.id !== id);

    if (!persist(STORE_KEYS.opportunities, next)) {
      return false;
    }

    setOpportunities(next);

    // Deleting a local opportunity must not silently erase cloud learning progress.

    return true;
  }

  async function saveProfile(next: Profile): Promise<boolean> {
    const user = auth.currentUser;

    if (!user) {
      setStorageError("سجّلي الدخول قبل حفظ الملف المهني.");

      return false;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { profile: next },
        { merge: true },
      );

      if (auth.currentUser?.uid !== user.uid) return false;

      setProfile(next);

      setStorageError("");

      return true;
    } catch (error) {
      console.error("Failed to save Firestore profile:", error);

      setStorageError(
        "تعذّر حفظ الملف المهني في Firebase. تحققي من الاتصالوحاولي مجددًا.",
      );

      return false;
    }
  }

  async function saveWork(work: Work): Promise<boolean> {
    const user = auth.currentUser;

    if (!user) {
      setStorageError("سجّلي الدخول قبل حفظ العمل.");

      return false;
    }

    try {
      // Save text only; image is intentionally temporary in React state.

      await setDoc(doc(db, "users", user.uid, "works", work.id), {
        id: work.id,

        title: work.title,

        description: work.description,
      });

      if (auth.currentUser?.uid !== user.uid) return false;

      setWorks((current) =>
        current.some((item) => item.id === work.id)
          ? current.map((item) => (item.id === work.id ? work : item))
          : [work, ...current],
      );

      setStorageError("");

      return true;
    } catch (error) {
      console.error("Failed to save Firestore work:", error);

      setStorageError(
        "تعذّر حفظ العمل في Firebase. تحققي من الاتصال وحاولي مجددًا.",
      );

      return false;
    }
  }

  async function deleteWork(id: string): Promise<boolean> {
    const user = auth.currentUser;

    if (!user) return false;

    try {
      await deleteDoc(doc(db, "users", user.uid, "works", id));

      if (auth.currentUser?.uid !== user.uid) return false;

      setWorks((current) => current.filter((item) => item.id !== id));

      setStorageError("");

      return true;
    } catch (error) {
      console.error("Failed to delete Firestore work:", error);

      setStorageError(
        "تعذّر حذف العمل من Firebase. تحققي من الاتصال وحاولي مجددًا.",
      );

      return false;
    }
  }

  async function enroll(course: Opportunity): Promise<boolean> {
    const user = auth.currentUser;
    if (
      !user ||
      enrollmentsLoading ||
      course.type !== "الدورات" ||
      !course.id ||
      course.id.includes("/") ||
      course.id === "." ||
      course.id === ".."
    )
      return false;
    const enrollment: Enrollment = {
      courseId: course.id,
      progress: 0,
      achievements: [],
    };
    try {
      const ref = doc(db, "users", user.uid, "enrollments", course.id);
      const created = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (snapshot.exists()) return false;
        transaction.set(ref, enrollment);
        return true;
      });
      if (auth.currentUser?.uid !== user.uid) return false;
      if (created)
        setEnrollments((current) =>
          current.some((item) => item.courseId === course.id)
            ? current
            : [...current, enrollment],
        );
      setStorageError("");
      return created;
    } catch (error) {
      console.error("Failed to enroll in Firestore course:", error);
      if (auth.currentUser?.uid === user.uid)
        setStorageError(
          "تعذّر التسجيل في الدورة. تحققي من الاتصال وحاولي مجددًا.",
        );
      return false;
    }
  }

  async function updateProgress(id: string, value: number): Promise<boolean> {
    const user = auth.currentUser;
    if (
      !user ||
      enrollmentsLoading ||
      !id ||
      id.includes("/") ||
      !Number.isFinite(value)
    )
      return false;
    const progress = clampProgress(value);
    try {
      const ref = doc(db, "users", user.uid, "enrollments", id);
      const updated = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists() || !asStoredEnrollment(snapshot.data(), id))
          return false;
        transaction.update(ref, { progress });
        return true;
      });
      if (auth.currentUser?.uid !== user.uid) return false;
      if (updated)
        setEnrollments((current) =>
          current.map((item) =>
            item.courseId === id ? { ...item, progress } : item,
          ),
        );
      setStorageError("");
      return updated;
    } catch (error) {
      console.error("Failed to update Firestore progress:", error);
      if (auth.currentUser?.uid === user.uid)
        setStorageError("تعذّر حفظ التقدّم. تحققي من الاتصال وحاولي مجددًا.");
      return false;
    }
  }

  async function addAchievement(id: string, text: string): Promise<boolean> {
    const user = auth.currentUser;
    const achievement = text.trim();
    if (!user || enrollmentsLoading || !id || id.includes("/") || !achievement)
      return false;
    try {
      const ref = doc(db, "users", user.uid, "enrollments", id);
      const updated = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        const existing = snapshot.exists()
          ? asStoredEnrollment(snapshot.data(), id)
          : null;
        if (!existing) return false;
        transaction.update(ref, {
          achievements: [...existing.achievements, achievement],
        });
        return true;
      });
      if (auth.currentUser?.uid !== user.uid) return false;
      if (updated)
        setEnrollments((current) =>
          current.map((item) =>
            item.courseId === id
              ? { ...item, achievements: [...item.achievements, achievement] }
              : item,
          ),
        );
      setStorageError("");
      return updated;
    } catch (error) {
      console.error("Failed to add Firestore achievement:", error);
      if (auth.currentUser?.uid === user.uid)
        setStorageError("تعذّر حفظ الإنجاز. تحققي من الاتصال وحاولي مجددًا.");
      return false;
    }
  }

  function resetDemo() {
    if (!clearStore()) {
      setStorageError(failMessage);

      return false;
    }

    setOpportunities(initialOpportunities);

    // Reset local demo data only; never delete the Firestore profile.

    // Cloud works are not erased by resetting local demo data.

    // Keep Firestore enrollments intact when resetting local demo data.

    setStorageError("");

    return true;
  }

  return (
    <Context.Provider
      value={{
        adminDemo,
        startAdminDemo: () => setAdminDemo(true),
        endAdminDemo: () => setAdminDemo(false),
        session,

        signIn,

        signUp,

        signOutUser,

        opportunities,

        saveOpportunity,

        deleteOpportunity,

        profile,

        profileLoading,

        saveProfile,

        works,

        worksLoading,

        saveWork,

        deleteWork,

        enrollments,

        enrollmentsLoading,

        enroll,

        updateProgress,

        addAchievement,

        resetDemo,

        storageError,

        clearStorageError: () => setStorageError(""),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDemo() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("DemoProvider is required");
  }

  return context;
}
