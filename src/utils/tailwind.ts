import type { CSSSourceCode } from '@eslint/css';
import type { AtrulePreludePlain, Raw } from '@eslint/css-tree';

/**
 * List of Tailwind CSS v4 at-rules
 */
export const TAILWIND_AT_RULES = [
  'apply',
  'theme',
  'source',
  'utility',
  'variant',
  'custom-variant',
  'reference',
  'config',
  'plugin',
  'layer',
  'tailwind',
] as const;

export type TailwindAtRule = typeof TAILWIND_AT_RULES[number];

/**
 * Check if an at-rule is a Tailwind directive
 */
export function isTailwindAtRule(name: string): name is TailwindAtRule {
  return TAILWIND_AT_RULES.includes(name as TailwindAtRule);
}

/**
 * Extract utility classes from an `@apply` rule
 */
export function extractUtilitiesFromApply(
  prelude: AtrulePreludePlain | Raw | null,
  sourceCode: CSSSourceCode,
): string[] {
  if (!prelude || !prelude.loc) return [];

  const text = sourceCode.text.slice(
    prelude.loc.start.offset,
    prelude.loc.end.offset,
  );

  // Remove CSS escape sequences
  const unescapedText = text.replaceAll(/\\(.)/g, '$1');

  // Split by whitespace and filter empty strings
  return unescapedText.split(/\s+/).filter(Boolean);
}

/**
 * Check if a value contains arbitrary values (values in square brackets)
 */
export function hasArbitraryValue(value: string): boolean {
  return /\[[^\]]+\]/.test(value);
}

/**
 * Count arbitrary values in a string
 */
export function countArbitraryValues(value: string): number {
  const matches = value.match(/\[[^\]]+\]/g);
  return matches ? matches.length : 0;
}

/**
 * Parse a Tailwind utility class into its components
 */
export interface ParsedUtility {
  modifiers: string[]
  utility: string
  arbitraryValue?: string
}

export function parseUtilityClass(className: string): ParsedUtility {
  const modifiers: string[] = [];
  let remaining = className;

  // Extract modifiers by looking for colons not inside brackets
  while (true) {
    let colonIndex = -1;
    let bracketDepth = 0;

    // Find the first colon that's not inside brackets
    for (const [i, element] of [...remaining].entries()) {
      if (element === '[') {
        bracketDepth++;
      } else if (element === ']') {
        bracketDepth--;
      } else if (element === ':' && bracketDepth === 0) {
        colonIndex = i;
        break;
      }
    }

    if (colonIndex === -1) {
      // No more modifiers
      break;
    }

    // Extract the modifier
    const modifier = remaining.slice(0, colonIndex);
    modifiers.push(modifier);
    remaining = remaining.slice(colonIndex + 1);
  }

  const utility = remaining;

  // Check for arbitrary value
  const arbitraryMatch = utility.match(/^([^[]+)(\[[^\]]+\])$/);

  if (arbitraryMatch) {
    return {
      modifiers,
      utility: arbitraryMatch[1],
      arbitraryValue: arbitraryMatch[2],
    };
  }

  return {
    modifiers,
    utility,
  };
}

/**
 * Common Tailwind utility prefixes that accept values
 */
export const VALUE_ACCEPTING_UTILITIES = [
  'text',
  'bg',
  'border',
  'ring',
  'outline',
  'shadow',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'w',
  'h',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'gap',
  'space-x',
  'space-y',
  'translate-x',
  'translate-y',
  'rotate',
  'scale',
  'skew-x',
  'skew-y',
] as const;

/**
 * Check if a utility accepts a value
 */
export function isValueAcceptingUtility(utility: string): boolean {
  return VALUE_ACCEPTING_UTILITIES.some(prefix =>
    utility.startsWith(prefix),
  );
}

/**
 * Check if two utilities conflict with each other
 */
export function doUtilitiesConflict(utility1: string, utility2: string): boolean {
  const parsed1 = parseUtilityClass(utility1);
  const parsed2 = parseUtilityClass(utility2);

  // Different modifiers means no conflict
  if (parsed1.modifiers.join(':') !== parsed2.modifiers.join(':')) {
    return false;
  }

  // Check if they affect the same CSS property
  const propertyGroups: Record<string, string[]> = {
    width: ['w'],
    height: ['h'],
    padding: ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
    margin: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
    display: ['block', 'inline-block', 'inline', 'flex', 'grid', 'hidden'],
    position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
    flexDirection: ['flex-row', 'flex-col', 'flex-row-reverse', 'flex-col-reverse'],
    justifyContent: ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'],
    alignItems: ['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch'],
  };

  for (const [, utilities] of Object.entries(propertyGroups)) {
    const utility1InGroup = utilities.some(u =>
      parsed1.utility === u || parsed1.utility.startsWith(u + '-'),
    );
    const utility2InGroup = utilities.some(u =>
      parsed2.utility === u || parsed2.utility.startsWith(u + '-'),
    );

    if (utility1InGroup && utility2InGroup) {
      return true;
    }
  }

  return false;
}
