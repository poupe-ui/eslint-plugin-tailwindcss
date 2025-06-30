# no-empty-blocks

Disallow empty blocks.

## Rule Details

This rule detects empty CSS rule blocks and at-rule blocks. Empty blocks are
usually the result of refactoring or incomplete code and should be removed to
keep stylesheets clean and maintainable. Blocks containing only comments are
still considered empty, as comments alone don't affect styling.

The rule checks both regular CSS rules (selectors with declaration blocks)
and at-rules that contain blocks (such as @media, @supports, @layer, etc.).

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Empty rule block */
.empty-class { }

/* ❌ Error: Empty media query */
@media screen and (min-width: 768px) { }

/* ❌ Error: Empty supports block */
@supports (display: grid) { }

/* ❌ Error: Empty layer block */
@layer utilities { }

/* ❌ Error: Blocks with only comments are still empty */
.placeholder {
  /* TODO: Add styles later */
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Block contains declarations */
.class {
  color: red;
}

/* ✅ Good: Media query contains rules */
@media screen and (min-width: 768px) {
  .responsive {
    display: flex;
  }
}
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

- You're using a CSS preprocessor that requires empty blocks for mixins
- You're in the early stages of development with many placeholder blocks
- You have a build process that removes empty blocks automatically
- You use empty blocks as organizational markers in your stylesheets

## Further Reading

- [MDN: CSS Syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_syntax)
- [CSS Best Practices](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/CSS)
