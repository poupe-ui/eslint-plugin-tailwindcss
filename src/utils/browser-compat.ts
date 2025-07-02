/**
 * Browser compatibility data for CSS features
 * Based on MDN baseline data and browser support information
 */

export type BaselineStatus = 'limited-availability' | 'newly-available' | 'widely-available';

export interface CSSFeature {
  name: string
  status: BaselineStatus
  alternativeSuggestion?: string
  mdn?: string
}

/**
 * CSS properties and their baseline status
 * Limited availability features should be flagged by use-baseline rule
 */
export const CSS_FEATURES = new Map<string, CSSFeature>([
  // Widely available features (safe to use)
  ['display', { name: 'display', status: 'widely-available' }],
  ['position', { name: 'position', status: 'widely-available' }],
  ['color', { name: 'color', status: 'widely-available' }],
  ['background', { name: 'background', status: 'widely-available' }],
  ['border', { name: 'border', status: 'widely-available' }],
  ['margin', { name: 'margin', status: 'widely-available' }],
  ['padding', { name: 'padding', status: 'widely-available' }],
  ['width', { name: 'width', status: 'widely-available' }],
  ['height', { name: 'height', status: 'widely-available' }],
  ['font-size', { name: 'font-size', status: 'widely-available' }],
  ['flex', { name: 'flex', status: 'widely-available' }],
  ['grid', { name: 'grid', status: 'widely-available' }],
  ['transform', { name: 'transform', status: 'widely-available' }],
  ['transition', { name: 'transition', status: 'widely-available' }],
  ['animation', { name: 'animation', status: 'widely-available' }],
  ['box-shadow', { name: 'box-shadow', status: 'widely-available' }],
  ['border-radius', { name: 'border-radius', status: 'widely-available' }],
  ['opacity', { name: 'opacity', status: 'widely-available' }],
  ['z-index', { name: 'z-index', status: 'widely-available' }],
  ['overflow', { name: 'overflow', status: 'widely-available' }],
  ['cursor', { name: 'cursor', status: 'widely-available' }],
  ['pointer-events', { name: 'pointer-events', status: 'widely-available' }],
  ['user-select', { name: 'user-select', status: 'widely-available' }],
  ['object-fit', { name: 'object-fit', status: 'widely-available' }],
  ['object-position', { name: 'object-position', status: 'widely-available' }],
  ['clip-path', { name: 'clip-path', status: 'widely-available' }],
  ['filter', { name: 'filter', status: 'widely-available' }],
  ['backdrop-filter', { name: 'backdrop-filter', status: 'widely-available' }],
  ['mix-blend-mode', { name: 'mix-blend-mode', status: 'widely-available' }],
  ['isolation', { name: 'isolation', status: 'widely-available' }],
  ['will-change', { name: 'will-change', status: 'widely-available' }],
  ['contain', { name: 'contain', status: 'widely-available' }],
  ['touch-action', { name: 'touch-action', status: 'widely-available' }],

  // CSS Grid (widely available)
  ['grid-template-columns', { name: 'grid-template-columns', status: 'widely-available' }],
  ['grid-template-rows', { name: 'grid-template-rows', status: 'widely-available' }],
  ['grid-template-areas', { name: 'grid-template-areas', status: 'widely-available' }],
  ['grid-column', { name: 'grid-column', status: 'widely-available' }],
  ['grid-row', { name: 'grid-row', status: 'widely-available' }],
  ['gap', { name: 'gap', status: 'widely-available' }],
  ['row-gap', { name: 'row-gap', status: 'widely-available' }],
  ['column-gap', { name: 'column-gap', status: 'widely-available' }],

  // Flexbox (widely available)
  ['flex-direction', { name: 'flex-direction', status: 'widely-available' }],
  ['flex-wrap', { name: 'flex-wrap', status: 'widely-available' }],
  ['justify-content', { name: 'justify-content', status: 'widely-available' }],
  ['align-items', { name: 'align-items', status: 'widely-available' }],
  ['align-self', { name: 'align-self', status: 'widely-available' }],
  ['flex-grow', { name: 'flex-grow', status: 'widely-available' }],
  ['flex-shrink', { name: 'flex-shrink', status: 'widely-available' }],
  ['flex-basis', { name: 'flex-basis', status: 'widely-available' }],

  // Custom properties (widely available)
  ['--*', { name: 'CSS Custom Properties', status: 'widely-available' }],

  // Newly available features (use with caution)
  ['container', { name: 'container', status: 'newly-available' }],
  ['container-type', { name: 'container-type', status: 'newly-available' }],
  ['container-name', { name: 'container-name', status: 'newly-available' }],
  ['aspect-ratio', { name: 'aspect-ratio', status: 'newly-available' }],
  ['content-visibility', { name: 'content-visibility', status: 'newly-available' }],
  ['contain-intrinsic-size', { name: 'contain-intrinsic-size', status: 'newly-available' }],
  ['overscroll-behavior', { name: 'overscroll-behavior', status: 'newly-available' }],
  ['scroll-behavior', { name: 'scroll-behavior', status: 'newly-available' }],
  ['scroll-snap-type', { name: 'scroll-snap-type', status: 'newly-available' }],
  ['scroll-snap-align', { name: 'scroll-snap-align', status: 'newly-available' }],
  ['accent-color', { name: 'accent-color', status: 'newly-available' }],
  ['color-scheme', { name: 'color-scheme', status: 'newly-available' }],
  ['forced-color-adjust', { name: 'forced-color-adjust', status: 'newly-available' }],
  ['print-color-adjust', { name: 'print-color-adjust', status: 'newly-available' }],
  ['place-content', { name: 'place-content', status: 'newly-available' }],
  ['place-items', { name: 'place-items', status: 'newly-available' }],
  ['place-self', { name: 'place-self', status: 'newly-available' }],
  ['overflow-anchor', { name: 'overflow-anchor', status: 'newly-available' }],
  ['overscroll-behavior-x', { name: 'overscroll-behavior-x', status: 'newly-available' }],
  ['overscroll-behavior-y', { name: 'overscroll-behavior-y', status: 'newly-available' }],
  ['text-decoration-thickness', { name: 'text-decoration-thickness', status: 'newly-available' }],
  ['text-underline-offset', { name: 'text-underline-offset', status: 'newly-available' }],
  ['text-decoration-skip-ink', { name: 'text-decoration-skip-ink', status: 'newly-available' }],

  // Limited availability features (should be flagged)
  ['anchor-name', {
    name: 'anchor-name',
    status: 'limited-availability',
    alternativeSuggestion: 'Use absolute positioning or JavaScript for anchor positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name',
  }],
  ['position-anchor', {
    name: 'position-anchor',
    status: 'limited-availability',
    alternativeSuggestion: 'Use absolute positioning or JavaScript for anchor positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position-anchor',
  }],
  ['anchor-size', {
    name: 'anchor-size',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript to calculate sizes',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size',
  }],
  ['position-try', {
    name: 'position-try',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript for dynamic positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position-try',
  }],
  ['position-try-order', {
    name: 'position-try-order',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript for dynamic positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-order',
  }],
  ['position-try-options', {
    name: 'position-try-options',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript for dynamic positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-options',
  }],
  ['animation-timeline', {
    name: 'animation-timeline',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript-based scroll animations',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline',
  }],
  ['animation-range', {
    name: 'animation-range',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript-based scroll animations',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range',
  }],
  ['animation-range-start', {
    name: 'animation-range-start',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript-based scroll animations',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range-start',
  }],
  ['animation-range-end', {
    name: 'animation-range-end',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript-based scroll animations',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range-end',
  }],
  ['timeline-scope', {
    name: 'timeline-scope',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript-based animations',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/timeline-scope',
  }],
  ['view-timeline', {
    name: 'view-timeline',
    status: 'limited-availability',
    alternativeSuggestion: 'Use Intersection Observer API',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-timeline',
  }],
  ['view-timeline-name', {
    name: 'view-timeline-name',
    status: 'limited-availability',
    alternativeSuggestion: 'Use Intersection Observer API',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-timeline-name',
  }],
  ['view-timeline-axis', {
    name: 'view-timeline-axis',
    status: 'limited-availability',
    alternativeSuggestion: 'Use Intersection Observer API',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-timeline-axis',
  }],
  ['view-timeline-inset', {
    name: 'view-timeline-inset',
    status: 'limited-availability',
    alternativeSuggestion: 'Use Intersection Observer API',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-timeline-inset',
  }],
  ['scroll-timeline', {
    name: 'scroll-timeline',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript scroll event listeners',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline',
  }],
  ['scroll-timeline-name', {
    name: 'scroll-timeline-name',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript scroll event listeners',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline-name',
  }],
  ['scroll-timeline-axis', {
    name: 'scroll-timeline-axis',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript scroll event listeners',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-timeline-axis',
  }],
  ['view-transition-name', {
    name: 'view-transition-name',
    status: 'limited-availability',
    alternativeSuggestion: 'Use CSS animations or JavaScript transitions',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name',
  }],
  ['view-transition-class', {
    name: 'view-transition-class',
    status: 'limited-availability',
    alternativeSuggestion: 'Use CSS animations or JavaScript transitions',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class',
  }],
  ['overlay', {
    name: 'overlay',
    status: 'limited-availability',
    alternativeSuggestion: 'Use z-index for layering',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/overlay',
  }],
  ['field-sizing', {
    name: 'field-sizing',
    status: 'limited-availability',
    alternativeSuggestion: 'Use width and height properties',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing',
  }],
]);

