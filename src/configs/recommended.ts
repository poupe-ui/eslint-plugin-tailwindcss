import type { Linter, ESLint } from 'eslint';

export const recommended: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss-v4/recommended',
  plugins: {
    'tailwindcss-v4': {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss-v4/valid-theme-function': 'error',
    'tailwindcss-v4/no-arbitrary-value-overuse': ['warn', {
      maxPerFile: 10,
      maxPerRule: 3,
    }],
    'tailwindcss-v4/prefer-theme-tokens': ['warn', {
      categories: ['colors', 'spacing'],
    }],
    'tailwindcss-v4/valid-modifier-syntax': 'error',
    'tailwindcss-v4/no-conflicting-utilities': 'error',
    'tailwindcss-v4/valid-apply-directive': ['error', {
      maxUtilities: 20,
    }],
  },
};
