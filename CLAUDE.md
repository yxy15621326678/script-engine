# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Script Engine 是一个基于 React + CodeMirror 6 的 Groovy 脚本编辑器组件库，提供语法高亮、动态类型自动补全、属性面板等功能。发布为 npm 包 `@coding-script/script-engine`。

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
│   ├── toolbar.tsx           ← 工具栏（标题 + 主题切换 + 编译验证）
│   ├── toolbar-button.tsx    ← 工具栏按钮（通用）
│   ├── expand-sidebar-button.tsx  ← 展开侧边栏按钮
│   ├── drag-handle.tsx       ← 属性面板拖拽手柄
│   ├── panel-header.tsx      ← 属性面板头部
│   ├── section-header.tsx    ← 通用区块标题（复用 3 处）
│   ├── variable-row.tsx      ← 变量行（binds/requests 复用）
│   ├── field-row.tsx         ← 字段行
│   ├── function-row.tsx      ← 方法行
│   ├── type-section.tsx      ← 类型展开区块
│   ├── main-function-section.tsx  ← 主函数展示区
│   ├── variables-section.tsx ← 变量列表区
│   └── data-types-section.tsx ← 数据类型列表区
├── autocomplete/             ← 自动补全逻辑
│   ├── index.ts
│   ├── completion-source.ts  ← CompletionSource 工厂函数
│   └── resolve.ts            ← 类型链解析工具函数
├── type-panel/               ← 属性面板主组件
│   ├── index.ts
│   └── type-panel.tsx        ← TypePanel 主组件（拖拽/排序/布局）
├── types/
│   └── index.ts              ← 所有 TypeScript 接口
├── script-code.tsx           ← ScriptCodeEditor 主组件（CM 配置 + 布局）
└── index.ts                  ← 库入口
```

**组件拆分原则**：每个子组件一个文件，导出组件和 Props 接口。`theme-colors.ts` 存放共享配色和全局样式注入函数。

## 关键架构

### 库的构建配置 (`packages/script-engine/rslib.config.ts`)

- **`bundle: false`**：不打包，输出保持模块图结构（tree-shakeable）
- **`format: 'esm'`**：仅 ESM
- **`dts: true`**：生成 `.d.ts` 类型声明
- 路径别名 `@/` → `src/`（在 tsconfig 和 rslib.config 中都要配置）

### CodeMirror 6 编辑器 (`src/script-code.tsx`)

核心设计原则：**用 `Compartment` 热更新，避免重建编辑器**。

编辑器只在首次挂载和布局属性（`fontSize`/`minHeight`/`maxHeight`/`placeholder`/`readonly`）变化时重建。以下内容通过 Compartment 热更新：

- `themeCompartmentRef`：主题（dark/light）切换 → `buildThemeExtensions(theme)`
- `autocompleteCompartmentRef`：metadata 变化 → `buildAutocompleteExt(metadata)`

**绝对不要**把 `theme`、`metadata`、`value` 放到编辑器创建的 useEffect 依赖数组中，否则会丢失用户已编辑的代码内容。

`onChangeRef` / `metadataRef` 使用 ref 持有回调，避免闭包过期。

`@codemirror/lang-java` 保留用于 Groovy 语法高亮（CodeMirror 6 没有官方 Groovy 语言包）。

### 自动补全 (`src/autocomplete/`)

- `resolve.ts`：纯函数，解析点号链到具体类型
  - `resolveVariableType(name, metadata)` → 在 binds/requests 中查找变量
  - `resolveMemberType(typeName, memberName, metadata)` → 在类型的 fields/functions 中查找成员
  - `resolveChainType(parts, metadata)` → 解析完整链 `["request", "test"]` → `MyTest` 类型
  - `MAX_DEPTH = 20` 防止循环引用
- `completion-source.ts`：
  - `createGroovyCompletionSource(metadata)`：metadata 驱动 + Groovy 语法（有 metadata 时使用）
  - `createGroovyKeywordSource()`：仅 Groovy 语法（无 metadata 时使用）
  - 通过 `syntaxTree(context.state).resolveInner()` 检测字符串/注释位置，抑制补全
  - 外层 `try/catch` 保证补全失败不崩溃编辑器
  - Groovy 语法片段用 `snippet()` API（来自 `@codemirror/autocomplete`）实现 tab-stop 占位符

### 属性面板 (`src/type-panel/`)

纯 React 组件，**不依赖 Ant Design**（antd 仅在演示应用中使用）。

- 使用 CSS-in-JS（React `style` 对象）+ 主题配色 map（来自 `components/theme-colors.ts`）
- `TypePanel` 固定高度（`minHeight`/`maxHeight` 由编辑器传入），内部可滚动
- **宽度可拖拽调节**：拖拽状态由 TypePanel 内部管理，但宽度值（`panelWidth`）由 `ScriptCodeEditor` 持有（提升状态），确保折叠后重新展开时宽度保持
- 滚动条样式通过 `<style>` 标签一次性注入 DOM（`ensureScrollbarStyle()`，在 `theme-colors.ts` 中）
- 展示 metadata 中**所有**类型（包括 Integer/String 等基础类型）
- 滚动容器必须设置 `minHeight: 0`（flex 布局关键修复）
- 所有列表按 name 字母序排序（`localeCompare`）

### ScriptMetadata Schema (`src/types/index.ts`)

核心领域模型，描述脚本运行时的可用类型：

```ts
ScriptMetadata {
  mainMethod: string              // 主函数名（如 "run"）
  binds: ScriptBindInfo[]         // 注入变量，如 $request（name 含 $ 前缀）
  requests: ScriptRequestInfo[]   // 主函数参数，如 request
  returnType?: string             // 主函数返回类型
  types: Record<string, ScriptTypeInfo>  // 所有可用类型（含基础类型）
}

ScriptTypeInfo { dataType, description?, fields[], functions[] }
ScriptFieldInfo { dataType, description?, name }
ScriptFunctionInfo { name, parameters[], description?, returnType? }
```

`metadata` 是动态的（不同脚本有不同 schema），但结构固定。`metadata` 必须是**解析后的对象**（不能是 JSON 字符串），否则面板无数据。

## 类型导出

`src/index.ts` 必须同时导出组件和类型：
```ts
export * from "./script-code";
export * from "./types";
```

消费者通过 `import type { ScriptMetadata } from '@coding-script/script-engine'` 导入类型。`components/` 和 `type-panel/` 内部模块不在顶层导出（属于实现细节）。

## 主题

`dark` 和 `light` 两套配色。编辑器主题、自动补全弹窗主题、属性面板主题三者必须同步切换：

- 编辑器：`oneDark` + 自定义 `darkHighlightStyle`
- 弹窗：`buildThemeExtensions()` 中注入 `EditorView.theme()`
- 属性面板：`themes[theme]` 配色 map（在 `components/theme-colors.ts` 中）

## 发布

发布到 npm 的 `@coding-script/script-engine` scope，使用 `--access public`。
- 构建后产物在 `packages/script-engine/dist/`
- 仅发布 `dist/` 目录（`package.json` 中 `files: ["dist"]`）
