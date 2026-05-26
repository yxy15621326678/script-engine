import React from 'react';

// 格式化图标（代码文档对齐样式）
export const FormatIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    {/* 文档轮廓 */}
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    {/* 代码行（长短交错表示对齐） */}
    <line x1="7" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="10.5" x2="17" y2="10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="17.5" x2="12" y2="17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
