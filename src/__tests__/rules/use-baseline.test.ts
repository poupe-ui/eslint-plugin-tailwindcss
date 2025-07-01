import css from '@eslint/css';
import { RuleTester } from 'eslint';

import { useBaseline } from '../../rules/use-baseline';

const ruleTester = new RuleTester({
  language: 'css/css',
  plugins: { css },
});

describe('use-baseline', () => {
  ruleTester.run('tailwindcss/use-baseline', useBaseline, {
    valid: [
      // Widely available properties
      {
        code: '.test { color: red; }',
      },
      {
        code: '.test { display: flex; }',
      },
      {
        code: '.test { grid-template-columns: 1fr 2fr; }',
      },
      {
        code: '.test { transform: rotate(45deg); }',
      },
      {
        code: '.test { --custom-property: value; }',
      },

      // Widely available at-rules
      {
        code: '@media (min-width: 768px) { .test { color: red; } }',
      },
      {
        code: '@supports (display: grid) { .test { display: grid; } }',
      },
      {
        code: '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }',
      },

      // Widely available pseudo-classes
      {
        code: '.test:hover { color: blue; }',
      },
      {
        code: '.test:not(.active) { opacity: 0.5; }',
      },
      {
        code: '.test:nth-child(2n) { background: gray; }',
      },

      // Widely available functions
      {
        code: '.test { width: calc(100% - 20px); }',
      },
      {
        code: '.test { color: var(--primary-color); }',
      },
      {
        code: '.test { background: linear-gradient(to right, red, blue); }',
      },

      // Newly available features with default strictness (limited only)
      {
        code: '.test { container-type: inline-size; }',
      },
      {
        code: '.test { aspect-ratio: 16 / 9; }',
      },
      {
        code: '@container (min-width: 400px) { .test { color: red; } }',
      },
      {
        code: '@layer utilities { .test { color: red; } }',
      },
      {
        code: '.test:has(.child) { color: red; }',
      },
      {
        code: '.test { color: hwb(0 0% 0%); }',
      },

      // Ignored features
      {
        code: '.test { anchor-name: --my-anchor; }',
        options: [{ ignore: ['anchor-name'] }],
      },
      {
        code: '@starting-style { .test { opacity: 0; } }',
        options: [{ ignore: ['@starting-style'] }],
      },
    ],

    invalid: [
      // Limited availability properties
      {
        code: '.test { anchor-name: --my-anchor; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'property',
            name: 'anchor-name',
            suggestion: ' Use absolute positioning or JavaScript for anchor positioning',
          },
        }],
      },
      {
        code: '.test { position-anchor: --target; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'property',
            name: 'position-anchor',
            suggestion: ' Use absolute positioning or JavaScript for anchor positioning',
          },
        }],
      },
      {
        code: '.test { animation-timeline: scroll(); }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'property',
            name: 'animation-timeline',
            suggestion: ' Use JavaScript-based scroll animations',
          },
        }],
      },
      {
        code: '.test { view-transition-name: header; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'property',
            name: 'view-transition-name',
            suggestion: ' Use CSS animations or JavaScript transitions',
          },
        }],
      },

      // Limited availability at-rules
      {
        code: '@starting-style { .test { opacity: 0; } }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'at-rule',
            name: '@starting-style',
            suggestion: ' Use CSS animations with from/to keyframes',
          },
        }],
      },
      {
        code: '@position-try --my-position { top: 10px; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'at-rule',
            name: '@position-try',
            suggestion: ' Use JavaScript for dynamic positioning',
          },
        }],
      },

      // Limited availability pseudo-classes
      {
        code: '.test:user-valid { border-color: green; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'pseudo-class',
            name: ':user-valid',
            suggestion: ' Use :valid with JavaScript validation',
          },
        }],
      },
      {
        code: '.test:popover-open { display: block; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'pseudo-class',
            name: ':popover-open',
            suggestion: ' Use class-based state management',
          },
        }],
      },

      // Limited availability functions
      {
        code: '.test { top: anchor(--target top); }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'function',
            name: 'anchor()',
            suggestion: ' Use JavaScript for dynamic positioning',
          },
        }],
      },
      {
        code: '.test { width: anchor-size(--target width); }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'function',
            name: 'anchor-size()',
            suggestion: ' Use JavaScript to calculate sizes',
          },
        }],
      },

      // Vendor prefixes
      {
        code: '.test { -webkit-appearance: none; }',
        errors: [{
          messageId: 'vendorPrefix',
          data: {
            type: 'property',
            name: '-webkit-appearance',
            suggestion: ' Use standard \'appearance\' property instead of vendor prefix',
          },
        }],
      },
      {
        code: '.test { -moz-user-select: none; }',
        errors: [{
          messageId: 'vendorPrefix',
          data: {
            type: 'property',
            name: '-moz-user-select',
            suggestion: ' Use standard \'user-select\' property instead of vendor prefix',
          },
        }],
      },

      // Newly available features with strictness: newly
      {
        code: '.test { container-type: inline-size; }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'property',
            name: 'container-type',
            suggestion: '',
          },
        }],
      },
      {
        code: '.test { aspect-ratio: 16 / 9; }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'property',
            name: 'aspect-ratio',
            suggestion: '',
          },
        }],
      },
      {
        code: '@layer utilities { .test { color: red; } }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'at-rule',
            name: '@layer',
            suggestion: '',
          },
        }],
      },
      {
        code: '.test:has(.child) { color: red; }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'pseudo-class',
            name: ':has',
            suggestion: '',
          },
        }],
      },
      {
        code: '.test { color: hwb(0 0% 0%); }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'function',
            name: 'hwb()',
            suggestion: '',
          },
        }],
      },
      {
        code: '.test { width: sin(45deg); }',
        options: [{ strictness: 'newly' }],
        errors: [{
          messageId: 'newlyAvailable',
          data: {
            type: 'function',
            name: 'sin()',
            suggestion: '',
          },
        }],
      },

      // Multiple issues in one rule
      {
        code: '.test { anchor-name: --my-anchor; view-timeline-name: --my-timeline; }',
        errors: [
          {
            messageId: 'limitedAvailability',
            data: {
              type: 'property',
              name: 'anchor-name',
              suggestion: ' Use absolute positioning or JavaScript for anchor positioning',
            },
          },
          {
            messageId: 'limitedAvailability',
            data: {
              type: 'property',
              name: 'view-timeline-name',
              suggestion: ' Use Intersection Observer API',
            },
          },
        ],
      },

      // Complex selectors with multiple pseudo-classes
      {
        code: '.test:hover:user-valid:not(:disabled) { color: green; }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'pseudo-class',
            name: ':user-valid',
            suggestion: ' Use :valid with JavaScript validation',
          },
        }],
      },

      // Functions in complex values
      {
        code: '.test { top: max(10px, anchor(--target bottom)); }',
        errors: [{
          messageId: 'limitedAvailability',
          data: {
            type: 'function',
            name: 'anchor()',
            suggestion: ' Use JavaScript for dynamic positioning',
          },
        }],
      },
    ],
  });
});
