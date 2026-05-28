import React, { useState } from 'react';
import type { ToolbarButtonProps } from '../types';

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  title,
  backgroundColor,
  hoverBackgroundColor,
  textColor,
  borderColor,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: hovered ? hoverBackgroundColor : backgroundColor,
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
};
