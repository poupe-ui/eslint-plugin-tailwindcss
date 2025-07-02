import type { DeclarationPlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';

/**
 * Options for configuring spacing rules
 */
interface SpacingOptions {
  /** Spacing requirement after colon */
  afterColon: 'always' | 'never'
  /** Spacing requirement before colon */
  beforeColon: 'always' | 'never'
}

/**
 * Location information for a position in the source code
 */
interface LocationInfo {
  /** Line number (1-based) */
  line: number
  /** Column number (0-based) */
  column: number
  /** Character offset from start of file */
  offset: number
}

/**
 * Information about a CSS declaration for spacing analysis
 */
interface DeclarationInfo {
  /** The declaration AST node */
  node: DeclarationPlain
  /** Length of the property name */
  propertyLength: number
  /** Location where the property name ends */
  propertyEnd: LocationInfo
  /** Location where the value starts */
  valueStart: LocationInfo
}

// Define the rule options type
type ConsistentSpacingOptions = [{
  afterColon?: 'always' | 'never'
  beforeColon?: 'always' | 'never'
}];

// Define the message IDs
type ConsistentSpacingMessageIds =
  'expectedSpaceAfterColon' |
  'expectedSpaceBeforeColon' |
  'multipleSpacesAfterColon' |
  'multipleSpacesBeforeColon' |
  'unexpectedSpaceAfterColon' |
  'unexpectedSpaceBeforeColon';

export const consistentSpacing: CSSRuleDefinition<{
  RuleOptions: ConsistentSpacingOptions
  MessageIds: ConsistentSpacingMessageIds
}> = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing in CSS declarations',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          afterColon: {
            type: 'string',
            enum: ['always', 'never'],
            default: 'always',
          },
          beforeColon: {
            type: 'string',
            enum: ['always', 'never'],
            default: 'never',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      expectedSpaceAfterColon: 'Expected single space after ":"',
      unexpectedSpaceAfterColon: 'Unexpected space after ":"',
      expectedSpaceBeforeColon: 'Expected single space before ":"',
      unexpectedSpaceBeforeColon: 'Unexpected space before ":"',
      multipleSpacesAfterColon: 'Multiple spaces after ":"',
      multipleSpacesBeforeColon: 'Multiple spaces before ":"',
    },
  },

  create(context) {
    const options: SpacingOptions = {
      afterColon: context.options[0]?.afterColon || 'always',
      beforeColon: context.options[0]?.beforeColon || 'never',
    };
    const sourceCode = context.sourceCode;

    /**
     * Check spacing before colon and report if needed
     *
     * @param info - Declaration information including node and location data
     * @param beforeColonSpace - The whitespace string found before the colon
     */
    function checkBeforeColon(
      info: DeclarationInfo,
      beforeColonSpace: string,
    ) {
      const { node: declaration, propertyEnd } = info;
      const spaceLength = beforeColonSpace.length;

      if (spaceLength === 0 && options.beforeColon === 'always') {
        // Expected space but none found
        context.report({
          node: declaration,
          messageId: 'expectedSpaceBeforeColon',
          loc: {
            line: propertyEnd.line,
            column: propertyEnd.column,
          },
          fix(fixer) {
            return fixer.insertTextBeforeRange(
              [propertyEnd.offset, propertyEnd.offset],
              ' ',
            );
          },
        });
      } else if (spaceLength === 1 && options.beforeColon === 'never') {
        // Single unexpected space found
        context.report({
          node: declaration,
          messageId: 'unexpectedSpaceBeforeColon',
          loc: {
            start: {
              line: propertyEnd.line,
              column: propertyEnd.column,
            },
            end: {
              line: propertyEnd.line,
              column: propertyEnd.column + spaceLength,
            },
          },
          fix(fixer) {
            return fixer.removeRange([
              propertyEnd.offset,
              propertyEnd.offset + spaceLength,
            ]);
          },
        });
      } else if (spaceLength > 1) {
        // Multiple spaces found
        context.report({
          node: declaration,
          messageId: 'multipleSpacesBeforeColon',
          loc: {
            start: {
              line: propertyEnd.line,
              column: propertyEnd.column,
            },
            end: {
              line: propertyEnd.line,
              column: propertyEnd.column + spaceLength,
            },
          },
          fix(fixer) {
            const replacement = options.beforeColon === 'always' ? ' ' : '';
            return fixer.replaceTextRange(
              [propertyEnd.offset, propertyEnd.offset + spaceLength],
              replacement,
            );
          },
        });
      }
    }

    /**
     * Check spacing after colon and report if needed
     *
     * @param info - Declaration information including node and location data
     * @param afterColonSpace - The whitespace string found after the colon
     * @param colonOffset - The character offset of the colon in the source
     */
    function checkAfterColon(
      info: DeclarationInfo,
      afterColonSpace: string,
      colonOffset: number,
    ) {
      const { node: declaration, propertyEnd, valueStart } = info;
      const spaceLength = afterColonSpace.length;

      if (spaceLength === 0 && options.afterColon === 'always') {
        // Expected space but none found
        context.report({
          node: declaration,
          messageId: 'expectedSpaceAfterColon',
          loc: {
            line: propertyEnd.line,
            column: propertyEnd.column + (colonOffset - propertyEnd.offset) + 1,
          },
          fix(fixer) {
            return fixer.insertTextAfterRange(
              [colonOffset, colonOffset + 1],
              ' ',
            );
          },
        });
      } else if (spaceLength > 0 && options.afterColon === 'never') {
        // Unexpected space(s) found
        context.report({
          node: declaration,
          messageId: 'unexpectedSpaceAfterColon',
          loc: {
            start: {
              line: propertyEnd.line,
              column: propertyEnd.column + (colonOffset - propertyEnd.offset) + 1,
            },
            end: {
              line: valueStart.line,
              column: valueStart.column,
            },
          },
          fix(fixer) {
            return fixer.removeRange([
              colonOffset + 1,
              valueStart.offset,
            ]);
          },
        });
      } else if (spaceLength > 1 && options.afterColon === 'always') {
        // Multiple spaces found
        context.report({
          node: declaration,
          messageId: 'multipleSpacesAfterColon',
          loc: {
            start: {
              line: propertyEnd.line,
              column: propertyEnd.column + (colonOffset - propertyEnd.offset) + 1,
            },
            end: {
              line: valueStart.line,
              column: valueStart.column,
            },
          },
          fix(fixer) {
            return fixer.replaceTextRange(
              [colonOffset + 1, valueStart.offset],
              ' ',
            );
          },
        });
      }
    }

    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          if (!isNodeType(child, 'Declaration')) return;

          const declaration = child as DeclarationPlain;

          // Skip if no location info (shouldn't happen in valid CSS)
          if (!declaration.loc || !declaration.value?.loc) return;

          // Create declaration info
          const info: DeclarationInfo = {
            node: declaration,
            propertyLength: declaration.property.length,
            propertyEnd: {
              line: declaration.loc.start.line,
              column: declaration.loc.start.column + declaration.property.length,
              offset: declaration.loc.start.offset + declaration.property.length,
            },
            valueStart: {
              line: declaration.value.loc.start.line,
              column: declaration.value.loc.start.column,
              offset: declaration.value.loc.start.offset,
            },
          };

          // Get the text between property and value
          const betweenText = sourceCode.text.slice(info.propertyEnd.offset, info.valueStart.offset);

          // Find the colon
          const colonIndex = betweenText.indexOf(':');
          if (colonIndex === -1) return; // No colon found, malformed CSS

          // Extract spaces before and after colon
          const beforeColonSpace = betweenText.slice(0, colonIndex);
          const afterColonIndex = colonIndex + 1;
          const afterColonSpace = afterColonIndex < betweenText.length ? betweenText.slice(afterColonIndex) : '';
          const colonOffset = info.propertyEnd.offset + colonIndex;

          // Check spacing
          checkBeforeColon(info, beforeColonSpace);
          checkAfterColon(info, afterColonSpace, colonOffset);
        });
      },
    };
  },
};
