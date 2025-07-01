import type { StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';

// Define the rule options type
type NoImportantOptions = [];

// Define the message IDs
type NoImportantMessageIds = 'avoidImportant';

/**
 * Discourages the use of !important flags in CSS declarations.
 * Using !important is generally considered bad practice as it breaks
 * the natural cascade of CSS and makes styles harder to override.
 */
export const noImportant: CSSRuleDefinition<{
  RuleOptions: NoImportantOptions
  MessageIds: NoImportantMessageIds
}> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage use of !important',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
    messages: {
      avoidImportant: 'Avoid using !important',
    },
  },
  create(context) {
    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          if (isNodeType(child, 'Declaration')) {
            const declaration = child;

            // Check if the declaration has !important
            if (declaration.important) {
              context.report({
                node: declaration,
                messageId: 'avoidImportant',
              });
            }
          }
        });
      },
    };
  },
};
