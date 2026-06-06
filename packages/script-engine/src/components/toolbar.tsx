import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToolbarButton } from './toolbar-button';
import { FormatIcon } from './format-icon';
import { MaximizeIcon, MinimizeIcon } from './fullscreen-icon';
import type { ToolbarItem } from '../types';
import { themes, ensureScrollbarStyle } from './theme-colors';

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

// ── Tooltip 定位 ─────────────────────────────────────────────────

interface TooltipPos {
  top: number;
  left: number;
  maxWidth: number;
  maxHeight: number;
}

const TIP_MARGIN = 6;
const TIP_MAX_WIDTH = 380;

function calcTooltipPos(anchorRect: DOMRect, el: HTMLDivElement | null): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tipH = el?.scrollHeight ?? 200;
  const spaceBelow = vh - anchorRect.bottom - TIP_MARGIN;
  const spaceAbove = anchorRect.top - TIP_MARGIN;
  const placeBelow = spaceBelow >= Math.min(tipH, 260) || spaceBelow >= spaceAbove;

  const top = placeBelow
    ? anchorRect.bottom + TIP_MARGIN
    : Math.max(TIP_MARGIN, anchorRect.top - tipH - TIP_MARGIN);

  let left = anchorRect.left;
  const maxRight = vw - TIP_MARGIN;
  if (left + TIP_MAX_WIDTH > maxRight) {
    left = Math.max(TIP_MARGIN, maxRight - TIP_MAX_WIDTH);
  }

  const maxWidth = Math.min(TIP_MAX_WIDTH, maxRight - left);
  const maxHeight = placeBelow ? spaceBelow - TIP_MARGIN : spaceAbove - TIP_MARGIN;
  return { top, left, maxWidth, maxHeight: Math.max(maxHeight, 80) };
}


// ── 问号图标 ─────────────────────────────────────────────────────

const QuestionIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ── Props ────────────────────────────────────────────────────────

