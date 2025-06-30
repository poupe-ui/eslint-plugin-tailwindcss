import type { DeclarationPlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';
import { getSimilarProperties, isValidProperty } from '../utils/css-properties';

// Define the rule options type
type NoInvalidPropertiesOptions = [{
  ignoreProperties?: string[]
}];

// Define the message IDs
type NoInvalidPropertiesMessageIds =
  | 'invalidProperty'
  | 'invalidPropertyWithSuggestion';

// Define the rule with proper types
export const noInvalidProperties: CSSRuleDefinition<{
  RuleOptions: NoInvalidPropertiesOptions
  MessageIds: NoInvalidPropertiesMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid CSS property names',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of property names to ignore',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidProperty: 'Unknown property "{{property}}".',
      invalidPropertyWithSuggestion:
        'Unknown property "{{property}}". Did you mean "{{suggestion}}"?',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const ignoreProperties = new Set(options.ignoreProperties || []);

    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          if (isNodeType(child, 'Declaration')) {
            const declaration = child as DeclarationPlain;
            const property = declaration.property;

            // Skip if property should be ignored
            if (ignoreProperties.has(property)) {
              return;
            }

            // Check if property is valid
            if (!isValidProperty(property)) {
              const suggestions = getSimilarProperties(property);

              if (!declaration.loc) {
                return;
              }

              if (suggestions.length > 0) {
                context.report({
                  loc: {
                    start: declaration.loc.start,
                    end: {
                      line: declaration.loc.start.line,
                      column: declaration.loc.start.column + property.length,
                    },
                  },
                  messageId: 'invalidPropertyWithSuggestion',
                  data: {
                    property,
                    suggestion: suggestions[0],
                  },
                });
              } else {
                context.report({
                  loc: {
                    start: declaration.loc.start,
                    end: {
                      line: declaration.loc.start.line,
                      column: declaration.loc.start.column + property.length,
                    },
                  },
                  messageId: 'invalidProperty',
                  data: {
                    property,
                  },
                });
              }
            }
          }
        });
      },
    };
  },
};
