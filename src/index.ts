/**
 * Tailwind CSS plugin for ESLint
 */

export {
  base,
  minimal,
  minimalRules,
  recommended,
  recommendedRules,
  strict,
  strictRules,
  type TailwindcssRules,
} from './configs';

export { GLOB_CSS } from './globs';
export { tailwindV4Syntax } from './parser';
export { plugin as default } from './plugin';

export type { PluginRuleKey } from './rules';
export type { PluginOptions } from './types';
