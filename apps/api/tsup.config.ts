import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  clean: true,
  sourcemap: true,
  noExternal: ["@repo/db", "@repo/logger"],

  splitting: false,
  dts: false,
  minify: false,

  // Add this banner to shim `require` and dirname variables in ESM
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});
