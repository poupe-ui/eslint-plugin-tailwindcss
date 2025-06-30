import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { consistentSpacing } from '../rules/consistent-spacing';
import { validApplyDirective } from '../rules/valid-apply-directive';
import { validModifierSyntax } from '../rules/valid-modifier-syntax';
import { validThemeFunction } from '../rules/valid-theme-function';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: {
    css,
  },
});

describe('Malformed CSS handling', () => {
  describe('Parser behavior with malformed CSS', () => {
    const testCases = [
      {
        name: 'Missing closing brace',
        code: '.test { color: red',
        shouldParse: true, // Parser is lenient
      },
      {
        name: 'Missing value after colon',
        code: '.test { color: }',
        shouldParse: true, // Parser accepts this
      },
      {
        name: 'Missing semicolon',
        code: '.test { color: red }',
        shouldParse: true, // Valid CSS
      },
      {
        name: 'Double colon',
        code: '.test { color:: red; }',
        shouldParse: true, // Parser may accept this
      },
      {
        name: 'Missing property name',
        code: '.test { : red; }',
        shouldParse: true, // Parser is lenient
      },
      {
        name: 'Unclosed string',
        code: '.test { content: "unclosed }',
        shouldParse: true, // Parser is lenient
      },
      {
        name: 'Invalid at-rule',
        code: '@apply;',
        shouldParse: true, // Valid syntax, just empty
      },
      {
        name: 'Nested at-rule in wrong context',
        code: '.test { @apply text-red-500 }',
        shouldParse: true, // Parser accepts nested at-rules
      },
    ];

    for (const { name, code, shouldParse } of testCases) {
      it(`${name}: ${shouldParse ? 'should parse' : 'should not parse'}`, () => {
        if (shouldParse) {
          expect(() => {
            ruleTester.run('test', consistentSpacing, {
              valid: [{ code }],
              invalid: [],
            });
          }).not.toThrow();
        } else {
          expect(() => {
            ruleTester.run('test', consistentSpacing, {
              valid: [{ code }],
              invalid: [],
            });
          }).toThrow();
        }
      });
    }
  });

  describe('Rule behavior with edge cases', () => {
    it('consistent-spacing should handle declarations without values gracefully', () => {
      ruleTester.run('tailwindcss/consistent-spacing', consistentSpacing, {
        valid: [
          // These should not crash the rule
          { code: '.test { color: }' },
          { code: '.test { color: ; }' },
        ],
        invalid: [],
      });
    });

    it('valid-apply-directive should handle empty @apply', () => {
      ruleTester.run('tailwindcss/valid-apply-directive', validApplyDirective, {
        valid: [
          { code: '@apply;' }, // Empty but valid syntax
        ],
        invalid: [
          {
            code: '@apply ;', // Space but no utilities
            errors: [{ messageId: 'emptyApply' }],
          },
        ],
      });
    });

    it('valid-modifier-syntax should handle malformed modifiers', () => {
      ruleTester.run('tailwindcss/valid-modifier-syntax', validModifierSyntax, {
        valid: [],
        invalid: [
          {
            code: '.test { @apply :text-red-500; }',
            errors: [{ messageId: 'emptyModifier' }],
          },
          {
            code: '.test { @apply hover::text-red-500; }',
            errors: [{ messageId: 'emptyModifier' }],
          },
        ],
      });
    });

    it('valid-theme-function should handle malformed theme calls', () => {
      ruleTester.run('tailwindcss/valid-theme-function', validThemeFunction, {
        valid: [
          { code: '.test { color: theme(); }' }, // Empty but syntactically valid
        ],
        invalid: [
          {
            code: '.test { color: theme(; }',
            errors: [], // Parser error, not rule error
          },
        ],
      });
    });
  });
});
