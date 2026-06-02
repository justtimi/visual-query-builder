import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    alias: {
      // Fixes Next.js path aliases (e.g., @/components)
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
