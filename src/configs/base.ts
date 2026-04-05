import type { Linter } from 'eslint';

import { GLOB_CSS } from '../globs';
import { tailwindV4Syntax } from '../parser/tailwind-v4-syntax';

export const base: Linter.Config = {
  name: '@poupe/eslint-plugin-tailwindcss/base',
  files: [GLOB_CSS],
  language: 'tailwindcss/css',
  languageOptions: {
    tolerant: true,
    customSyntax: tailwindV4Syntax,
  } as Linter.Config['languageOptions'],
  plugins: {},
};
