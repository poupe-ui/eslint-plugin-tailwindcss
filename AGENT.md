# AGENT.md

This file provides guidance to AI coding assistants (Claude Code, GitHub
Copilot, etc.) when working with code in this repository.

## Project Overview

`@poupe/eslint-plugin-tailwindcss` is an ESLint plugin that provides linting
rules for Tailwind CSS v4. It validates CSS files using Tailwind CSS syntax,
ensuring proper usage of directives, modifiers, theme functions, and utility
classes.

## Commands

### Development Commands

- `pnpm build` - Build the package
- `pnpm lint` - Run ESLint with auto-fix enabled
- `pnpm type-check` - Check TypeScript types
- `pnpm clean` - Remove dist folder and node_modules
- `pnpm prepack` - Full validation before publishing
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm precommit` - Run all pre-commit checks
- `pnpm publint` - Check package publishing readiness

## Code Style Guidelines

All code follows these conventions (enforced by .editorconfig and ESLint):

- **Indentation**: 2 spaces for TypeScript/JavaScript/JSON
- **Line Endings**: Unix (LF)
- **Charset**: UTF-8
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Module System**: ES modules (`type: "module"`)
- **Arrow Functions**: Always use parentheses
- **Line Length**: Max 78 characters preferred
- **Comments**: Use TSDoc format for documentation
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Final Newline**: Always insert
- **Trailing Whitespace**: Always trim

## Development Practices

### Pre-commit Checklist (MANDATORY)

Before committing any changes, ALWAYS run:

1. `pnpm precommit` - Run all precommit checks (includes lint, type-check,
   test, build)
2. Fix any issues found by the precommit checks
3. If linter made automatic fixes, create fixup commits:
   - Use `git blame` to identify which commit introduced the code
   - Create fixup: `git commit -s --fixup=<commit-hash> path/to/file`
   - ALWAYS specify the file path, never rely on staged files
4. Update AGENT.md if guidelines change
5. Update README.md if public API changes
6. Review documentation formatting follows guidelines

### DO

- Run `pnpm lint` and `pnpm type-check` before committing
- Write tests for all new functionality
- Follow existing patterns
- Use semantic versioning for releases

### DON'T

- Create files unless necessary
- Add external dependencies without careful consideration
- Ignore TypeScript errors or ESLint warnings
- Skip pre-commit checks
- **NEVER DELETE FILES WITHOUT EXPLICIT PERMISSION**

## Git Workflow

### Direct Commits (MANDATORY - NO EXCEPTIONS)

🚨 **CRITICAL**: NEVER use the staging area or commit without explicit files

#### FORBIDDEN commands that will commit unintended files

```bash
# NEVER DO THESE:
git commit                    # ❌ Commits everything staged
git commit -a                 # ❌ Stages and commits all tracked files
git add . && git commit       # ❌ Stages everything then commits
```

#### ALWAYS specify files directly in the commit command

### Commit Message Guidelines

- First line: type(scope): brief description (50 chars max)
- Blank line
- Body: what and why, not how (wrap at 72 chars)
- Use commit message files: Write to `.commit-msg`, then `git commit -sF .commit-msg`
- Delete commit message files after use: `rm .commit-msg`
- For fixup commits: No message needed, just `git commit -s --fixup=<hash> file`

### TSDoc Guidelines

- Use backticks for code examples in TSDoc: `` `[@media(hover)]` ``
- Escape @ symbols in TSDoc when not in backticks: `\@`
- Prefer TSDoc over JSDoc for TypeScript files
- Add TSDoc for all public APIs and complex internal functions

## Agent-Specific Instructions

### Claude Code Specific Instructions

- Use TodoWrite tool for complex multi-step tasks
- **CRITICAL: Always enumerate files explicitly in git commit commands**
- **NEVER use bare `git commit` without file arguments**
- Fix issues immediately without commentary
- Stay focused on the task at hand

### Universal Agent Guidelines

- Test changes thoroughly before considering tasks complete
- Follow the pre-commit checklist strictly
- Use Write tool for commit messages, not echo, -m, or heredocs
- NEVER USE `cd` IN BASH COMMANDS - NO EXCEPTIONS

## Architecture

This is an ESLint plugin specifically designed for Tailwind CSS v4 syntax
validation. It integrates with @eslint/css for CSS parsing and provides
rules to enforce best practices.

### Key Concepts

1. **CSS Parsing**: Uses @eslint/css to parse CSS files with Tailwind syntax
2. **Rule Categories**:
   - Validation rules (valid-apply-directive, valid-modifier-syntax)
   - Best practice rules (prefer-theme-tokens, no-arbitrary-value-overuse)
   - Conflict prevention (no-conflicting-utilities)
3. **Configuration Presets**:
   - `minimal`: Essential error prevention
   - `recommended`: Balanced rule set
   - `strict`: All rules for maximum quality
4. **Parser Extension**: Custom parser for Tailwind v4 syntax

### Project Structure

```text
.
├── src/              # Source code
│   ├── configs/      # Preset configurations
│   │   ├── minimal.ts
│   │   ├── recommended.ts
│   │   └── strict.ts
│   ├── parser/       # Tailwind syntax parser
│   │   └── tailwind-v4-syntax.ts
│   ├── rules/        # ESLint rules
│   │   ├── no-arbitrary-value-overuse.ts
│   │   ├── no-conflicting-utilities.ts
│   │   ├── prefer-theme-tokens.ts
│   │   ├── valid-apply-directive.ts
│   │   ├── valid-modifier-syntax.ts
│   │   └── valid-theme-function.ts
│   ├── utils/        # Shared utilities
│   │   ├── ast.ts    # AST manipulation helpers
│   │   ├── tailwind.ts # Tailwind-specific utilities
│   │   └── theme.ts  # Theme token utilities
│   ├── index.ts      # Main plugin export
│   └── types.ts      # TypeScript definitions
├── __tests__/        # Unit tests
├── build.config.ts   # Build configuration
├── eslint.config.mjs # Self-linting configuration
├── package.json      # Package manifest
└── tsconfig.json     # TypeScript configuration
```

### ESLint Rules

#### valid-apply-directive

Validates @apply directive usage in CSS files, ensuring only valid Tailwind
utility classes are used.

#### valid-modifier-syntax

Validates Tailwind modifier syntax including responsive modifiers (sm:, lg:),
state modifiers (hover:, focus:), new v4 modifiers (inert:, target:, open:,
starting:, popover-open:), dynamic modifiers (not-*, in-*), and arbitrary
modifiers with brackets ([&:hover]).

#### valid-theme-function

Validates theme() function usage with auto-fix support for common mistakes.

#### no-conflicting-utilities

Detects and prevents conflicting Tailwind utility classes that would
override each other.

#### no-arbitrary-value-overuse

Discourages excessive use of arbitrary values, promoting design token usage.

#### prefer-theme-tokens

Encourages use of theme tokens over arbitrary values for consistency.

## Common Tasks

### Adding a New Rule

#### Step-by-Step Guide

1. **Create the rule file** in `src/rules/rule-name.ts`

   ```typescript
   import type { CSSRuleModule } from '../types';
   import type { StyleSheetPlain } from '@eslint/css-tree';
   import { walk, isNodeType } from '../utils/ast';

   export const ruleName: CSSRuleModule = {
     meta: {
       type: 'problem' | 'suggestion' | 'layout',
       docs: {
         description: 'Rule description',
         category: 'Possible Errors' | 'Best Practices' | 'Stylistic Issues',
         recommended: true | false,
       },
       fixable: 'code' | 'whitespace' | null,
       schema: [...], // Configuration options
       messages: {
         messageId: 'Error message text',
       },
     },
     create(context) {
       // Rule implementation
       return {
         StyleSheet(node: StyleSheetPlain) {
           // Process CSS AST
         },
       };
     },
   };
   ```

2. **Export from** `src/rules/index.ts` (keep alphabetically sorted)

   ```typescript
   export { ruleName } from './rule-name';
   ```

3. **Add to** `src/index.ts` (import and rules object, keep sorted)

   ```typescript
   import { ruleName } from './rules';
   // ...
   rules: {
     'rule-name': ruleName,
   },
   ```

4. **Add to config presets** as appropriate:
   - `minimal.ts`: Essential rules only
   - `recommended.ts`: Balanced ruleset
   - `strict.ts`: All rules with strict settings

5. **Create tests** in `src/__tests__/rules/rule-name.test.ts`

   ```typescript
   import { RuleTester } from 'eslint';
   import css from '@eslint/css';
   import { ruleName } from '../../rules/rule-name';

   const ruleTester = new RuleTester({
     language: 'css/css',
     plugins: { css },
   });

   describe('rule-name', () => {
     ruleTester.run('tailwindcss/rule-name', ruleName, {
       valid: [
         { code: '/* valid CSS */' },
       ],
       invalid: [
         {
           code: '/* invalid CSS */',
           errors: [{ messageId: 'messageId' }],
           output: '/* fixed CSS */', // if fixable
         },
       ],
     });
   });
   ```

6. **Update** `README.md` with rule documentation
   - Add to rules section
   - Include examples of valid/invalid code
   - Document configuration options
   - Note if auto-fixable

#### CSS AST Concepts

**Important**: CSS nodes in @eslint/css have different structure than JS nodes:

- `Declaration` nodes have `property` as a string, not a node
- Use `node.loc` for location information
- Use `context.sourceCode.text` to get raw text
- Value nodes may have complex nested structure

**Common node types**:

- `StyleSheet`: Root node
- `Rule`: CSS rule with selector and block
- `Declaration`: Property-value pair
- `Atrule`: At-rules like @media, @import
- `Function`: CSS functions like theme()

**Utility functions** in `src/utils/ast.ts`:

- `isNodeType(node, type)`: Type guard
- `getChildrenOfType(node, type)`: Find specific children
- `walk(node, callback)`: Traverse AST
- `getNodeText(node, sourceCode)`: Get text content

#### Working with CSS Locations

When reporting errors, be careful with location calculations:

```typescript
// For property-related issues
const propertyEndOffset = declaration.loc.start.offset + declaration.property.length;

