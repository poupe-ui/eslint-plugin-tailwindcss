# relative-font-units

Enforce the use of relative font units (rem, em) over absolute units (px) for
better accessibility.

## Rule Details

This rule is a direct re-export from [@eslint/css](https://github.com/eslint/css).
It encourages the use of relative units for font sizes to improve accessibility
and user control.

When font sizes are defined in relative units, users can adjust their browser's
font size settings and see the changes reflected in your website.

## Examples

```css
/* ❌ Error */
.text {
  font-size: 16px;
  line-height: 24px;
}

/* ✅ Good */
.text {
  font-size: 1rem;
  line-height: 1.5;
}

/* ✅ Also good */
.text {
  font-size: 1em;
  line-height: 1.5em;
}
```

## Further Reading

- [Full documentation at @eslint/css](https://github.com/eslint/css/blob/main/docs/rules/relative-font-units.md)
- [MDN: CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length)
