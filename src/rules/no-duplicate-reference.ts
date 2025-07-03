/**
 * Disallow duplicate `@reference` directives
 */

import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { getCSSContext } from '../utils/ast';

// Define the rule options type
type NoDuplicateReferenceOptions = [];

// Define the message IDs
type NoDuplicateReferenceMessageIds = 'duplicateReference';

/**
 * ESLint rule to disallow duplicate `@reference` directives in CSS files.
 *
 * This rule helps prevent redundant references to the same source by ensuring
 * that each reference target is declared only once.
 */
export const noDuplicateReference: CSSRuleDefinition<{
  RuleOptions: NoDuplicateReferenceOptions
  MessageIds: NoDuplicateReferenceMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow duplicate @reference directives',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    messages: {
      duplicateReference:
        'Duplicate @reference for "{{reference}}". This @reference was already declared.',
    },
    schema: [],
  },

  create(context) {
    // Check if we're in CSS context
    const cssInfo = getCSSContext(context);
    if (!cssInfo) {
      return {}; // Not CSS content
    }

    const { context: cssContext } = cssInfo;
    const referenceMap = new Map<string, AtrulePlain>();

    return {
      Atrule(node: AtrulePlain) {
        if (node.name !== 'reference' || !node.prelude) {
          return;
        }

        // Extract the reference value from the prelude
        const preludeText = cssContext.sourceCode
          .getText(node.prelude)
          .trim();

        // Match various formats: "tailwindcss", 'tailwindcss', url("..."), url('...')
        let referenceValue: string | undefined = undefined;

        // Check for string format: "..." or '...'
        const stringMatch = preludeText.match(/^["'](.+?)["']$/);
        if (stringMatch) {
          referenceValue = stringMatch[1];
        } else {
          // Check for url() format
          const urlMatch = preludeText.match(
            /^url\s*\(\s*["']?(.+?)["']?\s*\)$/,
          );
          if (urlMatch) {
            referenceValue = urlMatch[1];
          }
        }

        if (!referenceValue) {
          // Unable to parse reference value, skip
          return;
        }

        // Normalize the reference value (resolve relative paths to absolute for comparison)
        // For now, we'll use the raw value as-is
        const normalizedReference = referenceValue;

        // Check if we've seen this reference before
        const existingReference = referenceMap.get(normalizedReference);
        if (existingReference) {
          cssContext.report({
            node,
            messageId: 'duplicateReference',
            data: {
              reference: referenceValue,
            },
          });
        } else {
          // Store the first occurrence
          referenceMap.set(normalizedReference, node);
        }
      },
    };
  },
};
