import React from 'react';
import type { ScriptBindInfo, ScriptRequestInfo } from '../types';
import type { ThemeColors } from './theme-colors';
import { SectionHeader } from './section-header';
import { VariableRow } from './variable-row';

export interface VariablesSectionProps {
  sortedBinds: ScriptBindInfo[];
  sortedRequests: ScriptRequestInfo[];
  colors: ThemeColors;
}

export const VariablesSection: React.FC<VariablesSectionProps> = ({ sortedBinds, sortedRequests, colors }) => {
  if (sortedBinds.length === 0 && sortedRequests.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader colors={colors} label="变量" />
      {sortedBinds.map((bind) => (
        <VariableRow
          key={bind.name}
          name={bind.name}
          dataType={bind.dataType}
          description={bind.description}
          colors={colors}
        />
      ))}
      {sortedRequests.map((req) => (
        <VariableRow
          key={req.name}
          name={req.name}
          dataType={req.dataType}
          description={req.description}
          colors={colors}
        />
      ))}
    </div>
  );
};
