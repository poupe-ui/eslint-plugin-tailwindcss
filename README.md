# @poupe/eslint-plugin-tailwindcss-v4

ESLint plugin for Tailwind CSS v4 with advanced linting rules.

## Installation

```bash
pnpm add -D @poupe/eslint-plugin-tailwindcss-v4
```

## Usage

Add the plugin to your ESLint configuration:

```js
import tailwindcssV4 from '@poupe/eslint-plugin-tailwindcss-v4';

export default [
  {
    plugins: {
      'tailwindcss-v4': tailwindcssV4,
    },
    rules: {
      'tailwindcss-v4/valid-theme-function': 'error',
      'tailwindcss-v4/valid-modifier-syntax': 'error',
      'tailwindcss-v4/valid-apply-directive': 'error',
      'tailwindcss-v4/no-arbitrary-value-overuse': 'warn',
      'tailwindcss-v4/prefer-theme-tokens': 'warn',
      'tailwindcss-v4/no-conflicting-utilities': 'error',
    },
  },
];
```

Or use one of the preset configurations:

```js
import tailwindcssV4 from '@poupe/eslint-plugin-tailwindcss-v4';

export default [
  tailwindcssV4.configs.recommended,
];
```

## Available Configurations

- `minimal` - Basic syntax validation only
- `recommended` - Recommended rules for most projects
- `strict` - All rules enabled with strict settings

## Rules

### valid-theme-function

Validates usage of the `theme()` function in CSS files.

### valid-modifier-syntax

Ensures Tailwind modifiers follow correct syntax patterns.

### valid-apply-directive

Validates the `@apply` directive usage.

### no-arbitrary-value-overuse

Warns when too many arbitrary values are used instead of theme tokens.

### prefer-theme-tokens

Suggests using theme tokens instead of hard-coded values.

### no-conflicting-utilities

Detects conflicting Tailwind utilities that affect the same CSS properties.

## Custom Syntax Support

This plugin extends @eslint/css with Tailwind CSS v4 syntax support for:

- All Tailwind directives (`@theme`, `@source`, `@utility`, etc.)
- Arbitrary variants using square brackets
- Stacked variants
- Custom variants created with `@custom-variant`

## License

MIT
