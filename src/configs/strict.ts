import type { ESLint, Linter } from 'eslint';

export const strict: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss/strict',
  plugins: {
    tailwindcss: {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss/consistent-spacing': 'error',
    'tailwindcss/no-duplicate-imports': 'error',
    'tailwindcss/no-empty-blocks': 'error',
    'tailwindcss/no-important': 'error',
    'tailwindcss/no-invalid-at-rules': 'error',
    'tailwindcss/no-invalid-properties': 'error',
    'tailwindcss/no-arbitrary-value-overuse': ['error', {
      maxPerFile: 5,
      maxPerRule: 1,
    }],
    'tailwindcss/no-conflicting-utilities': 'error',
    'tailwindcss/prefer-logical-properties': 'error',
    'tailwindcss/prefer-theme-tokens': ['error', {
      categories: ['colors', 'spacing', 'sizing', 'typography', 'borders', 'effects'],
    }],
    'tailwindcss/relative-font-units': 'error',
    'tailwindcss/use-baseline': ['error', {
      strictness: 'newly',
    }],
    'tailwindcss/use-layers': 'error',
    'tailwindcss/valid-apply-directive': ['error', {
      maxUtilities: 10,
      allowEmpty: false,
    }],
    'tailwindcss/valid-modifier-syntax': 'error',
    'tailwindcss/valid-theme-function': 'error',
  },
};
