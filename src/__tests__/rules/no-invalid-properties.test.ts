import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noInvalidProperties } from '../../rules/no-invalid-properties';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-invalid-properties', () => {
  ruleTester.run('tailwindcss/no-invalid-properties', noInvalidProperties, {
    valid: [
      // Standard properties
      { code: '.foo { color: red; }' },
      { code: '.foo { background-color: blue; }' },
      { code: '.foo { margin: 10px; }' },
      { code: '.foo { display: flex; }' },
      { code: '.foo { z-index: 10; }' },

      // Vendor prefixed properties
      { code: '.foo { -webkit-appearance: none; }' },
      { code: '.foo { -moz-user-select: none; }' },
      { code: '.foo { -ms-transform: rotate(45deg); }' },

      // Custom properties (CSS variables)
      { code: '.foo { --custom-color: red; }' },
      { code: '.foo { --my-spacing: 1rem; }' },

      // Multiple properties
      {
        code: `
          .foo {
            color: red;
            background: blue;
            margin: 0;
          }
        `,
      },

      // Ignored properties
      {
        code: '.foo { invalid-prop: value; }',
        options: [{ ignoreProperties: ['invalid-prop'] }],
      },

      // CSS logical properties
      { code: '.foo { margin-inline: 10px; }' },
      { code: '.foo { padding-block-start: 20px; }' },

      // Modern CSS properties
      { code: '.foo { aspect-ratio: 16/9; }' },
      { code: '.foo { container-type: inline-size; }' },
      { code: '.foo { scrollbar-width: thin; }' },
    ],

    invalid: [
      // Typos
      {
        code: '.foo { colour: red; }',
        errors: [{
          messageId: 'invalidPropertyWithSuggestion',
          data: {
            property: 'colour',
            suggestion: 'color',
          },
        }],
      },
      {
        code: '.foo { bg-color: blue; }',
        errors: [{
          messageId: 'invalidPropertyWithSuggestion',
          data: {
            property: 'bg-color',
            suggestion: 'background-color',
          },
        }],
      },

      // Completely invalid properties
      {
        code: '.foo { invalid-property: value; }',
        errors: [{
          messageId: 'invalidProperty',
          data: {
            property: 'invalid-property',
          },
        }],
      },
      {
        code: '.foo { not-a-real-prop: 10px; }',
        errors: [{
          messageId: 'invalidProperty',
          data: {
            property: 'not-a-real-prop',
          },
        }],
      },

      // Multiple invalid properties
      {
        code: `
          .foo {
            colour: red;
            bg: blue;
            invalid: value;
          }
        `,
        errors: [
          {
            messageId: 'invalidPropertyWithSuggestion',
            data: {
              property: 'colour',
              suggestion: 'color',
            },
          },
          {
            messageId: 'invalidPropertyWithSuggestion',
            data: {
              property: 'bg',
              suggestion: 'background',
            },
          },
          {
            messageId: 'invalidProperty',
            data: {
              property: 'invalid',
            },
          },
        ],
      },

      // Invalid with vendor prefix attempt
      {
        code: '.foo { -webkit-invalid-prop: none; }',
        errors: [{
          messageId: 'invalidProperty',
          data: {
            property: '-webkit-invalid-prop',
          },
        }],
      },

      // Case sensitivity
      {
        code: '.foo { Background-Color: red; }',
        errors: [{
          messageId: 'invalidPropertyWithSuggestion',
          data: {
            property: 'Background-Color',
            suggestion: 'background-color',
          },
        }],
      },
    ],
  });
});
