import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    include: [
      "test/**",
      "test/**/*.test.ts",
      "test/**/*.spec.ts",
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
    ],

    exclude: ["node_modules", "dist", ".turbo"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
