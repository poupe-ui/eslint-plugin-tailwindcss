import css from '@eslint/css';

/**
 * Wrapper for \@eslint/css relative-font-units rule
 * Prefers rem/em over px for better accessibility
 */
export const relativeFontUnits = css.rules['relative-font-units'];
