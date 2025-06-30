# valid-modifier-syntax

Ensures Tailwind modifiers follow correct syntax patterns.

## Rule Details

This rule validates that Tailwind CSS modifiers (variants) are used with the
correct syntax. It supports all standard Tailwind modifiers as well as the new
modifiers introduced in Tailwind CSS v4.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error - Typo in modifier */
@media (hover: hover) {
  .hoverr\:bg-blue-500:hover { } /* Should be 'hover:' */
}

/* ❌ Error - Unknown modifier */
.unknown\:text-white { }

/* ❌ Error - Empty modifier */
.\:\:text-blue-500 { }

/* ❌ Error - Invalid modifier syntax */
.hover-bg-blue-500 { } /* Should use colon */
```

Examples of **correct** code for this rule:

```css
/* ✅ Good - Standard modifiers */
@media (hover: hover) {
  .hover\:bg-blue-500:hover { }
}
.focus\:outline-none:focus { }
.sm\:text-lg { }

/* ✅ Good - Tailwind v4 modifiers */
.inert\:opacity-50 { }
.target\:bg-yellow-200:target { }
.open\:rotate-180[open] { }
.starting\:opacity-0 { }
.popover-open\:opacity-100 { }

/* ✅ Good - Dynamic modifiers */
.not-first\:mt-4:not(:first-child) { }
.not-last\:border-b:not(:last-child) { }
.in-data-state\:bg-blue-500 { }
.in-range\:ring-2:in-range { }

/* ✅ Good - Arbitrary modifiers */
.\[\&\:hover\]\:bg-blue-500 { }
.\[\@media\(hover\:hover\)\]\:underline { }
.\[\&\[data-state\=open\]\]\:block { }

/* ✅ Good - Stacked modifiers */
.dark\:hover\:text-white { }
.sm\:hover\:not-first\:bg-gray-100 { }
```

## Supported Modifiers

### Standard Modifiers

- **Responsive**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **State**: `hover:`, `focus:`, `active:`, `visited:`, `disabled:`
- **Group**: `group-hover:`, `group-focus:`
- **Peer**: `peer-hover:`, `peer-focus:`
- **Theme**: `dark:`, `light:`
- **Motion**: `motion-safe:`, `motion-reduce:`

### Tailwind CSS v4 Modifiers

- **Interactive States**: `inert:`, `target:`, `open:`, `starting:`, `popover-open:`
- **Form States**: `in-range:`, `out-of-range:`
- **Dynamic Not**: `not-first:`, `not-last:`, `not-empty:`, etc.
- **Dynamic In**: `in-data-*:`, `in-range:`, etc.

### Arbitrary Modifiers

- `[&:hover]:` - Custom pseudo-classes
- `[@media(...)]:` - Custom media queries
- `[&[data-state=open]]:` - Custom attribute selectors

## Options

This rule does not accept any options.

## Common Patterns

### Correct Modifier Order

```css
/* ✅ Good - Correct order: responsive, theme, state */
.sm\:dark\:hover\:bg-blue-500 { }

/* ❌ Bad - Incorrect order */
.hover\:sm\:dark\:bg-blue-500 { }
```

### Dynamic Modifiers

```css
/* ✅ Good - Dynamic 'not' modifiers */
.not-checked\:opacity-50:not(:checked) { }
.not-disabled\:hover\:bg-blue-500:not(:disabled):hover { }

/* ✅ Good - Dynamic 'in' modifiers */
.in-data-active\:font-bold { }
.in-view\:animate-slide { }
```

## When Not To Use It

Disable this rule if:

- You're using custom variants defined via `@custom-variant`
- You have a preprocessor that generates non-standard modifier syntax
- You're migrating from an older version of Tailwind with different syntax

## Further Reading

- [Tailwind CSS: Hover, Focus, and Other States](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind CSS v4: What's New](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
