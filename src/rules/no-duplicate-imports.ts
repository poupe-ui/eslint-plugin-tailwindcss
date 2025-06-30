import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleModule } from '../types';

/**
 * ESLint rule to disallow duplicate `@import` rules in CSS files.
 *
 * This rule helps prevent redundant network requests and potential styling conflicts
 * by ensuring that each CSS file is imported only once. It detects duplicates
 * regardless of the import syntax used (string or url() function).
 *
 * @example
 * ```css
 * // ❌ Bad - duplicate imports
 * @import "styles.css";
 * @import url("styles.css");
 *
 * // ✅ Good - single import
 * @import "styles.css";
 * ```
 */
export const noDuplicateImports: CSSRuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow duplicate @import rules',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
    messages: {
      duplicateImport: 'Duplicate @import of "{{url}}"',
    },
  },
  create(context) {
    const importedUrls = new Map<string, AtrulePlain>();

    return {
      Atrule(node: AtrulePlain) {
        if (node.name !== 'import' || !node.prelude) {
          return;
        }

        // Extract the URL from the import prelude
        const preludeText = context.sourceCode.getText(node.prelude).trim();
        let url: string | undefined;

        // Handle string syntax: @import "url";
        const stringMatch = preludeText.match(/^["'](.+?)["']$/);
        if (stringMatch) {
          url = stringMatch[1];
        } else {
          // Handle url() syntax: @import url("...") or url(...)
          // This regex handles:
          // - url("path") or url('path') - captures content without quotes
          // - url(path) - captures unquoted path
          const urlMatch = preludeText.match(/^url\s*\(\s*(?:["']([^"']+)["']|([^)]+))\s*\)$/);
          if (urlMatch) {
            url = urlMatch[1] || urlMatch[2]?.trim();
          }
        }

        if (!url) {
          return;
        }

        // Check for duplicate
        const existing = importedUrls.get(url);
        if (existing) {
          context.report({
            node,
            messageId: 'duplicateImport',
            data: { url },
          });
        } else {
          importedUrls.set(url, node);
        }
      },
    };
  },
};
