// HTTP/SSR checks, not browser-rendered or end-to-end tests.
import { createServer } from "vite";
import { writeFile } from "node:fs/promises";
const server = await createServer({
  server: { host: "127.0.0.1", port: 5199, strictPort: true },
});
const base = "http://127.0.0.1:5199";
const paths = [
  "/",
  "/opportunities",
  ...[
    "pattern",
    "heritage",
    "atelier",
    "designer",
    "draping",
    "textile",
    "studio",
    "pattern-career",
  ].map((id) => "/opportunities/" + id),
  "/login",
  "/register",
  "/profile",
  "/portfolio",
  "/learning",
  "/admin",
  "/inspiration",
];
const results = [];
const media = new Set();
try {
  await server.listen();
  for (const path of paths) {
    const response = await fetch(base + path);
    const html = await response.text();
    const entry = {
      path,
      status: response.status,
      rtl: html.includes('dir="rtl"'),
      arabic: html.includes('lang="ar"'),
    };
    if (response.status !== 200 || !entry.rtl || !entry.arabic)
      throw Error(JSON.stringify(entry));
    if (path === "/") {
      for (const css of [
        "profile-fashion-triptych",
        "inspiration-fashion-collage",
      ])
        if (!html.includes(css)) throw Error("Missing " + css);
      if (html.includes("تشغيل الفيلم")) throw Error("Old film control in SSR");
    }
    if (path === "/login" && !html.includes("editorial_teal_gown.webp"))
      throw Error("Login image not updated");
    if (path === "/register" && !html.includes("editorial_couture_duo.webp"))
      throw Error("Registration image not updated");
    for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g))
      if (m[1].startsWith("/")) media.add(m[1]);
    results.push(entry);
  }
  for (const path of [
    "/editorial/motion/hero_atelier_montage.mp4",
    "/editorial/motion/hero_atelier_montage.webm",
  ])
    media.add(path);
  const assets = [];
  for (const path of media) {
    const r = await fetch(base + path);
    if (r.status !== 200) throw Error("Missing asset " + path);
    assets.push({
      path,
      status: r.status,
      type: r.headers.get("content-type"),
    });
    await r.arrayBuffer();
  }
  const missing = await fetch(base + "/route-does-not-exist");
  if (missing.status !== 404) throw Error("404 regression");
  await writeFile(
    "docs/qa/visual-refresh-http.json",
    JSON.stringify(
      {
        routes: results,
        assets,
        unknownRouteStatus: missing.status,
        browserRendered: false,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      routes: results.length,
      assets: assets.length,
      passed: true,
    }),
  );
} finally {
  await server.close();
}
