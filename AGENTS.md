# AGENTS.md

This file provides guidance to AI coding assistants (Claude Code, GitHub
Copilot, etc.) when working with code in this repository.

## Project Overview

`@poupe/eslint-plugin-tailwindcss` is an ESLint plugin that provides linting
rules for Tailwind CSS v4. It validates CSS files using Tailwind CSS syntax,
ensuring proper usage of directives, modifiers, theme functions, and utility
classes. The plugin complements @eslint/css — it provides
Tailwind-specific rules and wraps selected @eslint/css rules for
convenience. Consumers wanting full @eslint/css coverage should use
both plugins (or use `@poupe/eslint-config`).

## Commands

### Development Commands

- `pnpm build` - Build the package
- `pnpm lint` - Run ESLint with auto-fix enabled
- `pnpm lint:check` - Run ESLint without auto-fix (check only)
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
- **Trailing Whitespace**: Always trim (except Markdown)

## Development Practices

### Pre-commit Checklist (MANDATORY)

#### CRITICAL: THINK BEFORE YOU COMMIT - READ THIS SECTION TWICE

Before committing any changes, ALWAYS:

1. **Run `git status` and READ every file listed**
2. **Ask yourself: "Do ALL these files belong in this commit?"**
3. **If working on feature X, do NOT include unrelated feature Y files**
4. **NEVER stage files in bulk with `git add -A` or `git add .`**
5. `pnpm precommit` - Run all precommit checks (includes build, lint,
   type-check, test)
6. Fix any issues found by the precommit checks
7. If linter made automatic fixes, create fixup commits:
   - Use `git blame` to identify which commit introduced the code
   - Create fixup: `git commit -s --fixup=<commit-hash> path/to/file`
   - ALWAYS specify the file path, never rely on staged files
8. Update CHANGELOG.md under [Unreleased] section:
   - Add entries for new features under ### Added
   - Add entries for bug fixes under ### Fixed
   - Add entries for breaking changes under ### BREAKING CHANGES
   - Follow Keep a Changelog format
9. Update AGENTS.md if guidelines change
10. Update README.md if public API changes
11. Review documentation formatting follows guidelines
12. Verify all imports are actually used (common linting issue)

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

#### 🚨 CRITICAL: NEVER use the staging area or commit without explicit files

#### FORBIDDEN commands that will commit unintended files

```bash
# NEVER DO THESE:
git commit                    # ❌ Commits everything staged
git commit -a                 # ❌ Stages and commits all tracked files
git add . && git commit       # ❌ Stages everything then commits
git commit --amend            # ❌ Will include whatever is staged
git commit --amend --no-edit  # ❌ Same problem, includes staged files
```

#### ALWAYS specify files directly in the commit command

```bash
# ALWAYS DO:
git add src/file1.ts src/file2.ts              # ✅ Explicit files only
git commit -sF .commit-msg file1.ts file2.ts   # ✅ Explicit files
git commit --amend -F .commit-msg file1.ts file2.ts  # ✅ Explicit files
```

### Commit Message Guidelines

- First line: type(scope): brief description (50 chars max)
- Blank line
- Body: what and why, not how (wrap at 72 chars)
- Use commit message files: Write to `.commit-msg-<descriptive-slug>`, then use
  `git commit -sF .commit-msg-<descriptive-slug>`
- Delete commit message files after use: `rm .commit-msg-<descriptive-slug>`
- For fixup commits: No message needed, just `git commit -s --fixup=<hash> file`

### TSDoc Guidelines

- Use backticks for code examples in TSDoc: `` `[@media(hover)]` ``
- Escape @ symbols in TSDoc when not in backticks: `\@`
- Prefer TSDoc over JSDoc for TypeScript files
- Add TSDoc for all public APIs and complex internal functions

### Common Mistakes That Waste Credits (STRICT ENFORCEMENT)

**CRITICAL**: Using bare `git commit` without file arguments is the #1 mistake
that leads to committing unintended files. This is unacceptable and shows a lack
of attention to detail.

- Committing unrelated work (e.g., CSS rule fixes + unrelated documentation)
- Using `git add -A` or `git add .` instead of specific files
- Not reading `git status` output before committing
- Using `--amend` without explicit file lists
- Rushing commits without thoughtful review
- Staging files without verifying they belong in the commit
- Including test files in feature commits without reason
- Mixing refactoring with feature implementation

## Agent-Specific Instructions

### Claude Code-Specific Instructions

