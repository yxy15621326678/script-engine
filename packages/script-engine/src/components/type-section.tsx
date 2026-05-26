import React, { useState } from 'react';
import type { ScriptTypeInfo } from '../types';
import type { ThemeColors } from './theme-colors';
import { FieldRow } from './field-row';
import { FunctionRow } from './function-row';

export interface TypeSectionProps {
  typeInfo: ScriptTypeInfo;
  expanded: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}

export const TypeSection: React.FC<TypeSectionProps> = ({ typeInfo, expanded, onToggle, colors }) => {
  const [hovered, setHovered] = useState(false);
  const hasMembers = typeInfo.fields.length > 0 || typeInfo.functions.length > 0;

  return (
    <div>
      <div
        style={{
          padding: '5px 12px',
          cursor: hasMembers ? 'pointer' : 'default',
          userSelect: 'none',
          backgroundColor: hovered ? colors.hover : 'transparent',
        }}
        onClick={hasMembers ? onToggle : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={typeInfo.description || typeInfo.dataType}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{ fontSize: 10, width: 12, textAlign: 'center', flexShrink: 0 }}>
            {hasMembers ? (expanded ? '▼' : '▶') : ''}
          </span>
          <span style={{ color: colors.typeColor, fontWeight: 600 }}>
            {typeInfo.dataType}
          </span>
        </div>
        {typeInfo.description && (
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2, paddingLeft: 18 }}>
            {typeInfo.description}
          </div>
        )}
      </div>
      {expanded && (
        <div>
          {[...typeInfo.fields].sort((a, b) => a.name.localeCompare(b.name)).map((field) => (
            <FieldRow key={field.name} field={field} colors={colors} />
          ))}
          {[...typeInfo.functions].sort((a, b) => a.name.localeCompare(b.name)).map((func) => (
            <FunctionRow key={func.name} func={func} colors={colors} />
          ))}
        </div>
      )}
    </div>
  );
};
