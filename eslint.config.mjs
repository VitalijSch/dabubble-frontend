import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const NEXT_BUILD_OUTPUT = [".next/**", "out/**", "build/**", "next-env.d.ts"];
const TEST_REPORTS = ["coverage/**", "playwright-report/**", "test-results/**"];
const prettierMustComeLast = prettier;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([...NEXT_BUILD_OUTPUT, ...TEST_REPORTS]),
  prettierMustComeLast,
]);

export default eslintConfig;
