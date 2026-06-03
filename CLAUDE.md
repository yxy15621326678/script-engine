# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Script Engine 是一个基于 React + CodeMirror 6 的多语言脚本编辑器组件库，内置支持 Groovy 和 JavaScript，提供语法高亮、动态类型自动补全、属性面板等功能。发布为 npm 包 `@coding-script/script-engine`。

**用户全局规则**：使用中文回复。

## 常用命令

```bash
# 在 monorepo 根目录执行
pnpm run build:script-engine      # 构建库
pnpm run watch:script-engine      # 库 watch 模式（开发时常用）
pnpm run dev:app-pc               # 启动演示应用（http://localhost:3000）
pnpm run push:script-engine       # 构建并发布到 npm

# 在 packages/script-engine 目录执行
pnpm run build                    # 构建
pnpm run dev                      # watch 模式
pnpm run push                     # 构建 + publish --access public

# 在 apps/app-pc 目录执行
pnpm run dev                      # 启动开发服务器
pnpm run build                    # 生产构建
pnpm run preview                  # 预览生产构建

# 测试（Rstest + happy-dom，目前尚无测试文件）
pnpm run test                     # 运行测试
pnpm run test:watch               # watch 模式
```

## Monorepo 结构

```
pnpm-workspace.yaml: packages/** + apps/**

packages/script-engine/    → 库 @coding-script/script-engine (Rslib, ESM, unbundled)
apps/app-pc/               → 演示应用 @script-example/app-pc (Rsbuild + React, 依赖 antd 6)
```

库通过 `workspace:*` 被演示应用引用。**开发流程**：先在根目录运行 `watch:script-engine`，再运行 `dev:app-pc`。

## 源码目录结构

```
packages/script-engine/src/
├── components/               ← 所有 UI 子组件（每个组件一个文件）
│   ├── index.ts              ← barrel 导出
│   ├── theme-colors.ts       ← 共享配色 themes + ThemeColors + ensureScrollbarStyle
│   ├── toolbar.tsx           ← 工具栏（标题 + 脚本说明 + 主题切换 + 编译验证 + 全屏）
│   ├── toolbar-button.tsx    ← 工具栏按钮（通用）
│   ├── format-icon.tsx       ← 格式化按钮图标
│   ├── fullscreen-icon.tsx   ← 全屏按钮图标
│   ├── expand-sidebar-button.tsx  ← 展开侧边栏按钮
│   ├── drag-handle.tsx       ← 属性面板拖拽手柄
│   ├── panel-header.tsx      ← 属性面板头部
│   ├── section-header.tsx    ← 通用区块标题（支持 extra 插槽，复用 3 处）
│   ├── variable-row.tsx      ← 变量行（函数入参/绑定参数复用）
│   ├── field-row.tsx         ← 字段行
│   ├── function-row.tsx      ← 方法行
│   ├── type-section.tsx      ← 类型展开区块
│   ├── main-function-section.tsx  ← 主函数展示区（签名展示）
│   ├── variables-section.tsx ← 函数入参 + 绑定参数列表区（分两个 SectionHeader 展示）
│   └── data-types-section.tsx ← 数据类型列表区
├── autocomplete/             ← 自动补全逻辑
│   ├── index.ts
│   ├── completion-source.ts  ← CompletionSource 工厂函数（语言无关）
│   └── resolve.ts            ← 类型链解析工具函数
├── languages/                ← 多语言支持
│   ├── index.ts              ← 语言注册表 + resolveLanguageConfig()
│   ├── groovy.ts             ← Groovy LanguageConfig（21 snippets + java() 语法高亮）
│   └── javascript.ts         ← JavaScript LanguageConfig（22 snippets + javascript() 语法高亮）
├── type-panel/               ← 属性面板主组件
│   ├── index.ts
│   └── type-panel.tsx        ← TypePanel 主组件（拖拽/排序/布局）
├── utils/
│   └── groovy-formatter.ts   ← Groovy 代码格式化工具函数
├── types/
│   └── index.ts              ← 所有 TypeScript 接口（含 LanguageConfig）
├── script-code.tsx           ← ScriptCodeEditor 主组件（CM 配置 + 布局 + 多语言）
└── index.ts                  ← 库入口
```

**组件拆分原则**：每个子组件一个文件，导出组件和 Props 接口。`theme-colors.ts` 存放共享配色和全局样式注入函数。`SectionHeader` 支持 `extra?: ReactNode` 插槽用于在标题右侧放置操作按钮。

## 关键架构

