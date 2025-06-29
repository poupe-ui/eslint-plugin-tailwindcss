import type { Rule } from 'eslint';
import type { CSSSourceCode } from '@eslint/css';

/**
 * Rule context type for CSS rules
 */
export type CSSRuleContext = Rule.RuleContext & {
  sourceCode: CSSSourceCode
};

/**
 * CSS rule module type
 */
export interface CSSRuleModule extends Rule.RuleModule {
  create(context: CSSRuleContext): Rule.RuleListener
}

/**
 * Plugin configuration options
 */
export interface PluginOptions {
  /**
   * Whether to enforce theme token usage
   */
  enforceThemeTokens?: boolean

  /**
   * Maximum number of arbitrary values allowed per file
   */
  maxArbitraryValues?: number

  /**
   * Whether to check for conflicting utilities
   */
  checkConflicts?: boolean

  /**
   * Custom theme categories
   */
  customThemeCategories?: Record<string, string[]>
}
