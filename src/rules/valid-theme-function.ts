import type { FunctionNodePlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { getNodeText, isNodeType, walk } from '../utils/ast';
import {
  extractThemeValues,
  isValidThemePath,
  suggestSimilarTokens,
  type ThemeValue,
} from '../utils/theme';

// Define the rule options type
type ValidThemeFunctionOptions = [{
  checkPaths?: boolean
}];

// Define the message IDs
type ValidThemeFunctionMessageIds =
  | 'invalidThemePath'
  | 'invalidThemePathWithSuggestion'
  | 'emptyThemeFunction'
  | 'invalidThemeSyntax';

// Define the rule with proper types
export const validThemeFunction: CSSRuleDefinition<{
  RuleOptions: ValidThemeFunctionOptions
  MessageIds: ValidThemeFunctionMessageIds
}> = {
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

    function validateThemeFunction(node: FunctionNodePlain, themeValues: Map<string, ThemeValue>) {
      const functionText = getNodeText(node, context.sourceCode);

      // Check for empty theme function
      if (!node.children || node.children.length === 0) {
        context.report({
          node,
          messageId: 'emptyThemeFunction',
        });
        return;
      }

      // Extract the path from theme function
      const pathMatch = functionText.match(/theme\s*\(\s*["']([^"']+)["']\s*\)/);
      if (!pathMatch) {
        // Check if it's a syntax error (missing quotes, etc.)
        if (functionText.includes('(') && functionText.includes(')')) {
          context.report({
            node,
            messageId: 'invalidThemeSyntax',
          });
        }
        return;
      }

      const path = pathMatch[1];
      const isValid = isValidThemePath(path, themeValues);

      if (!isValid) {
        const suggestions = suggestSimilarTokens(path, themeValues);

        if (suggestions.length > 0) {
          const suggestionText = suggestions
            .slice(0, 3)
            .map(s => `"${s}"`)
            .join(', ');

          context.report({
            node,
            messageId: 'invalidThemePathWithSuggestion',
            data: {
              path,
              suggestions: suggestionText,
            },
            fix(fixer) {
              // Auto-fix to the first suggestion if there's only one
              if (suggestions.length === 1) {
                const newText = functionText.replace(
                  /theme\s*\(\s*["'][^"']+["']\s*\)/,
                  `theme("${suggestions[0]}")`,
                );
                return fixer.replaceText(node, newText);
              }
              return null; // eslint-disable-line unicorn/no-null
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
