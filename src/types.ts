/**
 * Type definitions for `@poupe/eslint-plugin-tailwindcss`
 */

// ------------------------------------------------------------------------------
// Imports
// ------------------------------------------------------------------------------

import type { RuleDefinition, RuleVisitor } from '@eslint/core';
import type { CSSLanguageOptions, CSSSourceCode } from '@eslint/css';
import type { CssNodeNames, CssNodePlain } from '@eslint/css-tree';

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/** Adds matching `:exit` selectors for all properties of a `RuleVisitor`. */
type WithExit<RuleVisitorType extends RuleVisitor> = {
  [Key in keyof RuleVisitorType as
  Key |
  `${Key & string}:exit`]: RuleVisitorType[Key];
};

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------

/**
 * A CSS syntax element, including nodes and comments.
 */
export type CSSSyntaxElement = CssNodePlain;

type CSSNodeVisitor = {
  [Type in CssNodeNames]: (
    node: Extract<CssNodePlain, { type: Type }>,
  ) => void;
};

/**
 * A visitor for CSS nodes.
 */
export interface CSSRuleVisitor
  extends RuleVisitor,
  Partial<WithExit<CSSNodeVisitor>> {}

export type CSSRuleDefinitionTypeOptions = {
  RuleOptions: unknown[]
  MessageIds: string
  ExtRuleDocs: Record<string, unknown>
};

/**
 * A rule definition for CSS.
 */
export type CSSRuleDefinition<
  Options extends Partial<CSSRuleDefinitionTypeOptions> = object,
> = RuleDefinition<
  // Language specific type options (non-configurable)
  {
    LangOptions: CSSLanguageOptions
    Code: CSSSourceCode
    Visitor: CSSRuleVisitor
    Node: CssNodePlain
  } & Required<
    // Rule specific type options (custom)
    Options &
      // Rule specific type options (defaults)
    Omit<CSSRuleDefinitionTypeOptions, keyof Options>
  >
>;

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
