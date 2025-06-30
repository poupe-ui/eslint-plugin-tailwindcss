import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleModule } from '../types';

import { isAtRule } from '../utils/ast';
import { extractUtilitiesFromApply, parseUtilityClass } from '../utils/tailwind';

function validateArbitraryModifier(modifier: string): {
  valid: boolean
  messageId?: string
  reason?: string
} {
  const content = modifier.slice(1, -1);

  // Check for nested brackets
  if (content.includes('[') || content.includes(']')) {
    return {
      valid: false,
      messageId: 'nestedBrackets',
    };
  }

  // Check for common arbitrary modifier patterns
  const validPatterns = [
    // Attribute selectors
    /^&?\[[^\]]+\]$/,
    // Pseudo-class selectors
    /^&?:[a-z-]+(\([^)]*\))?$/,
    // Complex selectors
    /^&[>+~]\s*[a-z]+$/,
    // Nth-child patterns
    /^&:nth-[a-z]+\([^)]+\)$/,
  ];

  if (validPatterns.some(pattern => pattern.test(content))) {
    return { valid: true };
  }

  // Allow any selector starting with & (parent reference)
  if (content.startsWith('&')) {
    return { valid: true };
  }

  return {
    valid: false,
    messageId: 'invalidModifier',
    reason: 'Invalid arbitrary modifier syntax',
  };
}

function validateParameterizedModifier(
  name: string,
  param: string,
): {
    valid: boolean
    messageId?: string
    reason?: string
  } {
  const validParameterized = [
    'nth-child',
    'nth-last-child',
    'nth-of-type',
    'nth-last-of-type',
  ];

  if (!validParameterized.includes(name)) {
    return {
      valid: false,
      messageId: 'invalidModifier',
      reason: `"${name}" is not a valid parameterized modifier`,
    };
  }

  // Validate parameter (should be number, "odd", "even", or formula like "2n+1")
  if (
    !/^(\d+|odd|even|\d*n(\s*[+-]\s*\d+)?)$/.test(param.trim())
  ) {
    return {
      valid: false,
      messageId: 'invalidModifier',
      reason: `Invalid parameter "${param}" for ${name}`,
    };
  }

  return { valid: true };
}

export const validModifierSyntax: CSSRuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate Tailwind CSS modifier syntax',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowedModifiers: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidModifier: 'Invalid modifier "{{modifier}}". {{reason}}',
      emptyModifier: 'Empty modifier is not allowed',
      nestedBrackets: 'Nested brackets in modifier "{{modifier}}" are not allowed',
      unclosedBracket: 'Unclosed bracket in modifier "{{modifier}}"',
      invalidCharacters: 'Modifier "{{modifier}}" contains invalid characters',
      duplicateModifier: 'Duplicate modifier "{{modifier}}" found',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const customModifiers = new Set(options.allowedModifiers || []);

    // Common valid modifiers in Tailwind CSS
    const builtInModifiers = new Set([
      // Pseudo-classes
      'hover',
      'focus',
      'active',
      'visited',
      'disabled',
      'enabled',
      'checked',
      'indeterminate',
      'required',
      'optional',
      'valid',
      'invalid',
      'in-range',
      'out-of-range',
      'placeholder-shown',
      'autofill',
      'read-only',
      // Pseudo-elements
      'before',
      'after',
      'first-letter',
      'first-line',
      'marker',
      'selection',
      'file',
      'backdrop',
      'placeholder',
      // Responsive
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      // Theme variants
      'dark',
      'light',
      // Motion
      'motion-safe',
      'motion-reduce',
      // Print
      'print',
      // Directional
      'ltr',
      'rtl',
      // Groups
      'group-hover',
      'group-focus',
      'peer-hover',
      'peer-focus',
      'peer-checked',
      'peer-disabled',
      // Child selectors
      'first',
      'last',
      'odd',
      'even',
      'only',
      'empty',
      // Forms
      'default',
      'focus-within',
      'focus-visible',
    ]);

    return {
      Atrule(node: AtrulePlain) {
        if (!isAtRule(node, 'apply') || !node.prelude) {
          return;
        }

        const utilities = extractUtilitiesFromApply(
          node.prelude,
          context.sourceCode,
        );

        for (const utility of utilities) {
          const parsed = parseUtilityClass(utility);
          const seenModifiers = new Set<string>();

          for (const modifier of parsed.modifiers) {
            // Check for duplicates
            if (seenModifiers.has(modifier)) {
              context.report({
                node: node.prelude,
                messageId: 'duplicateModifier',
                data: { modifier },
              });
              continue;
            }
            seenModifiers.add(modifier);

            // Validate the modifier
            const validation = validateModifier(modifier);
            if (!validation.valid) {
              context.report({
                node: node.prelude,
                messageId: validation.messageId!,
                data: {
                  modifier,
                  reason: validation.reason || '',
                },
                fix: validation.fix
                  ? (fixer) => {
                    const newUtility = utility.replace(
                      modifier + ':',
                      validation.fix + ':',
                    );
                    const newPrelude = utilities
                      .map(u => (u === utility ? newUtility : u))
                      .join(' ');
                    return fixer.replaceText(node.prelude!, newPrelude);
                  }
                  : undefined,
              });
            }
          }
        }
      },
    };

    function validateModifier(modifier: string): {
      valid: boolean
      messageId?: string
      reason?: string
      fix?: string
    } {
      // Check for empty modifier
      if (modifier === '') {
        return {
          valid: false,
          messageId: 'emptyModifier',
        };
      }

      // Check if it's a built-in or custom allowed modifier
      if (builtInModifiers.has(modifier) || customModifiers.has(modifier)) {
        return { valid: true };
      }

      // Check for arbitrary variant syntax [...]
      if (modifier.startsWith('[') && modifier.endsWith(']')) {
        return validateArbitraryModifier(modifier);
      }

      // Check for parameterized variants like nth-child(3)
      const paramMatch = modifier.match(/^([a-z-]+)\(([^)]+)\)$/);
      if (paramMatch) {
        const [, name, param] = paramMatch;
        return validateParameterizedModifier(name, param);
      }

      // Check for compound modifiers like group-hover
      if (modifier.includes('-')) {
        const parts = modifier.split('-');
        if (parts.length === 2) {
          const [prefix, suffix] = parts;
          if (
            (prefix === 'group' || prefix === 'peer')
            && builtInModifiers.has(suffix)
          ) {
            return { valid: true };
          }
        }
      }

      // Check for invalid characters
      if (!/^[a-z0-9-]+$/i.test(modifier)) {
        return {
          valid: false,
          messageId: 'invalidCharacters',
          reason: 'Modifiers should only contain letters, numbers, and hyphens',
        };
      }

      // Unknown modifier
      return {
        valid: false,
        messageId: 'invalidModifier',
        reason: 'Unknown modifier. Use arbitrary modifier syntax [&:...] for custom selectors',
      };
    }
  },
};
