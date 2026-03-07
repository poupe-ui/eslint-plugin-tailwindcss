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
        code: `@reference "tailwindcss";

.button {
  color: red;
}`,
      },
      // Valid: Has @reference with different path
      {
        filename: 'MyComponent.vue',
        code: `@reference "../../styles/tailwind.css";

h1 {
  @apply text-2xl font-bold;
}`,
      },
      // Valid: Not a Vue file (rule doesn't apply)
      {
        filename: 'styles.css',
        code: `.button {
  color: red;
}`,
      },
      // Valid: Not a Vue file - even without @reference
      {
        filename: 'app.css',
        code: `@import "tailwindcss";

.container {
  max-width: 1200px;
}`,
      },
      // Valid: Top-level @reference with nested at-rules
      {
        filename: 'WithMedia.vue',
        code: `@reference "tailwindcss";

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}`,
      },
    ],
    invalid: [
      // Invalid: Missing @reference directive
      {
        filename: 'component.vue',
        code: `.button {
  color: red;
}`,
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: `@reference "tailwindcss";

.button {
  color: red;
}`,
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
        code: `@import "variables.css";

.container {
  padding: 1rem;
}`,
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: `@reference "tailwindcss";

@import "variables.css";

.container {
  padding: 1rem;
}`,
      },
      // Invalid: Missing @reference with custom fallback option
      {
        filename: 'CustomRef.vue',
        code: `.custom {
  color: blue;
}`,
        options: [{ fallbackReference: '../app.css' }],
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: `@reference "../app.css";

.custom {
  color: blue;
}`,
      },
      // Invalid: @reference only inside nested block (regression test)
      {
        filename: 'NestedOnly.vue',
        code: `@media screen {
  @reference "tailwindcss";
}

.button {
  color: red;
}`,
        errors: [
          {
            messageId: 'missingReference',
            line: 1,
            column: 1,
          },
        ],
        output: `@reference "tailwindcss";

@media screen {
  @reference "tailwindcss";
}

.button {
  color: red;
}`,
      },
    ],
  });
});
