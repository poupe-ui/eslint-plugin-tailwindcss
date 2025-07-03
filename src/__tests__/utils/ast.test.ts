import type { RuleContext, RuleContextTypeOptions, SourceCode } from '@eslint/core';

import { CSSSourceCode } from '@eslint/css';
import { describe, expect, it } from 'vitest';

import { getCSSContext, isCSSContext } from '../../utils/ast';

// Mock AST node type
interface MockAST {
  type: string
}

// Mock source code type
interface MockSourceCode extends Partial<SourceCode> {
  text?: string
  ast?: MockAST
}

// Helper function moved to outer scope
const createMockContext = (
  overrides: Partial<RuleContext<RuleContextTypeOptions>> = {},
): RuleContext<RuleContextTypeOptions> => {
  const mockSourceCode: MockSourceCode = {
    text: '.test { color: red; }',
    ast: { type: 'StyleSheet' },
  };

  return {
    filename: 'test.css',
    getFilename: () => 'test.css',
    sourceCode: mockSourceCode as SourceCode,
    languageOptions: {},
    ...overrides,
  } as unknown as RuleContext<RuleContextTypeOptions>;
};

describe('getCSSContext', () => {
  it('should return CSS context for .css files', () => {
    const context = createMockContext({
      filename: 'styles.css',
      getFilename: () => 'styles.css',
    });

    const result = getCSSContext(context);
    expect(result).toBeDefined();
    expect(result?.contextType).toBe('css-file');
    expect(result?.isVueFile).toBe(false);
    expect(result?.getCSSSourceCode()).toBeUndefined();
  });

  it('should return CSS context for .vue files with StyleSheet AST', () => {
    const context = createMockContext({
      filename: 'component.vue',
      getFilename: () => 'component.vue',
      sourceCode: {
        text: '.test { color: red; }',
        ast: { type: 'StyleSheet' },
      } as MockSourceCode as SourceCode,
    });

    const result = getCSSContext(context);
    expect(result).toBeDefined();
    expect(result?.contextType).toBe('vue-style');
    expect(result?.isVueFile).toBe(true);
    expect(result?.getCSSSourceCode()).toBeUndefined();
  });

  it('should return undefined for Vue files with CSS language but no CSS AST', () => {
    const context = createMockContext({
      filename: 'component.vue',
      getFilename: () => 'component.vue',
      languageOptions: {
        language: 'css/css',
      },
      sourceCode: {
        text: '.test { color: red; }',
        ast: { type: 'Program' }, // Not a StyleSheet
      } as MockSourceCode as SourceCode,
    });

    const result = getCSSContext(context);
    expect(result).toBeUndefined(); // No CSS AST means no CSS context
  });

  it('should return undefined for JavaScript files', () => {
    const context = createMockContext({
      filename: 'script.js',
      getFilename: () => 'script.js',
      sourceCode: {
        text: 'const x = 1;',
        ast: { type: 'Program' },
      } as MockSourceCode as SourceCode,
    });

    const result = getCSSContext(context);
    expect(result).toBeUndefined();
  });

  it('should handle CSSSourceCode instances', () => {
    const cssSourceCode = new CSSSourceCode({
      text: '.test { color: red; }',
      ast: { type: 'StyleSheet' } as MockAST,
    });

    const context = createMockContext({
      filename: 'test.txt',
      getFilename: () => 'test.txt',
      sourceCode: cssSourceCode as SourceCode,
    });

    const result = getCSSContext(context);
    expect(result).toBeDefined();
    expect(result?.contextType).toBe('css-file');
    expect(result?.getCSSSourceCode()).toBe(cssSourceCode);
  });
});

describe('isCSSContext', () => {
  it('should return true for .css files', () => {
    const context = createMockContext({
      filename: 'styles.css',
      getFilename: () => 'styles.css',
    });

    expect(isCSSContext(context)).toBe(true);
  });

  it('should return true for .vue files with StyleSheet AST', () => {
    const context = createMockContext({
      filename: 'component.vue',
      getFilename: () => 'component.vue',
      sourceCode: {
        text: '.test { color: red; }',
        ast: { type: 'StyleSheet' },
      } as MockSourceCode as SourceCode,
    });

    expect(isCSSContext(context)).toBe(true);
  });

  it('should return false for .vue files with CSS language options but no StyleSheet AST', () => {
    const context = createMockContext({
      filename: 'component.vue',
      getFilename: () => 'component.vue',
      languageOptions: {
        language: 'css/css',
      },
      sourceCode: {
        text: '.test { color: red; }',
        ast: { type: 'Program' }, // Not a StyleSheet
      },
    });

    expect(isCSSContext(context)).toBe(false);
  });

  it('should return false for non-CSS files', () => {
    const context = createMockContext({
      filename: 'script.js',
      getFilename: () => 'script.js',
      sourceCode: {
        text: 'const x = 1;',
        ast: { type: 'Program' },
      },
    });

    expect(isCSSContext(context)).toBe(false);
  });

  it('should return false for .vue files without CSS context', () => {
    const context = createMockContext({
      filename: 'component.vue',
      getFilename: () => 'component.vue',
      sourceCode: {
        text: '<template></template>',
        ast: { type: 'Program' },
      },
      languageOptions: {},
    });

    expect(isCSSContext(context)).toBe(false);
  });

  it('should return true when sourceCode is CSSSourceCode instance', () => {
    const cssSourceCode = new CSSSourceCode({
      text: '.test { color: red; }',
      ast: { type: 'StyleSheet' } as MockAST,
    });

    const context = createMockContext({
      filename: 'test.txt', // Not a .css file
      getFilename: () => 'test.txt',
      sourceCode: cssSourceCode as SourceCode,
    });

    expect(isCSSContext(context)).toBe(true);
  });

  it('should return false when sourceCode is missing', () => {
    const context = createMockContext({
      sourceCode: undefined as unknown as SourceCode,
    });

    expect(isCSSContext(context)).toBe(false);
  });

  it('should return false when sourceCode.text is not a string', () => {
    const context = createMockContext({
      sourceCode: {
        text: undefined,
        ast: { type: 'StyleSheet' },
      } as unknown as SourceCode,
    });

    expect(isCSSContext(context)).toBe(false);
  });
});
