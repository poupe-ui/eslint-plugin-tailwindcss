# require-reference-in-vue

Require @reference directive in Vue SFC style blocks for Tailwind CSS v4.

## Rule Details

Tailwind CSS v4 requires the `@reference` directive in Vue Single File
Component (SFC) `<style>` blocks to properly compile styles. This rule ensures
that all Vue component styles include the necessary `@reference` directive.

The `@reference` directive imports Tailwind styles for reference without
including them in the output, which is essential for tools like Vite where
each `<style>` block is processed independently.

Examples of **incorrect** code for this rule:

```vue
<!-- ❌ Error: Missing @reference directive -->
<style>
.button {
  @apply text-white bg-blue-500;
}
</style>
```

Examples of **correct** code for this rule:

```vue
<!-- ✅ Good: Has @reference directive -->
<style>
@reference "tailwindcss";

.button {
  @apply text-white bg-blue-500;
}
</style>
```

```vue
<!-- ✅ Good: Reference to specific file -->
<style>
@reference "../../styles/tailwind.css";

h1 {
  @apply text-2xl font-bold;
}
</style>
```

```css
/* ✅ Good: Regular CSS files don't need @reference */
.button {
  @apply text-white bg-blue-500;
}
```

## Options

This rule accepts an object with the following properties:

- `fallbackReference` (string): The reference to use when auto-fixing missing
  @reference. Default: `"tailwindcss"`

Example configuration:

```js
{
  "tailwindcss/require-reference-in-vue": ["error", {
    "fallbackReference": "../styles/app.css"
  }]
}
```

## When Not To Use It

- If you're not using Vue Single File Components
- If you're using a different CSS-in-JS solution for Vue components
- If your build setup handles Tailwind CSS compilation differently

## Auto-fix

This rule provides auto-fix functionality:

- **Missing @reference**: Adds `@reference "tailwindcss";` at the beginning of the
  style block

## Further Reading

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Vue Single File Components](https://vuejs.org/guide/scaling-up/sfc.html)
- [Vite CSS Processing](https://vitejs.dev/guide/features.html#css)
