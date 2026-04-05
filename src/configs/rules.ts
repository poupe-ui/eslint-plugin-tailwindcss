import type { Linter } from 'eslint';

import type { pluginRules } from '../rules';

type RuleEntry = Linter.RuleEntry;

/**
 * All rule keys provided by `@poupe/eslint-plugin-tailwindcss`.
 * Derived from `pluginRules` — the single source of truth.
 */
export type TailwindcssRuleKey = `tailwindcss/${keyof typeof pluginRules}`;

/**
 * Typed rule configuration for `@poupe/eslint-plugin-tailwindcss`.
 */
export type TailwindcssRules = Partial<Record<TailwindcssRuleKey, RuleEntry>>;

export const minimalRules: TailwindcssRules = {
  'tailwindcss/no-duplicate-imports': 'error',
  'tailwindcss/no-duplicate-reference': 'error',
  'tailwindcss/no-empty-blocks': 'error',
  'tailwindcss/no-important': 'error',
  'tailwindcss/no-invalid-at-rules': 'error',
  'tailwindcss/no-invalid-named-grid-areas': 'error',
  'tailwindcss/no-invalid-properties': 'error',
  'tailwindcss/require-reference-in-vue': 'error',
  'tailwindcss/use-baseline': 'error',
  'tailwindcss/valid-apply-directive': 'error',
  'tailwindcss/valid-modifier-syntax': 'error',
  'tailwindcss/valid-theme-function': 'error',
  // Other rules are off by default in minimal config
  'tailwindcss/consistent-spacing': 'off',
  'tailwindcss/no-arbitrary-value-overuse': 'off',
  'tailwindcss/no-conflicting-utilities': 'off',
  'tailwindcss/prefer-theme-tokens': 'off',
};

export const recommendedRules: TailwindcssRules = {
  'tailwindcss/no-duplicate-imports': 'error',
  'tailwindcss/no-duplicate-reference': 'error',
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
};

export const strictRules: TailwindcssRules = {
  'tailwindcss/consistent-spacing': 'error',
  'tailwindcss/no-duplicate-imports': 'error',
  'tailwindcss/no-duplicate-reference': 'error',
  'tailwindcss/no-empty-blocks': 'error',
  'tailwindcss/no-important': 'error',
  'tailwindcss/no-invalid-at-rules': 'error',
  'tailwindcss/no-invalid-named-grid-areas': 'error',
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
  'tailwindcss/require-reference-in-vue': 'error',
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
};
