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

1. `pnpm precommit` - Run all precommit checks
2. Fix any issues found by the precommit checks
3. Update AGENT.md if guidelines change
4. Update README.md if public API changes
5. Review documentation formatting follows guidelines

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

1. Create rule file in `src/rules/rule-name.ts`
2. Export from `src/rules/index.ts`
3. Add to appropriate config preset(s)
4. Create tests in `src/__tests__/rules/rule-name.test.ts`
5. Update README.md with rule documentation

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
