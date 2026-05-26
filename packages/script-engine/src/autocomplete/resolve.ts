import type { ScriptMetadata, ScriptTypeInfo } from '../types';

/**
 * 在 binds/requests 中查找变量名，返回其 dataType
 */
export function resolveVariableType(
  name: string,
  metadata: ScriptMetadata
): string | null {
  const bind = metadata.binds.find((b) => b.name === name);
  if (bind) return bind.dataType;

  const req = metadata.requests.find((r) => r.name === name);
  if (req) return req.dataType;

  return null;
}

/**
 * 在指定类型的 fields/functions 中查找成员，返回其 dataType
 */
export function resolveMemberType(
  typeName: string,
  memberName: string,
  metadata: ScriptMetadata
): string | null {
  const typeInfo = metadata.types[typeName];
  if (!typeInfo) return null;

  const field = typeInfo.fields.find((f) => f.name === memberName);
  if (field) return field.dataType;

  const func = typeInfo.functions.find((f) => f.name === memberName);
  if (func?.returnType) return func.returnType;

  return null;
}

/**
 * 解析完整的点号链（如 ["request", "test"]）到最终类型
 * 第一个元素是变量名，后续元素是成员访问
 * 使用 MAX_DEPTH 防止循环引用
 */
export function resolveChainType(
  parts: string[],
  metadata: ScriptMetadata
): ScriptTypeInfo | null {
  if (parts.length === 0) return null;

  let currentTypeName = resolveVariableType(parts[0], metadata);
  if (!currentTypeName) return null;

  const MAX_DEPTH = 20;
  for (let i = 1; i < parts.length && i < MAX_DEPTH; i++) {
    const nextType = resolveMemberType(currentTypeName, parts[i], metadata);
    if (!nextType) return null;
    currentTypeName = nextType;
  }

  return metadata.types[currentTypeName] ?? null;
}
