/** 自定义脚本标记 */
export const CUSTOM_SCRIPT = '@CUSTOM_SCRIPT';

/** 脚本标题标记 */
export const SCRIPT_TITLE = '@SCRIPT_TITLE';

/** 脚本元数据标记 */
export const SCRIPT_META = '@SCRIPT_META';

/**
 * 格式化选项接口
 */
export interface FormatOptions {
  /** 缩进大小（空格数） */
  indentSize?: number;
  /** 操作符周围添加空格 */
  addSpacesAroundOperators?: boolean;
  /** 格式化注释 */
  formatComments?: boolean;
  /** 最大行长度 */
  maxLineLength?: number;
  /** 保留空行 */
  preserveEmptyLines?: boolean;
}

/**
 * Groovy脚本格式化器
 */
export class GroovyFormatter {
  /**
   * 格式化Groovy脚本内容
   * @param script Groovy脚本内容
   * @returns 格式化后的脚本
   */
  static formatScript(script: string): string {
    if (!script || script.trim().length === 0) {
      return '';
    }

    let formatted = script;

    // 1. 基础trim处理
    formatted = formatted.trim();

    // 2. 统一换行符为\n
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 3. 去除多余空行（保留单个空行）
    formatted = formatted.replace(/\n\s*\n/g, '\n\n');

    // 4. 去除行尾空白
    const lines = formatted.split('\n');
    formatted = lines
      .map((line) => line.replace(/\s+$/, ''))
      .join('\n');

    // 5. 移除末尾多余的换行符
    formatted = formatted.replace(/\n+$/, '\n');

    // 6. 缩进规范化
    formatted = this.normalizeIndentation(formatted);

    return formatted;
  }

  /**
   * 规范化缩进
   */
  private static normalizeIndentation(script: string): string {
    const lines = script.split('\n');
    const result: string[] = [];
    let indentLevel = 0;
    let inMultilineString = false;
    let multilineStringDelimiter = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 跳过空行但保留空行
      if (trimmedLine.length === 0) {
        result.push('');
        continue;
      }

      // 处理多行字符串（Groovy支持'''和"""）
      if (!inMultilineString) {
        if (trimmedLine.includes("'''") || trimmedLine.includes('"""')) {
          const delimiter = trimmedLine.includes("'''") ? "'''" : '"""';
          const count = (trimmedLine.match(new RegExp(delimiter, 'g')) || []).length;

          if (count % 2 === 1) {
            inMultilineString = true;
            multilineStringDelimiter = delimiter;
          }
        }
      } else {
        // 检查多行字符串结束
        if (trimmedLine.includes(multilineStringDelimiter)) {
          const count = (trimmedLine.match(new RegExp(multilineStringDelimiter, 'g')) || []).length;
          if (count % 2 === 1) {
            inMultilineString = false;
            multilineStringDelimiter = '';
          }
        }
      }

      // 如果不是在多行字符串内，进行缩进调整
      if (!inMultilineString) {
        // 减少缩进的条件
        const shouldDecreaseIndent = this.shouldDecreaseIndent(trimmedLine);
        if (shouldDecreaseIndent) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // 添加当前行的缩进
        const indentation = '    '.repeat(indentLevel);

        // 增加缩进的条件
        if (this.shouldIncreaseIndent(trimmedLine)) {
          indentLevel++;
        }

        result.push(indentation + trimmedLine);
      } else {
        // 在多行字符串内，保持原样但保留基础缩进
        result.push(line);
      }
    }

