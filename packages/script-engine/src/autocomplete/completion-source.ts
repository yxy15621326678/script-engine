import {
  type Completion,
  type CompletionContext,
  type CompletionResult,
  type CompletionSource,
  snippet,
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import type { ScriptMetadata, ScriptTypeInfo } from '../types';
import { resolveChainType } from './resolve';

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
 * 检查光标是否在字符串或注释中
 */
function isInStringOrComment(context: CompletionContext): boolean {
  const node = syntaxTree(context.state).resolveInner(context.pos, -1);
  const name = node.name;
  return (
    name === 'String' ||
    name === 'StringLiteral' ||
    name === 'LineComment' ||
    name === 'BlockComment' ||
    name === 'CharLiteral'
  );
}

// ── Groovy 常用语法片段 ──────────────────────────────────────

interface GroovySnippet {
  label: string;
  detail: string;
  info: string;
  snippet: string;
  boost: number;
}

const GROOVY_SNIPPETS: GroovySnippet[] = [
  {
    label: 'if',
    detail: '条件语句',
    info: '如果条件为真则执行代码块',
    snippet: 'if (${condition}) {\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'else',
    detail: '否则分支',
    info: '条件为假时执行的代码块',
    snippet: 'else {\n\t${}\n}',
    boost: -2,
  },
  {
    label: 'for',
    detail: '循环语句',
    info: '遍历集合或范围',
    snippet: 'for (${item} in ${collection}) {\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'while',
    detail: '循环语句',
    info: '当条件为真时循环执行',
    snippet: 'while (${condition}) {\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'switch',
    detail: '分支语句',
    info: '多条件分支选择',
    snippet: 'switch (${expression}) {\n\tcase ${value}:\n\t\t${}\n\t\tbreak\n\tdefault:\n\t\tbreak\n}',
    boost: -1,
  },
  {
    label: 'try',
    detail: '异常捕获',
    info: '尝试执行代码并捕获异常',
    snippet: 'try {\n\t${}\n} catch (${Exception} e) {\n\t\n}',
    boost: -1,
  },
  {
    label: 'def',
    detail: '变量/函数定义',
    info: '定义变量或函数',
    snippet: 'def ${name}',
    boost: -1,
  },
  {
    label: 'println',
    detail: '打印输出',
    info: '输出到控制台并换行',
    snippet: 'println(${})',
    boost: 0,
  },
  {
    label: 'print',
    detail: '打印输出',
    info: '输出到控制台不换行',
    snippet: 'print(${})',
    boost: -1,
  },
  {
    label: 'return',
    detail: '返回值',
    info: '从函数中返回结果',
    snippet: 'return ${}',
    boost: 0,
  },
  {
    label: 'each',
    detail: '遍历闭包',
    info: '遍历集合中的每个元素',
    snippet: 'each { ${item} ->\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'collect',
    detail: '转换闭包',
    info: '将集合元素转换为新集合',
    snippet: 'collect { ${item} ->\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'find',
    detail: '查找闭包',
    info: '查找集合中第一个匹配的元素',
    snippet: 'find { ${item} ->\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'findAll',
    detail: '查找全部',
    info: '查找集合中所有匹配的元素',
    snippet: 'findAll { ${item} ->\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'inject',
    detail: '累加闭包',
    info: '对集合进行累加操作',
    snippet: 'inject(${initial}) { ${acc}, ${item} ->\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'assert',
    detail: '断言',
    info: '验证条件是否为真',
    snippet: 'assert ${condition}',
    boost: -1,
  },
  {
    label: 'new',
    detail: '创建实例',
    info: '创建新的对象实例',
    snippet: 'new ${ClassName}(${})',
    boost: -1,
  },
  {
    label: 'class',
    detail: '类定义',
    info: '定义一个新的类',
    snippet: 'class ${ClassName} {\n\t${}\n}',
    boost: -1,
  },
  {
    label: 'interface',
    detail: '接口定义',
    info: '定义一个新的接口',
    snippet: 'interface ${InterfaceName} {\n\t${}\n}',
    boost: -2,
  },
  {
    label: 'throw',
    detail: '抛出异常',
    info: '抛出一个异常对象',
    snippet: 'throw new ${Exception}("${}")',
    boost: -1,
  },
  {
    label: 'import',
    detail: '导入',
    info: '导入外部类或包',
    snippet: 'import ${}',
    boost: -2,
  },
];

/**
 * 创建绑定到指定元数据的 Groovy 自动补全源
 * 同时提供元数据驱动的类型补全和 Groovy 常用语法补全
 */
export function createGroovyCompletionSource(
  metadata: ScriptMetadata
): CompletionSource {
  return function groovyCompletionSource(
    context: CompletionContext
  ): CompletionResult | null {
    try {
      // 在字符串/注释中不触发补全
      if (isInStringOrComment(context)) return null;

      // 匹配点号链（如 "request.test."）或简单单词（如 "re"）
      const chainMatch = context.matchBefore(/[\w$]+(?:\.[\w$]+)*\.|[\w$]+/);
      if (!chainMatch) return null;

      const hasDot = chainMatch.text.includes('.');
      const parts = chainMatch.text.split('.');
      const isDotAccess = hasDot && parts.length >= 2;

      if (isDotAccess) {
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

      // ── 非点号访问：元数据变量 + Groovy 语法 ──────────
      const options: Completion[] = [];

      // 添加元数据中的变量
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

      // 添加 Groovy 常用语法（按已输入的前缀过滤）
      const prefix = chainMatch.text.toLowerCase();
      for (const s of GROOVY_SNIPPETS) {
        if (s.label.toLowerCase().startsWith(prefix) || prefix === '') {
          options.push({
            label: s.label,
            type: 'keyword',
            detail: s.detail,
            info: s.info,
            apply: snippet(s.snippet),
            boost: s.boost,
          });
        }
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

/**
 * 创建仅包含 Groovy 语法提示的补全源（无元数据时使用）
 */
export function createGroovyKeywordSource(): CompletionSource {
  return function groovyKeywordSource(
    context: CompletionContext
  ): CompletionResult | null {
    try {
      if (isInStringOrComment(context)) return null;

      const match = context.matchBefore(/[\w$]+/);
      if (!match) return null;

      const prefix = match.text.toLowerCase();
      const options: Completion[] = [];

      for (const s of GROOVY_SNIPPETS) {
        if (s.label.toLowerCase().startsWith(prefix) || prefix === '') {
          options.push({
            label: s.label,
            type: 'keyword',
            detail: s.detail,
            info: s.info,
            apply: snippet(s.snippet),
            boost: s.boost,
          });
        }
      }

      if (options.length === 0) return null;

      return {
        from: match.from,
        options,
        validFor: /^[\w$]*$/,
      };
    } catch {
      return null;
    }
  };
}
