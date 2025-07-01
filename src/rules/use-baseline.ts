import type { AtrulePlain, DeclarationPlain, FunctionNodePlain, RulePlain, StyleSheetPlain } from '@eslint/css-tree';

import type { CSSRuleDefinition } from '../types';

import { isNodeType, walk } from '../utils/ast';
import { type CSSFeature, getFeatureStatus, type UseBaselineOptions } from '../utils/browser-compat';

/**
 * Get the appropriate message ID based on feature status
 */
function getMessageId(feature: CSSFeature, isVendorPrefixed: boolean): string {
  if (isVendorPrefixed) {
    return 'vendorPrefix';
  }
  return feature.status === 'limited-availability' ? 'limitedAvailability' : 'newlyAvailable';
}

// Define the rule options type
type UseBaselineRuleOptions = [UseBaselineOptions];

// Define the message IDs
type UseBaselineMessageIds =
  | 'limitedAvailability'
  | 'newlyAvailable'
  | 'vendorPrefix';

/**
 * Rule to enforce use of baseline (widely supported) CSS features
 */
export const useBaseline: CSSRuleDefinition<{
  RuleOptions: UseBaselineRuleOptions
  MessageIds: UseBaselineMessageIds
}> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of widely-supported CSS features',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          strictness: {
            enum: ['limited', 'newly'],
            description: 'Strictness level for baseline checking',
          },
          ignore: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of features to ignore',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      limitedAvailability: 'CSS {{type}} \'{{name}}\' has limited browser support.{{suggestion}}',
      newlyAvailable: 'CSS {{type}} \'{{name}}\' is newly available and may not be supported in older browsers.{{suggestion}}',
      vendorPrefix: 'Vendor-prefixed {{type}} \'{{name}}\' should use standard syntax.{{suggestion}}',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const strictness = options.strictness || 'limited';
    const ignore = new Set(options.ignore || []);

    /**
     * Check if a feature should be reported based on strictness and ignore list
     */
    function shouldReport(feature: CSSFeature): boolean {
      if (ignore.has(feature.name)) {
        return false;
      }

      if (strictness === 'limited') {
        return feature.status === 'limited-availability';
      }

      return feature.status === 'limited-availability' || feature.status === 'newly-available';
    }

    /**
     * Report a non-baseline feature usage
     */
    function reportFeature(
      node: AtrulePlain | DeclarationPlain | RulePlain | FunctionNodePlain,
      feature: CSSFeature,
      type: string,
      actualName: string,
    ) {
      const isVendorPrefixed = actualName.startsWith('-webkit-')
        || actualName.startsWith('-moz-')
        || actualName.startsWith('-ms-')
        || actualName.startsWith('-o-');

      const suggestion = feature.alternativeSuggestion
        ? ` ${feature.alternativeSuggestion}`
        : '';

      context.report({
        node,
        messageId: getMessageId(feature, isVendorPrefixed) as UseBaselineMessageIds,
        data: {
          type,
          name: actualName,
          suggestion,
        },
      });
    }

    /**
     * Check CSS property in declaration
     */
    function checkProperty(declaration: DeclarationPlain) {
      const property = declaration.property;
      const feature = getFeatureStatus(property, 'property');

      if (feature && shouldReport(feature)) {
        reportFeature(declaration, feature, 'property', property);
      }
    }

    /**
     * Check at-rule
     */
    function checkAtRule(atrule: AtrulePlain) {
      const name = `@${atrule.name}`;
      const feature = getFeatureStatus(name, 'at-rule');

      if (feature && shouldReport(feature)) {
        reportFeature(atrule, feature, 'at-rule', name);
      }
    }

    /**
     * Check pseudo-class in selector
     */
    function checkPseudoClass(node: RulePlain, pseudoClass: string) {
      const feature = getFeatureStatus(pseudoClass, 'pseudo-class');

      if (feature && shouldReport(feature)) {
        reportFeature(node, feature, 'pseudo-class', pseudoClass);
      }
    }

    /**
     * Check CSS function
     */
    function checkFunction(node: FunctionNodePlain) {
      const functionName = node.name;
      const feature = getFeatureStatus(functionName, 'function');

      if (feature && shouldReport(feature)) {
        reportFeature(node, feature, 'function', `${functionName}()`);
      }
    }

    /**
     * Parse and check selectors for pseudo-classes
     */
    function checkSelector(rule: RulePlain) {
      if (!rule.prelude || !('children' in rule.prelude)) {
        return;
      }

      // Simple pseudo-class detection
      // This is a basic implementation - could be enhanced with a full selector parser
      const selectorText = context.sourceCode.getText(rule.prelude);

      // Match pseudo-classes (including pseudo-elements for completeness)
      const pseudoMatches = selectorText.matchAll(/:+[\w-]+(\([^)]*\))?/g);

      for (const match of pseudoMatches) {
        const pseudo = match[0];
        // Skip pseudo-elements (::)
        if (pseudo.startsWith('::')) {
          continue;
        }

        // Extract pseudo-class name (remove parentheses if present)
        const pseudoName = pseudo.split('(')[0];
        checkPseudoClass(rule, pseudoName);
      }
    }

    return {
      StyleSheet(node: StyleSheetPlain) {
        walk(node, (child) => {
          // Check declarations for properties and functions
          if (isNodeType(child, 'Declaration')) {
            checkProperty(child);

            // Check for functions in values
            if (child.value && 'children' in child.value) {
              walk(child.value, (valueNode) => {
                if (isNodeType(valueNode, 'Function')) {
                  checkFunction(valueNode);
                }
              });
            }
          }

          // Check at-rules
          if (isNodeType(child, 'Atrule')) {
            checkAtRule(child);
          }

          // Check selectors for pseudo-classes
          if (isNodeType(child, 'Rule')) {
            checkSelector(child);
          }
        });
      },
    };
  },
};
