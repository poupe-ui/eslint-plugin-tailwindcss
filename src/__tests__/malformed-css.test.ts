import css from '@eslint/css';
import { Linter, RuleTester } from 'eslint';

import { consistentSpacing } from '../rules/consistent-spacing';
import { validApplyDirective } from '../rules/valid-apply-directive';
import { validThemeFunction } from '../rules/valid-theme-function';

const cssConfig = {
  language: 'css/css' as const,
  plugins: {
    css,
  },
};

const linter = new Linter();
const ruleTester = new RuleTester(cssConfig);

function expectParseError(code: string) {
  const messages = linter.verify(code, cssConfig);
  expect(messages.filter(m => m.fatal).length).toBeGreaterThan(0);
}

function expectNoParseError(code: string) {
  const messages = linter.verify(code, cssConfig);
  expect(messages.filter(m => m.fatal)).toHaveLength(0);
}

describe('Malformed CSS handling', () => {
  describe('Parser accepts lenient CSS', () => {
    const cases = [
      { name: 'Missing value after colon', code: '.test { color: }' },
      { name: 'Missing semicolon', code: '.test { color: red }' },
      { name: 'Empty at-rule', code: '@apply;' },
    ];

    for (const { name, code } of cases) {
      it(`${name}: should parse without fatal errors`, () => {
        expectNoParseError(code);
      });
    }
  });

  describe('Parser rejects malformed CSS', () => {
    const cases = [
      { name: 'Missing closing brace', code: '.test { color: red' },
      { name: 'Double colon in declaration', code: '.test { color:: red; }' },
      { name: 'Missing property name', code: '.test { : red; }' },
      { name: 'Unclosed string', code: '.test { content: "unclosed }' },
      { name: 'Nested at-rule without block', code: '.test { @apply text-red-500 }' },
      { name: 'Leading colon modifier in @apply', code: '.test { @apply :text-red-500; }' },
      { name: 'Double colon modifier in @apply', code: '.test { @apply hover::text-red-500; }' },
      { name: 'Unclosed theme() call', code: '.test { color: theme(; }' },
    ];

    for (const { name, code } of cases) {
      it(`${name}: should produce fatal parsing errors`, () => {
        expectParseError(code);
      });
    }
  });

  describe('Rule edge cases', () => {
    // consistent-spacing: declarations without values should not crash
    ruleTester.run('tailwindcss/consistent-spacing (missing values)', consistentSpacing, {
      valid: [
        { code: '.test { color: }' },
        { code: '.test { color: ; }' },
      ],
      invalid: [],
    });

    // valid-apply-directive: empty @apply is invalid
    ruleTester.run('tailwindcss/valid-apply-directive (empty)', validApplyDirective, {
      valid: [],
      invalid: [
        {
          code: '@apply;',
          errors: [{ messageId: 'emptyApply' }],
        },
        {
          code: '@apply ;',
          errors: [{ messageId: 'emptyApply' }],
        },
      ],
    });

    // valid-theme-function: empty theme() is invalid
    ruleTester.run('tailwindcss/valid-theme-function (empty)', validThemeFunction, {
      valid: [],
      invalid: [
        {
          code: '.test { color: theme(); }',
          errors: [{ messageId: 'emptyThemeFunction' }],
        },
      ],
    });
  });
});
