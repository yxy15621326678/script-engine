import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { ScriptMetadata } from '../types';
import {
  themes,
  SCROLL_CLASS,
  ensureScrollbarStyle,
} from '../components/theme-colors';
import { DragHandle } from '../components/drag-handle';
import { PanelHeader } from '../components/panel-header';
import { MainFunctionSection } from '../components/main-function-section';
import { VariablesSection } from '../components/variables-section';
import { DataTypesSection } from '../components/data-types-section';

export interface TypePanelProps {
  metadata: ScriptMetadata;
  theme: 'dark' | 'light';
  minHeight?: number;
  maxHeight?: number;
  width: number;
  onWidthChange: (width: number) => void;
  onCollapse: () => void;
}

// ── 宽度约束 ──────────────────────────────────────────────────

const DEFAULT_WIDTH = 300;
const MIN_WIDTH = 180;
const MAX_WIDTH = 600;

// ── 主组件 ──────────────────────────────────────────────────

export const TypePanel: React.FC<TypePanelProps> = ({
  metadata,
  theme,
  minHeight,
  maxHeight,
  width,
  onWidthChange,
  onCollapse,
}) => {
  const colors = themes[theme];
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // ── 拖拽调节宽度 ────────────────────────────────────────────
  const [dragging, setDragging] = useState(false);
  const [handleHovered, setHandleHovered] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    ensureScrollbarStyle();
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const delta = dragStartXRef.current - e.clientX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidthRef.current + delta));
      onWidthChange(next);
    };

    const onMouseUp = () => {
      setDragging(false);
      document.body.classList.remove('se-panel-resizing');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onWidthChange]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = width;
    setDragging(true);
    document.body.classList.add('se-panel-resizing');
  }, [width]);

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

  // 所有类型按名称字母序排序
  const allTypes = useMemo(
    () => Object.values(metadata.types).sort((a, b) => a.dataType.localeCompare(b.dataType)),
    [metadata.types]
  );

  // 变量按名称字母序排序
  const sortedBinds = useMemo(
    () => [...metadata.binds].sort((a, b) => a.name.localeCompare(b.name)),
    [metadata.binds]
  );
  const sortedRequests = useMemo(
    () => [...metadata.requests].sort((a, b) => a.name.localeCompare(b.name)),
    [metadata.requests]
  );

  return (
    <div
      ref={panelRef}
      style={{
        width,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        minHeight: minHeight != null ? `${minHeight}px` : undefined,
        maxHeight: maxHeight != null ? `${maxHeight}px` : undefined,
        position: 'relative',
      }}
    >
      {/* 拖拽手柄 */}
      <DragHandle
        colors={colors}
        dragging={dragging}
        handleHovered={handleHovered}
        onMouseDown={onHandleMouseDown}
        onHoverChange={setHandleHovered}
      />

      {/* 面板主体 */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          borderLeft: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: colors.bg,
          color: colors.text,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 13,
        }}
      >
        {/* Header */}
        <PanelHeader colors={colors} onCollapse={onCollapse} />

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
          {/* 主函数信息 */}
          <MainFunctionSection metadata={metadata} colors={colors} />

          {/* 函数入参 + 绑定参数 */}
          <VariablesSection
            sortedBinds={sortedBinds}
            sortedRequests={sortedRequests}
            colors={colors}
          />

          {/* 类型定义区 */}
          <DataTypesSection
            allTypes={allTypes}
            expanded={expanded}
            onToggle={toggle}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
};
