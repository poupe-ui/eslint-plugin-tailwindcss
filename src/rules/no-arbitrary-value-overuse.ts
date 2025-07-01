import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isAtRule } from '../utils/ast';
import {
  countArbitraryValues,
  extractUtilitiesFromApply,
  parseUtilityClass,
} from '../utils/tailwind';

function shouldSuggestToken(value: string, utility: string): boolean {
  // Remove brackets
  const cleanValue = value.slice(1, -1);

  // Common patterns that should use tokens
  const tokenPatterns = [
    // Colors (hex, rgb, hsl)
    /^#[0-9a-fA-F]{3,8}$/,
    /^rgb\(/,
    /^hsl\(/,
    // Spacing values
    /^-?\d+(\.\d+)?(px|rem|em|vh|vw)$/,
    // Common sizes
    /^(100|50|75|25)%$/,
  ];

  // Utilities that commonly should use tokens
  const tokenUtilities = [
    'text',
    'bg',
    'border',
    'ring',
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
    'gap',
    'space-x',
    'space-y',
  ];

  // Check if the utility type suggests using a token
  const shouldUseToken = tokenUtilities.some(prefix =>
    utility.startsWith(prefix),
  );

  if (!shouldUseToken) {
    return false;
  }

  // Check if the value matches a pattern that suggests a token
  return tokenPatterns.some(pattern => pattern.test(cleanValue));
}

// Define the rule options type
type NoArbitraryValueOveruseOptions = [{
  maxPerFile?: number
  maxPerRule?: number
  allowedUtilities?: string[]
}];

// Define the message IDs
type NoArbitraryValueOveruseMessageIds =
  | 'tooManyArbitraryValues'
  | 'tooManyArbitraryValuesInRule'
  | 'considerThemeToken';

// Define the rule with proper types
export const noArbitraryValueOveruse: CSSRuleDefinition<{
  RuleOptions: NoArbitraryValueOveruseOptions
  MessageIds: NoArbitraryValueOveruseMessageIds
}> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage excessive use of arbitrary values in Tailwind utilities',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxPerFile: {
            type: 'number',
            minimum: 1,
            default: 10,
          },
          maxPerRule: {
            type: 'number',
            minimum: 1,
            default: 3,
          },
          allowedUtilities: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyArbitraryValues:
        'Too many arbitrary values ({{count}}) in this file. Maximum allowed: {{max}}',
      tooManyArbitraryValuesInRule:
        'Too many arbitrary values ({{count}}) in this @apply rule. Maximum allowed: {{max}}',
      considerThemeToken:
        'Consider using a theme token instead of arbitrary value "{{value}}" for better consistency',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const maxPerFile = options.maxPerFile ?? 10;
    const maxPerRule = options.maxPerRule ?? 3;
    const allowedUtilities = new Set(options.allowedUtilities || []);

    let fileArbitraryCount = 0;
    const arbitraryValues: Array<{
      node: AtrulePlain
      value: string
      utility: string
    }> = [];

    return {
      Atrule(node: AtrulePlain) {
        if (!isAtRule(node, 'apply') || !node.prelude) {
          return;
        }

        const utilities = extractUtilitiesFromApply(
          node.prelude,
          context.sourceCode,
        );

        let ruleArbitraryCount = 0;
        const ruleArbitraryValues: Array<{
          value: string
          utility: string
        }> = [];

        for (const utility of utilities) {
          const arbitraryCount = countArbitraryValues(utility);
          if (arbitraryCount > 0) {
            const parsed = parseUtilityClass(utility);

            // Skip if this utility is in the allowed list
            if (allowedUtilities.has(parsed.utility)) {
              continue;
            }

            ruleArbitraryCount += arbitraryCount;
            fileArbitraryCount += arbitraryCount;

            if (parsed.arbitraryValue) {
              ruleArbitraryValues.push({
                value: parsed.arbitraryValue,
                utility: parsed.utility,
              });

              arbitraryValues.push({
                node,
                value: parsed.arbitraryValue,
                utility: parsed.utility,
              });
            }
          }
        }

        // Check per-rule limit
        if (ruleArbitraryCount > maxPerRule) {
          context.report({
            node: node.prelude,
            messageId: 'tooManyArbitraryValuesInRule',
            data: {
              count: String(ruleArbitraryCount),
              max: String(maxPerRule),
            },
          });
        }

        // Report specific arbitrary values that could use tokens
        for (const { value, utility } of ruleArbitraryValues) {
          // Check if this looks like a value that should be a token
          if (shouldSuggestToken(value, utility)) {
            context.report({
              node: node.prelude,
              messageId: 'considerThemeToken',
              data: { value },
            });
          }
        }
      },

      'StyleSheet:exit'() {
        // Check file-level limit
        if (fileArbitraryCount > maxPerFile // Report on the first arbitrary value found
          && arbitraryValues.length > 0) {
          context.report({
            node: arbitraryValues[0].node,
            messageId: 'tooManyArbitraryValues',
            data: {
              count: String(fileArbitraryCount),
              max: String(maxPerFile),
            },
          });
        }
      },
    };
  },
};
