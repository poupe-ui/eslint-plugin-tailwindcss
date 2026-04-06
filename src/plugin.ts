/**
 * Plugin object for `@poupe/eslint-plugin-tailwindcss`.
 */

import { CSSLanguage } from '@eslint/css';

import type { Plugin } from './types';
import pkg from '../package.json' with { type: 'json' };
import { pluginRules } from './rules';

/** `@poupe/eslint-plugin-tailwindcss` plugin instance. */
export const plugin: Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  languages: {
    css: new CSSLanguage(),
  },
  rules: pluginRules,
  configs: {},
};