- Use TaskCreate tool for complex multi-step tasks
- **CRITICAL: Always enumerate files explicitly in git commit commands**
- **NEVER use bare `git commit` without file arguments**
- **ALWAYS run tests before marking a task as completed**
- Fix issues immediately without commentary
- Stay focused on the task at hand
- When creating PRs, ensure description includes:
  - Summary of changes (what and why)
  - Test plan with specific steps
  - Any breaking changes or migration notes
- Use PR body files: Write to `.pr-body-<descriptive-slug>`, then
  `gh pr create --title "..." --body-file .pr-body-<descriptive-slug>`
- Delete PR body files after use: `rm .pr-body-<descriptive-slug>`

### Universal Agent Guidelines

- Test changes thoroughly before considering tasks complete
- Follow the pre-commit checklist strictly
- Use Write tool for commit messages, not echo, -m, or heredocs
- NEVER USE `cd` IN BASH COMMANDS - NO EXCEPTIONS
- Always check for merge conflicts before committing
- Run `git status` before AND after commits to verify state

## Architecture

This is an ESLint plugin specifically designed for Tailwind CSS v4 syntax
validation. It integrates with @eslint/css for CSS parsing and provides
rules to enforce best practices.

### Key Concepts

1. **CSS Parsing**: Uses @eslint/css to parse CSS files with Tailwind syntax
2. **Rule Categories**:
   - Validation rules (syntax correctness, at-rule and property validation)
   - Best practice rules (theme tokens, design consistency)
   - CSS parity rules (wrappers and extensions of @eslint/css rules)
3. **Configuration Presets**:
   - `base`: Setup-only (files, language, syntax, plugin self-ref, no rules)
   - `minimal`: Essential error prevention
   - `recommended`: Balanced rule set
   - `strict`: All rules for maximum quality
4. **Syntax Extension**: Wraps `tailwind-csstree`'s `tailwind4` callback
   with `@tailwind` for v3 legacy compatibility

### Project Structure

```text
.
├── src/              # Source code
│   ├── __tests__/    # Unit tests
│   │   ├── parser/   # Parser tests (tailwind-v4-syntax)
│   │   ├── rules/    # Rule-specific tests
│   │   ├── utils/    # Utility tests (ast.test.ts)
│   │   └── malformed-css.test.ts
│   ├── configs/      # Preset configurations
│   │   ├── index.ts
│   │   ├── base.ts   # Setup-only config (no rules)
│   │   ├── rules.ts  # TailwindcssRules type + rule presets
│   │   ├── minimal.ts
│   │   ├── recommended.ts
│   │   └── strict.ts
│   ├── parser/       # Tailwind v4 syntax extension
│   │   ├── index.ts
│   │   └── tailwind-v4-syntax.ts
│   ├── globs.ts      # GLOB_CSS constant
│   ├── rules/        # ESLint rules (one file per rule)
│   │   └── index.ts  # rules map, PluginRuleKey, pluginRules
│   ├── utils/        # Shared utilities
│   │   ├── ast.ts    # AST manipulation helpers
│   │   ├── at-rules.ts # At-rule definitions (used by rules)
│   │   ├── browser-compat.ts # Browser compat data
│   │   ├── css.ts    # @eslint/css rules re-export (type boundary)
│   │   ├── css-properties.ts # CSS property validation
│   │   ├── tailwind.ts # Tailwind-specific utilities
│   │   ├── theme.ts  # Theme token utilities
│   │   └── types.ts  # Shared type definitions
│   ├── index.ts      # Main plugin export
│   └── types.ts      # TypeScript definitions
├── docs/rules/       # Rule documentation (one file per rule)
├── build.config.ts   # Build configuration
├── eslint.config.mjs # Self-linting configuration
├── package.json      # Package manifest
└── tsconfig.json     # TypeScript configuration
```

### ESLint Rules

All rules are in `src/rules/` with corresponding tests in
`src/__tests__/rules/` and documentation in `docs/rules/`.
`src/rules/index.ts` has an internal `rules` map (literal keys) that
derives `PluginRuleKey`, and re-exports `pluginRules` with explicit
`Record<PluginRuleKey, RuleDefinition>` type. `TailwindcssRuleKey` in
`src/configs/rules.ts` derives from `PluginRuleKey`.

## Common Tasks

### Adding a New Rule

#### Step-by-Step Guide

