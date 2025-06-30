import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noEmptyBlocks } from '../../rules/no-empty-blocks';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-empty-blocks', () => {
  ruleTester.run('tailwindcss/no-empty-blocks', noEmptyBlocks, {
    valid: [
      {
        code: '.foo { color: red; }',
      },
      {
        code: '@media screen { .foo { display: block; } }',
      },
      {
        code: '@supports (display: grid) { .grid { display: grid; } }',
      },
      {
        code: '@layer utilities { .utility { margin: 0; } }',
      },
    ],
    invalid: [
      {
        code: '.foo { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
      {
        code: '.foo {\n}',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
      {
        code: '@media screen { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: '@media' },
          },
        ],
      },
      {
        code: '@supports (display: grid) { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: '@supports' },
          },
        ],
      },
      {
        code: '@layer utilities { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: '@layer' },
          },
        ],
      },
      {
        code: '.foo { /* comment */ }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
      {
        code: '@media screen { /* comment */ }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: '@media' },
          },
        ],
      },
      {
        code: '.foo {\n  /* TODO: Add styles */\n}',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
      {
        code: '#id { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
      {
        code: 'h1, h2, h3 { }',
        errors: [
          {
            messageId: 'emptyBlock',
            data: { type: 'rule' },
          },
        ],
      },
    ],
  });
});