### 库的构建配置 (`packages/script-engine/rslib.config.ts`)

- **`bundle: false`**：不打包，输出保持模块图结构（tree-shakeable）
- **`format: 'esm'`**：仅 ESM
- **`dts: true`**：生成 `.d.ts` 类型声明
- 路径别名 `@/` → `src/`（在 tsconfig 和 rslib.config 中都要配置）

### CodeMirror 6 编辑器 (`src/script-code.tsx`)

核心设计原则：**用 `Compartment` 热更新，避免重建编辑器**。

编辑器只在首次挂载和布局属性（`fontSize`/`minHeight`/`maxHeight`/`placeholder`/`readonly`）变化时重建。以下内容通过 Compartment 热更新：

- `languageCompartmentRef`：语言切换 → `languageConfig.extension()`
- `themeCompartmentRef`：主题（dark/light）切换 → `buildThemeExtensions(theme)`
- `autocompleteCompartmentRef`：metadata 或语言变化 → `buildAutocompleteExt(languageConfig, metadata)`

**绝对不要**把 `theme`、`metadata`、`value`、`language` 放到编辑器创建的 useEffect 依赖数组中，否则会丢失用户已编辑的代码内容。

`onChangeRef` / `metadataRef` 使用 ref 持有回调，避免闭包过期。

`language` prop 支持字符串（内置语言名）或自定义 `LanguageConfig` 对象，通过 `resolveLanguageConfig()` 解析。Groovy 使用 `@codemirror/lang-java` 进行语法高亮（CodeMirror 6 没有官方 Groovy 语言包），JavaScript 使用 `@codemirror/lang-javascript`。

### 自动补全 (`src/autocomplete/`)

- `resolve.ts`：纯函数，解析点号链到具体类型
  - `resolveVariableType(name, metadata)` → 在 binds/requests 中查找变量
  - `resolveMemberType(typeName, memberName, metadata)` → 在类型的 fields/functions 中查找成员
  - `resolveChainType(parts, metadata)` → 解析完整链 `["request", "test"]` → `MyTest` 类型
  - `MAX_DEPTH = 20` 防止循环引用
- `completion-source.ts`：
  - `createCompletionSource(languageConfig, metadata?)`：语言无关的补全源工厂，接受语言配置和可选的 metadata
  - `createGroovyCompletionSource(metadata)` / `createGroovyKeywordSource()`：向后兼容的 Groovy 专用包装（已标记 deprecated）
  - 通过 `syntaxTree(context.state).resolveInner()` 检测字符串/注释位置，抑制补全（节点名从 `languageConfig.syntaxNodeNames` 读取）
  - 外层 `try/catch` 保证补全失败不崩溃编辑器
  - 语法片段用 `snippet()` API（来自 `@codemirror/autocomplete`）实现 tab-stop 占位符，片段定义在各语言的 `LanguageConfig.keywordSnippets` 中

### 属性面板 (`src/type-panel/`)

纯 React 组件，**不依赖 Ant Design**（antd 仅在演示应用中使用）。

- 使用 CSS-in-JS（React `style` 对象）+ 主题配色 map（来自 `components/theme-colors.ts`）
- `TypePanel` 固定高度（`minHeight`/`maxHeight` 由编辑器传入），内部可滚动
- **宽度可拖拽调节**：拖拽状态由 TypePanel 内部管理，但宽度值（`panelWidth`）由 `ScriptCodeEditor` 持有（提升状态），确保折叠后重新展开时宽度保持
- 滚动条样式通过 `<style>` 标签一次性注入 DOM（`ensureScrollbarStyle()`，在 `theme-colors.ts` 中）
- 展示 metadata 中**所有**类型（包括 Integer/String 等基础类型）
- 滚动容器必须设置 `minHeight: 0`（flex 布局关键修复）
- 所有列表按 name 字母序排序（`localeCompare`）
- **变量区域拆分为两个独立 SectionHeader**："函数入参"（`sortedRequests`）和"绑定参数"（`sortedBinds`），各自为空时不显示

### 多语言支持 (`src/languages/`)

核心抽象是 `LanguageConfig` 接口（定义在 `types/index.ts`），封装一个编程语言在编辑器中所需的全部差异点：