1. **Create the rule file** in `src/rules/rule-name.ts`

   ```typescript
   import type { StyleSheetPlain } from '@eslint/css-tree';

   import type { CSSRuleDefinition } from '../types';

   type RuleNameOptions = [];
   type RuleNameMessageIds = 'messageId';

   export const ruleName: CSSRuleDefinition<{
     RuleOptions: RuleNameOptions
     MessageIds: RuleNameMessageIds
   }> = {
     meta: {
       type: 'problem', // or 'suggestion', 'layout'
       docs: {
         description: 'Rule description',
         category: 'Possible Errors', // or 'Best Practices', 'Stylistic Issues'
         recommended: true,
       },
       fixable: undefined, // or 'code', 'whitespace'
       schema: [],
       messages: {
         messageId: 'Error message text',
       },
     },
     create(context) {
       return {
         StyleSheet(node: StyleSheetPlain) {
           // Process CSS AST
         },
       };
     },
   };
   ```

2. **Add to** `src/rules/index.ts` (import + internal `rules` map,
   keep alphabetically sorted)

   ```typescript
   import { ruleName } from './rule-name';
   // ...
   const rules = {
     // ...
     'rule-name': ruleName,
   };
   ```

3. **Add to config presets** as appropriate:
   - `minimal.ts`: Essential rules only
   - `recommended.ts`: Balanced ruleset
   - `strict.ts`: All rules with strict settings

