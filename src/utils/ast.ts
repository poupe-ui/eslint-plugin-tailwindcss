import type { RuleContext, RuleContextTypeOptions } from '@eslint/core';
import type { CSSLanguageOptions } from '@eslint/css';
import type { AtrulePlain, CssNodePlain, DeclarationPlain, FunctionNodePlain } from '@eslint/css-tree';

import { CSSSourceCode } from '@eslint/css';

/**
 * Type for CSS rule context - matches what CSS rules expect
 */
export type CSSRuleContext = RuleContext<{
  LangOptions: CSSLanguageOptions
  Code: CSSSourceCode
  RuleOptions: unknown[]
  Node: CssNodePlain
  MessageIds: string
}>;

/**
 * CSS context information for rule handlers
 */
export interface CSSContextInfo {
  /**
   * The type of CSS context
   */
  contextType: 'css-file' | 'vue-style'

  /**
   * Whether this is a Vue single-file component
   */
  isVueFile: boolean

  /**
   * The source code object (always available when CSS is detected)
   */
  sourceCode: unknown

  /**
   * The original rule context with proper CSS typing
   */
  context: CSSRuleContext

  /**
   * Get the source code as a CSSSourceCode instance if it is one
   * @returns CSSSourceCode instance or undefined
   */
  getCSSSourceCode(): CSSSourceCode | undefined
}

/**
 * Validates and extracts CSS context information from any rule context.
 * This function accepts any RuleContext type and returns validated CSS information.
 *
 * @param context - ESLint rule context with any type parameters
 * @returns Validated CSS context information, or undefined if not valid CSS content
 *
 * @example
 * ```typescript
 * // Works with any rule context type
 * create(context) {
 *   const cssInfo = getCSSContext(context);
 *   if (!cssInfo) {
 *     return {}; // Not CSS content
 *   }
 *
 *   // Now we know we have valid CSS context with a CSS AST
 *   const { sourceCode, isVueFile, contextType, context, getCSSSourceCode } = cssInfo;
 *
 *   // context is properly typed as CSSRuleContext
 *   // sourceCode is always available for CSS content
 *
 *   // Get CSSSourceCode instance if available
 *   const cssSourceCode = getCSSSourceCode();
 *   if (cssSourceCode) {
 *     // Can use CSSSourceCode-specific methods
 *   }
 *
 *   if (isVueFile) {
 *     // Special Vue handling
 *   }
 *
 *   return {
 *     Rule(node) {
 *       // Safe to use CSS-specific logic
 *     }
 *   };
 * }
 * ```
 */
export function getCSSContext<T extends RuleContextTypeOptions = RuleContextTypeOptions>(
  context: RuleContext<T>,
): CSSContextInfo | undefined {
  const context_ = context;

  // Check if we have source code - if not, it's not CSS content
  if (!context_.sourceCode) {
    return undefined;
  }

  // Get filename
  const filename = context_.filename || context_.getFilename();
  const isVueFile = filename.endsWith('.vue');

  // For CSS content, we need to check the AST type
  const sourceCode = context_.sourceCode;

  // Type guard to check if sourceCode has the properties we need
  if (!sourceCode || typeof sourceCode !== 'object') {
    return undefined;
  }

  const sourceCodeObject = sourceCode as unknown as {
    ast?: { type?: string }
    text?: unknown
    [key: string]: unknown
  };

  // If we can't access the AST or text, it's not CSS content
  if (!sourceCodeObject.ast || typeof sourceCodeObject.text !== 'string') {
    return undefined;
  }

  // Check if the AST is a CSS StyleSheet
  if (sourceCodeObject.ast.type !== 'StyleSheet') {
    return undefined;
  }

  // Helper to create the context info object
  const createContextInfo = (contextType: 'css-file' | 'vue-style', isVue: boolean): CSSContextInfo => {
    return {
      contextType,
      isVueFile: isVue,
      sourceCode: sourceCodeObject,
      context: context_ as unknown as CSSRuleContext,
      getCSSSourceCode() {
        // Check if sourceCode is an instance of CSSSourceCode
        if (this.sourceCode instanceof CSSSourceCode) {
          return this.sourceCode;
        }
        return undefined;
      },
    };
  };

  // Vue file - <style> blocks
  if (isVueFile) {
    return createContextInfo('vue-style', true);
  }

  // Regular CSS file
  return createContextInfo('css-file', false);
}

