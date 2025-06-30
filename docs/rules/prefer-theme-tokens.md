# prefer-theme-tokens

Suggests using theme tokens instead of hard-coded values.

## Rule Details

This rule encourages the use of Tailwind's theme tokens through the `theme()`
function instead of hard-coded values. This promotes consistency across your
design system and makes it easier to maintain and update your styles.

Examples of **incorrect** code for this rule:

```css
/* ⚠️ Warning - Hard-coded color values */
.text {
  color: #3B82F6;      /* Use theme('colors.blue.500') */
  background: #EFF6FF; /* Use theme('colors.blue.50') */
}

/* ⚠️ Warning - Hard-coded spacing values */
.spacing {
  padding: 16px;       /* Use theme('spacing.4') */
  margin: 32px;        /* Use theme('spacing.8') */
}

/* ⚠️ Warning - Hard-coded font sizes */
.typography {
  font-size: 16px;     /* Use theme('fontSize.base') */
  line-height: 24px;   /* Use theme('lineHeight.6') */
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - Using theme tokens */
.text {
  color: theme('colors.blue.500');
  background: theme('colors.blue.50');
}

/* ✅ Good - Theme-based spacing */
.spacing {
  padding: theme('spacing.4');
  margin: theme('spacing.8');
}

/* ✅ Good - Typography tokens */
.typography {
  font-size: theme('fontSize.base');
  line-height: theme('lineHeight.relaxed');
}

/* ✅ Good - Complex calculations with theme */
.calculated {
  width: calc(100% - theme('spacing.8'));
}
```

## Options

This rule does not currently accept any options.

## When Not To Use It

You might want to disable this rule if:

- You're working with legacy styles that need specific pixel values
- You have design requirements that don't align with your theme scale
- You're prototyping and need quick, one-off values
- You're dealing with third-party component integration that requires specific
  values

## Automatic Suggestions

When possible, this rule will suggest the closest matching theme token. For example:

- `16px` → `theme('spacing.4')` or `theme('fontSize.base')`
- `#3B82F6` → `theme('colors.blue.500')`
- `32px` → `theme('spacing.8')`

The suggestions are based on common Tailwind theme values and may need
adjustment based on your custom theme configuration.

## Further Reading

- [Tailwind CSS: Theme Configuration](https://tailwindcss.com/docs/theme)
- [Tailwind CSS: Using CSS and @layer](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)
- [Tailwind CSS: Functions & Directives](https://tailwindcss.com/docs/functions-and-directives)
