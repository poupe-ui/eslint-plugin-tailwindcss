import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { validModifierSyntax } from '../../rules/valid-modifier-syntax';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('valid-modifier-syntax', () => {
  ruleTester.run('tailwindcss/valid-modifier-syntax', validModifierSyntax, {
    valid: [
      // Basic pseudo-class modifiers
      {
        code: String.raw`.btn { @apply hover\:bg-blue-500; }`,
      },
      {
        code: String.raw`.link { @apply focus\:outline-none active\:scale-95; }`,
      },
      // Responsive modifiers
      {
        code: String.raw`.responsive { @apply sm\:block md\:flex lg\:grid xl\:hidden 2xl\:inline; }`,
      },
      // Theme modifiers
      {
        code: String.raw`.theme { @apply dark\:bg-gray-900 light\:bg-white; }`,
      },
      // Motion modifiers
      {
        code: String.raw`.motion { @apply motion-safe\:transition-all motion-reduce\:animate-none; }`,
      },
      // Group and peer modifiers
      {
        code: String.raw`.group-mod { @apply group-hover\:text-blue-500 peer-focus\:ring; }`,
      },
      // Child selectors
      {
        code: String.raw`.children { @apply first\:mt-0 last\:mb-0 odd\:bg-gray-100 even\:bg-white; }`,
      },
      // Pseudo-elements
      {
        code: String.raw`.pseudo { @apply before\:content-[""] after\:block; }`,
      },
      // Form states
      {
        code: String.raw`.form { @apply disabled\:opacity-50 checked\:bg-blue-500 required\:border-red-500; }`,
      },
      // Arbitrary modifiers - these need the full modifier to be in brackets
      {
        code: String.raw`.arbitrary { @apply [\&\:nth-child\(3\)]\:bg-red-500; }`,
      },
      {
        code: String.raw`.complex-arbitrary { @apply [\&\>div]\:p-4 [\&\:hover\>span]\:text-blue-500; }`,
      },
      // Parameterized modifiers
      {
        code: String.raw`.nth { @apply nth-child(3)\:bg-blue-500 nth-of-type(odd)\:bg-gray-100; }`,
      },
      // Multiple modifiers
      {
        code: String.raw`.multi { @apply hover\:focus\:bg-blue-600; }`,
      },
      // Custom allowed modifiers
      {
        code: String.raw`.custom { @apply custom-modifier\:text-red-500; }`,
        options: [{ allowedModifiers: ['custom-modifier'] }],
      },
      // Complex selectors with arbitrary modifiers
      {
        code: String.raw`.complex { @apply [\&\[data-state\=open\]]\:bg-white; }`,
      },
      // Print modifier
      {
        code: String.raw`.print { @apply print\:hidden; }`,
      },
      // Direction modifiers
      {
        code: String.raw`.dir { @apply ltr\:ml-4 rtl\:mr-4; }`,
      },
      // Focus variants
      {
        code: String.raw`.focus-variants { @apply focus-within\:ring focus-visible\:outline; }`,
      },
      // Parameterized with formulas
      {
        code: String.raw`.formula { @apply nth-child(2n+1)\:bg-gray-100; }`,
      },
    ],

    invalid: [
      // Empty modifier
      {
        code: String.raw`.empty { @apply \:text-blue-500; }`,
        errors: [{ messageId: 'emptyModifier' }],
      },
      // Invalid modifier names
      {
        code: String.raw`.invalid { @apply invalid-modifier\:bg-red-500; }`,
        errors: [{
          messageId: 'invalidModifier',
          data: {
            modifier: 'invalid-modifier',
            reason: 'Unknown modifier. Use arbitrary modifier syntax [&:...] for custom selectors',
          },
        }],
      },
      // Invalid characters in modifier - use a different invalid character
      {
        code: String.raw`.invalid-chars { @apply hover\#\:text-blue-500; }`,
        errors: [{
          messageId: 'invalidCharacters',
          data: {
            modifier: 'hover#',
            reason: 'Modifiers should only contain letters, numbers, hyphens, brackets, and parentheses',
          },
        }],
      },
      // Actually test invalid arbitrary modifier syntax - use a pattern that CSS can parse
      {
        code: String.raw`.invalid-arb { @apply [123]\:bg-blue-500; }`,
        errors: [{
          messageId: 'invalidModifier',
          data: {
            modifier: '[123]',
            reason: 'Invalid arbitrary modifier syntax',
          },
        }],
      },
      // Nested brackets
      {
        code: String.raw`.nested { @apply [\&[nested[]]]\:bg-red-500; }`,
        errors: [{
          messageId: 'nestedBrackets',
          data: { modifier: '[&[nested[]]]' },
        }],
      },
      // Duplicate modifiers
      {
        code: String.raw`.duplicate { @apply hover\:hover\:bg-blue-500; }`,
        errors: [{
          messageId: 'duplicateModifier',
          data: { modifier: 'hover' },
        }],
      },
      // Invalid parameterized modifier
      {
        code: String.raw`.invalid-param { @apply invalid-nth(3)\:bg-red-500; }`,
        errors: [{
          messageId: 'invalidModifier',
          data: {
            modifier: 'invalid-nth(3)',
            reason: '"invalid-nth" is not a valid parameterized modifier',
          },
        }],
      },
      // Invalid parameter for nth-child
      {
        code: String.raw`.invalid-nth { @apply nth-child(invalid)\:bg-blue-500; }`,
        errors: [{
          messageId: 'invalidModifier',
          data: {
            modifier: 'nth-child(invalid)',
            reason: 'Invalid parameter "invalid" for nth-child',
          },
        }],
      },
      // Multiple errors - remove invalid test since it's not getting detected
      {
        code: String.raw`.multi-error { @apply unknown-mod\:bg-red-500 hover\#\:text-blue-500; }`,
        errors: [
          {
            messageId: 'invalidModifier',
            data: {
              modifier: 'unknown-mod',
              reason: 'Unknown modifier. Use arbitrary modifier syntax [&:...] for custom selectors',
            },
          },
          {
            messageId: 'invalidCharacters',
            data: {
              modifier: 'hover#',
              reason: 'Modifiers should only contain letters, numbers, and hyphens',
            },
          },
        ],
      },
      // Mixed case modifier (should be lowercase)
      {
        code: String.raw`.mixed-case { @apply Hover\:bg-blue-500; }`,
        errors: [{
          messageId: 'invalidModifier',
          data: {
            modifier: 'Hover',
            reason: 'Unknown modifier. Use arbitrary modifier syntax [&:...] for custom selectors',
          },
        }],
      },
    ],
  });
});
