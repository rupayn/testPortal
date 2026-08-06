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
 * `tsconfigRootDir` is always resolved relative to that app — not to
 * `process.cwd()`, which changes depending on where the lint command is
 * invoked from (e.g. monorepo root vs. the app folder) and would otherwise
 * cause `tsconfig.eslint.json` to fail to resolve.
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
        // Required for type-aware rules (strictTypeChecked / stylisticTypeChecked).
        // defaultProject points at a package-local tsconfig.eslint.json, which
        // extends the package's real tsconfig.json but widens `include` to
        // also cover files outside `src` (e.g. `test`) that the build
        // tsconfig deliberately excludes from `dist`. Each consuming package
        // must add its own tsconfig.eslint.json:
        //   { "extends": "./tsconfig.json", "include": ["src", "test"], "exclude": ["node_modules", "dist"] }
        // allowDefaultProject covers any remaining stray root-level config
        // files (e.g. tailwind.config.js) that aren't part of that project either.
        //
        // NOTE: allowDefaultProject only accepts shallow globs (no `**`),
        // so it must never be used for whole source/test directories.
        // Files under src/ and test/ are picked up via each package's
        // tsconfig.eslint.json `include` instead (which recurses into
        // nested folders automatically).
        projectService: {
          allowDefaultProject: [
            "*.config.js",
            "*.config.mjs",
            "*.config.cjs",
            "*.config.ts",
            "*.config.mts",
            "*.config.cts",
          ],
          defaultProject: "tsconfig.eslint.json",
        },
        // Resolved relative to the calling app's own directory, passed in
        // by that app's eslint.config.mjs — NOT process.cwd(), which is
        // unreliable in a monorepo (depends on where the lint command runs).
        tsconfigRootDir,
      },
    },
  },

  // Config files aren't part of the app's TS project and don't need
  // type-aware linting — plain JS/TS rules are enough for them.
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

  eslintConfigPrettier,
];

export default config;
