# no-invalid-named-grid-areas

Disallow invalid named grid areas in CSS Grid templates.

## Rule Details

This rule validates that CSS Grid template areas are properly formed. Grid
areas must:

1. Contain at least one cell token (not be empty)
2. Have the same number of columns in each row
3. Form rectangular areas (named tokens must be contiguous and rectangular)

The rule checks properties:

- `grid-template-areas`
- `grid-template`
- `grid`

Examples of **incorrect** code for this rule:

```css
/* ❌ Empty grid area */
.grid {
  grid-template-areas: "";
}

/* ❌ Uneven number of columns */
.grid {
  grid-template-areas:
    "header header header"
    "nav main";  /* Only 2 columns */
}

/* ❌ Non-rectangular area */
.grid {
  grid-template-areas:
    "header header header"
    "nav    main   header"; /* header is not rectangular */
}

/* ❌ Disconnected area */
.grid {
  grid-template-areas:
    "a . a"  /* 'a' is split */
    "b b b";
}
```

Examples of **correct** code for this rule:

```css
/* ✅ Valid rectangular grid */
.grid {
  grid-template-areas:
    "header header header"
    "nav    main   main"
    "nav    footer footer";
}

/* ✅ Using dots for empty cells */
.grid {
  grid-template-areas:
    "header header ."
    "nav    main   ."
    "footer footer footer";
}

/* ✅ Multiple dots allowed */
.grid {
  grid-template-areas:
    "... header header"
    "nav main   main"
    "nav ...    ...";
}

/* ✅ None value */
.grid {
  grid-template-areas: none;
}
```

## Options

This rule has no options.

## When Not To Use It

If you're not using CSS Grid or have a build process that validates grid
areas, you may want to disable this rule.

## Further Reading

- [MDN: grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
- [CSS Grid Layout Specification](https://www.w3.org/TR/css-grid-1/#grid-template-areas-property)
