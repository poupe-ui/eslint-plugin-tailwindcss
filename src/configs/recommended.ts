import type { ESLint, Linter } from 'eslint';

export const recommended: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss/recommended',
  plugins: {
    tailwindcss: {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss/no-duplicate-imports': 'error',
    'tailwindcss/no-empty-blocks': 'error',
    'tailwindcss/no-important': 'warn',
    'tailwindcss/no-invalid-at-rules': 'error',
    'tailwindcss/no-invalid-named-grid-areas': 'error',
    'tailwindcss/no-invalid-properties': 'error',
    'tailwindcss/no-arbitrary-value-overuse': ['warn', {
      maxPerFile: 10,
      maxPerRule: 3,
    }],
    'tailwindcss/no-conflicting-utilities': 'error',
    'tailwindcss/prefer-theme-tokens': ['warn', {
      categories: ['colors', 'spacing'],
    }],
    'tailwindcss/require-reference-in-vue': 'error',
    'tailwindcss/use-baseline': 'error',
    'tailwindcss/valid-apply-directive': ['error', {
      maxUtilities: 20,
    }],
    'tailwindcss/valid-modifier-syntax': 'error',
    'tailwindcss/valid-theme-function': 'error',
  },
};
