# no-arbitrary-value-overuse

Warns when too many arbitrary values are used instead of theme tokens.

## Rule Details

This rule encourages the use of Tailwind's design tokens over arbitrary values
to maintain consistency across your design system. It helps enforce a cohesive
visual language by limiting the use of custom values.

Examples of **incorrect** code for this rule:

```css
/* ⚠️ Warning - Too many arbitrary values in a single rule */
.card {
  padding: [12px];
  margin: [8px];
  gap: [16px];
  border-radius: [4px];
}

/* ⚠️ Warning - Multiple arbitrary color values */
.custom {
  color: [#3B82F6];
  background: [#EFF6FF];
  border-color: [#DBEAFE];
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - Use theme tokens */
.card {
  @apply p-3 m-2 gap-4 rounded;
}

/* ✅ Good - Limited arbitrary value usage */
.special {
  @apply p-4 m-2;
  gap: [13px]; /* Only one arbitrary value */
}

/* ✅ Good - Using theme() function */
.themed {
  color: theme('colors.blue.500');
  background: theme('colors.blue.50');
  border-color: theme('colors.blue.100');
}
```

## Options

This rule accepts an object with the following properties:

- `maxArbitraryValues` (number): Maximum allowed arbitrary values per CSS rule.
  Default: `1`

Example configuration:

```js
{
  "tailwindcss/no-arbitrary-value-overuse": ["warn", {
    "maxArbitraryValues": 2
  }]
}
```

## When Not To Use It

Disable this rule if:

- Your project requires frequent use of custom values not available in your
  theme
- You're in a prototyping phase where flexibility is more important than
  consistency
- You have a specific design requirement that can't be met with theme tokens

## Further Reading

- [Tailwind CSS: Using arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- [Tailwind CSS: Theme configuration](https://tailwindcss.com/docs/theme)
