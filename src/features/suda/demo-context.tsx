
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginUser, logoutUser, registerUser } from "@/lib/auth";

import {
  initialOpportunities,
  enrollCourse,
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
  type UserStorePart,
} from "./storage";

export interface Session {
  name: string;
  email: string;
  role: "user" | "admin";
}

interface DemoState {
  session: Session | null;

  // Firebase Authentication
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signOutUser: () => Promise<void>;

  // Temporary demo authentication
  login: (
    name: string,
    email: string,
    role: "user" | "admin",
  ) => boolean;
  logout: () => void;

  opportunities: Opportunity[];
  saveOpportunity: (item: Opportunity) => boolean;
  deleteOpportunity: (id: string) => boolean;

  profile: Profile | null;
  saveProfile: (profile: Profile) => boolean;

  works: Work[];
  saveWork: (work: Work) => boolean;
  deleteWork: (id: string) => boolean;

  enrollments: Enrollment[];
  enroll: (course: Opportunity) => boolean;
  updateProgress: (id: string, value: number) => boolean;
  addAchievement: (id: string, text: string) => boolean;

  resetDemo: () => boolean;
  storageError: string;
  clearStorageError: () => void;
}

const Context = createContext<DemoState | null>(null);

const failMessage =
  "تعذّر حفظ البيانات محليًا. قد تكون مساحة المتصفح ممتلئة؛ جرّبي صورة أصغر أو امسحي بعض بيانات العرض";

export function DemoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [storageError, setStorageError] = useState("");

  // Load opportunities from local storage
  useEffect(() => {
    setOpportunities(
      readStore<Opportunity[]>(
        STORE_KEYS.opportunities,
        initialOpportunities,
      ).map((item) => {
        const seed = initialOpportunities.find(
          (seed) => seed.id === item.id,
        );

        return seed &&
          item.image.startsWith("https://images.unsplash.com/")
          ? { ...item, image: seed.image }
          : item;
      }),
    );
  }, []);

  // Observe Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || "";

        setSession({
          name: user.displayName || "مستخدمة سُدى",
          email,
          role: "user",
        });

        loadUser(email);
      } else {
        setSession(null);
        setProfile(null);
        setWorks([]);
        setEnrollments([]);
      }
    });

    return () => unsubscribe();
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
  }

  function loadUser(email: string) {
    setProfile(
      readStore<Profile | null>(
        userStoreKey(email, "profile"),
        null,
      ),
    );

    setWorks(
      readStore<Work[]>(
        userStoreKey(email, "portfolio"),
        [],
      ),
    );

    setEnrollments(
      readStore<Enrollment[]>(
        userStoreKey(email, "enrollments"),
        [],
      ),
    );
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

  function persistUser(
    part: UserStorePart,
    value: unknown,
  ) {
    return session
      ? persist(userStoreKey(session.email, part), value)
      : false;
  }

  // Temporary demo login
  function login(
    name: string,
    email: string,
    role: "user" | "admin",
  ) {
    const next = {
      name,
      email: email.trim().toLowerCase(),
      role,
    };

    if (!persist(STORE_KEYS.session, next)) {
      return false;
    }

    setSession(next);
    loadUser(next.email);

    return true;
  }

  // Temporary demo logout
  function logout() {
    if (persist(STORE_KEYS.session, null)) {
      setSession(null);
      setProfile(null);
      setWorks([]);
      setEnrollments([]);
    }
  }

  function saveOpportunity(item: Opportunity) {
    const next = opportunities.some(
      (p) => p.id === item.id,
    )
      ? opportunities.map((p) =>
          p.id === item.id ? item : p,
        )
      : [item, ...opportunities];

    if (!persist(STORE_KEYS.opportunities, next)) {
      return false;
    }

    setOpportunities(next);
    return true;
  }

  function deleteOpportunity(id: string) {
    const next = opportunities.filter(
      (p) => p.id !== id,
    );

    if (!persist(STORE_KEYS.opportunities, next)) {
      return false;
    }

    setOpportunities(next);

    if (session) {
      const remaining = enrollments.filter(
        (e) => e.courseId !== id,
      );

      if (persistUser("enrollments", remaining)) {
        setEnrollments(remaining);
      }
    }

    return true;
  }

  function saveProfile(next: Profile) {
    if (!persistUser("profile", next)) {
      return false;
    }

    setProfile(next);
    return true;
  }

  function saveWork(work: Work) {
    const next = works.some(
      (w) => w.id === work.id,
    )
      ? works.map((w) =>
          w.id === work.id ? work : w,
        )
      : [work, ...works];

    if (!persistUser("portfolio", next)) {
      return false;
    }

    setWorks(next);
    return true;
  }

  function deleteWork(id: string) {
    const next = works.filter(
      (w) => w.id !== id,
    );

    if (!persistUser("portfolio", next)) {
      return false;
    }

    setWorks(next);
    return true;
  }

  function enroll(course: Opportunity) {
    const next = enrollCourse(enrollments, course);

    if (next === enrollments) {
      return false;
    }

    if (!persistUser("enrollments", next)) {
      return false;
    }

    setEnrollments(next);
    return true;
  }

  function updateProgress(
    id: string,
    value: number,
  ) {
    const next = enrollments.map((e) =>
      e.courseId === id
        ? {
            ...e,
            progress: clampProgress(value),
          }
        : e,
    );

    if (!persistUser("enrollments", next)) {
      return false;
    }

    setEnrollments(next);
    return true;
  }

  function addAchievement(
    id: string,
    text: string,
  ) {
    if (!text.trim()) {
      return false;
    }

    const next = enrollments.map((e) =>
      e.courseId === id
        ? {
            ...e,
            achievements: [
              ...e.achievements,
              text.trim(),
            ],
          }
        : e,
    );

    if (!persistUser("enrollments", next)) {
      return false;
    }

    setEnrollments(next);
    return true;
  }

  function resetDemo() {
    if (!clearStore()) {
      setStorageError(failMessage);
      return false;
    }

    setOpportunities(initialOpportunities);
    setProfile(null);
    setWorks([]);
    setEnrollments([]);
    setStorageError("");

    return true;
  }

  return (
    <Context.Provider
      value={{
        session,
        signIn,
        signUp,
        signOutUser,
        login,
        logout,
        opportunities,
        saveOpportunity,
        deleteOpportunity,
        profile,
        saveProfile,
        works,
        saveWork,
        deleteWork,
        enrollments,
        enroll,
        updateProgress,
        addAchievement,
        resetDemo,
        storageError,
        clearStorageError: () =>
          setStorageError(""),
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
