# no-duplicate-reference

Disallow duplicate @reference directives.

## Rule Details

In Tailwind CSS v4, the `@reference` directive is used to import Tailwind styles
for reference without including them in the output. This is particularly useful
for component-scoped styles in frameworks like Vue, Svelte, or Astro.

While multiple `@reference` directives with different values are allowed,
having duplicate references to the same source is redundant and can lead to
confusion. This rule helps maintain clean and efficient stylesheets by
preventing duplicate `@reference` directives.

Examples of **incorrect** code for this rule:

```css
/* ❌ Error: Duplicate reference */
@reference "tailwindcss";
@reference "tailwindcss";

/* ❌ Error: Same reference with different quotes */
@reference "custom-theme";
@reference 'custom-theme';

/* ❌ Error: Same reference with url() syntax */
@reference "styles.css";
@reference url("styles.css");
```

Examples of **correct** code for this rule:

```css
/* ✅ Good: Single reference */
@reference "tailwindcss";

/* ✅ Good: Different references */
@reference "tailwindcss";
@reference "./custom-utilities.css";

/* ✅ Good: Multiple unique references */
@reference "../theme/colors.css";
@reference "../theme/typography.css";
@reference "../theme/spacing.css";
```

## Options

This rule has no options.

## When Not To Use It

You might want to disable this rule if:

- You have a build tool that specifically requires duplicate `@reference`
  directives for some reason
- You're working with generated CSS where duplicates are intentionally created
- You're in a migration phase where temporary duplicates are acceptable

## Further Reading

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Modules with Tailwind CSS](https://tailwindcss.com/docs/using-with-preprocessors#using-with-css-modules)