4. **Create tests** in `src/__tests__/rules/rule-name.test.ts`

   ```typescript
   import css from '@eslint/css';
   import { RuleTester } from 'eslint';

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

5. **Create rule documentation** in `docs/rules/rule-name.md`

   ````markdown
   # rule-name

   Brief description of what the rule does.

   ## Rule Details

   Detailed explanation of the rule's purpose and behavior.

   Examples of **incorrect** code for this rule:

   ```css
   /* ❌ Error */
   .example {
     /* problematic code */
   }
   ```

   Examples of **correct** code for this rule:

   ```css
   /* ✅ Good */
   .example {
     /* valid code */
   }
   ```

   ## Options

   This rule accepts an object with the following properties:

   - `optionName` (type): Description. Default: `value`

   Example configuration:

   ```js
   {
     "tailwindcss/rule-name": ["error", {
       "optionName": "value"
     }]
   }
   ```

   ## When Not To Use It

   Describe scenarios where disabling this rule makes sense.

   ## Further Reading

   - [Relevant documentation links]
   ````

6. **Update** `README.md` rules table

   - Add entry to appropriate category in implemented rules section
   - Include link to documentation: `[rule-name](./docs/rules/rule-name.md)`
   - Add 🔧 indicator if auto-fixable
   - Keep rules alphabetically sorted within categories

### CSS AST Concepts

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
- `Block`: Container for declarations/rules
- `Comment`: Comment nodes (see below)

**Utility functions**: See `src/utils/ast.ts` for type guards,
tree traversal (`walk`), node inspection helpers, and CSS context
validation (`getCSSContext`, `isCSSContext`).

#### Block and Comment Handling

**Critical**: Comments in CSS blocks are handled differently than you might expect:

1. **Comments ARE children**: In @eslint/css-tree AST, Comment nodes appear
   as regular children in Block nodes
2. **Empty block detection**: A block with only comments has
   `children.length > 0`
3. **Filtering comments**: Use
   `block.children.filter(child => child.type !== 'Comment')` to get only
   declarations

Example block structure:

```typescript
Block {
  type: "Block",
  children: [
    { type: "Comment", value: " comment text " },
    { type: "Declaration", property: "color", value: {...} },
    { type: "Comment", value: " another comment " }
  ]
}
```

#### Import (@import) Handling

When working with @import rules:

1. **Atrule node**: Import statements are `Atrule` nodes with `name: 'import'`
2. **URL extraction**: The URL can be in two formats:
   - String syntax: `@import "file.css";`
   - URL function: `@import url("file.css");`
3. **Prelude parsing**: The import URL is in `node.prelude`, use regex to extract:

   ```typescript
   const preludeText = context.sourceCode.getText(node.prelude).trim();
   // Match: "file.css" or 'file.css'
   const stringMatch = preludeText.match(/^["'](.+?)["']$/);
   // Match: url("file.css") or url(file.css)
   const urlMatch = preludeText.match(/^url\s*\(\s*["']?(.+?)["']?\s*\)$/);
   ```

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

#### AST Research Tips

When implementing new rules:

1. **Clone @eslint/css for reference**:

   ```bash
   git clone https://github.com/eslint/css.git .eslint-css-ref
   ```

   Check their rule implementations for patterns and edge cases.

2. **Inspect AST structure**:

   ```typescript
   // Add console.log in your rule to inspect nodes
   console.log(JSON.stringify(node, null, 2));
   ```

3. **Check node children**:
   - Not all nodes have blocks (e.g., @import doesn't)
   - Some at-rules have blocks (e.g., @media, @supports, @layer)
   - Always check if `node.block` exists before accessing

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

### Rule Documentation Standards

When documenting rules, follow these guidelines:

1. **Rule Name**: Use kebab-case matching the rule ID
2. **Description**: Start with action verb (Disallow, Enforce, Prefer, etc.)
3. **Categories**:
   - **Possible Errors**: Rules catching syntax errors or bugs
   - **Best Practices**: Rules promoting better patterns
   - **Stylistic Issues**: Rules enforcing formatting/style
4. **Examples**: Always provide both incorrect (❌) and correct (✅) examples
5. **Options**: Document all configuration options with types and defaults
6. **Auto-fix**: Clearly indicate if rule supports auto-fixing with 🔧
7. **When Not To Use**: Include realistic scenarios for disabling
8. **Further Reading**: Link to relevant Tailwind/CSS documentation

#### Rule Documentation Template Structure

```markdown
# rule-name

One-line description starting with action verb.

## Rule Details

2-3 paragraphs explaining:
- What the rule checks for
- Why this pattern is problematic/beneficial
- How it relates to Tailwind CSS v4 features (if applicable)

Examples of **incorrect** code:
- Show 2-3 common violations
- Include edge cases
- Add explanatory comments

Examples of **correct** code:
- Show corresponding fixes
- Include alternative valid patterns
- Demonstrate best practices

## Options

- Document each option with type and default
- Provide configuration examples
- Show how options affect rule behavior

## When Not To Use It

- List specific valid use cases for disabling
- Mention compatibility concerns
- Note migration scenarios

## Further Reading

- Link to Tailwind CSS docs
- Link to CSS specifications
- Link to related rules
```

### Updating README.md

When implementing a new rule:

1. **Move from unimplemented to implemented section**:
   - Remove entry from "Unimplemented Rules (Roadmap)" section
   - Add to appropriate category under "Rules" section
   - Maintain alphabetical order within category

2. **Rule table entry format**:

   ```markdown
   | [rule-name](./docs/rules/rule-name.md) | Brief description with verb | 🔧 |
   ```

   - First column: Rule name with link to documentation
   - Second column: Description (should match meta.docs.description)
   - Third column: 🔧 if auto-fixable, empty otherwise

3. **Categories**:
   - Place in same category as defined in rule's meta.docs.category
   - Current categories: Possible Errors, Best Practices, Stylistic Issues

4. **Description guidelines**:
   - Start with action verb (Disallow, Enforce, Prefer, Validate, etc.)
   - Keep under 80 characters for table formatting
   - Use common abbreviations if needed (i18n, a11y, etc.)

### Beyond @eslint/css Wrappers

**Important**: Wrapping @eslint/css rules is not the goal. Our rules should be:

1. **More configurable**: Add options that @eslint/css doesn't have
   - Example: `no-empty-blocks` could have `allowComments` option
   - Example: `no-invalid-properties` could have `allowVendorPrefixes` option

2. **Tailwind-aware**: Understand Tailwind CSS v4 features
   - Validate theme() function usage
   - Check @apply directive classes
   - Understand Tailwind modifiers and variants

3. **Better error messages**: More helpful and specific
   - Include suggestions for fixes
   - Point to specific parts of the error
   - Provide context about why something is wrong

4. **Auto-fixable when possible**: Help users fix issues automatically
   - Fix typos in property names
   - Remove empty blocks
   - Correct theme() function syntax

### Committing Rules

**Important**: One rule per commit for better history and reviews.

1. **Initial implementation commit**:

   ```bash
   # Create .commit-msg-add-rule using Write tool, then:
   git commit -sF .commit-msg-add-rule src/rules/rule-name.ts \
     src/__tests__/rules/rule-name.test.ts \
     src/rules/index.ts \
     src/configs/strict.ts docs/rules/rule-name.md \
     README.md CHANGELOG.md

   # Clean up
   rm .commit-msg-add-rule
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
5. **ESLint Integration**: Run `pnpm lint:check` to check without fixing
