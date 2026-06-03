import type { LanguageConfig } from '../types';
import { groovyConfig } from './groovy';
import { javascriptConfig } from './javascript';

/** 内置语言配置注册表 */
export const BUILTIN_LANGUAGES: Record<string, LanguageConfig> = {
  groovy: groovyConfig,
  javascript: javascriptConfig,
};

/**
 * 解析语言配置
 *
 * 接受语言名（字符串）或自定义 LanguageConfig 对象，返回完整的 LanguageConfig。
 * 当传入字符串时，从内置注册表中查找；未找到则抛出错误。
 * 不传参时默认使用 Groovy 配置。
 *
 * @param language 语言名或自定义配置
 * @returns 解析后的完整语言配置
 * @throws 当传入的语言名不在内置注册表中时
 */
export function resolveLanguageConfig(
  language?: string | LanguageConfig
): LanguageConfig {
  if (language == null) {
    return BUILTIN_LANGUAGES.groovy;
  }

  if (typeof language === 'string') {
    const config = BUILTIN_LANGUAGES[language];
    if (!config) {
      throw new Error(
        `Unknown language "${language}". ` +
          `Available built-in languages: ${Object.keys(BUILTIN_LANGUAGES).join(', ')}. ` +
          `You can also pass a custom LanguageConfig object.`
      );
    }
    return config;
  }

  return language;
}

export { groovyConfig } from './groovy';
export { javascriptConfig } from './javascript';
