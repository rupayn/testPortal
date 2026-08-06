import js from "@eslint/js";
import tseslint from "typescript-eslint";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/**
 * Strict ESLint flat config for Node.js backend applications in this
 * turborepo. Goal: catch as many bugs as possible at lint time, before
 * they ever reach prod.
 *
 * Usage in a package's eslint.config.mjs:
 *   import { config } from "@repo/eslint-config/node";
 *   export default config(import.meta.dirname);
 *
 * NOTE: `config` is a function, not a flat array. It must be called with
 * the calling app's own directory (import.meta.dirname) so that
 * tsconfigRootDir is always resolved relative to that app — not to
 * process.cwd(), which changes depending on where the lint command is
 * invoked from.
 *
 * NOTE ON TYPE-AWARE LINTING: this uses the classic `parserOptions.project`
 * array (NOT `projectService`). `projectService`'s defaultProject /
 * allowDefaultProject fallback is only meant for a handful of loose files
 * (like root config files) — allowDefaultProject deliberately forbids deep
 * globs (`**`), so it can never cover an entire src/ or test/ directory.
 * The classic `project` option has no such restriction: it just needs a
 * tsconfig whose own `include` covers the files being linted.
 *
 * Each consuming package must add its own tsconfig.eslint.json:
 *   { "extends": "./tsconfig.json", "include": ["src", "test"], "exclude": ["node_modules", "dist"] }
 * This lets the real tsconfig.json stay narrow (e.g. only "src", for build
 * purposes) while tsconfig.eslint.json widens coverage to also include
 * test/ for linting.
 */
export const config = (tsconfigRootDir) => [
  // Ignore build artifacts / deps everywhere
  {
    ignores: [
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "**/*.d.ts",
      "**/generated/**",
      "eslint.config.js",
      "eslint.config.mjs",
      "eslint.config.cjs",
    ],
  },

  js.configs.recommended,

  // Type-aware strict + stylistic rule sets from typescript-eslint
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parserOptions: {
        // Classic type-aware linting: points directly at the app's
        // tsconfig.eslint.json, whose `include` covers both src/ and
        // test/. Any file not covered by this project (or by the
        // disableTypeChecked override below) will still error — that's
        // expected; add it to tsconfig.eslint.json's `include` instead.
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir,
      },
    },
  },

  {
    plugins: {
      turbo: turboPlugin,
      onlyWarn,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",

      // ---- Correctness: things that are genuine bugs in prod ----
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "no-return-await": "off", // superseded by @typescript-eslint/return-await
      "no-throw-literal": "off", // superseded by @typescript-eslint/only-throw-error
      "no-implicit-coercion": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "require-await": "off", // superseded by @typescript-eslint/require-await
      "no-unused-expressions": "off", // superseded by TS version below

      // ---- Async / Promise safety — the #1 source of silent prod bugs ----
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { arguments: false, attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/only-throw-error": "error",

      // ---- Type safety ----
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-shadow": "error",
      "no-shadow": "off",

      // ---- Style (kept as warnings so they don't block CI, only-warn
      // demotes everything not explicitly errored above anyway) ----
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },

  // Config files aren't part of the app's TS project and don't need
  // type-aware linting — plain JS/TS rules are enough for them.
  //
  // IMPORTANT: this block is placed LAST (after the unscoped rules block
  // above), because in ESLint flat config, later entries override earlier
  // ones for the same matched file. Putting this before the big rules
  // block (as it was previously) meant the unscoped block's typed rules
  // silently re-enabled themselves for *.config.ts files, since that block
  // has no `files` restriction and therefore applies to every file,
  // including config files — causing a crash on files like
  // vitest.config.ts ("rule requires type information, but don't have
  // parserOptions set to generate type information for this file").
  {
    files: [
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "**/*.config.ts",
      "**/*.config.mts",
      "**/*.config.cts",
      "eslint.config.js",
      "eslint.config.mjs",
      "eslint.config.cjs",
    ],
    ...tseslint.configs.disableTypeChecked,
  },

  eslintConfigPrettier,
];

export default config;
