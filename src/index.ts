import type { ESLint } from 'eslint';

const plugin: ESLint.Plugin = {
  meta: {
    name: '@poupe/eslint-plugin-tailwindcss-v4',
    version: '0.1.0',
  },
  configs: {},
  rules: {},
  processors: {},
};

export default plugin;

export { tailwindV4Syntax } from './parser/tailwind-v4-syntax';
