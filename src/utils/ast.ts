import type { CssNodePlain, AtrulePlain, DeclarationPlain, FunctionNodePlain } from '@eslint/css-tree';
import type { CSSSourceCode } from '@eslint/css';

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
