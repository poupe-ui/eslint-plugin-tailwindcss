import type { FunctionNodePlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleModule } from '../types';

import { getNodeText, isNodeType, walk } from '../utils/ast';
import {
  extractThemeValues,
  isValidThemePath,
  suggestSimilarTokens,
  type ThemeValue,
} from '../utils/theme';

export const validThemeFunction: CSSRuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate theme() function usage in CSS',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          checkPaths: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidThemePath: 'Invalid theme path "{{path}}". This token does not exist in the theme.',
      invalidThemePathWithSuggestion:
        'Invalid theme path "{{path}}". Did you mean {{suggestions}}?',
      emptyThemeFunction: 'theme() function requires a path argument',
      invalidThemeSyntax: 'Invalid theme() syntax. Expected format: theme("path.to.value")',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const checkPaths = options.checkPaths !== false;

    return {
      StyleSheet(node: StyleSheetPlain) {
        if (!checkPaths) return;

        // Extract all theme values from @theme blocks
        const themeValues = extractThemeValues(node, context.sourceCode.text);

        // Walk through all nodes to find theme() functions
        walk(node, (currentNode) => {
          if (isNodeType(currentNode, 'Function') && currentNode.name === 'theme') {
            validateThemeFunction(currentNode, themeValues);
          }
        });
      },
    };

    function validateThemeFunction(
      node: FunctionNodePlain,
      themeValues: Map<string, ThemeValue>,
    ) {
      const sourceCode = context.sourceCode;

      // Check if function has children (arguments)
      if (!node.children || node.children.length === 0) {
        context.report({
          node,
          messageId: 'emptyThemeFunction',
        });
        return;
      }

      // Get the argument text
      const argumentText = getNodeText(node.children[0], sourceCode).trim();

      // Remove quotes if present
      const path = argumentText.replaceAll(/^['"]|['"]$/g, '');

      // Check if it's a valid path format
      if (!path || path.includes(' ') || !/^[\w.-]+$/.test(path)) {
        context.report({
          node,
          messageId: 'invalidThemeSyntax',
        });
        return;
      }

      // Check if the theme path exists
      if (!isValidThemePath(path, themeValues)) {
        const suggestions = suggestSimilarTokens(path, themeValues);

        if (suggestions.length > 0) {
          const suggestionText = suggestions
            .slice(0, 2)
            .map(s => `"${s}"`)
            .join(' or ');

          context.report({
            node,
            messageId: 'invalidThemePathWithSuggestion',
            data: {
              path,
              suggestions: suggestionText,
            },
            fix(fixer) {
              // Suggest the most likely match as a fix
              const bestMatch = suggestions[0];
              const newText = `theme("${bestMatch}")`;
              return fixer.replaceText(node, newText);
            },
          });
        } else {
          context.report({
            node,
            messageId: 'invalidThemePath',
            data: { path },
          });
        }
      }
    }
  },
};
