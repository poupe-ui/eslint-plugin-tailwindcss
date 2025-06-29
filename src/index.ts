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
    name: '@poupe/eslint-plugin-tailwindcss',
    version: '0.1.0',
  },
  configs: {
    minimal,
    recommended,
    strict,
  },
  rules: {
    'no-arbitrary-value-overuse': noArbitraryValueOveruse,
    'no-conflicting-utilities': noConflictingUtilities,
    'prefer-theme-tokens': preferThemeTokens,
    'valid-apply-directive': validApplyDirective,
    'valid-modifier-syntax': validModifierSyntax,
    'valid-theme-function': validThemeFunction,
  },
  processors: {},
};

export default plugin;

export type { PluginOptions } from './types';

export { tailwindV4Syntax } from './parser/tailwind-v4-syntax';
