import type { ESLint } from 'eslint';

import {
  validThemeFunction,
  noArbitraryValueOveruse,
  preferThemeTokens,
  validModifierSyntax,
  noConflictingUtilities,
  validApplyDirective,
} from './rules';
import { recommended, strict, minimal } from './configs';

const plugin: ESLint.Plugin = {
  meta: {
    name: '@poupe/eslint-plugin-tailwindcss-v4',
    version: '0.1.0',
  },
  configs: {
    recommended,
    strict,
    minimal,
  },
  rules: {
    'valid-theme-function': validThemeFunction,
    'no-arbitrary-value-overuse': noArbitraryValueOveruse,
    'prefer-theme-tokens': preferThemeTokens,
    'valid-modifier-syntax': validModifierSyntax,
    'no-conflicting-utilities': noConflictingUtilities,
    'valid-apply-directive': validApplyDirective,
  },
  processors: {},
};

export default plugin;

export type { PluginOptions } from './types';

export { tailwindV4Syntax } from './parser/tailwind-v4-syntax';
