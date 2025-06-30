# @poupe/eslint-plugin-tailwindcss

ESLint plugin for Tailwind CSS v4 with advanced linting rules.

## Features

- 🎯 **Tailwind CSS v4 Support** - Full support for the latest Tailwind syntax
- 🔍 **Smart Validation** - Validates directives, modifiers, and utility classes
- 🚀 **Auto-fixable Rules** - Many rules can automatically fix issues
- 📦 **Preset Configurations** - Ready-to-use configs for different strictness levels
- 🎨 **Theme-aware** - Encourages consistent use of design tokens
- ⚡ **Performance** - Optimized for large codebases

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

Add the plugin to your ESLint flat configuration:

```js
// @ts-check
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  {
    files: ['**/*.css'],
    plugins: {
      tailwindcss: tailwindcss,
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

For easier setup, use one of the preset configurations:

```js
// @ts-check
// eslint.config.mjs
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  // Use recommended settings
  tailwindcss.configs.recommended,

  // Or override specific rules
  {
    files: ['**/*.css'],
    rules: {
      'tailwindcss/no-arbitrary-value-overuse': 'error', // Upgrade to error
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

## Rules

### `valid-theme-function` ✅

Validates usage of the `theme()` function in CSS files.

```css
/* ❌ Error */
.example {
  color: theme('colors.reed'); /* Typo: should be 'red' */
  margin: theme(spacing.2px);  /* Invalid syntax */
}

/* ✅ Good */
.example {
  color: theme('colors.red.500');
  margin: theme('spacing.2');
}
```

**Auto-fix:** Yes

### `valid-modifier-syntax` ✅

Ensures Tailwind modifiers follow correct syntax patterns, including support
for Tailwind CSS v4 modifiers.

**Supported modifiers:**

- Standard modifiers: `hover:`, `focus:`, `sm:`, `lg:`, etc.
- New v4 modifiers: `inert:`, `target:`, `open:`, `starting:`, `popover-open:`
- Dynamic modifiers: `not-*:`, `in-*:`
- Arbitrary modifiers: `[&:hover]:`, `[@media(hover:hover)]:`

```css
/* ❌ Error */
@media (hover: hover) {
  .hoverr\:bg-blue-500:hover { } /* Typo in modifier */
  .unknown\:text-white { }       /* Unknown modifier */
  .\:\:text-blue-500 { }         /* Empty modifier */
}

/* ✅ Good */
@media (hover: hover) {
  .hover\:bg-blue-500:hover { }     /* Standard modifier */
  .inert\:opacity-50 { }           /* v4 modifier */
  .\[\&\:hover\]\:bg-blue-500 { }  /* Arbitrary modifier */
  .not-first\:mt-4 { }             /* Dynamic not-* modifier */
  .in-data-state\:bg-blue-500 { }  /* Dynamic in-* modifier */
}
```

### `valid-apply-directive` ✅

Validates the `@apply` directive usage.

```css
/* ❌ Error */
.btn {
  @apply bg-blu-500 text-whit; /* Typos */
  @apply transform(45deg);      /* Invalid syntax */
}

/* ✅ Good */
.btn {
  @apply bg-blue-500 text-white;
  @apply rotate-45;
}
```

### `no-arbitrary-value-overuse` ⚠️

Warns when too many arbitrary values are used instead of theme tokens.

```css
/* ⚠️ Warning - Too many arbitrary values */
.card {
  padding: [12px];
  margin: [8px];
  gap: [16px];
  border-radius: [4px];
}

/* ✅ Good - Use theme tokens */
.card {
  @apply p-3 m-2 gap-4 rounded;
}
```

**Config Options:**

- `maxArbitraryValues`: Maximum allowed arbitrary values per rule (default: 1)

### `prefer-theme-tokens` ⚠️

Suggests using theme tokens instead of hard-coded values.

```css
/* ⚠️ Warning */
.text {
  color: #3B82F6;      /* Use theme('colors.blue.500') */
  font-size: 16px;     /* Use theme('fontSize.base') */
}

/* ✅ Good */
.text {
  color: theme('colors.blue.500');
  font-size: theme('fontSize.base');
}
```

### `consistent-spacing` ✅

Enforces consistent spacing around colons in CSS declarations.

```css
/* ❌ Error */
.example {
  color:red;          /* Missing space after colon */
  background:  blue;  /* Multiple spaces after colon */
  margin : 10px;      /* Unexpected space before colon */
}

/* ✅ Good */
.example {
  color: red;
  background: blue;
  margin: 10px;
}
```

**Auto-fix:** Yes

**Config Options:**

- `afterColon`: `'always'` (default) or `'never'` - Space after colon
- `beforeColon`: `'never'` (default) or `'always'` - Space before colon

### `no-conflicting-utilities` ✅

Detects conflicting Tailwind utilities that affect the same CSS properties.

```css
/* ❌ Error - Conflicting margin utilities */
.element {
  @apply m-4 mx-2;     /* mx-2 conflicts with m-4 */
  @apply p-4 pt-2;     /* pt-2 conflicts with p-4 */
}

/* ✅ Good */
.element {
  @apply m-4;
  @apply p-4 pt-2;     /* Specific overrides general */
}
```

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
