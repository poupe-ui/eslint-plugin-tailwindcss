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

import { minimal, recommended, strict } from './configs';
import {
  consistentSpacing,
  noArbitraryValueOveruse,
  noConflictingUtilities,
  noDuplicateImports,
  noEmptyBlocks,
  noInvalidAtRules,
  noInvalidProperties,
  preferThemeTokens,
  validApplyDirective,
  validModifierSyntax,
  validThemeFunction,
} from './rules';

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

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  languages: {
    css: new CSSLanguage(),
  },
  rules: {
    'consistent-spacing': consistentSpacing,
    'no-arbitrary-value-overuse': noArbitraryValueOveruse,
    'no-conflicting-utilities': noConflictingUtilities,
    'no-duplicate-imports': noDuplicateImports,
    'no-empty-blocks': noEmptyBlocks,
    'no-invalid-at-rules': noInvalidAtRules,
    'no-invalid-properties': noInvalidProperties,
    'prefer-theme-tokens': preferThemeTokens,
    'valid-apply-directive': validApplyDirective,
    'valid-modifier-syntax': validModifierSyntax,
    'valid-theme-function': validThemeFunction,
  },
  configs: {
    minimal,
    recommended,
    strict,
  },
};

export default plugin;

// Re-export types that users might need

// Export our custom parser/syntax if needed
export { tailwindV4Syntax } from './parser';
export type { PluginOptions } from './types';

export type { CSSLanguageOptions } from '@eslint/css';
export { CSSSourceCode } from '@eslint/css';
