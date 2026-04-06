import type { RuleDefinition } from '@eslint/core';

import { consistentSpacing } from './consistent-spacing';
import { noArbitraryValueOveruse } from './no-arbitrary-value-overuse';
import { noConflictingUtilities } from './no-conflicting-utilities';
import { noDuplicateImports } from './no-duplicate-imports';
import { noDuplicateReference } from './no-duplicate-reference';
import { noEmptyBlocks } from './no-empty-blocks';
import { noImportant } from './no-important';
import { noInvalidAtRules } from './no-invalid-at-rules';
import { noInvalidNamedGridAreas } from './no-invalid-named-grid-areas';
import { noInvalidProperties } from './no-invalid-properties';
import { preferLogicalProperties } from './prefer-logical-properties';
import { preferThemeTokens } from './prefer-theme-tokens';
import { relativeFontUnits } from './relative-font-units';
import { requireReferenceInVue } from './require-reference-in-vue';
import { useBaseline } from './use-baseline';
import { useLayers } from './use-layers';
import { validApplyDirective } from './valid-apply-directive';
import { validModifierSyntax } from './valid-modifier-syntax';
import { validThemeFunction } from './valid-theme-function';

/**
 * All plugin rules keyed by their kebab-case name.
 * Single source of truth for rule registration and type derivation.
 */
export const pluginRules = {
  'consistent-spacing': consistentSpacing,
  'no-arbitrary-value-overuse': noArbitraryValueOveruse,
  'no-conflicting-utilities': noConflictingUtilities,
  'no-duplicate-imports': noDuplicateImports,
  'no-duplicate-reference': noDuplicateReference,
  'no-empty-blocks': noEmptyBlocks,
  'no-important': noImportant,
  'no-invalid-at-rules': noInvalidAtRules,
  'no-invalid-named-grid-areas': noInvalidNamedGridAreas,
  'no-invalid-properties': noInvalidProperties,
  'prefer-logical-properties': preferLogicalProperties,
  'prefer-theme-tokens': preferThemeTokens,
  'relative-font-units': relativeFontUnits,
  'require-reference-in-vue': requireReferenceInVue,
  'use-baseline': useBaseline,
  'use-layers': useLayers,
  'valid-apply-directive': validApplyDirective,
  'valid-modifier-syntax': validModifierSyntax,
  'valid-theme-function': validThemeFunction,
} satisfies Record<string, RuleDefinition>;

/**
 * Rule name keys — derived from `pluginRules`.
 */
export type PluginRuleKey = keyof typeof pluginRules;
