import type { Linter } from 'eslint';

import { base, plugin } from './base';
import { minimalRules } from './rules';

/** Minimal preset — essential error-prevention rules only. */
export const minimal: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/minimal',
  rules: minimalRules,
};

plugin.configs.minimal = minimal;
