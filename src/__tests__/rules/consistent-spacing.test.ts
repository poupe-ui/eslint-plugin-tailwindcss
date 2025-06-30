import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { consistentSpacing } from '../../rules/consistent-spacing';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: {
    css,
  },
});

describe('consistent-spacing rule', () => {
  ruleTester.run('tailwindcss/consistent-spacing', consistentSpacing, {
    valid: [
      // Default: space after colon, no space before
      {
        code: '.example { color: red; }',
      },
      {
        code: '.example {\n  color: red;\n  background: blue;\n}',
      },
      // With options
      {
        code: '.example { color:red; }',
        options: [{ afterColon: 'never' }],
      },
      {
        code: '.example { color : red; }',
        options: [{ beforeColon: 'always', afterColon: 'always' }],
      },
      // Complex values
      {
        code: '.example { margin: 10px 20px; }',
      },
      {
        code: '.example { font-family: "Helvetica Neue", sans-serif; }',
      },
    ],

    invalid: [
      // Missing space after colon
      {
        code: '.example { color:red; }',
        errors: [{ messageId: 'expectedSpaceAfterColon' }],
        output: '.example { color: red; }',
      },
      // Multiple spaces after colon
      {
        code: '.example { color:   red; }',
        errors: [{ messageId: 'multipleSpacesAfterColon' }],
        output: '.example { color: red; }',
      },
      // Space before colon (default: never)
      {
        code: '.example { color : red; }',
        errors: [{ messageId: 'unexpectedSpaceBeforeColon' }],
        output: '.example { color: red; }',
      },
      // Multiple spaces before colon
      {
        code: '.example { color   : red; }',
        errors: [{ messageId: 'multipleSpacesBeforeColon' }],
        output: '.example { color: red; }',
      },
      // Multiple issues
      {
        code: '.example { color   :   red; }',
        errors: [
          { messageId: 'multipleSpacesBeforeColon' },
          { messageId: 'multipleSpacesAfterColon' },
        ],
        output: '.example { color: red; }',
      },
      // With options: no space after
      {
        code: '.example { color: red; }',
        options: [{ afterColon: 'never' }],
        errors: [{ messageId: 'unexpectedSpaceAfterColon' }],
        output: '.example { color:red; }',
      },
      // With options: space before
      {
        code: '.example { color: red; }',
        options: [{ beforeColon: 'always' }],
        errors: [{ messageId: 'expectedSpaceBeforeColon' }],
        output: '.example { color : red; }',
      },
      // Multiple declarations
      {
        code: '.example {\n  color:red;\n  background:  blue;\n}',
        errors: [
          { messageId: 'expectedSpaceAfterColon', line: 2 },
          { messageId: 'multipleSpacesAfterColon', line: 3 },
        ],
        output: '.example {\n  color: red;\n  background: blue;\n}',
      },
    ],
  });
});
