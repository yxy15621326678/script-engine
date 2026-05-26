import React, { useState } from 'react';

export interface ToolbarButtonProps {
  label: React.ReactNode;
  title: string;
  bg: string;
  hoverBg: string;
  color: string;
  border: string;
  onClick: () => void;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, title, bg, hoverBg, color, border, onClick }) => {
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
        background: hovered ? hoverBg : bg,
        border: `1px solid ${border}`,
        color,
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
