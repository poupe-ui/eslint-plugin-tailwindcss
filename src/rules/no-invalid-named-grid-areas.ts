import type { DeclarationPlain, StringNode, StyleSheetPlain, ValuePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';

// Define the rule options type
type NoInvalidNamedGridAreasOptions = [];

// Define the message IDs
type NoInvalidNamedGridAreasMessageIds =
  'emptyGridArea' |
  'nonRectangularGridArea' |
  'unevenGridArea';

/**
 * Regular expression to match null cell tokens (sequences of one or more dots)
 */
const nullCellToken = /^\.+$/u;

/**
 * Valid CSS properties that can contain grid template areas
 */
const validProps = new Set(['grid-template-areas', 'grid-template', 'grid']);

/**
 * Error information for non-rectangular grid areas
 */
interface GridAreaError {
  name: string
  row: number
}

/**
 * Finds non-rectangular grid areas in a 2D grid
 * @param grid - 2D array representing the grid areas
 * @returns Array of errors found
 */
function findNonRectangularAreas(grid: string[][]): GridAreaError[] {
  const errors: GridAreaError[] = [];
  const reported = new Set<string>();
  const names = [...new Set(grid.flat())].filter(
    name => !nullCellToken.test(name),
  );

  for (const name of names) {
    const indicesByRow = grid.map((row) => {
      const indices: number[] = [];
      let index = row.indexOf(name);

      while (index !== -1) {
        indices.push(index);
        index = row.indexOf(name, index + 1);
      }

      return indices;
    });

    for (let i = 0; i < indicesByRow.length; i++) {
      for (let index = i + 1; index < indicesByRow.length; index++) {
        const row1 = indicesByRow[i];
        const row2 = indicesByRow[index];

        if (row1.length === 0 || row2.length === 0) {
          continue;
        }

        if (
          row1.length !== row2.length ||
          !row1.every((value, index_) => value === row2[index_])
        ) {
          const key = `${name}|${index}`;
          if (!reported.has(key)) {
            errors.push({ name, row: index });
            reported.add(key);
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Rule to disallow invalid named grid areas in CSS grid templates.
 * Grid areas must be rectangular and contain at least one cell token.
 * All rows must have the same number of cell tokens.
 */
export const noInvalidNamedGridAreas: CSSRuleDefinition<{
  RuleOptions: NoInvalidNamedGridAreasOptions
  MessageIds: NoInvalidNamedGridAreasMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid named grid areas',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
    messages: {
      emptyGridArea: 'Grid area must contain at least one cell token.',
      unevenGridArea: 'Grid area strings must have the same number of cell tokens.',
      nonRectangularGridArea: 'Cell tokens with name \'{{name}}\' must form a rectangle.',
    },
  },
  create(context) {
    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          if (isNodeType(child, 'Declaration')) {
            const declaration = child as DeclarationPlain;
            const propName = declaration.property.toLowerCase();

            if (
              validProps.has(propName) &&
              declaration.value &&
              isNodeType(declaration.value, 'Value')
            ) {
              const value = declaration.value as ValuePlain;
              const stringNodes = value.children.filter(
                child => isNodeType(child, 'String'),
              );

              if (stringNodes.length === 0) {
                return;
              }

              const grid: string[][] = [];
              const emptyNodes: StringNode[] = [];
              const unevenNodes: StringNode[] = [];
              let firstRowLength: number | undefined = undefined;

              for (const stringNode of stringNodes) {
                // String nodes have a value property that contains the string without quotes
                const trimmedValue = (stringNode as StringNode).value.trim();

                if (trimmedValue === '') {
                  emptyNodes.push(stringNode as StringNode);
                  continue;
                }

                const row = trimmedValue.split(/\s+/).filter(Boolean);
                grid.push(row);

                if (firstRowLength === undefined) {
                  firstRowLength = row.length;
                } else if (row.length !== firstRowLength) {
                  unevenNodes.push(stringNode as StringNode);
                }
              }

              if (emptyNodes.length > 0) {
                for (const emptyNode of emptyNodes) context.report({
                  node: emptyNode,
                  messageId: 'emptyGridArea',
                })
                ;
                return;
              }

              if (unevenNodes.length > 0) {
                for (const unevenNode of unevenNodes) context.report({
                  node: unevenNode,
                  messageId: 'unevenGridArea',
                })
                ;
                return;
              }

              const nonRectErrors = findNonRectangularAreas(grid);
              for (const { name, row } of nonRectErrors) {
                const stringNode = stringNodes[row];
                context.report({
                  node: stringNode,
                  messageId: 'nonRectangularGridArea',
                  data: {
                    name,
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
