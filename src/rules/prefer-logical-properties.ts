import css from '@eslint/css';

/**
 * Wrapper for \@eslint/css prefer-logical-properties rule
 * Encourages use of logical properties over physical ones for better i18n support
 *
 * This rule is auto-fixable and helps modernize CSS for better internationalization.
 * It replaces physical properties (left, right, top, bottom) with logical ones
 * (inline-start, inline-end, block-start, block-end).
 */
export const preferLogicalProperties = css.rules['prefer-logical-properties'];
