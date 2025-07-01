import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { validThemeFunction } from '../../rules/valid-theme-function';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('valid-theme-function', () => {
  ruleTester.run('tailwindcss/valid-theme-function', validThemeFunction, {
    valid: [
      // Basic theme function usage
      {
        code: String.raw`
          @theme {
            --color-primary: #0066cc;
            --color-secondary: #6c757d;
            --spacing-small: 0.5rem;
            --spacing-medium: 1rem;
          }
          
          .element {
            color: theme("color.primary");
            padding: theme("spacing.small");
          }
        `,
      },
      // With single quotes
      {
        code: String.raw`
          @theme {
            --font-size-base: 16px;
            --font-size-large: 20px;
          }
          
          .text {
            font-size: theme('font.size.base');
          }
        `,
      },
      // Multiple theme calls
      {
        code: String.raw`
          @theme {
            --border-radius-small: 4px;
            --border-radius-medium: 8px;
            --shadow-default: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .card {
            border-radius: theme("border.radius.medium");
            box-shadow: theme("shadow.default");
          }
        `,
      },
      // Nested property paths
      {
        code: String.raw`
          @theme {
            --color-text-primary: #333;
            --color-text-secondary: #666;
            --color-background-light: #f5f5f5;
          }
          
          .content {
            color: theme("color.text.primary");
            background: theme("color.background.light");
          }
        `,
      },
      // Disabled path checking
      {
        code: String.raw`
          .element {
            color: theme("non.existent.path");
          }
        `,
        options: [{ checkPaths: false }],
      },
      // Empty CSS file (no theme values)
      {
        code: String.raw`.empty { color: red; }`,
      },
      // Theme function in complex values
      {
        code: String.raw`
          @theme {
            --spacing-base: 1rem;
            --color-border: #ddd;
          }
          
          .complex {
            margin: calc(theme("spacing.base") * 2);
            border: 1px solid theme("color.border");
          }
        `,
      },
      // Theme tokens with numbers
      {
        code: String.raw`
          @theme {
            --spacing-1: 0.25rem;
            --spacing-2: 0.5rem;
            --gray-500: #6b7280;
          }
          
          .numbered {
            padding: theme("spacing.1");
            margin: theme("spacing.2");
            color: theme("gray.500");
          }
        `,
      },
    ],

    invalid: [
      // Empty theme function
      {
        code: String.raw`.empty { color: theme(); }`,
        errors: [{ messageId: 'emptyThemeFunction' }],
      },
      {
        code: String.raw`.empty { color: theme( ); }`,
        errors: [{ messageId: 'emptyThemeFunction' }],
      },
      // Invalid syntax - no quotes
      {
        code: String.raw`.invalid { color: theme(primary); }`,
        errors: [{
          messageId: 'invalidThemeSyntax',
        }],
      },
      // Valid syntax but invalid path - spaces in path
      {
        code: String.raw`.invalid { color: theme("colors primary"); }`,
        errors: [{ messageId: 'invalidThemePath', data: { path: 'colors primary' } }],
      },
      // Valid syntax but invalid path - special characters
      {
        code: String.raw`.invalid { color: theme("colors@primary"); }`,
        errors: [{ messageId: 'invalidThemePath', data: { path: 'colors@primary' } }],
      },
      // Non-existent theme path - change to avoid suggestions
      {
        code: String.raw`
          @theme {
            --color-primary: #0066cc;
            --color-secondary: #6c757d;
          }
          
          .invalid {
            color: theme("nonexistent.path");
          }
        `,
        errors: [{
          messageId: 'invalidThemePath',
          data: { path: 'nonexistent.path' },
        }],
      },
      // Typo with suggestions
      {
        code: String.raw`
          @theme {
            --color-primary: #0066cc;
            --spacing-small: 0.5rem;
          }
          
          .typo {
            color: theme("color.primay");
          }
        `,
        errors: [{
          messageId: 'invalidThemePathWithSuggestion',
          data: {
            path: 'color.primay',
            suggestions: '"--color-primary"',
          },
        }],
        output: String.raw`
          @theme {
            --color-primary: #0066cc;
            --spacing-small: 0.5rem;
          }
          
          .typo {
            color: theme("--color-primary");
          }
        `,
      },
      // Multiple errors
      {
        code: String.raw`
          @theme {
            --font-size-base: 16px;
            --font-weight-bold: 700;
          }
          
          .multiple {
            font-size: theme();
            font-weight: theme("xyz.abc.def");
            line-height: theme("invalid path");
          }
        `,
        errors: [
          { messageId: 'emptyThemeFunction' },
          {
            messageId: 'invalidThemePath',
            data: { path: 'xyz.abc.def' },
          },
          { messageId: 'invalidThemePath', data: { path: 'invalid path' } },
        ],
      },
      // Wrong casing - update to avoid suggestions
      {
        code: String.raw`
          @theme {
            --color-PRIMARY: #0066cc;
            --Color-Secondary: #6c757d;
          }
          
          .case-sensitive {
            color: theme("xyz.notfound");
          }
        `,
        errors: [{
          messageId: 'invalidThemePath',
          data: { path: 'xyz.notfound' },
        }],
      },
      // Multiple suggestions with output
      {
        code: String.raw`
          @theme {
            --spacing-small: 0.5rem;
            --spacing-smaller: 0.25rem;
            --spacing-smallest: 0.125rem;
          }
          
          .similar {
            padding: theme("spacing.smal");
          }
        `,
        errors: [{
          messageId: 'invalidThemePathWithSuggestion',
          data: {
            path: 'spacing.smal',
            suggestions: '"--spacing-small", "--spacing-smaller", "--spacing-smallest"',
          },
        }],
        // No output because there are multiple suggestions (3)
      },
    ],
  });
});
