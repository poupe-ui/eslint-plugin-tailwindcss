import type { AtrulePlain } from '@eslint/css-tree';

import type { CSSRuleModule } from '../types';

import { isAtRule } from '../utils/ast';
import { extractUtilitiesFromApply, parseUtilityClass } from '../utils/tailwind';

/**
 * Validates arbitrary modifier syntax (e.g., `[&:hover]`, `[@media(hover)]`)
 *
 * @param modifier - The full modifier string including brackets
 * @returns Validation result with error details if invalid
 */
function validateArbitraryModifier(modifier: string): {
  valid: boolean
  messageId?: string
  reason?: string
} {
  const content = modifier.slice(1, -1);

  // Check for nested brackets - simple check for double brackets
  if (content.includes('[[') || content.includes(']]')) {
    return {
      valid: false,
      messageId: 'nestedBrackets',
    };
  }

  // Also check for unbalanced brackets
  let bracketDepth = 0;
  for (const element of content) {
    if (element === '[') {
      bracketDepth++;
      if (bracketDepth > 1) {
        return {
          valid: false,
          messageId: 'nestedBrackets',
        };
      }
    } else if (element === ']') {
      bracketDepth--;
    }
  }

  // Allow any selector starting with & (parent reference)
  if (content.startsWith('&')) {
    return { valid: true };
  }

  // Allow other common patterns
  if (/^[a-z-]+$/.test(content)) {
    // Simple selectors like "open", "dark", etc
    return { valid: true };
  }

  return {
    valid: false,
    messageId: 'invalidModifier',
    reason: 'Invalid arbitrary modifier syntax',
  };
}

/**
 * Validates parameterized modifiers (e.g., nth-child(3), nth-last-of-type(2n+1))
 *
 * @param name - The modifier name (e.g., 'nth-child')
 * @param param - The parameter value (e.g., '3', '2n+1')
 * @returns Validation result with error details if invalid
 */
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
      // Tailwind CSS v4 additions
      'inert',
      'target',
      'open',
      // Starting style
      'starting',
      // Popover
      'popover-open',
      // Dynamic nth variants are handled separately
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

      // Handle escaped colons that would show up as : in the modifier
      if (modifier === ':') {
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

      // Check for compound modifiers like group-hover, not-*, in-*
      if (modifier.includes('-')) {
        const parts = modifier.split('-');
        if (parts.length === 2) {
          const [prefix, suffix] = parts;
          // Handle group-* and peer-* modifiers
          if (
            (prefix === 'group' || prefix === 'peer')
            && builtInModifiers.has(suffix)
          ) {
            return { valid: true };
          }
          // Handle not-* modifiers (Tailwind v4)
          if (prefix === 'not' && suffix.length > 0) {
            return { valid: true };
          }
          // Handle in-* modifiers (Tailwind v4)
          if (prefix === 'in' && suffix.length > 0) {
            return { valid: true };
          }
        }
      }

      // Check for invalid characters (but allow common CSS selector characters in arbitrary modifiers)
      if (modifier.startsWith('[') || modifier.includes('(')) {
        // Arbitrary modifiers can contain more characters
        if (!/^[\w\s-[\]()&:>+~#.=,"']+$/i.test(modifier)) {
          return {
            valid: false,
            messageId: 'invalidCharacters',
            reason: 'Invalid characters in modifier',
          };
        }
      } else {
        // Regular modifiers should only contain letters, numbers, hyphens, brackets, and parentheses
        if (!/^[a-z0-9\-[\]()]+$/i.test(modifier)) {
          return {
            valid: false,
            messageId: 'invalidCharacters',
            reason: 'Modifiers should only contain letters, numbers, hyphens, brackets, and parentheses',
          };
        }
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
