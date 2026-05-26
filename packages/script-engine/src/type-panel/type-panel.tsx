import React, { useState, useCallback, useEffect, useRef } from 'react';
import type {
  ScriptMetadata,
  ScriptTypeInfo,
  ScriptFieldInfo,
  ScriptFunctionInfo,
} from '../types';

export interface TypePanelProps {
  metadata: ScriptMetadata;
  theme: 'dark' | 'light';
  minHeight: number;
  maxHeight: number;
  onCollapse: () => void;
}

// ── 主题配色 ──────────────────────────────────────────────────

const themes = {
  dark: {
    bg: '#21252b',
    text: '#abb2bf',
    textSecondary: '#7f848e',
    border: '#434343',
    hover: '#2c313a',
    accent: '#61afef',
    headerBg: '#282c34',
    variableBg: '#2c313a',
    fieldColor: '#61afef',
    methodColor: '#c678dd',
    typeColor: '#e5c07b',
    scrollThumb: '#4b5263',
  },
  light: {
    bg: '#ffffff',
    text: '#333333',
    textSecondary: '#888888',
    border: '#d9d9d9',
    hover: '#f0f0f0',
    accent: '#1677ff',
    headerBg: '#fafafa',
    variableBg: '#f5f5f5',
    fieldColor: '#1677ff',
    methodColor: '#722ed1',
    typeColor: '#d48806',
    scrollThumb: '#c1c1c1',
  },
} as const;

interface ThemeColors {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  accent: string;
  headerBg: string;
  variableBg: string;
  fieldColor: string;
  methodColor: string;
  typeColor: string;
  scrollThumb: string;
}

// ── 滚动条样式注入 ──────────────────────────────────────────

const SCROLL_CLASS = 'se-type-panel-scroll';
const STYLE_ID = 'script-engine-type-panel-style';

function ensureScrollbarStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${SCROLL_CLASS}::-webkit-scrollbar { width: 6px; }
    .${SCROLL_CLASS}::-webkit-scrollbar-thumb { background: #4b5263; border-radius: 3px; }
    .${SCROLL_CLASS}::-webkit-scrollbar-track { background: transparent; }
  `;
  document.head.appendChild(style);
}

// ── 子组件 ──────────────────────────────────────────────────

const FieldRow: React.FC<{
  field: ScriptFieldInfo;
  colors: ThemeColors;
}> = ({ field, colors }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        padding: '4px 12px 4px 28px',
        cursor: 'default',
        backgroundColor: hovered ? colors.hover : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={field.description ? `${field.name}: ${field.dataType} — ${field.description}` : `${field.name}: ${field.dataType}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <span style={{ color: colors.fieldColor, fontSize: 10, flexShrink: 0 }}>
          &#9671;
        </span>
        <span style={{ color: colors.text, fontWeight: 500 }}>{field.name}</span>
        <span style={{ color: colors.typeColor, fontSize: 11, marginLeft: 'auto' }}>
          {field.dataType}
        </span>
      </div>
      {field.description && (
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
          {field.description}
        </div>
      )}
    </div>
  );
};

