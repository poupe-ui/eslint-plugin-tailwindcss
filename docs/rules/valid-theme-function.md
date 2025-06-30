# valid-theme-function

Validates usage of the `theme()` function in CSS files.

## Rule Details

This rule ensures that the `theme()` function is used with correct syntax and
references valid theme keys. It can automatically fix common syntax errors.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error - Typo in theme key */
.example {
  color: theme('colors.reed');  /* Should be 'red' */
}

/* ❌ Error - Invalid syntax */
.invalid {
  margin: theme(spacing.2px);   /* Missing quotes */
  padding: theme("spacing.4");  /* Wrong quote style */
}

/* ❌ Error - Non-existent theme path */
.wrong {
  font-size: theme('typography.heading'); /* Invalid path */
}

/* ❌ Error - Incorrect nested path */
.nested {
  background: theme('colors.blue'); /* Missing shade like .500 */
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - Valid theme paths */
.example {
  color: theme('colors.red.500');
  margin: theme('spacing.4');
  font-size: theme('fontSize.lg');
}

/* ✅ Good - Various theme values */
.themed {
  padding: theme('spacing.2');
  border-radius: theme('borderRadius.md');
  box-shadow: theme('boxShadow.lg');
  max-width: theme('maxWidth.4xl');
}

/* ✅ Good - In calculations */
.calculated {
  width: calc(100% - theme('spacing.8'));
  min-height: calc(theme('spacing.64') + 1rem);
}

/* ✅ Good - Default values */
.with-defaults {
  color: theme('colors.custom.primary', '#3B82F6');
}
```

## Auto-fix Support

This rule can automatically fix common syntax errors:

```css
/* Before auto-fix */
.example {
  color: theme(colors.red.500);
  background: theme("colors.red.500");
  border-color: theme('colors.reed.500');
}

/* After auto-fix */
.example {
  color: theme('colors.red.500');
  background: theme('colors.red.500');
  border-color: theme('colors.red.500');
}
```

## Options

This rule does not currently accept any options.

## Common Theme Paths

### Colors

```css
theme('colors.gray.500')
theme('colors.blue.600')
theme('colors.green.400')
```

### Spacing

```css
theme('spacing.4')   /* 1rem */
theme('spacing.8')   /* 2rem */
theme('spacing.px')  /* 1px */
```

### Typography

```css
theme('fontSize.sm')
theme('fontSize.base')
theme('lineHeight.tight')
theme('fontWeight.bold')
```

### Layout

```css
theme('width.full')
theme('maxWidth.7xl')
theme('screens.md')
```

## Error Messages

- **Invalid syntax**: Function must use single quotes around the path
- **Unknown theme key**: The specified path doesn't exist in the theme
- **Typo detected**: Similar theme key found (offers auto-fix)

## When Not To Use It

You might want to disable this rule if:

- You're using a heavily customized theme configuration
- You have dynamic theme resolution at build time
- You're using CSS-in-JS where theme access works differently

## Integration with Theme Configuration

This rule validates against common Tailwind theme paths. For custom theme
values in your `tailwind.config.js`, ensure they follow standard naming
conventions for best compatibility.

## Further Reading

- [Tailwind CSS: Theme Function](https://tailwindcss.com/docs/functions-and-directives#theme)
- [Tailwind CSS: Theme Configuration](https://tailwindcss.com/docs/theme)
- [Tailwind CSS: Customizing Your Theme](https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme)
