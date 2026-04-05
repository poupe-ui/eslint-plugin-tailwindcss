# @poupe/eslint-plugin-tailwindcss

ESLint plugin for Tailwind CSS v4 with advanced linting rules.

## Features

- 🎯 **Tailwind CSS v4 Support** - Full support for the latest Tailwind syntax
- 🔍 **Smart Validation** - Validates directives, modifiers, and utility classes
- 🚀 **Auto-fixable Rules** - Many rules can automatically fix issues
- 📦 **Preset Configurations** - Ready-to-use configs for different strictness levels
- 🎨 **Theme-aware** - Encourages consistent use of design tokens
- ⚡ **Performance** - Optimized for large codebases

## Requirements

- ESLint 9.30.0 or higher
- Node.js 20.19.0 or higher
- Flat config format (eslint.config.js)

## Installation

```bash
# pnpm
pnpm add -D @poupe/eslint-plugin-tailwindcss

# npm
npm install -D @poupe/eslint-plugin-tailwindcss

# yarn
yarn add -D @poupe/eslint-plugin-tailwindcss
```

**Note:** The plugin registers its own `tailwindcss/css` language
(built on `@eslint/css`). If you also want `css/*` rules from
`@eslint/css`, import that plugin separately in your config
or use [`@poupe/eslint-config`][eslint-config].

## Usage

### Basic Setup

Create an `eslint.config.mjs` file:

```js
// @ts-check
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  tailwindcss.configs.recommended,
];
```

Each preset config includes file globs (`**/*.?(post)css`),
`tailwindcss/css` language with Tailwind v4 syntax, and the plugin
self-reference.

### Overriding Rules

Override specific rules after a preset:

```js
// @ts-check
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  tailwindcss.configs.recommended,
  {
    rules: {
      'tailwindcss/no-arbitrary-value-overuse': 'error',
    },
  },
];
```

## Available Configurations

### `base`

Setup-only config with no rules. Provides file globs (`**/*.?(post)css`),
`tailwindcss/css` language, tolerant parsing, Tailwind v4 custom syntax,
and the plugin self-reference. All other presets extend `base`.

### `minimal`

Basic syntax validation only. Good for existing projects.

- ✅ `valid-theme-function`
- ✅ `valid-modifier-syntax`
- ✅ `valid-apply-directive`
- ✅ `no-invalid-at-rules`
- ✅ `no-invalid-named-grid-areas`
- ✅ `no-invalid-properties`
- ✅ `no-duplicate-imports`
- ✅ `no-duplicate-reference`
- ✅ `no-empty-blocks`
- ✅ `no-important`
- ✅ `require-reference-in-vue`
- ✅ `use-baseline`

### `recommended` (Default)

Balanced set of rules for most projects.

- ✅ All rules from `minimal` (`no-important` relaxed to warning)
- ✅ `no-conflicting-utilities`
- ⚠️ `no-arbitrary-value-overuse` (warning)
- ⚠️ `prefer-theme-tokens` (warning)

### `strict`

All rules enabled with strict settings. Best for new projects.

- ✅ All rules as errors
- ✅ Strictest configuration options
- ✅ Includes additional rules (consistent spacing, logical properties,
  relative units, layers)

### Complete Example

Here's a comprehensive `eslint.config.mjs` with TypeScript support:

```js
// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  tailwindcss.configs.recommended,
];
```

## Rules

<!-- begin auto-generated rules list -->

### Possible Errors (Implemented)

Rules that catch potential bugs or invalid syntax.

