/**
 * Tests for no-duplicate-reference rule
 */

import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noDuplicateReference } from '../../rules/no-duplicate-reference';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-duplicate-reference', () => {
  ruleTester.run('tailwindcss/no-duplicate-reference', noDuplicateReference, {
    valid: [
      {
        name: 'Single @reference directive',
        code: '@reference "tailwindcss";',
      },
      {
        name: 'Different @reference values',
        code: `
          @reference "tailwindcss";
          @reference "./custom-styles.css";
        `,
      },
      {
        name: '@reference with url() syntax',
        code: '@reference url("tailwindcss");',
      },
      {
        name: 'Different paths are allowed',
        code: `
          @reference "../styles/theme.css";
          @reference "../styles/utilities.css";
        `,
      },
      {
        name: 'Single quotes',
        code: '@reference \'tailwindcss\';',
      },
      {
        name: 'Mixed quote styles with different values',
        code: `
          @reference "tailwindcss";
          @reference 'custom-theme';
        `,
      },
      {
        name: 'Other at-rules are ignored',
        code: `
          @import "tailwindcss";
          @import "tailwindcss";
          @reference "tailwindcss";
        `,
      },
    ],
    invalid: [
      {
        name: 'Duplicate @reference with double quotes',
        code: `
          @reference "tailwindcss";
          @reference "tailwindcss";
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
      {
        name: 'Duplicate @reference with single quotes',
        code: `
          @reference 'tailwindcss';
          @reference 'tailwindcss';
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
      {
        name: 'Duplicate @reference with mixed quotes',
        code: `
          @reference "tailwindcss";
          @reference 'tailwindcss';
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
      {
        name: 'Multiple duplicates',
        code: `
          @reference "tailwindcss";
          @reference "custom-theme";
          @reference "tailwindcss";
          @reference "custom-theme";
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 4,
            column: 11,
          },
          {
            messageId: 'duplicateReference',
            data: { reference: 'custom-theme' },
            line: 5,
            column: 11,
          },
        ],
      },
      {
        name: 'Duplicate with url() syntax',
        code: `
          @reference url("tailwindcss");
          @reference url("tailwindcss");
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
      {
        name: 'Duplicate with mixed url() and string syntax',
        code: `
          @reference "tailwindcss";
          @reference url("tailwindcss");
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
      {
        name: 'Three duplicates of the same reference',
        code: `
          @reference "theme.css";
          @reference "theme.css";
          @reference "theme.css";
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'theme.css' },
            line: 3,
            column: 11,
          },
          {
            messageId: 'duplicateReference',
            data: { reference: 'theme.css' },
            line: 4,
            column: 11,
          },
        ],
      },
      {
        name: 'Duplicates with whitespace variations',
        code: `
          @reference   "tailwindcss"  ;
          @reference "tailwindcss";
        `,
        errors: [
          {
            messageId: 'duplicateReference',
            data: { reference: 'tailwindcss' },
            line: 3,
            column: 11,
          },
        ],
      },
    ],
  });
});
