import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { validApplyDirective } from '../../rules/valid-apply-directive';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('valid-apply-directive', () => {
  ruleTester.run('tailwindcss/valid-apply-directive', validApplyDirective, {
    valid: [
      // Basic utility classes
      {
        code: '.btn { @apply px-4 py-2; }',
      },
      {
        code: '.card { @apply rounded-lg shadow-md bg-white; }',
      },
      // With modifiers - using escaped colons
      {
        code: String.raw`.link { @apply hover\:underline focus\:outline-none; }`,
      },
      {
        code: String.raw`.responsive { @apply sm\:block md\:flex lg\:grid; }`,
      },
      // Arbitrary values
      {
        code: '.custom { @apply text-[14px] p-[10px]; }',
      },
      {
        code: '.gradient { @apply bg-gradient-to-r from-[#ff0000] to-[#00ff00]; }',
      },
      // Complex utilities with escaped colons
      {
        code: String.raw`.complex { @apply first\:mt-0 last\:mb-0 odd\:bg-gray-100; }`,
      },
      // Empty with allowEmpty option
      {
        code: '.empty { @apply; }',
        options: [{ allowEmpty: true }],
      },
      // Many utilities but under limit
      {
        code: '.many { @apply p-1 p-2 p-3 p-4 p-5 p-6 p-7 p-8 p-9 p-10; }',
        options: [{ maxUtilities: 10 }],
      },
      // Fractional values
      {
        code: '.fractional { @apply w-1/2 h-3/4; }',
      },
      // Negative values
      {
        code: '.negative { @apply -mt-4 -mx-2; }',
      },
      // Complex selectors
      {
        code: '.parent > .child { @apply flex items-center; }',
      },
      {
        code: 'input[type="text"] { @apply border rounded; }',
      },
      // Test with comments
      {
        code: '.commented { @apply /* comment */ flex items-center; }',
      },
    ],

    invalid: [
      // Empty @apply
      {
        code: '.empty { @apply; }',
        errors: [{ messageId: 'emptyApply' }],
      },
      {
        code: '.empty { @apply   ; }',
        errors: [{ messageId: 'emptyApply' }],
      },
      // Too many utilities
      {
        code: '.too-many { @apply p-1 p-2 p-3 p-4 p-5 p-6; }',
        options: [{ maxUtilities: 5 }],
        errors: [{
          messageId: 'tooManyUtilities',
          data: { count: '6', max: '5' },
        }],
      },
      // CSS properties in @apply - need to escape colons
      {
        code: String.raw`.css-prop { @apply color\: red; }`,
        errors: [{
          messageId: 'cssPropertyInApply',
          data: { property: 'color' },
        }],
      },
      {
        code: String.raw`.css-prop { @apply display\: flex; }`,
        errors: [{
          messageId: 'cssPropertyInApply',
          data: { property: 'display' },
        }],
      },
      // Invalid utility formats - spaces split utilities
      {
        code: '.invalid { @apply text-[invalid value]; }', // Spaces in arbitrary values
        errors: [
          {
            messageId: 'invalidUtility',
            data: { utility: 'text-[invalid' },
          },
          {
            messageId: 'invalidUtility',
            data: { utility: 'value]' },
          },
        ],
      },
      {
        code: '.invalid { @apply bg--red; }',
        errors: [{
          messageId: 'invalidUtility',
          data: { utility: 'bg--red' },
        }],
      },
      {
        code: String.raw`.invalid { @apply p-\[10px; }`, // Escape the bracket
        errors: [{
          messageId: 'invalidUtility',
          data: { utility: 'p-[10px' },
        }],
      },
      // Nested @apply
      {
        code: `
          @apply bg-red-500 {
            @apply text-white;
          }
        `,
        errors: [{ messageId: 'nestedApply' }],
      },
      // @apply in media query
      {
        code: `
          @media (min-width: 768px) {
            .responsive { @apply flex; }
          }
        `,
        errors: [{ messageId: 'applyInMediaQuery' }],
      },
      // Multiple errors - adjusted syntax
      {
        code: String.raw`.multi-error { @apply display\: block hover\:flex\]; }`,
        errors: [
          {
            messageId: 'cssPropertyInApply',
            data: { property: 'display' },
          },
          {
            messageId: 'invalidUtility',
            data: { utility: 'hover:flex]' },
          },
        ],
      },
      // Invalid modifier syntax - hover without utility after colon
      {
        code: String.raw`.invalid-mod { @apply hover\: text-blue-500; }`,
        errors: [{
          messageId: 'cssPropertyInApply',
          data: { property: 'hover' },
        }],
      },
      // Invalid starting with number
      {
        code: '.invalid-num { @apply 123px; }',
        errors: [{
          messageId: 'invalidUtility',
          data: { utility: '123px' },
        }],
      },
    ],
  });
});
