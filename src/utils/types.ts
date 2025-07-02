/**
 * Re-export types from `@eslint/css-tree` for consistent usage
 * This provides a single source of truth for external type dependencies
 */

import type { SyntaxConfig } from '@eslint/css-tree';

// Derive AtRuleSyntax from SyntaxConfig's atrules property
export type AtRuleSyntax = NonNullable<SyntaxConfig['atrules']>[string];

export { type SyntaxConfig } from '@eslint/css-tree';

/**
 * Represents a string value with its distance score
 * Used for similarity calculations
 */
export interface StringWithDistance {
  value: string
  distance: number
}
