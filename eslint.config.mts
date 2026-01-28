import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { 
      js,
    }, 
    extends: [
      "js/recommended",
    ], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Project-specific rules & overrides
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Next.js uses automatic JSX runtime; don't require React in scope
      'react/react-in-jsx-scope': 'off',
    },
  },
  // Relax rules specifically for test files
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
    },
  },
  globalIgnores([
    "node_modules/*",
    ".next/*",
    "/.next/",
    ".vscode/*",
    ".swc/*",
    ".github/*",
    "coverage/*",
    "public/*",
    "*.config.js"
  ])
]);
