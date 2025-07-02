import type { AtrulePlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';
import { getSimilarAtRules, isValidAtRule, shouldHaveBlock } from '../utils/at-rules';

// Define the rule options type
type NoInvalidAtRulesOptions = [{
  ignoreAtRules?: string[]
}];

// Define the message IDs
type NoInvalidAtRulesMessageIds =
  'invalidAtRule' |
  'invalidAtRuleWithSuggestion' |
  'missingBlock' |
  'unexpectedBlock';

/**
 * Rule to disallow invalid at-rule names and validate their structure
 */
export const noInvalidAtRules: CSSRuleDefinition<{
  RuleOptions: NoInvalidAtRulesOptions
  MessageIds: NoInvalidAtRulesMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid at-rule names and syntax',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreAtRules: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of at-rule names to ignore',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidAtRule: 'Unknown at-rule "@{{name}}".',
      invalidAtRuleWithSuggestion:
        'Unknown at-rule "@{{name}}". Did you mean "@{{suggestion}}"?',
      unexpectedBlock: 'At-rule "@{{name}}" should not have a block.',
      missingBlock: 'At-rule "@{{name}}" requires a block.',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const ignoreAtRules = new Set(options.ignoreAtRules || []);

    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          if (isNodeType(child, 'Atrule')) {
            const atrule = child as AtrulePlain;
            const name = atrule.name;

            // Skip if at-rule should be ignored
            if (ignoreAtRules.has(name)) {
              return;
            }

            if (!atrule.loc) {
              return;
            }

            // Check if at-rule name is valid
            if (!isValidAtRule(name)) {
              const suggestions = getSimilarAtRules(name);

              // Calculate the location of the at-rule name
              // The name starts after the @ symbol
              const atSymbolLength = 1; // '@'
              const nameStartColumn = atrule.loc.start.column + atSymbolLength;
              const nameEndColumn = nameStartColumn + name.length;

              if (suggestions.length > 0) {
                context.report({
                  loc: {
                    start: {
                      line: atrule.loc.start.line,
                      column: nameStartColumn,
                    },
                    end: {
                      line: atrule.loc.start.line,
                      column: nameEndColumn,
                    },
                  },
                  messageId: 'invalidAtRuleWithSuggestion',
                  data: {
                    name,
                    suggestion: suggestions[0],
                  },
                });
              } else {
                context.report({
                  loc: {
                    start: {
                      line: atrule.loc.start.line,
                      column: nameStartColumn,
                    },
                    end: {
                      line: atrule.loc.start.line,
                      column: nameEndColumn,
                    },
                  },
                  messageId: 'invalidAtRule',
                  data: {
                    name,
                  },
                });
              }

              // Don't check block structure for invalid at-rules
              return;
            }

            // Check block structure for valid at-rules
            const blockExpectation = shouldHaveBlock(name);
            const hasBlock = !!atrule.block;

            if (blockExpectation === true && !hasBlock) {
              // At-rule should have a block but doesn't
              context.report({
                loc: atrule.loc,
                messageId: 'missingBlock',
                data: {
                  name,
                },
              });
            } else if (blockExpectation === false && hasBlock) {
              // At-rule should not have a block but does
              context.report({
                loc: atrule.loc,
                messageId: 'unexpectedBlock',
                data: {
                  name,
                },
              });
            }
            // If blockExpectation is undefined, the at-rule can have either structure
          }
        });
      },
    };
  },
};
