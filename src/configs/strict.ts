import type { Linter } from 'eslint';

import { base } from './base';
import { strictRules } from './rules';

export const strict: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/strict',
  rules: strictRules,
};
