import type { ESLint, Linter } from 'eslint';

export const minimal: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss/minimal',
  plugins: {
    tailwindcss: {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss/valid-apply-directive': 'error',
    'tailwindcss/valid-modifier-syntax': 'error',
    'tailwindcss/valid-theme-function': 'error',
    // Other rules are off by default in minimal config
    'tailwindcss/consistent-spacing': 'off',
    'tailwindcss/no-arbitrary-value-overuse': 'off',
    'tailwindcss/no-conflicting-utilities': 'off',
    'tailwindcss/prefer-theme-tokens': 'off',
  },
};
