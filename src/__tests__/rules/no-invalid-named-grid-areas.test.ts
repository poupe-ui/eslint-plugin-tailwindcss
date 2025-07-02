import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { noInvalidNamedGridAreas } from '../../rules/no-invalid-named-grid-areas';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('no-invalid-named-grid-areas', () => {
  ruleTester.run('tailwindcss/no-invalid-named-grid-areas', noInvalidNamedGridAreas, {
    valid: [
      // Non-grid properties
      { code: '.grid { grid-template-areas: 1fr / auto 1fr auto; }' },

      // Valid simple grid
      { code: '.grid { grid-template-areas: "a a a" "b b b"; }' },

      // Valid with extra spaces
      { code: '.grid { grid-template-areas: " a a a " "b b b"; }' },

      // Case insensitive property
      { code: '.grid { GRID-TEMPLATE-AREAS: "a a a" "b b b"; }' },

      // Multi-line grid
      {
        code: String.raw`.grid { grid-template-areas: "head head"
                                     "nav  main"
                                     "nav  foot"; 
        }`,
      },

      // Extra spacing between tokens
      {
        code: String.raw`.grid { grid-template-areas: "head      head"
                                     "nav       main"
                                     "nav       foot"; 
        }`,
      },

      // With comments
      {
        code: String.raw`.grid { grid-template-areas: 
                /* "" */ "head head"
                "nav  main" /* "a b c" */
                "nav  foot" /* "" */;
        }`,
      },

      // None value
      { code: '.grid { grid-template-areas: none; }' },
      { code: '.grid { grid-template-areas:   none; }' },
      { code: '.grid { grid-template-areas: NONE; }' },
      { code: '.grid { grid-template-areas: /*comment*/ none /* comment */; }' },
      { code: '.grid { grid-template-areas: /*comment*/ NONE /* comment */; }' },
      { code: '.grid { grid-template-areas: /* comment "" " */ none; }' },
      {
        code: String.raw`.grid {
            grid-template-areas: /* "comment" */ none /* "comment " */;
        }`,
      },

      // grid-template shorthand
      {
        code: String.raw`.grid {
          grid-template:
            "a a a" 40px
            "b c c" 40px
            "b c c" 40px / 1fr 1fr 1fr;
        }`,
      },

      // Valid dot tokens (empty cells)
      { code: '.grid { grid-template-areas: ". a a" "b b ."; }' },
      { code: '.grid { grid-template-areas: "... a a" "b b ..."; }' },

      // grid shorthand property
      {
        code: String.raw`.grid {
          grid:
            "a a a" 40px
            "b c c" 40px
            "b c c" 40px / 1fr 1fr 1fr;
        }`,
      },
      {
        code: String.raw`.grid {
          grid:
            ". header header ." minmax(5rem, 1fr)
            "sidebar main main ." 1fr
            ". footer footer ." minmax(5rem, 1fr) / 1fr 1fr 1fr 1fr;
        }`,
      },
    ],

    invalid: [
      // Uneven grid areas
      {
        code: 'a { grid-template-areas: "a a a" "b b"; }',
        errors: [
          {
            messageId: 'unevenGridArea',
            line: 1,
            column: 34,
            endLine: 1,
            endColumn: 39,
          },
        ],
      },

      // Non-rectangular area
      {
        code: 'a { grid-template-areas: "a a a" "b b a"; }',
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'a' },
            line: 1,
            column: 34,
            endLine: 1,
            endColumn: 41,
          },
        ],
      },

      // Non-rectangular area (multi-line)
      {
        code: String.raw`a { grid-template-areas:
                "a a"
                "a ."; 
        }`,
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'a' },
            line: 3,
            column: 17,
            endLine: 3,
            endColumn: 22,
          },
        ],
      },

      // Non-rectangular area with dots
      {
        code: String.raw`a { grid-template-areas:
                ". y y"
                "y y .";
        }`,
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'y' },
            line: 3,
            column: 17,
            endLine: 3,
            endColumn: 24,
          },
        ],
      },

      // Multiple non-rectangular areas
      {
        code: 'a { grid-template-areas: "a c a" "c b a"; }',
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'a' },
            line: 1,
            column: 34,
            endLine: 1,
            endColumn: 41,
          },
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'c' },
            line: 1,
            column: 34,
            endLine: 1,
            endColumn: 41,
          },
        ],
      },

      // Complex non-rectangular area
      {
        code: String.raw`a {
              grid-template-areas: "header header header header"
                  "main main . sidebar"
                  "footer footer footer header";
        }`,
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'header' },
            line: 4,
            column: 19,
            endLine: 4,
            endColumn: 48,
          },
        ],
      },

      // Empty grid area
      {
        code: 'a { grid-template-areas: ""; }',
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 26,
            endLine: 1,
            endColumn: 28,
          },
        ],
      },

      // Empty grid area with comment
      {
        code: 'a { grid-template-areas: /* "comment" */ ""; }',
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 42,
            endLine: 1,
            endColumn: 44,
          },
        ],
      },

      // Empty grid area (multi-line)
      {
        code: String.raw`a { grid-template-areas:
            "";
        }`,
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 2,
            column: 13,
            endLine: 2,
            endColumn: 15,
          },
        ],
      },

      // Multiple empty areas
      {
        code: 'a { grid-template-areas: "" "" ""; }',
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 26,
            endLine: 1,
            endColumn: 28,
          },
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 29,
            endLine: 1,
            endColumn: 31,
          },
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 32,
            endLine: 1,
            endColumn: 34,
          },
        ],
      },

      // Empty then uneven
      {
        code: 'a { grid-template-areas: "" "a a" "b"; }',
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 1,
            column: 26,
            endLine: 1,
            endColumn: 28,
          },
        ],
      },

      // Mixed valid and invalid
      {
        code: String.raw`a { 
          grid-template-areas: 
            "header header header"
            "nav main main"
            "nav footer";
        }`,
        errors: [
          {
            messageId: 'unevenGridArea',
            line: 5,
            column: 13,
            endLine: 5,
            endColumn: 25,
          },
        ],
      },

      // grid shorthand with empty area
      {
        code: String.raw`.grid {
          grid:
            "" 40px
            "b c c" 40px / 1fr 1fr 1fr;
        }`,
        errors: [
          {
            messageId: 'emptyGridArea',
            line: 3,
            column: 13,
            endLine: 3,
            endColumn: 15,
          },
        ],
      },

      // grid shorthand with uneven columns
      {
        code: String.raw`.grid {
          grid:
            "a a a" 40px
            "b c" 40px / 1fr 1fr 1fr;
        }`,
        errors: [
          {
            messageId: 'unevenGridArea',
            line: 4,
            column: 13,
            endLine: 4,
            endColumn: 18,
          },
        ],
      },

      // grid shorthand with non-rectangular area
      {
        code: String.raw`.grid {
          grid:
            "a a b" 40px
            "c a a" 40px / 1fr 1fr 1fr;
        }`,
        errors: [
          {
            messageId: 'nonRectangularGridArea',
            data: { name: 'a' },
            line: 4,
            column: 13,
            endLine: 4,
            endColumn: 20,
          },
        ],
      },
    ],
  });
});
