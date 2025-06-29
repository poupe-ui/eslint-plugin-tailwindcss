# AGENT.md

This file provides guidance to AI coding assistants (Claude Code, GitHub
Copilot, etc.) when working with code in this repository.

## Project Overview

`@poupe/eslint-plugin-tailwindcss` is an ESLint plugin that provides linting
rules for Tailwind CSS v4.

## Commands

### Development Commands

- `pnpm build` - Build the package
- `pnpm lint` - Run ESLint with auto-fix enabled
- `pnpm type-check` - Check TypeScript types
- `pnpm clean` - Remove dist folder and node_modules
- `pnpm prepack` - Full validation before publishing
- `pnpm test` - Run tests
- `pnpm precommit` - Run all pre-commit checks

## Code Style Guidelines

All code follows these conventions (enforced by .editorconfig and ESLint):

- **Indentation**: 2 spaces for TypeScript/JavaScript/JSON
- **Line Endings**: Unix (LF)
- **Charset**: UTF-8
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Module System**: ES modules (`type: "module"`)

## Development Practices

### Pre-commit Checklist (MANDATORY)

Before committing any changes, ALWAYS run:

1. `pnpm precommit` - Run all precommit checks
2. Fix any issues found by the precommit checks
3. Update AGENT.md if guidelines change
4. Update README.md if public API changes

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