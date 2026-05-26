import React from 'react';
import { ToolbarButton } from './toolbar-button';

// 锤子图标（编译/构建）
const HammerIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    {/* 锤头（倾斜） */}
    <rect
      x="3"
      y="6"
      width="12"
      height="5"
      rx="1"
      fill={color}
      transform="rotate(-25 9 8.5)"
    />
    {/* 锤柄 */}
    <rect
      x="11"
      y="9"
      width="2.5"
      height="11"
      rx="1"
      fill={color}
      opacity={0.8}
      transform="rotate(-25 12.25 14.5)"
    />
  </svg>
);

export interface ToolbarProps {
  title?: string;
  theme: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  onCompile?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  theme,
  onThemeChange,
  onCompile,
}) => {
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#434343' : '#d9d9d9';
  const toolbarBg = isDark ? '#282c34' : '#fafafa';
  const toolbarText = isDark ? '#abb2bf' : '#333';
  const btnBg = isDark ? '#2c313a' : '#f0f0f0';
  const btnHoverBg = isDark ? '#3e4451' : '#e0e0e0';

  const handleThemeToggle = () => {
    const next = isDark ? 'light' : 'dark';
    onThemeChange?.(next);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        backgroundColor: toolbarBg,
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: '6px 6px 0 0',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 13,
      }}
    >
      {title && (
        <span
          style={{
            color: toolbarText,
            fontWeight: 600,
            marginRight: 'auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
      )}
      {!title && <span style={{ marginRight: 'auto' }} />}

      <ToolbarButton
        label={isDark ? '🌞 浅色模式' : '🌙 深色模式'}
        title={isDark ? '切换到浅色主题' : '切换到深色主题'}
        bg={btnBg}
        hoverBg={btnHoverBg}
        color={toolbarText}
        border={borderColor}
        onClick={handleThemeToggle}
      />

      {onCompile && (
        <ToolbarButton
          label={
            <>
              <HammerIcon color={isDark ? '#98c379' : '#389e0d'} />
              编译验证
            </>
          }
          title="编译并验证脚本"
          bg={isDark ? '#2d5a27' : '#e6f4e5'}
          hoverBg={isDark ? '#3a7033' : '#d4ecd3'}
          color={isDark ? '#98c379' : '#389e0d'}
          border={isDark ? '#2d5a27' : '#b7eb8f'}
          onClick={onCompile}
        />
      )}
    </div>
  );
};