| Rule | Description | 🔧 |
| :--- | :--- | :--- |
| [no-conflicting-utilities](./docs/rules/no-conflicting-utilities.md) | Detects conflicting Tailwind utilities that affect the same CSS properties | |
| [no-duplicate-imports](./docs/rules/no-duplicate-imports.md) | Disallow duplicate @import rules | |
| [no-duplicate-reference](./docs/rules/no-duplicate-reference.md) | Disallow duplicate @reference directives | |
| [no-empty-blocks](./docs/rules/no-empty-blocks.md) | Disallow empty rule blocks and at-rule blocks | |
| [no-invalid-at-rules](./docs/rules/no-invalid-at-rules.md) | Disallow invalid at-rule names and syntax | |
| [no-invalid-named-grid-areas](./docs/rules/no-invalid-named-grid-areas.md) | Disallow invalid named grid areas in CSS Grid templates | |
| [no-invalid-properties](./docs/rules/no-invalid-properties.md) | Disallow invalid CSS property names | |
| [require-reference-in-vue](./docs/rules/require-reference-in-vue.md) | Require @reference directive in Vue SFC style blocks | 🔧 |
| [use-baseline](./docs/rules/use-baseline.md) | Enforce use of widely-supported CSS features | |
| [valid-apply-directive](./docs/rules/valid-apply-directive.md) | Validates the `@apply` directive usage | |
| [valid-modifier-syntax](./docs/rules/valid-modifier-syntax.md) | Ensures Tailwind modifiers follow correct syntax patterns | |
| [valid-theme-function](./docs/rules/valid-theme-function.md) | Validates usage of the `theme()` function in CSS files | 🔧 |

### Best Practices (Implemented)

Rules that guide towards better code patterns and maintainability.

| Rule | Description | 🔧 |
| :--- | :--- | :--- |
| [no-arbitrary-value-overuse](./docs/rules/no-arbitrary-value-overuse.md) | Warns when too many arbitrary values are used instead of theme tokens | |
| [no-important](./docs/rules/no-important.md) | Discourage use of !important | |
| [prefer-logical-properties](./docs/rules/prefer-logical-properties.md) | Enforce the use of logical properties over physical properties | 🔧 |
| [prefer-theme-tokens](./docs/rules/prefer-theme-tokens.md) | Suggests using theme tokens instead of hard-coded values | |
| [relative-font-units](./docs/rules/relative-font-units.md) | Prefer relative units (rem/em) over absolute (px) for fonts | |
| [use-layers](./docs/rules/use-layers.md) | Encourage use of @layer for better CSS architecture | |

### Stylistic Issues (Implemented)

Rules that enforce code style and formatting conventions.

| Rule | Description | 🔧 |
| :--- | :--- | :--- |
| [consistent-spacing](./docs/rules/consistent-spacing.md) | Enforces consistent spacing around colons in CSS declarations | 🔧 |

<!-- end auto-generated rules list -->

🔧 = Automatically fixable

### Unimplemented Rules (Roadmap)

#### Possible Errors (Planned)

##### Core CSS Validation (Additional)

Rules that catch general CSS syntax errors and invalid constructs.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| no-unknown-pseudo-class | Detect invalid pseudo-classes | | Planned |
| no-unknown-pseudo-element | Detect invalid pseudo-elements | | Planned |

#### Best Practices (Planned)

##### Tailwind v4 Compatibility

Rules specific to Tailwind CSS version management and migration.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| version-compatibility | Enforce compatibility with specific Tailwind CSS versions | | Planned |
| deprecated-features | Warn about deprecated Tailwind features | | Planned |
| migrate-imports | Convert Tailwind v3 imports to v4 syntax | 🔧 | Priority |
| migrate-directives | Update deprecated Tailwind directives | 🔧 | Priority |
| migrate-config-to-css | Guide migration from JS config to CSS @theme | | Planned |
| migrate-arbitrary-values | Update arbitrary value syntax between versions | 🔧 | Planned |

##### Code Quality

Rules that enforce documentation and maintainability.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| comment-word-disallowed-list | Disallow specified words in comments | | Considering |
| require-description-comments | Require explanatory comments for complex selectors | | Considering |
| tailwind-comment-directives | Validate Tailwind-specific comment directives | 🔧 | Considering |

#### Stylistic Issues (Planned)

##### CSS Formatting (@eslint/css parity)

General CSS formatting rules.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| indent | Enforce consistent indentation | 🔧 | Planned |
| brace-style | Enforce consistent brace placement | 🔧 | Planned |
| block-spacing | Enforce consistent spacing inside blocks | 🔧 | Planned |
| declaration-block-newline | Enforce line breaks within declaration blocks | 🔧 | Planned |
| rule-empty-line-before | Require or disallow empty lines before rules | 🔧 | Planned |
| property-sort-order | Enforce consistent property declaration order | 🔧 | Planned |
| at-rule-formatting | Format at-rules consistently | 🔧 | Planned |
| no-unnecessary-whitespace | Disallow unnecessary whitespace | 🔧 | Planned |
| property-formatting | Format property declarations consistently | 🔧 | Planned |
| selector-formatting | Format selectors consistently | 🔧 | Planned |
| value-formatting | Format property values consistently | 🔧 | Planned |
| media-query-formatting | Format media queries consistently | 🔧 | Planned |

