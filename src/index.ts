/**
 * Tailwind CSS plugin for ESLint
 */

// ------------------------------------------------------------------------------
// Imports
// ------------------------------------------------------------------------------

import { CSSLanguage } from '@eslint/css';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Plugin } from './types';
import {
  base,
  minimal,
  recommended,
  strict,
} from './configs';
import { pluginRules } from './rules';

// ------------------------------------------------------------------------------
// Package Info
// ------------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
);

// ------------------------------------------------------------------------------
// Plugin
// ------------------------------------------------------------------------------

const plugin: Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  languages: {
    css: new CSSLanguage(),
  },
  rules: pluginRules,
  configs: {
    base,
    minimal,
    recommended,
    strict,
  },
};

// Self-reference: all configs share base.plugins via spread
base.plugins!.tailwindcss = plugin;

export default plugin;

export {
  minimalRules,
  recommendedRules,
  strictRules,
  type TailwindcssRules,
} from './configs';

export { GLOB_CSS } from './globs';
export { tailwindV4Syntax } from './parser';

export type { PluginRuleKey } from './rules';
export type { PluginOptions } from './types';