/**
 * CSS at-rules and their baseline status
 */
export const CSS_AT_RULES = new Map<string, CSSFeature>([
  // Widely available
  ['@import', { name: '@import', status: 'widely-available' }],
  ['@media', { name: '@media', status: 'widely-available' }],
  ['@supports', { name: '@supports', status: 'widely-available' }],
  ['@keyframes', { name: '@keyframes', status: 'widely-available' }],
  ['@font-face', { name: '@font-face', status: 'widely-available' }],
  ['@page', { name: '@page', status: 'widely-available' }],
  ['@namespace', { name: '@namespace', status: 'widely-available' }],
  ['@charset', { name: '@charset', status: 'widely-available' }],
  ['@property', { name: '@property', status: 'widely-available' }],

  // Newly available
  ['@layer', { name: '@layer', status: 'newly-available' }],
  ['@container', { name: '@container', status: 'newly-available' }],
  ['@scope', { name: '@scope', status: 'newly-available' }],

  // Limited availability
  ['@starting-style', {
    name: '@starting-style',
    status: 'limited-availability',
    alternativeSuggestion: 'Use CSS animations with from/to keyframes',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style',
  }],
  ['@position-try', {
    name: '@position-try',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript for dynamic positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@position-try',
  }],
  ['@view-transition', {
    name: '@view-transition',
    status: 'limited-availability',
    alternativeSuggestion: 'Use CSS animations or JavaScript transitions',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition',
  }],
]);