/**
 * Check if the current rule context is for CSS content.
 * Accepts any value and safely checks if it's a valid CSS context.
 *
 * @param context - Any value (will be validated)
 * @returns true if the context is for CSS content
 */
export function isCSSContext(context: unknown): boolean {
  // Just try to get CSS context - if it works, it's CSS
  try {
    return getCSSContext(context as RuleContext<RuleContextTypeOptions>) !== undefined;
  } catch {
    return false;
  }
}

/**
 * Check if a node is of a specific type
 */
export function isNodeType<T extends CssNodePlain['type']>(
  node: CssNodePlain | null | undefined,
  type: T,
): node is Extract<CssNodePlain, { type: T }> {
  return node?.type === type;
}

/**
 * Get all child nodes of a specific type
 */
export function getChildrenOfType<T extends CssNodePlain['type']>(
  node: CssNodePlain,
  type: T,
): Extract<CssNodePlain, { type: T }>[] {
  const results: Extract<CssNodePlain, { type: T }>[] = [];

  function traverse(n: CssNodePlain) {
    if (isNodeType(n, type)) {
      results.push(n as Extract<CssNodePlain, { type: T }>);
    }

    // Traverse children based on node type
    if ('children' in n && Array.isArray(n.children)) {
      for (const child of n.children) {
        traverse(child);
      }
    }

    if ('prelude' in n && n.prelude) {
      traverse(n.prelude);
    }

    if ('block' in n && n.block) {
      traverse(n.block);
    }

    if ('value' in n && n.value && typeof n.value === 'object' && 'type' in n.value) {
      traverse(n.value as CssNodePlain);
    }
  }

  traverse(node);
  return results;
}

/**
 * Get the text content of a node
 */
export function getNodeText(node: CssNodePlain, sourceCode: CSSSourceCode): string {
  if (!node.loc) return '';
  return sourceCode.text.slice(node.loc.start.offset, node.loc.end.offset);
}

/**
 * Check if a node is an at-rule with a specific name
 */
export function isAtRule(
  node: CssNodePlain | null | undefined,
  name?: string,
): node is AtrulePlain {
  if (!isNodeType(node, 'Atrule')) {
    return false;
  }
  return name ? node.name === name : true;
}

/**
 * Get all declarations from a rule or at-rule block
 */
export function getDeclarations(node: CssNodePlain): DeclarationPlain[] {
  if (!('block' in node) || !node.block) {
    return [];
  }

  return getChildrenOfType(node.block, 'Declaration');
}

/**
 * Check if a value contains a specific function
 */
export function hasFunction(
  value: CssNodePlain | null | undefined,
  functionName: string,
): boolean {
  if (!value) return false;

  const functions = getChildrenOfType(value, 'Function');
  return functions.some(fn => fn.name === functionName);
}

/**
 * Get all function calls in a value
 */
export function getFunctions(
  value: CssNodePlain | null | undefined,
): FunctionNodePlain[] {
  if (!value) return [];
  return getChildrenOfType(value, 'Function');
}

/**
 * Check if a selector contains a specific pseudo-class
 */
export function hasPseudoClass(
  selector: CssNodePlain | null | undefined,
  pseudoClass: string,
): boolean {
  if (!selector) return false;

  const pseudoClasses = getChildrenOfType(selector, 'PseudoClassSelector');
  return pseudoClasses.some(pc => pc.name === pseudoClass);
}

/**
 * Walk through all nodes in the AST
 */
export function walk(
  node: CssNodePlain,
  visitor: (node: CssNodePlain, parent: CssNodePlain | undefined) => void,
  parent: CssNodePlain | undefined = undefined,
): void {
  visitor(node, parent);

  // Traverse children based on node type
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visitor, node);
    }
  }

  if ('prelude' in node && node.prelude) {
    walk(node.prelude, visitor, node);
  }

  if ('block' in node && node.block) {
    walk(node.block, visitor, node);
  }

  if ('value' in node && node.value && typeof node.value === 'object' && 'type' in node.value) {
    walk(node.value as CssNodePlain, visitor, node);
  }
}
