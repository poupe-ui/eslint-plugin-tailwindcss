import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noDuplicateImports } from '../../rules/no-duplicate-imports';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-duplicate-imports', () => {
  ruleTester.run('tailwindcss/no-duplicate-imports', noDuplicateImports, {
    valid: [
      {
        code: '@import "tailwindcss/base.css";',
      },
      {
        code: '@import "tailwindcss/base.css";\n@import "tailwindcss/components.css";',
      },
      {
        code: '@import url("styles.css");',
      },
      {
        code: '@import url(reset.css);\n@import url(styles.css);',
      },
      {
        code: '@import "theme.css";\n@import url("components.css");',
      },
    ],
    invalid: [
      {
        code: '@import "styles.css";\n@import "styles.css";',
        errors: [
          {
            messageId: 'duplicateImport',
            data: { url: 'styles.css' },
            line: 2,
          },
        ],
      },
      {
        code: '@import url("reset.css");\n@import url("reset.css");',
        errors: [
          {
            messageId: 'duplicateImport',
            data: { url: 'reset.css' },
            line: 2,
          },
        ],
      },
      {
        code: '@import "theme.css";\n@import "components.css";\n@import "theme.css";',
        errors: [
          {
            messageId: 'duplicateImport',
            data: { url: 'theme.css' },
            line: 3,
          },
        ],
      },
      {
        code: '@import url(styles.css);\n@import url(styles.css);',
        errors: [
          {
            messageId: 'duplicateImport',
            data: { url: 'styles.css' },
            line: 2,
          },
        ],
      },
      {
        code: '@import "base.css";\n/* Some comment */\n@import "base.css";',
        errors: [
          {
            messageId: 'duplicateImport',
            data: { url: 'base.css' },
            line: 3,
          },
        ],
      },
    ],
  });
});
