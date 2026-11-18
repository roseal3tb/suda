import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { onIdTokenChanged, getIdTokenResult } from "firebase/auth";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
} from "@/lib/auth";

import {
  initialOpportunities,
  clampProgress,
  categories,
  validateOpportunity,
  isValidZoomUrl,
  isValidExternalUrl,
  savedStatuses,
  MAX_WORK_IMAGE_CHARS,
  type Opportunity,
  type Profile,
  type Work,
  type Enrollment,
  type SavedOpportunity,
  type SavedStatus,
  type PublicProfile,
} from "./mock-data";

import { readStore, STORE_KEYS, userStoreKey } from "./storage";

export interface Session {
  uid: string;
  name: string;

  email: string;

  role: "user" | "admin";
}

interface DemoState {
  authLoading: boolean;
  opportunitiesLoading: boolean;
  meetingLinksLoading: boolean;
  importOpportunities: () => Promise<boolean>;

  session: Session | null;

  // Firebase Authentication

  signIn: (email: string, password: string) => Promise<void>;

  signUp: (
    name: string,

    email: string,

    password: string,
  ) => Promise<void>;

  signOutUser: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;

  opportunities: Opportunity[];

  saveOpportunity: (item: Opportunity) => Promise<boolean>;

  deleteOpportunity: (id: string) => Promise<boolean>;

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

  saved: SavedOpportunity[];

  savedLoading: boolean;

  isSaved: (opportunityId: string) => boolean;

  toggleSaved: (opportunityId: string) => Promise<boolean>;

  setSavedStatus: (
    opportunityId: string,
    status: SavedStatus,
  ) => Promise<boolean>;

  published: boolean;

  publishLoading: boolean;

  setPublished: (published: boolean) => Promise<boolean>;

  storageError: string;

  clearStorageError: () => void;
}

const Context = createContext<DemoState | null>(null);

// Public records are whitelisted so meeting links cannot leak into public state.
function asOpportunity(value: unknown, id: string): Opportunity | null {
  if (!value || typeof value !== "object" || !id || id.includes("/"))
    return null;
  const data = value as Record<string, unknown>;
  const fields = [
    "title",
    "organization",
    "location",
    "description",
    "requirements",
    "deadline",
    "image",
  ] as const;
  if (
    fields.some((key) => typeof data[key] !== "string") ||
    !categories.includes(data["type"] as Opportunity["type"]) ||
    !["حضوري", "عن بُعد"].includes(data["mode"] as string) ||
    !["مبتدئ", "متوسط", "جميع المستويات"].includes(data["level"] as string)
  )
    return null;
  return {
    id,
    title: data["title"] as string,
    type: data["type"] as Opportunity["type"],
    organization: data["organization"] as string,
    location: data["location"] as string,
    mode: data["mode"] as Opportunity["mode"],
    level: data["level"] as Opportunity["level"],
    description: data["description"] as string,
    requirements: data["requirements"] as string,
    deadline: data["deadline"] as string,
    image: data["image"] as string,
    ...(typeof data["externalUrl"] === "string" &&
    isValidExternalUrl(data["externalUrl"])
      ? { externalUrl: data["externalUrl"] }
      : {}),
  };
}

// Portfolio images are compressed in the browser and stored inline (under 700 KB).

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

  const image = data["image"];

  return {
    id,
    title: data["title"],
    description: data["description"],
    image:
      typeof image === "string" &&
      /^data:image\/(jpeg|webp);base64,/.test(image) &&
      image.length <= MAX_WORK_IMAGE_CHARS
        ? image
        : "",
  };
}

