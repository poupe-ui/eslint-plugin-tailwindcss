# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **COMPLETE @eslint/css feature parity!** 🎉
  - `no-invalid-named-grid-areas` - Validates CSS Grid template areas are
    properly formed (rectangular, non-empty, consistent columns)

## [0.2.2] - 2025-07-02

### Added

- Build infrastructure improvements:
  - Configure pnpm version 9.15.2 with corepack support
  - Set minimum Node.js version requirement to 18.0.0
  - Add GitHub Actions workflow for builds
  - Add renovate configuration validator workflow
  - Configure Renovate to group eslint-related package updates
  - Add cross-env and rimraf for cross-platform script compatibility

### Changed

- Code quality improvements:
  - Add @stylistic/operator-linebreak rule for consistent operator placement
  - Fix union type formatting (remove leading | from first option,
    alphabetical sorting)
  - Apply consistent code formatting across the codebase
  - Fix GitHub workflow indentation

- Refactored inline object type definitions to named interfaces for better
  code organization:
  - Added `ModifierValidationResult` interface for modifier validation
  - Added `ThemeTokenSuggestion` interface for theme token suggestions
  - Added `StringWithDistance` interface for similarity calculations
  - Added `TokenSuggestion` interface for token scoring

## [0.2.1] - 2025-07-01

### Added

- New CSS parity rules for better alignment with @eslint/css:
  - `no-invalid-properties` - Validates CSS property names
  - `no-invalid-at-rules` - Validates CSS at-rule names
  - `use-baseline` - Enforces use of widely-supported CSS features
  - `no-important` - Discourages use of !important flags
  - `prefer-logical-properties` - Wrapper for @eslint/css rule
  - `relative-font-units` - Wrapper for @eslint/css rule
  - `use-layers` - Wrapper for @eslint/css rule

## [0.2.0] - 2025-07-01

### Added

- Direct dependency on `@eslint/core` for modern ESLint architecture
- Full compatibility with @eslint/css rules and ecosystem
- Language support with `CSSLanguage` from @eslint/css

### Changed

- **BREAKING**: Migrated to @eslint/core architecture
- **BREAKING**: Now requires ESLint 9.0+ and flat config format
- **BREAKING**: Configuration must include `language: 'css/css'` field
- Plugin now dynamically reads name and version from package.json
- All rules migrated to use `CSSRuleDefinition` type from @eslint/core
- Updated all documentation to use `eslint.config.mjs` with TypeScript checks
- Improved TypeScript type safety throughout the codebase
- Updated dependencies: eslint to ^9.30.0, unbuild to ^3.5.0

### Removed

- Support for legacy ESLint configuration format (.eslintrc)
- Migration-related type exports that were for backward compatibility

## [0.1.5] - 2025-06-30

### Added

- New `no-duplicate-imports` rule to detect duplicate @import statements
- New `no-empty-blocks` rule to detect empty CSS rule blocks and at-rule blocks
- CSS AST implementation guidance in AGENT.md
- Rule documentation files for new rules

### Improved

- Enhanced AGENT.md with detailed CSS AST structure documentation
- Added guidance for handling comments in CSS blocks
- Documented import URL extraction patterns

## [0.1.4] - 2025-06-30

### Fixed

- Fixed potential runtime error in `consistent-spacing` rule when colon is at
  end of declaration
- Added bounds checking to prevent undefined access in string slicing

### Added

- Comprehensive edge case tests for `consistent-spacing` rule including:
  - Colons in string values
  - Colons in data URLs
  - Unicode content handling
  - Escaped characters
  - Inline comments affecting spacing
- Malformed CSS handling test suite to document parser behavior
- TSDoc documentation for all functions in `consistent-spacing` and
  `valid-modifier-syntax` rules

### Improved

- Better error handling for edge cases in CSS parsing
- More robust string manipulation in spacing detection

## [0.1.3] - 2025-06-30

### Added

- New `consistent-spacing` rule for enforcing consistent spacing in CSS
  declarations
- Comprehensive test coverage for all existing rules
- Expanded documentation for rule development in AGENT.md
- Testing section in README with examples and commands

### Fixed

- Linting issues in rule implementations and tests
- Import ordering to follow project conventions

### Changed

- Improved code quality with stricter linting rules for JavaScript/TypeScript
  files

## [0.1.2] - 2025-06-30

### Fixed

- Fixed missing parser export in build configuration
- Changed export path from `./syntax` to `./parser` for better clarity
- Added placeholder test to prevent test failures

### Changed

- Improved parser export naming for better developer experience
- Configured markdownlint/md024 to allow duplicate headers in CHANGELOG.md when
  not siblings

## [0.1.1] - 2025-06-30

### Added

- Initial release of @poupe/eslint-plugin-tailwindcss
- Six comprehensive ESLint rules for Tailwind CSS v4:
  - `valid-theme-function`: Validates theme() function usage with auto-fix
    support
  - `valid-modifier-syntax`: Validates Tailwind modifier syntax (hover:,
    sm:, etc.)
  - `valid-apply-directive`: Validates @apply directive usage in CSS files
  - `no-conflicting-utilities`: Detects and prevents conflicting Tailwind
    utility classes
  - `no-arbitrary-value-overuse`: Discourages excessive use of arbitrary values
  - `prefer-theme-tokens`: Encourages use of theme tokens over arbitrary values
- Three configuration presets:
  - `minimal`: Essential error prevention rules only
  - `recommended`: Balanced rule set for most projects
  - `strict`: All rules with strict settings for maximum code quality
- Custom parser extension for Tailwind v4 syntax support
- Comprehensive utility functions for CSS AST analysis
- Full TypeScript support with complete type definitions
- Integration with @eslint/css for CSS parsing
- Support for Tailwind CSS v4 specific features (@theme, @source, @variant)

### Changed

- Updated plugin internal name from `tailwindcss-v4` to `tailwindcss` for
  consistency
- Sorted all rules alphabetically in configuration files
- Added eslint-plugin-perfectionist for automated import/export sorting

### Infrastructure

- Set up build system with unbuild
- Configured Vitest for unit testing with coverage support
- Added pre-commit hooks and validation scripts
- Integrated with @poupe/eslint-config for development
- Added comprehensive documentation (README.md, AGENT.md)
