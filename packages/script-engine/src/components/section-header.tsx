import React from 'react';
import type { ThemeColors } from './theme-colors';

export interface SectionHeaderProps {
  colors: ThemeColors;
  label: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ colors, label }) => (
  <div
    style={{
      padding: '6px 12px 4px',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: colors.textSecondary,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);
