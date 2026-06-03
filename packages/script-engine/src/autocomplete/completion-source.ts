import {
  type Completion,
  type CompletionContext,
  type CompletionResult,
  type CompletionSource,
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { resolveChainType } from './resolve';
import type { LanguageConfig, ScriptMetadata, ScriptTypeInfo } from '../types';
// 向后兼容：保留旧工厂函数使用 Groovy 内置配置
import { groovyConfig } from '../languages/groovy';

// ── 工具函数 ────────────────────────────────────────────────

function formatFunctionSignature(fn: {
  name: string;
  parameters: { dataType: string; name: string }[];
}): string {
  const params = fn.parameters.map((p) => `${p.name}: ${p.dataType}`).join(', ');
  return `(${params})`;
}

function buildMemberCompletions(typeInfo: ScriptTypeInfo): Completion[] {
  const options: Completion[] = [];

  for (const field of typeInfo.fields) {
    options.push({
      label: field.name,
      type: 'property',
      detail: field.description ? `${field.dataType} — ${field.description}` : field.dataType,
      info: field.description || undefined,
    });
  }

  for (const func of typeInfo.functions) {
    const sig = formatFunctionSignature(func);
    const ret = func.returnType ? ` → ${func.returnType}` : '';
    const detail = func.description
      ? `${sig}${ret} — ${func.description}`
      : `${sig}${ret}`;
    options.push({
      label: func.name,
      type: 'function',
      detail,
      info: func.description || undefined,
      apply: `${func.name}()`,
      boost: -1,
    });
  }

  return options;
}

/**
 * 检查光标是否在字符串或注释中（根据语言配置的语法树节点名判断）
 */
function isInStringOrComment(
  context: CompletionContext,
  syntaxNodeNames: LanguageConfig['syntaxNodeNames']
): boolean {
  const node = syntaxTree(context.state).resolveInner(context.pos, -1);
  const name = node.name;
  return (
    syntaxNodeNames.stringNodes.includes(name) ||
    syntaxNodeNames.commentNodes.includes(name)
  );
}

// ── 通用补全源工厂 ──────────────────────────────────────────

/**
 * 创建语言无关的自动补全源
 *
 * 当 metadata 存在时，同时提供元数据驱动的类型补全和语言关键字片段补全。
 * 当 metadata 为空时，仅提供关键字片段补全。
 *
 * @param languageConfig 语言配置（提供 keywordSnippets 和 syntaxNodeNames）
 * @param metadata 脚本元数据（可选，提供变量/字段/方法补全）
 */
export function createCompletionSource(
  languageConfig: LanguageConfig,
  metadata?: ScriptMetadata
): CompletionSource {
  return function completionSource(
    context: CompletionContext
  ): CompletionResult | null {
    try {
      // 在字符串/注释中不触发补全
      if (isInStringOrComment(context, languageConfig.syntaxNodeNames)) return null;

      // 匹配点号链（如 "request.test."）或简单单词（如 "re"）
      const chainMatch = context.matchBefore(/[\w$]+(?:\.[\w$]+)*\.|[\w$]+/);
      if (!chainMatch) return null;

      const hasDot = chainMatch.text.includes('.');
      const parts = chainMatch.text.split('.');
      const isDotAccess = hasDot && parts.length >= 2;

      if (isDotAccess && metadata) {
        // ── 点号链式补全 ──────────────────────────
        const baseParts = parts.slice(0, -1);
        const currentPrefix = parts[parts.length - 1];

        const resolvedType = resolveChainType(baseParts, metadata);
        if (!resolvedType) return null;

        const options = buildMemberCompletions(resolvedType);
        if (options.length === 0) return null;

        return {
          from: chainMatch.to - currentPrefix.length,
          options,
          validFor: /^[\w$]*$/,
        };
      }

      // ── 非点号访问：元数据变量 + 语言语法片段 ──────────
      const options: Completion[] = [];

      // 添加元数据中的变量（仅当有 metadata 时）
      if (metadata) {
        for (const bind of metadata.binds) {
          options.push({
            label: bind.name,
            type: 'variable',
            detail: bind.description ? `${bind.dataType} — ${bind.description}` : bind.dataType,
            info: bind.description || '(绑定变量)',
            boost: 3,
          });
        }

        for (const req of metadata.requests) {
          options.push({
            label: req.name,
            type: 'variable',
            detail: req.description ? `${req.dataType} — ${req.description}` : req.dataType,
            info: req.description || '(请求参数)',
            boost: 3,
          });
        }
      }

      // 添加语言关键字片段
      for (const s of languageConfig.keywordSnippets) {
        options.push({ ...s });
      }

      if (options.length === 0) return null;

      return {
        from: chainMatch.from,
        options,
        validFor: /^[\w$]*$/,
      };
    } catch {
      return null; // 补全失败不影响编辑器
    }
  };
}

// ── 向后兼容的 Groovy 专用工厂 ──────────────────────────────

/**
 * 创建绑定到指定元数据的 Groovy 自动补全源
 * 同时提供元数据驱动的类型补全和 Groovy 常用语法补全
 *
 * @deprecated 请使用 `createCompletionSource(languageConfig, metadata)` 代替
 */
export function createGroovyCompletionSource(
  metadata: ScriptMetadata
): CompletionSource {
  return createCompletionSource(groovyConfig, metadata);
}

/**
 * 创建仅包含 Groovy 语法提示的补全源（无元数据时使用）
 *
 * @deprecated 请使用 `createCompletionSource(languageConfig)` 代替
 */
export function createGroovyKeywordSource(): CompletionSource {
  return createCompletionSource(groovyConfig);
}