    return result.join('\n');
  }

  /**
   * 判断是否需要增加缩进
   */
  private static shouldIncreaseIndent(line: string): boolean {
    const increasePatterns = [
      /.*\{\s*$/,
      /.*\(\s*$/,
      /.*\[\s*$/,
      /^if\s*\(.*\)\s*$/,
      /^for\s*\(.*\)\s*$/,
      /^while\s*\(.*\)\s*$/,
      /^switch\s*\(.*\)\s*$/,
      /^try\s*$/,
      /^catch\s*\(.*\)\s*$/,
      /^finally\s*$/,
      /^else\s*$/,
      /^else\s+if\s*\(.*\)\s*$/,
      /.*->\s*$/,
      /^def\s+\w+\s*=\s*\{/,
      /^class\s+\w+/,
      /^interface\s+\w+/,
      /^enum\s+\w+/,
      /^annotation\s+\w+/,
      /^trait\s+\w+/,
      /^static\s*\{/,
    ];

    return increasePatterns.some((pattern) => pattern.test(line));
  }

  /**
   * 判断是否需要减少缩进
   */
  private static shouldDecreaseIndent(line: string): boolean {
    const decreasePatterns = [
      /^\}/,
      /^\]/,
      /^\)/,
      /^else\b/,
      /^catch\b/,
      /^finally\b/,
      /^case\b/,
      /^default\s*:/,
    ];

    return decreasePatterns.some((pattern) => pattern.test(line));
  }

  /**
   * 增强版格式化：包含更多Groovy特定处理
   */
  static formatGroovyScript(script: string, options?: FormatOptions): string {
    if (!script || script.trim().length === 0) {
      return '';
    }

    const opts = {
      indentSize: 4,
      addSpacesAroundOperators: true,
      formatComments: true,
      ...options,
    };

    let formatted = script;

    // 1. 基础清理
    formatted = formatted.trim();
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 2. 格式化注释
    if (opts.formatComments) {
      formatted = this.formatComments(formatted);
    }

    // 3. 操作符周围添加空格
    if (opts.addSpacesAroundOperators) {
      formatted = this.addSpacesAroundOperators(formatted);
    }

    // 4. 逗号和分号后添加空格
    formatted = formatted.replace(/,(?!\s)/g, ', ');
    formatted = formatted.replace(/;(?!\s)/g, '; ');

    // 5. 去除多余空格
    formatted = formatted.replace(/\s+/g, ' ');

    // 6. 还原必要的换行
    const lines = formatted.split(';');
    if (lines.length > 1) {
      formatted = lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(';\n');
    }

    // 7. 应用缩进规范化
    formatted = this.normalizeIndentation(formatted);

    // 8. 特殊处理Groovy特定的语法
    formatted = this.formatGroovySpecific(formatted);

    return formatted;
  }

  /**
   * 格式化注释
   */
  private static formatComments(script: string): string {
    let formatted = script.replace(/\/\/\s*/g, '// ');
    formatted = formatted.replace(/\/\*(\s*)\*\//g, '/**$1*/');
    return formatted;
  }

  /**
   * 操作符周围添加空格
   */
  private static addSpacesAroundOperators(script: string): string {
    const operators = [
      '=', '==', '!=', '===', '!==',
      '>', '<', '>=', '<=',
      '+', '-', '*', '/', '%',
      '&&', '||', '&', '|', '^',
      '<<', '>>', '>>>',
      '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=',
    ];

    let formatted = script;

    operators.forEach((op) => {
      const regex = new RegExp(`(?<![\\'"\\\`])\\\\${op}(?![\\'"\\\`])`, 'g');
      formatted = formatted.replace(regex, ` ${op} `);
    });

    formatted = formatted.replace(/\s+/g, ' ');

    return formatted;
  }

  /**
   * 格式化Groovy特定语法
   */
  private static formatGroovySpecific(script: string): string {
    let formatted = script;

    // 1. 格式化GString（字符串插值）
    formatted = formatted.replace(/\$\{(\s*)(\w+)(\s*)\}/g, '${$2}');

    // 2. 格式化闭包语法
    formatted = formatted.replace(/\{(\s*)(\w+)(\s*)->/g, '{ $2 ->');

    // 3. 格式化列表和映射
    formatted = formatted.replace(/\[(\s*)(\w+)(\s*):/g, '[$2:');

    // 4. 格式化注解
    formatted = formatted.replace(/@(\w+)\((\s*)(\w+)(\s*)=/g, '@$1($3=');

    // 5. 格式化安全导航操作符
    formatted = formatted.replace(/(\w+)(\s*)\?\.(\s*)(\w+)/g, '$1?.$4');

    // 6. 格式化展开操作符
    formatted = formatted.replace(/(\w+)(\s*)\*\.(\s*)(\w+)/g, '$1*.$4');

    return formatted;
  }

  /**
   * 压缩脚本（移除所有非必要空白）
   */
  static minifyScript(script: string): string {
    if (!script || script.trim().length === 0) {
      return '';
    }

    let minified = script;

    // 移除注释
    minified = minified.replace(/\/\/.*$/gm, '');
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

    // 移除多余空白
    minified = minified.replace(/\s+/g, ' ');

    // 移除不必要的空格
    minified = minified.replace(/\s*([{}();,=+\-*/%&|<>!])\s*/g, '$1');

    // 移除空行
    minified = minified.replace(/\n\s*\n/g, '\n');

    return minified.trim();
  }
}

/**
 * Groovy脚本转换器工具类，提供一些通用的脚本处理方法
 */
export class GroovyScriptConvertorUtil {
  /**
   * 判断脚本是否包含自定义注释标记
   */
  public static isCustomScript(script: string): boolean {
    if (!script) {
      return false;
    }
    return script.includes(CUSTOM_SCRIPT);
  }

  /**
   * 格式化脚本内容，去除多余空白等
   */
  public static formatScript(script: string): string {
    if (!script) {
      return '';
    }
    return GroovyFormatter.formatScript(script);
  }

  /**
   * 将普通脚本转换为包含自定义注释标记的脚本
   */
  public static toCustomScript(script: string): string {
    if (GroovyScriptConvertorUtil.isCustomScript(script)) {
      return GroovyFormatter.formatScript(script);
    }
    return GroovyFormatter.formatScript(`// ${CUSTOM_SCRIPT}\n${script}`);
  }

  /**
   * 获取脚本中的标题注释内容
   */
  public static getScriptTitle(script: string): string {
    if (!script) {
      return '';
    }
    const titleMatch = script.match(new RegExp(`//\\s*${SCRIPT_TITLE}\\s*(.+)`));
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return '';
  }

  /**
   * 更新脚本中的标题注释内容，如果不存在则添加
   */
  public static updateScriptTitle(script: string, title: string): string {
    const titleComment = `// ${SCRIPT_TITLE} ${title}`;
    if (GroovyScriptConvertorUtil.getScriptTitle(script)) {
      return script.replace(new RegExp(`//\\s*${SCRIPT_TITLE}\\s*.+`), titleComment);
    }
    return `${titleComment}\n${script}`;
  }

  /**
   * 获取脚本中的元数据
   */
  public static getScriptMeta(script: string): string {
    if (!script) {
      return '';
    }
    const titleMatch = script.match(new RegExp(`//\\s*${SCRIPT_META}\\s*(.+)`));
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return '';
  }

  /**
   * 更新脚本中的元数据内容，如果不存在则添加
   */
  public static updateScriptMeta(script: string, meta: string): string {
    const metaComment = `// ${SCRIPT_META} ${meta}`;
    if (GroovyScriptConvertorUtil.getScriptMeta(script)) {
      return script.replace(new RegExp(`//\\s*${SCRIPT_META}\\s*.+`), metaComment);
    }
    return `${metaComment}\n${script}`;
  }

  /**
   * 清除脚本中的注释
   */
  public static clearComments(script: string): string {
    if (!script) {
      return '';
    }
    return script.replace(/\/\/.*$/gm, '').trim();
  }

  /**
   * 提取脚本中的return表达式
   */
  public static getReturnScript(script: string): string {
    try {
      let result = GroovyScriptConvertorUtil.clearComments(script);
      const funcMatch = result.match(/def\s+run\s*\([^)]*\)\s*\{([\s\S]*)\}/);
      if (funcMatch) {
        result = funcMatch[1];
      }
      const returnMatch = result.match(/return\s+(.+?);?\s*$/m);
      if (returnMatch) {
        result = returnMatch[1].trim();
      } else {
        result = result.trim();
      }

      return result;
    } catch {
      return '';
    }
  }
}
