import type { AtrulePlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { getCSSContext } from '../utils/ast';
import { isNodeType, walk } from '../utils/ast';

// Define the rule options type
type RequireReferenceInVueOptions = [{
  fallbackReference?: string
}];

// Define the message IDs
type RequireReferenceInVueMessageIds = 'missingReference';

/**
 * Rule to ensure \@reference is used in Vue SFC style blocks
 *
 * Tailwind CSS requires \@reference to properly compile styles in Vue components.
 * This rule ensures that Vue SFC <style> blocks include the \@reference directive.
 */
export const requireReferenceInVue: CSSRuleDefinition<{
  RuleOptions: RequireReferenceInVueOptions
  MessageIds: RequireReferenceInVueMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require @reference directive in Vue SFC style blocks',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          fallbackReference: {
            type: 'string',
            description: 'The reference to use when auto-fixing missing @reference',
            default: 'tailwindcss',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingReference: 'Vue SFC style blocks must include @reference directive for Tailwind CSS compilation',
    },
  },
  create(context) {
    // Check if this is a Vue file
    const cssInfo = getCSSContext(context);
    if (!cssInfo || !cssInfo.isVueFile) {
      // Not a Vue file, rule doesn't apply
      return {};
    }

    const options = context.options[0] || {};
    const fallbackReference = options.fallbackReference || 'tailwindcss';

    return {
      StyleSheet(node: StyleSheetPlain) {
        const referenceRules: AtrulePlain[] = [];

        // Find all @reference rules
        walk(node, (child) => {
          if (isNodeType(child, 'Atrule') && child.name === 'reference') {
            referenceRules.push(child);
          }
        });

        // Check if @reference is missing
        if (referenceRules.length === 0) {
          // Report at the beginning of the style block
          context.report({
            loc: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 1 },
            },
            messageId: 'missingReference',
            fix(fixer) {
              // Add @reference at the beginning of the style block
              const firstChild = node.children[0];
              if (firstChild && firstChild.loc) {
                return fixer.insertTextBeforeRange(
                  [firstChild.loc.start.offset, firstChild.loc.start.offset],
                  `@reference "${fallbackReference}";\n\n`,
                );
              }
              // If empty style block, insert at position 0
              return fixer.insertTextBeforeRange([0, 0], `@reference "${fallbackReference}";\n`);
            },
          });
        }
      },
    };
  },
};
