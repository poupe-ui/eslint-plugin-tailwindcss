# prefer-logical-properties

Enforce the use of logical properties over physical properties for better
internationalization support.

## Rule Details

This rule is a direct re-export from [@eslint/css](https://github.com/eslint/css).
It encourages the use of CSS logical properties instead of physical properties.

Logical properties adapt to different writing modes and text directions,
making your CSS more internationally friendly.

## Examples

```css
/* ❌ Error */
.element {
  margin-left: 20px;
  padding-right: 10px;
  border-top: 1px solid;
  width: 100px;
  text-align: left;
}

/* ✅ Good */
.element {
  margin-inline-start: 20px;
  padding-inline-end: 10px;
  border-block-start: 1px solid;
  inline-size: 100px;
  text-align: start;
}
```

## Auto-Fix

This rule provides auto-fix support to automatically convert physical
properties to their logical equivalents.

## Further Reading

- [Full documentation at @eslint/css](https://github.com/eslint/css/blob/main/docs/rules/prefer-logical-properties.md)
- [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
