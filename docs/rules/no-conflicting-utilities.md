# no-conflicting-utilities

Detects conflicting Tailwind utilities that affect the same CSS properties.

## Rule Details

This rule identifies when multiple Tailwind utility classes in the same
`@apply` directive would conflict with each other by setting the same CSS
property. This helps prevent unintended style overrides and makes your code
more predictable.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error - Conflicting margin utilities */
.element {
  @apply m-4 mx-2; /* mx-2 conflicts with m-4's horizontal margin */
}

/* ❌ Error - Conflicting padding utilities */
.box {
  @apply p-4 pt-2; /* pt-2 conflicts with p-4's top padding */
}

/* ❌ Error - Multiple conflicting utilities */
.card {
  @apply m-2 mt-4 m-8; /* Multiple margin conflicts */
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - No conflicts */
.element {
  @apply m-4;
}

/* ✅ Good - Specific overrides are intentional and clear */
.box {
  @apply p-4;
  @apply pt-2; /* Separate @apply makes override intention clear */
}

/* ✅ Good - Using more specific utilities */
.card {
  @apply mx-4 my-2; /* Different axes, no conflict */
}

/* ✅ Good - Non-conflicting utilities */
.mixed {
  @apply p-4 m-2 rounded shadow;
}
```

## Options

This rule does not accept any options.

## When Not To Use It

You might want to disable this rule if:

- You have a specific pattern where conflicting utilities are intentional
- You're migrating legacy code and need temporary flexibility
- You prefer to handle conflicts through CSS cascade rules.

## Implementation Notes

The rule detects conflicts by analyzing which CSS properties each Tailwind
utility class affects. Common conflict patterns include:

- `m-*` conflicting with `mx-*`, `my-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`
- `p-*` conflicting with `px-*`, `py-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*`
- Multiple utilities setting the same specific property

## Further Reading

- [Tailwind CSS: Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
- [CSS Cascade and Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)
