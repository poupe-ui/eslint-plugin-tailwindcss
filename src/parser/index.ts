/**
 * Parser module exports
 * Re-exports the Tailwind v4 syntax for ESLint CSS
 */

// Re-export CSS context utilities
export {
  type CSSContextInfo,
  type CSSRuleContext,
  getCSSContext,
  isCSSContext,
} from '../utils/ast';

export { tailwindV4Syntax } from './tailwind-v4-syntax';

// Re-export CSS types
export { type CSSLanguageOptions, CSSSourceCode } from '@eslint/css';
