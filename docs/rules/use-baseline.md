# use-baseline

Enforce use of widely-supported CSS features to ensure cross-browser compatibility.

## Rule Details

This rule helps maintain cross-browser compatibility by warning when CSS
features with limited browser support are used. It categorizes CSS features
into three levels based on their browser support:

- **Widely Available**: Features supported across browsers for at least 30
  months (safe to use)
- **Newly Available**: Features supported in latest versions of all major
  browsers (use with caution)
- **Limited Availability**: Features not yet available in all core browsers
  (should be avoided)

By default, this rule only flags features with **limited availability**.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Limited availability features */
.anchor {
  anchor-name: --my-anchor;
  position-anchor: --target;
}

/* ❌ Error: Scroll-driven animations */
.animated {
  animation-timeline: scroll();
  view-timeline-name: --my-timeline;
}

/* ❌ Error: View transitions */
.transition {
  view-transition-name: header;
}

/* ❌ Error: New at-rules */
@starting-style {
  .element { opacity: 0; }
}

/* ❌ Error: New pseudo-classes */
.form-field:user-valid {
  border-color: green;
}

/* ❌ Error: Vendor prefixes */
.button {
  -webkit-appearance: none;
  -moz-user-select: none;
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Widely supported features */
.element {
  display: flex;
  grid-template-columns: 1fr 2fr;
  transform: rotate(45deg);
  color: var(--primary-color);
}

/* ✅ Good: Standard at-rules */
@media (min-width: 768px) {
  .responsive { display: grid; }
}

@supports (display: grid) {
  .grid { display: grid; }
}

/* ✅ Good: Standard pseudo-classes */
.button:hover { color: blue; }
.item:nth-child(2n) { background: gray; }

/* ✅ Good: Standard functions */
.container {
  width: calc(100% - 20px);
  background: linear-gradient(to right, red, blue);
}
```

## Options

This rule accepts an object with the following properties:

- `strictness` (string): Controls which features to flag. Default: `"limited"`
  - `"limited"`: Only flag features with limited availability
  - `"newly"`: Flag both limited and newly available features
- `ignore` (array): List of feature names to ignore. Default: `[]`

Example configuration:

```js
{
  "tailwindcss/use-baseline": ["error", {
    "strictness": "newly",
    "ignore": ["container-type", "@layer"]
  }]
}
```

### Strictness Levels

#### Default (`"limited"`)

Only flags features with limited browser support:

```css
/* ❌ Error */
.anchor { anchor-name: --target; }

/* ✅ OK (newly available features are allowed) */
.container { container-type: inline-size; }
```

#### Strict (`"newly"`)

Flags both limited and newly available features:

```css
/* ❌ Error */
.anchor { anchor-name: --target; }

/* ❌ Error */
.container { container-type: inline-size; }
.element { aspect-ratio: 16 / 9; }
@layer utilities { }
.parent:has(.child) { }
```

### Ignoring Specific Features

You can ignore specific features that you've polyfilled or don't need to support:

```js
{
  "tailwindcss/use-baseline": ["error", {
    "ignore": ["anchor-name", "@starting-style"]
  }]
}
```

## When Not To Use It

Disable this rule if:

- You only target modern browsers that support cutting-edge CSS features
- You use polyfills or fallbacks for unsupported features
- You have a specific browser support policy that differs from baseline recommendations
- You're building experimental or proof-of-concept applications

## Further Reading

- [MDN Web Docs - Browser Compatibility](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables)
- [Baseline Web Platform](https://web.dev/baseline)
- [Can I Use](https://caniuse.com/)
- [CSS Working Group Drafts](https://drafts.csswg.org/)
