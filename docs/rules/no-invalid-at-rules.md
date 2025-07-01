# no-invalid-at-rules

Disallow invalid at-rule names and validate their syntax.

## Rule Details

This rule validates CSS at-rule names and their structure. It ensures that
at-rules are spelled correctly and have the appropriate syntax (with or without
a block). The rule supports both standard CSS at-rules and Tailwind CSS v4
specific at-rules.

The rule checks for:

- Valid at-rule names (standard CSS and Tailwind-specific)
- Correct structure (whether an at-rule should have a block or not)
- Common typos and provides suggestions

### Supported Tailwind CSS v4 At-Rules

- `@apply` - Apply Tailwind utilities inline
- `@theme` - Define design tokens
- `@source` - Specify source files for content detection
- `@utility` - Create custom utilities
- `@variant` - Apply variants in CSS
- `@custom-variant` - Create new custom variants
- `@reference` - Import without duplication
- `@config` - Load JS config (legacy compatibility)
- `@plugin` - Load JS plugins (legacy compatibility)
- `@layer` - Organize styles (v3 compatibility)
- `@tailwind` - Insert Tailwind styles (v3 legacy)

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Typo in at-rule name */
@improt "styles.css"; /* Did you mean "@import"? */

/* ❌ Error: Invalid at-rule */
@invalid-rule { color: red; }

/* ❌ Error: Missing required block */
@media (min-width: 768px);
@theme;
@utility tab-4;

/* ❌ Error: Unexpected block */
@import "styles.css" { }
@apply font-bold { }
@source "./src/**/*.js" { }

/* ❌ Error: Common Tailwind typos */
@aply font-bold; /* Did you mean "@apply"? */
@them { --color: red; } /* Did you mean "@theme"? */
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Standard CSS at-rules */
@import "styles.css";
@media (min-width: 768px) { .foo { color: red; } }
@supports (display: flex) { .foo { display: flex; } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@container (min-width: 700px) { .card { display: flex; } }

/* ✅ Good: Tailwind v4 at-rules */
@import "tailwindcss";
@apply font-bold text-center;
@theme {
  --color-primary: #3490dc;
  --font-display: "Inter", sans-serif;
}
@source "./src/**/*.js";
@utility tab-4 {
  tab-size: 4;
}
@custom-variant dark {
  &:where([data-theme="dark"]) {
    @slot;
  }
}

/* ✅ Good: Optional blocks */
@variant hover; /* Can be used without block */
@variant hover { &:hover { @slot; } } /* Or with block */
@layer utilities; /* Can be used without block */
@layer utilities { .tab-4 { tab-size: 4; } } /* Or with block */

/* ✅ Good: Legacy/compatibility */
@tailwind base;
@config "../../tailwind.config.js";
@plugin "../../my-plugin.js";
```

## Options

This rule accepts an object with the following properties:

- `ignoreAtRules` (array): List of at-rule names to ignore. Default: `[]`

Example configuration:

```js
{
  "tailwindcss/no-invalid-at-rules": ["error", {
    "ignoreAtRules": ["custom-at-rule", "experimental-feature"]
  }]
}
```

## When Not To Use It

You might want to disable this rule if:

- You're using experimental CSS features with non-standard at-rules
- You're using PostCSS plugins that introduce custom at-rules
- You're working with a CSS preprocessor that has its own at-rules

## Further Reading

- [MDN CSS At-Rules Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@container)