```ts
interface LanguageConfig {
  name: string                    // 语言标识（小写），如 'groovy'
  displayName: string             // 显示名称，如 'Groovy'
  extension: () => Extension      // CodeMirror 语言扩展工厂
  keywordSnippets: readonly Completion[]  // 关键字/语法片段
  syntaxNodeNames: {              // AST 节点名（用于 isInStringOrComment 判断）
    stringNodes: string[]         // 如 Java: ['StringLiteral'], JS: ['String', 'TemplateString']
    commentNodes: string[]        // 如 ['LineComment', 'BlockComment']
  }
  placeholder?: string            // 默认占位符
  formatter?: FormatFn            // 可选内置格式化器
}
```

- `languages/index.ts`：`BUILTIN_LANGUAGES` 注册表 + `resolveLanguageConfig(language?)` 辅助函数
  - 接受字符串（内置语言名）或自定义 `LanguageConfig` 对象
  - 不传参时默认返回 Groovy 配置
  - 未知语言名时抛出错误
- `languages/groovy.ts`：21 个 Groovy snippets（`def`/`each`/`collect` 等），使用 `java()` 语法高亮，内置 `GroovyFormatter`
- `languages/javascript.ts`：22 个 JS snippets（`function`/`const`/`=>`/`class` 等），使用 `javascript()` 语法高亮，无内置 formatter

**消费者扩展新语言**：导入对应的 `@codemirror/lang-*` 包 + 提供自定义 `LanguageConfig` 对象即可，无需修改库代码。

**格式化优先级**：`onFormat` prop > `languageConfig.formatter`。两者都不存在时不显示格式化按钮。

### ScriptMetadata Schema (`src/types/index.ts`)

核心领域模型，描述脚本运行时的可用类型：

```ts
ScriptMetadata {
  mainMethod?: string             // 主函数名（如 "run"，可选）
  description?: string            // 脚本说明（可选，显示在工具栏"脚本说明"按钮弹框中）
  binds: ScriptBindInfo[]         // 注入变量，如 $request（name 含 $ 前缀）
  requests: ScriptRequestInfo[]   // 主函数参数（函数入参），如 request
  returnType?: string             // 主函数返回类型
  types: Record<string, ScriptTypeInfo>  // 所有可用类型（含基础类型）
}

ScriptTypeInfo { dataType, description?, fields[], functions[] }
ScriptFieldInfo { dataType, description?, name }
ScriptFunctionInfo { name, parameters[], description?, returnType? }
ScriptBindInfo { dataType, name, description? }
ScriptRequestInfo { dataType, name, description? }
ScriptParameterInfo { dataType, name, description? }
```

`metadata` 是动态的（不同脚本有不同 schema），但结构固定。`metadata` 必须是**解析后的对象**（不能是 JSON 字符串），否则面板无数据。

### 工具栏脚本说明 (`src/components/toolbar.tsx`)

当 `metadata.description` 存在时，工具栏显示"脚本说明"按钮（带问号图标）：

- 点击切换弹框显示/隐藏（非 hover 触发，便于复制内容）
- 弹框使用 `fixed` 定位 + `calcTooltipPos()` 智能翻转（与属性面板 tooltip 共享定位逻辑）
- 描述内容按 `\n` 分行渲染，自动识别 `key: value` 格式并高亮 key（使用 `colors.accent`）
- `description` 消失时自动关闭弹框并重置位置
- 兼容字面 `\n` 和真实换行符（通过 `.replace(/\\n/g, '\n')` 处理）

## 类型导出

`src/index.ts` 导出组件、类型和语言配置：
```ts
export * from "./script-code";
export * from "./types";
export { GroovyFormatter, GroovyScriptConvertorUtil } from "./utils/groovy-formatter";
export type { FormatOptions } from "./utils/groovy-formatter";
export { BUILTIN_LANGUAGES, resolveLanguageConfig, groovyConfig, javascriptConfig } from "./languages";
```

消费者通过 `import type { ScriptMetadata, LanguageConfig, FormatFn } from '@coding-script/script-engine'` 导入类型。`components/` 和 `type-panel/` 内部模块不在顶层导出（属于实现细节）。

## 主题

`dark` 和 `light` 两套配色。编辑器主题、自动补全弹窗主题、属性面板主题三者必须同步切换：

- 编辑器：`oneDark` + 自定义 `darkHighlightStyle`
- 弹窗：`buildThemeExtensions()` 中注入 `EditorView.theme()`
- 属性面板：`themes[theme]` 配色 map（在 `components/theme-colors.ts` 中）

## 发布

发布到 npm 的 `@coding-script/script-engine` scope，使用 `--access public`。
- 构建后产物在 `packages/script-engine/dist/`
- 仅发布 `dist/` 目录（`package.json` 中 `files: ["dist"]`）
