import { tailwind4 } from 'tailwind-csstree';

// tailwind-csstree 0.3.0 provides tailwind4 as a SyntaxExtensionCallback.
// Derive type from value to sidestep the @eslint/css vs @eslint/css-tree
// callback signature mismatch.
type SyntaxExtensionCallback = typeof tailwind4;

/**
 * Tailwind CSS v4 syntax extension for `@eslint/css`.
 *
 * Wraps `tailwind-csstree`'s `tailwind4` callback (custom parsers for
 * `@apply`/`@import`, Tailwind type definitions, `theme()` scope,
 * wildcard custom property nodes) and adds `@tailwind` for v3 legacy
 * compatibility.
 */
export const tailwindV4Syntax: SyntaxExtensionCallback = (previous, assign) => {
  const tw = tailwind4(previous, assign);
  return {
    ...tw,
    atrules: {
      ...tw.atrules,
      tailwind: {
        prelude: 'base | components | utilities | variants',
      },
    },
  };
};
