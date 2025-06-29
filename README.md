# @poupe/eslint-plugin-tailwindcss

ESLint plugin for Tailwind CSS v4 with advanced linting rules.

## Installation

```bash
pnpm add -D @poupe/eslint-plugin-tailwindcss
```

## Usage

Add the plugin to your ESLint configuration:

```js
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  {
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

Or use one of the preset configurations:

```js
import tailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  tailwindcss.configs.recommended,
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
