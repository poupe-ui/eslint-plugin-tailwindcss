import type { Linter } from 'eslint';

import { base, plugin } from './base';
import { strictRules } from './rules';

/** Strict preset — all rules enabled with strict settings. */
export const strict: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/strict',
  rules: strictRules,
};

plugin.configs.strict = strict;
