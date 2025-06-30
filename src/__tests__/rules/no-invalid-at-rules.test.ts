import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noInvalidAtRules } from '../../rules/no-invalid-at-rules';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-invalid-at-rules', () => {
  ruleTester.run('tailwindcss/no-invalid-at-rules', noInvalidAtRules, {
    valid: [
      // Standard CSS at-rules
      { code: '@import "styles.css";' },
      { code: '@media (min-width: 768px) { .foo { color: red; } }' },
      { code: '@supports (display: flex) { .foo { display: flex; } }' },
      { code: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }' },
      { code: '@font-face { font-family: "Open Sans"; src: url("font.woff2"); }' },
      { code: '@page { margin: 1cm; }' },
      { code: '@charset "UTF-8";' },
      { code: '@namespace url(http://www.w3.org/1999/xhtml);' },
      { code: '@container (min-width: 700px) { .card { display: flex; } }' },
      { code: '@property --my-color { syntax: "<color>"; inherits: false; }' },
      { code: '@scope (.card) { .title { color: red; } }' },
      { code: '@starting-style { .item { opacity: 0; } }' },

      // Tailwind v4 at-rules
      { code: '@import "tailwindcss";' },
      { code: '@apply font-bold text-center;' },
      { code: '@theme { --color-primary: #3490dc; }' },
      { code: '@source "./src/**/*.js";' },
      { code: '@utility tab-4 { tab-size: 4; }' },
      { code: '@variant hover;' },
      { code: '@variant hover { &:hover { @slot; } }' },
      { code: '@custom-variant dark { &:where([data-theme="dark"]) { @slot; } }' },
      { code: '@reference "../../app.css";' },
      { code: '@config "../../tailwind.config.js";' },
      { code: '@plugin "../../my-plugin.js";' },
      { code: '@layer utilities { .tab-4 { tab-size: 4; } }' },
      { code: '@layer utilities;' }, // Layer can be used without block
      { code: '@tailwind base;' },

      // Nested at-rules
      {
        code: `
          @media (min-width: 768px) {
            @supports (display: grid) {
              .grid { display: grid; }
            }
          }
        `,
      },

      // Multiple at-rules
      {
        code: `
          @import "tailwindcss";
          @theme {
            --color-primary: #3490dc;
            --font-display: "Inter", sans-serif;
          }
          @utility tab-4 {
            tab-size: 4;
          }
        `,
      },

      // Ignored at-rules
      {
        code: '@unknown-rule { color: red; }',
        options: [{ ignoreAtRules: ['unknown-rule'] }],
      },

      // Edge cases
      { code: '@layer base {}' }, // Empty block is valid
      { code: '@media screen {}' }, // Empty media query is valid
    ],

    invalid: [
      // Typos in at-rule names
      {
        code: '@improt "styles.css";',
        errors: [{
          messageId: 'invalidAtRuleWithSuggestion',
          data: {
            name: 'improt',
            suggestion: 'import',
          },
        }],
      },
      {
        code: '@meida screen { }',
        errors: [{
          messageId: 'invalidAtRuleWithSuggestion',
          data: {
            name: 'meida',
            suggestion: 'media',
          },
        }],
      },
      {
        code: '@aply font-bold;',
        errors: [{
          messageId: 'invalidAtRuleWithSuggestion',
          data: {
            name: 'aply',
            suggestion: 'apply',
          },
        }],
      },
      {
        code: '@them { --color: red; }',
        errors: [{
          messageId: 'invalidAtRuleWithSuggestion',
          data: {
            name: 'them',
            suggestion: 'theme',
          },
        }],
      },

      // Completely invalid at-rules
      {
        code: '@invalid-rule { color: red; }',
        errors: [{
          messageId: 'invalidAtRule',
          data: {
            name: 'invalid-rule',
          },
        }],
      },
      {
        code: '@not-a-real-rule;',
        errors: [{
          messageId: 'invalidAtRule',
          data: {
            name: 'not-a-real-rule',
          },
        }],
      },

      // Missing required blocks
      {
        code: '@media (min-width: 768px);',
        errors: [{
          messageId: 'missingBlock',
          data: {
            name: 'media',
          },
        }],
      },
      {
        code: '@supports (display: flex);',
        errors: [{
          messageId: 'missingBlock',
          data: {
            name: 'supports',
          },
        }],
      },
      {
        code: '@keyframes fade;',
        errors: [{
          messageId: 'missingBlock',
          data: {
            name: 'keyframes',
          },
        }],
      },
      {
        code: '@theme;',
        errors: [{
          messageId: 'missingBlock',
          data: {
            name: 'theme',
          },
        }],
      },
      {
        code: '@utility tab-4;',
        errors: [{
          messageId: 'missingBlock',
          data: {
            name: 'utility',
          },
        }],
      },

      // Unexpected blocks
      {
        code: '@import "styles.css" { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'import',
          },
        }],
      },
      {
        code: '@charset "UTF-8" { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'charset',
          },
        }],
      },
      {
        code: '@apply font-bold { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'apply',
          },
        }],
      },
      {
        code: '@source "./src/**/*.js" { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'source',
          },
        }],
      },
      {
        code: '@reference "../../app.css" { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'reference',
          },
        }],
      },
      {
        code: '@config "tailwind.config.js" { }',
        errors: [{
          messageId: 'unexpectedBlock',
          data: {
            name: 'config',
          },
        }],
      },

      // Multiple errors
      {
        code: `
          @improt "styles.css";
          @meida screen { }
          @invalid-rule;
        `,
        errors: [
          {
            messageId: 'invalidAtRuleWithSuggestion',
            data: {
              name: 'improt',
              suggestion: 'import',
            },
          },
          {
            messageId: 'invalidAtRuleWithSuggestion',
            data: {
              name: 'meida',
              suggestion: 'media',
            },
          },
          {
            messageId: 'invalidAtRule',
            data: {
              name: 'invalid-rule',
            },
          },
        ],
      },
    ],
  });
});