/**
 * CSS pseudo-classes and their baseline status
 */
export const CSS_PSEUDO_CLASSES = new Map<string, CSSFeature>([
  // Widely available
  [':hover', { name: ':hover', status: 'widely-available' }],
  [':active', { name: ':active', status: 'widely-available' }],
  [':focus', { name: ':focus', status: 'widely-available' }],
  [':visited', { name: ':visited', status: 'widely-available' }],
  [':link', { name: ':link', status: 'widely-available' }],
  [':first-child', { name: ':first-child', status: 'widely-available' }],
  [':last-child', { name: ':last-child', status: 'widely-available' }],
  [':nth-child', { name: ':nth-child', status: 'widely-available' }],
  [':nth-of-type', { name: ':nth-of-type', status: 'widely-available' }],
  [':not', { name: ':not', status: 'widely-available' }],
  [':disabled', { name: ':disabled', status: 'widely-available' }],
  [':checked', { name: ':checked', status: 'widely-available' }],
  [':target', { name: ':target', status: 'widely-available' }],
  [':root', { name: ':root', status: 'widely-available' }],
  [':empty', { name: ':empty', status: 'widely-available' }],

  // Newly available
  [':is', { name: ':is', status: 'newly-available' }],
  [':where', { name: ':where', status: 'newly-available' }],
  [':has', { name: ':has', status: 'newly-available' }],
  [':focus-visible', { name: ':focus-visible', status: 'newly-available' }],
  [':focus-within', { name: ':focus-within', status: 'newly-available' }],
  [':placeholder-shown', { name: ':placeholder-shown', status: 'newly-available' }],

  // Limited availability
  [':user-valid', {
    name: ':user-valid',
    status: 'limited-availability',
    alternativeSuggestion: 'Use :valid with JavaScript validation',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid',
  }],
  [':user-invalid', {
    name: ':user-invalid',
    status: 'limited-availability',
    alternativeSuggestion: 'Use :invalid with JavaScript validation',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid',
  }],
  [':popover-open', {
    name: ':popover-open',
    status: 'limited-availability',
    alternativeSuggestion: 'Use class-based state management',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:popover-open',
  }],
  [':state', {
    name: ':state',
    status: 'limited-availability',
    alternativeSuggestion: 'Use class-based state management',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:state',
  }],
]);

