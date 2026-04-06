import type { RuleDefinition } from '@eslint/core';

import css from '@eslint/css';

/**
 * Re-export `@eslint/css` rules with explicit `RuleDefinition` type.
 * Prevents TS2742 declaration portability issues when wrapper rules
 * are re-exported from the plugin.
 */
export const cssRules: Record<string, RuleDefinition> = css.rules;
