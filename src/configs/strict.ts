import type { Linter, ESLint } from 'eslint';

export const strict: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss-v4/strict',
  plugins: {
    'tailwindcss-v4': {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss-v4/valid-theme-function': 'error',
    'tailwindcss-v4/no-arbitrary-value-overuse': ['error', {
      maxPerFile: 5,
      maxPerRule: 1,
    }],
    'tailwindcss-v4/prefer-theme-tokens': ['error', {
      categories: ['colors', 'spacing', 'sizing', 'typography', 'borders', 'effects'],
    }],
    'tailwindcss-v4/valid-modifier-syntax': 'error',
    'tailwindcss-v4/no-conflicting-utilities': 'error',
    'tailwindcss-v4/valid-apply-directive': ['error', {
      maxUtilities: 10,
      allowEmpty: false,
    }],
  },
};
