import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  files: ['CHANGELOG.md'],
  rules: {
    'markdownlint/md024': ['error', { siblings_only: true }],
  },
}, {
  files: ['README.md'],
  rules: {
    'markdownlint/md013': ['error', { line_length: 80, tables: false }],
  },
}, {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  rules: {
    'unicorn/prevent-abbreviations': ['error', {
      replacements: {
        props: false,
        prop: false,
        pkg: false,
        utils: false,
        fn: false,
        param: false,
        vars: false,
      },
      allowList: {
        i: true,
        j: true,
        k: true,
      },
    }],
  },
});
