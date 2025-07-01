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

- ESLint 9.0 or higher
- Node.js 18.0 or higher
- Flat config format (eslint.config.js)

## Installation

```bash
# pnpm
pnpm add -D @poupe/eslint-plugin-tailwindcss @eslint/css

# npm
npm install -D @poupe/eslint-plugin-tailwindcss @eslint/css

# yarn
yarn add -D @poupe/eslint-plugin-tailwindcss @eslint/css
```

**Note:** This plugin requires `@eslint/css` as a peer dependency for CSS parsing.

## Usage

### Basic Setup

Create an `eslint.config.mjs` file with TypeScript type checking:

```js
// @ts-check
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  {
    files: ['**/*.css'],
    language: 'css/css', // Required
    plugins: {
      tailwindcss,
    },
    rules: {
      'tailwindcss/valid-theme-function': 'error',
      'tailwindcss/valid-modifier-syntax': 'error',
      'tailwindcss/valid-apply-directive': 'error',
      'tailwindcss/no-arbitrary-value-overuse': 'warn',
      'tailwindcss/prefer-theme-tokens': 'warn',
      'tailwindcss/no-conflicting-utilities': 'error',
    },
  },
];
```

### Using Preset Configurations

Use preset configurations for a quick start:

```js
// @ts-check
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: {
      tailwindcss,
    },
    rules: {
      // Use recommended settings
      ...tailwindcss.configs.recommended.rules,

      // Override specific rules if needed
      'tailwindcss/no-arbitrary-value-overuse': 'error',
    },
  },
];
```

## Available Configurations

### `minimal`

Basic syntax validation only. Good for existing projects.

- ✅ `valid-theme-function`
- ✅ `valid-modifier-syntax`
- ✅ `valid-apply-directive`
- ✅ `no-invalid-at-rules`
- ✅ `no-invalid-properties`
- ✅ `no-duplicate-imports`
- ✅ `no-empty-blocks`
- ✅ `no-important`

### `recommended` (Default)

Balanced set of rules for most projects.

- ✅ All rules from `minimal`
- ✅ `no-conflicting-utilities`
- ⚠️ `no-arbitrary-value-overuse` (warning)
- ⚠️ `prefer-theme-tokens` (warning)

### `strict`

All rules enabled with strict settings. Best for new projects.

- ✅ All rules as errors
- ✅ Strictest configuration options
- ✅ Includes optional @eslint/css rules (logical properties, relative units, layers)

### Complete Example

Here's a comprehensive `eslint.config.mjs` with TypeScript support:

```js
// @ts-check
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import css from '@eslint/css';
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  // JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
    },
  },

  // CSS files with Tailwind CSS support
  {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: {
      css,
      tailwindcss,
    },
    rules: {
      // @eslint/css rules
      'css/no-duplicate-imports': 'error',
      'css/no-empty-blocks': 'error',

      // Tailwind CSS specific rules
      ...tailwindcss.configs.recommended.rules,
    },
  },
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
| [no-empty-blocks](./docs/rules/no-empty-blocks.md) | Disallow empty rule blocks and at-rule blocks | |
| [no-invalid-at-rules](./docs/rules/no-invalid-at-rules.md) | Disallow invalid at-rule names and syntax | |
| [no-invalid-properties](./docs/rules/no-invalid-properties.md) | Disallow invalid CSS property names | |
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

##### Core CSS Validation (@eslint/css parity)

Rules that catch general CSS syntax errors and invalid constructs.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |
| no-invalid-named-grid-areas | Disallow malformed CSS Grid template areas | | Priority |
| no-unknown-pseudo-class | Detect invalid pseudo-classes | | Planned |
| no-unknown-pseudo-element | Detect invalid pseudo-elements | | Planned |

#### Best Practices (Planned)

##### CSS Best Practices (@eslint/css parity)

Rules that enforce modern CSS patterns.

| Rule | Description | 🔧 | Status |
| :--- | :--- | :--- | :--- |

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

- ✅ **Directives**: `@theme`, `@import`, `@plugin`, `@utility`, `@variant`, `@source`
- ✅ **Functions**: `theme()`, `screen()`
- ✅ **Arbitrary Values**: `[value]` syntax
- ✅ **Modifiers**: `hover:`, `focus:`, `sm:`, `lg:`, `inert:`, `target:`,
  `open:`, `starting:`, `popover-open:`, `not-*:`, `in-*:`, `[&:state]:`
- ✅ **Stacked Variants**: `dark:hover:text-white`
- ✅ **Custom Variants**: Created with `@custom-variant`

### TypeScript Support

Full TypeScript support with exported types:

```ts
import type { TailwindCSSRules, TailwindCSSConfigs } from '@poupe/eslint-plugin-tailwindcss';
```

## Configuration Examples

### With TypeScript

```js
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs['recommended-type-checked'].rules,
    },
  },
  // Tailwind CSS configuration
  {
    files: ['**/*.css'],
    ...tailwindcss.configs.recommended,
  },
];
```

### Vue.js Project

```js
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';
import vue from 'eslint-plugin-vue';

export default [
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{css,vue}'],
    ...tailwindcss.configs.recommended,
  },
];
```

### With PostCSS

```js
// @ts-check
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  {
    files: ['**/*.{css,pcss,postcss}'],
    ...tailwindcss.configs.strict,
  },
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

Ensure your config targets CSS files:

```js
export default [
  {
    files: ['**/*.css'], // Don't forget this!
    ...tailwindcss.configs.recommended,
  },
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

MIT © [Apptly Software Ltd](https://github.com/poupe-ui)
