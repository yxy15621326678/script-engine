import React from 'react';
import type { ThemeColors } from './theme-colors';

export interface SectionHeaderProps {
  colors: ThemeColors;
  label: string;
  /** 标题右侧的额外操作区域（如按钮、图标） */
  extra?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ colors, label, extra }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 12px 4px',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
      fontWeight: 600,
    }}
  >
    <span>{label}</span>
    {extra && <div style={{ display: 'flex', alignItems: 'center' }}>{extra}</div>}
  </div>
);
