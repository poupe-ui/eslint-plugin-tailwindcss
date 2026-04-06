import type { Linter } from 'eslint';

import { GLOB_CSS } from '../globs';
import { tailwindV4Syntax } from '../parser/tailwind-v4-syntax';
import { plugin } from '../plugin';

/**
 * Base config — setup-only (no rules).
 *
 * Includes file globs, `tailwindcss/css` language, tolerant parsing,
 * and Tailwind v4 syntax with the plugin self-reference.
 */
export const base: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss/base',
  files: [GLOB_CSS],
  language: 'tailwindcss/css',
  languageOptions: {
    tolerant: true,
    customSyntax: tailwindV4Syntax,
  } as Linter.Config['languageOptions'],
  plugins: {
    tailwindcss: plugin,
  },
};

plugin.configs.base = base;

export { plugin } from '../plugin';
