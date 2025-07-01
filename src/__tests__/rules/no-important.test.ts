import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noImportant } from '../../rules/no-important';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-important', () => {
  ruleTester.run('tailwindcss/no-important', noImportant, {
    valid: [
      // Simple declarations without !important
      {
        code: '.button { color: red; }',
      },
      {
        code: '.button { color: red; background: blue; }',
      },
      // Multiple rules without !important
      {
        code: `
          .header { font-size: 24px; }
          .body { font-size: 16px; }
        `,
      },
      // Complex selectors without !important
      {
        code: '.button:hover { color: blue; }',
      },
      {
        code: '#id.class[attr] { display: block; }',
      },
      // Media queries without !important
      {
        code: '@media (min-width: 768px) { .button { padding: 20px; } }',
      },
      // Nested rules without !important
      {
        code: '@supports (display: grid) { .grid { display: grid; } }',
      },
      // CSS variables without !important
      {
        code: ':root { --color: red; }',
      },
      // Pseudo-elements without !important
      {
        code: '.button::before { content: ""; }',
      },
      // Multiple properties without !important
      {
        code: `
          .complex {
            margin: 10px;
            padding: 20px;
            border: 1px solid black;
            background: white;
            color: black;
          }
        `,
      },
      // Empty declarations (edge case)
      {
        code: '.empty { }',
      },
      // Comments in declarations
      {
        code: '.commented { /* comment */ color: red /* another comment */; }',
      },
    ],
    invalid: [
      // Simple !important usage
      {
        code: '.button { color: red !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // Multiple properties with !important
      {
        code: '.button { color: red !important; background: blue !important; }',
        errors: [
          { messageId: 'avoidImportant' },
          { messageId: 'avoidImportant' },
        ],
      },
      // !important with spacing variations
      {
        code: '.button { color: red ! important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.button { color: red!important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.button { color: red   !important  ; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important in complex values
      {
        code: '.button { margin: 10px 20px 30px 40px !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.button { background: linear-gradient(to right, red, blue) !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important in media queries
      {
        code: '@media (min-width: 768px) { .button { padding: 20px !important; } }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important in nested at-rules
      {
        code: '@supports (display: grid) { .grid { display: grid !important; } }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // Mixed important and non-important
      {
        code: `
          .mixed {
            color: red;
            background: blue !important;
            margin: 10px;
            padding: 20px !important;
          }
        `,
        errors: [
          { messageId: 'avoidImportant' },
          { messageId: 'avoidImportant' },
        ],
      },
      // !important with vendor prefixes
      {
        code: '.vendor { -webkit-transform: rotate(45deg) !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important with CSS variables
      {
        code: '.var { color: var(--primary) !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important with calc()
      {
        code: '.calc { width: calc(100% - 20px) !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // Case variations
      {
        code: '.case { color: red !IMPORTANT; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.case { color: red !Important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important in shorthand properties
      {
        code: '.shorthand { margin: 10px !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.shorthand { border: 1px solid black !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // Multiple selectors with !important
      {
        code: '.a, .b, .c { color: red !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important in keyframes (should still report)
      {
        code: '@keyframes slide { from { left: 0 !important; } }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      // !important with comments
      {
        code: '.commented { color: red /* comment */ !important; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
      {
        code: '.commented { color: red !important /* after */; }',
        errors: [{ messageId: 'avoidImportant' }],
      },
    ],
  });
});
