import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noConflictingUtilities } from '../../rules/no-conflicting-utilities';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-conflicting-utilities', () => {
  ruleTester.run('tailwindcss/no-conflicting-utilities', noConflictingUtilities, {
    valid: [
      // Non-conflicting utilities
      {
        code: String.raw`.btn { @apply px-4 py-2 bg-blue-500 text-white; }`,
      },
      // Different properties
      {
        code: String.raw`.card { @apply w-full h-64 p-4 m-2; }`,
      },
      // Different modifiers (no conflict)
      {
        code: String.raw`.responsive { @apply hover\:bg-blue-500 focus\:bg-blue-600; }`,
      },
      // Specific overrides general (allowed pattern)
      {
        code: String.raw`.spacing { @apply p-4 pt-6; }`,
      },
      {
        code: String.raw`.margins { @apply m-4 ml-6 mr-8; }`,
      },
      // Different axes
      {
        code: String.raw`.axes { @apply px-4 py-2; }`,
      },
      // Complex non-conflicting
      {
        code: String.raw`.complex { @apply flex items-center justify-between gap-4; }`,
      },
      // Text utilities for different properties
      {
        code: String.raw`.text { @apply text-lg text-gray-700; }`,
      },
      // Border utilities for different properties
      {
        code: String.raw`.border { @apply border border-gray-300 rounded-lg; }`,
      },
      // Empty @apply
      {
        code: String.raw`.empty { @apply; }`,
      },
      // Single utility
      {
        code: String.raw`.single { @apply flex; }`,
      },
      // Negative values
      {
        code: String.raw`.negative { @apply -mt-4 -ml-2; }`,
      },
    ],

    invalid: [
      // Duplicate utilities - reports both duplicate and conflict
      {
        code: String.raw`.duplicate { @apply p-4 p-4; }`,
        errors: [
          {
            messageId: 'duplicateUtility',
            data: { utility: 'p-4' },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'p-4',
              utility2: 'p-4',
              property: 'padding',
            },
          },
        ],
        output: String.raw`.duplicate { @apply p-4; }`,
      },
      // Conflicting display utilities
      {
        code: String.raw`.display { @apply block flex; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'block',
            utility2: 'flex',
            property: 'display',
          },
        }],
        output: String.raw`.display { @apply flex; }`,
      },
      // Conflicting position utilities
      {
        code: String.raw`.position { @apply absolute relative; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'absolute',
            utility2: 'relative',
            property: 'position',
          },
        }],
        output: String.raw`.position { @apply relative; }`,
      },
      // Conflicting padding utilities
      {
        code: String.raw`.padding { @apply p-4 p-6; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'p-4',
            utility2: 'p-6',
            property: 'padding',
          },
        }],
        output: String.raw`.padding { @apply p-6; }`,
      },
      // Conflicting margin utilities - reports all pairs
      {
        code: String.raw`.margin { @apply m-2 m-4 m-6; }`,
        errors: [
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'm-2',
              utility2: 'm-4',
              property: 'margin',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'm-2',
              utility2: 'm-6',
              property: 'margin',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'm-4',
              utility2: 'm-6',
              property: 'margin',
            },
          },
        ],
        output: String.raw`.margin { @apply m-4 m-6; }`,
      },
      // Conflicting width utilities
      {
        code: String.raw`.width { @apply w-full w-1/2; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'w-full',
            utility2: 'w-1/2',
            property: 'width',
          },
        }],
        output: String.raw`.width { @apply w-1/2; }`,
      },
      // Conflicting justify utilities - reports all pairs
      {
        code: String.raw`.justify { @apply justify-start justify-center justify-end; }`,
        errors: [
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'justify-start',
              utility2: 'justify-center',
              property: 'justify-content',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'justify-start',
              utility2: 'justify-end',
              property: 'justify-content',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'justify-center',
              utility2: 'justify-end',
              property: 'justify-content',
            },
          },
        ],
        output: String.raw`.justify { @apply justify-center justify-end; }`,
      },
      // Flex direction conflict
      {
        code: String.raw`.flex-dir { @apply flex-row flex-col; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'flex-row',
            utility2: 'flex-col',
            property: 'flex-direction',
          },
        }],
        output: String.raw`.flex-dir { @apply flex-col; }`,
      },
      // Align items conflict
      {
        code: String.raw`.align { @apply items-start items-center; }`,
        errors: [{
          messageId: 'conflictingUtilities',
          data: {
            utility1: 'items-start',
            utility2: 'items-center',
            property: 'align-items',
          },
        }],
        output: String.raw`.align { @apply items-center; }`,
      },
      // Multiple issues - the rule reports all conflicts
      {
        code: String.raw`.multiple { @apply flex flex block p-4 p-4; }`,
        errors: [
          {
            messageId: 'duplicateUtility',
            data: { utility: 'flex' },
          },
          {
            messageId: 'duplicateUtility',
            data: { utility: 'p-4' },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'flex',
              utility2: 'flex',
              property: 'display',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'flex',
              utility2: 'block',
              property: 'display',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'flex',
              utility2: 'block',
              property: 'display',
            },
          },
          {
            messageId: 'conflictingUtilities',
            data: {
              utility1: 'p-4',
              utility2: 'p-4',
              property: 'padding',
            },
          },
        ],
        output: String.raw`.multiple { @apply flex block p-4 p-4; }`,
      },
    ],
  });
});