/**
 * CSS functions and their baseline status
 */
export const CSS_FUNCTIONS = new Map<string, CSSFeature>([
  // Widely available
  ['calc', { name: 'calc()', status: 'widely-available' }],
  ['var', { name: 'var()', status: 'widely-available' }],
  ['url', { name: 'url()', status: 'widely-available' }],
  ['rgb', { name: 'rgb()', status: 'widely-available' }],
  ['rgba', { name: 'rgba()', status: 'widely-available' }],
  ['hsl', { name: 'hsl()', status: 'widely-available' }],
  ['hsla', { name: 'hsla()', status: 'widely-available' }],
  ['linear-gradient', { name: 'linear-gradient()', status: 'widely-available' }],
  ['radial-gradient', { name: 'radial-gradient()', status: 'widely-available' }],
  ['conic-gradient', { name: 'conic-gradient()', status: 'widely-available' }],
  ['rotate', { name: 'rotate()', status: 'widely-available' }],
  ['scale', { name: 'scale()', status: 'widely-available' }],
  ['translate', { name: 'translate()', status: 'widely-available' }],
  ['matrix', { name: 'matrix()', status: 'widely-available' }],
  ['cubic-bezier', { name: 'cubic-bezier()', status: 'widely-available' }],
  ['steps', { name: 'steps()', status: 'widely-available' }],
  ['blur', { name: 'blur()', status: 'widely-available' }],
  ['brightness', { name: 'brightness()', status: 'widely-available' }],
  ['contrast', { name: 'contrast()', status: 'widely-available' }],
  ['grayscale', { name: 'grayscale()', status: 'widely-available' }],
  ['invert', { name: 'invert()', status: 'widely-available' }],
  ['opacity', { name: 'opacity()', status: 'widely-available' }],
  ['saturate', { name: 'saturate()', status: 'widely-available' }],
  ['sepia', { name: 'sepia()', status: 'widely-available' }],
  ['drop-shadow', { name: 'drop-shadow()', status: 'widely-available' }],
  ['minmax', { name: 'minmax()', status: 'widely-available' }],
  ['repeat', { name: 'repeat()', status: 'widely-available' }],
  ['fit-content', { name: 'fit-content()', status: 'widely-available' }],
  ['clamp', { name: 'clamp()', status: 'widely-available' }],
  ['min', { name: 'min()', status: 'widely-available' }],
  ['max', { name: 'max()', status: 'widely-available' }],
  ['env', { name: 'env()', status: 'widely-available' }],
  ['attr', { name: 'attr()', status: 'widely-available' }],

  // Newly available
  ['hwb', { name: 'hwb()', status: 'newly-available' }],
  ['lab', { name: 'lab()', status: 'newly-available' }],
  ['lch', { name: 'lch()', status: 'newly-available' }],
  ['oklab', { name: 'oklab()', status: 'newly-available' }],
  ['oklch', { name: 'oklch()', status: 'newly-available' }],
  ['color', { name: 'color()', status: 'newly-available' }],
  ['color-mix', { name: 'color-mix()', status: 'newly-available' }],
  ['sin', { name: 'sin()', status: 'newly-available' }],
  ['cos', { name: 'cos()', status: 'newly-available' }],
  ['tan', { name: 'tan()', status: 'newly-available' }],
  ['asin', { name: 'asin()', status: 'newly-available' }],
  ['acos', { name: 'acos()', status: 'newly-available' }],
  ['atan', { name: 'atan()', status: 'newly-available' }],
  ['atan2', { name: 'atan2()', status: 'newly-available' }],
  ['pow', { name: 'pow()', status: 'newly-available' }],
  ['sqrt', { name: 'sqrt()', status: 'newly-available' }],
  ['hypot', { name: 'hypot()', status: 'newly-available' }],
  ['log', { name: 'log()', status: 'newly-available' }],
  ['exp', { name: 'exp()', status: 'newly-available' }],
  ['abs', { name: 'abs()', status: 'newly-available' }],
  ['sign', { name: 'sign()', status: 'newly-available' }],
  ['round', { name: 'round()', status: 'newly-available' }],
  ['mod', { name: 'mod()', status: 'newly-available' }],
  ['rem', { name: 'rem()', status: 'newly-available' }],

  // Limited availability
  ['anchor', {
    name: 'anchor()',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript for dynamic positioning',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/anchor',
  }],
  ['anchor-size', {
    name: 'anchor-size()',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript to calculate sizes',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size',
  }],
  ['toggle', {
    name: 'toggle()',
    status: 'limited-availability',
    alternativeSuggestion: 'Use CSS custom properties with JavaScript',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/toggle',
  }],
  ['sibling-count', {
    name: 'sibling-count()',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript to count siblings',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-count',
  }],
  ['sibling-index', {
    name: 'sibling-index()',
    status: 'limited-availability',
    alternativeSuggestion: 'Use JavaScript to get element index',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index',
  }],
]);

