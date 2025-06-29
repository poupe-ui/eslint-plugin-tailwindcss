import type { Linter, ESLint } from 'eslint';

export const minimal: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss-v4/minimal',
  plugins: {
    'tailwindcss-v4': {
      // Plugin will be loaded by the user
    } as unknown as ESLint.Plugin,
  },
  rules: {
    'tailwindcss-v4/valid-theme-function': 'error',
    'tailwindcss-v4/valid-modifier-syntax': 'error',
    'tailwindcss-v4/valid-apply-directive': 'error',
    // Other rules are off by default in minimal config
    'tailwindcss-v4/no-arbitrary-value-overuse': 'off',
    'tailwindcss-v4/prefer-theme-tokens': 'off',
    'tailwindcss-v4/no-conflicting-utilities': 'off',
  },
};
