import { defineConfig } from '@poupe/eslint-config';
import perfectionist from 'eslint-plugin-perfectionist';

export default defineConfig({
  plugins: {
    perfectionist,
  },
  rules: {
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        ignoreCase: true,
        internalPattern: ['^~/.+', '^@/.+', String.raw`^\.\./.+`, String.raw`^\./.+`],
        newlinesBetween: 'always',
        maxLineLength: undefined,
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        customGroups: {
          type: {
            react: 'react',
          },
          value: {
            react: ['react', 'react-*'],
          },
        },
        environment: 'node',
      },
    ],
    'perfectionist/sort-exports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        ignoreCase: true,
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        ignoreCase: true,
        ignoreAlias: false,
        specialCharacters: 'keep',
        groupKind: 'mixed',
      },
    ],
    'perfectionist/sort-named-exports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        ignoreCase: true,
        groupKind: 'mixed',
      },
    ],
  },
});
