import React from 'react';
import type { ScriptTypeInfo } from '../types';
import type { ThemeColors } from './theme-colors';
import { SectionHeader } from './section-header';
import { TypeSection } from './type-section';

export interface DataTypesSectionProps {
  allTypes: ScriptTypeInfo[];
  expanded: Set<string>;
  onToggle: (typeName: string) => void;
  colors: ThemeColors;
}

export const DataTypesSection: React.FC<DataTypesSectionProps> = ({ allTypes, expanded, onToggle, colors }) => (
  <div style={{ marginTop: 4 }}>
    <SectionHeader colors={colors} label="数据类型" />
    {allTypes.length === 0 ? (
      <div
        style={{
          padding: '8px 20px',
          fontSize: 12,
          color: colors.textSecondary,
          fontStyle: 'italic',
        }}
      >
        暂无数据类型
      </div>
    ) : (
      allTypes.map((typeInfo) => (
        <TypeSection
          key={typeInfo.dataType}
          typeInfo={typeInfo}
          expanded={expanded.has(typeInfo.dataType)}
          onToggle={() => onToggle(typeInfo.dataType)}
          colors={colors}
        />
      ))
    )}
  </div>
);
