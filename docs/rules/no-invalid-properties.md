# no-invalid-properties

Disallow invalid CSS property names.

## Rule Details

This rule validates CSS property names to ensure they are recognized as standard
CSS properties, vendor-prefixed properties, or custom properties (CSS
variables). It helps catch typos and invalid property names that would be
ignored by browsers.

The rule checks for:

- Standard CSS properties (e.g., `color`, `margin`, `display`)
- Vendor-prefixed properties (e.g., `-webkit-appearance`, `-moz-user-select`)
- CSS custom properties/variables (e.g., `--custom-color`, `--my-spacing`)
- Common typos and provides suggestions

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Typo in property name */
.example {
  colour: red; /* Did you mean "color"? */
}

/* ❌ Error: Invalid property */
.foo {
  invalid-property: value;
}

/* ❌ Error: Wrong property name */
.bar {
  bg-color: blue; /* Did you mean "background-color"? */
}

/* ❌ Error: Case sensitivity */
.baz {
  Background-Color: red; /* CSS properties are case-sensitive */
}

/* ❌ Error: Invalid vendor prefix usage */
.qux {
  -webkit-invalid-prop: none;
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Standard CSS properties */
.example {
  color: red;
  background-color: blue;
  margin: 10px;
  display: flex;
}

/* ✅ Good: Vendor prefixed properties */
.foo {
  -webkit-appearance: none;
  -moz-user-select: none;
  -ms-transform: rotate(45deg);
}

/* ✅ Good: CSS custom properties (variables) */
.bar {
  --custom-color: red;
  --my-spacing: 1rem;
  color: var(--custom-color);
}

/* ✅ Good: Modern CSS properties */
.baz {
  aspect-ratio: 16/9;
  container-type: inline-size;
  scrollbar-width: thin;
}

/* ✅ Good: CSS logical properties */
.qux {
  margin-inline: 10px;
  padding-block-start: 20px;
}
```

## Options

This rule accepts an object with the following properties:

- `ignoreProperties` (array): List of property names to ignore. Default: `[]`

Example configuration:

```js
{
  "tailwindcss/no-invalid-properties": ["error", {
    "ignoreProperties": ["vendor-specific-property", "legacy-property"]
  }]
}
```

## When Not To Use It

You might want to disable this rule if:

- You're using experimental or non-standard CSS properties
- You're working with a CSS-in-JS solution that supports custom property names
- You're using PostCSS plugins that introduce custom properties

## Further Reading

- [MDN CSS Properties Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Vendor Prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)
