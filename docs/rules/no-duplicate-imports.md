# no-duplicate-imports

Disallow duplicate @import rules.

## Rule Details

This rule checks for duplicate @import statements in CSS files. Having
duplicate imports is redundant and can lead to increased file size and
potentially unexpected cascade behavior. Each unique URL should only be
imported once per stylesheet.

The rule detects duplicates regardless of the import syntax used (string or
url() function).

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Duplicate import */
@import "styles.css";
@import "styles.css";

/* ❌ Error: Duplicate import with url() syntax */
@import url("reset.css");
@import url("reset.css");

/* ❌ Error: Mixed syntax still counts as duplicate */
@import "theme.css";
@import url(theme.css);
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Each file imported only once */
@import "tailwindcss/base.css";
@import "tailwindcss/components.css";
@import "tailwindcss/utilities.css";

/* ✅ Good: Different files */
@import url("reset.css");
@import url("styles.css");
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

- You're using a build tool that handles duplicate imports automatically
- You have a specific use case where duplicate imports are intentional
  (though this is rare)
- You're working with legacy code that relies on duplicate import behavior

## Further Reading

- [MDN: @import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)
- [CSS Cascade and Inheritance](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
