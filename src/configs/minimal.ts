import type { Linter } from 'eslint';

import { base } from './base';
import { minimalRules } from './rules';

export const minimal: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/minimal',
  rules: minimalRules,
};
