[![npm](https://img.shields.io/npm/v/@coding-script/script-engine.svg)](https://www.npmjs.com/package/@coding-script/script-engine)
# Script Engine

基于 React + CodeMirror 6 的 Groovy 脚本编辑器组件库，提供语法高亮、动态类型自动补全、属性面板等功能。

## 功能特性

- **Groovy 语法高亮**：基于 CodeMirror 6，支持完整的 Groovy/Java 语法着色
- **动态类型自动补全**：基于 `ScriptMetadata` 提供变量名补全和点号链式访问补全（如 `request.test.name`）
- **Groovy 语法提示**：内置 `if`/`for`/`while`/`println`/`return` 等常用 Groovy 语法片段
- **代码格式化**：内置 Groovy 格式化器，也可通过 `onFormat` 自定义格式化逻辑
- **属性面板**：右侧侧边栏展示主函数签名、变量、数据类型（字段和方法），支持折叠/展开和拖拽调节宽度
- **主题切换**：暗色/亮色两套主题，编辑器、补全弹窗、属性面板同步切换，编辑器内部管理主题状态
- **全屏模式**：支持 CSS 全屏（`position: fixed` 覆盖视口），不影响编辑器内容
- **自定义工具栏**：通过 `toolbarExtra` 传入任意 React 节点
- **热更新**：主题和 metadata 变化时通过 Compartment 热更新，不重建编辑器，不丢失用户输入

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

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `value` | `string` | `undefined` | 代码内容 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `onChange` | `(value: string) => void` | `undefined` | 代码变化回调 |
| `placeholder` | `string` | `'请输入 Groovy 脚本...'` | 空内容占位符 |
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
| `enableFormat` | `boolean` | `false` | 是否显示格式化按钮（需配合 `onFormat`） |
| `enableCompile` | `boolean` | `false` | 是否显示编译验证按钮（需配合 `onCompile`） |
| `enableFullscreen` | `boolean` | `false` | 是否显示全屏按钮 |

### 按钮回调

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `onFormat` | `() => void` | `undefined` | 格式化代码回调（不提供时使用内置 Groovy 格式化器） |
| `onCompile` | `(code: string) => void` | `undefined` | 编译/测试脚本回调 |

### 自定义工具栏

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `toolbarExtra` | `React.ReactNode` | `undefined` | 工具栏额外内容，渲染在内置按钮之后，可传入任意 JSX |

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
  /** 主函数描述信息（可选，提供后在属性面板主函数名旁显示悬浮提示） */
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

## 自动补全

提供 metadata 后，编辑器支持以下补全能力：

| 输入 | 补全内容 |
|---|---|
| `re` | 弹出 `request`、`$request` 等变量 |
| `request.` | 弹出 `count`、`test`、`isSupport` 等字段和方法 |
| `request.test.` | 弹出 `id`、`name` 等链式访问成员 |
| `if` / `for` / `while` | 弹出 Groovy 语法片段（含 tab-stop 占位符） |

不提供 metadata 时，仅启用 Groovy 关键字和语法片段补全。

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

- **编辑器**：[CodeMirror 6](https://codemirror.net/)（`@codemirror/view`、`state`、`autocomplete`、`lang-java`、`theme-one-dark`）
- **构建工具**：[Rslib](https://rslib.rs/)（库）+ [Rsbuild](https://rsbuild.dev/)（演示应用）
- **包管理**：pnpm monorepo（workspaces）
- **UI**：纯 CSS-in-JS（React `style` 对象），库本身不依赖 Ant Design

## License

Apache-2.0 license
