/**
 * CSS property validation utilities
 */

import type { StringWithDistance } from './types';

/**
 * Standard CSS properties with their expected value types
 * Based on CSS specifications and common browser support
 */
export const CSS_PROPERTIES = new Set([
  // Layout
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'float',
  'clear',
  'overflow',
  'overflow-x',
  'overflow-y',
  'overflow-wrap',
  'visibility',
  'clip',
  'clip-path',

  // Box Model
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'box-sizing',

  // Borders
  'border',
  'border-width',
  'border-style',
  'border-color',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-image',
  'border-collapse',
  'border-spacing',

  // Background
  'background',
  'background-color',
  'background-image',
  'background-position',
  'background-size',
  'background-repeat',
  'background-attachment',
  'background-origin',
  'background-clip',
  'background-blend-mode',

  // Typography
  'color',
  'font',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-decoration',
  'text-transform',
  'text-indent',
  'text-shadow',
  'vertical-align',
  'white-space',
  'word-break',
  'word-wrap',
  'hyphens',
  'direction',
  'unicode-bidi',
  'writing-mode',

  // Flexbox
  'flex',
  'flex-direction',
  'flex-wrap',
  'flex-flow',
  'justify-content',
  'align-items',
  'align-content',
  'align-self',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'order',
  'gap',
  'row-gap',
  'column-gap',

  // Grid
  'grid',
  'grid-template',
  'grid-template-columns',
  'grid-template-rows',
  'grid-template-areas',
  'grid-auto-columns',
  'grid-auto-rows',
  'grid-auto-flow',
  'grid-column',
  'grid-column-start',
  'grid-column-end',
  'grid-row',
  'grid-row-start',
  'grid-row-end',
  'grid-area',
  'justify-items',
  'justify-self',
  'place-items',
  'place-content',
  'place-self',

  // Lists
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',

  // Tables
  'table-layout',
  'caption-side',
  'empty-cells',

  // Transforms
  'transform',
  'transform-origin',
  'transform-style',
  'perspective',
  'perspective-origin',
  'backface-visibility',

  // Transitions & Animations
  'transition',
  'transition-property',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',

  // UI
  'cursor',
  'resize',
  'user-select',
  'pointer-events',
  'outline',
  'outline-width',
  'outline-style',
  'outline-color',
  'outline-offset',
  'opacity',
  'filter',
  'backdrop-filter',
  'mix-blend-mode',
  'isolation',

  // SVG
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',

  // Misc
  'content',
  'quotes',
  'counter-reset',
  'counter-increment',
  'page-break-before',
  'page-break-after',
  'page-break-inside',
  'orphans',
  'widows',
  'object-fit',
  'object-position',
  'will-change',
  'appearance',
  'box-shadow',
  'text-overflow',
  'touch-action',
  'scroll-behavior',
  'scroll-snap-type',
  'scroll-snap-align',
  'overscroll-behavior',

  // CSS Logical Properties
  'inline-size',
  'block-size',
  'min-inline-size',
  'min-block-size',
  'max-inline-size',
  'max-block-size',
  'margin-inline',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block',
  'margin-block-start',
  'margin-block-end',
  'padding-inline',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block',
  'padding-block-start',
  'padding-block-end',
  'border-inline',
  'border-inline-start',
  'border-inline-end',
  'border-block',
  'border-block-start',
  'border-block-end',
  'inset',
  'inset-inline',
  'inset-inline-start',
  'inset-inline-end',
  'inset-block',
  'inset-block-start',
  'inset-block-end',

  // Container Queries
  'container',
  'container-type',
  'container-name',

  // Aspect Ratio
  'aspect-ratio',

  // Scrollbar
  'scrollbar-width',
  'scrollbar-color',

  // Print
  'page',
  'size',
  'marks',
  'bleed',

  // Ruby
  'ruby-align',
  'ruby-position',

  // Columns
  'columns',
  'column-count',
  'column-width',
  'column-gap',
  'column-rule',
  'column-rule-width',
  'column-rule-style',
  'column-rule-color',
  'column-span',
  'column-fill',

  // Break
  'break-before',
  'break-after',
  'break-inside',

  // Masking
  'mask',
  'mask-image',
  'mask-mode',
  'mask-repeat',
  'mask-position',
  'mask-clip',
  'mask-origin',
  'mask-size',
  'mask-composite',

  // Color Adjust
  'color-scheme',
  'forced-color-adjust',
  'print-color-adjust',

  // Contain
  'contain',
  'contain-intrinsic-size',
  'contain-intrinsic-width',
  'contain-intrinsic-height',

  // CSS Variables
  // Note: Custom properties are handled separately
]);

/**
 * Vendor prefixes that are commonly used
 */
export const VENDOR_PREFIXES = [
  '-webkit-',
  '-moz-',
  '-ms-',
  '-o-',
];

/**
 * Check if a property name is valid
 */
export function isValidProperty(property: string): boolean {
  // Check if it's a custom property (CSS variable)
  if (property.startsWith('--')) {
    return true;
  }

  // Check standard properties
  if (CSS_PROPERTIES.has(property)) {
    return true;
  }

  // Check vendor-prefixed properties
  for (const prefix of VENDOR_PREFIXES) {
    if (property.startsWith(prefix)) {
      const unprefixed = property.slice(prefix.length);
      if (CSS_PROPERTIES.has(unprefixed)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get similar property names for suggestions
 */
export function getSimilarProperties(property: string): string[] {
  const suggestions: string[] = [];
  const normalizedInput = property.toLowerCase();

  // Direct typo corrections
  const typoMap: Record<string, string> = {
    'colour': 'color',
    'bg': 'background',
    'bg-color': 'background-color',
    'z': 'z-index',
    'align': 'text-align',
    'valign': 'vertical-align',
  };

  if (typoMap[normalizedInput]) {
    suggestions.push(typoMap[normalizedInput]);
  }

  // Find properties that start with the same letters
  for (const validProp of CSS_PROPERTIES) {
    if (validProp.startsWith(normalizedInput) && validProp !== property) {
      suggestions.push(validProp);
    }
  }

  // Find properties with similar names (Levenshtein distance)
  const similar = findSimilarStrings(property, [...CSS_PROPERTIES], 3);
  suggestions.push(...similar);

  // Remove duplicates and limit suggestions
  return [...new Set(suggestions)].slice(0, 3);
}

/**
 * Simple Levenshtein distance implementation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let index = 0; index <= a.length; index++) {
    matrix[0][index] = index;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let index = 1; index <= a.length; index++) {
      matrix[i][index] = b.charAt(i - 1) === a.charAt(index - 1)
        ? matrix[i - 1][index - 1]
        : Math.min(
          matrix[i - 1][index - 1] + 1,
          matrix[i][index - 1] + 1,
          matrix[i - 1][index] + 1,
        );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find strings similar to the input
 */
function findSimilarStrings(
  input: string,
  candidates: string[],
  maxDistance: number,
): string[] {
  const candidatesWithDistance: StringWithDistance[] = candidates
    .map(candidate => ({
      value: candidate,
      distance: levenshteinDistance(input.toLowerCase(), candidate.toLowerCase()),
    }));

  return candidatesWithDistance
    .filter(item => item.distance <= maxDistance && item.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.value);
}
