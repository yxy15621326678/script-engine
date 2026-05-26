import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ScriptMetadata } from '../types';
import type { ThemeColors } from './theme-colors';
import { SectionHeader } from './section-header';

export interface MainFunctionSectionProps {
  metadata: ScriptMetadata;
  colors: ThemeColors;
}

// ── Tooltip 定位：基于 fixed 坐标，避免被滚动容器裁剪 ──────────

interface TooltipPos {
  top: number;
  left: number;
  maxWidth: number;
  maxHeight: number;
}

const TOOLTIP_MARGIN = 6;
const TOOLTIP_MAX_WIDTH = 380;

function calcTooltipPos(
  anchorRect: DOMRect,
  tooltipEl: HTMLDivElement | null,
): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 优先显示在 anchor 下方，空间不足时翻到上方
  const tooltipH = tooltipEl?.scrollHeight ?? 200;
  const spaceBelow = vh - anchorRect.bottom - TOOLTIP_MARGIN;
  const spaceAbove = anchorRect.top - TOOLTIP_MARGIN;
  const placeBelow = spaceBelow >= Math.min(tooltipH, 260) || spaceBelow >= spaceAbove;

  const top = placeBelow
    ? anchorRect.bottom + TOOLTIP_MARGIN
    : Math.max(TOOLTIP_MARGIN, anchorRect.top - tooltipH - TOOLTIP_MARGIN);

  // 水平方向：以 anchor 左边为起点，超出右边界则左移
  let left = anchorRect.left;
  const maxRight = vw - TOOLTIP_MARGIN;
  if (left + TOOLTIP_MAX_WIDTH > maxRight) {
    left = Math.max(TOOLTIP_MARGIN, maxRight - TOOLTIP_MAX_WIDTH);
  }

  const maxWidth = Math.min(TOOLTIP_MAX_WIDTH, maxRight - left);
  const maxHeight = placeBelow ? spaceBelow - TOOLTIP_MARGIN : spaceAbove - TOOLTIP_MARGIN;

  return { top, left, maxWidth, maxHeight: Math.max(maxHeight, 80) };
}

// ── 组件 ──────────────────────────────────────────────────────

export const MainFunctionSection: React.FC<MainFunctionSectionProps> = ({ metadata, colors }) => {
  const [showTip, setShowTip] = useState(false);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos(calcTooltipPos(rect, tooltipRef.current));
  }, []);

  useEffect(() => {
    if (!showTip) return;
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [showTip, updatePos]);

  return (
    <div>
      <SectionHeader colors={colors} label="主函数" />
      <div style={{ padding: '4px 12px 4px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ color: colors.methodColor, fontSize: 11, flexShrink: 0 }}>
            &#402;
          </span>
          <span style={{ color: colors.text, fontWeight: 500 }}>
            {metadata.mainMethod}
          </span>
          {metadata.description && (
            <span
              ref={anchorRef}
              style={{ display: 'inline-flex', cursor: 'help', flexShrink: 0 }}
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: `1px solid ${colors.textSecondary}`,
                  color: colors.textSecondary,
                  fontSize: 10,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                ?
              </span>
            </span>
          )}
          <span style={{ color: colors.textSecondary, fontSize: 11 }}>
            ({metadata.requests.map((r) => `${r.name}: ${r.dataType}`).join(', ')})
          </span>
          {metadata.returnType && (
            <span style={{ color: colors.typeColor, fontSize: 11, marginLeft: 'auto' }}>
              → {metadata.returnType}
            </span>
          )}
        </div>
      </div>

      {/* Tooltip 渲染在 fixed 层，脱离滚动容器 */}
      {showTip && pos && metadata.description && (
        <div
          ref={tooltipRef}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            maxWidth: pos.maxWidth,
            maxHeight: pos.maxHeight,
            overflowY: 'auto',
            padding: '8px 12px',
            background: colors.headerBg,
            border: `1px solid ${colors.border}`,
            borderRadius: 6,
            color: colors.text,
            fontSize: 12,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
          }}
        >
          {metadata.description}
        </div>
      )}
    </div>
  );
};
