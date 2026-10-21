import { vi } from "vitest";

// An in-memory SDK boundary: tests never connect to a live Firebase project.
const cloud = vi.hoisted(() => ({
  auth: {
    currentUser: null as null | {
      uid: string;
      email: string;
      displayName: string;
    },
  },
  listeners: new Set<(user: unknown) => void>(),
  records: new Map<string, Record<string, unknown>>(),
  failure: false,
  signInFailure: false,
}));

export function signedIn(uid = "designer-a") {
  cloud.auth.currentUser = {
    uid,
    email: `${uid}@example.test`,
    displayName: "مصممة اختبار",
  };
}

export function resetCloud() {
  cloud.auth.currentUser = null;
  cloud.listeners.clear();
  cloud.records.clear();
  cloud.failure = false;
  cloud.signInFailure = false;
}

vi.mock("@/lib/firebase", () => ({ auth: cloud.auth, db: {} }));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: unknown) => void) => {
    cloud.listeners.add(callback);
    callback(cloud.auth.currentUser);
    return () => cloud.listeners.delete(callback);
  },
  signInWithEmailAndPassword: async (_auth: unknown, email: string) => {
    if (cloud.signInFailure) throw { code: "auth/invalid-credential" };
    cloud.auth.currentUser = {
      uid: "designer-a",
      email,
      displayName: "مصممة اختبار",
    };
    cloud.listeners.forEach((callback) => callback(cloud.auth.currentUser));
    return { user: cloud.auth.currentUser };
  },
  createUserWithEmailAndPassword: async (_auth: unknown, email: string) => {
    cloud.auth.currentUser = { uid: "designer-a", email, displayName: "" };
    cloud.listeners.forEach((callback) => callback(cloud.auth.currentUser));
    return { user: cloud.auth.currentUser };
  },
  updateProfile: async (
    user: { displayName: string },
    next: { displayName: string },
  ) => {
    user.displayName = next.displayName;
  },
  signOut: async () => {
    cloud.auth.currentUser = null;
    cloud.listeners.forEach((callback) => callback(null));
  },
}));

vi.mock("firebase/firestore", () => {
  const snapshot = (path: string) => ({
    id: path.split("/").at(-1),
    exists: () => cloud.records.has(path),
    data: () => cloud.records.get(path),
  });
  const check = () => {
    if (cloud.failure) throw new Error("Simulated write failure");
  };
  return {
    doc: (parent: unknown, ...parts: string[]) =>
      typeof parent === "string"
        ? [parent, ...parts].join("/")
        : parts.join("/"),
    collection: (_db: unknown, ...parts: string[]) => parts.join("/"),
    getDoc: async (path: string) => snapshot(path),
    getDocs: async (path: string) => ({
      docs: [...cloud.records.keys()]
        .filter(
          (key) =>
            key.startsWith(path + "/") &&
            key.split("/").length === path.split("/").length + 1,
        )
        .map(snapshot),
    }),
    setDoc: async (
      path: string,
      value: Record<string, unknown>,
      options?: { merge: boolean },
    ) => {
      check();
      cloud.records.set(
        path,
        options?.merge ? { ...cloud.records.get(path), ...value } : value,
      );
    },
    deleteDoc: async (path: string) => {
      check();
      cloud.records.delete(path);
    },
    runTransaction: async (
      _db: unknown,
      run: (transaction: unknown) => Promise<unknown>,
    ) => {
      check();
      return run({
        get: async (path: string) => snapshot(path),
        set: (path: string, value: Record<string, unknown>) =>
          cloud.records.set(path, value),
        update: (path: string, value: Record<string, unknown>) =>
          cloud.records.set(path, { ...cloud.records.get(path), ...value }),
      });
    },
  };
});

export { cloud };
