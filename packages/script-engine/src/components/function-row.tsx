import React, { useState } from 'react';
import type { ScriptFunctionInfo } from '../types';
import type { ThemeColors } from './theme-colors';

export interface FunctionRowProps {
  func: ScriptFunctionInfo;
  colors: ThemeColors;
}

export const FunctionRow: React.FC<FunctionRowProps> = ({ func, colors }) => {
  const [hovered, setHovered] = useState(false);
  const params = func.parameters.map((p) => `${p.name}: ${p.dataType}`).join(', ');
  const sig = `${func.name}(${params})${func.returnType ? ` → ${func.returnType}` : ''}`;
  return (
    <div
      style={{
        padding: '4px 12px 4px 28px',
        cursor: 'default',
        backgroundColor: hovered ? colors.hover : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={func.description ? `${sig} — ${func.description}` : sig}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <span style={{ color: colors.methodColor, fontSize: 11, flexShrink: 0 }}>
          &#402;
        </span>
        <span style={{ color: colors.text, fontWeight: 500 }}>{func.name}</span>
        <span style={{ color: colors.textSecondary, fontSize: 11 }}>
          ({params})
        </span>
        {func.returnType && (
          <span style={{ color: colors.typeColor, fontSize: 11, marginLeft: 'auto' }}>
            → {func.returnType}
          </span>
        )}
      </div>
      {func.description && (
        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 16 }}>
          {func.description}
        </div>
      )}
    </div>
  );
};