##### Tailwind-Specific Formatting

Rules for Tailwind CSS v4 specific constructs.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| at-apply-formatting | Format @apply directives consistently | 🔧 | Planned |
| theme-formatting | Format @theme blocks consistently | 🔧 | Planned |
| enforce-class-order | Enforce consistent Tailwind utility class ordering | 🔧 | Priority |

##### Comment Formatting

Rules for consistent comment styles.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| comment-formatting | Format comments consistently | 🔧 | Considering |
| comment-style | Enforce consistent comment syntax | 🔧 | Considering |
| comment-empty-line-before | Require or disallow empty lines before comments | 🔧 | Considering |
| comment-capitalization | Enforce consistent comment capitalization | 🔧 | Considering |
| comment-length | Enforce maximum comment line length | 🔧 | Considering |

**Status Legend:**

- **Priority**: High priority, will be implemented next
- **Planned**: Scheduled for implementation
- **Considering**: Under consideration, may be implemented

## Advanced Features

### Custom Syntax Support

This plugin extends @eslint/css with Tailwind CSS v4 syntax support:

- ✅ **Directives**: `@theme`, `@import`, `@apply`, `@plugin`, `@utility`,
  `@variant`, `@custom-variant`, `@source`, `@config`, `@reference`,
  `@tailwind` (v3 legacy)
- ✅ **Functions**: `theme()`
- ✅ **Arbitrary Values**: `[value]` syntax
- ✅ **Modifiers**: `hover:`, `focus:`, `sm:`, `lg:`, `inert:`, `target:`,
  `open:`, `starting:`, `popover-open:`, `not-*:`, `in-*:`, `[&:state]:`
- ✅ **Stacked Variants**: `dark:hover:text-white`
- ✅ **Custom Variants**: Created with `@custom-variant`

### TypeScript Support

Full TypeScript support with exported types:

```ts
import type { TailwindcssRules } from '@poupe/eslint-plugin-tailwindcss';
```

### Parser API

The plugin exports a parser API for advanced use cases and custom rule development:

```ts
import {
  // CSS context utilities
  getCSSContext,
  isCSSContext,
  type CSSContextInfo,
  type CSSRuleContext,

  // CSS types from @eslint/css
  CSSSourceCode,
  type CSSLanguageOptions,

  // Tailwind v4 syntax configuration
  tailwindV4Syntax,
} from '@poupe/eslint-plugin-tailwindcss/parser';
```

#### CSS Context Utilities

##### `getCSSContext(context)`

Validates whether an ESLint rule context is processing CSS content (including
Vue SFC `<style>` blocks).

```ts
export function getCSSContext<T extends RuleContextTypeOptions>(
  context: RuleContext<T>,
): CSSContextInfo | undefined
```

Returns `CSSContextInfo` if the context contains CSS content, or `undefined` otherwise.

##### `isCSSContext(context)`

Quick check if a context contains CSS content.

```ts
export function isCSSContext(context: unknown): boolean
```

##### `CSSContextInfo`

Information about CSS context:

```ts
interface CSSContextInfo {
  contextType: 'css-file' | 'vue-style'   // Type of CSS context
  isVueFile: boolean                       // Whether it's a Vue SFC
  sourceCode: unknown                      // The source code object
  context: CSSRuleContext                  // Properly typed CSS rule context
  getCSSSourceCode(): CSSSourceCode | undefined // Get CSSSourceCode instance
}
```

#### Example: Custom Rule Using Parser API

```ts
import { getCSSContext } from '@poupe/eslint-plugin-tailwindcss/parser';

export const myCustomRule = {
  meta: { /* ... */ },
  create(context) {
    // Check if we're in CSS context
    const cssInfo = getCSSContext(context);
    if (!cssInfo) {
      return {}; // Not CSS content
    }

    // Now we have properly typed CSS context
    const { context: cssContext, getCSSSourceCode } = cssInfo;

    // Check if we have a CSSSourceCode instance
    const cssSourceCode = getCSSSourceCode();
    if (cssSourceCode) {
      // Can use CSSSourceCode-specific APIs
    }

    return {
      StyleSheet(node) {
        // Rule implementation with typed context
        cssContext.report({
          node,
          message: 'Example error'
        });
      }
    };
  }
};
```