const FunctionRow: React.FC<{
  func: ScriptFunctionInfo;
  colors: ThemeColors;
}> = ({ func, colors }) => {
  const [hovered, setHovered] = useState(false);
  const params = func.parameters.map((p) => `${p.name}: ${p.dataType}`).join(', ');
  const sig = `${func.name}(${params})`;
  return (
    <div
      style={{
        padding: '4px 12px 4px 28px',
        cursor: 'default',
        backgroundColor: hovered ? colors.hover : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={func.description ? `${sig} — ${func.description}` : sig}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <span style={{ color: colors.methodColor, fontSize: 11, flexShrink: 0 }}>
          &#402;
        </span>
        <span style={{ color: colors.text, fontWeight: 500 }}>{func.name}</span>
        <span style={{ color: colors.textSecondary, fontSize: 11 }}>
          ({params})
        </span>
      </div>
      {func.description && (
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
          {func.description}
        </div>
      )}
    </div>
  );
};

const TypeSection: React.FC<{
  typeInfo: ScriptTypeInfo;
  expanded: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}> = ({ typeInfo, expanded, onToggle, colors }) => {
  const [hovered, setHovered] = useState(false);
  const hasMembers = typeInfo.fields.length > 0 || typeInfo.functions.length > 0;

  return (
    <div>
      <div
        style={{
          padding: '5px 12px',
          cursor: hasMembers ? 'pointer' : 'default',
          userSelect: 'none',
          backgroundColor: hovered ? colors.hover : 'transparent',
        }}
        onClick={hasMembers ? onToggle : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={typeInfo.description || typeInfo.dataType}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ fontSize: 10, width: 12, textAlign: 'center', flexShrink: 0 }}>
            {hasMembers ? (expanded ? '▼' : '▶') : ''}
          </span>
          <span style={{ color: colors.typeColor, fontWeight: 600 }}>
            {typeInfo.dataType}
          </span>
        </div>
        {typeInfo.description && (
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 18 }}>
            {typeInfo.description}
          </div>
        )}
      </div>
      {expanded && (
        <div>
          {typeInfo.fields.map((field) => (
            <FieldRow key={field.name} field={field} colors={colors} />
          ))}
          {typeInfo.functions.map((func) => (
            <FunctionRow key={func.name} func={func} colors={colors} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── 主组件 ──────────────────────────────────────────────────

export const TypePanel: React.FC<TypePanelProps> = ({
  metadata,
  theme,
  minHeight,
  maxHeight,
  onCollapse,
}) => {
  const colors = themes[theme];
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureScrollbarStyle();
  }, []);

  const toggle = useCallback((typeName: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(typeName)) {
        next.delete(typeName);
      } else {
        next.add(typeName);
      }
      return next;
    });
  }, []);

  // 所有类型都展示
  const allTypes = Object.values(metadata.types);

  const [collapseHovered, setCollapseHovered] = useState(false);

  return (
    <div
      ref={panelRef}
      style={{
        width: 260,
        flexShrink: 0,
        borderLeft: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 13,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.headerBg,
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        <span>&#x1F4CB; 属性面板</span>
        <button
          onClick={onCollapse}
          onMouseEnter={() => setCollapseHovered(true)}
          onMouseLeave={() => setCollapseHovered(false)}
          style={{
            background: collapseHovered ? colors.hover : 'none',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: 14,
            padding: '2px 6px',
            borderRadius: 3,
            lineHeight: 1,
          }}
          title="收起属性面板"
        >
          &#x25B6;
        </button>
      </div>

      {/* 可滚动内容 */}
      <div
        className={SCROLL_CLASS}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
        }}
      >
        {/* 变量区 */}
        {(metadata.binds.length > 0 || metadata.requests.length > 0) && (
          <div>
            <div
              style={{
                padding: '6px 12px 4px',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: colors.textSecondary,
                fontWeight: 600,
              }}
            >
            变量
            </div>
            {metadata.binds.map((bind) => (
              <div
                key={bind.name}
                style={{
                  padding: '4px 12px 4px 20px',
                }}
                title={`${bind.name}: ${bind.dataType}${bind.description ? ` — ${bind.description}` : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ color: colors.accent, fontSize: 10 }}>&#9670;</span>
                  <span style={{ color: colors.text, fontWeight: 500 }}>{bind.name}</span>
                  <span style={{ color: colors.typeColor, marginLeft: 'auto', fontSize: 11 }}>
                    {bind.dataType}
                  </span>
                </div>
                {bind.description && (
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
                    {bind.description}
                  </div>
                )}
              </div>
            ))}
            {metadata.requests.map((req) => (
              <div
                key={req.name}
                style={{
                  padding: '4px 12px 4px 20px',
                }}
                title={`${req.name}: ${req.dataType}${req.description ? ` — ${req.description}` : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ color: colors.accent, fontSize: 10 }}>&#9670;</span>
                  <span style={{ color: colors.text, fontWeight: 500 }}>{req.name}</span>
                  <span style={{ color: colors.typeColor, marginLeft: 'auto', fontSize: 11 }}>
                    {req.dataType}
                  </span>
                </div>
                {req.description && (
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
                    {req.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 类型定义区 */}
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              padding: '6px 12px 4px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: colors.textSecondary,
              fontWeight: 600,
            }}
          >
            数据类型
          </div>
          {allTypes.length === 0 ? (
            <div
              style={{
                padding: '8px 20px',
                fontSize: 12,
                color: colors.textSecondary,
                fontStyle: 'italic',
              }}
            >
              暂无数据类型
            </div>
          ) : (
            allTypes.map((typeInfo) => (
              <TypeSection
                key={typeInfo.dataType}
                typeInfo={typeInfo}
                expanded={expanded.has(typeInfo.dataType)}
                onToggle={() => toggle(typeInfo.dataType)}
                colors={colors}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
