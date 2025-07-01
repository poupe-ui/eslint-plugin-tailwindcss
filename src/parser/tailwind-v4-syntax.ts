import type { SyntaxConfig } from '../utils/types';

import { IMPORT_AT_RULE_DEFINITION, TAILWIND_AT_RULE_DEFINITIONS } from '../utils/at-rules';

/**
 * Extended Tailwind CSS v4 syntax for `@eslint/css`
 *
 * Tailwind CSS v4 allows arbitrary variants to be created freely.
 * This syntax definition supports:
 * - All built-in variants (hover:, focus:, dark:, sm:, etc.)
 * - Arbitrary variants using square brackets [&:nth-child(3)]:
 * - Stacked variants (dark:hover:focus:)
 * - Custom variants created with `@custom-variant`
 * - All Tailwind directives (`@theme`, `@source`, `@utility`, etc.)
 */

/**
 * Partial SyntaxConfig for Tailwind CSS v4
 * Only defining the atrules property that `@eslint/css` uses
 */
export const tailwindV4Syntax: Partial<SyntaxConfig> = {
  atrules: {
    // Standard CSS @import with Tailwind extension
    import: IMPORT_AT_RULE_DEFINITION,
    // Include all Tailwind-specific at-rules
    ...TAILWIND_AT_RULE_DEFINITIONS,
  },
  // The properties option doesn't need to duplicate @apply
  // since it's already defined in atrules
};
