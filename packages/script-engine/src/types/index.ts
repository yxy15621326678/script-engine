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
  // 主函数名称
  mainMethod: string;
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
  /** 编译/测试脚本回调（后续接入 API） */
  onCompile?: (code: string) => void;
  /** 主题切换回调 */
  onThemeChange?: (theme: 'dark' | 'light') => void;
  /** 占位符 */
  placeholder?: string;
  /** 主题 */
  theme?: 'dark' | 'light';
  /** 标题（可选） */
  title?: string;
  /** 脚本元数据 — 提供后启用类型面板和自动补全 */
  metadata?: ScriptMetadata;
  /** 类型面板侧边栏默认是否展开（默认：提供 metadata 时为 true） */
  defaultSidebarOpen?: boolean;
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
