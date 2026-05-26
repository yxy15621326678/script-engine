import React, { useState } from 'react';
import type { ThemeColors } from './theme-colors';

export interface PanelHeaderProps {
  colors: ThemeColors;
  onCollapse: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ colors, onCollapse }) => {
  const [collapseHovered, setCollapseHovered] = useState(false);

  return (
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
  );
};
