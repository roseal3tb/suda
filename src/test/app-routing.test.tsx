import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each([
    "/",
    "/opportunities",
    "/opportunities/pattern",
    "/login",
    "/register",
    "/profile",
    "/portfolio",
    "/learning",
    "/admin",
    "/inspiration",
  ])("matches the required page %s", (path) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