/**
 * Check if a property has vendor prefix
 * @param property - The CSS property name to check
 * @returns True if the property has a vendor prefix (-webkit-, -moz-, -ms-, -o-)
 */
export function hasVendorPrefix(property: string): boolean {
  return /^-(webkit|moz|ms|o)-/.test(property);
}

/**
 * Get vendor prefix from property
 * @param property - The CSS property name to extract prefix from
 * @returns The vendor prefix (e.g., '-webkit-') or undefined if no prefix
 */
export function getVendorPrefix(property: string): string | undefined {
  const match = property.match(/^-(webkit|moz|ms|o)-/);
  return match ? match[0] : undefined;
}

/**
 * Get baseline status for a CSS feature
 * @param name - The name of the CSS feature (property, at-rule, pseudo-class, or function)
 * @param type - The type of CSS feature to look up
 * @returns The CSS feature information including baseline status, or undefined if not found
 */
export function getFeatureStatus(
  name: string,
  type: 'at-rule' | 'function' | 'property' | 'pseudo-class',
): CSSFeature | undefined {
  // Check for vendor prefix first
  if (hasVendorPrefix(name)) {
    const unprefixed = name.replace(/^-(webkit|moz|ms|o)-/, '');
    return {
      name: name,
      status: 'limited-availability',
      alternativeSuggestion: `Use standard '${unprefixed}' property instead of vendor prefix`,
    };
  }

  // Check for custom properties
  if (type === 'property' && name.startsWith('--')) {
    return CSS_FEATURES.get('--*');
  }

  switch (type) {
    case 'property':
      return CSS_FEATURES.get(name);
    case 'at-rule':
      return CSS_AT_RULES.get(name);
    case 'pseudo-class':
      return CSS_PSEUDO_CLASSES.get(name);
    case 'function':
      return CSS_FUNCTIONS.get(name);
    default:
      return undefined;
  }
}

/**
 * Options for use-baseline rule
 */
export interface UseBaselineOptions {
  /**
   * Strictness level for baseline checking
   * - 'limited': Only flag limited availability features (default)
   * - 'newly': Flag both limited and newly available features
   * - 'ignore': List of features to ignore
   */
  strictness?: 'limited' | 'newly'
  ignore?: string[]
}
