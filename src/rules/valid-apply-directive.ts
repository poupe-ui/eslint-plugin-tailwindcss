import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isAtRule } from '../utils/ast';
import { extractUtilitiesFromApply, parseUtilityClass } from '../utils/tailwind';

function isValidModifierSyntax(utility: string): boolean {
  // Valid modifier syntax: modifier:utility
  const parts = utility.split(':');

  // Must have at least modifier:utility (2 parts)
  if (parts.length < 2) return false;

  // If we have exactly 2 parts and the second part is empty, it's CSS property syntax
  if (parts.length === 2 && parts[1].trim() === '') return false;

  // Check each modifier part
  for (let i = 0; i < parts.length - 1; i++) {
    const modifier = parts[i];
    // Allow alphanumeric, hyphens, brackets for arbitrary variants, and parentheses for functions
    if (!/^[a-zA-Z0-9-[\]()]+$/.test(modifier)) {
      return false;
    }
  }

  return true;
}

function isValidUtilityFormat(utility: string): boolean {
  // Remove all modifiers to get the base utility
  const parsed = parseUtilityClass(utility);
  const baseUtility = parsed.utility;

  // Empty utility is invalid
  if (!baseUtility) {
    return false;
  }

  // Check for invalid characters in base utility
  // Allow alphanumeric, hyphens, dots (for decimal values), brackets, parentheses, slashes, and underscores
  if (!/^[a-zA-Z0-9-._[\]()/]+$/.test(baseUtility)) {
    return false;
  }

  // Check for common invalid patterns
  const invalidPatterns = [
    // CSS property syntax
    /^[a-z-]+\s*:/,
    // Multiple consecutive special characters
    /[-.]{2,}/,
    // Starting with numbers (except for specific utilities like 2xl)
    /^[0-9]+(?![a-zA-Z])/,
    // Unclosed brackets
    /\[[^\]]*$|^[^[]*\]/,
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(baseUtility)) {
      return false;
    }
  }

  // Additional validation for arbitrary values
  if (baseUtility.includes('[') && baseUtility.includes(']')) {
    // Ensure brackets are balanced
    const openCount = (baseUtility.match(/\[/g) || []).length;
    const closeCount = (baseUtility.match(/\]/g) || []).length;
    if (openCount !== closeCount) {
      return false;
    }
  }

  return true;
}

// Define the rule options type
type ValidApplyDirectiveOptions = [{
  allowEmpty?: boolean
  maxUtilities?: number
}];

// Define the message IDs
type ValidApplyDirectiveMessageIds =
  | 'emptyApply'
  | 'tooManyUtilities'
  | 'invalidUtility'
  | 'cssPropertyInApply'
  | 'nestedApply'
  | 'applyInMediaQuery';

// Define the rule with proper types
export const validApplyDirective: CSSRuleDefinition<{
  RuleOptions: ValidApplyDirectiveOptions
  MessageIds: ValidApplyDirectiveMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate @apply directive usage',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowEmpty: {
            type: 'boolean',
            default: false,
          },
          maxUtilities: {
            type: 'number',
            minimum: 1,
            default: 20,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      emptyApply: '@apply directive cannot be empty',
      tooManyUtilities:
        'Too many utilities in @apply ({{count}}). Maximum allowed: {{max}}',
      invalidUtility: 'Invalid utility "{{utility}}" in @apply directive',
      cssPropertyInApply:
        'CSS property "{{property}}" cannot be used in @apply. Use utility classes instead',
      nestedApply: '@apply cannot be nested inside another @apply',
      applyInMediaQuery:
        '@apply should not be used inside media queries. Consider using responsive modifiers instead',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowEmpty = options.allowEmpty || false;
    const maxUtilities = options.maxUtilities || 20;

    let inApply = false;
    let inMediaQuery = false;

    return {
      Atrule(node: AtrulePlain) {
        // Track media queries
        if (node.name === 'media') {
          inMediaQuery = true;
        }

        if (!isAtRule(node, 'apply')) {
          return;
        }

        // Check for nested @apply
        if (inApply) {
          context.report({
            node,
            messageId: 'nestedApply',
          });
          return;
        }

        // Check if @apply is inside a media query
        if (inMediaQuery) {
          context.report({
            node,
            messageId: 'applyInMediaQuery',
          });
        }

        inApply = true;

        // Check for empty @apply
        if (!node.prelude) {
          if (!allowEmpty) {
            context.report({
              node,
              messageId: 'emptyApply',
            });
          }
          return;
        }

        const utilities = extractUtilitiesFromApply(
          node.prelude,
          context.sourceCode,
        );

        // Check for empty utilities after extraction
        if (utilities.length === 0 && !allowEmpty) {
          context.report({
            node: node.prelude,
            messageId: 'emptyApply',
          });
          return;
        }

        // Check number of utilities
        if (utilities.length > maxUtilities) {
          context.report({
            node: node.prelude,
            messageId: 'tooManyUtilities',
            data: {
              count: String(utilities.length),
              max: String(maxUtilities),
            },
          });
        }

        // Validate each utility
        for (const utility of utilities) {
          validateUtility(utility, node);
        }
      },

      'Atrule:exit'(node: AtrulePlain) {
        if (node.name === 'media') {
          inMediaQuery = false;
        }
        if (isAtRule(node, 'apply')) {
          inApply = false;
        }
      },
    };

    function validateUtility(utility: string, node: AtrulePlain) {
      // Check if it looks like a CSS property (contains a colon but not as a modifier)
      if (utility.includes(':')) {
        const parts = utility.split(':');
        // CSS property pattern: property: value (with space after colon)
        if (parts.length === 2 && (parts[1] === '' || parts[1].startsWith(' '))) {
          const property = parts[0];
          context.report({
            node: node.prelude || node,
            messageId: 'cssPropertyInApply',
            data: { property },
          });
          return;
        }

        // Check for valid modifier syntax
        if (!isValidModifierSyntax(utility)) {
          context.report({
            node: node.prelude || node,
            messageId: 'invalidUtility',
            data: { utility },
          });
          return;
        }
      }

      // Check for obviously invalid utilities
      if (!isValidUtilityFormat(utility)) {
        context.report({
          node: node.prelude || node,
          messageId: 'invalidUtility',
          data: { utility },
        });
      }
    }
  },
};
