import type { SyntaxConfig } from '@eslint/css-tree';

import defaultSyntax from '@eslint/css-tree/definition-syntax-data';
import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

import plugin from '../../index';
import { tailwindV4Syntax } from '../../parser/tailwind-v4-syntax';

// ---------------------------------------------------------------------------
// Unit tests — callback structure
// ---------------------------------------------------------------------------

describe('tailwindV4Syntax callback', () => {
  // Build a minimal SyntaxConfig so we can call the callback outside ESLint.
  const previous: SyntaxConfig = {
    generic: false,
    units: {},
    types: defaultSyntax.types ?? {},
    properties: defaultSyntax.properties ?? {},
    atrules: defaultSyntax.atrules ?? {},
    atrule: {},
    node: {},
    pseudo: {},
    scope: {},
    features: {},
    parseContext: {} as SyntaxConfig['parseContext'],
    tokenize: (() => {}) as unknown as SyntaxConfig['tokenize'],
  };

  const result = tailwindV4Syntax(previous, Object.assign);

  it('is a function', () => {
    expect(typeof tailwindV4Syntax).toBe('function');
  });

  it('returns an object', () => {
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  // tailwind-csstree at-rules
  const tailwindCsstreeAtrules = [
    'apply',
    'config',
    'custom-variant',
    'import',
    'plugin',
    'reference',
    'slot',
    'source',
    'theme',
    'utility',
    'variant',
  ];

  for (const name of tailwindCsstreeAtrules) {
    it(`defines @${name} at-rule (from tailwind-csstree)`, () => {
      expect(result.atrules).toHaveProperty(name);
    });
  }

  // our addition: @tailwind
  it('defines @tailwind at-rule (plugin addition)', () => {
    expect(result.atrules).toHaveProperty('tailwind');
    expect(result.atrules.tailwind).toEqual({
      prelude: 'base | components | utilities | variants',
    });
  });

  // custom parsers from tailwind-csstree
  it('includes custom @apply parser', () => {
    expect(result.atrule).toHaveProperty('apply');
  });

  it('includes custom @import parser', () => {
    expect(result.atrule).toHaveProperty('import');
  });

  // types from tailwind-csstree
  it('includes Tailwind type definitions', () => {
    expect(result.types).toHaveProperty('tw-alpha');
    expect(result.types).toHaveProperty('tw-spacing');
  });

  // scope from tailwind-csstree (theme() support)
  it('includes theme() scope', () => {
    expect(result.scope?.Value).toHaveProperty('theme');
  });
});

// ---------------------------------------------------------------------------
// Integration tests — Linter.verify() with the plugin
// ---------------------------------------------------------------------------

const pluginConfig = {
  language: 'tailwindcss/css' as const,
  languageOptions: {
    tolerant: true,
    customSyntax: tailwindV4Syntax,
  },
  plugins: {
    tailwindcss: plugin,
  },
};

function verifyCSS(code: string) {
  const linter = new Linter();
  return linter.verify(code, pluginConfig);
}

function expectNoFatalError(code: string) {
  const messages = verifyCSS(code);
  const fatal = messages.filter((m) => m.fatal);
  expect(fatal).toHaveLength(0);
}

describe('tailwindV4Syntax integration', () => {
  describe('standard CSS still parses', () => {
    const cases = [
      { name: 'basic rule', code: '.foo { color: red; }' },
      { name: '@media query', code: '@media (min-width: 768px) { .foo { display: flex; } }' },
      { name: '@keyframes', code: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }' },
      { name: '@font-face', code: '@font-face { font-family: "Inter"; src: url("inter.woff2"); }' },
      { name: '@layer', code: '@layer utilities { .tab-4 { tab-size: 4; } }' },
      { name: '@import', code: '@import "reset.css";' },
    ];

    for (const { name, code } of cases) {
      it(name, () => expectNoFatalError(code));
    }
  });

  describe('Tailwind v4 directives', () => {
    const cases = [
      { name: '@apply', code: '.btn { @apply px-4 py-2 font-bold; }' },
      { name: '@theme block', code: '@theme { --color-primary: #3490dc; --spacing-lg: 2rem; }' },
      { name: '@source', code: '@source "./src/**/*.vue";' },
      { name: '@utility', code: '@utility tab-4 { tab-size: 4; }' },
      { name: '@variant', code: '@variant hover;' },
      { name: '@variant with block', code: '@variant hover { &:hover { @slot; } }' },
      { name: '@custom-variant', code: '@custom-variant dark { &:where([data-theme="dark"]) { @slot; } }' },
      { name: '@reference', code: '@reference "tailwindcss";' },
      { name: '@config', code: '@config "./tailwind.config.ts";' },
      { name: '@plugin', code: '@plugin "./my-plugin.js";' },
      { name: '@slot (standalone)', code: '@slot;' },
    ];

    for (const { name, code } of cases) {
      it(name, () => expectNoFatalError(code));
    }
  });

  describe('@tailwind (v3 legacy)', () => {
    const cases = [
      { name: '@tailwind base', code: '@tailwind base;' },
      { name: '@tailwind components', code: '@tailwind components;' },
      { name: '@tailwind utilities', code: '@tailwind utilities;' },
      { name: '@tailwind variants', code: '@tailwind variants;' },
    ];

    for (const { name, code } of cases) {
      it(name, () => expectNoFatalError(code));
    }
  });

  describe('Tailwind v4 functions', () => {
    const cases = [
      { name: 'theme() in value', code: '.foo { color: theme("--color-primary"); }' },
      { name: 'theme() with fallback', code: '.foo { color: theme("--color-primary", #333); }' },
      { name: '--alpha() function', code: '.foo { color: --alpha(var(--color-primary) / 50%); }' },
      { name: '--spacing() function', code: '.foo { padding: --spacing(4); }' },
    ];

    for (const { name, code } of cases) {
      it(name, () => expectNoFatalError(code));
    }
  });

  describe('Tailwind v4 custom properties', () => {
    it('wildcard custom property in @theme', () => {
      expectNoFatalError('@theme { --color-*: initial; }');
    });

    it('regular custom property in @theme', () => {
      expectNoFatalError('@theme { --font-sans: "Inter", sans-serif; }');
    });
  });

  describe('complex Tailwind CSS files', () => {
    it('full config-like file', () => {
      expectNoFatalError(`
        @import "tailwindcss";
        @reference "../../app.css";

        @theme {
          --color-primary: #3490dc;
          --color-secondary: #ffed4a;
          --font-sans: "Inter", sans-serif;
          --spacing-lg: 2rem;
        }

        @source "./src/**/*.vue";

        @utility tab-4 {
          tab-size: 4;
        }

        @custom-variant dark {
          &:where([data-theme="dark"]) {
            @slot;
          }
        }

        .btn {
          @apply px-4 py-2 font-bold rounded;
          color: theme("--color-primary");
        }

        @media (min-width: 768px) {
          .container {
            max-width: 768px;
          }
        }
      `);
    });

    it('v3 legacy with v4 directives', () => {
      expectNoFatalError(`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @theme {
          --color-brand: #1a202c;
        }

        .legacy {
          @apply text-center;
        }
      `);
    });
  });
});
