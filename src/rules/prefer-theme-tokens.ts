import type { DeclarationPlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { getNodeText } from '../utils/ast';
import {
  extractThemeValues,
  getThemeCategory,
  hasThemeReference,
  THEME_CATEGORIES,
  type ThemeValue,
} from '../utils/theme';

function isColorValue(value: string): boolean {
  const colorPatterns = [
    // Hex colors
    /^#[0-9a-fA-F]{3,8}$/,
    // RGB/RGBA
    /^rgba?\(/,
    // HSL/HSLA
    /^hsla?\(/,
    // Named colors (common ones)
    /^(red|blue|green|yellow|black|white|gray|grey)$/i,
  ];

  return colorPatterns.some(pattern => pattern.test(value.trim()));
}

function isSpacingValue(value: string): boolean {
  const spacingPattern = /^-?\d+(\.\d+)?(px|rem|em|vh|vw|%)$/;
  return spacingPattern.test(value.trim());
}

function getPropertyCategory(property: string): string | undefined {
  const propertyMappings: Record<string, keyof typeof THEME_CATEGORIES> = {
    // Colors
    'color': 'colors',
    'background-color': 'colors',
    'border-color': 'colors',
    'outline-color': 'colors',
    'text-decoration-color': 'colors',
    'caret-color': 'colors',
    // Spacing
    'padding': 'spacing',
    'padding-top': 'spacing',
    'padding-right': 'spacing',
    'padding-bottom': 'spacing',
    'padding-left': 'spacing',
    'margin': 'spacing',
    'margin-top': 'spacing',
    'margin-right': 'spacing',
    'margin-bottom': 'spacing',
    'margin-left': 'spacing',
    'gap': 'spacing',
    'row-gap': 'spacing',
    'column-gap': 'spacing',
    // Sizing
    'width': 'sizing',
    'height': 'sizing',
    'min-width': 'sizing',
    'min-height': 'sizing',
    'max-width': 'sizing',
    'max-height': 'sizing',
    // Typography
    'font-size': 'typography',
    'line-height': 'typography',
    'letter-spacing': 'typography',
    // Borders
    'border-radius': 'borders',
    'border-width': 'borders',
    // Effects
    'box-shadow': 'effects',
    'opacity': 'effects',
  };

  return propertyMappings[property] || undefined;
}

/**
 * Represents a suggestion to use a theme token
 */
interface ThemeTokenSuggestion {
  category: string
  possibleToken?: string
}

// Define the rule options type
type PreferThemeTokensOptions = [{
  categories?: string[]
  ignoreProperties?: string[]
}];

// Define the message IDs
type PreferThemeTokensMessageIds =
  'useThemeToken' |
  'useThemeTokenWithSuggestion';

// Define the rule with proper types
export const preferThemeTokens: CSSRuleDefinition<{
  RuleOptions: PreferThemeTokensOptions
  MessageIds: PreferThemeTokensMessageIds
}> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest using theme tokens instead of hard-coded values',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          categories: {
            type: 'array',
            items: {
              type: 'string',
              enum: [...Object.keys(THEME_CATEGORIES), 'other'],
            },
            default: ['colors', 'spacing', 'sizing'],
          },
          ignoreProperties: {
            type: 'array',
            items: { type: 'string' },
            default: ['content', 'counter-reset', 'counter-increment'],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useThemeToken:
        'Use a theme token instead of hard-coded value "{{value}}" for {{property}}',
      useThemeTokenWithSuggestion:
        'Use theme token {{suggestion}} instead of hard-coded value "{{value}}" for {{property}}',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const enabledCategories = new Set(
      options.categories || ['colors', 'spacing', 'sizing'],
    );
    const ignoredProperties = new Set(
      options.ignoreProperties || ['content', 'counter-reset', 'counter-increment'],
    );

    let themeValues: Map<string, ThemeValue>;

    return {
      StyleSheet(node: StyleSheetPlain) {
        // Extract theme values once for the entire file
        themeValues = extractThemeValues(node, context.sourceCode.text);
      },

      Declaration(node: DeclarationPlain) {
        // Skip ignored properties
        if (ignoredProperties.has(node.property)) {
          return;
        }

        // Skip if value already uses theme tokens
        const valueText = getNodeText(node.value, context.sourceCode);
        if (hasThemeReference(valueText)) {
          return;
        }

        // Check if this property/value combination should use a token
        const suggestion = shouldUseToken(node.property, valueText);
        if (suggestion) {
          const { possibleToken } = suggestion;

          if (possibleToken) {
            context.report({
              node: node.value,
              messageId: 'useThemeTokenWithSuggestion',
              data: {
                value: valueText,
                property: node.property,
                suggestion: possibleToken,
              },
              fix(fixer) {
                return fixer.replaceText(
                  node.value,
                  `theme("${possibleToken}")`,
                );
              },
            });
          } else {
            context.report({
              node: node.value,
              messageId: 'useThemeToken',
              data: {
                value: valueText,
                property: node.property,
              },
            });
          }
        }
      },
    };

    function shouldUseToken(
      property: string,
      value: string,
    ): ThemeTokenSuggestion | undefined {
      // Check color values
      if (isColorValue(value)) {
        const category = getPropertyCategory(property);
        if (category && enabledCategories.has(category)) {
          const token = findMatchingToken(value, category);
          return { category, possibleToken: token };
        }
      }

      // Check spacing/sizing values
      if (isSpacingValue(value)) {
        const category = getPropertyCategory(property);
        if (category && enabledCategories.has(category)) {
          const token = findMatchingToken(value, category);
          return { category, possibleToken: token };
        }
      }

      return undefined;
    }

    function findMatchingToken(
      value: string,
      category: string,
    ): string | undefined {
      // Look for exact matches in theme values
      for (const [token, themeValue] of themeValues) {
        if (getThemeCategory(token) === category && // Simple comparison - in real implementation would need better matching
          themeValue.value === value) {
          // Convert CSS variable to dot notation
          // e.g., "--color-primary" -> "colors.primary"
          return token
            .replace(/^--/, '')
            .replaceAll('-', '.');
        }
      }

      return undefined;
    }
  },
};