function asSaved(value: unknown, id: string): SavedOpportunity | null {
  if (!value || typeof value !== "object" || !id || id.includes("/"))
    return null;
  const data = value as Record<string, unknown>;
  const status = data["status"];
  const savedAt = data["savedAt"];
  if (
    !savedStatuses.includes(status as SavedStatus) ||
    typeof savedAt !== "number"
  )
    return null;
  return { opportunityId: id, status: status as SavedStatus, savedAt };
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

  const [authLoading, setAuthLoading] = useState(true);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const [meetingLinksLoading, setMeetingLinksLoading] = useState(false);
  const [meetingLinksError, setMeetingLinksError] = useState(false);
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);

  const [works, setWorks] = useState<Work[]>([]);

  const [worksLoading, setWorksLoading] = useState(true);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  const [storageError, setStorageError] = useState("");

  const [saved, setSaved] = useState<SavedOpportunity[]>([]);

  const [savedLoading, setSavedLoading] = useState(true);

  const [published, setPublishedState] = useState(false);

  const [publishLoading, setPublishLoading] = useState(true);

  // Opportunity IDs with a save/unsave/status write in flight. Stops a quick
  // second click from acting on the list as it was before the first write.
  const savedBusy = useRef(new Set<string>());

  // Latest enrollments, so async handlers never build on a stale render.
  const enrollmentsRef = useRef<Enrollment[]>([]);
  useEffect(() => {
    enrollmentsRef.current = enrollments;
  }, [enrollments]);

  // All visitors observe the same cloud records. Never fall back to stale local data.
  useEffect(
    () =>
      onSnapshot(
        collection(db, "opportunities"),
        (snapshot) => {
          setOpportunities(
            snapshot.docs
              .map((entry) => asOpportunity(entry.data(), entry.id))
              .filter((item): item is Opportunity => item !== null),
          );
          setOpportunitiesLoading(false);
        },
        () => {
          setOpportunities([]);
          setOpportunitiesLoading(false);
          setStorageError(
            "تعذّر تحميل الفرص، تحققي من الاتصال ثم حدّثي الصفحة",
          );
        },
      ),
    [],
  );

  // Meeting links are fetched only for an authorized account, never from public records.
  useEffect(() => {
    let active = true;
    setMeetingLinks({});
    setMeetingLinksError(false);
    if (!session || authLoading || enrollmentsLoading) {
      setMeetingLinksLoading(false);
      return;
    }
    const uid = session.uid;
    const ids = opportunities
      .filter(
        (item) =>
          item.type === "الدورات" &&
          (session.role === "admin" ||
            enrollments.some((entry) => entry.courseId === item.id)),
      )
      .map((item) => item.id);
    setMeetingLinksLoading(ids.length > 0);
    const pending = new Set(ids);
    const unsubscribe = ids.map((id) =>
      onSnapshot(
        doc(db, "courseMeetingLinks", id),
        (snapshot) => {
          if (!active || auth.currentUser?.uid !== uid) return;
          const url = snapshot.data()?.["zoomUrl"];
          setMeetingLinks((current) => ({
            ...current,
            [id]: typeof url === "string" && isValidZoomUrl(url) ? url : "",
          }));
          pending.delete(id);
          setMeetingLinksLoading(pending.size > 0);
        },
        () => {
          if (!active || auth.currentUser?.uid !== uid) return;
          setMeetingLinks((current) => ({ ...current, [id]: "" }));
          setMeetingLinksError(true);
          setStorageError(
            "تعذّر تحميل روابط الدورات، حدّثي الصفحة للمحاولة مجددًا",
          );
          pending.delete(id);
          setMeetingLinksLoading(pending.size > 0);
        },
      ),
    );
    return () => {
      active = false;
      unsubscribe.forEach((stop) => stop());
    };
  }, [session, authLoading, opportunities, enrollments, enrollmentsLoading]);

  // Firebase is the only authority for the active session.

  useEffect(() => {
    let active = true;

    let requestId = 0;

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      const currentRequest = ++requestId;
      setMeetingLinks({});
      setAuthLoading(Boolean(user));

      if (!user) {
        setProfileLoading(false);

        setSession(null);

        setProfile(null);

        setWorks([]);

        setWorksLoading(false);

        setEnrollments([]);

        setEnrollmentsLoading(false);

        setSaved([]);

        setSavedLoading(false);

        setPublishedState(false);

        setPublishLoading(false);

        return;
      }

      const email = user.email || "";

      setSession({
        uid: user.uid,
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

      setSaved([]);

      setSavedLoading(true);

      setPublishedState(false);

      setPublishLoading(true);

      // Saved opportunities and public-profile state belong to the UID only.
      void (async () => {
        try {
          const snapshot = await getDocs(
            collection(db, "users", user.uid, "saved"),
          );
          if (
            !active ||
            currentRequest !== requestId ||
            auth.currentUser?.uid !== user.uid
          )
            return;
          setSaved(
            snapshot.docs
              .map((entry) => asSaved(entry.data(), entry.id))
              .filter((item): item is SavedOpportunity => item !== null),
          );
        } catch (error) {
          if (!active || currentRequest !== requestId) return;
          console.error("Failed to load saved opportunities:", error);
        } finally {
          if (active && currentRequest === requestId) setSavedLoading(false);
        }
      })();

      void (async () => {
        try {
          const snapshot = await getDoc(doc(db, "publicProfiles", user.uid));
          if (
            !active ||
            currentRequest !== requestId ||
            auth.currentUser?.uid !== user.uid
          )
            return;
          setPublishedState(snapshot.data()?.["published"] === true);
        } catch (error) {
          if (!active || currentRequest !== requestId) return;
          console.error("Failed to load public profile state:", error);
        } finally {
          if (active && currentRequest === requestId) setPublishLoading(false);
        }
      })();

      void getIdTokenResult(user)
        .then((result) => {
          if (
            !active ||
            currentRequest !== requestId ||
            auth.currentUser?.uid !== user.uid
          )
            return;
          setSession({
            uid: user.uid,
            name: user.displayName || "مستخدمة سُدى",
            email,
            role: result.claims["admin"] === true ? "admin" : "user",
          });
        })
        .catch(() => {
          if (active && currentRequest === requestId)
            setStorageError(
              "تعذّر التحقق من صلاحيات الحساب، سجّلي الدخول مجددًا",
            );
        })
        .finally(() => {
          if (active && currentRequest === requestId) setAuthLoading(false);
        });

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
            "تعذّر تحميل الملف المهني من Firebase، تحققي من الاتصال وحاولي مجددًا",
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
            "تعذّر تحميل معرض الأعمال من Firebase، تحققي من الاتصال وحاولي مجددًا",
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
            "تعذّر تحميل الدورات من Firebase، تحققي من الاتصال وحاولي مجددًا",
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
  }

  async function resetPassword(email: string) {
    await requestPasswordReset(email);
  }

  function publicSnapshot(
    source: Profile,
    learning: Enrollment[],
    isPublic: boolean,
  ): PublicProfile {
    return {
      name: source.name.trim().slice(0, 100),
      bio: source.bio,
      skills: source.skills.slice(0, 30),
      interests: source.interests.slice(0, 30),
      experience: source.experience,
      achievements: learning.flatMap((item) => item.achievements).slice(0, 60),
      published: isPublic,
    };
  }

  // Keeps the opt-in public page in step with the private profile.
  async function syncPublicProfile(
    uid: string,
    source: Profile | null,
    learning: Enrollment[],
    isPublic: boolean,
  ) {
    if (!source) return;
    await setDoc(
      doc(db, "publicProfiles", uid),
      publicSnapshot(source, learning, isPublic),
    );
  }

  async function setPublished(next: boolean): Promise<boolean> {
    const user = auth.currentUser;
    if (!user || !profile) {
      setStorageError("أنشئي ملفك المهني أولًا ثم شاركيه");
      return false;
    }
    try {
      await syncPublicProfile(user.uid, profile, enrollments, next);
      if (auth.currentUser?.uid !== user.uid) return false;
      setPublishedState(next);
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to update public profile:", error);
      setStorageError(
        "تعذّر تحديث مشاركة الملف، تحققي من الاتصال وحاولي مجددًا",
      );
      return false;
    }
  }

  function isSaved(opportunityId: string) {
    return saved.some((item) => item.opportunityId === opportunityId);
  }

  async function toggleSaved(opportunityId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) {
      setStorageError("سجّلي الدخول لحفظ الفرص في حسابك");
      return false;
    }
    if (!opportunityId || opportunityId.includes("/")) return false;
    if (savedBusy.current.has(opportunityId)) return false;
    savedBusy.current.add(opportunityId);
    const ref = doc(db, "users", user.uid, "saved", opportunityId);
    try {
      if (isSaved(opportunityId)) {
        await deleteDoc(ref);
        if (auth.currentUser?.uid !== user.uid) return false;
        setSaved((current) =>
          current.filter((item) => item.opportunityId !== opportunityId),
        );
      } else {
        const record: SavedOpportunity = {
          opportunityId,
          status: "محفوظة",
          savedAt: Date.now(),
        };
        await setDoc(ref, record);
        if (auth.currentUser?.uid !== user.uid) return false;
        setSaved((current) => [
          record,
          ...current.filter((item) => item.opportunityId !== opportunityId),
        ]);
      }
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to toggle saved opportunity:", error);
      setStorageError("تعذّر حفظ الفرصة، تحققي من الاتصال وحاولي مجددًا");
      return false;
    } finally {
      savedBusy.current.delete(opportunityId);
    }
  }

  async function setSavedStatus(
    opportunityId: string,
    status: SavedStatus,
  ): Promise<boolean> {
    const user = auth.currentUser;
    if (
      !user ||
      !opportunityId ||
      opportunityId.includes("/") ||
      !savedStatuses.includes(status) ||
      savedBusy.current.has(opportunityId)
    )
      return false;
    savedBusy.current.add(opportunityId);
    // Upsert: marking an unsaved opportunity as applied also saves it.
    const current = saved.find(
      (item) => item.opportunityId === opportunityId,
    ) ?? {
      opportunityId,
      status: "محفوظة" as SavedStatus,
      savedAt: Date.now(),
    };
    const record: SavedOpportunity = { ...current, status };
    try {
      await setDoc(doc(db, "users", user.uid, "saved", opportunityId), record);
      if (auth.currentUser?.uid !== user.uid) return false;
      setSaved((list) => [
        record,
        ...list.filter((item) => item.opportunityId !== opportunityId),
      ]);
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to update saved status:", error);
      setStorageError("تعذّر تحديث الحالة، تحققي من الاتصال وحاولي مجددًا");
      return false;
    } finally {
      savedBusy.current.delete(opportunityId);
    }
  }

  async function requireAdmin() {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");
    const token = await getIdTokenResult(user);
    if (token.claims["admin"] !== true || auth.currentUser?.uid !== user.uid)
      throw new Error("Admin authorization required");
    return user.uid;
  }

  async function saveOpportunity(item: Opportunity): Promise<boolean> {
    try {
      const uid = await requireAdmin();
      const publicItem = asOpportunity(item, item.id);
      if (
        !publicItem ||
        !validateOpportunity(publicItem) ||
        !publicItem.location.trim() ||
        (item.externalUrl && !isValidExternalUrl(item.externalUrl)) ||
        (item.zoomUrl && !isValidZoomUrl(item.zoomUrl))
      )
        throw new Error("Invalid opportunity");
      const batch = writeBatch(db);
      batch.set(doc(db, "opportunities", item.id), publicItem);
      const linkRef = doc(db, "courseMeetingLinks", item.id);
      if (item.type === "الدورات" && item.zoomUrl)
        batch.set(linkRef, { zoomUrl: item.zoomUrl });
      else batch.delete(linkRef);
      await batch.commit();
      if (auth.currentUser?.uid !== uid) return false;
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to save opportunity:", error);
      setStorageError(
        "تعذّر حفظ الفرصة، تحققي من صلاحية الإدارة والاتصال وحاولي مجددًا",
      );
      return false;
    }
  }

  async function deleteOpportunity(id: string): Promise<boolean> {
    try {
      const uid = await requireAdmin();
      const batch = writeBatch(db);
      batch.delete(doc(db, "opportunities", id));
      batch.delete(doc(db, "courseMeetingLinks", id));
      await batch.commit();
      if (auth.currentUser?.uid !== uid) return false;
      // Preserve users' historical learning records; removed courses are not displayed.
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      setStorageError(
        "تعذّر حذف الفرصة، تحققي من صلاحية الإدارة والاتصال وحاولي مجددًا",
      );
      return false;
    }
  }

  async function importOpportunities(): Promise<boolean> {
    try {
      await requireAdmin();
      const legacy = readStore<unknown>(
        STORE_KEYS.opportunities,
        initialOpportunities,
      );
      if (!Array.isArray(legacy))
        throw new Error("Invalid local opportunities");
      const records = legacy.map((value: Record<string, unknown>) => {
        const item = asOpportunity(
          value,
          typeof value["id"] === "string" ? value["id"] : "",
        );
        if (!item || !validateOpportunity(item))
          throw new Error("Invalid local opportunity");
        return {
          item,
          zoomUrl:
            typeof value["zoomUrl"] === "string" &&
            isValidZoomUrl(value["zoomUrl"])
              ? value["zoomUrl"]
              : "",
        };
      });
      // Create missing IDs only: an import never overwrites edits from another device.
      for (const { item, zoomUrl } of records) {
        await requireAdmin();
        await runTransaction(db, async (transaction) => {
          const ref = doc(db, "opportunities", item.id);
          if ((await transaction.get(ref)).exists()) return;
          transaction.set(ref, item);
          if (item.type === "الدورات" && zoomUrl)
            transaction.set(doc(db, "courseMeetingLinks", item.id), {
              zoomUrl,
            });
        });
      }
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Failed to import opportunities:", error);
      setStorageError(
        "تعذّر إكمال نقل الفرص، يمكنك إعادة المحاولة دون تكرار الفرص المحفوظة",
      );
      return false;
    }
  }

  async function saveProfile(next: Profile): Promise<boolean> {
    const user = auth.currentUser;

    if (!user) {
      setStorageError("سجّلي الدخول قبل حفظ الملف المهني");

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

      if (published)
        void syncPublicProfile(user.uid, next, enrollments, true).catch(
          (error) => console.error("Failed to sync public profile:", error),
        );

      return true;
    } catch (error) {
      console.error("Failed to save Firestore profile:", error);

      setStorageError(
        "تعذّر حفظ الملف المهني في Firebase، تحققي من الاتصال وحاولي مجددًا",
      );

      return false;
    }
  }

  async function saveWork(work: Work): Promise<boolean> {
    const user = auth.currentUser;

    if (!user) {
      setStorageError("سجّلي الدخول قبل حفظ العمل");

      return false;
    }

    try {
      const image =
        work.image &&
        /^data:image\/(jpeg|webp);base64,/.test(work.image) &&
        work.image.length <= MAX_WORK_IMAGE_CHARS
          ? work.image
          : "";

      await setDoc(doc(db, "users", user.uid, "works", work.id), {
        id: work.id,

        title: work.title,

        description: work.description,

        ...(image ? { image } : {}),
      });

      if (auth.currentUser?.uid !== user.uid) return false;

      const stored = { ...work, image };

      setWorks((current) =>
        current.some((item) => item.id === work.id)
          ? current.map((item) => (item.id === work.id ? stored : item))
          : [stored, ...current],
      );

      setStorageError("");

      return true;
    } catch (error) {
      console.error("Failed to save Firestore work:", error);

      setStorageError(
        "تعذّر حفظ العمل في Firebase، تحققي من الاتصال وحاولي مجددًا",
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
        "تعذّر حذف العمل من Firebase، تحققي من الاتصال وحاولي مجددًا",
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
          "تعذّر التسجيل في الدورة، تحققي من الاتصال وحاولي مجددًا",
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
        setStorageError("تعذّر حفظ التقدّم، تحققي من الاتصال وحاولي مجددًا");
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
      if (updated) {
        const addTo = (list: Enrollment[]) =>
          list.map((item) =>
            item.courseId === id
              ? { ...item, achievements: [...item.achievements, achievement] }
              : item,
          );
        const nextEnrollments = addTo(enrollmentsRef.current);
        enrollmentsRef.current = nextEnrollments;
        setEnrollments((current) => addTo(current));
        if (published)
          void syncPublicProfile(
            user.uid,
            profile,
            nextEnrollments,
            true,
          ).catch((error) =>
            console.error("Failed to sync public achievements:", error),
          );
      }
      setStorageError("");
      return updated;
    } catch (error) {
      console.error("Failed to add Firestore achievement:", error);
      if (auth.currentUser?.uid === user.uid)
        setStorageError("تعذّر حفظ الإنجاز، تحققي من الاتصال وحاولي مجددًا");
      return false;
    }
  }

  return (
    <Context.Provider
      value={{
        authLoading,
        opportunitiesLoading,
        meetingLinksLoading: meetingLinksLoading || meetingLinksError,
        importOpportunities,
        session,

        signIn,

        signUp,

        signOutUser,

        resetPassword,

        opportunities: opportunities.map((item) =>
          meetingLinks[item.id] && session && !authLoading
            ? { ...item, zoomUrl: meetingLinks[item.id]! }
            : item,
        ),

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

        saved,

        savedLoading,

        isSaved,

        toggleSaved,

        setSavedStatus,

        published,

        publishLoading,

        setPublished,

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
