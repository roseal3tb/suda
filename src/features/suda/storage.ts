/** Browser-only Sprint 1 demo storage. No credentials or server-side authentication. */
const NS = "suda:v2:";
export const STORE_KEYS = {
  session: "session",
  opportunities: "admin:opportunities",
} as const;
export const INTRO_KEY = "suda:intro-seen:first-stitch-v2";
export type UserStorePart = "profile" | "portfolio" | "enrollments";
export function userStoreKey(email: string, part: UserStorePart): string {
  // The key is scoped to a fictional demo email, not a security boundary.
  return `user:${encodeURIComponent(email.trim().toLowerCase())}:${part}`;
}
export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
export function writeStore(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function clearStore(): boolean {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(NS) && key !== NS + STORE_KEYS.session)
        keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}