export interface ToolbarProps {
  title?: string;
  theme: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  enableThemeToggle?: boolean;
  enableFormat?: boolean;
  onFormat?: () => void;
  enableCompile?: boolean;
  onCompile?: () => void;
  enableFullscreen?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  toolbar?: ToolbarItem[];
  toolbarExtra?: React.ReactNode;
  /** 脚本说明内容（有值时显示"脚本说明"按钮） */
  description?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  theme,
  onThemeChange,
  enableThemeToggle,
  enableFormat,
  onFormat,
  enableCompile,
  onCompile,
  enableFullscreen,
  isFullscreen,
  onToggleFullscreen,
  toolbar,
  toolbarExtra,
  description,
}) => {
  const isDark = theme === 'dark';
  const colors = themes[theme];
  const borderColor = isDark ? '#434343' : '#d9d9d9';
  const toolbarBg = isDark ? '#282c34' : '#fafafa';
  const toolbarText = isDark ? '#abb2bf' : '#333';
  const btnBg = isDark ? '#2c313a' : '#f0f0f0';
  const btnHoverBg = isDark ? '#3e4451' : '#e0e0e0';

  // ── 脚本说明弹框状态 ──
  const [showDesc, setShowDesc] = useState(false);
  const [tipPos, setTipPos] = useState<TooltipPos | null>(null);
  const descBtnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const updateTipPos = useCallback(() => {
    if (!descBtnRef.current) return;
    setTipPos(calcTooltipPos(descBtnRef.current.getBoundingClientRect(), tipRef.current));
  }, []);

  useEffect(() => {
    if (!showDesc) return;
    ensureScrollbarStyle();
    updateTipPos();
    window.addEventListener('scroll', updateTipPos, true);
    window.addEventListener('resize', updateTipPos);
    return () => {
      window.removeEventListener('scroll', updateTipPos, true);
      window.removeEventListener('resize', updateTipPos);
    };
  }, [showDesc, updateTipPos]);

  // 关闭弹框时重置位置
  useEffect(() => {
    if (!showDesc) setTipPos(null);
  }, [showDesc]);

  // description 消失时自动关闭弹框
  useEffect(() => {
    if (!description) setShowDesc(false);
  }, [description]);

  const descHtml = description
    ? description.replace(/\\n/g, '\n').replace(/\n/g, '<br>')
    : '';

  const handleThemeToggle = () => {
    const next = isDark ? 'light' : 'dark';
    onThemeChange?.(next);
  };

  return (
    <div
      className="script-editor-toolbar"
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
          className="script-editor-toolbar-title"
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
      {!title && <span className="script-editor-toolbar-title" style={{ marginRight: 'auto' }} />}


      {/* 脚本说明按钮 */}
      {descHtml && (
        <ToolbarButton
          ref={descBtnRef}
          label={
            <>
              <QuestionIcon color="currentColor" />
              脚本说明
            </>
          }
          title={showDesc ? '隐藏脚本说明' : '查看脚本说明'}
          backgroundColor={isDark ? '#2d5a27' : '#e6f4e5'}
          hoverBackgroundColor={isDark ? '#3a7033' : '#d4ecd3'}
          textColor={isDark ? '#98c379' : '#389e0d'}
          borderColor={isDark ? '#2d5a27' : '#b7eb8f'}
          active={showDesc}
          onClick={() => setShowDesc((v) => !v)}
        />
      )}
      
      {enableThemeToggle && (
        <ToolbarButton
          label={isDark ? '🌞 浅色模式' : '🌙 深色模式'}
          title={isDark ? '切换到浅色主题' : '切换到深色主题'}
          backgroundColor={btnBg}
          hoverBackgroundColor={btnHoverBg}
          textColor={toolbarText}
          borderColor={borderColor}
          onClick={handleThemeToggle}
        />
      )}

      {enableFormat && onFormat && (
        <ToolbarButton
          label={
            <>
              <FormatIcon color={isDark ? '#61afef' : '#1677ff'} />
              格式化
            </>
          }
          title="格式化代码"
          backgroundColor={isDark ? '#1e3a5f' : '#e6f4ff'}
          hoverBackgroundColor={isDark ? '#264a73' : '#bae0ff'}
          textColor={isDark ? '#61afef' : '#1677ff'}
          borderColor={isDark ? '#1e3a5f' : '#91caff'}
          onClick={onFormat}
        />
      )}

      {enableCompile && onCompile && (
        <ToolbarButton
          label={
            <>
              <HammerIcon color={isDark ? '#98c379' : '#389e0d'} />
              编译验证
            </>
          }
          title="编译并验证脚本"
          backgroundColor={isDark ? '#2d5a27' : '#e6f4e5'}
          hoverBackgroundColor={isDark ? '#3a7033' : '#d4ecd3'}
          textColor={isDark ? '#98c379' : '#389e0d'}
          borderColor={isDark ? '#2d5a27' : '#b7eb8f'}
          onClick={onCompile}
        />
      )}

      {enableFullscreen && (
        <ToolbarButton
          label={
            <>
              {isFullscreen ? (
                <MinimizeIcon color={isDark ? '#c678dd' : '#722ed1'} />
              ) : (
                <MaximizeIcon color={isDark ? '#c678dd' : '#722ed1'} />
              )}
              {isFullscreen ? '退出全屏' : '全屏模式'}
            </>
          }
          title={isFullscreen ? '退出全屏（ESC）' : '全屏显示'}
          backgroundColor={isDark ? '#3a2d5a' : '#f3e8ff'}
          hoverBackgroundColor={isDark ? '#4a3d6a' : '#e9d5ff'}
          textColor={isDark ? '#c678dd' : '#722ed1'}
          borderColor={isDark ? '#3a2d5a' : '#d3adf7'}
          onClick={() => onToggleFullscreen?.()}
        />
      )}


      {/* 自定义工具栏按钮列表 */}
      {toolbar?.map((item) => (
        <ToolbarButton
          key={item.key}
          label={item.label}
          title={item.title}
          backgroundColor={item.backgroundColor}
          hoverBackgroundColor={item.hoverBackgroundColor}
          textColor={item.textColor}
          borderColor={item.borderColor}
          onClick={item.onClick}
        />
      ))}

      {/* 自定义工具栏内容 */}
      {toolbarExtra}

      {/* 脚本说明 Tooltip（fixed 定位，脱离滚动容器） */}
      {showDesc && tipPos && descHtml && (
        <div
          ref={tipRef}
          className="se-desc-tip"
          style={{
            position: 'fixed',
            top: tipPos.top,
            left: tipPos.left,
            maxWidth: tipPos.maxWidth,
            maxHeight: tipPos.maxHeight,
            overflowY: 'auto',
            padding: '10px 14px',
            background: colors.headerBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            color: colors.text,
            fontSize: 12,
            lineHeight: 1.5,
            wordBreak: 'break-word',
            zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: descHtml }}
        />
      )}
    </div>
  );
};
