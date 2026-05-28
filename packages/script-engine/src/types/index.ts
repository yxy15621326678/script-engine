import type React from 'react';

// ── 工具栏按钮 ────────────────────────────────────────────────

/** 工具栏按钮属性 */
export interface ToolbarButtonProps {
  /** 按钮内容（支持 ReactNode，可包含图标 + 文字） */
  label: React.ReactNode;
  /** 鼠标悬停提示文字（原生 title 属性） */
  title: string;
  /** 按钮背景色 */
  backgroundColor: string;
  /** 鼠标悬停时的背景色 */
  hoverBackgroundColor: string;
  /** 文字颜色 */
  textColor: string;
  /** 边框颜色 */
  borderColor: string;
  /** 点击回调 */
  onClick: () => void;
}

/** 工具栏自定义按钮项（用于 toolbar 数组） */
export interface ToolbarItem extends ToolbarButtonProps {
  /** 唯一标识（React key） */
  key: string;
}

// ── 脚本元数据 Schema ──────────────────────────────────────────

/** 函数参数信息 */
export interface ScriptParameterInfo {
  // 数据类型
  dataType: string;
  // 描述信息（可选）
  description?: string;
  // 参数名称
  name: string;
}

/** 函数/方法信息 */
export interface ScriptFunctionInfo {
  // 描述信息（可选）
  description?: string;
  // 函数名称
  name: string;
  // 参数列表
  parameters: ScriptParameterInfo[];
  // 返回类型（可选）
  returnType?: string;
}

/** 字段/属性信息 */
export interface ScriptFieldInfo {
  // 数据类型
  dataType: string;
  // 描述信息（可选）
  description?: string;
  // 字段名称
  name: string;
}

/** 类型定义 */
export interface ScriptTypeInfo {
  // 数据类型名称（如 MyScriptRequest）
  dataType: string;
  // 描述信息（可选）
  description?: string;
  // 字段列表
  fields: ScriptFieldInfo[];
  // 函数列表
  functions: ScriptFunctionInfo[];
}

/** 绑定变量信息（如 $request） */
export interface ScriptBindInfo {
  // 数据类型
  dataType: string;
  // 变量名称（如 $request）
  name: string;
  // 描述信息（可选）
  description?: string;
}

/** 请求参数信息（如 request） */
export interface ScriptRequestInfo {
  // 数据类型
  dataType: string;
  // 描述信息（可选）
  description?: string;
  // 参数名称
  name: string;
}

/** 脚本元数据顶层结构 */
export interface ScriptMetadata {
  // 绑定变量（如 $request）
  binds: ScriptBindInfo[];
  // 主函数参数（如 request）
  requests: ScriptRequestInfo[];
  // 脚本描述信息（可选）
  description?: string;
  // 主函数名称
  mainMethod?: string;
  // 主函数返回类型（可选）
  returnType?: string;
  // 数据类型定义
  types: Record<string, ScriptTypeInfo>;
}

// ── 编辑器 Props ──────────────────────────────────────────────

export interface ScriptCodeEditorProps {
  /** 代码内容 */
  value?: string;
  /** 是否只读 */
  readonly?: boolean;
  /** 代码变化回调 */
  onChange?: (value: string) => void;
  /** 占位符 */
  placeholder?: string;
  /** 初始主题（默认 'dark'），编辑器内部管理状态 */
  defaultTheme?: 'dark' | 'light';
  /** 主题切换通知回调（可选） */
  onThemeChange?: (theme: 'dark' | 'light') => void;
  /** 标题（可选） */
  title?: string;
  /** 脚本元数据 — 提供后启用类型面板和自动补全 */
  metadata?: ScriptMetadata;
  /** 类型面板侧边栏默认是否展开（默认：提供 metadata 时为 true） */
  defaultSidebarOpen?: boolean;

  // ── 工具栏按钮开关（全部默认 false） ─────────────────────
  /** 是否显示主题切换按钮（默认 false） */
  enableThemeToggle?: boolean;
  /** 是否显示格式化按钮（默认 false，需配合 onFormat 使用） */
  enableFormat?: boolean;
  /** 是否显示编译验证按钮（默认 false，需配合 onCompile 使用） */
  enableCompile?: boolean;
  /** 是否显示全屏按钮（默认 false） */
  enableFullscreen?: boolean;

  // ── 按钮回调 ─────────────────────────────────────────────
  /** 格式化代码回调（enableFormat 时需提供） */
  onFormat?: () => void;
  /** 编译/测试脚本回调（enableCompile 时需提供） */
  onCompile?: (code: string) => void;

  // ── 自定义工具栏内容 ──────────────────────────────────────
  /** 工具栏自定义按钮列表（渲染在内置按钮之后） */
  toolbar?: ToolbarItem[];
  /** 工具栏额外内容（渲染在内置按钮之后，任意 React 节点） */
  toolbarExtra?: React.ReactNode;

  /** 其他选项 */
  options?: {
    /** 字体大小 */
    fontSize?: number;
    /** 最小高度 */
    minHeight?: number;
    /** 最大高度 */
    maxHeight?: number;
  };
}
