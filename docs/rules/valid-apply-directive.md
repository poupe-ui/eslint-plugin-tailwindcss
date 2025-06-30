# valid-apply-directive

Validates the `@apply` directive usage in CSS files.

## Rule Details

This rule ensures that the `@apply` directive only uses valid Tailwind utility
classes. It helps catch typos and invalid utility names early in development.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error - Typos in utility names */
.btn {
  @apply bg-blu-500 text-whit;
}

/* ❌ Error - Invalid utility syntax */
.invalid {
  @apply transform(45deg);
  @apply margin: 10px;
}

/* ❌ Error - Non-existent utilities */
.wrong {
  @apply super-large text-gigantic;
}

/* ❌ Error - Missing utilities */
.empty {
  @apply ;
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - Valid utility classes */
.btn {
  @apply bg-blue-500 text-white;
  @apply px-4 py-2 rounded;
}

/* ✅ Good - Multiple utilities */
.card {
  @apply shadow-lg p-6 bg-white rounded-xl;
}

/* ✅ Good - With modifiers */
.interactive {
  @apply hover:bg-blue-600 focus:outline-none;
}

/* ✅ Good - Responsive utilities */
.responsive {
  @apply w-full sm:w-1/2 lg:w-1/3;
}
```

## Options

This rule does not accept any options.

## Common Issues and Solutions

### Typos in Color Names

```css
/* ❌ Wrong */
@apply bg-blu-500;   /* Should be 'blue' */
@apply text-grey-700; /* Should be 'gray' in Tailwind */

/* ✅ Correct */
@apply bg-blue-500;
@apply text-gray-700;
```

### Invalid Modifier Syntax

```css
/* ❌ Wrong */
@apply bg-blue-500:hover; /* Modifier in wrong position */

/* ✅ Correct */
@apply hover:bg-blue-500;
```

### Transform Utilities

```css
/* ❌ Wrong */
@apply transform(45deg);

/* ✅ Correct */
@apply rotate-45;
```

## When Not To Use It

You might want to disable this rule if:

- You're using custom utilities defined in your Tailwind configuration that the
  linter doesn't recognize
- You're in the process of migrating to Tailwind and have mixed styles
- You have a custom build process that adds utilities dynamically

## Integration with Tailwind Configuration

This rule attempts to validate against standard Tailwind utilities. For custom
utilities defined in your `tailwind.config.js`, you may need to ensure they're
properly recognized by the linter.

## Further Reading

- [Tailwind CSS: @apply Directive](https://tailwindcss.com/docs/functions-and-directives#apply)
- [Tailwind CSS: Extracting Components](https://tailwindcss.com/docs/reusing-styles#extracting-components)
- [Tailwind CSS: Utility Classes Reference](https://tailwindcss.com/docs/utility-first)
