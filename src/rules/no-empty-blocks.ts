import type { AtrulePlain, RulePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

/**
 * Checks if a CSS block is empty (contains no children).
 *
 * @param block - The block node to check
 * @returns True if the block is empty or undefined
 */
function isEmptyBlock(block: AtrulePlain['block'] | RulePlain['block']) {
  return !block || !block.children || block.children.length === 0;
}

// Define the rule options type
type NoEmptyBlocksOptions = [];

// Define the message IDs
type NoEmptyBlocksMessageIds = 'emptyBlock';

/**
 * ESLint rule to disallow empty CSS blocks.
 *
 * This rule helps maintain clean CSS by detecting empty rule blocks and at-rule blocks
 * that serve no purpose. Empty blocks can be the result of refactoring or incomplete
 * code and should be removed to keep stylesheets maintainable.
 *
 * @example
 * ```css
 * // ❌ Bad - empty blocks
 * .empty-class { }
 * @media (min-width: 768px) { }
 *
 * // ✅ Good - blocks with content
 * .filled-class { color: red; }
 * @media (min-width: 768px) {
 *   .responsive { display: flex; }
 * }
 * ```
 */
export const noEmptyBlocks: CSSRuleDefinition<{
  RuleOptions: NoEmptyBlocksOptions
  MessageIds: NoEmptyBlocksMessageIds
}> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow empty blocks',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
    messages: {
      emptyBlock: 'Empty {{type}} block',
    },
  },
  create(context) {
    return {
      Rule(node: RulePlain) {
        if (isEmptyBlock(node.block)) {
          context.report({
            node,
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          });
        }
      },
      Atrule(node: AtrulePlain) {
        // Only check at-rules that have blocks (like @media, @supports)
        if (node.block && isEmptyBlock(node.block)) {
          context.report({
            node,
            messageId: 'emptyBlock',
            data: { type: `@${node.name}` },
          });
        }
      },
    };
  },
};
