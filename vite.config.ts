// @lovable.dev/vite-tanstack-config manages the Vite and Nitro plugins.
// Do not add these plugins manually.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    // @ts-expect-error Nitro supports this option, but Lovable types do not.
    compatibilityDate: "2026-10-18",
  },
});
