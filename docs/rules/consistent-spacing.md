# consistent-spacing

Enforces consistent spacing around colons in CSS declarations.

## Rule Details

This rule aims to maintain consistent formatting by enforcing a standard
spacing convention around colons in CSS property declarations.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error - Missing space after colon */
.example {
  color:red;
}

/* ❌ Error - Multiple spaces after colon */
.example {
  background:  blue;
}

/* ❌ Error - Unexpected space before colon */
.example {
  margin : 10px;
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good */
.example {
  color: red;
  background: blue;
  margin: 10px;
}
```

## Options

This rule accepts an object with the following properties:

- `afterColon` (string): Require space after the colon. Default: `"always"`
  - `"always"` - Requires exactly one space after the colon
  - `"never"` - Disallows any space after the colon
- `beforeColon` (string): Require space before the colon. Default: `"never"`
  - `"never"` - Disallows any space before the colon
  - `"always"` - Requires exactly one space before the colon

Example configuration:

```js
{
  "tailwindcss/consistent-spacing": ["error", {
    "afterColon": "always",
    "beforeColon": "never"
  }]
}
```

## When Not To Use It

If you don't care about consistent spacing in your CSS declarations or if
you're using a formatter like Prettier that handles this automatically, you can
disable this rule.

## Further Reading

- [MDN: CSS Syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_syntax)
