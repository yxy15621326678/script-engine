import React, { useState } from 'react';

export interface ExpandSidebarButtonProps {
  borderColor: string;
  expandBtnColor: string;
  expandBtnBg: string;
  onClick: () => void;
}

export const ExpandSidebarButton: React.FC<ExpandSidebarButtonProps> = ({
  borderColor,
  expandBtnColor,
  expandBtnBg,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 10,
        background: hovered ? expandBtnBg : 'transparent',
        border: `1px solid ${borderColor}`,
        color: expandBtnColor,
        cursor: 'pointer',
        fontSize: 12,
        padding: '3px 6px',
        borderRadius: 3,
        lineHeight: 1,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.2s, background 0.2s',
      }}
      title="展开属性面板"
    >
      属性面板 ◀
    </button>
  );
};
