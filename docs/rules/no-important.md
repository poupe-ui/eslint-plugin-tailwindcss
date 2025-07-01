# no-important

Discourage the use of `!important` in CSS declarations.

## Rule Details

Using `!important` is generally considered bad practice as it:

- Breaks the natural cascade of CSS
- Makes styles harder to override
- Indicates potential issues with CSS specificity
- Can lead to an "arms race" of `!important` declarations

This rule helps maintain clean, maintainable CSS by discouraging the use of `!important`.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Avoid using !important */
.button {
  color: red !important;
}

/* ❌ Error: Multiple !important flags */
.header {
  font-size: 24px !important;
  margin: 0 !important;
}

/* ❌ Error: !important in media queries */
@media (min-width: 768px) {
  .responsive {
    display: block !important;
  }
}

/* ❌ Error: !important with complex values */
.gradient {
  background: linear-gradient(to right, red, blue) !important;
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Use proper specificity instead */
.button {
  color: red;
}

/* ✅ Good: Structure CSS to avoid conflicts */
.header {
  font-size: 24px;
  margin: 0;
}

/* ✅ Good: Use more specific selectors */
.page .header {
  font-size: 20px;
}

/* ✅ Good: Use CSS custom properties for overrides */
.theme-dark .button {
  color: var(--button-color-dark);
}
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

1. **Third-party overrides**: You need to override styles from third-party
   libraries that use high specificity
2. **Legacy code**: Working with legacy CSS that requires `!important` for
   compatibility
3. **Utility classes**: Using utility-first CSS frameworks where `!important`
   is part of the design pattern
4. **Quick fixes**: During development when you need temporary overrides
   (though these should be cleaned up)

## Further Reading

- [MDN: Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [MDN: !important](https://developer.mozilla.org/en-US/docs/Web/CSS/important)
- [CSS Tricks: When Using !important is The Right Choice](https://css-tricks.com/when-using-important-is-the-right-choice/)
- [Smashing Magazine: !important CSS Declarations: How and When to Use Them](https://www.smashingmagazine.com/2010/11/the-important-css-declaration-how-and-when-to-use-it/)
