import { snippet, type Completion } from '@codemirror/autocomplete';
import { java } from '@codemirror/lang-java';
import type { LanguageConfig } from '../types';
import { GroovyFormatter } from '../utils/groovy-formatter';

/** Groovy 语法片段 */
const GROOVY_SNIPPETS: readonly Completion[] = [
  {
    label: 'if',
    type: 'keyword',
    boost: -1,
    apply: snippet('if (${condition}) {\n\t${}\n}'),
  },
  {
    label: 'else',
    type: 'keyword',
    boost: -2,
    apply: snippet('else {\n\t${}\n}'),
  },
  {
    label: 'for',
    type: 'keyword',
    boost: -1,
    apply: snippet('for (${item} in ${collection}) {\n\t${}\n}'),
  },
  {
    label: 'while',
    type: 'keyword',
    boost: -1,
    apply: snippet('while (${condition}) {\n\t${}\n}'),
  },
  {
    label: 'switch',
    type: 'keyword',
    boost: -1,
    apply: snippet(
      'switch (${expression}) {\n\tcase ${value}:\n\t\t${}\n\t\tbreak\n\tdefault:\n\t\tbreak\n}',
    ),
  },
  {
    label: 'try',
    type: 'keyword',
    boost: -1,
    apply: snippet('try {\n\t${}\n} catch (${Exception} e) {\n\t\n}'),
  },
  {
    label: 'def',
    type: 'keyword',
    boost: -1,
    apply: snippet('def ${name}'),
  },
  {
    label: 'println',
    type: 'keyword',
    boost: 0,
    apply: snippet('println(${})'),
  },
  {
    label: 'print',
    type: 'keyword',
    boost: -1,
    apply: snippet('print(${})'),
  },
  {
    label: 'return',
    type: 'keyword',
    boost: 0,
    apply: snippet('return ${}'),
  },
  {
    label: 'each',
    type: 'keyword',
    boost: -1,
    apply: snippet('each { ${item} ->\n\t${}\n}'),
  },
  {
    label: 'collect',
    type: 'keyword',
    boost: -1,
    apply: snippet('collect { ${item} ->\n\t${}\n}'),
  },
  {
    label: 'find',
    type: 'keyword',
    boost: -1,
    apply: snippet('find { ${item} ->\n\t${}\n}'),
  },
  {
    label: 'findAll',
    type: 'keyword',
    boost: -1,
    apply: snippet('findAll { ${item} ->\n\t${}\n}'),
  },
  {
    label: 'inject',
    type: 'keyword',
    boost: -1,
    apply: snippet('inject(${initial}) { ${acc}, ${item} ->\n\t${}\n}'),
  },
  {
    label: 'assert',
    type: 'keyword',
    boost: -1,
    apply: snippet('assert ${condition}'),
  },
  {
    label: 'new',
    type: 'keyword',
    boost: -1,
    apply: snippet('new ${ClassName}(${})'),
  },
  {
    label: 'class',
    type: 'keyword',
    boost: -1,
    apply: snippet('class ${ClassName} {\n\t${}\n}'),
  },
  {
    label: 'interface',
    type: 'keyword',
    boost: -2,
    apply: snippet('interface ${InterfaceName} {\n\t${}\n}'),
  },
  {
    label: 'throw',
    type: 'keyword',
    boost: -1,
    apply: snippet('throw new ${Exception}("${}")'),
  },
  {
    label: 'import',
    type: 'keyword',
    boost: -2,
    apply: snippet('import ${}'),
  },
];

/** Groovy 语言配置 */
export const groovyConfig: LanguageConfig = {
  name: 'groovy',
  displayName: 'Groovy',
  extension: () => java(),
  keywordSnippets: GROOVY_SNIPPETS,
  syntaxNodeNames: {
    stringNodes: ['StringLiteral', 'CharLiteral'],
    commentNodes: ['LineComment', 'BlockComment'],
  },
  placeholder: '请输入 Groovy 脚本...',
  formatter: (code: string) => GroovyFormatter.formatScript(code),
};
