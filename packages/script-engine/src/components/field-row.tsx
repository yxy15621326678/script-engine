import React, { useState } from 'react';
import type { ScriptFieldInfo } from '../types';
import type { ThemeColors } from './theme-colors';

export interface FieldRowProps {
  field: ScriptFieldInfo;
  colors: ThemeColors;
}

export const FieldRow: React.FC<FieldRowProps> = ({ field, colors }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        padding: '4px 12px 4px 28px',
        cursor: 'default',
        backgroundColor: hovered ? colors.hover : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={field.description ? `${field.name}: ${field.dataType} — ${field.description}` : `${field.name}: ${field.dataType}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <span style={{ color: colors.fieldColor, fontSize: 10, flexShrink: 0 }}>
          &#9671;
        </span>
        <span style={{ color: colors.text, fontWeight: 500 }}>{field.name}</span>
        <span style={{ color: colors.typeColor, fontSize: 11, marginLeft: 'auto' }}>
          {field.dataType}
        </span>
      </div>
      {field.description && (
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
          {field.description}
        </div>
      )}
    </div>
  );
};
