import { snippet, type Completion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import type { LanguageConfig } from '../types';

/** JavaScript 语法片段 */
const JAVASCRIPT_SNIPPETS: readonly Completion[] = [
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
    apply: snippet('for (let ${i} = 0; ${i} < ${length}; ${i}++) {\n\t${}\n}'),
  },
  {
    label: 'for...of',
    type: 'keyword',
    boost: -1,
    apply: snippet('for (const ${item} of ${array}) {\n\t${}\n}'),
  },
  {
    label: 'for...in',
    type: 'keyword',
    boost: -1,
    apply: snippet('for (const ${key} in ${object}) {\n\t${}\n}'),
  },
  {
    label: 'while',
    type: 'keyword',
    boost: -1,
    apply: snippet('while (${condition}) {\n\t${}\n}'),
  },
  {
    label: 'function',
    type: 'keyword',
    boost: -1,
    apply: snippet('function ${name}(${params}) {\n\t${}\n}'),
  },
  {
    label: 'const',
    type: 'keyword',
    boost: -1,
    apply: snippet('const ${name} = ${}'),
  },
  {
    label: 'let',
    type: 'keyword',
    boost: -1,
    apply: snippet('let ${name} = ${}'),
  },
  {
    label: '=>',
    type: 'keyword',
    boost: -1,
    apply: snippet('(${params}) => {\n\t${}\n}'),
  },
  {
    label: 'class',
    type: 'keyword',
    boost: -1,
    apply: snippet('class ${ClassName} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}'),
  },
  {
    label: 'try',
    type: 'keyword',
    boost: -1,
    apply: snippet('try {\n\t${}\n} catch (${error}) {\n\t\n}'),
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
    label: 'return',
    type: 'keyword',
    boost: 0,
    apply: snippet('return ${}'),
  },
  {
    label: 'import',
    type: 'keyword',
    boost: -2,
    apply: snippet("import { ${} } from '${module}'"),
  },
  {
    label: 'export',
    type: 'keyword',
    boost: -2,
    apply: snippet('export ${}'),
  },
  {
    label: 'async',
    type: 'keyword',
    boost: -1,
    apply: snippet('async function ${name}(${params}) {\n\t${}\n}'),
  },
  {
    label: 'await',
    type: 'keyword',
    boost: -1,
    apply: snippet('await ${}'),
  },
  {
    label: 'new',
    type: 'keyword',
    boost: -1,
    apply: snippet('new ${ClassName}(${})'),
  },
  {
    label: 'throw',
    type: 'keyword',
    boost: -1,
    apply: snippet('throw new ${Error}("${}")'),
  },
  {
    label: 'console.log',
    type: 'keyword',
    boost: 0,
    apply: snippet('console.log(${})'),
  },
  {
    label: 'Promise',
    type: 'keyword',
    boost: -1,
    apply: snippet('new Promise((${resolve}, ${reject}) => {\n\t${}\n})'),
  },
];

/** JavaScript 语言配置 */
export const javascriptConfig: LanguageConfig = {
  name: 'javascript',
  displayName: 'JavaScript',
  extension: () => javascript(),
  keywordSnippets: JAVASCRIPT_SNIPPETS,
  syntaxNodeNames: {
    stringNodes: ['String', 'TemplateString', 'RegExp'],
    commentNodes: ['LineComment', 'BlockComment'],
  },
  placeholder: '请输入 JavaScript 脚本...',
};
