import React from 'react';
import type { ScriptMetadata } from '../types';
import type { ThemeColors } from './theme-colors';
import { SectionHeader } from './section-header';

export interface MainFunctionSectionProps {
  metadata: ScriptMetadata;
  colors: ThemeColors;
}

export const MainFunctionSection: React.FC<MainFunctionSectionProps> = ({ metadata, colors }) => {
  return (
    <div className="main-function-section">
      <SectionHeader colors={colors} label="主函数" />
      <div style={{ padding: '4px 12px 4px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ color: colors.methodColor, fontSize: 11, flexShrink: 0 }}>
            &#402;
          </span>
          <span style={{ color: colors.text, fontWeight: 500 }}>
            {metadata.mainMethod}
          </span>
          <span style={{ color: colors.textSecondary, fontSize: 11 }}>
            ({metadata.requests.map((r) => `${r.name}: ${r.dataType}`).join(', ')})
          </span>
          {metadata.returnType && (
            <span style={{ color: colors.typeColor, fontSize: 11, marginLeft: 'auto' }}>
              → {metadata.returnType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
