[![npm](https://img.shields.io/npm/v/@coding-script/script-engine.svg)](https://www.npmjs.com/package/@coding-script/script-engine)
# Script Engine

基于 React + CodeMirror 6 的多语言脚本编辑器组件库，内置支持 Groovy 和 JavaScript，提供语法高亮、动态类型自动补全、属性面板等功能。

## 功能特性

- **多语言支持**：内置 Groovy 和 JavaScript 语言支持，支持通过 `LanguageConfig` 扩展任意语言
- **语法高亮**：基于 CodeMirror 6，通过 `@codemirror/lang-*` 系列包提供各语言的语法着色
- **动态类型自动补全**：基于 `ScriptMetadata` 提供变量名补全和点号链式访问补全（如 `request.test.name`）
- **语言语法提示**：内置各语言的常用语法片段（`if`/`for`/`while`/`return` 等），支持 tab-stop 占位符
- **代码格式化**：Groovy 内置格式化器，也可通过 `onFormat` 自定义格式化逻辑
- **属性面板**：右侧侧边栏展示主函数签名、函数入参、绑定参数、数据类型（字段和方法），支持折叠/展开和拖拽调节宽度
- **脚本说明**：工具栏"脚本说明"按钮，点击展开/收起脚本描述弹框，支持多行文本和 `key: value` 格式高亮
- **主题切换**：暗色/亮色两套主题，编辑器、补全弹窗、属性面板同步切换，编辑器内部管理主题状态
- **全屏模式**：支持 CSS 全屏（`position: fixed` 覆盖视口），不影响编辑器内容
- **自定义工具栏**：通过 `toolbarExtra` 传入任意 React 节点
- **热更新**：主题、语言和 metadata 变化时通过 Compartment 热更新，不重建编辑器，不丢失用户输入

## 安装

```bash
npm install @coding-script/script-engine
# 或
pnpm add @coding-script/script-engine
```

## 基础用法

```tsx
import { ScriptCodeEditor } from '@coding-script/script-engine';
import type { ScriptMetadata } from '@coding-script/script-engine';

const metadata: ScriptMetadata = {
  mainMethod: 'run',
  description: '脚本主入口，接收请求参数并返回执行结果状态码',
  returnType: 'Integer',
  binds: [
    { dataType: 'GroovyBindObject', name: '$request' },
  ],
  requests: [
    { dataType: 'MyScriptRequest', description: '请求参数', name: 'request' },
  ],
  types: {
    MyScriptRequest: {
      dataType: 'MyScriptRequest',
      description: '请求参数类型',
      fields: [
        { dataType: 'int', description: '总数量', name: 'count' },
        { dataType: 'MyTest', description: '测试对象', name: 'test' },
      ],
      functions: [
        {
          name: 'isSupport',
          description: '是否匹配',
          parameters: [{ dataType: 'int', description: '数量', name: 'count' }],
        },
      ],
    },
    MyTest: {
      dataType: 'MyTest',
      description: '测试对象',
      fields: [
        { dataType: 'Long', description: 'id', name: 'id' },
        { dataType: 'String', description: '名称', name: 'name' },
      ],
      functions: [],
    },
    Integer: { dataType: 'Integer', fields: [], functions: [] },
    String: { dataType: 'String', fields: [], functions: [] },
    Long: { dataType: 'Long', fields: [], functions: [] },
    int: { dataType: 'int', fields: [], functions: [] },
  },
};

function App() {
  return (
    <ScriptCodeEditor
      value="def run(request){\n    return request.count;\n}\n"
      title="Groovy 脚本编辑器"
      language="groovy"
      defaultTheme="dark"
      metadata={metadata}
      enableThemeToggle
      enableFormat
      enableCompile
      enableFullscreen
      onThemeChange={(theme) => console.log('主题切换:', theme)}
      onChange={(code) => console.log('代码变化:', code)}
      onCompile={(code) => console.log('编译验证:', code)}
      options={{ minHeight: 400, maxHeight: 500 }}
    />
  );
}
```

### JavaScript 用法

```tsx
import { ScriptCodeEditor } from '@coding-script/script-engine';

function App() {
  return (
    <ScriptCodeEditor
      value="function run(request) {\n    return request.count;\n}\n"
      title="JavaScript 脚本编辑器"
      language="javascript"
      defaultTheme="dark"
      metadata={metadata}
      enableThemeToggle
      enableFormat
      enableCompile
      enableFullscreen
      onFormat={() => {
        // JavaScript 无内置格式化器，需自行提供
        // 例如使用 prettier
      }}
    />
  );
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `value` | `string` | `undefined` | 代码内容 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `onChange` | `(value: string) => void` | `undefined` | 代码变化回调 |
| `language` | `string \| LanguageConfig` | `'groovy'` | 编程语言配置，支持内置语言名或自定义配置 |
| `placeholder` | `string` | 由语言配置决定 | 空内容占位符（覆盖语言默认值） |
| `defaultTheme` | `'dark' \| 'light'` | `'dark'` | 初始主题，编辑器内部管理状态 |
| `onThemeChange` | `(theme: 'dark' \| 'light') => void` | `undefined` | 主题切换通知回调 |
| `title` | `string` | `undefined` | 工具栏标题 |
| `metadata` | `ScriptMetadata` | `undefined` | 脚本元数据，提供后启用属性面板和自动补全 |
| `defaultSidebarOpen` | `boolean` | `metadata != null` | 属性面板默认是否展开 |

### 工具栏按钮控制

所有工具栏按钮默认**禁用**，需通过 `enable*` 标志显式开启：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `enableThemeToggle` | `boolean` | `false` | 是否显示主题切换按钮 |
| `enableFormat` | `boolean` | `false` | 是否显示格式化按钮（需配合 `onFormat` 或 `language.formatter`） |
| `enableCompile` | `boolean` | `false` | 是否显示编译验证按钮（需配合 `onCompile`） |
| `enableFullscreen` | `boolean` | `false` | 是否显示全屏按钮 |

### 按钮回调

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `onFormat` | `() => void` | `undefined` | 格式化代码回调（优先级高于 `language.formatter`） |
| `onCompile` | `(code: string) => void` | `undefined` | 编译/测试脚本回调 |

### 自定义工具栏

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `toolbar` | `ToolbarItem[]` | `undefined` | 工具栏自定义按钮列表，渲染在内置按钮之后、`toolbarExtra` 之前 |
| `toolbarExtra` | `React.ReactNode` | `undefined` | 工具栏额外内容，渲染在最后，可传入任意 JSX |

`ToolbarItem` 类型：

```typescript
interface ToolbarItem {
  key: string;           // 唯一标识
  label: ReactNode;      // 按钮内容
  title: string;         // 鼠标悬停提示
  backgroundColor: string;
  hoverBackgroundColor: string;
  textColor: string;
  borderColor: string;
  onClick: () => void;
}
```

**使用按钮列表：**

```tsx
<ScriptCodeEditor
  toolbar={[
    {
      key: 'save',
      label: '💾 保存',
      title: '保存脚本',
      backgroundColor: '#007bff',
      hoverBackgroundColor: '#0056b3',
      textColor: '#fff',
      borderColor: '#007bff',
      onClick: () => saveCode(),
    },
  ]}
/>
```

**使用自定义内容：**

```tsx
<ScriptCodeEditor
  toolbarExtra={
    <>
      <button onClick={save}>💾 保存</button>
      <button onClick={help}>❓ 帮助</button>
    </>
  }
/>
```

### 布局选项

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `options.fontSize` | `number` | `14` | 字体大小（px） |
| `options.minHeight` | `number` | `300` | 编辑器最小高度（px） |
| `options.maxHeight` | `number` | `300` | 编辑器最大高度（px） |

## ScriptMetadata 数据结构

```typescript
interface ScriptMetadata {
  /** 主函数名称（可选） */
  mainMethod?: string;
  /** 脚本说明（可选，提供后在工具栏显示"脚本说明"按钮，点击展开/收起描述弹框） */
  description?: string;
  /** 注入变量（如 $request，name 含 $ 前缀） */
  binds: ScriptBindInfo[];
  /** 主函数参数 */
  requests: ScriptRequestInfo[];
  /** 主函数返回类型（可选） */
  returnType?: string;
  /** 所有可用类型定义（含基础类型如 Integer/String） */
  types: Record<string, ScriptTypeInfo>;
}

interface ScriptTypeInfo {
  dataType: string;
  description?: string;
  fields: ScriptFieldInfo[];
  functions: ScriptFunctionInfo[];
}

interface ScriptFieldInfo {
  name: string;
  dataType: string;
  description?: string;
}

interface ScriptFunctionInfo {
  name: string;
  parameters: ScriptParameterInfo[];
  description?: string;
  returnType?: string;
}

interface ScriptParameterInfo {
  name: string;
  dataType: string;
  description?: string;
}

interface ScriptBindInfo {
  name: string;
  dataType: string;
  description?: string;
}

interface ScriptRequestInfo {
  name: string;
  dataType: string;
  description?: string;
}
```

> **注意**：`metadata` 必须是解析后的 JavaScript 对象，不能是 JSON 字符串。如果从 API 获取的是 JSON 字符串，需要先 `JSON.parse()` 再传入。

## 多语言支持

### 内置语言

组件内置支持以下语言：

| 语言名 | 语法高亮 | 语法片段 | 内置格式化器 |
|---|---|---|---|
| `'groovy'` | `@codemirror/lang-java` | 21 个（`if`/`for`/`def`/`each`/`collect` 等） | ✅ `GroovyFormatter` |
| `'javascript'` | `@codemirror/lang-javascript` | 22 个（`if`/`for`/`function`/`=>`/`class` 等） | ❌（可通过 `onFormat` 提供） |

使用内置语言只需传入语言名：

```tsx
<ScriptCodeEditor language="groovy" />
<ScriptCodeEditor language="javascript" />
```

### 自定义语言扩展

通过传入 `LanguageConfig` 对象可以支持任意语言：

```tsx
import { python } from '@codemirror/lang-python';

const PYTHON_SNIPPETS = [
  { label: 'def', type: 'keyword', apply: snippet('def ${name}(${params}):\n\t${}\n') },
  { label: 'class', type: 'keyword', apply: snippet('class ${ClassName}:\n\tdef __init__(self):\n\t\t${}\n') },
  { label: 'if', type: 'keyword', apply: snippet('if ${condition}:\n\t${}\n') },
  { label: 'for', type: 'keyword', apply: snippet('for ${item} in ${iterable}:\n\t${}\n') },
  { label: 'print', type: 'keyword', apply: snippet('print(${})') },
  { label: 'return', type: 'keyword', apply: snippet('return ${}') },
  // ... 更多语法片段
];

<ScriptCodeEditor
  language={{
    name: 'python',
    displayName: 'Python',
    extension: () => python(),
    keywordSnippets: PYTHON_SNIPPETS,
    syntaxNodeNames: {
      stringNodes: ['String'],
      commentNodes: ['LineComment', 'BlockComment'],
    },
    placeholder: '请输入 Python 脚本...',
    formatter: (code) => customPythonFormatter(code),
  }}
/>
```

### LanguageConfig 类型定义

```typescript
interface LanguageConfig {
  /** 语言标识名（小写） */
  name: string;
  /** 显示名称 */
  displayName: string;
  /** CodeMirror 语言扩展工厂 */
  extension: () => Extension;
  /** 关键字和语法片段列表 */
  keywordSnippets: readonly Completion[];
  /** 语法树节点名（用于判断字符串/注释位置，抑制自动补全） */
  syntaxNodeNames: {
    /** 字符串类节点名 */
    stringNodes: string[];
    /** 注释类节点名 */
    commentNodes: string[];
  };
  /** 默认占位符文本（可选） */
  placeholder?: string;
  /** 内置格式化函数（可选，优先级低于 onFormat prop） */
  formatter?: (code: string) => string;
}
```

### 语言切换热更新

语言切换时通过 Compartment 热更新，不重建编辑器，不丢失用户已输入的内容。

## 自动补全

提供 metadata 后，编辑器支持以下补全能力：

| 输入 | 补全内容 |
|---|---|
| `re` | 弹出 `request`、`$request` 等变量 |
| `request.` | 弹出 `count`、`test`、`isSupport` 等字段和方法 |
| `request.test.` | 弹出 `id`、`name` 等链式访问成员 |
| `if` / `for` / `while` | 弹出当前语言的语法片段（含 tab-stop 占位符） |

不提供 metadata 时，仅启用当前语言的关键字和语法片段补全。

> 补全不会在字符串和注释内触发（通过各语言的语法树节点名判断）。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动库 watch 模式（终端 1）
pnpm run watch:script-engine

# 启动演示应用（终端 2）
pnpm run dev:app-pc
```

演示应用访问 http://localhost:3000

## 技术栈

- **编辑器**：[CodeMirror 6](https://codemirror.net/)（`@codemirror/view`、`state`、`autocomplete`、`lang-java`、`lang-javascript`、`theme-one-dark`）
- **构建工具**：[Rslib](https://rslib.rs/)（库）+ [Rsbuild](https://rsbuild.dev/)（演示应用）
- **包管理**：pnpm monorepo（workspaces）
- **UI**：纯 CSS-in-JS（React `style` 对象），库本身不依赖 Ant Design

## License

Apache-2.0 license
