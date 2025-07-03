import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { requireReferenceInVue } from '../../rules/require-reference-in-vue';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('require-reference-in-vue', () => {
  ruleTester.run('tailwindcss/require-reference-in-vue', requireReferenceInVue, {
    valid: [
      // Valid: Has @reference directive at the beginning
      {
        filename: 'component.vue',
        code: '@reference "tailwindcss";\n\n.button {\n  color: red;\n}',
      },
      // Valid: Has @reference with different path
      {
        filename: 'MyComponent.vue',
        code: '@reference "../../styles/tailwind.css";\n\nh1 {\n  @apply text-2xl font-bold;\n}',
      },
      // Valid: Not a Vue file (rule doesn't apply)
      {
        filename: 'styles.css',
        code: '.button {\n  color: red;\n}',
      },
      // Valid: Not a Vue file - even without @reference
      {
        filename: 'app.css',
        code: '@import "tailwindcss";\n\n.container {\n  max-width: 1200px;\n}',
      },
    ],
    invalid: [
      // Invalid: Missing @reference directive
      {
        filename: 'component.vue',
        code: '.button {\n  color: red;\n}',
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: '@reference "tailwindcss";\n\n.button {\n  color: red;\n}',
      },
      // Invalid: Empty Vue style block without @reference
      {
        filename: 'EmptyComponent.vue',
        code: '',
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: '@reference "tailwindcss";\n',
      },
      // Invalid: Has other at-rules but missing @reference
      {
        filename: 'StyledComponent.vue',
        code: '@import "variables.css";\n\n.container {\n  padding: 1rem;\n}',
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: '@reference "tailwindcss";\n\n@import "variables.css";\n\n.container {\n  padding: 1rem;\n}',
      },
      // Invalid: Missing @reference with custom fallback option
      {
        filename: 'CustomRef.vue',
        code: '.custom {\n  color: blue;\n}',
        options: [{ fallbackReference: '../app.css' }],
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: '@reference "../app.css";\n\n.custom {\n  color: blue;\n}',
      },
    ],
  });
});