#### CSS Types from @eslint/css

##### `CSSSourceCode`

The `CSSSourceCode` class from @eslint/css provides methods for working with CSS
source code:

```ts
const cssSourceCode = cssInfo.getCSSSourceCode();
if (cssSourceCode) {
  // Access CSS-specific source code methods
  const text = cssSourceCode.getText(node);
  const lines = cssSourceCode.getLines();
}
```

##### `CSSLanguageOptions`

Type definition for CSS language configuration options from @eslint/css:

```ts
interface CSSLanguageOptions {
  tolerant?: boolean;
  customSyntax?: Partial<SyntaxConfig> | SyntaxExtensionCallback;
}
```

#### Tailwind v4 Syntax Configuration

The `tailwindV4Syntax` export is a `SyntaxExtensionCallback` that wraps
[`tailwind-csstree`][tailwind-csstree]'s `tailwind4` callback and adds
`@tailwind` for v3 legacy compatibility:

```ts
import { tailwindV4Syntax } from '@poupe/eslint-plugin-tailwindcss/parser';

// Use in a custom ESLint config:
{
  languageOptions: {
    customSyntax: tailwindV4Syntax,
  },
}
```

This can be used when extending @eslint/css parsers or creating custom CSS
linting tools.

## Configuration Examples

### With TypeScript

```js
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  tailwindcss.configs.recommended,
];
```

### Vue.js Project

```js
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';
import vue from 'eslint-plugin-vue';

export default [
  ...vue.configs['flat/recommended'],
  tailwindcss.configs.recommended,
];
```

### With PostCSS

The preset file glob (`**/*.?(post)css`) covers `.css` and `.postcss`
files. No additional configuration is needed:

```js
// @ts-check
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  tailwindcss.configs.strict,
];
```

### With @eslint/css

Use both plugins to get `css/*` rules alongside `tailwindcss/*` rules.
The Tailwind preset is self-contained; `@eslint/css` needs its own
config entry with plugin registration and language:

```js
// eslint.config.mjs
import css from '@eslint/css';
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  // @eslint/css — general CSS rules (css/css language)
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    rules: {
      ...css.configs.recommended.rules,
      // Tailwind directives are valid — handled by tailwindcss/css
      'css/no-invalid-at-rules': 'off',
    },
  },
  // Tailwind CSS — Tailwind-specific rules (tailwindcss/css language)
  tailwindcss.configs.recommended,
];
```

## Troubleshooting

### ESLint can't find the plugin

Make sure you're using ESLint flat config format (ESLint 9+):

```js
// @ts-check
// ✅ Correct - eslint.config.mjs (ESM format)
export default [
  tailwindcss.configs.recommended,
];

// ❌ Wrong - .eslintrc.js (legacy format)
module.exports = {
  extends: ['@poupe/eslint-plugin-tailwindcss'],
};
```

### Rules not applying to CSS files

Use a preset config directly — it already targets `**/*.?(post)css`:

```js
export default [
  tailwindcss.configs.recommended,
];
```

## Contributing

Contributions are welcome! Please read our
[contributing guidelines](CONTRIBUTING.md) first.

### Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Lint and auto-fix
pnpm lint

# Type checking
pnpm type-check

# Run all pre-commit checks
pnpm precommit
```

### Testing

Tests are written using Vitest and ESLint's RuleTester. Each rule should have
comprehensive test coverage including:

- Valid code examples
- Invalid code examples with expected errors
- Auto-fix scenarios (where applicable)
- Edge cases and CSS parsing quirks

Example test structure:

```js
import { RuleTester } from 'eslint';
import css from '@eslint/css';
import { ruleName } from '../../rules/rule-name';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('rule-name', () => {
  ruleTester.run('tailwindcss/rule-name', ruleName, {
    valid: [
      // Valid test cases
    ],
    invalid: [
      // Invalid test cases with expected errors
    ],
  });
});
```

## License

MIT © [Apptly Software Ltd][poupe-ui]

[eslint-config]: https://github.com/poupe-ui/eslint-config
[poupe-ui]: https://github.com/poupe-ui
[tailwind-csstree]: https://github.com/humanwhocodes/tailwind-csstree