// For value-related issues
const valueStartOffset = declaration.value.loc.start.offset;

// Calculate column positions
const column = declaration.loc.start.column + offsetFromStart;
```

#### Testing Real CSS Files

For manual testing during development:

```typescript
// Create test-rule.mjs
import { ESLint } from 'eslint';
import css from '@eslint/css';
import plugin from './dist/index.mjs';

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: { css, tailwindcss: plugin },
    rules: { 'tailwindcss/rule-name': 'error' },
  },
});

const results = await eslint.lintFiles(['test.css']);
// Process results...
```

### Committing Rules

**Important**: One rule per commit for better history and reviews.

1. **Initial implementation commit**:

   ```bash
   # Create commit message file
   echo "feat(rules): add rule-name rule" > .commit-msg
   echo "" >> .commit-msg
   echo "Add description here..." >> .commit-msg

   # Commit specifying all files
   git commit -sF .commit-msg src/rules/rule-name.ts \
     src/__tests__/rules/rule-name.test.ts \
     src/rules/index.ts src/index.ts \
     src/configs/strict.ts README.md

   # Clean up
   rm .commit-msg
   ```

2. **Config updates** (use fixup if related to rule addition):

   ```bash
   git commit -s --fixup=HEAD src/configs/minimal.ts src/configs/recommended.ts
   ```

3. **Linting fixes** (always as fixup to original commit):

   ```bash
   # Find which commit introduced the code
   git blame -L<line>,<line> path/to/file

   # Create fixup
   git commit -s --fixup=<commit-hash> path/to/file
   ```

### Testing Rules

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test rule-name.test.ts

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage
```

### Building the Plugin

```bash
# Development build (stub)
pnpm dev:prepare

# Production build
pnpm build

# Clean and rebuild
pnpm clean && pnpm build
```

## Debugging Tips

1. **Build Issues**: Run `pnpm clean` then `pnpm build`
2. **Type Errors**: Check `tsconfig.json` references
3. **Rule Not Working**: Check rule is exported and added to config
4. **Test Failures**: Use `--reporter=verbose` flag
5. **ESLint Integration**: Debug output included in `pnpm lint`
