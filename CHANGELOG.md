# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2024-12-30

### Added

- New `consistent-spacing` rule for enforcing consistent spacing in CSS declarations
- Comprehensive test coverage for all existing rules
- Expanded documentation for rule development in AGENT.md
- Testing section in README with examples and commands

### Fixed

- Linting issues in rule implementations and tests
- Import ordering to follow project conventions

### Changed

- Improved code quality with stricter linting rules for JavaScript/TypeScript files

## [0.1.2] - 2024-12-30

### Fixed

- Fixed missing parser export in build configuration
- Changed export path from `./syntax` to `./parser` for better clarity
- Added placeholder test to prevent test failures

### Changed

- Improved parser export naming for better developer experience
- Configured markdownlint/md024 to allow duplicate headers in CHANGELOG.md when
  not siblings

## [0.1.1] - 2024-12-30

### Added

- Initial release of @poupe/eslint-plugin-tailwindcss
- Six comprehensive ESLint rules for Tailwind CSS v4:
  - `valid-theme-function`: Validates theme() function usage with auto-fix support
  - `valid-modifier-syntax`: Validates Tailwind modifier syntax (hover:, sm:, etc.)
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

- Updated plugin internal name from `tailwindcss-v4` to `tailwindcss` for consistency
- Sorted all rules alphabetically in configuration files
- Added eslint-plugin-perfectionist for automated import/export sorting

### Infrastructure

- Set up build system with unbuild
- Configured Vitest for unit testing with coverage support
- Added pre-commit hooks and validation scripts
- Integrated with @poupe/eslint-config for development
- Added comprehensive documentation (README.md, AGENT.md)
