import React from 'react';
import { forwardRef, useState } from 'react';
import type { ToolbarButtonProps } from '../types';

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(({
  label,
  title,
  backgroundColor,
  hoverBackgroundColor,
  textColor,
  borderColor,
  onClick,
  active,
}, ref) => {
  const [hovered, setHovered] = useState(false);
  const bg = active ? hoverBackgroundColor : (hovered ? hoverBackgroundColor : backgroundColor);
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        border: `1px solid ${borderColor}`,
        color: textColor,
        cursor: 'pointer',
        fontSize: 12,
        padding: '4px 10px',
        borderRadius: 4,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      title={title}
    >
      {label}
    </button>
  );
});

ToolbarButton.displayName = 'ToolbarButton';
