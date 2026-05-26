import React from 'react';
import type { ThemeColors } from './theme-colors';

export interface DragHandleProps {
  colors: ThemeColors;
  dragging: boolean;
  handleHovered: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onHoverChange: (hovered: boolean) => void;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  colors,
  dragging,
  handleHovered,
  onMouseDown,
  onHoverChange,
}) => {
  const handleActiveColor = dragging || handleHovered ? colors.accent : colors.border;

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      style={{
        width: 5,
        flexShrink: 0,
        cursor: 'col-resize',
        position: 'relative',
        zIndex: 1,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title="拖动调节宽度"
    >
      {/* 视觉指示线 */}
      <div
        style={{
          width: 2,
          height: '100%',
          backgroundColor: handleActiveColor,
          opacity: dragging ? 1 : handleHovered ? 0.7 : 0,
          transition: dragging ? 'none' : 'opacity 0.15s, background-color 0.15s',
          borderRadius: 1,
        }}
      />
      {/* 扩大热区（透明，不影响视觉） */}
      <div
        style={{
          position: 'absolute',
          left: -3,
          right: -3,
          top: 0,
          bottom: 0,
        }}
      />
    </div>
  );
};
