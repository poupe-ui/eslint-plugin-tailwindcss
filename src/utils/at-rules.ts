/**
 * CSS at-rule validation utilities
 * Shared between parser and validation rules
 */

/* eslint-disable unicorn/no-null -- Required to match @eslint/css-tree types */

import type { AtRuleSyntax, StringWithDistance } from './types';

/**
 * Configuration for Tailwind v4 at-rules with their syntax
 * This is the single source of truth for Tailwind at-rule definitions
 */
export const TAILWIND_AT_RULE_DEFINITIONS: Record<string, AtRuleSyntax> = {
  'apply': {
    prelude: '<custom-ident>+',
  },
  'theme': {
    prelude: null,
    descriptors: {
      '--*': '<any-value>',
    },
  },
  'source': {
    prelude: '<string>',
  },
  'utility': {
    prelude: '<custom-ident>',
    descriptors: {
      '*': '<any-value>',
    },
  },
  'variant': {
    prelude: '<custom-ident>',
  },
  'custom-variant': {
    prelude: '<custom-ident>',
  },
  'reference': {
    prelude: '<string> | <url>',
  },
  'config': {
    prelude: '<string>',
  },
  'plugin': {
    prelude: '<string>',
  },
  'layer': {
    prelude: 'base | components | utilities | <custom-ident>',
  },
  'tailwind': {
    prelude: 'base | components | utilities | variants',
  },
  'slot': {
    prelude: null,
  },
};

/**
 * Standard CSS `@import` with Tailwind extension
 */
export const IMPORT_AT_RULE_DEFINITION: AtRuleSyntax = {
  prelude: '<string> | <url> | "tailwindcss"',
};

/**
 * Tailwind CSS v4 specific at-rules
 * Generated from TAILWIND_AT_RULE_DEFINITIONS for consistency
 */
export const TAILWIND_AT_RULES = new Set(Object.keys(TAILWIND_AT_RULE_DEFINITIONS));

/**
 * Standard CSS at-rules
 */
export const STANDARD_AT_RULES = new Set([
  // Core CSS at-rules
  'charset',
  'import',
  'namespace',

  // Conditional rules
  'media',
  'supports',
  'document', // Deprecated but may still be used

  // Descriptive rules
  'font-face',
  'page',
  'font-feature-values',
  'font-palette-values',
  'counter-style',
  'property',

  // Animation
  'keyframes',

  // Layout
  'container',
  'scope',
  'starting-style',
  'layer', // CSS cascade layers (different from Tailwind's @layer)

  // Viewport (deprecated but still in use)
  'viewport',

  // Print
  'top-left-corner',
  'top-left',
  'top-center',
  'top-right',
  'top-right-corner',
  'bottom-left-corner',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'bottom-right-corner',
  'left-top',
  'left-middle',
  'left-bottom',
  'right-top',
  'right-middle',
  'right-bottom',
]);

/**
 * At-rules that require a block
 */
export const AT_RULES_WITH_BLOCK = new Set([
  // Tailwind at-rules
  'theme',
  'utility',
  'custom-variant',

  // Standard CSS at-rules
  'media',
  'supports',
  'document',
  'keyframes',
  'font-face',
  'page',
  'font-feature-values',
  'font-palette-values',
  'counter-style',
  'property',
  'container',
  'scope',
  'starting-style',
]);

/**
 * At-rules that should NOT have a block
 */
export const AT_RULES_WITHOUT_BLOCK = new Set([
  'charset',
  'import',
  'namespace',
  'apply',
  'source',
  'reference',
  'config',
  'plugin',
  'tailwind',
  'slot',
]);

/**
 * At-rules that can optionally have a block
 */
export const AT_RULES_OPTIONAL_BLOCK = new Set([
  'variant',
  'layer', // Can be used with or without block
]);

/**
 * Check if an at-rule name is valid
 */
export function isValidAtRule(name: string): boolean {
  return TAILWIND_AT_RULES.has(name) || STANDARD_AT_RULES.has(name);
}

/**
 * Check if an at-rule should have a block
 */
export function shouldHaveBlock(name: string): boolean | undefined {
  if (AT_RULES_WITH_BLOCK.has(name)) return true;
  if (AT_RULES_WITHOUT_BLOCK.has(name)) return false;
  if (AT_RULES_OPTIONAL_BLOCK.has(name)) return undefined;
  return undefined;
}

/**
 * Get similar at-rule names for suggestions
 */
export function getSimilarAtRules(name: string): string[] {
  const allAtRules = [...TAILWIND_AT_RULES, ...STANDARD_AT_RULES];
  const suggestions: string[] = [];

  // Direct typo corrections
  const typoMap: Record<string, string> = {
    'imoprt': 'import',
    'improt': 'import',
    'imort': 'import',
    'impor': 'import',
    'meida': 'media',
    'meda': 'media',
    'suports': 'supports',
    'support': 'supports',
    'keyframs': 'keyframes',
    'keyframe': 'keyframes',
    'fontface': 'font-face',
    'font-faces': 'font-face',
    'charst': 'charset',
    'charsett': 'charset',
    'namesapce': 'namespace',
    'namepsace': 'namespace',
    'aply': 'apply',
    'appli': 'apply',
    'appl': 'apply',
    'them': 'theme',
    'themee': 'theme',
    'utilty': 'utility',
    'utiliti': 'utility',
    'utilitie': 'utility',
    'varaint': 'variant',
    'vairant': 'variant',
    'variants': 'variant',
    'layar': 'layer',
    'layers': 'layer',
    'tailwnd': 'tailwind',
    'tailwid': 'tailwind',
  };

  const normalized = name.toLowerCase();
  if (typoMap[normalized]) {
    suggestions.push(typoMap[normalized]);
  }

  // Find at-rules that start with the same letters
  for (const atRule of allAtRules) {
    if (atRule.startsWith(normalized) && atRule !== name) {
      suggestions.push(atRule);
    }
  }

  // Find similar at-rules using Levenshtein distance
  const similar = findSimilarStrings(name, allAtRules, 2);
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
