import React from 'react';
import type { ThemeColors } from './theme-colors';

export interface VariableRowProps {
  name: string;
  dataType: string;
  description?: string;
  colors: ThemeColors;
}

export const VariableRow: React.FC<VariableRowProps> = ({ name, dataType, description, colors }) => (
  <div
    style={{
      padding: '4px 12px 4px 20px',
    }}
    title={`${name}: ${dataType}${description ? ` — ${description}` : ''}`}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ color: colors.accent, fontSize: 10 }}>&#9670;</span>
      <span style={{ color: colors.text, fontWeight: 500 }}>{name}</span>
      <span style={{ color: colors.typeColor, marginLeft: 'auto', fontSize: 11 }}>
        {dataType}
      </span>
    </div>
    {description && (
      <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
        {description}
      </div>
    )}
  </div>
);
