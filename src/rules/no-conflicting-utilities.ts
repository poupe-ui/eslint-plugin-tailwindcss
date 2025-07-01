import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isAtRule } from '../utils/ast';
import {
  doUtilitiesConflict,
  extractUtilitiesFromApply,
  parseUtilityClass,
} from '../utils/tailwind';

function groupUtilitiesByProperty(
  utilities: string[],
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  // Mapping of utility patterns to CSS properties
  const propertyMappings: Array<{
    pattern: RegExp | string
    property: string
  }> = [
    // Display
    { pattern: /^(block|inline-block|inline|flex|grid|hidden|flow-root)$/, property: 'display' },
    // Position
    { pattern: /^(static|fixed|absolute|relative|sticky)$/, property: 'position' },
    // Flex properties
    { pattern: /^flex-(row|col|row-reverse|col-reverse)$/, property: 'flex-direction' },
    { pattern: /^flex-(wrap|nowrap|wrap-reverse)$/, property: 'flex-wrap' },
    { pattern: /^flex-(1|auto|initial|none)$/, property: 'flex' },
    { pattern: /^(grow|shrink)(-\d+)?$/, property: 'flex-grow/shrink' },
    // Justify
    { pattern: /^justify-(start|end|center|between|around|evenly)$/, property: 'justify-content' },
    // Align
    { pattern: /^items-(start|end|center|baseline|stretch)$/, property: 'align-items' },
    { pattern: /^content-(start|end|center|between|around|evenly|stretch)$/, property: 'align-content' },
    // Width/Height
    { pattern: /^w-/, property: 'width' },
    { pattern: /^h-/, property: 'height' },
    { pattern: /^min-w-/, property: 'min-width' },
    { pattern: /^min-h-/, property: 'min-height' },
    { pattern: /^max-w-/, property: 'max-width' },
    { pattern: /^max-h-/, property: 'max-height' },
    // Padding
    { pattern: /^p-/, property: 'padding' },
    { pattern: /^px-/, property: 'padding-x' },
    { pattern: /^py-/, property: 'padding-y' },
    { pattern: /^pt-/, property: 'padding-top' },
    { pattern: /^pr-/, property: 'padding-right' },
    { pattern: /^pb-/, property: 'padding-bottom' },
    { pattern: /^pl-/, property: 'padding-left' },
    // Margin
    { pattern: /^m-/, property: 'margin' },
    { pattern: /^mx-/, property: 'margin-x' },
    { pattern: /^my-/, property: 'margin-y' },
    { pattern: /^mt-/, property: 'margin-top' },
    { pattern: /^mr-/, property: 'margin-right' },
    { pattern: /^mb-/, property: 'margin-bottom' },
    { pattern: /^ml-/, property: 'margin-left' },
    // Text
    { pattern: /^text-(left|center|right|justify)$/, property: 'text-align' },
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/, property: 'font-size' },
    { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, property: 'font-weight' },
    // Colors
    { pattern: /^text-/, property: 'color' },
    { pattern: /^bg-/, property: 'background-color' },
    { pattern: /^border-/, property: 'border-color' },
    // Overflow
    { pattern: /^overflow-(auto|hidden|visible|scroll)$/, property: 'overflow' },
    { pattern: /^overflow-x-(auto|hidden|visible|scroll)$/, property: 'overflow-x' },
    { pattern: /^overflow-y-(auto|hidden|visible|scroll)$/, property: 'overflow-y' },
  ];

  for (const utility of utilities) {
    const parsed = parseUtilityClass(utility);
    const baseUtility = parsed.utility;

    // Find matching property
    for (const { pattern, property } of propertyMappings) {
      const matches = typeof pattern === 'string'
        ? baseUtility === pattern
        : pattern.test(baseUtility);

      if (matches) {
        if (!groups[property]) {
          groups[property] = [];
        }
        groups[property].push(utility);
        break;
      }
    }
  }

  return groups;
}

function findConflictingUtilities(utilities: string[]): Array<{
  utility1: string
  utility2: string
  property: string
}> {
  const conflicts: Array<{
    utility1: string
    utility2: string
    property: string
  }> = [];

  // Group utilities by their affected CSS property
  const propertyGroups = groupUtilitiesByProperty(utilities);

  for (const [property, utils] of Object.entries(propertyGroups)) {
    // Skip if only one utility affects this property
    if (utils.length <= 1) continue;

    // Check each pair of utilities
    for (let i = 0; i < utils.length - 1; i++) {
      for (let index = i + 1; index < utils.length; index++) {
        const utility1 = utils[i];
        const utility2 = utils[index];

        if (doUtilitiesConflict(utility1, utility2)) {
          conflicts.push({
            utility1: utility1,
            utility2: utility2,
            property,
          });
        }
      }
    }
  }

  return conflicts;
}

// Define the rule options type
type NoConflictingUtilitiesOptions = [{
  checkCustomProperties?: boolean
}];

// Define the message IDs
type NoConflictingUtilitiesMessageIds =
  | 'conflictingUtilities'
  | 'duplicateUtility';

// Define the rule with proper types
export const noConflictingUtilities: CSSRuleDefinition<{
  RuleOptions: NoConflictingUtilitiesOptions
  MessageIds: NoConflictingUtilitiesMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect conflicting Tailwind utilities in the same rule',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          checkCustomProperties: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      conflictingUtilities:
        'Conflicting utilities: "{{utility1}}" and "{{utility2}}" both affect {{property}}',
      duplicateUtility: 'Duplicate utility "{{utility}}"',
    },
  },

  create(context) {
    // Options available for future use
    // const options = context.options[0] || {};
    // const checkCustomProperties = options.checkCustomProperties || false;

    return {
      Atrule(node: AtrulePlain) {
        if (!isAtRule(node, 'apply') || !node.prelude) {
          return;
        }

        const utilities = extractUtilitiesFromApply(
          node.prelude,
          context.sourceCode,
        );

        // Check for exact duplicates first
        const seen = new Set<string>();
        for (const utility of utilities) {
          if (seen.has(utility)) {
            context.report({
              node: node.prelude,
              messageId: 'duplicateUtility',
              data: { utility },
              fix(fixer) {
                // Remove the duplicate
                const newUtilities = utilities.filter(
                  (u, index) => u !== utility || utilities.indexOf(u) === index,
                );
                return fixer.replaceText(
                  node.prelude!,
                  newUtilities.join(' '),
                );
              },
            });
          }
          seen.add(utility);
        }

        // Check for conflicting utilities
        const conflicts = findConflictingUtilities(utilities);
        for (const conflict of conflicts) {
          context.report({
            node: node.prelude,
            messageId: 'conflictingUtilities',
            data: {
              utility1: conflict.utility1,
              utility2: conflict.utility2,
              property: conflict.property,
            },
            fix(fixer) {
              // Keep the last utility (later in the list takes precedence)
              const index1 = utilities.indexOf(conflict.utility1);
              const index2 = utilities.indexOf(conflict.utility2);
              const toRemove = index1 < index2 ? conflict.utility1 : conflict.utility2;

              const newUtilities = utilities.filter(u => u !== toRemove);
              return fixer.replaceText(
                node.prelude!,
                newUtilities.join(' '),
              );
            },
          });
        }
      },
    };
  },
};
