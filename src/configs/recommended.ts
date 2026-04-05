import type { Linter } from 'eslint';

import { base } from './base';
import { recommendedRules } from './rules';

export const recommended: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/recommended',
  rules: recommendedRules,
};
