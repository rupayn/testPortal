import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./test"),
    },
  },

  test: {
    globals: true,
    environment: "node",

    include: [
      "test/**/*.test.ts",
      "test/**/*.spec.ts",
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
    ],

    exclude: ["node_modules", "dist", ".turbo"],
    setupFiles: ["./test/unit/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
