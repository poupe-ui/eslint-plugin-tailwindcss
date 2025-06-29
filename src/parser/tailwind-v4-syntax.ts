/**
 * Extended Tailwind CSS v4 syntax for \@eslint/css
 *
 * Tailwind CSS v4 allows arbitrary variants to be created freely.
 * This syntax definition supports:
 * - All built-in variants (hover:, focus:, dark:, sm:, etc.)
 * - Arbitrary variants using square brackets [&:nth-child(3)]:
 * - Stacked variants (dark:hover:focus:)
 * - Custom variants created with \@custom-variant
 * - All Tailwind directives (\@theme, \@source, \@utility, etc.)
 */
export const tailwindV4Syntax = {
  atrules: {
    // @apply with support for any Tailwind utility including arbitrary variants
    'apply': {
      // Use <custom-ident>+ which allows any identifier including those with special chars
      prelude: '<custom-ident>+',
    },
    // @import for CSS files and Tailwind itself
    'import': {
      prelude: '<string> | <url> | "tailwindcss"',
    },
    // @theme for defining design tokens
    'theme': {
      prelude: undefined,
      descriptors: {
        // CSS custom properties for design tokens
        '--*': '<any-value>',
      },
    },
    // @source for explicit source file specification
    'source': {
      prelude: '<string>',
    },
    // @utility for custom utilities
    'utility': {
      prelude: '<custom-ident>',
      descriptors: {
        // Any CSS property
        '*': '<any-value>',
      },
    },
    // @variant for applying variants in CSS
    'variant': {
      prelude: '<custom-ident>',
    },
    // @custom-variant for creating new variants
    'custom-variant': {
      prelude: '<custom-ident>',
    },
    // @reference for importing without duplication
    'reference': {
      prelude: '<string> | <url>',
    },
    // Legacy compatibility directives
    'config': {
      prelude: '<string>',
    },
    'plugin': {
      prelude: '<string>',
    },
    // @layer directive (still supported)
    'layer': {
      prelude: 'base | components | utilities | <custom-ident>',
    },
    // @tailwind directive (legacy from v3)
    'tailwind': {
      prelude: 'base | components | utilities | variants',
    },
  },
  // The properties option doesn't need to duplicate @apply
  // since it's already defined in atrules
};
