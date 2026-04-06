import type { Linter } from 'eslint';

import { base, plugin } from './base';
import { recommendedRules } from './rules';

/** Recommended preset — balanced rule set for most projects. */
export const recommended: Linter.Config = {
  ...base,
  name: '@poupe/eslint-plugin-tailwindcss/recommended',
  rules: recommendedRules,
};

plugin.configs.recommended = recommended;
