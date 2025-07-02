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
});
