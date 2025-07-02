import type { CssLocationRange, StyleSheetPlain } from '@eslint/css-tree';

import { getChildrenOfType, getDeclarations, isAtRule } from './ast';

/**
 * Represents a theme value from `@theme` blocks
 */
export interface ThemeValue {
  name: string
  value: string
  loc: CssLocationRange
}

/**
 * Represents a theme token with similarity score
 */
interface TokenSuggestion {
  token: string
  score: number
}

/**
 * Extract theme values from the CSS AST
 */
export function extractThemeValues(ast: StyleSheetPlain, sourceText: string): Map<string, ThemeValue> {
  const themeValues = new Map<string, ThemeValue>();

  // Find all @theme blocks
  const themeRules = getChildrenOfType(ast, 'Atrule').filter(rule =>
    isAtRule(rule, 'theme'),
  );

  for (const themeRule of themeRules) {
    const declarations = getDeclarations(themeRule);

    for (const decl of declarations) {
      if (decl.property.startsWith('--') && decl.value.loc && decl.loc) {
        const value = sourceText.slice(
          decl.value.loc.start.offset,
          decl.value.loc.end.offset,
        );

        themeValues.set(decl.property, {
          name: decl.property,
          value: value.trim(),
          loc: decl.loc,
        });
      }
    }
  }

  return themeValues;
}

/**
 * Common theme categories in Tailwind CSS
 */
export const THEME_CATEGORIES = {
  colors: [
    '--color-',
    '--bg-',
    '--text-',
    '--border-',
    '--ring-',
    '--outline-',
  ],
  spacing: [
    '--spacing-',
    '--space-',
    '--gap-',
    '--p-',
    '--m-',
    '--w-',
    '--h-',
  ],
  sizing: [
    '--width-',
    '--height-',
    '--size-',
    '--min-',
    '--max-',
  ],
  typography: [
    '--font-',
    '--text-',
    '--leading-',
    '--tracking-',
  ],
  borders: [
    '--rounded-',
    '--border-',
    '--divide-',
  ],
  effects: [
    '--shadow-',
    '--opacity-',
    '--blur-',
    '--brightness-',
    '--contrast-',
  ],
  animation: [
    '--animate-',
    '--transition-',
    '--duration-',
    '--delay-',
  ],
} as const;

/**
 * Determine the category of a theme token
 */
export function getThemeCategory(
  tokenName: string,
): 'other' | keyof typeof THEME_CATEGORIES {
  for (const [category, prefixes] of Object.entries(THEME_CATEGORIES)) {
    if (prefixes.some(prefix => tokenName.startsWith(prefix))) {
      return category as keyof typeof THEME_CATEGORIES;
    }
  }
  return 'other';
}

/**
 * Check if a value references a theme token
 */
export function hasThemeReference(value: string): boolean {
  // Check for theme() function
  if (/theme\([^)]+\)/.test(value)) {
    return true;
  }

  // Check for CSS variable usage
  if (/var\(--[^)]+\)/.test(value)) {
    return true;
  }

  return false;
}

/**
 * Extract theme function calls from a value
 */
export function extractThemeFunctions(value: string): string[] {
  const matches = value.match(/theme\(([^)]+)\)/g);
  if (!matches) return [];

  return matches.map((match) => {
    const content = match.match(/theme\(([^)]+)\)/)?.[1] || '';
    // Remove quotes if present
    return content.replaceAll(/^['"]|['"]$/g, '').trim();
  });
}

/**
 * Validate if a theme path exists in the theme values
 */
export function isValidThemePath(
  path: string,
  themeValues: Map<string, ThemeValue>,
): boolean {
  // Convert dot notation to CSS variable format
  // e.g., "colors.primary" -> "--color-primary"
  const segments = path.split('.');
  if (segments.length === 0) return false;

  // Try different possible CSS variable formats
  const possibleVars = [
    `--${segments.join('-')}`,
    `--${segments[0]}-${segments.slice(1).join('-')}`,
    `--${path.replaceAll('.', '-')}`,
  ];

  return possibleVars.some(variableName => themeValues.has(variableName));
}

/**
 * Suggest similar theme tokens for a given path
 */
export function suggestSimilarTokens(
  path: string,
  themeValues: Map<string, ThemeValue>,
  maxSuggestions: number = 3,
): string[] {
  const normalizedPath = path.toLowerCase().replaceAll(/[.-]/g, '');
  const suggestions: TokenSuggestion[] = [];

  for (const [token] of themeValues) {
    const normalizedToken = token.toLowerCase().replaceAll(/[.-]/g, '');
    const score = calculateSimilarity(normalizedPath, normalizedToken);

    if (score > 0.5) {
      suggestions.push({ token, score });
    }
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .map(s => s.token);
}

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(string1: string, string2: string): number {
  const length1 = string1.length;
  const length2 = string2.length;
  const maxLength = Math.max(length1, length2);

  if (maxLength === 0) return 1;

  // Simple Levenshtein distance-based similarity
  const distance = levenshteinDistance(string1, string2);
  return 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(string1: string, string2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= string2.length; i++) {
    matrix[i] = [i];
  }

  for (let index = 0; index <= string1.length; index++) {
    matrix[0][index] = index;
  }

  for (let i = 1; i <= string2.length; i++) {
    for (let index = 1; index <= string1.length; index++) {
      matrix[i][index] = string2[i - 1] === string1[index - 1] ?
        matrix[i - 1][index - 1] :
        Math.min(
          matrix[i - 1][index - 1] + 1,
          matrix[i][index - 1] + 1,
          matrix[i - 1][index] + 1,
        );
    }
  }

  return matrix[string2.length][string1.length];
}
