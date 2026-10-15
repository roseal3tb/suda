import { describe, it, expect, beforeEach } from "vitest";
import {
  initialOpportunities,
  isValidZoomUrl,
  isValidExternalUrl,
  enrollCourse,
  canAccessZoom,
} from "@/features/suda/mock-data";
import { designers } from "@/features/suda/designers";
import {
  clearStore,
  readStore,
  userStoreKey,
  writeStore,
  STORE_KEYS,
} from "@/features/suda/storage";
describe("SUDA Sprint 1 extensions", () => {
  beforeEach(() => localStorage.clear());
  it("isolates profile, portfolio and progress for different demo emails", () => {
    const alice = userStoreKey("Alice@demo.test", "profile");
    const bob = userStoreKey("bob@demo.test", "profile");
    expect(alice).not.toEqual(bob);
    expect(writeStore(alice, { name: "أ" })).toBe(true);
    expect(readStore(alice, null)).toEqual({ name: "أ" });
    expect(readStore(bob, null)).toBeNull();
  });
  it("clears demo data but retains demo session on reset", () => {
    writeStore(STORE_KEYS.session, {
      name: "Demo",
      email: "demo@example.test",
      role: "user",
    });
    writeStore(userStoreKey("demo@example.test", "portfolio"), [{ id: "x" }]);
    writeStore(STORE_KEYS.opportunities, []);
    expect(clearStore()).toBe(true);
    expect(
      readStore(userStoreKey("demo@example.test", "portfolio"), []),
    ).toEqual([]);
    expect(readStore(STORE_KEYS.opportunities, initialOpportunities)).toEqual(
      initialOpportunities,
    );
    expect(readStore(STORE_KEYS.session, null)).toMatchObject({ role: "user" });
  });
  it("only accepts HTTPS Zoom URLs belonging to Zoom domains", () => {
    expect(isValidZoomUrl("https://us02web.zoom.us/j/123456789")).toBe(true);
    expect(isValidZoomUrl("https://zoom.us/my/teacher")).toBe(true);
    expect(isValidZoomUrl("https://zoom.us.evil.example/j/123")).toBe(false);
    expect(isValidZoomUrl("http://zoom.us/j/123")).toBe(false);
    expect(isValidZoomUrl("https://example.org/j/123")).toBe(false);
  });
  it("requires HTTPS for external organizer URLs", () => {
    expect(isValidExternalUrl("https://example.org/apply")).toBe(true);
    expect(isValidExternalUrl("javascript:alert(1)")).toBe(false);
  });
  it("does not enroll non-courses and only reveals Zoom after enrollment", () => {
    const course = initialOpportunities.find((o) => o.type === "الدورات")!;
    const job = initialOpportunities.find((o) => o.type === "الفرص الوظيفية")!;
    expect(enrollCourse([], job)).toEqual([]);
    expect(canAccessZoom([], course.id)).toBe(false);
    expect(canAccessZoom(enrollCourse([], course), course.id)).toBe(true);
  });
  it("uses the current eleven sourced text-only designers without images", () => {
    expect(designers).toHaveLength(11);
    expect(new Set(designers.map((d) => d.id)).size).toBe(11);
    expect(
      designers.every(
        (d) => d.name && d.bio && d.source?.startsWith("https://"),
      ),
    ).toBe(true);
    expect(designers.every((d) => !("image" in d))).toBe(true);
  });
});
