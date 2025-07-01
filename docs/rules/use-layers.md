# use-layers

Encourage the use of @layer for better CSS architecture and cascade management.

## Rule Details

This rule is a direct re-export from [@eslint/css](https://github.com/eslint/css).
It encourages using CSS cascade layers to better organize and control the
specificity of your styles.

CSS @layer helps create a predictable cascade by explicitly defining the order
in which different parts of your CSS should be applied.

## Examples

```css
/* ❌ Warning - styles without layers */
.button {
  background: blue;
  color: white;
}

.button:hover {
  background: darkblue;
}

/* ✅ Good - organized with layers */
@layer components {
  .button {
    background: blue;
    color: white;
  }

  .button:hover {
    background: darkblue;
  }
}

/* ✅ Also good - defining layer order */
@layer base, components, utilities;

@layer base {
  * {
    box-sizing: border-box;
  }
}
```

## Further Reading

- [Full documentation at @eslint/css](https://github.com/eslint/css/blob/main/docs/rules/use-layers.md)
- [MDN: @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [CSS Cascade Layers Explained](https://developer.chrome.com/blog/cascade-layers/)
